/**
 * Jednokratno raščišćavanje ZAGLAVLJENE migracije u bazi okruženja.
 *
 * Povod (02.09.2026): test baza je od 31.08. odbijala svaki `prisma migrate
 * deploy` sa P3009 — migracija `20260831120000_vidjeno_pocetna` je u tabeli
 * `_prisma_migrations` ostala sa `finished_at IS NULL` (build je prekinut u
 * toku primene). Prisma tada NE primenjuje nijednu novu migraciju i obara
 * build, pa je test od tog dana služio zastareo build.
 *
 * 🔴 Zašto se ne poziva `prisma migrate resolve` naslepo: on ima dva ishoda
 * (`--applied` i `--rolled-back`) i pogrešan trajno kvari bazu. `--applied` nad
 * migracijom koja NIJE primenjena ostavlja šemu bez kolone, a Prisma je od tada
 * traži pri svakom upitu — kvar koji se ne vidi u buildu nego kasnije, u radu.
 * Zato se ovde ishod ne bira unapred nego se PROVERAVA stvarno stanje šeme.
 *
 * Skripta je bezbedna i kad nema šta da radi: baza bez zaglavljene migracije
 * (npr. produkcijska) prolazi kroz nju bez ijedne izmene.
 */
import pg from "pg";

// Isti razlog kao u `prisma.config.ts`: CLI i administrativne radnje nad
// migracijama idu DIREKTNOM konekcijom, ne kroz Neon pooler.
const url = process.env.DATABASE_URL?.replace("-pooler.", ".");
if (!url) {
  console.log("[migracije] Nema DATABASE_URL — preskačem.");
  process.exit(0);
}

// Šta se proverava da bi se znalo da li je migracija stvarno prošla. Ključ je
// ime migracije, vrednost upit koji vraća red ako su njene izmene u šemi.
const PROVERE = {
  "20260831120000_vidjeno_pocetna": {
    opis: 'kolona "User"."vidjenoPocetnaAt"',
    sql: `SELECT 1 FROM information_schema.columns
           WHERE table_name = 'User' AND column_name = 'vidjenoPocetnaAt'`,
  },
};

const klijent = new pg.Client({ connectionString: url });
await klijent.connect();

try {
  const { rows: zaglavljene } = await klijent.query(
    `SELECT id, migration_name, started_at
       FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
      ORDER BY started_at`
  );

  if (zaglavljene.length === 0) {
    console.log("[migracije] Nema zaglavljenih migracija — nastavljam.");
    process.exit(0);
  }

  for (const red of zaglavljene) {
    const provera = PROVERE[red.migration_name];
    if (!provera) {
      // Nepoznata migracija — ishod se ne pogađa. Bolje crven build sa jasnom
      // porukom nego tiho pokvarena šema.
      console.error(
        `[migracije] Zaglavljena migracija bez opisane provere: ${red.migration_name}. ` +
          "Dopuni PROVERE u scripts/raschisti-migracije.mjs pre nego što se dira."
      );
      process.exit(1);
    }

    const { rowCount } = await klijent.query(provera.sql);
    if (rowCount > 0) {
      await klijent.query(
        `UPDATE "_prisma_migrations"
            SET finished_at = now(), logs = NULL, applied_steps_count = 1
          WHERE id = $1`,
        [red.id]
      );
      console.log(
        `[migracije] ${red.migration_name}: ${provera.opis} POSTOJI → upisano kao primenjeno.`
      );
    } else {
      await klijent.query(
        `UPDATE "_prisma_migrations" SET rolled_back_at = now() WHERE id = $1`,
        [red.id]
      );
      console.log(
        `[migracije] ${red.migration_name}: ${provera.opis} NE postoji → označeno kao poništeno, ` +
          "`migrate deploy` će je primeniti ponovo."
      );
    }
  }
} finally {
  await klijent.end();
}
