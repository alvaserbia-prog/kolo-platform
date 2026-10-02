// Predmeti videa 13 „Ušteda“, kao papirni isečci (alat iz src/kolaz, isti kao trilogija „Poverenje“).
// Nosiva slika je Zoranova sveska: kariran list, kolone „Dinari“ i „U KOLU“, red po trošku.
// POEN se ne crta kao novčić ni novčanica; novčanice su samo dinari, stilizovane (ne verne kopije).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { RUKOPIS, SANS } from "../fontovi";
import { P } from "../kolaz/paleta";
import { Crta, Isecak, Pt, drhtaviPut, krugTacke, pravougaonik, useBoil } from "../kolaz/papir";
import { Pecat } from "../kolaz/selo";
import { Glava, type GlavaCfg } from "../kolaz/likovi";

// ── Likovi ───────────────────────────────────────────────────────────
export const ZORAN: GlavaCfg = { frizura: "kratka", kosa: P.kosaSmedja, brkovi: true };
export const ZENA: GlavaCfg = { frizura: "rep", kosa: P.kosaTamna };
export const CERKA: GlavaCfg = { frizura: "punda", kosa: P.kosaSmedja, r: 36 };
export const SIN: GlavaCfg = { frizura: "kratka", kosa: P.kosaTamna, r: 34 };
export const KOMSINICA: GlavaCfg = { frizura: "punda", kosa: P.kosaTamna };
export const BAKA: GlavaCfg = { frizura: "marama", naocare: true };
export const BOJA_ZORAN = P.nebo;

/** Figura celim telom: glava, trup, noge (crtano oko stopala u (0,0)). */
export const Figura: React.FC<{ seed: string; glava: GlavaCfg; boja: string; visina?: number; noge?: string; osmeh?: number }> = ({
  seed,
  glava,
  boja,
  visina = 300,
  noge = P.zelena900,
  osmeh = 1,
}) => {
  const k = visina / 300;
  return (
    <g transform={`scale(${k})`}>
      <Isecak pts={pravougaonik(-34, -120, 28, 120)} boja={noge} seed={`${seed}-nl`} senka="mala" />
      <Isecak pts={pravougaonik(6, -120, 28, 120)} boja={noge} seed={`${seed}-nd`} senka="mala" />
      <Isecak pts={[[-46, -228], [46, -228], [58, -110], [-58, -110]]} boja={boja} seed={`${seed}-t`} />
      <g transform="translate(0 -268)">
        <Glava seed={`${seed}-g`} {...glava} osmeh={osmeh} />
      </g>
    </g>
  );
};

// ── Sveska ───────────────────────────────────────────────────────────
export const SVESKA = { x: 90, y: 140, w: 900, h: 1150 };
export const STAVKE = ["pijaca", "frizer", "mehaničar", "časovi", "šunka", "zimnica", "struja", "gorivo", "telefon", "lekovi", "porez"] as const;
export type Stavka = (typeof STAVKE)[number];
export const RED0 = 420;
export const RED = 66;
export const redY = (s: Stavka) => RED0 + STAVKE.indexOf(s) * RED;
export const KOL_DIN = 330; // sredina kolone „Dinari“
export const TEKST_X = 232; // početak reči u koloni „Dinari“
export const PREGRADA = 565;
export const KOL_KOLO = 790; // sredina kolone „U KOLU“

