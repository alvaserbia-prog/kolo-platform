"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import QrSkener from "@/components/verifikacija/QrSkener";

// Isti obrazac kao na stranici Potvrde: QR se crta tek kad se zatraži kod, pa
// biblioteka ne ulazi u početni bundle.
const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), { ssr: false });

type Prijatelj = {
  /** Id PRIJATELJSTVA (ne korisnika) — po njemu ide raskid. */
  id: string;
  korisnikId: string;
  pseudonim: string;
  avatar: string | null;
  isplaceno: boolean;
  /** Braća i sestre: prijateljstvo radi, samo ne nosi POEN (čl. 14b st. 4). */
  bezPoena: boolean;
  /** Čeka drugu stranu da postane aktivna — „500 na čekanju". */
  naCekanju: boolean;
};

/** Ista paleta kao na dečjoj početnoj — dečji prostor ima svoje boje, ne zelenu. */
const BOJE = ["#E4572E", "#F4A259", "#F2C14E", "#8FC93A", "#4CB5AE", "#3D7EA6", "#8E6FBF", "#E56399"];

export default function PrijateljiKlijent() {
  const t = useTranslations("prijatelji");
  const [broj, setBroj] = useState<number | null>(null);
  const [naCekanju, setNaCekanju] = useState(0);
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
      setNaCekanju(data.poenNaCekanju ?? 0);
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

  /**
   * Raskid (čl. 14c). 🔴 Potvrda pre raskida NIJE ukras: otpisuje se 500 POEN i
   * onome ko raskida i onome ko je raskinut, pa tekst mora da kaže tačno to.
   */
  async function raskini(p: Prijatelj) {
    const pitanje = p.isplaceno
      ? t("raskid_potvrda_poen", { pseudonim: p.pseudonim })
      : t("raskid_potvrda", { pseudonim: p.pseudonim });
    if (!confirm(pitanje)) return;
    setGreska(null);
    setPoruka(null);
    try {
      const res = await fetch(`/api/deca/prijatelji/${p.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? t("greska_slanje"));
      setPoruka(t("raskid_uspeh", { pseudonim: p.pseudonim }));
      await ucitaj();
    } catch (e) {
      setGreska(e instanceof Error ? e.message : t("greska_slanje"));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Umesto indeksa stvarnosti — broj prijatelja. */}
      <section
        className="rounded-3xl bg-white p-6 text-center shadow-sm"
        style={{ border: `4px solid ${BOJE[6]}` }}
      >
        <h1 className="text-lg font-bold" style={{ color: BOJE[5] }}>{t("naslov")}</h1>
        <p className="mt-2 text-6xl font-extrabold tabular-nums" style={{ color: BOJE[6] }}>
          {broj ?? "–"}
        </p>
        <p className="text-sm text-kolo-muted">{t("brojac_opis")}</p>
        {/* „500 na čekanju" uz pseudonim je i namera, ne samo obaveštenje: dete koje
            je aktivno ne dobija ništa dok drugom roditelj ne preuzme nalog. */}
        {naCekanju > 0 && (
          <p className="mt-2 rounded-xl bg-kolo-bg px-3 py-2 text-sm font-semibold" style={{ color: BOJE[0] }}>
            {t("na_cekanju", { iznos: naCekanju })}
          </p>
        )}
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
        <section
          className="rounded-3xl bg-white p-6 text-center shadow-sm"
          style={{ border: `3px solid ${BOJE[3]}` }}
        >
          <h2 className="font-bold" style={{ color: BOJE[3] }}>{t("moj_kod")}</h2>
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
              style={{ backgroundColor: BOJE[3] }}
              className="mt-3 rounded-full px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
            >
              {t("pokazi_kod")}
            </button>
          )}
        </section>

        <section
          className="rounded-3xl bg-white p-6 text-center shadow-sm"
          style={{ border: `3px solid ${BOJE[4]}` }}
        >
          <h2 className="font-bold" style={{ color: BOJE[4] }}>{t("skeniraj")}</h2>
          <p className="mt-1 text-xs text-kolo-muted">{t("skeniraj_opis")}</p>
          <button
            type="button"
            onClick={() => setSkenira(true)}
            style={{ backgroundColor: BOJE[4] }}
            className="mt-3 rounded-full px-5 py-2 text-sm font-bold text-white transition hover:brightness-110"
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

      <section
        className="rounded-3xl bg-white p-6 shadow-sm"
        style={{ border: `3px solid ${BOJE[1]}` }}
      >
        <h2 className="font-bold" style={{ color: BOJE[1] }}>{t("spisak_naslov")}</h2>
        {spisak.length === 0 ? (
          <p className="mt-2 text-sm text-kolo-muted">{t("spisak_prazno")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {spisak.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-kolo-bg px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    style={{ backgroundColor: BOJE[i % BOJE.length] }}
                    className="truncate rounded-full px-3 py-1.5 text-sm font-bold text-white"
                  >
                    {p.pseudonim}
                  </span>
                  <span className="text-xs text-kolo-muted">
                    {p.bezPoena
                      ? t("oznaka_bez_poena")
                      : p.isplaceno
                        ? t("oznaka_isplaceno")
                        : t("oznaka_ceka")}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => raskini(p)}
                  className="shrink-0 rounded-full border border-kolo-border px-3 py-1 text-xs font-medium text-kolo-muted transition hover:border-kolo-danger hover:text-kolo-danger"
                >
                  {t("dugme_raskini")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
