import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OglasDetalj from "../../(app)/pijaca/[id]/OglasDetalj";

export default async function OglasPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: {
      seller: { select: { id: true, pseudonim: true, verified: true } },
    },
  });

  if (!listing) notFound();

  const walletBalance = session
    ? ((await prisma.wallet.findUnique({
        where: { userId: session.user.id },
        select: { balance: true },
      }))?.balance ?? 0)
    : 0;

  return (
    <OglasDetalj
      oglas={{
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        images: listing.images,
        location: listing.location ?? null,
        phone: listing.phone ?? null,
        status: listing.status,
        createdAt: listing.createdAt.toISOString(),
        sellerId: listing.seller.id,
        sellerPseudonim: listing.seller.pseudonim,
        sellerVerified: listing.seller.verified,
        isMine: listing.seller.id === session?.user?.id,
      }}
      isVerified={session?.user?.verified ?? false}
      walletBalance={walletBalance}
    />
  );
}
