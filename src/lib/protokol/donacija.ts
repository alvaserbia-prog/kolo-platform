import { prisma } from "@/lib/prisma";
import { TransactionType, DonationStatus } from "@/generated/prisma/client";
import { emitujPoen } from "./emisija";

/**
 * Nivoi donacija i koeficijent evidencije (Pravilnik o pokroviteljstvu i
 * donacijama v3.7.0, čl. 4) — 18 nivoa.
 *
 * Broj evidentiranih POEN-a = iznos donacije (RSD) × koeficijent evidencije
 * novodostignutog nivoa, primenjen na CELU novu donaciju. Nivo je kumulativan i
 * trajan. `do` je prag kumulativne donacije (RSD) za dati nivo.
 */
export const RANG_TABELA: { nivo: number; do: number; kurs: number }[] = [
  { nivo: 1,  do:           2_000, kurs: 1.00 },
  { nivo: 2,  do:           5_000, kurs: 1.10 },
  { nivo: 3,  do:          10_000, kurs: 1.20 },
  { nivo: 4,  do:          20_000, kurs: 1.30 },
  { nivo: 5,  do:          50_000, kurs: 1.40 },
  { nivo: 6,  do:         100_000, kurs: 1.50 },
  { nivo: 7,  do:         200_000, kurs: 1.60 },
  { nivo: 8,  do:         500_000, kurs: 1.70 },
  { nivo: 9,  do:       1_000_000, kurs: 1.80 },
  { nivo: 10, do:       2_000_000, kurs: 1.90 },
  { nivo: 11, do:       5_000_000, kurs: 2.00 },
  { nivo: 12, do:      10_000_000, kurs: 2.20 },
  { nivo: 13, do:      20_000_000, kurs: 2.40 },
  { nivo: 14, do:      50_000_000, kurs: 2.70 },
  { nivo: 15, do:     100_000_000, kurs: 3.00 },
  { nivo: 16, do:     200_000_000, kurs: 3.50 },
  { nivo: 17, do:     500_000_000, kurs: 4.00 },
  { nivo: 18, do:   1_000_000_000, kurs: 5.00 },
];

/**
 * Vraća nivo i koeficijent evidencije za dati kumulativni RSD iznos.
 * Ispod prvog praga (2.000 RSD) nivo je 0, a koeficijent 1,00 (osnovni).
 */
export function nivoZaKumulativ(kumulativRSD: number): { nivo: number; kurs: number } {
  const rang = [...RANG_TABELA].reverse().find((r) => kumulativRSD >= r.do);
  if (!rang) return { nivo: 0, kurs: 1.00 };
  return { nivo: rang.nivo, kurs: rang.kurs };
}

/**
 * Izračunava POEN za novu donaciju po koeficijentnom modelu (čl. 4):
 * koeficijent novodostignutog nivoa (na osnovu novog kumulativa) primenjuje se
 * na celu novu donaciju. Zaokruživanje: Math.round() (POEN je ceo broj).
 */
export function izracunajPoenZaDonaciju(
  dosadaRSD: number,
  novaRSD: number
): { noviKumulativ: number; noviNivo: number; kurs: number; poen: number } {
  const noviKumulativ = dosadaRSD + novaRSD;
  const { nivo, kurs } = nivoZaKumulativ(noviKumulativ);
  const poen = Math.round(novaRSD * kurs);
  return { noviKumulativ, noviNivo: nivo, kurs, poen };
}

/**
 * Admin evidentira donaciju i emituje POEN iz Protokola (koeficijentni model).
 * Jedna transakcija sa iznosom = nova donacija × koeficijent nivoa.
 */
export async function evidentirajDonaciju(
  userId: string,
  novaRSD: number,
  options?: { existingRecordId?: string; adminId?: string }
): Promise<{ poenEmitted: number; noviNivo: number; noviKumulativ: number; kurs: number }> {
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
  const { noviKumulativ, noviNivo, kurs, poen } = izracunajPoenZaDonaciju(dosadaRSD, novaRSD);

  if (options?.existingRecordId) {
    await prisma.donationRecord.update({
      where: { id: options.existingRecordId },
      data: {
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: noviNivo,
        poenEmitted: poen,
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
        poenEmitted: poen,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options?.adminId ?? null,
      },
    });
  }

  if (poen > 0) {
    await emitujPoen(
      user.wallet.id,
      poen,
      TransactionType.EMISIJA_DONACIJA,
      `Bonus za donaciju iznos ${poen.toLocaleString("sr-RS")}`
    );
  }

  return { poenEmitted: poen, noviNivo, noviKumulativ, kurs };
}
