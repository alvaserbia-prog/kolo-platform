import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { jeAdmin } from "@/lib/dozvole";
import { RANI_PRISTUP_COOKIE, validanRaniPristup } from "@/lib/rani-pristup";
import { routing } from "@/i18n/routing";

// next-intl middleware: rešava jezički prefiks (/en, /hu, /sr-Cyrl); default
// "sr" ide bez prefiksa. Pozivamo ga ručno NAKON auth/maintenance odluka.
const intlMiddleware = createMiddleware(routing);

// Jezici sa prefiksom (default "sr" je bez prefiksa).
const PREFIKSI = routing.locales.filter((l) => l !== routing.defaultLocale);

/** Skida jezički prefiks (/en, /hu, /sr-Cyrl) da bi se rute proveravale jednoobrazno. */
function bezPrefiksa(pathname: string): string {
  for (const loc of PREFIKSI) {
    if (pathname === `/${loc}`) return "/";
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(loc.length + 1);
  }
  return pathname;
}

// Specijalne rute bez ekstenzije na kojima i18n NE sme da radi (image-gen rute,
// QR kratki linkovi). API/_next/fajlovi su već isključeni `config.matcher`-om.
const BEZ_I18N = ["/m", "/opengraph-image", "/twitter-image"];

const JAVNE_RUTE = [
  "/", "/pijaca", "/kako-funkcionise", "/uslovi",
  "/privatnost", "/m", "/politika-prihvati", "/pokrovitelji", "/o-nama", "/o-sistemu",
  "/cesto-postavljena-pitanja", "/pravilnik", "/statut", "/uskoro", "/rani-pristup",
];

// Putanje za ulazak u nalog. Kada je MAINTENANCE_MODE uključen (postavlja se
// ISKLJUČIVO na produkciji, ne na testu), preusmeravaju se na /uskoro.
const ZAKLJUCANE_ULAZNE_RUTE = [
  "/login", "/registracija", "/oauth",
  "/zaboravljena-lozinka", "/reset-lozinka",
];

// Ulazne (auth) rute koje preskaču proveru prijave, ali i dalje prolaze kroz i18n
// (treba da se renderuju na izabranom jeziku — Opseg B).
const PRESKOCI_AUTH = [
  "/login", "/registracija", "/oauth",
  "/zaboravljena-lozinka", "/reset-lozinka",
];

export default async function proxy(req: NextRequest) {
  const raw = req.nextUrl.pathname;

  // i18n se ne primenjuje na image-gen/QR rute — propusti kako jeste.
  if (BEZ_I18N.some((r) => raw === r || raw.startsWith(r + "/"))) {
    return NextResponse.next();
  }

  // Rute upoređujemo bez jezičkog prefiksa.
  const pathname = bezPrefiksa(raw);

  if (
    process.env.MAINTENANCE_MODE === "true" &&
    ZAKLJUCANE_ULAZNE_RUTE.some((r) => pathname === r || pathname.startsWith(r + "/"))
  ) {
    // Rani prihvatioci sa validnim pristupnim kodom (kolačić) prolaze gate.
    const raniPristup = validanRaniPristup(req.cookies.get(RANI_PRISTUP_COOKIE)?.value);
    if (!raniPristup) {
      return NextResponse.redirect(new URL("/uskoro", req.url));
    }
  }

  // Auth-ulazne i javne rute: bez provere prijave, ali kroz i18n (jezički prefiks).
  if (PRESKOCI_AUTH.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return intlMiddleware(req);
  }

  const isJavna = JAVNE_RUTE.some((r) => pathname === r || pathname.startsWith(r + "/"));
  if (isJavna) return intlMiddleware(req);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", raw);
    return NextResponse.redirect(loginUrl);
  }

  // Fallback na POCETNI tip za stare JWT-ove (pre uvođenja `admin` polja);
  // ukloniti u koraku 7 kad svi tokeni nose `admin`.
  const adminPristup =
    jeAdmin({ admin: token.admin as string | undefined }) ||
    token.tipKorisnika === "POCETNI";
  if (pathname.startsWith("/admin") && !adminPristup) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Prijavljen i dozvoljen pristup — i dalje kroz i18n (da se postavi locale).
  return intlMiddleware(req);
}

export const config = {
  // Isključi API, Next interne putanje i sve fajlove sa ekstenzijom (slike,
  // sitemap.xml, robots.txt, manifest.webmanifest, favicon.ico…).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
