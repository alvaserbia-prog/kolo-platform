// Predmeti videa „Trampa“, crtani kredom. Svaki je crtan oko svoje tačke oslonca (dno, sredina).
// Bela linija je `P.mastilo` (kreda), površine su kreda u boji (`Oblik`).
import React from "react";
import { P } from "./paleta";
import { RUKOPIS } from "./fontovi";
import { Linija, Oblik, elipsa, kutija, napredak, useF } from "./alat";

// ── Cipele ───────────────────────────────────────────────────────────────
/** Muška/ženska cipela gledana sa strane, vrh udesno. `rupa`: stara cipela sa rupom na vrhu. */
export const Cipela: React.FC<{ s?: number; boja?: string; rupa?: boolean; palac?: number; nova?: boolean }> = ({ s = 1, boja = P.drvo, rupa, palac = 0, nova }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-86,0 L-86,-70 C-86,-86 -70,-92 -56,-88 C-40,-60 -10,-56 14,-58 C50,-60 84,-44 96,-22 C102,-8 98,0 88,0Z" boja={boja} />
    <Oblik d="M-92,0 L100,0 L98,12 L-90,12Z" boja={P.drvoTamno} debljina={4} tekstura={0} />
    <Linija d="M-56,-88 C-46,-70 -30,-64 -14,-62" debljina={3.5} />
    {/* pertle */}
    {[-30, -12, 6].map((x, i) => (
      <Linija key={i} d={`M${x},${-64 + i * 1} l14,-12`} debljina={3} />
    ))}
    {nova && <path d="M40,-46 C60,-44 80,-34 88,-22" stroke="#fff" strokeWidth={6} opacity={0.55} fill="none" strokeLinecap="round" />}
    {rupa && (
      <g>
        <Oblik d={elipsa(66, -22, 28, 17)} boja={P.tabla} debljina={4} tekstura={0} />
        {palac > 0 && (
          <g transform={`translate(66 ${-20 - 14 * palac}) scale(${palac * 1.35})`}>
            <Oblik d="M-16,10 C-18,-10 -10,-22 0,-22 C10,-22 18,-10 16,10Z" boja={P.koza} debljina={3.5} tekstura={0} />
            <Linija d="M-8,-14 Q0,-18 8,-14" debljina={2.5} />
          </g>
        )}
        {/* konci oko rupe */}
        <Linija d="M48,-30 l-8,-8 M54,-34 l-4,-10 M92,-24 l8,-6" debljina={2.5} />
      </g>
    )}
  </g>
);

/** Par novih cipela. */
export const ParCipela: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = "#A0583A" }) => (
  <g transform={`scale(${s})`}>
    <g transform="translate(-20 -6) scale(0.92)">
      <Cipela boja={boja} nova />
    </g>
    <g transform="translate(30 10)">
      <Cipela boja={boja} nova />
    </g>
  </g>
);

// ── Drva ─────────────────────────────────────────────────────────────────
/** Cepanica gledana sa čela (krug sa godovima) ili sa strane. */
export const Cepanica: React.FC<{ x?: number; y?: number; r?: number }> = ({ x = 0, y = 0, r = 30 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Oblik d={elipsa(0, 0, r, r * 0.92)} boja={P.drvoSvetlo} debljina={4} tekstura={0.2} />
    <Linija d={`M${-r * 0.55},0 a${r * 0.55},${r * 0.5} 0 1,0 ${r * 1.1},0 a${r * 0.55},${r * 0.5} 0 1,0 ${-r * 1.1},0`} debljina={2.5} opacity={0.8} />
    <circle cx={0} cy={0} r={r * 0.15} fill={P.mastilo} opacity={0.8} />
  </g>
);

/** Naramak drva: cepanice složene u gomilu (čela ka gledaocu). `n` broj cepanica (1–10). */
export const Drva: React.FC<{ s?: number; n?: number }> = ({ s = 1, n = 10 }) => {
  const mesta: [number, number][] = [
    [-90, -32], [-30, -32], [30, -32], [90, -32], [-60, -88], [0, -88], [60, -88], [-30, -142], [30, -142], [0, -194],
  ];
  return (
    <g transform={`scale(${s})`}>
      {mesta.slice(0, n).map(([x, y], i) => (
        <Cepanica key={i} x={x} y={y} r={31} />
      ))}
    </g>
  );
};

/** Naramak u rukama: tri cepanice sa strane. */
export const Naramak: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[-26, 0, 26].map((y, i) => (
      <g key={i} transform={`translate(${(i % 2) * 14 - 7} ${y}) rotate(${-4 + i * 4})`}>
        <Oblik d={kutija(-80, -14, 160, 28, 12)} boja={P.drvo} debljina={3.5} tekstura={0.3} />
        <Oblik d={elipsa(80, 0, 9, 14)} boja={P.drvoSvetlo} debljina={3} tekstura={0} />
      </g>
    ))}
  </g>
);

