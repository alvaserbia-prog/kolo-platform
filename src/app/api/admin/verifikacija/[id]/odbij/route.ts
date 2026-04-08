import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/verifikacija/[id]/odbij
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const razlog: string = (body.razlog ?? "").trim();

  if (!razlog) {
    return NextResponse.json({ error: "Razlog odbijanja je obavezan." }, { status: 400 });
  }

  const vr = await prisma.verificationRequest.findUnique({ where: { id } });
  if (!vr) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (vr.status !== "PENDING")
    return NextResponse.json({ error: "Zahtev nije na čekanju." }, { status: 400 });

  await prisma.verificationRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: razlog,
      reviewedAt: new Date(),
      reviewedById: session.user.id,
    },
  });

  await posaljiNotifikaciju(
    vr.userId,
    "verifikacija_odbijena",
    "Verifikacija odbijena",
    `Vaš zahtev za verifikaciju je odbijen. Razlog: ${razlog}`,
    "/verifikacija"
  );

  return NextResponse.json({ ok: true });
}
