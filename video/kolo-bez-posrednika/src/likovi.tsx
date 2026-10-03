// Likovi slikovnice: Milica, muž, deca, komšije, mladići. Crtani oko stopala (0,0), visina odraslog ~660.
// Glava i ruke su parametarske: izraz lica, pogled, uglovi ruku (0° = ruka visi, 90° = pruža se udesno).
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Linija, Oblik, elipsa } from "./alat";

// ── Glava ────────────────────────────────────────────────────────────────
export type Izraz = "osmeh" | "srecna" | "tuzna" | "zamisljena" | "odlucna" | "iznenadjena" | "mirna";
export type Kosa = "seda_punda" | "muz_sed" | "kacket" | "mlad" | "rep" | "marama" | "decak" | "devojcica" | "mlad2";

export type GlavaCfg = {
  kosa: Kosa;
  izraz?: Izraz;
  pogled?: [number, number];
  naocare?: boolean;
  brkovi?: boolean;
  bojaKose?: string;
  koza?: string;
  seed?: number;
  zmurka?: boolean;
  usta?: number; // 0–1 otvorenost (govor)
};

const KosaIza: React.FC<{ kosa: Kosa; boja: string }> = ({ kosa, boja }) => {
  switch (kosa) {
    case "seda_punda":
      return (
        <>
          <Oblik d={elipsa(0, -6, 90, 88)} boja={boja} />
          <Oblik d={elipsa(0, -104, 38, 32)} boja={boja} />
          <Linija d="M-22,-112 Q0,-126 22,-110" debljina={3} opacity={0.6} />
          <Linija d="M-18,-96 Q2,-86 24,-98" debljina={3} opacity={0.5} />
        </>
      );
    case "rep":
      return <Oblik d="M60,-40 C110,-30 118,40 96,96 C84,60 70,20 52,0Z" boja={boja} />;
    case "devojcica":
      return (
        <>
          <Oblik d="M-70,-10 C-100,20 -96,70 -78,96 C-70,60 -62,30 -56,10Z" boja={boja} />
          <Oblik d="M70,-10 C100,20 96,70 78,96 C70,60 62,30 56,10Z" boja={boja} />
        </>
      );
    case "marama":
      return <Oblik d="M-86,-20 C-96,-80 -50,-112 0,-112 C50,-112 96,-80 86,-20 C92,30 70,76 40,92 L-40,92 C-70,76 -92,30 -86,-20Z" boja={boja} />;
    default:
      return null;
  }
};

