// Predmeti i pozadine videa „Stari oblici novca“: žito (vreća, gomila, klas), kocka soli (amole),
// školjka kauri, brod, litice Egipta, etiopska visoravan, more, njiva, mapa Starog sveta,
// knjiga zapisa (KOLO) i likovi starog sveta. Sve je SVG u prostoru 1080×1920, alat iz alat.tsx.
import React from "react";
import { random } from "remotion";
import { P } from "./paleta";
import { Linija, Oblik, elipsa, kutija } from "./alat";
import type { GlavaCfg } from "./likovi";
import { SANS, SERIF, RUKOPIS } from "./fontovi";

export const D = {
  zito: "#D9AE5C",
  zitoTamno: "#A9782F",
  dzak: "#BF9A63",
  dzakTamni: "#8C6A3C",
  so: "#F4F0E6",
  soSenka: "#CFC8B8",
  skoljka: "#F3E7CC",
  skoljkaLedja: "#D8B98C",
  pesak: "#E7C98E",
  pesakTamni: "#C99A55",
  litica: "#D59A5A",
  liticaTamna: "#A86A35",
  more: "#5E8FA0",
  moreTamno: "#3F6E80",
  plesan: "#7F9A5A",
  kozaEgipat: "#B9784A",
  kozaEtiopija: "#8E5A3A",
  belo: "#F7F1E2",
};

// ── Likovi starog sveta (isti Lik iz likovi.tsx, druga odeća i koža) ──────────
export const EGIPCANIN = {
  odeca: { tip: "suknja", bluza: D.kozaEgipat, suknja: D.belo } as const,
  glava: { kosa: "mlad", bojaKose: "#1E1610", koza: D.kozaEgipat, seed: 12 } as GlavaCfg,
};
export const PISAR = {
  odeca: { tip: "suknja", bluza: D.belo, suknja: D.belo } as const,
  glava: { kosa: "mlad2", bojaKose: "#1E1610", koza: D.kozaEgipat, seed: 13 } as GlavaCfg,
};
export const ETIOPLJANIN = {
  odeca: { tip: "muski", kosulja: D.belo, pantalone: "#E9E0CC", prsluk: undefined } as const,
  glava: { kosa: "mlad", bojaKose: "#17110C", koza: D.kozaEtiopija, brkovi: true, seed: 14 } as GlavaCfg,
};
export const ETIOPLJANKA = {
  odeca: { tip: "haljina", haljina: D.belo } as const,
  glava: { kosa: "marama", bojaKose: "#E9E0CC", koza: D.kozaEtiopija, seed: 15 } as GlavaCfg,
};
export const TRGOVAC = {
  odeca: { tip: "muski", kosulja: "#3F5F7A", pantalone: "#2E4257", prsluk: "#8A5A3B" } as const,
  glava: { kosa: "kacket", bojaKose: P.kosaTamna, brkovi: true, seed: 16 } as GlavaCfg,
};
export const RATAR = {
  odeca: { tip: "muski", kosulja: P.krem, pantalone: P.drvo, prsluk: undefined } as const,
  glava: { kosa: "muz_sed", bojaKose: P.kosaSmedja, brkovi: true, seed: 17 } as GlavaCfg,
};
export const GRNCAR = {
  odeca: { tip: "suknja", bluza: P.oker, suknja: P.drvoTamno } as const,
  glava: { kosa: "marama", bojaKose: P.zelenaPrigusena, seed: 18 } as GlavaCfg,
};
export const TKALJA = {
  odeca: { tip: "suknja", bluza: P.roze, suknja: P.plava } as const,
  glava: { kosa: "rep", bojaKose: P.kosaRida, seed: 19 } as GlavaCfg,
};

