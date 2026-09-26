// Likovi i predmeti videa 04: Ana, Milan, Lazar i Marija, tegla meda,
// veš mašina, zapis POEN-a. Isti papirni kolaž kao u videu 1 (papir.tsx).
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, Pt, drhtaviPut, krugTacke, pravougaonik, useBoil } from "./papir";
import { Etiketa, GlavaCfg, Osoba } from "./likovi";
import { RUKOPIS, SANS } from "./fontovi";
import type { OsobaCfg } from "./kolo";

// Svaki lik ima STALNU boju kroz ceo video — po njoj se prepoznaje i u kolu.
export type LikId = "milan" | "ana" | "lazar" | "marija";
export const LIK: Record<LikId, { ime: string; boja: string; glava: GlavaCfg }> = {
  milan: { ime: "Milan", boja: P.nebo, glava: { frizura: "kratka", kosa: P.kosaTamna, brkovi: true, koza: P.koza2 } },
  ana: { ime: "Ana", boja: P.zlatna400, glava: { frizura: "rep", kosa: P.kosaSmedja } },
  lazar: { ime: "Lazar", boja: P.zelena500, glava: { frizura: "kapa", kapaBoja: P.zelena900, koza: P.koza2 } },
  marija: { ime: "Marija", boja: P.korala, glava: { frizura: "punda", kosa: P.kosaTamna } },
};
export const REDOSLED: LikId[] = ["milan", "ana", "lazar", "marija"];
export const OSOBE_KOLA: OsobaCfg[] = REDOSLED.map((id) => ({ boja: LIK[id].boja, glava: LIK[id].glava }));

/** Krupan lik (poprsje) sa imenom na etiketi ispod. Stopala su u (0,0)… tačnije dno tela. */
export const Lik: React.FC<{ id: LikId; osmeh?: number; ime?: boolean; seed?: string }> = ({ id, osmeh = 1, ime = true, seed }) => {
  const l = LIK[id];
  return (
    <g>
      <g transform="translate(0 -210)">
        <Osoba seed={seed ?? `lik-${id}`} boja={l.boja} glava={{ ...l.glava, r: 78, osmeh }} sirina={230} visina={210} />
      </g>
      {ime && (
        <g transform="translate(0 40) rotate(-2)">
          <Etiketa seed={`ime-${id}`} tekst={l.ime} velicina={62} />
        </g>
      )}
    </g>
  );
};

/** Tegla meda: staklo, med, poklopac sa kockastom krpicom. */
export const Tegla: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={[[-46, -70], [46, -70], [54, -50], [54, 60], [42, 72], [-42, 72], [-54, 60], [-54, -50]]} boja="#F7E7B8" seed={`${seed}-st`} amp={1.4} korak={16} />
    <Isecak pts={[[-48, -30], [48, -30], [48, 58], [38, 68], [-38, 68], [-48, 58]]} boja={P.zlatna400} seed={`${seed}-m`} senka="bez" amp={1.4} korak={16} />
    <Isecak pts={[[-48, 10], [48, 10], [48, 58], [38, 68], [-38, 68], [-48, 58]]} boja={P.zlatna600} seed={`${seed}-m2`} senka="bez" amp={1.4} korak={16} zrno={0.4} />
    <Isecak pts={[[-62, -96], [62, -96], [56, -66], [-56, -66]]} boja={P.korala} seed={`${seed}-p`} senka="mala" amp={1.6} korak={14} />
    <Crta pts={[[-44, -88], [44, -88]]} seed={`${seed}-p1`} boja={P.belo} debljina={4} opacity={0.8} />
    <Crta pts={[[-48, -74], [48, -74]]} seed={`${seed}-p2`} boja={P.belo} debljina={4} opacity={0.8} />
    <Crta pts={[[-30, -40], [-30, 30]]} seed={`${seed}-sj`} boja="#ffffff" debljina={7} opacity={0.6} />
  </g>
);

/** Pult sa teglama (Anina tezga). `n` tegli je već na pultu. */
export const Pult: React.FC<{ seed: string; n: number }> = ({ seed, n }) => {
  const mesta = [-240, -120, 0, 120, 240];
  return (
    <g>
      {mesta.slice(0, n).map((x, i) => (
        <g key={i} transform={`translate(${x} -90) scale(0.9) rotate(${(i % 2 ? 3 : -3)})`}>
          <Tegla seed={`${seed}-t${i}`} />
        </g>
      ))}
      <Isecak pts={pravougaonik(-330, -20, 660, 46)} boja="#B9793D" seed={`${seed}-da`} />
      <Isecak pts={pravougaonik(-300, 26, 600, 120)} boja={P.zlatna100} seed={`${seed}-pr`} senka="mala" />
      <Crta pts={[[-300, 60], [300, 60]]} seed={`${seed}-tr`} boja={P.korala} debljina={10} opacity={0.8} />
    </g>
  );
};

