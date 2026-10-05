// Likovi naive (preuzeto iz videa „Poznaješ li nekoga“, dopunjeno kapama za video „Poljoprivrednici“): lutke obla lica, rumenih obraza, sa cvetnom odećom. Stopala u (0,0), visina ~520.
// Ruke: ugao 0° = visi, 90° = pruža se udesno (sa tačke gledaoca), 180° = gore.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Boja, N, elipsa } from "./naiva";

export type Izraz = "osmeh" | "srecna" | "zamisljena" | "iznenadjena" | "mirna";
export type Kosa = "pletenica" | "punda" | "kratka" | "rep";
export type Odeca = { tip: "zena"; bluza: string; suknja: string; kecelja?: string; sara?: string } | { tip: "muskarac"; kosulja: string; pantalone: string; prsluk?: string };
/** Video „Poljoprivrednici“: svi likovi 15% krupniji nego u prvoj verziji (vlasnik, 05.10.2026: „često mi deluju male“). */
export const LIK = 1.15;

export type Kapa = "sesir" | "sajkaca" | "marama";
export type LutkaCfg = { odeca: Odeca; kosa: Kosa; bojaKose: string; brkovi?: boolean; seed: number; kapa?: Kapa; bojaKape?: string };

const rad = (a: number) => (a * Math.PI) / 180;

const Ruka: React.FC<{ sx: number; sy: number; a1: number; a2: number; boja: string; drzi?: React.ReactNode; drziRot?: number }> = ({ sx, sy, a1, a2, boja, drzi, drziRot = 0 }) => {
  const ex = sx + Math.sin(rad(a1)) * 92;
  const ey = sy + Math.cos(rad(a1)) * 92;
  const hx = ex + Math.sin(rad(a1 + a2)) * 86;
  const hy = ey + Math.cos(rad(a1 + a2)) * 86;
  const d = `M${sx},${sy} L${ex.toFixed(1)},${ey.toFixed(1)} L${hx.toFixed(1)},${hy.toFixed(1)}`;
  return (
    <g>
      <path d={d} fill="none" stroke={N.kontura} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={boja} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <Boja d={elipsa(hx, hy, 15)} boja={N.koza} debljina={2.5} />
      {drzi && <g transform={`translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${drziRot})`}>{drzi}</g>}
    </g>
  );
};

export const Lutka: React.FC<
  LutkaCfg & {
    x: number;
    y: number;
    s?: number;
    lr?: [number, number];
    dr?: [number, number];
    hod?: number;
    nagib?: number;
    glavaNagib?: number;
    izraz?: Izraz;
    pogled?: [number, number];
    usta?: number;
    drziL?: React.ReactNode;
    drziD?: React.ReactNode;
    drziLRot?: number;
    drziDRot?: number;
    opacity?: number;
  }