// ── Oblačić misli ────────────────────────────────────────────────────────
/** Oblačić „treba mi…“ iznad lika: tri kružića ka liku (dole levo ili dole desno) i oblak sa crtežom. */
export const Oblacic: React.FC<{ w?: number; h?: number; rep?: "levo" | "desno"; children?: React.ReactNode; boja?: string }> = ({
  w = 300,
  h = 220,
  rep = "levo",
  children,
  boja = P.mastilo,
}) => {
  const rx = w / 2;
  const ry = h / 2;
  const n = 9;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const a2 = ((i + 0.5) / n) * Math.PI * 2;
    const x1 = Math.cos(a) * rx, y1 = Math.sin(a) * ry;
    const xc = Math.cos(a2) * rx * 1.22, yc = Math.sin(a2) * ry * 1.22;
    const x2 = Math.cos(((i + 1) / n) * Math.PI * 2) * rx, y2 = Math.sin(((i + 1) / n) * Math.PI * 2) * ry;
    if (i === 0) pts.push(`M${x1.toFixed(1)},${y1.toFixed(1)}`);
    if (i < n) pts.push(`Q${xc.toFixed(1)},${yc.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`);
  }
  const sx = rep === "levo" ? -1 : 1;
  return (
    <g>
      <path d={pts.join(" ") + "Z"} fill={P.tablaTamna} opacity={0.55} />
      <path d={pts.join(" ") + "Z"} fill="none" stroke={boja} strokeWidth={5} strokeLinejoin="round" />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={sx * (rx * 0.45 + k * 26)} cy={ry * 1.25 + k * 34} r={16 - k * 4} fill="none" stroke={boja} strokeWidth={4.5} />
      ))}
      {children}
    </g>
  );
};

// ── Krečenje ─────────────────────────────────────────────────────────────
export const Cetka: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <Oblik d={kutija(-10, -120, 20, 80, 6)} boja={P.drvo} debljina={3.5} tekstura={0} />
    <Oblik d="M-34,-44 L34,-44 L36,-10 L-36,-10Z" boja={P.mastiloSvetlo} debljina={3.5} tekstura={0} />
    <Oblik d="M-36,-10 L36,-10 L32,30 L-32,30Z" boja={P.belo} debljina={3.5} tekstura={0.3} />
    {[-24, -12, 0, 12, 24].map((x) => (
      <Linija key={x} d={`M${x},-6 L${x * 0.9},26`} debljina={2} opacity={0.5} />
    ))}
  </g>
);

export const Kofa: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Linija d="M-46,-96 C-40,-150 40,-150 46,-96" debljina={4} />
    <Oblik d="M-56,-100 L56,-100 L46,0 L-46,0Z" boja={P.plava} />
    <Oblik d={elipsa(0, -100, 56, 12)} boja={P.belo} debljina={3.5} tekstura={0} />
    <path d="M-30,-98 C-34,-80 -26,-70 -30,-56" stroke={P.belo} strokeWidth={9} strokeLinecap="round" fill="none" />
  </g>
);

