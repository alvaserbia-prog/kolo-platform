import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MODUL_DECA_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";
import { DecaGreska, izjasniSe } from "@/lib/protokol/deca";

/**
 * POST /api/deca/potvrde/[id] — izjašnjenje potvrđivača (čl. 6).
 *
 * Prima samo dva odgovora: `POTVRDIO` i `OSPORIO`. „Nemam saznanja o tome" se NE
 * šalje ovamo — po pravilniku je to isto što i ćutanje, pa zapis ostaje da čeka
 * istek roka. Da se beleži kao okončan, čovek bi mislio da je posao završio, a
 * potvrda bi mu ipak pala.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  const { id } = await params;

  let body: { odgovor?: unknown; obrazlozenje?: unknown };
  try {
    body = await req.json();
  } catch {
    return await greska("Neispravan zahtev.", 400);
  }
  if (body.odgovor !== "POTVRDIO" && body.odgovor !== "OSPORIO") {
    return await greska("Neispravan odgovor.", 400);
  }
  const obrazlozenje = typeof body.obrazlozenje === "string" ? body.obrazlozenje : undefined;
  if (obrazlozenje && obrazlozenje.length > 1000) {
    return await greska("Obrazloženje može imati najviše 1000 karaktera.", 400);
  }

  try {
    return NextResponse.json(await izjasniSe(session.user.id, id, body.odgovor, obrazlozenje));
  } catch (e) {
    if (e instanceof DecaGreska) return await greska(e.message, e.status);
    throw e;
  }
}
