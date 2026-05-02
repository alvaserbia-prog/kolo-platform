import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/chat — poslednje poruke (samo prijavljeni)
// Query: ?since=ISO-datum (opciono) — vraća samo poruke nakon datog vremena
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Pristup samo za prijavljene." }, { status: 401 });
  }

  const url = new URL(req.url);
  const since = url.searchParams.get("since");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "100"), 200);

  const where = since ? { createdAt: { gt: new Date(since) } } : {};
  const poruke = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, pseudonim: true, verified: true } } },
  });

  return NextResponse.json(
    poruke
      .map((p) => ({
        id: p.id,
        userId: p.user.id,
        pseudonim: p.user.pseudonim,
        verified: p.user.verified,
        content: p.content,
        createdAt: p.createdAt.toISOString(),
      }))
      .reverse()
  );
}

// POST /api/chat — slanje poruke (samo verifikovani)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Pristup samo za prijavljene." }, { status: 401 });
  }
  if (!session.user.verified) {
    return NextResponse.json(
      { error: "Pisanje u chat sobu je dostupno samo verifikovanim članovima." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const content = (body.content ?? "").toString().trim();

  if (!content) {
    return NextResponse.json({ error: "Poruka ne sme biti prazna." }, { status: 400 });
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: "Poruka najviše 1000 znakova." }, { status: 400 });
  }

  const poruka = await prisma.chatMessage.create({
    data: {
      userId: session.user.id,
      content,
    },
    include: { user: { select: { id: true, pseudonim: true, verified: true } } },
  });

  return NextResponse.json({
    ok: true,
    poruka: {
      id: poruka.id,
      userId: poruka.user.id,
      pseudonim: poruka.user.pseudonim,
      verified: poruka.user.verified,
      content: poruka.content,
      createdAt: poruka.createdAt.toISOString(),
    },
  });
}
