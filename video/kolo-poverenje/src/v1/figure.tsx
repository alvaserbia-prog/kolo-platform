// Likovi linoreza: narodne figure, spreda. Koža je boja papira sa debelom ivicom mastila,
// odeća je crna ili crvena sa urezima (tkanje, vez). Stopala u (0,0), visina odraslog ~640.
// Ruke su parametarske: ugao 0° = visi, 90° = pruža se udesno (sa tačke gledaoca), 180° = gore.
import React, { useId } from "react";
import { useCurrentFrame } from "remotion";
import { L, Linija, Povrs, elipsa, urez } from "./linorez";

export type Izraz = "mirna" | "osmeh" | "srecna" | "zabrinuta" | "sumnja" | "zamisljena" | "iznenadjena";
export type Kosa = "punda" | "marama" | "kratka" | "rep" | "sesir" | "kacket" | "celav" | "pletenica";

export type GlavaCfg = {
  kosa: Kosa;
  izraz?: Izraz;
  pogled?: [number, number];
  brkovi?: boolean;
  seda?: boolean;
  boja?: string; // boja marame / šešira
  seed?: number;
  usta?: number;
};

const Kosa1: React.FC<{ kosa: Kosa; seda?: boolean; boja?: string; iza?: boolean }> = ({ kosa, seda, boja = L.crvena, iza }) => {
  const k = seda ? L.sivaSvetla : L.mastilo;
  const urezi = seda ? L.mastilo : L.papir;
  if (iza) {
    if (kosa === "punda") return <Povrs d={elipsa(0, -92, 40, 32)} boja={k} />;
    if (kosa === "rep") return <Povrs d="M50,-40 C100,-24 104,60 80,110 C70,70 58,30 44,4Z" boja={k} />;
    if (kosa === "pletenica")
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <Povrs key={i} d={elipsa(62 + i * 3, 30 + i * 34, 18, 22)} boja={k} debljina={4} />
          ))}
        </g>
      );
    if (kosa === "marama") return <Povrs d="M-84,-10 C-92,-70 -48,-106 0,-106 C48,-106 92,-70 84,-10 C90,40 64,90 30,104 L-30,104 C-64,90 -90,40 -84,-10Z" boja={boja} />;
    return null;
  }
  switch (kosa) {
    case "punda":
    case "rep":
    case "pletenica":
      return (
        <g>
          <Povrs d="M-74,-4 C-82,-66 -40,-96 2,-96 C46,-96 84,-66 74,-4 C58,-44 26,-58 0,-56 C-28,-58 -58,-44 -74,-4Z" boja={k} />
          <path d={`${urez(-44, -66, -8, -80, 3.5)} ${urez(8, -80, 46, -64, 3.5)} ${urez(-56, -40, -30, -60, 3)}`} fill={urezi} opacity={0.8} />
        </g>
      );
    case "kratka":
      return (
        <g>
          <Povrs d="M-76,-6 C-86,-64 -44,-98 4,-98 C52,-98 88,-64 76,-6 C70,-34 58,-46 42,-50 L34,-32 L24,-54 C8,-50 -8,-52 -20,-60 L-26,-38 L-40,-56 C-58,-50 -70,-34 -76,-6Z" boja={k} />
          <path d={`${urez(-40, -76, 0, -86, 3)} ${urez(10, -86, 50, -72, 3)}`} fill={urezi} opacity={0.8} />
        </g>
      );
    case "celav":
      return <Povrs d="M-78,6 C-82,-30 -76,-50 -62,-60 C-64,-36 -68,-14 -70,10Z M78,6 C82,-30 76,-50 62,-60 C64,-36 68,-14 70,10Z" boja={k} debljina={4} />;
    case "marama":
      return (
        <g>
          <Povrs d="M-80,-2 C-84,-68 -44,-100 0,-100 C44,-100 84,-68 80,-2 C60,-40 30,-52 0,-52 C-30,-52 -60,-40 -80,-2Z" boja={boja} />
          {[-44, -14, 16, 46].map((x, i) => (
            <circle key={i} cx={x} cy={-74 + Math.abs(x) * 0.18} r={6.5} fill={L.papir} />
          ))}
          <Povrs d="M-18,86 L0,72 L18,86 L8,112 L-8,112Z" boja={boja} debljina={4} />
        </g>
      );
    case "sesir":
      return (
        <g>
          <Povrs d="M-120,-46 C-100,-60 100,-60 120,-46 C100,-34 -100,-34 -120,-46Z" boja={L.mastilo} />
          <Povrs d="M-70,-50 C-72,-110 -40,-130 0,-130 C40,-130 72,-110 70,-50Z" boja={L.mastilo} />
          <rect x={-70} y={-70} width={140} height={14} fill={boja} />
          <Povrs d="M-76,-4 C-80,-30 -76,-44 -66,-52 L-60,-8Z M76,-4 C80,-30 76,-44 66,-52 L60,-8Z" boja={k} debljina={4} />
        </g>
      );
    case "kacket":
      return (
        <g>
          <Povrs d="M-80,-30 C-82,-80 -40,-104 6,-102 C50,-100 84,-76 80,-30 C50,-42 -50,-42 -80,-30Z" boja={L.mastilo} />
          <Povrs d="M-10,-36 C30,-46 92,-46 120,-28 C98,-20 40,-20 -10,-28Z" boja={L.mastilo} />
          <path d={`${urez(-50, -70, 20, -86, 3)} ${urez(-30, -54, 40, -64, 3)}`} fill={L.papir} opacity={0.7} />
        </g>
      );
  }
};

