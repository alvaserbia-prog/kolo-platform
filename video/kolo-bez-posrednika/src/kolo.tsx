// Kolo kao igra: likovi u krugu (elipsa u perspektivi), ruke uhvaćene u prsten na visini šaka.
// Zadnja polovina se crta iza središta (npr. znaka KOLO), prednja ispred njega.
// Svaki igrač ima „težinu“ 0–1: novi igrač sa težinom 0 nema mesto u krugu, a kako težina raste,
// krug mu napravi mesto i proširi se — tako se vidi da se neko „uhvatio“.
import React from "react";
import { P } from "./paleta";
import { CERKA, KOMSIJA, KOMSINICA, Lik, MILICA, MLADIC1, MLADIC2, MUZ, SIN } from "./likovi";
import type { GlavaCfg } from "./likovi";

type Postava = { odeca: any; glava: GlavaCfg };

export const VESNA: Postava = {
  odeca: { tip: "suknja", bluza: P.zelenaSvetla, suknja: P.teget },
  glava: { kosa: "rep", bojaKose: P.kosaSmedja, seed: 9 },
};
export const DEDA: Postava = {
  odeca: { tip: "muski", kosulja: P.krem, pantalone: P.drvoTamno, prsluk: P.ajvarTamni },
  glava: { kosa: "muz_sed", brkovi: true, naocare: true, bojaKose: P.kosaSedaTamna, seed: 10 },
};
export const ZENA2: Postava = {
  odeca: { tip: "haljina", haljina: P.pekmez },
  glava: { kosa: "rep", bojaKose: P.kosaTamna, seed: 11 },
};

export const IGRACI: Postava[] = [MILICA, KOMSIJA, MLADIC1, KOMSINICA, MUZ, CERKA, MLADIC2, SIN, DEDA, ZENA2];

export type Igrac = {
  p: Postava;
  tezina?: number; // 0–1, mesto u krugu
  // igrač koji tek dolazi: tačka odakle dolazi i napredak 0–1 (1 = u krugu)
  dolazi?: { x: number; y: number; napredak: number };
  sjaj?: number;
  nevidljiv?: boolean; // prazno mesto u krugu (npr. za gledaoca)
  izraz?: GlavaCfg["izraz"];
};

export const Kolo: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  s: number;
  igraci: Igrac[];
  ugao: number; // stepeni
  f: number;
  centar?: React.ReactNode;
  opacity?: number;
  skok?: number; // koliko poskakuju (0–1)
}> = ({ cx, cy, rx, ry, s, igraci, ugao, f, centar, opacity = 1, skok = 1 }) => {
  const tez = igraci.map((g) => g.tezina ?? 1);
  const uk = tez.reduce((a, b) => a + b, 0);
  let kum = 0;
  const poz = igraci.map((g, i) => {
    const a = ((ugao + (360 * (kum + tez[i] / 2)) / uk) * Math.PI) / 180;
    kum += tez[i];
    let x = cx + Math.cos(a) * rx;
    let y = cy + Math.sin(a) * ry;
    if (g.dolazi) {
      const t = g.dolazi.napredak;
      x = g.dolazi.x + (x - g.dolazi.x) * t;
      y = g.dolazi.y + (y - g.dolazi.y) * t;
    }
    return { x, y, a, dubina: Math.sin(a) };
  });
  const prsten = cy - 413 * s;
  const lik = (i: number) => {
    const g = igraci[i];
    if (g.nevidljiv) return null;
    const { x, y, dubina } = poz[i];
    const sk = s * (0.86 + 0.14 * (dubina + 1) / 2);
    const dolazi = g.dolazi && g.dolazi.napredak < 1;
    const ruke: [number, number] = dolazi ? [20, 30] : [-80, 0];
    const skokY = dolazi ? 0 : -Math.abs(Math.sin(f / 7 + i * 1.3)) * 14 * s * skok;
    return (
      <g key={i} transform={`translate(0 ${skokY})`}>
        {g.sjaj ? <ellipse cx={x} cy={y - 330 * sk} rx={170 * sk} ry={300 * sk} fill={P.zlatna} opacity={0.45 * g.sjaj} filter="url(#sjaj)" /> : null}
        <Lik
          x={x}
          y={y}
          s={sk}
          {...g.p}
          lr={dolazi ? [-20, -30] : ruke}
          dr={dolazi ? [-70, -20] : [80, 0]}
          glava={{ ...g.p.glava, izraz: g.izraz ?? "srecna" }}
          hod={dolazi ? f / 2.2 : f / 5 + i}
        />
      </g>
    );
  };
  const redosled = igraci.map((_, i) => i).sort((a, b) => poz[a].dubina - poz[b].dubina);
  const zadnji = redosled.filter((i) => poz[i].dubina <= 0);
  const prednji = redosled.filter((i) => poz[i].dubina > 0);
  // prsten ruku kao niz tačaka; prazno mesto (nevidljiv igrač) prekida prsten
  const rupe = igraci
    .map((g, i) => (g.nevidljiv ? [poz[i].a, (Math.PI * tez[i]) / uk] : null))
    .filter((x): x is number[] => x !== null);
  const uRupi = (a: number) => rupe.some(([c, w]) => Math.abs(Math.atan2(Math.sin(a - c), Math.cos(a - c))) < w * 0.8);
  const luk = (d: number) => {
    const out: string[] = [];
    let pero = false;
    for (let k = 0; k <= 90; k++) {
      const a = d ? Math.PI + (k / 90) * Math.PI : (k / 90) * Math.PI;
      if (uRupi(a)) {
        pero = false;
        continue;
      }
      out.push(`${pero ? "L" : "M"}${(cx + Math.cos(a) * rx).toFixed(1)},${(prsten + Math.sin(a) * ry).toFixed(1)}`);
      pero = true;
    }
    return out.join(" ");
  };
  return (
    <g opacity={opacity}>
      <ellipse cx={cx} cy={cy + 6} rx={rx + 120 * s} ry={ry + 30 * s} fill={P.senka} opacity={0.12} />
      <path d={luk(1)} fill="none" stroke={P.mastilo} strokeWidth={60 * s} strokeLinecap="round" />
      <path d={luk(1)} fill="none" stroke={P.koza} strokeWidth={34 * s} strokeLinecap="round" />
      {zadnji.map(lik)}
      {centar}
      {prednji.map(lik)}
      <path d={luk(0)} fill="none" stroke={P.mastilo} strokeWidth={60 * s} strokeLinecap="round" />
      <path d={luk(0)} fill="none" stroke={P.koza} strokeWidth={34 * s} strokeLinecap="round" />
    </g>
  );
};

