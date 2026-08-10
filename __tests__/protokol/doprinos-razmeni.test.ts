import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMock = vi.hoisted(() => ({
  wallet: { findUnique: vi.fn() },
  user: { findUnique: vi.fn(), findMany: vi.fn() },
  doprinosSadrzaju: { findFirst: vi.fn(), findUnique: vi.fn() },
  doprinosRazmeni: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  oglasUpit: { findMany: vi.fn(), create: vi.fn() },
  marketplaceListing: { count: vi.fn(), findUnique: vi.fn() },
  transaction: { findMany: vi.fn() },
  verifikacionaZona: { findMany: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const emitujPoenMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/protokol/emisija", () => ({ emitujPoen: emitujPoenMock }));

const auditMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/audit", () => ({ logAdminAkcija: auditMock }));

const obavestiMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/notifikacije", () => ({ obavesti: obavestiMock }));

import {
  IZNOS_KORAKA,
  KAPA,
  MIN_IZNOS_TRANSAKCIJE,
  POSLEDNJI_KORAK,
  PRAG_SAGOVORNIKA_KORAK_4,
  PRAG_SAGOVORNIKA_KORAK_5,
  brojOglasaSaRazlicitimUpitima,
  dostignutKorak,
  korakIspunjen,
  prazanUcinak,
  preracunajUcinak,
  probajEvidentiratiKorake,
  probajNapredovati,
  sagovorniciUBrojacu,
  upisaoSagovorniku,
  type PoenSagovornik,
} from "@/lib/protokol/doprinos-razmeni";

function sagovornik(izmene: Partial<PoenSagovornik> = {}): PoenSagovornik {
  return {
    drugiId: "b",
    pravaTransakcija: true,
    vanLanca: true,
    verifikovan: true,
    jaSamUpisao: true,
    ...izmene,
  };
}

beforeEach(() => {
  for (const grupa of Object.values(prismaMock)) {
    for (const fn of Object.values(grupa)) (fn as ReturnType<typeof vi.fn>).mockReset();
  }
  emitujPoenMock.mockReset();
  auditMock.mockReset();
  obavestiMock.mockReset();
});

// ─── Pragovi ─────────────────────────────────────────────────────────────────

describe("pragovi lestvice", () => {
  it("doživotna kapa je zbir svih pet koraka", () => {
    expect(IZNOS_KORAKA).toBe(1000);
    expect(POSLEDNJI_KORAK).toBe(5);
    expect(KAPA).toBe(5000);
  });

  it("koraci 4 i 5 traže 5, odnosno 10 sagovornika", () => {
    expect(PRAG_SAGOVORNIKA_KORAK_4).toBe(5);
    expect(PRAG_SAGOVORNIKA_KORAK_5).toBe(10);
  });

  it("prava transakcija je najmanje 1.000 POEN", () => {
    expect(MIN_IZNOS_TRANSAKCIJE).toBe(1000);
  });
});

// ─── Sita brojača ────────────────────────────────────────────────────────────

describe("sagovorniciUBrojacu", () => {
  it("uzima verifikovanog sagovornika van kruga poznanstava", () => {
    expect([...sagovorniciUBrojacu([sagovornik()])]).toEqual(["b"]);
  });

  it("izbacuje onoga ko je u tvom krugu poznanstava", () => {
    expect(sagovorniciUBrojacu([sagovornik({ vanLanca: false })]).size).toBe(0);
  });

  it("izbacuje neverifikovanog — upis se beleži, ali ne broji", () => {
    expect(sagovorniciUBrojacu([sagovornik({ verifikovan: false })]).size).toBe(0);
  });

  it("izbacuje sagovornika sa kojim je prošao samo sitan upis", () => {
    expect(sagovorniciUBrojacu([sagovornik({ pravaTransakcija: false })]).size).toBe(0);
  });

  it("isti sagovornik se broji jednom", () => {
    expect(sagovorniciUBrojacu([sagovornik(), sagovornik()]).size).toBe(1);
  });

  it("smer upisa nije bitan za brojač", () => {
    expect(sagovorniciUBrojacu([sagovornik({ jaSamUpisao: false })]).size).toBe(1);
  });
});

describe("upisaoSagovorniku (korak 2)", () => {
  it("traži upis U TOM SMERU — primljen POEN ne otvara korak 2", () => {
    expect(upisaoSagovorniku([sagovornik({ jaSamUpisao: false })])).toBe(false);
    expect(upisaoSagovorniku([sagovornik({ jaSamUpisao: true })])).toBe(true);
  });

  it("upis nekome iz tvog kruga poznanstava ne otvara korak 2", () => {
    expect(upisaoSagovorniku([sagovornik({ vanLanca: false })])).toBe(false);
  });
});

// ─── Korak 3: oglasi sa upitima različitih korisnika ─────────────────────────

describe("brojOglasaSaRazlicitimUpitima", () => {
  it("isti čovek na tri oglasa daje jedan, ne tri", () => {
    expect(
      brojOglasaSaRazlicitimUpitima([
        { oglasId: "o1", posiljacId: "p" },
        { oglasId: "o2", posiljacId: "p" },
        { oglasId: "o3", posiljacId: "p" },
      ]),
    ).toBe(1);
  });

  it("dva oglasa sa dva različita pitaoca daju dva", () => {
    expect(
      brojOglasaSaRazlicitimUpitima([
        { oglasId: "o1", posiljacId: "p1" },
        { oglasId: "o2", posiljacId: "p2" },
      ]),
    ).toBe(2);
  });

  it("preplitanje se razrešava uparivanjem, ne pohlepno", () => {
    // o1 ima samo p1; o2 ima p1 i p2 → tačno uparivanje je 2 (o1→p1, o2→p2).
    expect(
      brojOglasaSaRazlicitimUpitima([
        { oglasId: "o1", posiljacId: "p1" },
        { oglasId: "o2", posiljacId: "p1" },
        { oglasId: "o2", posiljacId: "p2" },
      ]),
    ).toBe(2);
  });

  it("ponovljeni upit istog čoveka na isti oglas ne umnožava brojač", () => {
    expect(
      brojOglasaSaRazlicitimUpitima([
        { oglasId: "o1", posiljacId: "p1" },
        { oglasId: "o1", posiljacId: "p1" },
      ]),
    ).toBe(1);
  });
});

// ─── Redosled otključavanja ──────────────────────────────────────────────────

describe("dostignutKorak", () => {
  it("prazan učinak ne otvara nijedan korak", () => {
    expect(dostignutKorak(prazanUcinak())).toBe(0);
  });

  it("koraci se otključavaju REDOM — deset sagovornika bez tri oglasa staje na 2", () => {
    const u = {
      ...prazanUcinak(),
      prviOglasZabelezen: true,
      upisaoSagovorniku: true,
      brojOglasa: 1,
      oglasaSaRazlicitimUpitima: 0,
      brojSagovornika: 12,
    };
    expect(korakIspunjen(5, u)).toBe(true); // uslov koraka 5 jeste ispunjen…
    expect(dostignutKorak(u)).toBe(2); // …ali korak 3 nije, pa lestvica stoji
  });

  it("puna lestvica staje na petom koraku", () => {
    expect(
      dostignutKorak({
        prviOglasZabelezen: true,
        upisaoSagovorniku: true,
        brojOglasa: 3,
        oglasaSaRazlicitimUpitima: 2,
        brojSagovornika: 10,
      }),
    ).toBe(5);
  });

  it("korak 3 traži i tri oglasa i dva upita različitih ljudi", () => {
    const osnov = { ...prazanUcinak(), prviOglasZabelezen: true, upisaoSagovorniku: true };
    expect(dostignutKorak({ ...osnov, brojOglasa: 3, oglasaSaRazlicitimUpitima: 1 })).toBe(2);
    expect(dostignutKorak({ ...osnov, brojOglasa: 2, oglasaSaRazlicitimUpitima: 2 })).toBe(2);
    expect(dostignutKorak({ ...osnov, brojOglasa: 3, oglasaSaRazlicitimUpitima: 2 })).toBe(3);
  });
});

// ─── Očitavanje iz baze ──────────────────────────────────────────────────────

type Upis = { drugiId: string; iznos: number; jaSaljem: boolean };

/** Podešava upite koje čita `preracunajUcinak`. */
function postaviUcinakUBazi(opcije: {
  prviOglas?: boolean;
  upisi?: Upis[];
  neverifikovani?: string[];
  uKrugu?: string[];
  brojOglasa?: number;
  upiti?: Array<{ oglasId: string; posiljacId: string }>;
}) {
  const upisi = opcije.upisi ?? [];
  const ids = [...new Set(upisi.map((u) => u.drugiId))];

  prismaMock.wallet.findUnique.mockResolvedValue({ id: "w-ja" });
  prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue(
    opcije.prviOglas === false ? null : { id: "d1" },
  );
  prismaMock.marketplaceListing.count.mockResolvedValue(opcije.brojOglasa ?? 0);
  prismaMock.oglasUpit.findMany.mockResolvedValue(opcije.upiti ?? []);
  prismaMock.transaction.findMany.mockResolvedValue(
    upisi.map((u) => ({
      fromWalletId: u.jaSaljem ? "w-ja" : `w-${u.drugiId}`,
      amount: u.iznos,
      fromWallet: { userId: u.jaSaljem ? "ja" : u.drugiId },
      toWallet: { userId: u.jaSaljem ? u.drugiId : "ja" },
    })),
  );
  prismaMock.user.findMany.mockResolvedValue(
    ids.map((id) => ({
      id,
      tipKorisnika: (opcije.neverifikovani ?? []).includes(id) ? "NEVERIFIKOVAN" : "REGULARNI",
    })),
  );
  prismaMock.verifikacionaZona.findMany.mockResolvedValue(
    (opcije.uKrugu ?? []).map((id) => ({ userId: "ja", forbiddenUserId: id })),
  );
}

describe("preracunajUcinak", () => {
  it("upis ispod praga ne pravi sagovornika", async () => {
    postaviUcinakUBazi({ upisi: [{ drugiId: "b", iznos: 999, jaSaljem: true }] });
    const u = await preracunajUcinak("ja");
    expect(u.brojSagovornika).toBe(0);
    expect(u.upisaoSagovorniku).toBe(false);
  });

  it("upis tačno na pragu se prihvata", async () => {
    postaviUcinakUBazi({ upisi: [{ drugiId: "b", iznos: 1000, jaSaljem: true }] });
    const u = await preracunajUcinak("ja");
    expect(u.brojSagovornika).toBe(1);
    expect(u.upisaoSagovorniku).toBe(true);
  });

  it("sitni upisi se NE sabiraju u jednu pravu razmenu", async () => {
    postaviUcinakUBazi({
      upisi: [
        { drugiId: "b", iznos: 400, jaSaljem: true },
        { drugiId: "b", iznos: 700, jaSaljem: true },
      ],
    });
    expect((await preracunajUcinak("ja")).brojSagovornika).toBe(0);
  });

  it("ko je u tvom krugu poznanstava ne ulazi u brojač — ni u obrnutom smeru zone", async () => {
    postaviUcinakUBazi({
      upisi: [
        { drugiId: "b", iznos: 2000, jaSaljem: true },
        { drugiId: "c", iznos: 2000, jaSaljem: true },
      ],
      uKrugu: ["b"],
    });
    expect((await preracunajUcinak("ja")).brojSagovornika).toBe(1);

    // Isti par, ali zapis zone stoji u drugom smeru (ja sam u NJEGOVOJ zoni).
    prismaMock.verifikacionaZona.findMany.mockResolvedValue([
      { userId: "b", forbiddenUserId: "ja" },
    ]);
    expect((await preracunajUcinak("ja")).brojSagovornika).toBe(1);
  });

  it("neverifikovan sagovornik se ne broji", async () => {
    postaviUcinakUBazi({
      upisi: [{ drugiId: "b", iznos: 2000, jaSaljem: true }],
      neverifikovani: ["b"],
    });
    expect((await preracunajUcinak("ja")).brojSagovornika).toBe(0);
  });

  it("primljen POEN pravi sagovornika, ali ne otvara korak 2", async () => {
    postaviUcinakUBazi({ upisi: [{ drugiId: "b", iznos: 5000, jaSaljem: false }] });
    const u = await preracunajUcinak("ja");
    expect(u.brojSagovornika).toBe(1);
    expect(u.upisaoSagovorniku).toBe(false);
  });

  it("isti čovek kroz više upisa broji se jednom", async () => {
    postaviUcinakUBazi({
      upisi: [
        { drugiId: "b", iznos: 1000, jaSaljem: true },
        { drugiId: "b", iznos: 3000, jaSaljem: false },
      ],
    });
    expect((await preracunajUcinak("ja")).brojSagovornika).toBe(1);
  });
});

// ─── Napredovanje ────────────────────────────────────────────────────────────

describe("probajNapredovati", () => {
  it("beleži samo otključane korake i evidentira ih verifikovanom korisniku", async () => {
    postaviUcinakUBazi({ upisi: [{ drugiId: "b", iznos: 1500, jaSaljem: true }] });
    prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "REGULARNI" });
    prismaMock.doprinosRazmeni.create.mockResolvedValue({});
    prismaMock.doprinosRazmeni.findMany.mockResolvedValue([{ id: "k2", korak: 2, iznos: 1000 }]);
    prismaMock.doprinosRazmeni.updateMany.mockResolvedValue({ count: 1 });
    emitujPoenMock.mockResolvedValue({ transaction: { id: "t2" } });

    expect(await probajNapredovati("ja")).toBe(1);
    expect(prismaMock.doprinosRazmeni.create).toHaveBeenCalledWith({
      data: { userId: "ja", korak: 2, iznos: 1000 },
    });
    expect(emitujPoenMock).toHaveBeenCalledTimes(1);
  });

  it("neverifikovanom korisniku korak ostaje ZABELEZEN — ništa se ne emituje", async () => {
    postaviUcinakUBazi({ upisi: [{ drugiId: "b", iznos: 1500, jaSaljem: true }] });
    prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "NEVERIFIKOVAN" });
    prismaMock.doprinosRazmeni.create.mockResolvedValue({});

    expect(await probajNapredovati("ja")).toBe(1);
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });

  it("nikada ne beleži korak preko petog — kapa je 5.000 POEN", async () => {
    postaviUcinakUBazi({
      upisi: Array.from({ length: 12 }, (_, i) => ({
        drugiId: `b${i}`,
        iznos: 1000,
        jaSaljem: true,
      })),
      brojOglasa: 3,
      upiti: [
        { oglasId: "o1", posiljacId: "p1" },
        { oglasId: "o2", posiljacId: "p2" },
      ],
    });
    prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "REGULARNI" });
    prismaMock.doprinosRazmeni.create.mockResolvedValue({});
    prismaMock.doprinosRazmeni.findMany.mockResolvedValue([]);

    // Koraci 2, 3, 4 i 5 — korak 1 se vodi u DoprinosSadrzaju i ovde se ne beleži.
    expect(await probajNapredovati("ja")).toBe(4);
    const koraci = prismaMock.doprinosRazmeni.create.mock.calls.map(
      (c) => (c[0] as { data: { korak: number } }).data.korak,
    );
    expect(koraci).toEqual([2, 3, 4, 5]);
  });

  it("bez koraka 1 (prvi oglas) lestvica ne kreće", async () => {
    postaviUcinakUBazi({
      prviOglas: false,
      upisi: [{ drugiId: "b", iznos: 1500, jaSaljem: true }],
    });
    expect(await probajNapredovati("ja")).toBe(0);
    expect(prismaMock.doprinosRazmeni.create).not.toHaveBeenCalled();
  });

  it("sitni upisi ne pomeraju lestvicu", async () => {
    postaviUcinakUBazi({ upisi: [{ drugiId: "b", iznos: 500, jaSaljem: true }] });
    expect(await probajNapredovati("ja")).toBe(0);
  });

  it("već zabeležen korak se ne beleži dvaput (P2002 se guta)", async () => {
    postaviUcinakUBazi({ upisi: [{ drugiId: "b", iznos: 1500, jaSaljem: true }] });
    prismaMock.doprinosRazmeni.create.mockRejectedValue(
      Object.assign(new Error("P2002"), { code: "P2002" }),
    );
    expect(await probajNapredovati("ja")).toBe(0);
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });
});

