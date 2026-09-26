// Stil 5 — Jedna linija „Od vrata do vrata".
// Jedna neprekidna linija iscrtava ulicu: kuća, komšija sa korpom, drvo, druga kuća, baka sa
// teglom, komšija sa kosilicom… pa se podigne i zatvori krug oko cele ulice. Kamera prati vrh
// pera, na kraju se odzumira. Boja se razlije kao akvarel ispod onoga što je nacrtano.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Muzika, Natpis, Znak, clamp01, ease } from "./zajednicko";

type Pt = [number, number];
const TLO = 1300;

// ——— gradnja jedne neprekidne putanje ———
const put: Pt[] = [];
const idi = (...t: Pt[]) => put.push(...t);
const luk = (cx: number, cy: number, r: number, od: number, do_: number, n = 28, ry = r) => {
  for (let i = 0; i <= n; i++) {
    const a = od + ((do_ - od) * i) / n;
    put.push([cx + Math.cos(a) * r, cy + Math.sin(a) * ry]);
  }
};
const deg = (d: number) => (d * Math.PI) / 180;

/** Kuća sa vratima; ulazi i izlazi na tlu. */
const kuca = (x: number, s = 1, vrataOtvorena = false) => {
  const w = 380 * s;
  const h = 320 * s;
  idi([x, TLO], [x, TLO - h], [x + w / 2, TLO - h - 190 * s], [x + w, TLO - h]);
  // prozor na krovu (tavanski krug)
  luk(x + w / 2, TLO - h - 70 * s, 34 * s, deg(90), deg(90 + 360), 24);
  idi([x + w, TLO - h], [x + w, TLO]);
  // vrata (unutar kuće, sa tla)
  const vx = x + w * 0.58;
  idi([vx + 70 * s, TLO], [vx + 70 * s, TLO - 190 * s]);
  luk(vx + 35 * s, TLO - 190 * s, 35 * s, deg(0), deg(-180), 12);
  idi([vx, TLO]);
  if (vrataOtvorena) idi([vx - 40 * s, TLO - 20 * s], [vx - 40 * s, TLO - 205 * s], [vx, TLO - 190 * s], [vx, TLO]);
  // prozor levo
  idi([x + w * 0.12, TLO], [x + w * 0.12, TLO - 170 * s], [x + w * 0.4, TLO - 170 * s], [x + w * 0.4, TLO - 250 * s], [x + w * 0.12, TLO - 250 * s], [x + w * 0.12, TLO - 170 * s], [x + w * 0.12, TLO]);
  idi([x + w + 20, TLO]);
};

/** Čovek: noga, telo, glava (petlja), ruka sa predmetom, druga noga. */
const covek = (x: number, predmet: "korpa" | "tegla" | "kosilica", punda = false) => {
  idi([x, TLO], [x + 30, TLO - 150], [x + 30, TLO - 290]);
  luk(x + 30, TLO - 340, 48, deg(90), deg(90 + 360), 30);
  if (punda) luk(x + 30, TLO - 400, 20, deg(90), deg(90 + 360), 16);
  idi([x + 30, TLO - 290], [x + 30, TLO - 260]);
  if (predmet === "korpa") {
    idi([x + 110, TLO - 200]);
    luk(x + 160, TLO - 200, 50, deg(180), deg(0), 16);
    luk(x + 160, TLO - 200, 50, deg(0), deg(-180), 16, 60);
    idi([x + 110, TLO - 200], [x + 30, TLO - 260]);
  } else if (predmet === "tegla") {
    idi([x + 100, TLO - 220], [x + 100, TLO - 280], [x + 170, TLO - 280], [x + 170, TLO - 180], [x + 100, TLO - 180], [x + 100, TLO - 220], [x + 30, TLO - 260]);
  } else {
    idi([x + 150, TLO - 180], [x + 240, TLO - 20]);
    luk(x + 265, TLO - 25, 25, deg(180), deg(540), 16);
    idi([x + 150, TLO - 180], [x + 30, TLO - 260]);
  }
  idi([x + 30, TLO - 150], [x + 70, TLO], [x + 180, TLO]);
};

const drvo = (x: number) => {
  idi([x, TLO], [x, TLO - 180]);
  luk(x, TLO - 280, 100, deg(90), deg(90 + 360), 36, 110);
  idi([x, TLO - 180], [x + 10, TLO], [x + 140, TLO]);
};

idi([-300, TLO]);
kuca(-120);
covek(380, "korpa");
drvo(720);
kuca(900, 1, true);
covek(1360, "tegla", true);
covek(1720, "kosilica");
kuca(2150, 0.9);
// kraj ulice → linija se diže i zatvara krug oko svega
const KCX = 1150;
const KCY = 1150;
const KR = 1620;
idi([2700, TLO], [2800, TLO - 200]);
luk(KCX, KCY, KR, deg(-5), deg(-5 - 360), 90, 1350);

