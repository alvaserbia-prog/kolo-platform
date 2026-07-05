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
export const TOKEN_VAZI_SEKUNDI = 2 * 60 * 60; // QR token TTL = 2 sata

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
 * Strogo anti-cirkularno pravilo (čl. 12 Pravilnika, verzija 3.9.1).
 *
 * Korisnik po pravilu ima VIŠE verifikatora (do 10). Zabranjena zona je
 * UNIJA zona svih njegovih verifikatora. Verifikator NE sme da verifikuje:
 *  - samog sebe
 *  - nijednog svog verifikatora (recipročno)
 *  - nikog iz ancestralnog lanca bilo kog svog verifikatora (naviše, do korenova)
 *  - nikog iz podstabla bilo kog svog verifikatora (naniže — uključuje braću
 *    i sve njihove potomke)
 *  - nikog iz sopstvenog descendentnog lanca (za korenske korisnike bez verifikatora)
 *
 * Graf verifikacija je DAG (više roditelja po čvoru), pa se roditelji čuvaju
 * kao skup, a ne kao jedan čvor.
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

  // 2. Izgradi mape: roditelji (child → Set<parent>, DAG) i deca (parent → children[])
  const roditelji = new Map<string, Set<string>>();
  const deca = new Map<string, string[]>();
  for (const v of graf) {
    const rlista = roditelji.get(v.verifikovaniId);
    if (rlista) rlista.add(v.verifikatorId);
    else roditelji.set(v.verifikovaniId, new Set([v.verifikatorId]));
    const dlista = deca.get(v.verifikatorId);
    if (dlista) dlista.push(v.verifikovaniId);
    else deca.set(v.verifikatorId, [v.verifikovaniId]);
  }

  const direktniVerifikatori = roditelji.get(verifikatorId) ?? new Set<string>();

  // 3. Recipročno: verifikovani je jedan od direktnih verifikatora
  if (direktniVerifikatori.has(verifikovaniId)) {
    return {
      dozvoljeno: false,
      razlog: "Korisnik je tvoj verifikator (recipročna zabrana, čl. 12 Pravilnika).",
    };
  }

  // 4. Ancestralni lanac (unija) — sve iznad svakog direktnog verifikatora
  const ancestori = new Set<string>();
  const upStack: string[] = [];
  for (const p of direktniVerifikatori) {
    for (const pp of roditelji.get(p) ?? []) upStack.push(pp);
  }
  while (upStack.length > 0) {
    const node = upStack.pop()!;
    if (ancestori.has(node)) continue;
    ancestori.add(node);
    for (const pp of roditelji.get(node) ?? []) upStack.push(pp);
  }
  if (ancestori.has(verifikovaniId)) {
    return {
      dozvoljeno: false,
      razlog: "Korisnik je u ancestralnom lancu tvog verifikatora (čl. 12 Pravilnika).",
    };
  }

  // 5. Sopstveni descendentni lanac (DFS naniže od samog verifikatora)
  const sopstveniDescendenti = new Set<string>();
  const downStack: string[] = [...(deca.get(verifikatorId) ?? [])];
  while (downStack.length > 0) {
    const node = downStack.pop()!;
    if (sopstveniDescendenti.has(node)) continue;
    sopstveniDescendenti.add(node);
    for (const c of deca.get(node) ?? []) downStack.push(c);
  }
  if (sopstveniDescendenti.has(verifikovaniId)) {
    return {
      dozvoljeno: false,
      razlog: "Korisnik je u tvom descendentnom lancu (čl. 12 Pravilnika).",
    };
  }

  // 6. Podstabla verifikatora (unija) — DFS naniže od svakog direktnog verifikatora;
  //    obuhvata braću i sve njihove potomke.
  const podstablaVerifikatora = new Set<string>();
  const subStack: string[] = [...direktniVerifikatori];
  while (subStack.length > 0) {
    const node = subStack.pop()!;
    if (podstablaVerifikatora.has(node)) continue;
    podstablaVerifikatora.add(node);
    for (const c of deca.get(node) ?? []) subStack.push(c);
  }
  if (podstablaVerifikatora.has(verifikovaniId)) {
    return {
      dozvoljeno: false,
      razlog: "Korisnik je u podstablu tvog verifikatora (čl. 12 Pravilnika).",
    };
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
