"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

interface PregledRed {
  userId: string;
  pseudonim: string;
  poslednjaAktivnost: string | null;
  brojPoseta: number;
}

interface DnevnikRed {
  id: string;
  userId: string;
  pseudonim: string;
  putanja: string;
  createdAt: string;
}

const TAKE = 100;

function formatVreme(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("sr-RS", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Admin tab „Aktivnost" (samo superadmin): kad je koji korisnik poslednji put
 * bio aktivan i koje je stranice posećivao. Podaci iz `AktivnostLog` preko
 * `GET /api/admin/aktivnost`.
 */
export default function AktivnostTab() {
  const t = useTranslations("admin");
  const [view, setView] = useState<"pregled" | "dnevnik">("pregled");
  const [pregled, setPregled] = useState<PregledRed[] | null>(null);
  const [dnevnik, setDnevnik] = useState<DnevnikRed[]>([]);
  const [imaJos, setImaJos] = useState(false);
  const [q, setQ] = useState("");
  const [aktivanQ, setAktivanQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [greska, setGreska] = useState(false);

  const ucitajPregled = useCallback(async () => {
    setLoading(true);
    setGreska(false);
    try {
      const res = await fetch("/api/admin/aktivnost?view=pregled");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPregled(data.pregled);
    } catch {
      setGreska(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const ucitajDnevnik = useCallback(
    async (filter: string, pre: string | null) => {
      setLoading(true);
      setGreska(false);
      try {
        const params = new URLSearchParams({ view: "dnevnik", take: String(TAKE) });
        if (filter) params.set("q", filter);
        if (pre) params.set("pre", pre);
        const res = await fetch(`/api/admin/aktivnost?${params}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const novi: DnevnikRed[] = data.dnevnik;
        setDnevnik((prev) => (pre ? [...prev, ...novi] : novi));
        setImaJos(novi.length === TAKE);
      } catch {
        setGreska(true);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (view === "pregled") void ucitajPregled();
    else void ucitajDnevnik(aktivanQ, null);
  }, [view, aktivanQ, ucitajPregled, ucitajDnevnik]);

  function primeniFilter(e: React.FormEvent) {
    e.preventDefault();
    setAktivanQ(q.trim());
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setView("pregled")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
              view === "pregled"
                ? "bg-kolo-green-700 text-white"
                : "bg-kolo-bg text-kolo-muted hover:bg-kolo-border"
            }`}
          >
            {t("aktivnost_pregled")}
          </button>
          <button
            onClick={() => setView("dnevnik")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
              view === "dnevnik"
                ? "bg-kolo-green-700 text-white"
                : "bg-kolo-bg text-kolo-muted hover:bg-kolo-border"
            }`}
          >
            {t("aktivnost_dnevnik")}
          </button>
        </div>
        <button
          onClick={() =>
            view === "pregled" ? ucitajPregled() : ucitajDnevnik(aktivanQ, null)
          }
          className="px-4 py-2 bg-kolo-bg text-kolo-muted text-sm font-semibold rounded-xl hover:bg-kolo-border transition-colors"
        >
          {t("aktivnost_osvezi")}
        </button>
      </div>

      <p className="text-xs text-kolo-muted">{t("aktivnost_napomena")}</p>

      {greska && (
        <p className="px-5 py-4 text-center text-sm text-kolo-danger">
          {t("aktivnost_greska")}
        </p>
      )}

      {view === "pregled" && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          {pregled === null || (loading && pregled.length === 0) ? (
            <p className="px-5 py-8 text-center text-sm text-kolo-muted">…</p>
          ) : pregled.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-kolo-muted">
              {t("aktivnost_nema")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-kolo-muted border-b border-kolo-border">
                    <th className="px-4 py-2.5 font-medium">{t("aktivnost_kolona_korisnik")}</th>
                    <th className="px-4 py-2.5 font-medium">{t("aktivnost_kolona_poslednja")}</th>
                    <th className="px-4 py-2.5 font-medium text-right">{t("aktivnost_kolona_poseta")}</th>
                  </tr>
                </thead>
                <tbody>
                  {pregled.map((r) => (
                    <tr key={r.userId} className="border-b border-kolo-border last:border-0">
                      <td className="px-4 py-2.5">
                        <Pseudonim>{r.pseudonim}</Pseudonim>
                      </td>
                      <td className="px-4 py-2.5 text-kolo-muted">
                        {formatVreme(r.poslednjaAktivnost)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-kolo-muted">{r.brojPoseta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {view === "dnevnik" && (
        <>
          <form onSubmit={primeniFilter} className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("aktivnost_pretraga_placeholder")}
              className="flex-1 border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors"
            >
              {t("aktivnost_pretraga_btn")}
            </button>
          </form>

          <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
            {dnevnik.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-kolo-muted">
                {loading ? "…" : t("aktivnost_nema")}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-kolo-muted border-b border-kolo-border">
                      <th className="px-4 py-2.5 font-medium">{t("aktivnost_kolona_vreme")}</th>
                      <th className="px-4 py-2.5 font-medium">{t("aktivnost_kolona_korisnik")}</th>
                      <th className="px-4 py-2.5 font-medium">{t("aktivnost_kolona_stranica")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnevnik.map((r) => (
                      <tr key={r.id} className="border-b border-kolo-border last:border-0">
                        <td className="px-4 py-2.5 text-kolo-muted whitespace-nowrap">
                          {formatVreme(r.createdAt)}
                        </td>
                        <td className="px-4 py-2.5">
                          <Pseudonim>{r.pseudonim}</Pseudonim>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-kolo-text break-all">
                          {r.putanja}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {imaJos && (
            <button
              onClick={() => ucitajDnevnik(aktivanQ, dnevnik[dnevnik.length - 1]?.createdAt ?? null)}
              disabled={loading}
              className="w-full py-2.5 bg-kolo-bg text-kolo-muted text-sm font-semibold rounded-xl hover:bg-kolo-border disabled:opacity-60 transition-colors"
            >
              {t("aktivnost_ucitaj_jos")}
            </button>
          )}
        </>
      )}
    </div>
  );
}
