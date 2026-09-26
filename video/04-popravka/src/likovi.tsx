// Likovi, kuće i predmeti — sve kao papirni isečci, crtani oko tačke (0,0).
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { Crta, Isecak, Pt, krugTacke, pravougaonik, drhtaviPut, useBoil } from "./papir";
import { RUKOPIS } from "./fontovi";

// ── Glava ────────────────────────────────────────────────────────────
export type Frizura = "punda" | "kapa" | "rep" | "kratka" | "marama" | "cela";
export type GlavaCfg = {
  r?: number;
  koza?: string;
  kosa?: string;
  frizura?: Frizura;
  brkovi?: boolean;
  naocare?: boolean;
  osmeh?: number; // 0–1
  zmurka?: boolean;
  kapaBoja?: string;
};
export const Glava: React.FC<GlavaCfg & { seed: string }> = ({ seed, r = 46, koza = P.koza, kosa = P.kosaTamna, frizura = "kratka", brkovi, naocare, osmeh = 1, zmurka, kapaBoja = P.nebo }) => {
  const f = useCurrentFrame();
  // treptaj na ~3 s, različito za svaku glavu
  const faza = (seed.length * 37) % 90;
  const trep = zmurka || (f + faza) % 96 < 3;
  return (
    <g>
      {frizura === "punda" && <Isecak pts={krugTacke(0, -r * 1.02, r * 0.42)} boja={kosa} seed={`${seed}-pn`} senka="mala" />}
      {frizura === "rep" && (
        <Isecak pts={[[r * 0.7, -r * 0.5], [r * 1.35, -r * 0.1], [r * 1.25, r * 0.7], [r * 0.85, r * 0.2]]} boja={kosa} seed={`${seed}-rp`} senka="mala" />
      )}
      <Isecak pts={krugTacke(0, 0, r)} boja={koza} seed={`${seed}-g`} senka="mala" amp={1.6} />
      {/* kosa: kapa preko temena */}
      {frizura !== "marama" && frizura !== "cela" && (
        <Isecak
          pts={
            frizura === "kapa"
              ? [[-r * 1.05, -r * 0.25], [-r * 0.9, -r * 0.85], [0, -r * 1.12], [r * 0.9, -r * 0.85], [r * 1.35, -r * 0.3], [r * 0.2, -r * 0.42]]
              : [[-r * 1.02, -r * 0.05], [-r * 0.85, -r * 0.8], [0, -r * 1.08], [r * 0.85, -r * 0.8], [r * 1.02, -r * 0.05], [r * 0.6, -r * 0.5], [-r * 0.5, -r * 0.55]]
          }
          boja={frizura === "kapa" ? kapaBoja : kosa}
          seed={`${seed}-k`}
          senka="bez"
          amp={1.5}
        />
      )}
      {frizura === "cela" && (
        <Isecak pts={[[-r * 0.85, -r * 0.55], [-r * 0.4, -r * 0.95], [r * 0.4, -r * 0.95], [r * 0.85, -r * 0.55], [r * 0.3, -r * 0.7], [-r * 0.3, -r * 0.7]]} boja={kosa} seed={`${seed}-ce`} senka="bez" amp={1.2} />
      )}
      {frizura === "marama" && (
        <Isecak
          pts={[[-r * 1.12, r * 0.2], [-r * 1.0, -r * 0.7], [0, -r * 1.15], [r * 1.0, -r * 0.7], [r * 1.12, r * 0.2], [r * 0.75, -r * 0.35], [-r * 0.75, -r * 0.35]]}
          boja={P.korala}
          seed={`${seed}-mr`}
          senka="bez"
          amp={1.5}
        />
      )}
      {/* oči */}
      {trep ? (
        <>
          <Crta pts={[[-r * 0.42, -r * 0.02], [-r * 0.2, -r * 0.02]]} seed={`${seed}-o1`} debljina={4} amp={0.5} />
          <Crta pts={[[r * 0.2, -r * 0.02], [r * 0.42, -r * 0.02]]} seed={`${seed}-o2`} debljina={4} amp={0.5} />
        </>
      ) : (
        <>
          <circle cx={-r * 0.31} cy={-r * 0.02} r={r * 0.085} fill={P.tekst} />
          <circle cx={r * 0.31} cy={-r * 0.02} r={r * 0.085} fill={P.tekst} />
        </>
      )}
      {naocare && (
        <g fill="none" stroke={P.tekst} strokeWidth={3}>
          <circle cx={-r * 0.31} cy={-r * 0.02} r={r * 0.22} />
          <circle cx={r * 0.31} cy={-r * 0.02} r={r * 0.22} />
          <line x1={-r * 0.09} y1={-r * 0.04} x2={r * 0.09} y2={-r * 0.04} />
        </g>
      )}
      {/* obrazi */}
      <circle cx={-r * 0.55} cy={r * 0.3} r={r * 0.14} fill={P.korala} opacity={0.28} />
      <circle cx={r * 0.55} cy={r * 0.3} r={r * 0.14} fill={P.korala} opacity={0.28} />
      {brkovi && (
        <Isecak pts={[[-r * 0.45, r * 0.33], [0, r * 0.22], [r * 0.45, r * 0.33], [r * 0.2, r * 0.42], [0, r * 0.35], [-r * 0.2, r * 0.42]]} boja={P.kosaTamna} seed={`${seed}-br`} senka="bez" amp={1} korak={10} />
      )}
      <Crta
        pts={[[-r * 0.3, r * 0.4], [0, r * (0.4 + 0.18 * osmeh)], [r * 0.3, r * 0.4]]}
        seed={`${seed}-u`}
        debljina={4}
        amp={0.6}
        korak={10}
      />
    </g>
  );
};

