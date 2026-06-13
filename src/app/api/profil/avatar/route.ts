import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });

  const { avatar } = await req.json();
  if (!avatar || typeof avatar !== "string") {
    return NextResponse.json({ error: "Neispravan format." }, { status: 400 });
  }
  // Klijent šalje data:image/...;base64,<podaci> (iz crop canvasa).
  const match = avatar.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Dozvoljene su samo slike." }, { status: 400 });
  }
  // ~100KB limit za base64 (kompresovana slika)
  if (avatar.length > 150_000) {
    return NextResponse.json({ error: "Slika je prevelika." }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Skladište slika nije konfigurisano (BLOB_READ_WRITE_TOKEN)." },
      { status: 500 }
    );
  }

  const mime = match[1];
  const ext = mime.split("/")[1].replace("jpeg", "jpg");
  const buffer = Buffer.from(match[2], "base64");

  // Jedinstvena putanja po uploadu → URL je nepromenljiv i može da se kešira
  // zauvek (cache-busting je besplatan). Stari blob brišemo niže.
  const blob = await put(`avatari/${session.user.id}-${Date.now()}.${ext}`, buffer, {
    access: "public",
    contentType: mime,
  });

  const prethodni = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar: blob.url },
  });

  // Best-effort brisanje starog blob fajla (samo ako je bio na Blob-u; legacy
  // base64 avatari nemaju URL pa se preskaču). Ne sme da obori upload.
  if (prethodni?.avatar?.startsWith("http")) {
    await del(prethodni.avatar).catch(() => {});
  }

  return NextResponse.json({ ok: true, avatar: blob.url });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Neautorizovano" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true },
  });

  return NextResponse.json({ avatar: user?.avatar ?? null });
}
