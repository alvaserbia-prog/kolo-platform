import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { r2Konfigurisan } from "@/lib/skladiste";

/**
 * GET /api/admin/blob-debug
 * PRIVREMENA dijagnostika: vraća da li je Cloudflare R2 konfigurisan i KOJE
 * R2_* env varijable postoje (samo IMENA, bez vrednosti — ništa tajno).
 * Dostupno svakom ulogovanom korisniku jer na testu nema admin naloga.
 * UKLONITI posle dijagnostike.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const svaImena = Object.keys(process.env);
  const r2Imena = svaImena.filter((k) => /^R2_/i.test(k));

  return NextResponse.json({
    r2Konfigurisan: r2Konfigurisan(),
    vercelEnv: process.env.VERCEL_ENV ?? null, // production | preview | development
    imenaR2Env: r2Imena, // samo imena, bez vrednosti
    nedostaje: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"]
      .filter((k) => !process.env[k]),
    ukupnoEnvVarijabli: svaImena.length,
  });
}
