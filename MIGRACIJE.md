# Migracije baze (RUČNO, van build-a)

Od sada se Prisma migracije **NE primenjuju automatski u Vercel build-u**.
Build radi samo `npm run build` (`prisma generate && next build`) i nikad ne
dira bazu. Migracije pokreće čovek/skripta **posle deploy-a**, ovom komandom:

```bash
npm run db:deploy
```

## Zašto van build-a (P1002 / Neon „spavanje")

Neon baza ima **auto-suspend**: posle perioda neaktivnosti se uspava. Prvi
pokušaj konekcije na uspavanu bazu često padne sa **P1002** („server je dosegnut
ali je timeout istekao"). Dok je `prisma migrate deploy` bio deo Vercel
`buildCommand`, taj P1002 je **obarao ceo deploy**.

Skripta `scripts/migrate-deploy.mjs` (= `npm run db:deploy`) to rešava:

1. **Budi bazu** kratkim `SELECT 1` upitom uz retry (eksponencijalni backoff
   2s → 4s → 8s → 16s → 30s, do 6 pokušaja) — sačeka da se Neon probudi.
2. Tek onda pokreće `prisma migrate deploy`, **takođe uz retry** na prolazne
   greške konekcije.

## Koji URL skripta koristi

Prioritet: **`MIGRATE_DATABASE_URL` → `DIRECT_DATABASE_URL` → `DATABASE_URL`**.

> **Connection pooling:** za migracije koristi **NEPOOLED (direktan)** Neon
> string. Pooler endpoint (`-pooler` u hostu, pgbouncer) ne podržava pouzdano
> advisory lock-ove i DDL koje `migrate deploy` koristi. Pooled string ostavi
> za runtime (`DATABASE_URL` u Vercel-u). Postavi nepooled string u
> `MIGRATE_DATABASE_URL` kad migriraš.

## Postupak po okruženju

| Okruženje | Neon baza | Kako migrirati |
|---|---|---|
| **TEST** (grana `main`, `kolo-peach.vercel.app`) | test (`ep-old-sky-...`) | `DATABASE_URL="<neon TEST direktan>" npm run db:deploy` |
| **PROD** (grana `production`, `ekolo.rs`) | prod (`ep-empty-forest-...`) | `MIGRATE_DATABASE_URL="<neon PROD direktan>" npm run db:deploy` |

### Tipičan tok kad ima novih migracija

1. Push koda (test: na `main`; prod: merge `main` → `production`).
2. Sačekaj da Vercel deploy prođe (build više ne dira bazu, pa neće pasti na P1002).
3. Pokreni migracije na **istu** bazu koju to okruženje koristi:
   ```bash
   MIGRATE_DATABASE_URL="postgres://...neon.../db?sslmode=require" npm run db:deploy
   ```
4. Proveri izlaz: `✓ Migracije uspešno primenjene.`

> ⚠️ **Ne zaboravi korak 3 kad menjaš `prisma/schema.prisma`.** Bez njega novi
> kod radi nad starom šemom → runtime greške dok migracija ne prođe. Za čisto
> aditivne migracije redosled deploy/migrate nije kritičan; za rušilačke
> (drop/rename kolone) migriraj usklađeno sa deploy-em.

## Fallback

`npm run db:deploy:raw` = goli `prisma migrate deploy` (bez buđenja/retry-ja) —
za lokalnu bazu ili kad sigurno znaš da je baza budna.
