"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PageOpis from "@/components/PageOpis";
import Pojam from "@/components/Pojam";

type Sekcija = "pregled" | "clanovi" | "transakcije" | "programi" | "krugovi" | "donacije" | "iznos";
type TxFilter = "sve" | "protokol" | "clanovi";

const TIP_BOJA: Record<string, string> = {
  TRANSFER: "bg-kolo-bg text-kolo-muted",
  EMISIJA_VERIFIKACIJA: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_DONACIJA: "bg-kolo-gold-100 text-kolo-gold-600",
  EMISIJA_POKROVITELJ: "bg-yellow-50 text-yellow-700",
  EMISIJA_KRUG_OSNIVANJE: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_KRUG_BONUS: "bg-kolo-green-100 text-kolo-green-700",
  EMISIJA_PROGRAM: "bg-kolo-green-100 text-kolo-green-700",
};

interface Transakcija {
  id: string;
  amount: number;
  type: string;
  description: string | null;
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
  krug: string | null;
  donacijeRSD: number;
  rangDonacije: number;
  location: string | null;
  createdAt: string;
}

interface Krug {
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

interface DonacijaItem {
  id: string;
  userId: string;
  pseudonim: string;
  amountRSD: number;
  poenEmitted: number;
  level: number;
  confirmedAt: string;
}

interface PokroviteljItem {
  id: string;
  naziv: string;
  adresa: string | null;
  rsdKumulativ: number;
  trenutniNivo: number;
}

interface Props {
  pseudonim: string;
  verified: boolean;
  opticaj: number;
  protokolBalance: number;
  ukupnoKorisnika: number;
  verifikovanih: number;
  ukupnoKrugCount: number;
  danasEmitovano: number;
  danasLimit: number;
  danasKorisnika: number;
  danasTransakcija: number;
  danasKrug: number;
  ukupnoDonacija: number;
  danasDonacija: number;
  ukupanIznosTx: number;
  danasIznosTx: number;
  donacije: DonacijaItem[];
  pokrovitelji: PokroviteljItem[];
  emisijeChart: EmisijaChart[];
  transakcije: Transakcija[];
  clanovi: Clan[];
  krugovi: Krug[];
  programi: Program[];
}

const CILJ_OPTICAJ = 1_000_000;

export default function SistemKlijent({
  pseudonim,
  verified,
  opticaj,
  protokolBalance,
  ukupnoKorisnika,
  verifikovanih,
  ukupnoKrugCount,
  danasEmitovano,
  danasLimit,
  danasKorisnika,
  danasTransakcija,
  danasKrug,
  ukupnoDonacija,
  danasDonacija,
  ukupanIznosTx,
  danasIznosTx,
  donacije,
  pokrovitelji,
  emisijeChart,
  transakcije,
  clanovi,
  krugovi,
  programi,
}: Props) {
  const [sekcija, setSekcija] = useState<Sekcija>("pregled");
  const t = useTranslations("sistem");

  const aktivniProgrami = programi.filter((p) => p.isActive).length;
  const zeroSum = opticaj + protokolBalance === 0;

  return (
    <div className="space-y-6">
      {/* Pozdrav */}
      <h1
        className="kolo-naslov"
        style={{ letterSpacing: "-0.02em" }}
      >
        {t("dobrodoslice", { pseudonim })}
      </h1>
      <PageOpis>
        Pregled celog KOLO sistema u brojkama — koliko vas ima, koliko se razmenjuje
        i da li je sve u ravnoteži. Ovde pratiš zdravlje zajednice; ništa se odavde ne
        menja, samo se gleda.
      </PageOpis>

      {/* Upozorenje za neverifikovane */}
      {!verified && (
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

      {/* 8 kartica 4×2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Članovi */}
        <Kartica
          aktivan={sekcija === "clanovi"}
          onClick={() => setSekcija("clanovi")}
          label={t("kartica_clanovi")}
          broj={ukupnoKorisnika}
          danas={danasKorisnika}
          podnaslov={t("kartica_verif_opis", { verif: verifikovanih, neverif: ukupnoKorisnika - verifikovanih })}
        />

        {/* Krugovi */}
        <Kartica
          aktivan={sekcija === "krugovi"}
          onClick={() => setSekcija("krugovi")}
          label={t("kartica_krugovi")}
          broj={ukupnoKrugCount}
          danas={danasKrug}
          podnaslov={t("kartica_krugovi_opis")}
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

        {/* Opticaj programa */}
        <button
          onClick={() => setSekcija("programi")}
          className={`rounded-2xl p-4 md:p-5 text-left transition-all border ${
            sekcija === "programi"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-base font-semibold mb-1 ${sekcija === "programi" ? "text-white/70" : "text-kolo-muted"}`}>
            Opticaj programa
          </p>
          <p className={`text-2xl md:text-4xl font-bold tabular-nums leading-tight ${sekcija === "programi" ? "text-white" : "text-kolo-text"}`}>
            {danasEmitovano.toLocaleString("sr-RS")}
          </p>
          {danasLimit > 0 && (
            <>
              <div className={`w-full h-1.5 rounded-full mt-2 ${sekcija === "programi" ? "bg-white/20" : "bg-kolo-bg"}`}>
                <div
                  className={`h-1.5 rounded-full transition-all ${sekcija === "programi" ? "bg-white/70" : "bg-kolo-green-500"}`}
                  style={{ width: `${Math.min(100, Math.round((danasEmitovano / danasLimit) * 100))}%` }}
                />
              </div>
              <p className={`text-xs mt-1 ${sekcija === "programi" ? "text-white/60" : "text-kolo-muted"}`}>
                {Math.round((danasEmitovano / danasLimit) * 100)}% dnevnog limita
              </p>
            </>
          )}
        </button>

        {/* Opticaj */}
        <button
          onClick={() => setSekcija("pregled")}
          className={`rounded-2xl p-4 md:p-5 text-left transition-all border ${
            sekcija === "pregled"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-base font-semibold mb-1 ${sekcija === "pregled" ? "text-white/70" : "text-kolo-muted"}`}>
            <Pojam
              termin={t("kartica_opticaj")}
              objasnjenje="Ukupan broj POEN-a koji trenutno postoji u sistemu. Pokazuje koliko je zajednica aktivna."
            />
          </p>
          <p className={`text-2xl md:text-4xl font-bold tabular-nums leading-tight ${sekcija === "pregled" ? "text-white" : "text-kolo-text"}`}>
            {opticaj.toLocaleString("sr-RS")}
          </p>
          {danasEmitovano > 0 && (
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${sekcija === "pregled" ? "bg-white/20 text-white/80" : "bg-kolo-green-100 text-kolo-green-700"}`}>
              +{danasEmitovano.toLocaleString("sr-RS")} danas
            </span>
          )}
          <div className={`flex items-center gap-1.5 mt-1 text-xs ${sekcija === "pregled" ? "text-white/60" : "text-kolo-muted"}`}>
            {zeroSum ? (
              <>
                <span className={sekcija === "pregled" ? "text-white/80" : "text-kolo-green-600"}>✓</span>
                <Pojam
                  termin={<span>{t("zero_sum_ok")}</span>}
                  objasnjenje="Provera ravnoteže: zbir svih zapisa je tačno nula. Znači da nijedan POEN nije nastao ni iz čega — sve je evidentirano kako treba."
                />
              </>
            ) : (
              <>
                <span className={sekcija === "pregled" ? "text-red-300" : "text-kolo-danger"}>✗</span>
                <span>{t("zero_sum_greska")}</span>
              </>
            )}
          </div>
        </button>

        {/* Donacije */}
        <Kartica
          aktivan={sekcija === "donacije"}
          onClick={() => setSekcija("donacije")}
          label="Donacije"
          broj={ukupnoDonacija}
          danas={danasDonacija}
          podnaslov="potvrđenih donacija"
        />

        {/* Iznos transakcija */}
        <Kartica
          aktivan={sekcija === "iznos"}
          onClick={() => setSekcija("iznos")}
          label="Ukupan promet"
          broj={ukupanIznosTx}
          danas={danasIznosTx}
          podnaslov="POEN između članova"
        />

        {/* Zdravlje sistema */}
        <div className="rounded-2xl p-4 md:p-5 text-left border bg-white border-kolo-border">
          <p className="text-base font-semibold mb-2 text-kolo-muted">Zdravlje sistema</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${zeroSum ? "bg-kolo-green-100 text-kolo-green-700" : "bg-red-100 text-red-600"}`}>
                {zeroSum ? "✓" : "✗"}
              </span>
              <span className={`text-sm ${zeroSum ? "text-kolo-text" : "text-kolo-danger"}`}>
                {zeroSum ? "Zero-sum OK" : "Zero-sum greška"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-kolo-green-100 text-kolo-green-700 flex items-center justify-center text-xs font-bold shrink-0">
                {aktivniProgrami}
              </span>
              <span className="text-sm text-kolo-text">
                {aktivniProgrami === 1 ? "aktivan program" : aktivniProgrami >= 2 && aktivniProgrami <= 4 ? "aktivna programa" : "aktivnih programa"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-kolo-info-light text-kolo-info flex items-center justify-center text-xs font-bold shrink-0">
                {verifikovanih}
              </span>
              <span className="text-sm text-kolo-text">
                verifikovanih članova
              </span>
            </div>
          </div>
        </div>
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
          transakcije={transakcije}
        />
      )}
      {sekcija === "clanovi" && (
        <ClanoviSekcija clanovi={clanovi} verified={verified} />
      )}
      {sekcija === "transakcije" && (
        <TransakcijeSekcija transakcije={transakcije} verified={verified} />
      )}
      {sekcija === "programi" && <ProgramiSekcija programi={programi} />}
      {sekcija === "krugovi" && (
        <KrugoviSekcija krugovi={krugovi} verified={verified} />
      )}
      {sekcija === "donacije" && (
        <DonacijeSekcija donacije={donacije} pokrovitelji={pokrovitelji} verified={verified} />
      )}
      {sekcija === "iznos" && (
        <IznosSekcija
          ukupanIznosTx={ukupanIznosTx}
          danasIznosTx={danasIznosTx}
          transakcije={transakcije}
        />
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
      className={`rounded-2xl p-4 md:p-5 text-left transition-all border ${
        aktivan
          ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
          : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
      }`}
    >
      <p className={`text-base font-semibold mb-1 ${aktivan ? "text-white/70" : "text-kolo-muted"}`}>
        {label}
      </p>
      <p className={`text-2xl md:text-4xl font-bold tabular-nums leading-tight ${aktivan ? "text-white" : "text-kolo-text"}`}>
        {broj.toLocaleString("sr-RS")}
      </p>
      {danas > 0 && (
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${aktivan ? "bg-white/20 text-white/80" : "bg-kolo-green-100 text-kolo-green-700"}`}>
          +{danas.toLocaleString("sr-RS")} danas
        </span>
      )}
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
  transakcije,
}: {
  verified: boolean;
  opticaj: number;
  danasEmitovano: number;
  danasLimit: number;
  emisijeChart: EmisijaChart[];
  transakcije: Transakcija[];
}) {
  const t = useTranslations("sistem");
  const maxEmitted = Math.max(...emisijeChart.map((e) => e.emitted), 1);
  const opticajPct = Math.min((opticaj / CILJ_OPTICAJ) * 100, 100);

  const protokolTx = transakcije.filter(
    (tx) => tx.fromId === null || tx.toId === null
  );

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

      {/* Transakcije Protokola */}
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-5 py-3 border-b border-kolo-border flex justify-between items-center">
          <p className="text-sm font-semibold text-kolo-text">Transakcije Protokola</p>
          <p className="text-xs text-kolo-muted">{protokolTx.length} ukupno</p>
        </div>
        {protokolTx.length === 0 ? (
          <div className="p-6 text-center text-sm text-kolo-muted">{t("nema_tx")}</div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 px-4 py-2 border-b border-kolo-border bg-kolo-bg">
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("vreme")}</span>
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("posalje")}</span>
              <span />
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("primalac")}</span>
              <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide text-right">{t("iznos")}</span>
            </div>
            {protokolTx.map((tx, i) => (
              <div
                key={tx.id}
                className={`px-4 py-2.5 ${i < protokolTx.length - 1 ? "border-b border-kolo-border/30" : ""}`}
              >
                {/* Desktop grid */}
                <div className="hidden sm:grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 items-center">
                  <p className="text-sm text-kolo-muted leading-tight">
                    {new Date(tx.createdAt).toLocaleString("sr-RS", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  <div className="min-w-0">
                    {verified && tx.fromId ? (
                      <Link href={`/profil/${tx.fromId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
                        {tx.fromPseudonim}
                      </Link>
                    ) : (
                      <span className="text-base text-kolo-muted truncate block">{tx.fromPseudonim}</span>
                    )}
                  </div>
                  <span className="text-base font-bold text-kolo-muted text-center leading-none">→</span>
                  <div className="min-w-0">
                    {verified && tx.toId ? (
                      <Link href={`/profil/${tx.toId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
                        {tx.toPseudonim}
                      </Link>
                    ) : (
                      <span className="text-base text-kolo-muted truncate block">{tx.toPseudonim}</span>
                    )}
                  </div>
                  <span className="text-base font-bold text-kolo-text text-right">
                    {tx.amount.toLocaleString("sr-RS")}
                  </span>
                </div>
                {/* Mobilna kartica */}
                <div className="sm:hidden space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1 flex items-center gap-1.5 text-sm">
                      {verified && tx.fromId ? (
                        <Link href={`/profil/${tx.fromId}`} className="text-kolo-green-700 hover:underline truncate">{tx.fromPseudonim}</Link>
                      ) : (
                        <span className="text-kolo-muted truncate">{tx.fromPseudonim}</span>
                      )}
                      <span className="text-kolo-muted shrink-0">→</span>
                      {verified && tx.toId ? (
                        <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate">{tx.toPseudonim}</Link>
                      ) : (
                        <span className="text-kolo-muted truncate">{tx.toPseudonim}</span>
                      )}
                    </div>
                    <span className="font-bold text-kolo-text shrink-0 text-sm">{tx.amount.toLocaleString("sr-RS")}</span>
                  </div>
                  <p className="text-xs text-kolo-muted">
                    {new Date(tx.createdAt).toLocaleString("sr-RS", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {tx.description && (
                  <p className="mt-0.5 text-xs text-kolo-muted/70 truncate sm:pl-[9.75rem]">{tx.description}</p>
                )}
              </div>
            ))}
          </>
        )}
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

// ── RangTooltip ───────────────────────────────────────────────────────────────

function RangTooltip({ rang, label }: { rang: number; label: string }) {
  return (
    <span className="relative group/tt inline-block cursor-default">
      <span className="tabular-nums">{rang}</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-kolo-text text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tt:opacity-100 transition-opacity pointer-events-none z-20">
        {label}
      </span>
    </span>
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
        <div className="hidden sm:grid grid-cols-[1fr_1fr_90px_72px_1fr_100px] gap-4 px-5 py-2.5 bg-kolo-bg border-b border-kolo-border text-xs font-semibold text-kolo-muted">
          <span>Pseudonim</span>
          <span>Lokacija</span>
          <span className="text-right">Balans</span>
          <span className="text-right">Rang</span>
          <span>Krug</span>
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
              <div className="hidden sm:grid grid-cols-[1fr_1fr_90px_72px_1fr_100px] gap-4 px-5 py-3 items-center text-sm">
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
                <div className="flex items-center justify-end gap-1 text-sm text-kolo-muted">
                  <RangTooltip
                    rang={c.rangDonacije}
                    label={`Rang ${c.rangDonacije} · ${c.donacijeRSD.toLocaleString("sr-RS")} RSD`}
                  />
                </div>
                <span className="text-sm text-kolo-muted truncate">{c.krug ?? "—"}</span>
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
                  {c.krug && <span>Krug: {c.krug}</span>}
                  <span>Rang {c.rangDonacije}</span>
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
    if (filter === "protokol") return tx.fromId === null || tx.toId === null;
    if (filter === "clanovi") return tx.type === "TRANSFER";
    return true;
  });

  const filteri: [TxFilter, string][] = [
    ["sve", t("filter_sve")],
    ["protokol", t("filter_protokol")],
    ["clanovi", t("filter_clanovi")],
  ];

  return (
    <div className="space-y-4">
      {/* Filter dugmad */}
      <div className="flex flex-wrap gap-2 items-center">
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
          <div className="hidden sm:grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 px-4 py-2 border-b border-kolo-border bg-kolo-bg">
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("vreme")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("posalje")}</span>
            <span />
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("primalac")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide text-right">{t("iznos")}</span>
          </div>
          {filtrirane.map((tx, i) => (
            <div
              key={tx.id}
              className={`px-4 py-2.5 ${i < filtrirane.length - 1 ? "border-b border-kolo-border/30" : ""}`}
            >
              {/* Desktop grid */}
              <div className="hidden sm:grid grid-cols-[9rem_1fr_1.5rem_1fr_7rem] gap-x-3 items-center">
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
              {/* Mobilna kartica */}
              <div className="sm:hidden space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 flex items-center gap-1.5 text-sm">
                    {verified ? (
                      tx.fromId ? (
                        <Link href={`/profil/${tx.fromId}`} className="text-kolo-green-700 hover:underline truncate">{tx.fromPseudonim}</Link>
                      ) : (
                        <span className="text-kolo-muted truncate">{tx.fromPseudonim}</span>
                      )
                    ) : (
                      <span className="text-kolo-muted">—</span>
                    )}
                    <span className="text-kolo-muted shrink-0">→</span>
                    {verified ? (
                      tx.toId ? (
                        <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate">{tx.toPseudonim}</Link>
                      ) : (
                        <span className="text-kolo-muted truncate">{tx.toPseudonim}</span>
                      )
                    ) : (
                      <span className="text-kolo-muted">—</span>
                    )}
                  </div>
                  <span className="font-bold text-kolo-text shrink-0 text-sm">{tx.amount.toLocaleString("sr-RS")}</span>
                </div>
                <p className="text-xs text-kolo-muted">
                  {new Date(tx.createdAt).toLocaleString("sr-RS", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {/* Opis transakcije */}
              {tx.description && (
                <p className="mt-0.5 text-xs text-kolo-muted/70 truncate sm:pl-[9.75rem]">{tx.description}</p>
              )}
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

// ── Donacije ──────────────────────────────────────────────────────────────────

function DonacijeSekcija({
  donacije,
  pokrovitelji,
  verified,
}: {
  donacije: DonacijaItem[];
  pokrovitelji: PokroviteljItem[];
  verified: boolean;
}) {
  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">
          Pregled donacija dostupan je verifikovanim članovima.
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

  return (
    <div className="space-y-4">
      {donacije.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          Nema potvrđenih donacija.
        </div>
      ) : (<>
      <p className="text-xs text-kolo-muted">{donacije.length} prikazanih donacija</p>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_100px_110px_72px_110px] gap-4 px-5 py-2.5 bg-kolo-bg border-b border-kolo-border text-xs font-semibold text-kolo-muted">
          <span>Donator</span>
          <span className="text-right">RSD</span>
          <span className="text-right">POEN</span>
          <span className="text-right">Nivo</span>
          <span className="text-right">Datum</span>
        </div>
        {donacije.map((d, i) => (
          <div key={d.id} className={i < donacije.length - 1 ? "border-b border-kolo-border/30" : ""}>
            {/* Desktop */}
            <div className="hidden sm:grid grid-cols-[1fr_100px_110px_72px_110px] gap-4 px-5 py-3 items-center text-sm">
              <Link
                href={`/profil/${d.userId}`}
                className="font-medium text-kolo-green-700 hover:underline truncate"
              >
                {d.pseudonim}
              </Link>
              <span className="text-right font-mono">
                {d.amountRSD.toLocaleString("sr-RS")}
              </span>
              <span className="text-right font-mono font-semibold text-kolo-text">
                {d.poenEmitted.toLocaleString("sr-RS")}
              </span>
              <span className="text-right text-kolo-muted">Nivo {d.level}</span>
              <span className="text-right text-kolo-muted">
                {new Date(d.confirmedAt).toLocaleDateString("sr-RS", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </span>
            </div>
            {/* Mobilna kartica */}
            <div className="sm:hidden px-4 py-3 space-y-1">
              <div className="flex items-center justify-between">
                <Link href={`/profil/${d.userId}`} className="font-semibold text-kolo-green-700 hover:underline">
                  {d.pseudonim}
                </Link>
                <span className="font-mono text-sm font-bold text-kolo-text">
                  {d.poenEmitted.toLocaleString("sr-RS")} POEN
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-kolo-muted">
                <span>{d.amountRSD.toLocaleString("sr-RS")} RSD</span>
                <span>Nivo {d.level}</span>
                <span className="ml-auto">
                  {new Date(d.confirmedAt).toLocaleDateString("sr-RS", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      </>)}

      {/* Ranglista pokrovitelja */}
      <div>
        <h2 className="text-sm font-semibold text-kolo-text mb-3">Ranglista pokrovitelja</h2>
        {pokrovitelji.length === 0 ? (
          <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            Još uvek nema registrovanih pokrovitelja.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
            {pokrovitelji.map((p, i) => (
              <div
                key={p.id}
                className={`px-4 py-3 flex items-center gap-3 ${i < pokrovitelji.length - 1 ? "border-b border-kolo-border/30" : ""}`}
              >
                <div className="text-sm font-semibold text-kolo-muted w-6 text-right shrink-0">
                  {i + 1}.
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-kolo-text">{p.naziv}</p>
                  {p.adresa && (
                    <p className="text-xs text-kolo-muted mt-0.5">
                      {p.adresa}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-kolo-green-700">Nivo {p.trenutniNivo}</p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {Number(p.rsdKumulativ).toLocaleString("sr-RS")} RSD
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 text-center">
          <Link
            href="/postani-pokrovitelj"
            className="text-sm font-medium text-kolo-green-700 hover:underline"
          >
            Kako postati pokrovitelj →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Iznos transakcija ─────────────────────────────────────────────────────────

function IznosSekcija({
  ukupanIznosTx,
  danasIznosTx,
  transakcije,
}: {
  ukupanIznosTx: number;
  danasIznosTx: number;
  transakcije: Transakcija[];
}) {
  const transferi = transakcije.filter((tx) => tx.type === "TRANSFER");
  const ukupnoTransferi = transferi.reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-kolo-border p-5">
          <p className="text-xs text-kolo-muted mb-1">Ukupno prometa</p>
          <p className="text-2xl font-bold font-mono text-kolo-text">
            {ukupanIznosTx.toLocaleString("sr-RS")}
          </p>
          <p className="text-xs text-kolo-muted mt-1">POEN između članova</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-5">
          <p className="text-xs text-kolo-muted mb-1">Danas</p>
          <p className="text-2xl font-bold font-mono text-kolo-text">
            {danasIznosTx.toLocaleString("sr-RS")}
          </p>
          <p className="text-xs text-kolo-muted mt-1">POEN između članova</p>
        </div>
      </div>
      {transferi.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-2.5 bg-kolo-bg border-b border-kolo-border flex justify-between items-center">
            <p className="text-xs font-semibold text-kolo-muted">
              Poslednjih {transferi.length} transfera
            </p>
            <p className="text-xs text-kolo-muted">
              ukupno {ukupnoTransferi.toLocaleString("sr-RS")} POEN
            </p>
          </div>
          <div className="hidden sm:grid grid-cols-[7rem_1fr_1rem_1fr_6rem] gap-x-3 px-5 py-2 border-b border-kolo-border bg-kolo-bg/50 text-xs font-semibold text-kolo-muted">
            <span>Vreme</span>
            <span>Pošiljalac</span>
            <span />
            <span>Primalac</span>
            <span className="text-right">Iznos</span>
          </div>
          {transferi.slice(0, 20).map((tx, i) => (
            <div
              key={tx.id}
              className={`px-4 sm:px-5 py-2.5 ${
                i < Math.min(transferi.length, 20) - 1 ? "border-b border-kolo-border/30" : ""
              }`}
            >
              {/* Desktop grid */}
              <div className="hidden sm:grid grid-cols-[7rem_1fr_1rem_1fr_6rem] gap-x-3 items-center text-sm">
                <span className="text-xs text-kolo-muted">
                  {new Date(tx.createdAt).toLocaleString("sr-RS", {
                    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
                {tx.fromId ? (
                  <Link href={`/profil/${tx.fromId}`} className="text-kolo-green-700 hover:underline truncate">
                    {tx.fromPseudonim}
                  </Link>
                ) : (
                  <span className="text-kolo-muted truncate">{tx.fromPseudonim}</span>
                )}
                <span className="text-kolo-muted text-center">→</span>
                {tx.toId ? (
                  <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate">
                    {tx.toPseudonim}
                  </Link>
                ) : (
                  <span className="text-kolo-muted truncate">{tx.toPseudonim}</span>
                )}
                <span className="font-mono font-semibold text-kolo-text text-right">
                  {tx.amount.toLocaleString("sr-RS")}
                </span>
              </div>
              {/* Mobilna kartica */}
              <div className="sm:hidden space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 flex items-center gap-1.5 text-sm">
                    {tx.fromId ? (
                      <Link href={`/profil/${tx.fromId}`} className="text-kolo-green-700 hover:underline truncate">{tx.fromPseudonim}</Link>
                    ) : (
                      <span className="text-kolo-muted truncate">{tx.fromPseudonim}</span>
                    )}
                    <span className="text-kolo-muted shrink-0">→</span>
                    {tx.toId ? (
                      <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate">{tx.toPseudonim}</Link>
                    ) : (
                      <span className="text-kolo-muted truncate">{tx.toPseudonim}</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-kolo-text shrink-0 text-sm">{tx.amount.toLocaleString("sr-RS")}</span>
                </div>
                <p className="text-xs text-kolo-muted">
                  {new Date(tx.createdAt).toLocaleString("sr-RS", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Krugovi ───────────────────────────────────────────────────────────────────

function KrugoviSekcija({
  krugovi,
  verified,
}: {
  krugovi: Krug[];
  verified: boolean;
}) {
  const t = useTranslations("sistem");

  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">
          {t("krugovi_pregled_blokiran")}
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

  if (krugovi.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
        {t("nema_krugova")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-kolo-muted">
        {t("krugovi_count", { count: krugovi.length })}
      </p>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {krugovi.map((z, i) => (
          <div
            key={z.id}
            className={`px-5 py-3.5 flex justify-between items-center ${
              i < krugovi.length - 1 ? "border-b border-kolo-border" : ""
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
              <p className="text-xs text-kolo-muted">{t("clanova")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
