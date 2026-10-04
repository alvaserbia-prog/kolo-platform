// Pozadine slikovnice: kuhinja (panorama za pomeranje kamere), podrum, ulica, dvorište.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Linija, Oblik, elipsa, kutija } from "./alat";
import { Drvo, Kuca, Paprika, Tegla } from "./predmeti";

// ── Kuhinja ──────────────────────────────────────────────────────────────
export type Sezona = "leto" | "jesen" | "zima";

const Plocice: React.FC<{ x0: number; x1: number; y0: number; y1: number }> = ({ x0, x1, y0, y1 }) => {
  const el: React.ReactNode[] = [];
  const k = 70;
  for (let x = x0; x < x1; x += k)
    for (let y = y0; y < y1; y += k) {
      const i = Math.round((x - x0) / k) + Math.round((y - y0) / k);
      el.push(
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={k} height={k} fill={P.belo} stroke="#cbbf9f" strokeWidth={2} />
          {i % 2 === 0 && (
            <g transform={`translate(${x + k / 2} ${y + k / 2})`} opacity={0.75}>
              <path d="M0,-18 C8,-8 8,8 0,18 C-8,8 -8,-8 0,-18Z" fill={P.plava} />
              <path d="M-18,0 C-8,-8 8,-8 18,0 C8,8 -8,8 -18,0Z" fill={P.plava} />
              <circle r={5} fill={P.oker} />
            </g>
          )}
        </g>,
      );
    }
  return <g>{el}</g>;
};

