/**
 * Fondacija — transparentnost sredstava i Zastitni veto (Pravilnik o KOLO sistemu cl. 71, v3.7.0)
 *
 * Sredstva Fondacije = priliv (donacije + pokroviteljstvo, oba u RSD) - odliv (troskovi)
 * Veto aktivan ako Protokol balansa < -1.000.000 POEN I trajnoUgasen = false
 * Veto se trajno gasi kad sredstva Fondacije >= 3 × prosecnih mesecnih operativnih troskova
 *
 * Inicijalne vrednosti = 0 (po dogovoru sa vlasnikom 2026-05-24).
 */

import { prisma } from "@/lib/prisma";

const PROTOKOL_WALLET_ID = "banka-singleton";
const VETO_PRAG_POEN = -1_000_000;
const PROSEK_PERIOD_MESECI = 6; // koliko meseci se gleda za prosek troskova

export interface FondacijaSaldo {
  ukupanPriliv: number;        // RSD
  donacije: number;            // RSD (potvrdjene)
  pokroviteljstvo: number;     // RSD
  ukupanOdliv: number;         // RSD (sumirani troskovi)
  saldo: number;               // RSD (priliv - odliv)
}

export interface VetoStatus {
  aktivan: boolean;
  trajnoUgasen: boolean;
  datumAktivacije: Date | null;
  datumGasenja: Date | null;
  protokolBalans: number;
  prag: number;
  saldoFondacije: number;
  prosekMesecnihTroskova: number;
  pragZaGasenje: number;       // 3 × prosek
}

export async function dohvatiSaldoFondacije(): Promise<FondacijaSaldo> {
  const [donacijeAgg, pokroviteljstvoAgg, troskoviAgg] = await Promise.all([
    prisma.donationRecord.aggregate({
      where: { status: "CONFIRMED" },
      _sum: { amountRSD: true },
    }),
    prisma.pokroviteljDoprinos.aggregate({
      _sum: { rsdIznos: true },
    }),
    prisma.fondacijaTrosak.aggregate({
      _sum: { iznosRSD: true },
    }),
  ]);

  const donacije = Number(donacijeAgg._sum.amountRSD ?? 0);
  const pokroviteljstvo = Number(pokroviteljstvoAgg._sum.rsdIznos ?? 0);
  const ukupanOdliv = Number(troskoviAgg._sum.iznosRSD ?? 0);
  const ukupanPriliv = donacije + pokroviteljstvo;

  return {
    ukupanPriliv,
    donacije,
    pokroviteljstvo,
    ukupanOdliv,
    saldo: ukupanPriliv - ukupanOdliv,
  };
}

/**
 * Prosek mesecnih troskova racuna se iz poslednjih N meseci (default 6).
 * Ako nema dovoljno meseci sa zapisima, vraca 0 (dok se ne akumulira istorija).
 */
export async function dohvatiProsekMesecnihTroskova(brojMeseci = PROSEK_PERIOD_MESECI): Promise<number> {
  const danas = new Date();
  const pocetak = new Date(danas);
  pocetak.setMonth(pocetak.getMonth() - brojMeseci);

  const troskovi = await prisma.fondacijaTrosak.aggregate({
    where: { datum: { gte: pocetak } },
    _sum: { iznosRSD: true },
  });

  const ukupno = Number(troskovi._sum.iznosRSD ?? 0);
  if (ukupno === 0) return 0;
  return ukupno / brojMeseci;
}

/**
 * Azurira singleton SistemskiVeto na osnovu trenutnog stanja:
 * - aktivan = (Protokol < -1M) I (!trajnoUgasen)
 * - trajnoUgasen postaje true ako saldoFondacije >= 3 × prosek (jednosmerni flag)
 */
export async function azurirajVetoStatus(): Promise<VetoStatus> {
  const [veto, protokol, saldo, prosek] = await Promise.all([
    prisma.sistemskiVeto.findUnique({ where: { id: "singleton" } }),
    prisma.wallet.findUnique({ where: { id: PROTOKOL_WALLET_ID }, select: { balance: true } }),
    dohvatiSaldoFondacije(),
    dohvatiProsekMesecnihTroskova(),
  ]);

  if (!veto) throw new Error("SistemskiVeto singleton nije inicijalizovan.");

  const protokolBalans = protokol?.balance ?? 0;
  const pragZaGasenje = prosek * 3;

  let trajnoUgasen = veto.trajnoUgasen;
  let datumGasenja = veto.datumGasenja;

  // Provera trajnog gasenja (jednosmerni flag)
  if (!trajnoUgasen && prosek > 0 && saldo.saldo >= pragZaGasenje) {
    trajnoUgasen = true;
    datumGasenja = new Date();
  }

  // Veto je aktivan samo ako jos nije trajno ugasen I Protokol je ispod praga
  const aktivan = !trajnoUgasen && protokolBalans < VETO_PRAG_POEN;

  let datumAktivacije = veto.datumAktivacije;
  if (aktivan && !veto.aktivan) {
    datumAktivacije = new Date();
  }

  await prisma.sistemskiVeto.update({
    where: { id: "singleton" },
    data: { aktivan, trajnoUgasen, datumAktivacije, datumGasenja },
  });

  return {
    aktivan,
    trajnoUgasen,
    datumAktivacije,
    datumGasenja,
    protokolBalans,
    prag: VETO_PRAG_POEN,
    saldoFondacije: saldo.saldo,
    prosekMesecnihTroskova: prosek,
    pragZaGasenje,
  };
}

export async function dohvatiVetoStatus(): Promise<VetoStatus> {
  // Ne update-uje, samo izvestava trenutno stanje + izracunate kontekstne vrednosti
  const [veto, protokol, saldo, prosek] = await Promise.all([
    prisma.sistemskiVeto.findUnique({ where: { id: "singleton" } }),
    prisma.wallet.findUnique({ where: { id: PROTOKOL_WALLET_ID }, select: { balance: true } }),
    dohvatiSaldoFondacije(),
    dohvatiProsekMesecnihTroskova(),
  ]);

  if (!veto) throw new Error("SistemskiVeto singleton nije inicijalizovan.");

  return {
    aktivan: veto.aktivan,
    trajnoUgasen: veto.trajnoUgasen,
    datumAktivacije: veto.datumAktivacije,
    datumGasenja: veto.datumGasenja,
    protokolBalans: protokol?.balance ?? 0,
    prag: VETO_PRAG_POEN,
    saldoFondacije: saldo.saldo,
    prosekMesecnihTroskova: prosek,
    pragZaGasenje: prosek * 3,
  };
}
