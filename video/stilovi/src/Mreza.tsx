// Stil 4 — Mreža tačaka „Lanac potvrda".
// Tamna pozadina, zlatna tačka „ti". Neko te potvrdi (linija + kvačica), ti potvrdiš dvoje,
// oni po dvoje… mreža se razgrana na udarce, pa se sve tačke skupe u krug i postanu znak.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Muzika, Natpis, Znak, clamp01, ease } from "./zajednicko";

type Cvor = { id: number; x: number; y: number; roditelj: number; t: number; nivo: number };

const TI = { x: 540, y: 1080 };
// udarci (112 BPM): 120, 136, 152, 168 …
const UDAR = (n: number) => Math.round(120 + n * 16.07);

const napravi = (): Cvor[] => {
  const c: Cvor[] = [];
  c.push({ id: 0, x: TI.x, y: TI.y, roditelj: -1, t: 0, nivo: 0 }); // ti
  c.push({ id: 1, x: TI.x - 20, y: TI.y - 330, roditelj: -1, t: 28, nivo: -1 }); // onaj ko te zna
  // grananje: svaki čvor potvrđuje dvoje (pa sve više), radijalno od tebe
  let prethodni = [0];
  const uglovi: Record<number, number> = { 0: Math.PI / 2 };
  const siroki: Record<number, number> = { 0: Math.PI * 1.6 };
  for (let nivo = 1; nivo <= 6; nivo++) {
    const novi: number[] = [];
    const deca = nivo <= 3 ? 2 : nivo === 4 ? 3 : 2;
    for (const r of prethodni) {
      for (let k = 0; k < deca; k++) {
        const id = c.length;
        const sirina = siroki[r] / deca;
        const ug = uglovi[r] - siroki[r] / 2 + sirina * (k + 0.5) + (random(`u${id}`) - 0.5) * sirina * 0.4;
        const rad = 170 * nivo + (random(`r${id}`) - 0.5) * 60;
        uglovi[id] = ug;
        siroki[id] = sirina * 1.05;
        const t = nivo <= 3 ? UDAR(nivo - 1) + k * 3 : UDAR(3) + (nivo - 4) * 12 + random(`t${id}`) * 12;
        c.push({ id, x: TI.x + Math.cos(ug) * rad, y: TI.y + Math.sin(ug) * rad * 1.05, roditelj: r, t, nivo });
        novi.push(id);
      }
    }
    prethodni = novi;
  }
  c[1].roditelj = -1;
  return c;
};

const CVOROVI = napravi();
const N = CVOROVI.length;
const KRUG_R = 330;
// mesto na krugu: po uglu čvora oko „tebe", da se linije pri skupljanju ne ukrštaju
const UGAO_NA_KRUGU = (() => {
  const u = CVOROVI.map((c, i) => ({ i, a: i === 0 ? -Math.PI / 2 : Math.atan2(c.y - TI.y, c.x - TI.x) }));
  u.sort((a, b) => a.a - b.a);
  const out: number[] = [];
  u.forEach((x, k) => (out[x.i] = -Math.PI + (k / N) * Math.PI * 2));
  return out;
})();

