/**
 * Prelazak maloletnog naloga u punoletni (Modul Deca, čl. 19) — noćni posao.
 *
 * Osamnaesti rođendan menja tri stvari, i sve tri se dešavaju istog dana:
 *
 *  1. **Poništava se POEN zarađen prijateljstvima** — broj živih isplaćenih
 *     prijateljstava × 500, i to NA OBE STRANE. Milica sa 30 takvih gubi 15.000, a
 *     svakom od tih 30 drugova se briše po 500. I ona i njeni drugovi smeju u
 *     minus, po istom pravilu nadoknade kao kod raskida.
 *  2. **Dete dobija potvrde stvarnosti od svojih roditelja** — dve, po jednu od
 *     svakog, ili jednu ako su oba u istom lancu potvrda. Nov punoletni nalog time
 *     ulazi sa već postojećim uporištem u mreži, umesto da počinje od nule.
 *  3. **Prijateljstva se brišu.** Bila su mehanizam dečjeg prostora; njihovo mesto
 *     zauzima lanac potvrda.
 *
 * ─── Zašto se POEN poništava ────────────────────────────────────────────────
 *
 * Uravnoteženje kanala. Prijateljstvo nosi 500 za trideset sekundi u istoj
 * prostoriji; potvrda stvarnosti nosi 1.000, ali traži da tvrdiš tuđi identitet i da
 * izgubiš sopstvenu potvrdu ako slažeš. Bez poništenja bi onaj ko krene sa 17 godina
 * odradio godinu jeftinog kanala, ušao u 18. sa zalihom, i povrh toga dobio ceo
 * skupi kanal — isti čovek, godina razlike, trajno drugačija pozicija.
 *
 * 🔴 SVE OSTALO OSTAJE. POEN koji je roditelj prepisao detetu i POEN dobijen u
 * razmeni sa drugom decom se ne diraju. Briše se tačno ono što je zarađeno
 * prijateljstvom, ništa više.
 */
import { prisma } from "@/lib/prisma";
import { obavesti } from "@/lib/notifikacije";
import { logAdminAkcija } from "@/lib/audit";
import { beogradskiDan } from "./obracunski-dan";
import {
  otpisiPrijateljuPriPunoletstvu,
  otpisiPunoletnom,
} from "./prijateljstva";
import { izvrsiVerifikacijuBezTokena } from "./verifikacija-service";
import {
  NAJAVA_PUNOLETSTVA_DANA,
  PRIJATELJSTVO_POEN,
  UZRAST_PUNOLETSTVO,
  datumPunoletstva,
  danaDoIsteka,
  jePunoletan,
  otpisPriPunoletstvu,
  vremeZaNajavuPunoletstva,
} from "@/lib/deca-pravila";

export type IshodPunoletstva = {
  pregledano: number;
  obradjeno: number;
  najavljeno: number;
};

/**
 * Jedan prolaz: prvo najave (mesec dana ranije), pa obrade (na sam dan i posle).
 *
 * Posao je idempotentan i nadoknađuje: `punoletstvoNajavaAt` i
 * `punoletstvoObradjenAt` čuvaju da se ni obaveštenje ni otpis ne ponove, a obrađuju
 * se SVI zatečeni slučajevi, ne samo današnji. Bez toga bi jedno preskočeno
 * pokretanje ostavilo osamnaestogodišnjaka u dečjem prostoru zauvek.
 */
export async function obradiPunoletstva(sada: Date = beogradskiDan()): Promise<IshodPunoletstva> {
  const kandidati = await prisma.user.findMany({
    where: {
      maloletan: true,
      deaktiviranAt: null,
      datumRodjenja: { not: null },
      punoletstvoObradjenAt: null,
    },
    select: {
      id: true,
      pseudonim: true,
      datumRodjenja: true,
      punoletstvoNajavaAt: true,
    },
  });

  let obradjeno = 0;
  let najavljeno = 0;

  for (const k of kandidati) {
    if (jePunoletan(k.datumRodjenja, sada)) {
      try {
        await prevediUPunoletni(k.id);
        obradjeno += 1;
      } catch (e) {
        console.error("[punoletstvo] Prelaz nije uspeo", k.id, e);
      }
      continue;
    }
    if (!k.punoletstvoNajavaAt && vremeZaNajavuPunoletstva(k.datumRodjenja, sada)) {
      try {
        await najaviPunoletstvo(k.id, k.pseudonim, k.datumRodjenja!, sada);
        najavljeno += 1;
      } catch (e) {
        console.error("[punoletstvo] Najava nije uspela", k.id, e);
      }
    }
  }

  return { pregledano: kandidati.length, obradjeno, najavljeno };
}

