import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Broj oglasa na naslovnoj i početnoj mora da se slaže sa spiskom na Pijaci.
 *
 * Do 17.10.2026 su oba brojača brojala goli `status: "ACTIVE"`, a Pijaca uz to
 * primenjuje vidljivost iz Modula Deca (`usloviVidljivostiOglasa`). Naslovna je
 * pokazivala 44 oglasa, a Pijaca 43: brojao se i oglas koji Pijaca ne prikazuje
 * (oglas deteta, nalog deteta bez roditelja), pa je broj mogao da oda dete.
 */

const KOREN = process.cwd();
const procitaj = (...p: string[]) => fs.readFileSync(path.join(KOREN, ...p), "utf8");

describe("broj oglasa prati vidljivost Pijace", () => {
  it.each([
    ["naslovna", ["src", "app", "page.tsx"], "usloviVidljivostiOglasa(null)"],
    ["početna", ["src", "app", "(app)", "pocetna", "page.tsx"], "usloviVidljivostiOglasa(ja)"],
  ])("%s broji kroz isti uslov kao Pijaca", (_, fajl, uslov) => {
    const izvor = procitaj(...(fajl as string[]));
    expect(izvor).not.toMatch(/marketplaceListing\.count\(\{\s*where:\s*\{\s*status:\s*"ACTIVE"\s*\}\s*\}\)/);
    expect(izvor).toContain(
      `marketplaceListing.count({ where: { status: "ACTIVE", seller: ${uslov} } })`,
    );
  });
});