export const Glava: React.FC<GlavaCfg> = ({ kosa, izraz = "mirna", pogled = [0, 0], brkovi, seda, boja, seed = 0, usta = 0 }) => {
  const f = useCurrentFrame();
  const trep = (f + seed * 37) % 120 < 4;
  const [gx, gy] = pogled;
  const srecna = izraz === "srecna";
  const obrve =
    izraz === "zabrinuta"
      ? ["M-46,-36 Q-30,-44 -14,-32", "M14,-32 Q30,-44 46,-36"]
      : izraz === "sumnja"
        ? ["M-46,-40 Q-30,-38 -12,-30", "M14,-40 Q30,-46 46,-40"]
        : izraz === "iznenadjena"
          ? ["M-46,-44 Q-30,-56 -14,-46", "M14,-46 Q30,-56 46,-44"]
          : ["M-46,-38 Q-30,-46 -14,-40", "M14,-40 Q30,-46 46,-38"];
  let ustaD = "M-20,34 Q0,48 20,34";
  if (srecna) ustaD = "M-24,30 Q0,58 24,30";
  if (izraz === "zabrinuta") ustaD = "M-16,42 Q0,32 16,42";
  if (izraz === "zamisljena" || izraz === "mirna") ustaD = "M-14,38 Q0,41 14,37";
  if (izraz === "sumnja") ustaD = "M-16,40 L16,36";
  return (
    <g>
      <Kosa1 kosa={kosa} seda={seda} boja={boja} iza />
      <Povrs d={elipsa(-74, 8, 13, 19)} boja={L.koza} debljina={5} trunje={0} />
      <Povrs d={elipsa(74, 8, 13, 19)} boja={L.koza} debljina={5} trunje={0} />
      <Povrs d="M-74,0 C-78,-60 -42,-86 0,-86 C42,-86 78,-60 74,0 C72,52 40,84 0,84 C-40,84 -72,52 -74,0Z" boja={L.koza} debljina={7} trunje={0.2} />
      <circle cx={-44} cy={24} r={13} fill={L.crvena} opacity={0.55} />
      <circle cx={44} cy={24} r={13} fill={L.crvena} opacity={0.55} />
      {trep || srecna ? (
        srecna && !trep ? (
          <>
            <Linija d="M-42,-4 Q-28,-18 -14,-4" debljina={6} />
            <Linija d="M14,-4 Q28,-18 42,-4" debljina={6} />
          </>
        ) : (
          <>
            <Linija d="M-42,-4 Q-28,2 -14,-4" debljina={5} />
            <Linija d="M14,-4 Q28,2 42,-4" debljina={5} />
          </>
        )
      ) : (
        <>
          <path d={`M${-42 + gx * 5},${-6 + gy * 4} Q${-28 + gx * 5},${-20 + gy * 4} ${-14 + gx * 5},${-6 + gy * 4} Q${-28 + gx * 5},${6 + gy * 4} ${-42 + gx * 5},${-6 + gy * 4}Z`} fill={L.mastilo} />
          <path d={`M${14 + gx * 5},${-6 + gy * 4} Q${28 + gx * 5},${-20 + gy * 4} ${42 + gx * 5},${-6 + gy * 4} Q${28 + gx * 5},${6 + gy * 4} ${14 + gx * 5},${-6 + gy * 4}Z`} fill={L.mastilo} />
          <circle cx={-25 + gx * 5} cy={-9 + gy * 4} r={2.5} fill={L.papir} />
          <circle cx={31 + gx * 5} cy={-9 + gy * 4} r={2.5} fill={L.papir} />
        </>
      )}
      <Linija d={obrve[0]} debljina={6} />
      <Linija d={obrve[1]} debljina={6} />
      <Linija d="M-2,2 Q-12,20 0,22 Q8,22 10,17" debljina={5} />
      {usta > 0.05 ? (
        <Povrs d={`M-14,36 Q0,${36 + 24 * usta} 14,36 Q0,30 -14,36Z`} boja={L.crvenaTamna} debljina={4} trunje={0} />
      ) : izraz === "iznenadjena" ? (
        <Povrs d={elipsa(0, 42, 9, 11)} boja={L.crvenaTamna} debljina={4} trunje={0} />
      ) : (
        <Linija d={ustaD} debljina={6} />
      )}
      {brkovi && <Povrs d="M-38,30 C-26,12 -6,14 0,24 C6,14 26,12 38,30 C24,26 10,28 0,30 C-10,28 -24,26 -38,30Z" boja={seda ? L.sivaSvetla : L.mastilo} debljina={4} />}
      <Kosa1 kosa={kosa} seda={seda} boja={boja} />
    </g>
  );
};

