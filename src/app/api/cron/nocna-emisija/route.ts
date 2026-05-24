import { NextRequest, NextResponse } from "next/server";
import { izvrsiNocnuEmisiju } from "@/lib/protokol/programi";
import { izvrsiZrnoOperacije } from "@/lib/protokol/zrno";
import { proveriIAktivirajFazu2 } from "@/lib/protokol/faza-sistema";

// POST /api/cron/nocna-emisija — pokreće se u ponoć (zaštićeno CRON_SECRET)
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Neautorizovano." }, { status: 401 });
  }

  const datum = new Date();
  try {
    // 1. Emisije programa i ZRNO operacije (paralelno — nezavisne)
    const [programi, zrno] = await Promise.all([
      izvrsiNocnuEmisiju(datum),
      izvrsiZrnoOperacije(datum),
    ]);

    // 2. Provera praga Faze 2 (čl. 42, 44) — sekvencijalno, nakon emisija
    // jer obračun zavisi od konačnog stanja Protokola za obračunski period.
    const faza = await proveriIAktivirajFazu2();

    return NextResponse.json({ ok: true, programi, zrno, faza });
  } catch (err) {
    console.error("[CRON] Greška pri nocnoj emisiji:", err);
    return NextResponse.json({ error: "Greška pri izvršavanju emisije." }, { status: 500 });
  }
}
