# KOLO Platforma — v3.7.3

## ⚠️ Deploy i grane (OBAVEZNO poštovati)
Vercel **Production Branch = `production`**. Podela okruženja:
- **`main`** → TEST deploy (`*.vercel.app`, test Neon baza, pun seed). Ovde ide sav svakodnevni rad.
- **`production`** → UŽIVO na **ekolo.rs** (prod Neon baza, `seed-prod.ts`). Samo namerna „objava".

**Pravila za Claude:**
- Podrazumevano radi i guraj na **`main`** (= test). NIKAD ne guraj direktno na `production` osim kad vlasnik eksplicitno kaže „objavi na ekolo.rs" / „pošalji na produkciju".
- Vlasnik ne barata gitom. Mapiranje komandi:
  - „pošalji na test" → commit + push na `main`.
  - „objavi na ekolo.rs" → merge `main` → `production` + push na `production`.
- Pre „objave" proveri da je `main` čist i da test izgleda ispravno.
- **Napomena o git okruženju:** u remote kontejneru lokalni `main` može biti zastareo (klon u trenutku startovanja). Pre poređenja uvek `git fetch origin main` i poredi sa **`origin/main`**, ne sa lokalnim `main`.

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru. Koristi dve interne jedinice:
- **POEN** — interna obračunska jedinica kojom se evidentira doprinos i učešće u zajedničkom dobru (NIJE novac, NIJE imovinsko pravo; beleži činjenicu doprinosa, bez vrednosti van sistema — analogija: zapis u matičnoj knjizi)
- **ZRNO** — interna obračunska jedinica koja beleži položaj korisnika; iz aktiviranog ZRNA proizlazi glas u Gornjem Kolu

Sistem funkcioniše kroz Fondaciju, mrežu **Krugova** (lokalnih operativnih grupa), KOLO **Protokol** (softverski protokol) i korisnike. **KOLO Zajednica** je opisni pojam za sveukupnost svih korisnika platforme — nije pravni entitet i nema organe.

## Kanonska dokumentacija (folder `nova dokumentacija/`)
Stari folder `dokumentacija/` (v3.7.0 i v2.x) je **obrisan**. Sva kanonska dokumentacija je sada u **`nova dokumentacija/`** (pažnja: ime sa razmakom). Verzije su **mešane 3.7.3 / 3.7.2**:

| Dokument | Fajl | Verzija |
|---|---|---|
| Pravilnik o KOLO sistemu | `Pravilnik_3_7_3.md` | **3.7.3 (aktuelan)** |
| Politika privatnosti | `politika_3_7_3.md` | **3.7.3 (aktuelan)** |
| Uslovi korišćenja | `uslovi_koriscenja_3_7_3.md` | **3.7.3 (aktuelan)** |
| Statut Fondacije | `statut_3_7_2.md` | 3.7.2 |
| Whitepaper | `whitepaper_3_7_2.md` (+ `KOLO_Whitepaper_3.7.2.pdf`) | 3.7.2 |
| DPIA | `DPIA_3_7_2.md` | 3.7.2 |
| Radnje obrade | `radnje_obrade_3_7_2.md` | 3.7.2 |
| Rizici | `rizici_3_7_2.md` | 3.7.2 |
| Pravilnik o hijerarhiji akata | `hijerarhija_3_7_2.md` | 3.7.2 |
| Pravilnik o dokazu stvarnosti | `dokaz_stvarnosti_3_7_2.md` | 3.7.2 |
| Pravilnik o pokroviteljstvu i donacijama | `donacije_3_7_2.md` | 3.7.2 |
| Pravilnik o operativnom doprinosu | `operativni_3_7_2.md` | 3.7.2 |
| Pravilnik o osnivačkom doprinosu | `osnivacki_3_7_2.md` | 3.7.2 |

Prethodne verzije (`Pravilnik_3_7_2.md`, `politika_3_7_2.md`, `uslovi_koriscenja_3_7_2.md`) su zadržane u folderu kao istorija, ali ih je zamenila 3.7.3 verzija.

Folder `docs/` sadrži **interne radne beleške** (analiza FAQ, glosar, predlog modela vidljivosti, pregled funkcija, dpia-podloga) — NIJE kanonska normativa.

**Ključna izmena u 3.7.3 (Pravilnik čl. 16, 28, 67):** precizirana je vidljivost platformskog prostora za oglašavanje — **pregled oglasa je javan** (sadržaj, cena, lokacija, pseudonim oglašivača vide svi posetioci), dok su **postavljanje oglasa, pristup kontaktu i komunikacija** dostupni samo verifikovanim korisnicima. Ovo je razgraničeno od pseudonimne evidencije doprinosa i grafa verifikacija (koje neprijavljeni/neverifikovani NE vide).

