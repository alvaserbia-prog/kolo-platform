import { describe, it, expect } from "vitest";
import {
  RAZLOZI,
  RAZLOZI_DECA,
  RAZLOZI_ODRASLI,
  jeRazlog,
  jeHitno,
  jeObrazac,
  kljucRazloga,
  proveriPrijavu,
  PRAG_OBRASCA,
  MAX_OPIS,
} from "@/lib/prijava-poruke-pravila";
import sr from "../messages/sr.json";
import en from "../messages/en.json";
import ru from "../messages/ru.json";
import hr from "../messages/hr.json";
import hu from "../messages/hu.json";

describe("prijava poruke — šifarnik", () => {
  it("obe sobe nude samo šifre koje postoje", () => {
    for (const s of [...RAZLOZI_DECA, ...RAZLOZI_ODRASLI]) {
      expect(RAZLOZI).toContain(s);
    }
  });

  it("obe sobe nude „ostalo” — inače prijava koja ne stane ni u jednu šifru nema gde", () => {
    expect(RAZLOZI_DECA).toContain("OSTALO");
    expect(RAZLOZI_ODRASLI).toContain("OSTALO");
  });

  /**
   * Tri šifre mamljenja stoje odvojeno namerno: pod zbirnim „neprimereno" obrazac
   * se ne bi video, a upravo obrazac je ono što se u dečjoj sobi traži.
   */
  it("dečja soba nudi sve tri šifre mamljenja", () => {
    expect(RAZLOZI_DECA).toEqual(
      expect.arrayContaining(["TRAZI_SLIKE", "TRAZI_SUSRET", "LAZE_UZRAST"]),
    );
  });

  it("svaka šifra ima oznaku na svih pet jezika", () => {
    for (const [jezik, poruke] of Object.entries({ sr, en, ru, hr, hu })) {
      const ns = (poruke as Record<string, Record<string, string>>).prijavaPoruke;
      expect(ns, `${jezik} nema namespace prijavaPoruke`).toBeTruthy();
      for (const s of RAZLOZI) {
        expect(ns[kljucRazloga(s)], `${jezik} nema oznaku za ${s}`).toBeTruthy();
      }
    }
  });

  it("jeRazlog odbija sve što nije iz šifarnika", () => {
    expect(jeRazlog("VREDJANJE")).toBe(true);
    expect(jeRazlog("vredjanje")).toBe(false);
    expect(jeRazlog(null)).toBe(false);
    expect(jeRazlog(7)).toBe(false);
  });
});

describe("prijava poruke — provera unosa", () => {
  it("šifra je obavezna", () => {
    expect(proveriPrijavu(undefined, "nešto").ok).toBe(false);
    expect(proveriPrijavu("NEPOSTOJECA", null).ok).toBe(false);
  });

  it("šifra sama nosi podatak — slobodan tekst se ne traži", () => {
    const r = proveriPrijavu("TRAZI_SLIKE", undefined);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.opis).toBeNull();
  });

  it("uz „ostalo” tekst je obavezan — prazna prijava ne kaže ništa", () => {
    expect(proveriPrijavu("OSTALO", "").ok).toBe(false);
    expect(proveriPrijavu("OSTALO", "  ").ok).toBe(false);
    expect(proveriPrijavu("OSTALO", "psuje").ok).toBe(true);
  });

  it("opis se seče na gornju granicu", () => {
    const r = proveriPrijavu("OSTALO", "x".repeat(MAX_OPIS + 200));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.opis).toHaveLength(MAX_OPIS);
  });
});

describe("prijava poruke — obrazac i hitnost", () => {
  it("hitne su samo šifre mamljenja i laži o uzrastu", () => {
    expect(jeHitno("LAZE_UZRAST")).toBe(true);
    expect(jeHitno("TRAZI_SUSRET")).toBe(true);
    expect(jeHitno("TRAZI_SLIKE")).toBe(true);
    expect(jeHitno("VREDJANJE")).toBe(false);
    expect(jeHitno("OSTALO")).toBe(false);
  });

  /**
   * 🔴 Prag se meri brojem RAZLIČITIH prijavilaca. Jedan čovek koji pritisne
   * dugme tri puta nije obrazac nego jedan čovek — a i ne može, `@@unique` na
   * (poruka, prijavilac) mu ne da drugu prijavu nad istom porukom.
   */
  it("obrazac traži prag različitih prijavilaca", () => {
    expect(jeObrazac(PRAG_OBRASCA - 1)).toBe(false);
    expect(jeObrazac(PRAG_OBRASCA)).toBe(true);
    expect(jeObrazac(PRAG_OBRASCA + 5)).toBe(true);
  });
});
