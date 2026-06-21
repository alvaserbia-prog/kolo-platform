import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  model97Kontrola,
  generisiPozivNaBroj,
  formatIznosIps,
  sklopiIpsString,
  dohvatiIpsConfig,
  ipsAktivno,
  nasumicnaOsnova,
  type IpsConfig,
} from "@/lib/placanje/ips-qr";

describe("model 97 (ISO 7064 MOD 97-10)", () => {
  it("kontrola = 98 − ((osnova × 100) mod 97), 2 cifre", () => {
    // 1234567890 mod 97 = 2; ×100 = 200 mod 97 = 6; 98 − 6 = 92
    expect(model97Kontrola("1234567890")).toBe("92");
  });

  it("dopunjava vodećom nulom kad je kontrola < 10", () => {
    const k = model97Kontrola("97");
    expect(k).toHaveLength(2);
    expect(/^\d{2}$/.test(k)).toBe(true);
  });

  it("ignoriše ne-cifre u osnovi", () => {
    expect(model97Kontrola("12-34")).toBe(model97Kontrola("1234"));
  });

  it("baca grešku za osnovu bez cifara", () => {
    expect(() => model97Kontrola("abc")).toThrow();
  });

  it("round-trip: kontrola izvedena iz osnove se poklapa pri ponovnom računanju", () => {
    // Sparivanje radi tako što verifikator iz punog poziva izvuče osnovu
    // (sve posle prve 2 cifre) i PONOVO izračuna kontrolu — mora se poklopiti.
    const osnova = "555000123456";
    const pun = generisiPozivNaBroj(osnova);
    const kontrola = pun.slice(0, 2);
    const osnovaIzPuna = pun.slice(2);
    expect(osnovaIzPuna).toBe(osnova);
    expect(model97Kontrola(osnovaIzPuna)).toBe(kontrola);
  });
});

describe("generisiPozivNaBroj", () => {
  it("vraća kontrolu (2 cifre) + osnovu", () => {
    const pnb = generisiPozivNaBroj("1234567890");
    expect(pnb).toBe("921234567890");
  });
});

describe("nasumicnaOsnova", () => {
  it("vraća 12 cifara bez vodeće nule", () => {
    const o = nasumicnaOsnova(new Uint8Array([0, 0, 5, 9, 250, 11, 3, 7, 8, 1, 2, 4]));
    expect(o).toHaveLength(12);
    expect(/^\d{12}$/.test(o)).toBe(true);
    expect(o[0]).not.toBe("0");
  });
});

describe("formatIznosIps", () => {
  it("RSD + ceo iznos + ,00, bez separatora hiljada", () => {
    expect(formatIznosIps(3000)).toBe("RSD3000,00");
    expect(formatIznosIps(1500000)).toBe("RSD1500000,00");
  });
  it("zaokružuje na ceo dinar", () => {
    expect(formatIznosIps(99.6)).toBe("RSD100,00");
  });
});

describe("sklopiIpsString", () => {
  const cfg: IpsConfig = {
    racun: "845000000040484987",
    primalac: "Fondacija KOLO, Beograd",
    sifraPlacanja: "289",
    svrha: "Donacija",
    maxRSD: 300000,
  };

  it("redosled tagova K|V|C|R|N|I|SF|S|RO i RO sa modelom 97", () => {
    const pnb = generisiPozivNaBroj("123456789012");
    const s = sklopiIpsString({ cfg, iznosRSD: 3000, pozivNaBroj: pnb });
    expect(s).toBe(
      `K:PR|V:01|C:1|R:845000000040484987|N:Fondacija KOLO, Beograd|I:RSD3000,00|SF:289|S:Donacija|RO:97${pnb}`
    );
  });
});

describe("dohvatiIpsConfig / ipsAktivno (iz env)", () => {
  const cuvaj = { ...process.env };
  beforeEach(() => {
    delete process.env.IPS_RACUN;
    delete process.env.IPS_PRIMALAC;
    delete process.env.IPS_PRIMALAC_MESTO;
    delete process.env.IPS_SF;
    delete process.env.IPS_SVRHA;
    delete process.env.IPS_MAX_RSD;
    delete process.env.IPS_AKTIVNO;
  });
  afterEach(() => {
    process.env = { ...cuvaj };
  });

  it("vraća null bez računa/naziva (kod živi i bez konfiguracije)", () => {
    expect(dohvatiIpsConfig()).toBeNull();
    expect(ipsAktivno()).toBe(false);
  });

  it("vraća null kad račun nije 18 cifara (fail-safe)", () => {
    process.env.IPS_RACUN = "12345";
    process.env.IPS_PRIMALAC = "Fondacija KOLO";
    expect(dohvatiIpsConfig()).toBeNull();
  });

  it("parsira konfiguraciju i podrazumevane vrednosti", () => {
    process.env.IPS_RACUN = "845-0000000404849-87"; // 3-13-2 = 18 cifara; crtice se skidaju
    process.env.IPS_PRIMALAC = "Fondacija KOLO";
    process.env.IPS_PRIMALAC_MESTO = "Beograd";
    const cfg = dohvatiIpsConfig();
    expect(cfg).not.toBeNull();
    expect(cfg!.racun).toBe("845000000040484987");
    expect(cfg!.primalac).toBe("Fondacija KOLO, Beograd");
    expect(cfg!.sifraPlacanja).toBe("289");
    expect(cfg!.svrha).toBe("Donacija");
    expect(cfg!.maxRSD).toBe(300000);
    expect(ipsAktivno()).toBe(true);
  });

  it("IPS_AKTIVNO=false gasi i kad je račun podešen", () => {
    process.env.IPS_RACUN = "845000000040484987";
    process.env.IPS_PRIMALAC = "Fondacija KOLO";
    process.env.IPS_AKTIVNO = "false";
    expect(ipsAktivno()).toBe(false);
  });
});