## Status usklađenosti (24.05.2026 → 31.05.2026)
**Kod je u velikoj meri usklađen sa v3.7.3/3.7.2.** Većina ranijih 🟡 odstupanja je rešena. Aktuelno stanje:
- ✅ **Dokaz stvarnosti / Verifikacija** — implementiran (tri statusa, indeks 0–100, lanac jemstva, anti-cirkularno, QR token, kamera skener, nadzor, mini stablo)
- ✅ **Legacy LK/JMBG verifikacija UKLONJENA** (commit `f2f6575`, migracija `20260526120000_ukloni_lk_jmbg`) — nema više upload-a dokumenata, JMBG-a, `VerifikacijaPristanak` tabele, admin pregleda dokumenata
- ✅ **Tabla zahteva za jemstvo** — implementirana (`ZahtevZaJemstvo`, `/tabla-jemstva`, istek cron)
- ✅ **Poništavanje lažne verifikacije** sa rekurzivnom kaskadom (`lazna-verifikacija.ts`)
- ✅ **Osnivački doprinos** — implementiran (granica 2.4M POEN, 120 koraka × 20.000, noćni cron, admin UI, javna transparentnost)
- ✅ **Pun tok pokroviteljstva** — prijava → ugovor → potpis → potvrda (`PokroviteljPrijava`, novac/roba/usluge)
- ✅ **Zaštitni veto Fondacije** — implementiran (`SistemskiVeto`, `FondacijaTrosak`, transparentnost sredstava). 🟡 **Ali prag gašenja je hardkodovan na `3× prosek mesečnih troškova`** — i dokumentacija (Pravilnik čl. 49) i raniji TODO kažu da to NIJE tačan standard; prag se utvrđuje posebnim pravilnikom (vidi GAP ispod)
- ✅ **Verzionisanje Pravilnika** (`PravilnikVerzija`/`PravilnikPrihvatanje`, `/pravilnik-prihvati`) — paralelno sa Politikom
- ✅ **Vidljivost po ulozi (feed)** — `/api/javno/feed` sada gradiran: gost→agregat, neverifikovan→maskirano „Korisnik", verifikovan→pseudonimi
- ✅ **ZRNO minimum upisa 20.000 POEN** (`MINIMUM_POEN_ZA_UPIS_ZRNA = 20_000`)
- ✅ **Terminologija ZRNO:** rute `kupi/prodaj` → `upis/otpis`; enum `KUPOVINA_ZRNO/PRODAJA_ZRNO` → `UPIS_ZRNO/OTPIS_ZRNO`
- ✅ **Terminologija POEN prenosa:** „slanje/primanje" → „ažuriranje evidencije"; UI za običnog korisnika „Upiši POEN"
- ✅ **Banka → Protokol** u UI/kodu (interni identifikator wallet-a ostao `"banka-singleton"`)
- ✅ **Faze sistema** — `faza-sistema.ts`, auto prelaz Faza 1 → Faza 2 na 1.000.000 POEN, NOSILAC_ZRNA verifikuje operativni doprinos
- ✅ **DCO + CC BY-SA** označavanje (`DCO`, `CONTRIBUTING.md`, `.github/workflows/dco.yml`)
- 🟡 **Tabela donacija u kodu ima 18 nivoa (do 5,00×)** — dokumentacija (`donacije_3_7_2.md` čl. 4) propisuje **11 nivoa / maks 2,00×**. Treba uskladiti (vidi GAP)
- 🟡 **Operativni doprinos još na modelu satnice** (1.000–2.500 POEN/sat, admin odobrava) — treba model **predloženog POEN-a × min(1, L/P)** sa verifikacijom nosilaca ZRNA (vidi GAP)
- 🟡 **„kurs" u UI/prevodima** — kanonski termin je **obračunski koeficijent** (ZRNO) / **koeficijent evidencije donacija**; interni identifikatori mogu ostati
- 🔴 Moduli (Zadruga, Modul Deca, internacionalizacija, Glava VIII) — nisu fokus razvoja po odluci vlasnika

**Tri statusa korisnika:** Neverifikovani / Verifikovani / Nosilac ZRNA. NE POSTOJE organizatorske titule (zagovornik/aktivista/glasnik/šampion); NE POSTOJI "apostol" ni "Pokret" kao modul.

## Tech stack
- Next.js 16 (App Router), TypeScript
- PostgreSQL, Prisma ORM 7 (generisani klijent u `src/generated/prisma/`)
- NextAuth.js (credentials provider + OAuth tok, reset lozinke)
- Tailwind CSS v4
- next-intl — i18n biblioteka (prevodi u `messages/`); osnovni jezik srpski (latinica)
- Srpski jezik (latinica) u celom interfejsu
- **Nema instaliranog zod, decimal.js, ni sličnih library-a** — validacija ručno, Decimal tipovi se konvertuju sa `Number()`

## Fundamentalna pravila sistema

