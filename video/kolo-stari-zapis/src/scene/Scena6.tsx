// Scena 6 — „Boja užeta označavala je vrstu robe, a čvorovi količinu. Tako se znalo šta je u skladištima i ko je šta doneo.“
// Kipu krupno. Na „Boja“ se konci oboje jedan po jedan i nad svakim uskoči roba te boje (kukuruz, vuna,
// krompir). Na „čvorovi“ niz konac se vežu čvorovi. Na „skladištima“ dole niknu kolke sa istom robom,
// a na „doneo“ dođe žena sa lamom i na žutom koncu se veže još jedan čvor.
import React from "react";
import { Hrapavo, Kadar, Pop, napredak, useF } from "../alat";
import { ANDI_ZENA, Lik } from "../likovi";
import { Kipu, Kolka, Krompir, Kukuruz, Lama, VunaAndi } from "../drevno";
import { kad } from "../vreme";
import { P } from "../paleta";

const BOJE = ["#E9B93C", "#F3ECDD", "#9C6B43"];
const IKONE = [<Kukuruz s={0.8} />, <VunaAndi s={0.9} />, <Krompir s={1.1} />];

export const Scena6: React.FC = () => {
  const f = useF();
  const kB = kad(6, "Boja");
  const kC = kad(6, "čvorovi");
  const kS = kad(6, "skladištima");
  const kD = kad(6, "doneo.");
  const kKo = kad(6, "ko");
  const extra = f >= kD ? 1 : 0;
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#B9CBC4" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
        <path d="M-100,1150 C200,1080 500,1120 760,1060 C900,1030 1050,1060 1200,1040 L1200,2100 L-100,2100Z" fill={P.zelenaPrigusena} />
        <path d="M-100,1150 C200,1080 500,1120 760,1060 C900,1030 1050,1060 1200,1040 L1200,2100 L-100,2100Z" fill="url(#gvasP)" opacity={0.35} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      {/* roba iznad konaca */}
      {IKONE.map((ik, i) => (
        <Pop key={i} at={kB + i * 7} x={540 + (i - 1) * 260} y={300}>
          {ik}
        </Pop>
      ))}
      <g transform="translate(540 400)">
        <Kipu
          x0={-390}
          x1={390}
          duzina={600}
          konci={BOJE.map((b, i) => ({
            boja: b,
            napredak: napredak(f, kB + i * 7, 14),
            cvorovi: i === 0 ? [1, 3, 4 + extra] : i === 1 ? [0, 4, 2] : [2, 1, 3],
            cvorNapredak: napredak(f, kC - 4 + i * 5, 22),
          }))}
        />
      </g>
      {/* skladišta */}
      {IKONE.map((ik, i) => (
        <Pop key={i} at={kS - 6 + i * 5} x={420 + i * 250} y={1300} skala={0.7}>
          <Kolka ikona={<g transform="scale(0.8)">{ik}</g>} />
        </Pop>
      ))}
      <Pop at={kKo - 4} x={150} y={1310} skala={1}>
        <Lik x={0} y={0} s={0.5} {...ANDI_ZENA} glava={{ ...ANDI_ZENA.glava, izraz: "srecna" }} lr={[20, 10]} dr={[60, 30]} />
      </Pop>
      <Pop at={kKo} x={60} y={1330} skala={1}>
        <Lama s={0.42} tovar={"#E9B93C"} />
      </Pop>
    </Kadar>
  );
};
