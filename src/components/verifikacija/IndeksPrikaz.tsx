"use client";

/**
 * Veliki prikaz indeksa stvarnosti u formatu "X/Y%" ili "∞/Y%".
 * Pravilnik o dokazu stvarnosti v3.5.0.
 */
import Pojam from "@/components/Pojam";

type Props = {
  prikaz: string; // "30/30%", "10/30%", "∞/10%", "0/0%"
  tip: string;
  podnaslov?: string;
};

export default function IndeksPrikaz({ prikaz, tip, podnaslov }: Props) {
  const tipLabela: Record<string, string> = {
    REGULARNI: "Verifikovan kroz lanac jemstva",
    NOSILAC_ZRNA: "Nosilac ZRNA",
    NEVERIFIKOVAN: "Neverifikovan",
  };

  return (
    <div className="rounded-2xl border border-kolo-border bg-white p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-kolo-muted font-semibold">
        <Pojam
          termin="Indeks stvarnosti"
          objasnjenje="Koliko te je mreža potvrdila kao stvarnu osobu. Raste sa svakom verifikacijom; na 10% dobijaš pun pristup."
        />
      </div>
      <div className="mt-1 text-5xl font-bold tabular-nums text-kolo-green-700">{prikaz}</div>
      <div className="mt-2 text-sm text-kolo-muted">{tipLabela[tip] ?? tip}</div>
      {podnaslov && <div className="mt-1 text-xs text-kolo-muted">{podnaslov}</div>}
    </div>
  );
}
