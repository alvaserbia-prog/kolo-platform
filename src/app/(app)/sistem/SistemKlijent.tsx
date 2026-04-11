"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Sekcija = "pregled" | "clanovi" | "transakcije" | "programi" | "zadruge";
type TxFilter = "sve" | "banka" | "clanovi";

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
  location: string | null;
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

const CILJ_OPTICAJ = 1_000_000;

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
  const t = useTranslations("sistem");

  const aktivniProgrami = programi.filter((p) => p.isActive).length;
  const zeroSum = opticaj + bankaBalance === 0;

  return (
    <div className="space-y-6">
      {/* Pozdrav */}
      <h1
        className="kolo-naslov"
        style={{ letterSpacing: "-0.02em" }}
      >
        {t("dobrodoslice", { pseudonim })}
      </h1>

      {/* Upozorenja za neverifikovane */}
      {!verified && verRequest?.status === "PENDING" && (
        <div className="box-warning">
          <p className="text-sm font-semibold">{t("zahtev_na_cekanju_naslov")}</p>
          <p className="text-sm mt-0.5 opacity-90">
            {t("zahtev_na_cekanju_opis")}
          </p>
        </div>
      )}
      {!verified && !verRequest && (
        <div className="box-warning flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{t("nalog_nije_verifikovan_naslov")}</p>
            <p className="text-sm mt-0.5 opacity-90">
              {t("nalog_nije_verifikovan_opis", { iznos: "1.000 POEN" })}
            </p>
          </div>
          <Link
            href="/verifikacija"
            className="shrink-0 px-4 py-2 bg-kolo-gold-600 text-white text-sm font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
          >
            {t("verifikuj_dugme")}
          </Link>
        </div>
      )}

      {/* 4 kartice 2×2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Članovi */}
        <Kartica
          aktivan={sekcija === "clanovi"}
          onClick={() => setSekcija("clanovi")}
          label={t("kartica_clanovi")}
          broj={ukupnoKorisnika}
          danas={danasKorisnika}
          podnaslov={t("kartica_verif_opis", { verif: verifikovanih, neverif: ukupnoKorisnika - verifikovanih })}
        />

        {/* Transakcije */}
        <Kartica
          aktivan={sekcija === "transakcije"}
          onClick={() => setSekcija("transakcije")}
          label={t("kartica_transakcije")}
          broj={transakcije.length}
          danas={danasTransakcija}
          podnaslov={t("kartica_tx_opis", { count: transakcije.length })}
        />

        {/* Zadruge */}
        <Kartica
          aktivan={sekcija === "zadruge"}
          onClick={() => setSekcija("zadruge")}
          label={t("kartica_zadruge")}
          broj={ukupnoZadrugaCount}
          danas={danasZadruga}
          podnaslov={t("kartica_zadruge_opis")}
        />

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
            {t("kartica_opticaj")}
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
                <span>{t("zero_sum_ok")}</span>
              </>
            ) : (
              <>
                <span className={sekcija === "pregled" ? "text-red-300" : "text-kolo-danger"}>✗</span>
                <span>{t("zero_sum_greska")}</span>
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
          programi={programi}
          ukupnoZadruga={ukupnoZadrugaCount}
          aktivniProgrami={aktivniProgrami}
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

// ── Kartica (reusable) ────────────────────────────────────────────────────────

function Kartica({
  aktivan,
  onClick,
  label,
  broj,
  danas,
  podnaslov,
}: {
  aktivan: boolean;
  onClick: () => void;
  label: string;
  broj: number;
  danas: number;
  podnaslov: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-5 text-left transition-all border ${
        aktivan
          ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
          : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
      }`}
    >
      <p className={`text-xs font-medium mb-1 ${aktivan ? "text-white/70" : "text-kolo-muted"}`}>
        {label}
      </p>
      <p className={`text-3xl font-bold font-mono leading-tight ${aktivan ? "text-white" : "text-kolo-text"}`}>
        {broj.toLocaleString("sr-RS")}
        {danas > 0 && (
          <span className={`text-base font-semibold ml-1.5 ${aktivan ? "text-white/60" : "text-kolo-green-500"}`}>
            (+{danas})
          </span>
        )}
      </p>
      <p className={`text-xs mt-1 ${aktivan ? "text-white/60" : "text-kolo-muted"}`}>
        {podnaslov}
      </p>
    </button>
  );
}

// ── Pregled ───────────────────────────────────────────────────────────────────

function PregledSekcija({
  verified,
  opticaj,
  danasEmitovano,
  danasLimit,
  emisijeChart,
  programi,
  ukupnoZadruga,
  aktivniProgrami,
}: {
  verified: boolean;
  opticaj: number;
  danasEmitovano: number;
  danasLimit: number;
  emisijeChart: EmisijaChart[];
  programi: Program[];
  ukupnoZadruga: number;
  aktivniProgrami: number;
}) {
  const t = useTranslations("sistem");
  const maxEmitted = Math.max(...emisijeChart.map((e) => e.emitted), 1);
  const opticajPct = Math.min((opticaj / CILJ_OPTICAJ) * 100, 100);

  const faze = [
    { label: t("registracija_link"), on: true },
    { label: t("pijaca_link"), on: true },
    { label: t("poruke_link"), on: true },
    { label: t("zadruge_link"), on: ukupnoZadruga > 0 },
    { label: t("zaposljavnje_link"), on: programi.some((p) => p.type === "ZAPOSLJAVNJE" && p.isActive) },
    { label: t("podrska_majkama_link"), on: programi.some((p) => p.type === "PODRSKA_MAJKAMA" && p.isActive) },
    { label: t("podrska_starijima_link"), on: programi.some((p) => p.type === "PODRSKA_STARIJIMA" && p.isActive) },
    { label: t("posebna_briga_link"), on: programi.some((p) => p.type === "POSEBNA_BRIGA" && p.isActive) },
    { label: t("skolovanje_link"), on: programi.some((p) => p.type === "SKOLOVANJE" && p.isActive) },
    { label: t("zrno_trziste_link"), on: true },
    { label: t("glasanje_link"), on: true },
  ];

  return (
    <div className="space-y-5">
      {/* Progress bar do 1M */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-kolo-text">{t("rast_opticaja")}</p>
          <p className="text-xs text-kolo-muted">
            {t("rast_opticaja_cilj", { cilj: CILJ_OPTICAJ.toLocaleString("sr-RS") })}
          </p>
        </div>
        <div className="w-full h-3 bg-kolo-bg rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-kolo-green-500 rounded-full transition-all"
            style={{ width: `${opticajPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-kolo-muted">
          <span>
            {t("rast_opticaja_trenutno")}{" "}
            <strong className="text-kolo-text">
              {opticaj.toLocaleString("sr-RS")} POEN
            </strong>
          </span>
          <span className="font-medium text-kolo-green-700">
            {opticajPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Čeklista faza */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5">
        <p className="text-sm font-semibold text-kolo-text mb-4">{t("aktivirane_funkcije")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {faze.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <span
                className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  f.on
                    ? "bg-kolo-green-100 text-kolo-green-700"
                    : "bg-kolo-bg text-kolo-border"
                }`}
              >
                {f.on ? "✓" : "○"}
              </span>
              <span className={`text-sm ${f.on ? "text-kolo-text" : "text-kolo-muted"}`}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grafikon emisija — samo za verifikovane */}
      {verified && emisijeChart.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-kolo-text">
              {t("emisija_14_dana")}
            </p>
            <p className="text-xs text-kolo-muted">
              {t("emisija_limit_danas", { limit: danasLimit.toLocaleString("sr-RS") })}
            </p>
          </div>
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
          <p className="text-xs text-kolo-muted mt-4">
            {t("emisija_danas")}{" "}
            <strong className="text-kolo-text">
              {danasEmitovano.toLocaleString("sr-RS")} POEN
            </strong>
          </p>
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
  const t = useTranslations("sistem");
  const [pretraga, setPretraga] = useState("");

  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">
          {t("clanovi_pregled_blokiran")}
        </p>
        <Link
          href="/verifikacija"
          className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors"
        >
          {t("verifikuj_dugme_link")}
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
        placeholder={t("pretrazi_pseudonim")}
        className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
      />
      <div className="text-xs text-kolo-muted">
        {filtrirani.length} {filtrirani.length === 1 ? t("clan_count_1") : t("clan_count_vise")}
      </div>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_90px_80px_1fr_100px] gap-4 px-5 py-2.5 bg-kolo-bg border-b border-kolo-border text-xs font-semibold text-kolo-muted">
          <span>Pseudonim</span>
          <span>Lokacija</span>
          <span className="text-right">Balans</span>
          <span className="text-right">Preporuke</span>
          <span>Zadruga</span>
          <span className="text-right">Registracija</span>
        </div>
        {filtrirani.length === 0 ? (
          <div className="p-6 text-center text-sm text-kolo-muted">
            {t("nema_rezultata")}
          </div>
        ) : (
          filtrirani.map((c, i) => (
            <div
              key={c.id}
              className={i < filtrirani.length - 1 ? "border-b border-kolo-border/30" : ""}
            >
              {/* Desktop red */}
              <div className="hidden sm:grid grid-cols-[1fr_1fr_90px_80px_1fr_100px] gap-4 px-5 py-3 items-center text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Link
                    href={`/profil/${c.id}`}
                    className="font-medium text-kolo-green-700 hover:underline truncate"
                  >
                    {c.pseudonim}
                  </Link>
                  {c.verified ? (
                    <span className="shrink-0 text-xs bg-kolo-green-100 text-kolo-green-700 px-1.5 py-0.5 rounded font-medium">✓</span>
                  ) : (
                    <span className="shrink-0 text-xs bg-kolo-bg text-kolo-muted px-1.5 py-0.5 rounded font-medium">?</span>
                  )}
                </div>
                <span className="text-sm text-kolo-muted truncate">{c.location ?? "—"}</span>
                <span className="text-right font-mono text-sm font-semibold text-kolo-text">
                  {c.balance.toLocaleString("sr-RS")}
                </span>
                <span className="text-right text-sm text-kolo-muted">{c.preporuke}</span>
                <span className="text-sm text-kolo-muted truncate">{c.zadruga ?? "—"}</span>
                <span className="text-right text-sm text-kolo-muted">
                  {new Date(c.createdAt).toLocaleDateString("sr-RS", {
                    day: "2-digit", month: "2-digit", year: "2-digit",
                  })}
                </span>
              </div>
              {/* Mobilna kartica */}
              <div className="sm:hidden px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href={`/profil/${c.id}`} className="font-semibold text-kolo-green-700 hover:underline">
                      {c.pseudonim}
                    </Link>
                    {c.verified ? (
                      <span className="text-xs bg-kolo-green-100 text-kolo-green-700 px-1.5 py-0.5 rounded font-medium">✓</span>
                    ) : (
                      <span className="text-xs bg-kolo-bg text-kolo-muted px-1.5 py-0.5 rounded font-medium">?</span>
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
                      day: "2-digit", month: "2-digit", year: "2-digit",
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
  const t = useTranslations("sistem");
  const [filter, setFilter] = useState<TxFilter>("sve");

  const filtrirane = transakcije.filter((tx) => {
    if (filter === "banka") return tx.fromId === null || tx.toId === null;
    if (filter === "clanovi") return tx.type === "TRANSFER";
    return true;
  });

  const filteri: [TxFilter, string][] = [
    ["sve", t("filter_sve")],
    ["banka", t("filter_banka")],
    ["clanovi", t("filter_clanovi")],
  ];

  return (
    <div className="space-y-4">
      {/* Filter dugmad */}
      <div className="flex gap-2">
        {filteri.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
              filter === key
                ? "bg-kolo-green-700 text-white border-kolo-green-700"
                : "bg-white text-kolo-muted border-kolo-border hover:border-kolo-green-500 hover:text-kolo-text"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-kolo-muted self-center">
          {t("transakcija_count", { count: filtrirane.length })}
        </span>
      </div>

      {filtrirane.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          {t("nema_tx")}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          {/* Zaglavlje */}
          <div className="grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 px-4 py-2 border-b border-kolo-border bg-kolo-bg">
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("vreme")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("posalje")}</span>
            <span />
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("primalac")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide text-right">{t("iznos")}</span>
          </div>
          {filtrirane.map((tx, i) => (
            <div
              key={tx.id}
              className={`grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 items-center px-4 py-2.5 ${
                i < filtrirane.length - 1 ? "border-b border-kolo-border/30" : ""
              }`}
            >
              {/* Vreme */}
              <p className="text-sm text-kolo-muted leading-tight">
                {new Date(tx.createdAt).toLocaleString("sr-RS", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
              {/* Pošiljalac */}
              <div className="min-w-0">
                {verified ? (
                  tx.fromId ? (
                    <Link href={`/profil/${tx.fromId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
                      {tx.fromPseudonim}
                    </Link>
                  ) : (
                    <span className="text-base text-kolo-muted truncate block">{tx.fromPseudonim}</span>
                  )
                ) : (
                  <span className="text-base text-kolo-muted">—</span>
                )}
              </div>
              {/* Strelica */}
              <span className="text-base font-bold text-kolo-muted text-center leading-none">→</span>
              {/* Primalac */}
              <div className="min-w-0">
                {verified ? (
                  tx.toId ? (
                    <Link href={`/profil/${tx.toId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
                      {tx.toPseudonim}
                    </Link>
                  ) : (
                    <span className="text-base text-kolo-muted truncate block">{tx.toPseudonim}</span>
                  )
                ) : (
                  <span className="text-base text-kolo-muted">—</span>
                )}
              </div>
              {/* Iznos */}
              <span className="text-base font-bold text-kolo-text text-right">
                {tx.amount.toLocaleString("sr-RS")}
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
  const t = useTranslations("sistem");
  const tc = useTranslations("common");
  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">
        {t("programi_opis")}
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
                <span className="text-sm font-semibold text-kolo-text">{p.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    p.isActive ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"
                  }`}
                >
                  {p.isActive ? tc("aktivan") : tc("neaktivan")}
                </span>
              </div>
              <p className="text-xs text-kolo-muted">{p.opis}</p>
              {p.isActive && p.activatedAt && (
                <p className="text-xs text-kolo-border mt-1">
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

function ZadrugeSekcija({
  zadruge,
  verified,
}: {
  zadruge: Zadruga[];
  verified: boolean;
}) {
  const t = useTranslations("sistem");

  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">
          {t("zadruge_pregled_blokiran")}
        </p>
        <Link
          href="/verifikacija"
          className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors"
        >
          {t("verifikuj_dugme_link")}
        </Link>
      </div>
    );
  }

  if (zadruge.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
        {t("nema_zadruga")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">
        {t("zadruge_count", { count: zadruge.length })}
      </p>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {zadruge.map((z, i) => (
          <div
            key={z.id}
            className={`px-5 py-3.5 flex justify-between items-center ${
              i < zadruge.length - 1 ? "border-b border-kolo-border" : ""
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-kolo-text">{z.name}</p>
              <p className="text-xs text-kolo-muted mt-0.5">
                {z.location ?? "—"} · {t("osnov")}{" "}
                {new Date(z.createdAt).toLocaleDateString("sr-RS", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-sm font-bold text-kolo-text">{z.clanovi}</p>
              <p className="text-xs text-kolo-muted">{t("zadrugara")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
