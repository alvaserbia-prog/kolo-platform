import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obavesti } from "@/lib/notifikacije";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { labelPrograma } from "@/lib/protokol/programi";

// POST /api/programi/potvrde/[id]/odgovori
// Telo: { potvrdi: boolean, obrazlozenje?: string }
// Verifikator potvrđuje ispunjenost uslova pod punom odgovornošću, ili odbija uz
// obavezno obrazloženje. Jedno odbijanje obara prijavu (tvrda blokada, čl. 4).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const potvrdi = body.potvrdi === true;
  const obrazlozenje = typeof body.obrazlozenje === "string" ? body.obrazlozenje.trim() : "";

  if (!potvrdi && obrazlozenje.length === 0)
    return await greska("Odbijanje zahteva obrazloženje.", 400);

  const potvrda = await prisma.programPotvrda.findUnique({
    where: { id },
    include: {
      enrollment: { select: { id: true, type: true, userId: true, status: true } },
    },
  });
  if (!potvrda) return await greska("Zahtev nije pronađen.", 404);
  if (potvrda.verifikatorId !== session.user.id)
    return await greska("Pristup odbijen.", 403);
  if (potvrda.status !== "CEKA")
    return await greska("Već ste odgovorili na ovaj zahtev.", 400);
  if (potvrda.enrollment.status !== "PENDING")
    return await greska("Prijava više nije na čekanju.", 400);

  const programLabel = labelPrograma(potvrda.enrollment.type);
  const verifikatorPseudonim = session.user.pseudonim;

  if (potvrdi) {
    // Potvrda + provera da li su SVI verifikatori potvrdili (spremno za admina).
    const svePotvrdjeno = await prisma.$transaction(async (tx) => {
      await tx.programPotvrda.update({
        where: { id },
        data: { status: "POTVRDJENO", odgovorAt: new Date(), obrazlozenje: null },
      });
      const preostalo = await tx.programPotvrda.count({
        where: { enrollmentId: potvrda.enrollment.id, status: { not: "POTVRDJENO" } },
      });
      return preostalo === 0;
    });

    if (svePotvrdjeno) {
      void posaljiAdminAlert(
        "Prijava spremna za odobravanje",
        `Program: ${potvrda.enrollment.type}\nSvi verifikatori su potvrdili — prijava čeka odluku Fondacije.`
      );
      await obavesti(potvrda.enrollment.userId, {
        tip: "info",
        kljuc: "notifikacije.svi_verifikatori_potvrdili",
        parametri: { program: programLabel },
        naslov: "Svi verifikatori su potvrdili",
        tekst: `Svi tvoji verifikatori su potvrdili prijavu za program „${programLabel}". Prijava čeka odluku Fondacije.`,
        link: "/programi",
      });
    }

    return NextResponse.json({ ok: true, svePotvrdjeno });
  }

  // Odbijanje — obara prijavu (tvrda blokada).
  await prisma.$transaction(async (tx) => {
    await tx.programPotvrda.update({
      where: { id },
      data: { status: "ODBIJENO", odgovorAt: new Date(), obrazlozenje },
    });
    await tx.programEnrollment.update({
      where: { id: potvrda.enrollment.id },
      data: {
        status: "REJECTED",
        rejectionReason: `Verifikator nije potvrdio ispunjenost uslova: ${obrazlozenje}`,
      },
    });
  });

  await obavesti(potvrda.enrollment.userId, {
    tip: "info",
    kljuc: "notifikacije.program_odbijen_verifikator",
    parametri: { program: programLabel, obrazlozenje },
    naslov: "Prijava na program odbijena",
    tekst: `Tvoja prijava za program „${programLabel}" je odbijena jer je jedan verifikator nije potvrdio. Obrazloženje: ${obrazlozenje}`,
    link: "/programi",
  });
  void posaljiAdminAlert(
    "Prijava na program odbijena (verifikator)",
    `Program: ${potvrda.enrollment.type}\nVerifikator: ${verifikatorPseudonim}\nObrazloženje: ${obrazlozenje}`
  );

  return NextResponse.json({ ok: true, odbijeno: true });
}
