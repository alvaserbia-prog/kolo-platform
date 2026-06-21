/**
 * Pristanak na ne-neophodne (analitičke) kolačiće.
 *
 * Neophodni kolačići (sesija, prijava, bezbednost) NE prolaze kroz ovaj mehanizam
 * — oni su nužni za rad platforme i nisu podložni pristanku (Politika privatnosti
 * čl. 7). Ovde se uslovljava SAMO učitavanje analitike trećih lica
 * (Google Analytics) — vidi `Analitika.tsx`.
 *
 * Stanje se čuva u localStorage; promena se emituje preko CustomEvent-a da bi
 * `Analitika` komponenta reagovala bez osvežavanja stranice.
 */

export const CONSENT_KEY = "kolo-kolacici-pristanak";
export const CONSENT_EVENT = "kolo-kolacici-pristanak-promena";

export type Pristanak = "prihvaceno" | "odbijeno";

/** Trenutni pristanak iz localStorage; `null` ako korisnik još nije odlučio. */
export function procitajPristanak(): Pristanak | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "prihvaceno" || v === "odbijeno" ? v : null;
}

/** Sačuvaj odluku i obavesti slušaoce (Analitika) da reaguju odmah. */
export function sacuvajPristanak(p: Pristanak): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, p);
  window.dispatchEvent(new CustomEvent<Pristanak>(CONSENT_EVENT, { detail: p }));
}
