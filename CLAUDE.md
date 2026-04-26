# KOLO Platforma

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru. Koristi dve interne jedinice:
- **POEN** — jedinica evidencije doprinosa zajedničkom dobru (NIJE novac, NIJE pravo, prospektivan pristup budućim dobrima)
- **ZRNO** — upravljačka jedinica za glasanje u Gornjem Kolu

Sistem funkcioniše kroz Fondaciju, mrežu **Krugova** (lokalnih operativnih grupa), KOLO **Protokol** (softverski protokol) i korisnike. **KOLO Zajednica** je opisni pojam za sveukupnost svih korisnika platforme — nije pravni entitet i nema organe.

## Tech stack
- Next.js 16 (App Router), TypeScript
- PostgreSQL, Prisma ORM 7
- NextAuth.js (credentials provider)
- Tailwind CSS v4
- Srpski jezik (latinica) u celom interfejsu
- **Nema instaliranog zod, decimal.js, ni sličnih library-a** — validacija ručno, Decimal tipovi se konvertuju sa `Number()`

## Fundamentalna pravila sistema

1. **Zero-sum princip**: zbir svih računa (uključujući Protokol) = 0. Protokol ide u minus pri svakoj emisiji.
2. **Nema negativnog stanja**: korisnici i Krugovi nikad ispod 0. Samo Protokol može u minus.
3. **POEN i ZRNO su celi brojevi** (INTEGER). Nema decimalnih POEN-a ni ZRNA. Jedini decimalni iznos u sistemu je kurs ZRNA (DECIMAL(20,2)) i RSD iznosi pokrovitelja (DECIMAL(12,2)).
4. **Transfer 1:1**: slanje POEN-a između korisnika je bez provizije, Protokol nije posrednik.
5. **Obračunski period**: ponoć do ponoći. Grupne operacije (ZRNO, delegacije, programi) izvršavaju se u ponoć **istog obračunskog perioda** (bez dodatnog perioda čekanja od 1 dan kao u v2.0).
6. **Pseudonimi**: nigde u javnom interfejsu ne prikazivati pravo ime. Samo admin vidi vezu pseudonim–identitet. **Pseudonim je vidljiv svim posetiocima (i neregistrovanim) u javnoj evidenciji transakcija i na Pijaci.**
7. **Dnevni limit Programa Protokola**: maksimalno 10% opticaja (opticaj = apsolutna vrednost minusa Protokola). Odnosi se samo na Socijalne i Operativne programe — Mehanizmi platforme i Projekti ne ulaze u ovaj limit.
8. **Kategorije emisije POENA**:
   - **Socijalni programi** — emisija po statusu primaoca (Podrška Majkama/primarnim starateljima, Podrška Starijima, Posebna Briga, Školovanje); ulaze u dnevni limit.
   - **Operativni program** — Program Evidencije Doprinosa (PED), kroz **međusobno potvrđivanje doprinosa**; ulazi u dnevni limit.
   - **Mehanizmi platforme** — prate pravni akt ili činjenicu (verifikacija, preporuke, donacije, pokroviteljstvo, bonus rasta Kruga); **NE ulaze u dnevni limit**.
   - **Projekti** — na osnovu odobrenog projektnog predloga (Upravni odbor / Gornje Kolo); **NE ulaze u dnevni limit**.
9. **Gradirana vidljivost podataka po ulozi**:
   - **Neregistrovan posetilac** vidi: javnu evidenciju transakcija sa pseudonimima strana; Pijaca oglase sa pseudonimom prodavca, opisom, lokacijom (bez mogućnosti pokretanja komunikacije); sistemske agregate; javnu rang-listu pokrovitelja.
   - **Neregistrovan posetilac** ne može: slati POEN, kontaktirati prodavca, pristupiti profilima članova.
   - **Neverifikovan prijavljen korisnik** vidi sve što vidi neregistrovan, plus: sopstvenu potpunu istoriju transakcija sa pseudonimima protivstrana; sopstvene notifikacije; Krugove (naziv, oblast delovanja, broj članova).
   - **Neverifikovan prijavljen korisnik** ne vidi: rang-liste članova; profile drugih članova; sadržaj poruka.
   - **Neverifikovan prijavljen korisnik NE MOŽE**: slati niti primati poruke; **postavljati oglase niti primati POEN za ponuđena dobra/usluge na Pijaci**; pokretati komunikaciju povodom oglasa; otvarati profile drugih korisnika.
   - **Verifikovan korisnik** ima pun pristup svim funkcionalnostima: profili članova, poruke, postavljanje i kupovina/prodaja na Pijaci, rang-liste, telefon prodavca.
   - Verifikacija je preduslov za pristup profilima članova, komunikacionom modulu i punoj funkcionalnosti Pijace, kao i za sticanje ZRNA i učešće u Programima/Projektima.

