// Likovi i predmeti iz videa 04 (Ana, Milan, Lazar, Marija) — isti izgled i boje u videu 03.
// Papirni stil: isečci, drhtave linije, uskakanje. Crta se oko (0,0).
import React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, Pt, krugTacke, pravougaonik, drhtaviPut, useBoil } from "./papir";
import { Etiketa, GlavaCfg, Osoba } from "./likovi";
import type { OsobaCfg } from "./kolo";
import { RUKOPIS, SANS } from "./fontovi";

// ── Četiri lika: boje i glave su iste kroz ceo video ────────────────────
export type LikId = "ana" | "milan" | "lazar" | "marija";
export const LIKOVI: Record<LikId, { ime: string; boja: string; glava: GlavaCfg }> = {
  ana: { ime: "Ana", boja: P.zlatna400, glava: { frizura: "rep", kosa: P.kosaSmedja } },
  milan: { ime: "Milan", boja: P.slezova, glava: { frizura: "kratka", kosa: P.kosaTamna, brkovi: true, koza: P.koza2 } },
  lazar: { ime: "Lazar", boja: P.nebo, glava: { frizura: "kapa", koza: P.koza } },
  marija: { ime: "Marija", boja: P.roze, glava: { frizura: "punda", kosa: P.kosaSeda, naocare: true } },
};
/** Redosled u kolu (scene 5 i 6). */
export const U_KOLU: LikId[] = ["milan", "ana", "lazar", "marija"];
export const OSOBE_KOLA: OsobaCfg[] = U_KOLU.map((id) => ({ boja: LIKOVI[id].boja, glava: LIKOVI[id].glava }));

/** Lik (poprsje) sa imenom na etiketi ispod. osmeh: 1 srećan, 0 ravno, <0 zabrinut. */
export const Lik: React.FC<{ id: LikId; seed: string; osmeh?: number; ime?: boolean; zmurka?: boolean }> = ({ id, seed, osmeh = 1, ime = true, zmurka }) => {
  const l = LIKOVI[id];
  return (
    <g>
      <Osoba seed={seed} boja={l.boja} glava={{ ...l.glava, osmeh, zmurka }} />
      {ime && (
        <g transform="translate(0 150) rotate(-3)">
          <Etiketa seed={`${seed}-ime`} tekst={l.ime} velicina={44} />
        </g>
      )}
    </g>
  );
};

// ── Tegla meda ──────────────────────────────────────────────────────────
export const Tegla: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={[[-58, -70], [58, -70], [66, -40], [66, 70], [52, 86], [-52, 86], [-66, 70], [-66, -40]]} boja="#E39B26" seed={`${seed}-t`} />
    <Isecak pts={[[-40, -30], [-22, -34], [-26, 60], [-44, 56]]} boja="#F7C66A" seed={`${seed}-sj`} senka="bez" amp={1} korak={12} zrno={0.2} />
    {/* poklopac od platna sa tačkicama i kanapom */}
    <Isecak pts={[[-78, -74], [-50, -104], [0, -112], [50, -104], [78, -74], [60, -64], [0, -70], [-60, -64]]} boja={P.korala} seed={`${seed}-p`} senka="mala" />
    {[-44, -14, 16, 46].map((x, i) => (
      <circle key={i} cx={x} cy={-86 + (i % 2) * 8} r={5} fill={P.belo} opacity={0.9} />
    ))}
    <Crta pts={[[-64, -66], [0, -60], [64, -66]]} seed={`${seed}-k`} boja="#8A5424" debljina={4} />
    <Isecak pts={pravougaonik(-42, 0, 84, 50)} boja={P.belo} seed={`${seed}-e`} senka="bez" amp={1.2} korak={14} />
    <text x={0} y={38} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={40} fill="#8A5424">
      med
    </text>
  </g>
);

