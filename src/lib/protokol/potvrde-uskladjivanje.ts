/**
 * Jednokratno usklađivanje zatečenih potvrda sa pravilom iz dokaza stvarnosti čl. 7.
 *
 * Do seta 4.6.4 se POEN po potvrdi upisivao ODMAH, bez ijednog traga da je potvrđeni
 * išta doprineo. Ova radnja zatečene potvrde dovodi na isto pravilo koje od tog seta
 * važi za nove: ko nije ostvario nijedan doprinos, POEN mu se vraća u „zabeleženo" i
 * upisaće se kad uslov nastupi.
 *
 * 🔴 PRELAZNA RADNJA, NE TRAJAN INSTITUT. Sprovodi se jednom, dok sistem još nije
 * zvanično u radu — posle puštanja u rad ovakva ispravka bila bi znatno skuplja i
 * tražila bi drugačiji postupak.
 *
 * 🔴 POVLAČI SE NAJVIŠE DO NULE, nikad u minus (odluka vlasnika, varijanta 2). Ovo
 * nije sankcija nego usklađivanje: niko nije prekršio nijedno pravilo koje je tada
 * važilo. Zato se ne primenjuje ono što važi kod otpisa prijateljstva, poništenog
 * prepisa i prevoda u maloletni, gde minus postoji baš zato što je neko nešto skrivio.
 * 🟡 Poznata posledica: ko je POEN već potrošio prolazi bolje od onoga ko ga je
 * sačuvao. Prihvaćeno — vidi rečenicu iznad.
 *
 * 🔴 NADZORNIKOVIH 500 SE POVLAČE ISTO (odluka vlasnika, 16.09.2026). Od seta 4.6.5 i
 * ona čekaju isti uslov, samo imaju svoje stanje (`nadzorPoenStatus`), jer nastaju u
 * svom trenutku — pri upisu ishoda nadzora. Zato se i ovde proveravaju odvojeno: veza
 * ume da ima upisan POEN po potvrdi a nadzor koji čeka, i obrnuto.
 *
 * 🔴 USLOV SE MERI BLAGO, i to je namerno: računa se SVAKI evidentiran doprinos po
 * čl. 40a, bez obzira kojim je okidačem nastao. Zatečeni oglasi potvrđenih članova
 * nikad nisu prolazili kroz odobrenje, jer se ono tada nije tražilo — traženje
 * odobrenja unazad bilo bi kažnjavanje po pravilu koje u tom trenutku nije postojalo.
 * `dohvatiTragUcesca` upravo to i radi: gleda postojanje emisije, ne način nastanka.
 *
 * Radnja je DUGME, ne migracija: protivzapis mora kroz zapis transakcije (zero-sum i
 * revizijski trag), a pad opticaja je trenutak koji bira čovek — isti razlog iz kog je
 * `evidentirajZateceneVerifikovane` dugme.
 */
import { prisma } from "@/lib/prisma";
import { PotvrdaPoenStatus, TransactionType } from "@/generated/prisma/client";
import { POEN_NADZORNIK, POEN_VERIFIKATOR, POEN_VERIFIKOVANI } from "./dokaz-stvarnosti";
import { dohvatiTragUcesca, uslovPotvrde } from "./potvrda-poen";
import { PRAG_SKOK } from "./osnivacki";
import { logAdminAkcija } from "@/lib/audit";
import { obavesti } from "@/lib/notifikacije";

const PROTOKOL_WALLET_ID = "banka-singleton";

export type UskladjivanjeUcesnik = {
  id: string;
  pseudonim: string;
  uloga: "potvrdjivac" | "potvrdjeni" | "nadzornik";
  /** Stanje zapisa pre radnje. */
  stanje: number;
  /** Koliko bi mu stvarno bilo oduzeto (kapirano na nulu). */
  oduzeto: number;
  /** Koliko od njegovih 1.000 ne može da se pokrije — propada. */
  nepokriveno: number;
};

export type UskladjivanjeIshod = {
  sprovedeno: boolean;
  /** Sve potvrde kojima je POEN upisan. */
  ukupnoUpisanih: number;
  /** Od toga: koliko ostaje, jer potvrđeni ima trag učešća. */
  ostaje: number;
  /** Od toga: koliko se povlači u „zabeleženo". */
  povlaci: number;
  /** Zbir koji se stvarno poništava (posle kapiranja na nulu). */
  poenPonisten: number;
  /** Zbir koji bi se poništio da nema kapiranja — razlika pokazuje šta propada. */
  poenPunIznos: number;
  pogodjenihLjudi: number;
  opticajPre: number;
  opticajPosle: number;
  /** Prag osnivačkog koraka koji pad opticaja prelazi unazad, ako ga prelazi. */
  osnivackiPragPredjen: number | null;
  ucesnici: UskladjivanjeUcesnik[];
};

async function opticaj(): Promise<number> {
  const w = await prisma.wallet.findUnique({
    where: { id: PROTOKOL_WALLET_ID },
    select: { balance: true },
  });
  return Math.abs(w?.balance ?? 0);
}

