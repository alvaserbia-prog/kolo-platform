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
    // Email se šalje za svaki aktivan nalog, bez obzira da li ima lozinku.
    // OAuth-only nalozi dobijaju email sa drugačijim tekstom — "Postavi lozinku" umesto "Resetovanje lozinke".
    if (user && user.status === "ACTIVE") {
      try {
        const token = await kreirajResetToken(user.id);
        const imaLozinku = !!user.passwordHash;
        await posaljiResetEmail(user.email!, token, user.pseudonim, imaLozinku);
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
