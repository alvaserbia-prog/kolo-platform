/**
 * Brana: svaki javni brojač razmena mora da prođe kroz `USLOV_RAZMENE`.
 *
 * „Razmena" nema svoj model — broji se `TransactionType.TRANSFER`, a takav upit
 * je jedna linija koju je lako napisati iznova pri sledećem ekranu. Prag od
 * `MIN_POEN_RAZMENE` tada tiho otpada: broj na ekranu ostaje veći i deluje
 * ispravno, pa se ništa ne vidi kao kvar. Isti obrazac kao vidljivost oglasa —
 * pravilo je ispravno, ali ga jedan prikaz zaobilazi sopstvenim upitom.
 *
 * Zato test gleda IZVOR (pravilo 14): nijedan prikaz sa spiska ne sme da broji
 * `type: "TRANSFER"` sam, mimo zajedničkog uslova. Zbir prepisanih POEN-a
 * („Ukupno prepisa") je izuzet i to je namerno — on meri POEN, ne broj razmena.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { MIN_POEN_RAZMENE, USLOV_RAZMENE } from "@/lib/razmena-brojac-pravila";

const KOREN = process.cwd();

/** Prikazi koji broje ili prikazuju razmene sopstvenim upitom. */
const PRIKAZI = [
  "src/app/page.tsx",
  "src/app/(app)/pocetna/page.tsx",
  "src/app/(app)/sistem/page.tsx",
];

/** Upiti koji smeju da zadrže goli `type: "TRANSFER"` — i zašto. */
const IZUZECI: Record<string, number> = {
  // Dva `aggregate` zbira iza kartice „Ukupno prepisa" (POEN, ne broj razmena).
  "src/app/(app)/sistem/page.tsx": 2,
};

describe("brojač razmena ne broji prepise ispod praga", () => {
  it("prag i uslov stoje na jednom mestu", () => {
    expect(MIN_POEN_RAZMENE).toBe(100);
    expect(USLOV_RAZMENE).toEqual({ type: "TRANSFER", amount: { gte: MIN_POEN_RAZMENE } });
  });

  it.each(PRIKAZI)("%s uvozi zajednički uslov", (rel) => {
    const izvor = readFileSync(path.join(KOREN, rel), "utf8");
    expect(izvor, `${rel} broji razmene bez USLOV_RAZMENE`).toContain("USLOV_RAZMENE");
  });

  it.each(PRIKAZI)("%s nema sopstveni upit po TRANSFER-u", (rel) => {
    const izvor = readFileSync(path.join(KOREN, rel), "utf8");
    const golih = (izvor.match(/type: "TRANSFER"/g) ?? []).length;
    expect(golih, `${rel} ima upit po TRANSFER-u mimo USLOV_RAZMENE`).toBe(IZUZECI[rel] ?? 0);
  });
});
