import { prisma } from "@/lib/prisma";
import { TransactionType, UserStatus } from "@/generated/prisma/client";
import {
  POEN_NADZORNIK,
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
  izracunajIndeks,
  zasticeniIndeks,
} from "./dokaz-stvarnosti";
import { podelaTereta } from "./nadoknada";
import { preracunajZoneUBazi } from "./zona-sinhronizacija";
import { jeSuperadmin } from "@/lib/dozvole";

const PROTOKOL_WALLET_ID = "banka-singleton";

export class LaznaVerifikacijaGreska extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type Nadoknada = { userId: string; pseudonim: string; iznos: number };

export type PonistavanjeRezultat = {
  /** Pseudonim naloga nad kojim je radnja izvršena (nalog ili verifikovani iz veze). */
  pseudonim: string;
  ponistenoVerifikacija: number;
  /** Korisnici kojima je indeks umanjen — njima ide obaveštenje. */
  pogodjeniKorisnici: string[];
  /** Verifikatori kojima je nastala nadoknada (negativan zapis), radi obaveštenja. */
  nadoknade: Nadoknada[];
};

/**
 * Poništavanje lažne verifikacije (Pravilnik o dokazu stvarnosti 4.2.0, Glava VIII).
 *
 * 🔴 ŠTA SE PROMENILO U 4.2.0 — ne vraćati na staro:
 *
 *  1. LAŽNOST SE CENI PO ČOVEKU, NE PO VERIFIKATORU (čl. 19). Do 4.2.0 je utvrđenje
 *     jedne lažne verifikacije obaralo SVE verifikacije tog verifikatora, a kod je
 *     išao i dalje od norme — BFS je gurao svakog pogođenog u red bez ijedne provere
 *     i čistio celo podstablo. Stvarni ljudi su gubili status zbog tuđe radnje.
 *     Sada se poništava samo utvrđena verifikacija; ostale se preispituju.
 *
 *  2. KASKADA IDE KROZ NEPOSTOJANJE (čl. 20). Nalog za koji je Upravni odbor utvrdio
 *     da iza njega ne stoji stvarna osoba nikoga ne može poznavati, pa padaju sve
 *     verifikacije koje ga dodiruju — i primljene i obavljene. Kaskada se zaustavlja
 *     na prvom nalogu koji NIJE tako označen. Farma lažnih naloga pada tako što se
 *     označi svaki njen član; nijedan stvaran čovek ne biva pokošen usput.
 *
 *  3. PONIŠTAVA SE SAMO ONO ŠTO JE VERIFIKACIJOM NASTALO (čl. 20a). POEN iz razmene,
 *     operativnog doprinosa ili donacije se NE dira; upućivanje na čl. 34 Pravilnika,
 *     koje je brisalo celu istoriju uključujući nepovratne donacije, je iseceno.
 *
 *  4. NADZORNI POEN PADA SAMO UZ ISHOD „UREDNO" (čl. 20a st. 2). Ko je sumnju prijavio
 *     i pokazao se u pravu, zadržava svojih 500 — inače bi ga sopstvena ispravna
 *     prijava koštala.
 *
 *  5. U MINUS IDE SAMO VERIFIKATOR (čl. 20b, 20c). Verifikovani i nadzornik idu najviše
 *     do nule, nepokriveni deo prelazi na verifikatora kao nadoknada.
 *
 * Zero-sum je očuvan: svako poništenje ima tačan protivzapis Protokola, a prenos
 * nepokrivenog dela na verifikatora je običan prenos između dva zapisa.
 */

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/** Skida `iznos` sa zapisa korisnika u korist Protokola. Dozvoljava minus. */
async function uProtokol(tx: Tx, userId: string, iznos: number, opis: string) {
  if (iznos <= 0) return;
  const w = await tx.wallet.findUnique({ where: { userId } });
  if (!w) return;
  await tx.wallet.update({ where: { id: w.id }, data: { balance: { decrement: iznos } } });
  await tx.wallet.update({
    where: { id: PROTOKOL_WALLET_ID },
    data: { balance: { increment: iznos } },
  });
  await tx.transaction.create({
    data: {
      fromWalletId: w.id,
      toWalletId: PROTOKOL_WALLET_ID,
      amount: iznos,
      type: TransactionType.TRANSFER,
      description: opis,
    },
  });
}

