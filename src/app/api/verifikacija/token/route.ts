/**
 * POST /api/verifikacija/token
 *
 * Generiše jednokratan QR token za logovanog korisnika.
 * Token važi 60 sekundi. Vraća { token, brojCifara, expiresAt }.
 *
 * Korisnik koji hoće da bude verifikovan poziva ovaj endpoint pre nego što
 * verifikator skenira njegov QR ili unese 6-cifren broj.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  generisiTokenZaVerifikaciju,
  VerifikacijaGreska,
} from "@/lib/protokol/verifikacija-service";

// Rate limit: 6 tokena u minuti po korisniku (in-memory; za produkciju zameniti Redis-om).
const rateMap = new Map<string, number[]>();
const LIMIT_PO_MINUTI = 6;

function dozvoljen(userId: string): boolean {
  const sad = Date.now();
  const istorija = (rateMap.get(userId) ?? []).filter((t) => sad - t < 60_000);
  if (istorija.length >= LIMIT_PO_MINUTI) return false;
  istorija.push(sad);
  rateMap.set(userId, istorija);
  return true;
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  }
  if (!dozvoljen(session.user.id)) {
    return NextResponse.json(
      { error: "Previše zahteva, sačekaj malo." },
      { status: 429 }
    );
  }

  try {
    const { token, brojCifara, expiresAt } = await generisiTokenZaVerifikaciju(
      session.user.id
    );
    return NextResponse.json({ token, brojCifara, expiresAt: expiresAt.toISOString() });
  } catch (e) {
    if (e instanceof VerifikacijaGreska) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    console.error("[POST /api/verifikacija/token]", e);
    return NextResponse.json({ error: "Greška servera" }, { status: 500 });
  }
}
