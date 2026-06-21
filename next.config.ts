import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Host Cloudflare R2 javnog bazena — slike oglasa/avatari. Parsira se iz env-a na
// build-u (na Vercel-u je postavljen; lokalno može faliti → ostaje prazno). Bez
// ovoga Next image optimizacija ne sme da povuče sliku sa R2 (ni preko 308 sa
// `/api/pijaca/slika/...`) pa je ranije korišćen `unoptimized`.
const r2Host = (() => {
  try {
    return process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs"],
  images: {
    remotePatterns: r2Host ? [{ protocol: "https", hostname: r2Host }] : [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default withNextIntl(nextConfig);
