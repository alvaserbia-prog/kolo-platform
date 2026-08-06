import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/chat — poslednje poruke (samo prijavljeni)
// Query: ?since=ISO-datum (opciono) — vraća samo poruke nakon datog vremena
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return await greska("Pristup samo za prijavljene.", 401);
  }

  const url = new URL(req.url);
  const since = url.searchParams.get("since");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "100"), 200);

  // Uklonjene poruke (Uslovi čl. 25 st. 2) nestaju iz sobe za sve — i za autora.
  const where = {
    uklonjenoAt: null,
    ...(since ? { createdAt: { gt: new Date(since) } } : {}),
  };
  const poruke = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, pseudonim: true, verified: true, avatar: true } } },
  });

  return NextResponse.json(
    poruke
      .map((p) => ({
        id: p.id,
        userId: p.user.id,
        pseudonim: p.user.pseudonim,
        verified: p.user.verified,
        avatar: p.user.avatar,
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
    return await greska("Pristup samo za prijavljene.", 401);
  }
  if (!session.user.verified) {
    return await greska("Pisanje u pričaonicu je dostupno samo verifikovanim članovima.", 403);
  }

  const body = await req.json();
  const content = (body.content ?? "").toString().trim();

  if (!content) {
    return await greska("Poruka ne sme biti prazna.", 400);
  }
  if (content.length > 1000) {
    return await greska("Poruka najviše 1000 znakova.", 400);
  }

  const poruka = await prisma.chatMessage.create({
    data: {
      userId: session.user.id,
      content,
    },
    include: { user: { select: { id: true, pseudonim: true, verified: true, avatar: true } } },
  });

  return NextResponse.json({
    ok: true,
    poruka: {
      id: poruka.id,
      userId: poruka.user.id,
      pseudonim: poruka.user.pseudonim,
      verified: poruka.user.verified,
      avatar: poruka.user.avatar,
      content: poruka.content,
      createdAt: poruka.createdAt.toISOString(),
    },
  });
}
