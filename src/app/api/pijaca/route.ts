import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sacuvajNaR2, r2Konfigurisan } from "@/lib/skladiste";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const KATEGORIJE = ["Hrana", "Usluge", "Zanati", "Elektronika", "Odeća", "Ostalo"];
const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

// GET /api/pijaca — lista aktivnih oglasa
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const kategorija = searchParams.get("kategorija") ?? "";
  const pretraga = searchParams.get("q") ?? "";
  const sortiranje = searchParams.get("sort") ?? "novo";
  const minCena = parseInt(searchParams.get("min") ?? "0") || 0;
  const maxCena = parseInt(searchParams.get("max") ?? "0") || 0;

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (kategorija && KATEGORIJE.includes(kategorija)) where.category = kategorija;
  if (pretraga) where.title = { contains: pretraga, mode: "insensitive" };
  if (minCena > 0 || maxCena > 0) {
    where.price = {};
    if (minCena > 0) (where.price as Record<string, number>).gte = minCena;
    if (maxCena > 0) (where.price as Record<string, number>).lte = maxCena;
  }

  const orderBy =
    sortiranje === "jeftino" ? { price: "asc" as const } :
    sortiranje === "skupo"   ? { price: "desc" as const } :
                               { createdAt: "desc" as const };

  const listings = await prisma.marketplaceListing.findMany({
    where,
    orderBy,
    take: 60,
    select: {
      id: true, title: true, description: true, price: true,
      category: true, images: true, location: true, createdAt: true,
      seller: { select: { pseudonim: true, verified: true } },
    },
  });

  return NextResponse.json({ listings });
}

// POST /api/pijaca — kreiraj oglas (samo verifikovani)
export async function POST(req: NextRequest) {
  try {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnici mogu postavljati oglase." }, { status: 403 });

  const formData = await req.formData();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? "";
  const priceRaw = formData.get("price") as string;
  const category = (formData.get("category") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() ?? "";

  if (!title || title.length < 3)
    return NextResponse.json({ error: "Naslov mora imati najmanje 3 karaktera." }, { status: 400 });
  // Gornje granice dužine — sprečavaju bujanje baze i predimenzioniran javni odgovor.
  if (title.length > 120)
    return NextResponse.json({ error: "Naslov može imati najviše 120 karaktera." }, { status: 400 });
  if (description.length > 4000)
    return NextResponse.json({ error: "Opis može imati najviše 4000 karaktera." }, { status: 400 });
  if (location.length > 80)
    return NextResponse.json({ error: "Lokacija može imati najviše 80 karaktera." }, { status: 400 });
  if (phone.length > 40)
    return NextResponse.json({ error: "Telefon može imati najviše 40 karaktera." }, { status: 400 });
  if (!priceRaw || isNaN(Number(priceRaw)) || Number(priceRaw) <= 0)
    return NextResponse.json({ error: "Cena mora biti pozitivan ceo broj." }, { status: 400 });
  const price = Math.floor(Number(priceRaw));
  if (price > 1_000_000_000)
    return NextResponse.json({ error: "Cena je neuobičajeno velika." }, { status: 400 });
  if (!KATEGORIJE.includes(category))
    return NextResponse.json({ error: "Neispravna kategorija." }, { status: 400 });

  // Slike
  const imageFiles: File[] = [];
  for (let i = 0; i < MAX_IMAGES; i++) {
    const file = formData.get(`slika_${i}`) as File | null;
    if (file && file.size > 0) imageFiles.push(file);
  }
  for (const file of imageFiles) {
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "Svaka slika može biti najviše 5MB." }, { status: 400 });
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type))
      return NextResponse.json({ error: "Dozvoljeni formati: JPG, PNG, WebP." }, { status: 400 });
  }

  const listingId = randomUUID();
  const imagePaths: string[] = [];

  if (imageFiles.length > 0) {
    // Cloudflare R2 u produkciji (read-only/efemeran FS na serverless),
    // fallback na lokalni disk za dev kad R2 nije konfigurisan.
    const useR2 = r2Konfigurisan();
    let dir: string | null = null;
    if (!useR2) {
      dir = path.join(process.cwd(), "storage", "oglasi", listingId);
      await mkdir(dir, { recursive: true });
    }
    for (const file of imageFiles) {
      const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
      const fname = `${randomUUID()}${ext}`;
      if (useR2) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await sacuvajNaR2(`oglasi/${listingId}/${fname}`, buffer, file.type);
        imagePaths.push(url);
      } else {
        await writeFile(path.join(dir!, fname), Buffer.from(await file.arrayBuffer()));
        imagePaths.push(`storage/oglasi/${listingId}/${fname}`);
      }
    }
  }

  const listing = await prisma.marketplaceListing.create({
    data: {
      id: listingId,
      sellerId: session.user.id,
      title,
      description,
      price,
      category,
      images: imagePaths,
      location: location || null,
      phone: phone || null,
    },
  });

  return NextResponse.json({ id: listing.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/pijaca]", err);
    return NextResponse.json({ error: `Interna greška: ${msg}` }, { status: 500 });
  }
}
