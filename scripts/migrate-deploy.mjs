#!/usr/bin/env node
// scripts/migrate-deploy.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Ručna primena Prisma migracija (VAN build-a).
//
// Zašto van build-a: Neon baza ima auto-suspend ("zaspi" posle neaktivnosti).
// Prvi pokušaj konekcije na uspavanu bazu zna da padne sa P1002 ("server je
// dosegnut ali je istekao timeout"). Kada je `prisma migrate deploy` bio deo
// Vercel `buildCommand`, taj P1002 je obarao ceo deploy. Zato migracije sada
// idu RUČNO ovom skriptom, koja:
//   1) prvo BUDI bazu kratkim `SELECT 1` upitom uz retry (eksponencijalni backoff),
//   2) pa tek onda pokreće `prisma migrate deploy`, takođe sa retry-jem na
//      prolazne greške konekcije.
//
// Upotreba:
//   TEST (main):   DATABASE_URL="<neon test URL>"  npm run db:deploy
//   PROD (ekolo):  MIGRATE_DATABASE_URL="<neon prod DIRECT URL>" npm run db:deploy
//   Lokalno:       npm run db:deploy        (čita DATABASE_URL iz .env)
//
// Prioritet URL-a:  MIGRATE_DATABASE_URL > DIRECT_DATABASE_URL > DATABASE_URL
//
// VAŽNO (connection pooling): za migracije koristi NEPOOLED (direktan) Neon
// string — pooler endpoint (`-pooler` u hostu, pgbouncer) ne podržava pouzdano
// advisory lock-ove i DDL koje `migrate deploy` koristi. Pooled string ostavi
// za runtime (`DATABASE_URL` u Vercel-u). Vidi MIGRACIJE.md i .env.example.
// ─────────────────────────────────────────────────────────────────────────────
import pg from "pg";
import { spawn } from "node:child_process";

// dotenv je opcioni — učitava .env lokalno, ali ako env stiže inline
// (npr. MIGRATE_DATABASE_URL=... npm run db:deploy) ne sme da obori skriptu.
try {
  await import("dotenv/config");
} catch {
  /* dotenv nije instaliran — koristi env iz okruženja */
}

const url =
  process.env.MIGRATE_DATABASE_URL ||
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!url) {
  console.error(
    "✗ Nedostaje URL baze. Postavi DATABASE_URL (ili MIGRATE_DATABASE_URL / DIRECT_DATABASE_URL).",
  );
  process.exit(1);
}

const MAX_POKUSAJA = 6;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// 2s, 4s, 8s, 16s, 30s (cap), 30s — dovoljno da Neon stigne da se probudi.
const backoff = (i) => Math.min(2000 * 2 ** i, 30000);

function maskiraj(u) {
  try {
    const x = new URL(u);
    if (x.password) x.password = "***";
    return x.toString();
  } catch {
    return "(nevažeći URL)";
  }
}

// 1) Budi bazu — tolerantno na P1002/timeout dok se Neon ne probudi.
async function probudiBazu() {
  for (let i = 0; i < MAX_POKUSAJA; i++) {
    const client = new pg.Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    try {
      await client.connect();
      await client.query("SELECT 1");
      await client.end();
      console.log("✓ Baza je budna i prihvata konekcije.");
      return;
    } catch (err) {
      await client.end().catch(() => {});
      const oznaka = err.code || err.message;
      if (i < MAX_POKUSAJA - 1) {
        const ms = backoff(i);
        console.warn(
          `… Baza ne odgovara (${oznaka}) — verovatno se budi (Neon auto-suspend). ` +
            `Retry za ${ms / 1000}s [${i + 1}/${MAX_POKUSAJA}]`,
        );
        await sleep(ms);
      } else {
        throw err;
      }
    }
  }
}

// 2) Pokreni `prisma migrate deploy` sa izabranim URL-om.
function pokreniMigrate() {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, DATABASE_URL: url },
    });
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`prisma migrate deploy je vratio kod ${code}`)),
    );
    child.on("error", reject);
  });
}

async function main() {
  console.log("▶ Migracije (ručno, van build-a) — cilj:", maskiraj(url));
  await probudiBazu();

  for (let i = 0; i < MAX_POKUSAJA; i++) {
    try {
      await pokreniMigrate();
      console.log("✓ Migracije uspešno primenjene.");
      return;
    } catch (err) {
      if (i < MAX_POKUSAJA - 1) {
        const ms = backoff(i);
        console.warn(
          `… migrate nije uspeo (${err.message}). Retry za ${ms / 1000}s [${i + 1}/${MAX_POKUSAJA}]`,
        );
        await sleep(ms);
      } else {
        console.error("✗ Migracije nisu uspele ni nakon više pokušaja.");
        process.exit(1);
      }
    }
  }
}

main().catch((e) => {
  console.error("✗ Greška:", e);
  process.exit(1);
});
