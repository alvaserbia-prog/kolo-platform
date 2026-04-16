# KOLO Platforma

Alternativni ekonomski sistem zasnovan na uzajamnosti. Koristi dve interne jedinice:

- **POEN** — jedinica evidencije doprinosa (nije novac)
- **ZRNO** — upravljačka jedinica za glasanje

Sistem funkcioniše kroz Fondaciju, mrežu lokalnih zadruga, KOLO Banku (softverski protokol) i članove.

## Tech stack

- Next.js 16 (App Router), TypeScript
- PostgreSQL, Prisma ORM 7
- NextAuth.js
- Tailwind CSS v4

## Pokretanje lokalnog servera

```bash
npm install
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000) u pregledaču.

## Licenca

Copyright (C) 2026 Nikola Šarić

Ovaj projekat koristi dve licence:

- **Softverski kod** — [AGPL-3.0-only](./LICENSE): slobodan za korišćenje, izmenu i distribuciju; svaka modifikovana verzija (uključujući mrežno dostupne) mora biti distribuirana pod istim uslovima sa izvornim kodom.
- **Sadržaj i dokumentacija** — [CC BY-SA 4.0](./LICENSE-CONTENT): dokumentacija, koncepti i tekstovi mogu se koristiti i adaptirati uz navođenje autorstva i distribuciju pod istom licencom.
