import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Redni broj potvrde (04.10.2026).
 *
 * Veze iz lanca potvrda se brišu (lažna verifikacija, prestanak statusa, prevođenje
 * naloga), pa broj veza jednog potvrđivača ume da bude manji od najvećeg rednog
 * broja. Redni broj računat kao `count + 1` je tada udarao u
 * @@unique([verifikatorId, redniBroj]) i svaka sledeća potvrda je padala sa
 * „Ova potvrda već postoji." — kvar koji se ne vidi dok neko ne obriše vezu.
 */

const izvor = readFileSync(
  join(__dirname, "..", "src/lib/protokol/verifikacija-service.ts"),
  "utf8"
);

describe("redni broj nove potvrde", () => {
  it("računa se iz najvećeg postojećeg, ne iz broja veza", () => {
    expect(izvor).toMatch(/_max:\s*\{\s*redniBroj:\s*true\s*\}/);
    expect(izvor).not.toMatch(/const redniBroj = brojObavljenih \+ 1/);
  });
});
