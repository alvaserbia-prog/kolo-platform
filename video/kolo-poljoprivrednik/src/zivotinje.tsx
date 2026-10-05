// Životinje naive: simentalka (crveno-bela krava, kakve se drže po vojvođanskim salašima), tele, svinja,
// ovca, kokoška. Okrenute udesno, stopala u (0,0); `smer = -1` okreće ulevo. Blago dišu i mrdaju glavom.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Boja, N, elipsa, kutija } from "./naiva";

type Z = { x: number; y: number; s?: number; smer?: 1 | -1; seed?: number; opacity?: number; hod?: number };

const useDah = (seed: number) => {
  const f = useCurrentFrame();
  return { glava: Math.sin((f + seed * 23) / 22) * 4, rep: Math.sin((f + seed * 13) / 14) * 10, dah: Math.sin((f + seed * 7) / 30) * 1.5 };
};

const noge = (xs: number[], vrh: number, duz: number, boja: string, debljina: number, hod = 0) =>
  xs.map((x, i) => (
    <g key={i} transform={`rotate(${hod ? Math.sin(hod + i * 1.6) * 12 : 0} ${x} ${vrh})`}>
      <Boja d={kutija(x - debljina / 2, vrh, debljina, duz, debljina / 2.5)} boja={boja} debljina={2.5} />
      <rect x={x - debljina / 2} y={vrh + duz - 12} width={debljina} height={12} rx={3} fill={N.kontura} />
    </g>
  ));

export const Krava: React.FC<Z & { tele?: boolean; zvono?: boolean }> = ({ x, y, s = 1, smer = 1, seed = 1, opacity = 1, tele, zvono = true, hod = 0 }) => {
  const d = useDah(seed);
  const pege = Array.from({ length: tele ? 3 : 5 }, (_, i) => ({
    cx: -110 + random(`kp${seed}${i}`) * 200,
    cy: -200 + random(`kq${seed}${i}`) * 80,
    rx: 26 + random(`kr${seed}${i}`) * 26,
  }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * smer} ${s})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={170} ry={16} fill={N.travaTamna} opacity={0.3} />
      {/* rep */}
      <path d={`M-150,-210 C-176,-170 ${-170 + d.rep},-120 ${-166 + d.rep},-80`} stroke={N.kontura} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M-150,-210 C-176,-170 ${-170 + d.rep},-120 ${-166 + d.rep},-80`} stroke={N.bela} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Boja d={elipsa(-166 + d.rep, -76, 10, 16)} boja="#9A4A28" debljina={2} />
      {noge([-110, -70, 70, 110], -120, 120, N.bela, 30, hod)}
      {/* telo */}
      <g transform={`translate(0 ${d.dah})`}>
        <Boja d="M-156,-220 C-160,-262 -120,-270 -60,-266 L80,-266 C130,-268 160,-246 158,-200 C156,-150 140,-120 100,-116 L-110,-116 C-150,-118 -158,-160 -156,-220Z" boja={N.bela} />
        <clipPath id={`kc${seed}`}>
          <path d="M-156,-220 C-160,-262 -120,-270 -60,-266 L80,-266 C130,-268 160,-246 158,-200 C156,-150 140,-120 100,-116 L-110,-116 C-150,-118 -158,-160 -156,-220Z" />
        </clipPath>
        <g clipPath={`url(#kc${seed})`}>
          {pege.map((p, i) => (
            <path key={i} d={elipsa(p.cx, p.cy, p.rx, p.rx * 0.8)} fill="#B4532A" />
          ))}
        </g>
        <path d="M-156,-220 C-160,-262 -120,-270 -60,-266 L80,-266 C130,-268 160,-246 158,-200 C156,-150 140,-120 100,-116 L-110,-116 C-150,-118 -158,-160 -156,-220Z" fill="none" stroke={N.kontura} strokeWidth={3} />
        {!tele && <Boja d="M-70,-118 C-70,-96 -30,-90 -20,-116Z" boja={N.roze} debljina={2.5} />}
      </g>
      {/* glava */}
      <g transform={`translate(150 -230) rotate(${d.glava})`}>
        <Boja d="M-10,-30 C10,-70 60,-74 76,-40 C92,-6 96,40 80,62 C60,82 30,80 16,60 C0,30 -18,0 -10,-30Z" boja={N.bela} />
        <Boja d="M20,-50 C30,-70 56,-70 64,-46 C50,-38 34,-38 20,-50Z" boja="#B4532A" debljina={2} />
        <Boja d={elipsa(62, 64, 28, 20)} boja={N.roze} debljina={2.5} />
        <circle cx={54} cy={66} r={4} fill={N.kontura} />
        <circle cx={72} cy={66} r={4} fill={N.kontura} />
        <circle cx={58} cy={4} r={7} fill={N.kontura} />
        <circle cx={60} cy={2} r={2} fill={N.bela} />
        {!tele && <path d="M14,-46 C6,-70 18,-84 30,-80 M64,-58 C70,-82 86,-84 92,-72" stroke={N.zuta} strokeWidth={9} fill="none" strokeLinecap="round" />}
        <Boja d="M-6,-24 C-40,-36 -46,-10 -14,-6Z" boja={N.bela} debljina={2.5} />
        {zvono && !tele && (
          <g>
            <path d="M0,40 C20,70 50,80 60,80" stroke={N.crvena} strokeWidth={8} fill="none" />
            <Boja d="M20,72 L44,72 L48,100 L16,100Z" boja={N.zuta} debljina={2.5} />
          </g>
        )}
      </g>
    </g>
  );
};

