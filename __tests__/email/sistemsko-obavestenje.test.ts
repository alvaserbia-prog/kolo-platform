import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: { findMany: vi.fn(), count: vi.fn() },
  sistemskoObavestenje: { findUnique: vi.fn(), update: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { posaljiEmailBatch, BATCH_MAX } from "@/lib/email";
import { posaljiSledecuPorciju, teloObavestenja } from "@/lib/sistemsko-obavestenje";

const OK = { ok: true, status: 200, text: async () => "" } as Response;

const NACRT = {
  id: "o1",
  naslov: "Izmena Uslova korišćenja",
  tekst: "Uslovi se menjaju od 1. septembra.",
  link: "/uslovi",
  pravniOsnov: "Uslovi čl. 40",
  status: "NACRT" as const,
  ukupno: 0,
  poslato: 0,
  neuspesno: 0,
  kursorId: null as string | null,
};

/** Lista lažnih primalaca sa rastućim id-evima (kursor se oslanja na redosled). */
function primaoci(od: number, koliko: number) {
  return Array.from({ length: koliko }, (_, i) => ({
    id: `u${String(od + i).padStart(4, "0")}`,
    email: `k${od + i}@primer.rs`,
    pseudonim: `Korisnik${od + i}`,
  }));
}

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("NEXTAUTH_URL", "https://ekolo.rs");
  for (const grupa of Object.values(prismaMock)) {
    for (const fn of Object.values(grupa)) (fn as ReturnType<typeof vi.fn>).mockReset();
  }
  prismaMock.sistemskoObavestenje.update.mockResolvedValue({});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("teloObavestenja", () => {
  it("nema link za odjavu — obaveštenje se ne može isključiti", () => {
    const html = teloObavestenja(NACRT, "Milica");
    expect(html).not.toContain("odjava-obavestenja");
    expect(html).toContain("Ne može se isključiti");
  });

  it("navodi pravni osnov u podnožju", () => {
    expect(teloObavestenja(NACRT, "Milica")).toContain("Uslovi čl. 40");
  });

  it("dugme vodi na internu putanju, i to samo kad je link zadat", () => {
    expect(teloObavestenja(NACRT, "Milica")).toContain("https://ekolo.rs/uslovi");
    expect(teloObavestenja({ ...NACRT, link: null }, "Milica")).not.toContain("<a href");
  });

  it("escapuje tekst i pravni osnov", () => {
    const html = teloObavestenja(
      { ...NACRT, tekst: "<script>x</script>", pravniOsnov: "<b>osnov</b>" },
      "Pera",
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;b&gt;osnov&lt;/b&gt;");
  });
});

describe("posaljiEmailBatch", () => {
  it("odbija porciju veću od dozvoljene", async () => {
    const fetchMock = vi.fn().mockResolvedValue(OK);
    vi.stubGlobal("fetch", fetchMock);

    const prevelika = Array.from({ length: BATCH_MAX + 1 }, () => ({
      to: "a@b.rs",
      subject: "s",
      html: "<p>x</p>",
    }));
    expect(await posaljiEmailBatch(prevelika)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("prazna porcija je uspeh bez poziva", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await posaljiEmailBatch([])).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("gađa batch endpoint i dodaje pošiljaoca svakoj stavci", async () => {
    const fetchMock = vi.fn().mockResolvedValue(OK);
    vi.stubGlobal("fetch", fetchMock);

    await posaljiEmailBatch([{ to: "a@b.rs", subject: "s", html: "<p>x</p>" }]);

    expect(fetchMock.mock.calls[0][0]).toBe("https://api.resend.com/emails/batch");
    const telo = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(telo).toHaveLength(1);
    expect(telo[0].from).toContain("@");
    expect(telo[0].to).toBe("a@b.rs");
  });
});

describe("posaljiSledecuPorciju", () => {
  it("prvo pokretanje prebroji primaoce i pređe u U_SLANJU", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(OK));
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({ ...NACRT });
    prismaMock.user.count.mockResolvedValue(150);
    prismaMock.user.findMany.mockResolvedValueOnce(primaoci(1, 100)).mockResolvedValue([]);

    const n = await posaljiSledecuPorciju("o1");

    const prviUpis = prismaMock.sistemskoObavestenje.update.mock.calls[0][0].data;
    expect(prviUpis.status).toBe("U_SLANJU");
    expect(prviUpis.ukupno).toBe(150);
    expect(n.ukupno).toBe(150);
  });

  it("prolazi celu listu, pomera kursor i završava kao POSLATO", async () => {
    const fetchMock = vi.fn().mockResolvedValue(OK);
    vi.stubGlobal("fetch", fetchMock);
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({ ...NACRT });
    prismaMock.user.count.mockResolvedValue(150);
    prismaMock.user.findMany
      .mockResolvedValueOnce(primaoci(1, 100))
      .mockResolvedValueOnce(primaoci(101, 50))
      .mockResolvedValue([]);

    const n = await posaljiSledecuPorciju("o1");

    expect(n).toEqual({ status: "POSLATO", ukupno: 150, poslato: 150, neuspesno: 0, zavrseno: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Druga porcija traži samo id-eve VEĆE od poslednjeg iz prve — bez duplikata.
    const drugiUpit = prismaMock.user.findMany.mock.calls[1][0].where;
    expect(drugiUpit.id).toEqual({ gt: "u0100" });

    const zavrsni = prismaMock.sistemskoObavestenje.update.mock.calls.at(-1)![0].data;
    expect(zavrsni.status).toBe("POSLATO");
    expect(zavrsni.zavrsenoAt).toBeInstanceOf(Date);
  });

  it("nastavak kreće od zapamćenog kursora", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(OK));
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({
      ...NACRT,
      status: "U_SLANJU",
      ukupno: 150,
      poslato: 100,
      kursorId: "u0100",
    });
    prismaMock.user.findMany.mockResolvedValueOnce(primaoci(101, 50)).mockResolvedValue([]);

    const n = await posaljiSledecuPorciju("o1");

    expect(prismaMock.user.count).not.toHaveBeenCalled();
    expect(prismaMock.user.findMany.mock.calls[0][0].where.id).toEqual({ gt: "u0100" });
    expect(n.poslato).toBe(150);
    expect(n.zavrseno).toBe(true);
  });

  it("neuspela porcija se odbroji, a slanje ide dalje", async () => {
    // Prva porcija pada u oba pokušaja, druga prolazi.
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "pad" })
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "pad" })
      .mockResolvedValue(OK);
    vi.stubGlobal("fetch", fetchMock);
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({ ...NACRT });
    prismaMock.user.count.mockResolvedValue(150);
    prismaMock.user.findMany
      .mockResolvedValueOnce(primaoci(1, 100))
      .mockResolvedValueOnce(primaoci(101, 50))
      .mockResolvedValue([]);

    const n = await posaljiSledecuPorciju("o1");

    expect(n.neuspesno).toBe(100);
    expect(n.poslato).toBe(50);
    expect(n.zavrseno).toBe(true);
  });

  it("budžet vremena prekida krug i vraća nezavršen napredak", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(OK));
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({ ...NACRT });
    prismaMock.user.count.mockResolvedValue(1000);
    prismaMock.user.findMany.mockResolvedValue(primaoci(1, 100));

    // Budžet 0 → prvi uslov petlje ne prolazi, ništa se ne šalje.
    const n = await posaljiSledecuPorciju("o1", 0);

    expect(n.zavrseno).toBe(false);
    expect(n.status).toBe("U_SLANJU");
    expect(n.poslato).toBe(0);
  });

  it("već poslato obaveštenje se ne šalje ponovo", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({
      ...NACRT,
      status: "POSLATO",
      ukupno: 150,
      poslato: 150,
    });

    const n = await posaljiSledecuPorciju("o1");

    expect(n.zavrseno).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it("prekinuto obaveštenje se ne nastavlja", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({
      ...NACRT,
      status: "PREKINUTO",
      ukupno: 150,
      poslato: 40,
    });

    const n = await posaljiSledecuPorciju("o1");

    expect(n).toMatchObject({ status: "PREKINUTO", zavrseno: true, poslato: 40 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("primaoci su svi nalozi sa email adresom koji nisu ugašeni (i suspendovani)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(OK));
    prismaMock.sistemskoObavestenje.findUnique.mockResolvedValue({ ...NACRT });
    prismaMock.user.count.mockResolvedValue(1);
    prismaMock.user.findMany.mockResolvedValueOnce(primaoci(1, 1)).mockResolvedValue([]);

    await posaljiSledecuPorciju("o1");

    const uslov = prismaMock.user.findMany.mock.calls[0][0].where;
    expect(uslov.deaktiviranAt).toBeNull();
    expect(uslov.email).toEqual({ not: null });
    // Status naloga se NE filtrira — suspendovani takođe primaju.
    expect(uslov.status).toBeUndefined();
  });
});
