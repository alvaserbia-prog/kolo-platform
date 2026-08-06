import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import { izracunajLevak, type LevakUlaz } from "@/lib/levak";

/**
 * GET /api/admin/levak — levak: gde ljudi otpadaju od registracije do oglasa.
 *
 * Samo superadmin, kao i dnevnik aktivnosti iz kog se dva koraka izvode.
 * Vraća isključivo AGREGATE (brojeve), nijedan pseudonim ni id.
 *
 * Dva koraka („otvorili poverenje", „otvorili formu za oglas") čitaju se iz
 * `AktivnostLog`, koji postoji tek od uvođenja dnevnika i čuva 12 meseci —
 * zato se vraća i `aktivnostOd`, pa prikaz može da označi kohorte starije od
 * tog datuma, gde ta dva koraka nužno pokazuju nulu.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return NextResponse.json({ error: "Pristup odbijen." }, { status: 403 });

  const [korisnici, karticeRedovi, poverenjeRedovi, formaRedovi, oglasi, najstarijaAktivnost] =
    await Promise.all([
      prisma.user.findMany({
        select: { id: true, createdAt: true, verifiedAt: true },
        orderBy: { createdAt: "asc" },
      }),
      // Svi statusi kartice: objava se broji i ako je kartica istekla ili je
      // verifikacija sprovedena. (Povučena kartica se briše — takav korisnik
      // se ovde ne broji; to je poznato ograničenje, ne greška u računu.)
      prisma.zahtevZaJemstvo.findMany({ select: { userId: true }, distinct: ["userId"] }),
      prisma.aktivnostLog.groupBy({
        by: ["userId"],
        where: {
          OR: [
            { putanja: { startsWith: "/verifikacija" } },
            { putanja: { startsWith: "/tabla-jemstva" } },
          ],
        },
      }),
      prisma.aktivnostLog.groupBy({
        by: ["userId"],
        where: { putanja: { startsWith: "/pijaca/novi-oglas" } },
      }),
      // Svi oglasi, uključujući prodate/uklonjene — pitanje je da li je čovek
      // ikad objavio oglas, ne da li je oglas i danas aktivan.
      prisma.marketplaceListing.findMany({
        select: { sellerId: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.aktivnostLog.findFirst({
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      }),
    ]);

  // Oglasi su sortirani rastuće, pa prvi upis po prodavcu i jeste prvi oglas.
  const prviOglas = new Map<string, Date>();
  for (const o of oglasi) {
    if (!prviOglas.has(o.sellerId)) prviOglas.set(o.sellerId, o.createdAt);
  }

  const ulaz: LevakUlaz = {
    korisnici,
    saKarticom: new Set(karticeRedovi.map((z) => z.userId)),
    otvoriliPoverenje: new Set(poverenjeRedovi.map((r) => r.userId)),
    otvoriliFormu: new Set(formaRedovi.map((r) => r.userId)),
    prviOglas,
  };

  return NextResponse.json({
    grupe: izracunajLevak(ulaz),
    aktivnostOd: najstarijaAktivnost?.createdAt.toISOString() ?? null,
  });
}
