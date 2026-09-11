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
/**
 * Prag iznad kojeg se uz donaciju dokumentuje poreklo sredstava i uz ugovor ide
 * izjava donatora (Pravilnik o pokroviteljstvu i donacijama, glava IV, cl. 13b
 * t. 3 i cl. 5b). Meri se iznos POJEDINACNE donacije ili zbir donacija istog
 * donatora u poslednjih dvanaest meseci — sta pre pređe prag.
 *
 * 🔴 Broj NIJE u aktu, i to je namerno: po cl. 13b st. 2 prag utvrdjuje odluka
 * Upravnog odbora, jer se iznosi i propisi na koje se oslanja menjaju nezavisno
 * od pravilnika (isto pravilo kao kod poreskih stopa). Ovde stoji vrednost te
 * odluke; menja se izmenom OVE konstante, bez diranja akta.
 *
 * Zasto bas ovoliko: zakonski prag identifikacije kod povremenih transakcija je
 * 15.000 EUR, dakle znatno vise. Fondacija svoj prag drzi ispod zakonskog, da
 * mera ima smisla, a dovoljno visoko da obican donator izjavu nikad ne vidi.
 */
export const PRAG_PROVERE_POREKLA_RSD = 500_000;

/** Period u kome se donacije istog donatora sabiraju za potrebe praga (meseci). */
export const PROZOR_PRAGA_MESECI = 12;

/**
 * Da li za ovu donaciju treba izjava o poreklu sredstava. `zbir12m` je zbir
 * ranijih donacija istog donatora u prozoru, BEZ tekuce.
 */
export function trebaIzjavaOPoreklu(iznosRSD: number, zbir12m: number): boolean {
  if (!Number.isFinite(iznosRSD) || !Number.isFinite(zbir12m)) return true;
  return iznosRSD + Math.max(0, zbir12m) > PRAG_PROVERE_POREKLA_RSD;
}

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
 * 🔴 Tabela se NASTAVLJA BEZ KRAJA (odluka vlasnika, 2026-09-08). `RANG_TABELA`
 * gore je samo ZAKLJUČAN deo — jedanaest nivoa koji su objavljeni u aktu i koje
 * čuva test. Iznad njih pragovi idu istim nizom 1–2–5 (10.000.000, 20.000.000,
 * 50.000.000 …), a koeficijent raste za 0,10 po nivou. Bez plafona: sistem treba
 * da izdrži skok u opticaju pri velikoj donaciji.
 *
 * Prag se zato NE traži u nizu nego se računa, a niz služi kao provera.
 */

/** Korak koeficijenta po nivou (čl. 4). */
export const KORAK_KOEFICIJENTA = 0.1;

/**
 * 🔴 Koeficijent pokroviteljstva = koeficijent donacije × 1,20 (čl. 10, od
 * 2026-09-08). Nije zasebna tabela nego IZVOD iz čl. 4 — dve lestvice se time
 * ne mogu razići pri sledećoj izmeni, što je i bio razlog izmene: fiksni bonusi
 * su davali 1,67–1,92× više po dinaru do milion, a preko miliona ništa.
 */
export const KOEFICIJENT_POKROVITELJSTVA = 1.2;

/** Najmanji iznos prijave pokroviteljstva (čl. 7) — ispod toga ugovor košta više. */
export const MINIMUM_PRIJAVE_POKROVITELJSTVA = 10_000;

/**
 * Donji prag kumulativa (RSD) za dati nivo. Nivo 1 nema prag (svaka donacija
 * nosi POEN), nivo 2 je 5.000, a od nivoa 3 naviše niz je 1–2–5 počev od 10.000.
 */
export function pragZaNivo(nivo: number): number {
  if (nivo <= 1) return 0;
  if (nivo === 2) return 5_000;
  const j = nivo - 3;
  const mantisa = [1, 2, 5][j % 3];
  return mantisa * Math.pow(10, 4 + Math.floor(j / 3));
}

