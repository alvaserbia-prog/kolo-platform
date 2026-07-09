/**
 * Testovi simetrične zabranjene zone (Pravilnik o dokazu stvarnosti v3.9.2,
 * čl. 12–14): recomputeZones (replay grafa), inkrementalno širenje, provera
 * dozvole u oba smera, stop propagacije na početnim korisnicima, fiksan indeks
 * početnih i idempotentnost rekomputacije posle kaskadnog poništavanja.
 */
import { describe, it, expect } from "vitest";
import {
  dodajVerifikacijuUZonu,
  prazanZonaGraf,
  proveriDozvoluVerifikacije,
  recomputeZones,
  recomputeZonesSaGrafom,
  uZoni,
  zonaParovi,
  type ZonaStanje,
  type ZonaZapis,
} from "@/lib/protokol/zona";
import {
  PRELAZNI_OPTICAJ_PRAG,
  POCETNI_INDEKS,
  izracunajIndeks,
  proveriAntiCirkularno,
  proveriPrelaznoOgranicenje,
  zasticeniIndeks,
} from "@/lib/protokol/dokaz-stvarnosti";

/** Pravi zapise sa rastućim vremenskim žigom u datom redosledu. */
function zapisi(...ivice: Array<[string, string]>): ZonaZapis[] {
  return ivice.map(([verifikatorId, verifikovaniId], i) => ({
    verifikatorId,
    verifikovaniId,
    vremenskiZig: new Date(2026, 0, 1, 0, 0, i),
  }));
}

const NIKO = new Set<string>();

/** Kraća provera: sme li A da verifikuje B (oba smera + početni)? */
function sme(
  stanje: ZonaStanje,
  pocetni: Set<string>,
  a: string,
  b: string
): boolean {
  return proveriDozvoluVerifikacije(stanje, pocetni, a, b).dozvoljeno;
}

describe("zabranjena zona — osnovna simetrija (čl. 12)", () => {
  it("1. recipročna zabrana: A verifikuje B → B ne može A", () => {
    const stanje = recomputeZones(zapisi(["A", "B"]), NIKO);
    // B je u zoni A (simetrična apsorpcija) i A je u zoni B (verifikator)
    expect(uZoni(stanje, "A", "B")).toBe(true);
    expect(uZoni(stanje, "B", "A")).toBe(true);
    expect(sme(stanje, NIKO, "B", "A")).toBe(false);
    expect(sme(stanje, NIKO, "A", "B")).toBe(false); // dupla verifikacija istog para
  });

  it("2. braća: deca istog verifikatora međusobno zabranjena", () => {
    const stanje = recomputeZones(zapisi(["V", "C1"], ["V", "C2"]), NIKO);
    expect(uZoni(stanje, "C1", "C2")).toBe(true);
    expect(uZoni(stanje, "C2", "C1")).toBe(true);
    expect(sme(stanje, NIKO, "C1", "C2")).toBe(false);
    expect(sme(stanje, NIKO, "C2", "C1")).toBe(false);
  });

  it("samoverifikacija je zabranjena i ne ulazi u stanje", () => {
    const stanje = recomputeZones(zapisi(["A", "A"], ["A", "B"]), NIKO);
    expect(uZoni(stanje, "A", "A")).toBe(false);
    expect(sme(stanje, NIKO, "A", "A")).toBe(false);
  });

  it("nezavisne grane ostaju dozvoljene", () => {
    const stanje = recomputeZones(zapisi(["A", "B"], ["X", "Y"]), NIKO);
    expect(sme(stanje, NIKO, "A", "Y")).toBe(true);
    expect(sme(stanje, NIKO, "B", "X")).toBe(true);
  });
});

