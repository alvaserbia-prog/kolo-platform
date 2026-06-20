"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PageOpis from "@/components/PageOpis";
import Pojam from "@/components/Pojam";
import Pseudonim from "@/components/Pseudonim";

type Sekcija = "pregled" | "clanovi" | "transakcije" | "donacije" | "iznos" | "faza" | "fondacija";

interface FondTx {
  id: string;
  datum: string;
  smer: "PRILIV" | "ODLIV";
  kategorija: string;
  opis: string;
  userId: string | null;
  iznosRSD: number;
}
type TxFilter = "sve" | "protokol" | "clanovi";

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
  ukupnoTransakcija: number;
  danasEmitovano: number;
  danasLimit: number;
  danasKorisnika: number;
  danasTransakcija: number;
  ukupnoVerifikacija: number;
  danasVerifikacija: number;
  racunFondacije: number;
  ukupnoDonacija: number;
  danasDonacija: number;
  ukupanIznosTx: number;
  danasIznosTx: number;
  donacije: DonacijaItem[];
  pokrovitelji: PokroviteljItem[];
  emisijeChart: EmisijaChart[];
  transakcije: Transakcija[];
  clanovi: Clan[];
}

const CILJ_OPTICAJ = 1_000_000;

export default function SistemKlijent({
  pseudonim,
  verified,
  opticaj,
  protokolBalance,
  ukupnoKorisnika,
  verifikovanih,
  ukupnoTransakcija,
  danasEmitovano,
  danasLimit,
  danasKorisnika,
  danasTransakcija,
  ukupnoVerifikacija,
  danasVerifikacija,
  racunFondacije,
  ukupnoDonacija,
  danasDonacija,
  ukupanIznosTx,
  danasIznosTx,
  donacije,
  pokrovitelji,
  emisijeChart,
  transakcije,
  clanovi,
}: Props) {
  const [sekcija, setSekcija] = useState<Sekcija>("pregled");
  const t = useTranslations("sistem");

  const zeroSum = opticaj + protokolBalance === 0;
  const faza2 = opticaj >= CILJ_OPTICAJ;
  const fazaPct = Math.min((opticaj / CILJ_OPTICAJ) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Pozdrav */}
      <h1
        className="kolo-naslov"
        style={{ letterSpacing: "-0.02em" }}
      >
        {t.rich("dobrodoslice", { pseudonim, ime: (c) => <Pseudonim>{c}</Pseudonim> })}
      </h1>
      <PageOpis>
        {t("opis_stranice")}
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
            href="/tabla-jemstva"
            className="shrink-0 px-4 py-2 bg-kolo-gold-600 text-white text-sm font-semibold rounded-xl hover:bg-kolo-gold-400 transition-colors"
          >
            {t("verifikuj_dugme")}
          </Link>
        </div>
      )}

      {/* Kartice pokazatelja */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* — Kolona 1 — */}
        {/* Članovi */}
        <Kartica
          aktivan={sekcija === "clanovi"}
          onClick={() => setSekcija("clanovi")}
          label={t("kartica_clanovi")}
          broj={ukupnoKorisnika}
          danas={danasKorisnika}
          podnaslov={t("kartica_verif_opis", { verif: verifikovanih, neverif: ukupnoKorisnika - verifikovanih })}
        />

        {/* — Kolona 2 — */}
        {/* Transakcije */}
        <Kartica
          aktivan={sekcija === "transakcije"}
          onClick={() => setSekcija("transakcije")}
          label={t("kartica_transakcije")}
          broj={ukupnoTransakcija}
          danas={danasTransakcija}
          podnaslov={t("kartica_tx_opis", { count: ukupnoTransakcija })}
        />

        {/* — Kolona 3 — */}
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
              objasnjenje={t("kartica_opticaj_opis")}
            />
          </p>
          <p className={`text-2xl md:text-4xl font-bold tabular-nums leading-tight ${sekcija === "pregled" ? "text-white" : "text-kolo-text"}`}>
            {opticaj.toLocaleString("sr-RS")}
          </p>
          {danasEmitovano > 0 && (
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${sekcija === "pregled" ? "bg-white/20 text-white/80" : "bg-kolo-green-100 text-kolo-green-700"}`}>
              +{danasEmitovano.toLocaleString("sr-RS")} {t("danas")}
            </span>
          )}
          <div className={`flex items-center gap-1.5 mt-1 text-xs ${sekcija === "pregled" ? "text-white/60" : "text-kolo-muted"}`}>
            {zeroSum ? (
              <>
                <span className={sekcija === "pregled" ? "text-white/80" : "text-kolo-green-600"}>✓</span>
                <Pojam
                  termin={<span>{t("zero_sum_ok")}</span>}
                  objasnjenje={t("zero_sum_ok_opis")}
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

        {/* — Kolona 4 — */}
        {/* Donacije */}
        <Kartica
          aktivan={sekcija === "donacije"}
          onClick={() => setSekcija("donacije")}
          label={t("kartica_donacije")}
          broj={ukupnoDonacija}
          danas={danasDonacija}
          podnaslov={t("kartica_donacije_opis")}
        />

        {/* — Drugi red — */}
        {/* Verifikacija (mreža poverenja) — ispod Članova */}
        <div className="rounded-2xl p-4 md:p-5 text-left border bg-white border-kolo-border">
          <p className="text-base font-semibold mb-1 text-kolo-muted">
            <Pojam
              termin={t("mreza_poverenja")}
              objasnjenje={t("mreza_poverenja_opis")}
            />
          </p>
          <p className="text-2xl md:text-4xl font-bold tabular-nums leading-tight text-kolo-text">
            {ukupnoVerifikacija.toLocaleString("sr-RS")}
          </p>
          {danasVerifikacija > 0 && (
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 bg-kolo-green-100 text-kolo-green-700">
              +{danasVerifikacija.toLocaleString("sr-RS")} {t("danas")}
            </span>
          )}
          <p className="text-xs mt-1 text-kolo-muted">{t("veza_u_lancu")}</p>
        </div>

        {/* Ukupan promet — ispod Transakcija */}
        <Kartica
          aktivan={sekcija === "iznos"}
          onClick={() => setSekcija("iznos")}
          label={t("kartica_promet")}
          broj={ukupanIznosTx}
          danas={danasIznosTx}
          podnaslov={t("kartica_promet_opis")}
        />

        {/* Faza sistema — ispod Opticaja (sopstveni tab) */}
        <button
          onClick={() => setSekcija("faza")}
          className={`rounded-2xl p-4 md:p-5 text-left transition-all border ${
            sekcija === "faza"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-base font-semibold mb-1 ${sekcija === "faza" ? "text-white/70" : "text-kolo-muted"}`}>
            <Pojam
              termin={t("faza_sistema")}
              objasnjenje={t("faza_sistema_opis")}
            />
          </p>
          <p className={`text-2xl md:text-4xl font-bold leading-tight ${sekcija === "faza" ? "text-white" : "text-kolo-text"}`}>
            {faza2 ? t("faza_2") : t("faza_1")}
          </p>
          <div className={`w-full h-1.5 rounded-full mt-2 ${sekcija === "faza" ? "bg-white/20" : "bg-kolo-bg"}`}>
            <div
              className={`h-1.5 rounded-full transition-all ${sekcija === "faza" ? "bg-white/70" : "bg-kolo-green-500"}`}
              style={{ width: `${fazaPct}%` }}
            />
          </div>
          <p className={`text-xs mt-1 ${sekcija === "faza" ? "text-white/60" : "text-kolo-muted"}`}>
            {faza2 ? t("gornje_kolo_aktivno") : t("do_gornjeg_kola", { pct: fazaPct.toFixed(1) })}
          </p>
        </button>

        {/* Račun Fondacije — desno dole (klik → spisak transakcija) */}
        <button
          onClick={() => setSekcija("fondacija")}
          className={`rounded-2xl p-4 md:p-5 text-left transition-all border ${
            sekcija === "fondacija"
              ? "bg-kolo-green-700 border-kolo-green-700 text-white shadow-md"
              : "bg-white border-kolo-border hover:border-kolo-green-500 hover:shadow-sm"
          }`}
        >
          <p className={`text-base font-semibold mb-1 ${sekcija === "fondacija" ? "text-white/70" : "text-kolo-muted"}`}>
            <Pojam
              termin={t("kartica_racun_fondacije")}
              objasnjenje={t("kartica_racun_fondacije_opis")}
            />
          </p>
          <p className={`text-2xl md:text-4xl font-bold tabular-nums leading-tight ${sekcija === "fondacija" ? "text-white" : "text-kolo-text"}`}>
            {racunFondacije.toLocaleString("sr-RS")}
          </p>
          <p className={`text-xs mt-1 ${sekcija === "fondacija" ? "text-white/60" : "text-kolo-muted"}`}>{t("kartica_racun_fondacije_podnaslov")}</p>
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
          transakcije={transakcije}
        />
      )}
      {sekcija === "clanovi" && (
        <ClanoviSekcija clanovi={clanovi} verified={verified} />
      )}
      {sekcija === "transakcije" && (
        <TransakcijeSekcija transakcije={transakcije} verified={verified} />
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
      {sekcija === "faza" && <FazaSekcija />}
      {sekcija === "fondacija" && <FondacijaSekcija />}
    </div>
  );
}

// ── Račun Fondacije — transakcije sa bankovnog računa (priliv/odliv, RSD) ──────
function FondacijaSekcija() {
  const t = useTranslations("sistem");
  const [stavke, setStavke] = useState<FondTx[] | null>(null);

  useEffect(() => {
    let aktivno = true;
    fetch("/api/javno/fondacija/transakcije")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (aktivno) setStavke(d?.stavke ?? []); })
      .catch(() => { if (aktivno) setStavke([]); });
    return () => { aktivno = false; };
  }, []);

  if (stavke === null) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
        {t("fondacija_ucitavanje")}
      </div>
    );
  }
  if (stavke.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
        {t("fondacija_nema_tx")}
      </div>
    );
  }

  const datum = (iso: string) =>
    new Date(iso).toLocaleDateString("sr-RS", { day: "2-digit", month: "2-digit", year: "2-digit" });

  return (
    <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
      <div className="hidden sm:grid grid-cols-[1fr_140px_110px] gap-4 px-5 py-2.5 bg-kolo-bg border-b border-kolo-border text-xs font-semibold text-kolo-muted">
        <span>{t("fondacija_col_opis")}</span>
        <span className="text-right">{t("fondacija_col_iznos")}</span>
        <span className="text-right">{t("col_datum")}</span>
      </div>
      {stavke.map((s, i) => (
        <div key={s.id} className={i < stavke.length - 1 ? "border-b border-kolo-border/30" : ""}>
          {/* Desktop */}
          <div className="hidden sm:grid grid-cols-[1fr_140px_110px] gap-4 px-5 py-3 items-center text-sm">
            <div className="min-w-0">
              {s.userId ? (
                <Link href={`/profil/${s.userId}`} className="font-medium text-kolo-green-700 hover:underline truncate block">
                  <Pseudonim>{s.opis}</Pseudonim>
                </Link>
              ) : (
                <p className="text-kolo-text truncate">{s.opis}</p>
              )}
              <p className="text-xs text-kolo-muted">{s.kategorija}</p>
            </div>
            <span className={`text-right font-semibold ${s.smer === "PRILIV" ? "text-kolo-green-700" : "text-kolo-danger"}`}>
              {s.smer === "PRILIV" ? "+" : "−"}{s.iznosRSD.toLocaleString("sr-RS")}
            </span>
            <span className="text-right text-kolo-muted">{datum(s.datum)}</span>
          </div>
          {/* Mobilna */}
          <div className="sm:hidden px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              {s.userId ? (
                <Link href={`/profil/${s.userId}`} className="text-sm font-medium text-kolo-green-700 hover:underline truncate block">
                  <Pseudonim>{s.opis}</Pseudonim>
                </Link>
              ) : (
                <p className="text-sm text-kolo-text truncate">{s.opis}</p>
              )}
              <p className="text-xs text-kolo-muted">{s.kategorija} · {datum(s.datum)}</p>
            </div>
            <span className={`shrink-0 text-sm font-bold ${s.smer === "PRILIV" ? "text-kolo-green-700" : "text-kolo-danger"}`}>
              {s.smer === "PRILIV" ? "+" : "−"}{s.iznosRSD.toLocaleString("sr-RS")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Faza (preslikano sa /o-nama) ──────────────────────────────────────────────

function FazaSekcija() {
  const t = useTranslations("oNama");

  const faze = [
    { r1: t("faza1"), r2: t("faza1b"), opis: t("faza1_opis"), aktivan: false },
    { r1: t("faza2"), r2: t("faza2b"), opis: t("faza2_opis"), aktivan: true },
    { r1: t("faza3"), r2: t("faza3b"), opis: t("faza3_opis"), aktivan: false },
    { r1: t("faza4"), r2: t("faza4b"), opis: t("faza4_opis"), aktivan: false },
    { r1: t("faza5"), r2: t("faza5b"), opis: t("faza5_opis"), aktivan: false },
    { r1: t("faza6"), r2: t("faza6b"), opis: t("faza6_opis"), aktivan: false },
    { r1: t("faza7"), r2: t("faza7b"), opis: t("faza7_opis"), aktivan: false },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-kolo-border p-5 md:p-6">
        <span className="text-xs text-kolo-muted font-medium tracking-wide">{t("status_datum")}</span>
        <h2 className="text-xl md:text-2xl font-bold text-kolo-green-900 mt-1 mb-3" style={{ letterSpacing: "-0.02em" }}>
          {t("status_naslov")}
        </h2>
        <p className="text-kolo-muted leading-relaxed text-body" style={{ lineHeight: "1.7" }}>
          {t("status_opis")}
        </p>

        {/* Timeline */}
        <div className="relative mt-8">
          {/* Mobilni — vertikalni redosled */}
          <div className="md:hidden relative">
            <div
              className="absolute w-0.5 bg-kolo-border"
              style={{ top: "0.5rem", bottom: "0.5rem", left: "6px" }}
            />
            <div className="flex flex-col gap-3">
              {faze.map((faza) => (
                <div key={faza.r1 + faza.r2} className="relative flex items-start gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 relative z-10 shrink-0 mt-1 ${faza.aktivan ? "bg-kolo-green-700 border-kolo-green-700" : "bg-white border-kolo-border"}`} />
                  <div className="min-w-0">
                    <p className={`text-sm leading-tight ${faza.aktivan ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                      {faza.r1} {faza.r2}
                      {faza.aktivan && (
                        <span className="ml-2 text-[11px] font-bold text-kolo-green-700">{t("faza_tu_smo_mobilni")}</span>
                      )}
                    </p>
                    <p className="text-xs text-kolo-muted leading-relaxed mt-0.5">{faza.opis}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop — horizontalni redosled */}
          <div className="hidden md:block relative pt-5">
            <div
              className="absolute h-0.5 bg-kolo-border"
              style={{ top: "calc(1.25rem + 6px)", left: "7.14%", right: "7.14%" }}
            />
            <div className="relative grid grid-cols-7">
              {faze.map((faza) => (
                <div key={faza.r1 + faza.r2} className="group relative flex flex-col items-center gap-1.5 px-1 cursor-help">
                  {faza.aktivan && (
                    <span className="absolute -top-5 text-[10px] font-bold text-kolo-green-700 whitespace-nowrap">
                      {t("faza_tu_smo_desktop")}
                    </span>
                  )}
                  <div className={`w-3.5 h-3.5 rounded-full border-2 relative z-10 ${faza.aktivan ? "bg-kolo-green-700 border-kolo-green-700" : "bg-white border-kolo-border"}`} />
                  <p className={`text-[11px] leading-tight text-center ${faza.aktivan ? "text-kolo-green-700 font-semibold" : "text-kolo-muted"}`}>
                    {faza.r1}<br />{faza.r2}
                  </p>
                  <span className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 z-50 rounded-xl bg-kolo-text text-white text-xs leading-relaxed font-normal text-left p-3 shadow-xl">
                    {faza.opis}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
          <p className="text-sm font-semibold text-kolo-text">
            <Pojam
              termin={t("rast_opticaja")}
              objasnjenje={t("rast_opticaja_objasnjenje")}
            />
          </p>
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
          <p className="text-sm font-semibold text-kolo-text">{t("protokol_tx_naslov")}</p>
          <p className="text-xs text-kolo-muted">{protokolTx.length} {t("ukupno")}</p>
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
                        <Pseudonim>{tx.fromPseudonim}</Pseudonim>
                      </Link>
                    ) : (
                      <span className="text-base text-kolo-muted truncate block"><Pseudonim>{tx.fromPseudonim}</Pseudonim></span>
                    )}
                  </div>
                  <span className="text-base font-bold text-kolo-muted text-center leading-none">→</span>
                  <div className="min-w-0">
                    {verified && tx.toId ? (
                      <Link href={`/profil/${tx.toId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
                        <Pseudonim>{tx.toPseudonim}</Pseudonim>
                      </Link>
                    ) : (
                      <span className="text-base text-kolo-muted truncate block"><Pseudonim>{tx.toPseudonim}</Pseudonim></span>
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
                        <Link href={`/profil/${tx.fromId}`} className="text-kolo-green-700 hover:underline truncate"><Pseudonim>{tx.fromPseudonim}</Pseudonim></Link>
                      ) : (
                        <span className="text-kolo-muted truncate"><Pseudonim>{tx.fromPseudonim}</Pseudonim></span>
                      )}
                      <span className="text-kolo-muted shrink-0">→</span>
                      {verified && tx.toId ? (
                        <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate"><Pseudonim>{tx.toPseudonim}</Pseudonim></Link>
                      ) : (
                        <span className="text-kolo-muted truncate"><Pseudonim>{tx.toPseudonim}</Pseudonim></span>
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
          href="/tabla-jemstva"
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
        <div className="hidden sm:grid grid-cols-[1fr_1fr_90px_72px_100px] gap-4 px-5 py-2.5 bg-kolo-bg border-b border-kolo-border text-xs font-semibold text-kolo-muted">
          <span>{t("col_pseudonim")}</span>
          <span>{t("col_lokacija")}</span>
          <span className="text-right">{t("col_balans")}</span>
          <span className="text-right">{t("col_rang")}</span>
          <span className="text-right">{t("col_registracija")}</span>
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
              <div className="hidden sm:grid grid-cols-[1fr_1fr_90px_72px_100px] gap-4 px-5 py-3 items-center text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <Link
                    href={`/profil/${c.id}`}
                    className="font-medium text-kolo-green-700 hover:underline truncate"
                  >
                    <Pseudonim>{c.pseudonim}</Pseudonim>
                  </Link>
                  {c.verified ? (
                    <span className="shrink-0 text-xs bg-kolo-green-100 text-kolo-green-700 px-1.5 py-0.5 rounded font-medium">✓</span>
                  ) : (
                    <span className="shrink-0 text-xs bg-kolo-bg text-kolo-muted px-1.5 py-0.5 rounded font-medium">?</span>
                  )}
                </div>
                <span className="text-sm text-kolo-muted truncate">{c.location ?? "—"}</span>
                <span className="text-right text-sm font-semibold text-kolo-text">
                  {c.balance.toLocaleString("sr-RS")}
                </span>
                <div className="flex items-center justify-end gap-1 text-sm text-kolo-muted">
                  <RangTooltip
                    rang={c.rangDonacije}
                    label={`${t("rang_tooltip", { rang: c.rangDonacije, rsd: c.donacijeRSD.toLocaleString("sr-RS") })}`}
                  />
                </div>
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
                      <Pseudonim>{c.pseudonim}</Pseudonim>
                    </Link>
                    {c.verified ? (
                      <span className="text-xs bg-kolo-green-100 text-kolo-green-700 px-1.5 py-0.5 rounded font-medium">✓</span>
                    ) : (
                      <span className="text-xs bg-kolo-bg text-kolo-muted px-1.5 py-0.5 rounded font-medium">?</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-kolo-text">
                    {c.balance.toLocaleString("sr-RS")} POEN
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-kolo-muted">
                  <span>{t("rang_label")} {c.rangDonacije}</span>
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
                        <Pseudonim>{tx.fromPseudonim}</Pseudonim>
                      </Link>
                    ) : (
                      <span className="text-base text-kolo-muted truncate block"><Pseudonim>{tx.fromPseudonim}</Pseudonim></span>
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
                        <Pseudonim>{tx.toPseudonim}</Pseudonim>
                      </Link>
                    ) : (
                      <span className="text-base text-kolo-muted truncate block"><Pseudonim>{tx.toPseudonim}</Pseudonim></span>
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
                        <Link href={`/profil/${tx.fromId}`} className="text-kolo-green-700 hover:underline truncate"><Pseudonim>{tx.fromPseudonim}</Pseudonim></Link>
                      ) : (
                        <span className="text-kolo-muted truncate"><Pseudonim>{tx.fromPseudonim}</Pseudonim></span>
                      )
                    ) : (
                      <span className="text-kolo-muted">—</span>
                    )}
                    <span className="text-kolo-muted shrink-0">→</span>
                    {verified ? (
                      tx.toId ? (
                        <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate"><Pseudonim>{tx.toPseudonim}</Pseudonim></Link>
                      ) : (
                        <span className="text-kolo-muted truncate"><Pseudonim>{tx.toPseudonim}</Pseudonim></span>
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
  const t = useTranslations("sistem");

  if (!verified) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center">
        <p className="text-sm text-kolo-muted mb-3">
          {t("donacije_pregled_blokiran")}
        </p>
        <Link
          href="/tabla-jemstva"
          className="inline-block px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors"
        >
          {t("verifikuj_dugme_link")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {donacije.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          {t("nema_donacija")}
        </div>
      ) : (<>
      <p className="text-xs text-kolo-muted">{t("prikazanih_donacija", { count: donacije.length })}</p>
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_100px_110px_72px_110px] gap-4 px-5 py-2.5 bg-kolo-bg border-b border-kolo-border text-xs font-semibold text-kolo-muted">
          <span>{t("col_donator")}</span>
          <span className="text-right">RSD</span>
          <span className="text-right">POEN</span>
          <span className="text-right">{t("col_nivo")}</span>
          <span className="text-right">{t("col_datum")}</span>
        </div>
        {donacije.map((d, i) => (
          <div key={d.id} className={i < donacije.length - 1 ? "border-b border-kolo-border/30" : ""}>
            {/* Desktop */}
            <div className="hidden sm:grid grid-cols-[1fr_100px_110px_72px_110px] gap-4 px-5 py-3 items-center text-sm">
              <Link
                href={`/profil/${d.userId}`}
                className="font-medium text-kolo-green-700 hover:underline truncate"
              >
                <Pseudonim>{d.pseudonim}</Pseudonim>
              </Link>
              <span className="text-right">
                {d.amountRSD.toLocaleString("sr-RS")}
              </span>
              <span className="text-right font-semibold text-kolo-text">
                {d.poenEmitted.toLocaleString("sr-RS")}
              </span>
              <span className="text-right text-kolo-muted">{t("nivo_label")} {d.level}</span>
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
                  <Pseudonim>{d.pseudonim}</Pseudonim>
                </Link>
                <span className="text-sm font-bold text-kolo-text">
                  {d.poenEmitted.toLocaleString("sr-RS")} POEN
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-kolo-muted">
                <span>{d.amountRSD.toLocaleString("sr-RS")} RSD</span>
                <span>{t("nivo_label")} {d.level}</span>
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
        <h2 className="text-sm font-semibold text-kolo-text mb-3">{t("ranglista_pokrovitelja")}</h2>
        {pokrovitelji.length === 0 ? (
          <div className="bg-white rounded-2xl border border-kolo-border p-6 text-center text-sm text-kolo-muted">
            {t("nema_pokrovitelja")}
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
                  <p className="text-sm font-semibold text-kolo-green-700">{t("nivo_label")} {p.trenutniNivo}</p>
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
            {t("postani_pokrovitelj_link")}
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
  const t = useTranslations("sistem");
  const transferi = transakcije.filter((tx) => tx.type === "TRANSFER");
  const ukupnoTransferi = transferi.reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-kolo-border p-5">
          <p className="text-xs text-kolo-muted mb-1">{t("ukupno_prometa")}</p>
          <p className="text-2xl font-bold text-kolo-text">
            {ukupanIznosTx.toLocaleString("sr-RS")}
          </p>
          <p className="text-xs text-kolo-muted mt-1">{t("poen_izmedju_clanova")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-5">
          <p className="text-xs text-kolo-muted mb-1">{t("danas")}</p>
          <p className="text-2xl font-bold text-kolo-text">
            {danasIznosTx.toLocaleString("sr-RS")}
          </p>
          <p className="text-xs text-kolo-muted mt-1">{t("poen_izmedju_clanova")}</p>
        </div>
      </div>
      {transferi.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-2.5 bg-kolo-bg border-b border-kolo-border flex justify-between items-center">
            <p className="text-xs font-semibold text-kolo-muted">
              {t("poslednjih_transfera", { count: transferi.length })}
            </p>
            <p className="text-xs text-kolo-muted">
              {t("ukupno_poen", { iznos: ukupnoTransferi.toLocaleString("sr-RS") })}
            </p>
          </div>
          <div className="hidden sm:grid grid-cols-[7rem_1fr_1rem_1fr_6rem] gap-x-3 px-5 py-2 border-b border-kolo-border bg-kolo-bg/50 text-xs font-semibold text-kolo-muted">
            <span>{t("vreme")}</span>
            <span>{t("posalje")}</span>
            <span />
            <span>{t("primalac")}</span>
            <span className="text-right">{t("iznos")}</span>
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
                    <Pseudonim>{tx.fromPseudonim}</Pseudonim>
                  </Link>
                ) : (
                  <span className="text-kolo-muted truncate"><Pseudonim>{tx.fromPseudonim}</Pseudonim></span>
                )}
                <span className="text-kolo-muted text-center">→</span>
                {tx.toId ? (
                  <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate">
                    <Pseudonim>{tx.toPseudonim}</Pseudonim>
                  </Link>
                ) : (
                  <span className="text-kolo-muted truncate"><Pseudonim>{tx.toPseudonim}</Pseudonim></span>
                )}
                <span className="font-semibold text-kolo-text text-right">
                  {tx.amount.toLocaleString("sr-RS")}
                </span>
              </div>
              {/* Mobilna kartica */}
              <div className="sm:hidden space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 flex items-center gap-1.5 text-sm">
                    {tx.fromId ? (
                      <Link href={`/profil/${tx.fromId}`} className="text-kolo-green-700 hover:underline truncate"><Pseudonim>{tx.fromPseudonim}</Pseudonim></Link>
                    ) : (
                      <span className="text-kolo-muted truncate"><Pseudonim>{tx.fromPseudonim}</Pseudonim></span>
                    )}
                    <span className="text-kolo-muted shrink-0">→</span>
                    {tx.toId ? (
                      <Link href={`/profil/${tx.toId}`} className="text-kolo-green-700 hover:underline truncate"><Pseudonim>{tx.toPseudonim}</Pseudonim></Link>
                    ) : (
                      <span className="text-kolo-muted truncate"><Pseudonim>{tx.toPseudonim}</Pseudonim></span>
                    )}
                  </div>
                  <span className="font-bold text-kolo-text shrink-0 text-sm">{tx.amount.toLocaleString("sr-RS")}</span>
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

