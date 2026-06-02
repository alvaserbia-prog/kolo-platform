import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Javne stranice za sitemap. Autentifikovane (app) i API rute se NE navode —
 * one nisu za indeksiranje. `priority` je relativan unutar samog sajta.
 */
const JAVNE_PUTANJE: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/kako-funkcionise", priority: 0.9, changeFrequency: "monthly" },
  { path: "/o-sistemu", priority: 0.8, changeFrequency: "monthly" },
  { path: "/o-nama", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cesto-postavljena-pitanja", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pijaca", priority: 0.7, changeFrequency: "daily" },
  { path: "/pokrovitelji", priority: 0.6, changeFrequency: "monthly" },
  { path: "/zajednicko-dobro", priority: 0.6, changeFrequency: "monthly" },
  { path: "/osnivacki-doprinos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/whitepaper", priority: 0.5, changeFrequency: "yearly" },
  { path: "/pravilnik", priority: 0.5, changeFrequency: "monthly" },
  { path: "/statut", priority: 0.4, changeFrequency: "yearly" },
  { path: "/uslovi", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privatnost", priority: 0.4, changeFrequency: "yearly" },
  { path: "/dpia", priority: 0.3, changeFrequency: "yearly" },
  { path: "/radnje-obrade", priority: 0.3, changeFrequency: "yearly" },
  { path: "/rizici", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return JAVNE_PUTANJE.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  }));
}
