// Scena 1 — „Sve si sam uradio, sam zaradio, i misliš da je tvoje. E, nije.“
// Radionica: majstor sa čekićem, iza njega klupa; desno na stočiću raste gomilica „tvoja plata“
// (sloj plata.tsx). Na „E, nije.“ gomilica se strese, majstoru se lice promeni, a soba ohladi.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Oblik, kutija, useF } from "../alat";
import { Lik, MUZ } from "../likovi";
import { kad } from "../vreme";
import { Soba } from "./zajednicko";

const Cekic: React.FC = () => (
  <g transform="rotate(-20)">
    <rect x={-6} y={-10} width={12} height={110} rx={5} fill={P.drvo} stroke={P.mastilo} strokeWidth={3} />
    <Oblik d={kutija(-34, -34, 68, 30, 6)} boja="#7E8B80" debljina={3.5} />
  </g>
);

export const Scena1: React.FC = () => {
  const f = useF();
  const kNije = kad(1, "nije.");
  const hlad = interpolate(f, [kNije - 4, kNije + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const udarac = Math.max(0, Math.sin((f / 30) * Math.PI * 2.2)) * (f < kad(1, "misliš") ? 1 : 0);
  return (
    <Kadar>
      <Hrapavo>
        <Soba zid={"#E2D2B0"} pod={P.drvoSvetlo} />
        <rect x={0} y={0} width={1080} height={1920} fill="#9FB1B8" opacity={hlad * 0.35} style={{ mixBlendMode: "multiply" }} />
        {/* klupa sa alatom */}
        <Oblik d={kutija(40, 1020, 520, 40, 6)} boja={P.drvo} />
        <Oblik d="M70,1060 L90,1300 L120,1300 L110,1060Z" boja={P.drvoTamno} />
        <Oblik d="M490,1060 L470,1300 L500,1300 L530,1060Z" boja={P.drvoTamno} />
        {[90, 170, 250, 330].map((x, i) => (
          <rect key={i} x={x} y={560 + (i % 2) * 20} width={14} height={120 + i * 10} rx={6} fill={i % 2 ? P.drvo : "#7E8B80"} stroke={P.mastilo} strokeWidth={3} />
        ))}
        <Oblik d={kutija(60, 520, 360, 24, 4)} boja={P.drvoTamno} />
      </Hrapavo>
      <Lik
        x={300}
        y={1300}
        s={1.02}
        {...MUZ}
        glava={{ ...MUZ.glava, izraz: f >= kNije ? "iznenadjena" : "osmeh", pogled: f >= kNije ? [6, -2] : [4, 0] }}
        dr={f >= kad(1, "misliš") ? [25, 10] : [100 + udarac * 30, -70 + udarac * 20]}
        lr={[20, 30]}
        drziD={<Cekic />}
      />
    </Kadar>
  );
};
