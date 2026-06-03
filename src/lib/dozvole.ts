/**
 * Centralne provere ovlašćenja (uloga).
 *
 * Razdvaja DVE nezavisne ose:
 *   1. Članski tip (TipKorisnika) — šta si u zajednici (zarađuje se).
 *   2. Admin rola (AdminRola)      — šta smeš operativno (dodeljuje se).
 *
 * Faza refaktora:
 *   - Korak 4 (TRENUTNO): `jeAdmin`/`jeSuperadmin` čitaju kolonu `admin`
 *     (AdminNivo). `mozeNadzor` i `jeKorenJemstva` i dalje čitaju `tipKorisnika`
 *     jer osnivači zadržavaju POCETNI tip do čišćenja enuma (korak 7).
 *   - Korak 7: kad POCETNI nestane iz TipKorisnika, `jeKorenJemstva` postaje
 *     `jeSuperadmin`, a `mozeNadzor` = jeAdmin || NOSILAC_ZRNA.
 *
 * Modul NE sme da uvozi Prisma client (koristi ga i proxy.ts u edge middleware-u),
 * zato se porede string literali, ne enum vrednosti.
 */

/** Minimalni oblik koji zadovoljavaju i session.user, i JWT token, i DB korisnik. */
export type KorisnikDozvole = {
  tipKorisnika?: string | null;
  admin?: string | null;
};

const POCETNI = "POCETNI";
const NOSILAC_ZRNA = "NOSILAC_ZRNA";
const ADMIN = "ADMIN";
const SUPERADMIN = "SUPERADMIN";

/** Superadmin — vidi sve, nadzire admine, drži opasne/sistemske poluge. */
export function jeSuperadmin(u?: KorisnikDozvole | null): boolean {
  return u?.admin === SUPERADMIN;
}

/** Admin — svakodnevna operativa (uključuje i superadmina). */
export function jeAdmin(u?: KorisnikDozvole | null): boolean {
  return u?.admin === ADMIN || u?.admin === SUPERADMIN;
}

/** Nadzor verifikacija i druge distribuirane (kvorum) funkcije — nosioci ZRNA + admini. */
export function mozeNadzor(u?: KorisnikDozvole | null): boolean {
  // Osnivači su još POCETNI tip (do koraka 7); pokriva ih i jeAdmin preko `admin`.
  return (
    u?.tipKorisnika === POCETNI ||
    u?.tipKorisnika === NOSILAC_ZRNA ||
    jeAdmin(u)
  );
}

/** Koren lanca jemstva — bootstrap poverenja (može da verifikuje bez da je sam verifikovan). */
export function jeKorenJemstva(u?: KorisnikDozvole | null): boolean {
  // Do koraka 7 osnivači imaju POCETNI tip; superadmin je takođe koren.
  return u?.tipKorisnika === POCETNI || jeSuperadmin(u);
}
