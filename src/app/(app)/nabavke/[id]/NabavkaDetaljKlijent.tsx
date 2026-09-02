"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Ponuda = { ponudjac: string; cena: number; izabrana: boolean; napomena: string | null };
type Moja = {
  status: string;
  mesto: number | null;
  kod: string | null;
  danPreuzimanja: string | null;
  rezervisano: number;
  pozvanAt: string | null;
};
type Detalj = {
  id: string;
  naziv: string;
  status: string;
  dobavljac: string | null;
  jedinicaMere: string | null;
  nabavnaCena: number | null;
  maloprodajna: number | null;
  izvoriCena: string | null;
  saldoSnimak: number | null;
  rezervaSnimak: number | null;
  iznosNabavke: number | null;
  brojJedinica: number | null;
  brojDelova: number | null;
  velicinaDela: number | null;
  poenPoDelu: number | null;
  ukupnoPoena: number | null;
  odnosPonistenja: number | null;
  mestoPreuzimanja: string | null;
  preuzimanjeOd: string | null;
  preuzimanjeDo: string | null;
  prijaveDo: string | null;
  placenoRSD: number | null;
  obustavaRazlog: string | null;
  ponude: Ponuda[];
  brojPrijava: number;
  preuzeli: { pseudonim: string; mesto: number | null }[];
  moja: Moja | null;
};

const rsd = (n: number | null) => (n === null ? "—" : `${Math.round(n).toLocaleString("sr-RS")} RSD`);
const poen = (n: number | null) => (n === null ? "—" : n.toLocaleString("sr-RS"));
const dan = (s: string | null) => (s ? new Date(s).toLocaleDateString("sr-RS") : "—");

