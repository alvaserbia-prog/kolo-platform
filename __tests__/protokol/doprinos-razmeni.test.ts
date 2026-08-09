import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMock = vi.hoisted(() => ({
  wallet: { findUnique: vi.fn() },
  user: { findUnique: vi.fn() },
  doprinosSadrzaju: { findFirst: vi.fn(), findUnique: vi.fn() },
  doprinosRazmeni: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  razmena: { findMany: vi.fn(), findUnique: vi.fn(), upsert: vi.fn(), updateMany: vi.fn() },
  oglasUpit: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
  marketplaceListing: { count: vi.fn(), findUnique: vi.fn() },
  transaction: { findMany: vi.fn() },
  verifikacionaZona: { count: vi.fn() },
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
  POSLEDNJI_KORAK,
  POVRATNI_ROK_MS,
  PRAG_SAGOVORNIKA_KORAK_4,
  PRAG_SAGOVORNIKA_KORAK_5,
  brojOglasaSaRazlicitimUpitima,
  dostignutKorak,
  korakIspunjen,
  postojiPovrat,
  prazanUcinak,
  sagovorniciUBrojacu,
  potvrdiRazmenu,
  probajEvidentiratiKorake,
  probajNapredovati,
  type PoenTok,
  type RazmenaZapis,
} from "@/lib/protokol/doprinos-razmeni";

const DAN = 24 * 60 * 60 * 1000;
const T0 = new Date("2026-01-01T00:00:00Z");
const posle = (dana: number) => new Date(T0.getTime() + dana * DAN);

function razmena(izmene: Partial<RazmenaZapis> = {}): RazmenaZapis {
  return { sagovornikId: "b", vanLanca: true, sagovornikVerifikovan: true, ...izmene };
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
});

// ─── Povratni tok POEN-a ─────────────────────────────────────────────────────

describe("postojiPovrat", () => {
  const tokovi = (t: PoenTok[]) => t;

  it("jedan smer nije povrat", () => {
    expect(
      postojiPovrat(tokovi([{ drugiId: "b", smer: "KA", kada: T0 }]), "b"),
    ).toBe(false);
  });

  it("oba smera u roku od 60 dana zatvaraju krug", () => {
    expect(
      postojiPovrat(
        tokovi([
          { drugiId: "b", smer: "KA", kada: T0 },
          { drugiId: "b", smer: "OD", kada: posle(59) },
        ]),
        "b",
      ),
    ).toBe(true);
  });

  it("posle isteka roka povrat više ne važi", () => {
    expect(
      postojiPovrat(
        tokovi([
          { drugiId: "b", smer: "KA", kada: T0 },
          { drugiId: "b", smer: "OD", kada: posle(61) },
        ]),
        "b",
      ),
    ).toBe(false);
  });

  it("tokovi sa trećim licem ne diraju ovaj par", () => {
    expect(
      postojiPovrat(
        tokovi([
          { drugiId: "b", smer: "KA", kada: T0 },
          { drugiId: "c", smer: "OD", kada: posle(1) },
        ]),
        "b",
      ),
    ).toBe(false);
  });

  it("rok je tačno 60 dana", () => {
    expect(POVRATNI_ROK_MS).toBe(60 * DAN);
  });
});

// ─── Sita brojača ────────────────────────────────────────────────────────────

describe("sagovorniciUBrojacu", () => {
  it("uzima razmenu van lanca sa verifikovanim sagovornikom", () => {
    expect([...sagovorniciUBrojacu([razmena()], [])]).toEqual(["b"]);
  });

  it("izbacuje sagovornika u lancu", () => {
    expect(sagovorniciUBrojacu([razmena({ vanLanca: false })], []).size).toBe(0);
  });

  it("izbacuje neverifikovanog sagovornika — razmena se beleži, ali ne broji", () => {
    expect(sagovorniciUBrojacu([razmena({ sagovornikVerifikovan: false })], []).size).toBe(0);
  });

  it("izbacuje sagovornika kome se POEN vratio u roku od 60 dana", () => {
    const tokovi: PoenTok[] = [
      { drugiId: "b", smer: "KA", kada: T0 },
      { drugiId: "b", smer: "OD", kada: posle(10) },
    ];
    expect(sagovorniciUBrojacu([razmena()], tokovi).size).toBe(0);
  });

  it("isti sagovornik kroz više razmena broji se jednom", () => {
    expect(sagovorniciUBrojacu([razmena(), razmena()], []).size).toBe(1);
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
      poslaoPoenSagovorniku: true,
      brojOglasa: 1,
      oglasaSaRazlicitimUpitima: 0,
      brojSagovornika: 12,
    };
    expect(korakIspunjen(5, u)).toBe(true); // uslov koraka 5 jeste ispunjen…
    expect(dostignutKorak(u)).toBe(2); // …ali korak 3 nije, pa lestvica stoji
  });

  it("puna lestvica staje na petom koraku", () => {
    const u = {
      prviOglasZabelezen: true,
      poslaoPoenSagovorniku: true,
      brojOglasa: 3,
      oglasaSaRazlicitimUpitima: 2,
      brojSagovornika: 10,
    };
    expect(dostignutKorak(u)).toBe(5);
  });

  it("korak 3 traži i tri oglasa i dva upita različitih ljudi", () => {
    const osnov = { ...prazanUcinak(), prviOglasZabelezen: true, poslaoPoenSagovorniku: true };
    expect(dostignutKorak({ ...osnov, brojOglasa: 3, oglasaSaRazlicitimUpitima: 1 })).toBe(2);
    expect(dostignutKorak({ ...osnov, brojOglasa: 2, oglasaSaRazlicitimUpitima: 2 })).toBe(2);
    expect(dostignutKorak({ ...osnov, brojOglasa: 3, oglasaSaRazlicitimUpitima: 2 })).toBe(3);
  });
});

