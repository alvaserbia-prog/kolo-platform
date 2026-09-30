// Sloj preko svega: list ručnog papira na kome je otisak — papir (multiply), zrno,
// blaga vinjeta i tanak otisnut okvir sa oznakom otiska u uglu, kao na grafičkom listu.
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Defs } from "./alat";
import { SERIF } from "./fontovi";

export const Otisak: React.FC<{ bezOznake?: boolean }> = ({ bezOznake }) => {
  const f = useCurrentFrame();
  const zx = (Math.floor(f / 2) * 37) % 512;
  const zy = (Math.floor(f / 2) * 91) % 512;
  return (
    <>
      <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, mixBlendMode: "multiply", opacity: 0.2 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("gvas.png")})`, backgroundSize: "640px 640px", mixBlendMode: "multiply", opacity: 0.08 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("grain.png")})`, backgroundPosition: `${zx}px ${zy}px`, mixBlendMode: "overlay", opacity: 0.2 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 66% at 50% 46%, rgba(0,0,0,0) 62%, rgba(60,44,28,0.26) 100%)" }} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <rect x={28} y={28} width={1024} height={1864} fill="none" stroke={P.mastilo} strokeWidth={5} opacity={0.7} filter="url(#hrap1)" />
        {!bezOznake && (
          <text x={1040} y={1880} textAnchor="end" fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={22} fill={P.mastiloMeko} opacity={0.7}>
            KOLO · Sombor
          </text>
        )}
      </svg>
    </>
  );
};
