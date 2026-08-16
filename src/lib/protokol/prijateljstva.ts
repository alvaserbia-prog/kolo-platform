/**
 * Prijateljstva maloletnih korisnika (Modul Deca).
 *
 * Deca se povezuju skeniranjem QR koda, uživo. Kod NEMA šestocifreni broj kao onaj
 * za potvrdu stvarnosti — broj se može izdiktirati telefonom, a QR se mora POKAZATI.
 * To je jedina brana koja traži da dvoje stvarno budu jedno pored drugog.
 *
 * 🔴 ZA SADA BEZ EMISIJE POEN-a. Zamisao je da svako prijateljstvo donese po 500
 * POEN obojici, ali to u dečji prostor uvodi kanal koji do sada nije postojao i
 * otvara put kojim se POEN izvlači: broj dece po roditelju nije ograničen (čl. 4
 * st. 3), pa jedan čovek otvori deset naloga, upari ih međusobno (45 parova =
 * 45.000 POEN) i prekidačem iz čl. 10 prepiše sve sebi. Emisija ide tek uz ograde
 * o kojima odlučuje vlasnik i uz izmenu čl. 14 st. 1.
 */
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * Koliko traje kod za povezivanje.
 *
 * Kratko namerno: kod koji živi satima može da se fotografiše i iskoristi daleko od
 * deteta, čime se gubi jedini uslov — da se vide uživo.
 */
export const TOKEN_VAZI_SEKUNDI = 5 * 60;

export class PrijateljGreska extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Par se uvek čuva sortirano, pa jedinstveni indeks pokriva oba smera. */
function par(x: string, y: string): [string, string] {
  return x < y ? [x, y] : [y, x];
}

/** Generiše jednokratni kod za povezivanje. Stari kodovi istog deteta se poništavaju. */
export async function generisiToken(korisnikId: string) {
  const dete = await prisma.user.findUnique({
    where: { id: korisnikId },
    select: { maloletan: true },
  });
  if (!dete?.maloletan) throw new PrijateljGreska("Ova mogućnost je za decu.", 403);

  // Jedan živ kod po detetu — inače bi svaki prikaz ekrana ostavljao još jedan
  // upotrebljiv kod za sobom.
  await prisma.prijateljToken.updateMany({
    where: { korisnikId, iskoriscen: false },
    data: { iskoriscen: true },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const zapis = await prisma.prijateljToken.create({
    data: {
      token,
      korisnikId,
      expiresAt: new Date(Date.now() + TOKEN_VAZI_SEKUNDI * 1000),
    },
    select: { token: true, expiresAt: true },
  });
  return zapis;
}

/**
 * Povezuje dvoje dece na osnovu skeniranog koda.
 *
 * Obe strane moraju biti maloletne: prijateljstvo je odnos unutar dečjeg prostora,
 * a odnos deteta i punoletnog korisnika uređuje prekidač iz čl. 10, ne ovo.
 */
export async function poveziPoTokenu(skenerId: string, token: string) {
  const zapis = await prisma.prijateljToken.findUnique({
    where: { token },
    select: { korisnikId: true, expiresAt: true, iskoriscen: true },
  });
  if (!zapis || zapis.iskoriscen || zapis.expiresAt < new Date()) {
    throw new PrijateljGreska("Kod nije važeći. Zamoli druga da pokaže nov.", 400);
  }
  if (zapis.korisnikId === skenerId) {
    throw new PrijateljGreska("To je tvoj kod.", 400);
  }

  const [a, b] = await Promise.all([
    prisma.user.findUnique({
      where: { id: skenerId },
      select: { id: true, maloletan: true, pseudonim: true, deaktiviranAt: true },
    }),
    prisma.user.findUnique({
      where: { id: zapis.korisnikId },
      select: { id: true, maloletan: true, pseudonim: true, deaktiviranAt: true },
    }),
  ]);
  if (!a || !b || a.deaktiviranAt || b.deaktiviranAt) {
    throw new PrijateljGreska("Kod nije važeći.", 400);
  }
  if (!a.maloletan || !b.maloletan) {
    throw new PrijateljGreska("Prijatelji se dodaju samo među decom.", 403);
  }

  const [aId, bId] = par(a.id, b.id);
  try {
    await prisma.$transaction([
      prisma.prijateljstvo.create({ data: { aId, bId } }),
      prisma.prijateljToken.update({ where: { token }, data: { iskoriscen: true } }),
    ]);
  } catch (e) {
    // P2002 = već ste prijatelji. Kod se ipak troši, da se isti QR ne vrti u krug.
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      await prisma.prijateljToken.update({ where: { token }, data: { iskoriscen: true } });
      throw new PrijateljGreska(`Već ste prijatelji sa ${b.pseudonim}.`, 409);
    }
    throw e;
  }

  return { pseudonim: b.pseudonim };
}

/** Spisak prijatelja i njihov broj. */
export async function dohvatiPrijatelje(korisnikId: string) {
  const redovi = await prisma.prijateljstvo.findMany({
    where: { OR: [{ aId: korisnikId }, { bId: korisnikId }] },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      a: { select: { id: true, pseudonim: true, avatar: true, deaktiviranAt: true } },
      b: { select: { id: true, pseudonim: true, avatar: true, deaktiviranAt: true } },
    },
  });

  const prijatelji = redovi
    .map((r) => (r.a.id === korisnikId ? r.b : r.a))
    // Ugašen nalog ispada iz spiska, ali se red ne briše — prijateljstvo je bilo.
    .filter((p) => !p.deaktiviranAt)
    .map((p) => ({ id: p.id, pseudonim: p.pseudonim, avatar: p.avatar }));

  return { broj: prijatelji.length, prijatelji };
}

/** Da li su dvoje prijatelji — koristi se za vidljivost u dečjoj sobi. */
export async function suPrijatelji(x: string, y: string): Promise<boolean> {
  const [aId, bId] = par(x, y);
  return (await prisma.prijateljstvo.count({ where: { aId, bId } })) > 0;
}