/**
 * Najava mesec dana ranije (čl. 19 st. 6) — detetu i SVAKOM njegovom prijatelju.
 *
 * Prijatelji se obaveštavaju zato što i njima odlazi po 500 POEN. Bez toga je
 * iznenađenje na najgorem mogućem mestu: čoveku nestane POEN, a nigde ne piše zašto.
 */
async function najaviPunoletstvo(
  deteId: string,
  pseudonim: string,
  datumRodjenja: Date,
  sada: Date
) {
  const prijateljstva = await prisma.prijateljstvo.findMany({
    where: { OR: [{ aId: deteId }, { bId: deteId }], raskinutAt: null, poenIsplacen: true },
    select: { aId: true, bId: true },
  });
  const iznos = otpisPriPunoletstvu(prijateljstva.length);
  const dana = danaDoIsteka(datumPunoletstva(datumRodjenja), sada);

  // Stub se upisuje PRE slanja — dva uporedna pokretanja ne smeju da pošalju dvaput,
  // a neposlato obaveštenje je manja šteta od poplave obaveštenja.
  const rezervisano = await prisma.user.updateMany({
    where: { id: deteId, punoletstvoNajavaAt: null },
    data: { punoletstvoNajavaAt: new Date() },
  });
  if (rezervisano.count === 0) return;

  await obavesti(deteId, {
    tip: "punoletstvo_najava",
    kljuc: "notifikacije.punoletstvo_najava",
    parametri: { dana, iznos, broj: prijateljstva.length },
    naslov: `Za ${dana} dana puniš ${UZRAST_PUNOLETSTVO}`,
    tekst:
      `Tog dana biće ti otpisano ${iznos.toLocaleString("sr-RS")} POEN iz ${prijateljstva.length} prijateljstava, ` +
      `a prijateljstva će biti zatvorena. Zauzvrat te potvrđuju roditelji i sam počinješ da potvrđuješ druge.`,
    link: "/prijatelji",
  }).catch(() => {});

  for (const p of prijateljstva) {
    const drugiId = p.aId === deteId ? p.bId : p.aId;
    await obavesti(drugiId, {
      tip: "punoletstvo_najava_prijatelj",
      kljuc: "notifikacije.punoletstvo_najava_prijatelj",
      parametri: { pseudonim, dana, iznos: PRIJATELJSTVO_POEN },
      naslov: "Prijatelj uskoro puni 18",
      tekst: `${pseudonim} za ${dana} dana puni ${UZRAST_PUNOLETSTVO}. Tada se vaše prijateljstvo zatvara i biće ti otpisano ${PRIJATELJSTVO_POEN} POEN.`,
      link: "/prijatelji",
    }).catch(() => {});
  }
}

/**
 * Sam prelaz. Redosled je bitan i nije proizvoljan:
 *
 *  1. otpis (dok se još zna koja su prijateljstva bila isplaćena),
 *  2. brisanje prijateljstava,
 *  3. prevođenje naloga u punoletni,
 *  4. potvrde od roditelja — TEK NA KRAJU, jer jezgro verifikacije odbija maloletni
 *     nalog kao metu i jer bi potvrda pre otpisa dala 1.000 POEN koji bi otpis odmah
 *     pojeo.
 */
