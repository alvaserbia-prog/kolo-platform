"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import OsnivaciTab from "./OsnivaciTab";
import PokroviteljPrijaveTab from "./PokroviteljPrijaveTab";
import NadzorTab, { NadzorNalaz } from "./NadzorTab";
import { jeSuperadmin } from "@/lib/dozvole";
import Pseudonim from "@/components/Pseudonim";

interface KorisnikInfo {
  id: string;
  pseudonim: string;
  email: string | null;
  tipKorisnika: string;
  admin: string;
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
  poslednjeEmisije: EmisionaSumarija[];
}

interface AdminOglasItem {
  id: string;
  title: string;
  source: string;
  predlozeniPoen: number;
  saOdobravanjem: boolean;
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
  predlozeniPoen: number;
  positions: number;
  planIzvrsenja: string | null;
  createdAt: string;
}

interface AdminPendingOglasEvidencija {
  id: string;
  pseudonim: string;
  oglasTitle: string;
  date: string;
  predlozeniPoen: number;
  description: string;
  dokaz: string | null;
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

interface DonacijaItem {
  id: string;
  pseudonim: string;
  amountRSD: number;
  cumulativeRSD: number;
  level: number;
  poenEmitted: number;
  nacinUplate: string;
  referenceNumber: string | null;
  createdAt: string;
}

interface PrigovorItem {
  id: string;
  pseudonim: string;
  opis: string;
  tipOdluke: string;
  status: string;
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
  nadzorNalazi: NadzorNalaz[];
  pendingDonacije: DonacijaItem[];
  otvoreniPrigovori: PrigovorItem[];
  viewerJeSuperadmin: boolean;
  viewerId: string;
}

const tipLabel = (t: ReturnType<typeof useTranslations<"admin">>): Record<string, string> => ({
  NEVERIFIKOVAN: t("tip_neverifikovan"),
  REGULARNI: t("tip_regularni"),
  NOSILAC_ZRNA: t("tip_nosilac_zrna"),
});

const adminNivoLabel = (t: ReturnType<typeof useTranslations<"admin">>): Record<string, string> => ({
  NONE: t("admin_nivo_clan"),
  ADMIN: t("admin_nivo_admin"),
  SUPERADMIN: t("admin_nivo_superadmin"),
});
const ADMIN_NIVOI = ["NONE", "ADMIN", "SUPERADMIN"] as const;

const statusBoja: Record<string, string> = {
  ACTIVE:    "bg-kolo-green-100 text-kolo-green-700",
  SUSPENDED: "bg-kolo-gold-100 text-kolo-gold-600",
  EXCLUDED:  "bg-kolo-danger-light text-kolo-danger",
};

type Tab = "dashboard" | "programi" | "ped" | "pokrovitelji" | "donacije" | "prigovori" | "korisnici" | "emisija" | "osnivaci" | "vesti" | "audit" | "nadzor";

export default function AdminKlijent({ users, opticaj, pendingKrugovi, adminProgrami, adminPed, adminPokrovitelji, dashboard, auditLogs, krugoviLista, verifikovaniKorisnici, krugoviLista2, blogObjave, nadzorNalazi, pendingDonacije, otvoreniPrigovori, viewerJeSuperadmin, viewerId }: AdminKlijentProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [tab, setTab] = useState<Tab>("dashboard");

  const ukupnoPendingProgrami = adminProgrami.pendingEnrollments.length;
  const ukupnoPendingZaposl = adminPed.pendingPrijave.length + adminPed.pendingEvidencije.length;
  const ukupnoPendingDonacije = pendingDonacije.length;
  const ukupnoOtvoreniPrigovori = otvoreniPrigovori.length;

  const tabs: [Tab, string][] = [
    ["dashboard", t("tab_dashboard")],
    ["programi", `${t("tab_programi")}${ukupnoPendingProgrami > 0 ? ` (${ukupnoPendingProgrami})` : ""}`],
    ["ped", `${t("tab_ped")}${ukupnoPendingZaposl > 0 ? ` (${ukupnoPendingZaposl})` : ""}`],
    ["pokrovitelji", `${t("tab_pokrovitelji")}${adminPokrovitelji.length > 0 ? ` (${adminPokrovitelji.length})` : ""}`],
    ["donacije", `${t("tab_donacije")}${ukupnoPendingDonacije > 0 ? ` (${ukupnoPendingDonacije})` : ""}`],
    ["prigovori", `${t("tab_prigovori")}${ukupnoOtvoreniPrigovori > 0 ? ` (${ukupnoOtvoreniPrigovori})` : ""}`],
    ["korisnici", t("tab_korisnici")],
    ["emisija", t("tab_emisija")],
    ["osnivaci", t("tab_osnivaci")],
    ["vesti", t("tab_vesti")],
    ["audit", t("tab_audit")],
    ...(viewerJeSuperadmin
      ? ([["nadzor", `${t("tab_nadzor")}${nadzorNalazi.length > 0 ? ` (${nadzorNalazi.length})` : ""}`]] as [Tab, string][])
      : []),
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-kolo-text">{t("panel_naslov")}</h1>

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

      {/* Programi */}
      {tab === "programi" && <AdminProgramiTab data={adminProgrami} opticaj={opticaj} onDone={() => router.refresh()} />}

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

      {/* Donacije */}
      {tab === "donacije" && <DonacijeTab donacije={pendingDonacije} onDone={() => router.refresh()} />}

      {/* Prigovori */}
      {tab === "prigovori" && <PrigovoriTab prigovori={otvoreniPrigovori} onDone={() => router.refresh()} />}

      {/* Korisnici */}
      {tab === "korisnici" && <KorisniciTab users={users} onDone={() => router.refresh()} viewerJeSuperadmin={viewerJeSuperadmin} viewerId={viewerId} />}

      {/* Finansije */}
      {tab === "emisija" && <EmisijaTab onSuccess={() => router.refresh()} />}

      {/* Nadzor integriteta (samo superadmin) */}
      {tab === "nadzor" && viewerJeSuperadmin && <NadzorTab nalazi={nadzorNalazi} />}

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
  const t = useTranslations("admin");
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
      setPoruka({ text: t("krug_odobrena_msg", { name: z.name }), ok: true });
      setTimeout(onDone, 1500);
    } else {
      setPoruka({ text: data.error ?? t("greska_generalna"), ok: false });
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
      setPoruka({ text: t("krug_odbijen_msg"), ok: false });
      setTimeout(onDone, 1200);
    } else {
      setPoruka({ text: data.error ?? t("greska_generalna"), ok: false });
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
          <p className="text-xs text-kolo-muted">{t("krug_inicijator")}</p>
          <p className="text-sm font-medium text-kolo-text"><Pseudonim>{z.inicijatorPseudonim}</Pseudonim></p>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-kolo-muted">
        <span>{z.brOsnivaca} {t("krug_inicijator")}</span>
        <span>{new Date(z.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</span>
      </div>

      {!poruka && (
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <button onClick={odobri} disabled={loading !== null}
              className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60">
              {loading === "odobri" ? t("krug_obrada") : t("krug_odobri")}
            </button>
            <button onClick={() => setShowOdbij((v) => !v)} disabled={loading !== null}
              className="flex-1 py-2.5 rounded-xl bg-white border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light transition-colors disabled:opacity-60">
              {t("krug_odbij")}
            </button>
          </div>

          {showOdbij && (
            <div className="space-y-2">
              <textarea value={razlog} onChange={(e) => setRazlog(e.target.value)}
                placeholder={t("krug_odbijanje_razlog_placeholder")} rows={2}
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-red-400 resize-none transition-colors" />
              <button onClick={odbij} disabled={loading !== null || !razlog.trim()}
                className="w-full py-2.5 rounded-xl bg-kolo-danger text-white text-sm font-semibold hover:bg-kolo-danger transition-colors disabled:opacity-60">
                {loading === "odbij" ? t("krug_odbijam") : t("krug_potvrdi_odbijanje")}
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

const sourceLabel = (t: ReturnType<typeof useTranslations<"admin">>): Record<string, string> => ({ FONDACIJA: t("source_fondacija"), KRUG: t("source_krug"), PROJEKAT: t("source_projekat") });
const sourceCls: Record<string, string> = {
  FONDACIJA: "bg-kolo-green-100 text-kolo-green-700",
  KRUG:   "bg-kolo-info-light text-kolo-info",
  PROJEKAT:  "bg-purple-50 text-purple-700",
};

function AdminPedTab({ data, onDone }: { data: AdminPedData; onDone: () => void }) {
  const t = useTranslations("admin");
  const [view, setView] = useState<"oglasi" | "prijave" | "evidencije" | "novi">("oglasi");
  const [loading, setLoading] = useState<string | null>(null);
  const [poruke, setPoruke] = useState<Record<string, { text: string; ok: boolean }>>({});

  async function odobriPrijavu(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/prijave/${id}/odobri`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? t("ped_odobri_loading") : (d.error ?? t("greska_generalna")), ok: res.ok } }));
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
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? t("ped_odbijeno_msg") : (d.error ?? t("greska_generalna")), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function odobriEvidenciju(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/evidencija/${id}/odobri`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? t("ped_potvrdjeno_msg", { poen: d.predlozeniPoen?.toLocaleString("sr-RS") }) : (d.error ?? t("greska_generalna")), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function odbijEvidenciju(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/evidencija/${id}/odbij`, { method: "POST" });
    const d = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [id]: { text: res.ok ? t("ped_odbijeno_msg") : (d.error ?? t("greska_generalna")), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1000);
  }

  async function zatvoriOglas(id: string) {
    if (!confirm(t("novi_oglas_zatvori_oglas_confirm"))) return;
    setLoading(id);
    const res = await fetch(`/api/admin/doprinos-oglasi/oglasi/${id}/zatvori`, { method: "POST" });
    setLoading(null);
    if (res.ok) onDone();
  }

  const subTabs: [typeof view, string][] = [
    ["oglasi", t("ped_tab_oglasi", { count: data.oglasi.length })],
    ["prijave", `${t("ped_tab_prijave")}${data.pendingPrijave.length > 0 ? ` (${data.pendingPrijave.length})` : ""}`],
    ["evidencije", `${t("ped_tab_evidencije")}${data.pendingEvidencije.length > 0 ? ` (${data.pendingEvidencije.length})` : ""}`],
    ["novi", t("ped_tab_novi")],
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
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">{t("ped_nema_oglasa")}</div>
          ) : data.oglasi.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-kolo-border p-5">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${sourceCls[o.source]}`}>{sourceLabel(t)[o.source]}</span>
                    {o.krugName && <span className="text-xs text-kolo-muted">{o.krugName}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded ${o.status === "ACTIVE" ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"}`}>
                      {o.status === "ACTIVE" ? t("ped_oglas_aktivan") : t("ped_oglas_zatvoren")}
                    </span>
                  </div>
                  <p className="font-semibold text-kolo-text text-sm">{o.title}</p>
                  <p className="text-xs text-kolo-muted mt-1">
                    {o.predlozeniPoen.toLocaleString("sr-RS")} {t("ped_predlozeni_poen")}{o.saOdobravanjem ? ` · ${t("ped_oglas_sa_odobravanjem")}` : ""} · {o.positions} {o.positions === 1 ? t("ped_oglas_izvršilac_sing") : t("ped_oglas_izvršilac_pl")} · {o.ukupnoPrijava} {t("ped_oglas_prijava")} · {o.pendingEvidencija} {t("ped_oglas_za_verifikaciju")}
                  </p>
                </div>
                {o.status === "ACTIVE" && (
                  <button onClick={() => zatvoriOglas(o.id)} disabled={loading === o.id}
                    className="text-xs px-3 py-1.5 border border-kolo-danger/20 text-kolo-danger rounded-xl hover:bg-kolo-danger-light disabled:opacity-60">
                    {t("ped_zatvori")}
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
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">{t("ped_nema_prijava")}</div>
          ) : data.pendingPrijave.map((p) => {
            const poruka = poruke[p.id];
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-kolo-text text-sm"><Pseudonim>{p.pseudonim}</Pseudonim></p>
                    <p className="text-xs text-kolo-muted mt-0.5">{p.oglasTitle} · {p.predlozeniPoen.toLocaleString("sr-RS")} {t("ped_predlozeni_poen")}</p>
                    {p.planIzvrsenja && <p className="text-xs text-kolo-muted mt-1 line-clamp-3"><span className="font-semibold">{t("ped_plan_label")}</span> {p.planIzvrsenja}</p>}
                    <p className="text-xs text-kolo-muted">{new Date(p.createdAt).toLocaleDateString("sr-RS")}</p>
                  </div>
                  <div className="flex gap-2">
                    <OdbijForma onOdbij={(r) => odbijPrijavu(p.id, r)} loading={loading === p.id} />
                    <button onClick={() => odobriPrijavu(p.id)} disabled={loading === p.id}
                      className="px-4 py-2 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60">
                      {loading === p.id ? "..." : t("ped_odobri")}
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
            <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">{t("ped_nema_evidencija")}</div>
          ) : data.pendingEvidencije.map((e) => {
            const poruka = poruke[e.id];
            return (
              <div key={e.id} className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-kolo-text text-sm"><Pseudonim>{e.pseudonim}</Pseudonim></p>
                    <p className="text-xs text-kolo-muted mt-0.5">{e.oglasTitle} · {new Date(e.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</p>
                    <p className="text-xs text-kolo-muted mt-1 line-clamp-2">{e.description}</p>
                    {e.dokaz && <p className="text-xs text-kolo-info mt-1 line-clamp-1">{t("ped_dokaz_label")} {e.dokaz}</p>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-kolo-text">{e.predlozeniPoen.toLocaleString("sr-RS")} {t("ped_p_predlozeno")}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => odbijEvidenciju(e.id)} disabled={loading === e.id}
                        className="px-3 py-1.5 border border-kolo-danger/20 text-kolo-danger text-xs font-semibold rounded-lg hover:bg-kolo-danger-light disabled:opacity-60">
                        {t("krug_odbij")}
                      </button>
                      <button onClick={() => odobriEvidenciju(e.id)} disabled={loading === e.id}
                        className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-lg hover:bg-kolo-green-900 disabled:opacity-60">
                        {loading === e.id ? "..." : t("ped_odobri")}
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
  const t = useTranslations("admin");
  const [show, setShow] = useState(false);
  const [razlog, setRazlog] = useState("");
  if (!show) return (
    <button onClick={() => setShow(true)} className="px-3 py-2 border border-kolo-danger/20 text-kolo-danger text-xs font-semibold rounded-xl hover:bg-kolo-danger-light">{t("krug_odbij")}</button>
  );
  return (
    <div className="flex gap-1 items-center">
      <input type="text" placeholder={t("odbij_razlog_placeholder")} value={razlog} onChange={(e) => setRazlog(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-kolo-border text-xs outline-none focus:border-red-400 w-28" />
      <button onClick={() => { onOdbij(razlog); setShow(false); }} disabled={loading}
        className="px-2 py-1.5 bg-kolo-danger text-white text-xs font-semibold rounded-lg disabled:opacity-60">✓</button>
      <button onClick={() => setShow(false)} className="px-2 py-1.5 text-kolo-muted text-xs">✕</button>
    </div>
  );
}

function NoviOglasForma({ onSuccess }: { onSuccess: () => void }) {
  const t = useTranslations("admin");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<"FONDACIJA" | "KRUG" | "PROJEKAT">("FONDACIJA");
  const [predlozeniPoen, setPredlozeniPoen] = useState("");
  const [obrazlozenje, setObrazlozenje] = useState("");
  const [saOdobravanjem, setSaOdobravanjem] = useState(false);
  const [positions, setPositions] = useState("1");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predlozeni = Number(predlozeniPoen);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!Number.isInteger(predlozeni) || predlozeni < 100) { setError(t("novi_oglas_poen_validacija")); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/doprinos-oglasi/oglasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          source,
          predlozeniPoen: predlozeni,
          obrazlozenje: obrazlozenje.trim() || undefined,
          saOdobravanjem,
          positions: Number(positions),
          deadline: deadline || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t("novi_oglas_greska_generalna")); return; }
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
      <p className="text-sm font-semibold text-kolo-muted">{t("novi_oglas_naslov_forme")}</p>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("novi_oglas_naziv_label")}</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("novi_oglas_naziv_placeholder")}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("novi_oglas_opis_label")}</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder={t("novi_oglas_opis_placeholder")}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("novi_oglas_izvor_label")}</label>
          <div className="flex gap-1.5 flex-wrap">
            {(["FONDACIJA", "KRUG", "PROJEKAT"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSource(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${source === s ? "bg-kolo-green-700 text-white" : "bg-kolo-bg text-kolo-muted"}`}>
                {sourceLabel(t)[s]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("novi_oglas_predlozeni_poen_label")}</label>
          <input type="number" min={100} step={100} value={predlozeniPoen} onChange={(e) => setPredlozeniPoen(e.target.value)}
            placeholder={t("novi_oglas_predlozeni_poen_placeholder")}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("novi_oglas_obrazlozenje_label")}</label>
        <input type="text" value={obrazlozenje} onChange={(e) => setObrazlozenje(e.target.value)}
          placeholder={t("novi_oglas_obrazlozenje_placeholder")}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("novi_oglas_br_izvršilaca_label")}</label>
          <input type="number" min={1} value={positions} onChange={(e) => setPositions(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-kolo-muted mb-1">{t("novi_oglas_rok_label")}</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-kolo-text cursor-pointer">
        <input type="checkbox" checked={saOdobravanjem} onChange={(e) => setSaOdobravanjem(e.target.checked)}
          className="w-4 h-4 accent-kolo-green-700" />
        {t("novi_oglas_sa_odobravanjem_label")}
      </label>

      {error && <p className="text-xs text-kolo-danger">{error}</p>}

      <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-xl px-3 py-2 text-xs text-kolo-gold-600">
        {t("novi_oglas_napomena_box", { poen: predlozeni > 0 ? predlozeni.toLocaleString("sr-RS") : "—" })}
      </div>

      <button type="submit" disabled={loading || !title.trim() || !description.trim()}
        className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 disabled:opacity-60">
        {loading ? t("novi_oglas_kreiranje") : t("novi_oglas_kreiraj")}
      </button>
    </form>
  );
}

// ── Programi tab ──────────────────────────────────────────────────────────────

function AdminProgramiTab({ data, opticaj, onDone }: { data: AdminProgramiData; opticaj: number; onDone: () => void }) {
  const t = useTranslations("admin");
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);
  const [loadingNocna, setLoadingNocna] = useState(false);
  const [nocnaRezultat, setNocnaRezultat] = useState<string | null>(null);
  const [loadingZrno, setLoadingZrno] = useState(false);
  const dnevniLimit = Math.floor(opticaj * 0.1);

  async function toggleZrnoTrziste() {
    setLoadingZrno(true);
    await fetch("/api/admin/zrno/nocna", { method: "PATCH" });
    setLoadingZrno(false);
    onDone();
  }

  async function pokreniZrnoNocnu() {
    if (!confirm(t("programi_zrno_confirm"))) return;
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
    if (!confirm(t("programi_nocna_confirm"))) return;
    setLoadingNocna(true); setNocnaRezultat(null);
    const res = await fetch("/api/admin/emisija/nocna", { method: "POST" });
    const data = await res.json();
    setLoadingNocna(false);
    if (res.ok) {
      setNocnaRezultat(t("programi_nocna_rezultat", { emitted: data.totalEmitted?.toLocaleString("sr-RS"), requested: data.totalRequested?.toLocaleString("sr-RS"), koef: Number(data.koeficijent).toFixed(4) }));
      onDone();
    } else {
      setNocnaRezultat(t("programi_greska_prefix", { msg: data.error }));
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
    const razlog = prompt(t("programi_odbij_razlog_prompt"));
    if (razlog === null) return;
    const res = await fetch(`/api/admin/programi/enrollments/${id}/odbij`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog }),
    });
    if (res.ok) onDone();
  }

  return (
    <div className="space-y-6">
      {/* Opticaj + dnevni limit programa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("emisija_opticaj_label")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{opticaj.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("emisija_opticaj_sub")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("emisija_dnevni_limit")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-gold-600">{dnevniLimit.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("emisija_dnevni_limit_sub")}</p>
        </div>
      </div>

      {/* ZRNO tržište */}
      <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-kolo-muted">{t("programi_zrno_trziste_naslov")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">
            {data.zrnoTrzisjeAktivno ? t("programi_zrno_aktivno") : t("programi_zrno_neaktivno")}
          </p>
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
          <button onClick={pokreniZrnoNocnu} disabled={loadingZrno}
            className="px-3 py-1.5 bg-kolo-gold-600 text-white text-xs font-semibold rounded-xl hover:bg-kolo-gold-400 disabled:opacity-60 transition-colors">
            {loadingZrno ? "..." : t("programi_zrno_obrada_btn")}
          </button>
          <button onClick={toggleZrnoTrziste} disabled={loadingZrno}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 ${data.zrnoTrzisjeAktivno ? "bg-kolo-danger-light text-kolo-danger hover:bg-kolo-danger-light" : "bg-kolo-gold-100 text-kolo-gold-600 hover:bg-kolo-gold-100"}`}>
            {data.zrnoTrzisjeAktivno ? t("programi_deaktiviraj") : t("programi_aktiviraj")}
          </button>
        </div>
      </div>

      {/* Status programa */}
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-5 py-3 border-b border-kolo-border flex justify-between items-center">
          <h3 className="text-sm font-semibold text-kolo-muted">{t("programi_status_naslov")}</h3>
          <button onClick={pokreniNocnu} disabled={loadingNocna}
            className="px-3 py-1.5 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60 transition-colors">
            {loadingNocna ? "..." : t("programi_pokreni_emisiju")}
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
                <span className="ml-2 text-xs text-kolo-muted">{t("programi_aktiviran_label", { datum: new Date(p.activatedAt).toLocaleDateString("sr-RS") })}</span>
              )}
            </div>
            <button onClick={() => toggleProgram(p.type)} disabled={loadingToggle === p.type}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60 ${p.isActive ? "bg-kolo-danger-light text-kolo-danger hover:bg-kolo-danger-light" : "bg-kolo-green-100 text-kolo-green-700 hover:bg-kolo-green-100"}`}>
              {loadingToggle === p.type ? "..." : p.isActive ? t("programi_deaktiviraj") : t("programi_aktiviraj")}
            </button>
          </div>
        ))}
      </div>

      {/* Pending prijave na programe */}
      {data.pendingEnrollments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-kolo-muted">{t("programi_prijave_naslov", { count: data.pendingEnrollments.length })}</h3>
          {data.pendingEnrollments.map((e) => (
            <EnrollmentKartica key={e.id} e={e} onOdobri={(amt) => odobriEnrollment(e.id, amt)} onOdbij={() => odbijEnrollment(e.id)} />
          ))}
        </div>
      )}

      {data.pendingEnrollments.length === 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          {t("programi_nema_zahteva")}
        </div>
      )}

      {/* Istorija emisija */}
      {data.poslednjeEmisije.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-3 border-b border-kolo-border">
            <h3 className="text-sm font-semibold text-kolo-muted">{t("programi_istorija_emisija")}</h3>
          </div>
          {data.poslednjeEmisije.map((s, i) => (
            <div key={s.date} className={`px-5 py-3 flex justify-between items-center text-sm ${i < data.poslednjeEmisije.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <span className="text-kolo-muted">{new Date(s.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</span>
              <span className="font-semibold text-kolo-green-700">{s.totalEmitted.toLocaleString("sr-RS")} P</span>
              {s.koeficijent < 1 && (
                <span className="text-xs text-kolo-gold-600">{t("programi_koef_label", { val: s.koeficijent.toFixed(3) })}</span>
              )}
              <span className="text-xs text-kolo-muted">{t("programi_lim_label", { val: s.limit.toLocaleString("sr-RS") })}</span>
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
  const t = useTranslations("admin");
  const [dailyAmount, setDailyAmount] = useState("");

  const metaLines = e.metadata ? Object.entries(e.metadata).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(" · ") : "";

  return (
    <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-kolo-text"><Pseudonim>{e.pseudonim}</Pseudonim></p>
          <p className="text-xs text-kolo-green-700 font-medium">{e.label}</p>
          {metaLines && <p className="text-xs text-kolo-muted mt-0.5">{metaLines}</p>}
        </div>
        <span className="text-xs text-kolo-muted">{new Date(e.createdAt).toLocaleDateString("sr-RS")}</span>
      </div>
      {e.type === "SKOLOVANJE" && (
        <input type="number" min={100} placeholder={t("programi_dnevni_iznos_placeholder")} value={dailyAmount}
          onChange={(ev) => setDailyAmount(ev.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      )}
      <div className="flex gap-2">
        <button onClick={() => onOdobri(dailyAmount ? Number(dailyAmount) : undefined)}
          disabled={e.type === "SKOLOVANJE" && !dailyAmount}
          className="flex-1 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 disabled:opacity-60 transition-colors">
          {t("ped_odobri")}
        </button>
        <button onClick={onOdbij}
          className="flex-1 py-2 rounded-xl border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light transition-colors">
          {t("krug_odbij")}
        </button>
      </div>
    </div>
  );
}

// ── Emisija tab ────────────────────────────────────────────────────────────────

function EmisijaTab({ onSuccess }: { onSuccess: () => void }) {
  const t = useTranslations("admin");
  const [pseudonim, setPseudonim] = useState("");
  const [amountRSD, setAmountRSD] = useState("");
  const [loading, setLoading] = useState(false);
  const [rezultat, setRezultat] = useState<{ poenEmitted: number; noviNivo: number; noviKumulativ: number } | null>(null);
  const [error, setError] = useState("");

  // Autocomplete članova (potencijalni donatori)
  const [predlozi, setPredlozi] = useState<{ id: string; pseudonim: string; verified: boolean; location: string | null }[]>([]);
  const [showPredlozi, setShowPredlozi] = useState(false);
  const [aktivniIndex, setAktivniIndex] = useState(-1);
  const [pretragaLoading, setPretragaLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowPredlozi(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const traziClanove = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setPredlozi([]); setShowPredlozi(false); return; }
    debounceRef.current = setTimeout(async () => {
      setPretragaLoading(true);
      try {
        const res = await fetch(`/api/korisnici/pretraga?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        setPredlozi(Array.isArray(data) ? data : []);
        setShowPredlozi(true);
        setAktivniIndex(-1);
      } finally {
        setPretragaLoading(false);
      }
    }, 250);
  }, []);

  function handlePseudonimInput(val: string) {
    setPseudonim(val);
    traziClanove(val);
  }

  function odaberiClana(k: { pseudonim: string }) {
    setPseudonim(k.pseudonim);
    setShowPredlozi(false);
    setPredlozi([]);
    setAktivniIndex(-1);
  }

  function handlePseudonimKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showPredlozi || predlozi.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const novi = Math.min(aktivniIndex + 1, predlozi.length - 1);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const novi = Math.max(aktivniIndex - 1, 0);
      setAktivniIndex(novi);
      listaRef.current?.children[novi]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (aktivniIndex >= 0 && aktivniIndex < predlozi.length) {
        e.preventDefault();
        odaberiClana(predlozi[aktivniIndex]);
      }
    } else if (e.key === "Escape") {
      setShowPredlozi(false);
      setAktivniIndex(-1);
    }
  }

  async function handleDonacija(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(""); setRezultat(null);

    if (!pseudonim.trim()) { setError(t("emisija_pseudonim_obavezan")); return; }
    const iznos = Number(amountRSD);
    if (!amountRSD || isNaN(iznos) || iznos <= 0) { setError(t("emisija_iznos_nevalidan")); return; }

    setLoading(true);
    const res = await fetch("/api/admin/donacija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudonim: pseudonim.trim(), amountRSD: iznos }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? t("greska_generalna")); return; }
    setRezultat(data);
    setPseudonim(""); setAmountRSD("");
    onSuccess();
  }

  return (
    <div className="space-y-5">
      {/* Forma za donaciju (na vrhu) */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5">
        <h3 className="text-sm font-semibold text-kolo-muted mb-4">{t("emisija_donacija_naslov")}</h3>
        <form onSubmit={handleDonacija} noValidate className="space-y-3">
          <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-kolo-muted mb-1">{t("emisija_pseudonim_label")}</label>
            <div className="relative">
              <input
                type="text"
                value={pseudonim}
                onChange={(e) => handlePseudonimInput(e.target.value)}
                onKeyDown={handlePseudonimKeyDown}
                onFocus={() => { if (predlozi.length > 0) setShowPredlozi(true); }}
                placeholder={t("emisija_pseudonim_placeholder")}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
              />
              {pretragaLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-kolo-green-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            {showPredlozi && predlozi.length > 0 && (
              <ul ref={listaRef} className="absolute z-30 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg overflow-y-auto max-h-56">
                {predlozi.map((k, i) => (
                  <li key={k.id}>
                    <button
                      type="button"
                      onMouseDown={() => odaberiClana(k)}
                      onMouseEnter={() => setAktivniIndex(i)}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${i === aktivniIndex ? "bg-kolo-green-100 text-kolo-green-800" : "hover:bg-kolo-green-50 hover:text-kolo-green-700"}`}
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-kolo-text truncate block"><Pseudonim>{k.pseudonim}</Pseudonim></span>
                        {k.location && <span className="text-xs text-kolo-muted">{k.location}</span>}
                      </div>
                      {k.verified && <span className="shrink-0 text-xs font-semibold text-kolo-green-700 bg-kolo-green-100 px-2 py-0.5 rounded-full">✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {showPredlozi && pseudonim.trim().length >= 2 && predlozi.length === 0 && !pretragaLoading && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-kolo-border rounded-xl shadow-lg px-4 py-3 text-sm text-kolo-muted">
                {t("emisija_nema_clanova")}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-muted mb-1">{t("emisija_iznos_label")}</label>
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
              <p className="font-semibold">{t("emisija_evidentirana")}</p>
              {rezultat.poenEmitted > 0 ? (
                <p className="mt-1">{t("emisija_emitovano", { poen: rezultat.poenEmitted.toLocaleString("sr-RS"), nivo: rezultat.noviNivo })}</p>
              ) : (
                <p className="mt-1 text-kolo-muted">{t("emisija_prag_nedostignut")}</p>
              )}
              <p className="text-xs mt-1">{t("emisija_kumulativ", { val: rezultat.noviKumulativ.toLocaleString("sr-RS") })}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
          >
            {loading ? t("emisija_evidentiram") : t("emisija_btn")}
          </button>
        </form>
      </div>

      {/* Pragovi donacija — nivoi (ispod) */}
      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-4 py-3 border-b border-kolo-border">
          <h3 className="text-sm font-semibold text-kolo-muted">{t("emisija_pragovi_naslov")}</h3>
          <p className="text-xs text-kolo-muted mt-0.5">{t("emisija_pragovi_sub")}</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-kolo-bg">
              <th className="px-4 py-2 text-center text-kolo-muted font-medium">{t("emisija_tbl_nivo")}</th>
              <th className="px-4 py-2 text-left text-kolo-muted font-medium">{t("emisija_tbl_kumulativ")}</th>
              <th className="px-4 py-2 text-right text-kolo-muted font-medium">{t("emisija_tbl_bonus")}</th>
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
    </div>
  );
}

// ── Dashboard tab ─────────────────────────────────────────────────────────────

// ── Donacije tab ─────────────────────────────────────────────────────────────

function DonacijeTab({ donacije, onDone }: { donacije: DonacijaItem[]; onDone: () => void }) {
  const t = useTranslations("admin");
  const [loading, setLoading] = useState<string | null>(null);
  const [poruke, setPoruke] = useState<Record<string, { text: string; ok: boolean }>>({});

  async function potvrdi(d: DonacijaItem) {
    setLoading(d.id);
    const res = await fetch("/api/admin/donacija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donationId: d.id, amountRSD: d.amountRSD }),
    });
    const data = await res.json();
    setLoading(null);
    setPoruke((p) => ({ ...p, [d.id]: { text: res.ok ? t("donacije_potvrdjena_msg", { poen: data.poenEmitted?.toLocaleString("sr-RS") }) : (data.error ?? t("greska_generalna")), ok: res.ok } }));
    if (res.ok) setTimeout(onDone, 1200);
  }

  if (donacije.length === 0) {
    return <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">{t("donacije_nema")}</div>;
  }

  return (
    <div className="space-y-3">
      {donacije.map((d) => {
        const poruka = poruke[d.id];
        return (
          <div key={d.id} className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-kolo-text text-sm">{d.pseudonim}</p>
                <p className="text-xs text-kolo-muted mt-0.5">
                  {d.nacinUplate === "KARTICA" ? t("donacije_nacin_kartica") : t("donacije_nacin_rucno")}
                  {d.referenceNumber ? ` · ${d.referenceNumber}` : ""}
                  {" · "}{new Date(d.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
                <p className="text-xs text-kolo-muted mt-1">{t("donacije_kumulativ", { val: d.cumulativeRSD.toLocaleString("sr-RS") })}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-kolo-text">{d.amountRSD.toLocaleString("sr-RS")} RSD</p>
                <button onClick={() => potvrdi(d)} disabled={loading === d.id}
                  className="mt-2 px-4 py-2 bg-kolo-green-700 text-white text-xs font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60">
                  {loading === d.id ? t("donacije_potvrdjujem") : t("donacije_potvrdi")}
                </button>
              </div>
            </div>
            {poruka && <p className={`text-xs px-3 py-1.5 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>}
          </div>
        );
      })}
    </div>
  );
}

// ── Prigovori tab ────────────────────────────────────────────────────────────

const prigovorTipLabel = (t: ReturnType<typeof useTranslations<"admin">>): Record<string, string> => ({
  VERIFIKACIJA: t("prigovori_tip_verifikacija"),
  SUSPENZIJA: t("prigovori_tip_suspenzija"),
  PROGRAM: t("prigovori_tip_program"),
  OSTALO: t("prigovori_tip_ostalo"),
});

function PrigovoriTab({ prigovori, onDone }: { prigovori: PrigovorItem[]; onDone: () => void }) {
  const t = useTranslations("admin");
  if (prigovori.length === 0) {
    return <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">{t("prigovori_nema")}</div>;
  }
  return (
    <div className="space-y-3">
      {prigovori.map((p) => <PrigovorKartica key={p.id} p={p} onDone={onDone} />)}
    </div>
  );
}

function PrigovorKartica({ p, onDone }: { p: PrigovorItem; onDone: () => void }) {
  const t = useTranslations("admin");
  const [odgovor, setOdgovor] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  async function posalji(status: "RESENO" | "ODBIJENO" | "U_OBRADI") {
    setLoading(status);
    const res = await fetch(`/api/admin/prigovori/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, odgovor: odgovor.trim() }),
    });
    const data = await res.json();
    setLoading(null);
    if (res.ok) {
      setPoruka({ text: t("prigovori_poslato_msg"), ok: true });
      setTimeout(onDone, 1200);
    } else {
      setPoruka({ text: data.error ?? t("greska_generalna"), ok: false });
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-kolo-info-light text-kolo-info">{prigovorTipLabel(t)[p.tipOdluke] ?? p.tipOdluke}</span>
          {p.status === "U_OBRADI" && <span className="text-xs px-2 py-0.5 rounded bg-kolo-gold-100 text-kolo-gold-600">{t("prigovori_status_u_obradi")}</span>}
        </div>
        <p className="font-semibold text-kolo-text text-sm">{p.pseudonim}</p>
        <p className="text-sm text-kolo-muted mt-1 whitespace-pre-wrap">{p.opis}</p>
        <p className="text-xs text-kolo-muted mt-1">{new Date(p.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</p>
      </div>
      <textarea value={odgovor} onChange={(e) => setOdgovor(e.target.value)} rows={2}
        placeholder={t("prigovori_odgovor_placeholder")}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      {!poruka && (
        <div className="flex gap-2">
          <button onClick={() => posalji("RESENO")} disabled={loading !== null}
            className="flex-1 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 disabled:opacity-60">
            {loading === "RESENO" ? "..." : t("prigovori_resi")}
          </button>
          <button onClick={() => posalji("ODBIJENO")} disabled={loading !== null}
            className="flex-1 py-2 rounded-xl border border-kolo-danger/20 text-kolo-danger text-sm font-semibold hover:bg-kolo-danger-light disabled:opacity-60">
            {loading === "ODBIJENO" ? "..." : t("krug_odbij")}
          </button>
          {p.status !== "U_OBRADI" && (
            <button onClick={() => posalji("U_OBRADI")} disabled={loading !== null}
              className="px-3 py-2 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-semibold hover:bg-kolo-border disabled:opacity-60">
              {loading === "U_OBRADI" ? "..." : t("prigovori_u_obradu")}
            </button>
          )}
        </div>
      )}
      {poruka && <p className={`text-sm px-3 py-2 rounded-xl ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>}
    </div>
  );
}

// ── Dashboard tab ─────────────────────────────────────────────────────────────

function DashboardTab({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const t = useTranslations("admin");
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
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_korisnici_ukupno")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.korisnici.ukupno.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_verifikovani")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-green-700">{data.korisnici.verifikovanih.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_suspendovani")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-gold-600">{data.korisnici.suspendovanih.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Finansije */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_opticaj")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.finansije.opticaj.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_ukupno_transakcija")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.ukupnoTransakcija.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* ZRNO */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_zrno_kod_korisnika")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-gold-600">{data.zrno.kodKorisnika.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_zrno_u_protokolu")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-text">{data.zrno.uProtokolu.toLocaleString("sr-RS")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-kolo-muted mb-1">{t("dashboard_ukupno_zrna")}</p>
          <p className="text-xl md:text-2xl font-bold text-kolo-muted">{data.zrno.ukupno.toLocaleString("sr-RS")}</p>
        </div>
      </div>

      {/* Zero-sum provjera */}
      <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-kolo-muted">{t("dashboard_zero_sum_naslov")}</p>
          {zeroSum && (
            <p className={`text-sm mt-0.5 font-mono ${zeroSum.ok ? "text-kolo-green-700" : "text-kolo-danger"}`}>
              {t("dashboard_zero_sum_zbir", { zbir: zeroSum.zbir.toLocaleString("sr-RS"), status: zeroSum.ok ? "✓ OK" : "✗ GREŠKA" })}
            </p>
          )}
        </div>
        <button onClick={provjeriZeroSum} disabled={loadingZS}
          className="px-4 py-2 bg-kolo-bg text-kolo-muted text-sm font-semibold rounded-xl hover:bg-kolo-border disabled:opacity-60 transition-colors shrink-0">
          {loadingZS ? t("dashboard_provjerava") : t("dashboard_provjeri")}
        </button>
      </div>

      {/* Migracija avatara na R2 (jednokratno) */}
      <AvatarMigracijaKartica />

      <button onClick={onRefresh}
        className="w-full py-2.5 rounded-xl border border-kolo-border text-sm text-kolo-muted hover:bg-kolo-bg transition-colors">
        {t("dashboard_osvjezi")}
      </button>
    </div>
  );
}

// ── Migracija avatara (legacy base64 → Cloudflare R2) ─────────────────────────
// Jednokratni alat: poziva /api/admin/migracija-avatara u petlji dok ne ostane
// nijedan base64 avatar. Tekst je inline (srpski) — admin panel je interni alat.
function AvatarMigracijaKartica() {
  const [radi, setRadi] = useState(false);
  const [poruka, setPoruka] = useState<string | null>(null);
  const [gotovo, setGotovo] = useState(false);

  async function pokreni() {
    setRadi(true);
    setGotovo(false);
    setPoruka("Migriram…");
    let ukupno = 0;
    try {
      // Petlja po batch-evima dok server ne javi preostalo === 0.
      for (let i = 0; i < 1000; i++) {
        const res = await fetch("/api/admin/migracija-avatara", { method: "POST" });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) { setPoruka(d.error ?? "Greška pri migraciji."); setRadi(false); return; }
        ukupno += d.migrirano ?? 0;
        setPoruka(`Migrirano: ${ukupno} · preostalo: ${d.preostalo ?? 0}`);
        if ((d.preostalo ?? 0) === 0) break;
        if ((d.migrirano ?? 0) === 0) break; // zaštita od beskonačne petlje
      }
      setGotovo(true);
    } catch (e) {
      setPoruka(String(e));
    }
    setRadi(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border px-5 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-kolo-muted">Migracija avatara na R2</p>
        <p className="text-xs text-kolo-muted mt-0.5">
          Prebacuje stare base64 avatare iz baze na Cloudflare R2 (jednokratno).
        </p>
        {poruka && (
          <p className={`text-sm mt-1 font-mono ${gotovo ? "text-kolo-green-700" : "text-kolo-muted"}`}>
            {gotovo ? `✓ ${poruka}` : poruka}
          </p>
        )}
      </div>
      <button onClick={pokreni} disabled={radi}
        className="px-4 py-2 bg-kolo-bg text-kolo-muted text-sm font-semibold rounded-xl hover:bg-kolo-border disabled:opacity-60 transition-colors shrink-0">
        {radi ? "Radim…" : "Pokreni"}
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
  const t = useTranslations("admin");
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
          <h3 className="text-sm font-semibold text-kolo-muted">{t("krugovi_zahtevi_naslov", { count: pendingKrugovi.length })}</h3>
          {pendingKrugovi.map((z) => (
            <KrugZahtevKartica key={z.id} z={z} onDone={onDone} />
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        <div className="px-5 py-3 border-b border-kolo-border">
          <h3 className="text-sm font-semibold text-kolo-muted">{t("krugovi_svi_naslov", { count: krugoviLista.length })}</h3>
        </div>
        {krugoviLista.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-kolo-muted">{t("krugovi_nema")}</p>
        ) : (
          krugoviLista.map((z, i) => (
            <div key={z.id} className={`px-5 py-3 flex justify-between items-center gap-3 ${i < krugoviLista.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-kolo-text truncate">{z.name}</p>
                {z.location && <p className="text-xs text-kolo-muted truncate">{z.location}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs text-kolo-muted">
                <span>{t("krugovi_cl", { br: z.clanovi })}</span>
                <span>{t("krugovi_proj", { br: z.projekti })}</span>
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

function KorisniciTab({ users, onDone, viewerJeSuperadmin, viewerId }: { users: KorisnikInfo[]; onDone: () => void; viewerJeSuperadmin: boolean; viewerId: string }) {
  const t = useTranslations("admin");
  const [filter, setFilter] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [izmeniKorisnik, setIzmeniKorisnik] = useState<KorisnikInfo | null>(null);

  const filtered = users.filter((u) =>
    u.pseudonim.toLowerCase().includes(filter.toLowerCase())
  );

  async function akcija(userId: string, tip: "suspenduj" | "aktiviraj" | "iskljuci" | "lazni-verifikator") {
    if (tip === "iskljuci" && !confirm(t("korisnici_iskljuci_confirm"))) return;
    if (tip === "lazni-verifikator" && !confirm(t("korisnici_lazni_confirm"))) return;
    let razlog: string | null = null;
    if (tip === "suspenduj") {
      razlog = prompt(t("korisnici_suspenzija_razlog_prompt"));
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
      if (tip === "lazni-verifikator") alert(t("korisnici_ponisteno_msg", { count: d.poistenoVerifikacija ?? 0 }));
      onDone();
    } else {
      alert(d.error ?? t("greska_generalna"));
    }
  }

  async function postaviAdminRolu(userId: string, nivo: string) {
    if (nivo === "SUPERADMIN" && !confirm(t("korisnici_superadmin_confirm"))) return;
    setLoadingId(userId);
    const res = await fetch(`/api/admin/korisnici/${userId}/admin-rola`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nivo }),
    });
    const d = await res.json().catch(() => ({}));
    setLoadingId(null);
    if (res.ok) onDone();
    else alert(d.error ?? t("greska_generalna"));
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={t("korisnici_pretrazi_placeholder")}
        className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
      />

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-kolo-muted">{t("korisnici_nema")}</p>
        ) : (
          filtered.map((u, i) => (
            <div key={u.id} className={`px-4 py-3 ${i < filtered.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-kolo-text"><Pseudonim>{u.pseudonim}</Pseudonim></span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBoja[u.status] ?? "bg-kolo-bg text-kolo-muted"}`}>
                      {u.status}
                    </span>
                    {!u.verified && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-kolo-bg text-kolo-muted">
                        {t("korisnici_neverifikovan_badge")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {tipLabel(t)[u.tipKorisnika] ?? u.tipKorisnika} · {u.balance.toLocaleString("sr-RS")} P
                    {u.suspendedReason && <span className="ml-1 text-kolo-gold-600">— {u.suspendedReason}</span>}
                  </p>
                </div>
                {!jeSuperadmin(u) && (
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    <button onClick={() => setIzmeniKorisnik(u)} disabled={loadingId === u.id}
                      className="px-2.5 py-1 bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold rounded-lg hover:bg-kolo-border disabled:opacity-60 transition-colors">
                      {t("korisnici_izmeni")}
                    </button>
                    {u.status === "ACTIVE" && (
                      <button onClick={() => akcija(u.id, "suspenduj")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-gold-100 text-kolo-gold-600 text-xs font-semibold rounded-lg hover:bg-kolo-gold-100 disabled:opacity-60 transition-colors">
                        {t("korisnici_suspenduj")}
                      </button>
                    )}
                    {u.status === "SUSPENDED" && (
                      <button onClick={() => akcija(u.id, "aktiviraj")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold rounded-lg hover:bg-kolo-green-100 disabled:opacity-60 transition-colors">
                        {t("korisnici_aktiviraj")}
                      </button>
                    )}
                    {u.status !== "EXCLUDED" && (
                      <button onClick={() => akcija(u.id, "iskljuci")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg hover:bg-kolo-danger-light disabled:opacity-60 transition-colors">
                        {t("korisnici_iskljuci")}
                      </button>
                    )}
                    {u.verified && u.status !== "EXCLUDED" && (
                      <button onClick={() => akcija(u.id, "lazni-verifikator")} disabled={loadingId === u.id}
                        className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg hover:bg-kolo-danger-light disabled:opacity-60 transition-colors">
                        {t("korisnici_lazni_verifikator")}
                      </button>
                    )}
                  </div>
                )}
              </div>
              {viewerJeSuperadmin && u.id !== viewerId && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-kolo-muted">{t("korisnici_admin_rola")}</span>
                  {ADMIN_NIVOI.map((nivo) => (
                    <button
                      key={nivo}
                      onClick={() => postaviAdminRolu(u.id, nivo)}
                      disabled={loadingId === u.id || u.admin === nivo}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-colors ${
                        u.admin === nivo
                          ? "bg-kolo-green-700 text-white"
                          : "bg-kolo-bg border border-kolo-border text-kolo-muted hover:bg-kolo-border disabled:opacity-60"
                      }`}
                    >
                      {adminNivoLabel(t)[nivo]}
                    </button>
                  ))}
                </div>
              )}
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
  const t = useTranslations("admin");
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
      setGreska(resData.error ?? t("izmeni_greska_generalna"));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-kolo-text">{t("izmeni_korisnika_naslov")}</h3>
          <p className="text-sm text-kolo-muted mt-0.5"><Pseudonim>{korisnik.pseudonim}</Pseudonim></p>
        </div>

        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("izmeni_email_label")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("izmeni_pseudonim_label")}</label>
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
            {t("izmeni_otkazi")}
          </button>
          <button onClick={sacuvaj} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60">
            {loading ? t("izmeni_cuvam") : t("izmeni_sacuvaj")}
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
  const t = useTranslations("admin");
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
      setPoruka({ text: t("pokrovitelji_obavezna_polja"), ok: false });
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
      setPoruka({ text: t("pokrovitelji_kreiran_msg"), ok: true });
      setNoviNaziv(""); setNoviPib(""); setNoviAdresa(""); setNoviEmail(""); setNoviTelefon(""); setNoviVlasnikId(""); setNoviKrugId("");
      setTimeout(() => { onDone(); setSubTab("lista"); }, 1200);
    } else {
      setPoruka({ text: data.error ?? t("greska_generalna"), ok: false });
    }
  }

  async function dodajDoprinos() {
    if (!selectedId || !doprinosRsd) return;
    const iznos = parseFloat(doprinosRsd);
    if (isNaN(iznos) || iznos <= 0) {
      setPoruka({ text: t("pokrovitelji_neispravan_iznos"), ok: false });
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
        const tekst = noviNivoi.map((n: { nivo: number; bonusPoen: number }) => t("pokrovitelji_nivo_bonus", { nivo: n.nivo, bonus: n.bonusPoen.toLocaleString("sr-RS") })).join(", ");
        setPoruka({ text: t("pokrovitelji_doprinos_evidentiran_msg", { nivoi: tekst }), ok: true });
      } else {
        setPoruka({ text: t("pokrovitelji_doprinos_evidentiran_no_nivo"), ok: true });
      }
      setDoprinosRsd(""); setDoprinosNapomena("");
      setTimeout(() => { onDone(); setSubTab("lista"); }, 2000);
    } else {
      setPoruka({ text: data.error ?? t("greska_generalna"), ok: false });
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
            {s === "lista" ? t("pokrovitelji_tab_lista", { count: pokrovitelji.length }) : s === "prijave" ? t("pokrovitelji_tab_prijave") : s === "novi" ? t("pokrovitelji_tab_novi") : t("pokrovitelji_tab_doprinos")}
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
              {t("pokrovitelji_nema")}
            </div>
          ) : (
            pokrovitelji.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-kolo-border px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-kolo-text truncate">{p.naziv}</div>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    {t.rich("pokrovitelji_pib_vlasnik", { pib: p.pib, vlasnik: p.vlasnikPseudonim, ime: (c) => <Pseudonim>{c}</Pseudonim> })}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === "ACTIVE" ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-gold-100 text-kolo-gold-600"}`}>
                    {t("pokrovitelji_nivo", { nivo: p.trenutniNivo })}
                  </span>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    {p.rsdKumulativ.toLocaleString("sr-RS")} RSD · {p.brDoprinosa !== 1 ? t("pokrovitelji_doprinos_count_pl", { count: p.brDoprinosa }) : t("pokrovitelji_doprinos_count_sing", { count: p.brDoprinosa })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {subTab === "novi" && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-4">
          <h3 className="font-semibold text-kolo-text">{t("pokrovitelji_novi_naslov")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_naziv_label")}</label>
              <input value={noviNaziv} onChange={(e) => setNoviNaziv(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder={t("pokrovitelji_naziv_placeholder")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_pib_label")}</label>
              <input value={noviPib} onChange={(e) => setNoviPib(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder={t("pokrovitelji_pib_placeholder")} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_adresa_label")}</label>
            <input value={noviAdresa} onChange={(e) => setNoviAdresa(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
              placeholder={t("pokrovitelji_adresa_placeholder")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_email_label")}</label>
              <input value={noviEmail} onChange={(e) => setNoviEmail(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder="kontakt@firma.rs" />
            </div>
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_telefon_label")}</label>
              <input value={noviTelefon} onChange={(e) => setNoviTelefon(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder="+381..." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_vlasnik_label")}</label>
            <select value={noviVlasnikId} onChange={(e) => setNoviVlasnikId(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500">
              <option value="">{t("pokrovitelji_vlasnik_placeholder")}</option>
              {verifikovaniKorisnici.map((k) => (
                <option key={k.id} value={k.id}>{k.pseudonim}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_krug_label")}</label>
            <select value={noviKrugId} onChange={(e) => setNoviKrugId(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500">
              <option value="">{t("pokrovitelji_krug_placeholder")}</option>
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
            {loading ? t("pokrovitelji_kreiranje") : t("pokrovitelji_kreiraj_btn")}
          </button>
        </div>
      )}

      {subTab === "doprinos" && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-4">
          <h3 className="font-semibold text-kolo-text">{t("pokrovitelji_doprinos_naslov")}</h3>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_doprinos_pokrovitelj_label")}</label>
            <select value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value || null)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500">
              <option value="">{t("pokrovitelji_doprinos_select_placeholder")}</option>
              {pokrovitelji.filter((p) => p.status === "ACTIVE").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.naziv} ({t("pokrovitelji_nivo", { nivo: p.trenutniNivo })}, {p.rsdKumulativ.toLocaleString("sr-RS")} RSD)
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_doprinos_iznos_label")}</label>
              <input
                type="number"
                min="1"
                value={doprinosRsd}
                onChange={(e) => setDoprinosRsd(e.target.value)}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
                placeholder={t("pokrovitelji_doprinos_iznos_placeholder")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_doprinos_tip_label")}</label>
              <select
                value={doprinosTip}
                onChange={(e) => setDoprinosTip(e.target.value as "NOVAC" | "ROBA" | "USLUGE")}
                className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
              >
                <option value="NOVAC">{t("pokrovitelji_doprinos_novac")}</option>
                <option value="ROBA">{t("pokrovitelji_doprinos_roba")}</option>
                <option value="USLUGE">{t("pokrovitelji_doprinos_usluge")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-kolo-muted mb-1">{t("pokrovitelji_doprinos_napomena_label")}</label>
            <input value={doprinosNapomena} onChange={(e) => setDoprinosNapomena(e.target.value)}
              className="w-full border border-kolo-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-kolo-green-500"
              placeholder={t("pokrovitelji_doprinos_napomena_placeholder")} />
          </div>
          <button
            onClick={dodajDoprinos}
            disabled={loading || !selectedId}
            className="w-full py-2.5 bg-kolo-green-700 text-white font-semibold rounded-xl hover:bg-kolo-green-900 disabled:opacity-60 transition-colors"
          >
            {loading ? t("pokrovitelji_doprinos_evidentiranje") : t("pokrovitelji_doprinos_btn")}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Audit log tab ─────────────────────────────────────────────────────────────

function AuditLogTab({ logs, onRefresh }: { logs: AuditLogEntry[]; onRefresh: () => void }) {
  const t = useTranslations("admin");
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-kolo-muted">{t("audit_zapisa", { count: logs.length })}</p>
        <button onClick={onRefresh}
          className="px-4 py-2 bg-kolo-bg text-kolo-muted text-sm font-semibold rounded-xl hover:bg-kolo-border transition-colors">
          {t("audit_osvjezi")}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
        {logs.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-kolo-muted">{t("audit_nema")}</p>
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
                    <Pseudonim>{l.adminPseudonim}</Pseudonim>
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
  const t = useTranslations("admin");
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
        setPoruka({ text: data.error ?? t("greska_generalna"), ok: false });
        return;
      }
      setPoruka({ text: editId ? t("vesti_izmenjena_msg") : t("vesti_sacuvana_msg"), ok: true });
      resetForma();
      setTimeout(onDone, 800);
    } catch {
      setPoruka({ text: t("vesti_mrezna_greska"), ok: false });
    } finally {
      setSalje(false);
    }
  }

  async function obrisi(id: string) {
    if (!confirm(t("vesti_obrisi_confirm"))) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      onDone();
    } else {
      const data = await res.json();
      alert(data.error ?? t("greska_generalna"));
    }
  }

  return (
    <div className="space-y-5">
      {/* Forma */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5">
        <h3 className="text-sm font-semibold text-kolo-text mb-3">
          {editId ? t("vesti_izmeni_objavu") : t("vesti_nova_objava")}
        </h3>
        <form onSubmit={sacuvaj} className="space-y-3">
          <input
            type="text"
            value={naslov}
            onChange={(e) => setNaslov(e.target.value)}
            placeholder={t("vesti_naslov_placeholder")}
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500"
          />
          <textarea
            value={sadrzaj}
            onChange={(e) => setSadrzaj(e.target.value)}
            placeholder={t("vesti_sadrzaj_placeholder")}
            rows={8}
            maxLength={20000}
            className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-y"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-xs text-kolo-muted">
              {t("vesti_datum_label")}{" "}
              <input
                type="datetime-local"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                className="ml-1 px-2 py-1 rounded border border-kolo-border text-xs"
              />
            </label>
            <span className="text-xs text-kolo-muted ml-auto">
              {t("vesti_znakovi", { count: sadrzaj.length })}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!naslov.trim() || !sadrzaj.trim() || salje}
              className="px-5 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors disabled:opacity-60"
            >
              {salje ? "..." : editId ? t("vesti_sacuvaj_izmene") : t("vesti_objavi")}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForma}
                className="px-5 py-2 bg-white border border-kolo-border text-kolo-muted text-sm font-medium rounded-xl hover:bg-kolo-bg transition-colors"
              >
                {t("vesti_otkazi")}
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
          {t("vesti_postojece_naslov", { count: objave.length })}
        </h3>
        {objave.length === 0 ? (
          <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
            {t("vesti_nema")}
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
                    · <Pseudonim>{o.authorPseudonim}</Pseudonim>
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
                    {t("vesti_izmeni_btn")}
                  </button>
                  <button
                    onClick={() => obrisi(o.id)}
                    className="px-3 py-1.5 bg-white border border-kolo-danger/20 text-kolo-danger text-xs font-medium rounded-lg hover:bg-kolo-danger-light transition-colors"
                  >
                    {t("vesti_obrisi_btn")}
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
