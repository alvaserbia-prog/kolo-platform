/**
 * Simetrična zabranjena zona verifikacije
 * (Pravilnik o dokazu stvarnosti v3.9.2, čl. 12–14).
 *
 * Čiste funkcije bez Prisma poziva — primaju graf verifikacija i skup početnih
 * korisnika, vraćaju materijalizovano stanje zona. Deterministički testabilno.
 *
 * Definicija zone (fiksna tačka nad grafom, čl. 12):
 *   Zone(U) = Subtree(U)
 *           ∪ za svakog verifikatora V korisnika U: {V} ∪ Anc(V) ∪ Subtree(V)
 *           ∪ za svakog W koga je U verifikovao: {W} ∪ Zone(W)   (simetrična apsorpcija)
 *
 * Zona je monotona: kasnija proširenja Zone(W) proširuju i Zone(U) — dinamički.
 * IZUZETAK (čl. 12 st. 3): proširenja nastala verifikacijama DRUGIH korisnika ne
 * prenose se na početne korisnike — zabranjena zona početnog korisnika širi se
 * isključivo verifikacijama koje sam obavi (tada apsorbuje zonu mete, snapshot).
 * Zbog snapshot semantike početnih, stanje zavisi od hronološkog redosleda
 * zapisa, pa je rekomputacija = replay grafa po vremenskom žigu.
 *
 * Provera dozvole ide u OBA smera (čl. 12): niko ne može verifikovati korisnika
 * koji se nalazi u njegovoj zabranjenoj zoni, NITI korisnika u čijoj se
 * zabranjenoj zoni sam nalazi. Za ne-početne korisnike su smerovi praktično
 * simetrični; kod početnih (čija se zona ne širi tuđim verifikacijama) obrnuti
 * smer je taj koji nosi zabranu — zato NIJE redundantan.
 */
import { GrafZapis } from "./dokaz-stvarnosti";

export type ZonaZapis = GrafZapis & { vremenskiZig?: Date };

/** userId → skup korisnika koje NE SME da verifikuje. */
export type ZonaStanje = Map<string, Set<string>>;

/** Pomoćne mape grafa (DAG): child → roditelji, parent → deca. */
export type ZonaGraf = {
  roditelji: Map<string, Set<string>>;
  deca: Map<string, Set<string>>;
};

export function prazanZonaGraf(): ZonaGraf {
  return { roditelji: new Map(), deca: new Map() };
}

function uSkup(mapa: Map<string, Set<string>>, kljuc: string, vrednost: string) {
  const s = mapa.get(kljuc);
  if (s) s.add(vrednost);
  else mapa.set(kljuc, new Set([vrednost]));
}

/** Ancestralni lanac naviše (bez samog čvora), do korenova grafa. */
function predci(graf: ZonaGraf, cvor: string): Set<string> {
  const rezultat = new Set<string>();
  const stek = [...(graf.roditelji.get(cvor) ?? [])];
  while (stek.length > 0) {
    const n = stek.pop()!;
    if (rezultat.has(n)) continue;
    rezultat.add(n);
    for (const p of graf.roditelji.get(n) ?? []) stek.push(p);
  }
  return rezultat;
}

/** Podstablo naniže (bez samog čvora). */
function podstablo(graf: ZonaGraf, cvor: string): Set<string> {
  const rezultat = new Set<string>();
  const stek = [...(graf.deca.get(cvor) ?? [])];
  while (stek.length > 0) {
    const n = stek.pop()!;
    if (rezultat.has(n)) continue;
    rezultat.add(n);
    for (const c of graf.deca.get(n) ?? []) stek.push(c);
  }
  return rezultat;
}

function zonaSkupa(stanje: ZonaStanje, userId: string): Set<string> {
  let s = stanje.get(userId);
  if (!s) {
    s = new Set();
    stanje.set(userId, s);
  }
  return s;
}

/** Da li se target nalazi u zabranjenoj zoni korisnika (jedan smer). */
export function uZoni(stanje: ZonaStanje, userId: string, targetId: string): boolean {
  return stanje.get(userId)?.has(targetId) ?? false;
}

