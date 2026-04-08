import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { labelPrograma } from "@/lib/banka/programi";

// POST /api/admin/programi/enrollments/[id]/odobri
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;

  const enrollment = await prisma.programEnrollment.findUnique({ where: { id } });
  if (!enrollment) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (enrollment.status !== "PENDING")
    return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const dailyAmount = body.dailyAmount ? Number(body.dailyAmount) : undefined;

  await prisma.programEnrollment.update({
    where: { id },
    data: {
      status: "ACTIVE",
      approvedById: session.user.id,
      approvedAt: new Date(),
      ...(dailyAmount != null ? { dailyAmount } : {}),
      // Za SKOLOVANJE: reverifikacija za 6 meseci
      ...(enrollment.type === "SKOLOVANJE"
        ? { nextReverifikacija: new Date(Date.now() + 183 * 24 * 60 * 60 * 1000) }
        : {}),
    },
  });

  await posaljiNotifikaciju(
    enrollment.userId,
    "info",
    `Prijava na program odobrena`,
    `Vaša prijava na program "${labelPrograma(enrollment.type)}" je odobrena.`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
