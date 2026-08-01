import { describe, it, expect } from "vitest";
import { beogradskiDan, danObracuna, prethodniDan } from "@/lib/protokol/obracunski-dan";

const utc = (s: string) => new Date(s);

describe("beogradskiDan", () => {
  it("dan tokom dana je isti kao UTC dan", () => {
    expect(beogradskiDan(utc("2026-08-01T10:00:00Z"))).toEqual(utc("2026-08-01T00:00:00Z"));
  });

  it("22:30 UTC leti (00:30 po srpskom) pripada NAREDNOM danu", () => {
    expect(beogradskiDan(utc("2026-08-01T22:30:00Z"))).toEqual(utc("2026-08-02T00:00:00Z"));
  });

  it("23:30 UTC zimi (00:30 po srpskom, CET) pripada narednom danu", () => {
    expect(beogradskiDan(utc("2026-12-01T23:30:00Z"))).toEqual(utc("2026-12-02T00:00:00Z"));
  });

  it("22:30 UTC zimi (23:30 po srpskom) je još uvek isti dan", () => {
    expect(beogradskiDan(utc("2026-12-01T22:30:00Z"))).toEqual(utc("2026-12-01T00:00:00Z"));
  });
});

describe("danObracuna", () => {
  it("cron u 22:00 UTC leti (ponoć po srpskom) otvara naredni dan", () => {
    expect(danObracuna(utc("2026-08-01T22:00:00Z"))).toEqual(utc("2026-08-02T00:00:00Z"));
  });

  it("cron u 22:00 UTC zimi (23:00 po srpskom) takođe otvara naredni dan", () => {
    expect(danObracuna(utc("2026-12-01T22:00:00Z"))).toEqual(utc("2026-12-02T00:00:00Z"));
  });

  it("ručni okidač tokom dana ostaje na tekućem danu", () => {
    expect(danObracuna(utc("2026-08-01T13:00:00Z"))).toEqual(utc("2026-08-01T00:00:00Z"));
  });
});

describe("prethodniDan", () => {
  it("vraća dan ranije", () => {
    expect(prethodniDan(utc("2026-08-02T00:00:00Z"))).toEqual(utc("2026-08-01T00:00:00Z"));
  });

  it("prelazi granicu meseca", () => {
    expect(prethodniDan(utc("2026-08-01T00:00:00Z"))).toEqual(utc("2026-07-31T00:00:00Z"));
  });
});
