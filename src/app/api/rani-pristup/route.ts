import { NextRequest, NextResponse } from "next/server";
import {
  RANI_PRISTUP_COOKIE,
  RANI_PRISTUP_MAX_AGE,
  raniPristupKonfigurisan,
  tacanRaniPristupKod,
} from "@/lib/rani-pristup";

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