async function prevediUPunoletni(deteId: string) {
  const dete = await prisma.user.findUnique({
    where: { id: deteId },
    select: {
      id: true,
      pseudonim: true,
      roditeljstvaKaoDete: { select: { roditeljId: true } },
    },
  });
  if (!dete) return;

  // Rezerviši prelaz — dva uporedna pokretanja ne smeju da otpišu dvaput.
  const rezervisano = await prisma.user.updateMany({
    where: { id: deteId, punoletstvoObradjenAt: null, maloletan: true },
    data: { punoletstvoObradjenAt: new Date() },
  });
  if (rezervisano.count === 0) return;

  // ── 1. Otpis (čl. 19 st. 2) ────────────────────────────────────────────────
  //
  // Broje se SAMO živa isplaćena prijateljstva. Ne broje se: raskinuta (njihovih 500
  // je već otpisano — inače bi isti POEN bio oduzet dvaput), prijateljstva sa braćom
  // i sestrama (nikad nisu nosila POEN) i prijateljstva na čekanju (druga strana
  // nikad nije postala aktivna). Sve tri grupe nosi jedno polje: `poenIsplacen`.
  const isplacena = await prisma.prijateljstvo.findMany({
    where: { OR: [{ aId: deteId }, { bId: deteId }], raskinutAt: null, poenIsplacen: true },
    select: { aId: true, bId: true },
  });
  const iznos = otpisPriPunoletstvu(isplacena.length);

  if (iznos > 0) {
    await otpisiPunoletnom(deteId, iznos, isplacena.length);
    for (const p of isplacena) {
      const drugiId = p.aId === deteId ? p.bId : p.aId;
      try {
        await otpisiPrijateljuPriPunoletstvu(drugiId, dete.pseudonim);
        await obavesti(drugiId, {
          tip: "punoletstvo_otpis_prijatelj",
          kljuc: "notifikacije.punoletstvo_otpis_prijatelj",
          parametri: { pseudonim: dete.pseudonim, iznos: PRIJATELJSTVO_POEN },
          naslov: "Prijatelj je postao punoletan",
          tekst: `${dete.pseudonim} je napunio/la ${UZRAST_PUNOLETSTVO} godina. Vaše prijateljstvo je zatvoreno i otpisano ti je ${PRIJATELJSTVO_POEN} POEN.`,
          link: "/prijatelji",
        }).catch(() => {});
      } catch (e) {
        console.error("[punoletstvo] Otpis prijatelju nije uspeo", drugiId, e);
      }
    }
  }

  // ── 2. i 3. Prijateljstva odlaze, nalog postaje punoletan (čl. 19 st. 1 i 4) ──
  await prisma.$transaction(async (tx) => {
    await tx.prijateljstvo.deleteMany({ where: { OR: [{ aId: deteId }, { bId: deteId }] } });
    await tx.prijateljToken.deleteMany({ where: { korisnikId: deteId } });
    await tx.roditeljPoziv.deleteMany({ where: { deteId } });
    // Veza sa roditeljem gubi dejstvo — punoletno lice nema roditeljski prekidač,
    // niti roditelj nad njim ima ijedno ovlašćenje iz čl. 10.
    await tx.roditeljstvo.deleteMany({ where: { deteId } });
    await tx.roditeljstvoPotvrda.deleteMany({ where: { deteId, status: "CEKA" } });
    await tx.user.update({
      where: { id: deteId },
      data: { maloletan: false, dozvolaOdrasli: false },
    });
  });

  // ── 4. Potvrde stvarnosti od roditelja (čl. 19 st. 3) ─────────────────────
  //
  // Svaka ide kroz redovno jezgro verifikacije, sa svim njegovim proverama. Druga
  // pada sama od sebe kad su roditelji u istom lancu potvrda (zabranjena zona) ili
  // dok traje prelazno ograničenje iz čl. 22 Pravilnika o dokazu stvarnosti — to je
  // upravo ono „ili jednu ako su oba u istom lancu potvrda", i nije greška.
  let potvrda = 0;
  for (const veza of dete.roditeljstvaKaoDete) {
    try {
      await izvrsiVerifikacijuBezTokena(veza.roditeljId, deteId);
      potvrda += 1;
    } catch (e) {
      console.warn("[punoletstvo] Potvrda roditelja nije upisana", veza.roditeljId, deteId, e);
    }
  }

  await obavesti(deteId, {
    tip: "punoletstvo",
    kljuc: "notifikacije.punoletstvo",
    parametri: { iznos, broj: isplacena.length, potvrda },
    naslov: "Nalog je prešao u punoletni",
    tekst:
      `Otpisano ti je ${iznos.toLocaleString("sr-RS")} POEN iz ${isplacena.length} prijateljstava, ` +
      `a upisano ti je ${potvrda} potvrda stvarnosti od roditelja. Od sada i sam/a potvrđuješ druge.`,
    link: "/verifikacija",
  }).catch(() => {});

  // Trag u revizijskom dnevniku: radnju izvodi sam sistem, pa je „admin" nalog koji
  // je obrađen — ovo je jedan od retkih ne-admin zapisa, kao i kanal doprinosa.
  await logAdminAkcija(
    deteId,
    "DETE_POSTALO_PUNOLETNO",
    deteId,
    `prijateljstava: ${isplacena.length}, otpisano: ${iznos} POEN, ` +
      `potvrda od roditelja: ${potvrda}/${dete.roditeljstvaKaoDete.length}`
  ).catch(() => {});
}

/** Koliko dana ostaje do punoletstva — za prikaz na profilu deteta. */
export function danaDoPunoletstva(datumRodjenja: Date | null, sada: Date): number | null {
  if (!datumRodjenja) return null;
  const dan = datumPunoletstva(datumRodjenja);
  if (dan.getTime() <= sada.getTime()) return 0;
  return danaDoIsteka(dan, sada);
}

export { NAJAVA_PUNOLETSTVA_DANA };
