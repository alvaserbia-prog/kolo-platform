import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import FaqAkordeon from "@/components/FaqAkordeon";
import { getFaqPoBrojevima } from "@/lib/faq-data";
import { pageMetadata } from "@/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("oNama");
  return pageMetadata({
    title: t("meta_title"),
    description: t("meta_desc"),
    path: "/o-nama",
  });
}

function DokumentRed({ naziv, href, zivoLabel }: { naziv: string; href: string; zivoLabel?: string }) {
  const eksterni = href.startsWith("http");
  return (
    <a
      href={href}
      target={eksterni ? "_blank" : undefined}
      rel={eksterni ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-kolo-green-100 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-kolo-gold-100 flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D99520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <span className="text-sm text-kolo-text group-hover:text-kolo-green-700 transition-colors font-medium flex-1">
        {naziv}
      </span>
      {zivoLabel && (
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-kolo-green-700 bg-kolo-green-100 px-2 py-0.5 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-kolo-green-700 animate-pulse" />
          {zivoLabel}
        </span>
      )}
    </a>
  );
}

export default async function ONamaPage() {
  const locale = await getLocale();
  const t = await getTranslations("oNama");
  const faqPitanja = getFaqPoBrojevima([26, 27, 30], locale);

  const faze = [
    { r1: t("faza1"), r2: t("faza1b"), opis: t("faza1_opis"), aktivan: false },
    { r1: t("faza2"), r2: t("faza2b"), opis: t("faza2_opis"), aktivan: true },
    { r1: t("faza3"), r2: t("faza3b"), opis: t("faza3_opis"), aktivan: false },
    { r1: t("faza4"), r2: t("faza4b"), opis: t("faza4_opis"), aktivan: false },
    { r1: t("faza5"), r2: t("faza5b"), opis: t("faza5_opis"), aktivan: false },
    { r1: t("faza6"), r2: t("faza6b"), opis: t("faza6_opis"), aktivan: false },
    { r1: t("faza7"), r2: t("faza7b"), opis: t("faza7_opis"), aktivan: false },
  ];

  const stavke = [
    { naslov: t("stavka6_naslov"), tekst: t("stavka6_tekst") },
    { naslov: t("stavka1_naslov"), tekst: t("stavka1_tekst") },
    { naslov: t("stavka2_naslov"), tekst: t("stavka2_tekst") },
    { naslov: t("stavka3_naslov"), tekst: t("stavka3_tekst") },
    { naslov: t("stavka4_naslov"), tekst: t("stavka4_tekst") },
    { naslov: t("stavka5_naslov"), tekst: t("stavka5_tekst") },
  ];

  const kartice = [
    { naslov: t("k1_naslov"), tekst: t("k1_tekst"), cta: t("k1_cta"), ctaHref: "/registracija", ctaIsLink: true },
    { naslov: t("k2_naslov"), tekst: t("k2_tekst"), cta: t("k2_cta"), ctaHref: "mailto:kontakt@ekolo.rs", ctaIsLink: false },
    { naslov: t("k3_naslov"), tekst: t("k3_tekst"), cta: t("k3_cta"), ctaHref: "mailto:kontakt@ekolo.rs", ctaIsLink: false },
  ];

  const sekundarne = [
    { naslov: t("sek1_naslov"), tekst: t("sek1_tekst") },
    { naslov: t("sek2_naslov"), tekst: t("sek2_tekst") },
    { naslov: t("sek3_naslov"), tekst: t("sek3_tekst") },
    { naslov: t("sek4_naslov"), tekst: t("sek4_tekst") },
    { naslov: t("sek5_naslov"), tekst: t("sek5_tekst") },
    { naslov: t("sek6_naslov"), tekst: t("sek6_tekst") },
    { naslov: t("sek7_naslov"), tekst: t("sek7_tekst") },
    { naslov: t("sek8_naslov"), tekst: t("sek8_tekst") },
  ];

  const stubovi = [
    { naslov: "", tekst: t("stub1_tekst") },
    { naslov: t("stub2_naslov"), tekst: t("stub2_tekst") },
    { naslov: t("stub3_naslov"), tekst: t("stub3_tekst") },
  ];

  const kljucniDokumenti = [
    { naziv: t("dok_whitepaper"), href: "/whitepaper" },
    { naziv: t("dok_statut"), href: "/statut" },
    { naziv: t("dok_pravilnik_kolo"), href: "/pravilnik/kolo-sistem" },
  ];

  const posebniPravilnici = [
    { naziv: t("dok_pravilnik_hijerarhija"), href: "/pravilnik/hijerarhija" },
    { naziv: t("dok_pravilnik_dokaz"), href: "/pravilnik/dokaz-stvarnosti" },
    { naziv: t("dok_pravilnik_pokroviteljstvo"), href: "/pravilnik/pokroviteljstvo-donacije" },
    { naziv: t("dok_pravilnik_operativni"), href: "/pravilnik/operativni" },
    { naziv: t("dok_pravilnik_osnivacki"), href: "/pravilnik/osnivacki" },
  ];

  const pravniDokumenti = [
    { naziv: t("dok_uslovi"), href: "/uslovi" },
    { naziv: t("dok_rizici"), href: "/rizici" },
    { naziv: t("dok_politika"), href: "/privatnost" },
    { naziv: t("dok_dpia"), href: "/dpia" },
    { naziv: t("dok_radnje"), href: "/radnje-obrade" },
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-8 md:gap-12">
          <div className="max-w-[580px]">
            <div className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              {t("hero_tag")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
              {t("hero_naslov")}
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-[520px]">
              {t("hero_opis")}
            </p>
          </div>
          <div className="shrink-0 mx-auto md:ml-auto">
            <div
              className="rounded-full overflow-hidden ring-4 ring-white/10 shadow-xl"
              style={{ width: "160px", height: "160px" }}
            >
              <Image
                src="/nikola-saric-mantil.png"
                alt="Nikola Šarić"
                width={160}
                height={160}
                priority
                className="object-cover object-top"
                style={{ width: "160px", height: "160px", display: "block", transform: "scale(1.28)", transformOrigin: "center 22%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CITAT ─────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-100 rounded-2xl p-6 md:p-8 border-l-4 border-kolo-green-700">
        <div className="max-w-[680px] mx-auto">
          <blockquote
            className="text-base md:text-lg text-kolo-text mb-4 text-body"
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.65" }}
          >
            <span className="text-kolo-green-700 font-bold mr-0.5">&bdquo;</span>{t("citat_tekst")}<span className="text-kolo-green-700 font-bold ml-0.5">&ldquo;</span>
          </blockquote>
          <p className="text-sm text-kolo-muted font-medium text-center">— Nikola Šarić</p>
        </div>
      </section>

      {/* ── ŠTA NAS JE DOVELO OVDE ────────────────────────────────── */}
      <section id="prica" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[660px] mx-auto">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            {t("prica_tag")}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-8" style={{ letterSpacing: "-0.02em" }}>
            {t("prica_naslov")}
          </h2>
          <div className="space-y-5 text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.75" }}>
            <p>{t("prica_p1")}</p>
            <p>{t("prica_p2")}</p>
            <p>{t("prica_p3")}</p>
          </div>
        </div>
      </section>

      {/* ── STATUS SISTEMA · MAJ 2026 ─────────────────────────────── */}
      <section id="sta-radimo-sada" className="bg-white rounded-2xl card-shadow p-8 md:p-12">
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="inline-block bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              {t("status_tag")}
            </div>
            <span className="text-xs text-kolo-muted font-medium tracking-wide">{t("status_datum")}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            {t("status_naslov")}
          </h2>
          <p className="text-kolo-muted leading-relaxed mb-8 text-body" style={{ lineHeight: "1.7" }}>
            {t("status_opis")}
          </p>

          {/* Timeline */}
          <div className="relative mb-10 pb-8 border-b border-kolo-border">
            {/* Mobilni — vertikalni redosled */}
            <div className="md:hidden relative">
              <div
                className="absolute w-0.5 bg-kolo-border"
                style={{ top: "0.5rem", bottom: "0.5rem", left: "6px" }}
              />
              <div className="flex flex-col gap-3">
                {faze.map((faza) => (
                  <div key={faza.r1 + faza.r2} className="relative flex items-start gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 relative z-10 shrink-0 mt-1 ${faza.aktivan ? "bg-kolo-green-700 border-kolo-green-700" : "bg-white border-kolo-border"}`} />
                    <div className="min-w-0">
                      <p className={`text-sm leading-tight ${faza.aktivan ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                        {faza.r1} {faza.r2}
                        {faza.aktivan && (
                          <span className="ml-2 text-[11px] font-bold text-kolo-green-700">{t("faza_tu_smo_mobilni")}</span>
                        )}
                      </p>
                      <p className="text-xs text-kolo-muted leading-relaxed mt-0.5">{faza.opis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop — horizontalni redosled */}
            <div className="hidden md:block relative pt-5">
              <div
                className="absolute h-0.5 bg-kolo-border"
                style={{ top: "calc(1.25rem + 6px)", left: "7.14%", right: "7.14%" }}
              />
              <div className="relative grid grid-cols-7">
                {faze.map((faza) => (
                  <div key={faza.r1 + faza.r2} className="group relative flex flex-col items-center gap-1.5 px-1 cursor-help">
                    {faza.aktivan && (
                      <span className="absolute -top-5 text-[10px] font-bold text-kolo-green-700 whitespace-nowrap">
                        {t("faza_tu_smo_desktop")}
                      </span>
                    )}
                    <div className={`w-3.5 h-3.5 rounded-full border-2 relative z-10 ${faza.aktivan ? "bg-kolo-green-700 border-kolo-green-700" : "bg-white border-kolo-border"}`} />
                    <p className={`text-[11px] leading-tight text-center ${faza.aktivan ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {faza.r1}<br />{faza.r2}
                    </p>
                    <span className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 z-50 rounded-xl bg-kolo-text text-white text-xs leading-relaxed font-normal text-left p-3 shadow-xl">
                      {faza.opis}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            {t("otvaranje_naslov")}
          </h3>
          <p className="text-kolo-muted leading-relaxed mb-8 text-body" style={{ lineHeight: "1.7" }}>
            {t("otvaranje_opis")}
          </p>

          <div className="space-y-5">
            {stavke.map((stavka) => (
              <div key={stavka.naslov} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-kolo-green-700 mt-2.5 shrink-0" />
                <div>
                  <p className="font-semibold text-kolo-text mb-1">{stavka.naslov}</p>
                  <p className="text-sm text-kolo-muted leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
                    {stavka.tekst}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-kolo-border">
            <p className="text-sm font-medium text-kolo-green-900 italic text-center" style={{ lineHeight: "1.7" }}>
              {t("cilj_tekst")}
            </p>
          </div>
        </div>
      </section>

      {/* ── KAKO SE UKLJUČUJEŠ ─────────────────────────────────────── */}
      <section id="kako-se-ukljucujes" className="space-y-5">
        {/* Uvod */}
        <div className="bg-white rounded-2xl card-shadow p-8 md:p-10">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            {t("ukljucivanje_tag")}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900 mb-3" style={{ letterSpacing: "-0.02em" }}>
            {t("ukljucivanje_naslov")}
          </h2>
          <p className="text-kolo-muted leading-relaxed max-w-[680px] text-body" style={{ lineHeight: "1.7" }}>
            {t("ukljucivanje_opis")}
          </p>
        </div>

        {/* Istaknut kanal — najširi poziv (puna širina, prvi po redu) */}
        <div className="bg-kolo-green-100 rounded-2xl p-6 md:p-8 border-2 border-kolo-green-700 flex flex-col md:flex-row md:items-center gap-5 md:gap-7">
          {/* Ikona — krug ljudi (KOLO = krug) */}
          <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center text-kolo-green-700 mx-auto md:mx-0">
            <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
              <circle cx="20" cy="13" r="4" fill="currentColor" opacity="0.85" />
              <circle cx="27" cy="26" r="4" fill="currentColor" opacity="0.85" />
              <circle cx="13" cy="26" r="4" fill="currentColor" opacity="0.85" />
              <line x1="20" y1="17" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="23.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <line x1="16.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-kolo-green-900 text-xl leading-snug mb-2" style={{ letterSpacing: "-0.01em" }}>
              {t("istaknut_naslov")}
            </h3>
            <p className="text-sm md:text-base text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
              {t("istaknut_tekst")}
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/registracija"
              className="block text-center px-7 py-4 bg-kolo-green-700 text-white font-bold rounded-xl hover:bg-kolo-green-900 transition-colors text-base whitespace-nowrap"
            >
              {t("istaknut_cta")}
            </Link>
          </div>
        </div>

        {/* Primarne kartice (3) */}
        <div className="grid md:grid-cols-3 gap-4">
          {kartice.map((k) => (
            <div
              key={k.naslov}
              className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-3 border-t-4 border-kolo-green-700"
            >
              <h3 className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {k.naslov}
              </h3>
              <p className="text-sm text-kolo-muted leading-relaxed flex-1 text-body" style={{ lineHeight: "1.65" }}>
                {k.tekst}
              </p>
              {k.ctaIsLink ? (
                <Link href={k.ctaHref} className="text-sm font-semibold text-kolo-green-700 hover:text-kolo-green-900 transition-colors mt-2">
                  {k.cta}
                </Link>
              ) : (
                <a href={k.ctaHref} className="text-sm font-semibold text-kolo-green-700 hover:text-kolo-green-900 transition-colors mt-2">
                  {k.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Sekundarne kartice — specifične ekspertize i drugi oblici */}
        <div className="pt-2">
          <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-3 px-1">
            {t("sek_tag")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sekundarne.map((k) => (
              <div key={k.naslov} className="bg-white rounded-2xl card-shadow p-5 flex flex-col gap-2">
                <p className="font-semibold text-kolo-text text-sm leading-snug">{k.naslov}</p>
                <p className="text-xs text-kolo-muted leading-relaxed text-body" style={{ lineHeight: "1.6" }}>
                  {k.tekst}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Zatvarajući kontakt blok */}
        <div className="bg-kolo-green-100 rounded-2xl p-5 text-center">
          <p className="text-sm text-kolo-green-900 leading-relaxed">
            {t("kontakt_tekst")}{" "}
            <a href="mailto:kontakt@ekolo.rs" className="font-semibold text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
              kontakt@ekolo.rs
            </a>
          </p>
        </div>
      </section>

      {/* ── KOLO FONDACIJA ────────────────────────────────────────── */}
      <section id="fondacija" className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="p-8 md:p-10 border-b border-kolo-border">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                {t("fondacija_tag")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
                {t("fondacija_naslov")}
              </h2>
            </div>
            {/* Znak — tri figure u krugu sa klasom */}
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-kolo-green-100 flex items-center justify-center text-kolo-green-700">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3"/>
                <circle cx="20" cy="13" r="4" fill="currentColor" opacity="0.7"/>
                <circle cx="27" cy="26" r="4" fill="currentColor" opacity="0.7"/>
                <circle cx="13" cy="26" r="4" fill="currentColor" opacity="0.7"/>
                <line x1="20" y1="17" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="23.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
                <line x1="16.5" y1="22" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-kolo-border">
          {stubovi.map((stub, idx) => (
            <div key={stub.naslov || `card-${idx}`} className="p-6 md:p-8">
              {stub.naslov && (
                <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-3">{stub.naslov}</p>
              )}
              <p className="text-sm text-kolo-text leading-relaxed text-body" style={{ lineHeight: "1.7" }}>{stub.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JAVNO I DOSTUPNO ──────────────────────────────────────── */}
      <section id="dokumenti" className="bg-white rounded-2xl card-shadow p-8 md:p-10">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          {t("javno_tag")}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Levo — dokumenti */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">{t("dok_tag")}</p>
            <div className="space-y-2">
              {/* Ključni dokumenti — uvek vidljivi */}
              {kljucniDokumenti.map((dok) => (
                <DokumentRed key={dok.naziv} naziv={dok.naziv} href={dok.href} />
              ))}

              {/* Posebni pravilnici — sklopivo */}
              <details className="group/sek border border-kolo-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-2 p-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-kolo-bg transition-colors">
                  <span className="text-sm font-semibold text-kolo-text">{t("dok_posebni_pravilnici")}</span>
                  <span className="flex items-center gap-2 text-kolo-muted">
                    <span className="text-[11px]">{t("dok_posebni_broj")}</span>
                    <svg className="transition-transform group-open/sek:rotate-90" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-1 pb-1.5 space-y-1">
                  {posebniPravilnici.map((dok) => (
                    <DokumentRed key={dok.naziv} naziv={dok.naziv} href={dok.href} />
                  ))}
                </div>
              </details>

              {/* Pravni i korisnički dokumenti — sklopivo */}
              <details className="group/sek border border-kolo-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-2 p-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-kolo-bg transition-colors">
                  <span className="text-sm font-semibold text-kolo-text">{t("dok_pravni_tag")}</span>
                  <span className="flex items-center gap-2 text-kolo-muted">
                    <span className="text-[11px]">{t("dok_pravni_broj")}</span>
                    <svg className="transition-transform group-open/sek:rotate-90" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-1 pb-1.5 space-y-1">
                  {pravniDokumenti.map((dok) => (
                    <DokumentRed key={dok.naziv} naziv={dok.naziv} href={dok.href} />
                  ))}
                </div>
              </details>

              {/* Uživo — stanje kanala osnivačkog doprinosa */}
              <DokumentRed naziv={t("dok_osnivacki")} href="/osnivacki-doprinos" zivoLabel={t("uzivo")} />
            </div>
          </div>

          {/* Desno — kontakt */}
          <div>
            <p className="text-xs font-bold tracking-widest text-kolo-muted uppercase mb-4">{t("kontakt_tag")}</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-kolo-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B6B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-kolo-muted mb-1">{t("kontakt_email_label")}</p>
                  <a href="mailto:kontakt@ekolo.rs" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
                    kontakt@ekolo.rs
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-kolo-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B6B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-kolo-muted mb-1">{t("kontakt_adresa_label")}</p>
                  <p className="text-sm font-medium text-kolo-text">{t("kontakt_adresa")}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-kolo-bg rounded-xl">
              <p className="text-sm text-kolo-muted leading-relaxed text-body">
                {t("kontakt_opis")}
              </p>
            </div>
          </div>
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
            href="/registracija"
            className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
          >
            {t("cta_registracija")}
          </Link>
          <Link
            href="/kako-funkcionise"
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            {t("cta_kako")}
          </Link>
        </div>
        <p className="text-xs text-white/40 mb-6">{t("cta_eyebrow")}</p>
        <p className="text-white/40 text-xs">
          {t("cta_licence")}
        </p>
      </section>

    </div>
  );
}
