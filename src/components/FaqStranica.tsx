"use client";

import { useState, useMemo } from "react";
import { FAQ_SEKCIJE } from "@/lib/faq-data";

export default function FaqStranica() {
  const [pretraga, setPretraga] = useState("");
  const [otvoreni, setOtvoreni] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setOtvoreni((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtrirano = useMemo(() => {
    const q = pretraga.trim().toLowerCase();
    if (!q) return FAQ_SEKCIJE;
    return FAQ_SEKCIJE.map((s) => ({
      ...s,
      pitanja: s.pitanja.filter(
        (p) =>
          p.pitanje.toLowerCase().includes(q) ||
          p.odgovor.toLowerCase().includes(q)
      ),
    })).filter((s) => s.pitanja.length > 0);
  }, [pretraga]);

  const ukupnoPrikazano = filtrirano.reduce(
    (sum, s) => sum + s.pitanja.length,
    0
  );

  return (
    <div className="space-y-5">
      {/* Pretraga */}
      <div className="bg-white rounded-2xl card-shadow p-4">
        <div className="relative">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-kolo-muted"
          >
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 12L15.5 15.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={pretraga}
            onChange={(e) => setPretraga(e.target.value)}
            placeholder="Pretraži pitanja…"
            className="w-full pl-10 pr-4 py-2.5 border border-kolo-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-kolo-green-700 focus:border-transparent"
          />
        </div>
        {pretraga.trim() && (
          <div className="mt-2 text-xs text-kolo-muted">
            {ukupnoPrikazano === 0
              ? `Nema rezultata za „${pretraga}"`
              : `Pronađeno: ${ukupnoPrikazano} pitanj${ukupnoPrikazano === 1 ? "e" : "a"}`}
          </div>
        )}
      </div>

      {/* Brzo navigovanje (samo bez pretrage) */}
      {!pretraga.trim() && (
        <div className="bg-white rounded-2xl card-shadow p-5">
          <div className="text-xs uppercase font-semibold text-kolo-muted tracking-wider mb-3">
            Brzo navigovanje
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
            {FAQ_SEKCIJE.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-kolo-green-700 hover:text-kolo-green-900 hover:underline transition-colors"
              >
                {s.naslov}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Sekcije sa pitanjima */}
      {filtrirano.length === 0 ? (
        <div className="bg-white rounded-2xl card-shadow p-8 text-center">
          <p className="text-kolo-muted">
            Nema pitanja koja odgovaraju pretrazi.
          </p>
        </div>
      ) : (
        filtrirano.map((sekcija) => (
          <section
            key={sekcija.id}
            id={sekcija.id}
            className="space-y-3 scroll-mt-24"
          >
            <h2
              className="text-xl font-bold text-kolo-green-900 pt-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              {sekcija.naslov}
            </h2>
            <div className="space-y-2">
              {sekcija.pitanja.map((p) => {
                const otvoren = otvoreni.has(p.id);
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl card-shadow overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(p.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-kolo-bg transition-colors"
                    >
                      <span className="font-semibold text-kolo-text text-base leading-snug">
                        {p.pitanje}
                      </span>
                      <span
                        className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          otvoren
                            ? "bg-kolo-green-700 text-white"
                            : "bg-kolo-green-100 text-kolo-green-700"
                        }`}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d={otvoren ? "M2 8L6 4L10 8" : "M2 4L6 8L10 4"}
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    {otvoren && (
                      <div className="px-5 pb-5">
                        <div className="border-t border-kolo-border pt-4">
                          <p
                            className="text-base text-kolo-muted leading-relaxed text-body"
                            style={{ lineHeight: "1.75" }}
                          >
                            {p.odgovor}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
