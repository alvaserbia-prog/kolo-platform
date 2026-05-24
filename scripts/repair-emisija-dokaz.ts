/**
 * Repair skripta:
 *   1. Vrati zero-sum balansa na 0 (postavi Protokol balance da pokrije razliku)
 *   2. Za svaku VerifikacionaVeza koja nije imala POEN emisiju, emituj retroaktivno
 */
import "dotenv/config";
import { PrismaClient, TransactionType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BANKA = "banka-singleton";

async function main() {
  console.log("=== Repair dokaza stvarnosti ===\n");

  // 1) Provera zero-sum
  const agg1 = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const sum1 = agg1._sum.balance ?? 0;
  console.log(`Zero-sum pre repair: ${sum1}`);

  if (sum1 !== 0) {
    // Vrati zero-sum: Protokol balance += -sum
    const banka = await prisma.wallet.findUniqueOrThrow({ where: { id: BANKA } });
    const noviBalans = banka.balance - sum1;
    await prisma.wallet.update({
      where: { id: BANKA },
      data: { balance: noviBalans },
    });
    // Evidentiraj korekciju kao transakciju (audit trail)
    await prisma.transaction.create({
      data: {
        fromWalletId: BANKA,
        toWalletId: BANKA,
        amount: 0,
        type: TransactionType.EMISIJA_VERIFIKACIJA,
        description: `[REPAIR] Korekcija zero-sum: pre=${sum1}, nova banka=${noviBalans}`,
      },
    });
    console.log(`  ✓ Protokol balance: ${banka.balance} → ${noviBalans} (korekcija za ${-sum1})`);
  }

  // 2) Pronađi VerifikacionaVeza-e bez emisije POEN
  console.log(`\nProveravam ${(await prisma.verifikacionaVeza.count())} verifikacija...`);
  const veze = await prisma.verifikacionaVeza.findMany({
    include: {
      verifikator: { include: { wallet: true } },
      verifikovani: { include: { wallet: true } },
    },
  });

  let emitovano = 0;
  for (const v of veze) {
    if (!v.verifikator.wallet || !v.verifikovani.wallet) {
      console.warn(
        `  ⚠ ${v.verifikator.pseudonim} → ${v.verifikovani.pseudonim}: nedostaje wallet, preskačem`
      );
      continue;
    }

    // Da li postoji EMISIJA_VERIFIKACIJA tx posle vremenskiZig za oba wallet-a?
    const verifikatorEmisija = await prisma.transaction.findFirst({
      where: {
        toWalletId: v.verifikator.wallet.id,
        type: TransactionType.EMISIJA_VERIFIKACIJA,
        createdAt: { gte: v.vremenskiZig },
        description: { contains: v.verifikovani.pseudonim },
      },
    });
    const verifikovaniEmisija = await prisma.transaction.findFirst({
      where: {
        toWalletId: v.verifikovani.wallet.id,
        type: TransactionType.EMISIJA_VERIFIKACIJA,
        createdAt: { gte: v.vremenskiZig },
        description: { contains: v.verifikator.pseudonim },
      },
    });

    if (verifikatorEmisija && verifikovaniEmisija) {
      console.log(
        `  ⊙ ${v.verifikator.pseudonim} → ${v.verifikovani.pseudonim}: emisija već postoji`
      );
      continue;
    }

    // Retroaktivna emisija (u jednoj transakciji, ne kroz emitujPoen jer hoćemo
    // tačan opis i da ne padne na checkZeroSum)
    console.log(
      `  + ${v.verifikator.pseudonim} → ${v.verifikovani.pseudonim}: emitujem retroaktivno`
    );
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: BANKA },
        data: { balance: { decrement: 2000 } },
      }),
      prisma.wallet.update({
        where: { id: v.verifikator.wallet.id },
        data: { balance: { increment: 1000 } },
      }),
      prisma.wallet.update({
        where: { id: v.verifikovani.wallet.id },
        data: { balance: { increment: 1000 } },
      }),
      prisma.transaction.create({
        data: {
          fromWalletId: BANKA,
          toWalletId: v.verifikator.wallet.id,
          amount: 1000,
          type: TransactionType.EMISIJA_VERIFIKACIJA,
          description: `[REPAIR] Verifikacija ${v.verifikovani.pseudonim} (čl. 7 Pravilnika o dokazu stvarnosti)`,
        },
      }),
      prisma.transaction.create({
        data: {
          fromWalletId: BANKA,
          toWalletId: v.verifikovani.wallet.id,
          amount: 1000,
          type: TransactionType.EMISIJA_VERIFIKACIJA,
          description: `[REPAIR] Primljena verifikacija od ${v.verifikator.pseudonim}`,
        },
      }),
    ]);
    emitovano++;
  }
  console.log(`\n✓ Emitovano za ${emitovano} verifikacija`);

  // 3) Finalna provera
  const agg2 = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const sum2 = agg2._sum.balance ?? 0;
  console.log(`\nZero-sum posle repair: ${sum2}`);
  if (sum2 !== 0) {
    console.warn("⚠ Zero-sum NIJE 0! Neka kasnija operacija je narušila.");
  } else {
    console.log("✓ Zero-sum invarijanta OK");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
