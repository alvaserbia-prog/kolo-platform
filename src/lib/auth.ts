import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { WalletType } from "@/generated/prisma/client";
import { RANI_PRISTUP_COOKIE, validanRaniPristup } from "@/lib/rani-pristup";
import { FUNKCIONALNI_PRAG_INDEKSA } from "@/lib/protokol/dokaz-stvarnosti";
import { normalizujEmail } from "@/lib/validacija";
import { rateLimit } from "@/lib/rate-limit";

/**
 * K5: "pun pristup" (vidljivost pseudonima/profila/grafa) zavisi od FUNKCIONALNOG
 * praga indeksa (≥ 10%), ne od `verified` boolean-a. Pri poništenju lažne verifikacije
 * indeks padne na 0 a `verified` ostaje true (korisnik ostaje REGULARNI, čl. 18) —
 * zato se `session.user.verified` izvodi iz oba uslova, pa kapije po celom kodu
 * automatski uskraćuju pristup kada indeks padne ispod praga.
 */
function imaPunPristup(verified: boolean, indeksStvarnosti: number): boolean {
  return verified && indeksStvarnosti >= FUNKCIONALNI_PRAG_INDEKSA;
}

/**
 * Dok je MAINTENANCE_MODE uključen, prijava je dozvoljena samo ranim prihvatiocima
 * koji su otključali pristup (validan kolačić ranog pristupa).
 */
async function ulazDozvoljen(): Promise<boolean> {
  if (process.env.MAINTENANCE_MODE !== "true") return true;
  try {
    const c = await cookies();
    return validanRaniPristup(c.get(RANI_PRISTUP_COOKIE)?.value);
  } catch {
    return false;
  }
}

