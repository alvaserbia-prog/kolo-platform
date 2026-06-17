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

async function uniqueMemberHash(): Promise<string> {
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

      // Novi korisnik — kreiraj nalog sa oauthPending=true
      // Privremeni pseudonim (biće promenjen na /oauth/dovrsi)
      const tempPseudonim = `korisnik_${Date.now()}`;
      const memberHash = await uniqueMemberHash();

      // Ime i avatar iz Google profila
      const punoIme = user.name ?? undefined;
      const avatar = user.image ?? undefined;

      const newUser = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            passwordHash: undefined,
            pseudonim: tempPseudonim,
            oauthProvider: provider,
            oauthId,
            oauthPending: true,
            memberHash,
            avatar,
            wallet: { create: { type: WalletType.USER, balance: 0 } },
          },
        });
        // Upiši punoIme u UserPodaci
        if (punoIme) {
          await tx.userPodaci.create({
            data: { userId: created.id, punoIme },
          });
        }
        return created;
      });

      user.id = newUser.id;
      user.pseudonim = newUser.pseudonim;
      user.tipKorisnika = newUser.tipKorisnika;
      user.admin = newUser.admin;
      user.verified = newUser.verified;
      user.oauthPending = true;
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.pseudonim = user.pseudonim;
        token.tipKorisnika = user.tipKorisnika;
        token.admin = user.admin;
        token.verified = user.verified;
        token.oauthPending = user.oauthPending ?? false;
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
      session.user.id = token.id;
      session.user.pseudonim = token.pseudonim;
      session.user.tipKorisnika = token.tipKorisnika as string;
      session.user.admin = (token.admin as string) ?? "NONE";
      session.user.verified = (token.verified as boolean) ?? false;
      session.user.oauthPending = (token.oauthPending as boolean) ?? false;
      return session;
    },
  },
};
