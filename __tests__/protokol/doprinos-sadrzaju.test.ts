import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const prismaMock = vi.hoisted(() => ({
  doprinosSadrzaju: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  wallet: { findUnique: vi.fn() },
  user: { findUnique: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const emitujPoenMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/protokol/emisija", () => ({ emitujPoen: emitujPoenMock }));

const auditMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/audit", () => ({ logAdminAkcija: auditMock }));

const obavestiMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/notifikacije", () => ({ obavesti: obavestiMock }));


import {
  IZNOS,
  MIN_OPIS,
  MAX_AKTIVNIH_OGLASA,
  oglasIspunjavaMinimum,
  smeDaPostaviOglas,
  smeDaSalje,
  zabeleziDoprinos,
  evidentirajZatecene,
  ponistiZabelezen,
  probajEvidentirati,
} from "@/lib/protokol/doprinos-sadrzaju";

const OPIS = "x".repeat(MIN_OPIS);

/** Oglas koji ispunjava sadržinski minimum — pojedina polja se gase u testu. */
function oglas(izmene: Partial<Parameters<typeof oglasIspunjavaMinimum>[0]> = {}) {
  return {
    tip: "PONUDA",
    description: OPIS,
    category: "hrana",
    location: "Sombor",
    images: ["https://r2/slika.jpg"],
    ...izmene,
  };
}

function greskaPrisma(code: string) {
  return Object.assign(new Error(code), { code });
}

beforeEach(() => {
  for (const grupa of Object.values(prismaMock)) {
    for (const fn of Object.values(grupa)) (fn as ReturnType<typeof vi.fn>).mockReset();
  }
  emitujPoenMock.mockReset();
  auditMock.mockReset();
  obavestiMock.mockReset();
  emitujPoenMock.mockResolvedValue({ transaction: { id: "tx1" } });
  auditMock.mockResolvedValue(undefined);
  obavestiMock.mockResolvedValue(undefined);
  // Podrazumevano NEVERIFIKOVAN — verifikovanom se doprinos evidentira odmah,
  // pa bi tihi default menjao ishod pola testova ispod.
  prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "NEVERIFIKOVAN" });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Sadržinski minimum ──────────────────────────────────────────────────────

describe("oglasIspunjavaMinimum", () => {
  it("pun oglas prolazi", () => {
    expect(oglasIspunjavaMinimum(oglas()).ok).toBe(true);
  });

  it("bez fotografije ne prolazi", () => {
    expect(oglasIspunjavaMinimum(oglas({ images: [] })).ok).toBe(false);
  });

  it(`opis kraći od ${MIN_OPIS} znakova ne prolazi`, () => {
    expect(oglasIspunjavaMinimum(oglas({ description: "x".repeat(MIN_OPIS - 1) })).ok).toBe(false);
  });

  it("opis od tačno minimuma prolazi", () => {
    expect(oglasIspunjavaMinimum(oglas({ description: "x".repeat(MIN_OPIS) })).ok).toBe(true);
  });

  it("razmaci se ne broje kao opis", () => {
    expect(oglasIspunjavaMinimum(oglas({ description: `  ${"x".repeat(MIN_OPIS - 2)}  ` })).ok).toBe(false);
  });

  it("bez mesta ne prolazi — bez mesta se razmena ne može obaviti", () => {
    expect(oglasIspunjavaMinimum(oglas({ location: null })).ok).toBe(false);
  });

  it("bez kategorije ne prolazi", () => {
    expect(oglasIspunjavaMinimum(oglas({ category: "" })).ok).toBe(false);
  });
});

// ─── Ko sme da objavi ────────────────────────────────────────────────────────

describe("smeDaPostaviOglas", () => {
  it("verifikovanom ništa ne smeta — ni potražnja, ni prazan oglas, ni broj", () => {
    const rez = smeDaPostaviOglas({
      verifikovan: true,
      brojAktivnihOglasa: 99,
      oglas: oglas({ tip: "POTRAZNJA", images: [], description: "", location: null }),
    });
    expect(rez.ok).toBe(true);
  });

  it("neverifikovan sme ponudu koja ispunjava minimum", () => {
    expect(smeDaPostaviOglas({ verifikovan: false, brojAktivnihOglasa: 0, oglas: oglas() }).ok).toBe(true);
  });

  it("neverifikovan ne sme potražnju", () => {
    const rez = smeDaPostaviOglas({
      verifikovan: false,
      brojAktivnihOglasa: 0,
      oglas: oglas({ tip: "POTRAZNJA" }),
    });
    expect(rez.ok).toBe(false);
  });

  it(`neverifikovan ne sme preko ${MAX_AKTIVNIH_OGLASA} aktivna oglasa`, () => {
    expect(
      smeDaPostaviOglas({ verifikovan: false, brojAktivnihOglasa: MAX_AKTIVNIH_OGLASA, oglas: oglas() }).ok,
    ).toBe(false);
    expect(
      smeDaPostaviOglas({ verifikovan: false, brojAktivnihOglasa: MAX_AKTIVNIH_OGLASA - 1, oglas: oglas() }).ok,
    ).toBe(true);
  });

  it("neverifikovanom minimum jeste uslov za objavu", () => {
    expect(smeDaPostaviOglas({ verifikovan: false, brojAktivnihOglasa: 0, oglas: oglas({ images: [] }) }).ok)
      .toBe(false);
  });
});

// ─── Ko sme da upiše POEN drugom ─────────────────────────────────────────────

describe("smeDaSalje", () => {
  it("neverifikovan ne sme", () => {
    expect(smeDaSalje("NEVERIFIKOVAN")).toBe(false);
  });

  it("verifikovan i nosilac ZRNA smeju", () => {
    expect(smeDaSalje("REGULARNI")).toBe(true);
    expect(smeDaSalje("NOSILAC_ZRNA")).toBe(true);
  });
});

// ─── Beleženje ───────────────────────────────────────────────────────────────

describe("zabeleziDoprinos", () => {
  it("beleži za ponudu koja ispunjava minimum", async () => {
    prismaMock.doprinosSadrzaju.create.mockResolvedValue({ id: "d1" });
    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas() })).resolves.toBe(true);
    expect(prismaMock.doprinosSadrzaju.create).toHaveBeenCalledWith({
      data: { userId: "u1", oglasId: "o1", iznos: IZNOS },
    });
  });

  it("ne beleži za potražnju", async () => {
    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas({ tip: "POTRAZNJA" }) })).resolves.toBe(false);
    expect(prismaMock.doprinosSadrzaju.create).not.toHaveBeenCalled();
  });

  it("ne beleži za oglas ispod minimuma", async () => {
    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas({ images: [] }) })).resolves.toBe(false);
    expect(prismaMock.doprinosSadrzaju.create).not.toHaveBeenCalled();
  });

  it("jednokratnost po čoveku: drugi oglas ne beleži ništa (P2002 iz baze)", async () => {
    prismaMock.doprinosSadrzaju.create
      .mockResolvedValueOnce({ id: "d1" })
      .mockRejectedValueOnce(greskaPrisma("P2002"));
    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas() })).resolves.toBe(true);
    await expect(zabeleziDoprinos("u1", { id: "o2", ...oglas() })).resolves.toBe(false);
  });

  it("neuspeh beleženja ne obara objavu oglasa — ne baca", async () => {
    prismaMock.doprinosSadrzaju.create.mockRejectedValue(new Error("baza pukla"));
    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas() })).resolves.toBe(false);
  });

  /** Podesi mock-ove tako da evidentiranje odmah po objavi prođe do emisije. */
  function evidentiranjeProlaziOdmah() {
    prismaMock.doprinosSadrzaju.create.mockResolvedValue({ id: "d1" });
    prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue({ id: "d1", iznos: IZNOS });
    prismaMock.wallet.findUnique.mockResolvedValue({ id: "w1" });
    prismaMock.doprinosSadrzaju.updateMany.mockResolvedValue({ count: 1 });
  }

  // 🔴 Jezgro izmene od 2026-08-11: doprinos se evidentira u trenutku objave svakome,
  // pa i nalogu čija stvarnost nije potvrđena. Ranije je njemu samo beležen.
  it("NEVERIFIKOVANOM se evidentira odmah po objavi (čl. 40a st. 3)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "NEVERIFIKOVAN" });
    evidentiranjeProlaziOdmah();

    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas() })).resolves.toBe(true);

    expect(emitujPoenMock).toHaveBeenCalledTimes(1);
    expect(emitujPoenMock.mock.calls[0][1]).toBe(IZNOS);
    expect(prismaMock.doprinosSadrzaju.updateMany.mock.calls[0][0].data.okidac).toBe("OBJAVA");
  });

  it("tip naloga se uopšte ne čita — evidentira se svakome", async () => {
    evidentiranjeProlaziOdmah();
    await zabeleziDoprinos("u1", { id: "o1", ...oglas() });
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(emitujPoenMock).toHaveBeenCalledTimes(1);
  });

  it("VERIFIKOVANOM se evidentira odmah po objavi (čl. 40a st. 3)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "REGULARNI" });
    evidentiranjeProlaziOdmah();

    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas() })).resolves.toBe(true);

    expect(emitujPoenMock).toHaveBeenCalledTimes(1);
    expect(prismaMock.doprinosSadrzaju.updateMany.mock.calls[0][0].data.okidac).toBe("OBJAVA");
  });

  it("neuspeh evidentiranja ne obara objavu — beleženje ostaje uspešno", async () => {
    prismaMock.doprinosSadrzaju.create.mockResolvedValue({ id: "d1" });
    prismaMock.doprinosSadrzaju.findFirst.mockRejectedValue(new Error("baza pukla"));

    await expect(zabeleziDoprinos("u1", { id: "o1", ...oglas() })).resolves.toBe(true);
  });
});

