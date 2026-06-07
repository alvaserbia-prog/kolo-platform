import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import FaqAkordeon from "@/components/FaqAkordeon";
import { getFaqPoBrojevima } from "@/lib/faq-data";
import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "KOLO — Sistem uzajamnosti koji gradiš sa svojom zajednicom",
  description:
    "KOLO je sistem evidencije doprinosa zajedničkom dobru. POEN beleži šta si dao zajednici. ZRNO ti daje glas u odlukama koje sistem oblikuju.",
  openGraph: {
    title: "KOLO — Sistem uzajamnosti koji gradiš sa svojom zajednicom",
    description: "KOLO je sistem evidencije doprinosa zajedničkom dobru, zasnovan na uzajamnosti. POEN beleži šta si dao zajednici, ZRNO ti daje glas u odlukama. Članstvo je besplatno.",
    locale: "sr_RS",
    type: "website",
  },
};

async function getPijacaPreview() {
  try {
    const listings = await prisma.marketplaceListing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        location: true,
        createdAt: true,
        images: true,
        seller: { select: { pseudonim: true } },
      },
    });

    // Uzmi jedan oglas iz svake kategorije (prvih 6 različitih), onda dopuni najnovijim
    const seen = new Set<string>();
    const result = [];
    for (const l of listings) {
      if (!seen.has(l.category) && result.length < 6) {
        seen.add(l.category);
        result.push(l);
      }
    }
    // Dopuni ako ima manje od 6 različitih kategorija
    if (result.length < 6) {
      for (const l of listings) {
        if (result.length >= 6) break;
        if (!result.find((r) => r.id === l.id)) result.push(l);
      }
    }
    return result;
  } catch {
    return [];
  }
}

