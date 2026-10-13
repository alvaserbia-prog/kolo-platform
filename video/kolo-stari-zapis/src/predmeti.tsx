// Predmeti slikovnice. Svaki je crtan oko svoje tačke oslonca (obično dno, sredina).
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./paleta";
import { RUKOPIS, SANS, SERIF } from "./fontovi";
import { Linija, Oblik, elipsa, kutija } from "./alat";

// ── Tegla zimnice ────────────────────────────────────────────────────────
export type Vrsta = "ajvar" | "tursija" | "pekmez" | "sok";
const SADRZAJ: Record<Vrsta, string> = { ajvar: P.ajvar, tursija: P.tursija, pekmez: P.pekmez, sok: P.sok };
const KRPA: Record<Vrsta, string> = { ajvar: P.ajvar, tursija: P.zelenaTamna, pekmez: P.plava, sok: P.oker };

export const Tegla: React.FC<{
  vrsta?: Vrsta;
  natpis?: string;
  s?: number;
  prasina?: number; // 0–1
  puna?: number; // 0–1
  flasa?: boolean;
}> = ({ vrsta = "ajvar", natpis, s = 1, prasina = 0, puna = 1, flasa }) => {
  const sad = SADRZAJ[vrsta];
  if (flasa) {
    return (
      <g transform={`scale(${s})`}>
        <Oblik d="M-30,0 L-30,-92 C-30,-108 -12,-114 -12,-126 L-12,-150 L12,-150 L12,-126 C12,-114 30,-108 30,-92 L30,0Z" boja={P.staklo} tekstura={0.1} debljina={3.5} />
        <path d="M-26,-4 L-26,-88 C-26,-100 -10,-108 -8,-118 L8,-118 C10,-108 26,-100 26,-88 L26,-4Z" fill={sad} opacity={0.9} />
        <rect x={-12} y={-162} width={24} height={14} rx={3} fill={KRPA[vrsta]} stroke={P.mastilo} strokeWidth={3} />
        <path d="M-22,-90 L-22,-12" stroke="#fff" strokeWidth={6} opacity={0.35} strokeLinecap="round" />
        {prasina > 0 && <rect x={-32} y={-164} width={64} height={166} fill="#8a8274" opacity={prasina * 0.45} style={{ mixBlendMode: "multiply" }} />}
      </g>
    );
  }
  const vrhSad = -112 + (1 - puna) * 100;
  return (
    <g transform={`scale(${s})`}>
      {/* staklo */}
      <Oblik d="M-44,-8 C-50,-40 -50,-92 -44,-112 C-40,-120 40,-120 44,-112 C50,-92 50,-40 44,-8 C40,2 -40,2 -44,-8Z" boja={P.staklo} tekstura={0.1} debljina={3.5} />
      {/* sadržaj */}
      {puna > 0 && (
        <path
          d={`M-40,-10 C-45,-40 -45,${vrhSad + 10} -42,${vrhSad} C-20,${vrhSad - 4} 20,${vrhSad + 4} 42,${vrhSad} C45,${vrhSad + 10} 45,-40 40,-10 C36,-2 -36,-2 -40,-10Z`}
          fill={sad}
        />
      )}
      {puna > 0 && vrsta === "tursija" && (
        <g opacity={0.85}>
          <ellipse cx={-14} cy={-40} rx={12} ry={24} fill={P.zelenaPrigusena} />
          <ellipse cx={16} cy={-60} rx={10} ry={20} fill={P.paprika} />
          <circle cx={-10} cy={-86} r={10} fill={P.oker} />
        </g>
      )}
      {puna > 0 && vrsta === "ajvar" && (
        <g opacity={0.5}>
          {[[-20, -30], [10, -52], [-8, -76], [22, -24], [-26, -60]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r={4} fill={P.ajvarTamni} />
          ))}
        </g>
      )}
      {/* odsjaj */}
      <path d="M-34,-96 C-38,-70 -38,-40 -32,-18" stroke="#fff" strokeWidth={7} opacity={0.45} fill="none" strokeLinecap="round" />
      {/* poklopac sa karirom krpom */}
      <Oblik d="M-50,-116 C-54,-130 -40,-140 0,-140 C40,-140 54,-130 50,-116 C54,-104 48,-100 36,-104 C20,-98 -20,-98 -36,-104 C-48,-100 -54,-104 -50,-116Z" boja={KRPA[vrsta]} debljina={3.5} />
      <g opacity={0.55}>
        {[-32, -12, 8, 28].map((xx) => (
          <line key={xx} x1={xx} y1={-138} x2={xx} y2={-102} stroke={P.krem} strokeWidth={5} />
        ))}
        <line x1={-50} y1={-120} x2={50} y2={-120} stroke={P.krem} strokeWidth={5} />
      </g>
      <path d="M-46,-110 C-20,-104 20,-104 46,-110" fill="none" stroke={P.mastilo} strokeWidth={3} />
      {/* etiketa */}
      {natpis !== undefined && (
        <g>
          <Oblik d={kutija(-32, -76, 64, 40, 5)} boja={P.krem} debljina={2.5} tekstura={0.15} />
          <text x={0} y={-50} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={natpis.length > 6 ? 17 : 22} fill={P.mastilo}>
            {natpis}
          </text>
        </g>
      )}
      {prasina > 0 && (
        <g opacity={prasina}>
          <path d="M-46,-114 C-50,-90 -50,-40 -44,-8 C-40,2 40,2 44,-8 C50,-40 50,-90 46,-114Z" fill="#9b937f" opacity={0.42} style={{ mixBlendMode: "multiply" }} />
          <ellipse cx={0} cy={-136} rx={46} ry={8} fill="#b9b09a" opacity={0.8} />
          <path d="M40,-130 Q60,-150 72,-128 M52,-140 L70,-150" stroke="#cfc8b6" strokeWidth={1.5} fill="none" />
        </g>
      )}
    </g>
  );
};

