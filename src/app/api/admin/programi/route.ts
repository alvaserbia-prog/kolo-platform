import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgramType } from "@/generated/prisma/client";
import { labelPrograma } from "@/lib/protokol/programi";
import { jeAdmin, jeSuperadmin } from "@/lib/dozvole";

const SVI_TIPOVI: ProgramType[] = [
  "PED", "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE",
];

// GET /api/admin/programi — pregled svih programa + pending zahtevi
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return await greska("Pristup odbijen.", 403);

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

  // 🔴 Posebne kategorije podataka (datumi rođenja dece, datum rešenja o
  // invalidnosti, dob) idu ISKLJUČIVO superadminu. DPIA 5.6 kaže da su uneti podaci
  // „dostupni isključivo licu koje obrađuje prijavu u Fondaciji" — dok ih je video
  // svaki admin, tekst mere bio je uži od primene. Isti obrazac kao revizijski
  // dnevnik i nadzor, koji su i ranije bili zatvoreni za obične admine.
  const smeVidetiPodatke = jeSuperadmin(session.user);

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
      metadata: smeVidetiPodatke ? e.metadata : null,
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
