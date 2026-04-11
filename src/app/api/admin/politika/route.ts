import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

/**
 * GET /api/admin/politika — lista svih verzija Politike
 * POST /api/admin/politika — kreira novu verziju i šalje notifikacije svim korisnicima
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nije ovlašćen." }, { status: 403 });
  }

  const verzije = await prisma.politikaVerzija.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { pristanci: true } },
    },
  });

  return NextResponse.json(verzije);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nije ovlašćen." }, { status: 403 });
  }

  const body = await req.json();
  const { verzija, naslov, efektivnaOd } = body;

  if (!verzija || !naslov || !efektivnaOd) {
    return NextResponse.json({ error: "Polja verzija, naslov i efektivnaOd su obavezna." }, { status: 400 });
  }

  // Proveri jedinstvenost verzije
  const postoji = await prisma.politikaVerzija.findUnique({ where: { verzija } });
  if (postoji) {
    return NextResponse.json({ error: "Ta verzija već postoji." }, { status: 409 });
  }

  const novaVerzija = await prisma.politikaVerzija.create({
    data: {
      verzija,
      naslov,
      efektivnaOd: new Date(efektivnaOd),
      kreirao: session.user.id,
    },
  });

  // Pošalji notifikacije svim aktivnim korisnicima
  const korisnici = await prisma.user.findMany({
    where: { status: "ACTIVE", deaktiviranAt: null },
    select: { id: true },
  });

  if (korisnici.length > 0) {
    await prisma.notifikacija.createMany({
      data: korisnici.map((k) => ({
        userId: k.id,
        tip: "info",
        naslov: "Ažurirana Politika privatnosti",
        tekst: `Nova verzija Politike privatnosti (${verzija}: ${naslov}) stupa na snagu ${new Date(efektivnaOd).toLocaleDateString("sr-RS")}. Molimo da prihvatite novu verziju.`,
        link: "/politika-prihvati",
      })),
      skipDuplicates: true,
    });
  }

  await logAdminAkcija(session.user.id, "POLITIKA_NOVA_VERZIJA", novaVerzija.id, `v${verzija}: ${naslov}`);

  return NextResponse.json(novaVerzija, { status: 201 });
}
