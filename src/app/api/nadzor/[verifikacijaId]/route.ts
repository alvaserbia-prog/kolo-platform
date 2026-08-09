/**
 * POST /api/nadzor/[verifikacijaId]
 *
 * Nadzornik (nosilac ZRNA) evidentira ISHOD nadzora nad verifikacijom:
 * `uredno` | `za_proveru` | `sporno` (dokaz stvarnosti 4.2.0, čl. 11).
 *
 * Do 4.2.0 je ruta imala jedan jedini efekat — potvrdi. Ko posumnja nije imao gde
 * to da upiše, pa ni traga o tome nije bilo.
 *
 * Telo: { ishod, subjekt?, razlog?, opis? }. Subjekt i razlog su obavezni uz
 * „za proveru" i „sporno" (čl. 11 st. 3).
 */
import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  obaviNadzor,
  NadzorGreska,
  type Ishod,
  type Subjekt,
  type Razlog,
} from "@/lib/protokol/nadzor-service";
import { logAdminAkcija } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ verifikacijaId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return await greska("Nisi prijavljen.", 401);
  }

  const { verifikacijaId } = await ctx.params;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // Prazno telo — ishod se ne može pretpostaviti. Ranije je ruta imala samo jedan
    // efekat, pa tela nije ni bilo; sada bez ishoda nema šta da se evidentira.
    return await greska("Nedostaje ishod nadzora.", 400);
  }

  try {
    const rez = await obaviNadzor({
      verifikacijaId,
      nadzornikId: session.user.id,
      ishod: body.ishod as Ishod,
      subjekt: (body.subjekt as Subjekt) ?? null,
      razlog: (body.razlog as Razlog) ?? null,
      opis: typeof body.opis === "string" ? body.opis : null,
    });

    await logAdminAkcija(
      session.user.id,
      "NADZOR_ISHOD",
      verifikacijaId,
      `${rez.ishod}: ${rez.verifikatorPseudonim} → ${rez.verifikovaniPseudonim}` +
        (rez.predmetOtvoren ? " — otvoren nadzorni predmet" : "")
    );
    if (rez.predmetOtvoren) {
      await logAdminAkcija(
        session.user.id,
        "NADZORNI_PREDMET_OTVOREN",
        verifikacijaId,
        `${rez.verifikatorPseudonim} → ${rez.verifikovaniPseudonim}`
      );
    }

    return NextResponse.json(rez);
  } catch (e) {
    if (e instanceof NadzorGreska) {
      return await greska(e.message, e.statusCode);
    }
    console.error("[POST /api/nadzor/[verifikacijaId]]", e);
    return await greska("Greška servera", 500);
  }
}
