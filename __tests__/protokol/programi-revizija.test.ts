import { describe, it, expect } from "vitest";
import { danaDoReverifikacije, razlogObustaveProgram } from "@/lib/protokol/programi";
import { TipKorisnika } from "@/generated/prisma/client";

const SADA = new Date("2026-06-02T12:00:00Z");
const PROSLOST = new Date("2026-05-01T00:00:00Z");
const BUDUCNOST = new Date("2026-12-01T00:00:00Z");

describe("danaDoReverifikacije", () => {
  it("POSEBNA_BRIGA → 365 (godišnja revizija, čl. 12)", () => {
    expect(danaDoReverifikacije("POSEBNA_BRIGA")).toBe(365);
  });
  it("SKOLOVANJE → 183 (studijska godina, čl. 13)", () => {
    expect(danaDoReverifikacije("SKOLOVANJE")).toBe(183);
  });
  it("PODRSKA_MAJKAMA / PODRSKA_STARIJIMA → null (bez periodične revizije)", () => {
    expect(danaDoReverifikacije("PODRSKA_MAJKAMA")).toBeNull();
    expect(danaDoReverifikacije("PODRSKA_STARIJIMA")).toBeNull();
  });
});

describe("razlogObustaveProgram", () => {
  it("istekao rok reverifikacije → 'revizija'", () => {
    expect(
      razlogObustaveProgram(
        { nextReverifikacija: PROSLOST, tipKorisnika: TipKorisnika.REGULARNI, indeksStvarnosti: 100 },
        SADA
      )
    ).toBe("revizija");
  });

  it("rok u budućnosti + pun indeks → null (ostaje aktivan)", () => {
    expect(
      razlogObustaveProgram(
        { nextReverifikacija: BUDUCNOST, tipKorisnika: TipKorisnika.REGULARNI, indeksStvarnosti: 100 },
        SADA
      )
    ).toBeNull();
  });

  it("bez roka, REGULARNI sa indeksom ispod 10 → 'indeks'", () => {
    expect(
      razlogObustaveProgram(
        { nextReverifikacija: null, tipKorisnika: TipKorisnika.REGULARNI, indeksStvarnosti: 0 },
        SADA
      )
    ).toBe("indeks");
  });

  // 4.3.1 — prag je funkcionalnih 10% (jedna primljena potvrda). Do tog seta je
  // ovde stajalo 100%, pa je jedna poništena potvrda gasila program čoveku koji
  // po čl. 4 i dalje ispunjava uslov.
  it("bez roka, REGULARNI sa indeksom 10 → null (jedna potvrda je dovoljna)", () => {
    expect(
      razlogObustaveProgram(
        { nextReverifikacija: null, tipKorisnika: TipKorisnika.REGULARNI, indeksStvarnosti: 10 },
        SADA
      )
    ).toBeNull();
  });

  it("bez roka, REGULARNI sa indeksom 90 → null (nepun indeks ne obustavlja)", () => {
    expect(
      razlogObustaveProgram(
        { nextReverifikacija: null, tipKorisnika: TipKorisnika.REGULARNI, indeksStvarnosti: 90 },
        SADA
      )
    ).toBeNull();
  });

  it("NOSILAC_ZRNA sa niskim indeksom NE obustavlja (standing iz statusa)", () => {
    expect(
      razlogObustaveProgram(
        { nextReverifikacija: null, tipKorisnika: TipKorisnika.NOSILAC_ZRNA, indeksStvarnosti: 0 },
        SADA
      )
    ).toBeNull();
  });

  it("istekao rok ima prednost nad padom indeksa → 'revizija'", () => {
    expect(
      razlogObustaveProgram(
        { nextReverifikacija: PROSLOST, tipKorisnika: TipKorisnika.REGULARNI, indeksStvarnosti: 0 },
        SADA
      )
    ).toBe("revizija");
  });
});
