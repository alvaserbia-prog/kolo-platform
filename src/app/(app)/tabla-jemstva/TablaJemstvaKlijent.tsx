"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Zahtev = {
  id: string;
  pseudonim: string;
  tekstPredstavljanja: string;
  createdAt: string;
  mojZahtev: boolean;
};

export default function TablaJemstvaKlijent({
  verified,
  isAdmin,
}: {
  verified: boolean;
  isAdmin: boolean;
}) {
  const t = useTranslations("tablaJemstva");
  const router = useRouter();
  const [zahtevi, setZahtevi] = useState<Zahtev[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [kontakti, setKontakti] = useState<Record<string, string>>({});
  const [radnja, setRadnja] = useState<string | null>(null);
  // Inline potvrda povlačenja (native confirm() je nepouzdan na mobilnim browserima)
  const [potvrdaPovuci, setPotvrdaPovuci] = useState<string | null>(null);

  // Forma
  const [tekst, setTekst] = useState("");
  const [kontakt, setKontakt] = useState("");
  const [pristanak, setPristanak] = useState(false);
  const [greska, setGreska] = useState("");

  const ucitaj = useCallback(async () => {
    setUcitavanje(true);
    const res = await fetch("/api/tabla-jemstva");
    if (res.ok) {
      const d = await res.json();
      setZahtevi(d.zahtevi ?? []);
    }
    setUcitavanje(false);
  }, []);

  useEffect(() => {
    ucitaj();
  }, [ucitaj]);

  const mojAktivan = zahtevi.find((z) => z.mojZahtev);

  async function objavi() {
    setGreska("");
    setRadnja("objava");
    const res = await fetch("/api/tabla-jemstva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tekstPredstavljanja: tekst.trim(), kontaktPodaci: kontakt.trim(), pristanak }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) {
      setTekst("");
      setKontakt("");
      setPristanak(false);
      await ucitaj();
    } else {
      setGreska(d.error ?? t("greska_objava"));
    }
  }

  async function povuci(id: string) {
    setPotvrdaPovuci(null);
    setRadnja(id);
    const res = await fetch(`/api/tabla-jemstva/${id}`, { method: "DELETE" });
    setRadnja(null);
    if (res.ok) await ucitaj();
    else { const d = await res.json().catch(() => ({})); setGreska(d.error ?? t("greska_generalna")); }
  }

  async function prikaziKontakt(id: string) {
    setRadnja(id);
    const res = await fetch(`/api/tabla-jemstva/${id}/kontakt`, { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) setKontakti((k) => ({ ...k, [id]: d.kontaktPodaci }));
    else alert(d.error ?? t("greska_generalna"));
  }

  async function posaljiPoruku(id: string) {
    setRadnja(id);
    const res = await fetch(`/api/tabla-jemstva/${id}/poruka`, { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok && d.konverzacijaId) router.push(`/poruke?k=${d.konverzacijaId}`);
    else alert(d.error ?? t("greska_generalna"));
  }

  async function ukloni(id: string) {
    const razlog = prompt(t("prompt_razlog_uklanjanja"));
    if (razlog === null) return;
    setRadnja(id);
    const res = await fetch(`/api/admin/tabla-jemstva/${id}/ukloni`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog: razlog.trim() }),
    });
    setRadnja(null);
    if (res.ok) await ucitaj();
    else { const d = await res.json().catch(() => ({})); alert(d.error ?? t("greska_generalna")); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-kolo-text">{t("page_naslov")}</h1>
        <p className="text-sm text-kolo-muted mt-1">
          {t("page_opis")}
        </p>
      </div>

      {/* Forma za objavu — samo neverifikovani bez aktivnog zahteva */}
      {!verified && !mojAktivan && (
        <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
          <h2 className="text-base font-semibold text-kolo-text">{t("forma_naslov")}</h2>
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
            <span className="text-xs text-kolo-muted">
              {t("pristanak_tekst")}
            </span>
          </label>

          {greska && (
            <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
          )}

          <div className="space-y-2">
            <button
              onClick={objavi}
              disabled={radnja === "objava" || tekst.trim().length < 10 || kontakt.trim().length < 3 || !pristanak}
              className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-50"
            >
              {radnja === "objava" ? t("dugme_objavljujem") : t("dugme_objavi")}
            </button>
            {radnja !== "objava" && (tekst.trim().length < 10 || kontakt.trim().length < 3 || !pristanak) && (
              <p className="text-xs text-kolo-muted">{t("uslovi_objave")}</p>
            )}
          </div>
        </div>
      )}

      {/* Lista zahteva */}
      {ucitavanje ? (
        <p className="text-sm text-kolo-muted">{t("ucitavanje")}</p>
      ) : zahtevi.length === 0 ? (
        <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
          {t("nema_zahteva")}
        </div>
      ) : (
        <div className="space-y-3">
          {zahtevi.map((z) => (
            <div key={z.id} className="bg-white rounded-2xl border border-kolo-border p-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-kolo-text">
                    {z.pseudonim}
                    {z.mojZahtev && <span className="ml-2 text-xs text-kolo-green-700">{t("vas_zahtev")}</span>}
                  </p>
                  <p className="text-xs text-kolo-muted mt-0.5">
                    {new Date(z.createdAt).toLocaleDateString("sr-RS", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {z.mojZahtev && (
                    potvrdaPovuci === z.id ? (
                      <>
                        <button onClick={() => povuci(z.id)} disabled={radnja === z.id}
                          className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg hover:opacity-80 disabled:opacity-60 transition-opacity">
                          {radnja === z.id ? "..." : t("dugme_potvrdi_povuci")}
                        </button>
                        <button onClick={() => setPotvrdaPovuci(null)} disabled={radnja === z.id}
                          className="px-2.5 py-1 bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold rounded-lg hover:bg-kolo-border disabled:opacity-60 transition-colors">
                          {t("dugme_otkazi")}
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setPotvrdaPovuci(z.id)} disabled={radnja === z.id}
                        className="px-2.5 py-1 bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold rounded-lg hover:bg-kolo-border disabled:opacity-60 transition-colors">
                        {t("dugme_povuci")}
                      </button>
                    )
                  )}
                  {isAdmin && (
                    <button onClick={() => ukloni(z.id)} disabled={radnja === z.id}
                      className="px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg hover:bg-kolo-danger-light disabled:opacity-60 transition-colors">
                      {t("dugme_ukloni")}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-kolo-text mt-3 whitespace-pre-wrap">{z.tekstPredstavljanja}</p>

              {/* Akcije — samo verifikovani: otkrivanje kontakta i/ili direktna poruka */}
              {verified && !z.mojZahtev && (
                <div className="mt-3 pt-3 border-t border-kolo-border space-y-2">
                  {kontakti[z.id] && (
                    <p className="text-sm text-kolo-text">
                      <span className="text-kolo-muted">{t("kontakt_label")} </span>
                      <span className="font-medium whitespace-pre-wrap">{kontakti[z.id]}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {!kontakti[z.id] && (
                      <button onClick={() => prikaziKontakt(z.id)} disabled={radnja === z.id}
                        className="px-3 py-1.5 rounded-lg bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold hover:bg-kolo-green-500 hover:text-white disabled:opacity-60 transition-colors">
                        {radnja === z.id ? "..." : t("dugme_prikazi_kontakt")}
                      </button>
                    )}
                    <button onClick={() => posaljiPoruku(z.id)} disabled={radnja === z.id}
                      className="px-3 py-1.5 rounded-lg bg-kolo-green-700 text-white text-xs font-semibold hover:bg-kolo-green-900 disabled:opacity-60 transition-colors">
                      {radnja === z.id ? "..." : t("dugme_posalji_poruku")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
