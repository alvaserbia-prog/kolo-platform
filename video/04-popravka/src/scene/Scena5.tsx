// Scena 5 — „Na početku se nisu poznavali… A sad su u istom kolu.
// POEN nije novac. To je zapis o tome šta je ko dao."
// Četvoro na mestima iz scene 1; tri razmene se iscrtaju kao veze u boji
// onoga ko je dao, pa se svi uhvate u kolo i obuhvati ih zlatni krug.
// Na „zapis" se pojavi knjiga: četiri kartončića, lepezom.
import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Pop, Pt, napredak } from "../papir";
import { Etiketa, spring01 } from "../likovi";
import { Kolo } from "../kolo";
import { Iskra, LIK, Lik, LikId, OSOBE_KOLA, Zapis } from "../likovi4";
import { kad } from "../vreme";

const MESTA: Record<LikId, Pt> = { milan: [270, 700], ana: [810, 700], lazar: [810, 1160], marija: [270, 1160] };
const VEZE: { a: LikId; b: LikId }[] = [
  { a: "milan", b: "ana" },
  { a: "ana", b: "lazar" },
  { a: "lazar", b: "marija" },
  { a: "marija", b: "ana" },
];
const ZAPISI: { od: LikId; kome: LikId; iznos: string }[] = [
  { od: "milan", kome: "ana", iznos: "5.000" },
  { od: "ana", kome: "lazar", iznos: "4.000" },
  { od: "lazar", kome: "marija", iznos: "1.000" },
  { od: "marija", kome: "ana", iznos: "1.000" },
];

export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const pocetku = kad(5, "početku");
  const aSad = kad(5, "A");
  const kolu = kad(5, "kolu.");
  const poen = kad(5, "POEN");
  const novac = kad(5, "novac.");
  const zapis = kad(5, "zapis");

  const uKolo = napredak(f, aSad - 6, 20, Easing.inOut(Easing.cubic));
  const koloP = napredak(f, kolu - 8, 26);
  const dizanje = napredak(f, poen - 6, 24, Easing.inOut(Easing.cubic));
  const cy = interpolate(dizanje, [0, 1], [960, 1080]);
  const geo = { cx: 540, cy, rx: 300, ry: 110, ugao: 225 + f * 0.6, skala: 0.95, n: 4 };

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* pre kola: četvoro na svojim mestima + veze razmena */}
      {uKolo < 1 && (
        <g opacity={1 - uKolo}>
          {VEZE.map((v, i) => {
            const a = MESTA[v.a];
            const b = MESTA[v.b];
            const pts: Pt[] = [[a[0], a[1] - 120], [(a[0] + b[0]) / 2 + 20, (a[1] + b[1]) / 2 - 140], [b[0], b[1] - 120]];
            return <Crta key={i} pts={pts} seed={`s5-v${i}`} boja={LIK[v.a].boja} debljina={12} napredak={napredak(f, pocetku + i * 9, 14)} korak={30} />;
          })}
          {(Object.keys(MESTA) as LikId[]).map((id, i) => (
            <Pop key={id} at={0} x={MESTA[id][0] + (540 - MESTA[id][0]) * uKolo} y={MESTA[id][1] + (960 - MESTA[id][1]) * uKolo} skala={0.62} njihanje={1} faza={i}>
              <Lik id={id} />
            </Pop>
          ))}
        </g>
      )}
      {/* kolo */}
      {f >= aSad + 4 && (
        <g>
          <Crta
            pts={Array.from({ length: 49 }, (_, i): Pt => [540 + Math.cos(-Math.PI / 2 + (i / 48) * Math.PI * 2) * 430, cy - 70 + Math.sin(-Math.PI / 2 + (i / 48) * Math.PI * 2) * 250])}
            seed="s5-zlato"
            boja={P.zlatna400}
            debljina={22}
            napredak={koloP}
            korak={60}
            amp={3}
          />
          <Kolo seed="s5-kolo" geo={geo} pojava={[0, 1, 2, 3].map((i) => aSad + 4 + i * 3)} ruke={aSad + 18} osobe={OSOBE_KOLA} />
          <g transform={`translate(540 ${cy - 70})`}>
            <Iskra t={napredak(f, kolu + 10, 22)} r={300} seed="s5-iskra" />
          </g>
        </g>
      )}
      {/* POEN nije novac */}
      {f < zapis + 10 && (
        <g opacity={1 - napredak(f, zapis - 4, 12)}>
          <Pop at={poen + 4} x={540} y={520} rot={-4} njihanje={1.5}>
            <Etiketa seed="s5-novac" tekst="novac" velicina={96} />
            <Crta pts={[[-160, 16], [0, -2], [160, -22]]} seed="s5-precrt" boja={P.korala} debljina={14} napredak={napredak(f, novac, 10)} korak={30} />
          </Pop>
        </g>
      )}
      {/* … nego zapis: knjiga od četiri kartončića */}
      {ZAPISI.map((z, i) => {
        const s = spring01(f - zapis - i * 5);
        if (s <= 0) return null;
        const rot = [-9, -3, 3, 9][i];
        return (
          <g key={i} transform={`translate(${540 + (i - 1.5) * 26} ${540 + i * 22}) rotate(${rot * s}) scale(${(0.72 * s).toFixed(4)})`}>
            <Zapis seed={`s5-z${i}`} od={z.od} kome={z.kome} iznos={z.iznos} upis={1} zig={1} />
          </g>
        );
      })}
    </svg>
  );
};
