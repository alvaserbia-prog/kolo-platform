/**
 * GET /api/verifikacija/lanac/[korisnikId]
 *
 * Javan endpoint — bez auth provere. Verifikacioni zapisi su deo evidencije
 * kolektivnog dobra (čl. 32 KOLO Pravilnika).
 *
 * Vraća verifikatora i listu verifikovanih za datog korisnika sa pseudonimima.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  formatIndeksZaPrikaz,
  izracunajKapacitet,
} from "@/lib/protokol/dokaz-stvarnosti";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ korisnikId: string }> }
) {
  const { korisnikId } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { id: korisnikId },
    select: {
      id: true,
      pseudonim: true,
      tipKorisnika: true,
      indeksStvarnosti: true,
      slotoviPotroseni: true,
      verifikacijaKojomSamVerifikovan: {
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

  const verifikator = user.verifikacijaKojomSamVerifikovan
    ? {
        id: user.verifikacijaKojomSamVerifikovan.verifikator.id,
        pseudonim: user.verifikacijaKojomSamVerifikovan.verifikator.pseudonim,
        datum: user.verifikacijaKojomSamVerifikovan.vremenskiZig.toISOString(),
        statusNadzora: !user.verifikacijaKojomSamVerifikovan.podlezeNadzoru
          ? "ne-podleze"
          : user.verifikacijaKojomSamVerifikovan.nadzornikId
            ? "nadzirano"
            : "ceka-nadzor",
      }
    : null;

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
      indeks: user.indeksStvarnosti,
      kapacitet: kapacitet === "neograniceno" ? null : kapacitet,
      neograniceno: kapacitet === "neograniceno",
      prikaz,
    },
    verifikator,
    verifikovani,
  });
}
