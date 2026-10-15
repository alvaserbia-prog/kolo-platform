// Scena 11 — „A pre razmene možeš da pogledaš račun drugog člana i vidiš koliko je on dao zajednici.“
// Večernja pijaca pod fenjerom: Milica za tezgom pruža teglu zimnice, komšija drži telefon. Na „pogledaš“ krupno
// telefon: Miličin račun POEN-a, redovi šta je kome dala; prst prelazi preko redova, na „zajednici“ zelene
// kvačice. Na kraju opet tezga: komšija klimne glavom i uzme teglu.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { Tegla } from "../predmeti";
import { Prst, VelikiTelefon } from "../zgrada";
import { Ekran, RACUN_MILICE } from "../razmena";
import { Fenjer, Mrak, Nebo, Trg } from "../noc";
import { kad, trajanjeF } from "../vreme";
import { P } from "../paleta";
import { rez } from "./zajednicko";
import { KoloPozadina, TEL } from "./kolo";
import { SELJANI } from "./svet";

const MILICA = SELJANI[2];
const KOMSIJA = SELJANI[1];

const Tezga: React.FC<{ f: number; klima: number }> = ({ f, klima }) => (
  <g>
    <Nebo />
    <Trg y={1100} prozori={0.8} />
    {/* tezga sa nadstrešnicom */}
    <path d="M560,1300 L560,620 M1040,1300 L1040,620" stroke={P.drvoTamno} strokeWidth={16} />
    <path d="M530,640 L1070,640 L1030,560 L570,560Z" fill={P.ajvar} stroke={P.mastilo} strokeWidth={4} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${590 + i * 92},560 L${610 + i * 92},640`} stroke={P.krem} strokeWidth={22} opacity={0.6} />
    ))}
    <path d="M800,640 L800,700" stroke={P.mastilo} strokeWidth={3} />
    <g transform={`translate(800 700) rotate(${Math.sin(f / 22) * 4})`}>
      <Fenjer s={0.85} f={f} />
    </g>
    <Lik x={820} y={1250} s={0.7} okreni {...MILICA} glava={{ ...MILICA.glava, izraz: "srecna", pogled: [-6, 0] }} dr={[-95 + klima * 15, -15]} drziD={<Tegla vrsta="ajvar" s={0.9} />} />
    <rect x={560} y={1080} width={480} height={220} fill={P.drvo} stroke={P.mastilo} strokeWidth={4} />
    {[620, 700, 960].map((x, i) => (
      <g key={x} transform={`translate(${x} 1080)`}>
        <Tegla vrsta={i === 1 ? "pekmez" : "ajvar"} s={0.6} />
      </g>
    ))}
    <Lik
      x={300}
      y={1330}
      s={0.8}
      {...KOMSIJA}
      glava={{ ...KOMSIJA.glava, izraz: klima > 0 ? "osmeh" : "zamisljena", pogled: klima > 0 ? [6, 0] : [3, 6] }}
      glavaNagib={Math.sin(klima * Math.PI * 2) * 7}
      dr={[-70, -40]}
      drziD={
        <g transform="rotate(10) scale(0.2)">
          <VelikiTelefon />
        </g>
      }
    />
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
          <Kamera x={600} y={mesaj(980, 1000, prilaz)} z={mesaj(1, 1.08, prilaz)}>
            <Tezga f={f} klima={klima} />
            <Mrak id="s11" svetla={[{ x: 800, y: 790, r: 560 }, { x: 330, y: 960, r: 260 }]} jacina={0.7} />
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
