// Komšijska sveska: sveska sa spiralom, redovi zapisa „Ime → Ime · N POENA · šta",
// olovka koja piše, zeleni žig POEN, marker i korice koje se zatvaraju.
// POEN je uvek red u svesci — nikad novčić ni novčanica. Crta se oko (0,0), 900×700.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, krugTacke, pravougaonik, drhtaviPut, useBoil } from "./papir";
import { LogoZnak } from "./kolo";
import { RUKOPIS, SANS } from "./fontovi";

export const SV_W = 900;
export const SV_H = 700;
const X0 = -330; // početak reda (desno od margine)
const Y_RED0 = -150; // osnovna linija prvog reda
const KORAK = 82;
const VEL = 44;

export const yReda = (i: number) => Y_RED0 + i * KORAK;
export const X_REDA = X0;

export type Red = {
  od: string;
  ka: string;
  iznos: string;
  sta: string;
  pisanje?: number; // 0–1 iscrtavanje rukopisom
  zig?: number; // 0–1 žig POEN
  marker?: number; // 0–1 žuti marker iza reda
};

export const duzinaReda = (r: Red) => `${r.od} → ${r.ka} · ${r.iznos} POENA · ${r.sta}`.length * VEL * 0.405;

/** Olovka: vrh grafita u (0,0), telo ide gore-desno. */
export const Olovka: React.FC<{ seed: string }> = ({ seed }) => (
  <g transform="rotate(38)">
    <Isecak pts={[[-13, -40], [0, 0], [13, -40]]} boja="#E9C79A" seed={`${seed}-drvo`} senka="bez" amp={0.6} korak={10} />
    <path d="M-5,-15 L0,0 L5,-15 Z" fill={P.tekst} />
    <Isecak pts={pravougaonik(-14, -250, 28, 212)} boja={P.sunce} seed={`${seed}-telo`} senka="mala" amp={1} korak={20} />
    <Crta pts={[[-4, -244], [-4, -44]]} seed={`${seed}-ivica`} boja={P.zlatna600} debljina={3} amp={0.4} />
    <Isecak pts={pravougaonik(-15, -276, 30, 28)} boja="#B8B8B0" seed={`${seed}-lim`} senka="bez" amp={0.6} korak={10} />
    <Isecak pts={pravougaonik(-14, -306, 28, 32)} boja={P.roze} seed={`${seed}-gumica`} senka="bez" amp={0.8} korak={10} />
  </g>
);

/** Mali zeleni žig POEN na kraju reda. */
export const ZigPoen: React.FC<{ seed: string; t: number; r?: number }> = ({ seed, t, r = 36 }) => {
  const b = useBoil();
  if (t <= 0) return null;
  return (
    <g transform={`rotate(-14) scale(${(1 + Math.max(0, 1 - t) * 0.8).toFixed(3)})`} opacity={Math.min(1, t * 1.5)}>
      <path d={drhtaviPut(krugTacke(0, 0, r, 18), `${seed}-z-${b}`, 1.3)} fill="none" stroke={P.zelena700} strokeWidth={5} />
      <path d={drhtaviPut(krugTacke(0, 0, r * 0.8, 16), `${seed}-z2-${b}`, 1)} fill="none" stroke={P.zelena700} strokeWidth={2} />
      <text x={0} y={r * 0.22} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={r * 0.56} fill={P.zelena700} letterSpacing={1}>
        POEN
      </text>
    </g>
  );
};

const RedZapisa: React.FC<{ r: Red; i: number; seed: string }> = ({ r, i, seed }) => {
  const f = useCurrentFrame();
  const y = yReda(i);
  const w = duzinaReda(r);
  const p = r.pisanje ?? 1;
  const id = `red-${seed}-${i}`;
  if (p <= 0) return null;
  return (
    <g>
      {(r.marker ?? 0) > 0 && <rect x={X0 - 10} y={y - 42} width={(w + 24) * (r.marker ?? 0)} height={54} fill={P.zlatna400} opacity={0.45} rx={6} />}
      <clipPath id={id}>
        <rect x={X0 - 10} y={y - 70} width={(w + 20) * p + 10} height={100} />
      </clipPath>
      <text x={X0} y={y} fontFamily={RUKOPIS} fontWeight={700} fontSize={VEL} fill={P.tekst} clipPath={`url(#${id})`}>
        {r.od} → {r.ka} · <tspan fill={P.zelena700}>{r.iznos} POENA</tspan>
        <tspan fill={P.siva}> · {r.sta}</tspan>
      </text>
      {(r.zig ?? 0) > 0 && (
        <g transform={`translate(${Math.min(398, X0 + w + 52)} ${y - 14})`}>
          <ZigPoen seed={`${seed}-z${i}`} t={r.zig ?? 0} />
        </g>
      )}
      {p > 0 && p < 1 && (
        <g transform={`translate(${X0 + w * p} ${y - 6 + Math.sin(f * 1.4) * 5})`}>
          <Olovka seed={`${seed}-ol${i}`} />
        </g>
      )}
    </g>
  );
};

