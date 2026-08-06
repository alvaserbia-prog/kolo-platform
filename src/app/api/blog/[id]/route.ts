import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/blog/[id] — javni prikaz pojedinačne objave
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const objava = await prisma.blogPost.findUnique({
    where: { id },
    include: { author: { select: { pseudonim: true } } },
  });

  if (!objava) {
    return NextResponse.json({ error: "Objava nije pronađena." }, { status: 404 });
  }

  return NextResponse.json({
    id: objava.id,
    title: objava.title,
    content: objava.content,
    authorPseudonim: objava.author.pseudonim,
    publishedAt: objava.publishedAt.toISOString(),
  });
}
