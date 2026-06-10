"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Prijava = {
  id: string;
  podnosilacPseudonim: string;
  naziv: string;
  pib: string;
  vrstaDonacije: "NOVAC" | "ROBA" | "USLUGE";
  vrednostRsd: number;
  imaCenovnik: boolean;
  status: "CEKA_POTPIS" | "POTPISANA" | "POTVRDJENA" | "ODBIJENA";
  odbijenoRazlog: string | null;
  createdAt: string;
};

type Detalji = Prijava & { ugovorTekst: string; cenovnikSlika: string | null };

export default function PokroviteljPrijaveTab({ onDone }: { onDone: () => void }) {
  const t = useTranslations("admin");

  const STATUS_LABEL: Record<Prijava["status"], string> = {
    CEKA_POTPIS: t("pokr_prijave_status_ceka_potpis"),
    POTPISANA: t("pokr_prijave_status_potpisana"),
    POTVRDJENA: t("pokr_prijave_status_potvrdjena"),
    ODBIJENA: t("pokr_prijave_status_odbijena"),
  };
  const VRSTA_LABEL: Record<Prijava["vrstaDonacije"], string> = {
    NOVAC: t("pokr_prijave_vrsta_novac"),
    ROBA: t("pokr_prijave_vrsta_roba"),
    USLUGE: t("pokr_prijave_vrsta_usluge"),
  };

  const [prijave, setPrijave] = useState<Prijava[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [radnja, setRadnja] = useState<string | null>(null);
  const [detalji, setDetalji] = useState<Detalji | null>(null);

  const ucitaj = useCallback(async () => {
    setUcitavanje(true);
    const res = await fetch("/api/admin/pokroviteljstvo/prijave");
    if (res.ok) setPrijave(await res.json());
    setUcitavanje(false);
  }, []);

  useEffect(() => { ucitaj(); }, [ucitaj]);

  async function otvoriDetalje(id: string) {
    const res = await fetch(`/api/admin/pokroviteljstvo/prijave/${id}`);
    if (res.ok) setDetalji(await res.json());
  }

  async function potvrdi(id: string) {
    if (!confirm(t("pokr_prijave_potvrdi_confirm"))) return;
    setRadnja(id);
    const res = await fetch(`/api/admin/pokroviteljstvo/prijave/${id}/potvrdi`, { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    alert(res.ok ? t("pokr_prijave_potvrdjeno_msg", { bonus: (d.bonus ?? 0).toLocaleString("sr-RS") }) : (d.error ?? t("greska_generalna")));
    if (res.ok) { setDetalji(null); await ucitaj(); onDone(); }
  }

  async function odbij(id: string) {
    const razlog = prompt(t("pokr_prijave_odbij_razlog_prompt"));
    if (razlog === null || !razlog.trim()) return;
    setRadnja(id);
    const res = await fetch(`/api/admin/pokroviteljstvo/prijave/${id}/odbij`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog: razlog.trim() }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) { setDetalji(null); await ucitaj(); onDone(); }
    else alert(d.error ?? t("greska_generalna"));
  }

  if (ucitavanje) return <p className="text-sm text-kolo-muted">{t("pokr_prijave_ucitavanje")}</p>;
  if (prijave.length === 0)
    return <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">{t("pokr_prijave_nema")}</div>;

  return (
    <div className="space-y-3">
      {prijave.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl border border-kolo-border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-kolo-text">{p.naziv} <span className="text-kolo-muted font-normal">· PIB {p.pib}</span></p>
              <p className="text-sm text-kolo-muted mt-0.5">
                {VRSTA_LABEL[p.vrstaDonacije]} · {p.vrednostRsd.toLocaleString("sr-RS")} RSD · {t("pokr_prijave_podneo", { pseudonim: p.podnosilacPseudonim })}
              </p>
              <p className="text-xs mt-1">
                <span className={`font-semibold ${p.status === "POTVRDJENA" ? "text-kolo-green-700" : p.status === "ODBIJENA" ? "text-kolo-danger" : "text-kolo-gold-600"}`}>
                  {STATUS_LABEL[p.status]}
                </span>
                {p.status === "ODBIJENA" && p.odbijenoRazlog && <span className="text-kolo-muted"> — {p.odbijenoRazlog}</span>}
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => otvoriDetalje(p.id)}
                className="px-2.5 py-1 bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold rounded-lg hover:bg-kolo-border">
                {t("pokr_prijave_detalji_btn")}
              </button>
              {p.status === "POTPISANA" && (
                <>
                  <button onClick={() => potvrdi(p.id)} disabled={radnja === p.id}
                    className="px-2.5 py-1 bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold rounded-lg disabled:opacity-60">
                    {t("pokr_prijave_potvrdi_btn")}
                  </button>
                  <button onClick={() => odbij(p.id)} disabled={radnja === p.id}
                    className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg disabled:opacity-60">
                    {t("pokr_prijave_odbij_btn")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {detalji && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setDetalji(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-auto p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-kolo-text">{t("pokr_prijave_ugovor_naslov")}</h3>
            <pre className="text-xs text-kolo-text whitespace-pre-wrap font-sans bg-kolo-bg rounded-xl p-4">{detalji.ugovorTekst}</pre>
            {detalji.cenovnikSlika && (
              <div>
                <p className="text-sm font-medium text-kolo-muted mb-2">{t("pokr_prijave_cenovnik_naslov")}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={detalji.cenovnikSlika} alt={t("pokr_prijave_cenovnik_alt")} className="w-full rounded-xl border border-kolo-border" />
              </div>
            )}
            <button onClick={() => setDetalji(null)} className="px-4 py-2 rounded-xl bg-kolo-bg border border-kolo-border text-sm font-semibold text-kolo-muted">
              {t("pokr_prijave_zatvori")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
