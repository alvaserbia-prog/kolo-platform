/**
 * Jednokratno čišćenje osetljivih podataka iz ProgramEnrollment.metadata
 * (minimizacija — Pravilnik o programima podrške čl. 14, Politika privatnosti 4.6).
 *
 * Uklanja iz POSTOJEĆIH zapisa polja koja se više ne prikupljaju:
 *   - PODRSKA_MAJKAMA: ime svakog deteta (zadržava se samo datumRodjenja)
 *   - POSEBNA_BRIGA:   slobodan tekst `resenjeInvaliditet` (zamenjuje se praznim
 *                      datumResenja/datumIsteka — datumi se ne mogu rekonstruisati,
 *                      pa korisnik po potrebi ponovo unese; osetljiv tekst se briše)
 *
 * BEZBEDNO: podrazumevano je DRY-RUN (samo izveštava). Za stvarni upis pokreni sa
 * `--apply`. Pokreni ZASEBNO za svako okruženje (test/prod) sa odgovarajućim
 * DATABASE_URL.
 *
 *   npx tsx scripts/ocisti-program-metadata.ts            # dry-run
 *   npx tsx scripts/ocisti-program-metadata.ts --apply    # upis
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const APPLY = process.argv.includes("--apply");

async function main() {
  console.log(`=== Čišćenje ProgramEnrollment.metadata (${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`);
  let majkeOcisceno = 0;
  let brigaOcisceno = 0;

  // 1) PODRSKA_MAJKAMA — ukloni ime deteta
  const majke = await prisma.programEnrollment.findMany({ where: { type: "PODRSKA_MAJKAMA" } });
  for (const e of majke) {
    const m = e.metadata as { deca?: { ime?: string; datumRodjenja?: string }[] } | null;
    if (!m?.deca?.length) continue;
    const imaIme = m.deca.some((d) => "ime" in (d ?? {}));
    if (!imaIme) continue;
    const novo = { deca: m.deca.map((d) => ({ datumRodjenja: d.datumRodjenja ?? "" })) };
    console.log(`  [majke] enrollment ${e.id}: uklanjam imena za ${m.deca.length} dece`);
    if (APPLY) await prisma.programEnrollment.update({ where: { id: e.id }, data: { metadata: novo } });
    majkeOcisceno++;
  }

  // 2) POSEBNA_BRIGA — ukloni slobodan tekst resenjeInvaliditet
  const briga = await prisma.programEnrollment.findMany({ where: { type: "POSEBNA_BRIGA" } });
  for (const e of briga) {
    const m = e.metadata as { resenjeInvaliditet?: string; datumResenja?: string; datumIsteka?: string } | null;
    if (!m || !("resenjeInvaliditet" in m)) continue; // već u novom obliku
    const novo = {
      datumResenja: typeof m.datumResenja === "string" ? m.datumResenja : "",
      datumIsteka: typeof m.datumIsteka === "string" ? m.datumIsteka : "",
    };
    console.log(`  [briga] enrollment ${e.id}: brišem slobodan tekst rešenja`);
    if (APPLY) await prisma.programEnrollment.update({ where: { id: e.id }, data: { metadata: novo } });
    brigaOcisceno++;
  }

  console.log(`\nRezime: majke=${majkeOcisceno}, posebna_briga=${brigaOcisceno}`);
  console.log(APPLY ? "Izmene upisane." : "DRY-RUN — ništa nije upisano. Pokreni sa --apply za upis.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
