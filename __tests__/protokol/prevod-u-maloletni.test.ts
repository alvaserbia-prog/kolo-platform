/**
 * Prevođenje punoletnog naloga u maloletni — čista pravila.
 *
 * Testira se `proveriPrevodUMaloletni`, jedino mesto koje odlučuje SME LI se
 * radnja izvesti. Sam prelaz (padanje potvrda, otpis ZRNA, upis roditelja) dira
 * bazu i pokriven je integracionim tokom Modula Deca.
 */
import { describe, it, expect } from "vitest";
import {
  proveriPrevodUMaloletni,
  type NalogZaPrevod,
  type RoditeljZaPrevod,
} from "@/lib/protokol/prevod-u-maloletni";
import { UZRAST_MIN, UZRAST_PUNOLETSTVO } from "@/lib/deca-pravila";

const NALOG: NalogZaPrevod = {
  maloletan: false,
  admin: "NONE",
  jeOsnivac: false,
  deaktiviran: false,
  imaDecu: false,
  imaRoditelja: false,
  vlasnikPokrovitelja: false,
};

const RODITELJ: RoditeljZaPrevod = { id: "roditelj", maloletan: false, aktivan: true };

const DETE_ID = "dete";

function proveri(
  nalog: Partial<NalogZaPrevod> = {},
  roditelj: Partial<RoditeljZaPrevod> = {},
  godine = 12,
) {
  return proveriPrevodUMaloletni({ ...NALOG, ...nalog }, { ...RODITELJ, ...roditelj }, DETE_ID, godine);
}

describe("proveriPrevodUMaloletni", () => {
  it("propušta punoletan nalog uzrasta u opsegu modula", () => {
    expect(proveri()).toEqual({ ok: true });
  });

  it("odbija nalog koji je već maloletan", () => {
    const r = proveri({ maloletan: true });
    expect(r.ok).toBe(false);
  });

  it("odbija nalog sa admin ovlašćenjem", () => {
    expect(proveri({ admin: "ADMIN" }).ok).toBe(false);
    expect(proveri({ admin: "SUPERADMIN" }).ok).toBe(false);
  });

  // Početni korisnik je ishodište lanca potvrda (dokaz stvarnosti čl. 14): indeks
  // mu je fiksno 100% i ne može biti verifikovan. Maloletni nalog je suprotnost
  // toga, pa se ta dva svojstva ne smeju naći na istom nalogu.
  it("odbija početnog korisnika (osnivača)", () => {
    expect(proveri({ jeOsnivac: true }).ok).toBe(false);
  });

  it("odbija nalog koji je sam upisan kao roditelj", () => {
    expect(proveri({ imaDecu: true }).ok).toBe(false);
  });

  it("odbija vlasnika pokrovitelja i ugašen nalog", () => {
    expect(proveri({ vlasnikPokrovitelja: true }).ok).toBe(false);
    expect(proveri({ deaktiviran: true }).ok).toBe(false);
  });

  // Sudar na `@@unique([deteId, roditeljId])` desio bi se tek u poslednjem koraku,
  // pošto su potvrde već pale i ZRNO otpisano — nalog bi ostao obran a nepovezan.
  it("odbija nalog koji već ima roditelja, pre nego što išta padne", () => {
    expect(proveri({ imaRoditelja: true }).ok).toBe(false);
  });

  it("odbija maloletnog i neaktivnog roditelja", () => {
    expect(proveri({}, { maloletan: true }).ok).toBe(false);
    expect(proveri({}, { aktivan: false }).ok).toBe(false);
  });

  it("odbija nalog koji bi bio sam sebi roditelj", () => {
    expect(proveri({}, { id: DETE_ID }).ok).toBe(false);
  });

  // Uzrast se meri istim pravilom kao pri otvaranju naloga (čl. 2): donja granica
  // je 7 godina, a punoletstvom svojstvo maloletnog korisnika prestaje — pa se
  // punoletan čovek ne može „prevesti u dete".
  it("drži granice uzrasta iz čl. 2", () => {
    expect(proveri({}, {}, UZRAST_MIN - 1).ok).toBe(false);
    expect(proveri({}, {}, UZRAST_MIN).ok).toBe(true);
    expect(proveri({}, {}, UZRAST_PUNOLETSTVO - 1).ok).toBe(true);
    expect(proveri({}, {}, UZRAST_PUNOLETSTVO).ok).toBe(false);
  });

  // 🔴 Indeks roditelja se namerno NE traži — vidi obrazloženje u
  // `prevod-u-maloletni.ts`. Roditelj bez potvrde ostavlja dete u stanju
  // `POVEZANO`, gde mu se POEN ne upisuje; to je dovoljna brana.
  it("ne traži da roditelj bude potvrđen", () => {
    expect(proveri().ok).toBe(true);
  });
});
