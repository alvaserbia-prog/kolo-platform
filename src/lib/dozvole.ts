/**
 * Centralne provere ovlašćenja (uloga).
 *
 * Razdvaja DVE nezavisne ose:
 *   1. Članski tip (TipKorisnika) — šta si u zajednici (zarađuje se).
 *   2. Admin rola (AdminRola)      — šta smeš operativno (dodeljuje se).
 *
 * Dve nezavisne ose:
 *   - Članski tip (TipKorisnika): NEVERIFIKOVAN → REGULARNI → NOSILAC_ZRNA.
 *   - Admin nivo (AdminNivo, kolona `admin`): NONE / ADMIN / SUPERADMIN.
 * `jeAdmin`/`jeSuperadmin` čitaju `admin`; `mozeNadzor`/`jeKorenJemstva`
 * kombinuju članski tip i admin nivo.
 *
 * Modul NE sme da uvozi Prisma client (koristi ga i proxy.ts u edge middleware-u),
 * zato se porede string literali, ne enum vrednosti.
 */

/** Minimalni oblik koji zadovoljavaju i session.user, i JWT token, i DB korisnik. */
export type KorisnikDozvole = {
  tipKorisnika?: string | null;
  admin?: string | null;
};

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
  return u?.tipKorisnika === NOSILAC_ZRNA || jeAdmin(u);
}

/** Koren lanca jemstva — bootstrap poverenja (superadmin verifikuje prve ljude). */
export function jeKorenJemstva(u?: KorisnikDozvole | null): boolean {
  return jeSuperadmin(u);
}
