"use client";

import { useEffect, useState } from "react";

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

// Poziv na broj = jedinstven za svakog člana (generisan od strane platforme)
// Za sada koristimo referralCode kao poziv na broj dok se ne definiše finalni format
const FONDACIJA_RACUN = "840-123456789-00"; // Placeholder — zameniti pre Beta faze

export default function DonacijeKlijent() {
  const [data, setData] = useState<DonacijeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [kopirano, setKopirano] = useState(false);

  useEffect(() => {
    fetch("/api/donacije")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-xl mx-auto py-12 text-center text-kolo-muted text-sm">Učitavanje...</div>;
  if (!data) return <div className="max-w-xl mx-auto py-12 text-center text-red-500 text-sm">Greška pri učitavanju.</div>;

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
      <h1 className="text-2xl font-bold text-kolo-text" style={{ letterSpacing: "-0.02em" }}>
        Donacije Fondaciji
      </h1>

      {/* Beta napomena */}
      <div className="box-warning">
        <p className="text-sm font-semibold">Beta faza — uskoro dostupno</p>
        <p className="text-sm mt-0.5 opacity-90">
          Tekući račun Fondacije biće otvoren pre Beta faze. Sve informacije ispod su pripremljene i biće aktivne.
        </p>
      </div>

      {/* Objašnjenje */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-5">
        <p className="text-sm text-kolo-muted">
          Donirajte dinare Fondaciji bankovnom uplatnicom i dobijte POENE prema vašem rangu donacija.
          Viši rang znači povoljniji kurs — jednom ostvaren rang se zadržava.
        </p>
      </div>

      {/* Rang */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-kolo-text">Vaš rang donacija</p>
            <p className="text-3xl font-bold text-kolo-green-700 mt-1">Nivo {data.trenutniNivo}</p>
            <p className="text-xs text-kolo-muted mt-0.5">
              Kumulativ: {data.kumulativRSD.toLocaleString("sr-RS")} RSD
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-kolo-muted">Trenutni kurs</p>
            <p className="text-2xl font-bold text-kolo-gold-600">{data.trenutniKurs.toFixed(2)}</p>
            <p className="text-xs text-kolo-muted">POEN/RSD</p>
          </div>
        </div>
        {sledeci && (
          <div className="mt-4 pt-4 border-t border-kolo-border">
            <p className="text-xs text-kolo-muted">
              Do Nivoa {sledeci.nivo} (kurs {sledeci.kurs.toFixed(2)} POEN/RSD) još:{" "}
              <span className="font-semibold text-kolo-text">
                {(sledeci.do - data.kumulativRSD).toLocaleString("sr-RS")} RSD
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Instrukcije za uplatu */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 space-y-4">
        <p className="text-sm font-semibold text-kolo-text">Instrukcije za uplatu</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-kolo-muted">Primalac:</span>
            <span className="font-medium text-kolo-text">KOLO Fondacija</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">Račun:</span>
            <span className="font-mono text-kolo-text">{FONDACIJA_RACUN}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">Svrha uplate:</span>
            <span className="font-medium text-kolo-text">Donacija</span>
          </div>
        </div>
        <div className="pt-2 border-t border-kolo-border">
          <p className="text-xs text-kolo-muted mb-3">
            Navedite svrhu "Donacija" — admin će upariti uplatu po vašem imenu. Iznos uplaćujete po sopstvenoj odluci.
          </p>
          <button
            onClick={kopirajPodatke}
            className="w-full py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors"
          >
            {kopirano ? "Kopirano ✓" : "Kopiraj podatke za uplatu"}
          </button>
        </div>
      </div>

      {/* Tabela rangova */}
      <div className="bg-white rounded-2xl card-shadow border border-kolo-border overflow-hidden">
        <div className="px-4 py-3 border-b border-kolo-border">
          <p className="text-sm font-semibold text-kolo-text">Tabela rangova donacija</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-sm">
            <thead>
              <tr className="bg-kolo-bg border-b border-kolo-border">
                <th className="px-4 py-2 text-left text-xs font-medium text-kolo-muted">Nivo</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-kolo-muted">Do (RSD)</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-kolo-muted">Kurs</th>
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
                      {active && <span className="ml-2 text-xs text-kolo-green-700 font-semibold">← vaš nivo</span>}
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

      {/* Istorija donacija */}
      <div>
        <h2 className="text-base font-semibold text-kolo-text mb-3">Moje donacije</h2>
        {data.donacije.length === 0 ? (
          <div className="bg-white rounded-2xl card-shadow border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            Još nema evidentiranih donacija.
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
                    {new Date(d.createdAt).toLocaleDateString("sr-RS")} · Nivo {d.level}
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
                    {d.status === "CONFIRMED" ? "Potvrđeno" : "Čeka potvrdu"}
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
