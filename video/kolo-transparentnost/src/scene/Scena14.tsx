// Scena 14 — „Ne moraš verovati na reč, jer sve možeš da proveriš.“
// Podeljen kadar: levo tabla iz ulaza sa sveskom, desno telefon sa spiskom. Na „reč“ Đura levo raširi
// ruke (nema šta da kaže); na „proveriš“ istovremeno se istakne red u svesci i red na telefonu i na oba
// uskoči zelena kvačica.
import React from "react";
import { Easing } from "remotion";
import { Kadar, Pop, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { DJURA, EkranSistem, OglasnaTabla, SveskaKase, VelikiTelefon } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KoloPozadina } from "./kolo";

const Kvacica: React.FC = () => (
  <g>
    <circle r={46} fill={P.zelena500} stroke={P.mastilo} strokeWidth={4} />
    <path d="M-20,0 L-4,16 L22,-16" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export const Scena14: React.FC = () => {
  const f = useF();
  const kR = kad(14, "reč,");
  const kP = kad(14, "proveriš.");
  const ist = napredak(f, kP - 4, 14, Easing.out(Easing.cubic));
  const sirenje = napredak(f, kR - 4, 10);
  return (
    <Kadar>
      <KoloPozadina sjaj={0.4} />
      <line x1={540} y1={260} x2={540} y2={1260} stroke={P.mastilo} strokeWidth={4} strokeDasharray="14 12" opacity={0.35} />
      {/* levo: tabla sa sveskom */}
      <g transform="translate(40 470) scale(0.72)">
        <OglasnaTabla w={640} h={420} svetlo={1} natpis={false} />
        <g transform="translate(252 252) scale(0.62)">
          <SveskaKase dodatniRed={1} zbir={1} isticanje={[[1, ist]]} />
        </g>
      </g>
      <Lik x={270} y={1320} s={0.7} {...DJURA} glava={{ ...DJURA.glava, izraz: f > kR ? "osmeh" : "mirna" }} lr={[12 - sirenje * 75, 8 - sirenje * 45]} dr={[-12 + sirenje * 75, -8 + sirenje * 45]} />
      {/* desno: telefon */}
      <g transform="translate(800 760) scale(0.78)">
        <VelikiTelefon>
          <EkranSistem redova={6} isticanje={[1, ist]} />
        </VelikiTelefon>
      </g>
      <Pop at={kP + 2} x={420} y={560}>
        <Kvacica />
      </Pop>
      <Pop at={kP + 2} x={980} y={500}>
        <Kvacica />
      </Pop>
    </Kadar>
  );
};
