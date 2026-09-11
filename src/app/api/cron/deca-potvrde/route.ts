import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import { obradiIstekleRokove, posaljiPodsetnike } from "@/lib/protokol/deca";
import { obradiIstekleOdobrenja } from "@/lib/protokol/prepis-odobrenje";

/**
 * POST /api/cron/deca-potvrde
 *
 * Postupak potvrde postojanja deteta (Pravilnik o učešću dece, čl. 6) — dva posla.
 *
 *  1. **Podsetnici** pre isteka roka, na 30, 7 i 1 dan. Idu SVAKOME koga bi
 *     poništenje oštetilo — potvrđivaču, roditelju i nadzorniku — a ne samo onome
 *     od koga se izjašnjenje traži.
 *  2. **Istek roka.** Potvrda opstaje samo ako su se izjasnile obe strane veze;
 *     neaktivnost bilo koje obara je. Svakom pogođenom oduzima se ono što mu je
 *     povodom te potvrde bilo evidentirano, i kada zapis time pređe u minus.
 *     Potvrđivaču se oslobađa verifikacioni slot.
 *
 * Podsetnici idu PRE isteka u istom pokretanju: obrnut redosled poslao bi
 * podsetnik na rok koji je istog trenutka i istekao.
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

  const podsetnici = await posaljiPodsetnike();
  const rezultat = await obradiIstekleRokove();
  // Istek zahteva za odobrenje prepisa (čl. 14) — ništa se ne vraća jer ništa nije
  // ni skinuto; zahtev samo prestaje da važi.
  const odobrenja = await obradiIstekleOdobrenja();
  console.log(
    `[Deca Cron] Podsetnika: ${podsetnici.poslato}, pregledano isteklih: ${rezultat.pregledano}, poništeno potvrda: ${rezultat.ponisteno}, isteklih odobrenja: ${odobrenja.ugaseno}`
  );
  return NextResponse.json({
    ok: true,
    ...rezultat,
    podsetnika: podsetnici.poslato,
    istekloOdobrenja: odobrenja.ugaseno,
  });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
