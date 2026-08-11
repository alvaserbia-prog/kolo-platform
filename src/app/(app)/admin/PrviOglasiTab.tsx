"use client";

/**
 * Prvi oglasi — odobravanje doprinosa iz čl. 40a za naloge BEZ POTVRDE.
 *
 * Oglas je već objavljen i vidi se na Pijaci; ovde se odlučuje samo o 1.000 POEN.
 * Zato tab nudi „Odobri" i „Odbij", ali NE i uklanjanje oglasa — uklanjanje je
 * moderacija (Uslovi čl. 21, 25) i živi u tabu Pijaca. Dve različite odluke.
 *
 * Odbijanje traži razlog (ide korisniku) i oslobađa kanal: kad čovek dopuni oglas
 * ili objavi bolji, doprinos se ponovo beleži i vraća ovde.
 *
 * Podaci se učitavaju lenjo, iz taba — server stranica šalje samo broj za badge.
 */

import { useState, useEffect, useCallback } from "react";
import { intlTag } from "@/lib/format";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Pseudonim from "@/components/Pseudonim";
import { profilHref } from "@/lib/profil-link";

type Prikaz = "cekanje" | "odobreni";

interface Stavka {
  id: string;
  iznos: number;
  status: string;
  okidac: string | null;
  zabelezenAt: string;
  evidentiranAt: string | null;
  korisnik: { id: string; pseudonim: string; tipKorisnika: string; createdAt: string };
  oglas: {
    id: string;
    title: string;
    opis: string;
    category: string;
    location: string | null;
    status: string;
    brojSlika: number;
    createdAt: string;
  } | null;
}

const PRIKAZI: [Prikaz, string][] = [
  ["cekanje", "Na čekanju"],
  ["odobreni", "Odobreni"],
];