## Ključni koncepti v2.1

### Pravna priroda POEN-a (čl. 10 Pravilnika)
POEN je **jedinica evidencije doprinosa zajedničkom dobru** koja korisniku omogućava prospektivan pristup budućim dobrima u okviru zajedničkog dobra — **bez kvantifikovane vrednosti, roka dospeća, izvršnog dejstva i bez karaktera potraživanja prema Fondaciji**. Korisnik nema potraživanje prema Fondaciji za emisijom POEN-a, sticanjem ZRNA niti pristupom funkcionalnostima.

### Nasleđivanje (čl. 36)
POEN i ZRNO **nisu nasledna imovina**. Pri smrti korisnika, sredstva se vraćaju Protokolu — naslednici nemaju imovinsko pravo.

### Zaštitni veto Fondacije (čl. 71 — NOVO, još nije implementirano)
Aktivacijom Gornjeg Kola (prag −1.000.000 POEN), Fondacija zadržava veto na odluke korisnika koje bi ugrozile njenu finansijsku održivost. Veto se **trajno gasi** kada Fondacija dostigne **trostruki iznos mesečnih operativnih troškova**. Dok je veto aktivan, Projekti koji zahtevaju dinarska sredstva su zamrznuti.

Implikacija za kod: praćenje mesečnih troškova Fondacije, praćenje stanja sredstava, jednosmerni flag "veto trajno ugašen".

### Zajedničko dobro (Glava XV — NOVO)
- Izvorni kod licenciran pod **AGPL-3.0-only**.
- Sadržaj licenciran pod **CC BY-SA 4.0**.
- Doprinosi koda zahtevaju **Signed-off-by** potpis (DCO).
- **Atribucija doprinosa (ime/pseudonim) je trajna** i **preživljava anonimizaciju korisnika** — izuzetak od mehanizma brisanja podataka.

### Pijaca (čl. 14)
- Razmena na Pijaci je odgovornost korisnika prema obligacionom pravu, **ne kroz Protokol** — Fondacija/Protokol ne odgovaraju za razmene.
- **Neverifikovan korisnik NE MOŽE** postavljati oglase niti primati POEN za ponuđena dobra/usluge.
- Pun pristup (postavljanje oglasa, kontakt, razmena) — verifikovani korisnici.

### Krug (lokalna operativna grupa)
- Najmanje 5 verifikovanih korisnika oko zajedničkog interesa.
- Ima sopstveni evidencioni identifikator i zajednički POEN račun u Protokolu.
- Krug **nema** pravni subjektivitet.
- **Ovlašćena lica**: 1–3 lica iz redova članova; isključivo tehnička funkcija (iniciranje transakcija sa zajedničkog računa); ne daju osnov za emisiju POEN-a.
- **Bonus pragovi rasta** — Mehanizam platforme (NE ulazi u dnevni limit, svaki prag se loguje jednom u `KrugBonusLog`):
  - 5 članova (osnivanje): **50.000 POEN**
  - 10: 100.000 | 20: 200.000 | 50: 500.000 | 100: 1.000.000 | 200: 2.000.000 | 500: 5.000.000
  - Formula: `broj_članova × 10.000 POEN`
- Logika: `src/lib/protokol/krug.ts` → `proveriIEmitujBonusPrag()`

### Programi Protokola
- **Operativni program**: **Program Evidencije Doprinosa (PED)** — međusobno potvrđivanje doprinosa (drugi verifikovani korisnici potvrđuju evidenciju). Bez tarife po vrsti aktivnosti.
- **Socijalni programi**: PODRSKA_MAJKAMA (i **primarni staratelji**), PODRSKA_STARIJIMA, POSEBNA_BRIGA (samo **rešenje o invalidnosti** — bez medicinske dokumentacije; "hronična bolest" izbačena), SKOLOVANJE.
- Svi programi otvoreni svim verifikovanim korisnicima — nezavisno od članstva u Krugu.
- Dnevni emisioni limit (10% opticaja), proporcijalno smanjenje ako se prekorači.
- Suspenzija pre Gornjeg Kola: **samo u hitnim slučajevima, najviše 30 dana**, uz javno obrazloženje.

