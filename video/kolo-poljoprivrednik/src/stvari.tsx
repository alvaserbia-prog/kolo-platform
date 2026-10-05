// Predmeti priče u naivi. POEN se nikad ne crta kao novčić: postoji samo kao reč u knjizi evidencije
// (od → ka · POEN), bez broja. Novčanice u fioci su dinari.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Boja, N, elipsa, kutija } from "./naiva";
import { OBLO, RUKOPIS, SANS } from "./fontovi";
import { Jaje } from "./zivotinje";

export const KantaMleka: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-40,0 L-46,-90 C-46,-110 -30,-120 -20,-124 L-20,-150 L20,-150 L20,-124 C30,-120 46,-110 46,-90 L40,0Z" boja="#C9D2DA" />
    <path d="M-44,-70 L44,-70 M-42,-20 L42,-20" stroke="#8A96A2" strokeWidth={5} />
    <Boja d={kutija(-26, -164, 52, 16, 5)} boja="#9AA6B2" />
    <ellipse cx={-20} cy={-80} rx={8} ry={30} fill={N.bela} opacity={0.5} />
  </g>
);

/** Kotao na vatri (Božić, sirenje). */
export const Kotao: React.FC<{ x: number; y: number; s?: number; para?: boolean; mleko?: boolean }> = ({ x, y, s = 1, para = true, mleko }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-50, 0, 50].map((px, i) => (
        <path key={i} d={`M${px - 20},0 Q${px},${-60 - Math.sin(f / 4 + i) * 14} ${px + 20},0Z`} fill={i === 1 ? N.zuta : N.narandzasta} stroke={N.crvenaTamna} strokeWidth={2} />
      ))}
      <path d="M-90,0 L-70,-20 M90,0 L70,-20" stroke={N.kontura} strokeWidth={6} />
      <Boja d="M-110,-160 L110,-160 C110,-80 80,-20 0,-20 C-80,-20 -110,-80 -110,-160Z" boja="#3A3A3A" />
      <Boja d={elipsa(0, -160, 110, 22)} boja={mleko ? "#FFF8EC" : "#5A5A5A"} />
      {para &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 30) % 90) / 90;
          return <circle key={i} cx={-40 + i * 40 + Math.sin(f / 10 + i) * 10} cy={-190 - t * 160} r={20 + t * 30} fill={N.bela} opacity={0.5 * (1 - t)} />;
        })}
    </g>
  );
};

export const Sir: React.FC<{ x: number; y: number; s?: number; kriska?: boolean }> = ({ x, y, s = 1, kriska }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {kriska ? (
      <Boja d="M-50,0 L50,0 L50,-40 L-50,-60Z" boja="#FFF3C8" />
    ) : (
      <g>
        <Boja d="M-60,0 L-60,-50 C-60,-64 60,-64 60,-50 L60,0 C60,10 -60,10 -60,0Z" boja="#FFF3C8" />
        <Boja d={elipsa(0, -52, 60, 12)} boja="#FFF8DC" />
      </g>
    )}
    {[-24, 10, 30].map((cx, i) => (
      <circle key={i} cx={cx} cy={-22 - i * 6} r={5} fill="#EADBA0" />
    ))}
  </g>
);

export const Zdela: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-56,-40 L56,-40 C56,-10 30,0 0,0 C-30,0 -56,-10 -56,-40Z" boja={N.plava} />
    <path d="M-40,-24 Q0,-14 40,-24" stroke={N.bela} strokeWidth={4} strokeDasharray="4 6" fill="none" />
    <Boja d="M-50,-40 C-30,-60 30,-60 50,-40Z" boja="#FFF8EC" />
  </g>
);

