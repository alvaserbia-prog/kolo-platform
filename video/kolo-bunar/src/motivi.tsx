// Motivi drvoreza: bunar sa đermom, ljudi, krave, drveće, trska, reka, sunce, oblaci,
// salaš, ograda. Svaki motiv se crta oko svoje tačke oslonca (0,0 = dno, sredina).
import React from "react";
import { P } from "./paleta";
import { Linija, Mastilo, Povrs, elipsa, kutija, rnd } from "./alat";

// ── BUNAR SA ĐERMOM ─────────────────────────────────────────────────────
/**
 * Bunar sa đermom (bačka varijanta): kamena/drvena kruna, soha (račvast stub),
 * greda (đeram) sa tegom i motka sa kofom. `ugao` u stepenima: + spušta kofu u bunar.
 * `suv` 0–1: bunar presušuje (oker, pukotine, bez vode).
 */
export const Bunar: React.FC<{ ugao?: number; suv?: number; slomljen?: number; boja?: string; bezDjerma?: boolean }> = ({ ugao = -22, suv = 0, slomljen = 0, boja, bezDjerma }) => {
  const PX = 230;
  const PY = -400;
  const th = ((slomljen > 0 ? ugao + slomljen * 38 : ugao) * Math.PI) / 180;
  const fx = PX - 340 * Math.cos(th);
  const fy = PY + 340 * Math.sin(th);
  const bx = PX + 150 * Math.cos(th);
  const by = PY - 150 * Math.sin(th);
  const kofaY = fy + 360;
  const kamen = boja ?? P.kamen;
  return (
    <g>
      {/* senka na zemlji */}
      <path d={elipsa(40, 6, 250, 22)} fill={P.mastilo} opacity={0.18} />
      {/* soha */}
      {!bezDjerma && (
        <>
          <Povrs d={`M${PX - 14},8 L${PX - 10},${PY + 40} L${PX - 34},${PY - 26} L${PX - 20},${PY - 30} L${PX},${PY + 8} L${PX + 20},${PY - 30} L${PX + 34},${PY - 26} L${PX + 10},${PY + 40} L${PX + 14},8 Z`} boja={P.drvo} srafura="srafV" srafuraOp={0.5} debljina={5} />
          {/* greda */}
          <Linija d={`M${bx},${by} L${fx},${fy}`} debljina={13} />
          <Linija d={`M${bx},${by} L${fx},${fy}`} debljina={5} boja={P.drvo} opacity={0.9} />
          {/* teg na kraju grede */}
          <Povrs d={`M${bx - 30},${by - 6} L${bx + 26},${by - 16} L${bx + 34},${by + 30} L${bx - 22},${by + 40} Z`} boja={P.kamenTamni} srafura="srafD" srafuraOp={0.6} />
          {/* motka i kofa */}
          {slomljen < 0.5 && (
            <>
              <Linija d={`M${fx},${fy} L${fx},${kofaY - 40}`} debljina={7} />
              <g transform={`translate(${fx} ${kofaY})`}>
                <Povrs d="M-26,-44 L26,-44 L20,4 L-20,4 Z" boja={P.drvo} srafura="srafV" srafuraOp={0.5} debljina={4} />
                <Linija d="M-24,-30 L24,-30" boja={P.rdjaTamna} debljina={4} />
                <Linija d="M-21,-6 L21,-6" boja={P.rdjaTamna} debljina={4} />
                <Linija d="M-26,-44 Q0,-72 26,-44" debljina={3} />
              </g>
            </>
          )}
        </>
      )}
      {/* kruna bunara: unutrašnjost */}
      <path d={elipsa(0, -112, 96, 24)} fill={P.mastilo} />
      <path d={elipsa(0, -110, 76, 16)} fill={suv > 0.5 ? P.zemlja : P.vodaTamna} opacity={1 - suv * 0.6} />
      {suv < 0.4 && <Linija d="M-40,-112 Q-20,-108 0,-112 T40,-112" boja={P.nebo} debljina={3} opacity={0.7 * (1 - suv * 2.5)} />}
      {/* kruna: prednji zid */}
      <Povrs d="M-96,-112 L-96,-6 Q0,26 96,-6 L96,-112 Q0,-86 -96,-112 Z" boja={kamen} srafura="srafD" srafuraOp={0.45} debljina={6} />
      {[-80, -54].map((y, i) => (
        <Linija key={i} d={`M-96,${y} Q0,${y + 24} 96,${y}`} debljina={4} opacity={0.8} />
      ))}
      {[-60, -10, 40].map((x, i) => (
        <Linija key={i} d={`M${x},${-78 + i * 3} L${x + 4},${-52 + i * 3}`} debljina={3} opacity={0.7} />
      ))}
      {[-35, 15, 62].map((x, i) => (
        <Linija key={i} d={`M${x},${-50 + i * 2} L${x + 3},${-18 + i * 2}`} debljina={3} opacity={0.7} />
      ))}
      <path d={elipsa(0, -112, 96, 24)} fill="none" stroke={P.mastilo} strokeWidth={6} />
      {suv > 0.3 && <Linija d="M-60,-100 L-40,-70 L-50,-40 M30,-96 L42,-60 L30,-30" debljina={3} opacity={Math.min(1, (suv - 0.3) * 2)} />}
    </g>
  );
};

