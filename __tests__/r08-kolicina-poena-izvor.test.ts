import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  MAX_ZAPIS, PRAG_UPOZORENJA, stanjeGranice, staje, porukaUzbune,
} from "@/lib/protokol/granica-zapisa";

/**
 * R-08 — količina POEN-a. Mere M-1 … M-4 i M-6.
 *
 * 🔴 Šta je nalaz, a šta NIJE. Registar rizika ga je vodio kao „strukturnu
 * hiperinflaciju uz objavljen odnos 1:1". Obe premise su pale: odnos 1:1 je
 * uklonjen setom 4.5.8 (R-01), a rast koji prati broj učesnika i njihovu
 * uključenost nije inflacija — to je evidencija koja raste sa onim što meri, i
 * ide u oba smera, jer pet osnova poništava zapise.
 *
 * Ostaju tri stvarna nalaza, i ova brana čuva sva tri:
 *   1. ekran je obećavao FIKSAN dnevni iznos, a pravilo isporučuje srazmeran deo
 *      (programi podrške čl. 5) — pri tesnom limitu i desetinu obećanog;
 *   2. whitepaper je tvrdio da limit od 10% „štiti od inflatornog pritiska" —
 *      procenat zaliha ne može da ograniči zalihu, on deli dnevnu emisiju;
 *   3. granica ipak postoji, ali je postavlja TIP KOLONE (`INTEGER`), ne norma.
 *
 * 🔴 Brana gleda IZVOR, istim postupkom kao `r03-posebne-kategorije-izvor`:
 * tačno pravilo ne vredi ništa dok ga prikaz zaista ne prođe.
 */

const koren = join(__dirname, "..");
const izvor = (p: string) => readFileSync(join(koren, p), "utf-8");
const JEZICI = ["sr", "en", "ru", "hr", "hu"] as const;
const poruke = (j: string) => JSON.parse(izvor(`messages/${j}.json`));
const AKTI = ["", "en/", "ru/", "hr/", "hu/"];

describe("M-6 — tehnička granica zapisa", () => {
  it("granica je PostgreSQL INTEGER, prag je ispod nje", () => {
    expect(MAX_ZAPIS).toBe(2_147_483_647);
    expect(PRAG_UPOZORENJA).toBeLessThan(MAX_ZAPIS);
    expect(PRAG_UPOZORENJA).toBeGreaterThan(MAX_ZAPIS * 0.5);
  });

  it("stanje se menja na pragu i na granici, u oba znaka", () => {
    expect(stanjeGranice(0)).toBe("uredno");
    expect(stanjeGranice(PRAG_UPOZORENJA - 1)).toBe("uredno");
    expect(stanjeGranice(PRAG_UPOZORENJA)).toBe("upozorenje");
    expect(stanjeGranice(MAX_ZAPIS)).toBe("granica");
    // zapis Protokola je NEGATIVAN i jednak −opticaj
    expect(stanjeGranice(-MAX_ZAPIS)).toBe("granica");
    expect(stanjeGranice(-PRAG_UPOZORENJA)).toBe("upozorenje");
  });

  it("`staje` odbija tačno ono što bi oborilo kolonu", () => {
    expect(staje(0, MAX_ZAPIS)).toBe(true);
    expect(staje(1, MAX_ZAPIS)).toBe(false);
    expect(staje(-(MAX_ZAPIS - 10), 10)).toBe(true);
    expect(staje(-(MAX_ZAPIS - 10), 11)).toBe(false);
  });

  it("uzbuna imenuje i uzrok i ispravku — ispravka je migracija, ne podešavanje", () => {
    const p = porukaUzbune(PRAG_UPOZORENJA);
    expect(p).toMatch(/INTEGER/);
    expect(p).toMatch(/BIGINT/);
    expect(p).toMatch(/Wallet\.balance/);
  });

  it("uzbuna ide iz NOĆNE EMISIJE (jednom dnevno), ne iz jezgra emisije", () => {
    const nocna = izvor("src/lib/protokol/programi.ts");
    expect(nocna).toMatch(/stanjeGranice\(opticaj\)/);
    expect(nocna).toMatch(/posaljiAdminAlert/);
    // 🔴 U jezgru bi provera slala hiljade istih poruka u jednoj noći —
    // noćni prolaz emituje po korisniku.
    const jezgro = izvor("src/lib/protokol/emisija.ts");
    expect(jezgro).not.toMatch(/stanjeGranice/);
  });

  it("jezgro emisije prevodi Postgres grešku u razumljivu", () => {
    const jezgro = izvor("src/lib/protokol/emisija.ts");
    expect(jezgro).toMatch(/out of range/i);
    expect(jezgro).toMatch(/MAX_ZAPIS/);
  });
});