export const KorpaJaja: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => (
      <Jaje key={i} x={-60 + (i % 5) * 30} y={-62 - Math.floor(i / 5) * 22} s={0.8} rot={(i * 23) % 30 - 15} boja={i % 3 ? "#F3E2C6" : "#E8C9A0"} />
    ))}
    <Boja d="M-90,-60 L90,-60 L70,0 L-70,0Z" boja="#C08A4A" />
    {Array.from({ length: 6 }, (_, i) => (
      <path key={i} d={`M${-84 + i * 30},-60 L${-64 + i * 26},0`} stroke="#8A5A2A" strokeWidth={3} />
    ))}
    <path d="M-80,-60 C-70,-160 70,-160 80,-60" stroke="#8A5A2A" strokeWidth={9} fill="none" />
  </g>
);

export const Vreca: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-60,0 C-70,-60 -64,-120 -50,-150 C-30,-160 30,-160 50,-150 C64,-120 70,-60 60,0Z" boja="#D9C08A" />
    <path d="M-50,-150 C-30,-170 30,-170 50,-150" stroke="#8A6A3A" strokeWidth={6} fill="none" />
    <path d="M-30,-90 L30,-90 M-36,-70 L36,-70" stroke="#8A6A3A" strokeWidth={5} />
  </g>
);

export const Racun: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <Boja d="M-60,-150 L60,-150 L60,0 L50,-10 L40,0 L30,-10 L20,0 L10,-10 L0,0 L-10,-10 L-20,0 L-30,-10 L-40,0 L-50,-10 L-60,0Z" boja={N.bela} />
    {[-120, -100, -80, -60].map((yy, i) => (
      <path key={yy} d={`M-44,${yy} L${i === 3 ? 10 : 44},${yy}`} stroke="#9A9A9A" strokeWidth={5} strokeLinecap="round" />
    ))}
    <path d="M-44,-34 L44,-34" stroke={N.crvena} strokeWidth={7} strokeLinecap="round" />
  </g>
);

export const Kanister: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-60,0 L-60,-130 L20,-130 L60,-100 L60,0Z" boja={N.crvena} />
    <Boja d={kutija(-44, -160, 40, 30, 6)} boja={N.crvenaTamna} />
    <path d="M-40,-30 L40,-100 M-40,-100 L40,-30" stroke={N.crvenaTamna} strokeWidth={6} />
  </g>
);

/** Vaga sa dva tasa: levo jedan litar iz radnje, desno tri Savine kante — u ravnoteži. */
export const Vaga: React.FC<{ x: number; y: number; s?: number; nagib?: number; levo?: React.ReactNode; desno?: React.ReactNode }> = ({ x, y, s = 1, nagib = 0, levo, desno }) => {
  const r = (nagib * Math.PI) / 180;
  const ly = -Math.sin(r) * 220;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Boja d="M-80,0 L80,0 L40,-30 L-40,-30Z" boja="#B8962E" />
      <Boja d={kutija(-10, -330, 20, 300, 6)} boja="#D4AF37" />
      <g transform={`translate(0 -330) rotate(${nagib})`}>
        <path d="M-230,0 L230,0" stroke={N.kontura} strokeWidth={12} strokeLinecap="round" />
        <path d="M-230,0 L230,0" stroke="#D4AF37" strokeWidth={7} strokeLinecap="round" />
      </g>
      {[-1, 1].map((st) => {
        const py = -330 + st * ly + 150;
        return (
          <g key={st}>
            <path d={`M${st * 220},${-330 + st * ly} L${st * 220 - 80},${py} M${st * 220},${-330 + st * ly} L${st * 220 + 80},${py}`} stroke={N.kontura} strokeWidth={3} />
            <Boja d={`M${st * 220 - 100},${py} L${st * 220 + 100},${py} C${st * 220 + 80},${py + 30} ${st * 220 - 80},${py + 30} ${st * 220 - 100},${py}Z`} boja="#D4AF37" />
            <g transform={`translate(${st * 220} ${py})`}>{st < 0 ? levo : desno}</g>
          </g>
        );
      })}
    </g>
  );
};

