import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/lib/seo";
import OglasDetalj from "../../(app)/pijaca/[id]/OglasDetalj";
import { IZBOR_UCESNIKA, smeDaVidiOglas, ucesnikIzReda, ucitajUcesnika } from "@/lib/protokol/deca";
import { jeAdmin } from "@/lib/dozvole";

// og:image se ovde NE navodi — obezbeđuje ga susedni `opengraph-image.tsx`
// (1200×630 PNG sa fotografijom oglasa, uz og:image:width/height/type), jedini
// oblik koji Viber i Messenger pouzdano prikazuju pri PRVOM deljenju linka.
// Twitter/X bez sopstvene slike pada nazad na og:image.
//
// Ta ruta sprovodi vidljivost oglasa deteta sama za sebe — file-convention
// slika se emituje i kad `generateMetadata` vrati prazno.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    select: { title: true, description: true, seller: { select: { maloletan: true } } },
  });
  if (!listing) return {};

  // Oglas maloletnog korisnika nije javno dostupan (Modul Deca, čl. 13), pa mu
  // naslov i opis ne smeju u zaglavlje stranice ni u OG karticu — odatle ih
  // pokupe Gugl i svaki program za poruke, bez ijedne prijave. Sliku zatvara
  // `opengraph-image.tsx` sopstvenom proverom.
  if (listing.seller.maloletan) return {};

  // Opis sa kartice (početni deo), fallback na opšti opis sistema.
  const opis = (listing.description?.trim() || SITE_DESCRIPTION).slice(0, 200);
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
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: opis,
    },
  };
}

export default async function OglasPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: {
      seller: { select: { ...IZBOR_UCESNIKA, pseudonim: true, verified: true } },
    },
  });

  if (!listing) notFound();

  // Vidljivost oglasa maloletnog korisnika (Modul Deca, čl. 13).
  //
  // 🔴 `notFound()`, ne poruka o zabrani: poruka bi potvrdila da oglas postoji, a
  // time i da postoji dete koje ga je objavilo — upravo ono što se skriva. Isti
  // izbor kao 404 u `GET /api/pijaca/[id]`.
  const posmatrac = session ? await ucitajUcesnika(session.user.id) : null;
  const smem = smeDaVidiOglas(
    posmatrac ? { ...posmatrac, admin: jeAdmin(session?.user) } : null,
    ucesnikIzReda(listing.seller),
  );
  if (!smem) notFound();

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
        sellerMaloletan: listing.seller.maloletan,
        isMine: listing.seller.id === session?.user?.id,
        pregledi: listing.pregledi,
        // Razlog uklanjanja se saopštava vlasniku (Uslovi čl. 25 st. 2), ne javnosti.
        uklonjenRazlog:
          listing.seller.id === session?.user?.id ? (listing.uklonjenRazlog ?? null) : null,
      }}
      isVerified={session?.user?.verified ?? false}
      jePrijavljen={!!session?.user}
      posmatracMaloletan={posmatrac?.maloletan ?? false}
    />
  );
}