const KosaIspred: React.FC<{ kosa: Kosa; boja: string }> = ({ kosa, boja }) => {
  switch (kosa) {
    case "seda_punda":
      return (
        <>
          <Oblik d="M-80,-4 C-88,-66 -44,-100 0,-98 C44,-100 88,-66 80,-4 C70,-36 52,-50 30,-52 C14,-40 -12,-40 -26,-54 C-50,-50 -70,-36 -80,-4Z" boja={boja} />
          <Linija d="M-50,-78 Q-30,-66 -20,-56" debljina={2.5} opacity={0.5} />
          <Linija d="M40,-80 Q30,-66 20,-58" debljina={2.5} opacity={0.5} />
        </>
      );
    case "muz_sed":
      return (
        <>
          <Oblik d="M-80,0 C-86,-30 -78,-60 -56,-74 C-58,-50 -64,-30 -68,4Z" boja={boja} />
          <Oblik d="M80,0 C86,-30 78,-60 56,-74 C58,-50 64,-30 68,4Z" boja={boja} />
          <Oblik d="M-56,-74 C-30,-94 30,-94 56,-74 C30,-80 -30,-80 -56,-74Z" boja={boja} />
        </>
      );
    case "kacket":
      return (
        <>
          <Oblik d="M-82,-28 C-84,-78 -40,-104 6,-102 C50,-100 84,-74 82,-28 C50,-40 -50,-40 -82,-28Z" boja={P.drvoTamno} />
          <Oblik d="M-10,-34 C30,-44 90,-44 118,-26 C96,-18 40,-18 -10,-26Z" boja={P.drvoTamno} />
          <Linija d="M-60,-60 Q0,-80 60,-60" debljina={2.5} opacity={0.4} />
        </>
      );
    case "mlad":
    case "mlad2":
      return (
        <Oblik
          d="M-82,-8 C-92,-70 -48,-106 4,-104 C56,-104 94,-70 82,-8 C74,-34 64,-44 48,-48 L40,-30 L28,-52 C12,-46 -4,-48 -16,-58 L-22,-36 L-36,-54 C-56,-48 -70,-34 -82,-8Z"
          boja={boja}
        />
      );
    case "rep":
    case "devojcica":
      return <Oblik d="M-80,-6 C-88,-70 -44,-102 2,-102 C48,-102 88,-70 80,-6 C60,-50 20,-62 -4,-60 C-30,-58 -62,-44 -80,-6Z" boja={boja} />;
    case "decak":
      return <Oblik d="M-78,-10 C-86,-66 -44,-98 2,-98 C48,-98 86,-66 78,-10 C60,-40 44,-50 20,-48 L10,-34 L0,-50 C-24,-52 -56,-44 -78,-10Z" boja={boja} />;
    case "marama":
      return (
        <>
          <Oblik d="M-78,-8 C-80,-70 -44,-100 0,-100 C44,-100 80,-70 78,-8 C60,-40 30,-50 0,-50 C-30,-50 -60,-40 -78,-8Z" boja={P.ajvar} />
          {[-40, 0, 40].map((x, i) => (
            <circle key={i} cx={x} cy={-74 + Math.abs(x) * 0.2} r={7} fill={P.krem} opacity={0.85} />
          ))}
          <Oblik d="M-20,84 L0,70 L20,84 L8,110 L-8,110Z" boja={P.ajvar} debljina={3} />
        </>
      );
  }
};

