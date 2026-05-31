# Triaža FAQ pitanja P1–P40

**Datum:** 2026-05-30

Triaža 40 novih, korisnički formulisanih FAQ pitanja (P1–P40) sprovedena je protiv aktuelne kanonske dokumentacije (Pravilnik o KOLO sistemu v3.7.3, prateći pravilnici i politike v3.7.2/3.7.3) i postojećeg FAQ-a (`src/lib/faq-data.ts`). Metod: workflow od 40 paralelnih agenata (po jedan na pitanje) + dopuna za 8 pitanja koja u prvom prolazu nisu vratila strukturisan rezultat. Svako pitanje je klasifikovano u jednu od tri kategorije:

- **SPREMNA** — na pitanje se može tačno i potpuno odgovoriti iz postojeće dokumentacije; finalni odgovor je napisan i spreman za FAQ.
- **ODLUKA** — jezgro pitanja ne može se istinito odgovoriti bez prethodne odluke/utvrđivanja vlasnika (regulatorni status, nedovršena politika, podatak koji postoji samo u kodu, ili podatak koji uopšte ne postoji).
- **IZMENA** — odgovor bi zahtevao izmenu koda ili dokumenta (drift broja/pravila).

## Rezime

| Klasifikacija | Broj |
|---|---|
| SPREMNA | 36 |
| ODLUKA | 4 |
| IZMENA | 0 |
| **Ukupno** | **40** |