> = ({ x, y, s = 1, odeca, kosa, bojaKose, brkovi, seed, kapa, bojaKape = N.drvoTamno, lr = [14, 10], dr = [-14, -10], hod, nagib = 0, glavaNagib = 0, izraz = "osmeh", pogled = [0, 0], usta = 0, drziL, drziD, drziLRot, drziDRot, opacity = 1 }) => {
  const f = useCurrentFrame();
  const njihanje = hod === undefined ? Math.sin((f + seed * 17) / 26) * 1.5 : Math.sin(hod) * 3;
  const odskok = hod === undefined ? 0 : -Math.abs(Math.sin(hod)) * 10;
  const noge = hod === undefined ? 0 : Math.sin(hod) * 16;
  const trep = (f + seed * 41) % 130 < 4;
  const [gx, gy] = pogled;
  const rukav = odeca.tip === "zena" ? odeca.bluza : odeca.kosulja;
  const noga = (st: number, ug: number) => (
    <g key={st} transform={`translate(${st * 26} -150) rotate(${ug})`}>
      <path d="M0,0 L0,136" stroke={N.kontura} strokeWidth={odeca.tip === "muskarac" ? 40 : 22} strokeLinecap="round" />
      <path d="M0,0 L0,136" stroke={odeca.tip === "muskarac" ? odeca.pantalone : N.koza} strokeWidth={odeca.tip === "muskarac" ? 34 : 16} strokeLinecap="round" />
      <Boja d="M-16,130 C-18,150 0,154 24,152 C34,150 32,136 20,130Z" boja={N.crvenaTamna} debljina={2.5} />
    </g>
  );
  let ustaD = "M-16,26 Q0,40 16,26";
  if (izraz === "srecna") ustaD = "M-20,22 Q0,48 20,22";
  if (izraz === "zamisljena" || izraz === "mirna") ustaD = "M-10,30 Q0,32 10,29";
  return (
    <g transform={`translate(${x} ${y + odskok}) scale(${s * LIK})`} opacity={opacity}>
      <ellipse cx={0} cy={4} rx={80} ry={12} fill={N.travaTamna} opacity={0.35} />
      <g transform={`rotate(${nagib + njihanje * 0.4} 0 -60)`}>
        <Ruka sx={-54} sy={-330} a1={lr[0]} a2={lr[1]} boja={rukav} drzi={drziL} drziRot={drziLRot} />
        {noga(-1, noge)}
        {noga(1, -noge)}
        {odeca.tip === "zena" ? (
          <>
            <Boja d="M-50,-250 C-80,-200 -100,-150 -110,-120 C-40,-106 40,-106 110,-120 C100,-150 80,-200 50,-250Z" boja={odeca.suknja} />
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} transform={`translate(${-78 + (i % 5) * 38 + (i > 4 ? 19 : 0)} ${-184 + (i > 4 ? 40 : 0)})`}>
                {[0, 90, 180, 270].map((a) => (
                  <ellipse key={a} cx={0} cy={-5} rx={3.5} ry={6} fill={odeca.suknja === N.bela ? N.crvena : N.bela} transform={`rotate(${a})`} />
                ))}
                <circle r={2.5} fill={N.zuta} />
              </g>
            ))}
            <path d="M-104,-128 C-40,-116 40,-116 104,-128" stroke={N.bela} strokeWidth={5} fill="none" strokeDasharray="8 6" />
            {odeca.kecelja && <Boja d="M-40,-246 C-54,-200 -62,-160 -64,-130 C-20,-122 20,-122 64,-130 C62,-160 54,-200 40,-246Z" boja={odeca.kecelja} />}
            <Boja d="M-56,-350 C-62,-310 -58,-270 -50,-240 C-20,-234 20,-234 50,-240 C58,-270 62,-310 56,-350 C30,-362 -30,-362 -56,-350Z" boja={odeca.bluza} />
            {odeca.sara && <path d="M-50,-320 C-20,-300 20,-300 50,-320" stroke={odeca.sara} strokeWidth={8} fill="none" strokeDasharray="4 6" />}
          </>
        ) : (
          <>
            <Boja d="M-60,-352 C-66,-300 -60,-250 -54,-150 L54,-150 C60,-250 66,-300 60,-352 C30,-366 -30,-366 -60,-352Z" boja={odeca.kosulja} />
            {odeca.prsluk && (
              <>
                <Boja d="M-60,-350 C-64,-300 -60,-250 -56,-190 L-14,-190 L-18,-350Z" boja={odeca.prsluk} />
                <Boja d="M60,-350 C64,-300 60,-250 56,-190 L14,-190 L18,-350Z" boja={odeca.prsluk} />
              </>
            )}
            <Boja d={kutijaPojas} boja={N.drvoTamno} />
            {[-320, -290, -260, -230].map((yy) => (
              <circle key={yy} cx={0} cy={yy} r={4} fill={N.bela} stroke={N.kontura} strokeWidth={1.5} />
            ))}
          </>
        )}
        {/* glava */}
        <g transform={`translate(0 -430) rotate(${glavaNagib + njihanje} 0 60)`}>
          {kosa === "pletenica" && (
            <g>
              {[0, 1, 2, 3].map((i) => (
                <Boja key={i} d={elipsa(54 + i * 2, 10 + i * 26, 14, 17)} boja={bojaKose} debljina={2.5} />
              ))}
              <path d="M48,110 L70,120 L56,128Z" fill={N.crvena} />
            </g>
          )}
          {kosa === "punda" && <Boja d={elipsa(0, -66, 30, 24)} boja={bojaKose} />}
          {kosa === "rep" && <Boja d="M40,-30 C90,-20 96,50 70,96 C62,60 50,24 34,4Z" boja={bojaKose} />}
          <Boja d={elipsa(0, 0, 62, 66)} boja={N.koza} />
          <circle cx={-34} cy={16} r={13} fill={N.obraz} opacity={0.75} />
          <circle cx={34} cy={16} r={13} fill={N.obraz} opacity={0.75} />
          {trep || izraz === "srecna" ? (
            <>
              <path d={izraz === "srecna" && !trep ? "M-30,-6 Q-20,-16 -10,-6" : "M-30,-4 Q-20,0 -10,-4"} stroke={N.kontura} strokeWidth={4} fill="none" strokeLinecap="round" />
              <path d={izraz === "srecna" && !trep ? "M10,-6 Q20,-16 30,-6" : "M10,-4 Q20,0 30,-4"} stroke={N.kontura} strokeWidth={4} fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx={-20 + gx * 4} cy={-6 + gy * 3} r={izraz === "iznenadjena" ? 8 : 6.5} fill={N.kontura} />
              <circle cx={20 + gx * 4} cy={-6 + gy * 3} r={izraz === "iznenadjena" ? 8 : 6.5} fill={N.kontura} />
              <circle cx={-18 + gx * 4} cy={-8 + gy * 3} r={2} fill={N.bela} />
              <circle cx={22 + gx * 4} cy={-8 + gy * 3} r={2} fill={N.bela} />
            </>
          )}
          <path d={izraz === "zamisljena" ? "M-32,-26 Q-20,-34 -8,-24 M8,-28 Q20,-34 32,-26" : "M-32,-24 Q-20,-32 -8,-26 M8,-26 Q20,-32 32,-24"} stroke={N.kontura} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M-2,4 Q-6,14 2,15" stroke={N.kontura} strokeWidth={3} fill="none" strokeLinecap="round" />
          {usta > 0.05 ? (
            <Boja d={`M-11,26 Q0,${26 + 20 * usta} 11,26 Q0,22 -11,26Z`} boja={N.crvenaTamna} debljina={2} />
          ) : izraz === "iznenadjena" ? (
            <Boja d={elipsa(0, 30, 7, 9)} boja={N.crvenaTamna} debljina={2} />
          ) : (
            <path d={ustaD} stroke={N.crvenaTamna} strokeWidth={4} fill="none" strokeLinecap="round" />
          )}
          {brkovi && <Boja d="M-28,20 C-18,8 -4,10 0,17 C4,10 18,8 28,20 C18,17 8,19 0,21 C-8,19 -18,17 -28,20Z" boja={bojaKose} debljina={2} />}
          {/* kosa spreda */}
          {kosa === "kratka" ? (
            <Boja d="M-64,-8 C-72,-56 -36,-80 4,-80 C44,-80 72,-56 64,-8 C56,-30 40,-40 20,-40 L12,-28 L4,-44 C-16,-40 -40,-36 -64,-8Z" boja={bojaKose} />
          ) : (
            <Boja d="M-64,-4 C-70,-54 -34,-78 2,-78 C38,-78 70,-54 64,-4 C50,-40 20,-50 0,-48 C-24,-48 -50,-38 -64,-4Z" boja={bojaKose} />
          )}
          {kapa === "sesir" && (
            <g>
              <Boja d="M-96,-40 C-60,-56 60,-56 96,-40 C70,-30 -70,-30 -96,-40Z" boja={bojaKape} />
              <Boja d="M-54,-44 C-56,-90 -30,-106 0,-106 C30,-106 56,-90 54,-44 C30,-50 -30,-50 -54,-44Z" boja={bojaKape} />
              <path d="M-54,-56 C-20,-62 20,-62 54,-56" stroke={N.crvenaTamna} strokeWidth={7} fill="none" />
            </g>
          )}
          {kapa === "sajkaca" && (
            <g>
              <Boja d="M-66,-36 C-70,-70 -40,-92 0,-94 C40,-92 70,-70 66,-36 C40,-46 -40,-46 -66,-36Z" boja={bojaKape} />
              <path d="M-40,-90 C-10,-60 10,-60 40,-90" stroke={N.kontura} strokeWidth={3} fill="none" />
            </g>
          )}
          {kapa === "marama" && (
            <g>
              <Boja d="M-70,10 C-80,-60 -40,-86 0,-86 C40,-86 80,-60 70,10 C60,-30 40,-46 0,-46 C-40,-46 -60,-30 -70,10Z" boja={bojaKape} />
              {[-40, -14, 14, 40].map((cx) => (
                <circle key={cx} cx={cx} cy={-62 + Math.abs(cx) * 0.3} r={5} fill={N.bela} />
              ))}
              <Boja d="M40,40 L76,70 L52,76Z" boja={bojaKape} debljina={2} />
            </g>
          )}
        </g>
        <Ruka sx={54} sy={-330} a1={dr[0]} a2={dr[1]} boja={rukav} drzi={drziD} drziRot={drziDRot} />
      </g>
    </g>
  );
};

