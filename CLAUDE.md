# KOLO Platforma — v4.0.0

**Šta je gde.** Ovaj fajl nosi samo ono što vezuje dalji rad: pravila, zabrane i brane — jednom
rečenicom, bez istorije. Obrazloženja, incidenti, opis ekrana i mapa koda žive u `docs/` i
**otvaraju se pre rada na toj temi** — razlozi su ono što drži odbranu.

| Fajl | Šta je unutra |
|---|---|
| **`CLAUDE.md`** (ovaj) | pravila, zabrane, deploy, bumpovanje, 🔴 zamke po temama |
| `docs/funkcionalnosti.md` | **opis svih implementiranih funkcija**, ključni koncepti sa obrazloženjima, API rute, biblioteka `protokol/`, sidebar, admin panel, GAP-ovi |
| `docs/deploy-i-migracije.md` | Vercel topologija (ID-jevi, baze), incidenti migracija, postupak P3009 |
| `docs/prevodi.md` | pravilo prevoda i `admin` namespace-a sa obrazloženjima, alat `scripts/prevodi.mjs` |
| `docs/sprovodjenje-rizika-2026-09.md` | pun zapis odluka po rizicima R-01…R-20 + pun sažetak pravne odbrane |
| `docs/istorija-implementacija.md` | pun zapis izmena 08–09/2026 |
| `docs/istorija-bumpova.md` | hronologija bumpova + pune pouke bumpovanja |
| `docs/registar-rizika-regulatori-2026-09.md` | registar sa ocenama (22 rizika) |
| `docs/podaci-fondacije.md` | opšti podaci Fondacije (APR, banka, tekst poslovnog modela) za obrasce, uključujući lične podatke direktora; bez ličnih podataka članova UO |
| `video/README.md` | sve za videe, uključujući ekipu za pregled teksta naracije |
| `dokumentacija 4.1/` | kanonski set akata — **jedini normativni izvor** |

🔴 **Kad se nešto menja, menja se na jednom mestu.** Merodavan je akt u `dokumentacija 4.1/`,
pa `CLAUDE.md`, pa `docs/`. 🔴 **Nov zapis ide u `docs/`**; ovde se dopisuje samo nova pouka ili
pravilo, jednom-dve rečenice sa pokazivačem. Ne vraćati istoriju i obrazloženja u ovaj fajl —
učitava se u svaku sesiju.

## ⚠️ Deploy i grane (OBAVEZNO poštovati)
Vercel **Production Branch = `production`**. Jedan Vercel projekat `kolo` gradi obe grane (detalji: `docs/deploy-i-migracije.md`).
- **`main`** → TEST (test Neon baza, pun seed) — **`kolo-peach.vercel.app`** ili `kolo-git-main-alvaserbia-progs-projects.vercel.app`. Sav svakodnevni rad. Za proveru sveže promene incognito (CDN keš).
- **`production`** → UŽIVO na **ekolo.rs** (prod baza, `seed-prod.ts`). Samo namerna „objava".

**Pravila za Claude:**
- Podrazumevano radi i guraj na **`main`**. NIKAD direktno na `production` osim kad vlasnik eksplicitno kaže „objavi na ekolo.rs" / „pošalji na produkciju".
- Vlasnik ne barata gitom. Mapiranje komandi:
  - „pošalji na test" → commit + push na `main`. Prevodi **copy-ja** ne moraju biti urađeni; **prevodi akata moraju**.
  - „objavi na ekolo.rs" → **prvo `npm run prevodi:objava`**, pa merge `main` → `production` + push. 🔴 Ako komanda padne, objava **staje** dok se prevodi ne urade. Pre objave proveriti da je `main` čist.
- **Posle puša NE proveravati Vercel buildove** (nema `list_deployments`/`get_deployment` u petlji). Push je kraj posla — javi šta je gurnuto i gde. Buildove proveravati **samo** kad vlasnik izričito pita ili kad build realno može da padne (migracija, `vercel.json`/`package.json`, nova env varijabla).
- **Git u kontejneru:** lokalni `main` ume da bude zastareo — uvek `git fetch origin main` i poredi sa **`origin/main`**.
- 🔴 **NIKAD ne povlačiti tuđe izmene na `main` ni na `production` — guraju se ISKLJUČIVO sopstvene izmene iz tekuće sesije.** Ne merge-ovati, ne cherry-pick-ovati i ne rebase-ovati tuđe grane, PR-ove, forkove ni „zalutale" commit-e, čak i kad deluju gotovo ili se pominju u zadatku. Tuđi commit-i → prijaviti vlasniku i **sačekati izričito odobrenje**. U konfliktu: svoja izmena + tekuće stanje grane. Merge `main` → `production` pri objavi je jedini dozvoljeni merge.
- 🔴 **Grana i `main` se ne guraju u istoj minuti** — dva Preview builda na istoj test bazi se sudaraju.
- Vercel **preskače build** kad se od poslednjeg uspešnog deploy-a menjalo samo ono van sajta (`scripts/vercel-preskoci-build.sh`, `ignoreCommand`). Nov folder van sajta se dopisuje tamo; 🔴 `dokumentacija 4.1/` je deo sajta i nikad ne ide na taj spisak.

