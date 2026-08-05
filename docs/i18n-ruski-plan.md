# Plan: Ruska verzija platforme (i18n RU)

> **Svrha:** durabilni izvršni spec za prevod platforme na ruski. Velik posao se
> izvršava **fazu po fazu**, svaka faza pravi svoj commit. Buduća sesija čita OVAJ
> fajl i nastavlja tačno odakle se stalo — ne oslanjati se na istoriju ćaskanja.
>
> **Prethodnik:** `docs/i18n-engleski-plan.md` (EN, 2026-06). Pročitati njegovu
> sekciju **INCIDENT** pre bilo kakvog dodirivanja rutiranja.
>
> **Grana razvoja:** `claude/russian-translation-prep-lisiof`.
> Deploy pravila: vidi `CLAUDE.md` „Deploy i grane".

**Stanje na 2026-08-05.** Priprema koda je u velikoj meri gotova; **sam prevod
teksta nije započet.** `messages/ru.json` je i dalje kopija `sr.json`, a ruski
NIJE izložen u prekidaču jezika.

| Faza | Sadržaj | Stanje |
|---|---|---|
| — | Čišćenje mrtvih ključeva | ✅ 125 obrisano |
| **1** | Mehanika jezika (locale, font, paritet, loader) | ✅ |
| **2** | Izvlačenje zakucanog teksta iz ekrana | ✅ 58 ključeva |
| **3** | Datumi i brojevi po jeziku | ✅ 178 mesta |
| **4** | **Prevod `messages/ru.json`** | 🟡 **1.309 / 2.203 (59%)** |
| **5** | `faq-data-ru.ts` | ⬜ nije započeto (71 pitanje) |
| **6** | Obaveštenja (zvonce/push/mejl) | ✅ 27/29 (dva namerno srpska) |
| **7** | Istorija transakcija + migracija | ✅ (migracija probana na PostgreSQL-u) |
| **8** | Poruke o greškama iz API-ja | ✅ 601 poziva kroz `greska()` |
| **9** | Pravni akti na ruskom | ⬜ nije započeto (~62.500 reči) |
| **10** | Manifest / OG slika / metapodaci | 🟡 manifest ✅, OG slika otpada (v. §6c) |

**Sledeći korak:** dovršiti fazu 4 — preostali namespace-ovi su **javne
prezentacione stranice** (`oNama` 128, `oSistemu` 123, `landing` 100,
`kakoFunkcionisePage` 83, `pravne` 69) i **app ekrani** (`donacije` 66,
`doprinosOglasi` 65, `krug` 61, `glasanje` 55, `dobrodosli` 47,
`postaniPokrovitelj` 44, `zajednickoDobroPage` 20, `osnivackiDoprinosPage` 18).
Zatim faza 5 (FAQ) i faza 9 (pravni akti).

---

## 1. Zaključane odluke vlasnika (2026-08-05)

| # | Tema | Odluka | Posledica |
|---|---|---|---|
| 1 | **Pismo** | **Ćirilica** | Nazivi jedinica idu ćirilicom: **ПОЕН, ЗРНО, КОЛО** |
| 2 | **Admin panel** | **NE prevodi se** (za sada) | −385 ključeva; vidi §4.1 za paritet |
| 3 | **Pravni akti** | **Prevode se** | 15 dokumenata, ~62.500 reči, uz disklejmer „merodavan srpski original" |
| 4 | **Ugovori Fondacije** | **Uvek srpski** | `generisiUgovorTekst()` se NE dira |
| 5 | **Vesti Fondacije (blog)** | **Samo srpski** | Bez novog polja u bazi |
| 6 | **Mejlovi A — obaveštenja** | **Ruski** | Deli tekst sa zvoncetom, praktično besplatno |
| 7 | **Mejlovi B — lozinka** | **Ruski** | Sprečava trajan gubitak naloga |
| 8 | **Mejlovi C — cirkularna** | **Srpski** | Admin kuca tekst ručno; ostaje srpski |
| 9 | **Zvonce + push** | **Ruski** | Isti izvor kao mejl A |
| 10 | **Istorija transakcija** | **Prepraviti + migracija** | I postojeće stavke se prevode (§3.4) |
| 11 | **Naselja** | **Srpska ćirilica** | Preko postojećeg `lat2cyr`, bez ručnog rada |
| 12 | **Fiksirane engleske reči** | **Ne prevode se** | Spisak u §5 |
| 13 | **SEO / `/ru/` URL** | **Ne sada** | Kao engleski — prekidač na istom URL-u |
| 14 | **`email`** | **Ostaje „email"** | Ne prevodi se u *электронная почта* |

