/**
 * Brana: ime uz javnu donaciju NIJE trajno (set 4.6.8).
 *
 * Do 4.6.8 je ime javnog donatora ostajalo u listi i posle gašenja naloga, a
 * pristanak na objavu nije mogao da se povuče. Pristanak koji se ne može povući
 * nije slobodan (ZZPL čl. 15 st. 3), a obrazloženje „bez imena se upis ne može
 * pripisati licu" važi za trenutak evidentiranja, ne za posle: donacija ostaje
 * pripisana nalogu. Sada donator povlači ime po donaciji, a gašenje naloga ga briše.
 *
 * Uz to (R-05): Uslovi čl. 16 kažu da evidentiranje POEN-a ne menja poresku
 * kvalifikaciju posla i da obaveza računa ostaje; hijerarhija čl. 3 st. 4 stavlja
 * FAQ, ekrane i video ispod obavezujućih akata, a čl. 14 više ne nosi neodlučen
 * izbor u zagradama.
 *
 * Test gleda IZVOR: povratak starog pravila ne bi proizveo nijedan vidljiv kvar.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const KOREN = process.cwd();
const citaj = (p: string) => readFileSync(path.join(KOREN, p), "utf8");
const JEZICI = ["", "en/", "ru/", "hr/", "hu/"] as const;
const akt = (jezik: string, fajl: string) => citaj(`dokumentacija 4.1/${jezik}${fajl}`);

describe("kod: ime se povlači i briše, donacija ostaje", () => {
  it("ruta za povlačenje briše ime samo sa SOPSTVENE javne donacije", () => {
    const r = citaj("src/app/api/donacije/[id]/povuci-ime/route.ts");
    expect(r).toContain("userId: session.user.id");
    expect(r).toContain("javno: true");
    expect(r).toMatch(/donatorIme:\s*null,\s*imePovucenoAt:\s*new Date\(\)/);
    // Povlačenje ne dira POEN ni utvrđen identitet.
    expect(r).not.toContain("emitujPoen");
    expect(r).not.toContain("identitetUtvrdjenAt:");
  });

  it("gašenje naloga briše ime iz zapisa donacije", () => {
    const b = citaj("src/app/api/profil/route.ts");
    expect(b).toMatch(/donationRecord\.updateMany\(\{\s*where:\s*\{\s*userId,\s*donatorIme:\s*\{\s*not:\s*null\s*\}\s*\}/);
    expect(b).toMatch(/data:\s*\{\s*donatorIme:\s*null,\s*imePovucenoAt:\s*new Date\(\)\s*\}/);
  });

  it("lista zadržava donaciju kojoj je ime povučeno", () => {
    const l = citaj("src/app/api/donacije/route.ts");
    expect(l).toContain("{ javno: true, imePovucenoAt: { not: null } }");
    // Stara tvrdnja iz komentara — ne sme nazad.
    expect(l).not.toContain("ostaje i pošto korisnik ugasi nalog");
  });

  it("upozorenje pri donaciji ne obećava trajnost imena", () => {
    const sr = JSON.parse(citaj("messages/sr.json"));
    expect(sr.donacije.vidljivost_upozorenje).not.toContain("Ime ostaje uz zapis donacije");
    expect(sr.donacije.vidljivost_upozorenje).toContain("povučeš iz liste");
  });
});

describe("akti: povlačenje imena na svih pet jezika", () => {
  const NOVO: Record<string, string> = {
    "": "povući pristanak na objavljivanje imena i prezimena",
    "en/": "withdraw consent to the publication of their first and last name",
    "ru/": "отозвать согласие на публикацию имени и фамилии",
    "hr/": "povući privolu za objavljivanje imena i prezimena",
    "hu/": "a nevének közzétételéhez adott hozzájárulását bármikor visszavonhatja",
  };
  const UKINUTO: Record<string, string[]> = {
    "": ["ostaje u listi i pošto ugasi nalog", "ostaju u listi i pošto korisnik ugasi nalog", "Prihvaćena posledica javne donacije"],
    "en/": ["remains in the list even after they close their account", "remain in the list even after the user closes their account", "The accepted consequence of a public donation"],
    "ru/": ["остаётся в списке и после удаления учётной записи, поэтому", "Принятое следствие публичного пожертвования"],
    "hr/": ["ostaje na popisu i nakon što ugasi račun", "ostaju u popisu i nakon što korisnik ugasi račun", "Prihvaćena posljedica javne donacije"],
    "hu/": ["a fiók megszüntetése után is a listán marad, így", "A nyilvános adomány elfogadott következménye"],
  };
  const FAJLOVI = ["donacije_4_6_8.md", "uslovi_koriscenja_4_6_8.md", "politika_4_6_8.md", "radnje_obrade_4_6_8.md", "DPIA_4_6_8.md"];

  for (const j of JEZICI) {
    it(`${j || "sr/"}donacije čl. 5a: povlačenje postoji`, () => {
      expect(akt(j, "donacije_4_6_8.md")).toContain(NOVO[j]);
    });
    for (const f of FAJLOVI) {
      it(`${j || "sr/"}${f}: trajnost imena se ne vraća`, () => {
        const t = akt(j, f);
        for (const staro of UKINUTO[j]) expect(t).not.toContain(staro);
      });
    }
  }
});

describe("akti: R-05 i hijerarhija na svih pet jezika", () => {
  const FISKALNI: Record<string, string> = {
    "": "fiskalni račun",
    "en/": "fiscal receipt",
    "ru/": "фискальный чек",
    "hr/": "fiskalizirani račun",
    "hu/": "nyugta",
  };
  for (const j of JEZICI) {
    it(`${j || "sr/"}Uslovi i Izjava o rizicima: obaveza računa ne zavisi od POEN-a`, () => {
      expect(akt(j, "uslovi_koriscenja_4_6_8.md")).toContain(FISKALNI[j]);
      expect(akt(j, "rizici_4_6_8.md")).toContain(FISKALNI[j]);
    });
    it(`${j || "sr/"}hijerarhija: st. 4 čl. 3 postoji, čl. 14 bez neodlučenog izbora`, () => {
      const h = akt(j, "hijerarhija_4_6_8.md");
      expect(h).toContain("(4)");
      expect(h).not.toMatch(/\[[^\]]*\/[^\]]*\]/);
    });
  }
});
