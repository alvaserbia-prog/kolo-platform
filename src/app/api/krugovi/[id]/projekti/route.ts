import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectType } from "@/generated/prisma/client";

// POST /api/krugovi/[id]/projekti — kreiraj projekat (admin krugovi)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { id: krugId } = await params;

  // Mora biti admin krugovi
  const membership = await prisma.krugClanstvo.findFirst({
    where: { krugId, userId: session.user.id, leftAt: null, isAdmin: true },
  });
  if (!membership)
    return NextResponse.json({ error: "Samo admin krugovi može kreirati projekte." }, { status: 403 });

  const body = await req.json();
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const type = body.type as ProjectType;

  if (!title || title.length < 3)
    return NextResponse.json({ error: "Naziv projekta mora imati najmanje 3 karaktera." }, { status: 400 });
  if (!["PRIKUPLJANJE", "REDISTRIBUCIJA"].includes(type))
    return NextResponse.json({ error: "Neispravna vrsta projekta." }, { status: 400 });

  await prisma.krugProjekat.create({
    data: { krugId, title, description, type },
  });

  return NextResponse.json({ ok: true });
}
