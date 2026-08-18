/**
 * Šifarnik škola u Srbiji — PODACI. Pravila su u `skola.ts`.
 *
 * ─── 🔴 SPISAK JE PRAZAN I TO NIJE PREVID ───────────────────────────────────
 *
 * Ovaj fajl se NE piše rukom. Popunjava ga skripta `scripts/uvezi-skole.mjs` iz
 * zvaničnog izvoza Ministarstva prosvete (Jedinstveni informacioni sistem prosvete
 * — JISP, `opendata.mpn.gov.rs`), koji uz naziv i mesto nosi i **broj upisanih
 * učenika** po školi.
 *
 * Broj učenika je jedini ulazni podatak koji sistem ne može sam da proizvede, a
 * bez njega ne postoji procentualna lista — dakle ona lista zbog koje mala škola
 * uopšte može da bude prva u državi. Zato se ovde NIŠTA ne unosi „za sada" i ne
 * procenjuje: izmišljen imenilac pravi izmišljen poredak, a poredak škola je
 * javan podatak koji ljudi prepričavaju.
 *
 * Dok je spisak prazan, `skolePostoje()` vraća `false` i ceo prikaz škola se ne
 * renderuje — nijedan ekran ne puca, samo nema šta da pokaže.
 *
 * ─── Kako se popunjava ──────────────────────────────────────────────────────
 *
 *   node scripts/uvezi-skole.mjs <putanja-do-izvoza.csv>
 *
 * Skripta proverava dve stvari i odbija ceo uvoz ako neka ne prođe:
 *   1. šifre su jedinstvene;
 *   2. svako `mesto` se razrešava u kanonsko naselje iz `NASELJA_SRBIJE`.
 *
 * Druga provera je važnija nego što deluje: škola čije mesto ne pogađa nijedno
 * naselje tiho ispada iz svega što se kači na lokaciju, a na listi i dalje stoji.
 */

import type { Skola } from "./skola";

/**
 * Spisak škola. Generiše `scripts/uvezi-skole.mjs` — ne dopisivati rukom.
 *
 * Očekivani obim: oko 1.130 redovnih osnovnih i oko 500 srednjih škola.
 */
export const SKOLE: Skola[] = [];
