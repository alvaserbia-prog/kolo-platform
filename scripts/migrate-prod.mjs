import pg from "pg";

const url = process.env.PROD_DATABASE_URL;
if (!url) {
  console.error("Nedostaje PROD_DATABASE_URL");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const migracije = [
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatar" TEXT`,
  `ALTER TABLE "UserPodaci" ADD COLUMN IF NOT EXISTS "opis" TEXT`,
];

for (const sql of migracije) {
  console.log("Izvršavam:", sql);
  await client.query(sql);
  console.log("OK");
}

await client.end();
console.log("Gotovo.");
