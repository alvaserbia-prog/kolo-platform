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
  if (!session.user.verified) return NextResponse.json({ error: "Verifikacija potrebna." }, { status: 403 });

  const { id } = await params;

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
      role: true,
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
          prikaziRangPreporuka: true,
          prikaziRangDonacija: true,
          prikaziOglase: true,
        },
      },
      zadrugaMemberships: {
        where: { leftAt: null },
        include: { zadruga: { select: { id: true, name: true } } },
        take: 1,
      },
      wallet: { select: { id: true, balance: true } },
      zrnoStanje: { select: { slobodno: true, aktivno: true } },
    },
  });

  if (!korisnik || korisnik.status === "EXCLUDED" || korisnik.role === "ADMIN") {
    return NextResponse.json({ error: "Profil nije pronađen." }, { status: 404 });
  }

  const podaci = korisnik.podaci;
  const zadruga = korisnik.zadrugaMemberships[0]?.zadruga ?? null;

  // Rangovi preporuka i donacija
  let rangPreporuka: number | null = null;
  let rangDonacija: number | null = null;

  if (podaci?.prikaziRangPreporuka) {
    const sviPreporucioci = await prisma.referral.groupBy({
      by: ["referrerId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const idx = sviPreporucioci.findIndex((r) => r.referrerId === id);
    if (idx !== -1) rangPreporuka = idx + 1;
  }

  if (podaci?.prikaziRangDonacija) {
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
  const transakcije = await prisma.transaction.findMany({
    where: {
      OR: [{ fromWalletId: korisnik.wallet?.id }, { toWalletId: korisnik.wallet?.id }],
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
  });

  const imaJos = transakcije.length === 11;
  const transakcijeSlice = imaJos ? transakcije.slice(0, 10) : transakcije;
  const nextCursor = imaJos ? transakcijeSlice[9].id : null;

  // Oglasi
  let oglasi: { id: string; title: string; price: number; category: string; createdAt: Date }[] = [];
  if (podaci?.prikaziOglase) {
    oglasi = await prisma.marketplaceListing.findMany({
      where: { sellerId: id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, price: true, category: true, createdAt: true },
    });
  }

  return NextResponse.json({
    id: korisnik.id,
    pseudonim: korisnik.pseudonim,
    verified: korisnik.verified,
    verifiedAt: korisnik.verifiedAt,
    status: korisnik.status,
    avatar: korisnik.avatar,
    createdAt: korisnik.createdAt,
    zadruga,
    // Opcioni podaci
    lokacija: podaci?.prikaziLokaciju ? korisnik.location : null,
    opis: podaci?.prikaziOpis ? podaci.opis : null,
    punoIme: podaci?.prikaziPunoIme ? podaci.punoIme : null,
    telefon: podaci?.prikaziTelefon ? korisnik.telefon : null,
    bilans: podaci?.prikaziBilans ? (korisnik.wallet?.balance ?? 0) : null,
    zrno: podaci?.prikaziZrno
      ? (korisnik.zrnoStanje ? korisnik.zrnoStanje.slobodno + korisnik.zrnoStanje.aktivno : 0)
      : null,
    rangPreporuka,
    rangDonacija,
    transakcije: transakcijeSlice,
    nextCursor,
    oglasi: podaci?.prikaziOglase ? oglasi : [],
  });
}
