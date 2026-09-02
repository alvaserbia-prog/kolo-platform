/**
 * Kolektivna nabavka — prolaz kroz tok nad PRAVOM bazom.
 *
 * Čista pravila su pokrivena u `__tests__/nabavka-pravila.test.ts` (formula iznosa,
 * izvođenje broja delova, paritet, rokovi, red). Ovaj test ide dalje i izvršava
 * servisni sloj tamo gde se POEN stvarno pomera, jer se tu čuvaju invarijante koje
 * čista funkcija ne može da pokaže:
 *
 *   • red se SNIMA pri zatvaranju prijava i posle se ne pomera;
 *   • rezervacija nastaje tek pri potvrdi, a poništenje tek pri preuzimanju;
 *   • poništenje po iskorišćenju čuva ZERO-SUM i SMANJUJE opticaj;
 *   • oslobođeno mesto ide sledećem u redu;
 *   • predlozi izabrane reči se brišu po sprovedenoj nabavci.
 *
 * Kalkulacija se ovde upisuje neposredno na zapis (kao da je objavljena), da test
 * ne bi vukao ceo dinarski inventar Fondacije — taj deo pokrivaju čista pravila.
 *
 * 🔴 Traži `DATABASE_URL` i PRAZNU bazu sa primenjenim migracijama. Bez nje se
 * preskače — u CI-ju baze nema. Pokretanje:
 *
 *   DATABASE_URL=postgresql://… npx vitest run __tests__/integracija/nabavka-tok.test.ts
 *
 * NIKAD ne pokretati nad produkcionom ni test bazom platforme: test upisuje i briše
 * korisnike i pomera zapis Protokola.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, TipKorisnika, WalletType } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const IMA_BAZU = !!process.env.DATABASE_URL;
const PROTOKOL = "banka-singleton";

const prisma = IMA_BAZU
  ? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })
  : (null as unknown as PrismaClient);

/** Zbir svih zapisa mora biti 0 (Pravilnik čl. 14 st. 1). */
async function zbirSvihZapisa(): Promise<number> {
  const r = await prisma.wallet.aggregate({ _sum: { balance: true } });
  return r._sum.balance ?? 0;
}

/** Opticaj = apsolutna vrednost minusa Protokola. */
async function opticaj(): Promise<number> {
  const p = await prisma.wallet.findUnique({ where: { id: PROTOKOL }, select: { balance: true } });
  return Math.abs(p?.balance ?? 0);
}

const SUFIKS = `nab${Date.now().toString(36)}`;
const napravljeni: string[] = [];

async function napraviClana(ime: string, poen: number): Promise<string> {
  const pseudonim = `${ime}_${SUFIKS}`;
  const u = await prisma.user.create({
    data: {
      pseudonim,
      pseudonimLower: pseudonim.toLowerCase(),
      email: `${pseudonim}@test.invalid`,
      passwordHash: "x",
      memberHash: `${pseudonim}-hash`,
      tipKorisnika: TipKorisnika.REGULARNI,
      verified: true,
      wallet: { create: { type: WalletType.USER, balance: 0 } },
    },
  });
  napravljeni.push(u.id);
  if (poen > 0) {
    // Emisija ručno, da zero-sum ostane netaknut: korisnik +poen, Protokol −poen.
    const w = await prisma.wallet.findUnique({ where: { userId: u.id }, select: { id: true } });
    if (w) {
      await prisma.$transaction([
        prisma.wallet.update({ where: { id: w.id }, data: { balance: { increment: poen } } }),
        prisma.wallet.update({ where: { id: PROTOKOL }, data: { balance: { decrement: poen } } }),
      ]);
    }
  }
  return u.id;
}

