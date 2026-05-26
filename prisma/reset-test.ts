/**
 * Reset TESTNE baze na minimalno stanje: samo 3 člana UO Fondacije.
 *
 * Pokreće se NAKON `prisma migrate reset --force --skip-seed` (prazna baza, sve migracije primenjene).
 *
 * Kreira tačno 3 naloga iz prisma/uo-clanovi.json:
 *   - Alva (alva.serbia@gmail.com)  → role ADMIN
 *   - Jelena, Dragonkiss            → role FIZICKO_LICE
 * Svi: verified=true, tipKorisnika=POCETNI, indeksStvarnosti=10, lozinka = TEST_LOZINKA.
 * Svako dobija početnu emisiju 1.000 POEN (Protokol ide u minus → zero-sum).
 *
 * Idempotentno (upsert + flag pocetnaEmisijaIzvrsena) — može da se pokrene više puta.
 *
 * UPOZORENJE: namenjeno ISKLJUČIVO testnoj bazi. Ne pokretati nad produkcijom.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {
  PrismaClient,
  WalletType,
  Role,
  TipKorisnika,
  TransactionType,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BANKA_WALLET_ID = "banka-singleton";
const POCETNA_EMISIJA = 1_000;
const TEST_LOZINKA = process.env.TEST_LOZINKA ?? "kolo1234";
const ADMIN_EMAIL = "alva.serbia@gmail.com";

type UoClan = {
  email: string;
  pseudonim: string;
  referralCode: string;
  memberHash: string;
};

function ucitajUoClanove(): UoClan[] {
  const configPath = path.resolve(__dirname, "uo-clanovi.json");
  if (!fs.existsSync(configPath)) {
    console.error(`✗ Konfiguracioni fajl ne postoji: ${configPath}`);
    process.exit(1);
  }
  const parsed = JSON.parse(fs.readFileSync(configPath, "utf-8")) as UoClan[];
  const validni = parsed.filter(
    (c) => c.email?.includes("@") && c.pseudonim && c.referralCode && c.memberHash
  );
  if (validni.length === 0) {
    console.error("✗ Nema važećih UO članova u uo-clanovi.json");
    process.exit(1);
  }
  return validni;
}

async function osiguraBankuWallet() {
  await prisma.wallet.upsert({
    where: { id: BANKA_WALLET_ID },
    update: {},
    create: { id: BANKA_WALLET_ID, type: WalletType.PROTOKOL, balance: 0 },
  });
}

async function seedClan(clan: UoClan, lozinkaHash: string) {
  const jeAdmin = clan.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const role = jeAdmin ? Role.ADMIN : Role.FIZICKO_LICE;

  const user = await prisma.user.upsert({
    where: { email: clan.email },
    update: {
      passwordHash: lozinkaHash,
      role,
      verified: true,
      verifiedAt: new Date(),
      tipKorisnika: TipKorisnika.POCETNI,
      indeksStvarnosti: 10,
      slotoviPotroseni: 0,
    },
    create: {
      email: clan.email,
      passwordHash: lozinkaHash,
      pseudonim: clan.pseudonim,
      role,
      verified: true,
      verifiedAt: new Date(),
      tipKorisnika: TipKorisnika.POCETNI,
      indeksStvarnosti: 10,
      slotoviPotroseni: 0,
      referralCode: clan.referralCode,
      memberHash: clan.memberHash,
      location: "Beograd",
      wallet: { create: { type: WalletType.USER, balance: 0 } },
    },
    include: { wallet: true },
  });

  let wallet = user.wallet;
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId: user.id, type: WalletType.USER, balance: 0 },
    });
  }

  const aktualni = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { pocetnaEmisijaIzvrsena: true },
  });

  if (!aktualni.pocetnaEmisijaIzvrsena) {
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: BANKA_WALLET_ID },
        data: { balance: { decrement: POCETNA_EMISIJA } },
      });
      await tx.wallet.update({
        where: { id: wallet!.id },
        data: { balance: { increment: POCETNA_EMISIJA } },
      });
      await tx.transaction.create({
        data: {
          fromWalletId: BANKA_WALLET_ID,
          toWalletId: wallet!.id,
          amount: POCETNA_EMISIJA,
          type: TransactionType.EMISIJA_VERIFIKACIJA,
          description: "Početni doprinos UO Fondacije (čl. 14 Pravilnika o dokazu stvarnosti)",
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: { pocetnaEmisijaIzvrsena: true },
      });
    });
  }

  console.log(
    `  ${jeAdmin ? "★" : "+"} ${user.pseudonim.padEnd(12)} ${clan.email.padEnd(28)} role=${role} verified=true POEN=${POCETNA_EMISIJA}`
  );
}

async function main() {
  console.log("=== Reset TESTNE baze — samo 3 člana ===\n");

  const clanovi = ucitajUoClanove();
  const lozinkaHash = await bcrypt.hash(TEST_LOZINKA, 12);

  await osiguraBankuWallet();
  for (const c of clanovi) {
    await seedClan(c, lozinkaHash);
  }

  const banka = await prisma.wallet.findUnique({ where: { id: BANKA_WALLET_ID } });
  const suma = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const brojKorisnika = await prisma.user.count();

  console.log("\n=== Završeno ===");
  console.log(`Korisnika:          ${brojKorisnika}`);
  console.log(`Protokol balans:    ${banka?.balance.toLocaleString("sr-RS")} POEN`);
  console.log(`Zbir svih balansa:  ${(suma._sum.balance ?? 0).toLocaleString("sr-RS")} (zero-sum mora biti 0)`);
  console.log(`\nLozinka za sve naloge: ${TEST_LOZINKA}`);
  console.log(`Admin nalog:           ${ADMIN_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
