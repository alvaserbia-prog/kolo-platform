/**
 * Jedinični testovi za domain logiku dokaza stvarnosti (Pravilnik v3.5.0).
 * Pokriva: izracunajIndeks, izracunajKapacitet, raspolozivSlot, podlezeNadzoru,
 * imaPristupVerifikaciji, proveriAntiCirkularno, formatIndeksZaPrikaz.
 */
import { describe, it, expect } from "vitest";
import { TipKorisnika } from "@/generated/prisma/client";
import {
  BESKONACNI_KAPACITET,
  brojRaspolozivihSlotova,
  formatIndeksZaPrikaz,
  imaPristupVerifikaciji,
  izracunajIndeks,
  izracunajKapacitet,
  podlezeNadzoru,
  proveriAntiCirkularno,
  raspolozivSlot,
  type GrafZapis,
} from "@/lib/protokol/dokaz-stvarnosti";

describe("izracunajIndeks", () => {
  it("bez verifikacija je 0", () => {
    expect(izracunajIndeks(0)).toBe(0);
  });

  it("5 verifikacija daje indeks 50", () => {
    expect(izracunajIndeks(5)).toBe(50);
  });

  it("10 verifikacija daje indeks 100", () => {
    expect(izracunajIndeks(10)).toBe(100);
  });

  it("11 verifikacija je takođe cap 100 (čl. 3 stav 2)", () => {
    expect(izracunajIndeks(11)).toBe(100);
  });

  it("negativni broj se tretira kao 0 (sanity)", () => {
    expect(izracunajIndeks(-5)).toBe(0);
  });
});

describe("izracunajKapacitet", () => {
  it("REGULARNI sa indeksom 0 ima kapacitet 0", () => {
    expect(izracunajKapacitet(TipKorisnika.REGULARNI, 0)).toBe(0);
  });

  it("REGULARNI sa indeksom 9 ima kapacitet 0 (ispod praga)", () => {
    expect(izracunajKapacitet(TipKorisnika.REGULARNI, 9)).toBe(0);
  });

  it("REGULARNI sa indeksom 10 ima kapacitet 1", () => {
    expect(izracunajKapacitet(TipKorisnika.REGULARNI, 10)).toBe(1);
  });

  it("REGULARNI sa indeksom 55 ima kapacitet 5", () => {
    expect(izracunajKapacitet(TipKorisnika.REGULARNI, 55)).toBe(5);
  });

  it("REGULARNI sa indeksom 100 ima kapacitet 10", () => {
    expect(izracunajKapacitet(TipKorisnika.REGULARNI, 100)).toBe(10);
  });

  it("NOSILAC_ZRNA ima neograničen kapacitet", () => {
    expect(izracunajKapacitet(TipKorisnika.NOSILAC_ZRNA, 40)).toBe(BESKONACNI_KAPACITET);
    expect(izracunajKapacitet(TipKorisnika.NOSILAC_ZRNA, 0)).toBe(BESKONACNI_KAPACITET);
  });

  it("NEVERIFIKOVAN uvek vraća 0", () => {
    expect(izracunajKapacitet(TipKorisnika.NEVERIFIKOVAN, 0)).toBe(0);
    expect(izracunajKapacitet(TipKorisnika.NEVERIFIKOVAN, 99)).toBe(0);
  });
});

describe("raspolozivSlot i brojRaspolozivihSlotova", () => {
  it("REGULARNI sa kapacitetom 5 i 3 potrošena ima slobodan slot", () => {
    expect(raspolozivSlot(5, 3)).toBe(true);
    expect(brojRaspolozivihSlotova(5, 3)).toBe(2);
  });

  it("REGULARNI sa kapacitetom 5 i 5 potrošenih nema slobodan slot", () => {
    expect(raspolozivSlot(5, 5)).toBe(false);
    expect(brojRaspolozivihSlotova(5, 5)).toBe(0);
  });

  it("Neograničeni kapacitet uvek ima slobodan slot bez obzira na slotoviPotroseni", () => {
    expect(raspolozivSlot(BESKONACNI_KAPACITET, 0)).toBe(true);
    expect(raspolozivSlot(BESKONACNI_KAPACITET, 999)).toBe(true);
    expect(brojRaspolozivihSlotova(BESKONACNI_KAPACITET, 50)).toBeNull();
  });
});

describe("podlezeNadzoru", () => {
  it("REGULARNI verifikator → podleže nadzoru (čl. 10)", () => {
    expect(podlezeNadzoru(TipKorisnika.REGULARNI)).toBe(true);
  });

  it("NOSILAC_ZRNA verifikator → ne podleže nadzoru", () => {
    expect(podlezeNadzoru(TipKorisnika.NOSILAC_ZRNA)).toBe(false);
  });
});

