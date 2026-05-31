import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { izracunajDnevniIznos, labelPrograma } from "@/lib/protokol/programi";
import { ProgramType } from "@/generated/prisma/client";
import ProgramiKlijent from "./ProgramiKlijent";

// PED (operativni doprinos) ide kroz zadatke (/doprinos-oglasi), ne kroz enrollment.
const SVI_TIPOVI: ProgramType[] = [
  "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE",
];

export default async function ProgramiPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [aktivniProgrami, enrollments, protokol, emisijaDanas] = await Promise.all([
    prisma.protokolProgram.findMany({ where: { isActive: true } }),
    prisma.programEnrollment.findMany({ where: { userId: session.user.id } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
    prisma.dailyEmissionSummary.findFirst({ where: { date: danas } }),
  ]);

  const aktivniTipovi = new Set(aktivniProgrami.map((p) => p.type));

  const programi = SVI_TIPOVI.map((type) => {
    const enrollment = enrollments.find((e) => e.type === type);
    let ocekivaniDnevni = 0;
    if (enrollment?.status === "ACTIVE") {
      ocekivaniDnevni = izracunajDnevniIznos(type, enrollment.metadata, enrollment.dailyAmount, danas);
    }
    return {
      type,
      label: labelPrograma(type),
      programAktivan: aktivniTipovi.has(type),
      enrollment: enrollment
        ? {
            id: enrollment.id,
            status: enrollment.status,
            metadata: enrollment.metadata as Record<string, unknown> | null,
            dailyAmount: enrollment.dailyAmount,
            approvedAt: enrollment.approvedAt?.toISOString() ?? null,
            rejectionReason: enrollment.rejectionReason,
            ocekivaniDnevni,
          }
        : null,
    };
  });

  const opticaj = protokol ? Math.abs(protokol.balance) : 0;
  const dnevniLimit = Math.floor(opticaj * 0.1);

  return (
    <ProgramiKlijent
      programi={programi}
      isVerified={session.user.verified}
      isKrugr={session.user.role === "CLAN_KRUGA" || session.user.role === "ADMIN"}
      protokolBalance={protokol?.balance ?? 0}
      emisioniKontekst={{
        opticaj,
        dnevniLimit,
        emitovanoAm: emisijaDanas?.totalEmitted ?? null,
        zahtevanoAm: emisijaDanas?.totalRequested ?? null,
      }}
    />
  );
}
