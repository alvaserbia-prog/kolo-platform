import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/cron/tabla-jemstva-istek
 * Označava aktivne zahteve za jemstvo kojima je prošao rok (expiresAt = 72h od
 * objave) kao ISTEKLE (čl. 16 Uslova korišćenja). Vrti se na 6h da prozor isteka
 * bude precizan za kratko (72h) trajanje.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const istekli = await prisma.zahtevZaJemstvo.updateMany({
    where: { status: "AKTIVAN", expiresAt: { lte: new Date() } },
    data: { status: "ISTEKAO" },
  });

  console.log(`[Tabla jemstva] Istekli zahtevi: ${istekli.count}`);
  return NextResponse.json({ ok: true, istekli: istekli.count });
}
