"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "pregled" | "clanovi" | "transakcije" | "programi" | "zadruge";

const TIP_LABELA: Record<string, string> = {
  TRANSFER: "Transfer",
  EMISIJA_VERIFIKACIJA: "Verifikacija",
  EMISIJA_PREPORUKA: "Preporuka",
  EMISIJA_DONACIJA: "Donacija",
  EMISIJA_POKROVITELJ: "Pokrovitelj",
  EMISIJA_ZADRUGA_OSNIVANJE: "Osnivanje zadruge",
  EMISIJA_ZADRUGA_BONUS: "Bonus zadruge",
  EMISIJA_PROGRAM: "Program",
};

const TIP_BOJA: Record<string, string> = {
  TRANSFER: "bg-gray-100 text-gray-600",
  EMISIJA_VERIFIKACIJA: "bg-green-50 text-green-700",
  EMISIJA_PREPORUKA: "bg-blue-50 text-blue-700",
  EMISIJA_DONACIJA: "bg-amber-50 text-amber-700",
  EMISIJA_POKROVITELJ: "bg-yellow-50 text-yellow-700",
  EMISIJA_ZADRUGA_OSNIVANJE: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_ZADRUGA_BONUS: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_PROGRAM: "bg-kolo-green-100 text-kolo-green-700",
};

interface Transakcija {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
  fromPseudonim: string;
  toPseudonim: string;
}

interface Clan {
  pseudonim: string;
  verified: boolean;
  balance: number;
  zadruga: string | null;
  preporuke: number;
  createdAt: string;
}

interface Zadruga {
  id: string;
  name: string;
  location: string | null;
  clanovi: number;
  createdAt: string;
}

interface Program {
  type: string;
  label: string;
  opis: string;
  isActive: boolean;
  activatedAt: string | null;
}

interface EmisijaChart {
  date: string;
  emitted: number;
  limit: number;
}

interface Props {
  verified: boolean;
  opticaj: number;
  bankaBalance: number;
  ukupnoKorisnika: number;
  verifikovanih: number;
  ukupnoZadrugaCount: number;
  danasEmitovano: number;
  danasLimit: number;
  emisijeChart: EmisijaChart[];
  transakcije: Transakcija[];
  clanovi: Clan[];
  zadruge: Zadruga[];
  programi: Program[];
}

export default function SistemKlijent({
  verified,
  opticaj,
  bankaBalance,
  ukupnoKorisnika,
  verifikovanih,
  ukupnoZadrugaCount,
  danasEmitovano,
  danasLimit,
  emisijeChart,
  transakcije,
  clanovi,
  zadruge,
  programi,
}: Props) {
  const [tab, setTab] = useState<Tab>("pregled");

  const tabovi: [Tab, string][] = [
    ["pregled", "Pregled"],
    ["clanovi", "Članovi"],
    ["transakcije", "Transakcije"],
    ["programi", "Programi"],
    ["zadruge", "Zadruge"],
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-kolo-text" style={{ letterSpacing: "-0.02em" }}>
        Sistem
      </h1>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
        {tabovi.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === key
                ? "border-kolo-green-700 text-kolo-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pregled" && (
        <PregledTab
          verified={verified}
          opticaj={opticaj}
          bankaBalance={bankaBalance}
          ukupnoKorisnika={ukupnoKorisnika}
          verifikovanih={verifikovanih}
          ukupnoZadruga={ukupnoZadrugaCount}
          danasEmitovano={danasEmitovano}
          danasLimit={danasLimit}
          emisijeChart={emisijeChart}
        />
      )}
      {tab === "clanovi" && (
        <ClanoviTab clanovi={clanovi} verified={verified} />
      )}
      {tab === "transakcije" && (
        <TransakcijeTab transakcije={transakcije} verified={verified} />
      )}
      {tab === "programi" && <ProgramiTab programi={programi} />}
      {tab === "zadruge" && (
        <ZadrugeLista zadruge={zadruge} verified={verified} />
      )}
    </div>
  );
}

// ── Pregled ───────────────────────────────────────────────────────────────────

