import { withAuth } from "next-auth/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const localeCookie = req.cookies.get("NEXT_LOCALE")?.value;
    const locale = routing.locales.includes(localeCookie as (typeof routing.locales)[number])
      ? localeCookie!
      : routing.defaultLocale;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("X-NEXT-INTL-LOCALE", locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const javneRute = [
          "/", "/pijaca", "/kako-funkcionise", "/uslovi",
          "/privatnost", "/m", "/politika-prihvati", "/pokrovitelji",
        ];
        if (javneRute.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!login|registracija|oauth|api/auth|api/registracija|api/oauth|api/javno|api/provjeri-pseudonim|api/m|_next/static|_next/image|favicon.ico|kolo-logo.png|kolo-icon.png|kolo-hero-logo.png).*)",
  ],
};
