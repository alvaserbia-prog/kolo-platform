/**
 * Cirkularna sistemska obaveštenja — lista i kreiranje nacrta.
 *
 * SAMO SUPERADMIN: poruka ide svim korisnicima i mimo njihovog opt-out-a, pa je
 * to sistemska poluga, ne svakodnevna operativa (vidi `dozvole.ts`).
 *
 * GET  — poslednjih 20 obaveštenja + broj primalaca u ovom trenutku
 * POST — nov nacrt { naslov, tekst, link?, pravniOsnov }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";
import { prebrojPrimaoce } from "@/lib/sistemsko-obavestenje";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user)) {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  const [obavestenja, primalaca] = await Promise.all([
    prisma.sistemskoObavestenje.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        naslov: true,
        tekst: true,
        link: true,
        pravniOsnov: true,
        status: true,
        ukupno: true,
        poslato: true,
        neuspesno: true,
        createdAt: true,
        zavrsenoAt: true,
        kreirao: { select: { pseudonim: true } },
      },
    }),
    prebrojPrimaoce(),
  ]);

  return NextResponse.json({
    primalaca,
    obavestenja: obavestenja.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      zavrsenoAt: o.zavrsenoAt?.toISOString() ?? null,
      kreiraoPseudonim: o.kreirao.pseudonim,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user)) {
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });
  }

  let body: { naslov?: unknown; tekst?: unknown; link?: unknown; pravniOsnov?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nevažeći JSON." }, { status: 400 });
  }

  const naslov = typeof body.naslov === "string" ? body.naslov.trim() : "";
  const tekst = typeof body.tekst === "string" ? body.tekst.trim() : "";
  const pravniOsnov = typeof body.pravniOsnov === "string" ? body.pravniOsnov.trim() : "";
  const linkRaw = typeof body.link === "string" ? body.link.trim() : "";

  if (!naslov) return NextResponse.json({ error: "Naslov je obavezan." }, { status: 400 });
  if (naslov.length > 150) {
    return NextResponse.json({ error: "Naslov najviše 150 znakova." }, { status: 400 });
  }
  if (!tekst) return NextResponse.json({ error: "Tekst je obavezan." }, { status: 400 });
  if (tekst.length > 5000) {
    return NextResponse.json({ error: "Tekst najviše 5.000 znakova." }, { status: 400 });
  }
  // Osnov je obavezan jer ova pošta preskače opt-out — bez odredbe iz akata to
  // je bilten, a bilten traži zaseban pristanak i dopunu Politike (čl. 8).
  if (!pravniOsnov) {
    return NextResponse.json(
      { error: "Pravni osnov je obavezan (npr. „Uslovi čl. 40“)." },
      { status: 400 }
    );
  }
  if (pravniOsnov.length > 200) {
    return NextResponse.json({ error: "Pravni osnov najviše 200 znakova." }, { status: 400 });
  }
  // Samo interne putanje — mejl ne sme da vodi van platforme.
  if (linkRaw && !linkRaw.startsWith("/")) {
    return NextResponse.json(
      { error: "Link mora biti putanja unutar platforme (počinje sa /)." },
      { status: 400 }
    );
  }

  const o = await prisma.sistemskoObavestenje.create({
    data: {
      naslov,
      tekst,
      link: linkRaw || null,
      pravniOsnov,
      kreiraoId: session.user.id,
    },
  });

  await logAdminAkcija(
    session.user.id,
    "SISTEMSKO_OBAVESTENJE_NACRT",
    o.id,
    `Naslov: ${naslov} | Osnov: ${pravniOsnov}`
  );

  return NextResponse.json({ id: o.id });
}