function PregledTab({
  verified,
  opticaj,
  bankaBalance,
  ukupnoKorisnika,
  verifikovanih,
  ukupnoZadruga,
  danasEmitovano,
  danasLimit,
  emisijeChart,
}: {
  verified: boolean;
  opticaj: number;
  bankaBalance: number;
  ukupnoKorisnika: number;
  verifikovanih: number;
  ukupnoZadruga: number;
  danasEmitovano: number;
  danasLimit: number;
  emisijeChart: EmisijaChart[];
}) {
  const limitPct = danasLimit > 0 ? Math.min((danasEmitovano / danasLimit) * 100, 100) : 0;
  const maxEmitted = Math.max(...emisijeChart.map((e) => e.emitted), 1);

  return (
    <div className="space-y-5">
      {/* Tri kartice */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-kolo-green-700 to-kolo-green-500 rounded-2xl p-4 text-white shadow">
          <p className="text-xs text-green-200 mb-1">Opticaj POENA</p>
          <p className="text-2xl font-bold font-mono">{opticaj.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-green-300 mt-0.5">POEN u sistemu</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Članovi</p>
          <p className="text-2xl font-bold text-kolo-text font-mono">{ukupnoKorisnika.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">
            {verifikovanih} verif. · {ukupnoKorisnika - verifikovanih} neverif.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Zadruge</p>
          <p className="text-2xl font-bold text-kolo-text font-mono">{ukupnoZadruga}</p>
          <p className="text-xs text-kolo-muted mt-0.5">aktivnih u mreži</p>
        </div>
      </div>

      {verified && (
        <>
          {/* Banka + Zero-sum */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-kolo-border p-4">
              <p className="text-xs text-kolo-muted mb-1">Stanje Banke</p>
              <p className="text-xl font-bold text-red-600 font-mono">
                {bankaBalance.toLocaleString("sr-RS")} POEN
              </p>
              <p className="text-xs text-kolo-muted mt-0.5">
                Svaki POEN u opticaju je minus na računu Banke.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-kolo-border p-4 flex flex-col justify-between">
              <p className="text-xs text-kolo-muted mb-2">Zero-sum provera</p>
              {opticaj + bankaBalance === 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-semibold text-green-700">Zbir svih računa = 0</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-red-600 text-lg">✗</span>
                  <span className="text-sm font-semibold text-red-700">Greška u zbiru!</span>
                </div>
              )}
            </div>
          </div>

          {/* Dnevni limit emisije */}
          <div className="bg-white rounded-2xl border border-kolo-border p-5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-kolo-text">Dnevna emisija</p>
              <p className="text-xs text-kolo-muted">
                Limit: {danasLimit.toLocaleString("sr-RS")} POEN (10% opticaja)
              </p>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${limitPct >= 90 ? "bg-red-500" : limitPct >= 70 ? "bg-amber-400" : "bg-kolo-green-600"}`}
                style={{ width: `${limitPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-kolo-muted">
              <span>Danas emitovano: <strong className="text-kolo-text">{danasEmitovano.toLocaleString("sr-RS")}</strong></span>
              <span>Preostalo: <strong className="text-kolo-text">{Math.max(danasLimit - danasEmitovano, 0).toLocaleString("sr-RS")}</strong></span>
            </div>
          </div>

          {/* Grafikon emisija */}
          {emisijeChart.length > 0 && (
            <div className="bg-white rounded-2xl border border-kolo-border p-5">
              <p className="text-sm font-semibold text-kolo-text mb-4">Emisija poslednjih 14 dana</p>
              <div className="flex items-end gap-1.5 h-24">
                {emisijeChart.map((e) => {
                  const pct = (e.emitted / maxEmitted) * 100;
                  return (
                    <div key={e.date} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        className="w-full bg-kolo-green-500 rounded-t-sm relative"
                        style={{ height: `${Math.max(pct, 4)}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                          {e.emitted.toLocaleString("sr-RS")}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 rotate-45 origin-left translate-y-1">
                        {e.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Članovi ───────────────────────────────────────────────────────────────────

function ClanoviTab({ clanovi, verified }: { clanovi: Clan[]; verified: boolean }) {
  const [pretraga, setPretraga] = useState("");

  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">Pregled svih članova dostupan je verifikovanim članovima.</p>
        <Link href="/verifikacija" className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
          Verifikuj nalog →
        </Link>
      </div>
    );
  }

  const filtrirani = clanovi.filter((c) =>
    c.pseudonim.toLowerCase().includes(pretraga.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={pretraga}
        onChange={(e) => setPretraga(e.target.value)}
        placeholder="Pretraži po pseudonimu..."
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-kolo-green-600 transition-colors"
      />
      <div className="text-xs text-kolo-muted">{filtrirani.length} {filtrirani.length === 1 ? "član" : "članova"}</div>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_60px_80px_100px] gap-0 px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500">
          <span>Pseudonim</span>
          <span className="text-right">Balans</span>
          <span className="text-right">Preporuke</span>
          <span className="text-center">Zadruga</span>
          <span className="text-right">Registracija</span>
        </div>
        {filtrirani.length === 0 ? (
          <div className="p-6 text-center text-sm text-kolo-muted">Nema rezultata.</div>
        ) : (
          filtrirani.map((c, i) => (
            <div
              key={c.pseudonim}
              className={`grid grid-cols-[1fr_80px_60px_80px_100px] gap-0 px-4 py-2.5 items-center text-sm ${i < filtrirani.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-kolo-text truncate">{c.pseudonim}</span>
                {c.verified ? (
                  <span className="shrink-0 text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">✓</span>
                ) : (
                  <span className="shrink-0 text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-medium">?</span>
                )}
              </div>
              <span className="text-right font-mono text-sm font-semibold text-kolo-text">{c.balance.toLocaleString("sr-RS")}</span>
              <span className="text-right text-xs text-kolo-muted">{c.preporuke}</span>
              <span className="text-center text-xs text-kolo-muted truncate px-1">{c.zadruga ?? "—"}</span>
              <span className="text-right text-xs text-kolo-muted">
                {new Date(c.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit", year: "2-digit" })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Transakcije ───────────────────────────────────────────────────────────────

function TransakcijeTab({ transakcije, verified }: { transakcije: Transakcija[]; verified: boolean }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">Poslednjih {transakcije.length} transakcija u sistemu</p>
      {transakcije.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          Nema transakcija.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          {transakcije.map((t, i) => (
            <div
              key={t.id}
              className={`px-4 py-3 flex justify-between items-start ${i < transakcije.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${TIP_BOJA[t.type] ?? "bg-gray-100 text-gray-600"}`}>
                    {TIP_LABELA[t.type] ?? t.type}
                  </span>
                  {verified ? (
                    <span className="text-xs text-gray-500 truncate">
                      {t.fromPseudonim} → {t.toPseudonim}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Anonimno</span>
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-0.5">
                  {new Date(t.createdAt).toLocaleString("sr-RS", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="ml-4 text-sm font-bold text-kolo-text shrink-0 font-mono">
                {t.amount.toLocaleString("sr-RS")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Programi ──────────────────────────────────────────────────────────────────

function ProgramiTab({ programi }: { programi: Program[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">Programi KOLO Banke — emisija za socijalne namene</p>
      <div className="space-y-2">
        {programi.map((p) => (
          <div key={p.type} className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex gap-4 items-start">
            <div className={`mt-0.5 shrink-0 w-2.5 h-2.5 rounded-full ${p.isActive ? "bg-green-500" : "bg-gray-300"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-kolo-text">{p.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${p.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.isActive ? "Aktivan" : "Neaktivan"}
                </span>
              </div>
              <p className="text-xs text-kolo-muted">{p.opis}</p>
              {p.isActive && p.activatedAt && (
                <p className="text-xs text-gray-300 mt-1">
                  Aktiviran: {new Date(p.activatedAt).toLocaleDateString("sr-RS")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Zadruge ───────────────────────────────────────────────────────────────────

function ZadrugeLista({ zadruge, verified }: { zadruge: Zadruga[]; verified: boolean }) {
  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">Pregled zadruga dostupan je verifikovanim članovima.</p>
        <Link href="/verifikacija" className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
          Verifikuj nalog →
        </Link>
      </div>
    );
  }

  if (zadruge.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
        Nema aktivnih zadruga u mreži. Budi prvi — osnuj zadrugu!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">{zadruge.length} aktivnih zadruga u mreži</p>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {zadruge.map((z, i) => (
          <div
            key={z.id}
            className={`px-4 py-3.5 flex justify-between items-center ${i < zadruge.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <div>
              <p className="text-sm font-semibold text-kolo-text">{z.name}</p>
              <p className="text-xs text-kolo-muted mt-0.5">
                {z.location ?? "—"} · Osnov. {new Date(z.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-sm font-bold text-kolo-text">{z.clanovi}</p>
              <p className="text-xs text-kolo-muted">zadrugara</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
