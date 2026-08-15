import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sacuvajNaR2, obrisiSaR2, r2Konfigurisan } from "@/lib/skladiste";
import { parsirajCenu } from "@/lib/cena-oglas";
import { razresiNaselje, PORUKA_MESTO_IZ_SPISKA } from "@/lib/naselje";
import { oglasIspunjavaMinimum } from "@/lib/protokol/doprinos-sadrzaju";
import { smeDaVidiOglas, ucitajUcesnika } from "@/lib/protokol/deca";
import { jeAdmin } from "@/lib/dozvole";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

// GET /api/pijaca/[id] — jedan oglas
// Pregled oglasa je javan (Pravilnik čl. 16), ali kontakt oglašivača (telefon)
// vidi samo verifikovani korisnik.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          pseudonim: true,
          verified: true,
          id: true,
          maloletan: true,
          dozvolaOdrasli: true,
          roditeljId: true,
        },
      },
    },
  });
  if (!listing) return await greska("Oglas nije pronađen.", 404);

  // Vidljivost oglasa maloletnog korisnika (Modul Deca, čl. 13).
  //
  // 🔴 404, ne 403: status 403 bi potvrdio da oglas postoji, a time i da postoji
  // dete koje ga je objavilo — što je upravo ono što se skriva.
  const posmatrac = session ? await ucitajUcesnika(session.user.id) : null;
  const smem = smeDaVidiOglas(
    posmatrac ? { ...posmatrac, admin: jeAdmin(session?.user) } : null,
    listing.seller,
  );
  if (!smem) return await greska("Oglas nije pronađen.", 404);

  // Trag uklanjanja se ne prosipa u javni odgovor: razlog je saopštenje vlasniku
  // (Uslovi čl. 25 st. 2), a ne podatak o kom se obaveštava svet. `uklonioId`
  // ne izlazi nikome — ko je odlučio je stvar audit loga, ne javnog API-ja.
  const { uklonjenRazlog, uklonioId: _uklonioId, seller: _seller, ...javno } = listing;
  const jeVlasnik = listing.sellerId === session?.user?.id;

  return NextResponse.json({
    listing: {
      ...javno,
      // Prodavac se sastavlja izričito: `...listing` bi prosuo `roditeljId` i stanje
      // prekidača iz čl. 10, koji nikoga sa strane ne zanimaju i ne smeju napolje.
      seller: {
        pseudonim: listing.seller.pseudonim,
        verified: listing.seller.verified,
        maloletan: listing.seller.maloletan,
      },
      phone: session?.user?.verified ? listing.phone : null,
      uklonjenRazlog: jeVlasnik ? uklonjenRazlog : null,
    },
  });
}

