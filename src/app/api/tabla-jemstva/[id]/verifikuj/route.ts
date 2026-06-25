/**
 * POST /api/tabla-jemstva/[id]/verifikuj
 *
 * Verifikator (indeks ≥10% / NOSILAC_ZRNA) verifikuje neverifikovanog DIREKTNO sa
 * kartice zahteva za jemstvo. Bez tokena — osoba se predstavila na tabli i time dala
 * pristanak; verifikator klikom potvrđuje lično poznavanje i odgovornost (čl. 5).
 *
 * Body: { potvrdaPoznavanja: boolean, oznaka?: string }
 *
 * Po uspehu: kreira VerifikacionaVeza, troši slot, emituje POEN za oba i obaveštava
 * verifikovanog (sa mogućnošću prijave ako ne poznaje verifikatora).
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  izvrsiVerifikacijuSaTable,
  VerifikacijaGreska,
} from "@/lib/protokol/verifikacija-service";
import { posaljiNotifikaciju } from "@/lib/notifikacije";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }

  // Anti-naval: najviše 10 verifikacija sa table u minuti po verifikatoru.
  const rl = rateLimit(`verifikacija-tabla:${session.user.id}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Previše pokušaja. Sačekaj ${rl.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  const { id } = await params;

  let body: { potvrdaPoznavanja?: boolean; oznaka?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nevažeći JSON." }, { status: 400 });
  }

  const potvrdaPoznavanja = body.potvrdaPoznavanja === true;
  const oznaka = typeof body.oznaka === "string" ? body.oznaka : undefined;

  try {
    const rez = await izvrsiVerifikacijuSaTable({
      verifikatorId: session.user.id,
      jemstvoId: id,
      potvrdaPoznavanja,
      oznaka,
    });

    // Obavesti verifikovanog — bez kapije, sa pozivom na prijavu ako ne poznaje
    // verifikatora (hrani nadzor integriteta). Ne blokira odgovor.
    void posaljiNotifikaciju(
      rez.verifikovaniId,
      "VERIFIKOVAN",
      "Verifikovan/a si",
      `„${rez.verifikatorPseudonim}" te je verifikovao/la i dobio/la si pun pristup. ` +
        `Ako ne poznaješ ovu osobu, prijavi verifikaciju.`,
      "/verifikacija"
    );

    return NextResponse.json({
      verifikacijaId: rez.verifikacijaId,
      verifikovaniPseudonim: rez.verifikovaniPseudonim,
      verifikovaniNoviIndeks: rez.verifikovaniNoviIndeks,
    });
  } catch (e) {
    if (e instanceof VerifikacijaGreska) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    console.error("[POST /api/tabla-jemstva/[id]/verifikuj]", e);
    return NextResponse.json({ error: "Greška servera" }, { status: 500 });
  }
}
