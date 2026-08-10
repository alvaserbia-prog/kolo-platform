/**
 * Graf verifikacija — prikaz cele mreže potvrda za verifikovane korisnike
 * (Pravilnik o dokazu stvarnosti: čl. 12 zona, čl. 14 početni, čl. 22 prelazno).
 *
 * Čiste funkcije bez Prisma poziva — deterministički testabilne. Raspored je
 * radijalan i stabilan: isti podaci daju iste koordinate, nezavisno od
 * redosleda ulaza (interno sortiranje po donatorskom broju / vremenskom žigu),
 * bez randomizacije i bez simulacije sila.
 *
 * Model rasporeda:
 *  - "stablo" grafa čini PRVA primljena verifikacija svakog korisnika
 *    (najranija po vremenskom žigu) — ta ivica se crta radijalno;
 *  - sve ostale ivice (2.–10. verifikacija, bilo kog smera) su dodatne veze
 *    i crtaju se kao tetive preko kruga;
 *  - koren = početni korisnik ili korisnik bez primljenih veza (siroče-podstablo
 *    posle brisanja naloga — brisanje uklanja ivice, pa koren ne mora biti osnivač);
 *  - ugao čvora određuje sektor grane (proporcionalno veličini podstabla),
 *    poluprečnik određuje dubina po lancu prve verifikacije.
 */
import { TipKorisnika } from "@/generated/prisma/enums";
import {
  MAX_INDEKS,
  PRELAZNI_MAX_PRIMLJENIH,
  PRELAZNI_OPTICAJ_PRAG,
} from "./dokaz-stvarnosti";

export type GrafUlazCvor = {
  id: string;
  broj: number; // donatorski broj — javna numerička oznaka čvora
  jeOsnivac: boolean;
};

export type GrafUlazIvica = {
  verifikatorId: string;
  verifikovaniId: string;
  vremenskiZig: Date;
};

export type Koordinata = { x: number; y: number; dubina: number; ugao: number };

/** Podrazumevani razmak prstenova dubine (SVG jedinice). */
export const KORAK_POLUPRECNIKA = 150;

/**
 * Za svaki čvor bira roditelja u stablu prikaza: verifikator NAJRANIJE
 * primljene verifikacije. Nerešeno (isti žig) se lomi po verifikatorId-u
 * radi determinizma.
 */
export function odrediStabloRoditelja(ivice: GrafUlazIvica[]): Map<string, string> {
  const roditelj = new Map<string, { verifikatorId: string; zig: number }>();
  for (const iv of ivice) {
    const zig = iv.vremenskiZig.getTime();
    const postojeci = roditelj.get(iv.verifikovaniId);
    if (
      !postojeci ||
      zig < postojeci.zig ||
      (zig === postojeci.zig && iv.verifikatorId < postojeci.verifikatorId)
    ) {
      roditelj.set(iv.verifikovaniId, { verifikatorId: iv.verifikatorId, zig });
    }
  }
  const rezultat = new Map<string, string>();
  for (const [dete, r] of roditelj) rezultat.set(dete, r.verifikatorId);
  return rezultat;
}

/**
 * Radijalni raspored: koreni (osnivači pa ostali, po broju) dele pun krug na
 * sektore proporcionalno veličini podstabla; unutar sektora deca rekurzivno
 * dele opseg ugla. Jedan koren stoji u centru; više korenova ide na prvi prsten.
 */