1. **Zero-sum princip**: zbir svih računa (uključujući Protokol) = 0. Protokol ide u minus pri svakoj emisiji.
2. **Nema negativnog stanja**: korisnici i Krugovi nikad ispod 0. Samo Protokol može u minus.
3. **POEN i ZRNO su celi brojevi** (INTEGER). Nema decimalnih POEN-a ni ZRNA. Jedini decimalni iznosi su **obračunski koeficijent ZRNA** (DECIMAL(20,2); u kodu još uvek nazvan „kurs") i RSD iznosi (DECIMAL(12,2)).
4. **Prenos 1:1 (ažuriranje evidencije)**: prenos POEN-a između korisnika je **ažuriranje evidencije** (zapis davaoca se umanjuje, zapis primaoca uvećava), bez provizije; Protokol nije posrednik i **to nije platna transakcija ni prenos monetarne vrednosti** (Pravilnik čl. 14, 16). Izbegavati „slanje/primanje POEN-a". **Dva registra:** UI za običnog korisnika koristi **„Upiši POEN"** (zapis/record); pravni/normativni tekst zadržava **„ažuriranje evidencije"** (razlika od „**upisa novih zapisa kroz kanale**" iz čl. 15 — jedino to menja ukupan broj POEN-a, zero-sum). **Interni identifikatori `/api/transfer` i `TransactionType.TRANSFER` zadržani.**
5. **Obračunski period**: ponoć do ponoći. Grupne operacije (ZRNO, delegacije, programi) izvršavaju se u ponoć **istog obračunskog perioda**.
6. **Pseudonimi**: nigde u javnom interfejsu ne prikazivati pravo ime. **Po v3.7.3 (Pravilnik čl. 31, DPIA, Whitepaper) ne postoji centralizovana evidencija koja povezuje pseudonim sa identitetom** — Fondacija tu vezu NE poseduje; dokaz stvarnosti ne prikuplja dokumente, a ime/telefon su dobrovoljni i nisu uslov. **Pseudonim u evidenciji doprinosa vidljiv je samo verifikovanim korisnicima** (Pravilnik čl. 67, Politika čl. 6); neregistrovani vide samo agregate. **Izuzetak:** pseudonim **oglašivača na Pijaci** je javan (čl. 16) — ali se za neprijavljene/neverifikovane NE povezuje sa evidencijom doprinosa, stanjem ni profilom.
7. **Dnevni limit Programa Protokola**: maksimalno 10% opticaja (opticaj = apsolutna vrednost minusa Protokola; baza je „ukupan broj evidentiranih POEN-a na početku perioda"). Odnosi se samo na **operativni doprinos i socijalne programe**; ostali kanali (automatski akti Protokola) ne ulaze u limit.
8. **Kanali evidentiranja POEN-a (Pravilnik čl. 15 — sedam kanala)**:
   - **Ulaze u dnevni limit:** Operativni doprinos (izvršenje **verifikuju nosioci ZRNA u Fazi 2, odn. UO Fondacije u Fazi 1**, čl. 36); Socijalni programi (Podrška Majkama/primarnim starateljima, Podrška Starijima, Posebna Briga, Školovanje).
   - **Ne ulaze u dnevni limit (automatski akt Protokola):** verifikacija u lancu jemstva (dokaz stvarnosti), finansijski doprinos (donacije), pokroviteljstvo, rast kolektivnih oblika (bonus Kruga), osnivački doprinos.
9. **Gradirana vidljivost podataka po ulozi (Pravilnik čl. 28–30, 67; Politika čl. 6; Uslovi):**
   - **Neregistrovan posetilac**: opšti pokazatelji sistema (agregati) + **pregled oglasa na Pijaci** (sadržaj, cena, lokacija, pseudonim oglašivača — čl. 16). NE vidi pojedinačne transakcije, evidenciju doprinosa, profile, ni kontakt oglašivača.
   - **Neverifikovan prijavljen korisnik**: iznose/vremena ažuriranja evidencije POEN-a **bez pseudonima strana** i bez stanja računa; svoje notifikacije; pregled oglasa. **Može da razmenjuje dobra/usluge van platformskog prostora za oglašavanje i da učestvuje u ažuriranju evidencije POEN-a (davalac/primalac).** Može da se predstavi kroz **tablu zahteva za jemstvo**.
   - **Neverifikovan NE MOŽE**: videti pseudonime u evidenciji, rang-liste, profile drugih; postavljati oglase; pristupati kontaktu oglašivača; slati/primati poruke (osim mehanizma table jemstva); upisati ZRNO; evidentirati doprinos u POEN-ima (emisija).
   - **Verifikovan korisnik (indeks ≥ 10%)**: pun pristup — pseudonimi, sve transakcije sa pseudonimima, stanja, profili, poruke, postavljanje oglasa + kontakt, upis ZRNA, Programi.

## Ključni koncepti

### Dokaz stvarnosti (implementiran)
- Tri statusa: `NEVERIFIKOVAN` / `REGULARNI` (verifikovan običan) / `POCETNI` (UO Fondacije, počinju na 10%, izuzeti od anti-cirkularnog, bez kapaciteta/nadzora) / `NOSILAC_ZRNA` (drži ZRNO, nadzire verifikacije). Enum `TipKorisnika`.
- **Verifikacija = +10 procentnih poena** indeksa (raspon 0–100%).
- **Funkcionalni prag:** indeks ≥ 10% = pun pristup; < 10% = verifikovan ali bez pristupa.
- **Verifikacioni kapacitet** = `⌊indeks/10⌋`.
- POEN emisija pri verifikaciji: **verifikator 1.000, verifikovani 1.000, nadzornik 500** (kada podleže nadzoru).
- Anti-cirkularno pravilo (Pravilnik o dokazu stvarnosti čl. 12): zabranjeno recipročno, ancestralno, descendentno i **verifikacija braće u stablu**; početni (UO) izuzeti.
- Modeli: `VerifikacionaVeza` (graf), `VerifikacijaToken` (QR, 60s).
- UI: `/verifikacija` (QR + skener kamere), `/nadzor` (POCETNI/NOSILAC_ZRNA), profil sa javnim indeksom i mini stablom.
- Lib: `dokaz-stvarnosti.ts`, `verifikacija-service.ts`, `nadzor-service.ts`, `lazna-verifikacija.ts` (kaskadno poništavanje).

### Tabla zahteva za jemstvo (implementirana)
- Neverifikovan korisnik se predstavlja mreži radi verifikacije (Pravilnik čl. 32, Uslovi).
- Model `ZahtevZaJemstvo`; API `/api/tabla-jemstva*`; stranica `/tabla-jemstva`; admin uklanjanje; istek cron (`/api/cron/tabla-jemstva-istek`, rok ~30 dana po Politici).

### Pravna priroda POEN-a (Pravilnik čl. 12–13)
POEN je **interna obračunska jedinica kojom se evidentira doprinos i drugi oblici učešća u zajedničkom dobru**. Analogija: zapis u matičnoj knjizi — **beleži činjenicu**, ali nije sredstvo van sistema. POEN **nema nosioca**, postoji isključivo kao zapis u Protokolu, izražava se celim brojevima i **ne predstavlja novac, valutu, elektronski novac, platno sredstvo, digitalnu imovinu, finansijski instrument ni hartiju od vrednosti**. Evidentiran doprinos **ne predstavlja potraživanje prema Fondaciji** ni osnov za imovinskopravni zahtev.

### Nasleđivanje (Pravilnik čl. 34, čl. 72)
POEN i ZRNO **nisu imovinsko pravo i ne nasleđuju se**. Pri prestanku statusa zapisi POEN-a se poništavaju uz protivzapis Protokola, ZRNO se otpisuje u raspoloživa (zero-sum očuvan), a podaci se anonimizuju. Postupanje u slučaju smrti bliže se uređuje Uslovima.

### Zaštitni veto Fondacije (Pravilnik čl. 48–50 — implementiran, jedan parametar nije usaglašen)
U Fazi 2, Fondacija može da **odbije izvršenje odluke Gornjeg Kola** koja bi narušila četiri principa, prekršila zakon ili ugrozila pravni status Fondacije (čl. 48). Veto nije diskrecion — mora biti obrazložen. Gasi se **trajno i jednosmerno** kada sredstva Fondacije dostignu **prag finansijske samostalnosti utvrđen posebnim pravilnikom** (čl. 49).
- Kod: `fondacija.ts` (`dohvatiSaldoFondacije`, `azurirajVetoStatus`), model `SistemskiVeto` (singleton), `FondacijaTrosak`, API `/api/admin/fondacija`, javni status.
- 🟡 **GAP:** `pragZaGasenje = prosek × 3` (3× prosek mesečnih troškova) je hardkodovan u `fondacija.ts:100`. Pravilnik čl. 49 delegira prag posebnom pravilniku; „3× mesečno" eksplicitno NIJE tačan standard. Treba parametrizovati kad poseban pravilnik utvrdi iznos.

### Zajedničko dobro (Pravilnik Glava II, čl. 5–8)
- Softver: **AGPL-3.0** (čl. 7). Sadržaj: **CC BY-SA 4.0** (čl. 7). Licence se ne mogu zameniti restriktivnijim (važi i za Gornje Kolo).
- Doprinosi softveru pod **DCO** (Signed-off-by); doprinosi sadržaju uz prihvatanje licence (čl. 8). Vidi `DCO`, `CONTRIBUTING.md`, `.github/workflows/dco.yml`. Javna stranica `/zajednicko-dobro`.
- **Trajna atribucija** se odnosi na doprinose koda/sadržaja pod licencama Glave II (Uslovi čl. 31) — NE na zapise POEN-a/ZRNA ni graf verifikacija (anonimizuju se pri prestanku, čl. 34).

### Pijaca / razmena (Pravilnik čl. 16, 28, 67 — v3.7.3)
- Za razmenu odgovaraju korisnici prema **obligacionom pravu**, **ne kroz Protokol** — Fondacija/Protokol ne posreduju i ne odgovaraju.
- **Pregled oglasa je javan svim posetiocima** (sadržaj, cena, lokacija, pseudonim oglašivača) — radi pristupačnosti razmene (v3.7.3).
- **Postavljanje oglasa, pristup kontaktu oglašivača i komunikacija** — samo verifikovani korisnici.
- **Svi korisnici** mogu da razmenjuju dobra/usluge i da iniciraju ažuriranje evidencije POEN-a u korist drugih; neverifikovani van platformskog prostora za oglašavanje.

### Krug (kolektivni oblik — Pravilnik Glava VIII, čl. 55)
- Kolektivni oblik bez pravnog subjektiviteta; ima evidencioni identifikator i zajednički POEN zapis u Protokolu.
- Ovlašćena lica, min. broj članova i ostali parametri uređeni su **posebnim pravilnikom** (čl. 55); vrednosti u kodu („najmanje 5 verifikovanih", 1–3 ovlašćena lica) potiču iz tog pravilnika/koda.
- **Rast kolektivnih oblika** je kanal evidentiranja (čl. 15) — Mehanizam platforme (NE ulazi u dnevni limit, svaki prag se loguje jednom u `KrugBonusLog`):
  - 5 članova (osnivanje): **50.000 POEN** | 10: 100.000 | 20: 200.000 | 50: 500.000 | 100: 1.000.000 | 200: 2.000.000 | 500: 5.000.000
  - Formula: `broj_članova × 10.000 POEN`
- Logika: `src/lib/protokol/krug.ts` → `proveriIEmitujBonusPrag()`.

### Programi Protokola
- **Operativni doprinos (Pravilnik čl. 36; Pravilnik o operativnom doprinosu):** Fondacija/Gornje Kolo/nosioci ZRNA objavljuju **zadatak**; korisnik (indeks ≥ 10%) se prijavljuje i izvršava; izvršenje **verifikuju nosioci ZRNA (Faza 2), odn. UO (Faza 1)** — **NIJE** međusobno potvrđivanje proizvoljnih korisnika. Model: predlagač zadaje **predloženi POEN** (težinski koeficijent), evidentirani POEN = predloženi × min(1, L/P) u okviru dnevnog limita. 🟡 Kod još koristi satnicu (vidi GAP).
- **Socijalni programi:** PODRSKA_MAJKAMA (i primarni staratelji), PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE — uslovi/koeficijenti u programskim pravilnicima.
- Svi programi otvoreni verifikovanim korisnicima (indeks ≥ 10%), nezavisno od Kruga.
- Dnevni limit (10% opticaja), proporcionalno smanjenje pri prekoračenju.

### Moduli sistema (Pravilnik Glava VIII, čl. 53–59)
- Glava VIII = **Moduli**: kolektivni oblici (**Krug**, **Zadruga** — registrovano pravno lice po Zakonu o zadrugama), socijalni programi, **Modul Deca** (maloletnici, poseban režim < 15, bez ZRNA/glasanja do 18), internacionalizacija.
- Aktiviranje/deaktiviranje: Fondacija u Fazi 1, Gornje Kolo u Fazi 2 (čl. 54).
- 🔴 Zadruga i Modul Deca nisu implementirani (odluka vlasnika: moduli nisu fokus). Krug postoji; `KrugProjekat` je samo aktivnost Kruga (PRIKUPLJANJE/REDISTRIBUCIJA).

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
src/app/(app)/    — autentifikovane stranice (pocetna, sistem, novcanik, pijaca, zrno, programi, doprinos-oglasi, krug, poruke, profil, glasanje, donacije, preporuke, postani-pokrovitelj, verifikacija, nadzor, tabla-jemstva, politika-prihvati, pravilnik-prihvati, admin)
src/app/(public)/ — javne stranice (pokrovitelji, kako-funkcionise, o-nama, o-sistemu, cesto-postavljena-pitanja, pravilnik, statut, whitepaper, dpia, radnje-obrade, rizici, zajednicko-dobro, osnivacki-doprinos, privatnost, uslovi)
src/app/pijaca/   — pijaca sa sopstvenim layout-om (javni + auth prikaz)
src/app/uskoro/   — maintenance/„uskoro" gate stranica
src/components/   — React komponente
src/lib/          — pomoćne funkcije, validacije, faq-data
src/lib/protokol/ — logika KOLO Protokola (vidi sekciju Biblioteka)
src/generated/prisma/ — generisani Prisma klijent
prisma/           — šema i migracije
messages/         — i18n prevodi (next-intl)
nova dokumentacija/ — kanonska dokumentacija (v3.7.3/3.7.2)
docs/             — interne radne beleške (nije normativa)
```

## Implementirane funkcionalnosti

### Autentikacija i korisnici
- Registracija (pseudonim, email, lozinka, referral), login (NextAuth credentials), OAuth tok (`/api/oauth`, `/oauth/dovrsi`), reset lozinke (`/api/zaboravljena-lozinka`, `/api/reset-lozinka`).
- **Verifikacija = dokaz stvarnosti kroz lanac jemstva, bez dokumenata/JMBG-a** (vidi „Dokaz stvarnosti"). Legacy LK/JMBG tok je UKLONJEN.
- Profil: pseudonim, lokacija, telefon, punoIme, opis (UserPodaci), profilna slika sa crop modalom. Javni profil `/profil/[id]`.
- Suspenzija/isključenje (admin).
- **Brisanje naloga** (`DELETE /api/profil`): anonimizacija ličnih podataka, prenos POEN-a ili povrat Protokolu, otpis ZRNA, `deaktiviranAt`; anonimizacija veza u grafu verifikacija (čl. 34); numerička istorija ostaje pod ne-identifikujućim pseudonimom.
- **Eksport ličnih podataka** (`GET /api/profil/eksport`): JSON. (Bez JMBG-a — više se ne prikuplja.)

### Verzionisanje akata i pristanci
- **Politika:** `PolitikaVerzija` / `PolitikaPrihvatanje`; pri loginu AppShell proverava `/api/politika/prihvati` → `/politika-prihvati`.
- **Pravilnik:** `PravilnikVerzija` / `PravilnikPrihvatanje`; analogno → `/pravilnik-prihvati` (Pravilnik čl. 80).

### Prigovor na odluku
- `PrigovorNaOdluku`: korisnik podnosi (`POST /api/prigovor`), admin odgovara (`PATCH /api/admin/prigovori/[id]`). Tipovi: VERIFIKACIJA, SUSPENZIJA, PROGRAM, OSTALO. Max 3 otvorena; odgovor u 30 dana; notifikacija.

### GDPR cron
- `POST /api/cron/gdpr-cistenje` (1. u mesecu, 02:00): briše poruke kada je jedna strana deaktivirala nalog ILI je lastMessageAt > 24 meseca. (Legacy brisanje JMBG/slika uklonjeno — ti podaci više ne postoje.) Rokovi po Politici čl. 10: tehnički logovi 12 meseci, transakcije/donacije 10 godina, podaci table jemstva 30 dana.

### Audit log
- `ADMIN_EKSPORT_PODATAKA` pri admin eksportu. (Legacy `PRISTUP_DOKUMENT_VERIFIKACIJA`/`PRISTUP_JMBG_PODACI` događaji više nisu relevantni — bez dokumenata/JMBG-a.)

### Novčanik (POEN)
- Prikaz stanja; prenos POEN-a (ažuriranje evidencije 1:1, bez provizije; `/api/transfer`); istorija sa filterima; klikabilni pseudonimi; QR modal (`/m/[hash]`).
- Vidljivost transakcija gradirana po ulozi (vidi `/api/javno/feed`).

### Poruke (Chat 1-na-1)
- `/poruke` split-panel; polling 5s; badge nepročitanih; Enter/Shift+Enter; mobilni view; „Kontaktiraj prodavca" na oglasu; notifikacija primaocu.

### Pijaca (Marketplace)
- Listinzi; pretraga po kategoriji/lokaciji; sopstveni layout; detalji na `/pijaca/[id]`.
- **Pregled oglasa javan svim posetiocima** (v3.7.3); **postavljanje/kupovina/kontakt samo verifikovani**.

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

### Glasanje
- Predlozi, glasanje sa ponderisanom (kvadratnom) glasačkom moći.

### Pokrovitelji (pun tok, v3.7.2)
- Pokrovitelj = pravno lice, nema login, vlasnik je verifikovani član.
- **Tok (Pravilnik o pokroviteljstvu čl. 7–10):** verifikovani korisnik pokreće **prijavu** (`/api/pokroviteljstvo/prijava`) → platforma generiše ugovor → korisnik **potpisuje** (`/[id]/potpisi`) → Fondacija **potvrđuje** (`/api/admin/pokroviteljstvo/prijave/[id]/potvrdi`), što pokreće evidenciju. Doprinos: **novac, roba ili usluge** (`VrstaDonacije` NOVAC/ROBA/USLUGE; roba/usluge po cenovniku).
- Model `PokroviteljPrijava`; admin UI `PokroviteljPrijaveTab.tsx`; korisnički UI `PokroviteljstvoPrijava.tsx`.
- Bonus POEN po fiksnoj **tabeli 7 nivoa** (zbir bonusa za sve novodostignute nivoe; jedna transakcija „Bonus za pokroviteljstvo iznos X"):
  - 10.000→20.000 | 20.000→30.000 | 50.000→80.000 | 100.000→150.000 | 200.000→300.000 | 500.000→800.000 | 1.000.000→1.500.000 POEN
- Javna `/pokrovitelji`, app `/postani-pokrovitelj`. Logika: `pokrovitelj.ts`.

### Donacije
- Donacije fizičkih lica Fondaciji (RSD), admin potvrđuje, evidencija POEN-a.
- **Koeficijentni model (Pravilnik o pokroviteljstvu i donacijama 3.7.2, čl. 4):** kumulativna donacija određuje nivo; koeficijent novodostignutog nivoa primenjuje se na celu novu donaciju; `Math.round()`.
- **Dokumentacija: 11 nivoa, 1,00× (2.000 RSD) → 2,00× (5.000.000 RSD).** 🟡 **Kod (`donacija.ts` `RANG_TABELA`) još ima 18 nivoa do 5,00× — GAP, treba skratiti na 11 / maks 2,00×.**
- Jedna transakcija „Bonus za donaciju iznos X". Logika: `donacija.ts` (`nivoZaKumulativ`, `izracunajPoenZaDonaciju`, `evidentirajDonaciju`).

### Osnivački doprinos (implementiran)
- Naknadna evidencija pre-launch rada (Pravilnik čl. 37; Pravilnik o osnivačkom doprinosu).
- **Parametri:** korak 20.000 POEN, ukupno **120 koraka**, jedan korak po svakom dostignutom pragu od **100.000** ukupnih POEN-a u sistemu; gornja granica **2.400.000 POEN**; kanal se trajno zatvara na 120. koraku. Zaseban kanal — ne ulazi u dnevni limit.
- Kod: `osnivacki.ts` (`ITERATION_LIMIT=120`, `KORAK_IZNOS=20_000`, `GORNJA_GRANICA=2_400_000`, `PRAG_SKOK=100_000`, raspodela među osnivačima largest-remainder metodom). Modeli: `OsnivackiKanal`, `Osnivac`, `OsnivackiKorakLog`, `OsnivackiKorakEmisija`. Admin `OsnivaciTab.tsx`, `/api/admin/osnivaci`, `/api/admin/osnivacki/triger`; javno `/api/javno/osnivacki-doprinos`, stranica `/osnivacki-doprinos`. Noćni triger u cron-u.

### Preporuke
- Referral sistem, nagrade po tabeli.

### Notifikacije
- Bell ikona, badge, dropdown, toast (polling 15s). `posaljiNotifikaciju()` u `src/lib/notifikacije.ts`.

### Početna (`/pocetna`)
- Vesti Fondacije (Blog, poslednjih 5) + globalna Chat soba (svi prijavljeni vide, **samo verifikovani** pišu, max 1.000 znakova).

### Sistem (`/sistem`)
- `/dashboard` redirectuje na `/sistem`. Lični pregled + 4 kartice (Članovi, Transakcije, Krugovi, Opticaj sa zero-sum kvačicom). Klikabilne kartice → filtrirani prikazi.

### Blog (Vesti Fondacije)
- Admin objavljuje (`POST /api/admin/blog`); javna lista `/api/blog`. Model `BlogPost`.

### Chat soba (globalna)
- Jedna soba; svi prijavljeni vide, samo verifikovani pišu; auto-čišćenje > 30 dana (`/api/cron/chat-cistenje`). Model `ChatMessage`.

### Doprinos zajedničkom dobru — Oglasi (Operativni program)
- Predlagač objavljuje zadatak; verifikovan korisnik (indeks ≥ 10%) se prijavljuje (`/api/doprinos-oglasi/[id]/prijavi`), evidentira izvršenje (`/api/doprinos-oglasi/[id]/evidencija`).
- 🟡 **GAP:** trenutni kod koristi **model satnice** (`DoprinosOglas.hourlyRate` 1.000–2.500 POEN/sat, `OglasEvidencija.hoursWorked × hourlyRate`) i **admin odobrava** evidenciju. Pravilnik o operativnom doprinosu traži **predloženi POEN × min(1, L/P)** i verifikaciju od strane **nosilaca ZRNA / UO** (čl. 36). Treba uskladiti + konsolidovati sa starim PED tokom (`/programi/ped`, `DoprinosEvidencija`).
- Modeli: `DoprinosOglas`, `OglasPrijava`, `OglasEvidencija` + enumi `OglasSource`/`OglasStatus`/`OglasPrijavaStatus`/`EvidencijaStatus`.

### Javne pravne stranice (rendruju iz `nova dokumentacija/`)
- `/pravilnik` → `Pravilnik_3_7_3.md` (+ `/pravilnik/[slug]`); `/privatnost` → `politika_3_7_3.md`; `/uslovi` → `uslovi_koriscenja_3_7_3.md`; `/statut` → `statut_3_7_2.md`; `/whitepaper`, `/dpia`, `/rizici`, `/radnje-obrade` → 3.7.2; `/zajednicko-dobro`, `/osnivacki-doprinos`. Sve otključano za posetioce.
- 🟡 **GAP:** neke stranice u page chrome-u/metadata još pišu „Verzija 3.7.0" iako rendruju 3.7.3 fajl (npr. `pravilnik/[slug]/page.tsx`). Treba ažurirati labelu.

### Admin panel
- Tabs: Dashboard, Na čekanju, Krugovi, Programi, Pokrovitelji (+ prijave), Korisnici, Osnivači, Finansije (+ veto/troškovi), Audit log. (Admin simulator UKLONJEN.)

## Uloge u sistemu
- **Korisnik platforme** (neverifikovan/verifikovan), **Verifikovani korisnik** (indeks ≥ 10%), **Nosilac ZRNA**, **Član Kruga**, **Admin** (Fondacija/UO), **Pokrovitelj** (pravno lice, bez naloga).
- 🟡 **Napomena o šemi:** postoje **dva paralelna statusna modela** — legacy `Role` enum (`FIZICKO_LICE`/`CLAN_KRUGA`/`ADMIN`) i kanonski `TipKorisnika` (`POCETNI`/`REGULARNI`/`NOSILAC_ZRNA`/`NEVERIFIKOVAN`). Latentna nekonzistentnost — kandidat za čišćenje.

## Sidebar linkovi
- Neverifikovan: Početna, Sistem, Novčanik, Pijaca, Verifikacija
- Verifikovan: Početna, Sistem, Novčanik, Pijaca, ZRNO
- Admin (dodatno): Admin
- Badge brojevi sa `GET /api/dnevni-brojevi`. Ostale stranice (Poruke, Krug, Programi, Doprinos-oglasi, Glasanje, Preporuke, Donacije, Pokroviteljstvo, Profil, Nadzor, Tabla jemstva) dostupne preko drugih ulaznih tačaka.

## API endpointi (izbor)

### Korisnici / profil
`POST /api/registracija` · `GET /api/provjeri-pseudonim` · `PATCH /api/profil/{pseudonim,lozinka,lokacija,podaci}` · `GET /api/profil/balans` · `GET /api/profil/eksport` · `DELETE /api/profil` · `GET /api/korisnici/pretraga` · `GET /api/m/[hash]/pseudonim` · OAuth (`/api/oauth/*`, `/api/zaboravljena-lozinka`, `/api/reset-lozinka`)

### Novčanik / transfer
`POST /api/transfer` · `GET /api/novcanik/transakcije`

### Verifikacija / nadzor / tabla jemstva
`POST /api/verifikacija` · `GET /api/verifikacija/moj-indeks` · `POST /api/verifikacija/token` · `GET /api/verifikacija/lanac/[korisnikId]` · `/api/nadzor/*` · `GET/POST /api/tabla-jemstva` · `/api/tabla-jemstva/[id]` (+ `/kontakt`) · `POST /api/admin/tabla-jemstva/[id]/ukloni` · `POST /api/cron/tabla-jemstva-istek` · `POST /api/admin/korisnici/[id]/lazni-verifikator`

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
`/api/admin/fondacija` (saldo, troškovi, veto) · `GET /api/javno/statistike` · `GET /api/javno/feed` (gradiran: gost→agregat, neverifikovan→maskirano, verifikovan→pseudonimi) · `/api/notifikacije` · `/api/dnevni-brojevi` · `/api/admin/{dashboard,transakcije,audit-log,zero-sum,emisija/nocna}` · `/api/cron/{nocna-emisija,zero-sum,gdpr-cistenje}` · `/api/prigovor` + `/api/admin/prigovori/[id]`

## Biblioteka funkcija (`src/lib/protokol/`)
- `emisija.ts` — `emitujPoen()`: emisija + zero-sum validacija
- `programi.ts` — `izracunajDnevniIznos()`, `izvrsiNocnuEmisiju()`, `labelPrograma()`
- `pokrovitelj.ts` — pun tok prijave, fiksna tabela 7 nivoa, `bonusZaNivo()`, `izracunajNivo()`
- `donacija.ts` — `nivoZaKumulativ()`, `izracunajPoenZaDonaciju()`, `evidentirajDonaciju()` (🟡 18 nivoa, treba 11)
- `krug.ts` — bonus rasta Kruga (ne ulazi u dnevni limit)
- `zrno.ts` — `UKUPNO_ZRNA`, `MINIMUM_POEN_ZA_UPIS_ZRNA`, obračunski koeficijent (`trendsKurs`/`poslednjiKurs`), noćna obrada, `glasackaMoc()`
- `osnivacki.ts` — osnivački kanal (120 × 20.000, granica 2.4M, raspodela)
- `fondacija.ts` — saldo Fondacije + zaštitni veto (🟡 prag 3× hardkodovan)
- `faza-sistema.ts` — Faza 1/2, auto prelaz na 1.000.000 POEN
- `dokaz-stvarnosti.ts`, `verifikacija-service.ts`, `nadzor-service.ts`, `lazna-verifikacija.ts` — dokaz stvarnosti i nadzor
- `pristup.ts` — provere pristupa po statusu/indeksu
- `src/lib/notifikacije.ts` — `posaljiNotifikaciju()`; `src/lib/faq-data.ts` — `FAQ_SEKCIJE`

## Testovi
- **Vitest** (`npm test`, `npm run test:watch`). Lokacija: `__tests__/protokol/`.
- Pokriva: `donacija`, `osnivacki`, `delegiranje`, `faza-a-konstante`, `pokrovitelj`, `programi`, `emisija`. Config `vitest.config.ts` (`@/` → `src/`).

## Reference
- `nova dokumentacija/` — vidi tabelu na vrhu (Pravilnik 3.7.3, Politika 3.7.3, Uslovi 3.7.3; ostalo 3.7.2)
- `docs/` — interne radne beleške (FAQ analiza/triaža, glosar, model vidljivosti, pregled funkcija) — nije normativa
- Stari dokumenti (v2.x, v3.7.0) — obrisani iz repo-a

## Nezavršeni TODO / preostali GAP-ovi (mapirano na v3.7.3/3.7.2)

### Stvarni GAP-ovi (dokumentacija propisuje, kod radi drugačije)
1. **Tabela donacija 18 → 11 nivoa, maks 5,00× → 2,00×** (`donacija.ts` `RANG_TABELA`; dokument `donacije_3_7_2.md` čl. 4). **PRIORITET** — ide uživo pri objavi.
2. **Veto prag `3× prosek` → vrednost iz posebnog pravilnika** (`fondacija.ts:100`). Pravilnik čl. 49 delegira prag; „3×" nije tačan standard.
3. **Operativni doprinos: model satnice → predloženi POEN × min(1, L/P)** + verifikacija nosilaca ZRNA/UO umesto admin odobravanja (Pravilnik čl. 36; `operativni_3_7_2.md`).
4. **Konsolidacija PED + doprinos-oglasi** u jedan tok (`/programi/ped` + `DoprinosEvidencija` vs `/doprinos-oglasi` + `DoprinosOglas/OglasPrijava/OglasEvidencija`). Razrešiti i18n ključ `useTranslations("ped")`.
5. **„kurs" → „obračunski koeficijent" / „koeficijent evidencije donacija"** u UI/prevodima (`messages/*.json`, ZRNO/donacije ekrani). Interni identifikatori mogu ostati.
6. **Verzijske labele „3.7.0"** na javnim stranicama (`pravilnik/[slug]/page.tsx` i sl.) → 3.7.3/3.7.2.
7. **Dual `Role` / `TipKorisnika`** — počistiti legacy `Role` enum gde je moguće.

### Mehanizmi delegirani posebnim pravilnicima / nisu fokus
8. **Moduli — Zadruga (čl. 56) i Modul Deca (čl. 58)** — nisu implementirani (odluka vlasnika). Krug postoji.
9. **Raspoređivanje dinarskih sredstava (čl. 51)** — višak iznad troškova u programe; Faza 2 preporuke Gornjeg Kola UO. Postoji `FondacijaTrosak`; automatizacija raspodele nije.
10. **Unutrašnje odlučivanje Kruga / ovlašćena lica (čl. 55)** — poseban pravilnik o krugovima; `KrugClanstvo.isAdmin` postoji bez formalnog ograničenja broja.
11. **Rešavanje sporova (čl. 79)** — sud (obligaciono pravo); interni mehanizmi opcioni. Postoji samo `PrigovorNaOdluku`.
12. **Suspenzija — mehanika u Uslovima (čl. 33)** — `suspendedAt` postoji; rok/auto-ukidanje delegirani Uslovima.
13. **Reverifikacija u socijalnim programima** — programski pravilnici; polje `nextReverifikacija` postoji, auto-tok nije.
14. **Pseudonim — limit izmene** — `pseudonimChangedAt` postoji; limit nije propisan Pravilnikom (Uslovi).
15. **CC BY-SA označavanje sadržaja na nivou pojedinačnog dela** — bez formalnog mehanizma.
16. **Trajna atribucija doprinosa koda/sadržaja** — kad bude modul za doprinose, `DELETE /api/profil` NE sme brisati atribuciju (Uslovi čl. 31).

### Operativno
17. **Migracije** se primenjuju na production sa `npx prisma migrate deploy` posle deploy-a. Novije migracije: `20260526120000_ukloni_lk_jmbg`, `20260526130000_tabla_jemstva`, `20260527090000_delegiranje_lanac` (+ pokroviteljstvo/osnivački/veto migracije).
18. **Git okruženje:** uvek `git fetch origin main` pre poređenja (lokalni `main` u kontejneru ume da bude zastareo).

### Procena pokrivenosti
**Pravilnik v3.7.3 je implementiran ~90%.** Osnovni mehanizmi + dokaz stvarnosti, osnivački doprinos, zaštitni veto, verzionisanje Pravilnika, tabla jemstva, pun tok pokroviteljstva, gradirana vidljivost, faze sistema — pokriveni. Preostali GAP-ovi su parametarski/terminološki (donacije 18→11, veto prag, operativni model, „kurs", verzijske labele) i moduli koji se svesno odlažu (Zadruga, Modul Deca).
