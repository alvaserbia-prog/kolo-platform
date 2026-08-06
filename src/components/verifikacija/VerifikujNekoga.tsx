"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import UspehKartica from "@/components/UspehKartica";

// Dinamički import — html5-qrcode koristi DOM i ne sme da se izvršava na serveru
const QrSkener = dynamic(() => import("./QrSkener"), { ssr: false });

type Mod = "izbor" | "skener" | "broj";

/**
 * Forma za izvršavanje verifikacije.
 * Korisnik bira između skeniranja kamerom ili ručnog unosa 6-cifrenog broja.
 */
export default function VerifikujNekoga({ mozeDaVerifikuje }: { mozeDaVerifikuje: boolean }) {
  const t = useTranslations("verifikacija");
  const router = useRouter();
  const [mod, setMod] = useState<Mod>("izbor");
  const [tokenIliBroj, setTokenIliBroj] = useState("");
  const [oznaka, setOznaka] = useState("");
  const [potvrdjeno, setPotvrdjeno] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uspeh, setUspeh] = useState<string | null>(null);

  if (!mozeDaVerifikuje) {
    return (
      <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
        <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-2">
          {t("vn_naslov")}
        </div>
        <p className="text-sm text-kolo-muted">{t("vn_nema_prava")}</p>
      </div>
    );
  }

  async function posaji(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUspeh(null);
    if (!potvrdjeno) {
      setError(t("vn_potvrdi_obavezno"));
      return;
    }
    const ocisceno = tokenIliBroj.replace(/\s+/g, "");
    setLoading(true);
    try {
      const res = await fetch("/api/verifikacija", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: ocisceno, potvrdaPoznavanja: true, oznaka: oznaka.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("greska_opsta"));
        return;
      }
      setUspeh(data.verifikovaniPseudonim);
      setTokenIliBroj("");
      setOznaka("");
      setPotvrdjeno(false);
      setMod("izbor");
      router.refresh();
    } catch {
      setError(t("greska_mreza"));
    } finally {
      setLoading(false);
    }
  }

  if (uspeh) {
    return (
      <UspehKartica
        naslov={t("vn_uspeh_naslov")}
        opis={
          <>
            <span className="font-semibold text-kolo-text">@{uspeh}</span> {t("vn_uspeh_opis")}
          </>
        }
        dugmeTekst={t("vn_uspeh_dugme")}
        onDugme={() => {
          setUspeh(null);
          setMod("izbor");
        }}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-3">
        {t("vn_naslov")}
      </div>

      {mod === "izbor" && (
        <>
          <p className="text-sm text-kolo-muted mb-3">
            {t("vn_uputstvo")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMod("skener")}
              className="px-4 py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900"
            >
              {t("vn_dugme_skener")}
            </button>
            <button
              type="button"
              onClick={() => setMod("broj")}
              className="px-4 py-3 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
            >
              {t("vn_dugme_broj")}
            </button>
          </div>
        </>
      )}

      {mod === "skener" && (
        <>
          <QrSkener
            onDetektovan={(token) => {
              setTokenIliBroj(token);
              setMod("broj"); // posle skena prelazimo na potvrdni ekran
            }}
            onZatvori={() => setMod("izbor")}
          />
        </>
      )}

      {mod === "broj" && (
        <form onSubmit={posaji} className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            value={tokenIliBroj}
            onChange={(e) => setTokenIliBroj(e.target.value)}
            placeholder={t("vn_ph_token")}
            className="w-full px-3 py-2 rounded-xl border border-kolo-border text-base font-mono tracking-wider outline-none focus:border-kolo-green-500 transition-colors"
            autoFocus
            required
          />
          <div>
            <input
              type="text"
              value={oznaka}
              onChange={(e) => setOznaka(e.target.value)}
              maxLength={80}
              placeholder={t("vn_ph_oznaka")}
              className="w-full px-3 py-2 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
            />
            <p className="text-xs text-kolo-muted mt-1">
              {t("vn_oznaka_napomena")}
            </p>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={potvrdjeno}
              onChange={(e) => setPotvrdjeno(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              {t("vn_potvrda")}
            </span>
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !potvrdjeno || tokenIliBroj.trim().length < 6}
              className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-medium hover:bg-kolo-green-900 disabled:opacity-50"
            >
              {loading ? t("vn_saljem") : t("vn_dugme_potvrdi")}
            </button>
            <button
              type="button"
              onClick={() => {
                setMod("izbor");
                setError(null);
              }}
              className="px-4 py-2 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
            >
              {t("vn_nazad")}
            </button>
          </div>
          {error && <div className="text-sm text-kolo-danger">{error}</div>}
        </form>
      )}
    </div>
  );
}
