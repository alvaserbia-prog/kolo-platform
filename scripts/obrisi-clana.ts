import "dotenv/config";
import { PrismaClient, TransactionType, TipKorisnika } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
  POEN_NADZORNIK,
  izracunajIndeks,
} from "../src/lib/protokol/dokaz-stvarnosti";

// ─────────────────────────────────────────────────────────────────────────────
// HARD-PURGE člana sa zero-sum mirror-reverzijom (greške s početka sistema).
// Default: DRY-RUN (sve izračuna, prikaže, pa rollback). Sa --apply upisuje.
//
//   DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) \
//     npx tsx scripts/obrisi-clana.ts            # dry-run
//   DATABASE_URL=...                             npx tsx scripts/obrisi-clana.ts --apply
// ─────────────────────────────────────────────────────────────────────────────

const PROTOKOL_WALLET_ID = "banka-singleton";
const APPLY = process.argv.includes("--apply");

// Mete: ID-jevi junk naloga sa početka (potvrđeni revizijom).
const META_IDS = [
  "b6627526-5c82-4ccb-a483-51bccd820897", // deimos25 (7dzptynw)
  "3d9acf76-f723-4e8a-9f54-2e34fdf4111c", // korisnik_1781693394945 (mg8y6sv9)
];

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

class DryRunRollback extends Error {}
const log: string[] = [];
const L = (s: string) => { log.push(s); };

async function obrisiJednog(tx: any, userId: string) {
  const u = await tx.user.findUnique({
    where: { id: userId },
    select: { id: true, pseudonim: true, email: true, memberHash: true, admin: true },
  });
  if (!u) { L(`  ✗ ${userId}: NE POSTOJI — preskačem`); return; }

  // ── ZAŠTITA: nikad osnivač / admin ──
  if (u.memberHash?.startsWith("osn") || u.admin !== "NONE") {
    throw new Error(`ODBIJENO: ${u.pseudonim} (${u.memberHash}, admin=${u.admin}) je osnivač/admin — ne brišem.`);
  }

  L(`\n── BRIŠEM: ${u.pseudonim} | ${u.email} | ${u.memberHash} ──`);
  const wallet = await tx.wallet.findUnique({ where: { userId } });

  // Helper: skini POEN korisniku i vrati Protokolu (kao vratiPoenProtokolu iz route.ts)
  async function vrati(targetUserId: string, iznos: number, opis: string) {
    if (iznos <= 0) return;
    const w = await tx.wallet.findUnique({ where: { userId: targetUserId } });
    if (!w) return;
    const stvarno = Math.min(w.balance, iznos);
    if (stvarno <= 0) return;
    await tx.wallet.update({ where: { id: w.id }, data: { balance: { decrement: stvarno } } });
    await tx.wallet.update({ where: { id: PROTOKOL_WALLET_ID }, data: { balance: { increment: stvarno } } });
    await tx.transaction.create({
      data: { fromWalletId: w.id, toWalletId: PROTOKOL_WALLET_ID, amount: stvarno, type: TransactionType.TRANSFER, description: opis },
    });
    L(`    ↩ vraćeno Protokolu: ${stvarno} POEN od user=${targetUserId} (${opis})`);
  }

  // ── 1. Reverzija verifikacija (oba smera) ──
  const kaoVerifikator = await tx.verifikacionaVeza.findMany({ where: { verifikatorId: userId } });
  const kaoVerifikovani = await tx.verifikacionaVeza.findMany({ where: { verifikovaniId: userId } });

  for (const v of kaoVerifikator) {
    await vrati(v.verifikovaniId, POEN_VERIFIKOVANI, "Poništavanje verifikacije (brisanje junk naloga)");
    if (v.podlezeNadzoru && v.nadzornikId) await vrati(v.nadzornikId, POEN_NADZORNIK, "Poništavanje nadzora (brisanje junk naloga)");
    const ostalo = await tx.verifikacionaVeza.count({ where: { verifikovaniId: v.verifikovaniId, id: { not: v.id } } });
    if (ostalo === 0) {
      await tx.user.update({ where: { id: v.verifikovaniId }, data: { tipKorisnika: TipKorisnika.NEVERIFIKOVAN, verified: false, verifiedAt: null, indeksStvarnosti: 0 } });
      L(`    ⤵ verifikovani ${v.verifikovaniId} → NEVERIFIKOVAN (0%)`);
    } else {
      await tx.user.update({ where: { id: v.verifikovaniId }, data: { indeksStvarnosti: izracunajIndeks(ostalo) } });
    }
  }
  for (const v of kaoVerifikovani) {
    await vrati(v.verifikatorId, POEN_VERIFIKATOR, "Poništavanje verifikacije (brisanje junk naloga)");
    if (v.podlezeNadzoru && v.nadzornikId) await vrati(v.nadzornikId, POEN_NADZORNIK, "Poništavanje nadzora (brisanje junk naloga)");
    const ver = await tx.user.findUnique({ where: { id: v.verifikatorId }, select: { tipKorisnika: true, slotoviPotroseni: true } });
    if (ver?.tipKorisnika === TipKorisnika.REGULARNI && ver.slotoviPotroseni > 0) {
      await tx.user.update({ where: { id: v.verifikatorId }, data: { slotoviPotroseni: { decrement: 1 } } });
      L(`    ⤴ vraćen slot verifikatoru ${v.verifikatorId}`);
    }
  }
  await tx.verifikacionaVeza.deleteMany({ where: { OR: [{ verifikatorId: userId }, { verifikovaniId: userId }] } });
  await tx.verifikacionaVeza.updateMany({ where: { nadzornikId: userId }, data: { nadzornikId: null } });
  L(`    × obrisano veza: verifikator=${kaoVerifikator.length}, verifikovani=${kaoVerifikovani.length}`);

  // ── 2. Njegovo stanje nazad Protokolu (jer brišemo wallet/transakcije) ──
  if (wallet && wallet.balance !== 0) {
    await tx.wallet.update({ where: { id: PROTOKOL_WALLET_ID }, data: { balance: { increment: wallet.balance } } });
    L(`    ↩ stanje člana ${wallet.balance} → Protokolu (briše se wallet)`);
  }

  // ── 3. Brisanje svih child redova (FK-bezbedan redosled) ──
  if (wallet) {
    const konv = await tx.konverzacija.findMany({ where: { OR: [{ user1Id: userId }, { user2Id: userId }] }, select: { id: true } });
    const konvIds = konv.map((k: any) => k.id);
    if (konvIds.length) await tx.poruka.deleteMany({ where: { konverzacijaId: { in: konvIds } } });
    await tx.poruka.deleteMany({ where: { posiljacId: userId } });
    if (konvIds.length) await tx.konverzacija.deleteMany({ where: { id: { in: konvIds } } });

    const delTx = await tx.transaction.deleteMany({ where: { OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }] } });
    L(`    × obrisano transakcija člana: ${delTx.count}`);
  }
  await tx.chatMessage.deleteMany({ where: { userId } });
  await tx.notifikacija.deleteMany({ where: { userId } });
  await tx.verifikacijaToken.deleteMany({ where: { korisnikId: userId } });
  await tx.politikaPrihvatanje.deleteMany({ where: { userId } });
  await tx.pravilnikPrihvatanje.deleteMany({ where: { userId } });
  await tx.zahtevZaJemstvo.deleteMany({ where: { userId } });
  await tx.donationRecord.deleteMany({ where: { userId } });
  await tx.bug.deleteMany({ where: { userId } });
  await tx.passwordResetToken.deleteMany({ where: { userId } });
  await tx.userPodaci.deleteMany({ where: { userId } });
  if (wallet) await tx.wallet.delete({ where: { id: wallet.id } });
  await tx.user.delete({ where: { id: userId } });
  L(`    ✓ nalog obrisan: ${u.pseudonim}`);
}

