// Scena 1 — „Danas je lako ukrasti novac, naročito onome ko je na položaju.“ (naslov stoji gore)
// Pozorište senki: u mračnoj sobi sveća na podu baca veliku senku na zid. Senka čoveka stoji na postolju pored
// sanduka; na „ukrasti“ ruka senke zaroni u sanduk i izvuče novčanicu pod kaput. Na „položaju“ postolje senke
// raste u visinu: što je položaj viši, senka je veća. Lice se ne vidi, nema nikoga konkretnog.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Kamera, mesaj, napredak, useF } from "../alat";
import { Lik, ikRuka } from "../likovi";
import { Novcanica } from "../zgrada";
import { Postolje, Sanduk, Sveca, ZidSvece } from "../noc";
import { kad } from "../vreme";
import { UPRAVNIK } from "./svet";

export const Scena1: React.FC = () => {
  const f = useF();
  const kU = kad(1, "ukrasti");
  const kP = kad(1, "položaju.");
  const rast = napredak(f, kP - 24, 40, Easing.inOut(Easing.cubic));
  const h = mesaj(120, 360, rast);
  const vrh = 1290 - h;
  const S = 1.05;
  const X = 470;
  const SX = 800;
  // ruka: miruje, zaroni u sanduk, izvuče se ka kaputu
  const zaron = interpolate(f, [kU - 20, kU - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const nazad = interpolate(f, [kU + 4, kU + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const tx = mesaj(mesaj(X + 150, SX - 20, zaron), X + 40, nazad);
  const ty = mesaj(mesaj(vrh - 330, vrh - 150, zaron), vrh - 380, nazad);
  const [a1, a2] = ikRuka(X, vrh, S, tx, ty);
  const treperi = 1 + Math.sin(f * 0.7) * 0.03 + Math.sin(f * 1.9) * 0.02;
  return (
    <Kadar>
      <Kamera x={540} y={mesaj(980, 900, rast)} z={mesaj(1.08, 0.94, rast)}>
        <ZidSvece treperi={treperi} />
        {/* senka na zidu: sve kroz filter siluete, blago iskošeno i treperavo kao od sveće */}
        <g filter="url(#silueta)" transform={`translate(540 1290) skewX(-6) scale(${treperi} 1) translate(-540 -1290)`}>
          <g transform={`translate(${X + 60} ${vrh})`}>
            <Postolje h={h} w={560} />
          </g>
          <g transform={`translate(${SX} ${vrh})`}>
            <Sanduk s={0.62} />
          </g>
          <Lik x={X} y={vrh} s={S} {...UPRAVNIK} dr={[a1, a2]} lr={[12, 8]} />
          {f > kU - 2 && f < kU + 30 && (
            <g transform={`translate(${tx} ${ty}) rotate(-20)`}>
              <Novcanica s={0.42} />
            </g>
          )}
        </g>
        <g transform="translate(210 1420)">
          <Sveca f={f} />
        </g>
      </Kamera>
    </Kadar>
  );
};
