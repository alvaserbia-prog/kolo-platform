// Zajednička sveska (iz videa 15 „Trampa“) i zapis u KOLU. Sveska je otvorena knjiga sa redovima
// „ko · dao · šta“ ispisanim rukom; u sceni 9 zaglavlje postaje „ZAPIS U KOLU“, a uz svaki red
// stane zeleni žig POEN. POEN je samo zapis u svesci, nikad novčić.
import React from "react";
import { P } from "./paleta";
import { RUKOPIS, SANS } from "./fontovi";
import { Linija, Oblik, kutija } from "./alat";

export type RedSveske = { ko: string; dao: string; sta: string };

export const REDOVI_SVESKE: RedSveske[] = [
  { ko: "obućar", dao: "dao", sta: "cipele" },
  { ko: "Milica", dao: "dala", sta: "ajvar" },
  { ko: "Stevan", dao: "dao", sta: "drva" },
];

/** Otvorena sveska, sredina hrpta u (0,0); w×h ukupno. `pisanje[i]` 0–1 ispisuje red i, `zig[i]` 0–1 pečat POEN. */
export const Sveska: React.FC<{
  w?: number;
  h?: number;
  redovi?: RedSveske[];
  pisanje?: number[];
  zig?: number[];
  kolo?: number; // 0–1: zaglavlje prelazi u „ZAPIS U KOLU“
  prazanRed?: number; // 0–1: poslednji, prazan red „ti“
  pero?: number; // 0–1 vidljivost pera na praznom redu
  f?: number;
}> = ({ w = 920, h = 640, redovi = REDOVI_SVESKE, pisanje = [], zig = [], kolo = 0, prazanRed = 0, pero = 0, f = 0 }) => {
  const x0 = -w / 2;
  const y0 = -h / 2;
  const red0 = y0 + 190;
  const korak = 112;
  return (
    <g>
      {/* senka i korice */}
      <Oblik d={kutija(x0 + 16, y0 + 22, w, h, 18)} boja={P.senka} ivica={false} opacity={0.3} tekstura={0} />
      <Oblik d={kutija(x0 - 14, y0 - 10, w + 28, h + 24, 18)} boja={kolo > 0.5 ? P.zelena700 : "#7A4E2E"} debljina={4.5} tekstura={0.3} />
      {/* listovi */}
      <Oblik d={`M${x0},${y0} C${x0 + w * 0.2},${y0 - 14} ${-30},${y0 - 6} 0,${y0 + 8} L0,${y0 + h} C-30,${y0 + h - 12} ${x0 + w * 0.2},${y0 + h - 18} ${x0},${y0 + h}Z`} boja={P.belo} debljina={3.5} tekstura={0.14} />
      <Oblik d={`M${-x0},${y0} C${-x0 - w * 0.2},${y0 - 14} 30,${y0 - 6} 0,${y0 + 8} L0,${y0 + h} C30,${y0 + h - 12} ${-x0 - w * 0.2},${y0 + h - 18} ${-x0},${y0 + h}Z`} boja={P.belo} debljina={3.5} tekstura={0.14} />
      <path d={`M0,${y0 + 8} L0,${y0 + h}`} stroke={P.senka} strokeWidth={10} opacity={0.18} />
      {/* linije */}
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i} opacity={0.35}>
          <line x1={x0 + 30} y1={red0 + 20 + i * korak} x2={-24} y2={red0 + 20 + i * korak} stroke={P.plava} strokeWidth={2} />
          <line x1={24} y1={red0 + 20 + i * korak} x2={-x0 - 30} y2={red0 + 20 + i * korak} stroke={P.plava} strokeWidth={2} />
        </g>
      ))}
      <line x1={x0 + 120} y1={y0 + 30} x2={x0 + 120} y2={y0 + h - 20} stroke={P.ajvar} strokeWidth={2} opacity={0.4} />
      {/* zaglavlje */}
      <g opacity={1 - kolo}>
        <text x={0} y={y0 + 96} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={58} fill={P.mastilo}>
          ko je šta dao
        </text>
      </g>
      {kolo > 0 && (
        <g opacity={kolo} transform={`translate(0 ${y0 + 90}) scale(${0.8 + 0.2 * kolo})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={50} letterSpacing={6} fill={P.zelena700}>
            ZAPIS U KOLU
          </text>
          <line x1={-230} y1={22} x2={230} y2={22} stroke={P.zelena700} strokeWidth={4} opacity={0.6} />
        </g>
      )}
      {/* redovi: ime levo, „dao · šta“ desno */}
      {redovi.map((r, i) => {
        const p = pisanje[i] ?? 1;
        if (p <= 0) return null;
        const y = red0 + i * korak;
        const levo = r.ko;
        const desno = `${r.dao} ${r.sta}`;
        const n = levo.length + desno.length;
        const k = Math.floor(p * n);
        const z = zig[i] ?? 0;
        return (
          <g key={i}>
            <text x={x0 + 140} y={y} fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={P.mastilo}>
              {levo.slice(0, k)}
            </text>
            <text x={40} y={y} fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={P.mastilo}>
              {desno.slice(0, Math.max(0, k - levo.length))}
            </text>
            {z > 0 && (
              <g transform={`translate(${-x0 - 92} ${y - 20}) rotate(${-8 + (1 - z) * 20}) scale(${0.5 + 0.5 * z + (1 - z) * 0.8})`} opacity={Math.min(1, z * 1.6)}>
                <rect x={-74} y={-34} width={148} height={64} rx={12} fill={P.zelena100} stroke={P.zelena700} strokeWidth={6} />
                <text x={0} y={16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={42} letterSpacing={2} fill={P.zelena700}>
                  POEN
                </text>
              </g>
            )}
          </g>
        );
      })}
      {prazanRed > 0 && (
        <g opacity={Math.min(1, prazanRed * 1.5)}>
          <text x={x0 + 140} y={red0 + redovi.length * korak} fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={P.zelena700}>
            ti
          </text>
          <Linija d={`M40,${red0 + redovi.length * korak + 8} L${-x0 - 60},${red0 + redovi.length * korak + 8}`} boja={P.zelena700} debljina={4} napredak={prazanRed} opacity={0.7} />
          {pero > 0 && (
            <g transform={`translate(${200 + ((f / 3) % 18)} ${red0 + redovi.length * korak - 4 + Math.sin(f / 4) * 4}) rotate(30)`} opacity={pero}>
              <path d="M0,0 L-8,-18 L-8,-150 L8,-150 L8,-18Z" fill={P.zelena700} stroke={P.mastilo} strokeWidth={3} strokeLinejoin="round" />
              <path d="M-8,-130 L8,-130" stroke={P.zlatna} strokeWidth={6} />
            </g>
          )}
        </g>
      )}
    </g>
  );
};
