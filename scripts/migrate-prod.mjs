// Ručno pokretanje migracija nad PRODUKCIJSKOM bazom.
//
// Produkcijski URL se čita iz (po prioritetu):
//   1. process.env.PROD_DATABASE_URL
//   2. DATABASE_URL u fajlu .env.production.local (gitignored)
//
// Upotreba:
//   npm run migrate:prod          → prisma migrate deploy (primeni nove migracije)
//   npm run migrate:prod:status   → prisma migrate status (samo provera, ništa ne menja)
//
// prisma.config.ts učitava dotenv, ali dotenv NE pregazi već postavljen env var,
// pa DATABASE_URL koji ovde prosleđujemo detetu-procesu ima prioritet.
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function parseEnvFile(path, key) {
  if (!existsSync(path)) return null;
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.startsWith(`${key}=`)) continue;
    let value = line.slice(key.length + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    return value;
  }
  return null;
}

const url =
  process.env.PROD_DATABASE_URL ??
  parseEnvFile(".env.production.local", "DATABASE_URL");

if (!url) {
  console.error(
    "Nedostaje produkcijski DATABASE_URL.\n" +
      "Postavi PROD_DATABASE_URL ili dodaj DATABASE_URL= u .env.production.local",
  );
  process.exit(1);
}

const statusOnly = process.argv.includes("--status");
const cmd = statusOnly ? "migrate status" : "migrate deploy";

// Maskirani prikaz hosta radi potvrde da gađamo pravu bazu.
let host = "nepoznat";
try {
  host = new URL(url).host;
} catch {
  /* ignore parse errors */
}

console.log(`[migrate-prod] cilj: ${host}`);
console.log(`[migrate-prod] prisma ${cmd}`);

execSync(`npx prisma ${cmd}`, {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: url },
});
