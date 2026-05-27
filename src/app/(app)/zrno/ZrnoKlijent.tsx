"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import GlasanjeKlijent from "@/app/(app)/glasanje/GlasanjeKlijent";

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
  slobodno: number;
  aktivno: number;
  glasackaMoc: number;
  poenBalans: number;
  kurs: number;
  trzisjeAktivno: boolean;
  isVerified: boolean;
  upisZahtev: { poenIznos: number; status: string } | null;
  otpisZahtev: { kolicina: number; status: string } | null;
  statusZahtevi: { kolicina: number; akcija: string }[];
  delegacija: {
    aktivna: boolean;
    delegatPseudonim: string | null;
    imaZakazano: boolean;
    zakazaniPseudonim: string | null;
  } | null;
  poslednjiKursovi: { date: string; kurs: number }[];
  predlozi: Predlog[];
}

type Tab = "pregled" | "trziste" | "glasanje";

export default function ZrnoKlijent(props: Props) {
  const [tab, setTab] = useState<Tab>("pregled");
  const router = useRouter();
  const t = useTranslations("zrno");
  const tc = useTranslations("common");

  const tabs: [Tab, string][] = [
    ["pregled", t("tab_pregled")],
    ["trziste", t("tab_trziste")],
    ["glasanje", t("tab_delegacija")],
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="kolo-naslov">{t("naslov")}</h1>
        {props.glasackaMoc > 0 && (
          <div className="bg-kolo-gold-100 border border-kolo-gold-400/30 rounded-xl px-4 py-2 text-center">
            <p className="text-sm font-bold text-kolo-gold-600">{props.glasackaMoc}</p>
            <p className="text-xs text-kolo-gold-600">{t("glasova")}</p>
          </div>
        )}
      </div>

      {/* Stanje */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("slobodno")}</p>
          <p className="text-xl font-bold text-kolo-text">{props.slobodno.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("slobodno_opis")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("aktivno")}</p>
          <p className="text-xl font-bold text-kolo-gold-600">{props.aktivno.toLocaleString("sr-RS")}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("aktivno_opis")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("kurs")}</p>
          <p className="text-xl font-bold text-kolo-green-700">{props.kurs.toLocaleString("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("kurs_opis")}</p>
        </div>
      </div>

      {/* Glasačka moć formula */}
      {props.aktivno > 0 && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-400/30 rounded-2xl px-5 py-3 text-sm text-kolo-gold-600">
          {t("glasacka_moc_formula", { aktivno: props.aktivno, moc: props.glasackaMoc })}
        </div>
      )}

      {!props.trzisjeAktivno && (
        <div className="box-warning text-sm">
          {t("trziste_neaktivno")}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-kolo-border">
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-kolo-gold-600 text-kolo-gold-600" : "border-transparent text-kolo-muted hover:text-kolo-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "pregled" && <PregledTab {...props} onRefresh={() => router.refresh()} />}
      {tab === "trziste" && <TrzisteTab {...props} onRefresh={() => router.refresh()} />}
      {tab === "glasanje" && <DelegacijaTab {...props} onRefresh={() => router.refresh()} />}

      {/* Razdvajač */}
      <div className="border-t border-kolo-border pt-2" />

      {/* Glasanje sekcija */}
      <GlasanjeKlijent predlozi={props.predlozi} mojaGlasackaMoc={props.glasackaMoc} />
    </div>
  );
}

// ── Pregled ───────────────────────────────────────────────────────────────────

function PregledTab({ slobodno, aktivno, poenBalans, kurs, statusZahtevi, poslednjiKursovi, onRefresh }: Props & { onRefresh: () => void }) {
  const t = useTranslations("zrno");
  const tc = useTranslations("common");
  const [prikazKurs, setPrikazKurs] = useState(false);
  const [kolicina, setKolicina] = useState("");
  const [akcija, setAkcija] = useState<"ZAKLJUCAJ" | "OTKLJUCAJ">("ZAKLJUCAJ");
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  const maxZakljucaj = slobodno;
  const maxOtkljucaj = aktivno;

  async function promeniStatus() {
    const kol = Number(kolicina);
    if (!kol || kol <= 0) { setPoruka({ text: t("unesite_pozitivan"), ok: false }); return; }
    setLoading(true); setPoruka(null);
    const url = akcija === "ZAKLJUCAJ" ? "/api/zrno/zakljucaj" : "/api/zrno/otkljucaj";
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kolicina: kol }) });
    const data = await res.json();
    setLoading(false);
    setPoruka({ text: res.ok ? data.poruka : (data.error ?? "Greška."), ok: res.ok });
    if (res.ok) { setKolicina(""); setTimeout(onRefresh, 1200); }
  }

  return (
    <div className="space-y-4">
      {/* Pending status zahtevi */}
      {statusZahtevi.length > 0 && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-100 rounded-2xl px-5 py-3 text-sm text-kolo-gold-600 space-y-1">
          <p className="font-semibold">{t("cekanje_naslov")}</p>
          {statusZahtevi.map((z, i) => (
            <p key={i}>· {t("cekanje_red", { kolicina: z.kolicina.toLocaleString("sr-RS"), akcija: z.akcija === "ZAKLJUCAJ" ? t("zaključavanje") : t("otkljucavanje") })}</p>
          ))}
        </div>
      )}

      {/* Promena statusa */}
      {(slobodno > 0 || aktivno > 0) && (
        <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
          <p className="text-sm font-semibold text-kolo-muted">{t("promena_statusa")}</p>
          <p className="text-xs text-kolo-muted">{t("promena_napomena")}</p>
          <div className="flex gap-2">
            {(["ZAKLJUCAJ", "OTKLJUCAJ"] as const).map((a) => (
              <button key={a} type="button" onClick={() => setAkcija(a)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${akcija === a ? "bg-kolo-gold-600 text-white" : "bg-white border border-kolo-border text-kolo-muted"}`}>
                {a === "ZAKLJUCAJ" ? t("zakljucaj", { max: maxZakljucaj }) : t("otkljucaj", { max: maxOtkljucaj })}
              </button>
            ))}
          </div>
          <input type="number" min={1} max={akcija === "ZAKLJUCAJ" ? maxZakljucaj : maxOtkljucaj}
            value={kolicina} onChange={(e) => setKolicina(e.target.value)}
            placeholder={t("kolicina_placeholder")}
            className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-gold-600" />
          {poruka && (
            <p className={`text-xs px-3 py-2 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>
          )}
          <button onClick={promeniStatus} disabled={loading}
            className="w-full py-2.5 rounded-xl bg-kolo-gold-600 text-white text-sm font-semibold hover:bg-kolo-gold-600 disabled:opacity-60 transition-colors">
            {loading ? "..." : t("posalji_zahtev")}
          </button>
        </div>
      )}

      {/* Istorija kursa */}
      {poslednjiKursovi.length > 0 && (
        <div className="bg-white rounded-2xl border border-kolo-border overflow-hidden">
          <div className="px-5 py-3 border-b border-kolo-border flex justify-between items-center cursor-pointer" onClick={() => setPrikazKurs((v) => !v)}>
            <h3 className="text-sm font-semibold text-kolo-muted">{t("istorija_kursa")}</h3>
            <span className="text-xs text-kolo-muted">{prikazKurs ? tc("sakrij") : tc("prikaži")}</span>
          </div>
          {prikazKurs && poslednjiKursovi.map((r, i) => (
            <div key={r.date} className={`px-5 py-2.5 flex justify-between text-sm ${i < poslednjiKursovi.length - 1 ? "border-b border-kolo-border" : ""}`}>
              <span className="text-kolo-muted">{new Date(r.date).toLocaleDateString("sr-RS", { day: "2-digit", month: "short" })}</span>
              <span className="font-semibold text-kolo-green-700">{r.kurs.toFixed(2)} POEN/ZRNO</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tržište ───────────────────────────────────────────────────────────────────

function TrzisteTab({ slobodno, poenBalans, kurs, trzisjeAktivno, isVerified, upisZahtev, otpisZahtev, onRefresh }: Props & { onRefresh: () => void }) {
  const t = useTranslations("zrno");
  const [poenZaUpis, setPoenZaUpis] = useState("");
  const [kolicinaOtpis, setKolicinaOtpis] = useState("");
  const [loading, setLoading] = useState<"upis" | "otpis" | null>(null);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean; for: string } | null>(null);

  const maxPoen = Math.floor(poenBalans * 0.01);
  const procijenjenoZrna = poenZaUpis ? Math.floor(Number(poenZaUpis) / kurs) : 0;
  const procijenjenoPoen = kolicinaOtpis ? Math.floor(Number(kolicinaOtpis) * kurs) : 0;

  async function upis() {
    const iznos = Number(poenZaUpis);
    if (!iznos || iznos <= 0) return;
    setLoading("upis"); setPoruka(null);
    const res = await fetch("/api/zrno/upis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ poenIznos: iznos }) });
    const data = await res.json();
    setLoading(null);
    setPoruka({ text: res.ok ? data.poruka : (data.error ?? "Greška."), ok: res.ok, for: "upis" });
    if (res.ok) { setPoenZaUpis(""); setTimeout(onRefresh, 1200); }
  }

  async function otpis() {
    const kol = Number(kolicinaOtpis);
    if (!kol || kol <= 0) return;
    setLoading("otpis"); setPoruka(null);
    const res = await fetch("/api/zrno/otpis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kolicina: kol }) });
    const data = await res.json();
    setLoading(null);
    setPoruka({ text: res.ok ? data.poruka : (data.error ?? "Greška."), ok: res.ok, for: "otpis" });
    if (res.ok) { setKolicinaOtpis(""); setTimeout(onRefresh, 1200); }
  }

  if (!trzisjeAktivno) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
        {t("trziste_neaktivno_tab")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upis */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold text-kolo-muted">{t("upis_naslov")}</p>
          <span className="text-xs text-kolo-muted">{t("upis_max", { max: maxPoen.toLocaleString("sr-RS") })}</span>
        </div>
        {upisZahtev && (
          <div className="bg-kolo-gold-100 text-kolo-gold-600 text-xs px-3 py-2 rounded-lg">
            {t("upis_aktivan_zahtev", { iznos: upisZahtev.poenIznos.toLocaleString("sr-RS"), status: upisZahtev.status })}
          </div>
        )}
        {!upisZahtev && (
          <>
            <input type="number" min={1} max={maxPoen} value={poenZaUpis} onChange={(e) => setPoenZaUpis(e.target.value)}
              placeholder={`POEN (max ${maxPoen.toLocaleString("sr-RS")})`}
              className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-gold-600" />
            {procijenjenoZrna > 0 && (
              <p className="text-xs text-kolo-muted">{t("upis_procena", { zrna: procijenjenoZrna.toLocaleString("sr-RS"), kurs: kurs.toFixed(2) })}</p>
            )}
            {poruka?.for === "upis" && (
              <p className={`text-xs px-3 py-2 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>
            )}
            <button onClick={upis} disabled={loading !== null || !poenZaUpis}
              className="w-full py-2.5 rounded-xl bg-kolo-gold-600 text-white text-sm font-semibold hover:bg-kolo-gold-600 disabled:opacity-60 transition-colors">
              {loading === "upis" ? "..." : t("upis_dugme")}
            </button>
          </>
        )}
        <p className="text-xs text-kolo-muted">{t("upis_napomena")}</p>
      </div>

      {/* Otpis */}
      <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
        <p className="text-sm font-semibold text-kolo-muted">{t("otpis_naslov")}</p>
        {otpisZahtev && (
          <div className="bg-kolo-gold-100 text-kolo-gold-600 text-xs px-3 py-2 rounded-lg">
            {t("otpis_aktivan_zahtev", { kolicina: otpisZahtev.kolicina.toLocaleString("sr-RS"), status: otpisZahtev.status })}
          </div>
        )}
        {!otpisZahtev && (
          <>
            <input type="number" min={1} max={slobodno} value={kolicinaOtpis} onChange={(e) => setKolicinaOtpis(e.target.value)}
              placeholder={`max ${slobodno.toLocaleString("sr-RS")} ZRNA`}
              className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-gold-600" />
            {procijenjenoPoen > 0 && (
              <p className="text-xs text-kolo-muted">{t("otpis_procena", { poen: procijenjenoPoen.toLocaleString("sr-RS"), kurs: kurs.toFixed(2) })}</p>
            )}
            {poruka?.for === "otpis" && (
              <p className={`text-xs px-3 py-2 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>
            )}
            <button onClick={otpis} disabled={loading !== null || !kolicinaOtpis || slobodno <= 0}
              className="w-full py-2.5 rounded-xl bg-kolo-gold-600 text-white text-sm font-semibold hover:bg-kolo-gold-600 disabled:opacity-60 transition-colors">
              {loading === "otpis" ? "..." : t("otpis_dugme")}
            </button>
          </>
        )}
        <p className="text-xs text-kolo-muted">{t("otpis_napomena")}</p>
      </div>
    </div>
  );
}

// ── Delegacija ────────────────────────────────────────────────────────────────

function DelegacijaTab({ glasackaMoc: moja, delegacija, onRefresh }: Props & { onRefresh: () => void }) {
  const t = useTranslations("zrno");
  const [pseudonim, setPseudonim] = useState("");
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  async function delegiraj() {
    if (!pseudonim.trim()) return;
    setLoading(true); setPoruka(null);
    const res = await fetch("/api/zrno/delegiraj", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pseudonim: pseudonim.trim() }) });
    const data = await res.json();
    setLoading(false);
    setPoruka({ text: res.ok ? data.poruka : (data.error ?? "Greška."), ok: res.ok });
    if (res.ok) { setPseudonim(""); setTimeout(onRefresh, 1200); }
  }

  async function opozovi() {
    if (!confirm(t("opozovi_pitanje"))) return;
    setLoading(true);
    await fetch("/api/zrno/delegiraj", { method: "DELETE" });
    setLoading(false);
    setTimeout(onRefresh, 500);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
        <p className="text-sm font-semibold text-kolo-muted">{t("delegacija_naslov")}</p>
        <p className="text-xs text-kolo-muted">
          {t("delegacija_opis", { moc: moja })}
        </p>

        {delegacija && (
          <div className="bg-kolo-gold-100 border border-kolo-gold-400/30 rounded-xl px-4 py-3 text-sm flex justify-between items-center">
            <div>
              {delegacija.aktivna && (
                <p className="font-medium text-kolo-gold-600">{t("delegat_label")} {delegacija.delegatPseudonim}</p>
              )}
              {delegacija.imaZakazano ? (
                <p className="text-xs text-kolo-gold-600 mt-0.5">
                  {delegacija.zakazaniPseudonim
                    ? `Zakazano: → ${delegacija.zakazaniPseudonim} — stupa na snagu u ponoć`
                    : "Zakazan opoziv — stupa na snagu u ponoć"}
                </p>
              ) : (
                delegacija.aktivna && <p className="text-xs text-kolo-gold-600 mt-0.5">{t("aktivna")}</p>
              )}
            </div>
            <button onClick={opozovi} disabled={loading}
              className="px-3 py-1.5 text-xs text-kolo-danger border border-kolo-danger/20 rounded-xl hover:bg-kolo-danger-light transition-colors">
              {t("opozovi")}
            </button>
          </div>
        )}

        {!delegacija && (
          <>
            <input type="text" value={pseudonim} onChange={(e) => setPseudonim(e.target.value)}
              placeholder={t("delegat_placeholder")}
              className="w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-gold-600" />
            {poruka && (
              <p className={`text-xs px-3 py-2 rounded-lg ${poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"}`}>{poruka.text}</p>
            )}
            <button onClick={delegiraj} disabled={loading || !pseudonim.trim()}
              className="w-full py-2.5 rounded-xl bg-kolo-gold-600 text-white text-sm font-semibold hover:bg-kolo-gold-600 disabled:opacity-60 transition-colors">
              {loading ? "..." : t("delegiraj")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
