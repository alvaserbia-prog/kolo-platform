import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { labelPrograma, danaDoReverifikacije } from "@/lib/protokol/programi";

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

  // Tvrda blokada (anti-malverzacija, Pravilnik o programima podrške čl. 4):
  // svi verifikatori moraju da potvrde pre nego što Fondacija može da odobri.
  const ukupnoPotvrda = await prisma.programPotvrda.count({ where: { enrollmentId: id } });
  const nepotvrdjeno = await prisma.programPotvrda.count({
    where: { enrollmentId: id, status: { not: "POTVRDJENO" } },
  });
  if (ukupnoPotvrda === 0 || nepotvrdjeno > 0)
    return NextResponse.json(
      {
        error: `Nije moguće odobriti — ${nepotvrdjeno} od ${ukupnoPotvrda} verifikatora još nije potvrdilo.`,
      },
      { status: 409 }
    );

  const body = await req.json().catch(() => ({}));
  const dailyAmount = body.dailyAmount ? Number(body.dailyAmount) : undefined;

  // Reverifikacija statusa (Pravilnik o programima podrške čl. 12/13).
  const danaDoRevizije = danaDoReverifikacije(enrollment.type);
  const nextReverifikacija =
    danaDoRevizije != null
      ? new Date(Date.now() + danaDoRevizije * 24 * 60 * 60 * 1000)
      : undefined;

  await prisma.programEnrollment.update({
    where: { id },
    data: {
      status: "ACTIVE",
      approvedById: session.user.id,
      approvedAt: new Date(),
      ...(dailyAmount != null ? { dailyAmount } : {}),
      ...(nextReverifikacija ? { nextReverifikacija } : {}),
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
