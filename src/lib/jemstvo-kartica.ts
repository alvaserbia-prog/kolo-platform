// Kartica prepoznavanja — čista logika table jemstva (bez Prisma i bez React-a,
// da bi bila deljiva između API ruta, servera i klijenta, i lako testiva).
//
// Zašto kartica a ne slobodan tekst: slobodno polje su ljudi popunjavali kao
// oglas („bavim se pčelarstvom") — formalno validno, a niko ne može da prepozna
// osobu. Struktuirana polja + mesto iz šifarnika omogućavaju da sistem sam
// dovede kandidata onome ko ga najverovatnije poznaje.

import { NASELJA_SRBIJE } from "@/lib/naselja-srbije";
import { NASELJE_OPSTINA } from "@/lib/naselja-geo";

/** Koliko dana objava stoji na tabli pre isteka. */
export const TRAJANJE_DANA = 8;

export const MAX_IME = 40;
export const MAX_PREZIME = 40;
export const MAX_NADIMAK = 60;
export const MAX_CIME_SE_BAVI = 100;
export const MAX_TELEFON = 30;

// Donja granica je zaštita od očiglednih grešaka u kucanju, gornja od naloga
// za maloletnike (Modul Deca nije aktivan — vidi Pravilnik čl. 58).
export const GODISTE_MIN = 1900;
export function godisteMax(): number {
  return new Date().getFullYear() - 15;
}

const NASELJA_SET = new Set(NASELJA_SRBIJE);

export interface KarticaUnos {
  ime?: unknown;
  prezime?: unknown;
  godiste?: unknown;
  mesto?: unknown;
  nadimak?: unknown;
  cimeSeBavi?: unknown;
  telefon?: unknown;
  telefonSaglasnost?: unknown;
}

export interface Kartica {
  ime: string | null;
  prezime: string | null;
  godiste: number | null;
  mesto: string | null;
  nadimak: string | null;
  cimeSeBavi: string | null;
  telefon: string | null;
  telefonSaglasnost: boolean;
}

export type ValidacijaRezultat =
  | { ok: true; kartica: Kartica }
  | { ok: false; greska: string };

function tekst(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().replace(/\s+/g, " ");
  if (!s) return null;
  return s.slice(0, max);
}

/**
 * Normalizuje i proverava unos kartice.
 *
 * SVA POLJA SU OPCIONA — nikoga ne zaustavljamo na vratima. Ono što se proverava
 * je ISPRAVNOST onoga što je uneto (mesto mora biti iz šifarnika, godište mora
 * biti godina, telefon mora ličiti na telefon), ne popunjenost.
 */
export function validirajKarticu(unos: KarticaUnos): ValidacijaRezultat {
  const ime = tekst(unos.ime, MAX_IME);
  const prezime = tekst(unos.prezime, MAX_PREZIME);
  const nadimak = tekst(unos.nadimak, MAX_NADIMAK);
  const cimeSeBavi = tekst(unos.cimeSeBavi, MAX_CIME_SE_BAVI);

  // Mesto mora biti iz šifarnika — feed rangira po tačnom poklapanju mesta,
  // pa slobodan unos („N.Sad", „novi sad") tiho isključi čoveka iz feed-a.
  let mesto: string | null = null;
  if (unos.mesto !== undefined && unos.mesto !== null && unos.mesto !== "") {
    const m = tekst(unos.mesto, 80);
    if (m) {
      if (!NASELJA_SET.has(m)) {
        return { ok: false, greska: "Mesto mora biti izabrano iz ponuđenog spiska naselja." };
      }
      mesto = m;
    }
  }

  let godiste: number | null = null;
  if (unos.godiste !== undefined && unos.godiste !== null && unos.godiste !== "") {
    const g = Number(unos.godiste);
    if (!Number.isInteger(g) || g < GODISTE_MIN || g > godisteMax()) {
      return {
        ok: false,
        greska: `Godina rođenja mora biti između ${GODISTE_MIN} i ${godisteMax()}.`,
      };
    }
    godiste = g;
  }

  let telefon: string | null = null;
  if (unos.telefon !== undefined && unos.telefon !== null && unos.telefon !== "") {
    const t = tekst(unos.telefon, MAX_TELEFON);
    if (t) {
      if (!/^[+0-9][0-9 /()-]{5,}$/.test(t) || (t.match(/\d/g)?.length ?? 0) < 6) {
        return { ok: false, greska: "Broj telefona nije u ispravnom obliku." };
      }
      telefon = t;
    }
  }

  const telefonSaglasnost = unos.telefonSaglasnost === true;
  // Saglasnost bez broja nema dejstvo; broj bez saglasnosti se ne bi smeo koristiti
  // za poziv, pa ga ni ne čuvamo — minimizacija podataka (Politika čl. 4).
  if (telefon && !telefonSaglasnost) {
    return {
      ok: false,
      greska:
        "Broj telefona čuvamo samo uz saglasnost da te Fondacija pozove. Označi kvačicu ili ostavi polje prazno.",
    };
  }

  return {
    ok: true,
    kartica: {
      ime,
      prezime,
      godiste,
      mesto,
      nadimak,
      cimeSeBavi,
      telefon,
      telefonSaglasnost: telefon ? telefonSaglasnost : false,
    },
  };
}

