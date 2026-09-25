import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nivoZaKumulativ } from "@/lib/protokol/donacija";
import { dohvatiSaldoFondacije } from "@/lib/protokol/fondacija";
import { BEZ_DECE } from "@/lib/protokol/deca";
import { dnevniPregledPrograma, labelPrograma } from "@/lib/protokol/programi";
import { uslovZapisaProtokola, opisZapisaProtokola, VEZA_PROGRAMA } from "@/lib/protokol/program-prikaz";
import { USLOV_AKTIVNO_DETE } from "@/lib/protokol/skole";
import { USLOV_RAZMENE } from "@/lib/razmena-brojac-pravila";
import SistemKlijent from "./SistemKlijent";
import { SEKCIJE, type Sekcija } from "./sekcije";

export default async function SistemPage({
  searchParams,
}: {
  searchParams: Promise<{ sekcija?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Sekcija iz URL-a (?sekcija=clanovi) — back navigacija vraća na istu sekciju.
  const { sekcija } = await searchParams;
  const pocetnaSekcija: Sekcija = (SEKCIJE as readonly string[]).includes(sekcija ?? "")
    ? (sekcija as Sekcija)
    : "pregled";

  const verified = session.user.verified;

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const [
    protokol,
    ukupnoKorisnika,
    verifikovanih,
    emisije,
    protokolZapisi,
    razmeneZapisi,
    ukupnoTransakcija,
    korisnici,
    danasKorisnika,
    danasTransakcija,
    ukupnoDonacijaRaw,
    danasDonacijaRaw,
    ukupanIznosTxRaw,
    danasIznosTxRaw,
    donacijeLista,
    pokroviteljiLista,
    ukupnoVerifikacija,
    danasVerifikacija,
    saldoFondacije,
    aktivneDece,
  ] = await Promise.all([
    prisma.wallet.findUnique({
      where: { id: "banka-singleton" },
      select: { balance: true },
    }),
    prisma.user.count({ where: { oauthPending: false, deaktiviranAt: null, status: "ACTIVE" } }),
    prisma.user.count({ where: { verified: true } }),
    prisma.dailyEmissionSummary.findMany({
      orderBy: { date: "desc" },
      take: 30,
    }),
    // Dve odvojene liste, jer dve kartice pokazuju dve različite stvari i svaka
    // mora da ima svojih sto redova. Dok je bio jedan mešan upit od 100 najnovijih,
    // razmene su se gubile među zapisima Protokola (emisija je mnogo više), pa je
    // ispod kartice „Ukupno razmena" znao da stoji šačica redova iako ih je u
    // sistemu mnogo više.
    // „Ukupno POENA" (opticaj) → zapisi Protokola: sve što NIJE prenos između
    // korisnika. Tu spada i poništenje prepisa: ono se dešava između dva
    // korisnička zapisa, ali je akt Fondacije, ne razmena.
    prisma.transaction.findMany({
      where: {
        // 🔴 Zapis socijalnog programa ulazi u spisak samo verifikovanom
        // posmatraču (Pravilnik o programima podrške čl. 4 st. 4, set 4.6.7),
        // i uslov za to stoji na JEDNOM mestu — `uslovZapisaProtokola`. Isti
        // uslov koriste `/api/pocetna/liste` i `/api/javno/feed`; prepisan ovde,
        // razišao bi se pri prvoj sledećoj izmeni. Osnov po kome je pravo
        // ostvareno se ne prikazuje nikome (čl. 4 st. 5) i upit ga ne dovlači.
        // Operativni doprinos je na sopstvenom tipu `EMISIJA_OPERATIVNI`.
        ...uslovZapisaProtokola(verified),
        // 🔴 Deca izlaze iz spiska, kao i u `/api/javno/feed`. Ovaj upit tu
        // proveru nije imao, pa je pseudonim deteta izlazio uz emisije iz dečjeg
        // prostora — dok isti podatak feed izričito krije (Modul Deca, čl. 13).
        // Zapis Protokola i zapis Kruga nemaju korisnika i moraju da prođu.
        AND: [
          { OR: [{ fromWalletId: null }, { fromWallet: { is: BEZ_DECE } }] },
          { toWallet: { is: BEZ_DECE } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        ...VEZA_PROGRAMA,
        fromWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
        toWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
      },
    }),
    // „Ukupno razmena" → isključivo prepisi između korisnika (TRANSFER), i to
    // oni od najmanje `MIN_POEN_RAZMENE`. Spisak ide kroz isti uslov kao brojač
    // iznad njega — inače bi ispod kartice stajali redovi koje kartica ne broji.
    prisma.transaction.findMany({
      where: {
        ...USLOV_RAZMENE,
        AND: [
          { OR: [{ fromWalletId: null }, { fromWallet: { is: BEZ_DECE } }] },
          { toWallet: { is: BEZ_DECE } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        fromWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
        toWallet: { include: { user: { select: { id: true, pseudonim: true } } } },
      },
    }),
    // Kartica „Ukupno razmena" broji samo prenose između korisnika (TRANSFER),
    // ne i evidentiranje Protokola (EMISIJA_*, UPIS/OTPIS_ZRNO), i ne prepise
    // ispod praga iz `razmena-brojac-pravila.ts`.
    prisma.transaction.count({ where: { ...USLOV_RAZMENE } }),
    prisma.user.findMany({
      // Sakrij nezavršene OAuth naloge (privremeni pseudonim „korisnik_…",
      // oauthPending=true) i deaktivirane/neaktivne naloge iz spiska članova.
      where: {
        oauthPending: false,
        deaktiviranAt: null,
        status: "ACTIVE",
      },
      orderBy: [{ wallet: { balance: "desc" } }],
      select: {
        id: true,
        pseudonim: true,
        verified: true,
        avatar: true,
        location: true,
        createdAt: true,
        maloletan: true,
        identitetUtvrdjenAt: true,
        wallet: { select: { balance: true } },
        krugClanstva: {
          where: { leftAt: null },
          select: { krug: { select: { name: true } } },
          take: 1,
        },
        donations: {
          where: { status: "CONFIRMED" },
          select: { amountRSD: true },
        },
      },
    }),
    prisma.user.count({
      where: { createdAt: { gte: danas } },
    }),
    prisma.transaction.count({
      where: { ...USLOV_RAZMENE, createdAt: { gte: danas } },
    }),
    prisma.donationRecord.count({ where: { status: "CONFIRMED" } }),
    prisma.donationRecord.count({
      where: { status: "CONFIRMED", confirmedAt: { gte: danas } },
    }),
    // 🔴 Kartica „Ukupno prepisa" NEMA prag i namerno ga nema: ona meri POEN
    // koji je prošao između članova, ne broj razmena. Prepis od 50 POEN jeste
    // prepis — samo se ne broji kao razmena. Kad bi i zbir imao prag, dva
    // pokazatelja bi govorila o dva različita skupa prepisa a zvala se isto.
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "TRANSFER" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "TRANSFER", createdAt: { gte: danas } },
    }),
    // 🔴 Anonimna donacija ULAZI u spisak, ali bez pseudonima i bez linka
    // (R-03, mera M-3c). Do ovog seta je uslov bio samo `status: CONFIRMED` —
    // polje `javno` se nije gledalo uopšte, pa se donator koji je izabrao
    // anonimnost prikazivao SA PSEUDONIMOM, iznosom i datumom, svakom redovnom
    // članu. Pseudonim vodi na profil, a kolona POEN mu je stajala na 0 (anonimna
    // donacija ne nosi POEN) — jedini takav red u tabeli, dakle i oznaka „ovaj je
    // donirao anonimno". Donacije čl. 5a i Uslovi čl. 17 obećavaju suprotno.
    prisma.donationRecord.findMany({
      where: { status: "CONFIRMED" },
      orderBy: { confirmedAt: "desc" },
      take: 50,
      include: { user: { select: { id: true, pseudonim: true } } },
    }),
    prisma.pokrovitelj.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        naziv: true,
        adresa: true,
        rsdKumulativ: true,
        trenutniNivo: true,
      },
      orderBy: { rsdKumulativ: "desc" },
    }),
    prisma.verifikacionaVeza.count(),
    prisma.verifikacionaVeza.count({
      where: { vremenskiZig: { gte: danas } },
    }),
    dohvatiSaldoFondacije(),
    // Maloletni nalozi u stanju AKTIVNO (bar jedan roditelj je redovan član).
    // Oni su punopravni korisnici — koriste dečji prostor, sklapaju prijateljstva
    // i primaju POEN — pa ulaze u broj članova na kartici, iako u lanac potvrda
    // ne smeju da uđu (Pravilnik o učešću dece čl. 15), tj. `verified` im je
    // trajno `false`. Uslov je isti onaj po kome se broji ranglista škola —
    // jedna istina o tome šta je aktivno dete.
    prisma.user.count({ where: { ...USLOV_AKTIVNO_DETE, oauthPending: false } }),
  ]);

  const opticaj = Math.abs(protokol?.balance ?? 0);
  const protokolBalance = protokol?.balance ?? 0;

  const ukupnoDonacija = ukupnoDonacijaRaw;
  const danasDonacija = danasDonacijaRaw;
  const ukupanIznosTx = ukupanIznosTxRaw._sum.amount ?? 0;
  const danasIznosTx = danasIznosTxRaw._sum.amount ?? 0;
  const donacije = donacijeLista.map((d) => ({
    id: d.id,
    // Anonimna donacija: iznos ulazi u zbir, lice ne izlazi nigde.
    userId: d.javno ? d.userId : null,
    pseudonim: d.javno ? d.user.pseudonim : null,
    anonimno: !d.javno,
    amountRSD: Number(d.amountRSD),
    poenEmitted: d.poenEmitted,
    level: d.level,
    confirmedAt: (d.confirmedAt ?? d.createdAt).toISOString(),
  }));

  const pokrovitelji = pokroviteljiLista.map((p) => ({
    id: p.id,
    naziv: p.naziv,
    adresa: p.adresa,
    rsdKumulativ: Number(p.rsdKumulativ),
    trenutniNivo: p.trenutniNivo,
  }));

  const danasEmisija = emisije[0];
  const danasEmitovano = danasEmisija?.totalEmitted ?? 0;
  const danasLimit = danasEmisija?.limit ?? Math.floor(opticaj * 0.1);

  const locale = await getLocale();
  // Union, jer isti mapper služi oba spiska: zapisi Protokola nose vezu do prijave
  // na program, prepisi (`TRANSFER`) je po prirodi ne mogu imati.
  const zaPrikaz = (t: (typeof protokolZapisi)[number] | (typeof razmeneZapisi)[number]) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    // 🔴 Naziv socijalnog programa se sklapa PRI ČITANJU, iz prijave, i samo za
    // verifikovanog posmatrača — u zapisu i dalje stoji opšta oznaka.
    description: opisZapisaProtokola(locale, t, verified),
    createdAt: t.createdAt.toISOString(),
    fromPseudonim: t.fromWallet?.user?.pseudonim ?? "Protokol",
    fromId: t.fromWallet?.user?.id ?? null,
    toPseudonim: t.toWallet?.user?.pseudonim ?? "Protokol",
    toId: t.toWallet?.user?.id ?? null,
  });

  const protokolTx = protokolZapisi.map(zaPrikaz);
  const razmene = razmeneZapisi.map(zaPrikaz);

  const clanovi = korisnici.map((u) => {
    const donacijeRSD = u.donations.reduce((s, d) => s + Number(d.amountRSD), 0);
    return {
      id: u.id,
      pseudonim: u.pseudonim,
      verified: u.verified,
      maloletan: u.maloletan,
      identitetUtvrdjen: u.identitetUtvrdjenAt !== null,
      avatar: u.avatar,
      balance: u.wallet?.balance ?? 0,
      krug: u.krugClanstva[0]?.krug?.name ?? null,
      donacijeRSD,
      rangDonacije: donacijeRSD > 0 ? nivoZaKumulativ(donacijeRSD).nivo : 0,
      location: u.location ?? null,
      createdAt: u.createdAt.toISOString(),
    };
  });

  // Socijalni programi: dnevni zbir po programu stoji UMESTO pojedinačnih redova,
  // koji su merom M-1 (R-03) izašli iz spiska zapisa Protokola. Proverljivost
  // ostaje potpuna — zbir agregata plus ostali kanali daju promenu opticaja.
  const programiPregled = await dnevniPregledPrograma(14);

  const emisijeChart = emisije
    .slice(0, 14)
    .reverse()
    .map((e) => ({
      date: e.date.toISOString().split("T")[0],
      emitted: e.totalEmitted,
      limit: e.limit,
    }));

  return (
    <SistemKlijent
      pseudonim={session.user.pseudonim}
      verified={verified}
      opticaj={opticaj}
      protokolBalance={protokolBalance}
      ukupnoKorisnika={ukupnoKorisnika}
      verifikovanih={verifikovanih}
      aktivneDece={aktivneDece}
      ukupnoTransakcija={ukupnoTransakcija}
      danasEmitovano={danasEmitovano}
      danasLimit={danasLimit}
      danasKorisnika={danasKorisnika}
      danasTransakcija={danasTransakcija}
      ukupnoVerifikacija={ukupnoVerifikacija}
      danasVerifikacija={danasVerifikacija}
      racunFondacije={saldoFondacije.saldo}
      ukupnoDonacija={ukupnoDonacija}
      danasDonacija={danasDonacija}
      ukupanIznosTx={ukupanIznosTx}
      danasIznosTx={danasIznosTx}
      donacije={donacije}
      pokrovitelji={pokrovitelji}
      emisijeChart={emisijeChart}
      programiPregled={programiPregled.map((r) => ({ ...r, label: labelPrograma(r.program) }))}
      protokolTx={protokolTx}
      razmene={razmene}
      clanovi={clanovi}
      pocetnaSekcija={pocetnaSekcija}
    />
  );
}
