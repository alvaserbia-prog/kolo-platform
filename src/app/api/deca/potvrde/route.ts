import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MODUL_DECA_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";
import { potvrdeNaCekanju } from "@/lib/protokol/deca";

/**
 * GET /api/deca/potvrde — zapisi koji čekaju izjašnjenje prijavljenog korisnika
 * (Pravilnik o Modulu Deca, čl. 6).
 *
 * 🔴 Odgovor NE sadrži pseudonim deteta, datum rođenja ni bilo šta iz njegovog
 * naloga — samo pseudonim roditelja i uzrast u godinama. Potvrđuje se činjenica
 * koju potvrđivač i sam zna, a ne podatak koji mu se pokazuje.
 */
export async function GET() {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  return NextResponse.json({ potvrde: await potvrdeNaCekanju(session.user.id) });
}
