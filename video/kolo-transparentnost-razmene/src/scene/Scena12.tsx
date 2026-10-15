// Scena 12 — „U KOLU pravila važe jednako za sve.“ Svanulo je. Na trgu se igra kolo; u kolu je i upravnik,
// na istoj zemlji kao svi, a prazno postolje ostaje iza. Na „jednako“ izađe sunce i obasja svakog isto.
import React from "react";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Kolo, type Igrac } from "../kolo";
import { Nebo, Postolje, Trg } from "../noc";
import { kad } from "../vreme";
import { MLADIC2, SIN, CERKA, MUZ } from "../likovi";
import { SELJANI, UPRAVNIK } from "./svet";

const IGRACI: Igrac[] = [UPRAVNIK, ...SELJANI, MLADIC2, CERKA, MUZ, SIN].map((p) => ({ p }));

export const Scena12: React.FC = () => {
  const f = useF();
  const kJ = kad(12, "jednako");
  const zora = napredak(f, -10, 40);
  const sunce = napredak(f, kJ - 10, 30);
  return (
    <Kadar>
      <Kamera x={540} y={1000} z={mesaj(1.05, 1.0, zora)}>
        <Nebo zora={0.6 + zora * 0.4} />
        <g opacity={sunce}>
          <circle cx={540} cy={mesaj(820, 640, sunce)} r={150} fill="#FFD98A" />
          <circle cx={540} cy={mesaj(820, 640, sunce)} r={420} fill="url(#toplaSvetlost)" />
        </g>
        <Trg y={1000} prozori={0.2} />
        <g transform="translate(540 920)" opacity={0.85}>
          <Postolje h={80} w={300} />
        </g>
        <Kolo cx={540} cy={1260} rx={380} ry={110} s={0.5} igraci={IGRACI} ugao={f * 1.1} f={f} />
      </Kamera>
    </Kadar>
  );
};