// ── Osoba (poprsje) ──────────────────────────────────────────────────
export const Osoba: React.FC<{
  seed: string;
  boja: string;
  glava?: GlavaCfg;
  sirina?: number;
  visina?: number;
}> = ({ seed, boja, glava, sirina = 120, visina = 120 }) => (
  <g>
    <Isecak
      pts={[[-sirina * 0.32, 0], [sirina * 0.32, 0], [sirina * 0.5, visina * 0.8], [sirina * 0.45, visina], [-sirina * 0.45, visina], [-sirina * 0.5, visina * 0.8]]}
      boja={boja}
      seed={`${seed}-t`}
    />
    <g transform={`translate(0 ${-visina * 0.28})`}>
      <Glava seed={`${seed}-h`} {...glava} />
    </g>
  </g>
);

// ── Kuća (vojvođanska, zabat na ulicu) ───────────────────────────────
export type Prozor = { glava?: GlavaCfg; od?: number };
export const Kuca: React.FC<{
  seed: string;
  fasada: string;
  krov?: string;
  sirina?: number;
  visina?: number;
  prozori?: [Prozor?, Prozor?];
  kapci?: string;
}> = ({ seed, fasada, krov = P.korala600, sirina = 250, visina = 170, prozori = [], kapci = P.zelena700 }) => {
  const f = useCurrentFrame();
  const w = sirina;
  const h = visina;
  const zabat = w * 0.48;
  const pw = w * 0.26;
  const ph = h * 0.52;
  const py = -h * 0.72;
  const px = [-w * 0.24 - pw / 2, w * 0.24 - pw / 2];
  return (
    <g>
      {/* krov: tamnija traka koja viri iza zabata */}
      <Isecak pts={[[-w / 2 - 16, -h + 8], [0, -h - zabat - 16], [w / 2 + 16, -h + 8], [w / 2 + 2, -h + 14], [0, -h - zabat + 4], [-w / 2 - 2, -h + 14]]} boja={krov} seed={`${seed}-kr`} />
      <Isecak pts={[[-w / 2, 0], [-w / 2, -h], [0, -h - zabat], [w / 2, -h], [w / 2, 0]]} boja={fasada} seed={`${seed}-f`} amp={2} />
      {/* sokla */}
      <Isecak pts={pravougaonik(-w / 2, -h * 0.14, w, h * 0.14)} boja="#00000022" seed={`${seed}-s`} senka="bez" zrno={0.3} />
      {/* okce u zabatu */}
      <Isecak pts={krugTacke(0, -h - zabat * 0.42, w * 0.07, 10)} boja={P.zelena900} seed={`${seed}-ok`} senka="bez" amp={1} />
      {/* profil venca */}
      <Crta pts={[[-w / 2 + 4, -h + 2], [w / 2 - 4, -h + 2]]} seed={`${seed}-v`} boja="#ffffff" debljina={5} opacity={0.7} />
      {px.map((x, i) => {
        const pr = prozori[i];
        const id = `clip-${seed}-${i}`;
        const s = pr?.od !== undefined ? Math.max(0, Math.min(1.12, (f - pr.od) / 9)) : 0;
        // glava izviri iz prozora sa malim odskokom
        const izvir = pr?.od !== undefined ? spring01(f - pr.od) : 0;
        return (
          <g key={i}>
            {/* kapci */}
            <Isecak pts={pravougaonik(x - pw * 0.42, py - 2, pw * 0.4, ph + 4)} boja={kapci} seed={`${seed}-kl${i}`} senka="mala" amp={1.4} />
            <Isecak pts={pravougaonik(x + pw * 1.02, py - 2, pw * 0.4, ph + 4)} boja={kapci} seed={`${seed}-kd${i}`} senka="mala" amp={1.4} />
            <Isecak pts={pravougaonik(x, py, pw, ph)} boja="#2b3a2f" seed={`${seed}-p${i}`} senka="bez" amp={1.2} />
            {/* prečka prozora (iza glave — glava proviruje napred) */}
            <line x1={x + pw / 2} y1={py} x2={x + pw / 2} y2={py + ph} stroke={fasada} strokeWidth={4} opacity={0.9} />
            <line x1={x} y1={py + ph * 0.38} x2={x + pw} y2={py + ph * 0.38} stroke={fasada} strokeWidth={4} opacity={0.9} />
            <clipPath id={id}>
              <rect x={x} y={py} width={pw} height={ph} />
            </clipPath>
            {pr?.glava && s > 0 && (
              <g clipPath={`url(#${id})`}>
                <g transform={`translate(${x + pw / 2} ${py + ph * 0.62 + (1 - izvir) * ph})`}>
                  <Glava r={pw * 0.4} {...pr.glava} seed={`${seed}-gl${i}`} />
                </g>
              </g>
            )}
            {/* prozorska daska */}
            <Isecak pts={pravougaonik(x - 6, py + ph, pw + 12, 9)} boja="#ffffff" seed={`${seed}-d${i}`} senka="mala" amp={1} zrno={0.3} />
          </g>
        );
      })}
    </g>
  );
};

