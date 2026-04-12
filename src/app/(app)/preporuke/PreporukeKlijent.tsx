"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslations } from "next-intl";

interface Preporuka {
  pseudonim: string;
  registrovanAt: string;
  verified: boolean;
  bonus: number | null;
}

interface RangRed {
  rang: number;
  od: number;
  do: number | null;
  nagrada: number;
}

interface PreporukeData {
  memberHash: string;
  verifikovani: number;
  trenutniRang: number;
  sledecaNagrada: number;
  preporuke: Preporuka[];
  rangTabela: RangRed[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kolo.rs";

export default function PreporukeKlijent() {
  const t = useTranslations("preporuke");
  const tc = useTranslations("common");
  const [data, setData] = useState<PreporukeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [kopirano, setKopirano] = useState(false);

  useEffect(() => {
    fetch("/api/preporuke")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-xl mx-auto py-12 text-center text-kolo-muted text-sm">{tc("ucitavanje")}</div>;
  if (!data) return <div className="max-w-xl mx-auto py-12 text-center text-red-500 text-sm">{tc("greska_ucitavanja")}</div>;

  const link = `${BASE_URL}/m/${data.memberHash}`;

  function kopirajLink() {
    navigator.clipboard.writeText(link).then(() => {
      setKopirano(true);
      setTimeout(() => setKopirano(false), 2000);
    });
  }

  const totalPreporučenih = data.preporuke.length;

  return (
    <div className="space-y-6">
      <h1 className="kolo-naslov" style={{ letterSpacing: "-0.02em" }}>
        {t("naslov")}
      </h1>

      {/* QR + link */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <p className="text-sm font-semibold text-kolo-text mb-4">{t("vas_link")}</p>
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-white rounded-xl border border-kolo-border">
            <QRCodeSVG value={link} size={160} />
          </div>
          <div className="w-full">
            <div className="flex items-center gap-2 bg-kolo-bg rounded-xl border border-kolo-border px-3 py-2">
              <span className="text-xs text-kolo-muted flex-1 font-mono truncate">{link}</span>
              <button
                onClick={kopirajLink}
                className="shrink-0 text-xs font-semibold text-kolo-green-700 hover:text-kolo-green-500 transition-colors"
              >
                {kopirano ? t("kopirano") : t("kopiraj")}
              </button>
            </div>
            <p className="text-xs text-kolo-muted mt-2 text-center">
              {t("link_napomena")}
            </p>
          </div>
        </div>
      </div>

      {/* Rang + bonus */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-kolo-text">{t("vas_rang")}</p>
            <p className="text-3xl font-bold text-kolo-green-700 mt-1">{t("rang", { n: data.trenutniRang })}</p>
            <p className="text-xs text-kolo-muted mt-0.5">{t("verifikovanih", { count: data.verifikovani })}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-kolo-muted">{t("bonus_sledeca")}</p>
            <p className="text-2xl font-bold text-kolo-gold-600">{data.sledecaNagrada.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted">POEN</p>
          </div>
        </div>

        {/* Progress bar unutar ranga */}
        {data.trenutniRang < 10 && (() => {
          const red = data.rangTabela.find((r) => r.rang === data.trenutniRang);
          const sledeci = data.rangTabela.find((r) => r.rang === data.trenutniRang + 1);
          if (!red || !sledeci) return null;
          const odMax = sledeci.do ?? 999;
          const progress = data.trenutniRang === 0
            ? 0
            : Math.min(100, ((data.verifikovani - red.od + 1) / (odMax - red.od + 1)) * 100);
          const preostalo = sledeci.do ? sledeci.do - data.verifikovani : null;
          return (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-kolo-muted mb-1">
                <span>{t("rang", { n: data.trenutniRang })}</span>
                <span>{t("rang", { n: data.trenutniRang + 1 })} {preostalo ? `(${preostalo})` : ""}</span>
              </div>
              <div className="h-2 bg-kolo-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-kolo-green-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Tabela rangova */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden">
        <div className="px-4 py-3 border-b border-kolo-border">
          <p className="text-sm font-semibold text-kolo-text">{t("tabela_naslov")}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-sm">
            <thead>
              <tr className="bg-kolo-bg border-b border-kolo-border">
                <th className="px-4 py-2 text-left text-xs font-medium text-kolo-muted">{t("tabela_rang")}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-kolo-muted">{t("tabela_preporucenih")}</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-kolo-muted">{t("tabela_poen")}</th>
              </tr>
            </thead>
            <tbody>
              {data.rangTabela.map((r) => {
                const active = r.rang === data.trenutniRang;
                return (
                  <tr
                    key={r.rang}
                    className={`border-b border-kolo-border last:border-0 ${active ? "bg-kolo-green-100/50" : ""}`}
                  >
                    <td className={`px-4 py-2.5 font-medium ${active ? "text-kolo-green-900" : "text-kolo-text"}`}>
                      {r.rang === 0 ? "0" : `${r.rang}`}
                      {active && <span className="ml-2 text-xs text-kolo-green-700 font-semibold">{t("trenutni_oznaka")}</span>}
                    </td>
                    <td className={`px-4 py-2.5 ${active ? "text-kolo-green-900" : "text-kolo-muted"}`}>
                      {r.rang === 0 ? "0" : r.do ? `${r.od}–${r.do}` : `${r.od}+`}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-mono ${active ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {r.nagrada === 0 ? "—" : r.nagrada.toLocaleString("sr-RS")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista preporučenih */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-kolo-text">{t("moje_preporuke", { count: totalPreporučenih })}</h2>
        </div>
        {data.preporuke.length === 0 ? (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            {t("nema_preporuka")}
          </div>
        ) : (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden">
            {data.preporuke.map((p, i) => (
              <div
                key={p.pseudonim}
                className={`px-4 py-3 flex items-center justify-between ${i < data.preporuke.length - 1 ? "border-b border-kolo-border" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-kolo-text">{p.pseudonim}</p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {t("registrovan")} {new Date(p.registrovanAt).toLocaleDateString("sr-RS")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      p.verified
                        ? "bg-kolo-green-100 text-kolo-green-700"
                        : "bg-kolo-gold-100 text-kolo-gold-600"
                    }`}
                  >
                    {p.verified ? t("status_verifikovan") : t("status_registrovan")}
                  </span>
                  {p.bonus != null && (
                    <p className="text-xs text-kolo-green-700 font-mono mt-1">+{p.bonus.toLocaleString("sr-RS")} POEN</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
