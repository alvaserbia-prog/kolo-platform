/**
 * End-to-end smoke test za graf verifikacija (Pravilnik o dokazu stvarnosti v3.5.0).
 *
 * Scenario:
 *   1. Kreira 5 test korisnika (prefix "smoke_")
 *   2. Postavlja prvi kao POCETNI sa +1000 POEN (kao da je iz seed-a)
 *   3. POCETNI generiše token za korisnika 2, verifikuje ga (postaje REGULARNI sa 10%)
 *   4. Korisnik 2 verifikuje korisnika 3 (slot potrošen, čeka nadzor)
 *   5. Pokušaj recipročnog (3 → 2) — očekuje grešku
 *   6. Pokušaj descendenta (POCETNI → 3) — očekuje grešku
 *   7. Drugi UO (4) nadzire verifikaciju 2 → 3; 2-u se vraća slot, 4 dobija 500 POEN
 *   8. Provera zero-sum: SUM(wallet.balance) = 0
 *   9. Cleanup test korisnika
 */
import "dotenv/config";
import {
  PrismaClient,
  WalletType,
  TipKorisnika,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  generisiTokenZaVerifikaciju,
  izvrsiVerifikaciju,
  VerifikacijaGreska,
} from "../src/lib/protokol/verifikacija-service";
import { obaviNadzor } from "../src/lib/protokol/nadzor-service";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PREFIX = "smoke_dokaz_";
const BANKA = "banka-singleton";

async function cleanup() {
  console.log("\n=== Cleanup test korisnika ===");
  const users = await prisma.user.findMany({
    where: { pseudonim: { startsWith: PREFIX } },
    select: { id: true },
  });
  const ids = users.map((u) => u.id);
  if (ids.length === 0) return;

  // Brisanje u redosledu zbog FK ograničenja
  await prisma.verifikacijaToken.deleteMany({ where: { korisnikId: { in: ids } } });
  await prisma.verifikacionaVeza.deleteMany({
    where: { OR: [{ verifikatorId: { in: ids } }, { verifikovaniId: { in: ids } }] },
  });
  await prisma.transaction.deleteMany({
    where: {
      OR: [
        { fromWallet: { userId: { in: ids } } },
        { toWallet: { userId: { in: ids } } },
      ],
    },
  });
  await prisma.wallet.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  console.log(`Obrisano ${ids.length} test korisnika i pratećih zapisa.`);
}

async function kreirajKorisnika(broj: number, tip: TipKorisnika) {
  const pseudonim = `${PREFIX}${broj}`;
  const user = await prisma.user.create({
    data: {
      email: `${PREFIX}${broj}@test.local`,
      pseudonim,
      passwordHash: null,
      tipKorisnika: tip,
      indeksStvarnosti: tip === TipKorisnika.POCETNI ? 10 : 0,
      memberHash: `${PREFIX}${broj}h`,
      wallet: { create: { type: WalletType.USER, balance: 0 } },
    },
    include: { wallet: true },
  });
  return user;
}

async function emitujPocetnih(userId: string, walletId: string) {
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: BANKA },
      data: { balance: { decrement: 1000 } },
    }),
    prisma.wallet.update({
      where: { id: walletId },
      data: { balance: { increment: 1000 } },
    }),
    prisma.transaction.create({
      data: {
        fromWalletId: BANKA,
        toWalletId: walletId,
        amount: 1000,
        type: "EMISIJA_VERIFIKACIJA",
        description: "[SMOKE] Početni doprinos UO",
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { pocetnaEmisijaIzvrsena: true },
    }),
  ]);
}

async function verifikujKroz(verifikatorId: string, verifikovaniId: string) {
  const t = await generisiTokenZaVerifikaciju(verifikovaniId);
  return izvrsiVerifikaciju({
    verifikatorId,
    tokenIliBroj: t.token,
    potvrdaPoznavanja: true,
  });
}

