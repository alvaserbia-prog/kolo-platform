import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Zelena kartica sa stanjem POEN-a mora biti zelena u svakom pregledaču.
 *
 * Do 13.10.2026 je kartica nosila samo `bg-gradient-to-br`. Tailwind v4 tu staru
 * klasu prevodi u `linear-gradient(to bottom right in oklab, …)` BEZ rezerve, pa ga
 * pregledač koji ne zna `in oklab` odbaci celog. Na računaru vlasnika kartica je
 * bila bela, sa belim slovima, iako sme da prepisuje. Nova klasa `bg-linear-to-*`
 * nosi `@supports` rezervu, a pun ton ispod prelaza drži zelenu i kad prelaza nema.
 */

const KOREN = process.cwd();

function fajlovi(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "generated" ? [] : fajlovi(p);
    return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });
}

describe("zelena kartica POEN-a", () => {
  it("nigde u src/ nema stare klase bg-gradient-to-*", () => {
    const losi = fajlovi(path.join(KOREN, "src"))
      .filter((f) => /\bbg-gradient-to-/.test(fs.readFileSync(f, "utf8")))
      .map((f) => path.relative(KOREN, f));
    expect(losi).toEqual([]);
  });

  it("kartica sa stanjem ima pun zeleni ton ispod prelaza i ista je za sve", () => {
    const izvor = fs.readFileSync(
      path.join(KOREN, "src", "app", "(app)", "novcanik", "NovcanikKartice.tsx"),
      "utf8",
    );
    expect(izvor).toContain(
      'className="bg-kolo-green-700 bg-linear-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-6 text-white shadow-lg"',
    );
  });
});