// ── Žito ─────────────────────────────────────────────────────────────────────
/** Vreća žita (dno u 0,0). `plesan` 0–1: zelene mrlje i rupa kad se pokvari. */
export const Vreca: React.FC<{ s?: number; plesan?: number; otvorena?: boolean }> = ({ s = 1, plesan = 0, otvorena }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={4} rx={120} ry={16} fill={P.senka} opacity={0.2} />
    <Oblik d="M-104,0 C-128,-70 -118,-170 -70,-226 C-50,-246 50,-246 70,-226 C118,-170 128,-70 104,0 C60,10 -60,10 -104,0Z" boja={D.dzak} />
    {/* tkanje */}
    {[-60, -20, 20, 60].map((x) => (
      <Linija key={x} d={`M${x},-10 Q${x * 1.1},-120 ${x * 0.7},-226`} debljina={2} opacity={0.25} />
    ))}
    {otvorena ? (
      <>
        <Oblik d={elipsa(0, -232, 70, 18)} boja={D.dzakTamni} debljina={3} />
        <Oblik d={elipsa(0, -236, 58, 14)} boja={D.zito} debljina={2} tekstura={0.5} />
      </>
    ) : (
      <>
        <Oblik d="M-50,-236 C-40,-262 -20,-280 0,-284 C20,-280 40,-262 50,-236 C20,-244 -20,-244 -50,-236Z" boja={D.dzak} debljina={3} />
        <Oblik d={kutija(-46, -248, 92, 16, 8)} boja={D.dzakTamni} debljina={3} tekstura={0} />
      </>
    )}
    {plesan > 0 && (
      <g opacity={plesan}>
        {[
          [-50, -80, 26], [30, -140, 20], [60, -60, 16], [-20, -170, 14], [-70, -150, 12], [10, -40, 18],
        ].map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r * (0.6 + plesan * 0.6)} fill={D.plesan} opacity={0.75} />
            <circle cx={x + r * 0.4} cy={y - r * 0.3} r={r * 0.4 * plesan} fill="#B9C98A" opacity={0.7} />
          </g>
        ))}
        <Oblik d="M70,-30 C90,-40 104,-20 100,0 C86,6 72,2 66,-8Z" boja={P.mastilo} debljina={2} tekstura={0} opacity={0.85} />
      </g>
    )}
  </g>
);

/** Gomila zrnevlja (dno u 0,0), širina ~2·w. */
export const GomilaZrna: React.FC<{ w?: number; h?: number; seed?: string }> = ({ w = 120, h = 70, seed = "g" }) => (
  <g>
    <ellipse cx={0} cy={4} rx={w * 1.05} ry={12} fill={P.senka} opacity={0.18} />
    <Oblik d={`M${-w},0 C${-w * 0.6},${-h * 0.9} ${-w * 0.25},${-h} 0,${-h} C${w * 0.25},${-h} ${w * 0.6},${-h * 0.9} ${w},0Z`} boja={D.zito} debljina={3} />
    {Array.from({ length: Math.round(w / 4) }, (_, i) => {
      const t = random(`${seed}x${i}`) * 2 - 1;
      const yy = -random(`${seed}y${i}`) * h * (1 - t * t) * 0.9;
      return <ellipse key={i} cx={t * w * 0.92} cy={yy - 4} rx={5} ry={3} fill={D.zitoTamno} opacity={0.6} transform={`rotate(${random(`${seed}r${i}`) * 180} ${t * w * 0.92} ${yy - 4})`} />;
    })}
  </g>
);

/** Klas pšenice (dno stabljike u 0,0). `uveo` 0–1 savija i suši klas. */
export const Klas: React.FC<{ h?: number; uveo?: number; nagib?: number }> = ({ h = 220, uveo = 0, nagib = 0 }) => {
  const boja = uveo > 0.5 ? "#B59A6A" : D.zito;
  const sav = uveo * 70;
  return (
    <g transform={`rotate(${nagib})`}>
      <Linija d={`M0,0 Q${sav * 0.3},${-h * 0.6} ${sav},${-h + uveo * 40}`} debljina={4} boja={uveo > 0.5 ? "#9A8456" : P.zelenaPrigusena} />
      <g transform={`translate(${sav} ${-h + uveo * 40}) rotate(${sav * 1.4})`}>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <ellipse cx={-7} cy={-i * 13} rx={6} ry={10} fill={boja} stroke={P.mastilo} strokeWidth={2} transform={`rotate(-25 -7 ${-i * 13})`} />
            <ellipse cx={7} cy={-i * 13 - 6} rx={6} ry={10} fill={boja} stroke={P.mastilo} strokeWidth={2} transform={`rotate(25 7 ${-i * 13 - 6})`} />
          </g>
        ))}
        {uveo < 0.5 && <Linija d="M0,-70 L0,-110" debljina={1.5} opacity={0.6} />}
      </g>
    </g>
  );
};

