/**
 * Modul Deca — prolaz kroz ceo tok nad PRAVOM bazom.
 *
 * Ostali testovi modula pokrivaju čista pravila (`__tests__/deca-pravila.test.ts`):
 * granice uzrasta, ko sme kome da piše, ko vidi čiji oglas. Ovaj ide dalje i
 * izvršava servisni sloj — otvaranje naloga, izjašnjenje potvrđivača, poništenje
 * po isteku roka i brisanje naloga — jer se tu čuvaju invarijante koje čista
 * funkcija ne može da pokaže: zero-sum, oslobađanje slota i preračun indeksa.
 *
 * 🔴 Traži `DATABASE_URL` i PRAZNU bazu sa primenjenim migracijama. Bez nje se
 * preskače — u CI-ju baze nema. Pokretanje:
 *
 *   DATABASE_URL=postgresql://… npx vitest run __tests__/integracija
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

/** Zbir svih zapisa mora biti 0 (Pravilnik čl. 14). */
async function zbirSvihZapisa(): Promise<number> {
  const r = await prisma.wallet.aggregate({ _sum: { balance: true } });
  return r._sum.balance ?? 0;
}

let brojac = 0;

async function napraviKorisnika(pseudonim: string, extra: Record<string, unknown> = {}) {
  brojac += 1;
  return prisma.user.create({
    data: {
      pseudonim,
      pseudonimLower: pseudonim.toLowerCase(),
      // `memberHash` je jedinstven; izvođenje iz pseudonima nije dovoljno, jer
      // „PotvrdjivacA" i „PotvrdjivacB" daju isti prvih osam znakova.
      memberHash: `t${String(brojac).padStart(7, "0")}`,
      wallet: { create: { type: WalletType.USER, balance: 0 } },
      ...extra,
    },
    select: { id: true, pseudonim: true },
  });
}

