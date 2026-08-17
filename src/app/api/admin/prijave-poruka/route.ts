import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jeAdmin } from "@/lib/dozvole";
import { prisma } from "@/lib/prisma";
import { jeHitno } from "@/lib/prijava-poruke-pravila";

/**
 * GET /api/admin/prijave-poruka?prikaz=otvorene|resene
 *
 * Spisak prijava poruka iz Pričaonice, GRUPISAN PO PRIJAVLJENOM NALOGU. Grupisanje
 * je ceo smisao ovog ekrana: pojedinačna poruka retko sama nosi odluku, a tri
 * prijave iz tri razgovora nad istim nalogom je nose. Uz svaku grupu ide broj
 * RAZLIČITIH prijavilaca (jedan čovek koji pritisne tri puta nije obrazac) i
 * spisak zatečenih odluka nad tim nalogom.
 *
 * Sadržaj prijavljene poruke se prikazuje — on je dokaz, i jedino što Fondacija
 * gleda. Ostatak sobe se NE otvara: prijava ne daje pravo na čitanje razgovora.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !jeAdmin(session.user)) return await greska("Pristup odbijen.", 403);

  const prikaz = req.nextUrl.searchParams.get("prikaz") === "resene" ? "resene" : "otvorene";

  const [prijave, ukupnoOtvorenih] = await Promise.all([
    prisma.prijavaPoruke.findMany({
      where: prikaz === "otvorene" ? { status: "OTVORENA" } : { status: { not: "OTVORENA" } },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        razlogKod: true,
        razlog: true,
        status: true,
        odluka: true,
        createdAt: true,
        resenAt: true,
        prijavioc: { select: { id: true, pseudonim: true } },
        prijavljeni: { select: { id: true, pseudonim: true, maloletan: true, status: true } },
        poruka: {
          select: { id: true, content: true, soba: true, createdAt: true, uklonjenoAt: true },
        },
      },
    }),
    prisma.prijavaPoruke.count({ where: { status: "OTVORENA" } }),
  ]);

  // Broj različitih prijavilaca po nalogu — računa se nad SVIM prijavama, ne samo
  // nad prikazanim: obrazac ne prestaje da postoji time što je jedna prijava rešena.
  const nalozi = [...new Set(prijave.map((p) => p.prijavljeni.id))];
  const sviPrijavioci = nalozi.length
    ? await prisma.prijavaPoruke.findMany({
        where: { prijavljeniId: { in: nalozi } },
        select: { prijavljeniId: true, prijaviocId: true },
        distinct: ["prijavljeniId", "prijaviocId"],
      })
    : [];
  const brojPrijavilaca = new Map<string, number>();
  for (const r of sviPrijavioci) {
    brojPrijavilaca.set(r.prijavljeniId, (brojPrijavilaca.get(r.prijavljeniId) ?? 0) + 1);
  }

  type Stavka = (typeof prijave)[number];
  const grupe = new Map<string, Stavka[]>();
  for (const p of prijave) {
    const kljuc = p.prijavljeni.id;
    if (!grupe.has(kljuc)) grupe.set(kljuc, []);
    grupe.get(kljuc)!.push(p);
  }

  return NextResponse.json({
    ukupnoOtvorenih,
    grupe: [...grupe.entries()]
      .map(([id, stavke]) => ({
        prijavljeni: {
          id,
          pseudonim: stavke[0].prijavljeni.pseudonim,
          maloletan: stavke[0].prijavljeni.maloletan,
          status: stavke[0].prijavljeni.status,
        },
        razlicitihPrijavilaca: brojPrijavilaca.get(id) ?? stavke.length,
        // Hitno = bar jedna prijava iz grupe nosi šifru mamljenja ili laži o
        // uzrastu. Ne sankcioniše ništa — samo diže grupu na vrh spiska.
        hitno: stavke.some((s) => jeHitno(s.razlogKod)),
        prijave: stavke.map((s) => ({
          id: s.id,
          razlogKod: s.razlogKod,
          razlog: s.razlog,
          status: s.status,
          odluka: s.odluka,
          createdAt: s.createdAt.toISOString(),
          resenAt: s.resenAt?.toISOString() ?? null,
          prijavioc: s.prijavioc,
          poruka: {
            id: s.poruka.id,
            sadrzaj: s.poruka.content,
            soba: s.poruka.soba,
            createdAt: s.poruka.createdAt.toISOString(),
            uklonjena: s.poruka.uklonjenoAt !== null,
          },
        })),
      }))
      .sort((a, b) => {
        if (a.hitno !== b.hitno) return a.hitno ? -1 : 1;
        return b.razlicitihPrijavilaca - a.razlicitihPrijavilaca;
      }),
  });
}
