/**
 * Vađenje jednog naloga iz lanca potvrda — sa svim posledicama po druge ljude.
 *
 * Padaju SVE veze koje nalog dodiruje, i primljene i obavljene. POEN evidentiran
 * povodom njih vraća se Protokolu (nikad ispod nule — čl. 14 st. 3), indeks druge
 * strane se preračunava, verifikatoru se oslobađa slot, a keš zabranjene zone se
 * računa od nule. Isti postupak kao pri prestanku statusa (čl. 34).
 *
 * 🔴 Ovo NIJE utvrđenje lažne potvrde. Tamo se ceni po čoveku i vodi postupak iz
 * Glave VIII dokaza stvarnosti (`lazna-verifikacija.ts`); ovde se nalog samo
 * uklanja iz grafa, bez ijednog utvrđenja o bilo čijem ponašanju. Zato ovu
 * funkciju zovu samo administrativne radnje nad celim nalogom — vraćanje naloga
 * na dan registracije i prevođenje naloga u maloletni.
 */
import { prisma } from "@/lib/prisma";
import { TipKorisnika } from "@/generated/prisma/client";
import {
  POEN_NADZORNIK,
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
  izracunajIndeks,
  zasticeniIndeks,
} from "@/lib/protokol/dokaz-stvarnosti";
import { preracunajZoneUBazi } from "@/lib/protokol/zona-sinhronizacija";

const PROTOKOL_WALLET_ID = "banka-singleton";

export type IshodObaranja = {
  /** Broj palih veza — i onih koje je nalog dao i onih koje je primio. */
  ponisteno: number;
  /** POEN skinut DRUGIM korisnicima (verifikovanima, verifikatorima, nadzornicima). */
  poenVracenOdDrugih: number;
};

/**
 * Obori sve potvrde stvarnosti koje nalog dodiruje.
 *
 * Ne dira sam nalog — pozivalac odlučuje šta radi sa njegovim tipom, indeksom i
 * slotovima, jer se to razlikuje od radnje do radnje.
 */
export async function oboriVerifikacijeNaloga(userId: string): Promise<IshodObaranja> {
  const vezeKaoVerifikator = await prisma.verifikacionaVeza.findMany({
    where: { verifikatorId: userId },
  });
  const vezeKaoVerifikovani = await prisma.verifikacionaVeza.findMany({
    where: { verifikovaniId: userId },
  });
  const ponisteno = vezeKaoVerifikator.length + vezeKaoVerifikovani.length;
  let poenVracenOdDrugih = 0;

  if (ponisteno === 0) {
    // Zona se i tako ne menja kad nijedna veza nije pala.
    return { ponisteno, poenVracenOdDrugih };
  }

  await prisma.$transaction(
    async (tx) => {
      /** Skida POEN sa tuđeg zapisa i vraća ga Protokolu; nikad ispod nule. */
      async function vratiPoenProtokolu(targetUserId: string, iznos: number) {
        if (iznos <= 0) return;
        const w = await tx.wallet.findUnique({ where: { userId: targetUserId } });
        if (!w) return;
        const stvarno = Math.min(w.balance, iznos);
        if (stvarno <= 0) return;
        await tx.wallet.update({ where: { id: w.id }, data: { balance: { decrement: stvarno } } });
        await tx.wallet.update({
          where: { id: PROTOKOL_WALLET_ID },
          data: { balance: { increment: stvarno } },
        });
        poenVracenOdDrugih += stvarno;
      }

      // 1) Veze u kojima je ovaj nalog VERIFIKATOR — pada verifikovani.
      for (const v of vezeKaoVerifikator) {
        await vratiPoenProtokolu(v.verifikovaniId, POEN_VERIFIKOVANI);
        if (v.podlezeNadzoru && v.nadzornikId && v.nadzorIshod === "UREDNO") {
          // Nadzornikovih 500 pada samo ako je ishod bio UREDNO (čl. 20a).
          await vratiPoenProtokolu(v.nadzornikId, POEN_NADZORNIK);
        }

        const ostalo = await tx.verifikacionaVeza.count({
          where: { verifikovaniId: v.verifikovaniId, id: { not: v.id } },
        });
        const pogodjeni = await tx.user.findUnique({
          where: { id: v.verifikovaniId },
          select: { jeOsnivac: true },
        });
        if (ostalo === 0 && !pogodjeni?.jeOsnivac) {
          await tx.user.update({
            where: { id: v.verifikovaniId },
            data: {
              tipKorisnika: TipKorisnika.NEVERIFIKOVAN,
              verified: false,
              verifiedAt: null,
              indeksStvarnosti: 0,
            },
          });
        } else {
          await tx.user.update({
            where: { id: v.verifikovaniId },
            data: {
              indeksStvarnosti: zasticeniIndeks(
                pogodjeni?.jeOsnivac ?? false,
                izracunajIndeks(ostalo),
              ),
            },
          });
        }
      }

      // 2) Veze u kojima je ovaj nalog VERIFIKOVANI — pada verifikator.
      for (const v of vezeKaoVerifikovani) {
        await vratiPoenProtokolu(v.verifikatorId, POEN_VERIFIKATOR);
        if (v.podlezeNadzoru && v.nadzornikId && v.nadzorIshod === "UREDNO") {
          await vratiPoenProtokolu(v.nadzornikId, POEN_NADZORNIK);
        }
        const verifikator = await tx.user.findUnique({
          where: { id: v.verifikatorId },
          select: { tipKorisnika: true, slotoviPotroseni: true },
        });
        if (verifikator?.tipKorisnika === TipKorisnika.REGULARNI && verifikator.slotoviPotroseni > 0) {
          await tx.user.update({
            where: { id: v.verifikatorId },
            data: { slotoviPotroseni: { decrement: 1 } },
          });
        }
      }

      // 3) Obriši veze (NadzorZapis i NadzorniPredmet padaju kaskadno).
      await tx.verifikacionaVeza.deleteMany({
        where: { OR: [{ verifikatorId: userId }, { verifikovaniId: userId }] },
      });
      // 4) Tuđe veze koje je ovaj nalog nadzirao ostaju — samo bez nadzornika.
      await tx.verifikacionaVeza.updateMany({
        where: { nadzornikId: userId },
        data: { nadzornikId: null },
      });

      // 5) Keš zabranjene zone se preračunava od nule — unija nije invertibilna.
      await preracunajZoneUBazi(tx);
    },
    { timeout: 30_000 },
  );

  return { ponisteno, poenVracenOdDrugih };
}
