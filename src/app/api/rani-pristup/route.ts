import { NextRequest, NextResponse } from "next/server";
import {
  RANI_PRISTUP_COOKIE,
  RANI_PRISTUP_MAX_AGE,
  raniPristupKonfigurisan,
  tacanRaniPristupKod,
} from "@/lib/rani-pristup";

/**
 * Meki rate-limit po IP-u protiv pogađanja koda. In-memory je po instanci —
 * u serverless okruženju (više instanci / hladni start) nije robusno, ali
 * usporava automatsko pogađanje i srazmerno je „mekom" gate-u (kod je deljena
 * tajna, ne lozinka po korisniku). 8 pokušaja u minuti po IP-u.
 */
const POKUSAJI = new Map<string, { broj: number; resetAt: number }>();
const LIMIT_POKUSAJA = 8;
const PROZOR_MS = 60_000;

function rateLimitPrekoracen(ip: string): boolean {
  const sada = Date.now();
  const rec = POKUSAJI.get(ip);
  if (!rec || sada > rec.resetAt) {
    POKUSAJI.set(ip, { broj: 1, resetAt: sada + PROZOR_MS });
    // Povremeno očisti istekle unose da Map ne raste neograničeno.
    if (POKUSAJI.size > 5000) {
      for (const [k, v] of POKUSAJI) if (sada > v.resetAt) POKUSAJI.delete(k);
    }
    return false;
  }
  rec.broj += 1;
  return rec.broj > LIMIT_POKUSAJA;
}

function klijentIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Otključavanje ranog pristupa: korisnik unese pristupni kod, a mi postavljamo
 * httpOnly kolačić koji propušta gate (prijava/registracija) dok je MAINTENANCE_MODE
 * uključen. Vrednost kolačića je sam kod — rotacija RANI_PRISTUP_KOD-a poništava
 * sve ranije izdate kolačiće.
 */
export async function POST(req: NextRequest) {
  if (!raniPristupKonfigurisan()) {
    return NextResponse.json(
      { error: "Rani pristup trenutno nije aktiviran." },
      { status: 404 },
    );
  }

  if (rateLimitPrekoracen(klijentIp(req))) {
    return NextResponse.json(
      { error: "Previše pokušaja. Sačekaj minut pa pokušaj ponovo." },
      { status: 429 },
    );
  }

  let kod: unknown;
  try {
    const body = await req.json();
    kod = body?.kod;
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const uneti = typeof kod === "string" ? kod.trim() : null;
  if (!tacanRaniPristupKod(uneti)) {
    return NextResponse.json({ error: "Pogrešan pristupni kod." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(RANI_PRISTUP_COOKIE, process.env.RANI_PRISTUP_KOD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: RANI_PRISTUP_MAX_AGE,
  });
  return res;
}

/** Odjava iz ranog pristupa (briše kolačić). */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(RANI_PRISTUP_COOKIE);
  return res;
}
