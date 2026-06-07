import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import FaqAkordeon from "@/components/FaqAkordeon";
import { getFaqPoBrojevima } from "@/lib/faq-data";
import { pageMetadata } from "@/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = pageMetadata({
  title: "O sistemu — KOLO",
  description:
    "KOLO beleži ono čime doprinosimo zajednici — rad, dobra i znanje — i čuva to kao zajedničko dobro, u okviru socijalne i solidarne ekonomije.",
  path: "/o-sistemu",
});

export default async function OSistemuPage() {
  const locale = await getLocale();
  const t = await getTranslations("oSistemu");
  const faqPitanja = getFaqPoBrojevima([1, 4, 28], locale);

  const sistemi = [
    {
      naziv: t("sistemi_wir_naziv"),
      podnaslov: t("sistemi_wir_podnaslov"),
      opis: t("sistemi_wir_opis"),
      pokazao: t("sistemi_wir_pokazao"),
    },
    {
      naziv: t("sistemi_lets_naziv"),
      podnaslov: t("sistemi_lets_podnaslov"),
      opis: t("sistemi_lets_opis"),
      pokazao: t("sistemi_lets_pokazao"),
    },
    {
      naziv: t("sistemi_sardex_naziv"),
      podnaslov: t("sistemi_sardex_podnaslov"),
      opis: t("sistemi_sardex_opis"),
      pokazao: t("sistemi_sardex_pokazao"),
    },
    {
      naziv: t("sistemi_fureai_naziv"),
      podnaslov: t("sistemi_fureai_podnaslov"),
      opis: t("sistemi_fureai_opis"),
      pokazao: t("sistemi_fureai_pokazao"),
    },
  ];

  const komponente = [
    {
      naslov: t("k1_naslov"),
      podnaslov: t("k1_podnaslov"),
      tekst: t("k1_tekst"),
      boja: "border-kolo-green-700",
    },
    {
      naslov: t("k2_naslov"),
      podnaslov: t("k2_podnaslov"),
      tekst: t("k2_tekst"),
      boja: "border-kolo-gold-400",
    },
    {
      naslov: t("k3_naslov"),
      podnaslov: t("k3_podnaslov"),
      tekst: t("k3_tekst"),
      boja: "border-kolo-gold-400",
    },
    {
      naslov: t("k4_naslov"),
      podnaslov: t("k4_podnaslov"),
      tekst: t("k4_tekst"),
      boja: "border-kolo-green-700",
    },
  ];

  const okviri = [
    {
      naslov: t("okvir1_naslov"),
      godina: t("okvir1_godina"),
      tekst: t("okvir1_tekst"),
    },
    {
      naslov: t("okvir2_naslov"),
      godina: t("okvir2_godina"),
      tekst: t("okvir2_tekst"),
    },
    {
      naslov: t("okvir3_naslov"),
      godina: t("okvir3_godina"),
      tekst: t("okvir3_tekst"),
    },
    {
      naslov: t("okvir4_naslov"),
      godina: t("okvir4_godina"),
      tekst: t("okvir4_tekst"),
    },
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-[680px]">
          <div className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            {t("hero_tag")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            {t("hero_naslov")}
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-[600px]">
            {t("hero_opis")}
          </p>
        </div>
      </section>

      {/* ── KOLO ZAJEDNIČKO DOBRO ──────────────────────────────────── */}
      <section id="zajednicko-dobro" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            {t("zajednicko_naslov")}
          </h2>

          <blockquote
            className="italic text-kolo-muted leading-relaxed text-base md:text-lg mb-8 text-center"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            {t("zajednicko_citat")}
            <span className="block not-italic text-sm text-kolo-muted/70 mt-3">— {t("zajednicko_citat_izvor")}</span>
          </blockquote>

          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              {t("zajednicko_p1")}
            </p>
            <p>
              {t("zajednicko_p2_pre")}<strong className="text-kolo-green-900">{t("zajednicko_p2_sredina")}</strong>{t("zajednicko_p2_post")}
            </p>
            <p>
              <strong className="text-kolo-green-900">POEN</strong>{t("zajednicko_p3_pre")}
            </p>
          </div>
        </div>
      </section>

      {/* ── ARHITEKTURA SISTEMA ────────────────────────────────────── */}
      <section id="arhitektura" className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-kolo-green-900 text-center" style={{ letterSpacing: "-0.02em" }}>
          {t("arhitektura_naslov")}
        </h2>

        <div className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="relative overflow-x-auto">
            <svg
              viewBox="0 0 720 740"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-3xl mx-auto"
              style={{ minWidth: "320px" }}
            >
              <defs>
                <marker
                  id="arrow-green"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#1B6B3A" />
                </marker>
                <marker
                  id="arrow-gold"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" fill="#A07020" />
                </marker>
              </defs>

              {/* VRH: ZAJEDNIČKO DOBRO */}
              <rect x="40" y="10" width="640" height="110" rx="14" fill="#1B6B3A" />
              <text x="360" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" letterSpacing="3">
                {t("svg_zajednicko_dobro")}
              </text>
              <text x="360" y="80" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">
                {t("svg_mreza_znanje")}
              </text>
              <text x="360" y="100" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="14">
                {t("svg_cuva_ime")}
              </text>

              <path d="M360 158 L360 130" stroke="#1B6B3A" strokeWidth="2" />
              <polygon points="354,130 360,120 366,130" fill="#1B6B3A" />
              <text x="378" y="150" fill="#4B7A5E" fontSize="13" fontStyle="italic">
                {t("svg_grade_cuvaju")}
              </text>

              {/* SREDINA: KOLO ZAJEDNICA */}
              <text x="360" y="190" textAnchor="middle" fill="#1B6B3A" fontSize="16" fontWeight="700" letterSpacing="3">
                {t("svg_kolo_zajednica")}
              </text>
              <text x="360" y="212" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                {t("svg_svi_korisnici_sistema")}
              </text>

              <rect
                x="20"
                y="225"
                width="680"
                height="315"
                rx="16"
                fill="#F0F9F4"
                stroke="#B3DFC5"
                strokeWidth="1.8"
                strokeDasharray="6 4"
              />

              <circle cx="360" cy="285" r="48" fill="#FFFBEB" stroke="#F0C060" strokeWidth="2.5" />
              <text x="360" y="281" textAnchor="middle" fill="#92600A" fontSize="13" fontWeight="700">
                {t("svg_gornje")}
              </text>
              <text x="360" y="299" textAnchor="middle" fill="#92600A" fontSize="13" fontWeight="700">
                {t("svg_kolo")}
              </text>
              <text x="360" y="354" textAnchor="middle" fill="#A07020" fontSize="12" fontStyle="italic">
                {t("svg_upravljacko_telo")}
              </text>

              <path d="M360 415 L360 335" stroke="#F0C060" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.65" />

              <text x="360" y="392" textAnchor="middle" fill="#4B7A5E" fontSize="13" fontWeight="700" letterSpacing="2">
                {t("svg_clanovi")}
              </text>
              <g transform="translate(282, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(322, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(362, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(402, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>
              <g transform="translate(442, 442)">
                <circle cx="0" cy="-5" r="9" fill="#1B6B3A" />
                <path d="M -14 18 Q -14 4 0 4 Q 14 4 14 18 Z" fill="#1B6B3A" />
              </g>

              <text x="360" y="505" textAnchor="middle" fill="#4B7A5E" fontSize="12" fontStyle="italic">
                {t("svg_svi_zajedno")}
              </text>
              <text x="360" y="525" textAnchor="middle" fill="#4B7A5E" fontSize="12" fontStyle="italic">
                {t("svg_nosioci_odlucuju")}
              </text>

              <path
                d="M187 595 L265 540"
                stroke="#1B6B3A"
                strokeWidth="2"
                strokeDasharray="6 3"
                markerEnd="url(#arrow-green)"
              />
              <path
                d="M532 595 L455 540"
                stroke="#A07020"
                strokeWidth="2"
                strokeDasharray="6 3"
                markerEnd="url(#arrow-gold)"
              />

              {/* DNO: FONDACIJA + PROTOKOL */}
              <rect x="20" y="595" width="335" height="135" rx="14" fill="#F0F9F4" stroke="#B3DFC5" strokeWidth="1.8" />
              <text x="187" y="628" textAnchor="middle" fill="#1B6B3A" fontSize="16" fontWeight="700">
                {t("svg_fondacija_naslov")}
              </text>
              <text x="187" y="650" textAnchor="middle" fill="#4B7A5E" fontSize="13" fontWeight="600">
                {t("svg_pravna_osnova")}
              </text>
              <line x1="60" y1="662" x2="314" y2="662" stroke="#B3DFC5" strokeWidth="1" />
              <text x="187" y="682" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                {t("svg_pravno_lice")}
              </text>
              <text x="187" y="700" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                {t("svg_prima_donacije")}
              </text>
              <text x="187" y="718" textAnchor="middle" fill="#4B7A5E" fontSize="12">
                {t("svg_drzi_infrastrukturu")}
              </text>

              <rect x="365" y="595" width="335" height="135" rx="14" fill="#FFFBEB" stroke="#F0C060" strokeWidth="1.8" />
              <text x="532" y="628" textAnchor="middle" fill="#92600A" fontSize="16" fontWeight="700">
                {t("svg_protokol_naslov")}
              </text>
              <text x="532" y="650" textAnchor="middle" fill="#A07020" fontSize="13" fontWeight="600">
                {t("svg_tehnicka_osnova")}
              </text>
              <line x1="405" y1="662" x2="660" y2="662" stroke="#F0C060" strokeWidth="1" />
              <text x="532" y="682" textAnchor="middle" fill="#A07020" fontSize="12">
                {t("svg_softverski_mehanizam")}
              </text>
              <text x="532" y="700" textAnchor="middle" fill="#A07020" fontSize="12">
                {t("svg_upisuje_poen")}
              </text>
              <text x="532" y="718" textAnchor="middle" fill="#A07020" fontSize="12">
                {t("svg_zerosum")}
              </text>
            </svg>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {komponente.map((k) => (
            <div
              key={k.naslov}
              className={`bg-white rounded-2xl card-shadow p-6 md:p-7 flex flex-col gap-3 border-t-4 ${k.boja}`}
            >
              <div>
                <h3 className="text-xl font-bold text-kolo-green-900 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                  {k.naslov}
                </h3>
                <p className="text-xs font-semibold tracking-widest text-kolo-muted uppercase mt-1">
                  {k.podnaslov}
                </p>
              </div>
              <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                {k.tekst}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ── NE IZMIŠLJAMO TOPLU VODU ──────────────────────────────── */}
      <section id="topla-voda" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
              {t("topla_voda_tag")}
            </div>
          </div>
          <blockquote
            className="italic text-kolo-muted leading-relaxed text-base md:text-lg mb-6 text-center max-w-[620px] mx-auto"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            {t("topla_voda_citat")}
            <span className="block not-italic text-sm text-kolo-muted/70 mt-3">— {t("topla_voda_citat_izvor")}</span>
          </blockquote>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            {t("topla_voda_naslov")}
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              {t("topla_voda_p1")}
            </p>
            <p>
              <strong className="text-kolo-green-900">{t("topla_voda_p2_bold")}</strong>{t("topla_voda_p2_pre")}
            </p>
            <p>
              {t("topla_voda_p3_pre")}<strong className="text-kolo-green-900">{t("topla_voda_p3_bold1")}</strong>{t("topla_voda_p3_mid")}{" "}
              <strong className="text-kolo-green-900">{t("topla_voda_p3_bold2")}</strong>{t("topla_voda_p3_post")}
            </p>
          </div>
        </div>
      </section>

      {/* ── POSTOJEĆI SISTEMI ─────────────────────────────────────── */}
      <section id="sistemi" className="space-y-5">
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="text-center mb-4">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
              {t("sistemi_tag")}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3 text-center" style={{ letterSpacing: "-0.02em" }}>
            {t("sistemi_naslov")}
          </h2>
          <p className="text-kolo-muted leading-relaxed max-w-[680px] mx-auto text-center" style={{ lineHeight: "1.7" }}>
            {t("sistemi_opis")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {sistemi.map((s) => (
            <div
              key={s.naziv}
              className="bg-white rounded-2xl card-shadow p-6 md:p-7 flex flex-col gap-4 border-t-4 border-kolo-green-700"
            >
              <div>
                <h3 className="text-2xl font-bold text-kolo-green-900 leading-tight" style={{ letterSpacing: "-0.02em" }}>
                  {s.naziv}
                </h3>
                <p className="text-xs font-semibold tracking-widest text-kolo-muted uppercase mt-1.5">
                  {s.podnaslov}
                </p>
              </div>
              <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                {s.opis}
              </p>
              <div className="pt-3 border-t border-kolo-border mt-auto">
                <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-1.5">
                  {t("sistemi_pokazao")}
                </p>
                <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.65" }}>
                  {s.pokazao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KOLO U TOJ FAMILIJI ───────────────────────────────────── */}
      <section id="kolo-familija" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              {t("familija_tag")}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            {t("familija_naslov")}
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              {t("familija_p1_pre")}<strong className="text-kolo-green-900">POEN</strong>{t("familija_p1_poen")}<strong className="text-kolo-green-900">ZRNO</strong>{t("familija_p1_zrno")}
            </p>
            <p>
              {t("familija_p2")}
            </p>
          </div>
        </div>
      </section>

      {/* ── MEĐUNARODNI OKVIR ─────────────────────────────────────── */}
      <section id="okvir" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              {t("okvir_tag")}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3 text-center" style={{ letterSpacing: "-0.02em" }}>
            {t("okvir_naslov")}
          </h2>
          <p className="text-kolo-muted leading-relaxed mb-8 text-body" style={{ lineHeight: "1.7" }}>
            {t("okvir_opis")}
          </p>

          <div className="space-y-5">
            {okviri.map((stavka) => (
              <div key={stavka.naslov} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-kolo-green-700 mt-2.5 shrink-0" />
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
                    <p className="font-semibold text-kolo-text leading-snug">{stavka.naslov}</p>
                    <span className="text-xs text-kolo-muted font-medium tracking-wide whitespace-nowrap">
                      {stavka.godina}
                    </span>
                  </div>
                  <p className="text-sm text-kolo-muted leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                    {stavka.tekst}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-kolo-border">
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-3">
              {t("pristup_tag")}
            </p>
            <p className="text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
              {t("pristup_tekst_pre")}<strong className="text-kolo-green-900">{t("pristup_tekst_bold")}</strong>{t("pristup_tekst_post")}
            </p>
          </div>
        </div>
      </section>

      {/* ── ZAŠTO SAD I OVDE ──────────────────────────────────────── */}
      <section id="zasto-sad" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              {t("zasto_tag")}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-6 text-center" style={{ letterSpacing: "-0.02em" }}>
            {t("zasto_naslov")}
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>
              {t("zasto_p1")}
            </p>
            <p>
              {t("zasto_p2_pre")}<strong className="text-kolo-green-900">{t("zasto_p2_bold")}</strong>{t("zasto_p2_post")}
            </p>
            <p>
              {t("zasto_p3")}
            </p>
          </div>
        </div>
      </section>

      {/* ── MARGARET MID CITAT ────────────────────────────────────── */}
      <section className="bg-kolo-green-100 rounded-2xl p-6 md:p-10 border-l-4 border-kolo-green-700">
        <div className="max-w-[680px] mx-auto">
          <blockquote
            className="text-base md:text-lg text-kolo-text mb-4 text-body"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            <span className="text-kolo-green-700 font-bold mr-0.5">&bdquo;</span>
            {t("margaret_citat")}
            <span className="text-kolo-green-700 font-bold ml-0.5">&ldquo;</span>
          </blockquote>
          <p className="text-sm text-kolo-muted font-medium text-center">— {t("margaret_izvor")}</p>
        </div>
      </section>

      {/* ── FAQ TIZER ─────────────────────────────────────────────── */}
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

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 md:p-10 text-center text-white">
        <p className="text-white/70 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
          {t("cta_opis")}<br />
          {t("cta_opis2")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Link
            href="/kako-funkcionise"
            className="px-7 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
          >
            {t("cta_kako")}
          </Link>
          <Link
            href="/o-nama"
            className="px-7 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            {t("cta_ko")}
          </Link>
          <Link
            href="/registracija"
            className="px-7 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            {t("cta_priduzi")}
          </Link>
        </div>
        <p className="text-white/40 text-xs">
          {t("cta_licence")}
        </p>
      </section>

    </div>
  );
}
