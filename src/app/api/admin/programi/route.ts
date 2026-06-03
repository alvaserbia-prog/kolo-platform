import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgramType } from "@/generated/prisma/client";
import { labelPrograma } from "@/lib/protokol/programi";

const SVI_TIPOVI: ProgramType[] = [
  "PED", "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE",
];

// GET /api/admin/programi — pregled svih programa + pending zahtevi
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.tipKorisnika !== "POCETNI")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const [programi, pendingEnrollments, poslednjeEmisije] = await Promise.all([
    prisma.protokolProgram.findMany(),
    prisma.programEnrollment.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { pseudonim: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.dailyEmissionSummary.findMany({
      orderBy: { date: "desc" },
      take: 7,
    }),
  ]);

  const programiMap = new Map(programi.map((p) => [p.type, p]));

  return NextResponse.json({
    programi: SVI_TIPOVI.map((type) => ({
      type,
      label: labelPrograma(type),
      isActive: programiMap.get(type)?.isActive ?? false,
      activatedAt: programiMap.get(type)?.activatedAt?.toISOString() ?? null,
    })),
    pendingEnrollments: pendingEnrollments.map((e) => ({
      id: e.id,
      pseudonim: e.user.pseudonim,
      type: e.type,
      label: labelPrograma(e.type),
      metadata: e.metadata,
      createdAt: e.createdAt.toISOString(),
    })),
    poslednjeEmisije: poslednjeEmisije.map((s) => ({
      date: s.date.toISOString(),
      opticaj: s.opticaj,
      limit: s.limit,
      totalRequested: s.totalRequested,
      totalEmitted: s.totalEmitted,
      koeficijent: Number(s.koeficijent),
    })),
  });
}
