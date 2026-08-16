"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import QrSkener from "@/components/verifikacija/QrSkener";

// Isti obrazac kao na stranici Potvrde: QR se crta tek kad se zatraži kod, pa
// biblioteka ne ulazi u početni bundle.
const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), { ssr: false });

type Prijatelj = { id: string; pseudonim: string; avatar: string | null };

export default function PrijateljiKlijent() {
  const t = useTranslations("prijatelji");
  const [broj, setBroj] = useState<number | null>(null);
  const [spisak, setSpisak] = useState<Prijatelj[]>([]);
  const [kod, setKod] = useState<string | null>(null);
  const [skenira, setSkenira] = useState(false);
  const [poruka, setPoruka] = useState<string | null>(null);
  const [greska, setGreska] = useState<string | null>(null);

  const ucitaj = useCallback(async () => {
    try {
      const res = await fetch("/api/deca/prijatelji", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBroj(data.broj);
      setSpisak(data.prijatelji);
    } catch {
      setGreska(t("greska_ucitavanje"));
    }
  }, [t]);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function pokaziKod() {
    setGreska(null);
    setPoruka(null);
    try {
      const res = await fetch("/api/deca/prijatelji/token", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? t("greska_slanje"));
      setKod(data.token);
    } catch (e) {
      setGreska(e instanceof Error ? e.message : t("greska_slanje"));
    }
  }

  async function skeniran(token: string) {
    setSkenira(false);
    setGreska(null);
    try {
      const res = await fetch("/api/deca/prijatelji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? t("greska_slanje"));
      setPoruka(t("uspeh", { pseudonim: data.pseudonim }));
      await ucitaj();
    } catch (e) {
      setGreska(e instanceof Error ? e.message : t("greska_slanje"));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Umesto indeksa stvarnosti — broj prijatelja. */}
      <section className="rounded-2xl border border-kolo-border bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-kolo-text">{t("naslov")}</h1>
        <p className="mt-2 text-5xl font-bold tabular-nums text-kolo-text">{broj ?? "–"}</p>
        <p className="text-sm text-kolo-muted">{t("brojac_opis")}</p>
      </section>

      {poruka && (
        <p className="rounded-xl border border-kolo-green-700 bg-kolo-green-100 p-3 text-sm text-kolo-green-800">
          {poruka}
        </p>
      )}
      {greska && <p className="text-sm text-kolo-danger">{greska}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Moj kod. 🔴 Ispod QR-a NEMA broja: broj se izdiktira telefonom, a QR se
            mora pokazati — to je jedino što traži da dvoje budu jedno pored drugog. */}
        <section className="rounded-2xl border border-kolo-border bg-white p-6 text-center shadow-sm">
          <h2 className="font-semibold text-kolo-text">{t("moj_kod")}</h2>
          {kod ? (
            <>
              <div className="mt-3 flex justify-center">
                <QRCodeSVG value={kod} size={176} level="M" />
              </div>
              <p className="mt-3 text-xs text-kolo-muted">{t("kod_uputstvo")}</p>
            </>
          ) : (
            <button
              type="button"
              onClick={pokaziKod}
              className="mt-3 rounded-xl bg-kolo-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-kolo-green-800"
            >
              {t("pokazi_kod")}
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-kolo-border bg-white p-6 text-center shadow-sm">
          <h2 className="font-semibold text-kolo-text">{t("skeniraj")}</h2>
          <p className="mt-1 text-xs text-kolo-muted">{t("skeniraj_opis")}</p>
          <button
            type="button"
            onClick={() => setSkenira(true)}
            className="mt-3 rounded-xl border border-kolo-border px-4 py-2 text-sm font-medium text-kolo-text transition hover:bg-kolo-bg"
          >
            {t("dugme_skeniraj")}
          </button>
        </section>
      </div>

      {skenira && (
        <QrSkener
          onDetektovan={skeniran}
          onZatvori={() => setSkenira(false)}
          uputstvo={t("skeniraj_opis")}
        />
      )}

      <section className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-kolo-text">{t("spisak_naslov")}</h2>
        {spisak.length === 0 ? (
          <p className="mt-2 text-sm text-kolo-muted">{t("spisak_prazno")}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {spisak.map((p) => (
              <li
                key={p.id}
                className="rounded-full border border-kolo-border px-3 py-1.5 text-sm text-kolo-text"
              >
                {p.pseudonim}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
