# KOLO Platforma

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti. Koristi dve interne jedinice:
- **POEN** — jedinica evidencije doprinosa (NIJE novac)
- **ZRNO** — upravljačka jedinica za glasanje

Sistem funkcioniše kroz Fondaciju, mrežu lokalnih zadruga, KOLO Banku (softverski protokol) i članove.

## Tech stack
- Next.js 16 (App Router), TypeScript
- PostgreSQL, Prisma ORM 7
- NextAuth.js (credentials provider)
- Tailwind CSS v4
- Srpski jezik (latinica) u celom interfejsu
- **Nema instaliranog zod, decimal.js, ni sličnih library-a** — validacija ručno, Decimal tipovi se konvertuju sa `Number()`

## Fundamentalna pravila sistema

1. **Zero-sum princip**: zbir svih računa (uključujući Banku) = 0. Banka ide u minus pri svakoj emisiji.
2. **Nema negativnog balansa**: korisnici i zadruge nikad ispod 0. Samo Banka može u minus.
3. **POEN i ZRNO su celi brojevi** (INTEGER). Nema decimalnih POEN-a ni ZRNA. Jedini decimalni iznos u sistemu je kurs ZRNA (DECIMAL(20,2)) i RSD iznosi pokrovitelja (DECIMAL(12,2)).
4. **Transfer 1:1**: slanje POEN-a između članova je bez provizije, Banka nije posrednik.
5. **Obračunski period**: ponoć do ponoći. Grupne operacije (ZRNO, delegacije, programi) se izvršavaju u ponoć.
6. **Pseudonimi**: nigde u javnom interfejsu ne prikazivati pravo ime. Samo admin vidi vezu pseudonim–identitet.
7. **Dnevni limit programa Banke**: maksimalno 10% opticaja (opticaj = apsolutna vrednost minusa Banke).
8. **Gradirana vidljivost podataka po ulozi**:
   - Neverifikovan prijavljen korisnik vidi: (a) agregatni feed transakcija bez identifikatora strana — vreme, iznos, tip, oznaka programa Banke; opis samo za emisije Banke, ne za P2P transfere; (b) sopstvenu potpunu istoriju sa pseudonimima protivstrana; (c) zadruge (naziv, lokacija, broj članova, projekti, bonusi); (d) sistemske agregate (opticaj, kurs ZRNA, broj članova, broj transakcija, zero-sum); (e) javnu rang-listu pokrovitelja; (f) sopstvene notifikacije sa pseudonimima protivstrana.
   - Neverifikovan prijavljen korisnik ne vidi: pseudonime u tuđim transakcijama; rang-liste članova (donacije, preporuke); profile drugih članova; sadržaj poruka; identitet prodavca na Pijaci.
   - Neverifikovan prijavljen korisnik ne može: slati niti primati poruke; kupovati niti prodavati na Pijaci; otvarati profile drugih korisnika (redirect na poruku o verifikaciji).
   - Pijaca za neverifikovanog = isti nivo kao za neprijavljenog posetioca: oglasi, opisi, lokacije — bez pseudonima prodavca i bez dugmeta "Kontaktiraj prodavca".
   - Pretraga članova za neverifikovanog: dostupna isključivo u kontekstu forme za slanje POENA, vraća `{ id, pseudonim }`. Za verifikovanog vraća `{ id, pseudonim, verified, location }`.
   - Verifikacija je sticanje prava na uvid u tuđe pseudonimne podatke, ne pravo na sakrivanje sopstvenih.

## Konvencije koda

