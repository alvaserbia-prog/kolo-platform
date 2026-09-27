// Sc. 2 — „Seoski pašnjak, bunar, šuma, reka. Svi su ih koristili, a niko ih nije imao samo za sebe.“
// Četiri mala otiska utiskuju se redom na izgovorene reči. Na „Svi su ih koristili“ u svakom
// oživi po nekoliko ljudi; na „niko … samo za sebe“ razmaci i okviri nestaju i četiri otiska
// postaju jedan predeo — granica među njima nema.
import React from "react";
import { Easing } from "remotion";
import { Hrapavo, Kadar, Linija, Utisak, dah, mesaj, napredak, useF } from "../alat";
import { P } from "../paleta";
import { Bunar, Covek, Hrast, Krava, Nebo, Ptica, Ravnica, Reka, Topola, Trska } from "../motivi";
import { kad, trajanjeF } from "../vreme";

const W = 470;
const H = 470;

const Polje: React.FC<{ id: string; x: number; y: number; okvir: number; children: React.ReactNode }> = ({ id, x, y, okvir, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <clipPath id={id}>
        <rect x={0} y={0} width={W} height={H} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <rect x={0} y={0} width={W} height={H} fill={P.papir} />
      {children}
    </g>
    {okvir > 0 && <rect x={0} y={0} width={W} height={H} fill="none" stroke={P.mastilo} strokeWidth={9} opacity={okvir} />}
  </g>
);

export const Scena2: React.FC = () => {
  const f = useF();
  const T = trajanjeF(2);
  const tSvi = kad(2, "Svi");
  const tNiko = kad(2, "niko");
  const spoj = napredak(f, tNiko - 4, 22, Easing.inOut(Easing.cubic));
  const razmak = mesaj(26, 0, spoj);
  const okvir = 1 - spoj;
  const zX = 540 - W - razmak / 2;
  const dX = 540 + razmak / 2;
  const gY = 372;
  const dY = gY + H + razmak;
  const zum = mesaj(1, 1.04, napredak(f, tNiko, T - tNiko));
  const ziv = napredak(f, tSvi - 4, 10);
  const hod = (brzina: number, faza = 0) => f * brzina + faza;
  return (
    <Kadar>
      <Hrapavo>
        <Ravnica y={1250} boja={P.travaTamna} />
        <g transform={`translate(540 ${gY + H}) scale(${zum}) translate(-540 ${-(gY + H)})`}>
          {/* pašnjak */}
          <Utisak at={kad(2, "pašnjak,") - 6} x={zX} y={gY}>
            <Polje id="p1" x={0} y={0} okvir={okvir}>
              <Nebo od={0} do={170} gustina={1.3} pomakX={f * 0.3} />
              <Ravnica y={170} />
              <g transform="translate(150 330)">
                <Krava s={0.62} glavaDole={0.5 + 0.5 * dah(f, 70)} />
              </g>
              <g transform="translate(360 290)">
                <Krava s={0.46} smer={-1} glavaDole={0.5 + 0.5 * dah(f, 90, 30)} />
              </g>
              {ziv > 0 && (
                <g transform={`translate(${mesaj(420, 330, (hod(0.004) % 1))} 430)`} opacity={ziv}>
                  <Covek tip="st" boja={P.okerTamni} s={0.55} korak={hod(0.2)} smer={-1} ruke={[30, -20]} predmet="srp" />
                </g>
              )}
            </Polje>
          </Utisak>
          {/* bunar */}
          <Utisak at={kad(2, "bunar,") - 6} x={dX} y={gY}>
            <Polje id="p2" x={0} y={0} okvir={okvir}>
              <Nebo od={0} do={250} gustina={1.3} pomakX={f * 0.3 + 400} />
              <Ravnica y={250} vlati={0.6} />
              <g transform="translate(190 400) scale(0.6)">
                <Bunar ugao={-18 + 26 * (0.5 - 0.5 * Math.cos((f / 50) * Math.PI))} />
              </g>
              {ziv > 0 && (
                <g transform="translate(80 440)" opacity={ziv}>
                  <Covek tip="z" boja={P.rdja} boja2={P.oker} s={0.62} ruke={[-4, 6]} predmet="kofa" />
                </g>
              )}
            </Polje>
          </Utisak>
          {/* šuma */}
          <Utisak at={kad(2, "šuma,") - 6} x={zX} y={dY}>
            <Polje id="p3" x={0} y={0} okvir={okvir}>
              <Nebo od={0} do={200} gustina={1.3} pomakX={f * 0.3 + 800} />
              <Ravnica y={200} boja={P.travaTamna} vlati={0.6} />
              <g transform="translate(110 380)">
                <Hrast s={0.85} boja={P.trava} />
              </g>
              <g transform="translate(300 330)">
                <Topola s={0.62} />
              </g>
              <g transform="translate(380 360)">
                <Topola s={0.72} />
              </g>
              <g transform="translate(230 400)">
                <Hrast s={0.55} boja={P.travaTamna} />
              </g>
              {ziv > 0 && (
                <g transform={`translate(${mesaj(260, 330, (hod(0.006) % 1))} 445)`} opacity={ziv}>
                  <Covek tip="m" boja={P.oker} s={0.55} korak={hod(0.22)} ruke={[20, -10]} predmet="korpa" />
                </g>
              )}
            </Polje>
          </Utisak>
          {/* reka */}
          <Utisak at={kad(2, "reka.") - 6} x={dX} y={dY}>
            <Polje id="p4" x={0} y={0} okvir={okvir}>
              <Nebo od={0} do={180} gustina={1.3} pomakX={f * 0.3 + 1200} />
              <Ravnica y={180} vlati={0.3} />
              <g transform="scale(0.5) translate(0 200)">
                <Reka y={330} faza={f / 12} />
              </g>
              <g transform="translate(0 30)">
                <Reka y={230} faza={f / 14} />
              </g>
              <Trska x={60} y={290} s={0.8} faza={f / 18} />
              <Trska x={420} y={300} s={0.9} faza={f / 16 + 2} />
              {ziv > 0 && (
                <g opacity={ziv}>
                  <g transform="translate(340 440)">
                    <Covek tip="d" boja={P.oker} boja2={P.rdja} s={0.72} smer={-1} ruke={[110, -20]} />
                  </g>
                  <Linija d={`M${300},${310} Q${220},${300 + dah(f, 30) * 6} ${180},${350}`} debljina={3} />
                  <Linija d="M180,350 L180,380" debljina={2} />
                </g>
              )}
            </Polje>
          </Utisak>
          {/* posle spajanja: ptice nad celim predelom */}
          {spoj > 0.5 &&
            [0, 1, 2, 3].map((i) => (
              <Ptica key={i} x={((f * (2.6 + i * 0.3) + i * 240) % 1000) + 40} y={440 + i * 30 + Math.sin(f / 18 + i) * 8} s={0.9} mah={f / 3 + i} />
            ))}
        </g>
      </Hrapavo>
      {/* zeleni sjaj: zajedničko */}
      {spoj > 0 && <ellipse cx={540} cy={gY + H} rx={620} ry={560} fill="url(#zeleniSjaj)" opacity={0.35 * spoj} style={{ mixBlendMode: "multiply" }} />}
    </Kadar>
  );
};