/**
 * Pregled ili sprovođenje — ISTA funkcija, jer dve odvojene računice se razilaze,
 * a čovek bi onda pritiskao dugme po brojevima koji ne važe.
 *
 * 🔴 Sprovođenje NE veruje snimku iz pregleda nego računa iznova: između dva klika
 * prolazi vreme i stanja se menjaju.
 */
export async function uskladiZatecenePotvrde(opcije: {
  suviHod: boolean;
  adminId?: string;
}): Promise<UskladjivanjeIshod> {
  const upisane = await prisma.verifikacionaVeza.findMany({
    // Veza ulazi u obradu ako je upisan bilo koji od tri iznosa po njoj.
    where: {
      OR: [
        { poenStatus: PotvrdaPoenStatus.EVIDENTIRAN },
        { nadzorPoenStatus: PotvrdaPoenStatus.EVIDENTIRAN },
      ],
    },
    select: {
      id: true,
      verifikatorId: true,
      verifikovaniId: true,
      poenStatus: true,
      nadzorPoenStatus: true,
      nadzornikId: true,
      nadzorIshod: true,
      podlezeNadzoru: true,
      nadzornik: { select: { pseudonim: true } },
      verifikator: { select: { pseudonim: true } },
      verifikovani: { select: { pseudonim: true } },
    },
    orderBy: { vremenskiZig: "asc" },
  });

  // Trag učešća se računa PO ČOVEKU, ne po vezi — jedan potvrđeni ume da ima više
  // primljenih potvrda, a upit nad istorijom je isti za sve njih.
  const tragPoKorisniku = new Map<string, boolean>();
  for (const v of upisane) {
    if (tragPoKorisniku.has(v.verifikovaniId)) continue;
    const trag = await dohvatiTragUcesca(v.verifikovaniId);
    tragPoKorisniku.set(v.verifikovaniId, uslovPotvrde(trag) !== null);
  }

  const zaPovlacenje = upisane.filter((v) => tragPoKorisniku.get(v.verifikovaniId) === false);

  // Stanja svih pogođenih, jednim upitom. Kapiranje se računa KUMULATIVNO: čovek sa
  // dve potvrde koje padaju ne sme da vrati više nego što na zapisu ima.
  const idevi = new Set<string>();
  for (const v of zaPovlacenje) {
    if (v.poenStatus === PotvrdaPoenStatus.EVIDENTIRAN) {
      idevi.add(v.verifikatorId);
      idevi.add(v.verifikovaniId);
    }
    if (v.nadzorPoenStatus === PotvrdaPoenStatus.EVIDENTIRAN && v.nadzornikId) {
      idevi.add(v.nadzornikId);
    }
  }
  const walleti = await prisma.wallet.findMany({
    where: { userId: { in: [...idevi] } },
    select: { userId: true, balance: true },
  });
  const preostalo = new Map<string, number>();
  for (const w of walleti) if (w.userId) preostalo.set(w.userId, Math.max(0, w.balance));
  const pocetnoStanje = new Map(preostalo);

  const ucesnici: UskladjivanjeUcesnik[] = [];
  let poenPonisten = 0;
  let poenPunIznos = 0;

  function obracunaj(
    userId: string,
    pseudonim: string,
    uloga: UskladjivanjeUcesnik["uloga"],
    iznos: number,
  ) {
    const raspolozivo = preostalo.get(userId) ?? 0;
    const oduzeto = Math.min(raspolozivo, iznos);
    preostalo.set(userId, raspolozivo - oduzeto);
    poenPonisten += oduzeto;
    poenPunIznos += iznos;
    ucesnici.push({
      id: userId,
      pseudonim,
      uloga,
      stanje: pocetnoStanje.get(userId) ?? 0,
      oduzeto,
      nepokriveno: iznos - oduzeto,
    });
    return oduzeto;
  }

  const planPoVezi = zaPovlacenje.map((v) => {
    const poenUpisan = v.poenStatus === PotvrdaPoenStatus.EVIDENTIRAN;
    const nadzorUpisan =
      v.nadzorPoenStatus === PotvrdaPoenStatus.EVIDENTIRAN && v.nadzornikId !== null;
    return {
      veza: v,
      poenUpisan,
      nadzorUpisan,
      odVerifikatora: poenUpisan
        ? obracunaj(v.verifikatorId, v.verifikator.pseudonim, "potvrdjivac", POEN_VERIFIKATOR)
        : 0,
      odVerifikovanog: poenUpisan
        ? obracunaj(v.verifikovaniId, v.verifikovani.pseudonim, "potvrdjeni", POEN_VERIFIKOVANI)
        : 0,
      odNadzornika: nadzorUpisan
        ? obracunaj(v.nadzornikId!, v.nadzornik?.pseudonim ?? "", "nadzornik", POEN_NADZORNIK)
        : 0,
    };
  });

  const pre = await opticaj();
  const posle = pre - poenPonisten;
  // Pad opticaja ne poništava već upaljene osnivačke korake — ali sledeći čeka da
  // opticaj ponovo naraste. Čovek to mora da vidi PRE nego što pritisne dugme.
  const pragPre = Math.floor(pre / PRAG_SKOK);
  const pragPosle = Math.floor(posle / PRAG_SKOK);
  const osnivackiPragPredjen = pragPosle < pragPre ? pragPre * PRAG_SKOK : null;

  const ishod: UskladjivanjeIshod = {
    sprovedeno: false,
    ukupnoUpisanih: upisane.length,
    ostaje: upisane.length - zaPovlacenje.length,
    povlaci: zaPovlacenje.length,
    poenPonisten,
    poenPunIznos,
    pogodjenihLjudi: new Set(ucesnici.map((u) => u.id)).size,
    opticajPre: pre,
    opticajPosle: posle,
    osnivackiPragPredjen,
    ucesnici,
  };

  if (opcije.suviHod) return ishod;

  // ── Sprovođenje ────────────────────────────────────────────────────────────
  for (const { veza, poenUpisan, nadzorUpisan, odVerifikatora, odVerifikovanog, odNadzornika } of planPoVezi) {
    await prisma.$transaction(async (tx) => {
      // Rezerviši prelaz — ako je u međuvremenu nešto otključalo pa opet oborilo,
      // uslovan update sprečava dvostruko povlačenje. Dva iznosa, dva stanja.
      let ista = 0;
      if (poenUpisan) {
        const v1 = await tx.verifikacionaVeza.updateMany({
          where: { id: veza.id, poenStatus: PotvrdaPoenStatus.EVIDENTIRAN },
          data: {
            poenStatus: PotvrdaPoenStatus.ZABELEZEN,
            poenEvidentiranAt: null,
            poenUslov: null,
            verifikatorTxId: null,
            verifikovaniTxId: null,
          },
        });
        ista += v1.count;
      }
      if (nadzorUpisan) {
        const v2 = await tx.verifikacionaVeza.updateMany({
          where: { id: veza.id, nadzorPoenStatus: PotvrdaPoenStatus.EVIDENTIRAN },
          data: {
            nadzorPoenStatus: PotvrdaPoenStatus.ZABELEZEN,
            nadzorPoenEvidentiranAt: null,
            nadzorTxId: null,
          },
        });
        ista += v2.count;
      }
      if (ista === 0) return;

      for (const [userId, iznos] of [
        [veza.verifikatorId, poenUpisan ? odVerifikatora : 0],
        [veza.verifikovaniId, poenUpisan ? odVerifikovanog : 0],
        [veza.nadzornikId ?? "", nadzorUpisan ? odNadzornika : 0],
      ] as const) {
        if (!userId) continue;
        if (iznos <= 0) continue;
        const w = await tx.wallet.findUnique({ where: { userId }, select: { id: true, balance: true } });
        if (!w) continue;
        const stvarno = Math.min(w.balance, iznos);
        if (stvarno <= 0) continue;
        await tx.wallet.update({ where: { id: w.id }, data: { balance: { decrement: stvarno } } });
        await tx.wallet.update({
          where: { id: PROTOKOL_WALLET_ID },
          data: { balance: { increment: stvarno } },
        });
        await tx.transaction.create({
          data: {
            fromWalletId: w.id,
            toWalletId: PROTOKOL_WALLET_ID,
            amount: stvarno,
            type: TransactionType.USKLADJIVANJE_POTVRDE,
            description: "Usklađivanje zatečene potvrde sa čl. 7 — POEN se vraća u zabeleženo",
            opisKljuc: "transakcije.uskladjivanje_potvrde",
          },
        });
      }
    });
  }

  // Javljanje ide POSLE upisa i po ČOVEKU, ne po vezi — ko je pogođen dvaput ne sme
  // da dobije dve poruke o istoj radnji.
  const poCoveku = new Map<string, number>();
  for (const u of ucesnici) poCoveku.set(u.id, (poCoveku.get(u.id) ?? 0) + u.oduzeto);
  for (const [userId, iznos] of poCoveku) {
    if (iznos <= 0) continue;
    try {
      await obavesti(userId, {
        tip: "potvrda_poen",
        kljuc: "notifikacije.potvrda_uskladjena",
        parametri: { iznos: iznos.toLocaleString("sr-RS") },
        naslov: "Doprinos po potvrdi vraćen u zabeleženo",
        tekst:
          `Pravilo je izmenjeno: POEN po potvrdi upisuje se kad potvrđeni član ostvari svoj prvi ` +
          `doprinos. Sa tvog zapisa je zato vraćeno ${iznos.toLocaleString("sr-RS")} POENA i stoji ` +
          `zabeleženo. Upisuje se čim uslov bude ispunjen.`,
        link: "/novcanik",
      });
    } catch (e) {
      console.error("[potvrde-usklađivanje] obaveštenje nije poslato", { userId, e });
    }
  }

  await logAdminAkcija(
    opcije.adminId ?? "sistem",
    "POTVRDE_USKLADJENE",
    undefined,
    `povučeno ${zaPovlacenje.length} potvrda, poništeno ${poenPonisten} POEN, pogođenih ${ishod.pogodjenihLjudi}`,
  );

  return { ...ishod, sprovedeno: true };
}
