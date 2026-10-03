// Pijaca kao maketa: dva pravilna reda tezgi na kaldrmi, drveće i kuće okolo.
// Isti svet koriste scene 2, 3, 4 i 10, pa kamera samo klizi do druge tezge.
import React from "react";
import { P, tamnije } from "./paleta";
import { Drvo, Kartica, Kaldrma, Kuca, Ploca, Tegla, Tezga } from "./iso";

// ── Roba (ekranski prostor, dno na sredini u 0,0) ───────────────────────────
export const Bicikl = () => (
  <g transform="translate(0,-8)">
    <circle cx={-34} cy={-28} r={26} fill="none" stroke={P.mastilo} strokeWidth={5} />
    <circle cx={34} cy={-28} r={26} fill="none" stroke={P.mastilo} strokeWidth={5} />
    <path d="M-34,-28 L-6,-62 L26,-62 L34,-28 M-6,-62 L4,-28 L-34,-28 M4,-28 L26,-62" stroke={P.plava} strokeWidth={6} fill="none" strokeLinejoin="round" />
    <path d="M-12,-70 l14,0 M26,-62 l-4,-14 l10,0" stroke={P.mastilo} strokeWidth={5} strokeLinecap="round" fill="none" />
  </g>
);

export const Knjige = () => (
  <g>
    {[P.plava, P.crvena, P.zuta, P.tirkiz].map((c, i) => (
      <rect key={i} x={-50 + i * 26} y={-62 + (i % 2) * 8} width={22} height={62 - (i % 2) * 8} rx={2} fill={c} stroke={tamnije(c, 0.4)} strokeWidth={2} />
    ))}
    <path d="M30,-4 l30,-30 l8,8 l-30,30 Z" fill={P.zuta} stroke={tamnije(P.zuta, 0.4)} strokeWidth={2} />
  </g>
);

export const Pletivo = () => (
  <g>
    <circle cx={-26} cy={-26} r={26} fill={P.roze} stroke={tamnije(P.roze, 0.4)} strokeWidth={2} />
    <path d="M-44,-36 q18,10 36,-4 M-46,-20 q20,10 40,-6" stroke={tamnije(P.roze, 0.3)} strokeWidth={2} fill="none" />
    <circle cx={22} cy={-22} r={22} fill={P.tirkiz} stroke={tamnije(P.tirkiz, 0.4)} strokeWidth={2} />
    <path d="M-10,-60 L40,-6 M0,-64 L48,-12" stroke={P.drvoTamno} strokeWidth={4} strokeLinecap="round" />
  </g>
);

export const Cvece = () => (
  <g>
    <path d="M-30,0 L-24,-36 L24,-36 L30,0 Z" fill={P.narandzasta} stroke={tamnije(P.narandzasta, 0.4)} strokeWidth={2} />
    {[[-20, -64, P.crvena], [0, -76, P.zuta], [20, -62, P.ljubicasta], [-8, -52, P.roze], [12, -50, P.belo]].map(([x, y, c], i) => (
      <g key={i}>
        <path d={`M${x},${y} L${(x as number) * 0.5},-36`} stroke={P.travaTamna} strokeWidth={3} />
        <circle cx={x as number} cy={y as number} r={11} fill={c as string} stroke={tamnije(c as string, 0.35)} strokeWidth={1.5} />
        <circle cx={x as number} cy={y as number} r={4} fill={P.zuta} />
      </g>
    ))}
  </g>
);

export const Jaja = () => (
  <g>
    <path d="M-50,-4 L50,-4 L44,-30 L-44,-30 Z" fill="#C98B4E" stroke="#7A4E25" strokeWidth={2} />
    {[-30, -10, 10, 30, -20, 0, 20].map((x, i) => (
      <ellipse key={i} cx={x} cy={i < 4 ? -34 : -50} rx={10} ry={13} fill={i % 2 ? "#F7E7CF" : "#E9C79C"} stroke="#B8936A" strokeWidth={1.5} />
    ))}
  </g>
);

export const Igracke = () => (
  <g>
    <rect x={-50} y={-40} width={36} height={36} rx={4} fill={P.crvena} stroke={tamnije(P.crvena, 0.4)} strokeWidth={2} />
    <text x={-32} y={-14} textAnchor="middle" fontFamily="'Noto Sans'" fontWeight={900} fontSize={24} fill="#fff">A</text>
    <rect x={-10} y={-36} width={32} height={32} rx={4} fill={P.plava} stroke={tamnije(P.plava, 0.4)} strokeWidth={2} />
    <text x={6} y={-12} textAnchor="middle" fontFamily="'Noto Sans'" fontWeight={900} fontSize={22} fill="#fff">B</text>
    <circle cx={42} cy={-22} r={20} fill={P.zuta} stroke={tamnije(P.zuta, 0.4)} strokeWidth={2} />
    <path d="M24,-28 q18,8 36,0" stroke={P.crvena} strokeWidth={3} fill="none" />
  </g>
);

