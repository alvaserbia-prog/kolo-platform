import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes, createHash } from "crypto";

// PRIVREMENI test endpoint — simulira ceo reset tok korak po korak,
// i vraca detaljnu dijagnostiku na svakom koraku.
// Admin-only.
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen — samo admin." }, { status: 403 });
  }

  const trazeniEmail = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!trazeniEmail) {
    return NextResponse.json({ error: "Dodaj ?email=neki@email.com" }, { status: 400 });
  }

  const koraci: { korak: string; ok: boolean; info?: unknown; trajanje_ms?: number }[] = [];
  let pocetak = Date.now();

  // Korak 1: Pronađi korisnika
  const user = await prisma.user.findUnique({ where: { email: trazeniEmail } });
  koraci.push({
    korak: "1. Pronadji korisnika u bazi",
    ok: !!user,
    info: user
      ? {
          id: user.id,
          status: user.status,
          imaLozinku: !!user.passwordHash,
          oauthProvider: user.oauthProvider,
        }
      : "Nalog ne postoji",
    trajanje_ms: Date.now() - pocetak,
  });

  if (!user) {
    return NextResponse.json({ koraci, ishod: "STOP — nalog ne postoji" });
  }

  if (user.status !== "ACTIVE") {
    koraci.push({
      korak: "2. Provera statusa",
      ok: false,
      info: `Status nije ACTIVE: ${user.status}`,
    });
    return NextResponse.json({ koraci, ishod: "STOP — nalog nije aktivan" });
  }

  // Korak 2: Generiši token
  pocetak = Date.now();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  try {
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });
    koraci.push({
      korak: "2. Generisi i sacuvaj token",
      ok: true,
      info: { tokenLen: token.length, expiresAt },
      trajanje_ms: Date.now() - pocetak,
    });
  } catch (err) {
    koraci.push({
      korak: "2. Generisi i sacuvaj token",
      ok: false,
      info: err instanceof Error ? err.message : String(err),
      trajanje_ms: Date.now() - pocetak,
    });
    return NextResponse.json({ koraci, ishod: "STOP — token nije sacuvan" });
  }

  // Korak 3: Pozovi Resend
  pocetak = Date.now();
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM ?? "KOLO <noreply@ekolo.rs>";
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const link = `${NEXTAUTH_URL.replace(/\/$/, "")}/reset-lozinka/${token}`;

  if (!RESEND_KEY) {
    koraci.push({
      korak: "3. Pozovi Resend",
      ok: false,
      info: "RESEND_API_KEY nije postavljen",
    });
    return NextResponse.json({ koraci, ishod: "STOP — RESEND_API_KEY nedostaje" });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: user.email,
        subject: "TEST RESET — KOLO dijagnostika",
        html: `<p>Test reset email. Link: <a href="${link}">${link}</a></p>`,
      }),
    });
    const text = await res.text();
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    koraci.push({
      korak: "3. Pozovi Resend",
      ok: res.ok,
      info: {
        from: RESEND_FROM,
        to: user.email,
        link,
        apiKey: `${RESEND_KEY.slice(0, 6)}...${RESEND_KEY.slice(-4)}`,
        resendStatus: res.status,
        resendBody: body,
      },
      trajanje_ms: Date.now() - pocetak,
    });

    return NextResponse.json({
      koraci,
      ishod: res.ok ? "✅ Sve radi — email poslat ka Resend-u" : `⚠️ Resend HTTP ${res.status}`,
    });
  } catch (err) {
    koraci.push({
      korak: "3. Pozovi Resend",
      ok: false,
      info: {
        greska: err instanceof Error ? err.message : String(err),
        from: RESEND_FROM,
        apiKey: `${RESEND_KEY.slice(0, 6)}...${RESEND_KEY.slice(-4)}`,
      },
      trajanje_ms: Date.now() - pocetak,
    });
    return NextResponse.json({ koraci, ishod: "❌ Mreza/network greska ka Resend-u" });
  }
}