/**
 * Inkrementalni korak: upisuje ivicu verifikator→verifikovani u graf i širi
 * zone po pravilima čl. 12 (v3.9.2). Sve unije su idempotentne; funkcija
 * mutira `stanje` i `graf` (namerno — koristi je replay u recomputeZones).
 *
 * Koraci (A = verifikator, B = verifikovani):
 *  a) postojeće pravilo: Zone(B) += {A} ∪ Anc(A) ∪ Subtree(A)
 *     (preskače se ako je B početni — zona početnog raste samo njegovim
 *      sopstvenim verifikacijama; legacy zapisi gde je početni bio meta)
 *  b) NOVO — simetrična apsorpcija: Zone(A) += {B} ∪ Zone(B)
 *     (važi i kada je A početni: ovo JESTE njegova sopstvena verifikacija)
 *  c) braća: {B} ∪ Subtree(B) ulazi u podstablo A i svih predaka A, pa u zonu
 *     njihove neposredne dece
 *  d) ancestralni lanac naniže: svi u Subtree(B) dobijaju {A} ∪ Anc(A)
 *     (njihov lanac predaka se produžio novom ivicom)
 *  e) propagacija: svako proširenje Zone(X) prenosi se verifikatorima X-a
 *     rekurzivno naviše (apsorpcija je dinamička), SA STOPOM na početnima.
 */
export function dodajVerifikacijuUZonu(
  stanje: ZonaStanje,
  graf: ZonaGraf,
  pocetniIds: Set<string>,
  verifikatorId: string,
  verifikovaniId: string
): void {
  const A = verifikatorId;
  const B = verifikovaniId;
  if (A === B) return; // samoverifikacija se ne evidentira

  uSkup(graf.roditelji, B, A);
  uSkup(graf.deca, A, B);

  const ancA = predci(graf, A); // bez A
  const subA = podstablo(graf, A); // bez A; sadrži B i celo podstablo B
  const subB = podstablo(graf, B); // bez B

  // Red proširenja za propagaciju naviše (korak e).
  const red: Array<[string, Set<string>]> = [];
  const dodaj = (u: string, kandidati: Iterable<string>) => {
    const z = zonaSkupa(stanje, u);
    const delta = new Set<string>();
    for (const k of kandidati) {
      if (k === u || z.has(k)) continue;
      z.add(k);
      delta.add(k);
    }
    if (delta.size > 0) red.push([u, delta]);
  };

  // a) Zone(B) += {A} ∪ Anc(A) ∪ Subtree(A)
  if (!pocetniIds.has(B)) dodaj(B, [A, ...ancA, ...subA]);

  // b) Zone(A) += {B} ∪ Zone(B) — trajno preuzimanje zone verifikovanog
  dodaj(A, [B, ...(stanje.get(B) ?? [])]);

  // c) {B} ∪ Subtree(B) je novi deo podstabla A i svih predaka A → zona
  //    njihove neposredne dece (pravilo braće; deca početnih nisu izuzetak —
  //    stop važi samo za zonu samog početnog korisnika)
  const noviDeoPodstabla = [B, ...subB];
  for (const X of [A, ...ancA]) {
    for (const C of graf.deca.get(X) ?? []) {
      if (C === B || pocetniIds.has(C)) continue;
      dodaj(C, noviDeoPodstabla);
    }
  }

  // d) svi u Subtree(B) dobili su nove pretke {A} ∪ Anc(A)
  const noviPredci = [A, ...ancA];
  for (const D of subB) {
    if (pocetniIds.has(D)) continue;
    dodaj(D, noviPredci);
  }

  // e) propagacija proširenja naviše (Zone(V) ⊇ Zone(U) za V verifikatora U),
  //    sa stopom na početnim korisnicima
  for (let i = 0; i < red.length; i++) {
    const [U, delta] = red[i];
    for (const V of graf.roditelji.get(U) ?? []) {
      if (pocetniIds.has(V)) continue;
      dodaj(V, delta); // idempotentno; nova proširenja ulaze u red
    }
  }
}

