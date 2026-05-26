"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OsnivaciTab from "./OsnivaciTab";
import PokroviteljPrijaveTab from "./PokroviteljPrijaveTab";

interface KorisnikInfo {
  id: string;
  pseudonim: string;
  email: string | null;
  role: string;
  verified: boolean;
  status: string;
  suspendedReason: string | null;
  balance: number;
  createdAt: string;
}

interface DashboardData {
  korisnici: { ukupno: number; verifikovanih: number; suspendovanih: number };
  krugovi: { ukupno: number; krugra: number };
  finansije: { opticaj: number; protokolBalance: number };
  zrno: { kodKorisnika: number; uProtokolu: number; ukupno: number };
  ukupnoTransakcija: number;
}

interface AuditLogEntry {
  id: string;
  adminPseudonim: string;
  akcija: string;
  targetId: string | null;
  detalji: string | null;
  createdAt: string;
}

interface KrugListItem {
  id: string;
  name: string;
  location: string | null;
  status: string;
  balance: number;
  clanovi: number;
  projekti: number;
  createdAt: string;
}

interface PendingKrug {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  inicijatorPseudonim: string;
  brOsnivaca: number;
  createdAt: string;
}

interface ProgramInfo {
  type: string;
  label: string;
  isActive: boolean;
  activatedAt: string | null;
}

