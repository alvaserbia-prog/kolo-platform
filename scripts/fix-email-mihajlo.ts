import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const STARI = "deimos025@gmail.com";
const NOVI = "deimos25@gmail.com";
const APPLY = process.argv.includes("--apply");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const stari = await prisma.user.findUnique({
    where: { email: STARI },
    select: { id: true, pseudonim: true, memberHash: true, email: true },
  });
  const novi = await prisma.user.findUnique({
    where: { email: NOVI },
    select: { id: true, pseudonim: true },
  });

  console.log("Zapis sa STARIM mejlom:", stari ?? "NE POSTOJI");
  console.log("Zapis sa NOVIM mejlom:", novi ?? "ne postoji (ok)");

  if (!stari) {
    console.log("\nNema šta da se menja (stari mejl ne postoji).");
    return;
  }
  if (novi) {
    console.log("\n⚠ ODUSTAJEM: novi mejl je već zauzet drugim nalogom — ručno proveriti.");
    return;
  }

  if (!APPLY) {
    console.log("\n[DRY-RUN] Pokreni sa --apply da se mejl promeni u:", NOVI);
    return;
  }

  const res = await prisma.user.update({
    where: { id: stari.id },
    data: { email: NOVI },
    select: { id: true, pseudonim: true, email: true },
  });
  console.log("\n✓ AŽURIRANO:", res);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
