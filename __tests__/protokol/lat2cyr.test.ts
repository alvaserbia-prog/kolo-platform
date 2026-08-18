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
  it("Google i naziv fascikle Spam ostaju latinica", () => {
    // „Гоогле" i „Спам фасцикла" su izlazili na ekranu; ime firme i naziv
    // fascikle u klijentu za poštu čitaju se onako kako u klijentu i stoje.
    expect(lat2cyr("Prijavi se Google nalogom")).toBe("Пријави се Google налогом");
    expect(lat2cyr("Prijava preko Google-a nije uspela.")).toBe(
      "Пријава преко Google-а није успела.",
    );
    expect(lat2cyr("Proveri i Spam fasciklu.")).toBe("Провери и Spam фасциклу.");
    // Obična reč „spam" je odomaćena — ona ide u ćirilicu.
    expect(lat2cyr("spam poruke")).toBe("спам поруке");
  });
  it("skraćenice i imena fajlova iz zajedničkog dobra ostaju latinica", () => {
    expect(lat2cyr("Doprinosi idu uz Signed-off-by")).toBe("Доприноси иду уз Signed-off-by");
    expect(lat2cyr("Vidi CONTRIBUTING.md i DCO")).toBe("Види CONTRIBUTING.md и DCO");
    expect(lat2cyr("Procena DPIA je objavljena")).toBe("Процена DPIA је објављена");
  });
  it("APR i PIB ostaju latinica (odluka vlasnika, iako je АПР/ПИБ pravilna ćirilica)", () => {
    expect(lat2cyr("Registar zadužbina i fondacija (APR)")).toBe(
      "Регистар задужбина и фондација (APR)",
    );
    expect(lat2cyr("PIB 115840443")).toBe("PIB 115840443");
  });
  it("ICU plural zadržava sintaksu, a tekst grana ide u ćirilicu", () => {
    // Prosta maska `{[^{}]*}` ne pokriva ugnežđene zagrade, pa su ključne reči
    // odlazile u ćirilicu (`{цоунт, плурал, оне …}`) i next-intl više nije umeo
    // da pročita poruku. Sintaksa mora ostati latinična, a „stranica“ ne sme —
    // to je jedino što čovek vidi.
    expect(lat2cyr("{count, plural, one {# stranica} few {# stranice} other {# stranica}}")).toBe(
      "{count, plural, one {# страница} few {# странице} other {# страница}}",
    );
  });
  it("formati slika i oznake granica ostaju latinica", () => {
    // „ili" je srpska reč i ide u ćirilicu — latinica ostaju samo oznake formata.
    expect(lat2cyr("JPG, PNG ili WebP")).toBe("JPG, PNG или WebP");
    expect(lat2cyr("Max POEN")).toBe("Max ПОЕН");
    expect(lat2cyr("Slika je prevelika (max 5MB).")).toBe("Слика је превелика (max 5МБ).");
  });
  it("browser ostaje latinica u svim padežima", () => {
    expect(lat2cyr("Ovaj browser ne podržava obaveštenja")).toBe("Овај browser не подржава обавештења");
    expect(lat2cyr("u podešavanjima browsera")).toBe("у подешавањима browsera");
  });
  it("imena stranih sistema i naslovi na engleskom ostaju latinica", () => {
    // Engleska fraza bez slova q/w/x/y ne izgleda polomljeno — samo tiho postane
    // ćirilična besmislica, pa se maskira cela fraza, ne pojedinačne reči.
    expect(lat2cyr("WIR je stariji od Sardexa")).toBe("WIR је старији од Sardexa");
    expect(lat2cyr("prva Local Exchange Trading System mreža")).toBe(
      "прва Local Exchange Trading System мрежа",
    );
    expect(lat2cyr("knjiga The End of Money and the Future of Civilization")).toBe(
      "књига The End of Money and the Future of Civilization",
    );
  });
  it("imena proizvoda ostaju latinica", () => {
    // Ove ne hvata provera „mešanih" reči — bez slova q/w/x/y rezultat je čista
    // ćirilica, pa polomljen izraz izgleda kao običan tekst („Цлоудфларе Р2").
    expect(lat2cyr("plaćanje uz 3D Secure")).toBe("плаћање уз 3D Secure");
    expect(lat2cyr("skladište je Cloudflare R2")).toBe("складиште је Cloudflare R2");
    // IPS, UO i „model" su domaći i ISPRAVNO idu u ćirilicu — ne dodavati ih.
    expect(lat2cyr("IPS uplata, model 97, odluka UO")).toBe("ИПС уплата, модел 97, одлука УО");
  });
  it("duži token iz bele liste pobeđuje kraći koji mu je početak", () => {
    // Bez sortiranja po dužini „AGPL-3.0“ pojede početak i ostavi „онлy“,
    // a „Google“ ostavi „Аналyтицс“.
    expect(lat2cyr("licenca AGPL-3.0-only")).toBe("лиценца AGPL-3.0-only");
    expect(lat2cyr("koristimo Google Analytics")).toBe("користимо Google Analytics");
  });
  it("ICU placeholderi {ime} ostaju netaknuti (inače next-intl FORMATTING_ERROR)", () => {
    expect(lat2cyr("Dobrodošli, {pseudonim}")).toBe("Добродошли, {pseudonim}");
    expect(lat2cyr("Imate {count} poruka")).toBe("Имате {count} порука");
    expect(lat2cyr("Bonus {iznos} POEN")).toBe("Бонус {iznos} ПОЕН");
  });
  it("rich-text tagovi (<strong>) ostaju, ali se sadržaj transliteriše", () => {
    expect(lat2cyr("<strong>Predstavljanje</strong> vide svi")).toBe(
      "<strong>Представљање</strong> виде сви",
    );
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