export const Glava: React.FC<GlavaCfg> = ({
  kosa,
  izraz = "osmeh",
  pogled = [0, 0],
  naocare,
  brkovi,
  bojaKose = P.kosaSeda,
  koza = P.koza,
  seed = 0,
  zmurka,
  usta = 0,
}) => {
  const f = useCurrentFrame();
  const trep = zmurka || (f + seed * 29) % 110 < 4;
  const [gx, gy] = pogled;
  const zatvorene = trep || izraz === "srecna";
  // obrve
  const obrve =
    izraz === "tuzna"
      ? ["M-44,-34 Q-30,-40 -14,-30", "M14,-30 Q30,-40 44,-34"]
      : izraz === "odlucna"
        ? ["M-44,-36 Q-30,-32 -14,-28", "M14,-28 Q30,-32 44,-36"]
        : izraz === "iznenadjena"
          ? ["M-44,-42 Q-30,-52 -14,-44", "M14,-44 Q30,-52 44,-42"]
          : ["M-44,-36 Q-30,-44 -14,-38", "M14,-38 Q30,-44 44,-36"];
  // usta
  let ustaD = "M-18,34 Q0,48 18,34";
  if (izraz === "srecna") ustaD = "M-22,30 Q0,56 22,30";
  if (izraz === "tuzna") ustaD = "M-16,42 Q0,32 16,42";
  if (izraz === "zamisljena" || izraz === "mirna") ustaD = "M-12,38 Q2,40 14,37";
  if (izraz === "odlucna") ustaD = "M-16,38 L16,38";
  return (
    <g>
      <KosaIza kosa={kosa} boja={bojaKose} />
      {/* uši */}
      <Oblik d={elipsa(-76, 6, 12, 18)} boja={koza} debljina={3} tekstura={0} />
      <Oblik d={elipsa(76, 6, 12, 18)} boja={koza} debljina={3} tekstura={0} />
      <Oblik d="M-76,0 C-80,-60 -44,-88 0,-88 C44,-88 80,-60 76,0 C74,54 40,84 0,84 C-40,84 -74,54 -76,0Z" boja={koza} tekstura={0.18} />
      <circle cx={-44} cy={22} r={20} fill="url(#obrazG)" />
      <circle cx={44} cy={22} r={20} fill="url(#obrazG)" />
      {/* oči */}
      {zatvorene ? (
        izraz === "srecna" && !trep ? (
          <>
            <Linija d={`M-40,${-6} Q-28,-18 -16,-6`} debljina={4.5} />
            <Linija d={`M16,-6 Q28,-18 40,-6`} debljina={4.5} />
          </>
        ) : (
          <>
            <Linija d="M-40,-4 Q-28,2 -16,-4" debljina={4} />
            <Linija d="M16,-4 Q28,2 40,-4" debljina={4} />
          </>
        )
      ) : (
        <>
          <ellipse cx={-28 + gx * 5} cy={-6 + gy * 4} rx={6.5} ry={izraz === "iznenadjena" ? 10 : 8.5} fill={P.mastilo} />
          <ellipse cx={28 + gx * 5} cy={-6 + gy * 4} rx={6.5} ry={izraz === "iznenadjena" ? 10 : 8.5} fill={P.mastilo} />
          <circle cx={-26 + gx * 5} cy={-9 + gy * 4} r={2} fill="#fff" />
          <circle cx={30 + gx * 5} cy={-9 + gy * 4} r={2} fill="#fff" />
        </>
      )}
      {izraz === "tuzna" && !zatvorene && (
        <>
          <Linija d="M-40,-16 Q-28,-20 -16,-15" debljina={2.5} opacity={0.6} />
          <Linija d="M16,-15 Q28,-20 40,-16" debljina={2.5} opacity={0.6} />
        </>
      )}
      <Linija d={obrve[0]} debljina={3.5} boja={kosa === "seda_punda" || kosa === "muz_sed" ? P.kosaSedaTamna : P.mastilo} />
      <Linija d={obrve[1]} debljina={3.5} boja={kosa === "seda_punda" || kosa === "muz_sed" ? P.kosaSedaTamna : P.mastilo} />
      {/* nos */}
      <Linija d="M-4,4 Q-10,18 0,20 Q6,20 8,16" debljina={3.2} opacity={0.75} />
      {/* usta */}
      {usta > 0.05 ? (
        <Oblik d={`M-12,36 Q0,${36 + 22 * usta} 12,36 Q0,${30} -12,36Z`} boja={P.ajvarTamni} debljina={2.5} tekstura={0} />
      ) : izraz === "iznenadjena" ? (
        <Oblik d={elipsa(0, 40, 8, 10)} boja={P.ajvarTamni} debljina={2.5} tekstura={0} />
      ) : (
        <Linija d={ustaD} debljina={4} />
      )}
      {brkovi && <Oblik d="M-34,30 C-24,14 -6,16 0,24 C6,16 24,14 34,30 C22,26 10,28 0,30 C-10,28 -22,26 -34,30Z" boja={P.kosaSedaTamna} debljina={3} />}
      {naocare && (
        <g fill="none" stroke={P.mastilo} strokeWidth={3.5}>
          <circle cx={-28} cy={-6} r={20} fill="#fff" fillOpacity={0.12} />
          <circle cx={28} cy={-6} r={20} fill="#fff" fillOpacity={0.12} />
          <path d="M-8,-8 Q0,-12 8,-8" />
          <path d="M-48,-8 L-72,-14" />
          <path d="M48,-8 L72,-14" />
        </g>
      )}
      <KosaIspred kosa={kosa} boja={bojaKose} />
    </g>
  );
};

// ── Ruka ─────────────────────────────────────────────────────────────────
const rad = (a: number) => (a * Math.PI) / 180;
export const zglobovi = (sx: number, sy: number, a1: number, a2: number, d1 = 118, d2 = 108) => {
  const e: [number, number] = [sx + Math.sin(rad(a1)) * d1, sy + Math.cos(rad(a1)) * d1];
  const h: [number, number] = [e[0] + Math.sin(rad(a1 + a2)) * d2, e[1] + Math.cos(rad(a1 + a2)) * d2];
  return { e, h };
};

