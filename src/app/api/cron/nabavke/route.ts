import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { obradiNabavke } from "@/lib/protokol/nabavka";

/**
 * GET /api/cron/nabavke
 *
 * Jedan prolaz kroz sve nabavke u toku (Pravilnik o projektima i kolektivnim
 * nabavkama čl. 21–24, 29, 32):
 *   1. istekle prijave → utvrdi red i pošalji prve pozive;
 *   2. istekli pozivi → mesto se oslobađa;
 *   3. potvrđeni koji nisu došli svog dana → mesto se oslobađa;
 *   4. oslobođena mesta → poziv ide sledećem u redu;
 *   5. istekao period preuzimanja → nabavka se zatvara i brišu se predlozi te reči;
 *   6. predlozi stariji od dvanaest meseci se brišu.
 *
 * 🔴 Bez ovog posla mehanizam stoji: poziv istekne a niko ga ne obori, mesto se ne
 * oslobodi i sledeći u redu nikad ne dobije priliku. Rolanje poziva je jedina stvar
 * u ovom mehanizmu koju ne pokreće ničiji klik.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const secret = bearerSecret ?? req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return await greska("Neautorizovano.", 401);
  }

  const izvestaj = await obradiNabavke();
  return NextResponse.json({ ok: true, ...izvestaj });
}
