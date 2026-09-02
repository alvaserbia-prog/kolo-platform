import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ucitajPravniDokument } from "@/lib/pravni-dokument";
import { pageMetadata } from "@/lib/seo";

/**
 * Fajl i verzija po slug-u. Naziv i opis NISU ovde — čitaju se iz prevoda
 * (`pravne.rb.<slug>.naziv` / `.opis`), pa postoje na svih pet jezika. Ranije
 * su stajali i ovde, u srpskoj kopiji koju nijedna linija nije čitala; ta
 * kopija je zaostala na staroj terminologiji („verifikacija korisnika") i
 * čekala da je neko prepiše kao tačnu.
 */
const PRAVILNICI: Record<string, { fajl: string; verzija: string }> = {
  "kolo-sistem": {
    fajl: "Pravilnik_4_4_1.md",
    verzija: "4.4.1",
  },
  "hijerarhija": {
    fajl: "hijerarhija_4_4_1.md",
    verzija: "4.4.1",
  },
  "dokaz-stvarnosti": {
    fajl: "dokaz_stvarnosti_4_4_1.md",
    verzija: "4.4.1",
  },
  "pokroviteljstvo-donacije": {
    fajl: "donacije_4_4_1.md",
    verzija: "4.4.1",
  },
  "operativni": {
    fajl: "operativni_4_4_1.md",
    verzija: "4.4.1",
  },
  "osnivacki": {
    fajl: "osnivacki_4_4_1.md",
    verzija: "4.4.1",
  },
  "gornje-kolo": {
    fajl: "gornje_kolo_4_4_1.md",
    verzija: "4.4.1",
  },
  "programi-podrske": {
    fajl: "programi_podrske_4_4_1.md",
    verzija: "4.4.1",
  },
  // Usvojen 4.3.0 — do tada je stajao kao nacrt u `docs/pravilnik-modul-deca.md`.
  "ucesce-dece": {
    fajl: "ucesce_dece_4_4_1.md",
    verzija: "4.4.1",
  },
  // Nov akt uz set 4.4.1 — osnov u čl. 14a i 51a Pravilnika o KOLO sistemu.
  "projekti-nabavke": {
    fajl: "projekti_nabavke_4_4_1.md",
    verzija: "4.4.1",
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
