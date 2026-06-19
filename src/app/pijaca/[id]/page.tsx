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
        // Kontakt (telefon) se ne šalje klijentu osim verifikovanima (Politika čl. 6) —
        // ne sme „procuriti" kroz props ni za neverifikovane, čak i da se ne renderuje.
        phone: session?.user?.verified ? (listing.phone ?? null) : null,
        status: listing.status,
        createdAt: listing.createdAt.toISOString(),
        sellerId: listing.seller.id,
        sellerPseudonim: listing.seller.pseudonim,
        sellerVerified: listing.seller.verified,
        isMine: listing.seller.id === session?.user?.id,
      }}
      isVerified={session?.user?.verified ?? false}
    />
  );
}
