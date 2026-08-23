"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import IndeksPrikaz from "@/components/verifikacija/IndeksPrikaz";
import MiniStablo, {
  type CvorVerifikator,
  type CvorVerifikovani,
} from "@/components/verifikacija/MiniStablo";

type LanacResponse = {
  korisnik: {
    id: string;
    pseudonim: string;
    tip: string;
    jeOsnivac: boolean;
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
export default function IndeksSekcija({
  korisnikId,
  prikaziIndeks = true,
  prikaziStablo = true,
  indeksKaoBadge = false,
  ispuniVisinu = false,
}: {
  korisnikId: string;
  prikaziIndeks?: boolean;
  prikaziStablo?: boolean;
  indeksKaoBadge?: boolean;
  ispuniVisinu?: boolean;
}) {
  const t = useTranslations("common");
  const [data, setData] = useState<LanacResponse | null>(null);
  // Samo prekidač: kad upit padne, sekcija se ne crta (`if (error) return null`),
  // pa poruka o grešci nema gde da se prikaže — zato boolean, ne tekst.
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/verifikacija/lanac/${korisnikId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) {
          setError(true);
          return;
        }
        setData(d);
      })
      .catch(() => setError(true));
  }, [korisnikId]);

  if (error) return null;
  if (!data) {
    return (
      <div className={`rounded-2xl border border-black/10 bg-white p-6 shadow-sm${ispuniVisinu ? " h-full" : ""}`}>
        <div className="text-sm text-black/55">{t("ucitavanje")}</div>
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
    <div className={ispuniVisinu ? "flex-1 flex flex-col" : "space-y-4"}>
      {prikaziIndeks && (
        <IndeksPrikaz
          prikaz={data.korisnik.prikaz}
          tip={data.korisnik.tip}
          indeks={data.korisnik.indeks}
          jeOsnivac={data.korisnik.jeOsnivac}
          statusKaoBadge={indeksKaoBadge}
          ispuniVisinu={ispuniVisinu}
        />
      )}
      {prikaziStablo && (
        <MiniStablo
          ja={{ pseudonim: data.korisnik.pseudonim, prikaz: data.korisnik.prikaz }}
          verifikatori={verifikatorCvorovi}
          verifikovani={verifikovaniCvorovi}
          jeJaPocetni={data.korisnik.jeOsnivac}
          className={ispuniVisinu ? "h-full" : ""}
        />
      )}
    </div>
  );
}
