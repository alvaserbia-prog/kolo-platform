// Scene 4–5: so. 4) Etiopija: čovek u belom daje šipku soli (amole) za korpu kafe;
// 5) so se ne kvari (sunce i mesec prolaze, šipke iste), ali na kiši se istopi.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Linija, Oblik, Pop, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { kad } from "../vreme";
import { Amole, ETIOPLJANIN, ETIOPLJANKA, NeboTlo, Sunce } from "../drevno";
import { Cedulja } from "./zajednicko";

/** Bagrem (akacija) etiopske visoravni (dno u 0,0). */
const Akacija: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-14,0 L-8,-200 C-40,-240 -90,-260 -130,-262 M-8,-200 L14,-210 C40,-250 90,-270 130,-272 L14,-210 L14,0Z" boja={P.drvoTamno} debljina={3.5} />
    <Oblik d="M-260,-270 C-200,-330 -60,-350 0,-340 C80,-360 220,-330 270,-280 C200,-250 80,-260 0,-262 C-80,-250 -200,-244 -260,-270Z" boja="#6F7F3C" />
  </g>
);

/** Korpa sa zrnima kafe (dno u 0,0). */
const KorpaKafe: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-80,-70 L80,-70 C76,-20 60,0 40,0 L-40,0 C-60,0 -76,-20 -80,-70Z" boja={P.drvoSvetlo} />
    {[-50, -20, 10, 40].map((x) => (
      <Linija key={x} d={`M${x},-66 L${x + 6},-4`} debljina={2} opacity={0.4} />
    ))}
    {Array.from({ length: 11 }, (_, i) => (
      <ellipse key={i} cx={-60 + i * 12} cy={-76 - (i % 3) * 6} rx={9} ry={6} fill="#5A3420" stroke={P.mastilo} strokeWidth={1.5} />
    ))}
  </g>
);

