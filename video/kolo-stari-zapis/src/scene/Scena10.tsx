// Scena 10 — „Kad nekome daš rad, dobro ili znanje, on ti prepiše POEN.“
// Listanje: tri sličice jedna ispod druge. Na „rad“ komšija popravlja ogradu komšinici, na „dobro“ Milica
// daje teglu ajvara komšiji, na „znanje“ mladić pokazuje dedi telefon. Na „prepiše“ u svakoj sličici
// zelena strelica ode od onoga ko je primio ka onome ko je dao i stane red „POEN“.
import React from "react";
import { Hrapavo, Kadar, Oblik, Pop, kutija, napredak, useF } from "../alat";
import { KOMSIJA, KOMSINICA, Lik, MILICA, MLADIC2 } from "../likovi";
import { DEDA } from "../kolo";
import { Merdevine, Tegla, Telefon } from "../predmeti";
import { kad } from "../vreme";
import { P } from "../paleta";
import { SANS } from "../fontovi";
import { Strelica } from "./zajednicko";

const Kartica: React.FC<{ y: number; boja: string; children: React.ReactNode }> = ({ y, boja, children }) => (
  <g transform={`translate(540 ${y})`}>
    <Oblik d={kutija(-470, -170, 940, 340, 22)} boja={P.senka} ivica={false} opacity={0.25} tekstura={0} transform="translate(10 12)" />
    <Oblik d={kutija(-470, -170, 940, 340, 22)} boja={boja} debljina={4.5} tekstura={0.2} />
    {children}
  </g>
);

const Poen: React.FC<{ p: number; x1: number; x2: number }> = ({ p, x1, x2 }) =>
  p <= 0 ? null : (
    <g>
      <Strelica x1={x1} y1={-60} x2={x2} y2={-60} luk={-70} napredak={Math.min(1, p * 1.4)} boja={P.zelena700} debljina={7} />
      {p > 0.6 && (
        <g transform={`translate(${(x1 + x2) / 2} -150) scale(${Math.min(1, (p - 0.6) * 3)})`}>
          <rect x={-80} y={-36} width={160} height={66} rx={14} fill={P.zelena100} stroke={P.zelena700} strokeWidth={6} />
          <text y={16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} letterSpacing={2} fill={P.zelena700}>
            POEN
          </text>
        </g>
      )}
    </g>
  );

export const Scena10: React.FC = () => {
  const f = useF();
  const kR = 2; // prva sličica stoji od početka scene, da kadar ne bude prazan
  const kD = kad(10, "dobro");
  const kZ = kad(10, "znanje,");
  const kP = kad(10, "prepiše");
  const poen = (i: number) => napredak(f, kP - 4 + i * 5, 18);
  return (
    <Kadar>
      <Hrapavo>
        <rect x={-100} y={-100} width={1300} height={2200} fill="#EFD9A8" />
        <rect x={-100} y={-100} width={1300} height={2200} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      </Hrapavo>
      <Pop at={kR - 6} x={0} y={0} odozdo={30}>
        <Kartica y={290} boja="#E3EEDC">
          <g transform="translate(-230 160)">
            <Merdevine h={260} />
          </g>
          <Lik x={-130} y={160} s={0.4} {...KOMSIJA} glava={{ ...KOMSIJA.glava, izraz: "odlucna" }} lr={[150, 10]} dr={[130, 20]} />
          <Lik x={250} y={160} s={0.4} okreni {...KOMSINICA} glava={{ ...KOMSINICA.glava, izraz: "srecna" }} />
          <Poen p={poen(0)} x1={210} x2={-90} />
        </Kartica>
      </Pop>
      <Pop at={kD - 6} x={0} y={0} odozdo={30}>
        <Kartica y={660} boja="#F6E3D0">
          <Lik x={-130} y={160} s={0.4} {...MILICA} glava={{ ...MILICA.glava, izraz: "srecna" }} dr={[-95, -15]} drziD={<Tegla vrsta="ajvar" s={0.9} />} />
          <Lik x={250} y={160} s={0.4} okreni {...KOMSIJA} glava={{ ...KOMSIJA.glava, izraz: "osmeh" }} />
          <Poen p={poen(1)} x1={210} x2={-90} />
        </Kartica>
      </Pop>
      <Pop at={kZ - 6} x={0} y={0} odozdo={30}>
        <Kartica y={1030} boja="#DCE7EE">
          <Lik x={-130} y={160} s={0.4} {...MLADIC2} glava={{ ...MLADIC2.glava, izraz: "osmeh" }} dr={[-100, -20]} drziD={<Telefon s={0.28} />} />
          <Lik x={250} y={160} s={0.4} okreni {...DEDA} glava={{ ...DEDA.glava, izraz: "iznenadjena", pogled: [3, 2] }} />
          <Poen p={poen(2)} x1={210} x2={-90} />
        </Kartica>
      </Pop>
    </Kadar>
  );
};
