// Scena 4 — „Kad Fondacija pregleda tvoj prvi oglas, upisuje ti se hiljadu POENA.
// To je zapis da si nešto doprineo zajednici."
// Oglas izleti iz telefona i uveća se. Lupa Fondacije pređe preko njega, zeleni žig
// „PREGLEDANO". Ispod se ispiše zapis „Ti · prvi oglas / 1.000 POENA" sa žigom POEN.
// Na „zapis" etiketa „zapis o doprinosu, nije novac", na „zajednici" komšije oko oglasa.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, drhtaviPut, krugTacke, napredak, pravougaonik, useBoil } from "../papir";
import { Etiketa, Osoba } from "../likovi";
import { LogoZnak } from "../kolo";
import { LIKOVI, LikId } from "../prica";
import { Pecat, Srce } from "../selo";
import { Lupa, OglasKartica, Telefon, TiLik } from "../ekran";
import { SANS, RUKOPIS } from "../fontovi";
import { kad } from "../vreme";
import { TEL, TI_UGAO } from "./raspored";
import { TiOznaka } from "./Scena2";

const KARTA = { x: 540, y: 520, s: 1.22 };

/** Zapis o doprinosu: „Ti · prvi oglas / 1.000 POENA" — red u evidenciji, nikad novčić. */
const ZapisPrviOglas: React.FC<{ seed: string; pisanje: number; zig: number }> = ({ seed, pisanje, zig }) => {
  const b = useBoil();
  const id = `zp-${seed}`;
  return (
    <g>
      <Isecak pts={pravougaonik(-300, -130, 600, 260)} boja={P.belo} seed={`${seed}-k`} amp={1.6} />
      <Crta pts={[[-300, -72], [300, -72]]} seed={`${seed}-crv`} boja={P.korala} debljina={3} amp={0.6} />
      {[-6, 48, 102].map((y, i) => (
        <Crta key={i} pts={[[-280, y], [280, y]]} seed={`${seed}-l${i}`} boja="#9DB7D5" debljina={2.5} amp={0.6} />
      ))}
      <text x={-278} y={-88} fontFamily={RUKOPIS} fontWeight={700} fontSize={38} fill={P.siva}>
        zapis
      </text>
      <clipPath id={id}>
        <rect x={-290} y={-72} width={480 * pisanje} height={190} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <text x={-276} y={-20} fontFamily={RUKOPIS} fontWeight={700} fontSize={60} fill={P.tekst}>
          Ti · prvi oglas
        </text>
        <text x={-276} y={88} fontFamily={RUKOPIS} fontWeight={700} fontSize={76} fill={P.zelena700}>
          1.000 POENA
        </text>
      </g>
      {zig > 0 && (
        <g transform={`translate(214 26) rotate(-14) scale(${(1 + Math.max(0, 1 - zig) * 0.8).toFixed(3)})`} opacity={Math.min(1, zig * 1.5)}>
          <path d={drhtaviPut(krugTacke(0, 0, 62, 20), `${seed}-z-${b}`, 1.6)} fill="none" stroke={P.zelena700} strokeWidth={7} />
          <path d={drhtaviPut(krugTacke(0, 0, 50, 18), `${seed}-z2-${b}`, 1.2)} fill="none" stroke={P.zelena700} strokeWidth={3} />
          <text x={0} y={13} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={35} fill={P.zelena700} letterSpacing={1}>
            POEN
          </text>
        </g>
      )}
    </g>
  );
};

const KOMSIJE: { id: LikId; x: number; y: number }[] = [
  { id: "ana", x: 140, y: 330 },
  { id: "milan", x: 945, y: 330 },
  { id: "lazar", x: 140, y: 700 },
  { id: "marija", x: 945, y: 700 },
];

