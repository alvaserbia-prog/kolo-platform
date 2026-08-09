// Zaseban modul (bez "use client") da bi server stranica mogla da uveze niz
// kao pravu vrednost — uvoz iz client fajla u produkcijskom SSR build-u daje
// client-reference proxy, pa ADMIN_TABOVI.includes puca.
// „nadzor" = automat (RizikNalaz, noćni radnik). „odluke" = ljudska prijava —
// nadzorni predmeti koje su otvorili nadzornici (dokaz stvarnosti 4.2.0, čl. 11a).
// Dva različita posla, namerno dva taba.
export const ADMIN_TABOVI = ["dashboard", "programi", "ped", "pokrovitelji", "donacije", "prigovori", "korisnici", "pijaca", "emisija", "osnivaci", "vesti", "obavestenja", "audit", "aktivnost", "levak", "nadzor", "odluke"] as const;
export type Tab = (typeof ADMIN_TABOVI)[number];
