// Natpisi iz scenarija (krupno, u vrhu kadra, na kartuši kao u staroj slikovnici). Razumeju se i
// bez zvuka. Redovi mogu da se otkrivaju jedan po jedan, sa izgovorenom rečju.
// Scena 11 („ekolo.rs · čista ušteda“) crta sama završna scena. Do izlaska sunca kartuša je hladna.
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P } from "./paleta";
import { NASLOV } from "./fontovi";
import { kad, scena } from "./vreme";

type N = { od: number; do: number; redovi: string[]; otkrij?: number[]; hladno?: boolean };

const glob = (id: number, rec: string, pojava = 1) => scena(id).odF + kad(id, rec, pojava);
const kraj = (id: number) => scena(id).doF - 6;

// Natpisa u ovom videu nema (odluka vlasnika 03.10.2026): govore titl i slika.
export const NASLOVI: N[] = [];

const Kartusa: React.FC<{ n: N; s: number; izlaz: number }> = ({ n, s, izlaz }) => {
  const f = useCurrentFrame();
  const tri = n.redovi.length > 2;
  const korak = tri ? 84 : 98;
  const sirina = 900;
  const visina = 70 + n.redovi.length * korak;
  const x0 = 540 - sirina / 2;
  const y0 = 110;
  return (
    <svg
      viewBox="0 0 1080 1920"
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        inset: 0,
        opacity: Math.min(1, s * 1.4) * (1 - izlaz),
        transform: `translateY(${(1 - s) * -40 - izlaz * 30}px) rotate(${(1 - s) * -3}deg)`,
        transformOrigin: "540px 200px",
        filter: "drop-shadow(0 8px 10px rgba(58,42,29,0.28))",
      }}
    >
      <rect x={x0} y={y0} width={sirina} height={visina} rx={26} fill={n.hladno ? "#EEF0EC" : P.krem} stroke={P.mastilo} strokeWidth={4} />
      <rect x={x0 + 12} y={y0 + 12} width={sirina - 24} height={visina - 24} rx={18} fill="none" stroke={n.hladno ? P.plava : P.vez} strokeWidth={2.5} strokeDasharray="10 6" />
      {/* ukrasi sa strane */}
      {[x0 - 4, x0 + sirina + 4].map((xx, i) => (
        <g key={i} transform={`translate(${xx} ${y0 + visina / 2}) scale(${i ? -1 : 1} 1)`}>
          <path d="M0,0 C-26,-30 -60,-20 -64,0 C-60,20 -26,30 0,0Z" fill={n.hladno ? P.plava : P.vez} stroke={P.mastilo} strokeWidth={3} />
          <circle cx={-40} cy={0} r={7} fill={P.krem} />
        </g>
      ))}
      {n.redovi.map((r, i) => (
        <text
          key={i}
          x={540}
          y={y0 + (tri ? 100 : 108) + i * korak}
          textAnchor="middle"
          fontFamily={NASLOV}
          fontStyle="italic"
          fontWeight={900}
          fontSize={tri ? 70 : n.redovi.some((r) => r.length > 19) ? 70 : 80}
          opacity={n.otkrij ? interpolate(f, [n.otkrij[i], n.otkrij[i] + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1}
          fill={n.hladno ? P.teget : P.mastilo}
          letterSpacing={-0.5}
        >
          {r}
        </text>
      ))}
      {/* tanka linija koja se „iscrta“ ispod teksta */}
      <path
        d={`M${540 - sirina * 0.28},${y0 + visina - 30} Q540,${y0 + visina - 22} ${540 + sirina * 0.28},${y0 + visina - 30}`}
        fill="none"
        stroke={n.hladno ? P.plava : P.ajvar}
        strokeWidth={4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - interpolate(f - n.od, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}
      />
    </svg>
  );
};

export const Naslovi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = NASLOVI.find((x) => f >= x.od && f < x.do);
  if (!n) return null;
  const s = spring({ frame: f - n.od, fps, config: { damping: 11, stiffness: 150, mass: 0.8 } });
  const izlaz = interpolate(f, [n.do - 8, n.do], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Kartusa n={n} s={s} izlaz={izlaz} />;
};
