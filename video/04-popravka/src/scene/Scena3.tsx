// Scena 3 — „Ani se pokvari veš mašina. Lazar je popravi! Ana mu prepiše
// 4.000 POENA. Nije dala nijedan dinar."
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Pop, napredak } from "../papir";
import { Etiketa, Kljuc, spring01 } from "../likovi";
import { Iskra, Lik, VesMasina, Zapis } from "../likovi4";
import { kad } from "../vreme";

export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const pokvari = kad(3, "pokvari");
  const ves = kad(3, "veš");
  const lazar = kad(3, "Lazar");
  const je = kad(3, "je");
  const popravi = kad(3, "popravi!");
  const iznos = kad(3, "4.000");
  const poena = kad(3, "POENA.");
  const nije = kad(3, "Nije");
  const nijedan = kad(3, "nijedan");

  const popravljena = f >= popravi + 6;
  const osmehAne = f < pokvari ? 1 : popravljena ? 1 : -1;
  const kljucRadi = f >= je && f < popravi + 10;

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <Pop at={4} x={200} y={1150} skala={0.85} njihanje={1}>
        <Lik id="ana" osmeh={osmehAne} />
      </Pop>
      <Pop at={ves - 2} x={560} y={1040} skala={0.82}>
        <VesMasina seed="s3-masina" kvar={popravljena ? 0 : 1} />
      </Pop>
      <g transform="translate(560 1030)">
        <Iskra t={napredak(f, popravi + 4, 22)} r={170} seed="s3-iskra" />
      </g>
      <Pop at={lazar} x={890} y={1150} skala={0.85} njihanje={1} faza={3}>
        <Lik id="lazar" />
      </Pop>
      {kljucRadi && (
        <Pop at={je} x={720} y={900} skala={0.8} rot={20 + Math.sin(f / 2.2) * 18}>
          <Kljuc seed="s3-kljuc" />
        </Pop>
      )}
      {f >= iznos - 4 && (
        <g transform={`translate(540 540) rotate(${2 + (1 - Math.min(1, spring01(f - iznos + 4))) * 10}) scale(${spring01(f - iznos + 4).toFixed(4)})`}>
          <Zapis seed="s3-zapis" od="ana" kome="lazar" iznos="4.000" upis={napredak(f, iznos - 2, 36)} zig={spring01(f - poena - 10)} />
        </g>
      )}
      {/* nijedan dinar: etiketa „dinar" se precrta */}
      <Pop at={nije} x={800} y={380} rot={7} njihanje={1.5}>
        <Etiketa seed="s3-dinar" tekst="dinari" velicina={72} />
        <Crta pts={[[-130, 14], [0, -2], [130, -18]]} seed="s3-precrt" boja={P.korala} debljina={12} napredak={napredak(f, nijedan, 10)} korak={30} />
      </Pop>
    </svg>
  );
};
