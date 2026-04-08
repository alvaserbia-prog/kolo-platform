import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

// GET /api/pijaca/[id] — jedan oglas
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: {
      seller: { select: { pseudonim: true, verified: true } },
    },
  });
  if (!listing) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  return NextResponse.json({ listing });
}

// PATCH /api/pijaca/[id] — uredi ili deaktiviraj oglas (samo prodavac)
// Prima multipart/form-data ili application/json (za deaktivaciju)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id } = await params;
  const listing = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  if (listing.sellerId !== session.user.id)
    return NextResponse.json({ error: "Nemaš pravo da menjaš ovaj oglas." }, { status: 403 });
  if (listing.status !== "ACTIVE")
    return NextResponse.json({ error: "Oglas nije aktivan." }, { status: 400 });

  const contentType = req.headers.get("content-type") ?? "";

  // Deaktivacija dolazi kao JSON
  if (contentType.includes("application/json")) {
    const body = await req.json();
    if (body.akcija === "deaktiviraj") {
      await prisma.marketplaceListing.update({ where: { id }, data: { status: "EXPIRED" } });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Nepoznata akcija." }, { status: 400 });
  }

  // Izmena oglasa dolazi kao multipart/form-data
  try {
    const fd = await req.formData();

    const title = (fd.get("title") as string)?.trim();
    const description = (fd.get("description") as string)?.trim() ?? "";
    const priceRaw = fd.get("price") as string;
    const location = (fd.get("location") as string)?.trim() ?? "";
    const phone = (fd.get("phone") as string)?.trim() ?? "";
    const keepRaw = (fd.get("keepImages") as string) ?? "[]";

    if (!title || title.length < 3)
      return NextResponse.json({ error: "Naslov mora imati najmanje 3 karaktera." }, { status: 400 });
    const price = Math.floor(Number(priceRaw));
    if (isNaN(price) || price <= 0)
      return NextResponse.json({ error: "Cena mora biti pozitivan broj." }, { status: 400 });

    // keepImages — niz indeksa postojećih slika koje treba zadržati
    const keepIndices: number[] = JSON.parse(keepRaw);
    const zadrzaneSlike = listing.images.filter((_, i) => keepIndices.includes(i));

    // Nove slike
    const noveSlike: string[] = [];
    const ukupno = zadrzaneSlike.length;
    for (let i = 0; i < MAX_IMAGES - ukupno; i++) {
      const file = fd.get(`nova_slika_${i}`) as File | null;
      if (!file || file.size === 0) continue;
      if (file.size > MAX_SIZE)
        return NextResponse.json({ error: "Slika je prevelika (max 5MB)." }, { status: 400 });
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type))
        return NextResponse.json({ error: "Dozvoljeni formati: JPG, PNG, WebP." }, { status: 400 });

      const dir = path.join(process.cwd(), "storage", "oglasi", id);
      await mkdir(dir, { recursive: true });
      const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
      const fname = `${randomUUID()}${ext}`;
      await writeFile(path.join(dir, fname), Buffer.from(await file.arrayBuffer()));
      noveSlike.push(`storage/oglasi/${id}/${fname}`);
    }

    await prisma.marketplaceListing.update({
      where: { id },
      data: {
        title,
        description,
        price,
        location: location || null,
        phone: phone || null,
        images: [...zadrzaneSlike, ...noveSlike],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/pijaca/[id]]", err);
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
