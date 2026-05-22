/**
 * POST /api/nadzor/[verifikacijaId]
 *
 * Nadzornik (POCETNI / NOSILAC_ZRNA) potvrđuje verifikaciju.
 * Po uspehu: nadzornikId i nadzoranAt postavljeni, verifikator dobija slot nazad,
 * nadzornik dobija 500 POEN-a.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { obaviNadzor, NadzorGreska } from "@/lib/protokol/nadzor-service";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ verifikacijaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }

  const { verifikacijaId } = await ctx.params;

  try {
    const rez = await obaviNadzor({
      verifikacijaId,
      nadzornikId: session.user.id,
    });
    return NextResponse.json(rez);
  } catch (e) {
    if (e instanceof NadzorGreska) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    console.error("[POST /api/nadzor/[verifikacijaId]]", e);
    return NextResponse.json({ error: "Greška servera" }, { status: 500 });
  }
}