/** Veš mašina. `kvar` 1 = trese se i curi, 0 = radi (bubanj se okreće). */
export const VesMasina: React.FC<{ seed: string; kvar: number }> = ({ seed, kvar }) => {
  const f = useCurrentFrame();
  const tres = kvar > 0.5 ? Math.sin(f * 1.7) * 6 : 0;
  const bubanj = kvar > 0.5 ? f * 1.5 : f * 14;
  return (
    <g>
      {kvar > 0.5 && (
        <g>
          {/* lokva i kapi */}
          <Isecak pts={krugTacke(90, 150, 150 * kvar, 18, 26 * kvar)} boja="#9FD3EA" seed={`${seed}-lok`} senka="bez" amp={4} />
          {[0, 1, 2].map((i) => {
            const t = ((f + i * 11) % 32) / 32;
            return <Isecak key={i} pts={krugTacke(150 + i * 14, 70 + t * 80, 9, 8, 14)} boja="#5FB4DA" seed={`${seed}-k${i}`} senka="bez" amp={1} opacity={1 - t} />;
          })}
        </g>
      )}
      <g transform={`translate(${tres} 0) rotate(${tres * 0.4})`}>
        <Isecak pts={pravougaonik(-150, -170, 300, 320)} boja="#FBFAF6" seed={`${seed}-t`} amp={2} />
        <Isecak pts={pravougaonik(-150, -170, 300, 64)} boja="#E4E1D9" seed={`${seed}-v`} senka="bez" amp={1.6} />
        <Isecak pts={krugTacke(90, -138, 16, 10)} boja={P.siva} seed={`${seed}-dg`} senka="bez" amp={1} />
        <Isecak pts={pravougaonik(-120, -150, 120, 26)} boja={kvar > 0.5 ? P.korala : P.zelena500} seed={`${seed}-ek`} senka="bez" amp={1} />
        <Isecak pts={krugTacke(0, 10, 106, 22)} boja="#9AA3A8" seed={`${seed}-o`} amp={2} />
        <Isecak pts={krugTacke(0, 10, 84, 20)} boja="#CFE8F3" seed={`${seed}-st`} senka="bez" amp={1.6} />
        <g transform={`rotate(${bubanj} 0 10)`}>
          <Isecak pts={[[-60, 10], [-20, -40], [20, -30], [60, 20], [20, 60], [-30, 50]]} boja={P.nebo} seed={`${seed}-ves`} senka="bez" amp={3} opacity={0.75} />
        </g>
      </g>
    </g>
  );
};

/** Oblačić misli iznad glave (unutra predmet koji liku treba). */
export const Misao: React.FC<{ seed: string; children: React.ReactNode }> = ({ seed, children }) => (
  <g>
    <Isecak pts={krugTacke(-40, 150, 16, 10)} boja={P.belo} seed={`${seed}-m1`} senka="mala" />
    <Isecak pts={krugTacke(-10, 110, 24, 10)} boja={P.belo} seed={`${seed}-m2`} senka="mala" />
    <Isecak pts={krugTacke(0, 0, 118, 26, 96)} boja={P.belo} seed={`${seed}-o`} />
    {children}
  </g>
);

/**
 * Zapis POEN-a: kartončić iz knjige evidencije, jedan red — „Ime → Ime",
 * ispod iznos. POEN nikad nije novčić: ovo je zapis, sa zelenim žigom.
 * `upis` 0–1 ispisuje red slovo po slovo, `zig` 0–1 udara žig.
 */
