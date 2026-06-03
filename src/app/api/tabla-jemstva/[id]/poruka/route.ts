import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/tabla-jemstva/[id]/poruka — verifikovani korisnik otvara 1-na-1
// konverzaciju sa pošiljaocem zahteva za jemstvo (neverifikovanim korisnikom).
//
// Time se proširuje mehanizam table jemstva (Uslovi čl. 16, Politika čl. 6):
// neverifikovani NE MOŽE da inicira poruku ni da piše bilo kome, ali SME da
// uzvrati u konverzaciji koju je verifikovani pokrenuo povodom njegovog zahteva.
// Iniciranje je strogo vezano za aktivan zahtev (ne otkriva se sirov userId),
// a svako otvaranje se beleži u evidenciji pristupa.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json(
      { error: "Slanje poruke povodom zahteva za jemstvo dostupno je samo verifikovanim korisnicima." },
      { status: 403 }
    );

  const { id } = await params;
  const zahtev = await prisma.zahtevZaJemstvo.findUnique({
    where: { id },
    select: {
      status: true,
      expiresAt: true,
      userId: true,
      user: { select: { pseudonim: true } },
    },
  });
  if (!zahtev) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (zahtev.status !== "AKTIVAN" || zahtev.expiresAt.getTime() < Date.now())
    return NextResponse.json({ error: "Zahtev više nije aktivan." }, { status: 410 });

  const meId = session.user.id;
  if (zahtev.userId === meId)
    return NextResponse.json({ error: "Ne možete poslati poruku samom sebi." }, { status: 400 });

  // Uvek sortiraj IDs da bi @@unique radio (isti obrazac kao /api/poruke).
  const [u1, u2] = [meId, zahtev.userId].sort();
  const konv = await prisma.konverzacija.upsert({
    where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    create: { user1Id: u1, user2Id: u2 },
    update: {},
    select: { id: true },
  });

  // Evidencija pristupa (čl. 5 Registra radnji obrade) — kao kod otkrivanja kontakta.
  await logAdminAkcija(
    meId,
    "KONTAKT_JEMSTVO_PORUKA",
    id,
    `Otvorena konverzacija povodom zahteva za jemstvo korisnika ${zahtev.user.pseudonim}`
  );

  return NextResponse.json({ konverzacijaId: konv.id });
}
