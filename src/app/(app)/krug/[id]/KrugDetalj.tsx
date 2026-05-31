"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Projekat {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

interface PendingEnrollmentItem {
  id: string;
  type: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface ClanInfo {
  userId: string;
  pseudonim: string;
  isAdmin: boolean;
  joinedAt: string;
  pendingEnrollments: PendingEnrollmentItem[];
}

interface KrugData {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  balance: number;
  clanovi: ClanInfo[];
  projects: Projekat[];
  pristupnice: { id: string; pseudonim: string; userId: string }[];
}

interface Props {
  krug: KrugData;
  mojeClansvo: { isAdmin: boolean; membershipId: string } | null;
  imaPristupnicu: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}

type Tab = "info" | "clanovi" | "projekti" | "pristupnice" | "programi";

export default function KrugDetalj({ krug, mojeClansvo, imaPristupnicu, isVerified, isAdmin }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("info");
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const canManage = mojeClansvo?.isAdmin || isAdmin;

  async function podnesiPristupnicu() {
    setLoading(true); setPoruka(null);
    const res = await fetch(`/api/krugovi/${krug.id}/pristupnica`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setPoruka({ text: res.ok ? "Pristupnica poslata! Čekajte odobrenje." : (data.error ?? "Greška."), ok: res.ok });
    if (res.ok) setTimeout(() => router.refresh(), 1500);
  }

  async function istupi() {
    if (!confirm("Da li ste sigurni da želite da istupite iz krugovi?")) return;
    setLoading(true);
    const res = await fetch(`/api/krugovi/${krug.id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.push("/krug");
  }

  async function odibriPristupnicu(pristupnicaId: string) {
    const res = await fetch(`/api/admin/krugovi/${krug.id}/pristupnice/${pristupnicaId}/odobri`, { method: "POST" });
    if (res.ok) router.refresh();
    else { const d = await res.json(); alert(d.error); }
  }

  const ukupnoPendingProgrami = krug.clanovi.reduce(
    (s, c) => s + c.pendingEnrollments.length, 0
  );

  const tabs: [Tab, string][] = [
    ["info", "Informacije"],
    ["clanovi", `Članovi (${krug.clanovi.length})`],
    ["projekti", `Projekti (${krug.projects.length})`],
    ...(canManage && krug.pristupnice.length > 0
      ? [["pristupnice", `Pristupnice (${krug.pristupnice.length})`] as [Tab, string]]
      : []),
    ...(canManage && ukupnoPendingProgrami > 0
      ? [["programi", `Programi (${ukupnoPendingProgrami})`] as [Tab, string]]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/krug" className="text-kolo-muted hover:text-kolo-muted text-sm transition-colors">← Krugovi</Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-kolo-text">{krug.name}</h1>
            {krug.location && <p className="text-sm text-kolo-muted mt-0.5">{krug.location}</p>}
            {krug.description && <p className="text-sm text-kolo-muted mt-2">{krug.description}</p>}
          </div>
          <div className="shrink-0 bg-kolo-green-100 rounded-2xl px-4 py-3 text-center">
            <p className="text-xl font-bold text-kolo-green-700">{krug.balance.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-kolo-green-700">POEN</p>
          </div>
        </div>

        {/* Akcije */}
        <div className="mt-4 pt-4 border-t border-kolo-border flex gap-2 flex-wrap">
          {!mojeClansvo && !imaPristupnicu && isVerified && (
            <button onClick={podnesiPristupnicu} disabled={loading}
              className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors disabled:opacity-60">
              {loading ? "..." : "Podnesi pristupnicu"}
            </button>
          )}
          {imaPristupnicu && (
            <span className="px-4 py-2 bg-kolo-gold-100 text-kolo-gold-600 text-sm font-medium rounded-xl border border-kolo-gold-100">
              Pristupnica na čekanju
            </span>
          )}
          {mojeClansvo && (
            <>
              <span className="px-4 py-2 bg-kolo-green-100 text-kolo-green-700 text-sm font-medium rounded-xl border border-kolo-green-100">
                {mojeClansvo.isAdmin ? "Admin krugovi" : "Član krugovi"}
              </span>
              <button onClick={istupi} disabled={loading}
                className="px-4 py-2 border border-kolo-danger/20 text-kolo-danger text-sm font-semibold rounded-xl hover:bg-kolo-danger-light transition-colors disabled:opacity-60">
                Istupi
              </button>
            </>
          )}
        </div>
        {poruka && (
          <p className={`mt-3 text-sm px-3 py-2 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
            {poruka.text}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-kolo-border">
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-kolo-green-700 text-kolo-green-700" : "border-transparent text-kolo-muted hover:text-kolo-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Informacije */}
      {tab === "info" && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-kolo-muted">Broj članova</span>
            <span className="font-medium text-kolo-text">{krug.clanovi.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">Stanje novčanika</span>
            <span className="font-bold text-kolo-green-700">{krug.balance.toLocaleString("sr-RS")} POEN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">Aktivnih projekata</span>
            <span className="font-medium text-kolo-text">{krug.projects.length}</span>
          </div>
        </div>
      )}

      {/* Članovi */}
      {tab === "clanovi" && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          {krug.clanovi.map((c, i) => (
            <div key={c.userId} className={`px-5 py-3 flex justify-between items-center ${i < krug.clanovi.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <Link href={`/profil/${c.userId}`} className="text-sm font-medium text-kolo-green-700 hover:underline">
                {c.pseudonim}
              </Link>
              <div className="flex items-center gap-2">
                {c.isAdmin && <span className="text-xs bg-kolo-green-100 text-kolo-green-700 px-2 py-0.5 rounded font-medium">Admin</span>}
                <span className="text-xs text-kolo-muted">{new Date(c.joinedAt).toLocaleDateString("sr-RS")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projekti */}
      {tab === "projekti" && (
        <div className="space-y-3">
          {canManage && <NoviProjekatForma krugId={krug.id} onSuccess={() => router.refresh()} />}
          {krug.projects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
              Nema aktivnih projekata.
            </div>
          ) : (
            krug.projects.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-kolo-border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-kolo-text text-sm">{p.title}</p>
                    {p.description && <p className="text-xs text-kolo-muted mt-1">{p.description}</p>}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.type === "PRIKUPLJANJE" ? "bg-kolo-info-light text-kolo-info" : "bg-purple-50 text-purple-700"}`}>
                    {p.type === "PRIKUPLJANJE" ? "Prikupljanje" : "Redistribucija"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pristupnice (admin) */}
      {tab === "pristupnice" && canManage && (
        <div className="space-y-3">
          {krug.pristupnice.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex justify-between items-center">
              <span className="text-sm font-medium text-kolo-text">{p.pseudonim}</span>
              <button onClick={() => odibriPristupnicu(p.id)}
                className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
                Odobri
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Programi — pending enrollments i evidencije članova (admin) */}
      {tab === "programi" && canManage && (
        <ProgramiAdminTab krugId={krug.id} clanovi={krug.clanovi} onDone={() => router.refresh()} />
      )}
    </div>
  );
}

// ── Programi admin tab ────────────────────────────────────────────────────────

const labelPrograma: Record<string, string> = {
  PED:      "Evidencija doprinosa",
  PODRSKA_MAJKAMA:   "Podrška majkama",
  PODRSKA_STARIJIMA: "Podrška starijima",
  POSEBNA_BRIGA:     "Posebna briga",
  SKOLOVANJE:        "Školovanje",
};

function ProgramiAdminTab({ krugId, clanovi, onDone }: { krugId: string; clanovi: ClanInfo[]; onDone: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [poruke, setPoruke] = useState<Record<string, { text: string; ok: boolean }>>({});

  async function odobriEnrollment(krugId: string, enrollmentId: string, dailyAmount?: number, razlog?: string, odbij = false) {
    setLoading(enrollmentId);
    const res = await fetch(`/api/krugovi/${krugId}/programi/enrollments/${enrollmentId}/${odbij ? "odbij" : "odobri"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(odbij ? { razlog } : { dailyAmount }),
    });
    const data = await res.json();
    setLoading(null);
    setPoruke((prev) => ({ ...prev, [enrollmentId]: { text: res.ok ? (odbij ? "Odbijeno." : "Odobreno.") : (data.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1200);
  }

  const svePending = clanovi.flatMap((c) =>
    c.pendingEnrollments.map((e) => ({ tip: "enrollment" as const, pseudonim: c.pseudonim, ...e }))
  );

  if (svePending.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
        Nema zahteva koji čekaju odobrenje.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Enrollment zahtevi */}
      {svePending.map((item) => {
        const poruka = poruke[item.id];
        return (
          <EnrollmentKartica
            key={item.id}
            id={item.id}
            pseudonim={item.pseudonim}
            type={item.type}
            metadata={item.metadata}
            createdAt={item.createdAt}
            loading={loading === item.id}
            poruka={poruka ?? null}
            onOdobri={(dailyAmount) => odobriEnrollment(krugId, item.id, dailyAmount)}
            onOdbij={(razlog) => odobriEnrollment(krugId, item.id, undefined, razlog, true)}
          />
        );
      })}
    </div>
  );
}

function EnrollmentKartica({ id, pseudonim, type, metadata, createdAt, loading, poruka, onOdobri, onOdbij }: {
  id: string;
  pseudonim: string;
  type: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  loading: boolean;
  poruka: { text: string; ok: boolean } | null;
  onOdobri: (dailyAmount?: number) => void;
  onOdbij: (razlog: string) => void;
}) {
  const [dailyAmount, setDailyAmount] = useState("");
  const [razlog, setRazlog] = useState("");
  const [showOdbij, setShowOdbij] = useState(false);

  const trebaIznos = type === "PED" || type === "SKOLOVANJE";

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-kolo-text">{pseudonim}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{labelPrograma[type] ?? type} · {new Date(createdAt).toLocaleDateString("sr-RS")}</p>
        </div>
        <span className="text-xs bg-kolo-gold-100 text-kolo-gold-600 px-2 py-0.5 rounded border border-kolo-gold-100">Na čekanju</span>
      </div>

      {metadata && Object.keys(metadata).length > 0 && (
        <div className="bg-kolo-bg rounded-xl px-3 py-2 text-xs text-kolo-muted space-y-1">
          {Object.entries(metadata).map(([k, v]) => (
            <div key={k}><span className="text-kolo-muted">{k}:</span> {String(v)}</div>
          ))}
        </div>
      )}

      {trebaIznos && !showOdbij && (
        <input
          type="number"
          placeholder="Dnevni iznos POEN (opciono)"
          value={dailyAmount}
          onChange={(e) => setDailyAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
        />
      )}

      {!showOdbij && (
        <div className="flex gap-2">
          <button onClick={() => setShowOdbij(true)} disabled={loading}
            className="flex-1 py-2 rounded-xl border border-kolo-danger/20 text-kolo-danger text-sm font-medium hover:bg-kolo-danger-light disabled:opacity-60">
            Odbij
          </button>
          <button onClick={() => onOdobri(dailyAmount ? Number(dailyAmount) : undefined)} disabled={loading}
            className="flex-1 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 disabled:opacity-60">
            {loading ? "..." : "Odobri"}
          </button>
        </div>
      )}

      {showOdbij && (
        <div className="space-y-2">
          <textarea rows={2} placeholder="Razlog odbijanja *" value={razlog} onChange={(e) => setRazlog(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-red-400 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => setShowOdbij(false)} className="flex-1 py-2 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">Odustani</button>
            <button onClick={() => onOdbij(razlog)} disabled={!razlog.trim() || loading}
              className="flex-1 py-2 rounded-xl bg-kolo-danger text-white text-sm font-semibold hover:bg-kolo-danger disabled:opacity-60">
              {loading ? "..." : "Potvrdi odbijanje"}
            </button>
          </div>
        </div>
      )}

      {poruka && (
        <p className={`text-xs px-3 py-1.5 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
          {poruka.text}
        </p>
      )}
    </div>
  );
}

// ── Mini forma za novi projekat ────────────────────────────────────────────────

function NoviProjekatForma({ krugId, onSuccess }: { krugId: string; onSuccess: () => void }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"PRIKUPLJANJE" | "REDISTRIBUCIJA">("PRIKUPLJANJE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) { setError("Naziv mora imati najmanje 3 karaktera."); return; }
    setLoading(true);
    const res = await fetch(`/api/krugovi/${krugId}/projekti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim(), type }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Greška."); return; }
    setTitle(""); setDescription(""); setShow(false); setError("");
    onSuccess();
  }

  if (!show) {
    return (
      <button onClick={() => setShow(true)}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-kolo-border text-sm text-kolo-muted hover:border-kolo-green-500 hover:text-kolo-green-700 transition-colors">
        + Novi projekat
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-kolo-border p-4 space-y-3">
      <p className="text-sm font-semibold text-kolo-muted">Novi projekat</p>
      <input type="text" placeholder="Naziv *" value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      <textarea rows={2} placeholder="Opis" value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      <div className="flex gap-2">
        {(["PRIKUPLJANJE", "REDISTRIBUCIJA"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${type === t ? "bg-kolo-green-700 text-white" : "bg-white border border-kolo-border text-kolo-muted"}`}>
            {t === "PRIKUPLJANJE" ? "Prikupljanje" : "Redistribucija"}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-kolo-danger">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => setShow(false)}
          className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">Otkaži</button>
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : "Kreiraj"}
        </button>
      </div>
    </form>
  );
}
