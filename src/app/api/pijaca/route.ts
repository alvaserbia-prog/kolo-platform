import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sacuvajNaR2, r2Konfigurisan } from "@/lib/skladiste";
import { MAX_PO_SLICI, MAX_SLIKA, MAX_UKUPNO, ukupnaVelicina } from "@/lib/slika-upload";
import { parsirajCenu } from "@/lib/cena-oglas";
import { jeKategorija, parsirajKatParam } from "@/lib/kategorije";
import { emitujNoviOglas } from "@/lib/oglas-dogadjaji";
import { razresiNaselje, PORUKA_MESTO_IZ_SPISKA } from "@/lib/naselje";
import { smeDaPostaviOglas, zabeleziDoprinos } from "@/lib/protokol/doprinos-sadrzaju";
import { javiRoditeljimaZaOglas } from "@/lib/protokol/deca";
import { probajNapredovati } from "@/lib/protokol/doprinos-razmeni";
import { nalogRadi, stanjeNaloga, ucitajUcesnika, usloviVidljivostiOglasa } from "@/lib/protokol/deca";
import { PORUKA_CEKA_RODITELJA } from "@/lib/deca-pravila";
import { smeProsireno } from "@/lib/dozvole";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_IMAGES = MAX_SLIKA;
const MAX_SIZE = MAX_PO_SLICI;