describe("imaPristupVerifikaciji", () => {
  it("NOSILAC_ZRNA uvek ima pristup", () => {
    expect(imaPristupVerifikaciji(TipKorisnika.NOSILAC_ZRNA, 0)).toBe(true);
  });

  it("REGULARNI sa indeksom 9 nema pristup (ispod praga 10)", () => {
    expect(imaPristupVerifikaciji(TipKorisnika.REGULARNI, 9)).toBe(false);
  });

  it("REGULARNI sa indeksom 10 ima pristup", () => {
    expect(imaPristupVerifikaciji(TipKorisnika.REGULARNI, 10)).toBe(true);
  });

  it("NEVERIFIKOVAN nikad nema pristup", () => {
    expect(imaPristupVerifikaciji(TipKorisnika.NEVERIFIKOVAN, 100)).toBe(false);
  });
});

describe("proveriAntiCirkularno", () => {
  it("Samoverifikacija je odbijena", () => {
    const rez = proveriAntiCirkularno("A", "A", []);
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) expect(rez.razlog).toContain("samog sebe");
  });

  it("Recipročno: A→B, pokušaj B→A je odbijen", () => {
    const graf: GrafZapis[] = [{ verifikatorId: "A", verifikovaniId: "B" }];
    const rez = proveriAntiCirkularno("B", "A", graf);
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) expect(rez.razlog).toContain("verifikator");
  });

  it("Direktni descendent: A→B→C, pokušaj A→C je odbijen", () => {
    const graf: GrafZapis[] = [
      { verifikatorId: "A", verifikovaniId: "B" },
      { verifikatorId: "B", verifikovaniId: "C" },
    ];
    const rez = proveriAntiCirkularno("A", "C", graf);
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) expect(rez.razlog).toContain("descendent");
  });

  it("Indirektni descendent (dubina 4): A→B→C→D, pokušaj A→D je odbijen", () => {
    const graf: GrafZapis[] = [
      { verifikatorId: "A", verifikovaniId: "B" },
      { verifikatorId: "B", verifikovaniId: "C" },
      { verifikatorId: "C", verifikovaniId: "D" },
    ];
    const rez = proveriAntiCirkularno("A", "D", graf);
    expect(rez.dozvoljeno).toBe(false);
  });

  it("Brat: A verifikovao B i C, pokušaj B→C je odbijen", () => {
    const graf: GrafZapis[] = [
      { verifikatorId: "A", verifikovaniId: "B" },
      { verifikatorId: "A", verifikovaniId: "C" },
    ];
    const rez = proveriAntiCirkularno("B", "C", graf);
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) expect(rez.razlog).toContain("podstablu");
  });

  it("Ancestor: A→B→C, pokušaj C→A je odbijen", () => {
    const graf: GrafZapis[] = [
      { verifikatorId: "A", verifikovaniId: "B" },
      { verifikatorId: "B", verifikovaniId: "C" },
    ];
    const rez = proveriAntiCirkularno("C", "A", graf);
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) expect(rez.razlog).toContain("ancestralnom");
  });

  it("Sinovac: A→B, A→D, B→E, pokušaj D→E je odbijen (podstablo verifikatora)", () => {
    // E je dete D-ovog brata (B), tj. D-ov sinovac. Po v3.9.1 celo podstablo
    // verifikatora (A) je zabranjeno, pa D ne može da verifikuje E.
    const graf: GrafZapis[] = [
      { verifikatorId: "A", verifikovaniId: "B" },
      { verifikatorId: "A", verifikovaniId: "D" },
      { verifikatorId: "B", verifikovaniId: "E" },
    ];
    const rez = proveriAntiCirkularno("D", "E", graf);
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) expect(rez.razlog).toContain("podstablu");
  });

  it("Stric: G→P, G→U, P→X, pokušaj X→U je dozvoljen (druga grana)", () => {
    // U je brat X-ovog verifikatora (P), tj. X-ov stric — u grani dede G,
    // van P-ovog podstabla. Dozvoljeno.
    const graf: GrafZapis[] = [
      { verifikatorId: "G", verifikovaniId: "P" },
      { verifikatorId: "G", verifikovaniId: "U" },
      { verifikatorId: "P", verifikovaniId: "X" },
    ];
    const rez = proveriAntiCirkularno("X", "U", graf);
    expect(rez.dozvoljeno).toBe(true);
  });

  it("Pravi rođaci: G→P, G→U, P→X, U→Y, pokušaj X→Y je dozvoljen", () => {
    // Y je u stričevom (U) podstablu, van podstabla X-ovog verifikatora P. Dozvoljeno.
    const graf: GrafZapis[] = [
      { verifikatorId: "G", verifikovaniId: "P" },
      { verifikatorId: "G", verifikovaniId: "U" },
      { verifikatorId: "P", verifikovaniId: "X" },
      { verifikatorId: "U", verifikovaniId: "Y" },
    ];
    const rez = proveriAntiCirkularno("X", "Y", graf);
    expect(rez.dozvoljeno).toBe(true);
  });

  it("Unija verifikatora: P1→X, P2→X, P2→Y, pokušaj X→Y je odbijen", () => {
    // X ima dva verifikatora (P1, P2). Y je u podstablu drugog verifikatora (P2),
    // pa unija zona zabranjuje X→Y.
    const graf: GrafZapis[] = [
      { verifikatorId: "P1", verifikovaniId: "X" },
      { verifikatorId: "P2", verifikovaniId: "X" },
      { verifikatorId: "P2", verifikovaniId: "Y" },
    ];
    const rez = proveriAntiCirkularno("X", "Y", graf);
    expect(rez.dozvoljeno).toBe(false);
    if (!rez.dozvoljeno) expect(rez.razlog).toContain("podstablu");
  });

  it("Bez zajedničkog verifikatora: P1→X, P2→Y, pokušaj X→Y je dozvoljen", () => {
    // Kontrast prethodnom: kad P2 NIJE i X-ov verifikator, Y je u nezavisnoj grani.
    const graf: GrafZapis[] = [
      { verifikatorId: "P1", verifikovaniId: "X" },
      { verifikatorId: "P2", verifikovaniId: "Y" },
    ];
    const rez = proveriAntiCirkularno("X", "Y", graf);
    expect(rez.dozvoljeno).toBe(true);
  });

  it("Dva disconnected stabla: korisnik iz jednog verifikuje iz drugog — dozvoljeno", () => {
    const graf: GrafZapis[] = [
      { verifikatorId: "A1", verifikovaniId: "B1" },
      { verifikatorId: "B1", verifikovaniId: "C1" },
      { verifikatorId: "A2", verifikovaniId: "B2" },
    ];
    const rez = proveriAntiCirkularno("C1", "B2", graf);
    expect(rez.dozvoljeno).toBe(true);
  });

  it("Veliki sintetički graf (100 čvorova, dubina 5) — radi ispod 50ms", () => {
    // Pravimo binarno stablo dubine 5: ukupno 2^6 - 1 = 63 čvorova
    const graf: GrafZapis[] = [];
    const napravljen = new Set<string>(["0"]);
    let next = 1;
    for (const root of [...napravljen]) {
      void root;
    }
    // Iteracija dok ne stignemo do >100 čvorova
    const queue = ["0"];
    while (napravljen.size < 100 && queue.length > 0) {
      const parent = queue.shift()!;
      for (let i = 0; i < 2 && napravljen.size < 100; i++) {
        const child = String(next++);
        graf.push({ verifikatorId: parent, verifikovaniId: child });
        napravljen.add(child);
        queue.push(child);
      }
    }
    const t0 = Date.now();
    const rez = proveriAntiCirkularno("0", "99", graf);
    const elapsed = Date.now() - t0;
    expect(elapsed).toBeLessThan(50);
    expect(rez.dozvoljeno).toBe(false); // 99 je descendent korena 0
  });
});