// ── ČOVEK ───────────────────────────────────────────────────────────────
// Siluete kao u linorezu: telo je puno mastilo sa urezanim svetlim linijama, a boja
// (marama, prsluk, kecelja) je druga ploča otiska.
export type Tip = "m" | "z" | "d" | "st" | "sta" | "o";
export type Predmet = "kofa" | "lopata" | "beleznica" | "kamen" | "korpa" | "srp" | "tegla" | null;

export const Covek: React.FC<{
  tip?: Tip;
  boja?: string;
  boja2?: string;
  ruke?: [number, number];
  predmet?: Predmet;
  predmetL?: Predmet;
  smer?: 1 | -1;
  korak?: number;
  s?: number;
  glavaNagib?: number;
  crno?: boolean;
}> = ({ tip = "m", boja = P.rdja, boja2 = P.oker, ruke = [8, -8], predmet = null, predmetL = null, smer = 1, korak = 0, s = 1, glavaNagib = 0 }) => {
  const dete = tip === "d";
  const zena = tip === "z" || tip === "sta";
  const star = tip === "st" || tip === "sta";
  const sk = s * (dete ? 0.64 : 1);
  const sw = Math.sin(korak) * 14;
  const pogr = star ? 8 : 0; // blago pogrbljen
  const rame = -226 + pogr * 0.6;
  const ruka = (a: number, x0: number, duz = 98) => {
    const r = (a * Math.PI) / 180;
    return [x0 + Math.sin(r) * duz, rame + Math.cos(r) * duz] as [number, number];
  };
  const [lx, ly] = ruka(ruke[1], -10 + pogr);
  const [dx, dy] = ruka(ruke[0], 12 + pogr);
  const M = P.mastilo;
  return (
    <g transform={`scale(${sk * smer} ${sk})`}>
      <path d={elipsa(4, 2, 58, 9)} fill={M} opacity={0.22} />
      {/* zadnja ruka */}
      <path d={`M${-10 + pogr},${rame} L${lx},${ly}`} stroke={M} strokeWidth={15} strokeLinecap="round" fill="none" />
      {/* noge */}
      {!zena && (
        <>
          <path d={`M-14,-132 L${-16 - sw},-2 L${-2 - sw},-2 L0,-120 L${16 + sw},-2 L${30 + sw},-2 L16,-132 Z`} fill={M} />
          <path d={`M${-18 - sw},-4 L${6 - sw},-4 L${4 - sw},4 L${-20 - sw},4 Z M${12 + sw},-4 L${38 + sw},-4 L${36 + sw},4 L${10 + sw},4 Z`} fill={M} />
        </>
      )}
      {zena && (
        <>
          <path d={`M-10,-40 L${-12 - sw * 0.5},-2 L${2 - sw * 0.5},-2 L0,-40 Z M8,-40 L${10 + sw * 0.5},-2 L${24 + sw * 0.5},-2 L20,-40 Z`} fill={M} />
          <path d="M-30,-140 Q-44,-80 -58,-34 Q0,-22 60,-34 Q44,-80 32,-140 Z" fill={M} />
          {/* kecelja u boji */}
          <Povrs d="M-18,-132 L22,-132 L34,-44 Q2,-36 -28,-44 Z" boja={boja2} srafura="srafD" srafuraOp={0.35} ivica={M} debljina={3} pomak={[3, 2]} mrlja={0.4} />
        </>
      )}
      {/* trup */}
      <path d={`M${-30 + pogr},-238 Q${-40 + pogr},-190 -30,-128 L32,-128 Q${42 + pogr},-190 ${32 + pogr},-238 Q${pogr},-252 ${-30 + pogr},-238 Z`} fill={M} />
      {/* urezana svetla linija uz telo (svetlo sleva) */}
      <path d={`M${-22 + pogr},-226 Q${-30 + pogr},-190 -22,-140`} stroke={P.krem} strokeWidth={3} fill="none" opacity={0.75} />
      {!zena && !dete && (
        <Povrs d={tip === "o" ? `M-26,-234 L30,-234 L30,-132 L-28,-132 Z` : `M${-24 + pogr},-232 L${-4 + pogr},-232 L-2,-132 L-26,-132 Q${-34 + pogr},-186 ${-24 + pogr},-232 Z`} boja={boja} srafura={false} ivica={false} pomak={[3, 2]} mrlja={0.45} />
      )}
      {dete && <Povrs d={`M-28,-232 L32,-232 L30,-160 L-30,-160 Z`} boja={boja} srafura={false} ivica={false} pomak={[3, 2]} mrlja={0.45} />}
      {/* glava */}
      <g transform={`rotate(${glavaNagib + pogr} ${pogr} -250)`}>
        <path d={`M${-8 + pogr},-236 L${-8 + pogr},-252 L${10 + pogr},-252 L${10 + pogr},-236 Z`} fill={M} />
        <path d={elipsa(4 + pogr, -272, 25, 27)} fill={P.krem} stroke={M} strokeWidth={5} />
        <path d={`M${-20 + pogr},-280 Q${-22 + pogr},-296 ${2 + pogr},-298 Q${-8 + pogr},-284 ${-6 + pogr},-262 Q${-18 + pogr},-262 ${-20 + pogr},-280 Z`} fill={M} />
        <path d={`M${24 + pogr},-280 L${31 + pogr},-266 L${24 + pogr},-263`} stroke={M} strokeWidth={3.5} fill="none" strokeLinejoin="round" />
        <circle cx={15 + pogr} cy={-276} r={3.4} fill={M} />
        <path d={`M${12 + pogr},-254 Q${18 + pogr},-251 ${22 + pogr},-255`} stroke={M} strokeWidth={2.5} fill="none" />
        {tip === "m" && (
          <>
            <path d={`M${-34 + pogr},-288 Q${4 + pogr},-298 ${44 + pogr},-286 L${42 + pogr},-280 Q${4 + pogr},-290 ${-32 + pogr},-282 Z`} fill={M} />
            <path d={`M${-18 + pogr},-286 Q${-18 + pogr},-316 ${4 + pogr},-318 Q${26 + pogr},-316 ${26 + pogr},-286 Z`} fill={M} />
            <path d={`M${-18 + pogr},-294 L${26 + pogr},-294`} stroke={boja} strokeWidth={4} />
          </>
        )}
        {tip === "st" && (
          <>
            <path d={`M${-24 + pogr},-284 Q${-20 + pogr},-308 ${4 + pogr},-308 Q${28 + pogr},-306 ${30 + pogr},-284 Q${2 + pogr},-292 ${-24 + pogr},-284 Z`} fill={M} />
            <path d={`M${10 + pogr},-258 Q${22 + pogr},-252 ${32 + pogr},-258`} stroke={P.krem} strokeWidth={4} fill="none" />
          </>
        )}
        {zena && (
          <Povrs
            d={`M${-28 + pogr},-264 Q${-30 + pogr},-304 ${4 + pogr},-306 Q${36 + pogr},-302 ${30 + pogr},-266 L${24 + pogr},-270 Q${22 + pogr},-290 ${4 + pogr},-292 Q${-14 + pogr},-290 ${-18 + pogr},-270 Q${-20 + pogr},-252 ${-36 + pogr},-232 Z`}
            boja={star ? P.mastiloMeko : boja}
            srafura="srafG"
            srafuraOp={0.3}
            ivica={M}
            debljina={3}
            pomak={[3, 2]}
            mrlja={0.4}
          />
        )}
        {tip === "o" && (
          <>
            {/* kratka kovrdžava kosa i naočare (istraživačica) */}
            <path d={`M${-24 + pogr},-262 Q${-34 + pogr},-290 ${-16 + pogr},-302 Q${-6 + pogr},-316 ${12 + pogr},-306 Q${30 + pogr},-306 ${30 + pogr},-288 Q${18 + pogr},-294 ${8 + pogr},-288 Q${-4 + pogr},-280 ${-8 + pogr},-262 Z`} fill={M} />
            {[-26, -14, 2, 18].map((x, i) => (
              <circle key={i} cx={x + pogr} cy={-300 + (i % 2) * 6} r={7} fill={M} />
            ))}
            <circle cx={16 + pogr} cy={-276} r={9} fill="none" stroke={M} strokeWidth={3} />
            <path d={`M${7 + pogr},-277 L${-2 + pogr},-280`} stroke={M} strokeWidth={3} />
          </>
        )}
        {dete && <Povrs d="M-24,-284 Q-20,-310 6,-308 Q30,-306 32,-282 L44,-278 L-24,-276 Z" boja={boja2} srafura={false} ivica={M} debljina={3} pomak={[2, 1]} />}
      </g>
      {/* prednja ruka */}
      <path d={`M${12 + pogr},${rame} L${dx},${dy}`} stroke={M} strokeWidth={15} strokeLinecap="round" fill="none" />
      <path d={`M${14 + pogr},${rame + 10} L${(dx + 12 + pogr) / 2 + 4},${(dy + rame) / 2 + 4}`} stroke={P.krem} strokeWidth={2.5} fill="none" opacity={0.55} />
      <path d={elipsa(dx, dy, 9)} fill={M} />
      <path d={elipsa(lx, ly, 9)} fill={M} />
      {predmet && (
        <g transform={`translate(${dx} ${dy})`}>
          <Predmeti p={predmet} />
        </g>
      )}
      {predmetL && (
        <g transform={`translate(${lx} ${ly})`}>
          <Predmeti p={predmetL} />
        </g>
      )}
    </g>
  );
};

