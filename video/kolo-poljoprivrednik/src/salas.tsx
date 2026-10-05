// Salaš i ravnica u naivi: pejzaž po godišnjem dobu i dobu dana, dugačka bela kuća pod crepom, štala od
// dasaka, đeram (bunar sa motkom), dud, putevi; unutrašnjost štale (jasle, zrak svetla); vozila.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Boja, Cvet, DrvoN, N, Oblak, Sunce, elipsa, kutija } from "./naiva";

export type Sezona = "leto" | "jesen" | "zima" | "prolece";
export type Doba = "dan" | "vece" | "noc" | "jutro";

const NEBO: Record<Doba, [string, string, string]> = {
  dan: [N.nebo, N.neboSvetlo, N.neboBelo],
  jutro: ["#9FB9CF", "#D9DCD6", "#F1E6CF"],
  vece: ["#3E4F7A", "#C9866A", "#F2C38A"],
  noc: ["#101A33", "#22305A", "#3A4672"],
};
const POLJA: Record<Sezona, string[]> = {
  leto: ["#E9C24A", "#8CC84B", "#D9A93A", "#5BA83A", "#F0D46A"],
  jesen: ["#A7895A", "#8D7A55", "#B89B63", "#7C6B4A", "#9C8458"],
  zima: ["#F4F6FA", "#E6EBF2", "#F8FAFC", "#DCE3EC", "#EEF2F7"],
  prolece: ["#8CC84B", "#5BA83A", "#A8D86A", "#6DB845", "#C4E58A"],
};
const TLO: Record<Sezona, string> = { leto: N.trava, jesen: "#8E8458", zima: "#F2F5F9", prolece: N.travaSvetla };

/** Nebo, horizont sa poljima u trakama (ravnica) i tlo do dna kadra. */
export const Pejzaz: React.FC<{ sezona: Sezona; doba?: Doba; horizont?: number; sunce?: boolean; oblaci?: boolean; sneg?: boolean }> = ({
  sezona,
  doba = "dan",
  horizont = 760,
  sunce = true,
  oblaci = true,
  sneg,
}) => {
  const f = useCurrentFrame();
  const [a, b, c] = NEBO[doba];
  const id = `neb-${doba}`;
  const polja = POLJA[sezona];
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.65" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <rect x={-300} y={-300} width={1680} height={horizont + 320} fill={`url(#${id})`} />
      {doba === "noc" && (
        <g>
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={random(`zv${i}`) * 1080} cy={60 + random(`zy${i}`) * (horizont - 200)} r={1.5 + random(`zr${i}`) * 2} fill={N.bela} opacity={0.5 + 0.5 * Math.sin(f / 20 + i)} />
          ))}
          <Boja d={elipsa(820, 300, 50)} boja="#F4EBC8" kontura="#C9B98A" />
        </g>
      )}
      {sunce && doba === "dan" && <Sunce x={880} y={300} r={64} f={f} />}
      {sunce && doba === "vece" && <circle cx={760} cy={horizont - 30} r={90} fill="#F7A85A" opacity={0.9} />}
      {oblaci && doba !== "noc" && (
        <>
          <Oblak x={150 + ((f * 0.35) % 1300) - 150} y={260} s={0.8} />
          <Oblak x={620 + ((f * 0.22) % 1300) - 150} y={420} s={0.6} />
        </>
      )}
      {/* daleka polja u trakama, kao kod naivaca */}
      {Array.from({ length: 6 }, (_, i) => {
        const y0 = horizont + i * i * 14 + i * 10;
        const y1 = horizont + (i + 1) * (i + 1) * 14 + (i + 1) * 10;
        return <path key={i} d={`M-300,${y0} C200,${y0 - 6} 800,${y0 + 6} 1380,${y0 - 4} L1380,${y1} L-300,${y1}Z`} fill={polja[i % polja.length]} stroke={N.kontura} strokeWidth={1.5} strokeOpacity={0.35} />;
      })}
      {/* drvoredi na horizontu */}
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse key={`d${i}`} cx={-40 + i * 86 + random(`dh${i}`) * 30} cy={horizont - 14} rx={26} ry={30} fill={sezona === "zima" ? "#9AA6B4" : sezona === "jesen" ? "#B07A3A" : N.travaTamna} opacity={0.85} />
      ))}
      <rect x={-300} y={horizont + 6 * 6 * 14 + 60} width={1680} height={1920} fill={TLO[sezona]} />
      {sneg &&
        Array.from({ length: 70 }, (_, i) => {
          const x = (random(`sx${i}`) * 1180 + Math.sin(f / 30 + i) * 20) % 1180;
          const y = (random(`sy${i}`) * 1920 + f * (2 + random(`sv${i}`) * 2)) % 1920;
          return <circle key={`s${i}`} cx={x - 50} cy={y} r={3 + random(`sr${i}`) * 4} fill={N.bela} opacity={0.9} />;
        })}
    </g>
  );
};

