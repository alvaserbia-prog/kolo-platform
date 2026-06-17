import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validanPseudonim } from "@/lib/validacija";

export async function GET(req: NextRequest) {
  const pseudonim = req.nextUrl.searchParams.get("p")?.trim();
  if (!validanPseudonim(pseudonim)) {
    return NextResponse.json({ slobodan: false, greska: "Dozvoljeni znakovi: slova, brojevi, razmak, _ . - (3–30)" });
  }
  const postoji = await prisma.user.findUnique({
    where: { pseudonim },
    select: { id: true },
  });
  return NextResponse.json({ slobodan: !postoji });
}