async function main() {
  console.log("=== Smoke test: dokaz stvarnosti ===\n");

  // Banka mora postojati
  await prisma.wallet.upsert({
    where: { id: BANKA },
    update: {},
    create: { id: BANKA, type: WalletType.PROTOKOL, balance: 0 },
  });

  // Početni cleanup (ako je prethodni run pao)
  await cleanup();

  // 1. Kreiraj 5 test korisnika
  const u1 = await kreirajKorisnika(1, TipKorisnika.POCETNI); // POCETNI
  const u2 = await kreirajKorisnika(2, TipKorisnika.NEVERIFIKOVAN);
  const u3 = await kreirajKorisnika(3, TipKorisnika.NEVERIFIKOVAN);
  const u4 = await kreirajKorisnika(4, TipKorisnika.POCETNI); // drugi POCETNI za nadzor
  const u5 = await kreirajKorisnika(5, TipKorisnika.NEVERIFIKOVAN);
  console.log(`✓ Kreirano 5 test korisnika`);

  await emitujPocetnih(u1.id, u1.wallet!.id);
  await emitujPocetnih(u4.id, u4.wallet!.id);
  console.log(`✓ Početna emisija 1.000 POEN za 2 POCETNI`);

  // 2. POCETNI u1 verifikuje u2
  const v1 = await verifikujKroz(u1.id, u2.id);
  console.log(`✓ ${u1.pseudonim} → ${u2.pseudonim}: indeks ${v1.verifikovaniNoviIndeks}%`);

  // Provera: u2 je sada REGULARNI sa indeksom 10
  const u2Update = await prisma.user.findUniqueOrThrow({
    where: { id: u2.id },
    select: { tipKorisnika: true, indeksStvarnosti: true },
  });
  if (u2Update.tipKorisnika !== TipKorisnika.REGULARNI || u2Update.indeksStvarnosti !== 10) {
    throw new Error(`u2 očekivan REGULARNI/10, dobio ${u2Update.tipKorisnika}/${u2Update.indeksStvarnosti}`);
  }
  console.log(`  → u2 sada REGULARNI sa 10%`);

  // 3. u2 (REGULARNI sa 10%) verifikuje u3
  const v2 = await verifikujKroz(u2.id, u3.id);
  console.log(`✓ ${u2.pseudonim} → ${u3.pseudonim}: indeks ${v2.verifikovaniNoviIndeks}%`);

  // Provera: u2 ima slotoviPotroseni=1
  const u2Slot = await prisma.user.findUniqueOrThrow({
    where: { id: u2.id },
    select: { slotoviPotroseni: true },
  });
  if (u2Slot.slotoviPotroseni !== 1) {
    throw new Error(`u2 očekivan slotoviPotroseni=1, dobio ${u2Slot.slotoviPotroseni}`);
  }
  console.log(`  → u2 slot potrošen (1/1)`);

  // 4. Pokušaj recipročnog: u3 → u2 (mora da padne)
  try {
    await verifikujKroz(u3.id, u2.id);
    throw new Error("OČEKIVANA greška za recipročno NIJE bačena!");
  } catch (e) {
    if (!(e instanceof VerifikacijaGreska)) throw e;
    console.log(`✓ Recipročno odbijeno: "${e.message}"`);
  }

  // 5. Pokušaj descendenta: u1 → u3 (mora da padne — u3 je descendent)
  try {
    await verifikujKroz(u1.id, u3.id);
    throw new Error("OČEKIVANA greška za descendent NIJE bačena!");
  } catch (e) {
    if (!(e instanceof VerifikacijaGreska)) throw e;
    console.log(`✓ Descendent odbijen: "${e.message}"`);
  }

  // 6. u4 (drugi POCETNI) nadzire verifikaciju v2 (u2 → u3)
  await obaviNadzor({ verifikacijaId: v2.verifikacijaId, nadzornikId: u4.id });
  const u2PosleNadzora = await prisma.user.findUniqueOrThrow({
    where: { id: u2.id },
    select: { slotoviPotroseni: true },
  });
  if (u2PosleNadzora.slotoviPotroseni !== 0) {
    throw new Error(`Posle nadzora u2 očekivan slotoviPotroseni=0, dobio ${u2PosleNadzora.slotoviPotroseni}`);
  }
  const u4Wallet = await prisma.wallet.findUniqueOrThrow({ where: { userId: u4.id } });
  if (u4Wallet.balance !== 1500) {
    // 1000 početna + 500 nadzor = 1500
    throw new Error(`u4 očekivan balans 1500, dobio ${u4Wallet.balance}`);
  }
  console.log(`✓ Nadzor obavljen: u2 slot vraćen, u4 +500 POEN (ukupno ${u4Wallet.balance})`);

  // 7. Pošto je u2 sada sa indeksom 10 i slot vraćen, sad može da verifikuje još jednog (u5)
  const v3 = await verifikujKroz(u2.id, u5.id);
  console.log(`✓ ${u2.pseudonim} → ${u5.pseudonim}: indeks ${v3.verifikovaniNoviIndeks}%`);

  // 8. Zero-sum provera
  const agg = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const sum = agg._sum.balance ?? 0;
  if (sum !== 0) {
    throw new Error(`Zero-sum NARUŠEN: zbir balansa = ${sum}`);
  }
  console.log(`✓ Zero-sum OK (zbir svih wallet.balance = 0)`);

  // 9. Pregled grafa za u1
  const grafZapisi = await prisma.verifikacionaVeza.findMany({
    where: { OR: [{ verifikatorId: u1.id }, { verifikovaniId: u1.id }] },
    include: {
      verifikator: { select: { pseudonim: true } },
      verifikovani: { select: { pseudonim: true } },
    },
  });
  console.log(`\nGraf zapisi gde je u1 učesnik:`);
  for (const z of grafZapisi) {
    console.log(`  ${z.verifikator.pseudonim} → ${z.verifikovani.pseudonim} (redniBroj=${z.redniBroj}, nadzor=${z.nadzornikId ? "✓" : "—"})`);
  }

  // 10. Cleanup
  await cleanup();
  console.log("\n=== Smoke test ZAVRŠEN USPEŠNO ===");
}

main()
  .catch(async (e) => {
    console.error("✗ SMOKE TEST FAILED:", e);
    await cleanup().catch(() => {});
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
