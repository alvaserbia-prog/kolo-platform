/**
 * Prevođenje zatečenog punoletnog naloga u nalog maloletnog korisnika, uz
 * određivanje roditelja — administrativna ispravka koju sprovodi Fondacija.
 *
 * ─── Zašto postoji ──────────────────────────────────────────────────────────
 *
 * `maloletan` se inače upisuje na tačno dva mesta, oba pri stvaranju naloga:
 * kad roditelj otvori nalog iz svog profila (`deca.ts`) i kad se dete registruje
 * samo (`deca-poziv.ts`). Dete koje promaši dečji ulaz i prođe kroz punoletni
 * obrazac zato ostaje odrastao nalog zauvek: preuzimanje ga odbija
 * (`poveziRoditelja` traži `maloletan: true`), pa se ni roditelj ne može upisati.
 *
 * Posledice tog promašaja nisu simetrične — nalog gubi zaštite a dobija
 * ovlašćenja: profil mu je otvoren svakom potvrđenom članu (`smeDaVidiProfilDeteta`
 * gleda `maloletan`), izlazi u pretrazi korisnika, i može ući u lanac potvrda,
 * koji je maloletnom korisniku zabranjen (čl. 15 Pravilnika o učešću dece). Jedini
 * lek do sada bio je da se nalog ugasi i otvori ponovo.
 *
 * ─── Šta ovo radi, i zašto baš to ───────────────────────────────────────────
 *
 * Prevođenje je SMER SUPROTAN od punoletstva (`punoletstvo.ts`), pa mora da uradi
 * ono što bi punoletstvo poništilo:
 *
 *  1. **Nalog izlazi iz lanca potvrda** — padaju sve potvrde koje dodiruje, u oba
 *     smera, sa vraćanjem POEN-a Protokolu i preračunom tuđih indeksa i zona
 *     (`oboriVerifikacijeNaloga`). 🔴 Ovo NIJE utvrđenje lažne potvrde: niko nije
 *     slagao, nego je pogrešno upisan uzrast. Zato ne ide kroz Glavu VIII dokaza
 *     stvarnosti i nema nadoknade — POEN se skida najviše do nule, nikome se ne
 *     pravi minus.
 *  2. **ZRNO se otpisuje** — maloletni korisnik ga ne drži i ne glasa (Glava VIII,
 *     čl. 58). ZRNA se vraćaju u raspoloživa u Protokolu, kao pri prestanku
 *     statusa (čl. 34 st. 1).
 *  3. **Zabeleženi doprinosi se brišu** — kanali iz čl. 40a i 40b se na maloletne
 *     korisnike ne primenjuju (čl. 14 st. 1). `probajEvidentirati` NEMA proveru
 *     uzrasta (nju nosi beleženje), pa bi zabeležen red bez ovoga kasnije emitovao
 *     1.000 POEN detetu — na prvi primljen POEN. Već EVIDENTIRAN doprinos se ne
 *     dira: taj POEN postoji u Protokolu i briše se protivzapisom, ne zaboravom.
 *  4. **Programi se gase** — socijalni programi i operativni doprinos traže indeks
 *     ≥ 10%, koji je upravo pao na nulu. Bez ovoga bi prijava stajala ACTIVE do
 *     noćne revizije i dotle isplaćivala.
 *  5. **Veza sa roditeljem, poziv za drugog roditelja i postupak potvrde iz čl. 6**
 *     — isto što i pri otvaranju naloga iz roditeljskog profila.
 *
 * 🔴 **POEN na zapisu se NE dira.** Dete sme da ima POEN (prepis od roditelja,
 * razmena), a ovaj nalog ga je stekao radom, ne prijateljstvima. Otpis pri
 * punoletstvu (čl. 19 st. 2) meri se po `Prijateljstvo.poenIsplacen`, a taj nalog
 * nijedno prijateljstvo nema — pa se na 18. rođendan neće poništiti ništa što
 * ovde nije nastalo.
 *
 * 🔴 **Oglasi, poruke i istorija OSTAJU.** Dete sme da ima oglase i razgovore.
 * Posledica koju treba znati: postojeći razgovori sa punoletnim licima od sada
 * potpadaju pod čl. 9 — roditelj ih čita, a sagovorniku se prikazuje natpis o
 * tome. Sagovornik to nije mogao da zna dok je pisao.
 *
 * ─── Ograničenja ────────────────────────────────────────────────────────────
 *
 * Samo SUPERADMIN, uz otkucan pseudonim (ruta `POST /api/admin/korisnici/[id]/u-dete`).
 * Radnja je nepovratna: povratak u punoletni nalog vodi isključivo `punoletstvo.ts`,
 * na dan punoletstva.
 */
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus, DoprinosStatus, TipKorisnika, UserStatus } from "@/generated/prisma/client";
import { obavesti } from "@/lib/notifikacije";
import { oboriVerifikacijeNaloga } from "@/lib/protokol/verifikacije-naloga";
import { beogradskiDan } from "@/lib/protokol/obracunski-dan";
import { poljaPozivaZaRoditeljskiUlaz } from "@/lib/protokol/deca-poziv";
import {
  ROK_POTVRDE_DANA,
  type Provera,
  rokIzjasnjenja,
  uzrast,
  uzrastZaModul,
} from "@/lib/deca-pravila";

