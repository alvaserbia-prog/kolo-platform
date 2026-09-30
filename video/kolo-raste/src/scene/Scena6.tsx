// Scena 6 — „Što je KOLO veće, lakše nađeš ono što ti treba, i lakše tebe nađe onaj kome trebaš.“
// U sredini medaljon „ti“ (Vesna). Na „veće“ oko nje niču kuće-tačke u tri kruga i povežu se.
// Na „nađeš“ zelena nit krene od nje do majstora sa alatom (ono što joj treba); na „tebe“ zlatna
// nit dođe do nje od komšinice kojoj treba zimnica, a kod Vesne uskoči tegla.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { RUKOPIS } from "../fontovi";
import { Hrapavo, Kadar, Oblik, Pop, elipsa, napredak, useF, usePop } from "../alat";
import { Glava } from "../likovi";
import { Tegla } from "../predmeti";
import { DEDA, VESNA, MLADIC1 } from "../kolo";
import { Alat } from "./Scena2";
import { kad } from "../vreme";

const CX = 540;
const CY = 860;

const KRUGOVI: [number, number, number][] = [
  // poluprečnik, broj tačaka, pomeraj ugla
  [210, 7, 0.2],
  [340, 11, 0.5],
  [460, 15, 0.1],
];
const TACKE: { x: number; y: number; k: number; i: number }[] = [];
KRUGOVI.forEach(([r, n, p], k) => {
  for (let i = 0; i < n; i++) {
    const a = ((i + p) / n) * Math.PI * 2;
    TACKE.push({ x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r * 0.86, k, i });
  }
});
const MAJSTOR = TACKE.findIndex((t) => t.k === 2 && t.i === 12);
const TRAZI = TACKE.findIndex((t) => t.k === 2 && t.i === 5);

const Portret: React.FC<{ glava: any; r: number; boja: string; id: string }> = ({ glava, r, boja, id }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <circle r={r} />
      </clipPath>
    </defs>
    <circle r={r + 10} fill={P.senka} opacity={0.25} filter="url(#blur6)" />
    <g clipPath={`url(#${id})`}>
      <circle r={r} fill={boja} />
      <g transform={`translate(0 ${r * 0.28}) scale(${r / 150})`}>
        <Glava {...glava} izraz="osmeh" />
      </g>
    </g>
    <circle r={r} fill="none" stroke={P.mastilo} strokeWidth={6} />
  </g>
);

const Kucica: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-16,0 L-16,-20 L0,-34 L16,-20 L16,0Z" fill={P.zid} stroke={P.mastilo} strokeWidth={3} />
    <path d="M-20,-18 L0,-38 L20,-18" fill="none" stroke={P.crep} strokeWidth={6} strokeLinecap="round" />
    <rect x={-5} y={-14} width={10} height={14} fill={P.zelenaPrigusena} />
  </g>
);

const nit = (x1: number, y1: number, x2: number, y2: number) => `M${x1},${y1} Q${(x1 + x2) / 2 + (y2 - y1) * 0.25},${(y1 + y2) / 2 - (x2 - x1) * 0.25} ${x2},${y2}`;

export const Scena6: React.FC = () => {
  const f = useF();
  const kVece = kad(6, "veće,");
  const kNadjes = kad(6, "nađeš");
  const kTebe = kad(6, "tebe");
  const kNadje = kad(6, "nađe");
  const ti = usePop(-6, 130, 12);
  const nit1 = napredak(f, kNadjes - 4, 20, Easing.inOut(Easing.cubic));
  const nit2 = napredak(f, kTebe - 2, 20, Easing.inOut(Easing.cubic));
  const tegla = usePop(kNadje + 4, 160, 10);
  const m = TACKE[MAJSTOR];
  const t = TACKE[TRAZI];
  const z = interpolate(f, [0, kVece + 20], [1.3, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <Kadar>
      <rect width={1080} height={1920} fill="#EDE0C0" />
      <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.28} style={{ mixBlendMode: "multiply" }} />
      <g transform={`translate(${CX} ${CY}) scale(${z}) translate(${-CX} ${-CY})`}>
        {/* veze među tačkama */}
        {TACKE.map((a, i) =>
          TACKE.slice(i + 1).map((b, j) => {
            const d = Math.hypot(b.x - a.x, b.y - a.y);
            if (d > 175) return null;
            const p = napredak(f, kVece + 4 + Math.max(a.k, b.k) * 5 + ((i + j) % 5) * 1.5, 12);
            return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={P.zelena500} strokeWidth={3} strokeDasharray="6 6" opacity={0.45} />;
          }),
        )}
        {TACKE.filter((x) => x.k === 0).map((a, i) => (
          <line key={i} x1={CX} y1={CY} x2={a.x} y2={a.y} stroke={P.zelena500} strokeWidth={3} strokeDasharray="6 6" opacity={0.45 * napredak(f, kVece, 10)} />
        ))}
        {TACKE.map((a, i) => (
          <Pop key={i} at={kVece - 8 + a.k * 6 + (a.i % 5) * 1.2} x={a.x} y={a.y}>
            <Hrapavo lokalno>
              <circle r={26} fill={P.krem} stroke={P.zelena700} strokeWidth={3} />
              <g transform="translate(0 14)">
                <Kucica s={0.9} />
              </g>
            </Hrapavo>
          </Pop>
        ))}
        {/* nit 1: od tebe do majstora */}
        {nit1 > 0 && <path d={nit(CX, CY, m.x, m.y)} fill="none" stroke={P.zelena700} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - nit1} />}
        {/* nit 2: od komšinice do tebe */}
        {nit2 > 0 && <path d={nit(t.x, t.y, CX, CY)} fill="none" stroke={P.zlatna} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - nit2} />}
        <Pop at={kNadjes + 10} x={m.x} y={m.y}>
          <Portret glava={MLADIC1.glava} r={78} boja={P.nebo} id="port1" />
          <g transform="translate(70 60) scale(0.8)">
            <Oblik d={elipsa(0, 0, 50, 50)} boja={P.krem} debljina={4} />
            <g transform="translate(0 20) scale(0.7)">
              <Alat />
            </g>
          </g>
        </Pop>
        <Pop at={kTebe + 8} x={t.x} y={t.y}>
          <Portret glava={DEDA.glava} r={78} boja={P.roze} id="port2" />
        </Pop>
        <g transform={`translate(${CX} ${CY}) scale(${ti})`}>
          <circle r={140} fill="url(#toplaSvetlost)" opacity={0.8} />
          <Portret glava={VESNA.glava} r={96} boja={P.zelena100} id="portTi" />
          <g transform="translate(0 132)">
            <rect x={-40} y={-30} width={80} height={48} rx={24} fill={P.zelena700} stroke={P.mastilo} strokeWidth={3} />
            <text y={6} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={40} fill="#fff">
              ti
            </text>
          </g>
          {tegla > 0 && (
            <g transform={`translate(-96 70) scale(${tegla * 0.6})`}>
              <Tegla vrsta="ajvar" natpis="zimnica" />
            </g>
          )}
        </g>
      </g>
    </Kadar>
  );
};
