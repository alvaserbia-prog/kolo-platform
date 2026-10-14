// Scena 1 — „Čika Đura je vodio kasu u svojoj zgradi.“
// Kuka: krupno ruka ubaci novčanicu u limenu kasu „ZGRADA“, poklopac škljocne. Na „Đura“ kamera se odmakne:
// Đura za kuhinjskim stolom, pored lakta kasa, ispred njega sveska. Na „zgradi“ Đura pogleda kroz prozor.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Lik, ikRuka } from "../likovi";
import { DJURA, Kasa, Novcanica, SveskaKase } from "../zgrada";
import { kad } from "../vreme";
import { KuhinjaPozadina, StoKuhinja } from "./zajednicko";

export const KASA_STO = { x: 300, y: 1112 };
export const SVESKA_STO = { x: 700, y: 1090 };

/** Sveska otvorena na stolu (ploča u perspektivi). */
export const SveskaNaStolu: React.FC<{ pisanje?: number[] }> = ({ pisanje = [1, 0, 0, 1, 0, 0] }) => (
  <g transform={`translate(${SVESKA_STO.x} ${SVESKA_STO.y}) scale(0.42 0.2)`}>
    <SveskaKase pisanje={pisanje} />
  </g>
);

export const Scena1: React.FC = () => {
  const f = useF();
  const kDj = kad(1, "Đura");
  const kZ = kad(1, "zgradi.");
  const odmak = napredak(f, kDj - 2, 22, Easing.inOut(Easing.cubic));
  const pad = interpolate(f, [2, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const poklopac = f < 20 ? 1 : interpolate(f, [20, 26], [1, 0], { extrapolateRight: "clamp" });
  const ruka = interpolate(f, [0, 14, 30], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [a1, a2] = ikRuka(600, 1250, 0.95, SVESKA_STO.x - 40, SVESKA_STO.y - 10);
  const pogled: [number, number] = f > kZ ? [-7, -3] : [0, 4];
  return (
    <Kadar>
      <Kamera x={mesaj(KASA_STO.x, 540, odmak)} y={mesaj(KASA_STO.y - 120, 960, odmak)} z={mesaj(2.6, 1, odmak)}>
        <KuhinjaPozadina />
        <Lik x={600} y={1250} s={0.95} {...DJURA} glava={{ ...DJURA.glava, izraz: "mirna", pogled }} dr={[a1, a2]} lr={[20, 20]} glavaNagib={f > kZ ? -6 : 4} />
        <StoKuhinja />
        <SveskaNaStolu />
        <g transform={`translate(${KASA_STO.x} ${KASA_STO.y})`}>
          <Kasa s={0.9} otvor={poklopac} />
        </g>
        {/* novčanica pada u kasu, ruka stanara se povlači */}
        {f < 24 && (
          <g transform={`translate(${KASA_STO.x + 10} ${mesaj(780, 960, pad)}) rotate(${mesaj(-18, 4, pad)})`} opacity={1 - Math.max(0, (pad - 0.85) * 6)}>
            <Novcanica s={0.5} />
          </g>
        )}
        <g transform={`translate(${KASA_STO.x + 120} ${mesaj(640, 860, ruka)})`} opacity={ruka}>
          <ellipse rx={40} ry={34} fill="#F0C9A6" stroke="#3A2A1D" strokeWidth={4} />
          <path d="M20,-10 L120,-120" stroke="#D98C86" strokeWidth={60} strokeLinecap="round" />
        </g>
      </Kamera>
    </Kadar>
  );
};
