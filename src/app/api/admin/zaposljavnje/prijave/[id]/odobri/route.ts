import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const prijava = await prisma.radniOglasPrijava.findUnique({ where: { id } });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.status !== "PENDING") return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  const oglasSaKapacitetom = await prisma.radniOglas.findUnique({
    where: { id: prijava.oglasId },
    select: {
      title: true,
      positions: true,
      _count: { select: { prijave: { where: { status: "APPROVED" } } } },
    },
  });
  if (!oglasSaKapacitetom) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });

  if (
    oglasSaKapacitetom.positions !== null &&
    oglasSaKapacitetom._count.prijave >= oglasSaKapacitetom.positions
  ) {
    return NextResponse.json(
      { error: `Oglas je popunjen — sva mesta su zauzeta (${oglasSaKapacitetom.positions}).` },
      { status: 400 }
    );
  }

  await prisma.radniOglasPrijava.update({
    where: { id },
    data: { status: "APPROVED", approvedById: session.user.id, approvedAt: new Date() },
  });

  await posaljiNotifikaciju(
    prijava.userId,
    "info",
    "Prijava za posao prihvaćena!",
    `Vaša prijava za oglas "${oglasSaKapacitetom.title}" je prihvaćena. Možete početi sa evidencijom radnih sati.`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
