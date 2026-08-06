import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/krugovi/[id]/pristupnica
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnici mogu podneti pristupnicu." }, { status: 403 });

  const { id: krugId } = await params;

  const krug = await prisma.krug.findUnique({ where: { id: krugId } });
  if (!krug || krug.status !== "ACTIVE")
    return NextResponse.json({ error: "Krug nije pronađena ili nije aktivna." }, { status: 404 });

  // Čl. 28 — samo jedna krug
  const aktivno = await prisma.krugClanstvo.findFirst({
    where: { userId: session.user.id, leftAt: null },
  });
  if (aktivno)
    return NextResponse.json({ error: "Već ste član krugovi. Prvo istupite iz trenutne." }, { status: 400 });

  // Postoji li već pristupnica na čekanju ili aktivno članstvo
  const postojeca = await prisma.krugPristupnica.findUnique({
    where: { userId_krugId: { userId: session.user.id, krugId } },
  });
  if (postojeca && postojeca.status === "PENDING")
    return NextResponse.json({ error: "Pristupnica je već poslata i čeka odobrenje." }, { status: 400 });

  if (postojeca) {
    await prisma.krugPristupnica.update({
      where: { id: postojeca.id },
      data: { status: "PENDING" },
    });
  } else {
    await prisma.krugPristupnica.create({
      data: { userId: session.user.id, krugId },
    });
  }

  void posaljiAdminAlert(
    "Nova pristupnica za krug",
    `Krug: ${krug.name}\nKorisnik: ${session.user.pseudonim}`
  );

  return NextResponse.json({ ok: true });
}
