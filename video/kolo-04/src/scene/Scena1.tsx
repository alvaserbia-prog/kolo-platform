// Scena 1 — „Ovo je priča o četvoro komšija iz Sombora. Živeli su nadomak
// jedni drugih, a nikada se nisu upoznali." Somborski motivi u pozadini,
// četiri kuće u istoj ulici, iz svake proviruje jedan lik; između njih upitnici.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, Pt, napredak, pravougaonik } from "../papir";
import { Drvo, Etiketa, Kuca, Oblak, Sunce, Upitnik } from "../likovi";
import { DefsNalepnica, LIKOVI, LikId, Slika } from "../prica";
import { kad } from "../vreme";

const KUCE: { id: LikId; x: number; fasada: string; krov: string; kapci: string }[] = [
  { id: "milan", x: 160, fasada: "#E8DDF3", krov: P.korala600, kapci: P.zelena700 },
  { id: "ana", x: 413, fasada: P.sunce, krov: P.korala, kapci: P.zelena700 },
  { id: "lazar", x: 667, fasada: "#D5E7F2", krov: P.korala600, kapci: P.nebo },
  { id: "marija", x: 920, fasada: "#F7DCC8", krov: P.korala, kapci: P.zelena700 },
];

export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const sombora = kad(1, "Sombora.");
  const cetvoro = kad(1, "četvoro");
  const komsija = kad(1, "komšija");
  const nadomak = kad(1, "nadomak");
  const nikada = kad(1, "nikada");
  const zum = 1 + f * 0.00035;
  const Y = 1150; // linija ulice

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <DefsNalepnica />
      <g transform={`translate(540 900) scale(${zum}) translate(-540 -900)`}>
        <Pop at={2} x={905} y={270} skala={0.75}>
          <Sunce seed="s1-sunce" />
        </Pop>
        <g transform={`translate(${f * 0.45} 0)`}>
          <Pop at={6} x={170} y={300} skala={0.7}>
            <Oblak seed="s1-ob1" />
          </Pop>
          <Pop at={10} x={620} y={250} skala={0.55}>
            <Oblak seed="s1-ob2" />
          </Pop>
        </g>
        {/* Sombor u pozadini: crkve sa strane, Županija u sredini */}
        <Pop at={4} x={185} y={745} skala={1}>
          <Slika ime="trg-svetog-trojstva" sirina={420} seed="s1-trg" />
        </Pop>
        <Pop at={8} x={900} y={745} skala={1}>
          <Slika ime="crkva-svetog-djordja" sirina={410} seed="s1-crk" />
        </Pop>
        <Pop at={12} x={540} y={775} skala={1}>
          <Slika ime="zupanija" sirina={620} seed="s1-zup" />
        </Pop>
        <Pop at={sombora - 2} x={540} y={380} rot={-3} njihanje={1.2}>
          <Etiketa seed="s1-sombor" tekst="Sombor" velicina={96} boja={P.zelena900} />
        </Pop>
        {/* travnjak i ulica */}
        <Pop at={0} x={540} y={Y - 170}>
          <Isecak pts={pravougaonik(-620, -30, 1240, 220)} boja={P.trava} seed="s1-trava" />
        </Pop>
        <Pop at={0} x={540} y={Y + 30}>
          <Isecak pts={pravougaonik(-620, -18, 1240, 44)} boja="#D9CFBE" seed="s1-trotoar" senka="mala" />
        </Pop>
        {/* četiri kuće; iz prozora proviruju komšije */}
        {KUCE.map((k, i) => (
          <Pop key={k.id} at={cetvoro - 6 + i * 4} x={k.x} y={Y} skala={0.86}>
            <Kuca
              seed={`s1-k${i}`}
              fasada={k.fasada}
              krov={k.krov}
              kapci={k.kapci}
              prozori={i % 2 ? [{ glava: LIKOVI[k.id].glava, od: komsija + i * 4 }, undefined] : [undefined, { glava: LIKOVI[k.id].glava, od: komsija + i * 4 }]}
            />
          </Pop>
        ))}
        {KUCE.map((k, i) => (
          <Pop key={`e${k.id}`} at={komsija + 6 + i * 4} x={k.x} y={Y + 62} rot={i % 2 ? 3 : -3}>
            <Etiketa seed={`s1-ime${i}`} tekst={LIKOVI[k.id].ime} velicina={42} />
          </Pop>
        ))}
        <Pop at={20} x={1060} y={Y - 10} skala={0.6}>
          <Drvo seed="s1-d2" boja={P.zelena700} />
        </Pop>
        <Pop at={22} x={20} y={Y - 10} skala={0.6}>
          <Drvo seed="s1-d1" boja={P.trava} />
        </Pop>
        {/* „nadomak": kratke strelice pokazuju koliko su blizu */}
        {[0, 1, 2].map((i) => {
          const a = KUCE[i].x + 70;
          const b = KUCE[i + 1].x - 70;
          const y = Y - 300;
          const t = napredak(f, nadomak + i * 5, 12);
          const pts: Pt[] = [[a, y], [(a + b) / 2, y - 26], [b, y]];
          const nestaje = napredak(f, nikada - 6, 8);
          return (
            <g key={i} opacity={1 - nestaje}>
              <Crta pts={pts} seed={`s1-bl${i}`} boja={P.zelena700} debljina={6} napredak={t} korak={20} isprekidana />
            </g>
          );
        })}
        {/* „nikada se nisu upoznali": upitnici između kuća */}
        {[0, 1, 2].map((i) => (
          <Pop key={`u${i}`} at={nikada + i * 5} x={(KUCE[i].x + KUCE[i + 1].x) / 2} y={Y - 330} skala={0.36} njihanje={5} faza={i}>
            <Upitnik seed={`s1-up${i}`} boja={i === 1 ? P.korala : P.zlatna600} />
          </Pop>
        ))}
      </g>
    </svg>
  );
};
