# Merenje stanja sistema — šta se broji

> Pravilo u `CLAUDE.md` (odeljak „Merenje stanja"). Ovde su definicije i upiti.
> Povod (12.10.2026): pregled stanja za vlasnika brojao je sve redove ikad upisane
> (82 korisnika, 17 „prepisa"), pa je slika bila naduvana — deaktivirani i
> isključeni nalozi su ušli u zbir, a vraćanja POEN-a Protokolu pri gašenju naloga
> brojala su se kao razmene.

🔴 **Kad vlasnik pita „koliko imamo", broji se samo ono što je ŽIVO.** Ukupan broj
ikad upisanih redova se ne navodi kao stanje; sme samo kao zasebna, tako označena
napomena.

## Definicije

| Pojam | Uslov |
|---|---|
| **Aktivan nalog** | `status = 'ACTIVE'` i `deaktiviranAt IS NULL` i `oauthPending = false` (isti uslov kao `src/app/api/pocetna/liste/route.ts`) |
| **Aktivan oglas** | `MarketplaceListing.status = 'ACTIVE'` **i** oglašivač je aktivan nalog |
| **Razmena** | `USLOV_RAZMENE` iz `src/lib/razmena-brojac-pravila.ts` (TRANSFER ≥ `MIN_POEN_RAZMENE`, bez Protokola) **i** obe strane su aktivni nalozi |
| **Razmena među članovima** | razmena u kojoj nijedna strana nije `jeOsnivac` — ovo je merilo kritične mase, ne ukupan broj prepisa |
| **Aktivan član u periodu** | različit `userId` u `AktivnostLog` u periodu, samo među aktivnim nalozima |

🔴 `TransactionType.TRANSFER` **nije** isto što i razmena: do 06.10.2026. gašenje
naloga, lažna verifikacija i brisanje dečjeg naloga vraćali su POEN Protokolu tim
tipom. Brojati uvek kroz `USLOV_RAZMENE`.

## Upit (Neon, grana `production`, samo čitanje)

```sql
WITH ak AS (SELECT * FROM "User"
            WHERE status='ACTIVE' AND "deaktiviranAt" IS NULL AND NOT "oauthPending"),
ol AS (SELECT l.* FROM "MarketplaceListing" l JOIN ak ON ak.id=l."sellerId"
       WHERE l.status='ACTIVE'),
rz AS (SELECT t.* FROM "Transaction" t
       JOIN "Wallet" a ON a.id=t."fromWalletId" JOIN ak ua ON ua.id=a."userId"
       JOIN "Wallet" b ON b.id=t."toWalletId"   JOIN ak ub ON ub.id=b."userId"
       WHERE t.type='TRANSFER' AND t.amount>=100)
SELECT
 (SELECT count(*) FROM ak) aktivni_nalozi,
 (SELECT count(DISTINCT l."userId") FROM "AktivnostLog" l JOIN ak ON ak.id=l."userId"
   WHERE l."createdAt">now()-interval '7 days') aktivni_7d,
 (SELECT count(*) FROM ol) oglasi_aktivni,
 (SELECT count(*) FROM rz) razmene,
 (SELECT count(*) FROM rz r
   JOIN "Wallet" a ON a.id=r."fromWalletId" JOIN "User" u1 ON u1.id=a."userId"
   JOIN "Wallet" b ON b.id=r."toWalletId"   JOIN "User" u2 ON u2.id=b."userId"
   WHERE NOT u1."jeOsnivac" AND NOT u2."jeOsnivac") razmene_medju_clanovima;
```

## Zabeleženo stanje

| Datum | Aktivni nalozi | Aktivni 7 dana | Aktivni oglasi | Razmene (ukupno / 30 dana) | Razmene među članovima |
|---|---|---|---|---|---|
| 12.10.2026. | 80 (5 osnivača, 38 redovnih, 37 novih; 4 maloletna) | 13 | 44 (25 oglašivača, 1 potražnja) | 8 / 2 | 0 |
