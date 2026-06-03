import "dotenv/config";
import { PrismaClient, WalletType, TipKorisnika } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ADMIN_LOZINKA = "admin1234";

async function main() {
  console.log("=== KOLO Seed (PRODUKCIJA — minimalno) ===\n");

  await prisma.wallet.upsert({
    where: { id: "banka-singleton" },
    update: {},
    create: { id: "banka-singleton", type: WalletType.PROTOKOL, balance: 0 },
  });
  console.log("✓ Banka (Protokol) wallet");

  const hash = await bcrypt.hash(ADMIN_LOZINKA, 12);
  await prisma.user.upsert({
    where: { email: "admin@ekolo.rs" },
    update: { tipKorisnika: TipKorisnika.POCETNI, indeksStvarnosti: 10, verified: true },
    create: {
      email: "admin@ekolo.rs",
      passwordHash: hash,
      pseudonim: "Admin",
      tipKorisnika: TipKorisnika.POCETNI,
      indeksStvarnosti: 10,
      verified: true,
      verifiedAt: new Date(),
      memberHash: "adm00001",
      location: "Beograd",
      wallet: { create: { type: WalletType.USER, balance: 0 } },
    },
  });
  console.log(`✓ Admin: admin@ekolo.rs (lozinka: ${ADMIN_LOZINKA})`);

  console.log("\n=== Produkcija pripremljena ===");
  console.log("Bez testnih korisnika, bez seed-a — čisto za prave registracije.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
