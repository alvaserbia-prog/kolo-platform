// Scena 4 — „Ali pravila moraju da važe za sve.“ OBRT: ritam muzike ponovo ulazi na „Ali“.
// Upravnik uzme fenjer i okrene ga ka seljanima: snop svetla pređe preko gomile, i na „sve“ svi seljani
// sa svojim fenjerima stoje obasjani isto kao on.
import React from "react";
import { Easing } from "remotion";
import { Kadar, mesaj, napredak, useF } from "../alat";
import { Mrak, Nebo, Postolje, Sanduk, Trg } from "../noc";
import { kad } from "../vreme";
import { MESTA, POSTOLJE, SANDUK, S_SELJAK } from "./Scena2";
import { SELJANI, SaFenjerom, UPRAVNIK, plamen } from "./svet";
import { P } from "../paleta";

export const Scena4: React.FC = () => {
  const f = useF();
  const kA = kad(4, "ali");
  const kS = kad(4, "sve.");
  const okret = napredak(f, kA - 4, 22, Easing.inOut(Easing.cubic));
  const svi = napredak(f, kS - 8, 12);
  // snop: ugao od sanduka (desno) ka gomili (levo-dole), pa širi
  const ugao = mesaj(-20, 150, okret);
  const ux = 470;
  const uy = POSTOLJE.vrh - 330 * 0.62;
  const seljaci = MESTA.map((m) => ({ ...m, tx: m.x + (m.okreni ? -100 : 100), ty: m.y - 330 * S_SELJAK }));
  const svetla = [plamen(ux, uy, 0.8, 300), { x: SANDUK.x, y: SANDUK.y - 60, r: 360 }, ...seljaci.map((s) => ({ ...plamen(s.tx, s.ty, 0.8, 300), a: svi }))];
  return (
    <Kadar>
      <Nebo />
      <Trg />
      <g transform={`translate(${POSTOLJE.x} ${POSTOLJE.vrh})`}>
        <Postolje h={POSTOLJE.h} w={460} />
      </g>
      <g transform={`translate(${SANDUK.x} ${SANDUK.y})`}>
        <Sanduk s={SANDUK.s} staklo={1} natpis="ZAJEDNIČKO" />
      </g>
      <SaFenjerom p={UPRAVNIK} x={430} y={POSTOLJE.vrh} s={0.62} tx={ux} ty={uy} f={f} okreni={okret > 0.5} izraz="odlucna" pogled={[okret > 0.5 ? -6 : 6, 2]} fs={0.8} />
      {seljaci.map((s, i) => (
        <SaFenjerom key={i} p={SELJANI[i]} x={s.x} y={s.y} s={S_SELJAK} tx={s.tx} ty={s.ty} f={f + i * 7} okreni={s.okreni} upaljen={svi} izraz={svi > 0.5 ? "osmeh" : "iznenadjena"} pogled={[s.okreni ? -6 : 6, -3]} fs={0.8} />
      ))}
      <Mrak id="s4" svetla={svetla} jacina={0.8} />
      {/* snop svetla iz upravnikovog fenjera */}
      <g transform={`translate(${ux} ${uy + 60}) rotate(${ugao})`} opacity={(1 - svi * 0.7) * Math.min(1, okret * 3)}>
        <path d="M0,0 L900,-170 L900,170Z" fill={P.zlatna} opacity={0.28} filter="url(#blur14)" style={{ mixBlendMode: "screen" }} />
      </g>
    </Kadar>
  );
};
