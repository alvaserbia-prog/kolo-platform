import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Prisma se mock-uje pre uvoza modula — `email.ts` ga uvozi na vrhu.
// `vi.hoisted` je nužan: `vi.mock` se diže na vrh fajla, pre inicijalizacije.
const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  bazniUrl,
  emailLayout,
  esc,
  posaljiEmailKorisniku,
  posaljiEmailRaw,
} from "@/lib/email";

const OK = { ok: true, status: 200, text: async () => "" } as Response;

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("RESEND_FROM", "KOLO <noreply@ekolo.rs>");
  vi.stubEnv("NEXTAUTH_URL", "https://ekolo.rs");
  prismaMock.user.findUnique.mockReset();
  prismaMock.user.update.mockReset();
  prismaMock.user.update.mockResolvedValue({});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

/** Korisnik koji prima mejlove, sa već postojećim tokenom za odjavu. */
function korisnik(over: Record<string, unknown> = {}) {
  return {
    email: "korisnik@primer.rs",
    pseudonim: "Milica",
    emailObavestenja: true,
    deaktiviranAt: null,
    emailOdjavaToken: "tok123",
    ...over,
  };
}

/** Presretni Resend poziv i vrati telo koje bi bilo poslato. */
function uhvatiSlanje() {
  const fetchMock = vi.fn().mockResolvedValue(OK);
  vi.stubGlobal("fetch", fetchMock);
  return () => {
    if (fetchMock.mock.calls.length === 0) return null;
    return JSON.parse(fetchMock.mock.calls[0][1].body as string) as {
      from: string;
      to: string;
      subject: string;
      html: string;
    };
  };
}

describe("bazniUrl — allowlist host-ova", () => {
  it("koristi origin zahteva kad je host dozvoljen", () => {
    expect(bazniUrl("https://ekolo.rs")).toBe("https://ekolo.rs");
    expect(bazniUrl("https://kolo-peach.vercel.app")).toBe("https://kolo-peach.vercel.app");
    expect(bazniUrl("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("odbija tuđi domen i pada na env (host-header poisoning)", () => {
    expect(bazniUrl("https://napadac.rs")).toBe("https://ekolo.rs");
    expect(bazniUrl("https://ekolo.rs.napadac.rs")).toBe("https://ekolo.rs");
  });

  it("neispravan origin pada na env", () => {
    expect(bazniUrl("ovo-nije-url")).toBe("https://ekolo.rs");
    expect(bazniUrl(undefined)).toBe("https://ekolo.rs");
  });
});

describe("esc / emailLayout", () => {
  it("escapuje HTML u naslovu i pozdravu", () => {
    expect(esc('<b>"x"&y</b>')).toBe("&lt;b&gt;&quot;x&quot;&amp;y&lt;/b&gt;");

    const html = emailLayout({
      naslov: "<script>alert(1)</script>",
      pozdrav: "Pera<img>",
      telo: ["tekst"],
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Pera&lt;img&gt;");
  });

  it("dugme se prikazuje samo kad je zadato, sa linkom kao rezervom", () => {
    const bez = emailLayout({ naslov: "N", telo: ["t"] });
    expect(bez).not.toContain("<a href");

    const sa = emailLayout({
      naslov: "N",
      telo: ["t"],
      dugme: { tekst: "Otvori", link: "https://ekolo.rs/verifikacija" },
    });
    expect(sa).toContain('href="https://ekolo.rs/verifikacija"');
    expect(sa).toContain("Otvori");
    // Rezervni tekstualni link za klijente koji ne prikazuju dugme
    expect(sa.match(/https:\/\/ekolo\.rs\/verifikacija/g)?.length).toBeGreaterThan(1);
  });

  it("podnožje se ubacuje kad je zadato", () => {
    const html = emailLayout({
      naslov: "N",
      telo: ["t"],
      podnozje: '<a href="https://ekolo.rs/odjava-obavestenja/t">Isključi</a>',
    });
    expect(html).toContain("odjava-obavestenja/t");
  });
});

describe("posaljiEmailRaw", () => {
  it("bez RESEND_API_KEY ne šalje i vraća false", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(await posaljiEmailRaw("a@b.rs", "S", "<p>x</p>")).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("HTTP greška vraća false umesto da baci", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 422, text: async () => "loš from" }),
    );
    expect(await posaljiEmailRaw("a@b.rs", "S", "<p>x</p>")).toBe(false);
  });

  it("mrežni pad vraća false umesto da baci", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
    expect(await posaljiEmailRaw("a@b.rs", "S", "<p>x</p>")).toBe(false);
  });
});

