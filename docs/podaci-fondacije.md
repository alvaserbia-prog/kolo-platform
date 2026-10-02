# Opšti podaci Fondacije — za popunjavanje obrazaca

Podaci koji se ponavljaju u zahtevima bankama, pružaocima usluga i institucijama.
Izvor: rešenje APR o registraciji (BZF 406/2026) i dokumentacija OTP banke.

🔴 **Ovde NE upisivati JMBG ni lične podatke članova UO i upravitelja** (JMBG, lične
telefone, kućne adrese). Repozitorijum nije mesto za njih — upisuju se ručno, u
trenutku popunjavanja obrasca.

## Pravno lice

| Podatak | Vrednost |
|---|---|
| Naziv (APR) | **KOLO FONDACIJA** (latinicom; u Statutu „КОЛО Фондација“) |
| Naziv na engleskom | KOLO FOUNDATION |
| Oblik organizovanja | Fondacija |
| Sedište i adresa | Šetalište 16, Sombor |
| Matični broj | 28836627 |
| PIB | 115840443 |
| Šifra delatnosti | 9499 — Delatnost ostalih organizacija na bazi učlanjenja |
| Registracija | APR, Registar zadužbina i fondacija, BZF 406/2026, rešenje od 21.07.2026. |
| Datum donošenja Statuta | 16.05.2026. |
| Vreme na koje se osniva | neograničeno |
| Web adresa | https://ekolo.rs |
| E-mail za kontakt | alva.serbia@gmail.com |

**Ciljevi (APR, skraćeno):** razvoj socijalne i solidarne ekonomije i alternativnih
ekonomskih modela; evidencija i priznanje doprinosa pojedinaca i kolektivnih oblika
opštekorisnim ciljevima i zajedničkom dobru; podrška dobrovoljnom udruživanju radi
uzajamne pomoći; socijalna zaštita i solidarna podrška ranjivim grupama; edukacija.

## Lica

| Uloga (APR) | Ime |
|---|---|
| Upravitelj — ovlašćeno lice za zastupanje | Nikola Šarić |
| Predsednik Upravnog odbora | Jelena Stijepović |
| Članovi Upravnog odbora | Stefan Milijanović, Danijel Tomasović |

🟡 U APR-u je Nikola Šarić upisan kao **upravitelj**, ne kao direktor — u obrascima
koje banka proverava u APR-u pisati „upravitelj“.

## Banka — OTP banka Srbija

| Podatak | Vrednost |
|---|---|
| Dinarski račun | 325-9500700238011-82 |
| Drugi račun | 325-9601700115744-09 |
| Paket | Biznis Praktik (od 24.09.2026.) |
| Ekspozitura | Sombor, Sonje Marinković 1-3 |
| Savetnik | Milana Stanojković, konsultant za SBB klijente — milana.stanojkovic@otpbanka.rs |

## Tekst za opis poslovnog modela

Proveren tekst za obrasce banaka i pružalaca platnih usluga. Ne skraćivati: banka
pregleda sajt i vidi POEN, pa opis unapred kaže da POEN nije ono što se plaća.

> Kolo fondacija je neprofitna organizacija. Preko platforme ekolo.rs prima novčane
> donacije fizičkih lica za ostvarivanje svojih statutarnih ciljeva. Donacija je
> dobrovoljna i nepovratna, i donator njome ne pribavlja robu ni uslugu.
>
> Platforma vodi internu evidenciju doprinosa članova zajednici. Doprinos se ne beleži
> samo za donacije, nego i za druge aktivnosti: rad na zajedničkim projektima, učešće
> u razmeni dobara i usluga među članovima, pomoć u radu platforme i druge oblike
> učešća. Ta evidencija nije novac, ne može se zameniti za novac i ne predstavlja
> potraživanje prema Fondaciji. Donacija je samo jedan od načina učešća, a ne kupovina.

Uobičajeni odgovori u obrascima za internet prodajno mesto: roba i usluge se ne
prodaju; posebna dozvola nije potrebna; dostava ne postoji; „cena“ ne postoji —
iznos donacije bira donator; ciljna grupa domaća; integrator — Fondacija (sopstveni
razvoj, Next.js, hosting Vercel, region Frankfurt, bez fiksne IP adrese).

## Tok sa bankom (stanje 02.10.2026.)

- **Kartice (e-commerce, NestPay):** zahtev popunjen i poslat 02.10.2026. Integracija
  je u kodu već pripremljena (`src/lib/placanje/nestpay.ts`, provajder `OTP`); od
  banke se čekaju Client ID, Store Key i adresa gateway-a (test i produkcija).
- **IPS Skeniraj za internet:** zatraženo uz isti zahtev. Ako OTP to nudi, uplate
  IPS-om stižu sa trenutnim obaveštenjem, kao kartice.
- **Halcom (automatsko preuzimanje izvoda):** OTP-ova aplikacija ne šalje podatke u
  druge sisteme; automatsko preuzimanje ide preko Halcoma (HalConnect / Hal E-Bank B2B,
  uz kvalifikovani sertifikat). Kontaktirati **samo ako OTP nema IPS za internet** —
  inače ručno ostaju samo klasične uplatnice.
- 🔴 POEN se ni u jednom od ovih tokova ne upisuje sam — uplata se pojavi u admin
  panelu i čeka ljudsko odobrenje (mera M-4a).

## Otvorene obaveze iz APR rešenja

- Upis **stvarnog vlasnika** u Centralnu evidenciju stvarnih vlasnika — rok je bio 30
  dana od registracije (do ~20.08.2026.). Proveriti da li je urađeno.
