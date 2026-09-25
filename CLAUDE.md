# KOLO Platforma — v4.0.0

**Šta je gde.** Ovaj fajl nosi samo ono što vezuje dalji rad: pravila, zabrane i brane.
Obrazloženja, nalazi i odbačene varijante žive u `docs/` i **otvaraju se pre rada na toj temi** —
sažetak ovde ne nosi razloge, a razlozi su ono što drži odbranu.

| Fajl | Šta je unutra |
|---|---|
| **`CLAUDE.md`** (ovaj) | pravila koja važe uvek, zabranjene teme, deploy, pravilo bumpovanja, mehanika sistema |
| `docs/sprovodjenje-rizika-2026-09.md` | pun zapis odluka po rizicima R-01…R-20 |
| `docs/istorija-implementacija.md` | pun zapis izmena 08–09/2026 |
| `docs/registar-rizika-regulatori-2026-09.md` | sam registar sa ocenama (22 rizika) |
| `docs/istorija-bumpova.md` | hronologija verzija akata |
| `dokumentacija 4.1/` | kanonski set akata — **jedini normativni izvor** |

🔴 **Kad se nešto menja, menja se na jednom mestu.** Ako se sažetak ovde raziđe sa punim zapisom
u `docs/`, merodavan je akt u `dokumentacija 4.1/`, pa `CLAUDE.md`, pa `docs/`.

## ⚠️ Deploy i grane (OBAVEZNO poštovati)
Vercel **Production Branch = `production`**. Podela okruženja:
- **`main`** → TEST deploy (test Neon baza, pun seed). Gleda se na **`kolo-peach.vercel.app`** (kratak alias, vidi topologiju ispod) ili na auto URL `kolo-git-main-alvaserbia-progs-projects.vercel.app`. Ovde ide sav svakodnevni rad.
- **`production`** → UŽIVO na **ekolo.rs** (prod Neon baza, `seed-prod.ts`). Samo namerna „objava".

**Pravila za Claude:**
- Podrazumevano radi i guraj na **`main`** (= test). NIKAD ne guraj direktno na `production` osim kad vlasnik eksplicitno kaže „objavi na ekolo.rs" / „pošalji na produkciju".
- Vlasnik ne barata gitom. Mapiranje komandi:
  - „pošalji na test" → commit + push na `main`.
  - „objavi na ekolo.rs" → **prvo `npm run prevodi:objava`** (vidi „Tekst se menja SAMO na srpskom" ispod), pa merge `main` → `production` + push na `production`.
- Pre „objave" proveri da je `main` čist i da test izgleda ispravno.
- **Posle puša NE proveravati Vercel buildove** (nema `list_deployments`/`get_deployment` u petlji, nema čekanja da build pređe u READY). Push je kraj posla — javi šta je gurnuto i na koju granu, i tu stani. Vlasnik sam gleda sajt; ako nešto pukne, reći će. Buildove proveravati **samo kad vlasnik izričito pita** („da li je prošlo", „puca li build") ili kad je promena takva da build realno može da padne (migracija, izmena `vercel.json`/`package.json`, nova env varijabla).
- **Napomena o git okruženju:** u remote kontejneru lokalni `main` može biti zastareo (klon u trenutku startovanja). Pre poređenja uvek `git fetch origin main` i poredi sa **`origin/main`**, ne sa lokalnim `main`.
- 🔴 **NIKAD ne povlačiti tuđe izmene na `main` ni na `production` — guraju se ISKLJUČIVO sopstvene izmene iz tekuće sesije.** Konkretno: ne merge-ovati, ne cherry-pick-ovati i ne rebase-ovati tuđe grane, PR-ove, forkove ni „zalutale" commit-e u `main`/`production`, čak i kad deluju gotovo ili kad se pominju u zadatku. Ako se u toku rada naiđe na tuđe commit-e (npr. na grani sa koje se kreće, ili u konfliktu), prijaviti vlasniku i **sačekati izričito odobrenje** — ne uvlačiti ih samoinicijativno. Isto važi i pri rešavanju konflikata: uzeti svoju izmenu i tekuće stanje grane, ne uvlačiti dodatni tuđi rad usput. Merge `main` → `production` pri „objavi" je jedini dozvoljeni merge, i on prenosi samo ono što je već ranije gurnuto na `main` kroz ovo pravilo.


### 🔴 Tekst se menja SAMO na srpskom; prevodi idu pre objave (2026-09-13)

Odluka vlasnika. **Tokom rada se menja isključivo srpski original** — `messages/sr.json`
i `src/lib/faq-data.ts`. Prevodi na **en/ru/hr/hu** rade se **na kraju, pre merge-a
`main` → `production`**, u jednom prolazu.

🔴 **AKTI SU IZUZETI iz ovog pravila** (odluka vlasnika, 2026-09-13). Akt u
`dokumentacija 4.1/` se **ne menja usput**: menja se namernim potezom (po pravilu uz
analizu rizika), a **bump ionako dodiruje pet imena fajlova, mapu u
`pravilnik/[slug]`, verzijske labele u `messages` i spisak `AKTI` u testu** — prevod
je tu najmanji deo istog poteza, ne zaseban posao. Akt i njegovi prevodi idu
**zajedno, kao do sada**.

🔴 **Razlog nije samo obim nego kvar koji se već desio.** Da srpski akt dobije novu
šifru a prevod ostane na staroj, `ucitajPravniDokument` bi servirao **srpski tekst**
engleskom čitaocu, a upravo tako su hrvatski i mađarski posetioci do 4.1.0 mesecima
dobijali srpske akte. Uz to je „jedan događaj objave = jedna šifra" pravilo koje je
već tri puta branjeno (4.4.4 umesto 4.4.3, 4.4.7 umesto 4.4.6, 4.5.5 umesto 4.5.4):
**šifra u imenu fajla JESTE objava, ne radna oznaka.**

🟢 **Fallback VIŠE NIJE NEM (2026-09-13).** Do tada je `ucitajPravniDokument` pri
nedostajućem prevodu vraćao srpski original **bez ijedne reči o tome** — ranije je
ovde pisalo da je to namerno. Sada srpski original ide uz **napomenu na jeziku
čitaoca** („Translation not yet published" / „Перевод ещё не опубликован" /
„Prijevod još nije objavljen" / „A fordítás még nem jelent meg", blockquote na vrhu)
i uz `console.warn`. 🔴 Fallback se **ne ukida** — pad bi značio 500 na javnoj pravnoj
stranici, što je za čitaoca gore od obeleženog originala. 🔴 Napomena **ne sme** da
sadrži zvaničan disklejmer prevoda („Neslužbeni prijevod", „Nem hivatalos fordítás"):
po njemu test razlikuje serviran prevod od fallbacka.

🟢 **Branu za akte nosi `__tests__/pravni-dokumenti.test.ts`**, i ona je dvostruka:
`fs.access` traži da svaki akt **fizički postoji** na svih pet jezika, pa polovičan
bump pada odmah (apsolutna provera, jača od duga), a blok „fallback kad prevod akta
nedostaje" traži da se fallback **vidi** ako se ipak desi. Prva brana sprečava,
druga razotkriva. `npm run prevodi` meri samo razliku prema produkciji — zato se akti
tamo **ne mere uopšte** (drugo bi bilo dupliranje sa slabijom proverom).

**Mapiranje komandi se time proširuje:**
- „pošalji na test" → commit + push na `main`. Prevodi **copy-ja** ne moraju biti
  urađeni; **prevodi akata moraju**, jer se objavljuju zajedno sa bumpom.
- „objavi na ekolo.rs" → **prvo `npm run prevodi:objava`**, pa tek onda merge `main` → `production`.
  🔴 Ako ta komanda padne, objava **staje** dok se prevodi ne urade. To je jedina tačka
  u kojoj se dug naplaćuje.

**Alat:** `scripts/prevodi.mjs`, tri komande:

| Komanda | Šta radi |
|---|---|
| `npm run prevodi` | izveštaj o dugu, **uvek prolazi** — svakodnevni rad |
| `npm run prevodi:objava` | isto, ali **pada** ako dug postoji — pred objavu |
| `npm run prevodi:potvrdi` | upisuje stavke kojima prevod NE treba menjati |

🔴 **Meri se RAZLIKA prema `origin/production`, ne apsolutno stanje.** Ključ je nov,
ili je srpska vrednost izmenjena a prevod ostao identičan onome na produkciji. Bez
diferencijalnog merenja bi zatečeni dug iz ranijih sesija zauvek obarao svaku objavu,
pa bi se brana prvog dana isključila. Zato je pre poređenja obavezan
`git fetch origin production` (u remote kontejneru grana ume da fali).

🔴 **Paritet ključeva NE hvata zastareo prevod** i to je razlog zašto ova provera
postoji pored `npm run i18n:check`. Ključ postoji u svih pet fajlova, vrednost je stara —
prevod tada **govori nešto drugo nego original**, a nijedan zatečeni test to ne vidi.
Zatečeno stanje pri uvođenju brane: **204 ključa** u `en`, `ru` i `hu` nose tekst od pre
izmena na `main` (npr. `novcanik.qr_opis` — srpski i hrvatski su dobili izmenu, ostala
tri jezika nisu). Dve provere, dve svrhe — **ne spajati ih**:
- `npm run i18n:check` — apsolutno stanje (paritet ključeva, vrednosti ostale na
  engleskom, `admin` namespace koji se **ne prevodi**).
- `npm run prevodi` — dug tekućeg rada prema produkciji.

**Kad izmena srpskog ne traži izmenu prevoda** (ispravljena interpunkcija, reč koja se
ionako ne prevodi): pregledati spisak pa `npm run prevodi:potvrdi`. Upisuje se **heš
srpske vrednosti** u `scripts/prevodi-provereno.json`, pa se stavka **sama vraća u dug**
čim se srpski ponovo promeni. 🔴 Ne pokretati tu komandu da bi spisak bio prazan — time
se brana gasi bez traga da je išta pregledano.

🟡 **Brana NIJE u Vercel build-u, i to namerno.** Vercel radi plitak klon bez svih grana,
pa `git show origin/production:…` tamo ne radi; uz to bi provera na `production` grani
poredila granu sa samom sobom. Mesto brane je **sesija, pre merge-a** — `--auto` mod
postoji u skripti ako se ikad uveže u build, ali se za sada ne koristi.

🟡 **Šta brana NE pokriva:** akte (izuzeti su, vidi gore) i izmene teksta koje žive
direktno u komponentama (hardkodovan copy van `messages/`). Ako se takav tekst pojavi,
ide u `messages/` — to je pravilo koje je i inače na snazi.


#### 🔴 `admin` namespace se NE prevodi — i više ne postoji u prevodima (2026-09-13)

Odluka vlasnika. Namespace `admin` (**450 ključeva, 13,4% fajla**) živi **isključivo
u `messages/sr.json`**; `src/i18n/request.ts` ga dodaje svakom drugom jeziku pri
učitavanju poruka (`{ ...messages, admin: sr.admin }`).

🔴 **Razlog nije ušteda nego tačnost.** Admin panel je alat **operative Fondacije**
(ranije je ovde stajalo „alat Upravnog odbora“ — ispravljeno 2026-09-23, vidi „Ko je
ko“). 🔴 **Razlog brane se time NE menja:** panel i dalje barata institutima iz akata,
pa mu terminologija preslikava akte, a **merodavan je srpski original** (to sami
prevodi akata kažu u disklejmeru). Uz to akti namerno razdvajaju institute koje
prevod lako slepi u jednu reč — **prigovor** (Uslovi čl. 37a), **prijava razmene**,
**prijava oglasa**, **nadzorni predmet** — a na tri mesta u ovom fajlu stoji „tri
različite odluke, tri taba, ne spajati ih". Loš prevod tu ne kvari stil nego vodi ka
odluci po pogrešnom institutu.

🔴 **Zatečeno stanje koje je ovo pokrenulo: namespace je bio NAPOLA preveden** —
177 od 450 ključeva u `en`/`ru`/`hu` i 80 u `hr`. Videlo se u istom redu tabova:
*„Overview, Members, … Razmene, Nabavke"*. Stariji ekrani su prevedeni, a svaki nov
tab (Razmene 08., Nabavke 09. mesec) ulazio je na srpskom jer ga niko ne prevodi.
Dakle pravilo se faktički sprovodilo samo, samo neuredno.

