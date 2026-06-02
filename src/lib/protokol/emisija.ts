import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

const PROTOKOL_WALLET_ID = "banka-singleton";

/**
 * Emituje POEN iz Protokola na wallet korisnika.
 * Protokol ide u minus, korisnik prima POEN.
 * Mora se zvati unutar prisma.$transaction ako je deo šire operacije.
 */
export async function emitujPoen(
  toWalletId: string,
  amount: number,
  type: TransactionType,
  description?: string
) {
  if (amount <= 0) throw new Error("Iznos emisije mora biti pozitivan.");

  return prisma.$transaction(async (tx) => {
    // Protokol ide u minus
    const protokol = await tx.wallet.update({
      where: { id: PROTOKOL_WALLET_ID },
      data: { balance: { decrement: amount } },
    });

    // Korisnik prima POEN
    const wallet = await tx.wallet.update({
      where: { id: toWalletId },
      data: { balance: { increment: amount } },
    });

    // Evidentira transakciju
    const tx_ = await tx.transaction.create({
      data: {
        fromWalletId: PROTOKOL_WALLET_ID,
        toWalletId,
        amount,
        type,
        description,
      },
    });

    if (process.env.NODE_ENV !== "production") {
      await checkZeroSum(tx);
    }

    return { protokol, wallet, transaction: tx_ };
  });
}

/**
 * Zero-sum provera: zbir svih balansa mora biti 0.
 */
async function checkZeroSum(tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) {
  const result = await tx.wallet.aggregate({ _sum: { balance: true } });
  const sum = result._sum.balance ?? 0;
  if (sum !== 0) {
    throw new Error(`Zero-sum narušen! Zbir balansa: ${sum}`);
  }
}
