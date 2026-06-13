import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TipKorisnika, TransactionType, UserStatus } from "@/generated/prisma/client";
import { del } from "@vercel/blob";
import {
  POEN_NADZORNIK,
  POEN_VERIFIKATOR,
  POEN_VERIFIKOVANI,
  izracunajIndeks,
} from "@/lib/protokol/dokaz-stvarnosti";

const PROTOKOL_WALLET_ID = "banka-singleton";

/**
 * DELETE /api/profil
 * Korisnik zahteva brisanje naloga (čl. 17 ZZPL — pravo na zaborav).
 *
 * Implementacija Pravilnika v3.7.5 čl. 34 — Mehanika prestanka statusa:
 * — Aktivno ZRNO prelazi u slobodno, a potom se svo slobodno ZRNO otpisuje
 *   i vraća u raspoloživa ZRNA u Protokolu. Otpis NE pokreće evidentiranje POEN-a
 *   prema obračunskom koeficijentu.
 * — Zapisi POEN-a korisnika poništavaju se, protivzapis Protokola se umanjuje
 *   za isti iznos. Zero-sum invarijanta ostaje očuvana.
 * — Brišu se elektronska adresa i dobrovoljno dostavljeni podaci; anonimizuju
 *   se veze korisnika u grafu verifikacija (User entitet postaje anonimni);
 *   numerička istorija zadržava se pod identifikatorom koji više ne omogućava
 *   identifikaciju.
 *
 * Body: { prenesPoen?: string } — pseudonim primaoca preostalih POEN-a (opciono;
 *   ako nije zadat, POEN-i se poništavaju kao po čl. 34 st. 2)
 *
 * Tok:
 * 1. Aktivno ZRNO → slobodno → otpis u Protokol BEZ POEN emisije (čl. 34 st. 1)
 * 2. Anonimizacija grafa verifikacija (čl. 34 st. 4):
 *      — brišu se sve veze gde je obrisani strana,
 *      — POEN-i emitovani povodom tih verifikacija vraćaju se Protokolu
 *        (verifikatorima, verifikovanima, nadzornicima — capped na balance),
 *      — reizračunavaju se indeksi i status verifikovanih, vraćaju se slotovi,
 *      — veze gde je obrisani bio samo nadzornik ostaju (nadzornikId = null).
 * 3. Poništi POEN balans korisnika (ili prenesi drugom korisniku ako je zadat primalac)
 * 4. Napusti aktivne Krugove
 * 5. Obriši aktivne tokene (VerifikacijaToken, PasswordResetToken); anonimizuj User i UserPodaci
 * 6. Zadržaj: transakcije, audit log, KrugBonusLog
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nije prijavljen." }, { status: 401 });

  const userId = session.user.id;

  // Pročitaj telo — opciono ime primaoca preostalih POEN-a
  let primalacPseudonim: string | undefined;
  try {
    const body = await req.json();
    primalacPseudonim = body?.prenesPoen?.trim() || undefined;
  } catch {
    // body nije obavezan
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      zrnoStanje: true,
      krugClanstva: { where: { leftAt: null } },
    },
  });

  if (!user) return NextResponse.json({ error: "Korisnik nije pronađen." }, { status: 404 });
  if (user.status === UserStatus.EXCLUDED || user.deaktiviranAt) {
    return NextResponse.json({ error: "Nalog je već deaktiviran." }, { status: 409 });
  }

  // --- 1. Otpis ZRNA bez POEN emisije (čl. 34 st. 1) ---
  // Aktivno → slobodno → otpis u Protokol; NE pokreće evidentiranje POEN-a.
  const aktivnaZrna = user.zrnoStanje?.aktivno ?? 0;
  const slobodnaZrna = user.zrnoStanje?.slobodno ?? 0;
  const ukupnoZrna = aktivnaZrna + slobodnaZrna;
  if (ukupnoZrna > 0) {
    await prisma.zrnoStanje.update({
      where: { userId },
      data: { aktivno: 0, slobodno: 0 },
    });
    // ZRNA se implicitno vraćaju u raspoloživa Protokola (zrnaUProtokolu = UKUPNO_ZRNA - kodKorisnika);
    // koeficijent se menja jer imenilac raste — što je u skladu sa čl. 34 st. 3.
  }

  // --- 2. Anonimizacija grafa verifikacija (čl. 34 st. 4) ---
  // Pri prestanku statusa korisnika brišu se njegove veze u grafu jemstva,
  // a POEN-i emitovani povodom tih verifikacija vraćaju se Protokolu:
  //   — verifikatorima koji su obrisanog verifikovali: skida se POEN_VERIFIKATOR,
  //     vraća im se slot (ako su REGULARNI);
  //   — verifikovanima koje je obrisani verifikovao: skida se POEN_VERIFIKOVANI,
  //     reizračunava se indeks stvarnosti; ako padne na 0, status se vraća na NEVERIFIKOVAN;
  //   — nadzornicima tih verifikacija: skida se POEN_NADZORNIK.
  // Veze gde je obrisani bio nadzornik (a ne strana) ostaju u grafu, samo se
  // postavlja nadzornikId = null. Zero-sum invarijanta očuvana.
  const vezeKaoVerifikator = await prisma.verifikacionaVeza.findMany({
    where: { verifikatorId: userId },
  });
  const vezeKaoVerifikovani = await prisma.verifikacionaVeza.findMany({
    where: { verifikovaniId: userId },
  });

  // Helper: skida POEN od jednog korisnika i vraća Protokolu, capped na balance
  // (Pravilnik čl. 14: nijedan korisnik ne može imati negativan zapis POEN-a).
  async function vratiPoenProtokolu(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    targetUserId: string,
    iznos: number,
    opis: string
  ) {
    if (iznos <= 0) return;
    const w = await tx.wallet.findUnique({ where: { userId: targetUserId } });
    if (!w) return;
    const stvarno = Math.min(w.balance, iznos);
    if (stvarno <= 0) return;
    await tx.wallet.update({
      where: { id: w.id },
      data: { balance: { decrement: stvarno } },
    });
    await tx.wallet.update({
      where: { id: PROTOKOL_WALLET_ID },
      data: { balance: { increment: stvarno } },
    });
    await tx.transaction.create({
      data: {
        fromWalletId: w.id,
        toWalletId: PROTOKOL_WALLET_ID,
        amount: stvarno,
        type: TransactionType.TRANSFER,
        description: opis,
      },
    });
  }

  if (vezeKaoVerifikator.length > 0 || vezeKaoVerifikovani.length > 0) {
    await prisma.$transaction(
      async (tx) => {
        // 2a) Veze gde je obrisani VERIFIKATOR
        for (const v of vezeKaoVerifikator) {
          // POEN_VERIFIKOVANI se vraća Protokolu
          await vratiPoenProtokolu(
            tx,
            v.verifikovaniId,
            POEN_VERIFIKOVANI,
            `Poništavanje verifikacije zbog brisanja verifikatora (čl. 34)`
          );
          // POEN_NADZORNIK se vraća ako je veza bila pod nadzorom
          if (v.podlezeNadzoru && v.nadzornikId) {
            await vratiPoenProtokolu(
              tx,
              v.nadzornikId,
              POEN_NADZORNIK,
              `Poništavanje nadzora zbog brisanja verifikatora (čl. 34)`
            );
          }

          // Reizračunaj indeks verifikovanog (broj preostalih veza ka njemu - 1
          // jer trenutnu još nismo obrisali u istoj transakciji)
          const ostalo = await tx.verifikacionaVeza.count({
            where: { verifikovaniId: v.verifikovaniId, id: { not: v.id } },
          });
          const noviIndeks = izracunajIndeks(ostalo);
          if (ostalo === 0) {
            // Verifikovani se vraća u status NEVERIFIKOVAN
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
              data: { indeksStvarnosti: noviIndeks },
            });
          }
        }

        // 2b) Veze gde je obrisani VERIFIKOVANI
        for (const v of vezeKaoVerifikovani) {
          // POEN_VERIFIKATOR se vraća Protokolu
          await vratiPoenProtokolu(
            tx,
            v.verifikatorId,
            POEN_VERIFIKATOR,
            `Poništavanje verifikacije zbog brisanja verifikovanog (čl. 34)`
          );
          // POEN_NADZORNIK se vraća ako je veza bila pod nadzorom
          if (v.podlezeNadzoru && v.nadzornikId) {
            await vratiPoenProtokolu(
              tx,
              v.nadzornikId,
              POEN_NADZORNIK,
              `Poništavanje nadzora zbog brisanja verifikovanog (čl. 34)`
            );
          }

          // Vrati slot verifikatoru ako je REGULARNI (slot je bio potrošen pri ovoj
          // verifikaciji); POCETNI i NOSILAC_ZRNA ne troše slotove.
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

        // 2c) Obriši sve veze gde je obrisani jedna od strana
        await tx.verifikacionaVeza.deleteMany({
          where: {
            OR: [{ verifikatorId: userId }, { verifikovaniId: userId }],
          },
        });

        // 2d) Veze gde je obrisani bio NADZORNIK (a ne strana) — postavi nadzornikId = null
        await tx.verifikacionaVeza.updateMany({
          where: { nadzornikId: userId },
          data: { nadzornikId: null },
        });
      },
      { timeout: 30_000 }
    );
  }

  // --- 3. Prenesi POEN balans ---
  const svezWallet = await prisma.wallet.findUnique({ where: { userId } });
  const balans = svezWallet?.balance ?? 0;

  if (balans > 0) {
    if (primalacPseudonim) {
      // Prenesi zadatom korisniku
      const primalac = await prisma.user.findUnique({
        where: { pseudonim: primalacPseudonim },
        include: { wallet: true },
      });

      if (!primalac || !primalac.wallet) {
        return NextResponse.json({ error: "Primalac POEN-a nije pronađen." }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({ where: { userId }, data: { balance: 0 } });
        await tx.wallet.update({ where: { id: primalac.wallet!.id }, data: { balance: { increment: balans } } });
        await tx.transaction.create({
          data: {
            fromWalletId: svezWallet!.id,
            toWalletId: primalac.wallet!.id,
            amount: balans,
            type: TransactionType.TRANSFER,
            description: `Prenos pri deaktivaciji naloga`,
          },
        });
      });
    } else {
      // Poništavanje zapisa POEN-a (čl. 34 st. 2): protivzapis Protokola umanjen,
      // zero-sum invarijanta očuvana.
      await prisma.$transaction(async (tx) => {
        await tx.wallet.update({ where: { userId }, data: { balance: 0 } });
        await tx.wallet.update({ where: { id: PROTOKOL_WALLET_ID }, data: { balance: { increment: balans } } });
        await tx.transaction.create({
          data: {
            fromWalletId: svezWallet!.id,
            toWalletId: PROTOKOL_WALLET_ID,
            amount: balans,
            type: TransactionType.TRANSFER,
            description: `Poništavanje POEN-a pri prestanku statusa (čl. 34 Pravilnika v3.7.5)`,
          },
        });
      });
    }
  }

  // --- 4. Napusti krug ako je krugar ---
  for (const m of user.krugClanstva) {
    await prisma.krugClanstvo.update({
      where: { id: m.id },
      data: { leftAt: new Date() },
    });
  }

  // --- 5. Anonimizuj i deaktiviraj u jednoj transakciji ---
  await prisma.$transaction(async (tx) => {
    // Obriši aktivne autentifikacione i verifikacione tokene
    await tx.verifikacijaToken.deleteMany({ where: { korisnikId: userId } });
    await tx.passwordResetToken.deleteMany({ where: { userId } });

    // Anonimizuj lične podatke User entiteta
    await tx.user.update({
      where: { id: userId },
      data: {
        email: null,
        passwordHash: null,
        pseudonim: `obrisani-korisnik-${userId.slice(0, 8)}`,
        telefon: null,
        location: null,
        avatar: null,
        oauthProvider: null,
        oauthId: null,
        status: UserStatus.EXCLUDED,
        deaktiviranAt: new Date(),
      },
    });

    // Anonimizuj UserPodaci (dobrovoljno uneti podaci — čl. 34 st. 4)
    await tx.userPodaci.updateMany({
      where: { userId },
      data: { punoIme: null, opis: null },
    });
  });

  // Obriši avatar sa Vercel Blob-a (ako je tamo) — sprečava orphan fajlove.
  // Legacy base64 avatari nemaju URL, pa se preskaču. Ne sme da obori brisanje.
  if (user.avatar?.startsWith("http")) {
    await del(user.avatar).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
