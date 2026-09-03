"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Registar = { nazivId: string; naziv: string; brojKorisnika: number };
type MojaPrijava = { nabavkaId: string; status: string; mesto: number | null };
type Nabavka = {
  id: string;
  naziv: string;
  status: string;
  poenPoDelu: number | null;
  brojDelova: number | null;
  velicinaDela: number | null;
  jedinicaMere: string | null;
  prijaveDo: string | null;
  brojPrijava: number;
  moja: MojaPrijava | null;
};

/**
 * Registar predloga i spisak nabavki.
 *
 * Predlog je JEDNA REČ iz rečnika, jedan po članu (Pravilnik o projektima i
 * kolektivnim nabavkama čl. 9). Registar se prikazuje ZBIRNO, bez pseudonima
 * (čl. 10 st. 2) — služi odlučivanju o tome šta se nabavlja, a ne uvidu u to ko
 * šta traži.
 */
export default function NabavkeKlijent() {
  const t = useTranslations("nabavke");

  const [registar, setRegistar] = useState<Registar[]>([]);
  const [nabavke, setNabavke] = useState<Nabavka[]>([]);
  const [moj, setMoj] = useState<{ naziv: string } | null>(null);
  const [unos, setUnos] = useState("");
  const [predlozi, setPredlozi] = useState<{ id: string; naziv: string }[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [radi, setRadi] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [poruka, setPoruka] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ucitaj = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([
        fetch("/api/nabavke", { cache: "no-store" }),
        fetch("/api/nabavke/predlog", { cache: "no-store" }),
      ]);
      if (a.ok) {
        const d = await a.json();
        setRegistar(d.registar ?? []);
        setNabavke(d.nabavke ?? []);
      }
      if (b.ok) {
        const d = await b.json();
        setMoj(d.predlog ? { naziv: d.predlog.naziv } : null);
      }
    } finally {
      setUcitava(false);
    }
  }, []);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  // Rečnik ide RUTOM, ne spiskom u paketu: raste sa svakim novim nazivom, a treba
  // samo onome ko upravo bira. Isti razlog kao pretraga škola.
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (unos.trim().length < 2) {
      setPredlozi([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      const res = await fetch(`/api/nabavke/nazivi?q=${encodeURIComponent(unos)}`, { cache: "no-store" });
      if (res.ok) setPredlozi((await res.json()).nazivi ?? []);
    }, 250);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [unos]);

  async function sacuvaj(naziv: string) {
    setRadi(true);
    setGreska(null);
    setPoruka(null);
    try {
      const res = await fetch("/api/nabavke/predlog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naziv }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(d.greska ?? d.error ?? t("greska_upis"));
        return;
      }
      setUnos("");
      setPredlozi([]);
      setPoruka(t("upisano"));
      await ucitaj();
    } finally {
      setRadi(false);
    }
  }

  async function ukloni() {
    setRadi(true);
    setGreska(null);
    setPoruka(null);
    try {
      await fetch("/api/nabavke/predlog", { method: "DELETE" });
      await ucitaj();
    } finally {
      setRadi(false);
    }
  }

  const aktivne = nabavke.filter((n) => n.status !== "ZAVRSENA");
  const zavrsene = nabavke.filter((n) => n.status === "ZAVRSENA");

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t("naslov")}</h1>
        <p className="mt-1 text-sm text-kolo-muted">{t("uvod")}</p>
      </div>

      {/* ── Tvoj predlog (čl. 9) ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-kolo-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">{t("predlog_naslov")}</h2>
        <p className="mt-1 text-sm text-kolo-muted">{t("predlog_opis")}</p>

        {moj ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-kolo-bg px-3 py-2">
            <span className="font-semibold">{moj.naziv}</span>
            <button
              onClick={ukloni}
              disabled={radi}
              className="shrink-0 rounded-full border border-kolo-border px-4 py-1 text-sm text-kolo-muted transition hover:border-kolo-danger hover:text-kolo-danger disabled:opacity-50"
            >
              {t("ukloni")}
            </button>
          </div>
        ) : null}

        <div className="mt-3">
          <input
            value={unos}
            onChange={(e) => setUnos(e.target.value)}
            placeholder={t("polje_placeholder")}
            maxLength={40}
            className="w-full rounded-xl border border-kolo-border px-3 py-2 text-base"
          />
          {predlozi.length > 0 && (
            <ul className="mt-2 divide-y divide-kolo-border rounded-xl border border-kolo-border">
              {predlozi.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => sacuvaj(p.naziv)}
                    disabled={radi}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-kolo-bg disabled:opacity-50"
                  >
                    {p.naziv}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {unos.trim().length >= 2 && !predlozi.some((p) => p.naziv.toLowerCase() === unos.trim().toLowerCase()) && (
            <button
              onClick={() => sacuvaj(unos)}
              disabled={radi}
              className="mt-2 w-full rounded-full bg-kolo-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {moj ? t("zameni", { naziv: unos.trim() }) : t("upisi", { naziv: unos.trim() })}
            </button>
          )}
        </div>

        {greska && <p className="mt-2 text-sm text-kolo-danger">{greska}</p>}
        {poruka && <p className="mt-2 text-sm text-kolo-green-800">{poruka}</p>}
      </section>

      {/* ── Nabavke u toku ────────────────────────────────────────────────── */}
      {aktivne.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{t("nabavke_naslov")}</h2>
          {aktivne.map((n) => (
            <Link
              key={n.id}
              href={`/nabavke/${n.id}`}
              className="block rounded-2xl border border-kolo-green-700 bg-kolo-green-100 p-4 transition hover:opacity-90"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{n.naziv}</span>
                <span className="text-sm text-kolo-muted">{t(`status_${n.status}` as never)}</span>
              </div>
              {n.poenPoDelu !== null && (
                <p className="mt-1 text-sm">
                  {t("kartica_deo", {
                    velicina: n.velicinaDela ?? 0,
                    jedinica: n.jedinicaMere ?? "",
                    poen: n.poenPoDelu.toLocaleString("sr-RS"),
                  })}
                </p>
              )}
              {n.moja && <p className="mt-1 text-sm font-medium">{t(`moja_${n.moja.status}` as never)}</p>}
            </Link>
          ))}
        </section>
      )}

      {/* ── Registar predloga (čl. 10) ────────────────────────────────────── */}
      <section className="rounded-2xl border border-kolo-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">{t("registar_naslov")}</h2>

        {ucitava ? (
          <p className="mt-3 text-sm text-kolo-muted">{t("ucitavanje")}</p>
        ) : registar.length === 0 ? (
          <p className="mt-3 text-sm text-kolo-muted">{t("registar_prazan")}</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {registar.map((r, i) => (
              <li
                key={r.nazivId}
                className="flex items-center justify-between gap-3 rounded-xl bg-kolo-bg px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="w-6 shrink-0 text-sm text-kolo-muted">{i + 1}.</span>
                  <span className="truncate font-medium">{r.naziv}</span>
                </span>
                <span className="shrink-0 text-sm text-kolo-muted">
                  {t("broj_clanova", { broj: r.brojKorisnika })}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {zavrsene.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("zavrsene_naslov")}</h2>
          {zavrsene.map((n) => (
            <Link
              key={n.id}
              href={`/nabavke/${n.id}`}
              className="block rounded-xl border border-kolo-border bg-white px-3 py-2 text-sm transition hover:bg-kolo-bg"
            >
              {n.naziv}
            </Link>
          ))}
        </section>
      )}

      <p className="text-xs text-kolo-muted">{t("pravni_osnov")}</p>
    </div>
  );
}
