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
  const faqPitanja = getFaqPoBrojevima([4, 16, 5], locale);

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

  const nacinUpisa = [
    {
      br: "1",
      naslov: t("n1_naslov"),
      opis: t("n1_opis"),
      iznos: t("n1_iznos"),
      boja: "bg-kolo-green-100 text-kolo-green-700",
    },
    {
      br: "2",
      naslov: t("n2_naslov"),
      opis: t("n2_opis"),
      iznos: t("n2_iznos"),
      boja: "bg-kolo-gold-100 text-kolo-gold-600",
    },
    {
      br: "3",
      naslov: t("n3_naslov"),
      opis: t("n3_opis"),
      iznos: t("n3_iznos"),
      boja: "bg-kolo-gold-100 text-kolo-gold-600",
    },
    {
      br: "4",
      naslov: t("n4_naslov"),
      opis: t("n4_opis"),
      iznos: t("n4_iznos"),
      boja: "bg-kolo-green-100 text-kolo-green-700",
    },
    {
      br: "5",
      naslov: t("n5_naslov"),
      opis: t("n5_opis"),
      iznos: t("n5_iznos"),
      boja: "bg-kolo-green-100 text-kolo-green-700",
    },
    {
      br: "6",
      naslov: t("n6_naslov"),
      opis: t("n6_opis"),
      iznos: t("n6_iznos"),
      boja: "bg-kolo-green-100 text-kolo-green-700",
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
              <p className="text-sm text-kolo-muted leading-relaxed mb-3">{k.opis}</p>
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
                <p className="text-sm text-kolo-muted leading-relaxed mb-2">{k.opis}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.istaknut ? "bg-kolo-gold-400 text-kolo-green-900" : "bg-kolo-green-100 text-kolo-green-700"}`}>
                  {k.detalj}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── S3: ŠEST MEHANIZAMA UPISIVANJA POEN-a ──────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
            {t("evidencija_tag")}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            {t("evidencija_naslov")}
          </h2>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl card-shadow p-4 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-kolo-danger-light flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M7 3.5v4M7 9.5v0.6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <p className="text-sm text-kolo-text leading-relaxed">
              {t("poen_ne_kupuje")}
            </p>
          </div>
          <div className="bg-white rounded-xl card-shadow p-4 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-kolo-danger-light flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M7 3.5v4M7 9.5v0.6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <p className="text-sm text-kolo-text leading-relaxed">
              {t("poen_kanali")}
            </p>
          </div>
          <div className="bg-white rounded-xl card-shadow p-4 flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-kolo-green-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#1B6B3A" strokeWidth="1.5"/>
                <path d="M4 7l2 2 4-4" stroke="#1B6B3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="text-sm text-kolo-text leading-relaxed">
              {t("poen_preraspodela")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          {nacinUpisa.map((n) => {
            return (
              <div
                key={n.br}
                className="bg-white rounded-2xl card-shadow p-5 flex flex-col gap-3 md:col-span-2"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${n.boja}`}>
                    {n.br}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-kolo-text text-base mb-1">{n.naslov}</p>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${n.boja}`}>
                      {n.iznos}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-kolo-muted leading-relaxed text-body">{n.opis}</p>
              </div>
            );
          })}
        </div>

      </section>


      {/* ── S4: POEN I ZRNO ────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
          {t("dve_jedinice_tag")}
        </div>
        <div className="grid md:grid-cols-2 gap-4">

          {/* POEN */}
          <div className="bg-white rounded-2xl card-shadow p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center font-bold text-lg">
                P
              </div>
              <div>
                <p className="font-bold text-kolo-green-900 text-lg">POEN</p>
                <p className="text-sm text-kolo-muted">{t("poen_jedinica_label")}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">{t("poen_jeste_naslov")}</p>
              <ul className="space-y-1.5">
                {[
                  t("poen_jeste1"),
                  t("poen_jeste2"),
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-kolo-green-700 mt-0.5 shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">{t("poen_nije_naslov")}</p>
              <p className="text-sm text-kolo-muted leading-relaxed mb-2 text-body">
                {t("poen_nije_uvod")}
              </p>
              <ul className="space-y-1.5">
                {[
                  t("poen_nije1"),
                  t("poen_nije2"),
                  t("poen_nije3"),
                  t("poen_nije4"),
                  t("poen_nije5"),
                  t("poen_nije6"),
                  t("poen_nije7"),
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-kolo-green-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-kolo-green-700 mb-1">{t("zerosum_naslov")}</p>
              <p className="text-sm text-kolo-muted leading-relaxed text-body">
                {t("zerosum_tekst")}
              </p>
            </div>
          </div>

          {/* ZRNO */}
          <div className="bg-white rounded-2xl card-shadow p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-kolo-gold-100 text-kolo-gold-600 flex items-center justify-center font-bold text-lg">
                Z
              </div>
              <div>
                <p className="font-bold text-kolo-green-900 text-lg">ZRNO</p>
                <p className="text-sm text-kolo-muted">{t("zrno_jedinica_label")}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">{t("zrno_upis_naslov")}</p>
              <ul className="space-y-1.5">
                {[
                  t("zrno_upis1"),
                  t("zrno_upis2"),
                  t("zrno_upis3"),
                  t("zrno_upis4"),
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-kolo-gold-600 mt-0.5 shrink-0">◆</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">{t("zrno_koristi_naslov")}</p>
              <ul className="space-y-1.5">
                {[
                  t("zrno_koristi1"),
                  t("zrno_koristi2"),
                  t("zrno_koristi3"),
                  t("zrno_koristi4"),
                  t("zrno_koristi5"),
                ].map((s) => (
                  <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                    <span className="text-kolo-gold-600 mt-0.5 shrink-0">◆</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-kolo-gold-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-kolo-gold-600 mb-1">{t("koeficijent_naslov")}</p>
              <p className="text-sm text-kolo-muted leading-relaxed text-body">
                {t("koeficijent_tekst")}
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ── S6: FAQ AKORDEON ───────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="text-center">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            {t("faq_tag")}
          </div>
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
        <p className="text-white/70 text-base mb-7 max-w-md mx-auto leading-relaxed">
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
          <Link
            href="/"
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            {t("cta_pocetna")}
          </Link>
        </div>
        <p className="text-white/40 text-xs mt-7">
          {t("cta_licence")}
        </p>
      </section>

    </div>
  );
}