/** Trenutno stanje zapisa korisnika (0 ako nema wallet). */
async function stanje(tx: Tx, userId: string): Promise<number> {
  const w = await tx.wallet.findUnique({ where: { userId }, select: { balance: true } });
  return w?.balance ?? 0;
}

/**
 * Poništi jednu verifikacionu vezu: povrat POEN-a iz kanala verifikacije,
 * nadoknada na verifikatoru, brisanje veze i preračun indeksa verifikovanog.
 *
 * Vraća listu nadoknada nastalih ovim poništenjem.
 */
async function ponistiVezu(
  tx: Tx,
  vezaId: string,
  pogodjeni: Set<string>,
  nadoknade: Map<string, number>
): Promise<void> {
  const v = await tx.verifikacionaVeza.findUnique({
    where: { id: vezaId },
    include: {
      verifikator: { select: { id: true, pseudonim: true } },
      verifikovani: { select: { id: true, pseudonim: true, jeOsnivac: true } },
    },
  });
  if (!v) return;

  const opis = `Poništavanje lažne verifikacije ${v.verifikator.pseudonim} → ${v.verifikovani.pseudonim} (čl. 20a)`;

  // 1. Verifikovani — najviše do nule; nepokriveni deo tereti verifikatora (čl. 20c st. 2).
  const podelaVerifikovani = podelaTereta(await stanje(tx, v.verifikovaniId), POEN_VERIFIKOVANI);
  await uProtokol(tx, v.verifikovaniId, podelaVerifikovani.saKorisnika, opis);

  // 2. Nadzornik — samo ako je ishod bio „uredno" (čl. 20a st. 2). Ko je evidentirao
  //    „za proveru" ili „sporno" zadržava svojih 500.
  let podelaNadzornik = { saKorisnika: 0, naVerifikatora: 0 };
  if (v.podlezeNadzoru && v.nadzornikId && v.nadzorIshod === "UREDNO") {
    podelaNadzornik = podelaTereta(await stanje(tx, v.nadzornikId), POEN_NADZORNIK);
    await uProtokol(tx, v.nadzornikId, podelaNadzornik.saKorisnika, opis);
  }

  // 3. Verifikator — pun iznos, bez ograničenja: on je jedini koji sme u minus.
  await uProtokol(tx, v.verifikatorId, POEN_VERIFIKATOR, opis);

  // 4. Nadoknada — nepokriveni delovi prelaze na verifikatora (čl. 20b st. 2).
  const teretVerifikatora = podelaVerifikovani.naVerifikatora + podelaNadzornik.naVerifikatora;
  if (teretVerifikatora > 0) {
    await uProtokol(
      tx,
      v.verifikatorId,
      teretVerifikatora,
      `Nadoknada za nepokriveni deo poništenja — ${v.verifikovani.pseudonim} (čl. 20b)`
    );
    nadoknade.set(
      v.verifikatorId,
      (nadoknade.get(v.verifikatorId) ?? 0) + teretVerifikatora
    );
  }

  // 5. Veza pada, pa se indeks verifikovanog preračunava iz PREOSTALIH veza ka njemu
  //    (korisnik može imati više verifikatora). Korisnik ostaje verifikovan i kad
  //    padne na 0% (čl. 17, čl. 20 st. 4). Indeks početnog je fiksno 100 (čl. 14).
  await tx.verifikacionaVeza.delete({ where: { id: vezaId } });
  const ostalo = await tx.verifikacionaVeza.count({
    where: { verifikovaniId: v.verifikovaniId },
  });
  await tx.user.update({
    where: { id: v.verifikovaniId },
    data: {
      indeksStvarnosti: zasticeniIndeks(
        v.verifikovani.jeOsnivac,
        izracunajIndeks(ostalo)
      ),
    },
  });
  pogodjeni.add(v.verifikovaniId);
}

async function skupiNadoknade(nadoknade: Map<string, number>): Promise<Nadoknada[]> {
  if (nadoknade.size === 0) return [];
  const korisnici = await prisma.user.findMany({
    where: { id: { in: [...nadoknade.keys()] } },
    select: { id: true, pseudonim: true },
  });
  return korisnici.map((k) => ({
    userId: k.id,
    pseudonim: k.pseudonim,
    iznos: nadoknade.get(k.id) ?? 0,
  }));
}

