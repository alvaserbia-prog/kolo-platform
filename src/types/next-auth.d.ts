import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      pseudonim: string;
      tipKorisnika: string;
      admin: string;
      verified: boolean;
      oauthPending: boolean;
      // Podaci nedovršene OAuth registracije (još nema reda u bazi)
      pendingEmail?: string;
      pendingProvider?: string;
      pendingOauthId?: string;
      pendingPunoIme?: string;
      pendingAvatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    pseudonim: string;
    tipKorisnika: string;
    admin?: string;
    verified: boolean;
    oauthPending?: boolean;
    // Markeri/podaci za odloženo kreiranje OAuth naloga (signIn → /oauth/dovrsi)
    needsRegistration?: boolean;
    oauthProvider?: string;
    oauthId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    pseudonim: string;
    tipKorisnika: string;
    admin?: string;
    verified: boolean;
    oauthPending?: boolean;
    // Podaci nedovršene OAuth registracije
    pendingEmail?: string;
    pendingProvider?: string;
    pendingOauthId?: string;
    pendingPunoIme?: string;
    pendingAvatar?: string;
  }
}