// ── Kuhinja ──────────────────────────────────────────────────────────────
export const Lonac: React.FC<{ s?: number; naopako?: boolean; para?: boolean; mesanje?: number }> = ({ s = 1, naopako, para, mesanje = 0 }) => {
  const f = useCurrentFrame();
  if (naopako) {
    return (
      <g transform={`scale(${s})`}>
        <Oblik d="M-140,0 C-146,-60 -140,-140 -128,-170 C-60,-184 60,-184 128,-170 C140,-140 146,-60 140,0 C80,10 -80,10 -140,0Z" boja="#8C98A0" />
        <Oblik d="M-160,-4 C-80,14 80,14 160,-4 C150,10 -150,10 -160,-4Z" boja="#6F7B84" debljina={3.5} />
        <Oblik d="M-20,-178 C-24,-200 24,-200 20,-178Z" boja="#6F7B84" debljina={3.5} />
        <path d="M-120,-40 C-124,-90 -118,-130 -110,-150" stroke="#fff" strokeWidth={8} opacity={0.3} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  const ka = Math.sin(mesanje * Math.PI * 2);
  return (
    <g transform={`scale(${s})`}>
      {para &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 20) % 60) / 60;
          return (
            <path
              key={i}
              d={`M${-60 + i * 55},${-190 - t * 120} q${14 + Math.sin(t * 6 + i) * 10},-30 0,-60 q-16,-30 0,-60`}
              stroke="#fff"
              strokeWidth={10}
              fill="none"
              opacity={(1 - t) * 0.55}
              strokeLinecap="round"
              filter="url(#blur6)"
            />
          );
        })}
      {/* drške */}
      <Oblik d="M-176,-150 C-196,-150 -196,-120 -176,-118 L-150,-118 L-150,-150Z" boja="#6F7B84" debljina={3.5} />
      <Oblik d="M176,-150 C196,-150 196,-120 176,-118 L150,-118 L150,-150Z" boja="#6F7B84" debljina={3.5} />
      <Oblik d="M-156,-176 C-160,-120 -150,-40 -140,0 C-80,12 80,12 140,0 C150,-40 160,-120 156,-176Z" boja="#8C98A0" />
      <Oblik d={elipsa(0, -176, 158, 26)} boja="#6F7B84" debljina={4} />
      <Oblik d={elipsa(0, -172, 140, 18)} boja={P.ajvar} debljina={0} ivica={false} tekstura={0.4} />
      <path d="M-130,-60 C-136,-100 -134,-140 -126,-160" stroke="#fff" strokeWidth={8} opacity={0.3} fill="none" strokeLinecap="round" />
      {/* varjača */}
      <g transform={`translate(${ka * 40} -176) rotate(${18 + ka * 10})`}>
        <Oblik d="M-8,-230 L8,-230 L10,0 C26,6 26,40 0,44 C-26,40 -26,6 -10,0Z" boja={P.drvoSvetlo} debljina={3.5} />
      </g>
    </g>
  );
};

