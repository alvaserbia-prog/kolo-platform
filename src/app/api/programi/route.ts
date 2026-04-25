import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { izracunajDnevniIznos, labelPrograma } from "@/lib/protokol/programi";
import { ProgramType } from "@/generated/prisma/client";

// GET /api/programi — status enrollmenta i aktivnih programa za korisnika
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [aktivniProgrami, enrollments, evidencijaToday] = await Promise.all([
    prisma.protokolProgram.findMany({ where: { isActive: true } }),
    prisma.programEnrollment.findMany({
      where: { userId: session.user.id },
    }),
    prisma.doprinosEvidencija.findFirst({
      where: { userId: session.user.id, date: danas },
    }),
  ]);

  const aktivniTipovi = new Set(aktivniProgrami.map((p) => p.type));

  const sviTipovi: ProgramType[] = [
    "PED", "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE",
  ];

  const rezultati = sviTipovi.map((type) => {
    const enrollment = enrollments.find((e) => e.type === type);
    const isActive = aktivniTipovi.has(type);
    let ocekivaniDnevni = 0;
    if (enrollment?.status === "ACTIVE") {
      ocekivaniDnevni = izracunajDnevniIznos(type, enrollment.metadata, enrollment.dailyAmount, danas);
    }
    return {
      type,
      label: labelPrograma(type),
      programAktivan: isActive,
      enrollment: enrollment
        ? {
            id: enrollment.id,
            status: enrollment.status,
            metadata: enrollment.metadata,
            dailyAmount: enrollment.dailyAmount,
            approvedAt: enrollment.approvedAt?.toISOString() ?? null,
            rejectionReason: enrollment.rejectionReason,
            ocekivaniDnevni,
          }
        : null,
    };
  });

  return NextResponse.json({ programi: rezultati, evidencijaToday: evidencijaToday
    ? {
        id: evidencijaToday.id,
        date: evidencijaToday.date.toISOString(),
        description: evidencijaToday.description,
        amount: evidencijaToday.amount,
        status: evidencijaToday.status,
      }
    : null,
  });
}