/** Kariran list iz sveske. `kolone`: crta se i kolona „U KOLU“ (napredak 0–1). */
export const List: React.FC<{ seed: string; kolone?: number; boja?: string }> = ({ seed, kolone = 0, boja = P.belo }) => {
  const { x, y, w, h } = SVESKA;
  const linije: React.ReactNode[] = [];
  for (let yy = y + 40; yy < y + h - 10; yy += 40) linije.push(<line key={`h${yy}`} x1={x + 10} y1={yy} x2={x + w - 10} y2={yy} stroke="#9DB7D5" strokeWidth={1.4} opacity={0.55} />);
  for (let xx = x + 40; xx < x + w - 10; xx += 40) linije.push(<line key={`v${xx}`} x1={xx} y1={y + 10} x2={xx} y2={y + h - 10} stroke="#9DB7D5" strokeWidth={1.4} opacity={0.55} />);
  return (
    <g>
      <Isecak pts={pravougaonik(x, y, w, h)} boja={boja} seed={`${seed}-l`} amp={2} korak={40} />
      {linije}
      {/* spirala sveske gore */}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={x + 50 + i * 62} cy={y + 18} r={9} fill={P.papir} stroke={P.siva} strokeWidth={2} />
      ))}
      <Crta pts={[[x + 120, y + 30], [x + 120, y + h - 10]]} seed={`${seed}-m`} boja={P.korala} debljina={3} amp={0.6} opacity={0.7} />
      {kolone > 0 && <Crta pts={[[PREGRADA, 290], [PREGRADA, 1120]]} seed={`${seed}-k`} boja={P.tekst} debljina={4} napredak={kolone} />}
    </g>
  );
};

/** Rukopis koji se ispisuje slovo po slovo (napredak 0–1). */
export const Rukopis: React.FC<{ x: number; y: number; tekst: string; napredak?: number; velicina?: number; boja?: string; sidro?: "start" | "middle" | "end"; tezina?: number }> = ({
  x,
  y,
  tekst,
  napredak = 1,
  velicina = 54,
  boja = P.tekst,
  sidro = "start",
  tezina = 700,
}) => {
  if (napredak <= 0) return null;
  const n = Math.ceil(tekst.length * Math.min(1, napredak));
  return (
    <text x={x} y={y} textAnchor={sidro} fontFamily={RUKOPIS} fontWeight={tezina} fontSize={velicina} fill={boja}>
      {tekst.slice(0, n)}
    </text>
  );
};

/** Precrtavanje rukom (napredak 0–1). */
export const Precrta: React.FC<{ x0: number; x1: number; y: number; napredak: number; seed: string; boja?: string }> = ({ x0, x1, y, napredak, seed, boja = P.korala600 }) => (
  <Crta pts={[[x0, y], [x1, y - 6]]} seed={seed} boja={boja} debljina={6} napredak={napredak} />
);

/** Pečat koji pada na red u svesci (t: 0 → 1 od trenutka udarca). */
export const PecatRed: React.FC<{ tekst: string; x: number; y: number; t: number; boja?: string; seed: string; velicina?: number }> = ({ tekst, x, y, t, boja = P.zelena700, seed, velicina: v }) => {
  const velicina = v ?? (tekst.length > 7 ? 27 : 32);
  return (
    <g transform={`translate(${x} ${y - 12}) rotate(${(seed.length % 3) - 2})`}>
      <Pecat seed={seed} tekst={tekst} t={t} boja={boja} velicina={velicina} />
    </g>
  );
};

/** Stilizovana novčanica dinara (pravougaonik sa „din“), sme da leti. */
export const Novcanica: React.FC<{ seed: string; boja?: string }> = ({ seed, boja = "#7FA7A0" }) => (
  <g>
    <Isecak pts={pravougaonik(-80, -38, 160, 76)} boja={boja} seed={`${seed}-n`} senka="mala" amp={1.4} />
    <Isecak pts={krugTacke(-38, 0, 22, 12)} boja="#ffffff55" seed={`${seed}-k`} senka="bez" amp={1} />
    <text x={30} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill="#2F4F49">
      din
    </text>
  </g>
);