/**
 * Koeficijent za dati nivo. Računa se u celim brojevima (stotinkama) — sa
 * `1 + (n-1) * 0.1` jedanaesti nivo daje 2.0000000000000004.
 */
export function koeficijentZaNivo(nivo: number): number {
  return (100 + (Math.max(1, nivo) - 1) * 10) / 100;
}

/** Koeficijent pokroviteljstva za dati nivo — donacija × 1,20, tačno u stotinkama. */
export function koeficijentPokroviteljstvaZaNivo(nivo: number): number {
  const cent = 100 + (Math.max(1, nivo) - 1) * 10;
  return Math.round((cent * 12) / 10) / 100;
}


/**
 * Vraća nivo i koeficijent evidencije za dati kumulativni RSD iznos.
 * Svaki iznos (uključujući 0) je bar Nivo 1 (koeficijent 1,00).
 */
export function nivoZaKumulativ(kumulativRSD: number): { nivo: number; kurs: number } {
  // Nije pretraga po nizu nego penjanje po pragovima — tabela nema kraj.
  // `Number.isFinite` čuva petlju: Infinity bi je vrtelo beskonačno, NaN pada na
  // nivo 1 sam od sebe (poređenje sa NaN je uvek netačno).
  if (!Number.isFinite(kumulativRSD) || kumulativRSD < 0) return { nivo: 1, kurs: 1.0 };
  let nivo = 1;
  while (kumulativRSD >= pragZaNivo(nivo + 1)) nivo++;
  return { nivo, kurs: koeficijentZaNivo(nivo) };
}

/**
 * Nivo i koeficijent pokroviteljstva za dati kumulativ (čl. 10).
 *
 * Numeracija nivoa pokroviteljstva počinje od najmanje prijave (10.000 RSD), pa
 * je pomerena za dva u odnosu na nivoe donacija: nivo 1 pokroviteljstva = nivo 3
 * donacija. 🟢 Zatečeni `Pokrovitelj.trenutniNivo` (1–7 po staroj fiksnoj tabeli)
 * time OSTAJE tačan — stari pragovi 10.000…1.000.000 daju iste brojeve 1…7, pa
 * prelazak na koeficijentni model ne traži migraciju brojeva nivoa.
 */
export const POMERAJ_NIVOA_POKROVITELJSTVA = 2;

export function nivoPokroviteljstvaZaKumulativ(kumulativRSD: number): {
  nivo: number;
  kurs: number;
} {
  const { nivo } = nivoZaKumulativ(kumulativRSD);
  return {
    nivo: Math.max(1, nivo - POMERAJ_NIVOA_POKROVITELJSTVA),
    kurs: koeficijentPokroviteljstvaZaNivo(nivo),
  };
}

/** Redovi Tabele B za prikaz (čl. 10) — počinju od najmanje prijave. */
export function tabelaPokroviteljstvaZaPrikaz(
  doNivoa = 12
): { nivo: number; do: number; kurs: number }[] {
  return Array.from({ length: doNivoa }, (_, i) => {
    const nivoDonacije = i + 1 + POMERAJ_NIVOA_POKROVITELJSTVA;
    return {
      nivo: i + 1,
      do: pragZaNivo(nivoDonacije),
      kurs: koeficijentPokroviteljstvaZaNivo(nivoDonacije),
    };
  });
}

/**
 * Redovi za prikaz — zaključanih jedanaest plus nekoliko iz nastavka, da se na
 * ekranu vidi da tabela ne staje. Prikaz, ne pravilo: obračun ide kroz
 * `nivoZaKumulativ`, koji nema gornju granicu.
 */
export function tabelaZaPrikaz(doNivoa = 14): { nivo: number; do: number; kurs: number }[] {
  return Array.from({ length: doNivoa }, (_, i) => ({
    nivo: i + 1,
    do: pragZaNivo(i + 1),
    kurs: koeficijentZaNivo(i + 1),
  }));
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