// ─── Napredovanje nad bazom ──────────────────────────────────────────────────

/** Podešava upite koje čita `preracunajUcinak`. */
function postaviUcinakUBazi(opcije: {
  prviOglas?: boolean;
  razmene?: Array<{ drugiId: string; vanLanca: boolean; verifikovan: boolean }>;
  poslaoKome?: string[];
  brojOglasa?: number;
  upiti?: Array<{ oglasId: string; posiljacId: string }>;
}) {
  prismaMock.wallet.findUnique.mockResolvedValue({ id: "w-ja" });
  prismaMock.doprinosSadrzaju.findFirst.mockResolvedValue(
    opcije.prviOglas === false ? null : { id: "d1" },
  );
  prismaMock.razmena.findMany.mockResolvedValue(
    (opcije.razmene ?? []).map((r) => ({
      oglasivacId: "ja",
      sagovornikId: r.drugiId,
      vanLanca: r.vanLanca,
      oglasivac: { tipKorisnika: "REGULARNI" },
      sagovornik: { tipKorisnika: r.verifikovan ? "REGULARNI" : "NEVERIFIKOVAN" },
    })),
  );
  prismaMock.marketplaceListing.count.mockResolvedValue(opcije.brojOglasa ?? 0);
  prismaMock.oglasUpit.findMany.mockResolvedValue(opcije.upiti ?? []);
  prismaMock.transaction.findMany.mockResolvedValue(
    (opcije.poslaoKome ?? []).map((id) => ({
      fromWalletId: "w-ja",
      createdAt: T0,
      fromWallet: { userId: "ja" },
      toWallet: { userId: id },
    })),
  );
}

