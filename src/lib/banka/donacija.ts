import { prisma } from "@/lib/prisma";
import { TransactionType, DonationStatus } from "@/generated/prisma/client";
import { emitujPoen } from "./emisija";

// Pragovi donacija — fiksni POEN bonus kada kumulativ pređe prag (jednom po pragu)
const PRAGOVI_DONACIJA = [
  { prag:    10_000, bonus:    20_000 },
  { prag:    20_000, bonus:    30_000 },
  { prag:    50_000, bonus:    80_000 },
  { prag:   100_000, bonus:   150_000 },
  { prag:   200_000, bonus:   300_000 },
  { prag:   500_000, bonus:   800_000 },
  { prag: 1_000_000, bonus: 1_500_000 },
];

/**
 * Vraća trenutni nivo za dati kumulativni RSD iznos.
 */
export function nivoZaKumulativ(kumulativRSD: number): { nivo: number } {
  const nivo = PRAGOVI_DONACIJA.filter((p) => kumulativRSD >= p.prag).length;
  return { nivo };
}

/**
 * Izračunaj koji pragovi su tek ovom donacijom pređeni i ukupan bonus.
 * Svaki prag se računa samo jednom (dosad < prag <= noviKumulativ).
 */
export function izracunajBonusZaDonaciju(
  dosadaRSD: number,
  novaRSD: number
): { noviKumulativ: number; noviNivo: number; ukupanBonus: number; predjeniNivoi: number[] } {
  const noviKumulativ = dosadaRSD + novaRSD;
  const predjeniNivoi: number[] = [];
  let ukupanBonus = 0;

  for (let i = 0; i < PRAGOVI_DONACIJA.length; i++) {
    const { prag, bonus } = PRAGOVI_DONACIJA[i];
    if (dosadaRSD < prag && noviKumulativ >= prag) {
      predjeniNivoi.push(i + 1);
      ukupanBonus += bonus;
    }
  }

  const noviNivo = PRAGOVI_DONACIJA.filter((p) => noviKumulativ >= p.prag).length;

  return { noviKumulativ, noviNivo, ukupanBonus, predjeniNivoi };
}

/**
 * Admin evidentira donaciju i emituje POEN iz Banke ako su pređeni pragovi.
 * Jedna transakcija sa ukupnim bonusom.
 */
export async function evidentirajDonaciju(
  userId: string,
  novaRSD: number,
  options?: { existingRecordId?: string; adminId?: string }
): Promise<{ poenEmitted: number; noviNivo: number; noviKumulativ: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      donations: {
        where: { status: DonationStatus.CONFIRMED },
        select: { amountRSD: true },
      },
    },
  });

  if (!user) throw new Error("Korisnik nije pronađen.");
  if (!user.wallet) throw new Error("Korisnik nema novčanik.");
  if (!user.verified) throw new Error("Korisnik nije verifikovan.");

  const dosadaRSD = user.donations.reduce((sum, d) => sum + Number(d.amountRSD), 0);
  const { noviKumulativ, noviNivo, ukupanBonus } = izracunajBonusZaDonaciju(dosadaRSD, novaRSD);

  if (options?.existingRecordId) {
    await prisma.donationRecord.update({
      where: { id: options.existingRecordId },
      data: {
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: noviNivo,
        poenEmitted: ukupanBonus,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options.adminId ?? null,
      },
    });
  } else {
    await prisma.donationRecord.create({
      data: {
        userId,
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: noviNivo,
        poenEmitted: ukupanBonus,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options?.adminId ?? null,
      },
    });
  }

  if (ukupanBonus > 0) {
    await emitujPoen(
      user.wallet.id,
      ukupanBonus,
      TransactionType.EMISIJA_DONACIJA,
      `Bonus za donaciju iznos ${ukupanBonus.toLocaleString("sr-RS")}`
    );
  }

  return { poenEmitted: ukupanBonus, noviNivo, noviKumulativ };
}
