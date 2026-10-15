// Trg odozgo: seljani sa fenjerima stoje u krugu, uhvaćeni za ruke (kolo odozgo). Svaki fenjer je jedno
// svetlo; krug se polako okreće. Koristi se u scenama 7 i 9.
import React from "react";
import { P } from "../paleta";
import { N } from "../noc";

const BOJE = [P.ajvar, P.plava, P.oker, P.zelenaPrigusena, P.roze, P.pekmez, P.teget, P.senf, P.haljina, P.drvo];
const KOSA = [P.kosaTamna, P.kosaSeda, P.kosaSmedja, P.ajvar, P.kosaRida];

export const KRUG = { cx: 540, cy: 760, r: 330, n: 10 };

export const tackaKruga = (i: number, ugao: number, r = KRUG.r): [number, number] => {
  const a = ((ugao + (360 * i) / KRUG.n) * Math.PI) / 180;
  return [KRUG.cx + Math.cos(a) * r, KRUG.cy + Math.sin(a) * r];
};

export const KrugOdozgo: React.FC<{ ugao: number; f: number; pojava?: number; centar?: React.ReactNode; niti?: React.ReactNode }> = ({ ugao, f, pojava = 1, centar, niti }) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2600} fill={N.zemlja} />
    <g opacity={0.3}>
      {Array.from({ length: 160 }, (_, i) => (
        <ellipse key={i} cx={((i * 151) % 1240) - 80} cy={((i * 263) % 1900) + 10} rx={32} ry={22} fill="none" stroke={N.kamen} strokeWidth={3} />
      ))}
    </g>
    {/* svetlo fenjera na kaldrmi */}
    {Array.from({ length: KRUG.n }, (_, i) => {
      const [x, y] = tackaKruga(i, ugao, KRUG.r + 70);
      return <circle key={i} cx={x} cy={y} r={260} fill="url(#plamen)" opacity={0.5 * Math.min(1, Math.max(0, pojava * KRUG.n - i))} />;
    })}
    <circle cx={KRUG.cx} cy={KRUG.cy} r={KRUG.r + 40} fill="url(#toplaSvetlost)" opacity={0.6 * pojava} />
    {niti}
    {centar}
    {/* ruke: prsten */}
    <circle cx={KRUG.cx} cy={KRUG.cy} r={KRUG.r} fill="none" stroke={P.mastilo} strokeWidth={26} opacity={pojava} />
    <circle cx={KRUG.cx} cy={KRUG.cy} r={KRUG.r} fill="none" stroke={P.koza} strokeWidth={14} opacity={pojava} />
    {/* ljudi odozgo: ramena i glava, fenjer spolja */}
    {Array.from({ length: KRUG.n }, (_, i) => {
      const p = Math.min(1, Math.max(0, pojava * KRUG.n - i));
      if (p <= 0) return null;
      const a = ugao + (360 * i) / KRUG.n;
      const [x, y] = tackaKruga(i, ugao);
      const [fx, fy] = tackaKruga(i, ugao, KRUG.r + 92);
      const skok = 1 + Math.abs(Math.sin(f / 7 + i * 1.3)) * 0.05;
      return (
        <g key={i} opacity={p}>
          <g transform={`translate(${x} ${y}) rotate(${a + 90}) scale(${skok})`}>
            <ellipse rx={58} ry={34} fill={BOJE[i % BOJE.length]} stroke={P.mastilo} strokeWidth={4} />
            <circle r={26} fill={KOSA[i % KOSA.length]} stroke={P.mastilo} strokeWidth={4} />
          </g>
          <circle cx={fx} cy={fy} r={20} fill="#FFE6A0" stroke={P.mastilo} strokeWidth={3} />
          <circle cx={fx} cy={fy} r={8} fill="#FFF8E0" />
        </g>
      );
    })}
  </g>
);