// opruga 0→1 sa odskokom, bez hook-a (za mnogo elemenata u petlji)
export const spring01 = (t: number) => {
  if (t <= 0) return 0;
  const x = t / 30;
  return 1 - Math.exp(-6 * x) * Math.cos(11 * x);
};

// ── Predmeti ─────────────────────────────────────────────────────────
export const Pita: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  const spirala: Pt[] = Array.from({ length: 40 }, (_, i) => {
    const a = i * 0.5;
    const r = 8 + i * 2.1;
    return [Math.cos(a) * r, Math.sin(a) * r * 0.62];
  });
  return (
    <g>
      {/* para */}
      {[-40, 0, 40].map((x, i) => {
        const t = ((f + i * 12) % 45) / 45;
        const pts: Pt[] = Array.from({ length: 6 }, (_, k) => [x + Math.sin(k * 1.3 + i) * 10, -70 - k * 14 - t * 30]);
        return <Crta key={i} pts={pts} seed={`${seed}-pa${i}`} boja="#ffffff" debljina={6} opacity={(1 - t) * 0.9} />;
      })}
      <Isecak pts={krugTacke(0, 8, 118, 0, 62)} boja="#7b7f86" seed={`${seed}-t`} />
      <Isecak pts={krugTacke(0, 0, 104, 0, 54)} boja="#E9B35C" seed={`${seed}-p`} />
      <Crta pts={spirala} seed={`${seed}-s`} boja="#B8742A" debljina={6} korak={14} />
    </g>
  );
};