/** Tetrapak mleka iz radnje. */
export const Tetrapak: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-30,0 L-30,-100 L0,-130 L30,-100 L30,0Z" boja={N.bela} />
    <Boja d="M-30,-60 L30,-60 L30,-30 L-30,-30Z" boja={N.plavaSvetla} />
  </g>
);

export const Cisterna: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d="M-300,-40 L-300,-170 C-300,-200 -270,-210 -250,-210 L-170,-210 L-150,-40Z" boja="#E2E2E2" />
    <Boja d="M-282,-130 L-274,-190 L-186,-190 L-176,-130Z" boja={N.neboSvetlo} />
    <Boja d={`M-140,-60 L-140,-200 C-140,-240 -100,-250 -60,-250 L260,-250 C300,-250 320,-230 320,-190 L320,-60Z`} boja="#C9D2DA" />
    <path d="M-120,-180 L300,-180" stroke="#9AA6B2" strokeWidth={6} />
    {[-220, 40, 240].map((tx) => (
      <g key={tx} transform={`translate(${tx} -30)`}>
        <Boja d={elipsa(0, 0, 38)} boja="#2A2A2A" />
        <Boja d={elipsa(0, 0, 14)} boja="#9A9A9A" />
      </g>
    ))}
  </g>
);

/** Naslov oglasa u jedan ili dva reda (širina ekrana telefona je ~14 znakova na 34 px). */
const redoviNaslova = (t: string): string[] => {
  if (t.length <= 14) return [t];
  const reci = t.split(" ");
  let i = 1;
  while (i < reci.length && reci.slice(0, i + 1).join(" ").length <= 14) i++;
  return [reci.slice(0, i).join(" "), reci.slice(i).join(" ")];
};

