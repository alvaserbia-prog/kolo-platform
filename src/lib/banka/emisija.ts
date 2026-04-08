import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

const BANKA_WALLET_ID = "banka-singleton";

// Nagrada za preporuku po broju verifikovanih preporučenih (Prilog 1, tačka 3)
const PREPORUKA_TABELA: { do: number; poen: number }[] = [
  { do: 5,        poen: 1_000 },
  { do: 10,       poen: 2_000 },
  { do: 15,       poen: 3_000 },
  { do: 20,       poen: 4_000 },
  { do: 30,       poen: 5_000 },
  { do: 40,       poen: 6_000 },
  { do: 50,       poen: 7_000 },
  { do: 70,       poen: 8_000 },
  { do: 100,      poen: 9_000 },
  { do: Infinity, poen: 10_000 },
];

export function preporukaNagrada(brojVerifikovanih: number): number {
  const red = PREPORUKA_TABELA.find((r) => brojVerifikovanih <= r.do);
  return red?.poen ?? 15_000;
}

/**
 * Emituje POEN iz Banke na wallet korisnika.
 * Banka ide u minus, korisnik prima POEN.
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
    // Banka ide u minus
    const banka = await tx.wallet.update({
      where: { id: BANKA_WALLET_ID },
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
        fromWalletId: BANKA_WALLET_ID,
        toWalletId,
        amount,
        type,
        description,
      },
    });

    if (process.env.NODE_ENV !== "production") {
      await checkZeroSum(tx);
    }

    return { banka, wallet, transaction: tx_ };
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