export const Kanta: React.FC<{ s?: number; otvor?: number }> = ({ s = 1, otvor = 0 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-80,0 L-92,-190 L92,-190 L80,0Z" boja="#7E8B80" />
    {[-50, -16, 18, 52].map((xx) => (
      <line key={xx} x1={xx * 1.05} y1={-170} x2={xx * 0.9} y2={-20} stroke={P.mastilo} strokeWidth={3} opacity={0.35} />
    ))}
    <g transform={`translate(-96 -192) rotate(${-otvor * 70})`}>
      <Oblik d="M0,0 C0,-24 192,-24 192,0 L192,6 L0,6Z" boja="#6B776D" debljina={3.5} />
      <Oblik d="M80,-14 C80,-30 112,-30 112,-14Z" boja="#6B776D" debljina={3} />
    </g>
  </g>
);

export const Sto: React.FC<{ w?: number; h?: number; stolnjak?: string; vez?: boolean }> = ({ w = 800, h = 260, stolnjak = P.krem, vez = true }) => (
  <g>
    <Oblik d={`M${-w / 2 + 30},0 L${-w / 2 + 44},${h} L${-w / 2 + 70},${h} L${-w / 2 + 70},0Z`} boja={P.drvo} />
    <Oblik d={`M${w / 2 - 30},0 L${w / 2 - 44},${h} L${w / 2 - 70},${h} L${w / 2 - 70},0Z`} boja={P.drvo} />
    <Oblik d={`M${-w / 2},-10 L${w / 2},-10 L${w / 2 + 16},90 L${-w / 2 - 16},90Z`} boja={stolnjak} />
    {vez && (
      <>
        <path d={`M${-w / 2 - 10},70 L${w / 2 + 10},70`} stroke={P.vez} strokeWidth={10} strokeDasharray="12 8" />
        {Array.from({ length: Math.floor(w / 80) }, (_, i) => (
          <g key={i} transform={`translate(${-w / 2 + 40 + i * 80} 38)`}>
            <path d="M0,-14 L10,0 L0,14 L-10,0Z" fill={P.vez} opacity={0.85} />
            <circle cx={0} cy={0} r={3} fill={P.krem} />
          </g>
        ))}
      </>
    )}
  </g>
);

export const Tanjir: React.FC<{ s?: number; hrana?: boolean }> = ({ s = 1, hrana }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={elipsa(0, 0, 64, 20)} boja={P.belo} debljina={3.5} tekstura={0.1} />
    <ellipse cx={0} cy={0} rx={40} ry={11} fill="none" stroke={P.plava} strokeWidth={3} opacity={0.6} />
    {hrana && (
      <>
        <ellipse cx={-10} cy={-4} rx={26} ry={8} fill={P.ajvar} />
        <ellipse cx={18} cy={-2} rx={14} ry={6} fill={P.oker} />
      </>
    )}
  </g>
);

export const Hleb: React.FC = () => (
  <g>
    <Oblik d="M-70,0 C-80,-50 -30,-70 0,-70 C30,-70 80,-50 70,0 C40,8 -40,8 -70,0Z" boja={P.oker} />
    <Linija d="M-40,-44 Q-30,-30 -24,-20" debljina={3} opacity={0.6} />
    <Linija d="M0,-54 Q6,-38 8,-26" debljina={3} opacity={0.6} />
    <Linija d="M36,-44 Q30,-30 28,-20" debljina={3} opacity={0.6} />
  </g>
);

export const Paprika: React.FC<{ s?: number; rot?: number; pecena?: number; boja?: string }> = ({ s = 1, rot = 0, pecena = 0, boja = P.paprika }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <Oblik d="M-14,-60 C-40,-50 -40,10 -20,50 C-10,70 10,70 18,48 C34,10 34,-50 12,-60 C4,-64 -6,-64 -14,-60Z" boja={boja} debljina={3.5} />
    <path d="M-10,-50 C-22,-20 -20,20 -10,44" stroke="#fff" strokeWidth={6} opacity={0.3} fill="none" strokeLinecap="round" />
    <Oblik d="M-10,-60 C-8,-76 0,-86 10,-92 L14,-86 C6,-80 4,-70 6,-60Z" boja={P.zelenaTamna} debljina={3} />
    {pecena > 0 && (
      <g opacity={pecena}>
        <ellipse cx={-8} cy={-20} rx={10} ry={6} fill={P.mastilo} opacity={0.55} />
        <ellipse cx={10} cy={20} rx={8} ry={10} fill={P.mastilo} opacity={0.5} />
        <ellipse cx={-12} cy={36} rx={7} ry={5} fill={P.mastilo} opacity={0.45} />
      </g>
    )}
  </g>
);

export const Sporet: React.FC<{ vatra?: boolean }> = ({ vatra = true }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Oblik d="M-190,0 L-190,-300 L190,-300 L190,0Z" boja={P.krem} />
      <Oblik d={kutija(-200, -330, 400, 40, 8)} boja="#4B4B4B" />
      <Oblik d={kutija(-150, -250, 130, 110, 10)} boja="#565656" />
      {vatra && (
        <g>
          <rect x={-136} y={-236} width={102} height={82} rx={8} fill="#2a1a10" />
          {[0, 1, 2].map((i) => {
            const t = Math.sin((f + i * 7) / 4) * 6;
            return <path key={i} d={`M${-120 + i * 34},-160 Q${-110 + i * 34 + t},-200 ${-100 + i * 34},-160Z`} fill={i === 1 ? "#F5B842" : "#E0664A"} opacity={0.9} />;
          })}
          <rect x={-136} y={-236} width={102} height={82} rx={8} fill="url(#toplaSvetlost)" />
        </g>
      )}
      <Oblik d={kutija(20, -250, 130, 110, 10)} boja="#565656" />
      <Oblik d={kutija(-150, -110, 300, 80, 10)} boja="#6a6a6a" />
      {[-100, 0, 100].map((xx) => (
        <circle key={xx} cx={xx} cy={-70} r={8} fill={P.oker} stroke={P.mastilo} strokeWidth={3} />
      ))}
    </g>
  );
};

