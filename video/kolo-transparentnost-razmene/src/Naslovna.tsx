// Naslovna (cover) za mreže: „Kako da sprečimo krađu?“; noćni trg, upravnik pored staklenog sanduka i
// seljani koji ga obasjavaju fenjerima. Sav tekst je u sredini (y 300–1620), jer Instagram mrežu seče na 4:5.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS, ucitajFontove } from "./fontovi";
import { Kadar } from "./alat";
import { Stranica } from "./Stranica";
import { Lik } from "./likovi";
import { Mrak, Nebo, Postolje, Sanduk, Trg } from "./noc";
import { MESTA, POSTOLJE, SANDUK, S_SELJAK } from "./scene/Scena2";
import { SELJANI, SaFenjerom, UPRAVNIK, plamen } from "./scene/svet";

const FENJERI = MESTA.map((m, i) => ({ ...m, tx: SANDUK.x + (m.okreni ? 120 : -260) + i * 20, ty: SANDUK.y - 330 }));

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <Kadar>
      <g transform="translate(540 1000) scale(1.12) translate(-540 -1000)">
        <Nebo />
        <Trg />
        <g transform={`translate(${POSTOLJE.x} ${POSTOLJE.vrh})`}>
          <Postolje h={POSTOLJE.h} w={460} />
        </g>
        <Lik x={430} y={POSTOLJE.vrh} s={0.62} {...UPRAVNIK} glava={{ ...UPRAVNIK.glava, izraz: "osmeh", pogled: [6, 3] }} lr={[20, 20]} dr={[-20, -20]} />
        <g transform={`translate(${SANDUK.x} ${SANDUK.y})`}>
          <Sanduk s={SANDUK.s} staklo={1} natpis="ZAJEDNIČKO" />
        </g>
        {FENJERI.map((s, i) => (
          <SaFenjerom key={i} p={SELJANI[i]} x={s.x} y={s.y} s={S_SELJAK} tx={s.tx} ty={s.ty} f={i * 7} okreni={s.okreni} pogled={[s.okreni ? -6 : 6, -3]} fs={0.8} />
        ))}
        <Mrak id="naslovna" svetla={[...FENJERI.map((s) => plamen(s.tx, s.ty, 0.8, 310)), { x: SANDUK.x, y: SANDUK.y - 60, r: 380 }]} jacina={0.78} />
      </g>
    </Kadar>
    <AbsoluteFill>
      <Stranica />
    </AbsoluteFill>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 10px 12px rgba(58,42,29,0.35))" }}>
      <rect x={90} y={300} width={900} height={300} rx={30} fill={P.krem} stroke={P.mastilo} strokeWidth={5} />
      <rect x={104} y={314} width={872} height={272} rx={22} fill="none" stroke={P.vez} strokeWidth={3} strokeDasharray="12 7" />
      <text x={540} y={430} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={88} fill={P.mastilo}>
        Kako da sprečimo
      </text>
      <text x={540} y={530} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={88} fill={P.mastilo}>
        krađu?
      </text>
      <rect x={300} y={1470} width={480} height={100} rx={22} fill={P.belo} stroke={P.mastilo} strokeWidth={4} />
      <text x={540} y={1538} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={56} fill={P.zelena700}>
        ekolo.rs
      </text>
    </svg>
  </AbsoluteFill>
);
