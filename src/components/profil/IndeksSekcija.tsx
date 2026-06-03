"use client";

import { useEffect, useState } from "react";
import IndeksPrikaz from "@/components/verifikacija/IndeksPrikaz";
import MiniStablo, {
  type CvorVerifikator,
  type CvorVerifikovani,
} from "@/components/verifikacija/MiniStablo";
import { jeKorenJemstva } from "@/lib/dozvole";

type LanacResponse = {
  korisnik: {
    id: string;
    pseudonim: string;
    tip: string;
    indeks: number;
    kapacitet: number | null;
    neograniceno: boolean;
    prikaz: string;
  };
  verifikatori: {
    id: string;
    pseudonim: string;
    datum: string;
    statusNadzora: string;
  }[];
  verifikovani: {
    id: string;
    pseudonim: string;
    datum: string;
    statusNadzora: string;
  }[];
};

/**
 * Sekcija na javnom profilu /profil/[id] — prikazuje indeks stvarnosti
 * i mini stablo (lanac verifikacija). Dohvata iz javnog endpoint-a
 * /api/verifikacija/lanac/[korisnikId].
 */
export default function IndeksSekcija({ korisnikId }: { korisnikId: string }) {
  const [data, setData] = useState<LanacResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/verifikacija/lanac/${korisnikId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) {
          setError("Indeks nije dostupan.");
          return;
        }
        setData(d);
      })
      .catch(() => setError("Mreža nije dostupna"));
  }, [korisnikId]);

  if (error) return null;
  if (!data) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="text-sm text-black/55">Učitavanje indeksa...</div>
      </div>
    );
  }

  const verifikatorCvorovi: CvorVerifikator[] = data.verifikatori.map((v) => ({
    id: v.id,
    pseudonim: v.pseudonim,
  }));

  const verifikovaniCvorovi: CvorVerifikovani[] = data.verifikovani.map((v) => ({
    id: v.id,
    pseudonim: v.pseudonim,
    statusNadzora: v.statusNadzora as CvorVerifikovani["statusNadzora"],
  }));

  return (
    <div className="space-y-4">
      <IndeksPrikaz prikaz={data.korisnik.prikaz} tip={data.korisnik.tip} />
      <MiniStablo
        ja={{ pseudonim: data.korisnik.pseudonim, prikaz: data.korisnik.prikaz }}
        verifikatori={verifikatorCvorovi}
        verifikovani={verifikovaniCvorovi}
        jeJaPocetni={jeKorenJemstva({ tipKorisnika: data.korisnik.tip })}
      />
    </div>
  );
}
