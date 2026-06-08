# Plan: Engleska verzija platforme (i18n EN)

> ## ✅ STATUS (2026-06-07): Opseg B u velikoj meri ZAVRŠEN
>
> ### 🛑 INCIDENT + ISPRAVKA (2026-06-08, `3550df6`): URL prefiks ruši sajt
> Faza 0 je uvela `createMiddleware(routing)` sa `localePrefix` PREFIKSOM. next-intl
> prefiks-middleware očekuje **`app/[locale]/` strukturu foldera**; ovaj projekat je
> NEMA (ravno stablo + cookie + transliteracija). Posledica: middleware je rewrite-ovao
> `/` → nepostojeću `[locale]` rutu → **CEO SAJT 404 u runtime-u** (build je prolazio!).
> **Ispravka:** vraćeno na `localePrefix: "never"` (jezik preko `NEXT_LOCALE` cookie-a),
> `proxy.ts` bez next-intl middleware-a, `JezikSvitcer` izlaže EN/HU preko cookie-a,
> hreflang prefiks-alternative ugašene (`hreflangAlternates` → `{}`). **Engleski radi
> preko cookie-a (dugme EN), na ISTOM URL-u — nema `/en/` putanje.**
>
> **POUKA / preduslov za `/en/` URL (SEO):** zahteva premeštanje SVIH ruta pod
> `src/app/[locale]/…` (veliki refaktor) ILI custom rewrite middleware koji mapira
> `/en/*` → ravnu rutu i postavlja next-intl locale preko headera. **Obavezno testirati
> na PREVIEW URL-u grane pre merge-a na `main`** — build koji prolazi NE garantuje runtime.
> Engleska javna/SEO površina je implementirana i gurnuta na granu. Urađeno:
> - **Faza 0 — routing `/en/`** (`d012bf0`): `localePrefix: as-needed`, `proxy.ts` integrisan next-intl middleware + auth/maintenance gate, `navigation.ts`, `JezikSvitcer` (EN/HU izloženi), hreflang + `OG_LOCALE`, `scripts/check-i18n-parity.mjs` + `npm run i18n:check`, sitemap hreflang.
> - **Faza 5 — `User.jezik`** (`ef47e9b`): polje + migracija `20260607120000_user_jezik`, `/api/profil/jezik`, svič upisuje izbor; `src/lib/pravni-dokument.ts` loader.
> - **Faza 4 — pravni dokumenti EN (13/13)** (`ea729a4`,`c89eb90`,`d56e660`,`27e9c3a`): svih 13 renderovanih markdown akata prevedeno u `nova dokumentacija/en/` sa disklejmerom „Serbian prevails" (uklj. Whitepaper 32.865 reči, cepan na 5 delova).
> - **Faza B — pravne stranice** (`e8988ee`): 8 stranica locale-svesno čita EN markdown (fallback sr), chrome i18n (`pravne` namespace), interni linkovi kroz `@/i18n/navigation`.
> - **Faza B — marketing + landing + FAQ** (`24d1fd6`,`9ae6168`,`f5f14db`): landing + 7 javnih stranica + `PublicNav/Header/Footer` i18n; `faq-data-en.ts` (46 pitanja); body o-nama/o-sistemu/kako-funkcionise izvučen (uklj. SVG labele). Paritet **1066 ključeva** sr/en/hu, build zelen (139 stranica).
> - **Faza 7 — metapodaci (title/description) javnih stranica** (`0fcf313`): 17 stranica → `generateMetadata` sa lokalizovanim title/description (EN/HU). Paritet **1098**, build zelen. ✅
>
> **Preostalo / svesno odloženo:** autentifikovana app `(app)/*` ostaje srpska (ćirilica transliteracijom) — van Opsega B; notifikacije/email i18n (polje `User.jezik` spremno, prevod stringova je app-scope); HU prevodi delom popunjeni EN fallback-om gde sadržaj još nije lokalizovan; per-locale canonical je delom aproksimiran (hreflang cross-link je tačan). **Pravni rizik:** EN prevod bez pravnika — disklejmer „Serbian prevails" je na svakom dokumentu (ublažava, ne uklanja).

