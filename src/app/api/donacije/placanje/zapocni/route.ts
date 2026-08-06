import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "node:crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  placanjeAktivno,
  dohvatiNestpayConfig,
  pripremiZahtev,
} from "@/lib/placanje/nestpay";

const MIN_RSD = 100;
const MAX_RSD = 2_000_000;

/**
 * Inicira kartično plaćanje donacije. Kreira PENDING zapis donacije sa
 * jedinstvenim `oid`-om i vraća polja forme koja klijent (auto-)POST-uje na
 * NestPay gateway banke. POEN se NE emituje ovde — tek po verifikovanom
 * povratku banke (`/api/donacije/placanje/povratak`).
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnik može da donira." }, { status: 403 });

  if (!placanjeAktivno()) {
    return NextResponse.json(
      { error: "Kartično plaćanje trenutno nije aktivno. Koristite uplatu na račun.", nedostupno: true },
      { status: 503 }
    );
  }

  const cfg = dohvatiNestpayConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Platni procesor nije konfigurisan.", nedostupno: true },
      { status: 503 }
    );
  }

  let body: { iznosRSD?: unknown; javno?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const iznosRSD = Math.round(Number(body.iznosRSD));
  if (!Number.isFinite(iznosRSD) || iznosRSD < MIN_RSD || iznosRSD > MAX_RSD) {
    return NextResponse.json(
      { error: `Iznos mora biti između ${MIN_RSD.toLocaleString("sr-RS")} i ${MAX_RSD.toLocaleString("sr-RS")} RSD.` },
      { status: 400 }
    );
  }

  // Javna donacija (default) nosi POEN i javno ime; anonimna ne nosi POEN.
  const javno = body.javno !== false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      wallet: { select: { id: true } },
      podaci: { select: { punoIme: true } },
    },
  });
  if (!user?.wallet) {
    return NextResponse.json({ error: "Korisnik nema novčanik." }, { status: 400 });
  }

  // Javna donacija zahteva uneto ime i prezime (čl. 5a) — provera PRE naplate.
  if (javno && !user.podaci?.punoIme?.trim()) {
    return NextResponse.json(
      {
        error:
          "Za javnu donaciju (sa POEN) unesite ime i prezime u profilu, ili izaberite anonimnu donaciju (bez POEN-a).",
        trebaPunoIme: true,
      },
      { status: 400 }
    );
  }

  // Jedinstveni broj porudžbine (oid) — bez separatora, alfanumerički.
  const oid = `KOLO${Date.now().toString(36).toUpperCase()}${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;

  await prisma.donationRecord.create({
    data: {
      userId: user.id,
      amountRSD: iznosRSD,
      cumulativeRSD: 0,
      level: 0,
      poenEmitted: 0,
      javno,
      status: "PENDING",
      nacinUplate: "KARTICA",
      provajder: cfg.provajder,
      oid,
    },
  });

  const base =
    process.env.APP_BASE_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const callback = `${base.replace(/\/$/, "")}/api/donacije/placanje/povratak`;

  const { gatewayUrl, fields } = pripremiZahtev(cfg, {
    oid,
    iznosRSD,
    okUrl: callback,
    failUrl: callback,
    email: user.email ?? undefined,
    lang: "sr",
  });

  return NextResponse.json({ gatewayUrl, fields });
}
