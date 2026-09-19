# Obrađivači i prekogranični prenos — radna beleška

*Interna beleška, NIJE normativa.* Normativa je Politika privatnosti čl. 8 i 9,
DPIA tačka 5.13 i rizik R8, i Registar radnji obrade. Ova beleška služi da se na
jednom mestu vidi **šta je stvarno konfigurisano** i **šta još treba prikupiti**.

Nastala uz analizu rizika **R-12** (2026-09-09).

## Šta je gde

| Obrađivač | Uloga | Gde se izvršava | Prenos u treću zemlju |
|---|---|---|---|
| **Vercel Inc.** | hosting, isporuka aplikacije | **EU — Frankfurt** (`vercel.json` → `"regions": ["fra1"]`) | ne za same podatke; moguć administrativni pristup iz SAD |
| **Neon Inc.** | baza podataka | **EU — Frankfurt** (region endpointa u `DATABASE_URL`) | isto |
| **Cloudflare, Inc.** | R2, slike (avatari i slike oglasa) | SAD | **da** |
| **Resend, Inc.** | sistemska pošta; sadrži i isečak nove poruke | SAD | **da** |
| **Telegram Messenger Inc.** | kanal upozorenja Fondaciji | SAD | **da** |
| **Google Ireland Ltd / Google LLC** | Google Analytics, samo po pristanku | SAD | **da** |
| Vercel Analytics | merenje bez kolačića | uz Vercel | legitimni interes, bez kolačića |
| poslovna banka + posrednik za kartično plaćanje | donacije platnom karticom | Republika Srbija | ne |

🔴 **`vercel.json` → `"regions": ["fra1"]` je mera zaštite, ne podešavanje performansi.**
Ko je promeni, menja i tačnost Politike čl. 9, ocenu rizika R8 u DPIA i sve redove
„Prenos u treću zemlju" u Registru radnji obrade. **Ne dirati bez izmene ta tri akta.**
Isto važi za region Neon endpointa.

## Šta treba prikupiti (M-1) — zadatak vlasnika, nije u kodu

Za svakog obrađivača iz gornje tabele: kopija ugovora o obradi (DPA), datum i
verzija, da li sadrži standardne ugovorne klauzule i koji modul, i link na spisak
podobrađivača. Ide na Google Drive uz ostala dokumenta Fondacije — **ne u repo**.

Politika čl. 9 od verzije 4.4.9 sadrži obavezu da Fondacija te primerke čuva i da
**najmanje jednom godišnje** proveri da li su na snazi i da li se spisak
podobrađivača promenio. Dok primerci nisu prikupljeni, ta obaveza stoji neispunjena
— to je jedina preostala praznina iz R-12.

## Šta je namerno odloženo

- **Pravno mišljenje** o tome da li EU standardne ugovorne klauzule u provajderskim
  DPA zadovoljavaju **čl. 65** ZZPL-a ili traže odobrenje Poverenika po **čl. 67**
  (Poverenik je doneo sopstvene klauzule, koje nisu iste kao EU SCC iz 2021).
  Odluka vlasnika 2026-09-09: **odloženo, ne otvarati sada.**
- **Potpuni izlazak sa američkih provajdera.** Nije potrebno: hosting i baza su već
  u EU, a ostatak je uzak (slike, pošta, upozorenja, posećenost). Ako ikad zatreba,
  najlakši sledeći korak je **R2 baket sa `jurisdiction: eu`**, pa Resend EU region.