// ── Košnica (oslikana, vojvođanska) i pčela ─────────────────────────────
export const Kosnica: React.FC<{ seed: string; boja: string; boja2: string }> = ({ seed, boja, boja2 }) => (
  <g>
    <Isecak pts={[[-80, -150], [0, -190], [80, -150], [70, -140], [-70, -140]]} boja={P.korala600} seed={`${seed}-kr`} />
    <Isecak pts={pravougaonik(-70, -142, 140, 70)} boja={boja} seed={`${seed}-1`} />
    <Isecak pts={pravougaonik(-70, -72, 140, 72)} boja={boja2} seed={`${seed}-2`} />
    <Isecak pts={pravougaonik(-26, -30, 52, 14)} boja={P.tekst} seed={`${seed}-u`} senka="bez" amp={0.8} korak={10} />
    <Isecak pts={krugTacke(0, -108, 16, 10)} boja={P.belo} seed={`${seed}-c`} senka="bez" amp={1} />
    <Isecak pts={pravougaonik(-60, 0, 20, 30)} boja="#8A5A34" seed={`${seed}-n1`} senka="mala" />
    <Isecak pts={pravougaonik(40, 0, 20, 30)} boja="#8A5A34" seed={`${seed}-n2`} senka="mala" />
  </g>
);

export const Pcela: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  const krila = Math.sin(f * 2.2) * 0.35 + 0.65;
  return (
    <g>
      <ellipse cx={-6} cy={-16} rx={14} ry={20 * krila} fill="#DDF1F7" opacity={0.85} transform="rotate(-25 -6 -16)" />
      <ellipse cx={8} cy={-16} rx={14} ry={20 * krila} fill="#DDF1F7" opacity={0.85} transform="rotate(25 8 -16)" />
      <Isecak pts={krugTacke(0, 0, 22, 12, 16)} boja={P.sunce} seed={`${seed}-t`} senka="mala" amp={0.8} korak={8} />
      <rect x={-8} y={-15} width={6} height={30} fill={P.tekst} opacity={0.85} />
      <rect x={4} y={-15} width={6} height={30} fill={P.tekst} opacity={0.85} />
      <circle cx={24} cy={-2} r={9} fill={P.tekst} />
    </g>
  );
};

/** Pčele koje kruže oko tačke (x,y). */
export const Pcele: React.FC<{ seed: string; x: number; y: number; n?: number; r?: number; od?: number }> = ({ seed, x, y, n = 3, r = 90, od = 0 }) => {
  const f = useCurrentFrame();
  if (f < od) return null;
  const t = f - od;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = t / 14 + (i * Math.PI * 2) / n;
        const px = x + Math.cos(a) * r * (1 + 0.2 * Math.sin(t / 9 + i));
        const py = y + Math.sin(a * 1.3) * r * 0.45;
        const s = Math.min(1, t / 8);
        return (
          <g key={i} transform={`translate(${px} ${py}) scale(${(0.8 * s).toFixed(3)} ${(0.8 * s).toFixed(3)}) scale(${Math.cos(a) > 0 ? -1 : 1} 1)`}>
            <Pcela seed={`${seed}-${i}`} />
          </g>
        );
      })}
    </g>
  );
};

