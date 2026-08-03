/**
 * Testovi izuzetka za prvu generaciju (Pravilnik o dokazu stvarnosti v4.0.1,
 * čl. 12 stav 5): korisnici koje je neposredno verifikovao isti početni
 * korisnik mogu verifikovati jedni druge, dok ih uzlazna/silazna linija grafa
 * (uključujući recipročnu zabranu) ne poveže; izuzetak se ne prostire na dalje
 * potomke ni na parove pod različitim početnim korisnicima (koji su ionako
 * dozvoljeni po opštim pravilima); prelazno ograničenje (čl. 22) ostaje.
 */
import { describe, it, expect } from "vitest";
import {
  izgradiZonaGraf,
  izuzetakZaPrvuGeneraciju,
  proveriDozvoluVerifikacijeSaIzuzetkom,
  recomputeZonesSaGrafom,
  type ZonaZapis,
} from "@/lib/protokol/zona";
import { stanjeCvora } from "@/lib/protokol/graf";
import { PRELAZNI_OPTICAJ_PRAG } from "@/lib/protokol/dokaz-stvarnosti";
import { TipKorisnika } from "@/generated/prisma/client";

const z = (od: string, ka: string, min: number): ZonaZapis => ({
  verifikatorId: od,
  verifikovaniId: ka,
  vremenskiZig: new Date(Date.UTC(2026, 0, 1, 0, min)),
});

// Osnivač O verifikovao X, Y, W; X verifikovao Z (unuk).
const OSNOVA = [z("O", "X", 1), z("O", "Y", 2), z("O", "W", 3), z("X", "Z", 4)];
const POCETNI = new Set(["O"]);

function provera(zapisi: ZonaZapis[], a: string, b: string) {
  const { stanje, graf } = recomputeZonesSaGrafom(zapisi, POCETNI);
  return proveriDozvoluVerifikacijeSaIzuzetkom(stanje, graf, POCETNI, a, b);
}

describe("izuzetakZaPrvuGeneraciju (čista funkcija)", () => {
  const graf = izgradiZonaGraf(OSNOVA);

  it("braća pod istim početnim → izuzetak važi, u oba smera", () => {
    expect(izuzetakZaPrvuGeneraciju(graf, POCETNI, "X", "Y")).toBe(true);
    expect(izuzetakZaPrvuGeneraciju(graf, POCETNI, "Y", "X")).toBe(true);
  });

  it("ne prostire se na dalje potomke (stric↔unuk)", () => {
    expect(izuzetakZaPrvuGeneraciju(graf, POCETNI, "Y", "Z")).toBe(false);
    expect(izuzetakZaPrvuGeneraciju(graf, POCETNI, "Z", "Y")).toBe(false);
  });

  it("početni korisnik nikad nije strana izuzetka", () => {
    expect(izuzetakZaPrvuGeneraciju(graf, POCETNI, "O", "X")).toBe(false);
    expect(izuzetakZaPrvuGeneraciju(graf, POCETNI, "X", "O")).toBe(false);
  });

  it("postojeća linija gasi izuzetak (recipročno i tranzitivno)", () => {
    // X je verifikovao Y (po izuzetku) → linija X→Y
    const g2 = izgradiZonaGraf([...OSNOVA, z("X", "Y", 5)]);
    expect(izuzetakZaPrvuGeneraciju(g2, POCETNI, "Y", "X")).toBe(false); // recipročno
    // Y je verifikovao W → X je sada preko Y u liniji sa W
    const g3 = izgradiZonaGraf([...OSNOVA, z("X", "Y", 5), z("Y", "W", 6)]);
    expect(izuzetakZaPrvuGeneraciju(g3, POCETNI, "X", "W")).toBe(false);
    expect(izuzetakZaPrvuGeneraciju(g3, POCETNI, "W", "X")).toBe(false);
  });

  it("deca različitih početnih nisu obuhvaćena izuzetkom", () => {
    const g = izgradiZonaGraf([z("O", "X", 1), z("P", "Y", 2)]);
    const pocetni = new Set(["O", "P"]);
    expect(izuzetakZaPrvuGeneraciju(g, pocetni, "X", "Y")).toBe(false);
  });
});

describe("proveriDozvoluVerifikacijeSaIzuzetkom (merodavna provera)", () => {
  it("braća: osnovna zona blokira, izuzetak dozvoljava uz marker", () => {
    const r = provera(OSNOVA, "X", "Y");
    expect(r).toEqual({ dozvoljeno: true, izuzetak: true });
  });

  it("posle X→Y, Y→X ostaje blokirano (linija), X→W i dalje po izuzetku", () => {
    const zapisi = [...OSNOVA, z("X", "Y", 5)];
    expect(provera(zapisi, "Y", "X").dozvoljeno).toBe(false);
    expect(provera(zapisi, "X", "W")).toEqual({ dozvoljeno: true, izuzetak: true });
  });

  it("stric↔unuk ostaje blokiran; nezavisne grane prolaze bez izuzetka", () => {
    expect(provera(OSNOVA, "Y", "Z").dozvoljeno).toBe(false);
    // rođaci iz različitih grana: Z (pod X) i V (pod Y) — dozvoljeni po opštim pravilima
    const zapisi = [...OSNOVA, z("Y", "V", 5)];
    expect(provera(zapisi, "Z", "V")).toEqual({ dozvoljeno: true, izuzetak: false });
  });

  it("meta početni korisnik ostaje apsolutno blokirana", () => {
    const r = provera(OSNOVA, "X", "O");
    expect(r.dozvoljeno).toBe(false);
    if (!r.dozvoljeno) expect(r.vrsta).toBe("POCETNI_META");
  });
});

describe("stanjeCvora sa izuzetkom (graf prikaz)", () => {
  const brat = {
    id: "Y",
    jeOsnivac: false,
    tip: TipKorisnika.REGULARNI,
    indeks: 10,
    primljenoVerifikacija: 1,
  };

  it("ispod praga opticaja izuzetak ne menja prikaz — čl. 22 drži PUN", () => {
    const r = stanjeCvora("X", brat, true, true, PRELAZNI_OPTICAJ_PRAG - 1, true);
    expect(r).toEqual({ stanje: "PUN", razlog: "prelazno" });
  });

  it("iznad praga: zona + izuzetak → MOGU sa razlogom prva_generacija", () => {
    const r = stanjeCvora("X", brat, true, true, PRELAZNI_OPTICAJ_PRAG, true);
    expect(r).toEqual({ stanje: "MOGU", razlog: "prva_generacija" });
  });

  it("iznad praga bez izuzetka: ostaje ZONA", () => {
    const r = stanjeCvora("X", brat, true, false, PRELAZNI_OPTICAJ_PRAG, false);
    expect(r).toEqual({ stanje: "ZONA", razlog: "zona" });
  });
});
