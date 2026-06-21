"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// QR biblioteka se učitava tek kad zatreba (posle „Generiši") — van početnog
// bundle-a donacija (manje „unused JavaScript" / TBT na učitavanju stranice).
const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), {
  ssr: false,
});

interface IpsInfo {
  konfigurisan: boolean;
  racun?: string;
  primalac?: string;
  minRSD?: number;
  maxRSD?: number;
}

interface IpsRezultat {
  ipsString: string;
  racun: string;
  primalac: string;
  svrha: string;
  iznosRSD: number;
  model: string;
  pozivNaBroj: string;
}

/**
 * IPS QR plaćanje donacije — instant dinarska uplata skeniranjem mobilnom
 * bankom. Generiše dinamički QR (iznos + poziv na broj). POEN se evidentira
 * tek nakon što Fondacija potvrdi priliv (kao i kod uplate na račun).
 *
 * Dok račun Fondacije nije podešen (env), GET vraća konfigurisan=false i
 * prikazuje se napomena „uskoro" — bez greške.
 */
export default function IpsQrPlacanje() {
  const t = useTranslations("donacije");
  const [info, setInfo] = useState<IpsInfo | null>(null);
  const [iznos, setIznos] = useState("");
  const [javno, setJavno] = useState(true);
  const [loading, setLoading] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [rezultat, setRezultat] = useState<IpsRezultat | null>(null);

  useEffect(() => {
    fetch("/api/donacije/ips")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => setInfo({ konfigurisan: false }));
  }, []);

  async function generisi() {
    setGreska(null);
    const n = Math.round(Number(iznos));
    const min = info?.minRSD ?? 100;
    if (!Number.isFinite(n) || n < min) {
      setGreska(t("ips_min_iznos", { min: min.toLocaleString("sr-RS") }));
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/donacije/ips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iznosRSD: n, javno }),
      });
      const j = await r.json();
      if (!r.ok) {
        setGreska(j.error ?? t("ips_greska"));
        return;
      }
      setRezultat(j as IpsRezultat);
    } catch {
      setGreska(t("karticno_greska_komunikacije"));
    } finally {
      setLoading(false);
    }
  }

  if (!info) return null; // tih dok se učitava info

  // Račun još nije otvoren/podešen → napomena, bez forme.
  if (!info.konfigurisan) {
    return (
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 space-y-2">
        <p className="text-sm font-semibold text-kolo-text">{t("ips_naslov")}</p>
        <p className="text-xs text-kolo-muted">{t("ips_uskoro")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 space-y-4">
      <div>
        <p className="text-sm font-semibold text-kolo-text">{t("ips_naslov")}</p>
        <p className="text-xs text-kolo-muted mt-0.5">{t("ips_opis")}</p>
      </div>

      {!rezultat ? (
        <>
          {/* Vidljivost (javna/anonimna) — isti izbor kao kartično */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-kolo-text">{t("vidljivost_naslov")}</p>
            <label
              className={`flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${
                javno ? "border-kolo-green-700/50 bg-kolo-green-100/40" : "border-kolo-border"
              }`}
            >
              <input type="radio" name="ips-vidljivost" checked={javno} onChange={() => setJavno(true)} className="mt-0.5" />
              <span className="text-xs">
                <span className="font-semibold text-kolo-text">{t("vidljivost_javna")}</span>
                <span className="block text-kolo-muted mt-0.5">{t("vidljivost_javna_opis")}</span>
              </span>
            </label>
            <label
              className={`flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${
                !javno ? "border-kolo-green-700/50 bg-kolo-green-100/40" : "border-kolo-border"
              }`}
            >
              <input type="radio" name="ips-vidljivost" checked={!javno} onChange={() => setJavno(false)} className="mt-0.5" />
              <span className="text-xs">
                <span className="font-semibold text-kolo-text">{t("vidljivost_anonimna")}</span>
                <span className="block text-kolo-muted mt-0.5">{t("vidljivost_anonimna_opis")}</span>
              </span>
            </label>
            {javno && <p className="text-xs text-kolo-gold-600">{t("vidljivost_upozorenje")}</p>}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="numeric"
                min={info.minRSD ?? 100}
                step={100}
                value={iznos}
                onChange={(e) => setIznos(e.target.value)}
                placeholder={t("karticno_iznos_placeholder")}
                className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-kolo-border text-sm focus:outline-none focus:ring-2 focus:ring-kolo-green-500/40"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-kolo-muted">RSD</span>
            </div>
            <button
              onClick={generisi}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors disabled:opacity-50"
            >
              {loading ? t("ips_generisem") : t("ips_generisi")}
            </button>
          </div>
          {info.maxRSD && (
            <p className="text-xs text-kolo-muted">
              {t("ips_limit", { max: info.maxRSD.toLocaleString("sr-RS") })}
            </p>
          )}
          {greska && <p className="text-xs text-red-500">{greska}</p>}
        </>
      ) : (
        <div className="space-y-4">
          {/* QR kod */}
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-3 border border-kolo-border">
              <QRCodeSVG value={rezultat.ipsString} size={208} level="M" />
            </div>
            <p className="text-xs text-kolo-muted text-center max-w-xs">{t("ips_skeniraj_uputstvo")}</p>
          </div>

          {/* Detalji uplate (i za ručni unos ako QR ne radi) */}
          <div className="space-y-2 text-sm border-t border-kolo-border pt-4">
            <div className="flex justify-between">
              <span className="text-kolo-muted">{t("primalac")}</span>
              <span className="font-medium text-kolo-text text-right">{rezultat.primalac}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-kolo-muted">{t("racun")}</span>
              <span className="font-mono text-kolo-text">{rezultat.racun}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-kolo-muted">{t("ips_iznos_label")}</span>
              <span className="font-semibold text-kolo-text">{rezultat.iznosRSD.toLocaleString("sr-RS")} RSD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-kolo-muted">{t("ips_poziv_na_broj")}</span>
              <span className="font-mono text-kolo-text">
                {t("ips_model")} {rezultat.model} · {rezultat.pozivNaBroj}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-kolo-green-100/50 border border-kolo-green-700/20 p-3">
            <p className="text-xs text-kolo-green-900">{t("ips_napomena_potvrda")}</p>
          </div>

          <button
            onClick={() => {
              setRezultat(null);
              setIznos("");
            }}
            className="w-full py-2.5 rounded-xl border border-kolo-border text-sm font-semibold text-kolo-text hover:bg-kolo-bg transition-colors"
          >
            {t("ips_novi")}
          </button>
        </div>
      )}
    </div>
  );
}
