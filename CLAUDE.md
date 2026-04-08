# KOLO Platforma

## Opis projekta
Alternativni ekonomski sistem zasnovan na uzajamnosti. Koristi dve interne jedinice:
- **POEN** — jedinica evidencije doprinosa (NIJE novac)
- **ZRNO** — upravljačka jedinica za glasanje

Sistem funkcioniše kroz Fondaciju, mrežu lokalnih zadruga, KOLO Banku (softverski protokol) i članove.

## Tech stack
- Next.js 14+ (App Router), TypeScript
- PostgreSQL, Prisma ORM
- NextAuth.js (credentials provider)
- Tailwind CSS
- Srpski jezik (latinica) u celom interfejsu

## Fundamentalna pravila sistema

1. **Zero-sum princip**: zbir svih računa (uključujući Banku) = 0. Banka ide u minus pri svakoj emisiji.
2. **Nema negativnog balansa**: korisnici i zadruge nikad ispod 0. Samo Banka može u minus.
3. **POEN i ZRNO su celi brojevi** (INTEGER). Nema decimalnih POEN-a ni ZRNA. Jedini decimalni iznos u sistemu je kurs ZRNA (DECIMAL(20,2)).
4. **Transfer 1:1**: slanje POEN-a između članova je bez provizije, Banka nije posrednik.
5. **Obračunski period**: ponoć do ponoći. Grupne operacije (ZRNO, delegacije, programi) se izvršavaju u ponoć.
6. **Pseudonimi**: nigde u javnom interfejsu ne prikazivati pravo ime. Samo admin vidi vezu pseudonim–identitet.
7. **Dnevni limit programa Banke**: maksimalno 10% opticaja (opticaj = apsolutna vrednost minusa Banke).

## Konvencije koda

- POEN iznosi: `INTEGER` u bazi, nikad float/decimal.
- ZRNO količine: `INTEGER` u bazi.
- Kurs ZRNA: `DECIMAL(20,2)` — jedini decimalni tip u sistemu.
- Svaka operacija koja menja balans: obavezno `prisma.$transaction()`.
- Zero-sum provera: pozivati `checkZeroSum()` nakon svake transakcije u dev modu.
- API rute: srpski termini (`/api/clanovi`, `/api/transakcije`, `/api/zadruge`).
- Fontovi: koristiti fontove koji podržavaju srpsku latinicu (č, ć, š, ž, đ).

## Struktura foldera
```
src/app/          — Next.js stranice (App Router)
src/components/   — React komponente
src/lib/          — pomoćne funkcije, validacije
src/lib/banka/    — logika KOLO Banke (emisija, kurs, limiti)
prisma/           — šema i migracije
docs/             — dokumentacija po fazama
```

## Uloge u sistemu
- **Fizičko lice** — registrovan korisnik
- **Zadrugar** — fizičko lice učlanjeno u zadrugu
- **Admin** — Fondacija/Upravni odbor
- **Pokrovitelj** — pravno lice, nije član sistema (buduća faza)

## Implementirane stranice

### Javne (bez prijave)
- `/` — Landing page: hero, statistike, "Kako funkcioniše", "Kako do POEN", primer iz prakse, transparentnost, FAQ, CTA
- `/login` — Prijava (email + lozinka, NextAuth credentials)
- `/registracija` — Registracija (pseudonim, email, lozinka, opciono referral kod)
- `/kako-funkcionise` — Edukativna stranica
- `/pijaca` — Javni pregled Pijace (bez kontakt podataka, bez pseudonima)
- `/m/[hash]` — Javna referral stranica (prikazuje pseudonim vlasnika hash-a)

