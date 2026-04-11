import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const JAVNE_RUTE = ["/", "/pijaca", "/kako-funkcionise", "/uslovi", "/privatnost", "/m", "/politika-prihvati", "/pokrovitelji"];

const PRESKOCI = [
  "/login", "/registracija", "/oauth",
  "/api/auth", "/api/registracija", "/api/oauth",
  "/api/javno", "/api/provjeri-pseudonim", "/api/m",
  "/_next", "/favicon.ico", "/kolo-logo.png", "/kolo-icon.png", "/kolo-hero-logo.png",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Preskoci sve API rute i staticke fajlove
  if (pathname.startsWith("/api/") || PRESKOCI.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const isJavna = JAVNE_RUTE.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (!isJavna) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|kolo-logo.png|kolo-icon.png|kolo-hero-logo.png).*)"],
};
