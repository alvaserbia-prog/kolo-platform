import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generisiUgovorTekst } from "@/lib/protokol/pokrovitelj";
import { VrstaDonacije } from "@/generated/prisma/client";

const DOZVOLJENE_VRSTE: VrstaDonacije[] = ["NOVAC", "ROBA", "USLUGE"];
const MAX_SLIKA = 4_000_000; // ~3MB base64

// GET /api/pokroviteljstvo/prijava — sopstvene prijave
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Samo verifikovani korisnici mogu pokrenuti pokroviteljstvo." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const naziv = (body.naziv ?? "").trim();
  const pib = (body.pib ?? "").trim();
  const vrstaDonacije = body.vrstaDonacije as VrstaDonacije;
  const vrednostRsd = Number(body.vrednostRsd);
  const cenovnikSlika: string | null = body.cenovnikSlika ?? null;

  if (!naziv || !pib)
    return NextResponse.json({ error: "Naziv pravnog lica ili preduzetnika i PIB su obavezni." }, { status: 400 });
  if (!DOZVOLJENE_VRSTE.includes(vrstaDonacije))
    return NextResponse.json({ error: "Neispravna vrsta donacije." }, { status: 400 });
  if (!vrednostRsd || isNaN(vrednostRsd) || vrednostRsd <= 0)
    return NextResponse.json({ error: "Vrednost donacije mora biti pozitivna." }, { status: 400 });
  if ((vrstaDonacije === "ROBA" || vrstaDonacije === "USLUGE") && !cenovnikSlika)
    return NextResponse.json({ error: "Za robu i usluge obavezan je maloprodajni cenovnik." }, { status: 400 });
  if (cenovnikSlika && cenovnikSlika.length > MAX_SLIKA)
    return NextResponse.json({ error: "Cenovnik je prevelik (maks. ~3MB)." }, { status: 400 });

  const ugovorTekst = generisiUgovorTekst({ naziv, pib, vrstaDonacije, vrednostRsd });

  const prijava = await prisma.pokroviteljPrijava.create({
    data: {
      podnosilacId: session.user.id,
      naziv,
      pib,
      vrstaDonacije,
      vrednostRsd,
      cenovnikSlika: cenovnikSlika || null,
      ugovorTekst,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: prijava.id });
}
