import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/zadaci/izvrsenja/[id]/potvrdi — verifikacija izvršenja (čl. 18, 19, 16)
// Ne emituje odmah: težina ulazi u noćnu raspodelu (čl. 24).
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
    return NextResponse.json({ error: "Verifikacija dostupna samo UO i nosiocima ZRNA (čl. 16)." }, { status: 403 });

  const { id } = await params;
  const iz = await prisma.zadatakIzvrsenje.findUnique({
    where: { id },
    include: { zadatak: { select: { id: true, naslov: true, createdById: true, brojIzvrsilaca: true } } },
  });
  if (!iz) return NextResponse.json({ error: "Izvršenje nije pronađeno." }, { status: 404 });
  if (iz.status !== "PODNETO" && iz.status !== "USLOVNO")
    return NextResponse.json({ error: "Izvršenje nije na čekanju." }, { status: 400 });

  // Konflikt interesa (čl. 16)
  if (session.user.id === iz.userId)
    return NextResponse.json({ error: "Ne možeš verifikovati sopstveno izvršenje." }, { status: 403 });
  if (session.user.id === iz.zadatak.createdById)
    return NextResponse.json({ error: "Predlagač zadatka ne može verifikovati izvršenja." }, { status: 403 });

  await prisma.zadatakIzvrsenje.update({
    where: { id },
    data: { status: "POTVRDJENO", verifikatorId: session.user.id, potvrdjenaAt: new Date() },
  });

  // Jednodnevni zadatak: po potvrdi svih izvršilaca → IZVRSEN.
  const potvrdjeniZavrsni = await prisma.zadatakIzvrsenje.count({
    where: { zadatakId: iz.zadatak.id, zavrsno: true, status: { in: ["POTVRDJENO", "EVIDENTIRANO"] } },
  });
  if (potvrdjeniZavrsni >= iz.zadatak.brojIzvrsilaca)
    await prisma.zadatak.update({ where: { id: iz.zadatak.id }, data: { status: "IZVRSEN" } });

  await posaljiNotifikaciju(
    iz.userId,
    "info",
    "Izvršenje potvrđeno",
    `Vaše izvršenje za "${iz.zadatak.naslov}" je potvrđeno. POEN ulazi u noćnu raspodelu.`,
    "/novcanik"
  );

  return NextResponse.json({ ok: true });
}
