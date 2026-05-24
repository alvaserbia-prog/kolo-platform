/**
 * Osnivacki doprinos (Pravilnik o osnivackom doprinosu v3.7.0)
 *
 * Pravila:
 * - Gornja granica: 2.400.000 POEN (120 koraka x 20.000)
 * - Korak se aktivira svaki put kad ukupan POEN u sistemu predje prag od 100k
 * - Pragovi: 100.000, 200.000, 300.000, ..., 12.000.000
 * - Kanal se trajno zatvara na 120. koraku
 *
 * NAPOMENA: Lista osnivaca i udeli se popunjavaju kroz admin interfejs
 * (interni akt Fondacije, cl. 12). Bez popunjenih osnivaca, kanal je
 * strukturalno spreman ali nista ne emituje.
 */

import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { TransactionType } from "@/generated/prisma/client";

const BANKA_WALLET_ID = "banka-singleton";

export const ITERATION_LIMIT = 120;
export const KORAK_IZNOS = 20_000;
export const GORNJA_GRANICA = ITERATION_LIMIT * KORAK_IZNOS; // 2.400.000
export const PRAG_SKOK = 100_000;

/**
 * Ukupan POEN u sistemu = apsolutna vrednost Protokol balansa (jer je zero-sum).
 * Ekvivalentno: suma svih korisnickih + Krug balansa.
 */
export async function izracunajUkupanPoen(): Promise<number> {
  const protokol = await prisma.wallet.findUnique({
    where: { id: BANKA_WALLET_ID },
    select: { balance: true },
  });
  if (!protokol) return 0;
  return Math.abs(protokol.balance);
}

export interface KanalStatus {
  ukupnoEvidentirano: number;
  brojKoraka: number;
  zatvoren: boolean;
  zatvorenAt: Date | null;
  poslednjiPrag: number;
  gornjaGranica: number;
  preostalo: number;
  procenatIskoriscenja: number; // 0-100
  ukupanPoenUSistemu: number;
  sledeciPrag: number;
}

export async function dohvatiStatusKanala(): Promise<KanalStatus> {
  const [kanal, ukupanPoen] = await Promise.all([
    prisma.osnivackiKanal.findUnique({ where: { id: "singleton" } }),
    izracunajUkupanPoen(),
  ]);

  if (!kanal) {
    throw new Error("OsnivackiKanal singleton nije inicijalizovan.");
  }

  return {
    ukupnoEvidentirano: kanal.ukupnoEvidentirano,
    brojKoraka: kanal.brojKoraka,
    zatvoren: kanal.zatvoren,
    zatvorenAt: kanal.zatvorenAt,
    poslednjiPrag: kanal.poslednjiPrag,
    gornjaGranica: GORNJA_GRANICA,
    preostalo: GORNJA_GRANICA - kanal.ukupnoEvidentirano,
    procenatIskoriscenja: Math.round((kanal.ukupnoEvidentirano / GORNJA_GRANICA) * 10000) / 100,
    ukupanPoenUSistemu: ukupanPoen,
    sledeciPrag: kanal.poslednjiPrag + PRAG_SKOK,
  };
}

/**
 * Provera i evidentiranje koraka.
 * Poziva se rucno (admin) ili iz noćnog cron-a.
 * Vraca koliko koraka je evidentirano u ovom pozivu (moze biti vise od 1 ako je opticaj naglo skocio).
 */
export async function proveriIEvidentirajKorak(): Promise<{
  evidentiranoKoraka: number;
  zatvoren: boolean;
  poruka: string;
}> {
  const kanal = await prisma.osnivackiKanal.findUnique({ where: { id: "singleton" } });
  if (!kanal) throw new Error("OsnivackiKanal nije inicijalizovan.");

  if (kanal.zatvoren) {
    return { evidentiranoKoraka: 0, zatvoren: true, poruka: "Kanal je trajno zatvoren." };
  }

  const osnivaci = await prisma.osnivac.findMany({ orderBy: { redniBroj: "asc" } });
  if (osnivaci.length === 0) {
    return { evidentiranoKoraka: 0, zatvoren: false, poruka: "Nema definisanih osnivaca." };
  }

  // Provera da zbir udela = 1
  const zbirBrojilaca = osnivaci.reduce((s, o) => s + o.udeoBrojilac, 0);
  const imenilac = osnivaci[0].udeoImenilac;
  const sviIstiImenilac = osnivaci.every((o) => o.udeoImenilac === imenilac);
  if (!sviIstiImenilac || zbirBrojilaca !== imenilac) {
    return {
      evidentiranoKoraka: 0,
      zatvoren: false,
      poruka: `Udeli osnivaca nisu validni: zbir = ${zbirBrojilaca}/${imenilac}, mora biti ${imenilac}/${imenilac}.`,
    };
  }

  let trenutniKoraci = kanal.brojKoraka;
  let trenutniPrag = kanal.poslednjiPrag;
  let evidentirano = 0;

  while (trenutniKoraci < ITERATION_LIMIT) {
    const ukupanPoen = await izracunajUkupanPoen();
    const sledeciPrag = trenutniPrag + PRAG_SKOK;

    if (ukupanPoen < sledeciPrag) break; // jos nije dostignut sledeci prag

    // Evidentiraj korak: kreira KorakLog i emituje POEN svakom osnivacu
    const korakLog = await prisma.osnivackiKorakLog.create({
      data: {
        brojKoraka: trenutniKoraci + 1,
        prag: sledeciPrag,
        ukupanPoenUSistemu: ukupanPoen,
        iznosKoraka: KORAK_IZNOS,
      },
    });

    // Emituj POEN svakom osnivacu prema udelu
    for (const osnivac of osnivaci) {
      const iznos = Math.floor((KORAK_IZNOS * osnivac.udeoBrojilac) / osnivac.udeoImenilac);
      if (iznos <= 0) continue;

      const wallet = await prisma.wallet.findUnique({ where: { userId: osnivac.userId } });
      if (!wallet) {
        throw new Error(`Wallet ne postoji za osnivaca ${osnivac.userId}.`);
      }

      const rezultat = await emitujPoen(
        wallet.id,
        iznos,
        TransactionType.EMISIJA_OSNIVACKI,
        `Osnivacki doprinos — korak ${trenutniKoraci + 1}/${ITERATION_LIMIT}`,
      );

      await prisma.osnivackiKorakEmisija.create({
        data: {
          korakLogId: korakLog.id,
          osnivacId: osnivac.id,
          iznosPoen: iznos,
          transactionId: rezultat.transaction.id,
        },
      });
    }

    trenutniKoraci += 1;
    trenutniPrag = sledeciPrag;
    evidentirano += 1;
  }

  // Update singleton kanala
  const zatvoren = trenutniKoraci >= ITERATION_LIMIT;
  await prisma.osnivackiKanal.update({
    where: { id: "singleton" },
    data: {
      brojKoraka: trenutniKoraci,
      poslednjiPrag: trenutniPrag,
      ukupnoEvidentirano: trenutniKoraci * KORAK_IZNOS,
      zatvoren,
      zatvorenAt: zatvoren ? new Date() : undefined,
    },
  });

  return {
    evidentiranoKoraka: evidentirano,
    zatvoren,
    poruka: evidentirano > 0
      ? `Evidentirano ${evidentirano} korak(a). Trenutni broj koraka: ${trenutniKoraci}/${ITERATION_LIMIT}.`
      : "Nije dostignut nijedan novi prag.",
  };
}