// ─── Evidentiranje ───────────────────────────────────────────────────────────

/** Podesi mock-ove tako da postoji jedan zabeležen doprinos spreman za emisiju. */
function zabelezenSpreman() {
  prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue({ id: "d1", iznos: IZNOS });
  prismaMock.wallet.findUnique.mockResolvedValue({ id: "w1" });
  prismaMock.doprinosSadrzaju.updateMany.mockResolvedValue({ count: 1 });
  prismaMock.doprinosSadrzaju.update.mockResolvedValue({});
  prismaMock.doprinosSadrzaju.findMany.mockResolvedValue([]);
}

describe("probajEvidentirati", () => {
  it("okidač VERIFIKACIJA emituje iznos doprinosa", async () => {
    zabelezenSpreman();
    await expect(probajEvidentirati("u1", "VERIFIKACIJA", "v1")).resolves.toBe(true);
    expect(emitujPoenMock).toHaveBeenCalledOnce();
    expect(emitujPoenMock.mock.calls[0][0]).toBe("w1");
    expect(emitujPoenMock.mock.calls[0][1]).toBe(IZNOS);
    expect(emitujPoenMock.mock.calls[0][2]).toBe("EMISIJA_SADRZAJ");
  });

  it("okidač PRIMLJEN_POEN emituje isto", async () => {
    zabelezenSpreman();
    await expect(probajEvidentirati("u1", "PRIMLJEN_POEN", "v1")).resolves.toBe(true);
    expect(emitujPoenMock).toHaveBeenCalledOnce();
  });

  it("bez zabeleženog doprinosa ne emituje ništa", async () => {
    prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue(null);
    await expect(probajEvidentirati("u1", "VERIFIKACIJA", "v1")).resolves.toBe(false);
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });

  it("drugi okidač ne emituje po drugi put (rezervacija ne prolazi)", async () => {
    zabelezenSpreman();
    prismaMock.doprinosSadrzaju.updateMany.mockResolvedValue({ count: 0 });
    await expect(probajEvidentirati("u1", "PRIMLJEN_POEN", "v1")).resolves.toBe(false);
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });

  it("pukla emisija vraća doprinos u ZABELEZEN da ga sledeći okidač pokupi", async () => {
    zabelezenSpreman();
    emitujPoenMock.mockRejectedValue(new Error("zero-sum"));
    await expect(probajEvidentirati("u1", "VERIFIKACIJA", "v1")).resolves.toBe(false);
    const povratak = prismaMock.doprinosSadrzaju.updateMany.mock.calls.at(-1)?.[0];
    expect(povratak.data.status).toBe("ZABELEZEN");
    expect(povratak.data.okidac).toBeNull();
  });

  it("bez novčanika ne emituje i ne rezerviše", async () => {
    prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue({ id: "d1", iznos: IZNOS });
    prismaMock.wallet.findUnique.mockResolvedValue(null);
    await expect(probajEvidentirati("u1", "VERIFIKACIJA", "v1")).resolves.toBe(false);
    expect(prismaMock.doprinosSadrzaju.updateMany).not.toHaveBeenCalled();
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });

  it("ne baca kad baza pukne — verifikacija i prenos POEN-a moraju da prežive", async () => {
    prismaMock.doprinosSadrzaju.findFirst.mockRejectedValue(new Error("baza pukla"));
    await expect(probajEvidentirati("u1", "VERIFIKACIJA", "v1")).resolves.toBe(false);
  });

  it("javlja korisniku i pamti da je javljeno", async () => {
    zabelezenSpreman();
    await probajEvidentirati("u1", "VERIFIKACIJA", "v1");

    expect(obavestiMock).toHaveBeenCalledOnce();
    const [komeId, o] = obavestiMock.mock.calls[0];
    expect(komeId).toBe("u1");
    expect(o.kljuc).toBe("notifikacije.doprinos_sadrzaju");
    expect(o.link).toBe("/novcanik");

    const upisi = prismaMock.doprinosSadrzaju.update.mock.calls.map((c) => c[0].data);
    expect(upisi.some((d) => d.obavestenAt instanceof Date)).toBe(true);
  });

  it("pukla emisija ne šalje obaveštenje — nema o čemu da javi", async () => {
    zabelezenSpreman();
    emitujPoenMock.mockRejectedValue(new Error("zero-sum"));
    await probajEvidentirati("u1", "VERIFIKACIJA", "v1");
    expect(obavestiMock).not.toHaveBeenCalled();
  });

  it("neuspelo obaveštenje ne obara evidentiranje — POEN je već emitovan", async () => {
    zabelezenSpreman();
    obavestiMock.mockRejectedValue(new Error("Resend pukao"));
    await expect(probajEvidentirati("u1", "VERIFIKACIJA", "v1")).resolves.toBe(true);
  });
});

