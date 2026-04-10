"use client";

import { useState } from "react";
import Link from "next/link";

type Sekcija = "pregled" | "clanovi" | "transakcije" | "programi" | "zadruge";

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
  TRANSFER: "bg-kolo-bg text-kolo-muted",
  EMISIJA_VERIFIKACIJA: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_PREPORUKA: "bg-kolo-info-light text-kolo-info",
  EMISIJA_DONACIJA: "bg-kolo-gold-100 text-kolo-gold-600",
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
  fromId: string | null;
  toPseudonim: string;
  toId: string | null;
}

interface Clan {
  id: string;
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
  pseudonim: string;
  verRequest: { status: string } | null;
  verified: boolean;
  opticaj: number;
  bankaBalance: number;
  ukupnoKorisnika: number;
  verifikovanih: number;
  ukupnoZadrugaCount: number;
  danasEmitovano: number;
  danasLimit: number;
  danasKorisnika: number;
  danasTransakcija: number;
  danasZadruga: number;
  emisijeChart: EmisijaChart[];
  transakcije: Transakcija[];
  clanovi: Clan[];
  zadruge: Zadruga[];
  programi: Program[];
}

export default function SistemKlijent({
  pseudonim,
  verRequest,
  verified,
  opticaj,
  bankaBalance,
  ukupnoKorisnika,
  verifikovanih,
  ukupnoZadrugaCount,
  danasEmitovano,
  danasLimit,
  danasKorisnika,
  danasTransakcija,
  danasZadruga,
  emisijeChart,
  transakcije,
  clanovi,
  zadruge,
  programi,
}: Props) {
  const [sekcija, setSekcija] = useState<Sekcija>("pregled");

  const aktivniProgrami = programi.filter((p) => p.isActive).length;
  const zeroSum = opticaj + bankaBalance === 0;

  const navigacija: { key: Sekcija; label: string; broj: number | string }[] = [
    { key: "pregled", label: "Pregled", broj: opticaj.toLocaleString("sr-RS") },
    { key: "clanovi", label: "Članovi", broj: ukupnoKorisnika },
    { key: "transakcije", label: "Transakcije", broj: transakcije.length },
    { key: "programi", label: "Programi", broj: aktivniProgrami },
    { key: "zadruge", label: "Zadruge", broj: ukupnoZadrugaCount },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Pozdrav */}
      <h1
        className="text-2xl font-bold text-kolo-text"
        style={{ letterSpacing: "-0.02em" }}
      >
        Dobrodošli, {pseudonim}
      </h1>

      {/* Upozorenja za neverifikovane */}
      {!verified && verRequest?.status === "PENDING" && (
        <div className="box-warning">
          <p className="text-sm font-semibold">Zahtev je na čekanju</p>
          <p className="text-sm mt-0.5 opacity-90">
            Dokumentacija je primljena i čeka pregled admina (1–3 radna dana).
          </p>
        </div>
      )}
      {!verified && !verRequest && (
        <div className="box-warning flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Nalog nije verifikovan</p>
            <p className="text-sm mt-0.5 opacity-90">
              Verifikujte identitet i dobijte <strong>1.000 POEN</strong> bonusa.
            </p>
          </div>
          <Link
            href="/verifikacija"
            className="shrink-0 px-4 py-2 bg-kolo-gold-600 text-white text-sm font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
          >
            Verifikuj →
          </Link>
        </div>
      )}

      {/* 4 kartice */}
      <div className="grid grid-cols-2 gap-4">
        {/* Članovi */}
        <button
          onClick={() => setSekcija("clanovi")}
          className={`rounded-2xl p-5 text-left transition-all border ${
            sekcija === "clanovi"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-xs font-medium mb-1 ${sekcija === "clanovi" ? "text-white/70" : "text-kolo-muted"}`}>
            Članovi
          </p>
          <p className={`text-3xl font-bold font-mono leading-tight ${sekcija === "clanovi" ? "text-white" : "text-kolo-text"}`}>
            {ukupnoKorisnika.toLocaleString("sr-RS")}
            {danasKorisnika > 0 && (
              <span className={`text-base font-semibold ml-1.5 ${sekcija === "clanovi" ? "text-white/60" : "text-kolo-green-500"}`}>
                (+{danasKorisnika})
              </span>
            )}
          </p>
          <p className={`text-xs mt-1 ${sekcija === "clanovi" ? "text-white/60" : "text-kolo-muted"}`}>
            {verifikovanih} verif. · {ukupnoKorisnika - verifikovanih} neverif.
          </p>
        </button>

        {/* Transakcije */}
        <button
          onClick={() => setSekcija("transakcije")}
          className={`rounded-2xl p-5 text-left transition-all border ${
            sekcija === "transakcije"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-xs font-medium mb-1 ${sekcija === "transakcije" ? "text-white/70" : "text-kolo-muted"}`}>
            Transakcije
          </p>
          <p className={`text-3xl font-bold font-mono leading-tight ${sekcija === "transakcije" ? "text-white" : "text-kolo-text"}`}>
            {transakcije.length.toLocaleString("sr-RS")}
            {danasTransakcija > 0 && (
              <span className={`text-base font-semibold ml-1.5 ${sekcija === "transakcije" ? "text-white/60" : "text-kolo-green-500"}`}>
                (+{danasTransakcija})
              </span>
            )}
          </p>
          <p className={`text-xs mt-1 ${sekcija === "transakcije" ? "text-white/60" : "text-kolo-muted"}`}>
            poslednjih {transakcije.length} u pregledu
          </p>
        </button>

        {/* Zadruge */}
        <button
          onClick={() => setSekcija("zadruge")}
          className={`rounded-2xl p-5 text-left transition-all border ${
            sekcija === "zadruge"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-xs font-medium mb-1 ${sekcija === "zadruge" ? "text-white/70" : "text-kolo-muted"}`}>
            Zadruge
          </p>
          <p className={`text-3xl font-bold font-mono leading-tight ${sekcija === "zadruge" ? "text-white" : "text-kolo-text"}`}>
            {ukupnoZadrugaCount.toLocaleString("sr-RS")}
            {danasZadruga > 0 && (
              <span className={`text-base font-semibold ml-1.5 ${sekcija === "zadruge" ? "text-white/60" : "text-kolo-green-500"}`}>
                (+{danasZadruga})
              </span>
            )}
          </p>
          <p className={`text-xs mt-1 ${sekcija === "zadruge" ? "text-white/60" : "text-kolo-muted"}`}>
            aktivnih u mreži
          </p>
        </button>

        {/* Opticaj */}
        <button
          onClick={() => setSekcija("pregled")}
          className={`rounded-2xl p-5 text-left transition-all border ${
            sekcija === "pregled"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-xs font-medium mb-1 ${sekcija === "pregled" ? "text-white/70" : "text-kolo-muted"}`}>
            Opticaj
          </p>
          <p className={`text-3xl font-bold font-mono leading-tight ${sekcija === "pregled" ? "text-white" : "text-kolo-text"}`}>
            {opticaj.toLocaleString("sr-RS")}
            {danasEmitovano > 0 && (
              <span className={`text-base font-semibold ml-1.5 ${sekcija === "pregled" ? "text-white/60" : "text-kolo-green-500"}`}>
                (+{danasEmitovano.toLocaleString("sr-RS")})
              </span>
            )}
          </p>
          <div className={`flex items-center gap-1.5 mt-1 text-xs ${sekcija === "pregled" ? "text-white/60" : "text-kolo-muted"}`}>
            {zeroSum ? (
              <>
                <span className={sekcija === "pregled" ? "text-white/80" : "text-kolo-green-600"}>✓</span>
                <span>zero-sum</span>
              </>
            ) : (
              <>
                <span className={sekcija === "pregled" ? "text-red-300" : "text-kolo-danger"}>✗</span>
                <span>greška u zbiru</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Separator */}
      <div className="border-t border-kolo-border" />

      {/* Sekcija sadržaj */}
      {sekcija === "pregled" && (
        <PregledSekcija
          verified={verified}
          opticaj={opticaj}
          danasEmitovano={danasEmitovano}
          danasLimit={danasLimit}
          emisijeChart={emisijeChart}
        />
      )}
      {sekcija === "clanovi" && (
        <ClanoviSekcija clanovi={clanovi} verified={verified} />
      )}
      {sekcija === "transakcije" && (
        <TransakcijeSekcija transakcije={transakcije} verified={verified} />
      )}
      {sekcija === "programi" && <ProgramiSekcija programi={programi} />}
      {sekcija === "zadruge" && (
        <ZadrugeSekcija zadruge={zadruge} verified={verified} />
      )}
    </div>
  );
}

