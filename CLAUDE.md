# KOLO Platforma

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti. Koristi dve interne jedinice:
- **POEN** — jedinica evidencije doprinosa (NIJE novac)
- **ZRNO** — upravljačka jedinica za glasanje

Sistem funkcioniše kroz Fondaciju, mrežu Zajednica, KOLO Protokol (softverski protokol) i korisnike.

## Tech stack
- Next.js 16 (App Router), TypeScript
- PostgreSQL, Prisma ORM 7
- NextAuth.js (credentials provider)
- Tailwind CSS v4
- Srpski jezik (latinica) u celom interfejsu
- **Nema instaliranog zod, decimal.js, ni sličnih library-a** — validacija ručno, Decimal tipovi se konvertuju sa `Number()`

## Fundamentalna pravila sistema

1. **Zero-sum princip**: zbir svih računa (uključujući Protokol) = 0. Protokol ide u minus pri svakoj emisiji.
2. **Nema negativnog balansa**: korisnici i Zajednice nikad ispod 0. Samo Protokol može u minus.
3. **POEN i ZRNO su celi brojevi** (INTEGER). Nema decimalnih POEN-a ni ZRNA. Jedini decimalni iznos u sistemu je kurs ZRNA (DECIMAL(20,2)) i RSD iznosi pokrovitelja (DECIMAL(12,2)).
4. **Transfer 1:1**: slanje POEN-a između korisnika je bez provizije, Protokol nije posrednik.
5. **Obračunski period**: ponoć do ponoći. Grupne operacije (ZRNO, delegacije, programi) se izvršavaju u ponoć.
6. **Pseudonimi**: nigde u javnom interfejsu ne prikazivati pravo ime. Samo admin vidi vezu pseudonim–identitet. **Pseudonim je vidljiv svim posetiocima (i neregistrovanim) u javnoj evidenciji transakcija i na Pijaci.**
7. **Dnevni limit Programa Protokola**: maksimalno 10% opticaja (opticaj = apsolutna vrednost minusa Protokola). Odnosi se samo na Socijalne i Operativne programe — Mehanizmi platforme i Projekti ne ulaze u ovaj limit.
8. **Kategorije emisije POENA**:
   - **Socijalni programi** — emisija po statusu primaoca (Podrška Majkama, Starijima, Posebna Briga, Školovanje); ulaze u dnevni limit.
   - **Operativni programi** — peer attestation (Program Evidencije Doprinosa); ulaze u dnevni limit.
   - **Mehanizmi platforme** — prate pravni akt ili činjenicu (verifikacija, preporuke, donacije, pokroviteljstvo, bonus rasta Zajednice); **NE ulaze u dnevni limit**.
   - **Projekti** — na osnovu odobrenog projektnog predloga (Upravni odbor / Gornje Kolo); **NE ulaze u dnevni limit**.
9. **Gradirana vidljivost podataka po ulozi**:
   - **Neregistrovan posetilac** vidi: javnu evidenciju transakcija sa pseudonimima strana (iznos, vreme, tip, opis emisija Protokola); Pijaca oglase sa pseudonimom prodavca, opisom, lokacijom, cenom; sistemske agregate; javnu rang-listu pokrovitelja.
   - **Neregistrovan posetilac** ne može: slati POEN, kupovati/prodavati na Pijaci, kontaktirati prodavca, pristupiti profilima članova, videti telefon prodavca.
   - **Neverifikovan prijavljen korisnik** vidi sve što vidi neregistrovan, plus: sopstvenu potpunu istoriju transakcija sa pseudonimima protivstrana; sopstvene notifikacije sa pseudonimima; Zajednice (naziv, oblast delovanja, broj članova, aktivnosti, bonusi).
   - **Neverifikovan prijavljen korisnik** ne vidi: rang-liste članova (donacije, preporuke); profile drugih članova; sadržaj poruka; telefon prodavca na Pijaci.
   - **Neverifikovan prijavljen korisnik** ne može: slati niti primati poruke; kupovati niti prodavati na Pijaci; otvarati profile drugih korisnika (redirect na poruku o verifikaciji).
   - **Verifikovan korisnik** ima pun pristup svim funkcionalnostima: profili članova, poruke, kupovina/prodaja na Pijaci, rang-liste, telefon prodavca.
   - Pretraga članova za neverifikovanog: dostupna isključivo u kontekstu forme za slanje POENA, vraća `{ id, pseudonim }`. Za verifikovanog vraća `{ id, pseudonim, verified, location }`.
   - Verifikacija je preduslov za pristup profilima članova, komunikacionom modulu i punoj funkcionalnosti Pijace. Javna evidencija transakcija — pseudonimi strana, iznosi, vremena — dostupna je svim posetiocima Platforme.

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
- Zaokruživanje u ZRNO konverzijama: uvek u korist Protokola — `Math.floor()` za iznos koji korisnik DOBIJA, `Math.ceil()` za iznos koji korisnik PLAĆA.
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
src/lib/banka/    — logika KOLO Protokola (emisija.ts, pokrovitelj.ts, programi.ts...)
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
- Javni prikaz (sa pseudonimom prodavca) i prijavljeni prikaz; kupovina i kontakt samo za verifikovane
- Sopstveni layout (`src/app/pijaca/layout.tsx`), stranica detalja oglasa na `/pijaca/[id]/page.tsx` (javno dostupna)

### Pretraga članova
- `ClanPretraga` komponenta (debounce 250ms, keyboard navigacija ↑↓ Enter Escape)
- Prisutna na: Dashboard (verifikovani), Sistem → Članovi, Zajednica
- Klikabilni pseudonimi u tabelama (zadruga, transakcije, sistem, dashboard)

