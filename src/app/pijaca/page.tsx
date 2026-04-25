import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PijacaKlijent from "@/app/(app)/pijaca/PijacaKlijent";
import Link from "next/link";

export default async function PijacaPage() {
  const session = await getServerSession(authOptions);

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

  const isVerified = session?.user?.verified ?? false;

  return (
    <>
      {!session && (
        <div className="mb-5 bg-kolo-green-100 border border-kolo-green-500/20 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-kolo-green-900">
            Pogledajte šta nudi KOLO krug. Za kupovinu je potrebna verifikacija.
          </p>
          <div className="flex gap-2 shrink-0">
            <Link href="/login" className="px-4 py-2 border border-kolo-green-700 text-kolo-green-700 text-sm font-semibold rounded-xl hover:bg-kolo-green-700 hover:text-white transition-colors">
              Prijavi se
            </Link>
            <Link href="/registracija" className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
              Registruj se
            </Link>
          </div>
        </div>
      )}
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
        isVerified={isVerified}
      />
    </>
  );
}
