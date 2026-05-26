import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_TEKST = 1000;
const MIN_TEKST = 10;
const MAX_KONTAKT = 500;
const MIN_KONTAKT = 3;
const TRAJANJE_DANA = 30;

// GET /api/tabla-jemstva — aktivni zahtevi (samo prijavljeni).
// Tekst i pseudonim su vidljivi svim prijavljenima; kontakt se NE vraća ovde
// (otkriva se zasebno preko /[id]/kontakt, samo verifikovanima, uz logovanje).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const zahtevi = await prisma.zahtevZaJemstvo.findMany({
    where: { status: "AKTIVAN", expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      tekstPredstavljanja: true,
      createdAt: true,
      user: { select: { pseudonim: true } },
    },
  });

  return NextResponse.json({
    mojeVerifikovan: session.user.verified,
    zahtevi: zahtevi.map((z) => ({
      id: z.id,
      pseudonim: z.user.pseudonim,
      tekstPredstavljanja: z.tekstPredstavljanja,
      createdAt: z.createdAt.toISOString(),
      mojZahtev: z.userId === session.user.id,
    })),
  });
}

// POST /api/tabla-jemstva — objavi zahtev za jemstvo (samo neverifikovani; jedan aktivan).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (session.user.verified)
    return NextResponse.json({ error: "Već ste verifikovani — tabla je namenjena neverifikovanim korisnicima." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const tekst = (body.tekstPredstavljanja ?? "").trim();
  const kontakt = (body.kontaktPodaci ?? "").trim();
  const pristanak = body.pristanak === true;

  if (!pristanak)
    return NextResponse.json({ error: "Morate dati saglasnost za objavljivanje." }, { status: 400 });
  if (tekst.length < MIN_TEKST || tekst.length > MAX_TEKST)
    return NextResponse.json({ error: `Tekst mora imati između ${MIN_TEKST} i ${MAX_TEKST} karaktera.` }, { status: 400 });
  if (kontakt.length < MIN_KONTAKT || kontakt.length > MAX_KONTAKT)
    return NextResponse.json({ error: `Kontakt mora imati između ${MIN_KONTAKT} i ${MAX_KONTAKT} karaktera.` }, { status: 400 });

  const postoji = await prisma.zahtevZaJemstvo.findFirst({
    where: { userId: session.user.id, status: "AKTIVAN" },
    select: { id: true },
  });
  if (postoji)
    return NextResponse.json({ error: "Već imate aktivan zahtev. Povucite ga pre objave novog." }, { status: 409 });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TRAJANJE_DANA);

  const zahtev = await prisma.zahtevZaJemstvo.create({
    data: {
      userId: session.user.id,
      tekstPredstavljanja: tekst,
      kontaktPodaci: kontakt,
      expiresAt,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: zahtev.id });
}
