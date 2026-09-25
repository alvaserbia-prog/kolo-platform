import { describe, it, expect } from "vitest";
import { danaDoReverifikacije, razlogObustaveProgram, rokReverifikacije } from "@/lib/protokol/programi";
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

describe("rokReverifikacije — rok zavisi od OSNOVA, ne samo od tipa (čl. 12)", () => {
  const ODOBRENO = new Date("2026-09-25T00:00:00Z");
  const dana = (od: Date, do_: Date) => Math.round((do_.getTime() - od.getTime()) / 86400000);

  it("Školovanje — 183 dana od odobravanja", () => {
    const rok = rokReverifikacije({ type: "SKOLOVANJE", osnov: null, metadata: null }, ODOBRENO);
    expect(dana(ODOBRENO, rok!)).toBe(183);
  });

  it("Podrška majkama / starijima — roka nema", () => {
    expect(rokReverifikacije({ type: "PODRSKA_MAJKAMA", osnov: null, metadata: null }, ODOBRENO)).toBeNull();
    expect(rokReverifikacije({ type: "PODRSKA_STARIJIMA", osnov: null, metadata: null }, ODOBRENO)).toBeNull();
  });

  it("smanjena sposobnost po rešenju — godišnja revizija", () => {
    const rok = rokReverifikacije(
      { type: "POSEBNA_BRIGA", osnov: "SMANJENA_SPOSOBNOST", metadata: { dokaz: "RESENJE" } },
      ODOBRENO,
    );
    expect(dana(ODOBRENO, rok!)).toBe(365);
  });

  it("🔴 akutna bolest — šest meseci, pa ponovna prijava", () => {
    const rok = rokReverifikacije(
      { type: "POSEBNA_BRIGA", osnov: "SMANJENA_SPOSOBNOST", metadata: { dokaz: "BOLEST_AKUTNA" } },
      ODOBRENO,
    );
    expect(dana(ODOBRENO, rok!)).toBe(183);
  });

  it("hronična bolest ide uz godišnju reviziju, ne uz šest meseci", () => {
    const rok = rokReverifikacije(
      { type: "POSEBNA_BRIGA", osnov: "SMANJENA_SPOSOBNOST", metadata: { dokaz: "BOLEST_HRONICNA" } },
      ODOBRENO,
    );
    expect(dana(ODOBRENO, rok!)).toBe(365);
  });

  it("🔴 gubitak doma — dvanaest meseci OD DOGAĐAJA, ne od odobravanja", () => {
    const rok = rokReverifikacije(
      { type: "POSEBNA_BRIGA", osnov: "GUBITAK_DOMA", metadata: { datumDogadjaja: "2026-06-25" } },
      ODOBRENO,
    );
    // Događaj je tri meseca pre odobravanja, pa rok pada tri meseca ranije.
    expect(rok!.toISOString().slice(0, 10)).toBe("2027-06-25");
  });

  it("gubitak doma bez datuma događaja — rok teče od odobravanja, ne izostaje", () => {
    const rok = rokReverifikacije(
      { type: "POSEBNA_BRIGA", osnov: "GUBITAK_DOMA", metadata: {} },
      ODOBRENO,
    );
    expect(dana(ODOBRENO, rok!)).toBe(365);
  });

  it("🔴 punoletstvo lica o kome se korisnik stara obara rok kad je bliže", () => {
    const rok = rokReverifikacije(
      {
        type: "POSEBNA_BRIGA",
        osnov: "SMANJENA_SPOSOBNOST",
        metadata: { dokaz: "RESENJE", punoletstvoAt: "2027-01-10" },
      },
      ODOBRENO,
    );
    expect(rok!.toISOString().slice(0, 10)).toBe("2027-01-10");
  });

  it("punoletstvo posle godišnje revizije ne pomera rok napred", () => {
    const rok = rokReverifikacije(
      {
        type: "POSEBNA_BRIGA",
        osnov: "SMANJENA_SPOSOBNOST",
        metadata: { dokaz: "RESENJE", punoletstvoAt: "2030-01-10" },
      },
      ODOBRENO,
    );
    expect(dana(ODOBRENO, rok!)).toBe(365);
  });

  it("🔴 pravo po rešenju ne nadživljava sam akt — datum isteka obara rok", () => {
    const rok = rokReverifikacije(
      {
        type: "POSEBNA_BRIGA",
        osnov: "SMANJENA_SPOSOBNOST",
        metadata: { dokaz: "RESENJE", datumIsteka: "2027-03-01" },
      },
      ODOBRENO,
    );
    expect(rok!.toISOString().slice(0, 10)).toBe("2027-03-01");
  });

  it("zatečena prijava bez osnova drži stari rok od 365 dana", () => {
    // Promena pravila ne sme da skrati pravo odobreno pre nje.
    const rok = rokReverifikacije({ type: "POSEBNA_BRIGA", osnov: null, metadata: null }, ODOBRENO);
    expect(dana(ODOBRENO, rok!)).toBe(365);
  });
});
