import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PocetnaKlijent from "./PocetnaKlijent";
import { jeAdmin } from "@/lib/dozvole";

export default async function PocetnaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

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
