import { describe, it, expect } from "vitest";
import {
  uslovPotvrde,
  imaTragUcesca,
  BEZ_TRAGA,
  type TragUcesca,
  type UslovPotvrde,
} from "@/lib/potvrda-uslov";

describe("uslovPotvrde", () => {
  it("bez ijednog traga učešća ne otključava ništa", () => {
    expect(uslovPotvrde(BEZ_TRAGA)).toBeNull();
    expect(imaTragUcesca(BEZ_TRAGA)).toBe(false);
  });

  it("odobren prvi oglas otključava upis", () => {
    expect(uslovPotvrde({ ...BEZ_TRAGA, oglasOdobren: true })).toBe("OGLAS");
  });

  it("javna donacija otključava upis", () => {
    expect(uslovPotvrde({ ...BEZ_TRAGA, javnaDonacija: true })).toBe("DONACIJA");
  });

  it("pokroviteljstvo otključava upis", () => {
    expect(uslovPotvrde({ ...BEZ_TRAGA, pokroviteljstvo: true })).toBe("POKROVITELJSTVO");
  });

  it("operativni doprinos otključava upis", () => {
    expect(uslovPotvrde({ ...BEZ_TRAGA, operativniDoprinos: true })).toBe("OPERATIVNI");
  });

  it("kad je ispunjeno više uslova, upisuje se jedan i izbor je određen", () => {
    // Redosled nije pravilo nego samo izbor oznake — ali mora biti determinističan,
    // inače bi dva poziva nad istim stanjem upisala različite vrednosti.
    const sve: TragUcesca = {
      oglasOdobren: true,
      javnaDonacija: true,
      pokroviteljstvo: true,
      operativniDoprinos: true,
    };
    expect(uslovPotvrde(sve)).toBe("OGLAS");
    expect(uslovPotvrde(sve)).toBe(uslovPotvrde(sve));
  });

  // 🔴 Brana protiv tihog dodavanja uslova: ko doda polje u `TragUcesca` i u
  // `BEZ_TRAGA`, a zaboravi granu u `uslovPotvrde`, dobio bi uslov koji nikad ne
  // otključava — i to bez ijedne greške pri prevođenju. Test to hvata jer prolazi
  // kroz SVA polja, ne kroz otkucanu listu.
  it("svako polje traga samo za sebe otključava neki uslov", () => {
    const polja = Object.keys(BEZ_TRAGA) as (keyof TragUcesca)[];
    expect(polja.length).toBeGreaterThan(0);
    const dobijeni = new Set<UslovPotvrde>();
    for (const polje of polja) {
      const uslov = uslovPotvrde({ ...BEZ_TRAGA, [polje]: true });
      expect(uslov, `polje ${polje} ne otključava nijedan uslov`).not.toBeNull();
      dobijeni.add(uslov as UslovPotvrde);
    }
    // Svako polje nosi SVOJU oznaku — dva polja sa istom oznakom znače da se iz
    // zapisa više ne vidi šta je upis otključalo.
    expect(dobijeni.size).toBe(polja.length);
  });

  it("BEZ_TRAGA je zaista prazan", () => {
    for (const [polje, vrednost] of Object.entries(BEZ_TRAGA)) {
      expect(vrednost, `BEZ_TRAGA.${polje} nije false`).toBe(false);
    }
  });

  // 🔴 Ono što NAMERNO nije uslov. Ovo nije provera koda nego zapis odluke: prepis
  // POEN-a se dogovara privatno i niko ga ne potvrđuje, osnivački je automatski,
  // socijalni programi su podrška a ne doprinos, a anonimna donacija bi svojim
  // otključavanjem odala da je data (POEN za potvrdu je javan zapis u knjizi).
  it("trag nema polja za prepis, osnivački, socijalne programe ni anonimnu donaciju", () => {
    const polja = Object.keys(BEZ_TRAGA);
    for (const zabranjeno of ["prepis", "transfer", "osnivacki", "program", "anonim"]) {
      expect(
        polja.some((p) => p.toLowerCase().includes(zabranjeno)),
        `„${zabranjeno}" ne sme da bude uslov za upis POEN-a po potvrdi`,
      ).toBe(false);
    }
  });
});
