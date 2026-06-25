import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/lib/seo";
import OglasDetalj from "../../(app)/pijaca/[id]/OglasDetalj";

// Apsolutni URL slike oglasa za OG/Twitter karticu (Facebook, Viber, WhatsApp…).
// R2/CDN slike su već apsolutne — koristimo ih direktno. Legacy disk putanje
// služe se preko API rute (apsolutizovane na kanonski domen). Bez slike →
// vraća undefined, pa OG nasleđuje podrazumevanu dinamičku sliku iz opengraph-image.tsx.
function ogSlikaUrl(images: string[], id: string): string | undefined {
  if (images.length === 0) return undefined;
  const prva = images[0];
  if (/^https?:\/\//i.test(prva)) return prva;
  return absoluteUrl(`/api/pijaca/slika/${id}/0`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { title: true, description: true, images: true },
  });
  if (!listing) return {};

  // Opis sa kartice (početni deo), fallback na opšti opis sistema.
  const opis = (listing.description?.trim() || SITE_DESCRIPTION).slice(0, 200);
  const slika = ogSlikaUrl(listing.images, id);
  const putanja = `/pijaca/${id}`;

  return {
    title: { absolute: `${listing.title} — ${SITE_NAME}` },
    description: opis,
    alternates: { canonical: putanja },
    openGraph: {
      type: "website",
      url: absoluteUrl(putanja),
      siteName: SITE_NAME,
      title: listing.title,
      description: opis,
      ...(slika ? { images: [{ url: slika }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: opis,
      ...(slika ? { images: [slika] } : {}),
    },
  };
}

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
        tip: listing.tip,
        cenaTip: listing.cenaTip,
        price: listing.price,
        cenaDo: listing.cenaDo,
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
