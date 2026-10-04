// Stari svet ovog videa: Mesopotamija (glinena pločica, skladište, ovce, vuna, ulje, zigurat) i
// Andi (kipu, kolke, lama, kukuruz, krompir, mapa). Sve je gvaš slikovnice, crtano oko tačke oslonca
// (obično dno, sredina), kao u predmeti.tsx.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { RUKOPIS, SANS, SERIF } from "./fontovi";
import { Linija, Oblik, elipsa, kutija } from "./alat";

export const GLINA = "#C89A6A";
export const GLINA_TAMNA = "#9C6B43";
export const GLINA_SVETLA = "#DDB88E";
export const PESAK = "#E6CB94";
export const OPEKA = "#C48A5A";

// ── Znaci na pločici (rano klinasto pismo: urezani crteži i otisci brojeva) ─────────────────
/** Otisak broja: krug = deset, polukrug (D) = jedan. */
const Broj: React.FC<{ n: number; x: number; y: number; s?: number }> = ({ n, x, y, s = 1 }) => {
  const desetice = Math.floor(n / 10);
  const jedinice = n % 10;
  const out: React.ReactNode[] = [];
  let k = 0;
  for (let i = 0; i < desetice; i++, k++)
    out.push(<circle key={`d${i}`} cx={x + k * 26 * s} cy={y} r={10 * s} fill="#7A4E2E" stroke={P.mastilo} strokeWidth={2} opacity={0.95} />);
  for (let i = 0; i < jedinice; i++, k++)
    out.push(<path key={`j${i}`} d={`M${x + k * 26 * s - 9 * s},${y - 11 * s} Q${x + k * 26 * s + 12 * s},${y} ${x + k * 26 * s - 9 * s},${y + 11 * s}Z`} fill="#7A4E2E" stroke={P.mastilo} strokeWidth={2} opacity={0.95} />);
  return <g>{out}</g>;
};

export type ZnakVrsta = "ovca" | "vuna" | "ulje" | "covek" | "zena" | "lira" | "vaga" | "zito";
/** Urezan crtež na glini (piktogram). */
export const Znak: React.FC<{ v: ZnakVrsta; x: number; y: number; s?: number }> = ({ v, x, y, s = 1 }) => {
  const st = { fill: "none", stroke: "#5E3A20", strokeWidth: 6.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {v === "ovca" && (
        <>
          <circle r={20} {...st} />
          <path d="M-20,0 L20,0 M0,-20 L0,20" {...st} />
        </>
      )}
      {v === "vuna" && <path d="M-18,18 L0,-20 L18,18Z M-8,4 L8,4 M-12,12 L12,12" {...st} />}
      {v === "ulje" && <path d="M-10,-20 L10,-20 M-8,-20 C-8,-10 -20,-4 -18,8 C-16,20 16,20 18,8 C20,-4 8,-10 8,-20" {...st} />}
      {v === "covek" && <path d="M0,-22 a7,7 0 1,0 0.1,0 M0,-8 L0,10 M-12,-2 L12,-2 M0,10 L-10,22 M0,10 L10,22" {...st} />}
      {v === "zena" && <path d="M0,-22 a7,7 0 1,0 0.1,0 M0,-8 L-12,20 L12,20Z M-12,-2 L12,-2" {...st} />}
      {v === "lira" && <path d="M-14,20 L-14,-16 M14,20 L14,-16 M-18,-16 L18,-16 M-14,20 L14,20 M-6,-16 L-6,20 M2,-16 L2,20 M10,-16 L10,20" {...st} />}
      {v === "vaga" && <path d="M0,-20 L0,20 M-20,-12 L20,-12 M-20,-12 L-26,6 L-14,6Z M20,-12 L14,6 L26,6Z M-10,20 L10,20" {...st} />}
      {v === "zito" && <path d="M0,22 L0,-20 M0,-12 L-10,-20 M0,-12 L10,-20 M0,-2 L-10,-10 M0,-2 L10,-10 M0,8 L-10,0 M0,8 L10,0" {...st} />}
    </g>
  );
};

