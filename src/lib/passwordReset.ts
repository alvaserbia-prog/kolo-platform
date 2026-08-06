import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { posaljiAdminAlert } from "@/lib/adminAlert";
import { bazniUrl, emailLayout, posaljiEmailRaw } from "@/lib/email";

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 1;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function kreirajResetToken(userId: string): Promise<string> {
  // Poništi sve aktivne tokene za korisnika
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  });

  const token = randomBytes(TOKEN_BYTES).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return token;
}

export async function posaljiResetEmail(
  email: string,
  token: string,
  pseudonim: string,
  imaLozinku: boolean,
  requestOrigin?: string
): Promise<void> {
  const link = `${bazniUrl(requestOrigin)}/reset-lozinka/${token}`;

  const naslov = imaLozinku ? "Resetovanje lozinke" : "Postavljanje lozinke";
  const subject = imaLozinku
    ? "Resetovanje lozinke — KOLO"
    : "Postavljanje lozinke — KOLO";
  const dugme = imaLozinku ? "Postavi novu lozinku" : "Postavi lozinku";
  const uvod = imaLozinku
    ? "Primili smo zahtev za resetovanje lozinke za vaš KOLO nalog."
    : "Primili smo zahtev za postavljanje lozinke za vaš KOLO nalog. Trenutno se prijavljujete preko Google-a — postavljanjem lozinke moći ćete da se prijavljujete i preko forme sa email-om i lozinkom.";
  const pozivNaAkciju = imaLozinku
    ? "Da postavite novu lozinku, kliknite na dugme ispod."
    : "Da postavite lozinku, kliknite na dugme ispod.";

  // Sistemski mejl — NE poštuje `emailObavestenja` opt-out (bez njega korisnik
  // ne može da povrati pristup nalogu) i nema link za odjavu u podnožju.
  const html = emailLayout({
    naslov,
    pozdrav: pseudonim,
    telo: [
      `${uvod} Ako niste vi pokrenuli ovaj zahtev, slobodno ignorišite ovu poruku.`,
      `${pozivNaAkciju} Link važi <strong>1 sat</strong>.`,
    ],
    dugme: { tekst: dugme, link },
  });

  const poslat = await posaljiEmailRaw(email, subject, html, "passwordReset");

  if (!poslat) {
    void posaljiAdminAlert(
      "Reset lozinke — Resend greška",
      `Email: ${email}\nTip: ${imaLozinku ? "reset" : "postavljanje"}\nDetalji u logu funkcije.`
    );
    throw new Error("Email nije poslat");
  }

  // Uspešno poslat — admin alert za debugging
  void posaljiAdminAlert(
    "Reset lozinke — email poslat",
    `Za: ${email}\nTip: ${imaLozinku ? "reset" : "postavljanje"}\nLink važi 1h.`
  );
}

export async function verifikujResetToken(token: string): Promise<{ userId: string; tokenId: string } | null> {
  const tokenHash = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;
  return { userId: record.userId, tokenId: record.id };
}

