// Scena 1 — „Pre pet hiljada godina, u Mesopotamiji, današnjem Iraku, ljudi su zapisivali razmenu na glinenim pločicama.“
// Kuka: od prvog kadra krupno pisar trskom utiskuje znake u vlažnu glinenu pločicu. Na „Mesopotamiji“ se
// kamera odmakne: reka sa trskom, palme, zigurat; uskoči kartuša sa mestom i vremenom. Na „glinenim“ se
// kamera vrati na pločicu, na kojoj je sad ceo zapis.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Hrapavo, Kadar, Kamera, Pop, mesaj, napredak, useF } from "../alat";
import { Lik, PISAR, ikRuka } from "../likovi";
import { MestoVreme, Ovca, Palma, Plocica, Pustinja, Reka, Sunce, Trscak, Trska, Zigurat } from "../drevno";
import { kad, trajanjeF } from "../vreme";
import { P } from "../paleta";

export const REDOVI_1 = [
  { ko: "covek" as const, sta: "ovca" as const, koliko: 12 },
  { ko: "zena" as const, sta: "vuna" as const, koliko: 5 },
  { ko: "covek" as const, sta: "ulje" as const, koliko: 3 },
];

export const Scena1: React.FC = () => {
  const f = useF();
  const kMes = kad(1, "Mesopotamiji,");
  const kGlin = kad(1, "glinenim");
  const T = trajanjeF(1);
  // kamera: krupno na pločicu -> ceo kadar -> ponovo pločica
  const odmak = napredak(f, kMes - 6, 26, Easing.inOut(Easing.cubic));
  const nazad = napredak(f, kGlin - 8, 24, Easing.inOut(Easing.cubic));
  const z = mesaj(mesaj(2.1, 1, odmak), 1.7, nazad);
  const cx = mesaj(mesaj(590, 540, odmak), 570, nazad);
  const cy = mesaj(mesaj(1110, 960, odmak), 1090, nazad);
  // znaci se utiskuju postepeno kroz celu scenu
  const red = (T - 30) / 3;
  const pis = (i: number) => napredak(f, -45 + i * red, red, Easing.linear);
  // vrh trske ide po redu koji se upravo piše i utiskuje (gore-dole na 8 frejmova)
  const LX = 420, PX = 600, PY = 1250, PW = 330, PH = 250;
  const aktivan = Math.min(2, Math.max(0, Math.floor((f + 45) / red)));
  const uRedu = Math.min(1, pis(aktivan));
  const tipX = PX - PW / 2 + 60 + uRedu * 230;
  const tipY = PY - PH + 20 + ((PH - 40) / 3) * (aktivan + 0.5) - Math.abs(Math.sin((f * Math.PI) / 8)) * 14;
  const UG = 38; // nagib trske
  const drzX = tipX + Math.sin((UG * Math.PI) / 180) * 55;
  const drzY = tipY - Math.cos((UG * Math.PI) / 180) * 55;
  const ruka = ikRuka(LX, 1580, 0.95, drzX, drzY);
  return (
    <Kadar>
      <Kamera x={cx} y={cy} z={z}>
        <Hrapavo>
          <Pustinja horizont={1000} nebo="#B5D1CE" tlo="#C08A4E" />
          <Sunce x={250} y={420} r={80} />
          <g transform="translate(800 1000)">
            <Zigurat s={0.75} />
          </g>
          <g transform="translate(110 1010)">
            <Palma s={0.8} nagib={-20} />
          </g>
          <g transform="translate(990 1020)">
            <Palma s={0.65} nagib={16} />
          </g>
          <Reka y={1040} h={110} />
          <Trscak x0={-100} x1={1180} y={1170} />
          <g transform="translate(860 1720)">
            <Ovca s={0.7} />
          </g>
          <g transform="translate(990 1660)">
            <Ovca s={0.55} okreni />
          </g>
        </Hrapavo>
        <Lik x={LX} y={1580} s={0.95} {...PISAR} glava={{ ...PISAR.glava, izraz: "zamisljena", pogled: [4, 4] }} lr={ikRuka(LX, 1580, 0.95, PX - PW / 2 + 14, PY - 120, false)} dr={ruka} />
        <g transform={`translate(${PX} ${PY})`}>
          <Plocica w={PW} h={PH} sveza redovi={REDOVI_1} napredak={[pis(0), pis(1), pis(2)]} />
        </g>
        {/* palac leve ruke preko ivice pločice */}
        <ellipse cx={PX - PW / 2 + 12} cy={PY - 120} rx={20} ry={17} fill={P.koza2} stroke={P.mastilo} strokeWidth={3.5} />
        {/* prednja ruka je iza pločice; preko pločice se vide samo šaka i trska */}
        <g transform={`translate(${tipX} ${tipY})`}>
          <Trska rot={UG} />
          <ellipse cx={Math.sin((UG * Math.PI) / 180) * 55} cy={-Math.cos((UG * Math.PI) / 180) * 55} rx={22} ry={20} fill={P.koza2} stroke={P.mastilo} strokeWidth={3.5} />
        </g>
      </Kamera>
      <Pop at={kMes} x={540} y={250} rot={-2}>
        <g opacity={interpolate(f, [kGlin - 10, kGlin + 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <MestoVreme mesto="MESOPOTAMIJA" vreme="oko 3000. p. n. e." />
        </g>
      </Pop>
    </Kadar>
  );
};
