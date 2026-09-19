import { NextResponse } from "next/server";
import { greska } from "@/lib/greska-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nivoZaKumulativ, tabelaZaPrikaz } from "@/lib/protokol/donacija";
import { dohvatiIpsConfig, pozivNaBrojZaClana, prikazPozivNaBroj } from "@/lib/placanje/ips-qr";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return await greska("Nije prijavljen.", 401);
  // Donirati sme i član koga niko nije potvrdio (R-01, mera M-9). Vidi
  // `evidentirajDonaciju` za ono što se time NE otvara. Lista TUĐIH donacija je
  // druga stvar i traži potvrdu (R-03, mera M-3a); sopstvene donacije vidi svako
  // — to je njegov podatak.
  const verifikovan = !!session.user.verified;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      memberHash: true,
      donatorskiBroj: true,
      donations: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amountRSD: true,
          cumulativeRSD: true,
          level: true,
          poenEmitted: true,
          status: true,
          javno: true,
          createdAt: true,
          // Ne salje se ceo tekst ugovora u listu — samo da li postoji, pa
          // ekran zna da li da ponudi link (cl. 5b).
          ugovorTekst: true,
        },
      },
    },
  });

  if (!user) return await greska("Korisnik nije pronađen.", 404);

  // Rang/nivo se računa samo iz javnih donacija (anonimne ne nose POEN).
  const totalRSD = user.donations
    .filter((d) => d.status === "CONFIRMED" && d.javno)
    .reduce((s, d) => s + Number(d.amountRSD), 0);
  const { nivo, kurs } = nivoZaKumulativ(totalRSD);

  // ── Lista donacija ──────────────────────────────────────────────────────────
  //
  // 🔴 SAMO REDOVNIM ČLANOVIMA (R-03, mera M-3a). Do ovog seta ju je dobijao svaki
  // prijavljen nalog, dakle i onaj otvoren pre dva minuta, i to sa IMENOM I
  // PREZIMENOM donatora — dok ista lestvica vidljivosti (Uslovi čl. 17) istom
  // posmatraču krije i običan pseudonim. Ime je identifikovalo jače nego ono što
  // je sakriveno.
  //
  // 🔴 Anonimna donacija ULAZI u listu, ali samo iznosom (mera M-3c). Do ovog seta
  // je bila skrivena ovde a prikazana na `/sistem` SA PSEUDONIMOM — dakle jedini
  // ekran na kome se videla odavao je upravo ono što anonimnost obećava. Sada je
  // obrnuto: iznos ulazi u zbir svuda, a lice nigde.
  //
  // Ime se čita iz `donatorIme` snimljenog na zapisu (čl. 5a) — ne iz profila,
  // jer je podatak trajan i ostaje i pošto korisnik ugasi nalog.
  const javneDonacije = verifikovan
    ? await prisma.donationRecord.findMany({
        where: {
          status: "CONFIRMED",
          // Anonimne prolaze; ime im je null i ne prikazuje se.
          OR: [{ javno: false }, { javno: true, donatorIme: { not: null } }],
        },
        orderBy: [{ confirmedAt: "desc" }, { createdAt: "desc" }],
        take: 50,
        select: {
          id: true,
          amountRSD: true,
          level: true,
          poenEmitted: true,
          donatorIme: true,
          javno: true,
          confirmedAt: true,
          createdAt: true,
          // Pseudonim i link ka profilu stoje uz ime, kako Uslovi čl. 17 i kažu.
          // Bez novog izlaganja: isti krug (redovni članovi) već na `/sistem` vidi
          // pseudonim uz isti iznos i datum, pa se par ime↔pseudonim ionako
          // sklapa poređenjem dva ekrana. 🔴 Kod ANONIMNE donacije se ne šalje.
          user: { select: { id: true, pseudonim: true } },
        },
      })
    : [];

  // Trajni broj za uplate (model 97 nad donatorskim brojem) — isti za IPS QR i
  // klasičnu uplatnicu. Račun iz IPS konfiguracije kad je podešen (jedan izvor
  // istine); dok nije, klijent prikazuje placeholder.
  const ipsCfg = dohvatiIpsConfig();
  const pozivNaBroj = prikazPozivNaBroj(pozivNaBrojZaClana(user.donatorskiBroj));

  return NextResponse.json({
    trenutniNivo: nivo,
    trenutniKurs: kurs,
    kumulativRSD: totalRSD,
    donatorskiBroj: user.donatorskiBroj,
    pozivNaBroj,
    racun: ipsCfg?.racun ?? null,
    donacije: user.donations.map((d) => ({
      id: d.id,
      amountRSD: Number(d.amountRSD),
      cumulativeRSD: Number(d.cumulativeRSD),
      level: d.level,
      poenEmitted: d.poenEmitted,
      status: d.status,
      javno: d.javno,
      imaUgovor: d.ugovorTekst !== null,
      createdAt: d.createdAt.toISOString(),
    })),
    // Nepotvrđenom članu lista ne stiže prazna nego ZAKLJUČANA — prazan spisak bi
    // rekao da donacija nema, što nije isto.
    listaZakljucana: !verifikovan,
    listaDonacija: javneDonacije.map((d) => ({
      id: d.id,
      ime: d.javno ? d.donatorIme : null,
      anonimno: !d.javno,
      pseudonim: d.javno ? d.user?.pseudonim ?? null : null,
      userId: d.javno ? d.user?.id ?? null : null,
      amountRSD: Number(d.amountRSD),
      level: d.level,
      poenEmitted: d.poenEmitted,
      createdAt: (d.confirmedAt ?? d.createdAt).toISOString(),
    })),
    // Tabela nema kraj (čl. 4) — šalje se nekoliko redova iznad zaključanih
    // jedanaest, da se na ekranu vidi da se niz nastavlja.
    rangTabela: tabelaZaPrikaz(),
  });
}