export type RedPlocice = { ko: ZnakVrsta; sta: ZnakVrsta; koliko: number };
/** Glinena pločica sa redovima „ko · šta · koliko“; `napredak[i]` 0–1 iscrtava red i. */
export const Plocica: React.FC<{ w?: number; h?: number; redovi?: RedPlocice[]; napredak?: number[]; znaci?: ZnakVrsta[]; sveza?: boolean; sjaj?: number }> = ({
  w = 420,
  h = 300,
  redovi = [],
  napredak = [],
  znaci,
  sveza,
  sjaj = 0,
}) => {
  const visRed = (h - 40) / Math.max(1, redovi.length);
  return (
    <g>
      {sjaj > 0 && <ellipse cx={0} cy={-h / 2} rx={w * 0.8} ry={h * 0.8} fill="url(#toplaSvetlost)" opacity={sjaj} />}
      <Oblik d={kutija(-w / 2 + 8, -h + 10, w, h, 46)} boja={P.senka} ivica={false} opacity={0.3} tekstura={0} />
      <Oblik d={kutija(-w / 2, -h, w, h, 46)} boja={sveza ? "#B98A5C" : GLINA} debljina={4.5} tekstura={0.55} />
      {/* ispupčenje (jastuče) i ivica */}
      <path d={kutija(-w / 2 + 14, -h + 12, w - 28, h - 26, 36)} fill="none" stroke={GLINA_SVETLA} strokeWidth={5} opacity={0.6} />
      {redovi.map((r, i) => {
        const p = napredak[i] ?? 1;
        if (p <= 0) return null;
        const y = -h + 20 + visRed * (i + 0.5);
        return (
          <g key={i} opacity={Math.min(1, p * 2)}>
            {i > 0 && <line x1={-w / 2 + 24} y1={y - visRed / 2} x2={w / 2 - 24} y2={y - visRed / 2} stroke={GLINA_TAMNA} strokeWidth={3} opacity={0.6} />}
            <Znak v={r.ko} x={-w * 0.36} y={y} s={Math.min(1.4, visRed / 60)} />
            {p > 0.3 && <Znak v={r.sta} x={-w * 0.16} y={y} s={Math.min(1.4, visRed / 60)} />}
            {p > 0.6 && <Broj n={r.koliko} x={w * 0.02} y={y} s={Math.min(1, visRed / 80)} />}
          </g>
        );
      })}
      {znaci && (
        <g>
          {znaci.map((z, i) => (
            <Znak key={i} v={z} x={0} y={-h / 2} s={2.2} />
          ))}
        </g>
      )}
    </g>
  );
};

/** Trska (pisaljka) — vrh u (0,0). */
export const Trska: React.FC<{ rot?: number }> = ({ rot = -30 }) => (
  <g transform={`rotate(${rot})`}>
    <path d="M0,0 L-6,-14 L-6,-170 L6,-170 L6,-14Z" fill="#C8B26A" stroke={P.mastilo} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-6,-60 L6,-60 M-6,-120 L6,-120" stroke={P.mastilo} strokeWidth={2} opacity={0.6} />
  </g>
);

// ── Mesopotamija ─────────────────────────────────────────────────────────
export const Pustinja: React.FC<{ nebo?: string; tlo?: string; horizont?: number }> = ({ nebo = "#E9C98C", tlo = PESAK, horizont = 980 }) => (
  <g>
    <rect x={-600} y={-300} width={2400} height={horizont + 300} fill={nebo} />
    <rect x={-600} y={-300} width={2400} height={horizont + 300} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
    <rect x={-600} y={horizont} width={2400} height={1600} fill={tlo} />
    <rect x={-600} y={horizont} width={2400} height={1600} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
  </g>
);

export const Sunce: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 90 }) => (
  <g>
    <circle cx={x} cy={y} r={r * 2.4} fill="url(#toplaSvetlost)" />
    <Oblik d={elipsa(x, y, r)} boja="#F2B54A" ivica={false} tekstura={0.25} />
  </g>
);