### App (zahteva prijavu) — `/src/app/(app)/`
- `/dashboard` — Pregled stanja: POEN balans, ZRNO, poslednje transakcije, brzi linkovi
- `/novcanik` — Novčanik: slanje POEN-a (transfer), istorija transakcija
- `/profil` — Profil: promena pseudonima, lozinke, lokacije (search), telefona; prikaz referral linka
- `/profil/oglasi` — Korisnikovi aktivni oglasi na Pijaci
- `/pijaca` — Marketplace: lista oglasa, filteri (kategorija, lokacija), pretraga
- `/pijaca/[id]` — Detalj oglasa: opis, cena, kupovina za POEN (samo verifikovani)
- `/pijaca/novi-oglas` — Kreiranje novog oglasa (naziv, opis, cena, kategorija, slike, lokacija, telefon)
- `/preporuke` — Preporuke: referral link, QR kod, istorija nagrada, stablo preporuka
- `/donacije` — Donacije: podnošenje zahteva za donaciju, istorija donacija, kurs POEN/RSD
- `/verifikacija` — Zahtev za verifikaciju identiteta: upload dokumenata (prednja/zadnja strana) ili lično
- `/programi` — Programi Banke: katalog 5 programa, prijava, evidencija (Zapošljavanje), emisioni kontekst
- `/zajednica` — Lista zadruga: pregled, filter, pretraga, CTA za osnivanje
- `/zajednica/osnivanje` — Forma za osnivanje zadruge (sedište, naziv, opis, osnivači — min 5)
- `/zajednica/[id]` — Detalj zadruge: info, članovi, projekti, pristupnice (admin), programi (admin)
- `/glasanje` — Lista glasanja: aktivni predlozi, ZRNO težine, rok
- `/glasanje/[id]` — Detalj predloga: opis, glasanje Za/Protiv, prikaz rezultata
- `/zrno` — ZRNO upravljanje: stanje (slobodno/aktivno), kupovina, prodaja, zaključavanje, delegacija
- `/sistem` — Javna transparentnost (tabovi): Pregled, Članovi, Transakcije, Programi, Zadruge
- `/admin` — Admin panel (tabovi): Dashboard, Na čekanju, Zadruge, Programi, Korisnici, Finansije, Audit log

## Implementirani API endpointi

### Autentifikacija i korisnici
- `POST /api/registracija` — Registracija novog korisnika
- `GET /api/provjeri-pseudonim` — Live provera dostupnosti pseudonima
- `PATCH /api/profil/pseudonim` — Promena pseudonima
- `PATCH /api/profil/lozinka` — Promena lozinke
- `PATCH /api/profil/lokacija` — Promena lokacije i telefona
- `GET /api/profil/balans` — Trenutni balans korisnika
- `GET /api/korisnici/pretraga` — Pretraga korisnika po pseudonimu (za osnivanje zadruge)
- `GET /api/m/[hash]/pseudonim` — Dohvati pseudonim za referral hash

### Novčanik i transakcije
- `POST /api/transfer` — Slanje POEN-a drugom korisniku
- `GET /api/novcanik/transakcije` — Istorija transakcija korisnika

### Pijaca
- `GET /api/pijaca` — Lista oglasa (javno, sa filterima)
- `POST /api/pijaca` — Kreiranje oglasa
- `GET /api/pijaca/[id]` — Detalj oglasa
- `DELETE /api/pijaca/[id]` — Brisanje oglasa
- `POST /api/pijaca/[id]/kupi` — Kupovina oglasa za POEN
- `GET /api/pijaca/slika/[listingId]/[idx]` — Prikaz slike oglasa

### Verifikacija
- `POST /api/verifikacija` — Podnošenje zahteva za verifikaciju
- `GET /api/admin/dokument/[requestId]/[side]` — Pregled dokumenta (admin)
- `POST /api/admin/verifikacija/[id]` — Odobravanje verifikacije (admin)
- `POST /api/admin/verifikacija/[id]/odbij` — Odbijanje verifikacije (admin)

### Preporuke i donacije
- `GET /api/preporuke` — Stablo preporuka i istorija nagrada
- `POST /api/donacije` — Podnošenje zahteva za donaciju
- `GET /api/donacije` — Istorija donacija korisnika
- `GET/POST /api/admin/donacija` — Pregled i potvrda donacija (admin)

### Programi Banke
- `GET /api/programi` — Lista programa sa statusom enrollmenta
- `POST /api/programi/[type]/prijava` — Prijava na program
- `POST /api/programi/zaposljavnje/evidencija` — Dnevna evidencija (Zapošljavanje)
- `POST /api/admin/programi/[type]/toggle` — Aktivacija/deaktivacija programa (admin)
- `POST /api/admin/programi/enrollments/[id]/odobri` — Odobravanje enrollmenta (admin)
- `POST /api/admin/programi/enrollments/[id]/odbij` — Odbijanje enrollmenta (admin)
- `POST /api/admin/programi/zaposljavnje/[id]/odobri` — Odobravanje evidencije (admin)
- `POST /api/admin/programi/zaposljavnje/[id]/odbij` — Odbijanje evidencije (admin)
- `POST /api/zadruge/[id]/programi/enrollments/[enrollmentId]/odobri` — Odobravanje enrollmenta (zadruga admin)
- `POST /api/zadruge/[id]/programi/enrollments/[enrollmentId]/odbij` — Odbijanje enrollmenta (zadruga admin)
- `POST /api/zadruge/[id]/programi/evidencije/[evidencijaId]/odobri` — Odobravanje evidencije (zadruga admin)
- `POST /api/zadruge/[id]/programi/evidencije/[evidencijaId]/odbij` — Odbijanje evidencije (zadruga admin)

