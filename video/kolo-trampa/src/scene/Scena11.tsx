// Scena 11 — „Šta ti imaš da ponudiš? Pridruži se besplatno na ekolo.rs.“
// Milica u novim cipelama okrene se ka gledaocu i pruži teglu; pored nje mala sveska sa praznim redom
// „Ti · …“ (mesto za gledaoca). Na „Pridruži“ gore znak KOLO, na „ekolo.rs“ krupno ekolo.rs kredom;
// muzika se završava odmah posle adrese.
import React from "react";
import { P } from "../paleta";
import { Kadar, Kreda, Pop, napredak, useF } from "../alat";
import { Lik, MILICA } from "../likovi";
import { Tegla } from "../predmeti";
import { Cetka, Naramak, Oblacic, ParCipela, Sveska, Upitnik } from "../stvari";
import { Hleb } from "../predmeti";
import { ZnakKolo } from "../znak";
import { kad } from "../vreme";
import { Pisi, Pod } from "./zajednicko";

const Y = 1270;

export const Scena11: React.FC = () => {
  const f = useF();
  const kSta = kad(11, "Šta");
  const kPon = kad(11, "ponudiš?");
  const kPri = kad(11, "Pridruži");
  const kEko = kad(11, "ekolo.rs.");
  const pruzi = napredak(f, kSta, 12);
  return (
    <Kadar>
      <Kreda>
        <Pod y={Y + 8} x0={60} x1={1020} />
        <Lik
          x={240}
          y={Y}
          s={0.72}
          {...MILICA}
          glava={{ ...MILICA.glava, izraz: "srecna", pogled: [0.6, 0.2] }}
          lr={[10, 10]}
          dr={[-10 + 80 * pruzi, -20 + 10 * pruzi]}
          cipele="#A0583A"
          drziD={<Tegla vrsta="ajvar" s={0.8} />}
        />
        {f >= kPon - 6 && (
          <Pop at={kPon - 6} x={730} y={1030} skala={0.55}>
            <Sveska w={700} h={400} redovi={[{ ime: "Milica", sta: "dala ajvar", at: -999 }]} prazanRed={kPon - 6} />
          </Pop>
        )}
        {/* „Šta ti imaš?“: oblačić sa stvarima koje neko može da ponudi, nestane pred znakom KOLO */}
        {f >= kSta && (
          <g opacity={1 - napredak(f, kPri - 10, 10)}>
            <Pop at={kSta} x={560} y={430} skala={1}>
              <Oblacic w={560} h={340} rep="levo">
                <Upitnik s={0.9} boja={P.oker} />
                {[
                  { x: -170, y: -40, el: <Hleb /> },
                  { x: 175, y: -30, el: <ParCipela s={0.55} /> },
                  { x: -150, y: 100, el: <Naramak s={0.55} /> },
                  { x: 160, y: 110, el: <Cetka s={0.6} rot={-30} /> },
                ].map((st, i) => (
                  <Pop key={i} at={kSta + 6 + i * 6} x={st.x} y={st.y} skala={1}>
                    {st.el}
                  </Pop>
                ))}
              </Oblacic>
            </Pop>
          </g>
        )}
        <Pisi tekst="ekolo.rs" at={kEko - 2} x={540} y={640} velicina={180} brzina={0.5} boja={P.zelenaKreda} podvuci sirina={600} />
      </Kreda>
      {f >= kPri - 4 && (
        <Pop at={kPri - 4} x={540} y={300} skala={0.7}>
          <ZnakKolo id="znak11" />
        </Pop>
      )}
    </Kadar>
  );
};
