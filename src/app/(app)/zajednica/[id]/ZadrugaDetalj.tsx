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

interface PendingEvidencijaItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface ClanInfo {
  userId: string;
  pseudonim: string;
  isAdmin: boolean;
  joinedAt: string;
  pendingEnrollments: PendingEnrollmentItem[];
  pendingEvidencije: PendingEvidencijaItem[];
}

interface ZadrugaData {
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
  zadruga: ZadrugaData;
  mojeClansvo: { isAdmin: boolean; membershipId: string } | null;
  imaPristupnicu: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}

type Tab = "info" | "clanovi" | "projekti" | "pristupnice" | "programi";

export default function ZadrugaDetalj({ zadruga, mojeClansvo, imaPristupnicu, isVerified, isAdmin }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("info");
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const canManage = mojeClansvo?.isAdmin || isAdmin;

  async function podnesiPristupnicu() {
    setLoading(true); setPoruka(null);
    const res = await fetch(`/api/zadruge/${zadruga.id}/pristupnica`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setPoruka({ text: res.ok ? "Pristupnica poslata! Čekajte odobrenje." : (data.error ?? "Greška."), ok: res.ok });
    if (res.ok) setTimeout(() => router.refresh(), 1500);
  }

  async function istupi() {
    if (!confirm("Da li ste sigurni da želite da istupite iz zadruge?")) return;
    setLoading(true);
    const res = await fetch(`/api/zadruge/${zadruga.id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.push("/zajednica");
  }

  async function odibriPristupnicu(pristupnicaId: string) {
    const res = await fetch(`/api/admin/zadruge/${zadruga.id}/pristupnice/${pristupnicaId}/odobri`, { method: "POST" });
    if (res.ok) router.refresh();
    else { const d = await res.json(); alert(d.error); }
  }

  const ukupnoPendingProgrami = zadruga.clanovi.reduce(
    (s, c) => s + c.pendingEnrollments.length + c.pendingEvidencije.length, 0
  );

  const tabs: [Tab, string][] = [
    ["info", "Informacije"],
    ["clanovi", `Članovi (${zadruga.clanovi.length})`],
    ["projekti", `Projekti (${zadruga.projects.length})`],
    ...(canManage && zadruga.pristupnice.length > 0
      ? [["pristupnice", `Pristupnice (${zadruga.pristupnice.length})`] as [Tab, string]]
      : []),
    ...(canManage && ukupnoPendingProgrami > 0
      ? [["programi", `Programi (${ukupnoPendingProgrami})`] as [Tab, string]]
      : []),
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/zajednica" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Zadruge</Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{zadruga.name}</h1>
            {zadruga.location && <p className="text-sm text-gray-400 mt-0.5">{zadruga.location}</p>}
            {zadruga.description && <p className="text-sm text-gray-600 mt-2">{zadruga.description}</p>}
          </div>
          <div className="shrink-0 bg-green-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-xl font-bold text-green-700">{zadruga.balance.toLocaleString("sr-RS")}</p>
            <p className="text-xs text-green-600">POEN</p>
          </div>
        </div>

        {/* Akcije */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 flex-wrap">
          {!mojeClansvo && !imaPristupnicu && isVerified && (
            <button onClick={podnesiPristupnicu} disabled={loading}
              className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors disabled:opacity-60">
              {loading ? "..." : "Podnesi pristupnicu"}
            </button>
          )}
          {imaPristupnicu && (
            <span className="px-4 py-2 bg-amber-50 text-amber-700 text-sm font-medium rounded-xl border border-amber-200">
              Pristupnica na čekanju
            </span>
          )}
          {mojeClansvo && (
            <>
              <span className="px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-200">
                {mojeClansvo.isAdmin ? "Admin zadruge" : "Član zadruge"}
              </span>
              <button onClick={istupi} disabled={loading}
                className="px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60">
                Istupi
              </button>
            </>
          )}
        </div>
        {poruka && (
          <p className={`mt-3 text-sm px-3 py-2 rounded-lg ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {poruka.text}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-green-700 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Informacije */}
      {tab === "info" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Broj članova</span>
            <span className="font-medium text-gray-900">{zadruga.clanovi.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Stanje novčanika</span>
            <span className="font-bold text-green-700">{zadruga.balance.toLocaleString("sr-RS")} POEN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Aktivnih projekata</span>
            <span className="font-medium text-gray-900">{zadruga.projects.length}</span>
          </div>
        </div>
      )}

      {/* Članovi */}
      {tab === "clanovi" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {zadruga.clanovi.map((c, i) => (
            <div key={c.userId} className={`px-5 py-3 flex justify-between items-center ${i < zadruga.clanovi.length - 1 ? "border-b border-gray-100" : ""}`}>
              <Link href={`/profil/${c.userId}`} className="text-sm font-medium text-kolo-green-700 hover:underline">
                {c.pseudonim}
              </Link>
              <div className="flex items-center gap-2">
                {c.isAdmin && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">Admin</span>}
                <span className="text-xs text-gray-400">{new Date(c.joinedAt).toLocaleDateString("sr-RS")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projekti */}
      {tab === "projekti" && (
        <div className="space-y-3">
          {canManage && <NoviProjekatForma zadrugaId={zadruga.id} onSuccess={() => router.refresh()} />}
          {zadruga.projects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">
              Nema aktivnih projekata.
            </div>
          ) : (
            zadruga.projects.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.title}</p>
                    {p.description && <p className="text-xs text-gray-500 mt-1">{p.description}</p>}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${p.type === "PRIKUPLJANJE" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
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
          {zadruga.pristupnice.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{p.pseudonim}</span>
              <button onClick={() => odibriPristupnicu(p.id)}
                className="px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
                Odobri
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Programi — pending enrollments i evidencije članova (admin) */}
      {tab === "programi" && canManage && (
        <ProgramiAdminTab zadrugaId={zadruga.id} clanovi={zadruga.clanovi} onDone={() => router.refresh()} />
      )}
    </div>
  );
}

// ── Programi admin tab ────────────────────────────────────────────────────────

const labelPrograma: Record<string, string> = {
  ZAPOSLJAVNJE:      "Zapošljavanje",
  PODRSKA_MAJKAMA:   "Podrška majkama",
  PODRSKA_STARIJIMA: "Podrška starijima",
  POSEBNA_BRIGA:     "Posebna briga",
  SKOLOVANJE:        "Školovanje",
};

function ProgramiAdminTab({ zadrugaId, clanovi, onDone }: { zadrugaId: string; clanovi: ClanInfo[]; onDone: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [poruke, setPoruke] = useState<Record<string, { text: string; ok: boolean }>>({});

  async function odobriEnrollment(zadrugaId: string, enrollmentId: string, dailyAmount?: number, razlog?: string, odbij = false) {
    setLoading(enrollmentId);
    const res = await fetch(`/api/zadruge/${zadrugaId}/programi/enrollments/${enrollmentId}/${odbij ? "odbij" : "odobri"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(odbij ? { razlog } : { dailyAmount }),
    });
    const data = await res.json();
    setLoading(null);
    setPoruke((prev) => ({ ...prev, [enrollmentId]: { text: res.ok ? (odbij ? "Odbijeno." : "Odobreno.") : (data.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1200);
  }

  async function odobriEvidenciju(zadrugaId: string, evidencijaId: string, odbij = false) {
    setLoading(evidencijaId);
    const res = await fetch(`/api/zadruge/${zadrugaId}/programi/evidencije/${evidencijaId}/${odbij ? "odbij" : "odobri"}`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    setPoruke((prev) => ({ ...prev, [evidencijaId]: { text: res.ok ? (odbij ? "Odbijeno." : "Odobreno.") : (data.error ?? "Greška."), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1200);
  }

  const svePending = clanovi.flatMap((c) => [
    ...c.pendingEnrollments.map((e) => ({ tip: "enrollment" as const, pseudonim: c.pseudonim, ...e })),
    ...c.pendingEvidencije.map((e) => ({ tip: "evidencija" as const, pseudonim: c.pseudonim, ...e })),
  ]);

  if (svePending.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">
        Nema zahteva koji čekaju odobrenje.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Enrollment zahtevi */}
      {svePending.filter((x) => x.tip === "enrollment").map((item) => {
        if (item.tip !== "enrollment") return null;
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
            onOdobri={(dailyAmount) => odobriEnrollment(zadrugaId, item.id, dailyAmount)}
            onOdbij={(razlog) => odobriEnrollment(zadrugaId, item.id, undefined, razlog, true)}
          />
        );
      })}

      {/* Evidencija zahtevi */}
      {svePending.filter((x) => x.tip === "evidencija").length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Zapošljavanje — evidencije na čekanju</p>
          </div>
          {svePending.filter((x) => x.tip === "evidencija").map((item, i, arr) => {
            if (item.tip !== "evidencija") return null;
            const poruka = poruke[item.id];
            return (
              <div key={item.id} className={`px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.pseudonim}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(item.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900">{item.amount.toLocaleString("sr-RS")} P</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => odobriEvidenciju(zadrugaId, item.id, true)}
                        disabled={loading === item.id}
                        className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 disabled:opacity-60">
                        Odbij
                      </button>
                      <button
                        onClick={() => odobriEvidenciju(zadrugaId, item.id)}
                        disabled={loading === item.id}
                        className="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-800 disabled:opacity-60">
                        Odobri
                      </button>
                    </div>
                  </div>
                </div>
                {poruka && (
                  <p className={`mt-2 text-xs px-3 py-1.5 rounded-lg ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {poruka.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
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

  const trebaIznos = type === "ZAPOSLJAVNJE" || type === "SKOLOVANJE";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-900">{pseudonim}</p>
          <p className="text-xs text-gray-400 mt-0.5">{labelPrograma[type] ?? type} · {new Date(createdAt).toLocaleDateString("sr-RS")}</p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">Na čekanju</span>
      </div>

      {metadata && Object.keys(metadata).length > 0 && (
        <div className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-600 space-y-1">
          {Object.entries(metadata).map(([k, v]) => (
            <div key={k}><span className="text-gray-400">{k}:</span> {String(v)}</div>
          ))}
        </div>
      )}

      {trebaIznos && !showOdbij && (
        <input
          type="number"
          placeholder="Dnevni iznos POEN (opciono)"
          value={dailyAmount}
          onChange={(e) => setDailyAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600"
        />
      )}

      {!showOdbij && (
        <div className="flex gap-2">
          <button onClick={() => setShowOdbij(true)} disabled={loading}
            className="flex-1 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-60">
            Odbij
          </button>
          <button onClick={() => onOdobri(dailyAmount ? Number(dailyAmount) : undefined)} disabled={loading}
            className="flex-1 py-2 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 disabled:opacity-60">
            {loading ? "..." : "Odobri"}
          </button>
        </div>
      )}

      {showOdbij && (
        <div className="space-y-2">
          <textarea rows={2} placeholder="Razlog odbijanja *" value={razlog} onChange={(e) => setRazlog(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 resize-none" />
          <div className="flex gap-2">
            <button onClick={() => setShowOdbij(false)} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium">Odustani</button>
            <button onClick={() => onOdbij(razlog)} disabled={!razlog.trim() || loading}
              className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60">
              {loading ? "..." : "Potvrdi odbijanje"}
            </button>
          </div>
        </div>
      )}

      {poruka && (
        <p className={`text-xs px-3 py-1.5 rounded-lg ${poruka.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {poruka.text}
        </p>
      )}
    </div>
  );
}

// ── Mini forma za novi projekat ────────────────────────────────────────────────

function NoviProjekatForma({ zadrugaId, onSuccess }: { zadrugaId: string; onSuccess: () => void }) {
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
    const res = await fetch(`/api/zadruge/${zadrugaId}/projekti`, {
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
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors">
        + Novi projekat
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-700">Novi projekat</p>
      <input type="text" placeholder="Naziv *" value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600" />
      <textarea rows={2} placeholder="Opis" value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 resize-none" />
      <div className="flex gap-2">
        {(["PRIKUPLJANJE", "REDISTRIBUCIJA"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${type === t ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {t === "PRIKUPLJANJE" ? "Prikupljanje" : "Redistribucija"}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => setShow(false)}
          className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium">Otkaži</button>
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : "Kreiraj"}
        </button>
      </div>
    </form>
  );
}
