"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type EnrollmentStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
type EvidencijaStatus = "PENDING" | "APPROVED" | "REJECTED" | "EMITTED";

interface ProgramInfo {
  type: string;
  label: string;
  programAktivan: boolean;
  enrollment: {
    id: string;
    status: EnrollmentStatus;
    metadata: Record<string, unknown> | null;
    dailyAmount: number | null;
    approvedAt: string | null;
    rejectionReason: string | null;
    ocekivaniDnevni: number;
  } | null;
}

interface EvidencijaInfo {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: EvidencijaStatus;
}

interface EmisioniKontekst {
  opticaj: number;
  dnevniLimit: number;
  emitovanoAm: number | null;
  zahtevanoAm: number | null;
}

interface Props {
  programi: ProgramInfo[];
  isVerified: boolean;
  isKrugr: boolean;
  protokolBalance: number;
  emisioniKontekst: EmisioniKontekst;
  evidencijaToday: EvidencijaInfo | null;
  poslednjeEvidencije: EvidencijaInfo[];
}

function useStatusBadge(): Record<EnrollmentStatus, { label: string; cls: string }> {
  const t = useTranslations("programi");
  return {
    PENDING:  { label: t("status_na_cekanju"), cls: "bg-kolo-gold-100 text-kolo-gold-600 border-kolo-gold-100" },
    ACTIVE:   { label: t("status_aktivan"),    cls: "bg-kolo-green-100 text-kolo-green-700 border-kolo-green-100" },
    INACTIVE: { label: t("status_neaktivan"),  cls: "bg-kolo-bg text-kolo-muted border-kolo-border" },
    REJECTED: { label: t("status_odbijen"),    cls: "bg-kolo-danger-light text-kolo-danger border-kolo-danger/20" },
  };
}


