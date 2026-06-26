"use client";

/**
 * /dobrodosli — vodič kroz KOLO za nove korisnike.
 * Prikazuje se jednom, odmah posle registracije (umesto direktnog bacanja na QR),
 * a kasnije je uvek dostupan iz "?" u headeru (tada ceo vodič od početka).
 *
 * Ekrani su definisani u messages/ pod "dobrodosli" (ključevi ekranN_*),
 * pa se tekst menja bez diranja ove komponente. Dodavanje/uklanjanje ekrana =
 * izmena niza EKRANI ispod + odgovarajući ključevi u messages.
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/** Konfiguracija ekrana: ključ u messages + opciona akciona veza (cta).
 *  finalni ekran nosi dve glavne CTA dugmadi (verifikacija / tabla jemstva). */
const EKRANI: { key: string; cta?: string; finalni?: boolean }[] = [
  { key: "ekran1" },
  { key: "ekran2" },
  { key: "ekran3", cta: "/novcanik" },
  { key: "ekran4", cta: "/verifikacija" },
  { key: "ekran5", cta: "/pijaca" },
  { key: "ekran6", cta: "/verifikacija" },
  { key: "ekran7", finalni: true },
];

export default function DobrodosliPage() {
  const t = useTranslations("dobrodosli");
  const router = useRouter();
  const [korak, setKorak] = useState(0);
  const [prviPut, setPrviPut] = useState(false);

  // Jednokratni flag iz registracije/OAuth-a: ako postoji, ovo je prvi prolaz
  // (gornje dugme = "Preskoči" → /sistem). Inače je vodič otvoren iz "?"
  // (gornje dugme = "Zatvori" → nazad). Flag čistimo čim ga pročitamo.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("kolo-welcome")) {
        setPrviPut(true);
        sessionStorage.removeItem("kolo-welcome");
      }
    } catch {
      /* nedostupan */
    }
  }, []);

  const ekran = EKRANI[korak];
  const prvi = korak === 0;
  const poslednji = korak === EKRANI.length - 1;
  const oznaka = t(`${ekran.key}_oznaka`);
  const pasusi = [
    t(`${ekran.key}_p1`),
    t(`${ekran.key}_p2`),
    t(`${ekran.key}_p3`),
  ];

  function zatvori() {
    if (prviPut) router.push("/sistem");
    else router.back();
  }

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Preskoči (prvi prolaz) / Zatvori (otvoreno iz "?") */}
      <div className="flex justify-end">
        <button
          onClick={zatvori}
          className="text-sm text-kolo-muted hover:text-kolo-text transition-colors"
        >
          {prviPut ? t("preskoči") : t("zatvori")}
        </button>
      </div>

      {/* Indikator koraka */}
      <div className="flex items-center justify-center gap-2">
        {EKRANI.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === korak ? "w-8 bg-kolo-green-500" : "w-2 bg-kolo-border"
            }`}
          />
        ))}
      </div>

      {/* Kartica u stilu vesti Fondacije */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-7 md:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-kolo-green-700">
          {t("korak_indikator", { broj: korak + 1, ukupno: EKRANI.length, oznaka })}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-kolo-text">{t(`${ekran.key}_naslov`)}</h1>
        <div className="mt-4 space-y-3">
          {pasusi.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-kolo-text text-body">
              {p}
            </p>
          ))}
        </div>

        {/* Opciona akciona veza za ovaj ekran (npr. "Otvori Pijacu") */}
        {ekran.cta && !ekran.finalni && (
          <button
            onClick={() => router.push(ekran.cta!)}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-kolo-green-700 hover:underline"
          >
            {t(`${ekran.key}_cta`)} →
          </button>
        )}

        {/* Završni CTA-ovi na poslednjem ekranu */}
        {ekran.finalni && (
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
            onClick={() => setKorak((k) => Math.min(EKRANI.length - 1, k + 1))}
            className="px-5 py-2.5 bg-kolo-green-700 hover:bg-kolo-green-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {t("dalje")}
          </button>
        )}
      </div>
    </div>
  );
}
