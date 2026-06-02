import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Niste prijavljeni." }, { status: 401 });
  }

  if (!session.user.oauthPending) {
    return NextResponse.json({ error: "Nalog je već podešen." }, { status: 400 });
  }

  const body = await req.json();
  const { pseudonim } = body;

  if (!pseudonim || pseudonim.trim().length < 3 || pseudonim.trim().length > 30) {
    return NextResponse.json({ error: "Pseudonim mora imati između 3 i 30 karaktera." }, { status: 400 });
  }

  const trimmed = pseudonim.trim();

  const existing = await prisma.user.findFirst({
    where: { pseudonim: trimmed, NOT: { id: session.user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Pseudonim je zauzet." }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      pseudonim: trimmed,
      oauthPending: false,
    },
  });

  return NextResponse.json({ ok: true });
}
