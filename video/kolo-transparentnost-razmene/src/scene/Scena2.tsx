// Scena 2 — „Zato, kada neko upravlja zajedničkim sredstvima, moramo da imamo uvid u njegove račune.“
// Ulaz zgrade iz videa 19: na oglasnoj tabli otvorena sveska kase (uplate i troškovi), čika Đura stoji pored
// table, stanari gledaju. Na „uvid“ kamera priđe svesci.
import React from "react";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { BAKA, DJURA, STANAR, STANARKA } from "../zgrada";
import { kad } from "../vreme";
import { SVESKA_NA_TABLI, UlazSaTablom } from "./zajednicko";

export const Scena2: React.FC = () => {
  const f = useF();
  const kN = kad(2, "upravlja");
  const kU = kad(2, "uvid");
  const zum = napredak(f, kU - 6, 36);
  const gleda: [number, number] = [4, -7];
  return (
    <Kadar>
      <Kamera x={mesaj(540, SVESKA_NA_TABLI.x, zum)} y={mesaj(900, SVESKA_NA_TABLI.y + 160, zum)} z={mesaj(1, 1.45, zum)}>
        <UlazSaTablom sveska={1} svetlo={1} vrata={false} />
        <Lik x={910} y={1330} s={0.8} okreni {...DJURA} glava={{ ...DJURA.glava, izraz: "osmeh", pogled: f > kN ? [-6, 0] : [-3, 3] }} dr={[-60, -30]} />
        <Lik x={170} y={1380} s={0.74} {...STANARKA} glava={{ ...STANARKA.glava, izraz: "zamisljena", pogled: gleda }} />
        <Lik x={420} y={1410} s={0.8} {...STANAR} glava={{ ...STANAR.glava, izraz: "zamisljena", pogled: gleda }} />
        <Lik x={660} y={1400} s={0.72} {...BAKA} glava={{ ...BAKA.glava, izraz: "mirna", pogled: [-3, -7] }} />
      </Kamera>
    </Kadar>
  );
};
