import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/tabla-jemstva/[id]/kontakt — otkrivanje kontakt podataka.
// Samo verifikovani korisnici; svako otkrivanje se beleži u evidenciji pristupa.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json({ error: "Kontakt podaci su dostupni samo verifikovanim korisnicima." }, { status: 403 });

  const { id } = await params;
  const zahtev = await prisma.zahtevZaJemstvo.findUnique({
    where: { id },
    select: {
      status: true,
      expiresAt: true,
      kontaktPodaci: true,
      user: { select: { pseudonim: true } },
    },
  });
  if (!zahtev) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (zahtev.status !== "AKTIVAN" || zahtev.expiresAt.getTime() < Date.now())
    return NextResponse.json({ error: "Zahtev više nije aktivan." }, { status: 410 });

  // Evidencija pristupa (čl. 5 Registra radnji obrade) — svako otkrivanje se loguje.
  await logAdminAkcija(
    session.user.id,
    "PRISTUP_KONTAKT_JEMSTVO",
    id,
    `Otkriven kontakt na tabli jemstva za korisnika ${zahtev.user.pseudonim}`
  );

  return NextResponse.json({ kontaktPodaci: zahtev.kontaktPodaci });
}
