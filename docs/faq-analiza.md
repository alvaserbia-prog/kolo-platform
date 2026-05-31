# Analiza FAQ — ekolo.rs (v3.7.0/3.7.1 uskladjivanje)

> Generisano automatski (26 agenata: 8 revizija postojećih sekcija + 10 persona posetilaca + 7 ključnih korisničkih grupa + sinteza). Datum: 2026-05-30.
> Izvori provere: `dokumentacija/Pravilnik_3_7_0.md`, `dokumentacija/donacije_3_7_0.md` (v3.7.1), `CLAUDE.md`, `docs/glosar.md`, javne stranice `src/app/(public)/`. Postojeći FAQ: `src/lib/faq-data.ts`.

## 1. Rezime (TL;DR)

**Status 40 postojecih pitanja (revizija):**

| Status | Broj | ID-jevi |
|---|---|---|
| TACNO (bez izmene) | 15 | 1, 4, 5, 6, 7, 9, 12, 13, 14, 21, 28, 33, 37, 39, 40 |
| IZMENITI (delimicna korekcija) | 17 | 2, 3, 10, 11, 15, 16, 17, 18, 20, 22, 24, 25, 26, 27, 29, 32, 35, 38 |
| PREPISATI (sustinski netacno) | 6 | 8, 19, 23, 30, 31, 34, 36 |
| UKLONITI | 0 | — |

Tezinski: ~6 pitanja zahtevaju hitno prepisivanje, ~17 doradu, ostalo je u redu.

**8 najkritičnijih nalaza (pravni/reputacioni rizik):**

