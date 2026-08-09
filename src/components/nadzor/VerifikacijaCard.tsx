"use client";

/**
 * Kartica verifikacije koja čeka nadzor.
 *
 * Do 4.2.0 je imala jedno dugme — „Potvrdi nadzor". Nadzornik koji nešto posumnja
 * nije imao gde to da upiše, pa ni traga o tome nije bilo, a podsticaj (500 POEN
 * samo uz potvrdu) gurao je ka propuštanju. Sada su tri ishoda i svi se plaćaju isto
 * (Pravilnik o dokazu stvarnosti 4.2.0, čl. 7 st. 2 i čl. 11).
 */

import { useState } from "react";
import { intlTag } from "@/lib/format";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pseudonim from "@/components/Pseudonim";
import { profilHref } from "@/lib/profil-link";
import { RAZLOZI, SUBJEKTI, jeSumnja, type Ishod, type Subjekt, type Razlog } from "@/lib/nadzor-pravila";

type RanijiZapis = { id: string; ishod: string; razlog: string | null; createdAt: string };

type Props = {
  id: string;
  verifikator: { id: string; pseudonim: string; slotoviPotroseni: number };
  verifikovani: { id: string; pseudonim: string };
  datum: string;
  ranijiZapisi?: RanijiZapis[];
};

export default function VerifikacijaCard({
  id,
  verifikator,
  verifikovani,
  datum,
  ranijiZapisi = [],
}: Props) {
  const locale = useLocale();
  const t = useTranslations("nadzor");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Otvorena forma za ishod koji traži obrazloženje (čl. 11 st. 3).
  const [formaZa, setFormaZa] = useState<Ishod | null>(null);
  const [subjekt, setSubjekt] = useState<Subjekt>("VERIFIKOVANI");
  const [razlog, setRazlog] = useState<Razlog>("ne_poznaju_se");
  const [opis, setOpis] = useState("");

  async function posalji(ishod: Ishod) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nadzor/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          jeSumnja(ishod)
            ? { ishod, subjekt, razlog, opis: opis.trim() || null }
            : { ishod }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("greska"));
        return;
      }
      setFormaZa(null);
      router.refresh();
    } catch {
      setError(t("greska_mreza"));
    } finally {
      setLoading(false);
    }
  }

  const datumLepo = new Date(datum).toLocaleString(intlTag(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm">
            <Link href={profilHref(verifikator)} className="font-semibold hover:underline">
              @<Pseudonim>{verifikator.pseudonim}</Pseudonim>
            </Link>
            <span className="text-kolo-muted"> → </span>
            <Link href={profilHref(verifikovani)} className="font-semibold hover:underline">
              @<Pseudonim>{verifikovani.pseudonim}</Pseudonim>
            </Link>
          </div>
          <div className="mt-1 text-xs text-kolo-muted">
            {datumLepo} · {t("potroseno_slotova", { broj: verifikator.slotoviPotroseni })}
          </div>
          {ranijiZapisi.length > 0 && (
            <div className="mt-1 text-xs text-amber-700">
              {t("vec_gledali", { broj: ranijiZapisi.length })}
            </div>
          )}
          {error && <div className="mt-1 text-xs text-kolo-danger">{error}</div>}
        </div>

        {formaZa === null && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => posalji("UREDNO")}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900 disabled:opacity-50"
            >
              {t("ishod_uredno")}
            </button>
            <button
              onClick={() => setFormaZa("ZA_PROVERU")}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm font-medium hover:bg-amber-100 disabled:opacity-50"
            >
              {t("ishod_za_proveru")}
            </button>
            <button
              onClick={() => setFormaZa("SPORNO")}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 disabled:opacity-50"
            >
              {t("ishod_sporno")}
            </button>
          </div>
        )}
      </div>

      {formaZa !== null && (
        <div className="space-y-2 border-t border-kolo-border pt-3">
          <p className="text-xs text-kolo-muted">
            {formaZa === "ZA_PROVERU" ? t("opis_za_proveru") : t("opis_sporno")}
          </p>

          <label className="block text-sm">
            <span className="text-kolo-muted text-xs">{t("polje_subjekt")}</span>
            <select
              value={subjekt}
              onChange={(e) => setSubjekt(e.target.value as Subjekt)}
              className="mt-1 w-full rounded-lg border border-kolo-border px-3 py-2 text-sm"
            >
              {SUBJEKTI.map((s) => (
                <option key={s} value={s}>
                  {t(`subjekt_${s.toLowerCase()}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-kolo-muted text-xs">{t("polje_razlog")}</span>
            <select
              value={razlog}
              onChange={(e) => setRazlog(e.target.value as Razlog)}
              className="mt-1 w-full rounded-lg border border-kolo-border px-3 py-2 text-sm"
            >
              {RAZLOZI.map((r) => (
                <option key={r} value={r}>
                  {t(`razlog_${r}`)}
                </option>
              ))}
            </select>
          </label>

          {razlog === "ostalo" && (
            <textarea
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              rows={2}
              placeholder={t("polje_opis")}
              className="w-full rounded-lg border border-kolo-border px-3 py-2 text-sm"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={() => posalji(formaZa)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900 disabled:opacity-50"
            >
              {loading ? t("saljem") : t("evidentiraj")}
            </button>
            <button
              onClick={() => setFormaZa(null)}
              className="px-3 py-1.5 text-sm text-kolo-muted hover:text-kolo-text"
            >
              {t("odustani")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
