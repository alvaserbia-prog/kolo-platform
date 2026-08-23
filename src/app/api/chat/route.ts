import { NextRequest, NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChatSoba } from "@/generated/prisma/client";
import { idPrijatelja, smeUSobu } from "@/lib/protokol/prijateljstva";
import { PORUKA_CEKA_RODITELJA } from "@/lib/deca-pravila";

/**
 * Soba se IZVODI iz toga ko je prijavljen, ne bira se parametrom (Modul Deca,
 * čl. 12). Maloletni korisnik uvek dobija dečju sobu, punoletni sobu odraslih —
 * pa ne postoji adresa kojom bi odrasli ušao među decu ni obrnuto.
 */
async function mojaSoba(userId: string): Promise<ChatSoba> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { maloletan: true } });
  return u?.maloletan ? ChatSoba.DECA : ChatSoba.ODRASLI;
}

/**
 * Uslov nad autorima poruka koje korisnik vidi.
 *
 * ─── Dečja soba: svako vidi samo poruke SVOJIH PRIJATELJA (čl. 18 st. 3) ────
 *
 * Jedna soba za svu decu, ali filtrirana grafom prijateljstava. Posledica koja se
 * dobija besplatno: kad su svi učesnici međusobno prijatelji, sam od sebe nastaje
 * grupni razgovor — graf pravi sobe umesto nas.
 *
 * 🟡 Poznata i PRIHVAĆENA posledica: kad Milica napiše poruku, vide je svi njeni
 * prijatelji; Ana odgovori, i taj odgovor vidi Petar, koji je Milicin prijatelj a
 * Anu ne poznaje — pa mu Anina poruka stoji bez povoda. To nije greška.
 *
 * 🔴 Zato u dečjoj sobi NEMA odgovora sa citatom. Citat bi Petru pokazao Milicin
 * tekst i zaobišao ovaj filter. Ne dodavati citiranje.
 */
async function vidljiviAutori(userId: string, soba: ChatSoba): Promise<string[] | null> {
  if (soba !== ChatSoba.DECA) return null;
  return idPrijatelja(userId);
}

// GET /api/chat — poslednje poruke (samo prijavljeni)
// Query: ?since=ISO-datum (opciono) — vraća samo poruke nakon datog vremena
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return await greska("Pristup samo za prijavljene.", 401);
  }

  const url = new URL(req.url);
  const since = url.searchParams.get("since");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "100"), 200);

  const soba = await mojaSoba(session.user.id);
  // Nalog koji još čeka roditelja (čl. 4c) sobu ne vidi — ni da čita. Vraća se
  // prazna soba, a ekran deteta objašnjava zašto i šta mu to otvara.
  if (soba === ChatSoba.DECA && !(await smeUSobu(session.user.id))) {
    return NextResponse.json([]);
  }
  const autori = await vidljiviAutori(session.user.id, soba);

  // Uklonjene poruke (Uslovi čl. 25 st. 2) nestaju iz sobe za sve — i za autora.
  const where = {
    uklonjenoAt: null,
    soba,
    ...(autori ? { userId: { in: autori } } : {}),
    ...(since ? { createdAt: { gt: new Date(since) } } : {}),
  };
  const poruke = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, pseudonim: true, verified: true, avatar: true } } },
  });

  return NextResponse.json(
    poruke
      .map((p) => ({
        id: p.id,
        userId: p.user.id,
        pseudonim: p.user.pseudonim,
        verified: p.user.verified,
        avatar: p.user.avatar,
        content: p.content,
        createdAt: p.createdAt.toISOString(),
      }))
      .reverse()
  );
}

// POST /api/chat — slanje poruke (samo verifikovani)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return await greska("Pristup samo za prijavljene.", 401);
  }
  // 🔴 Dete piše u svojoj sobi BEZ ikakve potvrde. Uslov „samo potvrđeni" je pisan
  // za sobu odraslih; preneseno na decu, dečja soba bi zauvek bila samo za čitanje,
  // jer maloletni korisnik potvrdu nikad ne stiče (Modul Deca, čl. 15).
  const soba = await mojaSoba(session.user.id);
  if (soba === ChatSoba.ODRASLI && !session.user.verified) {
    return await greska("Pisanje u pričaonicu je dostupno samo verifikovanim članovima.", 403);
  }
  // Zato što potvrde nema, uslov za dečju sobu je STANJE NALOGA: iza deteta mora da
  // stoji roditelj koji je sam prošao registraciju (čl. 18 st. 2). Bez toga bi se
  // odrastao čovek predstavio kao dvanaestogodišnjak bez ijedne prepreke — ranije je
  // taj rizik hvatalo roditeljsko čitanje razgovora, koje je ukinuto.
  if (soba === ChatSoba.DECA && !(await smeUSobu(session.user.id))) {
    return await greska(PORUKA_CEKA_RODITELJA, 403);
  }

  const body = await req.json();
  const content = (body.content ?? "").toString().trim();

  if (!content) {
    return await greska("Poruka ne sme biti prazna.", 400);
  }
  if (content.length > 1000) {
    return await greska("Poruka najviše 1000 znakova.", 400);
  }

  const poruka = await prisma.chatMessage.create({
    data: {
      userId: session.user.id,
      content,
      soba,
    },
    include: { user: { select: { id: true, pseudonim: true, verified: true, avatar: true } } },
  });

  return NextResponse.json({
    ok: true,
    poruka: {
      id: poruka.id,
      userId: poruka.user.id,
      pseudonim: poruka.user.pseudonim,
      verified: poruka.user.verified,
      avatar: poruka.user.avatar,
      content: poruka.content,
      createdAt: poruka.createdAt.toISOString(),
    },
  });
}