/** Prazan red za gledaoca: isprekidan okvir „Ti → …" koji svetluca. */
const PrazanRed: React.FC<{ i: number; t: number; seed: string }> = ({ i, t, seed }) => {
  const f = useCurrentFrame();
  if (t <= 0) return null;
  const y = yReda(i);
  const sjaj = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <g opacity={Math.min(1, t * 1.4)}>
      <rect x={X0 - 14} y={y - 50} width={700 * Math.min(1, t)} height={66} rx={10} fill={P.zlatna400} opacity={0.18 + 0.2 * sjaj} />
      <Crta
        pts={[[X0 - 14, y - 50], [X0 + 686, y - 50], [X0 + 686, y + 16], [X0 - 14, y + 16], [X0 - 14, y - 50]]}
        seed={`${seed}-okv`}
        boja={P.zelena700}
        debljina={4}
        napredak={t}
        korak={30}
        isprekidana
      />
      <text x={X0} y={y} fontFamily={RUKOPIS} fontWeight={700} fontSize={VEL + 4} fill={P.zelena700} opacity={Math.min(1, Math.max(0, t * 2 - 0.6))}>
        Ti → … · tvoj prvi zapis
      </text>
    </g>
  );
};

/**
 * Sveska. `zatvaranje` 0 = otvorena, 1 = korice spuštene (spirala je gore).
 * `prazan` 0–1 = prikaz praznog reda za gledaoca (na mestu posle poslednjeg).
 */
export const Sveska: React.FC<{
  seed: string;
  redovi: Red[];
  prazan?: number;
  zatvaranje?: number;
  naslov?: number; // 0–1 pojava naslova strane
}> = ({ seed, redovi, prazan = 0, zatvaranje = 0, naslov = 1 }) => {
  const w = SV_W;
  const h = SV_H;
  const top = -h / 2;
  const teta = Math.PI * (1 - Math.max(0, Math.min(1, zatvaranje)));
  const sy = Math.cos(teta);
  const lice = sy > 0;
  return (
    <g>
      {/* list ispod (debljina sveske) */}
      <Isecak pts={pravougaonik(-w / 2 + 10, top + 12, w, h)} boja="#E6DCC6" seed={`${seed}-ispod`} amp={1.6} />
      <Isecak pts={pravougaonik(-w / 2, top, w, h)} boja={P.belo} seed={`${seed}-strana`} amp={1.8} />
      {/* margina i linije */}
      <Crta pts={[[X0 - 26, top + 36], [X0 - 26, top + h - 14]]} seed={`${seed}-mrg`} boja={P.korala} debljina={3} amp={0.6} />
      {Array.from({ length: 6 }, (_, i) => (
        <Crta key={i} pts={[[-w / 2 + 24, yReda(i) + 14], [w / 2 - 24, yReda(i) + 14]]} seed={`${seed}-l${i}`} boja="#A9C2DC" debljina={2.5} amp={0.5} korak={40} />
      ))}
      {/* naslov strane */}
      {naslov > 0 && (
        <g opacity={Math.min(1, naslov * 1.5)}>
          <text x={X0} y={top + 108} fontFamily={RUKOPIS} fontWeight={700} fontSize={58} fill={P.zelena900}>
            Komšijska sveska
          </text>
          <Crta pts={[[X0, top + 122], [X0 + 360 * Math.min(1, naslov), top + 126]]} seed={`${seed}-podv`} boja={P.zlatna600} debljina={5} />
        </g>
      )}
      {redovi.map((r, i) => (
        <RedZapisa key={i} r={r} i={i} seed={seed} />
      ))}
      <PrazanRed i={redovi.length} t={prazan} seed={seed} />
      {/* korice: šarka na vrhu (spirala), okreću se preko strane */}
      {zatvaranje > 0 && Math.abs(sy) > 0.01 && (
        <g transform={`translate(0 ${top}) scale(1 ${sy.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-w / 2 - 12, 0, w + 24, h + 14)} boja={lice ? P.zelena700 : "#2C6E45"} seed={`${seed}-korice`} amp={2} />
          {lice && (
            <g>
              <Isecak pts={pravougaonik(-w / 2 + 30, 40, w - 60, h - 70)} boja="#1F7A43" seed={`${seed}-okv`} senka="bez" amp={1.6} zrno={0.3} />
              <g transform={`translate(0 ${h * 0.36})`}>
                <LogoZnak seed={`${seed}-logo`} r={118} />
              </g>
              <g transform={`translate(0 ${h * 0.72}) rotate(-2)`}>
                <Isecak pts={pravougaonik(-300, -62, 600, 96)} boja={P.belo} seed={`${seed}-etik`} amp={1.6} />
                <text x={0} y={6} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={70} fill={P.zelena900}>
                  Komšijska sveska
                </text>
              </g>
            </g>
          )}
        </g>
      )}
      {/* spirala */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = -w / 2 + 44 + i * ((w - 88) / 14);
        return (
          <g key={i}>
            <circle cx={x} cy={top + 18} r={7} fill="#6F6A60" opacity={0.55} />
            <path d={`M${x - 8},${top + 18} C${x - 10},${top - 22} ${x + 10},${top - 22} ${x + 8},${top + 16}`} fill="none" stroke="#5C5A55" strokeWidth={6} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};
