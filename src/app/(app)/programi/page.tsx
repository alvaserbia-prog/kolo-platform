import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { izracunajDnevniIznos, labelPrograma } from "@/lib/protokol/programi";
import { FUNKCIONALNI_PRAG_INDEKSA } from "@/lib/protokol/dokaz-stvarnosti";
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

  const [aktivniProgrami, enrollments, protokol, emisijaDanas, korisnik] = await Promise.all([
    prisma.protokolProgram.findMany({ where: { isActive: true } }),
    prisma.programEnrollment.findMany({ where: { userId: session.user.id } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
    prisma.dailyEmissionSummary.findFirst({ where: { date: danas } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { indeksStvarnosti: true } }),
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

  // Operativni doprinos (PED) nema enrollment — kartica vodi na zadatke (/doprinos-oglasi).
  const pedAktivan = aktivniTipovi.has("PED");
  const brojAktivnih = (pedAktivan ? 1 : 0) + programi.filter((p) => p.programAktivan).length;

  return (
    <ProgramiKlijent
      programi={programi}
      pedAktivan={pedAktivan}
      brojAktivnih={brojAktivnih}
      isVerified={session.user.verified}
      imaPristupProgramima={(korisnik?.indeksStvarnosti ?? 0) >= FUNKCIONALNI_PRAG_INDEKSA}
      emisioniKontekst={{
        opticaj,
        dnevniLimit,
        emitovanoAm: emisijaDanas?.totalEmitted ?? null,
        zahtevanoAm: emisijaDanas?.totalRequested ?? null,
      }}
    />
  );
}