🔴 **Zašto IZOSTAVLJANJE, a ne prepisivanje srpske vrednosti u četiri fajla.**
Prepisana vrednost živi **pet puta** i razilazi se pri svakoj sledećoj zameni — isti
kvar koji je ovde već dvaput zapisan („ne prepisivati tabele u ekrane", „ne raditi
blanket zamenu verzija"). Izostavljena vrednost **fizički ne može da odluta**:
pravilo prestaje da bude provera koju neko mora da pokrene i postaje svojstvo
strukture. Usput su prevodi manji za ~120 KB ukupno.

🟡 **`sr-Cyrl` ovde ne ulazi** — izvor mu je `sr`, pa admin blok već ima i prolazi
kroz `lat2cyrDeep` zajedno sa ostatkom. Ćirilica nije prevod nego pismo.

🟡 **Poznata posledica:** ko prebaci jezik na engleski dobija srpski admin panel
usred prevedenog sajta. To je **i pre ovoga bio slučaj**, samo unutar jednog reda
tabova; sada je bar dosledno i predvidivo.

**Brana je dvostruka** (`__tests__/admin-namespace.test.ts`): da prevod ne nastane
(nijedan od četiri fajla ne sme da ima ključ `admin`) **i da merge ne nestane**
(`request.ts` mora da ga dodaje). Bez druge polovine bi brisanje jedne linije
ostavilo admin panel bez teksta na četiri jezika, a build bi prošao.
`npm run i18n:check` izuzima namespace iz pariteta (`NEPREVEDENI_NS`), a
`npm run prevodi` iz duga — inače bi svaka izmena admin panela tražila prevod koji
po pravilu ne sme da postoji, pa bi objava stajala na poslu koji se ne radi.

🟡 **Usput:** `npm run i18n:check` **prvi put prolazi čist**. Tri preostale prijave
bile su lažne (`landing.pijaca_poen` — oznaka „1.500 P" umesto „1.500 POEN", i dva
naslova gde je razlika samo separator `·` naspram `—`) i upisane su u
`DOZVOLJENO_ISTO_KAO_EN`.

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

### 🔴 PALA migracija zaustavlja SVE naredne buildove — P3009 (2026-09-18)

Drugo lice istog kvara, i gore od njega. Ako migracija **padne** usred izvršavanja,
red u `_prisma_migrations` ostaje u stanju FAILED, a `prisma migrate deploy` od tog
trenutka odbija **svaku** narednu migraciju sa **P3009**, bez obzira na to što sa njima
nema nikakve veze. Build pada pre `npm run build`, dakle **ništa se ne objavljuje**.

Desilo se 15.09.2026: `20260915120000_oglas_bez_kupovine` (R-07, preimenovanje
`SOLD` → `RAZMENJEN`) pala je sa `"SOLD" is not an existing enum label` — preimenovanje
je u test bazi već bilo sprovedeno. Posledica: **svih deset buildova naredna tri dana**,
i na granama i na `main`, palo je sa P3009, a `kolo-peach.vercel.app` je sve vreme
služio build od 15.09. Ekran je izgledao ispravno, pa se kvar video **samo iz pošte** i
iz build log-a — `kolo-peach` „radi" ne znači da se išta objavljuje.

🔴 **Pad ne popravlja nov fajl.** Blokada nije u SQL-u nego u FAILED redu; dok se on ne
razreši, nova migracija se ne pokušava. Zato je ovo **jedini slučaj u kojem se postojeći
fajl migracije sme prepraviti** (pravilo „izmena ide u NOV fajl" važi za **primenjene**
migracije, koje `migrate deploy` tiho preskače — ova nije primenjena).

**Postupak:** (1) pala migracija se prepravlja da bude **idempotentna** — svaka naredba
pod `IF EXISTS` proverom, jer se posle pada **ne zna** koliko je od nje prošlo; (2) u
`buildCommand` se privremeno ubaci `prisma migrate resolve --rolled-back <ime> || true`
pre `migrate deploy`; `|| true` je obavezno, jer na okruženju gde migracija nije u
FAILED stanju (produkcija, ili test posle popravke) `resolve` baca grešku i bez toga bi
sam oborio build; (3) kad build prođe, taj korak se **uklanja istim danom** — ostavljen,
on je tiha brana koja bi sledeći pad iste migracije progutala bez traga.

### Migracije se primenjuju AUTOMATSKI pri deploy-u
`vercel.json` → `buildCommand`: `if [ -n "$DATABASE_URL" ]; then prisma migrate deploy; fi && npm run build`.
- Migracije se primenjuju **same** na bazu okruženja preko Vercel `DATABASE_URL` (prod→prod, test→test). **Nema više ručnog `npx prisma migrate deploy`** posle deploy-a.
- Guard `if DATABASE_URL` znači da okruženja **bez baze** preskaču migraciju i ne pucaju; gde baza postoji, neuspela migracija i dalje **glasno** obara build (prethodni deploy ostaje živ).
- `prisma.config.ts` čita `datasource.url` iz `process.env.DATABASE_URL` (datasource u šemi nema `url`, jer runtime koristi `@prisma/adapter-pg`).
- **VAŽNO — migrate ide DIREKTNO, ne preko poolera (fix `4e75948`, 2026-06-04):** `prisma.config.ts` skida `-pooler` iz `DATABASE_URL` za Prisma CLI. Razlog: `prisma migrate deploy` uzima Postgres advisory lock koji ne radi kroz Neon pooler (PgBouncer) → puca sa **P1002** (timeout na `pg_advisory_lock`, 10s) i obara build. Runtime klijent (`@prisma/adapter-pg`) i dalje koristi **pooled** `process.env.DATABASE_URL` — direktna konekcija važi samo za CLI. (Neon direktni host = pooled host bez `-pooler`.)


## 🔴 Zabranjene teme i odbijene mere (jedan spisak)

Sve je odluka vlasnika. **Ne predlagati ponovo bez izričitog naloga** — ni kao „samo
ideju", ni usput u nekom drugom poslu. Uz svaku stoji razlog, jer razlog je ono što
sprečava da se predlog vrati u drugom obliku. Pun zapis: `docs/sprovodjenje-rizika-2026-09.md`.

### Ne dirati POEN i ZRNO

| Zabranjeno | Zašto |
|---|---|
| **Dinarska kapa ili prag na POEN**, u bilo kom kanalu | svaka takva mera je preračun POEN → dinar, dakle povratak odnosa 1:1 koji je R-01 uklonio iz Uslova čl. 19. *„POEN nije vezan za dinar."* Kape u dinarima smeju **samo** na robu iz nabavke (meri se sa računa dobavljača) |
| **Dirati odnos POEN ≈ RSD u tekstu** — prećutati ga (M-7b), ukloniti ili „zaokružiti" iznose u primerima na naslovnoj, ili vratiti bilo koji izraz za paritet u copy | prećutan odnos je prvi protivargument, pa akt kaže da ga Fondacija ne objavljuje i ne primenjuje, a ne da ne postoji; iznosi u primerima su namerni jer odnos izvodi čitalac, ne Fondacija. „POEN po jedinici jednak je maloprodajnoj referenci" je osam dana stajao na ekranu posle ukidanja instituta — otud i brana `r07-obmanjujuca-praksa-izvor.test.ts` |
| **Širiti dozvole identifikovanog člana** — otpis i aktiviranje ZRNA (D-1), glas i delegiranje (C′), potvrđivanje drugih, nadzor, operativni doprinos, socijalni programi, nabavka, pokroviteljstvo, kontakt oglašivača | granica je jedna i posle 4.6.6: radnje **učešća** u razmeni i obračunu su otvorene, radnje **upravljanja i jemčenja za druge** nisu. Otpis je jedino mesto gde položaj donosi prinos (upis po nižem, otpis po višem koeficijentu); glas podiže R-04, R-10 i R-17 za po jedan bod. 🔴 Odluka je na dva mesta i samo na njima: `smeProsireno` (`dozvole.ts`) i `smeDaSalje` (`doprinos-pravila.ts`) — ne uvoditi treću proveru |
| **Otpis ZRNA po koeficijentu iz upisa; period vezivanja pre otpisa; tvrda kapa na glasačku moć** | odbijeno 07.09.2026; kvadratni koren (čl. 46) i kapa od 1% po periodu (čl. 19) su jedine kočnice i ostaju |
| **Vraćanje automatskog upisa POEN-a po kartičnom callback-u** | M-4a je odluka, ne privremeno rešenje |
| **Praćenje obrazaca prepisa POEN-a** | *„nemoguće je sprovesti kontrolu kada je transfer poena slobodan."* Posledica: zabrana prodaje POEN-a (Uslovi čl. 24) ostaje nesprovedena kontrola, i to je prihvaćeno |
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

- **IP adresa ili otisak uređaja uz zapis pristanka** — proširenje obrade radi dokazivanja pristanka na obradu.
- **Serverski zapis pristanka na kolačiće za neprijavljenog posetioca** — traži identifikator posetioca, isto kružno proširenje.
- **Sklanjanje „Odbij" iz prvog nivoa bannera** — pristanak tada nije slobodno dat.
- **Uskraćivanje funkcija naloga zbog nepotvrđene adrese** — potvrda je meka, po odluci vlasnika.
- **Vraćanje imena uplatioca u opis emisije.**
- 🟢 **NIJE VIŠE ZABRANJENO (odluka vlasnika, 25.09.2026, set 4.6.7): prikaz socijalnog programa uz pseudonim i iznos.** Evidentiranje po programu se od tog seta **prikazuje redovnim članovima** — pseudonim, naziv programa i iznos, uključujući iznose iz kojih se izvode godina rođenja (Podrška starijima) i broj i uzrast dece (Podrška majkama). Gostu i novom članu ostaje dnevni zbir, a dan sa jednim korisnikom se i dalje preskače. 🔴 **Ostaje zabranjeno: prikaz OSNOVA unutar programa Posebna podrška** — on obuhvata smanjenu sposobnost i gubitak doma, pa naziv ništa ne kazuje, a prikaz osnova bio bi prikaz podatka o zdravlju odnosno o prinudnoj raseljenosti (blizu nacionalne pripadnosti). 🔴 Ostaje i: **naziv programa se NE upisuje u opis zapisa** — izvodi se iz prijave, jer je opis trajan i ide u GDPR izvoz.
- **Otvaranje spiska dece po školi** punoletnim nalozima ili nalogu na čekanju.

### Deca

- **Kapa na vrednost pojedinačnog posla deteta** — umesto nje odobrenje roditelja iznad praga.
- **Dugme kojim roditelj obara prepis** — roditelj bi poništio ispravnu razmenu, a drugo dete završilo u minusu; ZOO čl. 56 daje pravo da se obori **ugovor** između strana, ne naš zapis.
- **Ublažavanje odgovornosti roditelja od 15 godina** i **gubitak roditeljskog čitanja razgovora sa punoletnim licem od 15** — oba odbijena, čl. 9 st. 3 i čl. 10 st. 5 ostaju netaknuti.

### Nabavka, pokroviteljstvo, upravljanje

- **Kapa na broj nabavki, kapa na udeo opticaja, uslovljavanje učestalosti** — nabavka je redovan projekat.
- **Izmena Statuta radi upisa privredne delatnosti** — osnov iz čl. 7 t. c) već postoji.
- **Izmena Statuta da imenuje Gornje Kolo** — Statut telo može imenovati, ali ga **ne može učiniti organom** (fondacija po zakonu nema članove ni skupštinu), pa bi problem preneo na viši akt i učinio ga vidljivim registracionom organu.
- **Najviše jedan osnivački korak po obračunskom periodu** — tempo ostaje isti.
- **Kućica „nudim u okviru registrovane delatnosti"** na oglasu — na Pijaci su fizička lica bez registrovane delatnosti; „trgovac" se po zakonu određuje ponašanjem, ne registracijom.
- **Traženje registracije od proizvođača u RAZMENI** — „mala kuća koja prodaje jaja" ne sme se time isključiti. Važi samo za razmenu; u **nabavci** je dobavljač uvek registrovano pravno lice.
- **Pomeranje poništenja POEN-a sa preuzimanja na istek roka za prigovor** — produžilo bi rezervaciju i odložilo zatvaranje svake nabavke.

### Otvoreno, ne zabranjeno

- **Prijava razmene se osmišljava iznova** (odluka 10.09.2026) — zaseban zadatak.
- **Podizanje donje granice za samostalnu registraciju** (13 ili 15 umesto 7) — odbijeno „ne za sada" (R-11, 09.09.2026), dakle **nije trajna zabrana**; može se vratiti kad modul dobije više korisnika. Premešteno ovde 23.09.2026 — po sopstvenom tekstu nije pripadalo spisku zabrana.
- **Spoljni DPO kao usluga** — nije odbijen, samo za sada nema ko.
- **Pravno mišljenje o čl. 65/67 ZZPL** za standardne ugovorne klauzule — odloženo, ne otvarati sada.

## 🔴 Pravila koja važe uvek

