import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Dijagnostika parova „emisija po potvrdi → usklađivanje" — ČITA I NE MENJA NIŠTA.
 *
 * 🔴 Bez ijednog `create`, `update`, `delete` i bez `$executeRaw`. Sme i nad
 * produkcionom bazom; posle nje je baza bajt po bajt ista.
 *
 * ŠTA MERI
 * Do seta 4.6.4 se POEN po potvrdi upisivao odmah. Usklađivanje (čl. 22a) ga je
 * povuklo nazad i vratilo potvrdu u `ZABELEZEN`, pa kad uslov nastupi sledi NOVA
 * emisija. Za isti POEN tako stoje tri reda: emisija, povlačenje, pa ponovo emisija.
 * Skripta pronalazi prva dva — par koji opisuje POEN koji je celo vreme bio na
 * čekanju — i računa šta bi se desilo da se par ukloni.
 *
 * 🔴 UPARIVANJE JE HEURISTIKA, JER JE VEZA OBRISANA. `uskladiZatecenePotvrde` je
 * pri povlačenju upisala `verifikatorTxId: null`, `verifikovaniTxId: null` i
 * `nadzorTxId: null`, pa potvrda više ne pokazuje na transakciju kojom je POEN
 * upisan. Par se zato traži po novčaniku + iznosu + redosledu: najstarija
 * neuparena emisija istog iznosa PRE povlačenja. Emisija koja je nastala POSLE
 * povlačenja je ponovni upis i namerno se ne dira.
 *
 * Pokretanje:  npx tsx scripts/dijagnostika-transakcije.ts
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PROTOKOL = "banka-singleton";

/** 1.000 verifikatoru, 1.000 potvrđenom (EMISIJA_VERIFIKACIJA); 500 nadzorniku (EMISIJA_NADZOR). */
const TIP_EMISIJE = ["EMISIJA_VERIFIKACIJA", "EMISIJA_NADZOR"] as const;

type Zapis = { id: string; amount: number; createdAt: Date; type: string };

type Par = {
  emisijaId: string;
  uskladjivanjeId: string;
  iznos: number;
  emisijaAt: Date;
  uskladjivanjeAt: Date;
};

function red(oznaka: string, vrednost: string | number) {
  console.log(`  ${oznaka.padEnd(48)} ${String(vrednost).padStart(9)}`);
}

function brojSr(n: number) {
  return n.toLocaleString("sr-RS");
}

