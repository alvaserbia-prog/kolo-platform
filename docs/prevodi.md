# Prevodi — pun zapis

> Izdvojeno iz `CLAUDE.md` 28.09.2026. Pravila koja vezuju rad stoje u `CLAUDE.md`
> (odeljak „Prevodi"); ovde su obrazloženja, zatečeno stanje i opis alata.
> Ako se razidu, merodavan je `CLAUDE.md`.

## 🔴 Tekst se menja SAMO na srpskom; prevodi idu pre objave (2026-09-13)

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


### 🔴 `admin` namespace se NE prevodi — i više ne postoji u prevodima (2026-09-13)

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

