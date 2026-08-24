# KOLO Platforma — uputstvo za rad

Ovo je **operativno uputstvo**: pravila koja i dalje važe. Bez istorije odluka.
Zašto je nešto tako odlučeno → `docs/CLAUDE-arhiva-2026-08-24.md` (pun dnevnik do 24.08.2026).
Šta sistem jeste (pojmovi, jedinice, akteri) → `dokumentacija 4.1/Claude_context.md`.

---

## 1. Deploy i grane — OBAVEZNO

Vercel **Production Branch = `production`**. Jedan projekat `kolo`
(`prj_xVaJlVaSzPl7rYnF1lM4WXwE6Y8m`, team `team_YswkbIApgJlmqdQLJJu8SLDE`) gradi obe grane.

| Grana | Target | URL | Baza (Neon) |
|---|---|---|---|
| **`main`** | preview = TEST | **kolo-peach.vercel.app** (ili `kolo-git-main-alvaserbia-progs-projects.vercel.app`) | test `ep-old-sky-aleg2alm` |
| **`production`** | production = UŽIVO | **ekolo.rs** / www.ekolo.rs | prod `ep-empty-forest-alajuasx` |

**Mapiranje komandi vlasnika** (vlasnik ne barata gitom):
- „pošalji na test" → commit + push na **`main`**.
- „objavi na ekolo.rs" → merge `main` → `production` + push. **Nikad bez izričitog naloga.**

**Pravila:**
- Podrazumevano se radi i gura na **`main`**.
- **Posle puša NE proveravati Vercel buildove.** Push je kraj posla — javi šta je gurnuto i na koju granu, i stani. Buildove proveravati samo kad vlasnik pita, ili kad promena realno može da obori build (migracija, `vercel.json`, `package.json`, nova env varijabla).
- Lokalni `main` u remote kontejneru ume da bude zastareo → uvek `git fetch origin main` i poredi sa **`origin/main`**.
- Za proveru sveže promene na testu koristiti **incognito** (CDN keš).

🔴 **NIKAD ne povlačiti tuđe izmene na `main` ni `production`.** Guraju se isključivo sopstvene izmene iz tekuće sesije — bez merge-a, cherry-pick-a i rebase-a tuđih grana, PR-ova i „zalutalih" commit-a, i kad deluju gotovo. Naiđeš li na tuđe commit-e, prijavi vlasniku i čekaj odobrenje. Merge `main` → `production` pri objavi je jedini dozvoljen merge.

---

## 2. Migracije

`vercel.json` → `buildCommand`: `if [ -n "$DATABASE_URL" ]; then prisma migrate deploy; fi && npm run build`.
Migracije se primenjuju **same** na bazu okruženja. Nema ručnog `migrate deploy`.

- `prisma.config.ts` skida `-pooler` iz `DATABASE_URL` za CLI — `migrate deploy` uzima advisory lock koji ne radi kroz Neon pooler (**P1002**, obara build). Runtime (`@prisma/adapter-pg`) i dalje koristi pooled URL.
- Neuspela migracija **glasno** obara build; prethodni deploy ostaje živ.

🔴 **Primenjena migracija se NE dira.** `migrate deploy` ne proverava kontrolni zbir već primenjenih migracija — izmenjen fajl se **tiho preskoči**, bez greške, i deploy prođe READY dok posao nije urađen. Svaka izmena posle prvog deploy-a ide u **NOV fajl**. Provera pre puša:
`git log --oneline -- prisma/migrations/<ime>/` — više od jednog commita znači da je verovatno već primenjena.

🔴 **Nova enum vrednost ide u ZASEBAN fajl** od migracije koja je koristi — Postgres ne dozvoljava `ALTER TYPE … ADD VALUE` i upotrebu te vrednosti u istoj transakciji. (`RENAME VALUE` jeste transakciono bezbedan.)

