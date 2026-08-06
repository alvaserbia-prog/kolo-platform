import { describe, it, expect } from "vitest";
import { razresiNaselje, jeNaseljeIzSifarnika, normalizujNaselje } from "@/lib/naselje";
import { koordinateZaMesto } from "@/lib/udaljenost";
import { validirajKarticu } from "@/lib/jemstvo-kartica";

describe("razresiNaselje", () => {
  it("prepoznaje tačan naziv iz šifarnika", () => {
    expect(razresiNaselje("Stanišić")).toBe("Stanišić");
    expect(razresiNaselje("Novi Sad")).toBe("Novi Sad");
  });

  it("vraća kanonski zapis za unos bez dijakritika i sa malim slovima", () => {
    expect(razresiNaselje("stanisic")).toBe("Stanišić");
    expect(razresiNaselje("NOVI   SAD")).toBe("Novi Sad");
  });

  it("od „selo (opština)“ zadržava uže — selo", () => {
    // Ovo je slučaj zbog kog je uvedeno razrešavanje: član je upisao obe lokacije.
    expect(razresiNaselje("Stanišić (Sombor)")).toBe("Stanišić");
    expect(razresiNaselje("stanisic (sombor)")).toBe("Stanišić");
  });

  it("odbacuje dodatak iza zareza, kose crte i crtice", () => {
    expect(razresiNaselje("Novi Sad, Liman")).toBe("Novi Sad");
    expect(razresiNaselje("Stanišić / Sombor")).toBe("Stanišić");
    expect(razresiNaselje("Stanišić - Sombor")).toBe("Stanišić");
  });

  it("vraća null za ono što nije naselje iz šifarnika", () => {
    expect(razresiNaselje("Beč")).toBeNull();
    expect(razresiNaselje("negde kod Sombora")).toBeNull();
    expect(razresiNaselje("")).toBeNull();
    expect(razresiNaselje(null)).toBeNull();
    expect(razresiNaselje(42)).toBeNull();
  });

  it("ne spaja dva mesta bez razdvojnika u jedno", () => {
    // „Stanišić Sombor“ nije naselje — čovek mora da izabere jedno.
    expect(jeNaseljeIzSifarnika("Stanišić Sombor")).toBe(false);
  });

  it("normalizacija skida dijakritike i sažima razmake", () => {
    expect(normalizujNaselje(" Bačka  Topola ")).toBe("backa topola");
  });
});

describe("zatečeni slobodan unos i dalje daje koordinate", () => {
  it("„Stanišić (Sombor)“ se razrešava u Stanišić", () => {
    expect(koordinateZaMesto("Stanišić (Sombor)")).toEqual(koordinateZaMesto("Stanišić"));
  });

  it("nepoznato mesto nema koordinate", () => {
    expect(koordinateZaMesto("negde kod Sombora")).toBeNull();
  });
});

describe("kartica jemstva koristi isti razrešivač", () => {
  it("upisuje kanonski naziv umesto unetog oblika", () => {
    const r = validirajKarticu({ mesto: "stanisic (sombor)" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.kartica.mesto).toBe("Stanišić");
  });

  it("odbija mesto koje nije u šifarniku", () => {
    const r = validirajKarticu({ mesto: "negde kod Sombora" });
    expect(r.ok).toBe(false);
  });
});
