"use client";

import { useState } from "react";
import { intlTag } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { MINIMUM_PRIJAVE_POKROVITELJSTVA } from "@/lib/donacija-pravila";

type Prijava = {
  id: string;
  naziv: string;
  pib: string;
  vrstaDonacije: "NOVAC" | "ROBA" | "USLUGE";
  vrednostRsd: number;
  ugovorTekst: string;
  status: "CEKA_POTPIS" | "POTPISANA" | "POTVRDJENA" | "ODBIJENA";
  odbijenoRazlog: string | null;
  createdAt: string;
};

const MAX_BYTES = 3_000_000;

export default function PokroviteljstvoPrijava() {
  const locale = useLocale();
  const t = useTranslations("postaniPokrovitelj");
  const { data: prijave = [], isLoading: ucitavanje, refetch } = useQuery({
    queryKey: ["pokroviteljstvo-moje-prijave"],
    queryFn: async (): Promise<Prijava[]> => {
      const res = await fetch("/api/pokroviteljstvo/prijava");
      if (!res.ok) throw new Error(t("greska_ucitavanje"));
      const d = await res.json();
      return d.prijave ?? [];
    },
  });
  const [radnja, setRadnja] = useState<string | null>(null);
  const [otvoreniUgovor, setOtvoreniUgovor] = useState<string | null>(null);

  const [naziv, setNaziv] = useState("");
  const [pib, setPib] = useState("");
  const [vrednost, setVrednost] = useState("");
  const [greska, setGreska] = useState("");

  async function posalji() {
    setGreska("");
    if (Number(vrednost) < MINIMUM_PRIJAVE_POKROVITELJSTVA) {
      setGreska(t("forma_minimum", { iznos: MINIMUM_PRIJAVE_POKROVITELJSTVA.toLocaleString(intlTag(locale)) }));
      return;
    }
    setRadnja("posalji");
    const res = await fetch("/api/pokroviteljstvo/prijava", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ naziv: naziv.trim(), pib: pib.trim(), vrstaDonacije: "NOVAC", vrednostRsd: Number(vrednost) }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) {
      setNaziv(""); setPib(""); setVrednost("");
      await refetch();
    } else setGreska(d.error ?? t("forma_greska_slanja"));
  }

  async function potpisi(id: string) {
    if (!confirm(t("potpis_potvrda"))) return;
    setRadnja(id);
    const res = await fetch(`/api/pokroviteljstvo/prijava/${id}/potpisi`, { method: "POST" });
    setRadnja(null);
    if (res.ok) await refetch();
    else { const d = await res.json().catch(() => ({})); alert(d.error ?? t("greska")); }
  }


  const STATUS_LABEL: Record<Prijava["status"], string> = {
    CEKA_POTPIS: t("status_ceka_potpis"),
    POTPISANA: t("status_potpisana"),
    POTVRDJENA: t("status_potvrdjena"),
    ODBIJENA: t("status_odbijena"),
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Forma */}
      <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-kolo-text">{t("forma_naslov")}</h2>
        <p className="text-sm text-kolo-muted">
          {t("forma_opis")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">{t("forma_naziv_label")}</label>
            <input value={naziv} onChange={(e) => setNaziv(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">{t("forma_pib_label")}</label>
            <input value={pib} onChange={(e) => setPib(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">{t("forma_vrednost_label")}</label>
            <input type="number" value={vrednost} onChange={(e) => setVrednost(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
            <p className="mt-1 text-xs text-kolo-muted">
              {t("forma_minimum_napomena", { iznos: MINIMUM_PRIJAVE_POKROVITELJSTVA.toLocaleString(intlTag(locale)) })}
            </p>
          </div>
        </div>
        {greska && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>}
        <button onClick={posalji}
          disabled={radnja === "posalji" || !naziv.trim() || !pib.trim() || !vrednost || Number(vrednost) <= 0}
          className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50">
          {radnja === "posalji" ? t("forma_saljem") : t("forma_podnesi")}
        </button>
      </div>

      {/* Moje prijave */}
      <div>
        <h2 className="font-semibold text-kolo-text mb-3">{t("moje_prijave_naslov")}</h2>
        {ucitavanje ? (
          <p className="text-sm text-kolo-muted">{t("ucitavanje")}</p>
        ) : prijave.length === 0 ? (
          <div className="bg-kolo-surface border border-kolo-border rounded-2xl p-6 text-center text-sm text-kolo-muted">
            {t("moje_prijave_prazno")}
          </div>
        ) : (
          <div className="space-y-3">
            {prijave.map((p) => (
              <div key={p.id} className="bg-kolo-surface border border-kolo-border rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-kolo-text">{p.naziv} <span className="text-kolo-muted font-normal">· {t("forma_pib_label")} {p.pib}</span></p>
                    <p className="text-sm text-kolo-muted mt-0.5">{p.vrednostRsd.toLocaleString(intlTag(locale))} RSD</p>
                    <p className="text-xs mt-1 font-semibold text-kolo-gold-600">{STATUS_LABEL[p.status]}</p>
                    {p.status === "ODBIJENA" && p.odbijenoRazlog && (
                      <p className="text-xs text-kolo-danger mt-0.5">{t("odbijena_razlog")} {p.odbijenoRazlog}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={() => setOtvoreniUgovor(otvoreniUgovor === p.id ? null : p.id)}
                      className="px-2.5 py-1 bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold rounded-lg">
                      {otvoreniUgovor === p.id ? t("sakrij_ugovor") : t("prikazi_ugovor")}
                    </button>
                    {p.status === "CEKA_POTPIS" && (
                      <button onClick={() => potpisi(p.id)} disabled={radnja === p.id}
                        className="px-2.5 py-1 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg disabled:opacity-60">
                        {radnja === p.id ? "…" : t("potpisi")}
                      </button>
                    )}
                  </div>
                </div>
                {otvoreniUgovor === p.id && (
                  <pre className="mt-3 text-xs text-kolo-text whitespace-pre-wrap font-sans bg-kolo-bg rounded-xl p-4">{p.ugovorTekst}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
