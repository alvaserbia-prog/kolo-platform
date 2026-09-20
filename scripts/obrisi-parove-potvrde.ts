import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Uklanjanje parova „emisija po potvrdi → usklađivanje" iz istorije.
 *
 * Do seta 4.6.4 se POEN po potvrdi upisivao odmah; usklađivanje (čl. 22a) ga je
 * povuklo i vratilo potvrdu u `ZABELEZEN`, pa po nastupanju uslova sledi NOVA
 * emisija. Za isti POEN tako stoje tri reda. Prva dva opisuju POEN koji je celo
 * vreme bio na čekanju — ova skripta ih uklanja. Odluka vlasnika, 19.09.2026.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 🔴 ZAŠTO BRISANJE OVDE NE POMERA NIJEDAN BROJ
 * `Wallet.balance` je ZASEBAN UPISAN broj, a ne zbir transakcija: `emitujPoen`
 * radi `increment`/`decrement` nad `Wallet` i upisuje zapis, paralelno. Nigde u
 * `src/` nema koda koji balans računa iz zapisa. Zato brisanje reda ne menja
 * nijedno stanje, ni opticaj, ni zero-sum (`checkZeroSum` sabira stanja).
 *
 * 🔴 ALI: par mora da ode CEO, obe polovine, u istoj transakciji. Obrisana samo
 * jedna polovina pomera zbir zapisa a stanje ostavlja isto — i taj nesklad
 * NIJEDNA zatečena provera ne vidi. Zato skripta posle brisanja, JOŠ UNUTAR
 * transakcije, proverava da se svako pogođeno stanje i dalje slaže sa zbirom
 * svojih zapisa; ako se ne slaže, sve se poništava.
 *
 * 🔴 Uparivanje je heuristika, jer je veza ka originalu obrisana pri povlačenju
 * (`verifikatorTxId`/`verifikovaniTxId`/`nadzorTxId` = null). Par se traži po
 * novčaniku + iznosu + redosledu; emisija nastala POSLE povlačenja je ponovni
 * upis i ne dira se. Ako ijedno povlačenje ostane bez para — skripta STAJE.
 *
 * 🟡 Identifikatori se ne pomeraju: `Transaction.id` je uuid, ne redni broj.
 * U celoj šemi `autoincrement()` postoji samo na `User.donatorskiBroj`.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Pokretanje:
 *   npx tsx scripts/obrisi-parove-potvrde.ts
 *       → PROBNI HOD. Ništa se ne menja, samo se ispiše šta bi se obrisalo.
 *
 *   npx tsx scripts/obrisi-parove-potvrde.ts --sprovedi --admin=<pseudonim>
 *       → sprovodi brisanje. `--admin` je obavezan: revizijski trag mora da
 *         imenuje čoveka koji je potez povukao.
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PROTOKOL = "banka-singleton";
const TIP_EMISIJE = ["EMISIJA_VERIFIKACIJA", "EMISIJA_NADZOR"] as const;

type Par = { emisijaId: string; povlacenjeId: string; iznos: number; walletId: string };

function brojSr(n: number) {
  return n.toLocaleString("sr-RS");
}

/**
 * Klijent koji prima i `prisma` i `tx` iz `$transaction` — provera mora da se
 * pokrene i pre uklanjanja (nad bazom) i posle njega (unutar transakcije, da
 * poništenje bude moguće).
 */
type Klijent = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/** Zbir zapisa novčanika: šta je ušlo minus šta je izašlo. */
async function istorijaPoWalletu(klijent: Klijent, walletIds: string[]): Promise<Map<string, number>> {
  const [ulazi, izlazi] = await Promise.all([
    klijent.transaction.groupBy({
      by: ["toWalletId"],
      where: { toWalletId: { in: walletIds } },
      _sum: { amount: true },
    }),
    klijent.transaction.groupBy({
      by: ["fromWalletId"],
      where: { fromWalletId: { in: walletIds } },
      _sum: { amount: true },
    }),
  ]);
  const ulaz = new Map(ulazi.map((u) => [u.toWalletId, u._sum.amount ?? 0]));
  const izlaz = new Map(izlazi.map((i) => [i.fromWalletId ?? "", i._sum.amount ?? 0]));
  return new Map(walletIds.map((id) => [id, (ulaz.get(id) ?? 0) - (izlaz.get(id) ?? 0)]));
}

