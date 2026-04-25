import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { labelPrograma } from "@/lib/protokol/programi";

// POST /api/admin/programi/enrollments/[id]/odbij
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
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

  await posaljiNotifikaciju(
    enrollment.userId,
    "info",
    `Prijava na program odbijena`,
    `Vaša prijava na program "${labelPrograma(enrollment.type)}" je odbijena.${razlog ? ` Razlog: ${razlog}` : ""}`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
