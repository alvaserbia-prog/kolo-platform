// Scena 2 — „Zato, kada neko upravlja zajedničkim sredstvima, moramo da imamo uvid u njegove račune.“
// Noćni trg. Na niskom postolju stoji upravnik, pored njega drveni sanduk „ZAJEDNIČKO“. Sa obe strane dolaze
// seljani sa fenjerima. Na „uvid“ podignu fenjere ka sanduku i sanduk postane stakleni: vidi se svežanj
// novčanica i sveska sa redovima.
import React from "react";
import { Easing } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { Mrak, Nebo, Postolje, Sanduk, Trg } from "../noc";
import { kad } from "../vreme";
import { SELJANI, SaFenjerom, UPRAVNIK, plamen } from "./svet";

export const POSTOLJE = { x: 540, vrh: 1150, h: 150 };
export const SANDUK = { x: 700, y: 1150, s: 0.6 };
export const MESTA = [
  { x: 130, y: 1330, okreni: false },
  { x: 300, y: 1360, okreni: false },
  { x: 800, y: 1360, okreni: true },
  { x: 960, y: 1330, okreni: true },
];
export const S_SELJAK = 0.6;

export const Scena2: React.FC = () => {
  const f = useF();
  const kU = kad(2, "upravlja");
  const kV = kad(2, "uvid");
  const dolazak = napredak(f, 0, kU + 10, Easing.out(Easing.quad));
  const dizanje = napredak(f, kV - 10, 16);
  const staklo = napredak(f, kV, 20);
  const seljaci = MESTA.map((m, i) => {
    const x = mesaj(m.x + (m.okreni ? 420 : -420), m.x, dolazak);
    const tx = mesaj(x + (m.okreni ? -110 : 110), SANDUK.x + (m.okreni ? 120 : -260) + i * 20, dizanje);
    const ty = mesaj(m.y - 300 * S_SELJAK, SANDUK.y - 330, dizanje);
    return { ...m, x, tx, ty };
  });
  const svetla = [...seljaci.map((s) => plamen(s.tx, s.ty, 0.8, 250 + dizanje * 60)), { x: SANDUK.x, y: SANDUK.y - 60, r: 380, a: staklo }];
  return (
    <Kadar>
      <Kamera x={540} y={mesaj(960, 1000, dizanje)} z={mesaj(1, 1.12, dizanje)}>
        <Nebo />
        <Trg />
        <g transform={`translate(${POSTOLJE.x} ${POSTOLJE.vrh})`}>
          <Postolje h={POSTOLJE.h} w={460} />
        </g>
        <Lik x={430} y={POSTOLJE.vrh} s={0.62} {...UPRAVNIK} glava={{ ...UPRAVNIK.glava, izraz: "mirna", pogled: f > kV ? [6, 3] : [0, 0] }} lr={[20, 20]} dr={[-20, -20]} />
        <g transform={`translate(${SANDUK.x} ${SANDUK.y})`}>
          <Sanduk s={SANDUK.s} staklo={staklo} natpis="ZAJEDNIČKO" />
        </g>
        {seljaci.map((s, i) => (
          <SaFenjerom key={i} p={SELJANI[i]} x={s.x} y={s.y} s={S_SELJAK} tx={s.tx} ty={s.ty} f={f + i * 7} okreni={s.okreni} hod={dolazak < 1 ? f / 2.4 + i : undefined} pogled={[s.okreni ? -6 : 6, -3]} fs={0.8} />
        ))}
        <Mrak id="s2" svetla={svetla} jacina={0.8} />
      </Kamera>
    </Kadar>
  );
};
