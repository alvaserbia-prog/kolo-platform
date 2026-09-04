import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  RAZLOZI,
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
  it("soba odraslih nudi samo šifre koje postoje", () => {
    for (const s of RAZLOZI_ODRASLI) {
      expect(RAZLOZI).toContain(s);
    }
  });

  it("nudi „ostalo” — inače prijava koja ne stane ni u jednu šifru nema gde", () => {
    expect(RAZLOZI_ODRASLI).toContain("OSTALO");
  });

  /**
   * Prijava je 04.09.2026. uklonjena iz dečje sobe (odluka vlasnika), pa
   * `RAZLOZI_DECA` više ne postoji. Tri šifre mamljenja OSTAJU u šifarniku i u
   * enum-u: nose ih zatečene prijave upisane dok je dugme radilo, a admin ekran
   * mora da ume da ih prikaže. Zato ih i `jeHitno` i dalje prepoznaje.
   */
  it("šifre mamljenja ostaju u šifarniku zbog zatečenih prijava", () => {
    for (const s of ["TRAZI_SLIKE", "TRAZI_SUSRET", "LAZE_UZRAST"]) {
      expect(RAZLOZI).toContain(s);
      expect(jeHitno(s as never)).toBe(true);
    }
  });

  // Soba odraslih ih NE nudi: pisane su za dečju sobu i za odraslog sagovornika
  // ne znače isto.
  it("soba odraslih ne nudi šifre mamljenja", () => {
    for (const s of ["TRAZI_SLIKE", "TRAZI_SUSRET", "LAZE_UZRAST"]) {
      expect(RAZLOZI_ODRASLI).not.toContain(s);
    }
  });

  it("svaka šifra ima oznaku na svih pet jezika", () => {
    for (const [jezik, poruke] of Object.entries({ sr, en, ru, hr, hu })) {
      const ns = (poruke as unknown as Record<string, Record<string, string>>).prijavaPoruke;
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

/**
 * Brana: dečja soba nema prijavu (odluka vlasnika, 04.09.2026).
 *
 * Gleda IZVOR, ne ponašanje, iz istog razloga iz kog to radi
 * `oglasi-vidljivost-izvor.test.ts`: dugme se vraća jednim redom u JSX-u, a
 * njegov povratak bi ovde prošao nemo — prijava iz dečje sobe upisala bi se u red
 * čekanja koji niko ne gleda, ili bi pukla na ruti pošto je dete već pritisnulo.
 *
 * Provera je NA DVA MESTA namerno: ekran i ruta. Ekran nije poslednja reč — ruta
 * je dostižna svakome ko zna adresu.
 */
describe("dečja soba nema prijavu poruke", () => {
  const KOREN = process.cwd();
  const citaj = (rel: string) => readFileSync(path.join(KOREN, rel), "utf8");

  it("dečja Pričaonica ne renderuje dugme", () => {
    const izvor = citaj("src/app/(app)/pocetna/DecjaPocetna.tsx");
    expect(izvor).not.toMatch(/<PrijaviPoruku/);
    expect(izvor).not.toMatch(/RAZLOZI_DECA/);
  });

  it("ruta odbija poruku iz dečje sobe", () => {
    const izvor = citaj("src/app/api/chat/[id]/prijavi/route.ts");
    expect(izvor).toMatch(/poruka\.soba === ChatSoba\.DECA/);
  });

  // Soba odraslih je NETAKNUTA — uklonjena je prijava iz dečje sobe, ne prijava.
  it("soba odraslih i dalje ima dugme", () => {
    const izvor = citaj("src/app/(app)/pocetna/PocetnaKlijent.tsx");
    expect(izvor).toMatch(/<PrijaviPoruku[\s\S]{0,120}RAZLOZI_ODRASLI/);
  });
});
