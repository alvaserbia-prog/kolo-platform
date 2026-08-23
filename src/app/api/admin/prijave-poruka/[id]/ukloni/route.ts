import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jeAdmin } from "@/lib/dozvole";
import { MIN_ODLUKA, ukloniPoPrijavi } from "@/lib/prijava-poruke";

/**
 * POST /api/admin/prijave-poruka/[id]/ukloni  { odluka }
 *
 * Poruka se uklanja iz Pričaonice, a sve otvorene prijave nad njom se zatvaraju.
 * Obrazloženje je obavezno — Uslovi čl. 25 st. 2 traže obaveštenje „uz navođenje
 * razloga", a ide i autoru i prijaviocima.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) return await greska("Pristup odbijen.", 403);

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const odluka = typeof body.odluka === "string" ? body.odluka.trim() : "";
  if (odluka.length < MIN_ODLUKA)
    return await greska("Obrazloženje je obavezno — ide autoru poruke i prijaviocu.", 400);

  const rez = await ukloniPoPrijavi(id, session.user.id, odluka);
  if (!rez.ok) return await greska(rez.razlog, 400);
  return NextResponse.json({ ok: true });
}
