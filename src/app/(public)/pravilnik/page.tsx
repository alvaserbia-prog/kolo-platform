import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pravne");
  return pageMetadata({
    title: t("meta_pravilnik_title"),
    description: t("meta_pravilnik_desc"),
    path: "/pravilnik",
  });
}

// Redosled prikaza pravilnika; nazivi i opisi se čitaju iz i18n (pravne.rb.<slug>).
const SLUGOVI = [
  "kolo-sistem",
  "hijerarhija",
  "dokaz-stvarnosti",
  "pokroviteljstvo-donacije",
  "operativni",
  "osnivacki",
  "gornje-kolo",
  "programi-podrske",
] as const;

export default async function PravilniciIndex() {
  const t = await getTranslations("pravne");

  return (
    <div className="max-w-[800px] mx-auto pb-16">

      <div className="mb-8">
        <p className="text-xs text-kolo-muted mb-1">{t("eyebrow")}</p>
        <h1 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          {t("pravilnik.naslov")}
        </h1>
        <p className="text-sm text-kolo-muted mt-2">{t("verzija")} {t("pravilnik.ver")}</p>
        <div className="mt-4 flex gap-3 text-sm flex-wrap">
          <span className="text-kolo-muted">{t("viditeI")}</span>
          <Link href="/statut" className="text-kolo-green-700 hover:underline">{t("link.statut")}</Link>
          <Link href="/whitepaper" className="text-kolo-green-700 hover:underline">{t("link.whitepaper")}</Link>
          <Link href="/privatnost" className="text-kolo-green-700 hover:underline">{t("link.privatnost")}</Link>
          <Link href="/uslovi" className="text-kolo-green-700 hover:underline">{t("link.uslovi")}</Link>
          <Link href="/dpia" className="text-kolo-green-700 hover:underline">{t("link.dpiaKratko")}</Link>
          <Link href="/radnje-obrade" className="text-kolo-green-700 hover:underline">{t("link.radnjeObrade")}</Link>
          <Link href="/rizici" className="text-kolo-green-700 hover:underline">{t("link.rizici")}</Link>
          <Link href="/zajednicko-dobro" className="text-kolo-green-700 hover:underline">{t("link.zajednickoDobro")}</Link>
        </div>
      </div>

      <div className="space-y-3">
        {SLUGOVI.map((slug) => (
          <Link
            key={slug}
            href={`/pravilnik/${slug}`}
            className="block bg-white rounded-2xl card-shadow p-5 hover:shadow-md transition-shadow border-t-4 border-kolo-green-700"
          >
            <h2 className="font-bold text-kolo-green-900 text-lg leading-snug mb-2" style={{ letterSpacing: "-0.01em" }}>
              {t(`rb.${slug}.naziv`)}
            </h2>
            <p className="text-sm text-kolo-muted leading-relaxed">
              {t(`rb.${slug}.opis`)}
            </p>
            <p className="text-sm font-medium text-kolo-green-700 mt-3">{t("otvoriDokument")}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-kolo-border flex flex-wrap gap-4 text-sm text-kolo-muted">
        <Link href="/" className="hover:text-kolo-green-700 transition-colors">
          {t("nazadNaPocetnu")}
        </Link>
      </div>
    </div>
  );
}