const Predmeti: React.FC<{ p: Predmet }> = ({ p }) => {
  switch (p) {
    case "kofa":
      return (
        <g>
          <Linija d="M-2,0 L-2,10" debljina={3} />
          <Povrs d="M-22,10 L18,10 L14,48 L-18,48 Z" boja={P.drvo} srafura="srafV" srafuraOp={0.5} debljina={4} pomak={[2, 1]} />
          <Linija d="M-20,22 L16,22" boja={P.rdjaTamna} debljina={3} />
        </g>
      );
    case "lopata":
      return (
        <g transform="rotate(-8)">
          <Linija d="M0,-150 L0,110" debljina={8} boja={P.drvo} />
          <Linija d="M0,-150 L0,110" debljina={3} />
          <Povrs d="M-20,108 L20,108 L16,160 Q0,172 -16,160 Z" boja={P.kamenTamni} srafura="srafD" srafuraOp={0.5} debljina={4} pomak={[2, 1]} />
        </g>
      );
    case "beleznica":
      return (
        <g transform="rotate(-12)">
          <Povrs d={kutija(-8, -44, 56, 72, 4)} boja={P.krem} srafura={false} debljina={4} pomak={[2, 1]} />
          {[0, 1, 2, 3].map((i) => (
            <Linija key={i} d={`M2,${-30 + i * 14} L38,${-30 + i * 14}`} debljina={2.5} opacity={0.7} />
          ))}
        </g>
      );
    case "kamen":
      return <Povrs d="M-22,-4 L14,-14 L28,10 L6,26 L-20,18 Z" boja={P.kamen} srafura="srafD" srafuraOp={0.5} debljina={4} pomak={[2, 1]} />;
    case "korpa":
      return (
        <g>
          <Linija d="M-24,6 Q0,-30 24,6" debljina={4} />
          <Povrs d="M-30,6 L30,6 L22,44 L-22,44 Z" boja={P.okerTamni} srafura="srafD2" srafuraOp={0.6} debljina={4} pomak={[2, 1]} />
          <circle cx={-8} cy={2} r={8} fill={P.rdja} stroke={P.mastilo} strokeWidth={3} />
          <circle cx={10} cy={0} r={8} fill={P.trava} stroke={P.mastilo} strokeWidth={3} />
        </g>
      );
    case "srp":
      return <Linija d="M0,0 L0,24 Q30,40 40,10" debljina={5} />;
    case "tegla":
      return (
        <g>
          <Povrs d={kutija(-16, -6, 34, 44, 6)} boja={P.rdja} srafura={false} debljina={4} pomak={[2, 1]} />
          <Povrs d={kutija(-18, -14, 38, 10, 3)} boja={P.krem} srafura={false} debljina={3} pomak={[0, 0]} />
        </g>
      );
    default:
      return null;
  }
};

