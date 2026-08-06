/**
 * Slanje email-ova korisnicima (Resend) — zajednički šablon i dispečer.
 *
 * Dva sloja:
 *   1. `posaljiEmailRaw` / `emailLayout` — niski nivo, koristi ga i reset lozinke
 *      (`passwordReset.ts`), koji je SISTEMSKI mejl i ne poštuje opt-out.
 *   2. `posaljiEmailKorisniku` — obaveštenja o događajima. Poštuje opt-out
 *      (`User.emailObavestenja`), preskače naloge bez email adrese i ugašene
 *      naloge, i u podnožje ubacuje link za odjavu.
 *
 * Nikad ne baca grešku — kao `adminAlert` i `push`. Mejl je propratni kanal;
 * zvonce u aplikaciji radi nezavisno i ne sme da padne ako Resend zakaže.
 *
 * Env varijable (Vercel, sva okruženja):
 *   RESEND_API_KEY  — API ključ sa resend.com (bez njega je slanje no-op)
 *   RESEND_FROM     — pošiljalac, npr. "KOLO <noreply@ekolo.rs>" (opciono)
 *   NEXTAUTH_URL    — bazni URL za linkove u mejlu (fallback NEXT_PUBLIC_BASE_URL)
 *
 * Jezik: tekst obaveštenja se generiše na pozivnim mestima na srpskom (isto kao
 * zvonce u aplikaciji), pa su i mejlovi na srpskom. `User.jezik` se ovde još ne
 * koristi — prevođenje bi tražilo da se prevedu i sami tekstovi notifikacija.
 */
import { randomBytes } from "crypto";
import { prisma } from "./prisma";

/** Dozvoljeni host-ovi za linkove u mejlu — sprečava host-header poisoning. */
function jeDozvoljenHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "ekolo.rs" || h === "www.ekolo.rs") return true;
  if (h === "localhost" || h.startsWith("localhost:")) return true;
  if (h.endsWith(".vercel.app")) return true;
  return false;
}

/**
 * Bazni URL za linkove u mejlu. Prioritet: origin sa kog je zahtev poslat
 * (test → test, prod → prod), uz allowlist; fallback na env varijablu.
 * Pozadinski poslovi (cron, servisi) nemaju origin i uvek padaju na env.
 */
export function bazniUrl(requestOrigin?: string): string {
  if (requestOrigin) {
    try {
      const u = new URL(requestOrigin);
      if (jeDozvoljenHost(u.host)) return `${u.protocol}//${u.host}`;
    } catch {
      // neispravan origin — pada na fallback ispod
    }
  }
  const url = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL;
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}

/** Minimalno HTML escapovanje — tekst notifikacija ide iz baze/korisničkog unosa. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface EmailLayoutOpts {
  naslov: string;
  /** Pozdrav u prvom redu, npr. pseudonim. Izostavi za bezlične mejlove. */
  pozdrav?: string;
  /** Pasusi tela. Već escapovani ili sigurni (ne prosleđivati sirov korisnički unos). */
  telo: string[];
  dugme?: { tekst: string; link: string };
  /** Dodatni red u podnožju (npr. link za odjavu) — sme da sadrži HTML. */
  podnozje?: string;
}

/** Zajednički HTML šablon svih KOLO mejlova (jedna vizuelna forma). */
export function emailLayout(o: EmailLayoutOpts): string {
  const pasusi = o.telo
    .map((p) => `<p style="margin:0 0 12px;line-height:1.55;">${p}</p>`)
    .join("");

  const dugme = o.dugme
    ? `
      <p style="margin:20px 0;text-align:center;">
        <a href="${o.dugme.link}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          ${esc(o.dugme.tekst)}
        </a>
      </p>
      <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
        Ako dugme ne radi, otvorite ovaj link u pregledaču:
      </p>
      <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#16a34a;">
        ${o.dugme.link}
      </p>`
    : "";

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#374151;">
      <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">${esc(o.naslov)}</h2>
      ${o.pozdrav ? `<p style="margin:0 0 12px;">Pozdrav <strong>${esc(o.pozdrav)}</strong>,</p>` : ""}
      ${pasusi}
      ${dugme}
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
        KOLO Platforma — automatska poruka. Ne odgovarajte na ovaj email.
        ${o.podnozje ? `<br>${o.podnozje}` : ""}
      </p>
    </div>
  `;
}

/**
 * Pošalji mejl preko Resend-a. Vraća `true` ako je Resend prihvatio poruku.
 * Ne baca — pozivalac odlučuje da li mu je neuspeh bitan.
 */
export async function posaljiEmailRaw(
  to: string,
  subject: string,
  html: string,
  kontekst = "email",
): Promise<boolean> {
  // Env se čita u runtime-u (ne module-level) da bi se promena na Vercel-u
  // odmah pokupila, bez ostatka starog keša.
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM ?? "KOLO <noreply@ekolo.rs>";
  if (!RESEND_KEY) {
    console.error(`[${kontekst}] RESEND_API_KEY nije postavljen — email nije poslat`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[${kontekst}] Resend HTTP ${res.status}: ${errText}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[${kontekst}] Neočekivana greška pri slanju:`, err);
    return false;
  }
}

