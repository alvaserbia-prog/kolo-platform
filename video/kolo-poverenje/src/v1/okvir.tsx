// Okvir otiska (video „Čiji si ti“): papir preko svega, zrno štampe, rub lista i olovkom
// upisana oznaka otiska kao kod grafičara („1/3 · Poverenje“). Natpisi scena su urezani
// u crni blok (slova ostaju boje papira), a scene se smenjuju valjkom sa mastilom.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { L, Defs, urez } from "./linorez";
import { SANS, SLAB } from "../fontovi";
import { tekuceBrisanje, type Prelaz } from "../Sekvenca";
import type { Plan } from "../vreme";

export const PapirPozadina: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: L.papir }} />
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
  </>
);

/** Papir i zrno preko svega. Mešanje (multiply/overlay) mora biti na samom sloju sa z-indeksom,
 *  inače se meša sa praznom pozadinom sopstvenog sloja i samo izbledi kadar. */
export const ListMesanje: React.FC = () => {
  const f = useCurrentFrame();
  const zx = (Math.floor(f / 2) * 37) % 512;
  const zy = (Math.floor(f / 2) * 91) % 512;
  return (
    <>
      <AbsoluteFill style={{ zIndex: 2100, mixBlendMode: "multiply", opacity: 0.45 }}>
        <Img src={staticFile("papir.jpg")} style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 2101, mixBlendMode: "overlay", opacity: 0.3, backgroundImage: `url(${staticFile("zrno.png")})`, backgroundPosition: `${zx}px ${zy}px` }} />
      <AbsoluteFill style={{ zIndex: 2102, mixBlendMode: "multiply", background: "radial-gradient(ellipse 80% 65% at 50% 45%, #fff 62%, #d8cbb6 100%)" }} />
    </>
  );
};

export const List: React.FC<{ oznaka: string }> = ({ oznaka }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {/* rub lista: papir oko otiska */}
    <path d="M0,0 H1080 V1920 H0Z M30,32 L1050,28 L1052,1872 L28,1876Z" fill={L.papir} fillRule="evenodd" />
    <text x={40} y={1904} fontFamily={SANS} fontWeight={700} fontSize={22} fill="#8A8173">
      {oznaka}
    </text>
    <text x={1040} y={1904} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={22} fill="#8A8173">
      linorez · ekolo.rs
    </text>
  </svg>
);

export type Natpis = { od: number; do: number; redovi: string[]; zelena?: boolean };

export const Natpisi: React.FC<{ natpisi: Natpis[] }> = ({ natpisi }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = natpisi.find((x) => f >= x.od && f < x.do);
  if (!n) return null;
  const s = spring({ frame: Math.floor((f - n.od) / 2) * 2, fps, config: { damping: 16, stiffness: 260, mass: 0.7 } });
  const izlaz = interpolate(f, [n.do - 6, n.do], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visina = 44 + n.redovi.length * 96;
  const y0 = 92;
  const blok = n.zelena ? L.zelena : L.mastilo;
  const k = 1 + (1 - Math.min(1, s)) * 0.25;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: Math.min(1, s * 2) * (1 - izlaz) }}>
      <Defs />
      <g transform={`translate(540 ${y0 + visina / 2}) scale(${k}) translate(-540 ${-(y0 + visina / 2)})`}>
        <g filter="url(#rez1)">
          <rect x={86} y={y0} width={908} height={visina} fill={blok} />
          <rect x={86} y={y0} width={908} height={visina} fill="url(#trunje)" opacity={0.5} />
          <path d={`${urez(110, y0 + visina - 18, 970, y0 + visina - 22, 5)} ${urez(110, y0 + 16, 970, y0 + 14, 3)}`} fill={L.papir} opacity={0.6} />
        </g>
        {n.redovi.map((r, i) => (
          <text key={i} x={540} y={y0 + 100 + i * 96} textAnchor="middle" fontFamily={SLAB} fontSize={78} fill={L.papir} letterSpacing={1}>
            {r}
          </text>
        ))}
        <rect x={380} y={y0 + visina + 12} width={320} height={12} fill={L.crvena} />
      </g>
    </svg>
  );
};

/** Valjak sa mastilom koji prelazi preko lista odozgo nadole (prelaz „brisanje“). */
export const Valjak: React.FC<{ plan: Plan; prelazi: Prelaz[] }> = ({ plan, prelazi }) => {
  const f = useCurrentFrame();
  const t = tekuceBrisanje(f, plan, prelazi);
  if (!t) return null;
  const y = yValjka(t.p);
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      {/* sveže mastilo iznad valjka */}
      <rect x={0} y={y - 60} width={1080} height={60} fill={L.mastilo} opacity={0.18} />
      <g filter="url(#mekoSenka)">
        <rect x={-20} y={y - 38} width={1120} height={80} rx={40} fill={L.mastilo} />
        <rect x={-20} y={y - 26} width={1120} height={14} rx={7} fill="#5a524a" opacity={0.7} />
        <rect x={-20} y={y - 38} width={1120} height={80} rx={40} fill="url(#trunje)" opacity={0.25} />
      </g>
    </svg>
  );
};

export const yValjka = (p: number) => interpolate(p, [0, 1], [-60, 1980]);
/** Stara scena ostaje vidljiva samo ispod valjka. */
export const clipValjka = (p: number) => {
  const y = yValjka(p);
  return `polygon(0px ${y.toFixed(0)}px, 1080px ${y.toFixed(0)}px, 1080px 1920px, 0px 1920px)`;
};
