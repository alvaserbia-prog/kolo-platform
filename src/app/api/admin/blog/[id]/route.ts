import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

// PATCH /api/admin/blog/[id] — izmena
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const title = body.title !== undefined ? body.title.toString().trim() : undefined;
  const content = body.content !== undefined ? body.content.toString().trim() : undefined;

  if (title !== undefined) {
    if (!title) return NextResponse.json({ error: "Naslov je obavezan." }, { status: 400 });
    if (title.length > 200)
      return NextResponse.json({ error: "Naslov najviše 200 znakova." }, { status: 400 });
  }
  if (content !== undefined) {
    if (!content) return NextResponse.json({ error: "Sadržaj je obavezan." }, { status: 400 });
    if (content.length > 20000)
      return NextResponse.json({ error: "Sadržaj najviše 20.000 znakova." }, { status: 400 });
  }

  let publishedAt: Date | undefined;
  if (body.publishedAt) {
    const d = new Date(body.publishedAt);
    if (isNaN(d.getTime())) {
      return NextResponse.json({ error: "Neispravan datum objave." }, { status: 400 });
    }
    publishedAt = d;
  }

  const exists = await prisma.blogPost.findUnique({ where: { id } });
  if (!exists) return NextResponse.json({ error: "Objava nije pronađena." }, { status: 404 });

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(publishedAt ? { publishedAt } : {}),
    },
  });

  await logAdminAkcija(session.user.id, "BLOG_OBJAVA_IZMENJENA", id, title ?? exists.title);

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/blog/[id] — brisanje
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const { id } = await params;
  const exists = await prisma.blogPost.findUnique({ where: { id } });
  if (!exists) return NextResponse.json({ error: "Objava nije pronađena." }, { status: 404 });

  await prisma.blogPost.delete({ where: { id } });
  await logAdminAkcija(session.user.id, "BLOG_OBJAVA_OBRISANA", id, exists.title);

  return NextResponse.json({ ok: true });
}
