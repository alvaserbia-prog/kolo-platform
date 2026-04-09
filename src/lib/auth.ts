import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
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
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.status !== "ACTIVE") return null;

        return {
          id: user.id,
          email: user.email,
          pseudonim: user.pseudonim,
          role: user.role,
          verified: user.verified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.pseudonim = user.pseudonim;
        token.role = user.role;
        token.verified = user.verified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.pseudonim = token.pseudonim;
      session.user.role = token.role;
      // Uvek čitaj verified iz baze — JWT može biti zastareo
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { verified: true },
        });
        session.user.verified = dbUser?.verified ?? (token.verified as boolean);
      } else {
        session.user.verified = token.verified as boolean ?? false;
      }
      return session;
    },
  },
};