function generateMemberHash(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let hash = "";
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export async function uniqueMemberHash(): Promise<string> {
  let hash = generateMemberHash();
  while (await prisma.user.findUnique({ where: { memberHash: hash } })) {
    hash = generateMemberHash();
  }
  return hash;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        if (!(await ulazDozvoljen())) return null;
        if (!credentials?.email || !credentials?.password) return null;

        const emailNorm = normalizujEmail(credentials.email);
        // Anti brute-force / credential-stuffing: 10 pokušaja po nalogu u 15 min.
        if (!rateLimit(`login:${emailNorm}`, 10, 15 * 60 * 1000).ok) return null;

        const user = await prisma.user.findUnique({
          where: { email: emailNorm },
        });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.status !== "ACTIVE") return null;

        return {
          id: user.id,
          email: user.email,
          pseudonim: user.pseudonim,
          tipKorisnika: user.tipKorisnika,
          admin: user.admin,
          verified: imaPunPristup(user.verified, user.indeksStvarnosti),
          oauthPending: user.oauthPending,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!(await ulazDozvoljen())) return false;

      // Credentials — provera je u authorize()
      if (account?.provider === "credentials") return true;

      // OAuth (Google / Facebook) — email u kanonskoj formi (bez duplikata vs credentials nalog)
      const email = normalizujEmail(user.email);
      if (!email) return false;

      const provider = account!.provider;
      const oauthId = account!.providerAccountId;

      const existing = await prisma.user.findUnique({ where: { email } });

      if (existing) {
        // Nalog postoji — samo ažuriraj oauthProvider/oauthId ako nisu postavljeni
        if (!existing.oauthProvider) {
          await prisma.user.update({
            where: { id: existing.id },
            data: { oauthProvider: provider, oauthId },
          });
        }
        if (existing.status !== "ACTIVE") return false;
        user.id = existing.id;
        user.pseudonim = existing.pseudonim;
        user.tipKorisnika = existing.tipKorisnika;
        user.admin = existing.admin;
        user.verified = imaPunPristup(existing.verified, existing.indeksStvarnosti);
        user.oauthPending = existing.oauthPending;
        return true;
      }

      // Novi korisnik — NE pravimo nalog u bazi dok ne dovrši registraciju na
      // /oauth/dovrsi (izbor pseudonima). Do tada podatke nosimo kroz JWT, pa
      // napušteni pokušaji ne ostavljaju „nalog-duh" u bazi. Sam nalog kreira
      // ruta /api/oauth/dovrsi pri izboru pseudonima.
      user.oauthPending = true;
      user.needsRegistration = true;
      user.oauthProvider = provider;
      user.oauthId = oauthId;
      user.email = email; // kanonska forma (već normalizovana iznad)
      // user.name / user.image dolaze iz Google profila (punoIme/avatar)
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (user.needsRegistration) {
          // Nedovršena OAuth registracija — nema reda u bazi; podaci žive u tokenu.
          token.id = undefined;
          token.oauthPending = true;
          token.pendingEmail = user.email ?? undefined;
          token.pendingProvider = user.oauthProvider;
          token.pendingOauthId = user.oauthId;
          token.pendingPunoIme = user.name ?? undefined;
          token.pendingAvatar = user.image ?? undefined;
        } else {
          token.id = user.id;
          token.pseudonim = user.pseudonim;
          token.tipKorisnika = user.tipKorisnika;
          token.admin = user.admin;
          token.verified = user.verified;
          token.oauthPending = user.oauthPending ?? false;
        }
      } else if (trigger === "update" && (session as { userId?: string } | undefined)?.userId) {
        // /oauth/dovrsi je upravo kreirao nalog — preuzmi pravi id i očisti pending podatke.
        const noviId = (session as { userId: string }).userId;
        const dbUser = await prisma.user.findUnique({
          where: { id: noviId },
          select: { verified: true, indeksStvarnosti: true, oauthPending: true, tipKorisnika: true, admin: true, pseudonim: true },
        });
        if (dbUser) {
          token.id = noviId;
          token.pseudonim = dbUser.pseudonim;
          token.tipKorisnika = dbUser.tipKorisnika;
          token.admin = dbUser.admin;
          token.verified = imaPunPristup(dbUser.verified, dbUser.indeksStvarnosti);
          token.oauthPending = dbUser.oauthPending;
          token.pendingEmail = undefined;
          token.pendingProvider = undefined;
          token.pendingOauthId = undefined;
          token.pendingPunoIme = undefined;
          token.pendingAvatar = undefined;
        }
      } else if (token.id) {
        // Osveži admin/verified/tipKorisnika iz baze pri svakom zahtevu —
        // inače middleware (getToken) gleda zastareo JWT i npr. novom adminu
        // i dalje brani /admin dok se ne odjavi/prijavi.
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { verified: true, indeksStvarnosti: true, oauthPending: true, tipKorisnika: true, admin: true, pseudonim: true },
          });
          if (dbUser) {
            token.admin = dbUser.admin;
            // K5: pun pristup zavisi od indeksa ≥ 10%, ne samo od `verified`.
            token.verified = imaPunPristup(dbUser.verified, dbUser.indeksStvarnosti);
            token.tipKorisnika = dbUser.tipKorisnika;
            token.pseudonim = dbUser.pseudonim;
            token.oauthPending = dbUser.oauthPending;
          }
        } catch {
          // zadrži postojeće vrednosti iz JWT-a
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.pseudonim = token.pseudonim;
      session.user.tipKorisnika = token.tipKorisnika as string;
      session.user.admin = (token.admin as string) ?? "NONE";
      session.user.verified = (token.verified as boolean) ?? false;
      session.user.oauthPending = (token.oauthPending as boolean) ?? false;
      // Nedovršena OAuth registracija — izloži podatke koje /api/oauth/dovrsi
      // koristi za kreiranje naloga (nalog još ne postoji u bazi).
      if (token.oauthPending && !token.id) {
        session.user.pendingEmail = token.pendingEmail;
        session.user.pendingProvider = token.pendingProvider;
        session.user.pendingOauthId = token.pendingOauthId;
        session.user.pendingPunoIme = token.pendingPunoIme;
        session.user.pendingAvatar = token.pendingAvatar;
      }
      return session;
    },
  },
};