Ova pravila su se u ranijim verzijama ovog fajla ponavljala razbacano uz pojedinačne
izmene (zero-sum na 19 mesta, „zaseban fajl za enum" na 8). Ovde stoje jednom; ako se
razidu sa nekom sekcijom ispod, **merodavno je ovo**.

### Evidencija
1. **Zero-sum.** Zbir svih zapisa, uključujući Protokol, je nula. Protokol ide u minus pri svakoj emisiji.
   🟡 **Ali zero-sum NE proverava da se stanje slaže sa istorijom.** `Wallet.balance` je **zaseban
   upisan broj**, ne zbir transakcija: `emitujPoen()` radi `increment`/`decrement` nad `Wallet` i
   upisuje zapis **paralelno**, a nigde u `src/` nema koda koji balans izvodi iz zapisa. I
   `checkZeroSum()` i cron `/api/cron/zero-sum` sabiraju **stanja**, pa dve greške u suprotnim
   smerovima prolaze nečujno, a promena nad `Transaction` ne obara nijedan alarm. Posledica pri
   svakom zahvatu u istoriju: par `+X`/`−X` sme da ode samo **ceo i u istoj transakciji**, uz
   proveru `balance == Σ(ulaz) − Σ(izlaz)` po pogođenom novčaniku **unutar** te transakcije (tako
   radi `protokol/potvrde-parovi.ts`). Uklonjena jedna polovina pomera zbir zapisa a stanje ostavlja
   isto — i to niko ne vidi.
2. **U minus sme samo Protokol** — i korisnik, po **tačno šest** osnova iz Pravilnika čl. 14 st. 3, koje taj član nabraja iscrpno i zatvara („ni bilo kojim drugim aktom"):
   nadoknada po čl. 20b · poništen prepis po prijavi razmene · otpis prijateljstva · otpis po poništenju potvrde zbog neaktivnosti · prevođenje punoletnog naloga u maloletni (čl. 4d) · otpis po usklađivanju zatečenih potvrda (čl. 22a dokaza stvarnosti).
   🔴 **Sedmi se ne može uvesti bez izmene tog člana.** Nema zasebne kolone za minus — minus JESTE nadoknada, pa `jeNadoknada`/`iznosNadoknade`/`raspolozivo` iz `nadoknada.ts` pokrivaju sve slučajeve.
3. **Minus se nikad ne pojavljuje bez reči.** Ko ode u minus dobija sopstveno obaveštenje — minus menja šta sme sa zapisom.
4. **Kapirati na nulu je greška, ne blagost.** Ko je POEN brže potrošio ne sme da prođe jeftinije od onoga ko ga je sačuvao; to pravilo već nose otpis prijateljstva, poništen prepis i usklađivanje potvrda.
5. **Prepis nije emisija.** Prepis seli zapis između dva korisnička zapisa (čl. 14, 16); ukupan broj POEN-a menjaju samo kanali iz čl. 15 i poništenja. Protivzapis uvek ide **sopstvenim tipom transakcije**, nikad `TRANSFER` ni `EMISIJA_*` — inače brojači putanja i opticaj lažu.
6. **Istorija se ne prepravlja** — ispravka ide protivzapisom, kao pri prestanku statusa (čl. 34).

### Kod
7. **`emitujPoen()` otvara sopstvenu transakciju** — nikad unutar druge `prisma.$transaction()`. Obrazac: DB promene u jednoj transakciji → `emitujPoen()` sekvencijalno van nje. Okidači kanala (`probajEvidentirati`, `probajNapredovati`) idu van transakcije i **ne bacaju**.
8. **Nova vrednost enum-a ide u ZASEBAN fajl migracije.** Postgres ne dopušta da se vrednost doda i upotrebi u istoj transakciji. Obrazac: `..._enum` fajl → pa fajl koji je koristi.
9. **Čista pravila žive u `*-pravila.ts`, bez Prisme** — uvozi ih i pretraživač. Servisni sloj (`protokol/*.ts`) ih re-eksportuje, pa server ima jedan ulaz i ne nastaju dve istine.
10. **Ne prepisivati tabele u ekrane.** Tabele nivoa, pragova i koeficijenata čitaju se iz pravila. Prepisana vrednost živi na dva mesta i razilazi se pri prvoj sledećoj izmeni — desilo se dvaput (admin panel, `/postani-pokrovitelj`).
11. **Snimljen tekst se ne generiše ponovo pri čitanju.** `ugovorTekst`, `izjavaTekst`, `pristanakTekst`, kalkulacija nabavke — dokument mora da govori ono što je govorio u svom trenutku. Isto pravilo zabranjuje **retroaktivno popunjavanje**: zatečeni redovi ostaju `null`, jer „sačinjen" dokument sa današnjim datumom je netačan dokument.
12. **Interni identifikatori se ne menjaju** kad se promeni ime na ekranu: `banka-singleton`, `ChatMessage`, `/novcanik`, `/api/transfer`, `/verifikacija`. Baza je zapis pravne činjenice — bliža aktu nego ekranu, a stari linkovi iz notifikacija i mejlova moraju da rade.

### Brane
13. **Ekran nije poslednja reč.** Ispravno pravilo ne vredi ništa dok kroz njega ne prođe **svaki** prikaz i svaka ruta. Pouka je zapisana četiri puta (oglas deteta — tri prikaza su dizala svoj upit; zatvoren profil; lanac potvrda — preusmerenje je ličilo na pravilo; vidljivost oglasa). Provera je uvek: ko još čita ovaj podatak mimo pravila?
14. **Testovi koji gledaju IZVOR** (`*-izvor.test.ts`) su brana za pravila koja se mogu izgubiti bez ijednog vidljivog kvara. Kad se uvodi takvo pravilo, uvodi se i takav test.
15. **Pri ukidanju izraza pokriti sve imenice koje nosi uz sebe.** „цепь" naspram „цепочка", „kezességi gráf" naspram „kezességi lánc", „maloprodajna referenca" naspram „kurs" — tri puta je brana tražila jednu reč, a izraz je preživeo u drugoj.
16. **Ne raditi blanket zamenu verzija u aktima** — regularni izraz ne zna na koji akt pokazuje broj koji menja.
17. **Pri izmeni ili brisanju odredbe u Pravilniku obavezno proveriti whitepaper** — on istu tvrdnju po pravilu ponavlja svojim rečima, po pravilu u goroj varijanti. Uhvaćen testom tri puta.
18. **Dva builda na istoj test bazi se sudaraju** — grana i `main` se ne guraju u istoj minuti.

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru. Koristi dve interne jedinice:
- **POEN** — interna obračunska jedinica kojom se evidentira doprinos i učešće u zajedničkom dobru (NIJE novac, NIJE imovinsko pravo; beleži činjenicu doprinosa, bez vrednosti van sistema — analogija: zapis u matičnoj knjizi)
- **ZRNO** — interna obračunska jedinica koja beleži položaj korisnika; iz aktiviranog ZRNA proizlazi glas u Gornjem Kolu

Sistem funkcioniše kroz Fondaciju, mrežu **Krugova** (lokalnih operativnih grupa), KOLO **Protokol** (softverski protokol) i korisnike. **KOLO Zajednica** je opisni pojam za sveukupnost svih korisnika platforme — nije pravni entitet i nema organe.

## Kanonska dokumentacija (folder `dokumentacija 4.1/`)

### 🔴 PRAVILO BUMPOVANJA — bumpuje se SAMO akt koji se menja (2026-09-04)

Odluka vlasnika. **Akt koji se sadržinski menja dobija narednu šifru; ostali se ne
prepisuju i ostaju na svojoj.** Set od sada NIJE jedinstven i to je namerno.

🔴 **Ovo OBARA pravilo koje je ovde stajalo od 4.2.1** („Set je ponovo JEDINSTVEN —
jedan broj važi za ceo folder"). Raniji zapis je mešovit set držao za grešku, jer je
prethodni mešovit set (4.2.0 uz 4.1.1) proizveo unakrsna upućivanja na verziju koja
kao dokument više ne postoji. **Taj rizik nije nestao — samo se sada nosi ručno:**
pri svakom bumpu obavezno proveriti da li neki akt upućuje na akt koji je promenio
šifru, i ta upućivanja ispraviti. Provera je jedna komanda:

```
grep -rn "v4\.[45]\.[0-9]\|verzija 4\.[45]\.[0-9]" "dokumentacija 4.1/"
```

Upućivanja na akte koji se NISU menjali ostaju na staroj šifri — to nije previd nego
tačan podatak.

**Šta se menja uz svaki bump:** ime fajla na svih 5 jezika, mapa u
`src/app/(public)/pravilnik/[slug]/page.tsx` (`fajl` i `verzija`), poziv
`ucitajPravniDokument` na odgovarajućoj `page.tsx`, verzijske labele u
`messages/*.json` (`pravne.<doc>.ver` i `meta_<doc>_desc`) i spisak `AKTI` u
`__tests__/pravni-dokumenti.test.ts`. Sve to samo za akt koji se menja.

🔴 **ODLUKA VLASNIKA (2026-09-09): kad se ceo registar rizika završi, SVI dokumenti
se povlače na verziju 5.0.** Mešovite šifre 4.4.x su radno stanje dok traje obrada
rizika; po završetku ide jedan jedinstven bump celog seta na **5.0**, čime se i
zaostala unakrsna upućivanja (vidi ispod) raščišćavaju odjednom. Ne raditi to
usput — 5.0 je poslednji potez, posle poslednjeg rizika.

🟢 **Trenutna verzija svakog akta čita se iz imena fajla, ne iz ovog fajla:**
`ls "dokumentacija 4.1"/*.md`. To je izvor istine — po pravilu iznad, šifra u imenu
fajla JESTE objava. 🔴 **Ne prepisivati tabelu verzija u `CLAUDE.md`** — razišla bi se
sa folderom pri prvom sledećem bumpu (isti kvar kao prepisane tabele u ekranima).

📄 **Hronologija svih 36 bumpova je u `docs/istorija-bumpova.md`** (izdvojena
16.09.2026). Tamo se ide samo kad treba rekonstruisati zašto je neki akt dobio baš
tu šifru. Pravila koja iz te hronologije proizlaze su ispod — ona se ne čitaju iz
arhive. 🔴 **Uz svaki nov bump zapis ide u arhivu, ne ovde** — ovde se dopisuje samo
ako je bump proizveo NOVU pouku koje u spisku nema.

**Trenutno stanje seta:** 17 akata; Registar radnji obrade ima **osamnaest radnji**,
DPIA **osamnaest rizika** (pet srednjih, trinaest niskih); izuzetaka od zabrane
negativnog zapisa je **šest** (Pravilnik čl. 14 st. 3). 🔴 Kad se doda radnja obrade,
zbir u DPIA se usklađuje istim potezom.

#### 🔴 Pouke iz bumpovanja — sve su se već desile, po pravilu više puta

1. 🔴 **Jedan događaj objave = jedna šifra. Pri sudaru dve sesije ide NAREDNA
   SLOBODNA šifra** (branjeno sedam puta: 4.4.4, 4.4.7, 4.5.5, 4.6.0, 4.6.1, 4.6.4,
   4.6.5). Pre bumpa **obavezno `git fetch origin main`**. Ako je druga sesija u
   međuvremenu zauzela šifru: dovuci granu na `main`, prenesi svoje izmene **na
   main-ovu noviju verziju akta** — nikad na stariju osnovu sa koje je grana krenula,
   jer to **tiho poništava tuđi set** — i uzmi narednu slobodnu šifru.
2. 🔴 **Dopuna seta koji NIJE objavljen ne menja šifru.** Tada je reč o jednom
   događaju objave, pa bi nov bump tvrdio suprotno (presedan: Uslovi su ostali na
   4.4.3 iako su menjani dvaput istog dana; dokaz stvarnosti i Pravilnik su ostali na
   4.6.5 uz dopunu od 17.09). 🔴 **Da je set već objavljen, ista dopuna traži nov
   bump.**
3. 🔴 **Treći član šifre ostaje JEDNOCIFREN.** Posle 4.5.9 ide **4.6.0**, ne 4.5.10
   (isto kao 4.4.9 → 4.5.0). Dvocifren član kvari imena fajlova i sve zatečene
   `grep` provere verzija.
4. 🔴 **Pri izmeni ILI brisanju odredbe u Pravilniku OBAVEZNO proveriti whitepaper.**
   Bio je **propust tri puta** (R-08, R-09, R-02), i sva tri puta ga je uhvatio
   **test, ne pregled** — whitepaper istu tvrdnju po pravilu ponavlja svojim rečima, a
   dvaput ju je nosio u goroj varijanti. Od 4.6.5 se proverava uvek; tada je provera
   prvi put ispala negativna (whitepaper nije trebalo dirati) i **to je i dalje
   uspešna provera**, ne izgubljen posao.
5. 🔴 **Ne raditi blanket zamenu verzija u aktima.** Regularni izraz ne zna na koji
   akt pokazuje broj koji menja — pomerio je i upućivanja na akte koji se nisu
   menjali. Uhvaćeno i vraćeno, a ostatak se mesecima kasnije našao u hu DPIA.
6. 🔴 **Zaostala unakrsna upućivanja se NE ispravljaju u aktima koji se ovim potezom
   ne objavljuju.** Objavljen fajl ne sme da govori nešto drugo nego kad je
   objavljen. Cena je slomljen pokazivač i to je prihvaćeno; **briše ih odjednom bump
   celog seta na 5.0.** Ispravljaju se samo u aktima koji se ponovo objavljuju.
   🟡 Isto važi i za istorijska pozivanja („Modul 3 aktiviran DPIA v4.3.0") — ona su
   tačan podatak o danu donošenja i ne diraju se.
7. 🔴 **Glavni Pravilnik MORA da se bumpuje kad se uvodi nov osnov za negativan zapis
   ili nov osnov za uvećanje ukupnog broja POEN-a.** Čl. 14 st. 3 nabraja osnove
   **iscrpno** i zatvara listu izričito („ni ovim pravilnikom bez izmene ovog člana,
   ni bilo kojim drugim aktom"), pa poseban pravilnik to ne može sam. Dešavalo se
   pet puta (R-15, R-18, R-20, kolektivna nabavka, usklađivanje zatečenih potvrda).
   🟡 Bump glavnog Pravilnika povlači ispravke u DPIA i Pravilniku o učešću dece, pa
   se ne otvara bez potrebe.
8. 🔴 **Isto važi i kad akt imenuje KANAL:** čl. 15 imenuje kanale i mora da kaže
   kada po kojem nastupa upis — pa izmena trenutka upisa u posebnom pravilniku
   povlači i glavni Pravilnik (tako je 4.6.5 uzeo oba akta).
9. 🔴 **Numeracija rizika: postoje DVA registra i ne poklapaju se.** Stari
   (R-01…R-20, opisan po sekcijama ovog fajla) i nov, nezavisan
   (`docs/registar-rizika-regulatori-2026-09.md`, 22 rizika). Kad se kaže „R-01",
   misli se na **nov** registar.
10. 🔴 **Paralelne sesije daju migracijama iste vremenske oznake.** Prisma ih ređa
    leksikografski po imenu foldera, pa je redosled određen i SQL nezavisan — ali se
    oznake **NE smeju naknadno preimenovati**, jer su migracije već primenjene na
    test bazu preview buildom grane.
11. 🔴 **Konflikt u `CLAUDE.md` i u registru rizika pri paralelnom radu rešava se
    SPAJANJEM oba reda, ne biranjem jednog.** Svaka sesija dopisuje svoj zapis.
12. 🟡 **Sadržinski nepromenjen akt se ne bumpuje.** Ako akt ne nosi spornu odredbu,
    ostaje na svojoj šifri — to nije previd nego tačan podatak.
13. 🔴 **Gde nov institut SME da živi — hijerarhija čl. 7.** Poseban pravilnik može
    da uredi pitanje **samo kad KOLO Pravilnik izričito uputi** (čl. 7 st. 4), a
    razgraničenje između pravilnika ide **po predmetu** (čl. 7 st. 3) — predmet
    Gornjeg Kola je ORGAN, a nabavki PROCES, pa nabavke nisu mogle biti dopuna
    Gornjeg Kola. 🔴 Uz to: **akt nižeg ranga ne može izmeniti ono što je uređeno
    aktom višeg ranga** (čl. 8 st. 2) — na tome je pao čl. 12 st. 4 hijerarhije, koji
    je nadležnost za opšte akte prenosio na Gornje Kolo (vidi „Gornje Kolo: telo
    Fondacije"). Nov akt se dopisuje u čl. 7 st. 2 hijerarhije.

## Status usklađenosti

🟢 **Kod je usklađen sa aktima; zatečeni GAP-ovi iz v3.7.x su rešeni.** Snimak
usklađenosti iz maja–juna 2026. i spisak sedam rešenih GAP-ova izdvojeni su u
`docs/istorija-uskladjenosti.md` (17.09.2026) — mereni su prema **v3.7.x**, pa su im
brojevi i imena fajlova zastareli po devet verzija. 🔴 **Ne koristiti ih kao izvor.**

Aktivni GAP-ovi i ono što se svesno ne radi su u sekciji **„Nezavršeni TODO /
preostali GAP-ovi"** na kraju fajla.

🔴 **Tabla zahteva za jemstvo je UKINUTA (2026-08-09)** — zamenjena ulaskom kroz
Pijacu, vidi „Ulazak u KOLO kroz razmenu" u `docs/istorija-implementacija.md`.

🔴 **Moduli (Zadruga, internacionalizacija, Glava VIII) nisu fokus razvoja** (odluka
vlasnika). **Modul Deca je izuzetak** — implementiran i u radu od 2026-09-03.

**Tri statusa korisnika:** Neverifikovani / Verifikovani / Nosilac ZRNA — tako se zovu u **bazi i aktima**; u **interfejsu** su od 2026-08-12 **nov član / redovan član / nosilac ZRNA** (vidi „Copy govori o potvrdi" u `docs/istorija-implementacija.md`). NE POSTOJE organizatorske titule (zagovornik/aktivista/glasnik/šampion); NE POSTOJI "apostol" ni "Pokret" kao modul.

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
4. **Prenos 1:1 (ažuriranje evidencije)**: prenos POEN-a između korisnika je **ažuriranje evidencije** (zapis davaoca se umanjuje, zapis primaoca uvećava), bez provizije; Protokol nije posrednik i **to nije platna transakcija ni prenos monetarne vrednosti** (Pravilnik čl. 14, 16). Izbegavati „slanje/primanje POEN-a". **Dva registra:** UI za običnog korisnika koristi **„Prepiši POEN"** (od 2026-08-11, vidi „Upis vs. prepis" u `docs/istorija-implementacija.md`); pravni/normativni tekst zadržava **„ažuriranje evidencije"** (razlika od „**upisa novih zapisa kroz kanale**" iz čl. 15 — jedino to menja ukupan broj POEN-a, zero-sum). **Interni identifikatori `/api/transfer` i `TransactionType.TRANSFER` zadržani.**
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


10. 🔴 **Nalog je NEPRENOSIV** (Uslovi čl. 24): zabranjeno je ustupanje, iznajmljivanje
    i prodaja pristupa nalogu, kao i korišćenje tuđeg naloga, uz mere iz čl. 27 i 28.
    Razlog je konkretan — ZRNO se po čl. 22 Pravilnika ne može preneti, ali se **ceo
    nalog sa ZRNOM u njemu** mogao ustupiti u jednom potezu, pa se neprenosivost
    zaobilazila bez ijedne zabranjene radnje. Par uz zabranu prometa POEN-a i ZRNA za
    vrednost van sistema iz istog člana (do 4.4.3 prodaja POEN-a za keš **nije bila
    zabranjena nijednom odredbom**, pa je nekonvertibilnost bila izjava bez sankcije).
11. 🔴 **ZRNO NE DAJE PRAVO NA SREDSTVA FONDACIJE** (Izjava o rizicima čl. 4): nosilac
    nema pravo na dinarska sredstva ni neposredno ni posredno; odluke o raspoređivanju
    dinara, **uključujući projekte i kolektivne nabavke**, ne stvaraju imovinsko pravo
    nijednog nosioca; prestankom svojstva ne nastaje potraživanje. Povod: odbrana „iza
    jedinice nema imovine" (čl. 15 st. 4) oslabljena je kolektivnom nabavkom, u kojoj
    nosioci ZRNA odlučuju o trošenju dinara — uticaj postoji iako pravo ne postoji.
    🟡 Najjači dom bio bi **Pravilnik čl. 25**, ali bump glavnog Pravilnika povlači
    ispravke u DPIA i Pravilniku o učešću dece; zaseban potez, ne otvarati bez naloga.
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
- 🔴 **Raspored na `/verifikacija` (odluka vlasnika, 21.09.2026):** LEVO ono što čovek RADI — indeks, „Pokaži kod“, „Potvrdi nekoga koga poznaješ“; DESNO ono što ČITA — lanac potvrda, zabeležene potvrde, mreža potvrda. Na telefonu se kolone slažu tim redom. Zabeležene potvrde su do tada stajale levo, odmah ispod indeksa, pa su razdvajale indeks od radnji uz njega. Kartica **Mreža potvrda** ima oblik lanca potvrda (isti okvir, naslov u verzalu) i radnju u zelenom dugmetu; ranije je cela bila jedan `<a>` bez dugmeta. 🔴 **Klase `kolo-dugme-primarno`, `kolo-dugme-sekundarno` i `kolo-input` NE POSTOJE** — nisu definisane ni u `globals.css` ni igde drugde (jedina definisana `kolo-` klasa je `.kolo-naslov`), pa su dugmad i polja koja ih koriste bila gola. Sva mesta ispravljena 21.09.2026 izričitim Tailwind klasama (`/verifikacija` i **admin tab Potvrde**, gde su bila i sva polja za unos). 🔴 Ne uvoditi taj rečnik nazad dok ga neko zaista ne definiše.
- 🔴 **Spisak onih čiji se prvi doprinos čeka je JEDNA komponenta** — `src/components/SpisakCekanja.tsx`, dele je ekran POEN i stranica Potvrde (21.09.2026). Pločice sa pseudonimima, **linkovi na profil** (podsetiti čoveka znači otići kod njega), **bez iznosa i datuma po čoveku** — iznos je po vezi uvek isti (1.000 odn. 500) i stoji jednom, u redu iznad. 🔴 Ne vraćati rečenicu po čoveku („Potvrdio si X — 1.000 POENA ti se upisuje kad…“): pet potvrda je bilo pet redova teksta. Ne praviti drugu kopiju komponente.
- Lib: `dokaz-stvarnosti.ts`, `verifikacija-service.ts`, `nadzor-service.ts`, `lazna-verifikacija.ts` (poništavanje), `nadoknada.ts`.


### Pravna odbrana — šta je odlučeno i zašto (sažetak)

🔴 **Pun zapis je u `docs/sprovodjenje-rizika-2026-09.md`** — nalazi, aritmetika, odbačene
varijante i prihvaćeni ostaci. Ovde stoji samo ono što vezuje dalji rad. Registar sa
ocenama: `docs/registar-rizika-regulatori-2026-09.md`. **Pre rada na nekoj od ovih tema
otvoriti pun zapis** — sažetak ne nosi obrazloženja, a obrazloženja su ono što drži odbranu.

**Zajednički obrazac svih odbrana:** ne tvrdi se etiketa („POEN nije X") nego se nabrajaju
**elementi definicije koji nedostaju**. Etiketa pobija element koji nam niko ne prigovara;
nabrajanje elemenata odgovara na prigovor koji stvarno dolazi. Tako su pisani Pravilnik
čl. 13 (nije virtuelna valuta), čl. 25 (ZRNO nije investicioni instrument), operativni
čl. 27 (nije ugovor o delu), nabavke čl. 3a (nije privredna delatnost), Uslovi čl. 22b
(Fondacija ne nastupa na tržištu).

🔴 **Samokvalifikacija u aktu je slaba i ume da se okrene protiv nas.** Pišu se činjenice
koje neku kvalifikaciju čine, ne sama kvalifikacija — zato u aktima ne stoji reč „poklon",
ne stoji poreska stopa i ne stoji nijedan prag koji se menja zakonom. Rečenica
„nije socijalna pomoć" je sama sebi zatvorila poresko izuzeće i zato je brisana.

| Tema | Šta vezuje dalji rad |
|---|---|
| **POEN nije virtuelna valuta** (R-01, R-19; Pravilnik čl. 13) | odnos 1 POEN ≈ 1 RSD služi **isključivo korisniku** u sopstvenom oglasu; Fondacija ga ne objavljuje, ne preporučuje i ne primenjuje ni u jednom svom postupku. Kartična donacija: kapa **100.000 RSD** po uplati, **3 dnevno** po nalogu, POEN tek po ljudskoj potvrdi uz uplatioca iz izvoda |
| **Identifikovan član** (`User.identitetUtvrdjenAt`) | postavlja se **isključivo po JAVNOJ donaciji** (anonimna ne evidentira POEN). Nije četvrti status. Otvoreno mu je: POTRAŽNJA, pokretanje razgovora, pretraga, **upis ZRNA bez glasa** i — od seta **4.6.6** — **prepis POEN-a**. Zatvoreno ostaje: **aktiviranje i otpis ZRNA**, glas i delegiranje, potvrđivanje drugih, nadzor, operativni doprinos, socijalni programi, nabavka, pokroviteljstvo, kontakt oglašivača. 🔴 Granica je **učešće naspram upravljanja**, ne više „položaj naspram kupovne moći". Dozvole su na dva mesta: `smeProsireno` (`dozvole.ts`) i `smeDaSalje` (`doprinos-pravila.ts`) — prepis se odlučuje u drugom, i ekran ga **čita**, ne prepisuje (na tome je zatečeni ekran bio stroži od rute) |
| **ZRNO nije ulaganje** (R-04; čl. 25) | upis i otpis ZRNA su po konstrukciji **neutralni** za koeficijent — pomeraju ga samo emisije i poništenja, i on **može da padne**. Nikad ne pisati da upis diže koeficijent ni da se otpisom „dobija više" — to je predviđanje prinosa |
| **POEN nije prihod** (R-02) | dinar nikad ne dodiruje POEN — dodiruje samo račun. Godišnja granica **100.000 RSD** vrednosti preuzetih dobara po korisniku, merena **sa računa dobavljača** (`placenoRSD ÷ brojDelova`), živi u `nabavka-pravila.ts`, ne u aktu. Uz prikaz te vrednosti korisniku **ne ide nijedna reč o porezu** |
| **Nabavka nije privredna delatnost** (R-10; nabavke čl. 3a) | Fondacija za ustupljeno dobro **ne sme primiti naknadu** ni od koga (zabrana, ne opis); nepreuzeti delovi se **ne prodaju**; statutarni osnov je čl. 7 t. c). Ulazak u sistem PDV-a doneo bi samo sopstveni promet — a to je tačno ono što čl. 3a i čl. 19 brane |
| **Gornje Kolo je telo, ne organ** (R-09) | odluka se **upućuje UO**, koji je sprovodi svojim aktom i **ne ceni celishodnost**; odbiti može samo po zatvorenoj listi (čl. 51). Dinarska strana ostaje **preporuka** sa diskrecijom UO — ta dva režima se ne izjednačavaju. Rečenica „uloga Fondacije je izvršna, ne upravljačka" je brisana i zaključana testom |
| **Operativni doprinos nema naručioca** (čl. 4, 27) | zadatak objavljuje nosilac ZRNA odn. Gornje Kolo, a u Fazi 1 Fondacija **u ime zajednice**, ne u svoje. Predloženi POEN se **ne izražava kao vrednost jedinice vremena rada**; gornje granice nema. Rezultat ide u zajedničko dobro pod AGPL/CC BY-SA |
| **Osnivački doprinos** (R-08) | kumulativni udeo osnivača **raste** sa 19,4% na ~24% i to je objavljeno u aktu; kanal prati rast kakav god bio tempo i pravilnik **ne obećava** postupnost |
| **Pokroviteljstvo** (R-05) | koeficijent = donacija × **1,20**, obrazložen **odricanjem** (donacija pravnog lica ne umanjuje nužno poresku osnovicu), nikad time što je korporativni put jeftiniji. Fondacija **sme** javno imenovati i zahvaliti; pokrovitelj **ne stiče pravo** na logotip, link ni promociju. Donacija robe i usluga je ukinuta — ostaje samo novac |
| **Donacije** | obe tabele se nastavljaju **bez kraja**, nizom 1–2–5, +0,10 po nivou; `RANG_TABELA` je samo zaključan deo, prag se **računa**. Ugovor o donaciji za svaku donaciju, tekst se snima na zapis. Javnost donacije **nije uslov** za POEN nego **proverljivost** |
| **Nelojalna praksa** (R-07; Uslovi čl. 22b) | Fondacija prema korisnicima **ne nastupa na tržištu** — time se ZZP na nju formalno ne primenjuje, a između korisnika važi kao i van Platforme. Maloletni korisnik ne sme nuditi ni pribavljati ograničena dobra, **bez obzira da li je razmena dogovorena oglasom ili drukčije** |
| **Prigovor je jedan institut** (R-18; Uslovi čl. 37a) | devet vrsta, kapa **3 otvorena po vrsti** (ne globalno), rok 7 dana za nabavku i 30 za razmenu. Ispravka evidencije **nije povraćaj** — ni u aktu, ni u kodu, ni u copy-ju; da jeste, pao bi R-10 i sa njim pitanje PDV-a. Ulazna tačka je profil; dugme uz prepis je uklonjeno i **ne vraća se** |
| **Pranje novca** (R-19) | donacija isključivo **bezgotovinski**; doprinos se evidentira **samo u zapis onoga čijim je sredstvima uplaćeno**; uplata lica koje nije korisnik ne nosi POEN. Mere su izričito **dobrovoljne** — Fondacija nije obveznik, i to mora stajati u aktu. Prag za izjavu o poreklu živi u kodu (`PRAG_PROVERE_POREKLA_RSD`), ne u aktu |
| **Dokaz pristanka** (R-06) | `ZapisPristanka` sa snimljenim tekstom i verzijom, **bez IP adrese i otiska uređaja**; upis u **istoj transakciji** sa `user.create`; **dva reda, ne jedan**. `src/lib/verzije-akata.ts` je jedan izvor istine za verziju Uslova i Politike — **menja se pri svakom bumpu** ta dva akta. **DPO nije određen** (opcija C), uz napisanu procenu i godišnje preispitivanje; `PRISTANAK_NA_AKTE_TRAZI_SE` je **`true`** i ne gasi se |
| **Posebne kategorije** (R-03) | 🔴 **OBRNUTO setom 4.6.7** (odluka vlasnika, 25.09.2026): evidentiranje po socijalnom programu **prikazuje se redovnim članovima** uz pseudonim, naziv programa i iznos; gostu i novom članu ostaje **dnevni zbir**, a dan sa jednim korisnikom se i dalje preskače. Nosiva mera nije više izostavljanje zapisa nego **izostavljanje OSNOVA** — `POSEBNA_BRIGA` se na ekranu zove **Posebna podrška** i obuhvata smanjenu sposobnost i gubitak doma, pa naziv ne kazuje osnov. DPIA R11 time ide **6 → 9** (srednji nivo, gornja granica). Uslov „bez dece" živi na jednom mestu (`BEZ_DECE` u `protokol/deca.ts`) i svaki nov spisak transakcija ga uvozi |
| **Prekogranični prenos** (R-12) | izvršavanje i baza su u **EU (Frankfurt)** — `vercel.json` `regions: ["fra1"]` je **mera zaštite**, zaključana testom. U SAD izlaze samo slike, pošta (uključujući isečak poruke), Telegram i analitika. Osnov prenosa je **norma** („prenosi se isključivo obrađivaču sa kojim je zaključen ugovor"), ne izveštaj |
| **Prestanak statusa** (R-14) | to je **pseudonimizacija, ne anonimizacija** — ne vraćati tvrdnju da zapisi „prestaju da budu podaci o ličnosti". Ime javnog donatora ostaje u listi i posle gašenja naloga, i to sada piše i u upozorenju pri donaciji |
| **Socijalni programi** (R-13) | pristanak se daje **pre** nego što se od bilo koga zatraži potvrda i navodi koliko će lica biti zamoljeno; povlačenje pristanka postoji i briše unete podatke. Mejl i push nose **neutralan** tekst (`spoljni`), naziv programa ostaje u zvoncetu |
| **Deca** (R-11, R-15, R-17) | do 15 godina dete sa punoletnima **niti razmenjuje niti komunicira**, i prekidač iz čl. 10 to ne otvara; oglas takvog deteta punoletnima nije vidljiv. Prepis iznad praga (**5.000** za 7–14, **20.000** za 15–17) čeka roditelja **7 dana**, samo za odliv. Izjašnjavaju se **obe strane** u postupku potvrde postojanja deteta, rok **60 dana**, podsetnici na 30/7/1 dan, svako vraća **isključivo svoje** i **nadoknada se ne primenjuje** |

#### POEN po potvrdi čeka prvi doprinos (2026-09-16/17, set 4.6.5)

Najnovija izmena — zato ovde stoji šire nego ostale. Protokol POEN po potvrdi (1.000
potvrđivaču, 1.000 potvrđenom, 500 nadzorniku) više ne upisuje odmah nego ga **beleži**,
a upisuje kad potvrđeni ostvari **prvi potvrđen doprinos**.

🔴 **Sam čin potvrde se NE menja i ne sme se vezati za uslov.** Indeks raste za 10 p.p.
odmah, pun pristup od tog trenutka. Čeka **samo zapis POEN-a**: pristup ide iz poverenja,
POEN iz doprinosa, i to se ne spaja.

Četiri uslova, svi sa istim svojstvom — **nijedan se ne može sam sebi izdati**: prvi
**oglas** (odobrava Fondacija), **javna donacija**, **pokroviteljstvo**, **operativni
doprinos**. Meri se **postojanje emisije**, ne prijave — pa se anonimna donacija isključuje
sama od sebe. Nisu uslov: prepis POEN-a, osnivački doprinos, socijalni programi (podrška,
ne doprinos). **Punoletstvo je izuzeto** (`bezUslovaZaPoen`).

- 🔴 **Nadzornikovih 500 imaju svoje stanje** (`nadzorPoenStatus`) — ta emisija nastaje u svom trenutku, pa se sa jednim poljem ne bi razlikovalo „nema ishoda" od „uslov nije ispunjen". Uslov se **ne vezuje za ishod** nadzora: plaća se rad, ne saglasnost.
- 🔴 **Kaskade moraju da znaju za `ZABELEZEN`** — takva veza nije ništa emitovala, pa se pri obaranju samo gasi, bez protivzapisa i bez nadoknade. Pokriveno na pet mesta.
- 🔴 **Odobrenje nije diskrecija.** Fondacija **utvrđuje da je uslov ispunjen**; ne pisati nigde da POEN „dodeljuje" — na tome stoji odbrana iz čl. 13 i operativnog čl. 27.
- 🔴 **Usklađivanje zatečenih povlači pun iznos i pušta zapis u minus** (čl. 22a dokaza stvarnosti + **šesti** izuzetak u čl. 14 st. 3). Teret se ne prenosi ni na koga; zabeležen doprinos **ostaje**, pa se minus gasi prvim odobrenim oglasom. Pregled i sprovođenje idu kroz **istu funkciju** (`suviHod`).
- **FAQ 53** („je li ovo provizija za regrutovanje") je najosetljiviji tekst u potezu — **ne skraćivati ga**.

### Izmene 08–09/2026 — šta i dalje vezuje (sažetak)

🔴 **Pun zapis je u `docs/istorija-implementacija.md`** — zašto je nešto rađeno tako, šta
je pri tom otkriveno u kodu i šta je odbačeno. Ovde stoji samo pravilo koje i dalje važi.
**Pre rada na nekoj od ovih tema otvoriti pun zapis.**

**Dokaz stvarnosti i nadzor** (4.2.0) — nadzor ima **tri ishoda** (`UREDNO`/`ZA_PROVERU`/`SPORNO`);
slot kapaciteta dopunjava **samo `UREDNO`**; **roka nema** i ne uvodi se (ako zasmeta, rešenje
je da `ZA_PROVERU` dopuni slot). 500 POEN **prvom** nadzorniku koji evidentira bilo koji ishod —
plaća se rad, ne pečat. Lažnost se ceni **po čoveku**, ne po verifikatoru: utvrđenje jedne lažne
potvrde pokreće **preispitivanje** ostalih, ne poništenje. 🔴 Ne vraćati „poništi sve verifikacije
ovog verifikatora". Kaskada ide kroz `utvrdjenNepostojeci` i staje na prvom nalogu koji nije tako
označen. Nadoknada (čl. 20b): nepokriveni deo prelazi **na verifikatora**, jedinog koji sme u minus.

**Terminologija** — „lanac potvrda", ne „lanac jemstva"; „potvrdi", ne „verifikuj" u copy-ju.
🔴 **Imenica za ulogu se ne uvodi** („potvrđivač potvrđuje" muca): imenuje se prava uloga —
„tvoj lanac", „nosilac ZRNA". Statusi na ekranu: **nov član → redovan član → nosilac ZRNA**.
🔴 Pečat na Pijaci namerno ostaje **`BEZ POTVRDE`** (zaštitni posao prema kupcu), a oglas deteta
nosi **`DETE`**. Oznaka statusa čita **indeks**, ne tip naloga. Akti, baza i identifikatori i dalje
govore „verifikacija" — brana `copy-ukinuto.test.ts` gleda samo `messages/` i `faq-data*.ts`.

**Gejt za pristanak je PREKRIVAČ, ne preusmeravanje** — `AppShell` renderuje komponentu preko svega,
bez promene rute. 🔴 Ne vraćati redirect: proizveo je mašinsku petlju (98 pregleda za par minuta) i
ljudsku (120 za sat). Prekrivač se **ne crta dok se ne potvrdi** da je pristanak potreban; početna
provera se pokreće **tačno jednom**; `useMePatch()` mora ostati stabilan (`useCallback`). Jedan izvor
istine je `pristanakStatus()` — ne razdvajati ga, i redosled `efektivnaOd, createdAt, id` ostaje.

**Upis vs. prepis** — prepis POEN-a nije upis; uz obrazac **obavezno stoji definiciona rečenica**
(`novcanik.send_napomena`), bez nje reč radi protiv sistema. „Upis" ostaje za devet kanala, za
ZRNO i za popunjavanje polja. Ekran se zove **POEN**, ne Novčanik.

**Poništenje prepisa po prijavi razmene** — prijavljuje **isključivo pošiljalac**, jedna prijava po
prepisu (`@@unique`), povraćaj je **uvek pun** i zapis sme u minus. Protivzapis ide tipom
`PONISTENJE_PREPISA`, nikad `TRANSFER` (inače lažno otvara korak 2 putanje razmene). 🔴 Ulazna tačka
je **prigovor sa profila** (Uslovi čl. 37a), ne dugme uz prepis — ono je uklonjeno.

**Kolektivna nabavka** — kalkulacija se **snima** na `Nabavka` pri objavi i posle se ne menja; red je
**snimak** (`poenSnimak`, `mesto`), ne živa vrednost. Parametri se utvrđuju **pre** prikupljanja ponuda
(`dodajPonudu` odbija ponudu bez parametara, `utvrdiParametre` odbija izmenu kad ponuda postoji) — time
tvrdnja da broj POEN-a nije cena postaje svojstvo redosleda. POEN se **rezerviše** pri potvrdi, **gasi**
pri preuzimanju, tipom `OTPIS_NABAVKA`; zapis **ne sme u minus**. 🔴 Projektni odliv ide u
`ProjekatTrosak`, **nikad** u `FondacijaTrosak` (prag za gašenje veta meri samo operativu). Predlozi
izabrane reči se posle nabavke **brišu**. Dva crona su obavezna: `glasanje-zatvaranje` (00:30) i
`nabavke` (05:00).

**Modul Deca** — u radu od 03.09.2026; gašenje više nije čist potez (išlo bi protivzapisom, ne
prekidačem). Tri stanja naloga (`NA_CEKANJU` / `POVEZANO` / `AKTIVNO`); dete na čekanju nema Pričaonicu
— iza njega ne stoji niko. Prijateljstvo: **500 POEN svakom, ali tek kad su OBE strane `AKTIVNO`** —
obostrano čekanje je cela odbrana od farmovanja; prijateljstvo dece **istog roditelja** se sklapa ali
**ne nosi POEN**. Raskid može **samo dete**, otpisuje 500 **obema** stranama i zapis sme u minus — bez
minusa postoji beskonačna kasa iz jednog prijateljstva. Punoletstvo: otpis → brisanje prijateljstava →
prevođenje naloga → potvrde roditelja, **tim redom**. 🔴 Roditelj **ne čita** razgovore između dece
(čita samo razgovor sa punoletnim licem, uz natpis koji odrasli vidi). Prepis roditelj↔dete čeka samo
**preuzimanje** naloga, ne potvrdu.

**Zaštita dece — tri pravila koja se lako tiho izgube:** profil maloletnog naloga se punoletnim
članovima **ne otvara** (odluka je na serveru, vraća se 200 sa `zatvoren`, a roditeljski prekidač ga
**ne otvara**); oglas deteta vide samo oni kojima sme (svaki prikaz mora kroz `smeDaVidiOglas` —
tri prikaza su dizala svoj upit); dete **ne ulazi u lanac potvrda** ni kao meta (indeks tu ne brani
ništa, jer se indeks potvrdom tek dobija).

**Ranglista škola** — izbor škole **ne nosi POEN** (bio bi deseti kanal). Broji se dete u stanju
`AKTIVNO`, po **istom** `USLOV_AKTIVNO_DETE` koji broji kartica Članovi — ne praviti drugu definiciju.
Na listama su samo škole sa bar jednim detetom; **uz procenat uvek ide i razlomak** („8,3% (1 od 12)"),
jer praga prikaza nema. Promena škole najviše jednom u 30 dana; prva postavka nije promena. 🔴 Škola se
briše na **tri** mesta: punoletstvo, `DELETE /api/profil`, reset naloga. Šifarnik se **ne piše rukom** —
generiše ga `scripts/uvezi-skole.mjs`, i oba izvoza idu u istom pozivu.

**Prevođenje punoletnog naloga u maloletni** — samo superadmin, obrazac (ne kucanje), nepovratno.
Poništava se **neto emisija iz istorije**, ne stanje — prepisan POEN ostaje, jer prepis nije emisija.
Minus je dopušten **na obe strane** (i trećim licima kojima padaju potvrde), uz protivzapis i
obaveštenje. Osnov: čl. 4d Pravilnika o učešću dece + čl. 14 st. 3 t. 5.

**Prijava poruke je UKINUTA** i model je obrisan — ni u dečjoj sobi ni u sobi odraslih.
🔴 Ne mešati sa **prijavom oglasa** (`PrijavaOglasa`, tab Pijaca), koja radi. Moderacija Pričaonice
ostaje — izgubljen je korisnički signal, ne poluga. Posledica: dečja soba nema kanal do Fondacije;
detetu ostaju roditelj i raskid prijateljstva.

**Ulazak u KOLO kroz razmenu** (čl. 40a) — 🔴 **beleženje ≠ evidentiranje**: verifikovanom se doprinos
evidentira odmah, nalogu bez potvrde se **beleži** i čeka **odobrenje Fondacije** (tab „Prvi oglasi").
Od seta 4.6.5 kroz odobrenje ide **svaki** prvi oglas. Jednokratnost drži **baza** (`userId @unique`),
ne kod. Uklanjanje oglasa zbog povrede Uslova poništava zabeležen doprinos ali **ne oslobađa kanal**;
odbijanje u tabu ga **briše** i kanal ostaje slobodan — to su dve različite odluke. Odbijanje **ne
uklanja oglas** (moderacija je drugi tab).

**Doprinos razmeni** (čl. 40b) — pet koraka × 1.000, kapa 5.000 koju drži **baza** (`CHECK` +
`@@unique`), ne kod. „Razmena" = **upis POEN-a**, ništa drugo; nema modela `Razmena` i ne vraća se
ručno označavanje. Prag **1.000 POEN po transakciji** (ne po zbiru), sagovornik mora biti **van kruga
poznanstava** i verifikovan, i broji se **jednom** za celu lestvicu. Već evidentiran korak se ne
poništava kad brojač kasnije padne.

**Mesto je jedno naselje iz šifarnika** — `razresiNaselje()` je jedino mesto provere, i klijent i
server. Zatečene vrednosti se ne zaključavaju (izmena telefona ne sme da padne zbog stare lokacije).

**Moderacija sadržaja** — reaktivna, ne preventivna. 🔴 **Uklanjanje, nikad prepravka** tuđeg oglasa —
prepravkom Fondacija postaje koautor i gubi zaštitu iz čl. 25 st. 1. Razlog je **obavezan** (400 bez
njega) i vidi ga samo vlasnik. Uklanjanje je meko i povratno. Sistem sam ne sankcioniše — na tri
uklonjena oglasa ide predlog adminima, ne mera.

**Pseudonim u adresi profila** — u interfejs ide pseudonim (`profilHref()`), u sve što se **čuva**
(notifikacija, mejl) ide **interni id**. `pseudonimLower` se upisuje isključivo preko
`poljaPseudonima()`/`promeniPseudonim()`. Napušteni pseudonimi se čuvaju da ih ne preuzme neko drugi.
🔴 Pri dodavanju nove statičke podrute pod `/profil/` dopuniti `REZERVISANI_PSEUDONIMI`.

**Reset naloga na dan registracije** — samo superadmin, uz **otkucan pseudonim**; pogađa i druge naloge
(padaju sve potvrde koje nalog dodiruje). Zero-sum ostaje očuvan. **„Prvi put" je zapis u bazi**
(`User.vodicVidjenAt`), ne u pregledaču; upis ide pri **otvaranju** vodiča.

### Pristanak na akte se NE traži (prekidač, 2026-08-11)
`PRISTANAK_NA_AKTE_TRAZI_SE = false` u `src/lib/moduli.ts`. Odluka vlasnika: akti 4.2.1 su punovažni danom donošenja, sistem još nije zvanično u radu, a ekran je smetao ljudima koji prvi put dolaze. Provera je na **jednom mestu** — `pristanakStatus()` u `src/lib/politika.ts` — pa i shell i sam ekran ćute; `/politika-prihvati` propušta dalje.
- **Mehanizam se ne briše.** `PolitikaVerzija`/`PolitikaPrihvatanje` i svi zatečeni pristanci ostaju u bazi (dokaz), red „4.2.1" iz migracije takođe. Povratak je `true`, bez ijedne dalje izmene.
- 🔴 **Za prvu izmenu akata POSLE puštanja sistema u rad prekidač MORA nazad na `true`** — Uslovi čl. 40 i Politika čl. 16 tada traže nov red `PolitikaVerzija`, ponovnu saglasnost i obaveštenje **bez odlaganja**. 🔴 Roka od 15 dana **više nema** (ukinut setom 4.3.0) — ne vraćati ga.
- Opis ispod (prekrivač, izvor istine, petlje) i dalje važi — opisuje mehanizam koji radi čim se prekidač vrati.

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

### Krug (kolektivni oblik — Pravilnik Glava VIII, čl. 55)
- Kolektivni oblik bez pravnog subjektiviteta; ima evidencioni identifikator i zajednički POEN zapis u Protokolu.
- Ovlašćena lica, min. broj članova i ostali parametri uređeni su **posebnim pravilnikom** (čl. 55); vrednosti u kodu („najmanje 5 verifikovanih", 1–3 ovlašćena lica) potiču iz tog pravilnika/koda.
- **Rast kolektivnih oblika** je kanal evidentiranja (čl. 15) — Mehanizam platforme (NE ulazi u dnevni limit, svaki prag se loguje jednom u `KrugBonusLog`):
  - 5 članova (osnivanje): **50.000 POEN** | 10: 100.000 | 20: 200.000 | 50: 500.000 | 100: 1.000.000 | 200: 2.000.000 | 500: 5.000.000
  - Formula: `broj_članova × 10.000 POEN`
- Logika: `src/lib/protokol/krug.ts` → `proveriIEmitujBonusPrag()`.

### Programi Protokola
- **Operativni doprinos (Pravilnik čl. 36; Pravilnik o operativnom doprinosu):** zadatak objavljuje nosilac ZRNA odn. Gornje Kolo, a u Fazi 1 privremeno Fondacija **u ime zajednice** (čl. 4, od 4.4.4 — vidi „Operativni doprinos: nema naručioca, nema naknade" u `docs/sprovodjenje-rizika-2026-09.md`); korisnik (indeks ≥ 10%) se prijavljuje i izvršava; izvršenje **verifikuju nosioci ZRNA (Faza 2), odn. UO (Faza 1)** — **NIJE** međusobno potvrđivanje proizvoljnih korisnika. Model: predlagač zadaje **predloženi POEN** (težinski koeficijent), evidentirani POEN = predloženi × min(1, L/P) u okviru dnevnog limita. ✅ Implementirano u `programi.ts` (`raspodelaKoeficijent`, `evidentiraniPoen`); verifikacija nosilaca ZRNA/UO sa proverom sukoba interesa.
- **Socijalni programi:** PODRSKA_MAJKAMA (i primarni staratelji), PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE — uslovi/koeficijenti u programskim pravilnicima.
- 🔴 **`POSEBNA_BRIGA` se na ekranu i u aktima zove „Posebna podrška" (set 4.6.7, 25.09.2026).** Interni identifikator, enum i zatečene prijave se **ne menjaju** — isti obrazac kao „POEN" naspram `/novcanik` i „Pričaonica" naspram `ChatMessage`. Program ima **dva osnova**: **smanjena sposobnost** (rešenje nadležnog organa kojim je utvrđen stepen invaliditeta, uključujući rešenje komisije za procenu radne sposobnosti — uzima se **postojanje**, nikad sadržaj, stepen ni dijagnoza; odnosno akutna ili hronična bolest zbog koje član **ne može ili je bitno ograničen da učestvuje**, dokaz je izjava) i **gubitak doma** (nepogoda, požar, poplava ili prinudna raseljenost, izjava). Pravo ostvaruje sam korisnik, odnosno **negovatelj** punoletnog lica koje nije član, odnosno **roditelj** maloletnog lica do njegovog punoletstva. **Jedan dnevni iznos po podnosiocu** bez obzira na broj osnova i lica. 🔴 **Kumulira se sa Podrškom majkama**, i kad je oboje povodom istog deteta. Trajanje po osnovu: rešenje 365 dana, **akutna bolest 6 meseci**, **gubitak doma 12 meseci bez revizije**.
- 🔴 **Prinudna raseljenost i nepogoda su JEDAN objavljen osnov** („gubitak doma") — razdvojena, raseljenost bi odala nacionalnu pripadnost, a ona je posebna kategorija.
- 🔴 **Školovanje: dokaz statusa je IZJAVA pod punom odgovornošću, ne isprava** (programi podrške čl. 13 st. 2 i 3, od 4.3.2). Za maloletnog korisnika daje je roditelj odnosno zakonski zastupnik i njome potvrđuje da je dete redovno upisano u školu odnosno na fakultet; punoletni korisnik daje je sam. 🔴 **Potvrde o upisu i druge isprave se NE traže** — ne dostavljaju se i ne prikupljaju. Neistinita izjava povlači mere iz Uslova (suspenzija, isključenje), prestanak evidentiranja i poništenje već evidentiranog POEN-a protivzapisom. Uz to važi i verifikatorska potvrda iz čl. 4. 🟡 Program obuhvata **i učenike osnovne i srednje škole**, ne samo studente; iznos je fiksnih 2.000 POEN dnevno (čl. 13).
- Svi programi otvoreni verifikovanim korisnicima (indeks ≥ 10%), nezavisno od Kruga.
- 🔴 **Socijalni program traži indeks ≥ 10% — jednu primljenu potvrdu (od seta 4.3.1, 2026-08-18).** Do tada je čl. 4 Pravilnika o programima podrške tražio **pun indeks (100%)**, pa su prijavu mogli da podnesu samo nalozi sa svih deset potvrda; u kodu je to bio zaseban `MAX_INDEKS` gejt u `POST /api/programi/[type]/prijava`, iznad već postojećeg `imaFunkcionalniPristup`. Taj gejt je uklonjen — prag sada drži jedno mesto. Isto važi i za obustavu: `razlogObustaveProgram` (`programi.ts`, cron `/api/cron/programi-revizija`) gasi ACTIVE prijavu tek kad indeks padne **ispod 10%**, ne ispod 100%; ranije je jedna poništena potvrda gasila program čoveku koji uslov i dalje ispunjava. UI prop se zove `imaPristupProgramima` (bio `imaPunIndeks`).
- **Ostatak čl. 4 je netaknut:** izričit pristanak podnosioca i potvrda SVIH njegovih verifikatora pod punom odgovornošću, bez uvida u unete podatke; Fondacija ne odobrava dok svi ne potvrde. Copy (`programi.nepun_indeks`, `programi.pristanak_tekst`, 5 jezika) više ne pominje „svih deset" — broj verifikatora zavisi od indeksa.
- Dnevni limit (10% opticaja), proporcionalno smanjenje pri prekoračenju.
- 🔴 **Povlačenje pristanka postoji od 2026-09-10** (`POST /api/programi/[type]/povuci-pristanak`, dugme uz karticu programa) — pravo iz čl. 4 st. 3 koje je do tada stajalo u tri akta a nije postojalo u kodu. Vidi „Socijalni program: pristanak sada pokriva ono što se zaista dešava" u `docs/sprovodjenje-rizika-2026-09.md`.
- 🔴 **Unete podatke prijave vidi i odluku donosi ISKLJUČIVO SUPERADMIN (2026-09-07).** DPIA 5.6 kaže da su uneti podaci „dostupni isključivo licu koje obrađuje prijavu u Fondaciji", a do ove izmene ih je video svaki admin — tekst mere bio je **uži od primene**. Sada `GET /api/admin/programi` i SSR u `admin/page.tsx` šalju `metadata` samo superadminu, a rute `enrollments/[id]/{odobri,odbij}` traže `jeSuperadmin`. Odluka i uvid idu zajedno: odlučivanje bez uvida bilo bi odlučivanje na slepo. Običan admin vidi pseudonim, program i datum, uz napomenu `admin.programi_samo_superadmin`. Isti obrazac kao revizijski dnevnik i nadzor.
- 🟢 **Posebne kategorije se čuvaju minimalno (provereno 2026-09-07):** `buildMetadata` upisuje samo datume rođenja dece **bez imena**, datum rođenja, **datum rešenja i opcioni datum isteka** bez broja, organa i dijagnoze, i naziv ustanove. Raniji nalaz da se čuva `dijagnoza` je **zastareo i netačan** (ispravljen u `docs/analiza-kod-vs-pravilnici.md`). Enkripcije na nivou aplikacije nema, ali je DPIA ni ne obećava — tačka 5.1 govori o enkripciji **na nivou hosting infrastrukture**.

### Moduli sistema (Pravilnik Glava VIII, čl. 53–59)
- Glava VIII = **Moduli**: kolektivni oblici (**Krug**, **Zadruga** — registrovano pravno lice po Zakonu o zadrugama), socijalni programi, **Modul Deca** (maloletnici, poseban režim < 15, bez ZRNA/glasanja do 18), internacionalizacija.
- Aktiviranje/deaktiviranje: Fondacija u Fazi 1, Gornje Kolo u Fazi 2 (čl. 54).
- 🔴 Zadruga nije implementirana (odluka vlasnika: moduli nisu fokus). **Modul Deca JESTE implementiran i U RADU** od 2026-09-03 (`MODUL_DECA_AKTIVAN = true`), uz usvojen Pravilnik o učešću dece (4.3.0) — vidi „Modul Deca — unapređeni model" u `docs/istorija-implementacija.md`. Krug postoji; `KrugProjekat` je samo aktivnost Kruga (PRIKUPLJANJE/REDISTRIBUCIJA).

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
dokumentacija 4.1/ — kanonski set akata (17 akata × 5 jezika) — JEDINI normativni izvor
dokumentacija 4.0/, 3.9/, 3.8/, nova dokumentacija/ — istorija, ne čitati kao važeće
docs/             — pun zapis odluka + radne beleške (nije normativa)
```

## Implementirane funkcionalnosti

### Autentikacija i korisnici
- Registracija (pseudonim, email, lozinka), login (NextAuth credentials), OAuth tok (`/api/oauth`, `/oauth/dovrsi`), reset lozinke (`/api/zaboravljena-lozinka`, `/api/reset-lozinka`).
- **Verifikacija = dokaz stvarnosti kroz lanac potvrda, bez dokumenata/JMBG-a** (vidi „Dokaz stvarnosti"). Legacy LK/JMBG tok je UKLONJEN.
- Profil: pseudonim, lokacija, telefon, punoIme, opis (UserPodaci), profilna slika sa crop modalom. **Email se NE prikazuje u podešavanjima profila** (uklonjen, commit `4492bcf`; i dalje se koristi pri registraciji/loginu). **Promena pseudonima bez odjave** (commit `ba4c505`). Vidljivost se bira uz svako polje. Javni profil `/profil/[id]` (POEN/ZRNO/rang/oglasi uvek vidljivi) — **adresa je sada pseudonim**, vidi sekciju ispod.

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
- **Zabeležen doprinos** stoji kao ZASEBAN red ispod kartice stanja i **nikad se ne sabira** sa stanjem — do okidača to nije zapis POEN-a. Naziv na ekranu je „Zabeležen doprinos", NIKAD „POEN na čekanju" (čl. 12). Vidi ga samo vlasnik naloga (čl. 67).
- 🔴 **Sve što čeka uslov ide u JEDAN broj, razložen po tome NA KOGA SE ČEKA** (2026-09-21): Fondacija · tvoj prvi doprinos · drugi. Do tada je to bilo **pet redova** sa skoro istim naslovima (čl. 40a, koraci putanje razmene, potvrde primljene, potvrde date, nadzor), poređanih **po kanalu** — a kanal je podatak o poreklu i ne odgovara na jedino pitanje koje vlasnika naloga zanima: čiji se potez čeka. 🔴 **Rezervisano za nabavku se u taj zbir NE dodaje** — taj POEN je već upisan u zapis, samo je vezan do preuzimanja (čl. 23 st. 2). Grupe se zovu **Čeka Fondaciju · Čeka tvoj prvi doprinos · Zabeležene potvrde**. 🔴 U zatvorenom stanju red nosi **samo naziv i iznos** — bez rečenice objašnjenja; da se otvara kaže **strelica**, a ceo red je dugme (odluka vlasnika 21.09.2026). 🔴 Ključ `zabelezene_potvrde_opis` se **ne briše iz `messages/`** iako se od tada nigde ne prikazuje — traži ga `potvrda-uslov-izvor.test.ts`; brisanje ide samo uz izmenu te brane.
- 🔴 **Ko ne sme da prepisuje vidi NULU, ne svoje stanje** (odluka vlasnika, 2026-09-21). Veliki broj na kartici znači „koliko smeš da prepišeš", pa je za nov član i za dete koje čeka roditelja **0**, uz oznaku `raspolozivo_labela`; koliko mu je stvarno evidentirano nosi zaseban red **„Na tvom zapisu"**. Nije nov obrazac — `raspolozivo()` (`Math.max(0, stanje)`) tako već prikazuje zapis u nadoknadi. 🔴 Red „Na tvom zapisu" se **ne sme izostaviti**: bez njega čovek koji je nešto prodao na Pijaci vidi nulu i zaključuje da mu je prodaja nestala. 🟡 Povod: stanje „imam POEN a ne smem da ga pošaljem" nije ivični slučaj nego **glavni ulaz** (prodaš → upoznaju te → potvrde te), pa se ne leči menjanjem pravila nego prikazom.
- **Neverifikovanom se dugme za prepis POEN-a ne prikazuje** (čl. 28 st. 2), uz objašnjenje zašto — inače izgleda kao kvar. 🔴 Uz dugme se sklanja i **skener** i ne otvara se obrazac po `?plati=`: oboje vode u prepis DRUGOME, pa je nov član popunjavao ceo obrazac i tek pri slanju dobijao 403 sa `/api/transfer`. 🟢 **„Moj QR" OSTAJE** — nov član sme da prima (čl. 28 st. 2), a QR je način da mu se plati prodato dobro i time put do potvrde.
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

### Pokrovitelji (pun tok)
- Pokrovitelj = **pravno lice ili preduzetnik** (ravnopravno, Pravilnik čl. 40), nema login; doprinos se evidentira u zapisu verifikovanog vlasnika pravnog lica, odnosno samog preduzetnika (PIB je ključ).
- **Tok (Pravilnik o pokroviteljstvu čl. 7–10):** verifikovani korisnik pokreće **prijavu** (`/api/pokroviteljstvo/prijava`) → platforma generiše ugovor → korisnik **potpisuje** (`/[id]/potpisi`) → Fondacija **potvrđuje** (`/api/admin/pokroviteljstvo/prijave/[id]/potvrdi`), što pokreće evidenciju.
- 🔴 **Isključivo NOVAC, minimum prijave 10.000 RSD** (čl. 6, 7 — od 2026-09-08). **Roba i usluge su UKINUTE**; ruta odbija svaku vrstu osim `NOVAC`. Enum `VrstaDonacije` (NOVAC/ROBA/USLUGE) ostaje u bazi samo zbog zatečenih zapisa.
- 🔴 **Koeficijentni model: koeficijent = koeficijent donacije × 1,20** (`KOEFICIJENT_POKROVITELJSTVA` u `donacija-pravila.ts`). **Fiksna tabela od 7 nivoa i funkcije `NIVOI_POKROVITELJA`/`bonusZaNivo` su OBRISANE** — ne vraćati ih i ne prepisivati tabelu nivoa u ekrane. Detalji, obrazloženje ×20% i prelazna odredba: sekcija „🔴 Tabele donacija i pokroviteljstva".
- Model `PokroviteljPrijava`; admin UI `PokroviteljPrijaveTab.tsx`; korisnički UI `PokroviteljstvoPrijava.tsx`. Javna `/pokrovitelji`, app `/postani-pokrovitelj`. Logika: `protokol/pokrovitelj.ts`.
### Donacije
- Donacije fizičkih lica Fondaciji (RSD), admin potvrđuje uz **obavezan uplatilac iz izvoda**, pa se evidentira POEN. Logika: `donacija.ts`, `donacija-pravila.ts`.
- **Koeficijentni model:** kumulativna donacija određuje nivo; koeficijent novodostignutog nivoa primenjuje se na **celu novu donaciju**; `Math.round()`.
- 🔴 **Prag nivoa 1 je 0** — svaka donacija nosi POEN. 🔴 **Tabela se nastavlja BEZ KRAJA** nizom 1–2–5, +0,10 po nivou; `RANG_TABELA` je samo **zaključan objavljen deo** (jedanaest nivoa, 1,00×→2,00×), a prag se **računa** (`pragZaNivo`), ne traži u nizu.
- **Ugovor o donaciji za svaku donaciju** (čl. 5b) — vidi zasebnu sekciju.
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
- 🔴 **Četiri kartice brojača su dugmad i pale se/gase kao na `/sistem` (2026-09-22).** Otvorena kartica spušta spisak **ispod kartica, iznad vesti i Pričaonice**; ponovni klik je gasi. Članovi → spisak članova, Razmena → prepisi između korisnika, Ukupno POENA → zapisi Protokola, Oglasa → **link na Pijacu** (oglasi se ne prepisuju ovde — na Pijaci imaju pretragu po kategoriji i mestu).
- 🔴 **Spiskovi su JEDNA komponenta sa `/sistem` — `src/components/SistemListe.tsx`** (`ClanoviSekcija`, `TransakcijeSekcija`, `ProtokolLista`, `Ucesnik`). Prepisan spisak bi se razišao baš na pravilu vidljivosti: pseudonim u evidenciji doprinosa vidi samo potvrđen član (Pravilnik čl. 67), a to pravilo nosi `Ucesnik`. Ne praviti drugu kopiju.
- 🟡 **Podatke diže `GET /api/pocetna/liste?sekcija=clanovi|razmene|protokol`, tek pri otvaranju kartice** — početna je prvi ekran posle prijave, a spisak članova je upit nad svim nalozima; zatvorena kartica ne sme da košta nijedan upit. Ruta koristi **iste uslove** kao `/sistem` (`USLOV_RAZMENE`, `BEZ_DECE`, izuzeće `EMISIJA_PROGRAM`) — dve kartice sa istim imenom ne smeju da mere dva skupa. 🔴 Vidljivost sprovodi **server**: novom članu se strane maskiraju (`pseudonim: null` → „—"), a spisak članova mu se ne šalje uopšte, pa pseudonim ne stigne ni u mrežni odgovor.

### Sistem (`/sistem`)
- `/dashboard` redirectuje na `/sistem`. Lični pregled + 4 kartice (Članovi, Transakcije, Krugovi, Opticaj sa zero-sum kvačicom). Klikabilne kartice → filtrirani prikazi.
- 🔴 **Kartica „Članovi" broji i AKTIVNU DECU (2026-08-31).** Veliki broj je `verifikovanih + aktivneDece`, a „novih" je ostatak. Do ove izmene je brojao samo `verified: true`, pa je maloletni nalog zauvek stajao među „novima" — dete se **nikad ne potvrđuje** (u lanac potvrda ne sme da uđe, Pravilnik o učešću dece čl. 15), a nalog u stanju `AKTIVNO` radi u punom obimu. Uslov je **isti `USLOV_AKTIVNO_DETE`** koji broji ranglista škola (`protokol/skole.ts`) — ne praviti drugu definiciju aktivnog deteta.
- **Dete u spisku članova nosi pečat „DETE"** (`sistem.clan_dete`, 5 jezika), ne „?" — isti razlog kao pečat na Pijaci: „bez potvrde" bi mu saopštavalo nešto što se nikad neće promeniti.
- 🟡 **Sekcija „Lokacije" se NIJE menjala** — tamo „{ukupno} članova · {verif} redovnih" i pragovi za otključavanje kolektivnih oblika i dalje broje samo redovne članove. Dete ne osniva Zadrugu, pa bi ga brojanje tamo naduvalo prag.

### Blog (Vesti Fondacije)
- Admin objavljuje (`POST /api/admin/blog`); javna lista `/api/blog`. Model `BlogPost`.

### Pričaonica (globalna soba; UI naziv, ranije „Chat soba")
- Jedna soba; svi prijavljeni vide, samo verifikovani pišu; auto-čišćenje > 30 dana (`/api/cron/chat-cistenje`). Model `ChatMessage` (interni identifikator nepromenjen).

### Doprinos zajedničkom dobru — Oglasi (Operativni program)
- Predlagač objavljuje zadatak; verifikovan korisnik (indeks ≥ 10%) se prijavljuje (`/api/doprinos-oglasi/[id]/prijavi`), evidentira izvršenje (`/api/doprinos-oglasi/[id]/evidencija`).
- ✅ **Usklađeno:** model je **predloženi POEN × min(1, L/P)** (`DoprinosOglas.predlozeniPoen`, `OglasEvidencija.predlozeniPoen`; `programi.ts`), izvršenje verifikuju **nosioci ZRNA (Faza 2) / UO (Faza 1)** uz proveru sukoba interesa (verifikator ≠ izvršilac ≠ predlagač). Satnica (`hourlyRate`/`hoursWorked`) uklonjena. Konsolidovano sa starim PED tokom — `DoprinosEvidencija` i `/programi/ped/evidencija` više ne postoje; „PED" je samo enum/labela koja se rutira kroz doprinos-oglase.
- Modeli: `DoprinosOglas`, `OglasPrijava`, `OglasEvidencija` + enumi `OglasSource`/`OglasStatus`/`OglasPrijavaStatus`/`EvidencijaStatus`.

### Javne pravne stranice (rendruju iz `dokumentacija 4.1/`, prevodi iz `/en/`, `/ru/`, `/hr/`, `/hu/`)
- Loader `src/lib/pravni-dokument.ts` (baza = `dokumentacija 4.1`), mapa slugova u `src/app/(public)/pravilnik/[slug]/page.tsx`. Sve otključano za posetioce. 🔴 **Verzija se čita iz imena fajla** (`ls "dokumentacija 4.1"/*.md`), ne iz ovog fajla.
- Stranice: `/pravilnik` (+ `/pravilnik/[slug]`: kolo-sistem, hijerarhija, dokaz-stvarnosti, pokroviteljstvo-donacije, operativni, osnivacki, gornje-kolo, programi-podrske, projekti-nabavke, ucesce-dece), `/privatnost`, `/uslovi`, `/statut`, `/dpia`, `/radnje-obrade`, `/whitepaper`, `/rizici`, `/zajednicko-dobro`, `/osnivacki-doprinos`.
- **Verzijske labele** u `messages` (`pravne.<doc>.ver`, `meta_<doc>_desc`, `javneKomponente.dok_tag`) — menjaju se uz svaki bump, vidi „PRAVILO BUMPOVANJA".
- **i18n (EN/SEO):** javna površina + chrome + Pijaca prevedeni; jezik se bira cookie-om (dugme Lat/Ћир/EN), **bez `/en/` URL prefiksa** — prefiks bi tražio `app/[locale]/` restrukturaciju (vidi `docs/i18n-engleski-plan.md`, sekcija INCIDENT).
### Admin panel
- Tabs (`AdminKlijent.tsx`): Dashboard, Programi, Evidencija/PED, Pokrovitelji, **Donacije**, **Prigovori**, Korisnici, Pijaca, **Prvi oglasi** (odobravanje doprinosa iz čl. 40a), Finansije (evidencija doprinosa + veto/troškovi), Osnivači, Vesti, **Obaveštenja** (cirkularna sistemska pošta, samo superadmin), Audit, Nadzor (samo superadmin). (Admin simulator UKLONJEN; **Krugovi tab UKLONJEN** — ostala samo mrtva komponenta `KrugoviLista`.)
- **Terminologija „emisija" → „evidencija doprinosa" u Sistem/Admin UI** (commit `120d578`, samo `messages/*.json`) — **izuzev istorije transakcija**, gde tip transakcije ostaje vidljiv; u istoriji „Emisija" → prikaz **„Protokol"** uz boje iznosa (Protokol=plavo, primljeno=zeleno, dato=crveno; commit `8fd6d47`).
- **Badge po tabu = sidebar Admin badge (od 2026-06-13):** svaki tab koji ima stavke „na čekanju" prikazuje broj u zagradi (Programi, PED, Pokrovitelji, Donacije, Prigovori, Pijaca, Prvi oglasi, Nadzor). Sidebar `adminCekanje` (`/api/dnevni-brojevi`) broji ISTE kategorije — **krugovi izbačeni** iz brojanja (nemaju tab). **Donacije** tab: potvrda PENDING `donationRecord` preko `POST /api/admin/donacija {donationId}`. **Prigovori** tab: odgovor preko `PATCH /api/admin/prigovori/[id] {status, odgovor}` (RESENO/ODBIJENO/U_OBRADI). 🟡 Preostali nesklad: Pokrovitelji **tab** broji SVE pokrovitelje, a sidebar broji `pokroviteljPrijava` POTPISANA (na čekanju) — različiti brojevi.

## Uloge u sistemu
- **Korisnik platforme** (neverifikovan/verifikovan), **Verifikovani korisnik** (indeks ≥ 10%), **Nosilac ZRNA**, **Član Kruga** (preko `KrugClanstvo`), **Admin** = **operativa Fondacije, NE UO** (`admin` kolona = `AdminNivo` ADMIN/SUPERADMIN; tip ostaje `NOSILAC_ZRNA`; vidi „Ko je ko“), **Pokrovitelj** (pravno lice ili preduzetnik, bez naloga).
- ✅ **Jedinstveni statusni model:** legacy `Role` enum (`FIZICKO_LICE`/`CLAN_KRUGA`/`ADMIN`) je **uklonjen** (Faza C). Kanonski `TipKorisnika` ima tri vrednosti (`REGULARNI`/`NOSILAC_ZRNA`/`NEVERIFIKOVAN`); `POCETNI` je naknadno **uklonjen iz enum-a**. **Admin = operativa Fondacije** (odluka vlasnika 2026-09-23 — **ne UO**, vidi „Ko je ko“) se vodi preko **`admin` kolone (`AdminNivo`)**, NE preko `tipKorisnika` (autorizacija `/admin` panela ide preko `jeAdmin({admin})`; `tipKorisnika === "POCETNI"` ostaje samo kao legacy JWT-fallback u `proxy.ts`, za uklanjanje). **Članstvo u Krugu** se vodi isključivo preko `KrugClanstvo` (nema više `CLAN_KRUGA` na korisniku). Migracije `20260603150000_drop_role_enum` (drop legacy `Role`).

### 🔴 Ko je ko — UO, direktor i početni članovi (odluka vlasnika, 2026-09-23)

**Upravni odbor Fondacije čine TROJE: Danijel, Jelena, Stefan.**
**Vlasnik (pseudonim `dr.nikola.šarić`) je DIREKTOR**, ne član UO.
**Mihajlo je pomoćni programer**, takođe ne član UO.

**Svih petoro su početni članovi i nosioci ZRNA** — `jeOsnivac = true`, indeks fiksno
100%. 🔴 To se sa članstvom u UO **ne poklapa i ne sme se izjednačavati**: početni član
je normativni pojam iz Pravilnika o dokazu stvarnosti čl. 14, UO je organ Fondacije, a
direktor je zastupnik. Tri različite stvari kod istih ljudi.

🔴 **Zamka sa imenom Jelena.** U bazi postoje **tri** naloga sa tim imenom — `Jelena`
(UO, osnivač), `Jelena N.` i `Jelena1710.` — a uz njih i `jellena92`, koja je roditelj
deteta `Lazar` i **nije** ona iz UO. Kad se u razgovoru kaže „Jelena", misli se na
**onu iz UO**; svaki drugi nalog se imenuje punim pseudonimom.

### 🔴 Admin panel je ALAT OPERATIVE, ne organa (odluka vlasnika, 2026-09-23)

Do tada je na dva mesta u ovom fajlu i u komentaru `__tests__/admin-namespace.test.ts`
stajalo **„Admin = UO Fondacije"**, a to nikad nije opisivalo stvarnost: kolonu `admin`
(`AdminNivo`) drže **direktor i pomoćni programer**, dok **nijedan od trojice iz UO nema
ijedan nivo** (provereno u prod bazi 21.09.2026). Sva tri mesta su ispravljena.

🔴 **Brana oko `admin` namespace-a time NIJE oslabljena.** Njen razlog nije bio „panel
pripada UO" nego „panel barata institutima iz akata, pa loš prevod vodi ka odluci po
pogrešnom institutu". Nosilac je bio pogrešno imenovan, razlog stoji — **ne ukidati je.**

🔴 **Ostaje otvoreno ono što odluka NE rešava: radnje koje akti izričito daju UO.**
Kod na deset mesta izjednačava admina sa UO, a četiri su **normativne nadležnosti**, ne
operativa:

| Radnja | Akt | Kapija u kodu |
|---|---|---|
| Sprovođenje odluke Gornjeg Kola | Gornje Kolo čl. 51 | `jeSuperadmin` |
| Zaštitni veto | Pravilnik čl. 48 | `jeSuperadmin` |
| Odgovor UO na dinarsku preporuku | Gornje Kolo čl. 20 | `jeAdmin` |
| Verifikacija operativnog doprinosa u Fazi 1 | Pravilnik čl. 36 | `jeAdmin` |

Posledica: te akte danas može da izvrši direktor i **pomoćni programer**, a **UO ne može
nijedan** — nema pristup. Za veto i sprovođenje odluke to je akt organa koji donosi neko
drugi.

🔴 **Ne rešavati davanjem `admin` nivoa članovima UO** — time bi panel ponovo postao alat
organa, što je suprotno ovoj odluci. Rešenje ide u drugom smeru: te četiri radnje dobijaju
**sopstvenu kapiju** odvojenu od `AdminNivo`-a (oznaka „član UO" na nalogu), pa operativa
zadržava panel a organ svoje akte. Zaseban potez, ne otvarati bez naloga vlasnika.

🔴 Tekuće stanje kolone se **ne prepisuje ovde** (pravilo 10) — čita se iz baze.

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
- `pokrovitelj.ts` — pun tok prijave; koeficijent = donacija × 1,20, nivo se **izvodi iz kumulativa**. 🔴 `NIVOI_POKROVITELJA`, `bonusZaNivo()` i `izracunajNivo()` su OBRISANE (2026-09-08) — ne vraćati ih
- `donacija.ts` — `nivoZaKumulativ()`, `izracunajPoenZaDonaciju()`, `evidentirajDonaciju()`; pravila u `src/lib/donacija-pravila.ts` (`pragZaNivo`, `koeficijentZaNivo` — niz se nastavlja bez plafona)
- `krug.ts` — bonus rasta Kruga (ne ulazi u dnevni limit)
- `zrno.ts` — `UKUPNO_ZRNA`, `MINIMUM_POEN_ZA_UPIS_ZRNA`, obračunski koeficijent (`tekuciKoeficijent()`/`poslednjiKoeficijent()`), noćna obrada, `glasackaMoc()`. 🔴 Stara imena `trendsKurs`/`poslednjiKurs` i `ZrnoTrziste`/`.kurs` su preimenovana 13.09.2026 (R-04) — **ne vraćati nijedno**
- `osnivacki.ts` — osnivački kanal (100 × 24.000, granica 2.4M, raspodela; korak na svakih 100.000 opticaja, automatski i uzastopno pri preskočenim pragovima)
- `fondacija.ts` — saldo Fondacije + zaštitni veto; `pragZaGasenje = dohvatiTrosakPrethodnogMeseca() × 3` po Gornjem Kolu čl. 19. 🔴 Projektni odliv ide u `ProjekatTrosak`, NIKAD u `FondacijaTrosak` (prag meri samo operativu)
- `faza-sistema.ts` — Faza 1/2, auto prelaz na 1.000.000 POEN
- `dokaz-stvarnosti.ts`, `verifikacija-service.ts`, `nadzor-service.ts`, `lazna-verifikacija.ts` — dokaz stvarnosti i nadzor
- `doprinos-sadrzaju.ts` — osmi kanal (čl. 40a); čista pravila u `src/lib/doprinos-pravila.ts`
- `pristup.ts` — provere pristupa po statusu/indeksu
- `src/lib/notifikacije.ts` — `posaljiNotifikaciju()`; `src/lib/faq-data.ts` — `FAQ_SEKCIJE`

## Testovi
- **Vitest** (`npm test`, `npm run test:watch`). Lokacija: `__tests__/protokol/`.
- Pokriva: `donacija`, `osnivacki`, `delegiranje`, `faza-a-konstante`, `pokrovitelj`, `programi`, `emisija`. Config `vitest.config.ts` (`@/` → `src/`).

## Reference
- **`dokumentacija 4.1/`** — kanonski set (17 akata, sr + en/ru/hr/hu). Verzije iz imena fajlova.
- `docs/registar-rizika-regulatori-2026-09.md` — **nov** registar regulatornih rizika, 22 rizika (radni materijal, nije normativa).
- `docs/sprovodjenje-rizika-2026-09.md` — pun zapis odluka po rizicima (izdvojeno iz ovog fajla 17.09.2026).
- `docs/istorija-implementacija.md` — pun zapis izmena 08–09/2026 (izdvojeno iz ovog fajla 17.09.2026).
- `docs/istorija-bumpova.md` — hronologija svih bumpova akata (istorija, ne izvor).
- `docs/istorija-uskladjenosti.md` — snimak usklađenosti v3.7.x i rešeni GAP-ovi (istorija, ne izvor).
- `docs/` ostalo — interne radne beleške (FAQ analiza, glosar, model vidljivosti, obrađivači i prenos) — **nije normativa**.
- `dokumentacija 4.0/`, `dokumentacija 3.9/`, `nova dokumentacija/`, `dokumentacija/` — **istorija**, ne čitati kao važeće.
## Nezavršeni TODO / preostali GAP-ovi

### Stvarni GAP-ovi (dokumentacija propisuje, kod radi drugačije)

🟢 **Sedam zatečenih GAP-ova iz v3.7.x je REŠENO** (tabela donacija, veto prag, operativni doprinos, konsolidacija PED, „kurs" u srpskom UI, verzijske labele, dual `Role`/`TipKorisnika`). Spisak je izdvojen u `docs/istorija-uskladjenosti.md` — 🔴 meren je prema **v3.7.x** i ne koristi se kao izvor.

**Aktivni GAP-ovi se vode po sekcijama ovog fajla** uz oznaku 🟡 (npr. Pijaca badge se ne nuluje, gejt za pristanak je samo klijentski, DPA ugovori obrađivača nisu prikupljeni, `POCETNI` legacy JWT-fallback u `proxy.ts`).
### Mehanizmi delegirani posebnim pravilnicima / nisu fokus
8. **Modul Zadruga (čl. 56)** — nije implementiran (odluka vlasnika). Krug postoji. **Modul Deca (čl. 58) JESTE implementiran i pušten u rad 2026-09-03**; Pravilnik o učešću dece je usvojen setom 4.3.0, DPIA ažuriran.
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