/** Dugačka bela salašarska kuća pod crepom, sa tremom i prozorima. Stopala u (0,0), širina ~560. */
export const Kuca: React.FC<{ x: number; y: number; s?: number; svetlo?: boolean; zapusten?: boolean; sneg?: boolean }> = ({ x, y, s = 1, svetlo, zapusten, sneg }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-280,0 L-280,-190 L280,-190 L280,0Z" boja={zapusten ? "#D8D0BE" : N.zid} />
    <rect x={-280} y={-24} width={560} height={24} fill={zapusten ? "#8A8A8A" : N.plava} />
    <Boja d={zapusten ? "M-310,-184 L-230,-320 L120,-330 L150,-300 L250,-316 L310,-184Z" : "M-310,-184 L-230,-320 L230,-320 L310,-184Z"} boja={zapusten ? "#9A6A5A" : N.crep} />
    {!zapusten &&
      Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-296 + i * 14},${-208 - i * 24} L${296 - i * 14},${-208 - i * 24}`} stroke={N.crvenaTamna} strokeWidth={2.5} opacity={0.55} />)}
    {sneg && <Boja d="M-312,-186 C-280,-206 -250,-260 -230,-322 L230,-322 C250,-262 280,-206 312,-186 C200,-200 -200,-200 -312,-186Z" boja={N.bela} kontura="#B8C4D4" />}
    <Boja d={kutija(-40, -120, 80, 120, 4)} boja={N.drvo} />
    {[-190, -110, 110, 190].map((px) => (
      <g key={px}>
        <Boja d={kutija(px - 32, -150, 64, 74, 3)} boja={zapusten ? "#7A7A7A" : svetlo ? "#FFD27A" : N.plavaSvetla} />
        {zapusten ? (
          <path d={`M${px - 34},-150 L${px + 34},-76 M${px + 34},-150 L${px - 34},-76`} stroke={N.drvoTamno} strokeWidth={8} />
        ) : (
          <path d={`M${px},-150 L${px},-76 M${px - 32},-113 L${px + 32},-113`} stroke={N.bela} strokeWidth={5} />
        )}
        <Boja d={kutija(px - 44, -154, 12, 82, 3)} boja={zapusten ? "#6A6A6A" : N.zelena} debljina={2} />
        <Boja d={kutija(px + 32, -154, 12, 82, 3)} boja={zapusten ? "#6A6A6A" : N.zelena} debljina={2} />
      </g>
    ))}
    <rect x={150} y={-370} width={30} height={60} fill={N.bela} stroke={N.kontura} strokeWidth={2.5} />
  </g>
);

/** Štala od dasaka sa velikim vratima. Stopala u (0,0), širina ~420. `otvorena` 0–1. */
export const Stala: React.FC<{ x: number; y: number; s?: number; otvorena?: number; sneg?: boolean; unutra?: React.ReactNode }> = ({ x, y, s = 1, otvorena = 0, sneg, unutra }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-210,0 L-210,-230 L0,-330 L210,-230 L210,0Z" boja="#A0522D" />
    {Array.from({ length: 13 }, (_, i) => (
      <path key={i} d={`M${-195 + i * 32},${i < 7 ? -236 - i * 14 : -236 - (12 - i) * 14} L${-195 + i * 32},0`} stroke="#6E3518" strokeWidth={3} opacity={0.6} />
    ))}
    <Boja d="M-236,-222 L0,-350 L236,-222 L214,-210 L0,-322 L-214,-210Z" boja={N.crep} />
    {sneg && <Boja d="M-238,-224 L0,-354 L238,-224 C120,-250 -120,-250 -238,-224Z" boja={N.bela} kontura="#B8C4D4" />}
    <Boja d={kutija(-100, -190, 200, 190, 4)} boja="#2A1A10" />
    {unutra && <g clipPath="url(#vrataStale)">{unutra}</g>}
    <defs>
      <clipPath id="vrataStale">
        <rect x={-100} y={-190} width={200} height={190} />
      </clipPath>
    </defs>
    {/* dva krila vrata se otvaraju */}
    <g transform={`translate(-100 0) scale(${1 - otvorena * 0.85} 1)`}>
      <Boja d="M0,0 L0,-190 L100,-190 L100,0Z" boja="#B8693A" />
      <path d="M0,-190 L100,0 M0,0 L100,-190" stroke="#6E3518" strokeWidth={6} />
    </g>
    <g transform={`translate(100 0) scale(${-(1 - otvorena * 0.85)} 1)`}>
      <Boja d="M0,0 L0,-190 L100,-190 L100,0Z" boja="#B8693A" />
      <path d="M0,-190 L100,0 M0,0 L100,-190" stroke="#6E3518" strokeWidth={6} />
    </g>
    <Boja d="M-40,-280 L40,-280 L40,-240 L-40,-240Z" boja="#2A1A10" />
  </g>
);

/** Đeram: bunar sa dugačkom motkom i kofom. */
export const Djeram: React.FC<{ x: number; y: number; s?: number; nagib?: number }> = ({ x, y, s = 1, nagib = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d={kutija(-50, -70, 100, 70, 8)} boja="#B9B2A4" />
    <path d="M-50,-50 L50,-50 M-50,-28 L50,-28" stroke={N.kontura} strokeWidth={2} opacity={0.5} />
    <Boja d="M70,0 L82,-300 L96,-300 L92,0Z" boja={N.drvo} />
    <g transform={`translate(88 -290) rotate(${-24 + nagib})`}>
      <path d="M-260,0 L180,0" stroke={N.kontura} strokeWidth={14} strokeLinecap="round" />
      <path d="M-260,0 L180,0" stroke={N.drvo} strokeWidth={9} strokeLinecap="round" />
      <path d="M-250,0 L-250,150" stroke={N.kontura} strokeWidth={3} />
      <Boja d={kutija(160, -16, 40, 34, 4)} boja="#7A7A7A" />
    </g>
  </g>
);

/** Dud (stari, širok), leti zelen, u jesen žut, zimi go, u proleće sa sitnim cvetom. */
export const Dud: React.FC<{ x: number; y: number; s?: number; sezona: Sezona }> = ({ x, y, s = 1, sezona }) => {
  const krosnja = sezona === "leto" ? N.travaTamna : sezona === "jesen" ? "#C99A3A" : sezona === "prolece" ? N.trava : null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Boja d="M-30,0 C-24,-120 -40,-200 -80,-260 L-60,-270 C-30,-230 -10,-200 0,-180 C10,-220 40,-260 80,-280 L96,-266 C50,-230 26,-170 30,0Z" boja={N.drvoTamno} />
      {krosnja ? (
        <g>
          <Boja d={elipsa(0, -330, 210, 150)} boja={krosnja} />
          {Array.from({ length: 50 }, (_, i) => {
            const a = random(`du${i}`) * Math.PI * 2;
            const r = Math.sqrt(random(`dr${i}`)) * 180;
            return <ellipse key={i} cx={Math.cos(a) * r} cy={-330 + Math.sin(a) * r * 0.65} rx={12} ry={7} fill={sezona === "prolece" && i % 4 === 0 ? N.bela : sezona === "jesen" ? (i % 2 ? "#E0B44A" : "#A8742A") : i % 2 ? N.trava : N.travaSvetla} transform={`rotate(${a * 57} ${Math.cos(a) * r} ${-330 + Math.sin(a) * r * 0.65})`} />;
          })}
        </g>
      ) : (
        <g stroke={N.drvoTamno} strokeWidth={8} fill="none" strokeLinecap="round">
          <path d="M-70,-262 C-110,-300 -130,-350 -120,-400 M-70,-262 C-60,-320 -30,-360 -10,-420 M80,-276 C100,-330 140,-360 170,-380 M80,-276 C60,-330 40,-380 50,-440" />
        </g>
      )}
    </g>
  );
};

/** Kamion sa ogradom na sanduku; u sanduku `teret`. Okrenut ulevo, točkovi na y=0. */
export const Kamion: React.FC<{ x: number; y: number; s?: number; teret?: React.ReactNode; tocak?: number; natpis?: string }> = ({ x, y, s = 1, teret, tocak = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform="translate(60 -60)">{teret}</g>
    <Boja d="M-120,-60 L340,-60 L340,-40 L-120,-40Z" boja="#5A5A64" />
    {Array.from({ length: 8 }, (_, i) => (
      <path key={i} d={`M${-110 + i * 62},-60 L${-110 + i * 62},-230`} stroke={N.drvoTamno} strokeWidth={10} strokeLinecap="round" />
    ))}
    <path d="M-120,-230 L340,-230 M-120,-150 L340,-150" stroke={N.drvoTamno} strokeWidth={9} strokeLinecap="round" />
    <Boja d="M-300,-40 L-300,-170 C-300,-200 -270,-220 -240,-220 L-140,-220 L-120,-40Z" boja="#2E6DB4" />
    <Boja d="M-280,-130 L-270,-196 L-160,-196 L-150,-130Z" boja={N.neboSvetlo} />
    <rect x={-310} y={-60} width={30} height={20} fill={N.zuta} stroke={N.kontura} strokeWidth={2} />
    {[-220, 40, 250].map((tx) => (
      <g key={tx} transform={`translate(${tx} -30) rotate(${tocak})`}>
        <Boja d={elipsa(0, 0, 40)} boja="#2A2A2A" />
        <Boja d={elipsa(0, 0, 16)} boja="#9A9A9A" />
        <path d="M-14,0 L14,0" stroke="#5A5A5A" strokeWidth={4} />
      </g>
    ))}
  </g>
);

/** Autobus (deca odlaze). Okrenut ulevo. */
export const Autobus: React.FC<{ x: number; y: number; s?: number; tocak?: number }> = ({ x, y, s = 1, tocak = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-320,-40 L-320,-220 C-320,-250 -300,-260 -270,-260 L300,-260 C320,-260 330,-250 330,-230 L330,-40Z" boja="#E9E2CF" />
    <rect x={-320} y={-120} width={650} height={30} fill={N.crvena} />
    {Array.from({ length: 6 }, (_, i) => (
      <Boja key={i} d={kutija(-280 + i * 100, -230, 80, 80, 6)} boja={N.neboSvetlo} />
    ))}
    {[-220, 220].map((tx) => (
      <g key={tx} transform={`translate(${tx} -36) rotate(${tocak})`}>
        <Boja d={elipsa(0, 0, 38)} boja="#2A2A2A" />
        <Boja d={elipsa(0, 0, 14)} boja="#9A9A9A" />
      </g>
    ))}
  </g>
);

/** Mali auto (komšija vozi Đuriku). Okrenut udesno. */
export const Auto: React.FC<{ x: number; y: number; s?: number; tocak?: number; boja?: string; putnici?: React.ReactNode }> = ({ x, y, s = 1, tocak = 0, boja = N.crvena, putnici }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-200,-40 L-200,-110 C-190,-130 -150,-136 -120,-140 L-80,-200 L90,-200 L140,-136 C180,-130 200,-120 200,-90 L200,-40Z" boja={boja} />
    <Boja d="M-70,-140 L-46,-186 L10,-186 L10,-140Z" boja={N.neboSvetlo} />
    <Boja d="M30,-140 L30,-186 L80,-186 L116,-140Z" boja={N.neboSvetlo} />
    {putnici}
    {[-120, 120].map((tx) => (
      <g key={tx} transform={`translate(${tx} -36) rotate(${tocak})`}>
        <Boja d={elipsa(0, 0, 36)} boja="#2A2A2A" />
        <Boja d={elipsa(0, 0, 13)} boja="#9A9A9A" />
      </g>
    ))}
  </g>
);

/** Drvena klupa ispred kuće. Sedište na y=-70. */
export const Klupa: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d={kutija(-130, -84, 260, 22, 5)} boja={N.drvo} />
    <Boja d={kutija(-130, -150, 260, 18, 5)} boja={N.drvo} />
    {[-110, 110].map((lx) => (
      <Boja key={lx} d={kutija(lx - 8, -150, 16, 150, 4)} boja={N.drvoTamno} />
    ))}
  </g>
);

/** Ograda od letava (salaš, stočna pijaca). */
export const Letve: React.FC<{ x0: number; x1: number; y: number; h?: number; boja?: string }> = ({ x0, x1, y, h = 120, boja = N.drvo }) => (
  <g>
    {Array.from({ length: Math.floor((x1 - x0) / 90) + 1 }, (_, i) => (
      <Boja key={i} d={kutija(x0 + i * 90 - 7, y - h, 14, h, 3)} boja={N.drvoTamno} debljina={2} />
    ))}
    <Boja d={kutija(x0 - 10, y - h + 20, x1 - x0 + 20, 14, 3)} boja={boja} debljina={2} />
    <Boja d={kutija(x0 - 10, y - h / 2, x1 - x0 + 20, 14, 3)} boja={boja} debljina={2} />
  </g>
);

/** Trska i kanal (Bezdan). */
export const Kanal: React.FC<{ y: number }> = ({ y }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <path d={`M-300,${y} C200,${y - 20} 800,${y + 20} 1380,${y} L1380,${y + 80} L-300,${y + 80}Z`} fill="#4E86D8" stroke={N.kontura} strokeWidth={2} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${((i * 200 + f * 1.5) % 1300) - 150},${y + 30 + (i % 2) * 20} q20,-8 40,0`} stroke={N.bela} strokeWidth={3} fill="none" opacity={0.7} />
      ))}
      {Array.from({ length: 30 }, (_, i) => {
        const x = i * 40 + random(`tr${i}`) * 20 - 20;
        const h = 80 + random(`th${i}`) * 70;
        return (
          <g key={`t${i}`} transform={`rotate(${Math.sin(f / 25 + i) * 3} ${x} ${y})`}>
            <path d={`M${x},${y + 4} L${x + 4},${y - h}`} stroke="#6E8A3A" strokeWidth={5} />
            <ellipse cx={x + 4} cy={y - h - 6} rx={6} ry={18} fill="#7A4A2A" stroke={N.kontura} strokeWidth={1.5} />
          </g>
        );
      })}
    </g>
  );
};

export { Cvet, DrvoN };
