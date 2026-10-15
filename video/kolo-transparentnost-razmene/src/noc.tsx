// Svet videa 20 „Kako da sprečimo krađu?“: noć na seoskom trgu i fenjeri. Krađa živi u mraku; kad svi
// donesu svetlo, sve se vidi. Ovde su nebo, trg sa kućama, postolje (položaj), sanduk koji postaje stakleni,
// fenjer, mrak sa rupama svetla, zlatna nit razmene i senka na zidu. POEN je samo broj na niti, nikad novčić.
import React from "react";
import { P } from "./paleta";
import { RUKOPIS, SANS } from "./fontovi";
import { Hrapavo, Linija, Oblik, elipsa, kutija } from "./alat";
import { Novcanica } from "./zgrada";

export const N = {
  noc: "#141C33",
  zid: "#3A3550",
  zemlja: "#3B3430",
  kamen: "#6B6058",
  toplo: "#FFD27A",
  staklo: "#BFE3EA",
  drvo: "#7A5236",
};

// ── Nebo i trg ───────────────────────────────────────────────────────────
export const Nebo: React.FC<{ mesec?: boolean; zora?: number }> = ({ mesec = true, zora = 0 }) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2600} fill="url(#nocNebo)" />
    {zora > 0 && <rect x={-300} y={-300} width={1680} height={2600} fill="#F2B57A" opacity={zora * 0.75} />}
    {Array.from({ length: 46 }, (_, i) => {
      const x = (i * 263) % 1080;
      const y = 80 + ((i * 397) % 900);
      return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 3.2 : 1.8} fill="#FFF6D8" opacity={(0.35 + ((i * 7) % 10) / 20) * (1 - zora)} />;
    })}
    {mesec && (
      <g opacity={1 - zora}>
        <circle cx={850} cy={300} r={70} fill="#F4EBC8" />
        <circle cx={880} cy={285} r={64} fill="url(#nocNebo)" />
      </g>
    )}
  </g>
);

/** Trg: niz kuća (siluete sa toplim prozorima) i kaldrma od y=1180. */
export const Trg: React.FC<{ prozori?: number; y?: number }> = ({ prozori = 0.6, y = 1180 }) => (
  <g>
    {[
      [-60, 200, 300],
      [190, 260, 340],
      [460, 220, 280],
      [690, 280, 360],
      [930, 230, 300],
    ].map(([x, w, h], i) => (
      <g key={i}>
        <Oblik d={`M${x},${y} L${x},${y - h} L${x + w / 2},${y - h - 120} L${x + w},${y - h} L${x + w},${y}Z`} boja={i % 2 ? "#2C2A40" : "#33304A"} debljina={3} tekstura={0.2} />
        {[0.28, 0.66].map((k) => (
          <rect key={k} x={x + w * k - 26} y={y - h + 70} width={52} height={64} rx={4} fill={N.toplo} opacity={prozori * (0.5 + ((i + k * 3) % 2) * 0.4)} />
        ))}
      </g>
    ))}
    <rect x={-300} y={y} width={1680} height={1300} fill={N.zemlja} />
    <g opacity={0.35}>
      {Array.from({ length: 70 }, (_, i) => (
        <ellipse key={i} cx={((i * 151) % 1200) - 60} cy={y + 30 + ((i * 89) % 700)} rx={34} ry={14} fill="none" stroke={N.kamen} strokeWidth={3} />
      ))}
    </g>
  </g>
);

/** Postolje od kamena (položaj); gornja površina u (0,0), `h` visina. */
export const Postolje: React.FC<{ h?: number; w?: number }> = ({ h = 220, w = 340 }) => (
  <g>
    <Oblik d={kutija(-w / 2, 0, w, h, 6)} boja="#8A7F75" debljina={4.5} tekstura={0.35} />
    <Oblik d={kutija(-w / 2 - 20, -18, w + 40, 26, 6)} boja="#A39789" debljina={4} tekstura={0.3} />
    {Array.from({ length: Math.floor(h / 60) }, (_, i) => (
      <path key={i} d={`M${-w / 2},${40 + i * 60} L${w / 2},${40 + i * 60}`} stroke={P.mastilo} strokeWidth={2} opacity={0.3} />
    ))}
  </g>
);

// ── Sanduk ───────────────────────────────────────────────────────────────
/**
 * Sanduk sa zajedničkim sredstvima; dno u (0,0), 300×190. `staklo` 0–1 pretvara drvo u staklo i otkriva
 * sadržaj: svežanj novčanica i svesku sa redovima (kad je `svezak`).
 */
