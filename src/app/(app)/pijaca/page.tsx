import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PijacaKlijent from "./PijacaKlijent";

export default async function PijacaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const listings = await prisma.marketplaceListing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true, title: true, description: true, price: true,
      category: true, images: true, location: true, createdAt: true,
      seller: { select: { pseudonim: true, verified: true } },
    },
  });

  return (
    <PijacaKlijent
      listings={listings.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        price: l.price,
        category: l.category,
        slike: l.images.length,
        location: l.location ?? null,
        createdAt: l.createdAt.toISOString(),
        sellerPseudonim: l.seller.pseudonim,
        sellerVerified: l.seller.verified,
      }))}
      isVerified={session.user.verified}
    />
  );
}
