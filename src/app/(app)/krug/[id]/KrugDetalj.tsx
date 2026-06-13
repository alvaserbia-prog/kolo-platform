"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

interface Projekat {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

interface ClanInfo {
  userId: string;
  pseudonim: string;
  isAdmin: boolean;
  joinedAt: string;
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

type Tab = "info" | "clanovi" | "projekti" | "pristupnice";

export default function KrugDetalj({ krug, mojeClansvo, imaPristupnicu, isVerified, isAdmin }: Props) {
  const t = useTranslations("krug");
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
    setPoruka({ text: res.ok ? t("pristupnica_poslata") : (data.error ?? t("greska_generic")), ok: res.ok });
    if (res.ok) setTimeout(() => router.refresh(), 1500);
  }

  async function istupi() {
    if (!confirm(t("istupi_potvrda"))) return;
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

  const tabs: [Tab, string][] = [
    ["info", t("tab_info")],
    ["clanovi", t("tab_clanovi", { count: krug.clanovi.length })],
    ["projekti", t("tab_projekti", { count: krug.projects.length })],
    ...(canManage && krug.pristupnice.length > 0
      ? [["pristupnice", t("tab_pristupnice", { count: krug.pristupnice.length })] as [Tab, string]]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/krug" className="text-kolo-muted hover:text-kolo-muted text-sm transition-colors">{t("nazad_krugovi")}</Link>
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
              {loading ? "..." : t("podnesi_pristupnicu")}
            </button>
          )}
          {imaPristupnicu && (
            <span className="px-4 py-2 bg-kolo-gold-100 text-kolo-gold-600 text-sm font-medium rounded-xl border border-kolo-gold-100">
              {t("pristupnica_cekanje")}
            </span>
          )}
          {mojeClansvo && (
            <>
              <span className="px-4 py-2 bg-kolo-green-100 text-kolo-green-700 text-sm font-medium rounded-xl border border-kolo-green-100">
                {mojeClansvo.isAdmin ? t("status_admin") : t("status_clan")}
              </span>
              <button onClick={istupi} disabled={loading}
                className="px-4 py-2 border border-kolo-danger/20 text-kolo-danger text-sm font-semibold rounded-xl hover:bg-kolo-danger-light transition-colors disabled:opacity-60">
                {t("istupi")}
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
            <span className="text-kolo-muted">{t("info_broj_clanova")}</span>
            <span className="font-medium text-kolo-text">{krug.clanovi.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("info_stanje")}</span>
            <span className="font-bold text-kolo-green-700">{krug.balance.toLocaleString("sr-RS")} POEN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kolo-muted">{t("info_aktivnih_projekata")}</span>
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
                <Pseudonim>{c.pseudonim}</Pseudonim>
              </Link>
              <div className="flex items-center gap-2">
                {c.isAdmin && <span className="text-xs bg-kolo-green-100 text-kolo-green-700 px-2 py-0.5 rounded font-medium">{t("clan_admin_badge")}</span>}
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
              {t("nema_projekata")}
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
                    {p.type === "PRIKUPLJANJE" ? t("tip_prikupljanje") : t("tip_redistribucija")}
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
              <span className="text-sm font-medium text-kolo-text"><Pseudonim>{p.pseudonim}</Pseudonim></span>
              <button onClick={() => odibriPristupnicu(p.id)}
                className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-900 transition-colors">
                {t("odobri_pristupnicu")}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ── Mini forma za novi projekat ────────────────────────────────────────────────

function NoviProjekatForma({ krugId, onSuccess }: { krugId: string; onSuccess: () => void }) {
  const t = useTranslations("krug");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"PRIKUPLJANJE" | "REDISTRIBUCIJA">("PRIKUPLJANJE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) { setError(t("projekat_naziv_greska")); return; }
    setLoading(true);
    const res = await fetch(`/api/krugovi/${krugId}/projekti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: description.trim(), type }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? t("greska_generic")); return; }
    setTitle(""); setDescription(""); setShow(false); setError("");
    onSuccess();
  }

  if (!show) {
    return (
      <button onClick={() => setShow(true)}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-kolo-border text-sm text-kolo-muted hover:border-kolo-green-500 hover:text-kolo-green-700 transition-colors">
        {t("novi_projekat_dugme")}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-kolo-border p-4 space-y-3">
      <p className="text-sm font-semibold text-kolo-muted">{t("novi_projekat_naslov")}</p>
      <input type="text" placeholder={t("projekat_naziv_placeholder")} value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500" />
      <textarea rows={2} placeholder={t("projekat_opis_placeholder")} value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 resize-none" />
      <div className="flex gap-2">
        {(["PRIKUPLJANJE", "REDISTRIBUCIJA"] as const).map((tp) => (
          <button key={tp} type="button" onClick={() => setType(tp)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${type === tp ? "bg-kolo-green-700 text-white" : "bg-white border border-kolo-border text-kolo-muted"}`}>
            {tp === "PRIKUPLJANJE" ? t("tip_prikupljanje") : t("tip_redistribucija")}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-kolo-danger">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => setShow(false)}
          className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">{t("otkazi")}</button>
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold disabled:opacity-60">
          {loading ? "..." : t("kreiraj")}
        </button>
      </div>
    </form>
  );
}
