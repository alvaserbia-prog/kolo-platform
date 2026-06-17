import "dotenv/config";
import { PrismaClient, TransactionType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Dodaje svakom osnivaču (jeOsnivac=true) 1000 POEN kao EMISIJA_OSNIVACKI iz
// banke (banka → osnivač), zero-sum. To je POČETNI POEN (starter), NE pravi
// osnivački kanal (120 × 20.000 iz osnivacki.ts).
//
// Idempotentno: preskače osnivača koji već ima EMISIJA_OSNIVACKI transakciju.
// Default: DRY-RUN (samo prikaže). Sa --apply stvarno upisuje.
//
//   DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) npx tsx scripts/dodaj-osnivacki-pocetni.ts
//   DATABASE_URL=...                                                          npx tsx scripts/dodaj-osnivacki-pocetni.ts --apply

const BANKA_ID = "banka-singleton";
const IZNOS = 1000;
const APPLY = process.argv.includes("--apply");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const host = (process.env.DATABASE_URL ?? "").replace(/^.*@/, "").replace(/\/.*$/, "");
  console.log(`\n=== DODAJ OSNIVAČKI POČETNI (${APPLY ? "APPLY — UPISUJE" : "DRY-RUN"}) ===`);
  console.log(`host: ${host}`);

  const banka = await prisma.wallet.findUnique({ where: { id: BANKA_ID } });
  if (!banka) {
    console.error("✗ Banka (Protokol) wallet ne postoji — prekidam.");
    process.exit(1);
  }

  const osnivaci = await prisma.user.findMany({
    where: { jeOsnivac: true },
    include: { wallet: true },
    orderBy: { memberHash: "asc" },
  });
  console.log(`\nOsnivača sa jeOsnivac=true: ${osnivaci.length}`);

  let zaUpis = 0;
  for (const o of osnivaci) {
    if (!o.wallet) {
      console.log(`⚠ ${o.pseudonim}: nema wallet — preskačem`);
      continue;
    }
    const vec = await prisma.transaction.count({
      where: { toWalletId: o.wallet.id, type: TransactionType.EMISIJA_OSNIVACKI },
    });
    if (vec > 0) {
      console.log(`• ${o.pseudonim}: već ima EMISIJA_OSNIVACKI — preskačem`);
      continue;
    }
    zaUpis++;
    if (!APPLY) {
      console.log(`[DRY-RUN] ${o.pseudonim}: +${IZNOS} POEN (EMISIJA_OSNIVACKI iz banke)`);
      continue;
    }
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          fromWalletId: BANKA_ID,
          toWalletId: o.wallet.id,
          amount: IZNOS,
          type: TransactionType.EMISIJA_OSNIVACKI,
          description: "Osnivački doprinos",
        },
      }),
      prisma.wallet.update({ where: { id: o.wallet.id }, data: { balance: { increment: IZNOS } } }),
      prisma.wallet.update({ where: { id: BANKA_ID }, data: { balance: { decrement: IZNOS } } }),
    ]);
    console.log(`✓ ${o.pseudonim}: +${IZNOS} POEN (EMISIJA_OSNIVACKI iz banke)`);
  }

  const bankaPosle = await prisma.wallet.findUnique({ where: { id: BANKA_ID } });
  console.log(`\n${APPLY ? "Upisano" : "Za upis"}: ${zaUpis} osnivač(a). Banka: ${bankaPosle?.balance} (zero-sum).`);
  if (!APPLY) console.log("[DRY-RUN] Ništa nije upisano. Pokreni sa --apply za stvarni upis.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
