import { describe, it, expect } from "vitest";
import { lat2cyr, lat2cyrDeep } from "@/lib/lat2cyr";

describe("lat2cyr — osnovna slova", () => {
  it("preslikava mala slova", () => {
    expect(lat2cyr("abvgde")).toBe("абвгде");
  });
  it("preslikava srpske dijakritike", () => {
    expect(lat2cyr("čćšžđ")).toBe("чћшжђ");
    expect(lat2cyr("ČĆŠŽĐ")).toBe("ЧЋШЖЂ");
  });
  it("preslikava j i c ispravno", () => {
    expect(lat2cyr("javnost")).toBe("јавност");
    expect(lat2cyr("cena")).toBe("цена");
  });
});

describe("lat2cyr — digrafi", () => {
  it("lj, nj, dž (mala)", () => {
    expect(lat2cyr("ljubav")).toBe("љубав");
    expect(lat2cyr("konj")).toBe("коњ");
    expect(lat2cyr("džak")).toBe("џак");
    expect(lat2cyr("budžet")).toBe("буџет");
  });
  it("title-case digraf", () => {
    expect(lat2cyr("Ljubav")).toBe("Љубав");
    expect(lat2cyr("Njegoš")).toBe("Његош");
  });
  it("all-caps digraf", () => {
    expect(lat2cyr("LJUBAV")).toBe("ЉУБАВ");
    expect(lat2cyr("NJEGOŠ")).toBe("ЊЕГОШ");
  });
});

describe("lat2cyr — realne reči iz sistema", () => {
  it("ključni termini", () => {
    expect(lat2cyr("Doprinos zajedničkom dobru")).toBe("Допринос заједничком добру");
    expect(lat2cyr("Verifikacija")).toBe("Верификација");
    expect(lat2cyr("Tabla jemstva")).toBe("Табла јемства");
    expect(lat2cyr("Novčanik")).toBe("Новчаник");
    expect(lat2cyr("Pošalji")).toBe("Пошаљи");
  });
});

describe("lat2cyr — zaštićeni tokeni", () => {
  it("e-mail ostaje netaknut", () => {
    expect(lat2cyr("Pišite na privatnost@ekolo.rs odmah")).toBe(
      "Пишите на privatnost@ekolo.rs одмах",
    );
  });
  it("URL ostaje netaknut", () => {
    expect(lat2cyr("Vidi https://ekolo.rs/pravilnik za detalje")).toBe(
      "Види https://ekolo.rs/pravilnik за детаље",
    );
  });
  it("goli domen ostaje netaknut", () => {
    expect(lat2cyr("Sajt ekolo.rs radi")).toBe("Сајт ekolo.rs ради");
  });
  it("skraćenice iz bele liste ostaju latinične", () => {
    expect(lat2cyr("Licenca AGPL-3.0 i CC BY-SA")).toBe("Лиценца AGPL-3.0 и CC BY-SA");
    expect(lat2cyr("Skeniraj QR kod")).toBe("Скенирај QR код");
    expect(lat2cyr("Iznos u RSD")).toBe("Износ у RSD");
  });
  it("pozajmljenica freelancer ostaje latinica u svim padežima", () => {
    expect(lat2cyr("Programeri i freelanceri")).toBe("Програмери и freelanceri");
    expect(lat2cyr("za freelancera")).toBe("за freelancera");
    expect(lat2cyr("Freelancerima")).toBe("Freelancerima");
  });
  it("blockchain, open source i email ostaju latinica", () => {
    expect(lat2cyr("Koristi blockchain tehnologiju")).toBe("Користи blockchain технологију");
    expect(lat2cyr("Softver je open source")).toBe("Софтвер је open source");
    expect(lat2cyr("Projekat je opensource danas")).toBe("Пројекат је opensource данас");
    expect(lat2cyr("Pošalji email odmah")).toBe("Пошаљи email одмах");
    expect(lat2cyr("Tvoj e-mail je bitan")).toBe("Твој e-mail је битан");
  });
});

describe("lat2cyr — brojevi i interpunkcija", () => {
  it("cifre i znakovi prolaze nepromenjeni", () => {
    expect(lat2cyr("Upiši 20.000 POEN-a (1:1)!")).toBe("Упиши 20.000 ПОЕН-а (1:1)!");
  });
});

describe("lat2cyr — idempotentnost", () => {
  it("ćirilični ulaz se ne menja", () => {
    const cir = "Допринос заједничком добру";
    expect(lat2cyr(cir)).toBe(cir);
  });
  it("dvostruka primena = jednostruka", () => {
    const t = "Pošalji POEN na ekolo.rs";
    expect(lat2cyr(lat2cyr(t))).toBe(lat2cyr(t));
  });
});

describe("lat2cyr — izuzeci (nj/dž koji nisu digraf)", () => {
  it("nadživeti se ne čita kao digraf dž", () => {
    expect(lat2cyr("nadziveti")).toBe("надживети");
  });
});

describe("lat2cyrDeep — i18n poruke", () => {
  it("rekurzivno konvertuje string vrednosti, čuva ključeve", () => {
    const ulaz = {
      nav: { pocetna: "Početna", sistem: "Sistem" },
      lista: ["Novčanik", "Pošalji"],
      broj: 42,
    };
    expect(lat2cyrDeep(ulaz)).toEqual({
      nav: { pocetna: "Почетна", sistem: "Систем" },
      lista: ["Новчаник", "Пошаљи"],
      broj: 42,
    });
  });
});
