# Podaci fondacije za zvanične dokumente (memorandum)

Referentni podaci za izradu dokumenata na memorandumu KOLO Fondacije.
Kada vlasnik zatraži „napravi dokument na memorandumu", koristiti ove podatke,
logo iz ovog foldera i šablon `primer-zahtev-rzs.js` (docx biblioteka, Node).

## Zvanični podaci (izvor: APR rešenje o upisu, 21.07.2026)

| Polje | Vrednost |
|---|---|
| Pun naziv | KOLO FONDACIJA (ćirilicom: КОЛО ФОНДАЦИЈА) |
| Naziv na engleskom | KOLO FOUNDATION |
| Oblik organizovanja | Fondacija |
| Sedište i adresa | Šetalište 16, 25000 Sombor, Republika Srbija |
| Matični broj | 28836627 |
| PIB | 115840443 |
| Šifra delatnosti | 9499 — Delatnost ostalih organizacija na bazi učlanjenja |
| Datum upisa u Registar zadužbina i fondacija | 21.07.2026. |
| Datum donošenja statuta | 16.05.2026. |
| Zakonski zastupnik | Nikola Šarić, **direktor** (u APR rubrici „upravitelj"; u dokumentima pisati „direktor") |
| Sajt | www.ekolo.rs |
| Kontakt telefon | +381 64 245 3710 |
| Kontakt e-mail | alva.serbia@gmail.com |

**Napomena za dokumente:** Fondacija posluje **bez pečata** — u zvaničnim dopisima
dodati rečenicu „Fondacija posluje bez pečata." umesto otiska.

**NE unositi u repo** (po pravilu iz CLAUDE.md): broj APR rešenja i JMBG-ove —
ti podaci se po potrebi čitaju direktno iz rešenja (čuva ga vlasnik).

## Memorandum — izgled zaglavlja

1. Logo: `kolo-logo-memorandum.png` (znak + natpis KOLO, bela podloga), centriran, ~95×95 px
2. Ispod loga: **KOLO FONDACIJA** (bold, veći font)
3. Red: `Šetalište 16, 25000 Sombor, Republika Srbija`
4. Red: `Matični broj: 28836627 · PIB: 115840443 · Šifra delatnosti: 9499 · www.ekolo.rs`
5. Tanka horizontalna linija ispod zaglavlja
6. Font celog dokumenta: **Arial** (podržava č, ć, š, ž, đ)
7. Potpisni blok desno: `Za KOLO FONDACIJU` / `Nikola Šarić, direktor` / linija za potpis

## Šablon

`primer-zahtev-rzs.js` — radni primer (zahtev RZS-u za obaveštenje o razvrstavanju,
avgust 2026): Node skripta sa `docx` bibliotekom koja gradi memorandum + telo dopisa.
Za nov dokument kopirati skriptu i zameniti primaoca, predmet i telo teksta.
Pokretanje: `npm install docx && node <skripta>.js`.

## Bankarski kontekst (avgust 2026, radi kontinuiteta)

- Račun se otvara kod: **Banka Poštanska štedionica a.d. Beograd** (ekspozitura Sombor 1;
  kontakt službenica: danijela.jovanic@posted.co.rs)
- E-commerce plan: procesor **Chip Card AD / MSU (MerchantSafe Unipay)** — za integraciju
  na sajtu potreban novi provajder modul pored `src/lib/placanje/nestpay.ts`
- IPS QR: već implementiran (`src/lib/placanje/ips-qr.ts`), radi sa bilo kojom bankom
