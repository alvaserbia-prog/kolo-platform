import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;

  // Kapija "samo verifikovani vide profile" odnosi se na TUĐE profile (Pravilnik čl. 28–30,
  // 67): neverifikovan ne vidi pseudonime/profile drugih. Sopstveni profil korisnik uvek
  // sme da vidi — inače bi klik na "Moj profil" blokirao i njega samog.
  if (!session.user.verified && id !== session.user.id) {
    return NextResponse.json({ error: "Verifikacija potrebna." }, { status: 403 });
  }

  // Vlasnik na sopstvenom profilu vidi SVE svoje podatke bez obzira na togglove
  // vidljivosti; togglovi i dalje važe za druge posetioce.
  const jeVlasnik = id === session.user.id;

  const korisnik = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      pseudonim: true,
      verified: true,
      verifiedAt: true,
      location: true,
      telefon: true,
      avatar: true,
      createdAt: true,
      tipKorisnika: true,
      status: true,
      podaci: {
        select: {
          punoIme: true,
          opis: true,
          prikaziLokaciju: true,
          prikaziOpis: true,
          prikaziPunoIme: true,
          prikaziTelefon: true,
          prikaziBilans: true,
          prikaziZrno: true,
          prikaziRangDonacija: true,
          prikaziOglase: true,
        },
      },
      krugClanstva: {
        where: { leftAt: null },
        include: { krug: { select: { id: true, name: true } } },
        take: 1,
      },
      wallet: { select: { id: true, balance: true } },
      zrnoStanje: { select: { slobodno: true, aktivno: true } },
    },
  });

  if (!korisnik || korisnik.status === "EXCLUDED") {
    return NextResponse.json({ error: "Profil nije pronađen." }, { status: 404 });
  }

  const podaci = korisnik.podaci;
  const krug = korisnik.krugClanstva[0]?.krug ?? null;

  // Rang donacija — uvek vidljiv
  let rangDonacija: number | null = null;

  {
    const sviDonatori = await prisma.donationRecord.groupBy({
      by: ["userId"],
      where: { status: "CONFIRMED" },
      _sum: { poenEmitted: true },
      orderBy: { _sum: { poenEmitted: "desc" } },
    });
    const idx = sviDonatori.findIndex((d) => d.userId === id);
    if (idx !== -1) rangDonacija = idx + 1;
  }

  // Transakcije — uvek prikazujemo, poslednjih 10
  const { cursor } = Object.fromEntries(req.nextUrl.searchParams);
  const walletId = korisnik.wallet?.id ?? null;
  const transakcije = walletId ? await prisma.transaction.findMany({
    where: {
      OR: [{ fromWalletId: walletId }, { toWalletId: walletId }],
    },
    orderBy: { createdAt: "desc" },
    take: 11,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: {
      id: true,
      amount: true,
      type: true,
      description: true,
      createdAt: true,
      fromWallet: { select: { user: { select: { id: true, pseudonim: true } } } },
      toWallet: { select: { user: { select: { id: true, pseudonim: true } } } },
    },
  }) : [];

  const imaJos = transakcije.length === 11;
  const transakcijeSlice = imaJos ? transakcije.slice(0, 10) : transakcije;
  const nextCursor = imaJos ? transakcijeSlice[9].id : null;

  // V3: neverifikovan korisnik (na sopstvenom profilu — jedini koji ovde dospeva bez
  // punog pristupa) sme da vidi iznose/vremena, ali NE pseudonime druge strane ni
  // stanje računa (Pravilnik čl. 28–30, 67). Maskiramo protivstranu i izostavljamo bilans.
  const punPristup = session.user.verified;
  const transakcijeIzlaz = punPristup
    ? transakcijeSlice
    : transakcijeSlice.map((t) => ({
        ...t,
        fromWallet: { user: null },
        toWallet: { user: null },
      }));

  // Oglasi — uvek vidljivi
  const oglasi = await prisma.marketplaceListing.findMany({
    where: { sellerId: id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, title: true, price: true, category: true, createdAt: true },
  });

  return NextResponse.json({
    id: korisnik.id,
    pseudonim: korisnik.pseudonim,
    verified: korisnik.verified,
    verifiedAt: korisnik.verifiedAt,
    status: korisnik.status,
    avatar: korisnik.avatar,
    createdAt: korisnik.createdAt,
    krug,
    // Opcioni podaci
    lokacija: (jeVlasnik || podaci?.prikaziLokaciju) ? korisnik.location : null,
    opis: (jeVlasnik || podaci?.prikaziOpis) ? podaci?.opis ?? null : null,
    punoIme: (jeVlasnik || podaci?.prikaziPunoIme) ? podaci?.punoIme ?? null : null,
    telefon: (jeVlasnik || podaci?.prikaziTelefon) ? korisnik.telefon : null,
    // POEN balans, ZRNO, rang donacija i oglasi su uvek vidljivi (ne podležu togglu)
    // — osim za neverifikovanog na sopstvenom profilu, kome se stanje računa ne prikazuje (V3).
    bilans: punPristup ? (korisnik.wallet?.balance ?? 0) : null,
    zrno: korisnik.zrnoStanje ? korisnik.zrnoStanje.slobodno + korisnik.zrnoStanje.aktivno : 0,
    rangDonacija,
    transakcije: transakcijeIzlaz,
    nextCursor,
    oglasi,
  });
}