// ── Kuća, dvorište, ulica ───────────────────────────────────────────────
/** Vojvođanska kuća sa zabatom na ulicu (ušorena), zelenim škurama. */
export const Kuca: React.FC<{ s?: number; zid?: string; svetlo?: number; prozorLik?: React.ReactNode }> = ({ s = 1, zid = P.zid, svetlo = 0, prozorLik }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-160,0 L-160,-240 L0,-400 L160,-240 L160,0Z" boja={zid} />
    <Oblik d="M-184,-226 L0,-420 L184,-226 L160,-226 L0,-392 L-160,-226Z" boja={P.crep} />
    {/* zabat: ukras */}
    <Oblik d={elipsa(0, -300, 22, 22)} boja={P.krem} debljina={3} />
    <circle cx={0} cy={-300} r={8} fill={P.zelenaTamna} />
    {/* dva prozora sa škurama */}
    {[-80, 80].map((px) => (
      <g key={px}>
        <Oblik d={kutija(px - 38, -190, 76, 100, 4)} boja={svetlo ? "#F7DC8C" : "#6E8A95"} debljina={3.5} tekstura={0.15} />
        {svetlo > 0 && <rect x={px - 38} y={-190} width={76} height={100} fill="#FFE9A8" opacity={svetlo * 0.6} filter="url(#blur6)" />}
        {px > 0 && prozorLik && <g transform={`translate(${px} -90)`}>{prozorLik}</g>}
        <Linija d={`M${px},-190 L${px},-90 M${px - 38},-140 L${px + 38},-140`} debljina={3.5} />
        <Oblik d={kutija(px - 62, -194, 24, 108, 3)} boja={P.zelenaPrigusena} debljina={3} />
        <Oblik d={kutija(px + 38, -194, 24, 108, 3)} boja={P.zelenaPrigusena} debljina={3} />
        <Oblik d={kutija(px - 46, -88, 92, 12, 2)} boja={P.krem} debljina={3} />
      </g>
    ))}
    <Oblik d={kutija(-160, -30, 320, 30, 2)} boja={P.drvoSvetlo} debljina={3} tekstura={0.3} />
  </g>
);