### Prevodi (pun zapis: `docs/prevodi.md`)
- 🔴 **Tokom rada menja se isključivo srpski original** — `messages/sr.json` i `src/lib/faq-data.ts`. Prevodi na en/ru/hr/hu idu **u jednom prolazu pred objavu**.
- 🔴 **Akti su izuzeti:** akt i njegovi prevodi idu **zajedno**, u istom bumpu. Šifra u imenu fajla JESTE objava.
- 🔴 **Fallback za nedostajući prevod akta se ne ukida** i nosi napomenu na jeziku čitaoca; napomena **ne sme** sadržati zvaničan disklejmer prevoda (po njemu test razlikuje prevod od fallbacka). Brana: `__tests__/pravni-dokumenti.test.ts`.
- Alat: `npm run prevodi` (izveštaj, uvek prolazi) · `npm run prevodi:objava` (pada ako ima duga) · `npm run prevodi:potvrdi` (upisuje heš srpske vrednosti kojoj prevod ne treba menjati). 🔴 Meri se **razlika prema `origin/production`** — pre toga `git fetch origin production`. 🔴 `prevodi:potvrdi` se ne pokreće da bi spisak bio prazan.
- 🔴 `npm run i18n:check` (apsolutni paritet) i `npm run prevodi` (dug prema produkciji) su dve provere sa dve svrhe — **ne spajati ih**. Brana nije u Vercel build-u, i to namerno.
- 🔴 **`admin` namespace se NE prevodi i ne postoji u prevodima** — živi samo u `sr.json`, a `src/i18n/request.ts` ga dodaje ostalim jezicima. Razlog: panel barata institutima iz akata (prigovor, prijava razmene, prijava oglasa, nadzorni predmet), a loš prevod vodi ka odluci po pogrešnom institutu. Brana je dvostruka: `__tests__/admin-namespace.test.ts`. Ne ukidati je.
- Hardkodovan copy van `messages/` se ne uvodi — tekst ide u `messages/`.

### Migracije (pun zapis: `docs/deploy-i-migracije.md`)
- Primenjuju se **automatski** pri deploy-u (`vercel.json` `buildCommand`: `prisma migrate deploy` kad postoji `DATABASE_URL`). `prisma.config.ts` za CLI skida `-pooler` (advisory lock ne radi kroz pooler, P1002); runtime ide pooled.
- 🔴 **Primenjena migracija se NE dira** — `migrate deploy` izmenjen fajl **tiho preskače**. Svaka izmena posle prvog deploy-a ide u NOV fajl. Provera: `git log --oneline -- prisma/migrations/<ime>/`.
- 🔴 **PALA migracija (P3009) blokira SVE naredne buildove.** Jedini slučaj kad se postojeći fajl sme prepraviti: (1) učiniti ga idempotentnim (`IF EXISTS`), (2) privremeno `prisma migrate resolve --rolled-back <ime> || true` u `buildCommand`, (3) taj korak **ukloniti istog dana** kad build prođe. `kolo-peach` „radi" ne znači da se išta objavljuje.
- 🔴 Nova vrednost enum-a ide u **zaseban** fajl migracije (`..._enum`, pa fajl koji je koristi).
- 🔴 Vremenske oznake migracija se **ne preimenuju** naknadno (već su primenjene preview buildom).

## 🔴 Zabranjene teme i odbijene mere (jedan spisak)

Sve je odluka vlasnika. **Ne predlagati ponovo bez izričitog naloga** — ni kao „samo ideju", ni
usput. Uz svaku stoji razlog, jer razlog sprečava da se predlog vrati u drugom obliku. Pun zapis:
`docs/sprovodjenje-rizika-2026-09.md`.

### Ne dirati POEN i ZRNO

| Zabranjeno | Zašto |
|---|---|
| **Dinarska kapa ili prag na POEN**, u bilo kom kanalu | svaka takva mera je preračun POEN → dinar, dakle povratak odnosa 1:1 koji je R-01 uklonio iz Uslova čl. 19. *„POEN nije vezan za dinar."* Kape u dinarima smeju **samo** na robu iz nabavke (meri se sa računa dobavljača) |
| **Dirati odnos POEN ≈ RSD u tekstu** — prećutati ga (M-7b), ukloniti ili „zaokružiti" iznose u primerima na naslovnoj, ili vratiti bilo koji izraz za paritet u copy | prećutan odnos je prvi protivargument, pa akt kaže da ga Fondacija ne objavljuje i ne primenjuje, a ne da ne postoji; iznosi u primerima su namerni jer odnos izvodi čitalac, ne Fondacija. Brana `r07-obmanjujuca-praksa-izvor.test.ts` |
| **Širiti dozvole identifikovanog člana** — otpis i aktiviranje ZRNA (D-1), glas i delegiranje (C′), potvrđivanje drugih, nadzor, operativni doprinos, socijalni programi, nabavka, pokroviteljstvo, kontakt oglašivača | granica je **učešće** (otvoreno) naspram **upravljanja i jemčenja za druge** (zatvoreno). Otpis je jedino mesto gde položaj donosi prinos; glas podiže R-04, R-10 i R-17. 🔴 Odluka je na dva mesta i samo na njima: `smeProsireno` (`dozvole.ts`) i `smeDaSalje` (`doprinos-pravila.ts`) — ne uvoditi treću proveru |
| **Otpis ZRNA po koeficijentu iz upisa; period vezivanja pre otpisa; tvrda kapa na glasačku moć** | odbijeno 07.09.2026; kvadratni koren (čl. 46) i kapa od 1% po periodu (čl. 19) su jedine kočnice |
| **Vraćanje automatskog upisa POEN-a po kartičnom callback-u** | M-4a je odluka, ne privremeno rešenje |
| **Praćenje obrazaca prepisa POEN-a** | *„nemoguće je sprovesti kontrolu kada je transfer poena slobodan."* Zabrana prodaje POEN-a (Uslovi čl. 24) ostaje nesprovedena kontrola, i to je prihvaćeno |
| **Zabrana prepisa POEN-a pribavljenog donacijom** | tražila bi obeležavanje porekla svakog zapisa i razbila zamenljivost evidencije |

