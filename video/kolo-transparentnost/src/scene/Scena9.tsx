// Scena 9 — „To se naziva transparentnost upravljanja.“
// Tabla u ulazu, osvetljena; svi stanari i Đura stoje oko nje. Bez natpisa (reč nosi titl);
// kamera se polako odmakne, kadar stoji da se reč slegne.
import React from "react";
import { Easing } from "remotion";
import { Kadar, Kamera, Pop, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { BAKA, DEVOJCICA, DJURA, MLADI_STANAR, STANAR, STANARKA } from "../zgrada";
import { SVESKA_NA_TABLI, TABLA, UlazSaTablom } from "./zajednicko";
import { Cedulja } from "./Scena8";

export const Scena9: React.FC = () => {
  const f = useF();
  const odmak = napredak(f, 0, 90, Easing.inOut(Easing.sin));
  return (
    <Kadar>
      <Kamera x={540} y={mesaj(900, 960, odmak)} z={mesaj(1.1, 1, odmak)}>
        <UlazSaTablom sveska={1} svetlo={1} sveskaProps={{ dodatniRed: 1, zbir: 1 }} />
        <Pop at={-20} x={SVESKA_NA_TABLI.x} y={TABLA.y + 46} rot={-2}>
          <Cedulja tekst="EVIDENCIJA" w={200} fs={36} />
        </Pop>
        <Lik x={90} y={1330} s={0.7} {...STANAR} glava={{ ...STANAR.glava, izraz: "osmeh", pogled: [8, -6] }} />
        <Lik x={270} y={1360} s={0.72} {...STANARKA} glava={{ ...STANARKA.glava, izraz: "osmeh", pogled: [6, -6] }} />
        <Lik x={420} y={1370} s={0.58} {...DEVOJCICA} dete glava={{ ...DEVOJCICA.glava, izraz: "srecna" }} />
        <Lik x={600} y={1350} s={0.82} {...DJURA} glava={{ ...DJURA.glava, izraz: "srecna" }} />
        <Lik x={790} y={1350} s={0.7} {...BAKA} glava={{ ...BAKA.glava, izraz: "osmeh", pogled: [-6, -6] }} />
        <Lik x={980} y={1340} s={0.72} okreni {...MLADI_STANAR} glava={{ ...MLADI_STANAR.glava, izraz: "osmeh", pogled: [-6, -6] }} />
      </Kamera>
    </Kadar>
  );
};
