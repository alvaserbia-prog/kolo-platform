"use client";

import { useEffect, useState } from "react";
import { intlTag } from "@/lib/format";
import { useTranslations, useLocale } from "next-intl";
import IpsQrPlacanje from "./IpsQrPlacanje";

interface Donacija {
  id: string;
  amountRSD: number;
  cumulativeRSD: number;
  level: number;
  poenEmitted: number;
  status: "PENDING" | "CONFIRMED";
  javno: boolean;
  createdAt: string;
}

interface JavnaDonacija {
  id: string;
  ime: string | null;
  anonimno: boolean;
  amountRSD: number;
  level: number;
  poenEmitted: number;
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
  donatorskiBroj: number;
  pozivNaBroj: string; // trajni broj člana za uplate, prikaz "42-15" (model 97)
  racun: string | null; // iz IPS konfiguracije (18 cifara) — null dok se račun ne otvori
  donacije: Donacija[];
  listaDonacija: JavnaDonacija[];
  rangTabela: RangRed[];
}

const FONDACIJA_RACUN_PLACEHOLDER = "840-123456789-00"; // dok račun nije otvoren (IPS_RACUN env)

/** Prikaz računa 18 cifara u standardnom obliku 3-13-2. */
function formatRacun(racun: string): string {
  const c = racun.replace(/\D/g, "");
  return c.length === 18 ? `${c.slice(0, 3)}-${c.slice(3, 16)}-${c.slice(16)}` : racun;
}

