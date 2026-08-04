import { describe, it, expect } from "vitest";
import {
  validanPseudonim,
  kljucPseudonima,
  REZERVISANI_PSEUDONIMI,
} from "@/lib/validacija";
import { profilHref } from "@/lib/profil-link";

describe("validanPseudonim — pravila otkad pseudonim stoji u adresi profila", () => {
  it("prihvata obična imena sa velikim slovima", () => {
    expect(validanPseudonim("Marko")).toBe(true);
    expect(validanPseudonim("baba_mara")).toBe(true);
    expect(validanPseudonim("Zorica_M")).toBe(true);
    expect(validanPseudonim("djordje-v")).toBe(true);
    expect(validanPseudonim("Ana.D")).toBe(true);
    expect(validanPseudonim("K0LO123")).toBe(true);
  });

  it("odbija razmake — link bi dobio %20 pri kopiranju", () => {
    expect(validanPseudonim("Marko Petrovic")).toBe(false);
    expect(validanPseudonim("Marko ")).toBe(true); // trim, pa je ovo "Marko"
    expect(validanPseudonim(" ")).toBe(false);
  });

  it("odbija srpska slova i ćirilicu", () => {
    expect(validanPseudonim("Đorđe")).toBe(false);
    expect(validanPseudonim("Miloš")).toBe(false);
    expect(validanPseudonim("Мирко")).toBe(false);
  });

  it("odbija homograf — ćirilično M pored latiničnog M", () => {
    // „Мarko" počinje ćiriličnim М i vizuelno je isto kao „Marko".
    expect(validanPseudonim("Мarko")).toBe(false);
    expect(validanPseudonim("Marko")).toBe(true);
  });

  it("odbija granične znakove i dva razdvajača zaredom", () => {
    expect(validanPseudonim("_marko")).toBe(false);
    expect(validanPseudonim("marko-")).toBe(false);
    expect(validanPseudonim(".marko.")).toBe(false);
    expect(validanPseudonim("mar..ko")).toBe(false);
    expect(validanPseudonim("mar_-ko")).toBe(false);
    expect(validanPseudonim("mar_ko")).toBe(true);
  });

  it("poštuje dužinu 3–30", () => {
    expect(validanPseudonim("ab")).toBe(false);
    expect(validanPseudonim("abc")).toBe(true);
    expect(validanPseudonim("a".repeat(30))).toBe(true);
    expect(validanPseudonim("a".repeat(31))).toBe(false);
  });

  it("odbija rezervisana imena i imitaciju ugašenih naloga", () => {
    // `/profil/oglasi` je već stranica „moji oglasi" — statička putanja bi
    // progutala profil korisnika sa tim pseudonimom.
    expect(validanPseudonim("oglasi")).toBe(false);
    expect(validanPseudonim("Oglasi")).toBe(false);
    expect(validanPseudonim("protokol")).toBe(false);
    expect(validanPseudonim("Fondacija")).toBe(false);
    expect(validanPseudonim("obrisani-korisnik-abc123")).toBe(false);
    expect(REZERVISANI_PSEUDONIMI.has("oglasi")).toBe(true);
  });

  it("odbija sve što nije string", () => {
    expect(validanPseudonim(undefined)).toBe(false);
    expect(validanPseudonim(null)).toBe(false);
    expect(validanPseudonim(123)).toBe(false);
    expect(validanPseudonim(["Marko"])).toBe(false);
  });
});

describe("kljucPseudonima — jedinstvenost bez obzira na veličinu slova", () => {
  it("svodi na mala slova i skida okolne razmake", () => {
    expect(kljucPseudonima("Marko")).toBe("marko");
    expect(kljucPseudonima("  MARKO  ")).toBe("marko");
  });

  it("različito pisana ista imena daju isti ključ", () => {
    const kljucevi = ["Marko", "marko", "MARKO", "MaRkO"].map(kljucPseudonima);
    expect(new Set(kljucevi).size).toBe(1);
  });
});

describe("profilHref", () => {
  it("koristi pseudonim kad postoji", () => {
    expect(profilHref({ id: "uuid-1", pseudonim: "Marko" })).toBe("/profil/Marko");
  });

  it("pada na interni id kad pseudonima nema (maskiran prikaz)", () => {
    expect(profilHref({ id: "uuid-1", pseudonim: null })).toBe("/profil/uuid-1");
    expect(profilHref({ id: "uuid-1" })).toBe("/profil/uuid-1");
  });

  it("kodira stare pseudonime sa razmakom i srpskim slovima", () => {
    expect(profilHref({ id: "uuid-1", pseudonim: "Đorđe_V" })).toBe(
      "/profil/%C4%90or%C4%91e_V"
    );
    expect(profilHref({ id: "uuid-1", pseudonim: "Marko Petrovic" })).toBe(
      "/profil/Marko%20Petrovic"
    );
  });
});