/** Zastavice na kanapu (seoski sabor). */
export const Zastavice: React.FC<{ x0: number; x1: number; y: number; ugib?: number; n?: number }> = ({ x0, x1, y, ugib = 80, n = 12 }) => {
  const boje = [P.ajvar, P.oker, P.zelenaPrigusena, P.plava, P.roze];
  const tacka = (t: number) => [x0 + (x1 - x0) * t, y + Math.sin(t * Math.PI) * ugib] as const;
  return (
    <g>
      <path d={`M${x0},${y} Q${(x0 + x1) / 2},${y + ugib * 2} ${x1},${y}`} fill="none" stroke={P.mastilo} strokeWidth={3} />
      {Array.from({ length: n }, (_, i) => {
        const [x, yy] = tacka((i + 0.5) / n);
        return <path key={i} d={`M${x - 22},${yy} L${x + 22},${yy} L${x},${yy + 52}Z`} fill={boje[i % boje.length]} stroke={P.mastilo} strokeWidth={3} strokeLinejoin="round" />;
      })}
    </g>
  );
};

/** Šaka gledaoca (vidi se nadlanica): dolazi odozdo i pruža se ka praznom mestu u kolu. */
export const Saka: React.FC<{ rukav?: string }> = ({ rukav = P.zelenaPrigusena }) => (
  <g>
    <path d="M-90,420 C-100,300 -80,200 -60,120 L70,120 C90,200 104,300 96,420Z" fill={rukav} stroke={P.mastilo} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-66,150 L76,150" stroke={P.mastilo} strokeWidth={5} opacity={0.5} />
    <path
      d="M-78,130 C-92,60 -96,0 -86,-40 L-90,-150 C-92,-176 -58,-180 -56,-152 L-50,-70 L-44,-196 C-42,-226 -4,-226 -4,-196 L-2,-80 L6,-206 C8,-236 46,-234 44,-204 L40,-74 L56,-176 C60,-204 94,-198 90,-170 L78,-40 C112,-90 150,-86 148,-58 C130,-10 100,40 88,80 C80,110 74,122 70,130Z"
      fill={P.koza}
      stroke={P.mastilo}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    {/* nokti i zglobovi prstiju: nadlanica, ne dlan */}
    {[
      [-73, -150, -8],
      [-24, -196, -2],
      [25, -204, 3],
      [73, -172, 8],
    ].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <path d="M-11,6 C-12,-10 12,-10 11,6 C8,12 -8,12 -11,6Z" fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
        <path d="M-10,62 C-4,58 4,58 10,62" fill="none" stroke={P.koza2} strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
    <path d="M-60,-10 C-30,0 30,0 60,-14" fill="none" stroke={P.koza2} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
  </g>
);

export { MILICA, KOMSIJA, KOMSINICA, MUZ, CERKA, MLADIC1, MLADIC2, SIN };
