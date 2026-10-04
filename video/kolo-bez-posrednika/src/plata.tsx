// Gomilica „TVOJA PLATA“ na stočiću: svežnjići novčanica (oznaka DIN, da se nikad ne pročita kao POEN)
// i kule novčića. Stoji u kadru od prve do poslednje scene. U sceni 1 raste dok majstor radi; na svaku
// izgovorenu nametu (scene 2–7) sa nje odleti novac ka onome ko uzima, sa ceduljom te namete. U sceni 8
// ostane par novčića; od scene 9 (KOLO) je ponovo puna i više se ne smanjuje. U sceni 10 je u sredini
// kola, kod majstora, a u sceni 11 ispod adrese.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { NASLOV, SANS } from "./fontovi";
import { Defs, Oblik, kutija } from "./alat";
import { kad, scena } from "./vreme";

type Nameta = { id: number; rec: string; deo: number; natpis: string; ka: [number, number] };

// deo = koliko ode (zbir ~0,9); ka = kuda novac odleti (onaj ko uzima, u kadru te scene)
const NAMETE: Nameta[] = [
  { id: 2, rec: "poreze", deo: 0.18, natpis: "porez", ka: [450, 700] },
  { id: 2, rec: "doprinose.", deo: 0.17, natpis: "doprinosi", ka: [450, 820] },
  { id: 3, rec: "računa", deo: 0.06, natpis: "vođenje računa", ka: [470, 640] },
  { id: 3, rec: "proviziju", deo: 0.06, natpis: "provizija", ka: [470, 640] },
  { id: 3, rec: "deci,", deo: 0.03, natpis: "provizija", ka: [470, 700] },
  { id: 3, rec: "supružniku,", deo: 0.03, natpis: "provizija", ka: [470, 700] },
  { id: 3, rec: "roditelju.", deo: 0.03, natpis: "provizija", ka: [470, 700] },
  { id: 4, rec: "participacija,", deo: 0.07, natpis: "participacija", ka: [520, 600] },
  { id: 5, rec: "važi.", deo: 0.08, natpis: "zubar", ka: [470, 700] },
  { id: 6, rec: "akcize.", deo: 0.07, natpis: "akcize", ka: [470, 640] },
  { id: 7, rec: "razlika,", deo: 0.12, natpis: "razlika", ka: [790, 560] },
];
const glob = (id: number, rec: string) => scena(id).odF + kad(id, rec);
const TRENUCI = NAMETE.map((n) => ({ ...n, f: glob(n.id, n.rec) }));
const KOLO_POCETAK = scena(9).odF;
const SCENA10 = scena(10).odF;

// Raspored gomilice (odozdo nagore, sleva nadesno): s = svežanj novčanica, n = kula novčića.
// Kad se nivo smanjuje, nestaju sa kraja niza (gornji, pa zadnji).
const DELOVI: { t: "s" | "n"; x: number; y: number; r?: number }[] = [
  { t: "s", x: -95, y: 0 }, { t: "s", x: 5, y: 0 }, { t: "n", x: 95, y: 0 },
  { t: "s", x: -90, y: -34, r: -3 }, { t: "s", x: 8, y: -34, r: 2 }, { t: "n", x: 95, y: -30 },
  { t: "s", x: -85, y: -68, r: 4 }, { t: "s", x: 0, y: -68, r: -2 }, { t: "n", x: 100, y: -60 },
  { t: "s", x: -60, y: -102, r: -4 }, { t: "s", x: 30, y: -102, r: 3 },
  { t: "s", x: -20, y: -136, r: 1 }, { t: "n", x: 70, y: -136 },
];

export const Svezanj: React.FC<{ r?: number }> = ({ r = 0 }) => (
  <g transform={`rotate(${r})`}>
    <Oblik d={kutija(-56, -16, 112, 32, 4)} boja="#9DB38A" debljina={3.5} tekstura={0.25} />
    <path d="M-50,-6 H50 M-50,4 H50" stroke={P.zelenaTamna} strokeWidth={2} opacity={0.35} />
    <rect x={-14} y={-17} width={28} height={34} fill={P.krem} stroke={P.mastilo} strokeWidth={2.5} />
    <text y={6} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={13} fill={P.mastilo}>
      DIN
    </text>
  </g>
);

