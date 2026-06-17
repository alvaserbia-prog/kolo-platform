import "dotenv/config";
import { PrismaClient, TransactionType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Preimenuje opis EMISIJA_OSNIVACKI transakcija: "Osnivački doprinos" → "Osnivanje".
// Ne dira iznose, walete ni zero-sum — samo description.
// Default: DRY-RUN. Sa --apply stvarno menja.
//
//   DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) npx tsx scripts/preimenuj-osnivacki-opis.ts
//   DATABASE_URL=...                                                          npx tsx scripts/preimenuj-osnivacki-opis.ts --apply

const STARI = "Osnivački doprinos";
const NOVI = "Osnivanje";
const APPLY = process.argv.includes("--apply");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const host = (process.env.DATABASE_URL ?? "").replace(/^.*@/, "").replace(/\/.*$/, "");
  console.log(`\n=== PREIMENUJ OPIS OSNIVAČKI (${APPLY ? "APPLY — MENJA" : "DRY-RUN"}) ===`);
  console.log(`host: ${host}`);
  console.log(`"${STARI}" → "${NOVI}"`);

  const pogodjene = await prisma.transaction.findMany({
    where: { type: TransactionType.EMISIJA_OSNIVACKI, description: STARI },
    select: { id: true, amount: true, toWalletId: true },
  });
  console.log(`\nPogođenih transakcija: ${pogodjene.length}`);
  for (const t of pogodjene) console.log(`  ${t.id}  +${t.amount} → wallet ${t.toWalletId}`);

  if (!APPLY) {
    console.log("\n[DRY-RUN] Ništa nije promenjeno. Pokreni sa --apply.");
    return;
  }

  const res = await prisma.transaction.updateMany({
    where: { type: TransactionType.EMISIJA_OSNIVACKI, description: STARI },
    data: { description: NOVI },
  });
  console.log(`\n✓ Promenjeno opisa: ${res.count}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