// dužine
const duz: number[] = [0];
for (let i = 1; i < put.length; i++) duz.push(duz[i - 1] + Math.hypot(put[i][0] - put[i - 1][0], put[i][1] - put[i - 1][1]));
const UKUPNO = duz[duz.length - 1];
const D = put.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

const tackaNa = (L: number): Pt => {
  let lo = 0;
  let hi = duz.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (duz[m] < L) lo = m;
    else hi = m;
  }
  const t = (L - duz[lo]) / Math.max(1e-6, duz[hi] - duz[lo]);
  return [put[lo][0] + (put[hi][0] - put[lo][0]) * t, put[lo][1] + (put[hi][1] - put[lo][1]) * t];
};

// akvarel mrlje: [x, y, rx, ry, boja, na koliko % dužine se pojavi]
const duzDo = (x: number) => duz[put.findIndex((p) => p[0] >= x)] ?? UKUPNO;
const MRLJE: [number, number, number, number, string][] = [
  [70, TLO - 230, 230, 200, P.korala],
  [470, TLO - 250, 140, 190, P.nebo],
  [720, TLO - 290, 130, 130, P.trava],
  [1090, TLO - 230, 230, 200, P.sunce],
  [1470, TLO - 260, 130, 190, P.slezova],
  [1850, TLO - 220, 160, 170, P.more],
  [2320, TLO - 210, 210, 190, P.roze],
];

export const Linija: React.FC = () => {
  const f = useCurrentFrame();
  // pero: 0–7,6 s ulica i krug, konstantnom brzinom
  const L = interpolate(f, [4, 232], [0, UKUPNO], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vrh = tackaNa(L);
  const pocetakKruga = duzDo(2800) + 200;
  // kamera: prati vrh; kad krene krug — odzumira se na celu ulicu
  const odzum = ease(clamp01((L - pocetakKruga + 900) / 1400));
  const z = interpolate(odzum, [0, 1], [1.55, 0.3]);
  const cx = interpolate(odzum, [0, 1], [Math.min(Math.max(vrh[0], 150), 2600), KCX]);
  const cy = interpolate(odzum, [0, 1], [TLO - 300, KCY]);
  const kraj = ease(clamp01((f - 240) / 14));

  return (
    <AbsoluteFill style={{ background: P.papir, overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - 0.9 * kraj }}>
        <defs>
          <filter id="akvarel" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={3} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={60} />
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>
        <g transform={`translate(540 ${1120 + 60 * odzum}) scale(${z}) translate(${-cx} ${-cy})`}>
          <g filter="url(#akvarel)" style={{ mixBlendMode: "multiply" }}>
            {MRLJE.map(([x, y, rx, ry, boja], i) => {
              const t = ease(clamp01((L - duzDo(x - rx * 0.4)) / 700));
              return <ellipse key={i} cx={x} cy={y} rx={rx * (0.4 + 0.6 * t)} ry={ry * (0.4 + 0.6 * t)} fill={boja} opacity={0.42 * t} />;
            })}
          </g>
          <path d={D} fill="none" stroke={P.zelena900} strokeWidth={11 / Math.max(z, 0.5)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L} ${UKUPNO + 10}`} />
          {/* vrh pera */}
          {L < UKUPNO && <circle cx={vrh[0]} cy={vrh[1]} r={16 / z} fill={P.zlatna400} />}
        </g>
      </svg>

      <Natpis f={f} od={0} do={40} boja={P.zelena900}>Sve počinje na vratima.</Natpis>
      <Natpis f={f} od={40} do={92} boja={P.zelena900}>Poneseš ono čega<br />imaš viška.</Natpis>
      <Natpis f={f} od={92} do={150} boja={P.zelena900}>Neko ima ono<br />što treba tebi.</Natpis>
      <Natpis f={f} od={150} do={196} boja={P.zelena900}>Rad. Dobra. Znanje.</Natpis>
      <Natpis f={f} od={196} do={244} boja={P.korala600}>Tako se pravi<br />komšiluk.</Natpis>

      {f >= 244 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans', sans-serif" }}>
          <div style={{ borderRadius: 70, overflow: "hidden", transform: `scale(${spring({ frame: f - 244, fps: 30, config: { damping: 12 } })})` }}>
            <Znak velicina={340} />
          </div>
          <div style={{ fontSize: 140, fontWeight: 900, color: P.zelena900, marginTop: 50, letterSpacing: -4, opacity: clamp01((f - 252) / 6) }}>ekolo.rs</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 90, fontWeight: 700, color: P.zelena700, opacity: clamp01((f - 262) / 6) }}>Od vrata do vrata.</div>
        </div>
      )}
      <Muzika odSekunde={0.2} jacina={0.8} />
    </AbsoluteFill>
  );
};