describe.skipIf(!IMA_BAZU)("Modul Deca — ceo tok nad bazom", () => {
  let protokolPre = 0;
  let potvrdjivacA = "";
  let potvrdjivacB = "";
  let roditeljId = "";
  let deteId = "";

  beforeAll(async () => {
    // 🔴 Brana, i to dvostruka. Test upisuje korisnike, emituje POEN i poništava
    // potvrde — nad bazom platforme to je šteta koja se ne vraća. Uz to, ponovno
    // pokretanje nad istom bazom pada na jedinstvenosti pseudonima, pa bi izgledalo
    // kao kvar modula umesto kao prljava baza.
    const zauzeto = await prisma.user.count();
    if (zauzeto > 0) {
      throw new Error(
        `Baza nije prazna (${zauzeto} korisnika). Ovaj test traži svežu bazu sa primenjenim ` +
          `migracijama i NIKAD ne sme da radi nad bazom platforme.`,
      );
    }

    await prisma.wallet.upsert({
      where: { id: PROTOKOL },
      create: { id: PROTOKOL, type: WalletType.PROTOKOL, balance: 0 },
      update: {},
    });
    protokolPre = (await prisma.wallet.findUnique({ where: { id: PROTOKOL } }))!.balance;
  });

  afterAll(async () => {
    if (!IMA_BAZU) return;
    await prisma.$disconnect();
  });

  it("0 — polazno stanje je u ravnoteži", async () => {
    expect(await zbirSvihZapisa()).toBe(0);
  });

  it("1 — roditelj sa indeksom ispod praga ne može otvoriti nalog (čl. 5)", async () => {
    const { otvoriNalogDeteta } = await import("@/lib/protokol/deca");
    const r = await napraviKorisnika("RoditeljTest");
    roditeljId = r.id;

    await expect(
      otvoriNalogDeteta({
        roditeljId,
        pseudonim: "DeteTest",
        passwordHash: "x",
        datumRodjenja: new Date("2015-05-05T00:00:00.000Z"),
        memberHash: "detetst1",
      }),
    ).rejects.toThrow(/indeks stvarnosti/i);
  });

  it("2 🔴 — merodavan je INDEKS, ne broj potvrda: početni korisnik prolazi bez ijedne", async () => {
    // Osnivaču je indeks fiksno 100 iako ga formalno niko nije potvrdio — on je
    // ishodište lanca. Provera po broju potvrda bi zaustavila upravo onoga ko prvi
    // otvara naloge deci, pa se gleda samo indeks.
    const { otvoriNalogDeteta } = await import("@/lib/protokol/deca");
    const osnivac = await napraviKorisnika("Osnivac", {
      verified: true,
      tipKorisnika: TipKorisnika.NOSILAC_ZRNA,
      jeOsnivac: true,
      indeksStvarnosti: 100,
    });
    expect(await prisma.verifikacionaVeza.count({ where: { verifikovaniId: osnivac.id } })).toBe(0);

    const rez = await otvoriNalogDeteta({
      roditeljId: osnivac.id,
      pseudonim: "DeteOsnivaca",
      passwordHash: "x",
      datumRodjenja: new Date("2014-03-03T00:00:00.000Z"),
      memberHash: "osndete1",
    });
    // Nalog postoji, ali nema koga da se pita — nijedno izjašnjenje se ne kreira.
    expect(rez.brojPotvrdjivaca).toBe(0);
    expect(await prisma.roditeljstvoPotvrda.count({ where: { deteId: rez.id } })).toBe(0);
    expect(await zbirSvihZapisa()).toBe(0);
  });

  it("3 — dvoje ga potvrđuju kroz pravi lanac potvrda, zero-sum ostaje", async () => {
    const { izvrsiVerifikaciju, generisiTokenZaVerifikaciju } = await import(
      "@/lib/protokol/verifikacija-service"
    );
    const a = await napraviKorisnika("PotvrdjivacA", {
      verified: true,
      tipKorisnika: TipKorisnika.NOSILAC_ZRNA,
      jeOsnivac: true,
      indeksStvarnosti: 100,
    });
    const b = await napraviKorisnika("PotvrdjivacB", {
      verified: true,
      tipKorisnika: TipKorisnika.NOSILAC_ZRNA,
      jeOsnivac: true,
      indeksStvarnosti: 100,
    });
    potvrdjivacA = a.id;
    potvrdjivacB = b.id;

    await prisma.user.update({
      where: { id: roditeljId },
      data: { verified: false, tipKorisnika: TipKorisnika.NEVERIFIKOVAN, indeksStvarnosti: 0 },
    });
    // Ide punim putem: roditelj pokaže jednokratni kod, potvrđivač ga unese i
    // izričito potvrdi lično poznavanje. Skraćivanje bi zaobišlo baš ono što se
    // ovde proverava — da POEN nastaje i pada kroz stvarni kanal potvrde.
    const { token: t1 } = await generisiTokenZaVerifikaciju(roditeljId);
    await izvrsiVerifikaciju({ verifikatorId: potvrdjivacA, tokenIliBroj: t1, potvrdaPoznavanja: true });

    // 🔴 Prelazno ograničenje (čl. 22 Pravilnika o dokazu stvarnosti): dok opticaj ne
    // dostigne 100.000 POEN-a, korisnik prima NAJVIŠE JEDNU potvrdu. To znači da u
    // zatečenoj fazi sistema svaki roditelj ima tačno jednog potvrđivača — pa je
    // postupak iz čl. 6 Modula Deca u praksi izjašnjenje jednog čoveka, a njegovo
    // ćutanje roditelju obara indeks na nulu i oba naloga vodi u mirovanje.
    const { token: t2 } = await generisiTokenZaVerifikaciju(roditeljId);
    await expect(
      izvrsiVerifikaciju({ verifikatorId: potvrdjivacB, tokenIliBroj: t2, potvrdaPoznavanja: true }),
    ).rejects.toThrow(/samo jednu/i);

    // Preko praga: opticaj se diže zapisom koji čuva zero-sum (Protokol u minus,
    // korisnik u plus), pa se dalji tok proverava sa dva potvrđivača.
    const kasa = await napraviKorisnika("Kasa");
    const wKasa = await prisma.wallet.findUniqueOrThrow({ where: { userId: kasa.id } });
    await prisma.$transaction([
      prisma.wallet.update({ where: { id: PROTOKOL }, data: { balance: { decrement: 200_000 } } }),
      prisma.wallet.update({ where: { id: wKasa.id }, data: { balance: { increment: 200_000 } } }),
      prisma.transaction.create({
        data: { fromWalletId: PROTOKOL, toWalletId: wKasa.id, amount: 200_000, type: "TRANSFER" },
      }),
    ]);
    protokolPre -= 200_000;

    const { token: t3 } = await generisiTokenZaVerifikaciju(roditeljId);
    await izvrsiVerifikaciju({ verifikatorId: potvrdjivacB, tokenIliBroj: t3, potvrdaPoznavanja: true });

    const r = await prisma.user.findUnique({ where: { id: roditeljId } });
    expect(r!.verified).toBe(true);
    expect(r!.indeksStvarnosti).toBe(20);
    expect(await zbirSvihZapisa()).toBe(0);
  });

  it("4 — nalog deteta se otvara i ODMAH je aktivan, sa dva zapisa potvrde (čl. 4, 6)", async () => {
    const { otvoriNalogDeteta, ROK_POTVRDE_DANA } = await import("@/lib/protokol/deca");
    const rez = await otvoriNalogDeteta({
      roditeljId,
      pseudonim: "DeteTest",
      passwordHash: "x",
      datumRodjenja: new Date("2015-05-05T00:00:00.000Z"),
      memberHash: "detetst1",
    });
    deteId = rez.id;
    expect(rez.brojPotvrdjivaca).toBe(2);

    const dete = await prisma.user.findUnique({ where: { id: deteId } });
    expect(dete!.maloletan).toBe(true);
    expect(dete!.roditeljId).toBe(roditeljId);
    expect(dete!.dozvolaOdrasli).toBe(false);
    expect(dete!.tipKorisnika).toBe(TipKorisnika.NEVERIFIKOVAN);

    const potvrde = await prisma.roditeljstvoPotvrda.findMany({ where: { deteId } });
    expect(potvrde).toHaveLength(2);
    expect(potvrde.every((p) => p.status === "CEKA")).toBe(true);

    const dana = (potvrde[0].rokDo.getTime() - Date.now()) / 86_400_000;
    expect(Math.round(dana)).toBe(ROK_POTVRDE_DANA);
  });

  it("5 🔴 — otvaranje naloga NE emituje nijedan POEN (čl. 14 st. 1)", async () => {
    const protokol = await prisma.wallet.findUnique({ where: { id: PROTOKOL } });
    const dete = await prisma.wallet.findUnique({ where: { userId: deteId } });
    expect(dete!.balance).toBe(0);
    // Protokol je u minusu tačno za ono što su emitovale dve potvrde: 2×(1000+1000).
    expect(protokol!.balance).toBe(protokolPre - 4000);
  });

  it("6 🔴 — kanal doprinosa sadržaju preskače dete", async () => {
    const { zabeleziDoprinos } = await import("@/lib/protokol/doprinos-sadrzaju");
    const oglas = await prisma.marketplaceListing.create({
      data: {
        sellerId: deteId,
        tip: "PONUDA",
        title: "Bicikl",
        description: "Dobro očuvan dečji bicikl, vozio se dve sezone, gume nove.",
        category: "sport",
        images: ["a.jpg"],
        location: "Novi Sad",
      },
      select: { id: true },
    });

    const zabelezen = await zabeleziDoprinos(deteId, {
      id: oglas.id,
      tip: "PONUDA",
      title: "Bicikl",
      description: "Dobro očuvan dečji bicikl, vozio se dve sezone, gume nove.",
      category: "sport",
      location: "Novi Sad",
      images: ["a.jpg"],
    });

    expect(zabelezen).toBe(false);
    expect(await prisma.doprinosSadrzaju.count({ where: { userId: deteId } })).toBe(0);
  });

  it("7 — dečji oglas ne vidi gost, vidi ga roditelj, ne vidi ga tuđi punoletni", async () => {
    const { usloviVidljivostiOglasa, ucitajUcesnika } = await import("@/lib/protokol/deca");
    const broj = async (posmatrac: Awaited<ReturnType<typeof ucitajUcesnika>>) =>
      prisma.marketplaceListing.count({
        where: { status: "ACTIVE", sellerId: deteId, seller: usloviVidljivostiOglasa(posmatrac) },
      });

    expect(await broj(null)).toBe(0);
    expect(await broj(await ucitajUcesnika(roditeljId))).toBe(1);
    expect(await broj(await ucitajUcesnika(potvrdjivacA))).toBe(0);

    // Prekidač iz čl. 10 st. 2 otvara oglas i punoletnima.
    await prisma.user.update({ where: { id: deteId }, data: { dozvolaOdrasli: true } });
    expect(await broj(await ucitajUcesnika(potvrdjivacA))).toBe(1);
    await prisma.user.update({ where: { id: deteId }, data: { dozvolaOdrasli: false } });
  });

  it("8 — prvi potvrđivač se izjašnjava potvrdno", async () => {
    const { izjasniSe } = await import("@/lib/protokol/deca");
    const zapis = await prisma.roditeljstvoPotvrda.findFirstOrThrow({
      where: { deteId, potvrdjivacId: potvrdjivacA },
    });
    await izjasniSe(potvrdjivacA, zapis.id, "POTVRDIO");
    const posle = await prisma.roditeljstvoPotvrda.findUniqueOrThrow({ where: { id: zapis.id } });
    expect(posle.status).toBe("POTVRDIO");
    expect(posle.odgovorAt).not.toBeNull();
  });

  it("9 🔴 — drugom ističe rok: pada mu potvrda, POEN se ukida, slot se oslobađa", async () => {
    const { obradiIstekleRokove } = await import("@/lib/protokol/deca");
    const pre = await prisma.user.findUniqueOrThrow({ where: { id: potvrdjivacB } });
    const rezultat = await obradiIstekleRokove(new Date(Date.now() + 40 * 86_400_000));

    expect(rezultat.ponisteno).toBe(1);

    // Zapis prelazi u ISTEKLA, a onaj koji se izjasnio ostaje netaknut.
    const zapisi = await prisma.roditeljstvoPotvrda.findMany({ where: { deteId } });
    expect(zapisi.find((z) => z.potvrdjivacId === potvrdjivacB)!.status).toBe("ISTEKLA");
    expect(zapisi.find((z) => z.potvrdjivacId === potvrdjivacA)!.status).toBe("POTVRDIO");

    // Potvrda stvarnosti roditelja je pala — indeks mu se prepolovio.
    const roditelj = await prisma.user.findUniqueOrThrow({ where: { id: roditeljId } });
    expect(roditelj.indeksStvarnosti).toBe(10);
    const veze = await prisma.verifikacionaVeza.count({ where: { verifikovaniId: roditeljId } });
    expect(veze).toBe(1);

    // Slot mu se vratio (osnivač ima neograničen kapacitet, pa brojač ide na 0).
    const posle = await prisma.user.findUniqueOrThrow({ where: { id: potvrdjivacB } });
    expect(posle.slotoviPotroseni).toBeLessThanOrEqual(pre.slotoviPotroseni);

    expect(await zbirSvihZapisa()).toBe(0);
  });

  it("10 — izjašnjenje posle roka ne otklanja nastupelo poništenje (čl. 6 st. 4)", async () => {
    const { izjasniSe } = await import("@/lib/protokol/deca");
    const zapis = await prisma.roditeljstvoPotvrda.findFirstOrThrow({
      where: { deteId, potvrdjivacId: potvrdjivacB },
    });
    await expect(izjasniSe(potvrdjivacB, zapis.id, "POTVRDIO")).rejects.toThrow(/istekao/i);
  });

  it("11 — dete dobija POEN od roditelja, pa ga roditelj briše: sve se poništava", async () => {
    const { obrisiNalogDeteta } = await import("@/lib/protokol/deca");

    // Prepis roditelj → dete: zero-sum operacija, ne stvara nove zapise.
    const wR = await prisma.wallet.findUniqueOrThrow({ where: { userId: roditeljId } });
    const wD = await prisma.wallet.findUniqueOrThrow({ where: { userId: deteId } });
    await prisma.$transaction([
      prisma.wallet.update({ where: { id: wR.id }, data: { balance: { decrement: 500 } } }),
      prisma.wallet.update({ where: { id: wD.id }, data: { balance: { increment: 500 } } }),
      prisma.transaction.create({
        data: { fromWalletId: wR.id, toWalletId: wD.id, amount: 500, type: "TRANSFER" },
      }),
    ]);
    expect(await zbirSvihZapisa()).toBe(0);

    await obrisiNalogDeteta(roditeljId, deteId);

    const dete = await prisma.user.findUniqueOrThrow({ where: { id: deteId } });
    expect(dete.deaktiviranAt).not.toBeNull();
    expect(dete.maloletan).toBe(false);
    expect(dete.roditeljId).toBeNull();
    expect(dete.pseudonim.startsWith("obrisani-korisnik-")).toBe(true);

    const zapisDeteta = await prisma.wallet.findUniqueOrThrow({ where: { userId: deteId } });
    expect(zapisDeteta.balance).toBe(0);

    const oglasi = await prisma.marketplaceListing.findMany({ where: { sellerId: deteId } });
    expect(oglasi.every((o) => o.uklonjenAt !== null && o.status === "UKLONJEN")).toBe(true);

    expect(await zbirSvihZapisa()).toBe(0);
  });

  it("12 — tuđe dete se ne dodiruje: pogrešan roditelj dobija 404, ne 403", async () => {
    const { mojeDeteIliBaci } = await import("@/lib/protokol/deca");
    const drugi = await napraviKorisnika("TudjRoditelj");
    await expect(mojeDeteIliBaci(drugi.id, deteId)).rejects.toMatchObject({ status: 404 });
  });
});