/**
 * Da li kartica sme da uđe u feed prepoznavanja.
 * Bez mesta se kartica ne može nikome dovesti (rangiranje stoji na mestu), a bez
 * imena nema šta da se prepozna. Kartica koja ovo ne ispunjava i dalje stoji na
 * zidu — samo je sistem ne gura nikome.
 */
export function jeKompletnaZaFeed(k: {
  ime: string | null;
  mesto: string | null;
}): boolean {
  return !!(k.ime && k.mesto);
}

/** Šta nedostaje da kartica uđe u feed (za poruku vlasniku — nikad mrtvo dugme). */
export function nedostajeZaFeed(k: { ime: string | null; mesto: string | null }): string[] {
  const fali: string[] = [];
  if (!k.ime) fali.push("ime");
  if (!k.mesto) fali.push("mesto");
  return fali;
}

/** „M. J." — prikaz za neverifikovanog posmatrača. */
export function inicijali(ime: string | null, prezime: string | null): string | null {
  const delovi = [ime, prezime].filter(Boolean) as string[];
  if (delovi.length === 0) return null;
  return delovi.map((d) => `${d[0].toUpperCase()}.`).join(" ");
}

/** 1978 → „1970-e" — neverifikovani vidi deceniju, ne tačnu godinu. */
export function decenija(godiste: number | null): string | null {
  if (!godiste) return null;
  return `${Math.floor(godiste / 10) * 10}-e`;
}

/** Opština datog naselja — feed rangira po opštini, ne po tačnom naselju. */
export function opstinaZa(mesto: string | null): string | null {
  if (!mesto) return null;
  return NASELJE_OPSTINA[mesto] ?? null;
}

/**
 * Sva naselja koja pripadaju istoj opštini kao dato mesto (uključujući samo mesto).
 * Zašto opština a ne naselje: čovek iz sela pored Sombora prepoznaje Somborca —
 * tačno poklapanje naselja bi ga promašilo.
 */
export function naseljaIsteOpstine(mesto: string | null): string[] {
  const opstina = opstinaZa(mesto);
  if (!opstina) return mesto ? [mesto] : [];
  return opstinaIndeks().get(opstina) ?? [mesto!];
}

// Obrnuti indeks opština → naselja, gradi se jednom po procesu (šifarnik je
// statičan). Bez njega bi svaki poziv prolazio kroz ceo spisak naselja.
let _opstinaIndeks: Map<string, string[]> | null = null;
function opstinaIndeks(): Map<string, string[]> {
  if (!_opstinaIndeks) {
    _opstinaIndeks = new Map();
    for (const [naselje, opstina] of Object.entries(NASELJE_OPSTINA)) {
      const lista = _opstinaIndeks.get(opstina);
      if (lista) lista.push(naselje);
      else _opstinaIndeks.set(opstina, [naselje]);
    }
  }
  return _opstinaIndeks;
}

export interface KarticaPrikaz {
  puna: boolean;
  ime: string | null;
  prezime: string | null;
  inicijali: string | null;
  godiste: number | null;
  decenija: string | null;
  mesto: string | null;
  nadimak: string | null;
  cimeSeBavi: string | null;
  /** Legacy slobodan tekst (samo NEPOTPUN kartice) — vidi ga verifikovan član. */
  legacyTekst: string | null;
}

/**
 * Oblikuje karticu za posmatrača (Pravilnik čl. 28–30, 67; Politika čl. 6).
 *
 *   verifikovan član → puna kartica
 *   neverifikovan    → inicijali, mesto, decenija rođenja
 *
 * Telefon i link NIKAD ne izlaze odavde — otkrivaju se zasebno i uz logovanje.
 */
export function karticaZaPosmatraca(
  z: {
    ime: string | null;
    prezime: string | null;
    godiste: number | null;
    mesto: string | null;
    nadimak: string | null;
    cimeSeBavi: string | null;
    legacyTekst: string | null;
  },
  punaVidljivost: boolean
): KarticaPrikaz {
  if (!punaVidljivost) {
    return {
      puna: false,
      ime: null,
      prezime: null,
      inicijali: inicijali(z.ime, z.prezime),
      godiste: null,
      decenija: decenija(z.godiste),
      mesto: z.mesto,
      nadimak: null,
      cimeSeBavi: null,
      legacyTekst: null,
    };
  }
  return {
    puna: true,
    ime: z.ime,
    prezime: z.prezime,
    inicijali: inicijali(z.ime, z.prezime),
    godiste: z.godiste,
    decenija: decenija(z.godiste),
    mesto: z.mesto,
    nadimak: z.nadimak,
    cimeSeBavi: z.cimeSeBavi,
    legacyTekst: z.legacyTekst,
  };
}