export class PrevodGreska extends Error {
  status: number;
  constructor(poruka: string, status = 400) {
    super(poruka);
    this.name = "PrevodGreska";
    this.status = status;
  }
}

/** Nalog koji se prevodi, sveden na ono što odluka traži. */
export type NalogZaPrevod = {
  maloletan: boolean;
  admin: string;
  jeOsnivac: boolean;
  deaktiviran: boolean;
  /** Ima li nalog svoje dete — maloletni korisnik ne može biti roditelj. */
  imaDecu: boolean;
  /**
   * Ima li nalog već upisanog roditelja.
   *
   * 🔴 Provera stoji zbog REDOSLEDA: koraci 1–4 (pad potvrda, otpis ZRNA) su
   * upisani pre nego što se stvori veza sa roditeljem, pa bi sudar na
   * `@@unique([deteId, roditeljId])` ostavio nalog obran a nepovezan. Punoletan
   * nalog roditelja ne bi trebalo da ima — `punoletstvo.ts` te redove briše pri
   * prelasku — ali cena greške je takva da se ne oslanja na „ne bi trebalo".
   */
  imaRoditelja: boolean;
  /** Vlasnik pokrovitelja (pravno lice / preduzetnik) — čl. 40 traži punoletnog. */
  vlasnikPokrovitelja: boolean;
};

/** Nalog izabran za roditelja. */
export type RoditeljZaPrevod = {
  id: string;
  maloletan: boolean;
  aktivan: boolean;
};

/**
 * ČISTA provera — bez baze, da se ista pravila mogu testirati i pročitati na
 * jednom mestu. Uzrast se prosleđuje već izračunat.
 */
