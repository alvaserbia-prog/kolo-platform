import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/cron/gdpr-cistenje
 * GDPR data retention cleanup job.
 * Pokreće se mesečno (preporučeno 1. u mesecu u 02:00).
 *
 * Briše poruke u konverzacijama u kojima je poslednja poruka starija od
 * 24 meseca (i obe strane su deaktivirane ili konverzacija je neaktivna).
 * Ako je JEDNA strana i dalje aktivna, poruke se čuvaju dok ona ne deaktivira nalog.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const sada = new Date();
  const dvadesetCetiriMesecaUnazad = new Date(sada);
  dvadesetCetiriMesecaUnazad.setMonth(dvadesetCetiriMesecaUnazad.getMonth() - 24);

  // --- Retencija poruka — 24 meseca ---
  // Briše poruke u konverzacijama u kojima je lastMessageAt > 24 meseca
  // I obe strane su deaktivirane
  const stareKonverzacije = await prisma.konverzacija.findMany({
    where: {
      lastMessageAt: { lte: dvadesetCetiriMesecaUnazad },
      user1: { deaktiviranAt: { not: null } },
      user2: { deaktiviranAt: { not: null } },
    },
    select: { id: true },
  });

  let obrPoruke = 0;
  if (stareKonverzacije.length > 0) {
    const ids = stareKonverzacije.map((k) => k.id);
    const deleted = await prisma.poruka.deleteMany({
      where: { konverzacijaId: { in: ids } },
    });
    obrPoruke = deleted.count;
  }

  console.log(`[GDPR Cron] Poruke obrisane: ${obrPoruke}`);

  return NextResponse.json({
    ok: true,
    porukeObrisane: obrPoruke,
  });
}