// ── KRAVA ───────────────────────────────────────────────────────────────
export const Krava: React.FC<{ s?: number; smer?: 1 | -1; mrsava?: number; glavaDole?: number }> = ({ s = 1, smer = 1, mrsava = 0, glavaDole = 0 }) => {
  const trb = 30 - mrsava * 22;
  const gy = glavaDole * 40;
  return (
    <g transform={`scale(${s * smer} ${s})`}>
      <path d={elipsa(0, 4, 110, 10)} fill={P.mastilo} opacity={0.2} />
      {[-70, -46, 50, 74].map((x, i) => (
        <Linija key={i} d={`M${x},-70 L${x + (i % 2 ? 3 : -3)},0`} debljina={13} />
      ))}
      <Povrs
        d={`M-100,-150 Q-40,-168 60,-156 Q96,-150 100,-120 Q104,-86 84,-70 Q20,${-70 + trb} -60,-66 Q-104,-70 -106,-110 Q-108,-140 -100,-150 Z`}
        boja={P.krem}
        srafura={mrsava > 0.4 ? "srafD" : false}
        srafuraOp={0.5}
        debljina={6}
        pomak={[2, 2]}
        mrlja={0.2}
      />
      <Mastilo d="M-60,-156 Q-30,-150 -24,-120 Q-40,-96 -70,-108 Q-84,-136 -60,-156 Z" />
      <Mastilo d="M22,-150 Q52,-140 48,-112 Q30,-96 12,-110 Q6,-136 22,-150 Z" />
      {mrsava > 0.3 && [-40, -20, 0, 20].map((x, i) => <Linija key={i} d={`M${x},-140 Q${x + 4},-110 ${x},-84`} debljina={3} opacity={mrsava} />)}
      <Linija d="M-104,-128 Q-122,-104 -116,-74" debljina={5} />
      {/* glava */}
      <g transform={`translate(96 ${-128 + gy}) rotate(${glavaDole * 30})`}>
        <Povrs d="M-6,-24 Q20,-34 44,-20 L58,20 Q52,38 34,36 Q10,30 -2,10 Z" boja={P.krem} srafura={false} debljina={5} pomak={[2, 1]} mrlja={0.2} />
        <Mastilo d="M36,20 Q50,18 58,22 Q56,36 38,36 Z" boja={P.rdja} />
        <circle cx={22} cy={-4} r={4} fill={P.mastilo} />
        <Linija d="M4,-24 Q-2,-44 -18,-46 M24,-28 Q34,-48 50,-46" debljina={5} />
      </g>
      {/* zvono */}
      <g transform={`translate(80 ${-86 + gy * 0.5})`}>
        <path d="M-8,0 L8,0 L10,16 L-10,16 Z" fill={P.oker} stroke={P.mastilo} strokeWidth={3} />
      </g>
    </g>
  );
};

