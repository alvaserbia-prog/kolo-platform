import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MODUL_DECA_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";
import { DecaGreska, dohvatiRazgovoreDeteta } from "@/lib/protokol/deca";

/**
 * GET /api/deca/[id]/razgovori — roditelj čita razgovore svog deteta (čl. 9).
 *
 * Samo čitanje. Rute kojom bi roditelj napisao poruku u detetov razgovor NEMA, i
 * to je namerno: sa druge strane je tuđe dete, a odnos deteta i punoletnog
 * korisnika otvara prekidač koji daje TUĐI roditelj (čl. 10).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  const { id } = await params;

  try {
    return NextResponse.json({ razgovori: await dohvatiRazgovoreDeteta(session.user.id, id) });
  } catch (e) {
    if (e instanceof DecaGreska) return await greska(e.message, e.status);
    throw e;
  }
}
