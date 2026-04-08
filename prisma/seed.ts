import "dotenv/config";
import { PrismaClient, WalletType, Role, TransactionType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Seed lozinka za sve testne korisnike
const TEST_LOZINKA = "test1234";

// Testni korisnici
const testKorisnici = [
  { email: "mila@test.rs",   pseudonim: "Mila_V",   referralCode: "TEST0001", memberHash: "tst00001", location: "Beograd" },
  { email: "petar@test.rs",  pseudonim: "Petar_K",  referralCode: "TEST0002", memberHash: "tst00002", location: "Novi Sad" },
  { email: "ana@test.rs",    pseudonim: "Ana_D",    referralCode: "TEST0003", memberHash: "tst00003", location: "Niš" },
  { email: "marko@test.rs",  pseudonim: "Marko_J",  referralCode: "TEST0004", memberHash: "tst00004", location: "Kragujevac" },
  { email: "jovana@test.rs", pseudonim: "Jovana_R", referralCode: "TEST0005", memberHash: "tst00005", location: "Subotica" },
  { email: "stefan@test.rs", pseudonim: "Stefan_M", referralCode: "TEST0006", memberHash: "tst00006", location: "Beograd" },
];

// POEN koji dobija svaki korisnik pri verifikaciji
const POEN_VERIFIKACIJA = 5_000;
// POEN za osnivanje zadruge
const POEN_ZADRUGA_OSNIVANJE = 50_000;

async function main() {
  console.log("=== KOLO Seed ===\n");

  // ─── 1. Banka wallet ───────────────────────────────────────────────────────
  const banka = await prisma.wallet.upsert({
    where: { id: "banka-singleton" },
    update: {},
    create: {
      id: "banka-singleton",
      type: WalletType.BANKA,
      balance: 0,
    },
  });
  console.log("✓ Banka wallet:", banka.id);

  // ─── 2. Admin korisnik ─────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kolo.rs" },
    update: {},
    create: {
      email: "admin@kolo.rs",
      passwordHash: adminHash,
      pseudonim: "Admin",
      role: Role.ADMIN,
      verified: true,
      verifiedAt: new Date(),
      referralCode: "ADMIN0000",
      memberHash: "adm00001",
      wallet: { create: { type: WalletType.USER, balance: 0 } },
    },
  });
  console.log("✓ Admin:", admin.pseudonim, `(${admin.email}) — lozinka: admin1234`);

  // ─── 3. Testni korisnici ───────────────────────────────────────────────────
  const testHash = await bcrypt.hash(TEST_LOZINKA, 12);
  const kreiraniKorisnici: Array<{ id: string; pseudonim: string; walletId: string }> = [];

  for (const k of testKorisnici) {
    const korisnik = await prisma.user.upsert({
      where: { email: k.email },
      update: {},
      create: {
        email: k.email,
        passwordHash: testHash,
        pseudonim: k.pseudonim,
        role: Role.FIZICKO_LICE,
        verified: true,
        verifiedAt: new Date(),
        referralCode: k.referralCode,
        memberHash: k.memberHash,
        location: k.location,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
      include: { wallet: true },
    });

    const walletId = korisnik.wallet!.id;
    kreiraniKorisnici.push({ id: korisnik.id, pseudonim: korisnik.pseudonim, walletId });

    // Emisija POEN-a pri verifikaciji (direktna DB operacija — bypass emitujPoen zbog seed konteksta)
    const vecImaTransakciju = await prisma.transaction.findFirst({
      where: { toWalletId: walletId, type: TransactionType.EMISIJA_VERIFIKACIJA },
    });

    if (!vecImaTransakciju) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: "banka-singleton" },
          data: { balance: { decrement: POEN_VERIFIKACIJA } },
        }),
        prisma.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: POEN_VERIFIKACIJA } },
        }),
        prisma.transaction.create({
          data: {
            fromWalletId: "banka-singleton",
            toWalletId: walletId,
            amount: POEN_VERIFIKACIJA,
            type: TransactionType.EMISIJA_VERIFIKACIJA,
            description: "Bonus za verifikaciju identiteta",
          },
        }),
      ]);
    }

    console.log(`✓ Korisnik: ${korisnik.pseudonim} (${k.email}) — ${POEN_VERIFIKACIJA} POEN`);
  }

  // ─── 4. Test zadruga ───────────────────────────────────────────────────────
  const zadruga = await prisma.zadruga.upsert({
    where: { name: "Zelena Mreža" },
    update: {},
    create: {
      name: "Zelena Mreža",
      description: "Test zadruga za Alpha fazu — uzajamna podrška i razmena u Beogradu",
      location: "Beograd",
      wallet: { create: { type: WalletType.ZADRUGA, balance: 0 } },
    },
    include: { wallet: true },
  });
  console.log("\n✓ Zadruga:", zadruga.name);

  const zadrugaWalletId = zadruga.wallet!.id;

  // Emisija 50.000 POEN zadruznom novčaniku (osnivanje)
  const vecImaZadrugaEmisiju = await prisma.transaction.findFirst({
    where: { toWalletId: zadrugaWalletId, type: TransactionType.EMISIJA_ZADRUGA_OSNIVANJE },
  });

  if (!vecImaZadrugaEmisiju) {
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: "banka-singleton" },
        data: { balance: { decrement: POEN_ZADRUGA_OSNIVANJE } },
      }),
      prisma.wallet.update({
        where: { id: zadrugaWalletId },
        data: { balance: { increment: POEN_ZADRUGA_OSNIVANJE } },
      }),
      prisma.transaction.create({
        data: {
          fromWalletId: "banka-singleton",
          toWalletId: zadrugaWalletId,
          amount: POEN_ZADRUGA_OSNIVANJE,
          type: TransactionType.EMISIJA_ZADRUGA_OSNIVANJE,
          description: "Emisija pri osnivanju zadruge",
        },
      }),
    ]);
    console.log(`  ✓ Emisija osnivanja: ${POEN_ZADRUGA_OSNIVANJE} POEN`);
  }

  // Dodaj prvih 5 korisnika kao članove (uključujući isAdmin za prvog)
  for (let i = 0; i < Math.min(5, kreiraniKorisnici.length); i++) {
    const k = kreiraniKorisnici[i];

    const vecClan = await prisma.zadrugaMembership.findFirst({
      where: { userId: k.id, zadrugaId: zadruga.id, leftAt: null },
    });

    if (!vecClan) {
      await prisma.zadrugaMembership.create({
        data: {
          userId: k.id,
          zadrugaId: zadruga.id,
          isAdmin: i === 0, // prvi osnivač je admin zadruge
        },
      });

      // Ažuriraj ulogu na ZADRUGAR
      await prisma.user.update({
        where: { id: k.id },
        data: { role: Role.ZADRUGAR },
      });
    }

    console.log(`  ✓ Član: ${k.pseudonim}${i === 0 ? " (admin zadruge)" : ""}`);
  }

  // Stefan_M (index 5) ostaje fizičko lice — nije u zadruzi, za testiranje pristupnica

  // ─── 5. Završni izveštaj ───────────────────────────────────────────────────
  const bankaFinalno = await prisma.wallet.findUnique({ where: { id: "banka-singleton" } });
  const ukupnoKorisnika = await prisma.user.count();

  console.log("\n=== Seed završen ===");
  console.log(`Korisnika ukupno: ${ukupnoKorisnika}`);
  console.log(`Banka balans: ${bankaFinalno?.balance} POEN`);
  console.log(`\nTest nalozi (lozinka: ${TEST_LOZINKA}):`);
  for (const k of testKorisnici) {
    console.log(`  ${k.pseudonim.padEnd(12)} — ${k.email}`);
  }
  console.log(`  Admin        — admin@kolo.rs (lozinka: admin1234)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
