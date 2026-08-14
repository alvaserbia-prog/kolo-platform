import { describe, it, expect } from "vitest";
import {
  ROK_POTVRDE_DANA,
  UZRAST_MIN,
  UZRAST_PUNOLETSTVO,
  danaDoIsteka,
  jeMojeDete,
  jeUMirovanju,
  rokIzjasnjenja,
  smeDaKomunicira,
  smeDaPrepise,
  smeDaVidiOglas,
  uzrast,
  uzrastZaModul,
  type Ucesnik,
} from "@/lib/deca-pravila";

const DANAS = new Date("2026-08-14T00:00:00.000Z");

function dete(o: Partial<Ucesnik> = {}): Ucesnik {
  return { id: "d1", maloletan: true, dozvolaOdrasli: false, roditeljId: "r1", ...o };
}
function odrastao(o: Partial<Ucesnik> = {}): Ucesnik {
  return { id: "o1", maloletan: false, dozvolaOdrasli: false, roditeljId: null, ...o };
}

describe("uzrast", () => {
  it("računa navršene godine", () => {
    expect(uzrast(new Date("2016-08-14T00:00:00.000Z"), DANAS)).toBe(10);
  });

  it("rođendan koji još nije stigao ne računa se", () => {
    expect(uzrast(new Date("2016-08-15T00:00:00.000Z"), DANAS)).toBe(9);
  });

  it("rođendan tog dana se računa", () => {
    expect(uzrast(new Date("2016-08-14T00:00:00.000Z"), DANAS)).toBe(10);
  });
});

describe("uzrastZaModul — granice iz čl. 2", () => {
  it(`odbija ispod ${UZRAST_MIN}`, () => {
    expect(uzrastZaModul(UZRAST_MIN - 1).ok).toBe(false);
  });
  it(`prima ${UZRAST_MIN}`, () => {
    expect(uzrastZaModul(UZRAST_MIN).ok).toBe(true);
  });
  it(`prima ${UZRAST_PUNOLETSTVO - 1}`, () => {
    expect(uzrastZaModul(UZRAST_PUNOLETSTVO - 1).ok).toBe(true);
  });
  it(`odbija ${UZRAST_PUNOLETSTVO}`, () => {
    expect(uzrastZaModul(UZRAST_PUNOLETSTVO).ok).toBe(false);
  });
});

describe("smeDaKomunicira — čl. 12", () => {
  it("dvoje dece smeju uvek, bez ijedne saglasnosti", () => {
    expect(smeDaKomunicira(dete({ id: "a" }), dete({ id: "b", roditeljId: "r2" })).ok).toBe(true);
  });

  it("dete i odrastao ne smeju bez saglasnosti roditelja", () => {
    expect(smeDaKomunicira(dete(), odrastao()).ok).toBe(false);
  });

  it("saglasnost otvara odnos u OBA smera", () => {
    const d = dete({ dozvolaOdrasli: true });
    expect(smeDaKomunicira(d, odrastao()).ok).toBe(true);
    expect(smeDaKomunicira(odrastao(), d).ok).toBe(true);
  });

  it("🔴 saglasnost stoji na DETETU — odrastao je ne daje sebi", () => {
    // Da se čitala sa punoletne strane, svaki odrastao bi mogao da otvori odnos
    // prema svakom detetu prostim postavljanjem sopstvenog prekidača.
    expect(smeDaKomunicira(dete(), odrastao({ dozvolaOdrasli: true })).ok).toBe(false);
  });

  it("par dvoje punoletnih ovaj modul ne dodiruje", () => {
    expect(smeDaKomunicira(odrastao({ id: "a" }), odrastao({ id: "b" })).ok).toBe(true);
  });
});