// ── Pregled ───────────────────────────────────────────────────────────────────

function PregledSekcija({
  verified,
  opticaj,
  danasEmitovano,
  danasLimit,
  emisijeChart,
}: {
  verified: boolean;
  opticaj: number;
  danasEmitovano: number;
  danasLimit: number;
  emisijeChart: EmisijaChart[];
}) {
  const limitPct =
    danasLimit > 0 ? Math.min((danasEmitovano / danasLimit) * 100, 100) : 0;
  const maxEmitted = Math.max(...emisijeChart.map((e) => e.emitted), 1);

  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center text-sm text-kolo-muted">
        Detaljni pregled sistema dostupan je verifikovanim članovima.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-kolo-border p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-kolo-text">Dnevna emisija</p>
          <p className="text-xs text-kolo-muted">
            Limit: {danasLimit.toLocaleString("sr-RS")} POEN (10% opticaja)
          </p>
        </div>
        <div className="w-full h-3 bg-kolo-bg rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all ${
              limitPct >= 90
                ? "bg-kolo-danger"
                : limitPct >= 70
                ? "bg-kolo-gold-400"
                : "bg-kolo-green-500"
            }`}
            style={{ width: `${limitPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-kolo-muted">
          <span>
            Danas emitovano:{" "}
            <strong className="text-kolo-text">
              {danasEmitovano.toLocaleString("sr-RS")}
            </strong>
          </span>
          <span>
            Preostalo:{" "}
            <strong className="text-kolo-text">
              {Math.max(danasLimit - danasEmitovano, 0).toLocaleString("sr-RS")}
            </strong>
          </span>
        </div>
      </div>

      {emisijeChart.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5">
          <p className="text-sm font-semibold text-kolo-text mb-4">
            Emisija poslednjih 14 dana
          </p>
          <div className="flex items-end gap-1.5 h-24">
            {emisijeChart.map((e) => {
              const pct = (e.emitted / maxEmitted) * 100;
              return (
                <div
                  key={e.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div
                    className="w-full bg-kolo-green-500 rounded-t-sm relative"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-kolo-text text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                      {e.emitted.toLocaleString("sr-RS")}
                    </div>
                  </div>
                  <span className="text-[10px] text-kolo-muted rotate-45 origin-left translate-y-1">
                    {e.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Članovi ───────────────────────────────────────────────────────────────────

function ClanoviSekcija({
  clanovi,
  verified,
}: {
  clanovi: Clan[];
  verified: boolean;
}) {
  const [pretraga, setPretraga] = useState("");

  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">
          Pregled svih članova dostupan je verifikovanim članovima.
        </p>
        <Link
          href="/verifikacija"
          className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors"
        >
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
        className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
      />
      <div className="text-xs text-kolo-muted">
        {filtrirani.length} {filtrirani.length === 1 ? "član" : "članova"}
      </div>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_80px_60px_80px_100px] gap-0 px-4 py-2 bg-kolo-bg border-b border-kolo-border text-xs font-semibold text-kolo-muted">
          <span>Pseudonim</span>
          <span className="text-right">Balans</span>
          <span className="text-right">Preporuke</span>
          <span className="text-center">Zadruga</span>
          <span className="text-right">Registracija</span>
        </div>
        {filtrirani.length === 0 ? (
          <div className="p-6 text-center text-sm text-kolo-muted">
            Nema rezultata.
          </div>
        ) : (
          filtrirani.map((c, i) => (
            <div
              key={c.id}
              className={`${
                i < filtrirani.length - 1 ? "border-b border-kolo-border/30" : ""
              }`}
            >
              <div className="hidden sm:grid grid-cols-[1fr_80px_60px_80px_100px] gap-0 px-4 py-2.5 items-center text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Link
                    href={`/profil/${c.id}`}
                    className="font-medium text-kolo-green-700 hover:underline truncate"
                  >
                    {c.pseudonim}
                  </Link>
                  {c.verified ? (
                    <span className="shrink-0 text-xs bg-kolo-green-100 text-kolo-green-700 px-1.5 py-0.5 rounded font-medium">
                      ✓
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs bg-kolo-bg text-kolo-muted px-1.5 py-0.5 rounded font-medium">
                      ?
                    </span>
                  )}
                </div>
                <span className="text-right font-mono text-sm font-semibold text-kolo-text">
                  {c.balance.toLocaleString("sr-RS")}
                </span>
                <span className="text-right text-xs text-kolo-muted">
                  {c.preporuke}
                </span>
                <span className="text-center text-xs text-kolo-muted truncate px-1">
                  {c.zadruga ?? "—"}
                </span>
                <span className="text-right text-xs text-kolo-muted">
                  {new Date(c.createdAt).toLocaleDateString("sr-RS", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
              </div>
              <div className="sm:hidden px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profil/${c.id}`}
                      className="font-semibold text-kolo-green-700 hover:underline"
                    >
                      {c.pseudonim}
                    </Link>
                    {c.verified ? (
                      <span className="text-xs bg-kolo-green-100 text-kolo-green-700 px-1.5 py-0.5 rounded font-medium">
                        ✓
                      </span>
                    ) : (
                      <span className="text-xs bg-kolo-bg text-kolo-muted px-1.5 py-0.5 rounded font-medium">
                        ?
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-sm font-bold text-kolo-text">
                    {c.balance.toLocaleString("sr-RS")} POEN
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-kolo-muted">
                  {c.zadruga && <span>Zadruga: {c.zadruga}</span>}
                  <span>{c.preporuke} preporuka</span>
                  <span className="ml-auto">
                    {new Date(c.createdAt).toLocaleDateString("sr-RS", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Transakcije ───────────────────────────────────────────────────────────────

function TransakcijeSekcija({
  transakcije,
  verified,
}: {
  transakcije: Transakcija[];
  verified: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">
        Poslednjih {transakcije.length} transakcija u sistemu
      </p>
      {transakcije.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          Nema transakcija.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          {transakcije.map((t, i) => (
            <div
              key={t.id}
              className={`px-4 py-3 flex justify-between items-start ${
                i < transakcije.length - 1 ? "border-b border-kolo-border/30" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      TIP_BOJA[t.type] ?? "bg-kolo-bg text-kolo-muted"
                    }`}
                  >
                    {TIP_LABELA[t.type] ?? t.type}
                  </span>
                  {verified ? (
                    <span className="text-xs text-kolo-muted truncate flex items-center gap-1">
                      {t.fromId ? (
                        <Link
                          href={`/profil/${t.fromId}`}
                          className="text-kolo-green-700 hover:underline"
                        >
                          {t.fromPseudonim}
                        </Link>
                      ) : (
                        <span>{t.fromPseudonim}</span>
                      )}
                      <span className="text-kolo-border">→</span>
                      {t.toId ? (
                        <Link
                          href={`/profil/${t.toId}`}
                          className="text-kolo-green-700 hover:underline"
                        >
                          {t.toPseudonim}
                        </Link>
                      ) : (
                        <span>{t.toPseudonim}</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs text-kolo-muted">Anonimno</span>
                  )}
                </div>
                <p className="text-xs text-kolo-border mt-0.5">
                  {new Date(t.createdAt).toLocaleString("sr-RS", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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

function ProgramiSekcija({ programi }: { programi: Program[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">
        Programi KOLO Banke — emisija za socijalne namene
      </p>
      <div className="space-y-2">
        {programi.map((p) => (
          <div
            key={p.type}
            className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex gap-4 items-start"
          >
            <div
              className={`mt-0.5 shrink-0 w-2.5 h-2.5 rounded-full ${
                p.isActive ? "bg-kolo-green-900" : "bg-kolo-border"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-kolo-text">
                  {p.label}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    p.isActive
                      ? "bg-kolo-green-100 text-kolo-green-700"
                      : "bg-kolo-bg text-kolo-muted"
                  }`}
                >
                  {p.isActive ? "Aktivan" : "Neaktivan"}
                </span>
              </div>
              <p className="text-xs text-kolo-muted">{p.opis}</p>
              {p.isActive && p.activatedAt && (
                <p className="text-xs text-kolo-border mt-1">
                  Aktiviran:{" "}
                  {new Date(p.activatedAt).toLocaleDateString("sr-RS")}
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

function ZadrugeSekcija({
  zadruge,
  verified,
}: {
  zadruge: Zadruga[];
  verified: boolean;
}) {
  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">
          Pregled zadruga dostupan je verifikovanim članovima.
        </p>
        <Link
          href="/verifikacija"
          className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors"
        >
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
      <p className="text-xs text-kolo-muted">
        {zadruge.length} aktivnih zadruga u mreži
      </p>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {zadruge.map((z, i) => (
          <div
            key={z.id}
            className={`px-4 py-3.5 flex justify-between items-center ${
              i < zadruge.length - 1 ? "border-b border-kolo-border" : ""
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-kolo-text">{z.name}</p>
              <p className="text-xs text-kolo-muted mt-0.5">
                {z.location ?? "—"} · Osnov.{" "}
                {new Date(z.createdAt).toLocaleDateString("sr-RS", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
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
