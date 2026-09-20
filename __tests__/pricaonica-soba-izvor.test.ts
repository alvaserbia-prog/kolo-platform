/**
 * Brana: svaki prikaz Pričaonice mora da sprovede razdvajanje soba (čl. 12, 18).
 *
 * Pravilo „soba se izvodi iz uzrasta, ne bira se parametrom" stajalo je ispravno u
 * `GET /api/chat` od uvođenja dečje sobe — a Početna je istu Pričaonicu čitala
 * SOPSTVENIM upitom, `where: { uklonjenoAt: null }`, bez ijedne reči o sobi.
 * Posledica: prvih sto poruka koje odrastao član vidi pri otvaranju ekrana bile su
 * mešane, sa dečjim među njima; tek osvežavanje (koje ide kroz rutu) prestajalo je
 * da ih donosi. Dete pritom nikad nije moglo da PIŠE među odraslima — kolona `soba`
 * se upisuje iz uzrasta autora — ali je kvar izgledao tačno tako.
 *
 * Isto što se već desilo oglasima deteta: pravilo tačno, a jedan prikaz za njega ne
 * zna. Zato test ne gleda pravilo nego IZVOR — da svaki fajl koji sam čita poruke
 * pominje ulaz u pravilo, i da nigde nema golog upita nad `chatMessage`.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const KOREN = process.cwd();

/** Fajlovi koji sami dižu poruke Pričaonice i moraju kroz pravilo. */
const PRIKAZI = [
  "src/app/api/chat/route.ts",
  "src/app/(app)/pocetna/page.tsx",
  "src/lib/chrome-podaci.ts",
];

const ULAZI = ["usloviSobe", "usloviSobeOdraslih"];

describe("razdvojene Pričaonice (Modul Deca, čl. 12)", () => {
  it.each(PRIKAZI)("%s sprovodi pravilo sobe", (rel) => {
    const izvor = readFileSync(path.join(KOREN, rel), "utf8");
    const nasao = ULAZI.some((u) => izvor.includes(u));
    expect(nasao, `${rel} čita Pričaonicu bez uslova sobe iz čl. 12`).toBe(true);
  });

  // Onaj konkretan upit koji je propustio decu među odrasle. `count` se ovde NE
  // izuzima kao kod oglasa: broj u badge-u vodi na ekran sa porukama, pa bi šire
  // brojanje dalo badge koji se ne može spustiti.
  it("nijedan upit nad `chatMessage` ne stoji bez sobe", () => {
    for (const rel of PRIKAZI) {
      const izvor = readFileSync(path.join(KOREN, rel), "utf8");
      const upiti = [...izvor.matchAll(/chatMessage\.(findMany|count)\(\{([\s\S]{0,600}?)\}\)/g)];
      expect(upiti.length, `${rel} nema nijedan prepoznat upit — provera je zastarela`).toBeGreaterThan(0);
      for (const u of upiti) {
        const where = u[2];
        // Prolazi upit koji sam navodi sobu (`soba:`) ili prosleđuje gotov uslov
        // iz pravila — po konvenciji promenljiva `uslovi…` (`usloviDecje`,
        // `usloviSobeOdraslih(...)`). Golo `where: { uklonjenoAt: null }` pada.
        const kroz = /uslovi/.test(where) || /soba:/.test(where);
        expect(kroz, `${rel}: upit nad chatMessage ne navodi sobu — \`${where.trim().slice(0, 80)}\``).toBe(true);
      }
    }
  });

  // Soba odraslih ima DVE brave: kolonu `soba` (upisuje se pri pisanju) i uzrast
  // autora DANAS. Druga pokriva zatečene poruke starije od kolone i nalog koji je
  // Fondacija naknadno prevela u maloletni (čl. 4d) — dete koje je promašilo dečji
  // ulaz, pa su mu reči ostale među odraslima. Bez nje bi obe grupe i dalje stajale
  // u sobi odraslih.
  it("soba odraslih traži i da autor danas nije maloletan", () => {
    const izvor = readFileSync(path.join(KOREN, "src/lib/protokol/pricaonica.ts"), "utf8");
    expect(izvor).toMatch(/soba:\s*ChatSoba\.ODRASLI/);
    expect(izvor).toMatch(/user:\s*\{\s*maloletan:\s*false\s*\}/);
  });

  // Dečja soba se ne sme otvoriti nalogu koji još čeka roditelja (čl. 4c) — to je
  // jedina provera koja stoji umesto potvrde stvarnosti, koju dete nikad ne stiče.
  it("dečja soba prolazi kroz proveru stanja naloga", () => {
    const izvor = readFileSync(path.join(KOREN, "src/lib/protokol/pricaonica.ts"), "utf8");
    expect(izvor).toContain("smeUSobu");
    expect(izvor).toContain("idPrijatelja");
  });
});
