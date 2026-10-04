// Drugi način (scene 8–10): zajednička sveska na tabli i četvoro ljudi ispod nje — Ana, Milica, obućar, Stevan.
// Obućar daje cipele Milici, Milica ajvar Ani, Stevan drva obućaru; svako davanje se upiše u svesku
// („Ime · dao · šta“). Svaki događaj ima svoj frejm (undefined = još nije); ista slika služi trima scenama.
import React from "react";
import { Easing, interpolate } from "remotion";
import { P } from "../paleta";
import { Kamera, Kreda, Pop, napredak, useF } from "../alat";
import { ANA, Lik, MILICA, OBUCAR, STEVAN } from "../likovi";
import { Tegla } from "../predmeti";
import { Drva, Naramak, Oblacic, ParCipela, Sveska, Upitnik, type Red } from "../stvari";
import { ZnakKolo } from "../znak";
import { Pisi, Pod, Strelica } from "./zajednicko";

export const Y = 1285;
const S = 0.56;
const AX = 150;
const MX = 400;
const OX = 660;
const SX = 920;

export type ZapisDogadjaji = {
  cipele?: number; // cipele: obućar → Milica
  red1?: number; // upis: Obućar · dao cipele
  ajvar?: number; // tegla: Milica → Ana
  red2?: number;
  oblDrva?: number; // obućaru zatrebaju drva
  drva?: number; // drva: Stevan → obućar
  podvuci1?: number; // „jer se zna“: prvi red se podvuče
  red3?: number;
  krug?: number; // strelice se spoje
  upitnikNestaje?: number; // Stevanov upitnik (njegova potreba čeka) se obriše
  zatvori?: number; // sveska se zatvori i otvori
  kolo?: number; // četvoro igraju kolo, znak KOLO
  poen?: number; // zaglavlje POEN, redovi pozelene
};

const Leti: React.FC<{ t: number; x1: number; x2: number; y: number; children: React.ReactNode }> = ({ t, x1, x2, y, children }) => {
  const e = Easing.inOut(Easing.cubic)(t);
  return <g transform={`translate(${interpolate(e, [0, 1], [x1, x2])} ${y - Math.sin(e * Math.PI) * 140})`}>{children}</g>;
};

