// Scena 5 — „Nije kupovina i nije prodaja. Samo komšije koje se razmenjuju.
// I KOLO koje je sve jače." Krug se širi i obuhvata ceo grad.
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Pop, Pt, napredak } from "../papir";
import { Crkva, Etiketa, Kuca, Pita, Korpa, Kljuc, Zupanija, Drvo } from "../likovi";
import { Kolo, LogoZnak } from "../kolo";
import { kad } from "../vreme";

const CX = 540;
const CY = 820;
const BOJE = [P.sunce, "#CFE3C0", P.narandza, "#F7DCC8", "#F6E7C8", P.zlatna400, "#E8D5F0", "#CDE7E5"];

type Obj = { x: number; y: number; s: number; at: number; tip: "kuca" | "crkva" | "zupanija" | "drvo"; i: number };

export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const kupovina = kad(5, "kupovina");
  const prodaja = kad(5, "prodaja.");
  const samo = kad(5, "Samo");
  const komsije = kad(5, "komšije");
  const razmenjuju = kad(5, "razmenjuju.");
  const koloF = kad(5, "KOLO");
  const jace = kad(5, "jače.");

  // kamera se udaljava dok se krug širi
  const zum = interpolate(napredak(f, koloF - 16, 50), [0, 1], [1, 0.4]);
  const R = interpolate(napredak(f, koloF - 16, 54), [0, 1], [300, 1220]);
  const jacina = interpolate(napredak(f, koloF, jace - koloF + 12), [0, 1], [8, 26]);

  const objekti: Obj[] = [];
  // prvi prsten: komšije
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2 + 0.3;
    objekti.push({ x: CX + Math.cos(a) * 390, y: CY + Math.sin(a) * 420 + 60, s: 0.52, at: samo + i * 3, tip: "kuca", i });
  }
  // drugi i treći prsten: grad
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + 0.1;
    objekti.push({ x: CX + Math.cos(a) * 820, y: CY + Math.sin(a) * 760 + 60, s: 0.72, at: koloF - 10 + i * 2, tip: i % 4 === 3 ? "drvo" : "kuca", i: i + 6 });
  }
  objekti.push({ x: CX, y: CY - 820, s: 1.1, at: koloF - 4, tip: "zupanija", i: 20 });
  objekti.push({ x: CX - 700, y: CY - 330, s: 1.0, at: koloF + 2, tip: "crkva", i: 21 });
  objekti.push({ x: CX + 720, y: CY - 300, s: 0.9, at: koloF + 6, tip: "crkva", i: 22 });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.35;
    if (Math.abs(Math.sin(a) + 1) < 0.25) continue; // gore je Županija
    objekti.push({ x: CX + Math.cos(a) * 1080, y: CY + Math.sin(a) * 1000 + 60, s: 0.85, at: koloF + 4 + i * 2, tip: i % 3 === 2 ? "drvo" : "kuca", i: i + 30 });
  }
  objekti.sort((a, b) => a.y - b.y);

  // razmena između komšija: predmet putuje lukom od kuće do kuće
  const komsija = (k: number): Pt => [objekti.find((o) => o.i === k)!.x, objekti.find((o) => o.i === k)!.y - 130];
  const razmene = [
    { a: 0, b: 1, od: komsije, el: <Pita seed="s5-p" /> },
    { a: 3, b: 2, od: komsije + 10, el: <Korpa seed="s5-k" paradajza={4} /> },
    { a: 4, b: 5, od: komsije + 20, el: <Kljuc seed="s5-kl" /> },
  ];

  const tag = (tekst: string, at: number, x: number, y: number, rot: number, seed: string) => {
    const precrtaj = napredak(f, at + 14, 8);
    const odlazi = napredak(f, samo - 4, 12);
    return (
      <g opacity={1 - odlazi} transform={`translate(0 ${-odlazi * 80})`}>
        <Pop at={at} x={x} y={y} rot={rot}>
          <Etiketa seed={seed} tekst={tekst} velicina={78} />
          <Crta pts={[[-150, 12], [0, -4], [150, -20]]} seed={`${seed}-x`} boja={P.korala} debljina={12} napredak={precrtaj} korak={30} />
        </Pop>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <g transform={`translate(${CX} ${CY}) scale(${zum}) translate(${-CX} ${-CY})`}>
        {/* KOLO — dvostruki krug koji raste i jača */}
        <Crta pts={Array.from({ length: 49 }, (_, i): Pt => [CX + Math.cos((i / 48) * Math.PI * 2) * R, CY + Math.sin((i / 48) * Math.PI * 2) * R * 0.94])} seed="s5-kr1" boja={P.zlatna400} debljina={jacina * 1.6} korak={60} amp={3} />
        <Crta pts={Array.from({ length: 49 }, (_, i): Pt => [CX + Math.cos((i / 48) * Math.PI * 2) * R, CY + Math.sin((i / 48) * Math.PI * 2) * R * 0.94])} seed="s5-kr2" boja={P.zelena700} debljina={jacina} korak={60} amp={3} />
        {objekti.map((o) => (
          <Pop key={o.i} at={o.at} x={o.x} y={o.y} skala={o.s}>
            {o.tip === "kuca" && <Kuca seed={`s5-k${o.i}`} fasada={BOJE[o.i % BOJE.length]} krov={o.i % 2 ? P.korala : P.korala600} kapci={o.i % 3 ? P.zelena700 : P.nebo} />}
            {o.tip === "drvo" && <Drvo seed={`s5-d${o.i}`} boja={o.i % 2 ? P.trava : P.zelena500} />}
            {o.tip === "crkva" && <Crkva seed={`s5-c${o.i}`} />}
            {o.tip === "zupanija" && <Zupanija seed="s5-zup" />}
          </Pop>
        ))}
        {razmene.map((r, i) => {
          const t = napredak(f, r.od, 34);
          if (f < r.od || t >= 1) return null;
          const a = komsija(r.a);
          const b = komsija(r.b);
          const x = a[0] + (b[0] - a[0]) * t;
          const y = a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * 140;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(0.38)`}>
              {r.el}
            </g>
          );
        })}
        {/* kolo ljudi u sredini */}
        <Kolo seed="s5-kolo" geo={{ cx: CX, cy: CY + 90, rx: 190, ry: 70, ugao: 40 + f * 0.9, skala: 0.62, n: 6 }} pojava={[0, 0, 0, 0, 0, 0]} ruke={-20} />
        <Pop at={koloF} x={CX} y={CY - 90} skala={0.8 + 0.12 * napredak(f, jace, 10)}>
          <LogoZnak seed="s5-logo" r={110} />
        </Pop>
      </g>
      {tag("kupovina", kupovina, 300, 290, -6, "s5-kup")}
      {tag("prodaja", prodaja, 780, 420, 5, "s5-pro")}
      {razmenjuju > 0 && null}
    </svg>
  );
};
