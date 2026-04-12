import "dotenv/config";
import { PrismaClient, WalletType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const oglasi = [
  // Hrana
  {
    title: "Domaći med od lipe — 1kg",
    description: "Pravi domaći med od lipe sa Fruške gore. Bez konzervansa, direktno od pčelara. Pakovanje 1kg u staklenci.",
    price: 2800,
    category: "Hrana",
    location: "Novi Sad",
    emailIdx: 1, // Petar_K
  },
  {
    title: "Svež hleb od celog zrna — pečen svakog jutra",
    description: "Pečem hleb od integralnog brašna svako jutro. Moguća dostava u okolini Niša. Cena po vekni.",
    price: 350,
    category: "Hrana",
    location: "Niš",
    emailIdx: 2, // Ana_D
  },
  {
    title: "Domaći ajvar — tegla 720ml",
    description: "Pravi domaći ajvar od crvenih babura, pečenih na vatri. Blagi ili ljuti — po izboru. Tegla 720ml.",
    price: 900,
    category: "Hrana",
    location: "Niš",
    emailIdx: 2, // Ana_D
  },
  {
    title: "Organski paradajz sa bašte — 5kg",
    description: "Svež paradajz uzgojen bez pesticida i veštačkih đubriva. Berbane sorte: Volovsko srce i Roza. Dostava na adresi u Beogradu.",
    price: 1500,
    category: "Hrana",
    location: "Beograd",
    emailIdx: 0, // Mila_V
  },

  // Usluge
  {
    title: "Časovi srpskog jezika — priprema za maturu",
    description: "Držim privatne časove srpskog jezika za osnovce i srednjoškolce. Priprema za maturu i popravni. Online ili uživo u Beogradu.",
    price: 1500,
    category: "Usluge",
    location: "Beograd",
    emailIdx: 5, // Stefan_M
  },
  {
    title: "Prevoz kombijem — selidbe i dostave",
    description: "Vršim prevoz stvari kombijem (12 m³). Selidbe, dostave namještaja, odvoz na deponiju. Cena po satu, okolina Kragujevca.",
    price: 2500,
    category: "Usluge",
    location: "Kragujevac",
    emailIdx: 3, // Marko_J
  },
  {
    title: "Frizura kod kuće — ženska i muška",
    description: "Dolazim na adresu. Šišanje, farbanje, pranje. Radno iskustvo 10 godina. Subotica i okolina.",
    price: 1200,
    category: "Usluge",
    location: "Subotica",
    emailIdx: 4, // Jovana_R
  },
  {
    title: "Popravka računara i instalacija softvera",
    description: "Popravka laptopova i desktop računara. Reinstalacija Windowsa, čišćenje od virusa, zamena delova. Dolazak na adresu ili donosite kod mene.",
    price: 2000,
    category: "Usluge",
    location: "Beograd",
    emailIdx: 5, // Stefan_M
  },

  // Zanati
  {
    title: "Pleteni džemper po meri — vuna",
    description: "Pleštem džempere, šalove i kape po narudžbini. Čista vuna, sve veličine. Rok isporuke 2-3 nedelje. Uzorak boja po dogovoru.",
    price: 4500,
    category: "Zanati",
    location: "Novi Sad",
    emailIdx: 1, // Petar_K
  },
  {
    title: "Drvena polica ručne izrade — po meri",
    description: "Pravim police, kutije i sitni nameštaj od punog drveta. Bukva ili hrast. Dimenzije i boja po dogovoru. Rok isporuke 1-2 nedelje.",
    price: 6000,
    category: "Zanati",
    location: "Kragujevac",
    emailIdx: 3, // Marko_J
  },
  {
    title: "Keramičke šolje ručne izrade",
    description: "Pravim keramičke šolje, zdjele i ukrase. Svaki komad jedinstven, pečen u sopstvenoj peći. Zapremina šolje oko 300ml.",
    price: 1800,
    category: "Zanati",
    location: "Niš",
    emailIdx: 2, // Ana_D
  },

  // Elektronika
  {
    title: "iPhone 11 — 64GB, crni, dobro stanje",
    description: "Prodajem iPhone 11 64GB u dobrom stanju. Ekran bez ogrebotina, baterija 84%. Ide sa punjačem i maskom. Bez kartica operatera.",
    price: 38000,
    category: "Elektronika",
    location: "Beograd",
    emailIdx: 0, // Mila_V
  },
  {
    title: "Laptop Lenovo ThinkPad — i5, 8GB RAM",
    description: "Lenovo ThinkPad E14, Intel i5-10. gen, 8GB RAM, 256GB SSD. Windows 11 instaliran, punjen svakodnevno, bez pada. Ide sa torbicom.",
    price: 52000,
    category: "Elektronika",
    location: "Subotica",
    emailIdx: 4, // Jovana_R
  },
  {
    title: "Bežične slušalice Sony WH-1000XM4",
    description: "Sony WH-1000XM4 sa aktivnim poništavanjem buke. Kupljene pre godinu dana, korišćene u odličnom stanju. Ide kutija i kablovi.",
    price: 24000,
    category: "Elektronika",
    location: "Novi Sad",
    emailIdx: 1, // Petar_K
  },

  // Odeća
  {
    title: "Zimska jakna North Face — vel. M",
    description: "North Face zimska jakna, veličina M, crna. Nošena jednu zimu, u odličnom stanju. Bez oštećenja i mrlja.",
    price: 8500,
    category: "Odeća",
    location: "Kragujevac",
    emailIdx: 3, // Marko_J
  },
  {
    title: "Ženski ljetni haljine — 3 komada, vel. S/M",
    description: "Prodajem 3 letnje haljine zajedno. Veličina S/M. Malo nošene, oprane i ispeglane. Slike svih 3 na zahtev.",
    price: 2500,
    category: "Odeća",
    location: "Subotica",
    emailIdx: 4, // Jovana_R
  },

  // Ostalo
  {
    title: "Bicikla gradska — Merida Speeder 100",
    description: "Merida Speeder 100, veličina okvira M, siva. Kupovna pre 2 godine, redovno servisirana. Nova guma napred, kočnice nove. Idealna za gradsku vožnju.",
    price: 22000,
    category: "Ostalo",
    location: "Beograd",
    emailIdx: 0, // Mila_V
  },
  {
    title: "Knjige za pravni fakultet — komplet",
    description: "Prodajem komplet udžbenika za 1. i 2. godinu pravnog fakulteta. Autori: Jovičić, Marković, Stanković. Podvlačeno hemijskom, ali čitljivo.",
    price: 3200,
    category: "Ostalo",
    location: "Niš",
    emailIdx: 2, // Ana_D
  },
  {
    title: "Dečiji bicikl 20\" — za uzrast 6-9 godina",
    description: "Dečiji bicikl sa pomoćnim točkićima, veličina 20 inča. Crvene boje, u dobrom stanju. Poklanjam kacigu uz kupovinu.",
    price: 4800,
    category: "Ostalo",
    location: "Kragujevac",
    emailIdx: 3, // Marko_J
  },
];

async function main() {
  console.log("=== Seed oglasi ===\n");

  const emailovi = [
    "mila@test.rs",    // 0
    "petar@test.rs",   // 1
    "ana@test.rs",     // 2
    "marko@test.rs",   // 3
    "jovana@test.rs",  // 4
    "stefan@test.rs",  // 5
  ];

  const sortirani = await Promise.all(
    emailovi.map(email =>
      prisma.user.findUnique({ where: { email }, select: { id: true, pseudonim: true, location: true } })
    )
  );

  if (sortirani.some(k => !k)) {
    console.error("Nisu pronađeni svi testni korisnici — pokreni seed.ts prvo");
    process.exit(1);
  }

  let kreirano = 0;
  for (const oglas of oglasi) {
    const prodavac = sortirani[oglas.emailIdx]!;
    if (!prodavac) continue;

    const postojeci = await prisma.marketplaceListing.findFirst({
      where: { sellerId: prodavac.id, title: oglas.title },
    });

    if (!postojeci) {
      await prisma.marketplaceListing.create({
        data: {
          sellerId: prodavac.id,
          title: oglas.title,
          description: oglas.description,
          price: oglas.price,
          category: oglas.category,
          location: oglas.location ?? prodavac.location,
          images: [],
        },
      });
      console.log(`✓ ${prodavac.pseudonim}: "${oglas.title}" — ${oglas.price.toLocaleString("sr-RS")} POEN`);
      kreirano++;
    } else {
      console.log(`  (postoji) ${oglas.title}`);
    }
  }

  console.log(`\n=== Završeno: ${kreirano} novih oglasa ===`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