export const Bicikl: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  const ugao = f * 3;
  const tocak = (cx: number, k: string) => (
    <g>
      <Crta pts={krugTacke(cx, 0, 62, 26).concat([krugTacke(cx, 0, 62, 26)[0]])} seed={`${seed}-${k}`} boja={P.tekst} debljina={10} />
      <g transform={`rotate(${ugao} ${cx} 0)`} stroke={P.siva} strokeWidth={3}>
        {[0, 45, 90, 135].map((a) => (
          <line key={a} x1={cx + Math.cos((a * Math.PI) / 180) * 58} y1={Math.sin((a * Math.PI) / 180) * 58} x2={cx - Math.cos((a * Math.PI) / 180) * 58} y2={-Math.sin((a * Math.PI) / 180) * 58} />
        ))}
      </g>
      <circle cx={cx} cy={0} r={7} fill={P.tekst} />
    </g>
  );
  return (
    <g>
      {tocak(-95, "t1")}
      {tocak(95, "t2")}
      <Crta pts={[[-95, 0], [-15, 0], [55, -80], [-45, -80], [-95, 0]]} seed={`${seed}-r`} boja={P.korala} debljina={11} korak={30} />
      <Crta pts={[[-15, 0], [-55, -95]]} seed={`${seed}-r2`} boja={P.korala} debljina={11} />
      <Crta pts={[[95, 0], [55, -80], [48, -112]]} seed={`${seed}-r3`} boja={P.korala} debljina={11} />
      <Crta pts={[[30, -118], [66, -112]]} seed={`${seed}-vo`} boja={P.tekst} debljina={9} />
      <Isecak pts={[[-80, -104], [-30, -104], [-38, -92], [-74, -92]]} boja={P.tekst} seed={`${seed}-se`} senka="mala" amp={1} korak={10} />
    </g>
  );
};

export const Korpa: React.FC<{ seed: string; paradajza?: number }> = ({ seed, paradajza = 5 }) => {
  const mesta: Pt[] = [[-60, -52], [0, -60], [60, -50], [-30, -92], [32, -90], [0, -120]];
  return (
    <g>
      {mesta.slice(0, paradajza).map(([x, y], i) => (
        <g key={i}>
          <Isecak pts={krugTacke(x, y, 34, 14)} boja={i % 2 ? "#D63A2A" : P.korala} seed={`${seed}-pr${i}`} senka="mala" amp={1.4} />
          <Isecak pts={[[x - 12, y - 32], [x, y - 40], [x + 12, y - 32], [x + 4, y - 28], [x, y - 22], [x - 4, y - 28]]} boja={P.zelena500} seed={`${seed}-pl${i}`} senka="bez" amp={0.8} korak={8} />
        </g>
      ))}
      <Isecak pts={[[-120, -40], [120, -40], [95, 60], [-95, 60]]} boja="#B9793D" seed={`${seed}-k`} />
      {[-20, 5, 30].map((y, i) => (
        <Crta key={i} pts={[[-112 + i * 4, y], [112 - i * 4, y]]} seed={`${seed}-pl${i}`} boja="#8A5424" debljina={5} />
      ))}
      <Crta pts={[[-100, -40], [-80, -140], [0, -175], [80, -140], [100, -40]]} seed={`${seed}-dr`} boja="#8A5424" debljina={9} korak={30} />
    </g>
  );
};

export const Asov: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Crta pts={[[0, -150], [0, 40]]} seed={`${seed}-d`} boja="#9A6A3A" debljina={16} />
    <Crta pts={[[-30, -152], [30, -152]]} seed={`${seed}-r`} boja="#9A6A3A" debljina={14} />
    <Isecak pts={[[-44, 30], [44, 30], [40, 110], [0, 140], [-40, 110]]} boja="#9BA3A8" seed={`${seed}-l`} />
  </g>
);

export const Kljuc: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Crta pts={[[-70, 70], [30, -30]]} seed={`${seed}-d`} boja={P.siva} debljina={22} />
    <g transform="translate(46 -46) rotate(45)">
      <Isecak pts={[[-38, 26], [-38, -20], [-14, -44], [-14, -12], [14, -12], [14, -44], [38, -20], [38, 26], [0, 40]]} boja={P.siva} seed={`${seed}-g`} senka="mala" amp={1} korak={10} />
    </g>
  </g>
);