// ── ruka ────────────────────────────────────────────────────────────────
const rad = (a: number) => (a * Math.PI) / 180;
export const zglobovi = (sx: number, sy: number, a1: number, a2: number, d1 = 120, d2 = 110) => {
  const e: [number, number] = [sx + Math.sin(rad(a1)) * d1, sy + Math.cos(rad(a1)) * d1];
  const h: [number, number] = [e[0] + Math.sin(rad(a1 + a2)) * d2, e[1] + Math.cos(rad(a1 + a2)) * d2];
  return { e, h };
};

export const Ruka: React.FC<{ sx: number; sy: number; a1: number; a2: number; rukav: string; drzi?: React.ReactNode; drziRot?: number }> = ({ sx, sy, a1, a2, rukav, drzi, drziRot = 0 }) => {
  const { e, h } = zglobovi(sx, sy, a1, a2);
  const ug = a1 + a2;
  const hk: [number, number] = [h[0] - Math.sin(rad(ug)) * 18, h[1] - Math.cos(rad(ug)) * 18];
  const d = `M${sx},${sy} L${e[0].toFixed(1)},${e[1].toFixed(1)} L${hk[0].toFixed(1)},${hk[1].toFixed(1)}`;
  return (
    <g>
      <path d={d} fill="none" stroke={L.mastilo} strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={rukav} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" />
      {rukav === L.mastilo && <path d={urez(sx + (e[0] - sx) * 0.2, sy + (e[1] - sy) * 0.2, sx + (e[0] - sx) * 0.8, sy + (e[1] - sy) * 0.8, 4)} fill={L.papir} opacity={0.6} />}
      <Povrs d={elipsa(h[0], h[1], 22, 21)} boja={L.koza} debljina={5} trunje={0} />
      {drzi && <g transform={`translate(${h[0].toFixed(1)} ${h[1].toFixed(1)}) rotate(${drziRot})`}>{drzi}</g>}
    </g>
  );
};

// ── telo ────────────────────────────────────────────────────────────────
export type Odeca =
  | { tip: "zena"; bluza: string; suknja: string; kecelja?: string; prsluk?: string }
  | { tip: "muskarac"; kosulja: string; pantalone: string; prsluk?: string; kaput?: boolean };

