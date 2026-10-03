// Scena 9 — „Nema provizije, nema participacije. Niko ti ne određuje cenu tvoga rada ni proizvoda.“
// Topla pijaca: Milica sa teglom i komšija sa hlebom razmenjuju se pravo, bez ikoga između
// (zelena dvostruka strelica). Na „provizije“ i „participacije“ cedulje između njih budu precrtane;
// na „određuje“ Milica na svoju cedulju sama napiše „po dogovoru“.
import React from "react";
import { P } from "../paleta";
import { Hrapavo, Kadar, Pop, napredak, useF } from "../alat";
import { KOMSIJA, Lik, MILICA } from "../likovi";
import { Hleb, Sto, Tegla } from "../predmeti";
import { Kuce, Ulica } from "../pozadine";
import { Zastavice } from "../kolo";
import { kad } from "../vreme";
import { Cedulja, Precrtaj, Strelica } from "./zajednicko";

export const Scena9: React.FC = () => {
  const f = useF();
  const k1 = kad(9, "provizije,");
  const k2 = kad(9, "participacije.");
  const kOdr = kad(9, "određuje");
  const strel = napredak(f, 6, 24);
  const slova = Math.floor(napredak(f, kOdr, 22) * "po dogovoru".length);
  return (
    <Kadar>
      <Hrapavo>
        <Ulica nebo="#F1C98A" />
        <circle cx={540} cy={560} r={520} fill="url(#toplaSvetlost)" />
        <Kuce y={900} s={0.45} n={7} x0={-120} razmak={220} svetlo={0.6} />
        <Zastavice x0={-40} x1={1120} y={420} ugib={70} n={14} />
        <g transform="translate(540 1180)">
          <Sto w={980} h={120} />
        </g>
      </Hrapavo>
      <Lik x={170} y={1330} s={0.82} {...MILICA} glava={{ ...MILICA.glava, izraz: "srecna", pogled: [5, 0] }} lr={[20, 20]} dr={[-95, -15]} drziD={<Tegla vrsta="ajvar" s={0.9} />} />
      <Lik x={560} y={1330} s={0.82} okreni {...KOMSIJA} glava={{ ...KOMSIJA.glava, izraz: "srecna", pogled: [5, 0] }} lr={[20, 20]} dr={[-95, -15]} drziD={<g transform="scale(0.8)"><Hleb /></g>} />
      <Strelica x1={290} y1={740} x2={450} y2={740} luk={-80} napredak={strel} boja={P.zelena700} debljina={7} />
      <Strelica x1={450} y1={810} x2={290} y2={810} luk={80} napredak={strel} boja={P.zelena700} debljina={7} />
      <Pop at={k1 - 4} x={400} y={560} rot={-4}>
        <Cedulja tekst="provizija" sirina={280} velicina={40} />
        <Precrtaj w={260} napredak={napredak(f, k1 + 4, 10)} />
      </Pop>
      <Pop at={k2 - 4} x={420} y={1010} rot={3}>
        <Cedulja tekst="participacija" sirina={340} velicina={40} />
        <Precrtaj w={320} napredak={napredak(f, k2 + 4, 10)} />
      </Pop>
      {f >= kOdr - 4 && (
        <Pop at={kOdr - 4} x={250} y={1110} rot={-6}>
          <Cedulja tekst={"po dogovoru".slice(0, Math.max(1, slova))} sirina={300} velicina={44} rukopis boja={P.zelena700} />
        </Pop>
      )}
    </Kadar>
  );
};
