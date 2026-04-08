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

  await prisma.radniOglasPrijava.update({
    where: { id },
    data: { status: "APPROVED", approvedById: session.user.id, approvedAt: new Date() },
  });

  const oglas = await prisma.radniOglas.findUnique({ where: { id: prijava.oglasId }, select: { title: true } });
  await posaljiNotifikaciju(
    prijava.userId,
    "info",
    "Prijava za posao prihvaćena!",
    `Vaša prijava za oglas "${oglas?.title ?? ""}" je prihvaćena. Možete početi sa evidencijom radnih sati.`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
