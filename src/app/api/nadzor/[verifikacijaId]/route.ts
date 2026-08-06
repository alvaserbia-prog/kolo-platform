/**
 * POST /api/nadzor/[verifikacijaId]
 *
 * Nadzornik (POCETNI / NOSILAC_ZRNA) potvrđuje verifikaciju.
 * Po uspehu: nadzornikId i nadzoranAt postavljeni, verifikator dobija slot nazad,
 * nadzornik dobija 500 POEN-a.
 */
import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { obaviNadzor, NadzorGreska } from "@/lib/protokol/nadzor-service";
import { logAdminAkcija } from "@/lib/audit";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ verifikacijaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return await greska("Nisi prijavljen.", 401);
  }

  const { verifikacijaId } = await ctx.params;

  try {
    const rez = await obaviNadzor({
      verifikacijaId,
      nadzornikId: session.user.id,
    });
    await logAdminAkcija(session.user.id, "NADZOR_POTVRDJEN", verifikacijaId);
    return NextResponse.json(rez);
  } catch (e) {
    if (e instanceof NadzorGreska) {
      return await greska(e.message, e.statusCode);
    }
    console.error("[POST /api/nadzor/[verifikacijaId]]", e);
    return await greska("Greška servera", 500);
  }
}
