/**
 * Rani pristup ("early access") — meki ulaz dok je platforma u režimu održavanja.
 *
 * Dok je MAINTENANCE_MODE=true (postavlja se ISKLJUČIVO na produkciji), prijava i
 * registracija su zaključane i sve ulazne rute vode na /rani-pristup. Ako je u
 * okruženju postavljen RANI_PRISTUP_KOD, osoba koja zna kod može da otključa ulaz:
 * unese kod na /rani-pristup, dobije kolačić, i od tada može da se prijavi/registruje
 * i koristi platformu. (Stara ruta /uskoro je objedinjena i sada trajno redirektuje
 * na /rani-pristup.)
 *
 * Ovo je svesno "meki" gate za pre-launch fazu (uključivanje ranih prihvatilaca):
 * vrednost kolačića JE sam kod (httpOnly + secure), pa rotacija RANI_PRISTUP_KOD-a
 * automatski poništava sve stare kolačiće. Nije zamena za autentikaciju — pravi
 * pristup nalogu i dalje ide kroz NextAuth.
 *
 * Modul mora ostati edge-safe (koristi ga proxy.ts u middleware-u) — BEZ uvoza
 * Prisma klijenta ili `next/headers`. Pozivaoci sami pročitaju vrednost kolačića
 * (proxy iz `req.cookies`, server rute iz `req.cookies`/`next/headers`) i proslede je.
 */

/** Naziv kolačića koji nosi odobreni rani pristup. */
export const RANI_PRISTUP_COOKIE = "kolo_rani_pristup";

/** Trajanje kolačića ranog pristupa — 30 dana (u sekundama). */
export const RANI_PRISTUP_MAX_AGE = 60 * 60 * 24 * 30;

/** Funkcija ranog pristupa je aktivna samo ako je kod konfigurisan u okruženju. */
export function raniPristupKonfigurisan(): boolean {
  return !!process.env.RANI_PRISTUP_KOD;
}

/**
 * Normalizuje pristupni kod za poređenje: uklanja SVE razmake (uključujući
 * unutrašnje) i svodi na mala slova. Tako se "KOLO 2026", "kolo2026" i
 * " Kolo 2026 " tretiraju jednako — korisnik može da ukuca kod sa ili bez
 * razmaka.
 */
function normalizujKod(kod: string): string {
  return kod.replace(/\s+/g, "").toLowerCase();
}

/**
 * Da li uneti kod odgovara konfigurisanom pristupnom kodu.
 * Poređenje je neosetljivo na velika/mala slova i na razmake (bilo gde u kodu)
 * — npr. "kolo2026", "KOLO 2026" i "Kolo2026" se prihvataju jednako.
 */
export function tacanRaniPristupKod(kod?: string | null): boolean {
  const ocekivani = process.env.RANI_PRISTUP_KOD;
  return (
    !!ocekivani &&
    typeof kod === "string" &&
    normalizujKod(kod) === normalizujKod(ocekivani)
  );
}

/** Da li vrednost kolačića predstavlja validan, otključan rani pristup. */
export function validanRaniPristup(cookieValue?: string | null): boolean {
  return tacanRaniPristupKod(cookieValue);
}