### Obrazloženje odluka koje nisu očigledne

**#11 Naselja — zašto srpska ćirilica, a ne ruska transliteracija.** Srpska azbuka
ima šest slova kojih u ruskoj nema: `Ђ Ј Љ Њ Ћ Џ`. Mereno nad `naselja-srbije.ts`:
**339 od 883 naselja (38%)** sadrži bar jedno takvo slovo (Аранђеловац, Ариље,
Јагодина, Азања…). Ruska transliteracija bi bila čitljivija, ali traži ručni prevod
339 imena i daje pisanje koje ne odgovara nijednom zvaničnom dokumentu. Odluka:
srpska ćirilica preko postojeće funkcije, bez održavanja.

**#8 Cirkularna obaveštenja ostaju srpska.** Tekst kuca admin u panelu
(`ObavestenjaTab.tsx`) — nijedan prevod se ne može pripremiti unapred. 🟡 **Poznato
ograničenje:** Uslovi čl. 40 / Politika čl. 16 traže obaveštenje 15 dana pre izmene;
obaveštenje na jeziku koji korisnik ne čita je formalno poslato, stvarno neisporučeno.
Ako se ovo kasnije revidira, rešenje je dvojezičan mejl (dva polja u admin formi),
ne nova mašinerija.

---

## 2. Zatečeno stanje (verifikovano 2026-08-05)

- **next-intl**, `src/i18n/routing.ts` → `locales: ["sr", "sr-Cyrl", "en"]`,
  `localePrefix: "never"` (jezik preko cookie-a `NEXT_LOCALE`, bez URL prefiksa).
- `messages/sr.json` = izvor istine, **2.277 leaf ključeva**, 42 namespace-a.
- `messages/en.json` — pun paritet (`npm run i18n:check` prolazi).
- `messages/hu.json`, `messages/hr.json` — **zamrznuti**, ne održavaju se.
- **Presedan:** hrvatski je jednom dodat kao pun jezik (commit `b0604ad`, 9 fajlova)
  — to je tačan mehanički spisak za §4.1.
- **Ćirilični glifovi već postoje** u fontu (`Inter` sa `cyrillic` subsetom,
  `layout.tsx:40`) — dodati zbog `sr-Cyrl`, ruski ih nasleđuje.
- `<html lang={locale}>` već dinamičko.
- `User.jezik` postoji u bazi, prekidač ga upisuje — **ali ga niko ne čita.**
- `CirilicaProvider` transliteruje samo kad je locale tačno `sr-Cyrl`
  (`CirilicaProvider.tsx:89`) → **ruski prolazi netaknut**, nema sudara.

### Pokrivenost i18n po oblastima

| Oblast | `.tsx` sa `useTranslations` |
|---|---|
| `src/app/(public)` | 16 / 17 ✅ |
| `src/app/(app)` | 41 / 65 |
| `src/components` | 17 / 42 |
| **Ukupno** | **83 / 141** |

---

## 3. Šta se mora dopuniti u KODU pre prevoda

> Ovo nije prevod — ovo je priprema. Bez svake od ovih stavki odgovarajući deo
> sajta ostaje srpski bez obzira na kvalitet prevoda.

### 3.1 Izvlačenje zakucanog teksta iz ekrana
**58 od 141 `.tsx` fajla** nema i18n; ~83 linije vidljivog teksta (bez komentara).
Prvo izvući u `messages/sr.json`, tek onda prevoditi.

