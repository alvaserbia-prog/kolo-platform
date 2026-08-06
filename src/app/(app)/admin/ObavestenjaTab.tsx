"use client";

/**
 * Cirkularna SISTEMSKA obaveštenja — sastavljanje i slanje svim korisnicima.
 *
 * Namena je uska: izmene Uslova/Politike (Uslovi čl. 40, Politika čl. 16),
 * planirani zastoj duži od 24h (Uslovi čl. 33). NIJE kanal za vesti ni bilten —
 * za to je potrebna dopuna Politike i zaseban pristanak korisnika.
 *
 * Slanje ide u porcijama: svaki poziv obradi koliko stigne, pa se ponavlja dok
 * ne prođe cela lista. Zato ekran sam nastavlja dok napredak ne bude 100%.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";

type Status = "NACRT" | "U_SLANJU" | "POSLATO" | "PREKINUTO";

interface Obavestenje {
  id: string;
  naslov: string;
  tekst: string;
  link: string | null;
  pravniOsnov: string;
  status: Status;
  ukupno: number;
  poslato: number;
  neuspesno: number;
  createdAt: string;
  zavrsenoAt: string | null;
  kreiraoPseudonim: string;
}

export default function ObavestenjaTab() {
  const t = useTranslations("admin");

  const [obavestenja, setObavestenja] = useState<Obavestenje[]>([]);
  const [primalaca, setPrimalaca] = useState(0);
  const [ucitava, setUcitava] = useState(true);

  const [naslov, setNaslov] = useState("");
  const [tekst, setTekst] = useState("");
  const [link, setLink] = useState("");
  const [pravniOsnov, setPravniOsnov] = useState("");
  const [greska, setGreska] = useState("");
  const [poruka, setPoruka] = useState("");
  const [radi, setRadi] = useState(false);

  // Id obaveštenja čije slanje je u toku — dok je postavljen, ekran sam nastavlja.
  const [saljeId, setSaljeId] = useState<string | null>(null);
  const prekinuoRef = useRef(false);

  const ucitaj = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sistemsko-obavestenje");
      if (!res.ok) return;
      const data = await res.json();
      setObavestenja(data.obavestenja ?? []);
      setPrimalaca(data.primalaca ?? 0);
    } finally {
      setUcitava(false);
    }
  }, []);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function napraviNacrt(e: React.FormEvent) {
    e.preventDefault();
    setGreska("");
    setPoruka("");
    setRadi(true);
    try {
      const res = await fetch("/api/admin/sistemsko-obavestenje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naslov, tekst, link: link || undefined, pravniOsnov }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? t("obav_greska"));
        return;
      }
      setNaslov("");
      setTekst("");
      setLink("");
      setPravniOsnov("");
      setPoruka(t("obav_nacrt_napravljen"));
      await ucitaj();
    } finally {
      setRadi(false);
    }
  }

  async function proba(id: string) {
    setGreska("");
    setPoruka("");
    const res = await fetch(`/api/admin/sistemsko-obavestenje/${id}/proba`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setGreska(data.error ?? t("obav_greska"));
    else setPoruka(t("obav_proba_poslata", { email: data.poslatoNa }));
  }

  /** Zove rutu za slanje u petlji dok ne javi da je gotovo. */
  async function posalji(id: string) {
    if (!confirm(t("obav_potvrda", { broj: primalaca }))) return;
    setGreska("");
    setPoruka("");
    prekinuoRef.current = false;
    setSaljeId(id);
    try {
      for (;;) {
        const res = await fetch(`/api/admin/sistemsko-obavestenje/${id}/posalji`, { method: "POST" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setGreska(data.error ?? t("obav_greska"));
          break;
        }
        await ucitaj();
        if (data.zavrseno || prekinuoRef.current) break;
      }
    } finally {
      setSaljeId(null);
      await ucitaj();
    }
  }

  async function prekini(id: string) {
    prekinuoRef.current = true;
    await fetch(`/api/admin/sistemsko-obavestenje/${id}/prekini`, { method: "POST" });
    await ucitaj();
  }

  const oznakaStatusa: Record<Status, string> = {
    NACRT: t("obav_status_nacrt"),
    U_SLANJU: t("obav_status_u_slanju"),
    POSLATO: t("obav_status_poslato"),
    PREKINUTO: t("obav_status_prekinuto"),
  };

  return (
    <div className="space-y-6">
      {/* Upozorenje o dozvoljenoj nameni — stoji iznad forme, ne u dokumentaciji. */}
      <div className="bg-kolo-gold-100 border border-kolo-gold-400 rounded-2xl p-4">
        <p className="text-sm font-semibold text-kolo-text mb-1">{t("obav_upozorenje_naslov")}</p>
        <p className="text-xs text-kolo-muted">{t("obav_upozorenje")}</p>
      </div>

      <form onSubmit={napraviNacrt} className="bg-white rounded-2xl border border-kolo-border p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-kolo-muted">{t("obav_novo")}</h2>
          <p className="text-xs text-kolo-muted mt-1">{t("obav_primalaca", { broj: primalaca })}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("obav_naslov_polje")}</label>
          <input
            value={naslov}
            onChange={(e) => setNaslov(e.target.value)}
            maxLength={150}
            className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600"
            placeholder={t("obav_naslov_placeholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("obav_tekst_polje")}</label>
          <textarea
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            rows={5}
            maxLength={5000}
            className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600"
            placeholder={t("obav_tekst_placeholder")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("obav_osnov_polje")}</label>
            <input
              value={pravniOsnov}
              onChange={(e) => setPravniOsnov(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600"
              placeholder={t("obav_osnov_placeholder")}
            />
            <p className="text-xs text-kolo-muted mt-1">{t("obav_osnov_opis")}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-kolo-text mb-1.5">{t("obav_link_polje")}</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-kolo-border text-sm outline-none focus:border-kolo-green-600"
              placeholder="/uslovi"
            />
            <p className="text-xs text-kolo-muted mt-1">{t("obav_link_opis")}</p>
          </div>
        </div>

        {greska && (
          <p className="text-sm text-kolo-danger bg-kolo-danger-light rounded-xl px-4 py-3">{greska}</p>
        )}
        {poruka && (
          <p className="text-sm text-kolo-green-700 bg-kolo-green-100 rounded-xl px-4 py-3">{poruka}</p>
        )}

        <button
          type="submit"
          disabled={radi || !naslov.trim() || !tekst.trim() || !pravniOsnov.trim()}
          className="px-5 py-2.5 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors disabled:opacity-60"
        >
          {radi ? t("obav_cuvam") : t("obav_napravi")}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-kolo-border p-6">
        <h2 className="text-base font-semibold text-kolo-muted mb-4">{t("obav_lista")}</h2>

        {ucitava ? (
          <p className="text-sm text-kolo-muted">{t("obav_ucitavam")}</p>
        ) : obavestenja.length === 0 ? (
          <p className="text-sm text-kolo-muted">{t("obav_nema")}</p>
        ) : (
          <ul className="space-y-4">
            {obavestenja.map((o) => {
              const procenat = o.ukupno > 0 ? Math.round(((o.poslato + o.neuspesno) / o.ukupno) * 100) : 0;
              const uToku = saljeId === o.id;
              return (
                <li key={o.id} className="border border-kolo-border rounded-xl p-4">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-kolo-text truncate">{o.naslov}</p>
                      <p className="text-xs text-kolo-muted mt-0.5">
                        {o.pravniOsnov} · {o.kreiraoPseudonim} ·{" "}
                        {new Date(o.createdAt).toLocaleDateString("sr-RS")}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-kolo-muted shrink-0">
                      {oznakaStatusa[o.status]}
                    </span>
                  </div>

                  <p className="text-sm text-kolo-muted whitespace-pre-wrap mb-3">{o.tekst}</p>

                  {o.status !== "NACRT" && (
                    <div className="mb-3">
                      <div className="h-1.5 rounded-full bg-kolo-border overflow-hidden">
                        <div
                          className="h-full bg-kolo-green-700 transition-all"
                          style={{ width: `${procenat}%` }}
                        />
                      </div>
                      <p className="text-xs text-kolo-muted mt-1">
                        {t("obav_napredak", {
                          poslato: o.poslato,
                          ukupno: o.ukupno,
                          neuspesno: o.neuspesno,
                        })}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => proba(o.id)}
                      className="px-4 py-2 rounded-xl border border-kolo-border text-sm font-semibold text-kolo-text hover:bg-kolo-bg transition-colors"
                    >
                      {t("obav_proba")}
                    </button>

                    {(o.status === "NACRT" || o.status === "U_SLANJU") && !uToku && (
                      <button
                        type="button"
                        onClick={() => posalji(o.id)}
                        className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold hover:bg-kolo-green-900 transition-colors"
                      >
                        {o.status === "NACRT" ? t("obav_posalji") : t("obav_nastavi")}
                      </button>
                    )}

                    {uToku && (
                      <>
                        <span className="px-4 py-2 text-sm text-kolo-muted">{t("obav_salje")}</span>
                        <button
                          type="button"
                          onClick={() => prekini(o.id)}
                          className="px-4 py-2 rounded-xl border border-kolo-danger text-sm font-semibold text-kolo-danger hover:bg-kolo-danger-light transition-colors"
                        >
                          {t("obav_prekini")}
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
