/**
 * Levak — gde ljudi otpadaju na putu od registracije do objavljenog oglasa.
 *
 * Grupisanje je po NEDELJI REGISTRACIJE (kohorta), a koraci se broje kao
 * „da li je taj čovek to IKAD uradio", ne „da li je uradio te nedelje".
 * Zato brojevi u redu nedelje mogu da rastu i kasnije: neko ko se registrovao
 * u julu a oglas postavio u avgustu i dalje se broji u julskoj kohorti. To je
 * i poenta — pratimo sudbinu ljudi, ne nedeljni promet.
 *
 * Sve funkcije ovde su čiste (bez baze), da bi se mogle testirati.
 */

/** Redosled koraka levka. Prolaz svakog koraka se računa u odnosu na prethodni. */
export const KORACI = [
  "registrovani",
  "otvorili_poverenje", // posetio /verifikacija ili /tabla-jemstva
  "objavili_karticu",
  "verifikovani",
  "otvorili_formu", // posetio /pijaca/novi-oglas
  "objavili_oglas",
] as const;

export type Korak = (typeof KORACI)[number];

export interface KorisnikRed {
  id: string;
  createdAt: Date;
  /** null = nije verifikovan */
  verifiedAt: Date | null;
}

export interface LevakUlaz {
  korisnici: KorisnikRed[];
  /** userId koji su ikad objavili karticu prepoznavanja (svi statusi) */
  saKarticom: Set<string>;
  /** userId koji su ikad otvorili /verifikacija ili /tabla-jemstva */
  otvoriliPoverenje: Set<string>;
  /** userId koji su ikad otvorili /pijaca/novi-oglas */
  otvoriliFormu: Set<string>;
  /** userId → datum prvog objavljenog oglasa */
  prviOglas: Map<string, Date>;
}

export interface LevakKorak {
  korak: Korak;
  broj: number;
  /** Udeo u odnosu na PRETHODNI korak, 0–100. null za prvi korak. */
  prolaz: number | null;
}

export interface LevakGrupa {
  /** ISO datum ponedeljka kohorte, ili "ukupno" za zbirni red. */
  oznaka: string;
  koraci: LevakKorak[];
  /** Prosečan broj dana od registracije do verifikacije (samo verifikovani). */
  danaDoVerifikacije: number | null;
  /** Prosečan broj dana od verifikacije do prvog oglasa. */
  danaDoPrvogOglasa: number | null;
}

const DAN_MS = 24 * 60 * 60 * 1000;

/** Ponedeljak (UTC) nedelje u kojoj je dati datum, kao "YYYY-MM-DD". */
export function pocetakNedelje(d: Date): string {
  const u = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // getUTCDay: 0 = nedelja → pomeramo na ponedeljak kao prvi dan
  const pomak = (u.getUTCDay() + 6) % 7;
  u.setUTCDate(u.getUTCDate() - pomak);
  return u.toISOString().slice(0, 10);
}

function prosek(vrednosti: number[]): number | null {
  if (vrednosti.length === 0) return null;
  const zbir = vrednosti.reduce((a, b) => a + b, 0);
  return Math.round((zbir / vrednosti.length) * 10) / 10;
}

/** Koraci levka za dati skup korisnika. */
function koraciZa(korisnici: KorisnikRed[], ulaz: LevakUlaz): LevakKorak[] {
  const brojevi: Record<Korak, number> = {
    registrovani: korisnici.length,
    otvorili_poverenje: 0,
    objavili_karticu: 0,
    verifikovani: 0,
    otvorili_formu: 0,
    objavili_oglas: 0,
  };

  for (const k of korisnici) {
    if (ulaz.otvoriliPoverenje.has(k.id)) brojevi.otvorili_poverenje++;
    if (ulaz.saKarticom.has(k.id)) brojevi.objavili_karticu++;
    if (k.verifiedAt) brojevi.verifikovani++;
    if (ulaz.otvoriliFormu.has(k.id)) brojevi.otvorili_formu++;
    if (ulaz.prviOglas.has(k.id)) brojevi.objavili_oglas++;
  }

  return KORACI.map((korak, i) => {
    const broj = brojevi[korak];
    if (i === 0) return { korak, broj, prolaz: null };
    const prethodni = brojevi[KORACI[i - 1]];
    return {
      korak,
      broj,
      // Prolaz preko 100% je moguć i nije greška: koraci nisu strogo ulančani
      // (može se biti verifikovan bez objavljene kartice — QR putem).
      prolaz: prethodni === 0 ? null : Math.round((broj / prethodni) * 100),
    };
  });
}

function vremenaZa(korisnici: KorisnikRed[], ulaz: LevakUlaz) {
  const doVerifikacije: number[] = [];
  const doOglasa: number[] = [];

  for (const k of korisnici) {
    if (!k.verifiedAt) continue;
    doVerifikacije.push((k.verifiedAt.getTime() - k.createdAt.getTime()) / DAN_MS);

    const oglas = ulaz.prviOglas.get(k.id);
    // Oglas pre verifikacije ne postoji (Pijaca je zaključana), ali ako se
    // pojavi zbog naknadne izmene podataka — ne uvlačimo negativan broj u prosek.
    if (oglas && oglas.getTime() >= k.verifiedAt.getTime()) {
      doOglasa.push((oglas.getTime() - k.verifiedAt.getTime()) / DAN_MS);
    }
  }

  return {
    danaDoVerifikacije: prosek(doVerifikacije),
    danaDoPrvogOglasa: prosek(doOglasa),
  };
}

/**
 * Levak po nedeljama registracije (najnovija prva) + zbirni red „ukupno".
 * `brojNedelja` ograničava koliko se nedelja vraća; „ukupno" uvek obuhvata SVE
 * korisnike, i one starije od tog preseka.
 */
export function izracunajLevak(ulaz: LevakUlaz, brojNedelja = 12): LevakGrupa[] {
  const poNedelji = new Map<string, KorisnikRed[]>();
  for (const k of ulaz.korisnici) {
    const kljuc = pocetakNedelje(k.createdAt);
    const niz = poNedelji.get(kljuc);
    if (niz) niz.push(k);
    else poNedelji.set(kljuc, [k]);
  }

  const nedelje = [...poNedelji.keys()].sort().reverse().slice(0, brojNedelja);

  const grupe: LevakGrupa[] = nedelje.map((oznaka) => {
    const ljudi = poNedelji.get(oznaka)!;
    return { oznaka, koraci: koraciZa(ljudi, ulaz), ...vremenaZa(ljudi, ulaz) };
  });

  grupe.push({
    oznaka: "ukupno",
    koraci: koraciZa(ulaz.korisnici, ulaz),
    ...vremenaZa(ulaz.korisnici, ulaz),
  });

  return grupe;
}
