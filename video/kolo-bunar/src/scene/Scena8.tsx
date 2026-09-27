// Sc. 8 — „A danas je gotovo sve nečije. Privatno ili državno.“
// Isto mesto kao na početku, ali bez ljudi i prigušenih boja: preko ravnice se iscrtavaju ograde,
// na bunar pada katanac, a na izgovorene reči niču table PRIVATNO i DRŽAVNO.
import React from "react";
import { Easing } from "remotion";
import { Hrapavo, Kadar, Kamera, Pop, Utisak, mesaj, mesajBoju, napredak, useF } from "../alat";
import { P } from "../paleta";
import { Bunar, Katanac, Nebo, Ograda, Ravnica, Salas, Sunce, Tabla, Topola } from "../motivi";
import { NASLOV } from "../fontovi";
import { kad, trajanjeF } from "../vreme";

export const Scena8: React.FC = () => {
  const f = useF();
  const T = trajanjeF(8);
  const tNec = kad(8, "nečije.");
  const z = mesaj(1.1, 1.02, napredak(f, 0, T, Easing.out(Easing.cubic)));
  const sivo = mesajBoju(P.trava, P.sivo, 0.55);
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1060} z={z}>
          <Nebo od={120} do={1010} gustina={1.2} />
          <g transform="translate(790 560)" opacity={0.6}>
            <Sunce r={78} boja={P.kamen} zraci={0.4} />
          </g>
          <g transform="translate(90 1030)">
            <Topola s={0.55} boja={P.sivo} />
          </g>
          <g transform="translate(960 1030)">
            <Topola s={0.6} boja={P.sivo} />
          </g>
          <g transform="translate(250 1040)">
            <Salas s={0.42} />
          </g>
          <Ravnica y={1030} boja={sivo} vlati={0.6} />
          {/* ograde: dalja, srednja, bliža */}
          <Ograda x0={-20} x1={1100} y={1110} visina={50} napredak={napredak(f, 2, 26)} />
          <Ograda x0={540} x1={1100} y={1250} visina={80} napredak={napredak(f, 10, 22)} nagib={0.12} />
          <Ograda x0={-20} x1={430} y={1260} visina={80} napredak={napredak(f, 16, 22)} nagib={-0.05} />
          <g transform="translate(470 1330) scale(1.2)">
            <Bunar ugao={-22} bezDjerma={false} />
          </g>
          <Ograda x0={220} x1={760} y={1470} visina={120} napredak={napredak(f, 20, 24)} />
          <Utisak at={tNec - 2} x={470} y={1290}>
            <Katanac s={1.5} />
          </Utisak>
          <Pop at={kad(8, "Privatno") - 3} x={250} y={1250} rot={-5}>
            <Tabla tekst="PRIVATNO" font={NASLOV} sirina={320} />
          </Pop>
          <Pop at={kad(8, "državno.") - 3} x={840} y={1260} rot={4}>
            <Tabla tekst="DRŽAVNO" font={NASLOV} sirina={300} />
          </Pop>
        </Kamera>
      </Hrapavo>
      <rect x={0} y={0} width={1080} height={1920} fill={P.sivo} opacity={0.12} style={{ mixBlendMode: "multiply" }} />
    </Kadar>
  );
};
