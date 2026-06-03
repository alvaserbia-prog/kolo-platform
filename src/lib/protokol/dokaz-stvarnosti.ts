/**
 * Domain logika dokaza stvarnosti (Pravilnik o dokazu stvarnosti v3.5.0).
 *
 * Čiste funkcije bez Prisma poziva — prima podatke, vraća odluke.
 * Sve funkcije su deterministički testabilne.
 */
import { TipKorisnika } from "@/generated/prisma/client";

export const BESKONACNI_KAPACITET = "neograniceno" as const;
export type Kapacitet = number | typeof BESKONACNI_KAPACITET;

export const FUNKCIONALNI_PRAG_INDEKSA = 10; // čl. 4 Pravilnika
export const PRIRAST_INDEKSA_PO_VERIFIKACIJI = 10; // čl. 3
export const MAX_INDEKS = 100; // čl. 3 stav 2
export const POEN_VERIFIKATOR = 1000; // čl. 7
export const POEN_VERIFIKOVANI = 1000; // čl. 7
export const POEN_NADZORNIK = 500; // čl. 7
export const TOKEN_VAZI_SEKUNDI = 60; // QR token TTL

export type GrafZapis = { verifikatorId: string; verifikovaniId: string };

export type ProveraAntiCirkularnoRezultat =
  | { dozvoljeno: true }
  | { dozvoljeno: false; razlog: string };

/**
 * Izračunava indeks stvarnosti od broja verifikacija (čl. 3).
 * Vrednost je u opsegu 0-100; svaka verifikacija dodaje 10 procentnih poena;
 * verifikacije iznad praga 10 se ne evidentiraju (cap 100%).
 */
export function izracunajIndeks(brojVerifikacija: number): number {
  if (brojVerifikacija < 0) return 0;
  return Math.min(MAX_INDEKS, brojVerifikacija * PRIRAST_INDEKSA_PO_VERIFIKACIJI);
}

/**
 * Izračunava verifikacioni kapacitet (čl. 8 i čl. 9).
 *
 * - NOSILAC_ZRNA: neograničen kapacitet (status nadjačava indeks)
 * - REGULARNI: floor(indeks / 10), tj. 0 do 10
 * - NEVERIFIKOVAN: 0
 */
export function izracunajKapacitet(tip: TipKorisnika, indeks: number): Kapacitet {
  if (tip === TipKorisnika.NOSILAC_ZRNA) {
    return BESKONACNI_KAPACITET;
  }
  if (tip === TipKorisnika.NEVERIFIKOVAN) {
    return 0;
  }
  // REGULARNI
  return Math.max(0, Math.floor(indeks / 10));
}

/**
 * Proverava da li korisnik ima slobodan slot za novu verifikaciju.
 * Neograničen kapacitet uvek vraća true; numerički kapacitet poredi sa potrošenim slotovima.
 */
export function raspolozivSlot(kapacitet: Kapacitet, slotoviPotroseni: number): boolean {
  if (kapacitet === BESKONACNI_KAPACITET) return true;
  return slotoviPotroseni < kapacitet;
}

/**
 * Vraća broj raspoloživih slotova (za prikaz). Neograničen kapacitet → null.
 */
export function brojRaspolozivihSlotova(
  kapacitet: Kapacitet,
  slotoviPotroseni: number
): number | null {
  if (kapacitet === BESKONACNI_KAPACITET) return null;
  return Math.max(0, kapacitet - slotoviPotroseni);
}

/**
 * Određuje da li verifikacija koju je obavio dati tip korisnika podleže nadzoru (čl. 10).
 * REGULARNI: da. NOSILAC_ZRNA: ne.
 */
export function podlezeNadzoru(tipVerifikatora: TipKorisnika): boolean {
  return tipVerifikatora === TipKorisnika.REGULARNI;
}

/**
 * Da li verifikator ima pristup funkciji verifikovanja drugih (čl. 4).
 * REGULARNI mora imati indeks >= 10%; NOSILAC_ZRNA uvek ima pristup.
 */
export function imaPristupVerifikaciji(tip: TipKorisnika, indeks: number): boolean {
  if (tip === TipKorisnika.NOSILAC_ZRNA) return true;
  if (tip === TipKorisnika.NEVERIFIKOVAN) return false;
  return indeks >= FUNKCIONALNI_PRAG_INDEKSA;
}