export function rasporediGraf(
  cvorovi: GrafUlazCvor[],
  ivice: GrafUlazIvica[],
  korak: number = KORAK_POLUPRECNIKA
): Map<string, Koordinata> {
  const poBroju = new Map(cvorovi.map((c) => [c.id, c.broj]));
  const stablo = odrediStabloRoditelja(ivice);

  // Deca u stablu — samo čvorovi prisutni u ulazu; roditelj van skupa → čvor je koren.
  const deca = new Map<string, string[]>();
  const koreni: GrafUlazCvor[] = [];
  for (const c of [...cvorovi].sort((a, b) => a.broj - b.broj)) {
    const r = stablo.get(c.id);
    if (r !== undefined && poBroju.has(r)) {
      const lista = deca.get(r);
      if (lista) lista.push(c.id);
      else deca.set(r, [c.id]);
    } else {
      koreni.push(c);
    }
  }
  // Osnivači prvi (jezgro mreže), zatim siročad; unutar grupe po broju.
  koreni.sort((a, b) =>
    a.jeOsnivac === b.jeOsnivac ? a.broj - b.broj : a.jeOsnivac ? -1 : 1
  );

  // Veličine podstabala (iterativno, sa zaštitom od ciklusa u degenerisanim podacima).
  const velicina = new Map<string, number>();
  function izracunajVelicinu(koren: string): number {
    const postOrder: string[] = [];
    const stek = [koren];
    const videli = new Set<string>([koren]);
    while (stek.length > 0) {
      const n = stek.pop()!;
      postOrder.push(n);
      for (const d of deca.get(n) ?? []) {
        if (videli.has(d)) continue;
        videli.add(d);
        stek.push(d);
      }
    }
    for (let i = postOrder.length - 1; i >= 0; i--) {
      const n = postOrder[i];
      let v = 1;
      for (const d of deca.get(n) ?? []) v += velicina.get(d) ?? 0;
      velicina.set(n, v);
    }
    return velicina.get(koren) ?? 1;
  }

  const ukupno = koreni.reduce((z, k) => z + izracunajVelicinu(k.id), 0);
  const koordinate = new Map<string, Koordinata>();
  if (ukupno === 0) return koordinate;

  const centarJedanKoren = koreni.length === 1;
  const bazniPomak = centarJedanKoren ? 0 : 1; // više korenova → prvi prsten

  function postavi(id: string, od: number, dolzina: number, dubina: number) {
    const ugao = od + dolzina / 2;
    const r = dubina === 0 && centarJedanKoren ? 0 : (dubina + bazniPomak) * korak;
    koordinate.set(id, {
      x: Math.cos(ugao) * r,
      y: Math.sin(ugao) * r,
      dubina,
      ugao,
    });
    const mojaDeca = deca.get(id) ?? [];
    const zbirDece = mojaDeca.reduce((z, d) => z + (velicina.get(d) ?? 1), 0);
    if (zbirDece === 0) return;
    let kursor = od;
    for (const d of mojaDeca) {
      if (koordinate.has(d)) continue; // zaštita od ciklusa
      const deo = (dolzina * (velicina.get(d) ?? 1)) / zbirDece;
      postavi(d, kursor, deo, dubina + 1);
      kursor += deo;
    }
  }

  let kursor = -Math.PI / 2; // početak na vrhu kruga
  for (const k of koreni) {
    const deo = (2 * Math.PI * (velicina.get(k.id) ?? 1)) / ukupno;
    postavi(k.id, kursor, deo, 0);
    kursor += deo;
  }
  return koordinate;
}

// ─── Stanje čvora iz ugla posmatrača ─────────────────────────────────────────

/**
 * Tačno četiri stanja + sopstveni čvor:
 *  - JA    — čvor posmatrača
 *  - PUN   — niko ga ne može verifikovati (osnivač / indeks 100% kod REGULARNOG /
 *            prelazno ograničenje čl. 22)
 *  - ZONA  — posmatrač ga ne može verifikovati zbog zabranjene zone (čl. 12,
 *            provera u oba smera)
 *  - MOGU  — verifikacija dozvoljena (da li posmatrač ima slobodan slot je
 *            svojstvo posmatrača, ne čvora — klijent iz toga izvodi prikaz
 *            "bez slota")
 * Redosled provera prati verifikacija-service: univerzalne zabrane (PUN) imaju
 * prednost nad ličnom zonom.
 */
export type CvorStanje = "JA" | "MOGU" | "ZONA" | "PUN";
export type StanjeRazlog =
  | "osnivac"
  | "indeks_pun"
  | "prelazno"
  | "zona"
  | "zona_obrnuto"
  | "prva_generacija";

export type StanjeCvoraUlaz = {
  id: string;
  jeOsnivac: boolean;
  tip: TipKorisnika;
  indeks: number;
  primljenoVerifikacija: number;
};

export function stanjeCvora(
  posmatracId: string,
  cvor: StanjeCvoraUlaz,
  uZoniPosmatraca: boolean,
  posmatracUZoniCvora: boolean,
  opticaj: number,
  // Izuzetak za prvu generaciju (čl. 12 st. 5, v4.0.1): posmatrač i čvor su
  // neposredno verifikovani istog početnog korisnika i nisu povezani linijom —
  // zona ih ne razdvaja, čvor je MOGU (uz poseban razlog za panel).
  izuzetakPrvaGeneracija = false
): { stanje: CvorStanje; razlog?: StanjeRazlog } {
  if (cvor.id === posmatracId) return { stanje: "JA" };
  if (cvor.jeOsnivac) return { stanje: "PUN", razlog: "osnivac" };
  if (cvor.tip === TipKorisnika.REGULARNI && cvor.indeks >= MAX_INDEKS) {
    return { stanje: "PUN", razlog: "indeks_pun" };
  }
  if (
    opticaj < PRELAZNI_OPTICAJ_PRAG &&
    cvor.primljenoVerifikacija >= PRELAZNI_MAX_PRIMLJENIH
  ) {
    return { stanje: "PUN", razlog: "prelazno" };
  }
  if (uZoniPosmatraca || posmatracUZoniCvora) {
    if (izuzetakPrvaGeneracija) return { stanje: "MOGU", razlog: "prva_generacija" };
    return uZoniPosmatraca
      ? { stanje: "ZONA", razlog: "zona" }
      : { stanje: "ZONA", razlog: "zona_obrnuto" };
  }
  return { stanje: "MOGU" };
}