export const Tele: React.FC<Z> = (p) => <Krava {...p} s={(p.s ?? 1) * 0.62} tele />;

export const Svinja: React.FC<Z> = ({ x, y, s = 1, smer = 1, seed = 1, opacity = 1 }) => {
  const d = useDah(seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * smer} ${s})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={110} ry={12} fill={N.travaTamna} opacity={0.3} />
      {noge([-60, -30, 40, 70], -50, 50, "#F4A6B4", 22)}
      <path d={`M-104,-110 c-24,-6 -26,${-20 + d.rep * 0.5} -10,-24 c14,-4 10,16 -4,12`} stroke="#D87A8E" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Boja d={elipsa(-10, -100 + d.dah, 100, 62)} boja="#F7B5C2" />
      <g transform={`translate(80 -110) rotate(${d.glava * 0.6})`}>
        <Boja d={elipsa(0, 0, 46, 42)} boja="#F7B5C2" />
        <Boja d="M-24,-30 L-36,-62 L-6,-40Z" boja="#F29AAE" debljina={2.5} />
        <Boja d="M10,-38 L18,-70 L32,-34Z" boja="#F29AAE" debljina={2.5} />
        <Boja d={elipsa(42, 10, 16, 20)} boja="#F29AAE" debljina={2.5} />
        <circle cx={40} cy={4} r={3.5} fill={N.kontura} />
        <circle cx={44} cy={16} r={3.5} fill={N.kontura} />
        <circle cx={10} cy={-8} r={5.5} fill={N.kontura} />
        <path d="M14,22 Q24,30 30,24" stroke={N.kontura} strokeWidth={3} fill="none" />
      </g>
    </g>
  );
};

export const Ovca: React.FC<Z> = ({ x, y, s = 1, smer = 1, seed = 1, opacity = 1, hod = 0 }) => {
  const d = useDah(seed);
  const vuna = Array.from({ length: 14 }, (_, i) => ({ cx: -80 + (i % 7) * 27, cy: -120 + Math.floor(i / 7) * 40 + (i % 2) * 8 }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * smer} ${s})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={100} ry={12} fill={N.travaTamna} opacity={0.3} />
      {noge([-60, -30, 40, 66], -60, 60, "#3B2E28", 16, hod)}
      <g transform={`translate(0 ${d.dah})`}>
        <Boja d={elipsa(-6, -104, 100, 58)} boja="#F6F1E4" />
        {vuna.map((v, i) => (
          <circle key={i} cx={v.cx} cy={v.cy} r={20} fill="#F6F1E4" stroke={N.kontura} strokeWidth={2} />
        ))}
      </g>
      <g transform={`translate(86 -124) rotate(${d.glava})`}>
        <Boja d={elipsa(14, 10, 30, 40)} boja="#3B2E28" />
        <Boja d="M-14,-6 L-44,6 L-12,14Z" boja="#3B2E28" debljina={2} />
        <circle cx={22} cy={0} r={5} fill={N.bela} />
        <circle cx={23} cy={0} r={2.5} fill={N.kontura} />
        {[-12, 4, 20].map((cx) => (
          <circle key={cx} cx={cx} cy={-26} r={13} fill="#F6F1E4" stroke={N.kontura} strokeWidth={2} />
        ))}
      </g>
    </g>
  );
};

export const Kokoska: React.FC<Z & { boja?: string; kljuca?: boolean }> = ({ x, y, s = 1, smer = 1, seed = 1, opacity = 1, boja = N.bela, kljuca }) => {
  const f = useCurrentFrame();
  const k = kljuca ? Math.max(0, Math.sin((f + seed * 19) / 9)) * 26 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * smer} ${s})`} opacity={opacity}>
      <ellipse cx={0} cy={3} rx={40} ry={6} fill={N.travaTamna} opacity={0.3} />
      <path d="M-8,-24 L-10,0 M8,-24 L10,0" stroke={N.zutaTamna} strokeWidth={5} strokeLinecap="round" />
      <Boja d="M-46,-70 C-60,-96 -40,-110 -30,-90 C-20,-60 20,-40 40,-56 C50,-30 30,-18 0,-18 C-30,-18 -44,-40 -46,-70Z" boja={boja} />
      <path d="M-30,-60 C-14,-50 6,-48 20,-50" stroke={N.kontura} strokeWidth={2} fill="none" opacity={0.5} />
      <g transform={`translate(30 ${-74 + k}) rotate(${k})`}>
        <Boja d={elipsa(0, 0, 18, 18)} boja={boja} debljina={2.5} />
        <Boja d="M-8,-16 C-6,-30 2,-30 2,-18 C4,-30 12,-30 12,-14Z" boja={N.crvena} debljina={2} />
        <Boja d="M14,-2 L30,4 L14,8Z" boja={N.zutaTamna} debljina={2} />
        <Boja d="M10,8 C12,18 6,22 4,10Z" boja={N.crvena} debljina={1.5} />
        <circle cx={6} cy={-4} r={3} fill={N.kontura} />
      </g>
    </g>
  );
};

/** Jaje (za korpu i police). */
export const Jaje: React.FC<{ x: number; y: number; s?: number; rot?: number; boja?: string }> = ({ x, y, s = 1, rot = 0, boja = "#F3E2C6" }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <Boja d="M0,-26 C16,-26 22,0 20,10 C18,24 -18,24 -20,10 C-22,0 -16,-26 0,-26Z" boja={boja} debljina={2.5} />
    <ellipse cx={-6} cy={-10} rx={4} ry={7} fill={N.bela} opacity={0.6} />
  </g>
);
