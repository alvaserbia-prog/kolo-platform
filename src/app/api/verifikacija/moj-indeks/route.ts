/**
 * GET /api/verifikacija/moj-indeks
 *
 * Vraća indeks stvarnosti, tip, kapacitet i slotove logovanog korisnika.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  brojRaspolozivihSlotova,
  formatIndeksZaPrikaz,
  izracunajKapacitet,
} from "@/lib/protokol/dokaz-stvarnosti";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      tipKorisnika: true,
      indeksStvarnosti: true,
      slotoviPotroseni: true,
      _count: { select: { verifikacijeKojeSamObavio: true } },
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Korisnik ne postoji." }, { status: 404 });
  }

  const kapacitet = izracunajKapacitet(user.tipKorisnika, user.indeksStvarnosti);
  const slotoviRaspolozivi = brojRaspolozivihSlotova(kapacitet, user.slotoviPotroseni);
  const prikaz = formatIndeksZaPrikaz(
    user.tipKorisnika,
    user.indeksStvarnosti,
    user.slotoviPotroseni
  );

  return NextResponse.json({
    tip: user.tipKorisnika,
    indeks: user.indeksStvarnosti,
    kapacitet: kapacitet === "neograniceno" ? null : kapacitet,
    neograniceno: kapacitet === "neograniceno",
    slotoviRaspolozivi,
    slotoviPotroseni: user.slotoviPotroseni,
    brojVerifikacijaObavljenih: user._count.verifikacijeKojeSamObavio,
    prikaz,
  });
}