export const Sijalica: React.FC<{ svetli?: number; s?: number }> = ({ svetli = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {svetli > 0 && <circle cx={0} cy={-46} r={60} fill={P.zuta} opacity={0.55 * svetli} filter="url(#meko)" />}
    <path d="M-24,-56 a24,24 0 1,1 48,0 q0,14 -12,24 l0,8 l-24,0 l0,-8 q-12,-10 -12,-24 Z" fill={svetli > 0 ? "#FFE680" : "#F2F6F8"} stroke={P.mastilo} strokeWidth={3} />
    <rect x={-12} y={-24} width={24} height={14} rx={2} fill="#9AA5B1" stroke={P.mastilo} strokeWidth={2} />
    <path d="M-6,-44 l6,8 l6,-8" stroke={P.narandzasta} strokeWidth={2.5} fill="none" />
  </g>
);

export const Alat = () => (
  <g>
    <rect x={-56} y={-34} width={74} height={34} rx={4} fill={P.crvena} stroke={tamnije(P.crvena, 0.4)} strokeWidth={2} />
    <path d="M-40,-34 q0,-14 20,-14 q20,0 20,14" stroke={P.mastilo} strokeWidth={4} fill="none" />
    <path d="M24,-6 q24,-10 30,-36 q2,-8 10,-6" stroke={P.zuta} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M28,-2 l10,-14" stroke={P.mastilo} strokeWidth={6} strokeLinecap="round" />
    <g transform="translate(46,-60)"><Sijalica s={0.6} svetli={1} /></g>
  </g>
);

export const RadineTegle = () => (
  <g>
    <g transform="translate(-36,0)"><Tegla s={0.8} /></g>
    <g transform="translate(0,-4)"><Tegla s={0.9} /></g>
    <g transform="translate(36,0)"><Tegla s={0.8} /></g>
  </g>
);

export type TezgaOpis = { id: string; x: number; y: number; boja: string; roba: React.ReactNode; redovi: string[] };

// Red A (y = 0) i red B (y = 480); tezge na svakih 330 po x.
export const TEZGE: TezgaOpis[] = [
  { id: "cvece", x: 0, y: 0, boja: P.roze, roba: <Cvece />, redovi: ["Cveće iz bašte", "Gakovo"] },
  { id: "jaja", x: 330, y: 0, boja: P.zuta, roba: <Jaja />, redovi: ["Domaća jaja", "Stanišić"] },
  { id: "rada", x: 660, y: 0, boja: P.ljubicasta, roba: <RadineTegle />, redovi: ["Domaći pekmez", "Čonoplja", "Po dogovoru"] },
  { id: "bicikl", x: 990, y: 0, boja: P.plava, roba: <Bicikl />, redovi: ["Popravka bicikla", "Sombor"] },
  { id: "pletivo", x: 1320, y: 0, boja: P.tirkiz, roba: <Pletivo />, redovi: ["Pletene čarape", "Apatin"] },
  { id: "knjige", x: 0, y: 480, boja: P.narandzasta, roba: <Knjige />, redovi: ["Časovi matematike", "Sombor"] },
  { id: "deca", x: 330, y: 480, boja: P.crvena, roba: <Igracke />, redovi: ["Čuvanje dece", "Bezdan"] },
  { id: "dejan", x: 660, y: 480, boja: P.plava, roba: <Alat />, redovi: ["Električar", "Sombor"] },
  { id: "jaja2", x: 990, y: 480, boja: P.zuta, roba: <Jaja />, redovi: ["Jaja i sir", "Riđica"] },
  { id: "cvece2", x: 1320, y: 480, boja: P.ljubicasta, roba: <Cvece />, redovi: ["Rasad paprike", "Kupusina"] },
];
export const tezga = (id: string) => TEZGE.find((t) => t.id === id)!;

export const SvetPijace: React.FC<{
  vidljive?: (id: string) => number; // 0–1 uskakanje
  pecatRada?: number;
  sjajRada?: number;
  svetlo?: (id: string) => number;
  kartice?: boolean;
  bezRade?: boolean;
}> = ({ vidljive = () => 1, pecatRada = 1, sjajRada = 0, svetlo = () => 0, kartice = true, bezRade = false }) => (
  <g>
    <Ploca x={-2400} y={-2400} w={6400} d={6400} boja={P.trava} />
    <Kaldrma x={-160} y={-180} w={1820} d={900} />
    {/* kuće i drveće oko pijace */}
    <Kuca x={-120} y={-460} krov={P.crvena} />
    <Kuca x={160} y={-470} krov={P.narandzasta} zid="#FFF1D6" />
    <Kuca x={460} y={-480} krov={P.plava} zid="#FDE7D4" />
    <Kuca x={780} y={-470} krov={P.crvena} zid="#FFF4E0" />
    <Kuca x={1100} y={-460} krov={P.tirkiz} />
    <Kuca x={1420} y={-470} krov={P.narandzasta} zid="#FFF1D6" />
    <Drvo x={-320} y={-200} />
    <Drvo x={-330} y={240} s={1.1} />
    <Drvo x={1760} y={-180} s={0.9} />
    <Drvo x={1780} y={300} />
    <Drvo x={-300} y={760} />
    {[...TEZGE].sort((a, b) => a.x + a.y - (b.x + b.y)).map((t) => {
      const v = vidljive(t.id);
      if (v <= 0.001) return null;
      if (bezRade && t.id === "rada") return null;
      const jeRada = t.id === "rada";
      return (
        <g key={t.id} opacity={Math.min(1, v * 2)}>
          <Tezga
            x={t.x}
            y={t.y}
            boja={t.boja}
            roba={t.roba}
            svetlo={svetlo(t.id)}
            kartica={kartice ? <Kartica redovi={t.redovi} s={0.9} rot={jeRada ? -4 : 3} pecat={jeRada ? pecatRada : 0} sjaj={jeRada ? sjajRada : 0} /> : undefined}
          />
        </g>
      );
    })}
  </g>
);
