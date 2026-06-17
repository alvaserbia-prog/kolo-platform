import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// PUN WIPE prod podataka: TRUNCATE svih tabela osim _prisma_migrations
// (schema + istorija migracija ostaju). Posle ovoga ide `seed-prod.ts`.
// Default: DRY-RUN (samo prikaže šta bi obrisao). Sa --apply stvarno briše.
//
//   DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) npx tsx scripts/reset-prod.ts
//   DATABASE_URL=...                                                          npx tsx scripts/reset-prod.ts --apply

const APPLY = process.argv.includes("--apply");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const host = (process.env.DATABASE_URL ?? "").replace(/^.*@/, "").replace(/\/.*$/, "");
  console.log(`\n=== RESET PROD (${APPLY ? "APPLY — BRIŠE" : "DRY-RUN"}) ===`);
  console.log(`host: ${host}`);

  const rows: { tablename: string }[] = await prisma.$queryRawUnsafe(
    `SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations' ORDER BY tablename`
  );
  const tables = rows.map((r) => r.tablename);

  const [users, tx, wallets, veze] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.wallet.count(),
    prisma.verifikacionaVeza.count(),
  ]);
  console.log(`\nTrenutno: User=${users}, Transaction=${tx}, Wallet=${wallets}, VerifikacionaVeza=${veze}`);
  console.log(`Tabela za pražnjenje (TRUNCATE): ${tables.length}`);
  console.log("  " + tables.join(", "));

  if (!APPLY) {
    console.log("\n[DRY-RUN] Ništa nije obrisano. Pokreni sa --apply za stvarni wipe, pa onda seed-prod.ts.");
    return;
  }

  const list = tables.map((t) => `"public"."${t}"`).join(", ");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);

  const posle = await prisma.user.count();
  console.log(`\n✓ WIPE gotov. User posle: ${posle}. Sledeći korak: pokreni seed-prod.ts.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
