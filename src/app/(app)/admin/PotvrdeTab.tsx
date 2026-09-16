"use client";

/**
 * Potvrde — POEN po potvrdi koji čeka trag stvarnog učešća (dokaz stvarnosti čl. 7).
 *
 * Dva odvojena odeljka, namerno razdvojena jer su to dve različite odluke:
 *  1. VENTIL — ručni upis za pojedinačnu potvrdu, uz obavezan razlog. Postoji zbog
 *     ljudi koje četiri uslova ne pokrivaju: onaj ko samo kupuje, stariji član na
 *     programu podrške. Bez njega bi njima i njihovim potvrđivačima POEN čekao zauvek.
 *  2. USKLAĐIVANJE ZATEČENIH — jednokratna prelazna radnja, u dva koraka
 *     (Izračunaj → Sprovedi), gde se broj POENA iz pregleda otkucava rukom.
 *
 * Podaci se učitavaju lenjo, iz taba.
 */

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Pseudonim from "@/components/Pseudonim";
import { profilHref } from "@/lib/profil-link";
import Link from "next/link";

type Veza = {
  id: string;
  vremenskiZig: string;
  potvrdjivac: { id: string; pseudonim: string };
  potvrdjeni: { id: string; pseudonim: string };
};

type Pregled = {
  sprovedeno: boolean;
  ukupnoUpisanih: number;
  ostaje: number;
  povlaci: number;
  poenPonisten: number;
  poenPunIznos: number;
  pogodjenihLjudi: number;
  opticajPre: number;
  opticajPosle: number;
  osnivackiPragPredjen: number | null;
};

