"use client";

import { useState } from "react";
import { intlTag } from "@/lib/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface MojaPrijava {
  id: string;
  status: string;
  planIzvrsenja: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

interface EvidencijaItem {
  id: string;
  date: string;
  predlozeniPoen: number;
  amount: number;
  dokaz: string | null;
  description: string;
  status: string;
}

interface OglasData {
  id: string;
  title: string;
  description: string;
  source: string;
  predlozeniPoen: number;
  obrazlozenje: string | null;
  saOdobravanjem: boolean;
  positions: number;
  deadline: string | null;
  status: string;
  createdByPseudonim: string;
  krugName: string | null;
  odobreniClanovi: number;
  createdAt: string;
  mojaPrijava: MojaPrijava | null;
  mojeEvidencije: EvidencijaItem[];
}

const sourceCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  KRUG: "bg-kolo-info-light text-kolo-info",
  PROJEKAT: "bg-purple-50 text-purple-700",
};

export default function OglasDetalj({ oglas, isVerified }: { oglas: OglasData; isVerified: boolean }) {
  const locale = useLocale();
  const t = useTranslations("doprinosOglasi");
  const router = useRouter();
  const [loadingPrijava, setLoadingPrijava] = useState(false);
  const [plan, setPlan] = useState("");
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const aktivan = oglas.status === "ACTIVE";
  const mozePrijaviti = isVerified && aktivan && !oglas.mojaPrijava;
  const imaPrimljenuPrijavu = oglas.mojaPrijava?.status === "APPROVED";
  const mestaPopunjena = oglas.odobreniClanovi >= oglas.positions;

  const sourceLabel: Record<string, string> = {
    FONDACIJA: t("source_fondacija"),
    KRUG: t("source_krug"),
    PROJEKAT: t("source_projekat"),
  };

  const evStatusBadge: Record<string, { label: string; cls: string }> = {
    PENDING:  { label: t("ev_ceka_verifikaciju"), cls: "text-kolo-gold-600" },
    APPROVED: { label: t("ev_potvrdeno"),         cls: "text-kolo-info" },
    REJECTED: { label: t("ev_odbijeno"),          cls: "text-red-500" },
    EMITTED:  { label: t("ev_evidentirano"),      cls: "text-kolo-green-700" },
  };

  async function prijavi() {
    if (oglas.saOdobravanjem && plan.trim().length < 10) {
      setPoruka({ text: t("plan_min10"), ok: false });
      return;
    }
    setLoadingPrijava(true); setPoruka(null);
    const res = await fetch(`/api/doprinos-oglasi/${oglas.id}/prijavi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planIzvrsenja: plan.trim() || undefined }),
    });
    const data = await res.json();
    setLoadingPrijava(false);
    setPoruka({
      text: res.ok
        ? (data.primljen ? t("prijava_primljena_izvršilac") : t("prijava_podneta_ceka"))
        : (data.error ?? t("greska")),
      ok: res.ok,
    });
    if (res.ok) setTimeout(() => router.refresh(), 1200);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/doprinos-oglasi" className="text-kolo-muted hover:text-kolo-muted text-sm transition-colors">← {t("naslov")}</Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
        <div>
          <div className="flex justify-between items-center gap-2 flex-wrap mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${sourceCls[oglas.source] ?? "bg-kolo-bg text-kolo-muted"}`}>
                {sourceLabel[oglas.source] ?? oglas.source}
              </span>
              {oglas.krugName && <span className="text-xs text-kolo-muted">{oglas.krugName}</span>}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {oglas.saOdobravanjem && <span className="text-xs bg-kolo-info-light text-kolo-info px-2 py-0.5 rounded">{t("sa_odobravanjem")}</span>}
              {!aktivan && <span className="text-xs bg-kolo-bg text-kolo-muted px-2 py-0.5 rounded">{t("zatvoren")}</span>}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-kolo-text">{oglas.title}</h1>
          <p className="text-sm text-kolo-muted mt-2 leading-relaxed whitespace-pre-line">{oglas.description}</p>
        </div>

        {oglas.obrazlozenje && (
          <div className="bg-kolo-bg rounded-xl p-3 text-sm text-kolo-muted">
            <span className="font-semibold text-kolo-text">{t("obrazlozenje_label")}: </span>{oglas.obrazlozenje}
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
          <div className="bg-kolo-bg rounded-xl p-3 text-center">
            <p className="font-semibold text-kolo-text">{oglas.odobreniClanovi}/{oglas.positions}</p>
            <p className="text-xs text-kolo-muted mt-0.5">{t("izvršilaca")}</p>
          </div>
          <div className="bg-kolo-bg rounded-xl p-3 text-center">
            <p className="font-semibold text-kolo-green-700">{oglas.predlozeniPoen > 0 ? `${oglas.predlozeniPoen.toLocaleString(intlTag(locale))} P` : t("neograniceno")}</p>
            <p className="text-xs text-kolo-muted mt-0.5">{t("predlozeni_tezina")}</p>
          </div>
        </div>

        {oglas.deadline && (
          <p className="text-xs text-kolo-muted">
            {t("rok_za_prijavu")}: <strong className="text-kolo-muted">{new Date(oglas.deadline).toLocaleDateString(intlTag(locale), { day: "2-digit", month: "long", year: "numeric" })}</strong>
          </p>
        )}

        {/* Status prijave */}
        {oglas.mojaPrijava && (
          <div className={`rounded-xl px-4 py-3 text-sm border ${
            oglas.mojaPrijava.status === "APPROVED" ? "bg-kolo-green-100 border-kolo-green-100 text-kolo-green-700" :
            oglas.mojaPrijava.status === "REJECTED" ? "bg-kolo-danger-light border-kolo-danger/20 text-kolo-danger" :
            "bg-kolo-gold-100 border-kolo-gold-100 text-kolo-gold-600"
          }`}>
            {oglas.mojaPrijava.status === "APPROVED" && t("status_primljen_izvršilac")}
            {oglas.mojaPrijava.status === "PENDING" && t("status_prijava_ceka")}
            {oglas.mojaPrijava.status === "REJECTED" && (
              <span>{t("status_prijava_odbijena")}{oglas.mojaPrijava.rejectionReason ? ` ${t("razlog")}: ${oglas.mojaPrijava.rejectionReason}` : ""}</span>
            )}
          </div>
        )}

        {/* Akcije */}
        <div className="pt-1 space-y-3">
          {!isVerified && aktivan && (
            <p className="text-sm text-kolo-gold-600">{t("potreban_indeks")}</p>
          )}
          {mozePrijaviti && mestaPopunjena && (
            <p className="text-sm text-kolo-muted">{t("mesta_popunjena")}</p>
          )}
          {mozePrijaviti && !mestaPopunjena && (
            <>
              {oglas.saOdobravanjem && (
                <div>
                  <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("plan_label")}</label>
                  <textarea rows={3} value={plan} onChange={(e) => setPlan(e.target.value)}
                    placeholder={t("plan_placeholder")}
                    className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 resize-none" />
                </div>
              )}
              <button onClick={prijavi} disabled={loadingPrijava}
                className="w-full py-3 rounded-xl bg-kolo-green-700 text-white font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60">
                {loadingPrijava ? t("saljem_prijavu") : (oglas.saOdobravanjem ? t("prijavi_se_sa_planom") : t("prijavi_se_za_zadatak"))}
              </button>
            </>
          )}
          {poruka && (
            <p className={`text-sm px-4 py-2 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
              {poruka.text}
            </p>
          )}
        </div>
      </div>

      {/* Forma za evidenciju dnevnog izvršenja */}
      {imaPrimljenuPrijavu && aktivan && (
        <EvidencijaForma
          oglasId={oglas.id}
          maxPredlozeni={oglas.predlozeniPoen}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* Istorija izvršenja */}
      {oglas.mojeEvidencije.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-3 border-b border-kolo-border">
            <h3 className="text-sm font-semibold text-kolo-muted">{t("moja_dnevna_izvrsenja")}</h3>
          </div>
          {oglas.mojeEvidencije.map((e, i) => {
            const badge = evStatusBadge[e.status];
            return (
              <div key={e.id} className={`px-5 py-3 flex justify-between items-center gap-3 ${i < oglas.mojeEvidencije.length - 1 ? "border-b border-kolo-border" : ""}`}>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  {e.dokaz && /\.(jpe?g|png|webp)(\?.*)?$/i.test(e.dokaz) && /^https?:\/\//.test(e.dokaz) && (
                    <a href={e.dokaz} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.dokaz} alt={t("dokaz_label")} className="h-10 w-10 rounded-lg border border-kolo-border object-cover" />
                    </a>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-kolo-text">{new Date(e.date).toLocaleDateString(intlTag(locale), { day: "2-digit", month: "short", year: "numeric" })}</p>
                    <p className="text-xs text-kolo-muted mt-0.5 line-clamp-1">{e.description}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-kolo-text">
                    {e.status === "EMITTED"
                      ? t("ev_iznos_evidentirano", { iznos: e.amount.toLocaleString(intlTag(locale)) })
                      : t("ev_iznos_predlozeno", { iznos: e.predlozeniPoen.toLocaleString(intlTag(locale)) })}
                  </p>
                  <p className={`text-xs font-medium ${badge?.cls ?? ""}`}>{badge?.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Forma za unos dnevnog izvršenja ─────────────────────────────────────────────

function EvidencijaForma({ oglasId, maxPredlozeni, onSuccess }: {
  oglasId: string;
  maxPredlozeni: number;
  onSuccess: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("doprinosOglasi");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [predlozeniPoen, setPredlozeniPoen] = useState("");
  const [description, setDescription] = useState("");
  const [dokazSlika, setDokazSlika] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const predlozeni = Number(predlozeniPoen);

  // Max datum = danas, min datum = 3 dana unazad
  const maxDate = new Date().toISOString().split("T")[0];
  const minDateObj = new Date(); minDateObj.setDate(minDateObj.getDate() - 3);
  const minDate = minDateObj.toISOString().split("T")[0];

  async function handleSubmit() {
    setError("");
    if (!predlozeniPoen || !Number.isInteger(predlozeni) || predlozeni < 1) { setError(t("ev_greska_poen_pozitivan")); return; }
    if (maxPredlozeni > 0 && predlozeni > maxPredlozeni) { setError(t("ev_greska_poen_max", { max: maxPredlozeni.toLocaleString(intlTag(locale)) })); return; }
    if (!description.trim() || description.trim().length < 10) { setError(t("ev_greska_opis_min10")); return; }
    if (dokazSlika) {
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(dokazSlika.type)) { setError(t("ev_greska_dokaz_format")); return; }
      if (dokazSlika.size > 5 * 1024 * 1024) { setError(t("ev_greska_dokaz_velicina")); return; }
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("date", date);
      fd.append("predlozeniPoen", String(predlozeni));
      fd.append("description", description.trim());
      if (dokazSlika) fd.append("dokazSlika", dokazSlika);
      const res = await fetch(`/api/doprinos-oglasi/${oglasId}/evidencija`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t("greska")); return; }
      setSuccess(true);
      setDescription(""); setPredlozeniPoen(""); setDokazSlika(null);
      setTimeout(onSuccess, 1200);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-kolo-green-100 border border-kolo-green-100 rounded-2xl px-5 py-4 text-sm text-kolo-green-700">
        {t("ev_uspeh")}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-kolo-muted">{t("evidentiraj_dnevno")}</h3>
        {predlozeni > 0 && (
          <span className="text-sm font-bold text-kolo-green-700">{t("ev_iznos_predlozeno", { iznos: predlozeni.toLocaleString(intlTag(locale)) })}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("datum")}</label>
          <input type="date" value={date} min={minDate} max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{maxPredlozeni > 0 ? t("predlozeni_poen_max", { max: maxPredlozeni.toLocaleString(intlTag(locale)) }) : t("predlozeni_poen_bez_max")}</label>
          <input type="number" min={1} max={maxPredlozeni > 0 ? maxPredlozeni : undefined} step={1} value={predlozeniPoen}
            onChange={(e) => setPredlozeniPoen(e.target.value)}
            placeholder={t("predlozeni_poen_placeholder")}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("opis_izvrsenja_label")}</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder={t("opis_izvrsenja_placeholder")}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600 resize-none" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("dokaz_label")}</label>
        <input type="file" accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setDokazSlika(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-kolo-muted file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-kolo-green-100 file:text-kolo-green-700 file:text-xs file:font-semibold file:cursor-pointer" />
        <p className="text-xs text-kolo-muted mt-1">{t("dokaz_napomena")}</p>
      </div>

      {error && <p className="text-xs text-kolo-danger">{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60">
        {loading ? t("saljem") : t("posalji_dnevno")}
      </button>
    </div>
  );
}
