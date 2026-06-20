import "dotenv/config";
import { PrismaClient, TransactionType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ─────────────────────────────────────────────────────────────────────────────
// Brisanje nedovršenog/junk naloga po PSEUDONIMU (npr. „korisnik_1781706889263").
// Default: DRY-RUN (prikaže šta bi obrisao, pa rollback). Sa --apply upisuje.
// Zaštita: nikad osnivač (memberHash „osn…") ni admin; nikad verifikovan nalog.
//
//   # test (default .env DATABASE_URL):
//   npx tsx scripts/obrisi-pending.ts korisnik_1781706889263
//   npx tsx scripts/obrisi-pending.ts korisnik_1781706889263 --apply
//   # prod:
//   DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) \
//     npx tsx scripts/obrisi-pending.ts korisnik_1781706889263 --apply
// ─────────────────────────────────────────────────────────────────────────────

const PROTOKOL_WALLET_ID = "banka-singleton";
const APPLY = process.argv.includes("--apply");
const PSEUDONIM = process.argv.find((a) => !a.startsWith("--") && !a.includes("tsx") && !a.endsWith(".ts") && !a.includes("node"));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

class DryRunRollback extends Error {}

async function main() {
  if (!PSEUDONIM) {
    console.error("✗ Nedostaje pseudonim. Primer: npx tsx scripts/obrisi-pending.ts korisnik_1781706889263");
    process.exit(1);
  }

  console.log(`\n=== BRISANJE „${PSEUDONIM}" (${APPLY ? "APPLY — UPISUJE" : "DRY-RUN — rollback"}) ===`);

  const u = await prisma.user.findFirst({
    where: { pseudonim: PSEUDONIM },
    select: { id: true, pseudonim: true, email: true, memberHash: true, admin: true, oauthPending: true, verified: true, tipKorisnika: true },
  });

  if (!u) {
    console.log(`Nalog „${PSEUDONIM}" NE postoji u ovoj bazi (DATABASE_URL). Nema šta da se briše.`);
    return;
  }

  console.log(`Pronađen: id=${u.id} | email=${u.email} | hash=${u.memberHash} | admin=${u.admin} | oauthPending=${u.oauthPending} | verified=${u.verified} | tip=${u.tipKorisnika}`);

  // ── ZAŠTITE ──
  if (u.memberHash?.startsWith("osn") || u.admin !== "NONE") {
    throw new Error(`ODBIJENO: osnivač/admin — ne brišem.`);
  }
  if (u.verified) {
    throw new Error(`ODBIJENO: nalog je verifikovan — ovaj skript je samo za nedovršene/junk naloge.`);
  }

  const preZbir = await prisma.wallet.aggregate({ _sum: { balance: true } });
  console.log(`Zero-sum PRE: ${preZbir._sum.balance}`);

  try {
    await prisma.$transaction(async (tx) => {
      const userId = u.id;
      const wallet = await tx.wallet.findUnique({ where: { userId } });

      // Stanje (ako ga ima) nazad Protokolu — čuva zero-sum.
      if (wallet && wallet.balance !== 0) {
        await tx.wallet.update({ where: { id: PROTOKOL_WALLET_ID }, data: { balance: { increment: wallet.balance } } });
        await tx.transaction.create({
          data: { fromWalletId: wallet.id, toWalletId: PROTOKOL_WALLET_ID, amount: wallet.balance, type: TransactionType.TRANSFER, description: "Brisanje junk naloga — povraćaj Protokolu" },
        });
        console.log(`  ↩ stanje ${wallet.balance} → Protokolu`);
      }

      // Child redovi (FK-bezbedan redosled).
      if (wallet) {
        const konv = await tx.konverzacija.findMany({ where: { OR: [{ user1Id: userId }, { user2Id: userId }] }, select: { id: true } });
        const konvIds = konv.map((k) => k.id);
        if (konvIds.length) await tx.poruka.deleteMany({ where: { konverzacijaId: { in: konvIds } } });
        await tx.poruka.deleteMany({ where: { posiljacId: userId } });
        if (konvIds.length) await tx.konverzacija.deleteMany({ where: { id: { in: konvIds } } });
        await tx.transaction.deleteMany({ where: { OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }] } });
      }
      await tx.verifikacionaVeza.deleteMany({ where: { OR: [{ verifikatorId: userId }, { verifikovaniId: userId }] } });
      await tx.verifikacionaVeza.updateMany({ where: { nadzornikId: userId }, data: { nadzornikId: null } });
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
      console.log(`  ✓ nalog obrisan: ${u.pseudonim}`);

      const zbir = await tx.wallet.aggregate({ _sum: { balance: true } });
      console.log(`Zero-sum POSLE: ${zbir._sum.balance}`);
      if (zbir._sum.balance !== preZbir._sum.balance) {
        throw new Error(`ZERO-SUM NARUŠEN: pre=${preZbir._sum.balance} posle=${zbir._sum.balance} — ROLLBACK.`);
      }
      if (!APPLY) throw new DryRunRollback();
    }, { timeout: 60_000 });
    console.log("\n✓ APPLIED — promene upisane.");
  } catch (e) {
    if (e instanceof DryRunRollback) {
      console.log("\n[DRY-RUN] Rollback — ništa nije upisano. Pokreni sa --apply da se primeni.");
    } else {
      console.error("\n✗ GREŠKA (rollback):", e instanceof Error ? e.message : e);
      process.exit(1);
    }
  }
}

main().finally(() => prisma.$disconnect());
