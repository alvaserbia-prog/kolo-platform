// Sc. 7 — „Zajednički pašnjaci u švajcarskim Alpima traju već vekovima. Kanali za navodnjavanje u Španiji takođe.“
// Karta zapadne Evrope u drvorezu (obala iz grubih koordinata, projekcija 32 px po stepenu dužine,
// 45 po stepenu širine). Na izgovorene reči se pale zelene tačke: Terbel (Valais) i Valensija,
// a iz svake se otvara medaljon: planinski pašnjak sa kravama i bašte sa kanalima za navodnjavanje.
import React from "react";
import { Easing } from "remotion";
import { Hrapavo, Kadar, Linija, Povrs, dah, elipsa, kutija, mesaj, napredak, useF } from "../alat";
import { P } from "../paleta";
import { Covek, Krava, Nebo, Ravnica } from "../motivi";
import { SERIF } from "../fontovi";
import { kad, trajanjeF } from "../vreme";

export const KOPNO = "M82,940 L124,908 L220,918 L322,922 L342,868 L342,796 L310,756 L236,720 L230,688 L284,679 L329,683 L319,638 L342,652 L386,648 L431,612 L441,580 L476,567 L508,540 L534,495 L598,472 L655,450 L665,400 L687,400 L700,422 L729,445 L780,427 L834,450 L908,422 L972,409 L1039,422 L1039,1084 L1001,1062 L1004,994 L972,967 L924,931 L889,908 L860,868 L838,837 L818,818 L774,837 L777,877 L815,918 L834,962 L892,1008 L956,1048 L972,1070 L927,1120 L911,1147 L895,1165 L879,1165 L882,1106 L879,1070 L828,1039 L780,1008 L735,967 L706,900 L662,877 L620,904 L578,935 L534,922 L482,940 L482,976 L476,994 L409,1030 L380,1080 L370,1102 L386,1129 L358,1183 L313,1224 L239,1224 L201,1255 L175,1219 L143,1201 L95,1210 L98,1134 L76,1102 L102,1044 L95,985 Z";
export const OSTRVA = ["M198,620 L268,612 L425,571 L434,503 L386,468 L364,422 L332,387 L284,387 L271,427 L284,472 L233,477 L246,522 L210,544 L278,562 Z", "M60,553 L182,526 L188,450 L204,418 L156,387 L111,391 L60,436 L63,472 Z", "M655,945 L681,940 L684,1012 L662,1003 Z", "M642,1034 L694,1034 L687,1116 L649,1120 Z", "M777,1160 L879,1152 L863,1224 L783,1183 Z", "M457,1093 L489,1084 L482,1106 L463,1102 Z"];
const TERBEL: [number, number] = [631, 794];
const VALENSIJA: [number, number] = [368, 1099];

