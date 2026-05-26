import "dotenv/config";
import {
  PrismaClient,
  WalletType,
  Role,
  TransactionType,
  UserStatus,
  VerificationStatus,
  ProgramType,
  EnrollmentStatus,
  ZadatakIzvor,
  ZadatakMod,
  PrijavaStatus,
  IzvrsenjeStatus,
  PokroviteljDoprinosTip,
  DonationStatus,
  PristupnicaStatus,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Konstante ───────────────────────────────────────────────────────────────
const TEST_LOZINKA = "test1234";
const ADMIN_LOZINKA = "admin1234";

const POEN_VERIFIKACIJA = 1_000;
const POEN_KRUG_5 = 50_000;
const POEN_KRUG_10 = 100_000;
const POEN_DONACIJA_BONUS_FIXED = (rsd: number) => {
  // Pojednostavljeno za seed (puna logika je u src/lib/protokol/donacija.ts)
  return Math.round(rsd * 1.5);
};
const POKROVITELJ_BONUS_TABLE: Array<[number, number, number]> = [
  // [rsdIznos, nivo, bonusPoen]
  [10_000, 1, 20_000],
  [20_000, 2, 30_000],
  [50_000, 3, 80_000],
  [100_000, 4, 150_000],
  [200_000, 5, 300_000],
  [500_000, 6, 800_000],
  [1_000_000, 7, 1_500_000],
];

// ─── Korisnici ───────────────────────────────────────────────────────────────

const VERIFIKOVANI = [
  { email: "mila@test.rs",     pseudonim: "Mila_V",     referralCode: "TEST0001", memberHash: "tst00001", location: "Beograd",     telefon: "+381641111111" },
  { email: "petar@test.rs",    pseudonim: "Petar_K",    referralCode: "TEST0002", memberHash: "tst00002", location: "Novi Sad",    telefon: "+381641111112" },
  { email: "ana@test.rs",      pseudonim: "Ana_D",      referralCode: "TEST0003", memberHash: "tst00003", location: "Niš",         telefon: "+381641111113" },
  { email: "marko@test.rs",    pseudonim: "Marko_J",    referralCode: "TEST0004", memberHash: "tst00004", location: "Kragujevac",  telefon: "+381641111114" },
  { email: "jovana@test.rs",   pseudonim: "Jovana_R",   referralCode: "TEST0005", memberHash: "tst00005", location: "Subotica",    telefon: "+381641111115" },
  { email: "stefan@test.rs",   pseudonim: "Stefan_M",   referralCode: "TEST0006", memberHash: "tst00006", location: "Beograd",     telefon: "+381641111116" },
  { email: "danica@test.rs",   pseudonim: "Danica_P",   referralCode: "TEST0007", memberHash: "tst00007", location: "Čačak",       telefon: "+381641111117" },
  { email: "luka@test.rs",     pseudonim: "Luka_S",     referralCode: "TEST0008", memberHash: "tst00008", location: "Užice",       telefon: "+381641111118" },
  { email: "tijana@test.rs",   pseudonim: "Tijana_B",   referralCode: "TEST0009", memberHash: "tst00009", location: "Pančevo",     telefon: "+381641111119" },
  { email: "nemanja@test.rs",  pseudonim: "Nemanja_O",  referralCode: "TEST0010", memberHash: "tst00010", location: "Zrenjanin",   telefon: "+381641111120" },
  { email: "milica@test.rs",   pseudonim: "Milica_T",   referralCode: "TEST0011", memberHash: "tst00011", location: "Sombor",      telefon: "+381641111121" },
  { email: "vlada@test.rs",    pseudonim: "Vlada_Z",    referralCode: "TEST0012", memberHash: "tst00012", location: "Beograd",     telefon: "+381641111122" },
  { email: "sanja@test.rs",    pseudonim: "Sanja_F",    referralCode: "TEST0013", memberHash: "tst00013", location: "Kragujevac",  telefon: "+381641111123" },
  { email: "dejan@test.rs",    pseudonim: "Dejan_C",    referralCode: "TEST0014", memberHash: "tst00014", location: "Niš",         telefon: "+381641111124" },
  { email: "ivana@test.rs",    pseudonim: "Ivana_G",    referralCode: "TEST0015", memberHash: "tst00015", location: "Novi Sad",    telefon: "+381641111125" },
  { email: "bojan@test.rs",    pseudonim: "Bojan_L",    referralCode: "TEST0016", memberHash: "tst00016", location: "Vranje",      telefon: "+381641111126" },
  { email: "nikolina@test.rs", pseudonim: "Nikolina_H", referralCode: "TEST0017", memberHash: "tst00017", location: "Leskovac",    telefon: "+381641111127" },
  { email: "filip@test.rs",    pseudonim: "Filip_E",    referralCode: "TEST0018", memberHash: "tst00018", location: "Beograd",     telefon: "+381641111128" },
  { email: "marina@test.rs",   pseudonim: "Marina_W",   referralCode: "TEST0019", memberHash: "tst00019", location: "Kraljevo",    telefon: "+381641111129" },
  { email: "stevan@test.rs",   pseudonim: "Stevan_Q",   referralCode: "TEST0020", memberHash: "tst00020", location: "Šabac",       telefon: "+381641111130" },
];

const NEVERIFIKOVANI = [
  { email: "miloš@test.rs",  pseudonim: "Milos_N",  referralCode: "NVRF0001", memberHash: "nvrf0001", location: "Beograd",   telefon: "+381642222201" },
  { email: "katarina@test.rs", pseudonim: "Katarina_I", referralCode: "NVRF0002", memberHash: "nvrf0002", location: "Novi Sad", telefon: "+381642222202" },
  { email: "aleksandar@test.rs", pseudonim: "Aleksandar_X", referralCode: "NVRF0003", memberHash: "nvrf0003", location: "Niš", telefon: "+381642222203" },
];

const SUSPENDOVANI = [
  { email: "spam1@test.rs", pseudonim: "Spam_User1", referralCode: "SUSP0001", memberHash: "susp0001", location: "Beograd", telefon: "+381643333301", razlog: "Slanje neželjenih poruka" },
  { email: "spam2@test.rs", pseudonim: "Spam_User2", referralCode: "SUSP0002", memberHash: "susp0002", location: "Niš",     telefon: "+381643333302", razlog: "Pokušaj manipulacije sistema" },
];

// ─── Krugovi ────────────────────────────────────────────────────────────────

const KRUGOVI = [
  {
    name: "Zelena Mreža",
    description: "Krug za uzajamnu podrška i razmenu u Beogradu — fokus na održivost i lokalnu proizvodnju hrane.",
    location: "Beograd",
    clanovi: ["Mila_V", "Petar_K", "Ana_D", "Marko_J", "Jovana_R", "Vlada_Z", "Filip_E", "Stefan_M"],
    admin: "Mila_V",
  },
  {
    name: "Voćari Šumadije",
    description: "Krug voćara i poljoprivrednika centralne Srbije — razmena rasada, alata i znanja.",
    location: "Kragujevac",
    clanovi: ["Marko_J", "Sanja_F", "Danica_P", "Luka_S", "Stevan_Q", "Marina_W"],
    admin: "Marko_J",
  },
  {
    name: "Mala Pijaca Niš",
    description: "Lokalna mreža za razmenu domaćih proizvoda i usluga u Nišu i okolini.",
    location: "Niš",
    clanovi: ["Ana_D", "Dejan_C", "Bojan_L", "Nikolina_H", "Tijana_B"],
    admin: "Ana_D",
  },
];

// Krug u osnivanju (pristupnice na čekanju)
const KRUG_U_OSNIVANJU = {
  name: "Severni Banat",
  description: "Krug u procesu osnivanja — pristupnice se još razmatraju.",
  location: "Novi Sad",
  pristupnice: ["Ivana_G", "Nemanja_O", "Milica_T"],
};

// ─── Pijaca oglasi ───────────────────────────────────────────────────────────

const PIJACA_OGLASI = [
  // Hrana
  { title: "Domaći med od lipe — 1kg",      description: "Pravi domaći med od lipe sa Fruške gore. Bez konzervansa, direktno od pčelara.", price: 2800, category: "Hrana", location: "Novi Sad", seller: "Petar_K" },
  { title: "Svež hleb od celog zrna",        description: "Pečem hleb od integralnog brašna svako jutro. Moguća dostava u okolini Niša.",  price: 350,  category: "Hrana", location: "Niš",       seller: "Ana_D"   },
  { title: "Domaći ajvar — tegla 720ml",     description: "Pravi domaći ajvar od crvenih babura, pečenih na vatri. Blagi ili ljuti.",       price: 900,  category: "Hrana", location: "Niš",       seller: "Ana_D"   },
  { title: "Organski paradajz sa bašte — 5kg", description: "Svež paradajz uzgojen bez pesticida. Sorte: Volovsko srce i Roza.",            price: 1500, category: "Hrana", location: "Beograd",   seller: "Mila_V"  },
  { title: "Jabuke iz voćnjaka — 10kg",      description: "Sorta Ajdared, ručno brana, idealna za sokove i kompote.",                       price: 2200, category: "Hrana", location: "Kragujevac",seller: "Marko_J" },
  { title: "Sir od kravljeg mleka — 1kg",    description: "Domaći beli sir, mlado proizveden, pakovan u vakum.",                            price: 1800, category: "Hrana", location: "Čačak",     seller: "Danica_P"},

  // Usluge
  { title: "Časovi srpskog jezika",          description: "Privatni časovi za osnovce i srednjoškolce. Online ili uživo u Beogradu.",       price: 1500, category: "Usluge",location: "Beograd",   seller: "Stefan_M"},
  { title: "Prevoz kombijem — selidbe",      description: "Vršim prevoz stvari kombijem (12 m³). Selidbe, dostave nameštaja.",              price: 2500, category: "Usluge",location: "Kragujevac",seller: "Marko_J" },
  { title: "Frizura kod kuće",               description: "Dolazim na adresu. Šišanje, farbanje, pranje. Iskustvo 10 godina.",              price: 1200, category: "Usluge",location: "Subotica",  seller: "Jovana_R"},
  { title: "Popravka računara",              description: "Popravka laptopova i desktop računara. Reinstalacija Windowsa, čišćenje.",       price: 2000, category: "Usluge",location: "Beograd",   seller: "Stefan_M"},
  { title: "Časovi gitare za početnike",     description: "Učim sviranje akustične gitare. Pogodno za sve uzraste.",                        price: 1300, category: "Usluge",location: "Užice",     seller: "Luka_S"  },

  // Zanati
  { title: "Pleteni džemper po meri",        description: "Pleštem džempere, šalove i kape. Čista vuna, sve veličine. Rok 2-3 nedelje.",    price: 4500, category: "Zanati",location: "Novi Sad",  seller: "Petar_K" },
  { title: "Drvena polica ručne izrade",     description: "Police, kutije i sitni nameštaj od bukve ili hrasta. Po meri.",                  price: 6000, category: "Zanati",location: "Kragujevac",seller: "Marko_J" },
  { title: "Keramičke šolje",                description: "Pravim keramičke šolje, zdjele i ukrase. Svaki komad jedinstven.",               price: 1800, category: "Zanati",location: "Niš",       seller: "Ana_D"   },

  // Elektronika
  { title: "iPhone 11 — 64GB, crni",         description: "iPhone 11 64GB, dobro stanje. Baterija 84%. Punjač i maska.",                    price: 38000,category: "Elektronika",location: "Beograd", seller: "Mila_V" },
  { title: "Laptop Lenovo ThinkPad",         description: "Lenovo ThinkPad E14, i5-10. gen, 8GB RAM, 256GB SSD. Win 11.",                   price: 52000,category: "Elektronika",location: "Subotica",seller: "Jovana_R"},

  // Odeća
  { title: "Zimska jakna North Face vel. M", description: "North Face zimska jakna, crna, nošena jednu zimu. Bez oštećenja.",               price: 8500, category: "Odeća",  location: "Kragujevac",seller: "Marko_J" },

  // Ostalo
  { title: "Bicikla gradska Merida",         description: "Merida Speeder 100, veličina M. Redovno servisirana, idealna za grad.",          price: 22000,category: "Ostalo", location: "Beograd",   seller: "Mila_V"  },
  { title: "Knjige za pravni fakultet",      description: "Komplet udžbenika za 1. i 2. godinu pravnog. Podvlačeno hemijskom.",             price: 3200, category: "Ostalo", location: "Niš",       seller: "Ana_D"   },
];

// ─── Helper funkcije ─────────────────────────────────────────────────────────

async function emitujIzBanke(toWalletId: string, amount: number, type: TransactionType, description: string) {
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: "banka-singleton" },
      data: { balance: { decrement: amount } },
    }),
    prisma.wallet.update({
      where: { id: toWalletId },
      data: { balance: { increment: amount } },
    }),
    prisma.transaction.create({
      data: {
        fromWalletId: "banka-singleton",
        toWalletId,
        amount,
        type,
        description,
      },
    }),
  ]);
}

