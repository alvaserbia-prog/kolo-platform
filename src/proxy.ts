import createMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

const intl = createMiddleware(routing);

const authMiddleware = withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return intl(req);
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

export default function proxy(req: NextRequestWithAuth) {
  return authMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!login|registracija|oauth|api/auth|api/registracija|api/oauth|api/javno|api/provjeri-pseudonim|api/m|_next/static|_next/image|favicon.ico|kolo-logo.png|kolo-icon.png|kolo-hero-logo.png|flags).*)",
  ],
};
