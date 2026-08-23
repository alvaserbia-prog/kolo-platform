import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PocetnaKlijent from "./PocetnaKlijent";
import { jeAdmin } from "@/lib/dozvole";
import { ChatSoba } from "@/generated/prisma/client";
import { usloviVidljivostiOglasa, ucitajUcesnika } from "@/lib/protokol/deca";
import { dohvatiPrijatelje, idPrijatelja } from "@/lib/protokol/prijateljstva";
import { smeUPricaonicu } from "@/lib/deca-pravila";
import DecjaPocetna from "./DecjaPocetna";
import { karticaSkoleZaDete } from "@/lib/protokol/skole";

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
    // Nalog koji još čeka roditelja (čl. 4c) nema Pričaonicu. Ne prazna soba nego
    // NIJEDNA poruka ne stiže do klijenta — filter je i na serveru, ne samo u
    // prikazu, jer je to bezbednosno pravilo a ne ukras.
    const soba = smeUPricaonicu(ja.stanje);
    const vidljiviAutori = soba ? await idPrijatelja(ja.id) : [];
    // Šestocifreni kod stoji na ekranu deteta koje čeka: to je rezervni put do
    // roditelja kad poruka ne stigne, i dete ga sa ekrana može pročitati naglas.
    const poziv = soba
      ? null
      : await prisma.roditeljPoziv.findUnique({
          where: { deteId: ja.id },
          select: { kod: true },
        });
    const [zapis, prijatelji, oglasi, mojihOglasa, chatDeca, karticaSkole] = await Promise.all([
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
      // Svako vidi SAMO poruke svojih prijatelja (čl. 18 st. 3) — jedna soba,
      // filtrirana grafom prijateljstava.
      soba
        ? prisma.chatMessage.findMany({
            where: { uklonjenoAt: null, soba: ChatSoba.DECA, userId: { in: vidljiviAutori } },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: { user: { select: { id: true, pseudonim: true, avatar: true } } },
          })
        : Promise.resolve([]),
      // Kartica škole (čl. 7). `null` dok dete nije izabralo školu ili dok
      // zvaničan spisak škola nije uvezen.
      karticaSkoleZaDete(ja.id),
    ]);

    return (
      <DecjaPocetna
        skola={karticaSkole}
        pseudonim={session.user.pseudonim}
        mojId={ja.id}
        poen={zapis?.balance ?? 0}
        brojPrijatelja={prijatelji.broj}
        poenNaCekanju={prijatelji.poenNaCekanju}
        stanje={ja.stanje}
        kod={poziv?.kod ?? null}
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