/**
 * Strogo anti-cirkularno pravilo (čl. 12 Pravilnika).
 *
 * Verifikator NE sme da verifikuje:
 *  - samog sebe
 *  - svog verifikatora (recipročno)
 *  - korisnika u svom ancestralnom lancu
 *  - korisnika u svom descendentnom lancu
 *  - braću (decu istog verifikatora)
 *
 * @param verifikatorId  korisnik koji započinje verifikaciju
 * @param verifikovaniId korisnik koji bi bio verifikovan
 * @param graf           svi postojeći verifikacioni zapisi
 */
export function proveriAntiCirkularno(
  verifikatorId: string,
  verifikovaniId: string,
  graf: GrafZapis[]
): ProveraAntiCirkularnoRezultat {
  // 1. Samoverifikacija
  if (verifikatorId === verifikovaniId) {
    return {
      dozvoljeno: false,
      razlog: "Ne možeš da verifikuješ samog sebe.",
    };
  }

  // 2. Izgradi mape: roditelj (child → parent) i deca (parent → children[])
  const roditelj = new Map<string, string>();
  const deca = new Map<string, string[]>();
  for (const v of graf) {
    roditelj.set(v.verifikovaniId, v.verifikatorId);
    const lista = deca.get(v.verifikatorId);
    if (lista) lista.push(v.verifikovaniId);
    else deca.set(v.verifikatorId, [v.verifikovaniId]);
  }

  const verifikatorovVerifikator = roditelj.get(verifikatorId);

  // 3. Recipročno: verifikovani je direktni verifikator-ov verifikator
  if (verifikatorovVerifikator && verifikatorovVerifikator === verifikovaniId) {
    return {
      dozvoljeno: false,
      razlog: "Korisnik je tvoj verifikator (recipročna zabrana, čl. 12 Pravilnika).",
    };
  }

  // 4. Ancestralni lanac (uključuje i direktnog roditelja, ali on je pokriven gore)
  const ancestori = new Set<string>();
  let cur: string | undefined = verifikatorovVerifikator;
  while (cur) {
    if (ancestori.has(cur)) break; // safety: krug
    ancestori.add(cur);
    cur = roditelj.get(cur);
  }
  if (ancestori.has(verifikovaniId)) {
    return {
      dozvoljeno: false,
      razlog: "Korisnik je u tvom ancestralnom lancu (čl. 12 Pravilnika).",
    };
  }

  // 5. Descendentni lanac (DFS)
  const descendenti = new Set<string>();
  const stack: string[] = [...(deca.get(verifikatorId) ?? [])];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (descendenti.has(node)) continue;
    descendenti.add(node);
    const kids = deca.get(node);
    if (kids) stack.push(...kids);
  }
  if (descendenti.has(verifikovaniId)) {
    return {
      dozvoljeno: false,
      razlog: "Korisnik je u tvom descendentnom lancu (čl. 12 Pravilnika).",
    };
  }

  // 6. Braća (deca verifikator-ovog roditelja, isključujući njega samog)
  if (verifikatorovVerifikator) {
    const sva = deca.get(verifikatorovVerifikator) ?? [];
    for (const sibling of sva) {
      if (sibling !== verifikatorId && sibling === verifikovaniId) {
        return {
          dozvoljeno: false,
          razlog: "Korisnik je tvoj brat u verifikacionom stablu (čl. 12 Pravilnika).",
        };
      }
    }
  }

  return { dozvoljeno: true };
}

/**
 * Formatira indeks stvarnosti za prikaz u UI po dogovorenom obrascu:
 *   - POCETNI / NOSILAC_ZRNA → "∞/X%"
 *   - REGULARNI / NEVERIFIKOVAN → "Y/X%"
 * gde je X indeks, Y = raspoloživi slotovi × 10.
 */
export function formatIndeksZaPrikaz(
  tip: TipKorisnika,
  indeks: number,
  slotoviPotroseni: number
): string {
  const kapacitet = izracunajKapacitet(tip, indeks);
  if (kapacitet === BESKONACNI_KAPACITET) {
    return `∞/${indeks}%`;
  }
  const raspolozivi = brojRaspolozivihSlotova(kapacitet, slotoviPotroseni) ?? 0;
  return `${raspolozivi * 10}/${indeks}%`;
}
