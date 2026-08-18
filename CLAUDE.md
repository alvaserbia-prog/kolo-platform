# KOLO Platforma — v4.0.0

## ⚠️ Deploy i grane (OBAVEZNO poštovati)
Vercel **Production Branch = `production`**. Podela okruženja:
- **`main`** → TEST deploy (test Neon baza, pun seed). Gleda se na **`kolo-peach.vercel.app`** (kratak alias, vidi topologiju ispod) ili na auto URL `kolo-git-main-alvaserbia-progs-projects.vercel.app`. Ovde ide sav svakodnevni rad.
- **`production`** → UŽIVO na **ekolo.rs** (prod Neon baza, `seed-prod.ts`). Samo namerna „objava".

**Pravila za Claude:**
- Podrazumevano radi i guraj na **`main`** (= test). NIKAD ne guraj direktno na `production` osim kad vlasnik eksplicitno kaže „objavi na ekolo.rs" / „pošalji na produkciju".
- Vlasnik ne barata gitom. Mapiranje komandi:
  - „pošalji na test" → commit + push na `main`.
  - „objavi na ekolo.rs" → merge `main` → `production` + push na `production`.
- Pre „objave" proveri da je `main` čist i da test izgleda ispravno.
- **Posle puša NE proveravati Vercel buildove** (nema `list_deployments`/`get_deployment` u petlji, nema čekanja da build pređe u READY). Push je kraj posla — javi šta je gurnuto i na koju granu, i tu stani. Vlasnik sam gleda sajt; ako nešto pukne, reći će. Buildove proveravati **samo kad vlasnik izričito pita** („da li je prošlo", „puca li build") ili kad je promena takva da build realno može da padne (migracija, izmena `vercel.json`/`package.json`, nova env varijabla).
- **Napomena o git okruženju:** u remote kontejneru lokalni `main` može biti zastareo (klon u trenutku startovanja). Pre poređenja uvek `git fetch origin main` i poredi sa **`origin/main`**, ne sa lokalnim `main`.
- 🔴 **NIKAD ne povlačiti tuđe izmene na `main` ni na `production` — guraju se ISKLJUČIVO sopstvene izmene iz tekuće sesije.** Konkretno: ne merge-ovati, ne cherry-pick-ovati i ne rebase-ovati tuđe grane, PR-ove, forkove ni „zalutale" commit-e u `main`/`production`, čak i kad deluju gotovo ili kad se pominju u zadatku. Ako se u toku rada naiđe na tuđe commit-e (npr. na grani sa koje se kreće, ili u konfliktu), prijaviti vlasniku i **sačekati izričito odobrenje** — ne uvlačiti ih samoinicijativno. Isto važi i pri rešavanju konflikata: uzeti svoju izmenu i tekuće stanje grane, ne uvlačiti dodatni tuđi rad usput. Merge `main` → `production` pri „objavi" je jedini dozvoljeni merge, i on prenosi samo ono što je već ranije gurnuto na `main` kroz ovo pravilo.

### Vercel topologija — JEDAN projekat `kolo` (od 2026-06-04; kolo-peach re-pointovan 2026-06-12)
**PROMENA 2026-06-04:** stari `kolo-platform` projekat (`prj_F8dvteluVkzxlGzIMfpvXqWJD2yC`) je **isključen** — više ne gradi (poslednji deploy `d8bc6fc`, ~3. jun). Sada **jedan projekat `kolo`** (`prj_xVaJlVaSzPl7rYnF1lM4WXwE6Y8m`, team `team_YswkbIApgJlmqdQLJJu8SLDE`) gradi **obe grane** istog repoa (`alvaserbia-prog/kolo-platform`).

