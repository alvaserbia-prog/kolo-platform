import "dotenv/config";
import { PrismaClient, WalletType, TipKorisnika, AdminNivo, TransactionType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BANKA_ID = "banka-singleton";
const OSNIVACKI_DOPRINOS = 1000; // POEN po osnivaču, emitovano iz protokola (zero-sum)

// Osnivači sistema. U kodu su NOSILAC_ZRNA (founder-tier status), prikazuju se
// kao osnivači. Nemaju lozinku — prijava ide preko Google-a ili reset lozinke
// pre prijave lozinkom. Nikola je SUPERADMIN (koren lanca jemstva), ostali NONE.
const OSNIVACI = [
  { email: "alva.serbia@gmail.com",  pseudonim: "Nikola",  memberHash: "osn00001", admin: AdminNivo.SUPERADMIN, location: "Sombor" },
  { email: "jelenacs53@gmail.com",   pseudonim: "Jelena",  memberHash: "osn00002", admin: AdminNivo.NONE,       location: "Sombor" },
  { email: "kissdragon025@gmail.com", pseudonim: "Danijel", memberHash: "osn00003", admin: AdminNivo.NONE,       location: "Sombor" },
  { email: "info@noxuz.net",         pseudonim: "Stefan",  memberHash: "osn00004", admin: AdminNivo.NONE,       location: "Čačak" },
  { email: "deimos25@gmail.com",     pseudonim: "Mihajlo", memberHash: "osn00005", admin: AdminNivo.NONE,       location: "Sombor" },
];

async function main() {
  console.log("=== KOLO Seed (PRODUKCIJA — minimalno) ===\n");

  await prisma.wallet.upsert({
    where: { id: BANKA_ID },
    update: {},
    create: { id: BANKA_ID, type: WalletType.PROTOKOL, balance: 0 },
  });
  console.log("✓ Banka (Protokol) wallet");

  // Stari admin@ekolo.rs se uklanja. Pristanci i wallet idu prvi (FK bez cascade).
  const stariAdmin = await prisma.user.findUnique({ where: { email: "admin@ekolo.rs" } });
  if (stariAdmin) {
    try {
      await prisma.pravilnikPrihvatanje.deleteMany({ where: { userId: stariAdmin.id } });
      await prisma.politikaPrihvatanje.deleteMany({ where: { userId: stariAdmin.id } });
      await prisma.wallet.deleteMany({ where: { userId: stariAdmin.id } });
      await prisma.user.delete({ where: { id: stariAdmin.id } });
      console.log("✓ Uklonjen stari admin@ekolo.rs");
    } catch (e) {
      console.warn("⚠ admin@ekolo.rs ima povezane zapise — obriši ručno:", e);
    }
  }

  for (const o of OSNIVACI) {
    await prisma.user.upsert({
      where: { email: o.email },
      update: {
        pseudonim: o.pseudonim,
        tipKorisnika: TipKorisnika.NOSILAC_ZRNA,
        jeOsnivac: true,
        admin: o.admin,
        indeksStvarnosti: 10,
        verified: true,
        location: o.location,
      },
      create: {
        email: o.email,
        pseudonim: o.pseudonim,
        tipKorisnika: TipKorisnika.NOSILAC_ZRNA,
        jeOsnivac: true,
        admin: o.admin,
        indeksStvarnosti: 10,
        verified: true,
        verifiedAt: new Date(),
        memberHash: o.memberHash,
        location: o.location,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
    });
    console.log(`✓ Osnivač: ${o.email} (${o.pseudonim})${o.admin === AdminNivo.SUPERADMIN ? " — SUPERADMIN" : ""}`);
  }

  // Osnivački doprinos: emisija iz protokola (banka → osnivač), zero-sum.
  // Idempotentno: preskače ako osnivač već ima EMISIJA_OSNIVACKI transakciju.
  for (const o of OSNIVACI) {
    const user = await prisma.user.findUnique({
      where: { email: o.email },
      include: { wallet: true },
    });
    if (!user?.wallet) continue;

    const vecEmitovano = await prisma.transaction.count({
      where: { toWalletId: user.wallet.id, type: TransactionType.EMISIJA_OSNIVACKI },
    });
    if (vecEmitovano > 0) {
      console.log(`• ${o.pseudonim}: osnivački doprinos već emitovan — preskačem`);
      continue;
    }

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          fromWalletId: BANKA_ID,
          toWalletId: user.wallet.id,
          amount: OSNIVACKI_DOPRINOS,
          type: TransactionType.EMISIJA_OSNIVACKI,
          description: "Osnivački doprinos",
        },
      }),
      prisma.wallet.update({ where: { id: user.wallet.id }, data: { balance: { increment: OSNIVACKI_DOPRINOS } } }),
      prisma.wallet.update({ where: { id: BANKA_ID }, data: { balance: { decrement: OSNIVACKI_DOPRINOS } } }),
    ]);
    console.log(`✓ ${o.pseudonim}: +${OSNIVACKI_DOPRINOS} POEN (EMISIJA_OSNIVACKI iz banke)`);
  }

  const banka = await prisma.wallet.findUnique({ where: { id: BANKA_ID } });
  console.log("\n=== Produkcija pripremljena ===");
  console.log(`5 osnivača, svaki +${OSNIVACKI_DOPRINOS} POEN kroz osnivački doprinos. Banka: ${banka?.balance} (zero-sum).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
