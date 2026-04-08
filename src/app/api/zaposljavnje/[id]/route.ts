import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/zaposljavnje/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id } = await params;

  const oglas = await prisma.radniOglas.findUnique({
    where: { id },
    include: {
      createdBy: { select: { pseudonim: true } },
      zadruga: { select: { name: true } },
      prijave: {
        where: { userId: session.user.id },
        select: { id: true, status: true, rejectionReason: true, createdAt: true },
      },
      evidencije: {
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        take: 30,
        select: { id: true, date: true, hoursWorked: true, amount: true, description: true, status: true },
      },
      _count: { select: { prijave: { where: { status: "APPROVED" } } } },
    },
  });

  if (!oglas) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });

  return NextResponse.json({
    oglas: {
      id: oglas.id,
      title: oglas.title,
      description: oglas.description,
      source: oglas.source,
      hourlyRate: oglas.hourlyRate,
      maxHoursPerDay: oglas.maxHoursPerDay,
      positions: oglas.positions,
      deadline: oglas.deadline?.toISOString() ?? null,
      status: oglas.status,
      createdByPseudonim: oglas.createdBy.pseudonim,
      zadrugaName: oglas.zadruga?.name ?? null,
      odobreniClanovi: oglas._count.prijave,
      createdAt: oglas.createdAt.toISOString(),
      mojaPrijava: oglas.prijave[0]
        ? { id: oglas.prijave[0].id, status: oglas.prijave[0].status, rejectionReason: oglas.prijave[0].rejectionReason, createdAt: oglas.prijave[0].createdAt.toISOString() }
        : null,
      mojneEvidencije: oglas.evidencije.map((e) => ({
        id: e.id,
        date: e.date.toISOString(),
        hoursWorked: e.hoursWorked,
        amount: e.amount,
        description: e.description,
        status: e.status,
      })),
    },
  });
}
