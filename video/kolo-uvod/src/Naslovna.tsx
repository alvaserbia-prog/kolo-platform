// Naslovna slika (cover) za mreže. Po pravilu iz video/README.md naslov nosi lik i pitanje
// iz svakodnevice, a KOLO se pojavljuje tek na dnu, kao adresa. Bitno je u sredini
// (y 300–1600), jer Instagram mrežu profila seče na 3:4.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { P } from "./paleta";
import { SANS, RUKOPIS, ucitajFontove } from "./fontovi";
import { Defs, Isecak, pravougaonik } from "./papir";
import { Asov, Drvo, Korpa, Kuca, Osoba, Upitnik } from "./likovi";

ucitajFontove();

export const Naslovna: React.FC = () => (
  <AbsoluteFill style={{ background: P.papir }}>
    <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      {/* naslov: lik i pitanje */}
      <g transform="translate(540 370) rotate(-2)">
        <Isecak pts={pravougaonik(-450, -88, 900, 140)} boja={P.belo} seed="n-naslov" amp={2.4} />
        <text x={0} y={28} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={96} fill={P.zelena900}>
          Ana ima višak paradajza
        </text>
      </g>
      <g transform="translate(540 590) rotate(1.5)">
        <Isecak pts={pravougaonik(-380, -110, 760, 214)} boja={P.zelena700} seed="n-pitanje" amp={2.4} />
        <text x={0} y={-14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={76} fill={P.belo}>
          Ko će joj
        </text>
        <text x={0} y={72} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={76} fill={P.belo}>
          prekopati baštu?
        </text>
      </g>
      {/* somborska ulica u pozadini, komšije na prozorima */}
      {[
        { x: 175, boja: P.narandza, glava: { frizura: "punda" as const, kosa: P.kosaSeda, naocare: true } },
        { x: 540, boja: "#CFE3C0", glava: { frizura: "kapa" as const, brkovi: true, koza: P.koza2 } },
        { x: 905, boja: P.sunce, glava: { frizura: "marama" as const } },
      ].map((k, i) => (
        <g key={i} transform={`translate(${k.x} 1160) scale(1.0)`}>
          <Kuca seed={`n-k${i}`} fasada={k.boja} krov={i % 2 ? P.korala : P.korala600} prozori={[{ glava: k.glava, od: -60 }, undefined]} />
        </g>
      ))}
      <g transform="translate(358 1200) scale(0.62)">
        <Drvo seed="n-d1" />
      </g>
      <g transform="translate(722 1200) scale(0.58)">
        <Drvo seed="n-d2" boja={P.trava} />
      </g>
      <g transform="translate(540 1450)">
        <Isecak pts={pravougaonik(-600, -40, 1200, 90)} boja={P.trava} seed="n-trava" />
      </g>
      {/* Ana, korpa i ašov sa upitnikom */}
      <g transform="translate(300 1250) scale(1.55)">
        <Osoba seed="n-ana" boja={P.trava} glava={{ frizura: "rep", kosa: P.kosaSmedja, r: 50, osmeh: 0.3 }} sirina={150} visina={120} />
      </g>
      <g transform="translate(600 1440) scale(1.05)">
        <Korpa seed="n-korpa" paradajza={6} />
      </g>
      <g transform="translate(880 1330) rotate(16) scale(1.15)">
        <Asov seed="n-asov" />
      </g>
      <g transform="translate(478 1175) rotate(6) scale(0.55)">
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