describe("probajEvidentiratiKorake", () => {
  it("pukla emisija vraća korak u ZABELEZEN da ga sledeći okidač pokupi", async () => {
    prismaMock.doprinosRazmeni.findMany.mockResolvedValue([{ id: "k2", korak: 2, iznos: 1000 }]);
    prismaMock.wallet.findUnique.mockResolvedValue({ id: "w-ja" });
    prismaMock.doprinosRazmeni.updateMany.mockResolvedValue({ count: 1 });
    emitujPoenMock.mockRejectedValue(new Error("pukla emisija"));

    expect(await probajEvidentiratiKorake("ja")).toBe(0);
    const povratak = prismaMock.doprinosRazmeni.updateMany.mock.calls.at(-1)?.[0] as {
      data: { status: string };
    };
    expect(povratak.data.status).toBe("ZABELEZEN");
  });

  it("izgubljena trka za rezervaciju ne emituje ništa", async () => {
    prismaMock.doprinosRazmeni.findMany.mockResolvedValue([{ id: "k2", korak: 2, iznos: 1000 }]);
    prismaMock.wallet.findUnique.mockResolvedValue({ id: "w-ja" });
    prismaMock.doprinosRazmeni.updateMany.mockResolvedValue({ count: 0 });

    expect(await probajEvidentiratiKorake("ja")).toBe(0);
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });
});
