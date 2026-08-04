"use client";

import Link from "next/link";
import Pseudonim from "@/components/Pseudonim";
import { profilHref } from "@/lib/profil-link";

/**
 * Mini stablo verifikacija (varijanta A) — gore verifikator, dole verifikovani.
 * Podrazumevano: klikom na pseudonim ide se na /profil/<pseudonim> tog korisnika.
 *
 * Koristi se na dva mesta:
 *  - /verifikacija (sopstveni lanac; podrazumevani tekstovi u prvom licu);
 *  - panel grafa verifikacija (tuđi lanac; `onKlik` bira čvor u grafu umesto
 *    navigacije, a `tekstovi` prebacuju prazna stanja u treće lice).
 */
export type CvorVerifikator = {
  id: string;
  pseudonim: string;
};

export type CvorVerifikovani = {
  id: string;
  pseudonim: string;
  statusNadzora: "ne-podleze" | "ceka-nadzor" | "nadzirano";
};

type Props = {
  ja: { pseudonim: string; prikaz: string };
  // Korisnik može imati više verifikatora (1 početni + do 10 ličnih = do 100%).
  verifikatori: CvorVerifikator[];
  verifikovani: CvorVerifikovani[];
  jeJaPocetni?: boolean;
  className?: string;
  /** Naslov kartice (podrazumevano „Lanac verifikacija"). */
  naslov?: string;
  /** Ako je zadato, klik na osobu poziva ovo umesto navigacije na profil. */
  onKlik?: (id: string) => void;
  /** Tekstovi praznih stanja (podrazumevano prvo lice — sopstvena kartica). */
  tekstovi?: {
    bezVerifikatora?: string;
    osnivac?: string;
    bezVerifikovanih?: string;
  };
  /** Oznaka nadzora uz verifikovane (podrazumevano da; graf je ne prikazuje). */
  prikaziNadzor?: boolean;
};

/**
 * Oznaka nadzora — stoji sa strane pseudonima.
 * „nadzirano" = zelena kvačica (bez teksta); „čeka nadzor" = zlatna oznaka.
 */
function StatusBadge({ status }: { status: CvorVerifikovani["statusNadzora"] }) {
  if (status === "ne-podleze") return null;
  if (status === "nadzirano") {
    return (
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="w-4 h-4 shrink-0 text-kolo-green-700"
      >
        <title>Nadzirano</title>
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded-md border shrink-0 bg-kolo-gold-100 text-kolo-gold-600 border-kolo-gold-100">
      Čeka nadzor
    </span>
  );
}

/** Link na profil ili dugme (kada je zadat onKlik) — isti izgled. */
function Stavka({
  id,
  pseudonim,
  onKlik,
  className,
  children,
}: {
  id: string;
  pseudonim: string;
  onKlik?: (id: string) => void;
  className: string;
  children: React.ReactNode;
}) {
  if (onKlik) {
    return (
      <button type="button" onClick={() => onKlik(id)} className={`text-left ${className}`}>
        {children}
      </button>
    );
  }
  return (
    <Link href={profilHref({ id, pseudonim })} className={className}>
      {children}
    </Link>
  );
}

export default function MiniStablo({
  ja,
  verifikatori,
  verifikovani,
  jeJaPocetni,
  className = "",
  naslov = "Lanac verifikacija",
  onKlik,
  tekstovi,
  prikaziNadzor = true,
}: Props) {
  const bezVerifikatora = tekstovi?.bezVerifikatora ?? "Još nisi verifikovan";
  const osnivac = tekstovi?.osnivac ?? "Početna verifikacija (osnivač)";
  const bezVerifikovanih = tekstovi?.bezVerifikovanih ?? "Još nikog nisi verifikovao";

  return (
    <div className={`rounded-2xl border border-kolo-border bg-white p-6 shadow-sm ${className}`}>
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-4">
        {naslov}
      </div>

      {/* Gore: verifikatori (može ih biti više) */}
      <div className="flex flex-col items-center gap-2">
        {verifikatori.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {verifikatori.map((v) => (
              <Stavka
                key={v.id}
                id={v.id}
                pseudonim={v.pseudonim}
                onKlik={onKlik}
                className="px-3 py-1.5 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
              >
                @<Pseudonim>{v.pseudonim}</Pseudonim>
              </Stavka>
            ))}
          </div>
        ) : jeJaPocetni ? (
          <div className="px-3 py-1.5 rounded-xl bg-kolo-bg text-sm text-kolo-muted italic">
            {osnivac}
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-kolo-bg text-sm text-kolo-muted italic">
            {bezVerifikatora}
          </div>
        )}
        <div className="text-kolo-muted text-lg">↓</div>

        {/* Sredina: nosilac kartice */}
        <div className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold">
          <Pseudonim>{ja.pseudonim}</Pseudonim>
          <span className="ml-2 text-white/70 text-xs font-mono">{ja.prikaz}</span>
        </div>

        {/* Dole: koga je verifikovao */}
        {verifikovani.length > 0 && (
          <>
            <div className="text-kolo-muted text-lg">↓</div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {verifikovani.map((v) => (
                <Stavka
                  key={v.id}
                  id={v.id}
                  pseudonim={v.pseudonim}
                  onKlik={onKlik}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-kolo-bg hover:bg-kolo-green-100"
                >
                  <span className="text-sm font-medium truncate">@<Pseudonim>{v.pseudonim}</Pseudonim></span>
                  {prikaziNadzor && <StatusBadge status={v.statusNadzora} />}
                </Stavka>
              ))}
            </div>
          </>
        )}
        {verifikovani.length === 0 && (
          <>
            <div className="text-kolo-muted text-lg">↓</div>
            <div className="px-3 py-1.5 rounded-xl bg-kolo-bg text-xs text-kolo-muted italic">
              {bezVerifikovanih}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
