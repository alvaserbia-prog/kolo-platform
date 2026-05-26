import "dotenv/config";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Upotreba:
//   npx tsx scripts/napravi-admin.ts <email-ili-pseudonim>
//   ili: ADMIN_IDENTIFIKATOR="mila@test.rs" npx tsx scripts/napravi-admin.ts
//
// Promoviše POSTOJEĆEG korisnika u ADMIN (po emailu ili pseudonimu).

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const identifikator = process.argv[2] ?? process.env.ADMIN_IDENTIFIKATOR;
  if (!identifikator) {
    console.error("Greška: navedi email ili pseudonim. Npr: npx tsx scripts/napravi-admin.ts mila@test.rs");
    process.exit(1);
  }

  const korisnik = await prisma.user.findFirst({
    where: { OR: [{ email: identifikator }, { pseudonim: identifikator }] },
    select: { id: true, email: true, pseudonim: true, role: true },
  });

  if (!korisnik) {
    console.error(`Korisnik nije pronađen za: "${identifikator}"`);
    const svi = await prisma.user.findMany({ select: { email: true, pseudonim: true, role: true } });
    console.error("\nPostojeći korisnici:");
    for (const u of svi) console.error(`  - ${u.pseudonim} <${u.email ?? "bez emaila"}> [${u.role}]`);
    process.exit(1);
  }

  if (korisnik.role === Role.ADMIN) {
    console.log(`Korisnik "${korisnik.pseudonim}" je već ADMIN. Nema promene.`);
    return;
  }

  await prisma.user.update({
    where: { id: korisnik.id },
    data: { role: Role.ADMIN },
  });

  console.log(`✓ Korisnik "${korisnik.pseudonim}" <${korisnik.email ?? "bez emaila"}> je promovisan u ADMIN.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
