"use client";

import { useState, useEffect } from "react";
import { intlTag } from "@/lib/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface Verzija {
  id: string;
  verzija: string;
  naslov: string;
  efektivnaOd: string;
}

/**
 * Nakon prihvatanja politike: novog korisnika (sveža registracija postavlja flag)
 * vodimo na welcome onboarding, postojećeg korisnika na /sistem.
 */
function odredisteNakonPristanka(): string {
  try {
    if (sessionStorage.getItem("kolo-welcome") === "1") return "/dobrodosli";
  } catch { /* sessionStorage nedostupan */ }
  return "/sistem";
}

export default function PolitikaPrihvatiPage() {
  const locale = useLocale();
  const t = useTranslations("politikaPrihvati");
  const router = useRouter();
  const [verzija, setVerzija] = useState<Verzija | null>(null);
  const [loading, setLoading] = useState(true);
  const [prihvatanje, setPrihvatanje] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/politika/prihvati")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.potrebno) {
          router.replace(odredisteNakonPristanka());
          return;
        }
        setVerzija(data.verzija);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [router]);

  async function prihvati() {
    if (!verzija) return;
    setPrihvatanje(true);
    setError("");
    const res = await fetch("/api/politika/prihvati", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verzijaId: verzija.id }),
    });
    if (!res.ok) {
      setError(t("greska_prihvatanje"));
      setPrihvatanje(false);
      return;
    }
    router.replace(odredisteNakonPristanka());
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kolo-bg">
        <p className="text-kolo-muted text-sm">{t("ucitavanje")}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-kolo-bg p-4">
      <div className="bg-white rounded-2xl border border-kolo-border p-8 max-w-md w-full shadow-sm">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-kolo-text mb-2">{t("naslov")}</h1>
          {verzija && (
            <p className="text-sm text-kolo-muted">
              {t("verzija_label")} <strong>{verzija.verzija}</strong>: {verzija.naslov}<br />
              {t("na_snazi_od")} <strong>{new Date(verzija.efektivnaOd).toLocaleDateString(intlTag(locale))}</strong>
            </p>
          )}
        </div>

        <p className="text-sm text-kolo-text mb-4">
          {t("opis")}
        </p>

        <p className="text-sm text-kolo-muted mb-6">
          {t("procitajte_na")}{" "}
          <Link href="/pravilnik" target="_blank" className="text-kolo-green-700 underline">
            {t("ovoj_stranici")}
          </Link>
          {t("ne_slazete_se")}
        </p>

        {error && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <button
          onClick={prihvati}
          disabled={prihvatanje}
          className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60"
        >
          {prihvatanje ? t("dugme_prihvatam_loading") : t("dugme_prihvatam")}
        </button>

        {/*
          Izlaz iz gejta. Politika čl. 16 i Uslovi čl. 40 (v4.1.1): ograničenje pristupa
          do prihvatanja ne dira u prava na pristup, prenosivost i brisanje podataka.
          `/profil` je zato izuzet iz redirect-a u AppShell-u — link mora da vodi negde
          gde se stvarno stiže, inače je odredba mrtvo slovo.
        */}
        <p className="text-xs text-kolo-muted mt-4 text-center">
          {t("pre_prihvatanja")}{" "}
          <Link href="/profil" className="text-kolo-green-700 underline">
            {t("podesavanja_profila")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