describe("posaljiEmailKorisniku — opt-out i preskakanja", () => {
  it("šalje mejl sa naslovom, dugmetom i linkom za odjavu", async () => {
    const telo = uhvatiSlanje();
    prismaMock.user.findUnique.mockResolvedValue(korisnik());

    await posaljiEmailKorisniku("u1", {
      naslov: "Verifikovan/a si",
      tekst: "„Pera“ te je verifikovao/la.",
      link: "/verifikacija",
    });

    const poslato = telo();
    expect(poslato).not.toBeNull();
    expect(poslato!.to).toBe("korisnik@primer.rs");
    expect(poslato!.subject).toBe("Verifikovan/a si — KOLO");
    expect(poslato!.html).toContain("Milica");
    expect(poslato!.html).toContain("https://ekolo.rs/verifikacija");
    expect(poslato!.html).toContain("https://ekolo.rs/odjava-obavestenja/tok123");
  });

  it("ne šalje kad je korisnik isključio obaveštenja", async () => {
    const telo = uhvatiSlanje();
    prismaMock.user.findUnique.mockResolvedValue(korisnik({ emailObavestenja: false }));

    await posaljiEmailKorisniku("u1", { naslov: "N", tekst: "t" });
    expect(telo()).toBeNull();
  });

  it("ne šalje kad nalog nema email adresu", async () => {
    const telo = uhvatiSlanje();
    prismaMock.user.findUnique.mockResolvedValue(korisnik({ email: null }));

    await posaljiEmailKorisniku("u1", { naslov: "N", tekst: "t" });
    expect(telo()).toBeNull();
  });

  it("ne šalje na ugašen nalog", async () => {
    const telo = uhvatiSlanje();
    prismaMock.user.findUnique.mockResolvedValue(korisnik({ deaktiviranAt: new Date() }));

    await posaljiEmailKorisniku("u1", { naslov: "N", tekst: "t" });
    expect(telo()).toBeNull();
  });

  it("token za odjavu se pravi lenjo ako ga nalog nema", async () => {
    const telo = uhvatiSlanje();
    prismaMock.user.findUnique
      .mockResolvedValueOnce(korisnik())
      .mockResolvedValueOnce({ emailOdjavaToken: null });

    await posaljiEmailKorisniku("u1", { naslov: "N", tekst: "t" });

    expect(prismaMock.user.update).toHaveBeenCalledOnce();
    const noviToken = prismaMock.user.update.mock.calls[0][0].data.emailOdjavaToken as string;
    expect(noviToken).toMatch(/^[0-9a-f]{48}$/);
    expect(telo()!.html).toContain(`odjava-obavestenja/${noviToken}`);
  });

  it("greška u bazi ne baca — mejl je propratni kanal", async () => {
    uhvatiSlanje();
    prismaMock.user.findUnique.mockRejectedValue(new Error("DB pao"));

    await expect(
      posaljiEmailKorisniku("u1", { naslov: "N", tekst: "t" }),
    ).resolves.toBeUndefined();
  });

  it("escapuje korisnički tekst u telu mejla", async () => {
    const telo = uhvatiSlanje();
    prismaMock.user.findUnique.mockResolvedValue(korisnik());

    await posaljiEmailKorisniku("u1", {
      naslov: "Nova poruka",
      tekst: "<img src=x onerror=alert(1)>",
    });

    expect(telo()!.html).not.toContain("<img src=x");
    expect(telo()!.html).toContain("&lt;img src=x");
  });
});
