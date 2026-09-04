import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { JAVNE_RUTE, JAVNE_TACNE_RUTE } from "@/proxy";

/**
 * Svaka stranica u grupi `(public)` mora biti i na spisku javnih ruta u proxy-ju.
 *
 * Grupa `(public)` ne znači ništa proxy-ju — on gleda samo svoj spisak, pa nova
 * javna strana bez unosa u `JAVNE_RUTE` šalje posetioca na `/login` pre nego što
 * se uopšte iscrta. To se do sada desilo DVA puta: prvo `/skole` (v. komentar uz
 * `JAVNE_TACNE_RUTE`), pa `/kako-sistem-radi` odmah po uvođenju. Oba puta je
 * stranica bila ispravno napisana i nedostupna.
 *
 * Test hvata upravo taj razmak između foldera i spiska.
 */
describe("javne rute", () => {
  const koren = join(process.cwd(), "src", "app", "(public)");

  const strane = readdirSync(koren, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => `/${d.name}`);

  it("grupa (public) nije prazna (inače test ne proverava ništa)", () => {
    expect(strane.length).toBeGreaterThan(5);
  });

  it.each(strane)("%s je na spisku javnih ruta u proxy.ts", (ruta) => {
    const pokriveno =
      JAVNE_RUTE.includes(ruta) || JAVNE_TACNE_RUTE.includes(ruta);
    expect(pokriveno).toBe(true);
  });
});
