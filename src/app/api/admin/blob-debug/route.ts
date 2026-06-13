import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { blobToken } from "@/lib/blob";

/**
 * GET /api/admin/blob-debug
 * PRIVREMENA dijagnostika: vraća SAMO IMENA env varijabli vezanih za Blob/token
 * (bez vrednosti — ništa tajno se ne otkriva) + da li blobToken() nešto nalazi.
 * Dostupno svakom ulogovanom korisniku jer na testu nema admin naloga. UKLONITI
 * posle dijagnostike.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const svaImena = Object.keys(process.env);
  const blobImena = svaImena.filter((k) => /BLOB|READ_WRITE_TOKEN|TOKEN/i.test(k));

  return NextResponse.json({
    blobTokenPronadjen: !!blobToken(),
    vercelEnv: process.env.VERCEL_ENV ?? null, // production | preview | development
    imenaTokenEnv: blobImena, // samo imena, bez vrednosti
    ukupnoEnvVarijabli: svaImena.length,
  });
}
