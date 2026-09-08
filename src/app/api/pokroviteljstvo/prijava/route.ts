import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generisiUgovorTekst, MINIMUM_PRIJAVE_POKROVITELJSTVA } from "@/lib/protokol/pokrovitelj";
import { VrstaDonacije } from "@/generated/prisma/client";
import { POKROVITELJSTVO_AKTIVNO, PORUKA_MODUL_UGASEN } from "@/lib/moduli";

// Pokroviteljstvo je od 2026-09-08 isključivo NOVAC (čl. 6). Roba i usluge su
// ukinute: iznos je kucao korisnik, a „maloprodajni cenovnik" je bio slika bez
// stavki i bez primopredaje — vrednost se nije mogla proveriti nigde.
const DOZVOLJENE_VRSTE: VrstaDonacije[] = ["NOVAC"];

// Knjigovodstvena isprava (čl. 7) — base64 slika ide u bazu, kao i ranije
// cenovnik. Isti obrazac, ne R2.
const MAX_SLIKA = 4_000_000;

// GET /api/pokroviteljstvo/prijava — sopstvene prijave
export async function GET() {
  if (!POKROVITELJSTVO_AKTIVNO) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const prijave = await prisma.pokroviteljPrijava.findMany({
    where: { podnosilacId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      naziv: true,
      pib: true,
      vrstaDonacije: true,
      vrednostRsd: true,
      ugovorTekst: true,
      status: true,
      odbijenoRazlog: true,
      potpisanoAt: true,
      potvrdjenoAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    prijave: prijave.map((p) => ({
      ...p,
      vrednostRsd: Number(p.vrednostRsd),
      potpisanoAt: p.potpisanoAt?.toISOString() ?? null,
      potvrdjenoAt: p.potvrdjenoAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

// POST /api/pokroviteljstvo/prijava — podnošenje prijave pokroviteljstva (čl. 7)
export async function POST(req: NextRequest) {
  if (!POKROVITELJSTVO_AKTIVNO) return await greska(PORUKA_MODUL_UGASEN, 410);
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  if (!session.user.verified)
    return await greska("Samo verifikovani korisnici mogu pokrenuti pokroviteljstvo.", 403);

  const body = await req.json().catch(() => ({}));
  const naziv = (body.naziv ?? "").trim();
  const pib = (body.pib ?? "").trim();
  const vrstaDonacije = body.vrstaDonacije as VrstaDonacije;
  const vrednostRsd = Number(body.vrednostRsd);
  const ispravaSlika: string | null = body.ispravaSlika ?? null;

  if (!naziv || !pib)
    return await greska("Naziv pravnog lica ili preduzetnika i PIB su obavezni.", 400);
  if (!DOZVOLJENE_VRSTE.includes(vrstaDonacije))
    return await greska("Neispravna vrsta donacije.", 400);
  if (!vrednostRsd || isNaN(vrednostRsd) || vrednostRsd <= 0)
    return await greska("Vrednost donacije mora biti pozitivna.", 400);
  // Najmanja prijava (čl. 7) — ispod toga ugovor, potpis i knjiženje koštaju
  // više nego što donacija vredi.
  if (vrednostRsd < MINIMUM_PRIJAVE_POKROVITELJSTVA)
    return await greska(
      `Najmanji iznos pokroviteljstva je ${MINIMUM_PRIJAVE_POKROVITELJSTVA.toLocaleString("sr-RS")} RSD.`,
      400
    );

  // Čl. 7: uz prijavu ide knjigovodstvena isprava kojom pokrovitelj to isto
  // davanje evidentira u sopstvenim poslovnim knjigama. Ona ne meri vrednost
  // (novac je sam sebi mera) nego pokazuje ČIJE je davanje: bez nje se uplata
  // iz ličnog džepa prijavljuje kao davanje firme i dobija koeficijent ×1,20
  // umesto ×1,00.
  if (!ispravaSlika)
    return await greska("Uz prijavu je obavezna knjigovodstvena isprava.", 400);
  if (ispravaSlika.length > MAX_SLIKA)
    return await greska("Isprava je prevelika (maks. ~3MB).", 400);

  const ugovorTekst = generisiUgovorTekst({ naziv, pib, vrstaDonacije, vrednostRsd });

  const prijava = await prisma.pokroviteljPrijava.create({
    data: {
      podnosilacId: session.user.id,
      naziv,
      pib,
      vrstaDonacije,
      vrednostRsd,
      ispravaSlika,
      ugovorTekst,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: prijava.id });
}