export function proveriPrevodUMaloletni(
  nalog: NalogZaPrevod,
  roditelj: RoditeljZaPrevod,
  deteId: string,
  godine: number,
): Provera {
  if (nalog.deaktiviran) return { ok: false, razlog: "Nalog je ugašen.", status: 400 };
  if (nalog.maloletan) return { ok: false, razlog: "Nalog je već maloletan.", status: 400 };
  if (nalog.admin !== "NONE") {
    return {
      ok: false,
      razlog: "Nalog ima admin ovlašćenje. Prvo mu skini admin rolu.",
      status: 400,
    };
  }
  // Početni korisnik je ishodište lanca potvrda (dokaz stvarnosti čl. 14) — indeks
  // mu je fiksno 100% i ne može biti verifikovan. Maloletni nalog je suprotnost
  // toga u svakoj tački, pa se ta dva svojstva ne mogu naći na istom nalogu.
  if (nalog.jeOsnivac) {
    return { ok: false, razlog: "Nalog početnog korisnika (osnivača) se ne prevodi.", status: 400 };
  }
  if (nalog.imaDecu) {
    return {
      ok: false,
      razlog: "Nalog je upisan kao roditelj — maloletni korisnik ne može biti roditelj.",
      status: 400,
    };
  }
  if (nalog.vlasnikPokrovitelja) {
    return { ok: false, razlog: "Nalog je vlasnik pokrovitelja.", status: 400 };
  }
  if (nalog.imaRoditelja) {
    return { ok: false, razlog: "Nalog već ima upisanog roditelja.", status: 400 };
  }

  if (roditelj.id === deteId) {
    return { ok: false, razlog: "Nalog ne može biti sam sebi roditelj.", status: 400 };
  }
  if (roditelj.maloletan) {
    return { ok: false, razlog: "Maloletni korisnik ne može biti roditelj.", status: 403 };
  }
  if (!roditelj.aktivan) return { ok: false, razlog: "Nalog roditelja nije aktivan.", status: 403 };

  // 🔴 Indeks stvarnosti roditelja se NAMERNO ne traži. Otvaranje naloga iz
  // roditeljskog profila ga traži (čl. 5) jer tamo roditelj svojom potvrđenošću
  // stoji iza novog naloga; ovde nalog već postoji i samo dobija roditelja — isto
  // što radi preuzimanje kod deteta koje se registrovalo samo, koje indeks takođe
  // ne traži. Ako roditelj nije redovan član, dete prosto stoji u stanju
  // `POVEZANO` i POEN mu se ne upisuje, dok se roditelj ne potvrdi.

  return uzrastZaModul(godine);
}

export type PrevodRezultat = {
  pseudonim: string;
  roditeljPseudonim: string;
  godine: number;
  ponistenoPotvrda: number;
  poenVracenOdDrugih: number;
  zrnaOtpisana: number;
  obrisanoZabelezenih: number;
  ugasenoProgramaPrijava: number;
  brojPotvrdjivaca: number;
};

/**
 * Prevedi punoletan nalog u maloletni i upiši mu roditelja.
 *
 * @param userId nalog koji se prevodi
 * @param roditeljId nalog koji postaje roditelj
 * @param datumRodjenja upisuje se odmah (čl. 7) — posle se ne menja
 */
