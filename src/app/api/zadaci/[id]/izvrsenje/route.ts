import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { izracunajTezinu, primeniGornjuGranicu } from "@/lib/protokol/zadaci";
import { posaljiAdminAlert } from "@/lib/adminAlert";

// POST /api/zadaci/[id]/izvrsenje — podnošenje izvršenja na verifikaciju (čl. 17–18)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije autorizovano." }, { status: 401 });

  const { id: zadatakId } = await params;
  const body = await req.json().catch(() => ({}));
  const dokaz = typeof body.dokaz === "string" ? body.dokaz.trim() : "";
  if (dokaz.length < 10)
    return NextResponse.json({ error: "Dokaz izvršenja mora imati najmanje 10 karaktera." }, { status: 400 });

  const zadatak = await prisma.zadatak.findUnique({ where: { id: zadatakId } });
  if (!zadatak) return NextResponse.json({ error: "Zadatak nije pronađen." }, { status: 404 });
  if (zadatak.status !== "U_IZVRSENJU")
    return NextResponse.json({ error: "Zadatak nije u izvršenju." }, { status: 400 });
  if (zadatak.rokIzvrsenja && new Date() > zadatak.rokIzvrsenja)
    return NextResponse.json({ error: "Rok za izvršenje je istekao." }, { status: 400 });

  const prijava = await prisma.zadatakPrijava.findUnique({
    where: { zadatakId_userId: { zadatakId, userId: session.user.id } },
  });
  if (!prijava || prijava.status !== "PRIMLJENA")
    return NextResponse.json({ error: "Nemate primljenu prijavu za ovaj zadatak." }, { status: 403 });

  // Sati su obavezni i validni samo u PO_SATU modu
  let sati: number | null = null;
  if (zadatak.mod === "PO_SATU") {
    sati = Number(body.sati);
    const maxSati = zadatak.maxSati ?? 8;
    if (!Number.isInteger(sati) || sati < 1 || sati > maxSati)
      return NextResponse.json({ error: `Broj sati mora biti 1–${maxSati}.` }, { status: 400 });
  }

  let tezina = izracunajTezinu({
    mod: zadatak.mod,
    sati,
    stopaPoSatu: zadatak.stopaPoSatu,
    iznosUCelosti: zadatak.iznosUCelosti,
  });
  tezina = primeniGornjuGranicu(tezina, zadatak.gornjaGranica);
  if (tezina <= 0)
    return NextResponse.json({ error: "Težina izvršenja je 0 — proverite parametre zadatka." }, { status: 400 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const postoji = await prisma.zadatakIzvrsenje.findUnique({
    where: { prijavaId_datum: { prijavaId: prijava.id, datum: danas } },
  });
  if (postoji) return NextResponse.json({ error: "Već ste podneli izvršenje za danas." }, { status: 400 });

  await prisma.zadatakIzvrsenje.create({
    data: {
      prijavaId: prijava.id,
      zadatakId,
      userId: session.user.id,
      datum: danas,
      sati,
      dokaz,
      tezina,
      zavrsno: true,
      status: "PODNETO",
    },
  });

  void posaljiAdminAlert(
    "Novo izvršenje zadatka na verifikaciji",
    `Zadatak: ${zadatak.naslov}\nKorisnik: ${session.user.pseudonim}\nTežina: ${tezina.toLocaleString("sr-RS")} POEN`
  );

  return NextResponse.json({ ok: true, tezina });
}
