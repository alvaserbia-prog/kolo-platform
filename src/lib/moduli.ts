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
 * Modul Deca — Pravilnik o KOLO sistemu Glava VIII, čl. 58.
 *
 * 🔴 Ostaje `false` dok Upravni odbor ne usvoji Pravilnik o Modulu Deca, ne uskladi
 * Pravilnik o KOLO sistemu, Uslove i Politiku, i dok ne bude AŽURIRANA PROCENA
 * UTICAJA NA ZAŠTITU PODATAKA. Poslednje nije preporuka nego izričita obaveza iz
 * čl. 65: modul koji uvodi obradu podataka maloletnih lica ne sme se aktivirati bez
 * nje. Prekidač je zato jedini potez koji sme da bude poslednji.
 *
 * Dok je `false`: stranice modula vraćaju 404, njegove API rute 410, a nav stavke i
 * kartice se ne renderuju.
 *
 * 🟡 Brane koje sakrivaju maloletne korisnike iz javnih upita rade BEZ OBZIRA na
 * prekidač. Cena im je nula, a cena propuštanja je izlaganje deteta — zato nisu
 * uslovljene.
 *
 * ─── STANJE: upaljen radi provere na TESTU (14.08.2026) ─────────────────────
 *
 * 🔴 MORA nazad na `false` PRE svake objave na ekolo.rs. Modul je upaljen samo da
 * bi se tok prošao na test okruženju; akti nisu usvojeni i DPIA nije ažuriran, pa
 * na produkciji ne sme da radi. Objava sa `true` bila bi povreda čl. 65.
 */
export const MODUL_DECA_AKTIVAN = true;

/**
 * Ekran „Sistem je unapređen — novi akti" pri prijavi (Uslovi čl. 40, Politika čl. 16).
 *
 * `false` = od korisnika se NE traži pristanak; prekrivač se nikad ne prikazuje,
 * a `/politika-prihvati` propušta dalje. Odluka vlasnika 11.08.2026: akti 4.2.1
 * su doneti i punovažni danom donošenja, sistem još nije zvanično u radu, pa
 * ekran samo smeta ljudima koji prvi put dolaze.
 *
 * 🔴 **Mehanizam se NE briše, samo se ne traži.** Verzije i pristanci
 * (`PolitikaVerzija`, `PolitikaPrihvatanje`) ostaju u bazi, zajedno sa svime što
 * je do sada upisano — postojeći pristanci su dokaz i ne smeju da se izgube.
 *
 * 🔴 **Za prvu izmenu akata POSLE puštanja sistema u rad ovo MORA nazad na
 * `true`.** Uslovi čl. 40 i Politika čl. 16 tada traže pun postupak: obaveštenje
 * najmanje 15 dana unapred, nov red `PolitikaVerzija` i ponovnu saglasnost.
 * Isključivanje važi samo dok sistem nije zvanično počeo.
 */
export const PRISTANAK_NA_AKTE_TRAZI_SE = false;

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
