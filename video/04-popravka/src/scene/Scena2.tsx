// Scena 2 — „Milanu treba med. Ana ga pravi. Dogovore se za pet tegli,
// 5.000 POENA, i Milan joj ih prepiše."
// Milan misli na med, Ana ima tezgu sa teglama; dogovor je jedan zapis.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Defs, Pop, napredak } from "../papir";
import { spring01 } from "../likovi";
import { Lik, Misao, Pult, Tegla, Zapis } from "../likovi4";
import { kad } from "../vreme";

const TEGLE_X = [-240, -120, 0, 120, 240];

export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const treba = kad(2, "treba");
  const ana = kad(2, "Ana");
  const ga = kad(2, "ga");
  const dogovore = kad(2, "Dogovore");
  const pet = kad(2, "pet");
  const iznos = kad(2, "5.000");
  const milan2 = kad(2, "Milan");
  const prepise = kad(2, "prepiše.");

  // Milan priđe Ani kad se dogovaraju
  const mx = interpolate(napredak(f, dogovore - 6, 22), [0, 1], [260, 380]);
  // tegle uskaču na pult jedna po jedna, od „ga" do „pravi"
  const naPultu = Math.max(0, Math.min(5, Math.floor((f - ga) / 5) + 1));
  const selidba = (i: number) => napredak(f, milan2 - 6 + i * 4, 18);
  const misaoOde = napredak(f, dogovore - 10, 8);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <Pop at={4} x={mx} y={1150} skala={0.95} njihanje={1}>
        <Lik id="milan" />
      </Pop>
      <Pop at={ana} x={820} y={1150} skala={0.95} njihanje={1} faza={2}>
        <Lik id="ana" />
      </Pop>
      {/* Anina tezga (tegle koje su prešle Milanu se ne crtaju na pultu) */}
      <Pop at={ga - 4} x={820} y={1080} skala={0.52}>
        <Pult seed="s2-pult" n={0} />
        {TEGLE_X.slice(0, naPultu).map((x, i) => {
          const s = selidba(i);
          if (s > 0) return null;
          const skok = f >= pet && f < pet + 20 ? Math.sin(((f - pet - i * 2) / 20) * Math.PI) * 30 : 0;
          return (
            <g key={i} transform={`translate(${x} ${-90 - Math.max(0, skok)}) scale(0.9)`}>
              <Tegla seed={`s2-t${i}`} />
            </g>
          );
        })}
      </Pop>
      {/* tegle putuju lukom od tezge do Milana */}
      {TEGLE_X.map((x, i) => {
        const s = selidba(i);
        if (s <= 0) return null;
        const ax = 820 + x * 0.52;
        const ay = 1080 - 90 * 0.52;
        const bx = mx - 170 + i * 85;
        const by = 1010;
        const px = ax + (bx - ax) * s;
        const py = ay + (by - ay) * s - Math.sin(s * Math.PI) * 180;
        return (
          <g key={i} transform={`translate(${px} ${py}) scale(0.47) rotate(${(1 - s) * 20})`}>
            <Tegla seed={`s2-t${i}`} />
          </g>
        );
      })}
      {/* Milan misli na med */}
      {misaoOde < 1 && (
        <g opacity={1 - misaoOde}>
          <Pop at={treba} x={330} y={660} njihanje={1.5}>
            <Misao seed="s2-misao">
              <g transform="translate(0 6) scale(0.9)">
                <Tegla seed="s2-mt" />
              </g>
            </Misao>
          </Pop>
        </g>
      )}
      {/* dogovor = jedan zapis */}
      {f >= iznos - 4 && (
        <g transform={`translate(540 560) rotate(${-2 + (1 - Math.min(1, spring01(f - iznos + 4))) * -10}) scale(${spring01(f - iznos + 4).toFixed(4)})`}>
          <Zapis seed="s2-zapis" od="milan" kome="ana" iznos="5.000" upis={napredak(f, iznos - 2, 40)} zig={spring01(f - prepise)} />
        </g>
      )}
    </svg>
  );
};
