/**
 * Privremena skripta za carousel screenshotove — pravi realističan scenario:
 *  - dr.nikola.saric: verifikovan (indeks 30%), ranije verifikovao 2 osobe
 *  - Marko_S: neverifikovan prijatelj (biće verifikovan uživo kroz UI)
 * Pokreće se lokalno (`npx tsx prisma/setup-carousel.ts`) posle glavnog seed-a;
 * nije deo produkcionog/test seed toka.
 */
import "dotenv/config";
import {
  PrismaClient,
  WalletType,
  TransactionType,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const LOZINKA = "test1234";

function daniPre(n: number, sati = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - sati);
  return d;
}

async function emitujIzBanke(toWalletId: string, amount: number, type: TransactionType, description: string, createdAt?: Date) {
  await prisma.$transaction([
    prisma.wallet.update({ where: { id: "banka-singleton" }, data: { balance: { decrement: amount } } }),
    prisma.wallet.update({ where: { id: toWalletId }, data: { balance: { increment: amount } } }),
    prisma.transaction.create({
      data: { fromWalletId: "banka-singleton", toWalletId, amount, type, description, ...(createdAt ? { createdAt } : {}) },
    }),
  ]);
}

async function napraviKorisnika(opts: {
  email: string; pseudonim: string; memberHash: string; location: string;
  verified: boolean; indeks?: number; slotoviPotroseni?: number; verifiedAt?: Date;
}) {
  const hash = await bcrypt.hash(LOZINKA, 12);
  return prisma.user.upsert({
    where: { email: opts.email },
    update: {},
    create: {
      email: opts.email,
      passwordHash: hash,
      pseudonim: opts.pseudonim,
      verified: opts.verified,
      verifiedAt: opts.verifiedAt ?? null,
      indeksStvarnosti: opts.indeks ?? 0,
      slotoviPotroseni: opts.slotoviPotroseni ?? 0,
      memberHash: opts.memberHash,
      location: opts.location,
      wallet: { create: { type: WalletType.USER, balance: 0 } },
    },
    include: { wallet: true },
  });
}

async function main() {
  const alva = await prisma.user.findUnique({ where: { email: "alva.serbia@gmail.com" }, include: { wallet: true } });
  const jelena = await prisma.user.findUnique({ where: { email: "jelenacs53@gmail.com" } });
  const dragonkiss = await prisma.user.findUnique({ where: { email: "dragonkiss025@gmail.com" } });
  if (!alva || !jelena || !dragonkiss) throw new Error("Nedostaju UO admini — pokreni seed prvo");

  // 1) dr.nikola.saric — verifikovan od 3 osnivača (indeks 30%), verifikovao 2 osobe
  const nikola = await napraviKorisnika({
    email: "nikola@lokal.test", pseudonim: "dr.nikola.saric", memberHash: "crsl0001",
    location: "Beograd", verified: true, indeks: 30, slotoviPotroseni: 2, verifiedAt: daniPre(45),
  });

  // 2) Dve osobe koje je ranije verifikovao
  const milica = await napraviKorisnika({
    email: "milica@lokal.test", pseudonim: "Milica_T", memberHash: "crsl0002",
    location: "Beograd", verified: true, indeks: 10, verifiedAt: daniPre(21),
  });
  const stefan = await napraviKorisnika({
    email: "stefan@lokal.test", pseudonim: "Stefan_M", memberHash: "crsl0003",
    location: "Novi Sad", verified: true, indeks: 10, verifiedAt: daniPre(9),
  });

  // 3) Prijatelj — neverifikovan (verifikuje se uživo kroz UI)
  await napraviKorisnika({
    email: "marko@lokal.test", pseudonim: "Marko_S", memberHash: "crsl0004",
    location: "Beograd", verified: false,
  });

  // 4) Graf verifikacija
  const veze = [
    { verifikatorId: alva.id, verifikovaniId: nikola.id, redniBroj: 1, vremenskiZig: daniPre(45), podlezeNadzoru: false },
    { verifikatorId: jelena.id, verifikovaniId: nikola.id, redniBroj: 1, vremenskiZig: daniPre(44), podlezeNadzoru: false },
    { verifikatorId: dragonkiss.id, verifikovaniId: nikola.id, redniBroj: 1, vremenskiZig: daniPre(43), podlezeNadzoru: false },
    { verifikatorId: nikola.id, verifikovaniId: milica.id, redniBroj: 1, vremenskiZig: daniPre(21), podlezeNadzoru: false },
    { verifikatorId: nikola.id, verifikovaniId: stefan.id, redniBroj: 2, vremenskiZig: daniPre(9), podlezeNadzoru: false },
  ];
  for (const v of veze) {
    await prisma.verifikacionaVeza.upsert({
      where: { verifikatorId_verifikovaniId: { verifikatorId: v.verifikatorId, verifikovaniId: v.verifikovaniId } },
      update: {},
      create: v,
    }).catch(async (e) => {
      // fallback ako unique ime nije verifikatorId_verifikovaniId
      const postoji = await prisma.verifikacionaVeza.findFirst({ where: { verifikatorId: v.verifikatorId, verifikovaniId: v.verifikovaniId } });
      if (!postoji) await prisma.verifikacionaVeza.create({ data: v });
    });
  }

  // 5) POEN istorija — autentični opisi kao u verifikacija-service
  const txPostoji = await prisma.transaction.findFirst({ where: { toWalletId: nikola.wallet!.id } });
  if (!txPostoji) {
    await emitujIzBanke(nikola.wallet!.id, 1000, TransactionType.EMISIJA_VERIFIKACIJA, "Primljena verifikacija od Alva", daniPre(45));
    await emitujIzBanke(nikola.wallet!.id, 1000, TransactionType.EMISIJA_VERIFIKACIJA, "Verifikacija Milica_T", daniPre(21));
    await emitujIzBanke(nikola.wallet!.id, 1000, TransactionType.EMISIJA_VERIFIKACIJA, "Verifikacija Stefan_M", daniPre(9));
    await emitujIzBanke(milica.wallet!.id, 1000, TransactionType.EMISIJA_VERIFIKACIJA, "Primljena verifikacija od dr.nikola.saric", daniPre(21));
    await emitujIzBanke(stefan.wallet!.id, 1000, TransactionType.EMISIJA_VERIFIKACIJA, "Primljena verifikacija od dr.nikola.saric", daniPre(9));
  }

  console.log("✓ Scenario spreman:");
  console.log("  dr.nikola.saric — nikola@lokal.test / test1234 (indeks 30%, 3.000 POEN)");
  console.log("  Marko_S (neverifikovan) — marko@lokal.test / test1234");
}

main().finally(() => prisma.$disconnect());
// (dopuna se izvršava kroz poseban poziv ispod)
