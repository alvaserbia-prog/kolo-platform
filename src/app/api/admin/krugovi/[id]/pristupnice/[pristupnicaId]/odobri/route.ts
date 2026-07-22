import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { proveriIEmitujBonusPrag } from "@/lib/protokol/krug";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

// POST — odobri pristupnicu (admin krugovi ili ADMIN)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; pristupnicaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id: krugId, pristupnicaId } = await params;

  // Mora biti admin krugovi ili ADMIN sistema
  const isAdmin = jeAdmin(session.user);
  const isKrugAdmin = await prisma.krugClanstvo.findFirst({
    where: { krugId, userId: session.user.id, leftAt: null, isAdmin: true },
  });
  if (!isAdmin && !isKrugAdmin)
    return NextResponse.json({ error: "Nemaš pravo da odobriš pristupnicu." }, { status: 403 });

  const pristupnica = await prisma.krugPristupnica.findUnique({
    where: { id: pristupnicaId },
  });
  if (!pristupnica || pristupnica.krugId !== krugId)
    return NextResponse.json({ error: "Pristupnica nije pronađena." }, { status: 404 });
  if (pristupnica.status !== "PENDING")
    return NextResponse.json({ error: "Pristupnica nije na čekanju." }, { status: 400 });

  // Čl. 28 — korisnik ne sme biti u drugoj zadruzi
  const vec = await prisma.krugClanstvo.findFirst({
    where: { userId: pristupnica.userId, leftAt: null },
  });
  if (vec)
    return NextResponse.json({ error: "Korisnik je već član druge krugovi." }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.krugClanstvo.create({
      data: { userId: pristupnica.userId, krugId, isAdmin: false },
    });
    await tx.krugPristupnica.update({
      where: { id: pristupnicaId },
      data: { status: "APPROVED" },
    });
  });

  // Proveri bonus prag (van $transaction)
  await proveriIEmitujBonusPrag(krugId);

  const krug = await prisma.krug.findUnique({ where: { id: krugId }, select: { name: true } });

  await logAdminAkcija(session.user.id, "KRUG_PRISTUPNICA_ODOBRENA", pristupnica.userId,
    krug?.name ?? krugId);

  await posaljiNotifikaciju(
    pristupnica.userId,
    "info",
    "Pristupnica prihvaćena!",
    `Postali ste član krugovi "${krug?.name ?? krugId}".`,
    `/krug/${krugId}`
  );

  return NextResponse.json({ ok: true });
}
