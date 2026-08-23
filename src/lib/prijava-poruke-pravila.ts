/**
 * Prijava poruke iz Pričaonice — ČISTE funkcije i šifarnik.
 *
 * Bez ijednog `import`-a Prisme: ovaj modul uvozi i klijentski obrazac u
 * pretraživaču (dugme „prijavi" uz poruku) i serverska ruta. Jedan šifarnik na
 * jednom mestu — inače bi ekran nudio šifru koju server ne poznaje.
 *
 * ─── Zašto prijava nosi I poruku I čoveka ───────────────────────────────────
 *
 * Poruka je DOKAZ. Roditelj razgovore dece više ne čita (Pravilnik o učešću dece,
 * čl. 9), pa je prijavljena poruka jedino što Fondacija sme i može da pogleda.
 * Čista „prijavi korisnika" bez poruke terala bi moderatora da pročita celu sobu
 * da bi shvatio šta se desilo — dakle da vrati nadzor koji je ovaj model skinuo.
 *
 * Čovek je SUBJEKT. Opasnost je gotovo uvek nalog, ne pojedinačna poruka: tri
 * prijave iz tri razgovora nad istim nalogom su signal koji nijedna od tih poruka
 * sama ne nosi. Zato prijava upisuje i autora, a admin ekran grupiše po njemu.
 */

/** Šifre — moraju se poklapati sa enum-om `PrijavaPorukeRazlog` u šemi. */
export const RAZLOZI = [
  "VREDJANJE",
  "TRAZI_SLIKE",
  "TRAZI_SUSRET",
  "LAZE_UZRAST",
  "NEPRIMEREN_SADRZAJ",
  "LICNI_PODACI",
  "PREVARA",
  "OSTALO",
] as const;

export type RazlogKod = (typeof RAZLOZI)[number];

/**
 * Šifre koje se nude u DEČJOJ sobi.
 *
 * 🔴 Tri šifre mamljenja (`TRAZI_SLIKE`, `TRAZI_SUSRET`, `LAZE_UZRAST`) stoje
 * odvojeno namerno. Pod jednom zbirnom šifrom „neprimereno" obrazac se ne bi
 * video, a upravo obrazac — ne pojedinačna poruka — je ono što se ovde traži.
 * Formulacije su detinje jednostavne jer ih čita sedmogodišnjak.
 */
export const RAZLOZI_DECA: RazlogKod[] = [
  "VREDJANJE",
  "TRAZI_SLIKE",
  "TRAZI_SUSRET",
  "LAZE_UZRAST",
  "OSTALO",
];

/** Šifre koje se nude u sobi odraslih (Uslovi čl. 22, 24, 25). */
export const RAZLOZI_ODRASLI: RazlogKod[] = [
  "VREDJANJE",
  "NEPRIMEREN_SADRZAJ",
  "LICNI_PODACI",
  "PREVARA",
  "OSTALO",
];

/** i18n ključ oznake šifre (namespace `prijavaPoruke`). */
export function kljucRazloga(kod: RazlogKod): string {
  return `razlog_${kod.toLowerCase()}`;
}

export const MAX_OPIS = 500;
/** Obrazloženje odluke Fondacije — ide čoveku, pa mora biti rečenica, ne slovo. */
export const MIN_ODLUKA = 10;

export function jeRazlog(v: unknown): v is RazlogKod {
  return typeof v === "string" && (RAZLOZI as readonly string[]).includes(v);
}

/**
 * Provera unosa prijave.
 *
 * Slobodan tekst se traži SAMO uz „ostalo": ko je izabrao šifru, već je rekao
 * šta prijavljuje, a dodatno pisanje bi odvraćalo dete od prijave. Uz „ostalo"
 * bez teksta prijava ne kaže ništa, pa se odbija.
 */
export function proveriPrijavu(kod: unknown, opis: unknown):
  | { ok: true; kod: RazlogKod; opis: string | null }
  | { ok: false; greska: string } {
  if (!jeRazlog(kod)) return { ok: false, greska: "Izaberi šta prijavljuješ." };
  const tekst = typeof opis === "string" ? opis.trim().slice(0, MAX_OPIS) : "";
  if (kod === "OSTALO" && tekst.length < 3) {
    return { ok: false, greska: "Uz „ostalo” napiši u jednoj rečenici šta se dogodilo." };
  }
  return { ok: true, kod, opis: tekst || null };
}

/**
 * Da li šifra sama po sebi traži da se nalog pogleda kao celina.
 *
 * Ne sankcioniše ništa — samo diže stavku na vrh admin spiska. Laž o uzrastu i
 * traženje susreta su jedini razlozi kod kojih je i JEDNA prijava dovoljna da se
 * nalog proveri; ostali se cene po obrascu.
 */
export function jeHitno(kod: RazlogKod): boolean {
  return kod === "LAZE_UZRAST" || kod === "TRAZI_SUSRET" || kod === "TRAZI_SLIKE";
}

/**
 * Prag posle kog spisak ističe nalog kao obrazac.
 *
 * Tri prijave, od tri RAZLIČITA prijavioca (broji ih ruta, ne ova funkcija) —
 * jedan čovek koji tri puta pritisne dugme nije obrazac nego jedan čovek.
 */
export const PRAG_OBRASCA = 3;

export function jeObrazac(brojRazlicitihPrijavilaca: number): boolean {
  return brojRazlicitihPrijavilaca >= PRAG_OBRASCA;
}
