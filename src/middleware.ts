import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin rute — samo ADMIN uloga
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Javne rute — ne zahtevaju prijavu
        const javneRute = ["/", "/pijaca", "/kako-funkcionise", "/uslovi", "/privatnost"];
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
    "/((?!login|registracija|api/auth|api/registracija|api/javno|api/provjeri-pseudonim|_next/static|_next/image|favicon.ico|kolo-logo.png|kolo-icon.png|kolo-hero-logo.png).*)",
  ],
};
