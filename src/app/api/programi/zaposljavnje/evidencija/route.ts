import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/programi/zaposljavnje/evidencija — istorija za korisnika
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const evidencije = await prisma.zaposljvanjeEvidencija.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 30,
  });

  return NextResponse.json({
    evidencije: evidencije.map((e) => ({
      id: e.id,
      date: e.date.toISOString(),
      description: e.description,
      amount: e.amount,
      status: e.status,
    })),
  });
}

// POST /api/programi/zaposljavnje/evidencija — unos za danas
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  // Mora imati aktivan enrollment
  const enrollment = await prisma.programEnrollment.findUnique({
    where: { userId_type: { userId: session.user.id, type: "ZAPOSLJAVNJE" } },
  });
  if (!enrollment || enrollment.status !== "ACTIVE")
    return NextResponse.json({ error: "Niste aktivni na programu Zapošljavanje." }, { status: 403 });

  // Program mora biti aktivan
  const program = await prisma.bankaProgram.findUnique({ where: { type: "ZAPOSLJAVNJE" } });
  if (!program?.isActive)
    return NextResponse.json({ error: "Program Zapošljavanje nije aktivan." }, { status: 400 });

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  // Jedna evidencija po danu
  const vec = await prisma.zaposljvanjeEvidencija.findUnique({
    where: { userId_date: { userId: session.user.id, date: danas } },
  });
  if (vec)
    return NextResponse.json({ error: "Evidencija za danas je već podneta." }, { status: 400 });

  const body = await req.json();
  const description = (body.description ?? "").trim();
  const amount = Number(body.amount);

  if (!description || description.length < 10)
    return NextResponse.json({ error: "Opis aktivnosti mora imati najmanje 10 karaktera." }, { status: 400 });
  if (!amount || amount < 100 || amount > 10000)
    return NextResponse.json({ error: "Iznos mora biti između 100 i 10.000 POEN." }, { status: 400 });

  await prisma.zaposljvanjeEvidencija.create({
    data: {
      userId: session.user.id,
      enrollmentId: enrollment.id,
      date: danas,
      description,
      amount,
    },
  });

  return NextResponse.json({ ok: true });
}
