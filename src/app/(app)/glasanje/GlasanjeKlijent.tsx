"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Predlog {
  id: string;
  title: string;
  description: string;
  authorPseudonim: string;
  deadline: string;
  status: "ACTIVE" | "CLOSED";
  zaGlasova: number;
  protiGlasova: number;
  mojGlas: boolean | null;
  createdAt: string;
}

interface Props {
  predlozi: Predlog[];
  mojaGlasackaMoc: number;
}

export default function GlasanjeKlijent({ predlozi, mojaGlasackaMoc }: Props) {
  const router = useRouter();
  const [showNovi, setShowNovi] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-kolo-text">Glasanje</h1>
        <div className="flex items-center gap-3">
          {mojaGlasackaMoc > 0 && (
            <span className="text-xs bg-kolo-gold-100 text-kolo-gold-600 border border-kolo-gold-400/30 px-3 py-1.5 rounded-xl font-medium">
              {mojaGlasackaMoc} glasova
            </span>
          )}
          {mojaGlasackaMoc > 0 && (
            <button onClick={() => setShowNovi((v) => !v)}
              className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
              + Novi predlog
            </button>
          )}
        </div>
      </div>

      {mojaGlasackaMoc === 0 && (
        <div className="box-warning text-sm">
          Za glasanje i kreiranje predloga potrebno je imati aktivnih ZRNA.{" "}
          <Link href="/zrno" className="underline font-medium">Idite na ZRNO →</Link>
        </div>
      )}

      {showNovi && (
        <NoviPredlogForma onSuccess={() => { setShowNovi(false); router.refresh(); }} onCancel={() => setShowNovi(false)} />
      )}

      {predlozi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          Nema predloga za glasanje.
        </div>
      ) : (
        <div className="space-y-3">
          {predlozi.map((p) => (
            <PredlogKartica key={p.id} p={p} mojaGlasackaMoc={mojaGlasackaMoc} onRefresh={() => router.refresh()} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Kartica predloga ──────────────────────────────────────────────────────────

function PredlogKartica({ p, mojaGlasackaMoc, onRefresh }: { p: Predlog; mojaGlasackaMoc: number; onRefresh: () => void }) {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [poruka, setPoruka] = useState<string | null>(null);

  const ukupno = p.zaGlasova + p.protiGlasova;
  const zaProc = ukupno > 0 ? Math.round((p.zaGlasova / ukupno) * 100) : 0;
  const isActive = p.status === "ACTIVE" && new Date(p.deadline) > new Date();

  async function glasaj(za: boolean) {
    setLoading(za); setPoruka(null);
    const res = await fetch(`/api/glasanje/${p.id}/glasaj`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ za }),
    });
    const data = await res.json();
    setLoading(null);
    if (res.ok) { onRefresh(); }
    else { setPoruka(data.error ?? "Greška."); }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-kolo-text">{p.title}</p>
          <p className="text-xs text-kolo-muted mt-0.5">
            {p.authorPseudonim} · {new Date(p.createdAt).toLocaleDateString("sr-RS")}
          </p>
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${isActive ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"}`}>
          {isActive ? "Aktivno" : "Zatvoreno"}
        </span>
      </div>

      <p className="text-sm text-kolo-muted line-clamp-2">{p.description}</p>

      {/* Rezultati */}
      {ukupno > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-kolo-muted">
            <span>ZA: {p.zaGlasova} glasova ({zaProc}%)</span>
            <span>PROTIV: {p.protiGlasova} glasova</span>
          </div>
          <div className="h-2 bg-kolo-bg rounded-full overflow-hidden">
            <div className="h-full bg-kolo-green-1000 rounded-full transition-all" style={{ width: `${zaProc}%` }} />
          </div>
        </div>
      )}

      {/* Moj glas */}
      {p.mojGlas !== null && (
        <p className="text-xs text-kolo-gold-600 font-medium">
          Glasali ste: {p.mojGlas ? "ZA" : "PROTIV"} ({mojaGlasackaMoc} glasova)
        </p>
      )}

      {/* Akcije */}
      {isActive && mojaGlasackaMoc > 0 && (
        <div className="flex gap-2">
          <button onClick={() => glasaj(true)} disabled={loading !== null}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${p.mojGlas === true ? "bg-kolo-green-500 text-white" : "border border-kolo-green-500 text-kolo-green-700 hover:bg-kolo-green-100"}`}>
            {loading === true ? "..." : "ZA"}
          </button>
          <button onClick={() => glasaj(false)} disabled={loading !== null}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${p.mojGlas === false ? "bg-kolo-danger text-white" : "border border-kolo-danger/30 text-kolo-danger hover:bg-kolo-danger-light"}`}>
            {loading === false ? "..." : "PROTIV"}
          </button>
        </div>
      )}

      {isActive && (
        <p className="text-xs text-kolo-muted">Rok: {new Date(p.deadline).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</p>
      )}

      {poruka && <p className="text-xs text-kolo-danger">{poruka}</p>}
    </div>
  );
}

// ── Nova predlog forma ────────────────────────────────────────────────────────

function NoviPredlogForma({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (title.trim().length < 5) { setError("Naslov mora imati najmanje 5 karaktera."); return; }
    if (description.trim().length < 20) { setError("Opis mora imati najmanje 20 karaktera."); return; }
    if (!deadline) { setError("Unesite rok glasanja."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/glasanje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), deadline }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  // Min deadline = tomorrow
  const sutra = new Date();
  sutra.setDate(sutra.getDate() + 1);
  const minDate = sutra.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <p className="text-sm font-semibold text-kolo-muted">Novi predlog</p>
      <input type="text" placeholder="Naslov *" value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
      <textarea rows={3} placeholder="Opis predloga (min 20 karaktera) *" value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 resize-none" />
      <div>
        <label className="block text-xs text-kolo-muted mb-1">Rok glasanja *</label>
        <input type="date" min={minDate} value={deadline} onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
      </div>
      {error && <p className="text-xs text-kolo-danger">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">Otkaži</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 disabled:opacity-60 transition-colors">
          {loading ? "..." : "Objavi predlog"}
        </button>
      </div>
    </div>
  );
}
