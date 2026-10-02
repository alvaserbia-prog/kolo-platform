// Scena 3 — „Na Pijaci svako nudi ono što ima u višku. I ono što zna da radi ovde nekom vredi.“
// Kamera klizi niz red tezgi kao kroz maketu: cveće, jaja, Radin pekmez, bicikl, pletivo.
// Natpis: „Oglase vidi svako, i bez prijave.“ Na „zna“ zasijaju tezge sa uslugama
// (popravka bicikla, časovi, čuvanje dece).
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { Kamera, Natpis, iso, napredak, useF } from "../iso";
import { SvetPijace } from "../svet";
import { kad, trajanjeF } from "../vreme";

const USLUGE = ["bicikl", "knjige", "deca", "dejan"];

export const Scena3: React.FC = () => {
  const f = useF();
  const kraj = trajanjeF(3);
  const fZna = kad(3, "zna");
  const p = napredak(f, -10, kraj + 10, (x) => x);
  // put kamere: niz red A, pa preko na red B
  const [ax, ay] = iso(0, 220, 80);
  const [bx, by] = iso(1400, 260, 80);
  const kx = interpolate(p, [0, 1], [ax, bx]);
  const ky = interpolate(p, [0, 1], [ay, by]);
  const zum = interpolate(p, [0, 0.5, 1], [1.05, 0.95, 1.0]);
  const sjaj = napredak(f, fZna - 4, fZna + 10);
  return (
    <g>
      <rect width={1080} height={1920} fill={P.nebo} />
      <Kamera x={kx} y={ky} z={zum} cy={800}>
        <SvetPijace pecatRada={1} svetlo={(id) => (USLUGE.includes(id) ? sjaj : 0)} />
      </Kamera>
      <Natpis tekst="Oglase vidi svako, i bez prijave." y={190} o={napredak(f, 4, 16)} />
    </g>
  );
};
