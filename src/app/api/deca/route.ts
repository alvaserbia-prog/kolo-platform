import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { MODUL_DECA_AKTIVAN, PORUKA_MODUL_UGASEN } from "@/lib/moduli";
import { validanPseudonim, PSEUDONIM_PRAVILO } from "@/lib/validacija";
import { porukaZauzeca, proveriZauzece } from "@/lib/pseudonim";
import { rateLimit, klijentIP } from "@/lib/rate-limit";
import { DecaGreska, dohvatiDecu, otvoriNalogDeteta } from "@/lib/protokol/deca";

/** Isti generator kao pri registraciji — hash je javni identifikator naloga. */
function generisiMemberHash(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let hash = "";
  for (let i = 0; i < 8; i++) hash += chars[Math.floor(Math.random() * chars.length)];
  return hash;
}

// GET /api/deca — spisak dece za odeljak „Moja deca" u profilu roditelja.
export async function GET() {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  return NextResponse.json({ deca: await dohvatiDecu(session.user.id) });
}

/**
 * POST /api/deca — roditelj otvara nalog svom detetu (Pravilnik o Modulu Deca, čl. 4).
 *
 * Nalog je aktivan od trenutka otvaranja; postupak potvrde iz čl. 6 teče paralelno.
 * Dete nema imejl — lozinku postavlja roditelj i predaje je detetu.
 */
export async function POST(req: NextRequest) {
  if (!MODUL_DECA_AKTIVAN) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  // Otvaranje naloga opterećuje SVE ljude koji su potvrdili roditelja — svaki nalog
  // im pošalje po jedno izjašnjenje sa rokom. Bez ograničenja bi jedan čovek mogao
  // da ih zatrpa u minutu.
  const rl = rateLimit(`deca:${session.user.id}:${klijentIP(req)}`, 5, 24 * 60 * 60 * 1000);
  if (!rl.ok) {
    return await greska(
      "U kratkom roku je otvoreno više dečjih naloga. Svaki nalog traži izjašnjenje od svih koji su te potvrdili, pa se otvara najviše pet dnevno. Pokušaj ponovo sutra.",
      429
    );
  }

  let body: { pseudonim?: unknown; lozinka?: unknown; datumRodjenja?: unknown };
  try {
    body = await req.json();
  } catch {
    return await greska("Neispravan zahtev.", 400);
  }

  const { pseudonim, lozinka, datumRodjenja } = body;
  if (typeof pseudonim !== "string" || typeof lozinka !== "string" || typeof datumRodjenja !== "string") {
    return await greska("Sva polja su obavezna.", 400);
  }
  if (!validanPseudonim(pseudonim)) return await greska(PSEUDONIM_PRAVILO, 400);
  if (lozinka.length < 8 || lozinka.length > 200) {
    return await greska("Lozinka mora imati između 8 i 200 znakova.", 400);
  }
  // Datum se prima kao YYYY-MM-DD i čita kao UTC ponoć — kolona je DATE, bez vremena.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datumRodjenja)) {
    return await greska("Datum rođenja nije ispravan.", 400);
  }
  const datum = new Date(`${datumRodjenja}T00:00:00.000Z`);
  if (Number.isNaN(datum.getTime())) return await greska("Datum rođenja nije ispravan.", 400);

  const pseudonimClean = pseudonim.trim();
  const zauzece = await proveriZauzece(pseudonimClean);
  if (zauzece) return await greska(porukaZauzeca(zauzece), 409);

  let memberHash = generisiMemberHash();
  while (await prisma.user.findUnique({ where: { memberHash } })) {
    memberHash = generisiMemberHash();
  }

  try {
    const rezultat = await otvoriNalogDeteta({
      roditeljId: session.user.id,
      pseudonim: pseudonimClean,
      passwordHash: await bcrypt.hash(lozinka, 12),
      datumRodjenja: datum,
      memberHash,
    });
    return NextResponse.json(rezultat, { status: 201 });
  } catch (e) {
    if (e instanceof DecaGreska) return await greska(e.message, e.status);
    console.error("[POST /api/deca]", e);
    return await greska("Interna greška servera.", 500);
  }
}
