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

const PRAVILNICI = [
  {
    slug: "kolo-sistem",
    naziv: "Pravilnik o KOLO sistemu",
    opis: "Osnovni akt sistema (12 glava, 82 člana). Uređuje POEN, ZRNO, obračunski koeficijent, dokaz stvarnosti, kanale evidentiranja doprinosa, module i upravljanje.",
  },
  {
    slug: "hijerarhija",
    naziv: "Pravilnik o hijerarhiji akata",
    opis: "Uređuje odnose između opštih akata Fondacije i platformskih akata, postupak donošenja i izmena.",
  },
  {
    slug: "dokaz-stvarnosti",
    naziv: "Pravilnik o dokazu stvarnosti",
    opis: "Operativna mehanika verifikacije korisnika kroz lanac jemstva: indeks stvarnosti, verifikacioni kapacitet, anti-cirkularno pravilo.",
  },
  {
    slug: "pokroviteljstvo-donacije",
    naziv: "Pravilnik o pokroviteljstvu i donacijama",
    opis: "Nivoi donacija fizičkih lica (11 nivoa, koeficijent 1,00–2,00) i nivoi pokroviteljstva pravnih lica (7 nivoa, prag 10.000 RSD).",
  },
  {
    slug: "operativni",
    naziv: "Pravilnik o operativnom doprinosu",
    opis: "Mehanika operativnog programa — objavljivanje zadataka i potvrda izvršenja od strane nosilaca ZRNA, odnosno Uprave Fondacije u prvoj fazi.",
  },
  {
    slug: "osnivacki",
    naziv: "Pravilnik o osnivačkom doprinosu",
    opis: "Naknadno evidentiranje rada obavljenog pre otvaranja platforme. Gornja granica 2.400.000 POEN-a; kanal se trajno zatvara.",
  },
  {
    slug: "gornje-kolo",
    naziv: "Pravilnik o Gornjem Kolu",
    opis: "Glasanje, delegiranje i odlučivanje u Gornjem Kolu; obračunski period glasanja, kvadratna glasačka moć i zaštitni veto Fondacije.",
  },
  {
    slug: "programi-podrske",
    naziv: "Pravilnik o programima podrške",
    opis: "Socijalni programi (Podrška majkama, starijima, posebna briga, školovanje) — uslovi, koeficijenti i verifikatorska potvrda.",
  },
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
        {PRAVILNICI.map((p) => (
          <Link
            key={p.slug}
            href={`/pravilnik/${p.slug}`}
            className="block bg-white rounded-2xl card-shadow p-5 hover:shadow-md transition-shadow border-t-4 border-kolo-green-700"
          >
            <h2 className="font-bold text-kolo-green-900 text-lg leading-snug mb-2" style={{ letterSpacing: "-0.01em" }}>
              {p.naziv}
            </h2>
            <p className="text-sm text-kolo-muted leading-relaxed">
              {p.opis}
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