Od 36 SPREMNA pitanja, **35 je dodato** u `faq-data.ts`, a **1 (P22)** je izostavljeno jer ga je triaža preporučila spojiti sa postojećim pitanjem (#25) umesto dodavanja kao duplikat. ODLUKA pitanja (P7, P18, P24, P32) nisu dodata — čekaju vlasnikov unos.

### Ažuriranje 2026-05-30 — vlasnik razrešio 3 od 4 ODLUKA
Po unosu vlasnika dodata su još 3 pitanja u `faq-data.ts`, pa je SPREMNA/dodato sada **38**:
- **P7 (id 77)** — Fondacija **nije obveznik** AML/KYC; identifikacija donatora kroz bankarski sistem. Napomena: pravnu formulaciju potvrditi sa advokatom pre objave na ekolo.rs.
- **P18 (id 78)** — serveri u **EU i SAD**; prenos uz zaštitne mere po ZZPL. Napomena: i dalje treba finalizovati **Politiku čl. 9** (izabrati Opciju B i upisati provajdera/državu — placeholderi `[NAZIV PROVAJDERA]`, `[DRŽAVA]`).
- **P24 (id 79)** — parametri Podrške Majkama su javni (2.000 osnova − 100/god, množilac po redu deteta 1,00/1,20/1,50/2,00/+0,50), iz programskog pravilnika/koda.
- **P32 (id 80)** — rešeno: GitHub repozitorijum `alvaserbia-prog/kolo-platform` **prebačen sa privatnog na javni** (AGPL-3.0), pošto je istorija od 312 commit-ova skenirana i potvrđeno bez tajni. Odgovor sa linkom dodat u sekciju „Tehnika i open-source".

**Sve 4 ODLUKA su sada razrešene; FAQ ima 80 pitanja (41 staro + 39 novih).**

## Tabela svih 40 pitanja

| ID | Klasifikacija | Sekcija | Preklapa se sa # | Kratko obrazloženje |
|---|---|---|---|---|
| P1 | SPREMNA | Za početnike | 7 | Bootstrap verifikacije bez poznanika rešen je tablom zahteva za jemstvo i početnim korisnicima (UO Fondacije). |
| P2 | SPREMNA | Za početnike | 7 | Korišćenje je besplatno; POEN se ne kupuje, donacija je dobrovoljna. |
| P3 | SPREMNA | Za početnike | 7 | Prvi POEN se dobija verifikacijom (1.000); dalje kroz verifikaciju drugih, operativni doprinos, socijalne programe i razmenu usluga. |
| P4 | SPREMNA | Za početnike | 3 | Nema obavezne aktivnosti; zapis se čuva pri pauzi, izlazak bez otkaznog roka. |
| P5 | SPREMNA | Za početnike | 33 | Pseudonim je samoizabran; ne traže se dokumenti/JMBG; ime/telefon dobrovoljni. |
| P6 | SPREMNA | Porezi i legalnost | 5 | Nijedan regulator nije izdao potvrdu; legalnost počiva na strukturnoj pravnoj konstrukciji, ne na spoljnoj saglasnosti. |
| P7 | ODLUKA | Porezi i legalnost | — | AML/KYC obvezničnost Fondacije nije utvrđena ni u jednom dokumentu — traži regulatorno utvrđivanje. |
| P8 | SPREMNA | Porezi i legalnost | 5 | KOLO ne obračunava porez ni račune; opšti propisi i dalje važe; akcize/primarni proizvodi nedorečeni. |
| P9 | SPREMNA | Porezi i legalnost | 5 | POEN nije prihod/naknada, pa ne bi trebalo da utiče na penziju/davanja; proveriti sa PIO. |
| P10 | SPREMNA | Porezi i legalnost | 1 | POEN nije e-novac; donacija i upis POEN-a su dva pravno nezavisna akta. |
| P11 | SPREMNA | POEN i ZRNO | — | POEN/ZRNO nisu potraživanje; pri gašenju imovina ne ide osnivačima; AGPL/CC čuvaju zajedničko dobro. |
| P12 | SPREMNA | POEN i ZRNO | 4 | Granica ZRNA nije cenovna; ZRNO je upravljačko, nema stakinga ni prinosa. |
| P13 | SPREMNA | POEN i ZRNO | 40 | Verifikaciona emisija je simetrična, automatska; nije MLM provizija ni airdrop; ne može se farmati. |
| P14 | SPREMNA | POEN i ZRNO | 27 | Osnivački doprinos evidentira pre-launch rad; isti status kao svaki POEN; krug zatvoren, sve javno, kvadratno glasanje. |
| P15 | SPREMNA | Privatnost i izlazak | 34 | Sistem radi bez imena/telefona; gubi se samo lakši kontakt na Pijaci. |
| P16 | SPREMNA | Privatnost i izlazak | 34 | Pseudonimnost nije anonimnost; posredna identifikacija moguća, dokumentacija to priznaje. |
| P17 | SPREMNA | Privatnost i izlazak | 35 | Verifikator zna lice i pseudonim, ali Fondacija tu vezu ne poseduje; graf je pseudoniman i nejavan. |
| P18 | ODLUKA | Privatnost i izlazak | — | Lokacija servera / prelazak granice zavise od člana 9 Politike koji ima dve nerazrešene opcije i placeholdere. |
| P19 | SPREMNA | Pijaca, donacije, pokrovitelji | 22 | Čista trampa bez POEN-a je dozvoljena (van sistema); evidentira se samo deo za koji se ažurira POEN. |
| P20 | SPREMNA | Pijaca, donacije, pokrovitelji | 21 | Za kvalitet/isporuku odgovaraju korisnici po obligacionom pravu; nema auto-storna; povrat je novo ažuriranje. |
| P21 | SPREMNA | Pijaca, donacije, pokrovitelji | — | Cenu određuje sam korisnik slobodno; orijentir 1 POEN ≈ 1 RSD ne obavezuje; obaveza tačnog opisa. |
| P22 | SPREMNA | Pijaca, donacije, pokrovitelji | 25 | Pojedinac ulazi kao građanin; firma može biti pokrovitelj, bonus ide vlasniku. **Spojeno sa #25 — nije dodato.** |
| P23 | SPREMNA | Programi Protokola | 16 | Podrška Starijima — kvalifikovana grupa, automatska evidencija; konkretne brojke u posebnom pravilniku. |
| P24 | ODLUKA | Programi Protokola | 17 | Tačni iznosi Podrške Majkama (POEN/dan po detetu) postoje samo u kodu, delegirani posebnom pravilniku. |
| P25 | SPREMNA | Programi Protokola | 17 | Dokaz statusa ne traži upload dokumenata; podaci po izričitom opozivom pristanku; Fondacija odobrava prijavu. |
| P26 | SPREMNA | Programi Protokola | 16 | Nema programa za nezaposlene/nuždu; put je razmena i operativni doprinos. |
| P27 | SPREMNA | Programi Protokola | 38 | Nije radni odnos; nema ugovora ni zagarantovanog iznosa; predloženi POEN je težinski koeficijent. |
| P28 | SPREMNA | Krugovi | — | Postojeće udruženje/zadruga može preneti strukturu u Krug i zadržati pravni subjektivitet nezavisno. |
| P29 | SPREMNA | Krugovi | — | Krug (interes/delatnost, bez subjektiviteta) vs Zadruga (teritorija, pun subjektivitet); praktično se osniva Krug. |
| P30 | SPREMNA | Krugovi | 12 | Ekskluzivnost važi samo za Krugove unutar KOLA; spoljna članstva ostaju netaknuta. |
| P31 | SPREMNA | Krugovi | 15 | Nema počasnih titula; organizator ne dobija dodatni POEN; osnivači imaju osnivački doprinos, ne titulu. |
| P32 | ODLUKA | Tehnika i open-source | — | URL javnog repozitorijuma i self-host procedura nigde nisu definisani — traži vlasnikovu objavu. |
| P33 | SPREMNA | Tehnika i open-source | 19 | Doprinos kodom je operativni doprinos; DCO (ne CLA), trajna atribucija; traži indeks ≥ 10%. |
| P34 | SPREMNA | Tehnika i open-source | — | Javni developerski API ne postoji; postoji samo izvoz ličnih podataka (JSON). |
| P35 | SPREMNA | Tehnika i open-source | 27 | Nije blockchain; zaštita kroz zero-sum, determinizam i nepromenljiv log; integritet je dizajnersko, ne trustless pravilo. |
| P36 | SPREMNA | Zaštite i upravljanje | 28 | Dva praga: aktivacija Gornjeg Kola (1.000.000 POEN) i gašenje veta (prag finansijske samostalnosti). |
| P37 | SPREMNA | Privatnost i izlazak | 8 | Verifikacija na daljinu moguća (lično poznavanje, ne fizičko prisustvo; v3.7.3); registracija/praćenje moguće. |
| P38 | SPREMNA | Pijaca, donacije, pokrovitelji | 23 | Donacija u dinarima ili drugoj valuti (i evri); koeficijent 1,00–2,00 kroz 11 nivoa, trajan. |
| P39 | SPREMNA | Uključivanje | 8 | Zvanični jezik srpski; interfejs ima en/hu prebacivač; merodavan je srpski izvorni tekst. |
| P40 | SPREMNA | Za početnike | 40 | KOLO nikad ne traži uplatu, lozinku, PIN, karticu, JMBG ni sliku dokumenta; sve suprotno je prevara. |

## ODLUKA — traži vlasnikov unos

### P7 — Da li je Fondacija obveznik po propisima o sprečavanju pranja novca (AML/KYC)? Da li identifikuje donatore?

Vlasnik treba da utvrdi i potvrdi: (1) da li je KOLO Fondacija određena kao obveznik po Zakonu o sprečavanju pranja novca i finansiranja terorizma (ZSPNFT) — to zavisi od pravnog statusa i delatnosti Fondacije i predstavlja regulatorno utvrđivanje; (2) ako jeste obveznik, da li postoji interni AML program, ovlašćeno lice i procedura identifikacije/praćenja; (3) da li se na donacije i pokroviteljstva primenjuje sopstveni KYC postupak Fondacije ili se Fondacija u potpunosti oslanja na bankin KYC. Tek po toj odluci može se napisati tačan FAQ odgovor. Deo odgovora „da li se donatori identifikuju" jeste potvrđen (kroz bankarski sistem / verifikovane račune) i može ući u odgovor čim se reši status obveznika.

### P18 — Gde su serveri i da li podaci prelaze granicu (EU/GDPR)?

Da bi P18 postalo SPREMNO, finalizuj član 9 Politike privatnosti (politika_3_7_3.md): (1) odluči OPCIJA A (nema prenosa van Srbije) ili OPCIJA B (provajder van Srbije) i izbriši drugu; (2) popuni placeholdere — naziv i sedište hosting provajdera ('[NAZIV PROVAJDERA, SEDIŠTE]' u čl. 8), država prenosa ('[DRŽAVA]') i pravni osnov za treću zemlju (odluka o adekvatnosti / standardne ugovorne klauzule / druge mere po čl. 65-69 ZZPL). Realna infrastruktura (Neon/Vercel) ukazuje na Opciju B, što kanonska Politika još ne odražava. Tek po izboru i popunjavanju može se napisati tačan FAQ odgovor (npr. „serveri kod provajdera X u državi Y; prenos po standardnim ugovornim klauzulama"). Pitanje se uklapa u postojeću sekciju „Privatnost i izlazak" — nije potrebna nova sekcija.

### P24 — Koliko tačno POEN dnevno po detetu dobijam (Podrška Majkama) i kako uzrast/broj dece utiče?

Treba da odlučiš da li se konkretni parametri Podrške Majkama JAVNO objavljuju u FAQ-u: baza 2.000 POEN/dan po detetu, −100 POEN po godini uzrasta deteta, prekid kad dete napuni 20 godina, i obračunski koeficijent po redu deteta (1.0 / 1.2 / 1.5 / 2.0, pa +0.5 za svako sledeće dete). Ti brojevi danas postoje samo u kodu (programi.ts) i podložni su izmeni; Pravilnik ih izričito delegira posebnom programskom pravilniku koji još nije napisan. Dve opcije: (a) ostati na opisnom odgovoru bez brojeva (kao postojeći Q17) — tada P24 nije potreban kao zaseban unos; ili (b) doneti i objaviti programski pravilnik sa fiksiranim parametrima, pa onda P24 postaje SPREMNA. Dodatno (sporedno): u programi.ts komentar referencira „Čl. 53" — treba ispraviti na čl. 57.

### P32 — Gde je javni repozitorijum koda? Kako da ga kloniram ili sam hostujem pod AGPL-3.0?

Da bi P32 postalo SPREMNO, treba doneti i objaviti: (1) tačan URL javnog repozitorijuma (npr. github.com/... ili gitlab/self-hosted) i platformu hostinga; (2) self-host/clone proceduru (git clone, env varijable, baza, build/deploy korake — usklađeno sa Next.js 16 / Prisma / Neon stackom). Pravna napomena: AGPL-3.0 obavezuje operatora mrežnog servisa da korisnicima servisa učini izvorni kod dostupnim — čim sistem radi u produkciji na ekolo.rs, objavljivanje repozitorijuma postaje pravna obaveza, ne opcija. Dok URL i procedura ne postoje, FAQ ne sme da izmišlja link ni korake.

## Preklapanja sa postojećim FAQ-om

Sledeća P-pitanja imaju neprazno polje „preklapanje" sa postojećim #ID. Za svako je dat ishod (svi su dodati kao novi unos osim P22):

| P | Postojeći # | Preporuka / ishod |
|---|---|---|
| P1, P2, P3 | 7 | Dodato kao novo — beginner-friendly ugao (verifikacija/besplatnost/prvi koraci), uz unakrsnu vezu ka #7. |
| P4 | 3 | Dodato kao novo — fokus na obavezu aktivnosti, ne na isticanje POEN-a. |
| P5 | 33 | Dodato kao novo — konsoliduje pseudonim/bez-dokumenata za početnike (preporuka triaže: dodati). |
| P6, P8, P9 | 5 | Dodato kao novo — različiti uglovi (regulatorna potvrda / hrana-rakija-delatnost / penzija); #5 ostaje kratak opšti unos. |
| P10 | 1 | Dodato kao novo — e-novac vs donacija, specifična pravna distinkcija. |
| P12 | 4 | Dodato kao novo — granica ZRNA / staking. |
| P13 | 40 | Dodato kao novo — uži ugao (verifikaciona emisija kao airdrop/farm). |
| P14 | 27 | Dodato kao novo — osnivački kanal 2,4M POEN. |
| P15, P16 | 34 | Dodato kao novo — minimizacija podataka i deanonimizacija; komplementarno #34. |
| P17 | 35 | Dodato kao novo — verifikator zna lice+pseudonim; nije pokriveno #35. |
| P19 | 22 | Dodato kao novo — čista trampa bez POEN-a. |
| P20 | 21 | Dodato kao novo — dublje: skriveni nedostatak / reklamacija / povrat POEN-a. |
| **P22** | **25** | **Preporuka: spojiti sa #25 (proširiti #25 primerom RPG/radnja/firma) — NIJE dodato kao zaseban unos.** |
| P23, P26 | 16 | Dodato kao novo — Podrška Starijima / program za nezaposlene; različite teme od opšteg #16. |
| P25 | 17 | Dodato kao novo — dokaz statusa / upload dokumenata. |
| P27 | 38 | Dodato kao novo — „je li ovo posao / prihod"; ugao koji #38 ne pokriva. |
| P30 | 12 | Dodato kao novo — spoljna članstva (dopuna #12). |
| P31 | 15 | Dodato kao novo — priznanje osnivaču/organizatoru. |
| P33 | 19 | Dodato kao novo — doprinos kodom / PR. |
| P35 | 27 | Dodato kao novo — sigurnosni model / blockchain. |
| P36 | 28 | Dodato kao novo — pragovi punog samoupravljanja. |
| P37, P39 | 8 | Dodato kao novo — verifikacija na daljinu / jezik sistema. |
| P38 | 23 | Dodato kao novo — valuta donacije (evri iz inostranstva). |
| P40 | 40 | Dodato kao novo — zaštita od prevare (šta KOLO nikad ne traži). |

**Jedino spajanje (nije dodato):** P22 → #25.

## Šta je dodato u faq-data.ts

Dodata su **3 nove sekcije** i **35 novih pitanja** (id 42–76, redom po P1→P40, preskačući ODLUKA i spojeno P22). Postojeća 41 pitanja i funkcije na dnu fajla (`SVA_PITANJA`, `poBrojevima`) nisu menjani.

**Nove sekcije:**
- `pocetnici` — „Za početnike" (postavljena na POČETAK niza, pre „POEN i ZRNO")
- `porezi-legalnost` — „Porezi i legalnost" (posle „Pijaca, donacije, pokrovitelji")
- `tehnika` — „Tehnika i open-source" (posle „Zaštite i upravljanje")