export const Sanduk: React.FC<{ staklo?: number; natpis?: string; s?: number; svezak?: boolean; isticanje?: number; pun?: number }> = ({
  staklo = 0,
  natpis,
  s = 1,
  svezak = true,
  isticanje = 0,
  pun = 1,
}) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={6} rx={170} ry={18} fill="#000" opacity={0.3} />
    {/* sadržaj (vidi se kroz staklo) */}
    <g opacity={staklo}>
      <rect x={-150} y={-190} width={300} height={190} fill={N.staklo} opacity={0.35} />
      {Array.from({ length: Math.round(4 * pun) }, (_, i) => (
        <g key={i} transform={`translate(${-70 + (i % 2) * 18} ${-24 - i * 16}) rotate(${(i % 3) * 4 - 4})`}>
          <Novcanica s={0.34} />
        </g>
      ))}
      {svezak && (
        <g transform="translate(70 -70) rotate(-4)">
          <Oblik d={kutija(-62, -80, 124, 150, 6)} boja={P.belo} debljina={3} tekstura={0.1} />
          {isticanje > 0 && <rect x={-56} y={-68} width={112 * isticanje} height={130} fill={P.zlatna} opacity={0.35} />}
          {[0, 1, 2, 3].map((k) => (
            <g key={k}>
              <rect x={-50} y={-60 + k * 30} width={58} height={8} rx={4} fill={P.mastilo} opacity={0.45} />
              <rect x={16} y={-60 + k * 30} width={32} height={8} rx={4} fill={k === 3 ? P.ajvarTamni : P.zelena700} opacity={0.75} />
            </g>
          ))}
        </g>
      )}
      <path d="M-150,-190 L150,-190 L150,0 L-150,0Z" fill="url(#stakloG)" opacity={0.9} />
      <rect x={-150} y={-190} width={300} height={190} fill="none" stroke="#E8F6F8" strokeWidth={5} opacity={0.9} />
      <rect x={-150} y={-190} width={300} height={190} fill="none" stroke={P.mastilo} strokeWidth={3} />
    </g>
    {/* drvo */}
    {staklo < 1 && (
      <g opacity={1 - staklo}>
        <Oblik d={kutija(-150, -190, 300, 190, 8)} boja={N.drvo} debljina={4.5} tekstura={0.35} />
        {[-130, -68, -6, 56, 118].map((x) => (
          <path key={x} d={`M${x},-186 L${x},-4`} stroke={P.mastilo} strokeWidth={2} opacity={0.35} />
        ))}
        <Oblik d={kutija(-160, -206, 320, 34, 8)} boja="#5E3B26" debljina={4} tekstura={0.3} />
        <Oblik d={elipsa(0, -150, 18, 22)} boja={P.oker} debljina={3} tekstura={0} />
      </g>
    )}
    {natpis && (
      <g transform="translate(0 -232)">
        <rect x={-110} y={-26} width={220} height={44} rx={8} fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
        <text y={8} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={24} fill={P.mastilo} letterSpacing={2}>
          {natpis}
        </text>
      </g>
    )}
  </g>
);

// ── Fenjer i svetlo ──────────────────────────────────────────────────────
/** Fenjer; ručka gore u (0,0). `upaljen` 0–1. */
export const Fenjer: React.FC<{ s?: number; upaljen?: number; f?: number }> = ({ s = 1, upaljen = 1, f = 0 }) => {
  const treperi = 1 + Math.sin(f * 0.9) * 0.05 + Math.sin(f * 2.3) * 0.03;
  return (
    <g transform={`scale(${s})`}>
      <circle cx={0} cy={70} r={150 * treperi} fill="url(#plamen)" opacity={0.55 * upaljen} />
      <path d="M-22,8 C-22,-18 22,-18 22,8" fill="none" stroke={P.mastilo} strokeWidth={5} />
      <Oblik d={kutija(-34, 6, 68, 18, 4)} boja="#3A3A3A" debljina={3} tekstura={0} />
      <rect x={-28} y={24} width={56} height={84} rx={8} fill={upaljen > 0 ? "#FFE6A0" : "#5A6070"} opacity={0.6 + upaljen * 0.4} stroke={P.mastilo} strokeWidth={3} />
      <ellipse cx={0} cy={72} rx={9 * treperi} ry={16 * treperi} fill="#FFF6D0" opacity={upaljen} />
      <path d="M-28,52 L28,52 M-28,82 L28,82" stroke={P.mastilo} strokeWidth={2} opacity={0.5} />
      <Oblik d={kutija(-36, 106, 72, 16, 4)} boja="#3A3A3A" debljina={3} tekstura={0} />
    </g>
  );
};