// ── DRVEĆE, TRAVA, TRSKA ────────────────────────────────────────────────
export const Topola: React.FC<{ s?: number; boja?: string; golo?: number }> = ({ s = 1, boja = P.travaTamna, golo = 0 }) => (
  <g transform={`scale(${s})`}>
    <Linija d="M0,0 L0,-120" debljina={14} boja={P.mastilo} />
    {golo < 0.8 ? (
      <Povrs d="M0,-480 Q46,-360 42,-230 Q36,-120 0,-110 Q-36,-120 -42,-230 Q-46,-360 0,-480 Z" boja={boja} srafura="srafD" srafuraOp={0.55} debljina={5} opacity={1 - golo * 0.8} />
    ) : null}
    {golo > 0.3 && <Linija d="M0,-110 L0,-420 M0,-200 L-30,-280 M0,-260 L28,-340 M0,-330 L-22,-390" debljina={5} opacity={golo} />}
  </g>
);

export const Hrast: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = P.trava }) => (
  <g transform={`scale(${s})`}>
    <Povrs d="M-16,0 L-12,-110 Q-40,-140 -60,-150 L-50,-160 L-6,-130 L0,-170 L10,-170 L12,-128 L50,-160 L60,-150 Q30,-130 14,-110 L18,0 Z" boja={P.drvo} srafura="srafV" srafuraOp={0.5} debljina={5} />
    <Povrs
      d="M-130,-190 Q-150,-250 -100,-280 Q-100,-340 -30,-344 Q10,-390 70,-350 Q140,-350 136,-280 Q170,-230 120,-180 Q90,-150 30,-164 Q-20,-140 -70,-160 Q-120,-150 -130,-190 Z"
      boja={boja}
      srafura="srafD"
      srafuraOp={0.5}
      debljina={6}
    />
    {[
      [-80, -230],
      [-20, -290],
      [50, -250],
      [90, -300],
      [0, -200],
    ].map(([x, y], i) => (
      <Linija key={i} d={`M${x - 16},${y} Q${x},${y - 12} ${x + 16},${y}`} debljina={4} boja={P.mastilo} opacity={0.8} />
    ))}
  </g>
);

