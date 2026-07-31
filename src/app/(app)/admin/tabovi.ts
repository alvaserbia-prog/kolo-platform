// Zaseban modul (bez "use client") da bi server stranica mogla da uveze niz
// kao pravu vrednost — uvoz iz client fajla u produkcijskom SSR build-u daje
// client-reference proxy, pa ADMIN_TABOVI.includes puca.
export const ADMIN_TABOVI = ["dashboard", "programi", "ped", "pokrovitelji", "donacije", "prigovori", "korisnici", "emisija", "osnivaci", "vesti", "audit", "nadzor"] as const;
export type Tab = (typeof ADMIN_TABOVI)[number];
