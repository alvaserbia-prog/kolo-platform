// Scena 7 — „Obućar da cipele i za njih dobije to sredstvo. Onda za njega uzme ono što je njemu potrebno. To je novac.“
// Obućar daje cipele Milici i od nje dobije novčanicu (u prvom načinu to je novac, ne POEN). Na „uzme“
// novčanica ode Stevanu, a drva obućaru. Na „novac“ kredom se gore napiše NOVAC i podvuče.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kreda, napredak, useF } from "../alat";
import { Lik, MILICA, OBUCAR, STEVAN } from "../likovi";
import { Drva, Naramak, Novcanica, ParCipela } from "../stvari";
import { kad } from "../vreme";
import { LinijaVremena, Pisi, Pod } from "./zajednicko";

const Y = 1250;
const MX = 190;
const OX = 540;
const SX = 880;

/** Predmet koji putuje lukom od (x1,y1) do (x2,y2), za napredak t. */
const Leti: React.FC<{ t: number; x1: number; y1: number; x2: number; y2: number; children: React.ReactNode; luk?: number }> = ({ t, x1, y1, x2, y2, luk = -160, children }) => {
  const e = Easing.inOut(Easing.cubic)(t);
  const x = interpolate(e, [0, 1], [x1, x2]);
  const y = interpolate(e, [0, 1], [y1, y2]) + Math.sin(e * Math.PI) * luk;
  return <g transform={`translate(${x} ${y})`}>{children}</g>;
};

export const Scena7: React.FC = () => {
  const f = useF();
  const kCip = kad(7, "cipele");
  const kDob = kad(7, "dobije");
  const kUzm = kad(7, "uzme");
  const kNov = kad(7, "novac.");
  const tC = napredak(f, kCip - 4, 22);
  const tN = napredak(f, kDob - 4, 20);
  const tN2 = napredak(f, kUzm - 6, 22);
  const tD = napredak(f, kUzm + 10, 22);
  const imaCipele = tC >= 1;
  return (
    <Kadar>
      <Kreda>
        <Pisi tekst="1." at={-30} x={130} y={300} velicina={150} brzina={1} />
        <LinijaVremena at={{ linija: -99, nekad: -99, kasnije: -99, stvari: [-99, -99, -99, -99, -99] }} />
        <Pisi tekst="NOVAC" at={kNov - 4} x={600} y={330} velicina={150} brzina={0.45} podvuci sirina={470} />
        <Pod y={Y + 8} x0={60} x1={1020} />
        <g transform={`translate(${SX + 80} ${Y})`}>
          <Drva s={0.55} n={tD >= 1 ? 7 : 10} />
        </g>
        <Lik x={MX} y={Y} s={0.68} {...MILICA} glava={{ ...MILICA.glava, izraz: imaCipele ? "srecna" : "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={f > kDob - 8 && f < kDob + 14 ? [80, 0] : [-10, -20]} cipele={imaCipele ? "#A0583A" : undefined} />
        <Lik x={OX} y={Y} s={0.68} {...OBUCAR} okreni={f < kUzm - 6} glava={{ ...OBUCAR.glava, izraz: "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={f > kCip - 8 && f < kCip + 10 ? [80, 0] : [-10, -20]} />
        <Lik x={SX} y={Y} s={0.68} okreni {...STEVAN} glava={{ ...STEVAN.glava, izraz: "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={f > kUzm + 4 && f < kUzm + 16 ? [80, 0] : tN2 >= 1 ? [40, 30] : [-10, -20]} drziD={tN2 >= 1 ? <Novcanica s={0.45} rot={10} /> : undefined} />
        {/* cipele: obućar → Milica */}
        {tC > 0 && tC < 1 && (
          <Leti t={tC} x1={OX - 90} y1={Y - 330} x2={MX + 90} y2={Y - 330}>
            <ParCipela s={0.5} />
          </Leti>
        )}
        {/* novčanica: Milica → obućar, pa obućar → Stevan */}
        {tN > 0 && tN2 < 1 && (
          <Leti t={tN2 > 0 ? tN2 : tN} x1={tN2 > 0 ? OX + 80 : MX + 90} y1={Y - 300} x2={tN2 > 0 ? SX - 90 : OX - 80} y2={Y - 300}>
            <Novcanica s={0.6} rot={-8} />
          </Leti>
        )}
        {/* drva: Stevan → obućar */}
        {tD > 0 && (
          <Leti t={tD} x1={SX - 60} y1={Y - 250} x2={OX + 70} y2={Y - 250}>
            <Naramak s={0.7} />
          </Leti>
        )}
      </Kreda>
    </Kadar>
  );
};