export const Busen: React.FC<{ x: number; y: number; s?: number; boja?: string; op?: number }> = ({ x, y, s = 1, boja = P.mastilo, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <Linija d="M-12,0 L-18,-22 M-4,0 L-4,-30 M4,0 L10,-26 M12,0 L22,-16" debljina={4} boja={boja} />
  </g>
);

export const Trska: React.FC<{ x: number; y: number; s?: number; faza?: number }> = ({ x, y, s = 1, faza = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-20, -6, 8, 20].map((dx, i) => {
      const nag = Math.sin(faza + i) * 6;
      return (
        <g key={i}>
          <Linija d={`M${dx},0 Q${dx + nag / 2},-60 ${dx + nag},-120`} debljina={4} />
          {i % 2 === 0 && <path d={elipsa(dx + nag, -130, 6, 20)} fill={P.drvo} stroke={P.mastilo} strokeWidth={3} />}
        </g>
      );
    })}
  </g>
);

// ── NEBO ────────────────────────────────────────────────────────────────
/** Urezano nebo: vodoravni potezi mastila, gusti i debeli pri vrhu, ređi ka horizontu. */
export const Nebo: React.FC<{ od?: number; do?: number; gustina?: number; op?: number; pomakX?: number; boja?: string }> = ({ od = 60, do: dole = 700, gustina = 1, op = 0.9, pomakX = 0, boja = P.mastilo }) => {
  const redovi: React.ReactNode[] = [];
  let y = od;
  let i = 0;
  while (y < dole) {
    const t = (y - od) / (dole - od);
    const korak = (9 + t * t * 40) / gustina;
    const deb = 7 - t * 5.2;
    const pokrivenost = 1 - t * 0.85;
    const n = 3 + Math.floor(rnd(i, 3) * 3);
    let x = -120 + ((rnd(i, 8) * 200 + pomakX * (1 - t * 0.5)) % 200);
    for (let k = 0; k < n && x < 1200; k++) {
      const duz = (120 + rnd(i * 5 + k, 9) * 420) * pokrivenost + 30;
      redovi.push(<Linija key={`${i}-${k}`} d={`M${x},${y} Q${x + duz / 2},${y - 2 - rnd(i + k, 4) * 4} ${x + duz},${y}`} debljina={deb} opacity={op} boja={boja} />);
      x += duz + 40 + rnd(i * 3 + k, 6) * (160 * t + 30);
    }
    y += korak;
    i++;
  }
  return <g>{redovi}</g>;
};

