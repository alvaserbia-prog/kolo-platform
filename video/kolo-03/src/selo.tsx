// Elementi videa 03: selo (kapija, ograda), komšije iz sećanja, sličice, predmeti
// (drva, čekić, kolači), pečat i natpis. Isti papirni stil: isečci, drhtave linije.
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, Pt, krugTacke, pravougaonik, drhtaviPut, useBoil } from "./papir";
import { GlavaCfg, Osoba, spring01 } from "./likovi";
import { RUKOPIS, SANS } from "./fontovi";

// ── Komšije iz sećanja (scene 1–3) ──────────────────────────────────────
export type KomsijaId = "jova" | "stana" | "pera";
export const KOMSIJE: Record<KomsijaId, { ime: string; boja: string; glava: GlavaCfg }> = {
  jova: { ime: "Jova", boja: P.more, glava: { frizura: "cela", kosa: P.kosaSeda, brkovi: true, koza: P.koza2 } },
  stana: { ime: "Stana", boja: P.narandza, glava: { frizura: "marama" } },
  pera: { ime: "Pera", boja: P.korala600, glava: { frizura: "kratka", kosa: P.kosaSeda, brkovi: true } },
};

/** Ruka koja maše: rame u (sx, sy), šaka se njiše oko ugla `ugao` (stepeni, 0 = gore). */
export const RukaMase: React.FC<{ seed: string; sx: number; sy: number; boja: string; duzina?: number; ugao?: number; mah?: number; od?: number }> = ({
  seed,
  sx,
  sy,
  boja,
  duzina = 95,
  ugao = 25,
  mah = 18,
  od = 0,
}) => {
  const f = useCurrentFrame();
  const t = f - od;
  if (t < 0) return null;
  const a = ((ugao + Math.sin(t / 3.2) * mah) * Math.PI) / 180;
  const s = Math.min(1, spring01(t));
  const hx = sx + Math.sin(a) * duzina * s;
  const hy = sy - Math.cos(a) * duzina * s;
  const lakat: Pt = [(sx + hx) / 2 + Math.sign(ugao || 1) * 14, (sy + hy) / 2 + 8];
  return (
    <g>
      <Crta pts={[[sx, sy], lakat, [hx, hy]]} seed={`${seed}-r`} boja={boja} debljina={24} korak={20} />
      <Isecak pts={krugTacke(hx, hy, 17, 10)} boja={P.koza} seed={`${seed}-s`} senka="mala" amp={1} korak={10} />
    </g>
  );
};

/** Komšija (poprsje) sa opcionom rukom koja maše. */
export const Komsija: React.FC<{ id: KomsijaId; seed: string; osmeh?: number; mase?: number; strana?: 1 | -1 }> = ({ id, seed, osmeh = 1, mase, strana = 1 }) => {
  const k = KOMSIJE[id];
  return (
    <g>
      <Osoba seed={seed} boja={k.boja} glava={{ ...k.glava, osmeh }} />
      {mase !== undefined && <RukaMase seed={`${seed}-ruka`} sx={strana * 40} sy={16} boja={k.boja} ugao={strana * 28} od={mase} />}
    </g>
  );
};

// ── Kapija (vojvođanska, sa krovićem) ───────────────────────────────────
export const Kapija: React.FC<{ seed: string; sirina?: number; visina?: number; boja?: string }> = ({ seed, sirina = 230, visina = 190, boja = "#8A5A34" }) => {
  const w = sirina;
  const h = visina;
  return (
    <g>
      {/* zid oko kapije */}
      <Isecak pts={pravougaonik(-w / 2 - 14, -h - 6, w + 28, h + 6)} boja="#EFE3CC" seed={`${seed}-zid`} amp={1.6} />
      {/* krović od crepa */}
      <Isecak pts={[[-w / 2 - 34, -h - 2], [-w / 2 - 8, -h - 44], [w / 2 + 8, -h - 44], [w / 2 + 34, -h - 2]]} boja={P.korala600} seed={`${seed}-kr`} />
      {[-0.3, 0, 0.3].map((x, i) => (
        <Crta key={i} pts={[[x * w - 30, -h - 38], [x * w + 30, -h - 38]]} seed={`${seed}-cr${i}`} boja="#9E3413" debljina={4} opacity={0.6} />
      ))}
      {/* veliko krilo (za kola) */}
      <Isecak pts={pravougaonik(-w / 2 + 6, -h + 10, w * 0.62, h - 10)} boja={boja} seed={`${seed}-k1`} amp={1.4} />
      {Array.from({ length: 6 }, (_, i) => (
        <Crta key={i} pts={[[-w / 2 + 18 + i * w * 0.1, -h + 16], [-w / 2 + 18 + i * w * 0.1, -6]]} seed={`${seed}-d${i}`} boja="#6B4424" debljina={3.5} opacity={0.7} />
      ))}
      <Crta pts={[[-w / 2 + 12, -h * 0.55], [-w / 2 + w * 0.6, -h * 0.55]]} seed={`${seed}-p`} boja="#6B4424" debljina={6} />
      {/* malo krilo (vratnice) sa lukom */}
      <Isecak pts={[[w * 0.16, 0], [w * 0.16, -h * 0.72], [w * 0.32, -h * 0.86], [w / 2 - 6, -h * 0.72], [w / 2 - 6, 0]]} boja={P.zelena700} seed={`${seed}-v`} amp={1.2} />
      <circle cx={w * 0.22} cy={-h * 0.4} r={6} fill={P.zlatna400} />
    </g>
  );
};

