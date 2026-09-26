// Scena 2 — „Sve je počelo od meda. Milan je tražio domaći med, a Ana ima
// košnice u dvorištu. Dogovorili su se za pet tegli i 5.000 POENA,
// i Milan joj ih je prepisao." Tegle idu Milanu, zapis ide Ani.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Crta, Defs, Isecak, Pop, Pt, napredak, pravougaonik, usePop } from "../papir";
import { Drvo, Etiketa, spring01 } from "../likovi";
import { Iskre, Kosnica, Lik, Oblacic, Pcele, Tegla, Veza, Zapis } from "../prica";
import { kad } from "../vreme";

const MILAN: Pt = [250, 960];
const ANA: Pt = [830, 960];

export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const meda = kad(2, "meda.");
  const milan = kad(2, "Milan");
  const trazio = kad(2, "tražio");
  const ana = kad(2, "Ana");
  const kosnice = kad(2, "košnice");
  const dogovorili = kad(2, "Dogovorili");
  const pet = kad(2, "pet");
  const iznos = kad(2, "5.000");
  const prepisao = kad(2, "prepisao.");

  // velika tegla na početku, pa se skloni
  const teglaOde = napredak(f, milan - 4, 12, Easing.in(Easing.cubic));
  const oblak = usePop(trazio - 4, 160);
  const oblakOde = napredak(f, dogovorili - 4, 10);
  const zapis = usePop(iznos - 2, 150);
  const pisanje = napredak(f, iznos + 2, 26, Easing.linear);
  const zig = f < prepisao ? 0 : spring01(f - prepisao);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* dvorište: trava, ograda, drvo i košnice iza Ane */}
      <Pop at={0} x={540} y={1150}>
        <Isecak pts={pravougaonik(-620, -40, 1240, 70)} boja={P.trava} seed="s2-trava" />
      </Pop>
      <Pop at={3} x={800} y={1115} skala={1}>
        <Ograda seed="s2-ograda" duzina={560} />
      </Pop>
      <Pop at={4} x={1010} y={1120} skala={0.8}>
        <Drvo seed="s2-drvo" boja={P.trava} />
      </Pop>
      <Pop at={kosnice - 4} x={640} y={1130} skala={0.75}>
        <Kosnica seed="s2-k1" boja={P.nebo} boja2={P.sunce} />
      </Pop>
      <Pop at={kosnice + 2} x={1000} y={1150} skala={0.8}>
        <Kosnica seed="s2-k2" boja={P.korala} boja2={P.trava} />
      </Pop>
      <Pcele seed="s2-pc" x={870} y={700} n={4} r={170} od={kosnice} />

      {teglaOde < 1 && (
        <g opacity={1 - teglaOde} transform={`translate(${teglaOde * -200} ${teglaOde * 120})`}>
          <Pop at={meda - 4} x={540} y={560} skala={1.9 * (1 - teglaOde * 0.6)} njihanje={2}>
            <Tegla seed="s2-velika" />
          </Pop>
          <Pcele seed="s2-pc0" x={540} y={470} n={3} r={190} od={meda} />
        </g>
      )}

      <Pop at={milan - 3} x={MILAN[0]} y={MILAN[1]} skala={1.55}>
        <Lik id="milan" seed="s2-milan" />
      </Pop>
      <Pop at={ana - 3} x={ANA[0]} y={ANA[1]} skala={1.55}>
        <Lik id="ana" seed="s2-ana" />
      </Pop>

      {/* Milan misli na med */}
      {oblak > 0 && oblakOde < 1 && (
        <g opacity={1 - oblakOde} transform={`translate(390 620) scale(${oblak.toFixed(4)})`}>
          <Oblacic seed="s2-obl" w={300} h={240} rep={[-120, 180]}>
            <g transform="scale(0.95) translate(0 10)">
              <Tegla seed="s2-mala" />
            </g>
          </Oblacic>
        </g>
      )}

      {/* dogovor: isprekidana veza između njih */}
      <Veza a={[MILAN[0] + 110, MILAN[1] - 170]} b={[ANA[0] - 110, ANA[1] - 170]} seed="s2-veza" napredak={napredak(f, dogovorili, 18)} />
      {f >= dogovorili + 14 && f < dogovorili + 40 && <Iskre seed="s2-isk" x={540} y={760} t={napredak(f, dogovorili + 14, 26)} r={110} />}

      {/* pet tegli: iskoče od Ane, pa odlete Milanu */}
      {[0, 1, 2, 3, 4].map((i) => {
        const at = pet + i * 3;
        if (f < at) return null;
        const pocetak: Pt = [360 + i * 90, 690];
        const let_ = napredak(f, prepisao - 14 + i * 3, 16, Easing.inOut(Easing.cubic));
        const x = interpolate(let_, [0, 1], [pocetak[0], MILAN[0] - 20 + i * 12]);
        const y = interpolate(let_, [0, 1], [pocetak[1], MILAN[1] + 110]) - Math.sin(let_ * Math.PI) * 120;
        const s = interpolate(let_, [0, 1], [0.52, 0.3]);
        return (
          <g key={i} opacity={let_ > 0.92 ? (1 - let_) / 0.08 : 1}>
            <Pop at={at} x={x} y={y} skala={s} njihanje={3} faza={i}>
              <Tegla seed={`s2-t${i}`} />
            </Pop>
          </g>
        );
      })}
      {f >= pet && f < iznos + 10 && (
        <g opacity={1 - napredak(f, iznos, 10)}>
          <Pop at={pet + 2} x={540} y={820} rot={-4}>
            <Etiketa seed="s2-pet" tekst="5 tegli" velicina={52} />
          </Pop>
        </g>
      )}

      {/* zapis: Milan → Ana */}
      {zapis > 0 && (
        <g transform={`translate(540 ${interpolate(zapis, [0, 1], [520, 440])}) rotate(${-3 + (1 - zapis) * -12}) scale(${(1.15 * zapis).toFixed(4)})`}>
          <Zapis seed="s2-zapis" od="Milan" ka="Ana" iznos="5.000" zig={zig} pisanje={pisanje} />
        </g>
      )}
    </svg>
  );
};


/** Niska drvena ograda (letve), donja ivica na (0,0). */
const Ograda: React.FC<{ seed: string; duzina: number }> = ({ seed, duzina }) => {
  const n = Math.round(duzina / 46);
  return (
    <g>
      <Crta pts={[[-duzina / 2, -70], [duzina / 2, -70]]} seed={`${seed}-p1`} boja="#A77A4E" debljina={12} />
      <Crta pts={[[-duzina / 2, -30], [duzina / 2, -30]]} seed={`${seed}-p2`} boja="#A77A4E" debljina={12} />
      {Array.from({ length: n }, (_, i) => {
        const x = -duzina / 2 + 20 + i * 46;
        return <Isecak key={i} pts={[[x - 14, 0], [x - 14, -100], [x, -116], [x + 14, -100], [x + 14, 0]]} boja="#C8996A" seed={`${seed}-l${i}`} senka="mala" amp={1.2} korak={16} />;
      })}
    </g>
  );
};
