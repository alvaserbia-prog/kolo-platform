// Scena 7 — oglas i razmena. Krupno: telefon u Miličinim rukama, na KOLU se sklapa oglas
// „Domaći ajvar, po bakinom receptu“ i na „oglas.“ se objavi. Na „Komšije“ kapija: komšija i
// komšinica dolaze iz susedne ulice; na „dve, tri“ se pune korpa teglama; na „prepisale joj
// POENE“ uleti zapis u KOLU (ne novčić, ne novčanica), na „dogovorili“ rukovanje i osmesi.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { Hrapavo, Kadar, Kamera, Oblik, Pop, elipsa, napredak, useF, usePop } from "../alat";
import { Ulica } from "../pozadine";
import { Drvo, EkranOglas, Kapija, Kuca, Tegla, Telefon, Zapis } from "../predmeti";
import { KOMSIJA, KOMSINICA, Lik, MILICA } from "../likovi";
import { kad } from "../vreme";

const Korpa: React.FC<{ n: number; f: number; kDve: number; kTri: number }> = ({ f, kDve, kTri }) => (
  <g>
    {[
      [-40, kDve - 2],
      [40, kDve + 3],
      [0, kTri - 2],
    ].map(([x, at], i) => (
      <Pop key={i} at={at} x={x} y={i === 2 ? -44 : -20}>
        <Tegla vrsta="ajvar" s={0.55} />
      </Pop>
    ))}
    <Oblik d="M-90,-30 L90,-30 L70,50 L-70,50Z" boja={P.drvoSvetlo} />
    {[-60, -30, 0, 30, 60].map((x) => (
      <line key={x} x1={x} y1={-30} x2={x * 0.8} y2={50} stroke={P.drvo} strokeWidth={4} />
    ))}
    <path d="M-80,-30 C-80,-130 80,-130 80,-30" fill="none" stroke={P.drvo} strokeWidth={10} />
    {f < 0 ? null : null}
  </g>
);