- POEN iznosi: `INTEGER` u bazi, nikad float/decimal.
- ZRNO količine: `INTEGER` u bazi.
- Kurs ZRNA: `DECIMAL(20,2)` — jedini decimalni tip u ZRNO sistemu.
- RSD iznosi (pokrovitelji, donacije): `DECIMAL(12,2)` — konvertovati sa `Number()` pre slanja klijentu.
- Svaka operacija koja menja balans: obavezno `prisma.$transaction()`.
- `emitujPoen()` kreira sopstvenu internu transakciju — NE sme da se poziva unutar druge `prisma.$transaction()`.
- Pattern za multi-korak operacije: DB promene u jednoj transakciji → `emitujPoen()` pozivi sekvencijalno van nje.
- Zero-sum provera: automatski se zove unutar `emitujPoen()` u dev modu.
- API rute: srpski termini.
- Route handleri sa dinamičkim segmentima: params je `Promise<{id: string}>`, mora se `await params`.
- Fontovi: koristiti fontove koji podržavaju srpsku latinicu (č, ć, š, ž, đ).
- `/api/korisnici/pretraga` vraća `{ id, pseudonim, verified, location }` za verifikovane korisnike; `{ id, pseudonim }` za neverifikovane (dostupna isključivo u kontekstu forme za slanje POENA).
- Zaokruživanje POEN-a u emisijama (donacije, programi, bonusi): `Math.round()`.
- Zaokruživanje u ZRNO konverzijama: uvek u korist Banke — `Math.floor()` za iznos koji korisnik DOBIJA, `Math.ceil()` za iznos koji korisnik PLAĆA.
- Slike za verifikaciju: čuvaju se kao base64 string u bazi (ne filesystem) — Vercel kompatibilnost.
- Kompresija slika: obavlja se na klijentu pre slanja (Vercel limit 4.5MB po requestu).

## Struktura foldera
```
src/app/          — Next.js stranice (App Router)
src/app/(app)/    — autentifikovane stranice (dashboard, admin, novcanik...)
src/app/(public)/ — javne stranice (pokrovitelji, kako-funkcionise)
src/app/pijaca/   — pijaca sa sopstvenim layout-om (ima i javni i auth prikaz)
src/components/   — React komponente (Sidebar, Header, PublicHeader...)
src/lib/          — pomoćne funkcije, validacije
src/lib/banka/    — logika KOLO Banke (emisija.ts, pokrovitelj.ts, programi.ts...)
prisma/           — šema i migracije
docs/             — dokumentacija po fazama
```

## Implementirane funkcionalnosti

### Autentikacija i korisnici
- Registracija sa pseudonimom, email, lozinka, referral kod
- Login (NextAuth credentials)
- Verifikacija korisnika — admin ručno verifikuje (upload dokumenata ili lično); slike se čuvaju kao base64 u bazi; odobrena verifikacija emituje **1.000 POEN** korisniku
- Profil: pseudonim, lokacija (autocomplete), telefon, punoIme, opis/zanimanje (opciono, max 200 znakova) — sve u tabeli `UserPodaci`; upload profilne slike sa crop modalom
- Javni profil `/profil/[id]` — prikazuje pseudonim, lokaciju, zadrugu, datum; skriva email/balans/pravo ime
- Suspenzija / isključenje korisnika (admin)

### Novčanik (POEN)
- Prikaz stanja
- Transfer POEN-a između korisnika (1:1, bez provizije)
- Istorija transakcija sa filterima; klikabilni pseudonimi u transakcijama
- QR modal: polja za iznos i opis — dinamički menjaju QR kod; `/m/[hash]` prosleđuje `amount` i `opis` na novčanik

### Poruke (Chat)
- `/poruke` — split-panel: levo lista konverzacija, desno chat
- Polling 5s za nove poruke, badge nepročitanih, automatski scroll
- Enter za slanje, Shift+Enter za novi red; poruke se označavaju pročitanima pri otvaranju
- Mobilni view: lista i chat naizmenično (← nazad dugme)
- "Kontaktiraj prodavca" dugme na svakom oglasu na Pijaci
- Notifikacija primaocu pri svakoj poruci

### Pijaca (Marketplace)
- Listinzi za prodaju/razmenu
- Pretraga po kategoriji, lokaciji
- Javni prikaz (bez pseudonima) i prijavljeni prikaz
- Sopstveni layout (`src/app/pijaca/layout.tsx`)

### Pretraga članova
- `ClanPretraga` komponenta (debounce 250ms, keyboard navigacija ↑↓ Enter Escape)
- Prisutna na: Dashboard (verifikovani), Sistem → Članovi, Zajednica
- Klikabilni pseudonimi u tabelama (zadruga, transakcije, sistem, dashboard)

### Zadruge
- Osnivanje zadruge (zahtev → admin odobrava)
- Pristupnica (zahtev za učlanjenje)
- Projekti zadruge (PRIKUPLJANJE, REDISTRIBUCIJA)
- Admin panel zadruge (upravljanje članovima, projektima)
- **Bonus pragovi rasta** (isti princip kao pokrovitelji — svaki prag se loguje u `ZadrugaBonusLog`, ne ponavlja se):
  - 5 članova (osnivanje): **50.000 POEN** (`EMISIJA_ZADRUGA_OSNIVANJE`)
  - 10 članova: 100.000 POEN
  - 20 članova: 200.000 POEN
  - 50 članova: 500.000 POEN
  - 100 članova: 1.000.000 POEN
  - 200 članova: 2.000.000 POEN
  - 500 članova: 5.000.000 POEN
  - Formula: `broj_članova × 10.000 POEN`
