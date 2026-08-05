import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
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
  if (!session) return await greska("Nije prijavljen.", 401);

  const { id: krugId } = await params;

  // Mora biti admin krugovi
  const membership = await prisma.krugClanstvo.findFirst({
    where: { krugId, userId: session.user.id, leftAt: null, isAdmin: true },
  });
  if (!membership)
    return await greska("Samo admin krugovi može kreirati projekte.", 403);

  const body = await req.json();
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const type = body.type as ProjectType;

  if (!title || title.length < 3)
    return await greska("Naziv projekta mora imati najmanje 3 karaktera.", 400);
  if (!["PRIKUPLJANJE", "REDISTRIBUCIJA"].includes(type))
    return await greska("Neispravna vrsta projekta.", 400);

  await prisma.krugProjekat.create({
    data: { krugId, title, description, type },
  });

  return NextResponse.json({ ok: true });
}
