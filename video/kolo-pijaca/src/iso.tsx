// Alat izometrijske ilustracije: projekcija, kocke, tezge, tegle, kartice ispisane rukom, likovi.
// Svet je u pikselima: x ide desno-dole, y levo-dole, z naviše. Sve je SVG u prostoru 1080×1920.
import React, { createContext, useContext } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P, svetlije, tamnije } from "./paleta";
import { RUKOPIS, SANS } from "./fontovi";

// Scena se renderuje nekoliko frejmova pre svog početka (prelaz); animacije se kače na frejm
// u odnosu na početak scene iz plana.
export const PomakCtx = createContext(0);
export const useF = () => useCurrentFrame() - useContext(PomakCtx);

export const COS = Math.cos(Math.PI / 6);
export const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * COS, (x + y) * 0.5 - z];
const tacke = (pts: [number, number, number][]) => pts.map((p) => iso(...p).map((v) => v.toFixed(1)).join(",")).join(" ");

/** 0→1 između frejmova a i b, sa blagim ulazom i izlazom. */
export const napredak = (f: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

/** Uskakanje sa odskokom (0→1) od frejma `od`. */
export const usePop = (od: number, krutost = 180) => {
  const f = useF();
  const { fps } = useVideoConfig();
  return f < od ? 0 : spring({ frame: f - od, fps, config: { damping: 11, stiffness: krutost, mass: 0.7 } });
};

export const Pop: React.FC<{ od: number; x: number; y: number; children: React.ReactNode; krutost?: number }> = ({ od, x, y, children, krutost }) => {
  const s = usePop(od, krutost);
  if (s <= 0.001) return null;
  return <g transform={`translate(${x},${y}) scale(${s})`}>{children}</g>;
};

/** Kamera: tačka sveta (x, y) dolazi u središte kadra (540, cy), uz uvećanje z. */
export const Kamera: React.FC<{ x: number; y: number; z?: number; cy?: number; children: React.ReactNode }> = ({ x, y, z = 1, cy = 760, children }) => (
  <g transform={`translate(540,${cy}) scale(${z}) translate(${-x},${-y})`}>{children}</g>
);

/** Kvadar: gornja strana u boji, leva i desna strana tamnije. */
export const Kocka: React.FC<{ x: number; y: number; z?: number; w: number; d: number; h: number; boja: string; ivica?: boolean; leva?: string; desna?: string }> = ({
  x, y, z = 0, w, d, h, boja, ivica = true, leva, desna,
}) => {
  const s = ivica ? { stroke: tamnije(boja, 0.45), strokeWidth: 1.5, strokeLinejoin: "round" as const } : {};
  return (
    <g>
      <polygon points={tacke([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={leva ?? tamnije(boja, 0.14)} {...s} />
      <polygon points={tacke([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={desna ?? tamnije(boja, 0.28)} {...s} />
      <polygon points={tacke([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={boja} {...s} />
    </g>
  );
};

/** Ravna ploča na tlu. */
export const Ploca: React.FC<{ x: number; y: number; w: number; d: number; boja: string; z?: number; opacity?: number }> = ({ x, y, w, d, boja, z = 0, opacity = 1 }) => (
  <polygon points={tacke([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])} fill={boja} opacity={opacity} />
);

/** Kaldrma: ploča sa pravilnom mrežom kamenih kocki. */
export const Kaldrma: React.FC<{ x: number; y: number; w: number; d: number; korak?: number }> = ({ x, y, w, d, korak = 60 }) => {
  const linije: React.ReactNode[] = [];
  for (let i = korak; i < w; i += korak) linije.push(<polyline key={`a${i}`} points={tacke([[x + i, y, 0], [x + i, y + d, 0]])} />);
  for (let j = korak; j < d; j += korak) linije.push(<polyline key={`b${j}`} points={tacke([[x, y + j, 0], [x + w, y + j, 0]])} />);
  return (
    <g>
      <Ploca x={x} y={y} w={w} d={d} boja={P.kaldrma} />
      <g stroke={P.kaldrmaLinija} strokeWidth={2} fill="none">{linije}</g>
    </g>
  );
};

/** Senka ispod predmeta (elipsa u ravni tla). */
export const Senka: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 0.18 }) => {
  const [sx, sy] = iso(x, y);
  return <ellipse cx={sx} cy={sy} rx={r} ry={r * 0.5} fill={P.senka} opacity={o} />;
};

// ── Tegla pekmeza (u ekranskom prostoru, dno u 0,0) ───────────────────────
export const Tegla: React.FC<{ s?: number; prasina?: number; natpis?: boolean; sadrzaj?: string }> = ({ s = 1, prasina = 0, natpis = true, sadrzaj = P.pekmez }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={0} rx={26} ry={8} fill={P.senka} opacity={0.18} />
    <path d="M-22,-6 Q-24,-46 -18,-58 L18,-58 Q24,-46 22,-6 Q0,4 -22,-6 Z" fill={sadrzaj} stroke={tamnije(sadrzaj, 0.4)} strokeWidth={2} />
    <path d="M-14,-52 Q-17,-30 -13,-12" stroke="#fff" strokeOpacity={0.45} strokeWidth={5} fill="none" strokeLinecap="round" />
    <rect x={-20} y={-72} width={40} height={14} rx={3} fill={P.poklopac} stroke={tamnije(P.poklopac, 0.4)} strokeWidth={2} />
    <rect x={-20} y={-66} width={40} height={3} fill={tamnije(P.poklopac, 0.2)} />
    {natpis && (
      <g>
        <rect x={-16} y={-42} width={32} height={18} rx={2} fill={P.krem} stroke={tamnije(P.krem, 0.3)} strokeWidth={1} />
        <path d="M-11,-33 q4,-5 8,0 t8,0 t6,-1" stroke={P.pekmez} strokeWidth={2} fill="none" />
      </g>
    )}
    {prasina > 0 && (
      <g opacity={prasina}>
        <path d="M-22,-6 Q-24,-46 -18,-58 L18,-58 Q24,-46 22,-6 Q0,4 -22,-6 Z" fill="#9C9486" opacity={0.65} />
        <rect x={-20} y={-72} width={40} height={14} rx={3} fill="#9C9486" opacity={0.7} />
        <path d="M18,-72 l14,-16 M18,-64 l18,-6 M20,-72 q8,-4 14,4" stroke="#fff" strokeOpacity={0.7} strokeWidth={1.2} fill="none" />
      </g>
    )}
  </g>
);

/** Industrijski džem (fabrička tegla sa etiketom, bez marke). */
export const Dzem: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-20} y={-56} width={40} height={56} rx={6} fill="#C0392B" stroke="#7B241C" strokeWidth={2} />
    <rect x={-20} y={-44} width={40} height={26} fill="#F4F6F7" />
    <text x={0} y={-26} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={12} fill="#7B241C">DŽEM</text>
    <rect x={-21} y={-66} width={42} height={11} rx={2} fill="#BDC3C7" stroke="#7F8C8D" strokeWidth={1.5} />
  </g>
);

// ── Kartica oglasa ispisana rukom (ekranski prostor, gornja ivica na sredini u 0,0) ──
export const Kartica: React.FC<{ redovi: string[]; s?: number; rot?: number; sirina?: number; boja?: string; pecat?: number; sjaj?: number }> = ({
  redovi, s = 1, rot = -3, sirina = 230, boja = P.krem, pecat = 0, sjaj = 0,
}) => {
  const vis = 40 + redovi.length * 38;
  return (
    <g transform={`scale(${s}) rotate(${rot})`}>
      {sjaj > 0 && <rect x={-sirina / 2 - 24} y={-24} width={sirina + 48} height={vis + 48} rx={30} fill={P.zelena500} opacity={0.35 * sjaj} filter="url(#meko)" />}
      <rect x={-sirina / 2 + 5} y={7} width={sirina} height={vis} rx={10} fill={P.senka} opacity={0.18} />
      <rect x={-sirina / 2} y={0} width={sirina} height={vis} rx={10} fill={boja} stroke={sjaj > 0 ? P.zelena500 : tamnije(boja, 0.18)} strokeWidth={sjaj > 0 ? 4 : 2} />
      <circle cx={0} cy={12} r={6} fill={P.crvena} stroke={tamnije(P.crvena, 0.4)} strokeWidth={1.5} />
      {redovi.map((r, i) => (
        <text key={i} x={0} y={52 + i * 38} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={i === 0 ? 36 : 30} fill={i === 0 ? P.mastilo : P.mastiloSvetlo}>
          {r}
        </text>
      ))}
      {pecat > 0 && (
        <g transform={`translate(${sirina / 2 - 40},${-4}) rotate(14) scale(${(0.6 + 0.4 * pecat) * 1.05})`} opacity={pecat}>
          <rect x={-72} y={-20} width={144} height={36} rx={6} fill="#FFF8E6" stroke="#C98A0B" strokeWidth={4} />
          <text x={0} y={7} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={19} letterSpacing={1.5} fill="#C98A0B">BEZ POTVRDE</text>
        </g>
      )}
    </g>
  );
};

// ── Tezga: sto, četiri stuba, prugasta tenda, roba i kartica ────────────────
export const Tezga: React.FC<{
  x: number; y: number; boja: string; roba?: React.ReactNode; kartica?: React.ReactNode; w?: number; d?: number; svetlo?: number;
}> = ({ x, y, boja, roba, kartica, w = 170, d = 100, svetlo = 0 }) => {
  const h = 78;
  const vrh = 175;
  const stub = (sx: number, sy: number) => <Kocka x={sx} y={sy} z={0} w={6} d={6} h={vrh} boja={P.drvoTamno} ivica={false} />;
  // tenda: kosa ravan od zadnje ivice (više) ka prednjoj (niže), sa prugama po x
  const pruge: React.ReactNode[] = [];
  const N = 6;
  for (let i = 0; i < N; i++) {
    const x0 = x - 10 + ((w + 20) * i) / N;
    const x1 = x - 10 + ((w + 20) * (i + 1)) / N;
    const c = i % 2 ? P.belo : boja;
    pruge.push(<polygon key={i} points={tacke([[x0, y - 10, vrh + 30], [x1, y - 10, vrh + 30], [x1, y + d + 18, vrh - 6], [x0, y + d + 18, vrh - 6]])} fill={c} stroke={tamnije(boja, 0.35)} strokeWidth={1.2} />);
    // nabrani rub
    const [ax, ay] = iso(x0, y + d + 18, vrh - 6);
    const [bx, by] = iso(x1, y + d + 18, vrh - 6);
    pruge.push(<path key={`r${i}`} d={`M${ax},${ay} Q${(ax + bx) / 2},${(ay + by) / 2 + 22} ${bx},${by} Z`} fill={c} stroke={tamnije(boja, 0.35)} strokeWidth={1.2} />);
  }
  const [rx, ry] = iso(x + w / 2, y + d / 2, h);
  const [kx, ky] = iso(x + w / 2, y + d + 2, h - 6);
  return (
    <g>
      <Senka x={x + w / 2} y={y + d / 2 + 20} r={w * 0.9} o={0.12} />
      {stub(x, y)}
      {stub(x + w - 6, y)}
      <Kocka x={x} y={y} w={w} d={d} h={h} boja={P.drvo} />
      {svetlo > 0 && <ellipse cx={rx} cy={ry - 30} rx={130} ry={90} fill={P.zuta} opacity={0.45 * svetlo} filter="url(#meko)" />}
      {roba && <g transform={`translate(${rx},${ry + 6})`}>{roba}</g>}
      {stub(x, y + d - 6)}
      {stub(x + w - 6, y + d - 6)}
      {pruge}
      {kartica && <g transform={`translate(${kx},${ky - 18})`}>{kartica}</g>}
    </g>
  );
};

// ── Kuća (izometrijska, krov na dve vode) ─────────────────────────────────
export const Kuca: React.FC<{ x: number; y: number; w?: number; d?: number; h?: number; zid?: string; krov?: string; svetlo?: number }> = ({
  x, y, w = 120, d = 100, h = 80, zid = "#FCE8C8", krov = P.crvena, svetlo = 0,
}) => {
  const k = 55;
  const [px, py] = iso(x + w, y + d * 0.35, 40);
  const [ox, oy] = iso(x + w * 0.4, y + d, 34);
  return (
    <g>
      <Senka x={x + w / 2} y={y + d / 2 + 12} r={w} o={0.1} />
      <Kocka x={x} y={y} w={w} d={d} h={h} boja={zid} />
      {/* krov: dve kose ravni duž x */}
      <polygon points={tacke([[x - 8, y + d / 2, h + k], [x + w + 8, y + d / 2, h + k], [x + w + 8, y + d + 10, h - 6], [x - 8, y + d + 10, h - 6]])} fill={tamnije(krov, 0.08)} stroke={tamnije(krov, 0.45)} strokeWidth={1.5} />
      <polygon points={tacke([[x + w + 8, y - 10, h - 6], [x + w + 8, y + d / 2, h + k], [x + w + 8, y + d + 10, h - 6]])} fill={tamnije(krov, 0.3)} stroke={tamnije(krov, 0.45)} strokeWidth={1.5} />
      <polygon points={tacke([[x + w, y, h], [x + w, y + d / 2, h + k - 6], [x + w, y + d, h]])} fill={tamnije(zid, 0.32)} />
      {/* prozor na desnoj strani, vrata na levoj */}
      <g transform={`translate(${px},${py})`}>
        <path d="M0,0 l18,-10 l0,-24 l-18,10 Z" fill={svetlo > 0 ? svetlije(P.zuta, 0.3 * (1 - svetlo)) : "#9FC6DD"} stroke={tamnije(zid, 0.5)} strokeWidth={1.5} />
        {svetlo > 0 && <ellipse cx={9} cy={-17} rx={34} ry={30} fill={P.zuta} opacity={0.5 * svetlo} filter="url(#meko)" />}
      </g>
      <g transform={`translate(${ox},${oy})`}>
        <path d="M0,0 l-18,-9 l0,-34 l18,9 Z" fill={P.drvoTamno} />
      </g>
    </g>
  );
};

export const Drvo: React.FC<{ x: number; y: number; s?: number; boja?: string }> = ({ x, y, s = 1, boja = P.trava }) => {
  const [sx, sy] = iso(x, y);
  return (
    <g transform={`translate(${sx},${sy}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={30} ry={14} fill={P.senka} opacity={0.12} />
      <rect x={-5} y={-40} width={10} height={40} fill={P.drvoTamno} />
      <circle cx={0} cy={-70} r={38} fill={boja} stroke={tamnije(boja, 0.3)} strokeWidth={2} />
      <circle cx={-14} cy={-82} r={14} fill={svetlije(boja, 0.25)} />
    </g>
  );
};

// ── Lik (ekranski prostor, stopala u 0,0) ──────────────────────────────────
export type LikOpis = {
  odeca: string; kosa: string; marama?: string; kapa?: string; kecelja?: string; visina?: number; dete?: boolean;
  ruka?: number; // ugao desne ruke (0 = niz telo, 1 = ispružena napred)
  hod?: number; // faza koraka
  okrenut?: 1 | -1;
};

export const Lik: React.FC<LikOpis & { s?: number }> = ({ odeca, kosa, marama, kapa, kecelja, visina = 1, dete, ruka = 0, hod = 0, okrenut = 1, s = 1 }) => {
  const H = (dete ? 0.68 : 1) * visina;
  const korak = Math.sin(hod) * 8;
  const t = 92 * H; // telo
  return (
    <g transform={`scale(${s * okrenut},${s})`}>
      <ellipse cx={0} cy={0} rx={26 * H} ry={9 * H} fill={P.senka} opacity={0.18} />
      {/* noge */}
      <rect x={-12 * H} y={-46 * H + Math.max(0, -korak)} width={9 * H} height={46 * H - Math.max(0, -korak)} rx={4} fill={P.mastilo} />
      <rect x={3 * H} y={-46 * H + Math.max(0, korak)} width={9 * H} height={46 * H - Math.max(0, korak)} rx={4} fill={P.mastilo} />
      {/* telo */}
      <path d={`M${-20 * H},${-40 * H} Q${-22 * H},${-t - 6} ${-10 * H},${-t - 10 * H} L${10 * H},${-t - 10 * H} Q${22 * H},${-t - 6} ${20 * H},${-40 * H} Z`} fill={odeca} stroke={tamnije(odeca, 0.35)} strokeWidth={2} />
      {kecelja && <path d={`M${-13 * H},${-44 * H} L${-11 * H},${-t + 14 * H} L${11 * H},${-t + 14 * H} L${13 * H},${-44 * H} Z`} fill={kecelja} opacity={0.95} />}
      {/* leva ruka */}
      <rect x={-27 * H} y={-t - 4 * H} width={9 * H} height={44 * H} rx={4.5 * H} fill={tamnije(odeca, 0.1)} transform={`rotate(${6 - korak * 0.6} ${-22 * H} ${-t})`} />
      {/* desna ruka (pruža se) */}
      <g transform={`rotate(${-8 - ruka * 80 + korak * 0.6} ${22 * H} ${-t - 2 * H})`}>
        <rect x={18 * H} y={-t - 4 * H} width={9 * H} height={44 * H} rx={4.5 * H} fill={tamnije(odeca, 0.1)} />
        <circle cx={22.5 * H} cy={-t + 42 * H} r={6 * H} fill={P.koza} />
      </g>
      {/* glava */}
      <rect x={-5 * H} y={-t - 18 * H} width={10 * H} height={10 * H} fill={P.koza2} />
      <circle cx={0} cy={-t - 34 * H} r={19 * H} fill={P.koza} stroke={P.koza2} strokeWidth={1.5} />
      {marama ? (
        <path d={`M${-21 * H},${-t - 30 * H} Q${-22 * H},${-t - 60 * H} 0,${-t - 58 * H} Q${22 * H},${-t - 60 * H} ${21 * H},${-t - 30 * H} Q${12 * H},${-t - 44 * H} 0,${-t - 46 * H} Q${-12 * H},${-t - 44 * H} ${-21 * H},${-t - 30 * H} Z`} fill={marama} stroke={tamnije(marama, 0.35)} strokeWidth={1.5} />
      ) : (
        <path d={`M${-19 * H},${-t - 32 * H} Q${-20 * H},${-t - 56 * H} 0,${-t - 55 * H} Q${20 * H},${-t - 56 * H} ${19 * H},${-t - 32 * H} Q${10 * H},${-t - 46 * H} ${-19 * H},${-t - 32 * H} Z`} fill={kosa} />
      )}
      {kapa && <path d={`M${-20 * H},${-t - 44 * H} Q0,${-t - 66 * H} ${20 * H},${-t - 44 * H} L${30 * H},${-t - 42 * H} L${-20 * H},${-t - 40 * H} Z`} fill={kapa} stroke={tamnije(kapa, 0.35)} strokeWidth={1.5} />}
      {/* lice */}
      <circle cx={6 * H} cy={-t - 34 * H} r={2.3 * H} fill={P.mastilo} />
      <circle cx={-6 * H} cy={-t - 34 * H} r={2.3 * H} fill={P.mastilo} />
      <path d={`M${-5 * H},${-t - 25 * H} q5,4 10,0`} stroke={P.mastilo} strokeWidth={2} fill="none" strokeLinecap="round" />
      <circle cx={11 * H} cy={-t - 28 * H} r={4 * H} fill={P.roze} opacity={0.4} />
      <circle cx={-11 * H} cy={-t - 28 * H} r={4 * H} fill={P.roze} opacity={0.4} />
    </g>
  );
};

export const RADA: LikOpis = { odeca: P.rada, kosa: P.kosaSeda, marama: P.radaMarama, kecelja: P.krem };
export const MUZ: LikOpis = { odeca: P.tirkiz, kosa: P.kosaSeda, kapa: "#6B7A8F" };
export const DEJAN: LikOpis = { odeca: P.dejan, kosa: P.kosaTamna, kapa: P.dejanKapa };

/** Lik postavljen u svet (x, y) izometrije. */
export const LikU: React.FC<LikOpis & { x: number; y: number; s?: number }> = ({ x, y, s = 1, ...o }) => {
  const [sx, sy] = iso(x, y);
  return (
    <g transform={`translate(${sx},${sy})`}>
      <Lik {...o} s={s} />
    </g>
  );
};

/** Natpis na vrhu kadra (zaobljena traka). */
export const Natpis: React.FC<{ tekst: string; y?: number; o?: number; boja?: string }> = ({ tekst, y = 170, o = 1, boja = P.mastilo }) => (
  <g opacity={o} transform={`translate(540,${y + (1 - o) * 20})`}>
    <rect x={-470} y={-52} width={940} height={96} rx={48} fill={P.belo} opacity={0.94} />
    <text x={0} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={42} fill={boja}>{tekst}</text>
  </g>
);

/** Zajedničke definicije filtera. */
export const Defs: React.FC = () => (
  <defs>
    <filter id="meko" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" />
    </filter>
    <filter id="senkaMeka" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor={P.senka} floodOpacity="0.25" />
    </filter>
  </defs>
);
