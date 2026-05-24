import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function proveriAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return { ok: false, status: 401, error: "Nije prijavljen." } as const;
  if (session.user.role !== "ADMIN") return { ok: false, status: 403, error: "Samo admin." } as const;
  return { ok: true, session } as const;
}

/**
 * GET /api/admin/osnivaci — lista
 * POST /api/admin/osnivaci — dodaj osnivaca
 *   body: { userId, udeoBrojilac, udeoImenilac, redniBroj, napomena? }
 */

export async function GET() {
  const auth = await proveriAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const osnivaci = await prisma.osnivac.findMany({
    include: { user: { select: { pseudonim: true, email: true } } },
    orderBy: { redniBroj: "asc" },
  });
  return NextResponse.json({ osnivaci });
}

export async function POST(req: NextRequest) {
  const auth = await proveriAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const { userId, udeoBrojilac, udeoImenilac, redniBroj, napomena } = body;

  if (!userId || typeof udeoBrojilac !== "number" || typeof udeoImenilac !== "number" || typeof redniBroj !== "number") {
    return NextResponse.json({ error: "Nedostaju polja." }, { status: 400 });
  }
  if (udeoBrojilac <= 0 || udeoImenilac <= 0) {
    return NextResponse.json({ error: "Udeli moraju biti pozitivni." }, { status: 400 });
  }

  // Kanal ne sme da bude vec aktiviran (brojKoraka > 0) ako se menja lista osnivaca
  const kanal = await prisma.osnivackiKanal.findUnique({ where: { id: "singleton" } });
  if (kanal && kanal.brojKoraka > 0) {
    return NextResponse.json({
      error: "Kanal je vec aktiviran (broj koraka > 0). Izmena liste osnivaca nije dozvoljena.",
    }, { status: 409 });
  }

  const osnivac = await prisma.osnivac.create({
    data: { userId, udeoBrojilac, udeoImenilac, redniBroj, napomena },
  });

  return NextResponse.json({ osnivac });
}
