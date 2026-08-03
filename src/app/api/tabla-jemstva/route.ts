import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  TRAJANJE_DANA,
  validirajKarticu,
  karticaZaPosmatraca,
  jeKompletnaZaFeed,
  nedostajeZaFeed,
} from "@/lib/jemstvo-kartica";

// GET /api/tabla-jemstva — zid: aktivne kartice (samo prijavljeni).
//
// Vidljivost je gradirana (Pravilnik čl. 28–30, 67; Politika čl. 6):
//   verifikovan član → puna kartica
//   neverifikovan    → inicijali, mesto, decenija rođenja
// Telefon i link se NIKAD ne vraćaju ovde (telefon vidi samo UO; link tek onaj
// ko je potvrdio prepoznavanje — vidi /[id]/prepoznajem).
//
// Za posmatrača-verifikatora svaka kartica nosi i `verifikacijaBlokirana`
// ("zona" | "pocetni" | null): tabla ne sme da nudi kao mete korisnike iz
// zabranjene zone posmatrača (u oba smera) ni početne korisnike (čl. 12 i 14
// dokaza stvarnosti, v3.9.2). Server je i dalje merodavan — POST verifikuj
// ponavlja iste provere nad izvorom istine.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const zahtevi = await prisma.zahtevZaJemstvo.findMany({
    where: { status: { in: ["AKTIVAN", "NEPOTPUN"] }, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      ime: true,
      prezime: true,
      godiste: true,
      mesto: true,
      nadimak: true,
      cimeSeBavi: true,
      legacyTekst: true,
      status: true,
      createdAt: true,
      expiresAt: true,
      user: { select: { pseudonim: true, jeOsnivac: true } },
    },
  });

  // Zabranjena zona posmatrača, oba smera (keš tabela verification_zone).
  const podnosioci = zahtevi.map((z) => z.userId);
  const zonaParovi =
    podnosioci.length > 0
      ? await prisma.verifikacionaZona.findMany({
          where: {
            OR: [
              { userId: session.user.id, forbiddenUserId: { in: podnosioci } },
              { userId: { in: podnosioci }, forbiddenUserId: session.user.id },
            ],
          },
        })
      : [];
  const uZoni = new Set<string>();
  for (const p of zonaParovi) {
    uZoni.add(p.userId === session.user.id ? p.forbiddenUserId : p.userId);
  }

  return NextResponse.json({
    mojeVerifikovan: session.user.verified,
    zahtevi: zahtevi.map((z) => {
      const moj = z.userId === session.user.id;
      // Vlasnik uvek vidi svoju karticu u punom obliku.
      const kartica = karticaZaPosmatraca(z, session.user.verified || moj);
      return {
        id: z.id,
        pseudonim: z.user.pseudonim,
        kartica,
        nepotpuna: z.status === "NEPOTPUN",
        uFeedu: jeKompletnaZaFeed(z),
        nedostaje: moj ? nedostajeZaFeed(z) : [],
        createdAt: z.createdAt.toISOString(),
        expiresAt: z.expiresAt.toISOString(),
        mojZahtev: moj,
        verifikacijaBlokirana: z.user.jeOsnivac
          ? ("pocetni" as const)
          : uZoni.has(z.userId)
            ? ("zona" as const)
            : null,
      };
    }),
  });
}

// POST /api/tabla-jemstva — objavi karticu prepoznavanja (samo neverifikovani;
// jedan aktivan zahtev). Sva polja kartice su opciona; proverava se ispravnost
// unetog, ne popunjenost. Kartica bez imena i mesta stoji na zidu, ali je sistem
// ne dovodi nikome u feed.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (session.user.verified)
    return NextResponse.json(
      { error: "Već ste verifikovani — tabla je namenjena neverifikovanim korisnicima." },
      { status: 403 }
    );

  const body = await req.json().catch(() => ({}));
  if (body.pristanak !== true)
    return NextResponse.json({ error: "Morate dati saglasnost za objavljivanje." }, { status: 400 });

  const provera = validirajKarticu(body);
  if (!provera.ok) return NextResponse.json({ error: provera.greska }, { status: 400 });
  const kartica = provera.kartica;

  const postoji = await prisma.zahtevZaJemstvo.findFirst({
    where: { userId: session.user.id, status: { in: ["AKTIVAN", "NEPOTPUN"] } },
    select: { id: true },
  });
  if (postoji)
    return NextResponse.json(
      { error: "Već imate aktivan zahtev. Povucite ga pre objave novog." },
      { status: 409 }
    );

  const expiresAt = new Date(Date.now() + TRAJANJE_DANA * 24 * 60 * 60 * 1000);

  const zahtev = await prisma.zahtevZaJemstvo.create({
    data: { userId: session.user.id, ...kartica, expiresAt },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: zahtev.id });
}

// PATCH /api/tabla-jemstva — dopuni sopstvenu karticu (bez ponovne objave).
// Služi vlasniku legacy (NEPOTPUN) kartice i svakome ko želi da doda podatak.
// Rok isteka se NE produžava dopunom — inače bi kartica mogla da stoji večno.
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const provera = validirajKarticu(body);
  if (!provera.ok) return NextResponse.json({ error: provera.greska }, { status: 400 });
  const kartica = provera.kartica;

  const moj = await prisma.zahtevZaJemstvo.findFirst({
    where: { userId: session.user.id, status: { in: ["AKTIVAN", "NEPOTPUN"] } },
    select: { id: true },
  });
  if (!moj) return NextResponse.json({ error: "Nemate aktivan zahtev." }, { status: 404 });

  await prisma.zahtevZaJemstvo.update({
    where: { id: moj.id },
    data: {
      ...kartica,
      // Dopunjena kartica prestaje da bude legacy — vraća se u redovan tok.
      status: "AKTIVAN",
    },
  });

  return NextResponse.json({ ok: true, id: moj.id });
}
