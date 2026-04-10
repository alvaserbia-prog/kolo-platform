import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });

  const { avatar } = await req.json();
  if (!avatar || typeof avatar !== "string") {
    return NextResponse.json({ error: "Neispravan format." }, { status: 400 });
  }
  if (!avatar.startsWith("data:image/")) {
    return NextResponse.json({ error: "Dozvoljene su samo slike." }, { status: 400 });
  }
  // ~100KB limit za base64 (kompresovana slika)
  if (avatar.length > 150_000) {
    return NextResponse.json({ error: "Slika je prevelika." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar },
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true },
  });

  return NextResponse.json({ avatar: user?.avatar ?? null });
}
