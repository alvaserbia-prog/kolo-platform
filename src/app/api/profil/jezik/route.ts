import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Dozvoljeni jezici (next-intl locale). Mora da prati src/i18n/routing.ts.
// "hu" i "hr" su zamrznuti (neaktivni) — vidi routing.ts.
// "ru" je u pripremi: prihvata se ovde (locale je aktivan), ali još nije u
// prekidaču jezika — vidi docs/i18n-ruski-plan.md.
const JEZICI = ["sr", "sr-Cyrl", "en", "ru"];

/**
 * Trajno čuva izabrani jezik prijavljenog korisnika (za notifikacije/email i
 * podrazumevani prikaz po prijavi). Neprijavljeni: tih no-op (jezik im čuva cookie).
 */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: true }); // gost — samo cookie, bez greške

  const body = await req.json().catch(() => ({}));
  const jezik = typeof body.jezik === "string" ? body.jezik : "";
  if (!JEZICI.includes(jezik)) {
    return NextResponse.json({ error: "Nepoznat jezik." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { jezik },
  });

  return NextResponse.json({ ok: true });
}