describe("M-1 — ekran ne obećava fiksan iznos", () => {
  it("napomena o srazmernom umanjenju postoji na svih pet jezika", () => {
    for (const j of JEZICI) {
      const v: string = poruke(j).programi?.srazmerno_napomena ?? "";
      expect(v.length, `${j}: nedostaje programi.srazmerno_napomena`).toBeGreaterThan(40);
    }
  });

  it("srpska napomena imenuje i umanjenje i to da se razlika ne prenosi", () => {
    const v: string = poruke("sr").programi.srazmerno_napomena;
    expect(v).toMatch(/traženi/i);
    expect(v).toMatch(/srazmerno/i);
    expect(v).toMatch(/ne prenosi/i);
  });

  it("reč „fiksan“ više ne stoji uz dnevni iznos (sr)", () => {
    const pr = poruke("sr").programi;
    expect(pr.skolovanje_napomena).not.toMatch(/fiksan|fiksni/i);
  });

  it("napomena se iscrtava i uz socijalne programe i uz operativni doprinos", () => {
    // Oba dele ISTI dnevni limit (programi podrške čl. 5), pa se srazmerno
    // umanjenje tiče oba — jedno mesto ne bi bilo dovoljno.
    const ekran = izvor("src/app/(app)/programi/ProgramiKlijent.tsx");
    const pojava = ekran.match(/srazmerno_napomena/g) ?? [];
    expect(pojava.length).toBe(2);
  });
});

describe("M-2 — whitepaper više ne tvrdi da procenat zaliha štiti od inflacije", () => {
  for (const j of AKTI) {
    it(`ukinuta tvrdnja ne postoji (${j || "sr"})`, () => {
      const w = izvor(`dokumentacija 4.1/${j}whitepaper_4_6_6.md`);
      expect(w).not.toMatch(/inflatornog pritiska/i);
      expect(w).not.toMatch(/inflationary pressure/i);
      expect(w).not.toMatch(/инфляционного давления/i);
      expect(w).not.toMatch(/inflációs nyomástól/i);
    });
  }

  it("umesto nje stoji tačan opis: limit deli emisiju, ne ograničava ukupan broj (sr)", () => {
    const w = izvor("dokumentacija 4.1/whitepaper_4_6_6.md");
    expect(w).toMatch(/nije gornja granica ukupnog broja POEN-a/);
    expect(w).toMatch(/srazmerno umanjuju/);
    expect(w).toMatch(/prati broj učesnika/);
  });
});

describe("M-3 — programi podrške ne tvrde da iznos nema gornju granicu", () => {
  for (const j of AKTI) {
    it(`ukinuta rečenica ne postoji (${j || "sr"})`, () => {
      const a = izvor(`dokumentacija 4.1/${j}programi_podrske_4_6_6.md`);
      expect(a).not.toMatch(/nema gornju granicu/i);
      expect(a).not.toMatch(/no upper limit/i);
      expect(a).not.toMatch(/не имеет верхнего предела/i);
      expect(a).not.toMatch(/nincs felső határa/i);
    });
  }

  it("čl. 5 — koji tu rečenicu i obara — ostaje netaknut", () => {
    const a = izvor("dokumentacija 4.1/programi_podrske_4_6_6.md");
    expect(a).toMatch(/ne sme preći 10% opticaja/);
    expect(a).toMatch(/srazmerno umanjuju/);
  });
});

describe("M-4 — FAQ i pravna pozicija", () => {
  it("FAQ ne tvrdi više da tempo osnivačkog kanala nije proizvoljan", () => {
    const faq = izvor("src/lib/faq-data.ts");
    expect(faq).not.toMatch(/Tempo nije proizvoljan/);
    expect(faq).toMatch(/Tempo prati rast sistema/);
  });

  it("FAQ otvoreno kaže ko tempo određuje u Fazi 1", () => {
    const faq = izvor("src/lib/faq-data.ts");
    expect(faq).toMatch(/brzinu kojom se osnivački kanal prazni u ovoj fazi određuje Fondacija/);
  });

  it("odeljak o količini POEN-a postoji na svih pet jezika", () => {
    for (const j of JEZICI) {
      const pp = poruke(j).pravnaPozicija ?? {};
      expect(pp.sporno3_naslov, `${j}: nema sporno3_naslov`).toBeTruthy();
      expect((pp.sporno3_tekst ?? "").length, `${j}: sporno3_tekst prekratak`).toBeGreaterThan(300);
    }
  });

  it("odeljak se i iscrtava", () => {
    const str = izvor("src/app/(public)/pravna-pozicija/page.tsx");
    expect(str).toMatch(/sporno3_naslov/);
    expect(str).toMatch(/sporno3_tekst/);
  });

  it("srpski odeljak kaže i da granice nema i šta ostaje sporno", () => {
    const v: string = poruke("sr").pravnaPozicija.sporno3_tekst;
    expect(v).toMatch(/nije ograničen unapred određenim brojem/);
    expect(v).toMatch(/nije ni jednosmeran/);
    expect(v).toMatch(/2\.400\.000/);          // jedina apsolutna granica
    expect(v).toMatch(/često se čita kao gornja granica — nije/);
    expect(v).toMatch(/dobija manje od iznosa koji propisuje formula/);
  });

  it("🔴 tehnička granica se NE piše u copy — nije normativna i menja se migracijom", () => {
    for (const j of JEZICI) {
      const s = JSON.stringify(poruke(j));
      expect(s).not.toMatch(/2\.147\.483\.647|2,147,483,647|2147483647/);
    }
    expect(izvor("src/lib/faq-data.ts")).not.toMatch(/2\.147\.483\.647|2147483647/);
  });
});
