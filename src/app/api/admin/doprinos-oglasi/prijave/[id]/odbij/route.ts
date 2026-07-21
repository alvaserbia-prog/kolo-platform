import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

/**
 * POST /api/admin/doprinos-oglasi/prijave/[id]/odbij
 * Odbijanje prijave za operativni doprinos (čl. 36 Pravilnika v3.7.0).
 * Faza 1: UO Fondacije (admin). Faza 2: nosioci ZRNA.
 */
export async function POST(
  req: NextRequest,
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
      { error: "Odlučivanje o prijavi dostupno je samo nosiocima ZRNA i Upravnom odboru (čl. 36)." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = typeof body.razlog === "string" ? body.razlog.trim() : "";

  const prijava = await prisma.oglasPrijava.findUnique({
    where: { id },
    include: { oglas: { select: { createdById: true } } },
  });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.status !== "PENDING") return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  // Konflikt interesa: verifikator ne sme biti podnosilac prijave ni predlagač oglasa.
  if (session.user.id === prijava.userId) {
    return NextResponse.json(
      { error: "Ne možeš odlučivati o sopstvenoj prijavi." },
      { status: 403 }
    );
  }
  if (session.user.id === prijava.oglas.createdById) {
    return NextResponse.json(
      { error: "Predlagač oglasa ne može odlučivati o prijavama na svoj oglas." },
      { status: 403 }
    );
  }

  await prisma.oglasPrijava.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: razlog || null },
  });

  const oglas = await prisma.doprinosOglas.findUnique({ where: { id: prijava.oglasId }, select: { title: true } });

  await logAdminAkcija(session.user.id, "DOPRINOS_PRIJAVA_ODBIJENA", prijava.userId,
    `${oglas?.title ?? prijava.oglasId}${razlog ? ": " + razlog : ""}`);

  await posaljiNotifikaciju(
    prijava.userId,
    "info",
    "Prijava za posao odbijena",
    `Vaša prijava za oglas "${oglas?.title ?? ""}" je odbijena.${razlog ? ` Razlog: ${razlog}` : ""}`,
    "/programi"
  );

  return NextResponse.json({ ok: true });
}
