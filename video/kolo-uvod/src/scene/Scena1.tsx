// Scena 1 — „U Somboru svako nešto ume. A svakome nešto treba."
// Kolaž somborske ulice, iz prozora izviruju glave.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Defs, Isecak, Pop, pravougaonik } from "../papir";
import { Drvo, Etiketa, GlavaCfg, Kuca, Oblak, Sunce } from "../likovi";
import { kad } from "../vreme";

export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const svako = kad(1, "svako");
  const ume = kad(1, "ume,");
  const svakome = kad(1, "svakome");
  const treba = kad(1, "treba.");
  const nesto2 = kad(1, "nešto", 2);
  // blago približavanje kroz celu scenu
  const zum = 1 + f * 0.0006;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <g transform={`translate(540 900) scale(${zum}) translate(-540 -900)`}>
        <Pop at={2} x={880} y={300} skala={0.9}>
          <Sunce seed="s1-sunce" />
        </Pop>
        <Pop at={kad(1, "Somboru")} x={290} y={300} rot={-4} njihanje={1.5}>
          <Etiketa seed="s1-sombor" tekst="Sombor" velicina={84} boja={P.zelena900} />
        </Pop>
        <g transform={`translate(${f * 0.5} 0)`}>
          <Pop at={5} x={640} y={500} skala={0.9}>
            <Oblak seed="s1-ob1" />
          </Pop>
          <Pop at={9} x={180} y={560} skala={0.65}>
            <Oblak seed="s1-ob2" />
          </Pop>
        </g>
        {/* zadnji red kuća */}
        {(
          [
          { x: 150, boja: P.narandza, glava: { frizura: "punda" as const, kosa: P.kosaSeda }, od: ume },
          { x: 420, boja: "#CFE3C0", glava: { frizura: "kapa" as const, brkovi: true }, od: kad(1, "a") },
          { x: 690, boja: P.sunce, glava: { frizura: "rep" as const, kosa: P.kosaSmedja }, od: nesto2 },
          { x: 955, boja: "#F6E7C8", glava: { frizura: "cela" as const, kosa: P.kosaSeda, naocare: true }, od: treba },
          ] as { x: number; boja: string; glava: GlavaCfg; od: number }[]
        ).map((k, i) => (
          <Pop key={i} at={4 + i * 3} x={k.x} y={860} skala={0.66}>
            <Kuca seed={`s1-z${i}`} fasada={k.boja} prozori={[i % 2 ? { glava: k.glava, od: k.od } : undefined, i % 2 ? undefined : { glava: k.glava, od: k.od }]} />
          </Pop>
        ))}
        <Pop at={10} x={560} y={900} skala={0.7}>
          <Drvo seed="s1-d1" />
        </Pop>
        <Pop at={12} x={40} y={1240} skala={0.9}>
          <Drvo seed="s1-d2" boja={P.zelena700} />
        </Pop>
        <Pop at={14} x={1045} y={1240} skala={0.85}>
          <Drvo seed="s1-d3" boja={P.trava} />
        </Pop>
        {/* trava i trotoar */}
        <Pop at={0} x={540} y={1262}>
          <Isecak pts={pravougaonik(-600, -26, 1200, 60)} boja={P.trava} seed="s1-trava" />
          <Isecak pts={pravougaonik(-600, 22, 1200, 26)} boja="#D9CFBE" seed="s1-trotoar" senka="mala" />
        </Pop>
        {/* prednji red: dve velike kuće */}
        <Pop at={8} x={275} y={1250}>
          <Kuca
            seed="s1-p1"
            fasada={P.sunce}
            sirina={330}
            visina={220}
            prozori={[
              { od: svako, glava: { frizura: "marama", koza: P.koza } },
              { od: kad(1, "nešto"), glava: { frizura: "kratka", kosa: P.kosaTamna, brkovi: true, koza: P.koza2 } },
            ]}
          />
        </Pop>
        <Pop at={11} x={805} y={1250}>
          <Kuca
            seed="s1-p2"
            fasada="#F7DCC8"
            krov={P.korala}
            sirina={330}
            visina={220}
            kapci={P.nebo}
            prozori={[
              { od: svakome, glava: { frizura: "rep", kosa: P.kosaSmedja } },
              { od: treba - 4, glava: { frizura: "punda", kosa: P.kosaSeda, naocare: true } },
            ]}
          />
        </Pop>
      </g>
    </svg>
  );
};
