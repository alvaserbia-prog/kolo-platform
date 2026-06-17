import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// READ-ONLY: kompaktan spisak osnivača + sumnjivih naloga. Ništa ne menja.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { memberHash: { startsWith: "osn" } },
        { email: { contains: "deimos" } },
        { pseudonim: { startsWith: "korisnik_" } },
        { pseudonim: { startsWith: "Korisnik_" } },
      ],
    },
    select: {
      pseudonim: true, email: true, memberHash: true,
      tipKorisnika: true, admin: true, verified: true,
      indeksStvarnosti: true, status: true, createdAt: true,
    },
    orderBy: [{ memberHash: "asc" }, { createdAt: "asc" }],
  });

  console.log(`\nNAĐENO: ${users.length} naloga\n`);
  for (const u of users) {
    console.log(
      `${(u.memberHash ?? "").padEnd(10)} | ${(u.pseudonim ?? "").padEnd(16)} | ` +
      `${(u.email ?? "(bez mejla)").padEnd(26)} | ${u.tipKorisnika.padEnd(13)} | ` +
      `admin=${u.admin} | verif=${u.verified} idx=${u.indeksStvarnosti}% | ${u.status} | ${u.createdAt.toISOString().slice(0,10)}`
    );
  }
  console.log("\nREAD-ONLY. Ništa nije promenjeno.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