/**
 * Puna rekomputacija zona iz grafa: hronološki replay svih verifikacionih
 * zapisa kroz inkrementalni korak. Čista funkcija — ista se koristi za
 * migraciju/backfill, za sinhronizaciju pri upisu verifikacije i za
 * preračunavanje od nule posle poništavanja/prestanka statusa (unija nije
 * invertibilna, pa se pogođene zone ne oduzimaju nego preračunavaju).
 *
 * Zapisi bez vremenskog žiga zadržavaju ulazni redosled (stabilan sort).
 */
export function recomputeZones(zapisi: ZonaZapis[], pocetniIds: Set<string>): ZonaStanje {
  return recomputeZonesSaGrafom(zapisi, pocetniIds).stanje;
}

/**
 * Kao recomputeZones, ali vraća i izgrađene mape grafa — da pozivalac može da
 * nastavi inkrementalno (dodajVerifikacijuUZonu za novu ivicu) bez ponovnog
 * replay-a celog grafa.
 */
export function recomputeZonesSaGrafom(
  zapisi: ZonaZapis[],
  pocetniIds: Set<string>
): { stanje: ZonaStanje; graf: ZonaGraf } {
  const sortirano = [...zapisi].sort(
    (x, y) => (x.vremenskiZig?.getTime() ?? 0) - (y.vremenskiZig?.getTime() ?? 0)
  );
  const stanje: ZonaStanje = new Map();
  const graf = prazanZonaGraf();
  for (const z of sortirano) {
    dodajVerifikacijuUZonu(stanje, graf, pocetniIds, z.verifikatorId, z.verifikovaniId);
  }
  return { stanje, graf };
}

/** Ravna lista parova za upis u tabelu verification_zone. */
export function zonaParovi(
  stanje: ZonaStanje
): Array<{ userId: string; forbiddenUserId: string }> {
  const parovi: Array<{ userId: string; forbiddenUserId: string }> = [];
  for (const [userId, zabranjeni] of stanje) {
    for (const forbiddenUserId of zabranjeni) {
      parovi.push({ userId, forbiddenUserId });
    }
  }
  return parovi;
}

export type ProveraZoneRezultat =
  | { dozvoljeno: true }
  | { dozvoljeno: false; vrsta: "POCETNI_META" | "ZONA"; razlog: string };

/**
 * Provera dozvole verifikacije A→B (čl. 12 i čl. 14 st. 3, v3.9.2):
 *  1. B nije početni korisnik — početni se ne verifikuju u lancu jemstva;
 *  2. B ∉ Zone(A) — meta nije u zabranjenoj zoni verifikatora;
 *  3. A ∉ Zone(B) — verifikator se ne nalazi u zabranjenoj zoni mete.
 * Poruke razlikuju zabranjenu zonu od zabrane verifikovanja početnog korisnika.
 */
export function proveriDozvoluVerifikacije(
  stanje: ZonaStanje,
  pocetniIds: Set<string>,
  verifikatorId: string,
  verifikovaniId: string
): ProveraZoneRezultat {
  if (verifikatorId === verifikovaniId) {
    return {
      dozvoljeno: false,
      vrsta: "ZONA",
      razlog: "Ne možeš da verifikuješ samog sebe.",
    };
  }
  if (pocetniIds.has(verifikovaniId)) {
    return {
      dozvoljeno: false,
      vrsta: "POCETNI_META",
      razlog:
        "Početni korisnici ne mogu biti verifikovani u lancu jemstva — njihova stvarnost proizlazi iz javne evidencije, odnosno odluke Upravnog odbora (čl. 14 Pravilnika o dokazu stvarnosti).",
    };
  }
  if (uZoni(stanje, verifikatorId, verifikovaniId)) {
    return {
      dozvoljeno: false,
      vrsta: "ZONA",
      razlog:
        "Korisnik se nalazi u tvojoj zabranjenoj zoni (čl. 12 Pravilnika o dokazu stvarnosti).",
    };
  }
  if (uZoni(stanje, verifikovaniId, verifikatorId)) {
    return {
      dozvoljeno: false,
      vrsta: "ZONA",
      razlog:
        "Nalaziš se u zabranjenoj zoni ovog korisnika, pa ga ne možeš verifikovati (čl. 12 Pravilnika o dokazu stvarnosti).",
    };
  }
  return { dozvoljeno: true };
}
