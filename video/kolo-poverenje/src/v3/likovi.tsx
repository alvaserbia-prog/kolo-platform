// Likovi tuša: nekoliko poteza četkicom i providna boja preko. Stopala u (0,0), visina ~600.
// `crtanje` (0–1) iscrtava liniju, boja se razlije posle. Ruke: 0° visi, 90° udesno, 180° gore.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Lavir, Potez, T, elipsa } from "./tus";

export type Izraz = "osmeh" | "mirna" | "zabrinuta" | "srecna";
export type LikCfg = { odeca: string; donje: string; zena?: boolean; kosa: string; kosaTip: "rep" | "punda" | "kratka" | "marama"; brkovi?: boolean; kecelja?: string; seed: number };

const rad = (a: number) => (a * Math.PI) / 180;

export const LikTus: React.FC<
  LikCfg & { x: number; y: number; s?: number; lr?: [number, number]; dr?: [number, number]; hod?: number; izraz?: Izraz; pogled?: [number, number]; usta?: number; crtanje?: number; opacity?: number; drziD?: React.ReactNode; drziL?: React.ReactNode }
> = ({ x, y, s = 1, odeca, donje, zena, kosa, kosaTip, brkovi, kecelja, seed, lr = [12, 8], dr = [-12, -8], hod, izraz = "mirna", pogled = [0, 0], usta = 0, crtanje = 1, opacity = 1, drziD, drziL }) => {
  const f = useCurrentFrame();
  const n = hod === undefined ? 0 : Math.sin(hod) * 18;
  const bob = hod === undefined ? Math.sin((f + seed * 13) / 50) * 1.5 : -Math.abs(Math.cos(hod)) * 8;
  const boja = Math.min(1, crtanje * 1.6 - 0.3);
  const ruka = (sx: number, a1: number, a2: number, drzi?: React.ReactNode) => {
    const ex = sx + Math.sin(rad(a1)) * 118;
    const ey = -440 + Math.cos(rad(a1)) * 118;
    const hx = ex + Math.sin(rad(a1 + a2)) * 108;
    const hy = ey + Math.cos(rad(a1 + a2)) * 108;
    const d = `M${sx},-440 L${ex.toFixed(1)},${ey.toFixed(1)} L${hx.toFixed(1)},${hy.toFixed(1)}`;
    return (
      <g>
        <path d={d} fill="none" stroke={odeca} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" opacity={0.55 * boja} filter="url(#akv)" />
        <Potez d={d} debljina={5} napredak={crtanje} />
        <path d={elipsa(hx, hy, 15)} fill={T.koza} opacity={boja} />
        <Potez d={`M${hx - 12},${hy - 8} Q${hx},${hy + 20} ${hx + 12},${hy - 8}`} debljina={3.5} napredak={crtanje} />
        {drzi && <g transform={`translate(${hx} ${hy})`}>{drzi}</g>}
      </g>
    );
  };
  const oko = izraz === "srecna" ? "srecna" : "tacka";
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={100} ry={12} fill={T.tusMeki} opacity={0.18} filter="url(#tMeko)" />
      {/* noge */}
      {[-1, 1].map((st) => (
        <g key={st} transform={`translate(${st * 30} ${zena ? -170 : -320}) rotate(${st * n})`}>
          <path d={`M0,0 L0,${zena ? 160 : 300}`} stroke={zena ? T.tusMeki : donje} strokeWidth={zena ? 14 : 40} strokeLinecap="round" opacity={zena ? 1 : 0.6 * boja} filter="url(#akv)" />
          <Potez d={`M0,0 L0,${zena ? 162 : 304} l22,4`} debljina={5} napredak={crtanje} />
        </g>
      ))}
      {ruka(-66, lr[0], lr[1], drziL)}
      {/* telo */}
      {zena ? (
        <>
          <Lavir d="M-66,-330 C-96,-260 -112,-200 -120,-160 C-60,-146 60,-146 120,-160 C112,-200 96,-260 66,-330Z" boja={donje} jacina={0.65 * boja} />
          {kecelja && <Lavir d="M-44,-326 C-58,-260 -66,-210 -68,-170 C-30,-162 30,-162 68,-170 C66,-210 58,-260 44,-326Z" boja={kecelja} jacina={0.5 * boja} rub={false} />}
          <Lavir d="M-70,-470 C-76,-420 -72,-370 -64,-326 C-30,-318 30,-318 64,-326 C72,-370 76,-420 70,-470 C36,-486 -36,-486 -70,-470Z" boja={odeca} jacina={0.65 * boja} />
          <Potez d="M-66,-468 C-74,-420 -70,-370 -64,-330 C-92,-262 -110,-200 -120,-160 C-60,-146 60,-146 120,-160 C110,-200 92,-262 64,-330 C70,-370 74,-420 66,-468" debljina={5} napredak={crtanje} />
        </>
      ) : (
        <>
          <Lavir d="M-78,-474 C-84,-420 -80,-370 -72,-316 C-36,-306 36,-306 72,-316 C80,-370 84,-420 78,-474 C40,-490 -40,-490 -78,-474Z" boja={odeca} jacina={0.65 * boja} />
          <Potez d="M-76,-470 C-82,-420 -78,-370 -72,-318 L72,-318 C78,-370 82,-420 76,-470" debljina={5} napredak={crtanje} />
        </>
      )}
      {/* glava */}
      <g transform="translate(0 -556)">
        {kosaTip === "rep" && <Lavir d="M40,-40 C96,-30 100,50 76,100 C66,60 54,24 36,4Z" boja={kosa} jacina={0.7 * boja} />}
        {kosaTip === "punda" && <Lavir d={elipsa(0, -84, 34, 28)} boja={kosa} jacina={0.7 * boja} />}
        <path d={elipsa(0, 0, 70, 80)} fill={T.koza} opacity={0.9 * boja} filter="url(#akv)" />
        <Potez d="M-68,0 C-72,-56 -38,-80 0,-80 C40,-80 72,-56 68,0 C66,48 36,80 0,80 C-38,80 -68,48 -68,0" debljina={5} napredak={crtanje} />
        {kosaTip === "marama" ? (
          <Lavir d="M-76,0 C-80,-66 -42,-96 0,-96 C42,-96 80,-66 76,0 C56,-40 30,-50 0,-50 C-30,-50 -56,-40 -76,0Z" boja={kosa} jacina={0.75 * boja} />
        ) : (
          <Lavir d="M-70,-4 C-76,-62 -40,-90 2,-90 C44,-90 76,-62 70,-4 C56,-44 26,-56 0,-54 C-26,-54 -56,-42 -70,-4Z" boja={kosa} jacina={0.75 * boja} />
        )}
        <circle cx={-38} cy={22} r={14} fill={T.crvena} opacity={0.25 * boja} filter="url(#tMeko)" />
        <circle cx={38} cy={22} r={14} fill={T.crvena} opacity={0.25 * boja} filter="url(#tMeko)" />
        {crtanje > 0.6 &&
          (oko === "srecna" ? (
            <>
              <Potez d="M-36,-2 Q-26,-12 -16,-2" debljina={4.5} />
              <Potez d="M16,-2 Q26,-12 36,-2" debljina={4.5} />
            </>
          ) : (
            <>
              <circle cx={-26 + pogled[0] * 5} cy={-4 + pogled[1] * 4} r={6} fill={T.tus} />
              <circle cx={26 + pogled[0] * 5} cy={-4 + pogled[1] * 4} r={6} fill={T.tus} />
            </>
          ))}
        {crtanje > 0.6 && (
          <>
            <Potez d={izraz === "zabrinuta" ? "M-40,-30 Q-26,-38 -12,-26 M12,-26 Q26,-38 40,-30" : "M-40,-30 Q-26,-38 -12,-32 M12,-32 Q26,-38 40,-30"} debljina={4} />
            <Potez d="M-2,4 Q-8,16 2,18" debljina={3.5} />
            {usta > 0.05 ? (
              <path d={`M-12,32 Q0,${32 + 20 * usta} 12,32 Q0,28 -12,32Z`} fill={T.muljTamni} />
            ) : (
              <Potez d={izraz === "zabrinuta" ? "M-14,40 Q0,32 14,40" : izraz === "mirna" ? "M-12,36 Q0,39 12,36" : "M-18,32 Q0,46 18,32"} debljina={4.5} />
            )}
            {brkovi && <Potez d="M-30,26 Q-14,14 0,22 Q14,14 30,26" debljina={7} />}
          </>
        )}
      </g>
      {ruka(66, dr[0], dr[1], drziD)}
    </g>
  );
};