/** Novčanik (prazan ili sa novčanicama). */
export const Novcanik: React.FC<{ seed: string; pun?: number }> = ({ seed, pun = 0 }) => (
  <g>
    {pun > 0 &&
      [0, 1, 2].slice(0, Math.ceil(pun * 3)).map((i) => (
        <g key={i} transform={`translate(${-20 + i * 22} ${-60 - i * 8}) rotate(${-8 + i * 8})`}>
          <Novcanica seed={`${seed}-n${i}`} />
        </g>
      ))}
    <Isecak pts={pravougaonik(-120, -60, 240, 140)} boja="#8A5A34" seed={`${seed}-t`} />
    <Isecak pts={[[-120, -60], [120, -60], [120, 0], [0, 20], [-120, 0]]} boja="#6E4426" seed={`${seed}-p`} senka="mala" />
    <Isecak pts={krugTacke(80, -10, 14, 10)} boja={P.zlatna400} seed={`${seed}-d`} senka="bez" amp={0.8} />
  </g>
);

// ── Auto, kofer, suncobran ───────────────────────────────────────────
export const Auto: React.FC<{ seed: string; tocak?: number }> = ({ seed, tocak = 0 }) => (
  <g>
    <Isecak pts={[[-250, -40], [-230, -110], [-120, -120], [-70, -200], [110, -200], [170, -120], [250, -100], [260, -40], [250, 0], [-250, 0]]} boja={P.korala} seed={`${seed}-k`} />
    <Isecak pts={[[-55, -185], [15, -185], [15, -125], [-95, -125]]} boja="#BFE3F0" seed={`${seed}-p1`} senka="bez" amp={1.2} />
    <Isecak pts={[[35, -185], [100, -185], [145, -125], [35, -125]]} boja="#BFE3F0" seed={`${seed}-p2`} senka="bez" amp={1.2} />
    <Isecak pts={pravougaonik(220, -90, 30, 22)} boja={P.sunce} seed={`${seed}-f`} senka="bez" amp={0.8} korak={10} />
    {[-150, 150].map((x, i) => (
      <g key={i} transform={`translate(${x} 0) rotate(${tocak})`}>
        <Isecak pts={krugTacke(0, 0, 52, 16)} boja={P.tekst} seed={`${seed}-t${i}`} />
        <Isecak pts={krugTacke(0, 0, 22, 10)} boja={P.siva} seed={`${seed}-tc${i}`} senka="bez" amp={1} />
        <line x1={-20} y1={0} x2={20} y2={0} stroke={P.ivica} strokeWidth={4} />
      </g>
    ))}
  </g>
);

export const Kofer: React.FC<{ seed: string; boja?: string }> = ({ seed, boja = P.zlatna600 }) => (
  <g>
    <Crta pts={[[-26, -80], [-26, -100], [26, -100], [26, -80]]} seed={`${seed}-r`} boja={P.tekst} debljina={8} />
    <Isecak pts={pravougaonik(-80, -80, 160, 110)} boja={boja} seed={`${seed}-k`} />
    <Crta pts={[[-80, -30], [80, -30]]} seed={`${seed}-p`} boja="#00000044" debljina={5} />
  </g>
);

export const Suncobran: React.FC<{ seed: string; visina?: number }> = ({ seed, visina = 360 }) => (
  <g>
    <Crta pts={[[0, 0], [0, -visina]]} seed={`${seed}-s`} boja="#8A5A34" debljina={10} />
    {[P.korala, P.belo, P.korala, P.belo].map((b, i) => (
      <Isecak key={i} pts={[[0, -visina - 40], [-170 + i * 85, -visina + 30], [-85 + i * 85, -visina + 30]]} boja={b} seed={`${seed}-p${i}`} senka={i ? "bez" : "mala"} />
    ))}
  </g>
);