export default function ProgramiKlijent({ programi, isVerified, isKrugr, protokolBalance, emisioniKontekst, evidencijaToday, poslednjeEvidencije }: Props) {
  const t = useTranslations("programi");
  const tc = useTranslations("common");
  const router = useRouter();
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean; for: string } | null>(null);

  const totalOcekivano = programi.reduce((s, p) => s + (p.enrollment?.ocekivaniDnevni ?? 0), 0);

  async function prijavi(type: string, metadata?: Record<string, unknown>) {
    setLoading(true); setPoruka(null);
    const res = await fetch(`/api/programi/${type}/prijava`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata ?? {}),
    });
    const data = await res.json();
    setLoading(false);
    setPoruka({ text: res.ok ? t("prijava_podneta") : (data.error ?? tc("greska_ucitavanja")), ok: res.ok, for: type });
    if (res.ok) { setActiveProgram(null); setTimeout(() => router.refresh(), 1200); }
  }

  const { opticaj, dnevniLimit, emitovanoAm, zahtevanoAm } = emisioniKontekst;
  const emitovanoPct = dnevniLimit > 0 && emitovanoAm !== null ? Math.min(100, Math.round((emitovanoAm / dnevniLimit) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="kolo-naslov">{t("naslov")}</h1>
        {totalOcekivano > 0 && (
          <div className="bg-kolo-green-100 border border-kolo-green-100 rounded-xl px-4 py-2 text-center">
            <p className="text-sm font-bold text-kolo-green-700">{totalOcekivano.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-green-700">{tc("poen_dan")}</p>
          </div>
        )}
      </div>

      {/* Emisioni kontekst */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
        <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider">{t("emisioni_kontekst")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-base font-bold text-kolo-text">{opticaj.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted mt-0.5">{t("opticaj")}</p>
          </div>
          <div>
            <p className="text-base font-bold text-kolo-text">{dnevniLimit.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted mt-0.5">{t("dnevni_limit")}</p>
          </div>
          <div>
            <p className={`text-base font-bold ${emitovanoAm !== null && emitovanoAm > 0 ? "text-kolo-green-700" : "text-kolo-muted"}`}>
              {emitovanoAm !== null ? emitovanoAm.toLocaleString("sr-RS") : "—"}
            </p>
            <p className="text-xs text-kolo-muted mt-0.5">{t("emitovano_danas")}</p>
          </div>
        </div>
        {dnevniLimit > 0 && (
          <div>
            <div className="flex justify-between text-xs text-kolo-muted mb-1">
              <span>{t("iskorišcenost")}</span>
              <span>{emitovanoPct}%{zahtevanoAm !== null && zahtevanoAm > dnevniLimit ? t("limit_dostignut") : ""}</span>
            </div>
            <div className="h-2 bg-kolo-bg rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${emitovanoPct >= 100 ? "bg-kolo-danger-light0" : emitovanoPct >= 75 ? "bg-kolo-gold-400" : "bg-kolo-green-1000"}`}
                style={{ width: `${emitovanoPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {!isVerified && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-2xl px-5 py-4 text-sm text-kolo-gold-600">
          {t("nije_verifikovan")}
        </div>
      )}

      <div className="space-y-3">
        {programi.map((p) => (
          <ProgramKartica
            key={p.type}
            p={p}
            isVerified={isVerified}
            isKrugr={isKrugr}
            protokolBalance={protokolBalance}
            loading={loading}
            poruka={poruka?.for === p.type ? poruka : null}
            expanded={activeProgram === p.type}
            onExpand={() => setActiveProgram(activeProgram === p.type ? null : p.type)}
            onPrijavi={(meta) => prijavi(p.type, meta)}
            evidencijaToday={p.type === "PED" ? evidencijaToday : null}
            onEvidencijaSuccess={() => { setTimeout(() => router.refresh(), 1200); }}
          />
        ))}
      </div>

      {/* Istorija evidencija */}
      {poslednjeEvidencije.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-3 border-b border-kolo-border">
            <h3 className="text-sm font-semibold text-kolo-muted">{t("istorija_naslov")}</h3>
          </div>
          {poslednjeEvidencije.map((e, i) => {
            const evBadge = getEvStatusBadge(e.status, t);
            return (
              <div key={e.id} className={`px-5 py-3 flex justify-between items-center ${i < poslednjeEvidencije.length - 1 ? "border-b border-kolo-border" : ""}`}>
                <div>
                  <p className="text-sm text-kolo-text">{new Date(e.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</p>
                  <p className="text-xs text-kolo-muted mt-0.5 line-clamp-1">{e.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-semibold text-kolo-text">{e.amount.toLocaleString("sr-RS")} P</p>
                  <p className={`text-xs font-medium ${evBadge.cls}`}>{evBadge.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Kartica programa ───────────────────────────────────────────────────────────

function ProgramKartica({
  p, isVerified, isKrugr, protokolBalance, loading, poruka, expanded, onExpand, onPrijavi, evidencijaToday, onEvidencijaSuccess,
}: {
  p: ProgramInfo;
  isVerified: boolean;
  isKrugr: boolean;
  protokolBalance: number;
  loading: boolean;
  poruka: { text: string; ok: boolean } | null;
  expanded: boolean;
  onExpand: () => void;
  onPrijavi: (meta?: Record<string, unknown>) => void;
  evidencijaToday: { id: string; status: string; description: string; amount: number } | null;
  onEvidencijaSuccess: () => void;
}) {
  const t = useTranslations("programi");
  const tc = useTranslations("common");
  const statusBadge = useStatusBadge();
  const enStatus = p.enrollment?.status;

  const krugrskaProvera = ["PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE"];
  const zahtevaDrugarstvo = krugrskaProvera.includes(p.type);
  const mozePrijaviti = isVerified && (!zahtevaDrugarstvo || isKrugr) && p.programAktivan;

  return (
    <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
      <div className="px-5 py-4 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-kolo-text">{p.label}</p>
            {!p.programAktivan && (
              <span className="text-xs bg-kolo-bg text-kolo-muted px-2 py-0.5 rounded">{tc("neaktivan")}</span>
            )}
            {enStatus && (
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${statusBadge[enStatus].cls}`}>
                {statusBadge[enStatus].label}
              </span>
            )}
          </div>
          {enStatus === "ACTIVE" && p.enrollment!.ocekivaniDnevni > 0 && (
            <p className="text-sm text-kolo-green-700 font-medium mt-1">
              {p.enrollment!.ocekivaniDnevni.toLocaleString("sr-RS")} {tc("poen_dan")}
            </p>
          )}
          <p className="text-xs text-kolo-muted mt-0.5">{opisPrograma(p.type, t)}</p>
        </div>

        {/* Akcija dugme */}
        <div className="ml-4 shrink-0">
          {!enStatus && mozePrijaviti && (
            <button onClick={onExpand}
              className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
              {t("prijavi_se")}
            </button>
          )}
          {enStatus === "ACTIVE" && p.type === "PED" && (
            <button onClick={onExpand}
              className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
              {t("evidencija")}
            </button>
          )}
          {enStatus === "REJECTED" && mozePrijaviti && (
            <button onClick={onExpand}
              className="px-3 py-1.5 border border-kolo-green-500 text-kolo-green-700 text-xs font-semibold rounded-xl hover:bg-kolo-green-100 transition-colors">
              {t("pokusaj_ponovo")}
            </button>
          )}
        </div>
      </div>

      {/* Expanded — forma za prijavu ili evidencija */}
      {expanded && (
        <div className="border-t border-kolo-border px-5 py-4">
          {enStatus === "ACTIVE" && p.type === "PED" ? (
            <EvidencijaForma
              evidencijaToday={evidencijaToday}
              onSuccess={onEvidencijaSuccess}
              onCancel={onExpand}
            />
          ) : (
            <PrijavnaForma
              type={p.type}
              loading={loading}
              onSubmit={onPrijavi}
              onCancel={onExpand}
            />
          )}
          {poruka && (
            <p className={`mt-3 text-sm px-4 py-2 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
              {poruka.text}
            </p>
          )}
        </div>
      )}

      {enStatus === "REJECTED" && p.enrollment?.rejectionReason && !expanded && (
        <div className="border-t border-kolo-border px-5 py-3 text-xs text-red-500">
          {t("razlog_odbijanja")} {p.enrollment.rejectionReason}
        </div>
      )}

      {/* Progress indikatori za zaključane faze */}
      {!p.programAktivan && !enStatus && p.type === "POSEBNA_BRIGA" && (() => {
        const PRAG = 1_000_000;
        const opticaj = Math.abs(protokolBalance);
        const pct = Math.min(100, Math.round((opticaj / PRAG) * 100));
        return (
          <div className="border-t border-kolo-border px-5 py-3">
            <div className="flex justify-between text-xs text-kolo-muted mb-1">
              <span>{t("prag_protokol")}</span>
              <span>{opticaj.toLocaleString("sr-RS")} / 1.000.000 ({pct}%)</span>
            </div>
            <div className="h-1.5 bg-kolo-bg rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })()}

      {!p.programAktivan && !enStatus && p.type === "SKOLOVANJE" && (() => {
        return (
          <div className="border-t border-kolo-border px-5 py-3 text-xs text-kolo-muted">
            {t("skolovanje_info")}
          </div>
        );
      })()}
    </div>
  );
}

// ── Forme za prijavu ───────────────────────────────────────────────────────────

function PrijavnaForma({ type, loading, onSubmit, onCancel }: {
  type: string;
  loading: boolean;
  onSubmit: (meta?: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("programi");
  const tc = useTranslations("common");
  const [datumRodjenja, setDatumRodjenja] = useState("");
  const [dijagnoza, setDijagnoza] = useState("");
  const [ustanova, setUstanova] = useState("");
  const [program, setProgram] = useState("");
  const [deca, setDeca] = useState<{ ime: string; datumRodjenja: string }[]>([{ ime: "", datumRodjenja: "" }]);

  function handleSubmit() {
    if (type === "PED") { onSubmit(); return; }
    if (type === "PODRSKA_STARIJIMA") { onSubmit({ datumRodjenja }); return; }
    if (type === "POSEBNA_BRIGA") { onSubmit({ dijagnoza }); return; }
    if (type === "SKOLOVANJE") { onSubmit({ ustanova, program }); return; }
    if (type === "PODRSKA_MAJKAMA") { onSubmit({ deca: deca.filter(d => d.ime && d.datumRodjenja) }); return; }
  }

  return (
    <div className="space-y-3">
      {type === "PED" && (
        <p className="text-sm text-kolo-muted">
          {t("ped_opis")}
        </p>
      )}

      {type === "PODRSKA_STARIJIMA" && (
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("datum_rodjenja")}</label>
          <input type="date" value={datumRodjenja} onChange={(e) => setDatumRodjenja(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
          <p className="text-xs text-kolo-muted mt-1">{t("starijima_napomena")}</p>
        </div>
      )}

      {type === "POSEBNA_BRIGA" && (
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("dijagnoza")}</label>
          <textarea rows={2} value={dijagnoza} onChange={(e) => setDijagnoza(e.target.value)}
            placeholder={t("posebna_briga_opis")}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
          <p className="text-xs text-kolo-muted mt-1">{t("posebna_briga_napomena")}</p>
        </div>
      )}

      {type === "SKOLOVANJE" && (
        <div className="space-y-2">
          <input type="text" placeholder={t("ustanova")} value={ustanova} onChange={(e) => setUstanova(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
          <input type="text" placeholder={t("smer")} value={program} onChange={(e) => setProgram(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
          <p className="text-xs text-kolo-muted">{t("skolovanje_napomena")}</p>
        </div>
      )}

      {type === "PODRSKA_MAJKAMA" && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-kolo-muted">{t("deca_naslov")}</p>
          {deca.map((d, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" placeholder={t("dete_ime", { n: i + 1 })} value={d.ime}
                onChange={(e) => setDeca((prev) => prev.map((x, j) => j === i ? { ...x, ime: e.target.value } : x))}
                className="flex-1 px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
              <input type="date" value={d.datumRodjenja}
                onChange={(e) => setDeca((prev) => prev.map((x, j) => j === i ? { ...x, datumRodjenja: e.target.value } : x))}
                className="flex-1 px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
              {deca.length > 1 && (
                <button type="button" onClick={() => setDeca((prev) => prev.filter((_, j) => j !== i))}
                  className="text-kolo-danger hover:text-kolo-danger text-lg leading-none px-1">×</button>
              )}
            </div>
          ))}
          {deca.length < 10 && (
            <button type="button" onClick={() => setDeca((prev) => [...prev, { ime: "", datumRodjenja: "" }])}
              className="text-xs text-kolo-green-700 hover:underline">{t("dodaj_dete")}</button>
          )}
          <p className="text-xs text-kolo-muted">{t("majkama_napomena")}</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">{tc("otkazi")}</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : t("posalji_prijavu")}
        </button>
      </div>
    </div>
  );
}

function EvidencijaForma({ evidencijaToday, onSuccess, onCancel }: {
  evidencijaToday: { id: string; status: string; description: string; amount: number } | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("programi");
  const tc = useTranslations("common");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (evidencijaToday) {
    const evBadge = getEvStatusBadge(evidencijaToday.status, t);
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-kolo-muted">{t("ev_za_danas")}</p>
        <div className="bg-kolo-bg rounded-xl px-4 py-3 text-sm">
          <p className="text-kolo-text">{evidencijaToday.description}</p>
          <div className="flex justify-between mt-2">
            <span className={`text-xs font-medium ${evBadge?.cls ?? ""}`}>{evBadge?.label}</span>
            <span className="text-sm font-semibold text-kolo-text">{evidencijaToday.amount.toLocaleString("sr-RS")} {tc("poen")}</span>
          </div>
        </div>
        <button onClick={onCancel} className="w-full py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">{tc("zatvori")}</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-kolo-green-100 rounded-xl px-4 py-3 text-sm text-kolo-green-700">
        {t("ev_podneta")}
      </div>
    );
  }

  async function handleSubmit() {
    setError("");
    const amt = Number(amount);
    if (!description.trim() || description.trim().length < 10) { setError(t("ev_greska_opis")); return; }
    if (!amt || amt < 100 || amt > 10000) { setError(t("ev_greska_iznos")); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/programi/ped/evidencija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim(), amount: amt }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? tc("greska_ucitavanja")); return; }
      setSuccess(true);
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-kolo-muted">{t("ev_dnevna")}</p>
      <textarea rows={3} placeholder={t("ev_opis_placeholder")} value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      <input type="number" min={100} max={10000} step={100} placeholder={t("ev_iznos_placeholder")}
        value={amount} onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      {error && <p className="text-xs text-kolo-danger">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">{tc("otkazi")}</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : t("ev_posalji")}
        </button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEvStatusBadge(status: string, t: (key: string) => string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING:  { label: t("ev_status_na_cekanju"), cls: "text-kolo-gold-600" },
    APPROVED: { label: t("ev_status_odobreno"),   cls: "text-kolo-info" },
    REJECTED: { label: t("ev_status_odbijeno"),   cls: "text-red-500" },
    EMITTED:  { label: t("ev_status_isplaceno"),  cls: "text-kolo-green-700" },
  };
  return map[status] ?? { label: status, cls: "" };
}

function opisPrograma(type: string, t: (key: string) => string): string {
  const mapa: Record<string, string> = {
    PED:      t("opis_ped"),
    PODRSKA_MAJKAMA:   t("opis_majkama"),
    PODRSKA_STARIJIMA: t("opis_starijima"),
    POSEBNA_BRIGA:     t("opis_posebna_briga"),
    SKOLOVANJE:        t("opis_skolovanje"),
  };
  return mapa[type] ?? "";
}
