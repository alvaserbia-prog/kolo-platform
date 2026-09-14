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
  koeficijent: number;
  kanalAktivan: boolean;
  isVerified: boolean;
  /**
   * Identifikovan član — javan donator čiji je uplatilac upoređen sa nalogom
   * (R-01, mera M-9). Sme da UPIŠE ZRNO, ali ne i da ga otpiše, aktivira ili
   * delegira (odluka D-1): otpis je jedino mesto gde položaj donosi prinos, pa bi
   * otvoren dao prinos na uplaćen novac. Rute to već sprovode — ovde se samo
   * prikazuje, da čovek uslov vidi PRE nego što ga sistem odbije.
   */
  identitetUtvrdjen: boolean;
  minimumPoenZaUpis: number;
  upisZahtev: { poenIznos: number; status: string } | null;
  otpisZahtev: { kolicina: number; status: string } | null;
  statusZahtevi: { kolicina: number; akcija: string }[];
  delegacija: {
    aktivna: boolean;
    delegatPseudonim: string | null;
    imaZakazano: boolean;
    zakazaniPseudonim: string | null;
  } | null;
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
              termin={t("koeficijent")}
              objasnjenje={t("koeficijent_objasnjenje")}
            />
          </p>
          <p className="text-lg sm:text-xl font-bold text-kolo-green-700">{props.koeficijent.toLocaleString(intlTag(locale), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-kolo-muted mt-0.5">{t("koeficijent_opis")}</p>
        </div>
      </div>

      {/* Glasačka moć formula */}
      {props.aktivno > 0 && (
        <div className="bg-kolo-gold-100 border border-kolo-gold-400/30 rounded-2xl px-5 py-3 text-sm text-kolo-gold-600">
          {t("glasacka_moc_formula", { aktivno: props.aktivno, moc: props.glasackaMoc })}
        </div>
      )}

      {!props.kanalAktivan && (
        <div className="box-warning text-sm">
          {t("kanal_neaktivan")}
        </div>
      )}

      {/* Upis / otpis / aktiviranje */}
      <UpisOtpisSekcija {...props} onRefresh={onRefresh} />

      {/* Razdvajač */}
      <div className="border-t border-kolo-border pt-2" />

      {/* Glasanje sekcija */}
      <GlasanjeKlijent predlozi={props.predlozi} mojaGlasackaMoc={props.glasackaMoc} />

      {/* Delegacija */}
      <DelegacijaSekcija {...props} onRefresh={onRefresh} />
    </div>
  );
}

// ── Upis, otpis i aktiviranje ─────────────────────────────────

/**
 * Ekran za upis i otpis ZRNA (Pravilnik čl. 19–22).
 *
 * Do R-01 ovog ekrana NIJE bilo — stranica je prikazivala stanja, glasanje i
 * delegaciju, a rute `/api/zrno/{upis,otpis,zakljucaj,otkljucaj}` su postojale bez
 * ijedne ulazne tačke. Upis je odlukom B otvoren i identifikovanom članu, pa je
 * ekran postao neophodan: bez njega to pravo nema gde da se ostvari.
 *
 * 🔴 Upozorenje pre upisa nije ukras nego uslov iz odluke D-1: identifikovan
 * član ZRNO upisuje JEDNOSMERNO — ne može ga otpisati, aktivirati ni delegirati
 * dok mu neko iz mreže ne potvrdi stvarnost, a niko nije dužan da to učini.
 * Ne uklanjati ga i ne ublažavati.
 */
