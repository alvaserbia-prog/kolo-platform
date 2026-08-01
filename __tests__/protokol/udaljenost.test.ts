import { describe, it, expect } from "vitest";
import { koordinateZaMesto, udaljenostIzmedjuMesta, udaljenostKm } from "@/lib/udaljenost";

describe("koordinateZaMesto", () => {
  it("prepoznaje grad direktno", () => {
    expect(koordinateZaMesto("Novi Sad")).not.toBeNull();
    expect(koordinateZaMesto("Beograd")).not.toBeNull();
  });

  it("prepoznaje selo preko opštine (Stapar → Sombor)", () => {
    const stapar = koordinateZaMesto("Stapar");
    const sombor = koordinateZaMesto("Sombor");
    expect(stapar).not.toBeNull();
    expect(stapar).toEqual(sombor);
  });

  it("toleriše velika/mala slova i dijakritike", () => {
    expect(koordinateZaMesto("novi sad")).toEqual(koordinateZaMesto("Novi Sad"));
    expect(koordinateZaMesto("Kljajicevo")).toEqual(koordinateZaMesto("Kljajićevo"));
  });

  it("toleriše dodatak iza zareza", () => {
    expect(koordinateZaMesto("Novi Sad, Liman")).toEqual(koordinateZaMesto("Novi Sad"));
  });

  it("vraća null za neprepoznato mesto ili prazno", () => {
    expect(koordinateZaMesto("Atlantida")).toBeNull();
    expect(koordinateZaMesto("")).toBeNull();
    expect(koordinateZaMesto(null)).toBeNull();
  });
});

describe("udaljenostKm / udaljenostIzmedjuMesta", () => {
  it("isto mesto = 0 km", () => {
    expect(udaljenostIzmedjuMesta("Novi Sad", "Novi Sad")).toBe(0);
  });

  it("Beograd–Novi Sad ~70–90 km vazdušno", () => {
    const d = udaljenostIzmedjuMesta("Beograd", "Novi Sad")!;
    expect(d).toBeGreaterThan(60);
    expect(d).toBeLessThan(100);
  });

  it("Subotica–Vranje je nekoliko stotina km", () => {
    const d = udaljenostIzmedjuMesta("Subotica", "Vranje")!;
    expect(d).toBeGreaterThan(300);
  });

  it("null kad jedna strana nije prepoznata", () => {
    expect(udaljenostIzmedjuMesta("Novi Sad", "Atlantida")).toBeNull();
    expect(udaljenostIzmedjuMesta(null, "Novi Sad")).toBeNull();
  });

  it("haversine je simetričan", () => {
    const a = koordinateZaMesto("Niš")!;
    const b = koordinateZaMesto("Užice")!;
    expect(udaljenostKm(a, b)).toBeCloseTo(udaljenostKm(b, a), 10);
  });
});
