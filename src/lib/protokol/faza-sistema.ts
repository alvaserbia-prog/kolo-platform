/**
 * Faza sistema — automatski prelaz iz Faze 1 u Fazu 2 (Pravilnik v3.7.0, čl. 42, 44).
 *
 * Faza 1: pravila Protokola postavlja osnivač u saradnji sa Fondacijom.
 * Faza 2: Gornje Kolo postaje upravno telo sistema.
 *
 * Prelaz iz Faze 1 u Fazu 2 nastupa AUTOMATSKI po dostizanju praga od 1.000.000
 * evidentiranih POEN-a u sistemu (čl. 44 — obračunski ekvivalent: stanje Protokola
 * od −1.000.000). Dostizanje praga istovremeno aktivira mogućnost upisa ZRNA
 * i uspostavlja Gornje Kolo.
 *
 * Aktivacija ZrnoTrziste.isActive je jednosmerni proces — kada se postavi na
 * true, ostaje true (Gornje Kolo postoji od trenutka aktivacije pa nadalje).
 */

import { prisma } from "@/lib/prisma";

const PROTOKOL_WALLET_ID = "banka-singleton";

/** Prag prelaza Faze 1 → Faze 2 (čl. 44). */
export const PRAG_FAZE_2_POEN = 1_000_000;

export type FazaSistema = "FAZA_1" | "FAZA_2";

export interface FazaStatus {
  faza: FazaSistema;
  ukupnoPoenEvidentirano: number;
  prag: number;
  trzisteAktivno: boolean;
  trzisteAktiviranoAt: Date | null;
  preslaNaFazu2SadasnjomProverom: boolean;
}

/**
 * Vraća ukupan broj evidentiranih POEN-a u sistemu (= |balance| Protokola,
 * po zero-sum invarijanti, čl. 14).
 */
export async function ukupnoEvidentiranoPoen(): Promise<number> {
  const protokol = await prisma.wallet.findUnique({
    where: { id: PROTOKOL_WALLET_ID },
    select: { balance: true },
  });
  return Math.abs(protokol?.balance ?? 0);
}

/**
 * Proverava da li je dostignut prag prelaza i, ako jeste, aktivira ZRNO tržište
 * (uspostavlja Gornje Kolo). Bezbedno je pozivati više puta — ako je tržište
 * već aktivno, ne radi ništa.
 *
 * Poziva se iz noćne emisije nakon obračuna (kad se zna konačno stanje POEN-a
 * za obračunski period).
 */
export async function proveriIAktivirajFazu2(): Promise<FazaStatus> {
  const ukupno = await ukupnoEvidentiranoPoen();
  const trziste = await prisma.zrnoTrziste.findUnique({
    where: { id: "singleton" },
  });

  const trzisteVecAktivno = trziste?.isActive ?? false;
  let preslaSada = false;
  let trzisteAktiviranoAt = trziste?.activatedAt ?? null;

  if (ukupno >= PRAG_FAZE_2_POEN && !trzisteVecAktivno) {
    const sada = new Date();
    await prisma.zrnoTrziste.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", isActive: true, activatedAt: sada },
      update: { isActive: true, activatedAt: sada },
    });
    preslaSada = true;
    trzisteAktiviranoAt = sada;
    console.log(
      `[faza-sistema] PRELAZ FAZA_1 → FAZA_2: ukupno ${ukupno.toLocaleString("sr-RS")} POEN, prag ${PRAG_FAZE_2_POEN.toLocaleString("sr-RS")}. ZRNO tržište aktivirano.`
    );
  }

  return {
    faza: ukupno >= PRAG_FAZE_2_POEN ? "FAZA_2" : "FAZA_1",
    ukupnoPoenEvidentirano: ukupno,
    prag: PRAG_FAZE_2_POEN,
    trzisteAktivno: preslaSada || trzisteVecAktivno,
    trzisteAktiviranoAt,
    preslaNaFazu2SadasnjomProverom: preslaSada,
  };
}

/**
 * Vraća trenutni status faze bez izmena (read-only). Koristi se za prikaz.
 */
export async function dohvatiFazuStatus(): Promise<FazaStatus> {
  const ukupno = await ukupnoEvidentiranoPoen();
  const trziste = await prisma.zrnoTrziste.findUnique({
    where: { id: "singleton" },
  });
  return {
    faza: ukupno >= PRAG_FAZE_2_POEN ? "FAZA_2" : "FAZA_1",
    ukupnoPoenEvidentirano: ukupno,
    prag: PRAG_FAZE_2_POEN,
    trzisteAktivno: trziste?.isActive ?? false,
    trzisteAktiviranoAt: trziste?.activatedAt ?? null,
    preslaNaFazu2SadasnjomProverom: false,
  };
}