describe("zabranjena zona — apsorpcija zone mete (čl. 12, novi stav)", () => {
  it("3. stric: dozvoljen PRE, posle apsorpcije zabranjeno celo dedino podstablo", () => {
    // Deda G verifikuje strica S i S2; X je u nezavisnoj grani (F → X).
    const pre = recomputeZones(
      zapisi(["G", "S"], ["G", "S2"], ["S2", "S3"], ["F", "X"]),
      NIKO
    );
    expect(sme(pre, NIKO, "X", "S")).toBe(true);

    // X verifikuje strica S → trajno preuzima Zone(S), koja sadrži dedu G,
    // braću S2 i celo njihovo potomstvo (S3).
    const posle = recomputeZones(
      zapisi(["G", "S"], ["G", "S2"], ["S2", "S3"], ["F", "X"], ["X", "S"]),
      NIKO
    );
    expect(uZoni(posle, "X", "G")).toBe(true);
    expect(uZoni(posle, "X", "S2")).toBe(true);
    expect(uZoni(posle, "X", "S3")).toBe(true);
    expect(sme(posle, NIKO, "X", "G")).toBe(false);
    expect(sme(posle, NIKO, "X", "S2")).toBe(false);
    expect(sme(posle, NIKO, "X", "S3")).toBe(false);
  });

  it("4. unakrsni habovi: verifikacija u tuđoj zoni zatvara celu tu zonu", () => {
    // H1 i H2 nezavisni habovi sa sopstvenim podstablima.
    const ivice: Array<[string, string]> = [
      ["H1", "A1"],
      ["H1", "A2"],
      ["H2", "B1"],
      ["H2", "B2"],
      ["B1", "B3"],
    ];
    const pre = recomputeZones(zapisi(...ivice), NIKO);
    expect(sme(pre, NIKO, "H1", "B1")).toBe(true);

    // H1 verifikuje B1 iz H2-ove zone → apsorbuje Zone(B1) ∋ {H2, B2, B3...}
    const posle = recomputeZones(zapisi(...ivice, ["H1", "B1"]), NIKO);
    expect(uZoni(posle, "H1", "H2")).toBe(true);
    expect(uZoni(posle, "H1", "B2")).toBe(true);
    expect(uZoni(posle, "H1", "B3")).toBe(true);
    expect(sme(posle, NIKO, "H1", "B2")).toBe(false);
    expect(sme(posle, NIKO, "H1", "B3")).toBe(false);
  });

  it("5. dinamičnost: proširenje zone verifikovanog POSLE verifikacije važi i za verifikatora", () => {
    // A verifikuje B; TEK POSLE toga B-a verifikuje C (koji ima svoje podstablo C1).
    const stanje = recomputeZones(
      zapisi(["C", "C1"], ["A", "B"], ["C", "B"]),
      NIKO
    );
    // Zone(B) se proširila sa {C} ∪ Anc(C) ∪ Subtree(C) — i to se prenosi na A.
    expect(uZoni(stanje, "A", "C")).toBe(true);
    expect(uZoni(stanje, "A", "C1")).toBe(true);
    expect(sme(stanje, NIKO, "A", "C1")).toBe(false);
  });

  it("dinamičnost važi i kroz lanac naviše (predak apsorbuje proširenje deteta)", () => {
    // R → A → B; B kasnije verifikuje D iz nezavisne grane (E → D).
    const stanje = recomputeZones(
      zapisi(["R", "A"], ["A", "B"], ["E", "D"], ["B", "D"]),
      NIKO
    );
    // Zone(B) ∋ {D, E, ...} propagira na A pa na R.
    expect(uZoni(stanje, "A", "D")).toBe(true);
    expect(uZoni(stanje, "R", "D")).toBe(true);
    expect(uZoni(stanje, "R", "E")).toBe(true);
  });
});

