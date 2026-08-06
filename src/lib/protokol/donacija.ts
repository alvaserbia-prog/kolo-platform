import { prisma } from "@/lib/prisma";
import { TransactionType, DonationStatus } from "@/generated/prisma/client";
import { emitujPoen } from "./emisija";

/**
 * Nivoi donacija i koeficijent evidencije — 11 nivoa, koeficijent 1,00× →
 * maks 2,00×. Nivo 1 nema donji prag: pokriva svaku donaciju ispod 5.000 RSD;
 * Nivo 2 počinje na 5.000 RSD.
 *
 * Broj evidentiranih POEN-a = iznos donacije (RSD) × koeficijent evidencije
 * novodostignutog nivoa, primenjen na CELU novu donaciju. Nivo je kumulativan i
 * trajan. `do` je donji prag kumulativne donacije (RSD) za dati nivo.
 */
export const RANG_TABELA: { nivo: number; do: number; kurs: number }[] = [
  { nivo: 1,  do:               0, kurs: 1.00 },
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
 *   SNIMA se na zapis (`donatorIme`) kao trajan podatak i prikazuje u listi
 *   donacija. Ulazi u kumulativni nivo.
 * - `javno = false` (anonimna): POEN se NE evidentira (0), zapis NE ulazi u
 *   kumulativni nivo, ime se ne beleži.
 *
 * Napomena: provera „javna donacija zahteva uneto ime i prezime" radi se na
 * ulaznim tačkama (kartično `zapocni`, admin ruta) PRE naplate/potvrde. Ovde se
 * NE baca greška ako ime nedostaje — da naplaćena donacija ne ostane bez POEN-a;
 * `donatorIme` se snima samo kad ime postoji.
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
        // Tekući zapis (existingRecordId) se ISKLJUČUJE iz kumulativa — kartični tok
        // ga atomski postavi na CONFIRMED PRE ove funkcije (anti-dupli-callback), pa bi
        // se inače duplo brojao za izračun nivoa.
        where: {
          status: DonationStatus.CONFIRMED,
          javno: true,
          ...(options?.existingRecordId ? { id: { not: options.existingRecordId } } : {}),
        },
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

  // Trajan snapshot imena za javnu donaciju (čl. 5a) — ne menja se kasnije.
  const donatorIme = javno ? user.podaci?.punoIme?.trim() || null : null;

  if (options?.existingRecordId) {
    await prisma.donationRecord.update({
      where: { id: options.existingRecordId },
      data: {
        amountRSD: novaRSD,
        cumulativeRSD: noviKumulativ,
        level: noviNivo,
        poenEmitted: poen,
        javno,
        donatorIme,
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
        donatorIme,
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
