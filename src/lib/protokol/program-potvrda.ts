/**
 * Verifikatorska potvrda socijalnih programa (anti-malverzacija).
 *
 * Prijava na socijalni program (Pravilnik o programima podrške čl. 4) zahteva:
 *  - indeks stvarnosti od najmanje 10% (jedna primljena potvrda; do seta 4.3.1
 *    tražen je pun indeks od 100%);
 *  - izričit pristanak korisnika da njegovi verifikatori budu zamoljeni da potvrde
 *    ispunjenost uslova;
 *  - potvrdu SVIH verifikatora pod punom odgovornošću, na osnovu ličnog poznavanja
 *    osobe — verifikatori NEMAJU uvid u osetljive prijavljene podatke. Odbijanje
 *    zahteva obrazloženje.
 *
 * Tvrda blokada: admin ne može da odobri prijavu dok svi verifikatori ne potvrde.
 */
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Ključ obaveštenja kojim se od verifikatora traži potvrda socijalnog programa.
 * Deljen između rute koja ga šalje i `zatvoriPostupakPotvrda`, koja ga po
 * okončanju postupka briše — i zaključan testom, da se ne raziđu.
 */
export const KLJUC_ZAHTEV_POTVRDA = "notifikacije.zahtev_potvrda_programa";

type TxLike = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Vraća listu jedinstvenih verifikatora (id) koji su verifikovali datog korisnika.
 * Pri indeksu 100% biće ih 10 (10 verifikacija = 10 različitih verifikatora,
 * pošto anti-cirkularno pravilo zabranjuje da isti verifikator verifikuje dvaput).
 */
export async function dohvatiVerifikatore(
  tx: TxLike,
  korisnikId: string
): Promise<string[]> {
  const veze = await tx.verifikacionaVeza.findMany({
    where: { verifikovaniId: korisnikId },
    select: { verifikatorId: true },
  });
  return [...new Set(veze.map((v) => v.verifikatorId))];
}

/**
 * Kreira po jednu potvrdu (CEKA) za svakog verifikatora prijavljenog korisnika.
 * Vraća listu verifikatora kojima treba poslati notifikaciju.
 */
export async function kreirajPotvrde(
  tx: TxLike,
  enrollmentId: string,
  verifikatorIds: string[]
): Promise<void> {
  if (verifikatorIds.length === 0) return;
  const data: Prisma.ProgramPotvrdaCreateManyInput[] = verifikatorIds.map(
    (verifikatorId) => ({ enrollmentId, verifikatorId })
  );
  await tx.programPotvrda.createMany({ data, skipDuplicates: true });
}

/**
 * Zatvori postupak potvrda za prijavu: briše nedovršene (CEKA) potvrde i SVA
 * obaveštenja kojima je od verifikatora tražena potvrda te prijave.
 *
 * 🔴 Zove se pri SVAKOM okončanju postupka — odobrenju, odbijanju (i od strane
 * Fondacije i od strane verifikatora), obustavi i povlačenju pristanka. Bez toga
 * podatak o tome za koji se program neko prijavio ostaje verifikatorima u zvoncetu
 * i u spisku zahteva zauvek, iako postupka više nema; naziv programa otkriva
 * pripadnost posebnoj kategoriji podataka (čl. 4 st. 3, DPIA R11), pa je to
 * obrada koja traje bez svrhe.
 *
 * Nedovršene potvrde se BRIŠU, ne označavaju: bez odgovora nemaju dokaznu
 * vrednost, a odgovorene (POTVRDJENO/ODBIJENO) ostaju — one su trag ko je i šta
 * potvrdio pod punom odgovornošću.
 *
 * 🟡 Obaveštenja poslata pre uvođenja `enrollmentId` u parametre nemaju po čemu
 * da se pogode i ostaju u zvoncetu.
 */
export async function zatvoriPostupakPotvrda(enrollmentId: string): Promise<void> {
  await prisma.programPotvrda.deleteMany({ where: { enrollmentId, status: "CEKA" } });
  await prisma.notifikacija.deleteMany({
    where: {
      kljuc: KLJUC_ZAHTEV_POTVRDA,
      parametri: { path: ["enrollmentId"], equals: enrollmentId },
    },
  });
}
