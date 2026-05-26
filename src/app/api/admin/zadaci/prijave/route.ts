import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";

// GET /api/admin/zadaci/prijave — prijave koje čekaju odobravanje (čl. 14)
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const jeAdmin = session.user.role === "ADMIN";
  let jeNosilacZrna = false;
  if (!jeAdmin) {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tipKorisnika: true },
    });
    jeNosilacZrna = me?.tipKorisnika === TipKorisnika.NOSILAC_ZRNA;
  }
  if (!jeAdmin && !jeNosilacZrna)
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const prijave = await prisma.zadatakPrijava.findMany({
    where: { status: "PODNETA" },
    include: {
      user: { select: { pseudonim: true } },
      zadatak: { select: { naslov: true, brojIzvrsilaca: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    prijave: prijave.map((p) => ({
      id: p.id,
      pseudonim: p.user.pseudonim,
      zadatakNaslov: p.zadatak.naslov,
      brojIzvrsilaca: p.zadatak.brojIzvrsilaca,
      planIzvrsenja: p.planIzvrsenja,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}
