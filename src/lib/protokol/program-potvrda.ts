/**
 * Verifikatorska potvrda socijalnih programa (anti-malverzacija).
 *
 * Prijava na socijalni program (Pravilnik o programima podrške čl. 4) zahteva:
 *  - indeks stvarnosti 100% (10 verifikacija);
 *  - izričit pristanak korisnika da njegovi verifikatori budu zamoljeni da potvrde
 *    ispunjenost uslova;
 *  - potvrdu SVIH verifikatora pod punom odgovornošću, na osnovu ličnog poznavanja
 *    osobe — verifikatori NEMAJU uvid u osetljive prijavljene podatke. Odbijanje
 *    zahteva obrazloženje.
 *
 * Tvrda blokada: admin ne može da odobri prijavu dok svi verifikatori ne potvrde.
 */
import type { Prisma, PrismaClient } from "@/generated/prisma/client";

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