// ── Telefon i oglas ──────────────────────────────────────────────────
export const Telefon: React.FC<{ seed: string; w?: number; h?: number; children?: React.ReactNode; zvoni?: number }> = ({ seed, w = 480, h = 860, children, zvoni = 0 }) => {
  const f = useCurrentFrame();
  const drh = zvoni > 0 ? Math.sin(f * 2.2) * 3 * zvoni : 0;
  return (
    <g transform={`rotate(${drh})`}>
      <Isecak pts={pravougaonik(-w / 2, -h / 2, w, h)} boja={P.tekst} seed={`${seed}-o`} amp={1.6} />
      <Isecak pts={pravougaonik(-w / 2 + 22, -h / 2 + 60, w - 44, h - 120)} boja={P.pozadina} seed={`${seed}-e`} senka="bez" amp={1.2} />
      <Isecak pts={pravougaonik(-w / 2 + 22, -h / 2 + 60, w - 44, 90)} boja={P.zelena700} seed={`${seed}-z`} senka="bez" amp={1.2} />
      <text x={0} y={-h / 2 + 122} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={44} fill={P.belo} letterSpacing={3}>
        KOLO
      </text>
      {children}
    </g>
  );
};

/** Dugme na ekranu telefona. */
export const Dugme: React.FC<{ x: number; y: number; w: number; tekst: string; pritisak?: number; seed: string }> = ({ x, y, w, tekst, pritisak = 0, seed }) => (
  <g transform={`translate(${x} ${y}) scale(${1 - 0.06 * Math.sin(Math.PI * Math.min(1, Math.max(0, pritisak)))})`}>
    <Isecak pts={pravougaonik(-w / 2, -40, w, 80)} boja={P.zelena500} seed={`${seed}-d`} senka="mala" amp={1.2} />
    <text x={0} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill={P.belo}>
      {tekst}
    </text>
  </g>
);

// ── Struja: utičnica, osigurači, sijalica, sveća ─────────────────────
export const Uticnica: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(-60, -60, 120, 120)} boja={P.belo} seed={`${seed}-p`} amp={1.2} />
    <Isecak pts={krugTacke(0, 0, 40, 14)} boja={P.ivica} seed={`${seed}-k`} senka="bez" amp={1} />
    <circle cx={-14} cy={0} r={7} fill={P.tekst} />
    <circle cx={14} cy={0} r={7} fill={P.tekst} />
  </g>
);

export const Osiguraci: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(-80, -110, 160, 220)} boja="#C9CCC6" seed={`${seed}-k`} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <Isecak pts={pravougaonik(-50, -80 + i * 62, 100, 40)} boja={P.belo} seed={`${seed}-o${i}`} senka="bez" amp={1} />
        <Isecak pts={pravougaonik(-12, -72 + i * 62, 24, 24)} boja={i === 1 ? P.korala : P.siva} seed={`${seed}-p${i}`} senka="bez" amp={0.8} korak={10} />
      </g>
    ))}
  </g>
);

export const Sijalica: React.FC<{ seed: string; upaljena: number }> = ({ seed, upaljena }) => {
  const b = useBoil();
  return (
    <g>
      {upaljena > 0 && <circle cx={0} cy={0} r={70 + 20 * upaljena} fill={P.sunce} opacity={0.35 * upaljena} />}
      {upaljena > 0 &&
        Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <path key={i} d={drhtaviPut([[Math.cos(a) * 62, Math.sin(a) * 62], [Math.cos(a) * (62 + 34 * upaljena), Math.sin(a) * (62 + 34 * upaljena)]], `${seed}-z${i}-${b}`, 1.2, 20, false)} stroke={P.zlatna600} strokeWidth={7} strokeLinecap="round" fill="none" />;
        })}
      <Isecak pts={krugTacke(0, 0, 44, 16)} boja={upaljena > 0.3 ? P.sunce : "#E9E6DA"} seed={`${seed}-s`} />
      <Isecak pts={pravougaonik(-22, 38, 44, 34)} boja={P.siva} seed={`${seed}-g`} senka="bez" amp={1} korak={10} />
    </g>
  );
};

