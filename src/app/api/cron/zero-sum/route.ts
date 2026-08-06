import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preracunajZoneUBazi } from "@/lib/protokol/zona-sinhronizacija";

// GET /api/cron/zero-sum — dnevna provera integriteta (Vercel Cron):
//  1. zero-sum invarijanta (zbir svih balansa = 0);
//  2. resinhronizacija keša zabranjene zone (verification_zone) iz grafa
//     verifikacija — pokriva i inicijalni backfill posle migracije
//     20260707120000_verifikaciona_zona, bez ručnog poziva admin endpointa.
export async function GET(req: NextRequest) {
  // Podrška za oba načina: Vercel Cron (Authorization: Bearer) i manuelni poziv (x-cron-secret)
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const secret = bearerSecret ?? req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const result = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const zbir = result._sum.balance ?? 0;

  // Zona: puna rekomputacija iz izvora istine (idempotentno). Greška ovde ne
  // sme da maskira zero-sum rezultat — loguje se i prijavi zasebnim poljem.
  let zona: { parova: number; zapisa: number } | null = null;
  try {
    zona = await prisma.$transaction(async (tx) => preracunajZoneUBazi(tx), {
      timeout: 60_000,
    });
  } catch (e) {
    console.error("[zero-sum cron] Rekomputacija zabranjene zone pukla:", e);
  }

  if (zbir !== 0) {
    console.error(`[ZERO-SUM ALARM] Zbir svih balansa nije 0! Zbir: ${zbir} | ${new Date().toISOString()}`);
    return NextResponse.json({ ok: false, zbir, zona }, { status: 500 });
  }

  return NextResponse.json({ ok: true, zbir: 0, zona });
}
