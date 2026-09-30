// Scena 3 — „Nekoliko dana kasnije, Ani se pokvarila veš-mašina. Popravio ju je
// Lazar, majstor iz susedne ulice. Ana mu je prepisala 4.000 POENA, bez ijednog dinara."
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Defs, Pop, napredak, usePop } from "../papir";
import { Etiketa, Kljuc, spring01 } from "../likovi";
import { Kalendar, KutijaAlata, Lik, Precrtano, VesMasina, Zapis } from "../prica";
import { kad } from "../vreme";

export const Scena3: React.FC = () => {
  const f = useCurrentFrame();
  const dana = kad(3, "dana");
  const kasnije = kad(3, "kasnije,");
  const ani = kad(3, "Ani");
  const pokvarila = kad(3, "pokvarila");
  const popravio = kad(3, "Popravio");
  const lazar = kad(3, "Lazar,");
  const majstor = kad(3, "majstor");
  const ulice = kad(3, "ulice.");
  const iznos = kad(3, "4.000");
  const poena = kad(3, "POENA,");
  const bez = kad(3, "bez");
  const dinara = kad(3, "dinara.");

  // kalendar: dva lista se otcepe, pa se kalendar skloni u ugao
  const list1 = napredak(f, dana, 12, Easing.linear);
  const list2 = napredak(f, kasnije, 12, Easing.linear);
  const dan = 12 + (list1 > 0 ? 1 : 0) + (list2 > 0 ? 1 : 0);
  const list = list2 > 0 ? list2 : list1;
  const ugao = napredak(f, ani - 8, 14);
  const kalX = interpolate(ugao, [0, 1], [540, 150]);
  const kalY = interpolate(ugao, [0, 1], [560, 330]);
  const kalS = interpolate(ugao, [0, 1], [1.3, 0.6]);

  const kvar = napredak(f, pokvarila, 12);
  const popravljena = napredak(f, ulice - 4, 26, Easing.linear);
  const anaOsmeh = interpolate(kvar, [0, 1], [1, -0.9]) + popravljena * 1.9;

  // ključ doleti od Lazara do mašine i okreće se
  const kljucLet = napredak(f, lazar - 6, 14, Easing.out(Easing.cubic));
  const kljucX = interpolate(kljucLet, [0, 1], [900, 700]);
  const kljucY = interpolate(kljucLet, [0, 1], [980, 780]) - Math.sin(kljucLet * Math.PI) * 120;
  const kljucRot = f >= lazar + 8 && popravljena < 1 ? Math.sin((f - lazar) / 3) * 35 : 0;
  const kljucOde = napredak(f, iznos - 8, 10);

  const zapis = usePop(iznos - 2, 150);
  const pisanje = napredak(f, iznos + 2, 26, Easing.linear);
  const zig = spring01(f - poena);
  const zapisGore = napredak(f, bez - 6, 12);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      <Pop at={2} x={kalX} y={kalY} skala={kalS} rot={-4}>
        <Kalendar seed="s3-kal" dan={dan} list={list > 0 && list < 1 ? list : 0} />
      </Pop>

      <Pop at={ani - 4} x={540} y={860} skala={1.45}>
        <VesMasina seed="s3-ves" kvar={kvar} popravljena={popravljena} />
      </Pop>

      <Pop at={ani - 2} x={165} y={1070} skala={1.5}>
        <Lik id="ana" seed="s3-ana" osmeh={Math.max(-0.9, Math.min(1, anaOsmeh))} />
      </Pop>

      <Pop at={popravio - 2} x={915} y={1070} skala={1.5}>
        <Lik id="lazar" seed="s3-lazar" />
      </Pop>
      <Pop at={popravio + 4} x={745} y={1215} skala={0.6} rot={4}>
        <KutijaAlata seed="s3-kutija" />
      </Pop>
      {f < ulice + 60 && (
        <g opacity={1 - napredak(f, ulice + 40, 14)}>
          <Pop at={majstor - 2} x={880} y={800} rot={5} njihanje={2}>
            <Etiketa seed="s3-majstor" tekst="majstor" velicina={56} boja={P.zelena900} />
          </Pop>
        </g>
      )}

      {f >= lazar - 6 && kljucOde < 1 && (
        <g opacity={1 - kljucOde} transform={`translate(${kljucX} ${kljucY}) rotate(${-30 + kljucRot}) scale(0.9)`}>
          <Kljuc seed="s3-kljuc" />
        </g>
      )}

      {zapis > 0 && (
        <g
          transform={`translate(${interpolate(zapisGore, [0, 1], [540, 590])} ${interpolate(zapis, [0, 1], [460, 390]) - zapisGore * 20}) rotate(${-3 + (1 - zapis) * -12}) scale(${(1.1 * zapis * (1 - 0.12 * zapisGore)).toFixed(4)})`}
        >
          <Zapis seed="s3-zapis" od="Ana" ka="Lazar" iznos="4.000" zig={f < poena ? 0 : zig} pisanje={pisanje} />
        </g>
      )}

      <Pop at={bez - 2} x={540} y={1190} rot={-4} njihanje={1.5}>
        <Precrtano seed="s3-din" tekst="dinari" precrtaj={napredak(f, dinara - 4, 10)} velicina={76} />
      </Pop>
    </svg>
  );
};
