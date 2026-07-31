// Zaseban modul (bez "use client") da bi server stranica mogla da uveze niz
// kao pravu vrednost — uvoz iz client fajla u produkcijskom SSR build-u daje
// client-reference proxy, pa KRUG_TABOVI.includes puca.
export const KRUG_TABOVI = ["info", "clanovi", "projekti", "pristupnice"] as const;
export type Tab = (typeof KRUG_TABOVI)[number];
