import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";
import { jeSuperadmin } from "@/lib/dozvole";
import { AdminNivo } from "@/generated/prisma/client";

// POST — superadmin dodeljuje/oduzima admin rolu (NONE/ADMIN/SUPERADMIN).
const DOZVOLJENI: AdminNivo[] = ["NONE", "ADMIN", "SUPERADMIN"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !jeSuperadmin(session.user))
    return NextResponse.json({ error: "Samo superadmin može menjati admin role." }, { status: 403 });

  const { id } = await params;
  if (id === session.user.id)
    return NextResponse.json({ error: "Ne možeš menjati sopstvenu rolu." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const nivo = body.nivo as AdminNivo;
  if (!DOZVOLJENI.includes(nivo))
    return NextResponse.json({ error: "Neispravan nivo role." }, { status: 400 });

  const korisnik = await prisma.user.findUnique({
    where: { id },
    select: { pseudonim: true, admin: true },
  });
  if (!korisnik) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });

  if (korisnik.admin === nivo)
    return NextResponse.json({ ok: true, nepromenjeno: true });

  await prisma.user.update({ where: { id }, data: { admin: nivo } });
  await logAdminAkcija(
    session.user.id,
    "ADMIN_ROLA",
    id,
    `${korisnik.pseudonim}: ${korisnik.admin} → ${nivo}`
  );

  return NextResponse.json({ ok: true });
}
