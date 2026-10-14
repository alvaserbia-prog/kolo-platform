// Scena 4 — „Đura je bio pošten, ali su stanari ipak sumnjali.“
// Na „pošten“ Đura sam u kuhinji iz svog novčanika doda kovanicu koja je falila u kasi. Na „ali“ rez na ulaz:
// stanari šapuću, nad glavama im iskaču papirni upitnici; na „sumnjali“ upitnika je više, a Đura prolazi
// kroz ulaz pognute glave.
import React from "react";
import { Easing, interpolate } from "remotion";
import { Kadar, Pop, mesaj, napredak, useF } from "../alat";
import { Lik, ikRuka } from "../likovi";
import { BAKA, DJURA, Kasa, Kovanica, STANAR, STANARKA, Upitnik } from "../zgrada";
import { kad } from "../vreme";
import { KuhinjaPozadina, StoKuhinja, UlazSaTablom, rez } from "./zajednicko";
import { KASA_STO, SveskaNaStolu } from "./Scena1";

export const Scena4: React.FC = () => {
  const f = useF();
  const kP = kad(4, "pošten,");
  const kA = kad(4, "ali");
  const kSu = kad(4, "sumnjali.");
  const kov = napredak(f, kP - 2, 14, Easing.inOut(Easing.quad));
  const ulaz = rez(f, kA - 2, 6);
  const djuraX = interpolate(f, [kA, kA + 110], [-120, 1200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sapat = Math.sin(f / 5) * 3;
  const [a1, a2] = ikRuka(600, 1250, 0.95, mesaj(560, KASA_STO.x + 20, kov), mesaj(980, KASA_STO.y - 140, kov), false);
  return (
    <Kadar>
      <g opacity={1 - ulaz}>
        <KuhinjaPozadina />
        <Lik x={600} y={1250} s={0.95} {...DJURA} glava={{ ...DJURA.glava, izraz: "mirna", pogled: [-7, 5] }} lr={[a1, a2]} />
        <StoKuhinja />
        <SveskaNaStolu />
        <g transform={`translate(${KASA_STO.x} ${KASA_STO.y})`}>
          <Kasa s={0.9} otvor={1} pun={1} />
        </g>
        {kov < 1 && (
          <g transform={`translate(${mesaj(560, KASA_STO.x + 20, kov)} ${mesaj(980, KASA_STO.y - 140, kov) - Math.sin(kov * Math.PI) * 80})`}>
            <Kovanica s={1.2} />
          </g>
        )}
      </g>
      {ulaz > 0 && (
        <g opacity={ulaz}>
          <UlazSaTablom />
          <Lik x={210} y={1320} s={0.72} {...BAKA} glava={{ ...BAKA.glava, izraz: "zamisljena", pogled: [8, 0] }} glavaNagib={8 + sapat} lr={[10, 20]} dr={[-40, -60]} />
          <Lik x={420} y={1340} s={0.75} {...STANARKA} glava={{ ...STANARKA.glava, izraz: "zamisljena", pogled: [-8, 0] }} glavaNagib={-8 - sapat} dr={[-50, -70]} />
          <Lik x={660} y={1330} s={0.76} {...STANAR} glava={{ ...STANAR.glava, izraz: "zamisljena", pogled: [-8, 2] }} glavaNagib={-6} lr={[10, 30]} />
          <Pop at={kA + 4} x={250} y={560}>
            <Upitnik s={1.1} />
          </Pop>
          <Pop at={kA + 10} x={430} y={540}>
            <Upitnik s={1.2} />
          </Pop>
          <Pop at={kSu - 4} x={680} y={560}>
            <Upitnik s={1.1} />
          </Pop>
          <Pop at={kSu + 2} x={340} y={420} rot={-12}>
            <Upitnik s={0.8} />
          </Pop>
          <Pop at={kSu + 6} x={560} y={420} rot={10}>
            <Upitnik s={0.8} />
          </Pop>
          {/* Đura prolazi ispred, pognute glave */}
          <Lik x={djuraX} y={1430} s={0.88} {...DJURA} glava={{ ...DJURA.glava, izraz: "tuzna", pogled: [3, 8] }} glavaNagib={14} hod={f / 3} nagib={4} />
        </g>
      )}
    </Kadar>
  );
};