export const Zigurat: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = OPEKA }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-300,0 L-270,-90 L270,-90 L300,0Z" boja={boja} />
    <Oblik d="M-220,-90 L-196,-170 L196,-170 L220,-90Z" boja={boja} />
    <Oblik d="M-140,-170 L-122,-240 L122,-240 L140,-170Z" boja={boja} />
    <Oblik d="M-60,-240 L-54,-290 L54,-290 L60,-240Z" boja={GLINA_TAMNA} />
    <Oblik d="M-22,0 L-22,-240 L22,-240 L22,0Z" boja={GLINA_SVETLA} debljina={3} />
    {[-40, -130, -205].map((y) => (
      <line key={y} x1={-22} y1={y} x2={22} y2={y} stroke={P.mastilo} strokeWidth={2.5} opacity={0.5} />
    ))}
  </g>
);

export const Palma: React.FC<{ s?: number; nagib?: number }> = ({ s = 1, nagib = 0 }) => {
  const f = useCurrentFrame();
  const w = Math.sin(f / 30) * 3;
  return (
    <g transform={`scale(${s})`}>
      <Oblik d={`M-12,0 C-8,-120 ${nagib - 4},-260 ${nagib},-380 L${nagib + 16},-380 C${nagib + 12},-260 8,-120 14,0Z`} boja={P.drvo} />
      {[-150, -110, -60, -20, 20, 60, 110, 150].map((a, i) => (
        <g key={i} transform={`translate(${nagib + 8} -380) rotate(${a + w})`}>
          <Oblik d="M0,0 C30,-20 90,-30 150,10 C90,-6 40,0 0,8Z" boja={i % 2 ? P.zelenaPrigusena : P.zelenaTamna} debljina={3} tekstura={0.2} />
        </g>
      ))}
    </g>
  );
};

export const Trscak: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => {
  const f = useCurrentFrame();
  const n = Math.floor((x1 - x0) / 46);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * 46 + ((i * 37) % 19);
        const h = 70 + ((i * 53) % 50);
        const w = Math.sin((f + i * 9) / 24) * 4;
        return <Linija key={i} d={`M${x},${y} Q${x + w},${y - h / 2} ${x + w * 2},${y - h}`} boja={P.zelenaTamna} debljina={4} />;
      })}
    </g>
  );
};

/** Reka: talasasta traka, voda blago teče. */
export const Reka: React.FC<{ y: number; h?: number }> = ({ y, h = 90 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Oblik d={`M-200,${y} C200,${y - 20} 600,${y + 20} 1300,${y - 10} L1300,${y + h} C600,${y + h + 20} 200,${y + h - 20} -200,${y + h}Z`} boja="#6F9CB0" debljina={3.5} tekstura={0.25} />
      {[0, 1, 2].map((i) => {
        const x = ((f * 3 + i * 420) % 1500) - 300;
        return <Linija key={i} d={`M${x},${y + 30 + i * 18} q40,-10 80,0 t80,0`} boja="#fff" debljina={3} opacity={0.6} />;
      })}
    </g>
  );
};

export const Ovca: React.FC<{ s?: number; hod?: number; okreni?: boolean }> = ({ s = 1, hod = 0, okreni }) => {
  const a = Math.sin(hod) * 10;
  return (
    <g transform={`scale(${okreni ? -s : s} ${s})`}>
      {[-50, -20, 26, 56].map((x, i) => (
        <g key={x} transform={`translate(${x} -60) rotate(${i % 2 ? a : -a})`}>
          <path d="M0,0 L0,58" stroke={P.mastilo} strokeWidth={13} strokeLinecap="round" />
        </g>
      ))}
      <Oblik d="M-90,-90 C-110,-140 -60,-170 -20,-156 C0,-186 60,-180 70,-150 C110,-150 120,-100 96,-80 C100,-50 60,-40 30,-50 C0,-36 -50,-40 -66,-56 C-100,-56 -110,-80 -90,-90Z" boja={P.belo} debljina={4} tekstura={0.25} />
      <Oblik d="M70,-130 C90,-150 130,-146 136,-118 C140,-96 120,-80 100,-84 C86,-88 74,-104 70,-130Z" boja="#4B3B2E" debljina={3.5} />
      <circle cx={118} cy={-118} r={4} fill="#fff" />
      <Oblik d="M78,-138 C70,-150 60,-150 56,-140 C62,-132 70,-130 78,-134Z" boja="#4B3B2E" debljina={3} />
    </g>
  );
};

