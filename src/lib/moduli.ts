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

/**
 * Pokroviteljstvo pravnih lica i preduzetnika — Pravilnik čl. 38–40.
 *
 * 🟢 UKLJUČENO 2026-08-18 (odluka vlasnika). Paljenjem se vraćaju: stranice
 * `/postani-pokrovitelj` i `/pokrovitelji`, 18 API ruta, stavka „Pokrovitelj" u
 * navigaciji, admin tab Pokrovitelji sa svojim badge-om, ranglista na `/sistem`
 * i FAQ pitanja 24 i 25 — sve bez ijedne dalje izmene, jer je gašenje od početka
 * išlo kroz ovaj prekidač.
 */
export const POKROVITELJSTVO_AKTIVNO = true;

/**
 * Modul Deca — Pravilnik o KOLO sistemu Glava VIII, čl. 58.
 *
 * 🟢 **Pravni uslovi su ispunjeni setom akata 4.3.0 (17.08.2026).** Usvojen je
 * **Pravilnik o učešću dece** (`dokumentacija 4.1/ucesce_dece_4_3_4.md`), usklađeni
 * su Pravilnik o KOLO sistemu (čl. 14 st. 3, čl. 15 t. 9 — deveti kanal, čl. 58),
 * Uslovi (čl. 7, 25) i Politika (4.7), a **DPIA je AŽURIRAN** — radnja obrade br. 11
 * prevedena je u aktivnu, uz nov rizik R16 i mere 5.11. To je bila izričita obaveza
 * iz čl. 65: modul koji uvodi obradu podataka maloletnih lica ne sme se aktivirati
 * bez ažurirane procene. Prekidač je i dalje potez koji ide POSLEDNJI.
 *
 * Dok je `false`: stranice modula vraćaju 404, njegove API rute 410, a nav stavke i
 * kartice se ne renderuju.
 *
 * 🟡 Brane koje sakrivaju maloletne korisnike iz javnih upita rade BEZ OBZIRA na
 * prekidač. Cena im je nula, a cena propuštanja je izlaganje deteta — zato nisu
 * uslovljene.
 *
 * 🔴 **Od unapređenog modela (17.08.2026) prekidač nosi i EKONOMSKU posledicu.**
 * Prijateljstvo maloletnih korisnika upisuje 500 POEN svakoj strani (Pravilnik o
 * učešću dece, čl. 14b — deveti kanal iz čl. 15 Pravilnika o KOLO sistemu), a raskid
 * i punoletstvo taj POEN otpisuju. Emisija ulazi u opticaj, pa pomera prag
 * osnivačkog koraka (na svakih 100.000 POEN) i obračunski koeficijent ZRNA — u OBA
 * smera. Paljenje modula zato više nije potez bez traga u brojevima sistema.
 *
 * ─── STANJE: upaljen radi provere na TESTU (14.08.2026) ─────────────────────
 *
 * 🔴 MORA nazad na `false` PRE objave na ekolo.rs, dok vlasnik izričito ne kaže da
 * modul ide u rad. Pravna prepreka je otklonjena (akti 4.3.0, DPIA ažuriran), pa je
 * ovo od sada ODLUKA o puštanju u rad, a ne uslov koji čeka da se ispuni. Puštanje
 * je jednosmerno u praksi: čim se upiše prvi dečji nalog, gašenje modula ostavlja
 * decu bez pristupa nalogu, a emitovani POEN u opticaju.
 */
export const MODUL_DECA_AKTIVAN = true;

/**
 * Ekran „Sistem je unapređen — novi akti" pri prijavi (Uslovi čl. 40, Politika čl. 16).
 *
 * `false` = od korisnika se NE traži pristanak; prekrivač se nikad ne prikazuje,
 * a `/politika-prihvati` propušta dalje. Odluka vlasnika 11.08.2026: akti su doneti
 * i punovažni danom donošenja, sistem još nije zvanično u radu, pa ekran samo smeta
 * ljudima koji prvi put dolaze.
 *
 * 🔴 **Mehanizam se NE briše, samo se ne traži.** Verzije i pristanci
 * (`PolitikaVerzija`, `PolitikaPrihvatanje`) ostaju u bazi, zajedno sa svime što
 * je do sada upisano — postojeći pristanci su dokaz i ne smeju da se izgube.
 *
 * 🔴 **ROK OD 15 DANA JE UKINUT setom 4.3.0** (odluka vlasnika 17.08.2026). Uslovi
 * čl. 40 i Politika čl. 16 sada glase: izmene stupaju na snagu danom donošenja, a
 * obaveštenje se šalje bez odlaganja. Nema više roka koji bi trebalo odbrojavati —
 * `true` znači samo „prikaži ekran i upiši pristanak", uz nov red `PolitikaVerzija`.
 * Ne vraćati rok u komentare ni u copy: akti ga više ne poznaju.
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
 *
 * 85–95 su sekcija „Deca i roditelji" — cela pada sa modulom, jer opisuje naloge
 * dece, prijateljstva i roditeljski uvid, čega bez modula nema. Prazna sekcija se
 * ne iscrtava (`FaqStranica` odbacuje sekcije bez pitanja), pa nema šta da ostane.
 *
 * 6 i 84 su ISTO pitanje („Mogu li se maloletnici registrovati?") sa dva odgovora,
 * i tačno jedan od njih se prikazuje. Odgovor ne može da bude jedan tekst: dok je
 * modul ugašen istinit odgovor je „ne", a dok radi „da, od sedme godine". Zato se
 * ne prepravlja tekst pitanja 6 nego se bira koji od dva broja ide na stranicu —
 * inače bi jedno od dva stanja sistema imalo neistinit FAQ.
 */
export const FAQ_SAKRIVENA_PITANJA: number[] = [
  ...(POKROVITELJSTVO_AKTIVNO ? [] : [24, 25]),
  ...(MODUL_DECA_AKTIVAN ? [6] : [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]),
];

/**
 * Poruka koju API rute ugašenog modula vraćaju uz status 410.
 * Jedna rečenica za oba modula — korisniku je svejedno koji je propis u pitanju,
 * a prevod ide kroz `greska()` kao i svaka druga poruka.
 */
export const PORUKA_MODUL_UGASEN = "Ova mogućnost trenutno nije u radu.";
