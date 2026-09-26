// Naslovna (cover) za mreže: kuhinja, Milica drži teglu iznad kante, krupan naslov-pitanje.
// Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, SERIF, ucitajFontove } from "./fontovi";
import { Hrapavo, Kadar, Kamera } from "./alat";
import { Kuhinja } from "./pozadine";
import { Kanta, Tegla } from "./predmeti";
import { Lik, MILICA } from "./likovi";
import { Stranica } from "./Stranica";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Kadar>
      <Hrapavo>
        <Kamera x={600} y={960} z={1.42}>
          <Kuhinja sezona="jesen" policaTegle={3} />
          <g transform="translate(790 1300)">
            <Kanta s={1.2} otvor={0.7} />
          </g>
          <Lik
            x={450}
            y={1310}
            s={1.1}
            {...MILICA}
            glava={{ ...MILICA.glava, izraz: "tuzna", pogled: [1, 0.6] }}
            glavaNagib={8}
            lr={[8, 18]}
            dr={[72, 18]}
            drziD={
              <g transform="translate(0 124)">
                <Tegla vrsta="ajvar" natpis="ajvar" s={0.95} />
              </g>
            }
          />
        </Kamera>
      </Hrapavo>
    </Kadar>
    <AbsoluteFill>
      <Stranica />
    </AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 10px 12px rgba(58,42,29,0.35))" }}>
      <rect x={90} y={300} width={900} height={300} rx={30} fill={P.krem} stroke={P.mastilo} strokeWidth={5} />
      <rect x={104} y={314} width={872} height={272} rx={22} fill="none" stroke={P.vez} strokeWidth={3} strokeDasharray="12 7" />
      <text x={540} y={420} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={84} fill={P.mastilo}>
        Zašto je Milica
      </text>
      <text x={540} y={520} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={84} fill={P.ajvar}>
        bacila ajvar?
      </text>
      <rect x={170} y={1380} width={740} height={210} rx={26} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
      <text x={540} y={1462} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill={P.mastilo}>
        Priča o zimnici i komšijama
      </text>
      <text x={540} y={1548} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