> **Svrha ovog dokumenta:** durabilni izvršni spec koji preživljava bez obzira na
> kontekst pojedinačne Claude sesije. Velik posao se izvršava **fazu po fazu, svaka
> faza u svežoj sesiji / preko pod-agenata**, svaka pravi svoj commit. Buduća sesija
> čita OVAJ fajl i nastavlja tačno odakle se stalo. Ne oslanjati se na istoriju ćaskanja.
>
> **Grana razvoja:** `claude/cyrillic-version-feasibility-Yrsp3` (po nalogu vlasnika).
> Default push ide na `main` tek po odluci; vidi `CLAUDE.md` „Deploy i grane".

---

## Zaključane odluke vlasnika (2026-06-07)

| Tema | Odluka | Posledica |
|---|---|---|
| **Rutiranje** | **URL prefiks `/en/`** (radi SEO) | middleware, `hreflang`, prolazak kroz interne linkove |
| **Pravni tekst** | **Prevodimo sami (LLM), bez pravnika** | OBAVEZNA napomena „Authoritative version is Serbian" na svakom EN pravnom dokumentu |
| **Notifikacije** | **Na jeziku korisnika** | novo polje `User.jezik` (migracija) + slanje na tom jeziku |

---

## Zatečeno stanje (verifikovano 2026-06-07)

- **next-intl `^4.9.1`**, konfiguracija u `src/i18n/routing.ts` + `src/i18n/request.ts`.
- `routing.ts`: `locales: ["sr", "sr-Cyrl", "en", "hu"]`, `defaultLocale: "sr"`,
  **`localePrefix: "never"`** (jezik se trenutno bira preko cookie `NEXT_LOCALE`, BEZ URL prefiksa).
- `request.ts`: čita `NEXT_LOCALE` cookie; `sr-Cyrl` nema svoj fajl — izvodi se
  **runtime transliteracijom** iz `sr` preko `lat2cyrDeep` (`src/lib/lat2cyr.ts`).
