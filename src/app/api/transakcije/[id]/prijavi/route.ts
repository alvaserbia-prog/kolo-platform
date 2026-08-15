import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { smePrijaviti } from "@/lib/razmena-prijava";

/**
 * POST /api/transakcije/[id]/prijavi  { opis }
 *
 * Prijava da razmena povodom prepisa nije ispunjena.
 *
 * Prijavljuje isključivo POŠILJALAC — samo on je nešto izgubio. Prijava ne
 * poništava prepis sama od sebe: odlučuje Fondacija (admin tab „Razmene"), a
 * poništenje je moguće samo do visine onoga što je na zapisu primaoca ostalo
 * (Pravilnik čl. 14 — nema negativnog zapisa).
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const opis = typeof body.opis === "string" ? body.opis : "";

  const transakcija = await prisma.transaction.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      amount: true,
      createdAt: true,
      fromWallet: { select: { userId: true, user: { select: { pseudonim: true } } } },
      toWallet: { select: { userId: true, user: { select: { pseudonim: true } } } },
      prijavaRazmene: { select: { id: true } },
    },
  });
  if (!transakcija) return await greska("Prepis ne postoji.", 404);

  const [otvorenihPrijava] = await Promise.all([
    prisma.prijavaRazmene.count({
      where: { prijaviocId: session.user.id, status: "OTVORENA" },
    }),
  ]);

  const provera = smePrijaviti({
    tipTransakcije: transakcija.type,
    posiljaocId: transakcija.fromWallet?.userId ?? null,
    prijaviocId: session.user.id,
    vecPrijavljena: transakcija.prijavaRazmene !== null,
    otvorenihPrijava,
    opis,
  });
  if (!provera.ok) return await greska(provera.razlog, 400);

  const protivId = transakcija.toWallet?.userId;
  if (!protivId) return await greska("Druga strana nema zapis u Protokolu.", 400);

  const prijava = await prisma.prijavaRazmene.create({
    data: {
      transakcijaId: transakcija.id,
      prijaviocId: session.user.id,
      protivId,
      opis: opis.trim(),
    },
  });

  // Bez javljanja bi red čekanja postojao a niko ne bi znao da postoji — isti
  // razlog zbog kog se javlja i za prve oglase.
  void posaljiAdminAlert(
    "Prijava neispunjene razmene",
    `${transakcija.fromWallet?.user?.pseudonim ?? "?"} prijavljuje prepis od ${transakcija.amount} POEN ka ${transakcija.toWallet?.user?.pseudonim ?? "?"}.\n\n` +
      `Opis: ${opis.trim()}\n\nAdmin → tab „Razmene".`,
  );

  return NextResponse.json({ ok: true, id: prijava.id });
}