export const Sunce: React.FC<{ r?: number; boja?: string; zraci?: number }> = ({ r = 70, boja = P.oker, zraci = 1 }) => (
  <g>
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      const r1 = r + 14;
      const r2 = r + 14 + (i % 2 ? 26 : 44) * zraci;
      return <Linija key={i} d={`M${Math.cos(a) * r1},${Math.sin(a) * r1} L${Math.cos(a) * r2},${Math.sin(a) * r2}`} debljina={5} opacity={zraci} />;
    })}
    <Povrs d={elipsa(0, 0, r)} boja={boja} srafura="srafH" srafuraOp={0.35} debljina={6} />
  </g>
);

export const Oblak: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = P.krem }) => (
  <g transform={`scale(${s})`}>
    <Povrs d="M-120,0 Q-130,-40 -80,-44 Q-70,-90 -10,-84 Q30,-120 76,-80 Q130,-84 124,-36 Q150,-4 110,0 Z" boja={boja} srafura="srafH" srafuraOp={0.3} debljina={5} pomak={[3, 2]} mrlja={0.15} />
  </g>
);

export const Ptica: React.FC<{ x: number; y: number; s?: number; mah?: number }> = ({ x, y, s = 1, mah = 0 }) => {
  const k = Math.sin(mah) * 10;
  return <Linija d={`M${x - 20 * s},${y - k * s} Q${x - 8 * s},${y - 4 * s} ${x},${y + 4 * s} Q${x + 8 * s},${y - 4 * s} ${x + 20 * s},${y - k * s}`} debljina={4} />;
};

// ── ZEMLJA ──────────────────────────────────────────────────────────────
/** Ravnica: traka zemlje od horizonta nadole; urezane brazde i vlati sve krupnije ka posmatraču. */
export const Ravnica: React.FC<{ y: number; boja?: string; brazde?: number; op?: number; vlati?: number }> = ({ y, boja = P.trava, brazde = 1, op = 1, vlati = 1 }) => (
  <g opacity={op}>
    <Povrs d={`M-40,${y} Q540,${y - 18} 1120,${y} L1120,2000 L-40,2000 Z`} boja={boja} srafura={false} debljina={6} pomak={[0, 3]} mrlja={0.55} />
    {Array.from({ length: 13 }).map((_, i) => {
      const yy = y + 26 + i * i * 6.5;
      return (
        <Linija
          key={i}
          d={`M${-40 + rnd(i, 2) * 260},${yy} Q540,${yy - 10 - i} ${1120 - rnd(i, 4) * 260},${yy}`}
          debljina={2.5 + i * 0.45}
          opacity={0.6 * brazde}
        />
      );
    })}
    {vlati > 0 &&
      Array.from({ length: 70 }).map((_, i) => {
        const t = rnd(i, 21);
        const yy = y + 120 + t * t * (1960 - y - 120);
        const x = rnd(i, 22) * 1120 - 20;
        const h = 10 + t * t * 60;
        return <Linija key={`v${i}`} d={`M${x},${yy} L${x - h * 0.2},${yy - h} M${x + h * 0.3},${yy} L${x + h * 0.4},${yy - h * 0.8}`} debljina={2 + t * 4} opacity={0.75 * vlati} />;
      })}
  </g>
);

export const Reka: React.FC<{ y: number; faza?: number; boja?: string; suva?: number }> = ({ y, faza = 0, boja = P.voda, suva = 0 }) => (
  <g>
    <Povrs d={`M-40,${y} Q300,${y - 40} 560,${y - 10} Q820,${y + 20} 1120,${y - 20} L1120,${y + 150} Q820,${y + 190} 540,${y + 150} Q260,${y + 110} -40,${y + 160} Z`} boja={suva ? P.suvo : boja} srafura={false} debljina={6} pomak={[3, 3]} />
    {!suva &&
      Array.from({ length: 9 }).map((_, i) => {
        const yy = y + 26 + (i % 3) * 38;
        const x0 = ((i * 137 + faza * 40) % 1200) - 100;
        return <Linija key={i} d={`M${x0},${yy} q20,-8 40,0 t40,0 t40,0`} boja={P.krem} debljina={4} opacity={0.85} />;
      })}
  </g>
);

