# Sveobuhvatni test plan — kolo-platform

> Radni dokument. Inventar svih funkcija, varijabli, ruta i modela koje treba testirati + plan (prioriteti, redosled, predloženi test slučajevi) + preporuka za test bazu.
> Stack: Next.js 16 (App Router), Prisma 7 (`@prisma/adapter-pg`, Neon/Postgres), NextAuth, Vitest 4.
> Legenda: 💰 finansije/POEN · 🛡️ verifikacija/anti-malverzacija/autorizacija · ✅ već pokriveno unit testom.

---

## 0. Preporuka za test bazu (odgovor na „predloži ti")

Trenutno stanje: **svi postojeći testovi su čisti unit testovi** nad pure funkcijama (`src/lib/protokol/*`, `nestpay`, `dozvole`). Nijedan ne dira bazu, nema `vi.mock`. `vitest.config.ts` je minimalan (node env, ručni `@`→`src` alias, bez `setupFiles`). Nema `.env.test`.

**Preporuka: hibrid u tri sloja.**

| Sloj | Šta | Tehnika | Zašto |
|---|---|---|---|
| 1. Unit (zadržati/širiti) | Sva „protokolska matematika": kursevi, pragovi, faze, raspodela, NestPay hash, dozvole, anti-cirkularno | Pure funkcije, bez I/O | Najveći ROI, brzo, nula rizika |
| 2. Integracioni | Atomske `$transaction` (kupi, transfer, emisija), `@unique` constraint-i, idempotencija donacija po `oid`, zatvaranje isteklih predloga, emisioni limiti | **Prava test Neon grana** (branch-from-test po CI ran-u) + `prisma migrate deploy` + truncate/reseed | Mock Prisma bi lažno prolazio baš ono najrizičnije (atomичnost, constraint-e) |
| 3. E2E/rute | Gating, redirect, 403, forme, NestPay povratak | Playwright nad podignutom app instancom + test login helper; mock samo `getServerSession`, NestPay gateway, email | Unit ne hvata autorizaciju na rutama |

**Tvrda zaštita prod-a (obavezno):** `setupFiles` koji **odbija start** ako `DATABASE_URL` sadrži prod host/`ekolo` ili `VERCEL_ENV==="production"`; učitavati isključivo `.env.test`; nikad `.env.prod.local`/`.env.production.local`.

**Koraci uvođenja:** (1) `.env.test` → Neon test grana; (2) `vitest.config.ts`: `setupFiles` + razdvojiti `test:unit` (paralelno) od `test:integration` (`fileParallelism:false`, serijski); (3) skripte `test:unit`/`test:integration`/`test:e2e`; (4) fabrike u `test/factories/*` (createUser+Wallet, createListing…); (5) CI: efemerna Neon grana pre integ., teardown briše granu.

**Zašto NE čisti mock Prisma:** najveći rizici su na granici sa bazom (atomska transakcija, `@unique`, idempotencija). Mock ih simulira i lažno prolazi. Mock zadržati SAMO za `getServerSession`, NestPay gateway i email.

---

## 1. Prioriteti i redosled (po riziku)

**P0 — KRITIČNO (novac + bezbednost, prvo bulletproof):**
1. `nestpay.ts` — hash/anti-tampering/3D provera (čista logika, bezbednosno kritično) ✅ delom
2. `emisija.ts` — **zero-sum invarijanta** (zbir svih balansa = 0); pattern „DB u `$transaction`, `emitujPoen` VAN nje"
3. `/api/donacije/placanje/povratak` — jedina ruta BEZ sesije; HASH + `oid` idempotencija (lažni/dupli callback, pogrešan iznos)
4. `verifikacija-service.ts` + `lazna-verifikacija.ts` + `nadzor-service.ts` — emisija POEN, slotovi, kaskadno poništavanje (dozvoljen minus)
5. Atomske rute: `/api/transfer`, `/api/pijaca/[id]/kupi`, sve `/api/zrno/*` — zero-sum + race uslovi
6. Regresija: `verifikovaniId` više NIJE `@unique` (indeks raste do 100%)