export const Mreza: React.FC = () => {
  const f = useCurrentFrame();
  // kamera: odzumira se kako mreža raste
  const z = interpolate(f, [0, 110, 150, 200, 240], [1.35, 1.2, 0.95, 0.72, 0.72], { extrapolateRight: "clamp", easing: ease });
  // skupljanje u krug (7,5–8,5 s)
  const sk = ease(clamp01((f - 222) / 22));
  const znak = clamp01((f - 244) / 10);

  const poz = (c: Cvor, i: number) => {
    const a = UGAO_NA_KRUGU[i];
    const kx = TI.x + Math.cos(a) * KRUG_R;
    const ky = TI.y + Math.sin(a) * KRUG_R;
    const px = (c.x - TI.x) * z + TI.x;
    const py = (c.y - TI.y) * z + TI.y;
    return { x: px + (kx - px) * sk, y: py + (ky - py) * sk };
  };
  const P0 = CVOROVI.map((c, i) => poz(c, i));

  // potvrda „tebe": linija od čvora 1 ka tebi 30–70, kvačica 70–90
  const lin1 = ease(clamp01((f - 40) / 22));
  const kv = clamp01((f - 70) / 10);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 56%, #185A30 0%, ${P.zelena900} 60%, #0A2A16 100%)`, overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - znak }}>
        {/* linije potvrda */}
        {CVOROVI.map((c, i) => {
          if (c.roditelj < 0) return null;
          const t = ease(clamp01((f - c.t) / 8));
          if (t <= 0) return null;
          const a = P0[c.roditelj];
          const b = P0[i];
          return (
            <line
              key={`l${i}`}
              x1={a.x}
              y1={a.y}
              x2={a.x + (b.x - a.x) * t}
              y2={a.y + (b.y - a.y) * t}
              stroke={c.nivo <= 3 ? P.zelena500 : "rgba(134,201,122,0.55)"}
              strokeWidth={(c.nivo <= 3 ? 6 : 3) * (1 - sk * 0.6)}
              opacity={1 - sk}
            />
          );
        })}
        {/* onaj ko te zna → ti */}
        <line x1={P0[1].x} y1={P0[1].y} x2={P0[1].x + (P0[0].x - P0[1].x) * lin1} y2={P0[1].y + (P0[0].y - P0[1].y) * lin1} stroke={P.zelena500} strokeWidth={7} opacity={1 - sk} />
        {/* tačke */}
        {CVOROVI.map((c, i) => {
          const pojava = i === 0 ? 1 : spring({ frame: f - c.t - (c.roditelj >= 0 ? 6 : 0), fps: 30, config: { damping: 9, stiffness: 160 } });
          if (pojava <= 0) return null;
          const ti = i === 0;
          const puls = ti ? 1 + Math.sin(f / 5) * 0.12 * (1 - sk) : 1;
          const r = (ti ? 34 : c.nivo <= 3 && c.nivo >= -1 ? 20 : 11) * pojava * puls * (1 - sk * 0.35);
          const boja = ti ? P.zlatna400 : c.nivo === -1 ? P.belo : c.nivo <= 3 ? P.zelenaSvetla : "#B9E2B0";
          return (
            <g key={`c${i}`}>
              {ti && <circle cx={P0[i].x} cy={P0[i].y} r={r * 2.2} fill={P.zlatna400} opacity={0.18} />}
              <circle cx={P0[i].x} cy={P0[i].y} r={r} fill={boja} />
            </g>
          );
        })}
        {/* kvačica uz „tebe" */}
        {kv > 0 && sk < 1 && (
          <g transform={`translate(${P0[0].x + 50} ${P0[0].y - 70}) scale(${spring({ frame: f - 70, fps: 30, config: { damping: 8 } })})`} opacity={1 - sk}>
            <circle r={36} fill={P.zelena500} />
            <path d="M-16 1 L-4 13 L18 -12" stroke={P.belo} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - kv} />
          </g>
        )}
      </svg>

      {/* oznake uz prve tačke */}
      {f < 118 && (
        <div style={{ position: "absolute", left: P0[0].x - 200, width: 400, top: P0[0].y + 50, textAlign: "center", fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 64, color: P.zlatna400, opacity: clamp01(f / 8) }}>ti</div>
      )}

      <Natpis f={f} od={0} do={34}>Ovo si ti.</Natpis>
      <Natpis f={f} od={34} do={70}>Neko ko te lično zna…</Natpis>
      <Natpis f={f} od={70} do={116} boja={P.zelenaSvetla}>…te potvrdi.</Natpis>
      <Natpis f={f} od={118} do={178}>Ti potvrdiš<br />nekog koga znaš.</Natpis>
      <Natpis f={f} od={180} do={244} boja={P.zlatna400}>Lanac potvrda.<br />Bez papira.</Natpis>

      {f >= 244 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans', sans-serif" }}>
          <div style={{ marginTop: 0, borderRadius: 70, overflow: "hidden", transform: `scale(${spring({ frame: f - 244, fps: 30, config: { damping: 10 } })})` }}>
            <Znak velicina={340} />
          </div>
          <div style={{ fontSize: 140, fontWeight: 900, color: P.belo, marginTop: 50, letterSpacing: -4, opacity: clamp01((f - 252) / 6) }}>ekolo.rs</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 90, fontWeight: 700, color: P.zlatna400, opacity: clamp01((f - 262) / 6) }}>Ko tebe zna?</div>
        </div>
      )}
      <Muzika fajl="muzika2.mp3" odSekunde={30} />
    </AbsoluteFill>
  );
};
