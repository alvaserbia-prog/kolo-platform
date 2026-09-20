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
 *  3. UKLANJANJE PAROVA — čisti istoriju od para „emisija pa povlačenje" koji je
 *     usklađivanje ostavilo za sobom. Isti obrazac u dva koraka, ali se otkucava
 *     broj REDOVA, jer se POEN ovom radnjom ne menja.
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
  pogodjenihLjudi: number;
  ljudiUMinusu: number;
  ukupanMinus: number;
  opticajPre: number;
  opticajPosle: number;
  osnivackiPragPredjen: number | null;
};

type ParoviPregled = {
  sprovedeno: boolean;
  povlacenjaUkupno: number;
  parova: number;
  redova: number;
  neupareni: number;
  pogodjenihLjudi: number;
  ljudiUMinusu: number;
  neslozeniNalozi: number;
  opticaj: number;
  zapisaUkupno: number;
  prepreke: string[];
  ucesnici: { pseudonim: string; parova: number; poen: number; stanje: number }[];
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

  // Uklanjanje parova — sopstveno stanje, jer je to zasebna odluka od usklađivanja.
  const [parovi, setParovi] = useState<ParoviPregled | null>(null);
  const [potvrdaParova, setPotvrdaParova] = useState("");
  const [radiParove, setRadiParove] = useState(false);
  const [porukaParova, setPorukaParova] = useState("");

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

  async function izracunajParove() {
    setRadiParove(true);
    setGreska("");
    setPorukaParova("");
    try {
      const res = await fetch("/api/admin/potvrde-parovi", { method: "POST" });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? "Pregled nije uspeo.");
      setParovi(d);
      setPotvrdaParova("");
    } catch (e) {
      setGreska(e instanceof Error ? e.message : "Greška.");
    } finally {
      setRadiParove(false);
    }
  }

  async function ukloniParove() {
    if (!parovi) return;
    setRadiParove(true);
    setGreska("");
    try {
      const res = await fetch("/api/admin/potvrde-parovi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ potvrda: Number(potvrdaParova) }),
      });
      const d = await res.json();
      if (!res.ok) {
        if (d?.pregled) setParovi(d.pregled);
        throw new Error(d?.error ?? "Radnja nije izvršena.");
      }
      setParovi(d);
      setPorukaParova(t("parovi_sprovedeno", { redova: Number(d.redova).toLocaleString("sr-RS") }));
      setPotvrdaParova("");
      onDone?.();
    } catch (e) {
      setGreska(e instanceof Error ? e.message : "Greška.");
    } finally {
      setRadiParove(false);
    }
  }

  const broj = (n: number) => n.toLocaleString("sr-RS");
  const potvrdaTacna = pregled !== null && Number(potvrdaBroja) === pregled.poenPonisten;
  const parovaPotvrdaTacna = parovi !== null && Number(potvrdaParova) === parovi.redova;

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
              <p>{t("potvrde_pregled_ljudi")}: <strong>{broj(pregled.pogodjenihLjudi)}</strong></p>
              {pregled.ljudiUMinusu > 0 && (
                <p className="text-red-700">
                  {t("potvrde_pregled_minus", {
                    ljudi: broj(pregled.ljudiUMinusu),
                    poen: broj(pregled.ukupanMinus),
                  })}
                </p>
              )}
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

      {/* ── Uklanjanje parova emisija+usklađivanje ─────────────────────────── */}
      {jeSuperadmin && (
        <section className="space-y-3 rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <h2 className="text-lg font-semibold text-sky-900">{t("parovi_naslov")}</h2>
          <p className="text-sm text-sky-900/80">{t("parovi_opis")}</p>

          <button
            type="button"
            className="kolo-dugme-sekundarno text-sm"
            disabled={radiParove}
            onClick={() => void izracunajParove()}
          >
            {t("potvrde_izracunaj")}
          </button>

          {parovi && (
            <div className="space-y-2 rounded-xl bg-white p-4 text-sm">
              <p>{t("parovi_pregled_povlacenja")}: <strong>{broj(parovi.povlacenjaUkupno)}</strong></p>
              <p>{t("parovi_pregled_parova")}: <strong>{broj(parovi.parova)}</strong></p>
              <p>
                {t("parovi_pregled_redova")}: <strong>{broj(parovi.redova)}</strong>{" "}
                {t("parovi_pregled_od_ukupno", { ukupno: broj(parovi.zapisaUkupno) })}
              </p>
              <p>{t("parovi_pregled_ljudi")}: <strong>{broj(parovi.pogodjenihLjudi)}</strong></p>
              {parovi.ljudiUMinusu > 0 && (
                <p className="text-amber-800">{t("parovi_pregled_minus", { ljudi: broj(parovi.ljudiUMinusu) })}</p>
              )}
              <p className="text-kolo-muted">{t("parovi_pregled_nepromenjeno", { opticaj: broj(parovi.opticaj) })}</p>

              {parovi.ucesnici.length > 0 && (
                <details className="pt-1">
                  <summary className="cursor-pointer text-sm font-medium text-sky-900">
                    {t("parovi_spisak", { ljudi: broj(parovi.ucesnici.length) })}
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {parovi.ucesnici.map((u) => (
                      <li key={u.pseudonim} className="flex items-center gap-2 text-xs">
                        <span className={u.stanje < 0 ? "font-semibold text-red-700" : ""}>
                          <Pseudonim>{u.pseudonim}</Pseudonim>
                        </span>
                        <span className="text-kolo-muted">
                          {t("parovi_spisak_red", {
                            parova: broj(u.parova),
                            poen: broj(u.poen),
                            stanje: broj(u.stanje),
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {/* 🔴 Prepreke se prikazuju umesto dugmeta — ne pored njega. Dugme koje
                  stoji uz crveni tekst poziva da se klikne „ipak". */}
              {parovi.prepreke.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 pt-2 text-red-700">
                  {parovi.prepreke.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              ) : (
                !parovi.sprovedeno &&
                parovi.parova > 0 && (
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-kolo-text">
                      {t("parovi_potvrda_broja")}
                    </label>
                    <input
                      className="kolo-input mt-1 w-48"
                      inputMode="numeric"
                      value={potvrdaParova}
                      onChange={(e) => setPotvrdaParova(e.target.value.replace(/\D/g, ""))}
                    />
                    <button
                      type="button"
                      className="kolo-dugme-primarno ml-2 text-sm"
                      disabled={!parovaPotvrdaTacna || radiParove}
                      onClick={() => void ukloniParove()}
                    >
                      {t("parovi_ukloni")}
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {porukaParova && <p className="text-sm font-medium text-kolo-green-700">{porukaParova}</p>}
        </section>
      )}
    </div>
  );
}
