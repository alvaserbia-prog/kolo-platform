// Okvir tuša (video „Potvrda nosi odgovornost“): hrapav akvarel papir ispod i preko svega,
// natpisi četkicom na lavirnoj traci (ispisuju se sleva nadesno), meka vinjeta.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Defs, T } from "./tus";
import { CETKA, SANS } from "../fontovi";

export const AkvarelPozadina: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: T.papir }} />
    <Img src={staticFile("akvarel.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
  </>
);

export const AkvarelPreko: React.FC<{ oznaka: string }> = ({ oznaka }) => (
  <>
    <AbsoluteFill style={{ zIndex: 2100, mixBlendMode: "multiply", opacity: 0.5 }}>
      <Img src={staticFile("akvarel.jpg")} style={{ width: 1080, height: 1920 }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ zIndex: 2101, mixBlendMode: "multiply", background: "radial-gradient(ellipse 85% 70% at 50% 45%, #fff 65%, #e2ddd2 100%)" }} />
    <AbsoluteFill style={{ zIndex: 2150 }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <text x={1040} y={1896} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={22} fill="#8d8a82">
          {oznaka}
        </text>
      </svg>
    </AbsoluteFill>
  </>
);

export type Natpis = { od: number; do: number; redovi: string[]; zelena?: boolean };

export const Natpisi: React.FC<{ natpisi: Natpis[] }> = ({ natpisi }) => {
  const f = useCurrentFrame();
  const n = natpisi.find((x) => f >= x.od && f < x.do);
  if (!n) return null;
  const pis = interpolate(f - n.od, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const izlaz = interpolate(f, [n.do - 10, n.do], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h = 50 + n.redovi.length * 96;
  const y0 = 96;
  const boja = n.zelena ? T.zelena : T.indigo;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - izlaz }}>
      <Defs />
      <defs>
        <clipPath id="natpisPis">
          <rect x={0} y={0} width={80 + pis * 1000} height={1920} />
        </clipPath>
      </defs>
      <path d={`M${70},${y0 + 10} C300,${y0 - 10} 700,${y0 + 14} ${1010},${y0} L${1016},${y0 + h} C700,${y0 + h + 12} 300,${y0 + h - 10} ${64},${y0 + h + 6}Z`} fill={boja} opacity={0.22 * Math.min(1, pis * 3)} filter="url(#akv)" />
      <g clipPath="url(#natpisPis)">
        {n.redovi.map((r, i) => (
          <text key={i} x={540} y={y0 + 92 + i * 96} textAnchor="middle" fontFamily={CETKA} fontSize={96} fill={n.zelena ? T.zelena : T.tus}>
            {r}
          </text>
        ))}
      </g>
    </svg>
  );
};