describe.skipIf(!IMA_BAZU)("kolektivna nabavka — tok nad bazom", () => {
  let nazivId = "";
  let nabavkaId = "";
  let bogat = "";
  let srednji = "";
  let siromasan = "";
  let cetvrti = "";
  let zbirPre = 0;
  let opticajPre = 0;

  const POEN_PO_DELU = 4280;

  beforeAll(async () => {
    await prisma.wallet.upsert({
      where: { id: PROTOKOL },
      create: { id: PROTOKOL, type: WalletType.PROTOKOL, balance: 0 },
      update: {},
    });
    zbirPre = await zbirSvihZapisa();

    bogat = await napraviClana("bogat", 50_000);
    srednji = await napraviClana("srednji", 20_000);
    siromasan = await napraviClana("siromasan", 5_000);
    cetvrti = await napraviClana("cetvrti", 30_000);

    opticajPre = await opticaj();

    const naziv = await prisma.nazivDobra.create({
      data: { naziv: `Đubrivo ${SUFIKS}`, nazivLower: `đubrivo ${SUFIKS}`.toLowerCase() },
    });
    nazivId = naziv.id;

    // Predlozi — troje traži isto dobro (registar broji LJUDE, ne POEN).
    for (const uid of [bogat, srednji, siromasan]) {
      await prisma.predlogNabavke.create({ data: { userId: uid, nazivId } });
    }

    // Kalkulacija kao da je objavljena: dva dela, po 4.280 POEN.
    const sada = new Date();
    const preuzimanjeOd = new Date(sada);
    preuzimanjeOd.setHours(0, 0, 0, 0);
    const preuzimanjeDo = new Date(preuzimanjeOd);
    preuzimanjeDo.setDate(preuzimanjeDo.getDate() + 3);

    const n = await prisma.nabavka.create({
      data: {
        nazivId,
        status: "OBJAVLJENA",
        dobavljac: "Test dobavljač",
        jedinicaMere: "vreća 25 kg",
        nabavnaCena: 3150,
        maloprodajna: POEN_PO_DELU,
        izvoriCena: "tri javna izvora",
        brojJedinica: 2,
        brojDelova: 2,
        velicinaDela: 1,
        poenPoDelu: POEN_PO_DELU,
        mestoPreuzimanja: "Sombor",
        preuzimanjeOd,
        preuzimanjeDo,
        prijaveDo: new Date(sada.getTime() + 3 * 86_400_000),
        objavljenoAt: sada,
      },
    });
    nabavkaId = n.id;
  });

  afterAll(async () => {
    if (!IMA_BAZU) return;
    await prisma.nabavkaPrijava.deleteMany({ where: { nabavkaId } });
    await prisma.projekatTrosak.deleteMany({ where: { nabavkaId } });
    await prisma.nabavka.deleteMany({ where: { id: nabavkaId } });
    await prisma.predlogNabavke.deleteMany({ where: { nazivId } });
    await prisma.nazivDobra.deleteMany({ where: { id: nazivId } });
    for (const uid of napravljeni) {
      const w = await prisma.wallet.findUnique({ where: { userId: uid }, select: { id: true, balance: true } });
      if (w) {
        // Vrati zapis na nulu uz protivzapis, pa zero-sum ostaje netaknut.
        await prisma.$transaction([
          prisma.wallet.update({ where: { id: w.id }, data: { balance: 0 } }),
          prisma.wallet.update({ where: { id: PROTOKOL }, data: { balance: { increment: w.balance } } }),
        ]);
      }
      await prisma.transaction.deleteMany({ where: { OR: [{ fromWalletId: w?.id }, { toWalletId: w?.id }] } });
      await prisma.wallet.deleteMany({ where: { userId: uid } });
      await prisma.user.deleteMany({ where: { id: uid } });
    }
    await prisma.$disconnect();
  });

  it("registar broji različite ljude, ne POEN", async () => {
    const { registarPredloga } = await import("@/lib/protokol/nabavka");
    const r = await registarPredloga();
    const nas = r.find((x) => x.nazivId === nazivId);
    expect(nas?.brojKorisnika).toBe(3);
  });

  it("prijava ne dira zapis — obaveza nastaje tek potvrdom", async () => {
    const { prijaviSe } = await import("@/lib/protokol/nabavka");
    for (const uid of [siromasan, bogat, srednji, cetvrti]) {
      await prijaviSe(uid, nabavkaId);
    }
    const w = await prisma.wallet.findUnique({ where: { userId: bogat }, select: { balance: true } });
    expect(w?.balance).toBe(50_000);
    expect(await opticaj()).toBe(opticajPre);
  });

  it("red se snima po broju POEN-a, od većeg ka manjem", async () => {
    const { zatvoriPrijaveIUtvrdiRed } = await import("@/lib/protokol/nabavka");
    const broj = await zatvoriPrijaveIUtvrdiRed(nabavkaId);
    expect(broj).toBe(4);

    const red = await prisma.nabavkaPrijava.findMany({
      where: { nabavkaId },
      orderBy: { mesto: "asc" },
      select: { userId: true, mesto: true, poenSnimak: true, status: true },
    });
    expect(red.map((r) => r.userId)).toEqual([bogat, cetvrti, srednji, siromasan]);
    expect(red[0].poenSnimak).toBe(50_000);
    // Prva dva (koliko ima delova) su pozvana, ostali čekaju.
    expect(red[0].status).toBe("POZVAN");
    expect(red[1].status).toBe("POZVAN");
    expect(red[2].status).toBe("PRIJAVLJEN");
  });

  it("snimak se ne pomera kad se zapis kasnije promeni", async () => {
    const w = await prisma.wallet.findUnique({ where: { userId: siromasan }, select: { id: true } });
    await prisma.$transaction([
      prisma.wallet.update({ where: { id: w!.id }, data: { balance: { increment: 100_000 } } }),
      prisma.wallet.update({ where: { id: PROTOKOL }, data: { balance: { decrement: 100_000 } } }),
    ]);
    const p = await prisma.nabavkaPrijava.findUnique({
      where: { nabavkaId_userId: { nabavkaId, userId: siromasan } },
      select: { mesto: true, poenSnimak: true },
    });
    // Red je snimak (čl. 22 st. 2) — kasniji priliv ga ne pomera.
    expect(p?.mesto).toBe(4);
    expect(p?.poenSnimak).toBe(5_000);
  });

  it("potvrda rezerviše POEN, ali ga ne poništava", async () => {
    const { potvrdiUcesce } = await import("@/lib/protokol/nabavka");
    const n = await prisma.nabavka.findUnique({ where: { id: nabavkaId }, select: { preuzimanjeOd: true } });
    const r = await potvrdiUcesce(bogat, nabavkaId, n!.preuzimanjeOd!);
    expect(r?.rezervisano).toBe(POEN_PO_DELU);
    expect(r?.kod).toBeTruthy();

    const w = await prisma.wallet.findUnique({ where: { userId: bogat }, select: { balance: true } });
    expect(w?.balance).toBe(50_000); // još nije poništeno (čl. 27 st. 3)
    expect(await zbirSvihZapisa()).toBe(zbirPre);
  });

  it("odustanak oslobađa mesto i poziv ide sledećem u redu", async () => {
    const { odustani } = await import("@/lib/protokol/nabavka");
    await odustani(cetvrti, nabavkaId);

    const red = await prisma.nabavkaPrijava.findMany({
      where: { nabavkaId },
      orderBy: { mesto: "asc" },
      select: { userId: true, status: true },
    });
    expect(red.find((r) => r.userId === cetvrti)?.status).toBe("ODUSTAO");
    // Nema posebne liste čekanja — red se prosto nastavlja (čl. 24 st. 3).
    expect(red.find((r) => r.userId === srednji)?.status).toBe("POZVAN");
  });

  it("preuzimanje poništava POEN, čuva zero-sum i SMANJUJE opticaj", async () => {
    const { oznaciPreuzeto } = await import("@/lib/protokol/nabavka");
    const opticajPreUzimanja = await opticaj();

    const p = await prisma.nabavkaPrijava.findUnique({
      where: { nabavkaId_userId: { nabavkaId, userId: bogat } },
      select: { id: true },
    });
    await oznaciPreuzeto(p!.id);

    const w = await prisma.wallet.findUnique({ where: { userId: bogat }, select: { balance: true } });
    expect(w?.balance).toBe(50_000 - POEN_PO_DELU);

    // 🔴 Zbir svih zapisa ostaje nula (čl. 27 st. 4), a opticaj OPADA — poništava se
    // emisija, ne seli se POEN između dva korisnička zapisa.
    expect(await zbirSvihZapisa()).toBe(zbirPre);
    expect(await opticaj()).toBe(opticajPreUzimanja - POEN_PO_DELU);

    const tx = await prisma.transaction.findFirst({
      where: { type: "OTPIS_NABAVKA", toWalletId: PROTOKOL },
      orderBy: { createdAt: "desc" },
      select: { amount: true, opisKljuc: true },
    });
    expect(tx?.amount).toBe(POEN_PO_DELU);
    expect(tx?.opisKljuc).toBe("transakcije.nabavka");

    const posle = await prisma.nabavkaPrijava.findUnique({
      where: { id: p!.id },
      select: { status: true, rezervisano: true, preuzetoAt: true },
    });
    expect(posle?.status).toBe("PREUZEO");
    expect(posle?.rezervisano).toBe(0); // rezervacija je potrošena, ne visi
    expect(posle?.preuzetoAt).toBeTruthy();
  });

  it("zatvaranje nabavke briše predloge izabrane reči", async () => {
    const { zavrsiNabavku } = await import("@/lib/protokol/nabavka");
    await prisma.nabavka.update({ where: { id: nabavkaId }, data: { status: "PLACENA" } });

    const pre = await prisma.predlogNabavke.count({ where: { nazivId } });
    expect(pre).toBe(3);

    // 🔴 Bez brisanja bi ista reč pobeđivala zauvek i registar bi prestao da meri išta.
    const obrisano = await zavrsiNabavku(nabavkaId);
    expect(obrisano).toBe(3);
    expect(await prisma.predlogNabavke.count({ where: { nazivId } })).toBe(0);
  });
});
