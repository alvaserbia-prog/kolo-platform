import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  if (session.user.verified) {
    return NextResponse.json({ error: "Već ste verifikovani." }, { status: 400 });
  }

  // Proveri da li već postoji zahtev na čekanju
  const postojeci = await prisma.verificationRequest.findUnique({
    where: { userId: session.user.id },
  });
  if (postojeci && postojeci.status === "PENDING") {
    return NextResponse.json({ error: "Zahtev je već poslat i čeka pregled." }, { status: 400 });
  }

  const formData = await req.formData();
  const jmbg = (formData.get("jmbg") as string)?.trim();
  const frontFile = formData.get("front") as File | null;
  const backFile = formData.get("back") as File | null;

  // Validacija
  if (!jmbg || jmbg.length !== 13 || !/^\d{13}$/.test(jmbg)) {
    return NextResponse.json({ error: "JMBG mora sadržati tačno 13 cifara." }, { status: 400 });
  }
  if (!frontFile || !backFile) {
    return NextResponse.json({ error: "Obavezne su fotografije prednje i zadnje strane." }, { status: 400 });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (frontFile.size > MAX_SIZE || backFile.size > MAX_SIZE) {
    return NextResponse.json({ error: "Svaka fotografija može biti najviše 5MB." }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(frontFile.type) || !allowed.includes(backFile.type)) {
    return NextResponse.json({ error: "Dozvoljeni formati: JPG, PNG, WebP." }, { status: 400 });
  }

  // Sačuvaj fajlove
  const dir = path.join(process.cwd(), "storage", "verifikacija", session.user.id);
  await mkdir(dir, { recursive: true });

  const ext = (file: File) => {
    if (file.type === "image/png") return ".png";
    if (file.type === "image/webp") return ".webp";
    return ".jpg";
  };

  const frontName = `${randomUUID()}${ext(frontFile)}`;
  const backName = `${randomUUID()}${ext(backFile)}`;

  await writeFile(path.join(dir, frontName), Buffer.from(await frontFile.arrayBuffer()));
  await writeFile(path.join(dir, backName), Buffer.from(await backFile.arrayBuffer()));

  const frontPath = `storage/verifikacija/${session.user.id}/${frontName}`;
  const backPath = `storage/verifikacija/${session.user.id}/${backName}`;

  // Upiši ili ažuriraj VerificationRequest
  if (postojeci) {
    // REJECTED — može ponovo da pošalje
    await prisma.verificationRequest.update({
      where: { userId: session.user.id },
      data: {
        jmbg,
        idFrontPath: frontPath,
        idBackPath: backPath,
        status: "PENDING",
        rejectionReason: null,
        reviewedAt: null,
        reviewedById: null,
      },
    });
  } else {
    await prisma.verificationRequest.create({
      data: {
        userId: session.user.id,
        jmbg,
        idFrontPath: frontPath,
        idBackPath: backPath,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const vr = await prisma.verificationRequest.findUnique({
    where: { userId: session.user.id },
    select: { status: true, rejectionReason: true, createdAt: true },
  });

  return NextResponse.json({
    verified: session.user.verified,
    request: vr
      ? {
          status: vr.status,
          rejectionReason: vr.rejectionReason,
          createdAt: vr.createdAt.toISOString(),
        }
      : null,
  });
}
