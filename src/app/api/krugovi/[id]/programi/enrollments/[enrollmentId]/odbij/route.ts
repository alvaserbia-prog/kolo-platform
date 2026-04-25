import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/krugovi/[id]/programi/enrollments/[enrollmentId]/odbij
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; enrollmentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id: krugId, enrollmentId } = await params;

  if (session.user.role !== "ADMIN") {
    const membership = await prisma.krugClanstvo.findFirst({
      where: { krugId, userId: session.user.id, isAdmin: true, leftAt: null },
    });
    if (!membership) return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const enrollment = await prisma.programEnrollment.findUnique({
    where: { id: enrollmentId },
    include: { user: { include: { krugClanstva: { where: { krugId, leftAt: null } } } } },
  });

  if (!enrollment) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (enrollment.status !== "PENDING") return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  if (session.user.role !== "ADMIN" && enrollment.user.krugClanstva.length === 0) {
    return NextResponse.json({ error: "Korisnik nije član ove krugovi." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const razlog = typeof body.razlog === "string" ? body.razlog.trim() : "";

  await prisma.programEnrollment.update({
    where: { id: enrollmentId },
    data: { status: "REJECTED", rejectionReason: razlog || null },
  });

  return NextResponse.json({ ok: true });
}
