// Sc. 3 — „Dugo se verovalo da zajedničko uvek propada. Svako uzme malo više, dok ne ostane ništa.“
// Isti pašnjak se suši: zelena se gasi u oker, busenje nestaje jedno po jedno dok ga ljudi
// odnose, krava mršavi, bunar presušuje, zemlja puca. Na „ništa“ ostaje prazna, ispucala ravnica.
import React from "react";
import { Hrapavo, Kadar, Kamera, Linija, dah, mesaj, mesajBoju, napredak, rnd, useF } from "../alat";
import { P } from "../paleta";
import { Bunar, Busen, Covek, Krava, Nebo, Ravnica, Topola } from "../motivi";
import { kad, trajanjeF } from "../vreme";

const BUSENJE = Array.from({ length: 26 }).map((_, i) => ({
  x: 60 + rnd(i, 31) * 960,
  y: 1090 + rnd(i, 32) ** 1.4 * 760,
  red: rnd(i, 33),
}));

const PUKOTINE = [
  "M120,1500 L190,1470 L240,1510 L320,1480 L360,1530",
  "M620,1620 L700,1580 L760,1640 L850,1600",
  "M260,1760 L330,1720 L420,1780 L480,1740 L560,1790",
  "M760,1300 L820,1330 L900,1300 L960,1340",
  "M60,1250 L120,1280 L170,1250",
];

export const Scena3: React.FC = () => {
  const f = useF();
  const T = trajanjeF(3);
  const tProp = kad(3, "propada.");
  const tUzme = kad(3, "uzme");
  const tNista = kad(3, "ništa.");
  const suvo = napredak(f, tProp - 6, tNista - tProp + 16);
  const trava = mesajBoju(P.trava, P.suvo, suvo);
  const z = mesaj(1.04, 1.12, napredak(f, 0, T));
  // busenje nestaje redom od „uzme“ do „ništa“
  const nestalo = (i: number) => napredak(f, tUzme + (BUSENJE[i].red * (tNista - tUzme)), 8);
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={540} y={1100} z={z}>
          <Nebo od={120} do={1010} pomakX={f * 0.4} />
          <g transform="translate(90 1030)">
            <Topola s={0.55} golo={suvo} boja={mesajBoju(P.travaTamna, P.okerTamni, suvo)} />
          </g>
          <g transform="translate(960 1030)">
            <Topola s={0.6} golo={suvo} boja={mesajBoju(P.travaTamna, P.okerTamni, suvo)} />
          </g>
          <Ravnica y={1030} boja={trava} vlati={1 - suvo} />
          {PUKOTINE.map((d, i) => (
            <Linija key={i} d={d} debljina={4} napredak={napredak(f, tProp + i * 8, 26)} />
          ))}
          {BUSENJE.map((b, i) => {
            const n = nestalo(i);
            return n < 1 ? <Busen key={i} x={b.x} y={b.y - n * 20} s={1.2 + (b.y - 1100) / 500} op={1 - n} boja={mesajBoju(P.travaTamna, P.mastilo, 0.4)} /> : null;
          })}
          <g transform="translate(470 1330) scale(1.2)">
            <Bunar ugao={-22 + 8 * dah(f, 60)} suv={suvo} />
          </g>
          <g transform="translate(800 1210)">
            <Krava s={0.55} smer={-1} mrsava={suvo} glavaDole={0.6 + 0.4 * dah(f, 70)} />
          </g>
          {/* svako uzme malo više: tri siluete odlaze, svaka nosi svoje */}
          {[
            { od: tUzme - 6, x0: 300, x1: -120, y: 1540, tip: "m" as const, p: "korpa" as const, smer: -1 as const },
            { od: kad(3, "malo") - 4, x0: 700, x1: 1180, y: 1600, tip: "z" as const, p: "kofa" as const, smer: 1 as const },
            { od: kad(3, "više,") - 2, x0: 520, x1: 1200, y: 1450, tip: "st" as const, p: "korpa" as const, smer: 1 as const },
          ].map((c, i) => {
            const t = napredak(f, c.od, 64, (x) => x);
            if (f < c.od) return null;
            return (
              <g key={i} transform={`translate(${mesaj(c.x0, c.x1, t)} ${c.y})`}>
                <Covek tip={c.tip} boja={P.rdja} boja2={P.okerTamni} smer={c.smer} korak={f * 0.35 + i} ruke={[40, -20]} predmet={c.p} s={0.95} />
              </g>
            );
          })}
        </Kamera>
      </Hrapavo>
      {/* prašina na kraju */}
      <rect x={0} y={0} width={1080} height={1920} fill={P.suvo} opacity={0.18 * napredak(f, tNista - 4, 20)} style={{ mixBlendMode: "multiply" }} />
    </Kadar>
  );
};
