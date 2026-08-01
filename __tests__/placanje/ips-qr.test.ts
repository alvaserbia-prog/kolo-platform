import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  model97Kontrola,
  generisiPozivNaBroj,
  formatIznosIps,
  sklopiIpsString,
  dohvatiIpsConfig,
  ipsAktivno,
  pozivNaBrojZaClana,
  prikazPozivNaBroj,
  rasclaniPozivNaBroj,
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

describe("pozivNaBrojZaClana", () => {
  it("kontrola (2 cifre) + donatorski broj", () => {
    const pnb = pozivNaBrojZaClana(15);
    expect(pnb.slice(2)).toBe("15");
    expect(model97Kontrola("15")).toBe(pnb.slice(0, 2));
  });

  it("odbija nulu, negativan i necelobrojni broj", () => {
    expect(() => pozivNaBrojZaClana(0)).toThrow();
    expect(() => pozivNaBrojZaClana(-3)).toThrow();
    expect(() => pozivNaBrojZaClana(1.5)).toThrow();
  });
});

describe("prikazPozivNaBroj", () => {
  it("razdvaja kontrolu crticom: '42-15'", () => {
    const pnb = pozivNaBrojZaClana(15);
    expect(prikazPozivNaBroj(pnb)).toBe(`${pnb.slice(0, 2)}-15`);
  });
});

describe("rasclaniPozivNaBroj", () => {
  it("round-trip za male i velike brojeve", () => {
    for (const broj of [1, 2, 15, 51, 100, 482, 100_482, 999_999]) {
      expect(rasclaniPozivNaBroj(pozivNaBrojZaClana(broj))).toBe(broj);
    }
  });

  it("prihvata crtice, razmake i prefiks modela 97", () => {
    const pnb = pozivNaBrojZaClana(482); // npr. "KK482"
    expect(rasclaniPozivNaBroj(prikazPozivNaBroj(pnb))).toBe(482);
    expect(rasclaniPozivNaBroj(` ${pnb.slice(0, 2)} ${pnb.slice(2)} `)).toBe(482);
    expect(rasclaniPozivNaBroj(`97${pnb}`)).toBe(482);
    expect(rasclaniPozivNaBroj(`97-${prikazPozivNaBroj(pnb)}`)).toBe(482);
  });

  it("vodeće nule u osnovi ne kvare kontrolu", () => {
    const pnb = pozivNaBrojZaClana(15);
    expect(rasclaniPozivNaBroj(`${pnb.slice(0, 2)}0015`)).toBe(15);
  });

  it("vraća null za pogrešnu kontrolu (greška u kucanju)", () => {
    const pnb = pozivNaBrojZaClana(15);
    const zamena = pnb.slice(0, 2) + "51"; // 15 → 51: kontrola za 15 ne važi za 51
    expect(rasclaniPozivNaBroj(zamena)).toBeNull();
  });

  it("vraća null za prazan/prekratak/neispravan unos", () => {
    expect(rasclaniPozivNaBroj("")).toBeNull();
    expect(rasclaniPozivNaBroj("4")).toBeNull();
    expect(rasclaniPozivNaBroj("42")).toBeNull();
    expect(rasclaniPozivNaBroj("abc")).toBeNull();
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
