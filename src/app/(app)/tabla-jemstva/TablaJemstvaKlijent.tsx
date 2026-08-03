"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";
import JemstvoObjava from "@/components/verifikacija/JemstvoObjava";
import FeedPrepoznavanja from "@/components/jemstvo/FeedPrepoznavanja";
import KarticaPrikaz from "@/components/jemstvo/KarticaPrikaz";
import NeprepoznatiSpisak from "@/components/jemstvo/NeprepoznatiSpisak";
import type { KarticaPrikaz as Kartica } from "@/lib/jemstvo-kartica";

type Zahtev = {
  id: string;
  pseudonim: string;
  kartica: Kartica;
  createdAt: string;
  expiresAt: string;
  mojZahtev: boolean;
  // Zašto posmatrač NE može da verifikuje ovaj zahtev (čl. 12 i 14 dokaza
  // stvarnosti, v3.9.2): "zona" = zabranjena zona (oba smera), "pocetni" =
  // početni korisnik se ne verifikuje u lancu jemstva.
  verifikacijaBlokirana?: "zona" | "pocetni" | null;
};

// Preostalo vreme do isteka, grubo u danima (objava traje 8 dana).
function preostaloDana(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  );
}

export default function TablaJemstvaKlijent({
  verified,
  isAdmin,
  mozeVerifikovati,
}: {
  verified: boolean;
  isAdmin: boolean;
  mozeVerifikovati: boolean;
}) {
  const t = useTranslations("tablaJemstva");
  const router = useRouter();
  const [radnja, setRadnja] = useState<string | null>(null);
  // Inline verifikacija sa kartice: koja kartica ima otvorenu potvrdu + checkbox + oznaka
  const [verifikujId, setVerifikujId] = useState<string | null>(null);
  const [potvrdaPoznavanja, setPotvrdaPoznavanja] = useState(false);
  const [oznakaVerif, setOznakaVerif] = useState("");
  const [verifUspeh, setVerifUspeh] = useState<string | null>(null);
  // Inline uklanjanje (admin) — native prompt() se guši na Brave/mobilnim browserima
  const [ukloniId, setUkloniId] = useState<string | null>(null);
  const [razlogUklanjanja, setRazlogUklanjanja] = useState("");
  const [akcijaGreska, setAkcijaGreska] = useState("");

  const { data: zahtevi = [], isLoading: ucitavanje, refetch } = useQuery({
    queryKey: ["tabla-jemstva"],
    queryFn: async (): Promise<Zahtev[]> => {
      const res = await fetch("/api/tabla-jemstva");
      if (!res.ok) throw new Error("Greška pri dohvatanju table jemstva");
      const d = await res.json();
      return d.zahtevi ?? [];
    },
  });

  function otvoriVerifikuj(id: string) {
    setVerifikujId(id);
    setPotvrdaPoznavanja(false);
    setOznakaVerif("");
    setAkcijaGreska("");
  }

  async function verifikuj(id: string) {
    if (!potvrdaPoznavanja) return;
    setAkcijaGreska("");
    setRadnja(id);
    const res = await fetch(`/api/tabla-jemstva/${id}/verifikuj`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        potvrdaPoznavanja: true,
        oznaka: oznakaVerif.trim() || undefined,
      }),
    });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok) {
      setVerifikujId(null);
      setPotvrdaPoznavanja(false);
      setOznakaVerif("");
      setVerifUspeh(d.verifikovaniPseudonim ?? "");
      await refetch();
    } else {
      setAkcijaGreska(d.error ?? t("greska_generalna"));
    }
  }

  async function posaljiPoruku(id: string) {
    setAkcijaGreska("");
    setRadnja(id);
    const res = await fetch(`/api/tabla-jemstva/${id}/poruka`, { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setRadnja(null);
    if (res.ok && d.konverzacijaId) router.push(`/poruke?k=${d.konverzacijaId}`);
    else setAkcijaGreska(d.error ?? t("greska_generalna"));
  }

  // Uklanjanje koristi inline polje za razlog (ne native prompt — guši se na Brave/mobilnim browserima).
  async function ukloni(id: string, razlog: string) {
    const r = razlog.trim();
    if (!r) return;
    setAkcijaGreska("");
    setRadnja(id);
    const res = await fetch(`/api/admin/tabla-jemstva/${id}/ukloni`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razlog: r }),
    });
    setRadnja(null);
    if (res.ok) {
      setUkloniId(null);
      setRazlogUklanjanja("");
      await refetch();
    } else {
      const d = await res.json().catch(() => ({}));
      setAkcijaGreska(d.error ?? t("greska_generalna"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-kolo-text">{t("page_naslov")}</h1>
        <p className="text-sm text-kolo-muted mt-1">{t("page_opis")}</p>
      </div>

      {/* Verifikovan član: feed je primarni ulaz, zid ispod ostaje kao pregled. */}
      {verified && <FeedPrepoznavanja />}

      {/* Neverifikovan: sopstvena kartica (objava, dopuna, povlačenje). */}
      {!verified && <JemstvoObjava />}

      {/* UO: ljudi koje niko nije prepoznao, a dali su saglasnost za poziv. */}
      {isAdmin && <NeprepoznatiSpisak />}

      {akcijaGreska && (
        <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{akcijaGreska}</p>
      )}

      {verifUspeh !== null && (
        <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-lg px-3 py-2">
          {t("verifikacija_uspeh", { pseudonim: verifUspeh })}
        </p>
      )}

      {/* Zid — pregled svih aktivnih kartica */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-kolo-text">{t("zid_naslov")}</h2>

        {ucitavanje ? (
          <p className="text-sm text-kolo-muted">{t("ucitavanje")}</p>
        ) : zahtevi.length === 0 ? (
          <div className="bg-white rounded-2xl border border-kolo-border p-8 text-center text-sm text-kolo-muted">
            {t("nema_zahteva")}
          </div>
        ) : (
          zahtevi.map((z) => (
            <div key={z.id} className="bg-white rounded-2xl border border-kolo-border p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <KarticaPrikaz kartica={z.kartica} kompaktno />
                  <p className="text-xs text-kolo-muted mt-2">
                    <Pseudonim>{z.pseudonim}</Pseudonim>
                    {z.mojZahtev && <span className="ml-2 text-kolo-green-700">{t("vas_zahtev")}</span>}
                    <span className="mx-1.5">·</span>
                    <span className="text-kolo-gold-600">
                      {t("istice_za_dana", { dana: preostaloDana(z.expiresAt) })}
                    </span>
                  </p>
                </div>
                {isAdmin && ukloniId !== z.id && (
                  <button
                    onClick={() => {
                      setUkloniId(z.id);
                      setRazlogUklanjanja("");
                      setAkcijaGreska("");
                    }}
                    disabled={radnja === z.id}
                    className="shrink-0 px-2.5 py-1 bg-kolo-danger-light text-kolo-danger text-xs font-semibold rounded-lg hover:opacity-80 disabled:opacity-60 transition-opacity"
                  >
                    {t("dugme_ukloni")}
                  </button>
                )}
              </div>

              {/* Inline uklanjanje (admin) — polje za razlog umesto native prompt() */}
              {isAdmin && ukloniId === z.id && (
                <div className="mt-3 pt-3 border-t border-kolo-border space-y-2">
                  <label className="block text-xs font-medium text-kolo-muted">
                    {t("label_razlog_uklanjanja")}
                  </label>
                  <input
                    type="text"
                    value={razlogUklanjanja}
                    onChange={(e) => setRazlogUklanjanja(e.target.value)}
                    maxLength={300}
                    placeholder={t("placeholder_razlog_uklanjanja")}
                    className="w-full px-3 py-2 rounded-lg border border-kolo-border text-base outline-none focus:border-kolo-green-700 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => ukloni(z.id, razlogUklanjanja)}
                      disabled={radnja === z.id || razlogUklanjanja.trim().length === 0}
                      className="px-3 py-1.5 rounded-lg bg-kolo-danger-light text-kolo-danger text-xs font-semibold hover:opacity-80 disabled:opacity-50 transition-opacity"
                    >
                      {radnja === z.id ? "..." : t("dugme_potvrdi_uklanjanje")}
                    </button>
                    <button
                      onClick={() => {
                        setUkloniId(null);
                        setRazlogUklanjanja("");
                      }}
                      disabled={radnja === z.id}
                      className="px-3 py-1.5 rounded-lg bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors"
                    >
                      {t("dugme_otkazi")}
                    </button>
                  </div>
                </div>
              )}

              {/* Akcije — samo verifikovani. Poruka i jemstvo su ODVOJENA koraka. */}
              {verified && !z.mojZahtev && (
                <div className="mt-3 pt-3 border-t border-kolo-border space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => posaljiPoruku(z.id)}
                      disabled={radnja === z.id}
                      className="px-3 py-1.5 rounded-lg bg-kolo-green-700 text-white text-xs font-semibold hover:bg-kolo-green-900 disabled:opacity-60 transition-colors"
                    >
                      {radnja === z.id ? "..." : t("dugme_posalji_poruku")}
                    </button>
                    {mozeVerifikovati && !z.verifikacijaBlokirana && verifikujId !== z.id && (
                        <button
                          onClick={() => otvoriVerifikuj(z.id)}
                          disabled={radnja === z.id}
                          className="px-3 py-1.5 rounded-lg bg-kolo-gold-400 text-black text-xs font-semibold hover:bg-kolo-gold-600 disabled:opacity-60 transition-colors"
                        >
                          {t("dugme_verifikuj")}
                        </button>
                      )}
                  </div>

                  {/* Verifikacija nije moguća za posmatrača: zabranjena zona (čl. 12)
                      ili početni korisnik (čl. 14) — dugme se ne nudi, uz objašnjenje */}
                  {mozeVerifikovati && z.verifikacijaBlokirana && (
                    <p className="text-xs text-kolo-muted italic">
                      {z.verifikacijaBlokirana === "pocetni" ? t("blokada_pocetni") : t("blokada_zona")}
                    </p>
                  )}

                  {/* Inline potvrda verifikacije — lično poznavanje + opciona oznaka */}
                  {mozeVerifikovati && !z.verifikacijaBlokirana && verifikujId === z.id && (
                      <div className="mt-2 pt-3 border-t border-kolo-border space-y-2">
                        <input
                          type="text"
                          value={oznakaVerif}
                          onChange={(e) => setOznakaVerif(e.target.value)}
                          maxLength={80}
                          placeholder={t("placeholder_oznaka")}
                          className="w-full px-3 py-2 rounded-lg border border-kolo-border text-base outline-none focus:border-kolo-green-700 transition-colors"
                        />
                        <p className="text-xs text-kolo-muted">{t("oznaka_opis")}</p>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={potvrdaPoznavanja}
                            onChange={(e) => setPotvrdaPoznavanja(e.target.checked)}
                            className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0"
                          />
                          <span className="text-xs text-kolo-text">{t("potvrda_poznavanja")}</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => verifikuj(z.id)}
                            disabled={radnja === z.id || !potvrdaPoznavanja}
                            className="px-3 py-1.5 rounded-lg bg-kolo-gold-400 text-black text-xs font-semibold hover:bg-kolo-gold-600 disabled:opacity-50 transition-colors"
                          >
                            {radnja === z.id ? "..." : t("dugme_potvrdi_verifikaciju")}
                          </button>
                          <button
                            onClick={() => {
                              setVerifikujId(null);
                              setPotvrdaPoznavanja(false);
                            }}
                            disabled={radnja === z.id}
                            className="px-3 py-1.5 rounded-lg bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors"
                          >
                            {t("dugme_otkazi")}
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
