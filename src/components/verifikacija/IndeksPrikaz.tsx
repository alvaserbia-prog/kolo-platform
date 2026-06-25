"use client";

/**
 * Veliki prikaz indeksa stvarnosti u formatu "X/Y%" ili "∞/Y%".
 * Pravilnik o dokazu stvarnosti v3.5.0.
 */
import Pojam from "@/components/Pojam";

type Props = {
  prikaz: string; // "30/30%", "10/30%", "∞/10%", "0/0%"
  tip: string;
  /** Početni korisnik (osnivač / UO Fondacije) — koren lanca jemstva. */
  jeOsnivac?: boolean;
  podnaslov?: string;
  /** Profil varijanta: status kao badge levo, indeks desno (centrirano). */
  statusKaoBadge?: boolean;
  /** Kartica popunjava punu visinu roditelja (h-full), sadržaj centriran. */
  ispuniVisinu?: boolean;
};

export default function IndeksPrikaz({ prikaz, tip, jeOsnivac, podnaslov, statusKaoBadge, ispuniVisinu }: Props) {
  const rootCls = `rounded-2xl border border-kolo-border bg-white p-6 shadow-sm${
    ispuniVisinu ? " h-full flex flex-col justify-center" : ""
  }`;
  const tipLabela: Record<string, string> = {
    REGULARNI: "Verifikovan kroz lanac jemstva",
    NOSILAC_ZRNA: "Nosilac ZRNA",
    NEVERIFIKOVAN: "Neverifikovan",
  };

  const badgeStil: Record<string, string> = {
    REGULARNI: "bg-kolo-green-100 text-kolo-green-700",
    NOSILAC_ZRNA: "bg-kolo-gold-100 text-kolo-gold-600",
    NEVERIFIKOVAN: "bg-kolo-bg text-kolo-muted",
  };

  // Osnivači (početni korisnici, UO Fondacije) su koren lanca jemstva — nemaju
  // verifikatora iznad sebe, pa se njihov status prikazuje kao „Početna verifikacija".
  const labela = jeOsnivac ? "Početna verifikacija" : (tipLabela[tip] ?? tip);
  const stil = jeOsnivac ? "bg-kolo-gold-100 text-kolo-gold-600" : (badgeStil[tip] ?? "bg-kolo-bg text-kolo-muted");

  const indeks = (
    <div className="text-center">
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold">
        <Pojam
          termin="Indeks stvarnosti"
          objasnjenje="Koliko te je mreža potvrdila kao stvarnu osobu. Raste sa svakom verifikacijom; na 10% dobijaš pun pristup."
        />
      </div>
      <div className="mt-1 text-5xl font-bold tabular-nums text-kolo-green-700">{prikaz}</div>
      {podnaslov && <div className="mt-1 text-xs text-kolo-muted">{podnaslov}</div>}
    </div>
  );

  if (statusKaoBadge) {
    return (
      <div className={rootCls}>
        <div className="grid grid-cols-2 gap-4 items-center">
          {/* LEVO — status badge */}
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center text-center px-3 py-1.5 rounded-full text-sm font-semibold ${stil}`}
            >
              {labela}
            </span>
          </div>
          {/* DESNO — indeks stvarnosti (centrirano) */}
          {indeks}
        </div>
      </div>
    );
  }

  return (
    <div className={rootCls}>
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold">
        <Pojam
          termin="Indeks stvarnosti"
          objasnjenje="Koliko te je mreža potvrdila kao stvarnu osobu. Raste sa svakom verifikacijom; na 10% dobijaš pun pristup."
        />
      </div>
      <div className="mt-1 text-5xl font-bold tabular-nums text-kolo-green-700">{prikaz}</div>
      <div className="mt-2 text-sm text-kolo-muted">{labela}</div>
      {podnaslov && <div className="mt-1 text-xs text-kolo-muted">{podnaslov}</div>}
    </div>
  );
}
