// Scena 5 — „A kad tebi nešto zatreba, prepišeš deo POENA onome ko tebi pomogne."
// Ani se pokvari veš-mašina, Lazar je popravi, mašina proradi, Ana se smeje. U svesci
// novi red „Ana → Lazar · 4.000 POENA · popravka". Natpis: „Kad tebi zatreba, zapis ti pomaže."
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { Defs, Pop, napredak } from "../papir";
import { Kljuc, Upitnik } from "../likovi";
import { LogoZnak } from "../kolo";
import { KutijaAlata, Lik, VesMasina } from "../prica";
import { Natpis } from "../selo";
import { Sveska } from "../sveska";
import { ANA_LAZAR, MILAN_ANA, SECANJE } from "../zapisi";
import { SV4 } from "./Scena4";
import { kad } from "../vreme";
import { P } from "../paleta";

export const Scena5: React.FC = () => {
  const f = useCurrentFrame();
  const nesto = kad(5, "nešto");
  const zatreba = kad(5, "zatreba,");
  const prepises = kad(5, "prepišeš");
  const deo = kad(5, "deo");
  const poena = kad(5, "POENA");
  const ko = kad(5, "ko");
  const pomogne = kad(5, "pomogne.");

  const kvar = napredak(f, nesto, 12);
  const popravljena = napredak(f, ko - 4, 22, Easing.linear);
  const anaOsmeh = Math.max(-0.9, Math.min(1, interpolate(kvar, [0, 1], [1, -0.9]) + popravljena * 1.9));
  const lazarUlaz = napredak(f, prepises - 10, 16, Easing.out(Easing.back(1.3)));
  const lazarX = interpolate(lazarUlaz, [0, 1], [1280, 900]);
  const kljucLet = napredak(f, deo - 6, 14, Easing.out(Easing.cubic));
  const kljucX = interpolate(kljucLet, [0, 1], [860, 690]);
  const kljucY = interpolate(kljucLet, [0, 1], [640, 470]) - Math.sin(kljucLet * Math.PI) * 110;
  const kljucRot = kljucLet >= 1 && popravljena < 1 ? Math.sin((f - deo) / 3) * 35 : 0;
  const kljucOde = napredak(f, pomogne + 6, 10);
  const staro = napredak(f, 0, 12);

  const redovi = [
    ...SECANJE.map((r) => ({ ...r, zig: 1 })),
    { ...MILAN_ANA, zig: 1, marker: 1 - napredak(f, 0, 12) },
    {
      ...ANA_LAZAR,
      pisanje: napredak(f, poena - 6, 28, Easing.linear),
      zig: Math.max(0, Math.min(1, (f - pomogne - 4) / 8)),
      marker: napredak(f, pomogne + 14, 10),
    },
  ];

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <g transform={`translate(${SV4.x} ${SV4.y}) scale(${SV4.s})`}>
        <Sveska seed="sv" redovi={redovi} />
        <g transform="translate(355 -262) rotate(8) scale(0.42)">
          <LogoZnak seed="s3-logo" r={110} />
        </g>
      </g>
      {staro < 1 && (
        <g opacity={1 - staro} transform={`translate(540 ${165 - staro * 200}) rotate(-2)`}>
          <Natpis seed="s4-n" tekst="Dao si? Zapisano je." duzina={20} />
        </g>
      )}

      <Pop at={2} x={560} y={575} skala={0.86}>
        <VesMasina seed="s5-ves" kvar={kvar} popravljena={popravljena} />
      </Pop>
      <Pop at={0} x={190} y={560} skala={1.25}>
        <Lik id="ana" seed="s4-ana" ime={false} osmeh={anaOsmeh} />
      </Pop>
      {kvar > 0 && popravljena < 0.3 && (
        <Pop at={zatreba - 2} x={300} y={375} skala={0.36} njihanje={5}>
          <Upitnik seed="s5-up" boja={P.korala} />
        </Pop>
      )}
      {lazarUlaz > 0 && (
        <g transform={`translate(${lazarX} 560) scale(1.25)`}>
          <Lik id="lazar" seed="s5-lazar" ime={false} />
        </g>
      )}
      <Pop at={prepises + 2} x={790} y={712} skala={0.45} rot={4}>
        <KutijaAlata seed="s5-kutija" />
      </Pop>
      {kljucLet > 0 && kljucOde < 1 && (
        <g opacity={1 - kljucOde} transform={`translate(${kljucX} ${kljucY}) rotate(${-30 + kljucRot}) scale(0.7)`}>
          <Kljuc seed="s5-kljuc" />
        </g>
      )}
      <Pop at={prepises - 2} x={540} y={165} rot={-2}>
        <Natpis seed="s5-n" tekst="Kad tebi zatreba, zapis ti pomaže." duzina={34} velicina={56} />
      </Pop>
    </svg>
  );
};