**PROMENA 2026-06-12:** domen **`kolo-peach.vercel.app` je prebačen sa starog (zamrznutog) projekta na projekat `kolo`, grana `main`** (Domains tab: `kolo-peach.vercel.app → main`). Više NIJE zamrznut — sada je **kratak alias za TEST** i služi poslednji `main` build sa test bazom. (Raniji tekst „kolo-peach ZAMRZNUT, ne koristiti" više NE važi.)

| Grana | Vercel target | URL | Baza (Neon) |
|---|---|---|---|
| **`production`** | production | **ekolo.rs** / www.ekolo.rs | prod (`ep-empty-forest-alajuasx`) |
| **`main`** | preview | **`kolo-peach.vercel.app`** (= test alias) ili `kolo-git-main-alvaserbia-progs-projects.vercel.app` | test (`ep-old-sky-aleg2alm`) |

- „pošalji na test" = push na `main` → gleda se na **`kolo-peach.vercel.app`** (ili dugi auto URL). Zbog CDN keša, za proveru sveže promene koristiti **incognito**.
- „objava na ekolo.rs" = merge `main` → `production` + push (nepromenjeno).
- **Env varijable po grani/scope-u:** Production scope (prod baza, tajne za ekolo.rs: `PLACANJE_AKTIVNO`, `NESTPAY_*`) vs Preview scope (test baza). Oba imaju `DATABASE_URL`, pa migracije rade i na test i na prod buildu.

### 🔴 Primenjena migracija se NE dira — `migrate deploy` je TIHO preskače (2026-08-17)

`prisma migrate deploy` **ne proverava kontrolni zbir već primenjenih migracija.**
Izmenjen fajl se preskoči **bez greške i bez upozorenja**, a deploy prođe kao da je
sve u redu. Raniji zapis u ovom fajlu je tvrdio suprotno („oborila bi kontrolni zbir
i deploy") — to nije tačno, i pogrešno je na gori način: kad bi deploy pucao, videlo
bi se odmah.

Desilo se upravo to: dopuna backfill-a dopisana je u `20260817120100_deca_unapredjeni_model`
pošto je ta migracija već bila primenjena na test bazu (04:01). Build u 07:30 je
prošao **READY**, a backfill nije upisao nijedan red. Ispravka je otišla u zasebnu
migraciju `20260817130000_deca_poziv_backfill`, uz `WHERE NOT EXISTS` da bude
idempotentna.

**Pravilo:** svaka izmena posle prvog deploy-a ide u NOV fajl. Provera pre puša:
`git log --oneline -- prisma/migrations/<ime>/` — ako migracija ima više od jednog
commita, verovatno je već primenjena negde.

🟡 **Uz to: dva builda na istoj test bazi u istom trenutku se sudaraju.** Push na
granu i na `main` u razmaku od nekoliko sekundi pokreću dva Vercel builda, oba
Preview scope, oba sa istim `DATABASE_URL`; jedan je pao sa `db_unreachable`
(Neon endpoint je bio uspavan, pa je hladan start primio dve direktne konekcije).
Migracija je već bila primenjena, pa šteta nije nastala, ali **grana i `main` se ne
guraju u istoj minuti** — prvo jedno, pa kad build prođe, drugo.

### Migracije se primenjuju AUTOMATSKI pri deploy-u
`vercel.json` → `buildCommand`: `if [ -n "$DATABASE_URL" ]; then prisma migrate deploy; fi && npm run build`.
- Migracije se primenjuju **same** na bazu okruženja preko Vercel `DATABASE_URL` (prod→prod, test→test). **Nema više ručnog `npx prisma migrate deploy`** posle deploy-a.
- Guard `if DATABASE_URL` znači da okruženja **bez baze** preskaču migraciju i ne pucaju; gde baza postoji, neuspela migracija i dalje **glasno** obara build (prethodni deploy ostaje živ).
- `prisma.config.ts` čita `datasource.url` iz `process.env.DATABASE_URL` (datasource u šemi nema `url`, jer runtime koristi `@prisma/adapter-pg`).
- **VAŽNO — migrate ide DIREKTNO, ne preko poolera (fix `4e75948`, 2026-06-04):** `prisma.config.ts` skida `-pooler` iz `DATABASE_URL` za Prisma CLI. Razlog: `prisma migrate deploy` uzima Postgres advisory lock koji ne radi kroz Neon pooler (PgBouncer) → puca sa **P1002** (timeout na `pg_advisory_lock`, 10s) i obara build. Runtime klijent (`@prisma/adapter-pg`) i dalje koristi **pooled** `process.env.DATABASE_URL` — direktna konekcija važi samo za CLI. (Neon direktni host = pooled host bez `-pooler`.)

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru. Koristi dve interne jedinice:
- **POEN** — interna obračunska jedinica kojom se evidentira doprinos i učešće u zajedničkom dobru (NIJE novac, NIJE imovinsko pravo; beleži činjenicu doprinosa, bez vrednosti van sistema — analogija: zapis u matičnoj knjizi)
- **ZRNO** — interna obračunska jedinica koja beleži položaj korisnika; iz aktiviranog ZRNA proizlazi glas u Gornjem Kolu

Sistem funkcioniše kroz Fondaciju, mrežu **Krugova** (lokalnih operativnih grupa), KOLO **Protokol** (softverski protokol) i korisnike. **KOLO Zajednica** je opisni pojam za sveukupnost svih korisnika platforme — nije pravni entitet i nema organe.

## Kanonska dokumentacija (folder `dokumentacija 4.1/`)
**AŽURIRANO 2026-08-18 (jedanaesti put):** ceo set je dignut na **4.3.4** — svih 16 akata (sr + en/ru/hr/hu). Povod je **sopstvena elektronska adresa maloletnog korisnika** i **roditeljsko postavljanje nove lozinke** (vidi sekciju „Povratak u nalog deteta" ispod). Sadržinski su izmenjeni:
- **Pravilnik o učešću dece** — nov **čl. 7a** (adresa je dobrovoljna, svrha ograničena na ponovni pristup nalogu, upis tek po potvrdi sa same adrese, veza važi 24 sata, uklanjanje u svakom trenutku, zadržava se pri prelasku u punoletni nalog, briše se prestankom svojstva korisnika, adresa roditelja iz čl. 4a se ne dira) i dopuna **čl. 10** (roditelj postavlja novu lozinku, stara se ne traži, dete se obaveštava).
- **Politika privatnosti 4.7** — nova alineja o adresi deteta, dopunjene kategorije podataka i rok čuvanja.
- **Registar radnji obrade, radnja br. 11** — kategorije podataka, pravni osnov, rok čuvanja i mere. Nova radnja NIJE dodata: adresa je nov podatak unutar iste obrade.
- **DPIA** — rizik **R16** dopunjen, mere **5.11** dopunjene sa tri stavke (potvrda adrese, svrha uža od kanala, izlaz i bez adrese).

🔴 **Ovim je zatvorena praznina zapisana pri uvođenju funkcije** — do 4.3.4 je kod prikupljao imejl maloletnika, a akti su govorili samo o adresi RODITELJA po legitimnom interesu. Test `pravni-dokumenti.test.ts` sada traži odredbe čl. 7a i čl. 10 doslovno, na sr/en/ru.

🟡 **Pri ovom bumpu je `main` bio jedan commit ispred** (prevodi, ruski na „ti"); grana je pre izmene dokumenata dovučena na tu osnovu, po pravilu da dokumenta nove verzije nastaju iz najnovije osnove.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Istorijska pozivanja na ranije setove namerno su ostavljena kakva jesu.

**AŽURIRANO 2026-08-18 (deseti put):** ceo set je dignut na **4.3.3** — svih 16 akata (sr + en/ru/hr/hu). Povod je **ranglista škola** (vidi sekciju „Ranglista škola" ispod). Sadržinski su izmenjeni:
- **Pravilnik o učešću dece** — dopuna **čl. 7** (školu navodi sámo dete, izborom sa spiska; nije uslov za korišćenje naloga) i **dva nova člana**: **čl. 15a** (škola i pregled po školama — zbirni pregled bez podataka o ličnosti, pojedinačni pregled jedne škole prijavljenima, promena najviše jednom u trideset dana, brisanje pri punoletstvu i prestanku statusa, bez istorije ranijih izbora, mesto na listi ne donosi POEN) i **čl. 15b** (pristup profilu maloletnog korisnika).
- **Politika privatnosti 4.7** — škola u kategorijama podataka, pregled po školama, zatvoren profil; rok čuvanja dopunjen.
- **Registar radnji obrade, radnja br. 11** — dopuna kategorija podataka i mera. Nova radnja NIJE dodata: škola je nov podatak unutar iste obrade.
- **DPIA** — rizik **R16** dopunjen (škola spaja pseudonim sa mestom), mere **5.11** dopunjene sa tri stavke.

🔴 **Zatvaranje profila je SUŽAVANJE zatečenog obima** — do 4.3.3 je profil maloletnog naloga bio dostupan svakom potvrđenom članu. Zato je lako obrazložiti u proceni uticaja, ali i lako tiho izgubiti pri sledećem bumpu; test `pravni-dokumenti.test.ts` traži odredbe čl. 15a i 15b doslovno, na sr/en/ru.

🟡 **Zašto 4.3.3 odmah posle 4.3.2, istog dana.** Dve sesije su nezavisno digle set sa 4.3.1: jedna zbog izjave kao dokaza statusa za Školovanje (4.3.2), druga zbog škole i zatvorenog profila. Kad je sudar uočen, izmene škole su prenete na osnovu sa `main`-a i dobile **nov broj**, umesto da se utope u već objavljen 4.3.2 — odluka vlasnika. Pouka je stara i zapisana je već dvaput: **dokumenta nove verzije moraju nastati iz najnovije osnove na `main`-u**, a pre bumpa ide `git fetch origin main`.

🟡 **Usput ispravljeno pri ovom bumpu:** pri prethodnom su preimenovani fajlovi, ali su **unutrašnja unakrsna upućivanja ostala na `v4.3.1`** (59 mesta u DPIA, Registru, Gornjem Kolu i Pravilniku o učešću dece) — sada su na `v4.3.3`. Istorijsko „Modul 4 aktiviran **DPIA v4.3.0**" namerno je ostavljeno. U testu je komentar o pragu od 10% blanket zamenom bio pomeren na 4.3.2, a pravilo je uvedeno setom **4.3.1** — vraćeno.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Istorijska pozivanja na ranije setove namerno su ostavljena kakva jesu.

**AŽURIRANO 2026-08-18 (deveti put):** ceo set je dignut na **4.3.2** — svih 16 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da **program Školovanje obuhvati i učenike osnovne i srednje škole**, ne samo studente, i da se **status dokazuje IZJAVOM, ne ispravom**. Sadržinski su izmenjeni **Pravilnik o programima podrške** (čl. 3 i čl. 13), **Registar radnji obrade** (kategorije lica) i **Whitepaper** (početne grupe); ostali akti su samo dignuti radi jedinstvene verzije seta.

🔴 **Dokaz statusa za Školovanje je izjava pod punom odgovornošću** (čl. 13 st. 2 i 3): za maloletnog korisnika daje je roditelj odnosno zakonski zastupnik i njome potvrđuje da je dete redovno upisano u školu odnosno na fakultet; punoletni korisnik daje je sam. **Potvrde o upisu i druge isprave se NE traže** — ne dostavljaju se i ne prikupljaju. Neistinita izjava povlači mere iz Uslova (suspenzija, isključenje), prestanak evidentiranja i poništenje već evidentiranog POEN-a protivzapisom. Uz to važi i zatečena verifikatorska potvrda iz čl. 4 (svi verifikatori podnosioca, bez uvida u unete podatke).

Iznos se nije menjao — fiksnih 2.000 POEN dnevno po čl. 13, što `programi.ts` već isplaćuje, pa proširenje kruga korisnika nije tražilo nijednu izmenu koda.

🟢 **Pokroviteljstvo je UKLJUČENO 2026-08-18** (`POKROVITELJSTVO_AKTIVNO = true`). Vratile su se stranice, rute, navigacija, admin tab, ranglista na `/sistem` i FAQ pitanja 24 i 25. Sekcija FAQ-a zove se sada „Pijaca, donacije i pokrovitelji". **Krugovi ostaju ugašeni.**

**AŽURIRANO 2026-08-18 (osmi put):** ceo set je dignut na **4.3.1** — svih 16 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da **za učešće u socijalnim programima bude dovoljna jedna potvrda, tj. indeks stvarnosti od 10%** umesto punog indeksa od 100%. Sadržinski su izmenjeni **Pravilnik o programima podrške** (čl. 4 st. 1), **Politika privatnosti** (4.6 — posebne kategorije podataka) i **Registar radnji obrade** (radnja br. 10, mere zaštite); ostali akti su samo dignuti radi jedinstvene verzije seta. Bump je urađen zato što je tekst izmenjen POSLE objave 4.3.0 (set je gurnut 17.08.2026), pa bi fajl sa imenom 4.3.0 govorio nešto drugo nego kad je ta verzija objavljena.

🔴 **Prag je sada isti kao za operativni doprinos** — funkcionalnih 10% (`FUNKCIONALNI_PRAG_INDEKSA`), koji je i inače uslov pristupa programima po čl. 4 Pravilnika o dokazu stvarnosti. **Anti-malverzaciju NE nosi visina indeksa nego čl. 4 st. 2** — potvrda SVIH verifikatora podnosioca pod punom odgovornošću, bez uvida u unete podatke, uz tvrdu blokadu dok svi ne potvrde. To pravilo je netaknuto, ali treba znati posledicu: pri indeksu od 10% podnosilac ima **jednog** verifikatora, pa tvrda blokada počiva na jednoj osobi umesto na deset. Ako to postane problem, rešenje je poseban minimum broja potvrda u čl. 4, ne vraćanje praga indeksa.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Istorijska pozivanja koja govore da su Modul 3 i Modul 4 aktivirani **DPIA v4.3.0** namerno su ostavljena na 4.3.0 (Registar radnji obrade, radnje 10 i 11) — blanket zamena bi ih učinila neistinitim.

**AŽURIRANO 2026-08-17 (sedmi put):** ceo set je bio dignut na **4.3.0** i od sada ima **16 akata** (sr + en/ru/hr/hu). Povod je usvajanje **Pravilnika o učešću dece** (`ucesce_dece_4_3_4.md`, pri usvajanju `_4_3_0`) — nov, šesnaesti akt, uz koji je unapređeni Modul Deca dobio pravni osnov. Sadržinski su izmenjeni:
- **Pravilnik o KOLO sistemu** — čl. 14 st. 3 (tri izričito nabrojana izuzetka od zabrane negativnog zapisa + zatvarajuća odredba da se dalji ne mogu ustanoviti), **čl. 15 t. 9 — DEVETI KANAL** (doprinos dece u dečjem prostoru; automatski akt Protokola izvan dnevnog limita), čl. 16 (poništenje prepisa po prijavi razmene), čl. 34 (nadoknada → „negativan zapis po čl. 14 st. 3"), čl. 58 (prepisan: samostalno pristupanje maloletnog lica, odgovornost roditelja, upućivanje na nov pravilnik).
- **Uslovi korišćenja** — čl. 7 (maloletna lica od 7 godina, dva ulaza), čl. 25 (prijava poruke), **čl. 40 — UKINUT ROK OD 15 DANA**.
- **Politika privatnosti** — 4.7 prepisan (dva ulaza, elektronska adresa roditelja po legitimnom interesu, sužen uvid roditelja, prijava poruke), rok čuvanja, **čl. 16 — UKINUT ROK OD 15 DANA**.
- **DPIA** i **Registar radnji obrade** — radnja br. 11 (Modul Deca) prevedena iz „nije aktivna" u **aktivnu**, dvojni pravni osnov, nov rizik **R16**, mere **5.11**; usput ispravljena zatečena greška „trinaest rizika" → **šesnaest** (R1–R15 su već postojali) na svih 5 jezika.
- **Pravilnik o hijerarhiji akata** — dopisan nov akt.

🔴 **Rok od 15 dana za izmenu akata je UKINUT** (odluka vlasnika): izmene stupaju na snagu **danom donošenja**, a obaveštenje ide **bez odlaganja**. Rok je izbrisan iz **operativnog teksta** Uslova čl. 40 i Politike čl. 16 na svih 5 jezika, i iz koda (`moduli.ts`, `sistemsko-obavestenje.ts`, `messages/*.json` → `obav_upozorenje`). **Ne vraćati ga** ni u komentare ni u copy. Rok od **15 dana za prigovor na isključenje** (Uslovi čl. 28) je drugi institut i **ostaje**.

Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false`. **Statut ostaje 4.1** (`statut_4_1_0.md`).

**AŽURIRANO 2026-08-14 (šesti put):** ceo set je dignut na **4.2.3** — svih 15 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da **dužina naslova i opisa oglasa nije uslov** sadržinskog minimuma (ukinut prag od 40 znakova; naslov i opis moraju da postoje, dužina se ne meri): sadržinski su izmenjeni **Uslovi** (čl. 16 i čl. 20), ostali akti su samo dignuti radi jedinstvene verzije seta. Bump je urađen zato što je tekst Uslova promenjen POSLE objave 4.2.2, pa bi fajl sa imenom 4.2.2 govorio nešto drugo nego kad je ta verzija objavljena. Istorijska pozivanja koja govore šta je važilo **do/od** ranijih verzija (4.2.1, 4.2.2) namerno su ostavljena kakva jesu — blanket zamena bi ih učinila neistinitim; isto važi i za komentare u `pravni-dokumenti.test.ts`. **Statut ostaje 4.1** (`statut_4_1_0.md`). Nema nove `PolitikaVerzija` — `PRISTANAK_NA_AKTE_TRAZI_SE` je `false` i akti su punovažni danom donošenja dok sistem nije zvanično u radu.

**AŽURIRANO 2026-08-11 (peti put):** ceo set je dignut na **4.2.2** — svih 15 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je odluka vlasnika da član bez potvrde **oglas objavi odmah, a 1.000 POEN dobije kad Fondacija odobri oglas** (vidi sekciju „Prvi oglas: objava odmah, POEN po odobrenju Fondacije"): sadržinski su izmenjeni **Pravilnik** (čl. 40a, čl. 40b t. 1 i stav o pređenom koraku, čl. 67) i **Uslovi** (čl. 16); ostali akti su samo dignuti na 4.2.2 radi jedinstvene verzije seta. Istorijska pozivanja koja govore šta je važilo **do** 4.2.1 (Registar radnji obrade, radnje 14 i 15; DPIA 2.1) namerno su ostavljena na 4.2.1 — blanket zamena bi ih učinila neistinitim. **Statut ostaje 4.1** (`statut_4_1_0.md`). Nema nove `PolitikaVerzija` — ekran za ponovni pristanak se ne pali sam podizanjem verzije fajla (traži nov DB red).

**AŽURIRANO 2026-08-09 (četvrti put):** ceo set je dignut na **4.2.1** — svih 15 akata (sr + en/ru/hr/hu), i kad su sadržinski nepromenjeni. Povod je paket „doprinos razmeni — putanja prvog kruga": nov **čl. 40b Pravilnika**, dopune **Uslova** (čl. 16 i 22), **Politike** (nova pododeljka 4.10 + rok čuvanja), **DPIA** (radnja br. 15, rizik **R15**, mere **5.10**) i **Registra radnji obrade** (radnja br. 15). Fajlovi žive u **istom folderu `dokumentacija 4.1/`**; loader, mapa u `pravilnik/[slug]`, stranice `/dpia` i `/radnje-obrade` i verzijske labele u `messages` su repointovani. **Statut ostaje 4.1** (`statut_4_1_0.md`, sopstvena numeracija — ne dira se).

🟢 **Set je od 4.2.1 ponovo JEDINSTVEN** — jedan broj važi za ceo folder (osim Statuta). Prethodni mešoviti set (4.2.0 uz 4.1.1) je uklonjen: fajlovi `*_4_1_1.md` za četiri akta koja su već bila na 4.2.0 su obrisani, a 4.2.1 je nastao iz **novije** osnove (4.2.0). Razlog za povratak na jedinstvenu verziju je isti kao pri bumpu na 4.1.1: mešovit set proizvodi unakrsne reference na verziju koja kao dokument više ne postoji.

🔴 **Zamka koja se već desila dvaput — čitati pre svakog sledećeg bumpa:** dokumenta nove verzije moraju nastati iz **najnovije** osnove na `main`-u, ne iz one sa koje je grana krenula. Prvi put je 4.2.0 nastao iz 4.1.0 dok je `main` izdao 4.1.1, pa bi objava tiho poništila izmenu čl. 40a. Zato test `pravni-dokumenti.test.ts` izričito traži rečenicu „Verifikovanom korisniku doprinos se evidentira" i odredbe čl. 40b — da se propust ne ponovi tiho.

**AŽURIRANO 2026-08-09:** kanonski set je **verzija 4.1.0** u folderu **`dokumentacija 4.1/`** (sr + `en/` + `ru/`). Povod je izmena pravila ulaska u KOLO (ukidanje table jemstva, osmi kanal evidentiranja — vidi „Ulazak u KOLO kroz razmenu"). Sadržinski su izmenjeni **Pravilnik** (čl. 15, 16, 28, 32, 35, nov **čl. 40a**, 67), **Pravilnik o dokazu stvarnosti** (čl. 5, 7), **Uslovi** (čl. 14, nov predmet čl. 16, čl. 18, 20, 22, 25), **Politika** (4.8 + vidljivost, revizijski dnevnik, rokovi, prava), **DPIA** (radnja 9, rizik R5, odeljak 5.3) i **Radnje obrade** (radnja 9); ostali akti su sadržinski nepromenjeni i samo dignuti na 4.1.0 radi jedinstvene verzije seta. **Statut ostaje 4.1** (`statut_4_1_0.md`, sopstvena numeracija — ne dira se). Folder `dokumentacija 4.0/` je sada istorija.

🔴 **Akti su DONETI i punovažni od dana donošenja, bez roka od 15 dana i bez ponovne saglasnosti** — odluka vlasnika, jer sistem još nije zvanično u radu. Zato se NE kreiraju novi redovi `PolitikaVerzija`/`PravilnikVerzija` i NE šalje cirkularno obaveštenje; ekrani za ponovnu saglasnost ostaju ugašeni. **Posledica koju treba znati:** zatečeni pristanci u bazi vode na prethodnu verziju akata, pa se prikazani tekst (markdown 4.1.0) i evidentirana saglasnost razilaze. To je prihvatljivo dok sistem ne krene; **za prvu izmenu posle puštanja u rad OBAVEZNO ide pun postupak** (nov red verzije + obaveštenje bez odlaganja, Uslovi čl. 40, Politika čl. 16; rok od 15 dana je ukinut setom 4.3.0).

**Prethodni set (istorija) — 4.0.0:** folder **`dokumentacija 4.0/`**. Povod: **KOLO Fondacija upisana u Registar zadužbina i fondacija 21.07.2026** (matični broj **28836627**, PIB **115840443** — javni podaci; broj rešenja se NE objavljuje, JMBG-ovi iz rešenja NIKAD ne idu u repo/sajt). Svi akti dignuti na 4.0.0 (sadržinski jednaki poslednjim 3.9.x verzijama + registracioni podaci u Politici čl. 1, Uslovima čl. 3, DPIA i Radnjama obrade + changelog red). **Statut je sada verzija 4.1** (`statut_4_1_0.md`, donet 16.05.2026, stupio na snagu upisom 21.07.2026; zamenjuje 3.8.0); postoje i Odluka o osnivanju 4.1 i Odluka o imenovanju UO 4.1 (Google Drive, sadrže lične podatke — ne objavljuju se). Loader `pravni-dokument.ts` (BAZA), sve `page.tsx` reference, verzije u `pravilnik/[slug]` i `messages` verzijske labele (pravne.*.ver, meta_*_desc, dok_tag) repointovani na **4.1.0**. Folder `dokumentacija 3.9/` je istorija. Tabela ispod opisuje 3.9 set (istorija promena važi i dalje).

**Prethodni set (istorija):** verzije 3.9.0 u folderu `dokumentacija 3.9/` (pažnja: ime sa razmakom). 3.9.0 nadograđuje prethodni 3.8.x set (folder `dokumentacija 3.8/`, sada istorija): prelazna odredba o početku sistema (Pravilnik čl. 82, „početni korisnici"), konkretizovani GDPR obrađivači (Vercel/Neon/Cloudflare R2/Resend, SAD) + DPO (Nikola Šarić), transparentnost donatora, jezici sr/en/hu. **Statut ostaje na 3.8.0** (sadržinski nepromenjen, fajl `statut_3_8_0.md`). Stariji implementacioni nalazi koji referenciraju 3.7.x/3.8.x i dalje važe.

| Dokument | Fajl (`dokumentacija 3.9/`) | Verzija |
|---|---|---|
| Pravilnik o KOLO sistemu | `Pravilnik_3_9_0.md` | **3.9.0** (82 člana, 12 glava) |
| Politika privatnosti | `politika_3_9_1.md` | **3.9.1** (dopuna: verifikacija sa table jemstva, 72h, prijava) |
| Uslovi korišćenja | `uslovi_koriscenja_3_9_1.md` | **3.9.1** (dopuna: čl. 16 — verifikacija sa table, 72h) |
| Statut Fondacije | `statut_3_8_0.md` | **3.8.0** |
| Whitepaper | `whitepaper_3_9_0.md` | **3.9.0** (PDF `nova dokumentacija/KOLO_Whitepaper_3.7.2.pdf` zastareo) |
| DPIA | `DPIA_3_9_0.md` | **3.9.0** |
| Radnje obrade | `radnje_obrade_3_9_0.md` | **3.9.0** |
| Rizici (Izjava o prihvatanju rizika) | `rizici_3_9_0.md` | **3.9.0** |
| Pravilnik o hijerarhiji akata | `hijerarhija_3_9_0.md` | **3.9.0** (dopunjen: dodat Pravilnik o Gornjem Kolu; „kolektivni oblici") |
| Pravilnik o dokazu stvarnosti | `dokaz_stvarnosti_3_9_3.md` | **3.9.3** (dopuna: novi čl. 22 — prelazno ograničenje: do opticaja 100.000 POEN najviše jedna primljena verifikacija; + 3.9.2 simetrična zona, početni 100%) |
| Pravilnik o pokroviteljstvu i donacijama | `donacije_3_9_0.md` | **3.9.0** (donacije 11 nivoa 1,00–2,00; pokroviteljstvo 7 nivoa; +preduzetnici) |
| Pravilnik o operativnom doprinosu | `operativni_3_9_0.md` | **3.9.0** |
| Pravilnik o osnivačkom doprinosu | `osnivacki_3_9_1.md` | **3.9.1** (korak 24.000 × 100, poslednji prag 10M) |
| Pravilnik o programima podrške | `programi_podrske_3_9_0.md` | **3.9.0** (verifikatorska potvrda socijalnih programa) |
| Pravilnik o Gornjem Kolu | `gornje_kolo_3_9_0.md` | **3.9.0** (glasanje, delegiranje; veto-prag = **3× operativni trošak prethodnog meseca**) |
| Kontekst za razvoj | `Claude_context.md` | usaglašen sa 3.9.0 |

**Otklonjene neusaglašenosti pri konsolidaciji na 3.8.0:** whitepaper — prava neverifikovanog korisnika (razmena van prostora za oglašavanje + ažuriranje evidencije POEN-a) usklađena sa Pravilnikom čl. 28; e-mail za zaštitu podataka ujednačen na `privatnost@ekolo.rs` (DPIA/Radnje obrade); hijerarhija — dodat Pravilnik o Gornjem Kolu, naziv „kolektivni oblici"; programi podrške — verzija u footeru ujednačena; zastarele međudokumentne verzijske reference → 3.8.0.

**✅ Rendering app-a (od 2026-08-09):** javne pravne stranice čitaju iz **`dokumentacija 4.1/`** (loader `src/lib/pravni-dokument.ts`, baza = `dokumentacija 4.1`). Prikazuju se verzije **4.3.1** za sve akte (statut **4.1**). Prevodi celog seta su u **`dokumentacija 4.1/en/`**, **`/ru/`**, **`/hr/`** i **`/hu/`** (po 16 dokumenata × 4 jezika, uz disklejmer da je merodavan srpski original; loader bira prevod po locale-u, tih fallback na srpski ako fajl nedostaje). **hr i hu dodati 2026-08-09** — do tada su ta dva locale-a tiho dobijala srpski tekst jer ih loader nije mapirao; sada je set potpun na svih 5 jezika iz `src/i18n/routing.ts`. Integritet seta čuva test `__tests__/pravni-dokumenti.test.ts` (postojanje svih 16 akata po jeziku, prisustvo odredaba 4.3.1 — uključujući prag od 10% za socijalne programe — odsustvo ukinutih instituta, disklejmer, i provera da se reči jednog jezika ne provuku u drugi). Dodatno su linkovani i **Pravilnik o Gornjem Kolu** i **Pravilnik o programima podrške** (slug `gornje-kolo`, `programi-podrske`). `nova dokumentacija/` je sada samo istorija.

Prethodni mešani set (`nova dokumentacija/`, verzije 3.7.2–3.7.6) i stariji (`dokumentacija/` v3.7.0, `.claude/OLD DOCS/` v2.x) zadržani su kao istorija.

**Promene po verzijama (changelog iz zaglavlja dokumenata):**
- **Dokaz stvarnosti 4.0.1 (03.08.2026)** — **izuzetak za prvu generaciju** (novi stav 5 u čl. 12 + obrazloženje u čl. 13): korisnici koje je **neposredno verifikovao isti početni korisnik** mogu verifikovati jedni druge, dok ih uzlazna/silazna linija grafa (uključujući recipročnu zabranu) ne poveže; ne prostire se na dalje potomke; simetrično preuzimanje zone i **čl. 22 ostaju netaknuti** (do 100.000 opticaja izuzetak je faktički neaktivan jer svako dete početnog već ima 1 primljenu). Odluka vlasnika: bez kapa primljenih po izuzetku. Kod: `izuzetakZaPrvuGeneraciju` + `proveriDozvoluVerifikacijeSaIzuzetkom` (`zona.ts`; keš `verification_zone` se NE menja — izuzetak živi samo u proveri dozvole), servis preskače staru anti-cirkularnu invarijantu kad izuzetak važi, graf prikaz (`/graf`) daje MOGU + razlog `prva_generacija`. Fajl `dokaz_stvarnosti_4_0_1.md` (sr+en), mapa u `pravilnik/[slug]` repointovana.
- **Dokaz stvarnosti 3.9.3 (09.07.2026)** — prelazna odredba (novi čl. 22, Glava IX → „Prelazne i završne odredbe"; raniji čl. 22–23 postaju 23–24): dok ukupan opticaj ne dostigne **100.000 POEN**, korisnik može primiti **najviše jednu verifikaciju** — mreža se u početnom periodu širi isključivo pristupanjem novih korisnika. Primena po stanju opticaja u trenutku verifikacije; ranije verifikacije ostaju punovažne, bez retroaktivnosti. Kod: `proveriPrelaznoOgranicenje` (`PRELAZNI_OPTICAJ_PRAG=100_000`, `PRELAZNI_MAX_PRIMLJENIH=1`) u `dokaz-stvarnosti.ts`, provera u jezgru verifikacije (opticaj = |minus Protokola|), poruka greške razlikuje se od zone.
- **Dokaz stvarnosti 3.9.2 (07.07.2026)** — simetrična zabranjena zona (čl. 12: verifikator verifikacijom trajno preuzima verifikovanog i celu njegovu zonu, uključujući kasnija proširenja; zabrana važi u oba smera; proširenja tuđim verifikacijama se NE prenose na početne korisnike) + čl. 13 (svrha simetrije: prinos ponovljenih verifikacija u istom socijalnom krugu opada). Čl. 14 novi tekst: početni korisnici = osnivačko jezgro Fondacije (APR registar ili odluka UO uz javni identitet), **indeks fiksno 100%** od uspostavljanja naloga, **ne mogu biti verifikovani u lancu potvrda**; čl. 15 st. 2 (verifikovanje početnih) brisan. Kod: tabela-keš `verification_zone`, čiste funkcije `zona.ts` (`recomputeZones` = hronološki replay), sync u transakciji verifikacije, puna rekomputacija posle kaskade/prestanka, backfill `POST /api/admin/verifikacija/zone-recompute`, migracija `20260707120000_verifikaciona_zona` (indeks osnivača → 100).
- **3.9.0 (16.06.2026)** — lansirna verzija u folderu `dokumentacija 3.9/`. Pravilnik: prelazna odredba o početku sistema (čl. 82, „početni korisnici" = osnivači kao NOSILAC_ZRNA + UO ovlašćenja; izuzetak od čl. 19/32), renumeracija stupanja na snagu → čl. 83. GDPR (Politika/DPIA/Radnje obrade): imenovani obrađivači Vercel/Neon/Cloudflare R2/Resend (SAD), prekogranični prenos, DPO Nikola Šarić, R2 za slike, broj radnji/rizika 12→13. Uslovi: transparentnost donatora (čl. 17), jezici sr/en/hu (čl. 44). Hijerarhija: moduli koji nisu aktivni. Rokovi čuvanja i analitički kolačići (GA + Vercel Analytics) popunjeni. EN paritet svih akata. **Statut nepromenjen (3.8.0).** Loader (`pravni-dokument.ts`) i `messages` repointovani na 3.9.
- **3.8.0 (06.06.2026)** — konsolidacija celokupne dokumentacije na jedinstvenu verziju 3.8.0 u folderu `dokumentacija 3.8/`, uz otklanjanje neusaglašenosti između akata (vidi „Otklonjene neusaglašenosti" iznad). Sadržinski jednako prethodnom 3.7.x setu osim navedenih ispravki.
- **Gornje Kolo 3.7.6** — prag gašenja zaštitnog veta (čl. 19) pojednostavljen: sada **jedan uslov — 3× operativni trošak prethodnog meseca**; ukinut raniji dvostruki kumulativni uslov iz 3.7.5 (24× prosečni mesečni trošak rezerve + 12-mes. samoodrživost).
- **Pravilnik 3.7.5** — zaštitni veto preformulisan: štiti **operativnu i finansijsku održivost Fondacije do dostizanja finansijske samostalnosti** (čl. 2, 48), umesto ranijeg vezivanja za narušavanje principa/zakona/pravnog statusa (principi/licence ostaju zaštićeni čl. 50, 51).
- **Pravilnik 3.7.4 / donacije 3.7.3** — pokroviteljstvo izričito obuhvata i **preduzetnike**, ravnopravno sa pravnim licima (čl. 2, 38, 40).
- **Uslovi 3.7.4 / Politika 3.7.6** — opcija B za tablu jemstva: verifikovani korisnik može, polazeći od objavljenog zahteva, da započne 1-na-1 razgovor (poruke) sa neverifikovanim podnosiocem, koji u tom razgovoru sme da odgovara i pre verifikacije; neverifikovani i dalje ne može sam da inicira komunikaciju. Uslovi čl. 14/16, Politika 4.8/čl. 5/čl. 6. **Napomena:** re-saglasnost na Politiku NE okida bump fajla — traži nov `PolitikaVerzija` DB red (admin).
- **Politika 3.7.4 / dokaz stvarnosti 3.7.3** — verifikacija se zasniva na **neposrednom ličnom poznavanju i ne zahteva fizičko prisustvo**; svrha obrade kontakt podataka sa table jemstva preformulisana u skladu s tim.
- **Pravilnik 3.7.3** — vidljivost prostora za oglašavanje (vidi „Ključna izmena" ispod).

Folder `docs/` sadrži **interne radne beleške** (analiza FAQ, glosar, predlog modela vidljivosti, pregled funkcija, dpia-podloga) — NIJE kanonska normativa.

**Ključna izmena u 3.7.3 (Pravilnik čl. 16, 28, 67):** precizirana je vidljivost platformskog prostora za oglašavanje — **pregled oglasa je javan** (sadržaj, cena, lokacija, pseudonim oglašivača vide svi posetioci), dok su **postavljanje oglasa, pristup kontaktu i komunikacija** dostupni samo verifikovanim korisnicima. Ovo je razgraničeno od pseudonimne evidencije doprinosa i grafa verifikacija (koje neprijavljeni/neverifikovani NE vide).

> **CLAUDE.md sinhronizovan sa kodom do commita `120d578` (2026-06-16).** Posle 2026-06-13 najviše kozmetičkih UI izmena (Profil/Pijaca/Novčanik/Početna raspored, header jezik switcher, fontovi); činjenične izmene unete iznad: Pijaca slike → R2, „Chat soba" → „Pričaonica", grupisan sidebar, email van podešavanja profila, terminologija „emisija" → „evidencija doprinosa".

## Status usklađenosti (24.05.2026 → 02.06.2026)
**Kod je u velikoj meri usklađen sa v3.7.5/3.7.4/3.7.3/3.7.2.** Većina ranijih 🟡 odstupanja je rešena. Aktuelno stanje:
- ✅ **Dokaz stvarnosti / Verifikacija** — implementiran (tri statusa, indeks 0–100, lanac potvrda, anti-cirkularno, QR token, kamera skener, nadzor, mini stablo)
- ✅ **Legacy LK/JMBG verifikacija UKLONJENA** (commit `f2f6575`, migracija `20260526120000_ukloni_lk_jmbg`) — nema više upload-a dokumenata, JMBG-a, `VerifikacijaPristanak` tabele, admin pregleda dokumenata
- 🔴 **Tabla zahteva za jemstvo — UKINUTA (2026-08-09)**; zamenjena ulaskom kroz Pijacu, vidi „Ulazak u KOLO kroz razmenu"
- ✅ **Poništavanje lažne verifikacije** sa rekurzivnom kaskadom (`lazna-verifikacija.ts`)
- ✅ **Osnivački doprinos** — implementiran (granica 2.4M POEN, 100 koraka × 24.000 (v3.9.1), zaključavanje liste osnivača, noćni cron, admin UI, javna transparentnost)
- ✅ **Pun tok pokroviteljstva** — prijava → ugovor → potpis → potvrda (`PokroviteljPrijava`, novac/roba/usluge)
- ✅ **Zaštitni veto Fondacije** — implementiran (`SistemskiVeto`, `FondacijaTrosak`, transparentnost sredstava). 🟡 **Dva GAP-a po Pravilniku 3.7.5:** (a) prag gašenja je hardkodovan na `3× prosek mesečnih troškova` — Pravilnik čl. 49 delegira prag posebnom pravilniku; (b) **obrazloženje/opseg veta** treba da prati novu formulaciju 3.7.5 (zaštita operativne i finansijske održivosti Fondacije do finansijske samostalnosti), ne staru (narušavanje principa/zakona/pravnog statusa). Vidi GAP ispod
- ✅ **Verzionisanje Pravilnika** (`PravilnikVerzija`/`PravilnikPrihvatanje`, `/pravilnik-prihvati`) — paralelno sa Politikom
- ✅ **Vidljivost po ulozi (feed)** — `/api/javno/feed` sada gradiran: gost→agregat, neverifikovan→maskirano „Korisnik", verifikovan→pseudonimi
- ✅ **ZRNO minimum upisa 20.000 POEN** (`MINIMUM_POEN_ZA_UPIS_ZRNA = 20_000`)
- ✅ **Terminologija ZRNO:** rute `kupi/prodaj` → `upis/otpis`; enum `KUPOVINA_ZRNO/PRODAJA_ZRNO` → `UPIS_ZRNO/OTPIS_ZRNO`
- ✅ **Terminologija POEN prenosa:** „slanje/primanje" → „ažuriranje evidencije"; UI za običnog korisnika „Upiši POEN"
- ✅ **Banka → Protokol** u UI/kodu (interni identifikator wallet-a ostao `"banka-singleton"`)
- ✅ **Faze sistema** — `faza-sistema.ts`, auto prelaz Faza 1 → Faza 2 na 1.000.000 POEN, NOSILAC_ZRNA verifikuje operativni doprinos
- ✅ **DCO + CC BY-SA** označavanje (`DCO`, `CONTRIBUTING.md`, `.github/workflows/dco.yml`)
- ✅ **Tabela donacija usklađena** — `donacija.ts` `RANG_TABELA` ima **11 nivoa, 1,00×→2,00×**, identično `donacije_3_7_3.md` čl. 4 (testovi pokrivaju)
- ✅ **Operativni doprinos usklađen** — model **predloženog POEN-a × min(1, L/P)** u okviru dnevnog limita (`programi.ts`), izvršenje verifikuju **nosioci ZRNA (Faza 2) / UO (Faza 1)** uz proveru sukoba interesa (ne admin proizvoljno). Model satnice (`hourlyRate`/`hoursWorked`) uklonjen; PED i doprinos-oglasi konsolidovani u jedan tok
- ✅ **„kurs" u srpskim prevodima** sređen → „Koeficijent" / „koeficijent evidencije" (`messages/sr.json`, ZRNO/donacije ekrani); interni identifikatori (`trendsKurs`, `.kurs`, `{kurs}`, ključevi) i en/hu „Rate"/„Árfolyam" ostaju
- 🔴 Moduli (Zadruga, internacionalizacija, Glava VIII) — nisu fokus razvoja po odluci vlasnika. **Modul Deca je izuzetak** — implementiran, iza prekidača (vidi sekciju „Modul Deca — unapređeni model")

**Tri statusa korisnika:** Neverifikovani / Verifikovani / Nosilac ZRNA — tako se zovu u **bazi i aktima**; u **interfejsu** su od 2026-08-12 **nov član / redovan član / nosilac ZRNA** (vidi „Copy govori o potvrdi"). NE POSTOJE organizatorske titule (zagovornik/aktivista/glasnik/šampion); NE POSTOJI "apostol" ni "Pokret" kao modul.

## Tech stack
- Next.js 16 (App Router), TypeScript
- PostgreSQL, Prisma ORM 7 (generisani klijent u `src/generated/prisma/`)
- NextAuth.js (credentials provider + OAuth tok, reset lozinke)
- Tailwind CSS v4
- next-intl — i18n biblioteka (prevodi u `messages/`); osnovni jezik srpski (latinica)
- Srpski jezik (latinica) u celom interfejsu
- **Nema instaliranog zod, decimal.js, ni sličnih library-a** — validacija ručno, Decimal tipovi se konvertuju sa `Number()`
- **Skladište slika = Cloudflare R2** (S3-kompatibilan, `aws4fetch`). Sve slike (avatari + slike oglasa na Pijaci) idu na R2; u bazu se upisuje samo **javni URL** (ne base64, ne binarno). Helper `src/lib/skladiste.ts` (`sacuvajNaR2`, `obrisiSaR2`, `r2Konfigurisan`). Env (Vercel, sva okruženja): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`. Dev fallback (kad R2 nije konfigurisan): lokalni disk `storage/oglasi/...` za oglase; avatar traži R2. Legacy base64 avatari rade dok se ne migriraju (admin Dashboard → „Migracija avatara na R2"; endpoint `/api/admin/migracija-avatara`). `/api/pijaca/slika/...` preusmerava na bilo koji apsolutni https URL (R2/CDN). (Raniji Vercel Blob tok napušten; `@vercel/blob` dep ostaje neiskorišćen.)

## Ugašeni moduli — Krugovi (2026-08-11; pokroviteljstvo vraćeno 2026-08-18)

Odlukom vlasnika **Krugovi** privremeno nisu u radu; vraćaju se kad dođe vreme za implementaciju. **Pokroviteljstvo je 2026-08-18 vraćeno u rad** (`POKROVITELJSTVO_AKTIVNO = true`) — opis ispod i dalje važi kao mapa toga šta prekidač dodiruje, ali su ta mesta sada aktivna. **Zadruga** se ne pominje jer nikad nije ni bila implementirana (Glava VIII, čl. 56) — ostala su samo pominjanja u tekstu.

**Prekidač je jedan fajl — `src/lib/moduli.ts`** (`KRUG_AKTIVAN`, `POKROVITELJSTVO_AKTIVNO`). Povratak = `false` → `true`, bez ijedne dalje izmene. Fajl je namerno **bez ijednog `import`-a** — uvoze ga i serverske i klijentske komponente.

🔴 **Ne brisati tabele, podatke ni migracije.** `Krug` ima sopstveni `Wallet`, čiji balans ulazi u opticaj (`osnivacki.ts` — „suma svih korisničkih + Krug balansa"). Brisanje redova bi oborilo **zero-sum** i smanjilo opticaj, čime bi se pomerili pragovi **osnivačkog koraka** (na svakih 100.000 POEN). Ispravno gašenje Kruga sa balansom išlo bi kroz protivzapis Protokola, kao pri gašenju naloga — dok je modul samo ugašen, ništa od toga nije potrebno. Iz istog razloga ostaju enum vrednosti `WalletType.KRUG`, `TransactionType.EMISIJA_KRUG_OSNIVANJE`, `EMISIJA_KRUG_BONUS`, `EMISIJA_POKROVITELJ` — nose ih istorijske transakcije.

**Akti se NE menjaju.** Krug je **modul** (Glava VIII), a **čl. 54** daje Fondaciji u Fazi 1 ovlašćenje da module aktivira i deaktivira — to je gotov pravni osnov. Pokroviteljstvo **nije modul** nego kanal evidentiranja (čl. 15, čl. 38–40): kanal još nije pušten u rad, nije ukinut. 🔴 **Pravilnik o pokroviteljstvu i donacijama ostaje javno vidljiv** na `/pravilnik/pokroviteljstvo-donacije` — to je **jedan akt** (`donacije_4_2_1.md`) koji uređuje i **donacije**, a one su i dalje aktivne.

**Šta prekidač radi:** stranice `notFound()` (404), API rute **410 Gone** (`PORUKA_MODUL_UGASEN` kroz `greska()`, pa poruka ide prevedena), nav stavke / admin tab / kartice / FAQ pitanja se ne renderuju.

Pogođena mesta: 18 API ruta (24 handlera); stranice `(app)/krug/**`, `(app)/postani-pokrovitelj`, `(public)/pokrovitelji`; `Sidebar` (stavka „Pokrovitelj"), `PublicNav`, `PublicFooter`, `sitemap.ts`; ranglista pokrovitelja na `/sistem`; admin tab **Pokrovitelji**; `chrome-podaci.ts` (badge `adminCekanje` ne broji `PokroviteljPrijava`, jer taba nema pa se ne bi ni mogle rešiti).

- **FAQ se filtrira u `FaqStranica.tsx`, ne u `getFaqSekcije()`** — `__tests__/faq-paritet.test.ts` poredi **identitet** nizova po jeziku (`toBe`) i pun izvorni set, pa bi filtriranje u akcesoru oborilo test. Sakrivena pitanja su u `FAQ_SAKRIVENA_PITANJA` (24 i 25); tekst pitanja ostaje u `faq-data*.ts` na svih 5 jezika.
- Naslov FAQ sekcije `pijaca-donacije` privremeno je bez pomena pokrovitelja (5 jezika) — vratiti uz prekidač.
- **Krug je i pre ovoga bio poluugašen:** nijedna navigacija nije vodila na `/krug`, a admin **Krugovi tab** je ranije uklonjen (`KrugoviLista` je mrtva komponenta). `krug` polje u tipovima na `/sistem` i `/profil/[id]` se ne renderuje — ostavljeno namerno, radi manjeg diffa.
- `validacija.ts` i dalje drži `"krug"` među rezervisanim pseudonimima (ruta postoji, samo vraća 404).

## Fundamentalna pravila sistema

1. **Zero-sum princip**: zbir svih računa (uključujući Protokol) = 0. Protokol ide u minus pri svakoj emisiji.
2. **Nema negativnog stanja**: korisnici i Krugovi nikad ispod 0. Samo Protokol može u minus.
3. **POEN i ZRNO su celi brojevi** (INTEGER). Nema decimalnih POEN-a ni ZRNA. Jedini decimalni iznosi su **obračunski koeficijent ZRNA** (DECIMAL(20,2); u kodu još uvek nazvan „kurs") i RSD iznosi (DECIMAL(12,2)).
4. **Prenos 1:1 (ažuriranje evidencije)**: prenos POEN-a između korisnika je **ažuriranje evidencije** (zapis davaoca se umanjuje, zapis primaoca uvećava), bez provizije; Protokol nije posrednik i **to nije platna transakcija ni prenos monetarne vrednosti** (Pravilnik čl. 14, 16). Izbegavati „slanje/primanje POEN-a". **Dva registra:** UI za običnog korisnika koristi **„Prepiši POEN"** (od 2026-08-11, vidi „Upis vs. prepis"); pravni/normativni tekst zadržava **„ažuriranje evidencije"** (razlika od „**upisa novih zapisa kroz kanale**" iz čl. 15 — jedino to menja ukupan broj POEN-a, zero-sum). **Interni identifikatori `/api/transfer` i `TransactionType.TRANSFER` zadržani.**
5. **Obračunski period**: ponoć do ponoći. Grupne operacije (ZRNO, delegacije, programi) izvršavaju se u ponoć **istog obračunskog perioda**.
6. **Pseudonimi**: nigde u javnom interfejsu ne prikazivati pravo ime. **Po v3.7.3 (Pravilnik čl. 31, DPIA, Whitepaper) ne postoji centralizovana evidencija koja povezuje pseudonim sa identitetom** — Fondacija tu vezu NE poseduje; dokaz stvarnosti ne prikuplja dokumente, a ime/telefon su dobrovoljni i nisu uslov. **Pseudonim u evidenciji doprinosa vidljiv je samo verifikovanim korisnicima** (Pravilnik čl. 67, Politika čl. 6); neregistrovani vide samo agregate. **Izuzetak:** pseudonim **oglašivača na Pijaci** je javan (čl. 16) — ali se za neprijavljene/neverifikovane NE povezuje sa evidencijom doprinosa, stanjem ni profilom.
7. **Dnevni limit Programa Protokola**: maksimalno 10% opticaja (opticaj = apsolutna vrednost minusa Protokola; baza je „ukupan broj evidentiranih POEN-a na početku perioda"). Odnosi se samo na **operativni doprinos i socijalne programe**; ostali kanali (automatski akti Protokola) ne ulaze u limit.
8. **Kanali evidentiranja POEN-a (Pravilnik čl. 15 — devet kanala)**:
   - **Ulaze u dnevni limit:** Operativni doprinos (izvršenje **verifikuju nosioci ZRNA u Fazi 2, odn. UO Fondacije u Fazi 1**, čl. 36); Socijalni programi (Podrška Majkama/primarnim starateljima, Podrška Starijima, Posebna Briga, Školovanje).
   - **Ne ulaze u dnevni limit (automatski akt Protokola):** verifikacija u lancu potvrda (dokaz stvarnosti), finansijski doprinos (donacije), pokroviteljstvo, rast kolektivnih oblika (bonus Kruga), osnivački doprinos, **doprinos sadržaju platforme (čl. 40a — osmi kanal, od 2026-08-09)**, **doprinos dece u dečjem prostoru (čl. 15 t. 9 — DEVETI kanal, od 2026-08-17; uređen Pravilnikom o učešću dece čl. 14b)**.
9. **Gradirana vidljivost podataka po ulozi (Pravilnik čl. 28–30, 67; Politika čl. 6; Uslovi):**
   - **Neregistrovan posetilac**: opšti pokazatelji sistema (agregati) + **pregled oglasa na Pijaci** (sadržaj, cena, lokacija, pseudonim oglašivača — čl. 16). NE vidi pojedinačne transakcije, evidenciju doprinosa, profile, ni kontakt oglašivača.
   - **Neverifikovan prijavljen korisnik** (izmenjeno 2026-08-09): iznose/vremena ažuriranja evidencije POEN-a **bez pseudonima strana** i bez stanja računa; svoje notifikacije; pregled oglasa. **Može da postavi oglas kojim NUDI dobro/uslugu** (najviše 3 aktivna, uz sadržinski minimum) i da razmenjuje dobra/usluge. U ažuriranju evidencije POEN-a učestvuje **samo kao primalac**. Sme da **odgovara** u razgovoru koji je verifikovani pokrenuo povodom njegovog oglasa. Kroz kanal doprinosa sadržaju (čl. 40a) može mu se evidentirati doprinos.
   - **Neverifikovan NE MOŽE**: videti pseudonime u evidenciji, rang-liste, profile drugih; postaviti oglas tipa **POTRAZNJA**; **inicirati prenos POEN-a**; pristupati kontaktu oglašivača; **pokretati** razgovor; upisati ZRNO; evidentirati doprinos kroz ostale kanale.
   - **Verifikovan korisnik (indeks ≥ 10%)**: pun pristup — pseudonimi, sve transakcije sa pseudonimima, stanja, profili, poruke, postavljanje oglasa + kontakt, upis ZRNA, Programi.

## Ključni koncepti

### Dokaz stvarnosti (implementiran)
- **Model verifikacije (Pravilnik o dokazu stvarnosti 3.7.3, čl. 1):** zasniva se na **neposrednom ličnom poznavanju i NE zahteva fizičko prisustvo** (usklađeno sa Politikom 3.7.4). Kontakt podaci sa table jemstva obrađuju se u toj svrsi.
- Enum `TipKorisnika` ima **tri vrednosti**: `NEVERIFIKOVAN` / `REGULARNI` (verifikovan običan) / `NOSILAC_ZRNA` (drži ZRNO, nadzire verifikacije). **`POCETNI` NIJE u enum-u** — „početni korisnici" (osnivačko jezgro Fondacije: **indeks fiksno 100%** od 3.9.2, ne troše kapacitet, bez nadzora, **ne mogu biti verifikovani**) su **normativni pojam** (Pravilnik o dokazu stvarnosti čl. 14, v3.9.2; Pravilnik o KOLO sistemu čl. 82). U kodu su modelovani kao `NOSILAC_ZRNA` + `jeOsnivac` marker + `admin` kolona (`AdminNivo`). (Legacy `POCETNI` string ostaje samo kao JWT-fallback u `proxy.ts`, označen za uklanjanje.)
- **Verifikacija = +10 procentnih poena** indeksa (raspon 0–100%).
- **Funkcionalni prag:** indeks ≥ 10% = pun pristup; < 10% = verifikovan ali bez pristupa.
- **Verifikacioni kapacitet** = `⌊indeks/10⌋`.
- POEN emisija pri verifikaciji: **verifikator 1.000, verifikovani 1.000, nadzornik 500** (kada podleže nadzoru).
- **Simetrična zabranjena zona (čl. 12, v3.9.2):** pored starih zabrana (recipročno, ancestralno, descendentno, braća) verifikator verifikacijom **trajno preuzima verifikovanog i celu njegovu zonu** (uključujući kasnija proširenja — dinamički); provera ide u **oba smera** (ni meta u zoni verifikatora, ni verifikator u zoni mete). Proširenja tuđim verifikacijama se **ne prenose na početne** — zona početnog raste samo njegovim sopstvenim verifikacijama. Keš tabela `verification_zone` (izvor istine = graf veza); čiste funkcije `zona.ts` (`recomputeZones` = hronološki replay, `proveriDozvoluVerifikacije`); sync u istoj transakciji sa upisom; posle kaskade/prestanka puna rekomputacija (`preracunajZoneUBazi`); backfill `POST /api/admin/verifikacija/zone-recompute` (jednokratno posle deploy-a). **Početni ne može biti meta verifikacije** (čl. 14 st. 3; posebna poruka greške, pokriva i raniju zabranu osnivač→osnivač); tabla jemstva vraća `verifikacijaBlokirana: "zona"|"pocetni"` po posmatraču i skriva dugme.
- Modeli: `VerifikacionaVeza` (graf), `VerifikacionaZona` (keš zone), `VerifikacijaToken` (QR, **2 sata** — `TOKEN_VAZI_SEKUNDI` u `dokaz-stvarnosti.ts`; raniji zapis „60s" bio je zastareo).
- UI: `/verifikacija` (QR + skener kamere), `/nadzor` (nosioci ZRNA), profil sa javnim indeksom i mini stablom.
- Lib: `dokaz-stvarnosti.ts`, `verifikacija-service.ts`, `nadzor-service.ts`, `lazna-verifikacija.ts` (poništavanje), `nadoknada.ts`.

### Nadzor verifikacija dobija glas + lažnost se ceni po čoveku (4.2.0, 2026-08-09)
Akti: **`dokaz_stvarnosti_4_2_0.md`** (čl. 1, 6, 7, 10, 11, nov **11a**, 12 st. 4, Glava VIII prepisana: 18, 19, 20 + novi **20a, 20b, 20c**, 21) i **`Pravilnik_4_2_0.md`** (čl. 14 st. 3, 32, 34). Uz njih **`DPIA_4_2_0.md`** i **`radnje_obrade_4_2_0.md`** (nova radnja obrade br. 14, rizik R14, odeljak 5.9). Sva četiri na sr + en/ru/hr/hu. Ostali akti ostaju 4.1.0.

**Prvi deo — nadzor dobija glas.** Do 4.2.0 je nadzornik mogao samo da POTVRDI verifikaciju ili da ne uradi ništa; ko posumnja nije dobijao ništa i nije ostavljao trag, pa je podsticaj gurao ka propuštanju.
- **Tri ishoda** (čl. 11): `UREDNO` / `ZA_PROVERU` / `SPORNO`. Uz druga dva obavezni **subjekt sumnje** i **šifra razloga** sa zatvorene liste (slobodan tekst samo uz „ostalo").
- **🔴 Slot kapaciteta dopunjava SAMO `UREDNO`.** `ZA_PROVERU` i `SPORNO` ga ne dopunjavaju.
- **🔴 Roka za nadzor NEMA** (odluka vlasnika 2026-08-09; predlog ga je imao, izbačen je). Zapis bez ishoda čeka koliko treba, verifikatorov slot ostaje potrošen. Posledica koju treba znati: `ZA_PROVERU` bez odziva drugog nadzornika drži verifikatora blokiranim bez gornje granice. Ako to postane problem, rešenje NIJE rok nego da `ZA_PROVERU` dopuni slot — ne dirati bez naloga.
- **500 POEN prvom nadzorniku koji evidentira BILO KOJI ishod** (čl. 7 st. 2). Drugi, kome je zapis prosleđen po „za proveru", ne dobija ništa — inače bi se isplatilo lančano dodavati nadzornike. Plaća se rad, ne pečat.
- **Nadzornik = svaki nosilac ZRNA**, bez podele po fazama. Ne sme da nadzire verifikaciju u kojoj je učestvovao **ni sa jedne strane** (do 4.2.0 kod je hvatao samo verifikatora, ne i verifikovanog), ni isti zapis dvaput (sprovodi `@@unique` na `NadzorZapis`).
- **`NadzorZapis`** je pun trag — jedan red po nadzorniku po verifikaciji. `VerifikacionaVeza.nadzornikId`/`nadzoranAt`/`nadzorIshod` nose poslednji ishod; jedno polje ne može da drži dvoje ljudi kad se zapis prosledi.
- **`NadzorniPredmet`** (čl. 11a) nastaje uz `ZA_PROVERU`/`SPORNO`, jedan po verifikaciji, vidi ga **samo superadmin**. Predmet je evidencija, ne organ. Zatvara se utvrđenjem ili nalazom „nema osnova"; „nema osnova" se briše posle **90 dana** (cron `/api/cron/nadzor-predmeti-cistenje`, 04:00).
- **Admin tab „Odluke"** (`OdlukeTab.tsx`) — nov, pored postojećeg taba **Nadzor**. Nisu isto: Nadzor je automat (`RizikNalaz`, noćni radnik), Odluke su ljudska prijava. Ne spajati ih.

**Drugi deo — posledice utvrđene lažne verifikacije.**
- **🔴 Lažnost se ceni po ČOVEKU, ne po verifikatoru** (čl. 19). Utvrđenje jedne lažne verifikacije pokreće **preispitivanje** ostalih, ne poništenje. Do 4.2.0 je norma obarala sve verifikacije verifikatora, a kod je išao i dalje od nje — BFS je gurao svakog pogođenog u red bez ijedne provere i čistio celo podstablo. **Ne vraćati „poništi sve verifikacije ovog verifikatora".**
- **Kaskada ide kroz NEPOSTOJANJE** (čl. 20). Nosilac je `User.utvrdjenNepostojeci` — utvrđenje UO da iza naloga ne stoji stvarna osoba. Tada padaju **sve** verifikacije koje nalog dodiruje (primljene i obavljene). Kaskada staje na prvom nalogu koji nije tako označen. Farma pada tako što se označi svaki član; redosled ne utiče na ishod.
- **Dve operacije:** `ponistiVerifikaciju(id)` (verifikovani je stvaran — pada samo ta veza) i `ponistiNepostojeciNalog(userId)` (nalog je lažan — padaju sve njegove veze + isključenje).
- **Poništava se samo POEN iz kanala verifikacije** (čl. 20a): 1.000/1.000/500. Nadzornikovih 500 pada **samo ako je ishod bio `UREDNO`** — ko je prijavio sumnju i bio u pravu, zadržava ih. Upućivanje na čl. 34 Pravilnika (koje je brisalo celu istoriju, uključujući nepovratne donacije) je **iseceno**.
- **🔴 Nadoknada — minus (čl. 20b, `nadoknada.ts`).** Ako poništeni POEN nije pokriven, nepokriveni deo prelazi na **verifikatora**; on je **jedini koji sme u minus**. Verifikovani i nadzornik idu **najviše do nule** (`podelaTereta`). Nadoknada nije dug, ne sprečava razmenu dobara i usluga, primljeni POEN je prvo popunjava, ne zamenjuje isključenje i **ostaje po gašenju naloga** (`DELETE /api/profil` namerno ne dira negativan balans).
- **Izuzetak od temeljne odredbe:** Pravilnik čl. 14 st. 3 („nijedan korisnik ne može imati negativan zapis POEN-a") dobio je izuzetak za nadoknadu — u aktima i dalje **jedini**. Isto i čl. 34 (nadoknada preživljava prestanak statusa). Zero-sum ostaje netaknut: prenos minusa je običan prenos. 🔴 **U KODU izuzetaka od 2026-08-15 ima dva** — drugi je poništen prepis po prijavi razmene (vidi tu sekciju); akti to još ne poznaju.
- **Reč „trajno" izlazi iz čl. 12** — zona se očitava iz važećih verifikacija, što `zona.ts` ionako radi. Bez toga pravo na povratak iz čl. 20c ne bi radilo (deo mreže bi ostao zatvoren).
- **UI:** raspoloživo stanje se prikazuje kao `raspolozivo(balance)` (nikad negativno) u zaglavlju i Novčaniku, a nadoknada ima **zaseban red** ispod kartice — nije „minus stanje". Dugme za upis POEN-a se u nadoknadi ne prikazuje; `/api/transfer` odbija sa objašnjenjem.
- **Kod:** `src/lib/nadzor-pravila.ts` (ČISTE funkcije + šifarnik, uvozi ih i klijentska forma), `nadzor-service.ts`, `lazna-verifikacija.ts`, `protokol/nadoknada.ts`. Testovi `__tests__/protokol/nadzor-i-nadoknada.test.ts`. Migracija `20260809150000_nadzor_ishod_i_predmet` (enumi + `NadzorZapis` + `NadzorniPredmet` + `User.utvrdjenNepostojeci` + backfill zatečenih nadzora na `UREDNO`). Rute: `POST /api/nadzor/[id]` (prima ishod), `GET /api/admin/nadzor/predmeti`, `POST .../[id]/{utvrdi,nema-osnova}`. Audit: `NADZOR_ISHOD`, `NADZORNI_PREDMET_OTVOREN`, `NADZORNI_PREDMET_NEMA_OSNOVA`, `LAZNA_VERIFIKACIJA_UTVRDJENA`, `NALOG_UTVRDJEN_NEPOSTOJECIM`.
- 🟡 **Nije dirano:** Uslovi korišćenja (razgraničenje nadoknade od suspenzije/isključenja stoji u dokazu stvarnosti čl. 20b st. 7 i čl. 21, ali nije preslikano u Uslove) i Pravilnik o hijerarhiji akata (provereno — nema pravila o numerisanju verzija; izmene su u nadležnosti UO po čl. 12 st. 3, a nadoknada ne dira četiri principa iz čl. 13).

### Terminologija: „potvrda" umesto „jemstva" (4.2.1, 2026-08-10)

**Lanac jemstva → lanac potvrda** u aktima, u interfejsu i u FAQ-u, na svih 5 jezika. Razlog nije stilski: *jemstvo* je obavezivanje za tuđe buduće ispunjenje, a verifikator izvodi drugi govorni čin — **tvrdi činjenicu** koja u trenutku izgovaranja jeste ili nije istinita (čl. 5 dokaza stvarnosti). To potvrđuje i sam aparat posledica: Glava VIII obara verifikaciju zbog **neistinite izjave** i nigde ne stavlja verifikatora na tuđe mesto. Uz to, „jemac" u Srbiji znači **žirant**.

🔴 **Šta OSTAJE „jemstvo":** „tabla zahteva za jemstvo" u Politici, DPIA i Radnjama obrade (tamo je institut opisan kao UKINUT — bez imena se ne vidi koja je obrada prestala); naslov stranice `/tabla-jemstva`; interni identifikatori (`jeKorenJemstva()`, ruta, namespace `tablaJemstva`, tabele `ZahtevZaJemstvo`/`Prepoznavanje`); i obično značenje reči („Fondacija ne jamči", en `does not guarantee`, hr `ne jamči`).

**Brana:** `__tests__/copy-ukinuto.test.ts` obara build ako se stara terminologija vrati u `messages/*.json` ili `faq-data*.ts`, `pravni-dokumenti.test.ts` ako se vrati u akte. Rupa je bila stvarna — prevodi FAQ-a su nosili „vouching chain" i „lanac jamstva" i posle prve zamene, jer je provera gledala samo ukinutu tablu. Isti test sada pokriva i **hr i hu** (prevodi postoje od 4.1.0, ali ih nijedna provera nije gledala).

### Copy govori o potvrdi; statusi su „nov" i „redovan član" (2026-08-12)

Dve izmene istog dana, obe **samo u interfejsu** — akti, Prisma šema i identifikatori u kodu se ne diraju.

**1. Reč „verifikacija" izlazi iz copy-ja.** Ne zato što je anglicizam — nije, to je latinizam standardan u srpskom pravnom jeziku (*verifikacija mandata*) — nego zato što akt i ekran rade različit posao. U aktu se meri odgovornost i reč mora da nosi težinu; na ekranu se govori čoveku, a **poznavanje je osnov instituta, ne njegovo ime**: dokaz stvarnosti kaže da se verifikacija „zasniva na neposrednom ličnom poznavanju dovoljnom da verifikator … potvrdi stvarnost". Zato ekran pita ono što čovek ume da proceni („potvrdi nekoga koga poznaješ"), a akt zadržava predmet za koji se odgovara.
- Stranica **Potvrde** (ruta i dalje `/verifikacija`), glagol **potvrdi**, **lanac potvrda**, **mreža potvrda** (bivši „graf verifikacija").
- 🔴 **Imenica za ulogu se NE uvodi.** „Potvrđivač potvrđuje" muca, a takvih rečenica ima **32** (11 u copy-ju, 21 u aktima) — sve rade upravo zato što su imenica i glagol različite reči. Umesto nove imenice imenuje se prava uloga: **„tvoj lanac"** u socijalnim programima, **„nosilac ZRNA"** u operativnom doprinosu. Ne vraćati „potvrđivač", „potvrdilac" ni „verifikator" u copy.

**2. Statusi dobijaju imena umesto trpnog prideva:**
> posetilac → **nov član** → **redovan član** → nosilac ZRNA

- „Redovan" je standardan srpski izraz za člana sa svim pravima (nasuprot pridruženom/vanrednom), a enum u bazi se već zove `REGULARNI` — oznaka na ekranu se poklapa sa imenom u šemi, što nigde drugde u sistemu nije slučaj.
- „Nov" umesto negacije: *nepotvrđen*/*nepunopravan* imenuju manjak na čoveku, „nov" imenuje trenutak koji prolazi. **Nov član JESTE član** — ima nalog, objavljuje ponude (najviše 3), prima POEN, odgovara na poruke povodom svog oglasa. Ceo red je bez ijedne negacije.
- 🔴 **Zašto NE druge reči:** „pridruženi član" se sudara sa dugmetom **„Pridruži se"** (registracija), pa bi se čitalo kao „upisao sam se", ne kao manja prava; **„nepoznat"** je zauzet porukama o grešci („Nepoznat jezik", „Nepoznata akcija"); **„poznat član"** se u srpskom čita kao *slavan*; „pristupnik" pada na `pristupnicu` za Krug. Odbačene iz tih razloga, ne stilski.

🔴 **Pečat na Pijaci NAMERNO ostaje `BEZ POTVRDE`.** On radi zaštitni posao prema kupcu — kaže da iza oglašivača još niko nije stao. „NOV" bi rekao samo da je skoro došao, a čovek može ostati bez potvrde godinu dana. Pečat i oznaka statusa rade različit posao i smeju da se razlikuju.

🔴 **Baza se NE menja.** `VerifikacionaVeza`, `VerifikacijaToken`, `VerifikacionaZona`, `TipKorisnika.NEVERIFIKOVAN`, `EMISIJA_VERIFIKACIJA`, `NadzorSubjekt.VERIFIKATOR` ostaju — akti i dalje govore „verifikacija", a baza je zapis pravne činjenice, bliža aktu nego ekranu. Isti presedan kao `PROTOKOL_WALLET_ID = "banka-singleton"` uz UI „Protokol" i model `ChatMessage` uz UI „Pričaonica". Ostaju i placeholderi `{verifikator}`/`{verifikovani}` i polje `verifikacijaId` u poruci o grešci — kod ih traži po imenu.

**Zamena ide PO KLJUČU, ne po reči** (`scripts/statusi-clanova.mjs` + `primeni-statuse.mjs`, uz `terminologija-sr.mjs` / `terminologija-prevodi.mjs`), jer „potvrđeno" u sistemu znači još četiri stvari koje se ne smeju pomeriti: potvrda **donacije**, potvrda **pokroviteljstva**, potvrda **izvršenja zadatka** i **verifikatorska potvrda socijalnog programa**.

**Oznaka statusa čita INDEKS, ne tip naloga.** `imaPristupVerifikaciji` traži indeks ≥ 10%, a oznaka se birala po `tipKorisnika` — ta dva se razilaze kad se poništi lažna potvrda: nalog ostaje `REGULARNI`, indeks padne ispod praga. `IndeksPrikaz` sada prima `indeks` i tada prikazuje **„Nema pristup"** (`verifikacija.tip_bez_pristupa`). Ne vraćati izbor po tipu.

**Brana:** `__tests__/copy-ukinuto.test.ts`, blok „copy govori o potvrdi" — obara build ako se `verifik`/`verif`/`верифи`/`hitelesít` vrati u `messages/*.json` ili `faq-data*.ts` na bilo kom jeziku (uz izuzetak za placeholdere). **Ne gleda akte** — oni namerno i dalje govore „verifikacija".

🟡 **Usput ispravljene zatečene greške:**
- „Kod važi **2 sata**" → **24 sata** (`TOKEN_VAZI_SEKUNDI` je na 24h od ukidanja table, tekst je zaostao) — stranica Potvrde i onboarding.
- „Verifikacija **identiteta**" → identitet se ne proverava, što isti sajt tvrdi dva ekrana dalje.
- Uputstvo je slalo na dugme „Generiši kod", koje se zove **„Pokaži kod"**.
- „Početna verifikacija (osnivač)" → po čl. 14 dokaza stvarnosti početni korisnik **ne može biti verifikovan**; sada „Početni korisnik (osnivač)".
- 🔴 **Ruski prevod je od 4.2.1 govorio „цепь поручительства" — lanac JEMSTVA**, ukinut tom istom verzijom. Preživelo je osam mesta jer je brana tražila „цепочка", a prevod koristi „цепь"; isto i mađarski „kezességi gráf" naspram provere koja je gledala samo „kezességi lánc". Obrasci u brani prošireni. **Pouka: pri ukidanju izraza pokriti sve imenice koje ukinuta reč nosi uz sebe, ne samo jednu.**
- U `en` i `ru` je desetak admin poruka stajalo **neprevedeno, na srpskom**.

### Copy sajta uz 4.2.1 (2026-08-10)

- **Sedam kanala, ne šest** na `/kako-funkcionise`: dodata kartica *Doprinos razmeni*. Naslov kaže „**u tvoj zapis**", pa se broj slaže sa Pravilnikom koji nabraja osam — osmi (rast kolektivnih oblika) upisuje u zapis **Kruga**, ne čoveka.
- **Put do učešća ide u četiri koraka** na Početnoj (registracija → objava oglasa → potvrda → doprinos). Objava je sada prvi potez novog čoveka, a iznos od 1.000 POEN pominje se tek uz potvrdu.
- **Pijaca:** oznaka da oglašivač nije verifikovan je **pečat preko fotografije** (bio je sitan tekst uz pseudonim); dugme na kartici razdvojeno po ulozi — gost „Prijavi se", prijavljen neverifikovan „Postavi oglas", verifikovan „Kontaktiraj". Gostu se ranije nudila verifikacija, a on nema ni nalog.
- **Ekran pri prijavi:** migracija `20260810170000_pristanak_4_2_1` upisuje red `PolitikaVerzija` „4.2.1", pa postojeći gejt u `AppShell` svakome prikaže „Sistem je unapređen — novi akti" sa dugmetom **Pristajem**. Ekran linkuje na `/pravilnik` (ceo set). Migracijom, jer se ovde ne emituje POEN.

### Pristanak na akte se NE traži (prekidač, 2026-08-11)
`PRISTANAK_NA_AKTE_TRAZI_SE = false` u `src/lib/moduli.ts`. Odluka vlasnika: akti 4.2.1 su punovažni danom donošenja, sistem još nije zvanično u radu, a ekran je smetao ljudima koji prvi put dolaze. Provera je na **jednom mestu** — `pristanakStatus()` u `src/lib/politika.ts` — pa i shell i sam ekran ćute; `/politika-prihvati` propušta dalje.
- **Mehanizam se ne briše.** `PolitikaVerzija`/`PolitikaPrihvatanje` i svi zatečeni pristanci ostaju u bazi (dokaz), red „4.2.1" iz migracije takođe. Povratak je `true`, bez ijedne dalje izmene.
- 🔴 **Za prvu izmenu akata POSLE puštanja sistema u rad prekidač MORA nazad na `true`** — Uslovi čl. 40 i Politika čl. 16 tada traže nov red `PolitikaVerzija`, ponovnu saglasnost i obaveštenje **bez odlaganja**. 🔴 Roka od 15 dana **više nema** (ukinut setom 4.3.0) — ne vraćati ga.
- Opis ispod (prekrivač, izvor istine, petlje) i dalje važi — opisuje mehanizam koji radi čim se prekidač vrati.

### 🔴 Gejt za pristanak je PREKRIVAČ, ne preusmeravanje (2026-08-11)
Do ove izmene je `AppShell` na svaku promenu rute radio `router.replace("/politika-prihvati")`. Dva kvara, oba viđena u dnevniku aktivnosti (admin → Aktivnost) čim je gejt upaljen za 4.2.1:
- **Mašinska petlja („blicanje"):** posle upisa pristanka ekran je navigirao na `/sistem`, ali keširani `/api/me` (poll na 30s) je i dalje govorio da pristanak nedostaje → gejt vraća → ekran pita server, dobija „nije potrebno" → opet `/sistem`. Jedan nalog: **98 pregleda stranice za par minuta**. Uz to je pad `GET /api/politika/prihvati` slao korisnika na `/sistem`, gde gejt zna samo da pristanak nedostaje — ta petlja se ne bi prekinula sama.
- **Ljudska petlja:** ko ne pritisne „Pristajem" nego klikne dalje po meniju, bio bi izbačen sa **svake** stranice (`/novcanik` ↔ `/politika-prihvati`, pa `/pijaca`, pa `/profil/<pseudonim>`…). Jedan nalog: **120 pregleda za sat vremena**.

Sada `AppShell` samo renderuje `<PolitikaPristanak />` preko svega (`fixed inset-0 z-[100]`), **bez promene rute** — nema navigacije, nema skoka, nema šta da uđe u petlju, a pristup je jednako zatvoren. Ista komponenta služi i stranicu `/politika-prihvati` (`kaoStranica`), koja ostaje zbog linkova zapisanih u ranijim notifikacijama i mejlovima.
- **Ne vraćati redirect gejt.** Ako zatreba da se gejt proširi, širi se uslov `prikaziPristanak`, ne način prikaza.
- **Izuzeci ostaju `/profil` i `/politika-prihvati`** (prava iz ZZPL-a, odn. stranica koja već prikazuje isti ekran). Pijaca JESTE pokrivena: `src/app/pijaca/layout.tsx` za prijavljenog korisnika renderuje `AppShell` (za gosta `PublicHeader`), pa prekrivač važi i tamo.
- 🟡 **Gejt je isključivo klijentski.** Nijedna API ruta ne proverava pristanak (`proxy.ts` takođe ne) — ko zna adresu endpointa, može da radi i bez pristanka. Za sada je to prihvaćeno: ekran je obaveštenje o izmeni akata, ne bezbednosna granica. Ako zatreba stvarno zatvaranje, mesto je `proxy.ts` ili zajednička provera u rutama, ne prekrivač.
- **Keš `['me']` se ispravlja PRE zatvaranja ekrana** (`patchMe({politikaPotrebno:false})` + invalidate), inače prekrivač visi do sledećeg poll-a.
- 🔴 **Prekrivač se ne crta dok se ne potvrdi da je pristanak potreban** (dok traje provera → `null`, ne „Učitavanje…"). `AppShell` ga montira po keširanom `politikaPotrebno`, a ta vrednost ume da bude zastarela (poll na 30s; odgovor koji je krenuo pre upisa pristanka stiže posle njega) — bez ovoga čovek koji je već pristao vidi kako mu kartica **bljesne i nestane**. Merodavan je server, ne keš. Na stranici `/politika-prihvati` poruka o učitavanju ostaje (otvorena je namerno, prazan ekran bi ličio na kvar).
- **Jedan izvor istine za oba mesta:** `pristanakStatus()` u `src/lib/politika.ts` — zovu ga i `/api/me` i `GET /api/politika/prihvati`. Ranije su imali odvojene upite, iste po tekstu, ali `orderBy` samo po `efektivnaOd` je **neodređen** kad dve verzije dele isti trenutak stupanja na snagu; razlaz ta dva odgovora je upravo ono što proizvodi bljesak. Redosled je sada određen do kraja (`efektivnaOd`, `createdAt`, `id`). Ne razdvajati ih ponovo.
- **Oba `fetch`-a idu sa `cache: "no-store"`** (`/api/me` i gejt) — keširan „potreban je pristanak" bi vraćao ekran čoveku koji je već pristao.
- 🔴 **Početna provera se pokreće TAČNO JEDNOM** (prazne zavisnosti `useEffect`-a), a `onGotovo` ide kroz ref. Dok je u zavisnostima stajala funkcija, krug se zatvarao sam: provera → `setState` → iscrtavanje → provera. Kartica je pri tom **treperila** (nestaje na svaki `setLoading(true)`, jer se prekrivač ne crta dok provera traje), a otišlo je **3488 poziva `/api/politika/prihvati` za tri sata** (`/api/me` u istom periodu: 14). Ritam u snimku (~3,5s) poklapao se sa ritmom u runtime logu — to je najbrži način da se ovakva petlja potvrdi.
- 🔴 **`useMePatch()` mora ostati stabilan (`useCallback`).** Bez toga vraća novu funkciju pri svakom iscrtavanju; ko je stavi u zavisnosti efekta, dobija istu petlju. Isto važi za svaki inline `onGotovo`/handler prosleđen komponenti koja ga drži u `useCallback` lancu.
- **Pad zahteva ne sklanja ekran** — prikazuje se poruka i dugme „Pokušaj ponovo" (`greska_ucitavanje`, `dugme_pokusaj_ponovo`, svih 5 jezika).
- **Dugme mora ostati dostižno:** karta je poravnata uz vrh uz `overflow-y-auto`, ne centrirana u punoj visini ekrana — ispod fiksnog zaglavlja je dno karte na niskim telefonima umelo da izađe iz vidika.
- **Dnevnik aktivnosti** (`/api/aktivnost`) preskače ponovljenu **istu** putanju unutar 5 minuta, ali smenjivanje dve putanje beleži svaki put — zato se ovakva petlja u njemu vidi kao naizmenični spisak, i zato je taj spisak dobar detektor.
- **Ispravljeno usput:** `kakoFunkcionisePage.k2_opis` je tvrdio da neverifikovan sme da prenosi POEN „kao davalac ili primalac" — čl. 28 st. 2 to zabranjuje. Onboarding (`dobrodosli`) i FAQ 42 su i dalje slali ljude na **ukinutu Tablu jemstva**; linkovi su odavno vodili na Pijacu, zaostao je bio samo tekst.

### Upis vs. prepis + „Novčanik" → „POEN" (2026-08-11)

Dve izmene **samo u interfejsu** — akti se ne diraju. Normativni tekst i dalje govori „ažuriranje evidencije" (čl. 14, 16) i „upis novih zapisa kroz kanale" (čl. 15); to je i dalje tačno i nije u sukobu sa ovim.

**1. Prenos POEN-a je PREPIS, ne upis.** Do sada je ista reč pokrivala dve suprotne operacije: kroz kanale iz čl. 15 POEN **nastaje** (Protokol ide u minus, ukupan broj raste), a između dva korisnika POEN **ne nastaje** (jedan zapis se umanjuje, drugi uvećava, zbir isti). Dugme je pri tom glasilo „Upiši POEN" — pa se iz interfejsa nije videlo kad sistem stvara POEN a kad ga samo premešta.
- 🔴 **Doslovan prevod „prepisa" se NE koristi.** `transcription` (en), `prijepis` (hr) i `переписывание` u prvom značenju znače **kopiju**, a kopija ostavlja original na mestu — suprotno od zero-suma. Parovi po jezicima: sr/hr `upis / prepis`, ru `внесение / переписать (на)`, hu `bejegyzés / átírás`, en `recording / re-register` (engleski nema idiom; `transfer` je odbačen jer je to reč koju akti izbegavaju, `assign`/`convey` jer vuku na svojinu).
- **Predlog razrešava dvosmislenost:** „prepisati **na** nekoga" u srpskom, hrvatskom i ruskom znači samo promenu nosioca zapisa (kopija nema „na koga"). Zato tekstovi svuda imaju dopunu („prepiše **u tvoj zapis**"), ne goli glagol.
- 🔴 **Uz obrazac stoji definiciona rečenica** (`novcanik.send_napomena`): *„Prepis ne stvara nove POEN-e: tvoj zapis se umanjuje za onoliko za koliko se njegov uvećava."* Ona gasi dva pogrešna čitanja — „prepisati kuću" (prenos svojine; POEN nije imovinsko pravo, čl. 12–13) i „prepisati" kao kopirati. **Ne uklanjati je** — bez nje reč radi protiv sistema.
- **Gde „upis" OSTAJE:** svih devet kanala iz čl. 15 („Protokol upiše 1.000 POEN"), **upis/otpis ZRNA** (druga jedinica, ustaljeno u aktima i rutama), popunjavanje polja („upiši ime"), upis ishoda nadzora, upis u program.

**2. Ekran „Novčanik" se zove „POEN".** Novčanik je posuda za novac, a POEN postoji isključivo kao zapis u Protokolu (čl. 12) — nema nosioca i ne drži se. Ime je birano po **simetriji sa postojećom stavkom ZRNO** i zato je **isto na svih pet jezika** (nema šta da se prevodi). Najgori je bio prevod: hu `Pénztárca` doslovno sadrži `pénz` = novac.
- U rečenicama se koristi **„tvoj zapis"** („prepisano u tvoj zapis"), ne novo ime ekrana.
- **Ikonica je promenjena iz novčanika u knjigu zapisa** — ikonica je vraćala asocijaciju jaču od same labele.
- **Interni identifikatori se NE diraju:** ruta `/novcanik`, `User.vidjenoNovcanikAt`, `dnevniBrojevi.novcanik`, `Wallet` model, `/api/transfer`, `TransactionType.TRANSFER`. Isti obrazac kao `banka-singleton` za Protokol i `ChatMessage` za Pričaonicu.

**Brana:** `__tests__/copy-ukinuto.test.ts`, blok „POEN nije novac" — obara build ako se reč za novčanik vrati u `messages/*.json` ili `faq-data*.ts` na bilo kom jeziku, ako neki od ključeva za prepis (`header.upisi_poen`, `profil.upisi_poen`, `novcanik.posalji_poen`, `novcanik.send_naslov`, `novcanik.send_dugme`) izgubi koren prepisa, ili ako nestane definiciona rečenica.

🟡 **Usput ispravljeno (zatečene greške, nisu deo ove izmene):**
- **Smer zapisa u FAQ-u o trampi bio je OBRNUT na svih pet jezika** — „zapis onoga ko daje **uvećava** se, a zapis onoga ko prima **umanjuje**". Ispravljeno.
- „vouching graph" / „graf jamstva" / «граф поручительства» / „kezességi gráf" preživeli su rename iz 4.2.1 u `putanja_pravila` na četiri jezika (sr je bio ispravan). Ispravljeno + dopunjene regex brane u testu.
- Dve reči pokvarene ranijom zamenom u srpskom FAQ-u: „perifikaciju", „porifikovala".
- `skener_uputstvo` je govorio „osobe kojoj **plaćaš**" (hu čak `Beolvasás fizetéshez` = „skeniraj za plaćanje").

### Poništenje prepisa po prijavi razmene (2026-08-15)

Do ove izmene prepis POEN-a **nije mogao da se obori ničim** — jedino poništenje POEN-a u sistemu bilo je ono iz utvrđene lažne potvrde (dokaz stvarnosti čl. 20a), a `/api/admin/transakcije` ima samo `GET`. FAQ 82 je pri tom već govorio da prepis „može biti poništen po prijavi"; ovo je posao koji tu rečenicu čini istinitom (odluka vlasnika, opcija „b" — napraviti tok, a ne skloniti obećanje).

- **Prijavljuje ISKLJUČIVO pošiljalac** (`smePrijaviti`) — samo on je nešto izgubio. Primalac koji nije dobio robu nije ni prepisao POEN; njegov put je prijava oglasa (moderacija) ili prigovor.
- **Jedna prijava po prepisu** — `@@unique` na `PrijavaRazmene.transakcijaId`. Druga prijava nad istim prepisom nije nov podatak nego ponovljen pritisak. Uz to najviše **3 otvorene** po korisniku (ista brana kao kod prigovora).
- 🔴 **Povraćaj je UVEK PUN — zapis primaoca sme u minus** (odluka vlasnika, 2026-08-15). Prva verzija je vraćala najviše ono što na zapisu zatekne; time je onaj ko brže potroši tuđi POEN prolazio jeftinije od onog ko ga sačuva, tj. nagrađivalo se upravo ponašanje zbog kog se prijava podnosi. Minus radi isto što i **nadoknada** iz čl. 20b: nije dug, ne naplaćuje se, POEN-i koji pristignu prvo ga popunjavaju, prepis drugome je moguć tek preko nule, razmena dobara i usluga nije ograničena. Admin tab prikazuje **stanje posle poništenja** pre pritiska na dugme, a primalac koji ode u minus dobija **drugačije obaveštenje** (`prijava_razmene_oduzeto_minus`) — minus menja šta sme sa zapisom i ne sme da se pojavi bez reči.
- 🔴 **Izuzetaka od zabrane negativnog zapisa (Pravilnik čl. 14 st. 3) sada ima DVA** — nadoknada po čl. 20b i poništen prepis po prijavi razmene. Raniji zapis „nadoknada je jedini izuzetak" više NE važi. Nema zasebne kolone: minus JESTE nadoknada, pa `jeNadoknada`/`iznosNadoknade`/`raspolozivo` iz `nadoknada.ts` pokrivaju oba slučaja; zato je i tekst `novcanik.nadoknada_opis` (5 jezika) preformulisan da imenuje oba uzroka umesto samo poništene potvrde.
- 🔴 **Protivzapis ide tipom `PONISTENJE_PREPISA`, ne `TRANSFER`.** Brojač putanje doprinosa razmeni (čl. 40b) čita transakcije tipa `TRANSFER`, pa bi povraćaj upisan kao TRANSFER **lažno otvorio korak 2** onome kome je prepis poništen. Istorija se ne prepravlja — protivzapis, kao pri prestanku statusa (čl. 34). Zero-sum netaknut: POEN se seli između dva korisnička zapisa, Protokol se ne pomera.
- **Ulazna tačka je uz sam prepis** u istoriji POEN-a (`IstorijaKlijent.tsx`), ne na stranici oglasa: odluka se vodi o prepisu, a ne o oglasu, i jedan oglas ume da rodi više prepisa. Dugme vidi samo pošiljalac (`mozePrijaviti` dolazi sa servera); kad je prijava podneta, dugme ustupa mesto ishodu.
- **Admin tab „Razmene"** (`RazmeneTab.tsx`, ključ `razmene`) — dve odluke, obe uz **obavezno obrazloženje** (ide obema stranama i u revizijski dnevnik): *Poništi prepis* i *Odbaci prijavu*. Nije moderacija (tab „Pijaca") i nije prigovor na odluku Fondacije (tab „Prigovori") — tri različite odluke, tri taba, ne spajati ih.
- **Kod:** `src/lib/razmena-prijava.ts` (ČISTE funkcije — bez Prisme, jer ih uvozi i admin tab u pretraživaču) + `src/lib/protokol/prijava-razmene.ts` (servisne, re-eksportuje pravila). Rute: `POST /api/transakcije/[id]/prijavi`, `GET /api/admin/prijave-razmene`, `POST .../[id]/{ponisti,odbaci}`. Migracija `20260815120000_prijava_razmene`. Testovi `__tests__/protokol/prijava-razmene.test.ts`. Audit: `PREPIS_PONISTEN`, `PRIJAVA_RAZMENE_ODBACENA`. Badge: tab Razmene + sidebar `adminCekanje`.
- 🔴 **Akti ovo NE poznaju, a od pune naplate u minus razmimoilaženje je veće.** Uslovi čl. 22 kažu da Fondacija nije strana u razmeni; nijedan akt joj ne daje ovlašćenje da obori prepis, a čl. 14 st. 3 poznaje **samo jedan** izuzetak od zabrane negativnog zapisa (nadoknadu iz čl. 20b) — kod ih sada ima dva. **Pre puštanja u ozbiljan rad ovome treba odredba**: postupak po prijavi u Uslovima i drugi izuzetak u Pravilniku uz čl. 14/16 (uz upućivanje na režim nadoknade iz čl. 20b, jer se minus tako i ponaša). Do tada je to faktička praksa Fondacije, ne pravo prijavioca ni obaveza Fondacije.

### Modul Deca — unapređeni model (2026-08-17)

Modul postoji iza prekidača **`MODUL_DECA_AKTIVAN`** u `src/lib/moduli.ts`.

🟢 **Akt je USVOJEN setom 4.3.0 (2026-08-17): `dokumentacija 4.1/ucesce_dece_4_3_4.md` — „Pravilnik o učešću dece"** (23 člana, sr + en/ru/hr/hu), slug `/pravilnik/ucesce-dece`. Ime je pri usvajanju izmenjeno iz „Pravilnik o Modulu Deca" — uređuje **učešće lica**, a ne modul kao softversku celinu (modul je i dalje Glava VIII Pravilnika o KOLO sistemu). Numeracija članova iz nacrta je zadržana. **DPIA je ažuriran** (radnja 11 aktivna, rizik R16, mere 5.11), pa je obaveza iz čl. 65 ispunjena i pravnih prepreka za paljenje više nema — od sada je to **odluka o puštanju u rad**, ne uslov koji čeka. `docs/pravilnik-modul-deca.md` je sveden na **radne beleške** (obrazloženja mehanike, praznine, mapa koda); normativni tekst je iz njega uklonjen da ne bi bila dva izvora istine.

**FAQ pitanje 6 („Mogu li se maloletnici registrovati?") ima dva odgovora i bira ih prekidač:** br. **6** = „ne" (modul ugašen), br. **84** = „da, od sedme godine" (modul radi). `FAQ_SAKRIVENA_PITANJA` sakriva tačno jedan od njih. Tekst se ne prepravlja u jednu rečenicu — u jednom od dva stanja sistema bio bi neistinit.

**Šta druga verzija menja u odnosu na prvu:** dodaje **drugi ulaz** (dete se registruje samo), uvodi **ekonomiju dečjeg prostora** (prijateljstvo stvara POEN), **ukida roditeljsko čitanje razgovora među decom**, dopušta **dva roditelja** i uređuje **prelazak u punoletni nalog**.

🔴 **PALO NOSIVO PRAVILO PRVE VERZIJE.** Rečenica „u dečjem prostoru ne nastaje nijedan nov zapis POEN-a" (raniji čl. 14 st. 1) **više NE važi**. Emisija iz dečjeg prostora **ulazi u opticaj**, pa pomera prag **osnivačkog koraka** (na svakih 100.000 POEN) i **obračunski koeficijent ZRNA** — u OBA smera, jer raskid i punoletstvo POEN otpisuju. Paljenje modula više nije potez bez traga u brojevima sistema.

**Zašto dete nema razloga da laže o uzrastu (nosivi mehanizam).** Neverifikovan punoletni nalog ne dobija ništa dok ga neko ne potvrdi; dete koje bi se lažno predstavilo kao odraslo tražilo bi potvrdu koju nikad neće dobiti i ostalo bi prazan nalog. Deklaracija „ja sam dete" vodi ka prijateljstvima i POEN-u. **Sistem uzrast ne proverava i ne mora** — istina je jedini put ka onome što dete želi.

**Tri stanja naloga (čl. 4c, `stanjeDeteta()`).** Razlika između dva ulaza je SAMO u tome na kom stanju nalog počinje.

| Stanje | Kad | Šta radi |
|---|---|---|
| **NA_CEKANJU** | registrovalo se samo, veze sa roditeljem nema | profil, QR kod, prijateljstva. **Bez Pričaonice**, bez oglasa, bez poruka, bez prepisa. POEN se ne upisuje |
| **POVEZANO** | roditelj preuzeo nalog, još nije redovan član | sve radi osim upisa POEN-a |
| **AKTIVNO** | bar jedan roditelj je redovan član | pun pristup |

- 🔴 **Zašto dete na čekanju nema Pričaonicu** — bezbednosno pravilo, ne kazna. Iza deteta koje je uveo roditelj stoji potvrđen odrastao čovek i svi koji su njega potvrdili; iza deteta na čekanju **ne stoji niko** (registracija za dva minuta, bilo koji imejl), pa bi se odrastao predstavio kao dvanaestogodišnjak bez prepreke. Ranije je taj rizik hvatalo roditeljsko čitanje razgovora — pošto roditelj više ne čita, soba bi ostala bez ijedne provere. To je i **najjači pritisak koji sistem vrši**: ne moći odgovoriti drugu koji ti je upravo skenirao kod konkretno je, POEN sedmogodišnjaku nije.
- **Nalog otvoren iz roditeljskog profila ulazi ODMAH u `AKTIVNO`** — zatečeno ponašanje, ne menja se.
- 🟡 **„Mirovanje" iz prve verzije je zamenjeno stanjem `POVEZANO`.** Kad roditelju padne potvrda, dete ne staje nego se vraća korak unazad. **Roditeljev nalog se time NE dira** — u prvoj verziji je i on mirovao, što u drugom ulazu nema smisla: onaj ko tek preuzme nalog i JESTE nov član.

**Uparivanje roditelja i deteta (čl. 4a–4b).** Dete unosi pseudonim, lozinku i **imejl roditelja**; **datum rođenja NE unosi** — upisuje ga roditelj pri preuzimanju (čl. 7, posle upisa se ne menja). U poruci roditelju stoji **samo pseudonim**, nikad pravo ime — ne zna se da li je adresa tačna.
- **Dva puta:** primarni — roditelj se registruje istim imejlom i veza mu se sama predloži (`poziviZaEmail`); rezervni — **šestocifreni kod** iz profila deteta uz pseudonim. **Istim putem ulazi i DRUGI roditelj**; nema zasebnog obrasca, obojica rade istu radnju i dobijaju **ista ovlašćenja**.
- **Odobrenje deteta se ne traži.**
- **Tri radnje u poruci:** preuzmi / ovo nije moje dete / obriši nalog. Poslednje dve rade **bez prijave** — onaj ko drži link je jedina osoba koju sistem u tom trenutku može da pita, a odbijanje bez brisanja ostavlja tuđe dete da koristi tvoju adresu dve nedelje.
- 🔴 **Dva različita roka i to je namerno:** link iz poruke važi **7 dana**, a nalog sme da čeka preuzimanje **14 dana** pa se briše. Rok od 14 dana važi **SAMO za preuzimanje**, ne i za drugi korak (da roditelj postane redovan član) — razlog je pravni: dete na čekanju je lice čije podatke obrađuješ pre pribavljenog pristanka. Posle preuzimanja pristanak postoji, obrada je zakonita i ništa ne visi; rok tu ne bi štitio ništa, samo bi ubijao naloge dece čiji roditelji nisu bili spori nego bez veze u mreži.

**Prijateljstva i POEN (čl. 14a–14b).** Sklapaju se **isključivo skeniranjem QR koda uživo** (kod traje 5 minuta i **nema izgovorivi broj** — broj se izdiktira telefonom, QR se mora POKAZATI). Za sklopljeno prijateljstvo **500 POEN svakom detetu — ali tek kad su OBE strane `AKTIVNO`**.
- 🔴 **Obostrano čekanje je CELA odbrana od farmovanja.** Broj dece po roditelju nije ograničen, pa bi jedan čovek otvorio deset naloga, uparivao ih (45 parova = 45.000 POEN) i prekidačem iz čl. 10 prepisao sve sebi. Lažni nalozi nikad ne postaju aktivni — a aktivan traži roditelja **koji je redovan član**, dakle čoveka koga je treće lice potvrdilo u stvarnom svetu.
- 🔴 **Prijateljstvo dece istog roditelja se sklapa normalno, ali NE nosi POEN** (druga, nezavisna brana). Braća i sestre se vide u Pričaonici i razgovaraju kao i svi ostali; izostaje samo upis.
- Dok jedna strana čeka, **obe vide „500 na čekanju"** sa pseudonimom prijatelja. To je i namera: Mihajlo gnjavi Milicu, Milica gnjavi tatu.
- **Roditelj prijateljstvo NE odobrava** — sklapa se uživo, a odobravanje bi bilo naknadno presuđivanje o tome sa kim se dete druži u životu. Roditelj dobija obaveštenje i vidi spisak sa datumima.
- **Broj prijateljstava po detetu i broj dece po roditelju nisu ograničeni.**

**Raskid (čl. 14c).** 🔴 **Raskinuti može SAMO DETE**, bilo koje od dvoje; roditelj nema raskid (njemu ostaju brisanje naloga, uklanjanje oglasa i prekidač za odrasle). Otpisuje se **500 POEN OBEMA stranama**, uz potvrdu sa jasnim tekstom „izgubićeš 500 POEN".
- 🔴 **Zapis SME u minus, i to je neophodno, ne strogo.** Bez minusa bi postojao potez: sklopi, dobij 500, odmah prepiši roditelju, raskini — otpis pada na prazan račun; pa obnovi par i ponovi = **beskonačna kasa iz jednog prijateljstva**. Sa minusom ciklus daje **tačno nulu**, pa **par sme da se obnovi** i POEN se upisuje ponovo (pomirene drugarice ne gube ništa trajno). Kazna je trenutna za štedišu, odložena za onoga ko je brz — ali od nje niko ne beži.
- 🔴 **Izuzetaka od zabrane negativnog zapisa (Pravilnik čl. 14 st. 3) u kodu sada ima TRI:** nadoknada po čl. 20b, poništen prepis po prijavi razmene i otpis prijateljstva. Nema zasebne kolone — minus JESTE nadoknada, pa `jeNadoknada`/`iznosNadoknade`/`raspolozivo` iz `nadoknada.ts` pokrivaju sva tri.

**Osamnaesti rođendan (čl. 19, `punoletstvo.ts`, cron 20:00 UTC).** Tri stvari.
1. 🔴 **Poništava se POEN zarađen prijateljstvima** — broj živih isplaćenih × 500, i to **NA OBE STRANE**: Milica sa 30 takvih gubi 15.000, a svakom od tih 30 drugova briše se po 500. **I ona i drugovi smeju u minus.** Ne broje se: **raskinuta** (njihovih 500 je već otpisano — inače bi isti POEN bio oduzet dvaput), **bratska** (nikad nisu nosila POEN) i **na čekanju** (druga strana nikad nije postala aktivna). Sve tri grupe nosi jedno polje: `Prijateljstvo.poenIsplacen`.
2. **Dete dobija potvrde stvarnosti od roditelja** — dve, po jednu od svakog, **ili jednu ako su oba u istom lancu potvrda** (zonska provera to sama obori; nije greška). Ide kroz `izvrsiVerifikacijuBezTokena`, koji postoji **ISKLJUČIVO zbog ovoga** — ne otvarati ga ničemu drugom.
3. **Prijateljstva se brišu.** Njihovo mesto zauzima lanac potvrda.
- **Sve ostalo OSTAJE**: POEN koji je roditelj prepisao i POEN iz razmene sa drugom decom se ne diraju.
- 🟡 **Ispravka datuma rođenja postoji, ali NAMERNO nema dugme** (odluka vlasnika 2026-08-18: „mogućnost ostaviti, ali je ne promovisati"). Po čl. 7 datum upisuje roditelj i posle upisa se ne menja; `POST /api/admin/deca/[id]/datum-rodjenja` je ispravka omaške koju sprovodi Fondacija na zahtev roditelja — **samo SUPERADMIN**, uz otkucan pseudonim. Nov datum mora da ostavi nalog maloletnim: prelazak u punoletni vodi isključivo `punoletstvo.ts` (otpis POEN-a, brisanje prijateljstava, potvrde roditelja), pa ispravka polja ne sme ni da ga pokrene ni da ga preskoči. Gasi `punoletstvoNajavaAt`, jer je najava izračunata iz starog datuma. Audit: `DATUM_RODJENJA_ISPRAVLJEN`. **Ne dodavati ulaznu tačku u interfejsu** — dugme bi ovo pretvorilo u redovan tok i otvorilo put da se punoletstvo pomera.
- **Redosled je bitan:** otpis → brisanje prijateljstava → prevođenje naloga → potvrde. Jezgro verifikacije odbija maloletni nalog kao metu, a potvrda pre otpisa dala bi 1.000 POEN koji bi otpis odmah pojeo.
- **Razlog za poništenje je uravnoteženje kanala:** prijateljstvo nosi 500 za trideset sekundi u istoj prostoriji, potvrda 1.000 uz odgovornost za tuđi identitet. Bez poništenja bi onaj ko krene sa 17 odradio godinu jeftinog kanala, ušao u 18. sa zalihom i **povrh toga** dobio ceo skupi — isti čovek, godina razlike, trajno drugačija pozicija.
- **Mesec dana ranije** ide obaveštenje detetu **i njegovim prijateljima** (i njima odlazi po 500 — bez toga je iznenađenje na najgorem mestu).

**Pričaonica (čl. 18).** Jedna soba za svu decu, ali **svako vidi samo poruke svojih prijatelja** (`idPrijatelja`, filter i na serveru i u početnom SSR upitu).
- **Posledica koja se dobija besplatno:** kad su svi učesnici međusobno prijatelji, **sam od sebe nastaje grupni razgovor** — graf pravi sobe umesto tebe.
- 🟡 **Prihvaćeno ponašanje:** Ana odgovori Milici, a Petar (Milicin prijatelj, Anu ne poznaje) vidi Aninu poruku bez povoda. Nije greška.
- 🔴 **NEMA odgovora sa citatom** — citat bi Petru pokazao Milicin tekst i zaobišao filter. Ne dodavati citiranje.
- **Dugme „prijavi"** (`PrijaviPoruku`, model `PrijavaPoruke`, `POST /api/chat/[id]/prijavi`) — pošto roditelj ne čita, dete je jedino koje može da signalizira; moderacija Fondacije se kači na to. Prijava **ne uklanja** poruku (uklanja je `DELETE /api/admin/chat/[id]`); jedna prijava po korisniku po poruci. Vidi „Prijava poruke nosi i čoveka" ispod.

**Šta roditelj vidi (čl. 9).** 🔴 **Razgovore između dece roditelj VIŠE NE ČITA** — izmena u odnosu na prvu verziju, i namerna: nadzor nad dečjim razgovorom dodiruje i tuđe dete, i to je bilo najteže mesto za DPIA i Politiku. Umesto sadržaja vidi **KO i KOLIKO** (`/api/deca/[id]/pregled`): spisak prijatelja sa datumima i spisak razgovora bez sadržaja, uz istoriju prepisa i oglase.
- **Razgovor deteta sa PUNOLETNIM licem je izuzetak** — roditelj ga čita, ali **ne piše u njemu** (sa druge strane je odrastao čovek, a odnos otvara isključivo roditeljski prekidač). Punoletnom sagovorniku stoji vidljiv natpis da razgovor čita roditelj — i odvraćanje i poštenje.
- **Obaveštenje stiže samo pri PRVOM javljanju u novom razgovoru.**

**Prepis POEN-a (čl. 14).** Roditelj i sopstveno dete prepisuju jedno drugom **bezuslovno, u oba pravca**. 🔴 **Prepis NE čeka potvrdu roditelja — čeka samo preuzimanje naloga** (stanje `POVEZANO`): prepis ne stvara nijedan nov POEN nego seli postojeći zapis, pa odbrana od farmovanja tu nema šta da brani; potvrda je uslov isključivo za **upis** iz prijateljstava (čl. 14b). Ekran je do 17.08.2026. bio stroži od rute — Novčanik je birao dugme po `tipKorisnika !== NEVERIFIKOVAN`, a dete je NEVERIFIKOVAN do punoletstva, pa dugmeta nije bilo ni u stanju `AKTIVNO`; sada se za maloletni nalog gleda `nalogRadi(stanje)`. Prema trećim punoletnim licima važi roditeljski prekidač (isti koji uređuje poruke). Nema mesečnog limita, perioda zabrane ni poništenja prepisa; istorija je vidljiva kao i za punoletne naloge.

**Pravni okvir.** Donja granica ostaje **7 godina**, pa svako dete od 7 do 15 u drugom ulazu prolazi kroz **prozor obrade pre pribavljenog pristanka** — otud minimum podataka (samo pseudonim + imejl roditelja), datum rođenja tek pri preuzimanju i rok od 14 dana. U praksi drugi ulaz služi starijoj deci (sedmogodišnjak ne kuca imejl); mlađi ulaze kroz roditeljski profil. **Prednost nad komercijalnim platformama vredi izričito upisati u Politiku:** roditelj ovde ne kliktne samo na dugme u poruci nego **postaje redovan član kroz lanac potvrda**, dakle njegov identitet je potvrdilo treće lice u stvarnom svetu — znatno iznad standarda razumnog napora. Imejl roditelja je podatak trećeg lica koji unosi dete i ima **sopstveni osnov — legitimni interes** radi pribavljanja zakonom traženog pristanka. U Pravilnik mora ući **odgovornost roditelja za radnje deteta**; bez nje je nosi Fondacija.

**Kod:**
- `src/lib/deca-pravila.ts` — ČISTE funkcije (stanja, uzrast, braća, isplata, punoletstvo); uvozi ih i pretraživač.
- `src/lib/protokol/deca.ts` — učesnici, vidljivost oglasa, ulazak preko roditelja, potvrde (čl. 6), uvid, brisanje.
- `src/lib/protokol/deca-poziv.ts` — samostalna registracija, poziv, preuzimanje, drugi roditelj, brisanje nepreuzetih.
- `src/lib/protokol/prijateljstva.ts` — QR kod, isplata, raskid, otpis, filter Pričaonice.
- `src/lib/protokol/punoletstvo.ts` — najava i prelaz.
- Rute: `POST /api/deca/registracija`, `GET|POST /api/deca/poziv/[token]`, `GET|POST /api/deca/preuzmi`, `DELETE /api/deca/prijatelji/[id]`, `GET /api/deca/[id]/pregled`, `POST /api/chat/[id]/prijavi`, cron `/api/cron/deca-punoletstvo` (20:00 UTC).
- Ekrani: `/registracija/dete`, `/dete-poziv/[token]`, `/prijatelji`, `MojaDeca.tsx`, `DeteProfil.tsx`, `DecjaPocetna.tsx`.
- Migracije: `20260817120000_prijateljstvo_transakcije` (enum vrednosti, ZASEBAN fajl) → `20260817120100_deca_unapredjeni_model` (`Roditeljstvo` sa backfill-om iz `User.roditeljId`, `RoditeljPoziv`, `PrijavaPoruke`, polja prijateljstva i punoletstva).
- Transakcije: `EMISIJA_PRIJATELJSTVO` (upis) i `OTPIS_PRIJATELJSTVO` (protivzapis). 🔴 Otpis **nije** `PONISTENJE_PREPISA` — ovde se poništava EMISIJA, pa opticaj opada; prepis samo seli POEN između dva korisnička zapisa.
- Testovi: `__tests__/deca-pravila.test.ts`, `__tests__/protokol/prijateljstva-poen.test.ts`, `__tests__/integracija/deca-tok.test.ts` (traži bazu).
- 🔴 **`User.roditeljId` VIŠE NE POSTOJI** — veza je u tabeli `Roditeljstvo` (najviše dva reda po detetu). Prisma upiti idu preko `roditeljstvaKaoDete` / `roditeljstvaKaoRoditelj`.

### Povratak u nalog deteta: imejl deteta i roditeljsko dugme (2026-08-18)

Nalog maloletnog korisnika po pravilu **nema imejl** — pri samostalnoj registraciji
dete unosi adresu SVOG RODITELJA, i ona se namerno ne upisuje u `User.email`
(čl. 4a, `deca-poziv.ts`). Tok „zaboravljena lozinka" traži imejl, pa detetu nije
stajao na raspolaganju: **zaboravljena lozinka je značila trajno zaključan nalog**,
sa prijateljstvima i POEN-om u njemu. Otud dva izlaza, i oba su potrebna.

**1. Roditelj postavlja novu lozinku** (`postaviLozinkuDeteta` u `protokol/deca.ts`,
`POST /api/deca/[id]/lozinka`, odeljak „Nova lozinka za dete" u `DeteProfil.tsx`).
Radi uvek, i za sedmogodišnjaka bez ijedne adrese.
- 🔴 **Stara lozinka se NE traži i ne može da se traži** — roditelj je ne zna, u
  tome i jeste stvar. Zaštitu nosi `mojeDeteIliBaci`: radnju izvodi isključivo
  roditelj tog deteta, prijavljen na sopstveni nalog.
- Dete dobija obaveštenje (`notifikacije.lozinka_promenio_roditelj`) — bez njega bi
  mu prijava prestala da radi bez ijednog traga o tome zašto.
- Polje **ne skriva lozinku**: roditelj je smišlja za dete i mora da je pročita
  naglas.

**2. Dete upisuje svoju adresu** (`protokol/dete-email.ts`, `GET|PATCH|DELETE
/api/profil/email`, `POST /api/profil/email/potvrdi`, `EmailDeteta.tsx` na profilu,
stranica `/potvrdi-email/[token]`). Za stariju decu koja adresu imaju.
- 🔴 **Adresa se NE upisuje u `User.email` pri unosu nego tek po potvrdi linkom
  poslatim NA NJU** (model `EmailPotvrda`, migracija `20260818140000_email_deteta`,
  rok 24 sata). Reset lozinke ide na upisanu adresu, pa bi jedno pogrešno otkucano
  slovo dalo nepoznatoj osobi trajan ključ od dečjeg naloga, i to bez ijednog znaka
  da se išta desilo. Sa potvrdom omaška ne pravi štetu.
- 🔴 **Potvrda je POST, ne GET** — klijenti za poštu prefetch-uju linkove. Isti
  razlog kao kod odjave sa obaveštenja.
- 🔴 **Potvrda postavlja `emailObavestenja: false`.** Adresa je data radi povratka u
  nalog, ne radi pošte; obim obrade se ne širi preko svrhe zbog koje je podatak dat.
- Jedan živ link po nalogu (stariji se poništavaju), inače bi potvrda mogla da upiše
  adresu koju je dete u međuvremenu ispravilo. Zauzetost adrese proverava se i pri
  unosu i pri potvrdi — `User.email` je `@unique`, a između ta dva trenutka prolazi
  ceo dan.
- Ruta je zatvorena za punoletne naloge (`deteIliBaci`) — odluka da se imejl ne
  prikazuje u podešavanjima punoletnog profila se ovim NE menja.

🟢 **AKTI OVO POZNAJU OD SETA 4.3.4** (isti dan): **Pravilnik o učešću dece čl. 7a**
uređuje dobrovoljnost, svrhu ograničenu na ponovni pristup nalogu, upis tek po
potvrdi sa same adrese, rok od 24 sata, uklanjanje u svakom trenutku, zadržavanje
pri prelasku u punoletni nalog i brisanje prestankom svojstva korisnika; **čl. 10**
daje roditelju ovlašćenje da postavi novu lozinku bez znanja stare, uz obaveštenje
detetu. Dopunjeni su i Politika 4.7, Registar radnji obrade (radnja 11) i DPIA
(R16, mere 5.11). Odredbe su zaključane testom `pravni-dokumenti.test.ts`.

🟢 **Kod i akt se ovde poklapaju:** `punoletstvo.ts` i `DELETE /api/profil` ne diraju
`User.email`, a čl. 7a st. 5 izričito kaže da se adresa prelaskom u punoletni nalog
**zadržava** (punoletan nalog imejl i inače sme da ima), a briše prestankom svojstva
korisnika. Ne dodavati brisanje pri punoletstvu — protivrečilo bi aktu.

### Ranglista škola (2026-08-18)

Dete u svom profilu bira **školu koju pohađa**, i iz izbora nastaju tri liste. Plan: `docs/plan-ranglista-skola.html`. Akt: **Pravilnik o učešću dece čl. 7, 15a i 15b** (set 4.3.4).

**Zašto postoji.** Modul Deca radi u jednom smeru — dete čeka roditelja, a nema čime da ga požuruje osim rečenicom „hoću poene". „Našoj školi fali troje do šestog mesta" je razlog koji dete sámo odnese kući. Ranglista deci ne daje ništa novo; ona postojećoj motivaciji (500 POEN po prijateljstvu, čl. 14b) daje **pravac**.

**Tri liste:**
- dve **nacionalne** — po broju uključene dece i po **udelu** u broju upisanih učenika; osnovne i srednje škole **odvojeno** (u jednoj listi bi gimnazija sa 900 đaka pregazila seosku osnovnu i po broju i po procentu);
- jedna **unutar škole** — deca te škole po **tekućem stanju POEN-a**.

🔴 **Ne nosi POEN.** Ni izbor škole ni mesto na listi. Da nosi, bio bi to **deseti kanal** iz čl. 15, sa dnevnim limitom i celim aparatom, a emisija vezana za broj naloga gura opticaj ka osnivačkom koraku.

🔴 **Broji se dete u stanju `AKTIVNO`** — sa bar jednim roditeljem koji je **redovan član**. `USLOV_AKTIVNO_DETE` (`protokol/skole.ts`) je Prisma prevod `stanjeDeteta()` iz `deca-pravila.ts`; **ta dva opisa se menjaju ZAJEDNO**, inače u sistemu postoje dve istine o tome šta je aktivno dete. Odbrana od naduvavanja nije brojčano ograničenje nego položaj roditelja — on rizikuje sopstveni nalog. Rang je **živa vrednost**, ne snimak.

🟡 **Rangiranje po tekućem stanju je odluka vlasnika**, uz poznatu posledicu: u rang ulazi i POEN koji je detetu prepisao roditelj, a potrošeni izlazi. Kad deca dobiju sopstvene zadatke, stanje će sve više odražavati njihov rad.

🔴 **Nema praga prikaza** (odluka vlasnika), pa škola sa 12 upisanih i jednim detetom daje 8,3% i seda na vrh. Zato **uz procenat UVEK ide i sam odnos** — `8,3% (1 od 12)`. Ne uklanjati taj razlomak: bez njega broj obmanjuje, a prag je izričito odbijen.

**Šifarnik škola.** `src/lib/skole-srbije.ts` — **uvezen 18.08.2026: 1.285 osnovnih škola, 522.884 upisana učenika** (JISP izvoz „Osnovno obrazovanje — Odeljenja i razredi", školska 2025/2026). 🔴 **Fajl se ne piše rukom** — generiše ga `scripts/uvezi-skole.mjs`, pa ručna izmena preživi tačno do sledećeg uvoza.
- **Izvoz je po ODELJENJU**, ne po školi: broj učenika se dobija tek sabiranjem odeljenja. Skripta grupiše.
- **Izvoz nema identifikator ustanove**, pa je `sifra` determinističan slug iz naziva i mesta. Par naziv + mesto jeste jedinstven, sam naziv nije — „OŠ Branko Radičević" javlja se na **42 mesta**. Ponovljen uvoz daje iste šifre, pa zatečeni izbori dece ostaju važeći.
- **Izvoz je na ćirilici** — skripta preslovljava. Dvoslovi (љ, њ, џ) prate okolinu, inače „ЉУБЕРАЂА" postane „LjUBERAĐA".
- 🔴 **Sadržaj zagrade se razrešava PRVI**: JISP beogradske škole vodi kao „БЕОГРАД (ЗВЕЗДАРА)", pa bi odbacivanje zagrade sve svelo na „Beograd" — i dve škole istog imena iz različitih opština dobile bi isti ključ (desilo se sa „OŠ Branko Radičević" i „OŠ Vladislav Petković Dis").
- Broj upisanih učenika **nikad se ne procenjuje** — škola bez njega stoji na listi po broju, a u procentualnoj sa crticom (u ovom uvozu takvih nema).
- 🟡 **Srednjih škola NEMA.** Ovaj izvoz ih nosi tek četrdesetak (muzičke i baletske koje dele ustanovu sa osnovnom), a u Srbiji ih je oko petsto; lista od četrdeset predstavljena kao „srednje škole u Srbiji" bila bi netačna. Do izvoza srednjeg obrazovanja nacionalna lista srednjih škola je prazna, a dete u srednjoj školi svoju školu ne može da izabere.
- **Uvoz ruši ceo posao** ako se neko `mesto` ne razrešava u `NASELJA_SRBIJE` ili ako se dve škole sudare oko šifre. Isto zaključava `__tests__/skola.test.ts` — škola čije mesto ne pogađa naselje nigde ne puca, samo tiho ispada iz svega što se kači na lokaciju.
- 🔴 **`NASELJA_SRBIJE` je pri uvozu prošireno za 336 naselja** (sa 1.561 na 1.897 navoda) — sedišta škola kojih nije bilo u popisnom spisku. Blok **širi zatečeni obim**: gornji deo je popis 2022 **bez KiM**, a dodata su i naselja sa Kosova i Metohije u kojima radi srpski obrazovni sistem (Kosovska Mitrovica, Banjska, Babin Most…). 🟡 Nova naselja nemaju koordinate u `naselja-koordinate.ts`, pa im udaljenost na Pijaci ostaje neizračunata — `koordinateZaMesto` vraća `null`, kao i za druga naselja bez koordinata.

**Promena škole najviše jednom u 30 dana.** 🔴 **PRVA postavka nije promena** i ne pokreće rok; brisanje izbora takođe ne. Poruka o odbijanju nosi **datum**, ne „pokušaj kasnije". Rok ne štiti od zloupotrebe (nema šta da se zaradi) nego od pomeranja liste — bez njega bi odeljenje moglo da „upadne" u tuđu školu na dan merenja. **Istorija izbora se ne čuva.**

🔴 **Škola se briše na TRI mesta i sva tri se lako previde:** `punoletstvo.ts` (inače punoletan čovek zauvek ostaje u brojanju svoje osnovne škole — nigde ne puca, samo je broj za jedno veći), `DELETE /api/profil` (čl. 34) i `reset-korisnika.ts`.

**Kod:** `src/lib/skola.ts` (ČISTE funkcije — razrešavanje šifre, pretraga, rok, rangiranje; uvozi ih i pretraživač) + `src/lib/skole-srbije.ts` (podaci) + `src/lib/protokol/skole.ts` (servisne, re-eksportuje pravila). Rute: `PATCH /api/profil/skola`, `GET /api/skole`, `GET /api/skole/[sifra]`, `GET /api/skole/pretraga`. Ekrani: `/skole`, `/skole/[sifra]` (sopstveni layout, kao Pijaca — gost dobija `PublicHeader`), `IzborSkole.tsx` na profilu deteta, kartica `SkolaKartica` na dečjoj početnoj. Migracija `20260818120000_skola_deteta` (`User.skolaSifra`, `skolaPromenjenaAt`, indeks). Testovi `__tests__/skola.test.ts`.
- **Pretraga ide RUTOM, ne šifarnikom u paketu** — spisak nosi oko 1.600 škola i preko sto kilobajta, a treba samo detetu koje bira školu, jednom. (Kod naselja je suprotno, jer je taj spisak petostruko manji.)
- **Nema tabele `Skola`** — šifarnik je statičan spisak u kodu, kao `NASELJA_SRBIJE`; sistem o školi ne stvara nijedan sopstveni podatak.

### 🔴 Profil maloletnog korisnika se punoletnim članovima NE otvara (2026-08-18)

Pravilo je šire od ranglista i vredi više od njih. Načelo: **do deteta se dolazi samo kroz ono što je dete sámo objavilo** — nikad kroz profil, pretragu ili spisak. Ranglista i knjiga zapisa pokazuju da dete postoji; one nisu vrata ni u šta.

Ovo je **SUŽAVANJE** zatečenog stanja: do 4.3.3 je profil maloletnog naloga bio dostupan svakom potvrđenom članu i krio je samo indeks i lanac potvrda.

- **Odluka je na SERVERU** (`pristupProfiluDeteta` u `protokol/deca.ts`, pravilo `smeDaVidiProfilDeteta` u `deca-pravila.ts`), ne u komponenti — ekran nije poslednja reč, a ovo je jedina odbrana koju dete ima od nepoznatog odraslog. Ruta vraća **200 sa `zatvoren`**, ne 403, jer stranica mora da objasni zašto.
- **Zatvoren ekran radi tri stvari:** kaže zašto, **imenuje roditelja** (čl. 10 — roditelj odgovara za radnje deteta; bez imena je to slepa ulica, a zapis u knjizi ostaje neobjašnjen) i pokazuje jedini put dalje — oglas. 🔴 Ništa drugo na njemu ne stoji: ni stanje, ni škola, ni oglasi, ni prijateljstva. Svaki dodatak ga pretvara u mali profil.
- 🔴 **Roditeljski prekidač `dozvolaOdrasli` profil NE otvara** — on uređuje komunikaciju i razmenu (čl. 10 st. 2, čl. 12). Da ga otvara, roditelj bi jednim potezom otključao i ono što nikad nije razmatrao. Zaključano testom.
- **Fondacija zadržava uvid** — bez toga nema uklanjanja spornog oglasa ni postupanja po prijavi poruke.
- **Dete vidi profil SAMO svog prijatelja.** Dete iz iste škole koje mu nije prijatelj dobija isti zatvoren ekran; put do drugog deteta ostaje jedan — skeniran QR kod uživo.
- 🔴 **Sve staze vode na taj ekran.** Ako makar jedna ostane otvorena, zabrana ne vredi ništa: knjiga zapisa, oglas na Pijaci, lista u školi, spisak dece na profilu roditelja, QR kod, obaveštenje o prepisu. `GET /api/korisnici/pretraga` i dalje filtrira `maloletan: false`.
- **Šta zatvaranje NE krije:** detetove transakcije — knjiga zapisa je otvorena i tako ostaje. Krije sve ostalo skupljeno na jednom mestu, pre svega **ukupno stanje**, koje dete čini metom.

**Veza roditelj–dete je javna u OBA smera** (odluka vlasnika): sa deteta se vidi roditelj, sa roditelja ko su mu deca. 🔴 **Posledica je svesno prihvaćena** — deca time postaju popisiva preko odraslih, što je šira izloženost od svih ranglista zajedno. Zaštitu tada nosi zatvoren profil i prekidač, ne skrivenost. Usput utvrđeno: program **Podrška majkama tu javnost NE traži** (Fondacija vezu ionako vidi, a potvrđivači potvrđuju bez uvida u unete podatke) — javnost stoji na sopstvenom razlogu.

### Prijava poruke nosi i čoveka (2026-08-17)

Prijava je do ove izmene hvatala **samo poruku**, uz opcion slobodan tekst, a `status` je ostajao `OTVORENA` zauvek — nijedan ekran je nije zatvarao. Prijava je odlazila u mejl adminu i tu se gubila.

🔴 **Prijava od sada nosi I PORUKU I ČOVEKA, i to je namerno oboje.**
- **Poruka je DOKAZ.** Roditelj razgovore dece više ne čita, pa je prijavljena poruka jedino što Fondacija sme i može da pogleda. Čista „prijavi korisnika" bez poruke terala bi moderatora da pročita celu sobu — dakle da vrati nadzor koji je unapređeni model upravo skinuo.
- **Čovek je SUBJEKT.** Opasnost je gotovo uvek nalog: tri prijave iz tri razgovora nad istim nalogom su signal koji nijedna od tih poruka sama ne nosi. `PrijavaPoruke.prijavljeniId` je autor poruke, **denormalizovan** (autor poruke se ne menja), a admin ekran grupiše po njemu.

**Šifra razloga sa zatvorene liste** (`PrijavaPorukeRazlog`) umesto samo slobodnog teksta — sedmogodišnjak neće napisati obrazloženje, ali ume da pritisne dugme. Slobodan tekst se traži **samo uz „ostalo"**; uz izabranu šifru bi dodatno pisanje odvraćalo dete od prijave.
- 🔴 **`TRAZI_SLIKE`, `TRAZI_SUSRET` i `LAZE_UZRAST` stoje odvojeno** — to su obrasci mamljenja i pod zbirnom šifrom „neprimereno" ne bi se videli. Te tri su i **hitne** (`jeHitno`): dižu grupu na vrh spiska, ne sankcionišu ništa.
- **Jedna lista, dve sobe.** Ekran nudi `RAZLOZI_DECA` odnosno `RAZLOZI_ODRASLI`; server ne proverava pripada li šifra sobi — promašena šifra je pogrešno razvrstana prijava, ne rupa.

**Admin tab „Prijave"** (`PrijaveTab.tsx`, ključ `prijave`) — grupisan po prijavljenom nalogu, uz broj **različitih prijavilaca** (`jeObrazac`, prag 3; jedan čovek koji pritisne tri puta nije obrazac). Dve odluke, obe uz obavezno obrazloženje: **ukloni poruku** (meko uklanjanje + zatvara SVE otvorene prijave nad tom porukom, jer poruke više nema pa nemaju o čemu da odlučuju) i **odbaci prijavu** (zatvara samo svoju — druga prijava nad istom porukom ima drugu šifru i drugog prijavioca).
- 🔴 **Tab NE sankcioniše nalog.** Suspenzija i isključenje (Uslovi čl. 27, 28) su zasebna odluka i žive u tabu Korisnici. Obrazac se prikazuje da bi ga čovek VIDEO, ne da bi sistem sam kaznio.
- Nije isto što tab **Pijaca** (oglasi) ni **Razmene** (prepis POEN-a). Četiri različite odluke, četiri taba.

**Dugme je sada i u sobi odraslih.** Ruta je od početka bila otvorena svima, ali dugmeta nije bilo nigde osim u dečjoj sobi — pa je jedini put do Fondacije bio da si dete.

**Kod:** `src/lib/prijava-poruke-pravila.ts` (ČISTE funkcije + šifarnik; uvozi ih i komponenta u pretraživaču) + `src/lib/prijava-poruke.ts` (servisne, re-eksportuje pravila). Komponenta `src/components/PrijaviPoruku.tsx` (obe sobe). Rute: `POST /api/chat/[id]/prijavi` (prima `razlogKod`), `GET /api/admin/prijave-poruka`, `POST .../[id]/{ukloni,odbaci}`. Migracija `20260817140000_prijava_poruke_subjekt` (enum + `prijavljeniId` sa backfill-om iz `ChatMessage.userId`, pa tek onda `NOT NULL`; prijave bez poruke se brišu). Testovi `__tests__/prijava-poruke.test.ts` i `__tests__/integracija/prijava-poruke-tok.test.ts`. Audit: `PRIJAVA_PORUKE_RESENA`, `PRIJAVA_PORUKE_ODBACENA`. Badge: tab Prijave + sidebar `adminCekanje`.
- **Zvonce adminima uz mejl** — bez javljanja red čekanja postoji a niko ne zna da postoji (isti obrazac kao kod prvih oglasa). Mejl nosi i broj različitih prijavilaca, pa se obrazac vidi pre otvaranja ekrana.
- 🟡 **Prijava naloga BEZ poruke (sa profila) ne postoji** — za sumnju koja nije u poruci („mislim da moj drug nije dete") još nema ulaza. Sadašnji tok pokriva ono što se u praksi dešava u porukama; ako zatreba, mesto je profil, a ne ovaj tab.

### Povod razgovora — oglas u razgovoru (2026-08-10)

Klik na „Kontaktiraj" upisuje `Konverzacija.povodOglasId`, gde **čeka**; prva poruka onoga ko NIJE vlasnik oglasa ga troši i prenosi na `Poruka.oglasId`. Migracija `20260810160000_poruka_oglas_povod`.
- **Zašto ne URL parametar:** čovek često otvori razgovor pa napiše tek kasnije, iz liste razgovora — tada `?oglas=` više nema i kartica se nikad ne pojavi.
- **Zašto ne samo na konverzaciji:** `Konverzacija` je `@@unique([user1Id,user2Id])` — jedna po PARU ljudi — pa bi drugi oglas prebrisao prvi. Trajni zapis mora na poruku.
- **Odvojeno od `OglasUpit`**, koji broji upite za korak 3 putanje razmene: ovo je prikaz, ne merilo.
- **Prihvata se samo tuđ oglas** (`sellerId` = druga strana), inače bi svako prikačio svoj.
- **UI:** dok poruka nije napisana, kartica stoji iznad polja za kucanje; posle prve poruke iznad nje u razgovoru.

### Ulazak u KOLO kroz razmenu — doprinos sadržaju platforme (2026-08-09)
Zamenjuje **tablu zahteva za jemstvo**, koja je UKINUTA. Osnov: Pravilnik 4.1.0 čl. 15 t. 8, čl. 16 st. 5, čl. 28 st. 2, čl. 32 st. 4, čl. 35, nov **čl. 40a**, čl. 67; dokaz stvarnosti 4.1.0 čl. 5 i 7; Uslovi/Politika/DPIA/Radnje obrade 4.1.0. Plan sprovođenja: `docs/plan-ulaz-kroz-razmenu.html`.

**Povod za ukidanje table:** za pet dana rada feed prepoznavanja nije upotrebljen **nijednom** (15 kartica ikad, 0 sa telefonom, 0 zapisa prepoznavanja). Uz to je kartica bila najosetljivija obrada ličnih podataka u sistemu — ovo je jedina izmena u istoriji projekta koja **skida** obradu umesto da je dodaje.

- **Nov put do verifikacije:** neverifikovani objavi **ponudu na Pijaci** → mreža ga povodom oglasa prepozna → verifikacija jednokratnim kodom. Kontakt se uspostavlja kroz platformski prostor za oglašavanje (čl. 32 st. 4), ne kroz zaseban zid.
- **Šta neverifikovani SME:** oglas tipa **PONUDA** (ne i POTRAZNJA), najviše **3 aktivna**, uz **sadržinski minimum** (naslov, opis, bar 1 fotografija, kategorija, mesto — **dužina naslova i opisa nije uslov**; brojčani prag od 40 znakova UKINUT 2026-08-13 odlukom vlasnika). Sme da **odgovara** u razgovoru koji je verifikovani pokrenuo povodom njegovog oglasa — mehanizam je već postojao za tablu i preuzeo je njen posao bez ijedne nove linije (`POST /api/poruke` traži verifikaciju, `POST /api/poruke/[konvId]` proverava samo članstvo).
- **🔴 Šta je neverifikovanom ODUZETO:** više **ne može da inicira prenos POEN-a** — u ažuriranju evidencije učestvuje isključivo kao **primalac** (čl. 28 st. 2). Uslov se vezuje za **tip naloga** (`NEVERIFIKOVAN`), NE za indeks: ko je jednom verifikovan sme da upisuje POEN i ako mu indeks kasnije padne. Čita se **iz baze**, ne iz sesije (token se osvežava sa zakašnjenjem).
- **Osmi kanal — doprinos sadržaju platforme (čl. 40a):** jednokratno **1.000 POEN** za prvi oglas kojim korisnik nudi dobro/uslugu i koji ispunjava minimum. Kanal je **automatski akt Protokola** i NE ulazi u dnevni limit.
- **🔴 BELEŽENJE ≠ EVIDENTIRANJE — pravno srce izmene, ali SAMO za neverifikovanog (čl. 40a st. 3–4).**
  - **Verifikovan** objavi kvalifikovan oglas → doprinos se **odmah evidentira** (`EVIDENTIRAN`, okidač `OBJAVA_VERIFIKOVAN`, od 2026-08-11 preimenovan u `OBJAVA`). Uslov je **tip naloga**, ne indeks, i čita se **iz baze**.
  - **Neverifikovan** objavi → oglas ide na Pijacu **odmah**, doprinos se samo **beleži** (`ZABELEZEN`); zapis POEN-a nastaje kad ga **Fondacija odobri** (glavni put od 2026-08-11, admin tab „Prvi oglasi") ili kad nastupi neki od zatečenih okidača: verifikacija u lancu potvrda ILI **primljen POEN**. Do tada nije zapis POEN-a, ne ulazi u stanje, opticaj ni javne agregate.
  - Razlog razdvajanja: 50 praznih naloga bi naduvalo opticaj — a opticaj okida **osnivački korak od 24.000 POEN** (prag 100.000) i gasi prelazno ograničenje iz čl. 22 dokaza stvarnosti. **Za verifikovan nalog to čekanje ne štiti ni od čega** — nalog čija je stvarnost potvrđena nije prazan nalog. Prvobitna verzija čl. 40a nije pravila tu razliku, pa je verifikovanom članu doprinos stajao zabeležen i čekao okidač koji mu je već bio iza leđa (verifikacija).
- **Prelazna radnja za zatečene (čl. 40a, poslednji stav):** `evidentirajZatecene()` + dugme **Osnivači → „Evidentiraj zatečene"** (`POST /api/admin/doprinos-sadrzaju/zatecene`, samo superadmin). Razrešava **sve** doprinose koji stoje `ZABELEZEN` — od 2026-08-11 i one bez potvrde (ranije ih je preskakao). Idempotentno. **Namerno na dugmetu, ne u migraciji** — emisija mora kroz `emitujPoen` (zero-sum, audit), a opticaj skače za 1.000 × broj razrešenih, što može da upali osnivački korak; taj trenutak bira čovek. Dugme uz to **naknadno javlja** onima kojima je doprinos evidentiran a obaveštenje nije otišlo (vidi `obavestenAt` ispod).
- **Obaveštenje o evidentiranju (`obavestenAt`, 2026-08-09):** `probajEvidentirati` po svakom uspešnom evidentiranju zove `obavesti()` (`notifikacije.doprinos_sadrzaju`, link `/novcanik`) i upiše `DoprinosSadrzaju.obavestenAt`. Bez toga se čoveku stanje promeni bez ijednog traga u zvoncetu — što se i desilo pri prvom pritisku na „Evidentiraj zatečene", pre nego što je obaveštenje postojalo. **Zaseban stub, ne `evidentiranAt`:** zapis POEN-a ne sme da čeka na mejl/push (umeju da padnu), a obaveštenje ne sme da ode dvaput; `EVIDENTIRAN` + `obavestenAt: null` znači „duguje se javljanje" i to stanje prelazna radnja pokupi. Neuspelo obaveštenje ne obara evidentiranje. Migracija `20260809140000_doprinos_obavesten` (zatečeni redovi ostaju `NULL` **namerno** — njima se javljanje duguje).
- **Jednokratnost drži BAZA, ne kod:** `DoprinosSadrzaju.userId` je `@unique`. Uklanjanje oglasa zbog povrede Uslova pre evidentiranja poništava zabeležen doprinos (čl. 40a st. 4), ali **ne oslobađa kanal** — inače bi uklanjanje spornog oglasa bilo besplatno. Već evidentiran doprinos se NE dira.
- **Sadržinski minimum ima dve uloge:** uslov **za objavu** samo neverifikovanom (i pri objavi i pri izmeni oglasa — inače se zaobilazi u dva poteza), uslov **za doprinos** za svakoga. Verifikovanom se oglas ispod minimuma i dalje objavljuje, samo bez doprinosa.
- **Retroaktiva:** migracija `20260809120200_doprinos_retroaktiva` beleži doprinos za **najstariji** zatečeni kvalifikovan oglas po korisniku. Ne pravi skok opticaja: postojeći članovi su već verifikovani, pa njihov doprinos čeka **prvi primljen POEN**.
- **Jednokratni kod produžen sa 2 na 24 sata** (`TOKEN_VAZI_SEKUNDI`) — dogovor se sada vodi kroz poruke, dve osobe retko stoje jedna pored druge kad kod nastane.
- 🔴 **Brane protiv naduvavanja opticaja UKLONJENE (odluka vlasnika, 2026-08-09)** — plan je predviđao dve (ručno okidanje osnivačkog koraka + admin alert na obrazac okidača); obe su uklonjene istog dana kad su i objavljene. Preostale brane su **razdvajanje BELEŽENJA od EVIDENTIRANJA** (čl. 40a st. 4), koje je normativno i ostaje, i od 2026-08-11 **odobrenje Fondacije** kao glavni put za nalog bez potvrde (vidi sekciju ispod); uz njih **sadržinski minimum** oglasa i **najviše 3 aktivna oglasa**.
  - **Osnivački korak je AUTOMATSKI** — noćni cron zove `proveriIEvidentirajKorak()` bez ljudske potvrde, korak na svakih 100.000 POEN opticaja. Ako opticaj preskoči više pragova odjednom (velika bulk emisija), koraci se pale **uzastopno** dok se svi preskočeni ne nadoknade. `RUCNO_OKIDANJE_KORAKA` i `najaviBlizinuKoraka()` su obrisani — ne vraćati ih bez izričitog naloga.
  - **Samopojačavanje je sprečeno snimkom:** `ukupanPoen` se čita **pre** petlje, pa POEN koji koraci sami emituju ne gura sledeći prag. Ne menjati u „čitaj posle svake emisije" — kanal bi se sam ubrzavao. Zaključano testom `__tests__/protokol/osnivacki-koraci.test.ts`.
  - `proveriObrazacOkidaca` obrisan — nema više upozorenja kad isti član okine evidentiranje za više naloga.
  - Audit: `DOPRINOS_SADRZAJU_{ZABELEZEN,EVIDENTIRAN,PONISTEN}` **ostaje** — to je zapis šta je Protokol uradio, ne brana; bez njega kanal ne bi ostavljao trag. Jedini ne-admin zapisi u audit logu.
- **Kod:** `src/lib/doprinos-pravila.ts` (ČISTE funkcije — bez Prisme, jer ih uvozi i forma oglasa u pretraživaču) + `src/lib/protokol/doprinos-sadrzaju.ts` (servisne; re-eksportuje pravila, pa server ima jedan ulaz). Testovi `__tests__/protokol/doprinos-sadrzaju.test.ts`. Migracije `20260811130000_doprinos_objava_svima` (`OBJAVA_VERIFIKOVAN` → `OBJAVA`) i `20260811140000_doprinos_odobrenje` (okidač `ODOBRENJE`); ranije `20260809120000_doprinos_sadrzaju` (model + enumi + `TransactionType.EMISIJA_SADRZAJ`) → `20260809120100_tabla_jemstva_podaci` (brisanje redova `Prepoznavanje`/`ZahtevZaJemstvo`; zaseban fajl jer nova enum vrednost ne sme u istu transakciju) → `20260809120200_doprinos_retroaktiva` → `20260809130000_doprinos_objava_verifikovan` (nova vrednost okidača `OBJAVA_VERIFIKOVAN`; opet zaseban fajl — Postgres ne da da se nova enum vrednost koristi u transakciji u kojoj je dodata) → `20260809140000_doprinos_obavesten` (`obavestenAt`).
- **`probajEvidentirati()` MORA van `prisma.$transaction()`** — `emitujPoen()` otvara sopstvenu. Ne baca: ni verifikacija ni prenos POEN-a ne smeju da padnu zbog ovog kanala. Prelaz se **rezerviše** uslovnim `updateMany` pre emisije; ako emisija pukne, doprinos se vraća u `ZABELEZEN`.
- **Šta je obrisano:** `/api/tabla-jemstva/**`, `/api/admin/tabla-jemstva/**`, `/api/cron/tabla-jemstva-istek` (+ cron iz `vercel.json`), `src/components/jemstvo/**`, `src/components/verifikacija/JemstvoObjava.tsx`, `src/lib/jemstvo-kartica.ts`, `izvrsiVerifikacijuSaTable()`, sidebar stavka i njen badge. **Struktura tabela `ZahtevZaJemstvo`/`Prepoznavanje` ostaje jedan ciklus** radi povratka (podaci su već obrisani, pa minimizacija ne čeka) — uklanja je posebna migracija `_tabla_jemstva_drop`. `/tabla-jemstva` ostaje kao stranica koja objašnjava šta ju je zamenilo (stari linkovi u notifikacijama i mejlovima).
- **🟡 Levak (`src/lib/levak.ts`) je prerođen:** korak `objavili_karticu` obrisan, a `verifikovani` premešten **posle** `objavili_oglas` — po novom putu čovek prvo objavi ponudu, pa ga tek onda neko verifikuje.
- **✅ Akti su doneti i punovažni** (set 4.1.0 u `dokumentacija 4.1/`, na snazi danom donošenja). Odlukom vlasnika izostavljeni su rok od 15 dana, ponovna saglasnost i cirkularno obaveštenje — sistem još nije zvanično u radu. Vidi „Kanonska dokumentacija" za posledicu po zatečene pristanke i za obavezu punog postupka pri prvoj izmeni posle puštanja u rad.

### Doprinos razmeni — putanja prvog kruga (2026-08-09)
Nadogradnja osmog kanala (čl. 40a): umesto jednokratnih 1.000 POEN, korisnik prolazi **lestvicu od pet koraka × 1.000 POEN**, uz **doživotnu kapu od 5.000 POEN**.

| # | Uslov | POEN |
|---|---|---|
| 1 | Prvi oglas sa sadržinskim minimumom + prva razmena u kojoj ti neko evidentira POEN u korist | 1.000 |
| 2 | Prva razmena u kojoj ti evidentiraš POEN korisniku van svog lanca | 1.000 |
| 3 | 3 oglasa, od kojih su 2 dobila upit od različitih korisnika | 1.000 |
| 4 | Razmene sa 5 različitih osoba van tvog lanca | 1.000 |
| 5 | Razmene sa 10 različitih osoba van tvog lanca | 1.000 |

- 🔴 **„Razmena" = UPIS POEN-a, ništa drugo.** Nema ručnog označavanja razmene, nema modela `Razmena`, nema obostrane potvrde. Brojač čita same transakcije (`TransactionType.TRANSFER`). Odluka vlasnika 2026-08-09; prvobitna verzija je imala model sa obostranom potvrdom i on je uklonjen migracijom `20260809170000_razmena_bez_oznacavanja` (`DROP TABLE IF EXISTS` — prethodna migracija se NE menja, vidi „Primenjena migracija se NE dira" ispod). **Ne vraćati označavanje razmene.**
- 🔴 **Korak 1 je ZATEČENI čl. 40a i NIJE diran** — ni iznos, ni odloženo evidentiranje, ni `DoprinosSadrzaju`. Tabela `DoprinosRazmeni` nosi **samo korake 2–5**, uz `CHECK (korak BETWEEN 2 AND 5)` i `@@unique([userId, korak])`. **Kapu time drži BAZA, ne kod:** najviše četiri reda × 1.000 + 1.000 iz čl. 40a = 5.000. Ne dodavati proveru kape u kodu — bila bi druga istina.
- **Tri sita brojača** (`sagovorniciUBrojacu`, čiste funkcije):
  1. **Prag od 1.000 POEN po transakciji** (`MIN_IZNOS_TRANSAKCIJE`). 🔴 Meri se **PO TRANSAKCIJI, ne po zbiru** sa istim čovekom — inače bi se prag zaobišao deljenjem na sitne upise. Bez praga bi lestvica prolazila sa deset upisa od po jedan POEN.
  2. **Van kruga poznanstava** = nijedno nije u zoni drugog (`verifikacionaZona`, oba smera) — ista tabela po kojoj se sudi ko koga sme da verifikuje.
  3. **Sagovornik mora biti verifikovan** — upis nekome ko još nije verifikovan se beleži, a broji tek po njegovoj verifikaciji.
- **Svaki sagovornik broji se jednom za celu lestvicu** (otud `Set`, ne broj transakcija). **Smer je bitan samo za korak 2** (`jaSamUpisao`) — koracima 4 i 5 nije.
- 🔴 **Nema pravila o povratnom toku POEN-a** (raniji rok od 60 dana je uklonjen istom odlukom). Ne vraćati ga.
- **Brojač je ŽIVA vrednost, ne snimak** — čita se iz `verifikacionaZona` pri svakom preračunu. Posledica koju treba znati: ko kasnije verifikuje nekoga sa kim je razmenjivao, tog čoveka **gubi iz brojača** (ušao mu je u krug poznanstava). To utiče samo na **buduće** korake — **već zabeležen korak se ne poništava**, jer se zapis POEN-a ne obara unazad (za to postoji postupak iz dokaza stvarnosti, Glava VIII). Ako to postane problem, rešenje je snimak „van lanca" u trenutku transakcije, ne menjanje ovog pravila usput.
- **Koraci se otključavaju REDOM** (`dostignutKorak` = najviši korak do koga su svi prethodni ispunjeni). Ko ima deset sagovornika a nije objavio tri oglasa, stoji na koraku 2. Posledica: korak 2 traži upis POEN-a, što neverifikovani ne sme (čl. 28 st. 2) — pa su koraci 2–5 faktički zatvoreni dok se čovek ne verifikuje, iako je mašinerija `ZABELEZEN`/`EVIDENTIRAN` ista kao kod čl. 40a i radi za oba slučaja.
- **Korak 3 nije „broj oglasa sa bar jednim upitom":** isti čovek koji se javio na tri tvoja oglasa daje **jedan**, ne tri. Računa se najveće uparivanje oglas ↔ pošiljalac (`brojOglasaSaRazlicitimUpitima`, Kuhn nad dvodelnim grafom). Uklonjeni oglasi (`UKLONJEN`) se ne broje — inače bi se korak prolazio sadržajem koji je Fondacija skinula.
- **`OglasUpit`** je jedini nov zapis o ponašanju i nastaje **automatski** kad razgovor krene sa stranice oglasa: `POST /api/poruke` prima **opcion `oglasId`**. Ne čuva sadržaj poruke — merodavno je samo ko se javio i povodom čega.
- **Okidači preračunavanja:** objava oglasa, upit, prenos POEN-a (obe strane), i **verifikacija** — koja preko `osveziSagovornike()` pomera i TUĐE brojače (upis sa neverifikovanim počinje da se broji). Sve `probajNapredovati`/`probajEvidentiratiKorake` idu **VAN `prisma.$transaction()`** i **ne bacaju** — isti obrazac kao čl. 40a.
- **Kod:** `src/lib/doprinos-razmeni-pravila.ts` (ČISTE funkcije — pragovi, sita, redosled; bez Prisme jer ih uvozi i prikaz) + `src/lib/protokol/doprinos-razmeni.ts` (servisne, re-eksportuje pravila). Ruta: `GET /api/doprinos-razmeni`. UI: `PutanjaRazmene.tsx` u Novčaniku (Suspense) — **na Pijaci nema nijednog dugmeta**, kanal radi sam. Migracije `20260809160000_doprinos_razmeni` → `20260809170000_razmena_bez_oznacavanja`. Testovi `__tests__/protokol/doprinos-razmeni.test.ts`. Audit: `DOPRINOS_RAZMENI_{ZABELEZEN,EVIDENTIRAN}`. Transakcija: `EMISIJA_RAZMENA` (zaseban tip od `EMISIJA_SADRZAJ`, da se u istoriji vidi šta je došlo sa lestvice).
- **Zabeleženi koraci se u Novčaniku sabiraju sa zabeleženim doprinosom čl. 40a** u jedan red „Zabeležen doprinos" — čekaju iste okidače, pa dva odvojena iznosa ne bi značila ništa čoveku. I dalje se **nikad ne sabiraju sa stanjem** (čl. 12).
- 🟡 **Korak 5 je za sada nedostižan.** Deset različitih ljudi van kruga poznanstava, uz upis od bar 1.000 POEN sa svakim, pri desetak transakcija u celom sistemu znači da će lestvica prvih meseci praktično stajati na koraku 3. Ako treba da radi odmah u beti, spušta se **na jednom mestu** — `PRAG_SAGOVORNIKA_KORAK_5` u `doprinos-razmeni-pravila.ts` (npr. na 7), bez ijedne druge izmene.
- ✅ **Akti dopunjeni (4.2.1).** Nov **čl. 40b Pravilnika** propisuje lestvicu od pet koraka, kapu od 5.000 POEN, prag od 1.000 POEN **po pojedinačnom zapisu**, pojam „van kruga poznanstava" (= nije u zabranjenoj zoni u smislu dokaza stvarnosti), pravilo da se svaki sagovornik broji jednom i da se već evidentiran doprinos ne poništava kad brojač kasnije padne. Uz to: **Uslovi** čl. 16 (beleženje upita) i čl. 22 (Platforma ne traži označavanje razmene), **Politika** 4.10 + rok čuvanja, **DPIA** radnja br. 15 / rizik R15 / mere 5.10, **Registar radnji obrade** radnja br. 15.
  - 🔴 **Korak 1 u čl. 40b je UPUĆIVANJE na čl. 40a, ne samostalan uslov.** Prva verzija ga je opisala kao „prvi oglas + prva razmena u kojoj ti neko upiše POEN" — što bi za verifikovanog korisnika bilo strože od čl. 40a, koji mu doprinos evidentira već pri objavi. Dva člana istog pravilnika bi se protivrečila. Ne vraćati samostalan opis.
  - **Brojevi u aktu i u kodu moraju se poklapati** (5.000 kapa, 1.000 prag, 3 oglasa / 2 upita, 5 i 10 sagovornika). Test `pravni-dokumenti.test.ts` traži kapu i prag doslovno u tekstu akta, pa izmena konstante u kodu bez izmene akta pada.

### Prvi oglas: objava odmah, POEN po odobrenju Fondacije (2026-08-11)

Odluka vlasnika, u dva koraka istog dana: prvo „neka nepotvrđen član dobije 1.000 POEN odmah kad postavi oglas", pa ispravka — **oglas ide na Pijacu odmah, ali se POEN evidentira kad administrator odobri**. Merodavna je ispravka; međukorak (evidentiranje svakome u trenutku objave) nikada nije bio na `main`-u.

- **Šta radi kod:** `zabeleziDoprinos()` i dalje čita tip naloga. Verifikovanom → `probajEvidentirati(..., OBJAVA)` odmah. Neverifikovanom → red ostaje `ZABELEZEN` i **javlja se adminima** (`najaviNaCekanju`: zvonce svakom adminu sa linkom `/admin?tab=prvi-oglasi`, uz `posaljiAdminAlert` na mejl i Telegram). Bez javljanja bi red čekanja postojao a niko ne bi znao da postoji.
- **Nove servisne funkcije:** `odobriDoprinos(id, adminId)` → `probajEvidentirati(..., ODOBRENJE, adminId)` (idempotentno preko iste rezervacije prelaza) i `odbijDoprinos(id, adminId, razlog)`.
- 🔴 **Odbijanje BRIŠE zapis, ne poništava ga.** Kanal time ostaje slobodan: čovek dopuni oglas ili objavi bolji i doprinos se ponovo beleži. To NIJE isto što `ponistiZabelezen` (oglas uklonjen zbog povrede Uslova), koje kanal namerno troši — tamo je prekršaj, ovde ocena da oglas ne zaslužuje doprinos. Trag ostaje u revizijskom dnevniku (`DOPRINOS_SADRZAJU_ODBIJEN`, razlog + korisnik + oglas). **Razlog je obavezan** i ide korisniku u zvonce.
- **Odbijanje NE uklanja oglas.** Uklanjanje je moderacija (Uslovi čl. 21, 25) i živi u tabu Pijaca. Dve različite odluke, dva različita taba — ne spajati ih.
- **Admin tab „Prvi oglasi"** (`PrviOglasiTab.tsx`, ključ `prvi-oglasi`): sličica oglasa (`/api/pijaca/slika/<oglasId>/0`) koja vodi na sam oglas, pseudonim (link na profil), mesto, kategorija, skraćen opis, dugmad **Odobri 1.000 POEN** / **Odbij** (uz obavezan razlog) i prikaz „Odobreni" radi provere. Učitava se lenjo, iz taba; server šalje samo broj za badge.
- **Broj svetli na dva mesta:** oznaka uz naziv taba (`prvihOglasaNaCekanju`, iz `admin/page.tsx`) i **sidebar Admin badge** (`adminCekanje` u `chrome-podaci.ts` — dodat `doprinosSadrzaju.count({status: ZABELEZEN})`). Akcioni badge se namerno ne nuluje otvaranjem: pada kad se stavka reši.
- **Okidač `ODOBRENJE`** dodat u `DoprinosOkidac` migracijom `20260811140000_doprinos_odobrenje`, u ZASEBNOM fajlu od `20260811130000_doprinos_objava_svima` (koja `OBJAVA_VERIFIKOVAN` preimenuje u `OBJAVA`): `ALTER TYPE … RENAME VALUE` je transakciono bezbedno, a `ADD VALUE` se ne sme koristiti u istoj transakciji u kojoj je dodata.
- **Koraci 2–5 putanje razmene se NE odobravaju** — ostaju kao pre (neverifikovanom zabeleženi do verifikacije). Korak 2 traži prepis POEN-a, koji nalog bez potvrde ne sme da inicira (čl. 28 st. 2), pa do njih ne može ni da stigne.
- **Dugme „Evidentiraj zatečene"** (Osnivači) i dalje razrešava **samo potvrđene** članove; nepotvrđene namerno preskače — njih odobrava čovek, jednog po jednog.
- **Akti (4.2.2):** čl. 40a Pravilnika dobio je stav o odobrenju („evidentira se u Protokolu kada Fondacija odobri oglas", uz zadržana dva zatečena okidača) i stav o postupku (razuman rok, provera sadržinskog minimuma i stvarne ponude, obaveštenje sa razlogom, oglas se ne uklanja, ponovno razmatranje povodom dopunjenog oglasa). Dodato i da se **već evidentiran doprinos uklanjanjem oglasa ne poništava** (kod je to i radio). Uz to **Uslovi čl. 16**. Sve na sr + en/ru/hr/hu.
- **Nova radnja obrade NIJE dodata:** odobrenje ne uvodi nijedan nov podatak o ličnosti — Fondacija gleda oglas koji je već javan, a odluku beleži u revizijskom dnevniku koji već postoji (DPIA radnja 15 pokriva putanju doprinosa).
- **Test `pravni-dokumenti.test.ts`** traži rečenicu o odobrenju na sr, en i ru — brana da se akt ne vrati na stanje u kome doprinos naloga bez potvrde nastaje bez ijedne ljudske odluke.
- **Copy:** Pijaca (`neverif_opis`) kaže da oglas ide odmah a doprinos po odobrenju; Novčanik (`zabelezen_opis`, `putanja_zabelezen`) navodi odobrenje kao prvi put. 🟡 **Usput ispravljeno u onboardingu** (`dobrodosli`, zatečene greške): `ekran5_p3` je znao za dva izvora POEN-a umesto tri, a `ekran6_p5` je tvrdio da se postavljanje oglasa otključava potvrdom — što ne važi od 4.1.0.

### Mesto / lokacija = jedno naselje iz šifarnika (2026-08-06)
- **Povod:** nov član je kao lokaciju upisao **„Stanišić (Sombor)"** — i selo i opštinu. Bilo je moguće jer je polje bilo **slobodan tekst**: `LokacijaSearch` je padajućom listom samo *predlagao* naselja, a `onChange` je upisivao svaki otkucani znak. Strogu proveru je imala **samo kartica jemstva** (`validirajKarticu`), nigde drugde. Posledica nije kozmetička: takav zapis ne pogađa nijedno naselje iz šifarnika, pa nema koordinate (udaljenost na Pijaci) i ne poklapa se sa filterom po mestu.
- **Jedno mesto provere:** `src/lib/naselje.ts` — `razresiNaselje()` vraća **kanonski** naziv iz `NASELJA_SRBIJE` ili `null`. Toleriše opširniji zapis istog mesta i zadržava **uži pojam**: „stanisic" → „Stanišić", „Stanišić (Sombor)" → „Stanišić", „Novi Sad, Liman" → „Novi Sad". Dva mesta bez razdvojnika („Stanišić Sombor") **ne prolaze** — čovek mora da izabere jedno. Poruka greške je zajednička (`PORUKA_MESTO_IZ_SPISKA`).
- **Klijent:** `LokacijaSearch` zaključuje unos na `onBlur` — ono što se razreši upisuje se kanonski, ono što se ne razreši dobija crveni okvir i poruku (`common.mesto_iz_spiska`, svih 5 jezika). Otkucani tekst se **ne briše** (čovek vidi šta je uneo i ispravlja).
- **Server (isti uslov, jer klijent nije poslednja reč):** registracija, `PATCH /api/profil/lokacija`, `POST /api/pijaca` + `PATCH /api/pijaca/[id]`, `POST /api/krugovi`. Mesto ostaje **opciono**; kad se navede, upisuje se kanonski naziv.
- **🟡 Zatečene vrednosti se ne zaključavaju.** Na profilu i oglasu prolazi vrednost **identična zatečenoj** — inače bi izmena telefona ili cene padala zbog stare lokacije koju korisnik nije ni pipnuo. Migracija `20260806120000_lokacija_jedno_naselje` skida samo dodatak u zagradi na kraju (`User`, `MarketplaceListing`, `Krug`, `KrugOsnivanjeZahtev`); ostali slobodni unosi se **ne pogađaju automatski** (pogrešno izvučeno mesto gore je od zatečenog teksta), a `koordinateZaMesto` ih razrešava pri čitanju.
- **🟡 Šifarnik ima 881 naselje** (sve 144 opštine + veća sela). Ko živi u selu koje nije na spisku bira najbliže ponuđeno (po pravilu sedište opštine). Ako to počne da smeta, rešenje je **dopuna spiska**, ne vraćanje slobodnog teksta.
- Kod: `src/lib/naselje.ts`, testovi `__tests__/naselje.test.ts`.

### Pravna priroda POEN-a (Pravilnik čl. 12–13)
POEN je **interna obračunska jedinica kojom se evidentira doprinos i drugi oblici učešća u zajedničkom dobru**. Analogija: zapis u matičnoj knjizi — **beleži činjenicu**, ali nije sredstvo van sistema. POEN **nema nosioca**, postoji isključivo kao zapis u Protokolu, izražava se celim brojevima i **ne predstavlja novac, valutu, elektronski novac, platno sredstvo, digitalnu imovinu, finansijski instrument ni hartiju od vrednosti**. Evidentiran doprinos **ne predstavlja potraživanje prema Fondaciji** ni osnov za imovinskopravni zahtev.

### Nasleđivanje (Pravilnik čl. 34, čl. 72)
POEN i ZRNO **nisu imovinsko pravo i ne nasleđuju se**. Pri prestanku statusa zapisi POEN-a se poništavaju uz protivzapis Protokola, ZRNO se otpisuje u raspoloživa (zero-sum očuvan), a podaci se anonimizuju. Postupanje u slučaju smrti bliže se uređuje Uslovima.

### Zaštitni veto Fondacije (Pravilnik čl. 48–50 — preformulisan u 3.7.5)
U Fazi 2, Fondacija može da **odbije izvršenje odluke Gornjeg Kola koja bi ugrozila operativnu i finansijsku održivost Fondacije pre nego što ona dostigne finansijsku samostalnost** — naročito odluke o trošenju dinarskih sredstava (uključujući kolektivne nabavke) koje bi narušile sposobnost Fondacije da pokriva osnovne troškove i održava infrastrukturu (čl. 48, v3.7.5). **Ovo je promena u odnosu na raniji opis** (veto NIJE više vezan za narušavanje četiri principa / zakona / pravnog statusa — to su sada zasebna ograničenja Gornjeg Kola po čl. 50, uz licence). Veto nije diskrecion — mora biti obrazložen pozivanjem na konkretnu pretnju održivosti (čl. 48 st. 2). Gasi se **trajno i jednosmerno** kada sredstva Fondacije dostignu **prag finansijske samostalnosti utvrđen posebnim pravilnikom** (čl. 49); gašenje ne ukida zakonske obaveze UO.
- **Ograničenja Gornjeg Kola (čl. 50):** (1) četiri principa — ne može ukinuti nekonvertibilnost, uvesti imovinsko pravo nad zapisima, učiniti donacije povratnim, ni napustiti minimizaciju podataka; (2) zaštitni veto dok traje + zakonske obaveze UO posle gašenja; (3) licence (AGPL-3.0, CC BY-SA 4.0) se ne mogu zameniti restriktivnijim.
- Kod: `fondacija.ts` (`dohvatiSaldoFondacije`, `azurirajVetoStatus`), model `SistemskiVeto` (singleton), `FondacijaTrosak`, API `/api/admin/fondacija`, javni status.
- ✅ **GAP (a) — REŠEN (norma 3.7.6 + kod usklađen):** `gornje_kolo_3_7_6.md` čl. 19 propisuje **jedan uslov** — veto se gasi kad likvidna dinarska sredstva dostignu **3× operativni trošak prethodnog meseca**. Kod (`fondacija.ts`) usklađen: `dohvatiTrosakPrethodnogMeseca()` (prethodni kalendarski mesec) × 3 daje `pragZaGasenje`; raniji placeholder `prosek × 3` (6 meseci) i `PROSEK_PERIOD_MESECI` uklonjeni; `VetoStatus.prosekMesecnihTroskova → trosakPrethodnogMeseca`. (Ranija 3.7.5 norma 24× rezerva + 12-mes. samoodrživost povučena.)
- 🟡 **GAP (b):** obrazloženje/opis veta u UI/kodu treba uskladiti sa formulacijom 3.7.5 (održivost Fondacije), ako još referencira staru (principi/zakon/pravni status).

### Zajedničko dobro (Pravilnik Glava II, čl. 5–8)
- Softver: **AGPL-3.0** (čl. 7). Sadržaj: **CC BY-SA 4.0** (čl. 7). Licence se ne mogu zameniti restriktivnijim (važi i za Gornje Kolo).
- Doprinosi softveru pod **DCO** (Signed-off-by); doprinosi sadržaju uz prihvatanje licence (čl. 8). Vidi `DCO`, `CONTRIBUTING.md`, `.github/workflows/dco.yml`. Javna stranica `/zajednicko-dobro`.
- **Trajna atribucija** se odnosi na doprinose koda/sadržaja pod licencama Glave II (Uslovi čl. 31) — NE na zapise POEN-a/ZRNA ni graf verifikacija (anonimizuju se pri prestanku, čl. 34).

### Pijaca / razmena (Pravilnik čl. 16, 28, 67 — v3.7.3)
- Za razmenu odgovaraju korisnici prema **obligacionom pravu**, **ne kroz Protokol** — Fondacija/Protokol ne posreduju i ne odgovaraju.
- **Pregled oglasa je javan svim posetiocima** (sadržaj, cena, lokacija, pseudonim oglašivača) — radi pristupačnosti razmene (v3.7.3).
- **Od 4.1.0 (2026-08-09):** postavljanje **PONUDE** otvoreno je i neverifikovanom (čl. 16 st. 5); **POTRAZNJA, pristup kontaktu i POKRETANJE komunikacije** ostaju samo verifikovanima. Oglasi neverifikovanih nose **javnu oznaku** da oglašivač nije verifikovan.
- **Svi korisnici** mogu da razmenjuju dobra/usluge; **iniciranje** ažuriranja evidencije POEN-a u korist drugog je od 4.1.0 samo za verifikovane (čl. 28 st. 2).

### Moderacija sadržaja (Uslovi čl. 20, 21, 22, 24, 25 — implementirana 2026-08-04)
Do ove izmene Fondacija **nije imala nijednu polugu nad tuđim sadržajem** osim suspenzije/isključenja celog naloga — nije postojala admin ruta, tab, status ni prijava.

- **Reaktivna, ne preventivna.** Uslovi čl. 25 st. 1: Fondacija nije obavezna da unapred pregleda sadržaj. Zato **nema filtera reči ni pre-moderacije** — okidač je prijava korisnika ili uočena povreda. Ne uvoditi automatsku filtraciju.
- **🔴 Uklanjanje, NIKAD prepravka.** Akti daju pravo uklanjanja (čl. 21 st. 2, čl. 25 st. 2), ne izmene tuđeg oglasa. Prepravkom bi Fondacija postala koautor sadržaja i izgubila zaštitu iz čl. 25 st. 1. Vlasnik dobija razlog i sam ispravlja i ponovo objavljuje. **Ne dodavati admin edit oglasa.**
- **Razlog je OBAVEZAN** pri svakom uklanjanju (čl. 25 st. 2 traži obaveštenje „uz navođenje razloga") — rute vraćaju 400 bez njega. Ide vlasniku kroz `posaljiNotifikaciju` (zvonce + push + email) i u audit log.
- **Uklanjanje je MEKO i povratno.** Oglas → `ListingStatus.UKLONJEN` + `uklonjenAt/uklonjenRazlog/uklonioId`; poruka Pričaonice → `uklonjenoAt/uklonjenRazlog/uklonioId`. Svi javni upiti već filtriraju `status: "ACTIVE"` (odnosno `uklonjenoAt: null`), pa se sadržaj gubi iz svih prikaza bez dodatnih izmena. `POST .../vrati` poništava grešku i usvojen prigovor.
- **Razlog vidi samo vlasnik.** `GET /api/pijaca/[id]` skida `uklonioId` svima i `uklonjenRazlog` svima osim vlasniku (ranije bi `...listing` spread procurio oba).
- **Prijave korisnika** (`PrijavaOglasa`, enumi `PrijavaRazlog`/`PrijavaOglasaStatus`): otvorene **svim prijavljenima** (i neverifikovanima — pregled oglasa je javan, pa i oni vide sporan sadržaj; prijava nije komunikacija sa oglašivačem). `@@unique([oglasId, prijaviocId])` — jedan korisnik, jedna prijava; ponovljen pokušaj vraća isti odgovor (da li je već prijavio je podatak o tuđoj prijavi). Uklanjanje oglasa automatski zatvara sve otvorene prijave nad njim u `RESENA`.
- **Pričaonica.** Čl. 25 st. 1 obuhvata „svu drugu komunikaciju putem Platforme". Bez ovoga bi jedina poluga nad spornom porukom u globalnoj sobi bila isključenje korisnika (nesrazmerno, čl. 28). Sadržaj poruke se **ne prepisuje u audit log** — log nosi pseudonim i razlog.
- **Eskalacija, ne automatska sankcija.** `PRAG_ZA_UPOZORENJE = 3` uklonjena oglasa istog korisnika → `posaljiAdminAlert` sa predlogom da se razmotri suspenzija (čl. 27) ili isključenje (čl. 28). Sistem sam ne sankcioniše.
- **Prigovor:** `PrigovorNaOdluku.tipOdluke` dobio vrednost **`OGLAS`** (uz VERIFIKACIJA/SUSPENZIJA/PROGRAM/OSTALO) — put žalbe po čl. 30.
- **Rute:** `GET /api/admin/pijaca` (?prikaz=prijavljeni|aktivni|uklonjeni, ?q=), `POST /api/admin/pijaca/[id]/{ukloni,vrati}`, `POST /api/admin/pijaca/prijave/[id]/odbaci`, `POST /api/pijaca/[id]/prijavi`, `DELETE /api/admin/chat/[id]`. Audit: `OGLAS_UKLONJEN`, `OGLAS_VRACEN`, `PRIJAVA_OGLASA_ODBACENA`, `CHAT_PORUKA_UKLONJENA`.
- **Kod:** `src/lib/moderacija.ts` (čiste funkcije + pravni komentari, testovi `__tests__/moderacija.test.ts`), admin tab `src/app/(app)/admin/PijacaTab.tsx` (lenjo učitava svoje podatke), komponenta `PrijaviOglas` u `OglasDetalj.tsx`. Migracija `20260804120000_moderacija_sadrzaja`. Badge: tab Pijaca + sidebar `adminCekanje` broje otvorene prijave.
- **✅ Usput rešeno — suspenzija nije važila za već prijavljene.** `auth.ts` je blokirao samo NOVO prijavljivanje (`authorize`), a JWT refresh (linija ~219) osvežavao je `admin/verified/tipKorisnika/pseudonim` ali **ne i `status`** — suspendovan korisnik je nastavljao da radi i postavlja oglase dok mu cookie ne istekne. Sada refresh poništava `token.id` kad `status !== "ACTIVE"` → čista odjava. Deluje sa zakašnjenjem do `OSVEZI_INTERVAL_MS` (isti kompromis kao za ostala polja).

### Krug (kolektivni oblik — Pravilnik Glava VIII, čl. 55)
- Kolektivni oblik bez pravnog subjektiviteta; ima evidencioni identifikator i zajednički POEN zapis u Protokolu.
- Ovlašćena lica, min. broj članova i ostali parametri uređeni su **posebnim pravilnikom** (čl. 55); vrednosti u kodu („najmanje 5 verifikovanih", 1–3 ovlašćena lica) potiču iz tog pravilnika/koda.
- **Rast kolektivnih oblika** je kanal evidentiranja (čl. 15) — Mehanizam platforme (NE ulazi u dnevni limit, svaki prag se loguje jednom u `KrugBonusLog`):
  - 5 članova (osnivanje): **50.000 POEN** | 10: 100.000 | 20: 200.000 | 50: 500.000 | 100: 1.000.000 | 200: 2.000.000 | 500: 5.000.000
  - Formula: `broj_članova × 10.000 POEN`
- Logika: `src/lib/protokol/krug.ts` → `proveriIEmitujBonusPrag()`.

### Programi Protokola
- **Operativni doprinos (Pravilnik čl. 36; Pravilnik o operativnom doprinosu):** Fondacija/Gornje Kolo/nosioci ZRNA objavljuju **zadatak**; korisnik (indeks ≥ 10%) se prijavljuje i izvršava; izvršenje **verifikuju nosioci ZRNA (Faza 2), odn. UO (Faza 1)** — **NIJE** međusobno potvrđivanje proizvoljnih korisnika. Model: predlagač zadaje **predloženi POEN** (težinski koeficijent), evidentirani POEN = predloženi × min(1, L/P) u okviru dnevnog limita. ✅ Implementirano u `programi.ts` (`raspodelaKoeficijent`, `evidentiraniPoen`); verifikacija nosilaca ZRNA/UO sa proverom sukoba interesa.
- **Socijalni programi:** PODRSKA_MAJKAMA (i primarni staratelji), PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE — uslovi/koeficijenti u programskim pravilnicima.
- Svi programi otvoreni verifikovanim korisnicima (indeks ≥ 10%), nezavisno od Kruga.
- 🔴 **Socijalni program traži indeks ≥ 10% — jednu primljenu potvrdu (od seta 4.3.1, 2026-08-18).** Do tada je čl. 4 Pravilnika o programima podrške tražio **pun indeks (100%)**, pa su prijavu mogli da podnesu samo nalozi sa svih deset potvrda; u kodu je to bio zaseban `MAX_INDEKS` gejt u `POST /api/programi/[type]/prijava`, iznad već postojećeg `imaFunkcionalniPristup`. Taj gejt je uklonjen — prag sada drži jedno mesto. Isto važi i za obustavu: `razlogObustaveProgram` (`programi.ts`, cron `/api/cron/programi-revizija`) gasi ACTIVE prijavu tek kad indeks padne **ispod 10%**, ne ispod 100%; ranije je jedna poništena potvrda gasila program čoveku koji uslov i dalje ispunjava. UI prop se zove `imaPristupProgramima` (bio `imaPunIndeks`).
- **Ostatak čl. 4 je netaknut:** izričit pristanak podnosioca i potvrda SVIH njegovih verifikatora pod punom odgovornošću, bez uvida u unete podatke; Fondacija ne odobrava dok svi ne potvrde. Copy (`programi.nepun_indeks`, `programi.pristanak_tekst`, 5 jezika) više ne pominje „svih deset" — broj verifikatora zavisi od indeksa.
- Dnevni limit (10% opticaja), proporcionalno smanjenje pri prekoračenju.

### Moduli sistema (Pravilnik Glava VIII, čl. 53–59)
- Glava VIII = **Moduli**: kolektivni oblici (**Krug**, **Zadruga** — registrovano pravno lice po Zakonu o zadrugama), socijalni programi, **Modul Deca** (maloletnici, poseban režim < 15, bez ZRNA/glasanja do 18), internacionalizacija.
- Aktiviranje/deaktiviranje: Fondacija u Fazi 1, Gornje Kolo u Fazi 2 (čl. 54).
- 🔴 Zadruga nije implementirana (odluka vlasnika: moduli nisu fokus). **Modul Deca JESTE implementiran** i stoji iza prekidača `MODUL_DECA_AKTIVAN`, uz usvojen Pravilnik o učešću dece (4.3.0) — vidi sekciju „Modul Deca — unapređeni model". Krug postoji; `KrugProjekat` je samo aktivnost Kruga (PRIKUPLJANJE/REDISTRIBUCIJA).

## Konvencije koda
- POEN/ZRNO iznosi: `INTEGER` u bazi, nikad float/decimal.
- Obračunski koeficijent ZRNA: `DECIMAL(20,2)` (u kodu „kurs"; kanonski „obračunski koeficijent").
- RSD iznosi: `DECIMAL(12,2)` — konvertovati sa `Number()` pre slanja klijentu.
- Svaka operacija koja menja stanje računa: obavezno `prisma.$transaction()`.
- `emitujPoen()` kreira sopstvenu internu transakciju — NE sme da se poziva unutar druge `prisma.$transaction()`. Pattern: DB promene u jednoj transakciji → `emitujPoen()` pozivi sekvencijalno van nje.
- Zero-sum provera: automatski unutar `emitujPoen()` u dev modu.
- API rute: srpski termini. Route handleri sa dinamičkim segmentima: `params` je `Promise<{id: string}>`, mora se `await params`.
- `PROTOKOL_WALLET_ID = "banka-singleton"` — interni identifikator Protokol wallet-a (ime „banka" je legacy, korisnički vidljiv tekst je „Protokol").
- Fontovi koji podržavaju srpsku latinicu (č, ć, š, ž, đ).
- Zaokruživanje POEN-a u emisijama: `Math.round()`. ZRNO konverzije: uvek u korist Protokola — `Math.floor()` za iznos koji korisnik DOBIJA, `Math.ceil()` za iznos koji korisnik PLAĆA.

## Struktura foldera
```
src/app/          — Next.js stranice (App Router)
src/app/(app)/    — autentifikovane stranice (pocetna, sistem, novcanik, pijaca, zrno, programi, doprinos-oglasi, krug, poruke, profil, glasanje, donacije, postani-pokrovitelj, verifikacija, nadzor, politika-prihvati, pravilnik-prihvati, admin; `tabla-jemstva` ostaje samo kao stranica-objašnjenje)
src/app/(public)/ — javne stranice (pokrovitelji, kako-funkcionise, o-nama, o-sistemu, cesto-postavljena-pitanja, pravilnik, statut, whitepaper, dpia, radnje-obrade, rizici, zajednicko-dobro, osnivacki-doprinos, privatnost, uslovi)
src/app/pijaca/   — pijaca sa sopstvenim layout-om (javni + auth prikaz)
src/app/uskoro/   — maintenance/„uskoro" gate stranica
src/components/   — React komponente
src/lib/          — pomoćne funkcije, validacije, faq-data
src/lib/protokol/ — logika KOLO Protokola (vidi sekciju Biblioteka)
src/generated/prisma/ — generisani Prisma klijent
prisma/           — šema i migracije
messages/         — i18n prevodi (next-intl)
dokumentacija 3.9/ — kanonska dokumentacija (v3.9.0)
nova dokumentacija/ — prethodni mešani set (3.7.2–3.7.6), istorija; app rendering još čita odavde
docs/             — interne radne beleške (nije normativa)
```

## Implementirane funkcionalnosti

### Autentikacija i korisnici
- Registracija (pseudonim, email, lozinka), login (NextAuth credentials), OAuth tok (`/api/oauth`, `/oauth/dovrsi`), reset lozinke (`/api/zaboravljena-lozinka`, `/api/reset-lozinka`).
- **Verifikacija = dokaz stvarnosti kroz lanac potvrda, bez dokumenata/JMBG-a** (vidi „Dokaz stvarnosti"). Legacy LK/JMBG tok je UKLONJEN.
- Profil: pseudonim, lokacija, telefon, punoIme, opis (UserPodaci), profilna slika sa crop modalom. **Email se NE prikazuje u podešavanjima profila** (uklonjen, commit `4492bcf`; i dalje se koristi pri registraciji/loginu). **Promena pseudonima bez odjave** (commit `ba4c505`). Vidljivost se bira uz svako polje. Javni profil `/profil/[id]` (POEN/ZRNO/rang/oglasi uvek vidljivi) — **adresa je sada pseudonim**, vidi sekciju ispod.

### Reset naloga na dan registracije (2026-08-11)
Alat za probu kako platforma izgleda **novom čoveku**, bez otvaranja novog naloga (svaki nov nalog ostaje u bazi, ulazi u brojače članova i u levak). Admin → **Korisnici** → dugme **„Resetuj nalog"** uz red korisnika.
- **Nalog se NE briše i NE anonimizuje** — za to postoji `DELETE /api/profil` (čl. 34). Ovde nalog ostaje živ, samo mu se skida sve stečeno; ostaju `id`, email, lozinka, pseudonim, `memberHash`, `donatorskiBroj` i `Wallet` red, pa se čovek prijavljuje **istim podacima**.
- **Zero-sum ostaje očuvan** (čl. 14): koliko se skine sa zapisa korisnika, toliko se doda na protivzapis Protokola. `increment: balans` pokriva i **negativno stanje** (nadoknada, čl. 20b) — tada Protokol ide dublje u minus.
- 🔴 **Radnja pogađa i DRUGE naloge.** Padaju sve verifikacije koje nalog dodiruje — i primljene i obavljene — pa drugoj strani POEN ide nazad Protokolu (capped na stanje), indeks se preračunava, slot oslobađa, a zona se preračunava od nule. Isti postupak kao pri prestanku statusa. Nadzornikovih 500 pada samo ako je ishod bio `UREDNO` (čl. 20a). Brišu se i zajednički razgovori.
- **Istorija se BRIŠE, ne poništava** — nalog treba da zatekne prazan izvod, pa se `Transaction` redovi tog wallet-a brišu. Zero-sum se time ne dira: merodavna su stanja zapisa, ne redovi istorije.
- **`createdAt` ide na sada** — inače bi „član od", levak i brojači novih članova i dalje pokazivali stari datum.
- **Pristanci na akte se brišu**, jer ih ni nov nalog nema (registracija ne pravi `PolitikaPrihvatanje`) — po prijavi se prikaže isti ekran sa pristankom koji vidi i tek registrovan čovek.
- **Brane:** samo **SUPERADMIN**; pseudonim se **otkuca** u telu zahteva i mora da se poklopi (klik ne sme da promaši red u spisku); odbija se nalog sa admin ovlašćenjem, **osnivač**, vlasnik pokrovitelja, ugašen nalog, sopstveni nalog i autor predloga koji je već u **registru odluka** (registar je nepromenljiv, čl. 21 Gornjeg Kola). Audit: `NALOG_RESETOVAN_NA_PRVI_DAN`.
- 🟡 **Ista ruta postoji i na produkciji** — nema env prekidača, brana su superadmin + otkucan pseudonim.
- **Vodič se otvara sam pri prvoj prijavi** — reset gasi `User.vodicVidjenAt`, vidi sekciju ispod. Zaostali klijentski trag (`sessionStorage["kolo-welcome"]`, `localStorage`) i dalje živi u pregledaču; za pun utisak prvog dolaska prijaviti se u **incognito** prozoru.
- Kod: `src/lib/reset-korisnika.ts`, ruta `POST /api/admin/korisnici/[id]/reset`, dugme u `AdminKlijent.tsx` (`KorisniciTab`).

### „Prvi put" je zapis u bazi, ne u pregledaču (2026-08-12)
Do ove izmene je vodič `/dobrodosli` znao da je prvi prolaz isključivo po `sessionStorage["kolo-welcome"]`, a taj znak postavlja **samo obrazac za registraciju** (i OAuth `dovrsi`). Tri posledice, sve viđene: ko se registruje pa zatvori prozor vodič više nikad ne dobija sam od sebe; **prijava nikoga ne vodi na vodič** nego na `/dashboard` → `/sistem`; a nalog vraćen na dan registracije nije ni mogao da ga dobije, jer server ne dopire do memorije pregledača.
- Nosilac je **`User.vodicVidjenAt`** (migracija `20260812120000_vodic_vidjen`). 🔴 Migracija **popunjava zatečene naloge tekućim vremenom** — bez toga bi svima pri prvoj sledećoj prijavi iskočio vodič.
- `/api/me` vraća `vodicPotreban` (`vodicVidjenAt == null`); `LoginForm` po njemu bira odredište posle prijave i usput postavlja isti `kolo-welcome` znak, pa gornje dugme glasi „Preskoči", a ne „Zatvori". **`callbackUrl` ima prednost** (ko je došao sa dubokog linka ide tamo gde je pošao), a pad `/api/me` ne zadržava prijavu — tada se ide na uobičajeno odredište.
- **Upis „viđeno" ide pri OTVARANJU vodiča** (`POST /api/profil/vodic` iz `useEffect`), ne na izlasku: ko zatvori prozor na trećem ekranu vodič JE video, a i nijedan izlaz (Preskoči, Zatvori, CTA dugmad) ne može da promakne. Ruta piše `updateMany` sa uslovom `vodicVidjenAt: null`, pa otvaranje iz „?" u zaglavlju ne pomera zabeleženi trenutak.
- **Izlaz iz vodiča na prvom prolazu vodi na `/pijaca`**, ne na `/sistem` (odluka vlasnika 2026-08-12): prvi potez novog čoveka je objava oglasa, a Sistem je pregled brojeva koji tek registrovanom nalogu ništa ne govori. Vodič otvoren iz „?" i dalje se samo zatvara (`router.back()`).
- 🟡 **Gejt nije brana nego usluga** — ništa ne sprečava čoveka da ode bilo gde iz menija. Namerno: prekrivač preko svega je već jednom napravio petlju (vidi „Gejt za pristanak je PREKRIVAČ").

### Pseudonim u adresi profila (2026-08-04)
- Link ka profilu je **`/profil/Marko`** umesto `/profil/<uuid>`. Ruta prima **tri stvari** i sve tri svodi na interni id (`razresiKorisnikaIzAdrese` u `src/lib/pseudonim.ts`): aktuelni pseudonim → interni id (stari linkovi, linkovi zapisani u notifikacijama) → **napušteni pseudonim** (link podeljen pre preimenovanja). Stranica potom prepiše adresu u aktuelnu (`history.replaceState`, bez novog učitavanja).
- **Šta gde ide:** u interfejsu se linkuje preko `profilHref()` (`src/lib/profil-link.ts`) → pseudonim. U sve što se **čuva** (link u notifikaciji, mejlu) ide **interni id** — pseudonim se menja, id ne. Ne obrtati ovo.
- **Pravila za pseudonim** (`validanPseudonim`, `src/lib/validacija.ts`): 3–30 znakova, **samo ASCII slova, brojevi i `_ . -`**, ne dva razdvajača zaredom, ne na krajevima. **Bez razmaka, srpskih slova i ćirilice** — link ostaje čitljiv bez procentnog kodiranja, a gasi se i imitacija homografima (ćirilično „М" izgleda kao latinično „M"). **Velika slova OSTAJU** (odluka vlasnika): pseudonim se prikazuje na svakom ekranu, `nikola` umesto `Nikola` bi pokvario prikaz svuda.
- **Jedinstvenost ide bez obzira na veličinu slova** — kolona `User.pseudonimLower` (`@unique`). Ranije su „Marko" i „marko" mogla biti dva naloga (Postgres `@unique` je case-sensitive), što je bila i rupa za imitaciju i dvosmislenost u adresi. **`pseudonimLower` se upisuje ISKLJUČIVO preko `poljaPseudonima()`/`promeniPseudonim()`** iz `src/lib/pseudonim.ts` — nikad ručno, inače se razmimoiđe sa `pseudonim`. Sve pretrage po ukucanom pseudonimu (transfer, delegat ZRNA, osnivači Kruga, admin donacija, primalac pri gašenju naloga) idu preko `gdePseudonim()`.
- **Napušteni pseudonimi** — tabela `PseudonimIstorija` (`@unique` na `pseudonimLower`). Dve svrhe: stari link ostaje živ, i **ime ne može da preuzme neko drugi** — inače bi ranije podeljen link tiho vodio na DRUGU osobu, što je gore od mrtvog linka. Red se briše kad se korisnik vrati na svoje staro ime i **pri gašenju naloga** (čl. 34 — napušteni pseudonim je trag o nalogu; posledica je da ta imena postaju slobodna, što je ovde ispravno).
- **Rezervisana imena** (`REZERVISANI_PSEUDONIMI`): `oglasi` je pravi sudar — `/profil/oglasi` je stranica „moji oglasi", a u Next.js-u **statička putanja pobeđuje dinamičku**, pa korisnik sa tim pseudonimom ne bi imao profil. Uz to su rezervisani nazivi ruta i `protokol`/`fondacija`/`kolo` (imitacija sistema). **Pri dodavanju nove statičke podrute pod `/profil/` obavezno dopuniti spisak.**
- **Postojeći nalozi se NE preimenuju** — ko već ima razmak ili `č/ć/š/ž/đ` nastavlja da radi (link se kodira, `encodeURIComponent`); novo pravilo važi za registraciju i za svaku izmenu. Migracija `20260804120000_pseudonim_u_adresi` samo popunjava `pseudonimLower` i razrešava eventualne sudare po veličini slova (stariji nalog zadržava ime, mlađi dobija numerički sufiks) — bez toga jedinstveni indeks ne bi mogao da se napravi i **deploy bi pao**, jer se migracije primenjuju u build-u.
- Testovi: `__tests__/pseudonim.test.ts`.
- Suspenzija/isključenje (admin).
- **Brisanje naloga** (`DELETE /api/profil`): anonimizacija ličnih podataka, prenos POEN-a ili povrat Protokolu, otpis ZRNA, `deaktiviranAt`; anonimizacija veza u grafu verifikacija (čl. 34); numerička istorija ostaje pod ne-identifikujućim pseudonimom.
- **Eksport ličnih podataka** (`GET /api/profil/eksport`): JSON. (Bez JMBG-a — više se ne prikuplja.)

### Verzionisanje akata i pristanci
- **Politika:** `PolitikaVerzija` / `PolitikaPrihvatanje`; pri loginu AppShell proverava `/api/politika/prihvati` → `/politika-prihvati`.
- **Pravilnik:** `PravilnikVerzija` / `PravilnikPrihvatanje`; analogno → `/pravilnik-prihvati` (Pravilnik čl. 80).

### Prigovor na odluku
- `PrigovorNaOdluku`: korisnik podnosi (`POST /api/prigovor`), admin odgovara (`PATCH /api/admin/prigovori/[id]`). Tipovi: VERIFIKACIJA, SUSPENZIJA, PROGRAM, OSTALO. Max 3 otvorena; odgovor u 30 dana; notifikacija.

### GDPR cron
- `POST /api/cron/gdpr-cistenje` (1. u mesecu, 02:00): briše poruke kada je jedna strana deaktivirala nalog ILI je lastMessageAt > 24 meseca. (Legacy brisanje JMBG/slika uklonjeno — ti podaci više ne postoje.) Rokovi po Politici čl. 10: tehnički logovi 12 meseci, transakcije/donacije 10 godina, podaci table jemstva — aktivni zahtev 72h od objave (dopuna 3.9.1), pa brisanje iz prikaza.

### Audit log
- `ADMIN_EKSPORT_PODATAKA` pri admin eksportu. (Legacy `PRISTUP_DOKUMENT_VERIFIKACIJA`/`PRISTUP_JMBG_PODACI` događaji više nisu relevantni — bez dokumenata/JMBG-a.)
- **Puna pokrivenost mutirajućih admin ruta (od 2026-07-21):** `logAdminAkcija` (`src/lib/audit.ts`) sada zovu i: programi (odobri/odbij prijavu, toggle), doprinos-oglasi (kreiranje/zatvaranje oglasa, odobri/odbij prijavu i evidenciju — loguje se i kad akciju izvrši nosilac ZRNA, ne samo admin), glasanje (izvršenje odluke, veto, odgovor UO na preporuku), Fondacija troškovi (dodat/obrisan), pokrovitelj doprinos, krugovi (odobri/odbij osnivanje, pristupnica), osnivači (dodat/obrisan), manuelni okidači (noćna emisija, ZRNO noćna + toggle tržišta, osnivački triger). Ranije su se logovale samo akcije nad korisnicima, donacije, blog, politika, pokroviteljstvo potvrda/odbijanje, nadzor i tabla jemstva — zato je audit log u admin panelu delovao „zaglavljen" čim se dnevna aktivnost svede na nepokrivene akcije. Dodato i: `NADZOR_POTVRDJEN` (nadzornik potvrdio verifikaciju); `POKROVITELJ_AZURIRAN` više ne loguje ceo body (kontakt podaci ne idu u log — samo imena izmenjenih polja); dva direktna `auditLog.create` poziva (pokrovitelji) prebačena na `logAdminAkcija`; konvencije dokumentovane u `audit.ts`. **Audit tab + server fetch = samo superadmin** (usklađeno sa `/api/admin/audit-log`).

### POEN (ranije „Novčanik"; ruta i dalje `/novcanik`)
- Prikaz stanja; prepis POEN-a (ažuriranje evidencije 1:1, bez provizije; `/api/transfer`); istorija sa filterima; klikabilni pseudonimi; QR modal (`/m/[hash]`).
- **Zabeležen doprinos** (čl. 40a) stoji kao ZASEBAN red ispod kartice stanja i **nikad se ne sabira** sa stanjem — do okidača to nije zapis POEN-a. Naziv na ekranu je „Zabeležen doprinos", NIKAD „POEN na čekanju" (čl. 12). Vidi ga samo vlasnik naloga (čl. 67).
- **Neverifikovanom se dugme za prepis POEN-a ne prikazuje** (čl. 28 st. 2), uz objašnjenje zašto — inače izgleda kao kvar.
- Vidljivost transakcija gradirana po ulozi (vidi `/api/javno/feed`).

### Poruke (Chat 1-na-1)
- `/poruke` split-panel; polling 5s; badge nepročitanih; Enter/Shift+Enter; mobilni view; „Kontaktiraj prodavca" na oglasu; notifikacija primaocu.

### Pijaca (Marketplace)
- Listinzi; pretraga po kategoriji/lokaciji; sopstveni layout (`src/app/pijaca/`, van `(app)/` grupe — vidi BUG sa badge-om u „Sidebar badge"); detalji na `/pijaca/[id]`.
- **Pregled oglasa javan svim posetiocima** (v3.7.3); **postavljanje/kupovina/kontakt samo verifikovani**.
- **Bez jedinice mere i stanja (količine)** — uklonjeni iz UI i API (commit `ed846fd`); `src/lib/jedinice.ts` obrisan.
- **Slike oglasa na Cloudflare R2 (od 2026-06-15, commit `8132edb`):** upload ide preko `sacuvajNaR2` (`src/lib/skladiste.ts`) kad je R2 konfigurisan; u bazu se upisuje javni URL. **Disk fallback** (`storage/oglasi/...`) za lokalni dev kad R2 nije konfigurisan. Ruta `slika/[listingId]/[idx]` radi 308 redirect na apsolutne https URL-ove (R2/CDN); legacy disk putanje i dalje rade. (Raniji Vercel Blob tok napušten — vidi Tech stack; `@vercel/blob` dep i `BLOB_READ_WRITE_TOKEN` reference ostaju neiskorišćene.)

### Pretraga članova
- `ClanPretraga` (debounce 250ms, keyboard nav). Klikabilni pseudonimi u tabelama.

### Krugovi
- Osnivanje (≥5 verifikovanih); Fondacija proverava formalnu ispravnost; pristupnica; napuštanje (`DELETE /api/krugovi/[id]`); aktivnosti (PRIKUPLJANJE/REDISTRIBUCIJA); bonus pragovi rasta (vidi sekciju Krug).

### Programi Protokola
- Operativni (PED) + socijalni (PODRSKA_MAJKAMA, PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE). Svi otvoreni verifikovanima. Dnevni limit 10% opticaja.

### ZRNO
- Upis/otpis ZRNA (zahtev → noćni cron, ponoć); zaključaj/otključaj (u ponoć istog perioda); delegacija glasova (tranzitivni lanac, krugovi, zakazivanje u ponoć — Pravilnik čl. 47).
- **Obračunski koeficijent** (Pravilnik čl. 23): `Ukupan broj evidentiranih POEN-a / broj ZRNA raspoloživih za upis u Protokolu`. „Nije cena, nije kurs".
- **Ograničenja pri upisu** (Pravilnik čl. 19): min. **20.000** evidentiranih POEN-a (`MINIMUM_POEN_ZA_UPIS_ZRNA`); najviše **1%** evidentiranih POEN-a po periodu.
- `UKUPNO_ZRNA = 1.000.000`. Glasačka moć = `Math.floor(Math.sqrt(aktivno))` (kvadratno, čl. 46).

### Glasanje / Gornje Kolo (usklađeno sa gornje_kolo_3_7_6.md — Faza D)
- Predlozi, glasanje sa ponderisanom (kvadratnom) glasačkom moći (`izracunajGlasove`).
- ✅ **Obavezujući obračunski period (čl. 11):** predlagač NE zadaje rok; glasanje je u narednom periodu (`granicePeriodaGlasanja`); `glasanjePocetak`/`deadline`. Faze: NAJAVLJEN → U_TOKU → ZATVOREN.
- ✅ **Ishod (čl. 8, 9, 13):** prosta većina datih glasova (`utvrdiIshod`; izjednačeno = neusvojeno); `zaZbir`/`protivZbir`/`ishodUsvojen` se beleže pri zatvaranju (`zatvoriIstekleIObjaviIshod`).
- ✅ **Registar odluka (čl. 21):** nepromenljiv, `dohvatiRegistarOdluka`, stranica `/glasanje/registar`.
- ✅ **Faza-2 gating (čl. 3, 24)** + **30-dana ponovno predlaganje (čl. 22)** (`postojiSkoroOdbijen`, `normalizujNaslov`).
- ✅ **Izvršenje + zaštitni veto (čl. 17, 18):** usvojena ODLUKA → `IzvrsenjeStatus` ZA_IZVRSENJE → IZVRSENO ili VETO_OBUSTAVLJENO (obrazloženje obavezno); admin rute `/api/admin/glasanje/[id]/{izvrsi,veto}`.
- ✅ **Dinarske preporuke (čl. 20):** `PredlogVrsta` ODLUKA/DINARSKA_PREPORUKA; usvojena preporuka nije obavezujuća → obrazložen odgovor UO (`UoOdgovor` PRIHVACENO/ODBIJENO, `odgovoriNaPreporuku`, ruta `/api/admin/glasanje/[id]/odgovor`).
- Logika: `src/lib/protokol/glasanje.ts`; testovi `__tests__/protokol/glasanje.test.ts`. Migracije: `20260603160000`/`170000`/`180000`.

### Pokrovitelji (pun tok, v3.7.2; +preduzetnici v3.7.4)
- Pokrovitelj = **pravno lice ili preduzetnik** (ravnopravno, Pravilnik čl. 40, v3.7.4 / donacije 3.7.3), nema login; doprinos se evidentira u zapisu verifikovanog vlasnika pravnog lica, odnosno samog preduzetnika. ✅ UI/ugovor preformulisani da izričito obuhvataju i preduzetnika (PIB ostaje ključ; ugovorni tekst koristi „Donator" + naziv/PIB, neutralan).
- **Tok (Pravilnik o pokroviteljstvu čl. 7–10):** verifikovani korisnik pokreće **prijavu** (`/api/pokroviteljstvo/prijava`) → platforma generiše ugovor → korisnik **potpisuje** (`/[id]/potpisi`) → Fondacija **potvrđuje** (`/api/admin/pokroviteljstvo/prijave/[id]/potvrdi`), što pokreće evidenciju. Doprinos: **novac, roba ili usluge** (`VrstaDonacije` NOVAC/ROBA/USLUGE; roba/usluge po cenovniku).
- Model `PokroviteljPrijava`; admin UI `PokroviteljPrijaveTab.tsx`; korisnički UI `PokroviteljstvoPrijava.tsx`.
- Bonus POEN po fiksnoj **tabeli 7 nivoa** (zbir bonusa za sve novodostignute nivoe; jedna transakcija „Bonus za pokroviteljstvo iznos X"):
  - 10.000→20.000 | 20.000→30.000 | 50.000→80.000 | 100.000→150.000 | 200.000→300.000 | 500.000→800.000 | 1.000.000→1.500.000 POEN
- Javna `/pokrovitelji`, app `/postani-pokrovitelj`. Logika: `pokrovitelj.ts`.

### Donacije
- Donacije fizičkih lica Fondaciji (RSD), admin potvrđuje, evidencija POEN-a.
- **Koeficijentni model (Pravilnik o pokroviteljstvu i donacijama 3.7.3, čl. 4):** kumulativna donacija određuje nivo; koeficijent novodostignutog nivoa primenjuje se na celu novu donaciju; `Math.round()`.
- **11 nivoa, 1,00× (2.000 RSD) → 2,00× (5.000.000 RSD)** — kod (`donacija.ts` `RANG_TABELA`) usklađen sa `donacije_3_7_3.md` čl. 4. ✅
- Jedna transakcija „Bonus za donaciju iznos X". Logika: `donacija.ts` (`nivoZaKumulativ`, `izracunajPoenZaDonaciju`, `evidentirajDonaciju`).

### Osnivački doprinos (implementiran)
- Naknadna evidencija pre-launch rada (Pravilnik čl. 37; Pravilnik o osnivačkom doprinosu).
- **Parametri:** korak 24.000 POEN, ukupno **100 koraka** (v3.9.1; ranije 120 × 20.000), jedan korak po svakom dostignutom pragu od **100.000** ukupnih POEN-a u sistemu, poslednji prag **10.000.000**; gornja granica **2.400.000 POEN**; kanal se trajno zatvara na 100. koraku. Koraci se evidentiraju samo nad **zaključanom** listom osnivača (admin dugme, uslov zbir udela = 1/1). Zaseban kanal — ne ulazi u dnevni limit.
- Kod: `osnivacki.ts` (`ITERATION_LIMIT=100`, `KORAK_IZNOS=24_000`, `GORNJA_GRANICA=2_400_000`, `PRAG_SKOK=100_000`, raspodela među osnivačima largest-remainder metodom). Modeli: `OsnivackiKanal`, `Osnivac`, `OsnivackiKorakLog`, `OsnivackiKorakEmisija`. Admin `OsnivaciTab.tsx`, `/api/admin/osnivaci`, `/api/admin/osnivacki/triger`; javno `/api/javno/osnivacki-doprinos`, stranica `/osnivacki-doprinos`. Noćni triger u cron-u.

### Notifikacije
- Bell ikona, badge, dropdown, toast (polling 15s). `posaljiNotifikaciju()` u `src/lib/notifikacije.ts`.
- **Tri kanala iz jednog poziva (od 2026-08-03):** `posaljiNotifikaciju()` upiše zvonce (`Notifikacija`), pošalje **web push** (`push.ts`, VAPID) i **email** (`email.ts`, Resend). Push i email idu kao `void` — ne blokiraju odgovor i ne bacaju.

### Email korisnicima (Resend)
- **`src/lib/email.ts`** je jedini ulaz: `emailLayout()` (zajednički HTML šablon svih mejlova), `posaljiEmailRaw()` (Resend fetch, vraća bool), `posaljiEmailKorisniku()` (obaveštenja, poštuje opt-out), `bazniUrl()` (allowlist host-ova protiv host-header poisoning-a).
- **Dva režima:**
  - **Sistemski mejl** — reset/postavljanje lozinke (`passwordReset.ts`). Ide **uvek**, ne poštuje opt-out (bez njega nalog nije povratljiv), bez linka za odjavu.
  - **Obaveštenja** — sve ostalo. `posaljiEmailKorisniku()` preskače nalog bez email adrese, ugašen nalog (`deaktiviranAt`) i korisnika sa `emailObavestenja=false`; u podnožje ubacuje link za odjavu.
- **Opt-out:** `User.emailObavestenja` (Boolean, default `true`) + `User.emailOdjavaToken` (nasumičan, generiše se lenjo pri prvom slanju). Migracija `20260803120000_email_obavestenja`. Prekidač u profilu → `PATCH /api/profil/obavestenja`; odjava bez prijave → stranica `/odjava-obavestenja/[token]` → `POST /api/email/odjava`. **Odjava je POST, ne GET** — klijenti za poštu prefetch-uju linkove, pa bi GET odjavio korisnika koji nije kliknuo.
- **Pokrivenost:** email ide uz **svaku** notifikaciju (23 pozivna mesta — verifikacija, donacije, pokroviteljstvo, programi, doprinos-oglasi, krugovi, prigovori, transfer POEN-a, nadzor, tabla jemstva…), plus dva mesta van `posaljiNotifikaciju`:
  - **Nove poruke** (`/api/poruke/[konvId]`) — mejl samo za **prvu nepročitanu** poruku u nizu; dok primalac ne otvori konverzaciju, dalje poruke ne šalju mejl.
  - **Verifikacija QR/token putem** (`/api/verifikacija`) — ranije **nije slala nikakvo obaveštenje** (put sa table jemstva jeste); sada šalje isto obaveštenje kao tabla.
- **Izuzetak `{ email: false }`:** admin notifikacija „Nov korisnik se priključio" — admini isti događaj već dobijaju preko `posaljiAdminAlert` (email + Telegram), inače bi stigao dvaput.
- **Jezik:** mejlovi su na srpskom, kao i tekst zvonca (tekstovi notifikacija se generišu na pozivnim mestima i nisu prevedeni). `User.jezik` se ovde još ne koristi.
- **Admin upozorenja** (`adminAlert.ts`) su zaseban kanal: idu na `ADMIN_EMAIL` + Telegram, nikad korisniku (18 događaja — registracija, prijava verifikacije, ZRNO zahtevi, programi, krugovi, prigovori, bagovi, zero-sum, nadzor).

### Cirkularna sistemska obaveštenja (svim korisnicima)
- **Namena je uska i propisana aktima:** izmene Uslova/Politike (**Uslovi čl. 40, Politika čl. 16** — stupaju na snagu danom donošenja, obaveštenje bez odlaganja; rok od 15 dana ukinut setom 4.3.0), planirani zastoj > 24h (**Uslovi čl. 33**), obaveštenje o suspenziji/isključenju (**Uslovi čl. 27, 28**). Zato ova pošta **NE poštuje `emailObavestenja` opt-out** i mejl **nema link za odjavu** — u podnožju stoji pravni osnov i objašnjenje zašto se ne može isključiti.
- 🔴 **NIJE kanal za vesti/bilten.** Politika čl. 8 (i DPIA, Radnje obrade) deklariše Resend „**isključivo za dostavljanje sistemskih obaveštenja**". Bilten je **druga svrha obrade** → traži dopunu Politike/DPIA/Radnji obrade, **novu verziju Politike sa ponovnom saglasnošću** (`PolitikaVerzija` + nov DB red) i **zaseban pristanak**. Dok se to ne uradi, slanje biltena ovim kanalom je nedozvoljeno.
- **Kod:** model `SistemskoObavestenje` + enum `SistemskoStatus` (NACRT/U_SLANJU/POSLATO/PREKINUTO), migracija `20260803140000_sistemsko_obavestenje`; logika `src/lib/sistemsko-obavestenje.ts`; batch slanje `posaljiEmailBatch()` u `email.ts` (Resend `/emails/batch`, **max 100 po pozivu**, pauza 250ms ≈ 4 zahteva/s zbog limita od 10/s, odn. 2/s na starijim nalozima).
- **`pravniOsnov` je obavezno polje** (npr. „Uslovi čl. 40") — ide u audit log i u podnožje mejla. Bez odredbe iz akata to je bilten, ne sistemsko obaveštenje.
- **Slanje je nastavljivo, bez cron-a:** Vercel plan **odbija subdnevni cron** (vidi Tablu jemstva), pa jedan poziv rute obradi koliko stigne u budžetu od 45s i zapamti `kursorId` (poslednji obrađeni `User.id`, stabilan rastući redosled). Admin ekran sam poziva rutu u petlji dok `zavrseno` ne bude `true`; ponovni poziv **ne šalje istom korisniku dvaput**. Neuspela porcija se ponavlja jednom, pa se odbroji u `neuspesno` i slanje ide dalje.
- **Primaoci:** svi nalozi sa email adresom koji nisu ugašeni (`deaktiviranAt: null`). **Suspendovani su namerno unutra** — obaveštenje im se duguje isto (Uslovi čl. 27, 40).
- **Rute (samo SUPERADMIN** — cirkularna pošta je sistemska poluga): `GET/POST /api/admin/sistemsko-obavestenje`, `POST /api/admin/sistemsko-obavestenje/[id]/{proba,posalji,prekini}`. Admin tab **Obaveštenja** (`ObavestenjaTab.tsx`), vidljiv samo superadminu. Audit: `SISTEMSKO_OBAVESTENJE_{NACRT,POSLATO,PREKINUTO}` (loguje se pokretanje, ne svaki nastavak).
- 🟡 **Pre prvog masovnog slanja:** domen `ekolo.rs` do sada šalje po nekoliko mejlova dnevno. Nagli skok na hiljade poruka obara reputaciju domena i pogađa i mejlove za reset lozinke — slati postepeno ili sa zasebnog poddomena.

### Početna (`/pocetna`)
- Vesti Fondacije (Blog, poslednjih 5) levo + globalna **Pričaonica** desno (50/50; svi prijavljeni vide, **samo verifikovani** pišu, max 1.000 znakova). „Pričaonica" je UI naziv (commit `9140b82`); model ostaje `ChatMessage`.

### Sistem (`/sistem`)
- `/dashboard` redirectuje na `/sistem`. Lični pregled + 4 kartice (Članovi, Transakcije, Krugovi, Opticaj sa zero-sum kvačicom). Klikabilne kartice → filtrirani prikazi.

### Blog (Vesti Fondacije)
- Admin objavljuje (`POST /api/admin/blog`); javna lista `/api/blog`. Model `BlogPost`.

### Pričaonica (globalna soba; UI naziv, ranije „Chat soba")
- Jedna soba; svi prijavljeni vide, samo verifikovani pišu; auto-čišćenje > 30 dana (`/api/cron/chat-cistenje`). Model `ChatMessage` (interni identifikator nepromenjen).

### Doprinos zajedničkom dobru — Oglasi (Operativni program)
- Predlagač objavljuje zadatak; verifikovan korisnik (indeks ≥ 10%) se prijavljuje (`/api/doprinos-oglasi/[id]/prijavi`), evidentira izvršenje (`/api/doprinos-oglasi/[id]/evidencija`).
- ✅ **Usklađeno:** model je **predloženi POEN × min(1, L/P)** (`DoprinosOglas.predlozeniPoen`, `OglasEvidencija.predlozeniPoen`; `programi.ts`), izvršenje verifikuju **nosioci ZRNA (Faza 2) / UO (Faza 1)** uz proveru sukoba interesa (verifikator ≠ izvršilac ≠ predlagač). Satnica (`hourlyRate`/`hoursWorked`) uklonjena. Konsolidovano sa starim PED tokom — `DoprinosEvidencija` i `/programi/ped/evidencija` više ne postoje; „PED" je samo enum/labela koja se rutira kroz doprinos-oglase.
- Modeli: `DoprinosOglas`, `OglasPrijava`, `OglasEvidencija` + enumi `OglasSource`/`OglasStatus`/`OglasPrijavaStatus`/`EvidencijaStatus`.

### Javne pravne stranice (rendruju iz `dokumentacija 3.9/`, EN iz `dokumentacija 3.9/en/`)
- `/pravilnik` → `Pravilnik_3_9_0.md` (+ `/pravilnik/[slug]`: kolo-sistem, hijerarhija, dokaz-stvarnosti, pokroviteljstvo-donacije, operativni, osnivacki, **gornje-kolo**, **programi-podrske** — svi 3.9.0); `/privatnost` → `politika_3_9_1.md`; `/uslovi` → `uslovi_koriscenja_3_9_1.md`; `/statut` → `statut_3_8_0.md`; `/dpia` → `DPIA_3_9_0.md`; `/radnje-obrade` → `radnje_obrade_3_9_0.md`; `/whitepaper` → `whitepaper_3_9_0.md`; `/rizici` → `rizici_3_9_0.md`; `/zajednicko-dobro`, `/osnivacki-doprinos`. Sve otključano za posetioce. **EN:** locale `en` → `dokumentacija 3.9/en/<isti fajl>` (fallback srpski).
- ✅ **Verzijske labele** — prikazuju 3.9.0 (statut 3.8.0); izvor u `messages` (`pravne.<doc>.ver`, `meta_*_desc`, `javneKomponente.dok_tag`).
- **i18n (EN/SEO):** javna površina + chrome + Pijaca prevedeni; jezik se bira cookie-om (dugme Lat/Ћир/EN), **bez `/en/` URL prefiksa** — prefiks bi tražio `app/[locale]/` restrukturaciju (vidi `docs/i18n-engleski-plan.md`, sekcija INCIDENT).

### Admin panel
- Tabs (`AdminKlijent.tsx`): Dashboard, Programi, Evidencija/PED, Pokrovitelji, **Donacije**, **Prigovori**, Korisnici, Pijaca, **Prvi oglasi** (odobravanje doprinosa iz čl. 40a), Finansije (evidencija doprinosa + veto/troškovi), Osnivači, Vesti, **Obaveštenja** (cirkularna sistemska pošta, samo superadmin), Audit, Nadzor (samo superadmin). (Admin simulator UKLONJEN; **Krugovi tab UKLONJEN** — ostala samo mrtva komponenta `KrugoviLista`.)
- **Terminologija „emisija" → „evidencija doprinosa" u Sistem/Admin UI** (commit `120d578`, samo `messages/*.json`) — **izuzev istorije transakcija**, gde tip transakcije ostaje vidljiv; u istoriji „Emisija" → prikaz **„Protokol"** uz boje iznosa (Protokol=plavo, primljeno=zeleno, dato=crveno; commit `8fd6d47`).
- **Badge po tabu = sidebar Admin badge (od 2026-06-13):** svaki tab koji ima stavke „na čekanju" prikazuje broj u zagradi (Programi, PED, Pokrovitelji, Donacije, Prigovori, Pijaca, Prvi oglasi, Nadzor). Sidebar `adminCekanje` (`/api/dnevni-brojevi`) broji ISTE kategorije — **krugovi izbačeni** iz brojanja (nemaju tab). **Donacije** tab: potvrda PENDING `donationRecord` preko `POST /api/admin/donacija {donationId}`. **Prigovori** tab: odgovor preko `PATCH /api/admin/prigovori/[id] {status, odgovor}` (RESENO/ODBIJENO/U_OBRADI). 🟡 Preostali nesklad: Pokrovitelji **tab** broji SVE pokrovitelje, a sidebar broji `pokroviteljPrijava` POTPISANA (na čekanju) — različiti brojevi.

## Uloge u sistemu
- **Korisnik platforme** (neverifikovan/verifikovan), **Verifikovani korisnik** (indeks ≥ 10%), **Nosilac ZRNA**, **Član Kruga** (preko `KrugClanstvo`), **Admin** = UO Fondacije (`admin` kolona = `AdminNivo` ADMIN/SUPERADMIN; tip ostaje `NOSILAC_ZRNA`), **Pokrovitelj** (pravno lice ili preduzetnik, bez naloga).
- ✅ **Jedinstveni statusni model:** legacy `Role` enum (`FIZICKO_LICE`/`CLAN_KRUGA`/`ADMIN`) je **uklonjen** (Faza C). Kanonski `TipKorisnika` ima tri vrednosti (`REGULARNI`/`NOSILAC_ZRNA`/`NEVERIFIKOVAN`); `POCETNI` je naknadno **uklonjen iz enum-a**. **Admin = UO Fondacije** se vodi preko **`admin` kolone (`AdminNivo`)**, NE preko `tipKorisnika` (autorizacija `/admin` panela ide preko `jeAdmin({admin})`; `tipKorisnika === "POCETNI"` ostaje samo kao legacy JWT-fallback u `proxy.ts`, za uklanjanje). **Članstvo u Krugu** se vodi isključivo preko `KrugClanstvo` (nema više `CLAN_KRUGA` na korisniku). Migracije `20260603150000_drop_role_enum` (drop legacy `Role`).

## Sidebar linkovi (grupisana navigacija od 2026-06-13/16, `src/components/Sidebar.tsx`)
Navigacija je grupisana sa naslovima grupa i jednom **padajućom (collapsible)** grupom; više nije ravan spisak.
- **Nov član:** gornja grupa (Početna, Sistem, **POEN**, Pijaca) + grupa **„Poverenje"** (**Potvrde**).
- **Redovan član:** gornja grupa (Početna, **POEN**, Pijaca) → grupa **„Poverenje"** (**Potvrde**) → grupa Donacije/**Pokrovitelj** → padajuća grupa **„Zajedničko dobro"** (Sistem, ZRNO, Doprinos, Programi, + Nadzor ako je nadzornik).
- Stavka se od 2026-08-12 zove **„Potvrde"** (`nav.verifikacija`), a poziv za nove **„Zamoli za potvrdu →"** (`nav.verifikuj_nalog`); **ruta ostaje `/verifikacija`** — stari linkovi iz notifikacija i mejlova moraju da rade.
- **Stavka „Tabla jemstva" i njen badge UKLONJENI (2026-08-09)** — tabla je ukinuta; put do potvrde vodi kroz Pijacu, koja je već u gornjoj grupi.
- **Admin (dodatno):** Admin.
- „Postani pokrovitelj" → label **„Pokrovitelj"** (commit `80fe35b`). Jezik switcher (Lat/Ћир/EN) je u header-u, ne u sidebar-u.
- Badge brojevi sa `GET /api/dnevni-brojevi`. Ostale stranice (Poruke, Krug, Glasanje, Profil) dostupne preko drugih ulaznih tačaka.

### Sidebar badge — dve vrste (od 2026-06-11)
- **„Viđeno" badge-evi (Novčanik, Pijaca):** broje stavke nastale POSLE poslednjeg otvaranja taba. Kolone `User.vidjenoNovcanikAt` / `vidjenoPijacaAt` (migracija `20260611120000_sidebar_vidjeno`); `GET /api/dnevni-brojevi` broji `createdAt > viđeno` (fallback ponoć ako tab nije otvaran); `POST /api/dnevni-brojevi/vidjeno {sekcija}` postavi „viđeno = sad" → badge na 0. Nulovanje okida `AppShell` `useEffect` na promenu `pathname` (`/novcanik` | `/pijaca`): optimističko nulovanje + POST + re-fetch.
- **Akcioni badge-evi (Admin, Nadzor):** broje otvorene stavke koje traže radnju (stavke na čekanju za admina, verifikacije za nadzor). **Namerno se NE nuluju na otvaranje** — padaju tek kad se sama stavka reši. Ako korisnik očekuje da nestanu „kad se očitaju", to je očekivano ponašanje, nije bug.
- 🔴 **BUG (Pijaca badge se ne nuluje):** ruta `/pijaca` (index + `[id]`) je u `src/app/pijaca/` sa **sopstvenim** `layout.tsx` koji renderuje `Sidebar` direktno — **van `AppShell`-a**. Zato se „viđeno" `useEffect` (koji je u `AppShell`) NIKAD ne okine pri ulasku u Pijacu → `vidjenoPijacaAt` se ne pomera → badge ostaje. (Novčanik je u `(app)/` grupi pa radi.) Fix: okinuti `POST /api/dnevni-brojevi/vidjeno {sekcija:"pijaca"}` iz klijentske komponente na `/pijaca` (npr. `useEffect` u `PijacaKlijent`), ili dignuti „viđeno" logiku u `Sidebar` (deljen u oba layout-a).

## API endpointi (izbor)

### Korisnici / profil
`POST /api/registracija` · `GET /api/provjeri-pseudonim` · `PATCH /api/profil/{pseudonim,lozinka,lokacija,podaci,obavestenja}` · `POST /api/email/odjava` · `GET /api/profil/balans` · `GET /api/profil/eksport` · `DELETE /api/profil` · `GET /api/korisnici/pretraga` · `GET /api/m/[hash]/pseudonim` · OAuth (`/api/oauth/*`, `/api/zaboravljena-lozinka`, `/api/reset-lozinka`)

### Novčanik / transfer
`POST /api/transfer` · `GET /api/novcanik/transakcije`

### Verifikacija / nadzor
`POST /api/verifikacija` · `GET /api/verifikacija/moj-indeks` · `POST /api/verifikacija/token` · `GET /api/verifikacija/lanac/[korisnikId]` · `/api/nadzor/*` · `POST /api/admin/korisnici/[id]/lazni-verifikator`
(Rute `/api/tabla-jemstva/**`, `/api/admin/tabla-jemstva/**` i cron `tabla-jemstva-istek` su obrisane 2026-08-09.)

### Pijaca / poruke / chat / blog
`/api/pijaca` (+ `/[id]`, `/[id]/kupi`, `/slika/...`) · `/api/poruke` (+ `/[konvId]`) · `GET/POST /api/chat` + `/api/cron/chat-cistenje` · `GET /api/blog` + `/api/admin/blog/*`

### ZRNO
`GET /api/zrno` · `POST /api/zrno/upis` · `POST /api/zrno/otpis` · `POST /api/zrno/{zakljucaj,otkljucaj,delegiraj}` · `POST /api/admin/zrno/nocna`

### Programi / doprinos-oglasi
`GET /api/programi` · `POST /api/programi/[type]/prijava` · `POST /api/programi/ped/evidencija` · `/api/admin/programi/*` · `/api/doprinos-oglasi/*` (+ admin odobravanje/odbijanje prijava i evidencije)

### Krugovi / glasanje
`/api/krugovi/*` (+ admin) · `/api/glasanje/*`

### Pokrovitelji / donacije / osnivački
`GET /api/pokrovitelji` · `/api/pokroviteljstvo/prijava` (+ `/[id]/potpisi`) · `/api/admin/pokroviteljstvo/prijave/*` (potvrdi/odbij) · `/api/admin/pokrovitelji/*` · `POST/GET /api/donacije` · `/api/admin/donacija` · `/api/admin/osnivaci`, `/api/admin/osnivacki/triger`, `/api/javno/osnivacki-doprinos`

### Fondacija / veto / sistem
`GET /api/admin/prvi-oglasi` + `POST /api/admin/prvi-oglasi/[id]/{odobri,odbij}` (čl. 40a) · `/api/admin/fondacija` (saldo, troškovi, veto) · `GET /api/javno/statistike` · `GET /api/javno/feed` (gradiran: gost→agregat, neverifikovan→maskirano, verifikovan→pseudonimi) · `/api/notifikacije` · `/api/dnevni-brojevi` · `/api/admin/{dashboard,transakcije,audit-log,zero-sum,emisija/nocna}` · `/api/cron/{nocna-emisija,zero-sum,gdpr-cistenje}` · `/api/prigovor` + `/api/admin/prigovori/[id]`

## Biblioteka funkcija (`src/lib/protokol/`)
- `emisija.ts` — `emitujPoen()`: emisija + zero-sum validacija
- `programi.ts` — `izracunajDnevniIznos()`, `izvrsiNocnuEmisiju()`, `labelPrograma()`
- `pokrovitelj.ts` — pun tok prijave, fiksna tabela 7 nivoa, `bonusZaNivo()`, `izracunajNivo()`
- `donacija.ts` — `nivoZaKumulativ()`, `izracunajPoenZaDonaciju()`, `evidentirajDonaciju()` (11 nivoa, maks 2,00× ✅)
- `krug.ts` — bonus rasta Kruga (ne ulazi u dnevni limit)
- `zrno.ts` — `UKUPNO_ZRNA`, `MINIMUM_POEN_ZA_UPIS_ZRNA`, obračunski koeficijent (`trendsKurs`/`poslednjiKurs`), noćna obrada, `glasackaMoc()`
- `osnivacki.ts` — osnivački kanal (100 × 24.000, granica 2.4M, raspodela; korak na svakih 100.000 opticaja, automatski i uzastopno pri preskočenim pragovima)
- `fondacija.ts` — saldo Fondacije + zaštitni veto (🟡 prag 3× hardkodovan)
- `faza-sistema.ts` — Faza 1/2, auto prelaz na 1.000.000 POEN
- `dokaz-stvarnosti.ts`, `verifikacija-service.ts`, `nadzor-service.ts`, `lazna-verifikacija.ts` — dokaz stvarnosti i nadzor
- `doprinos-sadrzaju.ts` — osmi kanal (čl. 40a); čista pravila u `src/lib/doprinos-pravila.ts`
- `pristup.ts` — provere pristupa po statusu/indeksu
- `src/lib/notifikacije.ts` — `posaljiNotifikaciju()`; `src/lib/faq-data.ts` — `FAQ_SEKCIJE`

## Testovi
- **Vitest** (`npm test`, `npm run test:watch`). Lokacija: `__tests__/protokol/`.
- Pokriva: `donacija`, `osnivacki`, `delegiranje`, `faza-a-konstante`, `pokrovitelj`, `programi`, `emisija`. Config `vitest.config.ts` (`@/` → `src/`).

## Reference
- `dokumentacija 3.9/` — kanonski set v3.9.0 (vidi tabelu na vrhu). `nova dokumentacija/` = prethodni mešani set (istorija; app rendering još odatle)
- `docs/` — interne radne beleške (FAQ analiza/triaža, glosar, model vidljivosti, pregled funkcija) — nije normativa
- Stari dokumenti (v2.x, v3.7.0) — obrisani iz repo-a

## Nezavršeni TODO / preostali GAP-ovi (mapirano na v3.7.5/3.7.4/3.7.3/3.7.2)

### Stvarni GAP-ovi (dokumentacija propisuje, kod radi drugačije)
1. ✅ **REŠENO — Tabela donacija** (`donacija.ts` `RANG_TABELA`): 11 nivoa, 1,00×→2,00×, usklađeno sa `donacije_3_7_3.md` čl. 4 i testovima.
2. ✅ **REŠENO — Veto prag (NORMA 3.7.6, 2026-06-03).** `gornje_kolo_3_7_6.md` čl. 19: jedan uslov — **3× operativni trošak prethodnog meseca**. Kod `fondacija.ts` usklađen: `dohvatiTrosakPrethodnogMeseca()` × 3 daje `pragZaGasenje`; raniji placeholder `prosek × 3` (6 meseci) uklonjen. (Stara 3.7.5 norma 24× rezerva + 12-mes. samoodrživost povučena.)
3. ✅ **REŠENO — Operativni doprinos:** model **predloženi POEN × min(1, L/P)** (`programi.ts`) + verifikacija nosilaca ZRNA/UO sa proverom sukoba interesa; satnica uklonjena.
4. ✅ **REŠENO — Konsolidacija PED + doprinos-oglasi** u jedan tok. `DoprinosEvidencija` i `/programi/ped/evidencija` više ne postoje; orphan i18n ključ `ped_link` uklonjen iz `messages/*.json`.
5. ✅ **REŠENO — „kurs" u srpskom UI** → „Koeficijent"/„koeficijent evidencije" (`messages/sr.json`). Interni identifikatori i en/hu prevodi zadržani.
6. ✅ **REŠENO — Verzijske labele** na javnim stranicama. Glavne pravne stranice tačne; `pravilnik/[slug]/page.tsx` sada izvodi verziju iz `verzija` polja po pravilniku (ne hardkod „3.7.5"). Preostali „v3.7.0" su bili samo interni komentari — ažurirani.
7. ✅ **REŠENO — Dual `Role` / `TipKorisnika`.** Legacy `Role` enum uklonjen (Faza C: C1 admin→`POCETNI`, C2 članstvo→`KrugClanstvo`, C3 drop kolone/enuma). Jedinstveni model je `TipKorisnika`. **Operativno:** na produkciji obavezno `npx prisma migrate deploy` (backfill prebacuje postojeće admine na POCETNI).

### Mehanizmi delegirani posebnim pravilnicima / nisu fokus
8. **Modul Zadruga (čl. 56)** — nije implementiran (odluka vlasnika). Krug postoji. **Modul Deca (čl. 58) JESTE implementiran** iza prekidača; **Pravilnik o učešću dece je usvojen setom 4.3.0** i DPIA je ažuriran, pa je paljenje od sada odluka o puštanju u rad.
9. **Raspoređivanje dinarskih sredstava (čl. 51)** — višak iznad troškova u programe; Faza 2 preporuke Gornjeg Kola UO. Postoji `FondacijaTrosak`; automatizacija raspodele nije.
10. **Unutrašnje odlučivanje Kruga / ovlašćena lica (čl. 55)** — poseban pravilnik o krugovima; `KrugClanstvo.isAdmin` postoji bez formalnog ograničenja broja.
11. **Rešavanje sporova (čl. 79)** — sud (obligaciono pravo); interni mehanizmi opcioni. Postoji samo `PrigovorNaOdluku`.
12. **Suspenzija — mehanika u Uslovima (čl. 33)** — `suspendedAt` postoji; rok/auto-ukidanje delegirani Uslovima.
13. ✅ **REŠENO — Reverifikacija socijalnih programa.** `nextReverifikacija` se postavlja pri odobravanju (POSEBNA_BRIGA 365d / SKOLOVANJE 183d); cron `/api/cron/programi-revizija` (vercel.json, 23:00) deaktivira ACTIVE prijavu kad prođe rok ili REGULARNI indeks padne ispod 100% → INACTIVE + notifikacija; reapply dozvoljen iz INACTIVE. Čiste funkcije `danaDoReverifikacije`/`razlogObustaveProgram` u `programi.ts` (testirano).
14. **Pseudonim — limit izmene** — `pseudonimChangedAt` postoji; limit nije propisan Pravilnikom (Uslovi).
15. **CC BY-SA označavanje sadržaja na nivou pojedinačnog dela** — bez formalnog mehanizma.
16. **Trajna atribucija doprinosa koda/sadržaja** — kad bude modul za doprinose, `DELETE /api/profil` NE sme brisati atribuciju (Uslovi čl. 31).

### Operativno
17. ✅ **Migracije se primenjuju AUTOMATSKI pri svakom deploy-u** (vidi „Migracije se primenjuju AUTOMATSKI" u Deploy sekciji) — `vercel.json buildCommand` pokreće `prisma migrate deploy` kad postoji `DATABASE_URL`. Ručni `npx prisma migrate deploy` više nije potreban (ostaje kao fallback za lokalno/vanredne situacije).
18. **Git okruženje:** uvek `git fetch origin main` pre poređenja (lokalni `main` u kontejneru ume da bude zastareo).

### Procena pokrivenosti
**Pravilnik v3.7.5 je implementiran ~90%.** Osnovni mehanizmi + dokaz stvarnosti, osnivački doprinos, zaštitni veto, verzionisanje Pravilnika, tabla jemstva, pun tok pokroviteljstva, gradirana vidljivost, faze sistema — pokriveni. Preostali GAP-ovi su parametarski (veto prag — primena u kodu je odluka Fondacije) i moduli koji se svesno odlažu (Zadruga, Modul Deca); terminološki/labele/preduzetnik/operativni model/donacije rešeni.
