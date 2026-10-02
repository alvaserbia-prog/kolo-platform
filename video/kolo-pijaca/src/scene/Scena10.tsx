// Scena 10 — „Šta bi ti prvo ponudio u KOLO? ekolo.rs“
// Kamera se digne iznad cele makete pijace, sve tezge zasijaju; jedna tezga je prazna, sa karticom
// „Tvoj oglas?“. Na „ekolo.rs“ uskoči znak KOLO i krupno ekolo.rs.
import React from "react";
import { interpolate, staticFile } from "remotion";
import { P } from "../paleta";
import { SANS } from "../fontovi";
import { Kamera, Kartica, Tezga, iso, napredak, useF, usePop } from "../iso";
import { SvetPijace } from "../svet";
import { kad, trajanjeF } from "../vreme";

export const Scena10: React.FC = () => {
  const f = useF();
  const kraj = trajanjeF(10);
  const fPonudio = kad(10, "ponudio");
  const fEkolo = kad(10, "ekolo.rs");
  const dig = napredak(f, -8, fEkolo, (x) => 1 - Math.pow(1 - x, 2));
  const [cx, cy] = iso(700, 300, 0);
  const zum = interpolate(dig, [0, 1], [1.1, 0.55]);
  const sjaj = napredak(f, fPonudio, fPonudio + 12);
  const prazna = usePop(fPonudio - 6);
  const znak = usePop(fEkolo);
  return (
    <g>
      <rect width={1080} height={1920} fill={P.nebo} />
      <Kamera x={cx} y={cy - 40} z={zum} cy={interpolate(dig, [0, 1], [760, 900])}>
        <SvetPijace svetlo={() => sjaj} pecatRada={0} />
        {prazna > 0 && (
          <g opacity={Math.min(1, prazna * 2)}>
            <Tezga x={1650} y={240} boja={P.zelena500} kartica={<Kartica redovi={["Tvoj oglas?", "tvoje mesto"]} s={1.3 * prazna} rot={-3} />} />
          </g>
        )}
      </Kamera>
      <g transform={`translate(540,300) scale(${znak})`}>
        <rect x={-110} y={-110} width={220} height={220} rx={44} fill={P.zelena900} filter="url(#senkaMeka)" />
        <image href={staticFile("kolo-hero-logo.png")} x={-110} y={-115} width={220} height={230} />
      </g>
      <g transform={`translate(540,500) scale(${znak})`}>
        <rect x={-300} y={-62} width={600} height={124} rx={62} fill="#fff" stroke={P.zelena700} strokeWidth={6} />
        <text y={26} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={76} fill={P.zelena700}>ekolo.rs</text>
      </g>
      <g opacity={interpolate(f, [kraj - 6, kraj], [0, 0])} />
    </g>
  );
};