/** Naslagane šipke soli (dno u 0,0). */
const Naslaga: React.FC<{ n?: number; topi?: number; s?: number }> = ({ n = 6, topi = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {Array.from({ length: n }, (_, i) => {
      const red = Math.floor(i / 3);
      const k = i % 3;
      const v = 34 * (1 - topi * 0.55);
      return (
        <g key={i} transform={`translate(${(k - 1) * 152 + red * 30} ${-v / 2 - red * (v + 2)})`}>
          <Amole topi={topi} />
        </g>
      );
    })}
  </g>
);

// ── Scena 4 — „U Etiopiji su se kocke koristile kao novac do pre sto godina.“ ──────
export const Scena4: React.FC = () => {
  const f = useF();
  const kKoc = kad(4, "kocke");
  const kNov = kad(4, "novac");
  const t = napredak(f, kNov - 2, 22);
  const ax = mesaj(380, 700, t);
  const ay = mesaj(980, 1010, t) - Math.sin(t * Math.PI) * 110;
  const kx = mesaj(720, 330, t);
  const ky = mesaj(1080, 1090, t) - Math.sin(t * Math.PI) * 90;
  return (
    <Kadar>
      <Hrapavo>
        <NeboTlo nebo="#D9E2D4" tlo="#B98F57" horizont={900} />
        <Oblik d="M-200,920 C0,760 200,720 420,780 C600,700 820,680 1280,800 L1280,1000 L-200,1000Z" boja="#8E9A5C" />
        <Oblik d="M-200,960 C200,880 600,900 1280,920 L1280,1400 L-200,1400Z" boja="#B98F57" tekstura={0.35} />
        <g transform="translate(860 930)">
          <Akacija s={0.9} />
        </g>
        <Sunce x={240} y={330} r={66} zraci={f * 0.3} />
      </Hrapavo>
      <Lik x={230} y={1290} s={0.9} {...ETIOPLJANIN} glava={{ ...ETIOPLJANIN.glava, izraz: "osmeh", pogled: [5, 0] }} dr={[80, 20]} lr={[10, 10]} />
      <Lik x={860} y={1290} s={0.9} okreni {...ETIOPLJANKA} glava={{ ...ETIOPLJANKA.glava, izraz: t > 0.6 ? "srecna" : "osmeh", pogled: [5, 0] }} dr={[70, 30]} lr={[10, 10]} />
      {/* naslaga soli kod nogu prodavca */}
      <Pop at={kKoc - 4} x={330} y={1300} skala={0.75}>
        <Naslaga n={5} />
      </Pop>
      <Pop at={kKoc + 2} x={330} y={1120} rot={-4} skala={0.9}>
        <Cedulja tekst="amole" sirina={220} velicina={40} rukopis />
      </Pop>
      <g transform={`translate(${kx} ${ky})`}>
        <KorpaKafe s={0.9} />
      </g>
      <g transform={`translate(${ax} ${ay})`}>
        <Amole s={1.0} rot={-8 + t * 8} />
      </g>
    </Kadar>
  );
};

// ── Scena 5 — „So se ne kvari, ali se na kiši istopi.“ ──────────────────────────
export const Scena5: React.FC = () => {
  const f = useF();
  const kKv = kad(5, "kvari,");
  const kKisa = kad(5, "kiši");
  const kTop = kad(5, "istopi.");
  const vreme = napredak(f, 0, kKv + 12);
  const oblak = napredak(f, kKisa - 16, 14);
  const kisa = f >= kKisa - 4;
  const topi = napredak(f, kTop - 6, 30);
  const ug = vreme * Math.PI * 2;
  const tamno = interpolate(oblak, [0, 1], [0, 0.35]);
  return (
    <Kadar>
      <Hrapavo>
        <NeboTlo nebo="#E6D7AC" tlo="#C9B48A" horizont={1010} />
        <Oblik d="M120,1010 L960,1010 L1000,1110 L80,1110Z" boja={P.drvo} />
      </Hrapavo>
      {vreme < 1 && (
        <g>
          <g transform={`translate(${540 - Math.cos(ug) * 480} ${640 - Math.sin(ug) * 400})`}>
            <circle r={58} fill={P.zlatna} stroke={P.mastilo} strokeWidth={4} />
          </g>
          <g transform={`translate(${540 + Math.cos(ug) * 480} ${640 + Math.sin(ug) * 400})`}>
            <circle r={46} fill="#F3EFD9" stroke={P.mastilo} strokeWidth={4} />
          </g>
        </g>
      )}
      {/* šipke soli na dasci */}
      <g transform="translate(560 1010)">
        <Naslaga n={6} topi={topi} s={1.2} />
      </g>
      {/* zelena kvačica: ne kvari se */}
      {f >= kKv && oblak < 0.6 && (
        <Pop at={kKv} x={880} y={720} skala={1}>
          <Linija d="M-50,0 L-14,40 L60,-50" boja={P.zelena700} debljina={16} napredak={napredak(f, kKv, 8)} />
        </Pop>
      )}
      <rect x={-200} y={-200} width={1480} height={2400} fill="#2E3E4E" opacity={tamno} />
      {oblak > 0 && (
        <g transform={`translate(${mesaj(1400, 560, oblak)} 330)`}>
          <Oblik d="M-300,60 C-330,0 -260,-60 -200,-40 C-180,-110 -60,-130 -10,-70 C40,-140 180,-120 200,-40 C280,-60 330,20 290,70 C200,90 -200,90 -300,60Z" boja="#8A97A3" debljina={5} />
        </g>
      )}
      {kisa && (
        <g>
          {Array.from({ length: 46 }, (_, i) => {
            const x = 260 + ((i * 97) % 640);
            const y = 420 + ((f * 34 + i * 71) % 620);
            return <Linija key={i} d={`M${x},${y} L${x - 12},${y + 46}`} boja="#BFD6E2" debljina={4} opacity={0.85} />;
          })}
        </g>
      )}
      {topi > 0 && <ellipse cx={560} cy={1030} rx={360 * topi + 40} ry={30 * topi + 6} fill="#DCEAF0" opacity={0.75} stroke={P.mastilo} strokeWidth={2} />}
    </Kadar>
  );
};