// PATCH /api/pijaca/[id] — uredi ili deaktiviraj oglas (samo prodavac)
// Prima multipart/form-data ili application/json (za deaktivaciju)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const { id } = await params;
  const listing = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!listing) return await greska("Oglas nije pronađen.", 404);
  if (listing.sellerId !== session.user.id)
    return await greska("Nemaš pravo da menjaš ovaj oglas.", 403);
  if (listing.status !== "ACTIVE")
    return await greska("Oglas nije aktivan.", 400);

  const contentType = req.headers.get("content-type") ?? "";

  // Deaktivacija dolazi kao JSON
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.akcija === "deaktiviraj") {
      await prisma.marketplaceListing.update({ where: { id }, data: { status: "EXPIRED" } });
      return NextResponse.json({ ok: true });
    }
    return await greska("Nepoznata akcija.", 400);
  }

  // Izmena oglasa dolazi kao multipart/form-data
  try {
    const fd = await req.formData();

    const title = (fd.get("title") as string)?.trim();
    const description = (fd.get("description") as string)?.trim() ?? "";
    const priceRaw = fd.get("price") as string;
    const cenaDoRaw = fd.get("cenaDo") as string;
    const cenaTipRaw = fd.get("cenaTip") as string;
    const location = (fd.get("location") as string)?.trim() ?? "";
    const phone = (fd.get("phone") as string)?.trim() ?? "";
    const keepRaw = (fd.get("keepImages") as string) ?? "[]";

    if (!title || title.length < 3)
      return await greska("Naslov mora imati najmanje 3 karaktera.", 400);
    if (title.length > 120 || description.length > 4000 || location.length > 80 || phone.length > 40)
      return await greska("Neko polje premašuje dozvoljenu dužinu.", 400);
    // Novo mesto mora biti JEDNO naselje iz šifarnika; zatečena vrednost oglasa
    // upisanog dok je polje bilo slobodan tekst se propušta neizmenjena, da izmena
    // cene ili slika ne padne zbog stare lokacije.
    let mesto: string | null = null;
    if (location) {
      mesto = location === listing.location ? location : razresiNaselje(location);
      if (!mesto) return await greska(PORUKA_MESTO_IZ_SPISKA, 400);
    }
    const cena = parsirajCenu(cenaTipRaw, priceRaw, cenaDoRaw);
    if (!cena.ok)
      return await greska(cena.error, 400);

    // keepImages — niz indeksa postojećih slika koje treba zadržati. Validiramo da je
    // zaista niz brojeva (ne pada na neispravnom JSON-u, ne prihvata ne-niz vrednosti).
    let keepParsed: unknown;
    try { keepParsed = JSON.parse(keepRaw); } catch { keepParsed = []; }
    const keepIndices: number[] = Array.isArray(keepParsed)
      ? keepParsed.filter((x): x is number => Number.isInteger(x))
      : [];
    const zadrzaneSlike = listing.images.filter((_, i) => keepIndices.includes(i));
    const uklonjeneSlike = listing.images.filter((_, i) => !keepIndices.includes(i));

    // Neverifikovanom oglašivaču sadržinski minimum važi i pri IZMENI, ne samo pri
    // objavi — inače bi se zaobišao u dva poteza: objavi pun oglas, pa mu skini
    // slike i skrati opis. Proverava se PRE slanja na R2, da odbijena izmena ne
    // ostavi datoteke za sobom. (Smer oglasa se ovom rutom uopšte ne menja, pa
    // neverifikovani ne može ni da prebaci sopstvenu ponudu u potražnju.)
    const ukupno = zadrzaneSlike.length;
    const brojNovih = Array.from({ length: MAX_IMAGES - ukupno }, (_, i) =>
      fd.get(`nova_slika_${i}`) as File | null,
    ).filter((f) => f && f.size > 0).length;

    const vlasnik = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { verified: true, maloletan: true },
    });
    // Sadržinski minimum se pri IZMENI proverava iz istog razloga iz kog i pri
    // objavi — inače se zaobilazi u dva poteza. Maloletni korisnik je iz njega
    // izuzet kao i potvrđeni (Modul Deca, čl. 13 st. 1: isti uslovi objave,
    // razlikuje se samo vidljivost).
    if (!vlasnik?.verified && !vlasnik?.maloletan) {
      const minimum = oglasIspunjavaMinimum({
        tip: listing.tip,
        title,
        description,
        category: listing.category,
        location: mesto,
        images: Array(ukupno + brojNovih).fill(""),
      });
      if (!minimum.ok) return await greska(minimum.razlog, minimum.status);
    }

    // Nove slike — R2 u produkciji, fallback na lokalni disk za dev.
    const useR2 = r2Konfigurisan();
    const noveSlike: string[] = [];
    for (let i = 0; i < MAX_IMAGES - ukupno; i++) {
      const file = fd.get(`nova_slika_${i}`) as File | null;
      if (!file || file.size === 0) continue;
      if (file.size > MAX_SIZE)
        return await greska("Slika je prevelika (max 5MB).", 400);
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type))
        return await greska("Dozvoljeni formati: JPG, PNG, WebP.", 400);

      const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
      const fname = `${randomUUID()}${ext}`;
      if (useR2) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await sacuvajNaR2(`oglasi/${id}/${fname}`, buffer, file.type);
        noveSlike.push(url);
      } else {
        const dir = path.join(process.cwd(), "storage", "oglasi", id);
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, fname), Buffer.from(await file.arrayBuffer()));
        noveSlike.push(`storage/oglasi/${id}/${fname}`);
      }
    }

    // Best-effort brisanje uklonjenih slika sa R2 (legacy/lokalne se preskaču).
    for (const url of uklonjeneSlike) await obrisiSaR2(url);

    await prisma.marketplaceListing.update({
      where: { id },
      data: {
        title,
        description,
        cenaTip: cena.cenaTip,
        price: cena.price,
        cenaDo: cena.cenaDo,
        location: mesto,
        phone: phone || null,
        images: [...zadrzaneSlike, ...noveSlike],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/pijaca/[id]]", err);
    return await greska("Interna greška servera.", 500);
  }
}
