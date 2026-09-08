import { prisma } from "@/lib/prisma";
import { emitujPoen } from "./emisija";
import { VrstaDonacije } from "@/generated/prisma/client";
import { nivoPokroviteljstvaZaKumulativ } from "@/lib/donacija-pravila";

// Koeficijentni model, pragovi i minimum prijave žive u `donacija-pravila.ts`
// (bez Prisme, jer ih uvozi i ekran u pretraživaču). Ovde se re-eksportuju, pa
// server ima jedan ulaz — isti obrazac kao kod donacija.
export {
  KOEFICIJENT_POKROVITELJSTVA,
  MINIMUM_PRIJAVE_POKROVITELJSTVA,
  nivoPokroviteljstvaZaKumulativ,
  tabelaPokroviteljstvaZaPrikaz,
} from "@/lib/donacija-pravila";

/**
 * Evidentira doprinos pokrovitelja i emituje POEN vlasniku po KOEFICIJENTNOM
 * modelu (čl. 10, od 2026-09-08).
 *
 * 🔴 Do ove izmene je model bio fiksan bonus po nivou, uz zbir svih novodostignutih
 * nivoa. To je davalo dva kvara odjednom: do milion dinara pokroviteljstvo je
 * plaćalo 60–92% više po dinaru od lične donacije, a preko miliona ništa (tabela
 * je imala sedam nivoa i staja­la). Sada je koeficijent uvek tačno 20% veći od
 * koeficijenta donacije za isti kumulativ, i primenjuje se na CELU novu donaciju.
 *
 * 🔴 Već evidentiran POEN po ranijoj tabeli se NE poništava, a kumulativ se
 * prenosi i dalje služi kao osnov za nivo (prelazna odredba čl. 10).
 */
export async function evidentirajDoprinos(params: {
  pokroviteljId: string;
  rsdIznos: number;
  tip: VrstaDonacije;
  evidentiraoId: string;
  napomena?: string;
}) {
  const { pokroviteljId, rsdIznos, tip, evidentiraoId, napomena } = params;

  // Korak 1: DB transakcija
  const { noviNivoi, vlasnikWalletId } = await prisma.$transaction(async (tx) => {
    const pokrovitelj = await tx.pokrovitelj.findUniqueOrThrow({
      where: { id: pokroviteljId },
      include: { vlasnik: { include: { wallet: true } } },
    });

    const stariKumulativ = Number(pokrovitelj.rsdKumulativ);
    const noviKumulativ = stariKumulativ + rsdIznos;

    // Nivo se od sada IZVODI iz kumulativa (ne pamti se kao dostignuće koje ne
    // sme da opadne) — kumulativ ionako samo raste, pa je izvod jednoznačan.
    const { nivo: noviNivo, kurs } = nivoPokroviteljstvaZaKumulativ(noviKumulativ);
    const bonusPoen = Math.round(rsdIznos * kurs);

    await tx.pokroviteljDoprinos.create({
      data: {
        pokroviteljId,
        rsdIznos: rsdIznos,
        tip,
        evidentiraoId,
        napomena,
      },
    });

    await tx.pokrovitelj.update({
      where: { id: pokroviteljId },
      data: {
        rsdKumulativ: noviKumulativ,
        trenutniNivo: noviNivo,
      },
    });

    // Jedan zapis po doprinosu, ne po nivou — koeficijentni model nema „naplatu
    // preskočenih nivoa"; ceo iznos je već pomnožen koeficijentom.
    const noviNivoi: { nivo: number; bonusPoen: number; bonusId: string }[] = [];
    if (bonusPoen > 0) {
      const bonus = await tx.pokroviteljBonusEmisija.create({
        data: {
          pokroviteljId,
          vlasnikId: pokrovitelj.vlasnikId,
          nivo: noviNivo,
          bonusPoen,
        },
      });
      noviNivoi.push({ nivo: noviNivo, bonusPoen, bonusId: bonus.id });
    }

    return {
      noviNivoi,
      vlasnikWalletId: pokrovitelj.vlasnik.wallet!.id,
    };
  });

  // Korak 2: Emituj bonus POEN za dostignute nivoe
  const bonusiZbir = noviNivoi.reduce((s, n) => s + n.bonusPoen, 0);

  if (bonusiZbir > 0) {
    const { transaction } = await emitujPoen(
      vlasnikWalletId,
      bonusiZbir,
      "EMISIJA_POKROVITELJ",
      `Bonus za pokroviteljstvo iznos ${bonusiZbir.toLocaleString("sr-RS")}`, { kljuc: "transakcije.pokroviteljstvo", parametri: { iznos: bonusiZbir } }
    );

    // Poveži sve bonus zapise sa istom transakcijom
    for (const { bonusId } of noviNivoi) {
      await prisma.pokroviteljBonusEmisija.update({
        where: { id: bonusId },
        data: { transactionId: transaction.id },
      });
    }
  }

  return { noviNivoi };
}