interface PendingEnrollment {
  id: string;
  pseudonim: string;
  type: string;
  label: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface PendingEvidencija {
  id: string;
  pseudonim: string;
  date: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface EmisionaSumarija {
  date: string;
  opticaj: number;
  limit: number;
  totalRequested: number;
  totalEmitted: number;
  koeficijent: number;
}

interface AdminProgramiData {
  zrnoTrzisjeAktivno: boolean;
  programi: ProgramInfo[];
  pendingEnrollments: PendingEnrollment[];
  pendingEvidencije: PendingEvidencija[];
  poslednjeEmisije: EmisionaSumarija[];
}

interface AdminOglasItem {
  id: string;
  title: string;
  source: string;
  hourlyRate: number;
  maxHoursPerDay: number;
  positions: number;
  deadline: string | null;
  status: string;
  createdByPseudonim: string;
  krugName: string | null;
  ukupnoPrijava: number;
  pendingEvidencija: number;
  createdAt: string;
}

interface AdminPendingPrijava {
  id: string;
  pseudonim: string;
  oglasTitle: string;
  hourlyRate: number;
  positions: number;
  createdAt: string;
}

interface AdminPendingOglasEvidencija {
  id: string;
  pseudonim: string;
  oglasTitle: string;
  date: string;
  hoursWorked: number;
  amount: number;
  description: string;
  createdAt: string;
}

interface AdminPedData {
  oglasi: AdminOglasItem[];
  pendingPrijave: AdminPendingPrijava[];
  pendingEvidencije: AdminPendingOglasEvidencija[];
}

interface PokroviteljItem {
  id: string;
  naziv: string;
  pib: string;
  vlasnikPseudonim: string;
  rsdKumulativ: number;
  trenutniNivo: number;
  status: string;
  brDoprinosa: number;
  createdAt: string;
}

interface BlogObjavaAdmin {
  id: string;
  title: string;
  content: string;
  authorPseudonim: string;
  publishedAt: string;
  createdAt: string;
}

interface AdminKlijentProps {
  users: KorisnikInfo[];
  opticaj: number;
  pendingKrugovi: PendingKrug[];
  adminProgrami: AdminProgramiData;
  adminPed: AdminPedData;
  adminPokrovitelji: PokroviteljItem[];
  dashboard: DashboardData;
  auditLogs: AuditLogEntry[];
  krugoviLista: KrugListItem[];
  verifikovaniKorisnici: { id: string; pseudonim: string }[];
  krugoviLista2: { id: string; name: string }[];
  blogObjave: BlogObjavaAdmin[];
}

const roleLabel: Record<string, string> = {
  FIZICKO_LICE: "Fizičko lice",
  CLAN_KRUGA: "Krugr",
  ADMIN: "Admin",
};

const statusBoja: Record<string, string> = {
  ACTIVE:    "bg-kolo-green-100 text-kolo-green-700",
  SUSPENDED: "bg-kolo-gold-100 text-kolo-gold-600",
  EXCLUDED:  "bg-kolo-danger-light text-kolo-danger",
};

type Tab = "dashboard" | "krugovi" | "programi" | "ped" | "pokrovitelji" | "korisnici" | "emisija" | "osnivaci" | "vesti" | "audit";

export default function AdminKlijent({ users, opticaj, pendingKrugovi, adminProgrami, adminPed, adminPokrovitelji, dashboard, auditLogs, krugoviLista, verifikovaniKorisnici, krugoviLista2, blogObjave }: AdminKlijentProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");

  const ukupnoPendingProgrami = adminProgrami.pendingEnrollments.length + adminProgrami.pendingEvidencije.length;
  const ukupnoPendingZaposl = adminPed.pendingPrijave.length + adminPed.pendingEvidencije.length;

  const tabs: [Tab, string][] = [
    ["dashboard", "Dashboard"],
    ["krugovi", `Krugovi${pendingKrugovi.length > 0 ? ` (${pendingKrugovi.length})` : ""}`],
    ["programi", `Programi${ukupnoPendingProgrami > 0 ? ` (${ukupnoPendingProgrami})` : ""}`],
    ["ped", `Evidencija Doprinosa${ukupnoPendingZaposl > 0 ? ` (${ukupnoPendingZaposl})` : ""}`],
    ["pokrovitelji", `Pokrovitelji${adminPokrovitelji.length > 0 ? ` (${adminPokrovitelji.length})` : ""}`],
    ["korisnici", "Korisnici"],
    ["emisija", "Finansije"],
    ["osnivaci", "Osnivači"],
    ["vesti", "Vesti"],
    ["audit", "Audit log"],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-kolo-text">Admin panel</h1>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-kolo-border">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-kolo-green-700 text-kolo-green-700"
                : "border-transparent text-kolo-muted hover:text-kolo-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === "dashboard" && <DashboardTab data={dashboard} onRefresh={() => router.refresh()} />}

      {/* Krugovi — pending osnivanje + lista aktivnih */}
      {tab === "krugovi" && <KrugoviLista pendingKrugovi={pendingKrugovi} krugoviLista={krugoviLista} onDone={() => router.refresh()} />}

      {/* Programi */}
      {tab === "programi" && <AdminProgramiTab data={adminProgrami} onDone={() => router.refresh()} />}

      {/* Evidencija doprinosa */}
      {tab === "ped" && <AdminPedTab data={adminPed} onDone={() => router.refresh()} />}

      {/* Pokrovitelji */}
      {tab === "pokrovitelji" && (
        <AdminPokroviteljiTab
          pokrovitelji={adminPokrovitelji}
          verifikovaniKorisnici={verifikovaniKorisnici}
          krugovi={krugoviLista2}
          onDone={() => router.refresh()}
        />
      )}

      {/* Korisnici */}
      {tab === "korisnici" && <KorisniciTab users={users} onDone={() => router.refresh()} />}

      {/* Finansije */}
      {tab === "emisija" && <EmisijaTab opticaj={opticaj} onSuccess={() => router.refresh()} />}

      {/* Osnivači */}
      {tab === "osnivaci" && <OsnivaciTab verifikovaniKorisnici={verifikovaniKorisnici} onDone={() => router.refresh()} />}

      {/* Vesti */}
      {tab === "vesti" && <VestiTab objave={blogObjave} onDone={() => router.refresh()} />}

      {/* Audit log */}
      {tab === "audit" && <AuditLogTab logs={auditLogs} onRefresh={() => router.refresh()} />}
    </div>
  );
}

// ── Kartica za zahtev za osnivanje krugovi ────────────────────────────────────

function KrugZahtevKartica({ z, onDone }: { z: PendingKrug; onDone: () => void }) {
  const [razlog, setRazlog] = useState("");
  const [showOdbij, setShowOdbij] = useState(false);
  const [loading, setLoading] = useState<"odobri" | "odbij" | null>(null);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  async function odobri() {
    setLoading("odobri");
    setPoruka(null);
    const res = await fetch(`/api/admin/krugovi/${z.id}/odobri`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (res.ok) {
      setPoruka({ text: `Krug "${z.name}" odobrena. Emitovano 50.000 POEN.`, ok: true });
      setTimeout(onDone, 1500);
    } else {
      setPoruka({ text: data.error ?? "Greška.", ok: false });
    }
  }

  async function odbij() {
    if (!razlog.trim()) return;
    setLoading("odbij");
    setPoruka(null);
    const res = await fetch(`/api/admin/krugovi/${z.id}/odbij`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog: razlog.trim() }),
    });
    const data = await res.json();
    setLoading(null);
    if (res.ok) {
      setPoruka({ text: "Zahtev odbijen.", ok: false });
      setTimeout(onDone, 1200);
    } else {
      setPoruka({ text: data.error ?? "Greška.", ok: false });
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-kolo-text">{z.name}</p>
          {z.location && <p className="text-xs text-kolo-muted mt-0.5">{z.location}</p>}
          {z.description && <p className="text-sm text-kolo-muted mt-1">{z.description}</p>}
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-xs text-kolo-muted">Inicijator</p>
          <p className="text-sm font-medium text-kolo-text">{z.inicijatorPseudonim}</p>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-kolo-muted">
        <span>{z.brOsnivaca} osnivača</span>
        <span>{new Date(z.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</span>
      </div>

      {!poruka && (
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <button onClick={odobri} disabled={loading !== null}
              className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60">
              {loading === "odobri" ? "Obrađujem..." : "Odobri osnivanje"}
            </button>
            <button onClick={() => setShowOdbij((v) => !v)} disabled={loading !== null}
              className="flex-1 py-2.5 rounded-xl bg-white border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light transition-colors disabled:opacity-60">
              Odbij
            </button>
          </div>

          {showOdbij && (
            <div className="space-y-2">
              <textarea value={razlog} onChange={(e) => setRazlog(e.target.value)}
                placeholder="Razlog odbijanja..." rows={2}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-red-400 resize-none transition-colors" />
              <button onClick={odbij} disabled={loading !== null || !razlog.trim()}
                className="w-full py-2.5 rounded-xl bg-kolo-danger text-white text-sm font-semibold hover:bg-kolo-danger transition-colors disabled:opacity-60">
                {loading === "odbij" ? "Odbijam..." : "Potvrdi odbijanje"}
              </button>
            </div>
          )}
        </div>
      )}

      {poruka && (
        <p className={`text-sm px-4 py-3 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
          {poruka.text}
        </p>
      )}
    </div>
  );
}

// ── Evidencija doprinosa tab ─────────────────────────────────────────────────────────

const sourceLabel: Record<string, string> = { FONDACIJA: "Fondacija", KRUG: "Krug", PROJEKAT: "Projekat" };
const sourceCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  KRUG:   "bg-kolo-info-light text-kolo-info",
  PROJEKAT:  "bg-purple-50 text-purple-700",
};

function AdminPedTab({ data, onDone }: { data: AdminPedData; onDone: () => void }) {
  const [view, setView] = useState<"oglasi" | "prijave" | "evidencije" | "novi">("oglasi");
  const [loading, setLoading] = useState<string | null>(null);
  const [poruke, setPoruke] = useState<Record<string, { text: string; ok: boolean }>>({});

  async function odobriPrijavu(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/prijave/${id}/odobri`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? "Odobreno." : (d.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function odbijPrijavu(id: string, razlog: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/prijave/${id}/odbij`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog }),
    });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? "Odbijeno." : (d.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function odobriEvidenciju(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/evidencija/${id}/odobri`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? `Odobreno. Emitovano ${d.amount?.toLocaleString("sr-RS")} POEN.` : (d.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function odbijEvidenciju(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/evidencija/${id}/odbij`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? "Odbijeno." : (d.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function zatvoriOglas(id: string) {
    if (!confirm("Zatvoriti oglas?")) return;
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/oglasi/${id}/zatvori`, { method: "POST" });
    setLoading(null);
    if (res.ok) onDone();
  }

  const subTabs: [typeof view, string][] = [
    ["oglasi", `Oglasi (${data.oglasi.length})`],
    ["prijave", `Prijave${data.pendingPrijave.length > 0 ? ` (${data.pendingPrijave.length})` : ""}`],
    ["evidencije", `Evidencije${data.pendingEvidencije.length > 0 ? ` (${data.pendingEvidencije.length})` : ""}`],
    ["novi", "Novi oglas"],
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-0 border-b border-kolo-border">
        {subTabs.map(([key, label]) => (
          <button key={key} onClick={() => setView(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${view === key ? "border-kolo-green-700 text-kolo-green-700" : "border-transparent text-kolo-muted hover:text-kolo-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Oglasi */}
      {view === "oglasi" && (
        <div className="space-y-3">
          {data.oglasi.length === 0 ? (
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">Nema oglasa.</div>
          ) : data.oglasi.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-kolo-border p-5">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${sourceCls[o.source]}`}>{sourceLabel[o.source]}</span>
                    {o.krugName && <span className="text-xs text-kolo-muted">{o.krugName}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded ${o.status === "ACTIVE" ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"}`}>
                      {o.status === "ACTIVE" ? "Aktivan" : "Zatvoren"}
                    </span>
                  </div>
                  <p className="font-semibold text-kolo-text text-sm">{o.title}</p>
                  <p className="text-xs text-kolo-muted mt-1">
                    {o.hourlyRate.toLocaleString("sr-RS")} POEN/sat · max {o.maxHoursPerDay}h · {o.positions} {o.positions === 1 ? "mesto" : "mesta"} · {o.ukupnoPrijava} prijava · {o.pendingEvidencija} pending ev.
                  </p>
                </div>
                {o.status === "ACTIVE" && (
                  <button onClick={() => zatvoriOglas(o.id)} disabled={loading === o.id}
                    className="text-xs px-3 py-1.5 border border-kolo-danger/20 text-kolo-danger rounded-xl hover:bg-kolo-danger-light disabled:opacity-60">
                    Zatvori
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prijave */}
      {view === "prijave" && (
        <div className="space-y-3">
          {data.pendingPrijave.length === 0 ? (
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">Nema prijava na čekanju.</div>
          ) : data.pendingPrijave.map((p) => {
            const poruka = poruke[p.id];
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-kolo-text text-sm">{p.pseudonim}</p>
                    <p className="text-xs text-kolo-muted mt-0.5">{p.oglasTitle} · {p.hourlyRate.toLocaleString("sr-RS")} P/sat</p>
                    <p className="text-xs text-kolo-muted">{new Date(p.createdAt).toLocaleDateString("sr-RS")}</p>
                  </div>
                  <div className="flex gap-2">
                    <OdbijForma onOdbij={(r) => odbijPrijavu(p.id, r)} loading={loading === p.id} />
                    <button onClick={() => odobriPrijavu(p.id)} disabled={loading === p.id}
                      className="px-4 py-2 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60">
                      {loading === p.id ? "..." : "Odobri"}
                    </button>
                  </div>
                </div>
                {poruka && <p className={`text-xs px-3 py-1.5 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Evidencije */}
      {view === "evidencije" && (
        <div className="space-y-3">
          {data.pendingEvidencije.length === 0 ? (
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">Nema evidencija na čekanju.</div>
          ) : data.pendingEvidencije.map((e) => {
            const poruka = poruke[e.id];
            return (
              <div key={e.id} className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-kolo-text text-sm">{e.pseudonim}</p>
                    <p className="text-xs text-kolo-muted mt-0.5">{e.oglasTitle} · {new Date(e.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</p>
                    <p className="text-xs text-kolo-muted mt-1 line-clamp-2">{e.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-kolo-text">{e.hoursWorked}h · {e.amount.toLocaleString("sr-RS")} P</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => odbijEvidenciju(e.id)} disabled={loading === e.id}
                        className="px-3 py-1.5 border border-kolo-danger/20 text-kolo-danger text-xs font-semibold rounded-lg hover:bg-kolo-danger-light disabled:opacity-60">
                        Odbij
                      </button>
                      <button onClick={() => odobriEvidenciju(e.id)} disabled={loading === e.id}
                        className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg hover:bg-kolo-green-900 disabled:opacity-60">
                        {loading === e.id ? "..." : "Odobri"}
                      </button>
                    </div>
                  </div>
                </div>
                {poruka && <p className={`text-xs px-3 py-1.5 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Novi oglas */}
      {view === "novi" && <NoviOglasForma onSuccess={() => { onDone(); setView("oglasi"); }} />}
    </div>
  );
}

function OdbijForma({ onOdbij, loading }: { onOdbij: (razlog: string) => void; loading: boolean }) {
  const [show, setShow] = useState(false);
  const [razlog, setRazlog] = useState("");
  if (!show) return (
    <button onClick={() => setShow(true)} className="px-3 py-2 border border-kolo-danger/20 text-kolo-danger text-xs font-semibold rounded-xl hover:bg-kolo-danger-light">Odbij</button>
  );
  return (
    <div className="flex gap-1 items-center">
      <input type="text" placeholder="Razlog..." value={razlog} onChange={(e) => setRazlog(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-kolo-border text-xs outline-none focus:border-red-400 w-28" />
      <button onClick={() => { onOdbij(razlog); setShow(false); }} disabled={loading}
        className="px-2 py-1.5 bg-kolo-danger text-white text-xs font-semibold rounded-lg disabled:opacity-60">✓</button>
      <button onClick={() => setShow(false)} className="px-2 py-1.5 text-kolo-muted text-xs">✕</button>
    </div>
  );
}

function NoviOglasForma({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<"FONDACIJA" | "KRUG" | "PROJEKAT">("FONDACIJA");
  const [hourlyRate, setHourlyRate] = useState("1500");
  const [maxHoursPerDay, setMaxHoursPerDay] = useState("8");
  const [positions, setPositions] = useState("1");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const stopa = Number(hourlyRate);
    if (stopa < 1000 || stopa > 2500) { setError("Stopa mora biti 1.000–2.500 POEN/sat."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/doprinos-oglasi/oglasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          source,
          hourlyRate: stopa,
          maxHoursPerDay: Number(maxHoursPerDay),
          positions: Number(positions),
          deadline: deadline || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Greška."); return; }
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
      <p className="text-sm font-semibold text-kolo-muted">Novi oglas za posao</p>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">Naziv pozicije *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="npr. Koordinator dostave"
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">Opis *</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Opis posla, zahtevi, uslovi..."
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Izvor pozicije</label>
          <div className="flex gap-1.5 flex-wrap">
            {(["FONDACIJA", "KRUG", "PROJEKAT"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSource(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${source === s ? "bg-kolo-green-700 text-white" : "bg-kolo-bg text-kolo-muted"}`}>
                {sourceLabel[s]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">POEN/sat (1.000–2.500)</label>
          <input type="number" min={1000} max={2500} step={100} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Max h/dan</label>
          <input type="number" min={1} max={8} value={maxHoursPerDay} onChange={(e) => setMaxHoursPerDay(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Br. mesta</label>
          <input type="number" min={1} value={positions} onChange={(e) => setPositions(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Rok (opciono)</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
      </div>

      {error && <p className="text-xs text-kolo-danger">{error}</p>}

      <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-xl px-3 py-2 text-xs text-kolo-gold-600">
        Zaposleni dobijaju {Number(hourlyRate).toLocaleString("sr-RS")} POEN/sat · do {(Number(maxHoursPerDay) * Number(hourlyRate)).toLocaleString("sr-RS")} POEN/dan
      </div>

      <button type="submit" disabled={loading || !title.trim() || !description.trim()}
        className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 disabled:opacity-60">
        {loading ? "Kreiranje..." : "Kreiraj oglas"}
      </button>
    </form>
  );
}

// ── Programi tab ──────────────────────────────────────────────────────────────

function AdminProgramiTab({ data, onDone }: { data: AdminProgramiData; onDone: () => void }) {
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);
  const [loadingNocna, setLoadingNocna] = useState(false);
  const [nocnaRezultat, setNocnaRezultat] = useState<string | null>(null);
  const [loadingZrno, setLoadingZrno] = useState(false);

  async function toggleZrnoTrziste() {
    setLoadingZrno(true);
    await fetch("/api/admin/zrno/nocna", { method: "PATCH" });
    setLoadingZrno(false);
    onDone();
  }

  async function pokreniZrnoNocnu() {
    if (!confirm("Pokrenuti ZRNO operacije sada?")) return;
    setLoadingZrno(true);
    const res = await fetch("/api/admin/zrno/nocna", { method: "POST" });
    const d = await res.json();
    setLoadingZrno(false);
    alert(res.ok ? `ZRNO: kurs ${Number(d.kurs).toFixed(2)}, u Protokolu: ${d.zrnaUProtokolu?.toLocaleString("sr-RS")}` : d.error);
    onDone();
  }

  async function toggleProgram(type: string) {
    setLoadingToggle(type);
    const res = await fetch(`/api/admin/programi/${type}/toggle`, { method: "POST" });
    setLoadingToggle(null);
    if (res.ok) onDone();
  }

  async function pokreniNocnu() {
    if (!confirm("Pokrenuti noćnu emisiju sada?")) return;
    setLoadingNocna(true); setNocnaRezultat(null);
    const res = await fetch("/api/admin/emisija/nocna", { method: "POST" });
    const data = await res.json();
    setLoadingNocna(false);
    if (res.ok) {
      setNocnaRezultat(`Emitovano: ${data.totalEmitted?.toLocaleString("sr-RS")} POEN / zatraženo: ${data.totalRequested?.toLocaleString("sr-RS")} / koeficijent: ${Number(data.koeficijent).toFixed(4)}`);
      onDone();
    } else {
      setNocnaRezultat(`Greška: ${data.error}`);
    }
  }

  async function odobriEnrollment(id: string, dailyAmount?: number) {
    const res = await fetch(`/api/admin/programi/enrollments/${id}/odobri`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dailyAmount != null ? { dailyAmount } : {}),
    });
    if (res.ok) onDone();
    else { const d = await res.json(); alert(d.error); }
  }

  async function odbijEnrollment(id: string) {
    const razlog = prompt("Razlog odbijanja (opciono):");
    if (razlog === null) return;
    const res = await fetch(`/api/admin/programi/enrollments/${id}/odbij`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog }),
    });
    if (res.ok) onDone();
  }

  async function odobriEvidenciju(id: string) {
    const res = await fetch(`/api/admin/programi/ped/${id}/odobri`, { method: "POST" });
    if (res.ok) onDone();
    else { const d = await res.json(); alert(d.error); }
  }

  async function odbijEvidenciju(id: string) {
    const res = await fetch(`/api/admin/programi/ped/${id}/odbij`, { method: "POST" });
    if (res.ok) onDone();
  }

  return (
    <div className="space-y-6">
      {/* ZRNO tržište */}
      <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-kolo-muted">ZRNO tržište</p>
          <p className="text-xs text-kolo-muted mt-0.5">
            {data.zrnoTrzisjeAktivno ? "Aktivno — upis/otpis ZRNA je moguć" : "Neaktivno — aktivira se pri −1.000.000 POEN (ili ručno)"}
          </p>
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
          <button onClick={pokreniZrnoNocnu} disabled={loadingZrno}
            className="px-3 py-1.5 bg-kolo-gold-600 text-white text-xs font-semibold rounded-xl hover:bg-kolo-gold-400 disabled:opacity-60 transition-colors">
            {loadingZrno ? "..." : "▶ ZRNO obrada"}
          </button>
          <button onClick={toggleZrnoTrziste} disabled={loadingZrno}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 ${data.zrnoTrzisjeAktivno ? "bg-kolo-danger-light text-kolo-danger hover:bg-kolo-danger-light" : "bg-kolo-gold-100 text-kolo-gold-600 hover:bg-kolo-gold-100"}`}>
            {data.zrnoTrzisjeAktivno ? "Deaktiviraj" : "Aktiviraj"}
          </button>
        </div>
      </div>

      {/* Status programa */}
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-5 py-3 border-b border-kolo-border flex justify-between items-center">
          <h3 className="text-sm font-semibold text-kolo-muted">Status programa</h3>
          <button onClick={pokreniNocnu} disabled={loadingNocna}
            className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60 transition-colors">
            {loadingNocna ? "..." : "▶ Pokreni emisiju"}
          </button>
        </div>
        {nocnaRezultat && (
          <div className="px-5 py-3 border-b border-kolo-border text-xs text-kolo-green-700 bg-kolo-green-100">{nocnaRezultat}</div>
        )}
        {data.programi.map((p, i) => (
          <div key={p.type} className={`px-5 py-3 flex justify-between items-center ${i < data.programi.length - 1 ? "border-b border-kolo-border" : ""}`}>
            <div>
              <span className="text-sm font-medium text-kolo-text">{p.label}</span>
              {p.activatedAt && p.isActive && (
                <span className="ml-2 text-xs text-kolo-muted">aktiviran {new Date(p.activatedAt).toLocaleDateString("sr-RS")}</span>
              )}
            </div>
            <button onClick={() => toggleProgram(p.type)} disabled={loadingToggle === p.type}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 ${p.isActive ? "bg-kolo-danger-light text-kolo-danger hover:bg-kolo-danger-light" : "bg-kolo-green-100 text-kolo-green-700 hover:bg-kolo-green-100"}`}>
              {loadingToggle === p.type ? "..." : p.isActive ? "Deaktiviraj" : "Aktiviraj"}
            </button>
          </div>
        ))}
      </div>

      {/* Pending prijave na programe */}
      {data.pendingEnrollments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-kolo-muted">Prijave na programe ({data.pendingEnrollments.length})</h3>
          {data.pendingEnrollments.map((e) => (
            <EnrollmentKartica key={e.id} e={e} onOdobri={(amt) => odobriEnrollment(e.id, amt)} onOdbij={() => odbijEnrollment(e.id)} />
          ))}
        </div>
      )}

      {/* Pending evidencije — Evidencija doprinosa */}
      {data.pendingEvidencije.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-kolo-muted">Evidencije — Evidencija doprinosa ({data.pendingEvidencije.length})</h3>
          {data.pendingEvidencije.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-kolo-border px-5 py-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-kolo-text">{e.pseudonim}</p>
                  <p className="text-xs text-kolo-muted">{new Date(e.date).toLocaleDateString("sr-RS")}</p>
                </div>
                <span className="text-sm font-bold text-kolo-green-700">{e.amount.toLocaleString("sr-RS")} P</span>
              </div>
              <p className="text-sm text-kolo-muted">{e.description}</p>
              <div className="flex gap-2">
                <button onClick={() => odobriEvidenciju(e.id)}
                  className="flex-1 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors">
                  Odobri
                </button>
                <button onClick={() => odbijEvidenciju(e.id)}
                  className="flex-1 py-2 rounded-xl border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light transition-colors">
                  Odbij
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.pendingEnrollments.length === 0 && data.pendingEvidencije.length === 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          Nema zahteva koji čekaju pregled.
        </div>
      )}

      {/* Istorija emisija */}
      {data.poslednjeEmisije.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-3 border-b border-kolo-border">
            <h3 className="text-sm font-semibold text-kolo-muted">Istorija dnevnih emisija</h3>
          </div>
          {data.poslednjeEmisije.map((s, i) => (
            <div key={s.date} className={`px-5 py-3 flex justify-between items-center text-sm ${i < data.poslednjeEmisije.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <span className="text-kolo-muted">{new Date(s.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</span>
              <span className="font-semibold text-kolo-green-700">{s.totalEmitted.toLocaleString("sr-RS")} P</span>
              {s.koeficijent < 1 && (
                <span className="text-xs text-kolo-gold-600">koef. {s.koeficijent.toFixed(3)}</span>
              )}
              <span className="text-xs text-kolo-muted">lim. {s.limit.toLocaleString("sr-RS")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EnrollmentKartica({ e, onOdobri, onOdbij }: {
  e: PendingEnrollment;
  onOdobri: (dailyAmount?: number) => void;
  onOdbij: () => void;
}) {
  const [dailyAmount, setDailyAmount] = useState("");

  const metaLines = e.metadata ? Object.entries(e.metadata).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" · ") : "";

  return (
    <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-kolo-text">{e.pseudonim}</p>
          <p className="text-xs text-kolo-green-700 font-medium">{e.label}</p>
          {metaLines && <p className="text-xs text-kolo-muted mt-0.5">{metaLines}</p>}
        </div>
        <span className="text-xs text-kolo-muted">{new Date(e.createdAt).toLocaleDateString("sr-RS")}</span>
      </div>
      {e.type === "SKOLOVANJE" && (
        <input type="number" min={100} placeholder="Dnevni iznos POEN *" value={dailyAmount}
          onChange={(ev) => setDailyAmount(ev.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      )}
      <div className="flex gap-2">
        <button onClick={() => onOdobri(dailyAmount ? Number(dailyAmount) : undefined)}
          disabled={e.type === "SKOLOVANJE" && !dailyAmount}
          className="flex-1 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 disabled:opacity-60 transition-colors">
          Odobri
        </button>
        <button onClick={onOdbij}
          className="flex-1 py-2 rounded-xl border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light transition-colors">
          Odbij
        </button>
      </div>
    </div>
  );
}

// ── Emisija tab ────────────────────────────────────────────────────────────────

function EmisijaTab({ opticaj, onSuccess }: { opticaj: number; onSuccess: () => void }) {
  const [pseudonim, setPseudonim] = useState("");
  const [amountRSD, setAmountRSD] = useState("");
  const [loading, setLoading] = useState(false);
  const [rezultat, setRezultat] = useState<{ poenEmitted: number; noviNivo: number; noviKumulativ: number } | null>(null);
  const [error, setError] = useState("");

  async function handleDonacija(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(""); setRezultat(null);

    if (!pseudonim.trim()) { setError("Pseudonim je obavezan."); return; }
    const iznos = Number(amountRSD);
    if (!amountRSD || isNaN(iznos) || iznos <= 0) { setError("Unesite pozitivan iznos."); return; }

    setLoading(true);
    const res = await fetch("/api/admin/donacija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudonim: pseudonim.trim(), amountRSD: iznos }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Greška."); return; }
    setRezultat(data);
    setPseudonim(""); setAmountRSD("");
    onSuccess();
  }

  const dnevniLimit = Math.floor(opticaj * 0.1);

  return (
    <div className="space-y-5">
      {/* Opticaj */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Opticaj</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{opticaj.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">POEN u sistemu</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Dnevni limit programa</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-gold-600">{dnevniLimit.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">10% opticaja</p>
        </div>
      </div>

      {/* Pragovi donacija */}
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-4 py-3 border-b border-kolo-border">
          <h3 className="text-sm font-semibold text-kolo-muted">Pragovi donacija — fiksni bonus</h3>
          <p className="text-xs text-kolo-muted mt-0.5">Bonus se emituje jednom, kad kumulativ pređe prag</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-kolo-bg">
              <th className="px-4 py-2 text-center text-kolo-muted font-medium">Nivo</th>
              <th className="px-4 py-2 text-left text-kolo-muted font-medium">Kumulativ RSD</th>
              <th className="px-4 py-2 text-right text-kolo-muted font-medium">Bonus POEN</th>
            </tr>
          </thead>
          <tbody>
            {[
              [1, "10.000",     "20.000"],
              [2, "20.000",     "30.000"],
              [3, "50.000",     "80.000"],
              [4, "100.000",   "150.000"],
              [5, "200.000",   "300.000"],
              [6, "500.000",   "800.000"],
              [7, "1.000.000", "1.500.000"],
            ].map(([nivo, prag, bonus]) => (
              <tr key={nivo} className="border-t border-kolo-border">
                <td className="px-4 py-2 text-center font-medium text-kolo-text">{nivo}</td>
                <td className="px-4 py-2 text-kolo-muted">{prag} RSD</td>
                <td className="px-4 py-2 text-right font-semibold text-kolo-green-700">{bonus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forma za donaciju */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5">
        <h3 className="text-sm font-semibold text-kolo-muted mb-4">Evidentiraj donaciju</h3>
        <form onSubmit={handleDonacija} noValidate className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">Pseudonim donatora</label>
            <input
              type="text"
              value={pseudonim}
              onChange={(e) => setPseudonim(e.target.value)}
              placeholder="npr. MilanPetrovic"
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">Iznos donacije (RSD)</label>
            <input
              type="number"
              min={1}
              step={0.01}
              value={amountRSD}
              onChange={(e) => setAmountRSD(e.target.value)}
              placeholder="5000"
              className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors font-mono"
            />
          </div>
          {error && <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{error}</p>}
          {rezultat && (
            <div className="bg-kolo-green-100 border border-kolo-green-100 rounded-xl px-4 py-3 text-sm text-kolo-green-700">
              <p className="font-semibold">Donacija evidentirana!</p>
              {rezultat.poenEmitted > 0 ? (
                <p className="mt-1">Emitovano: <strong>{rezultat.poenEmitted.toLocaleString("sr-RS")} POEN</strong> · Nivo {rezultat.noviNivo}</p>
              ) : (
                <p className="mt-1 text-kolo-muted">Prag nije dostignut — nema emisije POEN-a</p>
              )}
              <p className="text-xs mt-1">Kumulativ: {rezultat.noviKumulativ.toLocaleString("sr-RS")} RSD</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
          >
            {loading ? "Evidentiram..." : "Evidentiraj i emituj POEN"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard tab ─────────────────────────────────────────────────────────────

function DashboardTab({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const [zeroSum, setZeroSum] = useState<{ zbir: number; ok: boolean } | null>(null);
  const [loadingZS, setLoadingZS] = useState(false);

  async function provjeriZeroSum() {
    setLoadingZS(true);
    const res = await fetch("/api/admin/zero-sum");
    if (res.ok) setZeroSum(await res.json());
    setLoadingZS(false);
  }

  return (
    <div className="space-y-5">
      {/* Korisnici */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Korisnici ukupno</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.korisnici.ukupno.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Verifikovani</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-green-700">{data.korisnici.verifikovanih.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-kolo-muted mb-1">Suspendovani</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-gold-600">{data.korisnici.suspendovanih.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Krugovi */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Aktivne krugovi</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.krugovi.ukupno.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Krugri</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.krugovi.krugra.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Finansije */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Opticaj (POEN)</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.finansije.opticaj.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Ukupno transakcija</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.ukupnoTransakcija.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* ZRNO */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">ZRNO kod korisnika</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-gold-600">{data.zrno.kodKorisnika.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">ZRNO u Protokolu</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.zrno.uProtokolu.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-kolo-muted mb-1">Ukupno ZRNA</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-muted">{data.zrno.ukupno.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Zero-sum provjera */}
      <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-kolo-muted">Zero-sum provjera</p>
          {zeroSum && (
            <p className={`text-sm mt-0.5 font-mono ${zeroSum.ok ? "text-kolo-green-700" : "text-kolo-danger"}`}>
              Zbir svih računa: {zeroSum.zbir.toLocaleString("sr-RS")} {zeroSum.ok ? "✓ OK" : "✗ GREŠKA"}
            </p>
          )}
        </div>
        <button onClick={provjeriZeroSum} disabled={loadingZS}
          className="px-4 py-2 bg-kolo-bg text-kolo-muted text-sm font-semibold rounded-xl hover:bg-kolo-border disabled:opacity-60 transition-colors shrink-0">
          {loadingZS ? "Provjerava..." : "Provjeri"}
        </button>
      </div>

      <button onClick={onRefresh}
        className="w-full py-2.5 rounded-xl border border-kolo-border text-sm text-kolo-muted hover:bg-kolo-bg transition-colors">
        Osvježi podatke
      </button>
    </div>
  );
}

// ── Krugovi lista tab ─────────────────────────────────────────────────────────

function KrugoviLista({ pendingKrugovi, krugoviLista, onDone }: {
  pendingKrugovi: PendingKrug[];
  krugoviLista: KrugListItem[];
  onDone: () => void;
}) {
  const statusKrugovi: Record<string, string> = {
    ACTIVE:   "bg-kolo-green-100 text-kolo-green-700",
    PENDING:  "bg-kolo-gold-100 text-kolo-gold-600",
    REJECTED: "bg-kolo-danger-light text-kolo-danger",
    CLOSED:   "bg-kolo-bg text-kolo-muted",
  };

  return (
    <div className="space-y-6">
      {pendingKrugovi.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-kolo-muted">Zahtevi za osnivanje ({pendingKrugovi.length})</h3>
          {pendingKrugovi.map((z) => (
            <KrugZahtevKartica key={z.id} z={z} onDone={onDone} />
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-5 py-3 border-b border-kolo-border">
          <h3 className="text-sm font-semibold text-kolo-muted">Sve krugovi ({krugoviLista.length})</h3>
        </div>
        {krugoviLista.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-kolo-muted">Nema krug.</p>
        ) : (
          krugoviLista.map((z, i) => (
            <div key={z.id} className={`px-5 py-3 flex justify-between items-center gap-3 ${i < krugoviLista.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-kolo-text truncate">{z.name}</p>
                {z.location && <p className="text-xs text-kolo-muted truncate">{z.location}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs text-kolo-muted">
                <span>{z.clanovi} čl.</span>
                <span>{z.projekti} proj.</span>
                <span className="font-mono">{z.balance.toLocaleString("sr-RS")} P</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusKrugovi[z.status] ?? "bg-kolo-bg text-kolo-muted"}`}>
                  {z.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Korisnici tab ─────────────────────────────────────────────────────────────

function KorisniciTab({ users, onDone }: { users: KorisnikInfo[]; onDone: () => void }) {
  const [filter, setFilter] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [izmeniKorisnik, setIzmeniKorisnik] = useState<KorisnikInfo | null>(null);

  const filtered = users.filter((u) =>
    u.pseudonim.toLowerCase().includes(filter.toLowerCase())
  );

  async function akcija(userId: string, tip: "suspenduj" | "aktiviraj" | "iskljuci" | "lazni-verifikator") {
    if (tip === "iskljuci" && !confirm("Trajno isključiti korisnika iz sistema?")) return;
    if (tip === "lazni-verifikator" && !confirm(
      "Označiti kao lažnog verifikatora?\n\nSve verifikacije iz njegovog podstabla biće rekurzivno poništene, emitovani POEN (1.000/1.000/500) vraćen Protokolu (moguć minus), a korisnik isključen. Pogođeni korisnici padaju na 0% indeksa."
    )) return;
    let razlog: string | null = null;
    if (tip === "suspenduj") {
      razlog = prompt("Razlog suspenzije:");
      if (razlog === null) return;
    }
    setLoadingId(userId);
    const res = await fetch(`/api/admin/korisnici/${userId}/${tip}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: razlog !== null ? JSON.stringify({ razlog }) : "{}",
    });
    const d = await res.json().catch(() => ({}));
    setLoadingId(null);
    if (res.ok) {
      if (tip === "lazni-verifikator") alert(`Poništeno ${d.poistenoVerifikacija ?? 0} verifikacija u podstablu.`);
      onDone();
    } else {
      alert(d.error ?? "Greška.");
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Pretraži po pseudonimu..."
        className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
      />

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-kolo-muted">Nema korisnika.</p>
        ) : (
          filtered.map((u, i) => (
            <div key={u.id} className={`px-4 py-3 ${i < filtered.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-kolo-text">{u.pseudonim}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBoja[u.status] ?? "bg-kolo-bg text-kolo-muted"}`}>
                      {u.status}
                    </span>
                    {!u.verified && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-kolo-bg text-kolo-muted">
                        neverifikovan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {roleLabel[u.role] ?? u.role} · {u.balance.toLocaleString("sr-RS")} P
                    {u.suspendedReason && <span className="ml-1 text-kolo-gold-600">— {u.suspendedReason}</span>}
                  </p>
                </div>
                {u.role !== "ADMIN" && (
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    <button onClick={() => setIzmeniKorisnik(u)} disabled={loadingId === u.id}
                      className="px-2.5 py-1 bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold rounded-lg hover:bg-kolo-border disabled:opacity-60 transition-colors">
                      Izmeni
                    </button>
                    {u.status === "ACTIVE" && (
                      <button onClick={() => akcija(u.id, "suspenduj")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold rounded-lg hover:bg-kolo-gold-100 disabled:opacity-60 transition-colors">
                        Suspenduj
                      </button>
                    )}
                    {u.status === "SUSPENDED" && (
                      <button onClick={() => akcija(u.id, "aktiviraj")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold rounded-lg hover:bg-kolo-green-100 disabled:opacity-60 transition-colors">
                        Aktiviraj
                      </button>
                    )}
                    {u.status !== "EXCLUDED" && (
                      <button onClick={() => akcija(u.id, "iskljuci")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg hover:bg-kolo-danger-light disabled:opacity-60 transition-colors">
                        Isključi
                      </button>
                    )}
                    {u.verified && u.status !== "EXCLUDED" && (
                      <button onClick={() => akcija(u.id, "lazni-verifikator")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg hover:bg-kolo-danger-light disabled:opacity-60 transition-colors">
                        Lažni verifikator
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {izmeniKorisnik && (
        <IzmeniKorisnikaForma
          korisnik={izmeniKorisnik}
          onClose={() => setIzmeniKorisnik(null)}
          onDone={() => { setIzmeniKorisnik(null); onDone(); }}
        />
      )}
    </div>
  );
}

function IzmeniKorisnikaForma({ korisnik, onClose, onDone }: {
  korisnik: KorisnikInfo;
  onClose: () => void;
  onDone: () => void;
}) {
  const [email, setEmail] = useState(korisnik.email ?? "");
  const [pseudonim, setPseudonim] = useState(korisnik.pseudonim);
  const [loading, setLoading] = useState(false);
  const [greska, setGreska] = useState("");

  async function sacuvaj() {
    setGreska("");
    const data: Record<string, string> = {};
    if (email.trim() !== (korisnik.email ?? "")) data.email = email.trim();
    if (pseudonim.trim() !== korisnik.pseudonim) data.pseudonim = pseudonim.trim();
    if (Object.keys(data).length === 0) { onClose(); return; }

    setLoading(true);
    const res = await fetch(`/api/admin/korisnici/${korisnik.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    setLoading(false);
    if (res.ok) {
      onDone();
    } else {
      setGreska(resData.error ?? "Greška pri izmeni.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-kolo-text">Izmeni podatke korisnika</h3>
          <p className="text-sm text-kolo-muted mt-0.5">{korisnik.pseudonim}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">Pseudonim</label>
          <input
            type="text"
            value={pseudonim}
            onChange={(e) => setPseudonim(e.target.value)}
            maxLength={30}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors"
          />
        </div>

        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-kolo-border text-kolo-muted text-sm font-medium hover:bg-kolo-bg transition-colors">
            Otkaži
          </button>
          <button onClick={sacuvaj} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60">
            {loading ? "Čuvam..." : "Sačuvaj"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin pokrovitelji tab ────────────────────────────────────────────────────

function AdminPokroviteljiTab({
  pokrovitelji,
  verifikovaniKorisnici,
  krugovi,
  onDone,
}: {
  pokrovitelji: PokroviteljItem[];
  verifikovaniKorisnici: { id: string; pseudonim: string }[];
  krugovi: { id: string; name: string }[];
  onDone: () => void;
}) {
  const [subTab, setSubTab] = useState<"lista" | "prijave" | "novi" | "doprinos">("lista");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  // Forma — novi pokrovitelj
  const [noviNaziv, setNoviNaziv] = useState("");
  const [noviPib, setNoviPib] = useState("");
  const [noviAdresa, setNoviAdresa] = useState("");
  const [noviEmail, setNoviEmail] = useState("");
  const [noviTelefon, setNoviTelefon] = useState("");
  const [noviVlasnikId, setNoviVlasnikId] = useState("");
  const [noviKrugId, setNoviKrugId] = useState("");

  // Forma — doprinos
  const [doprinosRsd, setDoprinosRsd] = useState("");
  const [doprinosTip, setDoprinosTip] = useState<"NOVAC" | "ROBA" | "USLUGE">("NOVAC");
  const [doprinosNapomena, setDoprinosNapomena] = useState("");

  async function kreirajPokrovitelja() {
    if (!noviNaziv.trim() || !noviPib.trim() || !noviVlasnikId) {
      setPoruka({ text: "Naziv, PIB i vlasnik su obavezni.", ok: false });
      return;
    }
    setLoading(true);
    setPoruka(null);
    const res = await fetch("/api/admin/pokrovitelji", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naziv: noviNaziv.trim(),
        pib: noviPib.trim(),
        adresa: noviAdresa.trim() || undefined,
        kontaktEmail: noviEmail.trim() || undefined,
        kontaktTelefon: noviTelefon.trim() || undefined,
        vlasnikId: noviVlasnikId,
        krugId: noviKrugId || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPoruka({ text: "Pokrovitelj kreiran.", ok: true });
      setNoviNaziv(""); setNoviPib(""); setNoviAdresa(""); setNoviEmail(""); setNoviTelefon(""); setNoviVlasnikId(""); setNoviKrugId("");
      setTimeout(() => { onDone(); setSubTab("lista"); }, 1200);
    } else {
      setPoruka({ text: data.error ?? "Greška.", ok: false });
    }
  }

  async function dodajDoprinos() {
    if (!selectedId || !doprinosRsd) return;
    const iznos = parseFloat(doprinosRsd);
    if (isNaN(iznos) || iznos <= 0) {
      setPoruka({ text: "Neispravan iznos.", ok: false });
      return;
    }
    setLoading(true);
    setPoruka(null);
    const res = await fetch(`/api/admin/pokrovitelji/${selectedId}/doprinos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rsdIznos: iznos, tip: doprinosTip, napomena: doprinosNapomena.trim() || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      const noviNivoi: { nivo: number; bonusPoen: number }[] = data.noviNivoi ?? [];
      if (noviNivoi.length > 0) {
        const tekst = noviNivoi.map((n: { nivo: number; bonusPoen: number }) => `Nivo ${n.nivo}: +${n.bonusPoen.toLocaleString("sr-RS")} POEN`).join(", ");
        setPoruka({ text: `Doprinos evidentiran. Novi nivoi: ${tekst}`, ok: true });
      } else {
        setPoruka({ text: "Doprinos evidentiran.", ok: true });
      }
      setDoprinosRsd(""); setDoprinosNapomena("");
      setTimeout(() => { onDone(); setSubTab("lista"); }, 2000);
    } else {
      setPoruka({ text: data.error ?? "Greška.", ok: false });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-kolo-border pb-0">
        {(["lista", "prijave", "novi", "doprinos"] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setSubTab(s); setPoruka(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              subTab === s ? "border-kolo-green-700 text-kolo-green-700" : "border-transparent text-kolo-muted hover:text-kolo-muted"
            }`}
          >
            {s === "lista" ? `Lista (${pokrovitelji.length})` : s === "prijave" ? "Prijave" : s === "novi" ? "Novi pokrovitelj" : "Evidentiraj doprinos"}
          </button>
        ))}
      </div>

      {poruka && (
        <div className={`px-4 py-3 rounded-xl text-sm ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
          {poruka.text}
        </div>
      )}

      {subTab === "prijave" && <PokroviteljPrijaveTab onDone={onDone} />}

      {subTab === "lista" && (
        <div className="space-y-2">
          {pokrovitelji.length === 0 ? (
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
              Nema registrovanih pokrovitelja.
            </div>
          ) : (
            pokrovitelji.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-kolo-border px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-kolo-text truncate">{p.naziv}</div>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    PIB: {p.pib} · Vlasnik: {p.vlasnikPseudonim}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === "ACTIVE" ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-gold-100 text-kolo-gold-600"}`}>
                    Nivo {p.trenutniNivo}
                  </span>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    {p.rsdKumulativ.toLocaleString("sr-RS")} RSD · {p.brDoprinosa} doprinos{p.brDoprinosa !== 1 ? "a" : ""}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {subTab === "novi" && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-4">
          <h3 className="font-semibold text-kolo-text">Novi pokrovitelj</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">Naziv *</label>
              <input value={noviNaziv} onChange={(e) => setNoviNaziv(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder="Naziv pravnog lica" />
            </div>
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">PIB *</label>
              <input value={noviPib} onChange={(e) => setNoviPib(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder="9-13 cifara" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">Adresa</label>
            <input value={noviAdresa} onChange={(e) => setNoviAdresa(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
              placeholder="Adresa sedišta" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">Email</label>
              <input value={noviEmail} onChange={(e) => setNoviEmail(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder="kontakt@firma.rs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">Telefon</label>
              <input value={noviTelefon} onChange={(e) => setNoviTelefon(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder="+381..." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">Vlasnik (verifikovan član) *</label>
            <select value={noviVlasnikId} onChange={(e) => setNoviVlasnikId(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500">
              <option value="">— odaberite vlasnika —</option>
              {verifikovaniKorisnici.map((k) => (
                <option key={k.id} value={k.id}>{k.pseudonim}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">Krug (opciono)</label>
            <select value={noviKrugId} onChange={(e) => setNoviKrugId(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500">
              <option value="">— bez krugovi —</option>
              {krugovi.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={kreirajPokrovitelja}
            disabled={loading}
            className="w-full py-2.5 bg-kolo-green-700 text-white font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60 transition-colors"
          >
            {loading ? "Kreiranje..." : "Kreiraj pokrovitelja"}
          </button>
        </div>
      )}

      {subTab === "doprinos" && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-4">
          <h3 className="font-semibold text-kolo-text">Evidentiraj doprinos</h3>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">Pokrovitelj *</label>
            <select value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value || null)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500">
              <option value="">— odaberite pokrovitelja —</option>
              {pokrovitelji.filter((p) => p.status === "ACTIVE").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.naziv} (nivo {p.trenutniNivo}, {p.rsdKumulativ.toLocaleString("sr-RS")} RSD)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">Iznos (RSD) *</label>
              <input
                type="number"
                min="1"
                value={doprinosRsd}
                onChange={(e) => setDoprinosRsd(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder="npr. 50000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">Tip *</label>
              <select
                value={doprinosTip}
                onChange={(e) => setDoprinosTip(e.target.value as "NOVAC" | "ROBA" | "USLUGE")}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
              >
                <option value="NOVAC">Novac</option>
                <option value="ROBA">Roba</option>
                <option value="USLUGE">Usluge</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">Napomena</label>
            <input value={doprinosNapomena} onChange={(e) => setDoprinosNapomena(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
              placeholder="Referenca uplate, opis..." />
          </div>
          <button
            onClick={dodajDoprinos}
            disabled={loading || !selectedId}
            className="w-full py-2.5 bg-kolo-green-700 text-white font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60 transition-colors"
          >
            {loading ? "Evidentiranje..." : "Evidentiraj doprinos"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Audit log tab ─────────────────────────────────────────────────────────────

function AuditLogTab({ logs, onRefresh }: { logs: AuditLogEntry[]; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-kolo-muted">{logs.length} zapisa</p>
        <button onClick={onRefresh}
          className="px-4 py-2 bg-kolo-bg text-kolo-muted text-sm font-semibold rounded-xl hover:bg-kolo-border transition-colors">
          Osvježi
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {logs.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-kolo-muted">Nema audit zapisa.</p>
        ) : (
          logs.map((l, i) => (
            <div key={l.id} className={`px-4 py-3 ${i < logs.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-kolo-green-700">{l.akcija}</span>
                    {l.targetId && (
                      <span className="text-xs text-kolo-muted truncate max-w-[120px]">{l.targetId}</span>
                    )}
                  </div>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {l.adminPseudonim}
                    {l.detalji && <span className="text-kolo-muted"> — {l.detalji}</span>}
                  </p>
                </div>
                <span className="text-xs text-kolo-muted shrink-0">
                  {new Date(l.createdAt).toLocaleString("sr-RS", {
                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Vesti (blog Fondacije) ────────────────────────────────────────────────────

function VestiTab({ objave, onDone }: { objave: BlogObjavaAdmin[]; onDone: () => void }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [naslov, setNaslov] = useState("");
  const [sadrzaj, setSadrzaj] = useState("");
  const [datum, setDatum] = useState("");
  const [salje, setSalje] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  function resetForma() {
    setEditId(null);
    setNaslov("");
    setSadrzaj("");
    setDatum("");
    setPoruka(null);
  }

  function pocniIzmenu(o: BlogObjavaAdmin) {
    setEditId(o.id);
    setNaslov(o.title);
    setSadrzaj(o.content);
    setDatum(o.publishedAt.slice(0, 16));
    setPoruka(null);
  }

  async function sacuvaj(e: React.FormEvent) {
    e.preventDefault();
    if (!naslov.trim() || !sadrzaj.trim() || salje) return;
    setSalje(true);
    setPoruka(null);

    const url = editId ? `/api/admin/blog/${editId}` : "/api/admin/blog";
    const method = editId ? "PATCH" : "POST";
    const body: { title: string; content: string; publishedAt?: string } = {
      title: naslov.trim(),
      content: sadrzaj.trim(),
    };
    if (datum) body.publishedAt = new Date(datum).toISOString();

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setPoruka({ text: data.error ?? "Greška.", ok: false });
        return;
      }
      setPoruka({ text: editId ? "Objava izmenjena." : "Objava sačuvana.", ok: true });
      resetForma();
      setTimeout(onDone, 800);
    } catch {
      setPoruka({ text: "Greška u mreži.", ok: false });
    } finally {
      setSalje(false);
    }
  }

  async function obrisi(id: string) {
    if (!confirm("Obriši ovu objavu?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      onDone();
    } else {
      const data = await res.json();
      alert(data.error ?? "Greška.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Forma */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5">
        <h3 className="text-sm font-semibold text-kolo-text mb-3">
          {editId ? "Izmeni objavu" : "Nova objava"}
        </h3>
        <form onSubmit={sacuvaj} className="space-y-3">
          <input
            type="text"
            value={naslov}
            onChange={(e) => setNaslov(e.target.value)}
            placeholder="Naslov"
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
          />
          <textarea
            value={sadrzaj}
            onChange={(e) => setSadrzaj(e.target.value)}
            placeholder="Sadržaj objave (običan tekst, novi red = novi paragraf)"
            rows={8}
            maxLength={20000}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-y"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-xs text-kolo-muted">
              Datum objave (opciono):{" "}
              <input
                type="datetime-local"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                className="ml-1 px-2 py-1 rounded border border-kolo-border text-xs"
              />
            </label>
            <span className="text-xs text-kolo-muted ml-auto">
              {sadrzaj.length} / 20.000 znakova
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!naslov.trim() || !sadrzaj.trim() || salje}
              className="px-5 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors disabled:opacity-60"
            >
              {salje ? "..." : editId ? "Sačuvaj izmene" : "Objavi"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForma}
                className="px-5 py-2 bg-white border border-kolo-border text-kolo-muted text-sm font-medium rounded-xl hover:bg-kolo-bg transition-colors"
              >
                Otkaži
              </button>
            )}
          </div>
          {poruka && (
            <p
              className={`text-sm px-3 py-2 rounded-xl ${
                poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"
              }`}
            >
              {poruka.text}
            </p>
          )}
        </form>
      </div>

      {/* Lista postojećih */}
      <div>
        <h3 className="text-sm font-semibold text-kolo-text mb-3">
          Postojeće objave ({objave.length})
        </h3>
        {objave.length === 0 ? (
          <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
            Još uvek nema objava.
          </div>
        ) : (
          <div className="space-y-2">
            {objave.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl border border-kolo-border p-4 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-kolo-text">{o.title}</p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {new Date(o.publishedAt).toLocaleString("sr-RS", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}{" "}
                    · {o.authorPseudonim}
                  </p>
                  <p className="text-xs text-kolo-muted mt-1 line-clamp-2">
                    {o.content.slice(0, 200)}
                    {o.content.length > 200 ? "…" : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => pocniIzmenu(o)}
                    className="px-3 py-1.5 bg-white border border-kolo-border text-kolo-text text-xs font-medium rounded-lg hover:bg-kolo-bg transition-colors"
                  >
                    Izmeni
                  </button>
                  <button
                    onClick={() => obrisi(o.id)}
                    className="px-3 py-1.5 bg-white border border-kolo-danger/20 text-kolo-danger text-xs font-medium rounded-lg hover:bg-kolo-danger-light transition-colors"
                  >
                    Obriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
