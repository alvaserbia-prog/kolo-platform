import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AwsClient } from "aws4fetch";
import { r2Konfigurisan, sacuvajNaR2, obrisiSaR2 } from "@/lib/skladiste";

/**
 * GET /api/admin/blob-debug
 * PRIVREMENA dijagnostika Cloudflare R2.
 *  - vraća KOJE R2_* env varijable postoje (samo imena/dužine — ništa tajno),
 *  - radi STVARNI test upload (PUT) malog objekta i vraća TAČAN status + telo
 *    odgovora R2 servera (tu se vidi 403/404/SignatureDoesNotMatch/itd.).
 * Dostupno svakom ulogovanom korisniku jer na testu nema admin naloga.
 * UKLONITI posle dijagnostike.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const ACCOUNT = process.env.R2_ACCOUNT_ID ?? "";
  const BUCKET = process.env.R2_BUCKET ?? "";
  const PUBLIC = process.env.R2_PUBLIC_URL ?? "";
  const KEY = process.env.R2_ACCESS_KEY_ID ?? "";
  const SECRET = process.env.R2_SECRET_ACCESS_KEY ?? "";

  const konfiguracija = {
    r2Konfigurisan: r2Konfigurisan(),
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nedostaje: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"]
      .filter((k) => !process.env[k]),
    // bezbedni uvidi (bez tajni)
    accountIdDuzina: ACCOUNT.length,
    accessKeyIdDuzina: KEY.length,
    secretDuzina: SECRET.length,
    bucket: BUCKET,
    publicUrl: PUBLIC,
    endpointHost: ACCOUNT ? `${ACCOUNT}.r2.cloudflarestorage.com` : null,
  };

  if (!r2Konfigurisan()) {
    return NextResponse.json({ ...konfiguracija, test: "preskočen — R2 nije konfigurisan" });
  }

  // --- 1) Sirovi PUT direktno preko aws4fetch (vidimo TAČAN status + telo) ---
  const kljuc = `dijagnostika/test-${Date.now()}.txt`;
  const safe = kljuc.split("/").map(encodeURIComponent).join("/");
  const endpoint = `https://${ACCOUNT}.r2.cloudflarestorage.com/${BUCKET}/${safe}`;
  const siroviRezultat: Record<string, unknown> = { endpoint };
  try {
    const aws = new AwsClient({ accessKeyId: KEY, secretAccessKey: SECRET, region: "auto", service: "s3" });
    const res = await aws.fetch(endpoint, {
      method: "PUT",
      body: new TextEncoder().encode("kolo-r2-test").buffer as ArrayBuffer,
      headers: { "Content-Type": "text/plain" },
    });
    siroviRezultat.status = res.status;
    siroviRezultat.ok = res.ok;
    siroviRezultat.telo = (await res.text().catch(() => "")).slice(0, 800);
  } catch (e) {
    siroviRezultat.izuzetak = e instanceof Error ? e.message : String(e);
  }

  // --- 2) Test preko helpera sacuvajNaR2 (isti put kao oglasi) — malo telo ---
  const helperRezultat: Record<string, unknown> = {};
  try {
    const url = await sacuvajNaR2(
      `dijagnostika/helper-${Date.now()}.txt`,
      Buffer.from("kolo-helper-test"),
      "text/plain"
    );
    helperRezultat.uspeh = true;
    helperRezultat.vracenURL = url;
    await obrisiSaR2(url); // počisti
  } catch (e) {
    helperRezultat.uspeh = false;
    helperRezultat.greska = e instanceof Error ? e.message : String(e);
  }

  // --- 3) Test VELIKOG tela (~2MB) — reprodukuje uslov iz prave slike (411) ---
  const velikoTeloRezultat: Record<string, unknown> = {};
  try {
    const veliki = Buffer.alloc(2 * 1024 * 1024, 1); // 2MB
    velikoTeloRezultat.bajtova = veliki.byteLength;
    const url = await sacuvajNaR2(
      `dijagnostika/veliki-${Date.now()}.bin`,
      veliki,
      "application/octet-stream"
    );
    velikoTeloRezultat.uspeh = true;
    velikoTeloRezultat.vracenURL = url;
    await obrisiSaR2(url); // počisti
  } catch (e) {
    velikoTeloRezultat.uspeh = false;
    velikoTeloRezultat.greska = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({ ...konfiguracija, siroviRezultat, helperRezultat, velikoTeloRezultat });
}