**P1 — VAŽNO (odlučivanje + integritet):**
7. `glasanje.ts` + `zrno.ts` (`razresiGlasackuMoc`, delegiranje) — integritet glasanja
8. `osnivacki.ts` + `fondacija.ts` (veto) + `donacija.ts` + `pokrovitelj.ts` + `programi.ts` — izračuni iznosa
9. `auth.ts` callbacks + `dozvole.ts` — autorizacija ✅ delom
10. Autorizacija na rutama (admin/superadmin/nadzor/verified gating) — 403/redirect

**P2 — POKRIVENOST (ravnomerno ostalo):**
11. Krug, tabla jemstva, poruke/chat, profil/privatnost, javni feed (gradacija vidljivosti)
12. Integritet baze: svi `@@unique`, singletoni, `onDelete` kaskade
13. Smoke javne stranice + SEO noindex na test env

---

## 2. Inventar poslovne logike (`src/lib`) + predloženi testovi

> Globalna invarijanta svuda: `PROTOKOL_WALLET_ID = "banka-singleton"`, zero-sum (Σ balansa = 0).
> ⚠️ Nedoslednost za proveru: `/api/javno/statistike` čita `"protokol-singleton"` dok ostatak koristi `"banka-singleton"`.

### 2.1 P0 — Novac & bezbednost