### Porez i novac
- **Pozivanje na izuzeća čl. 9 ZPDG za POEN** — sva su u dinarima i pretpostavljaju isplatu; pozivanje bi bilo priznanje vrednosti.
- **Dobrovoljan obračun poreza po odbitku i PPP-PD prijave** — priznanje da je prihod, a nema iz čega da se obustavi.
- **Godišnja potvrda korisniku o evidentiranom POEN-u** — izgleda kao obračunski list; GDPR izvoz već postoji.
- **Vraćanje dinarskog troška u tabelu sa brojem POEN-a po delu** — odnos se tada dobija deljenjem.
- **Humanitarna nabavka** (red po potrebi, bez praga od 20.000 POEN) — *„Ne radimo takve nabavke."*
- **Sopstveni KYC za velike donacije** — identifikaciju uplatioca sprovodi banka.
- **Izravnat koeficijent / fiksan iznos po nivou donacije** — *„hoću da favorizujem velike donacije."* 🔴 Ali se **tako ne piše** u aktima, FAQ-u ni copy-ju: stoji „veći pojedinačan doprinos ima veći značaj za zajednicu", nikad opis podsticaja.

### Podaci o ličnosti
- **IP adresa ili otisak uređaja uz zapis pristanka** — proširenje obrade radi dokazivanja pristanka.
- **Serverski zapis pristanka na kolačiće za neprijavljenog posetioca** — traži identifikator posetioca.
- **Sklanjanje „Odbij" iz prvog nivoa bannera** — pristanak tada nije slobodno dat.
- **Uskraćivanje funkcija naloga zbog nepotvrđene adrese** — potvrda je meka.
- **Vraćanje imena uplatioca u opis emisije.**
- 🟢 **Nije više zabranjeno (set 4.6.7):** prikaz socijalnog programa redovnim članovima uz pseudonim, naziv programa i iznos. Gostu i novom članu ostaje dnevni zbir; dan sa jednim korisnikom se preskače. 🔴 **Ostaje zabranjeno: prikaz OSNOVA unutar Posebne podrške** (zdravlje, odnosno prinudna raseljenost) i **upis naziva programa u opis zapisa** (opis je trajan i ide u GDPR izvoz).
- **Otvaranje spiska dece po školi** punoletnim nalozima ili nalogu na čekanju.

### Deca
- **Kapa na vrednost pojedinačnog posla deteta** — umesto nje odobrenje roditelja iznad praga.
- **Dugme kojim roditelj obara prepis** — ZOO čl. 56 daje pravo da se obori **ugovor**, ne naš zapis; drugo dete bi završilo u minusu.
- **Ublažavanje odgovornosti roditelja od 15 godina** i **gubitak roditeljskog čitanja razgovora sa punoletnim licem od 15** — čl. 9 st. 3 i čl. 10 st. 5 ostaju netaknuti.

### Nabavka, pokroviteljstvo, upravljanje
- **Kapa na broj nabavki, na udeo opticaja, uslovljavanje učestalosti** — nabavka je redovan projekat.
- **Izmena Statuta radi upisa privredne delatnosti** — osnov iz čl. 7 t. c) već postoji.
- **Izmena Statuta da imenuje Gornje Kolo** — Statut ga ne može učiniti organom (fondacija nema članove ni skupštinu), a problem bi postao vidljiv registracionom organu.
- **Najviše jedan osnivački korak po obračunskom periodu** — tempo ostaje isti.
- **Kućica „nudim u okviru registrovane delatnosti"** na oglasu — „trgovac" se određuje ponašanjem, ne registracijom.
- **Traženje registracije od proizvođača u RAZMENI** — „mala kuća koja prodaje jaja" ne sme se isključiti. U **nabavci** je dobavljač uvek registrovano pravno lice.
- **Pomeranje poništenja POEN-a sa preuzimanja na istek roka za prigovor** — produžilo bi rezervaciju i odložilo zatvaranje nabavke.

### Otvoreno, ne zabranjeno
- **Prijava razmene se osmišljava iznova** (10.09.2026) — zaseban zadatak.
- **Podizanje donje granice za samostalnu registraciju** (13 ili 15 umesto 7) — „ne za sada" (R-11), nije trajna zabrana.
- **Spoljni DPO kao usluga** — nije odbijen, samo za sada nema ko.
- **Pravno mišljenje o čl. 65/67 ZZPL** za standardne ugovorne klauzule — odloženo.

## 🔴 Pravila koja važe uvek