// ── Veš-mašina ──────────────────────────────────────────────────────────
/** kvar 0–1: trese se, curi voda, dim; popravljena 0–1: voda se veselo vrti. */
export const VesMasina: React.FC<{ seed: string; kvar: number; popravljena: number }> = ({ seed, kvar, popravljena }) => {
  const f = useCurrentFrame();
  const tres = kvar * (1 - popravljena);
  const dx = Math.sin(f * 2.1) * 9 * tres;
  const rot = Math.sin(f * 1.7) * 2.5 * tres;
  const vrtnja = f * (popravljena > 0 ? 9 : 2) * (1 - tres * 0.8);
  return (
    <g>
      {/* barica */}
      {tres > 0.05 && <Isecak pts={krugTacke(20, 150, 150 * Math.min(1, kvar * 1.2), 18, 26)} boja="#9CCFE8" seed={`${seed}-bar`} senka="bez" opacity={0.85 * (1 - popravljena)} />}
      <g transform={`translate(${dx} 0) rotate(${rot})`}>
        <Isecak pts={pravougaonik(-150, -170, 300, 320)} boja={P.belo} seed={`${seed}-k`} amp={2} />
        <Isecak pts={pravougaonik(-150, -170, 300, 62)} boja="#E4E1DA" seed={`${seed}-pl`} senka="bez" amp={1.2} />
        <Isecak pts={krugTacke(-100, -140, 14, 10)} boja={P.nebo} seed={`${seed}-d1`} senka="bez" amp={0.6} />
        <Isecak pts={krugTacke(-60, -140, 14, 10)} boja={tres > 0.3 && Math.floor(f / 6) % 2 ? P.korala : P.trava} seed={`${seed}-d2`} senka="bez" amp={0.6} />
        <Isecak pts={pravougaonik(30, -152, 90, 26)} boja="#2b3a2f" seed={`${seed}-ek`} senka="bez" amp={0.8} korak={14} />
        <Isecak pts={krugTacke(0, 20, 100, 22)} boja="#B9C2C8" seed={`${seed}-o`} senka="mala" />
        <Isecak pts={krugTacke(0, 20, 78, 20)} boja={popravljena > 0.5 ? "#5DB7DE" : "#7FA7BA"} seed={`${seed}-v`} senka="bez" />
        <g transform={`rotate(${vrtnja} 0 20)`}>
          <Crta pts={Array.from({ length: 14 }, (_, i): Pt => [Math.cos(i * 0.45) * (10 + i * 4.5), 20 + Math.sin(i * 0.45) * (10 + i * 4.5)])} seed={`${seed}-sp`} boja={P.belo} debljina={7} opacity={0.8} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={Math.cos(i * 2.1) * 45} cy={20 + Math.sin(i * 2.1) * 45} r={9} fill={P.belo} opacity={0.75} />
          ))}
        </g>
        <path d={drhtaviPut(krugTacke(0, 20, 78, 20), `${seed}-st-${Math.floor(f / 4)}`, 1.2)} fill="none" stroke={P.belo} strokeWidth={6} opacity={0.5} />
      </g>
      {/* dim iz pokvarene mašine */}
      {tres > 0.3 &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 14) % 42) / 42;
          return (
            <g key={i} opacity={(1 - t) * tres}>
              <Isecak pts={krugTacke(80 + i * 20 + t * 40, -200 - t * 160, 22 + t * 30, 12)} boja="#8E8A84" seed={`${seed}-dim${i}`} senka="bez" amp={2} />
            </g>
          );
        })}
      {/* kapi */}
      {tres > 0.2 &&
        [0, 1].map((i) => {
          const t = ((f + i * 11) % 22) / 22;
          return <ellipse key={i} cx={-120 + i * 230} cy={140 + t * 40} rx={7} ry={11} fill="#5DB7DE" opacity={1 - t} />;
        })}
      {/* iskrice kad proradi */}
      {popravljena > 0 && popravljena < 1 && <Iskre seed={`${seed}-isk`} x={0} y={-40} t={popravljena} r={230} />}
    </g>
  );
};

/** Zlatne iskrice koje se razlete (t 0→1). */
export const Iskre: React.FC<{ seed: string; x: number; y: number; t: number; r?: number; n?: number; boja?: string }> = ({ seed, x, y, t, r = 160, n = 8, boja = P.zlatna400 }) => (
  <g opacity={t < 0.7 ? 1 : (1 - t) / 0.3}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + 0.3;
      const d1 = r * (0.35 + 0.5 * t);
      const d2 = r * (0.55 + 0.6 * t);
      return <Crta key={i} pts={[[x + Math.cos(a) * d1, y + Math.sin(a) * d1], [x + Math.cos(a) * d2, y + Math.sin(a) * d2]]} seed={`${seed}-${i}`} boja={boja} debljina={9} />;
    })}
  </g>
);