#### `placanje/nestpay.ts` ✅ (proširiti)
Konstanta: `VALUTA_RSD = "941"`.
| Funkcija | Test slučajevi |
|---|---|
| `nestpayHashVer3` | determinizam; filtriranje `hash`/`encoding` case-insensitive (`HASH`,`Hash`); sortiranje case-insensitive; prazne vrednosti `?? ""` |
| `escapeVal` (privatno, kroz hash) | vrednost sa `\` i `|` zajedno — redosled escape-a (`\`→`\\` pa `|`→`\|`) |
| `verifikujOdgovor` | prazan primljeni hash → false; različite dužine bafera → false (ne baca); konstantno-vreme |
| `uspesnoPlacanje` | mdStatus∈{1,2,3,4} I (Response=approved ILI ProcReturnCode=00); autorizovano bez 3D → false; obrnuto → false; `Response` lowercase |
| `dohvatiNestpayConfig` | nepoznat provajder → null; delimičan env (clientId bez storeKey) → null |
| `pripremiZahtev` | amount `toFixed(2)`; trantype Auth; opcioni email/lang(default sr); hash nad SVIM poljima |
| `placanjeAktivno` | env `PLACANJE_AKTIVNO==="true"` |

#### `protokol/emisija.ts` (P0 — temelj)
| `emitujPoen(toWalletId, amount, type, desc?)` | baca ako `amount<=0`; non-prod poziva `checkZeroSum` (baca ako Σ≠0); Protokol −amount / korisnik +amount; **mora se zvati VAN šire transakcije** (ima sopstvenu) |

#### `protokol/donacija.ts` ✅ (proširiti)
Konstanta: `RANG_TABELA` (11 nivoa, kursevi 1.00→2.00, pragovi 2k…5M).
| `nivoZaKumulativ` | granične vrednosti tačno na pragu (2.000→nivo1); ispod 2.000→{0, 1.00} |
| `izracunajPoenZaDonaciju` | `poen=round(nova×kurs)` kursom NOVOG kumulativa; Math.round na .5 |
| `evidentirajDonaciju` (DB) | baca: user ne postoji / nema wallet / **nije verifikovan**; `existingRecordId`→update vs create; poen=0 (nova=0)→ne emituje |

#### `protokol/verifikacija-service.ts` (P0 — najviše throw-ova)
Klasa `VerifikacijaGreska(msg, status=400)`.
| `generisiTokenZaVerifikaciju` | token 32B hex + 6 cifara, TTL 60s; retry do 5× pri koliziji |
| `izvrsiVerifikaciju` | baca: bez `potvrdaPoznavanja`(400); prazan kod(400); token nepronađen(404); used(409); istekao(410); self(400); ne postoji(404); nema pristup(403); REGULARNI indeks≥100(409); nema slot(409); anti-cirkularno(403). Whitespace u kodu se uklanja; zatvara `zahtevZaJemstvo` AKTIVAN→ZAVRSEN; REGULARNI verifikator `slotoviPotroseni+=1`; lazy-create wallet; **Faza 2 (POEN VAN txn): emisija pukne→500, veza ostaje** |
| `ocistiIstekleTokene` | briše >1h istekle |

#### `protokol/lazna-verifikacija.ts` (P0 — kaskada)
Klasa `LaznaVerifikacijaGreska(msg, status=400)`.
| `ponistiLaznogVerifikatora` (txn 30s) | baca: ne pronađen(404); superadmin(400); BFS kroz podstablo (`obradjeni` set); reverzija 1000/1000/500; **dozvoljen minus** (jedini izuzetak!); nadzornik POEN samo ako `podlezeNadzoru && nadzornikId`; indeks preračun može pasti na 0 ali OSTAJE verifikovan; lažnom `slotoviPotroseni=0` + EXCLUDED; zero-sum očuvan |

#### `protokol/nadzor-service.ts` (P0)
Klasa `NadzorGreska(msg, status=400)`.
| `obaviNadzor` | baca: veza ne postoji(404); `!podlezeNadzoru`(400); već nadzirano(409); nadzornik=verifikator(400); ne postoji(404); `!mozeNadzor`(403); decrement slot, ako<0→reset 0; POEN VAN txn (nema wallet→preskoči warn; pukne→error log) |
| `listajVerifikacijeZaNadzor` / `brojVerifikacijaZaNadzor` | filter: podlezeNadzoru, nadzornikId=null, ne svoje; sort vreme asc |

#### `protokol/zrno.ts` (P0/P1)
Konstante: `UKUPNO_ZRNA=1_000_000`, `MINIMUM_POEN_ZA_UPIS_ZRNA=20_000`, `PROTOKOL_WALLET_ID`.
| `glasackaMoc(aktivno)` | `floor(sqrt(aktivno))`; ≤0→0 |
| `razresiGlasackuMoc` (čisto) | delegirao→0; krug u lancu(`seen`)→nevažeće; tranzitivni lanac sabira moć terminirajući na userId |
| `trendsKurs`/`poslednjiKurs` (DB) | kurs=`\|protokol\|/zrnaUProtokolu`; 0→1; zrnaUProtokolu≤0 edge |
| `izvrsiZrnoOperacije` (txn) | **upis:** nema wallet/balans<20k/zrna≤0/nedovoljno slobodnih→cancel; limit 1% balansa; `poenPlaceno=ceil(zrna×kurs)`; REGULARNI→NOSILAC_ZRNA. **otpis:** nema stanja/slobodno<kol/poen≤0→cancel; ako preostalo≤0 i NOSILAC→nazad REGULARNI. **status** ZAKLJUCAJ/OTKLJUCAJ provere. Greška u 1 op→catch+cancel (ne ruši batch) |
| `izracunajGlasove` (DB) | delegira na `razresiGlasackuMoc` |

### 2.2 P1 — Odlučivanje & iznosi

#### `protokol/glasanje.ts` ✅ (proširiti)
Konstanta: `DANA_PONOVNO_PREDLAGANJE=30`. Klasa `GlasanjeGreska`.
| `normalizujNaslov` | trim+lowercase+kolaps razmaka |
| `granicePeriodaGlasanja` | ponoć N+1 start, deadline N+2; DST/ponoć granice |
| `utvrdiIshod` | za>protiv (izjednačeno=neusvojeno) |
| `fazaPredloga` | CLOSED→ZATVOREN; pre/posle/u toku |
| `postojiSkoroOdbijen` (DB) | neusvojen iste norm. sadržine u 30 dana |
| `zatvoriIstekleIObjaviIshod` (DB) | idempotentno; ODLUKA→ZA_IZVRSENJE, DINARSKA→null |
| `izvrsiOdluku` | samo ZA_IZVRSENJE |
| `odgovoriNaPreporuku` | baca: nevažeći odgovor; obrazloženje<10; nije DINARSKA/CLOSED/usvojena; UO već odgovorio |
| `vetoNaIzvrsenje` | obrazloženje<10; mora ZA_IZVRSENJE |

#### `protokol/osnivacki.ts` ✅ (proširiti)
Konstante: `ITERATION_LIMIT=120`, `KORAK_IZNOS=20_000`, `GORNJA_GRANICA=2_400_000`, `PRAG_SKOK=100_000`.
| `raspodeliKorak` | largest-remainder, Σ=20.000; prazan→[]; 3×(1/3); validacija udela (Σbrojilaca≠imenilac→odbij) |
| `izracunajUkupanPoen`/`dohvatiStatusKanala` (DB) | `\|balance\|`; baca ako kanal neinicijalizovan |
| `proveriIEvidentirajKorak` (DB) | zatvoren→0; nema osnivača→0; skok preko VIŠE pragova odjednom; zatvara na 120; baca ako wallet osnivača ne postoji |

#### `protokol/fondacija.ts` (P1)
Konstanta: `VETO_PRAG_POEN=-1_000_000`.
| `dohvatiSaldoFondacije` | priliv(donacije+pokrovitelj) − odliv(trošak) |
| `azurirajVetoStatus` | baca ako singleton ne postoji; `trajnoUgasen` jednosmerno (ne resetuje se); gašenje traži trošak>0 I saldo≥3×trošak; aktivan ako balans<−1M (strogo `<`, ne na tačno −1M); datum samo na prelazu |

#### `protokol/pokrovitelj.ts` (P1)
Konstanta `NIVOI_POKROVITELJA` (7 nivoa).
| `bonusZaNivo`/`izracunajNivo` | van opsega→0; nivo ne pada (`max`) |
| `evidentirajDoprinos` (txn) | prvi doprinos (0→nivo1); emisija samo bonus>0; skok kumulativa preko više nivoa |
| `potvrdiPrijavu` | baca: ne postoji; status≠POTPISANA |
| `odbijPrijavu` | baca ako već POTVRDJENA/ODBIJENA |
| `generisiUgovorTekst` | snapshot teksta |

#### `protokol/programi.ts` (P1)
Konstanta `KOEF_DECE` (9 vrednosti).
| `danaDoReverifikacije` | POSEBNA_BRIGA→365; SKOLOVANJE→183; ostalo→null |
| `razlogObustaveProgram` | „revizija" (rok) / „indeks" (REGULARNI<100) / null |
| `raspodelaKoeficijent` | `min(1, limit/total)` |
| `izracunajMajke` | po detetu `floor(max(0,2000−god×100)×koef)`; granica god=20 isključeno; god<0 isključeno |
| `izracunajStariji` | <50→0; inače 1000+100×(god−50) |
| `izvrsiNocnuEmisiju` (DB) | limit=10% opticaja; prazna potražnja→koef=1; samo aktivni; PED iz `oglasEvidencija` APPROVED; evidencija uvek→EMITTED (i kad iznos 0, višak se NE prenosi) |

#### `protokol/krug.ts` (P2)
Konstanta `BONUS_PRAGOVI` (10→100k … 500→5M).
| `proveriIEmitujBonusPrag` | uslov **`!==`** tačan broj — skok 9→11 promaši prag 10!; idempotencija `krugBonusLog`; krug/wallet ne postoji→tihi return |

#### `protokol/faza-sistema.ts` (P1)
Konstanta `PRAG_FAZE_2_POEN=1_000_000`.
| `proveriIAktivirajFazu2` | granica tačno 1M (`>=`); jednosmerna aktivacija `zrnoTrziste.isActive` |

#### `protokol/dokaz-stvarnosti.ts` ✅ (čisto, proširiti)
Konstante: `FUNKCIONALNI_PRAG_INDEKSA=10`, `PRIRAST=10`, `MAX_INDEKS=100`, `POEN_VERIFIKATOR/VERIFIKOVANI=1000`, `POEN_NADZORNIK=500`, `TOKEN_VAZI_SEKUNDI=60`, `BESKONACNI_KAPACITET`.
| `izracunajIndeks` | `min(100, broj×10)`; negativan→0 |
| `izracunajKapacitet` | NOSILAC→∞; NEVERIFIKOVAN→0; REGULARNI→`floor(indeks/10)` |
| `raspolozivSlot`/`brojRaspolozivihSlotova` | ∞→true/null |
| `imaPristupVerifikaciji` | REGULARNI→indeks≥10 |
| `proveriAntiCirkularno` | 5 razloga: self, recipročno, ancestor (DFS), descendant, sibling; safety za krug u grafu |

#### `dozvole.ts` ✅ + `auth.ts` (P1)
| `dozvole` | `jeSuperadmin`/`jeAdmin`/`mozeNadzor`/`jeKorenJemstva`; null/undefined ulaz; poredi STRING literale |
| `auth.authorize/signIn/jwt/session` (DB) | MAINTENANCE_MODE blokira; ne-ACTIVE status blokira (oba providera); OAuth novi vs postojeći; session DB re-read + try/catch fallback; memberHash kolizija retry |

### 2.3 P2 — Pomoćni

| Fajl | Test |
|---|---|
| `passwordReset.ts` | `hashToken` SHA-256; `kreirajResetToken` poništava stare TTL 1h; `verifikujResetToken` 3 null uslova (ne postoji/iskorišćen/istekao); bez `RESEND_API_KEY`→tihi return |
| `audit.ts` / `notifikacije.ts` | audit NE baca (hvata); notifikacije BACA |
| `adminAlert.ts` | NIKAD ne baca; bez env→return (mock fetch) |
| `seo.ts` | `IS_PRODUCTION` iz `VERCEL_ENV`; `absoluteUrl`; `pageMetadata` canonical/OG |
| `faq-data.ts` | `poBrojevima` filtrira nepostojeće ID-jeve |
| `naselja-srbije.ts` | dedup + sort (srpska latinica) |

---

## 3. Inventar API ruta (132) — autorizacija & testovi

> Obrasci autorizacije: `getServerSession`+`jeAdmin`/`jeSuperadmin`(403); cron `x-cron-secret`; `verified` gating; `indeks≥10%` (`imaFunkcionalniPristup`).

### Najosetljivije rute (💰+🛡️) — P0
| Ruta | Test |
|---|---|
| `POST/GET /api/donacije/placanje/povratak` | **bez sesije**; verifikuj HASH; idempotencija po `oid` (dupli callback ne emituje dvaput); lažni callback odbijen; pogrešan iznos |
| `POST /api/admin/korisnici/[id]/lazni-verifikator` | superadmin; rekurzivno poništavanje podstabla; vraćanje POEN; dozvoljen minus |
| `/api/admin/doprinos-oglasi/{prijave,evidencija}/[id]/{odobri,odbij}` | **dvostruka autorizacija admin ILI NOSILAC_ZRNA**; konflikt interesa verifikator≠izvršilac≠predlagač |
| `POST /api/transfer` | ceo>0; ne sebi; dovoljno balansa; atomичnost; zero-sum |
| `POST /api/pijaca/[id]/kupi` | ne sopstveni/ne-ACTIVE; balans; **race (konkurentna kupovina)**; SOLD sprečava dupli |
| `POST /api/verifikacija`, `POST /api/nadzor/[id]` | emisija POEN + slot mehanika |
| `POST /api/zrno/*` | upis/otpis/zakljucaj/otkljucaj/delegiraj; verified gating; zero-sum |

### Cron (6) — `CRON_SECRET` (401 bez)
`chat-cistenje`, `gdpr-cistenje`, `nocna-emisija` 💰🛡️, `programi-revizija` 🛡️, `tabla-jemstva-istek`, `zero-sum` 💰. Test: bez secreta→401; zero-sum cron alarmira (500) ako Σ≠0.

### Autorizacioni gating po klasama (P1) — za svaku rutu test 401/403/redirect:
- **superadmin-only:** audit-log, korisnici/* (suspenduj/aktiviraj/iskljuci/admin-rola/lazni-verifikator/eksport), osnivaci/*, politika, glasanje/{izvrsi,veto}, zero-sum, transakcije, emisija/nocna, zrno/nocna
- **admin:** dashboard, krugovi, pokrovitelji, fondacija/trosak, blog, prigovori, programi, donacija, glasanje/odgovor
- **verified:** zrno/*, donacije, pijaca/kupi, krugovi POST, pristupnica, chat POST, tabla-jemstva/kontakt, profil/[id]
- **indeks≥10%:** doprinos-oglasi/prijavi i /evidencija
- **admin kruga:** krugovi/[id]/projekti, pristupnice/odobri

### Tačke pažnje (rizici)
- `/api/verifikacija/token` koristi **in-memory** rate-limit (Map) — neće raditi u serverless/multi-instance
- `/api/pijaca/*` slike pišu/čitaju lokalni FS (`process.cwd()`) — na Vercelu efemerno
- Svi route params su `Promise` (Next 16 async) — proveriti `await`

(Pun spisak svih 132 ruta po oblastima — vidi sekciju Dodatak A na dnu / izlaz subagenta.)

---

## 4. Integritet baze (Prisma) — testovi

### 4.1 Poznati bug — REGRESIJA (P0)
`verifikovaniId @unique` je **uklonjen** migracijom `20260602120000_ukloni_unique_verifikovani`. Pre toga je svaki korisnik mogao imati max 1 verifikatora → indeks zaglavljen na 10%.
Testovi:
1. Više verifikatora za istog korisnika (A1,A2,A3) → 3 veze bez P2002; `count==3`; indeks=30
2. Rast do 100% + cap (11. verifikacija ne spušta indeks; servis radi `max(stari, izračunati)`)
3. Regresija: NE postoji unique na `verifikovaniId` (dva insert-a istog verifikovaniId prolaze)
4. I dalje važi `@@unique([verifikatorId, redniBroj])` (pozitivan/negativan)
5. Brisanje verifikatora → reizračun indeksa preostalih (30→20→…→0); pad na 0→NEVERIFIKOVAN + povrat 1000 POEN
6. NOSILAC_ZRNA: status nadjačava indeks (kapacitet ∞)
7. Anti-cirkularnost nezavisna od uklonjenog unique-a

### 4.2 Kompozitni `@@unique` (P2 — pozitivan + negativan za svaki)
KrugPristupnica`[userId,krugId]` · ProgramEnrollment`[userId,type]` · ProgramPotvrda`[enrollmentId,verifikatorId]` · OglasPrijava`[oglasId,userId]` · OglasEvidencija`[userId,oglasId,date]` · ZrnoUpisZahtev/OtpisZahtev`[userId,date]` · GlasanjeGlas`[predlogId,userId]` · Konverzacija`[user1Id,user2Id]` (⚠️ ne sprečava obrnuti par (u2,u1)!) · Politika/PravilnikPrihvatanje`[userId,verzijaId]` · OsnivackiKorakEmisija`[korakLogId,osnivacId]` · VerifikacionaVeza`[verifikatorId,redniBroj]`.

### 4.3 Singletoni — test: tačno 1 zapis
`ZrnoTrziste("singleton")`, `OsnivackiKanal("singleton")`, `SistemskiVeto("singleton")`, Wallet `"banka-singleton"` (PROTOKOL), `ProtokolProgram` (PK=enum, max 5).

### 4.4 `onDelete` kaskade
Cascade: PasswordResetToken→User, ProgramPotvrda→ProgramEnrollment.
RESTRICT: VerifikacionaVeza.verifikatorId/verifikovaniId→User (brisanje korisnika u grafu blokirano na DB; `profil/route.ts` ručno briše veze pre brisanja — testirati ovaj redosled).
SET NULL: VerifikacionaVeza.nadzornikId→User.

### 4.5 Migracije — drift
⚠️ Dva para migracija dele timestamp prefiks (`20260602120000_*`, `20260603160000_*`) — moguć nedeterminisan redosled. Test: `prisma migrate status` ne prijavljuje drift.
⚠️ `seed-dokaz-stvarnosti.ts` u komentaru pominje zastareli `tipKorisnika=POCETNI` (enum dropovan `20260603200000_drop_pocetni_tip`) — uskladiti dok.
⚠️ `prisma/seed.ts` `main()` poziva SAMO `seedBanka()`+`seedAdmin()` — „pune" seed funkcije postoje ali nisu povezane; `npm run seed` je de facto minimalan.

---

## 5. UI / E2E tokovi (Playwright) — DEO A

Klase korisnika za svaki tok: **gost / neverifikovan / verifikovan / nadzornik (NOSILAC_ZRNA) / admin / superadmin**.

| # | Tok | Ključne rute | Kritično |
|---|---|---|---|
| 1 | Registracija→verifikacija→pristup | `/registracija`, `/oauth/dovrsi`, `/dobrodosli`, `/verifikacija`, `/m/[hash]` | pseudonim jedinstvenost; checkboxi obavezni; auto-login; QR kod; bez slota „Verifikuj nekoga" onemogućeno; neverifikovan vidi samo „Pokaži kod" |
| 2 | Glasanje + delegiranje | `/zrno` | side-effect `zatvoriIstekleIObjaviIshod` pri svakom učitavanju; glas po `glasackaGlasova`; samo U_TOKU; 1 glas/korisnik; delegacija ne dvostruko |
| 3 | Pijaca (oglas→kupovina) | `/pijaca`, `/pijaca/[id]`, `/pijaca/novi-oglas` | ne sopstveni/ne-ACTIVE; balans; atomичnost; SOLD sprečava dupli (race) |
| 4 | Novčanik + transfer | `/novcanik` | iznos floor+ceo>0; ne sebi; smer transakcije; deep-link prefill |
| 5 | Donacije (NestPay) | `/donacije` | PENDING ne emituje pre povratka; HASH verifikacija; idempotencija `oid` |
| 6 | Osnivački doprinos | `/osnivacki-doprinos` | gost vidi agregat, ne pseudonime/udele; zatvaranje na granici |
| 7 | Programi | `/programi`, `/programi/potvrde` | gating indeks≥100 + verified; dnevni limit 10%; statusi |
| 8 | PED/operativni | `/doprinos-oglasi`, `/[id]` | prijava→odobri→evidencija→odobri→POEN; konflikt interesa |
| 9 | Krug | `/krug`, `/[id]`, `/osnivanje` | zahtev čeka admin; `leftAt:null` semantika |
| 10 | Tabla jemstva + DM | `/tabla-jemstva`, `/poruke`, `/chat` | noindex; ko sme kontaktirati; istek (cron) |
| 11 | Nadzor + Admin | `/nadzor`, `/admin`, `/sistem` | stroga autorizacija; audit-log; superadmin-only akcije |
| 12 | Javne stranice (smoke) | `/`, `/o-nama`, `/statut`, `/uslovi`… + reset lozinke | 200 + noindex na test env; render bez sesije |

---

## 6. Ponavljajuće invarijante (testirati svuda gde se javljaju)
- **Zero-sum:** Protokol balans = −Σ(korisnici); proveriti posle svake emisije/transfera
- **Jednosmerni flagovi:** `SistemskiVeto.trajnoUgasen`, `ZrnoTrziste.isActive`, `OsnivackiKanal.zatvoren`, `User.pocetnaEmisijaIzvrsena` — jednom true, ostaju
- **Pattern „DB u `$transaction`, `emitujPoen` VAN nje":** rizik delimičnog uspeha (Faza 1 commit, Faza 2 emisija padne → veza ostaje, POEN ne) — testirati incident putanju
- **Idempotencija:** donacije po `oid`, osnivačke emisije po `[korakLogId,osnivacId]`, krug bonus po `krugBonusLog`, zatvaranje isteklih predloga
- **Konflikt interesa:** verifikator ≠ izvršilac ≠ predlagač (doprinos-oglasi); nadzornik ≠ verifikator
