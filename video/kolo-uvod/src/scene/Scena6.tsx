// Scena 6 — „Uđi na sajt ekolo.rs i ponudi svoju prvu razmenu.
// Ja sam Nikola, i čekam te u KOLU." Veliko „ekolo.rs" i ruka koja klikne.
import React from "react";
import { staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, Pt, napredak, pravougaonik, usePop } from "../papir";
import { SANS, RUKOPIS } from "../fontovi";
import { Kolo, LogoZnak } from "../kolo";
import { kad, glasF, scena } from "../vreme";

const SLOVA = "ekolo.rs".split("");

const Ruka: React.FC<{ seed: string }> = ({ seed }) => (
  // šaka sa ispruženim kažiprstom, vrh prsta u (0,0)
  <g>
    <Isecak pts={[[-60, 260], [-70, 150], [-60, 95], [60, 95], [75, 150], [70, 260]]} boja={P.nebo} seed={`${seed}-r`} />
    <Isecak
      pts={[[-18, 0], [18, 0], [22, 70], [60, 60], [80, 80], [82, 120], [70, 160], [-60, 160], [-70, 110], [-60, 80], [-24, 78]]}
      boja={P.koza}
      seed={`${seed}-s`}
      korak={14}
    />
    <Crta pts={[[22, 95], [60, 92]]} seed={`${seed}-p1`} boja={P.koza2} debljina={4} />
    <Crta pts={[[25, 122], [66, 120]]} seed={`${seed}-p2`} boja={P.koza2} debljina={4} />
  </g>
);

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const sajt = kad(6, "sajt");
  const ponudi = kad(6, "ponudi");
  const ja = kad(6, "Ja");
  const cekam = kad(6, "čekam");
  const kolu = kad(6, "KOLU.");
  const krajGlasa = glasF(6, scena(6).glasDo - scena(6).glasOd);

  // ruka ulazi, klikne na „ponudi", pa izlazi
  const ulaz = napredak(f, ponudi - 20, 16, Easing.out(Easing.cubic));
  const izlaz = napredak(f, ponudi + 36, 14, Easing.in(Easing.cubic));
  const klik = f >= ponudi && f < ponudi + 7;
  const rx = interpolate(ulaz, [0, 1], [1250, 700]) + izlaz * 500;
  const ry = interpolate(ulaz, [0, 1], [1500, 860]) + izlaz * 600 + (klik ? 14 : 0);
  const dugmeOdlazi = napredak(f, ja - 12, 12, Easing.in(Easing.cubic));
  const polaroid = usePop(ja - 2, 150);
  const cta = usePop(krajGlasa + 4, 150);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <Pop at={2} x={540} y={250} njihanje={1.2}>
        <LogoZnak seed="s6-logo" r={105} />
      </Pop>
      {/* ekolo.rs — svako slovo svoj isečak */}
      {SLOVA.map((c, i) => {
        const sirine = SLOVA.map((z) => (z === "." ? 58 : 118));
        const ukupno = sirine.reduce((a, b) => a + b, 0);
        const x = 540 - ukupno / 2 + sirine.slice(0, i).reduce((a, b) => a + b, 0) + sirine[i] / 2;
        const tacka = c === ".";
        return (
          <Pop key={i} at={sajt + i * 2} x={x} y={500} rot={(i % 2 ? 4 : -4) + (i % 3) - 1} njihanje={1.5} faza={i}>
            {!tacka && <Isecak pts={pravougaonik(-56, -96, 112, 150)} boja={P.belo} seed={`s6-l${i}`} amp={2} />}
            <text x={0} y={36} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={140} fill={tacka ? P.zlatna600 : P.zelena700}>
              {c}
            </text>
          </Pop>
        );
      })}
      {/* dugme „Ponudi razmenu" */}
      {dugmeOdlazi < 1 && (
        <g opacity={1 - dugmeOdlazi} transform={`translate(0 ${dugmeOdlazi * 60})`}>
          <Pop at={ponudi - 16} x={540} y={820}>
            <g transform={`scale(${klik ? 0.93 : 1})`}>
              <Isecak pts={pravougaonik(-330, -80, 660, 160)} boja={klik ? P.zelena900 : P.zelena700} seed="s6-dug" amp={2.4} />
              <text x={0} y={22} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={66} fill={P.belo}>
                Ponudi razmenu
              </text>
            </g>
          </Pop>
          {/* talasi klika */}
          {[0, 6, 12].map((d, i) => {
            const t = napredak(f, ponudi + d, 22, Easing.out(Easing.quad));
            if (t <= 0 || t >= 1) return null;
            return <circle key={i} cx={700} cy={860} r={30 + t * 200} fill="none" stroke={P.zlatna400} strokeWidth={10 * (1 - t)} opacity={1 - t} />;
          })}
          {f >= ponudi &&
            [0, 1, 2, 3, 4].map((i) => {
              const a = -Math.PI / 2 + (i - 2) * 0.5;
              const t = napredak(f, ponudi, 10);
              const p1: Pt = [700 + Math.cos(a) * (60 + 30 * t), 860 + Math.sin(a) * (60 + 30 * t)];
              const p2: Pt = [700 + Math.cos(a) * (90 + 50 * t), 860 + Math.sin(a) * (90 + 50 * t)];
              return <Crta key={i} pts={[p1, p2]} seed={`s6-zr${i}`} boja={P.zlatna600} debljina={8} opacity={1 - napredak(f, ponudi + 10, 10)} />;
            })}
        </g>
      )}
      {izlaz < 1 && f >= ponudi - 20 && (
        <g transform={`translate(${rx} ${ry}) rotate(-18)`}>
          <Ruka seed="s6-ruka" />
        </g>
      )}
      {/* Nikola — polaroid, pa kolo sa praznim mestom „za tebe" */}
      {f >= cekam - 2 && (
        <Kolo
          seed="s6-kolo"
          geo={{ cx: 540, cy: 1195, rx: 420, ry: 75, ugao: 200 + (f - cekam) * 0.15, skala: 0.62, n: 8 }}
          pojava={[0, 1, 2, 3, 4, 5, 6, 7].map((i) => cekam + i * 2)}
          ruke={cekam + 16}
        />
      )}
      {polaroid > 0 && (
        <g transform={`translate(540 ${880 + (1 - Math.min(1, polaroid)) * 60}) rotate(${-4 + (1 - polaroid) * -12}) scale(${polaroid.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-185, -200, 370, 430)} boja={P.belo} seed="s6-pol" amp={1.6} />
          <clipPath id="s6-foto">
            <rect x={-160} y={-176} width={320} height={320} />
          </clipPath>
          <image href={staticFile("nikola.jpg")} x={-160} y={-176} width={320} height={320} clipPath="url(#s6-foto)" preserveAspectRatio="xMidYMid slice" style={{ filter: "sepia(0.18) saturate(1.05)" }} />
          <text x={0} y={200} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={62} fill={P.tekst}>
            Nikola
          </text>
          {/* selotejp */}
          <Isecak pts={pravougaonik(-70, -222, 140, 44)} boja="#F5E6B8" seed="s6-tejp" senka="bez" zrno={0.3} opacity={0.85} />
        </g>
      )}
      {/* na „KOLU" — ručno nacrtan krug oko Nikole */}
      <Crta
        pts={Array.from({ length: 33 }, (_, i): Pt => [540 + Math.cos(-Math.PI / 2 + (i / 30) * Math.PI * 2) * 245, 880 + Math.sin(-Math.PI / 2 + (i / 30) * Math.PI * 2) * 275])}
        seed="s6-krug"
        boja={P.zlatna400}
        debljina={12}
        napredak={napredak(f, kolu - 4, 16)}
        korak={40}
        amp={3}
      />
      {/* poziv na kraju, kad naracija stane (titlovi su tada skinuti) */}
      {cta > 0 && (
        <g transform={`translate(540 1470) rotate(${-2 + (1 - cta) * -8}) scale(${cta.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-420, -96, 840, 200)} boja={P.zelena700} seed="s6-cta" amp={3} />
          <text x={0} y={-6} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={80} fill={P.belo}>
            ekolo.rs
          </text>
          <text x={0} y={66} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={62} fill={P.zlatna400}>
            ponudi svoju prvu razmenu
          </text>
        </g>
      )}
    </svg>
  );
};
