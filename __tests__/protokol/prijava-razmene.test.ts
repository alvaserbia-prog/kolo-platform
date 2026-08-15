import { describe, it, expect } from "vitest";
import {
  smePrijaviti,
  iznosPovracaja,
  stanjePosle,
  idUMinus,
  MAX_OTVORENIH_PRIJAVA,
  MIN_OPIS_PRIJAVE,
} from "@/lib/razmena-prijava";

/**
 * Prijava neispunjene razmene i poništenje prepisa.
 *
 * Dve stvari koje ovi testovi čuvaju:
 *  1. prijavljuje samo POŠILJALAC — primalac nije ništa prepisao, pa nema šta da
 *     mu se vrati;
 *  2. poništenje vraća CEO iznos i sme da odvede zapis primaoca u minus (odluka
 *     vlasnika 2026-08-15). Kapa po stanju primaoca je namerno uklonjena: uz nju
 *     je onaj ko brže potroši tuđi POEN prolazio jeftinije od onog ko ga sačuva.
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

describe("iznosPovracaja", () => {
  it("vraća ceo prepisani iznos, bez obzira na stanje primaoca", () => {
    expect(iznosPovracaja(1000)).toBe(1000);
    expect(iznosPovracaja(24_000)).toBe(24_000);
  });
});

describe("stanjePosle i idUMinus", () => {
  it("računa stanje primaoca posle poništenja", () => {
    expect(stanjePosle(5000, 1000)).toBe(4000);
    expect(stanjePosle(1000, 1000)).toBe(0);
  });

  it("pušta zapis u minus kad pokrića nema", () => {
    expect(stanjePosle(400, 1000)).toBe(-600);
    expect(idUMinus(400, 1000)).toBe(true);
    expect(idUMinus(0, 1000)).toBe(true);
  });

  it("produbljuje zatečenu nadoknadu umesto da je zaobiđe", () => {
    expect(stanjePosle(-3000, 1000)).toBe(-4000);
    expect(idUMinus(-3000, 1000)).toBe(true);
  });

  it("ne prijavljuje minus kad pokrića ima", () => {
    expect(idUMinus(1000, 1000)).toBe(false);
    expect(idUMinus(5000, 1000)).toBe(false);
  });
});
