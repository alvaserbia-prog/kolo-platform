import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sacuvajNaR2, r2Konfigurisan } from "@/lib/skladiste";
import { parsirajCenu } from "@/lib/cena-oglas";
import { jeKategorija, parsirajKatParam } from "@/lib/kategorije";
import { emitujNoviOglas } from "@/lib/oglas-dogadjaji";
import { razresiNaselje, PORUKA_MESTO_IZ_SPISKA } from "@/lib/naselje";
import { smeDaPostaviOglas, zabeleziDoprinos } from "@/lib/protokol/doprinos-sadrzaju";
import { probajNapredovati } from "@/lib/protokol/doprinos-razmeni";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

// GET /api/pijaca — lista aktivnih oglasa
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  // Multi-select kategorije (OR): ?kat=slug1,slug2. Legacy parametar
  // `kategorija` (jedna vrednost) i dalje radi.
  const kategorije = parsirajKatParam(searchParams.get("kat") ?? searchParams.get("kategorija"));
  const pretraga = searchParams.get("q") ?? "";
  const sortiranje = searchParams.get("sort") ?? "novo";
  const minCena = parseInt(searchParams.get("min") ?? "0") || 0;
  const maxCena = parseInt(searchParams.get("max") ?? "0") || 0;
  const tip = (searchParams.get("tip") ?? "").toUpperCase();

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (tip === "PONUDA" || tip === "POTRAZNJA") where.tip = tip;
  if (kategorije.length > 0) where.category = { in: kategorije };
  if (pretraga) where.title = { contains: pretraga, mode: "insensitive" };
  if (minCena > 0 || maxCena > 0) {
    where.price = {};
    if (minCena > 0) (where.price as Record<string, number>).gte = minCena;
    if (maxCena > 0) (where.price as Record<string, number>).lte = maxCena;
  }

  // „Po dogovoru" oglasi (price = null) uvek idu na kraj pri sortiranju po ceni.
  const orderBy =
    sortiranje === "jeftino" ? { price: { sort: "asc" as const, nulls: "last" as const } } :
    sortiranje === "skupo"   ? { price: { sort: "desc" as const, nulls: "last" as const } } :
                               { createdAt: "desc" as const };

  const listings = await prisma.marketplaceListing.findMany({
    where,
    orderBy,
    take: 60,
    select: {
      id: true, title: true, description: true, tip: true,
      cenaTip: true, price: true, cenaDo: true,
      category: true, images: true, location: true, createdAt: true,
      seller: { select: { pseudonim: true, verified: true } },
    },
  });

  return NextResponse.json({ listings });
}