🟡 **Grana i `main` se ne guraju u istoj minuti** — dva Preview builda sa istim `DATABASE_URL` se sudaraju na hladnom Neon startu (`db_unreachable`).

---

## 3. Prekidači modula — `src/lib/moduli.ts`

Jedan fajl, bez ijednog `import`-a (uvoze ga i serverske i klijentske komponente).
Gašenje = `false`, povratak = `true`, bez ijedne dalje izmene.

| Prekidač | Stanje | Napomena |
|---|---|---|
| `KRUG_AKTIVAN` | **`false`** | Krugovi nisu u radu (Pravilnik Glava VIII, čl. 54 daje osnov). |
| `POKROVITELJSTVO_AKTIVNO` | **`true`** | Vraćeno 18.08.2026. |
| `MODUL_DECA_AKTIVAN` | **`true`** | 🔴 Upaljen radi provere **na testu**. MORA nazad na `false` pre objave na ekolo.rs, dok vlasnik izričito ne kaže da modul ide u rad. |
| `PRISTANAK_NA_AKTE_TRAZI_SE` | **`false`** | Ekran „novi akti" se ne prikazuje. |

**Šta prekidač radi:** stranice `notFound()` (404), API rute **410 Gone** (`PORUKA_MODUL_UGASEN` kroz `greska()`), nav stavke / admin tabovi / kartice / FAQ pitanja se ne renderuju.

🔴 **Ne brisati tabele, podatke ni migracije ugašenog modula.** `Krug` ima sopstveni `Wallet` čiji balans ulazi u opticaj — brisanje redova obara zero-sum i pomera pragove osnivačkog koraka. Iz istog razloga ostaju enum vrednosti koje nose istorijske transakcije (`WalletType.KRUG`, `EMISIJA_KRUG_*`, `EMISIJA_POKROVITELJ`).

**FAQ se filtrira u `FaqStranica.tsx`, ne u `getFaqSekcije()`** — `__tests__/faq-paritet.test.ts` poredi identitet nizova i pun izvorni set. Sakrivena pitanja su u `FAQ_SAKRIVENA_PITANJA`. Ko doda pitanje u sekciju „Deca i roditelji", dopisuje mu broj i tamo.

🔴 **Brane koje sakrivaju maloletne naloge iz javnih upita rade BEZ OBZIRA na prekidač.**

---

## 4. Fundamentalna pravila sistema

