import { prisma } from "@/lib/prisma";
import { TransactionType, DonationStatus } from "@/generated/prisma/client";
import { emitujPoen } from "./emisija";

/**
 * Nivoi donacija i koeficijent evidencije — 2 nivoa po pragu kumulativne
 * donacije od 5.000 RSD:
 *   - Nivo 1: kumulativ < 5.000 RSD → koeficijent 1,00×
 *   - Nivo 2: kumulativ ≥ 5.000 RSD → koeficijent 1,10×
 *
 * Broj evidentiranih POEN-a = iznos donacije (RSD) × koeficijent evidencije
 * novodostignutog nivoa, primenjen na CELU novu donaciju. Nivo je kumulativan i
 * trajan. `do` je donji prag kumulativne donacije (RSD) za dati nivo.
 */
export const RANG_TABELA: { nivo: number; do: number; kurs: number }[] = [
  { nivo: 1, do:     0, kurs: 1.00 },
  { nivo: 2, do: 5_000, kurs: 1.10 },
];

/**
 * Vraća nivo i koeficijent evidencije za dati kumulativni RSD iznos.
 * Svaki iznos (uključujući 0) je bar Nivo 1 (koeficijent 1,00).
 */
export function nivoZaKumulativ(kumulativRSD: number): { nivo: number; kurs: number } {
  const rang = [...RANG_TABELA].reverse().find((r) => kumulativRSD >= r.do);
  if (!rang) return { nivo: 1, kurs: 1.00 };
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
 *
 * Javna vs anonimna donacija (Pravilnik o pokroviteljstvu i donacijama čl. 3, 5):
 * - `javno = true` (podrazumevano): evidentira se POEN; ime i prezime donatora
 *   postaju javni (postavlja se `prikaziPunoIme`). Ulazi u kumulativni nivo.
 * - `javno = false` (anonimna): POEN se NE evidentira (0), zapis NE ulazi u
 *   kumulativni nivo, ime ostaje skriveno.
 *
 * Napomena: provera „javna donacija zahteva uneto ime i prezime" radi se na
 * ulaznim tačkama (kartično `zapocni`, admin ruta) PRE naplate/potvrde. Ovde se
 * NE baca greška ako ime nedostaje — da naplaćena donacija ne ostane bez POEN-a;
 * `prikaziPunoIme` se postavlja samo kad ime postoji.
 */
export async function evidentirajDonaciju(
  userId: string,
  novaRSD: number,
  options?: { existingRecordId?: string; adminId?: string; javno?: boolean }
): Promise<{ poenEmitted: number; noviNivo: number; noviKumulativ: number; kurs: number }> {
  const javno = options?.javno ?? true;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      podaci: { select: { punoIme: true } },
      donations: {
        // Samo javne donacije ulaze u kumulativni nivo (anonimne ne nose POEN).
        where: { status: DonationStatus.CONFIRMED, javno: true },
        select: { amountRSD: true },
      },
    },
  });

  if (!user) throw new Error("Korisnik nije pronađen.");
  if (!user.wallet) throw new Error("Korisnik nema novčanik.");
  if (!user.verified) throw new Error("Korisnik nije verifikovan.");

  const dosadaRSD = user.donations.reduce((sum, d) => sum + Number(d.amountRSD), 0);
  const izracun = izracunajPoenZaDonaciju(dosadaRSD, novaRSD);

  // Anonimna donacija ne nosi POEN i ne pomera kumulativni nivo.
  const poen = javno ? izracun.poen : 0;
  const noviKumulativ = javno ? izracun.noviKumulativ : dosadaRSD;
  const noviNivo = javno ? izracun.noviNivo : nivoZaKumulativ(dosadaRSD).nivo;
  const kurs = javno ? izracun.kurs : nivoZaKumulativ(dosadaRSD).kurs;

  if (options?.existingRecordId) {
    await prisma.donationRecord.update({
      where: { id: options.existingRecordId },
      data: {
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: noviNivo,
        poenEmitted: poen,
        javno,
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
        javno,
        status: DonationStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedById: options?.adminId ?? null,
      },
    });
  }

  // Javna donacija: ime i prezime postaju javni (uslov za POEN, čl. 5a).
  if (javno && user.podaci?.punoIme && user.podaci.punoIme.trim()) {
    await prisma.userPodaci.update({
      where: { userId },
      data: { prikaziPunoIme: true },
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
