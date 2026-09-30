import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      pseudonim: string;
      tipKorisnika: string;
      admin: string;
      verified: boolean;
      /**
       * Identitet utvrđen na donatorskom putu (R-01, mera M-9) — čovek je
       * uporedio uplatioca iz izvoda sa nalogom. NIJE potvrda stvarnosti i ne
       * zamenjuje je; otvara uži skup funkcija (vidi `smeProsireno`).
       */
      identitetUtvrdjen: boolean;
      /** Maloletni nalog — za njega se GA ne učitava. `undefined` = još nepoznato. */
      maloletan?: boolean;
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
    identitetUtvrdjen?: boolean;
    maloletan?: boolean;
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
    identitetUtvrdjen?: boolean;
    maloletan?: boolean;
    oauthPending?: boolean;
    // Vreme (ms) poslednjeg osvežavanja statusa iz baze — throttle u jwt callbacku
    osvezenoAt?: number;
    // Podaci nedovršene OAuth registracije
    pendingEmail?: string;
    pendingProvider?: string;
    pendingOauthId?: string;
    pendingPunoIme?: string;
    pendingAvatar?: string;
  }
}
