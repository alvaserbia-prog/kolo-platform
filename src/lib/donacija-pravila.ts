/**
 * Nivoi donacija i koeficijent evidencije — ČISTE funkcije, bez Prisme.
 *
 * Zaseban fajl zato što ovu tabelu čita i admin ekran u pretraživaču. Dok je
 * stajala uz servisne funkcije (`protokol/donacija.ts`, koji uvozi Prismu),
 * klijent nije mogao da je uveze, pa je admin panel držao SOPSTVENU prepisanu
 * tabelu — i ta prepisana tabela je bila pogrešna: nosila je nivoe
 * POKROVITELJSTVA (7 nivoa, fiksan bonus) pod naslovom „Pragovi donacija".
 * Zato se sada čita odavde i ne može da odluta.
 *
 * `protokol/donacija.ts` sve ovo re-eksportuje, pa server ima jedan ulaz.
 */

/**
 * Jedanaest nivoa, koeficijent od 1,00 do 2,00 (Pravilnik o pokroviteljstvu i
 * donacijama, čl. 4). Nivo 1 nema donji prag: pokriva svaku donaciju ispod
 * 5.000 RSD; Nivo 2 počinje na 5.000 RSD.
 *
 * Broj evidentiranih POENA = iznos donacije (RSD) × koeficijent evidencije
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