describe("početni korisnici (čl. 12 st. 3 i čl. 14)", () => {
  it("6. stop propagacije: duboka verifikacija NE širi zonu početnog na korenu; sopstvena DA", () => {
    const pocetni = new Set(["P"]);
    // P verifikuje B; dublje u grani B → C, pa C → D.
    const stanje = recomputeZones(
      zapisi(["P", "B"], ["B", "C"], ["C", "D"]),
      pocetni
    );
    // Zona P sadrži samo B (apsorbovana u trenutku sopstvene verifikacije).
    expect(uZoni(stanje, "P", "B")).toBe(true);
    expect(uZoni(stanje, "P", "C")).toBe(false);
    expect(uZoni(stanje, "P", "D")).toBe(false);

    // Ali P svejedno NE MOŽE da verifikuje C/D: nalazi se u NJIHOVOJ zoni
    // (ancestralni lanac) — druga polovina simetrične provere nosi zabranu.
    expect(uZoni(stanje, "C", "P")).toBe(true);
    expect(uZoni(stanje, "D", "P")).toBe(true);
    expect(sme(stanje, pocetni, "P", "C")).toBe(false);
    expect(sme(stanje, pocetni, "P", "D")).toBe(false);

    // Sopstvena verifikacija početnog MU širi zonu: P verifikuje E iz
    // nezavisne grane (F → E) → apsorbuje Zone(E) ∋ {F}.
    const posle = recomputeZones(
      zapisi(["P", "B"], ["B", "C"], ["C", "D"], ["F", "E"], ["P", "E"]),
      pocetni
    );
    expect(uZoni(posle, "P", "E")).toBe(true);
    expect(uZoni(posle, "P", "F")).toBe(true);
  });

  it("7. početni korisnik ne može biti meta verifikacije (posebna poruka)", () => {
    const pocetni = new Set(["P"]);
    const stanje = recomputeZones(zapisi(["A", "B"]), pocetni);
    const rez = proveriDozvoluVerifikacije(stanje, pocetni, "A", "P");
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) {
      expect(rez.vrsta).toBe("POCETNI_META");
      expect(rez.razlog).toContain("Početni korisnici");
    }
    // ...i to važi i za drugog početnog (pokriva raniju zabranu osnivač→osnivač)
    const pocetni2 = new Set(["P", "Q"]);
    const rez2 = proveriDozvoluVerifikacije(stanje, pocetni2, "P", "Q");
    expect(rez2.dozvoljeno).toBe(false);
    if (!rez2.dozvoljeno) expect(rez2.vrsta).toBe("POCETNI_META");
  });

  it("poruka za zabranjenu zonu se razlikuje od poruke za početnog", () => {
    const stanje = recomputeZones(zapisi(["A", "B"]), NIKO);
    const rez = proveriDozvoluVerifikacije(stanje, NIKO, "B", "A");
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) {
      expect(rez.vrsta).toBe("ZONA");
      expect(rez.razlog).toContain("zabranjen");
    }
  });

  it("8. indeks početnog korisnika ostaje 100 kroz sve operacije", () => {
    expect(POCETNI_INDEKS).toBe(100);
    // Verifikacija mu ne diže indeks (blokirana je), pad jemca mu ga ne spušta:
    expect(zasticeniIndeks(true, izracunajIndeks(0))).toBe(100);
    expect(zasticeniIndeks(true, izracunajIndeks(3))).toBe(100);
    expect(zasticeniIndeks(true, 0)).toBe(100);
    // Za ostale vraća izračunato:
    expect(zasticeniIndeks(false, izracunajIndeks(3))).toBe(30);
    expect(zasticeniIndeks(false, 0)).toBe(0);
  });

  it("legacy zapis gde je početni bio verifikovan ne širi zonu početnog", () => {
    const pocetni = new Set(["P"]);
    // Istorijski zapis: A (sa sopstvenim podstablom) je verifikovao početnog P.
    const stanje = recomputeZones(zapisi(["A", "A1"], ["A", "P"]), pocetni);
    // Zona P se NE širi tuđom verifikacijom (ni ovom) — samo sopstvenim.
    expect(uZoni(stanje, "P", "A")).toBe(false);
    expect(uZoni(stanje, "P", "A1")).toBe(false);
    // A je apsorbovao P u svoju zonu (P mu je ubuduće zabranjen i kao meta po čl. 14).
    expect(uZoni(stanje, "A", "P")).toBe(true);
  });
});

