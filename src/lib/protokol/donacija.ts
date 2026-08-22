import { prisma } from "@/lib/prisma";
import { TransactionType, DonationStatus } from "@/generated/prisma/client";
import { emitujPoen } from "./emisija";
import { izracunajPoenZaDonaciju, nivoZaKumulativ } from "@/lib/donacija-pravila";

// Nivoi, koeficijent i obracun POENA zive u `donacija-pravila.ts` (bez Prisme,
// jer ih uvozi i admin ekran u pretrazivacu). Ovde se re-eksportuju, pa server
// i dalje ima jedan ulaz.
export {
  RANG_TABELA,
  nivoZaKumulativ,
  izracunajPoenZaDonaciju,
} from "@/lib/donacija-pravila";

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
  if (!user.wallet) throw new Error("Korisnik nema zapis u Protokolu.");
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
      `Bonus za donaciju iznos ${poen.toLocaleString("sr-RS")}`, { kljuc: "transakcije.donacija", parametri: { iznos: poen } }
    );
  }

  return { poenEmitted: poen, noviNivo, noviKumulativ, kurs };
}
