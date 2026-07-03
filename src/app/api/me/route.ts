import { NextResponse } from "next/server";
import { sesija } from "@/lib/sesija";
import { prisma } from "@/lib/prisma";
import { mozeNadzor } from "@/lib/dozvole";
import { izracunajDnevniBrojeve, izracunajNadzorBroj } from "@/lib/chrome-podaci";

/**
 * GET /api/me — KONSOLIDOVAN endpoint za ceo „chrome" (Header + Sidebar).
 *
 * Ranije je svaka navigacija palila ~6 odvojenih API poziva (balans, dnevni-
 * brojevi, nadzor, poruke/brojac, notifikacije, politika), svaki kao zasebna
 * serverless invokacija sa svojom proverom sesije. Ovde se sve to računa u
 * JEDNOM zahtevu, sa upitima u paraleli. Klijent (`MeProvider`) ovo zove jednom
 * pri mountu i potom na 30s poll, umesto šest nezavisnih fetch-eva.
 */
export async function GET() {
  const session = await sesija();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const meId = session.user.id;
  const nadzornik = mozeNadzor(session.user);
  const sada = new Date();

  const [
    wallet,
    user,
    neprocitanoPoruke,
    notifikacije,
    notifNeprocitano,
    najnovijaPolitika,
    dnevniBrojevi,
    nadzorBroj,
  ] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: meId }, select: { balance: true } }),
    prisma.user.findUnique({ where: { id: meId }, select: { avatar: true } }),
    prisma.poruka.count({
      where: {
        procitana: false,
        posiljacId: { not: meId },
        konverzacija: { OR: [{ user1Id: meId }, { user2Id: meId }] },
      },
    }),
    prisma.notifikacija.findMany({
      where: { userId: meId },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, tip: true, naslov: true, tekst: true, procitana: true, link: true, createdAt: true },
    }),
    prisma.notifikacija.count({ where: { userId: meId, procitana: false } }),
    prisma.politikaVerzija.findFirst({
      where: { efektivnaOd: { lte: sada } },
      orderBy: { efektivnaOd: "desc" },
      select: { id: true },
    }),
    // Badge brojevi se računaju za sve prijavljene: i neverifikovani vide
    // „Početna" (nove poruke u Pričaonici + objave Fondacije), Novčanik i Pijaca.
    izracunajDnevniBrojeve(meId, session.user),
    nadzornik ? izracunajNadzorBroj(meId, session.user) : Promise.resolve(0),
  ]);

  // Politika: potrebna ako postoji aktivna verzija koju korisnik nije prihvatio.
  let politikaPotrebno = false;
  if (najnovijaPolitika) {
    const prihvaceno = await prisma.politikaPrihvatanje.findUnique({
      where: { userId_verzijaId: { userId: meId, verzijaId: najnovijaPolitika.id } },
      select: { prihvacen: true },
    });
    politikaPotrebno = !prihvaceno;
  }

  return NextResponse.json({
    balance: wallet?.balance ?? 0,
    avatar: user?.avatar ?? null,
    neprocitanoPoruke,
    notifikacije,
    notifNeprocitano,
    dnevniBrojevi,
    nadzorBroj,
    politikaPotrebno,
  });
}
