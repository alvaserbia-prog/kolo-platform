// Scena 11 — „A pre razmene možeš da pogledaš račun drugog člana i vidiš koliko je on dao zajednici.“
// Dva dvorišta i ograda: Milica preko ograde pruža teglu zimnice, komšija drži telefon. Na „pogledaš“ krupno
// telefon: Miličin račun POEN-a, redovi šta je kome dala; na „dao“ prst prelazi preko redova, na „zajednici“
// zelene kvačice. Na kraju opet ograda: komšija klimne glavom i uzme teglu.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { Ulica, Kuce } from "../pozadine";
import { Tegla } from "../predmeti";
import { Prst, STANAR, STANARKA, VelikiTelefon } from "../zgrada";
import { Ekran, RACUN_MILICE } from "../razmena";
import { kad, trajanjeF } from "../vreme";
import { P } from "../paleta";
import { rez } from "./zajednicko";
import { KoloPozadina, TEL } from "./kolo";
import { Ograda } from "./zajednicko20";

const MILICA = { ...STANARKA, glava: { ...STANARKA.glava } };

const Dvoriste: React.FC<{ klima: number; predaja: number }> = ({ klima, predaja }) => (
  <g>
    <Ulica />
    <Kuce y={880} s={0.55} n={6} x0={-120} razmak={250} />
    <Lik x={300} y={1400} s={0.82} {...STANAR} glava={{ ...STANAR.glava, izraz: klima > 0 ? "osmeh" : "zamisljena", pogled: klima > 0 ? [6, 3] : [2, 6] }} glavaNagib={Math.sin(klima * Math.PI * 2) * 7} dr={[-70, -40]} drziD={<g transform="rotate(10) scale(0.2)"><VelikiTelefon /></g>} />
    <Ograda y={1330} x0={580} x1={1120} h={260} />
    <Lik x={820} y={1410} s={0.8} okreni {...MILICA} glava={{ ...MILICA.glava, izraz: "srecna", pogled: [-6, 0] }} dr={[-95 + predaja * 10, -15]} drziD={<Tegla vrsta="ajvar" s={0.9} />} />
  </g>
);

export const Scena11: React.FC = () => {
  const f = useF();
  const kP = kad(11, "pogledaš");
  const kD = kad(11, "dao");
  const kZ = kad(11, "zajednici.");
  const kraj = trajanjeF(11) - 40;
  const tel = rez(f, kP - 4) * (1 - rez(f, kraj));
  const t = interpolate(f, [kD - 30, kZ], [0, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const red = Math.floor(t);
  const prst = interpolate(f, [kD - 40, kD - 28, kZ + 4, kZ + 14], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const klima = napredak(f, kraj + 6, 26, Easing.linear);
  const prilaz = napredak(f, 0, 50);
  return (
    <Kadar>
      {tel < 1 && (
        <g opacity={1 - tel}>
          <Kamera x={560} y={mesaj(980, 1000, prilaz)} z={mesaj(1, 1.08, prilaz)}>
            <Dvoriste klima={klima} predaja={klima} />
          </Kamera>
        </g>
      )}
      {tel > 0 && (
        <g opacity={tel}>
          <KoloPozadina />
          <g transform={`translate(${TEL.x} ${TEL.y}) scale(${TEL.s})`}>
            <VelikiTelefon>
              <Ekran id="milica" naslov="Milica" podnaslov="račun POEN-a" stanje={2400} redovi={RACUN_MILICE} redova={napredak(f, kP, 18) * 5} isticanje={f > kD - 30 && f < kZ + 6 ? [red, Math.min(1, (t % 1) * 1.8)] : undefined} zeleno={napredak(f, kZ - 2, 24, Easing.linear) * 0.8} />
            </VelikiTelefon>
          </g>
          <g transform={`translate(${TEL.x - 110 + (t % 1) * 150} ${TEL.y + TEL.s * (-150 + red * 74 + 34 - 10) + 30 + prst * 1600}) scale(0.5)`}>
            <Prst rukav={P.oker} koza={P.koza2} />
          </g>
        </g>
      )}
    </Kadar>
  );
};
