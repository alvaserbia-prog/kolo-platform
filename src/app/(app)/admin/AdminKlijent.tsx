"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PendingRequest {
  requestId: string;
  pseudonim: string;
  email: string;
  jmbg: string;
  createdAt: string;
  imaReferral: boolean;
}

interface KorisnikInfo {
  id: string;
  pseudonim: string;
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

interface AdminKlijentProps {
  pending: PendingRequest[];
  users: KorisnikInfo[];
  opticaj: number;
  pendingZadruge: PendingZadruga[];
  adminProgrami: AdminProgramiData;
  dashboard: DashboardData;
  auditLogs: AuditLogEntry[];
  zadrugeLista: ZadrugaListItem[];
}

const roleLabel: Record<string, string> = {
  FIZICKO_LICE: "Fizičko lice",
  ZADRUGAR: "Zadrugar",
  ADMIN: "Admin",
};

const statusBoja: Record<string, string> = {
  ACTIVE:    "bg-green-50 text-green-700",
  SUSPENDED: "bg-amber-50 text-amber-700",
  EXCLUDED:  "bg-red-50 text-red-600",
};

type Tab = "dashboard" | "pending" | "zadruge" | "programi" | "korisnici" | "emisija" | "audit";

export default function AdminKlijent({ pending, users, opticaj, pendingZadruge, adminProgrami, dashboard, auditLogs, zadrugeLista }: AdminKlijentProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");

  const ukupnoPendingProgrami = adminProgrami.pendingEnrollments.length + adminProgrami.pendingEvidencije.length;
  const ukupnoPending = pending.length + pendingZadruge.length + ukupnoPendingProgrami;

  const tabs: [Tab, string][] = [
    ["dashboard", "Dashboard"],
    ["pending", `Na čekanju${ukupnoPending > 0 ? ` (${ukupnoPending})` : ""}`],
    ["zadruge", "Zadruge"],
    ["programi", "Programi"],
    ["korisnici", "Korisnici"],
    ["emisija", "Finansije"],
    ["audit", "Audit log"],
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin panel</h1>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-green-700 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
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
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">
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
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900">{z.name}</p>
          {z.location && <p className="text-xs text-gray-400 mt-0.5">{z.location}</p>}
          {z.description && <p className="text-sm text-gray-500 mt-1">{z.description}</p>}
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-xs text-gray-400">Inicijator</p>
          <p className="text-sm font-medium text-gray-800">{z.inicijatorPseudonim}</p>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-400">
        <span>{z.brOsnivaca} osnivača</span>
        <span>{new Date(z.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</span>
      </div>

      {!poruka && (
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <button onClick={odobri} disabled={loading !== null}
              className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-60">
              {loading === "odobri" ? "Obrađujem..." : "Odobri osnivanje"}
            </button>
            <button onClick={() => setShowOdbij((v) => !v)} disabled={loading !== null}
              className="flex-1 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-60">
              Odbij
            </button>
          </div>

          {showOdbij && (
            <div className="space-y-2">
              <textarea value={razlog} onChange={(e) => setRazlog(e.target.value)}
                placeholder="Razlog odbijanja..." rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 resize-none transition-colors" />
              <button onClick={odbij} disabled={loading !== null || !razlog.trim()}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
                {loading === "odbij" ? "Odbijam..." : "Potvrdi odbijanje"}
              </button>
            </div>
          )}
        </div>
      )}

      {poruka && (
        <p className={`text-sm px-4 py-3 rounded-xl ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {poruka.text}
        </p>
      )}
    </div>
  );
}

// ── Kartica za jedan zahtev ────────────────────────────────────────────────────

function VerifikacijaKartica({ vr, onDone }: { vr: PendingRequest; onDone: () => void }) {
  const [expanded, setExpanded] = useState(false);
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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Zaglavlje */}
      <div className="px-5 py-4 flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900">{vr.pseudonim}</p>
          <p className="text-sm text-gray-400 mt-0.5">{vr.email}</p>
          <p className="text-xs text-gray-400 mt-1">
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
          className="text-xs text-gray-400 hover:text-gray-600 underline mt-1"
        >
          {expanded ? "Sakrij" : "Pregledaj"}
        </button>
      </div>

      {/* Detalji */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {/* JMBG */}
          <div>
            <p className="text-xs text-gray-400 mb-1">JMBG</p>
            <p className="font-mono text-sm font-semibold text-gray-900 tracking-widest">{vr.jmbg}</p>
          </div>

          {/* Slike */}
          <div className="grid grid-cols-2 gap-3">
            {(["front", "back"] as const).map((side) => (
              <div key={side} className="space-y-1">
                <p className="text-xs text-gray-400">{side === "front" ? "Prednja strana" : "Zadnja strana"}</p>
                <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={`/api/admin/dokument/${vr.requestId}/${side}`}
                    alt={side === "front" ? "Prednja strana" : "Zadnja strana"}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <a
                  href={`/api/admin/dokument/${vr.requestId}/${side}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-700 hover:underline"
                >
                  Otvori u novom tabu
                </a>
              </div>
            ))}
          </div>

          {/* Akcije */}
          {!poruka && (
            <div className="space-y-3 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={odobri}
                  disabled={loading !== null}
                  className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-60"
                >
                  {loading === "odobri" ? "Obrađujem..." : "Odobri"}
                </button>
                <button
                  onClick={() => setShowOdbij((v) => !v)}
                  disabled={loading !== null}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-60"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 resize-none transition-colors"
                  />
                  <button
                    onClick={odbij}
                    disabled={loading !== null || !razlog.trim()}
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    {loading === "odbij" ? "Odbijam..." : "Potvrdi odbijanje"}
                  </button>
                </div>
              )}
            </div>
          )}

          {poruka && (
            <p className={`text-sm px-4 py-3 rounded-xl ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {poruka.text}
            </p>
          )}
        </div>
      )}
    </div>
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
      <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gray-700">ZRNO tržište</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {data.zrnoTrzisjeAktivno ? "Aktivno — kupovina/prodaja ZRNA je moguća" : "Neaktivno — aktivira se pri −1.000.000 POEN (ili ručno)"}
          </p>
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
          <button onClick={pokreniZrnoNocnu} disabled={loadingZrno}
            className="px-3 py-1.5 bg-kolo-gold-600 text-white text-xs font-semibold rounded-xl hover:bg-kolo-gold-400 disabled:opacity-60 transition-colors">
            {loadingZrno ? "..." : "▶ ZRNO obrada"}
          </button>
          <button onClick={toggleZrnoTrziste} disabled={loadingZrno}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 ${data.zrnoTrzisjeAktivno ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-kolo-gold-100 text-kolo-gold-600 hover:bg-kolo-gold-100"}`}>
            {data.zrnoTrzisjeAktivno ? "Deaktiviraj" : "Aktiviraj"}
          </button>
        </div>
      </div>

      {/* Status programa */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">Status programa</h3>
          <button onClick={pokreniNocnu} disabled={loadingNocna}
            className="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-xl hover:bg-green-800 disabled:opacity-60 transition-colors">
            {loadingNocna ? "..." : "▶ Pokreni emisiju"}
          </button>
        </div>
        {nocnaRezultat && (
          <div className="px-5 py-3 border-b border-gray-100 text-xs text-green-700 bg-green-50">{nocnaRezultat}</div>
        )}
        {data.programi.map((p, i) => (
          <div key={p.type} className={`px-5 py-3 flex justify-between items-center ${i < data.programi.length - 1 ? "border-b border-gray-100" : ""}`}>
            <div>
              <span className="text-sm font-medium text-gray-900">{p.label}</span>
              {p.activatedAt && p.isActive && (
                <span className="ml-2 text-xs text-gray-400">aktiviran {new Date(p.activatedAt).toLocaleDateString("sr-RS")}</span>
              )}
            </div>
            <button onClick={() => toggleProgram(p.type)} disabled={loadingToggle === p.type}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 ${p.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
              {loadingToggle === p.type ? "..." : p.isActive ? "Deaktiviraj" : "Aktiviraj"}
            </button>
          </div>
        ))}
      </div>

      {/* Pending prijave na programe */}
      {data.pendingEnrollments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Prijave na programe ({data.pendingEnrollments.length})</h3>
          {data.pendingEnrollments.map((e) => (
            <EnrollmentKartica key={e.id} e={e} onOdobri={(amt) => odobriEnrollment(e.id, amt)} onOdbij={() => odbijEnrollment(e.id)} />
          ))}
        </div>
      )}

      {/* Pending evidencije — Zapošljavanje */}
      {data.pendingEvidencije.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Evidencije — Zapošljavanje ({data.pendingEvidencije.length})</h3>
          {data.pendingEvidencije.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-200 px-5 py-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{e.pseudonim}</p>
                  <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString("sr-RS")}</p>
                </div>
                <span className="text-sm font-bold text-green-700">{e.amount.toLocaleString("sr-RS")} P</span>
              </div>
              <p className="text-sm text-gray-700">{e.description}</p>
              <div className="flex gap-2">
                <button onClick={() => odobriEvidenciju(e.id)}
                  className="flex-1 py-2 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors">
                  Odobri
                </button>
                <button onClick={() => odbijEvidenciju(e.id)}
                  className="flex-1 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                  Odbij
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.pendingEnrollments.length === 0 && data.pendingEvidencije.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          Nema zahteva koji čekaju pregled.
        </div>
      )}

      {/* Istorija emisija */}
      {data.poslednjeEmisije.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Istorija dnevnih emisija</h3>
          </div>
          {data.poslednjeEmisije.map((s, i) => (
            <div key={s.date} className={`px-5 py-3 flex justify-between items-center text-sm ${i < data.poslednjeEmisije.length - 1 ? "border-b border-gray-100" : ""}`}>
              <span className="text-gray-500">{new Date(s.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</span>
              <span className="font-semibold text-green-700">{s.totalEmitted.toLocaleString("sr-RS")} P</span>
              {s.koeficijent < 1 && (
                <span className="text-xs text-amber-600">koef. {s.koeficijent.toFixed(3)}</span>
              )}
              <span className="text-xs text-gray-400">lim. {s.limit.toLocaleString("sr-RS")}</span>
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
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-900">{e.pseudonim}</p>
          <p className="text-xs text-green-700 font-medium">{e.label}</p>
          {metaLines && <p className="text-xs text-gray-400 mt-0.5">{metaLines}</p>}
        </div>
        <span className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString("sr-RS")}</span>
      </div>
      {e.type === "SKOLOVANJE" && (
        <input type="number" min={100} placeholder="Dnevni iznos POEN *" value={dailyAmount}
          onChange={(ev) => setDailyAmount(ev.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
      )}
      <div className="flex gap-2">
        <button onClick={() => onOdobri(dailyAmount ? Number(dailyAmount) : undefined)}
          disabled={e.type === "SKOLOVANJE" && !dailyAmount}
          className="flex-1 py-2 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 disabled:opacity-60 transition-colors">
          Odobri
        </button>
        <button onClick={onOdbij}
          className="flex-1 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
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
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Opticaj</p>
          <p className="text-2xl font-bold text-gray-900">{opticaj.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-gray-400 mt-0.5">POEN u sistemu</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Dnevni limit programa</p>
          <p className="text-2xl font-bold text-amber-600">{dnevniLimit.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-gray-400 mt-0.5">10% opticaja</p>
        </div>
      </div>

      {/* Rang tabela */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Rang tabela donacija (Prilog 1)</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-gray-500 font-medium">Kumulativ RSD</th>
              <th className="px-4 py-2 text-center text-gray-500 font-medium">Nivo</th>
              <th className="px-4 py-2 text-right text-gray-500 font-medium">Kurs</th>
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
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-600">{raspon}</td>
                <td className="px-4 py-2 text-center font-medium text-gray-900">{nivo}</td>
                <td className="px-4 py-2 text-right font-semibold text-green-700">{kurs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forma za donaciju */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Evidentiraj donaciju</h3>
        <form onSubmit={handleDonacija} noValidate className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pseudonim donatora</label>
            <input
              type="text"
              value={pseudonim}
              onChange={(e) => setPseudonim(e.target.value)}
              placeholder="npr. MilanPetrovic"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Iznos donacije (RSD)</label>
            <input
              type="number"
              min={1}
              step={0.01}
              value={amountRSD}
              onChange={(e) => setAmountRSD(e.target.value)}
              placeholder="5000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors font-mono"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {rezultat && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
              <p className="font-semibold">Emisija uspešna!</p>
              <p className="mt-1">Emitovano: <strong>{rezultat.poenEmitted.toLocaleString("sr-RS")} POEN</strong></p>
              <p>Nivo: {rezultat.nivo} · Kurs: ×{rezultat.kurs.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">Novi kumulativ: {rezultat.noviKumulativ.toLocaleString("sr-RS")} RSD</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-60"
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
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Korisnici ukupno</p>
          <p className="text-2xl font-bold text-gray-900">{data.korisnici.ukupno.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Verifikovani</p>
          <p className="text-2xl font-bold text-green-700">{data.korisnici.verifikovanih.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Suspendovani</p>
          <p className="text-2xl font-bold text-amber-600">{data.korisnici.suspendovanih.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Zadruge */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Aktivne zadruge</p>
          <p className="text-2xl font-bold text-gray-900">{data.zadruge.ukupno.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Zadrugari</p>
          <p className="text-2xl font-bold text-gray-900">{data.zadruge.zadrugara.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Finansije */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Opticaj (POEN)</p>
          <p className="text-2xl font-bold text-gray-900">{data.finansije.opticaj.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Ukupno transakcija</p>
          <p className="text-2xl font-bold text-gray-900">{data.ukupnoTransakcija.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* ZRNO */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">ZRNO kod korisnika</p>
          <p className="text-2xl font-bold text-kolo-gold-600">{data.zrno.kodKorisnika.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">ZRNO u Banci</p>
          <p className="text-2xl font-bold text-gray-900">{data.zrno.uBanci.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Ukupno ZRNA</p>
          <p className="text-2xl font-bold text-gray-500">{data.zrno.ukupno.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Zero-sum provjera */}
      <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Zero-sum provjera</p>
          {zeroSum && (
            <p className={`text-sm mt-0.5 font-mono ${zeroSum.ok ? "text-green-700" : "text-red-600"}`}>
              Zbir svih računa: {zeroSum.zbir.toLocaleString("sr-RS")} {zeroSum.ok ? "✓ OK" : "✗ GREŠKA"}
            </p>
          )}
        </div>
        <button onClick={provjeriZeroSum} disabled={loadingZS}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-60 transition-colors shrink-0">
          {loadingZS ? "Provjerava..." : "Provjeri"}
        </button>
      </div>

      <button onClick={onRefresh}
        className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
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
    ACTIVE:   "bg-green-50 text-green-700",
    PENDING:  "bg-amber-50 text-amber-700",
    REJECTED: "bg-red-50 text-red-600",
    CLOSED:   "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-6">
      {pendingZadruge.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Zahtevi za osnivanje ({pendingZadruge.length})</h3>
          {pendingZadruge.map((z) => (
            <ZadrugaZahtevKartica key={z.id} z={z} onDone={onDone} />
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Sve zadruge ({zadrugeLista.length})</h3>
        </div>
        {zadrugeLista.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Nema zadruga.</p>
        ) : (
          zadrugeLista.map((z, i) => (
            <div key={z.id} className={`px-5 py-3 flex justify-between items-center gap-3 ${i < zadrugeLista.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{z.name}</p>
                {z.location && <p className="text-xs text-gray-400 truncate">{z.location}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs text-gray-500">
                <span>{z.clanovi} čl.</span>
                <span>{z.projekti} proj.</span>
                <span className="font-mono">{z.balance.toLocaleString("sr-RS")} P</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusZadruge[z.status] ?? "bg-gray-100 text-gray-500"}`}>
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
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 transition-colors"
      />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Nema korisnika.</p>
        ) : (
          filtered.map((u, i) => (
            <div key={u.id} className={`px-4 py-3 ${i < filtered.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{u.pseudonim}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBoja[u.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {u.status}
                    </span>
                    {!u.verified && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                        neverifikovan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {roleLabel[u.role] ?? u.role} · {u.balance.toLocaleString("sr-RS")} P
                    {u.suspendedReason && <span className="ml-1 text-amber-600">— {u.suspendedReason}</span>}
                  </p>
                </div>
                {u.role !== "ADMIN" && (
                  <div className="flex gap-1.5 shrink-0">
                    {u.status === "ACTIVE" && (
                      <button onClick={() => akcija(u.id, "suspenduj")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100 disabled:opacity-60 transition-colors">
                        Suspenduj
                      </button>
                    )}
                    {u.status === "SUSPENDED" && (
                      <button onClick={() => akcija(u.id, "aktiviraj")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100 disabled:opacity-60 transition-colors">
                        Aktiviraj
                      </button>
                    )}
                    {u.status !== "EXCLUDED" && (
                      <button onClick={() => akcija(u.id, "iskljuci")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 disabled:opacity-60 transition-colors">
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
    </div>
  );
}

// ── Audit log tab ─────────────────────────────────────────────────────────────

function AuditLogTab({ logs, onRefresh }: { logs: AuditLogEntry[]; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{logs.length} zapisa</p>
        <button onClick={onRefresh}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
          Osvježi
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {logs.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Nema audit zapisa.</p>
        ) : (
          logs.map((l, i) => (
            <div key={l.id} className={`px-4 py-3 ${i < logs.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-green-700">{l.akcija}</span>
                    {l.targetId && (
                      <span className="text-xs text-gray-400 truncate max-w-[120px]">{l.targetId}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {l.adminPseudonim}
                    {l.detalji && <span className="text-gray-400"> — {l.detalji}</span>}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
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
