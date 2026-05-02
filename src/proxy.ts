import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const JAVNE_RUTE = [
  "/", "/pijaca", "/kako-funkcionise", "/uslovi",
  "/privatnost", "/m", "/politika-prihvati", "/pokrovitelji", "/o-nama", "/o-sistemu",
  "/cesto-postavljena-pitanja", "/pravilnik", "/statut",
];

const PRESKOCI = [
  "/login", "/registracija", "/oauth",
  "/api/", "/_next", "/favicon.ico",
  "/kolo-logo.png", "/kolo-icon.png", "/kolo-hero-logo.png", "/nikola-saric.png", "/flags/",
];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
    "/((?!_next/static|_next/image|favicon.ico|kolo-logo.png|kolo-icon.png|kolo-hero-logo.png|nikola-saric.png|flags).*)",
  ],
};
