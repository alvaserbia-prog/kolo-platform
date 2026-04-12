"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PendingRequest {
  requestId: string;
  pseudonim: string;
  email: string | null;
  jmbg: string;
  imaFotografije: boolean;
  createdAt: string;
  imaReferral: boolean;
}

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
  zadruge: { ukupno: number; zadrugara: number };
  finansije: { opticaj: number; bankaBalance: number };
  zrno: { kodKorisnika: number; uBanci: number; ukupno: number };
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

interface ZadrugaListItem {
  id: string;
  name: string;
  location: string | null;
  status: string;
  balance: number;
  clanovi: number;
  projekti: number;
  createdAt: string;
}

interface PendingZadruga {
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
  zadrugaName: string | null;
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

interface AdminPendingRadnaEvidencija {
  id: string;
  pseudonim: string;
  oglasTitle: string;
  date: string;
  hoursWorked: number;
  amount: number;
  description: string;
  createdAt: string;
}

interface AdminZaposljavanjeData {
  oglasi: AdminOglasItem[];
  pendingPrijave: AdminPendingPrijava[];
  pendingEvidencije: AdminPendingRadnaEvidencija[];
}

interface PokroviteljItem {
  id: string;
  naziv: string;
  pib: string;
  vlasnikPseudonim: string;
  zadrugaName: string | null;
  rsdKumulativ: number;
  trenutniNivo: number;
  status: string;
  brDoprinosa: number;
  createdAt: string;
}

interface AdminKlijentProps {
  pending: PendingRequest[];
  users: KorisnikInfo[];
  opticaj: number;
  pendingZadruge: PendingZadruga[];
  adminProgrami: AdminProgramiData;
  adminZaposljavnje: AdminZaposljavanjeData;
  adminPokrovitelji: PokroviteljItem[];
  dashboard: DashboardData;
  auditLogs: AuditLogEntry[];
  zadrugeLista: ZadrugaListItem[];
  verifikovaniKorisnici: { id: string; pseudonim: string }[];
  zadrugeLista2: { id: string; name: string }[];
}

const roleLabel: Record<string, string> = {
  FIZICKO_LICE: "Fizičko lice",
  ZADRUGAR: "Zadrugar",
  ADMIN: "Admin",
};

const statusBoja: Record<string, string> = {
  ACTIVE:    "bg-kolo-green-100 text-kolo-green-700",
  SUSPENDED: "bg-kolo-gold-100 text-kolo-gold-600",
  EXCLUDED:  "bg-kolo-danger-light text-kolo-danger",
};

type Tab = "dashboard" | "pending" | "zadruge" | "programi" | "zaposljavnje" | "pokrovitelji" | "korisnici" | "emisija" | "audit";

export default function AdminKlijent({ pending, users, opticaj, pendingZadruge, adminProgrami, adminZaposljavnje, adminPokrovitelji, dashboard, auditLogs, zadrugeLista, verifikovaniKorisnici, zadrugeLista2 }: AdminKlijentProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");

  const ukupnoPendingProgrami = adminProgrami.pendingEnrollments.length + adminProgrami.pendingEvidencije.length;
  const ukupnoPendingZaposl = adminZaposljavnje.pendingPrijave.length + adminZaposljavnje.pendingEvidencije.length;
  const ukupnoPending = pending.length + pendingZadruge.length + ukupnoPendingProgrami;

  const tabs: [Tab, string][] = [
    ["dashboard", "Dashboard"],
    ["pending", `Na čekanju${ukupnoPending > 0 ? ` (${ukupnoPending})` : ""}`],
    ["zadruge", "Zadruge"],
    ["programi", "Programi"],
    ["zaposljavnje", `Zapošljavanje${ukupnoPendingZaposl > 0 ? ` (${ukupnoPendingZaposl})` : ""}`],
    ["pokrovitelji", `Pokrovitelji${adminPokrovitelji.length > 0 ? ` (${adminPokrovitelji.length})` : ""}`],
    ["korisnici", "Korisnici"],
    ["emisija", "Finansije"],
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

      {/* Na čekanju — verifikacije + zadruge osnivanje + programi */}
      {tab === "pending" && (
        <div className="space-y-4">
          {pending.length === 0 && (
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
              Nema zahteva koji čekaju pregled.
            </div>
          )}
          {pending.map((vr) => (
            <VerifikacijaKartica key={vr.requestId} vr={vr} onDone={() => router.refresh()} />
          ))}
        </div>
      )}

      {/* Zadruge */}
      {/* Zadruge — pending osnivanje + lista aktivnih */}
      {tab === "zadruge" && <ZadrugeLista pendingZadruge={pendingZadruge} zadrugeLista={zadrugeLista} onDone={() => router.refresh()} />}

      {/* Programi */}
      {tab === "programi" && <AdminProgramiTab data={adminProgrami} onDone={() => router.refresh()} />}

      {/* Zapošljavanje */}
      {tab === "zaposljavnje" && <AdminZaposljavanjeTab data={adminZaposljavnje} onDone={() => router.refresh()} />}

      {/* Pokrovitelji */}
      {tab === "pokrovitelji" && (
        <AdminPokroviteljiTab
          pokrovitelji={adminPokrovitelji}
          verifikovaniKorisnici={verifikovaniKorisnici}
          zadruge={zadrugeLista2}
          onDone={() => router.refresh()}
        />
      )}

      {/* Korisnici */}
      {tab === "korisnici" && <KorisniciTab users={users} onDone={() => router.refresh()} />}

      {/* Finansije */}
      {tab === "emisija" && <EmisijaTab opticaj={opticaj} onSuccess={() => router.refresh()} />}

      {/* Audit log */}
      {tab === "audit" && <AuditLogTab logs={auditLogs} onRefresh={() => router.refresh()} />}
    </div>
  );
}

// ── Kartica za zahtev za osnivanje zadruge ────────────────────────────────────

function ZadrugaZahtevKartica({ z, onDone }: { z: PendingZadruga; onDone: () => void }) {
  const [razlog, setRazlog] = useState("");
  const [showOdbij, setShowOdbij] = useState(false);
  const [loading, setLoading] = useState<"odobri" | "odbij" | null>(null);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  async function odobri() {
    setLoading("odobri");
    setPoruka(null);
    const res = await fetch(`/api/admin/zadruge/${z.id}/odobri`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (res.ok) {
      setPoruka({ text: `Zadruga "${z.name}" odobrena. Emitovano 50.000 POEN.`, ok: true });
      setTimeout(onDone, 1500);
    } else {
      setPoruka({ text: data.error ?? "Greška.", ok: false });
    }
  }

  async function odbij() {
    if (!razlog.trim()) return;
    setLoading("odbij");
    setPoruka(null);
    const res = await fetch(`/api/admin/zadruge/${z.id}/odbij`, {
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

// ── Kartica za jedan zahtev ────────────────────────────────────────────────────

function VerifikacijaKartica({ vr, onDone }: { vr: PendingRequest; onDone: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [vidiSliku, setVidiSliku] = useState<"front" | "back" | null>(null);
  const [razlog, setRazlog] = useState("");
  const [showOdbij, setShowOdbij] = useState(false);
  const [loading, setLoading] = useState<"odobri" | "odbij" | null>(null);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  async function odobri() {
    setLoading("odobri");
    setPoruka(null);
    const res = await fetch(`/api/admin/verifikacija/${vr.requestId}`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (res.ok) {
      setPoruka({ text: "Odobreno. Emitovano 1.000 POEN.", ok: true });
      setTimeout(onDone, 1200);
    } else {
      setPoruka({ text: data.error ?? "Greška.", ok: false });
    }
  }

  async function odbij() {
    if (!razlog.trim()) return;
    setLoading("odbij");
    setPoruka(null);
    const res = await fetch(`/api/admin/verifikacija/${vr.requestId}/odbij`, {
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
    <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
      {/* Zaglavlje */}
      <div className="px-5 py-4 flex justify-between items-start">
        <div>
          <p className="font-semibold text-kolo-text">{vr.pseudonim}</p>
          <p className="text-sm text-kolo-muted mt-0.5">{vr.email}</p>
          <p className="text-xs text-kolo-muted mt-1">
            Poslato: {new Date(vr.createdAt).toLocaleDateString("sr-RS", {
              day: "2-digit", month: "long", year: "numeric",
            })}
            {vr.imaReferral && (
              <span className="ml-2 bg-kolo-green-100 text-kolo-green-700 px-2 py-0.5 rounded text-xs font-medium">
                Preporuka
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-kolo-muted hover:text-kolo-muted underline mt-1"
        >
          {expanded ? "Sakrij" : "Pregledaj"}
        </button>
      </div>

      {/* Detalji */}
      {expanded && (
        <div className="border-t border-kolo-border px-5 py-4 space-y-4">
          {/* JMBG */}
          <div>
            <p className="text-xs text-kolo-muted mb-1">JMBG</p>
            <p className="font-mono text-sm font-semibold text-kolo-text tracking-widest">{vr.jmbg}</p>
          </div>

          {/* Fotografije LK */}
          {vr.imaFotografije && (
            <div>
              <p className="text-xs text-kolo-muted mb-2">Fotografije lične karte</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setVidiSliku(vidiSliku === "front" ? null : "front")}
                  className="flex-1 py-2 rounded-xl border border-kolo-border text-xs font-medium text-kolo-muted hover:bg-kolo-bg transition-colors"
                >
                  {vidiSliku === "front" ? "Sakrij prednju stranu" : "Prednja strana"}
                </button>
                <button
                  onClick={() => setVidiSliku(vidiSliku === "back" ? null : "back")}
                  className="flex-1 py-2 rounded-xl border border-kolo-border text-xs font-medium text-kolo-muted hover:bg-kolo-bg transition-colors"
                >
                  {vidiSliku === "back" ? "Sakrij zadnju stranu" : "Zadnja strana"}
                </button>
              </div>
              {vidiSliku && (
                <div className="mt-2 rounded-xl overflow-hidden border border-kolo-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/admin/dokument/${vr.requestId}/${vidiSliku}`}
                    alt={vidiSliku === "front" ? "Prednja strana LK" : "Zadnja strana LK"}
                    className="w-full object-contain max-h-64"
                  />
                </div>
              )}
            </div>
          )}

          {/* Akcije */}
          {!poruka && (
            <div className="space-y-3 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={odobri}
                  disabled={loading !== null}
                  className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
                >
                  {loading === "odobri" ? "Obrađujem..." : "Odobri"}
                </button>
                <button
                  onClick={() => setShowOdbij((v) => !v)}
                  disabled={loading !== null}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light transition-colors disabled:opacity-60"
                >
                  Odbij
                </button>
              </div>

              {showOdbij && (
                <div className="space-y-2">
                  <textarea
                    value={razlog}
                    onChange={(e) => setRazlog(e.target.value)}
                    placeholder="Razlog odbijanja (korisnik će ga videti)..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-red-400 resize-none transition-colors"
                  />
                  <button
                    onClick={odbij}
                    disabled={loading !== null || !razlog.trim()}
                    className="w-full py-2.5 rounded-xl bg-kolo-danger text-white text-sm font-semibold hover:bg-kolo-danger transition-colors disabled:opacity-60"
                  >
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
      )}
    </div>
  );
}

// ── Zapošljavanje tab ─────────────────────────────────────────────────────────

const sourceLabel: Record<string, string> = { FONDACIJA: "Fondacija", ZADRUGA: "Zadruga", PROJEKAT: "Projekat" };
const sourceCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  ZADRUGA:   "bg-kolo-info-light text-kolo-info",
  PROJEKAT:  "bg-purple-50 text-purple-700",
};

function AdminZaposljavanjeTab({ data, onDone }: { data: AdminZaposljavanjeData; onDone: () => void }) {
  const [view, setView] = useState<"oglasi" | "prijave" | "evidencije" | "novi">("oglasi");
  const [loading, setLoading] = useState<string | null>(null);
  const [poruke, setPoruke] = useState<Record<string, { text: string; ok: boolean }>>({});

  async function odobriPrijavu(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/zaposljavnje/prijave/${id}/odobri`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? "Odobreno." : (d.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function odbijPrijavu(id: string, razlog: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/zaposljavnje/prijave/${id}/odbij`, {
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
    const res = await fetch(`/api/admin/zaposljavnje/evidencija/${id}/odobri`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? `Odobreno. Emitovano ${d.amount?.toLocaleString("sr-RS")} POEN.` : (d.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function odbijEvidenciju(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/zaposljavnje/evidencija/${id}/odbij`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? "Odbijeno." : (d.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function zatvoriOglas(id: string) {
    if (!confirm("Zatvoriti oglas?")) return;
    setLoading(id);
    const res = await fetch(`/api/admin/zaposljavnje/oglasi/${id}/zatvori`, { method: "POST" });
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
                    {o.zadrugaName && <span className="text-xs text-kolo-muted">{o.zadrugaName}</span>}
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
  const [source, setSource] = useState<"FONDACIJA" | "ZADRUGA" | "PROJEKAT">("FONDACIJA");
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
      const res = await fetch("/api/admin/zaposljavnje/oglasi", {
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">Izvor pozicije</label>
          <div className="flex gap-1.5 flex-wrap">
            {(["FONDACIJA", "ZADRUGA", "PROJEKAT"] as const).map((s) => (
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

      <div className="grid grid-cols-3 gap-3">
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
    alert(res.ok ? `ZRNO: kurs ${Number(d.kurs).toFixed(2)}, u Banci: ${d.zrnaUBanci?.toLocaleString("sr-RS")}` : d.error);
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
    const res = await fetch(`/api/admin/programi/zaposljavnje/${id}/odobri`, { method: "POST" });
    if (res.ok) onDone();
    else { const d = await res.json(); alert(d.error); }
  }

  async function odbijEvidenciju(id: string) {
    const res = await fetch(`/api/admin/programi/zaposljavnje/${id}/odbij`, { method: "POST" });
    if (res.ok) onDone();
  }

  return (
    <div className="space-y-6">
      {/* ZRNO tržište */}
      <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-kolo-muted">ZRNO tržište</p>
          <p className="text-xs text-kolo-muted mt-0.5">
            {data.zrnoTrzisjeAktivno ? "Aktivno — kupovina/prodaja ZRNA je moguća" : "Neaktivno — aktivira se pri −1.000.000 POEN (ili ručno)"}
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

      {/* Pending evidencije — Zapošljavanje */}
      {data.pendingEvidencije.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-kolo-muted">Evidencije — Zapošljavanje ({data.pendingEvidencije.length})</h3>
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
  const [rezultat, setRezultat] = useState<{ poenEmitted: number; nivo: number; kurs: number; noviKumulativ: number } | null>(null);
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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Opticaj</p>
          <p className="text-2xl font-bold text-kolo-text">{opticaj.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">POEN u sistemu</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Dnevni limit programa</p>
          <p className="text-2xl font-bold text-kolo-gold-600">{dnevniLimit.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">10% opticaja</p>
        </div>
      </div>

      {/* Rang tabela */}
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-4 py-3 border-b border-kolo-border">
          <h3 className="text-sm font-semibold text-kolo-muted">Rang tabela donacija (Prilog 1)</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-kolo-bg">
              <th className="px-4 py-2 text-left text-kolo-muted font-medium">Kumulativ RSD</th>
              <th className="px-4 py-2 text-center text-kolo-muted font-medium">Nivo</th>
              <th className="px-4 py-2 text-right text-kolo-muted font-medium">Kurs</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["do 2.000",         1,  "1,00×"],
              ["do 5.000",         2,  "1,10×"],
              ["do 10.000",        3,  "1,20×"],
              ["do 20.000",        4,  "1,30×"],
              ["do 50.000",        5,  "1,40×"],
              ["do 100.000",       6,  "1,50×"],
              ["do 200.000",       7,  "1,60×"],
              ["do 500.000",       8,  "1,70×"],
              ["do 1.000.000",     9,  "1,80×"],
              ["do 2.000.000",     10, "1,90×"],
              ["do 5.000.000",     11, "2,00×"],
              ["do 10.000.000",    12, "2,20×"],
              ["do 20.000.000",    13, "2,40×"],
              ["do 50.000.000",    14, "2,70×"],
              ["do 100.000.000",   15, "3,00×"],
              ["do 200.000.000",   16, "3,50×"],
              ["do 500.000.000",   17, "4,00×"],
              ["1.000.000.000+",   18, "5,00×"],
            ].map(([raspon, nivo, kurs], i) => (
              <tr key={i} className="border-t border-kolo-border">
                <td className="px-4 py-2 text-kolo-muted">{raspon}</td>
                <td className="px-4 py-2 text-center font-medium text-kolo-text">{nivo}</td>
                <td className="px-4 py-2 text-right font-semibold text-kolo-green-700">{kurs}</td>
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
              <p className="font-semibold">Emisija uspešna!</p>
              <p className="mt-1">Emitovano: <strong>{rezultat.poenEmitted.toLocaleString("sr-RS")} POEN</strong></p>
              <p>Nivo: {rezultat.nivo} · Kurs: ×{rezultat.kurs.toFixed(2)}</p>
              <p className="text-xs text-kolo-green-700 mt-1">Novi kumulativ: {rezultat.noviKumulativ.toLocaleString("sr-RS")} RSD</p>
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
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Korisnici ukupno</p>
          <p className="text-2xl font-bold text-kolo-text">{data.korisnici.ukupno.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Verifikovani</p>
          <p className="text-2xl font-bold text-kolo-green-700">{data.korisnici.verifikovanih.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Suspendovani</p>
          <p className="text-2xl font-bold text-kolo-gold-600">{data.korisnici.suspendovanih.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Zadruge */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Aktivne zadruge</p>
          <p className="text-2xl font-bold text-kolo-text">{data.zadruge.ukupno.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Zadrugari</p>
          <p className="text-2xl font-bold text-kolo-text">{data.zadruge.zadrugara.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Finansije */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Opticaj (POEN)</p>
          <p className="text-2xl font-bold text-kolo-text">{data.finansije.opticaj.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Ukupno transakcija</p>
          <p className="text-2xl font-bold text-kolo-text">{data.ukupnoTransakcija.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* ZRNO */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">ZRNO kod korisnika</p>
          <p className="text-2xl font-bold text-kolo-gold-600">{data.zrno.kodKorisnika.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">ZRNO u Banci</p>
          <p className="text-2xl font-bold text-kolo-text">{data.zrno.uBanci.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">Ukupno ZRNA</p>
          <p className="text-2xl font-bold text-kolo-muted">{data.zrno.ukupno.toLocaleString("sr-RS")}</p>
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

// ── Zadruge lista tab ─────────────────────────────────────────────────────────

function ZadrugeLista({ pendingZadruge, zadrugeLista, onDone }: {
  pendingZadruge: PendingZadruga[];
  zadrugeLista: ZadrugaListItem[];
  onDone: () => void;
}) {
  const statusZadruge: Record<string, string> = {
    ACTIVE:   "bg-kolo-green-100 text-kolo-green-700",
    PENDING:  "bg-kolo-gold-100 text-kolo-gold-600",
    REJECTED: "bg-kolo-danger-light text-kolo-danger",
    CLOSED:   "bg-kolo-bg text-kolo-muted",
  };

  return (
    <div className="space-y-6">
      {pendingZadruge.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-kolo-muted">Zahtevi za osnivanje ({pendingZadruge.length})</h3>
          {pendingZadruge.map((z) => (
            <ZadrugaZahtevKartica key={z.id} z={z} onDone={onDone} />
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-5 py-3 border-b border-kolo-border">
          <h3 className="text-sm font-semibold text-kolo-muted">Sve zadruge ({zadrugeLista.length})</h3>
        </div>
        {zadrugeLista.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-kolo-muted">Nema zadruga.</p>
        ) : (
          zadrugeLista.map((z, i) => (
            <div key={z.id} className={`px-5 py-3 flex justify-between items-center gap-3 ${i < zadrugeLista.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-kolo-text truncate">{z.name}</p>
                {z.location && <p className="text-xs text-kolo-muted truncate">{z.location}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs text-kolo-muted">
                <span>{z.clanovi} čl.</span>
                <span>{z.projekti} proj.</span>
                <span className="font-mono">{z.balance.toLocaleString("sr-RS")} P</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusZadruge[z.status] ?? "bg-kolo-bg text-kolo-muted"}`}>
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
  const [rucnaKorisnik, setRucnaKorisnik] = useState<KorisnikInfo | null>(null);
  const [izmeniKorisnik, setIzmeniKorisnik] = useState<KorisnikInfo | null>(null);

  const filtered = users.filter((u) =>
    u.pseudonim.toLowerCase().includes(filter.toLowerCase())
  );

  async function akcija(userId: string, tip: "suspenduj" | "aktiviraj" | "iskljuci") {
    if (tip === "iskljuci" && !confirm("Trajno isključiti korisnika iz sistema?")) return;
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
    setLoadingId(null);
    if (res.ok) onDone();
    else { const d = await res.json(); alert(d.error ?? "Greška."); }
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
                    {!u.verified && u.status === "ACTIVE" && (
                      <button onClick={() => setRucnaKorisnik(u)} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold rounded-lg hover:bg-kolo-green-500 hover:text-white disabled:opacity-60 transition-colors">
                        Verifikuj ručno
                      </button>
                    )}
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
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {rucnaKorisnik && (
        <RucnaVerifikacijaForma
          korisnik={rucnaKorisnik}
          onClose={() => setRucnaKorisnik(null)}
          onDone={() => { setRucnaKorisnik(null); onDone(); }}
        />
      )}

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

function RucnaVerifikacijaForma({ korisnik, onClose, onDone }: {
  korisnik: KorisnikInfo;
  onClose: () => void;
  onDone: () => void;
}) {
  const [jmbg, setJmbg] = useState("");
  const [potvrda, setPotvrda] = useState(false);
  const [loading, setLoading] = useState(false);
  const [greska, setGreska] = useState("");

  async function potvrdi() {
    setGreska("");
    if (jmbg.length !== 13 || !/^\d{13}$/.test(jmbg)) {
      setGreska("JMBG mora imati tačno 13 cifara.");
      return;
    }
    if (!potvrda) {
      setGreska("Morate potvrditi da ste videli dokument lično.");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/admin/korisnici/${korisnik.id}/rucna-verifikacija`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jmbg }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      onDone();
    } else {
      setGreska(data.error ?? "Greška pri verifikaciji.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-kolo-text">Ručna verifikacija</h3>
          <p className="text-sm text-kolo-muted mt-0.5">Korisnik: <span className="font-medium text-kolo-muted">{korisnik.pseudonim}</span></p>
        </div>

        <div className="box-warning px-4 py-3 text-sm text-kolo-gold-600">
          Ovu akciju koristite samo ako ste <strong>lično videli</strong> dokument korisnika i potvrdili identitet.
        </div>

        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">JMBG</label>
          <input
            type="text"
            value={jmbg}
            onChange={(e) => setJmbg(e.target.value.replace(/\D/g, "").slice(0, 13))}
            placeholder="0000000000000"
            className="w-full px-4 py-3 rounded-xl border border-kolo-border font-mono text-sm outline-none focus:border-kolo-green-700 transition-colors"
          />
          <p className="mt-1 text-xs text-kolo-muted">{jmbg.length}/13 cifara</p>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={potvrda} onChange={(e) => setPotvrda(e.target.checked)}
            className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
          <span className="text-xs text-kolo-muted">
            Potvrđujem da sam lično video/la dokument sa ovim JMBG i identifikovao/la korisnika
          </span>
        </label>

        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-kolo-border text-sm font-medium text-kolo-muted hover:bg-kolo-bg transition-colors disabled:opacity-60">
            Otkaži
          </button>
          <button onClick={potvrdi} disabled={loading || jmbg.length !== 13 || !potvrda}
            className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 transition-colors disabled:opacity-50">
            {loading ? "Verifikujem..." : "Verifikuj"}
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
  zadruge,
  onDone,
}: {
  pokrovitelji: PokroviteljItem[];
  verifikovaniKorisnici: { id: string; pseudonim: string }[];
  zadruge: { id: string; name: string }[];
  onDone: () => void;
}) {
  const [subTab, setSubTab] = useState<"lista" | "novi" | "doprinos">("lista");
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
  const [noviZadrugaId, setNoviZadrugaId] = useState("");

  // Forma — doprinos
  const [doprinosRsd, setDoprinosRsd] = useState("");
  const [doprinosTip, setDoprinosTip] = useState<"SPONZORSTVO_ZADRUGE" | "DONACIJA_FONDACIJI">("DONACIJA_FONDACIJI");
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
        zadrugaId: noviZadrugaId || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setPoruka({ text: "Pokrovitelj kreiran.", ok: true });
      setNoviNaziv(""); setNoviPib(""); setNoviAdresa(""); setNoviEmail(""); setNoviTelefon(""); setNoviVlasnikId(""); setNoviZadrugaId("");
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
        {(["lista", "novi", "doprinos"] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setSubTab(s); setPoruka(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              subTab === s ? "border-kolo-green-700 text-kolo-green-700" : "border-transparent text-kolo-muted hover:text-kolo-muted"
            }`}
          >
            {s === "lista" ? `Lista (${pokrovitelji.length})` : s === "novi" ? "Novi pokrovitelj" : "Evidentiraj doprinos"}
          </button>
        ))}
      </div>

      {poruka && (
        <div className={`px-4 py-3 rounded-xl text-sm ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>
          {poruka.text}
        </div>
      )}

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
                    {p.zadrugaName && ` · Zadruga: ${p.zadrugaName}`}
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
          <div className="grid grid-cols-2 gap-3">
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
          <div className="grid grid-cols-2 gap-3">
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
            <label className="block text-xs font-medium text-kolo-muted mb-1">Zadruga (opciono)</label>
            <select value={noviZadrugaId} onChange={(e) => setNoviZadrugaId(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500">
              <option value="">— bez zadruge —</option>
              {zadruge.map((z) => (
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
          <div className="grid grid-cols-2 gap-3">
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
                onChange={(e) => setDoprinosTip(e.target.value as "SPONZORSTVO_ZADRUGE" | "DONACIJA_FONDACIJI")}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
              >
                <option value="DONACIJA_FONDACIJI">Donacija Fondaciji</option>
                <option value="SPONZORSTVO_ZADRUGE">Sponzorstvo zadruge</option>
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
