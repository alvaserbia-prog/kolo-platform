import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/zadaci/prijave/[id]/odobri — odobravanje plana izvršenja (čl. 14, 16)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const jeAdmin = session.user.role === "ADMIN";
  let jeNosilacZrna = false;
  if (!jeAdmin) {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tipKorisnika: true },
    });
    jeNosilacZrna = me?.tipKorisnika === TipKorisnika.NOSILAC_ZRNA;
  }
  if (!jeAdmin && !jeNosilacZrna)
    return NextResponse.json({ error: "Odobravanje dostupno samo UO i nosiocima ZRNA (čl. 16)." }, { status: 403 });

  const { id } = await params;
  const prijava = await prisma.zadatakPrijava.findUnique({ where: { id } });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.status !== "PODNETA") return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });

  const zadatak = await prisma.zadatak.findUnique({
    where: { id: prijava.zadatakId },
    select: {
      naslov: true,
      brojIzvrsilaca: true,
      createdById: true,
      status: true,
      _count: { select: { prijave: { where: { status: "PRIMLJENA" } } } },
    },
  });
  if (!zadatak) return NextResponse.json({ error: "Zadatak nije pronađen." }, { status: 404 });

  // Konflikt interesa (čl. 16): verifikator ne sme biti izvršilac ni predlagač.
  if (session.user.id === prijava.userId)
    return NextResponse.json({ error: "Ne možeš odlučivati o sopstvenoj prijavi." }, { status: 403 });
  if (session.user.id === zadatak.createdById)
    return NextResponse.json({ error: "Predlagač zadatka ne može odlučivati o prijavama." }, { status: 403 });

  if (zadatak._count.prijave >= zadatak.brojIzvrsilaca)
    return NextResponse.json({ error: `Zadatak je popunjen (${zadatak.brojIzvrsilaca}).` }, { status: 400 });

  await prisma.zadatakPrijava.update({
    where: { id },
    data: { status: "PRIMLJENA", verifikatorId: session.user.id, primljenaAt: new Date() },
  });
  if (zadatak.status === "OTVOREN")
    await prisma.zadatak.update({ where: { id: prijava.zadatakId }, data: { status: "U_IZVRSENJU" } });

  await posaljiNotifikaciju(
    prijava.userId,
    "info",
    "Plan izvršenja odobren!",
    `Vaša prijava za zadatak "${zadatak.naslov}" je primljena. Možete započeti izvršenje.`,
    `/zadaci/${prijava.zadatakId}`
  );

  return NextResponse.json({ ok: true });
}