export const Drvo: React.FC<{ s?: number; boja?: string; jesen?: boolean }> = ({ s = 1, boja = P.zelenaPrigusena, jesen }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-16,0 C-12,-60 -14,-120 -20,-170 L20,-170 C14,-120 12,-60 16,0Z" boja={P.drvoTamno} />
    <Oblik d="M-110,-180 C-150,-250 -90,-330 -20,-320 C20,-380 120,-350 120,-270 C170,-240 150,-160 90,-150 C60,-120 -60,-120 -110,-180Z" boja={jesen ? P.oker : boja} />
    {jesen && <Oblik d="M-60,-200 C-80,-250 -30,-290 10,-270 C40,-300 90,-270 80,-230 C100,-200 60,-170 20,-180 C-10,-160 -50,-170 -60,-200Z" boja={P.paprika} opacity={0.6} ivica={false} />}
  </g>
);

export const Kapija: React.FC<{ otvor?: number }> = ({ otvor = 0 }) => (
  <g>
    <Oblik d="M-190,0 L-190,-330 L-150,-330 L-150,0Z" boja={P.zid} />
    <Oblik d="M150,0 L150,-330 L190,-330 L190,0Z" boja={P.zid} />
    <Oblik d="M-210,-330 C-120,-400 120,-400 210,-330 L210,-310 C120,-376 -120,-376 -210,-310Z" boja={P.crep} />
    <g transform={`translate(-150 0) scale(${1 - otvor * 0.75} 1)`}>
      <Oblik d="M0,0 L0,-290 C60,-310 150,-310 150,-290 L150,0Z" boja={P.zelenaPrigusena} />
      {[30, 60, 90, 120].map((xx) => (
        <line key={xx} x1={xx} y1={-296} x2={xx} y2={-4} stroke={P.mastilo} strokeWidth={3} opacity={0.35} />
      ))}
    </g>
    <g transform={`translate(150 0) scale(${-(1 - otvor * 0.75)} 1)`}>
      <Oblik d="M0,0 L0,-290 C60,-310 150,-310 150,-290 L150,0Z" boja={P.zelenaPrigusena} />
      {[30, 60, 90, 120].map((xx) => (
        <line key={xx} x1={xx} y1={-296} x2={xx} y2={-4} stroke={P.mastilo} strokeWidth={3} opacity={0.35} />
      ))}
    </g>
  </g>
);

/** Stari auto (fića), sa strane, točkovi se okreću. */
export const Auto: React.FC<{ s?: number; boja?: string; tockovi?: number; koferi?: boolean }> = ({ s = 1, boja = "#C9442C", tockovi = 0, koferi }) => (
  <g transform={`scale(${s})`}>
    {koferi && (
      <>
        <Oblik d={kutija(-110, -262, 90, 34, 5)} boja={P.drvo} debljina={3.5} />
        <Oblik d={kutija(-10, -268, 110, 40, 5)} boja={P.oker} debljina={3.5} />
        <Linija d="M-150,-226 L140,-226" debljina={5} />
      </>
    )}
    <Oblik d="M-200,-40 C-210,-100 -170,-120 -130,-126 C-110,-200 -60,-226 20,-226 C90,-226 130,-190 150,-126 C200,-118 214,-90 206,-40Z" boja={boja} />
    <Oblik d="M-110,-132 C-94,-190 -60,-210 -10,-210 L-10,-132Z" boja={P.nebo} debljina={3.5} />
    <Oblik d="M10,-132 L10,-210 C70,-210 110,-190 128,-132Z" boja={P.nebo} debljina={3.5} />
    <Oblik d={kutija(-214, -54, 60, 18, 6)} boja="#bbb" debljina={3} />
    <Oblik d={kutija(160, -54, 56, 18, 6)} boja="#bbb" debljina={3} />
    <Oblik d={elipsa(196, -86, 12, 14)} boja="#FFE9A8" debljina={3} />
    {[-120, 120].map((tx) => (
      <g key={tx} transform={`translate(${tx} -30) rotate(${tockovi})`}>
        <Oblik d={elipsa(0, 0, 40, 40)} boja="#333" debljina={4} tekstura={0} />
        <circle r={18} fill="#999" stroke={P.mastilo} strokeWidth={3} />
        <line x1={-18} y1={0} x2={18} y2={0} stroke={P.mastilo} strokeWidth={3} />
        <line x1={0} y1={-18} x2={0} y2={18} stroke={P.mastilo} strokeWidth={3} />
      </g>
    ))}
  </g>
);