/** Bala vune (svezana), oslonac dole. */
export const Vuna: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-70,0 C-90,-30 -84,-90 -50,-104 C-20,-124 30,-120 56,-100 C90,-80 92,-24 70,0 C30,10 -30,10 -70,0Z" boja="#F3ECDD" debljina={4} tekstura={0.35} />
    {[[-40, -60], [0, -84], [36, -50], [-10, -30], [40, -88]].map(([x, y], i) => (
      <Linija key={i} d={`M${x - 14},${y} q14,-14 28,0`} debljina={3} opacity={0.4} />
    ))}
    <Linija d="M-80,-50 C-30,-40 30,-40 82,-52" boja={P.drvo} debljina={6} />
  </g>
);

/** Ćup (amfora) za ulje. */
export const Cup: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = GLINA }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-24,-150 L24,-150 L22,-130 C60,-110 66,-50 40,-14 C30,0 -30,0 -40,-14 C-66,-50 -60,-110 -22,-130Z" boja={boja} debljina={4} tekstura={0.4} />
    <Oblik d="M-30,-154 L30,-154 L30,-142 L-30,-142Z" boja={GLINA_TAMNA} debljina={3} />
    <path d="M-40,-90 C-10,-82 10,-82 40,-90" fill="none" stroke={GLINA_TAMNA} strokeWidth={6} opacity={0.7} />
    <path d="M-44,-70 C-10,-62 10,-62 44,-70" fill="none" stroke={P.mastilo} strokeWidth={3} opacity={0.35} strokeDasharray="8 8" />
  </g>
);

/** Skladište od opeke sa ulazom. Oslonac dole, sredina. */
export const Skladiste: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-260,0 L-260,-300 L260,-300 L260,0Z" boja={OPEKA} />
    {Array.from({ length: 9 }, (_, r) => (
      <line key={r} x1={-260} y1={-30 - r * 30} x2={260} y2={-30 - r * 30} stroke={P.mastilo} strokeWidth={2} opacity={0.22} />
    ))}
    <Oblik d="M-280,-300 L280,-300 L280,-336 L-280,-336Z" boja={GLINA_TAMNA} />
    {[-220, -140, -60, 20, 100, 180].map((x) => (
      <Oblik key={x} d={`M${x},-336 L${x},-370 L${x + 50},-370 L${x + 50},-336Z`} boja={GLINA_TAMNA} debljina={3} />
    ))}
    <Oblik d="M-70,0 L-70,-170 C-70,-220 70,-220 70,-170 L70,0Z" boja="#4A3324" />
    <path d="M-70,-170 C-70,-220 70,-220 70,-170" fill="none" stroke={GLINA_SVETLA} strokeWidth={8} />
  </g>
);

// ── Muzej ────────────────────────────────────────────────────────────────
export const Vitrina: React.FC<{ w?: number; h?: number; children?: React.ReactNode; svetlo?: number }> = ({ w = 640, h = 520, children, svetlo = 1 }) => (
  <g>
    {/* postolje */}
    <Oblik d={`M${-w / 2 + 30},0 L${-w / 2 + 30},300 L${w / 2 - 30},300 L${w / 2 - 30},0Z`} boja="#6F5B4B" />
    <Oblik d={`M${-w / 2 - 10},-20 L${w / 2 + 10},-20 L${w / 2 + 10},14 L${-w / 2 - 10},14Z`} boja={P.drvoTamno} />
    {/* svetlo odozgo */}
    <path d={`M${-w / 2},${-h} L${w / 2},${-h} L${w / 2},-20 L${-w / 2},-20Z`} fill="#FFF6DD" opacity={0.25 * svetlo} />
    {children}
    {/* staklo */}
    <path d={`M${-w / 2},${-h} L${w / 2},${-h} L${w / 2},-20 L${-w / 2},-20Z`} fill="url(#stakloG)" opacity={0.9} />
    <path d={`M${-w / 2},${-h} L${w / 2},${-h} L${w / 2},-20 L${-w / 2},-20Z`} fill="none" stroke={P.mastilo} strokeWidth={4} />
    <Oblik d={`M${-w / 2 - 14},${-h - 24} L${w / 2 + 14},${-h - 24} L${w / 2 + 14},${-h} L${-w / 2 - 14},${-h}Z`} boja={P.drvoTamno} />
  </g>
);