// ── Ograda od letava ────────────────────────────────────────────────────
export const Ograda: React.FC<{ seed: string; od: number; do: number; visina?: number; boja?: string; razmak?: number }> = ({
  seed,
  od,
  do: dox,
  visina = 130,
  boja = "#C99B62",
  razmak = 46,
}) => {
  const n = Math.floor((dox - od) / razmak) + 1;
  return (
    <g>
      <Isecak pts={pravougaonik(od - 10, -visina * 0.72, dox - od + 20, 16)} boja="#A97C45" seed={`${seed}-p1`} senka="mala" amp={1.2} />
      <Isecak pts={pravougaonik(od - 10, -visina * 0.3, dox - od + 20, 16)} boja="#A97C45" seed={`${seed}-p2`} senka="mala" amp={1.2} />
      {Array.from({ length: n }, (_, i) => {
        const x = od + i * razmak;
        const v = visina + ((i * 37) % 3) * 6;
        return <Isecak key={i} pts={[[x - 15, 0], [x - 15, -v + 16], [x, -v], [x + 15, -v + 16], [x + 15, 0]]} boja={boja} seed={`${seed}-l${i}`} senka="mala" amp={1.2} korak={16} />;
      })}
    </g>
  );
};

// ── Predmeti ────────────────────────────────────────────────────────────
/** Naramak drva: cepanice sa godovima. */
export const Drva: React.FC<{ seed: string }> = ({ seed }) => {
  const cep: Pt[] = [[-54, 20], [0, 22], [54, 18], [-27, -22], [27, -24], [0, -64]];
  return (
    <g>
      {cep.map(([x, y], i) => (
        <g key={i}>
          <Isecak pts={krugTacke(x, y, 30, 12)} boja="#9A6436" seed={`${seed}-c${i}`} senka="mala" amp={1.4} />
          <Isecak pts={krugTacke(x, y, 21, 10)} boja="#E2B57A" seed={`${seed}-u${i}`} senka="bez" amp={1} />
          <circle cx={x} cy={y} r={11} fill="none" stroke="#B9854E" strokeWidth={2.5} />
          <circle cx={x} cy={y} r={3.5} fill="#B9854E" />
        </g>
      ))}
    </g>
  );
};

/** Čekić; `udarac` 0–1 (0 podignut, 1 udario), okreće se oko drške u (0,0). */
export const Cekic: React.FC<{ seed: string; udarac?: number }> = ({ seed, udarac = 0 }) => (
  <g transform={`rotate(${-40 + udarac * 55})`}>
    <Crta pts={[[0, 0], [0, -120]]} seed={`${seed}-d`} boja="#9A6A3A" debljina={16} />
    <Isecak pts={pravougaonik(-40, -150, 80, 36)} boja={P.siva} seed={`${seed}-g`} senka="mala" amp={1} korak={12} />
  </g>
);

/** Tanjir kolača (vanilice sa pekmezom) i para. */
export const Kolaci: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  const mesta: Pt[] = [[-56, -14], [0, -18], [56, -14], [-28, -40], [28, -42], [0, -64]];
  return (
    <g>
      {[-30, 10].map((x, i) => {
        const t = ((f + i * 16) % 48) / 48;
        const pts: Pt[] = Array.from({ length: 5 }, (_, k) => [x + Math.sin(k * 1.4 + i) * 8, -90 - k * 12 - t * 26]);
        return <Crta key={i} pts={pts} seed={`${seed}-pa${i}`} boja="#ffffff" debljina={5} opacity={(1 - t) * 0.85} />;
      })}
      <Isecak pts={krugTacke(0, 6, 112, 0, 34)} boja={P.belo} seed={`${seed}-t`} />
      <Isecak pts={krugTacke(0, 2, 88, 0, 24)} boja="#EDE6D8" seed={`${seed}-t2`} senka="bez" amp={1} />
      {mesta.map(([x, y], i) => (
        <g key={i}>
          <Isecak pts={krugTacke(x, y, 25, 12)} boja="#E8C48A" seed={`${seed}-k${i}`} senka="mala" amp={1.2} korak={10} />
          <circle cx={x} cy={y} r={7} fill={P.korala600} />
          {[0, 1, 2].map((j) => (
            <circle key={j} cx={x - 12 + j * 11} cy={y + ((i + j) % 2 ? -12 : 10)} r={2.4} fill="#fff" opacity={0.9} />
          ))}
        </g>
      ))}
    </g>
  );
};

