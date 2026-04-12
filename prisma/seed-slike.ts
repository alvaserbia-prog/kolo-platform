import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Unsplash Source — keyword po naslovu oglasa
const SLIKE_PO_NASLOVU: Record<string, string[]> = {
  "Domaći med od lipe": ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80"],
  "Svež hleb od celog zrna": ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"],
  "Domaći ajvar": ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"],
  "Organski paradajz": ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"],
  "Časovi srpskog jezika": ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"],
  "Prevoz kombijem": ["https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80"],
  "Frizura kod kuće": ["https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80"],
  "Popravka računara": ["https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80"],
  "Pleteni džemper": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"],
  "Drvena polica": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
  "Keramičke šolje": ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80"],
  "iPhone 11": ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80"],
  "Laptop Lenovo": ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"],
  "Bežične slušalice Sony": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
  "Zimska jakna North Face": ["https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=80"],
  "Ženski ljetni haljine": ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"],
  "Bicikla gradska": ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80"],
  "Knjige za pravni fakultet": ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80"],
  "Dečiji bicikl": ["https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80"],
};

async function skiniSliku(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (KOLO-seed/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} za ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log("=== Seed slike ===\n");

  const oglasi = await prisma.marketplaceListing.findMany({
    select: { id: true, title: true, images: true },
    orderBy: { createdAt: "asc" },
  });

  let uspesno = 0;
  let preskoceno = 0;

  for (const oglas of oglasi) {
    if (oglas.images.length > 0) {
      console.log(`  (ima sliku) ${oglas.title}`);
      preskoceno++;
      continue;
    }

    // Pronađi URL po ključnoj reči iz naslova
    const kljuc = Object.keys(SLIKE_PO_NASLOVU).find(k =>
      oglas.title.toLowerCase().includes(k.toLowerCase().split(" ")[0])
    );
    if (!kljuc) {
      console.log(`  (bez URL-a) ${oglas.title}`);
      continue;
    }

    const urls = SLIKE_PO_NASLOVU[kljuc];

    try {
      const dir = path.join(process.cwd(), "storage", "oglasi", oglas.id);
      await mkdir(dir, { recursive: true });

      const imagePaths: string[] = [];
      for (let i = 0; i < urls.length; i++) {
        const buffer = await skiniSliku(urls[i]);
        const fname = `slika_${i}.jpg`;
        await writeFile(path.join(dir, fname), buffer);
        imagePaths.push(`storage/oglasi/${oglas.id}/${fname}`);
        process.stdout.write(".");
      }

      await prisma.marketplaceListing.update({
        where: { id: oglas.id },
        data: { images: imagePaths },
      });

      console.log(`\n✓ ${oglas.title}`);
      uspesno++;

      // Kratka pauza da ne šaljemo previše zahteva
      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.log(`\n✗ ${oglas.title}: ${(e as Error).message}`);
    }
  }

  console.log(`\n=== Završeno: ${uspesno} slika, ${preskoceno} preskočeno ===`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
