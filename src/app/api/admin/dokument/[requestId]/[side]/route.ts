import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

// GET /api/admin/dokument/[requestId]/[side]
// Vraća base64 sliku dokumenta (front | back) za admin pregled
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string; side: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { requestId, side } = await params;
  if (side !== "front" && side !== "back") {
    return NextResponse.json({ error: "Nevalidan parametar." }, { status: 400 });
  }

  const vr = await prisma.verificationRequest.findUnique({
    where: { id: requestId },
    select: { idFrontPath: true, idBackPath: true, userId: true },
  });

  if (!vr) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });

  const base64 = side === "front" ? vr.idFrontPath : vr.idBackPath;
  if (!base64) return NextResponse.json({ error: "Slika nije dostupna." }, { status: 404 });

  await logAdminAkcija(
    session.user.id,
    "PRISTUP_DOKUMENT_LK",
    vr.userId,
    `Pregled ${side === "front" ? "prednje" : "zadnje"} strane dokumenta`
  );

  // base64 string može biti "data:image/jpeg;base64,..." ili čist base64
  if (base64.startsWith("data:")) {
    const [meta, data] = base64.split(",");
    const mimeMatch = meta.match(/data:([^;]+);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const buffer = Buffer.from(data, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "no-store",
      },
    });
  }

  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "no-store",
    },
  });
}
