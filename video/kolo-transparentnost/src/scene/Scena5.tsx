// Scena 5 — „Onda je Đura okačio svesku na oglasnu tablu u ulazu.“ OBRT: muzika ponovo ulazi na „okačio“.
// Đura izlazi iz stana sa otvorenom sveskom; na „okačio“ sveska poleti na tablu i uskoče rajsnegle,
// sijalica u ulazu se upali. Na „ulazu“ stanari zastanu i okrenu se ka tabli.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { BAKA, DJURA, STANAR, STANARKA, SveskaKase } from "../zgrada";
import { kad } from "../vreme";
import { SVESKA_NA_TABLI, UlazSaTablom } from "./zajednicko";

export const Scena5: React.FC = () => {
  const f = useF();
  const kO = kad(5, "okačio");
  const kUl = kad(5, "ulazu.");
  const kT = kad(5, "tablu");
  const djuraX = interpolate(f, [0, kO - 6], [1000, 860], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const let_ = napredak(f, kO - 4, 14, Easing.inOut(Easing.cubic));
  const okacena = f >= kO + 10 ? 1 : 0;
  const svetlo = interpolate(f, [kO, kO + 14], [0.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dolaze = (k: number, od: number) => interpolate(f, [k - 24, k], [od, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const gledaju = f > kUl - 4;
  return (
    <Kadar>
      <UlazSaTablom sveska={okacena ? napredak(f, kO + 10, 10) * 0.5 + 0.5 : 0} svetlo={svetlo} />
      {/* sveska leti iz Đurinih ruku na tablu */}
      {!okacena && (
        <g transform={`translate(${mesaj(djuraX - 90, SVESKA_NA_TABLI.x, let_)} ${mesaj(860, SVESKA_NA_TABLI.y, let_)}) scale(${mesaj(0.3, SVESKA_NA_TABLI.s, let_)}) rotate(${mesaj(-8, 0, let_)})`}>
          <SveskaKase />
        </g>
      )}
      <Lik x={djuraX} y={1330} s={0.82} okreni {...DJURA} glava={{ ...DJURA.glava, izraz: f > kO ? "osmeh" : "odlucna", pogled: [6, -6] }} dr={f < kO + 6 ? [120, 20] : [30, 30]} lr={f < kO + 6 ? [110, 30] : [10, 10]} hod={f < kO - 6 ? f / 3 : undefined} />
      <g transform={`translate(${dolaze(kT, -320)} 0)`}>
        <Lik x={150} y={1340} s={0.72} {...BAKA} glava={{ ...BAKA.glava, izraz: gledaju ? "iznenadjena" : "mirna", pogled: gledaju ? [6, -8] : [6, 0] }} hod={f < kT ? f / 3 : undefined} />
      </g>
      <g transform={`translate(${dolaze(kUl, -460)} 0)`}>
        <Lik x={380} y={1360} s={0.75} {...STANARKA} glava={{ ...STANARKA.glava, izraz: gledaju ? "iznenadjena" : "mirna", pogled: gledaju ? [4, -8] : [6, 0] }} hod={f < kUl ? f / 3 : undefined} />
      </g>
      <g transform={`translate(${dolaze(kUl + 6, -620)} 0)`}>
        <Lik x={600} y={1350} s={0.76} {...STANAR} glava={{ ...STANAR.glava, izraz: gledaju ? "iznenadjena" : "mirna", pogled: gledaju ? [-4, -8] : [6, 0] }} hod={f < kUl + 6 ? f / 3 : undefined} />
      </g>
    </Kadar>
  );
};
