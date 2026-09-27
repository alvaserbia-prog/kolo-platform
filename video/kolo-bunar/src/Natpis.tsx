// Natpisi iz scenarija: u vrhu kadra, kao urezana ploča — crno mastilo, slova ostaju boje papira.
// Pojavljuju se na izgovorenu reč i traju do kraja scene. Neki imaju delove koji se pale redom
// (sc. 2 „Pašnjak · bunar · šuma · reka“, sc. 9 „Razmena · pomoć · svaki doprinos je zapisan“).
import React from "react";
import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P } from "./paleta";
import { NASLOV, SERIF } from "./fontovi";
import { kad, scena } from "./vreme";

type Deo = { t: string; od: number };
type N = { od: number; do: number; redovi: Deo[][]; pod?: string; podOd?: number; znak?: "?" | "navod" };

const g = (id: number, rec: string, pojava = 1) => scena(id).odF + kad(id, rec, pojava);
const kraj = (id: number) => scena(id).doF - 6;
const svi = (od: number, ...redovi: string[]) => redovi.map((r) => [{ t: r, od }]);

export const NATPISI: N[] = [
  { od: 12, do: kraj(1), redovi: svi(12, "Nekada je priroda", "bila zajednička") },
  {
    od: g(2, "Seoski") - 4,
    do: kraj(2),
    redovi: [
      [
        { t: "Pašnjak", od: g(2, "pašnjak,") - 3 },
        { t: "bunar", od: g(2, "bunar,") - 3 },
      ],
      [
        { t: "šuma", od: g(2, "šuma,") - 3 },
        { t: "reka", od: g(2, "reka.") - 3 },
      ],
    ],
  },
  { od: g(3, "verovalo") - 2, do: kraj(3), redovi: svi(g(3, "verovalo") - 2, "„Zajedničko", "uvek propada“") },
  { od: g(4, "Elinor") - 4, do: kraj(4), redovi: svi(g(4, "Elinor") - 4, "Elinor Ostrom"), pod: "prva žena s Nobelovom nagradom za ekonomiju (2009)", podOd: g(4, "Elinor") + 10 },
  { od: scena(5).odF + 8, do: kraj(5), redovi: svi(scena(5).odF + 8, "Kada opstaje?") },
  { od: scena(6).odF + 8, do: kraj(6), redovi: svi(scena(6).odF + 8, "Kada propada?") },
  { od: g(7, "traju") - 4, do: kraj(7), redovi: svi(g(7, "traju") - 4, "Traje vekovima") },
  { od: g(8, "danas") - 4, do: kraj(8), redovi: svi(g(8, "danas") - 4, "Danas je gotovo", "sve nečije") },
  {
    od: g(9, "razmenjujemo") - 4,
    do: kraj(9),
    redovi: [
      [
        { t: "Razmena", od: g(9, "razmenjujemo") - 4 },
        { t: "pomoć", od: g(9, "pomažemo") - 4 },
      ],
      [{ t: "svaki doprinos je zapisan", od: g(9, "zapisano,") - 4 }],
    ],
  },
  { od: g(10, "Ovaj") - 4, do: scena(10).doF, redovi: svi(g(10, "Ovaj") - 4, "Bunar kopamo", "zajedno") },
];

const Ploca: React.FC<{ n: N; s: number; izlaz: number; idx: number }> = ({ n, s, izlaz, idx }) => {
  const f = useCurrentFrame();
  const velicina = n.redovi.length > 1 ? 74 : 80;
  const redH = velicina * 1.14;
  const visina = 64 + n.redovi.length * redH + (n.pod ? 70 : 0);
  const sirina = 940;
  const x0 = 540 - sirina / 2;
  const y0 = 96;
  // neravna ivica ploče
  const tacke: string[] = [];
  const K = 24;
  for (let i = 0; i <= K; i++) tacke.push(`${x0 + (sirina * i) / K},${y0 + random(`n${idx}a${i}`) * 7}`);
  for (let i = 0; i <= 6; i++) tacke.push(`${x0 + sirina - random(`n${idx}b${i}`) * 6},${y0 + (visina * i) / 6}`);
  for (let i = K; i >= 0; i--) tacke.push(`${x0 + (sirina * i) / K},${y0 + visina - random(`n${idx}c${i}`) * 7}`);
  for (let i = 6; i >= 0; i--) tacke.push(`${x0 + random(`n${idx}d${i}`) * 6},${y0 + (visina * i) / 6}`);
  return (
    <svg
      viewBox="0 0 1080 1920"
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        inset: 0,
        opacity: Math.min(1, s * 1.6) * (1 - izlaz),
        transform: `translateY(${(1 - s) * -30}px) scale(${1.06 - 0.06 * s})`,
        transformOrigin: "540px 200px",
      }}
    >
      <polygon points={tacke.join(" ")} fill={P.mastilo} transform="translate(8 8)" opacity={0.25} />
      <polygon points={tacke.join(" ")} fill={P.mastilo} />
      <rect x={x0 + 16} y={y0 + 16} width={sirina - 32} height={visina - 32} fill="none" stroke={P.krem} strokeWidth={2} opacity={0.5} />
      {n.redovi.map((red, r) => {
        const y = y0 + 44 + velicina * 0.82 + r * redH;
        const ukupno = red.map((d) => d.t).join(" · ");
        // delovi se pale redom; pozicije su iz celog reda da se red ne pomera
        let pre = "";
        return (
          <text key={r} x={540} y={y} textAnchor="middle" fontFamily={NASLOV} fontWeight={900} fontSize={velicina} fill={P.krem} letterSpacing={0.5}>
            {red.map((d, i) => {
              const vidljiv = interpolate(f - d.od, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const tekst = (i ? " · " : "") + d.t;
              pre += tekst;
              return (
                <tspan key={i} fillOpacity={0.12 + 0.88 * vidljiv} fill={i && vidljiv > 0.5 && f - d.od < 18 ? P.okerSvetli : P.krem}>
                  {tekst}
                </tspan>
              );
            })}
            <title>{ukupno}</title>
          </text>
        );
      })}
      {n.pod && (
        <text
          x={540}
          y={y0 + visina - 42}
          textAnchor="middle"
          fontFamily={SERIF}
          fontStyle="italic"
          fontWeight={700}
          fontSize={36}
          fill={P.okerSvetli}
          opacity={interpolate(f - (n.podOd ?? n.od), [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}
        >
          {n.pod}
        </text>
      )}
    </svg>
  );
};

export const Natpisi: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = NATPISI.findIndex((x) => f >= x.od && f < x.do);
  if (idx < 0) return null;
  const n = NATPISI[idx];
  const s = spring({ frame: f - n.od, fps, config: { damping: 13, stiffness: 180, mass: 0.7 } });
  const izlaz = interpolate(f, [n.do - 7, n.do], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Ploca n={n} s={s} izlaz={izlaz} idx={idx} />;
};
