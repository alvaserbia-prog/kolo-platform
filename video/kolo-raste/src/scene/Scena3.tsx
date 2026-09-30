// Scena 3 — „Svaki novi član donosi nešto novo. Novu uslugu, novo selo, novi grad.
// Nove mogućnosti za sve.“
// Stara karta Sombora i okoline, kamera blizu Sombora, koji svetli. Na „uslugu“ se pali Čonoplja
// i iznad nje medaljon sa alatom. Na „novo selo“ se kamera odmakne, od Sombora do Gakova se iscrta
// zelena nit i Gakovo naraste u selo (kuće niču, zelena svetlost). Na „grad“ se kamera odmakne
// još, nit ide do Apatina i on naraste u grad (kuće, crkveni toranj). Na „Nove mogućnosti za sve“
// se pale sve tačke i povežu u mrežu.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { RUKOPIS, SERIF } from "../fontovi";
import { Hrapavo, Kadar, Kamera, Oblik, Pop, elipsa, napredak, useF } from "../alat";
import { Karta, SOMBOR, TACKE } from "../mapa";
import { Alat } from "./Scena2";
import { kad } from "../vreme";

const Medaljon: React.FC<{ natpis: string; children: React.ReactNode }> = ({ natpis, children }) => (
  <g>
    <path d="M0,0 L0,-60" stroke={P.mastilo} strokeWidth={4} />
    <g transform="translate(0 -150)">
      <Hrapavo lokalno>
        <Oblik d={elipsa(0, 0, 90, 90)} boja={P.krem} debljina={5} />
        <circle r={78} fill="none" stroke={P.zelena700} strokeWidth={3} strokeDasharray="10 6" />
        <g transform="translate(0 30)">{children}</g>
      </Hrapavo>
      <text y={128} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.mastilo} stroke={P.krem} strokeWidth={8} paintOrder="stroke">
        {natpis}
      </text>
    </g>
  </g>
);

const Tacka: React.FC<{ f: number; at: number; i: number; velika?: boolean }> = ({ f, at, i, velika }) => {
  const puls = 1 + 0.18 * Math.sin((f - at) / 6 + i);
  return (
    <>
      <circle r={(velika ? 44 : 30) * puls} fill={P.zelena500} opacity={0.22} />
      <circle r={velika ? 18 : 14} fill={P.zelena500} stroke={P.zelena900} strokeWidth={3} />
      <circle r={5} fill="#fff" opacity={0.8} />
    </>
  );
};

const Kucica: React.FC<{ zid?: string }> = ({ zid = P.zid }) => (
  <g>
    <path d="M-16,0 L-16,-20 L0,-34 L16,-20 L16,0Z" fill={zid} stroke={P.mastilo} strokeWidth={2.5} />
    <path d="M-20,-18 L0,-38 L20,-18" fill="none" stroke={P.crep} strokeWidth={5} strokeLinecap="round" />
    <rect x={-5} y={-14} width={10} height={10} fill="#F7DC8C" stroke={P.mastilo} strokeWidth={1.5} />
  </g>
);

const Toranj: React.FC = () => (
  <g>
    <path d="M-12,0 L-12,-70 L0,-100 L12,-70 L12,0Z" fill={P.krem} stroke={P.mastilo} strokeWidth={3} />
    <path d="M0,-100 L0,-118 M-6,-110 L6,-110" stroke={P.mastilo} strokeWidth={3} />
    <rect x={-5} y={-60} width={10} height={14} rx={5} fill={P.mastiloSvetlo} />
  </g>
);

// raspored kuća oko tačke: selo manje, grad veći i sa tornjem
const SELO: [number, number][] = [[-34, -6], [30, -12], [-6, -30], [44, 16], [-44, 22], [8, 26]];
const GRAD: [number, number][] = [[-60, -10], [-26, -34], [16, -40], [54, -18], [-72, 26], [-30, 18], [34, 22], [72, 30], [-10, 48], [40, 58]];
const ZIDOVI = [P.zid, P.zidZuti, "#E4CFC0"];