/**
 * Auto-generisani tekst ugovora o donaciji (čl. 7–8). Ne sadrži odredbe o POEN-u.
 */
export function generisiUgovorTekst(p: {
  naziv: string;
  pib: string;
  vrstaDonacije: VrstaDonacije;
  vrednostRsd: number;
}): string {
  // Od 2026-09-08 pokroviteljstvo je isključivo NOVAC (čl. 6). `vrstaDonacije`
  // ostaje u potpisu zbog zatečenih prijava — enum nose istorijski zapisi.
  const datum = new Date().toLocaleDateString("sr-RS");
  return [
    "UGOVOR O DONACIJI",
    "",
    `Zaključen dana ${datum} između:`,
    `1) ${p.naziv}, PIB ${p.pib} (u daljem tekstu: Donator), i`,
    `2) KOLO Fondacije (u daljem tekstu: Primalac).`,
    "",
    `Član 1. Donator donira Primaocu novčani iznos od ${p.vrednostRsd.toLocaleString("sr-RS")} RSD.`,
    "Član 2. Donacija je dobrovoljna i bez naknade.",
    "Član 3. Ovaj ugovor ne sadrži odredbe o POENU niti o evidentiranju POENA.",
    "Član 4. Poreske obaveze koje proizlaze iz donacije snosi Donator u skladu sa važećim propisima.",
    "",
    "Potpisom korisnik potvrđuje da je ovlašćen da zastupa Donatora i da prihvata uslove ugovora.",
  ].join("\n");
}

/**
 * Potvrda prijema doprinosa (čl. 8). Pronalazi ili registruje pokrovitelja
 * (pravno lice ili preduzetnik) po PIB-u,
 * evidentira doprinos i emituje bonus POEN prema dostignutim nivoima (čl. 10).
 * Mora biti pozvana van prisma.$transaction (zbog emitujPoen).
 */
export async function potvrdiPrijavu(prijavaId: string, adminId: string) {
  const prijava = await prisma.pokroviteljPrijava.findUnique({ where: { id: prijavaId } });
  if (!prijava) throw new Error("Prijava nije pronađena.");
  if (prijava.status !== "POTPISANA")
    throw new Error("Samo potpisana prijava može biti potvrđena.");

  // Pronađi ili registruj pokrovitelja (pravno lice ili preduzetnik) po PIB-u
  let pokrovitelj = await prisma.pokrovitelj.findUnique({ where: { pib: prijava.pib } });
  if (!pokrovitelj) {
    pokrovitelj = await prisma.pokrovitelj.create({
      data: {
        naziv: prijava.naziv,
        pib: prijava.pib,
        vlasnikId: prijava.podnosilacId,
        kreiraoId: adminId,
      },
    });
  }

  const { noviNivoi } = await evidentirajDoprinos({
    pokroviteljId: pokrovitelj.id,
    rsdIznos: Number(prijava.vrednostRsd),
    tip: prijava.vrstaDonacije,
    evidentiraoId: adminId,
    napomena: `Prijava pokroviteljstva ${prijava.id}`,
  });

  await prisma.pokroviteljPrijava.update({
    where: { id: prijavaId },
    data: {
      status: "POTVRDJENA",
      pokroviteljId: pokrovitelj.id,
      potvrdioId: adminId,
      potvrdjenoAt: new Date(),
    },
  });

  const bonus = noviNivoi.reduce((s, n) => s + n.bonusPoen, 0);
  return { noviNivoi, bonus, vlasnikId: pokrovitelj.vlasnikId, pokroviteljId: pokrovitelj.id };
}

/**
 * Odbijanje prijave uz obrazloženje (čl. 8). Korisnik može podneti novu prijavu.
 */
export async function odbijPrijavu(prijavaId: string, adminId: string, razlog: string) {
  const prijava = await prisma.pokroviteljPrijava.findUnique({ where: { id: prijavaId } });
  if (!prijava) throw new Error("Prijava nije pronađena.");
  if (prijava.status === "POTVRDJENA" || prijava.status === "ODBIJENA")
    throw new Error("Prijava je već obrađena.");

  await prisma.pokroviteljPrijava.update({
    where: { id: prijavaId },
    data: { status: "ODBIJENA", odbijenoRazlog: razlog, potvrdioId: adminId },
  });

  return { podnosilacId: prijava.podnosilacId };
}