1. **Zero-sum:** zbir svih računa (uključujući Protokol) = 0. Protokol ide u minus pri svakoj emisiji. Provera je automatska u `emitujPoen()` u dev modu + noćni cron `/api/cron/zero-sum`.
2. **POEN i ZRNO su celi brojevi** (INTEGER). Decimalni su samo obračunski koeficijent ZRNA (`DECIMAL(20,2)`, u kodu još „kurs") i RSD (`DECIMAL(12,2)`).
3. **Nema negativnog stanja** — osim četiri izuzetka, vidi §5.
4. **Upis ≠ prepis.** *Upis* = POEN nastaje kroz kanal iz čl. 15 (Protokol u minus, ukupan broj raste). *Prepis* = seoba zapisa između dva korisnika, zbir isti, bez provizije. Pravni tekst kaže „ažuriranje evidencije"; UI kaže **„Prepiši POEN"**.
5. **Obračunski period:** ponoć do ponoći po **srpskom** vremenu (`protokol/obracunski-dan.ts` — serveri su UTC, cron u 22:00 UTC). Grupne operacije (ZRNO, delegacije, programi) izvršavaju se u ponoć istog perioda.
6. **Pseudonimi:** nigde u javnom interfejsu pravo ime. Fondacija ne poseduje centralizovanu vezu pseudonim↔identitet. Pseudonim u evidenciji doprinosa vide samo verifikovani; **izuzetak** je pseudonim oglašivača na Pijaci (javan, čl. 16).
7. **Dnevni limit Programa Protokola:** 10% opticaja (`Math.floor(opticaj * 0.1)`, `programi.ts`). Odnosi se **samo** na operativni doprinos i socijalne programe.
8. **Devet kanala evidentiranja** (Pravilnik čl. 15):
   - *U dnevnom limitu:* operativni doprinos, socijalni programi.
   - *Van limita (automatski akt Protokola):* verifikacija u lancu potvrda, donacije, pokroviteljstvo, rast kolektivnih oblika, osnivački doprinos, doprinos sadržaju platforme (čl. 40a), doprinos dece u dečjem prostoru (t. 9).
9. **Gradirana vidljivost:**
   - *Gost* — agregati + pregled oglasa (sadržaj, cena, lokacija, pseudonim oglašivača).
   - *Nov član (NEVERIFIKOVAN)* — iznosi/vremena bez pseudonima, svoje notifikacije, **objava PONUDE** (najviše 3, uz sadržinski minimum), **odgovaranje** u razgovoru koji je pokrenuo verifikovani. U prepisu POEN-a učestvuje **samo kao primalac**.
   - *Redovan član (indeks ≥ 10%)* — pun pristup.

### Ključne konstante (izvor istine je kod, ne ovaj fajl)

| Vrednost | Konstanta | Fajl |
|---|---|---|
| Verifikacija = +10 p.p., raspon 0–100 | `PRIRAST_INDEKSA_PO_VERIFIKACIJI`, `MAX_INDEKS` | `protokol/dokaz-stvarnosti.ts` |
| Funkcionalni prag pristupa = 10% | `FUNKCIONALNI_PRAG_INDEKSA` | isto |
| POEN pri verifikaciji: 1000 / 1000 / 500 | `POEN_VERIFIKATOR`, `POEN_VERIFIKOVANI`, `POEN_NADZORNIK` | isto |
| Jednokratni kod važi 24h | `TOKEN_VAZI_SEKUNDI` | isto |
| Prelazno ograničenje: 1 primljena do 100.000 opticaja | `PRELAZNI_OPTICAJ_PRAG`, `PRELAZNI_MAX_PRIMLJENIH` | isto |
| ZRNO ukupno 1.000.000; min. upis 20.000 POEN | `UKUPNO_ZRNA`, `MINIMUM_POEN_ZA_UPIS_ZRNA` | `protokol/zrno.ts` |
| Osnivački: 100 × 24.000, prag na svakih 100.000 | `ITERATION_LIMIT`, `KORAK_IZNOS`, `PRAG_SKOK` | `protokol/osnivacki.ts` |
| Faza 1 → Faza 2 na 1.000.000 POEN | `PRAG_FAZE_2_POEN` | `protokol/faza-sistema.ts` |
| Doprinos sadržaju 1.000; najviše 3 aktivna oglasa | `IZNOS`, `MAX_AKTIVNIH_OGLASA` | `doprinos-pravila.ts` |
| Lestvica razmene: koraci 1–5, prag 1.000 po transakciji | `PRVI_KORAK`, `POSLEDNJI_KORAK`, `MIN_IZNOS_TRANSAKCIJE` | `doprinos-razmeni-pravila.ts` |
| Deca: 7–18 god., prijateljstvo 500 POEN, QR 5 min | `UZRAST_MIN`, `PRIJATELJSTVO_POEN`, `TOKEN_VAZI_SEKUNDI` | `deca-pravila.ts` |
| Poziv roditelju 7 dana; preuzimanje 14 dana | `ROK_TOKENA_DANA`, `ROK_PREUZIMANJA_DANA` | isto |

Glasačka moć = `Math.floor(Math.sqrt(aktivno))` (kvadratno, Pravilnik čl. 46).

---

## 5. 🔴 Negativan zapis POEN-a — ČETIRI izuzetka

Pravilnik čl. 14 st. 3 zabranjuje negativan zapis. U **kodu** izuzetaka ima četiri:

| # | Izuzetak | Kod | Akt |
|---|---|---|---|
| 1 | **Nadoknada** posle utvrđene lažne potvrde — u minus ide samo verifikator | `protokol/nadoknada.ts` | ✅ dokaz stvarnosti čl. 20b |
| 2 | **Poništen prepis** po prijavi razmene — povraćaj je uvek pun | `protokol/prijava-razmene.ts` | 🔴 **akti ovo ne poznaju** |
| 3 | **Otpis prijateljstva** (raskid, punoletstvo) | `protokol/prijateljstva.ts`, `punoletstvo.ts` | ✅ Pravilnik o učešću dece |
| 4 | **Prevod punoletnog naloga u maloletni** — na obe strane | `protokol/prevod-u-maloletni.ts` | 🟢 svesno bez odredbe (tehnička ispravka uzrasta) |

**Nema zasebne kolone: minus JESTE nadoknada.** `jeNadoknada` / `iznosNadoknade` / `raspolozivo` iz `nadoknada.ts` pokrivaju sva četiri. UI prikazuje `raspolozivo(balance)` (nikad negativno), a nadoknadu kao **zaseban red**, nikad kao „minus stanje". Kome nastane minus — **ide mu obaveštenje**; minus menja šta sme sa zapisom i ne sme da se pojavi bez reči.

🟡 **Slučaj 2 traži pravni osnov pre puštanja u ozbiljan rad:** Uslovi čl. 22 kažu da Fondacija nije strana u razmeni, a nijedan akt joj ne daje ovlašćenje da obori prepis. Do tada je to faktička praksa Fondacije, ne pravo prijavioca.

---

## 6. Kanonska dokumentacija — set **4.3.4**

Folder **`dokumentacija 4.1/`** (ime foldera se ne menja sa verzijom seta).
**16 akata**, svaki na sr + `en/` `ru/` `hr/` `hu/`. **Statut je izuzetak — ostaje 4.1** (`statut_4_1_0.md`, sopstvena numeracija).

`Pravilnik` · `politika` · `uslovi_koriscenja` · `whitepaper` · `DPIA` · `radnje_obrade` · `rizici` · `hijerarhija` · `dokaz_stvarnosti` · `donacije` · `operativni` · `osnivacki` · `programi_podrske` · `gornje_kolo` · `ucesce_dece` — svi sa sufiksom `_4_3_4.md`.

**Pravila za bump seta:**
1. 🔴 **`git fetch origin main` PRE bumpa.** Dokumenta nove verzije moraju nastati iz **najnovije** osnove na `main`-u, ne iz one sa koje je grana krenula. Ta zamka je pukla tri puta.
2. Ceo set ide na isti broj, i kad je akt sadržinski nepromenjen — mešovit set proizvodi unakrsne reference na verziju koja kao dokument ne postoji.
3. **Istorijska pozivanja se NE menjaju blanket zamenom** („do 4.2.1 je važilo…", „Modul 4 aktiviran DPIA v4.3.0") — postala bi neistinita.
4. Posle preimenovanja fajlova proveriti **unutrašnja unakrsna upućivanja** (`grep -rn "v4\.3\.[0-3]" "dokumentacija 4.1/"`).
5. Nema nove `PolitikaVerzija` dok je `PRISTANAK_NA_AKTE_TRAZI_SE = false`.

🔴 **Za prvu izmenu akata POSLE puštanja sistema u rad ide pun postupak:** nov red `PolitikaVerzija`, prekidač na `true`, obaveštenje **bez odlaganja**. Roka od 15 dana **nema** (ukinut setom 4.3.0) — ne vraćati ga ni u kod, ni u copy, ni u komentare. Rok od 15 dana za **prigovor na isključenje** (Uslovi čl. 28) je drugi institut i ostaje.

**Rendering:** loader `src/lib/pravni-dokument.ts` (baza = `dokumentacija 4.1`), bira prevod po locale-u, tih fallback na srpski. Integritet čuva `__tests__/pravni-dokumenti.test.ts`.

Folderi `dokumentacija 3.8/`, `3.9/`, `4.0/`, `nova dokumentacija/` su **istorija**. `docs/` su **interne radne beleške, nisu normativa**.

---

## 7. Terminologija — zaključana testovima

Brane su `__tests__/copy-ukinuto.test.ts` (copy: `messages/*.json`, `faq-data*.ts`) i `__tests__/pravni-dokumenti.test.ts` (akti). Obaraju build.

| Kontekst | Akti / baza / identifikatori | Interfejs (copy) |
|---|---|---|
| Potvrda stvarnosti | „verifikacija", `VerifikacionaVeza`, `/verifikacija` | **„potvrda"**, glagol **„potvrdi"**, stranica **„Potvrde"** |
| Lanac | lanac potvrda (bivši „lanac jemstva") | isto |
| Status | `NEVERIFIKOVAN` / `REGULARNI` / `NOSILAC_ZRNA` | **nov član** / **redovan član** / nosilac ZRNA |
| Prenos POEN-a | „ažuriranje evidencije", `TransactionType.TRANSFER` | **„prepiši"** (sr/hr `prepis`, ru `переписать на`, hu `átírás`, en `re-register`) |
| Ekran novčanika | ruta `/novcanik`, model `Wallet` | **„POEN"** (nikad „novčanik" ni na jednom jeziku) |
| Protokol | `PROTOKOL_WALLET_ID = "banka-singleton"` | „Protokol" |
| Globalna soba | model `ChatMessage` | „Pričaonica" |

🔴 **Imenica za ulogu potvrđivača se NE uvodi** („potvrđivač potvrđuje" muca). Umesto nje: **„tvoj lanac"** (socijalni programi), **„nosilac ZRNA"** (operativni doprinos).
🔴 **Pečat na Pijaci ostaje `BEZ POTVRDE`** — radi zaštitni posao prema kupcu, „NOV" bi rekao nešto drugo.
🔴 **Uz obrazac za prepis stoji definiciona rečenica** (`novcanik.send_napomena`): „Prepis ne stvara nove POEN-e: tvoj zapis se umanjuje za onoliko za koliko se njegov uvećava." Ne uklanjati je.
🔴 **Zamena terminologije ide PO KLJUČU, ne po reči** — „potvrđeno" u sistemu znači još četiri stvari (potvrda donacije, pokroviteljstva, izvršenja zadatka, verifikatorska potvrda programa).
🟡 Pri ukidanju izraza pokriti **sve imenice koje ukinuta reč nosi uz sebe** (ru „цепь" *i* „цепочка", hu „lánc" *i* „gráf") — inače prevod preživi zamenu.

**Gde „jemstvo" OSTAJE:** opis ukinute table u Politici/DPIA/Registru (bez imena se ne vidi koja je obrada prestala), naslov `/tabla-jemstva`, identifikatori (`jeKorenJemstva()`, `ZahtevZaJemstvo`), i obično značenje („Fondacija ne jamči").

---

## 8. Konvencije koda

- **Tech:** Next.js 16 (App Router), React 19, TypeScript, PostgreSQL + Prisma 7 (klijent u `src/generated/prisma/`), NextAuth, Tailwind v4, next-intl.
- **Nema zod, decimal.js ni sličnih** — validacija ručno, `Decimal` → `Number()` pre slanja klijentu.
- **Svaka promena stanja računa ide u `prisma.$transaction()`.**
- 🔴 **`emitujPoen()` otvara sopstvenu transakciju** — ne sme se zvati unutar druge. Obrazac: DB promene u jednoj transakciji → `emitujPoen()` sekvencijalno **van** nje.
- 🔴 **`probajEvidentirati` / `probajNapredovati` idu VAN transakcije i NE bacaju** — verifikacija ni prepis POEN-a ne smeju da padnu zbog sporednog kanala. Prelaz se rezerviše uslovnim `updateMany` pre emisije; ako emisija pukne, red se vraća u `ZABELEZEN`.
- **Zaokruživanje:** emisije `Math.round()`. ZRNO uvek u korist Protokola — `Math.floor()` za ono što korisnik **dobija**, `Math.ceil()` za ono što **plaća**.
- **Route handleri:** `params` je `Promise<{id:string}>`, mora `await params`. API rute na srpskom.
- **Greške:** `greska("Srpska rečenica.", 400)` iz `lib/greska-api.ts` — srpski tekst je ujedno ključ, prevod se izvodi deterministički; nedostaje li prevod, vraća se original.
- **Sesija:** koristiti `sesija()` iz `lib/sesija.ts` (React `cache`, jedan dekod po zahtevu), ne `getServerSession` direktno.
- **Čiste funkcije se drže odvojeno od servisnih.** Obrazac: `src/lib/<tema>-pravila.ts` (bez Prisme — uvozi ih i pretraživač) + `src/lib/protokol/<tema>.ts` (servisne, re-eksportuje pravila, pa server ima jedan ulaz). Tako rade `deca-pravila`, `doprinos-pravila`, `doprinos-razmeni-pravila`, `nadzor-pravila`, `prijava-poruke-pravila`, `razmena-prijava`, `skola`.
- **`lib/dozvole.ts` ne sme da uvozi Prisma client** (koristi ga i edge middleware) — porede se string literali.
- **Mesto/lokacija je uvek naselje iz šifarnika** — `razresiNaselje()` iz `lib/naselje.ts`, i na klijentu i na serveru. Klijent nije poslednja reč.
- **Pseudonim:** `pseudonimLower` se upisuje **isključivo** preko `poljaPseudonima()`/`promeniPseudonim()` iz `lib/pseudonim.ts`. Pretrage po ukucanom imenu idu kroz `gdePseudonim()`. U sve što se **čuva** (link u notifikaciji, mejlu) ide **interni id**, u interfejs `profilHref()`.
- **Pri dodavanju statičke podrute pod `/profil/` dopuniti `REZERVISANI_PSEUDONIMI`** (`lib/validacija.ts`) — statička putanja pobeđuje dinamičku.
- **Slike idu na Cloudflare R2** (`lib/skladiste.ts`); u bazu samo javni URL. Dev fallback na disk za oglase.
- **Fontovi moraju da podržavaju č ć š ž đ.**

---

## 9. Struktura

```
src/app/(app)/     — prijavljene stranice (pocetna, sistem, novcanik, pijaca, zrno, programi,
                     doprinos-oglasi, poruke, profil, glasanje, donacije, verifikacija, nadzor,
                     graf, prijatelji, deca, dobrodosli, bagovi, admin, krug*, postani-pokrovitelj*)
src/app/(public)/  — javne stranice (pravilnik, statut, whitepaper, dpia, radnje-obrade, rizici,
                     privatnost, uslovi, o-nama, o-sistemu, kako-funkcionise, FAQ,
                     zajednicko-dobro, osnivacki-doprinos, pokrovitelji)
src/app/(auth)/    — login, registracija, reset, dete-poziv, potvrdi-email, odjava-obavestenja
src/app/pijaca/    — Pijaca sa SOPSTVENIM layout-om (gost → PublicHeader, prijavljen → AppShell)
src/app/skole/     — ranglista škola, takođe sopstveni layout
src/app/api/       — 204 rute, uklj. 9 cron-ova
src/lib/           — čista pravila, validacije, i18n pomoćne, faq-data
src/lib/protokol/  — logika KOLO Protokola
src/lib/placanje/  — IPS QR (NBS instant) + NestPay (kartice, Intesa/OTP)
prisma/            — schema (76 modela, 45 enuma) i 106 migracija
messages/          — sr, en, ru, hr, hu (+ sr-Cyrl transliteracijom iz sr)
dokumentacija 4.1/ — kanonski set 4.3.4
docs/              — interne radne beleške + arhiva ovog fajla
__tests__/         — vitest
```

**Jezici** (`src/i18n/routing.ts`): `sr` (default, latinica), `sr-Cyrl` (transliteracija), `en`, `ru`, `hr`, `hu`. Bira se **cookie-om `NEXT_LOCALE`, bez URL prefiksa** — prefiks bi tražio restrukturaciju u `app/[locale]/`. `hr` i `hu` su u paritetnoj proveri; ne zamrzavati ih bez izbacivanja iz `scripts/check-i18n-parity.mjs`, inače prestaje da hvata regresiju. FAQ ima sopstveni set po jeziku (`faq-data-<kod>.ts`), nije u `messages/` — pokriva ga `__tests__/faq-paritet.test.ts`.

---

## 10. Biblioteka Protokola — `src/lib/protokol/`

| Fajl | Šta radi |
|---|---|
| `emisija.ts` | `emitujPoen()` + zero-sum validacija |
| `obracunski-dan.ts` | obračunski dan po Europe/Belgrade nad UTC serverom |
| `dokaz-stvarnosti.ts`, `verifikacija-service.ts` | indeks, kapacitet, jednokratni kod, jezgro verifikacije |
| `zona.ts`, `zona-sinhronizacija.ts` | simetrična zabranjena zona; keš `verification_zone`, izvor istine je graf |
| `graf.ts` | radijalni raspored mreže potvrda, deterministički, bez randomizacije |
| `nadzor-service.ts`, `nadzor-pravila.ts` | tri ishoda nadzora, nadzorni predmeti |
| `nadzor-integriteta.ts` | noćni radnik — **samo obeležava** `RizikNalaz`, nikad ne sankcioniše |
| `lazna-verifikacija.ts`, `verifikacije-naloga.ts`, `nadoknada.ts` | poništenje, kaskada kroz nepostojanje, nadoknada |
| `doprinos-sadrzaju.ts` | osmi kanal (čl. 40a) — beleženje vs. evidentiranje |
| `doprinos-razmeni.ts` | lestvica 5 koraka, kapa 5.000 POEN (kapu drži baza, ne kod) |
| `prijava-razmene.ts` | poništenje prepisa po prijavi pošiljaoca |
| `programi.ts`, `program-potvrda.ts` | operativni + socijalni programi, dnevni limit, verifikatorska potvrda |
| `zrno.ts` | upis/otpis, obračunski koeficijent, noćna obrada, `glasackaMoc()` |
| `glasanje.ts` | Gornje Kolo, kvadratno glasanje, registar odluka, veto |
| `osnivacki.ts` | 100 × 24.000, korak automatski na svakih 100.000 opticaja |
| `fondacija.ts` | saldo + zaštitni veto (prag = 3× trošak prethodnog meseca) |
| `faza-sistema.ts` | Faza 1 → 2 na 1.000.000 POEN |
| `donacija.ts`, `pokrovitelj.ts`, `krug.ts` | kanali evidentiranja |
| `deca.ts`, `deca-poziv.ts`, `prijateljstva.ts`, `punoletstvo.ts`, `dete-email.ts` | Modul Deca |
| `prevod-u-maloletni.ts` | ispravka pogrešno unetog uzrasta (samo superadmin) |
| `skole.ts` | ranglista škola; `USLOV_AKTIVNO_DETE` je Prisma prevod `stanjeDeteta()` |
| `pristup.ts` | provere pristupa po statusu/indeksu |

🔴 **`USLOV_AKTIVNO_DETE` (`skole.ts`) i `stanjeDeteta()` (`deca-pravila.ts`) menjaju se ZAJEDNO** — inače u sistemu postoje dve istine o tome šta je aktivno dete.

---

## 11. Testovi i brane

`npm test` (vitest), `npm run test:watch`. 43 fajla u `__tests__/`.

Brane koje **namerno obaraju build** kad se pravilo prekrši:

| Test | Šta čuva |
|---|---|
| `pravni-dokumenti.test.ts` | postojanje svih 16 akata × 5 jezika, doslovne odredbe seta 4.3.4, odsustvo ukinutih instituta, da se reči jednog jezika ne provuku u drugi |
| `copy-ukinuto.test.ts` | terminologija iz §7 na svih 5 jezika |
| `faq-paritet.test.ts` | identitet FAQ nizova po jeziku i pun izvorni set |
| `prevodi-parametri.test.ts` | da placeholderi u prevodima odgovaraju |
| `protokol/osnivacki-koraci.test.ts` | da se osnivački kanal ne samopojačava (snimak opticaja pre petlje) |
| `skola.test.ts` | da se šifre škola ne sudaraju i da se svako mesto razrešava |

`__tests__/integracija/*` traže bazu. Uz kod ide i `npm run i18n:check`.

---

## 12. Otvorene tačke

| # | Šta | Gde |
|---|---|---|
| 1 | 🔴 **Poništen prepis po prijavi razmene nema pravni osnov** — Uslovima treba postupak po prijavi, Pravilniku drugi izuzetak uz čl. 14/16 (uz upućivanje na režim nadoknade iz čl. 20b) | vidi §5 |
| 2 | 🟡 **Gejt za pristanak na akte je isključivo klijentski** — nijedna API ruta ne proverava pristanak. Prihvaćeno: ekran je obaveštenje, ne bezbednosna granica. Zatreba li stvarno zatvaranje, mesto je `proxy.ts`, ne prekrivač | `lib/politika.ts` |
| 3 | 🟡 **Pijaca badge se ne nuluje** — `/pijaca` ima sopstveni layout van `AppShell`-a, pa se „viđeno" `useEffect` nikad ne okine | `src/app/pijaca/layout.tsx` |
| 4 | 🟡 **Docblock `program-potvrda.ts` još traži indeks 100%** — kod od seta 4.3.1 traži 10% (`FUNKCIONALNI_PRAG_INDEKSA`). Komentar je zastareo, ne kod | `protokol/program-potvrda.ts` |
| 5 | 🟡 **Dva zastarela docblock-a o izuzecima od negativnog zapisa** — `razmena-prijava.ts` kaže „ima DVA", izuzetaka je četiri (§5) | `lib/razmena-prijava.ts` |
| 6 | 🟡 **Korak 5 lestvice razmene je zasad nedostižan** (10 sagovornika van kruga). Spušta se na jednom mestu — `PRAG_SAGOVORNIKA_KORAK_5` | `doprinos-razmeni-pravila.ts` |
| 7 | 🟡 **Rate-limiter je in-memory po instanci** — ne deli se između lambdi. Za jaču zaštitu zameniti telo `rateLimit` deljenim store-om | `lib/rate-limit.ts` |
| 8 | 🟡 **Modul plaćanja čeka podatke** — IPS QR i NestPay rade bez konfiguracije (vraćaju „nije konfigurisano"). Pre puštanja: IPS string kroz zvanični NBS validator, NestPay parametri protiv test okruženja banke | `lib/placanje/` |
| 9 | 🟡 **Pre prvog masovnog mejla** domen `ekolo.rs` šalje po nekoliko poruka dnevno — nagli skok obara reputaciju i pogađa reset lozinke. Slati postepeno ili sa poddomena | `lib/sistemsko-obavestenje.ts` |
| 10 | 🔴 **Cirkularna pošta NIJE kanal za bilten** — Politika čl. 8 vezuje Resend za sistemska obaveštenja. Bilten je druga svrha obrade: traži dopunu Politike/DPIA/Registra, novu `PolitikaVerzija` i zaseban pristanak | isto |

**Nisu fokus razvoja** (odluka vlasnika): Zadruga (Glava VIII čl. 56, nikad implementirana), internacionalizacija kao modul, automatizacija raspodele dinarskih sredstava (čl. 51), poseban pravilnik o krugovima (čl. 55).
