/**
 * Prekidači za module i kanale koji privremeno NISU u radu.
 *
 * ─── Zašto prekidač, a ne brisanje ──────────────────────────────────────────
 *
 * Gašenje se radi jednim `false`, a povratak jednim `true`. Kod, Prisma modeli,
 * podaci i istorija transakcija ostaju netaknuti, pa povratak ne zavisi od toga
 * koliko je vremena prošlo (za razliku od `git revert`, koji posle nekoliko
 * meseci izmena oko sebe više ne bi mogao čisto da se primeni).
 *
 * 🔴 **Ne brisati tabele ni podatke.** `Krug` ima sopstveni `Wallet`, čiji
 * balans ulazi u opticaj (`osnivacki.ts` — „suma svih korisničkih + Krug
 * balansa"). Brisanje redova bi oborilo zero-sum i smanjilo opticaj, čime bi se
 * pomerili pragovi osnivačkog koraka (na svakih 100.000 POEN). Ispravno gašenje
 * Kruga sa balansom išlo bi kroz protivzapis Protokola, kao pri gašenju naloga
 * — dok je modul samo ugašen, ništa od toga nije potrebno.
 *
 * Iz istog razloga ostaju i enum vrednosti `WalletType.KRUG`,
 * `TransactionType.EMISIJA_KRUG_OSNIVANJE`, `EMISIJA_KRUG_BONUS` i
 * `EMISIJA_POKROVITELJ` — istorijske transakcije ih nose.
 *
 * ─── Pravni osnov ───────────────────────────────────────────────────────────
 *
 * **Krug** je modul u smislu Pravilnika Glava VIII; čl. 54 daje Fondaciji u
 * Fazi 1 ovlašćenje da module aktivira i deaktivira. Zato se akti NE menjaju —
 * modul je deaktiviran, odredbe stoje i dalje.
 *
 * **Pokroviteljstvo** nije modul nego kanal evidentiranja (čl. 15, čl. 38–40),
 * uređen Pravilnikom o pokroviteljstvu i donacijama. Kanal još nije pušten u
 * rad; nije ukinut. Taj pravilnik **ostaje javno vidljiv** na
 * `/pravilnik/pokroviteljstvo-donacije` jer istim aktom rade **donacije**, koje
 * su i dalje aktivne.
 *
 * **Zadruga** se ovde ne pominje jer nikad nije ni implementirana (Glava VIII,
 * čl. 56) — nema šta da se gasi.
 *
 * ─── Šta prekidač radi ──────────────────────────────────────────────────────
 *
 * Kad je modul ugašen: stranice vraćaju 404 (`notFound()`), API rute vraćaju
 * 410 (Gone), a stavke u navigaciji, admin tabovi, kartice i FAQ pitanja se ne
 * prikazuju. Fajl je bez ijednog `import`-a namerno — uvoze ga i serverske i
 * klijentske komponente.
 */

/** Krugovi (kolektivni oblici) — Pravilnik Glava VIII. */
export const KRUG_AKTIVAN = false;

/** Pokroviteljstvo pravnih lica i preduzetnika — Pravilnik čl. 38–40. */
export const POKROVITELJSTVO_AKTIVNO = false;

/**
 * FAQ pitanja koja se ne prikazuju dok je odgovarajući modul ugašen.
 *
 * Brojevi su `id` iz `faq-data*.ts` i isti su na svih pet jezika (paritet čuva
 * `__tests__/faq-paritet.test.ts`). Pitanja se ne brišu iz fajlova — samo se ne
 * prikazuju, pa se povratkom prekidača vraćaju bez ijedne dalje izmene.
 *
 * 24 — „Šta su Pokrovitelji i koja je razlika u odnosu na donaciju?"
 * 25 — „Može li firma da bude direktni član?" (odgovor upućuje na pokroviteljstvo)
 */
export const FAQ_SAKRIVENA_PITANJA: number[] = [
  ...(POKROVITELJSTVO_AKTIVNO ? [] : [24, 25]),
];

/**
 * Poruka koju API rute ugašenog modula vraćaju uz status 410.
 * Jedna rečenica za oba modula — korisniku je svejedno koji je propis u pitanju,
 * a prevod ide kroz `greska()` kao i svaka druga poruka.
 */
export const PORUKA_MODUL_UGASEN = "Ova mogućnost trenutno nije u radu.";