/** Srce (za „pamtili"). */
export const Srce: React.FC<{ seed: string; r?: number; boja?: string }> = ({ seed, r = 40, boja = P.korala }) => {
  const pts: Pt[] = Array.from({ length: 28 }, (_, i) => {
    const t = (i / 28) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [(x * r) / 16, (y * r) / 16];
  });
  return <Isecak pts={pts} boja={boja} seed={seed} senka="mala" amp={1.2} korak={12} />;
};

// ── Sličica iz sećanja: stara fotografija sa belom ivicom i natpisom ─────
export const Slicica: React.FC<{ seed: string; w?: number; h?: number; natpis: string; nebo?: string; children?: React.ReactNode }> = ({
  seed,
  w = 400,
  h = 300,
  natpis,
  nebo = "#CFE3EA",
  children,
}) => {
  const id = `sl-${seed}`;
  return (
    <g>
      <Isecak pts={pravougaonik(-w / 2 - 20, -h / 2 - 20, w + 40, h + 96)} boja={P.belo} seed={`${seed}-okvir`} amp={2} />
      <clipPath id={id}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={nebo} />
        <rect x={-w / 2} y={h * 0.18} width={w} height={h} fill="#B8CF7E" />
        {children}
      </g>
      <text x={0} y={h / 2 + 58} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={50} fill={P.siva}>
        {natpis}
      </text>
    </g>
  );
};

// ── Pečat (gumeni, crven) ──────────────────────────────────────────────
export const Pecat: React.FC<{ seed: string; tekst: string; t: number; boja?: string; velicina?: number }> = ({ seed, tekst, t, boja = P.korala600, velicina = 64 }) => {
  const b = useBoil();
  if (t <= 0) return null;
  const w = tekst.length * velicina * 0.66 + 60;
  const h = velicina * 1.5;
  const s = 1 + Math.max(0, 1 - t) * 0.9;
  return (
    <g transform={`scale(${s.toFixed(3)})`} opacity={Math.min(1, t * 1.6)}>
      <path d={drhtaviPut(pravougaonik(-w / 2, -h / 2, w, h), `${seed}-o-${b}`, 1.6, 30)} fill="none" stroke={boja} strokeWidth={8} />
      <path d={drhtaviPut(pravougaonik(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24), `${seed}-i-${b}`, 1.2, 30)} fill="none" stroke={boja} strokeWidth={3} />
      <text x={0} y={velicina * 0.36} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={velicina} fill={boja} letterSpacing={4}>
        {tekst}
      </text>
    </g>
  );
};

/** Natpis scene: rukopis na papirnoj traci (kraći tekst iz scenarija). */
export const Natpis: React.FC<{ seed: string; tekst: React.ReactNode; duzina: number; velicina?: number; boja?: string; pozadina?: string }> = ({
  seed,
  tekst,
  duzina,
  velicina = 66,
  boja = P.zelena900,
  pozadina = P.belo,
}) => {
  const w = duzina * velicina * 0.42 + 60;
  return (
    <g>
      <Isecak pts={pravougaonik(-w / 2, -velicina * 0.78, w, velicina * 1.24)} boja={pozadina} seed={`${seed}-e`} amp={2} />
      <text x={0} y={velicina * 0.2} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={velicina} fill={boja}>
        {tekst}
      </text>
    </g>
  );
};

/** Oblačić govora sa repom nadole-levo/desno. */
export const Govor: React.FC<{ seed: string; tekst: string; velicina?: number; rep?: 1 | -1 }> = ({ seed, tekst, velicina = 50, rep = -1 }) => {
  const w = tekst.length * velicina * 0.42 + 56;
  const h = velicina * 1.5;
  return (
    <g>
      <Isecak pts={[[rep * w * 0.22, h / 2 - 4], [rep * w * 0.36, h / 2 + 40], [rep * w * 0.06, h / 2 - 4]]} boja={P.belo} seed={`${seed}-r`} senka="mala" />
      <Isecak pts={krugTacke(0, 0, w / 2, 24, h / 2)} boja={P.belo} seed={`${seed}-o`} amp={2.4} korak={26} />
      <text x={0} y={velicina * 0.32} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={velicina} fill={P.zelena900}>
        {tekst}
      </text>
    </g>
  );
};