export const Kofer: React.FC<{ boja?: string; s?: number }> = ({ boja = P.drvo, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-60, -110, 120, 110, 10)} boja={boja} />
    <Oblik d="M-20,-110 L-20,-130 L20,-130 L20,-110" boja="none" debljina={6} tekstura={0} />
    <Linija d="M-60,-60 L60,-60" debljina={3} opacity={0.5} />
    <rect x={-8} y={-66} width={16} height={12} fill={P.oker} stroke={P.mastilo} strokeWidth={2.5} />
  </g>
);

export const Merdevine: React.FC<{ h?: number }> = ({ h = 560 }) => (
  <g>
    <Oblik d={`M-70,0 L-40,${-h} L-26,${-h} L-56,0Z`} boja={P.drvoSvetlo} debljina={3.5} />
    <Oblik d={`M50,0 L40,${-h} L54,${-h} L64,0Z`} boja={P.drvoSvetlo} debljina={3.5} />
    {Array.from({ length: Math.floor(h / 70) }, (_, i) => {
      const y = -40 - i * 70;
      const t = -y / h;
      return <Linija key={i} d={`M${-62 + 30 * t},${y} L${56 - 10 * t},${y}`} debljina={9} boja={P.drvoTamno} />;
    })}
  </g>
);

export const Kosilica: React.FC<{ tockovi?: number }> = ({ tockovi = 0 }) => (
  <g>
    <Linija d="M60,-60 L200,-260" debljina={10} boja={P.mastilo} />
    <Linija d="M170,-230 L220,-266" debljina={12} boja={P.mastilo} />
    <Oblik d="M-100,-20 C-104,-70 -60,-90 0,-90 C60,-90 104,-70 100,-20Z" boja={P.zelenaTamna} />
    <Oblik d={kutija(-40, -120, 80, 34, 6)} boja={P.ajvar} debljina={3.5} />
    {[-70, 70].map((tx) => (
      <g key={tx} transform={`translate(${tx} -18) rotate(${tockovi})`}>
        <Oblik d={elipsa(0, 0, 22, 22)} boja="#333" debljina={3.5} tekstura={0} />
        <line x1={-10} y1={0} x2={10} y2={0} stroke="#aaa" strokeWidth={3} />
      </g>
    ))}
  </g>
);

/** Čaša soka. */
export const Casa: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <Oblik d="M-22,0 L-28,-70 L28,-70 L22,0Z" boja={P.staklo} debljina={3} tekstura={0} />
    <path d="M-23,-6 L-27,-54 L27,-54 L23,-6Z" fill={P.sok} opacity={0.9} />
    <path d="M-20,-60 L-16,-8" stroke="#fff" strokeWidth={4} opacity={0.5} />
  </g>
);

export const Posluzavnik: React.FC = () => (
  <g>
    <Oblik d="M-110,0 C-110,-14 110,-14 110,0 C110,10 -110,10 -110,0Z" boja={P.drvoSvetlo} debljina={3.5} />
    <g transform="translate(-50 -4)">
      <Casa />
    </g>
    <g transform="translate(10 -4)">
      <Casa />
    </g>
    <g transform="translate(66 -2)">
      <Tegla vrsta="sok" flasa s={0.7} />
    </g>
  </g>
);

// ── Telefon sa oglasom na KOLU ───────────────────────────────────────────
export const Telefon: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-150, -300, 300, 600, 40)} boja="#2D2A28" debljina={5} tekstura={0.1} />
    <rect x={-132} y={-270} width={264} height={540} rx={20} fill={P.belo} stroke={P.mastilo} strokeWidth={2} />
    <rect x={-30} y={-290} width={60} height={8} rx={4} fill="#555" />
    <g>{children}</g>
  </g>
);

