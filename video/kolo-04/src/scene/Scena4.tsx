// Scena 4 — „Lazaru se posle posla jeo pravi domaći burek. Marija mu je ispekla
// celu tepsiju, a on joj je prepisao 1.000 POENA. A znaš šta je Marija uradila
// sa njima? Otišla je kod Ane po teglu meda." — kolo se zatvara.
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { P } from "../paleta";
import { Defs, Isecak, Pop, napredak, pravougaonik, usePop } from "../papir";
import { Kuca, Pita, Sunce, Upitnik, spring01 } from "../likovi";
import { Iskre, Lik, Oblacic, Tegla, Zapis } from "../prica";
import { kad } from "../vreme";

export const Scena4: React.FC = () => {
  const f = useCurrentFrame();
  const posla = kad(4, "posla");
  const burek = kad(4, "burek.");
  const marija = kad(4, "Marija");
  const ispekla = kad(4, "ispekla");
  const celu = kad(4, "celu");
  const on = kad(4, "on");
  const iznos = kad(4, "1.000");
  const poena = kad(4, "POENA.");
  const a = kad(4, "A");
  const znas = kad(4, "znaš");
  const otisla = kad(4, "Otišla");
  const kod = kad(4, "kod");
  const teglu = kad(4, "teglu");
  const meda = kad(4, "meda.");

  // veče posle posla: sunce zalazi, nebo se malo zagreje
  const vece = napredak(f, posla - 6, 30);
  const oblak = usePop(burek - 8, 160);
  const oblakOde = napredak(f, on - 6, 10);

  // tepsija: kod Marije, pa odleti Lazaru
  const tLet = napredak(f, on - 4, 18, Easing.inOut(Easing.cubic));
  const tX = interpolate(tLet, [0, 1], [760, 330]);
  const tY = interpolate(tLet, [0, 1], [1090, 1110]) - Math.sin(tLet * Math.PI) * 320;
  const tS = interpolate(tLet, [0, 1], [0.85, 0.62]) * (1 + 0.12 * Math.sin(Math.PI * napredak(f, celu, 10, Easing.linear)));
  const tepsijaOde = napredak(f, otisla - 4, 10);

  // prvi zapis, pa se skloni u ugao
  const z1 = usePop(iznos - 2, 150);
  const z1ugao = napredak(f, a - 4, 14);
  // Lazar izlazi, Ana ulazi
  const smena = napredak(f, otisla - 2, 16, Easing.inOut(Easing.cubic));
  const tegla = napredak(f, teglu - 6, 20, Easing.inOut(Easing.cubic));
  const z2 = usePop(kod - 2, 150);

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* ulica u pozadini; sunce zalazi iza krovova */}
      <g transform={`translate(0 ${vece * 150 + smena * -150})`}>
        <Pop at={4} x={880} y={560} skala={0.8}>
          <Sunce seed="s4-sunce" />
        </Pop>
      </g>
      {[
        { x: 150, f: "#F7DCC8" },
        { x: 420, f: "#E8DDF3" },
        { x: 690, f: P.sunce },
        { x: 960, f: "#D5E7F2" },
      ].map((k, i) => (
        <Pop key={i} at={2 + i * 2} x={k.x} y={900} skala={0.72}>
          <Kuca seed={`s4-ku${i}`} fasada={k.f} krov={i % 2 ? P.korala : P.korala600} kapci={i % 2 ? P.nebo : P.zelena700} />
        </Pop>
      ))}
      <Pop at={0} x={540} y={1150}>
        <Isecak pts={pravougaonik(-620, -250, 1240, 300)} boja="#E9DFCB" seed="s4-ulica" senka="bez" zrno={0.5} />
        <Isecak pts={pravougaonik(-620, -262, 1240, 26)} boja={P.trava} seed="s4-trava" senka="mala" />
      </Pop>
      {vece > 0 && (
        <g opacity={0.22 * vece * (1 - smena)}>
          <rect x={0} y={0} width={1080} height={1920} fill={P.narandza} style={{ mixBlendMode: "multiply" }} />
        </g>
      )}

      {/* Lazar posle posla — kasnije izlazi levo */}
      {smena < 1 && (
        <g transform={`translate(${-smena * 520} 0)`}>
          <Pop at={2} x={220} y={1010} skala={1.6}>
            <Lik id="lazar" seed="s4-lazar" osmeh={tLet > 0.9 ? 1 : 0.3} />
          </Pop>
        </g>
      )}
      {/* Ana ulazi sa leve strane */}
      {smena > 0 && (
        <g transform={`translate(${(1 - smena) * -520} 0)`}>
          <Pop at={otisla - 2} x={220} y={1010} skala={1.6}>
            <Lik id="ana" seed="s4-ana" />
          </Pop>
        </g>
      )}

      {oblak > 0 && oblakOde < 1 && (
        <g opacity={1 - oblakOde} transform={`translate(430 640) scale(${oblak.toFixed(4)})`}>
          <Oblacic seed="s4-obl" w={320} h={250} rep={[-130, 190]}>
            <g transform="scale(0.85) translate(0 10)">
              <Pita seed="s4-misao" />
            </g>
          </Oblacic>
        </g>
      )}

      <Pop at={marija - 3} x={860} y={1010} skala={1.6}>
        <Lik id="marija" seed="s4-marija" />
      </Pop>

      {f >= ispekla - 4 && tepsijaOde < 1 && (
        <g opacity={1 - tepsijaOde}>
          <Pop at={ispekla - 4} x={tX} y={tY} skala={tS}>
            <Pita seed="s4-burek" />
          </Pop>
        </g>
      )}
      {tLet >= 1 && f < on + 44 && <Iskre seed="s4-isk" x={330} y={1080} t={napredak(f, on + 14, 26)} r={120} />}

      {/* zapis Lazar → Marija */}
      {z1 > 0 && (
        <g
          transform={`translate(${interpolate(z1ugao, [0, 1], [540, 250])} ${interpolate(z1, [0, 1], [470, 420]) - z1ugao * 110}) rotate(${-3 + (1 - z1) * -12 + z1ugao * -3}) scale(${(1.1 * z1 * (1 - 0.5 * z1ugao)).toFixed(4)})`}
        >
          <Zapis seed="s4-z1" od="Lazar" ka="Marija" iznos="1.000" zig={spring01(f - poena)} pisanje={napredak(f, iznos + 2, 22, Easing.linear)} />
        </g>
      )}

      {/* „A znaš šta…?" */}
      {f >= znas - 2 && f < otisla + 10 && (
        <g opacity={1 - napredak(f, otisla, 10)}>
          <Pop at={znas - 2} x={540} y={660} skala={1.35} njihanje={6}>
            <Upitnik seed="s4-upit" boja={P.korala} />
          </Pop>
        </g>
      )}

      {/* tegla meda ide od Ane Mariji */}
      {tegla > 0 && (
        <g transform={`translate(${interpolate(tegla, [0, 1], [320, 760])} ${interpolate(tegla, [0, 1], [1100, 1110]) - Math.sin(tegla * Math.PI) * 300}) scale(0.62)`}>
          <Tegla seed="s4-tegla" />
        </g>
      )}

      {/* zapis Marija → Ana: kolo je zatvoreno */}
      {z2 > 0 && (
        <g transform={`translate(640 ${interpolate(z2, [0, 1], [560, 480])}) rotate(${3 + (1 - z2) * 12}) scale(${(0.95 * z2).toFixed(4)})`}>
          <Zapis seed="s4-z2" od="Marija" ka="Ana" iznos="1.000" zig={spring01(f - meda + 4)} pisanje={napredak(f, kod + 2, 20, Easing.linear)} />
        </g>
      )}
    </svg>
  );
};
