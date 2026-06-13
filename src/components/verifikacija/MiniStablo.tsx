"use client";

import Link from "next/link";
import Pseudonim from "@/components/Pseudonim";

/**
 * Mini stablo verifikacija (varijanta A) — gore verifikator, dole verifikovani.
 * Klikom na pseudonim ide se na /profil/[id] tog korisnika.
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
};

function StatusBadge({ status }: { status: CvorVerifikovani["statusNadzora"] }) {
  if (status === "ne-podleze") return null;
  const klasa =
    status === "nadzirano"
      ? "bg-kolo-green-100 text-kolo-green-700 border-kolo-green-100"
      : "bg-kolo-gold-100 text-kolo-gold-600 border-kolo-gold-100";
  const tekst = status === "nadzirano" ? "Nadzirano" : "Čeka nadzor";
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${klasa}`}>{tekst}</span>
  );
}

export default function MiniStablo({
  ja,
  verifikatori,
  verifikovani,
  jeJaPocetni,
  className = "",
}: Props) {
  return (
    <div className={`rounded-2xl border border-kolo-border bg-white p-6 shadow-sm ${className}`}>
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold mb-4">
        Lanac verifikacija
      </div>

      {/* Gore: verifikatori (može ih biti više) */}
      <div className="flex flex-col items-center gap-2">
        {verifikatori.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {verifikatori.map((v) => (
              <Link
                key={v.id}
                href={`/profil/${v.id}`}
                className="px-3 py-1.5 rounded-xl bg-kolo-bg hover:bg-kolo-green-100 text-sm font-medium"
              >
                @<Pseudonim>{v.pseudonim}</Pseudonim>
              </Link>
            ))}
          </div>
        ) : jeJaPocetni ? (
          <div className="px-3 py-1.5 rounded-xl bg-kolo-bg text-sm text-kolo-muted italic">
            Početni korisnik (UO Fondacije)
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-kolo-bg text-sm text-kolo-muted italic">
            Još nisi verifikovan
          </div>
        )}
        <div className="text-kolo-muted text-lg">↓</div>

        {/* Sredina: ja */}
        <div className="px-4 py-2 rounded-xl bg-kolo-green-700 text-white text-sm font-semibold">
          <Pseudonim>{ja.pseudonim}</Pseudonim>
          <span className="ml-2 text-white/70 text-xs font-mono">{ja.prikaz}</span>
        </div>

        {/* Dole: ja sam verifikovao */}
        {verifikovani.length > 0 && (
          <>
            <div className="text-kolo-muted text-lg">↓</div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {verifikovani.map((v) => (
                <Link
                  key={v.id}
                  href={`/profil/${v.id}`}
                  className="flex flex-col items-start gap-1 px-3 py-2 rounded-xl bg-kolo-bg hover:bg-kolo-green-100"
                >
                  <span className="text-sm font-medium">@<Pseudonim>{v.pseudonim}</Pseudonim></span>
                  <StatusBadge status={v.statusNadzora} />
                </Link>
              ))}
            </div>
          </>
        )}
        {verifikovani.length === 0 && (
          <>
            <div className="text-kolo-muted text-lg">↓</div>
            <div className="px-3 py-1.5 rounded-xl bg-kolo-bg text-xs text-kolo-muted italic">
              Još nikog nisi verifikovao
            </div>
          </>
        )}
      </div>
    </div>
  );
}
