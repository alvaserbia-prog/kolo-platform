# KOLO Platforma — Pregled funkcija

## Šta je KOLO

KOLO je platforma alternativnog ekonomskog sistema zasnovana na uzajamnosti. Nije banka ni kripto projekat — to je mreža lokalnih zadruga u kojoj doprinos zajednici ima vrednost.

Sistem koristi dve interne jedinice:
- **POEN** — evidencija doprinosa (ceo broj, ne može ići u minus, ne ističe)
- **ZRNO** — upravljačka jedinica za glasanje (kupuje se za POEN, kurs raste sa donacijama)

**Zero-sum pravilo**: zbir svih POEN-a u sistemu uvek je 0. Samo Banka može imati negativan saldo.

---

## Uloge korisnika

| Uloga | Opis |
|---|---|
| Gost (neregistrovan) | Može da gleda pijacku i landing page |
| Fizičko lice (neverifikovan) | Registrovan, ali nije potvrdio identitet |
| Fizičko lice (verifikovan) | Pun pristup: novčanik, pijaca, zajednica, programi, glasanje |
| Zadrugar | Verifikovan korisnik koji je član zadruge |
| Admin | Fondacija — odobrava verifikacije, upravlja sistemom |

---

## Javne stranice (bez prijave)

### `/` — Landing stranica
- Hero sekcija sa opisom sistema
- Živi widget: broj verifikovanih članova + POEN u opticaju (iz baze)
- Prikaz programa Banke (Verifikacija, Preporuke, Donacije, Podrška porodicama)
- CTA: Registruj se / Kako funkcioniše

### `/pijaca` — Pijaca (javna)
- Isti oglasi kao za prijavljene korisnike
- Posetioci ne vide pseudonime prodavaca
- Nema dugmeta za kupovinu — prikazuje se poziv na registraciju

### `/kako-funkcionise` — Edukativna stranica
- 4 koraka do aktivnog članstva
- Objašnjenje POEN-a i ZRNO-a
- Opis oba kanala verifikacije (upload vs lično)
- Pregled programa Banke

---

## Auth stranice

### `/login` — Prijava
- Email + lozinka
- NextAuth credentials provider

### `/registracija` — Registracija
- Email, pseudonim (javno vidljiv, bez pravog imena), lozinka
- **Live provera pseudonima** — debounce 400ms, API `/api/provjeri-pseudonim`
- **Indikator jačine lozinke** — 4 nivoa (Slaba/Srednja/Dobra/Jaka)
- **Referral kod** — opciono, unosi se tokom registracije
- Checkbox-ovi za Uslove korišćenja i Politiku privatnosti
- Dugme je zaključano dok pseudonim nije slobodan i oba checkbox-a nisu čekirana

---

## App stranice (zahtevaju prijavu)

### `/dashboard` — Početna
- Kartica sa stanjem POEN-a (gradient zelena)
- Kartica sa ukupnim opticajem u sistemu
- Upozorenje + CTA za verifikaciju (ako nije verifikovan)
- 5 poslednjih transakcija sa linkovima

### `/novcanik` — Novčanik
- Stanje POEN-a (gradient kartica)
- **Pošalji POEN** — autocomplete po pseudonimu, iznos, opis
- **Moj QR** — QR kod koji kodira link za prijem; skener otvara popunjenu formu
  - Format: `/novcanik?plati=Pseudonim`
- Filter transakcija: Sve / Primljeno / Poslato / Emisije
- Puna istorija (100 transakcija)

### `/verifikacija` — Verifikacija identiteta
- Upload prednje i zadnje strane lične karte
- Unos JMBG-a
- Prikaz statusa zahteva (na čekanju / odobreno / odbijeno)
- Ako odbijeno: prikazuje razlog i opciju ponovnog slanja

### `/pijaca` — Pijaca (za prijavljene)
- Iste filteri: kategorija, pretraga, min/max POEN, sortiranje
- Verifikovani korisnici vide pseudonime i mogu kupovati
- Neverifikovani vide "Verifikuj →" umesto dugmeta za kupovinu
- Modal za potvrdu kupovine

### `/pijaca/novi-oglas` — Novi oglas
- Naslov, opis, kategorija, cena u POEN-u, lokacija
- Upload do 5 slika
- Samo verifikovani korisnici

### `/pijaca/[id]` — Detalj oglasa
- Prikaz svih slika, opisa, informacija o prodavcu
- Dugme za kupovinu (za verifikovane)

### `/zajednica` — Zadruge
- Lista svih aktivnih zadruga sa brojem članova i projektima
- Filtri, pretraga
- Dugme za osnivanje nove zadruge