export const Scena7: React.FC = () => {
  const f = useF();
  const kMilica = kad(7, "Milica");
  const kOglas = kad(7, "oglas");
  const kKomsije = kad(7, "Komšije");
  const kDve = kad(7, "dve");
  const kTri = kad(7, "tri");
  const kPrepisale = kad(7, "prepisale");
  const kDogovorili = kad(7, "dogovorili");
  const smena = napredak(f, kKomsije - 12, 14);
  const slova = interpolate(f, [kMilica + 6, kOglas - 10], [0, 33], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const objava = interpolate(f, [kOglas - 4, kOglas + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tap = Math.max(0, 1 - Math.abs(f - (kOglas - 2)) / 5);
  const dolazak = napredak(f, kKomsije - 8, 50, Easing.out(Easing.quad));
  const zapis = usePop(kPrepisale + 2, 130, 12);
  const ruk = napredak(f, kDogovorili - 10, 12);
  const trese = ruk > 0.99 ? Math.sin(f / 3) * 6 : 0;
  return (
    <Kadar>
      {smena < 1 && (
        <g>
          <rect width={1080} height={1920} fill="#E7CF9C" />
          <rect width={1080} height={1920} fill="url(#gvasP)" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
          {/* karirani stolnjak ispod telefona */}
          <g opacity={0.35}>
            {Array.from({ length: 14 }, (_, i) => (
              <rect key={i} x={i * 80} y={0} width={40} height={1920} fill={P.ajvar} />
            ))}
            {Array.from({ length: 26 }, (_, i) => (
              <rect key={i} x={0} y={i * 80} width={1080} height={40} fill={P.ajvar} opacity={0.6} />
            ))}
          </g>
          <g transform={`translate(540 ${820 + interpolate(f, [-10, 20], [80, 0], { extrapolateRight: "clamp" })}) rotate(-3) scale(${1.45 - smena * 0.1})`}>
            <Hrapavo lokalno>
              <Telefon>
                <EkranOglas faza={napredak(f, kMilica - 4, 12)} slovaNaslova={slova} objavljen={objava} />
              </Telefon>

            </Hrapavo>
            {/* kažiprst koji dodirne „Objavi oglas“ */}
            {f > kOglas - 26 && (
              <g transform={`translate(${interpolate(f, [kOglas - 26, kOglas - 6, kOglas + 10], [260, 30, 180], { extrapolateRight: "clamp" })} ${interpolate(f, [kOglas - 26, kOglas - 6, kOglas + 10], [520, 214, 420], { extrapolateRight: "clamp" })}) rotate(-28)`}>
                <Oblik d="M-22,0 C-24,-40 -18,-70 0,-72 C18,-70 24,-40 22,0 L40,40 C60,90 50,200 30,300 L-90,300 C-100,200 -80,120 -52,60Z" boja={P.koza} debljina={4} tekstura={0.1} />
                <path d="M-14,-52 C-8,-60 8,-60 14,-52" fill="none" stroke={P.mastilo} strokeWidth={2.5} opacity={0.5} />
                <path d="M-80,300 C-70,240 -60,200 -40,170 L60,190 C54,230 46,270 44,300Z" fill={P.dzemper} stroke={P.mastilo} strokeWidth={4} />
              </g>
            )}
            {objava > 0.3 &&
              [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const a = (i / 8) * Math.PI * 2;
                const r = 60 + (f - kOglas) * 7;
                return <circle key={i} cx={Math.cos(a) * r} cy={200 + Math.sin(a) * r * 0.5} r={7} fill={i % 2 ? P.zelena500 : P.zlatna} opacity={Math.max(0, 1 - (f - kOglas) / 18)} />;
              })}
          </g>
        </g>
      )}
      {smena > 0 && (
        <g opacity={smena}>
          <Hrapavo>
            <Kamera x={540} y={1130} z={1.32}>
              <Ulica />
              <g transform="translate(900 950)">
                <Drvo s={0.9} />
              </g>
              <g transform="translate(1030 1080)">
                <Kuca s={0.9} zid={P.zid} />
              </g>
              <g transform="translate(-20 1040)">
                <Kuca s={0.8} zid="#E4CFC0" />
              </g>
              <path d="M-400,1360 L1500,1360 L1500,1500 L-400,1500Z" fill="#D8C08E" />
              <g transform="translate(830 1370)">
                <Kapija otvor={0.95} />
              </g>
              <Lik
                x={interpolate(dolazak, [0, 1], [-300, 430])}
                y={1450}
                s={1}
                {...KOMSIJA}
                hod={dolazak < 0.98 ? f / 3 + 1 : undefined}
                glava={{ ...KOMSIJA.glava, izraz: ruk > 0.5 ? "srecna" : "osmeh", pogled: [1, 0] }}
                dr={ruk > 0 ? [interpolate(ruk, [0, 1], [10, 45]) + trese, -10] : f > kPrepisale - 8 ? [110, 60] : [10, 10]}
                drziD={
                  f > kPrepisale - 8 && ruk < 0.2 ? (
                    <g transform="rotate(-10) scale(0.22)">
                      <Telefon />
                    </g>
                  ) : undefined
                }
              />
              <Lik
                x={interpolate(dolazak, [0, 1], [-160, 170])}
                y={1440}
                s={0.95}
                {...KOMSINICA}
                hod={dolazak < 0.98 ? f / 3 : undefined}
                glava={{ ...KOMSINICA.glava, izraz: f > kDve ? "srecna" : "osmeh" }}
                dr={[40, 50]}
                drziD={
                  <g transform="translate(0 70)">
                    <Korpa n={3} f={f} kDve={kDve} kTri={kTri} />
                  </g>
                }
              />
              <Lik
                x={820}
                y={1440}
                s={1}
                {...MILICA}
                okreni
                glava={{ ...MILICA.glava, izraz: f > kPrepisale ? "srecna" : "osmeh", pogled: [1, 0] }}
                dr={ruk > 0 ? [interpolate(ruk, [0, 1], [10, 45]) - trese, -10] : f > kDve ? [70, 30] : [15, 10]}
                lr={[10, 20]}
              />
            </Kamera>
          </Hrapavo>
          {f >= kPrepisale && (
            <g transform={`translate(${interpolate(zapis, [0, 1], [300, 540])} ${interpolate(zapis, [0, 1], [900, 380])}) rotate(${interpolate(zapis, [0, 1], [-14, -2])}) scale(${1.2 * zapis})`}>
              <Zapis od="Komšije" ka="Milica" iznos="1.500 POENA" />
            </g>
          )}
        </g>
      )}
    </Kadar>
  );
};