- Logika: `src/lib/banka/zadruga.ts` → `proveriIEmitujBonusPrag()`

### Programi Banke
- ZAPOSLJAVNJE, PODRSKA_MAJKAMA, PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE
- Enrollment (zahtev → admin odobrava, postavlja dailyAmount)
- Evidencija rada (dnevna, admin potvrđuje → emisija)
- Dnevni emisioni limit (10% opticaja), DailyEmissionSummary

### Zapošljavanje (Radni oglasi)
- Admin kreira oglas (FONDACIJA | ZADRUGA | PROJEKAT), hourlyRate 1000–2500 POEN/sat
- Korisnik se prijavljuje → admin odobrava
- Evidencija sati → admin potvrđuje → emisija (hoursWorked × hourlyRate)

### ZRNO
- Kupovina/prodaja ZRNA (zahtev → noćni cron)
- Zaključaj/otključaj ZRNO
- Delegacija glasačke moći
- Dnevni kurs
- **Ograničenja pri kupovini** (čl. 18): minimalni balans korisnika 10.000 POEN (inače se zahtev otkazuje); maksimalni dnevni iznos = 1% trenutnog POEN balansa

### Glasanje
- Predlozi, glasanje sa ponderisanom glasačkom moći

### Pokrovitelji
- Pokrovitelj = pravno lice, nema login, ima vlasnika (verifikovani član)
- Admin kreira pokrovitelja (naziv, PIB, vlasnikId, zadrugaId?)
- Admin evidentira doprinos u RSD → vlasnik dobija bonus POEN: nivoi (1-2-5 skala) + 1:1 donacija
- Nivo 1 (prvi doprinos): 20.000 POEN; Nivo 2+: prag u RSD = bonus u POEN (1-2-5 skala, bez gornje granice)
- Sve se emituje kao **jedna transakcija** sa opisom `"Bonus za pokroviteljstvo iznos X"`
- Javna stranica: `/pokrovitelji`, app stranica: `/postani-pokrovitelj`
- Logika: `src/lib/banka/pokrovitelj.ts`

### Donacije
- Donacije fizičkih lica Fondaciji (RSD), admin potvrđuje, emisija POEN-a
- Rang tabela 18 nivoa (kurs 1,00× do 5,00×) — kumulativna donacija određuje nivo, kurs tog nivoa primenjuje se na celu novu donaciju; zaokruživanje sa `Math.round()`
- Jedna transakcija sa opisom `"Bonus za donaciju iznos X"`
- Logika: `src/lib/banka/donacija.ts` → `izracunajBonusZaDonaciju()`

### Preporuke
- Referral sistem, nagrade po tabeli

### Notifikacije
- Bell ikona u Header-u sa badge-om nepročitanih
- Dropdown panel sa listom, "Označi sve kao pročitano"
- Toast koji se pojavljuje u realnom vremenu (polling 15s) kad stigne nova notifikacija
- `posaljiNotifikaciju()` helper u `src/lib/notifikacije.ts`
- Trigeri: transfer primljen, verifikacija odobrena/odbijena, zadruga odobrena/odbijena,
  pristupnica prihvaćena, program enrollment odobren/odbijen, zapošljavanje prijava/evidencija,
  oglas kupljen, nova poruka

### Početna / Sistem (spojene stranice)
- `/dashboard` redirectuje na `/sistem`
- Sidebar: "Početna" vodi na `/sistem`, nema duplog linka
- Vrh stranice: lični pregled (balans, poslednje transakcije)
- 4 kartice u 2×2 gridu sa statistikama i "danas" vrednostima: Članovi, Transakcije (gornji red), Zadruge, Opticaj (donji red)
- Kartica Opticaj: zero-sum provera sa kvačicom
- Klikabilne kartice vode na filtrirane prikaze (Članovi, Transakcije, Programi, Zadruge)

### Admin panel
- Tabs: Dashboard, Na čekanju, Zadruge, Programi, Zapošljavanje, Pokrovitelji, Korisnici, Finansije, Audit log
- Audit log za sve admin akcije
- `GET /api/cron/zero-sum` — cron endpoint za Vercel (Hobby plan, smanjena frekvencija)
- `vercel.json` sa cron konfiguracijom

