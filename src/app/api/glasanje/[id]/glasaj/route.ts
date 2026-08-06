import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { izracunajGlasove } from "@/lib/protokol/zrno";
import { fazaPredloga } from "@/lib/protokol/glasanje";
import { dohvatiFazuStatus } from "@/lib/protokol/faza-sistema";

// POST /api/glasanje/[id]/glasaj — glasa ZA ili PROTIV
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  // Glasanje Gornjeg Kola je operativno tek u Fazi 2 (čl. 3, 24)
  const fazaSistema = await dohvatiFazuStatus();
  if (fazaSistema.faza !== "FAZA_2")
    return await greska("Glasanje Gornjeg Kola je operativno tek u Fazi 2.", 403);

  const { id } = await params;
  const predlog = await prisma.glasanjePredlog.findUnique({ where: { id } });
  if (!predlog) return await greska("Predlog nije pronađen.", 404);

  const faza = fazaPredloga(predlog);
  if (faza === "NAJAVLJEN") {
    const datum = predlog.glasanjePocetak.toLocaleDateString("sr-RS");
    return await greska(`Glasanje još nije počelo (počinje ${datum}).`, 400);
  }
  if (faza !== "U_TOKU")
    return await greska("Glasanje je završeno.", 400);

  const glasovi = await izracunajGlasove(session.user.id);
  if (glasovi <= 0)
    return await greska("Nemate glasačku moć (potrebno aktivno ZRNO).", 403);

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
