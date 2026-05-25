// Uslovne migracije pri Vercel build-u.
//
//   VERCEL_ENV=production → preskoči (migracije se pokreću RUČNO: npm run migrate:prod)
//   sve ostalo (preview/test, lokalno) → prisma migrate deploy automatski
//
// Vercel postavlja VERCEL_ENV na "production" ili "preview". Lokalno je nedefinisan.
import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV ?? "lokalno";

if (env === "production") {
  console.log(
    "[build-migrate] VERCEL_ENV=production → preskačem migracije.\n" +
      "                Produkcijske migracije se pokreću ručno: npm run migrate:prod",
  );
  process.exit(0);
}

console.log(`[build-migrate] okruženje=${env} → prisma migrate deploy`);
execSync("npx prisma migrate deploy", { stdio: "inherit" });
