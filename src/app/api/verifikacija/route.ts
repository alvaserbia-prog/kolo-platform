/**
 * POST /api/verifikacija
 *
 * Verifikator izvršava verifikaciju koristeći token verifikovanog.
 * Body: { token: string, potvrdaPoznavanja: boolean }
 *   - token: 64-char hex (iz QR-a) ili 6-cifren broj
 *   - potvrdaPoznavanja: mora biti true (lično poznavanje + odgovornost, čl. 5)
 *
 * Po uspehu: kreira VerifikacionaVeza, troši slot, emituje POEN za oba.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  izvrsiVerifikaciju,
  VerifikacijaGreska,
} from "@/lib/protokol/verifikacija-service";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }

  let body: { token?: string; potvrdaPoznavanja?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nevažeći JSON." }, { status: 400 });
  }

  const tokenIliBroj = typeof body.token === "string" ? body.token : "";
  const potvrdaPoznavanja = body.potvrdaPoznavanja === true;

  try {
    const rez = await izvrsiVerifikaciju({
      verifikatorId: session.user.id,
      tokenIliBroj,
      potvrdaPoznavanja,
    });
    return NextResponse.json({
      verifikacijaId: rez.verifikacijaId,
      verifikovaniPseudonim: rez.verifikovaniPseudonim,
      verifikovaniNoviIndeks: rez.verifikovaniNoviIndeks,
    });
  } catch (e) {
    if (e instanceof VerifikacijaGreska) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    console.error("[POST /api/verifikacija]", e);
    return NextResponse.json({ error: "Greška servera" }, { status: 500 });
  }
}
