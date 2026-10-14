// Scena 3 — „Dok je sveska stajala kod njega, stanari nisu imali uvid kako se novac troši.“
// Đura zatvori svesku i stavi je u fioku komode; na „stajala“ fioka se zatvori. Na „stanari“ rez na ulaz:
// stanari kod sandučića; na „uvid“ pogledaju ka zatvorenim vratima Đurinog stana.
import React from "react";
import { Kadar, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { BAKA, DJURA, Komoda, STANAR, STANARKA, ZatvorenaSveska } from "../zgrada";
import { kad } from "../vreme";
import { KuhinjaPozadina, UlazSaTablom, rez } from "./zajednicko";

export const Scena3: React.FC = () => {
  const f = useF();
  const kS = kad(3, "stajala");
  const kSt = kad(3, "stanari");
  const kUv = kad(3, "uvid");
  const fioka = 1 - napredak(f, kS, 10);
  const ulaz = rez(f, kSt - 3, 6);
  const gleda: [number, number] = f > kUv ? [8, -1] : [0, 3];
  return (
    <Kadar>
      <g opacity={1 - ulaz}>
        <KuhinjaPozadina />
        <g transform="translate(470 1290)">
          <Komoda fioka={fioka} uFioci={<ZatvorenaSveska s={0.6} />} />
        </g>
        <Lik x={830} y={1300} s={0.95} okreni {...DJURA} glava={{ ...DJURA.glava, izraz: "mirna", pogled: [6, 6] }} dr={f < kS + 6 ? [60, 30] : [-10, -6]} glavaNagib={6} />
      </g>
      {ulaz > 0 && (
        <g opacity={ulaz}>
          <UlazSaTablom />
          <Lik x={200} y={1320} s={0.72} {...BAKA} glava={{ ...BAKA.glava, izraz: "zamisljena", pogled: gleda }} glavaNagib={f > kUv ? 6 : 0} />
          <Lik x={430} y={1340} s={0.75} {...STANARKA} glava={{ ...STANARKA.glava, izraz: "zamisljena", pogled: gleda }} glavaNagib={f > kUv + 4 ? 8 : 0} />
          <Lik x={650} y={1330} s={0.76} {...STANAR} glava={{ ...STANAR.glava, izraz: "zamisljena", pogled: gleda }} glavaNagib={f > kUv + 8 ? 6 : 0} lr={[10, 30]} />
        </g>
      )}
    </Kadar>
  );
};