// ── Znakovi ──────────────────────────────────────────────────────────────
export const Upitnik: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = P.mastilo }) => (
  <text x={0} y={0} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={190 * s} fill={boja}>
    ?
  </text>
);

/** Kvačica kredom; iscrtava se (napredak 0–1). */
export const Kvacica: React.FC<{ s?: number; napredak?: number; boja?: string }> = ({ s = 1, napredak: n = 1, boja = P.zelenaKreda }) => (
  <g transform={`scale(${s})`}>
    <Linija d="M-40,0 L-12,30 L46,-40" debljina={14} boja={boja} napredak={n} />
  </g>
);

/** Iks kredom (ne može). */
export const Iks: React.FC<{ s?: number; napredak?: number; boja?: string }> = ({ s = 1, napredak: n = 1, boja = P.ajvar }) => (
  <g transform={`scale(${s})`}>
    <Linija d="M-36,-36 L36,36" debljina={13} boja={boja} napredak={Math.min(1, n * 2)} />
    <Linija d="M36,-36 L-36,36" debljina={13} boja={boja} napredak={Math.max(0, n * 2 - 1)} />
  </g>
);

/** Sat sa kazaljkama (minutna i satna, u stepenima). */
export const Sat: React.FC<{ s?: number; min?: number; sati?: number }> = ({ s = 1, min = 0, sati = 90 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={elipsa(0, 0, 70, 70)} boja={P.krem} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={Math.sin(a) * 54} y1={-Math.cos(a) * 54} x2={Math.sin(a) * 62} y2={-Math.cos(a) * 62} stroke={P.tinta} strokeWidth={i % 3 ? 3 : 6} />;
    })}
    <line x1={0} y1={0} x2={Math.sin((sati * Math.PI) / 180) * 32} y2={-Math.cos((sati * Math.PI) / 180) * 32} stroke={P.tinta} strokeWidth={8} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.sin((min * Math.PI) / 180) * 50} y2={-Math.cos((min * Math.PI) / 180) * 50} stroke={P.tinta} strokeWidth={5} strokeLinecap="round" />
    <circle r={6} fill={P.tinta} />
  </g>
);

// ── Sredstva razmene kroz vreme (prvi način) ─────────────────────────────
export const DzakZita: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-70,0 C-90,-40 -86,-110 -56,-150 L-40,-170 C-20,-178 20,-178 40,-170 L56,-150 C86,-110 90,-40 70,0 C30,8 -30,8 -70,0Z" boja="#C9A86A" />
    <Linija d="M-44,-158 Q0,-146 44,-158" debljina={5} />
    {/* klasje na vrhu */}
    {[-22, 0, 22].map((x, i) => (
      <g key={i} transform={`translate(${x} -176) rotate(${(i - 1) * 18})`}>
        <Linija d="M0,0 L0,-60" debljina={3.5} boja={P.oker} />
        {[0, 1, 2, 3].map((k) => (
          <ellipse key={k} cx={k % 2 ? 7 : -7} cy={-24 - k * 10} rx={6} ry={10} fill={P.oker} transform={`rotate(${k % 2 ? 25 : -25} ${k % 2 ? 7 : -7} ${-24 - k * 10})`} />
        ))}
      </g>
    ))}
    <text x={0} y={-56} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.tinta} opacity={0.7}>
      žito
    </text>
  </g>
);

export const KockaSoli: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-60,0 L-60,-90 L0,-120 L60,-90 L60,0 L0,24Z" boja={P.belo} ivica={false} tekstura={0.2} />
    <Oblik d="M-60,-90 L0,-120 L60,-90 L0,-62Z" boja="#FFFFFF" debljina={4} tekstura={0} />
    <Oblik d="M-60,-90 L0,-62 L0,24 L-60,0Z" boja="#D9D4C6" debljina={4} tekstura={0.3} />
    <Oblik d="M60,-90 L0,-62 L0,24 L60,0Z" boja="#BDB7A8" debljina={4} tekstura={0.3} />
    {[[-34, -40], [-22, -16], [30, -50], [20, -20]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={3} fill={P.tinta} opacity={0.35} />
    ))}
  </g>
);

