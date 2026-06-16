import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ucitajPravniDokument } from "@/lib/pravni-dokument";
import { pageMetadata } from "@/lib/seo";

const PRAVILNICI: Record<string, { naziv: string; fajl: string; verzija: string; opis: string }> = {
  "kolo-sistem": {
    naziv: "Pravilnik o KOLO sistemu",
    fajl: "Pravilnik_3_9_0.md",
    verzija: "3.8.0",
    opis: "Osnovni akt sistema — 12 glava, 82 člana.",
  },
  "hijerarhija": {
    naziv: "Pravilnik o hijerarhiji akata",
    fajl: "hijerarhija_3_9_0.md",
    verzija: "3.8.0",
    opis: "Odnosi između opštih akata Fondacije i platformskih akata.",
  },
  "dokaz-stvarnosti": {
    naziv: "Pravilnik o dokazu stvarnosti",
    fajl: "dokaz_stvarnosti_3_9_0.md",
    verzija: "3.8.0",
    opis: "Operativna mehanika verifikacije korisnika kroz lanac jemstva.",
  },
  "pokroviteljstvo-donacije": {
    naziv: "Pravilnik o pokroviteljstvu i donacijama",
    fajl: "donacije_3_9_0.md",
    verzija: "3.8.0",
    opis: "Nivoi donacija i pokroviteljstva.",
  },
  "operativni": {
    naziv: "Pravilnik o operativnom doprinosu",
    fajl: "operativni_3_9_0.md",
    verzija: "3.8.0",
    opis: "Operativni program — zadaci i potvrda izvršenja od strane nosilaca ZRNA, odnosno Uprave Fondacije.",
  },
  "osnivacki": {
    naziv: "Pravilnik o osnivačkom doprinosu",
    fajl: "osnivacki_3_9_0.md",
    verzija: "3.8.0",
    opis: "Naknadno evidentiranje rada pre otvaranja platforme.",
  },
  "gornje-kolo": {
    naziv: "Pravilnik o Gornjem Kolu",
    fajl: "gornje_kolo_3_9_0.md",
    verzija: "3.8.0",
    opis: "Glasanje, delegiranje i odlučivanje u Gornjem Kolu; zaštitni veto.",
  },
  "programi-podrske": {
    naziv: "Pravilnik o programima podrške",
    fajl: "programi_podrske_3_9_0.md",
    verzija: "3.8.0",
    opis: "Socijalni programi — uslovi i verifikatorska potvrda.",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PRAVILNICI[slug];
  if (!p) return { title: "KOLO" };
  const t = await getTranslations("pravne");
  const naziv = t(`rb.${slug}.naziv`);
  return pageMetadata({
    title: `${naziv} — KOLO`,
    description: `${naziv} ${p.verzija}. ${t(`rb.${slug}.opis`)}`,
    path: `/pravilnik/${slug}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(PRAVILNICI).map((slug) => ({ slug }));
}

export default async function PravilnikSlugPage({ params }: Props) {
  const { slug } = await params;
  const p = PRAVILNICI[slug];
  if (!p) notFound();

  const locale = await getLocale();
  const t = await getTranslations("pravne");
  const sadrzaj = await ucitajPravniDokument(p.fajl, locale);

  return (
    <div className="max-w-[800px] mx-auto pb-16">

      <div className="mb-8">
        <p className="text-xs text-kolo-muted mb-1">
          <Link href="/pravilnik" className="hover:text-kolo-green-700 transition-colors">{t("pravilnik.pravilnici")}</Link>
          {" / "}
          <span>{t(`rb.${slug}.naziv`)}</span>
        </p>
        <h1 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          {t(`rb.${slug}.naziv`)}
        </h1>
        <p className="text-sm text-kolo-muted mt-2">{t("verzija")} {p.verzija}</p>
      </div>

      <article
        className="
          text-sm text-kolo-text leading-relaxed text-body
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-kolo-green-900 [&_h1]:mb-6 [&_h1]:mt-8
          [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-kolo-green-900 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-kolo-border
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-kolo-green-900 [&_h3]:mb-3 [&_h3]:mt-6
          [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-kolo-text [&_h4]:mb-2 [&_h4]:mt-4
          [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_strong]:font-semibold [&_strong]:text-kolo-text
          [&_em]:italic
          [&_a]:text-kolo-green-700 [&_a]:underline
          [&_hr]:my-6 [&_hr]:border-kolo-border
          [&_blockquote]:border-l-4 [&_blockquote]:border-kolo-green-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-kolo-muted [&_blockquote]:my-4
          [&_code]:bg-kolo-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
          [&_table]:w-full [&_table]:my-4 [&_table]:text-sm
          [&_th]:text-left [&_th]:font-semibold [&_th]:p-2 [&_th]:border-b [&_th]:border-kolo-border [&_th]:bg-kolo-bg
          [&_td]:p-2 [&_td]:border-b [&_td]:border-kolo-border [&_td]:align-top
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sadrzaj}</ReactMarkdown>
      </article>

      <div className="mt-10 pt-6 border-t border-kolo-border flex flex-wrap gap-4 text-sm text-kolo-muted">
        <Link href="/pravilnik" className="text-kolo-green-700 hover:underline">
          {t("pravilnik.sviPravilnici")}
        </Link>
        <Link href="/" className="hover:text-kolo-green-700 transition-colors">
          {t("nazadNaPocetnu")}
        </Link>
      </div>
    </div>
  );
}