const kutijaPojas = "M-56,-166 L56,-166 L56,-148 L-56,-148Z";

// Likovi videa „Poljoprivrednici“
export const SAVA: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.bela, pantalone: "#4A4A58", prsluk: "#2F2F3A" }, kosa: "kratka", bojaKose: "#B8B4AC", brkovi: true, seed: 3, kapa: "sesir", bojaKape: "#3A3530" };
export const SAVA_MLAD: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.bela, pantalone: N.plava, prsluk: N.crvena }, kosa: "kratka", bojaKose: "#3B2416", brkovi: true, seed: 3 };
export const DJURIKA: LutkaCfg = { odeca: { tip: "muskarac", kosulja: "#7FB6E6", pantalone: "#3D5A3A", prsluk: N.drvo }, kosa: "kratka", bojaKose: "#8E8A82", brkovi: true, seed: 7, kapa: "sajkaca", bojaKape: "#5A4E3A" };
export const OTAC: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.bela, pantalone: "#2F2F3A", prsluk: "#2F2F3A" }, kosa: "kratka", bojaKose: "#E6E2DA", brkovi: true, seed: 11, kapa: "sajkaca", bojaKape: "#2F2F3A" };
export const ZENA: LutkaCfg = { odeca: { tip: "zena", bluza: N.bela, suknja: N.plava, kecelja: N.crvena }, kosa: "punda", bojaKose: "#3B2416", seed: 2, kapa: "marama", bojaKape: N.crvena };
export const CERKA: LutkaCfg = { odeca: { tip: "zena", bluza: N.zuta, suknja: N.crvena }, kosa: "pletenica", bojaKose: "#5C3A1A", seed: 5 };
export const SIN: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.crvena, pantalone: N.plava }, kosa: "kratka", bojaKose: "#5C3A1A", seed: 6 };
export const KOMSIJA: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.zuta, pantalone: N.drvoTamno, prsluk: N.zelena }, kosa: "kratka", bojaKose: "#2B1D14", brkovi: true, seed: 8, kapa: "sesir", bojaKape: N.drvo };
export const KOMSINICA: LutkaCfg = { odeca: { tip: "zena", bluza: N.roze, suknja: N.zelena, kecelja: N.bela }, kosa: "punda", bojaKose: "#7A4A2A", seed: 9, kapa: "marama", bojaKape: N.plava };
export const MLADA_ZENA: LutkaCfg = { odeca: { tip: "zena", bluza: N.ljubicasta, suknja: N.zuta }, kosa: "rep", bojaKose: "#B5562A", seed: 12 };
export const PENZIONER: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.plavaSvetla, pantalone: "#4A4A58" }, kosa: "kratka", bojaKose: "#D8D4CC", brkovi: true, seed: 13, kapa: "sesir", bojaKape: "#6B6258" };
export const MOMAK1: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.narandzasta, pantalone: N.plava }, kosa: "kratka", bojaKose: "#2B1D14", seed: 14 };
export const MOMAK2: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.zelenaSvetla, pantalone: N.drvoTamno }, kosa: "kratka", bojaKose: "#C08A3A", seed: 15 };
export const VETERINAR: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.bela, pantalone: N.plava }, kosa: "kratka", bojaKose: "#3B2416", seed: 16 };
export const ELEKTRICAR: LutkaCfg = { odeca: { tip: "muskarac", kosulja: N.plava, pantalone: N.plava, prsluk: N.zuta }, kosa: "kratka", bojaKose: "#2B1D14", brkovi: true, seed: 17 };