const Medaljon: React.FC<{ id: string; x: number; y: number; r: number; s: number; natpis: string; children: React.ReactNode }> = ({ id, x, y, r, s, natpis, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
    <defs>
      <clipPath id={id}>
        <circle r={r} />
      </clipPath>
    </defs>
    <circle r={r + 14} fill={P.mastilo} />
    <g clipPath={`url(#${id})`}>
      <rect x={-r} y={-r} width={2 * r} height={2 * r} fill={P.papir} />
      {children}
    </g>
    <circle r={r} fill="none" stroke={P.krem} strokeWidth={4} opacity={0.8} />
    <g transform={`translate(0 ${r + 50})`}>
      <path d={kutija(-natpis.length * 11.5 - 24, -36, natpis.length * 23 + 48, 58, 6)} fill={P.belo} stroke={P.mastilo} strokeWidth={5} />
      <text y={6} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={38} fill={P.mastilo}>
        {natpis}
      </text>
    </g>
  </g>
);

export const Scena7: React.FC = () => {
  const f = useF();
  const T = trajanjeF(7);
  const tAlp = kad(7, "švajcarskim") - 4;
  const tSp = kad(7, "Španiji") - 4;
  const mapa = napredak(f, 0, 14, Easing.out(Easing.cubic));
  const m1 = napredak(f, tAlp + 4, 16, Easing.out(Easing.back(1.6)));
  const m2 = napredak(f, tSp + 4, 16, Easing.out(Easing.back(1.6)));
  const z = mesaj(1.0, 1.04, napredak(f, 0, T));
  const Tacka: React.FC<{ p: [number, number]; at: number }> = ({ p, at }) => {
    const t = napredak(f, at, 10, Easing.out(Easing.back(2)));
    if (t <= 0) return null;
    return (
      <g transform={`translate(${p[0]} ${p[1]})`}>
        <circle r={60 + 10 * dah(f, 20)} fill="url(#zeleniSjaj)" />
        <circle r={20 * t} fill={P.zelena500} stroke={P.mastilo} strokeWidth={5} />
        <circle r={7 * t} fill={P.krem} />
      </g>
    );
  };
  return (
    <Kadar>
      <g transform={`translate(540 850) scale(${z}) translate(-540 -850)`}>
        <Hrapavo>
          {/* more: urezane talasaste linije */}
          {Array.from({ length: 34 }).map((_, i) => (
            <Linija key={i} d={`M-20,${360 + i * 30} q30,-8 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0`} debljina={2.2} opacity={0.3 * mapa} />
          ))}
          <g opacity={mapa}>
            {OSTRVA.map((d, i) => (
              <Povrs key={i} d={d} boja={P.okerSvetli} srafura="srafRedak" srafuraOp={0.3} debljina={4} pomak={[4, 3]} />
            ))}
            <Povrs d={KOPNO} boja={P.okerSvetli} srafura="srafRedak" srafuraOp={0.3} debljina={5} pomak={[5, 4]} />
            {/* Alpi */}
            {[
              [560, 790], [600, 770], [640, 780], [680, 770], [720, 760], [760, 770], [800, 780], [590, 820], [700, 800],
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path d="M-26,14 L0,-22 L26,14 Z" fill={P.kamenTamni} stroke={P.mastilo} strokeWidth={3} />
                <path d="M-8,-10 L0,-22 L8,-10 L2,-12 Z" fill={P.krem} />
              </g>
            ))}
            {/* Pirineji */}
            {[[260, 925], [300, 930], [340, 928]].map(([x, y], i) => (
              <path key={i} transform={`translate(${x} ${y})`} d="M-22,12 L0,-16 L22,12 Z" fill={P.kamenTamni} stroke={P.mastilo} strokeWidth={3} />
            ))}
          </g>
        </Hrapavo>
        <Tacka p={TERBEL} at={tAlp} />
        <Tacka p={VALENSIJA} at={tSp} />
        {/* niti do medaljona */}
        <Linija d={`M${TERBEL[0]},${TERBEL[1]} Q${780},${700} ${820},${600}`} debljina={5} napredak={m1} dash="12 10" />
        <Linija d={`M${VALENSIJA[0]},${VALENSIJA[1]} Q${200},${1020} ${230},${880}`} debljina={5} napredak={m2} dash="12 10" />
        {m1 > 0 && (
          <Medaljon id="alpi" x={820} y={560} r={150} s={m1} natpis="Terbel, Švajcarska">
            <Nebo od={-150} do={-20} gustina={1.6} op={0.8} pomakX={f * 0.4} />
            <Povrs d="M-170,10 L-90,-90 L-40,-40 L20,-120 L100,-30 L170,-80 L170,40 L-170,40 Z" boja={P.kamenTamni} srafura="srafD" srafuraOp={0.4} debljina={5} />
            <path d="M-110,-64 L-90,-90 L-72,-66 Z M4,-100 L20,-120 L38,-98 Z M150,-66 L170,-80 L170,-60 Z" fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
            <g transform="translate(0 -60)">
              <Ravnica y={70} boja={P.trava} vlati={0.4} />
            </g>
            <g transform="translate(-50 90)">
              <Krava s={0.42} glavaDole={0.5 + 0.5 * dah(f, 60)} />
            </g>
            <g transform="translate(70 70)">
              <Krava s={0.3} smer={-1} glavaDole={0.5 + 0.5 * dah(f, 80, 20)} />
            </g>
            <g transform="translate(100 20)">
              <Povrs d="M-30,0 L-30,-30 L0,-50 L30,-30 L30,0 Z" boja={P.drvo} srafura="srafV" srafuraOp={0.5} debljina={4} />
            </g>
          </Medaljon>
        )}
        {m2 > 0 && (
          <Medaljon id="valensija" x={230} y={740} r={150} s={m2} natpis="Valensija, Španija">
            <Nebo od={-150} do={-60} gustina={1.6} op={0.8} pomakX={f * 0.4 + 300} />
            <Povrs d="M-170,-60 L170,-60 L170,170 L-170,170 Z" boja={P.zemljaSvetla} srafura="srafRedak" srafuraOp={0.3} debljina={5} pomak={[0, 2]} />
            {/* kanali: voda teče */}
            {[-20, 50, 120].map((y, i) => (
              <g key={i}>
                <Povrs d={`M-170,${y} L170,${y - 20} L170,${y - 4} L-170,${y + 16} Z`} boja={P.voda} srafura={false} debljina={4} pomak={[1, 1]} />
                <Linija d={`M${-170 + ((f * 3 + i * 40) % 80)},${y + 6} l30,-2`} boja={P.krem} debljina={3} />
                <Linija d={`M${-40 + ((f * 3 + i * 40) % 80)},${y + 1} l30,-2`} boja={P.krem} debljina={3} />
              </g>
            ))}
            {/* narandže */}
            {[-120, -40, 40, 120].map((x, i) => (
              <g key={i} transform={`translate(${x} ${-20 - i * 5})`}>
                <Linija d="M0,0 L0,-24" debljina={5} />
                <Povrs d={elipsa(0, -40, 28, 22)} boja={P.travaTamna} srafura="srafD" srafuraOp={0.3} debljina={4} pomak={[2, 1]} />
                <circle cx={-8} cy={-40} r={5} fill={P.oker} />
                <circle cx={10} cy={-34} r={5} fill={P.oker} />
              </g>
            ))}
            <g transform="translate(-60 160)">
              <Covek tip="m" boja={P.oker} s={0.5} ruke={[60, -10]} predmet="lopata" />
            </g>
          </Medaljon>
        )}
      </g>
    </Kadar>
  );
};