async function main() {
  const argv = process.argv.slice(2);
  const sprovedi = argv.includes("--sprovedi");
  const adminArg = argv.find((a) => a.startsWith("--admin="))?.split("=")[1];

  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log(
    sprovedi
      ? "║  BRISANJE PAROVA — SPROVOĐENJE                                 ║"
      : "║  BRISANJE PAROVA — PROBNI HOD (ništa se ne menja)              ║",
  );
  console.log("╚════════════════════════════════════════════════════════════════╝");

  // ── Brane pre bilo čega ────────────────────────────────────────────────────
  const prepreke: string[] = [];

  const zbir = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const zeroSum = zbir._sum.balance ?? 0;
  if (zeroSum !== 0) prepreke.push(`Zero-sum nije nula (${zeroSum}).`);

  const povlacenja = await prisma.transaction.findMany({
    where: { type: "USKLADJIVANJE_POTVRDE" },
    select: { id: true, amount: true, createdAt: true, fromWalletId: true },
    orderBy: { createdAt: "asc" },
  });
  if (povlacenja.length === 0) {
    console.log("\n  Nema nijednog povlačenja — nema šta da se briše. Kraj.\n");
    return;
  }

  const walletIds = [...new Set(povlacenja.map((p) => p.fromWalletId).filter((x): x is string => !!x))];

  const emisije = await prisma.transaction.findMany({
    where: { type: { in: [...TIP_EMISIJE] }, toWalletId: { in: walletIds } },
    select: { id: true, amount: true, createdAt: true, toWalletId: true },
    orderBy: { createdAt: "asc" },
  });
  const emisijePoWalletu = new Map<string, typeof emisije>();
  for (const e of emisije) {
    const l = emisijePoWalletu.get(e.toWalletId) ?? [];
    l.push(e);
    emisijePoWalletu.set(e.toWalletId, l);
  }

  // ── Uparivanje ─────────────────────────────────────────────────────────────
  const parovi: Par[] = [];
  const neupareni: typeof povlacenja = [];
  const zauzete = new Set<string>();

  for (const p of povlacenja) {
    if (!p.fromWalletId) {
      neupareni.push(p);
      continue;
    }
    const par = (emisijePoWalletu.get(p.fromWalletId) ?? []).find(
      (e) => !zauzete.has(e.id) && e.amount === p.amount && e.createdAt < p.createdAt,
    );
    if (!par) {
      neupareni.push(p);
      continue;
    }
    zauzete.add(par.id);
    parovi.push({ emisijaId: par.id, povlacenjeId: p.id, iznos: p.amount, walletId: p.fromWalletId });
  }

  if (neupareni.length > 0) {
    prepreke.push(
      `${neupareni.length} povlačenje(a) nema svoju emisiju pre sebe — istorija nije kakvom je pretpostavljamo.`,
    );
  }

  // ── Slaže li se stanje sa istorijom PRE brisanja ───────────────────────────
  const walleti = await prisma.wallet.findMany({
    where: { id: { in: walletIds } },
    select: { id: true, balance: true, user: { select: { pseudonim: true } } },
  });
  const istorijaPre = await istorijaPoWalletu(prisma, walletIds);
  const neslozeni = walleti.filter((w) => (istorijaPre.get(w.id) ?? 0) !== w.balance);
  if (neslozeni.length > 0) {
    prepreke.push(
      `${neslozeni.length} nalog(a) već sada ima stanje različito od zbira svojih zapisa — razumeti to PRE brisanja.`,
    );
  }

  // ── Izveštaj ───────────────────────────────────────────────────────────────
  const uMinusu = walleti.filter((w) => w.balance < 0);
  console.log("\n── Šta je nađeno ─────────────────────────────────────────────────");
  console.log(`  Povlačenja:                 ${povlacenja.length}`);
  console.log(`  Uparenih parova:            ${parovi.length}`);
  console.log(`  Neuparenih:                 ${neupareni.length}`);
  console.log(`  Redova za brisanje:         ${parovi.length * 2}`);
  console.log(`  Pogođenih naloga:           ${walleti.length} (u minusu: ${uMinusu.length})`);
  console.log(`  POENA u parovima:           ${brojSr(parovi.reduce((s, p) => s + p.iznos, 0))}`);

  if (prepreke.length > 0) {
    console.log("\n🔴 STAJE — brane nisu prošle:");
    for (const p of prepreke) console.log(`   • ${p}`);
    for (const n of neupareni.slice(0, 10)) {
      console.log(`     neuparen: ${n.createdAt.toISOString().slice(0, 19)}  ${brojSr(n.amount)} POEN`);
    }
    for (const w of neslozeni.slice(0, 10)) {
      console.log(
        `     nesložen: ${w.user?.pseudonim ?? w.id}  stanje ${brojSr(w.balance)} ` +
          `≠ istorija ${brojSr(istorijaPre.get(w.id) ?? 0)}`,
      );
    }
    console.log("\n   Ništa nije promenjeno.\n");
    process.exitCode = 1;
    return;
  }

  console.log("\n  ✅ Sve brane prošle: zero-sum je 0, svako povlačenje ima svoj par,");
  console.log("     i svako pogođeno stanje se slaže sa zbirom svojih zapisa.");

  if (!sprovedi) {
    console.log("\n── Probni hod — ništa nije promenjeno ────────────────────────────");
    console.log("  Za sprovođenje:");
    console.log("    npx tsx scripts/obrisi-parove-potvrde.ts --sprovedi --admin=<pseudonim>\n");
    return;
  }

  // ── Sprovođenje ────────────────────────────────────────────────────────────
  if (!adminArg) {
    console.log("\n🔴 Nedostaje --admin=<pseudonim>. Revizijski trag mora da imenuje čoveka.");
    console.log("   Ništa nije promenjeno.\n");
    process.exitCode = 1;
    return;
  }
  const admin = await prisma.user.findFirst({
    where: { pseudonimLower: adminArg.toLowerCase() },
    select: { id: true, pseudonim: true, admin: true },
  });
  if (!admin) {
    console.log(`\n🔴 Nalog „${adminArg}" ne postoji. Ništa nije promenjeno.\n`);
    process.exitCode = 1;
    return;
  }
  if (admin.admin !== "SUPERADMIN") {
    console.log(`\n🔴 „${admin.pseudonim}" nije superadmin. Ništa nije promenjeno.\n`);
    process.exitCode = 1;
    return;
  }

  const zaBrisanje = parovi.flatMap((p) => [p.emisijaId, p.povlacenjeId]);

  await prisma.$transaction(
    async (tx) => {
      const uklonjeno = await tx.transaction.deleteMany({ where: { id: { in: zaBrisanje } } });
      if (uklonjeno.count !== zaBrisanje.length) {
        throw new Error(`Uklonjeno ${uklonjeno.count}, očekivano ${zaBrisanje.length} — poništavam.`);
      }

      // 🔴 Provera POSLE uklanjanja, još unutar transakcije. Ako se ijedno stanje
      // razišlo sa svojom istorijom, cela transakcija se poništava.
      const posle = await istorijaPoWalletu(tx, walletIds);
      for (const w of walleti) {
        if ((posle.get(w.id) ?? 0) !== w.balance) {
          throw new Error(
            `Nalog ${w.user?.pseudonim ?? w.id}: stanje ${w.balance} ≠ istorija ${posle.get(w.id) ?? 0} — poništavam.`,
          );
        }
      }
      const z = await tx.wallet.aggregate({ _sum: { balance: true } });
      if ((z._sum.balance ?? 0) !== 0) throw new Error("Zero-sum narušen — poništavam.");

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          akcija: "POTVRDE_PAROVI_UKLONJENI",
          detalji:
            `Uklonjeno ${zaBrisanje.length} zapisa (${parovi.length} parova emisija+usklađivanje) ` +
            `nad ${walleti.length} naloga. Stanja i zero-sum nepromenjeni — par je +X i −X.`,
        },
      });
    },
    { timeout: 120_000 },
  );

  const posleZbir = await prisma.wallet.aggregate({ _sum: { balance: true } });
  const protokol = await prisma.wallet.findUnique({ where: { id: PROTOKOL }, select: { balance: true } });

  console.log("\n── Sprovedeno ────────────────────────────────────────────────────");
  console.log(`  Uklonjeno zapisa:           ${zaBrisanje.length}`);
  console.log(`  Zero-sum posle:             ${posleZbir._sum.balance ?? 0}  (treba 0)`);
  console.log(`  Opticaj posle:              ${brojSr(Math.abs(protokol?.balance ?? 0))}  (nepromenjen)`);
  console.log(`  Revizijski trag:            POTVRDE_PAROVI_UKLONJENI (${admin.pseudonim})\n`);
}

main()
  .catch((e) => {
    console.error("\n🔴 Stalo, ništa nije promenjeno:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
