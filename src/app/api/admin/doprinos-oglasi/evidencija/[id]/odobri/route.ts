import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emitujPoen } from "@/lib/protokol/emisija";
import { TipKorisnika, TransactionType } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

/**
 * POST /api/admin/doprinos-oglasi/evidencija/[id]/odobri
 *
 * Verifikacija izvršenja operativnog doprinosa po Pravilniku v3.7.0 čl. 36:
 *   — u Fazi 2 verifikuju nosioci ZRNA;
 *   — u Fazi 1 (dok nema ZRNA) funkciju vrše članovi UO Fondacije (admin).
 *
 * Konflikt interesa (čl. 16 Pravilnika o operativnom doprinosu):
 *   verifikator ne sme biti predlagač oglasa niti izvršilac (korisnik koji
 *   je evidentirao sate).
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  if (!jeAdmin && !jeNosilacZrna) {
    return NextResponse.json(
      { error: "Verifikacija evidencije dostupna je samo nosiocima ZRNA i Upravnom odboru (čl. 36)." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const ev = await prisma.oglasEvidencija.findUnique({
    where: { id },
    include: {
      user: { include: { wallet: true } },
      oglas: { select: { title: true, createdById: true } },
    },
  });

  if (!ev) return NextResponse.json({ error: "Evidencija nije pronađena." }, { status: 404 });
  if (ev.status !== "PENDING") return NextResponse.json({ error: "Evidencija nije na čekanju." }, { status: 400 });
  if (!ev.user.wallet) return NextResponse.json({ error: "Korisnik nema novčanik." }, { status: 400 });

  // Konflikt interesa: verifikator ne sme biti izvršilac ni predlagač.
  if (session.user.id === ev.userId) {
    return NextResponse.json(
      { error: "Ne možeš verifikovati sopstvenu evidenciju rada." },
      { status: 403 }
    );
  }
  if (session.user.id === ev.oglas.createdById) {
    return NextResponse.json(
      { error: "Predlagač oglasa ne može verifikovati evidenciju na svom oglasu." },
      { status: 403 }
    );
  }

  await emitujPoen(
    ev.user.wallet!.id,
    ev.amount,
    TransactionType.EMISIJA_PROGRAM,
    `Evidencija doprinosa: ${ev.oglas.title} (${ev.hoursWorked}h)`
  );

  await prisma.oglasEvidencija.update({
    where: { id },
    data: { status: "EMITTED", approvedById: session.user.id, approvedAt: new Date() },
  });

  await posaljiNotifikaciju(
    ev.userId,
    "transfer_primljen",
    `Primili ste ${ev.amount.toLocaleString("sr-RS")} POEN`,
    `Evidencija rada za "${ev.oglas.title}" (${ev.hoursWorked}h) je potvrđena.`,
    "/novcanik"
  );

  return NextResponse.json({ ok: true, amount: ev.amount });
}
