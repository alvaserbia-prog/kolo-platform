// Scena 6 — „A šta ti umeš, i šta imaš viška? Uđi na ekolo.rs i postavi svoj
// prvi oglas. Uhvati se i ti u kolo!" Isprekidana silueta „ti", telefon sa prvim
// oglasom, pa kolo sa praznim mestom koje se popuni. Na kraju poziv.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, Pt, krugTacke, napredak, pravougaonik, usePop } from "../papir";
import { SANS, RUKOPIS } from "../fontovi";
import { Bicikl, Etiketa, Igla, Kljuc, Knjiga, Korpa, Pita } from "../likovi";
import { Kolo, LogoZnak, OsobaCfg } from "../kolo";
import { Iskre, OSOBE_KOLA, Tegla } from "../prica";
import { kad, glasF, scena } from "../vreme";

const SLOVA = "ekolo.rs".split("");
const TI: OsobaCfg = { boja: P.trava, glava: { frizura: "kratka", kosa: P.kosaSmedja } };

const Ruka: React.FC<{ seed: string }> = ({ seed }) => (
  // šaka sa ispruženim kažiprstom, vrh prsta u (0,0)
  <g>
    <Isecak pts={[[-60, 260], [-70, 150], [-60, 95], [60, 95], [75, 150], [70, 260]]} boja={P.trava} seed={`${seed}-r`} />
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

const PREDMETI: { el: (s: string) => React.ReactNode; skala: number }[] = [
  { el: (s) => <Kljuc seed={s} />, skala: 0.8 },
  { el: (s) => <Pita seed={s} />, skala: 0.55 },
  { el: (s) => <Igla seed={s} />, skala: 1 },
  { el: (s) => <Knjiga seed={s} />, skala: 1 },
  { el: (s) => <Tegla seed={s} />, skala: 0.7 },
  { el: (s) => <Korpa seed={s} paradajza={5} />, skala: 0.55 },
  { el: (s) => <Bicikl seed={s} />, skala: 0.6 },
];

export const Scena6: React.FC = () => {
  const f = useCurrentFrame();
  const umes = kad(6, "umeš,");
  const viska = kad(6, "viška?");
  const udji = kad(6, "Uđi");
  const postavi = kad(6, "postavi");
  const oglas = kad(6, "oglas.");
  const uhvati = kad(6, "Uhvati");
  const ti2 = kad(6, "ti", 2);
  const kolo = kad(6, "kolo!");
  const krajGlasa = glasF(6, scena(6).glasDo - scena(6).glasOd);

  // A: silueta „ti" i predmeti oko nje
  const siluetaOde = napredak(f, postavi - 14, 12, Easing.in(Easing.cubic));
  // B: telefon sa oglasom, ruka klikne „Objavi"
  const telefon = usePop(postavi - 8, 150);
  const telefonOde = napredak(f, uhvati - 6, 14, Easing.in(Easing.cubic));
  const klikF = oglas + 2;
  const ulaz = napredak(f, klikF - 18, 14, Easing.out(Easing.cubic));
  const izlaz = napredak(f, klikF + 12, 12, Easing.in(Easing.cubic));
  const klik = f >= klikF && f < klikF + 7;
  const objavljeno = f >= klikF;
  // C: kolo sa praznim mestom
  const popunjeno = f >= kolo;
  const sjajPrazno = napredak(f, ti2 - 4, 8) * (popunjeno ? 0 : 1);
  const cta = usePop(krajGlasa + 4, 150);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* A */}
      {siluetaOde < 1 && (
        <g opacity={1 - siluetaOde} transform={`translate(0 ${siluetaOde * 300})`}>
          <Pop at={2} x={540} y={830} skala={1.9}>
            <Crta pts={[...krugTacke(0, -34, 46, 16), krugTacke(0, -34, 46, 16)[0]]} seed="s6-sg" boja={P.zelena700} debljina={5} isprekidana />
            <Crta pts={[[-54, 120], [-60, 96], [-38, 0], [38, 0], [60, 96], [54, 120]]} seed="s6-st" boja={P.zelena700} debljina={5} isprekidana />
            <text x={0} y={-16} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={60} fill={P.zelena700}>
              ?
            </text>
          </Pop>
          <Pop at={kad(6, "ti") - 2} x={540} y={1130} rot={-3}>
            <Etiketa seed="s6-ti" tekst="ti" velicina={80} boja={P.zelena900} />
          </Pop>
          {PREDMETI.map((p, i) => {
            const a = -Math.PI + (i / (PREDMETI.length - 1)) * Math.PI;
            const x = 540 + Math.cos(a) * 390;
            const y = 800 + Math.sin(a) * 330 + (i === 0 || i === PREDMETI.length - 1 ? 180 : 0);
            const at = i < 4 ? umes - 4 + i * 4 : viska - 8 + (i - 4) * 4;
            return (
              <Pop key={i} at={at} x={x} y={y} skala={p.skala} njihanje={4} faza={i}>
                {p.el(`s6-p${i}`)}
              </Pop>
            );
          })}
        </g>
      )}

      {/* ekolo.rs — svako slovo svoj isečak; ostaje do kraja */}
      {SLOVA.map((c, i) => {
        const sirine = SLOVA.map((z) => (z === "." ? 58 : 112));
        const ukupno = sirine.reduce((a, b) => a + b, 0);
        const x = 540 - ukupno / 2 + sirine.slice(0, i).reduce((a, b) => a + b, 0) + sirine[i] / 2;
        const tacka = c === ".";
        return (
          <Pop key={i} at={udji - 2 + i * 2} x={x} y={380} rot={(i % 2 ? 4 : -4) + (i % 3) - 1} njihanje={1.5} faza={i}>
            {!tacka && <Isecak pts={pravougaonik(-53, -92, 106, 144)} boja={P.belo} seed={`s6-l${i}`} amp={2} />}
            <text x={0} y={34} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={132} fill={tacka ? P.zlatna600 : P.zelena700}>
              {c}
            </text>
          </Pop>
        );
      })}

      {/* B: telefon sa prvim oglasom */}
      {telefon > 0 && telefonOde < 1 && (
        <g transform={`translate(540 ${880 + telefonOde * 900}) rotate(${-3 + (1 - telefon) * -10 + telefonOde * 12}) scale(${telefon.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-220, -360, 440, 720)} boja={P.tekst} seed="s6-tel" amp={2.4} />
          <Isecak pts={pravougaonik(-196, -320, 392, 620)} boja={P.papir} seed="s6-ekran" senka="bez" amp={1.4} />
          <Isecak pts={pravougaonik(-196, -320, 392, 70)} boja={P.zelena700} seed="s6-traka" senka="bez" amp={1} />
          <text x={-176} y={-272} fontFamily={SANS} fontWeight={900} fontSize={34} fill={P.belo}>
            KOLO · Pijaca
          </text>
          {/* kartica oglasa */}
          <Isecak pts={pravougaonik(-170, -222, 340, 380)} boja={P.belo} seed="s6-oglas" senka="mala" amp={1.4} />
          <Isecak pts={pravougaonik(-150, -204, 300, 170)} boja={P.zlatna100} seed="s6-slika" senka="bez" amp={1} />
          <g transform="translate(0 -110) scale(0.62)">
            <Tegla seed="s6-tegla" />
          </g>
          <text x={-150} y={10} fontFamily={RUKOPIS} fontWeight={700} fontSize={48} fill={P.tekst}>
            Moj prvi oglas
          </text>
          <text x={-150} y={62} fontFamily={RUKOPIS} fontWeight={700} fontSize={38} fill={P.siva}>
            Sombor · po dogovoru
          </text>
          <g transform={`translate(0 220) scale(${klik ? 0.92 : 1})`}>
            <Isecak pts={pravougaonik(-150, -44, 300, 88)} boja={objavljeno ? P.zelena500 : P.zelena700} seed="s6-dugme" amp={1.6} />
            <text x={0} y={16} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill={P.belo}>
              {objavljeno ? "Objavljeno!" : "Objavi"}
            </text>
          </g>
          {objavljeno && f < klikF + 30 && <Iskre seed="s6-isk" x={0} y={220} t={napredak(f, klikF, 30)} r={200} />}
        </g>
      )}
      {f >= klikF - 18 && izlaz < 1 && telefonOde < 1 && (
        <g transform={`translate(${interpolate(ulaz, [0, 1], [1250, 610]) + izlaz * 500} ${interpolate(ulaz, [0, 1], [1600, 1110]) + izlaz * 600 + (klik ? 12 : 0)}) rotate(-18)`}>
          <Ruka seed="s6-ruka" />
        </g>
      )}

      {/* C: kolo sa praznim mestom za tebe */}
      {f >= uhvati - 8 && (
        <g>
          <Kolo
            seed="s6-kolo"
            geo={{ cx: 540, cy: 1010, rx: 330, ry: 110, ugao: -198 + Math.max(0, f - kolo) * 1.1, skala: 1.1, n: 5 }}
            pojava={[0, 1, 2, 3, 4].map((i) => uhvati - 8 + i * 3)}
            ruke={popunjeno ? kolo + 6 : uhvati + 6}
            osobe={[...OSOBE_KOLA, TI]}
            prazna={popunjeno ? [] : [4]}
            istaknuti={{ 4: popunjeno ? Math.max(0, 1 - (f - kolo) / 30) : sjajPrazno }}
          />
          {popunjeno && f < kolo + 34 && <Iskre seed="s6-isk2" x={540} y={1000} t={napredak(f, kolo, 34)} r={420} n={12} />}
          <Pop at={uhvati} x={540} y={640} njihanje={1.2} skala={0.75 + 0.1 * Math.sin(Math.PI * napredak(f, kolo, 12, Easing.linear))}>
            <LogoZnak seed="s6-logo" r={100} />
          </Pop>
        </g>
      )}

      {/* D: poziv posle poslednje reči (titlovi su tada skinuti) */}
      {cta > 0 && (
        <g transform={`translate(540 1480) rotate(${-2 + (1 - cta) * -8}) scale(${cta.toFixed(4)})`}>
          <Isecak pts={pravougaonik(-440, -110, 880, 250)} boja={P.zelena700} seed="s6-cta" amp={3} />
          <text x={0} y={-16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={84} fill={P.belo}>
            ekolo.rs
          </text>
          <text x={0} y={56} textAnchor="middle" fontFamily={RUKOPIS} fontWeight={700} fontSize={64} fill={P.zlatna400}>
            postavi svoj prvi oglas
          </text>
          <text x={0} y={112} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={34} fill={P.zelena100}>
            besplatno · registracija oko minut
          </text>
        </g>
      )}
    </svg>
  );
};