export type Poza = {
  lr?: [number, number];
  dr?: [number, number];
  hod?: number;
  nagib?: number;
  glavaNagib?: number;
  drziL?: React.ReactNode;
  drziD?: React.ReactNode;
  drziLRot?: number;
  drziDRot?: number;
  sedi?: boolean;
};

const Vez: React.FC<{ x0: number; x1: number; y: number; boja?: string }> = ({ x0, x1, y, boja = L.papir }) => {
  const d: string[] = [];
  for (let x = x0; x < x1 - 10; x += 26) d.push(`M${x},${y} L${x + 13},${y - 12} L${x + 26},${y}`);
  return <path d={d.join(" ")} fill="none" stroke={boja} strokeWidth={5} strokeLinejoin="round" />;
};

export const Figura: React.FC<
  Poza & { x: number; y: number; s?: number; okreni?: boolean; odeca: Odeca; glava: GlavaCfg; dete?: boolean; opacity?: number }
> = ({ x, y, s = 1, okreni, odeca, glava, lr = [10, 8], dr = [-10, -8], hod, nagib = 0, glavaNagib = 0, drziL, drziD, drziLRot, drziDRot, sedi, dete, opacity = 1 }) => {
  const f = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  const hodA = hod === undefined ? 0 : Math.sin(hod) * 22;
  const bob = hod === undefined ? Math.sin((f + (glava.seed ?? 0) * 13) / 44) * 2 : Math.abs(Math.cos(hod)) * -9;
  const rukav = odeca.tip === "zena" ? odeca.bluza : odeca.kaput ? odeca.pantalone : odeca.kosulja;
  const spust = sedi ? 170 : 0;
  const noga = (strana: number, ugao: number) => {
    const muski = odeca.tip === "muskarac";
    const vrh = muski ? -330 : -170;
    const boja = muski ? odeca.pantalone : L.mastilo;
    return (
      <g key={strana} transform={`translate(${strana * 34} ${vrh}) rotate(${ugao})`}>
        <path d={`M0,0 L0,${-vrh - 24}`} stroke={L.mastilo} strokeWidth={muski ? 60 : 36} strokeLinecap="round" />
        <path d={`M0,0 L0,${-vrh - 24}`} stroke={boja} strokeWidth={muski ? 46 : 24} strokeLinecap="round" />
        <Povrs d={`M-22,${-vrh - 28} C-24,${-vrh - 6} -12,${-vrh + 4} 16,${-vrh + 4} C42,${-vrh + 4} 46,${-vrh - 12} 32,${-vrh - 24} C18,${-vrh - 34} -6,${-vrh - 36} -22,${-vrh - 28}Z`} boja={L.mastilo} debljina={4} />
      </g>
    );
  };
  const nogeSedi = (
    <g>
      {[-1, 1].map((st) => (
        <g key={st}>
          <path d={`M${st * 38},-150 L${st * 42},-22`} stroke={L.mastilo} strokeWidth={odeca.tip === "muskarac" ? 58 : 36} strokeLinecap="round" />
          <path d={`M${st * 38},-150 L${st * 42},-22`} stroke={odeca.tip === "muskarac" ? odeca.pantalone : L.mastilo} strokeWidth={odeca.tip === "muskarac" ? 44 : 24} strokeLinecap="round" />
          <Povrs d={`M${st * 42 - 22},-26 C${st * 42 - 24},-4 ${st * 42 - 12},6 ${st * 42 + 16},6 C${st * 42 + 42},6 ${st * 42 + 46},-10 ${st * 42 + 32},-22 C${st * 42 + 18},-32 ${st * 42 - 6},-34 ${st * 42 - 22},-26Z`} boja={L.mastilo} debljina={4} />
        </g>
      ))}
      {odeca.tip === "zena" ? (
        <Povrs d="M-80,-176 C-110,-150 -126,-120 -128,-90 C-60,-80 60,-80 128,-90 C126,-120 110,-150 80,-176Z" boja={odeca.suknja} />
      ) : (
        <Povrs d="M-80,-176 L80,-176 L86,-140 L-86,-140Z" boja={odeca.pantalone} />
      )}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${okreni ? -s : s} ${s}) scale(${dete ? 0.62 : 1})`} opacity={opacity}>
      <ellipse cx={0} cy={6} rx={112} ry={14} fill={L.mastilo} opacity={0.22} />
      {sedi && nogeSedi}
      <g transform={`translate(0 ${spust}) rotate(${nagib} 0 -300)`}>
        {sedi && (
          <defs>
            <clipPath id={`gore${id}`}>
              <rect x={-300} y={-900} width={600} height={560} />
            </clipPath>
          </defs>
        )}
        <Ruka sx={-72} sy={-454} a1={lr[0]} a2={lr[1]} rukav={rukav} drzi={drziL} drziRot={drziLRot} />
        <g clipPath={sedi ? `url(#gore${id})` : undefined}>
          {!sedi && noga(-1, hodA)}
          {!sedi && noga(1, -hodA)}
          {odeca.tip === "zena" && (
            <>
              <Povrs d="M-70,-340 C-100,-262 -120,-200 -130,-150 C-60,-136 60,-136 130,-150 C120,-200 100,-262 70,-340Z" boja={odeca.suknja} />
              <Vez x0={-120} x1={120} y={-172} boja={odeca.suknja === L.mastilo ? L.crvena : L.papir} />
              {odeca.kecelja && (
                <>
                  <Povrs d="M-56,-332 C-72,-270 -84,-210 -86,-170 C-40,-160 40,-160 86,-170 C84,-210 72,-270 56,-332Z" boja={odeca.kecelja} />
                  <Vez x0={-78} x1={78} y={-188} boja={L.crvena} />
                </>
              )}
              <Povrs d="M-78,-474 C-84,-420 -78,-370 -68,-330 C-30,-322 30,-322 68,-330 C78,-370 84,-420 78,-474 C40,-490 -40,-490 -78,-474Z" boja={odeca.bluza} />
              {odeca.prsluk && (
                <>
                  <Povrs d="M-78,-472 C-84,-420 -78,-370 -68,-332 L-20,-332 L-26,-472Z" boja={odeca.prsluk} />
                  <Povrs d="M78,-472 C84,-420 78,-370 68,-332 L20,-332 L26,-472Z" boja={odeca.prsluk} />
                  {[-400, -370].map((yy) => (
                    <circle key={yy} cx={-48} cy={yy} r={5} fill={L.papir} />
                  ))}
                </>
              )}
            </>
          )}
          {odeca.tip === "muskarac" && (
            <>
              <Povrs d="M-86,-474 C-92,-420 -86,-370 -78,-320 C-40,-310 40,-310 78,-320 C86,-370 92,-420 86,-474 C44,-492 -44,-492 -86,-474Z" boja={odeca.kosulja} />
              {odeca.kosulja === L.mastilo && <path d={`${urez(-50, -450, -46, -340, 5)} ${urez(0, -456, 2, -330, 5)} ${urez(48, -450, 44, -340, 5)}`} fill={L.papir} opacity={0.55} />}
              <Povrs d="M-80,-340 L80,-340 L82,-310 L-82,-310Z" boja={L.mastilo} debljina={4} />
              {odeca.prsluk && (
                <>
                  <Povrs d="M-86,-472 C-90,-420 -86,-370 -80,-338 L-14,-338 L-24,-472Z" boja={odeca.prsluk} />
                  <Povrs d="M86,-472 C90,-420 86,-370 80,-338 L14,-338 L24,-472Z" boja={odeca.prsluk} />
                  {[-440, -410, -380].map((yy) => (
                    <circle key={yy} cx={-30} cy={yy} r={4.5} fill={L.papir} />
                  ))}
                </>
              )}
              <Povrs d="M-24,-486 L0,-450 L24,-486Z" boja={L.papir} debljina={4} trunje={0} />
            </>
          )}
        </g>
        <g transform={`translate(0 -562) rotate(${glavaNagib} 0 70)`}>
          <Glava {...glava} />
        </g>
        <Ruka sx={72} sy={-454} a1={dr[0]} a2={dr[1]} rukav={rukav} drzi={drziD} drziRot={drziDRot} />
      </g>
    </g>
  );
};

