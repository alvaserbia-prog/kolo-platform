import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ocistiAdresu, ocistiPutanju, ocistiUpit } from "@/lib/analitika-putanja";

/**
 * Google Analytics — šta sme da izađe i kada (26.09.2026).
 *
 * Svako od ovih pravila se gubi BEZ ijednog vidljivog kvara: GA i dalje radi,
 * izveštaji se pune, a Google-u tiho odlaze tokeni, pseudonimi ili podaci deteta.
 * Zato brana gleda i ponašanje i izvor.
 */

const KOREN = join(__dirname, "..");
const citaj = (p: string) => readFileSync(join(KOREN, p), "utf8");

describe("čišćenje adrese pre slanja u analitiku", () => {
  it("tajni tokeni iz putanje ne izlaze", () => {
    expect(ocistiPutanju("/reset-lozinka/abc123tajna")).toBe("/reset-lozinka/[token]");
    expect(ocistiPutanju("/potvrdi-email/xyz")).toBe("/potvrdi-email/[token]");
    expect(ocistiPutanju("/odjava-obavestenja/t0k3n")).toBe("/odjava-obavestenja/[token]");
    expect(ocistiPutanju("/m/9f8e7d")).toBe("/m/[hash]");
  });

  it("pseudonim u adresi profila se svodi na šablon, statička podruta ostaje", () => {
    expect(ocistiPutanju("/profil/dr.nikola.šarić")).toBe("/profil/[pseudonim]");
    expect(ocistiPutanju("/profil/oglasi")).toBe("/profil/oglasi");
    expect(ocistiPutanju("/profil")).toBe("/profil");
  });

  it("dečji prostor, admin, nadzor i potvrde programa se ne mere", () => {
    for (const p of ["/admin", "/nadzor", "/deca/abc", "/dete-poziv/tok", "/registracija/dete", "/prijatelji", "/programi/potvrde"]) {
      expect(ocistiPutanju(p), p).toBeNull();
    }
    // Sam spisak programa nije osetljiv — meri se.
    expect(ocistiPutanju("/programi")).toBe("/programi");
  });

  it("identifikator u nepoznatoj ruti se ipak svodi na [id]", () => {
    expect(ocistiPutanju("/nova-ruta/cm1abcdefghijklmnopqrstu")).toBe("/nova-ruta/[id]");
    expect(ocistiPutanju("/pijaca/cm1abcdefghijklmnopqrstu")).toBe("/pijaca/[id]");
    expect(ocistiPutanju("/pijaca/novi-oglas")).toBe("/pijaca/novi-oglas");
  });

  it("iz upita ostaju samo utm oznake — `?plati=<pseudonim>` ne izlazi", () => {
    expect(ocistiUpit("?plati=marko&description=x")).toBe("");
    expect(ocistiUpit("?utm_source=fb&plati=marko")).toBe("?utm_source=fb");
    expect(ocistiAdresu("https://ekolo.rs/novcanik?plati=marko", "https://ekolo.rs")).toBe("https://ekolo.rs/novcanik");
  });

  it("adresa sa drugog sajta ostaje samo izvor, bez putanje", () => {
    expect(ocistiAdresu("https://mail.example.com/inbox/123?x=1", "https://ekolo.rs")).toBe("https://mail.example.com");
  });
});

describe("IZVOR: GA se učitava samo kad sme", () => {
  const LAYOUT = citaj("src/app/layout.tsx");
  const KOMPONENTA = citaj("src/components/Analitika.tsx");

  it("samo produkcija i nikad maloletni nalog", () => {
    expect(LAYOUT).toContain("IS_PRODUCTION && (!session?.user || session.user.maloletan === false)");
    expect(LAYOUT).toContain("<Analitika gaId={gaId} />");
  });

  it("pregled šaljemo sami, sa očišćenom adresom", () => {
    expect(KOMPONENTA).toContain("send_page_view: false");
    expect(KOMPONENTA).toContain("ocistiAdresu(");
    // Zakucan inline `gtag('config', ...)` bez čišćenja ne sme da se vrati.
    expect(KOMPONENTA).not.toMatch(/id="google-analytics"/);
  });

  it("Google Signals i reklamni signali su isključeni", () => {
    expect(KOMPONENTA).toContain("allow_google_signals: false");
    expect(KOMPONENTA).toContain("allow_ad_personalization_signals: false");
    expect(KOMPONENTA).toContain('ad_user_data: "denied"');
  });

  it("povlačenje pristanka gasi GA i briše kolačiće", () => {
    expect(KOMPONENTA).toContain("ga-disable-");
    expect(KOMPONENTA).toContain("obrisiGaKolacice()");
  });

  it("nijedan identifikator naloga ne ide u GA", () => {
    const sve = [KOMPONENTA, citaj("src/lib/analitika.ts")].join("\n");
    expect(sve).not.toMatch(/user_id\s*:/);
    expect(sve).not.toMatch(/user_properties/);
    expect(sve).not.toMatch(/["']value["']\s*:|\bvalue\s*:/);
  });

  it("i Vercel Analytics prolazi kroz isto čišćenje", () => {
    expect(KOMPONENTA).toContain("beforeSend");
    expect(LAYOUT).toContain("<VercelAnalitika />");
    expect(LAYOUT).not.toContain("@vercel/analytics");
  });

  it("CSP dozvoljava regionalne krajnje tačke GA4", () => {
    const cfg = citaj("next.config.ts");
    expect(cfg).toContain("https://*.google-analytics.com");
    expect(cfg).toContain("https://*.analytics.google.com");
  });
});

describe("IZVOR: pristanak se može povući", () => {
  it("oba futera nose link koji vraća banner", () => {
    expect(citaj("src/components/PublicFooter.tsx")).toContain("<KolaciciPodesavanja");
    expect(citaj("src/components/AppFooter.tsx")).toContain("<KolaciciPodesavanja");
    expect(citaj("src/components/CookieConsent.tsx")).toContain("OTVORI_PODESAVANJA_EVENT");
  });
});

describe("IZVOR: događaji ne nose iznos ni primaoca", () => {
  it("prepis i donacija šalju samo činjenicu", () => {
    const prepis = citaj("src/app/(app)/novcanik/NovcanikKartice.tsx");
    expect(prepis).toContain('dogadjaj("prepis_poen");');
    const donacija = citaj("src/app/(app)/donacije/DonacijeKlijent.tsx");
    expect(donacija).toContain('dogadjaj("donacija_zapoceta", { kanal: "kartica" });');
  });
});
