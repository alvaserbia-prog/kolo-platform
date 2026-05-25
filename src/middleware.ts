import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Kada je MAINTENANCE_MODE uključen (postavlja se ISKLJUČIVO na produkcijskom
// okruženju, ne na testu), putanje za ulazak u nalog (vidi matcher dole) se
// preusmeravaju na /uskoro. Javne stranice ostaju dostupne.
export function middleware(req: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "true") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/uskoro";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/login",
    "/registracija",
    "/zaboravljena-lozinka",
    "/reset-lozinka",
    "/oauth/dovrsi",
  ],
};
