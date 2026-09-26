// Scena 1 — „Četvoro ljudi iz Sombora. Niko nikog ne poznaje."
// Četiri kuće daleko jedna od druge, ispred svake njen čovek. Između njih
// iskrsnu upitnici: ne poznaju se.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Defs, Pop } from "../papir";
import { Etiketa, Kuca, Upitnik } from "../likovi";
import { Lik, LikId } from "../likovi4";
import { kad } from "../vreme";

const MESTA: { id: LikId; x: number; y: number; fasada: string; krov: string; kapci: string }[] = [
  { id: "milan", x: 250, y: 760, fasada: "#CDE7F2", krov: P.korala600, kapci: P.zelena700 },
  { id: "ana", x: 830, y: 760, fasada: P.sunce, krov: P.korala, kapci: P.zelena700 },
  { id: "marija", x: 250, y: 1240, fasada: "#F7DCC8", krov: P.korala600, kapci: P.nebo },
  { id: "lazar", x: 830, y: 1240, fasada: "#CFE3C0", krov: P.korala, kapci: P.zelena900 },
];

export const Scena1: React.FC = () => {
  const f = useCurrentFrame();
  const cetvoro = kad(1, "Četvoro");
  const ljudi = kad(1, "ljudi");
  const sombora = kad(1, "Sombora.");
  const nikog = kad(1, "nikog");
  const poznaje = kad(1, "poznaje.");
  const zum = 1 + f * 0.0005;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <g transform={`translate(540 960) scale(${zum}) translate(-540 -960)`}>
        <Pop at={sombora - 4} x={540} y={340} rot={-3} njihanje={1.2}>
          <Etiketa seed="s1-sombor" tekst="Sombor" velicina={92} boja={P.zelena900} />
        </Pop>
        {MESTA.map((m, i) => (
          <React.Fragment key={m.id}>
            <Pop at={2 + i * 3} x={m.x - (i % 2 ? -40 : 40)} y={m.y - 60} skala={0.86}>
              <Kuca seed={`s1-k${i}`} fasada={m.fasada} krov={m.krov} kapci={m.kapci} />
            </Pop>
            <Pop at={(i < 2 ? cetvoro : ljudi) + (i % 2) * 5} x={m.x + (i % 2 ? -95 : 95)} y={m.y} skala={0.56} njihanje={1} faza={i}>
              <Lik id={m.id} />
            </Pop>
          </React.Fragment>
        ))}
        {/* ne poznaju se: upitnici između njih */}
        <Pop at={nikog - 4} x={540} y={640} skala={0.8} rot={-8} njihanje={4}>
          <Upitnik seed="s1-u1" boja={P.korala} />
        </Pop>
        <Pop at={nikog + 6} x={420} y={930} skala={0.62} rot={6} njihanje={4} faza={2}>
          <Upitnik seed="s1-u2" boja={P.nebo} />
        </Pop>
        <Pop at={poznaje - 6} x={660} y={960} skala={0.62} rot={-6} njihanje={4} faza={3}>
          <Upitnik seed="s1-u3" boja={P.zelena700} />
        </Pop>
        <Pop at={poznaje + 2} x={540} y={1150} skala={0.72} rot={8} njihanje={4} faza={4}>
          <Upitnik seed="s1-u4" />
        </Pop>
      </g>
    </svg>
  );
};
