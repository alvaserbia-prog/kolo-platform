import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { proveriIEmitujBonusPrag } from "@/lib/banka/zadruga";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST — odobri pristupnicu (admin zadruge ili ADMIN)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; pristupnicaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id: zadrugaId, pristupnicaId } = await params;

  // Mora biti admin zadruge ili ADMIN sistema
  const isAdmin = session.user.role === "ADMIN";
  const isZadrugaAdmin = await prisma.zadrugaMembership.findFirst({
    where: { zadrugaId, userId: session.user.id, leftAt: null, isAdmin: true },
  });
  if (!isAdmin && !isZadrugaAdmin)
    return NextResponse.json({ error: "Nemaš pravo da odobriš pristupnicu." }, { status: 403 });

  const pristupnica = await prisma.zadrugaPristupnica.findUnique({
    where: { id: pristupnicaId },
  });
  if (!pristupnica || pristupnica.zadrugaId !== zadrugaId)
    return NextResponse.json({ error: "Pristupnica nije pronađena." }, { status: 404 });
  if (pristupnica.status !== "PENDING")
    return NextResponse.json({ error: "Pristupnica nije na čekanju." }, { status: 400 });

  // Čl. 28 — korisnik ne sme biti u drugoj zadruzi
  const vec = await prisma.zadrugaMembership.findFirst({
    where: { userId: pristupnica.userId, leftAt: null },
  });
  if (vec)
    return NextResponse.json({ error: "Korisnik je već član druge zadruge." }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.zadrugaMembership.create({
      data: { userId: pristupnica.userId, zadrugaId, isAdmin: false },
    });
    await tx.user.update({
      where: { id: pristupnica.userId },
      data: { role: "ZADRUGAR" },
    });
    await tx.zadrugaPristupnica.update({
      where: { id: pristupnicaId },
      data: { status: "APPROVED" },
    });
  });

  // Proveri bonus prag (van $transaction)
  await proveriIEmitujBonusPrag(zadrugaId);

  const zadruga = await prisma.zadruga.findUnique({ where: { id: zadrugaId }, select: { name: true } });
  await posaljiNotifikaciju(
    pristupnica.userId,
    "info",
    "Pristupnica prihvaćena!",
    `Postali ste član zadruge "${zadruga?.name ?? zadrugaId}".`,
    `/zajednica/${zadrugaId}`
  );

  return NextResponse.json({ ok: true });
}
