import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { WalletType } from "@/generated/prisma/client";
import { normalizujEmail, validanEmail, validanPseudonim } from "@/lib/validacija";
import { rateLimit, klijentIP } from "@/lib/rate-limit";
import { obavestiAdmineNoviKorisnik } from "@/lib/notifikacije";
import { posaljiAdminAlert } from "@/lib/adminAlert";

function generateMemberHash(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let hash = "";
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export async function POST(req: NextRequest) {
  try {
    // Rate-limit: najviše 10 registracija po IP-u na sat (anti-spam).
    const rl = rateLimit(`registracija:${klijentIP(req)}`, 10, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Previše pokušaja. Pokušajte kasnije." }, { status: 429 });
    }

    const body = await req.json();
    const { email, pseudonim, password } = body;
    const location = typeof body.location === "string" ? body.location.trim() : null;

    // Validacija — striktne provere tipova (bez biblioteke): array/objekat sa `.length`
    // ne sme da prođe kao string.
    if (typeof email !== "string" || typeof pseudonim !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Sva obavezna polja moraju biti popunjena." }, { status: 400 });
    }
    if (!validanEmail(email)) {
      return NextResponse.json({ error: "Unesite ispravnu email adresu." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 200) {
      return NextResponse.json({ error: "Lozinka mora imati između 8 i 200 karaktera." }, { status: 400 });
    }
    if (!validanPseudonim(pseudonim)) {
      return NextResponse.json(
        { error: "Pseudonim: 3–30 znakova, samo slova, brojevi, razmak, _ . -" },
        { status: 400 }
      );
    }
    if (location !== null && location.length > 80) {
      return NextResponse.json({ error: "Mesto je predugačko." }, { status: 400 });
    }

    const emailNorm = normalizujEmail(email);
    const pseudonimClean = pseudonim.trim();

    // Provera jedinstvenosti (email u kanonskoj formi — bez duplikata zbog velikih slova)
    const [existingEmail, existingPseudonim] = await Promise.all([
      prisma.user.findUnique({ where: { email: emailNorm } }),
      prisma.user.findUnique({ where: { pseudonim: pseudonimClean } }),
    ]);
    if (existingEmail) {
      return NextResponse.json({ error: "Email je već registrovan." }, { status: 409 });
    }
    if (existingPseudonim) {
      return NextResponse.json({ error: "Pseudonim je zauzet." }, { status: 409 });
    }

    // Generiši jedinstven member hash
    let myHash = generateMemberHash();
    while (await prisma.user.findUnique({ where: { memberHash: myHash } })) {
      myHash = generateMemberHash();
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Kreira korisnika + wallet
    const user = await prisma.user.create({
      data: {
        email: emailNorm,
        passwordHash,
        pseudonim: pseudonimClean,
        memberHash: myHash,
        location: location || null,
        wallet: {
          create: { type: WalletType.USER, balance: 0 },
        },
      },
    });

    // Obavesti admine o novom nalogu (ne sme da obori registraciju ako zakaže):
    //  - in-app bell za sve admine,
    //  - Telegram bot + email (stiže na telefon/Windows).
    try {
      await obavestiAdmineNoviKorisnik(user.id, user.pseudonim);
    } catch {
      /* notifikacija nije kritična */
    }
    void posaljiAdminAlert(
      "Nov korisnik se priključio",
      `Pseudonim: ${user.pseudonim}\nNačin: registracija (email)\nVerifikovan: ne`,
    );

    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
