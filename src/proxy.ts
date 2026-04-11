import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const JAVNE_RUTE = ["/", "/pijaca", "/kako-funkcionise", "/uslovi", "/privatnost", "/m", "/politika-prihvati", "/pokrovitelji"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Preskoci API i statičke rute
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.startsWith("/oauth")) {
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
    return NextResponse.redirect(new URL("/sistem", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|registracija|_next/static|_next/image|favicon.ico|kolo-logo.png|kolo-icon.png|kolo-hero-logo.png).*)"],
};