describe("rekomputacija i kaskada (čl. 19–20)", () => {
  // Deterministički veći graf: 5 početnih + 20 korisnika, 44 zapisa —
  // odgovara stanju sistema iz migracije.
  function velikiGraf(): { ivice: Array<[string, string]>; pocetni: Set<string> } {
    const pocetni = new Set(["P1", "P2", "P3", "P4", "P5"]);
    const ivice: Array<[string, string]> = [];
    // Svaki početni verifikuje 4 korisnika: P1 → U1..U4, P2 → U5..U8, ...
    for (let p = 1; p <= 5; p++) {
      for (let k = 1; k <= 4; k++) {
        ivice.push([`P${p}`, `U${(p - 1) * 4 + k}`]);
      }
    }
    // Lateralne verifikacije među nezavisnim granama (poštuju staro pravilo):
    // U1 (grana P1) verifikuje U5..U8? Ne — posle prve apsorbuje granu P2.
    // Zato: raznovrsno, svaka iz druge grane.
    const lateralne: Array<[string, string]> = [
      ["U1", "U5"], // grana 1 → grana 2
      ["U2", "U9"], // grana 1 → grana 3
      ["U3", "U13"], // grana 1 → grana 4
      ["U4", "U17"], // grana 1 → grana 5
      ["U6", "U10"], // grana 2 → grana 3
      ["U7", "U14"], // grana 2 → grana 4
      ["U8", "U18"], // grana 2 → grana 5
      ["U11", "U15"], // grana 3 → grana 4
      ["U12", "U19"], // grana 3 → grana 5
      ["U16", "U20"], // grana 4 → grana 5
      // Druga tura — dublje ukrštanje preostalih dozvoljenih parova:
      ["U9", "U2"], // ne! recipročno sa U2→U9
    ];
    lateralne.pop(); // poslednja je namerno nevažeća — izbaci je
    ivice.push(...lateralne);
    // Dopuni do 44 zapisa novim listovima (sigurno dozvoljeno):
    let n = ivice.length;
    let list = 21;
    while (n < 44) {
      ivice.push([`U${((n * 7) % 20) + 1}`, `L${list}`]);
      list++;
      n++;
    }
    return { ivice, pocetni };
  }

  it("10. migracioni backfill: 44 zapisa (5 početnih, 20+ korisnika) prolazi i zone su konzistentne", () => {
    const { ivice, pocetni } = velikiGraf();
    expect(ivice.length).toBe(44);
    const stanje = recomputeZones(zapisi(...ivice), pocetni);

    const parovi = zonaParovi(stanje);
    expect(parovi.length).toBeGreaterThan(0);

    // Invarijante:
    for (const [userId, zabranjeni] of stanje) {
      // (1) niko nije u sopstvenoj zoni
      expect(zabranjeni.has(userId)).toBe(false);
    }
    for (const [a, b] of ivice) {
      // (2) svaka ivica proizvodi zabranu u oba smera
      expect(uZoni(stanje, a, b)).toBe(true);
      if (!pocetni.has(a)) expect(uZoni(stanje, b, a)).toBe(true);
    }
    // (3) zona početnog sadrži isključivo njegove direktne mete i njihove
    //     tada-apsorbovane zone; duboki listovi drugih grana nisu unutra
    //     osim ako su apsorbovani sopstvenom verifikacijom.
    for (const p of pocetni) {
      expect(uZoni(stanje, p, p)).toBe(false);
    }
    // (4) staro anti-cirkularno pravilo je podskup zone: šta ono zabranjuje,
    //     zabranjuje i zona (provera na uzorku svih parova korisnika)
    const svi = [...new Set(ivice.flat())];
    const graf = ivice.map(([verifikatorId, verifikovaniId]) => ({ verifikatorId, verifikovaniId }));
    for (const a of svi) {
      for (const b of svi) {
        if (a === b) continue;
        const staro = proveriAntiCirkularno(a, b, graf);
        if (!staro.dozvoljeno) {
          expect(sme(stanje, pocetni, a, b)).toBe(false);
        }
      }
    }
  });

  it("9. kaskadno poništavanje → recomputeZones nad preostalim grafom je identičan svežem obračunu", () => {
    const { ivice, pocetni } = velikiGraf();
    const sviZapisi = zapisi(...ivice);

    // Kaskada: poništavaju se sve verifikacije koje je obavio U1 (i, rekurzivno,
    // celo njegovo podstablo) — simulacija čl. 19–20: brišu se ivice čiji je
    // verifikator u pogođenom skupu.
    const pogodjeni = new Set<string>(["U1"]);
    let raslo = true;
    while (raslo) {
      raslo = false;
      for (const z of sviZapisi) {
        if (pogodjeni.has(z.verifikatorId) && !pogodjeni.has(z.verifikovaniId)) {
          pogodjeni.add(z.verifikovaniId);
          raslo = true;
        }
      }
    }
    const preostali = sviZapisi.filter((z) => !pogodjeni.has(z.verifikatorId));

    // Rekomputacija od nule iz preostalog grafa…
    const posleKaskade = recomputeZones(preostali, pocetni);
    // …je identična svežem obračunu istog grafa (idempotentnost čiste funkcije)
    const svez = recomputeZones([...preostali], pocetni);
    expect(mapaUObjekat(posleKaskade)).toEqual(mapaUObjekat(svez));

    // Uklonjene ivice više ne proizvode zabranu za nepogođene parove:
    // U1 → U5 je poništeno, pa U5 (koji nije pogođen kao verifikator druge
    // strane) više nema U1 u zoni po tom osnovu.
    expect(uZoni(posleKaskade, "U5", "U1")).toBe(false);
  });

  it("inkrementalni korak daje isto stanje kao replay od nule", () => {
    const { ivice, pocetni } = velikiGraf();
    const sviZapisi = zapisi(...ivice);

    // Replay svih osim poslednje + inkrementalni korak za poslednju…
    const bezPoslednje = sviZapisi.slice(0, -1);
    const poslednja = sviZapisi[sviZapisi.length - 1];
    const { stanje, graf } = recomputeZonesSaGrafom(bezPoslednje, pocetni);
    dodajVerifikacijuUZonu(
      stanje,
      graf,
      pocetni,
      poslednja.verifikatorId,
      poslednja.verifikovaniId
    );
    // …identično punom replay-u
    const puno = recomputeZones(sviZapisi, pocetni);
    expect(mapaUObjekat(stanje)).toEqual(mapaUObjekat(puno));
  });

  it("zonaParovi vraća ravan spisak za upis u verification_zone", () => {
    const stanje = recomputeZones(zapisi(["A", "B"]), NIKO);
    const parovi = zonaParovi(stanje);
    expect(parovi).toContainEqual({ userId: "A", forbiddenUserId: "B" });
    expect(parovi).toContainEqual({ userId: "B", forbiddenUserId: "A" });
  });

  it("prazan graf i prazan inkrementalni graf ne pucaju", () => {
    expect(recomputeZones([], NIKO).size).toBe(0);
    const graf = prazanZonaGraf();
    const stanje: ZonaStanje = new Map();
    dodajVerifikacijuUZonu(stanje, graf, NIKO, "A", "B");
    expect(uZoni(stanje, "A", "B")).toBe(true);
  });
});

