import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { posaljiPush } from "@/lib/push";
import { posaljiEmailKorisniku } from "@/lib/email";

async function getKonv(konvId: string, meId: string) {
  const k = await prisma.konverzacija.findUnique({ where: { id: konvId } });
  if (!k || (k.user1Id !== meId && k.user2Id !== meId)) return null;
  return k;
}

// GET — poruke u konverzaciji (poslednjih 50)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ konvId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Unauthorized", 401);
  const { konvId } = await params;

  const k = await getKonv(konvId, session.user.id);
  if (!k) return await greska("Konverzacija nije pronađena.", 404);

  const drugiId = k.user1Id === session.user.id ? k.user2Id : k.user1Id;
  const [drugiUser, jaUser] = await Promise.all([
    prisma.user.findUnique({ where: { id: drugiId }, select: { id: true, pseudonim: true, avatar: true } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { avatar: true } }),
  ]);

  const poruke = await prisma.poruka.findMany({
    where: { konverzacijaId: konvId },
    orderBy: { createdAt: "asc" },
    take: 50,
    select: { id: true, tekst: true, posiljacId: true, procitana: true, createdAt: true },
  });

  // Označi primljene poruke kao pročitane
  await prisma.poruka.updateMany({
    where: { konverzacijaId: konvId, posiljacId: drugiId, procitana: false },
    data: { procitana: true },
  });

  return NextResponse.json({
    drugiUser,
    mojAvatar: jaUser?.avatar ?? null,
    mojPseudonim: session.user.pseudonim,
    poruke: poruke.map((p) => ({
      id: p.id,
      tekst: p.tekst,
      moja: p.posiljacId === session.user.id,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

// POST — pošalji poruku
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ konvId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Unauthorized", 401);
  const { konvId } = await params;

  // Slanje je dozvoljeno svakom UČESNIKU konverzacije (getKonv to proverava).
  // Neverifikovani NE MOŽE da inicira konverzaciju (vidi POST /api/poruke), pa
  // može biti učesnik samo u konverzaciji koju je verifikovani pokrenuo povodom
  // njegovog zahteva za jemstvo (Uslovi čl. 16, Politika čl. 6) — tu sme da uzvrati.
  const k = await getKonv(konvId, session.user.id);
  if (!k) return await greska("Konverzacija nije pronađena.", 404);

  const { tekst } = await req.json();
  if (!tekst?.trim()) return await greska("Poruka ne sme biti prazna.", 400);
  if (tekst.trim().length > 1000) return await greska("Poruka je predugačka (max 1000 znakova).", 400);

  const [poruka] = await prisma.$transaction([
    prisma.poruka.create({
      data: { konverzacijaId: konvId, posiljacId: session.user.id, tekst: tekst.trim() },
    }),
    prisma.konverzacija.update({
      where: { id: konvId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  // Nove poruke se NE evidentiraju kao notifikacije (zvonce) — nepročitane poruke
  // se broje crvenim badge-om na ikonici "Poruke" (GET /api/poruke/brojac).
  // Push na telefon primaoca (ako je uključio obaveštenja). Ne blokira odgovor.
  const primalacId = k.user1Id === session.user.id ? k.user2Id : k.user1Id;
  const isecak = poruka.tekst.length > 120 ? `${poruka.tekst.slice(0, 120)}…` : poruka.tekst;
  void posaljiPush(primalacId, {
    naslov: `Nova poruka — ${session.user.pseudonim}`,
    tekst: isecak,
    link: `/poruke?k=${konvId}`,
    tip: "poruka",
  });

  // Email primaocu — samo za PRVU nepročitanu poruku u nizu. Dok primalac ne
  // otvori konverzaciju, dalje poruke ne šalju mejl (inače bi razgovor od deset
  // poruka poslao deset mejlova). Kad pročita, sledeća poruka opet šalje.
  void (async () => {
    try {
      const neprocitane = await prisma.poruka.count({
        where: {
          konverzacijaId: konvId,
          posiljacId: session.user.id,
          procitana: false,
          id: { not: poruka.id },
        },
      });
      if (neprocitane > 0) return;
      await posaljiEmailKorisniku(primalacId, {
        naslov: `Nova poruka — ${session.user.pseudonim}`,
        tekst: isecak,
        link: `/poruke?k=${konvId}`,
        linkTekst: "Otvori poruku",
      });
    } catch (err) {
      console.error("[poruke] Email obaveštenje nije poslato:", err);
    }
  })();

  return NextResponse.json({
    id: poruka.id,
    tekst: poruka.tekst,
    moja: true,
    createdAt: poruka.createdAt.toISOString(),
  });
}
