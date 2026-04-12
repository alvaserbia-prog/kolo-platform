import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function KakoFunkcionisePage() {
  const t = await getTranslations("kakoFunkcionise");

  const koraci = [
    { korak: "1", naslov: t("k1_naslov"), opis: t("k1_opis"), boja: "bg-kolo-green-100 text-kolo-green-700" },
    { korak: "2", naslov: t("k2_naslov"), opis: t("k2_opis"), boja: "bg-kolo-green-100 text-kolo-green-700" },
    { korak: "3", naslov: t("k3_naslov"), opis: t("k3_opis"), boja: "bg-kolo-gold-100 text-kolo-gold-600" },
    { korak: "4", naslov: t("k4_naslov"), opis: t("k4_opis"), boja: "bg-kolo-green-100 text-kolo-green-700" },
  ];

  const poenFakti = [
    { naslov: t("poen_f1_naslov"), opis: t("poen_f1_opis") },
    { naslov: t("poen_f2_naslov"), opis: t("poen_f2_opis") },
    { naslov: t("poen_f3_naslov"), opis: t("poen_f3_opis") },
    { naslov: t("poen_f4_naslov"), opis: t("poen_f4_opis") },
  ];

  const programi = [
    { naziv: t("prog_ver_naziv"),  iznos: t("prog_ver_iznos"),  opis: t("prog_ver_opis"),  ikona: "✓", aktivan: true },
    { naziv: t("prog_prep_naziv"), iznos: t("prog_prep_iznos"), opis: t("prog_prep_opis"), ikona: "→", aktivan: true },
    { naziv: t("prog_don_naziv"),  iznos: t("prog_don_iznos"),  opis: t("prog_don_opis"),  ikona: "♥", aktivan: true },
    { naziv: t("prog_por_naziv"),  iznos: t("prog_por_iznos"),  opis: t("prog_por_opis"),  ikona: "🏡", aktivan: false },
  ];

  return (
    <div className="max-w-[1140px] mx-auto space-y-6 pb-8">

      {/* Uvod */}
      <section className="text-center pt-4">
        <div className="inline-block bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          {t("vodic")}
        </div>
        <h1 className="text-3xl font-bold text-kolo-green-900 mb-4" style={{ letterSpacing: "-0.02em" }}>
          {t("naslov")}
        </h1>
        <p className="text-kolo-muted leading-relaxed max-w-xl mx-auto">
          {t("uvod")}
        </p>
      </section>

      {/* Koraci */}
      <section>
        <h2 className="text-xl font-bold text-kolo-green-900 mb-6" style={{ letterSpacing: "-0.02em" }}>
          {t("4_koraka")}
        </h2>
        <div className="space-y-4">
          {koraci.map((s) => (
            <div key={s.korak} className="flex gap-4 bg-white rounded-2xl card-shadow p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${s.boja}`}>
                {s.korak}
              </div>
              <div>
                <p className="font-semibold text-kolo-text">{s.naslov}</p>
                <p className="text-sm text-kolo-muted mt-1 leading-relaxed">{s.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POEN */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center font-bold text-sm">P</div>
          <h2 className="text-lg font-bold text-kolo-green-900">{t("poen_naslov")}</h2>
        </div>
        <p className="text-sm text-kolo-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t.markup("poen_opis", { strong: (chunks) => `<strong>${chunks}</strong>` }) }}
        />
        <div className="grid grid-cols-2 gap-3">
          {poenFakti.map((f) => (
            <div key={f.naslov} className="bg-kolo-bg rounded-xl p-3">
              <p className="text-xs font-semibold text-kolo-text">{f.naslov}</p>
              <p className="text-sm text-kolo-muted mt-0.5">{f.opis}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ZRNO */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-kolo-gold-100 text-kolo-gold-600 flex items-center justify-center font-bold text-sm">Z</div>
          <h2 className="text-lg font-bold text-kolo-green-900">{t("zrno_naslov")}</h2>
        </div>
        <p className="text-sm text-kolo-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t.markup("zrno_opis", { strong: (chunks) => `<strong>${chunks}</strong>` }) }}
        />
        <div className="bg-kolo-gold-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-kolo-gold-600 mb-1">{t("zrno_kurs_naslov")}</p>
          <p className="text-sm text-kolo-muted leading-relaxed">{t("zrno_kurs_opis")}</p>
        </div>
      </section>

      {/* Verifikacija */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <h2 className="text-lg font-bold text-kolo-green-900">{t("ver_naslov")}</h2>
        <p className="text-sm text-kolo-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t.markup("ver_opis", { strong: (chunks) => `<strong>${chunks}</strong>` }) }}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-kolo-bg rounded-xl p-4">
            <p className="text-sm font-semibold text-kolo-text mb-1">{t("ver_k1_naslov")}</p>
            <p className="text-sm text-kolo-muted leading-relaxed">{t("ver_k1_opis")}</p>
          </div>
          <div className="bg-kolo-bg rounded-xl p-4">
            <p className="text-sm font-semibold text-kolo-text mb-1">{t("ver_k2_naslov")}</p>
            <p className="text-sm text-kolo-muted leading-relaxed">{t("ver_k2_opis")}</p>
          </div>
        </div>
      </section>

      {/* Programi */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-kolo-green-900" style={{ letterSpacing: "-0.02em" }}>
          {t("prog_naslov")}
        </h2>
        <p className="text-sm text-kolo-muted"
          dangerouslySetInnerHTML={{ __html: t.markup("prog_opis", { strong: (chunks) => `<strong>${chunks}</strong>` }) }}
        />
        <div className="grid grid-cols-1 gap-3">
          {programi.map((p) => (
            <div key={p.naziv} className={`bg-white rounded-2xl card-shadow p-5 flex gap-4 items-start ${!p.aktivan ? "opacity-60" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center text-lg shrink-0 font-bold">
                {!p.aktivan ? "🔒" : p.ikona}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-kolo-text">{p.naziv}</p>
                  <span className="text-xs font-mono bg-kolo-green-100 text-kolo-green-700 px-2 py-0.5 rounded">{p.iznos}</span>
                </div>
                <p className="text-sm text-kolo-muted mt-1 leading-relaxed">{p.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zadruge */}
      <section className="bg-white rounded-2xl card-shadow p-6 space-y-4">
        <h2 className="text-lg font-bold text-kolo-green-900">{t("zadruge_naslov")}</h2>
        <p className="text-sm text-kolo-muted leading-relaxed">{t("zadruge_opis")}</p>
        <div className="bg-kolo-bg rounded-xl p-4">
          <p className="text-xs font-semibold text-kolo-text mb-1">{t("zadruge_osnivanje_naslov")}</p>
          <p className="text-sm text-kolo-muted">{t("zadruge_osnivanje_opis")}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-kolo-green-700 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>{t("cta_naslov")}</h2>
        <p className="text-white/70 text-sm mb-6">{t("cta_opis")}</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/registracija"
            className="px-7 py-3 bg-kolo-gold-400 text-kolo-green-900 font-bold rounded-xl hover:bg-kolo-gold-600 hover:text-white transition-colors text-sm">
            {t("cta_registruj")}
          </Link>
          <Link href="/pijaca"
            className="px-7 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm">
            {t("cta_pijaca")}
          </Link>
        </div>
      </section>

    </div>
  );
}
