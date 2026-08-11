"use client";

import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { intlTag } from "@/lib/format";
import { useMePatch, ME_KEY } from "@/hooks/useMe";

interface Verzija {
  id: string;
  verzija: string;
  naslov: string;
  efektivnaOd: string;
}

/**
 * Ekran za pristanak na nove akte (Uslovi čl. 40, Politika čl. 16).
 *
 * Koristi se na DVA mesta i namerno je jedna komponenta:
 *   1. kao prekrivač preko app-a (`AppShell`) — redovan put,
 *   2. kao sadržaj stranice `/politika-prihvati` — stari linkovi iz notifikacija
 *      i mejlova.
 *
 * 🔴 Zašto prekrivač, a ne preusmeravanje (izmena 11.08.2026): gejt je ranije na
 * svaku promenu rute radio `router.replace("/politika-prihvati")`. Ko ne bi
 * pritisnuo „Pristajem" nego kliknuo dalje po meniju, bio bi izbačen sa svake
 * stranice — u dnevniku aktivnosti se to vidi kao smenjivanje `/novcanik` ↔
 * `/politika-prihvati` (jedan nalog, 120 pregleda za sat vremena). Uz to je
 * svaki povratak bio prava navigacija: ekran „blicne" i sadržaj se prekine.
 * Prekrivač ne dira rutu, pa nema ni skoka ni petlje — a pristup je jednako
 * zatvoren, jer stoji preko svega dok se ne pristane.
 */
export default function PolitikaPristanak({
  kaoStranica = false,
  onGotovo,
}: {
  /** true = sadržaj stranice `/politika-prihvati`; false = prekrivač u AppShell-u. */
  kaoStranica?: boolean;
  /** Zove se kad pristanak više nije potreban (prihvaćen ili već upisan). */
  onGotovo?: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("politikaPrihvati");
  const qc = useQueryClient();
  const patchMe = useMePatch();

  const [verzija, setVerzija] = useState<Verzija | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prihvatanje, setPrihvatanje] = useState(false);
  const [ucitavanjePuklo, setUcitavanjePuklo] = useState(false);

  /**
   * Keširani `['me']` (odatle AppShell čita `politikaPotrebno`, poll na 30s) MORA
   * da se ispravi čim pristanak legne — inače bi prekrivač ostao na ekranu do
   * sledećeg poll-a, iako je posao završen.
   */
  const zavrsi = useCallback(() => {
    patchMe({ politikaPotrebno: false });
    qc.invalidateQueries({ queryKey: ME_KEY });
    onGotovo?.();
  }, [patchMe, qc, onGotovo]);

  const ucitaj = useCallback(() => {
    setUcitavanjePuklo(false);
    setLoading(true);
    fetch("/api/politika/prihvati")
      .then((r) => {
        if (!r.ok) throw new Error("Neuspeo zahtev");
        return r.json();
      })
      .then((data) => {
        if (!data?.potrebno) {
          zavrsi();
          return;
        }
        setVerzija(data.verzija);
        setLoading(false);
      })
      // Pad zahteva ne sme da nas skloni sa ekrana: gejt bi nas odmah vratio
      // ovamo. Ostajemo i nudimo ponovni pokušaj.
      .catch(() => {
        setUcitavanjePuklo(true);
        setLoading(false);
      });
  }, [zavrsi]);

  useEffect(() => { ucitaj(); }, [ucitaj]);

  async function prihvati() {
    if (!verzija) return;
    setPrihvatanje(true);
    setError("");
    try {
      const res = await fetch("/api/politika/prihvati", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verzijaId: verzija.id }),
      });
      if (!res.ok) throw new Error("Neuspeo upis");
      zavrsi();
    } catch {
      setError(t("greska_prihvatanje"));
      setPrihvatanje(false);
    }
  }

  // Omotač: prekrivač preko celog ekrana, odnosno obična stranica.
  // `overflow-y-auto` + `py-8` (umesto centriranja u punoj visini ekrana) drži
  // dugme dostižnim i na niskim telefonima — ranije je karta bila centrirana u
  // `min-h-screen` ispod fiksnog zaglavlja, pa je dno umelo da izađe iz vidika.
  const omot = kaoStranica
    ? "flex items-start justify-center min-h-[60vh] p-4 py-8"
    : "fixed inset-0 z-[100] overflow-y-auto bg-kolo-bg/95 backdrop-blur-sm flex items-start justify-center p-4 py-8 overscroll-contain";

  if (loading) {
    return (
      <div className={omot}>
        <p className="text-kolo-muted text-sm mt-12">{t("ucitavanje")}</p>
      </div>
    );
  }

  if (ucitavanjePuklo) {
    return (
      <div className={omot}>
        <div className="bg-white rounded-2xl border border-kolo-border p-8 max-w-md w-full shadow-sm text-center">
          <p className="text-sm text-kolo-text mb-4">{t("greska_ucitavanje")}</p>
          <button
            onClick={ucitaj}
            className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors"
          >
            {t("dugme_pokusaj_ponovo")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={omot}>
      <div className="bg-white rounded-2xl border border-kolo-border p-8 max-w-md w-full shadow-sm">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-kolo-text mb-2">{t("naslov")}</h1>
          {verzija && (
            <p className="text-sm text-kolo-muted">
              {t("verzija_label")} <strong>{verzija.verzija}</strong>: {verzija.naslov}<br />
              {t("na_snazi_od")} <strong>{new Date(verzija.efektivnaOd).toLocaleDateString(intlTag(locale))}</strong>
            </p>
          )}
        </div>

        <p className="text-sm text-kolo-text mb-4">{t("opis")}</p>

        <p className="text-sm text-kolo-muted mb-6">
          {t("procitajte_na")}{" "}
          <Link href="/pravilnik" target="_blank" className="text-kolo-green-700 underline">
            {t("ovoj_stranici")}
          </Link>
          {t("ne_slazete_se")}
        </p>

        {error && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <button
          onClick={prihvati}
          disabled={prihvatanje}
          className="w-full py-3 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-800 transition-colors disabled:opacity-60"
        >
          {prihvatanje ? t("dugme_prihvatam_loading") : t("dugme_prihvatam")}
        </button>

        {/*
          Izlaz iz gejta. Politika čl. 16 i Uslovi čl. 40 (v4.1.1): ograničenje pristupa
          do prihvatanja ne dira u prava na pristup, prenosivost i brisanje podataka.
          `/profil` je zato izuzet od prekrivača u AppShell-u — link mora da vodi negde
          gde se stvarno stiže, inače je odredba mrtvo slovo.
        */}
        <p className="text-xs text-kolo-muted mt-4 text-center">
          {t("pre_prihvatanja")}{" "}
          <Link href="/profil" className="text-kolo-green-700 underline">
            {t("podesavanja_profila")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
