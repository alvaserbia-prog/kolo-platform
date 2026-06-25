/**
 * GET /api/verifikacija/lanac/[korisnikId]
 *
 * Vraća verifikatora i listu verifikovanih (mini-stablo) za datog korisnika sa
 * pseudonimima. Graf verifikacija je deo podataka koji se NIKADA ne izlažu javno
 * (Politika privatnosti čl. 6) — dostupan je isključivo verifikovanim korisnicima
 * (indeks stvarnosti ≥ 10%).
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatIndeksZaPrikaz,
  izracunajKapacitet,
} from "@/lib/protokol/dokaz-stvarnosti";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ korisnikId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Verifikacija potrebna." }, { status: 403 });

  const { korisnikId } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { id: korisnikId },
    select: {
      id: true,
      pseudonim: true,
      tipKorisnika: true,
      jeOsnivac: true,
      indeksStvarnosti: true,
      slotoviPotroseni: true,
      verifikacijeKojeSuMeVerifikovale: {
        orderBy: { vremenskiZig: "asc" },
        select: {
          vremenskiZig: true,
          nadzornikId: true,
          podlezeNadzoru: true,
          verifikator: { select: { id: true, pseudonim: true } },
        },
      },
      verifikacijeKojeSamObavio: {
        orderBy: { vremenskiZig: "asc" },
        select: {
          vremenskiZig: true,
          nadzornikId: true,
          podlezeNadzoru: true,
          verifikovani: { select: { id: true, pseudonim: true } },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Korisnik ne postoji." }, { status: 404 });
  }

  const kapacitet = izracunajKapacitet(user.tipKorisnika, user.indeksStvarnosti);
  const prikaz = formatIndeksZaPrikaz(
    user.tipKorisnika,
    user.indeksStvarnosti,
    user.slotoviPotroseni
  );

  const verifikatori = user.verifikacijeKojeSuMeVerifikovale.map((v) => ({
    id: v.verifikator.id,
    pseudonim: v.verifikator.pseudonim,
    datum: v.vremenskiZig.toISOString(),
    statusNadzora: !v.podlezeNadzoru
      ? "ne-podleze"
      : v.nadzornikId
        ? "nadzirano"
        : "ceka-nadzor",
  }));

  const verifikovani = user.verifikacijeKojeSamObavio.map((v) => ({
    id: v.verifikovani.id,
    pseudonim: v.verifikovani.pseudonim,
    datum: v.vremenskiZig.toISOString(),
    statusNadzora: !v.podlezeNadzoru
      ? "ne-podleze"
      : v.nadzornikId
        ? "nadzirano"
        : "ceka-nadzor",
  }));

  return NextResponse.json({
    korisnik: {
      id: user.id,
      pseudonim: user.pseudonim,
      tip: user.tipKorisnika,
      jeOsnivac: user.jeOsnivac,
      indeks: user.indeksStvarnosti,
      kapacitet: kapacitet === "neograniceno" ? null : kapacitet,
      neograniceno: kapacitet === "neograniceno",
      prikaz,
    },
    verifikatori,
    verifikovani,
  });
}
