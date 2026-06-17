import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// READ-ONLY: za svaki identifikator (email | pseudonim | memberHash) ispiše
// kompletan otisak člana kako bismo procenili posledice brisanja. NE menja ništa.
//
// Pokretanje (prod):
//   DATABASE_URL=$(grep -E '^PROD_DATABASE_URL=' .env.prod.db | cut -d= -f2-) \
//     npx tsx scripts/revizija-clana.ts "korisnik_178..." "deimos25@gmail.com"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const identifikatori = process.argv.slice(2);

async function nadji(idf: string) {
  return (
    (await prisma.user.findUnique({ where: { email: idf } })) ??
    (await prisma.user.findUnique({ where: { pseudonim: idf } })) ??
    (await prisma.user.findUnique({ where: { memberHash: idf } })) ??
    (await prisma.user.findFirst({ where: { pseudonim: { startsWith: idf.replace(/\.+$/, "") } } }))
  );
}

async function revizija(idf: string) {
  console.log("\n" + "=".repeat(70));
  console.log("TRAŽIM:", idf);
  const u = await nadji(idf);
  if (!u) { console.log("  ✗ NEMA takvog člana"); return; }

  const wallet = await prisma.wallet.findUnique({ where: { userId: u.id } });
  const zrno = await prisma.zrnoStanje.findUnique({ where: { userId: u.id } });

  const txOut = wallet ? await prisma.transaction.findMany({ where: { fromWalletId: wallet.id } }) : [];
  const txIn = wallet ? await prisma.transaction.findMany({ where: { toWalletId: wallet.id } }) : [];

  const verifikovaoJa = await prisma.verifikacionaVeza.findMany({ where: { verifikatorId: u.id } });
  const verifikovaliMene = await prisma.verifikacionaVeza.findMany({ where: { verifikovaniId: u.id } });
  const nadzirao = await prisma.verifikacionaVeza.findMany({ where: { nadzornikId: u.id } });

  const [listings, oglasi, poruke, konv1, konv2, notif, donacije, osnivac, krugClan] = await Promise.all([
    prisma.marketplaceListing.count({ where: { sellerId: u.id } }),
    prisma.doprinosOglas.count({ where: { kreiraoId: u.id } }).catch(() => -1),
    prisma.poruka.count({ where: { posaljilacId: u.id } }).catch(() => -1),
    prisma.konverzacija.count({ where: { user1Id: u.id } }).catch(() => -1),
    prisma.konverzacija.count({ where: { user2Id: u.id } }).catch(() => -1),
    prisma.notifikacija.count({ where: { userId: u.id } }).catch(() => -1),
    prisma.donationRecord.count({ where: { userId: u.id } }).catch(() => -1),
    prisma.osnivac.findFirst({ where: { userId: u.id } }).catch(() => null),
    prisma.krugClanstvo.count({ where: { userId: u.id } }).catch(() => -1),
  ]);

  console.log("  ✓ NAĐEN");
  console.log("    id:           ", u.id);
  console.log("    pseudonim:    ", u.pseudonim);
  console.log("    email:        ", u.email);
  console.log("    memberHash:   ", u.memberHash);
  console.log("    tip / admin:  ", u.tipKorisnika, "/", u.admin);
  console.log("    verified/idx: ", u.verified, "/", u.indeksStvarnosti, "%");
  console.log("    status:       ", u.status, "deaktiviranAt:", u.deaktiviranAt);
  console.log("    createdAt:    ", u.createdAt);
  console.log("    WALLET balance:", wallet ? wallet.balance : "(nema wallet)");
  console.log("    ZRNO:          ", zrno ? `aktivno=${zrno.aktivno} slobodno=${zrno.slobodno}` : "(nema)");
  console.log("    --- TRANSAKCIJE ---");
  console.log("      izlazne (from):", txOut.length, txOut.map(t => `${t.type}:${t.amount}`).join(", "));
  console.log("      ulazne  (to):  ", txIn.length, txIn.map(t => `${t.type}:${t.amount}`).join(", "));
  console.log("    --- VERIFIKACIJE ---");
  console.log("      JA verifikovao (kaskada!):", verifikovaoJa.length, "→", verifikovaoJa.map(v => v.verifikovaniId).join(", "));
  console.log("      mene verifikovali:        ", verifikovaliMene.length);
  console.log("      bio nadzornik:            ", nadzirao.length);
  console.log("    --- OSTALO ---");
  console.log("      osnivač:", osnivac ? "DA (" + osnivac.id + ")" : "ne",
              "| listings:", listings, "| doprinos-oglasi:", oglasi,
              "| poruke:", poruke, "| konverzacije:", konv1 + konv2,
              "| notif:", notif, "| donacije:", donacije, "| krug-članstva:", krugClan);

  if (verifikovaoJa.length > 0) console.log("    ⚠ IMA KASKADU: brisanje povlači gubitak indeksa/POEN-a kod verifikovanih.");
}

async function main() {
  if (identifikatori.length === 0) { console.log("Daj bar jedan identifikator (email/pseudonim/memberHash)."); return; }
  for (const idf of identifikatori) await revizija(idf);
  console.log("\n" + "=".repeat(70));
  console.log("READ-ONLY revizija gotova. Ništa nije promenjeno.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
