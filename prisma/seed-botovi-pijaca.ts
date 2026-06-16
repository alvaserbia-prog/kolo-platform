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

const TEST_LOZINKA = "test1234";
const POEN_VERIFIKACIJA = 1_000;

// ─── 5 bot korisnika (demo pijace) ───────────────────────────────────────────
// Personi su izabrani kao tipični profili kod kojih se javljaju najčešći viškovi:
// domaćica (zimnica), poljoprivrednik (bašta), mama (dečje stvari iz kojih su
// deca izrasla), student (polovna elektronika/knjige) i penzioner-majstor
// (ogrev, alat, sitne usluge i ručna izrada).
const BOTOVI = [
  { email: "zorica@test.rs",     pseudonim: "Zorica_M",     memberHash: "bot00001", location: "Sombor",           telefon: "+381645555501" },
  { email: "branislav@test.rs",  pseudonim: "Branislav_T",  memberHash: "bot00002", location: "Stapar",           telefon: "+381645555502" },
  { email: "gordana@test.rs",    pseudonim: "Gordana_S",    memberHash: "bot00003", location: "Kljajićevo",       telefon: "+381645555503" },
  { email: "djordje@test.rs",    pseudonim: "Đorđe_V",      memberHash: "bot00004", location: "Bezdan",           telefon: "+381645555504" },
  { email: "radovan@test.rs",    pseudonim: "Radovan_P",    memberHash: "bot00005", location: "Bački Monoštor",   telefon: "+381645555505" },
];

// ─── Po 5 oglasa za svakog (ukupno 25) — cene u POEN = standardne dinarske ─────
type Oglas = {
  title: string;
  description: string;
  price: number;
  category: "Hrana" | "Usluge" | "Zanati" | "Elektronika" | "Odeća" | "Ostalo";
  seller: string;
  image: string; // apsolutni URL — ruta /api/pijaca/slika 308-redirektuje na CDN
  location?: string;
  jedinica?: string;
  kolicina?: number;
};

