import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const { staraLozinka, novaLozinka } = await req.json();
  if (!staraLozinka || !novaLozinka) {
    return NextResponse.json({ error: "Sva polja su obavezna." }, { status: 400 });
  }
  if (novaLozinka.length < 8) {
    return NextResponse.json({ error: "Nova lozinka mora imati najmanje 8 karaktera." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (!user.passwordHash) return NextResponse.json({ error: "Nalog nema lozinku (OAuth nalog)." }, { status: 400 });

  const valid = await bcrypt.compare(staraLozinka, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Trenutna lozinka nije tačna." }, { status: 400 });

  const passwordHash = await bcrypt.hash(novaLozinka, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
}
