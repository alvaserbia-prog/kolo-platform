// Likovi i zajednički kadrovi videa 20: upravnik (onaj ko upravlja zajedničkim sredstvima) i seljani sa
// fenjerima na noćnom trgu. Upravnik nije imenovan i nije lik iz ranijih videa.
import React from "react";
import { P } from "../paleta";
import { Lik, ikRuka, KOMSIJA, KOMSINICA, MILICA, MLADIC1 } from "../likovi";
import type { GlavaCfg, Izraz } from "../likovi";
import { Fenjer, type Svetlo } from "../noc";

type Postava = { odeca: any; glava: GlavaCfg };

export const UPRAVNIK: Postava = {
  odeca: { tip: "muski", kosulja: "#E8E2D0", pantalone: "#2B2F3A", prsluk: "#4A3A5A" },
  glava: { kosa: "mlad2", brkovi: true, bojaKose: P.kosaTamna, seed: 21 },
};
export const SELJANI: Postava[] = [KOMSINICA, KOMSIJA, MILICA, MLADIC1];

/** Gde visi plamen fenjera koji lik drži u šaci na (tx, ty): za svetlo u mraku. */
export const plamen = (tx: number, ty: number, fs: number, r = 300, a = 1): Svetlo => ({ x: tx, y: ty + 70 * fs, r, a });

/**
 * Lik koji drži fenjer prednjom rukom; šaka ide na (tx, ty) (inverzna kinematika), fenjer visi iz šake.
 */
export const SaFenjerom: React.FC<{
  p: Postava;
  x: number;
  y: number;
  s: number;
  tx: number;
  ty: number;
  f: number;
  okreni?: boolean;
  izraz?: Izraz;
  pogled?: [number, number];
  hod?: number;
  upaljen?: number;
  fs?: number;
}> = ({ p, x, y, s, tx, ty, f, okreni, izraz = "mirna", pogled, hod, upaljen = 1, fs = 0.9 }) => {
  const [a1, a2] = ikRuka(x, y, s, tx, ty, true, okreni);
  return (
    <g>
      <Lik x={x} y={y} s={s} okreni={okreni} {...p} glava={{ ...p.glava, izraz, pogled }} dr={[a1, a2]} lr={[14, 10]} hod={hod} />
      <g transform={`translate(${tx} ${ty})`}>
        <Fenjer s={fs} upaljen={upaljen} f={f} />
      </g>
    </g>
  );
};