async function main() {
  console.log(`\n=== HARD-PURGE (${APPLY ? "APPLY — UPISUJE" : "DRY-RUN — rollback"}) ===`);
  const preZbir = await prisma.wallet.aggregate({ _sum: { balance: true } });
  console.log(`Zero-sum PRE: ${preZbir._sum.balance}`);

  try {
    await prisma.$transaction(async (tx) => {
      for (const id of META_IDS) await obrisiJednog(tx, id);
      const zbir = await tx.wallet.aggregate({ _sum: { balance: true } });
      L(`\nZero-sum POSLE (u transakciji): ${zbir._sum.balance}`);
      if (zbir._sum.balance !== preZbir._sum.balance) {
        throw new Error(`ZERO-SUM NARUŠEN: pre=${preZbir._sum.balance} posle=${zbir._sum.balance} — ROLLBACK.`);
      }
      if (!APPLY) throw new DryRunRollback();
    }, { timeout: 60_000 });
    console.log(log.join("\n"));
    console.log("\n✓ APPLIED — promene upisane.");
  } catch (e) {
    console.log(log.join("\n"));
    if (e instanceof DryRunRollback) {
      console.log("\n[DRY-RUN] Rollback — ništa nije upisano. Pokreni sa --apply da se primeni.");
    } else {
      console.error("\n✗ GREŠKA (rollback):", e instanceof Error ? e.message : e);
      process.exit(1);
    }
  }
}

main().finally(() => prisma.$disconnect());
