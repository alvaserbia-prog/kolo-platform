import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { kreirajResetToken, posaljiResetEmail } from "@/lib/passwordReset";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Unesite ispravnu email adresu." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Iz bezbednosnih razloga uvek vraćamo isti odgovor — ne otkrivamo da li email postoji.
    // Email se šalje samo ako korisnik postoji, ima lozinku (nije čisto OAuth nalog) i aktivan je.
    if (user && user.passwordHash && user.status === "ACTIVE") {
      try {
        const token = await kreirajResetToken(user.id);
        await posaljiResetEmail(user.email!, token, user.pseudonim);
      } catch (err) {
        console.error("[zaboravljena-lozinka] greška pri slanju:", err);
        // Ne otkrivamo grešku korisniku — ali interno logujemo
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
