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
    select: {
      id: true,
      tekst: true,
      posiljacId: true,
      procitana: true,
      createdAt: true,
      // Povod razgovora: kartica oglasa stoji iznad poruke kojom je pokrenut,
      // da se i posle mesec dana zna o čemu se pričalo.
      oglas: { select: { id: true, title: true, images: true } },
    },
  });

  // Označi primljene poruke kao pročitane
  await prisma.poruka.updateMany({
    where: { konverzacijaId: konvId, posiljacId: drugiId, procitana: false },
    data: { procitana: true },
  });

  // Povod koji još čeka na prvu poruku — podsetnik iznad polja za kucanje.
  const cekaPovod = await prisma.konverzacija.findUnique({
    where: { id: konvId },
    select: { povodOglas: { select: { id: true, title: true, images: true, sellerId: true } } },
  });
  const povod =
    cekaPovod?.povodOglas && cekaPovod.povodOglas.sellerId !== session.user.id
      ? { id: cekaPovod.povodOglas.id, naslov: cekaPovod.povodOglas.title, imaSliku: cekaPovod.povodOglas.images.length > 0 }
      : null;

  return NextResponse.json({
    drugiUser,
    povod,
    mojAvatar: jaUser?.avatar ?? null,
    mojPseudonim: session.user.pseudonim,
    poruke: poruke.map((p) => ({
      id: p.id,
      tekst: p.tekst,
      moja: p.posiljacId === session.user.id,
      createdAt: p.createdAt.toISOString(),
      oglas: p.oglas ? { id: p.oglas.id, naslov: p.oglas.title, imaSliku: p.oglas.images.length > 0 } : null,
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

  // Povod čeka otkad je kliknuto „Kontaktiraj". Troši ga PRVA poruka onoga ko
  // nije vlasnik oglasa — vlasnik odgovara na svoj oglas, njemu kartica ne treba.
  const konvPovod = await prisma.konverzacija.findUnique({
    where: { id: konvId },
    select: { povodOglasId: true, povodOglas: { select: { sellerId: true } } },
  });
  const povodOglasId =
    konvPovod?.povodOglasId && konvPovod.povodOglas?.sellerId !== session.user.id
      ? konvPovod.povodOglasId
      : null;

  const [poruka] = await prisma.$transaction([
    prisma.poruka.create({
      data: {
        konverzacijaId: konvId,
        posiljacId: session.user.id,
        tekst: tekst.trim(),
        oglasId: povodOglasId,
      },
    }),
    prisma.konverzacija.update({
      where: { id: konvId },
      // Povod je iskorišćen — briše se, da ga naredne poruke ne ponove.
      data: { lastMessageAt: new Date(), ...(povodOglasId ? { povodOglasId: null } : {}) },
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
