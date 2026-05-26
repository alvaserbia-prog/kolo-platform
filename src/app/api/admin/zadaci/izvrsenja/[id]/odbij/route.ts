import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/zadaci/izvrsenja/[id]/odbij — odbijanje izvršenja uz obrazloženje (čl. 18)
export async function POST(
  req: NextRequest,
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
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = typeof body.razlog === "string" ? body.razlog.trim() : "";
  if (razlog.length < 5)
    return NextResponse.json({ error: "Obrazloženje je obavezno (min. 5 karaktera)." }, { status: 400 });

  const iz = await prisma.zadatakIzvrsenje.findUnique({
    where: { id },
    include: { zadatak: { select: { naslov: true, id: true, createdById: true } } },
  });
  if (!iz) return NextResponse.json({ error: "Izvršenje nije pronađeno." }, { status: 404 });
  if (iz.status !== "PODNETO" && iz.status !== "USLOVNO")
    return NextResponse.json({ error: "Izvršenje nije na čekanju." }, { status: 400 });
  if (session.user.id === iz.userId)
    return NextResponse.json({ error: "Ne možeš verifikovati sopstveno izvršenje." }, { status: 403 });
  if (session.user.id === iz.zadatak.createdById)
    return NextResponse.json({ error: "Predlagač zadatka ne može verifikovati izvršenja." }, { status: 403 });

  await prisma.zadatakIzvrsenje.update({
    where: { id },
    data: { status: "ODBIJENO", verifikatorId: session.user.id, obrazlozenje: razlog, potvrdjenaAt: new Date() },
  });

  await posaljiNotifikaciju(
    iz.userId,
    "info",
    "Izvršenje odbijeno",
    `Izvršenje za "${iz.zadatak.naslov}" je odbijeno: ${razlog}.`,
    `/zadaci/${iz.zadatak.id}`
  );

  return NextResponse.json({ ok: true });
}
