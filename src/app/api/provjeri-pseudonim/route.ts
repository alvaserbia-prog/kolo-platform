import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const pseudonim = req.nextUrl.searchParams.get("p")?.trim();
  if (!pseudonim || pseudonim.length < 3) {
    return NextResponse.json({ slobodan: false, greska: "Minimum 3 karaktera" });
  }
  const postoji = await prisma.user.findUnique({
    where: { pseudonim },
    select: { id: true },
  });
  return NextResponse.json({ slobodan: !postoji });
}
