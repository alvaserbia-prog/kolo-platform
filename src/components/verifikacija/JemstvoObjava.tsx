"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

/**
 * Forma za objavu zahteva na tabli jemstva + status sopstvenog aktivnog zahteva.
 * Ugrađuje se u /verifikacija za neverifikovanog korisnika (opcija B: spajanje
 * table jemstva i verifikacije u jedan ekran). Deli „tablaJemstva" prevode i
 * /api/tabla-jemstva sa punom tablom — ista pravila (jedan aktivan zahtev).
 */
type MojZahtev = {
  id: string;
  expiresAt: string;
  mojZahtev: boolean;
};

function preostaloSati(expiresAt: string): number {
  return Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / (60 * 60 * 1000)));
}

export default function JemstvoObjava() {
  const t = useTranslations("tablaJemstva");
  const [tekst, setTekst] = useState("");
  const [kontakt, setKontakt] = useState("");
  const [pristanak, setPristanak] = useState(false);
  const [greska, setGreska] = useState("");
  const [radnja, setRadnja] = useState(false);
  const [potvrdaPovuci, setPotvrdaPovuci] = useState(false);

  const { data: zahtevi = [], refetch, isLoading } = useQuery({
    queryKey: ["tabla-jemstva"],
    queryFn: async (): Promise<MojZahtev[]> => {
      const res = await fetch("/api/tabla-jemstva");
      if (!res.ok) throw new Error("Greška pri dohvatanju");
      const d = await res.json();
      return d.zahtevi ?? [];
    },
  });

  const moj = zahtevi.find((z) => z.mojZahtev);

  async function objavi() {
    setGreska("");
    setRadnja(true);
    const res = await fetch("/api/tabla-jemstva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tekstPredstavljanja: tekst.trim(), kontaktPodaci: kontakt.trim(), pristanak }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(false);
    if (res.ok) {
      setTekst("");
      setKontakt("");
      setPristanak(false);
      await refetch();
    } else {
      setGreska(d.error ?? t("greska_objava"));
    }
  }

  async function povuci() {
    if (!moj) return;
    setPotvrdaPovuci(false);
    setGreska("");
    setRadnja(true);
    const res = await fetch(`/api/tabla-jemstva/${moj.id}`, { method: "DELETE" });
    setRadnja(false);
    if (res.ok) await refetch();
    else {
      const d = await res.json().catch(() => ({}));
      setGreska(d.error ?? t("greska_generalna"));
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-5 text-sm text-kolo-muted">
        {t("ucitavanje")}
      </div>
    );
  }

  // Ima aktivan zahtev — prikaži status + povlačenje.
  if (moj) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
        <div>
          <p className="font-semibold text-kolo-text">{t("objava_aktivna_naslov")}</p>
          <p className="text-sm text-kolo-muted mt-0.5">
            {t("objava_aktivna_opis")} <span className="text-kolo-gold-600">{t("istice_za", { sati: preostaloSati(moj.expiresAt) })}</span>
          </p>
        </div>
        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
        )}
        {potvrdaPovuci ? (
          <div className="flex gap-2">
            <button onClick={povuci} disabled={radnja}
              className="px-3 py-1.5 rounded-lg bg-kolo-danger-light text-kolo-danger text-xs font-semibold hover:opacity-80 disabled:opacity-60 transition-opacity">
              {radnja ? "..." : t("dugme_potvrdi_povuci")}
            </button>
            <button onClick={() => setPotvrdaPovuci(false)} disabled={radnja}
              className="px-3 py-1.5 rounded-lg bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors">
              {t("dugme_otkazi")}
            </button>
          </div>
        ) : (
          <button onClick={() => setPotvrdaPovuci(true)} disabled={radnja}
            className="px-3 py-1.5 rounded-lg bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors">
            {t("dugme_povuci")}
          </button>
        )}
      </div>
    );
  }

  // Nema aktivnog zahteva — forma za objavu.
  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-kolo-text">{t("forma_naslov")}</h2>
        <p className="text-sm text-kolo-muted mt-0.5">{t("objava_uvod")}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_predstavljanje")}</label>
        <textarea
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder={t("placeholder_predstavljanje")}
          className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 resize-none transition-colors"
        />
        <p className={`mt-1 text-xs ${tekst.trim().length > 0 && tekst.trim().length < 10 ? "text-kolo-danger" : "text-kolo-muted"}`}>
          {tekst.length}/1000 · {t("counter_min", { min: 10 })}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_kontakt")}</label>
        <input
          type="text"
          value={kontakt}
          onChange={(e) => setKontakt(e.target.value)}
          maxLength={500}
          placeholder={t("placeholder_kontakt")}
          className="w-full px-4 py-3 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-700 transition-colors"
        />
      </div>

      <div className="box-warning px-4 py-3 text-sm text-kolo-gold-600">
        <strong>{t("napomena_predstavljanje_bold")}</strong> {t("napomena_predstavljanje_tekst")} <strong>{t("napomena_kontakt_bold")}</strong> {t("napomena_kontakt_tekst")}
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" checked={pristanak} onChange={(e) => setPristanak(e.target.checked)}
          className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0" />
        <span className="text-xs text-kolo-muted">{t("pristanak_tekst")}</span>
      </label>

      {greska && (
        <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
      )}

      <button
        onClick={objavi}
        disabled={radnja || tekst.trim().length < 10 || kontakt.trim().length < 3 || !pristanak}
        className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
      >
        {radnja ? t("dugme_objavljujem") : t("dugme_objavi")}
      </button>
    </div>
  );
}
