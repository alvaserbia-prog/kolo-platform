/**
 * R-05 (Poreska uprava — PDV i fiskalizacija) — BRANA NAD IZVOROM.
 *
 * 🔴 Zašto ovaj test postoji. Ceo odgovor na PDV i fiskalizaciju stoji na dve
 * činjenice, i obe se mogu izgubiti tiho, bez ijednog vidljivog kvara:
 *
 *  1. **Fondacija ne ostvaruje sopstveni promet.** Donacija nije isporuka, kupovina
 *     je ulaz, prodajnog mesta nema, uplate se ne primaju, a PDV plaćen dobavljaču
 *     snosi se kao trošak i ne odbija kao prethodni porez (nabavke čl. 3a i 30).
 *     Besplatno davanje iz poslovne imovine izjednačava se sa prometom uz naknadu
 *     upravo kada je prethodni porez korišćen — zato je ta polovina rečenice
 *     odbrana, ne formalnost.
 *  2. **U sistemu nema dinarskog prometa.** Iznosi su u POEN-ima, Fondacija odnos
 *     prema dinaru ne objavljuje (M-7a uz R-01), a oglas koji traži dinare je
 *     zabranjen (Uslovi čl. 21, M-13). Da je dopušten, Platforma bi bila mesto na
 *     kome se DINARSKI promet organizuje — a i PDV i fiskalizacija vezuju se za
 *     njega, pa bi odbrana ostala bez predmeta.
 *
 * Uz to čuva M-7: mrtva polja oglasa (`buyerId`, `soldAt`, `jedinica`, `kolicina`,
 * status `SOLD`) su obrisana. Nijedna ruta ih nije postavljala, a stvarala su
 * `seller`/`buyer`/`price`/`soldAt` sliku iz koje se oglašavanje čita kao
 * posredovanje u prodaji. Ko ih vrati, vraća i taj prikaz.
 *
 * Odredbe samih akata zaključane su u `pravni-dokumenti.test.ts` (sr/en/ru) —
 * ovde se ne dupliraju.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { PRIJAVA_RAZLOZI, RAZLOG_OPIS, jeRazlogPrijave } from "@/lib/moderacija";

const JEZICI = ["sr", "en", "ru", "hr", "hu"] as const;
const izvor = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf-8");
const poruke = (j: string) =>
  JSON.parse(izvor(`messages/${j}.json`)) as Record<string, Record<string, unknown>>;

describe("M-13 — zabrana traženja dinara u oglasu", () => {
  it("razlog prijave PLACANJE_VAN_SISTEMA postoji i ima opis", () => {
    expect(PRIJAVA_RAZLOZI).toContain("PLACANJE_VAN_SISTEMA");
    expect(jeRazlogPrijave("PLACANJE_VAN_SISTEMA")).toBe(true);
    expect(RAZLOG_OPIS.PLACANJE_VAN_SISTEMA).toMatch(/van sistema/i);
  });

  it("IZVOR: obrazac za prijavu oglasa nudi taj razlog", () => {
    // Razlog koji postoji u tipu a ne stoji u spisku na ekranu ne može se
    // prijaviti — ista pouka kao „sve staze vode na taj ekran" kod dece.
    expect(izvor("src/app/(app)/pijaca/[id]/OglasDetalj.tsx")).toContain(
      "PLACANJE_VAN_SISTEMA",
    );
  });

  it("razlog ima prevod na svih pet jezika", () => {
    for (const j of JEZICI) {
      const p = poruke(j).pijaca as Record<string, string>;
      expect(p.prijava_razlog_placanje_van_sistema, j).toBeTruthy();
    }
  });
});

describe("M-5 — Fondacija ne objavljuje odnos POEN-a prema dinaru", () => {
  it("napomena uz primer na početnoj kaže da odnos ne objavljuje i ne preporučuje", () => {
    const traze: Record<string, RegExp> = {
      sr: /ne objavljuje i ne preporučuje/i,
      en: /neither publishes nor recommends/i,
      ru: /не публикует и не рекомендует/i,
      hr: /ne objavljuje i ne preporučuje/i,
      hu: /nem teszi közzé és nem ajánlja/i,
    };
    for (const j of JEZICI) {
      const t = (poruke(j).landing as Record<string, string>).primer_napomena_2;
      expect(t, j).toMatch(traze[j]);
    }
  });

  it("UKINUTO: dinarska cena više nije „orijentir pri dogovoru”", () => {
    // 🔴 Razlika je u subjektu, ne u tome da li se odnos pominje. „Cena služi kao
    // orijentir" je Fondacija koja preporučuje odnos — dakle utvrđena vrednost
    // POEN-a u novcu, koja daje i PDV osnovicu po tržišnoj vrednosti i element
    // definicije virtuelne valute iz R-01. Prećutati odnos je odbijeno (M-7b),
    // pa se menja ko za njim stoji.
    const zabranjeno: Record<string, RegExp> = {
      sr: /orijentir pri dogovoru/i,
      en: /reference point for that agreement/i,
      ru: /ориентиром при договорённости/i,
      hr: /orijentir pri dogovoru/i,
      hu: /tájékoztató a megállapodáshoz/i,
    };
    for (const j of JEZICI) {
      const t = (poruke(j).landing as Record<string, string>).primer_napomena_2;
      expect(t, j).not.toMatch(zabranjeno[j]);
    }
  });

  it("Uslovi čl. 18 st. 2 ne nazivaju iznos „cenom”", () => {
    // Isti broj je u čl. 19 i 20 „iznos u POEN-ima", a „cena" je stajala baš u
    // stavu o tome šta je javno svakom posetiocu — tamo se najlakše čita kao
    // cenovnik. Provera je vezana za tačan niz iz tog stava, pa ne pogađa reč
    // „cena" tamo gde je legitimna.
    //
    // 🟡 Gleda SAMO Uslove, ne ceo set: glavni Pravilnik čl. 16 nosi istu
    // formulaciju i nije bumpovan ovim setom (bump glavnog Pravilnika povlači
    // ispravke upućivanja u DPIA i Pravilniku o učešću dece). Kad se on jednom
    // bumpuje, provera se širi na set.
    const traze: Record<string, RegExp> = {
      sr: /zahteva, iznos u POEN-ima, lokacija/,
      en: /request, the amount in POEN, location/,
      ru: /запроса, сумма в ПОЕН, местоположение/,
      hr: /zahtjeva, iznos u POEN-ima, lokacija/,
      hu: /tartalma, a POEN-ben kifejezett összeg, a helység/,
    };
    for (const j of JEZICI) {
      const put = j === "sr"
        ? "dokumentacija 4.1/uslovi_koriscenja_4_6_1.md"
        : `dokumentacija 4.1/${j}/uslovi_koriscenja_4_6_1.md`;
      expect(izvor(put), j).toMatch(traze[j]);
    }
  });

  it("copy Pijace ne uvodi dinarski iznos", () => {
    // Iznosi u oglasima su u POEN-ima. Dinar na tim ekranima bi značio da odnos
    // objavljuje Platforma, ne korisnik.
    for (const j of JEZICI) {
      const p = poruke(j).pijaca as Record<string, unknown>;
      for (const [k, v] of Object.entries(p)) {
        if (typeof v !== "string") continue;
        expect(`${j}.${k}: ${v}`).not.toMatch(/\bRSD\b|\bdinar/i);
      }
    }
  });
});

describe("M-8 — poreski odeljak /pravna-pozicija pokriva PDV i fiskalizaciju", () => {
  it("odeljak je uvezan u stranicu", () => {
    const s = izvor("src/app/(public)/pravna-pozicija/page.tsx");
    expect(s).toContain('t("pdv_naslov")');
    expect(s).toContain('t("pdv_tekst")');
  });

  it("tekst postoji na svih pet jezika i nosi obe nosive činjenice", () => {
    const promet: Record<string, RegExp> = {
      sr: /ne odbija ga kao prethodni porez/i,
      en: /is not deducted as input tax/i,
      ru: /не принимает его к вычету/i,
      hr: /ne odbija ga kao pretporez/i,
      hu: /nem vonja le/i,
    };
    const mesto: Record<string, RegExp> = {
      sr: /ne drži prodajno mesto/i,
      en: /maintains no point of sale/i,
      ru: /не содержит места продажи/i,
      hr: /ne drži prodajno mjesto/i,
      hu: /nem tart fenn eladási helyet/i,
    };
    for (const j of JEZICI) {
      const pp = poruke(j).pravnaPozicija as Record<string, string>;
      expect(pp.pdv_naslov, j).toBeTruthy();
      expect(pp.pdv_tekst, j).toMatch(promet[j]);
      expect(pp.pdv_tekst, j).toMatch(mesto[j]);
    }
  });

  it("odeljak ne tvrdi da je poreski tretman utvrđen", () => {
    // Ista brana kao uz R-02: kvalifikaciju davanja daje nadležni organ, ne mi.
    const pp = poruke("sr").pravnaPozicija as Record<string, string>;
    expect(pp.pdv_tekst).toMatch(/ostaje sporno/i);
    expect(pp.pdv_tekst).toMatch(/poreski tretman ne garantuje/i);
  });
});

describe("M-7 — mrtva polja oglasa su obrisana", () => {
  const sema = izvor("prisma/schema.prisma");
  const model = sema.slice(
    sema.indexOf("model MarketplaceListing"),
    sema.indexOf("\n}", sema.indexOf("model MarketplaceListing")),
  );

  it("MarketplaceListing nema buyerId, soldAt, jedinica ni kolicina", () => {
    for (const polje of ["buyerId", "soldAt", "jedinica", "kolicina"]) {
      expect(model, polje).not.toContain(polje);
    }
  });

  it("ListingStatus nema vrednost SOLD", () => {
    const enumBlok = sema.slice(
      sema.indexOf("enum ListingStatus"),
      sema.indexOf("\n}", sema.indexOf("enum ListingStatus")),
    );
    expect(enumBlok).toContain("ACTIVE");
    expect(enumBlok).not.toContain("SOLD");
  });

  it("User nema relaciju BuyerListings", () => {
    expect(sema).not.toContain("BuyerListings");
  });

  it("IZVOR: ekrani ne čitaju obrisana polja", () => {
    for (const f of [
      "src/app/(app)/profil/oglasi/page.tsx",
      "src/app/(app)/profil/oglasi/MojiOglasiKlijent.tsx",
      "src/app/(app)/pijaca/[id]/OglasDetalj.tsx",
      "src/lib/reset-korisnika.ts",
    ]) {
      const s = izvor(f);
      expect(s, f).not.toContain("soldAt");
      expect(s, f).not.toContain('"SOLD"');
      expect(s, f).not.toContain("buyerId");
    }
  });
});
