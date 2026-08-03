import { describe, it, expect } from "vitest";
import {
  validirajKarticu,
  jeKompletnaZaFeed,
  nedostajeZaFeed,
  inicijali,
  decenija,
  opstinaZa,
  naseljaIsteOpstine,
  karticaZaPosmatraca,
  godisteMax,
  GODISTE_MIN,
  MAX_CIME_SE_BAVI,
} from "@/lib/jemstvo-kartica";

describe("validirajKarticu", () => {
  it("prihvata praznu karticu — sva polja su opciona", () => {
    const r = validirajKarticu({});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.kartica.ime).toBeNull();
  });

  it("prihvata mesto iz šifarnika i odbija slobodan unos", () => {
    const dobro = validirajKarticu({ mesto: "Kula" });
    expect(dobro.ok).toBe(true);

    // Bez ove provere bi „N.Sad" tiho isključio čoveka iz feed-a (nema poklapanja).
    const lose = validirajKarticu({ mesto: "N.Sad" });
    expect(lose.ok).toBe(false);
  });

  it("odbija godište van opsega, prihvata unutar", () => {
    expect(validirajKarticu({ godiste: 1978 }).ok).toBe(true);
    expect(validirajKarticu({ godiste: GODISTE_MIN - 1 }).ok).toBe(false);
    expect(validirajKarticu({ godiste: godisteMax() + 1 }).ok).toBe(false);
    expect(validirajKarticu({ godiste: "ove godine" }).ok).toBe(false);
  });

  it("ne čuva telefon bez saglasnosti za poziv (minimizacija podataka)", () => {
    const bez = validirajKarticu({ telefon: "064 123 4567" });
    expect(bez.ok).toBe(false);

    const sa = validirajKarticu({ telefon: "064 123 4567", telefonSaglasnost: true });
    expect(sa.ok).toBe(true);
    if (sa.ok) {
      expect(sa.kartica.telefon).toBe("064 123 4567");
      expect(sa.kartica.telefonSaglasnost).toBe(true);
    }
  });

  it("saglasnost bez broja nema dejstvo", () => {
    const r = validirajKarticu({ telefonSaglasnost: true });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.kartica.telefonSaglasnost).toBe(false);
  });

  it("odbija neispravan telefon", () => {
    expect(validirajKarticu({ telefon: "abc", telefonSaglasnost: true }).ok).toBe(false);
    expect(validirajKarticu({ telefon: "123", telefonSaglasnost: true }).ok).toBe(false);
  });

  it("seče „čime se baviš” na 100 znakova — kartica ne sme da postane oglas", () => {
    const r = validirajKarticu({ cimeSeBavi: "a".repeat(500) });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.kartica.cimeSeBavi!.length).toBe(MAX_CIME_SE_BAVI);
  });
});

describe("ulazak u feed", () => {
  it("traži ime i mesto — bez mesta se kartica ne može nikome dovesti", () => {
    expect(jeKompletnaZaFeed({ ime: "Milan", mesto: "Kula" })).toBe(true);
    expect(jeKompletnaZaFeed({ ime: "Milan", mesto: null })).toBe(false);
    expect(jeKompletnaZaFeed({ ime: null, mesto: "Kula" })).toBe(false);
  });

  it("kaže tačno šta fali (nikad ćutanje)", () => {
    expect(nedostajeZaFeed({ ime: null, mesto: null })).toEqual(["ime", "mesto"]);
    expect(nedostajeZaFeed({ ime: "Milan", mesto: null })).toEqual(["mesto"]);
    expect(nedostajeZaFeed({ ime: "Milan", mesto: "Kula" })).toEqual([]);
  });
});

describe("prikaz po ulozi", () => {
  const z = {
    ime: "Milan",
    prezime: "Jovanović",
    godiste: 1978,
    mesto: "Kula",
    nadimak: "Miša Kovačev",
    cimeSeBavi: "Limar",
    legacyTekst: null,
  };

  it("verifikovan član vidi punu karticu", () => {
    const k = karticaZaPosmatraca(z, true);
    expect(k.ime).toBe("Milan");
    expect(k.godiste).toBe(1978);
    expect(k.nadimak).toBe("Miša Kovačev");
  });

  it("neverifikovan vidi samo inicijale, mesto i deceniju", () => {
    const k = karticaZaPosmatraca(z, false);
    expect(k.ime).toBeNull();
    expect(k.prezime).toBeNull();
    expect(k.nadimak).toBeNull();
    expect(k.cimeSeBavi).toBeNull();
    expect(k.godiste).toBeNull();
    expect(k.inicijali).toBe("M. J.");
    expect(k.decenija).toBe("1970-e");
    expect(k.mesto).toBe("Kula");
  });

  it("inicijali i decenija podnose prazne vrednosti", () => {
    expect(inicijali(null, null)).toBeNull();
    expect(inicijali("Milan", null)).toBe("M.");
    expect(decenija(null)).toBeNull();
    expect(decenija(2001)).toBe("2000-e");
  });
});

describe("rangiranje po mestu", () => {
  it("naselje se preslikava na opštinu", () => {
    expect(opstinaZa("Kula")).toBeTruthy();
    expect(opstinaZa(null)).toBeNull();
  });

  it("ista opština obuhvata i okolna sela, ne samo isto naselje", () => {
    const naselja = naseljaIsteOpstine("Sombor");
    expect(naselja).toContain("Sombor");
    // Čovek iz sela pored Sombora prepoznaje Somborca — tačno poklapanje
    // naselja bi ga promašilo.
    expect(naselja.length).toBeGreaterThan(1);
  });

  it("nepoznato mesto se svede na samo sebe", () => {
    expect(naseljaIsteOpstine(null)).toEqual([]);
  });
});
