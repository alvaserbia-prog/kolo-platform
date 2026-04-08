import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string; side: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Pristup odbijen", { status: 403 });
  }

  const { requestId, side } = await params;

  if (side !== "front" && side !== "back") {
    return new NextResponse("Nepoznata strana", { status: 400 });
  }

  const vr = await prisma.verificationRequest.findUnique({ where: { id: requestId } });
  if (!vr) return new NextResponse("Nije pronađeno", { status: 404 });

  const filePath = side === "front" ? vr.idFrontPath : vr.idBackPath;

  try {
    const absPath = path.join(process.cwd(), filePath);
    const fileBuffer = await readFile(absPath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" :
      ext === ".webp" ? "image/webp" :
      "image/jpeg";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Fajl nije pronađen", { status: 404 });
  }
}