export async function prevediUMaloletni(
  userId: string,
  roditeljId: string,
  datumRodjenja: Date,
): Promise<PrevodRezultat> {
  const [nalog, roditelj] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        pseudonim: true,
        maloletan: true,
        admin: true,
        jeOsnivac: true,
        deaktiviranAt: true,
        zrnoStanje: { select: { aktivno: true, slobodno: true } },
        osnivacZapis: { select: { id: true } },
        _count: {
          select: {
            roditeljstvaKaoRoditelj: true,
            roditeljstvaKaoDete: true,
            vlasnikPokrovitelja: true,
          },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: roditeljId },
      select: {
        id: true,
        pseudonim: true,
        email: true,
        maloletan: true,
        status: true,
        deaktiviranAt: true,
        indeksStvarnosti: true,
      },
    }),
  ]);
  if (!nalog) throw new PrevodGreska("Korisnik nije pronađen.", 404);
  if (!roditelj) throw new PrevodGreska("Nalog roditelja nije pronađen.", 404);

  const godine = uzrast(datumRodjenja, beogradskiDan());
  const provera = proveriPrevodUMaloletni(
    {
      maloletan: nalog.maloletan,
      admin: nalog.admin,
      jeOsnivac: nalog.jeOsnivac || nalog.osnivacZapis !== null,
      deaktiviran: nalog.deaktiviranAt !== null,
      imaDecu: nalog._count.roditeljstvaKaoRoditelj > 0,
      imaRoditelja: nalog._count.roditeljstvaKaoDete > 0,
      vlasnikPokrovitelja: nalog._count.vlasnikPokrovitelja > 0,
    },
    {
      id: roditelj.id,
      maloletan: roditelj.maloletan,
      aktivan: roditelj.status === UserStatus.ACTIVE && roditelj.deaktiviranAt === null,
    },
    nalog.id,
    godine,
  );
  if (!provera.ok) throw new PrevodGreska(provera.razlog, provera.status);

  // ── 1. Izlazak iz lanca potvrda ────────────────────────────────────────────
  const { ponisteno, poenVracenOdDrugih } = await oboriVerifikacijeNaloga(userId);
  await prisma.nadzorZapis.deleteMany({ where: { nadzornikId: userId } });
  await prisma.nadzorniPredmet.updateMany({
    where: { resenById: userId },
    data: { resenById: null },
  });
  await prisma.verifikacijaToken.deleteMany({ where: { korisnikId: userId } });

  // ── 2. ZRNO ────────────────────────────────────────────────────────────────
  // Otpis bez evidentiranja POEN-a: ZRNA se vraćaju u raspoloživa u Protokolu
  // (imenilac obračunskog koeficijenta), jer se raspoloživo računa kao razlika do
  // `UKUPNO_ZRNA` — brisanjem reda se vraćaju sama.
  const zrnaOtpisana = (nalog.zrnoStanje?.aktivno ?? 0) + (nalog.zrnoStanje?.slobodno ?? 0);
  await prisma.zrnoDelegacija.updateMany({ where: { delegatId: userId }, data: { delegatId: null } });
  await prisma.zrnoDelegacija.updateMany({
    where: { zakazaniDelegatId: userId },
    data: { zakazaniDelegatId: null, imaZakazano: false },
  });
  await prisma.zrnoDelegacija.deleteMany({ where: { delegatorId: userId } });
  await prisma.zrnoUpisZahtev.deleteMany({ where: { userId } });
  await prisma.zrnoOtpisZahtev.deleteMany({ where: { userId } });
  await prisma.zrnoStatusZahtev.deleteMany({ where: { userId } });
  await prisma.zrnoStanje.deleteMany({ where: { userId } });

  // ── 3. Zabeleženi doprinosi (čl. 40a i 40b) ────────────────────────────────
  const [sadrzaj, razmena] = await Promise.all([
    prisma.doprinosSadrzaju.deleteMany({ where: { userId, status: DoprinosStatus.ZABELEZEN } }),
    prisma.doprinosRazmeni.deleteMany({ where: { userId, status: DoprinosStatus.ZABELEZEN } }),
  ]);
  const obrisanoZabelezenih = sadrzaj.count + razmena.count;

  // ── 4. Programi ────────────────────────────────────────────────────────────
  const ugaseno = await prisma.programEnrollment.updateMany({
    where: { userId, status: { in: [EnrollmentStatus.PENDING, EnrollmentStatus.ACTIVE] } },
    data: { status: EnrollmentStatus.INACTIVE },
  });

  // ── 5. Nalog, roditelj, poziv i postupak potvrde ───────────────────────────
  //
  // Potvrđivači roditelja — njima ide izjašnjenje iz čl. 6, isto kao kad roditelj
  // otvori nalog detetu. Postupak se NE preskače zato što nalog već postoji:
  // upravo on je jedina provera da iza naloga stvarno stoji dete tog roditelja, a
  // preskakanjem bi ovaj put postao način da se čl. 6 zaobiđe.
  const veze = await prisma.verifikacionaVeza.findMany({
    where: { verifikovaniId: roditelj.id },
    select: { verifikatorId: true },
  });
  const potvrdjivaci = [...new Set(veze.map((v) => v.verifikatorId))].filter((id) => id !== userId);

  const sada = new Date();
  const rokDo = rokIzjasnjenja(sada);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        maloletan: true,
        datumRodjenja,
        // Maloletni korisnik ostaje NEVERIFIKOVAN (čl. 15): nema indeks stvarnosti i
        // nikoga ne potvrđuje. Time sve zatečene brane sistema važe bez nove provere.
        tipKorisnika: TipKorisnika.NEVERIFIKOVAN,
        verified: false,
        verifiedAt: null,
        indeksStvarnosti: 0,
        slotoviPotroseni: 0,
        // Prekidač iz čl. 10 st. 2 kreće ugašen — odnos sa punoletnim licima
        // otvara roditelj, a ne zatečeno stanje naloga.
        dozvolaOdrasli: false,
        // Punoletstvo se računa iznova iz upisanog datuma; oba stuba moraju biti
        // prazna da bi ga `punoletstvo.ts` uopšte uzeo u obzir.
        punoletstvoNajavaAt: null,
        punoletstvoObradjenAt: null,
      },
    });

    await tx.roditeljstvo.create({ data: { deteId: userId, roditeljId: roditelj.id } });

    // Kod kojim ulazi DRUGI roditelj (čl. 4b st. 6). Nastaje i ovde, iako poziva
    // nema — inače bi drugi roditelj mogao da uđe samo kod dece koja su se
    // registrovala sama, što je razlika bez razloga.
    await tx.roditeljPoziv.deleteMany({ where: { deteId: userId } });
    await tx.roditeljPoziv.create({
      data: { deteId: userId, ...poljaPozivaZaRoditeljskiUlaz(roditelj.email, sada) },
    });

    if (potvrdjivaci.length > 0) {
      await tx.roditeljstvoPotvrda.createMany({
        data: potvrdjivaci.map((potvrdjivacId) => ({ deteId: userId, potvrdjivacId, rokDo })),
        skipDuplicates: true,
      });
    }
  });

  // ── 6. Javljanja (van transakcije — pad pošte ne obara prevođenje) ─────────
  if (potvrdjivaci.length === 0) {
    const { posaljiAdminAlert } = await import("@/lib/adminAlert");
    void posaljiAdminAlert(
      "Nalog preveden u maloletni bez izjašnjenja",
      `Roditelj: ${roditelj.pseudonim} (indeks ${roditelj.indeksStvarnosti}%)\n` +
        `Njegovu stvarnost nije potvrdio nijedan korisnik, pa nema koga da se pita o postojanju deteta.\n` +
        `Uzrast: ${godine} godina.`,
    );
  }

  await obavesti(userId, {
    tip: "nalog_preveden_u_maloletni",
    kljuc: "notifikacije.nalog_preveden_u_maloletni",
    parametri: { roditelj: roditelj.pseudonim },
    naslov: "Nalog je preveden u dečji",
    tekst: `Tvoj nalog sada radi po pravilima za maloletne korisnike, a kao roditelj je upisan ${roditelj.pseudonim}.`,
    link: "/profil",
  }).catch(() => {});

  await obavesti(roditelj.id, {
    tip: "roditeljstvo_upisano",
    kljuc: "notifikacije.roditeljstvo_upisano",
    parametri: { pseudonim: nalog.pseudonim },
    naslov: "Upisan si kao roditelj",
    tekst: `Nalog ${nalog.pseudonim} je preveden u dečji i ti si upisan kao njegov roditelj.`,
    link: "/profil",
  }).catch(() => {});

  for (const potvrdjivacId of potvrdjivaci) {
    await obavesti(potvrdjivacId, {
      tip: "roditeljstvo_potvrda",
      kljuc: "notifikacije.roditeljstvo_potvrda",
      parametri: { pseudonim: roditelj.pseudonim, godine, dana: ROK_POTVRDE_DANA },
      naslov: "Potvrdi postojanje deteta",
      tekst: `Sa naloga ${roditelj.pseudonim} otvoren je nalog za dete uzrasta ${godine} godina. Imaš ${ROK_POTVRDE_DANA} dana da potvrdiš da to znaš.`,
      link: "/deca/potvrde",
    }).catch(() => {});
  }

  return {
    pseudonim: nalog.pseudonim,
    roditeljPseudonim: roditelj.pseudonim,
    godine,
    ponistenoPotvrda: ponisteno,
    poenVracenOdDrugih,
    zrnaOtpisana,
    obrisanoZabelezenih,
    ugasenoProgramaPrijava: ugaseno.count,
    brojPotvrdjivaca: potvrdjivaci.length,
  };
}
