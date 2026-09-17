/**
 * Granica zapisa — koliko POEN-a uopšte može da stane u evidenciju.
 *
 * ČISTE funkcije, bez ijednog `import`-a: uvozi ih i server (noćna emisija,
 * jezgro emisije) i test.
 *
 * ─── Zašto postoji (R-08) ───────────────────────────────────────────────────
 *
 * 🔴 Ukupan broj POEN-a NIJE ograničen nijednim pravilom, i to je namerno: broj
 * prati broj učesnika i njihovu uključenost, jer se svaki zapis vezuje za
 * doprinos određenog lica. Jedini kanal sa apsolutnom gornjom granicom je
 * osnivački doprinos (2.400.000, čl. 14 i 15 Pravilnika o osnivačkom doprinosu).
 *
 * 🔴 Ali granica ipak postoji — postavlja je TIP KOLONE, ne norma.
 * `Wallet.balance` je `INTEGER` (migracija `20260407142817_init`), dakle
 * 32-bitni ceo broj sa znakom. Zapis Protokola je negativan i jednak −opticaj,
 * pa je opticaj tvrdo ograničen na 2.147.483.647. Nijedno pravilo taj broj nije
 * izabralo i nijedan akt ga ne pominje.
 *
 * 🟡 Šta to znači u ljudskim veličinama: pri milion članova granica dozvoljava
 * oko 2.147 POEN-a po čoveku — otprilike dve potvrde stvarnosti. Sistem u ovom
 * obliku ne može da opsluži milion ljudi, i to ne iz ekonomskih razloga.
 *
 * 🟢 Postgres prekoračenje NE prelama tiho nego diže `integer out of range`, pa
 * transakcija pukne i ništa se ne upiše. Dobra vest je da nema tihe štete; loša
 * je da bi bez ove brane noćna emisija počela da puca bez ijednog upozorenja
 * unapred, a ispravka bi bila izmena tipa kolone nad živom bazom.
 *
 * Zato ovde stoje dve stvari: prag na kome se javlja uzbuna (mnogo pre granice)
 * i legitiman opis greške ako se granica ipak dotakne.
 *
 * 🔴 Ovo NIJE kapa na količinu POEN-a i ne sme se tako opisivati ni u aktima ni
 * u copy-ju. Norma granicu ne postavlja — ovo je tehnička brana koja postoji
 * samo dok je kolona `INTEGER`.
 */

/** Najveći ceo broj koji staje u PostgreSQL `INTEGER` — tvrda granica kolone. */
export const MAX_ZAPIS = 2_147_483_647;

/**
 * Prag na kome se javlja uzbuna — 80% granice.
 *
 * Nije proizvoljan: pri rastu od 10% po obračunskom periodu (najbrži mogući
 * tempo, kad je dnevni limit zasićen) od ovog praga do granice ima još oko dve
 * i po nedelje, a pri realnom linearnom rastu — godine. Dovoljno da se izmena
 * tipa kolone pripremi bez zastoja.
 */
export const PRAG_UPOZORENJA = Math.floor(MAX_ZAPIS * 0.8);

export type StanjeGranice = "uredno" | "upozorenje" | "granica";

/** Stanje evidencije prema tehničkoj granici. `opticaj` je apsolutna vrednost zapisa Protokola. */
export function stanjeGranice(opticaj: number): StanjeGranice {
  const o = Math.abs(opticaj);
  if (o >= MAX_ZAPIS) return "granica";
  if (o >= PRAG_UPOZORENJA) return "upozorenje";
  return "uredno";
}

/** Da li dodatna emisija staje u kolonu. */
export function staje(opticaj: number, dodatak: number): boolean {
  return Math.abs(opticaj) + Math.abs(dodatak) <= MAX_ZAPIS;
}

/** Tekst uzbune za Fondaciju. Namerno kaže i šta je ispravka, jer je ona migracija. */
export function porukaUzbune(opticaj: number): string {
  const o = Math.abs(opticaj);
  const pct = ((o / MAX_ZAPIS) * 100).toFixed(1);
  return (
    `Opticaj je ${o.toLocaleString("sr-RS")} POEN — ${pct}% tehničke granice ` +
    `kolone (${MAX_ZAPIS.toLocaleString("sr-RS")}). Granicu postavlja tip kolone ` +
    `Wallet.balance (INTEGER), ne pravilo. Kad se dostigne, noćna emisija počinje ` +
    `da puca sa "integer out of range". Ispravka je prelazak kolone na BIGINT, ` +
    `koji povlači i izmenu tipa u Prisma šemi i u kodu koji balans čita kao broj.`
  );
}