// ── Kutija za alat ──────────────────────────────────────────────────────
export const KutijaAlata: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Crta pts={[[-50, -70], [-50, -100], [50, -100], [50, -70]]} seed={`${seed}-dr`} boja={P.tekst} debljina={10} />
    <Isecak pts={pravougaonik(-110, -70, 220, 120)} boja={P.korala} seed={`${seed}-k`} />
    <Isecak pts={pravougaonik(-110, -70, 220, 26)} boja={P.korala600} seed={`${seed}-p`} senka="bez" />
    <Isecak pts={pravougaonik(-16, -52, 32, 22)} boja={P.siva} seed={`${seed}-b`} senka="bez" amp={0.6} korak={10} />
  </g>
);

// ── Otcepni kalendar ────────────────────────────────────────────────────
export const Kalendar: React.FC<{ seed: string; dan: number; list: number }> = ({ seed, dan, list }) => (
  <g>
    <Isecak pts={pravougaonik(-100, -110, 200, 230)} boja={P.belo} seed={`${seed}-k`} />
    <Isecak pts={pravougaonik(-100, -110, 200, 56)} boja={P.korala} seed={`${seed}-z`} senka="bez" />
    <text x={0} y={-70} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={P.belo} letterSpacing={2}>
      SEPTEMBAR
    </text>
    <text x={0} y={80} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={130} fill={P.tekst}>
      {dan}
    </text>
    {/* list koji se otcepljuje i odleće */}
    {list > 0 && list < 1 && (
      <g transform={`translate(${list * 160} ${-40 + list * 260}) rotate(${list * 70})`} opacity={1 - list}>
        <Isecak pts={pravougaonik(-100, -54, 200, 174)} boja={P.belo} seed={`${seed}-l`} senka="mala" />
        <text x={0} y={80} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={130} fill={P.tekst} transform="translate(0 -40)">
          {dan - 1}
        </text>
      </g>
    )}
    {[-60, -20, 20, 60].map((x, i) => (
      <circle key={i} cx={x} cy={-110} r={7} fill={P.siva} />
    ))}
  </g>
);

// ── Oblačić misli ───────────────────────────────────────────────────────
export const Oblacic: React.FC<{ seed: string; w?: number; h?: number; rep?: Pt; children?: React.ReactNode }> = ({ seed, w = 280, h = 220, rep = [-160, 170], children }) => (
  <g>
    <Isecak pts={krugTacke(rep[0] * 0.55, rep[1] * 0.6, 22, 10)} boja={P.belo} seed={`${seed}-m1`} senka="mala" />
    <Isecak pts={krugTacke(rep[0], rep[1], 13, 8)} boja={P.belo} seed={`${seed}-m2`} senka="mala" />
    <Isecak pts={krugTacke(0, 0, w / 2, 26, h / 2)} boja={P.belo} seed={`${seed}-o`} amp={5} korak={34} />
    {children}
  </g>
);

// ── Zapis: POEN je red u evidenciji, nikad novčić ───────────────────────
/** Kartica zapisa „od → ka · iznos POENA" sa zelenim žigom. pisanje 0–1 iscrtava rukopis. */
export const Zapis: React.FC<{ seed: string; od: string; ka: string; iznos: string; zig: number; pisanje?: number }> = ({ seed, od, ka, iznos, zig, pisanje = 1 }) => {
  const b = useBoil();
  const id = `zp-${seed}`;
  return (
    <g>
      <Isecak pts={pravougaonik(-250, -120, 500, 240)} boja={P.belo} seed={`${seed}-k`} amp={1.6} />
      <Crta pts={[[-250, -66], [250, -66]]} seed={`${seed}-crv`} boja={P.korala} debljina={3} amp={0.6} />
      {[-4, 44, 92].map((y, i) => (
        <Crta key={i} pts={[[-230, y], [230, y]]} seed={`${seed}-l${i}`} boja="#9DB7D5" debljina={2.5} amp={0.6} />
      ))}
      <text x={-228} y={-80} fontFamily={RUKOPIS} fontWeight={700} fontSize={36} fill={P.siva}>
        zapis
      </text>
      <clipPath id={id}>
        <rect x={-240} y={-66} width={400 * pisanje} height={170} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <text x={-228} y={-14} fontFamily={RUKOPIS} fontWeight={700} fontSize={56} fill={P.tekst}>
          {od} → {ka}
        </text>
        <text x={-228} y={80} fontFamily={RUKOPIS} fontWeight={700} fontSize={58} fill={P.zelena700}>
          {iznos} POENA
        </text>
      </g>
      {zig > 0 && (
        <g transform={`translate(182 22) rotate(-14) scale(${(1 + Math.max(0, 1 - zig) * 0.8).toFixed(3)})`} opacity={Math.min(1, zig * 1.5)}>
          <path d={drhtaviPut(krugTacke(0, 0, 56, 20), `${seed}-z-${b}`, 1.6)} fill="none" stroke={P.zelena700} strokeWidth={6} />
          <path d={drhtaviPut(krugTacke(0, 0, 45, 18), `${seed}-z2-${b}`, 1.2)} fill="none" stroke={P.zelena700} strokeWidth={2.5} />
          <text x={0} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={31} fill={P.zelena700} letterSpacing={1}>
            POEN
          </text>
        </g>
      )}
    </g>
  );
};

