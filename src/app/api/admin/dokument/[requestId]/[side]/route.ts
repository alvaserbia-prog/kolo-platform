import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

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

  // Audit log: admin je pristupio dokumentu za verifikaciju (lk/JMBG)
  await logAdminAkcija(
    session.user.id,
    "PRISTUP_DOKUMENT_VERIFIKACIJA",
    vr.userId,
    `Strana: ${side}, zahtevId: ${requestId}`
  );

  const dataUrl = side === "front" ? vr.idFrontPath : vr.idBackPath;
  if (!dataUrl) return new NextResponse("Dokument nije uploadovan (ručna verifikacija)", { status: 404 });

  // Podrška za base64 data URL format: "data:<mime>;base64,<data>"
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return new NextResponse("Neispravan format dokumenta", { status: 500 });

  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
