import { describe, it, expect } from "vitest";
import { koordinateZaMesto, udaljenostIzmedjuMesta, udaljenostKm } from "@/lib/udaljenost";
import { NASELJE_KOORDINATE } from "@/lib/naselja-koordinate";
import { NASELJE_OPSTINA, OPSTINA_KOORDINATE } from "@/lib/naselja-geo";

describe("koordinateZaMesto", () => {
  it("prepoznaje grad direktno", () => {
    expect(koordinateZaMesto("Novi Sad")).not.toBeNull();
    expect(koordinateZaMesto("Beograd")).not.toBeNull();
  });

  it("selo sa sopstvenim koordinatama se razlikuje od centra opštine", () => {
    // Stapar (opština Sombor) ima svoju tačku u naselja-koordinate.ts —
    // ranije je padao na centar opštine pa je Sombor–Stapar bilo 0 km.
    const stapar = koordinateZaMesto("Stapar");
    expect(stapar).not.toBeNull();
    expect(stapar).not.toEqual(OPSTINA_KOORDINATE["Sombor"]);
    const d = udaljenostIzmedjuMesta("Sombor", "Stapar")!;
    expect(d).toBeGreaterThan(5);
    expect(d).toBeLessThan(25);
  });

  it("selo bez sopstvenih koordinata pada nazad na centar opštine", () => {
    const bezSvojih = Object.keys(NASELJE_OPSTINA).find(
      (n) => !(n in NASELJE_KOORDINATE) && !(n in OPSTINA_KOORDINATE)
    );
    expect(bezSvojih).toBeDefined();
    expect(koordinateZaMesto(bezSvojih!)).toEqual(
      OPSTINA_KOORDINATE[NASELJE_OPSTINA[bezSvojih!]]
    );
  });

  it("koordinate naselja ne pregaze lookup istoimene druge opštine", () => {
    // npr. selo Bela Crkva (Krupanj) ne sme da pomeri opštinu Bela Crkva —
    // generator takva naselja preskače; grad-sedište sme preciznije od centra.
    for (const opstina of Object.keys(OPSTINA_KOORDINATE)) {
      if (opstina in NASELJE_KOORDINATE) continue;
      expect(koordinateZaMesto(opstina), opstina).toEqual(OPSTINA_KOORDINATE[opstina]);
    }
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