// ── Somborski motiv kao nalepnica (isečena slika sa belom ivicom) ────────
export const SLIKE = {
  zupanija: { w: 1176, h: 663 },
  "trg-svetog-trojstva": { w: 920, h: 707 },
  "crkva-svetog-djordja": { w: 903, h: 708 },
} as const;
export type SlikaIme = keyof typeof SLIKE;

/** Slika se crta sa donjom ivicom na (0,0), širine `sirina`. Blago „diše" kao isečak. */
export const Slika: React.FC<{ ime: SlikaIme; sirina: number; seed: string }> = ({ ime, sirina, seed }) => {
  const b = useBoil();
  const { w, h } = SLIKE[ime];
  const vis = (sirina / w) * h;
  const rot = ((b * 7 + seed.length) % 3) - 1; // −1, 0, 1 × 0,25°
  return (
    <g transform={`rotate(${rot * 0.25})`}>
      <image href={staticFile(`sombor/${ime}.png`)} x={-sirina / 2} y={-vis} width={sirina} height={vis} filter="url(#nalepnica)" />
    </g>
  );
};

/** Filter za sliku-nalepnicu: bela isečena ivica + senka. Ubaciti jednom po SVG-u. */
export const DefsNalepnica: React.FC = () => (
  <defs>
    <filter id="nalepnica" x="-10%" y="-10%" width="120%" height="125%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="ivica" />
      <feFlood floodColor="#FFFDF7" />
      <feComposite in2="ivica" operator="in" result="bela" />
      <feGaussianBlur in="ivica" stdDeviation="4" result="mut" />
      <feOffset in="mut" dx="4" dy="8" result="pomak" />
      <feFlood floodColor="#3b2a14" floodOpacity="0.3" />
      <feComposite in2="pomak" operator="in" result="senka" />
      <feMerge>
        <feMergeNode in="senka" />
        <feMergeNode in="bela" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

/** Precrtana etiketa (npr. „dinari", „novac"). */
export const Precrtano: React.FC<{ seed: string; tekst: string; precrtaj: number; velicina?: number }> = ({ seed, tekst, precrtaj, velicina = 70 }) => {
  const w = tekst.length * velicina * 0.42 + 40;
  return (
    <g>
      <Etiketa seed={seed} tekst={tekst} velicina={velicina} />
      <Crta pts={[[-w / 2 - 10, 14], [0, -2], [w / 2 + 10, -18]]} seed={`${seed}-x`} boja={P.korala} debljina={12} napredak={precrtaj} korak={30} />
    </g>
  );
};

/** Isprekidana veza između dva lika (iscrtava se). */
export const Veza: React.FC<{ a: Pt; b: Pt; seed: string; napredak: number; boja?: string; debljina?: number }> = ({ a, b, seed, napredak, boja = P.zlatna600, debljina = 8 }) => {
  const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 40];
  return <Crta pts={[a, m, b]} seed={seed} boja={boja} debljina={debljina} napredak={napredak} korak={30} isprekidana />;
};
