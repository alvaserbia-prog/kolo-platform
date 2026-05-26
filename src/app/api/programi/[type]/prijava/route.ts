import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgramType } from "@/generated/prisma/client";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { imaFunkcionalniPristup } from "@/lib/protokol/pristup";

const DOZVOLJENI_TIPOVI: ProgramType[] = [
  "PED", "PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE",
];

// POST /api/programi/[type]/prijava — prijava na program
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Mora biti verifikovan." }, { status: 403 });
  if (!(await imaFunkcionalniPristup(session.user.id)))
    return NextResponse.json({ error: "Potreban je indeks stvarnosti od najmanje 10%." }, { status: 403 });

  const { type } = await params;
  if (!DOZVOLJENI_TIPOVI.includes(type as ProgramType))
    return NextResponse.json({ error: "Nepoznat tip programa." }, { status: 400 });

  const programType = type as ProgramType;

  // Proveri da program postoji i da je aktivan
  const program = await prisma.protokolProgram.findUnique({ where: { type: programType } });
  if (!program?.isActive)
    return NextResponse.json({ error: "Program nije aktivan." }, { status: 400 });

  // Krugr check za programe koji zahtevaju krugrski status
  const krugrskaProvera = ["PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE"];
  if (krugrskaProvera.includes(programType) && session.user.role !== "CLAN_KRUGA" && session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Ovaj program je dostupan samo krugrsima." }, { status: 403 });

  // Proveri duplikat
  const vec = await prisma.programEnrollment.findUnique({
    where: { userId_type: { userId: session.user.id, type: programType } },
  });
  if (vec && vec.status !== "REJECTED")
    return NextResponse.json({ error: "Već ste prijavljeni na ovaj program." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const metadata = buildMetadata(programType, body);

  if (vec?.status === "REJECTED") {
    // Reapply
    await prisma.programEnrollment.update({
      where: { id: vec.id },
      data: { status: "PENDING", metadata, rejectionReason: null, approvedAt: null, approvedById: null },
    });
  } else {
    await prisma.programEnrollment.create({
      data: { userId: session.user.id, type: programType, metadata },
    });
  }

  void posaljiAdminAlert(
    "Nova prijava na program",
    `Program: ${programType}\nKorisnik: ${session.user.pseudonim}`
  );

  return NextResponse.json({ ok: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMetadata(type: ProgramType, body: Record<string, unknown>): any {
  switch (type) {
    case "PODRSKA_MAJKAMA": {
      const deca = (body.deca as { ime: string; datumRodjenja: string }[]) ?? [];
      return { deca: deca.map((d) => ({ ime: d.ime?.trim(), datumRodjenja: d.datumRodjenja })) };
    }
    case "PODRSKA_STARIJIMA":
      return { datumRodjenja: body.datumRodjenja as string };
    case "POSEBNA_BRIGA":
      return { dijagnoza: (body.dijagnoza as string)?.trim() ?? "" };
    case "SKOLOVANJE":
      return { ustanova: (body.ustanova as string)?.trim() ?? "", program: (body.program as string)?.trim() ?? "" };
    default:
      return null;
  }
}
