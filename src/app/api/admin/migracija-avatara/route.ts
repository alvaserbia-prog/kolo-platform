import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jeSuperadmin } from "@/lib/dozvole";
import { put } from "@vercel/blob";

// Batch može da potraje (više uploada zaredom) — daj mu vremena.
export const maxDuration = 60;

/**
 * POST /api/admin/migracija-avatara
 * Jednokratna (idempotentna, batchovana) migracija legacy base64 avatara iz
 * baze na Vercel Blob. Uzima do BATCH korisnika čiji avatar još počinje sa
 * "data:image", uploaduje binarno na Blob i u bazu upisuje URL.
 * Poziva se više puta dok `preostalo` ne padne na 0.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!jeSuperadmin(session.user)) return NextResponse.json({ error: "Samo admin." }, { status: 403 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Skladište slika nije konfigurisano (BLOB_READ_WRITE_TOKEN). Poveži Vercel Blob store." },
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
      const blob = await put(`avatari/${k.id}-${Date.now()}.${ext}`, buffer, {
        access: "public",
        contentType: mime,
      });
      await prisma.user.update({ where: { id: k.id }, data: { avatar: blob.url } });
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