// ── So ──────────────────────────────────────────────────────────────────────
/** Kocka soli „amole“ (izdužena šipka, centar u 0,0). `topi` 0–1: šipka se smanjuje i curi. */
export const Amole: React.FC<{ s?: number; topi?: number; rot?: number }> = ({ s = 1, topi = 0, rot = 0 }) => {
  const v = 34 * (1 - topi * 0.55);
  const w = 150 * (1 - topi * 0.18);
  return (
    <g transform={`rotate(${rot}) scale(${s})`}>
      <Oblik d={`M${-w / 2},${-v / 2 + 8} L${-w / 2 + 16},${-v / 2} L${w / 2 - 16},${-v / 2} L${w / 2},${-v / 2 + 8} L${w / 2},${v / 2} L${-w / 2},${v / 2}Z`} boja={D.so} debljina={3.5} tekstura={0.25} />
      <Linija d={`M${-w / 2 + 16},${-v / 2} L${-w / 2 + 16},${v / 2}`} debljina={2} opacity={0.35} />
      <Linija d={`M${w / 2 - 16},${-v / 2} L${w / 2 - 16},${v / 2}`} debljina={2} opacity={0.35} />
      {/* traka od trske */}
      <rect x={-8} y={-v / 2} width={16} height={v} fill={P.drvoSvetlo} stroke={P.mastilo} strokeWidth={2} />
      {topi > 0.05 && (
        <g opacity={Math.min(1, topi * 2)}>
          {[-50, -10, 34].map((x, i) => (
            <path key={i} d={`M${x},${v / 2} q-6,${14 + topi * 22} 0,${18 + topi * 26} q6,-4 0,${-18 - topi * 26}Z`} fill="#DCEAF0" stroke={P.mastilo} strokeWidth={1.5} />
          ))}
        </g>
      )}
    </g>
  );
};

// ── Školjka kauri ─────────────────────────────────────────────────────────────
/** Školjka kauri, viđena odozdo (prorez sa zupcima), centar 0,0, dužina ~2·40·s. */
export const Skoljka: React.FC<{ s?: number; rot?: number; ledja?: boolean }> = ({ s = 1, rot = 0, ledja }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={40} ry={28} fill={ledja ? D.skoljkaLedja : D.skoljka} stroke={P.mastilo} strokeWidth={3} />
    {ledja ? (
      <>
        {[[-14, -8], [8, -12], [18, 6], [-6, 10], [-24, 4]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={4} fill="#A9784A" opacity={0.6} />
        ))}
        <ellipse cx={-8} cy={-10} rx={14} ry={6} fill="#fff" opacity={0.35} />
      </>
    ) : (
      <>
        <path d="M-30,2 Q0,-6 30,2 Q0,8 -30,2Z" fill="#8C6A4A" stroke={P.mastilo} strokeWidth={2} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = -24 + i * 6;
          return <line key={i} x1={x} y1={-2} x2={x} y2={-8} stroke={P.mastilo} strokeWidth={1.6} />;
        })}
        {Array.from({ length: 9 }, (_, i) => {
          const x = -24 + i * 6;
          return <line key={`d${i}`} x1={x} y1={6} x2={x} y2={11} stroke={P.mastilo} strokeWidth={1.6} />;
        })}
        <ellipse cx={-12} cy={-16} rx={14} ry={5} fill="#fff" opacity={0.45} />
      </>
    )}
  </g>
);

/** Niz školjki na kanapu (kako su se nosile). */
export const NizSkoljki: React.FC<{ n?: number; s?: number }> = ({ n = 7, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Linija d={`M${-n * 26},-20 Q0,${30 + n * 4} ${n * 26},-20`} debljina={3} boja={P.drvo} />
    {Array.from({ length: n }, (_, i) => {
      const t = (i + 0.5) / n;
      const x = -n * 26 + t * n * 52;
      const y = -20 + 2 * t * (1 - t) * (50 + n * 4);
      return (
        <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
          <Skoljka s={0.42} rot={90 + (t - 0.5) * 60} ledja={i % 2 === 1} />
        </g>
      );
    })}
  </g>
);

// ── Pozadine ────────────────────────────────────────────────────────────────
/** Nebo + tlo: jednostavna pozadina sa horizontom. */
export const NeboTlo: React.FC<{ nebo: string; tlo: string; horizont?: number; tloTamno?: string }> = ({ nebo, tlo, horizont = 1000, tloTamno }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={horizont + 200} fill={nebo} />
    <rect x={-200} y={-200} width={1480} height={horizont + 200} fill="url(#gvasP)" opacity={0.2} style={{ mixBlendMode: "multiply" }} />
    <rect x={-200} y={horizont} width={1480} height={2200} fill={tlo} />
    {tloTamno && <rect x={-200} y={horizont} width={1480} height={30} fill={tloTamno} opacity={0.5} />}
    <rect x={-200} y={horizont} width={1480} height={2200} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
  </g>
);

export const Sunce: React.FC<{ x: number; y: number; r?: number; boja?: string; zraci?: number }> = ({ x, y, r = 80, boja = "#F2C14E", zraci = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2.6} fill="url(#toplaSvetlost)" />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d={`M0,${-r - 16} L10,${-r - 50} L-10,${-r - 50}Z`} fill={boja} opacity={0.6} transform={`rotate(${i * 30 + zraci})`} />
    ))}
    <Oblik d={elipsa(0, 0, r)} boja={boja} debljina={4} tekstura={0.2} />
  </g>
);

