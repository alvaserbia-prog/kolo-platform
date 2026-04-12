"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Donacija {
  id: string;
  amountRSD: number;
  cumulativeRSD: number;
  level: number;
  poenEmitted: number;
  status: "PENDING" | "CONFIRMED";
  createdAt: string;
}

interface RangRed {
  nivo: number;
  do: number;
  kurs: number;
}

interface DonacijeData {
  trenutniNivo: number;
  trenutniKurs: number;
  kumulativRSD: number;
  donacije: Donacija[];
  rangTabela: RangRed[];
}

interface Pokrovitelj {
  id: string;
  naziv: string;
  adresa: string | null;
  zadruga: { name: string } | null;
  rsdKumulativ: number;
  trenutniNivo: number;
}

// Poziv na broj = jedinstven za svakog člana (generisan od strane platforme)
// Za sada koristimo referralCode kao poziv na broj dok se ne definiše finalni format
const FONDACIJA_RACUN = "840-123456789-00"; // Placeholder — zameniti pre Beta faze

export default function DonacijeKlijent() {
  const t = useTranslations("donacije");
  const tc = useTranslations("common");
  const [data, setData] = useState<DonacijeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [kopirano, setKopirano] = useState(false);
  const [pokrovitelji, setPokrovitelji] = useState<Pokrovitelj[]>([]);

  useEffect(() => {
    fetch("/api/donacije")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
    fetch("/api/pokrovitelji")
      .then((r) => r.json())
      .then(setPokrovitelji);
  }, []);

  if (loading) return <div className="max-w-xl mx-auto py-12 text-center text-kolo-muted text-sm">{tc("ucitavanje")}</div>;
  if (!data) return <div className="max-w-xl mx-auto py-12 text-center text-red-500 text-sm">{tc("greska_ucitavanja")}</div>;

  const sledeci = data.rangTabela.find((r) => r.nivo === data.trenutniNivo + 1);

  function kopirajPodatke() {
    const tekst = `Primalac: KOLO Fondacija\nRačun: ${FONDACIJA_RACUN}\nSvrha: Donacija`;
    navigator.clipboard.writeText(tekst).then(() => {
      setKopirano(true);
      setTimeout(() => setKopirano(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="kolo-naslov" style={{ letterSpacing: "-0.02em" }}>
        {t("naslov")}
      </h1>

      {/* Beta napomena */}
      <div className="box-warning">
        <p className="text-sm font-semibold">{t("beta_naslov")}</p>
        <p className="text-sm mt-0.5 opacity-90">{t("beta_opis")}</p>
      </div>

      {/* Objašnjenje */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-5">
        <p className="text-sm text-kolo-muted">{t("objasnjenje")}</p>
      </div>

      {/* Rang */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-kolo-text">{t("vas_rang")}</p>
            <p className="text-3xl font-bold text-kolo-green-700 mt-1">{t("nivo", { n: data.trenutniNivo })}</p>
            <p className="text-xs text-kolo-muted mt-0.5">
              {t("kumulativ")} {data.kumulativRSD.toLocaleString("sr-RS")} RSD
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-kolo-muted">{t("trenutni_kurs")}</p>
            <p className="text-2xl font-bold text-kolo-gold-600">{data.trenutniKurs.toFixed(2)}</p>
            <p className="text-xs text-kolo-muted">{t("kurs_opis")}</p>
          </div>
        </div>
        {sledeci && (
          <div className="mt-4 pt-4 border-t border-kolo-border">
            <p className="text-xs text-kolo-muted">
              {t("do_nivoa", { n: sledeci.nivo, kurs: sledeci.kurs.toFixed(2) })}{" "}
              <span className="font-semibold text-kolo-text">
                {(sledeci.do - data.kumulativRSD).toLocaleString("sr-RS")} RSD
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Instrukcije za uplatu */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 space-y-4">
        <p className="text-sm font-semibold text-kolo-text">{t("instrukcije")}</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("primalac")}</span>
            <span className="font-medium text-kolo-text">KOLO Fondacija</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("racun")}</span>
            <span className="font-mono text-kolo-text">{FONDACIJA_RACUN}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("svrha")}</span>
            <span className="font-medium text-kolo-text">{t("svrha_vrednost")}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-kolo-border">
          <p className="text-xs text-kolo-muted mb-3">{t("napomena_uplata")}</p>
          <button
            onClick={kopirajPodatke}
            className="w-full py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors"
          >
            {kopirano ? t("kopirano") : t("kopiraj_btn")}
          </button>
        </div>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-kolo-muted">{t("tabela_nivo")}</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-kolo-muted">{t("tabela_do")}</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-kolo-muted">{t("tabela_kurs")}</th>
              </tr>
            </thead>
            <tbody>
              {data.rangTabela.map((r) => {
                const active = r.nivo === data.trenutniNivo;
                return (
                  <tr
                    key={r.nivo}
                    className={`border-b border-kolo-border last:border-0 ${active ? "bg-kolo-green-100/50" : ""}`}
                  >
                    <td className={`px-4 py-2.5 font-medium ${active ? "text-kolo-green-900" : "text-kolo-text"}`}>
                      {r.nivo}
                      {active && <span className="ml-2 text-xs text-kolo-green-700 font-semibold">{t("vas_nivo_oznaka")}</span>}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-mono text-xs ${active ? "text-kolo-green-900" : "text-kolo-muted"}`}>
                      {r.do >= 1_000_000_000
                        ? "1 mlrd"
                        : r.do >= 1_000_000
                        ? `${(r.do / 1_000_000).toFixed(0)} mil`
                        : r.do.toLocaleString("sr-RS")}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-mono ${active ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {r.kurs.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pokroviteljstvo baner */}
      <div className="bg-kolo-green-50 border border-kolo-green-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-kolo-green-900 mb-1">Predstavljate pravno lice?</p>
        <p className="text-sm text-kolo-muted mb-3">
          Kompanije, preduzetnici i organizacije mogu postati pokrovitelji KOLO platforme i dobijati POEN
          bonuse za svaki nivo doprinosa.
        </p>
        <Link
          href="/postani-pokrovitelj"
          className="inline-block text-sm font-semibold text-kolo-green-700 hover:underline"
        >
          Saznaj više o pokroviteljstvu →
        </Link>
      </div>

      {/* Ranglista pokrovitelja */}
      <div>
        <h2 className="text-base font-semibold text-kolo-text mb-3">Ranglista pokrovitelja</h2>
        {pokrovitelji.length === 0 ? (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            Još uvek nema registrovanih pokrovitelja.
          </div>
        ) : (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden">
            {pokrovitelji.map((p, i) => (
              <div
                key={p.id}
                className={`px-4 py-3 flex items-center gap-3 ${i < pokrovitelji.length - 1 ? "border-b border-kolo-border" : ""}`}
              >
                <div className="text-sm font-semibold text-kolo-muted w-5 text-right shrink-0">{i + 1}.</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-kolo-text">{p.naziv}</p>
                  {(p.adresa || p.zadruga) && (
                    <p className="text-xs text-kolo-muted mt-0.5">
                      {p.adresa && <span>{p.adresa}</span>}
                      {p.zadruga && <span className={p.adresa ? " · " : ""}>{p.zadruga.name}</span>}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-kolo-green-700">Nivo {p.trenutniNivo}</p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {p.rsdKumulativ.toLocaleString("sr-RS")} RSD
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Istorija donacija */}
      <div>
        <h2 className="text-base font-semibold text-kolo-text mb-3">{t("istorija_naslov")}</h2>
        {data.donacije.length === 0 ? (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            {t("nema_donacija")}
          </div>
        ) : (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden">
            {data.donacije.map((d, i) => (
              <div
                key={d.id}
                className={`px-4 py-3 flex items-center justify-between ${i < data.donacije.length - 1 ? "border-b border-kolo-border" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-kolo-text">
                    {d.amountRSD.toLocaleString("sr-RS")} RSD
                  </p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString("sr-RS")} · {t("nivo", { n: d.level })}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      d.status === "CONFIRMED"
                        ? "bg-kolo-green-100 text-kolo-green-700"
                        : "bg-kolo-gold-100 text-kolo-gold-600"
                    }`}
                  >
                    {d.status === "CONFIRMED" ? t("potvrdeno") : t("ceka_potvrdu")}
                  </span>
                  {d.status === "CONFIRMED" && (
                    <p className="text-xs text-kolo-green-700 font-mono mt-1">
                      +{d.poenEmitted.toLocaleString("sr-RS")} POEN
                    </p>
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
