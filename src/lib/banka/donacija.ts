import { prisma } from "@/lib/prisma";
import { TransactionType, DonationStatus } from "@/generated/prisma/client";
import { emitujPoen } from "./emisija";

// ─── Rang tabela — Prilog 1, tačka 1 ─────────────────────────────────────────
// Kumulativ dostigne ovaj prag → ovaj nivo/kurs važi za celu novu donaciju

const RANG_TABELA = [
  { do: 2_000,           nivo: 1,  kurs: 1.00 },
  { do: 5_000,           nivo: 2,  kurs: 1.10 },
  { do: 10_000,          nivo: 3,  kurs: 1.20 },
  { do: 20_000,          nivo: 4,  kurs: 1.30 },
  { do: 50_000,          nivo: 5,  kurs: 1.40 },
  { do: 100_000,         nivo: 6,  kurs: 1.50 },
  { do: 200_000,         nivo: 7,  kurs: 1.60 },
  { do: 500_000,         nivo: 8,  kurs: 1.70 },
  { do: 1_000_000,       nivo: 9,  kurs: 1.80 },
  { do: 2_000_000,       nivo: 10, kurs: 1.90 },
  { do: 5_000_000,       nivo: 11, kurs: 2.00 },
  { do: 10_000_000,      nivo: 12, kurs: 2.20 },
  { do: 20_000_000,      nivo: 13, kurs: 2.40 },
  { do: 50_000_000,      nivo: 14, kurs: 2.70 },
  { do: 100_000_000,     nivo: 15, kurs: 3.00 },
  { do: 200_000_000,     nivo: 16, kurs: 3.50 },
  { do: 500_000_000,     nivo: 17, kurs: 4.00 },
  { do: Infinity,        nivo: 18, kurs: 5.00 },
] as const;

export function nivoZaKumulativ(kumulativRSD: number): { nivo: number; kurs: number } {
  return RANG_TABELA.find((r) => kumulativRSD <= r.do) ?? RANG_TABELA[RANG_TABELA.length - 1];
}

/**
 * Mehanizam (Prilog 1):
 * stare donacije + nova donacija = novi kumulativ → odredi nivo → primeni kurs na celu novu donaciju.
 */
export function izracunajPoenZaDonaciju(
  dosadaRSD: number,
  novaRSD: number
): { noviKumulativ: number; nivo: number; kurs: number; poen: number } {
  const noviKumulativ = dosadaRSD + novaRSD;
  const { nivo, kurs } = nivoZaKumulativ(noviKumulativ);
  const poen = Math.floor(novaRSD * kurs);
  return { noviKumulativ, nivo, kurs, poen };
}

/**
 * Admin evidentira donaciju i emituje POEN iz Banke.
 * Ako je existingRecordId zadato — ažurira taj PENDING zapis umesto kreiranja novog.
 */
export async function evidentirajDonaciju(
  userId: string,
  novaRSD: number,
  options?: { existingRecordId?: string; adminId?: string }
): Promise<{ poenEmitted: number; nivo: number; kurs: number; noviKumulativ: number }> {
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
  const { noviKumulativ, nivo, kurs, poen } = izracunajPoenZaDonaciju(dosadaRSD, novaRSD);

  if (poen <= 0) throw new Error("Iznos donacije mora biti pozitivan.");

  if (options?.existingRecordId) {
    // Ažuriraj existing PENDING zapis
    await prisma.donationRecord.update({
      where: { id: options.existingRecordId },
      data: {
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: nivo,
        poenEmitted: poen,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options.adminId ?? null,
      },
    });
  } else {
    // Kreiraj novi CONFIRMED zapis
    await prisma.donationRecord.create({
      data: {
        userId,
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: nivo,
        poenEmitted: poen,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options?.adminId ?? null,
      },
    });
  }

  await emitujPoen(
    user.wallet.id,
    poen,
    TransactionType.EMISIJA_DONACIJA,
    `Donacija ${novaRSD.toLocaleString("sr-RS")} RSD — nivo ${nivo} (×${kurs.toFixed(2)})`
  );

  return { poenEmitted: poen, nivo, kurs, noviKumulativ };
}
