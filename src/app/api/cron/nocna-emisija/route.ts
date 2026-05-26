import { NextRequest, NextResponse } from "next/server";
import { izvrsiNocnuEmisiju } from "@/lib/protokol/programi";
import { izvrsiZrnoOperacije } from "@/lib/protokol/zrno";
import { proveriIAktivirajFazu2 } from "@/lib/protokol/faza-sistema";
import { proveriIEvidentirajKorak } from "@/lib/protokol/osnivacki";

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

    // 2. Osnivački doprinos (čl. 9 Pravilnika o osnivačkom doprinosu) — automatsko
    // evidentiranje koraka po dostignutim pragovima. Sekvencijalno, nakon emisija,
    // pre Faze 2 — POEN osnivačkog doprinosa ulazi u kumulativni rast (čl. 7).
    // Izolovano: greška ovde ne sme da blokira proveru Faze 2.
    let osnivacki: unknown = null;
    try {
      osnivacki = await proveriIEvidentirajKorak();
    } catch (e) {
      console.error("[CRON] Greška pri osnivačkom doprinosu:", e);
      osnivacki = { error: String(e) };
    }

    // 3. Provera praga Faze 2 (čl. 42, 44) — sekvencijalno, nakon emisija
    // jer obračun zavisi od konačnog stanja Protokola za obračunski period.
    const faza = await proveriIAktivirajFazu2();

    return NextResponse.json({ ok: true, programi, zrno, osnivacki, faza });
  } catch (err) {
    console.error("[CRON] Greška pri nocnoj emisiji:", err);
    return NextResponse.json({ error: "Greška pri izvršavanju emisije." }, { status: 500 });
  }
}