export const Zapis: React.FC<{ seed: string; od: LikId; kome: LikId; iznos: string; upis: number; zig: number }> = ({ seed, od, kome, iznos, upis, zig }) => {
  const b = useBoil();
  const W = 300;
  const delovi: [string, string][] = [
    [LIK[od].ime, LIK[od].boja === P.zlatna400 ? P.zlatna600 : LIK[od].boja],
    [" → ", P.siva],
    [LIK[kome].ime, LIK[kome].boja === P.zlatna400 ? P.zlatna600 : LIK[kome].boja],
  ];
  const ukupno = delovi.reduce((a, d) => a + d[0].length, 0) + iznos.length + 6;
  let ostalo = Math.floor(upis * ukupno);
  const uzmi = (s: string) => {
    const n = Math.max(0, Math.min(s.length, ostalo));
    ostalo -= s.length;
    return s.slice(0, n);
  };
  return (
    <g>
      <Isecak pts={pravougaonik(-W, -130, 2 * W, 260)} boja={P.belo} seed={`${seed}-k`} amp={1.8} />
      <Crta pts={[[-W, -70], [W, -70]]} seed={`${seed}-crv`} boja={P.korala} debljina={3.5} amp={0.6} />
      {[10, 70].map((y, i) => (
        <Crta key={i} pts={[[-W + 24, y], [W - 24, y]]} seed={`${seed}-l${i}`} boja="#9DB7D5" debljina={2.5} amp={0.6} />
      ))}
      <text x={-W + 26} y={-86} fontFamily={RUKOPIS} fontWeight={700} fontSize={38} fill={P.siva}>
        zapis
      </text>
      <text x={-W + 30} y={-2} fontFamily={RUKOPIS} fontWeight={700} fontSize={80} fill={P.tekst}>
        {delovi.map(([t, c], i) => (
          <tspan key={i} fill={c}>
            {uzmi(t)}
          </tspan>
        ))}
      </text>
      <text x={-W + 30} y={62} fontFamily={SANS} fontWeight={900} fontSize={58} fill={P.tekst} letterSpacing={-0.5}>
        {uzmi(`${iznos} POENA`)}
      </text>
      {zig > 0 && (
        <g transform={`translate(${W - 92} 40) rotate(-12) scale(${(1 + Math.max(0, 1 - zig) * 0.8).toFixed(3)})`} opacity={Math.min(1, zig * 1.5)}>
          <path d={drhtaviPut(krugTacke(0, 0, 62, 20), `${seed}-z-${b}`, 1.6)} fill="none" stroke={P.zelena700} strokeWidth={6} />
          <path d={drhtaviPut(krugTacke(0, 0, 50, 18), `${seed}-z2-${b}`, 1.2)} fill="none" stroke={P.zelena700} strokeWidth={2.5} />
          <text x={0} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.zelena700} letterSpacing={1}>
            POEN
          </text>
        </g>
      )}
    </g>
  );
};

/** Iskra (kad se nešto popravi / kad se kolo zatvori). */
export const Iskra: React.FC<{ t: number; r?: number; boja?: string; seed: string }> = ({ t, r = 90, boja = P.zlatna400, seed }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <g opacity={1 - t}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const p1: Pt = [Math.cos(a) * r * (0.6 + t * 0.6), Math.sin(a) * r * (0.6 + t * 0.6)];
        const p2: Pt = [Math.cos(a) * r * (1 + t), Math.sin(a) * r * (1 + t)];
        return <Crta key={i} pts={[p1, p2]} seed={`${seed}-${i}`} boja={boja} debljina={9} />;
      })}
    </g>
  );
};

/** Sat — kazaljka napravi pun krug dok traje `t` 0–1 („registracija oko minut"). */
export const Sat: React.FC<{ seed: string; t: number }> = ({ seed, t }) => {
  const a = -Math.PI / 2 + t * Math.PI * 2;
  return (
    <g>
      <Isecak pts={pravougaonik(-22, -150, 44, 30)} boja={P.zelena700} seed={`${seed}-du`} senka="mala" amp={1} />
      <Isecak pts={krugTacke(0, 0, 126, 26)} boja={P.zelena700} seed={`${seed}-o`} />
      <Isecak pts={krugTacke(0, 0, 104, 24)} boja={P.belo} seed={`${seed}-b`} senka="bez" />
      {Array.from({ length: 12 }, (_, i) => {
        const u = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(u) * 84} cy={Math.sin(u) * 84} r={i % 3 ? 4 : 7} fill={P.siva} />;
      })}
      <path d={`M0,0 L0,-104 A104,104 0 ${t > 0.5 ? 1 : 0},1 ${Math.cos(a) * 104},${Math.sin(a) * 104} Z`} fill={P.zlatna400} opacity={0.45} />
      <Crta pts={[[0, 0], [Math.cos(a) * 88, Math.sin(a) * 88]]} seed={`${seed}-k`} boja={P.korala} debljina={9} amp={0.8} />
      <circle cx={0} cy={0} r={10} fill={P.tekst} />
    </g>
  );
};
