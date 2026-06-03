import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

/**
 * POST /api/admin/doprinos-oglasi/evidencija/[id]/odbij
 *
 * Odbijanje evidencije operativnog doprinosa (čl. 36 Pravilnika v3.7.0).
 * Faza 1: UO Fondacije (admin). Faza 2: nosioci ZRNA.
 * Konflikt interesa: verifikator ≠ izvršilac ≠ predlagač oglasa.
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
      { error: "Verifikacija evidencije dostupna je samo nosiocima ZRNA i Upravnom odboru (čl. 36)." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const ev = await prisma.oglasEvidencija.findUnique({
    where: { id },
    include: { oglas: { select: { createdById: true } } },
  });
  if (!ev) return NextResponse.json({ error: "Evidencija nije pronađena." }, { status: 404 });
  if (ev.status !== "PENDING") return NextResponse.json({ error: "Evidencija nije na čekanju." }, { status: 400 });

  if (session.user.id === ev.userId) {
    return NextResponse.json(
      { error: "Ne možeš odlučivati o sopstvenom izvršenju." },
      { status: 403 }
    );
  }
  if (session.user.id === ev.oglas.createdById) {
    return NextResponse.json(
      { error: "Predlagač zadatka ne može odlučivati o izvršenju na svom zadatku." },
      { status: 403 }
    );
  }

  await prisma.oglasEvidencija.update({ where: { id }, data: { status: "REJECTED", approvedById: session.user.id, approvedAt: new Date() } });

  await posaljiNotifikaciju(
    ev.userId,
    "info",
    "Dnevno izvršenje odbijeno",
    `Vaše dnevno izvršenje je odbijeno. Za to izvršenje se ne evidentira POEN (čl. 18).`,
    "/doprinos-oglasi"
  );

  return NextResponse.json({ ok: true });
}