// Slike sa Wikimedia Commons (slobodna licenca, stabilan URL). Special:FilePath
// redirektuje na pravi fajl; ruta /api/pijaca/slika dalje 308-redirektuje na njega.
const C = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=800`;

const OGLASI: Oglas[] = [
  // ── Zorica_M — domaćica, zimnica i domaći proizvodi (Valjevo) ──
  { title: "Domaći ajvar — ljuti, tegla 720ml", description: "Pravi domaći ajvar od pečenih crvenih babura, kuvan na tihoj vatri. Bez konzervansa. Ima i blagi.", price: 950,  category: "Hrana", seller: "Zorica_M", jedinica: "tegla", kolicina: 12, image: C("LyutenicaAjvarPindur.jpg") },
  { title: "Turšija — kiseli kupus i paprika, 1l", description: "Domaća turšija iz drvenog bureta. Hrskava, taman kisela. Tegla 1 litar.", price: 700,  category: "Hrana", seller: "Zorica_M", jedinica: "tegla", kolicina: 8, image: C("-2021-10-17_A_Jar_of_pickled_red_cabbage,_Trimingham,_Norfolk_(1).JPG") },
  { title: "Slatko od šljiva — tegla 400g", description: "Gusto slatko od šljiva požegača, kuvano po starinskom receptu. Manje šećera.", price: 600,  category: "Hrana", seller: "Zorica_M", jedinica: "tegla", kolicina: 10, image: C("Plum_jam_(9696385354).jpg") },
  { title: "Domaća šljivovica — 1 litar", description: "Pečena od sopstvenih šljiva, odležala. Jačina oko 22%. Flaša 1l.", price: 1800, category: "Hrana", seller: "Zorica_M", jedinica: "l", kolicina: 15, image: C("Bottle_of_slivovitz.jpg") },
  { title: "Sveža kokošja jaja — pakovanje 30 kom", description: "Jaja od koka iz dvorišta, nošena svaki dan. Pakovanje 30 komada.", price: 700,  category: "Hrana", seller: "Zorica_M", jedinica: "pak", kolicina: 6, image: C("Egg_cartons_with_chicken_eggs_01.jpg") },

  // ── Branislav_T — poljoprivrednik, viškovi iz bašte i voćnjaka (Topola) ──
  { title: "Krompir domaći — džak 25kg", description: "Beli krompir, sorta Riviera, ručno vađen. Pogodan za zimnicu i jelo. Džak 25kg.", price: 2000, category: "Hrana", seller: "Branislav_T", jedinica: "kg", kolicina: 200, image: C("Irish_potatoes_in_a_sack_in_a_market.jpg") },
  { title: "Paprika babura za zimnicu — 10kg", description: "Crvena mesnata babura, idealna za ajvar i pečenje. Pakovanje 10kg.", price: 1500, category: "Hrana", seller: "Branislav_T", jedinica: "kg", kolicina: 100, image: C("Freshly_harvested_red_bell_pepper.jpg") },
  { title: "Bagremov med — 1kg", description: "Čist bagremov med iz sopstvenih košnica. Svetao, ne kristališe brzo. Staklenka 1kg.", price: 2500, category: "Hrana", seller: "Branislav_T", jedinica: "kg", kolicina: 30, image: C("Three_French_monofloral_honey_jars.jpg") },
  { title: "Orasi očišćeni — 1kg", description: "Domaći orasi, ručno očišćeni, ovogodišnji rod. Pakovanje 1kg.", price: 1400, category: "Hrana", seller: "Branislav_T", jedinica: "kg", kolicina: 20, image: C("Shelled_English_Walnuts_2331px.jpg") },
  { title: "Tikvice iz bašte — 5kg", description: "Mlade tikvice, brane istog dana. Pogodne za jelo i turšiju. Pakovanje 5kg.", price: 500,  category: "Hrana", seller: "Branislav_T", jedinica: "kg", kolicina: 40, image: C("Zucchini_in_basket_2021_G1.jpg") },

  // ── Gordana_S — mama, dečje stvari iz kojih su deca izrasla (Beograd) ──
  { title: "Dečja kolica Cybex — očuvana", description: "Kolica Cybex Balios S, korišćena za jedno dete. Kišna navlaka i torba uključeni.", price: 6000, category: "Ostalo", seller: "Gordana_S", jedinica: "kom", kolicina: 1, image: C("Stroller_or_pram_pic3.JPG") },
  { title: "Garderoba za bebe 0–1 god — paket", description: "Veći paket bebi odeće (bodići, kombinezoni, čarapice). Sve oprano i očuvano.", price: 2000, category: "Odeća", seller: "Gordana_S", jedinica: "pak", kolicina: 1, image: C("Baby_Onesie_(49876451731).jpg") },
  { title: "Krevetac sa dušekom", description: "Drveni dečji krevetac sa podesivim dnom i dušekom. Bez oštećenja.", price: 4500, category: "Ostalo", seller: "Gordana_S", jedinica: "kom", kolicina: 1, image: C("Baby_bed_2010.jpg") },
  { title: "Dečji bicikl 16\" — sa pomoćnim točkovima", description: "Bicikl za uzrast 4–6 godina. Plave boje, ispravne kočnice, poklanjam kacigu.", price: 3500, category: "Ostalo", seller: "Gordana_S", jedinica: "kom", kolicina: 1, image: C("Helmeted_boy_on_training_wheels.jpg") },
  { title: "Slikovnice i igračke — paket", description: "Mešani paket slikovnica, drvenih kockica i didaktičkih igračaka. Sve ispravno.", price: 1500, category: "Ostalo", seller: "Gordana_S", jedinica: "pak", kolicina: 1, image: C("Two_sets_of_wooden_unit_blocks.jpeg") },

  // ── Đorđe_V — student, polovna elektronika i knjige (Novi Sad) ──
  { title: "Samsung Galaxy A52 — 128GB", description: "Telefon u dobrom stanju, baterija drži ceo dan. Ide sa maskom i punjačem.", price: 18000, category: "Elektronika", seller: "Đorđe_V", jedinica: "kom", kolicina: 1, image: C("Samsung-Galaxy-A51.jpg") },
  { title: "PlayStation 4 + 2 igre", description: "PS4 Slim 500GB, jedan džojstik i dve igre (FIFA, GTA V). Sve radi besprekorno.", price: 28000, category: "Elektronika", seller: "Đorđe_V", jedinica: "kom", kolicina: 1, image: C("PS4-Console-wDS4.jpg") },
  { title: "Monitor Dell 24\" — Full HD", description: "Dell P2419H, IPS panel, bez mrtvih piksela. Ide sa HDMI kablom i postoljem.", price: 9000, category: "Elektronika", seller: "Đorđe_V", jedinica: "kom", kolicina: 1, image: C("EIZO_Foris_FG2421_VGA_computer_monitor_displaying_test_pattern.png") },
  { title: "Udžbenici za gimnaziju — komplet", description: "Komplet udžbenika za 3. razred prirodno-matematičkog smera. Očuvani, malo podvlačeno.", price: 2500, category: "Ostalo", seller: "Đorđe_V", jedinica: "pak", kolicina: 1, image: C("A_tower_of_used_books_-_8443.jpg") },
  { title: "Mehanička tastatura — RGB", description: "Gejmerska mehanička tastatura sa plavim svičevima. US raspored, ispravna.", price: 4000, category: "Elektronika", seller: "Đorđe_V", jedinica: "kom", kolicina: 1, image: C("Beautiful_Mechanical_Keyboard.jpg") },

  // ── Radovan_P — penzioner-majstor, ogrev, alat, usluge i izrada (Kragujevac) ──
  { title: "Bukova drva za ogrev — 1m³", description: "Suva bukova drva, iscepana i složena. Mogućnost dostave u okolini grada. Cena po kubiku.", price: 6500, category: "Ostalo", seller: "Radovan_P", jedinica: "m", kolicina: 10, image: C("Stack_of_firewood.jpg") },
  { title: "Bušilica Bosch — polovna, ispravna", description: "Udarna bušilica Bosch, redovno održavana. Ide sa kompletom burgija.", price: 4500, category: "Ostalo", seller: "Radovan_P", jedinica: "kom", kolicina: 1, image: C("Cordless_drill_Metabo_BS_14,4_Li.JPG") },
  { title: "Ručni alat — komplet ključeva i odvijača", description: "Komplet nasadnih ključeva, odvijača i klešta u koferu. Sve na broju.", price: 3500, category: "Ostalo", seller: "Radovan_P", jedinica: "pak", kolicina: 1, image: C("Socket_wrench_set.jpg") },
  { title: "Sitne majstorske popravke u kući", description: "Montaža polica, zamena baterija, sitne vodoinstalaterske i električne popravke. Dolazak na adresu.", price: 1500, category: "Usluge", seller: "Radovan_P", image: C("Minnesota_State_Capitol_Woodworkers_Toolbox_Historical_Society.jpg") },
  { title: "Drveni baštenski sto — ručna izrada", description: "Sto od pune bukve, izrađen ručno. Dimenzije i lakiranje po dogovoru. Rok 1–2 nedelje.", price: 5500, category: "Zanati", seller: "Radovan_P", jedinica: "kom", kolicina: 1, image: C("DIY_garden_combined_table_and_bench.jpg") },
];

async function emitujIzBanke(toWalletId: string, amount: number, type: TransactionType, description: string) {
  await prisma.$transaction([
    prisma.wallet.update({ where: { id: "banka-singleton" }, data: { balance: { decrement: amount } } }),
    prisma.wallet.update({ where: { id: toWalletId }, data: { balance: { increment: amount } } }),
    prisma.transaction.create({
      data: { fromWalletId: "banka-singleton", toWalletId, amount, type, description },
    }),
  ]);
}

async function vecPostojiTransakcija(toWalletId: string, type: TransactionType): Promise<boolean> {
  const tx = await prisma.transaction.findFirst({ where: { toWalletId, type } });
  return !!tx;
}

function daniPre(brojDana: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - brojDana);
  return d;
}

async function main() {
  console.log("=== Seed: 5 bot korisnika + 25 oglasa (demo pijace) ===\n");

  // Banka mora postojati (za bonus verifikacije). Ako je nema, kreiraj je.
  await prisma.wallet.upsert({
    where: { id: "banka-singleton" },
    update: {},
    create: { id: "banka-singleton", type: WalletType.PROTOKOL, balance: 0 },
  });

  // 1) Kreiraj/uveri bot korisnike (verifikovani, sa novčanikom i bonusom)
  const hash = await bcrypt.hash(TEST_LOZINKA, 12);
  const poId: Record<string, string> = {};

  for (const b of BOTOVI) {
    const korisnik = await prisma.user.upsert({
      where: { email: b.email },
      update: { location: b.location, telefon: b.telefon },
      create: {
        email: b.email,
        passwordHash: hash,
        pseudonim: b.pseudonim,
        verified: true,
        verifiedAt: daniPre(20 + Math.floor(Math.random() * 60)),
        memberHash: b.memberHash,
        location: b.location,
        telefon: b.telefon,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
      include: { wallet: true },
    });
    poId[b.pseudonim] = korisnik.id;

    if (korisnik.wallet && !(await vecPostojiTransakcija(korisnik.wallet.id, TransactionType.EMISIJA_VERIFIKACIJA))) {
      await emitujIzBanke(korisnik.wallet.id, POEN_VERIFIKACIJA, TransactionType.EMISIJA_VERIFIKACIJA, "Bonus za verifikaciju identiteta");
    }
    console.log(`✓ Bot: ${b.pseudonim.padEnd(13)} — ${b.email.padEnd(20)} (${b.location})`);
  }

  // 2) Round-robin raspored: svako postavi po jedan oglas u krug, pa sledeći
  // krug. Tako prva strana pijace (sort "novo" = createdAt desc) prikazuje
  // izmešane oglase svih prodavaca, a ne blok jednog pa blok drugog.
  const poProdavcu = BOTOVI.map((b) => OGLASI.filter((o) => o.seller === b.pseudonim));
  const maxKom = Math.max(...poProdavcu.map((a) => a.length));
  const raspored: Oglas[] = [];
  for (let krug = 0; krug < maxKom; krug++) {
    for (const lista of poProdavcu) {
      if (lista[krug]) raspored.push(lista[krug]);
    }
  }

  // createdAt po redosledu postavljanja: prvi u rasporedu je najstariji,
  // poslednji najnoviji (pre ~2h, svaki prethodni ~5h ranije).
  const sada = new Date();
  const vremePostavljanja = (i: number): Date =>
    new Date(sada.getTime() - (2 + (raspored.length - 1 - i) * 5) * 3_600_000);

  // 3) Kreiraj/uskladi oglase (idempotentno po sellerId + title)
  console.log("");
  let kreirano = 0;
  for (let i = 0; i < raspored.length; i++) {
    const o = raspored[i];
    const sellerId = poId[o.seller];
    if (!sellerId) {
      console.warn(`  (preskočeno) nema korisnika ${o.seller} za "${o.title}"`);
      continue;
    }

    const sellerLoc = BOTOVI.find((b) => b.pseudonim === o.seller)?.location;
    const zeljenaLok = o.location ?? sellerLoc;
    const createdAt = vremePostavljanja(i);

    const postojeci = await prisma.marketplaceListing.findFirst({
      where: { sellerId, title: o.title },
      select: { id: true },
    });

    if (postojeci) {
      // Uskladi sliku, lokaciju i vreme postavljanja (zbog redosleda na pijaci).
      await prisma.marketplaceListing.update({
        where: { id: postojeci.id },
        data: { images: [o.image], location: zeljenaLok, createdAt },
      });
      console.log(`✎ ${String(i + 1).padStart(2)}. ${o.seller.padEnd(13)} "${o.title}"`);
      continue;
    }

    await prisma.marketplaceListing.create({
      data: {
        sellerId,
        title: o.title,
        description: o.description,
        price: o.price,
        category: o.category,
        location: zeljenaLok,
        images: [o.image],
        createdAt,
      },
    });
    console.log(`✓ ${String(i + 1).padStart(2)}. ${o.seller.padEnd(13)} "${o.title}" — ${o.price.toLocaleString("sr-RS")} POEN`);
    kreirano++;
  }

  console.log(`\n=== Završeno: ${BOTOVI.length} bot korisnika, ${kreirano} novih oglasa (od ${OGLASI.length}), raspored round-robin ===`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