// ─── Poništenje ──────────────────────────────────────────────────────────────

describe("ponistiZabelezen", () => {
  it("poništava zabeležen doprinos uklonjenog oglasa", async () => {
    prismaMock.doprinosSadrzaju.updateMany.mockResolvedValue({ count: 1 });
    await expect(ponistiZabelezen("o1", "admin1")).resolves.toBe(true);
    const poziv = prismaMock.doprinosSadrzaju.updateMany.mock.calls[0][0];
    expect(poziv.where).toMatchObject({ oglasId: "o1", status: "ZABELEZEN" });
    expect(poziv.data.status).toBe("PONISTEN");
  });

  it("već evidentiran doprinos se ne dira — uslov nad statusom ga ne hvata", async () => {
    prismaMock.doprinosSadrzaju.updateMany.mockResolvedValue({ count: 0 });
    await expect(ponistiZabelezen("o1", "admin1")).resolves.toBe(false);
    expect(auditMock).not.toHaveBeenCalled();
  });
});

// ─── Brana iz odeljka 05 ─────────────────────────────────────────────────────

// ─── Prelazna radnja: zatečeni doprinosi ─────────────────────────────────────

describe("evidentirajZatecene", () => {
  /** Pomoćnik: red iz spiska zabeleženih. Tip naloga se više ne čita. */
  const red = (userId: string) => ({ userId, iznos: IZNOS });

  /**
   * Funkcija čita dva spiska: zabeležene (za evidentiranje) i evidentirane bez
   * obaveštenja (za naknadno javljanje). Mock ih razlikuje po `where.status`.
   */
  function spiskovi(
    zabelezeni: ReturnType<typeof red>[],
    neobavesteni: { id: string; userId: string; iznos: number }[] = [],
  ) {
    prismaMock.doprinosSadrzaju.findMany.mockImplementation(
      async (arg: { where: { status: string } }) =>
        arg.where.status === "ZABELEZEN" ? zabelezeni : neobavesteni,
    );
  }

  /** Svaki `probajEvidentirati` prolazi do kraja. */
  function evidentiranjeProlazi() {
    prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue({ id: "d", iznos: IZNOS });
    prismaMock.wallet.findUnique.mockResolvedValue({ id: "w" });
    prismaMock.doprinosSadrzaju.updateMany.mockResolvedValue({ count: 1 });
  }

  it("razrešava sve zatečene, i one bez potvrde", async () => {
    spiskovi([red("u1"), red("u2"), red("u3")]);
    evidentiranjeProlazi();

    const r = await evidentirajZatecene();

    expect(r.ukupnoZabelezenih).toBe(3);
    expect(r.evidentirano).toBe(3);
    expect(r.poenUOpticaj).toBe(3 * IZNOS);
    expect(emitujPoenMock).toHaveBeenCalledTimes(3);
  });

  it("idempotentno: drugi prolaz ne evidentira dvaput (rezervacija ne prolazi)", async () => {
    spiskovi([red("u1")]);
    prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue({ id: "d", iznos: IZNOS });
    prismaMock.wallet.findUnique.mockResolvedValue({ id: "w" });
    prismaMock.doprinosSadrzaju.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });

    expect((await evidentirajZatecene()).evidentirano).toBe(1);
    expect((await evidentirajZatecene()).evidentirano).toBe(0);
    expect(emitujPoenMock).toHaveBeenCalledTimes(1);
  });

  it("prazan spisak ne radi ništa", async () => {
    spiskovi([]);
    const r = await evidentirajZatecene();
    expect(r).toEqual({
      ukupnoZabelezenih: 0,
      evidentirano: 0,
      poenUOpticaj: 0,
      naknadnoObavesteno: 0,
    });
  });

  it("naknadno javlja onima kojima je doprinos evidentiran bez obaveštenja", async () => {
    spiskovi([], [{ id: "d9", userId: "u9", iznos: IZNOS }]);

    const r = await evidentirajZatecene();

    expect(r.evidentirano).toBe(0);
    expect(emitujPoenMock).not.toHaveBeenCalled(); // POEN je već emitovan ranije
    expect(r.naknadnoObavesteno).toBe(1);
    expect(obavestiMock.mock.calls[0][0]).toBe("u9");
    expect(prismaMock.doprinosSadrzaju.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "d9" } }),
    );
  });

  it("kome je javljeno, tome se ne javlja opet — upit hvata samo obavestenAt: null", async () => {
    spiskovi([]);
    const r = await evidentirajZatecene();
    expect(r.naknadnoObavesteno).toBe(0);
    expect(obavestiMock).not.toHaveBeenCalled();
    const upit = prismaMock.doprinosSadrzaju.findMany.mock.calls.at(-1)?.[0];
    expect(upit.where).toMatchObject({ status: "EVIDENTIRAN", obavestenAt: null });
  });
});
