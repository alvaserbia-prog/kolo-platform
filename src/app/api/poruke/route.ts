import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — lista konverzacija za trenutnog korisnika
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const meId = session.user.id;

  const konverzacije = await prisma.konverzacija.findMany({
    where: { OR: [{ user1Id: meId }, { user2Id: meId }] },
    orderBy: { lastMessageAt: "desc" },
    include: {
      user1: { select: { id: true, pseudonim: true } },
      user2: { select: { id: true, pseudonim: true } },
      poruke: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { tekst: true, posiljacId: true, createdAt: true, procitana: true },
      },
    },
  });

  const data = konverzacije.map((k) => {
    const drugiUser = k.user1Id === meId ? k.user2 : k.user1;
    const poslednja = k.poruke[0] ?? null;
    const neprocitano = k.poruke.filter((p) => !p.procitana && p.posiljacId !== meId).length;
    return {
      id: k.id,
      drugiId: drugiUser.id,
      drugiPseudonim: drugiUser.pseudonim,
      poslednjaPorukaIznos: poslednja?.tekst ?? null,
      poslednjaPosiljacJa: poslednja?.posiljacId === meId,
      poslednjeVreme: poslednja?.createdAt.toISOString() ?? k.createdAt.toISOString(),
      neprocitano,
    };
  });

  return NextResponse.json({ konverzacije: data });
}

// POST — otvori ili kreiraj konverzaciju sa korisnikom (po userId)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Poruke su dostupne samo verifikovanima; neverifikovani komuniciraju isključivo
  // preko table zahteva za jemstvo (Uslovi čl. 16, Politika čl. 6).
  if (!session.user.verified) return NextResponse.json({ error: "Verifikacija potrebna." }, { status: 403 });
  const meId = session.user.id;

  const { userId } = await req.json();
  if (!userId || userId === meId)
    return NextResponse.json({ error: "Neispravan korisnik." }, { status: 400 });

  const drugiUser = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!drugiUser) return NextResponse.json({ error: "Korisnik ne postoji." }, { status: 404 });

  // Uvek sortiraj IDs da bi @@unique radio
  const [u1, u2] = [meId, userId].sort();

  const konv = await prisma.konverzacija.upsert({
    where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    create: { user1Id: u1, user2Id: u2 },
    update: {},
    select: { id: true },
  });

  return NextResponse.json({ konverzacijaId: konv.id });
}
