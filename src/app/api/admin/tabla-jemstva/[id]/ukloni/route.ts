import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";
import { jeAdmin } from "@/lib/dozvole";

// POST /api/admin/tabla-jemstva/[id]/ukloni — Fondacija uklanja neprikladan zahtev
// (uvredljiv/diskriminatorski/nezakonit sadržaj, lažni podaci ili van svrhe table).
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const razlog = (body.razlog ?? "").trim();
  if (!razlog)
    return NextResponse.json({ error: "Razlog uklanjanja je obavezan." }, { status: 400 });

  const zahtev = await prisma.zahtevZaJemstvo.findUnique({
    where: { id },
    select: { status: true, userId: true, user: { select: { pseudonim: true } } },
  });
  if (!zahtev) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (zahtev.status !== "AKTIVAN" && zahtev.status !== "NEPOTPUN")
    return NextResponse.json({ error: "Zahtev nije aktivan." }, { status: 400 });

  // Uklanjanje briše i skriveni kontakt — uklonjena objava nema svrhu
  // zbog koje su prikupljeni (minimizacija, Politika čl. 4).
  await prisma.zahtevZaJemstvo.update({
    where: { id },
    data: {
      status: "UKLONJEN",
      uklonjenRazlog: razlog,
      telefon: null,
      telefonSaglasnost: false,
    },
  });

  await logAdminAkcija(session.user.id, "JEMSTVO_ZAHTEV_UKLONJEN", id, `${zahtev.user.pseudonim}: ${razlog}`);
  await obavesti(zahtev.userId, {
    tip: "JEMSTVO_UKLONJEN",
    kljuc: "notifikacije.jemstvo_uklonjen",
    parametri: { razlog },
    naslov: "Zahtev za jemstvo uklonjen",
    tekst: `Tvoj zahtev na tabli jemstva je uklonjen. Razlog: ${razlog}`,
    link: "/tabla-jemstva",
  });

  return NextResponse.json({ ok: true });
}