/** Litice Dolina kraljeva: okerne stene sa ulazom u grobnicu. */
export const Litice: React.FC<{ ulaz?: boolean }> = ({ ulaz = true }) => (
  <g>
    <Oblik d="M-200,1000 L-200,560 C-120,520 -40,470 60,480 C160,430 260,400 360,430 C460,380 560,360 660,400 C760,350 880,380 980,420 C1080,400 1200,430 1280,470 L1280,1000Z" boja={D.litica} />
    <Oblik d="M-200,1000 L-200,700 C-80,660 60,650 180,680 C320,640 460,630 600,660 C760,620 920,640 1280,690 L1280,1000Z" boja={D.liticaTamna} opacity={0.85} />
    {[[90, 560, 120], [300, 520, 160], [560, 470, 140], [820, 500, 170]].map(([x, y, h], i) => (
      <Linija key={i} d={`M${x},${y} Q${x + 14},${y + h / 2} ${x - 6},${y + h}`} debljina={3} opacity={0.35} />
    ))}
    {ulaz && (
      <g>
        <Oblik d="M610,1000 L610,800 C610,770 640,752 670,752 L790,752 C820,752 850,770 850,800 L850,1000Z" boja="#3A2418" />
        <Oblik d="M590,760 L870,760 L870,790 L590,790Z" boja={D.litica} debljina={3} />
      </g>
    )}
  </g>
);

/** More sa talasima (od y do dna). */
export const More: React.FC<{ y?: number; f: number }> = ({ y = 760, f }) => (
  <g>
    <rect x={-200} y={y} width={1480} height={600} fill={D.more} />
    <rect x={-200} y={y} width={1480} height={600} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 7 }, (_, i) => {
        const x = -120 + i * 200 + ((f * (1 + r * 0.2)) % 200) - (r % 2) * 100;
        const yy = y + 40 + r * 52;
        return <Linija key={`${r}-${i}`} d={`M${x},${yy} q25,-14 50,0 q25,14 50,0`} boja="#E8F0EE" debljina={3} opacity={0.55} />;
      }),
    )}
  </g>
);

/** Jedrenjak (dno trupa u 0,0). */
export const Brod: React.FC<{ s?: number; teret?: number }> = ({ s = 1, teret = 1 }) => (
  <g transform={`scale(${s})`}>
    <Linija d="M0,-40 L0,-420" debljina={8} boja={P.drvoTamno} />
    <Oblik d="M10,-400 C120,-360 150,-240 130,-120 L10,-120Z" boja={D.belo} debljina={4} />
    <Oblik d="M-10,-380 C-110,-340 -130,-240 -110,-150 L-10,-150Z" boja="#EDE3CC" debljina={4} />
    <Oblik d="M0,-430 L60,-410 L0,-392Z" boja={P.ajvar} debljina={3} />
    <Oblik d="M-260,-90 L260,-90 C240,-30 190,0 130,0 L-150,0 C-210,0 -250,-40 -260,-90Z" boja={P.drvo} />
    <Linija d="M-240,-62 L240,-62" debljina={3} opacity={0.4} />
    {teret > 0 && (
      <g opacity={teret}>
        {[-150, -70, 60, 140].map((x, i) => (
          <g key={i} transform={`translate(${x} -88)`}>
            <Vreca s={0.28} />
          </g>
        ))}
      </g>
    )}
  </g>
);

