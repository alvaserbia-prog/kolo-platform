/**
 * /tabla-jemstva — stranica ostaje samo kao razmena adrese.
 *
 * Tabla zahteva za jemstvo je ukinuta (Pravilnik 4.1.0 čl. 32 st. 4, Uslovi čl. 14
 * i 16 brisani). Adresa se NE gasi ćutke i ne preusmerava automatski: postoje stari
 * linkovi u notifikacijama i mejlovima, a čovek koji dođe preko njih mora da sazna
 * ŠTA je tablu zamenilo — inače izgleda kao da je put do verifikacije nestao.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TablaJemstvaUkinutaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const t = await getTranslations("tablaJemstva");

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
        <h1 className="kolo-naslov">{t("ukinuta_naslov")}</h1>
        <p className="text-kolo-muted leading-relaxed">{t("ukinuta_opis")}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={session.user.verified ? "/pijaca" : "/pijaca/novi-oglas"}
            className="inline-flex items-center px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors"
          >
            {t(session.user.verified ? "ukinuta_dugme_pijaca" : "ukinuta_dugme_objavi")}
          </Link>
          <Link
            href="/verifikacija"
            className="inline-flex items-center px-4 py-2 rounded-xl border border-kolo-border text-sm font-medium hover:border-kolo-green-700 transition-colors"
          >
            {t("ukinuta_dugme_verifikacija")}
          </Link>
        </div>
      </div>
    </div>
  );
}
