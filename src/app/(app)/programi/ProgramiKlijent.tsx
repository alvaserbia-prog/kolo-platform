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

interface Props {
  programi: ProgramInfo[];
  isVerified: boolean;
  isZadrugar: boolean;
  evidencijaToday: EvidencijaInfo | null;
  poslednjeEvidencije: EvidencijaInfo[];
}

const statusBadge: Record<EnrollmentStatus, { label: string; cls: string }> = {
  PENDING:  { label: "Na čekanju",  cls: "bg-amber-50 text-amber-700 border-amber-200" },
  ACTIVE:   { label: "Aktivan",     cls: "bg-green-50 text-green-700 border-green-200" },
  INACTIVE: { label: "Neaktivan",   cls: "bg-gray-100 text-gray-500 border-gray-200" },
  REJECTED: { label: "Odbijen",     cls: "bg-red-50 text-red-600 border-red-200" },
};


export default function ProgramiKlijent({ programi, isVerified, isZadrugar, evidencijaToday, poslednjeEvidencije }: Props) {
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Programi Banke</h1>
        {totalOcekivano > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-center">
            <p className="text-sm font-bold text-green-700">{totalOcekivano.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-green-600">POEN/dan</p>
          </div>
        )}
      </div>

      {!isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Istorija — Zapošljavanje</h3>
          </div>
          {poslednjeEvidencije.map((e, i) => (
            <div key={e.id} className={`px-5 py-3 flex justify-between items-center ${i < poslednjeEvidencije.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div>
                <p className="text-sm text-gray-800">{new Date(e.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{e.description}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-semibold text-gray-900">{e.amount.toLocaleString("sr-RS")} P</p>
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
  p, isVerified, isZadrugar, loading, poruka, expanded, onExpand, onPrijavi, evidencijaToday, onEvidencijaSuccess,
}: {
  p: ProgramInfo;
  isVerified: boolean;
  isZadrugar: boolean;
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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900">{p.label}</p>
            {!p.programAktivan && (
              <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded">Neaktivan</span>
            )}
            {enStatus && (
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${statusBadge[enStatus].cls}`}>
                {statusBadge[enStatus].label}
              </span>
            )}
          </div>
          {enStatus === "ACTIVE" && p.enrollment!.ocekivaniDnevni > 0 && (
            <p className="text-sm text-green-700 font-medium mt-1">
              {p.enrollment!.ocekivaniDnevni.toLocaleString("sr-RS")} POEN/dan
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{opisPrograma(p.type)}</p>
        </div>

        {/* Akcija dugme */}
        <div className="ml-4 shrink-0">
          {!enStatus && mozePrijaviti && (
            <button onClick={onExpand}
              className="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-xl hover:bg-green-800 transition-colors">
              Prijavi se
            </button>
          )}
          {enStatus === "ACTIVE" && p.type === "ZAPOSLJAVNJE" && (
            <button onClick={onExpand}
              className="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-xl hover:bg-green-800 transition-colors">
              Evidencija
            </button>
          )}
          {enStatus === "REJECTED" && mozePrijaviti && (
            <button onClick={onExpand}
              className="px-3 py-1.5 border border-green-600 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-50 transition-colors">
              Pokušaj ponovo
            </button>
          )}
        </div>
      </div>

      {/* Expanded — forma za prijavu ili evidencija */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4">
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
            <p className={`mt-3 text-sm px-4 py-2 rounded-xl ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {poruka.text}
            </p>
          )}
        </div>
      )}

      {enStatus === "REJECTED" && p.enrollment?.rejectionReason && !expanded && (
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-red-500">
          Razlog odbijanja: {p.enrollment.rejectionReason}
        </div>
      )}
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
        <p className="text-sm text-gray-600">
          Bićete prijavani na program Zapošljavanje. Svaki dan unosite evidenciju aktivnosti koji admin odobrava.
        </p>
      )}

      {type === "PODRSKA_STARIJIMA" && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Datum rođenja</label>
          <input type="date" value={datumRodjenja} onChange={(e) => setDatumRodjenja(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
          <p className="text-xs text-gray-400 mt-1">Potrebno 50+ godina.</p>
        </div>
      )}

      {type === "POSEBNA_BRIGA" && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Dijagnoza / opis stanja</label>
          <textarea rows={2} value={dijagnoza} onChange={(e) => setDijagnoza(e.target.value)}
            placeholder="Ukratko opišite stanje..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 resize-none" />
          <p className="text-xs text-gray-400 mt-1">Admin proverava medicinsku dokumentaciju. Bazni iznos: 2.000 POEN/dan.</p>
        </div>
      )}

      {type === "SKOLOVANJE" && (
        <div className="space-y-2">
          <input type="text" placeholder="Ustanova *" value={ustanova} onChange={(e) => setUstanova(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
          <input type="text" placeholder="Program / smer *" value={program} onChange={(e) => setProgram(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
          <p className="text-xs text-gray-400">Admin postavlja dnevni iznos. Reverifikacija svakih 6 meseci.</p>
        </div>
      )}

      {type === "PODRSKA_MAJKAMA" && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600">Deca (datum rođenja)</p>
          {deca.map((d, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" placeholder={`Ime deteta ${i + 1}`} value={d.ime}
                onChange={(e) => setDeca((prev) => prev.map((x, j) => j === i ? { ...x, ime: e.target.value } : x))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
              <input type="date" value={d.datumRodjenja}
                onChange={(e) => setDeca((prev) => prev.map((x, j) => j === i ? { ...x, datumRodjenja: e.target.value } : x))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
              {deca.length > 1 && (
                <button type="button" onClick={() => setDeca((prev) => prev.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 text-lg leading-none px-1">×</button>
              )}
            </div>
          ))}
          {deca.length < 10 && (
            <button type="button" onClick={() => setDeca((prev) => [...prev, { ime: "", datumRodjenja: "" }])}
              className="text-xs text-green-700 hover:underline">+ Dodaj dete</button>
          )}
          <p className="text-xs text-gray-400">Bazni iznos: 2.000 POEN/dan po detetu. Koeficijenti rastu sa brojem dece.</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium">Otkaži</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold disabled:opacity-60">
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
        <p className="text-sm font-semibold text-gray-700">Evidencija za danas</p>
        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm">
          <p className="text-gray-800">{evidencijaToday.description}</p>
          <div className="flex justify-between mt-2">
            <span className={`text-xs font-medium ${evBadge?.cls ?? ""}`}>{evBadge?.label}</span>
            <span className="text-sm font-semibold text-gray-900">{evidencijaToday.amount.toLocaleString("sr-RS")} POEN</span>
          </div>
        </div>
        <button onClick={onCancel} className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium">Zatvori</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 rounded-xl px-4 py-3 text-sm text-green-700">
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
      <p className="text-sm font-semibold text-gray-700">Dnevna evidencija</p>
      <textarea rows={3} placeholder="Opišite aktivnosti od danas (min. 10 karaktera)..." value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 resize-none" />
      <input type="number" min={100} max={10000} step={100} placeholder="Traženi iznos POEN (100–10.000)"
        value={amount} onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium">Otkaži</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : "Pošalji"}
        </button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const evStatusBadge: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "Na čekanju",  cls: "text-amber-600" },
  APPROVED: { label: "Odobreno",    cls: "text-blue-600" },
  REJECTED: { label: "Odbijeno",    cls: "text-red-500" },
  EMITTED:  { label: "Isplaćeno",   cls: "text-green-600" },
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
