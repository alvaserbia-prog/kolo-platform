import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/cron/tabla-jemstva-istek
 * Označava zahteve za jemstvo kojima je prošao rok (expiresAt = 8 dana od
 * objave) kao ISTEKLE. Dnevni cron je dovoljan: GET tabla u realnom vremenu
 * filtrira `expiresAt > now`, pa korisnici nikad ne vide istekle; ovaj cron samo
 * čisti status (ISTEKAO) radi evidencije.
 *
 * Uz istek se briše i skriveni kontakt (telefon i saglasnost za poziv):
 * prikupljeni su radi jedne objave i posle njenog isteka nemaju svrhu
 * (minimizacija podataka, Politika čl. 4).
 *
 * NAPOMENA: rok je produžen sa 72h na 8 dana jer je struktuirana kartica znatno
 * skuplja za popunjavanje od jedne rečenice. Politika 3.9.1 i Uslovi čl. 16 još
 * uvek navode 72h — usklađivanje akata je zasebna, naknadna radnja.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return await greska("Neautorizovano.", 401);
  }

  const istekli = await prisma.zahtevZaJemstvo.updateMany({
    where: { status: { in: ["AKTIVAN", "NEPOTPUN"] }, expiresAt: { lte: new Date() } },
    data: { status: "ISTEKAO", telefon: null, telefonSaglasnost: false },
  });

  console.log(`[Tabla jemstva] Istekli zahtevi: ${istekli.count}`);
  return NextResponse.json({ ok: true, istekli: istekli.count });
}