export default function PrviOglasiTab({ onDone }: { onDone?: () => void }) {
  const locale = useLocale();
  const [prikaz, setPrikaz] = useState<Prikaz>("cekanje");
  const [stavke, setStavke] = useState<Stavka[]>([]);
  const [ukupnoNaCekanju, setUkupnoNaCekanju] = useState(0);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState("");
  const [radiId, setRadiId] = useState<string | null>(null);
  // Id doprinosa čija je forma za odbijanje otvorena + upisan razlog.
  const [odbijaId, setOdbijaId] = useState<string | null>(null);
  const [razlog, setRazlog] = useState("");

  const ucitaj = useCallback(async () => {
    setUcitava(true);
    try {
      const res = await fetch(`/api/admin/prvi-oglasi?prikaz=${prikaz}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? "Greška pri učitavanju.");
        return;
      }
      setStavke(data.stavke ?? []);
      setUkupnoNaCekanju(data.ukupnoNaCekanju ?? 0);
      setGreska("");
    } finally {
      setUcitava(false);
    }
  }, [prikaz]);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function odobri(id: string) {
    if (!confirm("Odobriti doprinos od 1.000 POEN za ovaj oglas? POEN ulazi u opticaj.")) return;
    setRadiId(id);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/prvi-oglasi/${id}/odobri`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setGreska(data.error ?? "Greška pri odobravanju.");
      else {
        await ucitaj();
        onDone?.();
      }
    } finally {
      setRadiId(null);
    }
  }

  async function odbij(id: string) {
    if (!razlog.trim()) {
      setGreska("Razlog je obavezan — šalje se korisniku.");
      return;
    }
    setRadiId(id);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/prvi-oglasi/${id}/odbij`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razlog: razlog.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? "Greška pri odbijanju.");
        return;
      }
      setOdbijaId(null);
      setRazlog("");
      await ucitaj();
      onDone?.();
    } finally {
      setRadiId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-kolo-bg rounded-xl px-4 py-3 text-xs text-kolo-muted leading-relaxed">
        Prvi oglas članova <strong>bez potvrde</strong>. Oglas je već na Pijaci — ovde se odlučuje
        samo o doprinosu od 1.000 POEN (Pravilnik čl. 40a). Odobrenjem POEN ulazi u opticaj, a
        opticaj okida osnivački korak, pa se odobrava oglas koji je stvarna ponuda. Odbijanje ne
        uklanja oglas; korisnik dobija razlog i može da objavi bolji oglas. Potvrđenim članovima
        doprinos se evidentira sam, pri objavi, i ovde se ne pojavljuje.
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
            {kljuc === "cekanje" && ukupnoNaCekanju > 0 ? ` (${ukupnoNaCekanju})` : ""}
          </button>
        ))}
      </div>

      {greska && (
        <div className="bg-kolo-danger-light text-kolo-danger rounded-xl px-4 py-3 text-sm">{greska}</div>
      )}

      {ucitava ? (
        <div className="text-sm text-kolo-muted py-8 text-center">Učitavanje…</div>
      ) : stavke.length === 0 ? (
        <div className="text-sm text-kolo-muted py-8 text-center">
          {prikaz === "cekanje" ? "Nema oglasa koji čekaju odobrenje." : "Još nema odobrenih doprinosa."}
        </div>
      ) : (
        <div className="space-y-3">
          {stavke.map((s) => (
            <div key={s.id} className="border border-kolo-border rounded-xl p-4">
              <div className="flex gap-4">
                {/* Sličica vodi na sam oglas — odluka se ne donosi po naslovu. */}
                {s.oglas && s.oglas.brojSlika > 0 ? (
                  <Link
                    href={`/pijaca/${s.oglas.id}`}
                    target="_blank"
                    className="shrink-0 relative w-24 h-24 rounded-lg overflow-hidden bg-kolo-bg"
                  >
                    <Image
                      src={`/api/pijaca/slika/${s.oglas.id}/0`}
                      alt={s.oglas.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>
                ) : (
                  <div className="shrink-0 w-24 h-24 rounded-lg bg-kolo-bg flex items-center justify-center text-xs text-kolo-muted text-center px-1">
                    bez slike
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {s.oglas ? (
                        <Link
                          href={`/pijaca/${s.oglas.id}`}
                          target="_blank"
                          className="text-sm font-semibold text-kolo-green-700 hover:underline"
                        >
                          {s.oglas.title}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-kolo-muted">Oglas je obrisan</span>
                      )}
                      <div className="text-xs text-kolo-muted mt-0.5">
                        <Link href={profilHref(s.korisnik)} target="_blank" className="hover:underline">
                          <Pseudonim>{s.korisnik.pseudonim}</Pseudonim>
                        </Link>
                        {s.oglas?.location ? ` · ${s.oglas.location}` : ""}
                        {s.oglas?.category ? ` · ${s.oglas.category}` : ""}
                        {" · "}
                        {new Date(s.zabelezenAt).toLocaleString(intlTag(locale))}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-kolo-gold-100 text-kolo-gold-600 font-medium">
                      {s.iznos.toLocaleString(intlTag(locale))} POEN
                    </span>
                  </div>

                  {s.oglas?.opis && (
                    <p className="text-xs text-kolo-muted leading-relaxed whitespace-pre-line line-clamp-4">
                      {s.oglas.opis}
                    </p>
                  )}

                  {s.oglas?.status === "UKLONJEN" && (
                    <div className="text-xs text-kolo-danger">
                      Oglas je uklonjen sa Pijace — doprinos se po pravilu ne odobrava.
                    </div>
                  )}

                  {prikaz === "odobreni" ? (
                    <div className="text-xs text-kolo-muted">
                      Evidentirano{" "}
                      {s.evidentiranAt ? new Date(s.evidentiranAt).toLocaleString(intlTag(locale)) : "—"}
                      {s.okidac ? ` · okidač: ${s.okidac}` : ""}
                    </div>
                  ) : odbijaId === s.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={razlog}
                        onChange={(e) => setRazlog(e.target.value)}
                        rows={2}
                        placeholder="Razlog odbijanja — ide korisniku…"
                        className="w-full px-3 py-2 rounded-lg border border-kolo-border text-sm outline-none focus:border-kolo-green-700"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => void odbij(s.id)}
                          disabled={radiId === s.id}
                          className="px-3 py-1.5 rounded-lg bg-kolo-danger text-white text-sm font-medium disabled:opacity-50"
                        >
                          {radiId === s.id ? "Šaljem…" : "Potvrdi odbijanje"}
                        </button>
                        <button
                          onClick={() => {
                            setOdbijaId(null);
                            setRazlog("");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-kolo-bg text-sm font-medium text-kolo-muted hover:bg-kolo-border"
                        >
                          Odustani
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => void odobri(s.id)}
                        disabled={radiId === s.id}
                        className="px-3 py-1.5 rounded-lg bg-kolo-green-700 text-white text-sm font-medium disabled:opacity-50"
                      >
                        {radiId === s.id ? "Evidentiram…" : "Odobri 1.000 POEN"}
                      </button>
                      <button
                        onClick={() => {
                          setOdbijaId(s.id);
                          setRazlog("");
                          setGreska("");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-kolo-bg text-sm font-medium text-kolo-muted hover:bg-kolo-border"
                      >
                        Odbij
                      </button>
                      {s.oglas && (
                        <Link
                          href={`/pijaca/${s.oglas.id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg bg-kolo-bg text-sm font-medium text-kolo-muted hover:bg-kolo-border"
                        >
                          Otvori oglas ↗
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