- **NEMA `src/middleware.ts`** (zato što je prefiks „never").
- **`messages/en.json` i `messages/hu.json` već postoje i imaju PUN paritet sa `sr.json`**
  (549/549 leaf ključeva, 0 nedostaje, 0 viška). UI stringovi su već prevedeni — treba ih
  samo **revidirati za kvalitet**, ne praviti od nule.
- Komponente jezika: `src/components/JezikSvitcer.tsx`, `src/components/CirilicaProvider.tsx`,
  `src/components/Header.tsx`.
- **`User` model NEMA polje `jezik`/`locale`** (`prisma/schema.prisma`, model počinje ~L182).
- Pravni dokumenti su **markdown fajlovi**, NE u `messages/*.json`. App ih trenutno rendruje
  iz `nova dokumentacija/` (vidi `CLAUDE.md` „Javne pravne stranice"). To je glavni teret prevoda.

**Zaključak:** posao je manji nego prvobitna procena (UI json je gotov). Pravi preostali rad =
(1) routing prefiks `/en/`, (2) prevod pravnih markdown dokumenata, (3) hardkodovani stringovi
van i18n (API/notifikacije/faq-data), (4) migracija `User.jezik`.

---

## ⚠️ KRITIČAN NALAZ (2026-06-07) — pretpostavka „UI je preveden" NE VAŽI

Ćirilica radi preko **runtime DOM transliteracije** (`CirilicaProvider`, `lat2cyr`):
deterministička mapa slovo-u-slovo, BEZ vađenja stringova. **Engleski to ne može** —
prevod traži stvarni izvučen tekst u i18n.

Verifikovano stanje:
- Samo **15 od 112** `.tsx` fajlova koristi `useTranslations`/`getTranslations`.
- **85 fajlova** ima **~925 linija vidljivog srpskog teksta hardkodovanog u JSX** (van i18n).
- **0 od 17** javnih pravnih stranica koristi i18n (sav sadržaj hardkodovan srpski).
- `messages/en.json` (549 ključeva) pokriva SAMO onih ~15 i18n-iziranih fajlova.

**Posledica:** uska grla NIJE prevod (jeftin), nego **vađenje ~925 linija iz 85 fajlova u i18n**
— veliki mehanički refaktor preko skoro cele aplikacije, sa rizikom build-loma. Ovo je pravi
trošak engleske verzije koji je transliteracioni trik sakrio.

**✅ ODLUKA VLASNIKA (2026-06-07): Opseg B — javna/SEO površina.** I18n-izuje se i prevodi:
landing, sve `(public)/*` stranice, 17 pravnih dokumenata, auth (registracija/login/reset).
Autentifikovana app `(app)/*` ostaje srpska zasad (ćirilica i dalje radi preko transliteracije).

**Izbor opsega (istorija):**
- **Opseg A — Cela aplikacija:** izvući svih ~925 linija iz 85 fajlova + 17 pravnih dokumenata.
  Najpotpunije, ali najveći obim/rizik; ide fajl-po-fajl preko pod-agenata uz build-provere.
- **Opseg B — Samo javna/SEO površina (preporuka):** pošto je `/en/` motivisan SEO-om, izvući i
  prevesti samo javne stranice (landing, `(public)/*`, pravni dokumenti, auth/registracija/login).
  Autentifikovana aplikacija (`(app)/*`) ostaje srpska zasad, i18n-izuje se inkrementalno kasnije.
  Postiže SEO cilj uz daleko manji obim i rizik.

---

## Faze izvršenja

Svaka faza = zasebna sesija/PR. Označi `[x]` kad je gotova i navedi commit hash.

### Faza 0 — Temelji rutiranja `/en/` (mali, izolovan zahvat)
- [ ] `src/i18n/routing.ts`: `localePrefix` strategija za prefiks. Opcija: `"as-needed"`
      (default `sr` bez prefiksa, `en`/`hu`/`sr-Cyrl` sa prefiksom) — zadržava postojeće
      srpske URL-ove netaknute, dodaje `/en/...`. Razmotriti da `sr-Cyrl` ostane cookie-based
      (transliteracija), a samo `en` (i `hu`) dobiju prefiks, ako mešani režim pravi probleme.
- [ ] Dodati `src/middleware.ts` sa `next-intl` middleware (matcher koji zaobilazi `/api`,
      `/_next`, statiku, `/m/`, fajlove sa ekstenzijom).
- [ ] Uskladiti `request.ts` da poštuje `requestLocale` iz prefiksa (već čita `requestLocale`
      pre cookie-a — proveriti da prefiks ima prioritet).
- [ ] `hreflang` alternate linkovi u `<head>` (sr / en / x-default).
- [ ] CI/skripta: provera **paritet ključeva** `sr.json` vs `en.json` vs `hu.json`
      (fail ako neki ključ fali). Mali node skript u `scripts/` + korak u CI.
- [ ] Otključati EN u `JezikSvitcer.tsx` ako je skriven; proveriti da svič menja URL (ne samo cookie).
- **Verifikacija:** `npm run build` prolazi; `/en/pocetna` rendruje EN; `sr` URL-ovi nepromenjeni.

### Faza 1 — Interni linkovi kroz prefiks
- [ ] Zameniti `next/link` `Link` i `useRouter`/`redirect` pozive da koriste **`Link`/`redirect`
      iz `src/i18n/navigation.ts`** (next-intl `createNavigation(routing)`) — automatski dodaje prefiks.
- [ ] Kreirati `src/i18n/navigation.ts` ako ne postoji.
- [ ] Pretražiti hardkodovane apsolutne interne href-ove (`href="/pijaca"` itd.) — pod-agent fan-out.
- **Verifikacija:** klik kroz aplikaciju na `/en/` ostaje u `/en/` prostoru.

### Faza 2 — Revizija kvaliteta `messages/en.json`
- [ ] Pod-agent pregleda `en.json` ključ-po-ključ naspram `sr.json` za prirodnost/terminologiju.
- [ ] **Terminološki rečnik (zaključati):** POEN→POEN, ZRNO→ZRNO (ostaju neprevedeni, interne
      jedinice), Protokol→Protocol, Krug→Circle, Gornje Kolo→Upper Kolo (ili „Upper Circle"?
      ODLUKA potrebna), dokaz stvarnosti→proof of reality, tabla jemstva→guarantee board,
      ažuriranje evidencije→ledger update, obračunski koeficijent→accounting coefficient.
      Upisati finalni rečnik ovde kad se potvrdi.
- **Verifikacija:** nema preostalih srpskih reči u `en.json`; paritet i dalje 549/549.

### Faza 3 — Hardkodovani stringovi van i18n (API/notifikacije/faq)
- [ ] Fan-out pod-agentima: pronaći srpske string literale u `src/app/api/**`,
      `src/lib/notifikacije.ts`, `src/lib/faq-data.ts`, server komponentama.
- [ ] Notifikacije: poruke kroz i18n ključeve umesto inline srpskog (priprema za Fazu 5).
- [ ] `faq-data.ts`: strukturisati za i18n (sr/en varijante) ili preneti u `messages`.
- **Verifikacija:** grep srpskih dijakritika (`č ć š ž đ`) u kodu daje samo komentare/identifikatore.

### Faza 4 — Prevod pravnih dokumenata (NAJVEĆI teret, ~57k reči)
- [ ] **Disklejmer na svakom EN pravnom dokumentu** (vrh fajla):
      „This is an unofficial English translation provided for convenience. The legally
      authoritative version is the Serbian original. In case of any discrepancy, the
      Serbian text prevails." (vlasnik: bez pravnika — disklejmer je obavezan).
- [ ] Izvor prevoda = **kanonski set `dokumentacija 3.8/`** (NE stariji `nova dokumentacija/`),
      ali pažnja: app trenutno rendruje iz `nova dokumentacija/`. Odlučiti:
      (a) re-pointovati app na `dokumentacija 3.8/` PRE prevoda (zaseban zadatak iz `CLAUDE.md`), ili
      (b) prevoditi tekuće renderovane fajlove. **Preporuka: prvo re-point, pa prevod.**
- [ ] Po dokumentu — zaseban pod-agent (Pravilnik je velik, ~82 člana → možda u 2-3 dela):
      Pravilnik, politika, uslovi, statut, whitepaper, DPIA, radnje obrade, rizici,
      hijerarhija, dokaz stvarnosti, donacije, operativni, osnivacki, programi podrske, gornje kolo.
- [ ] Stranice `/(public)/pravilnik`, `/privatnost`, `/uslovi`, ... da biraju EN markdown po locale-u.
- **Verifikacija:** svaki EN dokument ima disklejmer; renderuje se na `/en/...`; struktura članova očuvana.

### Faza 5 — Notifikacije na jeziku korisnika (migracija)
- [ ] Migracija: `User.jezik String @default("sr")` (ili enum). Backfill postojećih na `"sr"`.
- [ ] `JezikSvitcer`/podešavanja profila: upisuju `User.jezik` za prijavljene (ne samo cookie).
- [ ] `src/lib/notifikacije.ts` `posaljiNotifikaciju()`: prima ključ + params, rendruje na
      `korisnik.jezik` (server-side `getTranslations({locale})`).
- **Verifikacija:** korisnik sa `jezik="en"` dobija notifikaciju na engleskom.

### Faza 6 — Email šabloni (reset lozinke, OAuth, itd.)
- [ ] Email tekstovi na jeziku korisnika (`User.jezik`) ili jeziku zahteva za anonimne tokove.
- **Verifikacija:** reset-lozinke email stiže na ispravnom jeziku.

### Faza 7 — SEO/finiš
- [ ] `sitemap` sa EN URL-ovima; `hreflang` potpun; `<html lang>` po locale-u.
- [ ] `metadata` (title/description) lokalizovan po stranici.
- [ ] Provera „bljeska" (FOUC) i `lang` atributa.
- **Verifikacija:** Lighthouse/SEO provera; `og:locale` tačan.

---

## Rizici / otvorena pitanja (odlučiti uz vlasnika kad iskrsne)
- **Pravni rizik:** EN pravni tekst bez pravnika → disklejmer „Serbian prevails" je obavezan na svakom dokumentu (ublažava, ne uklanja rizik).
- **`sr-Cyrl` + prefiks:** mešanje cookie-transliteracije (ćirilica) i URL-prefiksa (en/hu) može
  praviti rubne slučajeve. Ako zakomplikuje — `sr-Cyrl` ostaje cookie-only, prefiks samo za `en`/`hu`.
- **Gornje Kolo prevod** — „Upper Kolo" vs „Upper Circle" (vs ostaviti „Gornje Kolo"). ODLUKA u Fazi 2.
- **`dokumentacija 3.8/` vs `nova dokumentacija/`** — app još rendruje iz `nova dokumentacija/`;
  re-point je preduslov za čist prevod (Faza 4).

## Napomene o izvršenju (kontekst-higijena)
- Mehaničke fan-out pretrage i prevod velikih dokumenata → **pod-agenti** (odvojen kontekst, vraćaju samo rezultat).
- Posle svake faze: commit sa jasnom porukom + ažuriraj `[x]` i commit hash u ovom fajlu.
- Pre poređenja sa `main`: `git fetch origin main`, poredi sa `origin/main` (kontejner ume da bude zastareo).