export default function DonacijeKlijent() {
  const locale = useLocale();
  const t = useTranslations("donacije");
  const tc = useTranslations("common");
  const [data, setData] = useState<DonacijeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [kopirano, setKopirano] = useState(false);
  const [iznosKartica, setIznosKartica] = useState("");
  const [javno, setJavno] = useState(true);
  const [karticaLoading, setKarticaLoading] = useState(false);
  const [karticaGreska, setKarticaGreska] = useState<string | null>(null);
  const [ishod, setIshod] = useState<"uspeh" | "neuspeh" | "greska" | null>(null);
  useEffect(() => {
    fetch("/api/donacije")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
    const p = new URLSearchParams(window.location.search).get("placanje");
    if (p === "uspeh" || p === "neuspeh" || p === "greska") setIshod(p);
  }, []);

  async function zapocniKarticno() {
    setKarticaGreska(null);
    const iznos = Math.round(Number(iznosKartica));
    if (!Number.isFinite(iznos) || iznos < 100) {
      setKarticaGreska(t("karticno_min_iznos"));
      return;
    }
    setKarticaLoading(true);
    try {
      const r = await fetch("/api/donacije/placanje/zapocni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iznosRSD: iznos, javno }),
      });
      const j = await r.json();
      if (!r.ok) {
        setKarticaGreska(j.error ?? t("karticno_nije_moguce"));
        return;
      }
      // Auto-submit forme ka NestPay gateway-u banke (preusmeravanje na 3D stranicu).
      const forma = document.createElement("form");
      forma.method = "POST";
      forma.action = j.gatewayUrl;
      for (const [k, v] of Object.entries(j.fields as Record<string, string>)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        forma.appendChild(input);
      }
      document.body.appendChild(forma);
      forma.submit();
    } catch {
      setKarticaGreska(t("karticno_greska_komunikacije"));
      setKarticaLoading(false);
    }
  }

  if (loading) return <div className="max-w-xl mx-auto py-12 text-center text-kolo-muted text-sm">{tc("ucitavanje")}</div>;
  if (!data) return <div className="max-w-xl mx-auto py-12 text-center text-red-500 text-sm">{tc("greska_ucitavanja")}</div>;

  const sledeci = data.rangTabela.find((r) => r.nivo === data.trenutniNivo + 1);

  const prikazRacuna = data.racun ? formatRacun(data.racun) : FONDACIJA_RACUN_PLACEHOLDER;

  function kopirajPodatke() {
    const tekst = `Primalac: KOLO Fondacija\nRačun: ${prikazRacuna}\nSvrha: Donacija\nModel: 97\nPoziv na broj: ${data!.pozivNaBroj}`;
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

      {/* Ishod kartičnog plaćanja (povratak sa gateway-a) */}
      {ishod === "uspeh" && (
        <div className="rounded-2xl border border-kolo-green-700/30 bg-kolo-green-100 p-4 text-sm text-kolo-green-900">
          {t("placanje_uspeh")}
        </div>
      )}
      {ishod === "neuspeh" && (
        <div className="rounded-2xl border border-kolo-gold-600/30 bg-kolo-gold-100 p-4 text-sm text-kolo-gold-600">
          {t("placanje_neuspeh")}
        </div>
      )}
      {ishod === "greska" && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-600">
          {t("placanje_greska")}
        </div>
      )}

      {/* Beta napomena */}
      <div className="box-warning">
        <p className="text-sm font-semibold">{t("beta_naslov")}</p>
        <p className="text-sm mt-0.5 opacity-90">{t("beta_opis")}</p>
      </div>

      {/* Objašnjenje */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-5">
        <p className="text-sm text-kolo-muted">{t("objasnjenje")}</p>
      </div>

      {/* Vrsta donacije — javna (POEN, ime javno) ili anonimna (bez POEN); važi za IPS i karticu */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 space-y-2">
        <p className="text-sm font-semibold text-kolo-text">{t("vidljivost_naslov")}</p>
        <label className={`flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${javno ? "border-kolo-green-700/50 bg-kolo-green-100/40" : "border-kolo-border"}`}>
          <input type="radio" name="vidljivost" checked={javno} onChange={() => setJavno(true)} className="mt-0.5" />
          <span className="text-xs">
            <span className="font-semibold text-kolo-text">{t("vidljivost_javna")}</span>
            <span className="block text-kolo-muted mt-0.5">{t("vidljivost_javna_opis")}</span>
          </span>
        </label>
        <label className={`flex items-start gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${!javno ? "border-kolo-green-700/50 bg-kolo-green-100/40" : "border-kolo-border"}`}>
          <input type="radio" name="vidljivost" checked={!javno} onChange={() => setJavno(false)} className="mt-0.5" />
          <span className="text-xs">
            <span className="font-semibold text-kolo-text">{t("vidljivost_anonimna")}</span>
            <span className="block text-kolo-muted mt-0.5">{t("vidljivost_anonimna_opis")}</span>
          </span>
        </label>
        {javno && (
          <p className="text-xs text-kolo-gold-600">{t("vidljivost_upozorenje")}</p>
        )}
      </div>

      {/* IPS QR — instant dinarska uplata skeniranjem mobilnom bankom */}
      <IpsQrPlacanje javno={javno} />

      {/* Kartično plaćanje (Banca Intesa / OTP — NestPay) */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-kolo-text">{t("karticno_naslov")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">
            {t("karticno_opis")}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              inputMode="numeric"
              min={100}
              step={100}
              value={iznosKartica}
              onChange={(e) => setIznosKartica(e.target.value)}
              placeholder={t("karticno_iznos_placeholder")}
              className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-kolo-border text-sm focus:outline-none focus:ring-2 focus:ring-kolo-green-500/40"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-kolo-muted">RSD</span>
          </div>
          <button
            onClick={zapocniKarticno}
            disabled={karticaLoading}
            className="px-5 py-2.5 rounded-xl bg-kolo-gold-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {karticaLoading ? t("karticno_otvaram") : t("karticno_plati")}
          </button>
        </div>
        {karticaGreska && <p className="text-xs text-red-500">{karticaGreska}</p>}
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
            <span className="font-mono text-kolo-text">{prikazRacuna}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("svrha")}</span>
            <span className="font-medium text-kolo-text">{t("svrha_vrednost")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("model")}</span>
            <span className="font-mono text-kolo-text">97</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("poziv_na_broj")}</span>
            <span className="font-mono font-semibold text-kolo-green-700">{data.pozivNaBroj}</span>
          </div>
        </div>
        <div className="rounded-xl bg-kolo-green-100/50 border border-kolo-green-700/20 p-3">
          <p className="text-xs text-kolo-green-900">{t("vas_broj_opis")}</p>
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

      {/* Rang */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-kolo-text">{t("vas_rang")}</p>
            <p className="text-3xl font-bold text-kolo-green-700 mt-1">{t("nivo", { n: data.trenutniNivo })}</p>
            <p className="text-xs text-kolo-muted mt-0.5">
              {t("kumulativ")} {data.kumulativRSD.toLocaleString(intlTag(locale))} RSD
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-kolo-muted">{t("trenutni_kurs")}</p>
            <p className="text-2xl font-bold text-kolo-gold-600">{data.trenutniKurs.toFixed(2)}</p>
            <p className="text-xs text-kolo-muted">{t("kurs_opis")}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-kolo-border space-y-1">
          <p className="text-xs text-kolo-muted">{t("rang_pojasnjenje")}</p>
          {sledeci && (
            <p className="text-xs text-kolo-muted">
              {t("do_nivoa", { n: sledeci.nivo, kurs: sledeci.kurs.toFixed(2) })}{" "}
              <span className="font-semibold text-kolo-text">
                {(sledeci.do - data.kumulativRSD).toLocaleString(intlTag(locale))} RSD
              </span>
            </p>
          )}
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
                    <td className={`px-4 py-2.5 text-right text-xs ${active ? "text-kolo-green-900" : "text-kolo-muted"}`}>
                      {r.do >= 1_000_000_000
                        ? "1 mlrd"
                        : r.do >= 1_000_000
                        ? `${(r.do / 1_000_000).toFixed(0)} mil`
                        : r.do.toLocaleString(intlTag(locale))}
                    </td>
                    <td className={`px-4 py-2.5 text-right ${active ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {r.kurs.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
                    {d.amountRSD.toLocaleString(intlTag(locale))} RSD
                  </p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString(intlTag(locale))} · {t("nivo", { n: d.level })}
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
                    <p className="text-xs text-kolo-green-700 mt-1">
                      +{d.poenEmitted.toLocaleString(intlTag(locale))} POEN
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Javna lista donacija — javni donatori imenom, anonimni bez imena */}
      <div>
        <h2 className="text-base font-semibold text-kolo-text mb-1">{t("lista_naslov")}</h2>
        <p className="text-xs text-kolo-muted mb-3">{t("lista_opis")}</p>
        {data.listaDonacija.length === 0 ? (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            {t("lista_prazno")}
          </div>
        ) : (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden">
            {data.listaDonacija.map((d, i) => (
              <div
                key={d.id}
                className={`px-4 py-3 flex items-center justify-between ${i < data.listaDonacija.length - 1 ? "border-b border-kolo-border" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-kolo-text">
                    {d.anonimno ? t("lista_anoniman") : d.ime || t("lista_anoniman")}
                  </p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString(intlTag(locale))} · {d.amountRSD.toLocaleString(intlTag(locale))} RSD
                  </p>
                </div>
                {!d.anonimno && d.poenEmitted > 0 && (
                  <p className="text-xs text-kolo-green-700 font-semibold">
                    +{d.poenEmitted.toLocaleString(intlTag(locale))} POEN
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
