import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/zaposljavnje/[id]/evidencija — unos radnih sati
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id: oglasId } = await params;
  const body = await req.json().catch(() => ({}));
  const { date, hoursWorked, description } = body;

  // Validacije
  if (!date || !hoursWorked || !description) return NextResponse.json({ error: "Nedostaju podaci." }, { status: 400 });
  const sati = Number(hoursWorked);
  if (!Number.isInteger(sati) || sati < 1 || sati > 8) return NextResponse.json({ error: "Broj sati mora biti 1–8." }, { status: 400 });
  if (typeof description !== "string" || description.trim().length < 10) return NextResponse.json({ error: "Opis mora imati najmanje 10 karaktera." }, { status: 400 });

  // Datum — max 3 dana unazad
  const datumEv = new Date(date);
  datumEv.setHours(0, 0, 0, 0);
  const danas = new Date(); danas.setHours(0, 0, 0, 0);
  const razlikaMs = danas.getTime() - datumEv.getTime();
  const razlikaDana = Math.floor(razlikaMs / (1000 * 60 * 60 * 24));
  if (razlikaDana < 0 || razlikaDana > 3) return NextResponse.json({ error: "Evidencija moguća max 3 dana unazad." }, { status: 400 });

  // Oglas i odobrena prijava
  const oglas = await prisma.radniOglas.findUnique({ where: { id: oglasId } });
  if (!oglas || oglas.status !== "ACTIVE") return NextResponse.json({ error: "Oglas nije aktivan." }, { status: 400 });
  if (sati > oglas.maxHoursPerDay) return NextResponse.json({ error: `Max ${oglas.maxHoursPerDay} sati dnevno za ovaj oglas.` }, { status: 400 });

  const prijava = await prisma.radniOglasPrijava.findUnique({
    where: { oglasId_userId: { oglasId, userId: session.user.id } },
  });
  if (!prijava || prijava.status !== "APPROVED") return NextResponse.json({ error: "Nemate odobrenu prijavu za ovaj oglas." }, { status: 403 });

  // Provera duplikata za isti dan
  const postoji = await prisma.radnaEvidencija.findUnique({
    where: { userId_oglasId_date: { userId: session.user.id, oglasId, date: datumEv } },
  });
  if (postoji) return NextResponse.json({ error: "Evidencija za taj dan je već unesena." }, { status: 400 });

  const amount = sati * oglas.hourlyRate;

  await prisma.radnaEvidencija.create({
    data: {
      userId: session.user.id,
      oglasId,
      prijavaId: prijava.id,
      date: datumEv,
      hoursWorked: sati,
      amount,
      description: description.trim(),
    },
  });

  void posaljiAdminAlert(
    "Nova radna evidencija",
    `Oglas: ${oglas.title}\nKorisnik: ${session.user.pseudonim}\nSati: ${sati} | Iznos: ${amount.toLocaleString("sr-RS")} POEN`
  );

  return NextResponse.json({ ok: true, amount });
}
