import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { karticaZaPosmatraca, naseljaIsteOpstine, opstinaZa } from "@/lib/jemstvo-kartica";

// GET /api/tabla-jemstva/feed — kandidati za prepoznavanje, poređani tako da
// prvi bude onaj koga posmatrač najverovatnije poznaje.
//
// Zid ostaje kao pregled, ali ovo je primarni ulaz: jedna kartica, jedno pitanje
// („Poznaješ li ovu osobu?"). Dostupno samo verifikovanim članovima.
//
// Rangiranje (opadajući prioritet):
//   1. ista opština i blisko godište (verovatno ista škola/generacija)
//   2. ista opština
//   3. ostalo — namerno se NE izbacuje, da feed u malim sredinama ne bude prazan
//
// ⚠️ Prazna polja NIKOGA ne izbacuju iz feed-a. Kartica bez mesta ili imena ide
// na kraj reda, ali ide — inače bi popunjenost polja postala prećutan uslov za
// verifikaciju, a nijedan podatak to ne sme da bude.
//
// Isključeni su samo: sopstveni zahtev, već odgovoreni, početni korisnici i
// svako ko je sa posmatračem u zabranjenoj zoni — koristi se POSTOJEĆI keš
// `verifikacionaZona` (isti izvor kao provera pri verifikaciji), bez nove logike.

const BLISKO_GODISTE = 7;
const MAX_KARTICA = 30;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json(
      { error: "Feed prepoznavanja dostupan je samo verifikovanim članovima." },
      { status: 403 }
    );

  const meId = session.user.id;

  const [ja, odgovoreni] = await Promise.all([
    prisma.user.findUnique({ where: { id: meId }, select: { location: true } }),
    prisma.prepoznavanje.findMany({ where: { korisnikId: meId }, select: { zahtevId: true } }),
  ]);

  // Godište posmatrača nije polje na nalogu — uzima se iz njegove SOPSTVENE
  // nekadašnje kartice (svaki verifikovan član je jednom bio neverifikovan).
  // Ako je nema, dimenzija godišta se prosto ne primenjuje.
  const mojaKartica = await prisma.zahtevZaJemstvo.findFirst({
    where: { userId: meId, godiste: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { godiste: true },
  });

  const mojeNaselje = ja?.location ?? null;
  const mojaOpstina = opstinaZa(mojeNaselje);
  const mojeGodiste = mojaKartica?.godiste ?? null;

  const kandidati = await prisma.zahtevZaJemstvo.findMany({
    where: {
      status: { in: ["AKTIVAN", "NEPOTPUN"] },
      expiresAt: { gt: new Date() },
      userId: { not: meId },
      id: { notIn: odgovoreni.map((o) => o.zahtevId) },
      user: { jeOsnivac: false },
    },
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
      createdAt: true,
      expiresAt: true,
      user: { select: { pseudonim: true } },
    },
  });

  if (kandidati.length === 0) return NextResponse.json({ kartice: [] });

  // Zabranjena zona, oba smera — isti upit koji koristi i zid.
  const ids = kandidati.map((k) => k.userId);
  const zonaParovi = await prisma.verifikacionaZona.findMany({
    where: {
      OR: [
        { userId: meId, forbiddenUserId: { in: ids } },
        { userId: { in: ids }, forbiddenUserId: meId },
      ],
    },
  });
  const uZoni = new Set<string>();
  for (const p of zonaParovi) uZoni.add(p.userId === meId ? p.forbiddenUserId : p.userId);

  const mojaOpstinaNaselja = new Set(mojeNaselje ? naseljaIsteOpstine(mojeNaselje) : []);

  const rangirani = kandidati
    .filter((k) => !uZoni.has(k.userId))
    .map((k) => {
      let skor = 0;
      const istaOpstina = mojaOpstina !== null && k.mesto !== null && mojaOpstinaNaselja.has(k.mesto);
      if (istaOpstina) {
        skor += 100;
        if (k.mesto === mojeNaselje) skor += 10; // isto naselje, ne samo opština
        if (
          mojeGodiste !== null &&
          k.godiste !== null &&
          Math.abs(k.godiste - mojeGodiste) <= BLISKO_GODISTE
        ) {
          skor += 50;
        }
      }
      return { k, skor };
    })
    .sort((a, b) => b.skor - a.skor || b.k.createdAt.getTime() - a.k.createdAt.getTime())
    .slice(0, MAX_KARTICA);

  return NextResponse.json({
    kartice: rangirani.map(({ k, skor }) => ({
      id: k.id,
      pseudonim: k.user.pseudonim,
      kartica: karticaZaPosmatraca(k, true),
      // Zašto je baš ova kartica ovde — da član razume redosled.
      blizina: skor >= 150 ? "mesto_generacija" : skor >= 100 ? "mesto" : "ostalo",
      expiresAt: k.expiresAt.toISOString(),
    })),
  });
}
