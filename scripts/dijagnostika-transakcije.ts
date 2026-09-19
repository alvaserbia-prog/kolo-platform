import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Dijagnostika liste transakcija — ČITA I NE MENJA NIŠTA.
 *
 * 🔴 Skripta je namerno bez ijednog `create`, `update` i `delete`, i bez
 * `$executeRaw`. Sme da se pokrene i nad produkcionom bazom; posle nje je baza
 * bajt po bajt ista.
 *
 * Odgovara na jedno pitanje: koliko redova u listi opisuje JEDAN isti događaj
 * (prepis pa poništenje, emisija pa otpis), a koliko ih je zaista dupliranih —
 * istih zapisa upisanih dvaput. To su dve različite stvari i traže suprotan
 * postupak: prvo se spaja na ekranu, drugo je greška i ispravlja se
 * protivzapisom (Pravilnik čl. 34), nikad brisanjem reda.
 *
 * Pokretanje:  npx tsx scripts/dijagnostika-transakcije.ts
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/** Tipovi koji su protivzapis — poništavaju ili ispravljaju raniji zapis. */
const PROTIVZAPISI: readonly string[] = [
  "PONISTENJE_PREPISA",
  "OTPIS_PRIJATELJSTVO",
  "OTPIS_PREVOD_U_MALOLETNI",
  "OTPIS_NABAVKA",
  "USKLADJIVANJE_POTVRDE",
  "ISPRAVKA_NABAVKA",
];

function red(oznaka: string, vrednost: string | number) {
  console.log(`  ${oznaka.padEnd(46)} ${String(vrednost).padStart(9)}`);
}