### Projekti (Glava VIII — proširen pristup u v2.1)
- Projekti dostupni **svim verifikovanim korisnicima**, nezavisno od članstva u Krugu.
- Izuzetak: Projekat podrške Krugovima (čl. 57) — strukturno namenjen Krugovima.

## Konvencije koda
- POEN iznosi: `INTEGER` u bazi, nikad float/decimal.
- ZRNO količine: `INTEGER` u bazi.
- Kurs ZRNA: `DECIMAL(20,2)` — jedini decimalni tip u ZRNO sistemu.
- RSD iznosi (pokrovitelji, donacije): `DECIMAL(12,2)` — konvertovati sa `Number()` pre slanja klijentu.
- Svaka operacija koja menja stanje računa: obavezno `prisma.$transaction()`.
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
src/lib/protokol/ — logika KOLO Protokola (emisija.ts, pokrovitelj.ts, programi.ts, donacija.ts, krug.ts, zrno.ts)
prisma/           — šema i migracije
docs/             — dokumentacija po fazama
```

## Implementirane funkcionalnosti

### Autentikacija i korisnici
- Registracija sa pseudonimom, email, lozinka, referral kod
- Login (NextAuth credentials)
- Verifikacija korisnika — admin ručno verifikuje (upload dokumenata ili lično); slike se čuvaju kao base64 u bazi; odobrena verifikacija emituje **1.000 POEN** korisniku
- Profil: pseudonim, lokacija (autocomplete), telefon, punoIme, opis/zanimanje (opciono, max 200 znakova) — sve u tabeli `UserPodaci`; upload profilne slike sa crop modalom
- Javni profil `/profil/[id]` — prikazuje pseudonim, lokaciju, Krug, datum; skriva email/stanje/pravo ime
- Suspenzija / isključenje korisnika (admin)
- **Brisanje naloga** (`DELETE /api/profil`): korisnik anonimizuje lične podatke, prenosi POEN ili vraća Protokolu, vrši povrat ZRNA, postavlja `deaktiviranAt`; transakcioni zapisi se čuvaju sa anonimizovanim pseudonimom; **doprinosi pod licencama Glave XV (kod, sadržaj) imaju trajnu atribuciju i NE anonimiziraju se**
- **Eksport ličnih podataka** (`GET /api/profil/eksport`): JSON sa svim korisničkim podacima osim JMBG-a; admin verzija uključuje JMBG (`GET /api/admin/korisnici/[id]/eksport`)

### Politika privatnosti — verzionisanje i pristanci
- `PolitikaVerzija` tabela: admin kreira verziju (`POST /api/admin/politika`), sistem šalje notifikacije svim aktivnim korisnicima
- `PolitikaPrihvatanje` tabela: beleži koji korisnik je prihvatio koju verziju, sa datumom
- Pri svakom loginu `AppShell` proverava `GET /api/politika/prihvati` — ako postoji nova verzija, preusmeri na `/politika-prihvati`
- `VerifikacijaPristanak` tabela: odvojen pristanak za obradu lk/JMBG podataka pri verifikaciji (odvojen od pristanka na Politiku)

### Prigovor na odluku
- `PrigovorNaOdluku` tabela: korisnik podnosi prigovor (`POST /api/prigovor`), admin odgovara (`PATCH /api/admin/prigovori/[id]`)
- Tipovi: VERIFIKACIJA, SUSPENZIJA, PROGRAM, OSTALO
- Max 3 otvorena prigovora istovremeno; odgovor u roku od 30 dana; notifikacija korisniku pri odgovoru

### GDPR cron
- `POST /api/cron/gdpr-cistenje` — pokreće se 1. u mesecu u 02:00 (vercel.json):
  - Briše verifikacione podatke (jmbg → "OBRISANO", slike null) za korisnike deaktivirane pre >10 godina (AML obaveza)
  - Briše poruke konverzacija kada je JEDNA strana deaktivirala nalog ILI je lastMessageAt >24 meseca od poslednje aktivnosti

### Audit log — GDPR proširenje
- `PRISTUP_DOKUMENT_VERIFIKACIJA` — loguje se svaki put kad admin otvori dokument lk pri verifikaciji
- `PRISTUP_JMBG_PODACI` — loguje se svaki put kad admin učita admin stranicu sa pending verifikacijama
- `ADMIN_EKSPORT_PODATAKA` — loguje se pri admin eksportu ličnih podataka korisnika

### Novčanik (POEN)
- Prikaz stanja
- Transfer POEN-a između korisnika (1:1, bez provizije)
- Istorija transakcija sa filterima; klikabilni pseudonimi u transakcijama
- QR modal: polja za iznos i opis — dinamički menjaju QR kod; `/m/[hash]` prosleđuje `amount` i `opis` na novčanik
- **Globalna javnost transakcija**: sve transakcije vidljive svim posetiocima (pseudonimi, iznos, opis, datum) — bez prikaza pravog imena

### Poruke (Chat)
- `/poruke` — split-panel: levo lista konverzacija, desno chat
- Polling 5s za nove poruke, badge nepročitanih, automatski scroll
- Enter za slanje, Shift+Enter za novi red; poruke se označavaju pročitanima pri otvaranju
- Mobilni view: lista i chat naizmenično (← nazad dugme)
- "Kontaktiraj prodavca" dugme na svakom oglasu na Pijaci
- Notifikacija primaocu pri svakoj poruci

### Pijaca (Marketplace)
- Listinzi za prodaju/razmenu (samo verifikovani korisnici)
- Pretraga po kategoriji, lokaciji
- Javni prikaz (sa pseudonimom prodavca) i prijavljeni prikaz; **kupovina, kontakt i postavljanje oglasa samo za verifikovane**
- Sopstveni layout (`src/app/pijaca/layout.tsx`), stranica detalja oglasa na `/pijaca/[id]/page.tsx` (javno dostupna; neverifikovani ne mogu pokrenuti komunikaciju)

### Pretraga članova
- `ClanPretraga` komponenta (debounce 250ms, keyboard navigacija ↑↓ Enter Escape)
- Prisutna na: Dashboard (verifikovani), Sistem → Članovi, Krug
- Klikabilni pseudonimi u tabelama (Krug, transakcije, sistem, dashboard)

### Krugovi (lokalne grupe)
- Osnivanje Kruga: potrebno najmanje 5 verifikovanih korisnika ukupno
- Fondacija proverava formalnu ispravnost prijave (naziv, opis interesa, interna pravila, ovlašćena lica) i evidentira Krug
- Pristupnica (zahtev za učlanjenje) prema internim pravilima Kruga
- Napuštanje Kruga: `DELETE /api/krugovi/[id]` — postavlja `leftAt`, vraća ulogu na `FIZICKO_LICE`
- Aktivnosti Kruga (PRIKUPLJANJE i REDISTRIBUCIJA) — koriste postojeći POEN balans Kruga, ne zahtevaju novu emisiju
- **Bonus pragovi rasta** — Mehanizam platforme; vidi sekciju Krug iznad
- Logika: `src/lib/protokol/krug.ts` → `proveriIEmitujBonusPrag()`

### Programi Protokola
- **Operativni program**: Program Evidencije Doprinosa (PED) — međusobno potvrđivanje doprinosa
- **Socijalni programi**: PODRSKA_MAJKAMA (majke ili primarni staratelji), PODRSKA_STARIJIMA, POSEBNA_BRIGA (samo rešenje o invalidnosti, bez medicinske dokumentacije), SKOLOVANJE
- Svi programi otvoreni svim verifikovanim korisnicima — nezavisno od članstva u Krugu
- Dnevni emisioni limit (10% opticaja), proporcijalno smanjenje ako se prekorači
- Redosled aktivacije: PED (od starta) → Podrška Majkama → Podrška Starijima → Posebna Briga → Školovanje

### ZRNO
- Sticanje/povrat ZRNA (zahtev → noćni cron, izvršava se u ponoć)
- Zaključaj/otključaj ZRNO — promena se izvršava **u ponoć istog obračunskog perioda** (bez dodatnog perioda čekanja)
- Delegacija glasačke moći
- Dnevni kurs: `|Minus Protokola| / Ukupan broj ZRNA koje drži Protokol`
- **Ograničenja pri sticanju** (čl. 20): minimalno stanje korisnika 10.000 POEN; maksimalno dnevno sticanje = 1% stanja POENA na kraju obračunskog perioda

### Glasanje
- Predlozi, glasanje sa ponderisanom glasačkom moći

### Pokrovitelji
- Pokrovitelj = pravno lice, nema login, ima vlasnika (verifikovani član)
- Pokrovitelj može biti vezan za jedan Krug (opciono — `Pokrovitelj.krug` relacija)
- Admin kreira pokrovitelja (naziv, PIB, vlasnikId, krugId?)
- Admin evidentira doprinos u RSD → vlasnik dobija bonus POEN po fiksnoj tabeli 7 nivoa (nema 1:1 konverzije)
- 10.000 → 20.000 | 20.000 → 30.000 | 50.000 → 80.000 | 100.000 → 150.000 | 200.000 → 300.000 | 500.000 → 800.000 | 1.000.000 → 1.500.000 POEN
- Sve se emituje kao **jedna transakcija** sa opisom `"Bonus za pokroviteljstvo iznos X"`
- Javna stranica: `/pokrovitelji`, app stranica: `/postani-pokrovitelj`
- Logika: `src/lib/protokol/pokrovitelj.ts`

### Donacije
- Donacije fizičkih lica Fondaciji (RSD), admin potvrđuje, emisija POEN-a
- Rang tabela 18 nivoa (kurs 1,00× do 5,00×) — kumulativna donacija određuje nivo, kurs tog nivoa primenjuje se na celu novu donaciju; zaokruživanje sa `Math.round()`
- Jedna transakcija sa opisom `"Bonus za donaciju iznos X"`
- Logika: `src/lib/protokol/donacija.ts` → `izracunajBonusZaDonaciju()`

### Preporuke
- Referral sistem, nagrade po tabeli

### Notifikacije
- Bell ikona u Header-u sa badge-om nepročitanih
- Dropdown panel sa listom, "Označi sve kao pročitano"
- Toast koji se pojavljuje u realnom vremenu (polling 15s) kad stigne nova notifikacija
- `posaljiNotifikaciju()` helper u `src/lib/notifikacije.ts`
- Trigeri: transfer primljen, verifikacija odobrena/odbijena, Krug odobren/odbijen, pristupnica prihvaćena, program enrollment odobren/odbijen, oglas kupljen, nova poruka

### Početna / Sistem (spojene stranice)
- `/dashboard` redirectuje na `/sistem`
- Sidebar: "Početna" vodi na `/sistem`, nema duplog linka
- Vrh stranice: lični pregled (stanje, poslednje transakcije)
- 4 kartice u 2×2 gridu sa statistikama i "danas" vrednostima: Članovi, Transakcije (gornji red), Krugovi, Opticaj (donji red)
- Kartica Opticaj: zero-sum provera sa kvačicom
- Klikabilne kartice vode na filtrirane prikaze (Članovi, Transakcije, Programi, Krugovi)

### Admin panel
- Tabs: Dashboard, Na čekanju, Krugovi, Programi, Pokrovitelji, Korisnici, Finansije, Audit log
- Audit log za sve admin akcije
- `GET /api/cron/zero-sum` — cron endpoint za Vercel (Hobby plan, smanjena frekvencija)
- `vercel.json` sa cron konfiguracijom

## Uloge u sistemu
- **Korisnik platforme** — registrovan korisnik (neverifikovan ili verifikovan)
- **Verifikovani korisnik** — korisnik koji je prošao verifikaciju identiteta
- **Član Kruga** — verifikovani korisnik učlanjen u jedan Krug
- **Admin** — Fondacija/Upravni odbor
- **Pokrovitelj** — pravno lice, nema nalog, vlasnik je verifikovani član

## Sidebar linkovi
- Neverifikovan: Početna (/sistem), Novčanik, Poruke, Pijaca, Verifikacija, Profil
- Verifikovan: Početna (/sistem), Novčanik, Poruke, Pijaca, Krug, Programi, ZRNO, Glasanje, Preporuke, Donacije, Pokroviteljstvo, Profil
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

### Krugovi
- `GET /api/krugovi`
- `POST /api/krugovi`
- `GET /api/krugovi/[id]`
- `DELETE /api/krugovi/[id]`
- `POST /api/krugovi/[id]/pristupnica`
- `POST /api/krugovi/[id]/projekti`
- `POST /api/admin/krugovi/[id]/odobri`
- `POST /api/admin/krugovi/[id]/odbij`
- `POST /api/admin/krugovi/[id]/pristupnice/[pristupnicaId]/odobri`
- `GET /api/admin/krugovi-lista`

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
- `POST /api/zrno/prodaj` — povrat ZRNA Protokolu
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

- `protokol/emisija.ts` — `emitujPoen()`: emisija POEN-a iz Protokola, zero-sum validacija
- `protokol/programi.ts` — `izracunajDnevniIznos()`, `izvrsiNocnuEmisiju()`, `labelPrograma()`
- `protokol/pokrovitelj.ts` — `evidentirajDoprinos()`, fiksna tabela 7 nivoa, `bonusZaNivo()`, `izracunajNivo()`
- `protokol/donacija.ts` — `izracunajBonusZaDonaciju()`, `evidentirajDonaciju()`: fiksni pragovi, nema kurs
- `protokol/krug.ts` — bonus Kruga pri osnivanju i pragovima rasta; Mehanizam platforme (ne ulazi u dnevni limit)
- `protokol/zrno.ts` — `UKUPNO_ZRNA`, noćna ZRNO obrada, kurs ZRNA
- `notifikacije.ts` — `posaljiNotifikaciju(userId, tip, naslov, tekst, link?)`

## Shared komponente (`src/components/`)
- `Sidebar.tsx` — Navigacija, tamna pozadina, logo na vrhu, w-44; različiti linkovi za verifikovanog/neverifikovanog/admina
- `Header.tsx` — Puno širinom, prikaz stanja, bell notifikacije (polling 15s), toast, dugme za odjavu
- `AppShell.tsx` — Layout wrapper; sadržaj kontejner max-w-[940px]
- `PublicHeader.tsx` — Header za javne stranice (logo, linkovi, Pokrovitelji)
- `LokacijaSearch.tsx` — Autocomplete za srpska naselja (keyboard navigacija ↑↓ Enter Escape)
- `ClanPretraga.tsx` — Autocomplete za pretragu članova, navigira na `/profil/[id]`
- `Providers.tsx` — NextAuth SessionProvider wrapper
- `EmptyState.tsx` — Reusable empty state komponenta

## Testovi
- Framework: **Vitest** (`npm test` za jednokratno, `npm run test:watch` za watch mode)
- Lokacija: `__tests__/banka/` — unit testovi za čiste funkcije bez baze (folder još nije preimenovan u `protokol/`, ali sadržaj radi sa novom protokol/ strukturom)
- Pokriva: `emisija.ts` (preporukaNagrada), `pokrovitelj.ts` (bonusZaNivo, izracunajNivo), `donacija.ts` (nivoZaKumulativ, izracunajPoenZaDonaciju), `programi.ts` (izracunajMajke, izracunajStariji, izracunajDnevniIznos)
- Config: `vitest.config.ts` sa path aliasom `@/` → `src/`

## Reference
- `PLAN.md` — pregled svih faza sa zavisnostima
- `docs/schema-plan.md` — kompletna šema baze
- `docs/faza-X-*.md` — detalji implementacije po fazama
- `dokumentacija/Pravilnik 2.12.md` — najnoviji Pravilnik (v2.1)
- `dokumentacija/STATUT v2.1.md` — Statut Fondacije
- `dokumentacija/Politika v2.1.md` — Politika privatnosti
- `dokumentacija/Uslovi v2.1.md` — Uslovi korišćenja

## Nezavršeni TODO

- **Zaštitni veto Fondacije** (čl. 71 Pravilnika) — još nije implementiran. Potrebno:
  - Tabela/polje za praćenje mesečnih operativnih troškova Fondacije.
  - Tabela/polje za praćenje stanja sredstava Fondacije (RSD).
  - Jednosmerni flag "veto aktivan" / "veto trajno ugašen" (gasi se kada sredstva ≥ 3× mesečni troškovi).
  - Logika: dok je veto aktivan, Projekti koji zahtevaju dinarska sredstva su zamrznuti.
- **Trajna atribucija doprinosa pri anonimizaciji** (Glava XV) — kada platforma bude imala modul za doprinose koda/sadržaja pod licencama Glave XV, `DELETE /api/profil` mora da NE briše atribuciju (ime/pseudonim) za te doprinose. Trenutno nije relevantno jer modul ne postoji.
- **Migracija `20260424000000_rename_zadruga_to_krug` mora da se primeni na production bazu** sa `npx prisma migrate deploy`.