function UpisOtpisSekcija({
  slobodno,
  aktivno,
  poenBalans,
  koeficijent,
  kanalAktivan,
  isVerified,
  identitetUtvrdjen,
  minimumPoenZaUpis,
  upisZahtev,
  otpisZahtev,
  statusZahtevi,
  onRefresh,
}: Props & { onRefresh: () => void }) {
  const t = useTranslations("zrno");
  const locale = useLocale();
  const [poenIznos, setPoenIznos] = useState("");
  const [otpisKolicina, setOtpisKolicina] = useState("");
  const [statusKolicina, setStatusKolicina] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [poruka, setPoruka] = useState<{ text: string; ok: boolean } | null>(null);

  // Identifikovan član koji još nije potvrđen — njemu je otvoren samo upis.
  const samoUpis = !isVerified && identitetUtvrdjen;
  const maxUpis = Math.floor(poenBalans * 0.01);
  const ispodMinimuma = poenBalans < minimumPoenZaUpis;

  const posalji = useCallback(
    async (putanja: string, telo: Record<string, unknown>, kljuc: string) => {
      setLoading(kljuc);
      setPoruka(null);
      const res = await fetch(putanja, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telo),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(null);
      setPoruka({ text: res.ok ? (data.poruka ?? "") : (data.error ?? t("greska_zahtev")), ok: res.ok });
      if (res.ok) {
        setPoenIznos("");
        setOtpisKolicina("");
        setStatusKolicina("");
        setTimeout(onRefresh, 1200);
      }
    },
    [onRefresh, t]
  );

  if (!kanalAktivan) return null;

  const brojCls =
    "w-full px-3 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-gold-600";
  const dugmeCls =
    "w-full py-2.5 rounded-xl bg-kolo-gold-600 text-white text-sm font-semibold disabled:opacity-60 transition-colors";
  const zatvorenaKartica = (naslov: string, opis: string) => (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-2 opacity-70">
      <p className="text-sm font-semibold text-kolo-muted">{naslov}</p>
      <p className="text-xs text-kolo-muted">{opis}</p>
      <p className="text-xs px-3 py-2 rounded-lg bg-kolo-bg text-kolo-muted">{t("donator_zatvoreno")}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-kolo-muted">{t("upravljanje_naslov")}</p>

      {poruka && (
        <p
          className={`text-xs px-3 py-2 rounded-lg ${
            poruka.ok ? "bg-kolo-green-100 text-kolo-green-700" : "bg-kolo-danger-light text-kolo-danger"
          }`}
        >
          {poruka.text}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {/* ── Upis ── */}
        <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
          <p className="text-sm font-semibold text-kolo-muted">{t("upis_naslov")}</p>
          <p className="text-xs text-kolo-muted">{t("upis_opis")}</p>

          {/* 🔴 Odluka D-1 — upozorenje stoji PRE polja, ne posle. */}
          {samoUpis && (
            <p className="text-xs px-3 py-2 rounded-lg bg-kolo-gold-100 text-kolo-gold-600">
              {t("donator_upozorenje")}
            </p>
          )}

          {upisZahtev && upisZahtev.status === "PENDING" ? (
            <p className="text-xs px-3 py-2 rounded-lg bg-kolo-gold-100 text-kolo-gold-600">
              {t("upis_na_cekanju", { iznos: upisZahtev.poenIznos.toLocaleString(intlTag(locale)) })}
            </p>
          ) : ispodMinimuma ? (
            <p className="text-xs px-3 py-2 rounded-lg bg-kolo-bg text-kolo-muted">
              {t("upis_minimum", { min: minimumPoenZaUpis.toLocaleString(intlTag(locale)) })}
            </p>
          ) : (
            <>
              <p className="text-xs text-kolo-muted">
                {t("upis_max", { max: maxUpis.toLocaleString(intlTag(locale)) })}
              </p>
              <input
                type="number"
                min={1}
                max={maxUpis}
                value={poenIznos}
                onChange={(e) => setPoenIznos(e.target.value)}
                placeholder={t("upis_placeholder")}
                className={brojCls}
              />
              <button
                onClick={() => {
                  if (samoUpis && !confirm(t("donator_upozorenje"))) return;
                  void posalji("/api/zrno/upis", { poenIznos: Number(poenIznos) }, "upis");
                }}
                disabled={loading !== null || !poenIznos || Number(poenIznos) <= 0}
                className={dugmeCls}
              >
                {loading === "upis" ? "..." : t("upis_dugme")}
              </button>
            </>
          )}
        </div>

        {/* ── Otpis ── */}
        {samoUpis ? (
          zatvorenaKartica(t("otpis_naslov"), t("otpis_opis"))
        ) : (
          <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
            <p className="text-sm font-semibold text-kolo-muted">{t("otpis_naslov")}</p>
            <p className="text-xs text-kolo-muted">{t("otpis_opis")}</p>
            {otpisZahtev && otpisZahtev.status === "PENDING" ? (
              <p className="text-xs px-3 py-2 rounded-lg bg-kolo-gold-100 text-kolo-gold-600">
                {t("otpis_na_cekanju", { kolicina: otpisZahtev.kolicina.toLocaleString(intlTag(locale)) })}
              </p>
            ) : slobodno <= 0 ? (
              <p className="text-xs px-3 py-2 rounded-lg bg-kolo-bg text-kolo-muted">{t("nema_slobodnih")}</p>
            ) : (
              <>
                <p className="text-xs text-kolo-muted">
                  {t("otpis_priblizno", {
                    poen: Math.floor(Number(otpisKolicina || 0) * koeficijent).toLocaleString(intlTag(locale)),
                  })}
                </p>
                <input
                  type="number"
                  min={1}
                  max={slobodno}
                  value={otpisKolicina}
                  onChange={(e) => setOtpisKolicina(e.target.value)}
                  placeholder={t("otpis_placeholder")}
                  className={brojCls}
                />
                <button
                  onClick={() => void posalji("/api/zrno/otpis", { kolicina: Number(otpisKolicina) }, "otpis")}
                  disabled={loading !== null || !otpisKolicina || Number(otpisKolicina) <= 0}
                  className={dugmeCls}
                >
                  {loading === "otpis" ? "..." : t("otpis_dugme")}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Aktiviranje / deaktiviranje ── */}
        {samoUpis ? (
          zatvorenaKartica(t("status_naslov"), t("status_opis"))
        ) : (
          <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
            <p className="text-sm font-semibold text-kolo-muted">{t("status_naslov")}</p>
            <p className="text-xs text-kolo-muted">{t("status_opis")}</p>
            {statusZahtevi.length > 0 && (
              <div className="space-y-1">
                {statusZahtevi.map((z, i) => (
                  <p key={i} className="text-xs px-3 py-2 rounded-lg bg-kolo-gold-100 text-kolo-gold-600">
                    {t("status_na_cekanju", {
                      akcija: z.akcija === "ZAKLJUCAJ" ? t("akcija_aktiviraj") : t("akcija_deaktiviraj"),
                      kolicina: z.kolicina.toLocaleString(intlTag(locale)),
                    })}
                  </p>
                ))}
              </div>
            )}
            {slobodno > 0 || aktivno > 0 ? (
              <>
                <input
                  type="number"
                  min={1}
                  value={statusKolicina}
                  onChange={(e) => setStatusKolicina(e.target.value)}
                  placeholder={t("status_placeholder")}
                  className={brojCls}
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => void posalji("/api/zrno/zakljucaj", { kolicina: Number(statusKolicina) }, "zakljucaj")}
                    disabled={loading !== null || !statusKolicina || Number(statusKolicina) <= 0 || slobodno <= 0}
                    className={dugmeCls}
                  >
                    {loading === "zakljucaj" ? "..." : t("zakljucaj", { max: slobodno })}
                  </button>
                  <button
                    onClick={() => void posalji("/api/zrno/otkljucaj", { kolicina: Number(statusKolicina) }, "otkljucaj")}
                    disabled={loading !== null || !statusKolicina || Number(statusKolicina) <= 0 || aktivno <= 0}
                    className="w-full py-2.5 rounded-xl border border-kolo-border text-kolo-muted text-sm font-semibold disabled:opacity-60 transition-colors"
                  >
                    {loading === "otkljucaj" ? "..." : t("otkljucaj", { max: aktivno })}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs px-3 py-2 rounded-lg bg-kolo-bg text-kolo-muted">{t("nema_zrna")}</p>
            )}
          </div>
        )}
      </div>
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
    setPoruka({ text: res.ok ? data.poruka : (data.error ?? t("greska_delegiranje")), ok: res.ok });
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
