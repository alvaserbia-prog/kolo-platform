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
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  izvrsiVerifikaciju,
  VerifikacijaGreska,
} from "@/lib/protokol/verifikacija-service";
import { obavesti } from "@/lib/notifikacije";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return await greska("Nisi prijavljen.", 401);
  }

  // Anti brute-force 6-cifrenog koda: najviše 10 pokušaja u minuti po verifikatoru.
  const rl = rateLimit(`verifikacija:${session.user.id}`, 10, 60_000);
  if (!rl.ok) {
    return await greska(`Previše pokušaja. Sačekaj ${rl.retryAfterSec}s.`, 429);
  }

  let body: { token?: string; potvrdaPoznavanja?: boolean; oznaka?: string };
  try {
    body = await req.json();
  } catch {
    return await greska("Nevažeći JSON.", 400);
  }

  const tokenIliBroj = typeof body.token === "string" ? body.token : "";
  const potvrdaPoznavanja = body.potvrdaPoznavanja === true;
  const oznaka = typeof body.oznaka === "string" ? body.oznaka : undefined;

  try {
    const rez = await izvrsiVerifikaciju({
      verifikatorId: session.user.id,
      tokenIliBroj,
      potvrdaPoznavanja,
      oznaka,
    });

    // Obavesti verifikovanog (zvonce + push + email), sa pozivom na prijavu ako
    // ne poznaje verifikatora — isto kao put sa table jemstva. Ne blokira odgovor.
    void obavesti(rez.verifikovaniId, {
      tip: "VERIFIKOVAN",
      kljuc: "notifikacije.verifikovan",
      parametri: { verifikator: rez.verifikatorPseudonim },
      naslov: "Verifikovan/a si — možeš da postaviš oglas",
      tekst:
        `„${rez.verifikatorPseudonim}" te je verifikovao/la i dobio/la si pun pristup. ` +
        `Sad možeš da postaviš oglas na Pijaci, pišeš poruke i upišeš ZRNO. ` +
        `Ako ne poznaješ ovu osobu, prijavi verifikaciju na stranici Verifikacija.`,
      link: "/pijaca/novi-oglas",
      emailDugme: "Postavi oglas",
    });

    return NextResponse.json({
      verifikacijaId: rez.verifikacijaId,
      verifikovaniPseudonim: rez.verifikovaniPseudonim,
      verifikovaniNoviIndeks: rez.verifikovaniNoviIndeks,
    });
  } catch (e) {
    if (e instanceof VerifikacijaGreska) {
      return await greska(e.message, e.statusCode);
    }
    console.error("[POST /api/verifikacija]", e);
    return await greska("Greška servera", 500);
  }
}