async function vecPostojiTransakcija(toWalletId: string, type: TransactionType, opisDeo?: string): Promise<boolean> {
  const tx = await prisma.transaction.findFirst({
    where: {
      toWalletId,
      type,
      ...(opisDeo ? { description: { contains: opisDeo } } : {}),
    },
  });
  return !!tx;
}

function daniPre(brojDana: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - brojDana);
  return d;
}

// ─── Glavne funkcije seeda ───────────────────────────────────────────────────

async function seedBanka() {
  await prisma.wallet.upsert({
    where: { id: "banka-singleton" },
    update: {},
    create: { id: "banka-singleton", type: WalletType.PROTOKOL, balance: 0 },
  });
  console.log("✓ Banka (Protokol) wallet");
}

async function seedAdmin() {
  const hash = await bcrypt.hash(ADMIN_LOZINKA, 12);
  await prisma.user.upsert({
    where: { email: "admin@ekolo.rs" },
    update: {},
    create: {
      email: "admin@ekolo.rs",
      passwordHash: hash,
      pseudonim: "Admin",
      role: Role.ADMIN,
      verified: true,
      verifiedAt: new Date(),
      referralCode: "ADMIN0000",
      memberHash: "adm00001",
      location: "Beograd",
      wallet: { create: { type: WalletType.USER, balance: 0 } },
    },
  });
  console.log(`✓ Admin: admin@ekolo.rs (lozinka: ${ADMIN_LOZINKA})`);
}