/** Mapa Starog sveta, vrlo pojednostavljena (Afrika, Arabija, Indija, Kina), u okviru starog lista. */
export const Mapa: React.FC = () => (
  <g>
    <Oblik d={kutija(70, 230, 940, 1020, 18)} boja="#EAD8AE" debljina={5} tekstura={0.3} />
    <rect x={70} y={230} width={940} height={1020} rx={18} fill={D.more} opacity={0.32} />
    {/* Evropa (ivica) */}
    <Oblik d="M70,330 C150,300 260,330 330,310 C380,330 420,360 470,350 C500,380 470,410 430,420 C380,410 330,430 290,420 C230,440 160,430 70,440Z" boja="#D8C99E" debljina={3} />
    {/* Afrika */}
    <Oblik d="M250,470 C320,440 420,450 470,480 C520,500 560,540 600,560 C640,600 640,640 610,660 C590,720 560,780 520,840 C500,900 480,960 440,1010 C410,1050 380,1060 360,1030 C340,960 330,900 330,840 C320,780 290,740 250,720 C210,690 180,640 190,580 C200,530 220,490 250,470Z" boja="#D9B877" debljina={4} />
    {/* Arabija */}
    <Oblik d="M560,500 C620,490 670,520 700,560 C720,600 700,630 660,640 C630,620 600,580 570,560Z" boja="#D9B877" debljina={3.5} />
    {/* Azija sa Indijom i Kinom */}
    <Oblik d="M470,350 C560,320 680,330 780,300 C880,280 960,300 1010,320 L1010,560 C980,600 940,620 900,640 C880,680 860,700 840,690 C820,660 800,640 780,640 C760,700 740,760 720,800 C700,760 690,700 660,660 C680,620 700,580 690,540 C650,500 600,470 560,470 C520,450 490,420 470,400Z" boja="#C9B98A" debljina={4} />
    {/* Šri Lanka i Japan */}
    <Oblik d={elipsa(742, 830, 14, 20)} boja="#C9B98A" debljina={3} />
    {/* ruža vetrova */}
    <g transform="translate(900 1120)" opacity={0.7}>
      <path d="M0,-60 L12,0 L0,60 L-12,0Z" fill={P.mastilo} />
      <path d="M-60,0 L0,-12 L60,0 L0,12Z" fill={P.mastiloSvetlo} />
      <text y={-70} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={30} fill={P.mastilo}>
        S
      </text>
    </g>
  </g>
);

// ── KOLO: knjiga zapisa ───────────────────────────────────────────────────────
export type Red = { ko: string; sta: string };
/** Otvorena knjiga zapisa; redovi se ispisuju (napredak po redu 0–1). Centar 0,0, ~860×620. */
export const KnjigaZapisa: React.FC<{ redovi: Red[]; napredak: number[]; zelena?: number }> = ({ redovi, napredak, zelena = 1 }) => (
  <g>
    <ellipse cx={0} cy={330} rx={460} ry={30} fill={P.senka} opacity={0.22} />
    <Oblik d="M-440,-300 C-300,-330 -120,-320 0,-290 C120,-320 300,-330 440,-300 L440,300 C300,280 120,280 0,310 C-120,280 -300,280 -440,300Z" boja={P.zelena700} debljina={5} tekstura={0.25} />
    <Oblik d="M-420,-284 C-290,-310 -120,-300 -6,-272 L-6,292 C-120,266 -290,264 -420,282Z" boja={P.belo} debljina={3.5} tekstura={0.15} />
    <Oblik d="M420,-284 C290,-310 120,-300 6,-272 L6,292 C120,266 290,264 420,282Z" boja={P.belo} debljina={3.5} tekstura={0.15} />
    <text x={-380} y={-222} fontFamily={SANS} fontWeight={900} fontSize={30} fill={P.zelena700} letterSpacing={4} opacity={zelena}>
      ZAPIS U KOLU
    </text>
    <text x={60} y={-222} fontFamily={SANS} fontWeight={900} fontSize={24} fill={P.mastiloSvetlo} letterSpacing={2}>
      KO JE ŠTA DAO
    </text>
    {/* linije na obe strane */}
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i} opacity={0.35}>
        <line x1={-390} y1={-160 + i * 80} x2={-40} y2={-150 + i * 80} stroke={P.plava} strokeWidth={2} />
        <line x1={40} y1={-150 + i * 80} x2={390} y2={-160 + i * 80} stroke={P.plava} strokeWidth={2} />
      </g>
    ))}
    {redovi.map((r, i) => {
      const p = napredak[i] ?? 0;
      if (p <= 0) return null;
      const levo = i < 3;
      const x = levo ? -380 : 50;
      const y = -172 + (i % 3) * 160;
      const ko = r.ko.slice(0, Math.ceil(r.ko.length * Math.min(1, p * 2)));
      const sta = p > 0.5 ? r.sta.slice(0, Math.ceil(r.sta.length * Math.min(1, (p - 0.5) * 2))) : "";
      return (
        <g key={i}>
          <text x={x} y={y} fontFamily={SERIF} fontWeight={700} fontSize={40} fill={P.mastilo}>
            {ko}
          </text>
          <text x={x} y={y + 62} fontFamily={RUKOPIS} fontWeight={700} fontSize={46} fill={P.zelena700}>
            {sta}
          </text>
        </g>
      );
    })}
  </g>
);

