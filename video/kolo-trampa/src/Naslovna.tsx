// Naslovna (still): tabla, Milica sa teglom i stara cipela sa rupom, obućar odmahuje, naslov kredom.
// Pitanje iz svakodnevice, ne KOLO na početku (pravilo „Prvo problem iz života“, video/README.md).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { ucitajFontove } from "./fontovi";
import { RUKOPIS } from "./fontovi";
import { Kadar, Kreda, PomakCtx } from "./alat";
import { Lik, MILICA, OBUCAR } from "./likovi";
import { Tegla } from "./predmeti";
import { Cipela, Drva, Iks, Oblacic } from "./stvari";
import { Pod } from "./scene/zajednicko";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.tabla }}>
    <Img src={staticFile("tabla.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <PomakCtx.Provider value={-1000}>
      <Kadar>
        <Kreda>
          <text x={540} y={300} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={150} fill={P.mastilo}>
            Ajvar za cipele?
          </text>
          <text x={540} y={430} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={76} fill={P.oker}>
            Zašto trampa ne funkcioniše
          </text>
          <Pod y={1478} x0={60} x1={1020} />
          <Lik x={250} y={1470} s={0.9} {...MILICA} glava={{ ...MILICA.glava, izraz: "zamisljena", pogled: [1, 0] }} lr={[10, 10]} dr={[82, 0]} drziD={<Tegla vrsta="ajvar" s={0.8} />} />
          <g transform="translate(298 1468)">
            <Cipela s={0.38} boja="#8A6A52" rupa palac={1} />
          </g>
          <Lik x={830} y={1470} s={0.9} okreni {...OBUCAR} glava={{ ...OBUCAR.glava, izraz: "zamisljena", pogled: [1, 0] }} lr={[10, 10]} dr={[30, 50]} drziD={<Cipela s={0.4} boja="#A0583A" nova />} />
          <g transform="translate(560 860)">
            <Iks s={1.1} />
          </g>
          <g transform="translate(860 640)">
            <Oblacic w={280} h={190} rep="levo">
              <g transform="translate(0 70)">
                <Drva s={0.62} />
              </g>
            </Oblacic>
          </g>
        </Kreda>
      </Kadar>
    </PomakCtx.Provider>
  </AbsoluteFill>
);
