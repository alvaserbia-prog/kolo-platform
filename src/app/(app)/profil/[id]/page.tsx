import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function JavniProfilPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  // Ne prikazuj sopstveni profil ovde — preusmeri na /profil
  if (id === session.user.id) redirect("/profil");

  const korisnik = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      pseudonim: true,
      verified: true,
      verifiedAt: true,
      location: true,
      createdAt: true,
      role: true,
      status: true,
      zadrugaMemberships: {
        where: { leftAt: null },
        include: { zadruga: { select: { id: true, name: true } } },
        take: 1,
      },
    },
  });

  if (!korisnik || korisnik.status === "EXCLUDED" || korisnik.role === "ADMIN") notFound();

  const zadruga = korisnik.zadrugaMemberships[0]?.zadruga ?? null;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2 text-sm text-kolo-muted">
        <Link href="/zajednica" className="hover:text-kolo-green-700 transition-colors">Zajednica</Link>
        <span>/</span>
        <span className="text-kolo-text">{korisnik.pseudonim}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{korisnik.pseudonim}</h1>
            {korisnik.location && (
              <p className="text-sm text-gray-500 mt-0.5">{korisnik.location}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {korisnik.verified ? (
              <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full">
                Verifikovan
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">
                Neverifikovan
              </span>
            )}
            {korisnik.status === "SUSPENDED" && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full">
                Suspendovan
              </span>
            )}
          </div>
        </div>

        <dl className="space-y-2.5 text-sm border-t border-gray-100 pt-4">
          {zadruga && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Zadruga</dt>
              <dd>
                <Link
                  href={`/zajednica/${zadruga.id}`}
                  className="font-medium text-kolo-green-700 hover:underline"
                >
                  {zadruga.name}
                </Link>
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-gray-500">Član od</dt>
            <dd className="text-gray-700">
              {new Date(korisnik.createdAt).toLocaleDateString("sr-RS", { year: "numeric", month: "long" })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