/** Telefon sa oglasom na KOLU: naslov, mesto, slika; po želji prst pritiska dugme. */
export const Telefon: React.FC<{ x: number; y: number; s?: number; naslov: string; mesto: string; slika: React.ReactNode; objavljen?: number }> = ({ x, y, s = 1, naslov, mesto, slika, objavljen = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d={kutija(-170, -330, 340, 660, 44)} boja="#24242C" />
    <rect x={-150} y={-296} width={300} height={592} rx={24} fill={N.bela} />
    <rect x={-150} y={-296} width={300} height={64} rx={24} fill={N.zelena} />
    <rect x={-150} y={-260} width={300} height={28} fill={N.zelena} />
    <text x={0} y={-250} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={40} fill={N.bela}>
      KOLO
    </text>
    <rect x={-130} y={-212} width={260} height={210} rx={14} fill="#EAF4E4" stroke={N.kontura} strokeWidth={2} />
    <g transform="translate(0 -100)">{slika}</g>
    {redoviNaslova(naslov).map((r, i) => (
      <text key={i} x={-130} y={40 + i * 40} fontFamily={SANS} fontWeight={800} fontSize={34} fill={N.kontura}>
        {r}
      </text>
    ))}
    <text x={-130} y={40 + redoviNaslova(naslov).length * 40 + 10} fontFamily={SANS} fontWeight={700} fontSize={30} fill="#5A5A5A">
      {mesto}
    </text>
    <rect x={-120} y={196} width={240} height={64} rx={32} fill={objavljen > 0.5 ? N.zelenaSvetla : N.zelena} />
    <text x={0} y={240} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={N.bela}>
      {objavljen > 0.5 ? "Objavljeno ✓" : "Objavi oglas"}
    </text>
  </g>
);

/** List evidencije „zapis u KOLU“: red je jedan prepis „od → ka“ sa zelenom oznakom POEN (bez broja).
 *  `n` = koliko je redova upisano, `ispis` = koliko je ispisan poslednji red (0–1, otkriva se sleva nadesno). */
export const Knjiga: React.FC<{ x: number; y: number; s?: number; redovi: string[]; n: number; istaknut?: number; ispis?: number }> = ({ x, y, s = 1, redovi, n, istaknut = -1, ispis = 1 }) => {
  const R = 84;
  const h = 120 + Math.max(1, redovi.length) * R;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Boja d={kutija(-350, -24, 700, h + 48, 22)} boja={N.zelena} />
      <Boja d={kutija(-326, 0, 652, h, 14)} boja="#FFF8EC" />
      <text x={0} y={66} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={50} fill={N.zelena}>
        zapis u KOLU
      </text>
      {redovi.map((_, i) => (
        <path key={i} d={`M-296,${100 + (i + 1) * R} L296,${100 + (i + 1) * R}`} stroke="#C9D8E8" strokeWidth={2.5} />
      ))}
      {redovi.slice(0, n).map((r, i) => {
        const [ko, kome] = r.replace(" · POEN", "").split(" → ");
        const yy = 100 + i * R;
        const p = i === n - 1 ? ispis : 1;
        return (
          <g key={i}>
            {i === istaknut && <rect x={-310} y={yy + 6} width={620} height={R - 10} rx={12} fill={N.zelenaSvetla} opacity={0.5} />}
            <clipPath id={`isp-${i}-${r.length}`}>
              <rect x={-320} y={yy} width={640 * p} height={R} />
            </clipPath>
            <g clipPath={`url(#isp-${i}-${r.length})`}>
              <text x={-170} y={yy + 60} textAnchor="end" fontFamily={RUKOPIS} fontWeight={700} fontSize={58} fill={N.kontura}>
                {ko}
              </text>
              <text x={-118} y={yy + 58} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill={N.zelena}>
                →
              </text>
              <text x={-66} y={yy + 60} textAnchor="start" fontFamily={RUKOPIS} fontWeight={700} fontSize={58} fill={N.kontura}>
                {kome}
              </text>
              <rect x={150} y={yy + 18} width={150} height={52} rx={26} fill={N.zelena} />
              <text x={225} y={yy + 56} textAnchor="middle" fontFamily={OBLO} fontWeight={700} fontSize={36} fill={N.bela}>
                POEN
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

export const Prikolica: React.FC<{ x: number; y: number; s?: number; seno?: number }> = ({ x, y, s = 1, seno = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d={`M-200,-60 C-200,${-60 - 140 * seno} 200,${-60 - 140 * seno} 200,-60Z`} boja="#E7C66A" />
    {Array.from({ length: 10 }, (_, i) => (
      <path key={i} d={`M${-170 + i * 36},${-70} q10,${-50 * seno} 20,${-90 * seno}`} stroke="#B8962E" strokeWidth={3} fill="none" />
    ))}
    <Boja d={kutija(-210, -70, 420, 40, 6)} boja={N.crvena} />
    {[-120, 120].map((tx) => (
      <g key={tx}>
        <Boja d={elipsa(tx, -20, 30)} boja="#2A2A2A" />
        <Boja d={elipsa(tx, -20, 10)} boja="#9A9A9A" />
      </g>
    ))}
  </g>
);

export const Viljuska: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M0,0 L0,-200" stroke={N.drvo} strokeWidth={8} strokeLinecap="round" />
    <path d="M-20,-200 L-20,-250 M0,-200 L0,-256 M20,-200 L20,-250 M-20,-200 L20,-200" stroke="#7A7A7A" strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** Pumpa za vodu na bunaru (električar je popravlja). */
export const Pumpa: React.FC<{ x: number; y: number; s?: number; radi?: boolean }> = ({ x, y, s = 1, radi }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Boja d={kutija(-80, -60, 160, 60, 8)} boja="#B9B2A4" />
      <Boja d={kutija(-50, -150, 100, 90, 10)} boja={N.plava} />
      <Boja d={elipsa(0, -105, 26)} boja="#7A8A9A" />
      <path d="M50,-110 L120,-110 L120,-40" stroke="#7A7A7A" strokeWidth={14} fill="none" />
      {radi && [0, 1, 2].map((i) => <circle key={i} cx={120} cy={-30 + ((f * 4 + i * 20) % 60)} r={6} fill={N.plavaSvetla} />)}
    </g>
  );
};

/** Fioka kredenca sa dinarima (dinari, ne POEN). `otvorena` 0–1. */
export const Fioka: React.FC<{ x: number; y: number; s?: number; otvorena: number }> = ({ x, y, s = 1, otvorena }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Boja d={kutija(-260, -360, 520, 360, 10)} boja="#9A6A3A" />
    <Boja d={kutija(-240, -340, 480, 140, 8)} boja="#B07A44" />
    <g transform={`translate(0 ${otvorena * 120})`}>
      <Boja d="M-230,-180 L230,-180 L250,-40 L-250,-40Z" boja="#C08A4A" />
      {otvorena > 0.2 &&
        [0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${-100 + i * 70} ${-150 + i * 6}) rotate(${-8 + i * 7})`}>
            <Boja d={kutija(-80, -36, 160, 72, 6)} boja={i === 1 ? "#B7C9A8" : "#D8C8A8"} />
            <circle cx={-40} cy={0} r={18} fill="none" stroke="#6A7A5A" strokeWidth={3} />
            <text x={34} y={10} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#5A6A4A">
              DIN
            </text>
          </g>
        ))}
      <Boja d={kutija(-250, -60, 500, 70, 8)} boja="#B07A44" />
      <Boja d={kutija(-40, -36, 80, 22, 10)} boja={N.zuta} />
    </g>
  </g>
);

export const TablaMesta: React.FC<{ x: number; y: number; s?: number; ime: string }> = ({ x, y, s = 1, ime }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0,0 L0,-180" stroke="#7A7A7A" strokeWidth={10} />
    <Boja d={kutija(-170, -280, 340, 110, 12)} boja={N.bela} kontura={N.plava} debljina={7} />
    <text x={0} y={-207} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={64} fill={N.plava}>
      {ime}
    </text>
  </g>
);

/** Okrugli medaljon (slika u slici) sa naslikanim okvirom. */
export const Medaljon: React.FC<{ x: number; y: number; r: number; id: string; children: React.ReactNode; skala?: number }> = ({ x, y, r, id, children, skala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${skala})`}>
    <defs>
      <clipPath id={`med-${id}`}>
        <circle r={r} />
      </clipPath>
    </defs>
    <circle r={r + 16} fill={N.zuta} stroke={N.kontura} strokeWidth={4} />
    <g clipPath={`url(#med-${id})`}>{children}</g>
    <circle r={r} fill="none" stroke={N.kontura} strokeWidth={4} />
    {Array.from({ length: 24 }, (_, i) => (
      <circle key={i} cx={Math.cos((i / 24) * Math.PI * 2) * (r + 8)} cy={Math.sin((i / 24) * Math.PI * 2) * (r + 8)} r={3.5} fill={N.crvena} />
    ))}
  </g>
);

export const Kofer: React.FC<{ s?: number; boja?: string }> = ({ s = 1, boja = N.drvo }) => (
  <g transform={`scale(${s})`}>
    <Boja d={kutija(-40, -10, 80, 60, 6)} boja={boja} />
    <path d="M-14,-10 C-14,-26 14,-26 14,-10" stroke={N.kontura} strokeWidth={5} fill="none" />
  </g>
);

export const Stetoskop: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M0,0 C-30,40 30,60 20,90" stroke="#3A3A3A" strokeWidth={5} fill="none" />
    <circle cx={20} cy={94} r={10} fill="#9A9A9A" stroke={N.kontura} strokeWidth={2} />
  </g>
);

export const Kljuc: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M0,0 L0,60" stroke="#7A7A7A" strokeWidth={9} strokeLinecap="round" />
    <path d="M-14,60 C-14,84 14,84 14,60 L6,60 L6,72 L-6,72 L-6,60Z" fill="#7A7A7A" stroke={N.kontura} strokeWidth={2} />
  </g>
);
