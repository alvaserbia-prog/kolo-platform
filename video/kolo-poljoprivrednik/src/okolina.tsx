// Mesta priče u naivi: unutrašnjost štale, Savina kuhinja, Županija sa somborskom pijacom,
// radnja sa policama, karta okoline Sombora.
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Boja, N, elipsa, kutija } from "./naiva";
import { OBLO } from "./fontovi";

/** Štala iznutra: daske, jasle, lanci, zrak svetla kroz prozorče, prašina u svetlu. `toplo` 0–1. */
export const StalaUnutra: React.FC<{ toplo?: number; noc?: boolean; children?: React.ReactNode }> = ({ toplo = 0, noc, children }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={2400} fill={noc ? "#2A1C14" : "#5A3A24"} />
      {Array.from({ length: 16 }, (_, i) => (
        <g key={i}>
          <rect x={-40 + i * 76} y={0} width={70} height={1400} fill={noc ? "#34241A" : i % 2 ? "#6E4A2E" : "#644228"} />
          <path d={`M${-40 + i * 76},0 L${-40 + i * 76},1400`} stroke="#2A1A10" strokeWidth={3} />
        </g>
      ))}
      <rect x={-200} y={180} width={1480} height={34} fill="#3E2818" />
      <Boja d={kutija(760, 240, 160, 120, 6)} boja={noc ? "#1A2440" : "#F4E2A8"} />
      <path d="M840,240 L840,360 M760,300 L920,300" stroke="#3E2818" strokeWidth={10} />
      {!noc && (
        <path d="M770,330 L910,330 L560,1250 L120,1250Z" fill={toplo > 0 ? "#FFE7A0" : "#F4E2C0"} opacity={0.22 + 0.12 * toplo} />
      )}
      {!noc &&
        Array.from({ length: 18 }, (_, i) => {
          const t = ((f * 0.6 + i * 37) % 300) / 300;
          const x = 300 + random(`pr${i}`) * 500 - t * 120;
          const y = 450 + random(`py${i}`) * 700;
          return <circle key={i} cx={x} cy={y} r={2.5} fill="#FFF3C8" opacity={0.6 * Math.sin(t * Math.PI)} />;
        })}
      {/* pregrade i lanci */}
      {[300, 620].map((x) => (
        <g key={x}>
          <Boja d={kutija(x - 14, 700, 28, 560, 4)} boja="#4A3020" />
          <path d={`M${x + 40},760 q-10,60 0,120 q10,60 0,120`} stroke="#8A8A8A" strokeWidth={6} fill="none" strokeDasharray="12 6" />
        </g>
      ))}
      {/* slama na podu */}
      <rect x={-200} y={1250} width={1480} height={700} fill={noc ? "#5A4A2A" : "#C9A85A"} />
      {Array.from({ length: 60 }, (_, i) => (
        <path key={i} d={`M${random(`sl${i}`) * 1080},${1260 + random(`sm${i}`) * 600} l${18 - random(`sn${i}`) * 36},-10`} stroke={noc ? "#7A6A3A" : "#E7C66A"} strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* jasle */}
      <Boja d="M40,1130 L1040,1130 L1000,1250 L80,1250Z" boja="#7A4A2A" />
      <path d="M60,1170 L1020,1170" stroke="#4A2A18" strokeWidth={5} />
      {children}
    </g>
  );
};

/** Savina kuhinja: zid, prozor sa jesenjim nebom, sto sa stolnjakom. Ploča stola na y=1160. */
export const Kuhinja: React.FC<{ jesen?: boolean }> = ({ jesen = true }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#EDE3CC" />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d={`M${i * 100},0 L${i * 100},1200`} stroke="#DCCFB2" strokeWidth={30} opacity={0.4} />
    ))}
    <Boja d={kutija(620, 300, 300, 340, 8)} boja={jesen ? "#AFB6BE" : N.neboSvetlo} />
    <path d="M770,300 L770,640 M620,470 L920,470" stroke={N.bela} strokeWidth={14} />
    {jesen && [0, 1, 2].map((i) => <path key={i} d={`M${660 + i * 90},${360 + i * 60} q10,8 20,0 q-10,-8 -20,0`} fill="#C99A3A" />)}
    <Boja d={kutija(600, 640, 340, 30, 6)} boja={N.bela} />
    <Boja d="M-100,1160 L1180,1160 L1180,1240 L-100,1240Z" boja="#8B5A2B" />
    <Boja d="M-100,1150 L1180,1150 L1180,1176 L-100,1176Z" boja={N.bela} />
    {Array.from({ length: 22 }, (_, i) => (
      <rect key={i} x={-100 + i * 60} y={1150} width={30} height={26} fill={N.crvena} opacity={0.7} />
    ))}
    <rect x={-200} y={1240} width={1480} height={800} fill="#B88A5A" />
  </g>
);

