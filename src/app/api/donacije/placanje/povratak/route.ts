import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evidentirajDonaciju } from "@/lib/protokol/donacija";
import {
  dohvatiNestpayConfig,
  verifikujOdgovor,
  uspesnoPlacanje,
} from "@/lib/placanje/nestpay";

/**
 * Povratna (callback) tačka na koju NestPay (Banca Intesa / OTP) POST-uje
 * rezultat 3D Secure plaćanja. Ovo je cross-site POST iz domena banke — sesija
 * korisnika ovde NIJE dostupna, pa se identitet utvrđuje preko `oid` → zapis
 * donacije, a autentičnost poruke preko verifikacije HASH-a (tajni store key).
 *
 * Tok: verifikuj HASH → nađi zapis po oid → proveri iznos → (idempotentno)
 * priznaj donaciju i emituj POEN → preusmeri korisnika na stranicu rezultata.
 */
export async function POST(req: NextRequest) {
  const base =
    process.env.APP_BASE_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const rezultat = (ishod: "uspeh" | "neuspeh" | "greska") =>
    NextResponse.redirect(`${base.replace(/\/$/, "")}/donacije?placanje=${ishod}`, 303);

  let params: Record<string, string> = {};
  try {
    const form = await req.formData();
    for (const [k, v] of form.entries()) params[k] = typeof v === "string" ? v : "";
  } catch {
    return rezultat("greska");
  }

  const oid = params["oid"] ?? params["ReturnOid"] ?? "";
  if (!oid) return rezultat("greska");

  const zapis = await prisma.donationRecord.findUnique({
    where: { oid },
    select: { id: true, userId: true, amountRSD: true, status: true, provajder: true, javno: true },
  });
  if (!zapis) return rezultat("greska");

  // Verifikacija potpisa odgovora ključem TAČNO onog provajdera kojim je zapis kreiran.
  const cfg = dohvatiNestpayConfig(zapis.provajder ?? undefined);
  if (!cfg || !verifikujOdgovor(params, cfg.storeKey)) {
    return rezultat("greska");
  }

  // Idempotencija: ako je već priznata, ne emituj POEN ponovo.
  if (zapis.status === "CONFIRMED") {
    return rezultat("uspeh");
  }

  if (!uspesnoPlacanje(params)) {
    await prisma.donationRecord.update({
      where: { id: zapis.id },
      data: { bankRef: `NEUSPEH:${params["ProcReturnCode"] ?? params["Response"] ?? "?"}` },
    });
    return rezultat("neuspeh");
  }

  // Iznos iz odgovora mora da se poklapa sa iznosom iz zapisa (anti-tampering).
  const vraceniIznos = Math.round(Number(params["amount"]));
  const ocekivaniIznos = Math.round(Number(zapis.amountRSD));
  if (!Number.isFinite(vraceniIznos) || vraceniIznos !== ocekivaniIznos) {
    await prisma.donationRecord.update({
      where: { id: zapis.id },
      data: { bankRef: "NEUSPEH:IZNOS_NE_ODGOVARA" },
    });
    return rezultat("greska");
  }

  // ATOMSKA IDEMPOTENCIJA: preuzmi zapis iz PENDING u CONFIRMED jednim uslovnim
  // upitom. Banke znaju da pošalju callback više puta (mrežni retry); samo jedan
  // poziv može da preuzme zapis i emituje POEN — ostali otpadaju (count !== 1).
  const preuzeto = await prisma.donationRecord.updateMany({
    where: { id: zapis.id, status: "PENDING" },
    data: { status: "CONFIRMED" },
  });
  if (preuzeto.count !== 1) {
    // Drugi (paralelni) callback je već preuzeo i obrađuje/obradio ovaj zapis.
    return rezultat("uspeh");
  }

  // Priznaj donaciju i emituj POEN (koeficijentni model). Koristi iznos iz zapisa.
  // Napomena: kumulativ u `evidentirajDonaciju` isključuje upravo ovaj zapis (postavljen
  // je na CONFIRMED gore), pa nema dvostrukog brojanja tekuće donacije.
  try {
    await evidentirajDonaciju(zapis.userId, ocekivaniIznos, {
      existingRecordId: zapis.id,
      javno: zapis.javno,
    });
    await prisma.donationRecord.update({
      where: { id: zapis.id },
      data: { bankRef: params["AuthCode"] || params["TransId"] || "OK" },
    });
  } catch {
    return rezultat("greska");
  }

  return rezultat("uspeh");
}

// Banka uvek POST-uje rezultat; GET samo vraća korisnika na stranicu donacija.
export async function GET(req: NextRequest) {
  const base =
    process.env.APP_BASE_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
  return NextResponse.redirect(`${base.replace(/\/$/, "")}/donacije`, 303);
}