// POST /api/pijaca — kreiraj oglas
//
// Otvoreno i neverifikovanom korisniku (Pravilnik 4.1.1 čl. 16 st. 5, čl. 28 st. 2),
// ali samo za PONUDU, uz sadržinski minimum i najviše tri aktivna oglasa. Prvi takav
// oglas mu beleži doprinos sadržaju platforme (čl. 40a) — doprinos se BELEŽI ovde, a
// evidentira tek kad ga neko verifikuje ili mu upiše POEN.
export async function POST(req: NextRequest) {
  try {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const formData = await req.formData();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? "";
  const priceRaw = formData.get("price") as string;
  const cenaDoRaw = formData.get("cenaDo") as string;
  const cenaTipRaw = formData.get("cenaTip") as string;
  const tip = ((formData.get("tip") as string) ?? "PONUDA").toUpperCase() === "POTRAZNJA" ? "POTRAZNJA" : "PONUDA";
  const category = (formData.get("category") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() ?? "";

  if (!title || title.length < 3)
    return await greska("Naslov mora imati najmanje 3 karaktera.", 400);
  // Gornje granice dužine — sprečavaju bujanje baze i predimenzioniran javni odgovor.
  if (title.length > 120)
    return await greska("Naslov može imati najviše 120 karaktera.", 400);
  if (description.length > 4000)
    return await greska("Opis može imati najviše 4000 karaktera.", 400);
  if (location.length > 80)
    return await greska("Lokacija može imati najviše 80 karaktera.", 400);
  // Lokacija oglasa je opciona, ali kad se navede mora biti JEDNO naselje iz
  // šifarnika — po njoj se filtrira Pijaca i računa udaljenost do posmatrača.
  const mesto = location ? razresiNaselje(location) : null;
  if (location && !mesto)
    return await greska(PORUKA_MESTO_IZ_SPISKA, 400);
  if (phone.length > 40)
    return await greska("Telefon može imati najviše 40 karaktera.", 400);
  // Kod potražnje budžet se uvek dogovara — cena se ne unosi (uvek DOGOVOR).
  const cena = tip === "POTRAZNJA"
    ? { ok: true as const, cenaTip: "DOGOVOR" as const, price: null, cenaDo: null }
    : parsirajCenu(cenaTipRaw, priceRaw, cenaDoRaw);
  if (!cena.ok)
    return await greska(cena.error, 400);
  // Serverska validacija: kategorija mora biti jedan od 13 slugova.
  if (!category || !jeKategorija(category))
    return await greska("Neispravna kategorija.", 400);

  // Slike
  const imageFiles: File[] = [];
  for (let i = 0; i < MAX_IMAGES; i++) {
    const file = formData.get(`slika_${i}`) as File | null;
    if (file && file.size > 0) imageFiles.push(file);
  }
  for (const file of imageFiles) {
    if (file.size > MAX_SIZE)
      return await greska("Svaka slika može biti najviše 5MB.", 400);
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type))
      return await greska("Dozvoljeni formati: JPG, PNG, WebP.", 400);
  }

  // Prava objave se čitaju IZ BAZE, ne iz sesije: `verified` u tokenu se osvežava
  // sa zakašnjenjem, pa bi tek verifikovan korisnik još neko vreme dobijao pravila
  // za neverifikovane (limit od tri oglasa, zabrana potražnje).
  const korisnik = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verified: true },
  });
  if (!korisnik) return await greska("Nalog ne postoji.", 401);

  const brojAktivnihOglasa = korisnik.verified
    ? 0
    : await prisma.marketplaceListing.count({
        where: { sellerId: session.user.id, status: "ACTIVE" },
      });

  // Provera se radi PRE slanja slika na R2 — odbijen oglas ne sme da ostavi
  // datoteke za sobom.
  const oglasZaProveru = {
    tip,
    description,
    category,
    location: mesto,
    images: imageFiles.map((_, i) => String(i)),
  };
  const smem = smeDaPostaviOglas({
    verifikovan: korisnik.verified,
    brojAktivnihOglasa,
    oglas: oglasZaProveru,
  });
  if (!smem.ok) return await greska(smem.razlog, smem.status);

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
      tip,
      title,
      description,
      cenaTip: cena.cenaTip,
      price: cena.price,
      cenaDo: cena.cenaDo,
      category,
      images: imagePaths,
      location: mesto,
      phone: phone || null,
    },
  });

  // Doprinos sadržaju platforme (čl. 40a). Beleži se za PRVU ponudu koja ispunjava
  // sadržinski minimum — i verifikovanom i neverifikovanom korisniku. Do okidača
  // (verifikacija ili primljen POEN) to NIJE zapis POEN-a: ništa se ne emituje, ni
  // opticaj ni ijedan sistemski prag se ne pomera.
  await zabeleziDoprinos(session.user.id, { id: listing.id, ...oglasZaProveru, images: imagePaths });

  // Nov oglas pomera brojač koraka 3 na putanji doprinosa razmeni (čl. 40a).
  // Sekvencijalno i van transakcije — vodi u sopstvenu emisiju. Ne baca.
  await probajNapredovati(session.user.id);

  // Obavesti korisnike koji prate ovu kategoriju. Ne sme da obori objavu oglasa
  // ako pukne — oglas je već upisan.
  await emitujNoviOglas({
    listingId: listing.id,
    category,
    sellerId: session.user.id,
    naslov: title,
    tip,
  }).catch((e) => console.error("[POST /api/pijaca] obaveštenja", e));

  return NextResponse.json({ id: listing.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/pijaca]", err);
    return await greska(`Interna greška: ${msg}`, 500);
  }
}
