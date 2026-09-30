// Okvir naive (video „Poznaješ li nekoga“): platno ispod svega i preko svega (tkanje),
// oslikan okvir slike (plava traka sa belim tačkama i cvetovima u uglovima), natpisi na crvenoj
// traci sa lastinim repom, prelaz „cvet“: stara slika se otvara iz sredine kao krug okružen cvećem.
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cvet, Defs, N } from "./naiva";
import { OBLO, SANS } from "../fontovi";
import { tekuceBrisanje, type Prelaz } from "../Sekvenca";
import type { Plan } from "../vreme";

export const PlatnoPozadina: React.FC = () => <div style={{ position: "absolute", inset: 0, background: N.bela }} />;

export const Platno: React.FC = () => (
  <AbsoluteFill style={{ zIndex: 2100, mixBlendMode: "multiply", opacity: 0.35, backgroundImage: `url(${staticFile("platno.png")})`, backgroundSize: "512px 512px" }} />
);

export const Ram: React.FC<{ oznaka: string }> = ({ oznaka }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    <path d="M0,0 H1080 V1920 H0Z M26,26 H1054 V1894 H26Z" fill={N.plava} fillRule="evenodd" />
    {Array.from({ length: 40 }, (_, i) => (
      <g key={i}>
        <circle cx={40 + i * 26.5} cy={13} r={4} fill={N.bela} />
        <circle cx={40 + i * 26.5} cy={1907} r={4} fill={N.bela} />
      </g>
    ))}
    {Array.from({ length: 72 }, (_, i) => (
      <g key={`v${i}`}>
        <circle cx={13} cy={40 + i * 26.3} r={4} fill={N.bela} />
        <circle cx={1067} cy={40 + i * 26.3} r={4} fill={N.bela} />
      </g>
    ))}
    {[
      [26, 26],
      [1054, 26],
      [26, 1894],
      [1054, 1894],
    ].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={30} fill={N.zuta} stroke={N.kontura} strokeWidth={3} />
        <Cvet x={x} y={y + 6} s={2.2} boja={N.crvena} />
      </g>
    ))}
    <rect x={380} y={1880} width={320} height={34} rx={17} fill={N.bela} />
    <text x={540} y={1904} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} fill={N.plava}>
      {oznaka}
    </text>
  </svg>
);

export type Natpis = { od: number; do: number; redovi: string[]; zelena?: boolean };

export const Natpisi: React.FC<{ natpisi: Natpis[] }> = ({ natpisi }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = natpisi.find((x) => f >= x.od && f < x.do);
  if (!n) return null;
  const s = spring({ frame: f - n.od, fps, config: { damping: 11, stiffness: 120, mass: 0.8 } });
  const izlaz = interpolate(f, [n.do - 8, n.do], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h = 40 + n.redovi.length * 88;
  const y0 = 96;
  const boja = n.zelena ? N.zelena : N.crvena;
  const tamna = n.zelena ? "#135C32" : N.crvenaTamna;
  const val = (x: number) => Math.sin(x / 90 + f / 12) * 6;
  const gore = Array.from({ length: 21 }, (_, i) => `${110 + i * 43},${y0 + val(i * 43)}`).join(" L");
  const dole = Array.from({ length: 21 }, (_, i) => `${970 - i * 43},${y0 + h + val(860 - i * 43)}`).join(" L");
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: Math.min(1, s * 1.5) * (1 - izlaz) }}>
      <Defs />
      <g transform={`translate(540 ${y0 + h / 2}) scale(${0.6 + 0.4 * s}) translate(-540 ${-(y0 + h / 2)})`} filter="url(#nMekoSenka)">
        {/* lastin rep levo i desno */}
        <path d={`M110,${y0 + 30} L40,${y0 + 30} L76,${y0 + h / 2 + 15} L40,${y0 + h + 30} L110,${y0 + h + 30}Z`} fill={tamna} />
        <path d={`M970,${y0 + 30} L1040,${y0 + 30} L1004,${y0 + h / 2 + 15} L1040,${y0 + h + 30} L970,${y0 + h + 30}Z`} fill={tamna} />
        <path d={`M${gore} L${dole}Z`} fill={boja} stroke={N.kontura} strokeWidth={3} />
        <path d={`M${gore}`} fill="none" stroke={N.zuta} strokeWidth={5} strokeDasharray="10 8" transform="translate(0 12)" />
        {n.redovi.map((r, i) => (
          <text key={i} x={540} y={y0 + 80 + i * 88} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={72} fill={N.bela}>
            {r}
          </text>
        ))}
      </g>
    </svg>
  );
};

/** Prelaz „cvet“: stara slika se otvara iz sredine; ivicu kruga prate cvetovi. */
const rCveta = (p: number) => interpolate(p, [0, 1], [0, 1250]);
export const clipCveta = (p: number) => {
  const r = rCveta(p);
  return `path(evenodd, "M0,0 H1080 V1920 H0Z M${540 - r},960 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0Z")`;
};
export const CvetniPrelaz: React.FC<{ plan: Plan; prelazi: Prelaz[] }> = ({ plan, prelazi }) => {
  const f = useCurrentFrame();
  const t = tekuceBrisanje(f, plan, prelazi);
  if (!t || t.p <= 0 || t.p >= 1) return null;
  const r = rCveta(t.p);
  const n = Math.max(8, Math.round(r / 22));
  const boje = [N.crvena, N.zuta, N.bela, N.roze, N.plavaSvetla];
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + t.p * 2;
        return <Cvet key={i} x={540 + Math.cos(a) * r} y={960 + Math.sin(a) * r} s={3.2} boja={boje[i % boje.length]} />;
      })}
    </svg>
  );
};