/** Mesto koje raste: nit iz Sombora, kuće niču, zelena svetlost se širi. */
const Rast: React.FC<{ f: number; at: number; x: number; y: number; kuce: [number, number][]; toranj?: boolean; ime: string }> = ({ f, at, x, y, kuce, toranj, ime }) => {
  const nit = napredak(f, at - 10, 16, Easing.inOut(Easing.cubic));
  const svetlo = napredak(f, at + 2, 20, Easing.out(Easing.cubic));
  const [sx, sy] = SOMBOR;
  const d = `M${sx},${sy} Q${(sx + x) / 2 + (y - sy) * 0.15},${(sy + y) / 2 - (x - sx) * 0.15} ${x},${y}`;
  const r = toranj ? 130 : 95;
  return (
    <g>
      {nit > 0 && <path d={d} fill="none" stroke={P.zelena700} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - nit} opacity={0.85} />}
      {svetlo > 0 && (
        <>
          <circle cx={x} cy={y} r={r * svetlo * 1.5} fill={P.zelenaSvetla} opacity={0.35 * svetlo} filter="url(#blur14)" />
          <circle cx={x} cy={y} r={r * svetlo} fill="none" stroke={P.zelena500} strokeWidth={4} strokeDasharray="10 8" opacity={0.7 * svetlo} />
        </>
      )}
      {kuce.map(([dx, dy], i) => (
        <Pop key={i} at={at + 2 + i * 2} x={x + dx} y={y + dy}>
          <Kucica zid={ZIDOVI[i % 3]} />
        </Pop>
      ))}
      {toranj && (
        <Pop at={at + 8} x={x + 2} y={y + 4}>
          <Toranj />
        </Pop>
      )}
      <Pop at={at + 6} x={x} y={y - r - 18}>
        <text textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={toranj ? 44 : 38} fill={P.zelena900} stroke={P.krem} strokeWidth={8} paintOrder="stroke">
          {ime}
        </text>
      </Pop>
    </g>
  );
};

// indeksi u TACKE (redosled iz mapa.tsx): Čonoplja 4, Gakovo 7, Apatin 1; 14–18 su u Somboru
const USLUGA = 4;
const SELO_I = 7;
const GRAD_I = 1;

export const Scena3: React.FC = () => {
  const f = useF();
  const kSvaki = kad(3, "Svaki");
  const kUslugu = kad(3, "uslugu,");
  const kSelo = kad(3, "novo", 2); // „novo selo“
  const kGrad = kad(3, "novi", 2); // „novi grad“
  const kNove = kad(3, "Nove");
  const crtanje = napredak(f, -12, 36, Easing.out(Easing.cubic));
  // kamera: blizu Sombora, pa se odmiče kako KOLO raste do sela i grada
  const kl = [0, kSelo - 10, kGrad - 10, kNove - 4];
  const opt = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  const kx = interpolate(f, kl, [560, 500, 440, 560], opt);
  const ky = interpolate(f, kl, [930, 880, 980, 930], opt);
  const z = interpolate(f, kl, [1.5, 1.4, 1.2, 1.04], opt);
  const vreme = (i: number) => {
    if (i >= 14) return kSvaki + (i - 14) * 3;
    if (i === USLUGA) return kUslugu - 6;
    if (i === SELO_I) return kSelo - 2;
    if (i === GRAD_I) return kGrad - 2;
    return kNove - 4 + ((i * 5) % 11) * 1.6;
  };
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={kx} y={ky} z={z}>
          <Karta f={f} crtanje={crtanje} />
        </Kamera>
      </Hrapavo>
      <Kamera x={kx} y={ky} z={z}>
        {/* Sombor svetli */}
        <circle cx={SOMBOR[0]} cy={SOMBOR[1] - 20} r={150} fill="url(#toplaSvetlost)" opacity={napredak(f, kSvaki - 8, 20)} />
        {/* mreža na „Nove mogućnosti“ */}
        {TACKE.map(([x, y], i) =>
          TACKE.slice(i + 1).map(([x2, y2], j) => {
            const d = Math.hypot(x2 - x, y2 - y);
            if (d > 270) return null;
            const p = napredak(f, kNove + 4 + ((i + j) % 7) * 2.5, 14);
            return <line key={`${i}-${j}`} x1={x} y1={y} x2={x + (x2 - x) * p} y2={y + (y2 - y) * p} stroke={P.zelena500} strokeWidth={3} opacity={0.6} strokeDasharray="6 6" />;
          }),
        )}
        {/* KOLO raste do sela i do grada */}
        <Rast f={f} at={kSelo} x={TACKE[SELO_I][0]} y={TACKE[SELO_I][1]} kuce={SELO} ime="novo selo" />
        <Rast f={f} at={kGrad} x={TACKE[GRAD_I][0]} y={TACKE[GRAD_I][1]} kuce={GRAD} toranj ime="novi grad" />
        {TACKE.map(([x, y], i) => {
          const at = vreme(i);
          return (
            <Pop key={i} at={at} x={x} y={y}>
              <Tacka f={f} at={at} i={i} velika={i === USLUGA || i === SELO_I || i === GRAD_I} />
            </Pop>
          );
        })}
        <Pop at={kUslugu - 4} x={TACKE[USLUGA][0]} y={TACKE[USLUGA][1] - 14} odozdo={60}>
          <Medaljon natpis="usluga">
            <Alat />
          </Medaljon>
        </Pop>
      </Kamera>
    </Kadar>
  );
};