### `/zajednica/osnivanje` — Osnivanje zadruge
- Forma: naziv, opis, lokacija
- Minimalno 3 verifikovana osnivača
- Zahtev ide na odobrenje admina
- Odobrenje nosi 50.000 POEN emisiju za zadrugu

### `/zajednica/[id]` — Profil zadruge
- Informacije, lista članova, aktivni projekti
- Dugme za učlanjenje (pristupnica)

### `/programi` — Programi Banke
- Lista dostupnih programa sa statusom (aktivan/neaktivan)
- Prijava za program (enrollment)
- Programi: Verifikacija, Preporuke, Donacije, Zapošljavanje, Podrška porodicama

### `/zrno` — ZRNO upravljanje
- Stanje ZRNA (slobodna / zaključana)
- Kupovina ZRNA od Banke (POEN → ZRNO po kursu)
- Prodaja ZRNA nazad u Banku
- Zaključavanje ZRNA za glasanje
- Otključavanje ZRNA
- Delegiranje glasačkih prava drugom članu

### `/glasanje` — Glasanje
- Lista aktivnih i zatvorenih glasanja
- Glasanje sa zaključanim ZRNO-m
- Težina glasa = broj zaključanih ZRNA

### `/profil` — Profil
- Promena pseudonima
- Promena lozinke
- Prikaz referral koda (jedinstven za svakog korisnika)
- Link za deljenje referral koda

### `/profil/oglasi` — Moji oglasi
- Lista sopstvenih oglasa
- Brisanje / arhiviranje oglasa

---

## Admin stranice (`/admin`)

Dostupno samo korisnicima sa ulogom `ADMIN`.

### Tab: Dashboard
- Brojevi: ukupno korisnika, verifikovanih, suspendovanih
- Zadruge: ukupno, ukupno zadrugara
- Finansije: opticaj, saldo Banke
- ZRNO: kod korisnika, u Banci, ukupno
- Ukupan broj transakcija

### Tab: Na čekanju
- Zahtevi za verifikaciju identiteta (JMBG + slike lične karte)
  - Prikaz slika prednje/zadnje strane
  - Dugme "Odobri" → emisija 1.000 POEN + referral nagrada
  - Dugme "Odbij" → unos razloga
- Zahtevi za osnivanje zadruge
  - Odobri (emisija 50.000 POEN) / Odbij

### Tab: Zadruge
- Lista svih zadruga sa statusom, saldom, brojem članova
- Pregled pristupnica (zahtevi za učlanjenje)
- Odobravanje/odbijanje pristupnica

### Tab: Programi
- Uključivanje/isključivanje programa Banke
- Odobravanje enrollment zahteva
- Odobravanje evidencija rada (Zapošljavanje program)
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

### `/admin/simulator` — Simulator
- 4 taba: Pregled | Članovi | Zadruge | ZRNO
- Testiranje sistema bez uticaja na produkcione podatke

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

---

## Referral sistem

- Svaki korisnik dobija jedinstveni referral kod
- Kod se unosi pri registraciji novog korisnika
- Nagrada se isplaćuje **kada se preporučeni verifikuje**
- 10 nivoa nagrade (1. preporuka = manji iznos, 10. = 10.000 POEN)
- Nagrada se emituje pozivaocima automatski pri odobrenju verifikacije

---

## KOLO Banka — pravila emisije

- Banka je softverski protokol, nema fizičku adresu
- Saldo Banke uvek negativan (ona emituje, korisnici primaju)
- **Dnevni limit**: max 10% od opticaja može se emitovati u jednom danu
- Ako je zatraženo više od limita, svaki korisnik dobija proporcionalni deo (koeficijent < 1)
- Noćna emisija se pokreće automatski u ponoć (ili ručno iz admin panela)

---

## Tehničke napomene za AI asistente

- Stranice: Next.js 14+ App Router, TypeScript
- Baza: PostgreSQL + Prisma ORM
- Auth: NextAuth.js (JWT, credentials provider)
- Stilovi: Tailwind CSS v4 sa custom KOLO design tokenima
- Jezik interfejsa: srpski (latinica)
- POEN iznosi: uvek celi brojevi (INTEGER), nikad decimalni
- ZRNO količine: uvek celi brojevi (INTEGER)
- Kurs ZRNA: jedini decimalni tip (DECIMAL 20,2)
- Sve operacije koje menjaju balans: `prisma.$transaction()`
- API rute su na srpskom: `/api/clanovi`, `/api/transakcije`, itd.
- Middleware (`src/middleware.ts`): blokira neautorizovane korisnike, osim javnih ruta (/, /pijaca, /kako-funkcionise)