/** Kartica oglasa na ekranu telefona (koordinate unutar ekrana 264×540, centar 0,0). */
export const EkranOglas: React.FC<{ faza: number; slovaNaslova: number; objavljen: number }> = ({ faza, slovaNaslova, objavljen }) => {
  const naslov = "Domaći ajvar, po bakinom receptu";
  const vidljiv = naslov.slice(0, Math.max(0, Math.floor(slovaNaslova)));
  return (
    <g>
      {/* traka aplikacije */}
      <rect x={-132} y={-270} width={264} height={56} rx={20} fill={P.zelena700} />
      <rect x={-132} y={-240} width={264} height={26} fill={P.zelena700} />
      <text x={-110} y={-234} fontFamily={SANS} fontWeight={900} fontSize={26} fill="#fff" letterSpacing={1}>
        KOLO
      </text>
      <text x={110} y={-234} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={18} fill={P.zelena100}>
        Pijaca
      </text>
      <text x={-110} y={-186} fontFamily={SANS} fontWeight={800} fontSize={20} fill={P.mastilo}>
        Novi oglas
      </text>
      {/* fotografija */}
      <g opacity={Math.min(1, faza * 3)}>
        <rect x={-110} y={-168} width={220} height={150} rx={10} fill="#E9D8B4" stroke={P.mastilo} strokeWidth={2} />
        <g transform="translate(-40 -30)">
          <Tegla vrsta="ajvar" s={0.82} />
        </g>
        <g transform="translate(40 -30)">
          <Tegla vrsta="ajvar" s={0.82} />
        </g>
      </g>
      {/* naslov */}
      <rect x={-110} y={-4} width={220} height={74} rx={8} fill="#fff" stroke="#d5cfc4" strokeWidth={2} />
      <foreignObject x={-104} y={0} width={208} height={70}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 19, lineHeight: 1.2, color: P.mastilo }}>
          {vidljiv}
          {slovaNaslova < naslov.length && slovaNaslova > 0 ? <span style={{ color: P.zelena500 }}>|</span> : null}
        </div>
      </foreignObject>
      {/* mesto */}
      <text x={-104} y={100} fontFamily={SANS} fontWeight={700} fontSize={17} fill={P.mastiloSvetlo}>
        ● Sombor
      </text>
      <text x={-104} y={130} fontFamily={SANS} fontWeight={700} fontSize={17} fill={P.mastiloSvetlo}>
        Domaće · bez konzervansa
      </text>
      {/* dugme */}
      <g transform={`translate(0 ${200}) scale(${1 - 0.08 * Math.max(0, Math.min(1, objavljen * 4) - Math.max(0, objavljen * 4 - 1))})`}>
        <rect x={-100} y={-28} width={200} height={56} rx={28} fill={objavljen > 0.25 ? P.zelena500 : P.zelena700} />
        <text x={0} y={9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill="#fff">
          {objavljen > 0.3 ? "✓ Objavljeno" : "Objavi oglas"}
        </text>
      </g>
    </g>
  );
};

export const Zapis: React.FC<{ od: string; ka: string; iznos: string; s?: number; napomena?: string }> = ({ od, ka, iznos, s = 1, napomena = "kako su se dogovorili" }) => (
  <g transform={`scale(${s})`}>
    <Oblik d={kutija(-250, -96, 500, 226, 10)} boja={P.belo} debljina={4} tekstura={0.2} />
    <text x={-224} y={-52} fontFamily={SANS} fontWeight={800} fontSize={22} fill={P.zelena700} letterSpacing={3}>
      ZAPIS U KOLU
    </text>
    <line x1={-226} y1={-38} x2={226} y2={-38} stroke={P.zelena700} strokeWidth={2} opacity={0.5} />
    <text x={-224} y={6} fontFamily={SERIF} fontWeight={700} fontSize={36} fill={P.mastilo}>
      {od} → {ka}
    </text>
    <text x={-224} y={62} fontFamily={SANS} fontWeight={900} fontSize={44} fill={P.zelena700}>
      {iznos}
    </text>
    <text x={-224} y={106} fontFamily={RUKOPIS} fontWeight={700} fontSize={30} fill={P.mastiloSvetlo}>
      {napomena}
    </text>
  </g>
);

export const Zig: React.FC<{ tekst: string; boja?: string; s?: number }> = ({ tekst, boja = P.zelena700, s = 1 }) => (
  <g transform={`scale(${s})`} opacity={0.88}>
    <circle r={70} fill="none" stroke={boja} strokeWidth={7} />
    <circle r={56} fill="none" stroke={boja} strokeWidth={3} />
    <text y={12} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={boja} letterSpacing={2}>
      {tekst}
    </text>
  </g>
);
