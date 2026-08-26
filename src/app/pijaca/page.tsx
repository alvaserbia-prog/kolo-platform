import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { parsirajKatParam } from "@/lib/kategorije";
import PijacaKlijent from "@/app/(app)/pijaca/PijacaKlijent";
import { ucitajUcesnika, usloviVidljivostiOglasa } from "@/lib/protokol/deca";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pijaca");
  return pageMetadata({
    title: t("meta_title"),
    description: t("meta_desc"),
    path: "/pijaca",
  });
}

export default async function PijacaPage({
  searchParams,
}: {
  searchParams: Promise<{ kat?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("pijaca");

  // Predizabrane kategorije iz URL-a (?kat=slug1,slug2) — deljivi linkovi, SSR.
  const { kat } = await searchParams;
  const initialKat = parsirajKatParam(kat);

  // Praćene kategorije (čip „Samo praćene") + lokacija iz profila
  // (početna referenca za filter udaljenosti).
  const korisnik = session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { location: true, praceneKategorije: { select: { category: true } } },
      })
    : null;
  const pracene = korisnik?.praceneKategorije.map((p) => p.category) ?? [];

  // Vidljivost oglasa maloletnog korisnika (Modul Deca, čl. 13).
  //
  // 🔴 Filter mora da stoji OVDE, a ne samo u `GET /api/pijaca`: `PijacaKlijent`
  // ceo spisak dobija kroz props sa servera i dalje filtrira samo u pretraživaču,
  // pa ruta koja isti uslov već sprovodi nije na putu kojim čovek dolazi na Pijacu.
  const posmatrac = session ? await ucitajUcesnika(session.user.id) : null;

  const listings = await prisma.marketplaceListing.findMany({
    where: { status: "ACTIVE", seller: usloviVidljivostiOglasa(posmatrac) },
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true, title: true, description: true, tip: true,
      cenaTip: true, price: true, cenaDo: true,
      category: true, images: true, location: true, createdAt: true,
      sellerId: true,
      seller: { select: { pseudonim: true, verified: true } },
    },
  });

  const isVerified = session?.user?.verified ?? false;

  return (
    <>
      {!session && (
        <div className="mb-5 bg-kolo-green-100 border border-kolo-green-500/20 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-kolo-green-900">
            {t("gost_tekst")}
          </p>
          <div className="flex gap-2 shrink-0">
            <Link href="/login" className="px-4 py-2 border border-kolo-green-700 text-kolo-green-700 text-sm font-semibold rounded-xl hover:bg-kolo-green-700 hover:text-white transition-colors">
              {t("prijavi_se")}
            </Link>
            <Link href="/registracija" className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
              {t("registruj_se")}
            </Link>
          </div>
        </div>
      )}
      <PijacaKlijent
        listings={listings.map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          tip: l.tip,
          cenaTip: l.cenaTip,
          price: l.price,
          cenaDo: l.cenaDo,
          category: l.category,
          slike: l.images.length,
          location: l.location ?? null,
          createdAt: l.createdAt.toISOString(),
          sellerId: l.sellerId,
          sellerPseudonim: l.seller.pseudonim,
          sellerVerified: l.seller.verified,
        }))}
        isVerified={isVerified}
        prijavljen={!!session?.user}
        initialKat={initialKat}
        pracene={pracene}
        mojaLokacija={korisnik?.location ?? null}
      />
    </>
  );
}