async function seedVerifikovaniKorisnici() {
  const hash = await bcrypt.hash(TEST_LOZINKA, 12);
  for (const k of VERIFIKOVANI) {
    const korisnik = await prisma.user.upsert({
      where: { email: k.email },
      update: {},
      create: {
        email: k.email,
        passwordHash: hash,
        pseudonim: k.pseudonim,
        role: Role.FIZICKO_LICE,
        verified: true,
        verifiedAt: daniPre(30 + Math.floor(Math.random() * 90)),
        referralCode: k.referralCode,
        memberHash: k.memberHash,
        location: k.location,
        telefon: k.telefon,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
      include: { wallet: true },
    });

    if (!(await vecPostojiTransakcija(korisnik.wallet!.id, TransactionType.EMISIJA_VERIFIKACIJA))) {
      await emitujIzBanke(korisnik.wallet!.id, POEN_VERIFIKACIJA, TransactionType.EMISIJA_VERIFIKACIJA, "Bonus za verifikaciju identiteta");
    }
  }
  console.log(`✓ Verifikovanih korisnika: ${VERIFIKOVANI.length} (po 1.000 POEN)`);
}

async function seedNeverifikovaniKorisnici() {
  const hash = await bcrypt.hash(TEST_LOZINKA, 12);
  for (const k of NEVERIFIKOVANI) {
    const korisnik = await prisma.user.upsert({
      where: { email: k.email },
      update: {},
      create: {
        email: k.email,
        passwordHash: hash,
        pseudonim: k.pseudonim,
        role: Role.FIZICKO_LICE,
        verified: false,
        referralCode: k.referralCode,
        memberHash: k.memberHash,
        location: k.location,
        telefon: k.telefon,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
    });

    // Kreiraj pending VerificationRequest
    const postojeci = await prisma.verificationRequest.findUnique({ where: { userId: korisnik.id } });
    if (!postojeci) {
      await prisma.verificationRequest.create({
        data: {
          userId: korisnik.id,
          jmbg: "0000000000000",
          kanal: "UPLOAD",
          status: VerificationStatus.PENDING,
        },
      });
    }
  }
  console.log(`✓ Neverifikovanih korisnika: ${NEVERIFIKOVANI.length} (sa pending zahtevima)`);
}

async function seedSuspendovaniKorisnici() {
  const hash = await bcrypt.hash(TEST_LOZINKA, 12);
  for (const k of SUSPENDOVANI) {
    await prisma.user.upsert({
      where: { email: k.email },
      update: {},
      create: {
        email: k.email,
        passwordHash: hash,
        pseudonim: k.pseudonim,
        role: Role.FIZICKO_LICE,
        verified: true,
        verifiedAt: daniPre(60),
        status: UserStatus.SUSPENDED,
        suspendedAt: daniPre(5),
        suspendedReason: k.razlog,
        referralCode: k.referralCode,
        memberHash: k.memberHash,
        location: k.location,
        telefon: k.telefon,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
    });
  }
  console.log(`✓ Suspendovanih korisnika: ${SUSPENDOVANI.length}`);
}

async function getKorisnikPoPseudonimu(pseudonim: string) {
  const k = await prisma.user.findUnique({
    where: { pseudonim },
    include: { wallet: true },
  });
  if (!k) throw new Error(`Nije pronađen korisnik: ${pseudonim}`);
  return k;
}

async function seedKrugovi() {
  for (const k of KRUGOVI) {
    const krug = await prisma.krug.upsert({
      where: { name: k.name },
      update: {},
      create: {
        name: k.name,
        description: k.description,
        location: k.location,
        wallet: { create: { type: WalletType.KRUG, balance: 0 } },
      },
      include: { wallet: true },
    });

    const krugWalletId = krug.wallet!.id;

    // Bonus za osnivanje (5 članova)
    if (!(await vecPostojiTransakcija(krugWalletId, TransactionType.EMISIJA_KRUG_OSNIVANJE))) {
      await emitujIzBanke(krugWalletId, POEN_KRUG_5, TransactionType.EMISIJA_KRUG_OSNIVANJE, `Emisija pri osnivanju Kruga ${k.name}`);
    }

    // Bonus za prag 10 članova (samo za Zelenu Mrežu koja ima 8 — simuliraj prag postignut nedavno)
    if (k.clanovi.length >= 8 && !(await vecPostojiTransakcija(krugWalletId, TransactionType.EMISIJA_KRUG_BONUS))) {
      await emitujIzBanke(krugWalletId, POEN_KRUG_10, TransactionType.EMISIJA_KRUG_BONUS, `Bonus za prag rasta — 10 članova (${k.name})`);
      const postojiLog = await prisma.krugBonusLog.findFirst({ where: { krugId: krug.id, threshold: 10 } });
      if (!postojiLog) {
        await prisma.krugBonusLog.create({
          data: { krugId: krug.id, threshold: 10, amount: POEN_KRUG_10 },
        });
      }
    }

    // Članstva
    for (let i = 0; i < k.clanovi.length; i++) {
      const clan = await getKorisnikPoPseudonimu(k.clanovi[i]);
      const vecClan = await prisma.krugClanstvo.findFirst({
        where: { userId: clan.id, krugId: krug.id, leftAt: null },
      });
      if (!vecClan) {
        await prisma.krugClanstvo.create({
          data: {
            userId: clan.id,
            krugId: krug.id,
            isAdmin: k.clanovi[i] === k.admin,
          },
        });
        await prisma.user.update({
          where: { id: clan.id },
          data: { role: Role.CLAN_KRUGA },
        });
      }
    }
    console.log(`  ✓ Krug "${k.name}" — ${k.clanovi.length} članova`);
  }

  // Krug u osnivanju + pristupnice na čekanju
  const krugOsn = await prisma.krug.upsert({
    where: { name: KRUG_U_OSNIVANJU.name },
    update: {},
    create: {
      name: KRUG_U_OSNIVANJU.name,
      description: KRUG_U_OSNIVANJU.description,
      location: KRUG_U_OSNIVANJU.location,
      wallet: { create: { type: WalletType.KRUG, balance: 0 } },
    },
  });
  for (const pseudonim of KRUG_U_OSNIVANJU.pristupnice) {
    const u = await getKorisnikPoPseudonimu(pseudonim);
    const postoji = await prisma.krugPristupnica.findUnique({
      where: { userId_krugId: { userId: u.id, krugId: krugOsn.id } },
    });
    if (!postoji) {
      await prisma.krugPristupnica.create({
        data: { userId: u.id, krugId: krugOsn.id, status: PristupnicaStatus.PENDING },
      });
    }
  }
  console.log(`  ✓ Krug "${KRUG_U_OSNIVANJU.name}" — ${KRUG_U_OSNIVANJU.pristupnice.length} pristupnica na čekanju`);
}

async function seedPijaca() {
  let kreirano = 0;
  for (const o of PIJACA_OGLASI) {
    const prodavac = await getKorisnikPoPseudonimu(o.seller);
    const postoji = await prisma.marketplaceListing.findFirst({
      where: { sellerId: prodavac.id, title: o.title },
    });
    if (!postoji) {
      await prisma.marketplaceListing.create({
        data: {
          sellerId: prodavac.id,
          title: o.title,
          description: o.description,
          price: o.price,
          category: o.category,
          location: o.location,
          phone: prodavac.telefon ?? undefined,
          images: [],
          createdAt: daniPre(Math.floor(Math.random() * 25)),
        },
      });
      kreirano++;
    }
  }
  console.log(`✓ Pijaca: ${kreirano} novih oglasa (ukupno ${PIJACA_OGLASI.length})`);
}

async function seedTransferi() {
  // Lista transferi: [posiljalac, primalac, iznos, opis, daniPreDanas]
  const transferi: Array<[string, string, number, string, number]> = [
    ["Mila_V",     "Petar_K",   200, "Hvala za dostavu meda",                    20],
    ["Petar_K",    "Ana_D",     350, "Plaćanje za hleb",                         18],
    ["Ana_D",      "Marko_J",   120, "Sitno mi pomogao",                         17],
    ["Marko_J",    "Jovana_R",  500, "Za sutra",                                 15],
    ["Stefan_M",   "Mila_V",    180, "Saputnička",                               14],
    ["Vlada_Z",    "Filip_E",   250, "Knjige",                                   13],
    ["Danica_P",   "Luka_S",    100, "Voće",                                     12],
    ["Tijana_B",   "Nemanja_O", 400, "Pomoć oko bašte",                          12],
    ["Milica_T",   "Sanja_F",   150, "Donacija inicijativi",                     11],
    ["Dejan_C",    "Ivana_G",    80, "Hvala",                                    10],
    ["Bojan_L",    "Nikolina_H",230, "Plaćanje",                                  9],
    ["Ana_D",      "Filip_E",   350, "Razmena",                                   9],
    ["Marko_J",    "Stevan_Q",  500, "Saradnja",                                  8],
    ["Mila_V",     "Marina_W",  200, "Test transfer",                             8],
    ["Petar_K",    "Vlada_Z",   100, "Sitnica",                                   7],
    ["Stefan_M",   "Tijana_B",  300, "Dobar provod",                              6],
    ["Jovana_R",   "Mila_V",    150, "Vraćam dug",                                5],
    ["Filip_E",    "Petar_K",   220, "Plaćanje preko platforme",                  5],
    ["Luka_S",     "Danica_P",   80, "Test",                                      4],
    ["Sanja_F",    "Marko_J",   180, "Razmena",                                   3],
    ["Nemanja_O",  "Bojan_L",   100, "Pomoć",                                     3],
    ["Ivana_G",    "Dejan_C",    50, "Hvala",                                     2],
    ["Nikolina_H", "Milica_T",  300, "Donacija",                                  2],
    ["Marina_W",   "Mila_V",    200, "Razmena",                                   2],
    ["Stevan_Q",   "Marko_J",   500, "Plaćanje za sat rada",                      1],
    ["Mila_V",     "Stefan_M",   80, "Hvala za pomoć",                            1],
    ["Petar_K",    "Ana_D",     150, "Razmena",                                   1],
    ["Ana_D",      "Mila_V",    100, "Sitnica",                                   1],
    ["Vlada_Z",    "Stefan_M",   60, "Test",                                      0],
    ["Filip_E",    "Marina_W",  120, "Plaćanje za bicikl",                        0],
    ["Tijana_B",   "Ivana_G",    90, "Hvala",                                     0],
    ["Danica_P",   "Sanja_F",    70, "Razmena",                                   0],
  ];

  let kreirano = 0;
  for (const [posS, primS, iznos, opis, daniPreDanas] of transferi) {
    const pos = await getKorisnikPoPseudonimu(posS);
    const prim = await getKorisnikPoPseudonimu(primS);
    if (!pos.wallet || !prim.wallet) continue;
    if (pos.wallet.balance < iznos) continue; // preskoči ako nema dovoljno

    // Idempotentnost: proveri da li postoji isti transfer (od → ka, iznos, opis)
    const postoji = await prisma.transaction.findFirst({
      where: {
        fromWalletId: pos.wallet.id,
        toWalletId: prim.wallet.id,
        amount: iznos,
        description: opis,
        type: TransactionType.TRANSFER,
      },
    });
    if (postoji) continue;

    await prisma.$transaction([
      prisma.wallet.update({ where: { id: pos.wallet.id },  data: { balance: { decrement: iznos } } }),
      prisma.wallet.update({ where: { id: prim.wallet.id }, data: { balance: { increment: iznos } } }),
      prisma.transaction.create({
        data: {
          fromWalletId: pos.wallet.id,
          toWalletId: prim.wallet.id,
          amount: iznos,
          type: TransactionType.TRANSFER,
          description: opis,
          createdAt: daniPre(daniPreDanas),
        },
      }),
    ]);
    kreirano++;
  }
  console.log(`✓ Transferi: ${kreirano} novih (od ukupno ${transferi.length} u listi)`);
}

async function seedProgrami() {
  // Aktiviraj PED i PODRSKA_MAJKAMA
  await prisma.protokolProgram.upsert({
    where: { type: ProgramType.PED },
    update: {},
    create: { type: ProgramType.PED, isActive: true, activatedAt: daniPre(60) },
  });
  await prisma.protokolProgram.upsert({
    where: { type: ProgramType.PODRSKA_MAJKAMA },
    update: {},
    create: { type: ProgramType.PODRSKA_MAJKAMA, isActive: true, activatedAt: daniPre(45) },
  });
  await prisma.protokolProgram.upsert({
    where: { type: ProgramType.SKOLOVANJE },
    update: { isActive: false },
    create: { type: ProgramType.SKOLOVANJE, isActive: false },
  });

  // Odobreni enrollments
  const odobreniEnrollments: Array<[string, ProgramType, number, Record<string, unknown>]> = [
    ["Jovana_R", ProgramType.PODRSKA_MAJKAMA, 1900, { brojDece: 1, primarniStaratelj: false }],
    ["Sanja_F",  ProgramType.PODRSKA_MAJKAMA, 1750, { brojDece: 2, primarniStaratelj: false }],
    ["Stefan_M", ProgramType.PED,             0,    {}],
  ];

  for (const [pseudonim, type, dailyAmount, metadata] of odobreniEnrollments) {
    const u = await getKorisnikPoPseudonimu(pseudonim);
    const postoji = await prisma.programEnrollment.findUnique({
      where: { userId_type: { userId: u.id, type } },
    });
    if (!postoji) {
      await prisma.programEnrollment.create({
        data: {
          userId: u.id,
          type,
          status: EnrollmentStatus.ACTIVE,
          dailyAmount: dailyAmount > 0 ? dailyAmount : null,
          metadata: metadata as object,
          approvedAt: daniPre(20),
        },
      });
    }
  }

  // Pending enrollments
  const pendingEnrollments: Array<[string, ProgramType, Record<string, unknown>]> = [
    ["Tijana_B", ProgramType.PODRSKA_MAJKAMA, { brojDece: 1, primarniStaratelj: true }],
    ["Marina_W", ProgramType.PED, {} ],
  ];

  for (const [pseudonim, type, metadata] of pendingEnrollments) {
    const u = await getKorisnikPoPseudonimu(pseudonim);
    const postoji = await prisma.programEnrollment.findUnique({
      where: { userId_type: { userId: u.id, type } },
    });
    if (!postoji) {
      await prisma.programEnrollment.create({
        data: {
          userId: u.id,
          type,
          status: EnrollmentStatus.PENDING,
          metadata: metadata as object,
        },
      });
    }
  }

  console.log(`✓ Programi: PED + Podrška Majkama aktivni; ${odobreniEnrollments.length} odobrenih, ${pendingEnrollments.length} na čekanju`);
}

async function seedDoprinosOglasi() {
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@ekolo.rs" } });

  // Operativni doprinos — zadaci za zajedničko dobro (Pravilnik o operativnom doprinosu v3.7.0)
  const zadaci = [
    {
      naslov: "Pomoć pri sređivanju javne bašte",
      opis: "Tražimo volontere za uređenje gradskog parka — kopanje, sadnja, krečenje klupa. Termin: vikend, po dogovoru.",
      cilj: "Uređeniji javni prostor za sve sugrađane.",
      kriterijumi: "Park očišćen, klupe okrečene, posađeno najmanje 10 sadnica.",
      mod: ZadatakMod.PO_SATU,
      stopaPoSatu: 1500,
      maxSati: 6,
      brojIzvrsilaca: 5,
      saOdobravanjem: false,
    },
    {
      naslov: "Prevodi materijala (srpski–engleski)",
      opis: "Prevod tekstova o sistemu KOLO za internacionalnu publiku. Iskustvo poželjno, ali nije obavezno.",
      cilj: "Materijali dostupni i na engleskom jeziku.",
      kriterijumi: "Preveden i lektorisan kompletan dokument.",
      mod: ZadatakMod.U_CELOSTI,
      iznosUCelosti: 12000,
      brojIzvrsilaca: 2,
      saOdobravanjem: true,
    },
    {
      naslov: "Foto reportaža sa lokalnih dešavanja",
      opis: "Fotografisanje radionica i susreta članova zajednice. Potrebna sopstvena oprema.",
      cilj: "Vizuelna dokumentacija aktivnosti zajednice.",
      kriterijumi: "Najmanje 30 obrađenih fotografija isporučeno.",
      mod: ZadatakMod.U_CELOSTI,
      iznosUCelosti: 10000,
      brojIzvrsilaca: 1,
      saOdobravanjem: false,
    },
    {
      naslov: "Pomoć starijim sugrađanima — kupovina i obilasci",
      opis: "Pomažemo starijim sugrađanima oko nabavki, plaćanja računa, lekova. Potrebna empatija i strpljenje.",
      cilj: "Podrška starijima u svakodnevnim potrebama.",
      kriterijumi: "Obavljen dogovoreni obilazak uz potvrdu korisnika.",
      mod: ZadatakMod.PO_SATU,
      stopaPoSatu: 1300,
      maxSati: 4,
      brojIzvrsilaca: 8,
      saOdobravanjem: false,
    },
  ];

  for (const z of zadaci) {
    const postoji = await prisma.zadatak.findFirst({ where: { naslov: z.naslov } });
    if (!postoji) {
      const predlozeniPoen =
        z.mod === ZadatakMod.PO_SATU
          ? (z.maxSati ?? 8) * (z.stopaPoSatu ?? 0)
          : (z.iznosUCelosti ?? 0);
      await prisma.zadatak.create({
        data: {
          naslov: z.naslov,
          opis: z.opis,
          cilj: z.cilj,
          kriterijumi: z.kriterijumi,
          izvor: ZadatakIzvor.FONDACIJA,
          mod: z.mod,
          stopaPoSatu: z.stopaPoSatu ?? null,
          maxSati: z.maxSati ?? null,
          iznosUCelosti: z.iznosUCelosti ?? null,
          predlozeniPoen,
          brojIzvrsilaca: z.brojIzvrsilaca,
          saOdobravanjem: z.saOdobravanjem,
          createdById: admin.id,
        },
      });
    }
  }

  // Par prijava i izvršenja — primljena (auto) i podneta (sa odobravanjem)
  const zadatak1 = await prisma.zadatak.findFirst({ where: { naslov: zadaci[0].naslov } });
  const zadatak2 = await prisma.zadatak.findFirst({ where: { naslov: zadaci[1].naslov } });

  if (zadatak1) {
    const lukaP = await getKorisnikPoPseudonimu("Luka_S");
    const danicaP = await getKorisnikPoPseudonimu("Danica_P");

    const lukaPrijava = await prisma.zadatakPrijava.upsert({
      where: { zadatakId_userId: { zadatakId: zadatak1.id, userId: lukaP.id } },
      update: {},
      create: {
        zadatakId: zadatak1.id,
        userId: lukaP.id,
        planIzvrsenja: "Radim subotom ujutru, dokaz: fotografije pre/posle radova.",
        status: PrijavaStatus.PRIMLJENA,
        primljenaAt: daniPre(8),
      },
    });

    await prisma.zadatakPrijava.upsert({
      where: { zadatakId_userId: { zadatakId: zadatak1.id, userId: danicaP.id } },
      update: {},
      create: {
        zadatakId: zadatak1.id,
        userId: danicaP.id,
        planIzvrsenja: "Pomažem oko sadnje sredinom nedelje, dostavljam izveštaj.",
        status: PrijavaStatus.PRIMLJENA,
        primljenaAt: daniPre(7),
      },
    });

    await prisma.zadatak.update({ where: { id: zadatak1.id }, data: { status: "U_IZVRSENJU" } });

    // Izvršenje za Luku — jedno podneto na verifikaciju (PO_SATU, 4 sata)
    const datum1 = daniPre(5);
    datum1.setHours(0, 0, 0, 0);
    const izPostoji = await prisma.zadatakIzvrsenje.findUnique({
      where: { prijavaId_datum: { prijavaId: lukaPrijava.id, datum: datum1 } },
    });
    if (!izPostoji) {
      await prisma.zadatakIzvrsenje.create({
        data: {
          prijavaId: lukaPrijava.id,
          zadatakId: zadatak1.id,
          userId: lukaP.id,
          datum: datum1,
          sati: 4,
          dokaz: "Sadnja drveća na istoku parka i krečenje klupa — fotografije priložene.",
          tezina: 4 * (zadatak1.stopaPoSatu ?? 0),
          zavrsno: true,
          status: IzvrsenjeStatus.PODNETO,
        },
      });
    }
  }

  if (zadatak2) {
    const ivanaG = await getKorisnikPoPseudonimu("Ivana_G");
    await prisma.zadatakPrijava.upsert({
      where: { zadatakId_userId: { zadatakId: zadatak2.id, userId: ivanaG.id } },
      update: {},
      create: {
        zadatakId: zadatak2.id,
        userId: ivanaG.id,
        planIzvrsenja: "Prevod u dve faze, prvo nacrt pa lektura; dokaz: dokument sa izmenama.",
        status: PrijavaStatus.PODNETA,
      },
    });
  }

  console.log(`✓ Operativni doprinos: ${zadaci.length} zadataka, par prijava i izvršenja`);
}

async function seedPokrovitelji() {
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@ekolo.rs" } });

  const pokrovitelji = [
    {
      naziv: "Bašta d.o.o.",
      pib: "111111111",
      adresa: "Bulevar Kralja Aleksandra 10, Beograd",
      vlasnik: "Mila_V",
      doprinosRSD: 50_000,
      nivo: 3,
      bonus: 80_000,
    },
    {
      naziv: "EkoFarm a.d.",
      pib: "222222222",
      adresa: "Vojvođanska 5, Novi Sad",
      vlasnik: "Petar_K",
      doprinosRSD: 100_000,
      nivo: 4,
      bonus: 150_000,
    },
  ];

  for (const p of pokrovitelji) {
    const vlasnik = await getKorisnikPoPseudonimu(p.vlasnik);
    const pokrovitelj = await prisma.pokrovitelj.upsert({
      where: { pib: p.pib },
      update: {},
      create: {
        naziv: p.naziv,
        pib: p.pib,
        adresa: p.adresa,
        vlasnikId: vlasnik.id,
        kreiraoId: admin.id,
        rsdKumulativ: p.doprinosRSD,
        trenutniNivo: p.nivo,
      },
    });

    const postojiDoprinos = await prisma.pokroviteljDoprinos.findFirst({
      where: { pokroviteljId: pokrovitelj.id },
    });
    if (!postojiDoprinos) {
      await prisma.pokroviteljDoprinos.create({
        data: {
          pokroviteljId: pokrovitelj.id,
          rsdIznos: p.doprinosRSD,
          tip: PokroviteljDoprinosTip.DONACIJA_FONDACIJI,
          evidentiraoId: admin.id,
          napomena: "Prvi doprinos pri prijavi pokroviteljstva",
        },
      });

      // Bonus emisija vlasniku
      if (vlasnik.wallet) {
        await emitujIzBanke(
          vlasnik.wallet.id,
          p.bonus,
          TransactionType.EMISIJA_POKROVITELJ,
          `Bonus za pokroviteljstvo iznos ${p.doprinosRSD}`
        );
        await prisma.pokroviteljBonusEmisija.create({
          data: {
            pokroviteljId: pokrovitelj.id,
            vlasnikId: vlasnik.id,
            nivo: p.nivo,
            bonusPoen: p.bonus,
          },
        });
      }
    }
  }

  console.log(`✓ Pokrovitelji: ${pokrovitelji.length} sa doprinosima i bonusima`);
}

async function seedDonacije() {
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@ekolo.rs" } });

  const donacije = [
    { donor: "Vlada_Z",    rsd: 5000,  level: 1 },
    { donor: "Filip_E",    rsd: 10000, level: 2 },
    { donor: "Marina_W",   rsd: 3000,  level: 1 },
    { donor: "Stevan_Q",   rsd: 20000, level: 3 },
  ];

  let kreirano = 0;
  for (const d of donacije) {
    const u = await getKorisnikPoPseudonimu(d.donor);
    const postoji = await prisma.donationRecord.findFirst({
      where: { userId: u.id, amountRSD: d.rsd },
    });
    if (postoji) continue;

    const bonusPoen = POEN_DONACIJA_BONUS_FIXED(d.rsd);

    const donacija = await prisma.donationRecord.create({
      data: {
        userId: u.id,
        amountRSD: d.rsd,
        cumulativeRSD: d.rsd,
        level: d.level,
        poenEmitted: bonusPoen,
        status: DonationStatus.CONFIRMED,
        confirmedAt: daniPre(15 - kreirano),
        confirmedById: admin.id,
      },
    });

    if (u.wallet) {
      await emitujIzBanke(
        u.wallet.id,
        bonusPoen,
        TransactionType.EMISIJA_DONACIJA,
        `Bonus za donaciju iznos ${d.rsd}`
      );
    }
    kreirano++;
    void donacija;
  }
  console.log(`✓ Donacije: ${kreirano} novih`);
}

async function seedBlog() {
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@ekolo.rs" } });

  const objave = [
    {
      title: "Dobrodošli u KOLO platformu",
      content: "Drage članice i članovi, dobrodošli u KOLO — alternativni ekonomski sistem zasnovan na uzajamnosti i doprinosu zajedničkom dobru. U narednim danima objavićemo detalje o tome kako funkcioniše POEN, kako se sticati, kako koristiti Pijacu i Krugove.",
      daniPreDanas: 25,
    },
    {
      title: "Otvoren je proces verifikacije",
      content: "Verifikacija identiteta je preduslov za pristup punoj funkcionalnosti platforme — Pijaca, ZRNO, Programi Protokola. Verifikacija se obavlja preko upload-a lične karte ili lično u Fondaciji. Svaki novoprijavljeni verifikovani korisnik dobija 1.000 POEN kao bonus dobrodošlice.",
      daniPreDanas: 18,
    },
    {
      title: "Pokrenut Program Evidencije Doprinosa (PED)",
      content: "Od ove nedelje aktivan je Operativni program — Program Evidencije Doprinosa. Verifikovani korisnici mogu se prijaviti za oglase Fondacije i evidentirati svoje radne sate kroz međusobno potvrđivanje doprinosa.",
      daniPreDanas: 12,
    },
    {
      title: "Prvi Krugovi su u procesu osnivanja",
      content: "Sa zadovoljstvom obaveštavamo da su prvi Krugovi (lokalne operativne grupe) odobreni i aktivirani. Zelena Mreža (Beograd), Voćari Šumadije (Kragujevac) i Mala Pijaca Niš sada okupljaju verifikovane članove. Pristupnice su otvorene u svim aktivnim Krugovima.",
      daniPreDanas: 5,
    },
  ];

  let kreirano = 0;
  for (const o of objave) {
    const postoji = await prisma.blogPost.findFirst({ where: { title: o.title } });
    if (!postoji) {
      const datum = daniPre(o.daniPreDanas);
      await prisma.blogPost.create({
        data: {
          title: o.title,
          content: o.content,
          authorId: admin.id,
          publishedAt: datum,
          createdAt: datum,
        },
      });
      kreirano++;
    }
  }
  console.log(`✓ Blog: ${kreirano} novih objava`);
}

async function seedChatPoruke() {
  const poruke: Array<[string, string, number]> = [
    // [pseudonim, content, satiPreDanas]
    ["Mila_V",   "Pozdrav svima u sistemu!",                                    72],
    ["Petar_K",  "Da li neko zna kako funkcioniše ZRNO?",                       68],
    ["Ana_D",    "Pozdrav iz Niša 👋",                                          50],
    ["Marko_J",  "Imamo novu sezonu jabuka, pišite na Pijaci.",                 48],
    ["Stefan_M", "Drago mi je da je sistem ovde — radujem se Programa!",        36],
    ["Jovana_R", "Hej, tek sam se prijavila na Podršku Majkama.",               24],
    ["Vlada_Z",  "Hvala administratorima na uvodnoj objavi.",                   18],
    ["Filip_E",  "Postavio sam knjige na Pijaci — pišite ako neko studira pravo.", 6],
    ["Tijana_B", "Da li su pristupnice za Severni Banat još otvorene?",         3],
    ["Mila_V",   "Pridružujem se inicijativi za sređivanje parka — vidimo se vikend!", 1],
  ];

  let kreirano = 0;
  for (const [pseudonim, content, satiPre] of poruke) {
    const u = await getKorisnikPoPseudonimu(pseudonim);
    const postoji = await prisma.chatMessage.findFirst({
      where: { userId: u.id, content },
    });
    if (!postoji) {
      const datum = new Date();
      datum.setHours(datum.getHours() - satiPre);
      await prisma.chatMessage.create({
        data: { userId: u.id, content, createdAt: datum },
      });
      kreirano++;
    }
  }
  console.log(`✓ Chat soba: ${kreirano} novih poruka`);
}

async function seedNotifikacije() {
  const notifikacije: Array<[string, string, string, string]> = [
    ["Mila_V",   "TRANSFER",     "Primljen transfer",         "Stigao vam je transfer od 200 POEN."],
    ["Petar_K",  "TRANSFER",     "Primljen transfer",         "Stigao vam je transfer od 220 POEN."],
    ["Jovana_R", "PROGRAM",      "Program odobren",           "Vaša prijava na Podršku Majkama je odobrena."],
    ["Tijana_B", "PROGRAM",      "Prijava primljena",         "Vaša prijava na Podršku Majkama je u obradi."],
    ["Stevan_Q", "DONACIJA",     "Donacija potvrđena",        "Vaša donacija od 20.000 RSD je evidentirana — bonus POEN dodeljen."],
    ["Luka_S",   "OGLAS",        "Prijava odobrena",          "Vaša prijava za oglas Pomoć pri sređivanju javne bašte je odobrena."],
  ];

  let kreirano = 0;
  for (const [pseudonim, tip, naslov, tekst] of notifikacije) {
    const u = await getKorisnikPoPseudonimu(pseudonim);
    const postoji = await prisma.notifikacija.findFirst({
      where: { userId: u.id, naslov, tekst },
    });
    if (!postoji) {
      await prisma.notifikacija.create({
        data: { userId: u.id, tip, naslov, tekst },
      });
      kreirano++;
    }
  }
  console.log(`✓ Notifikacije: ${kreirano} novih`);
}

async function ispisiPregled() {
  const banka = await prisma.wallet.findUnique({ where: { id: "banka-singleton" } });
  const ukupnoKorisnika = await prisma.user.count();
  const verifikovani = await prisma.user.count({ where: { verified: true, status: UserStatus.ACTIVE } });
  const suspendovani = await prisma.user.count({ where: { status: UserStatus.SUSPENDED } });
  const krugovi = await prisma.krug.count();
  const oglasi = await prisma.marketplaceListing.count();
  const transferi = await prisma.transaction.count({ where: { type: TransactionType.TRANSFER } });
  const blogPosts = await prisma.blogPost.count();
  const chatPoruke = await prisma.chatMessage.count();

  console.log("\n=== Seed završen ===");
  console.log(`Korisnika ukupno:     ${ukupnoKorisnika}`);
  console.log(`Verifikovanih:        ${verifikovani}`);
  console.log(`Suspendovanih:        ${suspendovani}`);
  console.log(`Krugovi:              ${krugovi}`);
  console.log(`Pijaca oglasi:        ${oglasi}`);
  console.log(`Transferi (P2P):      ${transferi}`);
  console.log(`Blog objave:          ${blogPosts}`);
  console.log(`Chat poruke:          ${chatPoruke}`);
  console.log(`Banka balans:         ${banka?.balance.toLocaleString("sr-RS")} POEN`);
  console.log(`\n--- Test nalozi (lozinka: ${TEST_LOZINKA}) ---`);
  console.log(`Admin: admin@ekolo.rs (lozinka: ${ADMIN_LOZINKA})`);
  console.log(`\nVerifikovani:`);
  for (const k of VERIFIKOVANI) {
    console.log(`  ${k.pseudonim.padEnd(14)} — ${k.email.padEnd(22)} (${k.location})`);
  }
  console.log(`\nNeverifikovani (pending verifikacija):`);
  for (const k of NEVERIFIKOVANI) {
    console.log(`  ${k.pseudonim.padEnd(14)} — ${k.email}`);
  }
  console.log(`\nSuspendovani:`);
  for (const k of SUSPENDOVANI) {
    console.log(`  ${k.pseudonim.padEnd(14)} — ${k.email} (${k.razlog})`);
  }
}

async function main() {
  console.log("=== KOLO Seed (prošireno) ===\n");

  await seedBanka();
  await seedAdmin();
  await seedVerifikovaniKorisnici();
  await seedNeverifikovaniKorisnici();
  await seedSuspendovaniKorisnici();
  await seedKrugovi();
  await seedPijaca();
  await seedTransferi();
  await seedProgrami();
  await seedDoprinosOglasi();
  await seedPokrovitelji();
  await seedDonacije();
  await seedBlog();
  await seedChatPoruke();
  await seedNotifikacije();

  await ispisiPregled();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
