import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { sesija } from "@/lib/sesija";
import { prisma } from "@/lib/prisma";
import { mozeNadzor } from "@/lib/dozvole";
import { izracunajDnevniBrojeve, izracunajNadzorBroj } from "@/lib/chrome-podaci";
import { pristanakStatus } from "@/lib/politika";
import { uMirovanju } from "@/lib/protokol/deca";

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
  if (!session) return await greska("Unauthorized", 401);

  const meId = session.user.id;
  const verified = session.user.verified;
  const nadzornik = mozeNadzor(session.user);

  const [
    wallet,
    user,
    neprocitanoPoruke,
    notifikacije,
    notifNeprocitano,
    pristanak,
    dnevniBrojevi,
    nadzorBroj,
  ] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: meId }, select: { balance: true } }),
    prisma.user.findUnique({
      where: { id: meId },
      select: { avatar: true, vodicVidjenAt: true, maloletan: true },
    }),
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
    // Isti izvor istine kao `GET /api/politika/prihvati` — dva odvojena upita su
    // umela da se raziđu, pa je ekran za pristanak bljesnuo i odmah nestao.
    pristanakStatus(meId),
    // Badge brojevi su relevantni samo za verifikovane (sidebar „Zajedničko dobro").
    verified ? izracunajDnevniBrojeve(meId, session.user) : Promise.resolve(null),
    nadzornik ? izracunajNadzorBroj(meId, session.user) : Promise.resolve(0),
  ]);

  return NextResponse.json({
    balance: wallet?.balance ?? 0,
    avatar: user?.avatar ?? null,
    neprocitanoPoruke,
    notifikacije,
    notifNeprocitano,
    dnevniBrojevi,
    nadzorBroj,
    politikaPotrebno: pristanak.potrebno,
    // Prva prijava naloga koji vodič još nije video vodi na `/dobrodosli`
    // (obrazac prijave to čita; vidi `LoginForm`).
    vodicPotreban: user?.vodicVidjenAt == null,
    // Modul Deca — navigacija maloletnog korisnika je uža, a nalog u mirovanju
    // (čl. 16) ne radi dok stvarnost roditelja ne bude ponovo potvrđena.
    maloletan: user?.maloletan ?? false,
    mirovanje: await uMirovanju(meId),
  });
}