async function main() {
  console.log("\n╔═══════════════════════════════════════════════════════════════╗");
  console.log("║  DIJAGNOSTIKA LISTE TRANSAKCIJA — samo čitanje, bez izmena    ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");

  // ── 1. Osnovno ─────────────────────────────────────────────────────────────
  const [ukupno, zbirBalansa, prviZapis] = await Promise.all([
    prisma.transaction.count(),
    prisma.wallet.aggregate({ _sum: { balance: true } }),
    prisma.transaction.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
  ]);
  const zeroSum = zbirBalansa._sum.balance ?? 0;

  console.log("\n── 1. Osnovno ───────────────────────────────────────────────────");
  red("Ukupno zapisa u Transaction", ukupno);
  red("Zero-sum (zbir svih balansa, treba 0)", zeroSum);
  if (zeroSum !== 0) {
    console.log("  🔴 ZERO-SUM NIJE NULA. To je zaseban i teži problem od liste —");
    console.log("     javi pre nego što se bilo šta drugo dira.");
  }
  red("Najstariji zapis", prviZapis ? prviZapis.createdAt.toISOString().slice(0, 10) : "—");

  // ── 2. Raspored po tipu ────────────────────────────────────────────────────
  const poTipu = await prisma.transaction.groupBy({
    by: ["type"],
    _count: { _all: true },
    _sum: { amount: true },
  });
  poTipu.sort((a, b) => b._count._all - a._count._all);

  console.log("\n── 2. Koliko ima kog tipa ───────────────────────────────────────");
  console.log(`    ${"TIP".padEnd(28)} ${"ZAPISA".padStart(8)} ${"POEN".padStart(15)}`);
  for (const t of poTipu) {
    const oznaka = PROTIVZAPISI.includes(t.type) ? "↩" : " ";
    console.log(
      `  ${oznaka} ${t.type.padEnd(28)} ${String(t._count._all).padStart(8)} ` +
        `${(t._sum.amount ?? 0).toLocaleString("sr-RS").padStart(15)}`
    );
  }
  console.log("  (↩ = protivzapis: poništava ili ispravlja raniji zapis)");

  // ── 3. Kartica „Ukupno razmena" — bruto naspram neto ───────────────────────
  // Kartica broji TRANSFER redove. Poništen prepis se NE odbija, pa broj tvrdi
  // da je razmene bilo i tamo gde ju je Fondacija poništila.
  // `PrijavaRazmene.transakcijaId` je @unique i pokazuje na ORIGINAL (TRANSFER),
  // pa je broj poništenih ujedno broj prepisa koje treba odbiti.
  const [bruto, ponistenePrijave, odbaceneP, otvoreneP] = await Promise.all([
    prisma.transaction.count({ where: { type: "TRANSFER" } }),
    prisma.prijavaRazmene.count({ where: { status: "PONISTENA" } }),
    prisma.prijavaRazmene.count({ where: { status: "ODBACENA" } }),
    prisma.prijavaRazmene.count({ where: { status: "OTVORENA" } }),
  ]);

  console.log("\n── 3. Kartica „Ukupno razmena" ──────────────────────────────────");
  red("Broj koji kartica DANAS pokazuje (bruto)", bruto);
  red("  od toga poništeno po prijavi razmene", ponistenePrijave);
  red("Stvaran broj razmena koje su opstale", bruto - ponistenePrijave);
  console.log("");
  red("Prijava razmene — otvorenih (u obradi)", otvoreneP);
  red("Prijava razmene — odbačenih (prepis ostaje)", odbaceneP);
  console.log(
    ponistenePrijave === 0
      ? "  → Nijedan prepis nije poništen: kartica već pokazuje tačan broj."
      : `  → Kartica je naduvana za ${ponistenePrijave}. Spajanje prikaza je ispravlja.`
  );

  // ── 4. Protivzapisi — koliko redova opisuje već prikazan događaj ───────────
  const brojPoTipu = new Map(poTipu.map((t) => [t.type as string, t._count._all]));
  const ponistenjeTx = brojPoTipu.get("PONISTENJE_PREPISA") ?? 0;
  const protivUkupno = PROTIVZAPISI.reduce((s, tip) => s + (brojPoTipu.get(tip) ?? 0), 0);

  console.log("\n── 4. Protivzapisi u listi ──────────────────────────────────────");
  red("Ukupno protivzapisa", protivUkupno);
  red("  PONISTENJE_PREPISA (original je upariv)", ponistenjeTx);
  red("  ostali (bez zapisane veze ka originalu)", protivUkupno - ponistenjeTx);
  console.log(
    `\n  → ${ponistenjeTx} reda se može skloniti iz liste tačno: njihov original je\n` +
      `    prepoznatljiv preko PrijavaRazmene, pa se prikazuje jedan red sa\n` +
      `    precrtanim iznosom umesto dva reda u dve različite liste.\n` +
      `  → ${protivUkupno - ponistenjeTx} nema zapisanu vezu ka originalu (otpis prijateljstva,\n` +
      `    prevod u maloletni, usklađivanje potvrda). Oni bi ostali zasebni\n` +
      `    redovi ili bi se grupisali po danu — bez izmene šeme ne mogu tačnije.`
  );

  // ── 5. Kandidati za STVARNE duplikate ──────────────────────────────────────
  // Isti pošiljalac, isti primalac, isti iznos, isti tip, upisani u razmaku
  // manjem od 60 sekundi. To je obrazac dvostrukog upisa (dupli klik, ponovljen
  // poziv rute), a ne obrazac redovnog ponavljanja (dnevne emisije programa
  // istom čoveku u istom iznosu su normalne, ali su danima razmaknute).
  const duplikati = await prisma.$queryRaw<
    Array<{ id: string; tip: string; amount: number; createdAt: Date; razmakSek: number; opis: string | null }>
  >`
    WITH poredjani AS (
      SELECT "id",
             "type"::text AS "tip",
             "amount",
             "createdAt",
             "description",
             LAG("createdAt") OVER (
               PARTITION BY "fromWalletId", "toWalletId", "amount", "type"
               ORDER BY "createdAt"
             ) AS "prethodni"
      FROM "Transaction"
    )
    SELECT "id",
           "tip",
           "amount",
           "createdAt",
           EXTRACT(EPOCH FROM ("createdAt" - "prethodni"))::int AS "razmakSek",
           "description" AS "opis"
    FROM "poredjani"
    WHERE "prethodni" IS NOT NULL
      AND "createdAt" - "prethodni" < interval '60 seconds'
    ORDER BY "createdAt" DESC
    LIMIT 50
  `;

  console.log("\n── 5. Kandidati za STVARAN duplikat ─────────────────────────────");
  console.log("  (isti par novčanika + isti iznos + isti tip, u razmaku < 60 s)\n");
  if (duplikati.length === 0) {
    console.log("  ✅ Nijedan. Nema traga dvostrukog upisa.");
    console.log("     Znači: ono što se u listi vidi kao ponavljanje NISU duplikati,");
    console.log("     nego parovi original + protivzapis — a oni se spajaju na ekranu.");
  } else {
    console.log(`  ⚠ Nađeno: ${duplikati.length}${duplikati.length === 50 ? "+ (prikazano prvih 50)" : ""}\n`);
    for (const d of duplikati) {
      console.log(
        `  ${d.createdAt.toISOString().slice(0, 19)}  ${d.tip.padEnd(24)} ` +
          `${String(d.amount).padStart(9)} POEN  +${String(d.razmakSek).padStart(3)}s  ` +
          `"${(d.opis ?? "").slice(0, 38)}"`
      );
    }
    console.log("\n  🔴 Ovo traži pogled pre bilo kakvog poteza: ako je zapis zaista upisan");
    console.log("     dvaput, onda je i stanje novčanika uvećano dvaput. Brisanje reda");
    console.log("     stanje NE vraća — ostavlja POEN bez zapisa odakle je došao.");
    console.log("     Ispravka ide protivzapisom: vrati i stanje i ostavi trag.");
  }

  // ── 6. Zaključak ───────────────────────────────────────────────────────────
  console.log("\n── 6. Ukratko ───────────────────────────────────────────────────");
  console.log(`  Lista ima ${ukupno} zapisa; ${protivUkupno} su protivzapisi uz već prikazan događaj.`);
  console.log(`  Spajanje prikaza skraćuje listu za do ${ponistenjeTx} redova tačno,`);
  console.log(`  a karticu „Ukupno razmena" ispravlja sa ${bruto} na ${bruto - ponistenePrijave}.`);
  console.log(`  Stvarnih duplikata: ${duplikati.length === 0 ? "nema" : duplikati.length + " kandidata (tačka 5)"}.`);
  console.log("\n  Baza NIJE promenjena ovom skriptom.\n");
}

main()
  .catch((e) => {
    console.error("\n🔴 Dijagnostika pukla:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
