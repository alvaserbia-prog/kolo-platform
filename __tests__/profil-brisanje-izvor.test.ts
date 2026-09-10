/**
 * Brana: prestanak statusa radi ono što Politika obećava.
 *
 * Politika čl. 11 od prve verzije kaže da se pri gašenju naloga brišu „podaci u
 * objavljenim oglasima, uključujući fotografije i broj telefona" — a `DELETE
 * /api/profil` oglase do seta 4.5.1 NIJE ni dodirivao. Ostajali su `ACTIVE` i
 * javni i gostu, sa opisom u kome ljudi po pravilu ostave telefon, i sa
 * fotografijama na R2; pseudonim `obrisani-korisnik-…` tu ne pomaže jer takav
 * sadržaj identifikuje sam.
 *
 * Uz to: čl. 11 je zadržane zapise nazivao anonimizovanima i iz toga izvodio da
 * „prestaju da budu podaci o ličnosti". Nalog se ne briše, a nov pseudonim je
 * izveden iz internog `id`-a — Fondacija može da ga ponovo poveže, pa je to
 * pseudonimizacija. Ograničenje brisanja stoji na čl. 30 st. 3 ZZPL-a.
 *
 * Test gleda IZVOR, kao `oglasi-vidljivost-izvor` i `programi-kanal-izvor`:
 * mehanizam bi se ovde izgubio bez ijednog vidljivog kvara.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const KOREN = process.cwd();
const citaj = (p: string) => readFileSync(path.join(KOREN, p), "utf8");

const BRISANJE = citaj("src/app/api/profil/route.ts");
const GDPR = citaj("src/app/api/cron/gdpr-cistenje/route.ts");
const PRIGOVOR = citaj("src/app/api/prigovor/route.ts");

describe("gašenje naloga briše ono što akt obećava", () => {
  it("oglasi se uklanjaju i prazne", () => {
    expect(BRISANJE).toContain("marketplaceListing");
    expect(BRISANJE).toMatch(/status:\s*"UKLONJEN"/);
    // Sadržaj, ne samo status: naslov, opis, mesto i slike.
    expect(BRISANJE).toMatch(/title:\s*""/);
    expect(BRISANJE).toMatch(/description:\s*""/);
    expect(BRISANJE).toMatch(/images:\s*\[\]/);
  });

  it("fotografije oglasa se brišu iz skladišta, ne samo iz baze", () => {
    // Do 4.5.1 se sa R2 brisao SAMO avatar. Slika oglasa se služi sa javnog
    // URL-a, pa red u bazi bez brisanja fajla ne sklanja ništa.
    const blok = BRISANJE.slice(BRISANJE.indexOf("marketplaceListing"));
    expect(blok).toContain("obrisiSaR2");
  });

  it("slobodan tekst uz prepis se briše, a opisi emisija ostaju", () => {
    expect(BRISANJE).toMatch(/data:\s*\{\s*description:\s*null\s*\}/);
    // 🔴 Bez ovog uslova Prisma bi u `not` filter uključila i NULL, pa bi se
    // obrisali i opisi emisija Protokola — osnov po kome je POEN upisan.
    expect(BRISANJE).toContain("NOT: { fromWalletId: null }");
  });
});

describe("poruke se brišu kada JEDNA strana ode", () => {
  it("uslov je OR, ne AND nad obema stranama", () => {
    const blok = GDPR.slice(GDPR.indexOf("konverzacija.findMany"));
    const kraj = blok.indexOf("select:");
    const uslov = blok.slice(0, kraj);
    expect(uslov).toContain("OR:");
    expect(uslov).toContain("user1: { deaktiviranAt: { not: null } }");
    expect(uslov).toContain("user2: { deaktiviranAt: { not: null } }");
    expect(uslov).toContain("lastMessageAt");
  });
});

describe("pravo na ispravku ima put", () => {
  it("prigovor prima vrstu PODACI", () => {
    expect(PRIGOVOR).toContain('"PODACI"');
  });
});

describe("akt ne tvrdi anonimizaciju", () => {
  const AKTI = ["dokumentacija 4.1/politika_4_5_1.md", "dokumentacija 4.1/en/politika_4_5_1.md"];
  for (const p of AKTI) {
    it(`${p}: čl. 11 imenuje pseudonimizaciju`, () => {
      const t = citaj(p);
      const jeSr = !p.includes("/en/");
      expect(t).toContain(jeSr ? "pseudonimizacija, a ne anonimizacija" : "pseudonymization, not anonymization");
      // Tvrdnja koja je oborena — ne sme nazad.
      expect(t).not.toContain("prestaju da budu podaci o ličnosti u smislu ZZPL-a");
      expect(t).not.toContain("cease to be personal data within the meaning of the LPDP");
    });
  }
});
