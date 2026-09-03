import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import FaqAkordeon from "@/components/FaqAkordeon";
import { getFaqPoBrojevima } from "@/lib/faq-data";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kakoFunkcionisePage");
  return pageMetadata({
    title: t("meta_title"),
    description: t("meta_desc"),
    path: "/kako-funkcionise",
  });
}

export default async function KakoFunkcionisePage() {
  const locale = await getLocale();
  const t = await getTranslations("kakoFunkcionisePage");
  const faqPitanja = getFaqPoBrojevima([5, 48, 21], locale);

  const koraci = [
    {
      br: "1",
      naslov: t("k1_naslov"),
      opis: t("k1_opis"),
      detalj: t("k1_detalj"),
    },
    {
      br: "2",
      naslov: t("k2_naslov"),
      opis: t("k2_opis"),
      detalj: t("k2_detalj"),
    },
    {
      br: "3",
      naslov: t("k3_naslov"),
      opis: t("k3_opis"),
      detalj: t("k3_detalj"),
      istaknut: true,
    },
    {
      br: "4",
      naslov: t("k4_naslov"),
      opis: t("k4_opis"),
      detalj: t("k4_detalj"),
    },
    {
      br: "5",
      naslov: t("k5_naslov"),
      opis: t("k5_opis"),
      detalj: t("k5_detalj"),
    },
  ];
  return (
    <div className="space-y-6 pb-12">

      {/* ── S1: MINI-HERO ──────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl px-8 py-10 text-white">
        <div className="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          {t("hero_tag")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
          {t("hero_naslov")}
        </h1>
        <p className="text-white/70 text-base md:text-lg">
          {t("hero_opis")}
        </p>
      </section>

      {/* ── S2: POSTANI KORISNIK ───────────────────────────────────── */}
      <section className="bg-white rounded-2xl card-shadow p-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
            {t("postani_tag")}
          </div>
        </div>

        {/* Desktop: olimpijski raspored 3 + 2 */}
        <div className="hidden md:grid md:grid-cols-6 gap-3">
          {koraci.map((k, i) => (
            <div
              key={k.br}
              className={`md:col-span-2 ${i === 3 ? "md:col-start-2" : ""} rounded-2xl p-5 border-2 flex flex-col ${k.istaknut ? "border-kolo-gold-400 bg-kolo-gold-100/40" : "border-kolo-border bg-kolo-bg"}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold mb-3 ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.br}
              </div>
              <p className="font-semibold text-kolo-text text-base mb-1.5">{k.naslov}</p>
              <p className="text-sm text-kolo-muted leading-relaxed mb-3 whitespace-pre-line">{k.opis}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-auto self-end ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.detalj}
              </span>
            </div>
          ))}
        </div>

        {/* Mobilni: vertikalno */}
        <div className="md:hidden space-y-3">
          {koraci.map((k) => (
            <div key={k.br} className={`flex gap-4 rounded-2xl p-5 border-2 ${k.istaknut ? "border-kolo-gold-400 bg-kolo-gold-100/40" : "border-kolo-border bg-kolo-bg"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                {k.br}
              </div>
              <div>
                <p className="font-semibold text-kolo-text text-base mb-1">{k.naslov}</p>
                <p className="text-sm text-kolo-muted leading-relaxed mb-2 whitespace-pre-line">{k.opis}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                  {k.detalj}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Odgovornost za potvrdu — NIJE šesti korak, pa namerno stoji van
            merdevina: bez rednog broja i bez oznake u uglu. */}
        <div className="mt-6 rounded-2xl border-l-4 border-kolo-gold-400 bg-kolo-gold-100/40 p-5">
          <p className="text-sm text-kolo-text leading-relaxed">
            <strong className="text-kolo-green-900">{t("odgovornost_naslov")}</strong>{" "}
            {t("odgovornost_tekst")}
          </p>
        </div>
      </section>

      {/* ── S3: MOST KA DUBLJEM SLOJU ──────────────────────────────────
          Kanali upisivanja, „šta POEN jeste i nije", ZRNO i obračunski
          koeficijent više NISU na ovoj strani — preseljeni su na
          /kako-sistem-radi. Ova strana odgovara na „šta da uradim", a ona
          na „kako to radi": novom čoveku je pre prve razmene potreban samo
          prvi odgovor, a zajedno su bili zid od dvadeset pojmova. */}
      <section className="bg-white rounded-2xl card-shadow p-8 md:p-10">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
              {t("dublje_naslov")}
            </h2>
            <p className="text-sm text-kolo-muted leading-relaxed max-w-xl">
              {t("dublje_opis")}
            </p>
          </div>
          <Link
            href="/kako-sistem-radi"
            className="inline-flex items-center gap-2 px-6 py-3 bg-kolo-green-700 text-white font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors text-sm shrink-0 self-start md:self-center"
          >
            {t("dublje_link")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>


      {/* ── S6: FAQ AKORDEON ───────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            {t("faq_naslov")}
          </h2>
        </div>
        <FaqAkordeon pitanja={faqPitanja} />
        <div className="text-center pt-2">
          <Link
            href="/cesto-postavljena-pitanja"
            className="inline-flex items-center gap-2 text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors"
          >
            {t("faq_link")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── S7: CTA ────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 md:p-10 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
          {t("cta_naslov")}
        </h2>
        <p className="text-white/70 text-base mb-7 max-w-xl mx-auto leading-relaxed">
          {t("cta_opis")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/registracija"
            className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
          >
            {t("cta_registracija")}
          </Link>
          <Link
            href="/pijaca"
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            {t("cta_pijaca")}
          </Link>
        </div>
        <p className="text-white/40 text-xs mt-7">
          {t("cta_licence")}
        </p>
      </section>

    </div>
  );
}