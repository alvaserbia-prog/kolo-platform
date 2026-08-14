import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import { obradiIstekleRokove } from "@/lib/protokol/deca";

/**
 * POST /api/cron/deca-potvrde
 *
 * Istek roka od trideset dana za izjašnjenje o postojanju deteta (Pravilnik o
 * Modulu Deca, čl. 6 st. 3). Licu koje se nije izjasnilo poništava se potvrda
 * stvarnosti roditelja, ukidaju se zapisi POEN-a evidentirani povodom te potvrde
 * i oslobađa mu se verifikacioni slot.
 *
 * Termin: dnevno u 21:00 UTC — namerno RAZDVOJEN od noćne emisije (22:00), da se
 * poništavanje zapisa ne sudari sa obračunom dana.
 *
 * Posao je idempotentan i nadoknađuje: obrađuje sve zapise kojima je rok istekao, ne
 * samo današnje. Bez toga bi jedno preskočeno pokretanje ostavilo potvrdu na snazi.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return await greska("Neautorizovano.", 401);
  }
  // Ugašen modul nema šta da obrađuje, ali ruta ostaje živa da raspored ne puca.
  if (!MODUL_DECA_AKTIVAN) return NextResponse.json({ ok: true, preskoceno: true });

  const rezultat = await obradiIstekleRokove();
  console.log(
    `[Deca Cron] Pregledano isteklih: ${rezultat.pregledano}, poništeno potvrda: ${rezultat.ponisteno}`
  );
  return NextResponse.json({ ok: true, ...rezultat });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