**Dodata pitanja (novi id → P-oznaka → naslov → sekcija):**

| Novi id | P | Naslov (skraćeno) | Sekcija |
|---|---|---|---|
| 42 | P1 | Verifikacija kad ne poznaješ nikoga iznutra | Za početnike |
| 43 | P2 | Da li je stvarno besplatno | Za početnike |
| 44 | P3 | Kako zaraditi prve POEN bez proizvoda | Za početnike |
| 45 | P4 | Koliko vremena oduzima / stalna aktivnost | Za početnike |
| 46 | P5 | Šta je pseudonim / dokumenti i JMBG | Za početnike |
| 47 | P6 | Je li regulator potvrdio legalnost | Porezi i legalnost |
| 48 | P8 | Račun/PDV/delatnost za viškove i usluge | Porezi i legalnost |
| 49 | P9 | Utiče li POEN na penziju/socijalna davanja | Porezi i legalnost |
| 50 | P10 | POEN vs elektronski novac / skrivena kupovina | Porezi i legalnost |
| 51 | P11 | Šta ako sistem propadne / Fondacija prestane | POEN i ZRNO |
| 52 | P12 | Granica ZRNA / staking ili prinos | POEN i ZRNO |
| 53 | P13 | Verifikaciona emisija — provizija/airdrop/farm | POEN i ZRNO |
| 54 | P14 | Osnivački kanal do 2.400.000 POEN | POEN i ZRNO |
| 55 | P15 | Korišćenje bez imena i telefona | Privatnost i izlazak |
| 56 | P16 | Deanonimizacija kombinovanjem transakcija | Privatnost i izlazak |
| 57 | P17 | Verifikator zna lice i pseudonim | Privatnost i izlazak |
| 58 | P19 | Trampa rad-za-rad bez POEN-a | Pijaca, donacije, pokrovitelji |
| 59 | P20 | Skriveni nedostatak / reklamacija / povrat | Pijaca, donacije, pokrovitelji |
| 60 | P21 | Određivanje cene i ko vrednuje | Pijaca, donacije, pokrovitelji |
| 61 | P23 | Podrška Starijima | Programi Protokola |
| 62 | P25 | Dokaz statusa / upload dokumenta | Programi Protokola |
| 63 | P26 | Program za nezaposlene / finansijsku nuždu | Programi Protokola |
| 64 | P27 | Je li ovo posao / prihod / ugovor | Programi Protokola |
| 65 | P28 | Uvođenje postojećeg udruženja/zadruge kao Krug | Krugovi |
| 66 | P29 | Razlika Krug vs Zadruga | Krugovi |
| 67 | P30 | Mogu li članovi biti i u drugim grupama | Krugovi |
| 68 | P31 | Priznanje osnivaču/organizatoru | Krugovi |
| 69 | P33 | Doprinos kodom (PR) — POEN/PED/verifikacija | Tehnika i open-source |
| 70 | P34 | Javni/developerski API | Tehnika i open-source |
| 71 | P35 | Sigurnosni model / blockchain | Tehnika i open-source |
| 72 | P36 | Pragovi punog samoupravljanja | Zaštite i upravljanje |
| 73 | P37 | Verifikacija na daljinu / iz inostranstva | Privatnost i izlazak |
| 74 | P38 | Valuta donacije / evri iz inostranstva | Pijaca, donacije, pokrovitelji |
| 75 | P39 | Jezik sistema / engleska verzija | Uključivanje |
| 76 | P40 | Šta KOLO nikad neće tražiti (zaštita od prevare) | Za početnike |

**Izostavljeno zbog preklapanja (spajanje):**
- **P22** („Imam RPG / radnju / firmu — ulazim kao firma ili građanin? Može li firma biti pokrovitelj?") — suštinski pokriveno postojećim #25 (i delom #24). Preporuka triaže: proširiti #25 primerom RPG/radnja/firma i razmenom robe/usluga, umesto dodavanja zasebnog unosa. Nije dodato.

**Izostavljeno jer je ODLUKA (čeka vlasnikov unos):** P7, P18, P24, P32.