### Zajednice
- Osnivanje Zajednice: potrebno najmanje 5 verifikovanih korisnika ukupno
- Fondacija proverava formalnu ispravnost prijave (naziv, opis interesa, interna pravila, ovlašćena lica) i evidentira Zajednicu
- **Ovlašćena lica**: 1–3 lica iz redova članova, isključivo tehnička funkcija (iniciranje transakcija sa zajedničkog računa); ne daju osnov za emisiju POEN-a
- Pristupnica (zahtev za učlanjenje) prema internim pravilima Zajednice
- Napuštanje Zajednice: `DELETE /api/zadruge/[id]` — postavlja `leftAt`, vraća ulogu na `FIZICKO_LICE` (ili ekvivalent)
- Aktivnosti Zajednice (PRIKUPLJANJE i REDISTRIBUCIJA) — koriste postojeći POEN balans Zajednice, ne zahtevaju novu emisiju
- **Bonus pragovi rasta** — Mehanizam platforme, ne ulazi u dnevni limit (svaki prag se loguje jednom u `ZadrugaBonusLog`, ne ponavlja se):
  - 5 članova (osnivanje): **50.000 POEN**
  - 10 članova: 100.000 | 20: 200.000 | 50: 500.000 | 100: 1.000.000 | 200: 2.000.000 | 500: 5.000.000
  - Formula: `broj_članova × 10.000 POEN`
- Logika: `src/lib/banka/zadruga.ts` → `proveriIEmitujBonusPrag()`

### Programi Protokola
- **Operativni program**: Program Evidencije Doprinosa — peer attestation sistem (drugi verifikovani korisnici potvrđuju doprinos)
- **Socijalni programi**: PODRSKA_MAJKAMA, PODRSKA_STARIJIMA, POSEBNA_BRIGA, SKOLOVANJE
- Svi programi otvoreni svim verifikovanim korisnicima — nezavisno od članstva u Zajednici
- Dnevni emisioni limit (10% opticaja), proporcijalno smanjenje ako se prekorači
- Redosled aktivacije: Evidencija Doprinosa (od starta) → Podrška Majkama → Podrška Starijima → Posebna Briga → Školovanje

### ZRNO
- Sticanje/povrat ZRNA (zahtev → noćni cron)
- Zaključaj/otključaj ZRNO
- Delegacija glasačke moći
- Dnevni kurs: `|Minus Protokola| / Ukupan broj ZRNA koje drži Protokol`
- **Ograničenja pri sticanju** (čl. 20): minimalni balans korisnika 10.000 POEN; maksimalno dnevno sticanje = 1% balansa POENA na kraju obračunskog perioda

### Glasanje
- Predlozi, glasanje sa ponderisanom glasačkom moći

### Pokrovitelji
- Pokrovitelj = pravno lice, nema login, ima vlasnika (verifikovani član)
- Admin kreira pokrovitelja (naziv, PIB, vlasnikId, zadrugaId?)
- Admin evidentira doprinos u RSD → vlasnik dobija bonus POEN po fiksnoj tabeli 7 nivoa (nema 1:1 konverzije)
- 10.000 → 20.000 | 20.000 → 30.000 | 50.000 → 80.000 | 100.000 → 150.000 | 200.000 → 300.000 | 500.000 → 800.000 | 1.000.000 → 1.500.000 POEN
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
- Tabs: Dashboard, Na čekanju, Zajednice, Programi, Pokrovitelji, Korisnici, Finansije, Audit log
- Audit log za sve admin akcije
- `GET /api/cron/zero-sum` — cron endpoint za Vercel (Hobby plan, smanjena frekvencija)
- `vercel.json` sa cron konfiguracijom

## Uloge u sistemu
- **Korisnik platforme** — registrovan korisnik (neverifikovan ili verifikovan)
- **Verifikovani korisnik** — korisnik koji je prošao verifikaciju identiteta
- **Član Zajednice** — verifikovani korisnik učlanjen u jednu Zajednicu
- **Admin** — Fondacija/Upravni odbor
- **Pokrovitelj** — pravno lice, nema nalog, vlasnik je verifikovani član

## Sidebar linkovi
- Neverifikovan: Početna (/sistem), Novčanik, Poruke, Pijaca, Verifikacija, Profil
- Verifikovan: Početna (/sistem), Novčanik, Poruke, Pijaca, Zajednica, Programi, ZRNO, Glasanje, Preporuke, Donacije, Pokroviteljstvo, Profil
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

### Programi Protokola
- `GET /api/programi`
- `POST /api/programi/[type]/prijava`
- `POST /api/admin/programi/[type]/toggle`
- `POST /api/admin/programi/enrollments/[id]/odobri`
- `POST /api/admin/programi/enrollments/[id]/odbij`

### Zajednice
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
- `GET /api/javno/feed` — javna evidencija transakcija sa pseudonimima (bez autentikacije)
- `GET /api/notifikacije`
- `PATCH /api/notifikacije`
- `GET /api/cron/zero-sum` — Vercel cron endpoint

## Biblioteka funkcija (`src/lib/`)

- `banka/emisija.ts` — `emitujPoen()`: emisija POEN-a iz Protokola, zero-sum validacija
- `banka/programi.ts` — `izracunajDnevniIznos()`, `izvrsiNocnuEmisiju()`, `labelPrograma()`
- `banka/pokrovitelj.ts` — `evidentirajDoprinos()`, fiksna tabela 7 nivoa, `bonusZaNivo()`, `izracunajNivo()`
- `banka/donacija.ts` — `izracunajBonusZaDonaciju()`, `evidentirajDonaciju()`: fiksni pragovi, nema kurs
- `banka/zadruga.ts` — bonus Zajednice pri osnivanju i pragovima rasta; Mehanizam platforme (ne ulazi u dnevni limit)
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
