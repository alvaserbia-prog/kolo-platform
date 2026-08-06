import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { jeAdmin } from "@/lib/dozvole";

const JAVNE_RUTE = [
  "/", "/pijaca", "/kako-funkcionise", "/uslovi",
  "/privatnost", "/m", "/politika-prihvati", "/pokrovitelji", "/o-nama", "/o-sistemu",
  "/cesto-postavljena-pitanja", "/pravilnik", "/statut", "/uskoro", "/odrzavanje",
  "/whitepaper", "/dpia", "/radnje-obrade", "/rizici", "/osnivacki-doprinos", "/zajednicko-dobro",
];

const ZAKLJUCANE_ULAZNE_RUTE = [
  "/login", "/registracija", "/oauth",
  "/zaboravljena-lozinka", "/reset-lozinka",
];

/**
 * Prekidač za PLANIRANO održavanje. Uključuje se env varijablom `ODRZAVANJE=1`
 * (Vercel → Environment Variables, scope Production) + redeploy — env se
 * primenjuje tek na sledeći build.
 *
 * Namerno je env varijabla, a NE zapis u bazi: održavanje se najčešće uključuje
 * upravo zbog radova na bazi, pa prekidač ne sme da zavisi od nje.
 *
 * Za NEPLANIRAN pad ovo se ne dira — tada nastupa `app/global-error.tsx`.
 */
const ODRZAVANJE_UKLJUCENO = process.env.ODRZAVANJE === "1";

const PRESKOCI = [
  "/login", "/registracija", "/oauth",
  "/zaboravljena-lozinka", "/reset-lozinka",
  "/api/", "/_next", "/favicon.ico", "/icon.png",
  "/kolo-logo.png", "/kolo-icon.png", "/kolo-hero-logo.png", "/nikola-saric.png", "/nikola-saric-mantil.png", "/flags/",
  // SEO/metadata rute — moraju biti javno dostupne pretraživačima (inače bi
  // bot pri pristupu /sitemap.xml ili /robots.txt bio preusmeren na /login).
  "/sitemap.xml", "/robots.txt", "/opengraph-image", "/twitter-image", "/manifest.webmanifest",
];

/**
 * Vraća odgovor za režim održavanja, ili `null` ako zahtev treba pustiti dalje.
 *
 * Šta NE zaključava:
 * - `/api/*`, `_next/*` i statičke fajlove — isključeni su na nivou `matcher`-a,
 *   pa cron rute (noćna emisija, istek table jemstva) rade i tokom održavanja,
 *   a sam ekran može da učita logo i CSS;
 * - admine (UO) — inače vlasnik ne bi mogao da proveri sajt dok traju radovi.
 *   Provera ide preko JWT-a (`getToken`), bez upita u bazu, pa važi i kad je
 *   baza ta koja je nedostupna;
 * - `/login` i `/oauth` — bez njih bi admin koji NIJE već prijavljen ostao
 *   zaključan napolju čim uključi održavanje, jer se obilaznica oslanja na
 *   postojeći kolačić sesije. Običan korisnik se sme prijaviti, ali ga posle
 *   prijave svejedno dočeka ekran održavanja.
 *
 * ⚠️ Odgovor je HTTP 200, ne 503: `NextResponse.rewrite` preuzima status
 * odredišne rute i ne može ga nadjačati. Zato stranica nosi `noindex`
 * (metadata + `X-Robots-Tag`), da privremeni ekran ne uđe u indeks umesto
 * pravog sadržaja. `Retry-After` ostaje kao signal keševima i botovima.
 */
async function odrzavanjeOdgovor(req: NextRequest, pathname: string) {
  const propusti =
    pathname === "/odrzavanje" ||
    pathname === "/login" ||
    pathname.startsWith("/oauth");
  if (propusti) return null;

  // Ako čitanje tokena pukne (npr. nedostaje `NEXTAUTH_SECRET`), NE puštamo
  // grešku iz middleware-a — ona bi oborila SVAKI zahtev i umesto lepog ekrana
  // dala Vercel-ovu stranicu greške. Neuspela provera znači „nije admin".
  let token = null;
  try {
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  } catch (greska) {
    console.error("[odrzavanje] provera admina neuspela", greska);
  }
  if (jeAdmin({ admin: token?.admin as string | undefined })) return null;

  const url = req.nextUrl.clone();
  url.pathname = "/odrzavanje";
  url.search = "";
  const odgovor = NextResponse.rewrite(url);
  odgovor.headers.set("Retry-After", "3600");
  odgovor.headers.set("Cache-Control", "no-store");
  odgovor.headers.set("X-Robots-Tag", "noindex");
  return odgovor;
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ODRZAVANJE_UKLJUCENO) {
    const odgovor = await odrzavanjeOdgovor(req, pathname);
    if (odgovor) return odgovor;
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

  // Nedovršena OAuth registracija (nalog još ne postoji u bazi, nema token.id):
  // pusti samo na /oauth/dovrsi (već u PRESKOCI), sve ostalo preusmeri tamo dok
  // korisnik ne izabere pseudonim. Sprečava da sesija bez id-a odluta na stranice
  // koje očekuju validan nalog.
  if (token.oauthPending) {
    return NextResponse.redirect(new URL("/oauth/dovrsi", req.url));
  }

  // Fallback na POCETNI tip za stare JWT-ove (pre uvođenja `admin` polja);
  // ukloniti u koraku 7 kad svi tokeni nose `admin`.
  const adminPristup =
    jeAdmin({ admin: token.admin as string | undefined }) ||
    token.tipKorisnika === "POCETNI";
  if (pathname.startsWith("/admin") && !adminPristup) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Isključi iz proxy-ja sve što on ionako samo propušta (NextResponse.next):
  // API rute, Next interne fajlove, statičke medije (png/svg/woff…) i SEO/metadata
  // rute (manifest/robots/sitemap/og-image). Ranije ih je matcher hvatao, pa ih je
  // funkcija kratko-spajala kroz PRESKOCI — ali se PRE toga IZVRŠAVALA i trošila
  // Fluid Active CPU (proxy je bio najveći potrošač: /api/pijaca/slika/… i
  // /manifest.webmanifest su nepotrebno išli kroz runtime). Isključenjem na nivou
  // matchera funkcija se za njih UOPŠTE ne poziva. Bezbedno: auth na /api rutama je
  // u samim handlerima, ne u proxy-ju (proxy je za /api ionako vraćao next()).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|opengraph-image|twitter-image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2)$).*)",
  ],
};
