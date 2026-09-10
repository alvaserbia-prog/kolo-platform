import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";

/**
 * POST /api/prigovor — korisnik podnosi prigovor na odluku (čl. 38 ZZPL)
 * GET  /api/prigovor — lista sopstvenih prigovora
 */

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const prigovori = await prisma.prigovorNaOdluku.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, tipOdluke: true, opis: true, status: true,
      odgovor: true, odgovorioAt: true, createdAt: true,
    },
  });

  return NextResponse.json(prigovori);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const body = await req.json();
  const { opis, tipOdluke } = body;

  if (!opis || opis.trim().length < 10) {
    return await greska("Opis prigovora mora imati najmanje 10 znakova.", 400);
  }

  // OGLAS — prigovor na uklonjen oglas ili poruku (Uslovi čl. 25 st. 2, čl. 30).
  // „PODACI" je zahtev za ispravku netačnog podatka (čl. 29 ZZPL-a) — pravo koje
  // Politika navodi među pravima korisnika, a do seta 4.5.1 nije imalo nijedan
  // put u sistemu. Ide kroz zatečeni prigovor, bez novog modela i novog taba.
  // „POTVRDA" je prigovor na poništenje potvrde stvarnosti zbog neaktivnosti u
  // postupku iz čl. 6 Pravilnika o učešću dece. Postoji zato što je to jedina
  // automatska posledica u sistemu koja dira status: nastupa bez ičije odluke, a
  // čl. 38 ZZPL-a za takvu obradu traži pravo na ljudski uvid.
  const tipovi = [
    "VERIFIKACIJA",
    "SUSPENZIJA",
    "PROGRAM",
    "OGLAS",
    "PODACI",
    "POTVRDA",
    "OSTALO",
  ];
  if (!tipovi.includes(tipOdluke)) {
    return await greska("Nepoznat tip odluke.", 400);
  }

  // Spreči spam: max 3 otvorena prigovora
  const otvoreni = await prisma.prigovorNaOdluku.count({
    where: { userId: session.user.id, status: { in: ["PENDING", "U_OBRADI"] } },
  });
  if (otvoreni >= 3) {
    return await greska("Imate previše otvorenih prigovora. Sačekajte odgovor na prethodne.", 429);
  }

  const prigovor = await prisma.prigovorNaOdluku.create({
    data: {
      userId: session.user.id,
      opis: opis.trim(),
      tipOdluke,
    },
  });

  void posaljiAdminAlert(
    "Novi prigovor na odluku",
    `Tip: ${tipOdluke}\nKorisnik: ${session.user.pseudonim}`
  );

  return NextResponse.json({ ok: true, id: prigovor.id }, { status: 201 });
}