const Kula: React.FC<{ n?: number }> = ({ n = 4 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${(i % 2) * 3 - 1} ${-i * 9})`}>
        <ellipse cx={0} cy={0} rx={30} ry={10} fill={P.senf} stroke={P.mastilo} strokeWidth={3} />
        <ellipse cx={0} cy={-3} rx={30} ry={9} fill={P.zlatna} stroke={P.mastilo} strokeWidth={2.5} />
      </g>
    ))}
  </g>
);

/** Novčanica u letu. */
const Novcanica: React.FC = () => (
  <g>
    <Oblik d={kutija(-46, -22, 92, 44, 4)} boja="#B5C9A2" debljina={3} tekstura={0.2} />
    <circle cx={-22} cy={0} r={11} fill="none" stroke={P.zelenaTamna} strokeWidth={2.5} opacity={0.7} />
    <text x={14} y={7} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={16} fill={P.zelenaTamna}>
      DIN
    </text>
  </g>
);

/** Stočić sa gomilicom; nivo 0–1 (koliko je delova na stolu). */
export const Gomila: React.FC<{ nivo: number; natpis?: string; sjaj?: number }> = ({ nivo, natpis = "TVOJA PLATA", sjaj = 0 }) => {
  const n = Math.round(nivo * DELOVI.length);
  return (
    <g>
      {sjaj > 0 && <ellipse cx={0} cy={-90} rx={260} ry={190} fill={P.zlatna} opacity={0.55 * sjaj} filter="url(#sjaj)" />}
      {/* stočić */}
      <Oblik d="M-150,20 L-135,140 L-115,140 L-118,20Z" boja={P.drvoTamno} />
      <Oblik d="M150,20 L135,140 L115,140 L118,20Z" boja={P.drvoTamno} />
      <Oblik d="M-175,0 L175,0 L182,30 L-182,30Z" boja={P.drvo} />
      <g transform="translate(0 74)">
        <Oblik d={kutija(-120, -26, 240, 52, 8)} boja={P.krem} debljina={3.5} tekstura={0.15} />
        <text y={11} textAnchor="middle" fontFamily={NASLOV} fontStyle="italic" fontWeight={900} fontSize={30} fill={P.mastilo}>
          {natpis}
        </text>
      </g>
      {/* gomilica */}
      {DELOVI.slice(0, Math.max(1, n)).map((d, i) =>
        d.t === "s" ? (
          <g key={i} transform={`translate(${d.x} ${d.y - 16})`}>
            <Svezanj r={d.r} />
          </g>
        ) : (
          <g key={i} transform={`translate(${d.x} ${d.y - 8})`}>
            <Kula n={i < 3 ? 4 : 3} />
          </g>
        ),
      )}
    </g>
  );
};

/** Nivo gomilice u globalnom frejmu f. */
export const nivoPlate = (f: number) => {
  if (f >= KOLO_POCETAK) return interpolate(f, [KOLO_POCETAK, KOLO_POCETAK + 24], [0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  let n = interpolate(f, [glob(1, "uradio,"), glob(1, "tvoje.")], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  for (const m of TRENUCI) n -= m.deo * (f >= m.f + 4 ? 1 : 0);
  return Math.max(0.08, n);
};

const X = 830;
const Y = 1190;

export const PlataSloj: React.FC = () => {
  const f = useCurrentFrame();
  const uKolu = f >= SCENA10 - 8; // u scenama 10 i 11 gomilicu crta sama scena (sredina kola, završni kadar)
  const nije = glob(1, "nije.");
  const drhtaj = f > nije && f < nije + 18 ? Math.sin((f - nije) * 2.2) * 7 * (1 - (f - nije) / 18) : 0;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      {!uKolu && (
        <g transform={`translate(${X + drhtaj} ${Y}) scale(1.25)`}>
          <Gomila nivo={nivoPlate(f)} />
        </g>
      )}
      {/* novac koji odlazi, sa ceduljom namete */}
      {TRENUCI.map((m, i) => {
        const t = (f - m.f) / 26;
        if (t < 0 || t > 1.4) return null;
        const e = Easing.inOut(Easing.cubic)(Math.min(1, t));
        const [kx, ky] = m.ka;
        const sx = X;
        const sy = Y - 180;
        const luk = -220;
        const px = sx + (kx - sx) * e;
        const py = sy + (ky - sy) * e + luk * 4 * e * (1 - e);
        const nestaje = interpolate(t, [1, 1.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <g key={i} opacity={nestaje}>
            {[0, 1, 2].map((k) => {
              const kk = Math.max(0, Math.min(1, t * 1.15 - k * 0.08));
              const ek = Easing.inOut(Easing.cubic)(kk);
              const qx = sx + (kx - sx) * ek + k * 18;
              const qy = sy + (ky - sy) * ek + luk * 4 * ek * (1 - ek) + k * 10;
              return (
                <g key={k} transform={`translate(${qx} ${qy}) rotate(${(k - 1) * 14 + ek * 200 * (k % 2 ? 1 : -1)}) scale(${1 - 0.35 * ek})`}>
                  <Novcanica />
                </g>
              );
            })}
            <g transform={`translate(${px} ${py - 70})`} opacity={interpolate(t, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}>
              <rect x={-130} y={-34} width={260} height={60} rx={10} fill={P.belo} stroke={P.ajvar} strokeWidth={4} />
              <text y={8} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} fill={P.ajvar}>
                − {m.natpis}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
