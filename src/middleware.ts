import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Pokrij sve rute osim API-ja, Next.js internih puteva i statičnih fajlova
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
