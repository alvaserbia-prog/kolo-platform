// Scena 8 — pomoć u kući. Dvorište: na „Tim POENIMA“ od Milice odlete dva zapisa ka mladićima
// iz kraja. Na „očisti oluke“ jedan je na merdevinama i iz oluka leti lišće, na „pokosi travu“
// drugi gura kosilicu i iza nje ostaje pokošena traka. Milica donosi sok.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, Oblik, napredak, useF, usePop } from "../alat";
import { Ulica } from "../pozadine";
import { Drvo, Kosilica, Kuca, Merdevine, Posluzavnik, Zapis } from "../predmeti";
import { Lik, MILICA, MLADIC1, MLADIC2 } from "../likovi";
import { kad } from "../vreme";

export const Scena8: React.FC = () => {
  const f = useF();
  const kTim = kad(8, "Tim");
  const kOcisti = kad(8, "očisti");
  const kPokosi = kad(8, "pokosi");
  const z1 = usePop(kTim + 2, 140, 12);
  const z2 = usePop(kTim + 12, 140, 12);
  const zapisOde = napredak(f, kOcisti - 14, 14, Easing.in(Easing.cubic));
  const kos = napredak(f, kPokosi - 10, 70, Easing.inOut(Easing.sin));
  const kx = interpolate(kos, [0, 1], [1120, 800]);
  const pan = napredak(f, kPokosi - 16, 26);
  const penjanje = napredak(f, kTim, 30);
  const cisti = f > kOcisti - 6;
  return (
    <Kadar>
      <Hrapavo>
        <Kamera x={620 + pan * 260} y={1170} z={1.25 + interpolate(f, [0, 230], [0, 0.04])}>
          <Ulica />
          <g transform="translate(1180 1000)">
            <Drvo s={1.1} />
          </g>
          {/* travnjak: visoka trava, iza kosilice pokošeno */}
          <rect x={600} y={1240} width={900} height={220} fill="#7E9440" />
          <rect x={kx + 60} y={1240} width={Math.max(0, 1460 - kx - 60)} height={200} fill="#A7B865" />
          {Array.from({ length: 34 }, (_, i) => {
            const x = 620 + i * 22;
            if (x > kx + 40) return null;
            return <path key={i} d={`M${x},1300 l-6,-44 M${x + 8},1300 l4,-50 M${x + 14},1300 l10,-40`} stroke="#5F7430" strokeWidth={4} strokeLinecap="round" />;
          })}
          <g transform="translate(300 1260)">
            <Kuca s={1.2} zid={P.zidZuti} />
          </g>
          {/* oluk duž strehe */}
          <path d="M84,985 L516,985" stroke="#8C98A0" strokeWidth={14} strokeLinecap="round" />
          <path d="M84,985 L516,985" stroke={P.mastilo} strokeWidth={3} fill="none" />
          <g transform="translate(570 1420) rotate(-6)">
            <Merdevine h={450} />
          </g>
          {/* lišće iz oluka */}
          {cisti &&
            Array.from({ length: 12 }, (_, i) => {
              const t = ((f - kOcisti + 6 + i * 5) % 50) / 50;
              const x = 480 - i * 8 + Math.sin(t * 8 + i) * 30 - t * 60;
              const y = 980 + t * 420;
              return <ellipse key={i} cx={x} cy={y} rx={10} ry={5} fill={i % 2 ? P.oker : "#8A6A2A"} opacity={1 - t} transform={`rotate(${t * 400 + i * 30} ${x} ${y})`} />;
            })}
          <Lik
            x={interpolate(penjanje, [0, 1], [660, 590])}
            y={interpolate(penjanje, [0, 1], [1440, 1230])}
            s={0.82}
            {...MLADIC1}
            okreni
            glava={{ ...MLADIC1.glava, izraz: "osmeh", pogled: [1, -1] }}
            dr={cisti ? [175 + Math.sin(f / 3) * 12, 10] : [120, 30]}
            lr={[160, 10]}
          />
          <g transform={`translate(${kx} 1330)`}>
            <Kosilica tockovi={-f * 10} />
          </g>
          <Lik
            x={kx + 200}
            y={1340}
            s={0.82}
            {...MLADIC2}
            hod={kos > 0 && kos < 1 ? f / 3 : undefined}
            okreni
            glava={{ ...MLADIC2.glava, izraz: "osmeh" }}
            dr={[80, 30]}
            lr={[70, 30]}
          />
          <Lik
            x={330}
            y={1560}
            s={1.02}
            {...MILICA}
            glava={{ ...MILICA.glava, izraz: "srecna" }}
            dr={[70, 20]}
            lr={[60, 30]}
            drziD={
              <g transform="translate(40 -6)">
                <Posluzavnik />
              </g>
            }
          />
        </Kamera>
      </Hrapavo>
      {f >= kTim + 2 && zapisOde < 1 && (
        <g opacity={1 - zapisOde}>
          <g transform={`translate(${340 - zapisOde * 200} ${280 - zapisOde * 60}) rotate(-3) scale(${z1 * 0.85})`}>
            <Zapis od="Milica" ka="Luka" iznos="600 POENA" />
          </g>
          <g transform={`translate(${400 + zapisOde * 200} ${500 - zapisOde * 60}) rotate(2) scale(${z2 * 0.85})`}>
            <Zapis od="Milica" ka="Stefan" iznos="500 POENA" />
          </g>
        </g>
      )}
    </Kadar>
  );
};
