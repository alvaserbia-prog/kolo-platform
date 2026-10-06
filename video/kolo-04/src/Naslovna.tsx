// Naslovna (cover) za mreže. Po pravilu iz video/README.md naslov nosi lik i pitanje iz
// svakodnevice, a KOLO se pojavljuje tek na dnu, kao adresa. Bitno je u sredini
// (y 300–1600), jer Instagram mrežu profila seče na 3:4.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { SANS, RUKOPIS, ucitajFontove } from "./fontovi";
import { Defs, Isecak, pravougaonik } from "./papir";
import { Drvo, Kljuc, Kuca, Upitnik } from "./likovi";
import { Lik, VesMasina } from "./prica";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      {/* naslov: lik i problem, pa pitanje */}
      <g transform="translate(540 370) rotate(-2)">
        <Isecak pts={pravougaonik(-470, -88, 940, 140)} boja={P.belo} seed="n-naslov" amp={2.4} />
        <text x={0} y={28} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={88} fill={P.zelena900}>
          Ani se pokvarila veš mašina
        </text>
      </g>
      <g transform="translate(540 590) rotate(1.5)">
        <Isecak pts={pravougaonik(-400, -110, 800, 214)} boja={P.zelena700} seed="n-pitanje" amp={2.4} />
        <text x={0} y={-14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={74} fill={P.belo}>
          Popravka bez
        </text>
        <text x={0} y={72} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={74} fill={P.belo}>
          ijednog dinara?
        </text>
      </g>
      {/* ulica u pozadini */}
      {[
        { x: 160, boja: "#E8DDF3" },
        { x: 920, boja: "#F7DCC8" },
      ].map((k, i) => (
        <g key={i} transform={`translate(${k.x} 1160) scale(0.9)`}>
          <Kuca seed={`n-k${i}`} fasada={k.boja} krov={i ? P.korala : P.korala600} kapci={i ? P.zelena700 : P.nebo} />
        </g>
      ))}
      <g transform="translate(330 1170) scale(0.55)">
        <Drvo seed="n-d1" boja={P.trava} />
      </g>
      <g transform="translate(540 1520)">
        <Isecak pts={pravougaonik(-600, -330, 1200, 380)} boja="#E9DFCB" seed="n-pod" senka="bez" zrno={0.5} />
        <Isecak pts={pravougaonik(-600, -342, 1200, 26)} boja={P.trava} seed="n-trava" senka="mala" />
      </g>
      {/* mašina curi i dimi, Ana zabrinuta, ključ i upitnik */}
      <g transform="translate(640 1200) scale(1.3)">
        <VesMasina seed="n-ves" kvar={1} popravljena={0} />
      </g>
      <g transform="translate(220 1330) scale(1.55)">
        <Lik id="ana" seed="n-ana" osmeh={-0.9} ime={false} />
      </g>
      <g transform="translate(935 1440) rotate(-24) scale(0.95)">
        <Kljuc seed="n-kljuc" />
      </g>
      <g transform="translate(420 1010) rotate(-6) scale(0.62)">
        <Upitnik seed="n-upit" boja={P.korala} />
      </g>
      {/* adresa na dnu */}
      <g transform="translate(540 1680) rotate(-1.5)">
        <Isecak pts={pravougaonik(-190, -62, 380, 96)} boja={P.belo} seed="n-adresa" amp={2} />
        <text x={0} y={16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={66} fill={P.zelena700}>
          ekolo<tspan fill={P.zlatna600}>.</tspan>rs
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);
