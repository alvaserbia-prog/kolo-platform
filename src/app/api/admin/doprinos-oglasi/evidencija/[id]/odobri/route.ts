import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

/**
 * POST /api/admin/doprinos-oglasi/evidencija/[id]/odobri
 *
 * Potvrda dnevnog izvršenja operativnog doprinosa (Pravilnik čl. 36; Pravilnik o
 * operativnom doprinosu čl. 16, 18, 22):
 *   — u Fazi 2 verifikuju nosioci ZRNA;
 *   — u Fazi 1 (dok nema ZRNA) funkciju vrše članovi UO Fondacije (admin).
 *
 * VAŽNO: potvrda NE emituje POEN odmah. Potvrđena verifikacija (status APPROVED)
 * ulazi u raspodelu dnevnog limita na kraju obračunskog perioda, gde se evidentirani
 * POEN računa kao predloženi × min(1, L/P) (čl. 24, 25). Emisija se izvršava u
 * noćnom obračunu (`izvrsiNocnuEmisiju`).
 *
 * Konflikt interesa (čl. 16): verifikator ne sme biti predlagač zadatka niti izvršilac.
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
    include: {
      oglas: { select: { title: true, createdById: true } },
    },
  });

  if (!ev) return NextResponse.json({ error: "Evidencija nije pronađena." }, { status: 404 });
  if (ev.status !== "PENDING") return NextResponse.json({ error: "Evidencija nije na čekanju." }, { status: 400 });

  // Konflikt interesa: verifikator ne sme biti izvršilac ni predlagač.
  if (session.user.id === ev.userId) {
    return NextResponse.json(
      { error: "Ne možeš verifikovati sopstveno izvršenje." },
      { status: 403 }
    );
  }
  if (session.user.id === ev.oglas.createdById) {
    return NextResponse.json(
      { error: "Predlagač zadatka ne može verifikovati izvršenje na svom zadatku." },
      { status: 403 }
    );
  }

  // Potvrda — evidencija ulazi u raspodelu narednog noćnog obračuna (čl. 22, 24, 25).
  // POEN se NE emituje sada.
  await prisma.oglasEvidencija.update({
    where: { id },
    data: { status: "APPROVED", approvedById: session.user.id, approvedAt: new Date() },
  });

  await posaljiNotifikaciju(
    ev.userId,
    "info",
    "Izvršenje potvrđeno",
    `Vaše dnevno izvršenje za „${ev.oglas.title}" je potvrđeno (predloženi POEN: ${ev.predlozeniPoen.toLocaleString("sr-RS")}). Evidentirani POEN se obračunava na kraju obračunskog perioda srazmerno dnevnom limitu.`,
    "/doprinos-oglasi"
  );

  return NextResponse.json({ ok: true, predlozeniPoen: ev.predlozeniPoen });
}