## Uloge u sistemu
- **Fizičko lice** — registrovan korisnik (neverifikovan ili verifikovan)
- **Zadrugar** — fizičko lice učlanjeno u zadrugu
- **Admin** — Fondacija/Upravni odbor
- **Pokrovitelj** — pravno lice, nema nalog, vlasnik je verifikovani član

## Sidebar linkovi
- Neverifikovan: Početna (/sistem), Novčanik, Poruke, Pijaca, Verifikacija, Profil
- Verifikovan: Početna (/sistem), Novčanik, Poruke, Pijaca, Zajednica, Zapošljavanje, Programi, ZRNO, Glasanje, Preporuke, Donacije, Pokroviteljstvo, Profil
- Admin (dodatno): Admin, Simulator
- Napomena: "Početna" i "Sistem" su spojeni u jedan link `/sistem`

## API endpointi

### Autentifikacija i korisnici
- `POST /api/registracija`
- `GET /api/provjeri-pseudonim`
- `PATCH /api/profil/pseudonim`
- `PATCH /api/profil/lozinka`
- `PATCH /api/profil/lokacija`
- `PATCH /api/profil/podaci` — punoIme, opis (UserPodaci tabela)
- `GET /api/profil/balans`
- `GET /api/korisnici/pretraga` — vraća `[{ id, pseudonim, verified, location }]`
- `GET /api/m/[hash]/pseudonim`

### Novčanik i transakcije
- `POST /api/transfer`
- `GET /api/novcanik/transakcije`

### Poruke
- `GET /api/poruke` — lista konverzacija
- `POST /api/poruke` — otvori/kreiraj konverzaciju (`{ userId }`)
- `GET /api/poruke/[konvId]` — poruke u konverzaciji (označava pročitanima)
- `POST /api/poruke/[konvId]` — pošalji poruku

### Pijaca
- `GET /api/pijaca`
- `POST /api/pijaca`
- `GET /api/pijaca/[id]`
- `DELETE /api/pijaca/[id]`
- `POST /api/pijaca/[id]/kupi`
- `GET /api/pijaca/slika/[listingId]/[idx]`

### Verifikacija
- `POST /api/verifikacija`
- `GET /api/admin/dokument/[requestId]/[side]`
- `POST /api/admin/verifikacija/[id]`
- `POST /api/admin/verifikacija/[id]/odbij`

### Preporuke i donacije
- `GET /api/preporuke`
- `POST /api/donacije`
- `GET /api/donacije`
- `GET/POST /api/admin/donacija`

### Programi Banke
- `GET /api/programi`
- `POST /api/programi/[type]/prijava`
- `POST /api/programi/zaposljavnje/evidencija`
- `POST /api/admin/programi/[type]/toggle`
- `POST /api/admin/programi/enrollments/[id]/odobri`
- `POST /api/admin/programi/enrollments/[id]/odbij`
- `POST /api/admin/programi/zaposljavnje/[id]/odobri`
- `POST /api/admin/programi/zaposljavnje/[id]/odbij`
- `POST /api/zadruge/[id]/programi/enrollments/[enrollmentId]/odobri`
- `POST /api/zadruge/[id]/programi/enrollments/[enrollmentId]/odbij`
- `POST /api/zadruge/[id]/programi/evidencije/[evidencijaId]/odobri`
- `POST /api/zadruge/[id]/programi/evidencije/[evidencijaId]/odbij`

### Zadruge
- `GET /api/zadruge`
- `POST /api/zadruge`
- `GET /api/zadruge/[id]`
- `DELETE /api/zadruge/[id]`
- `POST /api/zadruge/[id]/pristupnica`
- `POST /api/zadruge/[id]/projekti`
- `POST /api/admin/zadruge/[id]/odobri`
- `POST /api/admin/zadruge/[id]/odbij`
- `POST /api/admin/zadruge/[id]/pristupnice/[pristupnicaId]/odobri`
- `GET /api/admin/zadruge-lista`

### Pokrovitelji
- `GET /api/pokrovitelji` — javna lista
- `GET /api/admin/pokrovitelji` — admin lista
- `POST /api/admin/pokrovitelji` — kreiranje
- `GET /api/admin/pokrovitelji/[id]`
- `PATCH /api/admin/pokrovitelji/[id]`
- `POST /api/admin/pokrovitelji/[id]/doprinos`

