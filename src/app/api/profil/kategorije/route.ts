import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeKategorija } from "@/lib/kategorije";

// GET /api/profil/kategorije — kategorije Pijace koje korisnik prati
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const pracene = await prisma.followedCategory.findMany({
    where: { userId: session.user.id },
    select: { category: true },
  });

  return NextResponse.json({ kategorije: pracene.map((p) => p.category) });
}

// POST /api/profil/kategorije — prati/otprati kategoriju { category, prati }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  let body: { category?: string; prati?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const { category, prati } = body;
  if (!category || !jeKategorija(category) || typeof prati !== "boolean")
    return NextResponse.json({ error: "Neispravna kategorija." }, { status: 400 });

  if (prati) {
    // Idempotentno: ponovno praćenje već praćene kategorije nije greška.
    await prisma.followedCategory.upsert({
      where: { userId_category: { userId: session.user.id, category } },
      create: { userId: session.user.id, category },
      update: {},
    });
  } else {
    await prisma.followedCategory.deleteMany({
      where: { userId: session.user.id, category },
    });
  }

  return NextResponse.json({ ok: true });
}
