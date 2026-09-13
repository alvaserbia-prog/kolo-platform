/**
 * R-02 (Poreska uprava) — godišnja granica, razdvajanje dinarske strane i BRANA
 * NAD IZVOROM.
 *
 * 🔴 Zašto ovaj test uopšte postoji. Odbrana od kvalifikacije POEN-a kao prihoda
 * počiva na tome da Fondacija nigde ne utvrđuje njegovu vrednost izraženu u novcu.
 * Dve stvari bi je oborile tiho, bez ijednog vidljivog kvara:
 *
 *  1. kapa izražena u POEN-ima — svaka takva mera je preračun POEN → dinar, dakle
 *     upravo onaj odnos koji Uslovi čl. 19 i Pravilnik čl. 13 kažu da Fondacija ne
 *     primenjuje. Granica se zato meri sa RAČUNA dobavljača i nikad iz POEN-a;
 *  2. povratak dinarskog troška u istu tabelu sa brojem POEN-a po delu — odnos se
 *     tada dobija deljenjem, pa Fondacija ponovo objavljuje kurs (mera M-11).
 *
 * Zato test gleda izvor, a ne samo ponašanje.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  GODISNJA_GRANICA_VREDNOSTI_RSD,
  vrednostDelaRSD,
  uGodisnjojGranici,
  preostaloDoGraniceRSD,
} from "@/lib/nabavka-pravila";

const izvor = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf-8");

describe("godišnja granica po korisniku (nabavke čl. 21a)", () => {
  it("granica je dinarska i pozitivna", () => {
    expect(GODISNJA_GRANICA_VREDNOSTI_RSD).toBeGreaterThan(0);
  });

  it("vrednost dela je trošak podeljen brojem delova", () => {
    expect(vrednostDelaRSD(200_000, 50)).toBe(4_000);
  });

  it("nepoznat trošak ili broj delova ne daju procenu", () => {
    // Procenjena vrednost bila bi broj izveden iz nečega drugog — tačno ono što
    // čl. 21a st. 2 zabranjuje.
    expect(vrednostDelaRSD(null, 50)).toBeNull();
    expect(vrednostDelaRSD(200_000, null)).toBeNull();
    expect(vrednostDelaRSD(200_000, 0)).toBeNull();
    expect(vrednostDelaRSD(Number.NaN, 50)).toBeNull();
  });

  it("prijava prolazi dok zbir staje u granicu", () => {
    expect(uGodisnjojGranici(0, 4_000)).toBe(true);
    expect(uGodisnjojGranici(GODISNJA_GRANICA_VREDNOSTI_RSD - 4_000, 4_000)).toBe(true);
  });

  it("prijava pada kad bi zbir prešao granicu", () => {
    expect(uGodisnjojGranici(GODISNJA_GRANICA_VREDNOSTI_RSD - 3_999, 4_000)).toBe(false);
    expect(uGodisnjojGranici(GODISNJA_GRANICA_VREDNOSTI_RSD, 1)).toBe(false);
  });

  it("nepoznata vrednost dela ne zatvara prijavu sama po sebi", () => {
    // Odbijanje na osnovu broja koji nije utvrđen bilo bi odbijanje bez razloga.
    expect(uGodisnjojGranici(0, null)).toBe(true);
    // ...ali iscrpljena granica zatvara i tada, jer je već preuzeto uvek poznato.
    expect(uGodisnjojGranici(GODISNJA_GRANICA_VREDNOSTI_RSD, null)).toBe(false);
  });

  it("preostalo nikad nije negativno", () => {
    expect(preostaloDoGraniceRSD(GODISNJA_GRANICA_VREDNOSTI_RSD + 50_000)).toBe(0);
    expect(preostaloDoGraniceRSD(-5)).toBe(GODISNJA_GRANICA_VREDNOSTI_RSD);
    expect(preostaloDoGraniceRSD(Number.NaN)).toBe(GODISNJA_GRANICA_VREDNOSTI_RSD);
  });
});

describe("IZVOR — granica se meri sa računa, ne iz POEN-a", () => {
  const pravila = izvor("src/lib/nabavka-pravila.ts");
  const servis = izvor("src/lib/protokol/nabavka.ts");

  it("granica je izražena u dinarima, ne u POEN-ima", () => {
    expect(pravila).toContain("GODISNJA_GRANICA_VREDNOSTI_RSD");
    expect(pravila).not.toMatch(/GODISNJA_GRANICA_[A-Z_]*POEN/);
  });

  it("vrednost se računa iz placenoRSD i brojDelova", () => {
    expect(servis).toContain("preuzetaVrednostUGodini");
    expect(servis).toMatch(/placenoRSD/);
    expect(servis).toContain("vrednostDelaRSD");
  });

  it("broje se samo preuzeti delovi — rezervacija ne troši granicu", () => {
    const f = servis.slice(servis.indexOf("export async function preuzetaVrednostUGodini"));
    const telo = f.slice(0, f.indexOf("export async function prijaviSe"));
    expect(telo).toContain('status: "PREUZEO"');
    expect(telo).toContain("preuzetoAt");
  });

  it("prijaviSe stvarno proverava granicu, ne samo prag POEN-a", () => {
    const f = servis.slice(servis.indexOf("export async function prijaviSe"));
    const telo = f.slice(0, f.indexOf("/** Odustanak"));
    expect(telo).toContain("uGodisnjojGranici");
    expect(telo).toContain("preuzetaVrednostUGodini");
  });
});

describe("IZVOR — M-11: dinarska strana nije u istoj tabeli sa brojem POEN-a", () => {
  const ekran = izvor("src/app/(app)/nabavke/[id]/NabavkaDetaljKlijent.tsx");

  it("kalkulacija i dinarska strana su dve sekcije", () => {
    expect(ekran).toContain('t("kalkulacija")');
    expect(ekran).toContain('t("dinarska_naslov")');
  });

  it("k_poen_po_delu i k_placeno nisu u istoj tabeli", () => {
    const kalk = ekran.slice(ekran.indexOf('t("kalkulacija")'), ekran.indexOf('t("dinarska_naslov")'));
    expect(kalk).toContain('t("k_poen_po_delu")');
    // 🔴 Ovo je cela svrha mere: ko podeli dinarski trošak brojem delova i uporedi
    // sa brojem POEN-a po delu, dobija kurs — objavljen od Fondacije.
    expect(kalk).not.toContain('t("k_placeno")');
    expect(kalk).not.toContain('t("k_nabavna")');
    expect(kalk).not.toContain('t("k_iznos")');
  });
});

describe("IZVOR — M-8: rec isplata je izasla iz decjeg kanala", () => {
  const sema = izvor("prisma/schema.prisma");
  const prijateljstva = izvor("src/lib/protokol/prijateljstva.ts");

  it("kolone se zovu poenEvidentiran / evidentiranAt", () => {
    expect(sema).toContain("poenEvidentiran");
    expect(sema).toContain("evidentiranAt");
    expect(sema).not.toContain("poenIsplacen");
    expect(sema).not.toContain("isplacenAt");
  });

  it("funkcija se zove probajEvidentirati", () => {
    expect(prijateljstva).toContain("probajEvidentirati");
    expect(prijateljstva).not.toContain("probajIsplatiti");
  });
});

describe("IZVOR — korisniku se pokazuje činjenica, ne poreski savet", () => {
  const ruta = izvor("src/app/api/nabavke/route.ts");
  const ekran = izvor("src/app/(app)/nabavke/NabavkeKlijent.tsx");

  it("ruta vraća preuzetu vrednost i preostalo", () => {
    expect(ruta).toContain("preuzetaVrednostUGodini");
    expect(ruta).toContain("preostaloRSD");
  });

  it("uz broj ne stoji nijedna reč o porezu", () => {
    // 🔴 Kvalifikacija davanja nije naša da je saopštavamo (Izjava o rizicima
    // čl. 10). Broj je činjenica sa računa; tumačenje bi bilo poreski savet.
    // Provera gleda TEKST KOJI KORISNIK VIDI, ne komentare u izvoru.
    for (const jez of ["sr", "en", "ru", "hr", "hu"] as const) {
      const m = JSON.parse(izvor(`messages/${jez}.json`));
      const vidljivo = String(m.nabavke.granica_pregled).toLowerCase();
      expect(vidljivo).not.toMatch(/porez|налог|adó|tax/);
      expect(vidljivo).not.toMatch(/prijav|declar|заяв|bevall/);
    }
    // A ekran i ruta ne smeju da posegnu za nekim drugim, poreskim ključem.
    for (const tekst of [ruta, ekran]) {
      expect(tekst).not.toMatch(/t\("[a-z_]*porez[a-z_]*"\)/);
    }
  });
});

describe("copy — poreski odeljak na /pravna-pozicija postoji", () => {
  const JEZICI = ["sr", "en", "ru", "hr", "hu"] as const;

  it.each(JEZICI)("%s ima porez_naslov i porez_tekst", (jez) => {
    const m = JSON.parse(izvor(`messages/${jez}.json`));
    expect(m.pravnaPozicija.porez_naslov).toBeTruthy();
    expect(m.pravnaPozicija.porez_tekst.length).toBeGreaterThan(200);
  });

  it.each(JEZICI)("%s nema vise reci Bonus uz pokroviteljstvo i Krug", (jez) => {
    const m = JSON.parse(izvor(`messages/${jez}.json`));
    for (const k of ["pokroviteljstvo", "krug_bonus"] as const) {
      expect(m.transakcije[k].toLowerCase()).not.toMatch(/bonus|бонус|bónusz/);
    }
  });
});
