import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { imaFunkcionalniPristup } from "@/lib/protokol/pristup";

// POST /api/doprinos-oglasi/[id]/evidencija — unos radnih sati
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });
  if (!(await imaFunkcionalniPristup(session.user.id)))
    return NextResponse.json({ error: "Potreban je indeks stvarnosti od najmanje 10%." }, { status: 403 });

  const { id: oglasId } = await params;
  const body = await req.json().catch(() => ({}));
  const { date, predlozeniPoen, description, dokaz } = body;

  // Validacije
  if (!date || !predlozeniPoen || !description) return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
  const predlozeni = Number(predlozeniPoen);
  if (!Number.isInteger(predlozeni) || predlozeni < 1) return NextResponse.json({ error: "Predloženi POEN mora biti pozitivan ceo broj." }, { status: 400 });
  if (typeof description !== "string" || description.trim().length < 10) return NextResponse.json({ error: "Opis mora imati najmanje 10 karaktera." }, { status: 400 });

  // Datum — max 3 dana unazad
  const datumEv = new Date(date);
  datumEv.setHours(0, 0, 0, 0);
  const danas = new Date(); danas.setHours(0, 0, 0, 0);
  const razlikaMs = danas.getTime() - datumEv.getTime();
  const razlikaDana = Math.floor(razlikaMs / (1000 * 60 * 60 * 24));
  if (razlikaDana < 0 || razlikaDana > 3) return NextResponse.json({ error: "Evidencija moguća max 3 dana unazad." }, { status: 400 });

  // Oglas i primljena prijava
  const oglas = await prisma.doprinosOglas.findUnique({ where: { id: oglasId } });
  if (!oglas || oglas.status !== "ACTIVE") return NextResponse.json({ error: "Zadatak nije aktivan." }, { status: 400 });

  // Predloženi POEN pojedinačnog dnevnog izvršenja ne sme premašiti predloženi POEN
  // celog zadatka (čl. 26 — gornja granica po dnevnom izvršenju).
  if (predlozeni > oglas.predlozeniPoen)
    return NextResponse.json({ error: `Predloženi POEN dnevnog izvršenja ne može preći ${oglas.predlozeniPoen.toLocaleString("sr-RS")} (predloženi POEN zadatka).` }, { status: 400 });

  const prijava = await prisma.oglasPrijava.findUnique({
    where: { oglasId_userId: { oglasId, userId: session.user.id } },
  });
  if (!prijava || prijava.status !== "APPROVED") return NextResponse.json({ error: "Vaša prijava za ovaj zadatak nije primljena." }, { status: 403 });

  // Provera duplikata za isti dan
  const postoji = await prisma.oglasEvidencija.findUnique({
    where: { userId_oglasId_date: { userId: session.user.id, oglasId, date: datumEv } },
  });
  if (postoji) return NextResponse.json({ error: "Evidencija za taj dan je već uneta." }, { status: 400 });

  // Kumulativni predloženi POEN svih dnevnih izvršenja (osim odbijenih) ne sme preći
  // predloženi POEN zadatka (čl. 11 — raspodela predloženog POEN-a po dnevnim izvršenjima).
  const agg = await prisma.oglasEvidencija.aggregate({
    where: { userId: session.user.id, oglasId, status: { not: "REJECTED" } },
    _sum: { predlozeniPoen: true },
  });
  const dosadasnji = agg._sum.predlozeniPoen ?? 0;
  if (dosadasnji + predlozeni > oglas.predlozeniPoen)
    return NextResponse.json({ error: `Zbir predloženog POEN-a po dnevnim izvršenjima (${(dosadasnji + predlozeni).toLocaleString("sr-RS")}) prelazi predloženi POEN zadatka (${oglas.predlozeniPoen.toLocaleString("sr-RS")}).` }, { status: 400 });

  await prisma.oglasEvidencija.create({
    data: {
      userId: session.user.id,
      oglasId,
      prijavaId: prijava.id,
      date: datumEv,
      predlozeniPoen: predlozeni,
      dokaz: typeof dokaz === "string" && dokaz.trim() ? dokaz.trim() : null,
      description: description.trim(),
    },
  });

  void posaljiAdminAlert(
    "Novo dnevno izvršenje (operativni doprinos)",
    `Zadatak: ${oglas.title}\nKorisnik: ${session.user.pseudonim}\nPredloženi POEN: ${predlozeni.toLocaleString("sr-RS")}`
  );

  return NextResponse.json({ ok: true, predlozeniPoen: predlozeni });
}