/**
 * Dohvati (ili lenjo napravi) trajni token za odjavu iz mejlova.
 * Token je nasumičan i ne otkriva ni identitet ni email adresu.
 */
export async function dohvatiOdjavaToken(userId: string): Promise<string | null> {
  try {
    const u = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailOdjavaToken: true },
    });
    if (u?.emailOdjavaToken) return u.emailOdjavaToken;

    const token = randomBytes(24).toString("hex");
    await prisma.user.update({ where: { id: userId }, data: { emailOdjavaToken: token } });
    return token;
  } catch (err) {
    console.error("[email] Token za odjavu nije napravljen:", err);
    return null;
  }
}

/** Najveći broj poruka u jednom Resend batch pozivu (ograničenje servisa). */
export const BATCH_MAX = 100;

export interface BatchStavka {
  to: string;
  subject: string;
  html: string;
}

/**
 * Pošalji do `BATCH_MAX` poruka jednim pozivom (Resend batch endpoint).
 * Vraća `true` ako je servis prihvatio celu porciju. Ne baca.
 *
 * Batch se koristi samo za cirkularna sistemska obaveštenja — pojedinačna
 * obaveštenja idu preko `posaljiEmailRaw`, jednu po jednu.
 */
export async function posaljiEmailBatch(
  stavke: BatchStavka[],
  kontekst = "batch",
): Promise<boolean> {
  if (stavke.length === 0) return true;
  if (stavke.length > BATCH_MAX) {
    console.error(`[${kontekst}] Porcija veća od ${BATCH_MAX} — odbijeno`);
    return false;
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM ?? "KOLO <noreply@ekolo.rs>";
  if (!RESEND_KEY) {
    console.error(`[${kontekst}] RESEND_API_KEY nije postavljen — porcija nije poslata`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stavke.map((s) => ({ from: RESEND_FROM, ...s }))),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[${kontekst}] Resend HTTP ${res.status}: ${errText}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[${kontekst}] Neočekivana greška pri slanju porcije:`, err);
    return false;
  }
}

export interface ObavestenjeEmail {
  /** Naslov mejla i naslov u telu (isti tekst kao zvonce). */
  naslov: string;
  /** Telo obaveštenja — jedan pasus, isti tekst kao zvonce. */
  tekst: string;
  /** Relativna putanja u aplikaciji, npr. "/verifikacija". */
  link?: string;
  /** Tekst dugmeta; podrazumevano „Otvori u aplikaciji". */
  linkTekst?: string;
}

/**
 * Pošalji obaveštajni mejl korisniku, uz poštovanje opt-out-a.
 *
 * Preskače: nalog bez email adrese, ugašen (`deaktiviranAt`) nalog i korisnika
 * koji je isključio email obaveštenja. Pozivaj kao `void posaljiEmailKorisniku(...)`
 * — nikad ne baca i ne sme da blokira odgovor API rute.
 */
export async function posaljiEmailKorisniku(
  userId: string,
  o: ObavestenjeEmail,
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        pseudonim: true,
        emailObavestenja: true,
        deaktiviranAt: true,
      },
    });
    if (!user?.email) return;
    if (user.deaktiviranAt) return;
    if (!user.emailObavestenja) return;

    const baza = bazniUrl();
    const token = await dohvatiOdjavaToken(userId);
    const podnozje = token
      ? `<a href="${baza}/odjava-obavestenja/${token}" style="color:#9ca3af;">Isključi ovakva obaveštenja</a>`
      : undefined;

    const html = emailLayout({
      naslov: o.naslov,
      pozdrav: user.pseudonim,
      telo: [esc(o.tekst)],
      dugme: o.link
        ? { tekst: o.linkTekst ?? "Otvori u aplikaciji", link: `${baza}${o.link}` }
        : undefined,
      podnozje,
    });

    await posaljiEmailRaw(user.email, `${o.naslov} — KOLO`, html, "obavestenje");
  } catch (err) {
    console.error("[email] Obaveštenje nije poslato:", err);
  }
}
