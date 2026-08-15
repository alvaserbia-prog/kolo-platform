/**
 * Prijava neispunjene razmene — ČISTA pravila (bez Prisme).
 *
 * Fajl je bez ijednog `import`-a jer ga uvozi i klijentska komponenta u istoriji
 * POEN-a (dugme „Prijavi problem") i serverske rute — jedno mesto istine, isti
 * uslov na obe strane.
 *
 * Šta ovo jeste, a šta nije:
 *
 *  - Prepis POEN-a je ažuriranje evidencije između dva zapisa (Pravilnik čl. 14,
 *    16), a za samu razmenu dobara i usluga odgovaraju korisnici po opštim
 *    pravilima obligacionog prava; Fondacija i Protokol nisu strana u tom
 *    odnosu (Uslovi čl. 22). Zato prijava NIJE zahtev za povraćaj i ne obara
 *    prepis sama od sebe — ona je evidencija o kojoj Fondacija odlučuje.
 *  - Poništenje ide PROTIVZAPISOM, ne brisanjem: istorija se ne prepravlja, kao
 *    ni pri prestanku statusa (čl. 34).
 *  - Zapis primaoca pri poništenju NE SME u minus. Jedini izuzetak od zabrane
 *    negativnog zapisa u celom sistemu je nadoknada iz čl. 20b dokaza
 *    stvarnosti, i on se ovim ne proširuje — vraća se najviše ono što se na
 *    zapisu zatekne, pa i ništa.
 */

/** Najviše otvorenih prijava po korisniku — ista brana kao kod prigovora. */
export const MAX_OTVORENIH_PRIJAVA = 3;

/** Najkraći opis koji nešto govori Fondaciji. */
export const MIN_OPIS_PRIJAVE = 10;

export type UlazPrijave = {
  /** Tip transakcije — prijavljuje se samo prepis između dva korisnika. */
  tipTransakcije: string;
  /** Vlasnik zapisa sa kog je POEN skinut; `null` kad je davalac Protokol. */
  posiljaocId: string | null;
  /** Ko prijavljuje. */
  prijaviocId: string;
  /** Postoji li već prijava nad ovim prepisom. */
  vecPrijavljena: boolean;
  /** Koliko prijava ovog korisnika još čeka odluku. */
  otvorenihPrijava: number;
  opis: string;
};

export type IshodProvere = { ok: true } | { ok: false; razlog: string };

/**
 * Sme li se ovaj prepis prijaviti.
 *
 * Prijavljuje isključivo POŠILJALAC: on je jedini nešto izgubio. Primalac koji
 * nije dobio robu nije prepisao POEN, pa nema šta da mu se vrati; njegov put je
 * prijava oglasa (moderacija) ili prigovor.
 */
export function smePrijaviti(u: UlazPrijave): IshodProvere {
  if (u.tipTransakcije !== "TRANSFER")
    return { ok: false, razlog: "Prijavljuje se samo prepis POEN-a između dva člana." };

  if (!u.posiljaocId || u.posiljaocId !== u.prijaviocId)
    return { ok: false, razlog: "Prepis može da prijavi samo onaj ko je POEN prepisao." };

  if (u.vecPrijavljena)
    return { ok: false, razlog: "Ovaj prepis je već prijavljen." };

  if (u.otvorenihPrijava >= MAX_OTVORENIH_PRIJAVA)
    return {
      ok: false,
      razlog: `Imaš ${MAX_OTVORENIH_PRIJAVA} prijave koje čekaju odluku. Sačekaj odgovor na njih.`,
    };

  if (u.opis.trim().length < MIN_OPIS_PRIJAVE)
    return {
      ok: false,
      razlog: `Opis mora imati najmanje ${MIN_OPIS_PRIJAVE} znakova — po njemu se odlučuje.`,
    };

  return { ok: true };
}

/**
 * Koliko se POEN-a stvarno može vratiti.
 *
 * Ograničeno stanjem primaoca, jer njegov zapis ne sme u minus (Pravilnik čl.
 * 14). Ko je prepisano već potrošio, vraća samo ono što mu je ostalo — i to je
 * razlog zbog kog se u FAQ-u kaže da poništenje nije garancija povraćaja.
 * Negativno stanje (nadoknada, čl. 20b) čita se kao nula, ne kao dug koji bi se
 * ovim produbljivao.
 */
export function iznosZaVracanje(iznosPrepisa: number, stanjePrimaoca: number): number {
  return Math.max(0, Math.min(iznosPrepisa, stanjePrimaoca));
}

/** Da li je poništenje bilo potpuno (za tekst obaveštenja i za prikaz u tabu). */
export function ponistenjePotpuno(iznosPrepisa: number, vraceno: number): boolean {
  return vraceno >= iznosPrepisa;
}
