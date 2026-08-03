/**
 * /graf — Graf verifikacija: prikaz cele mreže jemstva.
 *
 * Vidljiv isključivo verifikovanim korisnicima (indeks ≥ 10% / nosilac ZRNA) —
 * graf verifikacija se ne izlaže javno (Politika privatnosti čl. 6).
 * Neverifikovanom se prikazuje objašnjenje umesto grafa (bez 403 stranice).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { imaPristupVerifikaciji } from "@/lib/protokol/dokaz-stvarnosti";
import GrafKlijent from "@/components/graf/GrafKlijent";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function GrafPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const t = await getTranslations("graf");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tipKorisnika: true, indeksStvarnosti: true },
  });
  const imaPristup =
    !!user && imaPristupVerifikaciji(user.tipKorisnika, user.indeksStvarnosti);

  if (!imaPristup) {
    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="kolo-naslov">{t("naslov")}</h1>
          <p className="text-kolo-muted">{t("opis")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center space-y-3">
          <p className="font-semibold text-kolo-text">{t("zakljucano_naslov")}</p>
          <p className="text-sm text-kolo-muted">{t("zakljucano_opis")}</p>
          <Link
            href="/verifikacija"
            className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
          >
            {t("zakljucano_dugme")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-4">
      <div className="space-y-1">
        <h1 className="kolo-naslov">{t("naslov")}</h1>
        <p className="text-kolo-muted">{t("opis")}</p>
      </div>
      <GrafKlijent />
    </div>
  );
}
