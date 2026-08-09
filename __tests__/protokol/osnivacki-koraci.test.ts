import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Uzastopno okidanje koraka (catch-up).
 *
 * Korak od 24.000 POEN okida se na svakih 100.000 ukupnog POEN-a u sistemu.
 * Kad opticaj poraste naglo — velika bulk emisija, noćna emisija programa,
 * više donacija odjednom — jedan poziv može da preskoči više pragova. Tada
 * koraci moraju da se upale UZASTOPNO dok se svi preskočeni ne nadoknade,
 * a ne jedan po pozivu.
 *
 * Petlja poredi prema snimku ukupnog POEN-a UZETOM PRE emisija: POEN koji
 * koraci sami emituju ne sme da gura sledeći prag, inače bi svaki korak
 * približavao naredni i kanal bi se sam pojačavao.
 */

const prismaMock = vi.hoisted(() => ({
  osnivackiKanal: { upsert: vi.fn(), update: vi.fn() },
  osnivac: { findMany: vi.fn() },
  osnivackiKorakLog: { create: vi.fn() },
  osnivackiKorakEmisija: { create: vi.fn() },
  wallet: { findUnique: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const emitujPoenMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/protokol/emisija", () => ({ emitujPoen: emitujPoenMock }));

import { proveriIEvidentirajKorak, KORAK_IZNOS, PRAG_SKOK } from "@/lib/protokol/osnivacki";

/** Stanje kanala; podrazumevano otvoren, osnivači zaključani, nula koraka. */
function kanal(izmene: Record<string, unknown> = {}) {
  return {
    id: "singleton",
    zatvoren: false,
    osnivaciZakljucani: true,
    brojKoraka: 0,
    poslednjiPrag: 0,
    ukupnoEvidentirano: 0,
    ...izmene,
  };
}

/** Ukupan POEN u sistemu = apsolutna vrednost minusa Protokola. */
function opticaj(poen: number) {
  prismaMock.wallet.findUnique.mockImplementation(({ where }: { where: { id?: string } }) =>
    where.id === "banka-singleton"
      ? Promise.resolve({ balance: -poen })
      : Promise.resolve({ id: "w-osnivac" }),
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.osnivackiKanal.upsert.mockResolvedValue(kanal());
  prismaMock.osnivackiKanal.update.mockResolvedValue({});
  prismaMock.osnivac.findMany.mockResolvedValue([
    { id: "o1", userId: "u1", redniBroj: 1, udeoBrojilac: 1, udeoImenilac: 1 },
  ]);
  prismaMock.osnivackiKorakLog.create.mockImplementation(({ data }: { data: unknown }) =>
    Promise.resolve({ id: "log", ...(data as object) }),
  );
  prismaMock.osnivackiKorakEmisija.create.mockResolvedValue({});
  emitujPoenMock.mockResolvedValue({ transaction: { id: "t" } });
  opticaj(0);
});

describe("proveriIEvidentirajKorak — uzastopno nadoknađivanje preskočenih koraka", () => {
  it("ispod prvog praga ne evidentira ništa", async () => {
    opticaj(PRAG_SKOK - 1);
    const r = await proveriIEvidentirajKorak();
    expect(r.evidentiranoKoraka).toBe(0);
    expect(emitujPoenMock).not.toHaveBeenCalled();
  });

  it("tačno na pragu evidentira jedan korak", async () => {
    opticaj(PRAG_SKOK);
    const r = await proveriIEvidentirajKorak();
    expect(r.evidentiranoKoraka).toBe(1);
  });

  it("bulk emisija preko tri praga pali tri koraka u jednom pozivu", async () => {
    opticaj(3 * PRAG_SKOK + 50_000);
    const r = await proveriIEvidentirajKorak();

    expect(r.evidentiranoKoraka).toBe(3);
    expect(emitujPoenMock).toHaveBeenCalledTimes(3);

    // Pragovi idu redom 100k, 200k, 300k — nijedan preskočen, nijedan ponovljen.
    const pragovi = prismaMock.osnivackiKorakLog.create.mock.calls.map(
      (c) => (c[0] as { data: { prag: number } }).data.prag,
    );
    expect(pragovi).toEqual([PRAG_SKOK, 2 * PRAG_SKOK, 3 * PRAG_SKOK]);
  });

  it("nastavlja od zatečenog praga — ne evidentira ponovo već pređene", async () => {
    prismaMock.osnivackiKanal.upsert.mockResolvedValue(
      kanal({ brojKoraka: 2, poslednjiPrag: 2 * PRAG_SKOK, ukupnoEvidentirano: 2 * KORAK_IZNOS }),
    );
    opticaj(4 * PRAG_SKOK);

    const r = await proveriIEvidentirajKorak();
    expect(r.evidentiranoKoraka).toBe(2);
    const pragovi = prismaMock.osnivackiKorakLog.create.mock.calls.map(
      (c) => (c[0] as { data: { prag: number } }).data.prag,
    );
    expect(pragovi).toEqual([3 * PRAG_SKOK, 4 * PRAG_SKOK]);
  });

  it("POEN koji koraci sami emituju ne gura sledeći prag (bez samopojačavanja)", async () => {
    // Opticaj je 1 POEN ispod drugog praga. Prvi korak emituje KORAK_IZNOS, što bi
    // — da se prag poredio posle svake emisije — odmah preseklo i drugi prag.
    opticaj(2 * PRAG_SKOK - 1);
    const r = await proveriIEvidentirajKorak();
    expect(r.evidentiranoKoraka).toBe(1);
  });

  it("zatvoren kanal i nezaključani osnivači ne evidentiraju ništa", async () => {
    opticaj(5 * PRAG_SKOK);

    prismaMock.osnivackiKanal.upsert.mockResolvedValue(kanal({ zatvoren: true }));
    expect((await proveriIEvidentirajKorak()).evidentiranoKoraka).toBe(0);

    prismaMock.osnivackiKanal.upsert.mockResolvedValue(kanal({ osnivaciZakljucani: false }));
    expect((await proveriIEvidentirajKorak()).evidentiranoKoraka).toBe(0);

    expect(emitujPoenMock).not.toHaveBeenCalled();
  });
});
