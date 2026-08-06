import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
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
  if (!session) return await greska("Nije autorizovano.", 401);
  if (!session.user.verified) return await greska("Potrebna je verifikacija.", 403);
  if (!(await imaFunkcionalniPristup(session.user.id)))
    return await greska("Potreban je indeks stvarnosti od najmanje 10%.", 403);

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const planIzvrsenja = typeof body.planIzvrsenja === "string" ? body.planIzvrsenja.trim() : "";

  const oglas = await prisma.doprinosOglas.findUnique({ where: { id } });
  if (!oglas) return await greska("Oglas nije pronađen.", 404);
  if (oglas.status !== "ACTIVE") return await greska("Oglas više nije aktivan.", 400);
  if (oglas.deadline && new Date() > oglas.deadline) return await greska("Rok za prijavu je istekao.", 400);

  // Plan izvršenja je obavezan za zadatke „sa odobravanjem" (čl. 11, 14).
  if (oglas.saOdobravanjem && planIzvrsenja.length < 10)
    return await greska("Za ovaj zadatak je obavezan plan izvršenja (najmanje 10 karaktera).", 400);

  const postoji = await prisma.oglasPrijava.findUnique({
    where: { oglasId_userId: { oglasId: id, userId: session.user.id } },
  });
  if (postoji) return await greska("Već ste podneli prijavu.", 400);

  // Popunjenost mesta — broje se primljeni izvršioci (APPROVED). Čl. 13: naknadne
  // prijave preko predviđenog broja se ne primaju.
  const primljeni = await prisma.oglasPrijava.count({
    where: { oglasId: id, status: "APPROVED" },
  });
  if (primljeni >= oglas.positions)
    return await greska("Sva mesta za izvršioce su popunjena.", 400);

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