### Zadruge
- `GET /api/zadruge` — Lista zadruga
- `POST /api/zadruge` — Podnošenje zahteva za osnivanje zadruge
- `GET /api/zadruge/[id]` — Detalj zadruge
- `DELETE /api/zadruge/[id]` — Istupanje iz zadruge
- `POST /api/zadruge/[id]/pristupnica` — Podnošenje pristupnice
- `POST /api/zadruge/[id]/projekti` — Kreiranje projekta zadruge
- `POST /api/admin/zadruge/[id]/odobri` — Odobravanje osnivanja (admin, emituje 50.000 POEN)
- `POST /api/admin/zadruge/[id]/odbij` — Odbijanje osnivanja (admin)
- `POST /api/admin/zadruge/[id]/pristupnice/[pristupnicaId]/odobri` — Odobravanje pristupnice (admin/zadruga admin)
- `GET /api/admin/zadruge-lista` — Lista svih zadruga (admin)

### ZRNO sistem
- `GET /api/zrno` — ZRNO stanje (slobodno, aktivno, kurs, tržište)
- `POST /api/zrno/kupi` — Zahtev za kupovinu ZRNA
- `POST /api/zrno/prodaj` — Zahtev za prodaju ZRNA
- `POST /api/zrno/zakljucaj` — Zahtev za zaključavanje ZRNA
- `POST /api/zrno/otkljucaj` — Zahtev za otključavanje ZRNA
- `POST /api/zrno/delegiraj` — Delegacija glasačkih prava
- `POST /api/admin/zrno/nocna` — Noćna ZRNO obrada (admin/cron)

### Glasanje
- `GET /api/glasanje` — Lista predloga
- `POST /api/glasanje` — Kreiranje predloga (admin)
- `GET /api/glasanje/[id]` — Detalj predloga
- `POST /api/glasanje/[id]/glasaj` — Glasanje Za/Protiv

### Admin i sistem
- `GET /api/admin/dashboard` — Agregirani podaci za admin dashboard
- `GET /api/admin/transakcije` — Sve transakcije (admin)
- `POST /api/admin/emisija/nocna` — Ručno pokretanje noćne emisije (admin)
- `POST /api/cron/nocna-emisija` — Cron trigger za noćnu emisiju
- `GET /api/admin/audit-log` — Audit log (admin)
- `POST /api/admin/korisnici/[id]/suspenduj` — Suspenzija korisnika (admin)
- `POST /api/admin/korisnici/[id]/aktiviraj` — Aktivacija korisnika (admin)
- `POST /api/admin/korisnici/[id]/iskljuci` — Isključenje korisnika (admin)
- `POST /api/admin/korisnici/[id]/rucna-verifikacija` — Ručna verifikacija (admin)
- `GET /api/admin/zero-sum` — Provera zero-sum integriteta (admin)
- `GET /api/javno/statistike` — Javne statistike (broj članova, opticaj)
- `GET /api/notifikacije` — Notifikacije korisnika

## Biblioteka funkcija (`src/lib/banka/`)

- `emisija.ts` — `emitujPoen()`: emisija POEN-a iz Banke, zero-sum validacija
- `programi.ts` — `izracunajDnevniIznos()`, `izvrsiNocnuEmisiju()`, `labelPrograma()`: logika programa Banke
- `donacija.ts` — Logika donacija, kurs POEN/RSD
- `zadruga.ts` — Bonus zadruge pri osnivanju (50.000 POEN)
- `zrno.ts` — `UKUPNO_ZRNA`, noćna ZRNO obrada, kurs ZRNA

## Shared komponente (`src/components/`)

- `Sidebar.tsx` — Navigacija (različiti linkovi za verifikovanog/neverifikovanog/admina)
- `Header.tsx` — Gornji header sa odjava dugmetom
- `PublicHeader.tsx` — Header za javne stranice (logo, login/registracija linkovi)
- `LokacijaSearch.tsx` — Autocomplete polje za srpska naselja (client-side, ~840 naselja, dijakritike-tolerantno)
- `Providers.tsx` — NextAuth SessionProvider wrapper
- `EmptyState.tsx` — Reusable empty state komponenta

## Reference
- `PLAN.md` — pregled svih faza sa zavisnostima
- `docs/schema-plan.md` — kompletna šema baze
- `docs/faza-X-*.md` — detalji implementacije po fazama
