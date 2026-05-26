import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";

// GET /api/admin/zadaci/izvrsenja — izvršenja koja čekaju verifikaciju (čl. 18)
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

  const izvrsenja = await prisma.zadatakIzvrsenje.findMany({
    where: { status: "PODNETO" },
    include: {
      user: { select: { pseudonim: true } },
      zadatak: { select: { naslov: true, mod: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    izvrsenja: izvrsenja.map((iz) => ({
      id: iz.id,
      pseudonim: iz.user.pseudonim,
      zadatakNaslov: iz.zadatak.naslov,
      mod: iz.zadatak.mod,
      datum: iz.datum.toISOString(),
      sati: iz.sati,
      dokaz: iz.dokaz,
      tezina: iz.tezina,
      createdAt: iz.createdAt.toISOString(),
    })),
  });
}