describe("prelazno ograničenje broja verifikacija (čl. 22, v3.9.3)", () => {
  it("prag je 100.000 POEN-a opticaja", () => {
    expect(PRELAZNI_OPTICAJ_PRAG).toBe(100_000);
  });

  it("ispod praga: prva verifikacija dozvoljena, druga odbijena", () => {
    expect(proveriPrelaznoOgranicenje(0, 0).dozvoljeno).toBe(true);
    expect(proveriPrelaznoOgranicenje(99_999, 0).dozvoljeno).toBe(true);
    const druga = proveriPrelaznoOgranicenje(99_999, 1);
    expect(druga.dozvoljeno).toBe(false);
    if (!druga.dozvoljeno) {
      expect(druga.razlog).toContain("100.000");
      expect(druga.razlog).toContain("samo jednu verifikaciju");
    }
    expect(proveriPrelaznoOgranicenje(50_000, 5).dozvoljeno).toBe(false);
  });

  it("na pragu i iznad: ograničenje ne važi (indeks raste po opštim pravilima)", () => {
    expect(proveriPrelaznoOgranicenje(100_000, 1).dozvoljeno).toBe(true);
    expect(proveriPrelaznoOgranicenje(100_000, 9).dozvoljeno).toBe(true);
    expect(proveriPrelaznoOgranicenje(2_500_000, 3).dozvoljeno).toBe(true);
  });
});

/** Map<string, Set> → običan objekat sa sortiranim nizovima (za deep equal). */
function mapaUObjekat(stanje: ZonaStanje): Record<string, string[]> {
  const rez: Record<string, string[]> = {};
  for (const [k, v] of stanje) {
    if (v.size > 0) rez[k] = [...v].sort();
  }
  return rez;
}