export const SOFIJA: LikCfg = { odeca: "#F2EEE6", donje: T.ljubicasta, zena: true, kosa: "#A6582E", kosaTip: "rep", kecelja: "#FFFFFF", seed: 4 };
export const DRAGAN: LikCfg = { odeca: T.crvena, donje: T.indigo, kosa: "#2B221C", kosaTip: "kratka", brkovi: true, seed: 3 };
export const BAKA: LikCfg = { odeca: T.tusMeki, donje: T.tusMeki, zena: true, kosa: T.crvena, kosaTip: "marama", kecelja: "#EDE6D8", seed: 1 };
export const SELJAK: LikCfg = { odeca: T.okerSvetli, donje: T.tusMeki, kosa: "#6B5B4B", kosaTip: "kratka", seed: 5 };
export const SELJANKA: LikCfg = { odeca: T.vodaSvetla, donje: T.indigo, zena: true, kosa: "#3B2A1E", kosaTip: "punda", seed: 6 };
export const MOMAK: LikCfg = { odeca: T.trava, donje: T.tusMeki, kosa: "#4A3526", kosaTip: "kratka", seed: 7 };

/** Siva silueta bez lica: providna, isprekidane ivice, treperi kad „ne postoji“. */
export const SiluetaTus: React.FC<{ x: number; y: number; s?: number; hod?: number; treperi?: number }> = ({ x, y, s = 1, hod, treperi = 0 }) => {
  const f = useCurrentFrame();
  const n = hod === undefined ? 0 : Math.sin(hod) * 18;
  const op = 0.85 - treperi * (0.35 + 0.3 * Math.sin(f * 1.3) * Math.sin(f * 0.47));
  const telo = "M-80,-474 C-86,-420 -82,-370 -74,-316 C-36,-306 36,-306 74,-316 C82,-370 86,-420 80,-474 C40,-490 -40,-490 -80,-474Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      {[-1, 1].map((st) => (
        <path key={st} d="M0,0 L0,300" transform={`translate(${st * 30} -320) rotate(${st * n})`} stroke={T.siva} strokeWidth={38} strokeLinecap="round" filter="url(#akv)" opacity={0.8} />
      ))}
      <path d="M-66,-440 L-100,-250 M66,-440 L100,-250" stroke={T.siva} strokeWidth={34} strokeLinecap="round" filter="url(#akv)" opacity={0.8} />
      <path d={telo} fill={T.siva} filter="url(#akv)" opacity={0.85} />
      <path d={elipsa(0, -556, 70, 80)} fill={T.siva} filter="url(#akv)" opacity={0.85} />
      <path d={telo} fill="none" stroke={T.tusMeki} strokeWidth={3} strokeDasharray="10 14" />
      <path d={elipsa(0, -556, 70, 80)} fill="none" stroke={T.tusMeki} strokeWidth={3} strokeDasharray="10 14" />
    </g>
  );
};
