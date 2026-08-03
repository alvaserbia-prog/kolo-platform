"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import KarticaForma, { PRAZNA_KARTICA, type KarticaVrednosti } from "@/components/jemstvo/KarticaForma";
import KarticaPrikaz from "@/components/jemstvo/KarticaPrikaz";
import type { KarticaPrikaz as Kartica } from "@/lib/jemstvo-kartica";

/**
 * Kartica prepoznavanja + status sopstvene objave, ugrađeni u /verifikacija za
 * neverifikovanog korisnika (opcija B: tabla jemstva i verifikacija na jednom
 * ekranu). Formu deli sa zidom preko <KarticaForma> — forma postoji na jednom
 * mestu, ne dva kao ranije.
 */
type MojZahtev = {
  id: string;
  expiresAt: string;
  mojZahtev: boolean;
  kartica: Kartica;
  nedostaje: string[];
};

function preostaloDana(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  );
}

function uVrednosti(k: Kartica): KarticaVrednosti {
  return {
    ...PRAZNA_KARTICA,
    ime: k.ime ?? "",
    prezime: k.prezime ?? "",
    godiste: k.godiste ? String(k.godiste) : "",
    mesto: k.mesto ?? "",
    nadimak: k.nadimak ?? "",
    cimeSeBavi: k.cimeSeBavi ?? "",
  };
}

export default function JemstvoObjava() {
  const t = useTranslations("tablaJemstva");
  const [greska, setGreska] = useState("");
  const [radnja, setRadnja] = useState(false);
  const [potvrdaPovuci, setPotvrdaPovuci] = useState(false);
  const [dopunjavam, setDopunjavam] = useState(false);

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

  async function posalji(v: KarticaVrednosti, dopuna: boolean): Promise<string | null> {
    const res = await fetch("/api/tabla-jemstva", {
      method: dopuna ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, godiste: v.godiste || undefined, pristanak: true }),
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok) {
      setDopunjavam(false);
      await refetch();
      return null;
    }
    return d.error ?? t("greska_objava");
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

  if (moj && dopunjavam) {
    return (
      <KarticaForma
        pocetne={uVrednosti(moj.kartica)}
        rezimDopune
        onSacuvaj={(v) => posalji(v, true)}
        onOtkazi={() => setDopunjavam(false)}
      />
    );
  }

  // Ima aktivnu karticu — status + dopuna + povlačenje.
  if (moj) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-5 space-y-3">
        <div>
          <p className="font-semibold text-kolo-text">{t("objava_aktivna_naslov")}</p>
          <p className="text-sm text-kolo-muted mt-0.5">
            {t("objava_aktivna_opis")}{" "}
            <span className="text-kolo-gold-600">
              {t("istice_za_dana", { dana: preostaloDana(moj.expiresAt) })}
            </span>
          </p>
        </div>

        <div className="bg-kolo-bg rounded-xl border border-kolo-border p-4">
          <KarticaPrikaz kartica={moj.kartica} kompaktno />
        </div>

        {moj.nedostaje.length > 0 && (
          <p className="text-sm text-kolo-gold-600 box-warning px-4 py-3">
            {t("poziv_na_dopunu", { polja: moj.nedostaje.join(", ") })}
          </p>
        )}

        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDopunjavam(true)}
            disabled={radnja}
            className="px-3 py-1.5 rounded-lg bg-kolo-green-100 text-kolo-green-700 text-xs font-semibold hover:bg-kolo-green-500 hover:text-white disabled:opacity-60 transition-colors"
          >
            {t("dugme_dopuni_karticu")}
          </button>
          {potvrdaPovuci ? (
            <>
              <button
                onClick={povuci}
                disabled={radnja}
                className="px-3 py-1.5 rounded-lg bg-kolo-danger-light text-kolo-danger text-xs font-semibold hover:opacity-80 disabled:opacity-60 transition-opacity"
              >
                {radnja ? "..." : t("dugme_potvrdi_povuci")}
              </button>
              <button
                onClick={() => setPotvrdaPovuci(false)}
                disabled={radnja}
                className="px-3 py-1.5 rounded-lg bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors"
              >
                {t("dugme_otkazi")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setPotvrdaPovuci(true)}
              disabled={radnja}
              className="px-3 py-1.5 rounded-lg bg-kolo-bg border border-kolo-border text-kolo-muted text-xs font-semibold hover:bg-kolo-border disabled:opacity-60 transition-colors"
            >
              {t("dugme_povuci")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return <KarticaForma onSacuvaj={(v) => posalji(v, false)} />;
}
