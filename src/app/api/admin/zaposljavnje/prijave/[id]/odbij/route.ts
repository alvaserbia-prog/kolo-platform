import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = typeof body.razlog === "string" ? body.razlog.trim() : "";

  const prijava = await prisma.radniOglasPrijava.findUnique({ where: { id } });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.status !== "PENDING") return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  await prisma.radniOglasPrijava.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: razlog || null },
  });

  const oglas = await prisma.radniOglas.findUnique({ where: { id: prijava.oglasId }, select: { title: true } });
  await posaljiNotifikaciju(
    prijava.userId,
    "info",
    "Prijava za posao odbijena",
    `Vaša prijava za oglas "${oglas?.title ?? ""}" je odbijena.${razlog ? ` Razlog: ${razlog}` : ""}`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
