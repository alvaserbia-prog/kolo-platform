"use client";

/**
 * Prijave — prijavljene poruke iz Pričaonice, GRUPISANE PO PRIJAVLJENOM NALOGU.
 *
 * Grupisanje je ceo smisao ekrana. Pojedinačna poruka retko sama nosi odluku, a
 * tri prijave iz tri razgovora nad istim nalogom je nose. Uz grupu stoji broj
 * RAZLIČITIH prijavilaca — jedan čovek koji pritisne dugme tri puta nije obrazac
 * nego jedan čovek.
 *
 * Odluka je jedna od dve, obe uz obavezno obrazloženje: ukloni poruku (uklanja i
 * zatvara sve prijave nad njom) ili odbaci prijavu (poruka ostaje).
 *
 * 🔴 Ovde se NE sankcioniše nalog. Suspenzija i isključenje (Uslovi čl. 27, 28)
 * su zasebna odluka i žive u tabu Korisnici; ovaj tab odlučuje o sadržaju. Obrazac
 * se prikazuje da bi ga čovek VIDEO, ne da bi sistem sam kaznio.
 *
 * Prikazuje se sadržaj prijavljene poruke — on je dokaz i jedino što Fondacija
 * gleda. Ostatak sobe se ne otvara: prijava ne daje pravo na čitanje razgovora.
 */

import { useState, useEffect, useCallback } from "react";
import { intlTag } from "@/lib/format";
import { useLocale } from "next-intl";
import Pseudonim from "@/components/Pseudonim";
import { profilHref } from "@/lib/profil-link";
import { jeHitno, jeObrazac, MIN_ODLUKA, type RazlogKod } from "@/lib/prijava-poruke-pravila";

type Prikaz = "otvorene" | "resene";

interface Prijava {
  id: string;
  razlogKod: RazlogKod;
  razlog: string | null;
  status: string;
  odluka: string | null;
  createdAt: string;
  resenAt: string | null;
  prijavioc: { id: string; pseudonim: string };
  poruka: { id: string; sadrzaj: string; soba: string; createdAt: string; uklonjena: boolean };
}

interface Grupa {
  prijavljeni: { id: string; pseudonim: string; maloletan: boolean; status: string };
  razlicitihPrijavilaca: number;
  hitno: boolean;
  prijave: Prijava[];
}

const PRIKAZI: [Prikaz, string][] = [
  ["otvorene", "Otvorene"],
  ["resene", "Rešene"],
];

/** Oznake šifara — admin panel se ne prevodi (odluka vlasnika). */
const OZNAKE: Record<RazlogKod, string> = {
  VREDJANJE: "Uvrede, pretnje, maltretiranje",
  TRAZI_SLIKE: "Traži fotografije",
  TRAZI_SUSRET: "Traži susret ili kontakt van Platforme",
  LAZE_UZRAST: "Sumnja da iza naloga nije dete",
  NEPRIMEREN_SADRZAJ: "Neprimeren sadržaj",
  LICNI_PODACI: "Lični podaci trećih lica",
  PREVARA: "Prevara ili obmana",
  OSTALO: "Ostalo",
};

