import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Svaki `link` u obaveštenju mora da vodi na stranicu koja postoji.
 *
 * Do 13.10.2026 je obaveštenje „Zabeležen ti je doprinos" (potvrđeni član, dokaz
 * stvarnosti) vodilo na `/pijaca/novi` — stranicu koja nikad nije postojala.
 * Adresa je pala u `/pijaca/[id]`, oglas „novi" nije nađen, i član je na prvom
 * koraku posle potvrde dobio „Stranica nije nađena". Kvar je nevidljiv u kodu:
 * link je samo niska, nijedan tip ni build ga ne proverava.
 *
 * Test čita IZVOR: sve doslovne `link: "/..."` niske u `src/` i za svaku traži
 * `page.tsx` pod `src/app/` (grupe `(…)` se preskaču, `[param]` prima bilo koji
 * segment iz `${…}`, ali nikad doslovan segment).
 */

const KOREN = process.cwd();
const APP = path.join(KOREN, "src", "app");
const PARAM = "__param__";

function fajlovi(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "generated" ? [] : fajlovi(p);
    return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });
}

/** Ima li `dir` stranicu za segmente `seg`, uz preskakanje grupa i hvatanje `[param]`. */
function postoji(dir: string, seg: string[]): boolean {
  if (!fs.existsSync(dir)) return false;
  const deca = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (seg.length === 0) {
    if (fs.existsSync(path.join(dir, "page.tsx"))) return true;
    return deca.some((e) => /^\(.*\)$/.test(e.name) && postoji(path.join(dir, e.name), seg));
  }
  const [prvi, ...ostali] = seg;
  return deca.some((e) => {
    const p = path.join(dir, e.name);
    if (/^\(.*\)$/.test(e.name)) return postoji(p, seg);
    if (e.name === prvi) return postoji(p, ostali);
    // `[param]` prima SAMO dinamički deo linka. Doslovan segment koji pada u
    // `[param]` je upravo kvar `/pijaca/novi`: ruta postoji, oglas „novi" ne.
    if (prvi === PARAM && /^\[[^.]+\]$/.test(e.name)) return postoji(p, ostali);
    return false;
  });
}

function segmenti(link: string): string[] {
  return link.split(/[?#]/)[0].split("/").filter(Boolean);
}

const LINKOVI = fajlovi(path.join(KOREN, "src")).flatMap((f) => {
  const izvor = fs.readFileSync(f, "utf8");
  return [...izvor.matchAll(/\blink:\s*(["'`])(\/[^"'`]*)\1/g)].map((m) => ({
    fajl: path.relative(KOREN, f),
    link: m[2],
  }));
});

describe("linkovi u obaveštenjima vode na postojeću stranicu", () => {
  it("nađeni su linkovi (test zaista nešto čita)", () => {
    expect(LINKOVI.length).toBeGreaterThan(20);
  });

  it("svaki doslovan link ima page.tsx", () => {
    const losi = LINKOVI.filter(({ link }) => {
      // `${…}` je uvek ceo segment ili vrednost u upitu.
      const seg = segmenti(link.replace(/\$\{[^}]*\}/g, PARAM));
      return !postoji(APP, seg);
    });
    expect(losi).toEqual([]);
  });

  it("stara adresa /pijaca/novi se preusmerava (već poslata obaveštenja)", () => {
    const cfg = fs.readFileSync(path.join(KOREN, "next.config.ts"), "utf8");
    expect(cfg).toMatch(/source:\s*"\/pijaca\/novi",\s*destination:\s*"\/pijaca\/novi-oglas"/);
  });
});
