import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Postavlja korisniku ulogu ADMIN (i verifikuje ga) u bazi na koju pokazuje DATABASE_URL.
// Upotreba:
//   DATABASE_URL="<konekcija>" npx tsx scripts/postavi-admin.ts <email_ili_pseudonim>
//
// Napomena: posle promene korisnik mora da se izloguje i ponovo prijavi
// (uloga se učitava u JWT pri loginu).

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const idn = process.argv[2];
  if (!idn) {
    console.error("Greška: navedi email ili pseudonim. Primer: npx tsx scripts/postavi-admin.ts pera@example.com");
    process.exit(1);
  }

  const korisnik = await prisma.user.findFirst({
    where: { OR: [{ email: idn }, { pseudonim: idn }] },
    select: { id: true, email: true, pseudonim: true, role: true },
  });

  if (!korisnik) {
    console.error(`Nije pronađen korisnik sa email/pseudonim: "${idn}"`);
    process.exit(1);
  }

  if (korisnik.role === "ADMIN") {
    console.log(`Korisnik "${korisnik.pseudonim}" (${korisnik.email ?? "bez email-a"}) je već ADMIN.`);
    return;
  }

  await prisma.user.update({
    where: { id: korisnik.id },
    data: { role: "ADMIN", verified: true },
  });

  console.log(`✓ Korisnik "${korisnik.pseudonim}" (${korisnik.email ?? "bez email-a"}) je sada ADMIN.`);
  console.log("  Izloguj se i ponovo prijavi da sesija učita admin ulogu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
