// Scena 3 — „KOLO to pamćenje zapisuje. Taj zapis se zove POEN."
// Sličice iz sećanja se skupe gore, izranja komšijska sveska, a sličice jedna po jedna
// uleću u nju i postaju redovi zapisa. Boje se razbistre (Kolaz.tsx). Na „POEN" žigovi
// i natpis „POEN = zapis o doprinosu", pečat „NIJE NOVAC".
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Defs, Pop, napredak, usePop } from "../papir";
import { LogoZnak } from "../kolo";
import { Natpis, Pecat, Slicica } from "../selo";
import { Sveska, X_REDA, yReda } from "../sveska";
import { SECANJE } from "../zapisi";
import { SLICICE, SadrzajSlicice } from "./Scena2";
import { kad } from "../vreme";

export const SV3 = { x: 540, y: 900, s: 1 };

/** Stanje reda sećanja u sceni 3 (koristi i scena 4 za kraj). */
export const redoviSecanja = (f: number, pamcenje: number, poen: number) =>
  SECANJE.map((r, i) => {
    const sleti = pamcenje - 4 + i * 9 + 12;
    return { ...r, pisanje: napredak(f, sleti, 17, Easing.linear), zig: Math.max(0, Math.min(1.2, (f - poen - i * 3) / 8)) };
  });

export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const kolo = kad(3, "KOLO");
  const pamcenje = kad(3, "pamćenje");
  const taj = kad(3, "Taj");
  const poen = kad(3, "POEN.");

  const skup = napredak(f, 0, 14);
  const sveskaUlaz = napredak(f, 3, 18, Easing.out(Easing.back(1.2)));
  const svY = interpolate(sveskaUlaz, [0, 1], [1900, SV3.y]);
  const redovi = redoviSecanja(f, pamcenje, poen);
  const pecat = usePop(poen + 8, 220);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <g transform={`translate(${SV3.x} ${svY}) rotate(${(1 - sveskaUlaz) * 6})`}>
        <Sveska seed="sv" redovi={redovi} naslov={napredak(f, 8, 14)} />
      </g>
      <Pop at={kolo - 2} x={SV3.x + 355} y={SV3.y - 262} skala={0.42} rot={8}>
        <LogoZnak seed="s3-logo" r={110} />
      </Pop>

      {/* sličice: skupe se gore, pa uleću u redove */}
      {SLICICE.map((s, i) => {
        const cilj = { x: 220 + i * 320, y: 330 - (i === 1 ? 30 : 0) };
        const start = pamcenje - 4 + i * 9;
        const let_ = napredak(f, start, 12, Easing.in(Easing.cubic));
        if (let_ >= 1) return null;
        const x0 = interpolate(skup, [0, 1], [s.x, cilj.x]);
        const y0 = interpolate(skup, [0, 1], [s.y, cilj.y]);
        const sk0 = interpolate(skup, [0, 1], [1, 0.52]);
        const tx = SV3.x + X_REDA + 40;
        const ty = SV3.y + yReda(i) - 16;
        const x = interpolate(let_, [0, 1], [x0, tx]);
        const y = interpolate(let_, [0, 1], [y0, ty]) - Math.sin(let_ * Math.PI) * 140;
        const sk = interpolate(let_, [0, 1], [sk0, 0.1]);
        const rot = interpolate(skup, [0, 1], [s.rot, (i - 1) * 6]) + let_ * 180;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${sk})`} opacity={let_ > 0.8 ? (1 - let_) / 0.2 : 1}>
            <Slicica seed={`s2-sl${i}`} natpis={s.natpis}>
              <SadrzajSlicice i={i} t={f + 60} seed={`s2-c${i}`} />
            </Slicica>
          </g>
        );
      })}

      <Pop at={taj - 2} x={540} y={215} rot={-2}>
        <Natpis seed="s3-n" tekst={<>POEN = zapis o doprinosu</>} duzina={24} velicina={64} />
      </Pop>
      {pecat > 0 && (
        <g transform={`translate(540 ${360}) rotate(-5)`}>
          <Pecat seed="s3-pecat" tekst="NIJE NOVAC" t={pecat} velicina={58} />
        </g>
      )}
    </svg>
  );
};
