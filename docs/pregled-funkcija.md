# KOLO Platforma — Pregled funkcija (v2.1)

## Šta je KOLO

KOLO je platforma alternativnog ekonomskog sistema zasnovana na uzajamnosti i doprinosu zajedničkom dobru. Nije banka ni kripto projekat — to je mreža lokalnih **Krugova** u kojoj doprinos zajednici ima vrednost.

Sistem koristi dve interne jedinice:
- **POEN** — jedinica evidencije doprinosa zajedničkom dobru (ceo broj, ne može ići u minus, ne ističe; nije pravo, već prospektivan pristup budućim dobrima)
- **ZRNO** — upravljačka jedinica za glasanje u Gornjem Kolu (stiče se za POEN po dnevnom kursu)

**Zero-sum pravilo**: zbir svih POEN-a u sistemu uvek je 0. Samo Protokol može imati negativno stanje.

---

## Uloge korisnika

| Uloga | Opis |
|---|---|
| Gost (neregistrovan) | Može da gleda pijacu i landing page |
| Fizičko lice (neverifikovan) | Registrovan, ali nije potvrdio identitet; ne može postavljati oglase ni primati POEN za ponuđena dobra |
| Fizičko lice (verifikovan) | Pun pristup: novčanik, pijaca, Krug, programi, glasanje |
| Član Kruga | Verifikovan korisnik učlanjen u jedan Krug |
| Admin | Fondacija — odobrava verifikacije, upravlja sistemom |

---

## Javne stranice (bez prijave)

### `/` — Landing stranica
- Hero sekcija sa opisom sistema
- Živi widget: broj verifikovanih članova + POEN u opticaju (iz baze)
- Prikaz programa Protokola (Verifikacija, Donacije, Podrška porodicama)
- CTA: Registruj se / Kako funkcioniše

### `/pijaca` — Pijaca (javna)
- Isti oglasi kao za prijavljene korisnike (kategorija, opis, lokacija, pseudonim)
- Posetioci ne mogu pokrenuti komunikaciju ili kupiti
- Nema dugmeta za kupovinu — prikazuje se poziv na registraciju/verifikaciju

### `/kako-funkcionise` — Edukativna stranica
- 4 koraka do aktivnog članstva
- Objašnjenje POEN-a i ZRNO-a
- Opis oba kanala verifikacije (upload vs lično)
- Pregled programa Protokola

---

## Auth stranice

### `/login` — Prijava
- Email + lozinka
- NextAuth credentials provider

### `/registracija` — Registracija
- Email, pseudonim (javno vidljiv, bez pravog imena), lozinka
- **Live provera pseudonima** — debounce 400ms, API `/api/provjeri-pseudonim`
- **Indikator jačine lozinke** — 4 nivoa (Slaba/Srednja/Dobra/Jaka)
- Checkbox-ovi za Uslove korišćenja i Politiku privatnosti
- Dugme je zaključano dok pseudonim nije slobodan i oba checkbox-a nisu čekirana

---

## App stranice (zahtevaju prijavu)

### `/sistem` — Početna
- Kartica sa stanjem POEN-a (gradient zelena)
- Kartica sa ukupnim opticajem u sistemu
- Upozorenje + CTA za verifikaciju (ako nije verifikovan)
- 5 poslednjih transakcija sa linkovima
- 4 kartice u 2×2 gridu: Članovi, Transakcije, Krugovi, Opticaj

### `/novcanik` — Novčanik
- Stanje POEN-a (gradient kartica)
- **Pošalji POEN** — autocomplete po pseudonimu, iznos, opis
- **Moj QR** — QR kod koji kodira link za prijem; skener otvara popunjenu formu
- Filter transakcija: Sve / Primljeno / Poslato / Emisije
- Puna istorija (100 transakcija)

### `/verifikacija` — Verifikacija identiteta
- Upload prednje i zadnje strane lične karte
- Unos JMBG-a
- Prikaz statusa zahteva (na čekanju / odobreno / odbijeno)
- Ako odbijeno: prikazuje razlog i opciju ponovnog slanja

### `/pijaca` — Pijaca (za prijavljene)
- Filteri: kategorija, pretraga, min/max POEN, sortiranje
- Verifikovani korisnici vide pseudonime, mogu kupovati i postavljati oglase
- Neverifikovani vide "Verifikuj →" umesto dugmeta za kupovinu i ne mogu postavljati oglase
- Modal za potvrdu kupovine

### `/pijaca/novi-oglas` — Novi oglas
- Naslov, opis, kategorija, cena u POEN-u, lokacija
- Upload do 5 slika
- Samo verifikovani korisnici

### `/pijaca/[id]` — Detalj oglasa
- Prikaz svih slika, opisa, informacija o prodavcu
- Dugme za kupovinu i kontakt (za verifikovane)

### `/krug` — Krugovi
- Lista svih aktivnih Krugova sa brojem članova i projektima
- Filtri, pretraga
- Dugme za osnivanje novog Kruga

### `/krug/osnivanje` — Osnivanje Kruga
- Forma: naziv, opis, lokacija
- Minimalno 5 verifikovanih osnivača
- Zahtev ide na odobrenje admina
- Odobrenje nosi 50.000 POEN emisiju za novi Krug

### `/krug/[id]` — Profil Kruga
- Informacije, lista članova, aktivni projekti
- Dugme za učlanjenje (pristupnica)

### `/programi` — Programi Protokola
- Lista dostupnih programa sa statusom (aktivan/neaktivan)
- Prijava za program (enrollment)
- **Operativni program**: Program Evidencije Doprinosa (PED) — međusobno potvrđivanje doprinosa
- **Socijalni programi**: Podrška Majkama (i primarnim starateljima), Podrška Starijima, Posebna Briga, Školovanje