export type Svetlo = { x: number; y: number; r: number; a?: number };

/**
 * Mrak preko kadra sa rupama oko svetala. `jacina` 0–1 koliko je mrak gust; svako svetlo `a` 0–1.
 * Ispod mraka se crta sve u boji, pa ono što fenjer obasja dobije boju, a ostalo ostane senka.
 */
export const Mrak: React.FC<{ id: string; svetla: Svetlo[]; jacina?: number; boja?: string }> = ({ id, svetla, jacina = 0.82, boja = N.noc }) => (
  <g style={{ pointerEvents: "none" }}>
    <mask id={`mrak-${id}`} maskUnits="userSpaceOnUse" x={-400} y={-400} width={1880} height={2720}>
      <rect x={-400} y={-400} width={1880} height={2720} fill="#fff" />
      {svetla.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="url(#rupaMraka)" opacity={s.a ?? 1} />
      ))}
    </mask>
    <rect x={-400} y={-400} width={1880} height={2720} fill={boja} opacity={jacina} mask={`url(#mrak-${id})`} />
    {svetla.map((s, i) => (
      <circle key={`t${i}`} cx={s.x} cy={s.y} r={s.r * 0.8} fill="url(#toplaSvetlost)" opacity={0.45 * (s.a ?? 1)} style={{ mixBlendMode: "screen" }} />
    ))}
  </g>
);

// ── Zlatna nit razmene ───────────────────────────────────────────────────
/** Luk od A do B koji se iscrta (`napredak`), a niz njega putuje pločica sa brojem POEN-a. */
export const Nit: React.FC<{ a: [number, number]; b: [number, number]; napredak: number; iznos?: string; luk?: number; s?: number }> = ({
  a,
  b,
  napredak,
  iznos,
  luk = -160,
  s = 1,
}) => {
  if (napredak <= 0) return null;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 + luk;
  const t = Math.min(1, napredak);
  const px = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * mx + t * t * b[0];
  const py = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * my + t * t * b[1];
  return (
    <g>
      <path d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} fill="none" stroke={N.toplo} strokeWidth={14 * s} opacity={0.25} filter="url(#blur6)" />
      <Linija d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} boja={P.zlatna} debljina={6 * s} napredak={t} />
      {iznos && napredak < 1.3 && (
        <g transform={`translate(${px} ${py}) scale(${s})`} opacity={Math.min(1, (1.3 - napredak) * 4)}>
          <rect x={-58} y={-26} width={116} height={46} rx={23} fill={P.zelena700} stroke="#fff" strokeWidth={3} />
          <text y={8} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={24} fill="#fff">
            {iznos}
          </text>
        </g>
      )}
    </g>
  );
};

// ── Senka na zidu (scena 1) ──────────────────────────────────────────────
/** Zid noću, malo osvetljen sveća odozdo. */
export const ZidSvece: React.FC<{ treperi: number }> = ({ treperi }) => (
  <Hrapavo>
    <rect x={-300} y={-300} width={1680} height={2600} fill="#4A3B33" />
    <rect x={-300} y={-300} width={1680} height={2600} fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
    <circle cx={260} cy={1350} r={900 * treperi} fill="url(#plamen)" opacity={0.42} />
    <rect x={-300} y={1300} width={1680} height={1000} fill="#2A211C" />
  </Hrapavo>
);

/** Sveća na podu (izvor svetla senki); dno u (0,0). */
export const Sveca: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Oblik d={kutija(-22, -110, 44, 110, 6)} boja={P.krem} debljina={3} tekstura={0.1} />
    <ellipse cx={0} cy={-136} rx={10 + Math.sin(f) * 1.5} ry={24 + Math.sin(f * 1.7) * 3} fill="#FFE39A" />
    <ellipse cx={0} cy={-130} rx={5} ry={12} fill="#FFF8E0" />
    <circle cx={0} cy={-130} r={90} fill="url(#plamen)" opacity={0.7} />
  </g>
);

/** Ručno pisana pločica (natpis u svetu priče). */
export const Plocica: React.FC<{ tekst: string; s?: number }> = ({ tekst, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-tekst.length * 13 - 20} y={-34} width={tekst.length * 26 + 40} height={58} rx={8} fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
    <text y={10} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={40} fill={P.mastilo}>
      {tekst}
    </text>
  </g>
);
