/**
 * GET /api/nadzor
 *
 * Lista verifikacija koje čekaju nadzor. Dostupno samo POCETNI / NOSILAC_ZRNA.
 * Filtrira van svoje sopstvene verifikacije.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listajVerifikacijeZaNadzor } from "@/lib/protokol/nadzor-service";
import { mozeNadzor } from "@/lib/dozvole";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tipKorisnika: true },
  });
  if (!user || !mozeNadzor(user)) {
    return NextResponse.json(
      { error: "Nemaš ovlašćenje za nadzor (čl. 10 Pravilnika)." },
      { status: 403 }
    );
  }

  const lista = await listajVerifikacijeZaNadzor(session.user.id);
  return NextResponse.json({
    verifikacije: lista.map((v) => ({
      id: v.id,
      verifikator: {
        id: v.verifikator.id,
        pseudonim: v.verifikator.pseudonim,
        slotoviPotroseni: v.verifikator.slotoviPotroseni,
      },
      verifikovani: { id: v.verifikovani.id, pseudonim: v.verifikovani.pseudonim },
      datum: v.vremenskiZig.toISOString(),
    })),
  });
}
