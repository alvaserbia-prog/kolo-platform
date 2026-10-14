// Zajedničko za scene videa 19: Đurina kuhinja (sto, kasa, sveska), ulaz zgrade sa tablom, prelaz
// unutar scene (rez na reč), stan Đure (vrata u ulazu).
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { SANS } from "../fontovi";
import { Hrapavo, Oblik, kutija } from "../alat";
import { Kuhinja } from "../pozadine";
import { Sto } from "../predmeti";
import { OglasnaTabla, Rajsnegla, SveskaKase, Ulaz } from "../zgrada";

/** Vidljivost druge polovine scene: rez sa kratkim pretapanjem oko frejma `k`. */
export const rez = (f: number, k: number, d = 6) => interpolate(f, [k - d, k + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Kuhinja sa zidom i podom (bez stola, sto se crta ispred likova). */
export const KuhinjaPozadina: React.FC = () => (
  <Hrapavo>
    <Kuhinja sezona="jesen" bezPolice policaTegle={0} cilim={false} />
  </Hrapavo>
);

/** Sto ispred Đure: gornja ivica ploče na y≈1110. */
export const StoKuhinja: React.FC = () => (
  <g transform="translate(540 1120)">
    <Sto w={900} h={180} />
  </g>
);

/** Vrata Đurinog stana u ulazu (stan 3), levo-gore ivica (x, y). */
export const VrataStana: React.FC<{ x?: number; y?: number; otvor?: number }> = ({ x = 700, y = 560, otvor = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Oblik d={kutija(-14, -14, 208, 704, 6)} boja={P.drvoTamno} debljina={4} tekstura={0.3} />
    {otvor > 0 && <rect x={0} y={0} width={180} height={690} fill="#3A2A1D" />}
    <g transform={`scale(${1 - otvor * 0.8} 1)`}>
      <Oblik d={kutija(0, 0, 180, 690, 4)} boja="#A0673F" debljina={4} tekstura={0.35} />
      <Oblik d={kutija(24, 30, 132, 280, 4)} boja="#94603A" debljina={3} tekstura={0.3} />
      <Oblik d={kutija(24, 350, 132, 300, 4)} boja="#94603A" debljina={3} tekstura={0.3} />
      <circle cx={150} cy={340} r={11} fill={P.oker} stroke={P.mastilo} strokeWidth={3} />
      <Oblik d={kutija(60, -6, 60, 30, 4)} boja={P.belo} debljina={2.5} tekstura={0} />
      <text x={90} y={17} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill={P.mastilo}>
        3
      </text>
    </g>
  </g>
);

/** Položaj table u širokom kadru ulaza (gornja leva tačka), veličina i položaj sveske na njoj. */
export const TABLA = { x: 220, y: 410, w: 640, h: 420 };
export const SVESKA_NA_TABLI = { x: TABLA.x + 252, y: TABLA.y + 252, s: 0.62 };

/**
 * Široki kadar ulaza sa oglasnom tablom. `sveska` 0–1 (0 = nema sveske na tabli), ostalo prosleđuje
 * svesci (redovi, isticanje, dodatni red, zbir).
 */
export const UlazSaTablom: React.FC<{
  sveska?: number;
  svetlo?: number;
  vrata?: boolean;
  sveskaProps?: React.ComponentProps<typeof SveskaKase>;
  nadSveskom?: React.ReactNode;
}> = ({ sveska = 0, svetlo = 0.4, vrata = true, sveskaProps, nadSveskom }) => (
  <g>
    <Hrapavo>
      <Ulaz svetlo={svetlo} />
      {vrata && <VrataStana x={880} y={560} />}
    </Hrapavo>
    <g transform={`translate(${TABLA.x} ${TABLA.y})`}>
      <OglasnaTabla w={TABLA.w} h={TABLA.h} svetlo={svetlo > 0.6 ? 1 : 0} />
    </g>
    {sveska > 0 && (
      <g transform={`translate(${SVESKA_NA_TABLI.x} ${SVESKA_NA_TABLI.y}) scale(${SVESKA_NA_TABLI.s})`} opacity={Math.min(1, sveska * 3)}>
        <SveskaKase {...sveskaProps} />
        {[-360, 360].map((x) => (
          <g key={x} transform={`translate(${x} -240) scale(${1.4 * Math.min(1, Math.max(0, sveska * 2 - 1))})`}>
            <Rajsnegla boja={x < 0 ? P.ajvar : P.plava} />
          </g>
        ))}
        {nadSveskom}
      </g>
    )}
  </g>
);
