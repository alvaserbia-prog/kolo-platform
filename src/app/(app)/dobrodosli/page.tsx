"use client";

/**
 * /dobrodosli — kratak onboarding za nove korisnike.
 * Prikazuje se jednom, odmah posle registracije (umesto direktnog bacanja na QR).
 * Kasnije dostupan iz "?" u headeru.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function DobrodosliPage() {
  const t = useTranslations("dobrodosli");
  const router = useRouter();
  const [korak, setKorak] = useState(0);

  interface Korak {
    oznaka: string;
    naslov: string;
    pasusi: string[];
  }

  const KORACI: Korak[] = [
    {
      oznaka: t("korak1_oznaka"),
      naslov: t("korak1_naslov"),
      pasusi: [t("korak1_p1"), t("korak1_p2"), t("korak1_p3")],
    },
    {
      oznaka: t("korak2_oznaka"),
      naslov: t("korak2_naslov"),
      pasusi: [t("korak2_p1"), t("korak2_p2"), t("korak2_p3")],
    },
    {
      oznaka: t("korak3_oznaka"),
      naslov: t("korak3_naslov"),
      pasusi: [t("korak3_p1"), t("korak3_p2"), t("korak3_p3")],
    },
    {
      oznaka: t("korak4_oznaka"),
      naslov: t("korak4_naslov"),
      pasusi: [t("korak4_p1"), t("korak4_p2"), t("korak4_p3")],
    },
  ];

  // Jednokratni flag iz registracije/OAuth-a — očisti čim se welcome prikaže
  useEffect(() => {
    try { sessionStorage.removeItem("kolo-welcome"); } catch { /* nedostupan */ }
  }, []);

  const trenutni = KORACI[korak];
  const prvi = korak === 0;
  const poslednji = korak === KORACI.length - 1;

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Preskoči */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push("/sistem")}
          className="text-sm text-kolo-muted hover:text-kolo-text transition-colors"
        >
          {t("preskoči")}
        </button>
      </div>

      {/* Indikator koraka */}
      <div className="flex items-center justify-center gap-2">
        {KORACI.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === korak ? "w-8 bg-kolo-green-500" : "w-2 bg-kolo-border"
            }`}
          />
        ))}
      </div>

      {/* Kartica */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-7 md:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-kolo-green-700">
          {t("korak_indikator", { broj: korak + 1, ukupno: KORACI.length, oznaka: trenutni.oznaka })}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-kolo-text">{trenutni.naslov}</h1>
        <div className="mt-4 space-y-3">
          {trenutni.pasusi.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-kolo-muted">
              {p}
            </p>
          ))}
        </div>

        {/* Završni CTA-ovi na poslednjem koraku */}
        {poslednji && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/verifikacija")}
              className="flex-1 px-4 py-3 bg-kolo-green-700 hover:bg-kolo-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t("cta_poznajem")}
            </button>
            <button
              onClick={() => router.push("/tabla-jemstva")}
              className="flex-1 px-4 py-3 bg-white border border-kolo-green-700 text-kolo-green-700 hover:bg-kolo-green-100 text-sm font-semibold rounded-xl transition-colors"
            >
              {t("cta_ne_poznajem")}
            </button>
          </div>
        )}
      </div>

      {/* Navigacija */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setKorak((k) => Math.max(0, k - 1))}
          disabled={prvi}
          className="px-4 py-2 text-sm font-medium text-kolo-muted hover:text-kolo-text disabled:opacity-0 transition-colors"
        >
          {t("nazad")}
        </button>
        {!poslednji && (
          <button
            onClick={() => setKorak((k) => Math.min(KORACI.length - 1, k + 1))}
            className="px-5 py-2.5 bg-kolo-green-700 hover:bg-kolo-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {t("dalje")}
          </button>
        )}
      </div>
    </div>
  );
}