Ako se razidu sa bilo kojim tekstom ispod ili u `docs/`, **merodavno je ovo**.

### Evidencija
1. **Zero-sum.** Zbir svih zapisa, uključujući Protokol, je nula. Protokol ide u minus pri svakoj emisiji.
   🟡 **Zero-sum NE proverava da se stanje slaže sa istorijom.** `Wallet.balance` je zaseban upisan broj, ne zbir transakcija, a `checkZeroSum()` i cron `/api/cron/zero-sum` sabiraju **stanja**. Pri svakom zahvatu u istoriju par `+X`/`−X` ide **ceo i u istoj transakciji**, uz proveru `balance == Σ(ulaz) − Σ(izlaz)` po pogođenom novčaniku unutar te transakcije (obrazac: `protokol/potvrde-parovi.ts`).
2. **U minus sme samo Protokol** — i korisnik, po **tačno šest** osnova iz Pravilnika čl. 14 st. 3 (lista je iscrpna i zatvorena): nadoknada po čl. 20b · poništen prepis po prijavi razmene · otpis prijateljstva · otpis po poništenju potvrde zbog neaktivnosti · prevođenje punoletnog naloga u maloletni (čl. 4d) · otpis po usklađivanju zatečenih potvrda (čl. 22a dokaza stvarnosti). 🔴 **Sedmi se ne može uvesti bez izmene tog člana.** Minus JESTE nadoknada — `jeNadoknada`/`iznosNadoknade`/`raspolozivo` iz `nadoknada.ts` pokrivaju sve slučajeve.
3. **Minus se nikad ne pojavljuje bez reči.** Ko ode u minus dobija sopstveno obaveštenje.
4. **Kapirati na nulu je greška, ne blagost.** Ko je POEN brže potrošio ne sme da prođe jeftinije od onoga ko ga je sačuvao.
5. **Prepis nije emisija.** Ukupan broj POEN-a menjaju samo kanali iz čl. 15 i poništenja. Protivzapis uvek ide **sopstvenim tipom transakcije**, nikad `TRANSFER` ni `EMISIJA_*` — inače brojači putanja i opticaj lažu.
6. **Istorija se ne prepravlja** — ispravka ide protivzapisom (čl. 34).
7. **POEN i ZRNO su celi brojevi** (`INTEGER`). Decimalni su samo obračunski koeficijent ZRNA (`DECIMAL(20,2)`, u kodu „kurs") i RSD (`DECIMAL(12,2)`, klijentu kroz `Number()`). Zaokruživanje emisija `Math.round()`; ZRNO konverzije u korist Protokola — `Math.floor()` za ono što korisnik dobija, `Math.ceil()` za ono što plaća.

### Kod
8. **`emitujPoen()` otvara sopstvenu transakciju** — nikad unutar druge `prisma.$transaction()`. Obrazac: DB promene u jednoj transakciji → `emitujPoen()` sekvencijalno van nje. Okidači kanala (`probajEvidentirati`, `probajNapredovati`) idu van transakcije i **ne bacaju**. Svaka operacija koja menja stanje računa: `prisma.$transaction()`.
9. **Čista pravila žive u `*-pravila.ts`, bez Prisme** — uvozi ih i pretraživač. Servisni sloj (`protokol/*.ts`) ih re-eksportuje, pa server ima jedan ulaz.
10. **Ne prepisivati tabele u ekrane** (ni u ovaj fajl). Tabele nivoa, pragova i koeficijenata čitaju se iz pravila — prepisana vrednost se razilazi pri prvoj izmeni.
11. **Snimljen tekst se ne generiše ponovo pri čitanju** (`ugovorTekst`, `izjavaTekst`, `pristanakTekst`, kalkulacija nabavke). Isto zabranjuje **retroaktivno popunjavanje**: zatečeni redovi ostaju `null`.
12. **Interni identifikatori se ne menjaju** kad se promeni ime na ekranu: `banka-singleton` (= Protokol), `ChatMessage` (= Pričaonica), `/novcanik` (= POEN), `/api/transfer`, `TransactionType.TRANSFER`, `/verifikacija` (= Potvrde), `POSEBNA_BRIGA` (= Posebna podrška). Stari linkovi iz notifikacija i mejlova moraju da rade.
13. **Route handleri:** `params` je `Promise<{id: string}>`, obavezno `await params`. API rute na srpskom.

### Brane
14. **Ekran nije poslednja reč.** Pravilo ne vredi dok kroz njega ne prođe **svaki** prikaz i svaka ruta. Provera je uvek: ko još čita ovaj podatak mimo pravila?
15. **Testovi koji gledaju IZVOR** (`*-izvor.test.ts`) su brana za pravila koja se mogu izgubiti bez vidljivog kvara. Uz takvo pravilo ide i takav test.
16. **Pri ukidanju izraza pokriti sve imenice koje nosi uz sebe** („цепь"/„цепочка", „maloprodajna referenca"/„kurs").
17. **Ne raditi blanket zamenu verzija u aktima** — regularni izraz ne zna na koji akt pokazuje broj.
18. **Pri izmeni ili brisanju odredbe u Pravilniku obavezno proveriti whitepaper** — istu tvrdnju ponavlja svojim rečima, po pravilu u goroj varijanti.

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru. Dve interne jedinice:
- **POEN** — interna obračunska jedinica kojom se evidentira doprinos i učešće u zajedničkom dobru. NIJE novac, valuta, e-novac, platno sredstvo, digitalna imovina, finansijski instrument ni imovinsko pravo; nema nosioca, ne nasleđuje se, nije potraživanje prema Fondaciji (Pravilnik čl. 12–13, 34). Analogija: zapis u matičnoj knjizi.
- **ZRNO** — beleži položaj korisnika; iz aktiviranog ZRNA proizlazi glas u Gornjem Kolu. `UKUPNO_ZRNA = 1.000.000`; glasačka moć `floor(sqrt(aktivno))`.

Sistem funkcioniše kroz Fondaciju, **Krugove** (trenutno ugašen modul), KOLO **Protokol** i korisnike. **KOLO Zajednica** je opisni pojam, nije pravni entitet.

**Statusi:** u bazi i aktima Neverifikovani / Verifikovani / Nosilac ZRNA (`TipKorisnika`: `NEVERIFIKOVAN`/`REGULARNI`/`NOSILAC_ZRNA`); u **interfejsu** nov član / redovan član / nosilac ZRNA. „Početni korisnici" su normativni pojam (`NOSILAC_ZRNA` + `jeOsnivac`, indeks fiksno 100%). NE POSTOJE organizatorske titule, „apostol" ni „Pokret". Admin = kolona `admin` (`AdminNivo`), ne tip korisnika.

**Terminologija u copy-ju:** „lanac potvrda", „potvrdi" (ne „verifikuj"), „Prepiši POEN" (ne „pošalji"), ekran **POEN** (ne Novčanik), „Zabeležen doprinos" (nikad „POEN na čekanju"), „obračunski koeficijent" (nikad „kurs"), „Pričaonica", „Protokol". Imenica za ulogu potvrđivača se ne uvodi. Akti, baza i identifikatori i dalje govore „verifikacija" (brana `copy-ukinuto.test.ts`).

## Kanonska dokumentacija (`dokumentacija 4.1/`) i bumpovanje

17 akata × 5 jezika. 🟢 **Verzija svakog akta čita se iz imena fajla** (`ls "dokumentacija 4.1"/*.md`) — 🔴 ne prepisivati tabelu verzija ovde. Pune pouke i hronologija: `docs/istorija-bumpova.md` (uz svaki nov bump zapis ide **tamo**).

🔴 **Bumpuje se SAMO akt koji se sadržinski menja**; ostali ostaju na svojoj šifri (set namerno nije jedinstven). Uz bump se menja: ime fajla na 5 jezika, mapa u `src/app/(public)/pravilnik/[slug]/page.tsx` (`fajl`, `verzija`), poziv `ucitajPravniDokument` na odgovarajućoj `page.tsx`, labele u `messages/*.json` (`pravne.<doc>.ver`, `meta_<doc>_desc`), spisak `AKTI` u `__tests__/pravni-dokumenti.test.ts`. Pri bumpu Uslova/Politike i `src/lib/verzije-akata.ts`. Provera unakrsnih upućivanja:
```
grep -rn "v4\.[45]\.[0-9]\|verzija 4\.[45]\.[0-9]" "dokumentacija 4.1/"
```
🔴 **Po završetku celog registra rizika ide jedan bump celog seta na 5.0** — poslednji potez, ne usput.

**Pouke (sve su se već desile):**
1. 🔴 **Jedan događaj objave = jedna šifra; pri sudaru sesija ide NAREDNA SLOBODNA šifra.** Pre bumpa `git fetch origin main`; svoje izmene prenositi **na main-ovu noviju verziju akta**, nikad na stariju osnovu (tiho poništava tuđi set).
2. 🔴 **Dopuna seta koji NIJE objavljen ne menja šifru**; dopuna već objavljenog traži nov bump.
3. 🔴 **Treći član šifre je jednocifren** — posle 4.5.9 ide 4.6.0.
4. 🔴 **Pri izmeni ili brisanju odredbe u Pravilniku proveriti whitepaper** — i negativna provera je uspešna provera.
5. 🔴 **Ne raditi blanket zamenu verzija.**
6. 🔴 **Zaostala unakrsna upućivanja se ne ispravljaju u aktima koji se ne objavljuju** (objavljen fajl ne sme da promeni sadržinu); istorijska pozivanja se ne diraju. Briše ih bump na 5.0.
7. 🔴 **Glavni Pravilnik MORA da se bumpuje za nov osnov negativnog zapisa ili uvećanja ukupnog broja POEN-a** (čl. 14 st. 3 je iscrpan), i kad poseban pravilnik menja **trenutak upisa** kanala koji imenuje čl. 15. Bump glavnog Pravilnika povlači DPIA i Pravilnik o učešću dece.
8. 🔴 **Postoje DVA registra rizika**; „R-01" znači **nov** registar (`docs/registar-rizika-regulatori-2026-09.md`).
9. 🔴 **Konflikt u `CLAUDE.md` i registru pri paralelnom radu rešava se SPAJANJEM oba reda.**
10. 🟡 **Sadržinski nepromenjen akt se ne bumpuje.**
11. 🔴 **Hijerarhija čl. 7:** poseban pravilnik uređuje pitanje samo kad KOLO Pravilnik izričito uputi (st. 4), razgraničenje ide po predmetu (st. 3), a akt nižeg ranga ne menja viši (čl. 8 st. 2). Nov akt se dopisuje u čl. 7 st. 2 hijerarhije.

**Stanje seta:** Registar radnji obrade ima **osamnaest radnji**, DPIA **osamnaest rizika** (pet srednjih, trinaest niskih), izuzetaka od negativnog zapisa **šest**. 🔴 Kad se doda radnja obrade, zbir u DPIA se usklađuje istim potezom.

## Pravna odbrana — šta vezuje dalji rad

Pun tekst tabele sa napomenama i obrazloženja: `docs/sprovodjenje-rizika-2026-09.md`. **Otvoriti pre rada na temi.**

**Obrazac svih odbrana:** ne tvrdi se etiketa („POEN nije X") nego se nabrajaju **elementi definicije koji nedostaju**. 🔴 Samokvalifikacija u aktu je slaba: ne pišu se reč „poklon", poreska stopa ni prag koji se menja zakonom.

| Tema | Šta vezuje |
|---|---|
| POEN nije virtuelna valuta (čl. 13) | odnos 1 POEN ≈ 1 RSD služi samo korisniku u sopstvenom oglasu; Fondacija ga ne objavljuje, ne preporučuje, ne primenjuje. Kartična donacija: kapa 100.000 RSD po uplati, 3 dnevno, POEN tek po ljudskoj potvrdi |
| Identifikovan član (`identitetUtvrdjenAt`) | samo po JAVNOJ donaciji; nije četvrti status. Otvoreno: POTRAŽNJA, razgovor, pretraga, upis ZRNA bez glasa, prepis POEN-a. Zatvoreno: vidi Zabranjene teme. Ekran **čita** `smeDaSalje`, ne prepisuje |
| ZRNO nije ulaganje (čl. 25) | upis i otpis su neutralni za koeficijent, koji **može da padne**. Nikad ne pisati da upis diže koeficijent ni da se otpisom „dobija više" |
| POEN nije prihod | dinar dodiruje samo račun. Granica 100.000 RSD godišnje vrednosti preuzetih dobara živi u `nabavka-pravila.ts`; uz prikaz **ni reči o porezu** |
| Nabavka nije privredna delatnost (čl. 3a) | Fondacija ne sme primiti naknadu; nepreuzeti delovi se ne prodaju |
| Gornje Kolo je telo, ne organ | odluka se upućuje UO, koji ne ceni celishodnost; odbija samo po zatvorenoj listi (čl. 51). Dinarska strana ostaje preporuka |
| Operativni doprinos nema naručioca | u Fazi 1 Fondacija objavljuje **u ime zajednice**; POEN se ne izražava kao vrednost vremena rada |
| Osnivački doprinos | udeo osnivača raste na ~24%, objavljeno; pravilnik ne obećava postupnost |
| Pokroviteljstvo | koeficijent = donacija × **1,20**, obrazložen **odricanjem**; pokrovitelj ne stiče pravo na logotip ni promociju; samo novac, min. 10.000 RSD |
| Donacije | tabela se nastavlja **bez kraja** (1–2–5, +0,10); `RANG_TABELA` je samo zaključan deo, prag se računa (`pragZaNivo`). Prag nivoa 1 je 0. Ugovor za svaku donaciju, tekst se snima |
| Nelojalna praksa (Uslovi čl. 22b) | Fondacija ne nastupa na tržištu; maloletnik ne nudi ograničena dobra ni van oglasa |
| Prigovor (Uslovi čl. 37a) | jedan institut, devet vrsta, 3 otvorena **po vrsti**. Ispravka evidencije **nije povraćaj**. Ulaz je profil; dugme uz prepis se **ne vraća** |
| Pranje novca | samo bezgotovinski; POEN samo u zapis onoga čijim je sredstvima uplaćeno; mere su dobrovoljne. Prag izjave o poreklu u kodu (`PRAG_PROVERE_POREKLA_RSD`) |
| Dokaz pristanka (R-06) | `ZapisPristanka` sa snimljenim tekstom, **bez IP i otiska**, u istoj transakciji sa `user.create`, dva reda. `PRISTANAK_NA_AKTE_TRAZI_SE = true` i ne gasi se. Roka od 15 dana nema. DPO nije određen (opcija C) |
| Posebne kategorije | prikaz socijalnog programa uz pseudonim (set 4.6.7); nosiva mera je izostavljanje **osnova**. Uslov „bez dece" je `BEZ_DECE` u `protokol/deca.ts` |
| Prekogranični prenos | izvršavanje i baza u EU — `vercel.json` `regions: ["fra1"]` je mera zaštite, zaključana testom |
| Prestanak statusa | to je **pseudonimizacija, ne anonimizacija** |
| Socijalni programi | pristanak **pre** traženja potvrde; povlačenje pristanka briše unete podatke; mejl i push nose neutralan tekst |
| Deca | do 15 godina dete sa punoletnima niti razmenjuje niti komunicira. Prepis iznad praga (5.000 za 7–14, 20.000 za 15–17) čeka roditelja 7 dana. Postupak potvrde postojanja deteta: obe strane, 60 dana, bez nadoknade |
| Nalog je neprenosiv (Uslovi čl. 24) | zabranjeno ustupanje, iznajmljivanje i prodaja naloga |
| ZRNO ne daje pravo na sredstva Fondacije | ni neposredno ni posredno, ni kroz projekte i nabavke |
| Iznos u oglasu | 🔴 **nikad ga ne određuje Fondacija** — određuje ga onaj ko postavlja oglas, strane smeju da dogovore („Po dogovoru" ostaje). Ne pisati „vrednost određuje zajednica" ni „Fondacija procenjuje" (Owenova berza rada) |

## 🔴 Zamke po temama — pravila koja se lako tiho izgube

Jedna rečenica po zamci; opis i razlozi u `docs/funkcionalnosti.md` i `docs/istorija-implementacija.md`.

**Dokaz stvarnosti i POEN po potvrdi**
- Čin potvrde (indeks +10 p.p., pun pristup) se **ne vezuje za uslov**; čeka samo zapis POEN-a, do **prvog potvrđenog doprinosa** (oglas, javna donacija, pokroviteljstvo, operativni doprinos). Punoletstvo je izuzeto.
- Nadzornikovih 500 imaju svoje stanje (`nadzorPoenStatus`); plaća se rad, ne saglasnost. Kaskade moraju da znaju za `ZABELEZEN`.
- Fondacija **utvrđuje** da je uslov ispunjen — nigde ne pisati da POEN „dodeljuje". FAQ 53 se ne skraćuje.
- Nadzor ima tri ishoda; slot dopunjava samo `UREDNO`; roka nema. Lažnost se ceni **po čoveku** — ne vraćati „poništi sve verifikacije ovog verifikatora".
- Dete **ne ulazi u lanac potvrda** ni kao meta. Početni ne može biti meta verifikacije.
- `/verifikacija`: levo radnje, desno ono što se čita. 🔴 Klase `kolo-dugme-primarno`, `kolo-dugme-sekundarno`, `kolo-input` **ne postoje** — ne uvoditi ih.
- Spisak onih čiji se prvi doprinos čeka je **jedna** komponenta (`SpisakCekanja.tsx`), bez iznosa po čoveku.

**POEN ekran**
- Zabeležen doprinos je zaseban red i **nikad se ne sabira** sa stanjem. Sve što čeka ide u jedan broj razložen **po tome na koga se čeka**; rezervisano za nabavku se u taj zbir **ne dodaje**.
- Ko ne sme da prepisuje vidi **nulu** kao veliki broj, a red „Na tvom zapisu" se **ne sme izostaviti**. Novom članu se sklanja dugme, skener i `?plati=`; „Moj QR" ostaje.
- Ključ `zabelezene_potvrde_opis` se ne briše (traži ga `potvrda-uslov-izvor.test.ts`).

**Pristanak i vidljivost**
- Gejt za pristanak je **prekrivač**, ne redirect (redirect je pravio petlje). Jedan izvor istine `pristanakStatus()`; `useMePatch()` ostaje stabilan.
- Pseudonim u evidenciji vidi samo potvrđen član (Pravilnik čl. 67); vidljivost sprovodi **server**, ne ekran. Pseudonim oglašivača na Pijaci je javan, ali se ne povezuje sa evidencijom.
- Spiskovi na `/sistem` i `/pocetna` su **jedna** komponenta (`SistemListe.tsx`) i isti uslovi (`USLOV_RAZMENE`, `BEZ_DECE`). Prikaz socijalnog programa odlučuje **samo** `protokol/program-prikaz.ts`.
- U adresu profila ide pseudonim (`profilHref()`), u sve što se čuva interni id. Nova statička podruta pod `/profil/` → dopuniti `REZERVISANI_PSEUDONIMI`.

**Deca**
- Profil maloletnog naloga se punoletnima **ne otvara** (server vraća `zatvoren`); oglas deteta ide kroz `smeDaVidiOglas` u **svakom** prikazu.
- Prijateljstvo nosi 500 tek kad su **obe** strane `AKTIVNO`; raskid otpisuje obema i sme u minus. Roditelj **ne čita** razgovore između dece.
- Aktivno dete se broji **istim** `USLOV_AKTIVNO_DETE` svuda. Škola ne nosi POEN; briše se na tri mesta. Šifarnik škola generiše `scripts/uvezi-skole.mjs`.
- Prijava poruke je **ukinuta**; ne mešati sa prijavom oglasa, koja radi.

**Pijaca, kanali, nabavka**
- Beleženje ≠ evidentiranje (čl. 40a): prvi oglas ide kroz odobrenje Fondacije; jednokratnost drži baza. Uklanjanje oglasa i odbijanje u tabu su dve različite odluke.
- Doprinos razmeni (čl. 40b): kapu drži baza; „razmena" = upis POEN-a, nema modela `Razmena`.
- Moderacija: **uklanjanje, nikad prepravka** tuđeg oglasa; razlog obavezan.
- Mesto je jedno naselje iz šifarnika, provera samo u `razresiNaselje()`.
- Prepis po prijavi razmene: protivzapis tipom `PONISTENJE_PREPISA`, nikad `TRANSFER`.
- Nabavka: kalkulacija se snima pri objavi; parametri **pre** ponuda; POEN se rezerviše pri potvrdi, gasi pri preuzimanju (`OTPIS_NABAVKA`). Projektni odliv ide u `ProjekatTrosak`, **nikad** `FondacijaTrosak`. Crona `glasanje-zatvaranje` i `nabavke` su obavezna.

**Programi**
- Socijalni program traži indeks ≥ 10%; obustava ispod 10%. Rokovi samo kroz `rokReverifikacije`. Unete podatke vidi i odlučuje **samo superadmin**. `Transaction.enrollmentId` je veza, ne naziv; zatečeni redovi ostaju `null`. `OsnovPodrske` ima dve vrednosti — ne dodavati treću.
- Školovanje: dokaz je **izjava**, isprave se ne traže.
- Operativni doprinos: predloženi POEN × min(1, L/P); izvršenje verifikuju nosioci ZRNA / UO, uz proveru sukoba interesa.

**Moduli i ostalo**
- Krug i pokroviteljstvo: prekidač je `src/lib/moduli.ts` (bez importa). 🔴 Ne brisati tabele, podatke ni enum vrednosti ugašenog modula (zero-sum, opticaj). FAQ se filtrira u `FaqStranica.tsx`, ne u `getFaqSekcije()`.
- Sistemska obaveštenja **nisu bilten** (Politika čl. 8); `pravniOsnov` je obavezan; samo superadmin.
- Mejl: odjava je POST, ne GET. GA: događaji samo kroz `dogadjaj()`, adrese kroz `ocistiAdresu()`; nikad za maloletni nalog.
- Slike idu na Cloudflare R2 (`src/lib/skladiste.ts`), u bazu samo javni URL.
- Pri izmeni akata posle puštanja u rad: nov red `PolitikaVerzija` i obaveštenje bez odlaganja.

## 🔴 Ko je ko (odluka vlasnika, 2026-09-23)

**UO Fondacije čine troje: Danijel, Jelena, Stefan.** Vlasnik (pseudonim `dr.nikola.šarić`) je **direktor**, ne član UO. **Mihajlo** je pomoćni programer, ne član UO. Svih petoro su početni članovi i nosioci ZRNA (`jeOsnivac = true`) — 🔴 to se sa članstvom u UO **ne izjednačava**.

🔴 **Zamka sa imenom Jelena:** u bazi su `Jelena` (UO), `Jelena N.`, `Jelena1710.` i `jellena92` (roditelj deteta `Lazar`, nije iz UO). „Jelena" znači ona iz UO; ostale imenovati punim pseudonimom.

🔴 **Admin panel je alat OPERATIVE, ne organa.** Kolonu `admin` drže direktor i pomoćni programer; niko iz UO nema nivo. Brana oko `admin` namespace-a time **nije** oslabljena.

🔴 **Otvoreno:** četiri radnje koje akti daju UO idu danas kroz admin kapiju — sprovođenje odluke Gornjeg Kola (čl. 51, `jeSuperadmin`), zaštitni veto (čl. 48, `jeSuperadmin`), odgovor na dinarsku preporuku (čl. 20, `jeAdmin`), verifikacija operativnog doprinosa u Fazi 1 (čl. 36, `jeAdmin`). 🔴 **Ne rešavati davanjem `admin` nivoa članovima UO**; rešenje je sopstvena kapija „član UO". Zaseban potez, samo uz nalog vlasnika. Tekuće stanje kolone čita se iz baze, ne prepisuje ovde.

## Tech stack i konvencije
- Next.js 16 (App Router), TypeScript, PostgreSQL + Prisma 7 (klijent u `src/generated/prisma/`, runtime `@prisma/adapter-pg`), NextAuth, Tailwind v4, next-intl (osnovni jezik srpski latinica; jezik cookie-om, bez URL prefiksa).
- **Nema zod-a, decimal.js ni sličnog** — validacija ručno, Decimal kroz `Number()`.
- `PROTOKOL_WALLET_ID = "banka-singleton"`. Zero-sum provera automatski u `emitujPoen()` u dev modu.
- Fontovi moraju da podržavaju srpsku latinicu (č, ć, š, ž, đ).
- Testovi: Vitest, `npm test`, fajlovi u `__tests__/` (`@/` → `src/`).
- Struktura: `src/app/(app)/` autentifikovane stranice, `src/app/(public)/` javne, `src/app/pijaca/` sopstveni layout, `src/lib/protokol/` logika Protokola, `messages/` prevodi, `prisma/` šema i migracije. `dokumentacija 4.0/`, `3.9/`, `3.8/`, `nova dokumentacija/`, `dokumentacija/` su **istorija**, ne čitati kao važeće. Pun spisak ruta i biblioteke: `docs/funkcionalnosti.md`.

## Videi
Tekst za naraciju se pre slanja pregleda kroz stalnu ekipu od četiri uloge (bez lektora; čuvar sadržaja izbačen 29.09.2026). Pravila pregleda, stil i zabranjene reči: `video/README.md`.

## Otvoreni GAP-ovi
Vode se u `docs/funkcionalnosti.md` (odeljak „Nezavršeni TODO"). Najvažniji: Pijaca badge se ne nuluje (layout `src/app/pijaca/` je van `AppShell`-a), `POCETNI` legacy JWT-fallback u `proxy.ts`, DPA ugovori obrađivača nisu prikupljeni, GA rok čuvanja (14 meseci) naspram Registra (12) ide uz naredni bump Politike.
