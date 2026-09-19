/**
 * Prigovor Fondaciji — pravila i BRANA NAD IZVOROM (R-18, set 4.5.4).
 *
 * Zašto test gleda izvor, a ne samo ponašanje: pouka koja se u ovom projektu
 * ponovila već četiri puta — ispravno pravilo u čistoj funkciji ne vredi ništa
 * dok ga svaki prikaz i svaka ruta ne pozovu („sve staze vode na taj ekran").
 * Ovde se čuva i suprotno: da se uklonjena ulazna tačka ne vrati tiho.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  MAX_OTVORENIH_PO_VRSTI,
  ROK_IZJASNJENJA_DANA,
  ROK_NABAVKA_DANA,
  ROK_RAZMENA_DANA,
  jeVrstaPrigovora,
  rokIstekao,
  rokOd,
  smeOdlucitiORazmeni,
  smePodneti,
  trebaPredmet,
} from "@/lib/prigovor-pravila";

const izvor = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf-8");
const postoji = (p: string) => fs.existsSync(path.join(process.cwd(), p));

const SADA = new Date("2026-09-20T12:00:00Z");
const pre = (dana: number) => rokOd(SADA, -dana);

describe("rokovi i vrste", () => {
  it("rokovi su onakvi kakvi stoje u aktima", () => {
    expect(ROK_NABAVKA_DANA).toBe(7);
    expect(ROK_RAZMENA_DANA).toBe(30);
    expect(ROK_IZJASNJENJA_DANA).toBe(7);
  });

  it("predmet traže tačno dve vrste", () => {
    expect(trebaPredmet("RAZMENA")).toBe(true);
    expect(trebaPredmet("NABAVKA")).toBe(true);
    expect(trebaPredmet("PODACI")).toBe(false);
    expect(trebaPredmet("OSTALO")).toBe(false);
  });

  it("nepoznata vrsta ne prolazi", () => {
    expect(jeVrstaPrigovora("RAZMENA")).toBe(true);
    expect(jeVrstaPrigovora("NEPOSTOJECA")).toBe(false);
  });

  it("vrsta bez roka ne ističe nikad", () => {
    expect(rokIstekao(pre(3650), null, SADA)).toBe(false);
  });
});

describe("smePodneti", () => {
  const osnov = {
    vrsta: "NABAVKA" as const,
    opis: "Sir je bio pokvaren i vratio sam ga na licu mesta.",
    predmetId: "p1",
    otvorenihIsteVrste: 0,
    pocetakRoka: pre(1),
    sada: SADA,
  };

  it("uredan prigovor prolazi", () => {
    expect(smePodneti(osnov).ok).toBe(true);
  });

  it("bez predmeta ne prolazi kad ga vrsta traži", () => {
    expect(smePodneti({ ...osnov, predmetId: null }).ok).toBe(false);
  });

  it("prekratak opis ne prolazi", () => {
    expect(smePodneti({ ...osnov, opis: "loše" }).ok).toBe(false);
  });

  it("posle roka ne prolazi", () => {
    expect(smePodneti({ ...osnov, pocetakRoka: pre(8) }).ok).toBe(false);
    // razmena ima svoj, duži rok — isti dan prolazi
    expect(
      smePodneti({ ...osnov, vrsta: "RAZMENA", pocetakRoka: pre(8) }).ok,
    ).toBe(true);
  });

  it("kapa se meri PO VRSTI", () => {
    expect(smePodneti({ ...osnov, otvorenihIsteVrste: MAX_OTVORENIH_PO_VRSTI }).ok).toBe(false);
    expect(smePodneti({ ...osnov, otvorenihIsteVrste: MAX_OTVORENIH_PO_VRSTI - 1 }).ok).toBe(true);
  });
});

describe("izjašnjenje druge strane pre odluke", () => {
  it("dok rok traje odluke nema", () => {
    const i = smeOdlucitiORazmeni({
      izjasnjenjeDo: rokOd(SADA, 2),
      odgovorProtivAt: null,
      sada: SADA,
    });
    expect(i.ok).toBe(false);
  });

  it("po isteku roka odluka je moguća", () => {
    expect(
      smeOdlucitiORazmeni({ izjasnjenjeDo: pre(1), odgovorProtivAt: null, sada: SADA }).ok,
    ).toBe(true);
  });

  it("izjašnjenje pre roka otvara odluku odmah", () => {
    expect(
      smeOdlucitiORazmeni({ izjasnjenjeDo: rokOd(SADA, 5), odgovorProtivAt: pre(1), sada: SADA }).ok,
    ).toBe(true);
  });
});

describe("izvor — ulazna tačka je profil, ne istorija POEN-a", () => {
  it("ruta za prijavu uz prepis više ne postoji", () => {
    expect(postoji("src/app/api/transakcije/[id]/prijavi/route.ts")).toBe(false);
  });

  it("istorija POEN-a ne nudi prijavu", () => {
    const t = izvor("src/app/(app)/novcanik/IstorijaKlijent.tsx");
    expect(t).not.toContain("/prijavi");
    expect(t).not.toContain("prijavi_dugme");
  });

  it("ruta prigovora prima obe nove vrste i predmet", () => {
    const t = izvor("src/app/api/prigovor/route.ts");
    expect(t).toContain('tipOdluke === "RAZMENA"');
    expect(t).toContain('tipOdluke === "NABAVKA"');
    expect(t).toContain("predmetId");
    expect(t).toContain("smePodneti");
    // prepis se i dalje proverava zatečenim pravilom (maloletan, pošiljalac, jedna po prepisu)
    expect(t).toContain("smePrijaviti");
  });
});

describe("izvor — odluka o prepisu čeka drugu stranu", () => {
  it("servis poziva pravilo, ne ekran", () => {
    const t = izvor("src/lib/protokol/prijava-razmene.ts");
    expect(t).toContain("smeOdlucitiORazmeni");
    // i pri poništenju i pri odbacivanju — čl. 16 st. 10 kaže „pre odlučivanja"
    expect(t.split("smeOdlucitiORazmeni").length - 1).toBeGreaterThanOrEqual(3);
  });

  it("odluka zatvara i prigovor uz sebe", () => {
    const t = izvor("src/lib/protokol/prijava-razmene.ts");
    expect(t).toContain("zatvoriPrigovorUzPrijavu");
  });
});

describe("izvor — ispravka evidencije nije povraćaj", () => {
  const t = izvor("src/lib/protokol/nabavka-ispravka.ts");

  it("ide sopstvenim tipom transakcije", () => {
    expect(t).toContain("ISPRAVKA_NABAVKA");
    // NIKAD kao emisija kroz kanal iz čl. 15 ni kao prepis
    expect(t).not.toContain("EMISIJA_");
    expect(t).not.toContain("TransactionType.TRANSFER");
  });

  it("zero-sum: koliko korisniku, toliko Protokolu u minus", () => {
    expect(t).toContain("increment: poen");
    expect(t).toContain("decrement: poen");
  });

  it("ne može dvaput nad istom prijavom", () => {
    expect(t).toContain("ispravljenoAt: null");
  });
});

describe("izvor — obaveštenje o preuzimanju nosi pouku o roku", () => {
  it("pouka i rok su u tekstu obaveštenja", () => {
    const t = izvor("src/lib/protokol/nabavka.ts");
    expect(t).toContain("ROK_NABAVKA_DANA");
    expect(t).toContain("podneseš prigovor");
  });
});