/** Muzejska cedulja (tekst u svetu priče). */
export const MuzejCedulja: React.FC<{ redovi: string[]; w?: number }> = ({ redovi, w = 380 }) => (
  <g>
    <Oblik d={kutija(-w / 2, 0, w, 40 + redovi.length * 40, 6)} boja={P.belo} debljina={3} tekstura={0.12} />
    {redovi.map((r, i) => (
      <text key={i} x={-w / 2 + 22} y={44 + i * 40} fontFamily={i === 0 ? SERIF : SANS} fontWeight={700} fontStyle={i === 0 ? "italic" : "normal"} fontSize={i === 0 ? 32 : 26} fill={P.mastilo}>
        {r}
      </text>
    ))}
  </g>
);

// ── Andi ─────────────────────────────────────────────────────────────────
export const Andi: React.FC<{ nebo?: string; sneg?: boolean }> = ({ nebo = "#A9C9CC", sneg = true }) => (
  <g>
    <rect x={-600} y={-300} width={2400} height={1500} fill={nebo} />
    <rect x={-600} y={-300} width={2400} height={1500} fill="url(#gvasP)" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
    {/* daleki vrhovi */}
    <Oblik d="M-200,820 L60,420 L220,600 L420,300 L640,620 L820,380 L1080,700 L1300,520 L1300,1000 L-200,1000Z" boja="#7E97A6" debljina={3.5} tekstura={0.3} />
    {sneg && (
      <>
        <Oblik d="M60,420 L20,480 L60,470 L90,500 L120,470Z" boja={P.belo} debljina={3} tekstura={0.1} />
        <Oblik d="M420,300 L370,370 L410,360 L440,390 L470,350Z" boja={P.belo} debljina={3} tekstura={0.1} />
        <Oblik d="M820,380 L780,440 L820,430 L850,460 L870,430Z" boja={P.belo} debljina={3} tekstura={0.1} />
      </>
    )}
    {/* bliže padine */}
    <Oblik d="M-200,900 C100,760 300,820 520,740 C760,660 980,780 1300,700 L1300,2200 L-200,2200Z" boja={P.zelenaPrigusena} debljina={3.5} tekstura={0.35} />
  </g>
);

/** Terase na padini (kamene ivice). */
export const Terase: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <Oblik d={`M${-360 + i * 30},${-i * 70} C${-120},${-i * 70 - 16} ${120},${-i * 70 - 16} ${360 - i * 30},${-i * 70} L${360 - i * 30},${-i * 70 + 26} C120,${-i * 70 + 10} -120,${-i * 70 + 10} ${-360 + i * 30},${-i * 70 + 26}Z`} boja="#9AA05C" debljina={3} tekstura={0.3} />
        <path d={`M${-360 + i * 30},${-i * 70 + 26} C-120,${-i * 70 + 10} 120,${-i * 70 + 10} ${360 - i * 30},${-i * 70 + 26}`} fill="none" stroke="#7B6A58" strokeWidth={8} strokeDasharray="14 6" />
      </g>
    ))}
  </g>
);

