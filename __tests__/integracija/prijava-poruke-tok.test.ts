/**
 * Prijava poruke — prolaz kroz odluku Fondacije nad PRAVOM bazom.
 *
 * Čista pravila (šifarnik, provera unosa, prag obrasca) pokriva
 * `__tests__/prijava-poruke.test.ts`. Ovaj test izvršava SERVISNI sloj, jer se
 * tu čuvaju dve stvari koje čista funkcija ne može da pokaže: da uklanjanje
 * zatvara SVE otvorene prijave nad porukom (a ne samo onu na koju je pritisnuto)
 * i da odbacivanje zatvara samo svoju.
 *
 * 🔴 Traži `DATABASE_URL` i PRAZNU bazu sa primenjenim migracijama. Bez nje se
 * preskače — u CI-ju baze nema. Pokretanje:
 *
 *   DATABASE_URL=postgresql://… npx vitest run __tests__/integracija
 *
 * NIKAD ne pokretati nad produkcionom ni test bazom platforme.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, WalletType } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ukloniPoPrijavi, odbaciPrijavuPoruke } from "@/lib/prijava-poruke";

const IMA_BAZU = !!process.env.DATABASE_URL;

const prisma = IMA_BAZU
  ? new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })
  : (null as unknown as PrismaClient);

let brojac = 0;
async function korisnik(pseudonim: string, extra: Record<string, unknown> = {}) {
  brojac += 1;
  return prisma.user.create({
    data: {
      pseudonim,
      pseudonimLower: pseudonim.toLowerCase(),
      memberHash: `p${String(brojac).padStart(7, "0")}`,
      wallet: { create: { type: WalletType.USER, balance: 0 } },
      ...extra,
    },
    select: { id: true, pseudonim: true },
  });
}

describe.skipIf(!IMA_BAZU)("prijava poruke — odluka Fondacije", () => {
  let autor = "";
  let admin = "";
  let porukaId = "";
  let drugaId = "";
  const prijave: string[] = [];

  beforeAll(async () => {
    autor = (await korisnik("AutorPoruke")).id;
    admin = (await korisnik("AdminOdluke", { admin: "SUPERADMIN" })).id;
    const ana = (await korisnik("AnaPrijava")).id;
    const bojan = (await korisnik("BojanPrijava")).id;
    const cveta = (await korisnik("CvetaPrijava")).id;

    // `soba: "DECA"` je namerno i posle 04.09.2026. Nove prijave iz dečje sobe
    // ruta više ne prima, ali ZATEČENE — upisane dok je dugme radilo — admin i
    // dalje mora da ume da reši. Servisni sloj sobu ne gleda i ne sme da je gleda.
    const poruka = await prisma.chatMessage.create({
      data: { userId: autor, content: "sporna poruka", soba: "DECA" },
    });
    const druga = await prisma.chatMessage.create({
      data: { userId: autor, content: "druga poruka", soba: "DECA" },
    });
    porukaId = poruka.id;
    drugaId = druga.id;

    for (const [ko, kod] of [
      [ana, "TRAZI_SLIKE"],
      [bojan, "VREDJANJE"],
    ] as const) {
      const p = await prisma.prijavaPoruke.create({
        data: { porukaId, prijaviocId: ko, prijavljeniId: autor, razlogKod: kod },
      });
      prijave.push(p.id);
    }
    const p3 = await prisma.prijavaPoruke.create({
      data: { porukaId: drugaId, prijaviocId: cveta, prijavljeniId: autor, razlogKod: "LAZE_UZRAST" },
    });
    prijave.push(p3.id);
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it("jedan prijavilac ne može dvaput nad istom porukom", async () => {
    const prva = await prisma.prijavaPoruke.findUnique({ where: { id: prijave[0] } });
    await expect(
      prisma.prijavaPoruke.create({
        data: {
          porukaId,
          prijaviocId: prva!.prijaviocId,
          prijavljeniId: autor,
          razlogKod: "OSTALO",
          razlog: "opet",
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("grupa broji različite prijavioce, ne prijave", async () => {
    const razliciti = await prisma.prijavaPoruke.findMany({
      where: { prijavljeniId: autor },
      select: { prijaviocId: true },
      distinct: ["prijaviocId"],
    });
    expect(razliciti).toHaveLength(3);
  });

  it("uklanjanje zatvara SVE otvorene prijave nad tom porukom i meko uklanja poruku", async () => {
    const rez = await ukloniPoPrijavi(prijave[0], admin, "Vređanje drugog deteta.");
    expect(rez.ok).toBe(true);

    const poruka = await prisma.chatMessage.findUnique({ where: { id: porukaId } });
    expect(poruka?.uklonjenoAt).not.toBeNull();
    expect(poruka?.uklonioId).toBe(admin);

    const nadPorukom = await prisma.prijavaPoruke.findMany({ where: { porukaId } });
    expect(nadPorukom.every((p) => p.status === "RESENA")).toBe(true);
    expect(nadPorukom.every((p) => p.odluka === "Vređanje drugog deteta.")).toBe(true);
  });

  it("prijava nad DRUGOM porukom ostaje otvorena", async () => {
    const p = await prisma.prijavaPoruke.findUnique({ where: { id: prijave[2] } });
    expect(p?.status).toBe("OTVORENA");
  });

  it("rešena prijava se ne rešava dvaput", async () => {
    const rez = await ukloniPoPrijavi(prijave[0], admin, "Ponovljena odluka.");
    expect(rez.ok).toBe(false);
  });

  it("odbacivanje zatvara samo svoju prijavu, uz obrazloženje", async () => {
    const rez = await odbaciPrijavuPoruke(prijave[2], admin, "Nema povrede Uslova.");
    expect(rez.ok).toBe(true);

    const p = await prisma.prijavaPoruke.findUnique({ where: { id: prijave[2] } });
    expect(p?.status).toBe("ODBACENA");
    expect(p?.odluka).toBe("Nema povrede Uslova.");

    const druga = await prisma.chatMessage.findUnique({ where: { id: drugaId } });
    expect(druga?.uklonjenoAt).toBeNull();
  });

  it("badge pada na nulu kad je sve rešeno", async () => {
    const otvorenih = await prisma.prijavaPoruke.count({ where: { status: "OTVORENA" } });
    expect(otvorenih).toBe(0);
  });

  /**
   * Noćni cron briše poruke Pričaonice starije od 30 dana. Prijava bez poruke
   * nema dokaz i nema o čemu da se odlučuje, pa ide sa njom — na to se oslanja i
   * migracija `20260817140000`, koja zatečene prijave bez poruke briše umesto da
   * im izmišlja subjekta.
   */
  it("brisanje poruke povlači i prijave nad njom", async () => {
    await prisma.chatMessage.delete({ where: { id: drugaId } });
    const ostalo = await prisma.prijavaPoruke.count({ where: { porukaId: drugaId } });
    expect(ostalo).toBe(0);
  });
});
