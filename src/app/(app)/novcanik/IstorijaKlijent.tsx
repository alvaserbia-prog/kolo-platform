"use client";

import { useState, useMemo, memo } from "react";
import { intlTag } from "@/lib/format";
import { useTranslations, useLocale } from "next-intl";
import Pseudonim from "@/components/Pseudonim";
import { profilHref } from "@/lib/profil-link";

export type Transakcija = {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  primio: boolean;
  drugiPseudonim: string;
  drugiId: string | null;
  createdAt: string;
  mozePrijaviti?: boolean;
  prijavaStatus?: string | null;
};

/** Prepis i njegovo poništenje idu između dva člana; sve ostalo je Protokol. */
const izmedjuClanova = (tip: string) => tip === "TRANSFER" || tip === "PONISTENJE_PREPISA";

type Filter = "sve" | "primljeno" | "poslato" | "emisije";

export default function IstorijaKlijent({ transakcije, pseudonim }: { transakcije: Transakcija[]; pseudonim: string }) {
  const t = useTranslations("novcanik");
  const [filter, setFilter] = useState<Filter>("sve");

  const filtered = useMemo(() => transakcije.filter((tx) => {
    if (filter === "primljeno") return tx.primio && izmedjuClanova(tx.type);
    if (filter === "poslato") return !tx.primio && izmedjuClanova(tx.type);
    if (filter === "emisije") return !izmedjuClanova(tx.type);
    return true;
  }), [transakcije, filter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold text-kolo-muted">{t("istorija_transakcija")}</h2>
      </div>

      {/* Filteri */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {([
          ["sve", t("filter_sve")],
          ["primljeno", t("filter_primljeno")],
          ["poslato", t("filter_poslato")],
          ["emisije", t("filter_emisije")],
        ] as [Filter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              filter === key
                ? "bg-kolo-green-700 text-white"
                : "bg-white border border-kolo-border text-kolo-muted hover:text-kolo-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        transakcije.length === 0 ? (
          // Sasvim nov korisnik — bez ijedne transakcije: navedi ga šta dalje
          <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center space-y-2">
            <p className="text-sm font-medium text-kolo-text">{t("prazno_naslov")}</p>
            <p className="text-sm text-kolo-muted max-w-md mx-auto">
              {t("prazno_opis")}
            </p>
            <a href="/verifikacija" className="inline-block mt-1 text-sm font-semibold text-kolo-green-700 hover:underline">
              {t("prazno_verif_link")}
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
            {t("nema_tx_kategorija")}
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          {/* Zaglavlje tabele — desktop */}
          <div className="hidden sm:grid grid-cols-[7rem_4.5rem_1fr_1.5rem_1fr_minmax(0,1.5fr)_7rem] gap-x-3 px-4 py-2 border-b border-kolo-border bg-kolo-bg">
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_datum")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_vreme")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_posiljac")}</span>
            <span />
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_primalac")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide">{t("col_opis")}</span>
            <span className="text-xs font-semibold text-kolo-muted uppercase tracking-wide text-right">{t("col_iznos")}</span>
          </div>
          {filtered.map((tx, i) => (
            <TxRed
              key={tx.id}
              t={tx}
              pseudonim={pseudonim}
              jePoslednji={i === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Red istorije transakcija (memo) ───────────────────────────────────────────
// Izdvojen u zasebnu memo-komponentu da promena filtera NE re-renderuje svaki red
// bez potrebe. `t` je transakcija (kao u originalu); prevodi se ovde ne koriste.

const TxRed = memo(function TxRed({ t, pseudonim, jePoslednji }: { t: Transakcija; pseudonim: string; jePoslednji: boolean }) {
  const locale = useLocale();
  // `t` je transakcija (kao u originalu), pa prevodi idu pod `tr`.
  const tr = useTranslations("novcanik");
  const [otvoreno, setOtvoreno] = useState(false);
  const [opis, setOpis] = useState("");
  const [salje, setSalje] = useState(false);
  const [poslato, setPoslato] = useState(false);
  const [greska, setGreska] = useState("");

  async function prijavi() {
    setSalje(true);
    setGreska("");
    try {
      const res = await fetch(`/api/transakcije/${t.id}/prijavi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opis: opis.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? tr("prijavi_greska"));
        return;
      }
      setOtvoreno(false);
      setPoslato(true);
    } finally {
      setSalje(false);
    }
  }

  const statusTekst = poslato || t.prijavaStatus === "OTVORENA"
    ? tr("prijavi_ceka")
    : t.prijavaStatus === "PONISTENA"
    ? tr("prijavi_ponistena")
    : t.prijavaStatus === "ODBACENA"
    ? tr("prijavi_odbacena")
    : null;

  return (
    <div
      className={`px-4 py-2.5 ${!jePoslednji ? "border-b border-kolo-border" : ""}`}
    >
      {/* Desktop prikaz */}
      <div className="hidden sm:grid grid-cols-[7rem_4.5rem_1fr_1.5rem_1fr_minmax(0,1.5fr)_7rem] gap-x-3 items-center">
        {/* Datum — timeZone zaključan da SSR (UTC) i klijent (lokalno) daju isti
            string; inače React hydration mismatch (#418) → suvišno preiscrtavanje. */}
        <p className="text-sm text-kolo-muted leading-tight">
          {new Date(t.createdAt).toLocaleDateString(intlTag(locale), {
            day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Belgrade",
          })}
        </p>
        {/* Vreme */}
        <p className="text-sm text-kolo-muted leading-tight">
          {new Date(t.createdAt).toLocaleTimeString(intlTag(locale), {
            hour: "2-digit", minute: "2-digit", timeZone: "Europe/Belgrade",
          })}
        </p>
        {/* Pošiljalac */}
        <div className="min-w-0">
          {t.primio ? (
            t.drugiId ? (
              <a href={profilHref({ id: t.drugiId, pseudonim: t.drugiPseudonim })} className="text-base text-kolo-green-700 hover:underline truncate block">
                <Pseudonim>{t.drugiPseudonim}</Pseudonim>
              </a>
            ) : (
              <span className="text-base text-kolo-muted truncate block"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
            )
          ) : (
            <span className="text-base text-kolo-text font-medium truncate block"><Pseudonim>{pseudonim}</Pseudonim></span>
          )}
        </div>
        {/* Strelica */}
        <span className="text-base font-bold text-kolo-muted text-center leading-none">→</span>
        {/* Primalac */}
        <div className="min-w-0">
          {t.primio ? (
            <span className="text-base text-kolo-text font-medium truncate block"><Pseudonim>{pseudonim}</Pseudonim></span>
          ) : (
            t.drugiId ? (
              <a href={profilHref({ id: t.drugiId, pseudonim: t.drugiPseudonim })} className="text-base text-kolo-green-700 hover:underline truncate block">
                <Pseudonim>{t.drugiPseudonim}</Pseudonim>
              </a>
            ) : (
              <span className="text-base text-kolo-muted truncate block"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
            )
          )}
        </div>
        {/* Opis */}
        <p className="text-xs text-kolo-muted/80 truncate" title={t.description ?? undefined}>{t.description}</p>
        {/* Iznos — od Protokola plavo, primljeno od člana zeleno, dato/upisano crveno */}
        <span className={`text-base font-bold text-right ${!izmedjuClanova(t.type) && t.primio ? "text-blue-600" : t.primio ? "text-kolo-green-700" : "text-red-500"}`}>
          {t.primio ? "+" : "−"}{t.amount.toLocaleString(intlTag(locale))}
        </span>
      </div>

      {/* Mobilna kompaktna kartica */}
      <div className="sm:hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              {t.primio ? (
                t.drugiId ? (
                  <a href={profilHref({ id: t.drugiId, pseudonim: t.drugiPseudonim })} className="text-kolo-green-700 hover:underline truncate">
                    <Pseudonim>{t.drugiPseudonim}</Pseudonim>
                  </a>
                ) : (
                  <span className="text-kolo-muted truncate"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
                )
              ) : (
                <span className="text-kolo-text font-medium truncate"><Pseudonim>{pseudonim}</Pseudonim></span>
              )}
              <span className="text-kolo-muted shrink-0">→</span>
              {t.primio ? (
                <span className="text-kolo-text font-medium truncate"><Pseudonim>{pseudonim}</Pseudonim></span>
              ) : (
                t.drugiId ? (
                  <a href={profilHref({ id: t.drugiId, pseudonim: t.drugiPseudonim })} className="text-kolo-green-700 hover:underline truncate">
                    <Pseudonim>{t.drugiPseudonim}</Pseudonim>
                  </a>
                ) : (
                  <span className="text-kolo-muted truncate"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
                )
              )}
            </div>
            <p className="text-xs text-kolo-muted mt-0.5">
              {new Date(t.createdAt).toLocaleString(intlTag(locale), {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", timeZone: "Europe/Belgrade",
              })}
            </p>
          </div>
          <span className={`text-sm font-bold text-right shrink-0 ${!izmedjuClanova(t.type) && t.primio ? "text-blue-600" : t.primio ? "text-kolo-green-700" : "text-red-500"}`}>
            {t.primio ? "+" : "−"}{t.amount.toLocaleString(intlTag(locale))}
          </span>
        </div>
        {t.description && (
          <p className="mt-1 text-xs text-kolo-muted/70 truncate">{t.description}</p>
        )}
      </div>

      {/* Prijava neispunjene razmene — ulazna tačka stoji uz sam prepis, jer se
          odluka i vodi o tom prepisu. Vidi je samo pošiljalac (server šalje
          `mozePrijaviti`), a kad je prijava podneta, dugme ustupa mesto ishodu. */}
      {(statusTekst || t.mozePrijaviti) && (
        <div className="mt-2 pt-2 border-t border-kolo-border/60">
          {statusTekst ? (
            <p className="text-xs text-kolo-muted">{statusTekst}</p>
          ) : otvoreno ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-kolo-text">{tr("prijavi_naslov")}</p>
              <p className="text-xs text-kolo-muted">{tr("prijavi_opis")}</p>
              <textarea
                value={opis}
                onChange={(e) => setOpis(e.target.value)}
                rows={3}
                placeholder={tr("prijavi_placeholder")}
                className="w-full text-sm border border-kolo-border rounded-xl px-3 py-2"
              />
              {greska && <p className="text-xs text-red-600">{greska}</p>}
              <div className="flex gap-2">
                <button
                  onClick={prijavi}
                  disabled={salje || opis.trim().length < 10}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-kolo-green-700 disabled:opacity-50"
                >
                  {tr("prijavi_posalji")}
                </button>
                <button
                  onClick={() => { setOtvoreno(false); setGreska(""); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-kolo-border text-kolo-muted"
                >
                  {tr("prijavi_odustani")}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setOtvoreno(true)}
              className="text-xs font-medium text-kolo-muted hover:text-kolo-text underline underline-offset-2"
            >
              {tr("prijavi_dugme")}
            </button>
          )}
        </div>
      )}
    </div>
  );
});
