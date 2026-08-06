import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/dnevni-brojevi/vidjeno  { sekcija: "novcanik" | "pijaca" }
// Označava da je korisnik otvorio tab → badge se nuluje (broji se "od sad").
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sekcija } = await req.json().catch(() => ({ sekcija: null }));

  const polje =
    sekcija === "novcanik" ? "vidjenoNovcanikAt" :
    sekcija === "pijaca" ? "vidjenoPijacaAt" :
    null;

  if (!polje) {
    return NextResponse.json({ error: "Nepoznata sekcija." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { [polje]: new Date() },
  });

  return NextResponse.json({ ok: true });
}
