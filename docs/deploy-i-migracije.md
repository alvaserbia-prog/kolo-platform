# Deploy i migracije — pun zapis

> Izdvojeno iz `CLAUDE.md` 28.09.2026. Pravila koja vezuju rad stoje u `CLAUDE.md`
> (odeljak „Deploy i grane"); ovde su topologija, incidenti i obrazloženja.
> Ako se razidu, merodavan je `CLAUDE.md`.

## Vercel topologija — JEDAN projekat `kolo` (od 2026-06-04; kolo-peach re-pointovan 2026-06-12)
**PROMENA 2026-06-04:** stari `kolo-platform` projekat (`prj_F8dvteluVkzxlGzIMfpvXqWJD2yC`) je **isključen** — više ne gradi (poslednji deploy `d8bc6fc`, ~3. jun). Sada **jedan projekat `kolo`** (`prj_xVaJlVaSzPl7rYnF1lM4WXwE6Y8m`, team `team_YswkbIApgJlmqdQLJJu8SLDE`) gradi **obe grane** istog repoa (`alvaserbia-prog/kolo-platform`).

**PROMENA 2026-06-12:** domen **`kolo-peach.vercel.app` je prebačen sa starog (zamrznutog) projekta na projekat `kolo`, grana `main`** (Domains tab: `kolo-peach.vercel.app → main`). Više NIJE zamrznut — sada je **kratak alias za TEST** i služi poslednji `main` build sa test bazom. (Raniji tekst „kolo-peach ZAMRZNUT, ne koristiti" više NE važi.)

| Grana | Vercel target | URL | Baza (Neon) |
|---|---|---|---|
| **`production`** | production | **ekolo.rs** / www.ekolo.rs | prod (`ep-empty-forest-alajuasx`) |
| **`main`** | preview | **`kolo-peach.vercel.app`** (= test alias) ili `kolo-git-main-alvaserbia-progs-projects.vercel.app` | test (`ep-old-sky-aleg2alm`) |

- „pošalji na test" = push na `main` → gleda se na **`kolo-peach.vercel.app`** (ili dugi auto URL). Zbog CDN keša, za proveru sveže promene koristiti **incognito**.
- „objava na ekolo.rs" = merge `main` → `production` + push (nepromenjeno).
- **Env varijable po grani/scope-u:** Production scope (prod baza, tajne za ekolo.rs: `PLACANJE_AKTIVNO`, `NESTPAY_*`) vs Preview scope (test baza). Oba imaju `DATABASE_URL`, pa migracije rade i na test i na prod buildu.

## 🔴 Primenjena migracija se NE dira — `migrate deploy` je TIHO preskače (2026-08-17)

`prisma migrate deploy` **ne proverava kontrolni zbir već primenjenih migracija.**
Izmenjen fajl se preskoči **bez greške i bez upozorenja**, a deploy prođe kao da je
sve u redu. Raniji zapis u ovom fajlu je tvrdio suprotno („oborila bi kontrolni zbir
i deploy") — to nije tačno, i pogrešno je na gori način: kad bi deploy pucao, videlo
bi se odmah.

Desilo se upravo to: dopuna backfill-a dopisana je u `20260817120100_deca_unapredjeni_model`
pošto je ta migracija već bila primenjena na test bazu (04:01). Build u 07:30 je
prošao **READY**, a backfill nije upisao nijedan red. Ispravka je otišla u zasebnu
migraciju `20260817130000_deca_poziv_backfill`, uz `WHERE NOT EXISTS` da bude
idempotentna.

**Pravilo:** svaka izmena posle prvog deploy-a ide u NOV fajl. Provera pre puša:
`git log --oneline -- prisma/migrations/<ime>/` — ako migracija ima više od jednog
commita, verovatno je već primenjena negde.

🟡 **Uz to: dva builda na istoj test bazi u istom trenutku se sudaraju.** Push na
granu i na `main` u razmaku od nekoliko sekundi pokreću dva Vercel builda, oba
Preview scope, oba sa istim `DATABASE_URL`; jedan je pao sa `db_unreachable`
(Neon endpoint je bio uspavan, pa je hladan start primio dve direktne konekcije).
Migracija je već bila primenjena, pa šteta nije nastala, ali **grana i `main` se ne
guraju u istoj minuti** — prvo jedno, pa kad build prođe, drugo.

## 🔴 PALA migracija zaustavlja SVE naredne buildove — P3009 (2026-09-18)

Drugo lice istog kvara, i gore od njega. Ako migracija **padne** usred izvršavanja,
red u `_prisma_migrations` ostaje u stanju FAILED, a `prisma migrate deploy` od tog
trenutka odbija **svaku** narednu migraciju sa **P3009**, bez obzira na to što sa njima
nema nikakve veze. Build pada pre `npm run build`, dakle **ništa se ne objavljuje**.

Desilo se 15.09.2026: `20260915120000_oglas_bez_kupovine` (R-07, preimenovanje
`SOLD` → `RAZMENJEN`) pala je sa `"SOLD" is not an existing enum label` — preimenovanje
je u test bazi već bilo sprovedeno. Posledica: **svih deset buildova naredna tri dana**,
i na granama i na `main`, palo je sa P3009, a `kolo-peach.vercel.app` je sve vreme
služio build od 15.09. Ekran je izgledao ispravno, pa se kvar video **samo iz pošte** i
iz build log-a — `kolo-peach` „radi" ne znači da se išta objavljuje.

🔴 **Pad ne popravlja nov fajl.** Blokada nije u SQL-u nego u FAILED redu; dok se on ne
razreši, nova migracija se ne pokušava. Zato je ovo **jedini slučaj u kojem se postojeći
fajl migracije sme prepraviti** (pravilo „izmena ide u NOV fajl" važi za **primenjene**
migracije, koje `migrate deploy` tiho preskače — ova nije primenjena).

**Postupak:** (1) pala migracija se prepravlja da bude **idempotentna** — svaka naredba
pod `IF EXISTS` proverom, jer se posle pada **ne zna** koliko je od nje prošlo; (2) u
`buildCommand` se privremeno ubaci `prisma migrate resolve --rolled-back <ime> || true`
pre `migrate deploy`; `|| true` je obavezno, jer na okruženju gde migracija nije u
FAILED stanju (produkcija, ili test posle popravke) `resolve` baca grešku i bez toga bi
sam oborio build; (3) kad build prođe, taj korak se **uklanja istim danom** — ostavljen,
on je tiha brana koja bi sledeći pad iste migracije progutala bez traga.

## Migracije se primenjuju AUTOMATSKI pri deploy-u
`vercel.json` → `buildCommand`: `if [ -n "$DATABASE_URL" ]; then prisma migrate deploy; fi && npm run build`.
- Migracije se primenjuju **same** na bazu okruženja preko Vercel `DATABASE_URL` (prod→prod, test→test). **Nema više ručnog `npx prisma migrate deploy`** posle deploy-a.
- Guard `if DATABASE_URL` znači da okruženja **bez baze** preskaču migraciju i ne pucaju; gde baza postoji, neuspela migracija i dalje **glasno** obara build (prethodni deploy ostaje živ).
- `prisma.config.ts` čita `datasource.url` iz `process.env.DATABASE_URL` (datasource u šemi nema `url`, jer runtime koristi `@prisma/adapter-pg`).
- **VAŽNO — migrate ide DIREKTNO, ne preko poolera (fix `4e75948`, 2026-06-04):** `prisma.config.ts` skida `-pooler` iz `DATABASE_URL` za Prisma CLI. Razlog: `prisma migrate deploy` uzima Postgres advisory lock koji ne radi kroz Neon pooler (PgBouncer) → puca sa **P1002** (timeout na `pg_advisory_lock`, 10s) i obara build. Runtime klijent (`@prisma/adapter-pg`) i dalje koristi **pooled** `process.env.DATABASE_URL` — direktna konekcija važi samo za CLI. (Neon direktni host = pooled host bez `-pooler`.)