export const Lama: React.FC<{ s?: number; okreni?: boolean; tovar?: string; hod?: number }> = ({ s = 1, okreni, tovar, hod = 0 }) => {
  const a = Math.sin(hod) * 9;
  return (
    <g transform={`scale(${okreni ? -s : s} ${s})`}>
      {[-50, -24, 34, 58].map((x, i) => (
        <g key={x} transform={`translate(${x} -110) rotate(${i % 2 ? a : -a})`}>
          <path d="M0,0 L0,108" stroke={P.mastilo} strokeWidth={14} strokeLinecap="round" />
          <path d="M0,0 L0,108" stroke="#E9DCC6" strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
      <Oblik d="M-80,-120 C-90,-170 -40,-186 10,-178 C50,-176 86,-170 90,-130 C94,-104 60,-96 10,-98 C-40,-98 -76,-96 -80,-120Z" boja="#E9DCC6" debljina={4} tekstura={0.3} />
      <Oblik d="M60,-160 C56,-220 62,-270 76,-300 L106,-300 C112,-268 100,-220 96,-150Z" boja="#E9DCC6" debljina={4} tekstura={0.3} />
      <Oblik d="M70,-300 C72,-330 120,-338 136,-312 C142,-298 132,-288 112,-290 L80,-286Z" boja="#E9DCC6" debljina={4} tekstura={0.3} />
      <Oblik d="M78,-318 L74,-350 L90,-326Z" boja="#E9DCC6" debljina={3} />
      <Oblik d="M96,-322 L98,-354 L108,-324Z" boja="#E9DCC6" debljina={3} />
      <circle cx={112} cy={-310} r={4.5} fill={P.mastilo} />
      {/* tkanina na leđima */}
      <Oblik d="M-50,-176 L40,-178 L44,-118 L-46,-116Z" boja={tovar ?? P.ajvar} debljina={3} tekstura={0.2} />
      <path d="M-46,-150 L42,-150" stroke={P.oker} strokeWidth={8} strokeDasharray="10 6" />
    </g>
  );
};

/** Kolka: okruglo kameno skladište sa slamnim krovom (Andi). */
export const Kolka: React.FC<{ s?: number; ikona?: React.ReactNode }> = ({ s = 1, ikona }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-90,0 L-90,-150 L90,-150 L90,0Z" boja="#B4A38E" />
    {[0, 1, 2, 3].map((r) => (
      <line key={r} x1={-90} y1={-30 - r * 34} x2={90} y2={-30 - r * 34} stroke={P.mastilo} strokeWidth={2} opacity={0.3} />
    ))}
    <Oblik d="M-110,-146 C-70,-260 70,-260 110,-146Z" boja="#C9A65A" />
    {[-70, -30, 10, 50].map((x) => (
      <Linija key={x} d={`M${x},-150 L${x + 14},-230`} debljina={2.5} opacity={0.4} />
    ))}
    <Oblik d="M-24,0 L-24,-70 L24,-70 L24,0Z" boja="#4A3324" debljina={3} />
    {ikona && <g transform="translate(0 -300)">{ikona}</g>}
  </g>
);

export const Kukuruz: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-10,0 C-40,-30 -40,-80 -26,-106 C-50,-60 -30,-20 -10,0Z" boja={P.zelenaPrigusena} debljina={3} />
    <Oblik d="M0,-6 C-26,-40 -26,-100 0,-130 C26,-100 26,-40 0,-6Z" boja="#E9B93C" debljina={3.5} tekstura={0.2} />
    {[-110, -92, -74, -56, -38, -20].map((y) => (
      <line key={y} x1={-16} y1={y} x2={16} y2={y} stroke={P.mastilo} strokeWidth={2} opacity={0.4} />
    ))}
    <Oblik d="M10,0 C40,-30 40,-80 26,-106 C50,-60 30,-20 10,0Z" boja={P.zelenaTamna} debljina={3} />
  </g>
);

export const Krompir: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-50,-10 C-60,-50 -20,-70 10,-64 C50,-60 66,-36 54,-12 C44,6 -36,10 -50,-10Z" boja="#B98556" debljina={3.5} tekstura={0.35} />
    {[[-20, -40], [14, -30], [30, -48]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={3.5} fill={P.drvoTamno} />
    ))}
  </g>
);

export const VunaAndi: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={elipsa(0, -48, 52, 46)} boja="#F1E8D8" debljina={3.5} tekstura={0.3} />
    {[-30, -10, 10, 30].map((x) => (
      <path key={x} d={`M${x},-90 C${x + 20},-60 ${x - 20},-30 ${x},-6`} fill="none" stroke={P.mastilo} strokeWidth={2.5} opacity={0.35} />
    ))}
  </g>
);

