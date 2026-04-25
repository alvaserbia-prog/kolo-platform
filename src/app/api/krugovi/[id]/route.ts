import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/krugovi/[id] — detalji krugovi
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const krug = await prisma.krug.findUnique({
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

  if (!krug) return NextResponse.json({ error: "Krug nije pronađena." }, { status: 404 });

  return NextResponse.json({ krug });
}

// POST /api/krugovi/[id]/istupanje
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;

  const membership = await prisma.krugClanstvo.findFirst({
    where: { krugId: id, userId: session.user.id, leftAt: null },
  });
  if (!membership)
    return NextResponse.json({ error: "Niste član ove krugovi." }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.krugClanstvo.update({
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
