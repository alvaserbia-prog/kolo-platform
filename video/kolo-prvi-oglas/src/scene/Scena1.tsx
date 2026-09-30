// Scena 1 — „Ana je u KOLO ušla sa jednom teglom meda. A evo kako ti da uđeš u KOLO."
// Udica je već u prvom kadru: natpis „Prvi oglas za 2 minuta", Ana, košnica, pčele.
// Na „teglom" Ana podigne teglu. Na „A evo kako ti" Ana ode ulevo, na sredini se pojavi
// isprekidana silueta „ti", a na „KOLO." odozdo uleti telefon i silueta sedne u ugao.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Defs, Isecak, Pop, napredak, pravougaonik } from "../papir";
import { Etiketa } from "../likovi";
import { LogoZnak } from "../kolo";
import { Iskre, Kosnica, Lik, Pcele, Tegla } from "../prica";
import { Telefon, TiLik } from "../ekran";
import { SANS, RUKOPIS } from "../fontovi";
import { kad } from "../vreme";
import { TEL, TI_UGAO } from "./raspored";

export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const kolo = kad(1, "KOLO");
  const teglom = kad(1, "teglom");
  const a = kad(1, "A");
  const ti = kad(1, "ti");
  const kolo2 = kad(1, "KOLO", 2);

  const zum = 1 + f * 0.0006;
  const odlazak = napredak(f, a - 2, 18, Easing.inOut(Easing.cubic));
  const tegla = napredak(f, teglom - 4, 12, Easing.out(Easing.back(1.8)));
  const tel = napredak(f, kolo2 - 6, 30, Easing.out(Easing.cubic));
  const tiPos = napredak(f, kolo2 - 2, 28, Easing.inOut(Easing.cubic));
  const natpisOde = napredak(f, kolo2 - 8, 14, Easing.in(Easing.cubic));

  const tiX = interpolate(tiPos, [0, 1], [540, TI_UGAO.x]);
  const tiY = interpolate(tiPos, [0, 1], [860, TI_UGAO.y]);
  const tiS = interpolate(tiPos, [0, 1], [1.7, TI_UGAO.s]);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* udica: vidi se već u prvom kadru */}
      <g transform={`translate(0 ${-natpisOde * 420})`}>
        <Pop at={-30} x={540} y={300} rot={-2} njihanje={1} skala={1.15}>
          <Isecak pts={pravougaonik(-420, -92, 840, 184)} boja={P.zelena700} seed="s1-udica" amp={3} />
          <text x={0} y={-8} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={78} fill={P.belo}>
            Prvi oglas
          </text>
          <text x={0} y={62} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={66} fill={P.zlatna400}>
            za 2 minuta
          </text>
        </Pop>
      </g>

      {/* Ana sa medom — odlazi ulevo na „A evo kako ti" */}
      {odlazak < 1 && (
        <g transform={`translate(${-odlazak * 900} ${-odlazak * 80}) rotate(${-odlazak * 10} 540 900)`} opacity={1 - odlazak * 0.3}>
          <g transform={`translate(540 900) scale(${zum}) translate(-540 -900)`}>
            <Pop at={-24} x={830} y={1060} skala={1.4}>
              <Kosnica seed="s1-kos" boja={P.sunce} boja2={P.nebo} />
            </Pop>
            <Pcele seed="s1-pc" x={820} y={780} n={3} r={120} />
            <Pop at={-20} x={340} y={880} skala={2.1}>
              <Lik id="ana" seed="s1-ana" />
            </Pop>
            {tegla > 0 && (
              <g transform={`translate(${600} ${interpolate(tegla, [0, 1], [1060, 900])}) scale(${(tegla * 0.95).toFixed(3)}) rotate(${(1 - tegla) * 20 + Math.sin(f / 10) * 3})`}>
                <Tegla seed="s1-tegla" />
              </g>
            )}
            {tegla > 0 && f < teglom + 30 && <Iskre seed="s1-isk" x={600} y={900} t={napredak(f, teglom, 26)} r={170} />}
            <Pop at={kolo - 2} x={600} y={560} skala={0.55} rot={8} njihanje={2}>
              <LogoZnak seed="s1-logo" r={110} />
            </Pop>
          </g>
        </g>
      )}

      {/* „ti": isprekidana silueta; posle sedne u ugao pored telefona */}
      {f >= ti - 3 && (
        <g transform={`translate(${tiX} ${tiY}) scale(${tiS})`}>
          <Pop at={ti - 3} x={0} y={0}>
            <TiLik seed="s1-ti" popuna={0} />
            <g transform="translate(0 176) rotate(-3)">
              <Etiketa seed="s1-ti-e" tekst="ti" velicina={62} boja={P.zelena900} />
            </g>
          </Pop>
        </g>
      )}

      {/* telefon ulazi odozdo */}
      {tel > 0 && (
        <g transform={`translate(${TEL.x} ${interpolate(tel, [0, 1], [2600, TEL.y])}) rotate(${(1 - tel) * 14})`}>
          <Telefon seed="tel" adresa="" kursor />
        </g>
      )}
    </svg>
  );
};
