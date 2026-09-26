// Scena 4 — „Lazaru se jede burek. Marija ispeče tepsiju, a Lazar joj
// prepiše 1.000 POENA. Marija za njih uzme teglu Aninog meda."
// Dva takta: burek (Lazar → Marija), pa med (Marija → Ana). Prvi zapis se
// skloni gore desno kao mali kartončić — knjiga raste, ali ne preko ekrana.
import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { Defs, Pop, napredak } from "../papir";
import { Pita, spring01 } from "../likovi";
import { Lik, Misao, Tegla, Zapis } from "../likovi4";
import { kad } from "../vreme";

export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const jede = kad(4, "jede");
  const marija = kad(4, "Marija");
  const ispece = kad(4, "ispeče");
  const aLazar = kad(4, "a");
  const iznos = kad(4, "1.000");
  const poena = kad(4, "POENA.");
  const marija2 = kad(4, "Marija", 2);
  const uzme = kad(4, "uzme");
  const teglu = kad(4, "teglu");
  const meda = kad(4, "meda.");

  // drugi takt: Lazar izlazi levo, Ana ulazi sleva sa teglom
  const smena = napredak(f, marija2 - 14, 22, Easing.inOut(Easing.cubic));
  const lx = interpolate(smena, [0, 1], [240, -260]);
  const ax = interpolate(smena, [0, 1], [-260, 240]);

  // burek putuje od Marije do Lazara
  const burek = napredak(f, aLazar, 22);
  const bx = interpolate(burek, [0, 1], [830, 330]) + (smena > 0 ? lx - 240 : 0);
  const by = 990 - Math.sin(burek * Math.PI) * 170;

  // tegla putuje od Ane do Marije
  const tegla = napredak(f, teglu, 22);
  const tx = interpolate(tegla, [0, 1], [ax + 110, 700]);
  const ty = 1000 - Math.sin(tegla * Math.PI) * 170;

  // prvi zapis: sredina, pa gore desno i manji
  const z1 = spring01(f - iznos + 4);
  const skloni = napredak(f, marija2 - 10, 18);
  const z1x = interpolate(skloni, [0, 1], [540, 850]);
  const z1y = interpolate(skloni, [0, 1], [560, 330]);
  const z1s = interpolate(skloni, [0, 1], [1, 0.42]);
  const z2 = spring01(f - uzme + 4);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {lx > -250 && (
        <Pop at={4} x={lx} y={1150} skala={0.9} njihanje={1}>
          <Lik id="lazar" />
        </Pop>
      )}
      {smena > 0 && (
        <g transform={`translate(${ax} 1150) scale(0.9)`}>
          <Lik id="ana" />
        </g>
      )}
      <Pop at={marija} x={830} y={1150} skala={0.9} njihanje={1} faza={2}>
        <Lik id="marija" />
      </Pop>
      {/* Lazar misli na burek */}
      {f < marija + 10 && (
        <g opacity={1 - napredak(f, marija, 10)}>
          <Pop at={jede} x={330} y={660} njihanje={1.5}>
            <Misao seed="s4-misao">
              <g transform="scale(0.62)">
                <Pita seed="s4-mp" />
              </g>
            </Misao>
          </Pop>
        </g>
      )}
      {/* tepsija bureka */}
      {f >= ispece && smena < 1 && (
        <g transform={`translate(${bx} ${by}) scale(${(0.62 * Math.min(1, spring01(f - ispece))).toFixed(4)})`}>
          <Pita seed="s4-burek" />
        </g>
      )}
      {/* tegla Aninog meda */}
      {smena > 0 && (
        <g transform={`translate(${tx} ${ty}) scale(0.62)`}>
          <Tegla seed="s4-tegla" />
        </g>
      )}
      {f >= iznos - 4 && (
        <g transform={`translate(${z1x} ${z1y}) rotate(${-2 + (1 - Math.min(1, z1)) * -10 + skloni * 6}) scale(${(z1 * z1s).toFixed(4)})`}>
          <Zapis seed="s4-z1" od="lazar" kome="marija" iznos="1.000" upis={napredak(f, iznos - 2, 34)} zig={spring01(f - poena - 8)} />
        </g>
      )}
      {f >= uzme - 4 && (
        <g transform={`translate(540 580) rotate(${2 + (1 - Math.min(1, z2)) * 10}) scale(${z2.toFixed(4)})`}>
          <Zapis seed="s4-z2" od="marija" kome="ana" iznos="1.000" upis={napredak(f, uzme - 2, 34)} zig={spring01(f - meda)} />
        </g>
      )}
    </svg>
  );
};
