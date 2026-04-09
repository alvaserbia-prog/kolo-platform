"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  isZadrugar: boolean;
  bankaBalance: number;
  emisioniKontekst: EmisioniKontekst;
  evidencijaToday: EvidencijaInfo | null;
  poslednjeEvidencije: EvidencijaInfo[];
}

const statusBadge: Record<EnrollmentStatus, { label: string; cls: string }> = {
  PENDING:  { label: "Na čekanju",  cls: "bg-kolo-gold-100 text-kolo-gold-600 border-kolo-gold-100" },
  ACTIVE:   { label: "Aktivan",     cls: "bg-kolo-green-100 text-kolo-green-700 border-kolo-green-100" },
  INACTIVE: { label: "Neaktivan",   cls: "bg-kolo-bg text-kolo-muted border-kolo-border" },
  REJECTED: { label: "Odbijen",     cls: "bg-kolo-danger-light text-kolo-danger border-kolo-danger/20" },
};


export default function ProgramiKlijent({ programi, isVerified, isZadrugar, bankaBalance, emisioniKontekst, evidencijaToday, poslednjeEvidencije }: Props) {
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
    setPoruka({ text: res.ok ? "Prijava podneta. Čekajte odobrenje." : (data.error ?? "Greška."), ok: res.ok, for: type });
    if (res.ok) { setActiveProgram(null); setTimeout(() => router.refresh(), 1200); }
  }

  const { opticaj, dnevniLimit, emitovanoAm, zahtevanoAm } = emisioniKontekst;
  const emitovanoPct = dnevniLimit > 0 && emitovanoAm !== null ? Math.min(100, Math.round((emitovanoAm / dnevniLimit) * 100)) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-kolo-text">Programi Banke</h1>
        {totalOcekivano > 0 && (
          <div className="bg-kolo-green-100 border border-kolo-green-100 rounded-xl px-4 py-2 text-center">
            <p className="text-sm font-bold text-kolo-green-700">{totalOcekivano.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-green-700">POEN/dan</p>
          </div>
        )}
      </div>

      {/* Emisioni kontekst */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
        <p className="text-xs font-semibold text-kolo-muted uppercase tracking-wider">Emisioni kontekst — danas</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-base font-bold text-kolo-text">{opticaj.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted mt-0.5">Opticaj (POEN)</p>
          </div>
          <div>
            <p className="text-base font-bold text-kolo-text">{dnevniLimit.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-muted mt-0.5">Dnevni limit (10%)</p>
          </div>
          <div>
            <p className={`text-base font-bold ${emitovanoAm !== null && emitovanoAm > 0 ? "text-kolo-green-700" : "text-kolo-muted"}`}>
              {emitovanoAm !== null ? emitovanoAm.toLocaleString("sr-RS") : "—"}
            </p>
            <p className="text-xs text-kolo-muted mt-0.5">Emitovano danas</p>
          </div>
        </div>
        {dnevniLimit > 0 && (
          <div>
            <div className="flex justify-between text-xs text-kolo-muted mb-1">
              <span>Iskorišćenost limita</span>
              <span>{emitovanoPct}%{zahtevanoAm !== null && zahtevanoAm > dnevniLimit ? " — limit dostignut" : ""}</span>
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
          Za prijavu na programe potrebna je verifikacija identiteta.
        </div>
      )}

      <div className="space-y-3">
        {programi.map((p) => (
          <ProgramKartica
            key={p.type}
            p={p}
            isVerified={isVerified}
            isZadrugar={isZadrugar}
            bankaBalance={bankaBalance}
            loading={loading}
            poruka={poruka?.for === p.type ? poruka : null}
            expanded={activeProgram === p.type}
            onExpand={() => setActiveProgram(activeProgram === p.type ? null : p.type)}
            onPrijavi={(meta) => prijavi(p.type, meta)}
            evidencijaToday={p.type === "ZAPOSLJAVNJE" ? evidencijaToday : null}
            onEvidencijaSuccess={() => { setTimeout(() => router.refresh(), 1200); }}
          />
        ))}
      </div>

      {/* Istorija evidencija */}
      {poslednjeEvidencije.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-3 border-b border-kolo-border">
            <h3 className="text-sm font-semibold text-kolo-muted">Istorija — Zapošljavanje</h3>
          </div>
          {poslednjeEvidencije.map((e, i) => (
            <div key={e.id} className={`px-5 py-3 flex justify-between items-center ${i < poslednjeEvidencije.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <div>
                <p className="text-sm text-kolo-text">{new Date(e.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</p>
                <p className="text-xs text-kolo-muted mt-0.5 line-clamp-1">{e.description}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-semibold text-kolo-text">{e.amount.toLocaleString("sr-RS")} P</p>
                <p className={`text-xs font-medium ${evStatusBadge[e.status].cls}`}>{evStatusBadge[e.status].label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Kartica programa ───────────────────────────────────────────────────────────

function ProgramKartica({
  p, isVerified, isZadrugar, bankaBalance, loading, poruka, expanded, onExpand, onPrijavi, evidencijaToday, onEvidencijaSuccess,
}: {
  p: ProgramInfo;
  isVerified: boolean;
  isZadrugar: boolean;
  bankaBalance: number;
  loading: boolean;
  poruka: { text: string; ok: boolean } | null;
  expanded: boolean;
  onExpand: () => void;
  onPrijavi: (meta?: Record<string, unknown>) => void;
  evidencijaToday: { id: string; status: string; description: string; amount: number } | null;
  onEvidencijaSuccess: () => void;
}) {
  const enStatus = p.enrollment?.status;
  const [router] = [useRouter()];

  const zadrugarskaProvera = ["PODRSKA_MAJKAMA", "PODRSKA_STARIJIMA", "POSEBNA_BRIGA", "SKOLOVANJE"];
  const zahtevaDrugarstvo = zadrugarskaProvera.includes(p.type);
  const mozePrijaviti = isVerified && (!zahtevaDrugarstvo || isZadrugar) && p.programAktivan;

  return (
    <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
      <div className="px-5 py-4 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-kolo-text">{p.label}</p>
            {!p.programAktivan && (
              <span className="text-xs bg-kolo-bg text-kolo-muted px-2 py-0.5 rounded">Neaktivan</span>
            )}
            {enStatus && (
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${statusBadge[enStatus].cls}`}>
                {statusBadge[enStatus].label}
              </span>
            )}
          </div>
          {enStatus === "ACTIVE" && p.enrollment!.ocekivaniDnevni > 0 && (
            <p className="text-sm text-kolo-green-700 font-medium mt-1">
              {p.enrollment!.ocekivaniDnevni.toLocaleString("sr-RS")} POEN/dan
            </p>
          )}
          <p className="text-xs text-kolo-muted mt-0.5">{opisPrograma(p.type)}</p>
        </div>

        {/* Akcija dugme */}
        <div className="ml-4 shrink-0">
          {!enStatus && mozePrijaviti && (
            <button onClick={onExpand}
              className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
              Prijavi se
            </button>
          )}
          {enStatus === "ACTIVE" && p.type === "ZAPOSLJAVNJE" && (
            <button onClick={onExpand}
              className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
              Evidencija
            </button>
          )}
          {enStatus === "REJECTED" && mozePrijaviti && (
            <button onClick={onExpand}
              className="px-3 py-1.5 border border-kolo-green-500 text-kolo-green-700 text-xs font-semibold rounded-xl hover:bg-kolo-green-100 transition-colors">
              Pokušaj ponovo
            </button>
          )}
        </div>
      </div>

      {/* Expanded — forma za prijavu ili evidencija */}
      {expanded && (
        <div className="border-t border-kolo-border px-5 py-4">
          {enStatus === "ACTIVE" && p.type === "ZAPOSLJAVNJE" ? (
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
          Razlog odbijanja: {p.enrollment.rejectionReason}
        </div>
      )}

      {/* Progress indikatori za zaključane faze */}
      {!p.programAktivan && !enStatus && p.type === "POSEBNA_BRIGA" && (() => {
        const PRAG = 1_000_000;
        const opticaj = Math.abs(bankaBalance);
        const pct = Math.min(100, Math.round((opticaj / PRAG) * 100));
        return (
          <div className="border-t border-kolo-border px-5 py-3">
            <div className="flex justify-between text-xs text-kolo-muted mb-1">
              <span>Banka dostiže prag od 1M POEN opticaja</span>
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
            Program se aktivira odlukom UO — prati glasanje na{" "}
            <span className="text-kolo-muted font-medium">/glasanje</span>
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
  const [datumRodjenja, setDatumRodjenja] = useState("");
  const [dijagnoza, setDijagnoza] = useState("");
  const [ustanova, setUstanova] = useState("");
  const [program, setProgram] = useState("");
  const [deca, setDeca] = useState<{ ime: string; datumRodjenja: string }[]>([{ ime: "", datumRodjenja: "" }]);

  function handleSubmit() {
    if (type === "ZAPOSLJAVNJE") { onSubmit(); return; }
    if (type === "PODRSKA_STARIJIMA") { onSubmit({ datumRodjenja }); return; }
    if (type === "POSEBNA_BRIGA") { onSubmit({ dijagnoza }); return; }
    if (type === "SKOLOVANJE") { onSubmit({ ustanova, program }); return; }
    if (type === "PODRSKA_MAJKAMA") { onSubmit({ deca: deca.filter(d => d.ime && d.datumRodjenja) }); return; }
  }

  return (
    <div className="space-y-3">
      {type === "ZAPOSLJAVNJE" && (
        <p className="text-sm text-kolo-muted">
          Bićete prijavani na program Zapošljavanje. Svaki dan unosite evidenciju aktivnosti koji admin odobrava.
        </p>
      )}

      {type === "PODRSKA_STARIJIMA" && (
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Datum rođenja</label>
          <input type="date" value={datumRodjenja} onChange={(e) => setDatumRodjenja(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
          <p className="text-xs text-kolo-muted mt-1">Potrebno 50+ godina.</p>
        </div>
      )}

      {type === "POSEBNA_BRIGA" && (
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Dijagnoza / opis stanja</label>
          <textarea rows={2} value={dijagnoza} onChange={(e) => setDijagnoza(e.target.value)}
            placeholder="Ukratko opišite stanje..."
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
          <p className="text-xs text-kolo-muted mt-1">Admin proverava medicinsku dokumentaciju. Bazni iznos: 2.000 POEN/dan.</p>
        </div>
      )}

      {type === "SKOLOVANJE" && (
        <div className="space-y-2">
          <input type="text" placeholder="Ustanova *" value={ustanova} onChange={(e) => setUstanova(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
          <input type="text" placeholder="Program / smer *" value={program} onChange={(e) => setProgram(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
          <p className="text-xs text-kolo-muted">Admin postavlja dnevni iznos. Reverifikacija svakih 6 meseci.</p>
        </div>
      )}

      {type === "PODRSKA_MAJKAMA" && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-kolo-muted">Deca (datum rođenja)</p>
          {deca.map((d, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" placeholder={`Ime deteta ${i + 1}`} value={d.ime}
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
              className="text-xs text-kolo-green-700 hover:underline">+ Dodaj dete</button>
          )}
          <p className="text-xs text-kolo-muted">Bazni iznos: 2.000 POEN/dan po detetu. Koeficijenti rastu sa brojem dece.</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">Otkaži</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : "Pošalji prijavu"}
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
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (evidencijaToday) {
    const evBadge = evStatusBadge[evidencijaToday.status as keyof typeof evStatusBadge];
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-kolo-muted">Evidencija za danas</p>
        <div className="bg-kolo-bg rounded-xl px-4 py-3 text-sm">
          <p className="text-kolo-text">{evidencijaToday.description}</p>
          <div className="flex justify-between mt-2">
            <span className={`text-xs font-medium ${evBadge?.cls ?? ""}`}>{evBadge?.label}</span>
            <span className="text-sm font-semibold text-kolo-text">{evidencijaToday.amount.toLocaleString("sr-RS")} POEN</span>
          </div>
        </div>
        <button onClick={onCancel} className="w-full py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">Zatvori</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-kolo-green-100 rounded-xl px-4 py-3 text-sm text-kolo-green-700">
        Evidencija podneta. Admin pregleda zahtev.
      </div>
    );
  }

  async function handleSubmit() {
    setError("");
    const amt = Number(amount);
    if (!description.trim() || description.trim().length < 10) { setError("Opis mora imati najmanje 10 karaktera."); return; }
    if (!amt || amt < 100 || amt > 10000) { setError("Iznos mora biti između 100 i 10.000."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/programi/zaposljavnje/evidencija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim(), amount: amt }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      setSuccess(true);
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-kolo-muted">Dnevna evidencija</p>
      <textarea rows={3} placeholder="Opišite aktivnosti od danas (min. 10 karaktera)..." value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      <input type="number" min={100} max={10000} step={100} placeholder="Traženi iznos POEN (100–10.000)"
        value={amount} onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      {error && <p className="text-xs text-kolo-danger">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">Otkaži</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : "Pošalji"}
        </button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const evStatusBadge: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "Na čekanju",  cls: "text-kolo-gold-600" },
  APPROVED: { label: "Odobreno",    cls: "text-kolo-info" },
  REJECTED: { label: "Odbijeno",    cls: "text-red-500" },
  EMITTED:  { label: "Isplaćeno",   cls: "text-kolo-green-700" },
};

function opisPrograma(type: string): string {
  const mapa: Record<string, string> = {
    ZAPOSLJAVNJE:       "Dnevna evidencija radnih aktivnosti · admin odobrava",
    PODRSKA_MAJKAMA:    "2.000 POEN/dan po detetu · koeficijenti rastu s brojem dece · trajanje 20 god.",
    PODRSKA_STARIJIMA:  "1.000 + 100 × (godine − 50) POEN/dan · dostupno zadrugarsima 50+",
    POSEBNA_BRIGA:      "2.000 POEN/dan · invaliditet ili hronična bolest · verifikacija dokumentacijom",
    SKOLOVANJE:         "Iznos postavlja admin · reverifikacija svakih 6 meseci",
  };
  return mapa[type] ?? "";
}