/**
 * Poništi JEDNU utvrđenu lažnu verifikaciju, bez kaskade (čl. 19).
 *
 * Koristi se kad je verifikovani korisnik stvarna osoba — verifikator je slagao o
 * poznavanju, jedinstvenosti ili kontinuitetu. Verifikovani gubi 10 procentnih poena
 * i POEN-e iz te verifikacije, ali zadržava status i sve svoje verifikacije, i može
 * ponovo biti verifikovan (čl. 20c).
 */
export async function ponistiVerifikaciju(
  verifikacijaId: string
): Promise<PonistavanjeRezultat> {
  const veza = await prisma.verifikacionaVeza.findUnique({
    where: { id: verifikacijaId },
    include: { verifikovani: { select: { pseudonim: true } } },
  });
  if (!veza) throw new LaznaVerifikacijaGreska("Verifikacija nije pronađena.", 404);

  const pogodjeni = new Set<string>();
  const nadoknade = new Map<string, number>();

  await prisma.$transaction(
    async (tx) => {
      await ponistiVezu(tx, verifikacijaId, pogodjeni, nadoknade);
      // Zabranjena zona nije zaseban zapis nego se izvodi iz važećih verifikacija
      // (čl. 12 st. 4). Unija nije invertibilna, pa se keš preračunava od nule —
      // bez toga bi poništenom verifikacijom ostao zatvoren deo mreže i pogođeni
      // korisnik ne bi mogao ponovo da bude verifikovan (čl. 20c st. 4).
      await preracunajZoneUBazi(tx);
    },
    { timeout: 30000 }
  );

  return {
    pseudonim: veza.verifikovani.pseudonim,
    ponistenoVerifikacija: 1,
    pogodjeniKorisnici: [...pogodjeni],
    nadoknade: await skupiNadoknade(nadoknade),
  };
}

/**
 * Utvrđenje da iza naloga ne stoji stvarna osoba, ili da nalog nije jedinstven
 * (čl. 18), i poništavanje svih verifikacija koje taj nalog dodiruju (čl. 20).
 *
 * Nalog koji ne postoji nikoga ne može poznavati, pa su i verifikacije koje je
 * obavio i one koje je primio lažne po prirodi stvari. Kaskada se ne prostire dalje:
 * korisnik kog je takav nalog verifikovao gubi samo tu vezu, a sopstvene verifikacije
 * zadržava. Farma se obara tako što se označi svaki njen član — pri svakom označavanju
 * padnu sve veze tog člana, pa redosled označavanja ne utiče na ishod.
 */
export async function ponistiNepostojeciNalog(
  userId: string
): Promise<PonistavanjeRezultat> {
  const nalog = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, pseudonim: true, admin: true, jeOsnivac: true },
  });
  if (!nalog) throw new LaznaVerifikacijaGreska("Korisnik nije pronađen.", 404);
  if (jeSuperadmin(nalog))
    throw new LaznaVerifikacijaGreska("Ne može se označiti administrator.", 400);

  const pogodjeni = new Set<string>();
  const nadoknade = new Map<string, number>();
  let ponisteno = 0;

  await prisma.$transaction(
    async (tx) => {
      const veze = await tx.verifikacionaVeza.findMany({
        where: { OR: [{ verifikatorId: userId }, { verifikovaniId: userId }] },
        select: { id: true },
        orderBy: { vremenskiZig: "asc" },
      });
      for (const v of veze) {
        await ponistiVezu(tx, v.id, pogodjeni, nadoknade);
        ponisteno++;
      }

      await tx.user.update({
        where: { id: userId },
        data: {
          utvrdjenNepostojeci: new Date(),
          status: UserStatus.EXCLUDED,
          suspendedAt: new Date(),
          suspendedReason:
            "Utvrđeno da iza naloga ne stoji stvarna osoba (Pravilnik o dokazu stvarnosti, čl. 18)",
          indeksStvarnosti: zasticeniIndeks(nalog.jeOsnivac, 0),
          slotoviPotroseni: 0,
        },
      });

      await preracunajZoneUBazi(tx);
    },
    { timeout: 60000 }
  );

  // Sam nalog ne treba da dobije obaveštenje o padu indeksa — isključen je.
  pogodjeni.delete(userId);

  return {
    pseudonim: nalog.pseudonim,
    ponistenoVerifikacija: ponisteno,
    pogodjeniKorisnici: [...pogodjeni],
    nadoknade: await skupiNadoknade(nadoknade),
  };
}
