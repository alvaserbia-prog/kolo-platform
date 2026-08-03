import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAkcija } from "@/lib/audit";

// POST /api/tabla-jemstva/[id]/prepoznajem — odgovor na pitanje
// „Poznaješ li ovu osobu?" → { odgovor: "DA" | "NE" | "NISAM_SIGURAN" }.
//
// SVA TRI odgovora se upisuju: bez upisa „NE"/„NISAM_SIGURAN" feed bi istom
// članu vrteo iste ljude u krug.
//
// VAŽNO — prepoznavanje NIJE jemstvo. Odgovor „DA" otvara isključivo kanal
// komunikacije (istu konverzaciju kao dugme „Pošalji poruku" na zidu). Formalni
// čin jemstva je zaseban akt, sa zasebnom potvrdom odgovornosti i zasebnim
// upisom u lanac (/[id]/verifikuj) — ne spajaju se ni u UI ni u bazi.
const DOZVOLJENI = ["DA", "NE", "NISAM_SIGURAN"] as const;
type Odgovor = (typeof DOZVOLJENI)[number];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });
  if (!session.user.verified)
    return NextResponse.json(
      { error: "Prepoznavanje je dostupno samo verifikovanim članovima." },
      { status: 403 }
    );

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const odgovor = body.odgovor as Odgovor;
  if (!DOZVOLJENI.includes(odgovor))
    return NextResponse.json({ error: "Nepoznat odgovor." }, { status: 400 });

  const zahtev = await prisma.zahtevZaJemstvo.findUnique({
    where: { id },
    select: {
      userId: true,
      status: true,
      expiresAt: true,
      user: { select: { pseudonim: true } },
    },
  });
  if (!zahtev) return NextResponse.json({ error: "Zahtev nije pronađen." }, { status: 404 });
  if (zahtev.status !== "AKTIVAN" || zahtev.expiresAt.getTime() < Date.now())
    return NextResponse.json({ error: "Zahtev više nije aktivan." }, { status: 410 });

  const meId = session.user.id;
  if (zahtev.userId === meId)
    return NextResponse.json({ error: "Ne možete odgovarati na sopstveni zahtev." }, { status: 400 });

  await prisma.prepoznavanje.upsert({
    where: { zahtevId_korisnikId: { zahtevId: id, korisnikId: meId } },
    create: { zahtevId: id, korisnikId: meId, odgovor },
    update: { odgovor },
  });

  // „NE" / „NISAM_SIGURAN" — kartica prosto ispada iz feed-a, ništa se ne otvara.
  if (odgovor !== "DA") return NextResponse.json({ ok: true });

  // „DA" — otvara se 1-na-1 konverzacija (Uslovi čl. 16, Politika čl. 6):
  // neverifikovani ne može sam da inicira poruku, ali sme da uzvrati u
  // konverzaciji koju je verifikovani pokrenuo povodom njegovog zahteva.
  const [u1, u2] = [meId, zahtev.userId].sort();
  const konv = await prisma.konverzacija.upsert({
    where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    create: { user1Id: u1, user2Id: u2 },
    update: {},
    select: { id: true },
  });

  // Evidencija pristupa (čl. 5 Registra radnji obrade) — trenutak u kome član
  // dobija kanal ka podnosiocu.
  await logAdminAkcija(
    meId,
    "PREPOZNAVANJE_POTVRDJENO",
    id,
    `Potvrđeno prepoznavanje i otvorena konverzacija sa korisnikom ${zahtev.user.pseudonim}`
  );

  return NextResponse.json({ ok: true, konverzacijaId: konv.id });
}
