import { ZadatakMod } from "@/generated/prisma/client";

// Operativni doprinos — Pravilnik o operativnom doprinosu v3.7.0
// Čiste funkcije bez baze (testabilne).

export const MIN_STOPA = 1000;
export const MAX_STOPA = 2500;
export const MAX_SATI = 8;

/**
 * Težina dnevnog izvršenja koja ulazi u raspodelu (čl. 22/24).
 *  - PO_SATU:   sati × stopaPoSatu
 *  - U_CELOSTI: fiksni iznosUCelosti
 * Vraća 0 ako ulazi nisu validni za dati mod.
 */
export function izracunajTezinu(args: {
  mod: ZadatakMod;
  sati?: number | null;
  stopaPoSatu?: number | null;
  iznosUCelosti?: number | null;
}): number {
  const { mod, sati, stopaPoSatu, iznosUCelosti } = args;
  if (mod === "PO_SATU") {
    if (!sati || !stopaPoSatu || sati <= 0 || stopaPoSatu <= 0) return 0;
    return sati * stopaPoSatu;
  }
  return iznosUCelosti && iznosUCelosti > 0 ? iznosUCelosti : 0;
}

/**
 * Gornja granica predloženog POEN po zadatku / dnevnom izvršenju (čl. 26).
 * Sprečava da jedan zadatak monopolizuje dnevni bazen.
 */
export function primeniGornjuGranicu(tezina: number, granica?: number | null): number {
  if (granica == null || granica <= 0) return tezina;
  return Math.min(tezina, granica);
}

/**
 * Procena ukupnog predloženog POEN za prikaz (čl. 5/6).
 * Nije garantovani iznos — služi kao orijentir korisniku.
 */
export function procenaPredlozenog(args: {
  mod: ZadatakMod;
  maxSati?: number | null;
  stopaPoSatu?: number | null;
  iznosUCelosti?: number | null;
}): number {
  const { mod, maxSati, stopaPoSatu, iznosUCelosti } = args;
  if (mod === "PO_SATU") {
    return (maxSati ?? MAX_SATI) * (stopaPoSatu ?? 0);
  }
  return iznosUCelosti ?? 0;
}
