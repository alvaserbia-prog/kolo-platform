/**
 * Razmena povodom oglasa — obostrana potvrda da je razmena obavljena.
 * Osnov: Pravilnik o KOLO sistemu čl. 40a (putanja doprinosa razmeni), čl. 16.
 *
 * Fondacija ovim NE posreduje u razmeni i ne jemči za nju — zapis je evidencija
 * saglasnih izjava dve strane i služi isključivo brojaču putanje.
 */
import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RazmenaStatus } from "@/generated/prisma/client";
import { odbijRazmenu, potvrdiRazmenu } from "@/lib/protokol/doprinos-razmeni";

/**
 * GET — stanje razmena povodom ovog oglasa, iz ugla posmatrača.
 *
 * Oglašivač vidi sve svoje razmene i ko mu se javio (to su njegovi sagovornici);
 * sagovornik vidi samo sopstvenu. Tuđe razmene se ne prikazuju (čl. 67).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  const { id } = await params;

  const oglas = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { sellerId: true },
  });
  if (!oglas) return await greska("Oglas nije pronađen.", 404);

  const jeOglasivac = oglas.sellerId === session.user.id;
  const razmene = await prisma.razmena.findMany({
    where: jeOglasivac
      ? { oglasId: id }
      : { oglasId: id, sagovornikId: session.user.id },
    select: {
      sagovornikId: true,
      status: true,
      potvrdioOglasivacAt: true,
      potvrdioSagovornikAt: true,
      sagovornik: { select: { pseudonim: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Oglašivaču se nudi spisak onih koji su mu se javili — samo njih sme da
  // imenuje kao drugu stranu razmene.
  const upiti = jeOglasivac
    ? await prisma.oglasUpit.findMany({
        where: { oglasId: id },
        select: { posiljacId: true, posiljac: { select: { pseudonim: true } } },
        orderBy: { createdAt: "asc" },
      })
    : [];

  return NextResponse.json({
    jeOglasivac,
    razmene: razmene.map((r) => ({
      sagovornikId: r.sagovornikId,
      sagovornikPseudonim: r.sagovornik.pseudonim,
      status: r.status,
      potvrdioOglasivac: r.potvrdioOglasivacAt !== null,
      potvrdioSagovornik: r.potvrdioSagovornikAt !== null,
      // Da li je na posmatraču red da se izjasni.
      cekaMene:
        r.status === RazmenaStatus.PREDLOZENA &&
        (jeOglasivac ? r.potvrdioOglasivacAt === null : r.potvrdioSagovornikAt === null),
    })),
    upiti: upiti.map((u) => ({ id: u.posiljacId, pseudonim: u.posiljac.pseudonim })),
  });
}

/** POST — označi razmenu kao realizovanu (`potvrdi`) ili je odbij (`odbij`). */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  const { id } = await params;

  let body: { akcija?: string; sagovornikId?: string };
  try {
    body = await req.json();
  } catch {
    return await greska("Neispravan zahtev.", 400);
  }

  const ulaz = {
    oglasId: id,
    korisnikId: session.user.id,
    sagovornikId: typeof body.sagovornikId === "string" ? body.sagovornikId : undefined,
  };
  const rez =
    body.akcija === "odbij" ? await odbijRazmenu(ulaz) : await potvrdiRazmenu(ulaz);

  if (!rez.ok) return await greska(rez.razlog, rez.status);
  return NextResponse.json({ ok: true, status: rez.status });
}
