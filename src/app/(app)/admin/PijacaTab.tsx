"use client";

/**
 * Moderacija Pijace — pregled prijavljenih oglasa i uklanjanje spornih.
 *
 * Pravni osnov: Uslovi korišćenja čl. 20, 21, 22, 24 i 25. Fondacija nije
 * obavezna da unapred pregleda sadržaj (čl. 25 st. 1), pa je podrazumevan
 * prikaz „prijavljeni" — red čekanja koji su napravili sami korisnici.
 *
 * Namerno NEMA izmene tuđeg oglasa: akti daju pravo uklanjanja, ne prepravke.
 * Vlasnik dobija razlog i sam ispravlja i ponovo objavljuje.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Pseudonim from "@/components/Pseudonim";

type Prikaz = "prijavljeni" | "aktivni" | "uklonjeni";

interface Prijava {
  id: string;
  razlog: string;
  razlogOpis: string;
  opis: string | null;
  status: string;
  prijaviocPseudonim: string;
  createdAt: string;
}

interface Oglas {
  id: string;
  title: string;
  opis: string;
  category: string;
  location: string | null;
  status: string;
  slika: string | null;
  createdAt: string;
  uklonjenAt: string | null;
  uklonjenRazlog: string | null;
  sellerId: string;
  sellerPseudonim: string;
  prijave: Prijava[];
  otvorenihPrijava: number;
}

const PRIKAZI: [Prikaz, string][] = [
  ["prijavljeni", "Prijavljeni"],
  ["aktivni", "Aktivni"],
  ["uklonjeni", "Uklonjeni"],
];

export default function PijacaTab() {
  const [prikaz, setPrikaz] = useState<Prikaz>("prijavljeni");
  const [q, setQ] = useState("");
  const [oglasi, setOglasi] = useState<Oglas[]>([]);
  const [otvorenihPrijava, setOtvorenihPrijava] = useState(0);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState("");
  const [radiId, setRadiId] = useState<string | null>(null);
  // Id oglasa čija je forma za uklanjanje otvorena + upisan razlog.
  const [uklanjaId, setUklanjaId] = useState<string | null>(null);
  const [razlog, setRazlog] = useState("");

  const ucitaj = useCallback(async () => {
    setUcitava(true);
    try {
      const params = new URLSearchParams({ prikaz });
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/pijaca?${params}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? "Greška pri učitavanju.");
        return;
      }
      setOglasi(data.oglasi ?? []);
      setOtvorenihPrijava(data.otvorenihPrijava ?? 0);
      setGreska("");
    } finally {
      setUcitava(false);
    }
  }, [prikaz, q]);

  useEffect(() => {
    void ucitaj();
    // `q` se namerno NE prati — pretraga se okida dugmetom, ne kucanjem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prikaz]);

  async function ukloni(id: string) {
    if (!razlog.trim()) {
      setGreska("Razlog uklanjanja je obavezan — šalje se korisniku (Uslovi čl. 25 st. 2).");
      return;
    }
    setRadiId(id);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/pijaca/${id}/ukloni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razlog: razlog.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? "Greška pri uklanjanju.");
        return;
      }
      setUklanjaId(null);
      setRazlog("");
      await ucitaj();
    } finally {
      setRadiId(null);
    }
  }

  async function vrati(id: string) {
    if (!confirm("Vratiti oglas na Pijacu?")) return;
    setRadiId(id);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/pijaca/${id}/vrati`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setGreska(data.error ?? "Greška.");
      else await ucitaj();
    } finally {
      setRadiId(null);
    }
  }

  async function odbaciPrijavu(prijavaId: string) {
    setRadiId(prijavaId);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/pijaca/prijave/${prijavaId}/odbaci`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setGreska(data.error ?? "Greška.");
      else await ucitaj();
    } finally {
      setRadiId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-kolo-bg rounded-xl px-4 py-3 text-xs text-kolo-muted leading-relaxed">
        Fondacija nije obavezna da unapred pregleda sadržaj (Uslovi čl. 25 st. 1), ali može ukloniti
        oglas koji krši Uslove, Pravilnik ili zakon — uz obavezno obaveštenje korisniku sa razlogom
        (čl. 21 st. 2, čl. 25 st. 2). Oglas se ne prepravlja: vlasnik dobija razlog i sam ispravlja.
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRIKAZI.map(([kljuc, labela]) => (
          <button
            key={kljuc}
            onClick={() => setPrikaz(kljuc)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              prikaz === kljuc
                ? "bg-kolo-green-700 text-white"
                : "bg-kolo-bg text-kolo-muted hover:bg-kolo-border"
            }`}
          >
            {labela}
            {kljuc === "prijavljeni" && otvorenihPrijava > 0 ? ` (${otvorenihPrijava})` : ""}
          </button>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void ucitaj();
          }}
          className="flex gap-2 ml-auto"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Naslov ili pseudonim…"
            className="px-3 py-1.5 rounded-lg border border-kolo-border text-sm w-52"
          />
          <button type="submit" className="px-3 py-1.5 rounded-lg bg-kolo-bg text-sm font-medium text-kolo-muted hover:bg-kolo-border">
            Traži
          </button>
        </form>
      </div>

      {greska && (
        <div className="bg-kolo-danger-light text-kolo-danger rounded-xl px-4 py-3 text-sm">{greska}</div>
      )}

      {ucitava ? (
        <div className="text-sm text-kolo-muted py-8 text-center">Učitavanje…</div>
      ) : oglasi.length === 0 ? (
        <div className="text-sm text-kolo-muted py-8 text-center">
          {prikaz === "prijavljeni" ? "Nema prijavljenih oglasa." : "Nema oglasa."}
        </div>
      ) : (
        <div className="space-y-3">
          {oglasi.map((o) => (
            <div key={o.id} className="border border-kolo-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link href={`/pijaca/${o.id}`} target="_blank" className="text-sm font-semibold text-kolo-green-700 hover:underline">
                    {o.title}
                  </Link>
                  <div className="text-xs text-kolo-muted mt-0.5">
                    <Pseudonim>{o.sellerPseudonim}</Pseudonim>
                    {o.location ? ` · ${o.location}` : ""} · {new Date(o.createdAt).toLocaleDateString("sr-RS")}
                  </div>
                </div>
                {o.status === "UKLONJEN" ? (
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-kolo-danger-light text-kolo-danger font-medium">
                    Uklonjen
                  </span>
                ) : o.otvorenihPrijava > 0 ? (
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-kolo-gold-100 text-kolo-gold-600 font-medium">
                    {o.otvorenihPrijava} {o.otvorenihPrijava === 1 ? "prijava" : "prijave"}
                  </span>
                ) : null}
              </div>

              {o.opis && (
                <p className="text-xs text-kolo-muted leading-relaxed whitespace-pre-line line-clamp-4">{o.opis}</p>
              )}

              {o.uklonjenRazlog && (
                <div className="text-xs bg-kolo-bg rounded-lg px-3 py-2">
                  <span className="text-kolo-muted">Razlog uklanjanja: </span>
                  <span className="text-kolo-text">{o.uklonjenRazlog}</span>
                </div>
              )}

              {o.prijave.length > 0 && (
                <div className="space-y-1.5">
                  {o.prijave.map((p) => (
                    <div key={p.id} className="flex items-start gap-2 text-xs bg-kolo-bg rounded-lg px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-kolo-text font-medium">{p.razlogOpis}</div>
                        {p.opis && <div className="text-kolo-muted mt-0.5">{p.opis}</div>}
                        <div className="text-kolo-muted mt-0.5">
                          Prijavio: <Pseudonim>{p.prijaviocPseudonim}</Pseudonim> ·{" "}
                          {new Date(p.createdAt).toLocaleDateString("sr-RS")}
                          {p.status !== "OTVORENA" && ` · ${p.status === "RESENA" ? "rešena" : "odbačena"}`}
                        </div>
                      </div>
                      {p.status === "OTVORENA" && (
                        <button
                          onClick={() => odbaciPrijavu(p.id)}
                          disabled={radiId === p.id}
                          className="shrink-0 px-2 py-1 rounded-md bg-white border border-kolo-border text-kolo-muted hover:bg-kolo-border disabled:opacity-50"
                        >
                          Nema povrede
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {o.status === "UKLONJEN" ? (
                <button
                  onClick={() => vrati(o.id)}
                  disabled={radiId === o.id}
                  className="px-3 py-1.5 rounded-lg bg-kolo-bg text-sm font-medium text-kolo-muted hover:bg-kolo-border disabled:opacity-50"
                >
                  {radiId === o.id ? "…" : "Vrati na Pijacu"}
                </button>
              ) : uklanjaId === o.id ? (
                <div className="space-y-2">
                  <textarea
                    value={razlog}
                    onChange={(e) => setRazlog(e.target.value)}
                    rows={2}
                    maxLength={500}
                    autoFocus
                    placeholder={'Razlog uklanjanja — vidi ga korisnik (npr. „Oglas nudi dobro čiji je promet zabranjen, Uslovi čl. 21").'}
                    className="w-full px-3 py-2 rounded-lg border border-kolo-border text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => ukloni(o.id)}
                      disabled={radiId === o.id}
                      className="px-3 py-1.5 rounded-lg bg-kolo-danger text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      {radiId === o.id ? "…" : "Ukloni i obavesti"}
                    </button>
                    <button
                      onClick={() => {
                        setUklanjaId(null);
                        setRazlog("");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-kolo-bg text-sm font-medium text-kolo-muted hover:bg-kolo-border"
                    >
                      Odustani
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setUklanjaId(o.id);
                    setRazlog("");
                    setGreska("");
                  }}
                  className="px-3 py-1.5 rounded-lg border border-kolo-danger/20 text-kolo-danger text-sm font-medium hover:bg-kolo-danger-light"
                >
                  Ukloni oglas
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
