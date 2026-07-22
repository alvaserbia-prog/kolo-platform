import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import { logAdminAkcija } from "@/lib/audit";

/**
 * DELETE /api/admin/osnivaci/[id]
 * Brisanje osnivaca — samo ako kanal nije jos aktiviran (brojKoraka = 0).
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!jeSuperadmin(session.user)) return NextResponse.json({ error: "Samo admin." }, { status: 403 });

  const { id } = await params;

  const kanal = await prisma.osnivackiKanal.findUnique({ where: { id: "singleton" } });
  if (kanal && kanal.brojKoraka > 0) {
    return NextResponse.json({
      error: "Kanal je vec aktiviran (broj koraka > 0). Brisanje osnivaca nije dozvoljeno.",
    }, { status: 409 });
  }

  const osnivac = await prisma.osnivac.delete({ where: { id } });
  await logAdminAkcija(session.user.id, "OSNIVAC_OBRISAN", osnivac.userId,
    `udeo ${osnivac.udeoBrojilac}/${osnivac.udeoImenilac}, r.br. ${osnivac.redniBroj}`);
  return NextResponse.json({ ok: true });
}