export const Knjiga: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={[[-70, -40], [0, -30], [70, -40], [70, 40], [0, 50], [-70, 40]]} boja={P.nebo} seed={`${seed}-k`} />
    <Crta pts={[[0, -30], [0, 50]]} seed={`${seed}-h`} boja={P.belo} debljina={4} />
  </g>
);

export const Igla: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={krugTacke(0, 0, 44, 16)} boja={P.roze} seed={`${seed}-k`} />
    {[-20, 0, 20].map((y, i) => (
      <Crta key={i} pts={[[-38, y - 8], [38, y + 8]]} seed={`${seed}-n${i}`} boja="#B8457A" debljina={3} />
    ))}
    <Crta pts={[[20, -40], [70, -85]]} seed={`${seed}-i`} boja={P.siva} debljina={5} />
  </g>
);

export const Upitnik: React.FC<{ seed: string; velicina?: number; boja?: string }> = ({ seed, velicina = 1, boja = P.zlatna400 }) => {
  const b = useBoil();
  return (
    <g transform={`scale(${velicina})`}>
      <Isecak pts={krugTacke(0, 0, 92, 18)} boja={P.belo} seed={`${seed}-b`} />
      <Isecak pts={[[-30, 70], [-60, 120], [10, 84]]} boja={P.belo} seed={`${seed}-r`} senka="bez" />
      <text x={0} y={46} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={150} fill={boja} transform={`rotate(${(b % 2) * 2 - 1})`}>
        ?
      </text>
    </g>
  );
};

/** POEN je zapis, ne novac: kartončić iz kartoteke sa zelenim žigom. */
export const Kartoncic: React.FC<{ seed: string; zig: number }> = ({ seed, zig }) => {
  const b = useBoil();
  const sz = zig <= 0 ? 0 : zig;
  return (
    <g>
      <Isecak pts={pravougaonik(-150, -95, 300, 190)} boja={P.belo} seed={`${seed}-k`} amp={1.6} />
      <Crta pts={[[-150, -52], [150, -52]]} seed={`${seed}-crv`} boja={P.korala} debljina={3} amp={0.6} />
      {[-18, 14, 46].map((y, i) => (
        <Crta key={i} pts={[[-130, y], [130, y]]} seed={`${seed}-l${i}`} boja="#9DB7D5" debljina={2.5} amp={0.6} />
      ))}
      <text x={-128} y={-64} fontFamily={RUKOPIS} fontWeight={700} fontSize={34} fill={P.siva}>
        zapis
      </text>
      <text x={-128} y={8} fontFamily={RUKOPIS} fontWeight={700} fontSize={44} fill={P.tekst}>
        pomoć komšiji
      </text>
      {sz > 0 && (
        <g transform={`translate(88 44) rotate(-12) scale(${(1 + Math.max(0, 1 - sz) * 0.8).toFixed(3)})`} opacity={Math.min(1, sz * 1.5)}>
          <path d={drhtaviPut(krugTacke(0, 0, 56, 20), `${seed}-z-${b}`, 1.6)} fill="none" stroke={P.zelena700} strokeWidth={6} />
          <path d={drhtaviPut(krugTacke(0, 0, 45, 18), `${seed}-z2-${b}`, 1.2)} fill="none" stroke={P.zelena700} strokeWidth={2.5} />
          <text x={0} y={12} textAnchor="middle" fontFamily="'Noto Sans'" fontWeight={900} fontSize={31} fill={P.zelena700} letterSpacing={1}>
            POEN
          </text>
        </g>
      )}
    </g>
  );
};

export const Sunce: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`rotate(${f * 0.4})`}>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <Isecak
            key={i}
            pts={[[Math.cos(a - 0.12) * 78, Math.sin(a - 0.12) * 78], [Math.cos(a) * 120, Math.sin(a) * 120], [Math.cos(a + 0.12) * 78, Math.sin(a + 0.12) * 78]]}
            boja={P.zlatna400}
            seed={`${seed}-z${i}`}
            senka="mala"
            korak={14}
          />
        );
      })}
      <Isecak pts={krugTacke(0, 0, 76)} boja={P.sunce} seed={`${seed}-s`} />
    </g>
  );
};

