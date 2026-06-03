import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

/**
 * POST /api/admin/doprinos-oglasi/prijave/[id]/odobri
 *
 * Odobrenje prijave za operativni doprinos (čl. 36 Pravilnika v3.7.0).
 * Faza 1: UO Fondacije (admin). Faza 2: nosioci ZRNA.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const korisnikJeAdmin = jeAdmin(session.user);
  let jeNosilacZrna = false;
  if (!korisnikJeAdmin) {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tipKorisnika: true },
    });
    jeNosilacZrna = me?.tipKorisnika === TipKorisnika.NOSILAC_ZRNA;
  }
  if (!korisnikJeAdmin && !jeNosilacZrna) {
    return NextResponse.json(
      { error: "Odobrenje prijave dostupno je samo nosiocima ZRNA i Upravnom odboru (čl. 36)." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const prijava = await prisma.oglasPrijava.findUnique({ where: { id } });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.status !== "PENDING") return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  const oglasSaKapacitetom = await prisma.doprinosOglas.findUnique({
    where: { id: prijava.oglasId },
    select: {
      title: true,
      positions: true,
      createdById: true,
      _count: { select: { prijave: { where: { status: "APPROVED" } } } },
    },
  });
  if (!oglasSaKapacitetom) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });

  // Konflikt interesa: verifikator ne sme biti predlagač oglasa ni podnosilac prijave.
  if (session.user.id === prijava.userId) {
    return NextResponse.json(
      { error: "Ne možeš odlučivati o sopstvenoj prijavi." },
      { status: 403 }
    );
  }
  if (session.user.id === oglasSaKapacitetom.createdById) {
    return NextResponse.json(
      { error: "Predlagač oglasa ne može odlučivati o prijavama na svoj oglas." },
      { status: 403 }
    );
  }

  if (
    oglasSaKapacitetom.positions !== null &&
    oglasSaKapacitetom._count.prijave >= oglasSaKapacitetom.positions
  ) {
    return NextResponse.json(
      { error: `Oglas je popunjen — sva mesta su zauzeta (${oglasSaKapacitetom.positions}).` },
      { status: 400 }
    );
  }

  await prisma.oglasPrijava.update({
    where: { id },
    data: { status: "APPROVED", approvedById: session.user.id, approvedAt: new Date() },
  });

  await posaljiNotifikaciju(
    prijava.userId,
    "info",
    "Prijava za posao prihvaćena!",
    `Vaša prijava za oglas "${oglasSaKapacitetom.title}" je prihvaćena. Možete početi sa evidencijom radnih sati.`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
