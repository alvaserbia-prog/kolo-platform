import { describe, it, expect } from "vitest";
import { granicePeriodaGlasanja, fazaPredloga, utvrdiIshod, normalizujNaslov } from "@/lib/protokol/glasanje";

describe("glasanje — obračunski period (čl. 11)", () => {
  it("glasanje počinje u ponoć narednog perioda i traje tačno jedan period", () => {
    const od = new Date("2026-06-03T14:30:00");
    const { glasanjePocetak, deadline } = granicePeriodaGlasanja(od);
    // početak = sledeća ponoć (04.06 00:00 lokalno)
    expect(glasanjePocetak.getDate()).toBe(4);
    expect(glasanjePocetak.getHours()).toBe(0);
    expect(glasanjePocetak.getMinutes()).toBe(0);
    // kraj = period kasnije (05.06 00:00)
    expect(deadline.getDate()).toBe(5);
    expect(deadline.getTime() - glasanjePocetak.getTime()).toBe(24 * 60 * 60 * 1000);
  });
});

describe("glasanje — faza predloga", () => {
  const od = new Date("2026-06-03T10:00:00");
  const { glasanjePocetak, deadline } = granicePeriodaGlasanja(od);
  const p = { glasanjePocetak, deadline, status: "ACTIVE" };

  it("NAJAVLJEN pre početka glasanja", () => {
    expect(fazaPredloga(p, new Date("2026-06-03T23:00:00"))).toBe("NAJAVLJEN");
  });
  it("U_TOKU tokom perioda glasanja", () => {
    expect(fazaPredloga(p, new Date("2026-06-04T12:00:00"))).toBe("U_TOKU");
  });
  it("ZATVOREN po isteku roka", () => {
    expect(fazaPredloga(p, new Date("2026-06-05T00:00:01"))).toBe("ZATVOREN");
  });
  it("ZATVOREN ako je status CLOSED bez obzira na vreme", () => {
    expect(fazaPredloga({ ...p, status: "CLOSED" }, new Date("2026-06-04T12:00:00"))).toBe("ZATVOREN");
  });
});

describe("glasanje — ishod (prosta većina, čl. 8/9)", () => {
  it("usvojeno kad je za > protiv", () => {
    expect(utvrdiIshod(10, 7)).toBe(true);
  });
  it("neusvojeno kad je za < protiv", () => {
    expect(utvrdiIshod(3, 8)).toBe(false);
  });
  it("neusvojeno pri izjednačenju (čl. 9)", () => {
    expect(utvrdiIshod(5, 5)).toBe(false);
  });
});

describe("glasanje — normalizacija naslova (čl. 22)", () => {
  it("ujednačava velika slova, razmake i ivične praznine", () => {
    expect(normalizujNaslov("  Izmena   Pravila  ")).toBe("izmena pravila");
    expect(normalizujNaslov("IZMENA PRAVILA")).toBe(normalizujNaslov("izmena pravila"));
  });
  it("razlikuje stvarno različite naslove", () => {
    expect(normalizujNaslov("Predlog A")).not.toBe(normalizujNaslov("Predlog B"));
  });
});