1. **Donacije — zastarela tabela (FAQ #23).** Tekst navodi „18 nivoa, 1×–5×". Kanonsko (donacije_3_7_0.md čl. 4, red 41–51) = **11 nivoa, koeficijent 1,00 (2.000 RSD) do 2,00 (5.000.000 RSD)**. Sopstvena stranica /kako-funkcionise vec prikazuje tacno „11 nivoa · do 2,00×" — sajt sam sebi protivreci. Trazi 6 persona/grupa. **Najveci pojedinacni rizik** (regulator i skeptik ovo koriste da ospore pouzdanost cele konstrukcije).

2. **Vidljivost transakcija (FAQ #34, #27, #32, #10).** Tekst tvrdi da „sve transakcije vidi svaki posetilac, i neregistrovan, sa pseudonimima". Kanonsko (Politika čl. 6, Pravilnik čl. 67): **gradirana vidljivost** — neregistrovan vidi samo agregate; neverifikovan prijavljen vidi iznose/vreme BEZ pseudonima; tek verifikovan (indeks ≥10%) vidi pseudonime. Kod trenutno odstupa (🟡 /api/javno/feed izlaze pseudonime) — FAQ treba da opise ciljni model uz napomenu.

3. **JMBG/dokumenti pri verifikaciji (FAQ #8).** Tekst trazi „pasoš ili ekvivalentni identifikacioni dokument" za strance. Kanonsko (Pravilnik čl. 31, dokaz_stvarnosti čl. 5): verifikacija **NE trazi nijedan dokument ni JMBG** — stvarnost se potvrdjuje kroz lanac jemstva lice-u-lice. Direktno protivreci celom modelu. Trazi dijaspora i pocetnik.

4. **Prag gasenja Zastitnog veta (FAQ #30, #23).** Tekst tvrdi „trostruki iznos mesecnih troskova". Kanonsko (Pravilnik, red 555): **„prag finansijske samostalnosti utvrden posebnim pravilnikom"** — konkretan iznos NIJE u Pravilniku. CLAUDE.md izricito oznacava „3× mesecni troskovi" kao netacno. Ne sme se navoditi konkretna formula.

5. **PED — zastareli model potvrdjivanja (FAQ #19).** Tekst kaze „drugi verifikovani korisnici potvrduju" (v2.x peer model). Kanonsko (operativni_3_7_0.md čl. 19; CLAUDE.md): izvrsenje verifikuju **ovlasceni verifikatori** (Faza 1 = UO Fondacije, Faza 2 = nosioci ZRNA), kroz objavljen zadatak. Trazi programer i osoba u nuzdi.

6. **„Dva odvojena akta" — pogresni citati (FAQ #38).** Tekst citira čl. 5 i čl. 11 Pravilnika; oni ureduju Zajednicko dobro i KOLO zajednicu. Tacan izvor: whitepaper pogl. 4 (red 1065), Pravilnik čl. 73; kanali emisije = čl. 15 (7 kanala), NE čl. 11. Sadrzi i izmisljen kanal „dobije odobrenje za projekat".

7. **Izlazak — otpis ZRNA po koeficijentu (FAQ #36).** Tekst tvrdi da se ZRNA otpisuju „po tekucem obracunskom koeficijentu". Kanonsko (Pravilnik čl. 34): otpis ZRNA pri prestanku statusa **NE pokrece evidentiranje POEN-a po koeficijentu**.

8. **Sporovi — izmisljen trostepeni mehanizam (FAQ #31).** Tekst opisuje Krug → Fondacija → Gornje Kolo kao instance. CLAUDE.md: „trostepeni model NIJE propisan; postoji samo PrigovorNaOdluku". Stvarna podela (Pravilnik čl. 79): korisnik↔korisnik = obligaciono pravo pred nadleznim sudom; korisnik↔Fondacija = sud u Somboru; podaci = Poverenik.

---

## 2. Izmene postojecih pitanja

### Sekcija: POEN i ZRNO

| id | pitanje (skraceno) | status | kljucni problem | izvor |
|---|---|---|---|---|
| 23 | Donacija — koliko POEN dobijam | **PREPISATI** | „18 nivoa, 1×–5×" zastarelo; pogresan mehanizam (admin potvrda); izostavljen uslov „samo verifikovan" | donacije_3_7_0.md čl. 3–5 |
| 38 | Princip dva odvojena akta | IZMENITI | pogresni citati (čl. 5/11), izmisljen kanal „projekat", kanali su čl. 15 | whitepaper red 1065; Pravilnik čl. 73, 15 |
| 2 | Mogu li unovciti POEN | IZMENITI | „preneti/prenos" → „azuriranje evidencije"; „trose" → „redistribuiraju" | Pravilnik čl. 16 (red 241–245) |
| 3 | Da li POEN istice | IZMENITI | „Fondacija ne moze sama" tacno samo za Fazu 2; u Fazi 1 UO menja pravila | Pravilnik čl. 3, prelazne odredbe |

**PREDLOG #23:** „Donaciju moze dati svaki verifikovani korisnik, uplatom u dinarima na racun Fondacije. Po prijemu uplate Protokol automatski evidentira POEN. Broj POEN-a = iznos × koeficijent evidencije donacija (od 1,00 pri kumulativno 2.000 RSD do 2,00 pri 5.000.000 RSD, kroz 11 nivoa). Nivo je trajan i ne smanjuje se koriscenjem POEN-a. (Koeficijent evidencije donacija NIJE obracunski koeficijent ZRNA niti „kurs".)" Ukloniti recenicu o „trostrukom iznosu mesecnih troskova = samoupravljanje".

**PREDLOG #38:** „Akt 1: korisnik doprinosi zajednickom dobru ili ima status koji to potvrduje (donacija, operativni doprinos, verifikacija u lancu jemstva, socijalni program, prijava pokroviteljstva, rast kolektivnog oblika). Akt 2: Protokol algoritamski i deterministicki evidentira POEN — bez diskrecije, ugovora, proticinidbe. Akti su pravno nezavisni; nema ugovora „X → Y POEN" ni potrazivanja prema Fondaciji (Pravilnik čl. 73). Kanali su nabrojani u čl. 15."

**PREDLOG #2:** „Ne. POEN ne menjas za dinare; Fondacija ga ne otkupljuje. Mozes inicirati azuriranje evidencije POEN-a u korist drugog korisnika (u razmeni, ukljucujuci Pijacu) ili kroz POEN upisati ZRNO. To azuriranje redistribuira postojece POEN-e; nije prenos novca ni placanje."

**PREDLOG #3:** „Trenutno ne. POEN ostaje zabelezen dok ne iniciras azuriranje evidencije ili ne deaktiviras nalog (tada se POEN ponistava i vraca Protokolu). Uvodenje „starenja" POEN-a bila bi sustinska izmena pravila — u Fazi 1 donosi je Upravni odbor Fondacije, a po aktivaciji Gornjeg Kola Gornje Kolo glasanjem."

### Sekcija: Ukljucivanje

| id | pitanje | status | kljucni problem | izvor |
|---|---|---|---|---|
| 8 | Stranac — clan? | **PREPISATI** | „pasos/dokument" netacno; jezici (en/hu) nepotkrepljeni | Pravilnik čl. 31, 59; uslovi red 75 |
| 10 | Promena pseudonima | IZMENITI | „1×/30 dana" nije propisano (CLAUDE.md t.11); precenjena vidljivost | CLAUDE.md t.11; Politika čl. 6 |

**PREDLOG #8:** „Da. Drzavljanstvo nije uslov. Bitno je da si stvarna osoba — a to se ne dokazuje dokumentom nego kroz lanac jemstva: verifikovani korisnik koji te licno poznaje potvrduje tvoju stvarnost uzivo. Pri registraciji ne trazimo ni pasos, ni licnu kartu, ni JMBG — biras pseudonim, unosis email i lozinku. Sistem trenutno radi na srpskom; lokalizacija na druge jezike predvidena je u kasnijim fazama." (Napomena: tvrdnju o en/hu verziji vidi sekcija 3/P39 — kod ima messages/en.json i hu.json; vlasnik da odluci da li interfejs zaista nudi prebacivanje.)

**PREDLOG #10:** „Promena pseudonima moguca je iz podesavanja. Eventualna ucestalost izmene ureduje se Uslovima i moze biti tehnicki ogranicena; konkretan rok nije fiksiran Pravilnikom. Ranije transakcije ostaju u trajnoj evidenciji pod pseudonimom koji je vazio u trenutku transakcije — tu pseudonimnu istoriju vide samo verifikovani korisnici (indeks ≥10%)."

### Sekcija: Krugovi

| id | pitanje | status | kljucni problem | izvor |
|---|---|---|---|---|
| 11 | Kako Krug ulazi u sistem | IZMENITI | brojevi (5 clanova, pragovi) iz posebnog pravilnika/koda, ne iz Pravilnika — naznaciti | Pravilnik čl. 55; krug.ts |
| 15 | Ovlascena lica Kruga | IZMENITI | „racun"/„preraspodela sredstava" → „balans POEN-a"; uskladiti sa PRIKUPLJANJE/REDISTRIBUCIJA | Pravilnik čl. 55; CLAUDE.md |

**PREDLOG #11:** zadrzati brojeve (5 clanova, 1–3 ovlascena lica, 50.000 POEN, pragovi 10/20/50/100/200/500), ali dodati: „Parametri (iznosi i pragovi) utvrdeni su posebnim pravilnikom o krugovima — Pravilnik čl. 55 upucuje na poseban akt, pa se mogu menjati."

**PREDLOG #15:** „Ovlascena lica (1–3, prema posebnom pravilniku) imaju iskljucivo tehnicku funkciju — pokrecu aktivnosti Kruga sa zajednickog balansa POEN-a: prikupljanje i preraspodelu medu clanovima, razmene za potrebe Kruga. Te aktivnosti koriste postojeci balans i ne stvaraju novu emisiju. Po toj ulozi NE dobijaju dodatni POEN i nisu „menadzment" — Krug odlucuje kolektivno."

### Sekcija: Programi

| id | pitanje | status | kljucni problem | izvor |
|---|---|---|---|---|
| 19 | Kako radi PED | **PREPISATI** | „medusobno potvrdivanje" zastarelo; verifikatori su ovlasceni; zadatak struktura | operativni čl. 4, 19, 41; CLAUDE.md |
| 16 | Sta su Programi | IZMENITI | izostavlja operativni doprinos; nepre­cizne grupe; dnevni upis nije propisan | Pravilnik čl. 15, 35–36, 57 |
| 17 | Podrska Majkama | IZMENITI | formula (opadajuci koef.) nije kanonska; „dobijas" → „evidentira se POEN" | Pravilnik čl. 57, 69 |
| 18 | Posebna Briga | IZMENITI | „fiksan/isplacuje se mesecno" netacno; „isplata" → „evidentira POEN" | Pravilnik čl. 57, 68–69 |
| 20 | Vise programa | IZMENITI | baza limita (pocetak perioda); limit obuhvata samo operativni+socijalne; pogresan citat clana | operativni čl. 23; CLAUDE.md |

**PREDLOG #19:** „Operativni doprinos (ranije PED) evidentira rad za zajednicko dobro. Tece kroz zadatak: objavljuje ga Fondacija (Faza 1) odnosno Gornje Kolo/nosioci ZRNA (Faza 2). Verifikovani korisnik (indeks ≥10%) prijavljuje se i izvrsava. Izvrsenje NE potvrduju proizvoljni korisnici, vec ovlasceni verifikator (Faza 1 = UO Fondacije). Nema tarife po satu: „predlozeni POEN" je tezinski koeficijent, a evidentirani iznos se rasporeduje u okviru dnevnog limita. Napomena: tok je u tranziciji ka ovom modelu."

**PREDLOG #16, #17, #18, #20:** koristiti detaljne tekstove iz revizije (svi su kanonski usaglaseni); kljucno svuda: „evidentira se POEN" umesto „dobijas/isplacuje se", i napomena da parametre utvrduje poseban pravilnik (Pravilnik čl. 57).

### Sekcija: Pijaca, donacije, pokrovitelji

| id | pitanje | status | kljucni problem | izvor |
|---|---|---|---|---|
| 24 | Pokrovitelji — razlika | IZMENITI | bonus se evidentira podnosiocu prijave (ne nuzno vlasniku); roba/usluge izostavljene | donacije čl. 6–10 |
| 25 | Firma direktan clan? | IZMENITI | ponavlja gresku #24 (vlasnik=POEN); firma NE prima POEN | donacije čl. 6–8 |
| 22 | Naplata delom u RSD | IZMENITI | „naplacivati/kupac" krsi glosar → „razmena/drugi korisnik" | Pravilnik čl. 15–16; glosar |

**PREDLOG #24:** „Pokrovitelji su pravna lica koja Fondaciji daju donaciju u novcu, robi ili uslugama (roba/usluge po vazecem cenovniku). Pokrovitelj NIJE korisnik i NE prima POEN ni ZRNO. Prijavu podnosi verifikovani korisnik; po potvrdi prijema, Protokol bonus POEN evidentira u zapisu tog korisnika, po tabeli sa 7 nivoa (10.000 RSD = 20.000 POEN ... 1.000.000 RSD = 1.500.000 POEN). Pravna lica se javno vide na rang-listi Pokrovitelja."

**PREDLOG #25:** „Ne. Direktni clanovi su iskljucivo fizicka lica. Firme ucestvuju kroz Pokroviteljstvo (novac/roba/usluge). Pravno lice nije korisnik i ne prima POEN/ZRNO; bonus se evidentira u zapisu verifikovanog korisnika koji je podneo prijavu."

**PREDLOG #22:** „Razmena na Pijaci evidentira se u POEN-ima, sto nije placanje novcem. Deo razmene u dinarima moguc je samo kao privatni dogovor izmedu tebe i drugog korisnika, van sistema — Fondacija ga ne evidentira, ne posreduje i ne pokriva. Dinarski deo je tvoja privatna i poreska odgovornost."

### Sekcija: Zastite i upravljanje

| id | pitanje | status | kljucni problem | izvor |
|---|---|---|---|---|
| 30 | Zastitni veto | **PREPISATI** | prag gasenja „3× troskovi" netacno; osnovi veta presuzeni; nedostaje obrazlozenje | Pravilnik čl. 48–50; CLAUDE.md |
| 27 | Sta sprecava zloupotrebu | IZMENITI | „sve transakcije javne sa pseudonimima" → gradirana vidljivost; limit 10% vezati za poseban pravilnik | Politika čl. 6; Pravilnik čl. 35 |
| 26 | Ko kontrolise KOLO | IZMENITI | „kriticna masa" → prag 1.000.000 POEN; kvadratno glasanje aktivnim ZRNOM | Pravilnik čl. 42–46, 51 |
| 29 | Kvadratno glasanje | IZMENITI | izostavljen uslov: glasa se samo AKTIVNIM ZRNOM | Pravilnik čl. 46 |

**PREDLOG #30:** „Posle aktivacije Gornjeg Kola Fondacija moze odbiti izvrsenje odluke koja bi: (1) narusila cetiri principa, (2) prekrsila zakon ili (3) ugrozila pravni status Fondacije. Veto nije diskrecion — mora biti obrazlozen pozivanjem na konkretan princip ili normu; veto bez obrazlozenja je zloupotreba. Gasi se trajno i jednosmerno kad sredstva dostignu prag finansijske samostalnosti utvrden posebnim pravilnikom."

**PREDLOG #27, #26, #29:** koristiti tekstove iz revizije (kanonski usaglaseni). Kljucno: u #27 zameniti „sve transakcije javne" sa gradiranom vidljivoscu; u #26 navesti prag 1.000.000 POEN; u #29 dodati „glasa se iskljucivo aktivnim ZRNOM".

### Sekcija: Sporovi

| id | pitanje | status | kljucni problem | izvor |
|---|---|---|---|---|
| 31 | Sporovi medu clanovima | **PREPISATI** | izmisljen trostepeni mehanizam; Gornje Kolo nije zalbena instanca | Pravilnik čl. 75–79; CLAUDE.md |
| 32 | Nepostovanje pravila | IZMENITI | „loše ponasanje vidljivo svima" krsi vidljivost; mere donosi Fondacija ne Krug; mehanika ponistavanja | Pravilnik čl. 28–34; uslovi čl. 27–29 |

**PREDLOG #31:** „Spor medu clanovima oko razmene resava se po obligacionom pravu, pred nadleznim sudom — Fondacija nije strana. U Fazi 1 mozes traziti dobrovoljno (neobavezujuce) posredovanje Fondacije. Spor clan↔Fondacija resava se sporazumno, a inace pred sudom u Somboru. Za podatke imas pravo prituzbe Povereniku. Posebni interni mehanizmi mogu se uspostaviti kasnije (poseban pravilnik / odluka Gornjeg Kola) — zasad ne postoje."

**PREDLOG #32:** koristiti tekst iz revizije (gradirana vidljivost; suspenzija ≤30 dana; isključenje uz prigovor 15 dana; POEN se ponistava uz protivzapis, ZRNO otpis bez evidentiranja POEN-a, anonimizacija).

### Sekcija: Privatnost i izlazak

| id | pitanje | status | kljucni problem | izvor |
|---|---|---|---|---|
| 34 | Ko vidi pseudonim/transakcije | **PREPISATI** | „sve javno svima" netacno; „samo admin vidi ime" protivreci razdvajanju | Politika čl. 3, 6; Pravilnik čl. 67 |
| 36 | Kako izlazim | **PREPISATI** | ZRNO „po koeficijentu" netacno (čl. 34); „vraca" → „ponistava uz protivzapis" | Pravilnik čl. 34; uslovi čl. 29 |
| 35 | Kako se stiti privatnost | IZMENITI | „4 principa" → 3 (Politika čl. 3); izostao „razdvajanje"; JSON eksport → masinski citljiv format | Politika čl. 3; CLAUDE.md |

**PREDLOG #34:** koristiti tekst iz revizije (gradirana vidljivost po statusu; Fondacija ne vodi tabelu pseudonim↔identitet; ime/telefon dobrovoljni i biras vidljivost; napomena o 🟡 odstupanju koda).

**PREDLOG #36:** koristiti tekst iz revizije (ZRNO otpis NE pokrece evidentiranje POEN-a; POEN se ponistava uz protivzapis; anonimizacija; trajna atribucija pod AGPL/CC).

**PREDLOG #35:** koristiti tekst iz revizije (tri principa: pseudonimnost, razdvajanje, minimizacija; eksport u „strukturisanom, masinski citljivom formatu").

---

## 3. Nova pitanja za dodavanje (persone + grupe, deduplikovano)

Format: **P:** pitanje — **O:** odgovor / NEPOZNATO — **[trazi]**. Sortirano po broju persona/grupa.

### NOVA SEKCIJA: „Za pocetnike / Kako pocinjem"

**P1: Ne poznajem nikoga ko je vec u KOLU — kako da se verifikujem ako verifikacija trazi da te neko iznutra potvrdi? (chicken-and-egg)**
**O:** Lanac jemstva mora negde da pocne. U pilot fazi (Sombor) koren su pocetni verifikatori — korisnici sa statusom POCETNI (UO Fondacije, izuzeti od anti-cirkularnog pravila) verifikuju prve korisnike uzivo na organizovanim okupljanjima. Do tada se registruj besplatno i koristi javni deo. **NEPOZNATO:** tacan operativni „bootstrap" postupak za novo mesto (da li Fondacija salje verifikatora / organizuje skupove) nije razraden — treba odluka vlasnika. **[skeptik, pocetnik, domacica, majka, osoba u nuzdi, dijaspora, organizator, penzioner — 8 grupa, najtrazenije]**

**P2: Da li je stvarno besplatno ili moram nesto da uplatim/doniram da bih koristio sistem?**
**O:** Potpuno besplatno. Registracija ne kosta nista. POEN se NE kupuje za dinare — upisuje se kroz doprinos. Donacija i pokroviteljstvo su dobrovoljni i NISU uslov za koriscenje. Prvih 1.000 POEN dobijas besplatno pri verifikaciji. **[pocetnik, domacica, osoba u nuzdi — 3]**

**P3: Kako da zaradim svoje prve POEN-e ako nemam sta da prodam? Koji je MOJ prvi korak?**
**O:** Najlaksi prvi POEN ne trazi proizvod: verifikacija ti automatski upisuje 1.000 POEN. Dalje: operativni doprinos (rad za zajednicu koji verifikator potvrdi), verifikacija drugih koje poznajes (1.000 po osobi), socijalni program ako pripadas grupi, ili razmena usluge/znanja/cuvanja dece — ne mora proizvod. **[pocetnik, osoba u nuzdi, domacica — 3]**

**P4: Koliko vremena mi oduzima — moram li biti stalno aktivan?**
**O:** Registracija < 2 minuta, bez obaveza. Nema obavezne aktivnosti: koristis kad imas potrebu, izmedu toga nalog mirno stoji. POEN ne istice. Mozes obrisati nalog u svakom trenutku. **[pocetnik — 1]**

**P5: Sta je „pseudonim" — moram li otkriti pravo ime, JMBG ili slikati licnu kartu?**
**O:** Pseudonim je izmisljeno javno ime; pravo ime nije obavezno i sistem ne vodi vezu pseudonim↔identitet. Za registraciju ne trebaju dokumenti (ni JMBG, ni LK). Ni verifikacija ne trazi dokumente — radi se licnim poznavanjem uzivo. Ime/telefon su kasnije dobrovoljni. **[pocetnik, privatnost, dijaspora — 3]** (Napomena: ispraviti i FAQ #8 koji pominje pasos.)

### NOVA SEKCIJA: „Porezi i legalnost"

**P6: Da li je iko od regulatora (NBS, Poreska, Poverenik, APR) potvrdio da je ovo legalno, ili samo Fondacija tako tvrdi?**
**O:** Sistem je konstruisan tako da POEN izricito NIJE zakonsko sredstvo placanja, elektronski novac, digitalna imovina ni finansijski instrument; razmena se oslanja na pravo na slobodno udruzivanje i obligaciono pravo (Pravilnik čl. 4). **NEPOZNATO:** dokumentacija NEMA nijedno pisano misljenje/odgovor NBS-a, Poreske ni Poverenika — tvrdnja „ne mora dozvolu" i „nezavisno pregledali pravnici/ekonomisti" su stav Fondacije, BEZ imena recenzenata ili akta regulatora. Vlasnik da odluci: objaviti proverljiv izvor ili ublaziti formulaciju. **[skeptik, novinar ×2, regulator — 4]**

**P7: Je li Fondacija obveznik AML/KYC (Zakon o sprecavanju pranja novca)? Identifikuje li donatore?**
**O:** Identifikacija ide kroz bankarski sistem — donacije fiz. lica primaju se sa verifikovanih bankovnih racuna (Politika čl. 4), pa se oslanja na bankin KYC. Podaci dostupni Upravi za SPN i Poreskoj po zakonskom zahtevu (Politika čl. 8). **NEPOZNATO:** dokumentacija NE sadrzi izjavu je li Fondacija sama obveznik po ZSPNFT-u ni interni AML program (pragovi gotovine, prijava sumnjivih transakcija, vrednovanje robnih donacija). Treba odluka vlasnika. **[novinar, regulator — 2]**

**P8: Prodajem viskove (med, rakija, zimnica, usev) / pruzam zanatske usluge redovno — treba li mi racun, PDV, registrovana delatnost? Ko snosi porez?**
**O:** Razmena nije konstruisana kao klasicna prodaja, a prenos POEN-a nije platna transakcija (Pravilnik čl. 16). KOLO ne obracunava poreze, ne izdaje fiskalne racune u tvoje ime, ne daje poreski savet. ALI: ovo NE ukida postojece obaveze — ako redovno i u obimu pruzas robu/uslugu, primenjuju se opsti propisi o obavljanju delatnosti (FAQ #5, #39); za hranu i posebni propisi o bezbednosti hrane; za rakiju akciza/ogranicenja prodaje. Posavetuj se sa knjigovodjom. **NEPOZNATO:** poreski tretman je „predmet dijaloga sa nadleznim organima"; tretman primarnih poljoprivrednih proizvoda i alkohola nije razraden. **[zemljoradnik, domacica, majstor, mali proizvodjac, regulator — 5]**

**P9: Utice li ucesce u KOLU / POEN na moju penziju ili socijalna davanja?**
**O:** POEN nije novac, zarada ni prihod u smislu PIO propisa — Fondacija ga ne isplacuje u dinarima i ne prijavljuje kao prihod; ni POEN iz programa za starije nije socijalna pomoc ni naknada (Pravilnik čl. 57). Sam POEN po sebi ne predstavlja prihod koji utice na penziju. ALI ako kroz hibridni dogovor redovno naplacujes u dinarima (van sistema), to je tvoja delatnost po opstim propisima. Za sigurnost: PIO fond / knjigovodja. **[penzioner — 1, ali visok znacaj]**

**P10: Po cemu se POEN razlikuje od elektronskog novca / nije li to skrivena kupovina POEN-a kroz donaciju?**
**O:** E-novac trazi: vrednost izdatu po prijemu novca, koja je potrazivanje prema izdavaocu i otkupljiva. POEN ne ispunjava nijedan element — emisija je vezana za doprinos/status (ne za uplatu), nije potrazivanje, Fondacija ga ne otkupljuje (Pravilnik čl. 16, 70, 73). Donacija (Akt 1) i evidencija POEN-a (Akt 2) su pravno nezavisni — nema ugovora „dinar za POEN". Orijentir „1 POEN ≈ 1 RSD" je samo orijentir, bez garancije. **[regulator, skeptik — 2]**

### POEN i ZRNO

**P11: Sta ako sistem propadne / Fondacija zatvori vrata — gubim li sve?**
**O:** POEN i ZRNO nisu imovina ni potrazivanje (FAQ #1, #4, #37) — Fondacija ne duguje novac za POEN ni dok radi ni ako prestane. Vrednost je u stvarnim razmenama koje ostvaris dok sistem radi. Pri prestanku Fondacije, po Statutu čl. 25 preostala imovina NE ide osnivacima — dodeljuje se drugoj fondaciji/zadruzi sa slicnim ciljevima. Softver je AGPL-3.0, pa zajednica moze nastaviti. **[skeptik — 1]**

**P12: Cemu hard cap od 1.000.000 ZRNA ako se ne moze trgovati? Postoji li staking/prinos?**
**O:** Hard cap NIJE radi cene — ZRNO je neprenosivo i bez trzisne vrednosti. Svrha je upravljacka: kako raste opticaj POEN-a, raste obracunski koeficijent (vise POEN-a za isto ZRNO), sto cuva tezinu glasa i otezava „preuzimanje". NEMA stakinga ni kamate — ZRNO ne nosi prinos. Korist je glas u Gornjem Kolu (kvadratno glasanje). **[kripto entuzijasta — 1]**

**P13: Je li verifikaciona emisija (1.000 POEN) provizija za regrutovanje / airdrop koji mogu da farmam?**
**O:** Nije. Kod MLM-a provizija tece uz novac naviše kroz nivoe trajno; ovde verifikator i verifikovani dobijaju isto (1.000 POEN), jednokratno, simetricno, bez „linije ispod". Farmanje je besmisleno: POEN se ne unovcava, vazi jedan-covek-jedan-nalog, verifikacija je lice-u-lice, i zero-sum (svaki POEN = minus Protokola). **[skeptik, kripto — 2]**

**P14: Osnivacki kanal evidentira do 2.400.000 POEN „osnivacima" — nije li to vrh koji sebi upise novac?**
**O:** Osnivacki doprinos je naknadno evidentiranje rada na projektovanju sistema pre platforme (osnivacki_3_7_0.md čl. 1–2). To nije novac: isti status kao svaki POEN — nekonvertibilan, bez eksterne vrednosti, bez potrazivanja (čl. 9). Krug osnivaca je ZATVOREN (čl. 3). Ograniceno tempom: 1 korak od 20.000 POEN tek kad sistem poraste za 100.000 (čl. 7). Zbog kvadratnog glasanja i cinjenice da POEN ne daje glas, veci saldo ne daje kontrolu. Svi udeli su javni (čl. 12). **[skeptik, kripto — 2]**

### Privatnost

**P15: Mogu li koristiti sistem bez imena i telefona? Sta gubim?**
**O:** Da. Obavezni su samo pseudonim, email, lozinka (Politika čl. 4.1). Ime/telefon su dobrovoljni (čl. 4.3), nisu uslov za verifikaciju ni pristup. Bez njih jedino te drugi teze kontaktiraju (npr. na Pijaci). Ako ih das, sam biras vidljivost verifikovanima i mozes povuci otkrivanje (čl. 6). **[privatnost — 1]**

**P16: Moze li me neko deanonimizovati kombinujuci iznose/vreme/ucestalost transakcija?**
**O:** Da, taj rizik priznajemo otvoreno — pseudonimnost nije anonimnost (Politika čl. 3, 6). Zastite: nema tabele pseudonim↔identitet, gradirana vidljivost, zabrana pseudonima sa licnim podacima, mogucnost da ne otkrijes ime/telefon. **NEPOZNATO:** konkretne tehnicke mere protiv napada povezivanjem (zaokruzivanje iznosa, odlaganje objave) nisu u DPIA — vredi razmotriti, posebno za ranjive grupe u maloj sredini (Sombor). **[privatnost, novinar, regulator — 3]**

**P17: Osoba koja me verifikuje zna i moje lice i pseudonim — ne razbija li lanac jemstva anonimnost?**
**O:** Tacno je da te verifikator licno povezuje sa pseudonimom — ali krug je uzak i ljudski, ne institucionalan (Fondacija ne zna). Graf verifikacija vodi se pseudonimno, nije javan, tretira se kao licni podatak (Politika čl. 4.2, 6). Anti-cirkularno pravilo trazi vise ljudi iz razlicitih delova mreze, pa nema jedne tacke sa kompletnim identitetom. **[privatnost — 1]**

**P18: Gde su serveri / prelaze li podaci granicu (EU/GDPR)?**
**O:** Razdvajanje podataka: Fondacija u svojim bazama drzi samo bankovnu dokumentaciju donacija i vezu pokrovitelj↔korisnik; ostalo na infrastrukturi Protokola (Politika čl. 3). Kad su serveri van Srbije, prenos po čl. 65–69 ZZPL. **NEPOZNATO:** Politika jos ima neizabranu opciju A/B i placeholder [NAZIV PROVAJDERA] — realno se hostuje na inostranoj infrastrukturi (Neon/Vercel), pa je ciljno Opcija B; vlasnik mora finalizovati čl. 9 (provajder, drzava, pravni osnov). **[novinar, regulator, privatnost, dijaspora — 4]**

### Pijaca / razmena

**P19: Mogu li sa komsijom razmeniti rad-za-rad ili alat-za-usev bez ijednog POEN-a (trampa)?**
**O:** Direktna trampa je privatni dogovor koji KOLO ne zabranjuje, ali ako se POEN ne upise, razmena nije evidentirana kao tvoj doprinos. Smisao KOLA je da takve razmene dobiju zapis. Za hibrid KOLO evidentira samo POEN deo. **NEPOZNATO:** nema izricite odredbe o trampi bez POEN-a — izvedeno iz prirode sistema. **[zemljoradnik — 1]**

**P20: Ko odgovara ako rad ima skriveni nedostatak / roba se pokvari / kupac ne preuzme? Garancija, reklamacija, povrat POEN-a?**
**O:** Za ispunjenje, kvalitet i rizik odgovaraju korisnici po obligacionom pravu — Fondacija ne posreduje (Pravilnik čl. 16, 77; FAQ #21). Garancija/rok su tvoj dogovor (najbolje pisani). Tehnicki nema automatskog „storna": povrat se izvodi kao novo dobrovoljno azuriranje evidencije (POEN nazad). Eskalacija: direktno → (sporovi, vidi P/FAQ #31) → sud u Somboru. **NEPOZNATO/prazno:** FAQ nema pitanje o garanciji na izvrsen rad ni o povratu POEN-a. **[majstor, zemljoradnik, mali proizvodjac — 3]**

**P21: Kako odredjujem cenu/kolicine svojih proizvoda i ko ih vrednuje?**
**O:** Ti slobodno odredujes cenu u POEN-ima; Platforma je ne propisuje, ne ogranicava i ne kontrolise (Uslovi čl. 19). Niko ne vrednuje robu umesto tebe (čl. 18). Orijentir 1 POEN ≈ 1 RSD nije obavezujuci. Duzan si dati tacan opis, kolicinu i realan iznos (čl. 20). Napomena: operativni doprinos je drugi kanal — tamo iznos nije slobodan dogovor nego predlozeni POEN u okviru dnevnog limita. **[mali proizvodjac, zemljoradnik — 2]**

**P22: Imam RPG / preduzetnicku radnju / firmu — ulazim kao firma ili kao gradanin? Moze li moja firma biti pokrovitelj?**
**O:** Direktni clan je iskljucivo fizicko lice (ti licno) — gazdinstvo/firma nema nalog (FAQ #25). Tvoja roba/usluge ulaze kao razmena fizickog lica; RPG/preduzetnicke obaveze po opstim propisima ostaju. Firma moze biti POKROVITELJ: pravno lice donira novac/robu/usluge, NE prima POEN, a bonus (7 nivoa, 10.000–1.000.000 RSD) evidentira se u zapisu verifikovanog korisnika koji podnosi prijavu; firma se vidi na rang-listi. **[zemljoradnik, majstor, mali proizvodjac — 3]**

### Programi

**P23: Sta je „Podrska Starijima" — ko ima pravo, od koliko godina, koliko POEN, kako se prijavljujem?**
**O:** Stariji korisnici su jedna od kvalifikovanih grupa (Pravilnik čl. 57). Princip: po verifikaciji statusa Protokol automatski evidentira POEN; nije socijalna pomoc. Prijava kroz platformu, samo za verifikovane. **NEPOZNATO:** starosna granica, iznos i dokaz statusa NISU definisani u kanonskoj dokumentaciji (za razliku od Majki/Posebne brige) — treba odluka vlasnika + zaseban FAQ. **[penzioner — 1]**

**P24: Koliko tacno POEN dnevno po detetu dobijam (Podrska Majkama) i kako uzrast/broj dece utice?**
**O:** **NEPOZNATO kao kanonsko:** parametri se utvrduju posebnim pravilnikom (Pravilnik čl. 57). Trenutni KOD (programi.ts izracunajMajke): baza 2.000 POEN/dan po detetu, −100 po godini uzrasta, × koeficijent po redu deteta [1,00; 1,20; 1,50; 2,00; +0,50 dalje]. Primer (dete 3 god): (2000−300)×1,00 = 1.700/dan. Brojevi iz koda, podlozni izmeni. Vlasnik da odluci da li se javno objavljuju. **[majka — 1]**

**P25: Sta je „dokaz statusa" za program — moram li uploadovati izvod / dokument deteta?**
**O:** Obrada posebnih kategorija po IZRICITOM PRISTANKU, koji se moze povuci (Pravilnik čl. 57). Trenutni KOD (ProgramiKlijent.tsx) trazi samo ime deteta i datum rodenja koje majka sama unosi — NEMA uploada; enrollment odobrava admin. Ti podaci nisu javni. **NEPOZNATO:** konacan dokaz statusa utvrduje poseban pravilnik. **[majka, domacica — 2]**

**P26: Postoji li program za nezaposlene / opstu finansijsku nuzdu?**
**O:** Trenutno ne. Kvalifikovane grupe su majke/staratelji, stariji, posebna briga, skolovanje (Pravilnik čl. 57). Nezaposlenost/siromastvo nisu medu njima. Put je kroz razmenu i operativni doprinos. Nove grupe moze dodati Fondacija (Faza 1) / Gornje Kolo (Faza 2). **[osoba u nuzdi, domacica — 2]**

**P27: Je li ovo posao? Imam li prihod/ugovor/zagarantovan mesecni iznos?**
**O:** Ne. Operativni doprinos „ne uspostavlja radni odnos — nema subordinacije ni naknade" (Pravilnik čl. 36). Princip dva akta: nema ugovora „X → Y", nema potrazivanja. POEN nije plata; nema garantovanog iznosa. **[osoba u nuzdi — 1]**

### Krugovi i kolektivni oblici

**P28: Imam udruzenje/zadrugu koje vec postoji — mogu li ga uvesti kao Krug a da zadrzi pravno postojanje?**
**O:** Da. Postojeca udruzenja/zadruge mogu preneti strukturu u Krug (Pravilnik čl. 55). Krug nema pravni subjektivitet, pa udruzenje/zadruga zadrzava svoj subjektivitet nezavisno — ne gubis nista. **[organizator — 1]**

**P29: Koja je razlika izmedu „Kruga" i „Zadruge" i sta da osnujem?**
**O:** Krug = zajednicki interes/delatnost, bez pravnog subjektiviteta, nastaje udruzivanjem kroz platformu. Zadruga = teritorijalni princip, registrovana po Zakonu o zadrugama, pun pravni subjektivitet, odnos sa Fondacijom kroz ugovor o saradnji (Pravilnik čl. 55, 56). Oba dobijaju POEN po pragovima clanstva. **Napomena:** Modul Zadruge i detaljna pravila u posebnom pravilniku, jos nisu fokus razvoja (🔴 CLAUDE.md). **[organizator — 1]**

**P30: Mogu li clanovi mog Kruga ostati i u drugim grupama, ili je clanstvo ekskluzivno?**
**O:** Ogranicenje „jedan Krug u datom trenutku" odnosi se SAMO na Krugove unutar KOLA — ne dira clanstvo u spoljnim udruzenjima/zadrugama, koja zadrzavaju subjektivitet (čl. 55–56). **[organizator — 1]**

**P31: Dobijam li kao osnivac/organizator posebno priznanje (POEN, status, titulu)?**
**O:** Ne postoje titule (zagovornik/aktivista/glasnik/sampion) — samo tri statusa: Neverifikovan / Verifikovan / Nosilac ZRNA. Za ulogu ovlascenog lica NEMA dodatnog POEN-a. Rad se prepoznaje kroz verifikaciju svakog clana (1.000 POEN verifikatoru), operativni doprinos i preporuke. **[organizator — 1]**

### Tehnika i open-source

**P32: Gde je javni repozitorijum koda? Kako da ga klonira / self-host pod AGPL-3.0?**
**O:** Dokumentacija (Pravilnik čl. 7–8) utvrduje AGPL-3.0 i DCO. **NEPOZNATO:** URL repozitorijuma, hosting platforma i self-host procedura NISU definisani ni u dokumentaciji ni na sajtu. AGPL-3.0 trazi da operator mreznog servisa ucini kod dostupnim korisnicima — objavljivanje repozitorijuma je pravna obaveza cim sistem radi u produkciji. Treba odluka vlasnika. **[programer ×2 — 2, kritican za kredibilitet]**

**P33: Ako posaljem PR — dobijam li POEN? Je li to PED? Moram li biti verifikovan?**
**O:** Doprinos kodom spada u OPERATIVNI doprinos (ne PED/socijalni). Kod se prima pod DCO (Signed-off-by, trajna atribucija) — NIJE prenos autorskih prava ni CLA. Sam doprinos ne trazi clanstvo; ali za evidenciju POEN-a treba biti verifikovan (indeks ≥10%), zadatak objavljuje Fondacija/GK/nosioci ZRNA, izvrsenje verifikuje ovlasceni verifikator. „Predlozeni POEN" je tezinski koeficijent, ne tarifa po satu. **NEPOZNATO/prazno:** mehanizam nije objasnjen iz ugla programera na sajtu. **[programer ×2 — 2]**

**P34: Postoji li javni/developerski API? Mogu li graditi integracije/botove?**
**O:** Postoji eksport sopstvenih podataka (GDPR prenosivost), ne developerski API. **NEPOZNATO:** namenski javni API, dokumentacija endpointa, autentikacija, politika za scraping NISU definisani; svaki API bi morao postovati gradiranu vidljivost (Pravilnik čl. 28–30, 67). Treba odluka vlasnika. **[programer ×2 — 2]**

**P35: Kakav je sigurnosni model? Je li blockchain? Sta sprecava admina da iskuje POEN ili prepise istoriju?**
**O:** Nije blockchain — centralizovana evidencija koju Fondacija hostuje. Zastite: zero-sum invarijanta (svaki POEN ima protivzapis, zbir = nula), determinističke bezdiskrecione operacije (čl. 10), trajni log transakcija i admin pristupa, append-only evidencija. Nepromenljivost je dizajnersko/aplikativno pravilo, NE kriptografska trustless garancija. **NEPOZNATO:** enkripcija u mirovanju, zastita baze od admin manipulacije, backup/DR, hash-lanci — nisu javno dokumentovani. **[kripto, programer — 2]**

**P36: Sta tacno menjaju clanovi u „punom samoupravljanju" i kada nastupa?**
**O:** Dva odvojena praga: (1) Gornje Kolo se aktivira na −1.000.000 POEN — od tada kvadratnim glasanjem aktivnim ZRNOM odlucuje o izmenama Pravilnika, Programima, vecim projektima; Fondacija postaje izvrsni organ. (2) Zastitni veto se TRAJNO gasi kad sredstva dostignu prag finansijske samostalnosti (poseban pravilnik — NE „3× troskovi"). Do tada (Faza 1) sve odluke donosi UO. **[programer, skeptik — 2]**

### Dijaspora (lokalizacija/valuta)

**P37: Mogu li se verifikovati na daljinu iz inostranstva?**
**O:** Da — verifikacija se zasniva na licnom poznavanju i ne zahteva fizicko prisustvo (dokaz_stvarnosti čl. 5, v3.7.3). Verifikacija na daljinu je moguca dok god te verifikator licno poznaje dovoljno da za tebe jemci; zastita pociva na licnom poznavanju, odgovornosti verifikatora i strukturi mreze, ne na zajednickom prisustvu. Iz inostranstva mozes se registrovati i pratiti sistem; pun pristup po verifikaciji (uzivo ili na daljinu). **[dijaspora — 1]**

**P38: U kojoj valuti doniram — mogu li poslati evre iz inostranstva?**
**O:** Donacije_3_7_0.md predvida donaciju „u dinarima ili drugoj valuti". Uplatom na racun Fondacije, Protokol evidentira POEN po koeficijentu (11 nivoa, 1,00–2,00). Donira samo verifikovani korisnik. **[dijaspora — 1]**

**P39: Na kom jeziku radi sistem? Postoji li engleska verzija?**
**O:** Zvanicni jezik je srpski; Pravilnik i Uslovi su na srpskom i merodavni. Interfejs ima i en/hu (messages/en.json, hu.json u kodu). Pravno obavezujuci tekstovi ostaju na srpskom. **Napomena:** uskladiti sa FAQ #8 (koji tvrdnju o jezicima trenutno iznosi nepotkrepljeno).

**P40: Sta KOLO nikad nece traziti od mene (zastita od prevare)?**
**O:** Registracija je besplatna; Fondacija NIKAD ne trazi novac da bi se ukljucio, ni lozinku/PIN/broj kartice/JMBG/sliku LK. Verifikacija je uzivo bez dokumenata. „Uplati pa ces dobiti POEN/novac" nije deo sistema. Svaku sumnju prijavi Fondaciji. **NEPOZNATO/prazno:** zaseban FAQ jos ne postoji — vredi dodati zbog starijih. **[penzioner — 1, visok znacaj]**

---

## 4. Otvorena pitanja za vlasnika (NEPOZNATO — odluka pre objave)

**Pravno/registracija:**
1. Maticni broj i PIB Fondacije — Uslovi imaju placeholder [MATIČNI BROJ]/[PIB]; APR upis „u toku". Ne tvrditi javno da entitet prima donacije dok nije registrovan.
2. Misljenje/odgovor regulatora (NBS, Poreska, Poverenik) — ne postoji nijedan akt; ublaziti „ne mora dozvolu" ili objaviti izvor.
3. Imena „nezavisnih pravnika i ekonomista" — nema; objaviti ili ublaziti.
4. AML/KYC status Fondacije i interni program — nije definisan.
5. Poreski tretman primarnih poljoprivrednih proizvoda i alkohola/akcize — nije razraden.

**Zastita podataka (placeholderi na produkcijskoj /privatnost stranici):**
6. DPO — ime i email su [IME I PREZIME]/[EMAIL DPO-a]; imenovati i objaviti.
7. Hosting provajder, sediste, i odluka A/B o prenosu van Srbije ([NAZIV PROVAJDERA]) — finalizovati Politiku čl. 9 (realno: Opcija B, Neon/Vercel).
8. Analiticki kolacici — [DOPUNITI...] placeholder u čl. 7; obrisati ili popuniti.
9. Neuskladeni domeni: kontakt@ekolo.rs vs privatnost@kolo.rs — uskladiti na ekolo.rs.
10. Tehnicke mere protiv reidentifikacije u maloj sredini (Sombor) — nisu u DPIA.

**Operativno/parametri:**
11. „Bootstrap" lanca jemstva za prvog korisnika bez veze (i za novo mesto / dijasporu / usamljenog starijeg) — nije opisan postupak.
12. Parametri socijalnih programa: starosna granica i iznos za „Podrsku Starijima"; iznosi/uzrasni prag/dokaz za Majke; jedinstvenost deteta po nalogu — kanonski neutvrdeni (kod ima vrednosti, dokumentacija ne).
13. Open-source: URL repozitorijuma, CONTRIBUTING/issue tracker/roadmap, javni API, self-host pravila.
14. Sigurnosni model (enkripcija, zastita baze, backup/DR, hash-lanci) — nije javno dokumentovan.
15. Hibridni oglasi na Pijaci (sme li se eksplicitno navesti RSD komponenta) i garancija/povrat POEN-a kod reklamacije — neuredeno.
16. Scenario gasenja sistema iz ugla korisnika; scenario duze nesposobnosti/bolesti (staratelj nad nalogom) — nema.
17. ZRNO prag upisa: dokumentacija 20.000 POEN vs kod 10.000 (🟡 CLAUDE.md) — uskladiti pre nego sto FAQ navede broj.
18. Formula obracunskog koeficijenta i da li je upis ZRNA potpuno dobrovoljan — precizirati za tehnicku publiku.

---

## 5. Predlog prioriteta

**TALAS 0 — HITNO (netacne tvrdnje sa pravnim/reputacionim rizikom; ispraviti pre svega ostalog):**
1. FAQ #23 — donacije: „18 nivoa, 1×–5×" → **11 nivoa, 1,00–2,00**; dodati „samo verifikovan korisnik". (Sajt sam sebi protivreci; regulator/skeptik to koriste protiv cele konstrukcije.)
2. FAQ #34, #27, #32, #10 — vidljivost: zameniti „sve javno svima" gradiranom vidljivoscu (uz napomenu o 🟡 odstupanju koda).
3. FAQ #8 — verifikacija: ukloniti „pasos/dokument", potvrditi „bez dokumenata/JMBG".
4. FAQ #30, #23 — veto: ukloniti „3× mesecni troskovi" → „prag finansijske samostalnosti (poseban pravilnik)".
5. FAQ #36 — izlazak: ukloniti „ZRNO se otpisuje po koeficijentu".
6. FAQ #19, #31, #38 — prepisati po kanonskom modelu (PED verifikatori; sporovi bez izmisljenog trostepenog; ispravni citati).

**TALAS 1 — prvi talas dodavanja (najtrazenija nova pitanja, presudna za konverziju i poverenje):**
- P1 (chicken-and-egg verifikacija, 8 grupa), P2/P3 (besplatno, prvi POEN), P8 (porez za prodavce/zanatlije, 5 grupa), P5/P40 (sta se ne trazi / zastita od prevare).
- Preostale IZMENITI stavke iz sekcije 2 (16, 17, 18, 20, 24, 25, 26, 29, 35) po predlozima.
- P6/P10 (legalnost/e-novac) i P9 (penzija) — visok rizik/znacaj.

**TALAS 2 — drugi talas (dubinske/specijalisticke teme):**
- Nova sekcija „Tehnika i open-source" (P32–P36) — zavisi od odluka vlasnika #13/#14.
- Privatnost dubinski (P16, P17, P18), dijaspora (P37–P39), kolektivni oblici (P28–P31), programi parametri (P23–P25) — vecina zavisi od NEPOZNATO odluka iz sekcije 4.
- Scenariji gasenja/nesposobnosti (P11, dopuna #37).

**Kljucni izvori za verifikaciju (potvrdeni Read/Grep):** donacije_3_7_0.md čl. 4 (red 41–51: 11 nivoa, 1,00–2,00); Pravilnik_3_7_0.md red 555 („prag finansijske samostalnosti utvrden posebnim pravilnikom" — potvrda da „3× troskovi" NIJE kanonsko).
