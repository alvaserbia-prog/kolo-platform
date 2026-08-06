import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { jeSuperadmin } from "@/lib/dozvole";
import { validanPseudonim, PSEUDONIM_PRAVILO } from "@/lib/validacija";
import { porukaZauzeca, promeniPseudonim, proveriZauzece } from "@/lib/pseudonim";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { email, pseudonim } = body as { email?: string; pseudonim?: string };

  const korisnik = await prisma.user.findUnique({
    where: { id },
    select: { pseudonim: true, tipKorisnika: true, admin: true },
  });
  if (!korisnik) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (jeSuperadmin(korisnik)) return NextResponse.json({ error: "Ne može se editovati admin." }, { status: 400 });

  const data: { email?: string } = {};
  const izmenjena: string[] = [];

  if (email?.trim()) {
    const existing = await prisma.user.findFirst({ where: { email: email.trim(), id: { not: id } } });
    if (existing) return NextResponse.json({ error: "Email je već u upotrebi." }, { status: 409 });
    data.email = email.trim();
    izmenjena.push("email");
  }

  // Pseudonim ide kroz `promeniPseudonim` — stari se beleži kao napušten (stari
  // linkovi ostaju živi i ime ne može da preuzme neko drugi).
  let noviPseudonim: string | null = null;
  if (pseudonim?.trim()) {
    if (!validanPseudonim(pseudonim)) {
      return NextResponse.json({ error: PSEUDONIM_PRAVILO }, { status: 400 });
    }
    const zauzece = await proveriZauzece(pseudonim, id);
    if (zauzece) return NextResponse.json({ error: porukaZauzeca(zauzece) }, { status: 409 });
    noviPseudonim = pseudonim.trim();
    izmenjena.push("pseudonim");
  }

  if (izmenjena.length === 0)
    return NextResponse.json({ error: "Nema podataka za izmenu." }, { status: 400 });

  await prisma.$transaction(async (tx) => {
    if (noviPseudonim) {
      await promeniPseudonim(tx, id, korisnik.pseudonim, noviPseudonim, data);
    } else {
      await tx.user.update({ where: { id }, data });
    }
  });

  await logAdminAkcija(
    session.user.id,
    "KORISNIK_IZMENJEN",
    id,
    `${korisnik.pseudonim}: ${izmenjena.join(", ")}`
  );

  return NextResponse.json({ ok: true });
}