Prioritet (vidljivo korisniku):
- Ceo tok verifikacije: `MojQrKod`, `VerifikujNekoga`, `QrSkener`, `MiniStablo`, `IndeksPrikaz`
- `CookieConsent` (vidi ga svaki posetilac)
- `oauth/dovrsi`
- `src/app/uskoro/page.tsx` (maintenance gate)
- `PijacaTab` (admin — po odluci #2 ostaje srpski, ali tekst svejedno izvući radi reda)

### 3.2 Poruke o greškama iz API-ja
**560 stringova u 153 fajla.** Server šalje gotov srpski tekst
(`NextResponse.json({ error: "…" })`), klijent ga samo ispiše.

Potrebna promena: server vraća **ključ** (npr. `{ error: "greska.nedovoljno_poena" }`),
klijent prevodi kroz i18n. Najveći strukturni zahvat u celom poslu — raditi u
zasebnoj fazi, po oblastima.

### 3.3 Obaveštenja (zvonce + push + mejl)
**31 pozivno mesto** `posaljiNotifikaciju()` sklapa tekst na licu mesta.
Jedan poziv → sva tri kanala, deljen tekst.

Potrebno:
1. Umesto gotove rečenice upisivati **ključ + parametre** u `Notifikacija`.
2. Rečenicu sklapati pri prikazu (zvonce) i pri slanju (push/mejl).
3. `email.ts` i `push.ts` čitaju **`User.jezik`** (polje već postoji i puni se).
4. Prevesti 2 fiksne reči u `emailLayout()`: „Pozdrav", „Isključi ovakva obaveštenja".
5. Prevesti `passwordReset.ts` (~7 stringova) — **mejl B, obavezno** (odluka #7).
6. `sistemsko-obavestenje.ts` (mejl C) — **ne dirati**, ostaje srpski (odluka #8).

Prateći srpski tekst koji ulazi u obaveštenja:
- `labelPrograma()` (`programi.ts`) — 5 naziva programa
- `kategorije.ts` → mapa `NAZIV` — 13 kategorija (UI je već i18n; ovo je odvojen
  srpski duplikat baš za obaveštenja)

### 3.4 🔴 Istorija transakcija — tekst se UPISUJE U BAZU
`emitujPoen(toWalletId, amount, type, description)` na **12 mesta** upisuje gotovu
srpsku rečenicu u kolonu `Transaction.description`:

```
Verifikacija Marko
Bonus za donaciju iznos 5.000
Osnivacki doprinos — korak 3/100
Bonus krugovi "Sombor" — 10 članova
Program Operativni doprinos
Nadzor verifikacije X → Y
Primljena verifikacija od X
Bonus za pokroviteljstvo iznos N
Osnivanje krugovi "X"
```

Sistem ne pamti *šta se desilo*, nego gotov tekst — pa nema šta da se prevede pri
prikazu. **Jedini sloj u kom prevod nije moguć naknadno bez migracije.**

Potrebno (odluka #10 — retroaktivno):
1. Upisivati **tip + parametre** (npr. `VERIFIKACIJA` + pseudonim), ne rečenicu.
2. Rečenicu sklapati pri prikazu, na jeziku posmatrača.
3. **Migracija** koja postojeće redove prepozna po obrascu i prevede u novi oblik.
   ⚠️ Primenjenu migraciju nikad ne menjati (Prisma kontrolna suma) — vidi `CLAUDE.md`.

### 3.5 Datumi i brojevi
**195 mesta u 50 fajlova** zakucano na `toLocaleDateString("sr-RS")` /
`toLocaleString("sr-RS")`. Uvesti jedan helper koji format bira po aktivnom jeziku.
🟢 Usput ispravlja i engleski — Englezi trenutno takođe vide srpski format.

Postojeći lanac za brojeve u `osnivacki-doprinos/page.tsx` (linije 23, 150) treba
zameniti istim helperom, ne dopunjavati ga sa `ru`.

### 3.6 Font za ruski
`src/app/layout.tsx:131` bira ćirilični font **samo** za `sr-Cyrl`:
```ts
const fontInter = locale === "sr-Cyrl" ? interCirilica : inter;
```
Bez izmene ruski pada na sistemski fallback. Ispraviti da obuhvati i `ru`.

### 3.7 OG slika (preview kad se link deli)
`src/app/opengraph-image.tsx` — naslov zakucan srpski, **a font u `src/app/_fonts/`
nema ćirilicu** (provereno: 647 mapiranih glifova, `U+0410` ne postoji). Ruski
naslov bi se iscrtao kao prazni kvadratići.

Potrebno: lokalizovati tekst + dodati font sa ćirilicom u `_fonts/`.
🟡 Isti problem latentno pogađa i `sr-Cyrl` (sada se ne vidi jer je tekst zakucan latinicom).

### 3.8 Sitno
- `public/manifest.webmanifest` — `name`/`description`/`lang` fiksno srpski (ime PWA na telefonu)
- Metapodaci: samo **5 od 30** `page.tsx` u `(app)` ima `metadata` (javne stranice su pokrivene)
- `src/lib/validacija.ts` — pravila za pseudonim, srpski
- `src/lib/protokol/nadzor-integriteta.ts` — ~12 opisa rizika (upisuju se u bazu; vidi §6, izuzetak)

---

## 4. Šta se dodaje za `ru`

### 4.1 Mehanički deo (presedan: commit `b0604ad`)

| # | Fajl | Izmena |
|---|---|---|
| 1 | `messages/ru.json` | **2.277 ključeva** (1.892 prevedena + 385 admin, vidi ⚠️) |
| 2 | `src/lib/faq-data-ru.ts` | **71 pitanje** |
| 3 | `src/lib/faq-data.ts` | grana `if (locale === "ru") return FAQ_SEKCIJE_RU;` |
| 4 | `src/i18n/routing.ts` | dodati `"ru"` u `locales` |
| 5 | `src/app/api/profil/jezik/route.ts` | dodati `"ru"` u `JEZICI` |
| 6 | `src/components/JezikSvitcer.tsx` | dodati stavku |
| 7 | `public/flags/ru.svg` | nova zastavica |
| 8 | `scripts/check-i18n-parity.mjs` | `CILJEVI = ["en", "ru"]` |
| 9 | `src/lib/seo.ts` | `OG_LOCALE.ru = "ru_RU"` |
| 10 | `src/lib/pravni-dokument.ts` | generalizovati — sada zna **samo za `en`** |
| 11 | `dokumentacija 4.0/ru/` | 15 dokumenata |

> ⚠️ **Admin panel i paritet.** `npm run i18n:check` traži **tačno** iste ključeve u
> `ru.json` kao u `sr.json` — ni manje ni više. Pošto admin (385 ključeva) ostaje
> srpski (odluka #2), u `ru.json` za namespace `admin` ide **prepisan srpski tekst**.
> Paritet ostaje strog (guard rail se ne slabi), admin ostaje srpski.
> **NE dodavati izuzetke u parity skriptu** — time bi se izgubila zaštita od
> zaboravljenih ključeva u ostalim namespace-ovima.

### 4.2 Obim prevoda po namespace-u (`sr.json`, 2.277 ključeva)

```
385  admin          ← prepisuje se srpski (odluka #2)
159  pijaca            128  oNama            127  sistem
123  oSistemu          122  profil           100  landing
 85  tablaJemstva       83  kakoFunkcionise   69  pravne
 66  donacije           65  doprinosOglasi    61  krug
 55  glasanje           51  programi          49  zrno
 49  novcanik           47  dobrodosli        44  postaniPokrovitelj
 39  graf               38  verifikacija      36  javneKomponente
 35  registracija       28  common            24  login
 …  (ostalih 18 namespace-a < 21 ključ)
```
**Za stvarni prevod: 1.892 ključa.**

### 4.3 Pravni akti (odluka #3)
15 dokumenata iz `dokumentacija 4.0/` → `dokumentacija 4.0/ru/`, **~62.500 reči**
(EN verzija ima 78.177 — ruski će biti sličan).

**Obavezno na svakom dokumentu:** napomena da je **merodavan srpski original**
(isti presedan kao EN set). Fondacija je upisana po srpskom pravu; akti referišu
srpske propise, APR, PIB i RSD.

Whitepaper je najveći pojedinačni dokument — cepati na delove (EN je cepan na 5).

---

## 5. Fiksirane engleske reči — NE prevode se (odluka #12)

Brojano nad `messages/sr.json`:

| Termin | Pojava |
|---|---|
| `RSD` | 19 |
| `QR` | 14 |
| `AGPL-3.0` | 11 |
| `CC BY-SA 4.0` | 9 |
| `PIB` | 7 |
| `Whitepaper` | 6 |
| `DPIA` | 5 |
| `Google` | 3 |
| `DCO`, `PDF`, `APR` | 1–2 |

**`email`** (29 pojava) — **odluka #14: ostaje „email"**, ne prevodi se u
*электронная почта*. (Razmotreno i odbačeno: Rusi termin normalno pišu ćirilicom,
ali vlasnik je izabrao dosledno pravilo #12.)

---

## 6. Izuzeci — ostaje srpski, namerno

1. **Pseudonimi, oglasi, poruke, Pričaonica** — korisnički sadržaj, nikad se ne prevodi.
2. **Vesti Fondacije (blog)** — odluka #5.
3. **Ugovor o donaciji** (`generisiUgovorTekst()`) — odluka #4; obavezujući dokument
   koji se potpisuje sa srpskom Fondacijom, čuva se u bazi kao `ugovorTekst`.
4. **Cirkularna obaveštenja** — odluka #8.
5. **Admin panel** — odluka #2.
6. **`RSD`** — valuta srpske Fondacije.
7. **PIB, APR, matični broj, brojevi članova akata** — srpski pravni identifikatori.
8. **Audit log** — interni trag za UO, korisnik ga ne vidi.
9. **Admin upozorenja** (`adminAlert.ts`, 26 mesta) — idu isključivo UO.
10. **Nadzor integriteta** (`nadzor-integriteta.ts`) — nalazi vidi samo nadzor/UO.
11. **Interni identifikatori** — slugovi kategorija, enum vrednosti, `banka-singleton`,
    imena ruta. **Prevod ih NE SME dotaći** — menjaju se samo prikazni nazivi.

---

## 6a. Urađeno u fazi 1 (2026-08-05)

| Fajl | Izmena |
|---|---|
| `messages/ru.json` | **nosač** — kopija `sr.json` (2.277 ključeva). Puni se u fazi 4. |
| `public/flags/ru.svg` | zastavica |
| `src/i18n/routing.ts` | `"ru"` dodat u `locales` |
| `src/app/api/profil/jezik/route.ts` | `"ru"` dodat u `JEZICI` |
| `scripts/check-i18n-parity.mjs` | `CILJEVI = ["en", "ru"]` |
| `src/lib/seo.ts` | `OG_LOCALE.ru = "ru_RU"` |
| `src/app/layout.tsx` | ćirilični font za `sr-Cyrl` **i** `ru` (§3.6) |
| `src/lib/pravni-dokument.ts` | generalizovan na mapu `PREVEDENI` umesto tvrdog `if (locale === "en")` |
| `src/components/JezikSvitcer.tsx` | stavka dodata **zakomentarisana** |

**Zašto je `ru.json` kopija, a ne prazan fajl:** da mašinerija radi i da provera
pariteta čuva fajl od faze 1 — svaki nov ključ u `sr.json` odmah pada na `i18n:check`,
umesto da se otkrije tek pri prevodu.

**Zašto ruski NIJE u prekidaču:** dok je `ru.json` kopija, izbor „ru" bi prikazao
srpski tekst. Aktivacija na kraju faze 4 = odkomentarisati jedan red u `JezikSvitcer.tsx`.

**Provereno:** `npm run i18n:check` ✅ · `npm test` 360/360 ✅ · `npm run build` ✅
(jedino upozorenje: sitemap ne može do baze u kontejneru — nevezano za izmene).

---

## 7. Predložen redosled faza

Svaka faza = svoj commit. Faze 1–3 su priprema koda; prevod počinje od faze 4.

| Faza | Sadržaj | Zavisi od |
|---|---|---|
| **1** ✅ | Mehanika jezika: routing, `/api/profil/jezik`, zastavica, parity, `seo.ts`, **font (§3.6)**, loader pravnih akata | — |
| **2** | Izvlačenje zakucanog teksta iz ekrana (§3.1) → `sr.json` naraste | — |
| **3** | Datumi/brojevi helper (§3.5) | — |
| **4** | `messages/ru.json` — prevod 1.892 ključa + prepis admina | 1, 2 |
| **5** | `faq-data-ru.ts` — 71 pitanje | 1 |
| **6** | Obaveštenja: ključ+parametri, `User.jezik`, mejl A i B (§3.3) | 4 |
| **7** | Istorija transakcija: novi upis + **migracija** (§3.4) | 4 |
| **8** | Poruke o greškama iz API-ja (§3.2) — po oblastima | 4 |
| **9** | Pravni akti `dokumentacija 4.0/ru/` (§4.3) + loader (§4.1 #10) | 1 |
| **10** | Sitno: OG slika, manifest, metadata `(app)`, validacija (§3.7, §3.8) | 4 |

**Provera posle svake faze:** `npm run i18n:check` (paritet) i `npm test` (Vitest).

---

## 8. Poznati rizici

- 🔴 **Rutiranje.** Ne dodavati URL prefiks (`/ru/`) bez restrukturacije u
  `src/app/[locale]/`. To je jednom već oborilo **ceo sajt u runtime-u dok je build
  prolazio** — vidi INCIDENT u `docs/i18n-engleski-plan.md`. Odluka #13: ne sada.
- 🔴 **SEO.** Bez `/ru/` URL-a Google ne može da indeksira rusku verziju;
  `hreflangAlternates()` namerno vraća prazno. Isti kompromis kao za engleski.
- 🟡 **Pravni rizik.** Prevod akata bez ruskog pravnika — disklejmer „merodavan
  srpski original" ublažava, ne uklanja.
- 🟡 **Migracija istorije transakcija** (§3.4) dira žive podatke. Testirati na test
  bazi (`main`) pre objave. Migracije se primenjuju automatski pri deploy-u.
- 🟡 **Cirkularna obaveštenja** ostaju srpska — vidi obrazloženje uz odluku #8.

---

## 6b. Urađeno u fazi 2 i 3 (2026-08-05)

### Pre faza — očišćeno 125 mrtvih ključeva
Skeniranje svih ključeva protiv stvarne upotrebe (dinamički pozivi detektovani po
fajlu i izuzeti). Ostaci uklonjenih funkcija: LK/JMBG verifikacija (18), jedinica
mere + tok kupovine na Pijaci (23), zastareli linkovi u `sistem`/`zrno` (58), i dr.
**Obim prevoda pao sa 2.277 na 2.152 ključa.**

### Faza 2 — izvučen zakucan tekst (58 novih ključeva)
Ekrani bez i18n: ceo tok verifikacije (`VerifikujNekoga`, `MojQrKod`, `QrSkener`,
`MiniStablo`, `IndeksPrikaz`, `MojeOznake`), `CookieConsent`, `oauth/dovrsi`.
Engleski preveden odmah; ruski čeka fazu 4.

`MiniStablo` je imao srpske podrazumevane tekstove koje **nijedan pozivalac ne
prosleđuje** — sada padaju na prevod, uz zadržanu mogućnost nadjačavanja.

### Faza 3 — formatiranje po jeziku
Nov `src/lib/format.ts` (`intlTag`, `fmtBroj`, `fmtDatum`, `fmtDatumVreme`).
Svih 178 poziva u ekranima prebačeno sa zakucanog `"sr-RS"` na aktivni jezik.

> 🟢 **Usput ispravljen postojeći bug:** `toLocaleDateString("sr-RS")` vraća
> **ćirilične** nazive meseci („05. август 2026.") — i latiničnim korisnicima.
> Mapa u `format.ts` eksplicitno navodi pismo (`sr-Latn-RS`), pa latinica sada
> dobija „05. avgust 2026.". Englezi su do sada takođe videli srpski format.

**Namerno NIJE dirano:**
- `normalizujLokaciju` (`SistemKlijent`) — `toLocaleLowerCase` se koristi za
  **grupisanje** lokacija, ne za prikaz. Fiksiran na `sr-Latn-RS`: da zavisi od
  jezika posmatrača, isti gradovi bi se različito grupisali Srbinu i Rusu.
- **API rute i `src/lib/protokol/*`** (~30 poziva) — tamo se broj upisuje u tekst
  obaveštenja i u `Transaction.description`, tj. **u bazu**. To se rešava u
  fazama 6 i 7, kad tekst postane ključ + parametri; formatiranje se tada radi
  pri prikazu, na jeziku posmatrača.

**Provereno:** `tsc` čist · `i18n:check` OK · `npm test` 360/360 · build prolazi.


---

## 6c. Faza 10 (delimično) i faza 6 (infrastruktura) — 2026-08-05

### Faza 10 — manifest da, OG slika NE (i to je tačan zaključak)
`public/manifest.webmanifest` je postao ruta (`src/app/manifest.webmanifest/route.ts`)
i sada daje opis na jeziku korisnika — manifest traži **pregledač**, koji šalje
kolačić `NEXT_LOCALE`.

🔴 **OG slika ostaje srpska — trajno, ne kao dug.** Plan je tražio da se lokalizuje
i da joj se doda ćirilični font. To **nije izvodljivo i nema smisla**: OG sliku
povlače pauci društvenih mreža (Facebook, Twitter), koji **ne šalju kolačić** —
strana ne može da zna jezik posmatrača. Uz `localePrefix: "never"` (odluka #13)
postoji tačno jedna OG slika za sve jezike. Stavku brisati iz plana, ne prenositi
dalje. (Font bez ćirilice zato takođe nije problem.)

### Faza 6 — infrastruktura gotova, pozivna mesta 4/29
**Urađeno:**
- Migracija `20260805120000_notifikacija_kljuc` — `Notifikacija.kljuc` + `parametri`.
  Postojeći redovi ostaju netaknuti (`kljuc = NULL`) i prikazuju se iz `naslov`/`tekst`;
  **nema backfill-a i nema rizika po istoriju.**
- `src/lib/prevod-servera.ts` — `prevedi(locale, kljuc, parametri, rezerva)`.
  Namerno **ne koristi** `getTranslations`: mejl i push idu kao `void` posle
  odgovora, kad kontekst zahteva više ne postoji, a jezik se čita iz baze.
  Brojevi se formatiraju po jeziku primaoca, `sr-Cyrl` ide kroz `lat2cyr`.
- `obavesti()` u `notifikacije.ts` — ključ + parametri; `posaljiNotifikaciju()`
  **ostaje i radi**, pa nekonvertovana mesta ne pucaju.
- `/api/notifikacije` prevodi zvonce na jeziku **posmatrača**; mejl i push idu na
  jeziku **iz naloga** (`User.jezik` — polje koje do sada niko nije čitao).

**Provereno kraj-do-kraja:**
```
sr : Marko je upisao/la 12.345 POEN u tvoju evidenciju. Poruka: „hvala”
en : Marko recorded 12,345 POEN in your ledger. Message: “hvala”
cyr: Уписано ти је 12.345 ПОЕН
```

**Konvertovano (4/29):** transfer POEN-a, prigovor (rešen/odbijen), program
odobren, program odbijen.

**Ostaje 25 pozivnih mesta.** Obrazac je dokazan i mehanički — svako mesto:
`posaljiNotifikaciju(id, tip, naslov, tekst, link)` → `obavesti(id, {tip, kljuc,
parametri, naslov, tekst, link})` + dva ključa u `messages/*.json`
(`<kljuc>_naslov`, `<kljuc>_tekst`).

> **Pravilo naučeno usput:** tekst koji **čovek otkuca** (obrazloženje UO na
> prigovor, razlog odbijanja) NE dobija ključ — to je autorski sadržaj i ide kako
> je napisan. Ključ dobija samo standardna rečenica sistema.

---

## 6d. Faza 7 — istorija transakcija (2026-08-05)

Isti problem kao obaveštenja: `emitujPoen` je upisivao **gotovu srpsku rečenicu**
u `Transaction.description`, pa nije imalo šta da se prevede.

- Migracija `20260805130000_transakcija_opis_kljuc` — `opisKljuc` + `opisParametri`,
  **plus retroaktivni backfill** (odluka #10) koji prepoznaje devet oblika koje je
  kod do sada upisivao.
- `emitujPoen(..., opis?: {kljuc, parametri})`; svih 8 fajlova sa pozivima prebačeno.
- `/api/novcanik/transakcije` prevodi opis na jeziku posmatrača.

> ✅ **Migracija je PROBANA na pravom PostgreSQL-u** (16.13, lokalna instanca),
> nad uzorkom sa svih devet oblika + jednim nepoznatim. Svih devet prepoznato
> tačno; nepoznat opis ostaje `opisKljuc = NULL` i prikazuje se kao i pre —
> **namerno, jer je pogrešno protumačen opis gori od neprevedenog.**
> Ovo je bilo obavezno: migracije se primenjuju u `buildCommand`, pa bi greška u
> SQL-u oborila deploy.

**Poznato ograničenje:** iznos u starim redovima (`Bonus za donaciju iznos 5.000`)
backfill hvata kao **tekst**, ne broj — već je formatiran srpski i ne preračunava se.
Nove stavke prosleđuju sirov broj i formatiraju se po jeziku. Ispravljanje starih
tražilo bi parsiranje srpskog formata, što nosi rizik bez stvarne koristi.


---

## 6e. Faza 6 dovršena (2026-08-05)

Svih 29 pozivnih mesta obrađeno: **27 konvertovano**, 2 namerno ostavljena srpska.

**Namerno NIJE konvertovano:**
- `nadzor-integriteta.ts` — nalaz vidi samo nadzor/UO (izuzetak §6.10).
- `admin/prigovori` kad UO **otkuca obrazloženje** — autorski tekst ide kako je
  napisan. Bez obrazloženja standardna rečenica jeste prevodiva.

**Nova konvencija — ugnežđen ključ (`@`).** Parametar čija vrednost počinje sa `@`
sam je ključ i prevodi se rekurzivno:
```ts
parametri: { kategorija: `@pijaca.kategorija_${kategorijaKljuc(slug)}` }
```
Bez toga bi u rusku rečenicu ušao **srpski naziv kategorije**. Provereno:
```
sr : „Med” je objavljeno u kategoriji „Hrana i piće”, koju pratiš na Pijaci.
en : “Med” was posted in the “Food & drink” category, which you follow on the Market.
cyr: „Мед” је објављено у категорији „Храна и пиће”, коју пратиш на Пијаци.
```

Ukupno **68 novih ključeva** u `notifikacije.*` (sr + en).


---

## 6f. Faza 8 — poruke o greškama (2026-08-05)

**Plan je predviđao veći zahvat nego što je bio potreban.** Prvobitna zamisao:
server vraća ključ, klijent ga prevodi — što traži izmene i na svim ekranima.

Ispalo je da to nije potrebno: **API rute su u kontekstu zahteva i nose kolačić
`NEXT_LOCALE`**, pa server može sam da prevede poruku. Nijedan ekran nije diran.

**Srpski tekst je ujedno ključ.** `kljucGreske()` iz rečenice izvodi
deterministički ključ (`"Nedovoljno POEN-a."` → `nedovoljno_poen_a`), pa:
- pozivna mesta ostaju čitljiva — piše se rečenica, ne šifra;
- nema ručnog imenovanja ključeva ni mogućnosti da se ime i tekst razmimoiđu;
- ako prevod nedostaje, vraća se srpski original — ruta nikad ne puca.

**Obim:** 601 poziv `greska()` u 152 fajla; **0 preostalih neprevodivih puteva.**
`messages.greske` ima **277** stavki. Obuhvaćene su i poruke iz izuzetaka
(`e.message`) i iz čuvara koji vraćaju `{ ok:false, error, status }`.

> Sudar ključeva: samo `"Neautorizovano"` i `"Neautorizovano."` daju isti ključ —
> ista poruka, pa spajanje **ujednačava rečnik grešaka** umesto da šteti.

🟡 **Vrednosti su za sada srpske u sva tri jezika** — prevod ide u fazi 4 zajedno
sa ostatkom. Engleski korisnici time ne gube ništa: i do sada su viđali srpske
poruke o greškama.


---

## 6g. Faza 4 — stanje prevoda (2026-08-05)

**Prevedeno 1.309 od 2.203 ključeva (59%).** `admin` (380) se po odluci #2 ne
prevodi — u `ru.json` stoji prepisan srpski, pa paritet ostaje strog.

**Gotovo:** ceo rečnik grešaka (277), obaveštenja (70), Pijaca (136), profil (122),
Sistem (94), tabla jemstva (85), verifikacija (66), novčanik (44), graf (39),
javne komponente (36), programi (51), ZRNO (24), i celo jezgro (prijava,
registracija, zaglavlje, navigacija, poruke, mejlovi, kolačići…).

**Ostaje:** prezentacione stranice (`oNama`, `oSistemu`, `landing`,
`kakoFunkcionisePage`, `pravne`) i app ekrani (`donacije`, `doprinosOglasi`,
`krug`, `glasanje`, `dobrodosli`, `postaniPokrovitelj`, dve manje stranice).

### Rečnik — držati doslednim u nastavku

| Srpski | Ruski |
|---|---|
| POEN · ZRNO · KOLO | **ПОЕН · ЗРНО · КОЛО** (ćirilicom, odluka #1) |
| Pijaca | Рынок |
| Novčanik | Кошелёк |
| Pričaonica | Беседка |
| Tabla jemstva | Доска поручительства |
| Lanac jemstva | Цепь поручительства |
| Indeks stvarnosti | Индекс реальности |
| Verifikacija / verifikator | Верификация / поручитель |
| Krug | Круг |
| Fondacija | Фонд |
| Gornje Kolo | Верхнее Коло |
| Prigovor | Возражение |
| Oglas | Объявление |
| Doprinos | Вклад |
| Evidencija / evidentirano | Учёт / учтено |
| Osnivački doprinos | Учредительный вклад |
| Pokrovitelj | Покровитель |
| Nosilac ZRNA | Держатель ЗРНА |
| Zadruga | Кооператив |
| email | **email** (ne prevodi se, odluka #14) |
| RSD, PIB, QR, Whitepaper | ne prevode se (odluka #12) |
