import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/admin/blog — kreira novu vest
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const body = await req.json();
  const title = (body.title ?? "").toString().trim();
  const content = (body.content ?? "").toString().trim();
  const publishedAtRaw = body.publishedAt;

  if (!title) {
    return NextResponse.json({ error: "Naslov je obavezan." }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "Naslov najviše 200 znakova." }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "Sadržaj je obavezan." }, { status: 400 });
  }
  if (content.length > 20000) {
    return NextResponse.json({ error: "Sadržaj najviše 20.000 znakova." }, { status: 400 });
  }

  let publishedAt: Date | undefined;
  if (publishedAtRaw) {
    const d = new Date(publishedAtRaw);
    if (isNaN(d.getTime())) {
      return NextResponse.json({ error: "Neispravan datum objave." }, { status: 400 });
    }
    publishedAt = d;
  }

  const objava = await prisma.blogPost.create({
    data: {
      title,
      content,
      authorId: session.user.id,
      ...(publishedAt ? { publishedAt } : {}),
    },
  });

  await logAdminAkcija(session.user.id, "BLOG_OBJAVA_KREIRANA", objava.id, title);

  return NextResponse.json({ ok: true, id: objava.id });
}

// GET /api/admin/blog — admin lista (sve objave)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const objave = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { pseudonim: true } } },
  });

  return NextResponse.json(
    objave.map((o) => ({
      id: o.id,
      title: o.title,
      content: o.content,
      authorPseudonim: o.author.pseudonim,
      publishedAt: o.publishedAt.toISOString(),
      createdAt: o.createdAt.toISOString(),
    }))
  );
}
