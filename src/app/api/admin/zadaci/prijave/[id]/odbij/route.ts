import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import { posaljiNotifikaciju } from "@/lib/notifikacije";

// POST /api/admin/zadaci/prijave/[id]/odbij — odbijanje prijave uz obrazloženje (čl. 14)
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

  const prijava = await prisma.zadatakPrijava.findUnique({
    where: { id },
    include: { zadatak: { select: { naslov: true, createdById: true, id: true } } },
  });
  if (!prijava) return NextResponse.json({ error: "Prijava nije pronađena." }, { status: 404 });
  if (prijava.status !== "PODNETA") return NextResponse.json({ error: "Prijava nije na čekanju." }, { status: 400 });
  if (session.user.id === prijava.userId)
    return NextResponse.json({ error: "Ne možeš odlučivati o sopstvenoj prijavi." }, { status: 403 });
  if (session.user.id === prijava.zadatak.createdById)
    return NextResponse.json({ error: "Predlagač zadatka ne može odlučivati o prijavama." }, { status: 403 });

  await prisma.zadatakPrijava.update({
    where: { id },
    data: { status: "ODBIJENA", verifikatorId: session.user.id, odbijenaRazlog: razlog },
  });

  await posaljiNotifikaciju(
    prijava.userId,
    "info",
    "Prijava za zadatak odbijena",
    `Prijava za "${prijava.zadatak.naslov}" je odbijena: ${razlog}. Možete podneti izmenjenu prijavu.`,
    `/zadaci/${prijava.zadatak.id}`
  );

  return NextResponse.json({ ok: true });
}