export const Skoljke: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Linija d="M-110,-110 Q0,-20 110,-110" debljina={3} />
    {[-80, -40, 0, 40, 80].map((x, i) => {
      const y = -110 + 90 * (1 - (x / 110) ** 2) * 0.82;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${x / 4})`}>
          <Oblik d="M-20,-4 C-24,-28 -10,-38 0,-38 C10,-38 24,-28 20,-4 C14,10 -14,10 -20,-4Z" boja="#E9D9C0" debljina={3.5} tekstura={0} />
          <Linija d="M0,-30 L0,4 M-10,-26 L-6,2 M10,-26 L6,2" debljina={2} opacity={0.6} />
        </g>
      );
    })}
  </g>
);

export const Zlatnik: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={elipsa(0, -60, 60, 60)} boja={P.zlatna} />
    <Linija d={`M-44,-60 a44,44 0 1,0 88,0 a44,44 0 1,0 -88,0`} debljina={3} opacity={0.7} />
    <text x={0} y={-40} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={56} fill={P.tinta} opacity={0.75}>
      Au
    </text>
  </g>
);

/** Novčanica (novac u prvom načinu — nikad POEN). */
export const Novcanica: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    <Oblik d={kutija(-100, -110, 200, 100, 8)} boja="#9CC29A" />
    <Linija d="M-86,-96 L86,-96 L86,-24 L-86,-24Z" debljina={2.5} opacity={0.6} />
    <Oblik d={elipsa(0, -60, 26, 30)} boja="#BBD9B5" debljina={3} tekstura={0} />
    <text x={-62} y={-30} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={30} fill={P.tinta} opacity={0.75}>
      100
    </text>
    <text x={62} y={-74} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={30} fill={P.tinta} opacity={0.75}>
      100
    </text>
  </g>
);

// ── Zajednička sveska ───────────────────────────────────────────────────
export type Red = { ime: string; sta: string; at: number; boja?: string; podvuci?: number };

/**
 * Zajednička sveska nacrtana kredom: list sa spiralom gore, linije, redovi „Ime · šta je dao“ koji se
 * ispisuju slovo po slovo (od frejma `at`). `zaglavlje` (POEN) se ispisuje zelenom kredom gore desno.
 * `zatvorena` 0–1: korica se spusti preko lista (i vrati), redovi ostaju.
 */
export const Sveska: React.FC<{ w?: number; h?: number; redovi: Red[]; zaglavlje?: { tekst: string; at: number }; zatvorena?: number; prazanRed?: number; velicina?: number }> = ({
  w = 900,
  h = 460,
  redovi,
  zaglavlje,
  zatvorena = 0,
  prazanRed,
  velicina = 62,
}) => {
  const f = useF();
  const korak = velicina * 1.2;
  const prvi = -h / 2 + 70 + korak;
  return (
    <g>
      {/* list */}
      <Oblik d={kutija(-w / 2, -h / 2, w, h, 12)} boja="#1E3527" ivica={P.mastilo} debljina={6} tekstura={0} />
      {Array.from({ length: Math.floor((h - 90) / korak) }, (_, i) => (
        <line key={i} x1={-w / 2 + 24} y1={prvi + 16 + i * korak} x2={w / 2 - 24} y2={prvi + 16 + i * korak} stroke="#9FC0B0" strokeWidth={3} opacity={0.45} />
      ))}
      <line x1={-w / 2 + 92} y1={-h / 2 + 40} x2={-w / 2 + 92} y2={h / 2 - 12} stroke={P.ajvar} strokeWidth={3} opacity={0.6} />
      {/* spirala */}
      {Array.from({ length: Math.floor(w / 60) }, (_, i) => (
        <path key={i} d={`M${-w / 2 + 40 + i * 60},${-h / 2 + 22} q-14,-34 6,-40 q14,4 8,34`} fill="none" stroke={P.mastilo} strokeWidth={5} strokeLinecap="round" />
      ))}
      <g fontFamily={RUKOPIS} fontWeight={700}>
        {zaglavlje && f >= zaglavlje.at && (
          <text x={w / 2 - 40} y={-h / 2 + 82} textAnchor="end" fontSize={velicina * 1.1} fill={P.zelenaKreda}>
            {zaglavlje.tekst.slice(0, Math.max(1, Math.floor(napredak(f, zaglavlje.at, 12) * zaglavlje.tekst.length)))}
          </text>
        )}
        {redovi.map((r, i) => {
          if (f < r.at) return null;
          const tekst = `${r.ime} · ${r.sta}`;
          const n = Math.max(1, Math.floor(napredak(f, r.at, 24) * tekst.length));
          const y = prvi + i * korak;
          return (
            <g key={i}>
              <text x={-w / 2 + 110} y={y} fontSize={velicina} fill={r.boja ?? P.mastilo}>
                {tekst.slice(0, n)}
              </text>
              {r.podvuci !== undefined && f >= r.podvuci && (
                <Linija d={`M${-w / 2 + 104},${y + 14} L${-w / 2 + 120 + tekst.length * velicina * 0.42},${y + 10}`} boja={P.zelenaKreda} debljina={7} napredak={napredak(f, r.podvuci, 10)} />
              )}
            </g>
          );
        })}
        {prazanRed !== undefined && f >= prazanRed && (
          <text x={-w / 2 + 110} y={prvi + redovi.length * korak} fontSize={velicina} fill={P.zelenaKreda}>
            {"Ti · "}
            <tspan opacity={Math.floor((f - prazanRed) / 10) % 2 ? 1 : 0.15}>|</tspan>
          </text>
        )}
      </g>
      {/* korica koja se spušta preko lista */}
      {zatvorena > 0.01 && (
        <g>
          <Oblik d={kutija(-w / 2 - 8, -h / 2 - 8, w + 16, (h + 16) * zatvorena, 12)} boja={P.plava} debljina={6} tekstura={0.35} />
          {zatvorena > 0.7 && (
            <text x={0} y={-h / 2 + (h * zatvorena) / 2 + 20} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={velicina} fill={P.mastilo} opacity={(zatvorena - 0.7) / 0.3}>
              zajednička sveska
            </text>
          )}
        </g>
      )}
    </g>
  );
};

// ── Radnja i police ─────────────────────────────────────────────────────
/** Polica (daska sa nosačima) širine w. */
export const Daska: React.FC<{ w: number }> = ({ w }) => (
  <g>
    <Oblik d={kutija(-w / 2, -8, w, 22, 4)} boja={P.drvo} debljina={4} tekstura={0.3} />
    <Linija d={`M${-w / 2 + 30},14 l0,30 l30,-30 M${w / 2 - 30},14 l0,30 l-30,-30`} debljina={4} />
  </g>
);

/** Obućarska tezga sa nakovnjem i čekićem. */
export const Tezga: React.FC<{ w?: number }> = ({ w = 520 }) => (
  <g>
    <Oblik d={kutija(-w / 2, -150, w, 40, 6)} boja={P.drvoSvetlo} />
    <Oblik d={kutija(-w / 2 + 20, -110, w - 40, 110, 4)} boja={P.drvo} />
    <Linija d={`M${-w / 2 + 40},-80 L${w / 2 - 40},-80 M${-w / 2 + 40},-40 L${w / 2 - 40},-40`} debljina={3} opacity={0.6} />
    {/* nakovanj (kalup) */}
    <Oblik d="M-120,-150 L-120,-200 L-60,-200 L-40,-230 L60,-230 C80,-230 90,-210 70,-200 L-20,-200 L-20,-150Z" boja={P.mastiloSvetlo} />
    {/* čekić */}
    <g transform="translate(150 -164) rotate(-20)">
      <Oblik d={kutija(-8, -10, 16, 90, 5)} boja={P.drvo} debljina={3.5} tekstura={0} />
      <Oblik d={kutija(-34, -30, 68, 26, 5)} boja={P.mastiloSvetlo} debljina={3.5} tekstura={0} />
    </g>
  </g>
);
