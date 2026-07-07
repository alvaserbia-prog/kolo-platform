/**
 * Sinhronizacija keša zabranjene zone (tabela verification_zone) sa grafom
 * verifikacija (Pravilnik o dokazu stvarnosti v3.9.2, čl. 12).
 *
 * Izvor istine je VerifikacionaVeza — zona se u celosti deterministički izvodi
 * funkcijom recomputeZones (zona.ts). Poziva se ISKLJUČIVO unutar otvorene
 * transakcije, zajedno sa promenom grafa koju prati:
 *  - upis verifikacije → dopunska sinhronizacija (samo unije, monotono);
 *  - poništavanje / kaskada / prestanak statusa → puna zamena (unija nije
 *    invertibilna, pa se preračunava od nule iz preostalog grafa).
 */
import { Prisma } from "@/generated/prisma/client";
import { recomputeZones, zonaParovi, ZonaStanje, ZonaZapis } from "./zona";

/** Učitaj graf i skup početnih korisnika unutar transakcije. */
export async function ucitajGrafIZone(tx: Prisma.TransactionClient): Promise<{
  zapisi: ZonaZapis[];
  pocetniIds: Set<string>;
}> {
  const [veze, pocetni] = await Promise.all([
    tx.verifikacionaVeza.findMany({
      select: { verifikatorId: true, verifikovaniId: true, vremenskiZig: true },
      orderBy: { vremenskiZig: "asc" },
    }),
    tx.user.findMany({ where: { jeOsnivac: true }, select: { id: true } }),
  ]);
  return {
    zapisi: veze,
    pocetniIds: new Set(pocetni.map((p) => p.id)),
  };
}

/**
 * Dopunska sinhronizacija posle UPISA verifikacije: upisuje kompletno
 * preračunato stanje sa skipDuplicates (ON CONFLICT DO NOTHING). Pošto je zona
 * pri upisu monotona (samo unije), nema šta da se briše; upis punog stanja
 * umesto delte čini keš samoisceljujućim — svaka verifikacija dopuni i redove
 * koji bi eventualno nedostajali (npr. pre inicijalnog backfill-a).
 */
export async function dopuniZonuPosleUpisa(
  tx: Prisma.TransactionClient,
  stanje: ZonaStanje
): Promise<number> {
  const parovi = zonaParovi(stanje);
  if (parovi.length === 0) return 0;
  const rez = await tx.verifikacionaZona.createMany({
    data: parovi,
    skipDuplicates: true,
  });
  return rez.count;
}

/**
 * Puna rekomputacija keša od nule iz trenutnog grafa: briše sve redove i
 * upisuje sveže preračunato stanje. Koristi se posle poništavanja lažne
 * verifikacije (čl. 19–20), prestanka statusa (čl. 16) i za inicijalni
 * backfill/migraciju.
 */
export async function preracunajZoneUBazi(
  tx: Prisma.TransactionClient
): Promise<{ parova: number; zapisa: number }> {
  const { zapisi, pocetniIds } = await ucitajGrafIZone(tx);
  const stanje = recomputeZones(zapisi, pocetniIds);
  const parovi = zonaParovi(stanje);
  await tx.verifikacionaZona.deleteMany({});
  if (parovi.length > 0) {
    await tx.verifikacionaZona.createMany({ data: parovi, skipDuplicates: true });
  }
  return { parova: parovi.length, zapisa: zapisi.length };
}
