"use client";

import { useState, useMemo, memo } from "react";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

export type Transakcija = {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  primio: boolean;
  drugiPseudonim: string;
  drugiId: string | null;
  createdAt: string;
};

type Filter = "sve" | "primljeno" | "poslato" | "emisije";

export default function IstorijaKlijent({ transakcije, pseudonim }: { transakcije: Transakcija[]; pseudonim: string }) {
  const t = useTranslations("novcanik");
  const [filter, setFilter] = useState<Filter>("sve");

  const filtered = useMemo(() => transakcije.filter((tx) => {
    if (filter === "primljeno") return tx.primio && tx.type === "TRANSFER";
    if (filter === "poslato") return !tx.primio && tx.type === "TRANSFER";
    if (filter === "emisije") return tx.type !== "TRANSFER";
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
            <a href="/tabla-jemstva" className="inline-block mt-1 text-sm font-semibold text-kolo-green-700 hover:underline">
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
  return (
    <div
      className={`px-4 py-2.5 ${!jePoslednji ? "border-b border-kolo-border" : ""}`}
    >
      {/* Desktop prikaz */}
      <div className="hidden sm:grid grid-cols-[7rem_4.5rem_1fr_1.5rem_1fr_minmax(0,1.5fr)_7rem] gap-x-3 items-center">
        {/* Datum */}
        <p className="text-sm text-kolo-muted leading-tight">
          {new Date(t.createdAt).toLocaleDateString("sr-RS", {
            day: "2-digit", month: "2-digit", year: "numeric",
          })}
        </p>
        {/* Vreme */}
        <p className="text-sm text-kolo-muted leading-tight">
          {new Date(t.createdAt).toLocaleTimeString("sr-RS", {
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
        {/* Pošiljalac */}
        <div className="min-w-0">
          {t.primio ? (
            t.drugiId ? (
              <a href={`/profil/${t.drugiId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
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
              <a href={`/profil/${t.drugiId}`} className="text-base text-kolo-green-700 hover:underline truncate block">
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
        <span className={`text-base font-bold text-right ${t.type !== "TRANSFER" && t.primio ? "text-blue-600" : t.primio ? "text-kolo-green-700" : "text-red-500"}`}>
          {t.primio ? "+" : "−"}{t.amount.toLocaleString("sr-RS")}
        </span>
      </div>

      {/* Mobilna kompaktna kartica */}
      <div className="sm:hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              {t.primio ? (
                t.drugiId ? (
                  <a href={`/profil/${t.drugiId}`} className="text-kolo-green-700 hover:underline truncate">
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
                  <a href={`/profil/${t.drugiId}`} className="text-kolo-green-700 hover:underline truncate">
                    <Pseudonim>{t.drugiPseudonim}</Pseudonim>
                  </a>
                ) : (
                  <span className="text-kolo-muted truncate"><Pseudonim>{t.drugiPseudonim}</Pseudonim></span>
                )
              )}
            </div>
            <p className="text-xs text-kolo-muted mt-0.5">
              {new Date(t.createdAt).toLocaleString("sr-RS", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <span className={`text-sm font-bold text-right shrink-0 ${t.type !== "TRANSFER" && t.primio ? "text-blue-600" : t.primio ? "text-kolo-green-700" : "text-red-500"}`}>
            {t.primio ? "+" : "−"}{t.amount.toLocaleString("sr-RS")}
          </span>
        </div>
        {t.description && (
          <p className="mt-1 text-xs text-kolo-muted/70 truncate">{t.description}</p>
        )}
      </div>
    </div>
  );
});
