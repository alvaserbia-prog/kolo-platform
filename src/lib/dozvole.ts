/**
 * Centralne provere ovlašćenja (uloga).
 *
 * Razdvaja DVE nezavisne ose:
 *   1. Članski tip (TipKorisnika) — šta si u zajednici (zarađuje se).
 *   2. Admin rola (AdminRola)      — šta smeš operativno (dodeljuje se).
 *
 * Faza refaktora:
 *   - Korak 1–2 (TRENUTNO): sve provere i dalje čitaju TipKorisnika === POCETNI,
 *     pa je ponašanje IDENTIČNO kao pre. `jeAdmin` i `jeSuperadmin` su namerno
 *     jednaki — razlika se aktivira tek u koraku 4, kad se uvede polje adminRola.
 *   - Korak 4: `jeAdmin`/`jeSuperadmin` će čitati `adminRola`, a `jeKorenJemstva`
 *     polje `jeKorenJemstva`.
 *
 * Modul NE sme da uvozi Prisma client (koristi ga i proxy.ts u edge middleware-u),
 * zato se porede string literali, ne enum vrednosti.
 */

/** Minimalni oblik koji zadovoljavaju i session.user, i JWT token, i DB korisnik. */
export type KorisnikDozvole = {
  tipKorisnika?: string | null;
  // Dodaje se u koraku 4:
  // adminRola?: string | null;
  // jeKorenJemstva?: boolean | null;
};

const POCETNI = "POCETNI";
const NOSILAC_ZRNA = "NOSILAC_ZRNA";

/** Superadmin — vidi sve, nadzire admine, drži opasne/sistemske poluge. */
export function jeSuperadmin(u?: KorisnikDozvole | null): boolean {
  return u?.tipKorisnika === POCETNI;
}

/** Admin — svakodnevna operativa (uključuje i superadmina). */
export function jeAdmin(u?: KorisnikDozvole | null): boolean {
  // Korak 1–2: isto što i superadmin (sve je POCETNI). Razlika se aktivira u koraku 4.
  return u?.tipKorisnika === POCETNI;
}

/** Nadzor verifikacija i druge distribuirane (kvorum) funkcije — nosioci ZRNA + admini. */
export function mozeNadzor(u?: KorisnikDozvole | null): boolean {
  return u?.tipKorisnika === POCETNI || u?.tipKorisnika === NOSILAC_ZRNA;
}

/** Koren lanca jemstva — bootstrap poverenja (može da verifikuje bez da je sam verifikovan). */
export function jeKorenJemstva(u?: KorisnikDozvole | null): boolean {
  return u?.tipKorisnika === POCETNI;
}
