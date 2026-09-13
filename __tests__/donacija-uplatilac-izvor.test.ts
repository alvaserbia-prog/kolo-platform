import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRAG_PROVERE_POREKLA_RSD,
  PROZOR_PRAGA_MESECI,
  trebaIzjavaOPoreklu,
} from "@/lib/donacija-pravila";

/**
 * R-19 (sprečavanje pranja novca) — uplatilac i izjava o poreklu sredstava.
 *
 * Nalaz koji je ovo pokrenuo: `POST /api/admin/donacija` je donaciju evidentirao
 * PO POZIVU NA BROJ, a poziv na broj je TRAJAN broj člana. Ime koje ide na zapis
 * i u ugovor uzimalo se iz PROFILA člana, ne iz izvoda — pa je bilo ko sa bilo
 * kog računa mogao da uplati na tuđi poziv na broj, a sistem bi zapisao da je
 * član donirao i izdao mu ugovor koji to tvrdi. Uplatilac i donator se nigde
 * nisu poredili.
 *
 * Provera je ljudska (čovek gleda izvod); ovi testovi čuvaju da polje ne nestane
 * i da izjava o poreklu ostane vezana za prag, a ne za svaku donaciju.
 */

const koren = join(__dirname, "..");
const izvor = (p: string) => readFileSync(join(koren, p), "utf-8");

describe("prag za izjavu o poreklu sredstava", () => {
  it("prag je ispod zakonskog praga identifikacije (15.000 EUR)", () => {
    expect(PRAG_PROVERE_POREKLA_RSD).toBeGreaterThan(0);
    expect(PRAG_PROVERE_POREKLA_RSD).toBeLessThan(1_750_000);
  });

  it("prozor je dvanaest meseci — isto što i akt (čl. 5b)", () => {
    expect(PROZOR_PRAGA_MESECI).toBe(12);
  });

  it("donacija ispod praga ne traži izjavu", () => {
    expect(trebaIzjavaOPoreklu(PRAG_PROVERE_POREKLA_RSD - 1, 0)).toBe(false);
  });

  it("donacija tačno na pragu ne traži izjavu (traži se PREKO praga)", () => {
    expect(trebaIzjavaOPoreklu(PRAG_PROVERE_POREKLA_RSD, 0)).toBe(false);
  });

  it("donacija preko praga traži izjavu", () => {
    expect(trebaIzjavaOPoreklu(PRAG_PROVERE_POREKLA_RSD + 1, 0)).toBe(true);
  });

  it("prag se meri i na ZBIR u prozoru — inače se zaobilazi deljenjem na rate", () => {
    const pola = Math.round(PRAG_PROVERE_POREKLA_RSD * 0.6);
    expect(trebaIzjavaOPoreklu(pola, 0)).toBe(false);
    expect(trebaIzjavaOPoreklu(pola, pola)).toBe(true);
  });

  it("neispravan ulaz pada na stranu opreza (traži izjavu)", () => {
    expect(trebaIzjavaOPoreklu(Number.NaN, 0)).toBe(true);
    expect(trebaIzjavaOPoreklu(Number.POSITIVE_INFINITY, 0)).toBe(true);
  });
});

describe("IZVOR — uplatilac se traži i upisuje", () => {
  const ruta = izvor("src/app/api/admin/donacija/route.ts");
  const servis = izvor("src/lib/protokol/donacija.ts");
  const ugovor = izvor("src/lib/donacija-ugovor.ts");

  it("admin ruta odbija evidentiranje bez uplatioca", () => {
    expect(ruta).toContain("body.uplatilac");
    expect(ruta).toMatch(/uplatilac\.length\s*<\s*2/);
  });

  it("uplatilac ide u evidentiranje na oba ručna puta", () => {
    // Potvrda najavljenog zapisa i ručna evidencija iz izvoda — oba moraju da
    // proslede uplatioca, inače jedan put ostaje bez provere.
    expect(ruta.match(/uplatilac,/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  it("uplatilac ulazi u revizijski dnevnik", () => {
    expect(ruta).toContain("uplatilac: ${uplatilac}");
  });

  it("servis upisuje uplatioca na zapis donacije", () => {
    expect(servis).toMatch(/uplatilac,/);
    expect(servis).toContain("straniPriliv");
  });

  it("🔴 uplatilac NE stoji u opisu transakcije POEN-a (R-03, mera M-3b)", () => {
    // Brana je OKRENUTA 13.09.2026. Uz R-19 je tražila suprotno, sa obrazloženjem
    // da je ime javnog donatora „ionako u listi donacija". To obrazloženje je palo
    // sa merom M-3a: lista se sužava na redovne članove, a zapis transakcije ide
    // svakom prijavljenom nalogu, uključujući nepotvrđene, kojima je pseudonim
    // strane maskiran. Ime i prezime u opisu identifikuje jače nego ono što je
    // sakriveno, pa je opis postao širi kanal od onoga na koji je pristanak dat.
    //
    // Uplatilac ostaje gde mu je mesto — na `DonationRecord` (AML trag, čl. 3
    // st. 5), i vidi ga samo Fondacija. To čuvaju testovi iznad.
    expect(servis).not.toContain("transakcije.donacija_uplatilac");
    expect(servis).not.toContain("uplatilac: ${uplatilac}");
    expect(servis).toContain('kljuc: "transakcije.donacija"');
  });

  it("ugovor nosi izjavu o poreklu samo kad je prag pređen", () => {
    expect(servis).toContain("trebaIzjavaOPoreklu");
    expect(servis).toContain("izjavaOPoreklu");
    expect(ugovor).toContain("p.izjavaOPoreklu");
    expect(ugovor).toContain("potiču iz zakonitih izvora");
  });

  it("ugovor imenuje uplatioca kad je poznat", () => {
    expect(ugovor).toContain("Uplata je izvršena sa računa koji glasi na");
  });
});

describe("IZVOR — tekstovi uz uplatioca", () => {
  for (const jezik of ["sr", "en", "ru", "hr", "hu"]) {
    it(jezik, () => {
      const m = JSON.parse(izvor(`messages/${jezik}.json`));
      // 🔴 Ime uplatioca je IZAŠLO iz opisa transakcije (R-03, mera M-3b), pa
      // parametar `{uplatilac}` ne sme da preživi ni u jednom prevodu: next-intl
      // baca kad prevod traži parametar koji kod ne šalje. Tvrdnja je okrenuta —
      // uz R-19 je tražila suprotno; razlog obrta stoji uz proveru servisa iznad.
      expect(m.transakcije.donacija_uplatilac ?? "").not.toContain("{uplatilac}");
      expect(m.donacije.karticno_sopstvena_kartica.length).toBeGreaterThan(20);
      // 🔴 Namespace `admin` živi ISKLJUČIVO u sr (odluka od 2026-09-13) —
      // `src/i18n/request.ts` ga dodaje svakom drugom jeziku pri učitavanju
      // poruka. Provera nad `m.admin` u prevodima je zato tražila ključ koji po
      // pravilu ne sme da postoji; to je test obaralo od te odluke naovamo.
      if (jezik !== "sr") {
        expect(m.admin).toBeUndefined();
        return;
      }
      expect(m.admin.donacije_uplatilac_obavezan.length).toBeGreaterThan(5);
      expect(m.admin.donacije_strani_priliv.length).toBeGreaterThan(5);
    });
  }
});
