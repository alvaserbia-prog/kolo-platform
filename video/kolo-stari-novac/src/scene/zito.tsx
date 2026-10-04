// Scene 1–3: žito. 1) ratar daje vreću žita grnčarki za krčag; 2) Egipat: radnici na grobnici
// faraona dobijaju platu u žitu od pisara; 3) žito se lako deli, teško nosi i vremenom pokvari.
import React from "react";
import { interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Linija, Oblik, Pop, elipsa, mesaj, napredak, useF } from "../alat";
import { Lik } from "../likovi";
import { kad } from "../vreme";
import { D, EGIPCANIN, GRNCAR, GomilaZrna, Klas, Krcag, Litice, NeboTlo, PISAR, RATAR, Sunce, Vreca } from "../drevno";

/** Polje zrelog žita uz horizont. */
const Njiva: React.FC<{ y: number; n?: number; uveo?: number; seed?: number }> = ({ y, n = 26, uveo = 0, seed = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${-40 + i * (1160 / n) + ((i * 37 + seed) % 23)} ${y + (i % 3) * 14})`}>
        <Klas h={150 + ((i * 53 + seed) % 50)} uveo={uveo} nagib={((i * 29) % 14) - 7} />
      </g>
    ))}
  </g>
);

// ── Scena 1 — „U početku ljudi su plaćali žitom.“ ─────────────────────────────
export const Scena1: React.FC = () => {
  const f = useF();
  const kPl = kad(1, "plaćali");
  const kZ = kad(1, "žitom.");
  const t = napredak(f, kPl - 2, 22);
  // vreća ide grnčarki, krčag ratar: zamena na „plaćali“
  const vx = mesaj(330, 700, t);
  const vy = mesaj(1240, 1250, t) - Math.sin(t * Math.PI) * 120;
  const kx = mesaj(760, 300, t);
  const ky = mesaj(1050, 1050, t) - Math.sin(t * Math.PI) * 90;
  const sjaj = interpolate(f, [kZ - 2, kZ + 8, kZ + 40], [0, 1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Kadar>
      <Hrapavo>
        <NeboTlo nebo="#E8D9AE" tlo="#C9A86A" horizont={820} />
        <Sunce x={820} y={360} r={70} zraci={f * 0.3} />
        <Njiva y={830} />
        <Oblik d="M-200,900 C200,880 700,890 1280,900 L1280,1400 L-200,1400Z" boja="#BE9C5E" tekstura={0.3} />
      </Hrapavo>
      <Lik x={210} y={1300} s={0.9} {...RATAR} glava={{ ...RATAR.glava, izraz: "osmeh", pogled: [5, 0] }} dr={[70 - t * 20, 20]} lr={[10, 10]} />
      <Lik x={880} y={1300} s={0.9} okreni {...GRNCAR} glava={{ ...GRNCAR.glava, izraz: t > 0.6 ? "srecna" : "osmeh", pogled: [5, 0] }} dr={[60, 30]} lr={[10, 10]} />
      <g transform={`translate(${kx} ${ky})`}>
        <Krcag s={0.85} />
      </g>
      <g transform={`translate(${vx} ${vy})`}>
        <circle cy={-120} r={190} fill="url(#toplaSvetlost)" opacity={sjaj} />
        <Vreca s={0.62} />
      </g>
    </Kadar>
  );
};

// ── Scena 2 — Egipat: radnici na grobnicama faraona dobijaju platu u žitu ─────────
/** Reljef faraona (glava sa nemes maramom) uklesan iznad ulaza u grobnicu. */
const Faraon: React.FC = () => (
  <g>
    <Oblik d="M-70,60 C-80,0 -70,-60 -40,-80 C-20,-92 20,-92 40,-80 C70,-60 80,0 70,60 L40,90 L-40,90Z" boja="#3E5F8A" debljina={3.5} tekstura={0.2} />
    {[-50, -30, -10, 10, 30, 50].map((x) => (
      <Linija key={x} d={`M${x},-70 L${x * 1.2},80`} boja={P.oker} debljina={5} opacity={0.9} />
    ))}
    <Oblik d="M-36,-40 C-36,-70 36,-70 36,-40 L36,40 C36,60 -36,60 -36,40Z" boja={D.kozaEgipat} debljina={3} tekstura={0.15} />
    <ellipse cx={-14} cy={-10} rx={6} ry={4} fill={P.mastilo} />
    <ellipse cx={14} cy={-10} rx={6} ry={4} fill={P.mastilo} />
    <Linija d="M-12,24 L12,24" debljina={3} />
    <Oblik d={elipsa(0, -60, 8, 10)} boja={P.oker} debljina={2.5} />
  </g>
);

export const Scena2: React.FC = () => {
  const f = useF();
  const kRad = kad(2, "radnici");
  const kGrob = kad(2, "grobnice");
  const kFar = kad(2, "faraona");
  const kDob = kad(2, "dobijali");
  const kPlata = kad(2, "platu");
  const udarac = f > kRad && f < kDob ? Math.max(0, Math.sin(f * 0.45)) : 0;
  const pisar = napredak(f, kDob - 14, 18);
  const sipa = napredak(f, kPlata - 4, 26);
  const kam = interpolate(f, [0, kDob], [1.08, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Kadar>
      <g transform={`translate(540 960) scale(${kam}) translate(-540 -960)`}>
        <Hrapavo>
          <NeboTlo nebo="#F0D9A2" tlo={D.pesak} horizont={1000} />
          <Sunce x={200} y={300} r={90} zraci={f * 0.3} />
          <Litice />
          <Oblik d="M-200,1000 C200,980 700,990 1280,1010 L1280,1400 L-200,1400Z" boja={D.pesakTamni} tekstura={0.3} opacity={0.6} />
        </Hrapavo>
        <Pop at={kFar - 4} x={730} y={660} skala={0.9}>
          <Faraon />
        </Pop>
        {/* radnik kleše kamen kraj ulaza */}
        <Lik
          x={420}
          y={1290}
          s={0.84}
          {...EGIPCANIN}
          glava={{ ...EGIPCANIN.glava, izraz: f >= kPlata + 10 ? "srecna" : "odlucna", pogled: f >= kDob ? [-5, 0] : [5, -1] }}
          dr={f >= kDob ? [70, 30] : [100 + udarac * 30, -60 + udarac * 25]}
          lr={f >= kDob ? [50, 30] : [40, 40]}
          drziD={f < kDob ? <Linija d="M0,0 L0,-70" debljina={10} boja={P.drvoTamno} /> : undefined}
        />
        {f >= kGrob && f < kDob && (
          <g opacity={0.8}>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={640 + ((f * 7 + i * 40) % 60)} cy={940 - ((f * 5 + i * 30) % 50)} r={6 - i} fill={D.litica} stroke={P.mastilo} strokeWidth={1.5} />
            ))}
          </g>
        )}
        {/* pisar sa korpom žita */}
        <g transform={`translate(${mesaj(600, 0, pisar)} 0)`}>
          <Lik x={900} y={1290} s={0.84} {...PISAR} glava={{ ...PISAR.glava, izraz: "mirna", pogled: [-5, 1] }} dr={[60, 40]} lr={[-20, -20]} okreni />
          <g transform={`translate(760 880) rotate(${-sipa * 55})`}>
            <Oblik d="M-80,-50 L80,-50 L60,40 L-60,40Z" boja={P.drvoSvetlo} debljina={4} />
            <GomilaZrna w={70} h={40} seed="korpa" />
          </g>
        </g>
        {/* mlaz žita u vreću radnika */}
        {sipa > 0.15 && sipa < 0.95 && (
          <g>
            {Array.from({ length: 16 }, (_, i) => (
              <ellipse key={i} cx={0} cy={0} rx={5} ry={3.5} fill={D.zitoTamno} transform={`translate(${672 + ((i * 13) % 26)} ${900 + ((f * 18 + i * 22) % 280)})`} />
            ))}
          </g>
        )}
        <g transform="translate(680 1290)">
          <Vreca s={0.5 * (0.6 + 0.4 * sipa)} otvorena />
        </g>
      </g>
    </Kadar>
  );
};

// ── Scena 3 — „Žito je lako podeliti, ali je teško za nošenje i vremenom se pokvari.“ ──
export const Scena3: React.FC = () => {
  const f = useF();
  const kPod = kad(3, "podeliti,");
  const kTes = kad(3, "teško");
  const kVr = kad(3, "vremenom");
  const kPok = kad(3, "pokvari.");
  const deli = napredak(f, kPod - 2, 18);
  const nosi = napredak(f, kTes - 10, 14);
  const vreme = napredak(f, kVr - 2, kPok - kVr + 6);
  const plesan = napredak(f, kPok - 2, 16);
  const mis = napredak(f, kPok + 6, 12);
  const korak = f >= kTes - 4 && f < kVr ? (f - kTes) * 0.22 : 0;
  // sunce i mesec proleću preko neba (vreme prolazi)
  const ug = vreme * Math.PI * 2;
  return (
    <Kadar>
      <Hrapavo>
        <NeboTlo nebo={vreme > 0.25 && vreme < 0.75 ? "#5F6E86" : "#E6D7AC"} tlo="#C9A86A" horizont={1000} />
        <Oblik d="M-200,1010 C200,990 700,1000 1280,1010 L1280,1400 L-200,1400Z" boja="#BE9C5E" tekstura={0.3} />
      </Hrapavo>
      {vreme > 0 && vreme < 1 && (
        <g>
          <g transform={`translate(${540 - Math.cos(ug) * 520} ${700 - Math.sin(ug) * 420})`}>
            <circle r={60} fill={P.zlatna} stroke={P.mastilo} strokeWidth={4} />
          </g>
          <g transform={`translate(${540 + Math.cos(ug) * 520} ${700 + Math.sin(ug) * 420})`}>
            <circle r={48} fill="#F3EFD9" stroke={P.mastilo} strokeWidth={4} />
            <circle cx={18} cy={-10} r={42} fill="#5F6E86" />
          </g>
        </g>
      )}
      {/* gomila koja se deli na tri (gornja polovina) */}
      <g opacity={1 - nosi}>
        <g transform={`translate(${540 - deli * 300} 640) scale(${1 - deli * 0.35})`}>
          <GomilaZrna w={170 * (1 - deli * 0.3)} h={110} seed="a" />
        </g>
        {deli > 0 && (
          <>
            <g transform={`translate(540 ${640}) scale(${0.65 * deli})`}>
              <GomilaZrna w={120} h={110} seed="b" />
            </g>
            <g transform={`translate(${540 + deli * 300} 640) scale(${0.65 * deli})`}>
              <GomilaZrna w={120} h={110} seed="c" />
            </g>
          </>
        )}
        {deli > 0.1 && deli < 1 && (
          <g transform={`translate(${540 - 150 + deli * 300} ${560 - Math.sin(deli * Math.PI) * 60}) rotate(${-30 + deli * 60})`}>
            <Oblik d="M-60,-20 L40,-20 C60,-20 60,20 40,20 L-60,20Z" boja={P.drvoSvetlo} debljina={3.5} />
            <Linija d="M40,0 L130,0" debljina={12} boja={P.drvo} />
          </g>
        )}
      </g>
      {/* ratar nosi tešku vreću, zatim vreća stoji i kvari se */}
      {nosi > 0 && (
        <g opacity={nosi}>
          {f < kVr ? (
            <g transform={`translate(${200 + korak * 18} 0)`}>
              <Lik x={0} y={1290} s={0.9} {...RATAR} glava={{ ...RATAR.glava, izraz: "tuzna", pogled: [4, 2] }} nagib={18} hod={korak} lr={[150, 40]} dr={[160, 30]} />
              <g transform="translate(-20 900) rotate(12)">
                <Vreca s={0.9} />
              </g>
              {[0, 1].map((i) => (
                <path key={i} d={`M${60 + i * 40},${740 + ((f * 3 + i * 15) % 40)} q8,14 0,22 q-8,-8 0,-22Z`} fill="#BFE0EA" stroke={P.mastilo} strokeWidth={2} />
              ))}
            </g>
          ) : (
            <>
              <g transform="translate(540 1290)">
                <Vreca s={1.1} plesan={plesan} />
              </g>
              {mis > 0 && (
                <g transform={`translate(${mesaj(760, 640, mis)} 1288)`}>
                  <Oblik d={elipsa(0, -26, 44, 26)} boja="#8E8A86" debljina={3.5} />
                  <Oblik d={elipsa(-36, -50, 16)} boja="#8E8A86" debljina={3} />
                  <circle cx={-48} cy={-30} r={4} fill={P.mastilo} />
                  <Linija d="M44,-20 Q80,-30 90,-60" debljina={3} />
                </g>
              )}
            </>
          )}
        </g>
      )}
    </Kadar>
  );
};
