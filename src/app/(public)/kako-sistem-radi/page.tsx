import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { MODUL_DECA_AKTIVAN } from "@/lib/moduli";
import { getTranslations } from "next-intl/server";

/**
 * Drugi sloj objašnjenja — kanali kroz koje POEN nastaje, šta POEN jeste i nije,
 * ZRNO i obračunski koeficijent.
 *
 * Izdvojeno sa /kako-funkcionise (03.09.2026). Razlog nije dužina nego rečnik:
 * jedna strana je od čoveka koji prvi put dolazi tražila da nauči dvadesetak
 * skovanih pojmova (POEN, ZRNO, Protokol, opticaj, obračunski koeficijent, zero-sum,
 * lanac potvrda, indeks stvarnosti…) pre nego što uradi bilo šta. Prva strana sada
 * odgovara na „šta da uradim", ova na „kako to radi". Pojmovi se ne skrivaju —
 * odlažu se do trenutka kad čoveku zatrebaju.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("kakoFunkcionisePage");
  return pageMetadata({
    title: t("sistem_meta_title"),
    description: t("sistem_meta_desc"),
    path: "/kako-sistem-radi",
  });
}

export default async function KakoSistemRadiPage() {
  const t = await getTranslations("kakoFunkcionisePage");
  const tc = await getTranslations("common");


  // Broj kanala koje ova stranica nabraja: sedam ličnih + dečji, dok modul radi.
  // Ide kao CIFRA, ne kao reč — brojna reč bi se sklanjala po jeziku, a jedan
  // prosleđen string ne može da posluži svih pet prevoda.
  const brojKanala = MODUL_DECA_AKTIVAN ? 8 : 7;

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
      boja: "bg-kolo-green-100 text-kolo-green-700",
    },
    {
      br: "3",
      naslov: t("n3_naslov"),
      opis: t("n3_opis"),
      iznos: t("n3_iznos"),
      boja: "bg-kolo-green-100 text-kolo-green-700",
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
      boja: "bg-kolo-gold-100 text-kolo-gold-600",
    },
    {
      br: "7",
      naslov: t("n7_naslov"),
      opis: t("n7_opis"),
      iznos: t("n7_iznos"),
      boja: "bg-kolo-green-100 text-kolo-green-700",
    },
    // Deveti kanal iz čl. 15 (doprinos dece u dečjem prostoru) — na stranici je
    // osmi, jer rast kolektivnih oblika upisuje u zapis Kruga, ne čoveka.
    // Prikazuje se samo dok Modul Deca radi; inače naslov sekcije laže broj.
    ...(MODUL_DECA_AKTIVAN
      ? [
          {
            br: "8",
            naslov: t("n8_naslov"),
            opis: t("n8_opis"),
            iznos: t("n8_iznos"),
            boja: "bg-kolo-green-100 text-kolo-green-700",
          },
        ]
      : []),
  ];

  // Širina kartice kanala u mreži od 12 kolona — vidi komentar uz samu mrežu.
  const rasponKartice = (i: number) =>
    nacinUpisa.length >= 8
      ? i < 6
        ? "md:col-span-4"
        : "md:col-span-6"
      : i < 4
        ? "md:col-span-3"
        : "md:col-span-4";

  return (
    <div className="space-y-6 pb-12">

      {/* ── S1: MINI-HERO ──────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl px-8 py-10 text-white">
        <div className="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          {t("sistem_hero_tag")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
          {t("sistem_hero_naslov")}
        </h1>
        <p className="text-white/70 text-base md:text-lg">
          {t("sistem_hero_opis")}
        </p>
      </section>

      {/* ── S3: SEDAM KANALA UPISIVANJA POEN-a ─────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-sm font-bold px-5 py-2 rounded-full tracking-wide uppercase">
            {t("evidencija_tag")}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
            {t("evidencija_naslov", { broj: brojKanala })}
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
              {t("poen_kanali", { broj: brojKanala })}
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

        {/* Raspored po redovima, u mreži od 12 kolona. Zavisi od broja kartica,
            jer dečji kanal prati prekidač modula:
              8 kartica -> 3/3/2 (4+4+4 | 4+4+4 | 6+6)
              7 kartica -> 4/3   (3+3+3+3 | 4+4+4)
            Cilj je da nijedan red ne ostane sa jednom karticom. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
          {nacinUpisa.map((n, i) => {
            return (
              <div
                key={n.br}
                className={`bg-white rounded-2xl card-shadow p-5 flex flex-col ${rasponKartice(i)}`}
              >
                {/* Redni broj stoji iznad, a naslov, iznos i opis počinju od iste
                    leve ivice — ranije je opis bio pun red ispod, pa se nije
                    poklapao sa naslovom uvučenim pored broja. */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 mb-3 ${n.boja}`}>
                  {n.br}
                </div>
                <p className="font-semibold text-kolo-text text-base leading-snug">{n.naslov}</p>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full self-start mt-2 ${n.boja}`}>
                  {n.iznos}
                </span>
                <p className="text-sm text-kolo-muted leading-relaxed text-body whitespace-pre-line mt-3">{n.opis}</p>
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
                {/* Inicijal se izvodi iz naziva jedinice — na ćirilici/ruskom „П", ne „P". */}
                {tc("poen").charAt(0)}
              </div>
              <div>
                <p className="font-bold text-kolo-green-900 text-lg">{tc("poen")}</p>
                <p className="text-sm text-kolo-muted">{t("poen_jedinica_label")}</p>
              </div>
            </div>

            <p className="text-sm text-kolo-muted leading-relaxed text-body">{t("poen_uvod", { broj: brojKanala })}</p>

            <div>
              <p className="text-sm font-bold tracking-widest text-kolo-muted uppercase mb-2">{t("poen_jeste_naslov")}</p>
              <ul className="space-y-1.5">
                {[
                  t("poen_jeste1"),
                  t("poen_jeste2"),
                  t("poen_jeste3"),
                  t("poen_jeste4"),
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
              <p className="text-sm text-kolo-muted leading-relaxed text-body whitespace-pre-line">
                {t("zerosum_tekst", { broj: brojKanala })}
              </p>
            </div>
          </div>

          {/* ZRNO */}
          <div className="bg-white rounded-2xl card-shadow p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-kolo-gold-100 text-kolo-gold-600 flex items-center justify-center font-bold text-lg">
                {tc("zrno").charAt(0)}
              </div>
              <div>
                <p className="font-bold text-kolo-green-900 text-lg">{tc("zrno")}</p>
                <p className="text-sm text-kolo-muted">{t("zrno_jedinica_label")}</p>
              </div>
            </div>

            <p className="text-sm text-kolo-muted leading-relaxed text-body">{t("zrno_uvod")}</p>

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
              <p className="text-sm text-kolo-muted leading-relaxed text-body whitespace-pre-line">
                {t("koeficijent_tekst")}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── NAZAD NA PRVE KORAKE ───────────────────────────────────── */}
      <section className="text-center">
        <Link
          href="/kako-funkcionise"
          className="inline-flex items-center gap-2 text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nazad_link")}
        </Link>
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