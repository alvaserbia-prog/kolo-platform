/**
 * Seed početnih korisnika UO Fondacije (Korak 2 — Pravilnik o dokazu stvarnosti v3.5.0).
 *
 * Za svakog UO člana iz prisma/uo-clanovi.json:
 *   - Kreira User nalog ako ne postoji (bez lozinke — postavlja se kroz reset password tok)
 *   - Postavlja: tipKorisnika = POCETNI, indeksStvarnosti = 10, slotoviPotroseni = 0
 *   - Ako pocetnaEmisijaIzvrsena = false: emituje 1.000 POEN-a po čl. 7 Pravilnika
 *     (analogija — POCETNI korisnici nemaju verifikatora po čl. 14, ali se primenjuje
 *     isto pravilo o emisiji za "verifikovanog")
 *
 * Idempotentno — može da se pokrene više puta bez duplikata ili dupliranja emisije.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {
  PrismaClient,
  WalletType,
  TipKorisnika,
  AdminNivo,
  TransactionType,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BANKA_WALLET_ID = "banka-singleton";
const POCETNA_EMISIJA = 1_000;

type UoClan = {
  email: string;
  pseudonim: string;
  memberHash: string;
};

function ucitajUoClanove(): UoClan[] {
  const configPath = path.resolve(__dirname, "uo-clanovi.json");
  if (!fs.existsSync(configPath)) {
    console.error(`✗ Konfiguracioni fajl ne postoji: ${configPath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(configPath, "utf-8");
  const parsed = JSON.parse(raw) as UoClan[];

  const validni = parsed.filter((c) => {
    if (!c.email || !c.email.includes("@")) {
      console.warn(`⚠ Preskačem nevažeći email: ${JSON.stringify(c)}`);
      return false;
    }
    if (!c.pseudonim || !c.memberHash) {
      console.warn(`⚠ Preskačem nepotpun unos: ${JSON.stringify(c)}`);
      return false;
    }
    return true;
  });

  if (validni.length === 0) {
    console.log("Nema UO članova za seed.");
    process.exit(0);
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

async function seedUoClana(clan: UoClan) {
  // 1. Kreiraj ili apdejtuj User
  const postojeci = await prisma.user.findUnique({
    where: { email: clan.email },
    include: { wallet: true },
  });

  let user;
  if (postojeci) {
    // Postojeći nalog — apdejtuj samo polja vezana za dokaz stvarnosti
    user = await prisma.user.update({
      where: { id: postojeci.id },
      data: {
        tipKorisnika: TipKorisnika.NOSILAC_ZRNA,
        admin: AdminNivo.SUPERADMIN,
        indeksStvarnosti: Math.max(postojeci.indeksStvarnosti, 10),
        slotoviPotroseni: postojeci.slotoviPotroseni,
        // pseudonim, memberHash — NE diramo na postojećem nalogu
      },
      include: { wallet: true },
    });

    // Osiguraj da ima wallet
    if (!user.wallet) {
      const w = await prisma.wallet.create({
        data: { userId: user.id, type: WalletType.USER, balance: 0 },
      });
      user = { ...user, wallet: w };
    }
    console.log(`  ↻ Apdejtovan postojeći nalog: ${clan.email} (${user.pseudonim})`);
  } else {
    user = await prisma.user.create({
      data: {
        email: clan.email,
        passwordHash: null, // bez lozinke — UO član postavlja kroz reset password tok
        pseudonim: clan.pseudonim,
        tipKorisnika: TipKorisnika.NOSILAC_ZRNA,
        admin: AdminNivo.SUPERADMIN,
        indeksStvarnosti: 10,
        slotoviPotroseni: 0,
        memberHash: clan.memberHash,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
      include: { wallet: true },
    });
    console.log(`  + Kreiran novi nalog: ${clan.email} (${clan.pseudonim})`);
  }

  // 2. Početna emisija 1.000 POEN — idempotentno preko pocetnaEmisijaIzvrsena flag-a
  if (!user.wallet) {
    throw new Error(`Wallet ne postoji za korisnika ${user.email}`);
  }

  const aktualni = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { pocetnaEmisijaIzvrsena: true },
  });

  if (aktualni.pocetnaEmisijaIzvrsena) {
    console.log(`  ⊙ Početna emisija već izvršena — preskačem`);
    return;
  }

  // Banka u minus, korisnik prima POEN, transakcija upisana — sve u jednoj transakciji
  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: BANKA_WALLET_ID },
      data: { balance: { decrement: POCETNA_EMISIJA } },
    });
    await tx.wallet.update({
      where: { id: user.wallet!.id },
      data: { balance: { increment: POCETNA_EMISIJA } },
    });
    await tx.transaction.create({
      data: {
        fromWalletId: BANKA_WALLET_ID,
        toWalletId: user.wallet!.id,
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

  console.log(`  ✓ Emitovano 1.000 POEN — ${user.pseudonim}`);
}

async function ispisiPregled(clanovi: UoClan[]) {
  const ukupnoUoClanova = await prisma.user.count({
    where: { admin: AdminNivo.SUPERADMIN },
  });
  const banka = await prisma.wallet.findUnique({ where: { id: BANKA_WALLET_ID } });
  const sumaSvihBalansa = await prisma.wallet.aggregate({ _sum: { balance: true } });

  console.log("\n=== Seed dokaza stvarnosti završen ===");
  console.log(`UO članova (POCETNI):  ${ukupnoUoClanova}`);
  console.log(`Banka balans:           ${banka?.balance.toLocaleString("sr-RS")} POEN`);
  console.log(`Zbir svih balansa:      ${(sumaSvihBalansa._sum.balance ?? 0).toLocaleString("sr-RS")} (zero-sum check)`);

  console.log("\nUO članovi:");
  for (const c of clanovi) {
    const u = await prisma.user.findUnique({
      where: { email: c.email },
      include: { wallet: true },
    });
    if (u) {
      console.log(
        `  ${u.pseudonim.padEnd(14)} — ${c.email.padEnd(30)} ` +
          `tip=${u.tipKorisnika} indeks=${u.indeksStvarnosti}% ` +
          `POEN=${u.wallet?.balance.toLocaleString("sr-RS") ?? "—"}`
      );
    }
  }
  console.log(
    "\nNapomena: UO članovi nemaju početnu lozinku — login je kroz reset password tok."
  );
}

async function main() {
  console.log("=== Seed: dokaz stvarnosti (UO Fondacije) ===\n");

  const clanovi = ucitajUoClanove();
  await osiguraBankuWallet();

  for (const c of clanovi) {
    await seedUoClana(c);
  }

  await ispisiPregled(clanovi);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