export default function PotvrdeTab({ jeSuperadmin, onDone }: { jeSuperadmin: boolean; onDone?: () => void }) {
  const t = useTranslations("admin");
  const [veze, setVeze] = useState<Veza[]>([]);
  const [poenVerifikator, setPoenVerifikator] = useState(1000);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState("");
  const [radiId, setRadiId] = useState<string | null>(null);
  const [razlozi, setRazlozi] = useState<Record<string, string>>({});

  const [pregled, setPregled] = useState<Pregled | null>(null);
  const [potvrdaBroja, setPotvrdaBroja] = useState("");
  const [radiUskladjivanje, setRadiUskladjivanje] = useState(false);
  const [poruka, setPoruka] = useState("");

  const ucitaj = useCallback(async () => {
    setUcitava(true);
    setGreska("");
    try {
      const res = await fetch("/api/admin/potvrde-na-cekanju");
      if (!res.ok) throw new Error("Učitavanje nije uspelo.");
      const d = await res.json();
      setVeze(d.veze ?? []);
      setPoenVerifikator(d.poenVerifikator ?? 1000);
    } catch (e) {
      setGreska(e instanceof Error ? e.message : "Greška.");
    } finally {
      setUcitava(false);
    }
  }, []);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function upisi(id: string) {
    const razlog = (razlozi[id] ?? "").trim();
    if (razlog.length < 10) {
      setGreska("Razlog je obavezan i mora imati najmanje 10 znakova.");
      return;
    }
    setRadiId(id);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/potvrde-na-cekanju/${id}/upisi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razlog }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d?.error ?? "Upis nije uspeo.");
      await ucitaj();
      onDone?.();
    } catch (e) {
      setGreska(e instanceof Error ? e.message : "Greška.");
    } finally {
      setRadiId(null);
    }
  }

  async function izracunaj() {
    setRadiUskladjivanje(true);
    setGreska("");
    setPoruka("");
    try {
      const res = await fetch("/api/admin/potvrde-uskladjivanje", { method: "POST" });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Pregled nije uspeo.");
      setPregled(d);
      setPotvrdaBroja("");
    } catch (e) {
      setGreska(e instanceof Error ? e.message : "Greška.");
    } finally {
      setRadiUskladjivanje(false);
    }
  }

  async function sprovedi() {
    if (!pregled) return;
    setRadiUskladjivanje(true);
    setGreska("");
    try {
      const res = await fetch("/api/admin/potvrde-uskladjivanje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ potvrda: Number(potvrdaBroja) }),
      });
      const d = await res.json();
      if (!res.ok) {
        if (d?.pregled) setPregled(d.pregled);
        throw new Error(d?.error ?? "Radnja nije izvršena.");
      }
      setPregled(d);
      setPoruka(t("potvrde_sprovedeno"));
      setPotvrdaBroja("");
      await ucitaj();
      onDone?.();
    } catch (e) {
      setGreska(e instanceof Error ? e.message : "Greška.");
    } finally {
      setRadiUskladjivanje(false);
    }
  }

  const broj = (n: number) => n.toLocaleString("sr-RS");
  const potvrdaTacna = pregled !== null && Number(potvrdaBroja) === pregled.poenPonisten;

  return (
    <div className="space-y-8">
      {greska && <p className="text-sm text-red-600">{greska}</p>}

      {/* ── Ventil ─────────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-kolo-text">{t("potvrde_naslov")}</h2>
        <p className="text-sm text-kolo-muted">{t("potvrde_opis")}</p>

        {ucitava ? (
          <p className="text-sm text-kolo-muted">Učitavanje…</p>
        ) : veze.length === 0 ? (
          <p className="text-sm text-kolo-muted">{t("potvrde_prazno")}</p>
        ) : (
          <ul className="space-y-3">
            {veze.map((v) => (
              <li key={v.id} className="rounded-2xl border border-kolo-border bg-white p-4">
                <p className="text-sm text-kolo-text">
                  <Link href={profilHref(v.potvrdjivac)} className="font-semibold hover:underline">
                    <Pseudonim>{v.potvrdjivac.pseudonim}</Pseudonim>
                  </Link>{" "}
                  → potvrdio{" "}
                  <Link href={profilHref(v.potvrdjeni)} className="font-semibold hover:underline">
                    <Pseudonim>{v.potvrdjeni.pseudonim}</Pseudonim>
                  </Link>{" "}
                  · {new Date(v.vremenskiZig).toLocaleDateString("sr-RS")} · čeka {broj(poenVerifikator)} + {broj(poenVerifikator)} POENA
                </p>
                <textarea
                  className="kolo-input mt-2 w-full text-sm"
                  rows={2}
                  placeholder={t("potvrde_razlog")}
                  value={razlozi[v.id] ?? ""}
                  onChange={(e) => setRazlozi((r) => ({ ...r, [v.id]: e.target.value }))}
                />
                <button
                  type="button"
                  className="kolo-dugme-primarno mt-2 text-sm"
                  disabled={radiId === v.id}
                  onClick={() => void upisi(v.id)}
                >
                  {t("potvrde_upisi")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Usklađivanje zatečenih ─────────────────────────────────────────── */}
      {jeSuperadmin && (
        <section className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-semibold text-amber-900">{t("potvrde_uskladjivanje_naslov")}</h2>
          <p className="text-sm text-amber-900/80">{t("potvrde_uskladjivanje_opis")}</p>

          <button
            type="button"
            className="kolo-dugme-sekundarno text-sm"
            disabled={radiUskladjivanje}
            onClick={() => void izracunaj()}
          >
            {t("potvrde_izracunaj")}
          </button>

          {pregled && (
            <div className="space-y-2 rounded-xl bg-white p-4 text-sm">
              <p>{t("potvrde_pregled_ukupno")}: <strong>{broj(pregled.ukupnoUpisanih)}</strong></p>
              <p>{t("potvrde_pregled_ostaje")}: <strong>{broj(pregled.ostaje)}</strong></p>
              <p>{t("potvrde_pregled_povlaci")}: <strong>{broj(pregled.povlaci)}</strong></p>
              <p>{t("potvrde_pregled_ponisten")}: <strong>{broj(pregled.poenPonisten)}</strong></p>
              <p>
                {t("potvrde_pregled_propada")}:{" "}
                <strong>{broj(pregled.poenPunIznos - pregled.poenPonisten)}</strong>
              </p>
              <p>{t("potvrde_pregled_ljudi")}: <strong>{broj(pregled.pogodjenihLjudi)}</strong></p>
              <p>
                {t("potvrde_pregled_opticaj")}: <strong>{broj(pregled.opticajPosle)}</strong>{" "}
                (sada {broj(pregled.opticajPre)})
              </p>
              {pregled.osnivackiPragPredjen !== null && (
                <p className="text-red-700">
                  {t("potvrde_pregled_prag", { prag: broj(pregled.osnivackiPragPredjen) })}
                </p>
              )}

              {!pregled.sprovedeno && pregled.povlaci > 0 && (
                <div className="pt-2">
                  <label className="block text-sm font-medium text-kolo-text">
                    {t("potvrde_potvrda_broja")}
                  </label>
                  <input
                    className="kolo-input mt-1 w-48"
                    inputMode="numeric"
                    value={potvrdaBroja}
                    onChange={(e) => setPotvrdaBroja(e.target.value.replace(/\D/g, ""))}
                  />
                  <button
                    type="button"
                    className="kolo-dugme-primarno ml-2 text-sm"
                    disabled={!potvrdaTacna || radiUskladjivanje}
                    onClick={() => void sprovedi()}
                  >
                    {t("potvrde_sprovedi")}
                  </button>
                </div>
              )}
            </div>
          )}

          {poruka && <p className="text-sm font-medium text-kolo-green-700">{poruka}</p>}
        </section>
      )}
    </div>
  );
}