describe("smeDaPrepise — čl. 14", () => {
  it("roditelj prepisuje svom detetu i bez saglasnosti (st. 2)", () => {
    const r = odrastao({ id: "r1" });
    expect(smeDaPrepise(r, dete({ roditeljId: "r1" })).ok).toBe(true);
  });

  it("dete prepisuje sopstvenom roditelju i bez saglasnosti", () => {
    expect(smeDaPrepise(dete({ roditeljId: "r1" }), odrastao({ id: "r1" })).ok).toBe(true);
  });

  it("🔴 punoletni ne prepisuje TUĐEM detetu bez saglasnosti", () => {
    expect(smeDaPrepise(odrastao({ id: "x" }), dete({ roditeljId: "r1" })).ok).toBe(false);
  });

  it("deca prepisuju međusobno", () => {
    expect(smeDaPrepise(dete({ id: "a" }), dete({ id: "b", roditeljId: "r2" })).ok).toBe(true);
  });
});

describe("smeDaVidiOglas — čl. 13", () => {
  const oglasivac = dete({ id: "d1", roditeljId: "r1" });

  it("🔴 gost NIKADA ne vidi oglas maloletnog korisnika", () => {
    expect(smeDaVidiOglas(null, oglasivac)).toBe(false);
  });

  it("drugo dete ga vidi", () => {
    expect(smeDaVidiOglas(dete({ id: "d2", roditeljId: "r2" }), oglasivac)).toBe(true);
  });

  it("sopstveni roditelj ga vidi i kad je prekidač isključen", () => {
    expect(smeDaVidiOglas(odrastao({ id: "r1" }), oglasivac)).toBe(true);
  });

  it("tuđi punoletni ga ne vidi bez saglasnosti, a vidi sa njom", () => {
    expect(smeDaVidiOglas(odrastao({ id: "x" }), oglasivac)).toBe(false);
    expect(smeDaVidiOglas(odrastao({ id: "x" }), { ...oglasivac, dozvolaOdrasli: true })).toBe(true);
  });

  it("admin ga vidi — bez toga moderacija prijavljenog oglasa ne radi", () => {
    expect(smeDaVidiOglas({ ...odrastao({ id: "x" }), admin: true }, oglasivac)).toBe(true);
  });

  it("oglas punoletnog je javan, a detetu se prikazuje uz saglasnost", () => {
    const o = odrastao({ id: "o1" });
    expect(smeDaVidiOglas(null, o)).toBe(true);
    expect(smeDaVidiOglas(dete(), o)).toBe(false);
    expect(smeDaVidiOglas(dete({ dozvolaOdrasli: true }), o)).toBe(true);
  });
});

describe("jeMojeDete", () => {
  it("razlikuje sopstveno dete od tuđeg", () => {
    expect(jeMojeDete(odrastao({ id: "r1" }), dete({ roditeljId: "r1" }))).toBe(true);
    expect(jeMojeDete(odrastao({ id: "r2" }), dete({ roditeljId: "r1" }))).toBe(false);
  });

  it("punoletan korisnik nikome nije dete", () => {
    expect(jeMojeDete(odrastao({ id: "r1" }), odrastao({ id: "x" }))).toBe(false);
  });
});

describe("mirovanje — čl. 16", () => {
  it("nastupa kad indeks roditelja padne ispod praga", () => {
    expect(jeUMirovanju({ verified: true, indeksStvarnosti: 0 }, 10)).toBe(true);
    expect(jeUMirovanju({ verified: true, indeksStvarnosti: 10 }, 10)).toBe(false);
  });

  it("nastupa i kad roditelj uopšte nije potvrđen", () => {
    expect(jeUMirovanju({ verified: false, indeksStvarnosti: 100 }, 10)).toBe(true);
  });
});

describe("rok izjašnjenja — čl. 6 st. 2", () => {
  it(`traje ${ROK_POTVRDE_DANA} dana od otvaranja naloga`, () => {
    const rok = rokIzjasnjenja(DANAS);
    expect(danaDoIsteka(rok, DANAS)).toBe(ROK_POTVRDE_DANA);
  });

  it("istekao rok daje nulu, ne negativan broj", () => {
    expect(danaDoIsteka(new Date("2026-01-01"), DANAS)).toBe(0);
  });
});
