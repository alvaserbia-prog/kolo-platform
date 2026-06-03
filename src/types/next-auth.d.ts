import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      pseudonim: string;
      tipKorisnika: string;
      verified: boolean;
      oauthPending: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    pseudonim: string;
    tipKorisnika: string;
    verified: boolean;
    oauthPending?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    pseudonim: string;
    tipKorisnika: string;
    verified: boolean;
    oauthPending?: boolean;
  }
}
