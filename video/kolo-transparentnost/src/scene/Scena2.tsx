// Scena 2 — „Primao je uplate stanara i plaćao troškove zgrade i sve je upisivao u svesku.“
// Na „uplate“ stanarka sleva pruža novčanicu, Đura je prima i novčanica ode u kasu. Na „troškove“ majstor
// zdesna (sa novom sijalicom) dobija novčanicu. Na „upisivao“ krupno sveska: ispisuju se redovi
// „stan 4 · 2.000“ i „sijalica u ulazu · 450“.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, Oblik, elipsa, mesaj, napredak, useF } from "../alat";
import { Lik, ikRuka } from "../likovi";
import { DJURA, Kasa, MLADI_STANAR, Novcanica, STANARKA, SveskaKase } from "../zgrada";
import { kad } from "../vreme";
import { P } from "../paleta";
import { KuhinjaPozadina, StoKuhinja, rez } from "./zajednicko";
import { KASA_STO, SveskaNaStolu } from "./Scena1";

const Sijalica: React.FC = () => (
  <g>
    <Oblik d={elipsa(0, 0, 24, 30)} boja="#FFF3C4" debljina={3.5} tekstura={0} />
    <Oblik d="M-12,26 L12,26 L12,46 L-12,46Z" boja="#9AA7A5" debljina={3} tekstura={0} />
  </g>
);

export const Scena2: React.FC = () => {
  const f = useF();
  const kU = kad(2, "uplate");
  const kT = kad(2, "troškove");
  const kUp = kad(2, "upisivao");
  const ulazS = interpolate(f, [kU - 26, kU - 4], [-300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ulazM = interpolate(f, [kT - 26, kT - 4], [300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // novčanica 1: od stanarke do Đure, pa u kasu
  const n1a = napredak(f, kU, 12);
  const n1b = napredak(f, kU + 14, 12);
  const n1 = { x: mesaj(mesaj(250, 440, n1a), KASA_STO.x + 10, n1b), y: mesaj(mesaj(900, 930, n1a), KASA_STO.y - 110, n1b) };
  // novčanica 2: od Đure ka majstoru
  const n2 = napredak(f, kT, 16);
  const krupno = rez(f, kUp - 4, 7);
  const pis = (k: number) => napredak(f, k, 22, Easing.linear);
  const [a1, a2] = f < kT - 4 ? ikRuka(600, 1250, 0.95, 440, 930, false) : ikRuka(600, 1250, 0.95, 820, 930);
  return (
    <Kadar>
      <g opacity={1 - krupno}>
        <Kamera x={540} y={960} z={1}>
          <KuhinjaPozadina />
          <Lik x={600} y={1250} s={0.95} {...DJURA} glava={{ ...DJURA.glava, izraz: "osmeh", pogled: f < kT - 4 ? [-7, 2] : [7, 2] }} lr={f < kT - 4 ? [a1, a2] : [20, 20]} dr={f < kT - 4 ? [-12, -8] : [a1, a2]} />
          <g transform={`translate(${ulazS} 0)`}>
            <Lik x={150} y={1330} s={0.82} {...STANARKA} glava={{ ...STANARKA.glava, izraz: "osmeh", pogled: [6, 0] }} dr={f < kU + 10 ? ikRuka(150, 1330, 0.82, 260, 900) : [-10, -6]} hod={f < kU - 4 ? f / 3 : undefined} />
          </g>
          <g transform={`translate(${ulazM} 0)`}>
            <Lik x={960} y={1330} s={0.82} okreni {...MLADI_STANAR} glava={{ ...MLADI_STANAR.glava, izraz: "osmeh", pogled: [6, 0] }} dr={f > kT + 8 ? ikRuka(960, 1330, 0.82, 830, 930, true, true) : [60, 40]} lr={[30, 60]} drziL={<Sijalica />} hod={f < kT - 4 ? f / 3 : undefined} />
          </g>
          <StoKuhinja />
          <SveskaNaStolu />
          <g transform={`translate(${KASA_STO.x} ${KASA_STO.y})`}>
            <Kasa s={0.9} otvor={f > kU + 8 && f < kU + 30 ? 1 : 0} />
          </g>
          {f >= kU - 2 && f < kU + 27 && (
            <g transform={`translate(${n1.x} ${n1.y}) rotate(${-10 + n1b * 14})`}>
              <Novcanica s={0.45} />
            </g>
          )}
          {f >= kT - 2 && (
            <g transform={`translate(${mesaj(640, 860, n2)} ${mesaj(930, 920, n2)}) rotate(${8 - n2 * 12})`}>
              <Novcanica s={0.45} iznos="500" />
            </g>
          )}
        </Kamera>
      </g>
      {krupno > 0 && (
        <g opacity={krupno}>
          <rect x={-50} y={-50} width={1180} height={2020} fill={P.drvo} />
          <rect x={-50} y={-50} width={1180} height={2020} fill="url(#gvasP)" opacity={0.4} style={{ mixBlendMode: "multiply" }} />
          <g transform="translate(540 800) scale(1.25)">
            <SveskaKase pisanje={[1, pis(kUp - 2), 0, 1, pis(kUp + 14), 0]} />
          </g>
        </g>
      )}
    </Kadar>
  );
};