// Naslovnu vidi samo gost (prijavljeni se preusmeravaju na /dashboard). Po
// gradiranoj vidljivosti (Politika čl. 6), gost vidi SAMO agregate — ne
// pojedinačne transakcije ni pseudonime. Opticaj se računa kao zbir pozitivnih
// stanja (pod zero-sum jednako apsolutnoj vrednosti minusa Protokola) — bez
// zavisnosti od ID-ja Protokol novčanika.
async function getAgregati() {
  try {
    const [brojTransakcija, brojClanova, opticajAgg] = await Promise.all([
      prisma.transaction.count(),
      prisma.user.count({ where: { verified: true } }),
      prisma.wallet.aggregate({ _sum: { balance: true }, where: { balance: { gt: 0 } } }),
    ]);
    return {
      brojTransakcija,
      brojClanova,
      opticaj: Number(opticajAgg._sum.balance ?? 0),
    };
  } catch {
    return { brojTransakcija: 0, brojClanova: 0, opticaj: 0 };
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const locale = await getLocale();
  const t = await getTranslations("landing");

  const [pijacaOglasi, agregati, faqPitanja] = await Promise.all([
    getPijacaPreview(),
    getAgregati(),
    Promise.resolve(getFaqPoBrojevima([1, 2, 40], locale)),
  ]);

  return (
    <div className="min-h-screen bg-kolo-bg">

      <PublicHeader />

      <div className="max-w-[932px] mx-auto px-6 py-8 space-y-6 pb-20">

        {/* ── SEKCIJA 1 — HERO ─────────────────────────────────────── */}
        <section className="bg-kolo-green-900 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-[1fr_360px] gap-10 items-center">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                {t("hero_naslov")}
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-7">
                {t("hero_podnaslov")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/kako-funkcionise"
                  className="px-6 py-3 bg-kolo-gold-600 text-white font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors text-sm">
                  {t("cta_saznaj")} →
                </Link>
                <Link href="/registracija"
                  className="px-6 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
                  {t("cta_priduzi")}
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kolo-hero-logo.png"
                alt="KOLO"
                style={{ width: 385, height: "auto", opacity: 0.97 }}
              />
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 2 — PROBLEM KOJI SVI OSEĆAMO ────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            {t("problem_naslov")}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3 items-center text-center">
              <p className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>{t("problem_1_naslov")}</p>
              <p className="text-sm text-kolo-muted leading-relaxed">{t("problem_1_opis")}</p>
            </div>
            <div className="flex flex-col gap-3 items-center text-center">
              <p className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>{t("problem_2_naslov")}</p>
              <p className="text-sm text-kolo-muted leading-relaxed">{t("problem_2_opis")}</p>
            </div>
            <div className="flex flex-col gap-3 items-center text-center">
              <p className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.02em" }}>{t("problem_3_naslov")}</p>
              <p className="text-sm text-kolo-muted leading-relaxed">{t("problem_3_opis")}</p>
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 3 — KOLO TI DAJE ALTERNATIVU (konsolidovano) ── */}
        <section className="space-y-6 text-center">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-4 py-2 rounded-full tracking-wide uppercase">
            {t("alternativa_naslov")}
          </div>

          <p className="text-kolo-green-900 text-lg font-medium">{t("alternativa_podnaslov")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-3 border-t-4 border-kolo-green-700">
              <h3 className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {t("alternativa_1_naslov")}
              </h3>
              <p className="text-sm text-kolo-text leading-relaxed">
                {t("alternativa_1_opis_start")}
                <strong className="text-kolo-green-900">{t("alternativa_1_istakni_poen")}</strong>
                {t("alternativa_1_opis_end")}
              </p>
            </div>
            <div className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-3 border-t-4 border-kolo-green-700">
              <h3 className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {t("alternativa_2_naslov")}
              </h3>
              <p className="text-sm text-kolo-text leading-relaxed">{t("alternativa_2_opis")}</p>
            </div>
            <div className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-3 border-t-4 border-kolo-green-700">
              <h3 className="font-bold text-kolo-green-900 text-lg leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {t("alternativa_3_naslov")}
              </h3>
              <p className="text-sm text-kolo-text leading-relaxed">{t("alternativa_3_opis")}</p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/kako-funkcionise" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
              {t("kako_funkcionise_naslov")} →
            </Link>
          </div>
        </section>

        {/* ── SEKCIJA 4 — ZA KOGA JE KOLO ─────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            {t("kome_naslov")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              t("kome_1"),
              t("kome_2"),
              t("kome_3"),
              t("kome_4"),
              t("kome_5"),
              t("kome_6"),
              t("kome_7"),
              t("kome_8"),
              t("kome_9"),
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl card-shadow p-4 flex flex-col gap-2">
                <p className="text-sm text-kolo-text leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEKCIJA 5 — PRIMER IZ PRAKSE ─────────────────────────── */}
        <section className="space-y-4">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
            {t("primer_naslov")}
          </div>
          <p className="text-sm text-kolo-muted">{t("primer_podnaslov")}</p>

          {/* 4 stubca povezana strelicama po hronologiji */}
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {[
              { naslov: t("primer_korak_1_naslov"), opis: t("primer_korak_1_opis") },
              { naslov: t("primer_korak_2_naslov"), opis: t("primer_korak_2_opis") },
              { naslov: t("primer_korak_3_naslov"), opis: t("primer_korak_3_opis") },
              { naslov: t("primer_korak_4_naslov"), opis: t("primer_korak_4_opis") },
            ].map((k, i) => (
              <>
                <div key={k.naslov} className="bg-white rounded-2xl card-shadow p-5 flex-1 flex flex-col gap-3 items-center text-center">
                  <span className="w-14 h-14 rounded-full bg-kolo-green-100 text-kolo-green-700 inline-flex items-center justify-center text-2xl font-bold">{i + 1}</span>
                  <p className="font-semibold text-kolo-text text-sm">{k.naslov}</p>
                  <p className="text-kolo-muted leading-relaxed text-xs">{k.opis}</p>
                </div>
                {i < 3 && (
                  <div key={`arrow-${i}`} className="flex items-center justify-center text-kolo-muted shrink-0">
                    <svg className="w-6 h-6 rotate-90 md:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                )}
              </>
            ))}
          </div>
        </section>

        {/* ── SEKCIJA 6 — KAKO FUNKCIONIŠE UKRATKO ────────────────── */}
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            {t("kako_funkcionise_naslov")}
          </div>
          <div className="space-y-0">
            {[
              { br: "1", naslov: t("kako_funkcionise_korak_1_naslov"), opis: t("kako_funkcionise_korak_1_opis") },
              { br: "2", naslov: t("kako_funkcionise_korak_2_naslov"), opis: t("kako_funkcionise_korak_2_opis") },
              { br: "3", naslov: t("kako_funkcionise_korak_3_naslov"), opis: t("kako_funkcionise_korak_3_opis") },
            ].map((k, i, arr) => (
              <div key={k.br} className={`flex gap-5 items-start pt-4 ${i < arr.length - 1 ? "border-b border-kolo-border pb-4" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-kolo-green-900 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {k.br}
                </div>
                <div>
                  <p className="font-semibold text-kolo-text text-sm mb-1">{k.naslov}</p>
                  <p className="text-sm text-kolo-muted leading-relaxed text-body">{k.opis}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-kolo-border">
            <Link href="/kako-funkcionise" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
              {t("kako_funkcionise_naslov")} →
            </Link>
          </div>
        </section>

        {/* ── SEKCIJA 7 — PIJACA PREVIEW ──────────────────────────── */}
        {pijacaOglasi.length >= 3 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
                {t("pijaca_naslov")}
              </h2>
              <Link href="/pijaca" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
                {t("pijaca_cta")} →
              </Link>
            </div>
            {pijacaOglasi.length < 6 && (
              <p className="text-xs text-kolo-muted">
                {t("pijaca_prazno")}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pijacaOglasi.map((oglas) => (
                <Link
                  key={oglas.id}
                  href={`/pijaca/${oglas.id}`}
                  className="bg-white rounded-2xl card-shadow overflow-hidden hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Slika */}
                  <div className="w-full h-44 bg-kolo-bg overflow-hidden">
                    {oglas.images.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/pijaca/slika/${oglas.id}/0`}
                        alt={oglas.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-kolo-muted/30">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4 flex items-start justify-between gap-2">
                    <p className="font-semibold text-kolo-text text-sm leading-snug group-hover:text-kolo-green-700 transition-colors line-clamp-2">
                      {oglas.title}
                    </p>
                    <span className="text-sm font-bold text-kolo-green-700 shrink-0 whitespace-nowrap">
                      {oglas.price.toLocaleString("sr-RS")} {t("pijaca_poen")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── SEKCIJA 8 — ŽIVI AGREGATI SISTEMA (samo ako ima ≥10 transakcija) ────────────── */}
        {agregati.brojTransakcija >= 10 && (
          <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
            <h2 className="text-xl font-bold text-kolo-green-900 mb-5 text-center" style={{ letterSpacing: "-0.02em" }}>
              {t("statistike_naslov")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-kolo-bg rounded-xl py-5">
                <div className="text-2xl md:text-3xl font-bold text-kolo-green-700 tabular-nums">
                  {agregati.brojClanova.toLocaleString("sr-RS")}
                </div>
                <div className="text-xs text-kolo-muted mt-1">{t("statistike_aktivnih")} {t("statistike_clan")}</div>
              </div>
              <div className="bg-kolo-bg rounded-xl py-5">
                <div className="text-2xl md:text-3xl font-bold text-kolo-green-700 tabular-nums">
                  {agregati.brojTransakcija.toLocaleString("sr-RS")}
                </div>
                <div className="text-xs text-kolo-muted mt-1">{t("statistike_transakcija")}</div>
              </div>
              <div className="bg-kolo-bg rounded-xl py-5">
                <div className="text-2xl md:text-3xl font-bold text-kolo-green-700 tabular-nums">
                  {agregati.opticaj.toLocaleString("sr-RS")}
                </div>
                <div className="text-xs text-kolo-muted mt-1">{t("statistike_poen")} {t("statistike_u_opticaju")}</div>
              </div>
            </div>
            <p className="text-xs text-kolo-muted mt-5 text-center">
              {t("statistike_podnaslov")}
            </p>
          </section>
        )}

        {/* ── SEKCIJA 9 — KO STOJI IZA KOLA ──────────────────────── */}
        <section className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="grid md:grid-cols-[2fr_3fr]">
            {/* Levo — slika u krugu, tekst iznad i ispod */}
            <div className="bg-kolo-green-900 p-8 flex flex-col items-center justify-center text-center gap-5">
              <span className="inline-block bg-white/10 text-white/80 text-[11px] font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
                {t("ko_stoji_naslov")}
              </span>
              <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-white/10 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/nikola-saric-mantil.png"
                  alt="Nikola Šarić"
                  className="w-full h-full object-cover object-top"
                  style={{ transform: "scale(1.28)", transformOrigin: "center 22%" }}
                />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Nikola Šarić</p>
                <p className="text-white/70 text-sm mt-1 leading-snug">
                  {t("ko_stoji_lokacija")}
                </p>
              </div>
            </div>
            {/* Desno — tekst */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <p className="text-kolo-text leading-relaxed mb-3 text-sm text-body">
                {t("ko_stoji_opis")}
              </p>
              <Link href="/o-nama" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
                {t("ko_stoji_fondacija")} →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SEKCIJA 10 — FAQ TIZER ───────────────────────────────── */}
        <section id="faq" className="space-y-3">
          <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            {t("faq_tease_naslov")}
          </h2>
          <FaqAkordeon pitanja={faqPitanja} />
          <div className="text-center pt-2">
            <Link
              href="/cesto-postavljena-pitanja"
              className="inline-flex items-center gap-2 text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors"
            >
              {t("faq_tease_cta")}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ── SEKCIJA 11 — CTA ─────────────────────────────────────── */}
        <section className="bg-kolo-green-700 rounded-2xl p-6 md:p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>
            {t("cta_naslov")}
          </h2>
          <p className="text-white/70 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
            {t("cta_opis")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/registracija"
              className="px-8 py-3.5 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm"
            >
              {t("cta_priduzi")} →
            </Link>
            <a
              href="mailto:kontakt@ekolo.rs?subject=Prati%20razvoj%20KOLO%20sistema"
              className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              {t("cta_saznaj")} →
            </a>
          </div>
        </section>

      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <PublicFooter />

    </div>
  );
}
