// Sloj preko svega: stranica stare slikovnice — papir (multiply), zrno štampe, vinjeta,
// tanak dvostruki okvir sa lalama iz vojvođanskog veza u uglovima, blago treperenje svetla.
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Defs } from "./alat";

const Lala: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={0.85}>
    <path d="M0,0 C8,-14 8,-26 0,-38 C-8,-26 -8,-14 0,0Z" fill={P.vez} />
    <path d="M0,0 C14,-6 22,-16 22,-30 C12,-24 4,-14 0,0Z" fill={P.vez} opacity={0.8} />
    <path d="M0,0 C-14,-6 -22,-16 -22,-30 C-12,-24 -4,-14 0,0Z" fill={P.vez} opacity={0.8} />
    <path d="M0,0 L0,22" stroke={P.zelenaTamna} strokeWidth={3} />
    <path d="M0,14 C10,10 18,14 22,22 C12,24 4,20 0,14Z" fill={P.zelenaTamna} />
    <path d="M0,14 C-10,10 -18,14 -22,22 C-12,24 -4,20 0,14Z" fill={P.zelenaTamna} />
  </g>
);

export const Stranica: React.FC = () => {
  const f = useCurrentFrame();
  const trep = 1 + Math.sin(f * 0.9) * 0.006 + Math.sin(f * 0.31) * 0.008;
  const zx = (Math.floor(f / 2) * 37) % 512;
  const zy = (Math.floor(f / 2) * 91) % 512;
  return (
    <>
      <Img src={staticFile("papir.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, mixBlendMode: "multiply", opacity: 0.28 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("gvas.png")})`,
          backgroundSize: "700px 700px",
          mixBlendMode: "multiply",
          opacity: 0.07,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("grain.png")})`,
          backgroundPosition: `${zx}px ${zy}px`,
          mixBlendMode: "overlay",
          opacity: 0.22,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 60%, rgba(74,48,24,0.3) 100%)",
          opacity: trep,
        }}
      />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <rect x={26} y={26} width={1028} height={1868} rx={10} fill="none" stroke={P.mastilo} strokeWidth={3} opacity={0.55} />
        <rect x={38} y={38} width={1004} height={1844} rx={6} fill="none" stroke={P.mastilo} strokeWidth={1.5} opacity={0.4} />
        <Lala x={66} y={70} rot={135} />
        <Lala x={1014} y={70} rot={-135} />
        <Lala x={66} y={1850} rot={45} />
        <Lala x={1014} y={1850} rot={-45} />
      </svg>
    </>
  );
};