export default function PrijaveTab({ onDone }: { onDone?: () => void }) {
  const locale = useLocale();
  const [prikaz, setPrikaz] = useState<Prikaz>("otvorene");
  const [grupe, setGrupe] = useState<Grupa[]>([]);
  const [ukupnoOtvorenih, setUkupnoOtvorenih] = useState(0);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState("");
  const [radiId, setRadiId] = useState<string | null>(null);
  const [odluka, setOdluka] = useState<{ id: string; vrsta: "ukloni" | "odbaci" } | null>(null);
  const [tekst, setTekst] = useState("");

  const ucitaj = useCallback(async () => {
    setUcitava(true);
    try {
      const res = await fetch(`/api/admin/prijave-poruka?prikaz=${prikaz}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? "Greška pri učitavanju.");
        return;
      }
      setGrupe(data.grupe ?? []);
      setUkupnoOtvorenih(data.ukupnoOtvorenih ?? 0);
      setGreska("");
    } finally {
      setUcitava(false);
    }
  }, [prikaz]);

  useEffect(() => {
    void ucitaj();
  }, [ucitaj]);

  async function posalji(p: Prijava, vrsta: "ukloni" | "odbaci") {
    if (tekst.trim().length < MIN_ODLUKA) {
      setGreska("Obrazloženje je obavezno — ide korisniku i u revizijski dnevnik.");
      return;
    }
    setRadiId(p.id);
    setGreska("");
    try {
      const res = await fetch(`/api/admin/prijave-poruka/${p.id}/${vrsta}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odluka: tekst.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGreska(data.error ?? "Greška pri odlučivanju.");
        return;
      }
      setOdluka(null);
      setTekst("");
      await ucitaj();
      onDone?.();
    } finally {
      setRadiId(null);
    }
  }

  const datum = (iso: string) =>
    new Date(iso).toLocaleString(intlTag(locale), {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Europe/Belgrade",
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {PRIKAZI.map(([kljuc, labela]) => (
            <button
              key={kljuc}
              onClick={() => setPrikaz(kljuc)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                prikaz === kljuc
                  ? "bg-kolo-green-700 text-white"
                  : "bg-white border border-kolo-border text-kolo-muted"
              }`}
            >
              {labela}
              {kljuc === "otvorene" && ukupnoOtvorenih > 0 ? ` (${ukupnoOtvorenih})` : ""}
            </button>
          ))}
        </div>
        <p className="text-xs text-kolo-muted max-w-xl">
          Prijave su grupisane po nalogu koji je prijavljen, jer obrazac nosi odluku koju
          pojedinačna poruka ne nosi. Uklanjanje poruke zatvara sve prijave nad njom.
          Suspenzija i isključenje su zasebna odluka i donose se u tabu Korisnici.
        </p>
      </div>

      {greska && <p className="text-sm text-red-600">{greska}</p>}

      {ucitava ? (
        <p className="text-sm text-kolo-muted">Učitavanje…</p>
      ) : grupe.length === 0 ? (
        <p className="text-sm text-kolo-muted">
          {prikaz === "otvorene" ? "Nema otvorenih prijava." : "Nema rešenih prijava."}
        </p>
      ) : (
        <div className="space-y-4">
          {grupe.map((g) => (
            <div key={g.prijavljeni.id} className="bg-white rounded-2xl border border-kolo-border p-4 space-y-3">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                {g.hitno && <span title="Šifra mamljenja ili laži o uzrastu">🔴</span>}
                <span className="text-kolo-muted">Prijavljen nalog:</span>
                <a href={profilHref(g.prijavljeni)} className="font-semibold text-kolo-green-700 hover:underline">
                  <Pseudonim>{g.prijavljeni.pseudonim}</Pseudonim>
                </a>
                {g.prijavljeni.maloletan && (
                  <span className="text-xs rounded-full bg-kolo-bg px-2 py-0.5 text-kolo-muted">dete</span>
                )}
                {g.prijavljeni.status !== "ACTIVE" && (
                  <span className="text-xs rounded-full bg-red-50 px-2 py-0.5 text-red-600">
                    {g.prijavljeni.status}
                  </span>
                )}
                <span
                  className={`text-xs ${jeObrazac(g.razlicitihPrijavilaca) ? "font-semibold text-red-600" : "text-kolo-muted"}`}
                >
                  · prijavilo ga {g.razlicitihPrijavilaca}{" "}
                  {g.razlicitihPrijavilaca === 1 ? "korisnik" : "korisnika"}
                  {jeObrazac(g.razlicitihPrijavilaca) ? " — obrazac" : ""}
                </span>
              </div>

              {g.prijave.map((p) => (
                <div key={p.id} className="rounded-xl border border-kolo-border/70 p-3 space-y-2">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs text-kolo-muted">
                    <strong className={jeHitno(p.razlogKod) ? "text-red-600" : "text-kolo-text"}>
                      {OZNAKE[p.razlogKod]}
                    </strong>
                    <span>·</span>
                    <span>
                      prijavio/la{" "}
                      <a href={profilHref(p.prijavioc)} className="text-kolo-green-700 hover:underline">
                        <Pseudonim>{p.prijavioc.pseudonim}</Pseudonim>
                      </a>
                    </span>
                    <span>· {datum(p.createdAt)}</span>
                    <span>· soba: {p.poruka.soba}</span>
                    {p.poruka.uklonjena && <span className="text-red-600">· poruka uklonjena</span>}
                  </div>

                  {p.razlog && <p className="text-xs text-kolo-muted">Opis: „{p.razlog}"</p>}

                  <p className="text-sm text-kolo-text bg-kolo-bg rounded-xl px-3 py-2 whitespace-pre-wrap">
                    {p.poruka.sadrzaj}
                  </p>

                  {p.status !== "OTVORENA" ? (
                    <div className="text-xs text-kolo-muted space-y-1">
                      <p>
                        <strong className="text-kolo-text">
                          {p.status === "RESENA" ? "Poruka uklonjena" : "Prijava odbačena"}
                        </strong>
                        {p.resenAt ? ` · ${datum(p.resenAt)}` : ""}
                      </p>
                      {p.odluka && <p>Obrazloženje: {p.odluka}</p>}
                    </div>
                  ) : odluka?.id === p.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={tekst}
                        onChange={(e) => setTekst(e.target.value)}
                        rows={3}
                        placeholder="Obrazloženje — ide korisniku i u revizijski dnevnik."
                        className="w-full text-sm border border-kolo-border rounded-xl px-3 py-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => posalji(p, odluka.vrsta)}
                          disabled={radiId === p.id}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-kolo-green-700 disabled:opacity-50"
                        >
                          {odluka.vrsta === "ukloni" ? "Ukloni poruku" : "Odbaci prijavu"}
                        </button>
                        <button
                          onClick={() => { setOdluka(null); setTekst(""); }}
                          className="px-4 py-2 rounded-xl text-sm font-medium border border-kolo-border text-kolo-muted"
                        >
                          Odustani
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setOdluka({ id: p.id, vrsta: "ukloni" }); setTekst(""); setGreska(""); }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-kolo-green-700"
                      >
                        Ukloni poruku
                      </button>
                      <button
                        onClick={() => { setOdluka({ id: p.id, vrsta: "odbaci" }); setTekst(""); setGreska(""); }}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-kolo-border text-kolo-muted"
                      >
                        Odbaci prijavu
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
