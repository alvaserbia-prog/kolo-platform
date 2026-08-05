"use client";

import { useState, useCallback } from "react";
import { intlTag } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import GlasanjeKlijent from "@/app/(app)/glasanje/GlasanjeKlijent";
import PageOpis from "@/components/PageOpis";
import Pojam from "@/components/Pojam";
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

export default function ZrnoKlijent(props: Props) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("zrno");
  const onRefresh = useCallback(() => router.refresh(), [router]);

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
      <PageOpis>{t("opis")}</PageOpis>

      {/* Stanje */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-2xl border border-kolo-border p-3 sm:p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("slobodno")}</p>
          <p className="text-lg sm:text-xl font-bold text-kolo-text">{props.slobodno.toLocaleString(intlTag(locale))}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("slobodno_opis")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-3 sm:p-4">
          <p className="text-xs text-kolo-muted mb-1">{t("aktivno")}</p>
          <p className="text-lg sm:text-xl font-bold text-kolo-gold-600">{props.aktivno.toLocaleString(intlTag(locale))}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("aktivno_opis")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-kolo-border p-3 sm:p-4">
          <p className="text-xs text-kolo-muted mb-1">
            <Pojam
              termin={t("kurs")}
              objasnjenje="Odnos ukupnih POEN-a i raspoloživih ZRNA — pokazuje koliko ti je POEN-a potrebno da upišeš jedno ZRNO. Nije cena i nije kurs."
            />
          </p>
          <p className="text-lg sm:text-xl font-bold text-kolo-green-700">{props.kurs.toLocaleString(intlTag(locale), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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

      {/* Razdvajač */}
      <div className="border-t border-kolo-border pt-2" />

      {/* Glasanje sekcija */}
      <GlasanjeKlijent predlozi={props.predlozi} mojaGlasackaMoc={props.glasackaMoc} />

      {/* Delegacija */}
      <DelegacijaSekcija {...props} onRefresh={onRefresh} />
    </div>
  );
}

// ── Delegacija ────────────────────────────────────────────────────────────────

function DelegacijaSekcija({ glasackaMoc: moja, delegacija, onRefresh }: Props & { onRefresh: () => void }) {
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
                <p className="font-medium text-kolo-gold-600">{t("delegat_label")} <Pseudonim>{delegacija.delegatPseudonim}</Pseudonim></p>
              )}
              {delegacija.imaZakazano ? (
                <p className="text-xs text-kolo-gold-600 mt-0.5">
                  {delegacija.zakazaniPseudonim
                    ? t.rich("zakazana_promena", { pseudonim: delegacija.zakazaniPseudonim, ime: (c) => <Pseudonim>{c}</Pseudonim> })
                    : t("zakazan_opoziv")}
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