export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const fondacija = kad(4, "Fondacija");
  const pregleda = kad(4, "pregleda");
  const oglas = kad(4, "oglas,");
  const upisuje = kad(4, "upisuje");
  const hiljadu = kad(4, "hiljadu");
  const poena = kad(4, "POENA.");
  const zapis = kad(4, "zapis");
  const zajednici = kad(4, "zajednici.");

  const telOde = napredak(f, 0, 22, Easing.in(Easing.cubic));
  const izlet = napredak(f, 2, 22, Easing.out(Easing.back(1.3)));
  const kx = interpolate(izlet, [0, 1], [TEL.x, KARTA.x]);
  const ky = interpolate(izlet, [0, 1], [TEL.y - 60, KARTA.y]);
  const ks = interpolate(izlet, [0, 1], [1, KARTA.s]);
  // lupa: ulazi sa desne strane i kruži preko oglasa
  const lupaT = napredak(f, fondacija - 2, oglas - fondacija + 6, Easing.inOut(Easing.sin));
  const lupaOde = napredak(f, oglas + 8, 14, Easing.in(Easing.cubic));
  const lx = interpolate(lupaT, [0, 1], [1250, 540]) + Math.sin(lupaT * Math.PI * 3) * 90 + lupaOde * 800;
  const ly = interpolate(lupaT, [0, 1], [350, 470]) + Math.cos(lupaT * Math.PI * 3) * 60 - lupaOde * 200;
  const zig = napredak(f, oglas + 2, 8, Easing.out(Easing.cubic));
  const zapisUlaz = napredak(f, upisuje - 6, 16, Easing.out(Easing.back(1.2)));
  const pisanje = napredak(f, upisuje, hiljadu - upisuje + 20, Easing.linear);
  const poenZig = napredak(f, poena, 8, Easing.out(Easing.cubic));

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* telefon odlazi nadole */}
      {telOde < 1 && (
        <g transform={`translate(${TEL.x} ${TEL.y + telOde * 1400}) rotate(${telOde * 10})`}>
          <Telefon seed="tel" adresa="ekolo.rs/pijaca" />
        </g>
      )}

      {/* komšije — zajednica */}
      {KOMSIJE.map((k, i) => (
        <Pop key={k.id} at={zajednici - 6 + i * 3} x={k.x} y={k.y} skala={0.78} njihanje={2} faza={i}>
          <Osoba seed={`s4-${k.id}`} boja={LIKOVI[k.id].boja} glava={LIKOVI[k.id].glava} />
        </Pop>
      ))}
      {KOMSIJE.map((k, i) => (
        <Pop key={`sr${i}`} at={zajednici + 6 + i * 3} x={k.x + (k.x < 540 ? 70 : -70)} y={k.y - 90} skala={0.5}>
          <Srce seed={`s4-sr${i}`} />
        </Pop>
      ))}

      {/* oglas */}
      <g transform={`translate(${kx} ${ky}) scale(${ks}) rotate(${(1 - izlet) * -8 + Math.sin(f / 22) * 0.8})`}>
        <OglasKartica seed="s4-oglas" />
        <g transform="translate(70 -150) rotate(-12)">
          <Pecat seed="s4-pregl" tekst="PREGLEDANO" t={zig} boja={P.zelena700} velicina={34} />
        </g>
      </g>

      {/* Fondacija */}
      <Pop at={fondacija - 4} x={880} y={200} rot={4} skala={1}>
        <g transform="translate(-120 0) scale(0.42)">
          <LogoZnak seed="s4-logo" r={110} />
        </g>
        <g transform="translate(40 0)">
          <Etiketa seed="s4-fond" tekst="Fondacija" velicina={52} boja={P.zelena900} />
        </g>
      </Pop>
      {lupaOde < 1 && f >= fondacija - 2 && (
        <g transform={`translate(${lx} ${ly}) rotate(-8) scale(1.25)`}>
          <Lupa seed="s4-lupa" />
        </g>
      )}

      {/* zapis */}
      {zapisUlaz > 0 && (
        <g transform={`translate(${interpolate(zapisUlaz, [0, 1], [1500, 540])} 1045) rotate(${interpolate(zapisUlaz, [0, 1], [12, -2])})`}>
          <ZapisPrviOglas seed="s4-zapis" pisanje={pisanje} zig={poenZig} />
        </g>
      )}
      <Pop at={zapis - 2} x={420} y={1238} rot={-3}>
        <Etiketa seed="s4-zod" tekst="zapis o doprinosu" velicina={56} boja={P.zelena900} />
      </Pop>
      <Pop at={zapis + 8} x={860} y={880} rot={9} njihanje={2}>
        <Etiketa seed="s4-nn" tekst="nije novac" velicina={48} boja={P.zelena900} pozadina={P.zlatna400} />
      </Pop>

      <g transform={`translate(${TI_UGAO.x} ${TI_UGAO.y + napredak(f, 0, 20) * 400})`} opacity={1 - napredak(f, 0, 20)}>
        <g transform={`scale(${TI_UGAO.s})`}>
          <TiLik seed="s1-ti" popuna={1} />
          <TiOznaka seed="s2-nov" tekst="nov član" />
        </g>
      </g>
    </svg>
  );
};
