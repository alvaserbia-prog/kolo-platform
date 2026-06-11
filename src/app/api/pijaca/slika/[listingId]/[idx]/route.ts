import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

// GET /api/pijaca/slika/[listingId]/[idx] — sluzi sliku oglasa (javno)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ listingId: string; idx: string }> }
) {
  const { listingId, idx } = await params;
  const index = parseInt(idx);

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
    select: { images: true },
  });

  if (!listing || isNaN(index) || index < 0 || index >= listing.images.length) {
    return new NextResponse("Nije pronađeno", { status: 404 });
  }

  const filePath = listing.images[index];

  // Vercel Blob (ili bilo koji apsolutni URL) — preusmeri na CDN.
  if (/^https?:\/\//i.test(filePath)) {
    return NextResponse.redirect(filePath, 308);
  }

  // Legacy: slika na lokalnom disku (dev).
  try {
    const absPath = path.join(process.cwd(), filePath);
    const buffer = await readFile(absPath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" :
      ext === ".webp" ? "image/webp" : "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Fajl nije pronađen", { status: 404 });
  }
}