export const Drvo: React.FC<{ seed: string; boja?: string; visina?: number }> = ({ seed, boja = P.zelena500, visina = 1 }) => (
  <g transform={`scale(${visina})`}>
    <Isecak pts={pravougaonik(-12, -80, 24, 80)} boja="#8A5A34" seed={`${seed}-s`} />
    <Isecak pts={krugTacke(0, -150, 80, 18, 92)} boja={boja} seed={`${seed}-k`} amp={4} />
  </g>
);

/** Natpis rukom na papirnoj etiketi. */
export const Etiketa: React.FC<{ seed: string; tekst: string; boja?: string; pozadina?: string; velicina?: number }> = ({
  seed,
  tekst,
  boja = P.tekst,
  pozadina = P.belo,
  velicina = 58,
}) => {
  const w = tekst.length * velicina * 0.42 + 40;
  return (
    <g>
      <Isecak pts={pravougaonik(-w / 2, -velicina * 0.72, w, velicina * 1.1)} boja={pozadina} seed={`${seed}-e`} senka="mala" amp={1.6} />
      <text x={0} y={velicina * 0.18} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={velicina} fill={boja}>
        {tekst}
      </text>
    </g>
  );
};

/** Gradska kuća (Županija) — prepoznatljiva žuta zgrada sa kulom. */
export const Zupanija: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={[[-26, -330], [0, -390], [26, -330]]} boja={P.zelena700} seed={`${seed}-v`} />
    <Isecak pts={pravougaonik(-40, -330, 80, 150)} boja={P.sunce} seed={`${seed}-k`} />
    <Isecak pts={krugTacke(0, -280, 18, 10)} boja={P.belo} seed={`${seed}-sat`} senka="bez" />
    <Isecak pts={[[-230, -170], [0, -210], [230, -170], [230, 0], [-230, 0]]} boja={P.sunce} seed={`${seed}-z`} />
    <Isecak pts={[[-240, -168], [0, -222], [240, -168], [230, -160], [0, -206], [-230, -160]]} boja={P.korala600} seed={`${seed}-kr`} senka="mala" />
    {[-180, -120, -60, 60, 120, 180].map((x, i) => (
      <g key={i}>
        <Isecak pts={pravougaonik(x - 16, -140, 32, 50)} boja="#2b3a2f" seed={`${seed}-g${i}`} senka="bez" amp={1} />
        <Isecak pts={pravougaonik(x - 16, -70, 32, 50)} boja="#2b3a2f" seed={`${seed}-d${i}`} senka="bez" amp={1} />
      </g>
    ))}
    <Isecak pts={[[-26, 0], [-26, -80], [0, -104], [26, -80], [26, 0]]} boja={P.zelena900} seed={`${seed}-v2`} senka="bez" />
  </g>
);

export const Crkva: React.FC<{ seed: string; boja?: string }> = ({ seed, boja = P.belo }) => (
  <g>
    <Isecak pts={[[-36, -250], [0, -370], [36, -250]]} boja={P.zelena700} seed={`${seed}-v`} />
    <Isecak pts={pravougaonik(-44, -250, 88, 250)} boja={boja} seed={`${seed}-t`} />
    <Isecak pts={[[-18, -150], [-18, -190], [0, -208], [18, -190], [18, -150]]} boja="#2b3a2f" seed={`${seed}-p`} senka="bez" amp={1} />
    <Isecak pts={krugTacke(0, -225, 14, 10)} boja={P.zlatna400} seed={`${seed}-s`} senka="bez" />
  </g>
);

export const Oblak: React.FC<{ seed: string }> = ({ seed }) => (
  <g>
    <Isecak pts={krugTacke(-60, 10, 55, 14)} boja={P.belo} seed={`${seed}-1`} senka="mala" />
    <Isecak pts={krugTacke(10, -20, 70, 16)} boja={P.belo} seed={`${seed}-2`} senka="mala" />
    <Isecak pts={krugTacke(80, 12, 50, 14)} boja={P.belo} seed={`${seed}-3`} senka="mala" />
    <Isecak pts={pravougaonik(-100, 10, 200, 50)} boja={P.belo} seed={`${seed}-4`} senka="bez" />
  </g>
);