async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║  PAROVI EMISIJA PO POTVRDI → USKLAĐIVANJE                      ║");
  console.log("║  samo čitanje — baza se ne menja                               ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");

  // ── 1. Osnovno ─────────────────────────────────────────────────────────────
  const [ukupnoTx, zbirBalansa, protokolW] = await Promise.all([
    prisma.transaction.count(),
    prisma.wallet.aggregate({ _sum: { balance: true } }),
    prisma.wallet.findUnique({ where: { id: PROTOKOL }, select: { balance: true } }),
  ]);
  const zeroSum = zbirBalansa._sum.balance ?? 0;

  console.log("\n── 1. Osnovno ────────────────────────────────────────────────────");
  red("Ukupno zapisa u Transaction", brojSr(ukupnoTx));
  red("Opticaj (|stanje Protokola|)", brojSr(Math.abs(protokolW?.balance ?? 0)));
  red("Zero-sum (zbir svih stanja, treba 0)", zeroSum);
  if (zeroSum !== 0) {
    console.log("  🔴 ZERO-SUM NIJE NULA — to je teži problem od ovoga.");
    console.log("     Javi pre nego što se bilo šta briše.");
  }

  // ── 2. Povlačenja ──────────────────────────────────────────────────────────
  const povlacenja = await prisma.transaction.findMany({
    where: { type: "USKLADJIVANJE_POTVRDE" },
    select: { id: true, amount: true, createdAt: true, type: true, fromWalletId: true },
    orderBy: { createdAt: "asc" },
  });

  console.log("\n── 2. Povlačenja (USKLADJIVANJE_POTVRDE) ─────────────────────────");
  if (povlacenja.length === 0) {
    console.log("\n  Nijedno povlačenje nije zapisano — usklađivanje nije sprovedeno");
    console.log("  nad ovom bazom. Nema parova za uklanjanje. Kraj.\n");
    return;
  }
  const poIznosu = new Map<number, number>();
  for (const p of povlacenja) poIznosu.set(p.amount, (poIznosu.get(p.amount) ?? 0) + 1);
  red("Ukupno povlačenja", povlacenja.length);
  for (const [iznos, broj] of [...poIznosu].sort((a, b) => b[0] - a[0])) {
    red(`  od toga po ${brojSr(iznos)} POEN`, broj);
  }
  red("Ukupno povučeno POENA", brojSr(povlacenja.reduce((s, p) => s + p.amount, 0)));
  const prvo = povlacenja[0].createdAt;
  const poslednje = povlacenja[povlacenja.length - 1].createdAt;
  console.log(`  Sprovedeno: ${prvo.toISOString().slice(0, 16)} … ${poslednje.toISOString().slice(0, 16)}`);

  // ── 3. Uparivanje po novčaniku ─────────────────────────────────────────────
  const pogodjeniWalletIds = [...new Set(povlacenja.map((p) => p.fromWalletId!).filter(Boolean))];

  const emisije = await prisma.transaction.findMany({
    where: { type: { in: [...TIP_EMISIJE] }, toWalletId: { in: pogodjeniWalletIds } },
    select: { id: true, amount: true, createdAt: true, type: true, toWalletId: true },
    orderBy: { createdAt: "asc" },
  });

  const emisijePoWalletu = new Map<string, Zapis[]>();
  for (const e of emisije) {
    const lista = emisijePoWalletu.get(e.toWalletId) ?? [];
    lista.push({ id: e.id, amount: e.amount, createdAt: e.createdAt, type: e.type });
    emisijePoWalletu.set(e.toWalletId, lista);
  }

  const paroviPoWalletu = new Map<string, Par[]>();
  const neupareni: Array<{ walletId: string; iznos: number; kada: Date }> = [];
  const iskorisceneEmisije = new Set<string>();

  for (const p of povlacenja) {
    const wid = p.fromWalletId!;
    const kandidati = emisijePoWalletu.get(wid) ?? [];
    // Najstarija neuparena emisija ISTOG iznosa nastala PRE povlačenja.
    // Emisija posle povlačenja je ponovni upis i ne sme da se dira.
    const par = kandidati.find(
      (e) => !iskorisceneEmisije.has(e.id) && e.amount === p.amount && e.createdAt < p.createdAt
    );
    if (!par) {
      neupareni.push({ walletId: wid, iznos: p.amount, kada: p.createdAt });
      continue;
    }
    iskorisceneEmisije.add(par.id);
    const lista = paroviPoWalletu.get(wid) ?? [];
    lista.push({
      emisijaId: par.id,
      uskladjivanjeId: p.id,
      iznos: p.amount,
      emisijaAt: par.createdAt,
      uskladjivanjeAt: p.createdAt,
    });
    paroviPoWalletu.set(wid, lista);
  }

  const ukupnoParova = [...paroviPoWalletu.values()].reduce((s, l) => s + l.length, 0);

  console.log("\n── 3. Uparivanje ─────────────────────────────────────────────────");
  red("Povlačenja uparenih sa svojom emisijom", ukupnoParova);
  red("Povlačenja BEZ para", neupareni.length);
  red("Redova koji bi nestali (par = 2 reda)", ukupnoParova * 2);
  if (neupareni.length > 0) {
    console.log("\n  🔴 Ova povlačenja nemaju emisiju istog iznosa pre sebe:");
    for (const n of neupareni.slice(0, 20)) {
      console.log(`     ${n.kada.toISOString().slice(0, 19)}  ${brojSr(n.iznos)} POEN  wallet ${n.walletId.slice(0, 8)}…`);
    }
    console.log("     Njih NE treba brisati — povlačenje bez emisije znači da je");
    console.log("     istorija drugačija nego što pretpostavljamo. Javi pre poteza.");
  }

  // ── 4. Po čoveku ───────────────────────────────────────────────────────────
  const walleti = await prisma.wallet.findMany({
    where: { id: { in: pogodjeniWalletIds } },
    select: { id: true, balance: true, user: { select: { id: true, pseudonim: true } } },
  });

  type Stavka = {
    pseudonim: string;
    walletId: string;
    parova: number;
    povuceno: number;
    stanje: number;
  };
  const stavke: Stavka[] = walleti.map((w) => {
    const parovi = paroviPoWalletu.get(w.id) ?? [];
    return {
      pseudonim: w.user?.pseudonim ?? "(bez korisnika)",
      walletId: w.id,
      parova: parovi.length,
      povuceno: parovi.reduce((s, p) => s + p.iznos, 0),
      stanje: w.balance,
    };
  });
  stavke.sort((a, b) => a.stanje - b.stanje);

  const uMinusu = stavke.filter((s) => s.stanje < 0);

  console.log("\n── 4. Pogođeni ljudi ─────────────────────────────────────────────");
  red("Ukupno ljudi", stavke.length);
  red("  od toga u minusu", uMinusu.length);
  red("Zbir minusa (kao pozitivan broj)", brojSr(uMinusu.reduce((s, x) => s - x.stanje, 0)));
  console.log("");
  console.log(`  ${"PSEUDONIM".padEnd(20)} ${"PAROVA".padStart(7)} ${"POVUČENO".padStart(11)} ${"STANJE".padStart(12)}`);
  for (const s of stavke) {
    const oznaka = s.stanje < 0 ? "🔴" : "  ";
    console.log(
      `  ${oznaka}${s.pseudonim.padEnd(18)} ${String(s.parova).padStart(7)} ` +
        `${brojSr(s.povuceno).padStart(11)} ${brojSr(s.stanje).padStart(12)}`
    );
  }
  if (uMinusu.length > 0) {
    console.log("\n  🔴 = zapis je u minusu. Po odluci vlasnika ovi se rešavaju lično");
    console.log("     (postavljanjem sopstvenog oglasa), ali posle brisanja para u");
    console.log("     njihovoj istoriji NEĆE ostati red koji taj minus objašnjava.");
  }

  // ── 5. Provera: da li se stanje slaže sa istorijom ─────────────────────────
  // 🔴 Ovo nigde u sistemu ne postoji — `checkZeroSum` proverava samo da je ZBIR
  // svih stanja nula, a ne da se pojedinačno stanje slaže sa svojim zapisima.
  // Pre brisanja vredi znati da li polazno stanje uopšte stoji.
  console.log("\n── 5. Slaže li se stanje sa istorijom (pre bilo kakve izmene) ────");
  // Dva groupBy upita ukupno, ne dva po čoveku — spisak ume da bude dugačak.
  const [ulazi, izlazi] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["toWalletId"],
      where: { toWalletId: { in: pogodjeniWalletIds } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["fromWalletId"],
      where: { fromWalletId: { in: pogodjeniWalletIds } },
      _sum: { amount: true },
    }),
  ]);
  const ulazPoWalletu = new Map(ulazi.map((u) => [u.toWalletId, u._sum.amount ?? 0]));
  const izlazPoWalletu = new Map(izlazi.map((i) => [i.fromWalletId, i._sum.amount ?? 0]));

  let neslaganja = 0;
  for (const w of walleti) {
    const izIstorije = (ulazPoWalletu.get(w.id) ?? 0) - (izlazPoWalletu.get(w.id) ?? 0);
    if (izIstorije !== w.balance) {
      neslaganja++;
      console.log(
        `  🔴 ${(w.user?.pseudonim ?? w.id).padEnd(20)} stanje ${brojSr(w.balance).padStart(10)} ` +
          `≠ istorija ${brojSr(izIstorije).padStart(10)}`
      );
    }
  }
  if (neslaganja === 0) {
    console.log("  ✅ Kod svih pogođenih naloga stanje se slaže sa zbirom zapisa.");
    console.log("     Znači: brisanje uparenog para (+X i −X) ostavlja stanje tačnim,");
    console.log("     jer se par i u ovom zbiru poništava.");
  } else {
    console.log(`\n  🔴 ${neslaganja} nalog(a) se NE slaže. Ovo je zaseban kvar i treba ga`);
    console.log("     razumeti PRE brisanja, inače se meša sa posledicama brisanja.");
  }

  // ── 6. Stanje potvrda ──────────────────────────────────────────────────────
  const [zabelezene, evidentirane, nadzorZabelezen] = await Promise.all([
    prisma.verifikacionaVeza.count({ where: { poenStatus: "ZABELEZEN" } }),
    prisma.verifikacionaVeza.count({ where: { poenStatus: "EVIDENTIRAN" } }),
    prisma.verifikacionaVeza.count({ where: { nadzorPoenStatus: "ZABELEZEN", nadzoranAt: { not: null } } }),
  ]);
  console.log("\n── 6. Stanje potvrda ─────────────────────────────────────────────");
  red("Potvrda sa POEN-om na čekanju (ZABELEZEN)", zabelezene);
  red("Potvrda sa upisanim POEN-om (EVIDENTIRAN)", evidentirane);
  red("Nadzora sa 500 na čekanju", nadzorZabelezen);

  // ── 7. Zaključak ───────────────────────────────────────────────────────────
  console.log("\n── 7. Ukratko ────────────────────────────────────────────────────");
  console.log(`  Uparenih parova:            ${ukupnoParova}`);
  console.log(`  Redova koji bi nestali:     ${ukupnoParova * 2} od ${brojSr(ukupnoTx)}`);
  console.log(`  Pogođenih ljudi:            ${stavke.length}, od toga ${uMinusu.length} u minusu`);
  console.log(`  Neuparenih povlačenja:      ${neupareni.length}${neupareni.length ? "  ← pogledati pre brisanja" : ""}`);
  console.log(`  Stanje ≠ istorija:          ${neslaganja}${neslaganja ? "  ← pogledati pre brisanja" : ""}`);
  console.log("\n  Brisanje NE menja nijedno stanje niti opticaj: par je +X i −X,");
  console.log("  pa se u svakom zbiru poništava. Menja se samo šta istorija pokazuje.");
  console.log("\n  Baza NIJE promenjena ovom skriptom.\n");
}

main()
  .catch((e) => {
    console.error("\n🔴 Dijagnostika pukla:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