/** Siva silueta bez lica: neko koga niko ne zna (ili ko ne postoji). */
export const Silueta: React.FC<{ x: number; y: number; s?: number; hod?: number; treperi?: number }> = ({ x, y, s = 1, hod, treperi = 0 }) => {
  const f = useCurrentFrame();
  const hodA = hod === undefined ? 0 : Math.sin(hod) * 20;
  const op = 0.82 - treperi * (0.35 + 0.35 * Math.sin(f * 1.7));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      {[-1, 1].map((st) => (
        <path key={st} d="M0,0 L0,300" transform={`translate(${st * 34} -330) rotate(${st * hodA})`} stroke={L.siva} strokeWidth={50} strokeLinecap="round" />
      ))}
      <path d="M-88,-474 C-96,-400 -90,-340 -80,-300 C-40,-290 40,-290 80,-300 C90,-340 96,-400 88,-474 C44,-494 -44,-494 -88,-474Z" fill={L.siva} />
      <path d="M-80,-460 L-120,-260 M80,-460 L120,-260" stroke={L.siva} strokeWidth={44} strokeLinecap="round" />
      <path d={elipsa(0, -562, 76, 86)} fill={L.siva} />
      <path d="M-88,-474 C-96,-400 -90,-340 -80,-300 C-40,-290 40,-290 80,-300 C90,-340 96,-400 88,-474 C44,-494 -44,-494 -88,-474Z" fill="none" stroke={L.mastiloMeko} strokeWidth={4} strokeDasharray="14 12" />
      <path d={elipsa(0, -562, 76, 86)} fill="none" stroke={L.mastiloMeko} strokeWidth={4} strokeDasharray="14 12" />
    </g>
  );
};

