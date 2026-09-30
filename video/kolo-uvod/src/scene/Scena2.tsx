// Scena 2 — Baka Mara i pita, Pera i bicikl, Ana i paradajz (i ašov).
import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "../paleta";
import { Defs, Isecak, Pop, pravougaonik } from "../papir";
import { Asov, Bicikl, Etiketa, Kljuc, Korpa, Osoba, Pita, Upitnik } from "../likovi";
import { kad } from "../vreme";

const Traka: React.FC<{ at: number; y: number; boja: string; rot: number; seed: string }> = ({ at, y, boja, rot, seed }) => (
  <Pop at={at} x={540} y={y} rot={rot}>
    <Isecak pts={pravougaonik(-500, -150, 1000, 300)} boja={boja} seed={seed} amp={4} korak={40} />
  </Pop>
);

export const Scena2: React.FC = () => {
  const f = useCurrentFrame();
  const baka = kad(2, "Baka");
  const pera = kad(2, "Pera");
  const ana = kad(2, "Ana");
  const visak = kad(2, "višak");
  const nema = kad(2, "nema");
  const prekopa = kad(2, "prekopa");
  // paradajz uskače u korpu jedan po jedan, od „ima" do „paradajza"
  const paradajza = Math.max(0, Math.min(6, Math.floor((f - (visak - 10)) / 5)));
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <Defs />
      {/* Baka Mara */}
      <Traka at={baka - 6} y={420} boja={P.zlatna100} rot={-1.5} seed="s2-t1" />
      <Pop at={baka} x={250} y={430} njihanje={1.2}>
        <Osoba seed="s2-mara" boja={P.slezova} glava={{ frizura: "punda", kosa: P.kosaSeda, naocare: true, r: 52 }} sirina={150} visina={120} />
      </Pop>
      <Pop at={kad(2, "Mara")} x={250} y={530} rot={-3}>
        <Etiketa seed="s2-e1" tekst="baka Mara" velicina={60} />
      </Pop>
      <Pop at={kad(2, "peče")} x={710} y={440} rot={3} njihanje={1}>
        <Pita seed="s2-pita" />
      </Pop>

      {/* Pera */}
      <Traka at={pera - 6} y={760} boja={P.zelena100} rot={1.2} seed="s2-t2" />
      <Pop at={pera} x={250} y={770} njihanje={1.2} faza={2}>
        <Osoba seed="s2-pera" boja={P.nebo} glava={{ frizura: "kapa", brkovi: true, r: 52, koza: P.koza2 }} sirina={150} visina={120} />
      </Pop>
      <Pop at={pera + 4} x={250} y={870} rot={2}>
        <Etiketa seed="s2-e2" tekst="Pera" velicina={60} />
      </Pop>
      <Pop at={kad(2, "popravlja")} x={700} y={800} rot={-2}>
        <Bicikl seed="s2-bic" />
      </Pop>
      <Pop at={kad(2, "bicikle.")} x={930} y={700} rot={20} skala={0.8} njihanje={4}>
        <Kljuc seed="s2-klj" />
      </Pop>

      {/* Ana */}
      <Traka at={ana - 6} y={1100} boja="#FDEDE6" rot={-1} seed="s2-t3" />
      <Pop at={ana} x={250} y={1110} njihanje={1.2} faza={4}>
        <Osoba seed="s2-ana" boja={P.trava} glava={{ frizura: "rep", kosa: P.kosaSmedja, r: 52, osmeh: f > nema ? 0.2 : 1 }} sirina={150} visina={120} />
      </Pop>
      <Pop at={ana + 4} x={250} y={1210} rot={-2}>
        <Etiketa seed="s2-e3" tekst="Ana" velicina={60} />
      </Pop>
      <Pop at={kad(2, "ima")} x={640} y={1150} rot={-2}>
        <Korpa seed="s2-korpa" paradajza={paradajza} />
      </Pop>
      <Pop at={nema} x={400} y={975} skala={0.5} rot={8} njihanje={3}>
        <Upitnik seed="s2-upit" boja={P.korala} />
      </Pop>
      <Pop at={prekopa} x={915} y={1100} rot={18} skala={0.95} njihanje={3} faza={1}>
        <Asov seed="s2-asov" />
      </Pop>
    </svg>
  );
};
