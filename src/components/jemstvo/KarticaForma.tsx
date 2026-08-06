"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import LokacijaSearch from "@/components/LokacijaSearch";
import KarticaPrikaz from "@/components/jemstvo/KarticaPrikaz";
import {
  MAX_CIME_SE_BAVI,
  MAX_NADIMAK,
  MAX_TELEFON,
  decenija,
  inicijali,
} from "@/lib/jemstvo-kartica";

/**
 * Kartica prepoznavanja — jedina forma za objavu na tabli jemstva.
 * Deli je zid (/tabla-jemstva) i ekran verifikacije (/verifikacija), pa forma
 * postoji na JEDNOM mestu (ranije je bila prepisana u dva fajla).
 *
 * Načela UI-ja iz dogovora:
 *  - sva polja su opciona — nikoga ne zaustavljamo na vratima. Nijedan podatak
 *    nije uslov za verifikaciju: verifikuje se čovek, ne kartica. Prazna polja
 *    utiču SAMO na redosled u feed-u;
 *  - dugme nikad nije mrtvo: klik uvek daje odgovor šta fali, umesto tihe blokade;
 *  - korak pregleda pre objave — gola kartica se vidi kao gola i čovek se sam
 *    vrati da je dopuni, bez ijedne prisile;
 *  - inputi su 16px (text-base) da iOS ne zumira ekran pri fokusu;
 *  - nikakav native confirm()/prompt() — Brave i Safari na iOS-u ih tiho gase.
 */

export interface KarticaVrednosti {
  ime: string;
  prezime: string;
  godiste: string;
  mesto: string;
  nadimak: string;
  cimeSeBavi: string;
  telefon: string;
  telefonSaglasnost: boolean;
}

export const PRAZNA_KARTICA: KarticaVrednosti = {
  ime: "",
  prezime: "",
  godiste: "",
  mesto: "",
  nadimak: "",
  cimeSeBavi: "",
  telefon: "",
  telefonSaglasnost: false,
};

const INPUT =
  "w-full px-4 py-3 rounded-xl border border-kolo-border text-base outline-none focus:border-kolo-green-700 transition-colors";