### `/doprinos-oglasi` — Oglasi za doprinos (PED)
- Lista oglasa za doprinos zajedničkom dobru (DoprinosOglas)
- Mogu se postavljati od strane Fondacije, Krugova ili kao deo Projekta
- Korisnik se prijavljuje, evidentira odrađene sate, drugi verifikovani korisnici potvrđuju doprinos

### `/doprinos-oglasi/[id]` — Detalj oglasa za doprinos
- Opis posla, satnica POEN/h, broj pozicija, deadline
- Dugme za prijavu (verifikovani korisnici)

### `/zrno` — ZRNO upravljanje
- Stanje ZRNA (slobodna / zaključana)
- Sticanje ZRNA od Protokola (POEN → ZRNO po dnevnom kursu)
- **Povrat** ZRNA Protokolu (umesto starog "prodaja ZRNA")
- Zaključavanje ZRNA za glasanje (izvršava se u ponoć istog obračunskog perioda, bez perioda čekanja od 1 dan)
- Otključavanje ZRNA
- Delegiranje glasačkih prava drugom članu

### `/glasanje` — Glasanje
- Lista aktivnih i zatvorenih glasanja
- Glasanje sa zaključanim ZRNO-m
- Težina glasa = broj zaključanih ZRNA

### `/profil` — Profil
- Promena pseudonima
- Promena lozinke

### `/profil/oglasi` — Moji oglasi
- Lista sopstvenih oglasa
- Brisanje / arhiviranje oglasa

---

## Admin stranice (`/admin`)

Dostupno samo korisnicima sa ulogom `ADMIN`.

### Tab: Dashboard
- Brojevi: ukupno korisnika, verifikovanih, suspendovanih
- Krugovi: ukupno, ukupno članova Krugova
- Finansije: opticaj, stanje Protokola
- ZRNO: kod korisnika, u Protokolu, ukupno
- Ukupan broj transakcija

### Tab: Na čekanju
- Zahtevi za verifikaciju identiteta (JMBG + slike lične karte)
  - Prikaz slika prednje/zadnje strane
  - Dugme "Odobri" → emisija 1.000 POEN
  - Dugme "Odbij" → unos razloga
- Zahtevi za osnivanje Kruga
  - Odobri (emisija 50.000 POEN) / Odbij

### Tab: Krugovi
- Lista svih Krugova sa statusom, stanjem, brojem članova
- Pregled pristupnica (zahtevi za učlanjenje)
- Odobravanje/odbijanje pristupnica

### Tab: Programi
- Uključivanje/isključivanje programa Protokola
- Odobravanje enrollment zahteva
- Odobravanje evidencija doprinosa (PED program)
- Pokretanje noćne emisije ručno

### Tab: Korisnici
- Pretraga po pseudonimu
- Pregled statusa (ACTIVE / SUSPENDED / EXCLUDED)
- **Ručna verifikacija (Kanal 2)** — admin unosi JMBG za korisnike koje je video lično
- Suspenzija korisnika (sa razlogom)
- Aktivacija suspendovanog korisnika
- Isključivanje korisnika iz sistema

### Tab: Finansije
- Donacija — unos iznosa u RSD, emisija POEN-a po formuli
- Prikaz poslednjih noćnih emisija (opticaj, limit, emitovano, koeficijent)

### Tab: Audit log
- Hronološki zapis svih admin akcija

---

## Notifikacije

- Zvonce u headeru sa crvenim badge brojacem
- Dropdown panel sa listom poslednjih 30 obaveštenja
- Zelena tačka = nepročitano
- Automatski refresh svakih 30 sekundi
- "Označi sve kao pročitano"
- Klik na notifikaciju vodi na relevantnu stranicu

**Trigeri koji šalju notifikaciju:**
- Primljeni POEN transfer
- Verifikacija odobrena (upload i ručni kanal)
- Krug odobren / odbijen
- Pristupnica prihvaćena
- Program enrollment odobren / odbijen
- Oglas kupljen
- Nova poruka

---

## KOLO Protokol — pravila emisije

- Protokol je softverski protokol, nema fizičku adresu
- Stanje Protokola uvek negativno (on emituje, korisnici primaju)
- **Dnevni limit**: max 10% od opticaja može se emitovati u jednom danu
- Ako je zatraženo više od limita, svaki korisnik dobija proporcionalni deo (koeficijent < 1)
- Noćna emisija se pokreće automatski u ponoć (ili ručno iz admin panela)
- Mehanizmi platforme i Projekti **NE ulaze u dnevni limit**

---

## Tehničke napomene za AI asistente

- Stranice: Next.js 16+ App Router, TypeScript
- Baza: PostgreSQL + Prisma ORM 7
- Auth: NextAuth.js (JWT, credentials provider)
- Stilovi: Tailwind CSS v4 sa custom KOLO design tokenima
- Jezik interfejsa: srpski (latinica)
- POEN iznosi: uvek celi brojevi (INTEGER), nikad decimalni
- ZRNO količine: uvek celi brojevi (INTEGER)
- Kurs ZRNA: jedini decimalni tip (DECIMAL 20,2)
- Sve operacije koje menjaju stanje: `prisma.$transaction()`
- API rute su na srpskom: `/api/krugovi`, `/api/doprinos-oglasi`, `/api/transakcije`, itd.
- Biznis logika u `src/lib/protokol/` (donacija, emisija, krug, pokrovitelj, programi, zrno)
- Middleware (`src/middleware.ts`): blokira neautorizovane korisnike, osim javnih ruta (/, /pijaca, /kako-funkcionise)
