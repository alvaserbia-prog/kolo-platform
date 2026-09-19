import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { greska } from "@/lib/greska-api";
import { MODUL_DECA_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";
import { DecaGreska } from "@/lib/protokol/deca";
import { obrisiSopstveniNalogNaCekanju } from "@/lib/protokol/deca-poziv";

/**
 * DELETE /api/deca/nalog — maloletni korisnik briše sopstveni nalog koji čeka
 * preuzimanje (Pravilnik o učešću dece, čl. 4a st. 6).
 *
 * Zašto zasebna ruta, a ne `DELETE /api/profil`: taj tok nalog ANONIMIZUJE i
 * čuva ga kao zapis (čl. 34 Pravilnika o KOLO sistemu), a ovde nalog treba da
 * NESTANE — u razdoblju pre pristanka nema šta da se čuva.
 */
export async function DELETE() {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  try {
    await obrisiSopstveniNalogNaCekanju(session.user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof DecaGreska) return await greska(e.message, e.status);
    throw e;
  }
}
