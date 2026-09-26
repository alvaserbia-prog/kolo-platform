// Scena 4 — „Daš nekome rad, dobro ili znanje, i on ti prepiše POENE za to."
// Tri stvari koje se mogu dati (rad, dobro, znanje); Ana daje Milanu tegle meda, rukuju se,
// a u svesci se ispisuje „Milan → Ana · 5.000 POENA · med". Natpis: „Dao si? Zapisano je."
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, krugTacke, napredak } from "../papir";
import { Etiketa, Knjiga } from "../likovi";
import { LogoZnak } from "../kolo";
import { Kosnica, LIKOVI, Lik, Pcele, Tegla } from "../prica";
import { Cekic, Natpis, Pecat } from "../selo";
import { Sveska } from "../sveska";
import { MILAN_ANA, SECANJE } from "../zapisi";
import { SV3 } from "./Scena3";
import { kad } from "../vreme";

export const SV4 = { x: 540, y: 1010, s: 0.8 };

const Stvar: React.FC<{ at: number; x: number; tekst: string; sjaj?: number; children: React.ReactNode }> = ({ at, x, tekst, sjaj = 0, children }) => (
  <Pop at={at} x={x} y={290} njihanje={2} faza={x}>
    {sjaj > 0 && <circle cx={0} cy={0} r={95} fill={P.zlatna400} opacity={0.35 * sjaj} />}
    {children}
    <g transform="translate(0 105) rotate(-3)">
      <Etiketa seed={`s4-e${x}`} tekst={tekst} velicina={48} />
    </g>
  </Pop>
);

export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const rad = kad(4, "rad,");
  const dobro = kad(4, "dobro");
  const znanje = kad(4, "znanje,");
  const on = kad(4, "on");
  const prepise = kad(4, "prepiše");
  const poene = kad(4, "POENE");
  const to = kad(4, "to.");

  const pomak = napredak(f, 0, 16);
  const svX = interpolate(pomak, [0, 1], [SV3.x, SV4.x]);
  const svY = interpolate(pomak, [0, 1], [SV3.y, SV4.y]);
  const svS = interpolate(pomak, [0, 1], [SV3.s, SV4.s]);
  const staro = napredak(f, 0, 14, Easing.in(Easing.cubic));

  const tegleLet = napredak(f, znanje - 4, 20);
  const rukovanje = napredak(f, on - 8, 12);
  const anaX = 250 + rukovanje * 95;
  const milanX = 830 - rukovanje * 95;
  const tres = rukovanje >= 1 && f < prepise + 20 ? Math.sin((f - on) / 2.2) * 10 : 0;
  const redovi = [
    ...SECANJE.map((r) => ({ ...r, zig: 1 })),
    {
      ...MILAN_ANA,
      pisanje: napredak(f, prepise - 2, 26, Easing.linear),
      zig: Math.max(0, Math.min(1, (f - poene - 6) / 8)),
      marker: napredak(f, to + 4, 10),
    },
  ];

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <g transform={`translate(${svX} ${svY}) scale(${svS})`}>
        <Sveska seed="sv" redovi={redovi} />
        <g transform="translate(355 -262) rotate(8) scale(0.42)">
          <LogoZnak seed="s3-logo" r={110} />
        </g>
      </g>

      {/* ono što je ostalo iz scene 3 odlazi gore */}
      {staro < 1 && (
        <g opacity={1 - staro} transform={`translate(0 ${-staro * 260})`}>
          <g transform="translate(540 215) rotate(-2)">
            <Natpis seed="s3-n" tekst="POEN = zapis o doprinosu" duzina={24} velicina={64} />
          </g>
          <g transform="translate(540 360) rotate(-5)">
            <Pecat seed="s3-pecat" tekst="NIJE NOVAC" t={1} velicina={58} />
          </g>
        </g>
      )}

      {/* rad · dobro · znanje */}
      <Stvar at={rad - 3} x={220} tekst="rad">
        <g transform="translate(-10 60) scale(0.8)">
          <Cekic seed="s4-cek" udarac={0.5} />
        </g>
      </Stvar>
      <Stvar at={dobro - 3} x={540} tekst="dobro" sjaj={napredak(f, dobro, 8) * (1 - napredak(f, prepise, 12))}>
        <g transform="scale(0.62)">
          <Tegla seed="s4-tegla-ikona" />
        </g>
      </Stvar>
      <Stvar at={znanje - 3} x={860} tekst="znanje">
        <g transform="scale(1.1)">
          <Knjiga seed="s4-knjiga" />
        </g>
      </Stvar>

      {/* Ana i Milan */}
      <Pop at={4} x={95} y={735} skala={0.55}>
        <Kosnica seed="s4-kos" boja={P.sunce} boja2={P.nebo} />
      </Pop>
      <Pcele seed="s4-pcele" x={120} y={590} n={3} r={70} od={8} />
      <Pop at={2} x={anaX} y={560} skala={1.25}>
        <Lik id="ana" seed="s4-ana" ime={false} />
      </Pop>
      <Pop at={6} x={milanX} y={560} skala={1.25}>
        <Lik id="milan" seed="s4-milan" ime={false} />
      </Pop>
      {/* tegle meda prelaze od Ane ka Milanu */}
      {f >= dobro - 2 &&
        [0, 1, 2].map((i) => {
          const t = Math.max(0, Math.min(1, tegleLet * 1.3 - i * 0.15));
          const x = interpolate(t, [0, 1], [380 + i * 55, 600 + i * 55]) + (rukovanje > 0 ? 0 : 0);
          const y = 690 - Math.sin(t * Math.PI) * 70 - (i === 1 ? 26 : 0);
          return (
            <Pop key={i} at={dobro - 2 + i * 3} x={x} y={y} skala={0.38} rot={(i - 1) * 6}>
              <Tegla seed={`s4-tegla${i}`} />
            </Pop>
          );
        })}
      {/* rukovanje */}
      {rukovanje > 0 && (
        <g>
          <Crta pts={[[anaX + 42, 585], [anaX + 90, 640], [540 - 8, 640 + tres]]} seed="s4-ra" boja={LIKOVI.ana.boja} debljina={26} korak={20} napredak={rukovanje} />
          <Crta pts={[[milanX - 42, 585], [milanX - 90, 640], [540 + 8, 640 + tres]]} seed="s4-rm" boja={LIKOVI.milan.boja} debljina={26} korak={20} napredak={rukovanje} />
          {rukovanje >= 1 && (
            <g>
              <Isecak pts={krugTacke(528, 640 + tres, 20, 10)} boja={P.koza} seed="s4-sa" senka="mala" amp={1} korak={10} />
              <Isecak pts={krugTacke(552, 642 + tres, 20, 10)} boja={P.koza2} seed="s4-sm" senka="mala" amp={1} korak={10} />
            </g>
          )}
        </g>
      )}
      <Pop at={prepise - 4} x={540} y={165} rot={-2}>
        <Natpis seed="s4-n" tekst="Dao si? Zapisano je." duzina={20} />
      </Pop>
    </svg>
  );
};