// GET /api/pijaca — lista aktivnih oglasa
//
// Ruta je otvorena i neprijavljenom posetiocu, pa je vidljivost dečjih oglasa
// (Pravilnik o Modulu Deca, čl. 13) morala da uđe upravo ovde: gost nikada ne vidi
// oglas maloletnog korisnika, punoletni ga vidi uz saglasnost roditelja, a dete
// vidi oglase druge dece uvek.
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const session = await getServerSession(authOptions);
  const posmatrac = session ? await ucitajUcesnika(session.user.id) : null;
  // Multi-select kategorije (OR): ?kat=slug1,slug2. Legacy parametar
  // `kategorija` (jedna vrednost) i dalje radi.
  const kategorije = parsirajKatParam(searchParams.get("kat") ?? searchParams.get("kategorija"));
  const pretraga = searchParams.get("q") ?? "";
  const sortiranje = searchParams.get("sort") ?? "novo";
  const minCena = parseInt(searchParams.get("min") ?? "0") || 0;
  const maxCena = parseInt(searchParams.get("max") ?? "0") || 0;
  const tip = (searchParams.get("tip") ?? "").toUpperCase();

  const where: Record<string, unknown> = {
    status: "ACTIVE",
    seller: usloviVidljivostiOglasa(posmatrac),
  };
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
      seller: { select: { pseudonim: true, verified: true, maloletan: true } },
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
    return await greska("Naslov mora imati najmanje 3 znaka.", 400);
  // Gornje granice dužine — sprečavaju bujanje baze i predimenzioniran javni odgovor.
  if (title.length > 120)
    return await greska("Naslov može imati najviše 120 znakova.", 400);
  if (description.length > 4000)
    return await greska("Opis može imati najviše 4000 znakova.", 400);
  if (location.length > 80)
    return await greska("Lokacija može imati najviše 80 znakova.", 400);
  // Lokacija oglasa je opciona, ali kad se navede mora biti JEDNO naselje iz
  // šifarnika — po njoj se filtrira Pijaca i računa udaljenost do posmatrača.
  const mesto = location ? razresiNaselje(location) : null;
  if (location && !mesto)
    return await greska(PORUKA_MESTO_IZ_SPISKA, 400);
  if (phone.length > 40)
    return await greska("Telefon može imati najviše 40 znakova.", 400);
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
    // 🔴 Poruka NAMERNO imenuje HEIC. Polje za izbor stoji na `image/*`, pa
    // telefon ponudi i format koji ovde ne prolazi; bez te reči čovek dobija
    // spisak dozvoljenih formata a ne zna u koji od njih je upao.
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type))
      return await greska(
        "Slika mora biti JPG, PNG ili WebP. Fotografiju sa iPhone-a (HEIC) sačuvaj kao JPG.",
        400,
      );
  }
  // Zbir se proverava i ovde, iako ga ekran već meri: platforma odbija preveliko
  // telo pre rute, pa ova provera hvata samo pozive mimo ekrana — ali tada vraća
  // rečenicu umesto praznog odgovora.
  if (ukupnaVelicina(imageFiles) > MAX_UKUPNO)
    return await greska("Slike su prevelike za jedno slanje. Ukloni jednu ili pošalji manje fotografije.", 413);

  // Prava objave se čitaju IZ BAZE, ne iz sesije: `verified` u tokenu se osvežava
  // sa zakašnjenjem, pa bi tek verifikovan korisnik još neko vreme dobijao pravila
  // za neverifikovane (limit od tri oglasa, zabrana potražnje).
  const korisnik = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verified: true, maloletan: true, identitetUtvrdjenAt: true },
  });
  if (!korisnik) return await greska("Nalog ne postoji.", 401);

  // 🔴 Za oglas maloletnog korisnika važe ISTI uslovi objave kao za svaki drugi
  // oglas — razlikuje se samo vidljivost (Modul Deca, čl. 13 st. 1). Ograničenja
  // za nepotvrđen nalog (samo ponuda, najviše tri, sadržinski minimum) postoje
  // zbog naloga iza kog niko ne stoji; iza deteta stoje roditelj i svi koji su
  // roditelja potvrdili, pa se na njega ne primenjuju.
  //
  // Ovim se ništa ne zaobilazi: nalog detetu otvara samo potvrđen korisnik (čl. 5),
  // a on ni sam ta ograničenja nema.
  // R-01, mera M-9: isto važi i za člana čiji je identitet utvrđen na
  // donatorskom putu — iza njegovog naloga stoji identitet koji je banka već
  // identifikovala, pa ograničenja pisana za nalog iza kog ne stoji niko
  // (samo ponuda, najviše tri, sadržinski minimum) nemaju predmet.
  const punaPravaObjave =
    smeProsireno({ verified: korisnik.verified, identitetUtvrdjen: korisnik.identitetUtvrdjenAt !== null }) ||
    korisnik.maloletan;

  // Nalog koji još čeka roditelja (Modul Deca, čl. 4c) ne objavljuje. Dete na
  // čekanju ima profil, skenira QR kodove i sklapa prijateljstva — ništa više;
  // iza njega još ne stoji nijedan odrastao čovek koji je sam prošao registraciju.
  if (!nalogRadi(await stanjeNaloga(session.user.id))) {
    return await greska(PORUKA_CEKA_RODITELJA, 403);
  }

  const brojAktivnihOglasa = punaPravaObjave
    ? 0
    : await prisma.marketplaceListing.count({
        where: { sellerId: session.user.id, status: "ACTIVE" },
      });

  // Provera se radi PRE slanja slika na R2 — odbijen oglas ne sme da ostavi
  // datoteke za sobom.
  const oglasZaProveru = {
    tip,
    title,
    description,
    category,
    location: mesto,
    images: imageFiles.map((_, i) => String(i)),
  };
  const smem = smeDaPostaviOglas({
    verifikovan: punaPravaObjave,
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
    // Na serverless-u je datotečni sistem samo za čitanje, pa bi zapis na disk
    // pukao sa EROFS i stigao do korisnika kao „Interna greška". Kad skladište
    // nije podešeno, to se kaže odmah i imenom.
    if (!useR2 && process.env.VERCEL)
      return await greska("Skladište slika nije konfigurisano (Cloudflare R2).", 503);
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

  // Doprinos sadržaju platforme (čl. 40a) — 1.000 POEN za PRVU ponudu koja ispunjava
  // sadržinski minimum. Od 2026-08-11 se evidentira ODMAH, i korisniku čija stvarnost
  // još nije potvrđena; ranije je njemu samo beležen i čekao je okidač.
  await zabeleziDoprinos(session.user.id, { id: listing.id, ...oglasZaProveru, images: imagePaths });

  // Nov oglas pomera brojač koraka 3 na putanji doprinosa razmeni (čl. 40a).
  // Sekvencijalno i van transakcije — vodi u sopstvenu emisiju. Ne baca.
  await probajNapredovati(session.user.id);

  // 🔴 Oglas maloletnog naloga: javi roditelju (Modul Deca, čl. 10 st. 6; R-07 M-5″).
  // Roditelj odgovara za sadržaj koji je dete objavilo DO TRENUTKA UKLANJANJA, a taj
  // oglas vide pretežno ili isključivo druga deca — on je jedini odrastao koji ga
  // uopšte vidi. Bez obaveštenja je odredba neizvodljiva. Ne baca.
  if (korisnik.maloletan) {
    await javiRoditeljimaZaOglas(session.user.id, { id: listing.id, title });
  }

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
