import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const pristanak = formData.get("pristanak") === "true";
  const idFrontFile = formData.get("idFront") as File | null;
  const idBackFile = formData.get("idBack") as File | null;

  // Obavezan eksplicitni pristanak za obradu podataka
  if (!pristanak) {
    return NextResponse.json({
      error: "Morate dati pristanak za obradu podataka pre slanja zahteva za verifikaciju.",
    }, { status: 400 });
  }

  // Validacija JMBG
  if (!jmbg || jmbg.length !== 13 || !/^\d{13}$/.test(jmbg)) {
    return NextResponse.json({ error: "JMBG mora sadržati tačno 13 cifara." }, { status: 400 });
  }

  // Validacija slika
  if (!idFrontFile || !idBackFile) {
    return NextResponse.json({ error: "Morate priložiti fotografije prednje i zadnje strane lične karte." }, { status: 400 });
  }

  const MAX_SIZE = 4 * 1024 * 1024; // 4MB
  if (idFrontFile.size > MAX_SIZE || idBackFile.size > MAX_SIZE) {
    return NextResponse.json({ error: "Svaka fotografija mora biti manja od 4MB." }, { status: 400 });
  }

  // Konvertuj slike u base64
  const frontBuffer = await idFrontFile.arrayBuffer();
  const backBuffer = await idBackFile.arrayBuffer();
  const frontBase64 = `data:${idFrontFile.type};base64,${Buffer.from(frontBuffer).toString("base64")}`;
  const backBase64 = `data:${idBackFile.type};base64,${Buffer.from(backBuffer).toString("base64")}`;

  // Upiši ili ažuriraj VerificationRequest
  if (postojeci) {
    // REJECTED — može ponovo da pošalje
    await prisma.verificationRequest.update({
      where: { userId: session.user.id },
      data: {
        jmbg,
        idFrontPath: frontBase64,
        idBackPath: backBase64,
        kanal: "UPLOAD",
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
        idFrontPath: frontBase64,
        idBackPath: backBase64,
        kanal: "UPLOAD",
      },
    });
  }

  // Snimi pristanak za obradu podataka
  await prisma.verifikacijaPristanak.upsert({
    where: { userId: session.user.id },
    update: { prihvacenAt: new Date() },
    create: { userId: session.user.id },
  });

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