export default function KarticaForma({
  pocetne = PRAZNA_KARTICA,
  rezimDopune = false,
  onSacuvaj,
  onOtkazi,
}: {
  pocetne?: KarticaVrednosti;
  /** true = dopuna postojeće kartice (PATCH), false = prva objava (POST). */
  rezimDopune?: boolean;
  onSacuvaj: (v: KarticaVrednosti) => Promise<string | null>;
  onOtkazi?: () => void;
}) {
  const t = useTranslations("tablaJemstva");
  const [v, setV] = useState<KarticaVrednosti>(pocetne);
  const [pregled, setPregled] = useState(false);
  const [greska, setGreska] = useState("");
  const [radi, setRadi] = useState(false);

  function set<K extends keyof KarticaVrednosti>(k: K, val: KarticaVrednosti[K]) {
    setV((s) => ({ ...s, [k]: val }));
    setGreska("");
  }

  const nestoPopunjeno = Boolean(
    v.ime || v.prezime || v.godiste || v.mesto || v.nadimak || v.cimeSeBavi
  );
  // Savet, ne uslov: kartica se objavljuje i verifikuje i bez ovoga.
  const lakseNalazenje = Boolean(v.ime.trim() && v.mesto.trim());

  // Dugme je uvek aktivno; razlog se saopštava na klik, ne prećutnom blokadom.
  function kaPregledu() {
    if (!nestoPopunjeno) {
      setGreska(t("greska_prazna_kartica"));
      return;
    }
    if (v.telefon.trim() && !v.telefonSaglasnost) {
      setGreska(t("greska_telefon_saglasnost"));
      return;
    }
    setGreska("");
    setPregled(true);
  }

  async function posalji() {
    setRadi(true);
    const err = await onSacuvaj(v);
    setRadi(false);
    if (err) {
      setGreska(err);
      setPregled(false);
    }
  }

  // ── Korak pregleda ─────────────────────────────────────────────────────────
  if (pregled) {
    return (
      <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-kolo-text">{t("pregled_naslov")}</h2>
          <p className="text-sm text-kolo-muted mt-0.5">{t("pregled_opis")}</p>
        </div>

        <div className="bg-kolo-bg rounded-xl border border-kolo-border p-4">
          <KarticaPrikaz
            kartica={{
              puna: true,
              ime: v.ime.trim() || null,
              prezime: v.prezime.trim() || null,
              inicijali: inicijali(v.ime.trim() || null, v.prezime.trim() || null),
              godiste: v.godiste ? Number(v.godiste) : null,
              decenija: decenija(v.godiste ? Number(v.godiste) : null),
              mesto: v.mesto.trim() || null,
              nadimak: v.nadimak.trim() || null,
              cimeSeBavi: v.cimeSeBavi.trim() || null,
              legacyTekst: null,
            }}
          />
        </div>

        {!lakseNalazenje && (
          <p className="text-sm text-kolo-gold-600 box-warning px-4 py-3">{t("upozorenje_feed")}</p>
        )}

        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={posalji}
            disabled={radi}
            className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
          >
            {radi ? t("dugme_objavljujem") : rezimDopune ? t("dugme_sacuvaj_dopunu") : t("dugme_objavi")}
          </button>
          <button
            onClick={() => setPregled(false)}
            disabled={radi}
            className="px-5 py-2.5 rounded-xl bg-kolo-bg border border-kolo-border text-kolo-muted text-sm font-semibold hover:bg-kolo-border transition-colors disabled:opacity-60"
          >
            {t("dugme_dopuni")}
          </button>
        </div>
      </div>
    );
  }

  // ── Forma ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-kolo-border p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-kolo-text">
          {rezimDopune ? t("dopuna_naslov") : t("forma_naslov")}
        </h2>
        <p className="text-sm text-kolo-muted mt-0.5">{t("forma_uvod")}</p>
      </div>

      {/* Pravilo popunjavanja stoji PRE polja. Ranije je stizalo tek posle
          klika (greška „popuni bar jedno polje") ili na koraku pregleda
          (savet o mestu) — dakle tek pošto čovek pogreši. */}
      <p className="text-sm text-kolo-green-900 bg-kolo-green-100 rounded-xl px-4 py-3">
        {t("forma_pravilo")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_ime")}</label>
          <input
            type="text"
            value={v.ime}
            onChange={(e) => set("ime", e.target.value)}
            maxLength={40}
            placeholder={t("ph_ime")}
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_prezime")}</label>
          <input
            type="text"
            value={v.prezime}
            onChange={(e) => set("prezime", e.target.value)}
            maxLength={40}
            placeholder={t("ph_prezime")}
            className={INPUT}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_godiste")}</label>
          <input
            type="number"
            inputMode="numeric"
            value={v.godiste}
            onChange={(e) => set("godiste", e.target.value)}
            placeholder={t("ph_godiste")}
            className={INPUT}
          />
          <p className="mt-1 text-xs text-kolo-muted">{t("pomoc_godiste")}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_mesto")}</label>
          <LokacijaSearch
            value={v.mesto}
            onChange={(val) => set("mesto", val)}
            placeholder={t("ph_mesto")}
          />
          <p className="mt-1 text-xs text-kolo-muted">{t("pomoc_mesto")}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_nadimak")}</label>
        <input
          type="text"
          value={v.nadimak}
          onChange={(e) => set("nadimak", e.target.value)}
          maxLength={MAX_NADIMAK}
          placeholder={t("ph_nadimak")}
          className={INPUT}
        />
        <p className="mt-1 text-xs text-kolo-muted">{t("pomoc_nadimak")}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_cime_se_bavi")}</label>
        <input
          type="text"
          value={v.cimeSeBavi}
          onChange={(e) => set("cimeSeBavi", e.target.value.slice(0, MAX_CIME_SE_BAVI))}
          maxLength={MAX_CIME_SE_BAVI}
          placeholder={t("ph_cime_se_bavi")}
          className={INPUT}
        />
        <p className="mt-1 text-xs text-kolo-muted">
          {v.cimeSeBavi.length}/{MAX_CIME_SE_BAVI} · {t("pomoc_cime_se_bavi")}
        </p>
      </div>

      {/* Skriveni deo — ne ide na karticu ni pod kojim uslovom. */}
      <div className="rounded-xl border border-kolo-border bg-kolo-bg p-4 space-y-3">
        <p className="text-sm font-semibold text-kolo-text">{t("skriveno_naslov")}</p>
        <p className="text-xs text-kolo-muted">{t("skriveno_opis")}</p>

        <div>
          <label className="block text-sm font-medium text-kolo-muted mb-1">{t("label_telefon")}</label>
          <input
            type="tel"
            inputMode="tel"
            value={v.telefon}
            onChange={(e) => set("telefon", e.target.value)}
            maxLength={MAX_TELEFON}
            placeholder={t("ph_telefon")}
            className={INPUT}
          />
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={v.telefonSaglasnost}
            onChange={(e) => set("telefonSaglasnost", e.target.checked)}
            className="mt-0.5 accent-kolo-green-700 w-4 h-4 shrink-0"
          />
          <span className="text-xs text-kolo-text">{t("saglasnost_telefon")}</span>
        </label>

      </div>

      {greska && (
        <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2">{greska}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={kaPregledu}
          className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors"
        >
          {t("dugme_pregledaj")}
        </button>
        {onOtkazi && (
          <button
            onClick={onOtkazi}
            className="px-5 py-2.5 rounded-xl bg-kolo-bg border border-kolo-border text-kolo-muted text-sm font-semibold hover:bg-kolo-border transition-colors"
          >
            {t("dugme_otkazi")}
          </button>
        )}
      </div>
    </div>
  );
}