// ── SALAŠ, OGRADA, TABLA ────────────────────────────────────────────────
export const Salas: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Povrs d="M-150,0 L-150,-110 L150,-110 L150,0 Z" boja={P.belo} srafura={false} debljina={6} pomak={[2, 2]} mrlja={0.2} />
    <Povrs d="M-176,-104 L-110,-200 L110,-200 L176,-104 Z" boja={P.okerTamni} srafura="srafV" srafuraOp={0.75} debljina={6} />
    <Povrs d={kutija(-110, -80, 50, 50, 2)} boja={P.voda} srafura={false} debljina={5} pomak={[2, 1]} />
    <Linija d="M-85,-80 L-85,-30 M-110,-55 L-60,-55" debljina={4} />
    <Povrs d={kutija(40, -86, 56, 86, 2)} boja={P.drvo} srafura="srafV" srafuraOp={0.5} debljina={5} />
    <Povrs d={kutija(-10, -80, 36, 40, 2)} boja={P.voda} srafura={false} debljina={4} pomak={[1, 1]} />
  </g>
);

export const Ograda: React.FC<{ x0: number; x1: number; y: number; visina?: number; napredak?: number; nagib?: number }> = ({ x0, x1, y, visina = 90, napredak = 1, nagib = 0 }) => {
  const n = Math.max(2, Math.round(Math.abs(x1 - x0) / 70));
  const stubovi = Math.ceil((n + 1) * napredak);
  const dx = (x1 - x0) / n;
  const yy = (i: number) => y + nagib * i * dx;
  const kraj = x0 + dx * Math.min(n, Math.max(0, stubovi - 1));
  return (
    <g>
      {stubovi > 1 && (
        <>
          <Linija d={`M${x0},${y - visina * 0.75} L${kraj},${y - visina * 0.75 + nagib * (kraj - x0)}`} debljina={7} />
          <Linija d={`M${x0},${y - visina * 0.35} L${kraj},${y - visina * 0.35 + nagib * (kraj - x0)}`} debljina={7} />
        </>
      )}
      {Array.from({ length: Math.min(n + 1, stubovi) }).map((_, i) => (
        <Povrs key={i} d={`M${x0 + i * dx - 8},${yy(i) + 6} L${x0 + i * dx - 8},${yy(i) - visina} L${x0 + i * dx},${yy(i) - visina - 14} L${x0 + i * dx + 8},${yy(i) - visina} L${x0 + i * dx + 8},${yy(i) + 6} Z`} boja={P.drvo} srafura={false} debljina={4} pomak={[2, 1]} mrlja={0.2} />
      ))}
    </g>
  );
};

export const Tabla: React.FC<{ tekst: string; boja?: string; sirina?: number; font: string }> = ({ tekst, boja = P.belo, sirina = 300, font }) => (
  <g>
    <Linija d="M0,0 L0,-150" debljina={12} boja={P.drvo} />
    <Linija d="M0,0 L0,-150" debljina={4} />
    <Povrs d={kutija(-sirina / 2, -230, sirina, 90, 6)} boja={boja} srafura={false} debljina={6} pomak={[3, 2]} mrlja={0.2} />
    <text x={0} y={-170} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={46} fill={P.mastilo} letterSpacing={2}>
      {tekst}
    </text>
  </g>
);

export const Katanac: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-20,-10 L-20,-34 Q-20,-58 0,-58 Q20,-58 20,-34 L20,-10" fill="none" stroke={P.mastilo} strokeWidth={9} />
    <Povrs d={kutija(-32, -14, 64, 52, 8)} boja={P.oker} srafura="srafD" srafuraOp={0.4} debljina={5} />
    <circle cx={0} cy={8} r={6} fill={P.mastilo} />
  </g>
);

export const Kamen: React.FC<{ s?: number; boja?: string; rot?: number }> = ({ s = 1, boja = P.kamen, rot = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <Povrs d="M-40,0 L-34,-30 L-6,-40 L30,-34 L42,-8 L34,4 Z" boja={boja} srafura="srafD" srafuraOp={0.45} debljina={5} pomak={[2, 2]} />
  </g>
);
