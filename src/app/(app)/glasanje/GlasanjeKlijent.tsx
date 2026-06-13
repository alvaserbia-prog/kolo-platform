"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";

interface Predlog {
  id: string;
  title: string;
  description: string;
  authorPseudonim: string;
  glasanjePocetak: string;
  deadline: string;
  status: "ACTIVE" | "CLOSED";
  faza: "NAJAVLJEN" | "U_TOKU" | "ZATVOREN";
  ishodUsvojen: boolean | null;
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
  const t = useTranslations("glasanje");
  const router = useRouter();
  const [showNovi, setShowNovi] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="kolo-naslov">{t("naslov")}</h1>
        <div className="flex items-center gap-3">
          <Link href="/glasanje/registar" className="text-xs text-kolo-green-700 hover:underline">
            {t("registar_link")}
          </Link>
          {mojaGlasackaMoc > 0 && (
            <span className="text-xs bg-kolo-gold-100 text-kolo-gold-600 border border-kolo-gold-400/30 px-3 py-1.5 rounded-xl font-medium">
              {t("glasova_badge", { count: mojaGlasackaMoc })}
            </span>
          )}
          {mojaGlasackaMoc > 0 && (
            <button onClick={() => setShowNovi((v) => !v)}
              className="px-4 py-2 bg-kolo-green-700 text-white text-sm font-semibold rounded-xl hover:bg-kolo-green-500 transition-colors">
              {t("novi_predlog")}
            </button>
          )}
        </div>
      </div>

      {mojaGlasackaMoc === 0 && (
        <div className="box-warning text-sm">
          {t("nema_zrna")}{" "}
          <Link href="/zrno" className="underline font-medium">{t("idi_na_zrno")}</Link>
        </div>
      )}

      {showNovi && (
        <NoviPredlogForma onSuccess={() => { setShowNovi(false); router.refresh(); }} onCancel={() => setShowNovi(false)} />
      )}

      {predlozi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          {t("nema_predloga")}
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
  const t = useTranslations("glasanje");
  const tc = useTranslations("common");
  const [loading, setLoading] = useState<boolean | null>(null);
  const [poruka, setPoruka] = useState<string | null>(null);

  const ukupno = p.zaGlasova + p.protiGlasova;
  const zaProc = ukupno > 0 ? Math.round((p.zaGlasova / ukupno) * 100) : 0;
  const uToku = p.faza === "U_TOKU";
  const najavljen = p.faza === "NAJAVLJEN";

  // Oznaka statusa: najavljen / u toku / ishod po zatvaranju
  const statusLabel = najavljen
    ? t("najavljeno")
    : uToku
      ? t("u_toku")
      : p.ishodUsvojen === true
        ? t("usvojeno")
        : p.ishodUsvojen === false
          ? t("neusvojeno")
          : t("zatvoreno");
  const statusZelen = uToku || p.ishodUsvojen === true;

  async function glasaj(za: boolean) {
    setLoading(za); setPoruka(null);
    const res = await fetch(`/api/glasanje/${p.id}/glasaj`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ za }),
    });
    const data = await res.json();
    setLoading(null);
    if (res.ok) { onRefresh(); }
    else { setPoruka(data.error ?? tc("greska_ucitavanja")); }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-kolo-text">{p.title}</p>
          <p className="text-xs text-kolo-muted mt-0.5">
            <Pseudonim>{p.authorPseudonim}</Pseudonim> · {new Date(p.createdAt).toLocaleDateString("sr-RS")}
          </p>
        </div>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded font-medium ${statusZelen ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-bg text-kolo-muted"}`}>
          {statusLabel}
        </span>
      </div>

      <p className="text-sm text-kolo-muted line-clamp-2">{p.description}</p>

      {/* Rezultati */}
      {ukupno > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-kolo-muted">
            <span>{t("za_glasova", { count: p.zaGlasova, pct: zaProc })}</span>
            <span>{t("protiv_glasova", { count: p.protiGlasova })}</span>
          </div>
          <div className="h-2 bg-kolo-bg rounded-full overflow-hidden">
            <div className="h-full bg-kolo-green-1000 rounded-full transition-all" style={{ width: `${zaProc}%` }} />
          </div>
        </div>
      )}

      {/* Moj glas */}
      {p.mojGlas !== null && (
        <p className="text-xs text-kolo-gold-600 font-medium">
          {t("moj_glas", { glas: p.mojGlas ? t("za") : t("protiv"), moc: mojaGlasackaMoc })}
        </p>
      )}

      {/* Akcije — glasanje samo dok je U_TOKU */}
      {uToku && mojaGlasackaMoc > 0 && (
        <div className="flex gap-2">
          <button onClick={() => glasaj(true)} disabled={loading !== null}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${p.mojGlas === true ? "bg-kolo-green-500 text-white" : "border border-kolo-green-500 text-kolo-green-700 hover:bg-kolo-green-100"}`}>
            {loading === true ? "..." : t("za")}
          </button>
          <button onClick={() => glasaj(false)} disabled={loading !== null}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${p.mojGlas === false ? "bg-kolo-danger text-white" : "border border-kolo-danger/30 text-kolo-danger hover:bg-kolo-danger-light"}`}>
            {loading === false ? "..." : t("protiv")}
          </button>
        </div>
      )}

      {najavljen && (
        <p className="text-xs text-kolo-muted">{t("glasanje_pocinje", { datum: new Date(p.glasanjePocetak).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" }) })}</p>
      )}
      {uToku && (
        <p className="text-xs text-kolo-muted">{t("rok")} {new Date(p.deadline).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}</p>
      )}

      {poruka && <p className="text-xs text-kolo-danger">{poruka}</p>}
    </div>
  );
}

// ── Nova predlog forma ────────────────────────────────────────────────────────

function NoviPredlogForma({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const t = useTranslations("glasanje");
  const tc = useTranslations("common");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vrsta, setVrsta] = useState<"ODLUKA" | "DINARSKA_PREPORUKA">("ODLUKA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (title.trim().length < 5) { setError(t("np_greska_naslov")); return; }
    if (description.trim().length < 20) { setError(t("np_greska_opis")); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/glasanje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), vrsta }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? tc("greska_ucitavanja")); return; }
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
      <p className="text-sm font-semibold text-kolo-muted">{t("novi_predlog_naslov")}</p>
      <input type="text" placeholder={t("naslov_placeholder")} value={title} onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700" />
      <textarea rows={3} placeholder={t("opis_placeholder")} value={description} onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 resize-none" />
      <div>
        <label className="block text-xs text-kolo-muted mb-1">{t("vrsta_label")}</label>
        <select value={vrsta} onChange={(e) => setVrsta(e.target.value as "ODLUKA" | "DINARSKA_PREPORUKA")}
          className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700">
          <option value="ODLUKA">{t("vrsta_odluka")}</option>
          <option value="DINARSKA_PREPORUKA">{t("vrsta_preporuka")}</option>
        </select>
      </div>
      <p className="text-xs text-kolo-muted bg-kolo-bg rounded-lg px-3 py-2">{t("period_info")}</p>
      {error && <p className="text-xs text-kolo-danger">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-kolo-bg text-kolo-muted text-sm font-medium">{tc("otkazi")}</button>
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-500 disabled:opacity-60 transition-colors">
          {loading ? "..." : t("objavi")}
        </button>
      </div>
    </div>
  );
}
