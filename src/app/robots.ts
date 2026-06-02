import type { MetadataRoute } from "next";
import { SITE_URL, IS_PRODUCTION, absoluteUrl } from "@/lib/seo";

/**
 * robots.txt.
 *  - PRODUKCIJA (ekolo.rs): dozvoli indeksiranje javnog sadržaja, zabrani
 *    privatne/API rute, uputi na sitemap.
 *  - TEST/PREVIEW (*.vercel.app): zabrani sve — sprečava duplikat sadržaja.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/dashboard",
        "/novcanik",
        "/profil",
        "/poruke",
        "/nadzor",
        "/verifikacija",
        "/oauth",
        "/login",
        "/registracija",
        "/zaboravljena-lozinka",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
