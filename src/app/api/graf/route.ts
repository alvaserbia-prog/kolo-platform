/**
 * GET /api/graf — podaci za prikaz cele mreže jemstva (graf verifikacija).
 *
 * Pristup: isključivo verifikovani korisnici (indeks ≥ 10% / nosilac ZRNA) —
 * graf verifikacija se NIKADA ne izlaže javno (Politika privatnosti čl. 6).
 * Čvor je javno samo BROJ (donatorski broj); pseudonim ide uz čvor jer je
 * pseudonimna evidencija vidljiva verifikovanim korisnicima (Pravilnik čl. 67)
 * — prikazuje se tek na klik, u panelu. Nikakvi drugi lični podaci ne izlaze.
 *
 * Stanja čvorova su iz ugla prijavljenog posmatrača (JA / MOGU / ZONA / PUN),
 * izvedena iz keša verification_zone (oba smera) i istih pravila koja
 * primenjuje verifikacija-service (osnivač, indeks 100%, prelazno čl. 22).
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  brojRaspolozivihSlotova,
  imaPristupVerifikaciji,
  izracunajKapacitet,
  raspolozivSlot,
} from "@/lib/protokol/dokaz-stvarnosti";
import { odrediStabloRoditelja, stanjeCvora } from "@/lib/protokol/graf";

const PROTOKOL_WALLET_ID = "banka-singleton";

const ZAGLAVLJA = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "private, no-store",
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nije prijavljen." }, { status: 401, headers: ZAGLAVLJA });
  }

  const posmatrac = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      tipKorisnika: true,
      indeksStvarnosti: true,
      slotoviPotroseni: true,
    },
  });
  if (
    !posmatrac ||
    !imaPristupVerifikaciji(posmatrac.tipKorisnika, posmatrac.indeksStvarnosti)
  ) {
    return NextResponse.json(
      {
        error:
          "Graf verifikacija postaje dostupan po tvojoj prvoj verifikaciji (indeks ≥ 10%).",
      },
      { status: 403, headers: ZAGLAVLJA }
    );
  }

  const [ivice, protokolWallet, zonaOd, zonaKa] = await Promise.all([
    prisma.verifikacionaVeza.findMany({
      orderBy: { vremenskiZig: "asc" },
      select: {
        verifikatorId: true,
        verifikovaniId: true,
        vremenskiZig: true,
        podlezeNadzoru: true,
        nadzornikId: true,
      },
    }),
    prisma.wallet.findUnique({
      where: { id: PROTOKOL_WALLET_ID },
      select: { balance: true },
    }),
    // Zona posmatrača: koga posmatrač NE SME da verifikuje (čl. 12)…
    prisma.verifikacionaZona.findMany({
      where: { userId: posmatrac.id },
      select: { forbiddenUserId: true },
    }),
    // …i u čijoj se zoni posmatrač nalazi (obrnuti smer, takođe blokira).
    prisma.verifikacionaZona.findMany({
      where: { forbiddenUserId: posmatrac.id },
      select: { userId: true },
    }),
  ]);

  // Čvorovi = učesnici ivica ∪ aktivni osnivači (koreni) ∪ posmatrač.
  const idSkup = new Set<string>([posmatrac.id]);
  for (const iv of ivice) {
    idSkup.add(iv.verifikatorId);
    idSkup.add(iv.verifikovaniId);
  }
  const korisnici = await prisma.user.findMany({
    where: {
      OR: [{ id: { in: [...idSkup] } }, { jeOsnivac: true, deaktiviranAt: null }],
    },
    select: {
      id: true,
      donatorskiBroj: true,
      pseudonim: true,
      tipKorisnika: true,
      jeOsnivac: true,
      indeksStvarnosti: true,
      slotoviPotroseni: true,
    },
  });

  const opticaj = Math.max(0, -(protokolWallet?.balance ?? 0));
  const zabranjeniZaMene = new Set(zonaOd.map((z) => z.forbiddenUserId));
  const jaSamUZoni = new Set(zonaKa.map((z) => z.userId));

  const primljeno = new Map<string, number>();
  for (const iv of ivice) {
    primljeno.set(iv.verifikovaniId, (primljeno.get(iv.verifikovaniId) ?? 0) + 1);
  }

  const stablo = odrediStabloRoditelja(ivice);

  const cvorovi = korisnici.map((u) => {
    const kapacitet = izracunajKapacitet(u.tipKorisnika, u.indeksStvarnosti);
    const { stanje, razlog } = stanjeCvora(
      posmatrac.id,
      {
        id: u.id,
        jeOsnivac: u.jeOsnivac,
        tip: u.tipKorisnika,
        indeks: u.indeksStvarnosti,
        primljenoVerifikacija: primljeno.get(u.id) ?? 0,
      },
      zabranjeniZaMene.has(u.id),
      jaSamUZoni.has(u.id),
      opticaj
    );
    return {
      id: u.id,
      broj: u.donatorskiBroj,
      pseudonim: u.pseudonim,
      tip: u.tipKorisnika,
      jeOsnivac: u.jeOsnivac,
      indeks: u.indeksStvarnosti,
      kapacitet: kapacitet === "neograniceno" ? null : kapacitet,
      slotoviPotroseni: u.slotoviPotroseni,
      stanje,
      razlog: razlog ?? null,
    };
  });

  const kapacitetPosmatraca = izracunajKapacitet(
    posmatrac.tipKorisnika,
    posmatrac.indeksStvarnosti
  );

  return NextResponse.json(
    {
      ja: posmatrac.id,
      opticaj,
      posmatrac: {
        imaSlot: raspolozivSlot(kapacitetPosmatraca, posmatrac.slotoviPotroseni),
        slobodnihSlotova: brojRaspolozivihSlotova(
          kapacitetPosmatraca,
          posmatrac.slotoviPotroseni
        ),
      },
      cvorovi,
      ivice: ivice.map((iv) => ({
        od: iv.verifikatorId,
        ka: iv.verifikovaniId,
        datum: iv.vremenskiZig.toISOString(),
        stablo: stablo.get(iv.verifikovaniId) === iv.verifikatorId,
        nadzor: !iv.podlezeNadzoru
          ? "ne-podleze"
          : iv.nadzornikId
            ? "nadzirano"
            : "ceka-nadzor",
      })),
    },
    { headers: ZAGLAVLJA }
  );
}