/** Županija u Somboru, naslikana kao kod naivaca: žuta zgrada, crveni krov, kula sa satom. */
export const Zupanija: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-500,0 L-500,-260 L500,-260 L500,0Z" boja="#F2C14E" />
    <Boja d="M-530,-250 L-470,-350 L470,-350 L530,-250Z" boja={N.crep} />
    <Boja d="M-90,-250 L-90,-440 L90,-440 L90,-250Z" boja="#F2C14E" />
    <Boja d="M-110,-430 L0,-500 L110,-430Z" boja="#3A4A5A" />
    <Boja d="M-40,-500 L-40,-560 L40,-560 L40,-500Z" boja="#F2C14E" />
    <Boja d="M-50,-556 L0,-620 L50,-556Z" boja="#3A4A5A" />
    <Boja d={elipsa(0, -390, 34)} boja={N.bela} />
    <path d="M0,-390 L0,-412 M0,-390 L16,-384" stroke={N.kontura} strokeWidth={4} />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <Boja d={`M${-440 + i * 110},-120 L${-440 + i * 110},-176 C${-440 + i * 110},-196 ${-400 + i * 110},-196 ${-400 + i * 110},-176 L${-400 + i * 110},-120Z`} boja="#6A4A2A" />
        <Boja d={`M${-440 + i * 110},-20 L${-440 + i * 110},-76 C${-440 + i * 110},-96 ${-400 + i * 110},-96 ${-400 + i * 110},-76 L${-400 + i * 110},-20Z`} boja="#6A4A2A" />
      </g>
    ))}
    <rect x={-500} y={-140} width={1000} height={10} fill={N.bela} />
  </g>
);

/** Tezga na pijaci sa platnenom nadstrešnicom. Ploča na y=-110. */
export const Tezga: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-250, 250].map((px) => (
      <rect key={px} x={px - 8} y={-420} width={16} height={420} fill={N.drvoTamno} />
    ))}
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${-270 + i * 67.5},-440 L${-270 + (i + 1) * 67.5},-440 L${-270 + (i + 1) * 67.5},-380 Q${-270 + (i + 0.5) * 67.5},-350 ${-270 + i * 67.5},-380Z`} fill={i % 2 ? N.bela : N.crvena} stroke={N.kontura} strokeWidth={2.5} />
      ))}
    </g>
    <Boja d={kutija(-280, -120, 560, 40, 6)} boja={N.drvo} />
    <Boja d="M-270,-80 L270,-80 L250,0 L-250,0Z" boja="#A87444" />
    <g transform="translate(0 -120)">{children}</g>
  </g>
);

/** Polica u radnji sa tetrapacima. */
export const PolicaRadnje: React.FC = () => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2400} fill="#E4ECEF" />
    {[300, 520, 740].map((yy) => (
      <g key={yy}>
        <Boja d={kutija(40, yy, 1000, 20, 4)} boja="#9AA6B2" />
        {Array.from({ length: 14 }, (_, i) => (
          <g key={i} transform={`translate(${90 + i * 68} ${yy})`}>
            <path d="M-24,0 L-24,-90 L0,-112 L24,-90 L24,0Z" fill={N.bela} stroke={N.kontura} strokeWidth={2} />
            <rect x={-24} y={-56} width={48} height={24} fill={i % 3 ? N.plavaSvetla : N.crvena} />
          </g>
        ))}
      </g>
    ))}
    <rect x={-200} y={1260} width={1480} height={800} fill="#C9CFD4" />
  </g>
);

/** Karta okoline Sombora: Dunav, sela kao tačke, putevi; `mreza` 0–1 povezuje salaše nitima. */
export const Karta: React.FC<{ mreza: number }> = ({ mreza }) => {
  const sela: [number, number, string][] = [
    [540, 760, "Sombor"],
    [260, 560, "Bezdan"],
    [300, 980, "Kolut"],
    [820, 560, "Riđica"],
    [860, 980, "Stanišić"],
    [540, 1180, "Gakovo"],
  ];
  const salasi = Array.from({ length: 22 }, (_, i) => [180 + random(`ks${i}`) * 740, 470 + random(`ky${i}`) * 780] as [number, number]);
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={2400} fill="#F3E9CF" />
      <path d="M120,300 C200,500 100,700 160,900 C220,1100 120,1250 180,1400" stroke="#4E86D8" strokeWidth={36} fill="none" />
      <path d="M260,560 L540,760 L820,560 M540,760 L300,980 M540,760 L860,980 M540,760 L540,1180" stroke="#C9A85A" strokeWidth={10} fill="none" strokeDasharray="20 12" />
      {salasi.map(([x, y], i) => {
        const [sx, sy] = sela[i % sela.length];
        const p = Math.max(0, Math.min(1, mreza * 1.6 - (i / salasi.length) * 0.6));
        return (
          <g key={i}>
            {p > 0 && <path d={`M${x},${y} L${x + (sx - x) * p},${y + (sy - y) * p}`} stroke={N.zelena} strokeWidth={4} />}
            <circle cx={x} cy={y} r={10} fill={p > 0.95 ? N.zelena : N.bela} stroke={N.kontura} strokeWidth={2.5} />
          </g>
        );
      })}
      {sela.map(([x, y, ime]) => (
        <g key={ime}>
          <circle cx={x} cy={y} r={ime === "Sombor" ? 26 : 18} fill={N.crvena} stroke={N.kontura} strokeWidth={3} />
          <text x={x} y={y - 34} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={ime === "Sombor" ? 44 : 34} fill={N.kontura}>
            {ime}
          </text>
        </g>
      ))}
    </g>
  );
};

/** Gajba povrća iz bašte. */
export const Gajba: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-50, -10, 30, -30, 10, 50].map((cx, i) => (
      <Boja key={i} d={elipsa(cx, i < 3 ? -70 : -96, 24, 22)} boja={i % 2 ? N.crvena : "#E85A2A"} debljina={2} />
    ))}
    <Boja d={kutija(-90, -60, 180, 60, 4)} boja="#C9A06A" />
    <path d="M-90,-30 L90,-30" stroke="#8A6A3A" strokeWidth={4} />
  </g>
);
