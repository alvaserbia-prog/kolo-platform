import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/zadruge/[id] — detalji zadruge
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const zadruga = await prisma.zadruga.findUnique({
    where: { id },
    include: {
      wallet: { select: { balance: true } },
      memberships: {
        where: { leftAt: null },
        include: { user: { select: { pseudonim: true } } },
        orderBy: { joinedAt: "asc" },
      },
      projects: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } },
      bonusLogs: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!zadruga) return NextResponse.json({ error: "Zadruga nije pronađena." }, { status: 404 });

  return NextResponse.json({ zadruga });
}

// POST /api/zadruge/[id]/istupanje
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;

  const membership = await prisma.zadrugaMembership.findFirst({
    where: { zadrugaId: id, userId: session.user.id, leftAt: null },
  });
  if (!membership)
    return NextResponse.json({ error: "Niste član ove zadruge." }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.zadrugaMembership.update({
      where: { id: membership.id },
      data: { leftAt: new Date() },
    });
    await tx.user.update({
      where: { id: session.user.id },
      data: { role: "FIZICKO_LICE" },
    });
  });

  return NextResponse.json({ ok: true });
}