export type Konac = { boja: string; cvorovi: number[]; napredak?: number; cvorNapredak?: number };
/**
 * Kipu: glavni konopac vodoravno (y = 0, od x0 do x1), sa njega vise obojeni konci; na koncu su
 * čvorovi (grupe: stotine gore, desetice u sredini, jedinice dole — kao kod Inka).
 */
export const Kipu: React.FC<{ konci: Konac[]; x0?: number; x1?: number; duzina?: number; glavni?: string }> = ({ konci, x0 = -380, x1 = 380, duzina = 560, glavni = "#D8C6A0" }) => {
  const f = useCurrentFrame();
  const korak = (x1 - x0) / (konci.length + 1);
  return (
    <g>
      <path d={`M${x0 - 40},0 C${x0},-12 ${x1},-12 ${x1 + 40},0`} stroke={P.mastilo} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M${x0 - 40},0 C${x0},-12 ${x1},-12 ${x1 + 40},0`} stroke={glavni} strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d={`M${x0 - 40},0 C${x0},-12 ${x1},-12 ${x1 + 40},0`} stroke={P.mastilo} strokeWidth={2} fill="none" strokeDasharray="6 10" opacity={0.5} />
      {konci.map((k, i) => {
        const x = x0 + korak * (i + 1);
        const p = k.napredak ?? 1;
        if (p <= 0) return null;
        const L = duzina * p;
        const njih = Math.sin((f + i * 17) / 26) * 6;
        const d = `M${x},-6 Q${x + njih / 2},${L / 2} ${x + njih},${L}`;
        const cn = k.cvorNapredak ?? 1;
        return (
          <g key={i}>
            <path d={d} stroke={P.mastilo} strokeWidth={15} fill="none" strokeLinecap="round" />
            <path d={d} stroke={k.boja} strokeWidth={9} fill="none" strokeLinecap="round" />
            {/* čvorovi: tri mesta (stotine, desetice, jedinice) */}
            {k.cvorovi.map((n, mesto) =>
              Array.from({ length: n }, (_, j) => {
                const y = 90 + mesto * 170 + j * 24;
                const vidljiv = cn * k.cvorovi.reduce((a, b) => a + b, 0) > k.cvorovi.slice(0, mesto).reduce((a, b) => a + b, 0) + j;
                if (y > L - 10 || !vidljiv) return null;
                const xx = x + (njih * y) / L;
                return <ellipse key={`${mesto}-${j}`} cx={xx} cy={y} rx={13} ry={10} fill={k.boja} stroke={P.mastilo} strokeWidth={3.5} />;
              }),
            )}
            {p >= 1 && <path d={`M${x + njih - 6},${L} l6,22 l6,-22`} fill={k.boja} stroke={P.mastilo} strokeWidth={3} />}
          </g>
        );
      })}
    </g>
  );
};

/** Natpis-kartuša sa mestom i vremenom (nosi ono što ni titl ni slika ne kažu). */
export const MestoVreme: React.FC<{ mesto: string; vreme: string; s?: number; boja?: string }> = ({ mesto, vreme, s = 1, boja = P.krem }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-300, -70, 600, 150, 22)} boja={boja} debljina={4.5} tekstura={0.18} />
    <rect x={-288} y={-58} width={576} height={126} rx={16} fill="none" stroke={P.vez} strokeWidth={2.5} strokeDasharray="10 6" />
    <text x={0} y={-6} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={46} letterSpacing={3} fill={P.mastilo}>
      {mesto}
    </text>
    <text x={0} y={48} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.ajvarTamni}>
      {vreme}
    </text>
  </g>
);

/** Novčić (samo za „novac“ kod Inka; POEN se nikad ne crta kao novčić). */
export const Novcic: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={elipsa(0, 0, 60)} boja={P.zlatna} debljina={4.5} tekstura={0.3} />
    <circle r={44} fill="none" stroke={P.mastilo} strokeWidth={3} opacity={0.5} />
    <path d="M-14,-20 L14,-20 M0,-20 L0,24" stroke={P.mastilo} strokeWidth={5} opacity={0.5} strokeLinecap="round" />
  </g>
);
