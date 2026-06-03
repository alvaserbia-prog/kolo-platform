import { describe, it, expect } from "vitest";
import {
  nestpayHashVer3,
  verifikujOdgovor,
  uspesnoPlacanje,
  pripremiZahtev,
  VALUTA_RSD,
  type NestpayConfig,
} from "@/lib/placanje/nestpay";

const STORE_KEY = "TEST_STORE_KEY_123";

describe("nestpayHashVer3", () => {
  it("deterministički je za iste ulaze", () => {
    const p = { clientid: "100", amount: "1500.00", oid: "ORDER1" };
    expect(nestpayHashVer3(p, STORE_KEY)).toBe(nestpayHashVer3(p, STORE_KEY));
  });

  it("ignoriše polja 'hash' i 'encoding' (case-insensitive)", () => {
    const a = { clientid: "100", amount: "1500.00" };
    const b = { clientid: "100", amount: "1500.00", encoding: "UTF-8", HASH: "xxx" };
    expect(nestpayHashVer3(a, STORE_KEY)).toBe(nestpayHashVer3(b, STORE_KEY));
  });

  it("redosled polja ne utiče na hash (sortira po imenu)", () => {
    const a = { clientid: "100", amount: "1500.00", oid: "O1" };
    const b = { oid: "O1", amount: "1500.00", clientid: "100" };
    expect(nestpayHashVer3(a, STORE_KEY)).toBe(nestpayHashVer3(b, STORE_KEY));
  });

  it("menja se kad se promeni iznos (anti-tampering)", () => {
    const a = { clientid: "100", amount: "1500.00" };
    const b = { clientid: "100", amount: "9999.00" };
    expect(nestpayHashVer3(a, STORE_KEY)).not.toBe(nestpayHashVer3(b, STORE_KEY));
  });

  it("menja se kad se promeni store key", () => {
    const p = { clientid: "100", amount: "1500.00" };
    expect(nestpayHashVer3(p, "KLJUC_A")).not.toBe(nestpayHashVer3(p, "KLJUC_B"));
  });
});

describe("verifikujOdgovor", () => {
  it("prihvata odgovor sa ispravnim HASH-om", () => {
    const params: Record<string, string> = {
      oid: "ORDER1",
      amount: "1500.00",
      Response: "Approved",
      mdStatus: "1",
    };
    params.HASH = nestpayHashVer3(params, STORE_KEY);
    expect(verifikujOdgovor(params, STORE_KEY)).toBe(true);
  });

  it("odbija odgovor sa izmenjenim iznosom (potpis ne prolazi)", () => {
    const params: Record<string, string> = { oid: "ORDER1", amount: "1500.00" };
    params.HASH = nestpayHashVer3(params, STORE_KEY);
    params.amount = "9999.00"; // napadač menja iznos nakon potpisa
    expect(verifikujOdgovor(params, STORE_KEY)).toBe(false);
  });

  it("odbija odgovor bez HASH polja", () => {
    expect(verifikujOdgovor({ oid: "ORDER1" }, STORE_KEY)).toBe(false);
  });

  it("odbija odgovor potpisan pogrešnim ključem", () => {
    const params: Record<string, string> = { oid: "ORDER1", amount: "1500.00" };
    params.HASH = nestpayHashVer3(params, "DRUGI_KLJUC");
    expect(verifikujOdgovor(params, STORE_KEY)).toBe(false);
  });
});

describe("uspesnoPlacanje", () => {
  it("Approved + mdStatus 1 → uspeh", () => {
    expect(uspesnoPlacanje({ Response: "Approved", mdStatus: "1" })).toBe(true);
  });
  it("ProcReturnCode 00 + mdStatus 2 → uspeh", () => {
    expect(uspesnoPlacanje({ ProcReturnCode: "00", mdStatus: "2" })).toBe(true);
  });
  it("Approved ali mdStatus 0 (3D nije prošao) → neuspeh", () => {
    expect(uspesnoPlacanje({ Response: "Approved", mdStatus: "0" })).toBe(false);
  });
  it("Declined → neuspeh", () => {
    expect(uspesnoPlacanje({ Response: "Declined", mdStatus: "1" })).toBe(false);
  });
});

describe("pripremiZahtev", () => {
  const cfg: NestpayConfig = {
    provajder: "INTESA",
    gatewayUrl: "https://testsecurepay.example/fim/est3Dgate",
    clientId: "100000000",
    storeKey: STORE_KEY,
    storeType: "3d_pay_hosting",
  };

  it("formatira iznos na 2 decimale i postavlja RSD valutu (941)", () => {
    const { fields } = pripremiZahtev(cfg, {
      oid: "ORDER1",
      iznosRSD: 1500,
      okUrl: "https://app/ok",
      failUrl: "https://app/fail",
    });
    expect(fields.amount).toBe("1500.00");
    expect(fields.currency).toBe(VALUTA_RSD);
    expect(fields.currency).toBe("941");
    expect(fields.storetype).toBe("3d_pay_hosting");
    expect(fields.hashAlgorithm).toBe("ver3");
  });

  it("uključuje validan hash koji prolazi verifikaciju", () => {
    const { fields } = pripremiZahtev(cfg, {
      oid: "ORDER2",
      iznosRSD: 2000,
      okUrl: "https://app/ok",
      failUrl: "https://app/fail",
    });
    expect(fields.hash).toBeTruthy();
    expect(verifikujOdgovor({ ...fields, HASH: fields.hash }, STORE_KEY)).toBe(true);
  });
});
