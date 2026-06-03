import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { izracunajGlasove } from "@/lib/protokol/zrno";
import { fazaPredloga } from "@/lib/protokol/glasanje";

// POST /api/glasanje/[id]/glasaj — glasa ZA ili PROTIV
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;
  const predlog = await prisma.glasanjePredlog.findUnique({ where: { id } });
  if (!predlog) return NextResponse.json({ error: "Predlog nije pronađen." }, { status: 404 });

  const faza = fazaPredloga(predlog);
  if (faza === "NAJAVLJEN") {
    const datum = predlog.glasanjePocetak.toLocaleDateString("sr-RS");
    return NextResponse.json({ error: `Glasanje još nije počelo (počinje ${datum}).` }, { status: 400 });
  }
  if (faza !== "U_TOKU")
    return NextResponse.json({ error: "Glasanje je završeno." }, { status: 400 });

  const glasovi = await izracunajGlasove(session.user.id);
  if (glasovi <= 0)
    return NextResponse.json({ error: "Nemate glasačku moć (potrebno aktivno ZRNO)." }, { status: 403 });

  const body = await req.json();
  const za = body.za === true;

  // Upsert — dozvoljavamo izmenu glasa dok glasanje traje (čl. 11)
  await prisma.glasanjeGlas.upsert({
    where: { predlogId_userId: { predlogId: id, userId: session.user.id } },
    create: { predlogId: id, userId: session.user.id, za, glasackaGlasova: glasovi },
    update: { za, glasackaGlasova: glasovi },
  });

  return NextResponse.json({ ok: true, glasackaGlasova: glasovi });
}
