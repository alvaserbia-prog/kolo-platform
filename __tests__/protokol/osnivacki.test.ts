import { describe, it, expect } from "vitest";
import { raspodeliKorak, KORAK_IZNOS } from "@/lib/protokol/osnivacki";

describe("raspodeliKorak — raspodela koraka osnivačkog doprinosa", () => {
  it("jedan osnivač dobija ceo korak", () => {
    expect(raspodeliKorak([{ udeoBrojilac: 1, udeoImenilac: 1 }])).toEqual([KORAK_IZNOS]);
  });

  it("dva jednaka udela dele korak na pola", () => {
    expect(raspodeliKorak([
      { udeoBrojilac: 1, udeoImenilac: 2 },
      { udeoBrojilac: 1, udeoImenilac: 2 },
    ])).toEqual([12_000, 12_000]);
  });

  it("nejednaki udeli (1/4, 3/4)", () => {
    expect(raspodeliKorak([
      { udeoBrojilac: 1, udeoImenilac: 4 },
      { udeoBrojilac: 3, udeoImenilac: 4 },
    ])).toEqual([6_000, 18_000]);
  });

  it("tri jednaka udela — largest remainder, zbir tačno 24.000", () => {
    const r = raspodeliKorak([
      { udeoBrojilac: 1, udeoImenilac: 3 },
      { udeoBrojilac: 1, udeoImenilac: 3 },
      { udeoBrojilac: 1, udeoImenilac: 3 },
    ]);
    expect(r.reduce((s, x) => s + x, 0)).toBe(KORAK_IZNOS);
    expect(r).toEqual([8_000, 8_000, 8_000]);
  });

  it("zbir je uvek tačno KORAK_IZNOS za proizvoljne udele sa zajedničkim imeniocem", () => {
    const udeli = [
      { udeoBrojilac: 17, udeoImenilac: 100 },
      { udeoBrojilac: 33, udeoImenilac: 100 },
      { udeoBrojilac: 50, udeoImenilac: 100 },
    ];
    const r = raspodeliKorak(udeli);
    expect(r.reduce((s, x) => s + x, 0)).toBe(KORAK_IZNOS);
  });

  it("prazna lista vraća prazan niz", () => {
    expect(raspodeliKorak([])).toEqual([]);
  });
});