// ── Roba za razmenu ───────────────────────────────────────────────────────────
/** Glineni krčag (dno u 0,0). */
export const Krcag: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = "#B8663F" }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={10} fill={P.senka} opacity={0.2} />
    <Oblik d="M-40,0 C-80,-20 -86,-90 -56,-130 C-40,-150 -36,-160 -38,-176 L38,-176 C36,-160 40,-150 56,-130 C86,-90 80,-20 40,0Z" boja={boja} />
    <Oblik d={kutija(-46, -192, 92, 20, 8)} boja={boja} debljina={3.5} />
    <Linija d="M-66,-90 Q0,-74 66,-90" debljina={3} boja={P.krem} opacity={0.8} />
    <Linija d="M-62,-70 Q0,-54 62,-70" debljina={3} boja={P.mastilo} opacity={0.5} />
  </g>
);

/** Riba (centar 0,0, glava desno). */
export const Riba: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-70,0 C-40,-40 30,-44 70,0 C30,44 -40,40 -70,0Z" boja="#8FA9B3" />
    <Oblik d="M-66,0 L-110,-34 L-100,0 L-110,34Z" boja="#7B97A2" debljina={3.5} />
    <circle cx={42} cy={-8} r={6} fill={P.mastilo} />
    <Linija d="M14,-26 Q4,0 14,26" debljina={3} opacity={0.6} />
  </g>
);

/** Smotano platno (centar 0,0). */
export const Platno: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = P.ajvar }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-80, -40, 160, 80, 30)} boja={boja} />
    <Linija d="M-80,-14 L80,-14" boja={P.krem} debljina={6} opacity={0.8} />
    <Linija d="M-80,14 L80,14" boja={P.krem} debljina={6} opacity={0.8} />
    <Oblik d={elipsa(80, 0, 16, 40)} boja={boja} debljina={3.5} />
    <Linija d="M80,-24 Q66,0 80,24" debljina={2.5} opacity={0.6} />
  </g>
);

/** Prazna, spljoštena vreća (dno u 0,0). */
export const PraznaVreca: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={4} rx={130} ry={14} fill={P.senka} opacity={0.18} />
    <Oblik d="M-130,0 C-120,-30 -60,-44 0,-40 C60,-44 120,-30 130,0 C60,8 -60,8 -130,0Z" boja={D.dzak} />
    <Linija d="M-80,-20 Q0,-10 80,-24" debljina={2} opacity={0.4} />
  </g>
);

/** Merač „vrednost“: uspravna skala sa stubom koji se puni do `nivo` 0–1. Dno u 0,0, visina ~h. */
export const Merac: React.FC<{ nivo: number; h?: number; natpis?: string; crveno?: number }> = ({ nivo, h = 520, natpis = "vrednost", crveno = 0 }) => (
  <g>
    <Oblik d={kutija(-56, -h, 112, h, 26)} boja={P.belo} debljina={4} tekstura={0.15} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={-56} y1={-h + 40 + i * ((h - 80) / 8)} x2={-30} y2={-h + 40 + i * ((h - 80) / 8)} stroke={P.mastilo} strokeWidth={3} opacity={0.5} />
    ))}
    <rect x={-22} y={-20 - (h - 60) * nivo} width={66} height={(h - 60) * nivo + 4} rx={12} fill={crveno > 0.5 ? P.ajvar : P.oker} stroke={P.mastilo} strokeWidth={3} />
    <text x={0} y={50} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={48} fill={P.mastilo}>
      {natpis}
    </text>
  </g>
);
