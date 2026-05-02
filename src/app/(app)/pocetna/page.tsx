import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PocetnaKlijent from "./PocetnaKlijent";

export default async function PocetnaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [blogObjave, chatPoruke] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { author: { select: { pseudonim: true } } },
    }),
    prisma.chatMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { id: true, pseudonim: true, verified: true } } },
    }),
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
    />
  );
}
