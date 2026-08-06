import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/pokroviteljstvo/prijava/[id]/potpisi — korisnik potpisuje ugovor (čl. 8)
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;
  const prijava = await prisma.pokroviteljPrijava.findUnique({
    where: { id },
    select: { podnosilacId: true, status: true },
  });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.podnosilacId !== session.user.id)
    return NextResponse.json({ error: "Nije vaša prijava." }, { status: 403 });
  if (prijava.status !== "CEKA_POTPIS")
    return NextResponse.json({ error: "Prijava nije u stanju čekanja potpisa." }, { status: 400 });

  await prisma.pokroviteljPrijava.update({
    where: { id },
    data: { status: "POTPISANA", potpisanoAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
