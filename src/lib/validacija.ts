/**
 * Zajedničke ulazne validacije (bez eksternih biblioteka).
 */

/** Kanonska forma email-a — jedna ista svuda (registracija, login, reset, OAuth). */
export function normalizujEmail(e: unknown): string {
  return typeof e === "string" ? e.trim().toLowerCase() : "";
}

/** Plitka provera oblika email-a (dovoljno za odbacivanje očiglednog smeća). */
export function validanEmail(e: unknown): e is string {
  const v = normalizujEmail(e);
  return v.length >= 3 && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const PSEUDONIM_REGEX = /^[\p{L}\p{N} _.\-]+$/u;

/**
 * Pseudonim sme da sadrži samo slova/brojeve/razmak/`_`/`.`/`-`, dužine 3–30 (trimovano),
 * bez duplih razmaka i bez nevidljivih/kontrolnih znakova (oni nisu u dozvoljenim klasama).
 * Rezervisan prefiks `obrisani-korisnik` je zabranjen (sprečava imitaciju obrisanih naloga).
 */
export function validanPseudonim(p: unknown): p is string {
  if (typeof p !== "string") return false;
  const t = p.trim();
  if (t.length < 3 || t.length > 30) return false;
  if (/\s{2,}/.test(t)) return false;
  if (/^obrisani-korisnik/i.test(t)) return false;
  return PSEUDONIM_REGEX.test(t);
}
