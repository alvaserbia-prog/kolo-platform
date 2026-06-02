import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const JAVNE_RUTE = [
  "/", "/pijaca", "/kako-funkcionise", "/uslovi",
  "/privatnost", "/m", "/politika-prihvati", "/pokrovitelji", "/o-nama", "/o-sistemu",
  "/cesto-postavljena-pitanja", "/pravilnik", "/statut", "/uskoro",
];

// Putanje za ulazak u nalog. Kada je MAINTENANCE_MODE uključen (postavlja se
// ISKLJUČIVO na produkciji, ne na testu), preusmeravaju se na /uskoro.
const ZAKLJUCANE_ULAZNE_RUTE = [
  "/login", "/registracija", "/oauth",
  "/zaboravljena-lozinka", "/reset-lozinka",
];

const PRESKOCI = [
  "/login", "/registracija", "/oauth",
  "/zaboravljena-lozinka", "/reset-lozinka",
  "/api/", "/_next", "/favicon.ico", "/icon.png",
  "/kolo-logo.png", "/kolo-icon.png", "/kolo-hero-logo.png", "/nikola-saric.png", "/flags/",
  // SEO/metadata rute — moraju biti javno dostupne pretraživačima (inače bi
  // bot pri pristupu /sitemap.xml ili /robots.txt bio preusmeren na /login).
  "/sitemap.xml", "/robots.txt", "/opengraph-image", "/twitter-image", "/manifest.webmanifest",
];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    process.env.MAINTENANCE_MODE === "true" &&
    ZAKLJUCANE_ULAZNE_RUTE.some((r) => pathname === r || pathname.startsWith(r + "/"))
  ) {
    return NextResponse.redirect(new URL("/uskoro", req.url));
  }

  if (PRESKOCI.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const isJavna = JAVNE_RUTE.some((r) => pathname === r || pathname.startsWith(r + "/"));
  if (isJavna) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|kolo-logo.png|kolo-icon.png|kolo-hero-logo.png|nikola-saric.png|flags).*)",
  ],
};