// ── postava trilogije ───────────────────────────────────────────────────
type Lik = { odeca: Odeca; glava: GlavaCfg };
export const BAKA: Lik = { odeca: { tip: "zena", bluza: L.mastilo, suknja: L.mastilo, kecelja: L.papirTopli }, glava: { kosa: "marama", boja: L.crvena, seed: 1 } };
export const LAZA: Lik = { odeca: { tip: "muskarac", kosulja: L.papirTopli, pantalone: L.mastilo, prsluk: L.crvena }, glava: { kosa: "kratka", seed: 2 } };
export const OTAC: Lik = { odeca: { tip: "muskarac", kosulja: L.mastilo, pantalone: L.mastilo }, glava: { kosa: "kratka", brkovi: true, seed: 3 } };
export const DEDA: Lik = { odeca: { tip: "muskarac", kosulja: L.papirTopli, pantalone: L.mastilo, prsluk: L.mastilo }, glava: { kosa: "sesir", brkovi: true, seda: true, boja: L.crvena, seed: 4 } };
export const DOSLJAK: Lik = { odeca: { tip: "muskarac", kosulja: L.oker, pantalone: L.mastilo, prsluk: L.mastilo }, glava: { kosa: "kratka", seed: 5 } };
export const DOMACIN: Lik = { odeca: { tip: "muskarac", kosulja: L.papirTopli, pantalone: L.mastilo, prsluk: L.crvena }, glava: { kosa: "celav", brkovi: true, seda: true, seed: 6 } };
export const POZNANIK: Lik = { odeca: { tip: "muskarac", kosulja: L.mastilo, pantalone: L.mastilo, prsluk: L.oker }, glava: { kosa: "kacket", brkovi: true, seed: 7 } };
export const JOVANA: Lik = { odeca: { tip: "zena", bluza: L.oker, suknja: L.mastilo }, glava: { kosa: "pletenica", seed: 8 } };
export const VERA: Lik = { odeca: { tip: "zena", bluza: L.papirTopli, suknja: L.crvena, prsluk: L.mastilo }, glava: { kosa: "punda", seda: true, seed: 9 } };
export const DRAGAN: Lik = { odeca: { tip: "muskarac", kosulja: L.crvena, pantalone: L.mastilo }, glava: { kosa: "kratka", brkovi: true, seed: 10 } };
export const SOFIJA: Lik = { odeca: { tip: "zena", bluza: L.papirTopli, suknja: L.indigo, kecelja: L.papir }, glava: { kosa: "rep", seed: 11 } };
