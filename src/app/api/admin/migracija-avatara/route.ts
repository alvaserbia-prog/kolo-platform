import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import { sacuvajNaR2, r2Konfigurisan } from "@/lib/skladiste";

// Batch može da potraje (više uploada zaredom) — daj mu vremena.
export const maxDuration = 60;

/**
 * POST /api/admin/migracija-avatara
 * Jednokratna (idempotentna, batchovana) migracija legacy base64 avatara iz
 * baze na Cloudflare R2. Uzima do BATCH korisnika čiji avatar još počinje sa
 * "data:image", uploaduje binarno na R2 i u bazu upisuje javni URL.
 * Poziva se više puta dok `preostalo` ne padne na 0.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!jeSuperadmin(session.user)) return NextResponse.json({ error: "Samo admin." }, { status: 403 });
  if (!r2Konfigurisan()) {
    return NextResponse.json(
      { error: "Skladište slika nije konfigurisano (Cloudflare R2). Postavi R2_* env varijable." },
      { status: 500 }
    );
  }

  const BATCH = 20;
  const korisnici = await prisma.user.findMany({
    where: { avatar: { startsWith: "data:image" } },
    select: { id: true, avatar: true },
    take: BATCH,
  });

  let migrirano = 0;
  const greske: string[] = [];

  for (const k of korisnici) {
    const m = k.avatar?.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!m) continue;
    try {
      const mime = m[1];
      const ext = mime.split("/")[1].replace("jpeg", "jpg");
      const buffer = Buffer.from(m[2], "base64");
      const url = await sacuvajNaR2(`avatari/${k.id}-${Date.now()}.${ext}`, buffer, mime);
      await prisma.user.update({ where: { id: k.id }, data: { avatar: url } });
      migrirano++;
    } catch (e) {
      greske.push(`${k.id}: ${String(e)}`);
    }
  }

  const preostalo = await prisma.user.count({
    where: { avatar: { startsWith: "data:image" } },
  });

  return NextResponse.json({ migrirano, preostalo, greske });
}
