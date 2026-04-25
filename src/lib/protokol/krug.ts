import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { TransactionType } from "@/generated/prisma/client";

// Čl. 38 — pragovi rasta krugovi
const BONUS_PRAGOVI = [
  { clanovi: 10,  poen: 100_000 },
  { clanovi: 20,  poen: 200_000 },
  { clanovi: 50,  poen: 500_000 },
  { clanovi: 100, poen: 1_000_000 },
  { clanovi: 200, poen: 2_000_000 },
  { clanovi: 500, poen: 5_000_000 },
];

/**
 * Proveri da li je dostignut novi prag i emituj bonus ako jeste.
 * Poziva se posle svakog novog odobrenog članstva.
 */
export async function proveriIEmitujBonusPrag(krugId: string) {
  const krug = await prisma.krug.findUnique({
    where: { id: krugId },
    include: { wallet: true },
  });
  if (!krug?.wallet) return;

  const brojClanova = await prisma.krugClanstvo.count({
    where: { krugId, leftAt: null },
  });

  for (const prag of BONUS_PRAGOVI) {
    if (brojClanova !== prag.clanovi) continue;

    // Proveri da li je ovaj prag već isplaćen
    const vec = await prisma.krugBonusLog.findFirst({
      where: { krugId, threshold: prag.clanovi },
    });
    if (vec) continue;

    await emitujPoen(
      krug.wallet.id,
      prag.poen,
      TransactionType.EMISIJA_KRUG_BONUS,
      `Bonus krugovi "${krug.name}" — ${prag.clanovi} članova`
    );

    await prisma.krugBonusLog.create({
      data: { krugId, threshold: prag.clanovi, amount: prag.poen },
    });
  }
}
