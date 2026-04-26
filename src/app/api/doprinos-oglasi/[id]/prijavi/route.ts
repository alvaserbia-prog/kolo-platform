import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/doprinos-oglasi/[id]/prijavi
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Potrebna je verifikacija." }, { status: 403 });

  const { id } = await params;

  const oglas = await prisma.doprinosOglas.findUnique({ where: { id } });
  if (!oglas) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  if (oglas.status !== "ACTIVE") return NextResponse.json({ error: "Oglas više nije aktivan." }, { status: 400 });
  if (oglas.deadline && new Date() > oglas.deadline) return NextResponse.json({ error: "Rok za prijavu je istekao." }, { status: 400 });

  const postoji = await prisma.oglasPrijava.findUnique({
    where: { oglasId_userId: { oglasId: id, userId: session.user.id } },
  });
  if (postoji) return NextResponse.json({ error: "Već ste podneli prijavu." }, { status: 400 });

  await prisma.oglasPrijava.create({
    data: { oglasId: id, userId: session.user.id },
  });

  void posaljiAdminAlert(
    "Nova prijava za posao",
    `Oglas: ${oglas.title}\nKorisnik: ${session.user.pseudonim}`
  );

  return NextResponse.json({ ok: true });
}
