import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PocetnaKlijent from "./PocetnaKlijent";
import { jeAdmin } from "@/lib/dozvole";
import { ChatSoba } from "@/generated/prisma/client";
import { usloviVidljivostiOglasa, ucitajUcesnika } from "@/lib/protokol/deca";
import { dohvatiPrijatelje } from "@/lib/protokol/prijateljstva";
import DecjaPocetna from "./DecjaPocetna";

export default async function PocetnaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Maloletni korisnik dobija SVOJU početnu. Ista ruta namerno: klik na logo vodi
  // svakoga „kući", pa dete tako ne završi u Pričaonici odraslih.
  //
  // Sve stoji na JEDNOM ekranu — POEN, dugmad, oglasi i soba — po skici koju je
  // nacrtalo dete. Za sedmogodišnjaka meni iza hamburgera ne postoji; postoji ono
  // što vidi pred sobom.
  const ja = await ucitajUcesnika(session.user.id);
  if (ja?.maloletan) {
    const [zapis, prijatelji, oglasi, mojihOglasa, chatDeca] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId: ja.id }, select: { balance: true } }),
      dohvatiPrijatelje(ja.id),
      prisma.marketplaceListing.findMany({
        where: { status: "ACTIVE", seller: usloviVidljivostiOglasa(ja) },
        orderBy: { createdAt: "desc" },
        take: 24,
        select: {
          id: true, title: true, description: true, price: true, cenaTip: true,
          images: true, seller: { select: { pseudonim: true } },
        },
      }),
      prisma.marketplaceListing.count({ where: { sellerId: ja.id, status: "ACTIVE" } }),
      prisma.chatMessage.findMany({
        where: { uklonjenoAt: null, soba: ChatSoba.DECA },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: { select: { id: true, pseudonim: true, avatar: true } } },
      }),
    ]);

    return (
      <DecjaPocetna
        pseudonim={session.user.pseudonim}
        mojId={ja.id}
        poen={zapis?.balance ?? 0}
        brojPrijatelja={prijatelji.broj}
        mojihOglasa={mojihOglasa}
        oglasi={oglasi.map((o) => ({
          id: o.id,
          naslov: o.title,
          opis: o.description,
          cena: o.price,
          cenaTip: o.cenaTip,
          imaSliku: o.images.length > 0,
          oglasivac: o.seller.pseudonim,
        }))}
        chatInicijalno={chatDeca
          .map((p) => ({
            id: p.id,
            userId: p.user.id,
            pseudonim: p.user.pseudonim,
            avatar: p.user.avatar,
            content: p.content,
            createdAt: p.createdAt.toISOString(),
          }))
          .reverse()}
      />
    );
  }

  // Brojač na vrhu početne: članovi, oglasi, razmene, opticaj. Isti izvor kao
  // kartice na /sistem — „razmene" su prenosi između korisnika (TRANSFER), a
  // „opticaj" apsolutna vrednost protivzapisa Protokola.
  const [blogObjave, chatPoruke, clanovi, oglasi, razmene, protokol] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { author: { select: { pseudonim: true } } },
    }),
    prisma.chatMessage.findMany({
      where: { uklonjenoAt: null },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { id: true, pseudonim: true, verified: true, avatar: true } } },
    }),
    prisma.user.count({ where: { deaktiviranAt: null } }),
    prisma.marketplaceListing.count({ where: { status: "ACTIVE" } }),
    prisma.transaction.count({ where: { type: "TRANSFER" } }),
    prisma.wallet.findUnique({ where: { id: "banka-singleton" }, select: { balance: true } }),
  ]);

  const blog = blogObjave.map((o) => ({
    id: o.id,
    title: o.title,
    content: o.content,
    authorPseudonim: o.author.pseudonim,
    publishedAt: o.publishedAt.toISOString(),
  }));

  const chat = chatPoruke
    .map((p) => ({
      id: p.id,
      userId: p.user.id,
      pseudonim: p.user.pseudonim,
      verified: p.user.verified,
      avatar: p.user.avatar,
      content: p.content,
      createdAt: p.createdAt.toISOString(),
    }))
    .reverse();

  return (
    <PocetnaKlijent
      pseudonim={session.user.pseudonim}
      verified={session.user.verified}
      currentUserId={session.user.id}
      blog={blog}
      chatInicijalno={chat}
      jeAdminViewer={jeAdmin(session.user)}
      brojac={{
        clanovi,
        oglasi,
        razmene,
        opticaj: protokol ? Math.abs(protokol.balance) : 0,
      }}
    />
  );
}