export const Ruka: React.FC<{
  sx: number;
  sy: number;
  a1: number;
  a2: number;
  rukav: string;
  koza?: string;
  sirina?: number;
  d1?: number;
  d2?: number;
  drzi?: React.ReactNode;
  drziRot?: number;
}> = ({ sx, sy, a1, a2, rukav, koza = P.koza, sirina = 40, d1 = 118, d2 = 108, drzi, drziRot = 0 }) => {
  const { e, h } = zglobovi(sx, sy, a1, a2, d1, d2);
  const d = `M${sx},${sy} L${e[0].toFixed(1)},${e[1].toFixed(1)} L${h[0].toFixed(1)},${h[1].toFixed(1)}`;
  // rukav do šake, šaka malo izvirí
  const ug = a1 + a2;
  const hk: [number, number] = [h[0] - Math.sin(rad(ug)) * 16, h[1] - Math.cos(rad(ug)) * 16];
  const dr = `M${sx},${sy} L${e[0].toFixed(1)},${e[1].toFixed(1)} L${hk[0].toFixed(1)},${hk[1].toFixed(1)}`;
  return (
    <g>
      <path d={dr} fill="none" stroke={P.mastilo} strokeWidth={sirina + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={dr} fill="none" stroke={rukav} strokeWidth={sirina} strokeLinecap="round" strokeLinejoin="round" />
      <path d={dr} fill="none" stroke="url(#gvasS)" strokeWidth={sirina} strokeLinecap="round" strokeLinejoin="round" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
      <Oblik d={elipsa(h[0], h[1], 21, 20)} boja={koza} debljina={3.5} tekstura={0} />
      {drzi && <g transform={`translate(${h[0].toFixed(1)} ${h[1].toFixed(1)}) rotate(${drziRot})`}>{drzi}</g>}
      <path d={d} fill="none" stroke="none" />
    </g>
  );
};

// ── Telo ─────────────────────────────────────────────────────────────────
export type Poza = {
  lr?: [number, number]; // leva ruka (sa tačke gledaoca) a1, a2
  dr?: [number, number];
  hod?: number; // faza hoda u radijanima; undefined = stoji
  nagib?: number; // nagib tela (stepeni)
  glavaNagib?: number;
  drziL?: React.ReactNode;
  drziD?: React.ReactNode;
  drziLRot?: number;
  drziDRot?: number;
  ispredRuku?: React.ReactNode; // predmet između tela i prednje ruke (npr. lonac)
};

type Odeca =
  | { tip: "haljina"; haljina: string; dzemper?: string; kecelja?: boolean }
  | { tip: "muski"; kosulja: string; pantalone: string; prsluk?: string; kaput?: boolean }
  | { tip: "suknja"; bluza: string; suknja: string };

export const Lik: React.FC<
  Poza & {
    x: number;
    y: number;
    s?: number;
    okreni?: boolean;
    odeca: Odeca;
    glava: GlavaCfg;
    dete?: boolean;
    cipele?: string;
  }
> = ({ x, y, s = 1, okreni, odeca, glava, lr = [12, 8], dr = [-12, -8], hod, nagib = 0, glavaNagib = 0, drziL, drziD, drziLRot, drziDRot, ispredRuku, dete, cipele = P.drvoTamno }) => {
  const f = useCurrentFrame();
  const hodA = hod === undefined ? 0 : Math.sin(hod) * 20;
  const bob = hod === undefined ? Math.sin((f + (glava.seed ?? 0) * 13) / 40) * 2 : Math.abs(Math.cos(hod)) * -8;
  const koza = glava.koza ?? P.koza;
  const rukav =
    odeca.tip === "haljina" ? odeca.dzemper ?? odeca.haljina : odeca.tip === "muski" ? (odeca.kaput ? odeca.pantalone : odeca.kosulja) : odeca.bluza;
  const noga = (strana: number, ugao: number) => {
    const donja = odeca.tip === "muski" ? odeca.pantalone : koza;
    const vrh = odeca.tip === "muski" ? -330 : -170;
    return (
      <g transform={`translate(${strana * 34} ${vrh}) rotate(${ugao})`}>
        <path d={`M0,0 L0,${-vrh - 26}`} stroke={P.mastilo} strokeWidth={odeca.tip === "muski" ? 58 : 34} strokeLinecap="round" />
        <path d={`M0,0 L0,${-vrh - 26}`} stroke={donja} strokeWidth={odeca.tip === "muski" ? 50 : 26} strokeLinecap="round" />
        <Oblik d={`M-20,${-vrh - 30} C-22,${-vrh - 8} -12,${-vrh + 2} 14,${-vrh + 2} C40,${-vrh + 2} 44,${-vrh - 12} 30,${-vrh - 24} C18,${-vrh - 34} -6,${-vrh - 36} -20,${-vrh - 30}Z`} boja={cipele} debljina={3.5} tekstura={0.2} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${okreni ? -s : s} ${s}) scale(${dete ? 0.62 : 1})`}>
      {/* senka na podu */}
      <ellipse cx={0} cy={4} rx={110} ry={16} fill={P.senka} opacity={0.18} />
      <g transform={`rotate(${nagib} 0 -300)`}>
        {/* zadnja ruka */}
        <Ruka sx={-70} sy={-452} a1={lr[0]} a2={lr[1]} rukav={rukav} koza={koza} drzi={drziL} drziRot={drziLRot} />
        {noga(-1, hodA)}
        {noga(1, -hodA)}
        {odeca.tip === "haljina" && (
          <>
            <Oblik d="M-76,-470 C-80,-420 -70,-370 -64,-330 C-90,-270 -118,-210 -128,-150 C-60,-138 60,-138 128,-150 C118,-210 90,-270 64,-330 C70,-370 80,-420 76,-470 C40,-486 -40,-486 -76,-470Z" boja={odeca.haljina} />
            {/* tufne na haljini */}
            {[
              [-90, -190], [-40, -170], [20, -200], [80, -180], [-60, -250], [0, -260], [60, -240], [-20, -300], [40, -300],
            ].map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r={6} fill={P.krem} opacity={0.7} />
            ))}
            {odeca.kecelja && (
              <>
                <Oblik d="M-58,-330 C-78,-260 -90,-200 -92,-168 C-40,-156 40,-156 92,-168 C90,-200 78,-260 58,-330Z" boja={P.kecelja} />
                {/* vez na ivici kecelje */}
                <path d="M-88,-182 C-40,-172 40,-172 88,-182" fill="none" stroke={P.vez} strokeWidth={9} strokeDasharray="10 7" />
                <path d="M-88,-196 C-40,-186 40,-186 88,-196" fill="none" stroke={P.zelenaTamna} strokeWidth={4} strokeDasharray="4 6" />
                <Oblik d="M-56,-340 L56,-340 L60,-322 L-60,-322Z" boja={P.kecelja} debljina={3.5} />
              </>
            )}
            {odeca.dzemper && (
              <>
                <Oblik d="M-78,-472 C-86,-420 -80,-360 -70,-318 L-18,-318 L0,-420 L18,-318 L70,-318 C80,-360 86,-420 78,-472 C40,-488 -40,-488 -78,-472Z" boja={odeca.dzemper} />
                {[-384, -350].map((by) => (
                  <circle key={by} cx={-10} cy={by} r={5} fill={P.drvoTamno} />
                ))}
              </>
            )}
          </>
        )}
        {odeca.tip === "suknja" && (
          <>
            <Oblik d="M-66,-340 C-96,-260 -112,-200 -118,-160 C-60,-146 60,-146 118,-160 C112,-200 96,-260 66,-340Z" boja={odeca.suknja} />
            <Oblik d="M-76,-472 C-82,-420 -76,-370 -66,-330 C-30,-322 30,-322 66,-330 C76,-370 82,-420 76,-472 C40,-488 -40,-488 -76,-472Z" boja={odeca.bluza} />
          </>
        )}
        {odeca.tip === "muski" && (
          <>
            <Oblik d="M-84,-472 C-90,-420 -84,-370 -76,-320 C-40,-310 40,-310 76,-320 C84,-370 90,-420 84,-472 C44,-490 -44,-490 -84,-472Z" boja={odeca.kosulja} />
            <Oblik d="M-78,-340 L78,-340 L80,-310 L-80,-310Z" boja={P.drvoTamno} debljina={3.5} />
            {odeca.prsluk && (
              <>
                <Oblik d="M-84,-470 C-88,-420 -84,-370 -78,-336 L-14,-336 L-24,-470Z" boja={odeca.prsluk} />
                <Oblik d="M84,-470 C88,-420 84,-370 78,-336 L14,-336 L24,-470Z" boja={odeca.prsluk} />
              </>
            )}
            <Oblik d="M-24,-484 L0,-448 L24,-484Z" boja={P.krem} debljina={3} tekstura={0} />
          </>
        )}
        {ispredRuku}
        {/* vrat i glava */}
        <g transform={`translate(0 -560) rotate(${glavaNagib} 0 70)`}>
          <Glava {...glava} />
        </g>
        {/* prednja ruka */}
        <Ruka sx={70} sy={-452} a1={dr[0]} a2={dr[1]} rukav={rukav} koza={koza} drzi={drziD} drziRot={drziDRot} />
      </g>
    </g>
  );
};

// ── Postava likova ───────────────────────────────────────────────────────
export const MILICA = {
  odeca: { tip: "haljina", haljina: P.haljina, dzemper: P.dzemper, kecelja: true } as Odeca,
  glava: { kosa: "seda_punda", naocare: true, bojaKose: P.kosaSeda, seed: 1 } as GlavaCfg,
};
export const MUZ = {
  odeca: { tip: "muski", kosulja: "#C9D6CF", pantalone: P.plava, prsluk: P.drvo } as Odeca,
  glava: { kosa: "muz_sed", brkovi: true, bojaKose: P.kosaSeda, seed: 2 } as GlavaCfg,
};
export const KOMSIJA = {
  odeca: { tip: "muski", kosulja: P.oker, pantalone: P.teget, prsluk: P.zelenaTamna } as Odeca,
  glava: { kosa: "kacket", brkovi: true, bojaKose: P.kosaSeda, seed: 3 } as GlavaCfg,
};
export const KOMSINICA = {
  odeca: { tip: "suknja", bluza: P.roze, suknja: P.plava } as Odeca,
  glava: { kosa: "marama", bojaKose: P.ajvar, seed: 4 } as GlavaCfg,
};
export const SIN = {
  odeca: { tip: "muski", kosulja: P.plava, pantalone: P.drvoTamno } as Odeca,
  glava: { kosa: "decak", bojaKose: P.kosaSmedja, seed: 5 } as GlavaCfg,
};
export const CERKA = {
  odeca: { tip: "suknja", bluza: P.oker, suknja: P.ajvar } as Odeca,
  glava: { kosa: "devojcica", bojaKose: P.kosaRida, seed: 6 } as GlavaCfg,
};
export const MLADIC1 = {
  odeca: { tip: "muski", kosulja: P.zelenaPrigusena, pantalone: P.teget } as Odeca,
  glava: { kosa: "mlad", bojaKose: P.kosaTamna, seed: 7 } as GlavaCfg,
};
export const MLADIC2 = {
  odeca: { tip: "muski", kosulja: P.ajvar, pantalone: P.plava } as Odeca,
  glava: { kosa: "mlad2", bojaKose: P.kosaSmedja, seed: 8 } as GlavaCfg,
};