describe("formatIndeksZaPrikaz", () => {
  it("NEVERIFIKOVAN: 0/0%", () => {
    expect(formatIndeksZaPrikaz(TipKorisnika.NEVERIFIKOVAN, 0, 0)).toBe("0/0%");
  });

  it("NOSILAC_ZRNA sa indeksom 40: ∞/40%", () => {
    expect(formatIndeksZaPrikaz(TipKorisnika.NOSILAC_ZRNA, 40, 0)).toBe("∞/40%");
  });

  it("REGULARNI sa 3 verifikacije, nula potrošena: 30/30%", () => {
    expect(formatIndeksZaPrikaz(TipKorisnika.REGULARNI, 30, 0)).toBe("30/30%");
  });

  it("REGULARNI sa 3 verifikacije i 2 potrošena slota: 10/30%", () => {
    expect(formatIndeksZaPrikaz(TipKorisnika.REGULARNI, 30, 2)).toBe("10/30%");
  });

  it("REGULARNI sa max indeksom 100 i svih 10 slotova slobodno: 100/100%", () => {
    expect(formatIndeksZaPrikaz(TipKorisnika.REGULARNI, 100, 0)).toBe("100/100%");
  });

  it("REGULARNI sa 5 verifikacija i svih 5 slotova potrošeno: 0/50%", () => {
    expect(formatIndeksZaPrikaz(TipKorisnika.REGULARNI, 50, 5)).toBe("0/50%");
  });
});