/** Venac suvih paprika (vojvođanska kuhinja). */
export const Venac: React.FC<{ n?: number }> = ({ n = 9 }) => (
  <g>
    <Linija d={`M0,0 L0,${n * 34 + 10}`} debljina={3} boja={P.drvo} />
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${i % 2 ? 10 : -10} ${30 + i * 34}) rotate(${i % 2 ? -25 : 25})`}>
        <Paprika s={0.42} boja={i % 3 === 0 ? P.ajvarTamni : P.paprika} />
      </g>
    ))}
  </g>
);

export const Kuhinja: React.FC<{ sezona?: Sezona; bezPolice?: boolean; policaTegle?: number; prasina?: number; sat?: boolean; cilim?: boolean }> = ({
  sezona = "leto",
  bezPolice,
  policaTegle = 5,
  prasina = 0,
  sat = true,
  cilim = true,
}) => {
  const f = useCurrentFrame();
  const nebo = sezona === "jesen" ? "#B9C3BD" : sezona === "zima" ? "#C9D4D8" : P.nebo;
  return (
    <g>
      {/* zid */}
      <rect x={-1200} y={-200} width={3600} height={1500} fill="#EAD5A6" />
      <rect x={-1200} y={-200} width={3600} height={1500} fill="url(#gvasP)" opacity={0.28} style={{ mixBlendMode: "multiply" }} />
      {/* traka šablona pri vrhu zida (valjak) */}
      {Array.from({ length: 36 }, (_, i) => (
        <g key={i} transform={`translate(${-1180 + i * 100} 340)`} opacity={0.4}>
          <path d="M0,-12 C10,-4 10,4 0,12 C-10,4 -10,-4 0,-12Z" fill={P.crep} />
          <circle cx={50} r={4} fill={P.zelenaPrigusena} />
        </g>
      ))}
      {/* pločice iznad radne ploče */}
      <Plocice x0={-1200} x1={2400} y0={930} y1={1070} />
      {/* pod */}
      <rect x={-1200} y={1250} width={3600} height={800} fill={P.drvoSvetlo} />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1={-1200} y1={1270 + i * 48} x2={2400} y2={1270 + i * 48} stroke={P.drvo} strokeWidth={3} opacity={0.5} />
      ))}
      <rect x={-1200} y={1250} width={3600} height={800} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      {/* ćilim na podu */}
      {cilim && (
        <g transform="translate(560 1560)">
          <Oblik d="M-420,-90 L420,-90 L470,110 L-470,110Z" boja={P.ajvar} tekstura={0.4} />
          <path d="M-390,-66 L390,-66 L432,88 L-432,88Z" fill="none" stroke={P.krem} strokeWidth={6} strokeDasharray="14 8" />
          {[-300, -150, 0, 150, 300].map((xx) => (
            <g key={xx} transform={`translate(${xx} 10)`}>
              <path d="M0,-50 L46,0 L0,50 L-46,0Z" fill={P.oker} stroke={P.mastilo} strokeWidth={3} />
              <path d="M0,-24 L22,0 L0,24 L-22,0Z" fill={P.zelenaTamna} />
            </g>
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <line key={i} x1={-460 + i * 44} y1={110} x2={-462 + i * 44} y2={132} stroke={P.krem} strokeWidth={4} />
          ))}
        </g>
      )}
      {/* radna ploča i elementi */}
      <Oblik d={`M-1200,1070 L2400,1070 L2400,1100 L-1200,1100Z`} boja={P.drvoTamno} />
      <Oblik d={`M-1200,1100 L2400,1100 L2400,1250 L-1200,1250Z`} boja="#D9C7A0" />
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i}>
          <rect x={-1180 + i * 260} y={1116} width={240} height={120} rx={8} fill="none" stroke={P.mastilo} strokeWidth={3} opacity={0.6} />
          <circle cx={-1060 + i * 260} cy={1140} r={7} fill={P.drvoTamno} />
        </g>
      ))}
      {/* prozor */}
      <g transform="translate(760 0)">
        <Oblik d={kutija(-170, 420, 340, 400, 8)} boja={nebo} tekstura={0.2} />
        {sezona === "jesen" && (
          <g>
            <g transform="translate(-60 820)">
              <Drvo s={0.9} jesen />
            </g>
            {[0, 1, 2, 3, 4].map((i) => {
              const t = ((f * 0.9 + i * 37) % 140) / 140;
              return <ellipse key={i} cx={-140 + i * 70 + Math.sin(t * 9 + i) * 20} cy={430 + t * 380} rx={9} ry={5} fill={i % 2 ? P.oker : P.paprika} transform={`rotate(${t * 300} ${-140 + i * 70} ${430 + t * 380})`} />;
            })}
          </g>
        )}
        {sezona === "leto" && (
          <g>
            <g transform="translate(-40 830)">
              <Drvo s={0.9} />
            </g>
            <circle cx={110} cy={480} r={34} fill="#F7D774" opacity={0.9} />
          </g>
        )}
        <Linija d="M0,420 L0,820 M-170,620 L170,620" debljina={10} boja={P.krem} />
        <Oblik d={kutija(-170, 420, 340, 400, 8)} boja="none" tekstura={0} debljina={6} />
        <Oblik d={kutija(-190, 816, 380, 24, 4)} boja={P.krem} debljina={3.5} />
        {/* karirane zavese */}
        {[-1, 1].map((st) => (
          <g key={st}>
            <Oblik d={`M${st * 190},400 C${st * 120},520 ${st * 150},700 ${st * 130},800 L${st * 210},800 L${st * 210},400Z`} boja={P.ajvar} />
            <g opacity={0.35}>
              {[430, 480, 530, 580, 630, 680, 730, 780].map((yy) => (
                <line key={yy} x1={st * 130} y1={yy} x2={st * 210} y2={yy} stroke={P.krem} strokeWidth={6} />
              ))}
            </g>
          </g>
        ))}
        <Oblik d={kutija(-220, 386, 440, 22, 6)} boja={P.drvo} debljina={3.5} />
        <g transform="translate(250 380)">
          <Venac />
        </g>
      </g>
      {/* zidni sat */}
      {sat && (
        <g transform="translate(470 520)">
          <Oblik d={elipsa(0, 0, 60, 60)} boja={P.belo} debljina={5} />
          <circle r={4} fill={P.mastilo} />
          <line x1={0} y1={0} x2={Math.sin(f / 30) * 34} y2={-Math.cos(f / 30) * 34} stroke={P.mastilo} strokeWidth={5} strokeLinecap="round" />
          <line x1={0} y1={0} x2={Math.sin(f / 360) * 22} y2={-Math.cos(f / 360) * 22} stroke={P.mastilo} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      {/* zidna polica sa zimnicom */}
      {!bezPolice && (
        <g transform="translate(180 700)">
          <Oblik d={kutija(-170, 0, 340, 22, 4)} boja={P.drvo} debljina={3.5} />
          <Oblik d="M-150,22 L-150,70 L-120,22Z" boja={P.drvoTamno} debljina={3} />
          <Oblik d="M150,22 L150,70 L120,22Z" boja={P.drvoTamno} debljina={3} />
          {Array.from({ length: policaTegle }, (_, i) => (
            <g key={i} transform={`translate(${-130 + i * 65} 0)`}>
              <Tegla vrsta={(["ajvar", "tursija", "pekmez", "ajvar", "sok"] as const)[i % 5]} s={0.5} prasina={prasina} flasa={i % 5 === 4} />
            </g>
          ))}
        </g>
      )}
    </g>
  );
};

// ── Podrum ───────────────────────────────────────────────────────────────
export const Podrum: React.FC<{ svetlo?: number }> = ({ svetlo = 1 }) => (
  <g>
    <rect x={-400} y={-200} width={1900} height={2400} fill="#7A5A44" />
    {/* cigle svoda */}
    {Array.from({ length: 30 }, (_, r) =>
      Array.from({ length: 14 }, (_, c) => (
        <rect key={`${r}-${c}`} x={-400 + c * 140 + (r % 2) * 70} y={-200 + r * 60} width={132} height={52} rx={6} fill="#8E6A50" opacity={0.7} />
      )),
    )}
    <rect x={-400} y={-200} width={1900} height={2400} fill="url(#gvasP)" opacity={0.4} style={{ mixBlendMode: "multiply" }} />
    {/* svod */}
    <path d="M-100,500 C-100,120 1180,120 1180,500 L1180,-300 L-100,-300Z" fill="#5A4031" />
    <path d="M-100,500 C-100,120 1180,120 1180,500" fill="none" stroke={P.mastilo} strokeWidth={6} opacity={0.6} />
    {/* pod */}
    <rect x={-400} y={1250} width={1900} height={900} fill="#6A5242" />
    <rect x={-400} y={1250} width={1900} height={900} fill="url(#gvasP)" opacity={0.4} style={{ mixBlendMode: "multiply" }} />
    {/* sijalica */}
    <line x1={540} y1={-100} x2={540} y2={300} stroke={P.mastilo} strokeWidth={3} />
    <circle cx={540} cy={320} r={26} fill="#FFE39A" stroke={P.mastilo} strokeWidth={3} />
    <circle cx={540} cy={330} r={420} fill="url(#toplaSvetlost)" opacity={svetlo} />
  </g>
);

/** Police u podrumu: tri reda. Sadržaj redova se prosleđuje. */
export const Police: React.FC<{ redovi: React.ReactNode[]; x1?: number }> = ({ redovi, x1 = 1020 }) => (
  <g>
    <Oblik d="M60,420 L60,1250 L90,1250 L90,420Z" boja={P.drvoTamno} />
    <Oblik d={`M${x1 - 30},420 L${x1 - 30},1250 L${x1},1250 L${x1},420Z`} boja={P.drvoTamno} />
    {[640, 900, 1160].map((y, i) => (
      <g key={y}>
        <g transform={`translate(0 ${y})`}>{redovi[i]}</g>
        <Oblik d={kutija(40, y, x1 - 20, 26, 4)} boja={P.drvo} debljina={3.5} />
      </g>
    ))}
  </g>
);

// ── Ulica i dvorište ─────────────────────────────────────────────────────
export const Ulica: React.FC<{ nebo?: string }> = ({ nebo = P.nebo }) => (
  <g>
    <rect x={-600} y={-200} width={2400} height={1100} fill={nebo} />
    <rect x={-600} y={-200} width={2400} height={1100} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
    {/* oblaci */}
    {[
      [160, 330, 1],
      [760, 250, 0.8],
      [1300, 380, 0.9],
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <Oblik d="M-120,0 C-130,-40 -80,-60 -50,-44 C-30,-90 50,-90 60,-44 C100,-60 140,-30 120,0Z" boja={P.belo} debljina={3} tekstura={0.15} />
      </g>
    ))}
    {/* ravnica, niz kuća u daljini */}
    <rect x={-600} y={880} width={2400} height={1300} fill={P.trava} />
    <rect x={-600} y={880} width={2400} height={1300} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
  </g>
);

export const Kuce: React.FC<{ y?: number; s?: number; n?: number; x0?: number; razmak?: number; svetlo?: number }> = ({ y = 900, s = 0.5, n = 6, x0 = -200, razmak = 260, svetlo = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${x0 + i * razmak} ${y})`}>
        <Kuca s={s} zid={i % 3 === 0 ? P.zidZuti : i % 3 === 1 ? P.zid : "#E4CFC0"} svetlo={svetlo} />
      </g>
    ))}
  </g>
);
