import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { labelPrograma } from "@/lib/protokol/programi";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/admin/programi/enrollments/[id]/odbij
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = (body.razlog ?? "").trim();

  const enrollment = await prisma.programEnrollment.findUnique({ where: { id } });
  if (!enrollment) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (enrollment.status !== "PENDING")
    return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  await prisma.programEnrollment.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: razlog || null },
  });

  await logAdminAkcija(session.user.id, "PROGRAM_PRIJAVA_ODBIJENA", enrollment.userId,
    `${labelPrograma(enrollment.type)}${razlog ? ": " + razlog : ""}`);

  await posaljiNotifikaciju(
    enrollment.userId,
    "info",
    `Prijava na program odbijena`,
    `Vaša prijava na program "${labelPrograma(enrollment.type)}" je odbijena.${razlog ? ` Razlog: ${razlog}` : ""}`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
