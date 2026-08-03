/**
 * Testovi grafa verifikacija (prikaz mreže jemstva): izbor roditelja u stablu
 * (najranija primljena verifikacija), deterministički radijalni raspored
 * (isti podaci → iste koordinate, nezavisno od redosleda ulaza), koreni koji
 * nisu osnivači (siroče-podstabla) i stanje čvora iz ugla posmatrača
 * (JA / PUN / ZONA / MOGU sa razlozima).
 */
import { describe, it, expect } from "vitest";
import {
  odrediStabloRoditelja,
  rasporediGraf,
  stanjeCvora,
  type GrafUlazCvor,
  type GrafUlazIvica,
} from "@/lib/protokol/graf";
import { PRELAZNI_OPTICAJ_PRAG } from "@/lib/protokol/dokaz-stvarnosti";
import { TipKorisnika } from "@/generated/prisma/client";

function cvor(id: string, broj: number, jeOsnivac = false): GrafUlazCvor {
  return { id, broj, jeOsnivac };
}

function ivica(od: string, ka: string, minuta: number): GrafUlazIvica {
  return {
    verifikatorId: od,
    verifikovaniId: ka,
    vremenskiZig: new Date(Date.UTC(2026, 0, 1, 0, minuta)),
  };
}

describe("odrediStabloRoditelja", () => {
  it("bira najraniju primljenu verifikaciju kao roditelja", () => {
    const stablo = odrediStabloRoditelja([
      ivica("B", "X", 30),
      ivica("A", "X", 10),
      ivica("C", "X", 20),
    ]);
    expect(stablo.get("X")).toBe("A");
  });

  it("nerešen žig lomi po verifikatorId-u (deterministički)", () => {
    const stablo = odrediStabloRoditelja([
      ivica("B", "X", 10),
      ivica("A", "X", 10),
    ]);
    expect(stablo.get("X")).toBe("A");
  });
});

describe("rasporediGraf", () => {
  const cvorovi = [
    cvor("o1", 1, true),
    cvor("o2", 2, true),
    cvor("u3", 3),
    cvor("u4", 4),
    cvor("u5", 5),
  ];
  const ivice = [
    ivica("o1", "u3", 1),
    ivica("o2", "u4", 2),
    ivica("u3", "u5", 3),
    // dodatna (ne-stablo) veza: u4 je u5 verifikovao kasnije
    ivica("u4", "u5", 4),
  ];

  it("dva poziva sa istim podacima daju identične koordinate", () => {
    const a = rasporediGraf(cvorovi, ivice);
    const b = rasporediGraf(cvorovi, ivice);
    expect(Object.fromEntries(a)).toEqual(Object.fromEntries(b));
  });

  it("redosled ulaza ne utiče na raspored", () => {
    const a = rasporediGraf(cvorovi, ivice);
    const b = rasporediGraf(
      [...cvorovi].reverse(),
      [...ivice].reverse()
    );
    expect(Object.fromEntries(a)).toEqual(Object.fromEntries(b));
  });

  it("dubina prati lanac prve verifikacije, svi čvorovi dobiju koordinate", () => {
    const k = rasporediGraf(cvorovi, ivice);
    expect(k.size).toBe(5);
    expect(k.get("o1")!.dubina).toBe(0);
    expect(k.get("u3")!.dubina).toBe(1);
    expect(k.get("u5")!.dubina).toBe(2); // roditelj je u3 (ranija veza), ne u4
    expect(k.get("u4")!.dubina).toBe(1);
  });

  it("koren ne mora biti osnivač (siroče posle brisanja jemca)", () => {
    // u9 nema primljenih veza (jemac obrisan), ali je verifikovao u10.
    const k = rasporediGraf(
      [cvor("u9", 9), cvor("u10", 10)],
      [ivica("u9", "u10", 1)]
    );
    expect(k.get("u9")!.dubina).toBe(0);
    expect(k.get("u10")!.dubina).toBe(1);
  });

  it("jedan koren stoji u centru", () => {
    const k = rasporediGraf([cvor("o1", 1, true), cvor("u2", 2)], [ivica("o1", "u2", 1)]);
    expect(k.get("o1")).toMatchObject({ x: 0, y: 0 });
  });

  it("više korenova ne stoji u centru i ne preklapa se", () => {
    const k = rasporediGraf([cvor("o1", 1, true), cvor("o2", 2, true)], []);
    const a = k.get("o1")!;
    const b = k.get("o2")!;
    expect(Math.hypot(a.x, a.y)).toBeGreaterThan(0);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(1);
  });
});

describe("stanjeCvora", () => {
  const opticajPosle = PRELAZNI_OPTICAJ_PRAG; // prag dostignut — prelazno ne važi
  const regularni = (id: string, indeks: number, primljeno: number) => ({
    id,
    jeOsnivac: false,
    tip: TipKorisnika.REGULARNI,
    indeks,
    primljenoVerifikacija: primljeno,
  });

  it("sopstveni čvor je JA", () => {
    expect(stanjeCvora("x", regularni("x", 50, 5), false, false, opticajPosle).stanje).toBe("JA");
  });

  it("početni korisnik je PUN za svakog posmatrača, čak i u zoni", () => {
    const r = stanjeCvora(
      "posmatrac",
      { id: "o", jeOsnivac: true, tip: TipKorisnika.NOSILAC_ZRNA, indeks: 100, primljenoVerifikacija: 0 },
      true,
      true,
      0
    );
    expect(r).toEqual({ stanje: "PUN", razlog: "osnivac" });
  });

  it("REGULARNI sa indeksom 100% je PUN; nosilac ZRNA nema gornju granicu", () => {
    expect(stanjeCvora("p", regularni("x", 100, 10), false, false, opticajPosle)).toEqual({
      stanje: "PUN",
      razlog: "indeks_pun",
    });
    const nosilac = stanjeCvora(
      "p",
      { id: "n", jeOsnivac: false, tip: TipKorisnika.NOSILAC_ZRNA, indeks: 100, primljenoVerifikacija: 10 },
      false,
      false,
      opticajPosle
    );
    expect(nosilac.stanje).toBe("MOGU");
  });

  it("prelazno ograničenje (čl. 22): ispod praga opticaja druga verifikacija je blokirana", () => {
    expect(
      stanjeCvora("p", regularni("x", 10, 1), false, false, PRELAZNI_OPTICAJ_PRAG - 1)
    ).toEqual({ stanje: "PUN", razlog: "prelazno" });
    // na pragu ograničenje ne važi
    expect(
      stanjeCvora("p", regularni("x", 10, 1), false, false, PRELAZNI_OPTICAJ_PRAG).stanje
    ).toBe("MOGU");
    // prva verifikacija je uvek moguća i ispod praga
    expect(
      stanjeCvora("p", regularni("x", 0, 0), false, false, 0).stanje
    ).toBe("MOGU");
  });

  it("zona važi u oba smera i razlikuje razlog", () => {
    expect(stanjeCvora("p", regularni("x", 20, 2), true, false, opticajPosle)).toEqual({
      stanje: "ZONA",
      razlog: "zona",
    });
    expect(stanjeCvora("p", regularni("x", 20, 2), false, true, opticajPosle)).toEqual({
      stanje: "ZONA",
      razlog: "zona_obrnuto",
    });
  });

  it("bez zabrana → MOGU (slot posmatrača nije svojstvo čvora)", () => {
    expect(stanjeCvora("p", regularni("x", 30, 3), false, false, opticajPosle)).toEqual({
      stanje: "MOGU",
    });
  });
});
