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

## Reference
- `PLAN.md` — pregled svih faza sa zavisnostima
- `docs/schema-plan.md` — kompletna šema baze
- `docs/faza-X-*.md` — detalji implementacije po fazama