describe("probajNapredovati", () => {
  it("beleži samo otključane korake i evidentira ih verifikovanom korisniku", async () => {
    postaviUcinakUBazi({ razmene: [{ drugiId: "b", vanLanca: true, verifikovan: true }], poslaoKome: ["b"] });
    prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "REGULARNI" });
    prismaMock.doprinosRazmeni.create.mockResolvedValue({});
    prismaMock.doprinosRazmeni.findMany.mockResolvedValue([{ id: "k2", korak: 2, iznos: 1000 }]);
    prismaMock.doprinosRazmeni.updateMany.mockResolvedValue({ count: 1 });
    emitujPoenMock.mockResolvedValue({ transaction: { id: "t2" } });

    expect(await probajNapredovati("ja")).toBe(1);
    expect(prismaMock.doprinosRazmeni.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.doprinosRazmeni.create).toHaveBeenCalledWith({
      data: { userId: "ja", korak: 2, iznos: 1000 },
    });
    expect(emitujPoenMock).toHaveBeenCalledTimes(1);
  });

  it("neverifikovanom korisniku korak ostaje ZABELEZEN — ništa se ne emituje", async () => {
    postaviUcinakUBazi({ razmene: [{ drugiId: "b", vanLanca: true, verifikovan: true }], poslaoKome: ["b"] });
    prismaMock.user.findUnique.mockResolvedValue({ tipKorisnika: "NEVERIFIKOVAN" });
    prismaMock.doprinosRazmeni.create.mockResolvedValue({});

    expect(await probajNapredovati("ja")).toBe(1);
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });

  it("nikada ne beleži korak preko petog — kapa je 5.000 POEN", async () => {
    postaviUcinakUBazi({
      razmene: Array.from({ length: 12 }, (_, i) => ({
        drugiId: `b${i}`,
        vanLanca: true,
        verifikovan: true,
      })),
      poslaoKome: ["b0"],
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
    const zabelezeniKoraci = prismaMock.doprinosRazmeni.create.mock.calls.map(
      (c) => (c[0] as { data: { korak: number } }).data.korak,
    );
    expect(zabelezeniKoraci).toEqual([2, 3, 4, 5]);
  });

  it("bez koraka 1 (prvi oglas) lestvica ne kreće", async () => {
    postaviUcinakUBazi({
      prviOglas: false,
      razmene: [{ drugiId: "b", vanLanca: true, verifikovan: true }],
      poslaoKome: ["b"],
    });
    expect(await probajNapredovati("ja")).toBe(0);
    expect(prismaMock.doprinosRazmeni.create).not.toHaveBeenCalled();
  });

  it("POEN vraćen u roku od 60 dana obara korak 2", async () => {
    postaviUcinakUBazi({ razmene: [{ drugiId: "b", vanLanca: true, verifikovan: true }] });
    prismaMock.transaction.findMany.mockResolvedValue([
      { fromWalletId: "w-ja", createdAt: T0, fromWallet: { userId: "ja" }, toWallet: { userId: "b" } },
      { fromWalletId: "w-b", createdAt: posle(5), fromWallet: { userId: "b" }, toWallet: { userId: "ja" } },
    ]);
    expect(await probajNapredovati("ja")).toBe(0);
  });

  it("već zabeležen korak se ne beleži dvaput (P2002 se guta)", async () => {
    postaviUcinakUBazi({ razmene: [{ drugiId: "b", vanLanca: true, verifikovan: true }], poslaoKome: ["b"] });
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

// ─── Obostrana potvrda razmene ───────────────────────────────────────────────

describe("potvrdiRazmenu", () => {
  const oglas = { id: "o1", sellerId: "prodavac", status: "ACTIVE" };

  it("jednostrana oznaka ne realizuje razmenu", async () => {
    prismaMock.marketplaceListing.findUnique.mockResolvedValue(oglas);
    prismaMock.razmena.findUnique.mockResolvedValue(null);
    prismaMock.razmena.upsert.mockResolvedValue({
      id: "r1",
      potvrdioOglasivacAt: null,
      potvrdioSagovornikAt: new Date(),
    });

    const rez = await potvrdiRazmenu({ oglasId: "o1", korisnikId: "kupac" });
    expect(rez).toEqual({ ok: true, status: "PREDLOZENA" });
    expect(prismaMock.razmena.updateMany).not.toHaveBeenCalled();
  });

  it("oglašivač ne može da imenuje nekoga ko mu se nije javio", async () => {
    prismaMock.marketplaceListing.findUnique.mockResolvedValue(oglas);
    prismaMock.razmena.findUnique.mockResolvedValue(null);
    prismaMock.oglasUpit.findUnique.mockResolvedValue(null);

    const rez = await potvrdiRazmenu({
      oglasId: "o1",
      korisnikId: "prodavac",
      sagovornikId: "neznanac",
    });
    expect(rez.ok).toBe(false);
    expect(prismaMock.razmena.upsert).not.toHaveBeenCalled();
  });

  it("druga oznaka realizuje razmenu i snima da li su strane van lanca", async () => {
    prismaMock.marketplaceListing.findUnique.mockResolvedValue(oglas);
    prismaMock.razmena.findUnique.mockResolvedValue({ id: "r1", status: "PREDLOZENA" });
    prismaMock.oglasUpit.findUnique.mockResolvedValue({ id: "u1" });
    prismaMock.razmena.upsert.mockResolvedValue({
      id: "r1",
      potvrdioOglasivacAt: new Date(),
      potvrdioSagovornikAt: new Date(),
    });
    prismaMock.verifikacionaZona.count.mockResolvedValue(0); // nisu ni u čijoj zoni
    prismaMock.razmena.updateMany.mockResolvedValue({ count: 1 });
    // Napredovanje obe strane — učinak je prazan, pa ništa ne beleži.
    postaviUcinakUBazi({ prviOglas: false });

    const rez = await potvrdiRazmenu({
      oglasId: "o1",
      korisnikId: "prodavac",
      sagovornikId: "kupac",
    });
    expect(rez).toEqual({ ok: true, status: "REALIZOVANA" });
    const upis = prismaMock.razmena.updateMany.mock.calls[0][0] as {
      data: { status: string; vanLanca: boolean };
    };
    expect(upis.data.status).toBe("REALIZOVANA");
    expect(upis.data.vanLanca).toBe(true);
  });

  it("strane u istom lancu jemstva se pamte kao takve", async () => {
    prismaMock.marketplaceListing.findUnique.mockResolvedValue(oglas);
    prismaMock.razmena.findUnique.mockResolvedValue({ id: "r1", status: "PREDLOZENA" });
    prismaMock.oglasUpit.findUnique.mockResolvedValue({ id: "u1" });
    prismaMock.razmena.upsert.mockResolvedValue({
      id: "r1",
      potvrdioOglasivacAt: new Date(),
      potvrdioSagovornikAt: new Date(),
    });
    prismaMock.verifikacionaZona.count.mockResolvedValue(1); // jedno je u zoni drugog
    prismaMock.razmena.updateMany.mockResolvedValue({ count: 1 });
    postaviUcinakUBazi({ prviOglas: false });

    await potvrdiRazmenu({ oglasId: "o1", korisnikId: "prodavac", sagovornikId: "kupac" });
    const upis = prismaMock.razmena.updateMany.mock.calls[0][0] as {
      data: { vanLanca: boolean };
    };
    expect(upis.data.vanLanca).toBe(false);
  });

  it("razmena traži dve strane", async () => {
    prismaMock.marketplaceListing.findUnique.mockResolvedValue(oglas);
    const rez = await potvrdiRazmenu({
      oglasId: "o1",
      korisnikId: "prodavac",
      sagovornikId: "prodavac",
    });
    expect(rez.ok).toBe(false);
  });
});