/**
 * Prijava maloletnog korisnika (Modul Deca, čl. 4).
 *
 * Maloletni korisnik nema imejl — nalog mu otvara roditelj i predaje mu lozinku.
 * Do ove provere prijava je tražila isključivo imejl, pa je detetov nalog postojao
 * a nije mogao da se otvori. Ovaj test to zaključava.
 */
describe.skipIf(!IMA_BAZU)("Prijava pseudonimom", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function prijava(unos: string, lozinka: string, req: unknown = {}): Promise<any> {
    const { authOptions } = await import("@/lib/auth");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provajder = authOptions.providers.find((p: any) => p.id === "credentials") as any;
    // 🔴 `provajder.authorize` je STUB koji NextAuth uvek postavlja i koji uvek vraća
    // null; prava funkcija stoji pod `options`. Poziv stuba prolazi kao „pogrešna
    // lozinka" i test bi ćutke prolazio ne proveravajući ništa.
    return provajder.options.authorize({ email: unos, password: lozinka }, req as never);
  }

  it("dete se prijavljuje pseudonimom i lozinkom", async () => {
    const bcrypt = (await import("bcryptjs")).default;
    const hash = await bcrypt.hash("tajna-lozinka", 10);
    const d = await napraviKorisnika("PrijavaDete", { passwordHash: hash, maloletan: true });

    const uspeh = await prijava("PrijavaDete", "tajna-lozinka");
    expect(uspeh?.id).toBe(d.id);

    // Veličina slova ne sme da smeta — pseudonim se traži bez obzira na nju.
    expect((await prijava("prijavadete", "tajna-lozinka"))?.id).toBe(d.id);
    expect(await prijava("PrijavaDete", "pogresna")).toBeNull();
  });

  it("i punoletni nalog se otvara pseudonimom, i dalje i imejlom", async () => {
    const bcrypt = (await import("bcryptjs")).default;
    const hash = await bcrypt.hash("tajna-lozinka", 10);
    await napraviKorisnika("PrijavaOdrastao", {
      passwordHash: hash,
      email: "odrastao@example.com",
    });

    expect((await prijava("PrijavaOdrastao", "tajna-lozinka"))?.pseudonim).toBe("PrijavaOdrastao");
    expect((await prijava("odrastao@example.com", "tajna-lozinka"))?.pseudonim).toBe(
      "PrijavaOdrastao",
    );
  });

  it("🔴 tuđi pokušaji ne zaključavaju prijavu vlasniku naloga", async () => {
    // Pseudonim je javan, pa bi brojač vezan samo za nalog dao svakome polugu da
    // tuđu prijavu obori na petnaest minuta. Brojač zato nosi i adresu sa koje se
    // pokušava — napadačevih deset pokušaja troše njegovu kvotu, ne vlasnikovu.
    const bcrypt = (await import("bcryptjs")).default;
    const hash = await bcrypt.hash("tajna-lozinka", 10);
    const zrtva = await napraviKorisnika("Zrtva", { passwordHash: hash });

    const napadac = { headers: { "x-forwarded-for": "203.0.113.7" } };
    for (let i = 0; i < 12; i++) {
      await prijava("Zrtva", "pogresna", napadac);
    }

    const vlasnik = { headers: { "x-forwarded-for": "198.51.100.4" } };
    expect((await prijava("Zrtva", "tajna-lozinka", vlasnik))?.id).toBe(zrtva.id);
  });
});
