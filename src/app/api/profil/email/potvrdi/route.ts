import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { MODUL_DECA_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";
import { EmailGreska, potvrdiEmail } from "@/lib/protokol/dete-email";

/**
 * POST /api/profil/email/potvrdi — potvrda adrese linkom iz poruke.
 *
 * 🔴 POST, ne GET. Klijenti za poštu prefetch-uju linkove, pa bi GET potvrđivao
 * adresu bez ijednog ljudskog klika. Isti razlog kao kod odjave sa obaveštenja.
 *
 * Ne traži prijavu: link stiže u sanduče, a dete ga često otvara na drugom
 * uređaju. Sam token je dokaz da je onaj ko ga drži pristupio toj adresi.
 */
export async function POST(req: NextRequest) {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);

  let body: { token?: unknown };
  try {
    body = await req.json();
  } catch {
    return await greska("Neispravan zahtev.", 400);
  }

  try {
    return NextResponse.json(await potvrdiEmail(body.token));
  } catch (e) {
    if (e instanceof EmailGreska) return await greska(e.message, e.status);
    throw e;
  }
}
