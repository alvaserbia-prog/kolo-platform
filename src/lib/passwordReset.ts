import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 1;
const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM ?? "KOLO <noreply@kolo.rs>";

function getBaseUrl(): string {
  const url = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL;
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}

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
  pseudonim: string
): Promise<void> {
  if (!RESEND_KEY) {
    console.error("[passwordReset] RESEND_API_KEY nije postavljen — email nije poslat");
    return;
  }

  const link = `${getBaseUrl()}/reset-lozinka/${token}`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#374151;">
      <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">Resetovanje lozinke</h2>
      <p style="margin:0 0 12px;">Pozdrav <strong>${pseudonim}</strong>,</p>
      <p style="margin:0 0 12px;">
        Primili smo zahtev za resetovanje lozinke za vaš KOLO nalog.
        Ako niste vi pokrenuli ovaj zahtev, slobodno ignorišite ovu poruku.
      </p>
      <p style="margin:0 0 20px;">
        Da postavite novu lozinku, kliknite na dugme ispod. Link važi <strong>1 sat</strong>.
      </p>
      <p style="margin:0 0 20px;text-align:center;">
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Postavi novu lozinku
        </a>
      </p>
      <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
        Ako dugme ne radi, otvorite ovaj link u pregledaču:
      </p>
      <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#16a34a;">
        ${link}
      </p>
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
        KOLO Platforma — automatska poruka. Ne odgovarajte na ovaj email.
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: email,
      subject: "Resetovanje lozinke — KOLO",
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`[passwordReset] Resend HTTP ${res.status}: ${errText}`);
    throw new Error("Email nije poslat");
  }
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

