import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

/**
 * Treći sloj objašnjenja — pravna kvalifikacija POEN-a i ZRNA.
 *
 * Zašto zasebna strana (03.09.2026): lista „Šta POEN nije" sa šest odričnih
 * stavki i tri zakona stajala je usred objašnjenja kako sistem radi. Regulatoru
 * i novinaru je ta argumentacija neophodna, ali čoveku koji je došao da vidi
 * pijacu ona proizvodi sumnju koje nije bilo — niko se ne brani od optužbe koja
 * nije postavljena. Ništa nije uklonjeno; premešteno je iza jednog klika, i
 * dopunjeno onim čega na sajtu uopšte nije bilo.
 *
 * 🔴 Odredbe se navode PO BROJU ČLANA i proverene su u
 * `dokumentacija 4.1/Pravilnik_4_4_1.md`: čl. 12–13 (POEN), 18 (kvalifikacija
 * ZRNA), 22 (neprenosivost), 25 (nema vrednost van sistema), 34 i 72 (ne
 * nasleđuje se), 46 (kvadratno glasanje), 69 (sistem nije platna institucija).
 * Pri svakom bumpu seta akata proveriti da numeracija nije pomerena — pogrešan
 * broj člana na javnoj pravnoj strani gori je od nenavedenog.
 *
 * 🟡 Lista `poen_nije1..6` namerno se čita iz namespace-a `kakoFunkcionisePage`,
 * odakle je i preseljena: isti tekst, bez drugog prevoda koji bi vremenom
 * odlutao od prvog.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pravnaPozicija");
  return pageMetadata({
    title: t("meta_title"),
    description: t("meta_desc"),
    path: "/pravna-pozicija",
  });
}

export default async function PravnaPozicijaPage() {
  const t = await getTranslations("pravnaPozicija");
  const tk = await getTranslations("kakoFunkcionisePage");
  const td = await getTranslations("oNama");

  const poenNije = [
    tk("poen_nije1"), tk("poen_nije2"), tk("poen_nije3"),
    tk("poen_nije4"), tk("poen_nije5"), tk("poen_nije6"),
  ];
  const zrnoNije = [
    t("zrno_nije1"), t("zrno_nije2"), t("zrno_nije3"),
    t("zrno_nije4"), t("zrno_nije5"), t("zrno_nije6"),
  ];
  // Šest odredaba koje obaraju čitanje ZRNA kao investicionog instrumenta.
  // 🔴 `zasto2` NE tvrdi da dinarskog ulaza nema — donacija u dinarima postoji i
  // nosi evidentiran POEN. Tvrdi ono što akti stvarno kažu: da su to dva pravno
  // nezavisna akta, da dinar ulazi u Fondaciju a ne u obračunski okvir (čl. 38)
  // i da evidentiranje nije protivusluga (čl. 73). Ranija formulacija „nema
  // dinarskog ulaza" bila je neistinita i lako oboriva, što je na pravnoj strani
  // gore od ćutanja.
  const razlozi = [1, 2, 3, 4, 5, 6].map((n) => ({
    naslov: t(`zasto${n}_naslov`),
    tekst: t(`zasto${n}_tekst`),
  }));
  const dokumenti = [
    { href: "/whitepaper", label: td("dok_whitepaper") },
    { href: "/pravilnik", label: td("dok_pravilnik_kolo") },
    { href: "/statut", label: td("dok_statut") },
    { href: "/uslovi", label: td("dok_uslovi") },
    { href: "/privatnost", label: td("dok_politika") },
    { href: "/dpia", label: td("dok_dpia") },
    { href: "/radnje-obrade", label: td("dok_radnje") },
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="bg-kolo-green-900 rounded-2xl px-8 py-10 text-white">
        <div className="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          {t("hero_tag")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
          {t("hero_naslov")}
        </h1>
        <p className="text-white/70 text-base md:text-lg">{t("hero_opis")}</p>
      </section>

      <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
        <p className="text-base text-kolo-text leading-relaxed text-body">{t("uvod")}</p>
      </section>

      {/* ── DVE LISTE, SIMETRIČNO ──────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { naslov: t("poen_naslov"), uvod: t("poen_uvod"), stavke: poenNije },
          { naslov: t("zrno_naslov"), uvod: t("zrno_uvod"), stavke: zrnoNije },
        ].map((blok) => (
          <section key={blok.naslov} className="bg-white rounded-2xl card-shadow p-6 md:p-8">
            <h2 className="text-xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
              {blok.naslov}
            </h2>
            <p className="text-sm text-kolo-muted leading-relaxed text-body mb-4">{blok.uvod}</p>
            <ul className="space-y-2">
              {blok.stavke.map((s) => (
                <li key={s} className="flex gap-2 items-start text-base text-kolo-muted">
                  <span className="text-red-400 mt-0.5 shrink-0" aria-hidden="true">✕</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* ── ZAŠTO TO NIJE SAMO IZJAVA ──────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          {t("zasto_naslov")}
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {razlozi.map((r) => (
            <div key={r.naslov} className="bg-white rounded-2xl card-shadow p-5">
              <p className="font-semibold text-kolo-text text-base mb-1.5">{r.naslov}</p>
              <p className="text-sm text-kolo-muted leading-relaxed text-body">{r.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FONDACIJA I LICENCE ────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <h2 className="text-xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
            {t("fondacija_naslov")}
          </h2>
          <p className="text-sm text-kolo-muted leading-relaxed text-body">{t("fondacija_tekst")}</p>
        </section>
        <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
          <h2 className="text-xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
            {t("licence_naslov")}
          </h2>
          <p className="text-sm text-kolo-muted leading-relaxed text-body mb-3">{t("licence_tekst")}</p>
          <Link href="/zajednicko-dobro" className="text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors">
            {td("cta_licence")} →
          </Link>
        </section>
      </div>

      {/* ── GDE PIŠE DETALJNO ──────────────────────────────────────── */}
      <section className="bg-white rounded-2xl card-shadow p-6 md:p-8">
        <h2 className="text-xl font-bold text-kolo-green-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
          {t("gde_naslov")}
        </h2>
        <p className="text-sm text-kolo-muted leading-relaxed text-body mb-4">{t("gde_uvod")}</p>
        <div className="flex flex-wrap gap-2">
          {dokumenti.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="px-3 py-1.5 rounded-lg border border-kolo-border text-sm text-kolo-text hover:border-kolo-green-700 hover:text-kolo-green-900 transition-colors"
            >
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── NAZAD ──────────────────────────────────────────────────── */}
      <section className="text-center">
        <Link
          href="/kako-sistem-radi"
          className="inline-flex items-center gap-2 text-sm font-medium text-kolo-green-700 hover:text-kolo-green-900 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("nazad_link")}
        </Link>
      </section>

    </div>
  );
}
