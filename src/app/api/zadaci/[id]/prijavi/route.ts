import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/zadaci/[id]/prijavi — prijava za izvršenje (čl. 9–13)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Potrebna je verifikacija." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const planIzvrsenja = typeof body.planIzvrsenja === "string" ? body.planIzvrsenja.trim() : "";
  if (planIzvrsenja.length < 10)
    return NextResponse.json({ error: "Plan izvršenja mora imati najmanje 10 karaktera." }, { status: 400 });

  const zadatak = await prisma.zadatak.findUnique({ where: { id } });
  if (!zadatak) return NextResponse.json({ error: "Zadatak nije pronađen." }, { status: 404 });
  if (zadatak.status !== "OTVOREN" && zadatak.status !== "U_IZVRSENJU")
    return NextResponse.json({ error: "Zadatak više ne prima prijave." }, { status: 400 });
  if (zadatak.rokPrijave && new Date() > zadatak.rokPrijave)
    return NextResponse.json({ error: "Rok za prijavu je istekao." }, { status: 400 });

  // Indeks stvarnosti (čl. 9)
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { indeksStvarnosti: true },
  });
  if ((me?.indeksStvarnosti ?? 0) < zadatak.minIndeks)
    return NextResponse.json(
      { error: `Potreban indeks stvarnosti od najmanje ${zadatak.minIndeks}%.` },
      { status: 403 }
    );

  const postoji = await prisma.zadatakPrijava.findUnique({
    where: { zadatakId_userId: { zadatakId: id, userId: session.user.id } },
  });
  if (postoji) return NextResponse.json({ error: "Već ste podneli prijavu." }, { status: 400 });

  // Automatski prijem za obične zadatke (čl. 13); "sa odobravanjem" → PODNETA.
  if (!zadatak.saOdobravanjem) {
    const primljeni = await prisma.zadatakPrijava.count({
      where: { zadatakId: id, status: "PRIMLJENA" },
    });
    if (primljeni >= zadatak.brojIzvrsilaca)
      return NextResponse.json(
        { error: `Zadatak je popunjen (${zadatak.brojIzvrsilaca} izvršilaca).` },
        { status: 400 }
      );

    await prisma.zadatakPrijava.create({
      data: {
        zadatakId: id,
        userId: session.user.id,
        planIzvrsenja,
        status: "PRIMLJENA",
        primljenaAt: new Date(),
      },
    });
    if (zadatak.status === "OTVOREN")
      await prisma.zadatak.update({ where: { id }, data: { status: "U_IZVRSENJU" } });

    return NextResponse.json({ ok: true, status: "PRIMLJENA" });
  }

  await prisma.zadatakPrijava.create({
    data: { zadatakId: id, userId: session.user.id, planIzvrsenja, status: "PODNETA" },
  });
  void posaljiAdminAlert(
    "Nova prijava za zadatak (sa odobravanjem)",
    `Zadatak: ${zadatak.naslov}\nKorisnik: ${session.user.pseudonim}`
  );
  return NextResponse.json({ ok: true, status: "PODNETA" });
}
