import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const vezeCount = await prisma.verifikacionaVeza.count();
  const emisijaVerifCount = await prisma.transaction.count({
    where: { type: "EMISIJA_VERIFIKACIJA" },
  });
  const emisijaNadzorCount = await prisma.transaction.count({
    where: { type: "EMISIJA_NADZOR" },
  });
  const agg = await prisma.wallet.aggregate({ _sum: { balance: true } });

  console.log("=== Dijagnostika ===");
  console.log("VerifikacionaVeza zapisa:    ", vezeCount);
  console.log("EMISIJA_VERIFIKACIJA tx:     ", emisijaVerifCount);
  console.log("Ocekivano (vezeCount × 2 + UO):", vezeCount * 2 + 3);
  console.log("EMISIJA_NADZOR tx:           ", emisijaNadzorCount);
  console.log("Zero-sum (treba 0):          ", agg._sum.balance ?? 0);

  console.log("\n=== Sve VerifikacionaVeza ===");
  const veze = await prisma.verifikacionaVeza.findMany({
    include: {
      verifikator: { select: { pseudonim: true } },
      verifikovani: { select: { pseudonim: true } },
    },
  });
  for (const v of veze) {
    console.log(
      `  ${v.verifikator.pseudonim} → ${v.verifikovani.pseudonim}  (datum: ${v.vremenskiZig.toISOString()}, nadzor: ${v.nadzornikId ?? "—"})`
    );
  }

  console.log("\n=== Poslednje EMISIJA_VERIFIKACIJA transakcije ===");
  const tx = await prisma.transaction.findMany({
    where: { type: "EMISIJA_VERIFIKACIJA" },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      toWallet: { include: { user: { select: { pseudonim: true } } } },
    },
  });
  for (const t of tx) {
    console.log(
      `  +${t.amount} POEN → ${t.toWallet?.user?.pseudonim ?? "—"}  "${t.description ?? ""}"  (${t.createdAt.toISOString()})`
    );
  }

  console.log("\n=== Korisnici tipa POCETNI ili REGULARNI ===");
  const users = await prisma.user.findMany({
    where: {
      tipKorisnika: { in: ["POCETNI", "REGULARNI"] },
    },
    select: {
      pseudonim: true,
      tipKorisnika: true,
      indeksStvarnosti: true,
      slotoviPotroseni: true,
      pocetnaEmisijaIzvrsena: true,
      wallet: { select: { balance: true } },
    },
  });
  for (const u of users) {
    console.log(
      `  ${u.pseudonim.padEnd(15)} tip=${u.tipKorisnika.padEnd(10)} indeks=${u.indeksStvarnosti}%  slot=${u.slotoviPotroseni}  pocetnaEm=${u.pocetnaEmisijaIzvrsena}  POEN=${u.wallet?.balance ?? "—"}`
    );
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
