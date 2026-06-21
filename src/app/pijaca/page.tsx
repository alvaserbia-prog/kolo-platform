import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PijacaKlijent from "@/app/(app)/pijaca/PijacaKlijent";
import Link from "next/link";

export default async function PijacaPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("pijaca");

  const listings = await prisma.marketplaceListing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      id: true, title: true, description: true,
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
      />
    </>
  );
}
