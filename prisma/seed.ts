import "dotenv/config";
import { PrismaClient, WalletType, Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Banka wallet (singleton, userId=null, zadrugaId=null)
  const banka = await prisma.wallet.upsert({
    where: { id: "banka-singleton" },
    update: {},
    create: {
      id: "banka-singleton",
      type: WalletType.BANKA,
      balance: 0,
    },
  });
  console.log("Banka wallet:", banka.id, "balans:", banka.balance);

  // Admin korisnik
  const passwordHash = await bcrypt.hash("admin1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kolo.rs" },
    update: {},
    create: {
      email: "admin@kolo.rs",
      passwordHash,
      pseudonim: "Admin",
      role: Role.ADMIN,
      verified: true,
      verifiedAt: new Date(),
      referralCode: "ADMIN0000",
      wallet: {
        create: {
          type: WalletType.USER,
          balance: 0,
        },
      },
    },
  });
  console.log("Admin korisnik:", admin.pseudonim, admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
