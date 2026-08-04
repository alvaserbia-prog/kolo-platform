import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, uniqueMemberHash } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizujEmail, validanPseudonim, PSEUDONIM_PRAVILO } from "@/lib/validacija";
import { poljaPseudonima, porukaZauzeca, proveriZauzece } from "@/lib/pseudonim";
import { WalletType } from "@/generated/prisma/client";
import { obavestiAdmineNoviKorisnik } from "@/lib/notifikacije";
import { posaljiAdminAlert } from "@/lib/adminAlert";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Pristup samo nedovršenoj OAuth registraciji.
  if (!session?.user?.oauthPending) {
    return NextResponse.json({ error: "Nalog je već podešen." }, { status: 400 });
  }

  const body = await req.json();
  const { pseudonim } = body;

  if (!validanPseudonim(pseudonim)) {
    return NextResponse.json({ error: PSEUDONIM_PRAVILO }, { status: 400 });
  }
  const trimmed = pseudonim.trim();

  // Nalog se ovde tek dobija pseudonim (nije preimenovanje), pa se izuzima sopstveni
  // red — placeholder koji je eventualno stajao u njemu ne ide u istoriju napuštenih.
  const zauzece = await proveriZauzece(trimmed, session.user.id);
  if (zauzece) {
    return NextResponse.json({ error: porukaZauzeca(zauzece) }, { status: 409 });
  }

  // Legacy slučaj: red već postoji u bazi (stari tok ili napola dovršen nalog) — ažuriraj ga.
  if (session.user.id) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { ...poljaPseudonima(trimmed), oauthPending: false },
    });
    return NextResponse.json({ ok: true, userId: session.user.id });
  }

  // Novi tok: nalog se kreira tek sada (do ovog koraka ničega nije bilo u bazi).
  const email = normalizujEmail(session.user.pendingEmail);
  if (!email) {
    return NextResponse.json({ error: "Nedostaju podaci o nalogu. Prijavite se ponovo." }, { status: 400 });
  }

  // Idempotentno: ako je nalog s ovim email-om u međuvremenu nastao (dupli submit),
  // ne pravi duplikat — samo dovrši postojeći.
  const postojeci = await prisma.user.findUnique({ where: { email } });
  if (postojeci) {
    await prisma.user.update({
      where: { id: postojeci.id },
      data: { ...poljaPseudonima(trimmed), oauthPending: false },
    });
    return NextResponse.json({ ok: true, userId: postojeci.id });
  }

  const memberHash = await uniqueMemberHash();
  const created = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: {
        email,
        passwordHash: undefined,
        ...poljaPseudonima(trimmed),
        oauthProvider: session.user.pendingProvider,
        oauthId: session.user.pendingOauthId,
        oauthPending: false,
        memberHash,
        avatar: session.user.pendingAvatar ?? undefined,
        wallet: { create: { type: WalletType.USER, balance: 0 } },
      },
    });
    if (session.user.pendingPunoIme) {
      await tx.userPodaci.create({
        data: { userId: u.id, punoIme: session.user.pendingPunoIme },
      });
    }
    return u;
  });

  // Obavesti admine o novom nalogu (in-app bell + Telegram/email; telefon/Windows).
  try {
    await obavestiAdmineNoviKorisnik(created.id, trimmed);
  } catch {
    /* notifikacija nije kritična */
  }
  void posaljiAdminAlert(
    "Nov korisnik se priključio",
    `Pseudonim: ${trimmed}\nNačin: ${session.user.pendingProvider ?? "OAuth"}\nVerifikovan: ne`,
  );

  return NextResponse.json({ ok: true, userId: created.id });
}