### ZRNO sistem
- `GET /api/zrno`
- `POST /api/zrno/kupi`
- `POST /api/zrno/prodaj`
- `POST /api/zrno/zakljucaj`
- `POST /api/zrno/otkljucaj`
- `POST /api/zrno/delegiraj`
- `POST /api/admin/zrno/nocna`

### Glasanje
- `GET /api/glasanje`
- `POST /api/glasanje`
- `GET /api/glasanje/[id]`
- `POST /api/glasanje/[id]/glasaj`

### Zapošljavanje
- `POST /api/admin/zaposljavnje/oglasi`
- `POST /api/admin/zaposljavnje/prijave/[id]/odobri`
- `POST /api/admin/zaposljavnje/prijave/[id]/odbij`
- `POST /api/admin/zaposljavnje/evidencija/[id]/odobri`
- `POST /api/admin/zaposljavnje/evidencija/[id]/odbij`

### Admin i sistem
- `GET /api/admin/dashboard`
- `GET /api/admin/transakcije`
- `POST /api/admin/emisija/nocna`
- `POST /api/cron/nocna-emisija`
- `GET /api/admin/audit-log`
- `POST /api/admin/korisnici/[id]/suspenduj`
- `POST /api/admin/korisnici/[id]/aktiviraj`
- `POST /api/admin/korisnici/[id]/iskljuci`
- `POST /api/admin/korisnici/[id]/rucna-verifikacija`
- `GET /api/admin/zero-sum`
- `GET /api/admin/korisnici/[id]` — detalji korisnika (admin)
- `GET /api/javno/statistike`
- `GET /api/notifikacije`
- `PATCH /api/notifikacije`
- `GET /api/cron/zero-sum` — Vercel cron endpoint

## Biblioteka funkcija (`src/lib/`)

- `banka/emisija.ts` — `emitujPoen()`: emisija POEN-a iz Banke, zero-sum validacija
- `banka/programi.ts` — `izracunajDnevniIznos()`, `izvrsiNocnuEmisiju()`, `labelPrograma()`
- `banka/pokrovitelj.ts` — `evidentirajDoprinos()`, generator pragova 1-2-5, `bonusZaNivo()`
- `banka/donacija.ts` — `izracunajBonusZaDonaciju()`, `evidentirajDonaciju()`: fiksni pragovi, nema kurs
- `banka/zadruga.ts` — bonus zadruge pri osnivanju (50.000 POEN)
- `banka/zrno.ts` — `UKUPNO_ZRNA`, noćna ZRNO obrada, kurs ZRNA
- `notifikacije.ts` — `posaljiNotifikaciju(userId, tip, naslov, tekst, link?)`

## Shared komponente (`src/components/`)

- `Sidebar.tsx` — Navigacija, tamna pozadina, logo na vrhu, w-44; različiti linkovi za verifikovanog/neverifikovanog/admina
- `Header.tsx` — Puno širinom, balans prikaz, bell notifikacije (polling 15s), toast, dugme za odjavu
- `AppShell.tsx` — Layout wrapper; sadržaj kontejner max-w-[940px]
- `PublicHeader.tsx` — Header za javne stranice (logo, linkovi, Pokrovitelji)
- `LokacijaSearch.tsx` — Autocomplete za srpska naselja (keyboard navigacija ↑↓ Enter Escape)
- `ClanPretraga.tsx` — Autocomplete za pretragu članova, navigira na `/profil/[id]`
- `Providers.tsx` — NextAuth SessionProvider wrapper
- `EmptyState.tsx` — Reusable empty state komponenta

## Testovi

- Framework: **Vitest** (`npm test` za jednokratno, `npm run test:watch` za watch mode)
- Lokacija: `__tests__/banka/` — unit testovi za čiste funkcije bez baze
- Pokriva: `emisija.ts` (preporukaNagrada), `pokrovitelj.ts` (bonusZaNivo, izracunajNivo), `donacija.ts` (nivoZaKumulativ, izracunajPoenZaDonaciju), `programi.ts` (izracunajMajke, izracunajStariji, izracunajDnevniIznos)
- Config: `vitest.config.ts` sa path aliasom `@/` → `src/`

## Reference
- `PLAN.md` — pregled svih faza sa zavisnostima
- `docs/schema-plan.md` — kompletna šema baze
- `docs/faza-X-*.md` — detalji implementacije po fazama
