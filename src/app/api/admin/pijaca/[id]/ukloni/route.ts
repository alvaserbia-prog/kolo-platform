import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { jeAdmin } from "@/lib/dozvole";
import { proveriRazlog, tekstObavestenjaOglas, PRAG_ZA_UPOZORENJE } from "@/lib/moderacija";

// POST /api/admin/pijaca/[id]/ukloni — Fondacija uklanja oglas koji krši Uslove,
// Pravilnik ili zakon (Uslovi čl. 21 st. 2, čl. 25 st. 2).
//
// Uklanjanje je MEKO: oglas dobija status UKLONJEN i nestaje iz svih javnih
// prikaza (svi upiti već filtriraju `status: "ACTIVE"`), ali ostaje vlasniku
// vidljiv sa razlogom i može se vratiti ako je uklonjen greškom.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const provera = proveriRazlog(body.razlog);
  if (!provera.ok) return NextResponse.json({ error: provera.greska }, { status: 400 });
  const { razlog } = provera;

  const oglas = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: {
      title: true,
      status: true,
      sellerId: true,
      seller: { select: { pseudonim: true } },
    },
  });
  if (!oglas) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  if (oglas.status === "UKLONJEN")
    return NextResponse.json({ error: "Oglas je već uklonjen." }, { status: 400 });

  await prisma.$transaction([
    prisma.marketplaceListing.update({
      where: { id },
      data: {
        status: "UKLONJEN",
        uklonjenAt: new Date(),
        uklonjenRazlog: razlog,
        uklonioId: session.user.id,
      },
    }),
    // Prijave povodom ovog oglasa su rešene time što je oglas uklonjen.
    prisma.prijavaOglasa.updateMany({
      where: { oglasId: id, status: "OTVORENA" },
      data: { status: "RESENA", resioId: session.user.id, resenoAt: new Date() },
    }),
  ]);

  await logAdminAkcija(session.user.id, "OGLAS_UKLONJEN", id, `${oglas.seller.pseudonim} — ${oglas.title}: ${razlog}`);

  // Obaveštenje vlasniku sa razlogom NIJE opcija nego obaveza (čl. 25 st. 2).
  // Jedan poziv pokriva zvonce, push i email.
  await obavesti(oglas.sellerId, {
    tip: "OGLAS_UKLONJEN",
    kljuc: "notifikacije.oglas_uklonjen",
    parametri: { oglas: oglas.title, razlog },
    naslov: "Oglas uklonjen",
    tekst: tekstObavestenjaOglas(oglas.title, razlog),
    link: "/profil/oglasi",
  });

  // Ponovljeno kršenje je osnov za suspenziju/isključenje (Uslovi čl. 27, 28) —
  // javi kad se nakupi, ali ne sankcioniši automatski.
  const uklonjenihUkupno = await prisma.marketplaceListing.count({
    where: { sellerId: oglas.sellerId, status: "UKLONJEN" },
  });
  if (uklonjenihUkupno >= PRAG_ZA_UPOZORENJE) {
    void posaljiAdminAlert(
      "Više uklonjenih oglasa istog korisnika",
      `Korisnik: ${oglas.seller.pseudonim}\nUkupno uklonjenih oglasa: ${uklonjenihUkupno}\nPoslednji razlog: ${razlog}\n\nRazmotriti suspenziju (Uslovi čl. 27) ili isključenje (čl. 28).`,
    );
  }

  return NextResponse.json({ ok: true, uklonjenihUkupno });
}
