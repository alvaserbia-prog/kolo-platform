import { describe, it, expect } from "vitest";
import {
  smePrijaviti,
  iznosZaVracanje,
  ponistenjePotpuno,
  MAX_OTVORENIH_PRIJAVA,
  MIN_OPIS_PRIJAVE,
} from "@/lib/razmena-prijava";

/**
 * Prijava neispunjene razmene i poništenje prepisa.
 *
 * Dve stvari koje ovi testovi čuvaju:
 *  1. prijavljuje samo POŠILJALAC — primalac nije ništa prepisao, pa nema šta da
 *     mu se vrati;
 *  2. poništenje ne sme da odvede zapis primaoca u minus (Pravilnik čl. 14 —
 *     jedini izuzetak je nadoknada iz čl. 20b i ovim se ne proširuje).
 */

const OSNOVA = {
  tipTransakcije: "TRANSFER",
  posiljaocId: "ja",
  prijaviocId: "ja",
  vecPrijavljena: false,
  otvorenihPrijava: 0,
  opis: "Prepisao sam POEN, robu nisam dobio.",
};

describe("smePrijaviti", () => {
  it("propušta prepis koji je prijavio sam pošiljalac", () => {
    expect(smePrijaviti(OSNOVA)).toEqual({ ok: true });
  });

  it("odbija sve što nije prepis između dva člana", () => {
    for (const tip of ["EMISIJA_VERIFIKACIJA", "EMISIJA_SADRZAJ", "UPIS_ZRNO", "PONISTENJE_PREPISA"]) {
      const rez = smePrijaviti({ ...OSNOVA, tipTransakcije: tip });
      expect(rez.ok, tip).toBe(false);
    }
  });

  it("odbija primaoca — on ništa nije prepisao", () => {
    const rez = smePrijaviti({ ...OSNOVA, posiljaocId: "neko-drugi" });
    expect(rez.ok).toBe(false);
  });

  it("odbija upis Protokola (nema pošiljaoca)", () => {
    const rez = smePrijaviti({ ...OSNOVA, posiljaocId: null });
    expect(rez.ok).toBe(false);
  });

  it("odbija drugu prijavu nad istim prepisom", () => {
    const rez = smePrijaviti({ ...OSNOVA, vecPrijavljena: true });
    expect(rez.ok).toBe(false);
  });

  it("odbija preko gornje granice otvorenih prijava", () => {
    expect(smePrijaviti({ ...OSNOVA, otvorenihPrijava: MAX_OTVORENIH_PRIJAVA - 1 }).ok).toBe(true);
    expect(smePrijaviti({ ...OSNOVA, otvorenihPrijava: MAX_OTVORENIH_PRIJAVA }).ok).toBe(false);
  });

  it("traži opis — po njemu se odlučuje", () => {
    expect(smePrijaviti({ ...OSNOVA, opis: "   " }).ok).toBe(false);
    expect(smePrijaviti({ ...OSNOVA, opis: "a".repeat(MIN_OPIS_PRIJAVE - 1) }).ok).toBe(false);
    expect(smePrijaviti({ ...OSNOVA, opis: "a".repeat(MIN_OPIS_PRIJAVE) }).ok).toBe(true);
  });
});

describe("iznosZaVracanje", () => {
  it("vraća ceo iznos kad primalac ima pokriće", () => {
    expect(iznosZaVracanje(1000, 5000)).toBe(1000);
    expect(iznosZaVracanje(1000, 1000)).toBe(1000);
  });

  it("vraća samo ono što je ostalo kad je primalac potrošio", () => {
    expect(iznosZaVracanje(1000, 400)).toBe(400);
  });

  it("ne odvodi zapis primaoca u minus (čl. 14)", () => {
    expect(iznosZaVracanje(1000, 0)).toBe(0);
    // Zapis u nadoknadi (čl. 20b) čita se kao nula, a ne kao dug koji bi se
    // poništenjem produbljivao.
    expect(iznosZaVracanje(1000, -3000)).toBe(0);
  });
});

describe("ponistenjePotpuno", () => {
  it("razlikuje pun povraćaj od delimičnog", () => {
    expect(ponistenjePotpuno(1000, 1000)).toBe(true);
    expect(ponistenjePotpuno(1000, 999)).toBe(false);
    expect(ponistenjePotpuno(1000, 0)).toBe(false);
  });
});