export const Zapis: React.FC<{ d: ZapisDogadjaji; kam?: { x: number; y: number; z: number } }> = ({ d, kam = { x: 540, y: 960, z: 1 } }) => {
  const f = useF();
  const ima = (t?: number) => t !== undefined && f >= t;
  const t = (od?: number, tr = 22) => (od === undefined ? 0 : napredak(f, od, tr));
  const tC = t(d.cipele);
  const tA = t(d.ajvar);
  const tD = t(d.drva);
  const zel = ima(d.poen);
  const redovi: Red[] = [];
  if (d.red1 !== undefined) redovi.push({ ime: "Obućar", sta: "dao cipele", at: d.red1, podvuci: d.podvuci1, boja: zel ? P.zelenaKreda : undefined });
  if (d.red2 !== undefined) redovi.push({ ime: "Milica", sta: "dala ajvar", at: d.red2, boja: zel ? P.zelenaKreda : undefined });
  if (d.red3 !== undefined) redovi.push({ ime: "Stevan", sta: "dao drva", at: d.red3, boja: zel ? P.zelenaKreda : undefined });
  // zatvaranje sveske: 0 → 1 → 0
  const zt = d.zatvori === undefined ? 0 : Math.sin(Math.min(1, Math.max(0, (f - d.zatvori) / 26)) * Math.PI);
  const kolo = ima(d.kolo);
  const ulazKolo = d.kolo === undefined ? 0 : napredak(f, d.kolo - 4, 16, Easing.out(Easing.cubic));
  const igra = kolo ? f - d.kolo! : 0;
  const korak = (i: number) => (kolo ? Math.sin(igra / 6 + i * 0.4) * 12 : 0);
  const ruke = (i: number): { lr: [number, number]; dr: [number, number] } => ({ lr: [-72, -18], dr: [72, 18] });
  const igraci = (
    <>
      {[ANA, MILICA, OBUCAR, STEVAN].map((p, i) => (
        <Lik
          key={i}
          x={210 + i * 220 + korak(0)}
          y={Y}
          s={S}
          {...p}
          glava={{ ...p.glava, izraz: "srecna" }}
          {...ruke(i)}
          hod={igra / 4 + i * 1.6}
          cipele={i === 1 ? "#A0583A" : undefined}
        />
      ))}
    </>
  );
  const ljudi = (
    <>
      <Lik x={AX} y={Y} s={S} {...ANA} glava={{ ...ANA.glava, izraz: tA >= 1 ? "srecna" : "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={tA >= 1 ? [15, 55] : tA > 0.6 ? [60, 30] : [-10, -20]} drziD={tA >= 1 ? <Tegla vrsta="ajvar" s={0.6} /> : undefined} />
      <Lik x={MX} y={Y} s={S} {...MILICA} okreni={ima(d.ajvar) && tA < 1} glava={{ ...MILICA.glava, izraz: tC >= 1 ? "srecna" : "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={[-10, -20]} cipele={tC >= 1 ? "#A0583A" : undefined} />
      <Lik x={OX} y={Y} s={S} okreni {...OBUCAR} glava={{ ...OBUCAR.glava, izraz: tD >= 1 ? "srecna" : "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={tD >= 1 ? [20, 60] : [-10, -20]} drziD={tD >= 1 ? <Naramak s={0.55} /> : undefined} />
      <Lik x={SX} y={Y} s={S} okreni {...STEVAN} glava={{ ...STEVAN.glava, izraz: "osmeh", pogled: [1, 0] }} lr={[10, 10]} dr={[-10, -20]} />
    </>
  );
  return (
    <Kamera {...kam}>
      <Kreda>
        <Pisi tekst="2." at={-30} x={110} y={210} velicina={130} brzina={1} />
        <Pisi tekst="zapis" at={-30} x={190} y={210} velicina={90} brzina={1} sidro="start" />
        <g transform="translate(540 485)">
          <Sveska w={920} h={470} redovi={redovi} zatvorena={zt} zaglavlje={d.poen !== undefined ? { tekst: "POEN", at: d.poen } : undefined} />
        </g>
        <Pod y={Y + 8} x0={60} x1={1020} />
        {!kolo || ulazKolo < 1 ? <g opacity={1 - ulazKolo}>{ljudi}</g> : null}
        {kolo && <g opacity={ulazKolo}>{igraci}</g>}
        {/* stvari koje putuju */}
        {tC > 0 && tC < 1 && (
          <Leti t={tC} x1={OX - 70} x2={MX + 70} y={Y - 300}>
            <ParCipela s={0.45} />
          </Leti>
        )}
        {tA > 0 && tA < 1 && (
          <Leti t={tA} x1={MX - 70} x2={AX + 70} y={Y - 280}>
            <Tegla vrsta="ajvar" s={0.6} />
          </Leti>
        )}
        {tD > 0 && tD < 1 && (
          <Leti t={tD} x1={SX - 70} x2={OX + 70} y={Y - 300}>
            <Naramak s={0.6} />
          </Leti>
        )}
        {ima(d.oblDrva) && !ima(d.drva) && (
          <Pop at={d.oblDrva!} x={OX + 150} y={Y - 525} skala={0.56}>
            <Oblacic w={260} h={170} rep="levo">
              <g transform="translate(0 64)">
                <Drva s={0.55} />
              </g>
            </Oblacic>
          </Pop>
        )}
        {/* Stevanova potreba (krečenje) čeka: upitnik koji se obriše kad se zna da je on dao */}
        {ima(d.red3) && !kolo && (
          <g opacity={d.upitnikNestaje === undefined ? 1 : 1 - napredak(f, d.upitnikNestaje, 12)}>
            <Pop at={d.red3!} x={SX + 30} y={Y - 455} skala={0.5}>
              <Upitnik boja={P.oker} />
            </Pop>
          </g>
        )}
        {/* krug davanja */}
        {ima(d.krug) && !kolo && (
          <>
            <Strelica x1={OX - 40} y1={Y - 455} x2={MX + 40} y2={Y - 455} luk={-60} napredak={napredak(f, d.krug!, 12)} boja={P.zelenaKreda} />
            <Strelica x1={MX - 40} y1={Y - 455} x2={AX + 40} y2={Y - 455} luk={-60} napredak={napredak(f, d.krug! + 6, 12)} boja={P.zelenaKreda} />
            <Strelica x1={SX - 40} y1={Y - 455} x2={OX + 40} y2={Y - 455} luk={-60} napredak={napredak(f, d.krug! + 12, 12)} boja={P.zelenaKreda} />
          </>
        )}
      </Kreda>
      {kolo && (
        <Pop at={d.kolo!} x={900} y={135} skala={0.42}>
          <ZnakKolo id="znak10" />
        </Pop>
      )}
    </Kamera>
  );
};