export const Sveca: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  const t = 1 + Math.sin(f / 3) * 0.1;
  return (
    <g>
      <Isecak pts={pravougaonik(-18, -90, 36, 90)} boja={P.belo} seed={`${seed}-s`} />
      <g transform={`translate(0 -96) scale(1 ${t})`}>
        <Isecak pts={[[0, -50], [16, -12], [0, 0], [-16, -12]]} boja={P.zlatna400} seed={`${seed}-p`} senka="bez" amp={1} korak={8} />
      </g>
    </g>
  );
};

// ── Ono čega u KOLU nema ─────────────────────────────────────────────
export const Fabrika: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(70, -230, 40, 140)} boja={P.korala600} seed={`${seed}-d`} />
    <Isecak pts={[[-130, 0], [-130, -110], [-70, -150], [-70, -110], [-10, -150], [-10, -110], [50, -150], [50, -110], [130, -110], [130, 0]]} boja={P.siva} seed={`${seed}-z`} />
    {[-90, -30, 30, 90].map((x, i) => (
      <Isecak key={i} pts={pravougaonik(x - 18, -80, 36, 36)} boja={P.sunce} seed={`${seed}-p${i}`} senka="bez" amp={1} korak={10} />
    ))}
  </g>
);

export const Kamion: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={pravougaonik(-150, -150, 210, 120)} boja={P.nebo} seed={`${seed}-p`} />
    <Isecak pts={[[66, -30], [66, -120], [120, -120], [150, -70], [150, -30]]} boja={P.zlatna400} seed={`${seed}-k`} />
    {[-100, 100].map((x, i) => (
      <Isecak key={i} pts={krugTacke(x, -22, 28, 12)} boja={P.tekst} seed={`${seed}-t${i}`} />
    ))}
  </g>
);

// ── Zapis u knjizi evidencije (bez iznosa) ───────────────────────────
export const Evidencija: React.FC<{ seed: string; redovi: { tekst: string; od: number }[] }> = ({ seed, redovi }) => {
  const f = useCurrentFrame();
  const b = useBoil();
  const h = 70 + redovi.length * 72;
  return (
    <g>
      <Isecak pts={pravougaonik(-330, -50, 660, h)} boja={P.belo} seed={`${seed}-k`} amp={1.6} />
      <text x={-306} y={-8} fontFamily={RUKOPIS} fontWeight={700} fontSize={36} fill={P.siva}>
        zapis
      </text>
      <Crta pts={[[-330, 8], [330, 8]]} seed={`${seed}-c`} boja={P.korala} debljina={3} amp={0.6} />
      {redovi.map((r, i) => {
        const p = interpolate(f, [r.od, r.od + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const zig = interpolate(f, [r.od + 14, r.od + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = 64 + i * 72;
        return (
          <g key={i}>
            <Rukopis x={-300} y={y} tekst={r.tekst} napredak={p} velicina={50} />
            {zig > 0 && (
              <g transform={`translate(270 ${y - 16}) rotate(-12) scale(${(1 + (1 - zig) * 0.8).toFixed(3)})`} opacity={zig}>
                <path d={drhtaviPut(krugTacke(0, 0, 40, 18), `${seed}-z${i}-${b}`, 1.4)} fill="none" stroke={P.zelena700} strokeWidth={5} />
                <text x={0} y={9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={24} fill={P.zelena700}>
                  POEN
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** Ram sličice (vinjeta) sa papirnom ivicom. */
export const Vinjeta: React.FC<{ seed: string; x: number; y: number; w: number; h: number; boja?: string; children?: React.ReactNode }> = ({ seed, x, y, w, h, boja = "#F7E9C8", children }) => {
  const id = `vin-${seed}`;
  return (
    <g>
      <Isecak pts={pravougaonik(x - 12, y - 12, w + 24, h + 24)} boja={P.belo} seed={`${seed}-r`} amp={2} />
      <Isecak pts={pravougaonik(x, y, w, h)} boja={boja} seed={`${seed}-p`} senka="bez" amp={1.4} />
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

export type { Pt };
