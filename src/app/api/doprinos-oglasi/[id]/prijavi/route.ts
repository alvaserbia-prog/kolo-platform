import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { imaFunkcionalniPristup } from "@/lib/protokol/pristup";

// POST /api/doprinos-oglasi/[id]/prijavi
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });
  if (!session.user.verified) return NextResponse.json({ error: "Potrebna je verifikacija." }, { status: 403 });
  if (!(await imaFunkcionalniPristup(session.user.id)))
    return NextResponse.json({ error: "Potreban je indeks stvarnosti od najmanje 10%." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const planIzvrsenja = typeof body.planIzvrsenja === "string" ? body.planIzvrsenja.trim() : "";

  const oglas = await prisma.doprinosOglas.findUnique({ where: { id } });
  if (!oglas) return NextResponse.json({ error: "Oglas nije pronađen." }, { status: 404 });
  if (oglas.status !== "ACTIVE") return NextResponse.json({ error: "Oglas više nije aktivan." }, { status: 400 });
  if (oglas.deadline && new Date() > oglas.deadline) return NextResponse.json({ error: "Rok za prijavu je istekao." }, { status: 400 });

  // Plan izvršenja je obavezan za zadatke „sa odobravanjem" (čl. 11, 14).
  if (oglas.saOdobravanjem && planIzvrsenja.length < 10)
    return NextResponse.json({ error: "Za ovaj zadatak je obavezan plan izvršenja (najmanje 10 karaktera)." }, { status: 400 });

  const postoji = await prisma.oglasPrijava.findUnique({
    where: { oglasId_userId: { oglasId: id, userId: session.user.id } },
  });
  if (postoji) return NextResponse.json({ error: "Već ste podneli prijavu." }, { status: 400 });

  // Popunjenost mesta — broje se primljeni izvršioci (APPROVED). Čl. 13: naknadne
  // prijave preko predviđenog broja se ne primaju.
  const primljeni = await prisma.oglasPrijava.count({
    where: { oglasId: id, status: "APPROVED" },
  });
  if (primljeni >= oglas.positions)
    return NextResponse.json({ error: "Sva mesta za izvršioce su popunjena." }, { status: 400 });

  // Prijem prijave (čl. 13): bez odobravanja — automatski (APPROVED); sa odobravanjem
  // — čeka izričito odobrenje plana od verifikatora (PENDING).
  const autoPrijem = !oglas.saOdobravanjem;

  await prisma.oglasPrijava.create({
    data: {
      oglasId: id,
      userId: session.user.id,
      planIzvrsenja: planIzvrsenja || null,
      status: autoPrijem ? "APPROVED" : "PENDING",
      approvedAt: autoPrijem ? new Date() : null,
    },
  });

  void posaljiAdminAlert(
    oglas.saOdobravanjem ? "Nova prijava za zadatak (čeka odobrenje plana)" : "Nova prijava za zadatak (primljena)",
    `Zadatak: ${oglas.title}\nKorisnik: ${session.user.pseudonim}`
  );

  return NextResponse.json({ ok: true, primljen: autoPrijem });
}