/** Dani objavljenog perioda preuzimanja, za birač dana (čl. 23 st. 2). */
function daniPerioda(od: string | null, doD: string | null): string[] {
  if (!od || !doD) return [];
  const izlaz: string[] = [];
  const d = new Date(od);
  const kraj = new Date(doD);
  while (d.getTime() < kraj.getTime() && izlaz.length < 31) {
    izlaz.push(new Date(d).toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return izlaz;
}

/**
 * Kartica jedne nabavke: cela kalkulacija (čl. 20) i sopstveno mesto u postupku.
 *
 * 🔴 Objavljuju se SVE ponude, i one koje nisu izabrane (čl. 15 st. 2) — bez toga
 * „najpovoljnija" nije provera nego tvrdnja.
 */
export default function NabavkaDetaljKlijent({ id }: { id: string }) {
  const t = useTranslations("nabavke");
  const [n, setN] = useState<Detalj | null>(null);
  const [ucitava, setUcitava] = useState(true);
  const [radi, setRadi] = useState(false);
  const [izabranDan, setIzabranDan] = useState("");
  const [greska, setGreska] = useState<string | null>(null);

  const ucitaj = useCallback(async () => {
    const res = await fetch(`/api/nabavke/${id}`, { cache: "no-store" });
    if (res.ok) setN(await res.json());
    setUcitava(false);
  }, [id]);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function posalji(putanja: string, telo?: unknown) {
    setRadi(true);
    setGreska(null);
    try {
      const res = await fetch(`/api/nabavke/${id}/${putanja}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: telo ? JSON.stringify(telo) : undefined,
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(d.greska ?? d.error ?? t("greska_opsta"));
        return;
      }
      await ucitaj();
    } finally {
      setRadi(false);
    }
  }

  if (ucitava) return <p className="mx-auto max-w-2xl text-sm text-kolo-muted">{t("ucitavanje")}</p>;
  if (!n) return <p className="mx-auto max-w-2xl text-sm text-kolo-muted">{t("nije_nadjena")}</p>;

  const dani = daniPerioda(n.preuzimanjeOd, n.preuzimanjeDo);
  const m = n.moja;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <Link href="/nabavke" className="text-sm text-kolo-muted hover:underline">
          ← {t("nazad")}
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{n.naziv}</h1>
        <p className="mt-1 text-sm text-kolo-muted">{t(`status_${n.status}` as never)}</p>
      </div>

      {n.obustavaRazlog && (
        <p className="rounded-xl border border-kolo-danger bg-white p-3 text-sm text-kolo-danger">
          {t("obustavljena", { razlog: n.obustavaRazlog })}
        </p>
      )}

      {/* ── Moje mesto u postupku ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-kolo-green-700 bg-kolo-green-100 p-5">
        {!m && n.status === "OBJAVLJENA" && (
          <>
            <p className="text-sm">{t("prijava_opis", { rok: dan(n.prijaveDo) })}</p>
            <button
              onClick={() => posalji("prijavi")}
              disabled={radi}
              className="mt-3 w-full rounded-full bg-kolo-green-700 px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {t("prijavi_se")}
            </button>
          </>
        )}

        {!m && n.status !== "OBJAVLJENA" && <p className="text-sm">{t("prijave_zatvorene")}</p>}

        {m?.status === "PRIJAVLJEN" && (
          <>
            <p className="text-sm font-medium">
              {m.mesto ? t("cekas_mesto", { mesto: m.mesto }) : t("cekas_red")}
            </p>
            <button
              onClick={() => posalji("odustani")}
              disabled={radi}
              className="mt-3 rounded-full border border-kolo-border bg-white px-4 py-1 text-sm text-kolo-muted transition hover:border-kolo-danger hover:text-kolo-danger disabled:opacity-50"
            >
              {t("odustani")}
            </button>
          </>
        )}

        {m?.status === "POZVAN" && (
          <>
            <p className="text-sm font-medium">
              {t("pozvan", { mesto: m.mesto ?? 0, poen: poen(n.poenPoDelu) })}
            </p>
            <p className="mt-1 text-sm text-kolo-muted">{t("pozvan_uputstvo")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dani.map((d) => (
                <button
                  key={d}
                  onClick={() => setIzabranDan(d)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    izabranDan === d
                      ? "border-kolo-green-700 bg-kolo-green-700 text-white"
                      : "border-kolo-border bg-white"
                  }`}
                >
                  {new Date(d).toLocaleDateString("sr-RS")}
                </button>
              ))}
            </div>
            <button
              onClick={() => posalji("potvrdi", { dan: izabranDan })}
              disabled={radi || !izabranDan}
              className="mt-3 w-full rounded-full bg-kolo-green-700 px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {t("potvrdi")}
            </button>
            <button
              onClick={() => posalji("odustani")}
              disabled={radi}
              className="mt-2 rounded-full border border-kolo-border bg-white px-4 py-1 text-sm text-kolo-muted transition hover:border-kolo-danger hover:text-kolo-danger disabled:opacity-50"
            >
              {t("odustani")}
            </button>
          </>
        )}

        {m?.status === "POTVRDIO" && (
          <>
            <p className="text-sm font-medium">
              {t("potvrdjeno", { dan: dan(m.danPreuzimanja), mesto: n.mestoPreuzimanja ?? "" })}
            </p>
            <p className="mt-2 inline-block rounded-xl bg-white px-4 py-2 font-mono text-lg font-bold tracking-wider">
              {m.kod}
            </p>
            <p className="mt-2 text-sm text-kolo-muted">{t("kod_uputstvo")}</p>
            <p className="mt-1 text-sm">{t("rezervisano", { poen: poen(m.rezervisano) })}</p>
            <button
              onClick={() => posalji("odustani")}
              disabled={radi}
              className="mt-3 rounded-full border border-kolo-border bg-white px-4 py-1 text-sm text-kolo-muted transition hover:border-kolo-danger hover:text-kolo-danger disabled:opacity-50"
            >
              {t("odustani")}
            </button>
          </>
        )}

        {m?.status === "PREUZEO" && <p className="text-sm font-medium">{t("preuzeto", { poen: poen(n.poenPoDelu) })}</p>}
        {m && ["ODUSTAO", "ISTEKAO", "NIJE_PREUZEO"].includes(m.status) && (
          <p className="text-sm">{t(`moja_${m.status}` as never)}</p>
        )}

        {greska && <p className="mt-2 text-sm text-kolo-danger">{greska}</p>}
      </section>

      {/* ── Kalkulacija (čl. 20) ──────────────────────────────────────────── */}
      {n.maloprodajna !== null && (
        <section className="rounded-2xl border border-kolo-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{t("kalkulacija")}</h2>
          <dl className="mt-3 divide-y divide-kolo-border text-sm">
            {[
              [t("k_saldo"), rsd(n.saldoSnimak)],
              [t("k_rezerva"), `− ${rsd(n.rezervaSnimak)}`],
              [t("k_iznos"), rsd(n.iznosNabavke)],
              [t("k_dobavljac"), n.dobavljac ?? "—"],
              [t("k_nabavna"), `${rsd(n.nabavnaCena)} / ${n.jedinicaMere ?? ""}`],
              [t("k_maloprodajna"), rsd(n.maloprodajna)],
              [t("k_jedinica"), String(n.brojJedinica ?? "—")],
              [t("k_delova"), String(n.brojDelova ?? "—")],
              [t("k_deo"), `${n.velicinaDela ?? "—"} × ${n.jedinicaMere ?? ""}`],
              [t("k_poen_po_delu"), poen(n.poenPoDelu)],
              [t("k_ukupno_poena"), poen(n.ukupnoPoena)],
              [t("k_odnos"), n.odnosPonistenja ? n.odnosPonistenja.toFixed(2) : "—"],
              [t("k_placeno"), rsd(n.placenoRSD)],
              [t("k_mesto"), n.mestoPreuzimanja ?? "—"],
              [t("k_period"), `${dan(n.preuzimanjeOd)} – ${dan(n.preuzimanjeDo)}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-1.5">
                <dt className="text-kolo-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          {n.izvoriCena && <p className="mt-3 text-xs text-kolo-muted">{t("k_izvori", { izvori: n.izvoriCena })}</p>}
          <p className="mt-2 text-xs text-kolo-muted">{t("paritet_napomena")}</p>
        </section>
      )}

      {/* ── Ponude (čl. 15 st. 2) ─────────────────────────────────────────── */}
      {n.ponude.length > 0 && (
        <section className="rounded-2xl border border-kolo-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{t("ponude")}</h2>
          <p className="mt-1 text-sm text-kolo-muted">{t("ponude_opis")}</p>
          <ul className="mt-3 space-y-2">
            {n.ponude.map((p, i) => (
              <li
                key={i}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${
                  p.izabrana ? "bg-kolo-green-100 font-semibold" : "bg-kolo-bg"
                }`}
              >
                <span className="truncate">
                  {p.izabrana ? "✓ " : ""}
                  {p.ponudjac}
                </span>
                <span className="shrink-0">{rsd(p.cena)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Ko je preuzeo (čl. 31 st. 2) ──────────────────────────────────── */}
      {n.preuzeli.length > 0 && (
        <section className="rounded-2xl border border-kolo-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{t("preuzeli")}</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {n.preuzeli.map((p, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="truncate">{p.pseudonim}</span>
                <span className="shrink-0 text-kolo-muted">{p.mesto}.</span>
              </li>
            ))}
          </ul>
          {/* Broj POEN-a u zapisu se uz spisak NE objavljuje (čl. 31 st. 2). */}
          <p className="mt-2 text-xs text-kolo-muted">{t("preuzeli_napomena")}</p>
        </section>
      )}

      <p className="text-sm text-kolo-muted">{t("broj_prijava", { broj: n.brojPrijava })}</p>
    </div>
  );
}
