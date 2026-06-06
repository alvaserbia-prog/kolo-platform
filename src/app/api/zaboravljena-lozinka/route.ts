import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { kreirajResetToken, posaljiResetEmail } from "@/lib/passwordReset";
import { posaljiAdminAlert } from "@/lib/adminAlert";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Unesite ispravnu email adresu." }, { status: 400 });
    }

    const trazeniEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: trazeniEmail } });

    // Iz bezbednosnih razloga uvek vraćamo isti odgovor — ne otkrivamo da li email postoji.
    // Email se šalje za svaki aktivan nalog, bez obzira da li ima lozinku.
    // OAuth-only nalozi dobijaju email sa drugačijim tekstom — "Postavi lozinku" umesto "Resetovanje lozinke".
    if (user && user.status === "ACTIVE") {
      try {
        const token = await kreirajResetToken(user.id);
        const imaLozinku = !!user.passwordHash;
        const origin = new URL(req.url).origin;
        await posaljiResetEmail(user.email!, token, user.pseudonim, imaLozinku, origin);
      } catch (err) {
        console.error("[zaboravljena-lozinka] greška pri slanju:", err);
      }
    } else {
      // Debug alert — javlja zašto email NIJE poslat (nalog ne postoji ili nije aktivan)
      void posaljiAdminAlert(
        "Reset lozinke — nalog NIJE pronađen",
        `Trazeni email: ${trazeniEmail}\nNalog postoji: ${!!user}\nStatus: ${user?.status ?? "n/a"}`
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Interna greška servera." }, { status: 500 });
  }
}
