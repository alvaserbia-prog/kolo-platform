"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import KarticaPrikaz from "@/components/jemstvo/KarticaPrikaz";
import type { KarticaPrikaz as Kartica } from "@/lib/jemstvo-kartica";

/**
 * Feed prepoznavanja — primarni ulaz za verifikovanog člana.
 * Jedna kartica, jedno pitanje: „Poznaješ li ovu osobu?".
 *
 * VAŽNO: odgovor „Da" NIJE jemstvo. On samo otvara kanal komunikacije. Formalni
 * čin jemstva je zaseban korak sa zasebnom potvrdom, na zidu.
 */
type Stavka = {
  id: string;
  pseudonim: string;
  kartica: Kartica;
  blizina: "mesto_generacija" | "mesto" | "ostalo";
  expiresAt: string;
};

export default function FeedPrepoznavanja() {
  const t = useTranslations("tablaJemstva");
  const router = useRouter();
  const [i, setI] = useState(0);
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState("");
  const [otvoren, setOtvoren] = useState<string | null>(null);

  const { data: kartice = [], isLoading, refetch } = useQuery({
    queryKey: ["jemstvo-feed"],
    queryFn: async (): Promise<Stavka[]> => {
      const res = await fetch("/api/tabla-jemstva/feed");
      if (!res.ok) throw new Error("feed");
      const d = await res.json();
      return d.kartice ?? [];
    },
  });

  const tekuca = kartice[i];

  async function odgovori(odgovor: "DA" | "NE" | "NISAM_SIGURAN") {
    if (!tekuca) return;
    setGreska("");
    setRadi(true);
    const res = await fetch(`/api/tabla-jemstva/${tekuca.id}/prepoznajem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ odgovor }),
    });
    const d = await res.json().catch(() => ({}));
    setRadi(false);
    if (!res.ok) {
      setGreska(d.error ?? t("greska_generalna"));
      return;
    }
    if (odgovor === "DA" && d.konverzacijaId) {
      setOtvoren(d.konverzacijaId);
      return;
    }
    dalje();
  }

  function dalje() {
    setOtvoren(null);
    if (i + 1 >= kartice.length) {
      setI(0);
      refetch();
    } else {
      setI(i + 1);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-5 text-sm text-kolo-muted">
        {t("ucitavanje")}
      </div>
    );
  }

  if (kartice.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted">{t("feed_prazan")}</p>
      </div>
    );
  }

  if (!tekuca) return null;

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-kolo-text">{t("feed_naslov")}</h2>
        <span className="text-xs text-kolo-muted shrink-0">
          {t("feed_brojac", { i: i + 1, ukupno: kartice.length })}
        </span>
      </div>

      <div className="bg-kolo-bg rounded-xl border border-kolo-border p-4">
        <KarticaPrikaz kartica={tekuca.kartica} />
      </div>

      {/* Zašto je baš ova kartica ovde — da član razume redosled. */}
      <p className="text-xs text-kolo-muted">
        {tekuca.blizina === "mesto_generacija"
          ? t("blizina_mesto_generacija")
          : tekuca.blizina === "mesto"
            ? t("blizina_mesto")
            : t("blizina_ostalo")}
      </p>

      {greska && (
        <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
      )}

      {otvoren ? (
        // Posle „Da" — kanal je otvoren. Nigde se ne nudi jemstvo: to je zaseban
        // akt, na zidu, sa sopstvenom potvrdom odgovornosti.
        <div className="space-y-3">
          <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">
            {t("prepoznavanje_otvoren_kanal")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push(`/poruke?k=${otvoren}`)}
              className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors"
            >
              {t("dugme_otvori_razgovor")}
            </button>
            <button
              onClick={dalje}
              className="px-4 py-2 rounded-xl bg-kolo-bg border border-kolo-border text-kolo-muted text-sm font-semibold hover:bg-kolo-border transition-colors"
            >
              {t("dugme_sledeca")}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-kolo-text">{t("feed_pitanje")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => odgovori("DA")}
              disabled={radi}
              className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 disabled:opacity-60 transition-colors"
            >
              {t("dugme_da")}
            </button>
            <button
              onClick={() => odgovori("NE")}
              disabled={radi}
              className="px-5 py-2.5 rounded-xl bg-kolo-bg border border-kolo-border text-kolo-muted text-sm font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors"
            >
              {t("dugme_ne")}
            </button>
            <button
              onClick={() => odgovori("NISAM_SIGURAN")}
              disabled={radi}
              className="px-5 py-2.5 rounded-xl bg-kolo-bg border border-kolo-border text-kolo-muted text-sm font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors"
            >
              {t("dugme_nisam_siguran")}
            </button>
          </div>
          <p className="text-xs text-kolo-muted">{t("feed_napomena_nije_jemstvo")}</p>
        </div>
      )}
    </div>
  );
}
