import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "node:crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MIN_IPS_RSD,
  ipsAktivno,
  dohvatiIpsConfig,
  generisiPozivNaBroj,
  nasumicnaOsnova,
  sklopiIpsString,
} from "@/lib/placanje/ips-qr";

/**
 * GET — informacije za prikaz IPS sekcije (da li je konfigurisano + javni
 * podaci primaoca i limiti). Dok račun nije podešen, `konfigurisan=false` i
 * klijent prikaže poruku „uskoro".
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const cfg = dohvatiIpsConfig();
  if (!cfg || !ipsAktivno()) {
    return NextResponse.json({ konfigurisan: false });
  }
  return NextResponse.json({
    konfigurisan: true,
    racun: cfg.racun,
    primalac: cfg.primalac,
    minRSD: MIN_IPS_RSD,
    maxRSD: cfg.maxRSD,
  });
}

/**
 * POST — generiše dinamički IPS QR za donaciju. Kreira PENDING zapis donacije
 * sa jedinstvenim pozivom na broj (model 97) i vraća IPS string (za QR) +
 * podatke za prikaz. POEN se NE emituje ovde — admin potvrđuje priliv po
 * pozivu na broj u admin panelu (kao i kod ručne uplate).
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnik može da donira." }, { status: 403 });

  const cfg = dohvatiIpsConfig();
  if (!cfg || !ipsAktivno()) {
    return NextResponse.json(
      { error: "IPS plaćanje trenutno nije konfigurisano. Koristite uplatu na račun.", nedostupno: true },
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
  if (!Number.isFinite(iznosRSD) || iznosRSD < MIN_IPS_RSD || iznosRSD > cfg.maxRSD) {
    return NextResponse.json(
      {
        error: `Iznos mora biti između ${MIN_IPS_RSD.toLocaleString("sr-RS")} i ${cfg.maxRSD.toLocaleString(
          "sr-RS"
        )} RSD. Veće iznose uplatite klasičnom uplatom ili karticom.`,
      },
      { status: 400 }
    );
  }

  // Javna donacija (default) nosi POEN i javno ime; anonimna ne nosi POEN.
  const javno = body.javno !== false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, wallet: { select: { id: true } }, podaci: { select: { punoIme: true } } },
  });
  if (!user?.wallet) {
    return NextResponse.json({ error: "Korisnik nema novčanik." }, { status: 400 });
  }

  // Javna donacija zahteva uneto ime i prezime (čl. 5a) — provera PRE generisanja.
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

  // Jedinstven poziv na broj (model 97). Nekoliko pokušaja u slučaju (krajnje
  // malo verovatne) kolizije nasumične osnove.
  let pozivNaBroj = "";
  for (let i = 0; i < 5; i++) {
    const kandidat = generisiPozivNaBroj(nasumicnaOsnova(crypto.randomBytes(12)));
    const postoji = await prisma.donationRecord.findFirst({
      where: { referenceNumber: kandidat },
      select: { id: true },
    });
    if (!postoji) {
      pozivNaBroj = kandidat;
      break;
    }
  }
  if (!pozivNaBroj) {
    return NextResponse.json({ error: "Greška pri generisanju poziva na broj. Pokušajte ponovo." }, { status: 500 });
  }

  await prisma.donationRecord.create({
    data: {
      userId: user.id,
      amountRSD: iznosRSD,
      cumulativeRSD: 0,
      level: 0,
      poenEmitted: 0,
      javno,
      status: "PENDING",
      nacinUplate: "IPS",
      provajder: "IPS",
      referenceNumber: pozivNaBroj,
    },
  });

  const ipsString = sklopiIpsString({ cfg, iznosRSD, pozivNaBroj });

  return NextResponse.json({
    ipsString,
    racun: cfg.racun,
    primalac: cfg.primalac,
    svrha: cfg.svrha,
    iznosRSD,
    model: "97",
    pozivNaBroj,
  });
}
