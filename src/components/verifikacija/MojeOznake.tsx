"use client";

import { useState } from "react";
import Link from "next/link";
import Pseudonim from "@/components/Pseudonim";

/**
 * Lista osoba koje sam verifikovao, sa privatnom oznakom (nadimkom) koju mogu da
 * uredim. Oznaka je vidljiva samo meni (verifikatoru) i UO Fondacije — nije javna.
 * Pravilnik o dokazu stvarnosti, dopuna 3.9.1 (čl. 31).
 */
export type VerifikovanaOsoba = {
  verifikacijaId: string;
  korisnikId: string;
  pseudonim: string;
  oznaka: string | null;
};

function Red({ osoba }: { osoba: VerifikovanaOsoba }) {
  const [vrednost, setVrednost] = useState(osoba.oznaka ?? "");
  const [sacuvano, setSacuvano] = useState(osoba.oznaka ?? "");
  const [cuvam, setCuvam] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);

  const izmenjeno = vrednost.trim() !== (sacuvano ?? "").trim();

  async function sacuvaj() {
    setCuvam(true);
    setGreska(null);
    try {
      const res = await fetch("/api/verifikacija/oznaka", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ verifikacijaId: osoba.verifikacijaId, oznaka: vrednost }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.error ?? "Greška");
        return;
      }
      setSacuvano(data.oznaka ?? "");
      setVrednost(data.oznaka ?? "");
    } catch {
      setGreska("Mreža nije dostupna");
    } finally {
      setCuvam(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-2 px-4 py-3">
      <Link
        href={`/profil/${osoba.korisnikId}`}
        className="text-sm font-medium text-kolo-green-700 hover:underline shrink-0 min-w-[7rem]"
      >
        @<Pseudonim>{osoba.pseudonim}</Pseudonim>
      </Link>
      <input
        type="text"
        value={vrednost}
        onChange={(e) => setVrednost(e.target.value)}
        maxLength={80}
        placeholder="Dodaj oznaku (nadimak)…"
        className="flex-1 min-w-[8rem] px-3 py-1.5 rounded-lg border border-kolo-border text-sm outline-none focus:border-kolo-green-500 transition-colors"
      />
      <button
        type="button"
        onClick={sacuvaj}
        disabled={!izmenjeno || cuvam}
        className="px-3 py-1.5 rounded-lg bg-kolo-green-700 text-white text-xs font-medium hover:bg-kolo-green-900 disabled:opacity-40 shrink-0"
      >
        {cuvam ? "…" : "Sačuvaj"}
      </button>
      {greska && <span className="text-xs text-kolo-danger w-full">{greska}</span>}
    </li>
  );
}

export default function MojeOznake({ osobe }: { osobe: VerifikovanaOsoba[] }) {
  if (osobe.length === 0) return null;
  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-1">
        Moje oznake
      </div>
      <p className="text-sm text-kolo-muted mb-4">
        Privatne oznake za osobe koje si verifikovao — da lakše znaš koga si doveo. Vide ih
        samo ti i Fondacija; nisu javne i ne prikazuju se drugim korisnicima.
      </p>
      <ul className="divide-y divide-kolo-border border border-kolo-border rounded-xl">
        {osobe.map((o) => (
          <Red key={o.verifikacijaId} osoba={o} />
        ))}
      </ul>
    </div>
  );
}
