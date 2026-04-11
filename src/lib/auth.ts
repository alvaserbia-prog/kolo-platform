import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { WalletType } from "@/generated/prisma/client";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateReferralCode(): string {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

function generateMemberHash(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let hash = "";
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

async function uniqueReferralCode(): Promise<string> {
  let code = generateReferralCode();
  while (await prisma.user.findUnique({ where: { referralCode: code } })) {
    code = generateReferralCode();
  }
  return code;
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
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.status !== "ACTIVE") return null;

        return {
          id: user.id,
          email: user.email,
          pseudonim: user.pseudonim,
          role: user.role,
          verified: user.verified,
          oauthPending: user.oauthPending,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Credentials — provera je u authorize()
      if (account?.provider === "credentials") return true;

      // OAuth (Google / Facebook)
      const email = user.email;
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
        user.role = existing.role;
        user.verified = existing.verified;
        user.oauthPending = existing.oauthPending;
        return true;
      }

      // Novi korisnik — kreiraj nalog sa oauthPending=true
      // Privremeni pseudonim (biće promenjen na /oauth/dovrsi)
      const tempPseudonim = `korisnik_${Date.now()}`;
      const referralCode = await uniqueReferralCode();
      const memberHash = await uniqueMemberHash();

      const newUser = await prisma.$transaction(async (tx) => {
        return tx.user.create({
          data: {
            email,
            passwordHash: undefined,
            pseudonim: tempPseudonim,
            oauthProvider: provider,
            oauthId,
            oauthPending: true,
            referralCode,
            memberHash,
            wallet: { create: { type: WalletType.USER, balance: 0 } },
          },
        });
      });

      user.id = newUser.id;
      user.pseudonim = newUser.pseudonim;
      user.role = newUser.role;
      user.verified = newUser.verified;
      user.oauthPending = true;
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.pseudonim = user.pseudonim;
        token.role = user.role;
        token.verified = user.verified;
        token.oauthPending = user.oauthPending ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.pseudonim = token.pseudonim;
      session.user.role = token.role;
      session.user.oauthPending = (token.oauthPending as boolean) ?? false;
      // Uvek čitaj verified iz baze — JWT može biti zastareo
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { verified: true, oauthPending: true },
        });
        session.user.verified = dbUser?.verified ?? (token.verified as boolean);
        session.user.oauthPending = dbUser?.oauthPending ?? (token.oauthPending as boolean) ?? false;
      } else {
        session.user.verified = token.verified as boolean ?? false;
      }
      return session;
    },
  },
};
