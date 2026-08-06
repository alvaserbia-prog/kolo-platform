import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { obavesti } from "@/lib/notifikacije";
import { jeAdmin, jeSuperadmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

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
  if (!session) return await greska("Nije prijavljen.", 401);

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
    return await greska("Verifikacija evidencije dostupna je samo nosiocima ZRNA i Upravnom odboru (čl. 36).", 403);
  }

  const { id } = await params;
  const ev = await prisma.oglasEvidencija.findUnique({
    where: { id },
    include: { oglas: { select: { createdById: true, title: true } } },
  });
  if (!ev) return await greska("Evidencija nije pronađena.", 404);
  if (ev.status !== "PENDING") return await greska("Evidencija nije na čekanju.", 400);

  if (session.user.id === ev.userId) {
    return await greska("Ne možeš odlučivati o sopstvenom izvršenju.", 403);
  }
  // Izuzetak od predlagačke zabrane: superadmin sme da odlučuje i na svom zadatku
  // (vidi evidencija/[id]/odobri/route.ts); sopstveno izvršenje ne može ni on.
  if (!jeSuperadmin(session.user) && session.user.id === ev.oglas.createdById) {
    return await greska("Predlagač zadatka ne može odlučivati o izvršenju na svom zadatku.", 403);
  }

  await prisma.oglasEvidencija.update({ where: { id }, data: { status: "REJECTED", approvedById: session.user.id, approvedAt: new Date() } });

  await logAdminAkcija(session.user.id, "DOPRINOS_EVIDENCIJA_ODBIJENA", ev.userId,
    `${ev.oglas.title} (predloženo ${ev.predlozeniPoen} POEN)`);

  await obavesti(ev.userId, {
    tip: "info",
    kljuc: "notifikacije.izvrsenje_odbijeno",
    naslov: "Dnevno izvršenje odbijeno",
    tekst: "Tvoje dnevno izvršenje je odbijeno. Za to izvršenje se ne evidentira POEN (čl. 18).",
    link: "/doprinos-oglasi",
  });

  return NextResponse.json({ ok: true });
}
