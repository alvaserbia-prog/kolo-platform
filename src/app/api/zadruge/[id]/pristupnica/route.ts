import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/zadruge/[id]/pristupnica
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnici mogu podneti pristupnicu." }, { status: 403 });

  const { id: zadrugaId } = await params;

  const zadruga = await prisma.zadruga.findUnique({ where: { id: zadrugaId } });
  if (!zadruga || zadruga.status !== "ACTIVE")
    return NextResponse.json({ error: "Zadruga nije pronađena ili nije aktivna." }, { status: 404 });

  // Čl. 28 — samo jedna zadruga
  const aktivno = await prisma.zadrugaMembership.findFirst({
    where: { userId: session.user.id, leftAt: null },
  });
  if (aktivno)
    return NextResponse.json({ error: "Već ste član zadruge. Prvo istupite iz trenutne." }, { status: 400 });

  // Postoji li već pristupnica na čekanju ili aktivno članstvo
  const postojeca = await prisma.zadrugaPristupnica.findUnique({
    where: { userId_zadrugaId: { userId: session.user.id, zadrugaId } },
  });
  if (postojeca && postojeca.status === "PENDING")
    return NextResponse.json({ error: "Pristupnica je već poslata i čeka odobrenje." }, { status: 400 });

  if (postojeca) {
    await prisma.zadrugaPristupnica.update({
      where: { id: postojeca.id },
      data: { status: "PENDING" },
    });
  } else {
    await prisma.zadrugaPristupnica.create({
      data: { userId: session.user.id, zadrugaId },
    });
  }

  return NextResponse.json({ ok: true });
}
